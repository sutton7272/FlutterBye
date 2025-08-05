// Dual Environment Configuration for Flutterbye
// Supports simultaneous DevNet testing and MainNet production

export type SolanaNetwork = 'devnet' | 'mainnet-beta';

export interface EnvironmentConfig {
  network: SolanaNetwork;
  rpcEndpoint: string;
  wsEndpoint: string;
  isProduction: boolean;
  allowedFeatures: string[];
  walletConfig: WalletConfig;
  databaseSchema: string;
}

export interface WalletConfig {
  programId: string;
  tokenMintAuthority: string;
  escrowWallet: string;
  feeCollectionWallet: string;
}

// DevNet Configuration
export const DEVNET_CONFIG: EnvironmentConfig = {
  network: 'devnet',
  rpcEndpoint: 'https://api.devnet.solana.com',
  wsEndpoint: 'wss://api.devnet.solana.com',
  isProduction: false,
  allowedFeatures: [
    'token_creation',
    'testing_features',
    'experimental_features',
    'debug_mode',
    'mock_payments',
    'development_tools'
  ],
  walletConfig: {
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    tokenMintAuthority: 'DevNetMintAuthority1234567890',
    escrowWallet: 'DevNetEscrowWallet1234567890',
    feeCollectionWallet: 'DevNetFeeWallet1234567890'
  },
  databaseSchema: 'devnet'
};

// MainNet Configuration
export const MAINNET_CONFIG: EnvironmentConfig = {
  network: 'mainnet-beta',
  rpcEndpoint: process.env.MAINNET_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
  wsEndpoint: process.env.MAINNET_WS_ENDPOINT || 'wss://api.mainnet-beta.solana.com',
  isProduction: true,
  allowedFeatures: [
    'token_creation',
    'enterprise_features',
    'payment_processing',
    'revenue_collection',
    'compliance_features',
    'audit_logging'
  ],
  walletConfig: {
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    tokenMintAuthority: process.env.MAINNET_MINT_AUTHORITY || '',
    escrowWallet: process.env.MAINNET_ESCROW_WALLET || '',
    feeCollectionWallet: process.env.MAINNET_FEE_WALLET || ''
  },
  databaseSchema: 'mainnet'
};

// Environment Detection and Selection
export function getCurrentEnvironment(): EnvironmentConfig {
  const networkMode = process.env.SOLANA_NETWORK as SolanaNetwork || 'devnet';
  
  switch (networkMode) {
    case 'mainnet-beta':
      return MAINNET_CONFIG;
    case 'devnet':
    default:
      return DEVNET_CONFIG;
  }
}

// Feature Flag Checking
export function isFeatureAllowed(feature: string): boolean {
  const config = getCurrentEnvironment();
  return config.allowedFeatures.includes(feature);
}

// Environment-Specific Database Schema
export function getDatabaseSchema(): string {
  return getCurrentEnvironment().databaseSchema;
}

// Safe Environment Switching
export function switchEnvironment(network: SolanaNetwork): EnvironmentConfig {
  process.env.SOLANA_NETWORK = network;
  return getCurrentEnvironment();
}

// Environment Validation
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const config = getCurrentEnvironment();
  const errors: string[] = [];

  if (config.isProduction) {
    // Validate MainNet requirements
    if (!config.walletConfig.tokenMintAuthority) {
      errors.push('MainNet mint authority not configured');
    }
    if (!config.walletConfig.escrowWallet) {
      errors.push('MainNet escrow wallet not configured');
    }
    if (!config.walletConfig.feeCollectionWallet) {
      errors.push('MainNet fee collection wallet not configured');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Environment Status
export function getEnvironmentStatus() {
  const config = getCurrentEnvironment();
  const validation = validateEnvironment();
  
  return {
    network: config.network,
    isProduction: config.isProduction,
    rpcEndpoint: config.rpcEndpoint,
    databaseSchema: config.databaseSchema,
    featuresEnabled: config.allowedFeatures.length,
    isValid: validation.isValid,
    errors: validation.errors,
    timestamp: new Date().toISOString()
  };
}

// Environment-Specific Token Operations
export interface TokenOperationConfig {
  canCreateTokens: boolean;
  canProcessPayments: boolean;
  canCollectFees: boolean;
  maxTransactionValue: number;
  requiresApproval: boolean;
}

export function getTokenOperationConfig(): TokenOperationConfig {
  const config = getCurrentEnvironment();
  
  if (config.isProduction) {
    return {
      canCreateTokens: true,
      canProcessPayments: true,
      canCollectFees: true,
      maxTransactionValue: 1000000, // $1M max for enterprise
      requiresApproval: true
    };
  } else {
    return {
      canCreateTokens: true,
      canProcessPayments: false, // No real payments on DevNet
      canCollectFees: false,
      maxTransactionValue: 1000, // Test limit
      requiresApproval: false
    };
  }
}

export default {
  getCurrentEnvironment,
  isFeatureAllowed,
  getDatabaseSchema,
  switchEnvironment,
  validateEnvironment,
  getEnvironmentStatus,
  getTokenOperationConfig,
  DEVNET_CONFIG,
  MAINNET_CONFIG
};