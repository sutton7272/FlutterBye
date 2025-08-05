// Production Configuration and Environment Validation
import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  // Add other required environment variables
});

// Validate environment variables
export const validateEnvironment = () => {
  try {
    const env = envSchema.parse(process.env);
    console.log('✅ Environment validation passed');
    return env;
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        console.error(`- ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

// Production configuration
export const productionConfig = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '5000'),
    host: process.env.HOST || '0.0.0.0',
    timeout: 30000,
    keepAliveTimeout: 5000,
  },
  
  // Security configuration
  security: {
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 1000,
      skipSuccessfulRequests: false,
    },
    cors: {
      maxAge: 86400, // 24 hours
      credentials: true,
    },
    headers: {
      hsts: true,
      noSniff: true,
      xssProtection: true,
    },
  },
  
  // Performance configuration
  performance: {
    compression: {
      level: 6,
      threshold: 1024,
    },
    caching: {
      defaultTTL: 300000, // 5 minutes
      maxEntries: 1000,
    },
    memory: {
      maxHeapSize: 512, // MB
      gcThreshold: 300, // MB
    },
  },
  
  // Monitoring configuration
  monitoring: {
    healthCheck: {
      interval: 30000, // 30 seconds
      timeout: 5000,
    },
    metrics: {
      retention: 24 * 60 * 60 * 1000, // 24 hours
      aggregationInterval: 60000, // 1 minute
    },
    alerts: {
      errorRate: 0.05, // 5%
      responseTime: 1000, // 1 second
      memoryUsage: 400, // MB
    },
  },
  
  // Database configuration
  database: {
    pool: {
      min: 2,
      max: 20,
      idle: 30000,
      acquire: 60000,
    },
    query: {
      timeout: 30000,
      maxRetries: 3,
    },
  },
};

// Feature flags for production
export const featureFlags = {
  enableMetrics: process.env.ENABLE_METRICS !== 'false',
  enableAuditLogs: process.env.ENABLE_AUDIT_LOGS !== 'false',
  enableHealthChecks: process.env.ENABLE_HEALTH_CHECKS !== 'false',
  enableCaching: process.env.ENABLE_CACHING !== 'false',
  enableRateLimiting: process.env.ENABLE_RATE_LIMITING !== 'false',
};

// Logging configuration
export const loggingConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
  maxFiles: 10,
  maxSize: '10m',
};

// Export configuration based on environment
export const getConfig = () => {
  const env = validateEnvironment();
  
  return {
    ...productionConfig,
    env,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
  };
};