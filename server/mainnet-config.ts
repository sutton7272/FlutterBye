/**
 * MainNet Production Configuration Service
 * Handles production blockchain deployment for Flutterbye Platform
 */

import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

export interface MainNetConfig {
  rpcEndpoint: string;
  wsEndpoint: string;
  commitment: 'processed' | 'confirmed' | 'finalized';
  environment: 'mainnet-beta';
  explorerUrl: string;
  priorityFees: boolean;
  maxRetries: number;
  confirmationTimeout: number;
}

/**
 * Production MainNet Configuration
 */
export const MAINNET_CONFIG: MainNetConfig = {
  rpcEndpoint: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  wsEndpoint: 'wss://api.mainnet-beta.solana.com',
  commitment: 'confirmed',
  environment: 'mainnet-beta',
  explorerUrl: 'https://explorer.solana.com',
  priorityFees: true,
  maxRetries: 3,
  confirmationTimeout: 60000 // 60 seconds
};

/**
 * Production MainNet Service for Enterprise Operations
 */
export class MainNetService {
  private connection: Connection;
  private config: MainNetConfig;
  private isProduction: boolean;

  constructor(customConfig?: Partial<MainNetConfig>) {
    this.config = { ...MAINNET_CONFIG, ...customConfig };
    this.isProduction = process.env.NODE_ENV === 'production';
    
    // Create production-optimized connection
    this.connection = new Connection(
      this.config.rpcEndpoint,
      {
        commitment: this.config.commitment,
        maxSupportedTransactionVersion: 0,
        httpHeaders: {
          'User-Agent': 'Flutterbye-Enterprise/1.0'
        }
      }
    );

    if (this.isProduction) {
      console.log('🚀 MainNet Production Service initialized');
      console.log('🌐 RPC Endpoint:', this.maskSensitiveUrl(this.config.rpcEndpoint));
      console.log('⚡ Priority fees enabled:', this.config.priorityFees);
    }
  }

  /**
   * Get MainNet connection with enterprise optimizations
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Get production configuration
   */
  getConfig(): MainNetConfig {
    return this.config;
  }

  /**
   * Validate MainNet connectivity and performance
   */
  async validateMainNetConnection(): Promise<{
    success: boolean;
    latency?: number;
    slot?: number;
    blockHeight?: number;
    error?: string;
    networkHealth: 'excellent' | 'good' | 'fair' | 'poor';
  }> {
    try {
      const start = Date.now();
      
      // Test multiple endpoints for comprehensive validation
      const [slot, blockHeight, epochInfo] = await Promise.all([
        this.connection.getSlot(),
        this.connection.getBlockHeight(),
        this.connection.getEpochInfo()
      ]);
      
      const latency = Date.now() - start;
      
      // Determine network health based on latency
      let networkHealth: 'excellent' | 'good' | 'fair' | 'poor';
      if (latency < 100) networkHealth = 'excellent';
      else if (latency < 300) networkHealth = 'good';
      else if (latency < 500) networkHealth = 'fair';
      else networkHealth = 'poor';
      
      if (slot > 0 && blockHeight > 0) {
        return {
          success: true,
          latency,
          slot,
          blockHeight,
          networkHealth
        };
      } else {
        return {
          success: false,
          error: 'Invalid network response',
          networkHealth: 'poor'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'MainNet connection failed',
        networkHealth: 'poor'
      };
    }
  }

  /**
   * Get production wallet from secure environment
   */
  getProductionWallet(): Keypair | null {
    try {
      const privateKey = process.env.SOLANA_PRIVATE_KEY;
      if (!privateKey) {
        console.warn('⚠️ SOLANA_PRIVATE_KEY not configured for production');
        return null;
      }

      const privateKeyBytes = bs58.decode(privateKey);
      const wallet = Keypair.fromSecretKey(privateKeyBytes);
      
      if (this.isProduction) {
        console.log('🔑 Production wallet loaded:', wallet.publicKey.toBase58());
      }
      
      return wallet;
    } catch (error) {
      console.error('❌ Failed to load production wallet:', error);
      return null;
    }
  }

  /**
   * Get production escrow wallet for enterprise transactions
   */
  getProductionEscrowWallet(): Keypair | null {
    try {
      const escrowKey = process.env.SOLANA_ESCROW_PRIVATE_KEY;
      if (!escrowKey) {
        console.warn('⚠️ SOLANA_ESCROW_PRIVATE_KEY not configured for production');
        return null;
      }

      const escrowKeyBytes = bs58.decode(escrowKey);
      const escrowWallet = Keypair.fromSecretKey(escrowKeyBytes);
      
      if (this.isProduction) {
        console.log('🏦 Production escrow wallet loaded:', escrowWallet.publicKey.toBase58());
      }
      
      return escrowWallet;
    } catch (error) {
      console.error('❌ Failed to load production escrow wallet:', error);
      return null;
    }
  }

  /**
   * Validate production wallet configuration
   */
  async validateProductionWallets(): Promise<{
    authority: { valid: boolean; address?: string; balance?: number };
    escrow: { valid: boolean; address?: string; balance?: number };
    errors: string[];
  }> {
    const errors: string[] = [];
    
    // Validate authority wallet
    const authorityWallet = this.getProductionWallet();
    let authorityResult = { valid: false, address: undefined as string | undefined, balance: undefined as number | undefined };
    
    if (authorityWallet) {
      try {
        const balance = await this.connection.getBalance(authorityWallet.publicKey);
        authorityResult = {
          valid: true,
          address: authorityWallet.publicKey.toBase58(),
          balance: balance / 1e9 // Convert lamports to SOL
        };
      } catch (error) {
        errors.push(`Authority wallet balance check failed: ${error}`);
      }
    } else {
      errors.push('Authority wallet not configured or invalid');
    }

    // Validate escrow wallet
    const escrowWallet = this.getProductionEscrowWallet();
    let escrowResult = { valid: false, address: undefined as string | undefined, balance: undefined as number | undefined };
    
    if (escrowWallet) {
      try {
        const balance = await this.connection.getBalance(escrowWallet.publicKey);
        escrowResult = {
          valid: true,
          address: escrowWallet.publicKey.toBase58(),
          balance: balance / 1e9 // Convert lamports to SOL
        };
      } catch (error) {
        errors.push(`Escrow wallet balance check failed: ${error}`);
      }
    } else {
      errors.push('Escrow wallet not configured or invalid');
    }

    return {
      authority: authorityResult,
      escrow: escrowResult,
      errors
    };
  }

  /**
   * Get network status and performance metrics
   */
  async getNetworkStatus() {
    try {
      const [epochInfo, supply, fees] = await Promise.all([
        this.connection.getEpochInfo(),
        this.connection.getSupply(),
        this.connection.getRecentPrioritizationFees()
      ]);

      return {
        epoch: epochInfo.epoch,
        slotIndex: epochInfo.slotIndex,
        slotsInEpoch: epochInfo.slotsInEpoch,
        totalSupply: supply.value.total,
        circulatingSupply: supply.value.circulating,
        averagePriorityFee: fees.length > 0 ? 
          fees.reduce((sum, fee) => sum + fee.prioritizationFee, 0) / fees.length : 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to get network status: ${error}`);
    }
  }

  /**
   * Mask sensitive URLs for logging
   */
  private maskSensitiveUrl(url: string): string {
    // Replace API keys with asterisks
    return url.replace(/api-key=[^&]+/, 'api-key=***');
  }

  /**
   * Check if we're running on MainNet
   */
  isMainNet(): boolean {
    return this.config.environment === 'mainnet-beta';
  }

  /**
   * Get production readiness score
   */
  async getProductionReadinessScore(): Promise<{
    score: number; // 0-100
    checks: Record<string, boolean>;
    recommendations: string[];
  }> {
    const checks: Record<string, boolean> = {};
    const recommendations: string[] = [];

    // Check RPC endpoint
    const connectionTest = await this.validateMainNetConnection();
    checks.rpcConnection = connectionTest.success;
    if (!connectionTest.success) {
      recommendations.push('Fix RPC endpoint connectivity');
    }

    // Check wallet configuration
    const walletValidation = await this.validateProductionWallets();
    checks.authorityWallet = walletValidation.authority.valid;
    checks.escrowWallet = walletValidation.escrow.valid;
    
    if (!walletValidation.authority.valid) {
      recommendations.push('Configure production authority wallet');
    }
    if (!walletValidation.escrow.valid) {
      recommendations.push('Configure production escrow wallet');
    }

    // Check environment configuration
    checks.environmentConfig = process.env.NODE_ENV === 'production';
    if (!checks.environmentConfig) {
      recommendations.push('Set NODE_ENV=production for deployment');
    }

    // Check priority fees configuration
    checks.priorityFees = this.config.priorityFees;
    if (!checks.priorityFees) {
      recommendations.push('Enable priority fees for MainNet');
    }

    // Calculate score
    const totalChecks = Object.keys(checks).length;
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const score = Math.round((passedChecks / totalChecks) * 100);

    return {
      score,
      checks,
      recommendations
    };
  }
}

// Export singleton instance
export const mainNetService = new MainNetService();