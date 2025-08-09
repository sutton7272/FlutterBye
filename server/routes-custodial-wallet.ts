import type { Express } from "express";
import { randomUUID } from "crypto";
import { z } from "zod";
import type { IStorage } from "./storage";
import { secureWalletService } from "./secure-wallet-service";
import type { 
  InsertValueAttachment,
  InsertCustodialWalletTransaction,
  InsertWalletSecurityLog 
} from "@shared/schema";

/**
 * Secure Custodial Wallet API Routes
 * Production-ready wallet infrastructure for user value attachment
 */
export function registerCustodialWalletRoutes(app: Express, storage: IStorage) {

  // Wallet Balance Operations
  app.get("/api/custodial-wallet/balance/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const balances = await storage.getAllUserWalletBalances(userId);
      
      const walletData = balances.map(balance => ({
        currency: balance.currency,
        availableBalance: balance.availableBalance,
        pendingBalance: balance.pendingBalance,
        reservedBalance: balance.reservedBalance,
        totalDeposited: balance.totalDeposited,
        totalWithdrawn: balance.totalWithdrawn,
        totalFeesEarned: balance.totalFeesEarned,
        lastActivity: balance.lastActivity
      }));

      res.json({
        success: true,
        wallets: walletData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch wallet balances" 
      });
    }
  });

  // Deposit Funds to Custodial Wallet
  app.post("/api/custodial-wallet/deposit", async (req, res) => {
    try {
      const schema = z.object({
        userId: z.string(),
        currency: z.enum(["SOL", "USDC", "FLBY"]),
        amount: z.string(),
        fromAddress: z.string(),
        transactionHash: z.string().optional()
      });

      const { userId, currency, amount, fromAddress, transactionHash } = schema.parse(req.body);

      // Security logging
      await storage.createSecurityLog({
        userId,
        eventType: "deposit_request",
        severity: "low",
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || null,
        details: { currency, amount, fromAddress }
      });

      // Get or create user wallet balance
      let userBalance = await storage.getUserWalletBalance(userId, currency);
      if (!userBalance) {
        userBalance = await storage.createUserWalletBalance({
          userId,
          currency,
          availableBalance: "0",
          pendingBalance: amount,
          reservedBalance: "0",
          totalDeposited: amount,
          totalWithdrawn: "0",
          totalFeesEarned: "0"
        });
      } else {
        // Update pending balance while confirmation is processing
        const newPendingBalance = (parseFloat(userBalance.pendingBalance) + parseFloat(amount)).toString();
        userBalance = await storage.updateUserWalletBalance(userId, currency, {
          pendingBalance: newPendingBalance
        });
      }

      // Create transaction record
      const transaction = await storage.createCustodialWalletTransaction({
        userId,
        transactionType: "deposit",
        amount,
        currency,
        fromAddress,
        toAddress: null,
        transactionHash: transactionHash || null,
        status: "pending",
        confirmations: 0,
        feeAmount: "0",
        feeCurrency: "FLBY",
        metadata: { depositInitiated: new Date().toISOString() }
      });

      res.json({
        success: true,
        message: "Deposit initiated",
        transactionId: transaction.id,
        status: "pending",
        userBalance: {
          availableBalance: userBalance.availableBalance,
          pendingBalance: userBalance.pendingBalance
        }
      });

    } catch (error) {
      console.error("Deposit error:", error);
      res.status(400).json({ 
        success: false, 
        error: error.message || "Failed to process deposit" 
      });
    }
  });

  // Attach Value to Product
  app.post("/api/custodial-wallet/attach-value", async (req, res) => {
    try {
      const schema = z.object({
        userId: z.string(),
        productId: z.string(),
        productType: z.enum(["message", "token", "nft", "campaign"]),
        amount: z.string(),
        currency: z.enum(["SOL", "USDC", "FLBY"]),
        recipientAddress: z.string().optional(),
        recipientUserId: z.string().optional(),
        expiresAt: z.string().optional(), // ISO date string
        message: z.string().optional()
      });

      const data = schema.parse(req.body);

      // Check user has sufficient balance
      const userBalance = await storage.getUserWalletBalance(data.userId, data.currency);
      if (!userBalance || parseFloat(userBalance.availableBalance) < parseFloat(data.amount)) {
        return res.status(400).json({
          success: false,
          error: "Insufficient balance"
        });
      }

      // Generate redemption code
      const redemptionCode = secureWalletService.generateRedemptionCode();

      // Calculate fees
      const { feeAmount, feeCurrency } = secureWalletService.calculateTransactionFee(
        parseFloat(data.amount),
        data.currency
      );

      // Create value attachment
      const attachment = await storage.createValueAttachment({
        userId: data.userId,
        productId: data.productId,
        productType: data.productType,
        amount: data.amount,
        currency: data.currency,
        recipientAddress: data.recipientAddress || null,
        recipientUserId: data.recipientUserId || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        message: data.message || null,
        status: "active",
        redemptionCode,
        redeemedAt: null,
        redeemedBy: null,
        transactionHash: null,
        feeAmount: feeAmount.toString(),
        feeCurrency
      });

      // Update user balance (move from available to reserved)
      const newAvailableBalance = (parseFloat(userBalance.availableBalance) - parseFloat(data.amount)).toString();
      const newReservedBalance = (parseFloat(userBalance.reservedBalance) + parseFloat(data.amount)).toString();

      await storage.updateUserWalletBalance(data.userId, data.currency, {
        availableBalance: newAvailableBalance,
        reservedBalance: newReservedBalance
      });

      // Create transaction record
      await storage.createCustodialWalletTransaction({
        userId: data.userId,
        transactionType: "value_attach",
        amount: data.amount,
        currency: data.currency,
        fromAddress: null,
        toAddress: null,
        transactionHash: null,
        status: "confirmed",
        confirmations: 1,
        feeAmount: feeAmount.toString(),
        feeCurrency,
        metadata: {
          productId: data.productId,
          productType: data.productType,
          redemptionCode,
          attachmentId: attachment.id
        }
      });

      res.json({
        success: true,
        message: "Value attached to product",
        attachment: {
          id: attachment.id,
          redemptionCode,
          amount: attachment.amount,
          currency: attachment.currency,
          expiresAt: attachment.expiresAt,
          status: attachment.status
        }
      });

    } catch (error) {
      console.error("Value attachment error:", error);
      res.status(400).json({ 
        success: false, 
        error: error.message || "Failed to attach value" 
      });
    }
  });

  // Redeem Value from Product
  app.post("/api/custodial-wallet/redeem", async (req, res) => {
    try {
      const schema = z.object({
        redemptionCode: z.string(),
        recipientUserId: z.string(),
        recipientAddress: z.string()
      });

      const { redemptionCode, recipientUserId, recipientAddress } = schema.parse(req.body);

      // Find the value attachment
      const attachment = await storage.getValueAttachmentByCode(redemptionCode);
      if (!attachment) {
        return res.status(404).json({
          success: false,
          error: "Invalid redemption code"
        });
      }

      if (attachment.status !== "active") {
        return res.status(400).json({
          success: false,
          error: "Value already redeemed or expired"
        });
      }

      // Check expiration
      if (attachment.expiresAt && new Date() > attachment.expiresAt) {
        await storage.updateValueAttachmentStatus(attachment.id, "expired");
        return res.status(400).json({
          success: false,
          error: "Redemption code has expired"
        });
      }

      // Check recipient authorization
      if (attachment.recipientUserId && attachment.recipientUserId !== recipientUserId) {
        return res.status(403).json({
          success: false,
          error: "Not authorized to redeem this value"
        });
      }

      // Compliance check for large redemptions
      const complianceResult = await secureWalletService.performComplianceCheck(
        recipientUserId,
        parseFloat(attachment.amount),
        recipientAddress
      );

      if (!complianceResult.approved) {
        await storage.createSecurityLog({
          userId: recipientUserId,
          eventType: "compliance_violation",
          severity: "high",
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] || null,
          details: {
            redemptionCode,
            amount: attachment.amount,
            flaggedReason: complianceResult.flaggedReason
          }
        });

        return res.status(403).json({
          success: false,
          error: "Redemption blocked by compliance check"
        });
      }

      // Get custodial wallet for the currency
      const custodialWallets = await storage.getCustodialWalletsByCurrency(attachment.currency);
      const custodialWallet = custodialWallets.find(w => w.status === "active");
      
      if (!custodialWallet) {
        return res.status(500).json({
          success: false,
          error: "Custodial wallet not available"
        });
      }

      // Transfer funds from custodial wallet to recipient
      const transferResult = await secureWalletService.transferFromCustodialWallet(
        custodialWallet,
        recipientAddress,
        parseFloat(attachment.amount),
        attachment.currency
      );

      if (!transferResult.success) {
        return res.status(500).json({
          success: false,
          error: transferResult.error || "Transfer failed"
        });
      }

      // Update attachment as redeemed
      const redeemedAttachment = await storage.redeemValueAttachment(attachment.id, recipientUserId);

      // Update original user's balance (remove from reserved)
      const originalUserBalance = await storage.getUserWalletBalance(attachment.userId, attachment.currency);
      if (originalUserBalance) {
        const newReservedBalance = (parseFloat(originalUserBalance.reservedBalance) - parseFloat(attachment.amount)).toString();
        const newTotalWithdrawn = (parseFloat(originalUserBalance.totalWithdrawn) + parseFloat(attachment.amount)).toString();

        await storage.updateUserWalletBalance(attachment.userId, attachment.currency, {
          reservedBalance: newReservedBalance,
          totalWithdrawn: newTotalWithdrawn
        });
      }

      // Create redemption transaction record
      await storage.createCustodialWalletTransaction({
        userId: recipientUserId,
        transactionType: "redemption",
        amount: attachment.amount,
        currency: attachment.currency,
        fromAddress: custodialWallet.walletAddress,
        toAddress: recipientAddress,
        transactionHash: transferResult.transactionHash || null,
        status: "confirmed",
        confirmations: 1,
        feeAmount: attachment.feeAmount,
        feeCurrency: attachment.feeCurrency,
        metadata: {
          redemptionCode,
          originalUserId: attachment.userId,
          productId: attachment.productId,
          attachmentId: attachment.id
        }
      });

      res.json({
        success: true,
        message: "Value redeemed successfully",
        redemption: {
          amount: attachment.amount,
          currency: attachment.currency,
          transactionHash: transferResult.transactionHash,
          redeemedAt: redeemedAttachment.redeemedAt
        }
      });

    } catch (error) {
      console.error("Redemption error:", error);
      res.status(400).json({ 
        success: false, 
        error: error.message || "Failed to redeem value" 
      });
    }
  });

  // Get User Value Attachments
  app.get("/api/custodial-wallet/attachments/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const attachments = await storage.getUserValueAttachments(userId);

      const attachmentData = attachments.map(attachment => ({
        id: attachment.id,
        productId: attachment.productId,
        productType: attachment.productType,
        amount: attachment.amount,
        currency: attachment.currency,
        status: attachment.status,
        redemptionCode: attachment.redemptionCode,
        message: attachment.message,
        expiresAt: attachment.expiresAt,
        createdAt: attachment.createdAt,
        redeemedAt: attachment.redeemedAt
      }));

      res.json({
        success: true,
        attachments: attachmentData
      });

    } catch (error) {
      console.error("Error fetching attachments:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch value attachments" 
      });
    }
  });

  // Get Transaction History
  app.get("/api/custodial-wallet/transactions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = "50" } = req.query;
      
      const transactions = await storage.getUserCustodialTransactions(userId, parseInt(limit as string));

      const transactionData = transactions.map(tx => ({
        id: tx.id,
        type: tx.transactionType,
        amount: tx.amount,
        currency: tx.currency,
        status: tx.status,
        transactionHash: tx.transactionHash,
        fromAddress: tx.fromAddress,
        toAddress: tx.toAddress,
        feeAmount: tx.feeAmount,
        feeCurrency: tx.feeCurrency,
        createdAt: tx.createdAt,
        processedAt: tx.processedAt,
        metadata: tx.metadata
      }));

      res.json({
        success: true,
        transactions: transactionData
      });

    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch transactions" 
      });
    }
  });

  // Wallet Health Check
  app.get("/api/custodial-wallet/health", async (req, res) => {
    try {
      const wallets = await storage.getAllCustodialWallets();
      const healthChecks = [];

      for (const wallet of wallets) {
        const health = await secureWalletService.performHealthCheck(wallet);
        healthChecks.push({
          walletId: wallet.id,
          currency: wallet.currency,
          address: wallet.walletAddress,
          isHealthy: health.isHealthy,
          currentBalance: health.currentBalance,
          issues: health.issues,
          status: wallet.status,
          lastHealthCheck: wallet.lastHealthCheck
        });
      }

      const overallHealth = healthChecks.every(check => check.isHealthy);

      res.json({
        success: true,
        overallHealth,
        wallets: healthChecks,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Health check error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to perform health check" 
      });
    }
  });

  // Admin: Get All Custodial Wallets
  app.get("/api/admin/custodial-wallet/wallets", async (req, res) => {
    try {
      const wallets = await storage.getAllCustodialWallets();
      
      const walletData = wallets.map(wallet => ({
        id: wallet.id,
        currency: wallet.currency,
        walletAddress: wallet.walletAddress,
        balance: wallet.balance,
        reservedBalance: wallet.reservedBalance,
        status: wallet.status,
        isHotWallet: wallet.isHotWallet,
        lastHealthCheck: wallet.lastHealthCheck,
        createdAt: wallet.createdAt
      }));

      res.json({
        success: true,
        wallets: walletData
      });

    } catch (error) {
      console.error("Error fetching admin wallets:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch custodial wallets" 
      });
    }
  });

  // Admin: Create New Custodial Wallet
  app.post("/api/admin/custodial-wallet/create", async (req, res) => {
    try {
      const schema = z.object({
        currency: z.enum(["SOL", "USDC", "FLBY"]),
        isHotWallet: z.boolean().default(true)
      });

      const { currency, isHotWallet } = schema.parse(req.body);

      // Create secure wallet
      const walletData = await secureWalletService.createSecureWallet(currency, isHotWallet);
      const wallet = await storage.createCustodialWallet(walletData);

      res.json({
        success: true,
        message: "Custodial wallet created successfully",
        wallet: {
          id: wallet.id,
          currency: wallet.currency,
          walletAddress: wallet.walletAddress,
          status: wallet.status,
          isHotWallet: wallet.isHotWallet
        }
      });

    } catch (error) {
      console.error("Error creating wallet:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to create custodial wallet" 
      });
    }
  });

  // Admin: Create Multiple Custodial Wallets
  app.post("/api/admin/custodial-wallet/create-multiple", async (req, res) => {
    try {
      const schema = z.object({
        currencies: z.array(z.enum(["SOL", "USDC", "FLBY"])).min(1),
        isHotWallet: z.boolean().default(true)
      });

      const { currencies, isHotWallet } = schema.parse(req.body);

      const createdWallets = [];
      const errors = [];

      // Create wallets for each currency
      for (const currency of currencies) {
        try {
          // Check if wallet already exists for this currency
          const existingWallets = await storage.getCustodialWalletsByCurrency(currency);
          if (existingWallets.length > 0) {
            errors.push({
              currency,
              error: `Custodial wallet for ${currency} already exists`
            });
            continue;
          }

          // Create secure wallet
          const walletData = await secureWalletService.createSecureWallet(currency, isHotWallet);
          const wallet = await storage.createCustodialWallet(walletData);
          
          createdWallets.push({
            id: wallet.id,
            currency: wallet.currency,
            walletAddress: wallet.walletAddress,
            status: wallet.status,
            isHotWallet: wallet.isHotWallet
          });
        } catch (error) {
          console.error(`Error creating ${currency} wallet:`, error);
          errors.push({
            currency,
            error: error.message || `Failed to create ${currency} wallet`
          });
        }
      }

      const response = {
        success: createdWallets.length > 0,
        message: `Created ${createdWallets.length} out of ${currencies.length} wallets`,
        created: createdWallets.length,
        wallets: createdWallets
      };

      if (errors.length > 0) {
        response.errors = errors;
      }

      res.status(createdWallets.length > 0 ? 200 : 400).json(response);

    } catch (error) {
      console.error("Error creating multiple wallets:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to create custodial wallets" 
      });
    }
  });

  // Admin: Get Security Logs
  app.get("/api/admin/custodial-wallet/security-logs", async (req, res) => {
    try {
      const { severity, limit = "100" } = req.query;
      
      const logs = await storage.getSecurityLogs(
        undefined, 
        severity as string, 
        parseInt(limit as string)
      );

      res.json({
        success: true,
        logs: logs.map(log => ({
          id: log.id,
          userId: log.userId,
          eventType: log.eventType,
          severity: log.severity,
          ipAddress: log.ipAddress,
          location: log.location,
          details: log.details,
          actionTaken: log.actionTaken,
          createdAt: log.createdAt,
          resolvedAt: log.resolvedAt
        }))
      });

    } catch (error) {
      console.error("Error fetching security logs:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch security logs" 
      });
    }
  });

  // Admin: Get Wallet Statistics
  app.get("/api/admin/custodial-wallet/statistics", async (req, res) => {
    try {
      const statistics = await secureWalletService.getWalletStatistics();
      
      res.json({
        success: true,
        statistics,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch wallet statistics" 
      });
    }
  });
}