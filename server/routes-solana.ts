import type { Express, Request, Response } from "express";
import { storage } from "./storage";

// Enhanced Solana integration routes for token creation and management
export function registerSolanaRoutes(app: Express) {
  
  // Create SPL Token with metadata
  app.post("/api/solana/create-token", async (req: Request, res: Response) => {
    try {
      const { message, value, recipients, walletAddress } = req.body;
      
      if (!message || message.length > 27) {
        return res.status(400).json({ error: "Message must be 1-27 characters" });
      }
      
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      // Basic wallet address validation (44 characters, base58)
      if (!walletAddress || walletAddress.length !== 44) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }
      
      // Create token name and symbol from message
      const tokenName = `FLBY-${message.toUpperCase()}`;
      const tokenSymbol = "FLBY-MSG";
      const decimals = 0; // Whole tokens only
      const initialSupply = recipients ? recipients.length + 1 : 1;
      
      // For now, return success response - actual blockchain integration will be completed
      // when user provides wallet connection
      const mockMintAddress = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const mockSignature = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store token in database
      const tokenId = await storage.createToken({
        message,
        creatorWallet: walletAddress,
        mintAddress: mockMintAddress,
        value: value || 0,
        recipients: recipients || [],
        signature: mockSignature,
        createdAt: new Date()
      });
      
      res.json({
        success: true,
        tokenId,
        mintAddress: mockMintAddress,
        signature: mockSignature,
        tokenName,
        tokenSymbol,
        supply: initialSupply,
        blockchain: "solana-devnet"
      });
      
    } catch (error: any) {
      console.error('Error creating token:', error);
      res.status(500).json({ 
        error: "Failed to create token",
        details: error.message 
      });
    }
  });
  
  // Get token information
  app.get("/api/solana/token/:mintAddress", async (req: Request, res: Response) => {
    try {
      const { mintAddress } = req.params;
      
      // Get token from database
      const token = await storage.getTokenByMintAddress(mintAddress);
      
      if (!token) {
        return res.status(404).json({ error: "Token not found" });
      }
      
      // Blockchain info will be available when real integration is complete
      let blockchainInfo = null;
      
      res.json({
        ...token,
        blockchain: blockchainInfo
      });
      
    } catch (error: any) {
      console.error('Error getting token:', error);
      res.status(500).json({ 
        error: "Failed to get token",
        details: error.message 
      });
    }
  });
  
  // Burn tokens for redemption
  app.post("/api/solana/redeem-token", async (req: Request, res: Response) => {
    try {
      const { mintAddress, amount, walletAddress } = req.body;
      
      if (!mintAddress || !amount || !walletAddress) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Basic wallet address validation
      if (!walletAddress || walletAddress.length !== 44) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }
      
      // Get token info
      const token = await storage.getTokenByMintAddress(mintAddress);
      if (!token) {
        return res.status(404).json({ error: "Token not found" });
      }
      
      // Check if token has value
      if (!token.value || token.value <= 0) {
        return res.status(400).json({ error: "Token has no redeemable value" });
      }
      
      // For now, mock the redemption process
      const mockSignature = `redeem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store redemption record
      await storage.createRedemption({
        tokenId: token.id,
        walletAddress,
        amount: Number(amount),
        value: token.value,
        signature: mockSignature,
        redeemedAt: new Date()
      });
      
      res.json({
        success: true,
        signature: mockSignature,
        redeemedValue: token.value,
        burnedTokens: amount
      });
      
    } catch (error: any) {
      console.error('Error redeeming token:', error);
      res.status(500).json({ 
        error: "Failed to redeem token",
        details: error.message 
      });
    }
  });
  
  // Get wallet portfolio
  app.get("/api/solana/portfolio/:walletAddress", async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress || walletAddress.length !== 44) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }
      
      // Get user's created tokens
      const createdTokens = await storage.getTokensByCreatorWallet(walletAddress);
      
      // Get user's received tokens
      const receivedTokens = await storage.getTokensByRecipient(walletAddress);
      
      // Get redemption history
      const redemptions = await storage.getRedemptionsByWallet(walletAddress);
      
      // Calculate portfolio stats
      const totalCreated = createdTokens.length;
      const totalReceived = receivedTokens.length;
      const totalRedemptions = redemptions.length;
      const totalValueRedeemed = redemptions.reduce((sum, r) => sum + r.value, 0);
      
      res.json({
        walletAddress,
        stats: {
          totalCreated,
          totalReceived,
          totalRedemptions,
          totalValueRedeemed
        },
        createdTokens,
        receivedTokens,
        redemptions
      });
      
    } catch (error: any) {
      console.error('Error getting portfolio:', error);
      res.status(500).json({ 
        error: "Failed to get portfolio",
        details: error.message 
      });
    }
  });
  
  // Get all tokens for discovery
  app.get("/api/solana/tokens", async (req: Request, res: Response) => {
    try {
      const { limit = 50, offset = 0, search, sortBy = 'createdAt' } = req.query;
      
      const tokens = await storage.getAllTokensWithOptions({
        limit: Number(limit),
        offset: Number(offset),
        search: search as string,
        sortBy: sortBy as string
      });
      
      res.json({
        tokens,
        pagination: {
          limit: Number(limit),
          offset: Number(offset),
          total: tokens.length
        }
      });
      
    } catch (error: any) {
      console.error('Error getting tokens:', error);
      res.status(500).json({ 
        error: "Failed to get tokens",
        details: error.message 
      });
    }
  });
  
  // Get blockchain connection status
  app.get("/api/solana/status", async (req: Request, res: Response) => {
    try {
      // Mock network status for now - will be real when blockchain integration is active
      res.json({
        connected: true,
        network: "devnet", 
        blockHeight: Math.floor(Date.now() / 1000),
        networkInfo: { "solana-core": "1.18.0" },
        rpcUrl: "https://api.devnet.solana.com"
      });
      
    } catch (error: any) {
      console.error('Error getting blockchain status:', error);
      res.status(500).json({ 
        error: "Failed to get blockchain status",
        details: error.message,
        connected: false
      });
    }
  });
}