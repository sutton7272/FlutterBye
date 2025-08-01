import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTokenSchema, insertAirdropSignupSchema, insertTransactionSchema, insertMarketListingSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
