/**
 * Production Configuration Service
 * Validates and configures production environment settings
 */

export interface ProductionConfig {
  database: {
    url: string;
    maxConnections: number;
    connectionTimeout: number;
  };
  solana: {
    network: 'devnet' | 'mainnet-beta';
    rpcUrl: string;
    commitment: 'processed' | 'confirmed' | 'finalized';
  };
  security: {
    corsOrigins: string[];
    rateLimitPerMinute: number;
    sessionSecret: string;
  };
  monitoring: {
    enabled: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    metricsCollection: boolean;
  };
}

export class ProductionConfigService {
  private config: ProductionConfig;

  constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }

  private loadConfiguration(): ProductionConfig {
    return {
      database: {
        url: process.env.DATABASE_URL || '',
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000'),
      },
      solana: {
        network: (process.env.SOLANA_NETWORK as 'devnet' | 'mainnet-beta') || 'devnet',
        rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        commitment: (process.env.SOLANA_COMMITMENT as 'processed' | 'confirmed' | 'finalized') || 'confirmed',
      },
      security: {
        corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5000'],
        rateLimitPerMinute: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '100'),
        sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
      },
      monitoring: {
        enabled: process.env.NODE_ENV === 'production',
        logLevel: (process.env.LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug') || 'info',
        metricsCollection: process.env.ENABLE_METRICS === 'true',
      }
    };
  }

  private validateConfiguration(): void {
    const errors: string[] = [];

    // Database validation
    if (!this.config.database.url) {
      errors.push('DATABASE_URL is required');
    }

    // Solana validation
    if (!this.config.solana.rpcUrl) {
      errors.push('SOLANA_RPC_URL is required');
    }

    // Security validation
    if (process.env.NODE_ENV === 'production') {
      if (this.config.security.sessionSecret === 'dev-secret-change-in-production') {
        errors.push('SESSION_SECRET must be set for production');
      }
      if (this.config.security.corsOrigins.includes('http://localhost:5000')) {
        console.warn('⚠️ WARNING: localhost CORS origin detected in production');
      }
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
    }
  }

  public getConfig(): ProductionConfig {
    return { ...this.config };
  }

  public isDevelopment(): boolean {
    return process.env.NODE_ENV !== 'production';
  }

  public isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  public getHealthStatus() {
    return {
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: !!this.config.database.url,
        maxConnections: this.config.database.maxConnections,
      },
      solana: {
        network: this.config.solana.network,
        rpcEndpoint: this.config.solana.rpcUrl,
      },
      security: {
        corsConfigured: this.config.security.corsOrigins.length > 0,
        rateLimitEnabled: this.config.security.rateLimitPerMinute > 0,
      },
      monitoring: {
        enabled: this.config.monitoring.enabled,
        logLevel: this.config.monitoring.logLevel,
      }
    };
  }
}

export const productionConfig = new ProductionConfigService();