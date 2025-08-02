/**
 * Production Configuration and Environment Validation
 * Ensures all required environment variables and settings are properly configured
 */

export interface ProductionConfig {
  database: {
    url: string;
    host: string;
    port: string;
    user: string;
    password: string;
    name: string;
  };
  solana: {
    rpcUrl: string;
    privateKey?: string;
  };
  server: {
    port: number;
    nodeEnv: string;
  };
  features: {
    smsEnabled: boolean;
    adminWallet?: string;
  };
}

export class ProductionConfigValidator {
  private static requiredEnvVars = [
    'DATABASE_URL',
    'PGHOST',
    'PGPORT', 
    'PGUSER',
    'PGPASSWORD',
    'PGDATABASE'
  ];

  private static optionalEnvVars = [
    'SOLANA_RPC_URL',
    'SOLANA_PRIVATE_KEY',
    'HELIUS_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'ADMIN_WALLET'
  ];

  static validateEnvironment(): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required environment variables
    this.requiredEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        errors.push(`Missing required environment variable: ${envVar}`);
      }
    });

    // Check optional but recommended variables
    this.optionalEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        warnings.push(`Optional environment variable not set: ${envVar}`);
      }
    });

    // Validate NODE_ENV
    if (!process.env.NODE_ENV) {
      warnings.push('NODE_ENV not set - defaulting to development');
    } else if (!['development', 'production', 'staging'].includes(process.env.NODE_ENV)) {
      warnings.push(`Unusual NODE_ENV value: ${process.env.NODE_ENV}`);
    }

    // Validate database URL format
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
      errors.push('DATABASE_URL must be a valid PostgreSQL connection string');
    }

    // Validate Solana RPC URL format
    if (process.env.SOLANA_RPC_URL && !process.env.SOLANA_RPC_URL.startsWith('https://')) {
      warnings.push('SOLANA_RPC_URL should use HTTPS for production');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  static getProductionConfig(): ProductionConfig {
    const validation = this.validateEnvironment();
    
    if (!validation.valid) {
      throw new Error(`Invalid environment configuration: ${validation.errors.join(', ')}`);
    }

    return {
      database: {
        url: process.env.DATABASE_URL!,
        host: process.env.PGHOST!,
        port: process.env.PGPORT!,
        user: process.env.PGUSER!,
        password: process.env.PGPASSWORD!,
        name: process.env.PGDATABASE!,
      },
      solana: {
        rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        privateKey: process.env.SOLANA_PRIVATE_KEY,
      },
      server: {
        port: parseInt(process.env.PORT || '5000'),
        nodeEnv: process.env.NODE_ENV || 'development',
      },
      features: {
        smsEnabled: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
        adminWallet: process.env.ADMIN_WALLET,
      }
    };
  }

  static logConfigurationStatus(): void {
    const validation = this.validateEnvironment();
    
    console.log('🔧 Production Configuration Status:');
    console.log('=====================================');
    
    if (validation.valid) {
      console.log('✅ Environment validation: PASSED');
    } else {
      console.log('❌ Environment validation: FAILED');
      validation.errors.forEach(error => console.log(`  ❌ ${error}`));
    }
    
    if (validation.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      validation.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
    }

    console.log('\n📊 Feature Status:');
    console.log(`  Database: ${process.env.DATABASE_URL ? '✅ Connected' : '❌ Not configured'}`);
    console.log(`  Solana RPC: ${process.env.SOLANA_RPC_URL ? '✅ Custom' : '⚠️  Default DevNet'}`);
    console.log(`  SMS Integration: ${process.env.TWILIO_ACCOUNT_SID ? '✅ Enabled' : '⚠️  Disabled'}`);
    console.log(`  Admin Wallet: ${process.env.ADMIN_WALLET ? '✅ Configured' : '⚠️  Not Set'}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    
    console.log('=====================================\n');
  }
}

// Health check endpoint data
export function getHealthStatus() {
  const validation = ProductionConfigValidator.validateEnvironment();
  
  return {
    status: validation.valid ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: !!process.env.DATABASE_URL,
      status: process.env.DATABASE_URL ? 'available' : 'not configured'
    },
    solana: {
      rpc: process.env.SOLANA_RPC_URL || 'default',
      status: 'available'
    },
    features: {
      sms: process.env.TWILIO_ACCOUNT_SID ? 'enabled' : 'disabled',
      admin: process.env.ADMIN_WALLET ? 'configured' : 'not configured'
    },
    validation: {
      errors: validation.errors,
      warnings: validation.warnings
    }
  };
}