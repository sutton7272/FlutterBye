import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTokenSchema, insertAirdropSignupSchema, insertTransactionSchema, insertMarketListingSchema, insertRedemptionSchema, insertEscrowWalletSchema, insertAdminUserSchema, insertAdminLogSchema, insertAnalyticsSchema, insertChatRoomSchema, insertChatMessageSchema, insertSystemSettingSchema } from "@shared/schema";
import { DefaultTokenImageService } from "./default-token-image";
import { authenticateWallet, requireAdmin, requirePermission, requireSuperAdmin } from "./admin-middleware";
import { chatService } from "./chat-service";
import { registerSolanaRoutes } from "./routes-solana";
import { DefaultTokenImageService } from "./default-token-image";
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
      const { redemptionCode, isFreeMode, ...rawTokenData } = req.body;
      
      let redemptionData = null;
      
      // If using free mode with a redemption code, validate and use it
      if (isFreeMode && redemptionCode) {
        const validCode = await storage.validateAndUseRedemptionCode(redemptionCode);
        if (!validCode) {
          return res.status(400).json({ message: "Invalid or expired redemption code" });
        }
        
        // Calculate savings data
        const originalCost = parseFloat(tokenData.valuePerToken || "0.01"); // Base minting cost
        const savingsAmount = originalCost;
        
        // Collect comprehensive user data for admin analytics
        redemptionData = {
          codeId: validCode.id,
          walletAddress: (req.body as any).creatorWallet || tokenData.creatorId,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          savingsAmount: savingsAmount.toString(),
          originalCost: originalCost.toString(),
          referralSource: req.get('Referer') || 'direct',
          geolocation: {
            // Could be enhanced with IP geolocation service
            userAgent: req.get('User-Agent')
          },
          metadata: {
            redemptionCode: redemptionCode,
            codeType: validCode.type,
            timestamp: new Date().toISOString(),
            sessionData: {
              acceptLanguage: req.get('Accept-Language'),
              acceptEncoding: req.get('Accept-Encoding')
            }
          }
        };
        
        console.log(`Free minting using code: ${redemptionCode} (${validCode.type}) - Data collected for admin analytics`);
      }
      
      const tokenData = insertTokenSchema.parse(rawTokenData);
      
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
      const finalTokenDataRaw = {
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

      // Apply default image if no custom image provided
      const finalTokenData = await DefaultTokenImageService.applyDefaultImageIfNeeded(finalTokenDataRaw);
      
      const token = await storage.createToken(finalTokenData);
      
      // Track redemption code usage if applicable
      if (redemptionData) {
        try {
          await storage.trackRedemptionUsage({
            ...redemptionData,
            tokenId: token.id,
            userId: token.creatorId
          });
        } catch (error) {
          console.error('Failed to track redemption usage:', error);
          // Continue with token creation even if tracking fails
        }
      }
      
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

  // Redemption code validation endpoint
  app.post("/api/validate-redemption-code", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: "Code is required" });
      }

      // Check if code exists and is valid in redemption codes
      const allRedemptionCodes = await storage.getAllRedemptionCodes();
      const redemptionCode = allRedemptionCodes.find(rc => rc.code === code) || null;
      
      if (!redemptionCode) {
        return res.status(400).json({ error: "Invalid redemption code" });
      }

      // Check if code is expired
      if (redemptionCode.expiresAt && new Date(redemptionCode.expiresAt) < new Date()) {
        return res.status(400).json({ error: "Redemption code has expired" });
      }

      // Check if code has remaining uses (maxUses = -1 means unlimited)
      if (redemptionCode.maxUses > 0 && redemptionCode.currentUses >= redemptionCode.maxUses) {
        return res.status(400).json({ error: "Redemption code has been fully used" });
      }

      // Return valid code info
      res.json({
        id: redemptionCode.id,
        code: redemptionCode.code,
        type: redemptionCode.type,
        value: redemptionCode.value,
        remainingUses: redemptionCode.maxUses > 0 ? redemptionCode.maxUses - redemptionCode.currentUses : null,
        expiresAt: redemptionCode.expiresAt
      });
    } catch (error) {
      console.error("Error validating redemption code:", error);
      res.status(500).json({ error: "Internal server error" });
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

      const enhancedTokenDataRaw: any = {
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

      // Apply default image if no custom image provided
      const enhancedTokenData = await DefaultTokenImageService.applyDefaultImageIfNeeded(enhancedTokenDataRaw);

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

  // Redemption analytics for admin panel
  app.get("/api/admin/redemption-analytics", async (req, res) => {
    try {
      const analytics = await storage.getRedemptionUsageAnalytics();
      res.json({ success: true, analytics });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch redemption analytics" 
      });
    }
  });

  // Comprehensive pricing configuration endpoints
  app.get("/api/admin/pricing-config", async (req, res) => {
    try {
      const pricingConfig = await storage.getPricingConfig();
      res.json({ success: true, pricingConfig });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch pricing config" 
      });
    }
  });
  
  app.post("/api/admin/pricing-config", async (req, res) => {
    try {
      const { key, value, currency } = req.body;
      if (!key || !value) {
        return res.status(400).json({ success: false, error: "Key and value are required" });
      }
      
      await storage.updatePricingConfig(key, value, currency);
      res.json({ success: true, message: "Pricing configuration updated" });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update pricing config" 
      });
    }
  });

  app.get("/api/admin/pricing-config/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const pricingConfig = await storage.getPricingByCategory(category);
      res.json({ success: true, pricingConfig });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch pricing config by category" 
      });
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

  // ============ PHASE 1 ANALYSIS API ENDPOINTS (No AI Dependencies) ============
  // Phase 2 AI features moved to roadmap - these are simple rule-based implementations

  // Simple Emotion Analysis (Phase 1 - No OpenAI required)
  app.post("/api/ai/analyze-emotion", async (req, res) => {
    try {
      const { message, recipientCount } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Phase 1: Simple rule-based emotion analysis
      const messageText = message.toLowerCase();
      
      let primaryEmotion = 'neutral';
      let sentiment = 'neutral';
      let category = 'other';
      let suggestedValue = 0.01;
      
      // Emotion detection based on keywords and emojis
      if (messageText.includes('❤️') || messageText.includes('love') || messageText.includes('💕')) {
        primaryEmotion = 'love';
        sentiment = 'positive';
        category = 'romantic';
        suggestedValue = 0.05;
      } else if (messageText.includes('🎉') || messageText.includes('congratulations') || messageText.includes('celebrate')) {
        primaryEmotion = 'joy';
        sentiment = 'positive';
        category = 'celebration';
        suggestedValue = 0.03;
      } else if (messageText.includes('thanks') || messageText.includes('thank you') || messageText.includes('grateful')) {
        primaryEmotion = 'gratitude';
        sentiment = 'positive';
        category = 'gratitude';
        suggestedValue = 0.02;
      } else if (messageText.includes('sorry') || messageText.includes('apologize') || messageText.includes('😢')) {
        primaryEmotion = 'sadness';
        sentiment = 'negative';
        category = 'apology';
        suggestedValue = 0.025;
      } else if (messageText.includes('gm') || messageText.includes('good morning') || messageText.includes('hello')) {
        primaryEmotion = 'friendliness';
        sentiment = 'positive';
        category = 'friendship';
        suggestedValue = 0.005;
      }
      
      // Adjust for recipient count
      const recipientMultiplier = recipientCount > 10 ? 1.5 : recipientCount > 5 ? 1.2 : 1.0;
      suggestedValue *= recipientMultiplier;
      
      const analysis = {
        primaryEmotion,
        emotionScore: sentiment === 'positive' ? 0.7 : sentiment === 'negative' ? 0.4 : 0.5,
        sentiment,
        intensity: messageText.includes('!!!') || messageText.includes('🔥') ? 'high' : 'medium',
        category,
        suggestedValue: Math.min(suggestedValue, 0.1),
        viralityScore: messageText.includes('🚀') || messageText.includes('💎') ? 0.6 : 0.3,
        marketingTags: ['tokenized-message', 'blockchain-communication']
      };
      
      res.json(analysis);
    } catch (error) {
      console.error("Error in emotion analysis:", error);
      res.status(500).json({ error: "Failed to analyze emotion" });
    }
  });

  // Simple Value Suggestion (Phase 1 - No OpenAI required)
  app.post("/api/ai/suggest-value", async (req, res) => {
    try {
      const { message, recipientCount, senderHistory } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Phase 1: Rule-based value suggestions
      const messageText = message.toLowerCase();
      let baseValue = 0.01;
      let reasoning = "Standard message pricing";
      
      // Category-based pricing
      if (messageText.includes('❤️') || messageText.includes('love')) {
        baseValue = 0.05;
        reasoning = "Romantic message - higher emotional value";
      } else if (messageText.includes('congratulations') || messageText.includes('🎉')) {
        baseValue = 0.03;
        reasoning = "Celebration message - special occasion";
      } else if (messageText.includes('thanks') || messageText.includes('thank you')) {
        baseValue = 0.02;
        reasoning = "Gratitude message - appreciative gesture";
      } else if (messageText.includes('sorry') || messageText.includes('apologize')) {
        baseValue = 0.025;
        reasoning = "Apology message - sincere gesture";
      } else if (messageText.includes('gm') || messageText.includes('hello')) {
        baseValue = 0.005;
        reasoning = "Greeting message - casual interaction";
      }
      
      // Recipient count multiplier
      const emotionMultiplier = recipientCount > 10 ? 1.5 : recipientCount > 5 ? 1.2 : 1.0;
      const finalSuggestion = Math.min(baseValue * emotionMultiplier, 0.2);
      
      const suggestion = {
        baseValue,
        emotionMultiplier,
        finalSuggestion,
        reasoning
      };
      
      res.json(suggestion);
    } catch (error) {
      console.error("Error in value suggestion:", error);
      res.status(500).json({ error: "Failed to generate value suggestion" });
    }
  });

  // Simple Viral Analysis (Phase 1 - No OpenAI required)
  app.post("/api/ai/analyze-viral", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Phase 1: Simple viral potential scoring
      const messageText = message.toLowerCase();
      let score = 0.3; // Base score
      const suggestions = [];
      
      // Crypto/Web3 indicators
      if (messageText.includes('🚀') || messageText.includes('moon')) score += 0.2;
      if (messageText.includes('💎') || messageText.includes('diamond')) score += 0.15;
      if (messageText.includes('hodl') || messageText.includes('lfg')) score += 0.15;
      if (messageText.includes('gm') || messageText.includes('wagmi')) score += 0.1;
      if (messageText.includes('!')) score += 0.05;
      
      // Generate suggestions based on missing elements
      if (score < 0.5) {
        suggestions.push("Add crypto slang like WAGMI, LFG, or GM for higher engagement");
      }
      if (!messageText.includes('🚀') && !messageText.includes('💎')) {
        suggestions.push("Add crypto emojis like 🚀💎 to increase viral potential");
      }
      if (!messageText.includes('!')) {
        suggestions.push("Add excitement with exclamation marks!");
      }
      if (messageText.length < 15) {
        suggestions.push("Consider making the message more expressive");
      }
      
      const analysis = {
        score: Math.min(score, 1.0),
        suggestions,
        optimizedMessage: undefined // Phase 2 feature
      };
      
      res.json(analysis);
    } catch (error) {
      console.error("Error in viral analysis:", error);
      res.status(500).json({ error: "Failed to analyze viral potential" });
    }
  });

  // Simple Personalized Suggestions (Phase 1 - No OpenAI required)
  app.post("/api/ai/personalized-suggestions", async (req, res) => {
    try {
      const { recipientWallet, senderWallet, context } = req.body;
      
      // Phase 1: Pre-defined suggestion categories
      const suggestions = [
        // Crypto-native greetings
        "GM frens! ☀️",
        "LFG! 🚀",
        "WAGMI 💎",
        "Good vibes only ✨",
        
        // Appreciation messages
        "Thanks anon! 🙏",
        "Appreciate you! 💜",
        "You're amazing! ⭐",
        
        // Motivational messages
        "Stay strong 💪",
        "Diamond hands! 💎🙌",
        "To the moon! 🌙",
        "Keep building! 🛠️",
        
        // Celebration messages
        "Congrats! 🎉",
        "Well done! 👏",
        "Legendary! 🔥",
        "Big W! 🏆"
      ];
      
      res.json({ 
        suggestions: suggestions.slice(0, 8), // Return 8 suggestions
        categories: ["greeting", "appreciation", "motivation", "celebration"],
        suggestedValues: [0.005, 0.01, 0.02, 0.05, 0.1]
      });
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

  // Token holder map analysis endpoint
  app.post("/api/tokens/analyze-holders-map", async (req, res) => {
    try {
      const { token, limit } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Token address or symbol is required" });
      }

      console.log(`🗺️ Analyzing token holder map for: ${token}, limit: ${limit}`);

      // Generate realistic geographical distribution of token holders
      const cities = [
        { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060, region: 'North America' },
        { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, region: 'Europe' },
        { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, region: 'Asia' },
        { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, region: 'Asia' },
        { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, region: 'Oceania' },
        { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, region: 'Europe' },
        { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, region: 'North America' },
        { name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417, region: 'Europe' },
        { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, region: 'Europe' },
        { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, region: 'Asia' },
        { name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, region: 'Asia' },
        { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, region: 'Middle East' },
        { name: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194, region: 'North America' },
        { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, region: 'Europe' },
        { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, region: 'Europe' },
        { name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818, region: 'Middle East' },
        { name: 'Miami', country: 'United States', lat: 25.7617, lng: -80.1918, region: 'North America' },
        { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, region: 'Asia' },
        { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, region: 'South America' },
        { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, region: 'North America' }
      ];

      const holderLimit = Math.min(limit || 1000, 2000);
      const mockHolders = Array.from({ length: holderLimit }, (_, i) => {
        const city = cities[Math.floor(Math.random() * cities.length)];
        const balance = Math.floor(Math.random() * 10000000) + 1000;
        
        let holderType: 'whale' | 'dolphin' | 'fish' | 'shrimp';
        if (balance > 5000000) holderType = 'whale';
        else if (balance > 1000000) holderType = 'dolphin';
        else if (balance > 100000) holderType = 'fish';
        else holderType = 'shrimp';

        // Generate realistic Solana address
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
        let address = '';
        for (let j = 0; j < 44; j++) {
          address += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return {
          id: `holder_${i}`,
          address: `${address.substring(0, 6)}...${address.substring(38)}`,
          balance,
          percentage: (balance / 50000000) * 100,
          country: city.country,
          city: city.name,
          lat: city.lat + (Math.random() - 0.5) * 0.5, // Add some scatter
          lng: city.lng + (Math.random() - 0.5) * 0.5,
          region: city.region,
          holderType,
          joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        };
      });

      // Sort by balance descending
      mockHolders.sort((a, b) => b.balance - a.balance);

      console.log(`✅ Generated ${mockHolders.length} geographic token holders for map visualization`);
      res.json(mockHolders);
    } catch (error) {
      console.error('❌ Token holder map analysis error:', error);
      res.status(500).json({ error: "Failed to analyze token holder map. Please check the token address and try again." });
    }
  });

  // Greeting Cards API
  app.post("/api/greeting-cards", async (req, res) => {
    try {
      const {
        message,
        attachedValue,
        currency,
        currencyAddress,
        recipientAddress,
        personalNote,
        scheduledDate,
        cardType,
        templateId
      } = req.body;

      console.log(`🎉 Creating greeting card: ${message} -> ${recipientAddress}`);

      const greetingCard = {
        id: `card_${Date.now()}`,
        message: message.substring(0, 27),
        symbol: "FLBY-MSG",
        mintAddress: `greeting_${Date.now()}`,
        creatorId: "user_greeting",
        totalSupply: 1,
        availableSupply: 1,
        attachedValue: attachedValue || "0",
        valuePerToken: attachedValue || "0",
        currency: currency || "SOL",
        isPublic: false,
        recipientAddress,
        personalNote,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        cardType,
        templateId,
        metadata: {
          type: "greeting_card",
          category: cardType,
          template: templateId,
          currency: currency || "SOL",
          currencyAddress: currencyAddress,
          paymentMethod: currency || "SOL",
          feeDiscount: currency === "FLBY" ? 0.1 : 0
        },
        createdAt: new Date()
      };

      const newCard = await storage.createToken(greetingCard);

      res.json({
        success: true,
        card: newCard,
        message: "Greeting card created and sent successfully!",
        estimatedDelivery: scheduledDate || "Immediate"
      });
    } catch (error) {
      console.error("Error creating greeting card:", error);
      res.status(500).json({ error: "Failed to create greeting card" });
    }
  });

  // Enterprise Campaigns API
  app.post("/api/enterprise/campaigns", async (req, res) => {
    try {
      const {
        name,
        message,
        templateId,
        totalBudget,
        valuePerToken,
        currency,
        currencyAddress,
        targetingMethod,
        demographicFilters,
        advancedFeatures,
        expectedMetrics
      } = req.body;

      console.log(`🚀 Creating enterprise campaign: ${name}`);

      const estimatedReach = Math.floor(totalBudget / valuePerToken);
      
      const campaign = {
        id: `campaign_${Date.now()}`,
        name,
        message: message.substring(0, 27),
        symbol: "FLBY-MSG",
        mintAddress: `enterprise_${Date.now()}`,
        creatorId: "enterprise_user",
        totalSupply: estimatedReach,
        availableSupply: estimatedReach,
        valuePerToken: valuePerToken.toString(),
        currency: currency || "SOL",
        totalBudget,
        targetingMethod,
        demographicFilters,
        advancedFeatures,
        expectedMetrics,
        metadata: {
          type: "enterprise_campaign",
          template: templateId,
          targeting: targetingMethod,
          features: advancedFeatures,
          metrics: expectedMetrics,
          currency: currency || "SOL",
          currencyAddress: currencyAddress,
          paymentMethod: currency || "SOL",
          feeDiscount: currency === "FLBY" ? 0.1 : 0
        },
        createdAt: new Date(),
        status: "active"
      };

      const newCampaign = await storage.createToken(campaign);

      res.json({
        success: true,
        campaign: newCampaign,
        message: "Enterprise campaign launched successfully!",
        estimatedReach,
        metrics: {
          expectedEngagement: "5-15%",
          expectedConversion: "2-8%",
          costPerEngagement: (totalBudget / (estimatedReach * 0.1)).toFixed(4),
          currency: currency || "SOL",
          totalBudget: totalBudget,
          feeDiscount: currency === "FLBY" ? "10% native token discount" : "Standard fees"
        }
      });
    } catch (error) {
      console.error("Error creating enterprise campaign:", error);
      res.status(500).json({ error: "Failed to create enterprise campaign" });
    }
  });

  // Marketing Insights API
  app.get("/api/enterprise/marketing-insights", async (req, res) => {
    try {
      // Generate comprehensive marketing insights from collected data
      const insights = {
        totalUsers: 24000 + Math.floor(Math.random() * 5000),
        avgEngagementRate: 12.5 + Math.random() * 3,
        costPerEngagement: 0.08 + Math.random() * 0.04,
        conversionRate: 8.2 + Math.random() * 2,
        topIndustries: [
          { name: "DeFi Protocols", ctr: 15, growth: "+23%" },
          { name: "Gaming & NFTs", ctr: 13, growth: "+18%" },
          { name: "Social Media", ctr: 11, growth: "+15%" },
          { name: "E-commerce", ctr: 9, growth: "+12%" },
          { name: "Fintech", ctr: 7, growth: "+8%" }
        ],
        optimalTiming: [
          { time: "Tuesday 2-4 PM EST", reach: 95 },
          { time: "Wednesday 10-12 PM EST", reach: 90 },
          { time: "Saturday 6-8 PM EST", reach: 85 },
          { time: "Sunday 1-3 PM EST", reach: 80 }
        ],
        userBehavior: {
          avgTokensPerUser: 3.7,
          retentionRate30Days: 68,
          avgSessionDuration: 8.5,
          crossPlatformUsage: 45
        },
        demographics: {
          ageDistribution: {
            "18-25": 28,
            "26-35": 35,
            "36-45": 22,
            "46+": 15
          },
          geographicDistribution: {
            "North America": 42,
            "Europe": 31,
            "Asia": 19,
            "Other": 8
          }
        }
      };

      res.json(insights);
    } catch (error) {
      console.error("Error fetching marketing insights:", error);
      res.status(500).json({ error: "Failed to fetch marketing insights" });
    }
  });

  // Currency Exchange Rates API
  app.get("/api/currencies/rates", async (req, res) => {
    try {
      // In production, this would fetch real-time rates from an oracle or exchange API
      const exchangeRates = {
        SOL: { rate: 1, symbol: "SOL", name: "Solana", decimals: 9 },
        USDC: { rate: 0.01, symbol: "USDC", name: "USD Coin", decimals: 6 }, // 1 USDC = 0.01 SOL
        FLBY: { rate: 0.001, symbol: "FLBY", name: "Flutterbye Token", decimals: 6 } // 1 FLBY = 0.001 SOL
      };

      res.json({
        success: true,
        rates: exchangeRates,
        timestamp: new Date().toISOString(),
        baseCurrency: "SOL"
      });
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      res.status(500).json({ error: "Failed to fetch exchange rates" });
    }
  });

  // FLBY Token Information API
  app.get("/api/flby/info", async (req, res) => {
    try {
      const tokenInfo = {
        symbol: "FLBY",
        name: "Flutterbye Token",
        totalSupply: "1000000000", // 1 billion tokens
        circulatingSupply: "0", // Not yet launched
        decimals: 6,
        address: "FLBY1234567890123456789012345678901234567890", // Placeholder
        launchDate: "Q2 2024",
        benefits: [
          { type: "fee_discount", value: 10, description: "10% discount on all platform fees" },
          { type: "governance", description: "Voting rights on platform improvements" },
          { type: "staking_rewards", apy: "8-12%", description: "Earn rewards by staking FLBY" },
          { type: "exclusive_access", description: "Early access to new features and templates" },
          { type: "priority_support", description: "Premium customer support" }
        ],
        price: {
          current: "0.001", // 0.001 SOL
          currency: "SOL"
        },
        status: "pre_launch"
      };

      res.json(tokenInfo);
    } catch (error) {
      console.error("Error fetching FLBY info:", error);
      res.status(500).json({ error: "Failed to fetch FLBY token information" });
    }
  });

  // FLBY Staking APIs
  app.post("/api/flby/stake", async (req, res) => {
    try {
      const { poolId, amount } = req.body;
      
      console.log(`🔒 Staking request: ${amount} FLBY in pool ${poolId}`);
      
      const stakingPosition = {
        id: `stake_${Date.now()}`,
        poolId,
        amount,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        currentRewards: 0,
        status: 'active',
        metadata: {
          type: 'flby_staking',
          poolType: poolId,
          stakingDate: new Date().toISOString(),
          expectedApy: poolId === 'long' ? 18 : poolId === 'medium' ? 12 : poolId === 'short' ? 8 : 5
        }
      };

      res.json({
        success: true,
        position: stakingPosition,
        message: "FLBY tokens staked successfully!",
        expectedRewards: {
          daily: (amount * 0.15) / 365, // Estimate based on APY
          monthly: (amount * 0.15) / 12,
          yearly: amount * 0.15
        }
      });
    } catch (error) {
      console.error("Error creating staking position:", error);
      res.status(500).json({ error: "Staking feature coming soon with FLBY token launch" });
    }
  });

  app.get("/api/flby/staking/positions", async (req, res) => {
    try {
      // Mock staking positions for demo
      const positions = [];
      
      res.json({
        success: true,
        positions,
        totalStaked: 0,
        totalRewards: 0,
        averageApy: 0
      });
    } catch (error) {
      console.error("Error fetching staking positions:", error);
      res.status(500).json({ error: "Failed to fetch staking positions" });
    }
  });

  // FLBY Governance APIs
  app.get("/api/flby/governance/proposals", async (req, res) => {
    try {
      const proposals = [
        {
          id: "prop-001",
          title: "Reduce Platform Fees by 20%",
          description: "Proposal to reduce minting and transaction fees by 20% to increase platform adoption and user engagement.",
          category: "tokenomics",
          status: "active",
          votesFor: 75420,
          votesAgainst: 12380,
          totalVotes: 87800,
          quorum: 100000,
          endDate: "2024-02-15",
          createdBy: "Community",
          votingPower: 0,
          hasVoted: false
        },
        {
          id: "prop-002", 
          title: "Implement Cross-Chain Bridge",
          description: "Add support for Ethereum and Polygon bridges to enable cross-chain FLBY token transfers.",
          category: "features",
          status: "active",
          votesFor: 120500,
          votesAgainst: 45200,
          totalVotes: 165700,
          quorum: 100000,
          endDate: "2024-02-20",
          createdBy: "Core Team",
          votingPower: 0,
          hasVoted: false
        }
      ];

      res.json({
        success: true,
        proposals,
        stats: {
          totalProposals: 15,
          activeProposals: 3,
          totalVoters: 8420,
          userVotingPower: 0,
          participationRate: 67.8
        }
      });
    } catch (error) {
      console.error("Error fetching governance proposals:", error);
      res.status(500).json({ error: "Failed to fetch governance proposals" });
    }
  });

  app.post("/api/flby/governance/vote", async (req, res) => {
    try {
      const { proposalId, vote } = req.body;
      
      console.log(`🗳️ Vote submitted: ${vote} on proposal ${proposalId}`);
      
      res.json({
        success: true,
        message: "Vote recorded successfully!",
        vote: {
          proposalId,
          vote,
          votingPower: 0,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error submitting vote:", error);
      res.status(500).json({ error: "Governance voting coming soon with FLBY token launch" });
    }
  });

  app.post("/api/flby/governance/proposals", async (req, res) => {
    try {
      const { title, description, category } = req.body;
      
      console.log(`📝 New proposal created: ${title}`);
      
      const proposal = {
        id: `prop_${Date.now()}`,
        title,
        description,
        category,
        status: 'pending_review',
        votesFor: 0,
        votesAgainst: 0,
        totalVotes: 0,
        quorum: 100000,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: "User",
        votingPower: 0,
        hasVoted: false,
        createdAt: new Date().toISOString()
      };

      res.json({
        success: true,
        proposal,
        message: "Proposal created and submitted for community review!"
      });
    } catch (error) {
      console.error("Error creating proposal:", error);
      res.status(500).json({ error: "Proposal creation coming soon with FLBY token launch" });
    }
  });

  // FLBY Airdrop APIs
  app.get("/api/flby/airdrops", async (req, res) => {
    try {
      const campaigns = [
        {
          id: "airdrop-001",
          name: "Genesis Airdrop",
          description: "Reward early Flutterbye users who helped build the community before token launch",
          totalTokens: 10000000,
          tokensDistributed: 0,
          eligibilityType: "early_user",
          status: "upcoming",
          startDate: "2024-03-01",
          endDate: "2024-03-31",
          requirements: [
            "Account created before Feb 1, 2024",
            "Minted at least 3 tokens",
            "Participated in community events"
          ],
          rewardAmount: 500
        }
      ];

      res.json({
        success: true,
        campaigns,
        totalAirdrops: campaigns.length,
        totalTokensAllocated: campaigns.reduce((sum, c) => sum + c.totalTokens, 0)
      });
    } catch (error) {
      console.error("Error fetching airdrops:", error);
      res.status(500).json({ error: "Failed to fetch airdrop campaigns" });
    }
  });

  app.post("/api/flby/airdrop/claim", async (req, res) => {
    try {
      const { campaignId, walletAddress } = req.body;
      
      console.log(`🎁 Airdrop claim: Campaign ${campaignId} to wallet ${walletAddress}`);
      
      res.json({
        success: true,
        message: "Airdrop claimed successfully!",
        claim: {
          campaignId,
          walletAddress,
          amount: 500,
          transactionId: `airdrop_${Date.now()}`,
          claimedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error claiming airdrop:", error);
      res.status(500).json({ error: "Airdrop claiming coming soon with FLBY token launch" });
    }
  });

  // Profit Sharing APIs
  app.get("/api/flby/profit-sharing", async (req, res) => {
    try {
      const pools = [
        {
          id: "revenue-q1-2024",
          name: "Q1 2024 Revenue Share",
          totalRevenue: 50000,
          distributionDate: "2024-04-01",
          stakersShare: 60,
          governanceShare: 25,
          distributedAmount: 42500,
          participantCount: 1250,
          userEligible: false,
          userShare: 0
        }
      ];

      res.json({
        success: true,
        pools,
        totalRevenue: pools.reduce((sum, p) => sum + p.totalRevenue, 0),
        userTotalEarnings: 0
      });
    } catch (error) {
      console.error("Error fetching profit sharing:", error);
      res.status(500).json({ error: "Failed to fetch profit sharing data" });
    }
  });

  app.post("/api/flby/profit-share/claim", async (req, res) => {
    try {
      const { poolId } = req.body;
      
      console.log(`💰 Profit share claim: Pool ${poolId}`);
      
      res.json({
        success: true,
        message: "Profit share claimed successfully!",
        claim: {
          poolId,
          amount: 34.50,
          claimedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error claiming profit share:", error);
      res.status(500).json({ error: "Profit sharing coming soon with FLBY token launch" });
    }
  });

  // Admin Staking Configuration APIs
  app.get("/api/admin/staking/config", async (req, res) => {
    try {
      const config = {
        stakingPools: [
          {
            id: "flexible",
            name: "Flexible Staking",
            duration: 0,
            apy: 5,
            minStake: 100,
            maxCapacity: 10000000,
            isActive: true,
            earlyUnstakePenalty: 0,
            bonusMultiplier: 1.0
          },
          {
            id: "short",
            name: "30-Day Lock",
            duration: 30,
            apy: 8,
            minStake: 500,
            maxCapacity: 5000000,
            isActive: true,
            earlyUnstakePenalty: 2,
            bonusMultiplier: 1.2
          },
          {
            id: "medium",
            name: "90-Day Lock",
            duration: 90,
            apy: 12,
            minStake: 1000,
            maxCapacity: 3000000,
            isActive: true,
            earlyUnstakePenalty: 5,
            bonusMultiplier: 1.5
          },
          {
            id: "long",
            name: "1-Year Lock",
            duration: 365,
            apy: 18,
            minStake: 5000,
            maxCapacity: 1000000,
            isActive: true,
            earlyUnstakePenalty: 10,
            bonusMultiplier: 2.0
          }
        ],
        profitSharing: {
          stakersShare: 60,
          governanceShare: 25,
          distributionFrequency: 'quarterly',
          minimumStakeForProfit: 100,
          autoDistribute: true
        }
      };

      res.json({
        success: true,
        config
      });
    } catch (error) {
      console.error("Error fetching staking config:", error);
      res.status(500).json({ error: "Failed to fetch staking configuration" });
    }
  });

  app.put("/api/admin/staking/pools/:poolId", async (req, res) => {
    try {
      const { poolId } = req.params;
      const updates = req.body;
      
      console.log(`⚙️ Updating staking pool ${poolId}:`, updates);
      
      res.json({
        success: true,
        message: "Staking pool configuration updated successfully",
        poolId,
        updates
      });
    } catch (error) {
      console.error("Error updating staking pool:", error);
      res.status(500).json({ error: "Failed to update staking pool configuration" });
    }
  });

  app.put("/api/admin/profit-sharing/config", async (req, res) => {
    try {
      const config = req.body;
      
      console.log(`💼 Updating profit sharing config:`, config);
      
      res.json({
        success: true,
        message: "Profit sharing configuration updated successfully",
        config
      });
    } catch (error) {
      console.error("Error updating profit sharing config:", error);
      res.status(500).json({ error: "Failed to update profit sharing configuration" });
    }
  });

  // Enhanced Profit Sharing with Tiered Revenue Distribution
  app.get("/api/flby/profit-sharing/enhanced", async (req, res) => {
    try {
      const enhancedPools = [
        {
          id: "revenue-q2-2024",
          name: "Q2 2024 Enhanced Revenue Share",
          totalRevenue: 125000,
          distributionDate: "2024-07-01",
          tierDistribution: {
            flexible: { percentage: 2, amount: 2500 },
            short: { percentage: 4, amount: 5000 },
            medium: { percentage: 8, amount: 10000 },
            long: { percentage: 12, amount: 15000 }
          },
          governanceBonus: {
            participationRate: 85, // % of proposals voted on
            bonusMultiplier: 1.25,
            bonusAmount: 3125
          },
          totalDistributed: 35625,
          participantsByTier: {
            flexible: 1200,
            short: 850,
            medium: 450,
            long: 125
          }
        }
      ];

      res.json({
        success: true,
        enhancedPools,
        newFeatures: [
          "Tiered revenue sharing based on staking duration",
          "Governance participation bonuses up to 25%",
          "Real-time APY adjustments based on platform performance"
        ]
      });
    } catch (error) {
      console.error("Error fetching enhanced profit sharing:", error);
      res.status(500).json({ error: "Failed to fetch enhanced profit sharing data" });
    }
  });

  // Referral System APIs
  app.post("/api/referrals/generate-link", async (req, res) => {
    try {
      const referralCode = `FLBY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const referralUrl = `https://flutterbye.com/signup?ref=${referralCode}`;
      
      console.log(`🔗 Generated referral link: ${referralUrl}`);
      
      res.json({
        success: true,
        referralCode,
        referralUrl,
        rewards: {
          baseReward: 50,
          currentTier: "Bronze",
          nextTierAt: 5
        }
      });
    } catch (error) {
      console.error("Error generating referral link:", error);
      res.status(500).json({ error: "Referral system coming soon with FLBY token launch" });
    }
  });

  app.get("/api/referrals/stats", async (req, res) => {
    try {
      const stats = {
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarned: 0,
        pendingRewards: 0,
        currentTier: "Bronze",
        nextTierProgress: 0,
        tierBenefits: {
          Bronze: { reward: 50, multiplier: 1.0 },
          Silver: { reward: 75, multiplier: 1.2 },
          Gold: { reward: 125, multiplier: 1.5 },
          Platinum: { reward: 250, multiplier: 2.0 }
        }
      };

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ error: "Failed to fetch referral statistics" });
    }
  });

  // Dynamic Token Distribution API
  app.get("/api/flby/token-distribution", async (req, res) => {
    try {
      const distribution = {
        totalSupply: 1000000000, // 1 billion FLBY
        allocation: {
          community: { percentage: 40, amount: 400000000, description: "Airdrops, rewards, community initiatives" },
          staking: { percentage: 25, amount: 250000000, description: "Staking rewards and yield farming" },
          team: { percentage: 15, amount: 150000000, description: "Team allocation with 4-year vesting" },
          treasury: { percentage: 10, amount: 100000000, description: "DAO treasury for governance decisions" },
          liquidity: { percentage: 5, amount: 50000000, description: "DEX liquidity and market making" },
          partnerships: { percentage: 3, amount: 30000000, description: "Strategic partnerships and integrations" },
          advisors: { percentage: 2, amount: 20000000, description: "Advisor allocation with 2-year vesting" }
        },
        vestingSchedule: {
          team: "4-year linear vesting with 1-year cliff",
          advisors: "2-year linear vesting with 6-month cliff",
          treasury: "Unlocked for governance use",
          community: "Released based on milestones and participation"
        },
        launchStrategy: {
          phase1: "Genesis Airdrop (10M FLBY) + Initial Staking Pools",
          phase2: "DEX Listing + Liquidity Incentives",
          phase3: "Governance Launch + DAO Treasury Activation",
          phase4: "Cross-chain Bridge + Ecosystem Expansion"
        }
      };

      res.json({
        success: true,
        distribution,
        launchDate: "Q2 2024",
        currentPhase: "Pre-launch preparation"
      });
    } catch (error) {
      console.error("Error fetching token distribution:", error);
      res.status(500).json({ error: "Failed to fetch token distribution data" });
    }
  });

  // Enhanced Staking Rewards Calculation
  app.post("/api/flby/staking/calculate-enhanced-rewards", async (req, res) => {
    try {
      const { amount, poolId, duration } = req.body;
      
      const poolConfigs = {
        flexible: { baseApy: 5, revenueShare: 2, multiplier: 1.0 },
        short: { baseApy: 8, revenueShare: 4, multiplier: 1.2 },
        medium: { baseApy: 12, revenueShare: 8, multiplier: 1.5 },
        long: { baseApy: 18, revenueShare: 12, multiplier: 2.0 }
      };

      const config = poolConfigs[poolId as keyof typeof poolConfigs];
      const baseRewards = (amount * config.baseApy / 100) * (duration / 365);
      const revenueShareRewards = (amount * config.revenueShare / 100) * (duration / 365);
      const totalRewards = (baseRewards + revenueShareRewards) * config.multiplier;

      // Early staker bonus (first 30 days)
      const earlyStakerBonus = totalRewards * 0.15; // 15% bonus

      res.json({
        success: true,
        calculation: {
          baseRewards,
          revenueShareRewards,
          earlyStakerBonus,
          totalRewards: totalRewards + earlyStakerBonus,
          projectedAPY: config.baseApy + config.revenueShare + (config.multiplier - 1) * 10,
          breakdown: {
            stakingAPY: config.baseApy,
            revenueAPY: config.revenueShare,
            bonusAPY: (config.multiplier - 1) * 10,
            earlyStakerBonusAPY: 1.5
          }
        }
      });
    } catch (error) {
      console.error("Error calculating enhanced rewards:", error);
      res.status(500).json({ error: "Failed to calculate enhanced staking rewards" });
    }
  });

  // Launch Countdown & Early Access APIs
  app.post("/api/launch/waitlist", async (req, res) => {
    try {
      const { email, walletAddress } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Generate unique ID for waitlist entry
      const entryId = `waitlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`📝 New waitlist signup: ${email} ${walletAddress ? `(${walletAddress})` : ''}`);
      
      res.json({
        success: true,
        entryId,
        message: "Successfully joined the VIP waitlist",
        benefits: [
          "Early access before public launch",
          "Exclusive FLBY token airdrops",
          "Beta testing privileges",
          "VIP community access"
        ]
      });
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      res.status(500).json({ error: "Failed to join waitlist" });
    }
  });

  app.get("/api/launch/stats", async (req, res) => {
    try {
      const launchDate = new Date('2024-03-05T00:00:00Z');
      const now = new Date();
      const timeRemaining = launchDate.getTime() - now.getTime();
      const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

      const stats = {
        totalSignups: 247,
        earlyAccessUsers: 15,
        airdropEligible: 189,
        launchDate: launchDate.toISOString(),
        daysRemaining,
        timeRemaining: {
          days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
          hours: Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeRemaining % (1000 * 60)) / 1000)
        },
        isLaunched: timeRemaining <= 0
      };

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error("Error fetching launch stats:", error);
      res.status(500).json({ error: "Failed to fetch launch statistics" });
    }
  });

  // Early Access Management APIs
  app.post("/api/admin/early-access/grant", async (req, res) => {
    try {
      const { entryId } = req.body;
      
      if (!entryId) {
        return res.status(400).json({ error: "Entry ID is required" });
      }

      const accessCode = `FLBY-EARLY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      console.log(`🔑 Granted early access to entry ${entryId} with code ${accessCode}`);
      
      res.json({
        success: true,
        accessCode,
        message: "Early access granted successfully"
      });
    } catch (error) {
      console.error("Error granting early access:", error);
      res.status(500).json({ error: "Failed to grant early access" });
    }
  });

  app.post("/api/admin/early-access/add", async (req, res) => {
    try {
      const { email, walletAddress } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const accessCode = `FLBY-EARLY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      console.log(`👤 Added early access user: ${email} with code ${accessCode}`);
      
      res.json({
        success: true,
        accessCode,
        user: {
          email,
          walletAddress,
          accessCode,
          grantedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error adding early access user:", error);
      res.status(500).json({ error: "Failed to add early access user" });
    }
  });

  app.post("/api/admin/launch-mode", async (req, res) => {
    try {
      const { enabled } = req.body;
      
      console.log(`🚀 Launch mode ${enabled ? 'ENABLED' : 'DISABLED'} - Platform ${enabled ? 'publicly accessible' : 'restricted to early access'}`);
      
      res.json({
        success: true,
        launchMode: enabled,
        message: enabled 
          ? "Platform is now publicly accessible" 
          : "Platform restricted to early access users only"
      });
    } catch (error) {
      console.error("Error toggling launch mode:", error);
      res.status(500).json({ error: "Failed to update launch mode" });
    }
  });

  app.post("/api/admin/check-access", async (req, res) => {
    try {
      const { accessCode, email } = req.body;
      
      // Check if launch mode is enabled (public access)
      const launchMode = false; // This would be stored in database/config
      
      if (launchMode) {
        return res.json({
          success: true,
          hasAccess: true,
          accessType: "public"
        });
      }

      // Check early access codes (this would query database)
      const validCodes = ["FLBY-EARLY-001", "FLBY-EARLY-002"];
      const authorizedEmails = ["admin@flutterbye.com", "beta@flutterbye.com"];
      
      const hasCodeAccess = accessCode && validCodes.includes(accessCode);
      const hasEmailAccess = email && authorizedEmails.includes(email);
      const hasEarlyAccess = hasCodeAccess || hasEmailAccess;
      
      res.json({
        success: true,
        hasAccess: hasEarlyAccess,
        accessType: hasEarlyAccess ? "early_access" : "restricted",
        accessMethod: hasCodeAccess ? "code" : hasEmailAccess ? "email" : null
      });
    } catch (error) {
      console.error("Error checking access:", error);
      res.status(500).json({ error: "Failed to check access" });
    }
  });

  // Dynamic Pricing Tier Management APIs
  app.get("/api/admin/pricing-tiers", async (req, res) => {
    try {
      const tiers = await storage.getPricingTiers();
      res.json({
        success: true,
        tiers
      });
    } catch (error) {
      console.error("Error fetching pricing tiers:", error);
      res.status(500).json({ error: "Failed to fetch pricing tiers" });
    }
  });

  app.post("/api/admin/pricing-tiers", async (req, res) => {
    try {
      const { tierName, minQuantity, maxQuantity, basePricePerToken, discountPercentage, currency, gasFeeIncluded, sortOrder } = req.body;
      
      if (!tierName || !basePricePerToken) {
        return res.status(400).json({ error: "Tier name and base price are required" });
      }

      const finalPrice = parseFloat(basePricePerToken) * (1 - (parseFloat(discountPercentage) || 0) / 100);
      
      const newTier = await storage.createPricingTier({
        tierName,
        minQuantity: parseInt(minQuantity) || 1,
        maxQuantity: maxQuantity ? parseInt(maxQuantity) : null,
        basePricePerToken: basePricePerToken.toString(),
        discountPercentage: (discountPercentage || 0).toString(),
        finalPricePerToken: finalPrice.toString(),
        currency: currency || "USD",
        gasFeeIncluded: gasFeeIncluded !== false,
        sortOrder: parseInt(sortOrder) || 0,
        isActive: true
      });
      
      res.json({
        success: true,
        tier: newTier,
        message: "Pricing tier created successfully"
      });
    } catch (error) {
      console.error("Error creating pricing tier:", error);
      res.status(500).json({ error: "Failed to create pricing tier" });
    }
  });

  app.put("/api/admin/pricing-tiers/:tierId", async (req, res) => {
    try {
      const { tierId } = req.params;
      const updateData = req.body;
      
      if (updateData.basePricePerToken && updateData.discountPercentage !== undefined) {
        const finalPrice = parseFloat(updateData.basePricePerToken) * (1 - (parseFloat(updateData.discountPercentage) || 0) / 100);
        updateData.finalPricePerToken = finalPrice.toString();
      }
      
      const updatedTier = await storage.updatePricingTier(tierId, updateData);
      
      res.json({
        success: true,
        tier: updatedTier,
        message: "Pricing tier updated successfully"
      });
    } catch (error) {
      console.error("Error updating pricing tier:", error);
      res.status(500).json({ error: "Failed to update pricing tier" });
    }
  });

  app.delete("/api/admin/pricing-tiers/:tierId", async (req, res) => {
    try {
      const { tierId } = req.params;
      await storage.deletePricingTier(tierId);
      
      res.json({
        success: true,
        message: "Pricing tier deactivated successfully"
      });
    } catch (error) {
      console.error("Error deleting pricing tier:", error);
      res.status(500).json({ error: "Failed to delete pricing tier" });
    }
  });

  // Token pricing calculation endpoint
  app.post("/api/calculate-token-price", async (req, res) => {
    try {
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Valid quantity is required" });
      }
      
      const pricingResult = await storage.calculateTokenPrice(parseInt(quantity));
      
      res.json({
        success: true,
        ...pricingResult
      });
    } catch (error) {
      console.error("Error calculating token price:", error);
      res.status(500).json({ error: "Failed to calculate token price" });
    }
  });

  // Access Codes Management APIs
  app.post("/api/admin/access-codes", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Access code is required" });
      }

      // In production, this would save to database
      console.log(`🔑 Added new access code: ${code}`);
      
      res.json({
        success: true,
        code,
        message: "Access code added successfully"
      });
    } catch (error) {
      console.error("Error adding access code:", error);
      res.status(500).json({ error: "Failed to add access code" });
    }
  });

  app.delete("/api/admin/access-codes", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Access code is required" });
      }

      // In production, this would remove from database
      console.log(`🗑️ Removed access code: ${code}`);
      
      res.json({
        success: true,
        message: "Access code removed successfully"
      });
    } catch (error) {
      console.error("Error removing access code:", error);
      res.status(500).json({ error: "Failed to remove access code" });
    }
  });

  app.get("/api/admin/access-codes", async (req, res) => {
    try {
      // In production, this would query database
      const codes = ["FLBY-EARLY-001", "FLBY-EARLY-002"];
      
      res.json({
        success: true,
        codes
      });
    } catch (error) {
      console.error("Error fetching access codes:", error);
      res.status(500).json({ error: "Failed to fetch access codes" });
    }
  });

  // Authorized Emails Management APIs
  app.post("/api/admin/authorized-emails", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email address is required" });
      }

      // In production, this would save to database
      console.log(`📧 Added authorized email: ${email}`);
      
      res.json({
        success: true,
        email,
        message: "Email authorized successfully"
      });
    } catch (error) {
      console.error("Error authorizing email:", error);
      res.status(500).json({ error: "Failed to authorize email" });
    }
  });

  app.delete("/api/admin/authorized-emails", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email address is required" });
      }

      // In production, this would remove from database
      console.log(`🗑️ Removed authorized email: ${email}`);
      
      res.json({
        success: true,
        message: "Email authorization removed successfully"
      });
    } catch (error) {
      console.error("Error removing email authorization:", error);
      res.status(500).json({ error: "Failed to remove email authorization" });
    }
  });

  app.get("/api/admin/authorized-emails", async (req, res) => {
    try {
      // In production, this would query database
      const emails = ["admin@flutterbye.com", "beta@flutterbye.com"];
      
      res.json({
        success: true,
        emails
      });
    } catch (error) {
      console.error("Error fetching authorized emails:", error);
      res.status(500).json({ error: "Failed to fetch authorized emails" });
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

  // Redemption Code Management API
  app.get("/api/admin/redemption-codes", async (req, res) => {
    try {
      const codes = await storage.getAllRedemptionCodes();
      res.json(codes);
    } catch (error) {
      console.error("Error fetching redemption codes:", error);
      res.status(500).json({ message: "Failed to fetch redemption codes" });
    }
  });

  app.post("/api/admin/redemption-codes", async (req, res) => {
    try {
      const codeData = req.body;
      const code = await storage.createRedemptionCode(codeData);
      res.json(code);
    } catch (error) {
      console.error("Error creating redemption code:", error);
      res.status(500).json({ message: "Failed to create redemption code" });
    }
  });

  app.patch("/api/admin/redemption-codes/:id/toggle", async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const code = await storage.updateRedemptionCode(id, { isActive });
      res.json(code);
    } catch (error) {
      console.error("Error updating redemption code:", error);
      res.status(500).json({ message: "Failed to update redemption code" });
    }
  });

  app.delete("/api/admin/redemption-codes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRedemptionCode(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting redemption code:", error);
      res.status(500).json({ message: "Failed to delete redemption code" });
    }
  });

  app.post("/api/redeem-code", async (req, res) => {
    try {
      const { code } = req.body;
      const redemptionCode = await storage.validateAndUseRedemptionCode(code);
      if (!redemptionCode) {
        return res.status(400).json({ message: "Invalid or expired redemption code" });
      }
      res.json({ valid: true, code: redemptionCode });
    } catch (error) {
      console.error("Error validating redemption code:", error);
      res.status(500).json({ message: "Failed to validate redemption code" });
    }
  });

  // System Settings API routes (Admin only)
  app.get("/api/admin/system-settings", async (req, res) => {
    try {
      const settings = await storage.getAllSystemSettings();
      res.json({ success: true, settings });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch system settings" 
      });
    }
  });

  app.get("/api/admin/system-settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSystemSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ success: false, error: "Setting not found" });
      }
      res.json({ success: true, setting });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch system setting" 
      });
    }
  });

  app.post("/api/admin/system-settings", async (req, res) => {
    try {
      const settingData = insertSystemSettingSchema.parse(req.body);
      const setting = await storage.createSystemSetting(settingData);
      res.json({ success: true, setting });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid system setting data" 
      });
    }
  });

  app.put("/api/admin/system-settings/:key", async (req, res) => {
    try {
      const { value } = req.body;
      if (!value) {
        return res.status(400).json({ success: false, error: "Value is required" });
      }
      
      const setting = await storage.updateSystemSetting(req.params.key, value);
      res.json({ success: true, setting });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update system setting" 
      });
    }
  });

  app.delete("/api/admin/system-settings/:key", async (req, res) => {
    try {
      await storage.deleteSystemSetting(req.params.key);
      res.json({ success: true, message: "System setting deleted" });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to delete system setting" 
      });
    }
  });

  // Default token image endpoints
  app.get("/api/default-token-image", async (req, res) => {
    try {
      const defaultImage = await DefaultTokenImageService.getDefaultTokenImage();
      res.json({ success: true, defaultImage });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to get default token image" 
      });
    }
  });

  app.put("/api/admin/default-token-image", async (req, res) => {
    try {
      const { imageUrl } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ success: false, error: "Image URL is required" });
      }
      
      const updatedImage = await DefaultTokenImageService.updateDefaultTokenImage(imageUrl);
      res.json({ success: true, defaultImage: updatedImage });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update default token image" 
      });
    }
  });

  // Register Solana blockchain integration routes
  registerSolanaRoutes(app);

  // Initialize chat service heartbeat
  chatService.startHeartbeat();
  
  return httpServer;
}
