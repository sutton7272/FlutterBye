/**
 * DevNet Configuration Service
 * Ensures all blockchain operations use DevNet endpoints and settings
 */

import { Connection, PublicKey } from '@solana/web3.js';

export interface DevNetConfig {
  rpcEndpoint: string;
  wsEndpoint: string;
  commitment: 'processed' | 'confirmed' | 'finalized';
  environment: 'devnet';
  faucetUrl?: string;
  explorerUrl: string;
}

/**
 * DevNet Configuration
 */
export const DEVNET_CONFIG: DevNetConfig = {
  rpcEndpoint: 'https://api.devnet.solana.com',
  wsEndpoint: 'wss://api.devnet.solana.com',
  commitment: 'confirmed',
  environment: 'devnet',
  faucetUrl: 'https://faucet.solana.com',
  explorerUrl: 'https://explorer.solana.com'
};

/**
 * DevNet Connection Service
 */
export class DevNetService {
  private connection: Connection;
  private config: DevNetConfig;

  constructor(customConfig?: Partial<DevNetConfig>) {
    this.config = { ...DEVNET_CONFIG, ...customConfig };
    this.connection = new Connection(
      this.config.rpcEndpoint,
      this.config.commitment
    );
  }

  /**
   * Get DevNet connection
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Get current configuration
   */
  getConfig(): DevNetConfig {
    return this.config;
  }

  /**
   * Validate DevNet connectivity
   */
  async validateConnection(): Promise<{ success: boolean; latency?: number; error?: string }> {
    try {
      const start = Date.now();
      const slot = await this.connection.getSlot();
      const latency = Date.now() - start;
      
      if (slot > 0) {
        return { success: true, latency };
      } else {
        return { success: false, error: 'Invalid slot number' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown connection error'
      };
    }
  }

  /**
   * Get network info for verification
   */
  async getNetworkInfo(): Promise<{
    cluster: string;
    slot: number;
    blockHeight: number;
    epochInfo: any;
  }> {
    const [slot, blockHeight, epochInfo] = await Promise.all([
      this.connection.getSlot(),
      this.connection.getBlockHeight(),
      this.connection.getEpochInfo()
    ]);

    return {
      cluster: 'devnet',
      slot,
      blockHeight,
      epochInfo
    };
  }

  /**
   * Verify wallet has sufficient SOL for transactions
   */
  async checkWalletBalance(walletAddress: string, requiredSOL: number = 0.01): Promise<{
    hasBalance: boolean;
    balance: number;
    required: number;
  }> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      const balanceSOL = balance / 1e9; // Convert lamports to SOL

      return {
        hasBalance: balanceSOL >= requiredSOL,
        balance: balanceSOL,
        required: requiredSOL
      };
    } catch (error) {
      console.error('Error checking wallet balance:', error);
      return {
        hasBalance: false,
        balance: 0,
        required: requiredSOL
      };
    }
  }

  /**
   * Generate DevNet faucet request URL
   */
  getFaucetUrl(walletAddress: string): string {
    return `${this.config.faucetUrl}?address=${walletAddress}`;
  }

  /**
   * Generate DevNet explorer URL for transaction
   */
  getExplorerUrl(signature: string): string {
    return `${this.config.explorerUrl}/tx/${signature}?cluster=devnet`;
  }

  /**
   * Test DevNet transaction simulation
   */
  async simulateTransaction(transaction: any): Promise<{
    success: boolean;
    error?: string;
    logs?: string[];
  }> {
    try {
      const simulation = await this.connection.simulateTransaction(transaction);
      
      return {
        success: !simulation.value.err,
        error: simulation.value.err?.toString(),
        logs: simulation.value.logs || []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Simulation failed'
      };
    }
  }
}

// Global DevNet service instance
export const devNetService = new DevNetService();

/**
 * DevNet health check utility
 */
export async function performDevNetHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'down';
  checks: {
    connection: boolean;
    latency: number;
    blockHeight: number;
  };
  details: any;
}> {
  try {
    const connection = devNetService.getConnection();
    const start = Date.now();
    
    const [slot, blockHeight, epochInfo] = await Promise.all([
      connection.getSlot(),
      connection.getBlockHeight(),
      connection.getEpochInfo()
    ]);
    
    const latency = Date.now() - start;
    
    const isHealthy = slot > 0 && blockHeight > 0 && latency < 2000;
    const status = isHealthy ? 'healthy' : latency > 5000 ? 'down' : 'degraded';
    
    return {
      status,
      checks: {
        connection: true,
        latency,
        blockHeight
      },
      details: {
        slot,
        blockHeight,
        epochInfo,
        endpoint: DEVNET_CONFIG.rpcEndpoint
      }
    };
  } catch (error) {
    return {
      status: 'down',
      checks: {
        connection: false,
        latency: -1,
        blockHeight: -1
      },
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        endpoint: DEVNET_CONFIG.rpcEndpoint
      }
    };
  }
}