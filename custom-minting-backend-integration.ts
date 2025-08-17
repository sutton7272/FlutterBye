// Custom Minting Backend Integration Template
// Replace server/solana-service.ts with this implementation

import { Request, Response } from 'express';
import axios from 'axios';

interface CustomMintingConfig {
  apiUrl: string;
  apiKey: string;
  network: 'devnet' | 'mainnet-beta';
}

interface MintTokenRequest {
  name: string;
  symbol: string;
  description: string;
  image?: string;
  supply: number;
  walletAddress: string;
  metadata?: Record<string, any>;
}

interface MintTokenResponse {
  success: boolean;
  tokenAddress: string;
  transactionSignature: string;
  error?: string;
}

interface TransferTokenRequest {
  tokenAddress: string;
  fromWallet: string;
  toWallet: string;
  amount: number;
  memo?: string;
}

export class CustomMintingService {
  private config: CustomMintingConfig;

  constructor() {
    this.config = {
      apiUrl: process.env.MINTING_API_URL || 'https://your-custom-minting-api.com',
      apiKey: process.env.MINTING_API_KEY || '',
      network: process.env.SOLANA_NETWORK as 'devnet' | 'mainnet-beta' || 'mainnet-beta'
    };
  }

  private async makeApiRequest(endpoint: string, data: any) {
    try {
      const response = await axios.post(`${this.config.apiUrl}${endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'X-Network': this.config.network
        },
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error(`Minting API error for ${endpoint}:`, error);
      throw new Error(`Minting service error: ${error.message}`);
    }
  }

  // Create a new SPL token
  async createToken(params: MintTokenRequest): Promise<MintTokenResponse> {
    return await this.makeApiRequest('/api/v1/tokens/create', {
      name: params.name,
      symbol: params.symbol,
      description: params.description,
      image: params.image,
      supply: params.supply,
      wallet_address: params.walletAddress,
      metadata: params.metadata || {},
      network: this.config.network
    });
  }

  // Transfer tokens between wallets
  async transferToken(params: TransferTokenRequest): Promise<{ success: boolean; signature: string }> {
    return await this.makeApiRequest('/api/v1/tokens/transfer', {
      token_address: params.tokenAddress,
      from_wallet: params.fromWallet,
      to_wallet: params.toWallet,
      amount: params.amount,
      memo: params.memo || '',
      network: this.config.network
    });
  }

  // Get token balance for a wallet
  async getTokenBalance(walletAddress: string, tokenAddress?: string) {
    return await this.makeApiRequest('/api/v1/wallets/balance', {
      wallet_address: walletAddress,
      token_address: tokenAddress,
      network: this.config.network
    });
  }

  // Burn tokens for redemption
  async burnTokens(tokenAddress: string, walletAddress: string, amount: number) {
    return await this.makeApiRequest('/api/v1/tokens/burn', {
      token_address: tokenAddress,
      wallet_address: walletAddress,
      amount: amount,
      network: this.config.network
    });
  }

  // Get transaction status
  async getTransactionStatus(signature: string) {
    return await this.makeApiRequest('/api/v1/transactions/status', {
      signature: signature,
      network: this.config.network
    });
  }

  // Validate wallet address
  async validateWallet(walletAddress: string) {
    return await this.makeApiRequest('/api/v1/wallets/validate', {
      wallet_address: walletAddress,
      network: this.config.network
    });
  }
}

// API Routes for FlutterBye integration
export const setupCustomMintingRoutes = (app: any) => {
  const mintingService = new CustomMintingService();

  // Create token endpoint
  app.post('/api/solana/create-token', async (req: Request, res: Response) => {
    try {
      const { name, symbol, description, image, supply, walletAddress, metadata } = req.body;
      
      const result = await mintingService.createToken({
        name,
        symbol,
        description,
        image,
        supply,
        walletAddress,
        metadata
      });

      res.json(result);
    } catch (error) {
      console.error('Token creation error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Transfer token endpoint
  app.post('/api/solana/transfer', async (req: Request, res: Response) => {
    try {
      const { tokenAddress, fromWallet, toWallet, amount, memo } = req.body;
      
      const result = await mintingService.transferToken({
        tokenAddress,
        fromWallet,
        toWallet,
        amount,
        memo
      });

      res.json(result);
    } catch (error) {
      console.error('Token transfer error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Get balance endpoint
  app.get('/api/solana/balance/:walletAddress', async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.params;
      const { tokenAddress } = req.query;
      
      const result = await mintingService.getTokenBalance(
        walletAddress, 
        tokenAddress as string
      );

      res.json(result);
    } catch (error) {
      console.error('Balance check error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Burn tokens endpoint
  app.post('/api/solana/burn', async (req: Request, res: Response) => {
    try {
      const { tokenAddress, walletAddress, amount } = req.body;
      
      const result = await mintingService.burnTokens(
        tokenAddress,
        walletAddress,
        amount
      );

      res.json(result);
    } catch (error) {
      console.error('Token burn error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Transaction status endpoint
  app.get('/api/solana/transaction/:signature', async (req: Request, res: Response) => {
    try {
      const { signature } = req.params;
      
      const result = await mintingService.getTransactionStatus(signature);

      res.json(result);
    } catch (error) {
      console.error('Transaction status error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Validate wallet endpoint
  app.post('/api/solana/validate-wallet', async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.body;
      
      const result = await mintingService.validateWallet(walletAddress);

      res.json(result);
    } catch (error) {
      console.error('Wallet validation error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  console.log('✅ Custom minting backend routes registered');
};