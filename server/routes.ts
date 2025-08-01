import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTokenSchema, insertAirdropSignupSchema, insertTransactionSchema, insertMarketListingSchema, insertRedemptionSchema, insertEscrowWalletSchema, insertAdminUserSchema, insertAdminLogSchema, insertAnalyticsSchema } from "@shared/schema";
import { authenticateWallet, requireAdmin, requirePermission, requireSuperAdmin } from "./admin-middleware";
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
      
      // Validate whole number tokens
      if (!Number.isInteger(tokenData.totalSupply) || tokenData.totalSupply <= 0) {
        return res.status(400).json({ message: "Total supply must be a whole number greater than 0" });
      }
      
      if (!Number.isInteger(tokenData.availableSupply) || tokenData.availableSupply < 0) {
        return res.status(400).json({ message: "Available supply must be a whole number" });
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

  // ============ ADMIN PROTECTED ROUTES ============
  
  // Admin authentication check
  app.get("/api/admin/check", authenticateWallet, (req, res) => {
    res.json({
      isAdmin: req.user?.isAdmin || false,
      role: req.user?.role || 'user',
      permissions: req.user?.adminPermissions || []
    });
  });

  // Admin dashboard data (requires admin access)
  app.get("/api/admin/dashboard", authenticateWallet, requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      const recentActivity = await storage.getRecentAdminActivity();
      
      res.json({
        stats,
        recentActivity,
        adminInfo: {
          userId: req.user?.id,
          role: req.user?.role,
          permissions: req.user?.adminPermissions
        }
      });
    } catch (error) {
      console.error("Error fetching admin dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // User management (requires user management permission)
  app.get("/api/admin/users", authenticateWallet, requirePermission('users'), async (req, res) => {
    try {
      const users = await storage.getAllUsersForAdmin();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:userId/block", authenticateWallet, requirePermission('users'), async (req, res) => {
    try {
      const { userId } = req.params;
      const { blocked, reason } = req.body;
      
      await storage.updateUserBlockStatus(userId, blocked, reason);
      
      // Log the action
      await storage.createAdminLog({
        adminId: req.user!.id,
        action: blocked ? 'block_user' : 'unblock_user',
        targetUserId: userId,
        details: { reason },
        ipAddress: req.ip
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  // Wallet management (requires wallet_management permission)
  app.get("/api/admin/escrow-wallets", authenticateWallet, requirePermission('wallet_management'), async (req, res) => {
    try {
      const wallets = await storage.getEscrowWallets();
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch escrow wallets" });
    }
  });

  app.post("/api/admin/escrow-wallets", authenticateWallet, requirePermission('wallet_management'), async (req, res) => {
    try {
      const walletData = insertEscrowWalletSchema.parse(req.body);
      const wallet = await storage.createEscrowWallet(walletData);
      
      // Log wallet creation
      await storage.createAdminLog({
        adminId: req.user!.id,
        action: 'create_escrow_wallet',
        details: { walletAddress: wallet.walletAddress },
        ipAddress: req.ip
      });
      
      res.json(wallet);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid wallet data" });
    }
  });

  // Admin user management (requires super admin)
  app.get("/api/admin/admins", authenticateWallet, requireSuperAdmin, async (req, res) => {
    try {
      const admins = await storage.getAdminUsers();
      res.json(admins);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin users" });
    }
  });

  app.post("/api/admin/admins", authenticateWallet, requireSuperAdmin, async (req, res) => {
    try {
      const { walletAddress, permissions, role } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }

      const AdminService = (await import("./admin-service")).AdminService;
      const newAdmin = await AdminService.createAdmin(
        walletAddress,
        permissions || ['dashboard'],
        req.user!.id,
        role || 'admin'
      );
      
      res.json(newAdmin);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create admin" });
    }
  });

  app.delete("/api/admin/admins/:userId", authenticateWallet, requireSuperAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      
      const AdminService = (await import("./admin-service")).AdminService;
      await AdminService.removeAdmin(userId, req.user!.id);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to remove admin" });
    }
  });

  // System settings (requires settings permission)
  app.get("/api/admin/settings", authenticateWallet, requirePermission('settings'), async (req, res) => {
    try {
      const settings = await storage.getPlatformSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.patch("/api/admin/settings", authenticateWallet, requirePermission('settings'), async (req, res) => {
    try {
      const settings = await storage.updatePlatformSettings(req.body);
      
      // Log settings update
      await storage.createAdminLog({
        adminId: req.user!.id,
        action: 'update_settings',
        details: req.body,
        ipAddress: req.ip
      });
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Initialize super admin (one-time setup)
  app.post("/api/admin/initialize", async (req, res) => {
    try {
      const { walletAddress, initKey } = req.body;
      
      // Check initialization key (in production, use environment variable)
      if (initKey !== process.env.ADMIN_INIT_KEY && initKey !== "INIT_FLUTTERBYE_ADMIN_2025") {
        return res.status(401).json({ message: "Invalid initialization key" });
      }

      const AdminService = (await import("./admin-service")).AdminService;
      const superAdmin = await AdminService.initializeSuperAdmin(walletAddress);
      
      res.json({ 
        success: true, 
        message: "Super admin initialized successfully",
        adminId: superAdmin.id 
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Initialization failed" });
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

  // Free Flutterbye Code Routes
  app.get("/api/codes/free-flutterbye", async (req, res) => {
    try {
      // Mock data for demo - in real app would query database
      const mockCodes = [
        {
          id: "1",
          code: "FREE-ABC123",
          codeType: "free_flutterbye",
          isActive: true,
          maxUses: 1,
          currentUses: 0,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          code: "FREE-XYZ789",
          codeType: "free_flutterbye",
          isActive: true,
          maxUses: 5,
          currentUses: 2,
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        }
      ];
      res.json(mockCodes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch codes" });
    }
  });

  app.post("/api/codes/redeem", async (req, res) => {
    try {
      const { code, userId, codeType } = req.body;
      
      // Mock redemption logic
      if (code.startsWith("FREE-")) {
        const tokenId = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // In real app: verify code, check expiration, create token, update usage count
        const redemption = {
          id: `redemption_${Date.now()}`,
          codeId: "mock_code_id",
          userId,
          tokenId,
          redeemedAt: new Date().toISOString()
        };
        
        res.json({ success: true, tokenId, redemption });
      } else {
        res.status(400).json({ error: "Invalid redemption code" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to redeem code" });
    }
  });

  app.get("/api/codes/redemptions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Mock user redemptions
      const mockRedemptions = [
        {
          id: "1",
          codeId: "code1",
          userId,
          tokenId: "token_abc123",
          redeemedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      res.json(mockRedemptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch redemptions" });
    }
  });

  // Token holder analysis endpoint
  app.post("/api/tokens/analyze-holders", async (req, res) => {
    try {
      const { token, count } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Token address or symbol is required" });
      }

      // Mock token holder data - in real implementation would call Solana RPC/APIs
      const mockHolders = Array.from({ length: Math.min(count, 100) }, (_, i) => ({
        address: `${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 35)}`,
        balance: Math.floor(Math.random() * 1000000) + 1000,
        percentage: Math.random() * 10 + 0.1,
        rank: i + 1
      }));

      // Sort by balance descending
      mockHolders.sort((a, b) => b.balance - a.balance);
      
      // Recalculate percentages to be realistic
      const totalSupply = mockHolders.reduce((sum, holder) => sum + holder.balance, 0);
      mockHolders.forEach(holder => {
        holder.percentage = (holder.balance / totalSupply) * 100;
      });

      res.json(mockHolders);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze token holders" });
    }
  });

  // Import admin service
  const { adminService } = await import("./admin-service");

  // Enhanced Admin Dashboard Routes with Real Data
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await adminService.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await adminService.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/logs", async (req, res) => {
    try {
      const logs = await adminService.getAdminLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching admin logs:", error);
      res.status(500).json({ error: "Failed to fetch admin logs" });
    }
  });

  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await adminService.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", async (req, res) => {
    try {
      const newSettings = req.body;
      const adminId = req.headers.authorization || "admin-1"; // TODO: Get from auth
      const result = await adminService.updateSettings(newSettings, adminId);
      res.json(result);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.patch("/api/admin/users/:userId/block", async (req, res) => {
    try {
      const { userId } = req.params;
      const { blocked } = req.body;
      const adminId = req.headers.authorization || "admin-1"; // TODO: Get from auth
      const result = await adminService.toggleUserBlock(userId, blocked, adminId);
      res.json(result);
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  app.post("/api/admin/codes/generate", async (req, res) => {
    try {
      const { type, count } = req.body;
      const adminId = req.headers.authorization || "admin-1"; // TODO: Get from auth
      const result = await adminService.generateCodes(type, count, adminId);
      res.json(result);
    } catch (error) {
      console.error("Error generating codes:", error);
      res.status(500).json({ error: "Failed to generate codes" });
    }
  });

  app.post("/api/admin/export", async (req, res) => {
    try {
      const { dataType } = req.body;
      const adminId = req.headers.authorization || "admin-1"; // TODO: Get from auth
      const result = await adminService.exportData(dataType, adminId);
      res.json(result);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  // SMS-to-Blockchain Integration Routes
  const { smsService } = await import("./sms-service");
  const { rewardsService } = await import("./rewards-service");
  const { journeyService } = await import("./journey-service");

  // Webhook for incoming SMS messages (Twilio webhook)
  app.post("/api/sms/webhook", async (req, res) => {
    try {
      const { From, To, Body, MessageSid } = req.body;
      
      console.log(`Incoming SMS from ${From} to ${To}: ${Body}`);
      
      const smsMessage = await smsService.processIncomingSms(From, To, Body, MessageSid);
      
      // Award rewards for SMS action
      if (smsMessage && smsMessage.userId) {
        await rewardsService.processSmsAction(smsMessage.userId, smsMessage.id);
      }
      
      // Send TwiML response
      res.set('Content-Type', 'text/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Message>Your message has been minted as an emotional token! 🔗</Message>
        </Response>`);
    } catch (error) {
      console.error("Error processing SMS webhook:", error);
      res.status(500).send("Error processing message");
    }
  });

  // Register phone number with wallet
  app.post("/api/sms/register", async (req, res) => {
    try {
      const { phoneNumber, walletAddress } = req.body;
      
      if (!phoneNumber || !walletAddress) {
        return res.status(400).json({ error: "Phone number and wallet address required" });
      }
      
      const mapping = await smsService.registerPhoneWallet(phoneNumber, walletAddress);
      res.json({ success: true, verificationRequired: true });
    } catch (error) {
      console.error("Error registering phone wallet:", error);
      res.status(500).json({ error: "Failed to register phone number" });
    }
  });

  // Verify phone number with code
  app.post("/api/sms/verify", async (req, res) => {
    try {
      const { phoneNumber, verificationCode } = req.body;
      
      if (!phoneNumber || !verificationCode) {
        return res.status(400).json({ error: "Phone number and verification code required" });
      }
      
      const result = await smsService.verifyPhone(phoneNumber, verificationCode);
      
      // Award rewards for successful phone verification
      if (result.success) {
        // TODO: Get actual user ID from authentication
        const userId = "user-1"; // Mock user ID for now
        await rewardsService.processPhoneRegistrationAction(userId);
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error verifying phone:", error);
      res.status(400).json({ error: error.message || "Failed to verify phone number" });
    }
  });

  // Handle token interactions (burn to read, reply, etc.)
  app.post("/api/tokens/:tokenId/interact", async (req, res) => {
    try {
      const { tokenId } = req.params;
      const { interactionType, data } = req.body;
      const userId = req.headers.authorization || "user-1"; // TODO: Get from auth
      
      const interaction = await smsService.handleTokenInteraction(tokenId, userId, interactionType, data);
      res.json({ success: true, interaction });
    } catch (error) {
      console.error("Error handling token interaction:", error);
      res.status(500).json({ error: "Failed to process interaction" });
    }
  });

  // Get SMS analytics for admin
  app.get("/api/admin/sms/analytics", async (req, res) => {
    try {
      const analytics = await smsService.getSmsAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching SMS analytics:", error);
      res.status(500).json({ error: "Failed to fetch SMS analytics" });
    }
  });

  // Send test SMS (for development)
  app.post("/api/sms/test", async (req, res) => {
    try {
      const { fromPhone, toPhone, message } = req.body;
      
      const smsMessage = await smsService.processIncomingSms(
        fromPhone || "+1234567890",
        toPhone || "+1987654321", 
        message || "Test emotional message 💕"
      );
      
      res.json({ success: true, smsMessage });
    } catch (error) {
      console.error("Error sending test SMS:", error);
      res.status(500).json({ error: "Failed to send test SMS" });
    }
  });

  // Gamified Rewards System Routes
  
  // Initialize user rewards profile
  app.post("/api/rewards/initialize/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userReward = await rewardsService.initializeUserRewards(userId);
      res.json(userReward);
    } catch (error) {
      console.error("Error initializing user rewards:", error);
      res.status(500).json({ error: "Failed to initialize user rewards" });
    }
  });

  // Get user rewards profile
  app.get("/api/rewards/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userReward = await rewardsService.getUserRewards(userId);
      if (!userReward) {
        return res.status(404).json({ error: "User rewards not found" });
      }
      res.json(userReward);
    } catch (error) {
      console.error("Error fetching user rewards:", error);
      res.status(500).json({ error: "Failed to fetch user rewards" });
    }
  });

  // Get user badges
  app.get("/api/rewards/user/:userId/badges", async (req, res) => {
    try {
      const { userId } = req.params;
      const badges = await rewardsService.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ error: "Failed to fetch user badges" });
    }
  });

  // Get user transaction history
  app.get("/api/rewards/user/:userId/transactions", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await rewardsService.getUserTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      res.status(500).json({ error: "Failed to fetch user transactions" });
    }
  });

  // Get leaderboard
  app.get("/api/rewards/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await rewardsService.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Get active daily challenges
  app.get("/api/rewards/challenges", async (req, res) => {
    try {
      const challenges = await rewardsService.getActiveDailyChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching daily challenges:", error);
      res.status(500).json({ error: "Failed to fetch daily challenges" });
    }
  });

  // Get user challenge progress
  app.get("/api/rewards/user/:userId/challenges", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await rewardsService.getUserChallengeProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user challenge progress:", error);
      res.status(500).json({ error: "Failed to fetch user challenge progress" });
    }
  });

  // Process daily login
  app.post("/api/rewards/user/:userId/login", async (req, res) => {
    try {
      const { userId } = req.params;
      await rewardsService.processDailyLoginAction(userId);
      res.json({ success: true, message: "Daily login processed" });
    } catch (error) {
      console.error("Error processing daily login:", error);
      res.status(500).json({ error: "Failed to process daily login" });
    }
  });

  // Blockchain Journey Dashboard Routes
  
  // Get user's complete journey dashboard
  app.get("/api/journey/dashboard/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const dashboard = await journeyService.getUserJourneyDashboard(userId);
      res.json(dashboard);
    } catch (error) {
      console.error("Error fetching journey dashboard:", error);
      res.status(500).json({ error: "Failed to fetch journey dashboard" });
    }
  });

  // Get user preferences
  app.get("/api/journey/preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const preferences = await journeyService.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ error: "Failed to fetch user preferences" });
    }
  });

  // Update user preferences
  app.patch("/api/journey/preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const preferences = await journeyService.updateUserPreferences(userId, updates);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ error: "Failed to update user preferences" });
    }
  });

  // Mark insight as read
  app.patch("/api/journey/insights/:insightId/read", async (req, res) => {
    try {
      const { insightId } = req.params;
      const { userId } = req.body;
      await journeyService.markInsightAsRead(userId, insightId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking insight as read:", error);
      res.status(500).json({ error: "Failed to mark insight as read" });
    }
  });

  // Generate personalized insights
  app.post("/api/journey/insights/:userId/generate", async (req, res) => {
    try {
      const { userId } = req.params;
      await journeyService.generatePersonalizedInsights(userId);
      res.json({ success: true, message: "Insights generated successfully" });
    } catch (error) {
      console.error("Error generating insights:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
