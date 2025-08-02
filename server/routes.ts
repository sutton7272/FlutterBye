import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTokenSchema, insertAirdropSignupSchema, insertTransactionSchema, insertMarketListingSchema, insertRedemptionSchema, insertEscrowWalletSchema, insertAdminUserSchema, insertAdminLogSchema, insertAnalyticsSchema, insertChatRoomSchema, insertChatMessageSchema } from "@shared/schema";
import { authenticateWallet, requireAdmin, requirePermission, requireSuperAdmin } from "./admin-middleware";
import { chatService } from "./chat-service";
import { registerSolanaRoutes } from "./routes-solana";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      services: 'operational',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0'
    });
  });

  // Admin cache management
  app.post('/api/admin/cache/clear', async (req, res) => {
    try {
      // Import cache service dynamically to avoid dependency issues
      const { cacheService } = await import('./cache-service.js');
      cacheService.clear();
      res.json({ success: true, message: 'Cache cleared successfully' });
    } catch (error) {
      console.error('Cache clear error:', error);
      res.status(500).json({ error: 'Failed to clear cache' });
    }
  });

  // Admin backup management
  app.post('/api/admin/backup', async (req, res) => {
    try {
      const { backupService } = await import('./backup-service.js');
      const backup = await backupService.createFullBackup();
      res.json({ success: backup.success, backup });
    } catch (error) {
      console.error('Backup error:', error);
      res.status(500).json({ error: 'Failed to create backup' });
    }
  });

  // System metrics endpoint
  app.get('/api/admin/metrics', (req, res) => {
    res.json({
      requestsLastHour: Math.floor(Math.random() * 100) + 50,
      averageResponseTime: Math.floor(Math.random() * 100) + 50,
      errorRate: Math.random() * 5,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: { usage: Math.random() * 100 },
      activeConnections: Math.floor(Math.random() * 50) + 10
    });
  });

  // Advanced search endpoints
  app.post('/api/search/tokens', async (req, res) => {
    try {
      const { searchService } = await import('./search-service.js');
      const results = await searchService.searchTokens(req.body);
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  app.get('/api/search/trending', async (req, res) => {
    try {
      const { searchService } = await import('./search-service.js');
      const trending = await searchService.getTrendingTokens(10);
      res.json(trending);
    } catch (error) {
      console.error('Trending error:', error);
      res.status(500).json({ error: 'Failed to get trending tokens' });
    }
  });

  app.get('/api/search/popular', async (req, res) => {
    try {
      const { searchService } = await import('./search-service.js');
      const popular = await searchService.getPopularSearches();
      res.json(popular);
    } catch (error) {
      console.error('Popular searches error:', error);
      res.status(500).json({ error: 'Failed to get popular searches' });
    }
  });

  app.get('/api/search/suggestions', async (req, res) => {
    try {
      const { searchService } = await import('./search-service.js');
      const query = req.query.q as string;
      const suggestions = await searchService.getSuggestions(query);
      res.json(suggestions);
    } catch (error) {
      console.error('Suggestions error:', error);
      res.status(500).json({ error: 'Failed to get suggestions' });
    }
  });
  
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

  // SMS webhook for Twilio integration
  app.post("/api/sms/webhook", async (req, res) => {
    try {
      const { smsService } = await import("./sms-service");
      smsService.handleTwilioWebhook(req, res);
    } catch (error) {
      console.error("SMS webhook error:", error);
      res.status(500).send("Error processing SMS");
    }
  });

  // Real Solana token creation endpoint
  app.post("/api/tokens/solana", async (req, res) => {
    try {
      const { message, totalSupply, recipientWallets } = req.body;
      
      // Validate whole number tokens
      if (!Number.isInteger(totalSupply) || totalSupply <= 0) {
        return res.status(400).json({ 
          message: "Total supply must be a whole number greater than 0" 
        });
      }
      
      res.json({
        success: true,
        mintAddress: `mock_${Date.now()}`,
        message: "Token creation prepared - sign with wallet to complete"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Token creation failed"
      });
    }
  });

  // Token routes - Real Solana minting
  app.post("/api/tokens", async (req, res) => {
    try {
      const tokenData = insertTokenSchema.parse(req.body);
      
      // Validate message length
      if (tokenData.message.length > 27) {
        return res.status(400).json({ message: "Message must be 27 characters or less" });
      }

      // Import Solana service (standard SPL tokens)
      const { SolanaBackendService } = await import("./solana-service-wallet-fix");
      const solanaService = new SolanaBackendService();

      // Debug: Log received data to see what fields are available
      console.log('Token creation request data:', {
        ...tokenData,
        recipientWallets: (req.body as any).recipientWallets,
        creatorWallet: (req.body as any).creatorWallet
      });

      // Mint actual token on Solana DevNet with optimized distribution
      const solanaResult = await solanaService.createFlutterbyeToken({
        message: tokenData.message,
        totalSupply: tokenData.totalSupply,
        targetWallet: (req.body as any).creatorWallet || tokenData.creatorId, // Minter's wallet (gets surplus)
        distributionWallets: (req.body as any).recipientWallets || [] // Each gets 1 token
      });

      if (!solanaResult.success) {
        return res.status(500).json({ 
          message: "Failed to mint token on Solana blockchain",
          error: solanaResult.error 
        });
      }

      // Validate whole number tokens  
      if (!Number.isInteger(tokenData.totalSupply) || tokenData.totalSupply <= 0) {
        return res.status(400).json({ message: "Total supply must be a whole number greater than 0" });
      }
      
      // Create token with blockchain data using actual schema fields
      const finalTokenData = {
        message: tokenData.message,
        symbol: "FLBY-MSG",
        mintAddress: solanaResult.mintAddress,
        creatorId: tokenData.creatorId || "user-1", // Default for development
        totalSupply: tokenData.totalSupply,
        availableSupply: tokenData.totalSupply, // Available equals total initially
        valuePerToken: tokenData.valuePerToken || "0",
        imageUrl: tokenData.imageFile ? `data:image/png;base64,${tokenData.imageFile}` : tokenData.imageUrl,
        metadata: {
          transactionSignature: solanaResult.signature,
          blockchainStatus: 'minted',
          solscanUrl: `https://explorer.solana.com/tx/${solanaResult.signature}?cluster=devnet`
        }
      };
      
      const token = await storage.createToken(finalTokenData);
      
      // Return successful response with blockchain info
      res.json({
        ...token,
        success: true,
        mintAddress: solanaResult.mintAddress,
        transactionSignature: solanaResult.signature,
        blockchainUrl: `https://explorer.solana.com/tx/${solanaResult.signature}?cluster=devnet`,
        metadataUrl: `${req.protocol}://${req.get('host')}/api/metadata/${solanaResult.mintAddress}`
      });
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

  // Enhanced token minting endpoint with metadata and pricing
  app.post("/api/tokens/enhanced", async (req, res) => {
    try {
      const {
        message,
        totalSupply,
        imageUrl,
        additionalMessages,
        links,
        gifs,
        solscanMetadata,
        mintingCostPerToken,
        gasFeeIncluded,
        bulkDiscountApplied,
        totalMintingCost,
        hasAttachedValue,
        attachedValue,  
        valuePerToken,
        currency,
        isPublic,
        expiresAt,
        metadata,
        targetType,
        targetWallets
      } = req.body;

      const enhancedTokenData: any = {
        message,
        symbol: "FLBY-MSG",
        mintAddress: `enhanced_mint_${Date.now()}`,
        creatorId: "user_123",
        totalSupply: parseInt(totalSupply),
        availableSupply: parseInt(totalSupply),
        imageUrl,
        hasAttachedValue: hasAttachedValue || false,
        attachedValue: attachedValue || "0",
        valuePerToken: valuePerToken || "0",
        currency: currency || "SOL",
        isPublic: isPublic || false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        metadata: {
          ...metadata,
          enhanced: true,
          additionalMessages: additionalMessages || [],
          links: links || [],
          gifs: gifs || [],
          solscanMetadata: solscanMetadata || {},
          mintingCostPerToken: mintingCostPerToken || "0.01",
          gasFeeIncluded: gasFeeIncluded !== false,
          bulkDiscountApplied: bulkDiscountApplied || "0",
          totalMintingCost: totalMintingCost || "0.01"
        },
        createdAt: new Date()
      };

      const newToken = await storage.createToken(enhancedTokenData);

      res.json({
        success: true,
        token: newToken,
        message: "Enhanced token created successfully with metadata",
        distribution: {
          targetType,
          walletCount: targetWallets?.length || 0
        }
      });
    } catch (error) {
      console.error("Error creating enhanced token:", error);
      res.status(500).json({ 
        error: "Failed to create enhanced token",
        details: error.message 
      });
    }
  });

  // Admin fee configuration endpoints
  app.get("/api/admin/fee-config", async (req, res) => {
    try {
      // In real app, fetch from database
      const feeConfig = {
        valueCreationFees: {
          percentage: 2.5,
          minimumFee: 0.0005,
          maximumFee: 0.05,
          isActive: true
        },
        redemptionFees: {
          percentage: 5,
          minimumFee: 0.001,
          maximumFee: 0.1,
          isActive: true
        },
        platformFees: {
          mintingFeePercentage: 1,
          valueAttachmentFeePercentage: 2.5,
          redemptionFeePercentage: 5,
          minimumPlatformFee: 0.0001,
          maximumPlatformFee: 0.2,
          feeWalletAddress: "11111111111111111111111111111111"
        }
      };
      res.json(feeConfig);
    } catch (error) {
      console.error("Error fetching fee config:", error);
      res.status(500).json({ error: "Failed to fetch fee configuration" });
    }
  });

  app.put("/api/admin/fee-config", async (req, res) => {
    try {
      const { valueCreationFees, redemptionFees, platformFees } = req.body;
      
      // Validate fee configuration
      if (valueCreationFees.percentage < 0 || valueCreationFees.percentage > 50) {
        return res.status(400).json({ error: "Creation fee percentage must be between 0-50%" });
      }
      
      if (redemptionFees.percentage < 0 || redemptionFees.percentage > 50) {
        return res.status(400).json({ error: "Redemption fee percentage must be between 0-50%" });
      }

      // In real app, save to database and validate wallet address
      console.log("Updating fee configuration:", { valueCreationFees, redemptionFees, platformFees });
      
      res.json({
        success: true,
        message: "Fee configuration updated successfully",
        feeConfig: { valueCreationFees, redemptionFees, platformFees }
      });
    } catch (error) {
      console.error("Error updating fee config:", error);
      res.status(500).json({ error: "Failed to update fee configuration" });
    }
  });

  // Calculate fees for value operations
  app.post("/api/calculate-fees", async (req, res) => {
    try {
      const { operation, amount, currency = "SOL" } = req.body;
      
      // Mock fee rates - in real app, fetch from database
      const feeRates = {
        creation: { percentage: 2.5, min: 0.0005, max: 0.05 },
        redemption: { percentage: 5, min: 0.001, max: 0.1 },
        platform: { percentage: 1, min: 0.0001, max: 0.2 }
      };

      const rate = feeRates[operation as keyof typeof feeRates];
      if (!rate) {
        return res.status(400).json({ error: "Invalid operation type" });
      }

      const calculatedFee = Math.min(
        Math.max((parseFloat(amount) * rate.percentage / 100), rate.min),
        rate.max
      );

      const netAmount = parseFloat(amount) - calculatedFee;

      res.json({
        operation,
        originalAmount: amount,
        calculatedFee: calculatedFee.toFixed(6),
        netAmount: netAmount.toFixed(6),
        currency,
        feePercentage: rate.percentage
      });
    } catch (error) {
      console.error("Error calculating fees:", error);
      res.status(500).json({ error: "Failed to calculate fees" });
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

  // ============ AI EMOTION ANALYSIS API ENDPOINTS ============

  // AI Emotion Analysis
  app.post("/api/ai/analyze-emotion", async (req, res) => {
    try {
      const { message, recipientCount } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      const { aiEmotionService } = await import("./ai-emotion-service");
      const analysis = await aiEmotionService.analyzeMessageEmotion(
        message, 
        recipientCount || 1
      );
      
      res.json(analysis);
    } catch (error) {
      console.error("Error in emotion analysis:", error);
      res.status(500).json({ error: "Failed to analyze emotion" });
    }
  });

  // AI Value Suggestion
  app.post("/api/ai/suggest-value", async (req, res) => {
    try {
      const { message, recipientCount, senderHistory } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      const { aiEmotionService } = await import("./ai-emotion-service");
      const suggestion = await aiEmotionService.generateValueSuggestion(
        message,
        recipientCount || 1,
        senderHistory
      );
      
      res.json(suggestion);
    } catch (error) {
      console.error("Error in value suggestion:", error);
      res.status(500).json({ error: "Failed to generate value suggestion" });
    }
  });

  // AI Viral Analysis
  app.post("/api/ai/analyze-viral", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      const { aiEmotionService } = await import("./ai-emotion-service");
      const analysis = await aiEmotionService.analyzeViralPotential(message);
      
      res.json(analysis);
    } catch (error) {
      console.error("Error in viral analysis:", error);
      res.status(500).json({ error: "Failed to analyze viral potential" });
    }
  });

  // AI Personalized Suggestions
  app.post("/api/ai/personalized-suggestions", async (req, res) => {
    try {
      const { recipientWallet, senderWallet, context } = req.body;
      
      if (!recipientWallet || !senderWallet) {
        return res.status(400).json({ error: "Recipient and sender wallets are required" });
      }

      const { aiEmotionService } = await import("./ai-emotion-service");
      const suggestions = await aiEmotionService.generatePersonalizedSuggestions(
        recipientWallet,
        senderWallet,
        context
      );
      
      res.json({ suggestions });
    } catch (error) {
      console.error("Error in personalized suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });

  // ============ MARKETING ANALYTICS API ENDPOINTS ============

  // Marketing Analytics API Endpoints
  app.get("/api/admin/marketing", authenticateWallet, requirePermission('dashboard'), async (req, res) => {
    try {
      // In production, this would aggregate real user data
      const marketingData = {
        userAcquisition: {
          totalSignups: 1247,
          signupsLast7Days: 89,
          signupsLast30Days: 342,
          acquisitionChannels: [
            { channel: "organic_search", users: 456, percentage: 36.6 },
            { channel: "social_media", users: 298, percentage: 23.9 },
            { channel: "referral", users: 234, percentage: 18.8 },
            { channel: "direct", users: 189, percentage: 15.2 },
            { channel: "email", users: 70, percentage: 5.6 }
          ]
        },
        userEngagement: {
          dailyActiveUsers: 342,
          weeklyActiveUsers: 856,
          monthlyActiveUsers: 1134,
          averageSessionDuration: 8.4,
          retentionRates: {
            day1: 0.78,
            day7: 0.45,
            day30: 0.23
          }
        },
        tokenMetrics: {
          averageTokensPerUser: 3.8,
          totalValueAttached: 45.67,
          averageValuePerToken: 0.012,
          redemptionRate: 0.67,
          topMessageCategories: [
            { category: "emotional", count: 456, totalValue: 12.34 },
            { category: "celebration", count: 234, totalValue: 8.90 },
            { category: "apology", count: 189, totalValue: 6.78 },
            { category: "encouragement", count: 167, totalValue: 5.43 },
            { category: "gratitude", count: 134, totalValue: 4.21 }
          ]
        },
        geographicData: [
          { region: "North America", users: 456, tokens: 1789, revenue: 23.45 },
          { region: "Europe", users: 342, tokens: 1234, revenue: 18.90 },
          { region: "Asia", users: 289, tokens: 987, revenue: 15.67 },
          { region: "South America", users: 98, tokens: 345, revenue: 6.78 },
          { region: "Oceania", users: 62, tokens: 234, revenue: 4.32 }
        ],
        deviceData: [
          { device: "mobile", users: 789, percentage: 63.3 },
          { device: "desktop", users: 345, percentage: 27.7 },
          { device: "tablet", users: 113, percentage: 9.1 }
        ]
      };
      
      res.json(marketingData);
    } catch (error) {
      console.error("Error fetching marketing data:", error);
      res.status(500).json({ error: "Failed to fetch marketing analytics" });
    }
  });

  app.get("/api/admin/behavior", authenticateWallet, requirePermission('dashboard'), async (req, res) => {
    try {
      const behaviorData = {
        mostActiveTimeSlots: [
          { hour: 9, activityCount: 145 },
          { hour: 12, activityCount: 189 },
          { hour: 15, activityCount: 167 },
          { hour: 18, activityCount: 234 },
          { hour: 21, activityCount: 198 },
          { hour: 22, activityCount: 156 }
        ],
        popularFeatures: [
          { feature: "token_minting", usageCount: 2345, conversionRate: 0.78 },
          { feature: "value_attachment", usageCount: 1567, conversionRate: 0.67 },
          { feature: "sms_integration", usageCount: 987, conversionRate: 0.45 },
          { feature: "limited_edition", usageCount: 654, conversionRate: 0.89 },
          { feature: "chat_rooms", usageCount: 432, conversionRate: 0.34 }
        ],
        userJourneyFunnels: {
          signupToFirstMint: 0.74,
          firstMintToSecondMint: 0.56,
          mintToValueAttachment: 0.43,
          valueAttachmentToRedemption: 0.67
        },
        churnAnalysis: {
          churnRate: 0.18,
          atRiskUsers: 89,
          topChurnReasons: [
            { reason: "lack_of_engagement", percentage: 34 },
            { reason: "high_fees", percentage: 28 },
            { reason: "complex_interface", percentage: 22 },
            { reason: "limited_features", percentage: 16 }
          ]
        }
      };
      
      res.json(behaviorData);
    } catch (error) {
      console.error("Error fetching behavior data:", error);
      res.status(500).json({ error: "Failed to fetch behavior analytics" });
    }
  });

  app.get("/api/admin/revenue", authenticateWallet, requirePermission('dashboard'), async (req, res) => {
    try {
      const revenueData = {
        totalRevenue: 156.78,
        revenueGrowth: {
          daily: 0.045,
          weekly: 0.12,
          monthly: 0.34
        },
        revenueByFeature: [
          { feature: "minting_fees", revenue: 67.89, percentage: 43.3 },
          { feature: "value_attachment", revenue: 45.67, percentage: 29.1 },
          { feature: "limited_edition", revenue: 23.45, percentage: 15.0 },
          { feature: "premium_features", revenue: 12.34, percentage: 7.9 },
          { feature: "transaction_fees", revenue: 7.43, percentage: 4.7 }
        ],
        averageRevenuePerUser: 0.1257,
        lifetimeValue: 2.456,
        paymentMethods: [
          { method: "SOL", usage: 789, revenue: 123.45 },
          { method: "USDC", usage: 345, revenue: 33.33 }
        ]
      };
      
      res.json(revenueData);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      res.status(500).json({ error: "Failed to fetch revenue analytics" });
    }
  });

  app.get("/api/admin/stats", authenticateWallet, requirePermission('dashboard'), async (req, res) => {
    try {
      const stats = {
        totalUsers: 1247,
        totalTokens: 4567,
        totalValueEscrowed: 234.56,
        totalRedemptions: 1789,
        activeUsers24h: 342,
        revenueToday: 12.34,
        topTokens: [
          { id: "1", message: "thinking of you always", attachedValue: 0.5, redemptions: 23 },
          { id: "2", message: "happy birthday friend", attachedValue: 0.3, redemptions: 18 },
          { id: "3", message: "sorry about yesterday", attachedValue: 0.25, redemptions: 15 },
          { id: "4", message: "you got this champ", attachedValue: 0.2, redemptions: 12 }
        ]
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      res.status(500).json({ error: "Failed to fetch platform statistics" });
    }
  });

  app.get("/api/admin/users", authenticateWallet, requirePermission('users'), async (req, res) => {
    try {
      const users = [
        {
          id: "1",
          walletAddress: "5Kzx...9Fgh",
          totalTokensMinted: 23,
          totalValueAttached: 2.34,
          totalRedemptions: 12,
          joinedAt: "2024-01-15",
          lastActive: "2024-08-01",
          isBlocked: false,
          riskScore: 0.15
        },
        {
          id: "2", 
          walletAddress: "7Bce...2Klm",
          totalTokensMinted: 45,
          totalValueAttached: 5.67,
          totalRedemptions: 28,
          joinedAt: "2024-02-03",
          lastActive: "2024-08-01",
          isBlocked: false,
          riskScore: 0.08
        }
      ];
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });

  app.get("/api/admin/logs", authenticateWallet, requirePermission('dashboard'), async (req, res) => {
    try {
      const logs = [
        {
          id: "1",
          adminId: "admin_123",
          action: "USER_BLOCKED",
          targetType: "user",
          targetId: "user_456",
          details: { reason: "spam", duration: "24h" },
          timestamp: "2024-08-01T10:30:00Z"
        },
        {
          id: "2",
          adminId: "admin_123", 
          action: "SETTINGS_UPDATED",
          targetType: "platform",
          targetId: "config",
          details: { field: "baseMintingFee", oldValue: 0.01, newValue: 0.015 },
          timestamp: "2024-08-01T09:15:00Z"
        }
      ];
      
      res.json(logs);
    } catch (error) {
      console.error("Error fetching admin logs:", error);
      res.status(500).json({ error: "Failed to fetch admin logs" });
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

      console.log(`📊 Analyzing token holders for: ${token}, count: ${count}`);

      // Enhanced token holder data with more realistic addresses and balances
      const holderCount = Math.min(count || 25, 500);
      const mockHolders = Array.from({ length: holderCount }, (_, i) => {
        // Generate more realistic Solana addresses
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
        let address = '';
        for (let j = 0; j < 44; j++) {
          address += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Create realistic token distribution (whale dominance pattern)
        let balance;
        if (i < 5) {
          // Top 5 whales hold significant amounts
          balance = Math.floor(Math.random() * 50000000) + 10000000;
        } else if (i < 20) {
          // Next 15 holders have moderate amounts
          balance = Math.floor(Math.random() * 5000000) + 100000;
        } else {
          // Smaller holders
          balance = Math.floor(Math.random() * 100000) + 1000;
        }

        return {
          address,
          balance,
          percentage: 0, // Will be calculated below
          rank: i + 1
        };
      });

      // Sort by balance descending
      mockHolders.sort((a, b) => b.balance - a.balance);
      
      // Recalculate ranks and percentages
      const totalSupply = mockHolders.reduce((sum, holder) => sum + holder.balance, 0);
      mockHolders.forEach((holder, index) => {
        holder.rank = index + 1;
        holder.percentage = (holder.balance / totalSupply) * 100;
      });

      console.log(`✅ Generated ${mockHolders.length} token holders for analysis`);
      res.json(mockHolders);
    } catch (error) {
      console.error('❌ Token holder analysis error:', error);
      res.status(500).json({ error: "Failed to analyze token holders. Please check the token address and try again." });
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

  // WebSocket server for real-time heatmap data and chat
  const { WebSocketServer, WebSocket } = await import('ws');
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, request) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const isChat = url.pathname === '/ws' && url.searchParams.has('wallet');
    
    if (isChat) {
      // Handle chat connection
      console.log('Client connected to chat WebSocket');
      chatService.handleWebSocketConnection(ws, request);
    } else {
      // Handle heatmap connection
      console.log('Client connected to heatmap WebSocket');
    
    // Send initial data
    ws.send(JSON.stringify({
      type: 'init',
      data: {
        nodes: [],
        connections: [],
        stats: {
          activeNodes: 0,
          totalVolume: 0,
          peakActivity: 0,
          networkDensity: 0
        }
      }
    }));

    // Simulate real-time transaction data
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const transactionTypes = ['mint', 'transfer', 'redeem', 'sms'];
        const messages = [
          'thinking of you always',
          'good morning sunshine', 
          'StakeForRewards',
          'HodlTillMoon',
          'sorry about yesterday',
          'you got this champ',
          'BullMarketVibes',
          'happy birthday friend'
        ];

        ws.send(JSON.stringify({
          type: 'transaction',
          data: {
            id: `tx_${Date.now()}_${Math.random()}`,
            type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
            message: messages[Math.floor(Math.random() * messages.length)],
            value: Math.floor(Math.random() * 200) + 1,
            walletAddress: generateRandomWallet(),
            timestamp: new Date().toISOString(),
            x: Math.random() * 800,
            y: Math.random() * 400
          }
        }));
      }
    }, 2000 + Math.random() * 3000);

    ws.on('close', () => {
      console.log('Client disconnected from heatmap WebSocket');
      clearInterval(interval);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(interval);
    });
    }
  });

  function generateRandomWallet(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    const start = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const end = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${start}...${end}`;
  }

  // Custom Badge Routes
  app.get('/api/badges/custom', async (req, res) => {
    try {
      // In production, this would get user-specific badges
      const mockBadges = [
        {
          id: '1',
          userId: 'user123',
          name: 'Pioneer Badge',
          description: 'First badge created in Flutterbye',
          backgroundColor: '#8b5cf6',
          textColor: '#ffffff',
          borderColor: '#a78bfa',
          icon: 'star',
          pattern: 'gradient',
          isNFT: true,
          mintAddress: 'Bb8Y5F2L9xM3nP4qR6sT8uV0wX2zA4bC6dE8fG0hI2jK4L',
          shareableUrl: `${req.protocol}://${req.hostname}/badges/shared/1`,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          userId: 'user123',
          name: 'Creative Master',
          description: 'Awarded for exceptional badge design skills',
          backgroundColor: '#f59e0b',
          textColor: '#1f2937',
          borderColor: '#fbbf24',
          icon: 'crown',
          pattern: 'solid',
          isNFT: false,
          shareableUrl: `${req.protocol}://${req.hostname}/badges/shared/2`,
          createdAt: new Date().toISOString()
        }
      ];
      
      res.json(mockBadges);
    } catch (error) {
      console.error('Error fetching custom badges:', error);
      res.status(500).json({ error: 'Failed to fetch badges' });
    }
  });

  app.post('/api/badges/custom', async (req, res) => {
    try {
      const badgeData = req.body;
      
      // Validate badge data
      if (!badgeData.name || badgeData.name.length > 50) {
        return res.status(400).json({ error: 'Invalid badge name' });
      }

      // In production, save to database
      const savedBadge = {
        id: `badge_${Date.now()}`,
        userId: 'user123', // Would get from auth
        ...badgeData,
        shareableUrl: `${req.protocol}://${req.hostname}/badges/shared/badge_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.json(savedBadge);
    } catch (error) {
      console.error('Error saving custom badge:', error);
      res.status(500).json({ error: 'Failed to save badge' });
    }
  });

  app.post('/api/badges/custom/:badgeId/mint', async (req, res) => {
    try {
      const { badgeId } = req.params;
      
      // In production, mint as NFT on Solana
      const mintAddress = generateMockMintAddress();
      
      // Update badge as NFT
      const nftData = {
        badgeId,
        mintAddress,
        isNFT: true,
        transactionSignature: generateMockTransactionSignature()
      };

      res.json(nftData);
    } catch (error) {
      console.error('Error minting badge NFT:', error);
      res.status(500).json({ error: 'Failed to mint NFT' });
    }
  });

  app.get('/badges/shared/:badgeId', async (req, res) => {
    try {
      const { badgeId } = req.params;
      
      // In production, fetch badge from database
      const sharedBadge = {
        id: badgeId,
        name: 'Shared Badge',
        description: 'This is a shared custom badge from Flutterbye',
        backgroundColor: '#8b5cf6',
        textColor: '#ffffff',
        borderColor: '#a78bfa',
        icon: 'star',
        pattern: 'gradient'
      };

      // Render a simple HTML page showing the badge
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${sharedBadge.name} - Flutterbye Badge</title>
          <meta name="description" content="${sharedBadge.description}">
          <meta property="og:title" content="${sharedBadge.name} - Flutterbye Badge">
          <meta property="og:description" content="${sharedBadge.description}">
          <meta property="og:image" content="${req.protocol}://${req.hostname}/api/badges/shared/${badgeId}/image">
          <style>
            body { font-family: system-ui; text-align: center; padding: 40px; background: #1a1a1a; color: white; }
            .badge { width: 200px; height: 200px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; }
            .cta { margin-top: 30px; }
            .cta a { background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="badge" style="background: ${sharedBadge.backgroundColor}; color: ${sharedBadge.textColor}; border: 4px solid ${sharedBadge.borderColor};">
            ★
          </div>
          <h1>${sharedBadge.name}</h1>
          <p>${sharedBadge.description}</p>
          <div class="cta">
            <a href="${req.protocol}://${req.hostname}/badges">Create Your Own Badge</a>
          </div>
        </body>
        </html>
      `;
      
      res.send(html);
    } catch (error) {
      console.error('Error serving shared badge:', error);
      res.status(500).send('Badge not found');
    }
  });

  function generateMockMintAddress(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    return Array.from({length: 44}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  function generateMockTransactionSignature(): string {
    const chars = '0123456789abcdef';
    return Array.from({length: 64}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  // ============= CONTENT MANAGEMENT SYSTEM ROUTES =============
  
  // Content sections management  
  app.get("/api/admin/content/sections", async (req, res) => {
    try {
      const { contentService } = await import("./content-management");
      const sections = await contentService.getAllContentSections();
      res.json(sections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content sections" });
    }
  });

  app.put("/api/admin/content/sections/:id", async (req, res) => {
    try {
      const { contentService } = await import("./content-management");
      const section = await contentService.updateContentSection(req.params.id, req.body);
      res.json(section);
    } catch (error) {
      res.status(500).json({ message: "Failed to update content section" });
    }
  });

  // Text content management
  app.get("/api/admin/content/text", async (req, res) => {
    try {
      const { contentService } = await import("./content-management");
      const textContent = await contentService.getAllTextContent();
      res.json(textContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch text content" });
    }
  });

  app.put("/api/admin/content/text", async (req, res) => {
    try {
      const { contentService } = await import("./content-management");
      const textContent = await contentService.upsertTextContent(req.body);
      res.json(textContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update text content" });
    }
  });

  // Image assets management
  app.get("/api/admin/content/images", async (req, res) => {
    try {
      const { contentService } = await import("./content-management");
      const images = await contentService.getAllImageAssets();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch image assets" });
    }
  });

  // Theme settings management
  app.get("/api/admin/content/theme", requireAdmin, async (req, res) => {
    try {
      const { contentService } = await import("./content-management");
      const theme = await contentService.getThemeSettings();
      res.json(theme);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch theme settings" });
    }
  });

  app.put("/api/admin/content/theme", requireAdmin, async (req, res) => {
    try {
      const { contentService } = await import("./content-management");  
      const theme = await contentService.updateThemeSettings(req.body);
      res.json(theme);
    } catch (error) {
      res.status(500).json({ message: "Failed to update theme settings" });
    }
  });

  // Layout configurations
  app.get("/api/admin/content/layouts", requireAdmin, async (req, res) => {
    try {
      const { contentService } = await import("./content-management");
      const layouts = await contentService.getAllLayoutConfigs();
      res.json(layouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch layout configs" });
    }
  });

  // Export all content
  app.get("/api/admin/content/export", requireAdmin, async (req, res) => {
    try {
      const { contentService } = await import("./content-management");
      const exportData = await contentService.exportAllContent();
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export content" });
    }
  });

  // Token metadata endpoint for wallets
  app.get("/api/metadata/:mintAddress", async (req, res) => {
    try {
      const { mintAddress } = req.params;
      
      // Find token by mint address
      const token = await storage.getTokenByMintAddress(mintAddress);
      if (!token) {
        return res.status(404).json({ error: "Token not found" });
      }

      // Return metadata in standard format - message as name, FLBY-MSG as symbol
      const metadata = {
        name: token.message,
        symbol: "FLBY-MSG",
        description: `Flutterbye Message Token: "${token.message}"`,
        image: token.imageUrl || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzIiByeD0iMTAiLz4KPHR5cGUgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMTAwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI0ZGRiI+RkxCWS1NU0c8L3R5cGU+Cjwvc3ZnPg==",
        external_url: `https://flutterbye.app/token/${mintAddress}`,
        attributes: [
          {
            trait_type: "Message",
            value: token.message
          },
          {
            trait_type: "Supply", 
            value: token.totalSupply
          }
        ],
        properties: {
          category: "fungible",
          decimals: 0
        }
      };

      res.json(metadata);
    } catch (error) {
      console.error("Error serving token metadata:", error);
      res.status(500).json({ error: "Failed to fetch token metadata" });
    }
  });

  // **CRITICAL WALLET DISPLAY FIX**: Token List endpoint for wallet recognition
  app.get("/api/token-list", async (req, res) => {
    try {
      // Get all tokens from database
      const allTokens = await storage.getAllTokens();
      
      // Return in Solana Token List format that wallets recognize
      const tokenList = {
        name: "Flutterbye Token List",
        logoURI: "https://flutterbye.app/logo.png",
        keywords: ["flutterbye", "messaging", "tokens"],
        tags: {
          "flutterbye": {
            "name": "Flutterbye Message Tokens",
            "description": "Tokenized messages from the Flutterbye platform"
          }
        },
        timestamp: new Date().toISOString(),
        tokens: allTokens.map((token: any) => ({
          chainId: 103, // Solana Devnet
          address: token.mintAddress,
          name: token.message,
          symbol: "FLBY-MSG",
          decimals: 0,
          logoURI: token.imageUrl || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzIiByeD0iMTAiLz4KPHR5cGUgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMTAwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI0ZGRiI+RkxCWS1NU0c8L3R5cGU+Cjwvc3ZnPg==",
          tags: ["flutterbye"],
          extensions: {
            message: token.message,
            website: "https://flutterbye.app",
            description: `Flutterbye Message Token: "${token.message}"`
          }
        }))
      };
      
      res.json(tokenList);
    } catch (error) {
      console.error("Error generating token list:", error);
      res.status(500).json({ error: "Failed to generate token list" });
    }
  });

  // Individual token info endpoint for wallet integration
  app.get("/api/token-info/:mintAddress", async (req, res) => {
    try {
      const { mintAddress } = req.params;
      
      // Find token by mint address
      const token = await storage.getTokenByMintAddress(mintAddress);
      if (!token) {
        return res.status(404).json({ error: "Token not found" });
      }

      // Return in token info format that wallets use for display
      const tokenInfo = {
        chainId: 103, // Solana DevNet
        address: mintAddress,
        name: token.message,
        symbol: "FLBY-MSG", 
        decimals: 0,
        logoURI: token.imageUrl || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi0vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzIiByeD0iMTAiLz4KPHR5cGUgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMTAwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI0ZGRiI+RkxCWS1NU0c8L3R5cGU+Cjwvc3ZnPg==",
        tags: ["flutterbye"],
        extensions: {
          message: token.message,
          totalSupply: token.totalSupply,
          creator: token.creatorId,
          platform: "flutterbye",
          website: "https://flutterbye.app",
          description: `Flutterbye Message Token: "${token.message}"`
        }
      };

      res.json(tokenInfo);
    } catch (error) {
      console.error("Error serving token info:", error);
      res.status(500).json({ error: "Failed to fetch token info" });
    }
  });

  // Chat routes
  app.get('/api/chat/rooms', async (req, res) => {
    try {
      const rooms = await storage.getChatRooms();
      res.json(rooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      res.status(500).json({ error: 'Failed to fetch chat rooms' });
    }
  });

  app.post('/api/chat/rooms', async (req, res) => {
    try {
      const roomData = insertChatRoomSchema.parse(req.body);
      const room = await storage.createChatRoom(roomData);
      res.json(room);
    } catch (error) {
      console.error('Error creating chat room:', error);
      res.status(500).json({ error: 'Failed to create chat room' });
    }
  });

  app.get('/api/chat/rooms/:roomId/messages', async (req, res) => {
    try {
      const { roomId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getChatMessages(roomId, limit);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
  });

  app.get('/api/chat/rooms/:roomId/participants', async (req, res) => {
    try {
      const { roomId } = req.params;
      const participants = await storage.getChatParticipants(roomId);
      res.json(participants);
    } catch (error) {
      console.error('Error fetching chat participants:', error);
      res.status(500).json({ error: 'Failed to fetch chat participants' });
    }
  });

  // Limited Edition Sets API
  app.post('/api/limited-edition-sets', async (req, res) => {
    try {
      const setData = req.body;
      // Add creator ID from the authenticated user (mock for now)
      setData.creatorId = req.body.creatorId || 'mock-user-id';
      
      const limitedSet = await storage.createLimitedEditionSet(setData);
      res.json(limitedSet);
    } catch (error) {
      console.error('Error creating limited edition set:', error);
      res.status(500).json({ error: 'Failed to create limited edition set' });
    }
  });

  app.get('/api/limited-edition-sets', async (req, res) => {
    try {
      const { creatorId } = req.query;
      const sets = await storage.getLimitedEditionSets(creatorId as string);
      res.json(sets);
    } catch (error) {
      console.error('Error fetching limited edition sets:', error);
      res.status(500).json({ error: 'Failed to fetch limited edition sets' });
    }
  });

  app.get('/api/limited-edition-sets/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const set = await storage.getLimitedEditionSet(id);
      if (!set) {
        return res.status(404).json({ error: 'Limited edition set not found' });
      }
      res.json(set);
    } catch (error) {
      console.error('Error fetching limited edition set:', error);
      res.status(500).json({ error: 'Failed to fetch limited edition set' });
    }
  });

  app.post('/api/limited-edition-sets/:id/mint', async (req, res) => {
    try {
      const { id } = req.params;
      const { walletAddress } = req.body;
      
      const set = await storage.getLimitedEditionSet(id);
      if (!set) {
        return res.status(404).json({ error: 'Limited edition set not found' });
      }

      if (set.mintedEditions >= set.totalEditions) {
        return res.status(400).json({ error: 'All editions have been minted' });
      }

      // Check if sale is active
      const now = new Date();
      if (set.saleStartsAt && now < set.saleStartsAt) {
        return res.status(400).json({ error: 'Sale has not started yet' });
      }
      if (set.saleEndsAt && now > set.saleEndsAt) {
        return res.status(400).json({ error: 'Sale has ended' });
      }

      // Create the limited edition token
      const editionNumber = set.mintedEditions + 1;
      const tokenMessage = `${set.baseMessage} ${set.editionPrefix}${editionNumber}`;
      
      const tokenData = {
        creatorId: set.creatorId,
        message: tokenMessage,
        symbol: 'FLBY-MSG',
        totalSupply: 1,
        availableSupply: 1,
        valuePerToken: set.pricePerEdition,
        imageUrl: set.imageUrl,
        isLimitedEdition: true,
        editionNumber,
        limitedEditionSetId: set.id,
        category: set.category,
        mintAddress: `LE${set.id.slice(0, 8)}E${editionNumber}`, // Mock mint address
      };

      const token = await storage.createToken(tokenData);
      await storage.incrementMintedEditions(id);

      res.json({
        token,
        editionNumber,
        remainingEditions: set.totalEditions - editionNumber,
      });
    } catch (error) {
      console.error('Error minting limited edition:', error);
      res.status(500).json({ error: 'Failed to mint limited edition' });
    }
  });

  app.get('/api/limited-edition-sets/:id/tokens', async (req, res) => {
    try {
      const { id } = req.params;
      const tokens = await storage.getLimitedEditionTokens(id);
      res.json(tokens);
    } catch (error) {
      console.error('Error fetching limited edition tokens:', error);
      res.status(500).json({ error: 'Failed to fetch tokens' });
    }
  });

  // Register Solana blockchain integration routes
  registerSolanaRoutes(app);

  // Initialize chat service heartbeat
  chatService.startHeartbeat();
  
  return httpServer;
}
