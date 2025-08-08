import { storage } from './storage';

export interface EscrowFeeConfig {
  depositFeePercentage: number;
  withdrawalFeePercentage: number;
  minimumDepositFee: number; // in SOL
  minimumWithdrawalFee: number; // in SOL
  maximumDepositFee: number; // in SOL
  maximumWithdrawalFee: number; // in SOL
  currency: 'SOL' | 'USDC' | 'FLBY';
}

export class EscrowFeeService {
  private defaultFees: Record<string, EscrowFeeConfig> = {
    SOL: {
      depositFeePercentage: 0.5, // 0.5%
      withdrawalFeePercentage: 0.5, // 0.5%
      minimumDepositFee: 0.001, // 0.001 SOL
      minimumWithdrawalFee: 0.001, // 0.001 SOL
      maximumDepositFee: 1.0, // 1 SOL
      maximumWithdrawalFee: 1.0, // 1 SOL
      currency: 'SOL'
    },
    USDC: {
      depositFeePercentage: 0.5, // 0.5%
      withdrawalFeePercentage: 0.5, // 0.5%
      minimumDepositFee: 0.1, // $0.10
      minimumWithdrawalFee: 0.1, // $0.10
      maximumDepositFee: 100, // $100
      maximumWithdrawalFee: 100, // $100
      currency: 'USDC'
    },
    FLBY: {
      depositFeePercentage: 0.25, // 0.25% (reduced for native token)
      withdrawalFeePercentage: 0.25, // 0.25%
      minimumDepositFee: 1, // 1 FLBY
      minimumWithdrawalFee: 1, // 1 FLBY
      maximumDepositFee: 1000, // 1000 FLBY
      maximumWithdrawalFee: 1000, // 1000 FLBY
      currency: 'FLBY'
    }
  };

  async getFeeConfig(currency: string): Promise<EscrowFeeConfig> {
    try {
      // Try to get custom fee config from database
      const customConfig = await storage.getEscrowFeeConfig(currency);
      if (customConfig) {
        return customConfig;
      }
    } catch (error) {
      console.log(`No custom fee config for ${currency}, using defaults`);
    }

    // Return default config
    return this.defaultFees[currency] || this.defaultFees.SOL;
  }

  async updateFeeConfig(currency: string, config: Partial<EscrowFeeConfig>): Promise<EscrowFeeConfig> {
    const currentConfig = await this.getFeeConfig(currency);
    const updatedConfig = { ...currentConfig, ...config, currency: currency as 'SOL' | 'USDC' | 'FLBY' };
    
    await storage.updateEscrowFeeConfig(currency, updatedConfig);
    return updatedConfig;
  }

  async getAllFeeConfigs(): Promise<Record<string, EscrowFeeConfig>> {
    const configs: Record<string, EscrowFeeConfig> = {};
    
    for (const currency of ['SOL', 'USDC', 'FLBY']) {
      configs[currency] = await this.getFeeConfig(currency);
    }
    
    return configs;
  }

  calculateDepositFee(amount: number, currency: string, config: EscrowFeeConfig): number {
    const percentageFee = amount * (config.depositFeePercentage / 100);
    return Math.max(
      config.minimumDepositFee,
      Math.min(config.maximumDepositFee, percentageFee)
    );
  }

  calculateWithdrawalFee(amount: number, currency: string, config: EscrowFeeConfig): number {
    const percentageFee = amount * (config.withdrawalFeePercentage / 100);
    return Math.max(
      config.minimumWithdrawalFee,
      Math.min(config.maximumWithdrawalFee, percentageFee)
    );
  }

  async getDepositFee(amount: number, currency: string): Promise<{ fee: number; config: EscrowFeeConfig }> {
    const config = await this.getFeeConfig(currency);
    const fee = this.calculateDepositFee(amount, currency, config);
    return { fee, config };
  }

  async getWithdrawalFee(amount: number, currency: string): Promise<{ fee: number; config: EscrowFeeConfig }> {
    const config = await this.getFeeConfig(currency);
    const fee = this.calculateWithdrawalFee(amount, currency, config);
    return { fee, config };
  }
}

export const escrowFeeService = new EscrowFeeService();