// Production environment configuration
import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // Solana
  SOLANA_RPC_URL: z.string().url().optional(),
  SOLANA_PRIVATE_KEY: z.string().optional(),
  
  // External APIs (optional in development)
  OPENAI_API_KEY: z.string().optional(),
  HELIUS_API_KEY: z.string().optional(),
  
  // Security
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters').optional(),
  
  // Features flags
  ENABLE_RATE_LIMITING: z.string().transform(val => val === 'true').default('true'),
  ENABLE_MONITORING: z.string().transform(val => val === 'true').default('true'),
  ENABLE_ADMIN_PANEL: z.string().transform(val => val === 'true').default('true'),
  
  // Admin configuration
  ADMIN_WALLET_ADDRESSES: z.string().optional(),
  FEE_COLLECTION_WALLET: z.string().optional(),
  DEFAULT_MINTING_FEE_PERCENTAGE: z.string().transform(Number).default('2.5'),
  DEFAULT_REDEMPTION_FEE_PERCENTAGE: z.string().transform(Number).default('1.0'),
});

// Parse and validate environment variables
function validateEnvironment() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnvironment();

// Configuration derived from environment
export const config = {
  // Server
  port: env.PORT,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  
  // Database
  database: {
    url: env.DATABASE_URL,
  },
  
  // Solana
  solana: {
    rpcUrl: env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    network: env.NODE_ENV === 'production' ? 'mainnet-beta' : 'devnet',
    privateKey: env.SOLANA_PRIVATE_KEY,
  },
  
  // External APIs
  apis: {
    openai: env.OPENAI_API_KEY,
    helius: env.HELIUS_API_KEY,
  },
  
  // Security
  security: {
    sessionSecret: env.SESSION_SECRET || 'dev-session-secret-change-in-production',
    enableRateLimiting: env.ENABLE_RATE_LIMITING,
    adminWallets: env.ADMIN_WALLET_ADDRESSES?.split(',').map(addr => addr.trim()) || [],
  },
  
  // Features
  features: {
    monitoring: env.ENABLE_MONITORING,
    adminPanel: env.ENABLE_ADMIN_PANEL,
  },
  
  // Business
  business: {
    feeCollectionWallet: env.FEE_COLLECTION_WALLET,
    mintingFeePercentage: env.DEFAULT_MINTING_FEE_PERCENTAGE,
    redemptionFeePercentage: env.DEFAULT_REDEMPTION_FEE_PERCENTAGE,
  },
};

// Runtime configuration checks
export function validateRuntimeConfig() {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Check critical production settings
  if (config.isProduction) {
    if (!env.SESSION_SECRET || env.SESSION_SECRET === 'dev-session-secret-change-in-production') {
      errors.push('SESSION_SECRET must be set in production');
    }
    
    if (!config.business.feeCollectionWallet) {
      warnings.push('FEE_COLLECTION_WALLET not set - fees will not be collected');
    }
    
    if (config.security.adminWallets.length === 0) {
      warnings.push('No admin wallet addresses configured');
    }
    
    if (!config.apis.openai) {
      warnings.push('OpenAI API key not configured - AI features disabled');
    }
  }
  
  // Log warnings and errors
  if (warnings.length > 0) {
    console.warn('Configuration warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  if (errors.length > 0) {
    console.error('Configuration errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    if (config.isProduction) {
      process.exit(1);
    }
  }
  
  return { warnings, errors };
}

// Export types for TypeScript
export type Config = typeof config;