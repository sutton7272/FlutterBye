import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTokenSchema, insertAirdropSignupSchema, insertTransactionSchema, insertMarketListingSchema, insertRedemptionSchema, insertEscrowWalletSchema, insertAdminUserSchema, insertAdminLogSchema, insertAnalyticsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByWallet(userData.walletAddress);
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid user data" });
    }
  });

  app.get("/api/users/:walletAddress", async (req, res) => {
    try {
      const user = await storage.getUserByWallet(req.params.walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Airdrop signup routes
  app.post("/api/airdrop/signup", async (req, res) => {
    try {
      const signupData = insertAirdropSignupSchema.parse(req.body);
      const signup = await storage.createAirdropSignup(signupData);
      res.json(signup);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid signup data" });
    }
  });

  app.get("/api/airdrop/signups", async (req, res) => {
    try {
      const signups = await storage.getAirdropSignups();
      res.json(signups);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Token routes
  app.post("/api/tokens", async (req, res) => {
    try {
      const tokenData = insertTokenSchema.parse(req.body);
      
      // Validate message length
      if (tokenData.message.length > 27) {
        return res.status(400).json({ message: "Message must be 27 characters or less" });
      }
      
      // Set FlBY-MSG as default symbol
      tokenData.symbol = "FlBY-MSG";
      
      // Handle image upload if provided
      if (tokenData.imageFile) {
        // In a real implementation, you would save the image to a file storage service
        // For now, we'll just store the base64 data as the imageUrl
        const imageUrl = `data:image/png;base64,${tokenData.imageFile}`;
        tokenData.imageUrl = imageUrl;
      }
      
      // Remove imageFile from the data before saving
      const { imageFile, ...finalTokenData } = tokenData;
      
      const token = await storage.createToken(finalTokenData);
      res.json(token);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid token data" });
    }
  });

  app.get("/api/tokens", async (req, res) => {
    try {
      const { limit = "50", offset = "0", search, creator } = req.query;
      
      let tokens;
      if (search) {
        tokens = await storage.searchTokens(search as string);
      } else if (creator) {
        tokens = await storage.getTokensByCreator(creator as string);
      } else {
        tokens = await storage.getAllTokens(parseInt(limit as string), parseInt(offset as string));
      }
      
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/tokens/:id", async (req, res) => {
    try {
      const token = await storage.getToken(req.params.id);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }
      res.json(token);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Token holdings routes
  app.get("/api/users/:userId/holdings", async (req, res) => {
    try {
      const holdings = await storage.getUserHoldings(req.params.userId);
      res.json(holdings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Transaction routes
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid transaction data" });
    }
  });

  app.get("/api/users/:userId/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByUser(req.params.userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/transactions/:id/status", async (req, res) => {
    try {
      const { status, signature } = req.body;
      const transaction = await storage.updateTransactionStatus(req.params.id, status, signature);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid status update" });
    }
  });

  // Market listing routes
  app.post("/api/market/listings", async (req, res) => {
    try {
      const listingData = insertMarketListingSchema.parse(req.body);
      const listing = await storage.createMarketListing(listingData);
      res.json(listing);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid listing data" });
    }
  });

  app.get("/api/market/listings", async (req, res) => {
    try {
      const { tokenId, active } = req.query;
      
      let listings;
      if (active === "true") {
        listings = await storage.getActiveListings();
      } else {
        listings = await storage.getMarketListings(tokenId as string);
      }
      
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Wallet validation endpoint
  app.post("/api/validate-wallets", async (req, res) => {
    try {
      const { wallets } = req.body;
      
      if (!Array.isArray(wallets)) {
        return res.status(400).json({ message: "Wallets must be an array" });
      }
      
      // Simple validation - in production, would validate Solana address format
      const validWallets = wallets.filter((wallet: string) => 
        typeof wallet === "string" && wallet.length >= 32 && wallet.length <= 44
      );
      
      res.json({ 
        valid: validWallets,
        invalid: wallets.filter((w: string) => !validWallets.includes(w)),
        total: wallets.length,
        validCount: validWallets.length
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Image upload endpoint
  app.post("/api/upload-image", async (req, res) => {
    try {
      const { imageData, tokenId } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ message: "Image data is required" });
      }
      
      // In a real implementation, you would:
      // 1. Validate image format and size
      // 2. Upload to cloud storage (AWS S3, Cloudinary, etc.)
      // 3. Return the public URL
      
      // For now, return a mock URL based on the image data
      const imageUrl = `data:image/png;base64,${imageData}`;
      
      res.json({ 
        imageUrl,
        message: "Image uploaded successfully" 
      });
    } catch (error) {
      res.status(500).json({ message: "Image upload failed" });
    }
  });

  // ============ PHASE 2: NEW API ROUTES ============

  // Token value and escrow routes
  app.patch("/api/tokens/:tokenId/escrow", async (req, res) => {
    try {
      const { tokenId } = req.params;
      const { status, escrowWallet } = req.body;
      
      const token = await storage.updateTokenEscrowStatus(tokenId, status, escrowWallet);
      res.json(token);
    } catch (error) {
      res.status(500).json({ message: "Failed to update escrow status" });
    }
  });

  app.get("/api/tokens/with-value", async (req, res) => {
    try {
      const tokens = await storage.getTokensWithValue();
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tokens with value" });
    }
  });

  app.get("/api/tokens/public", async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const tokens = await storage.getPublicTokens(Number(limit), Number(offset));
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch public tokens" });
    }
  });

  // Redemption routes
  app.post("/api/redemptions", async (req, res) => {
    try {
      const redemptionData = insertRedemptionSchema.parse(req.body);
      const redemption = await storage.createRedemption(redemptionData);
      res.json(redemption);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid redemption data" });
    }
  });

  app.get("/api/redemptions/:id", async (req, res) => {
    try {
      const redemption = await storage.getRedemption(req.params.id);
      if (!redemption) {
        return res.status(404).json({ message: "Redemption not found" });
      }
      res.json(redemption);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:userId/redemptions", async (req, res) => {
    try {
      const redemptions = await storage.getUserRedemptions(req.params.userId);
      res.json(redemptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user redemptions" });
    }
  });

  app.patch("/api/redemptions/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, signature } = req.body;
      
      const redemption = await storage.updateRedemptionStatus(id, status, signature);
      res.json(redemption);
    } catch (error) {
      res.status(500).json({ message: "Failed to update redemption status" });
    }
  });

  app.get("/api/tokens/:tokenId/redemptions", async (req, res) => {
    try {
      const redemptions = await storage.getRedemptionsByToken(req.params.tokenId);
      res.json(redemptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch token redemptions" });
    }
  });

  // Escrow wallet routes
  app.post("/api/escrow-wallets", async (req, res) => {
    try {
      const walletData = insertEscrowWalletSchema.parse(req.body);
      const wallet = await storage.createEscrowWallet(walletData);
      res.json(wallet);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid wallet data" });
    }
  });

  app.get("/api/escrow-wallets/active", async (req, res) => {
    try {
      const wallet = await storage.getActiveEscrowWallet();
      if (!wallet) {
        return res.status(404).json({ message: "No active escrow wallet found" });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active escrow wallet" });
    }
  });

  app.patch("/api/escrow-wallets/:id/balance", async (req, res) => {
    try {
      const { id } = req.params;
      const { balance } = req.body;
      
      const wallet = await storage.updateEscrowBalance(id, balance);
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to update escrow balance" });
    }
  });

  // Admin routes
  app.post("/api/admin/users", async (req, res) => {
    try {
      const adminData = insertAdminUserSchema.parse(req.body);
      const admin = await storage.createAdminUser(adminData);
      res.json(admin);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid admin data" });
    }
  });

  app.get("/api/admin/users/:walletAddress", async (req, res) => {
    try {
      const admin = await storage.getAdminByWallet(req.params.walletAddress);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.json(admin);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/admin/users/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      const admin = await storage.updateAdminStatus(id, isActive);
      res.json(admin);
    } catch (error) {
      res.status(500).json({ message: "Failed to update admin status" });
    }
  });

  // Admin action routes
  app.post("/api/admin/tokens/:tokenId/flag", async (req, res) => {
    try {
      const { tokenId } = req.params;
      const { reason, adminId } = req.body;
      
      const token = await storage.flagToken(tokenId, reason, adminId);
      res.json(token);
    } catch (error) {
      res.status(500).json({ message: "Failed to flag token" });
    }
  });

  app.post("/api/admin/tokens/:tokenId/block", async (req, res) => {
    try {
      const { tokenId } = req.params;
      const { adminId } = req.body;
      
      const token = await storage.blockToken(tokenId, adminId);
      res.json(token);
    } catch (error) {
      res.status(500).json({ message: "Failed to block token" });
    }
  });

  app.get("/api/admin/logs", async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const logs = await storage.getAdminLogs(Number(limit), Number(offset));
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin logs" });
    }
  });

  // Analytics routes
  app.post("/api/analytics", async (req, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.createAnalyticsRecord(analyticsData);
      res.json(analytics);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid analytics data" });
    }
  });

  app.get("/api/analytics/:metric", async (req, res) => {
    try {
      const { metric } = req.params;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const analytics = await storage.getAnalyticsByMetric(metric, start, end);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
