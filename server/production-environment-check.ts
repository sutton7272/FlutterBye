/**
 * Production Environment Check
 * Validates that all necessary environment variables and configurations are set for production deployment
 */

export interface ProductionCheckResult {
  status: 'ready' | 'warning' | 'not_ready';
  score: number;
  checks: {
    category: string;
    name: string;
    status: 'pass' | 'warning' | 'fail';
    message: string;
    required: boolean;
  }[];
  summary: {
    total: number;
    passed: number;
    warnings: number;
    failed: number;
    requiredFailed: number;
  };
  recommendations: string[];
}

export class ProductionEnvironmentCheck {
  
  static async performComprehensiveCheck(): Promise<ProductionCheckResult> {
    const checks: ProductionCheckResult['checks'] = [];
    const recommendations: string[] = [];

    // 1. Core Environment Variables
    this.checkCoreEnvironment(checks, recommendations);
    
    // 2. Database Configuration
    this.checkDatabaseConfig(checks, recommendations);
    
    // 3. Blockchain Configuration
    this.checkBlockchainConfig(checks, recommendations);
    
    // 4. External API Keys
    this.checkExternalAPIs(checks, recommendations);
    
    // 5. Security Configuration
    this.checkSecurityConfig(checks, recommendations);
    
    // 6. Performance Configuration
    this.checkPerformanceConfig(checks, recommendations);

    // Calculate summary
    const summary = {
      total: checks.length,
      passed: checks.filter(c => c.status === 'pass').length,
      warnings: checks.filter(c => c.status === 'warning').length,
      failed: checks.filter(c => c.status === 'fail').length,
      requiredFailed: checks.filter(c => c.status === 'fail' && c.required).length
    };

    // Calculate score (0-100)
    const score = Math.round(
      (summary.passed + (summary.warnings * 0.5)) / summary.total * 100
    );

    // Determine overall status
    let status: 'ready' | 'warning' | 'not_ready';
    if (summary.requiredFailed > 0) {
      status = 'not_ready';
    } else if (summary.warnings > 0 || summary.failed > 0) {
      status = 'warning';
    } else {
      status = 'ready';
    }

    return {
      status,
      score,
      checks,
      summary,
      recommendations
    };
  }

  private static checkCoreEnvironment(checks: ProductionCheckResult['checks'], recommendations: string[]) {
    const nodeEnv = process.env.NODE_ENV;
    checks.push({
      category: 'Environment',
      name: 'NODE_ENV',
      status: nodeEnv === 'production' ? 'pass' : nodeEnv ? 'warning' : 'fail',
      message: nodeEnv ? `Set to '${nodeEnv}'` : 'Not set',
      required: true
    });

    if (nodeEnv !== 'production') {
      recommendations.push('Set NODE_ENV=production for production deployment');
    }

    // Port configuration
    const port = process.env.PORT;
    checks.push({
      category: 'Environment',
      name: 'PORT',
      status: port ? 'pass' : 'warning',
      message: port ? `Set to ${port}` : 'Using default port',
      required: false
    });
  }

  private static checkDatabaseConfig(checks: ProductionCheckResult['checks'], recommendations: string[]) {
    const dbUrl = process.env.DATABASE_URL;
    checks.push({
      category: 'Database',
      name: 'DATABASE_URL',
      status: dbUrl ? 'pass' : 'fail',
      message: dbUrl ? 'Configured' : 'Not configured',
      required: true
    });

    if (!dbUrl) {
      recommendations.push('Configure DATABASE_URL for PostgreSQL connection');
    } else {
      // Check SSL requirement for production
      if (process.env.NODE_ENV === 'production' && !dbUrl.includes('sslmode=require')) {
        checks.push({
          category: 'Database',
          name: 'SSL Configuration',
          status: 'warning',
          message: 'SSL not enforced',
          required: false
        });
        recommendations.push('Enable SSL for database connection in production');
      } else {
        checks.push({
          category: 'Database',
          name: 'SSL Configuration',
          status: 'pass',
          message: 'SSL configured',
          required: false
        });
      }
    }
  }

  private static checkBlockchainConfig(checks: ProductionCheckResult['checks'], recommendations: string[]) {
    // Solana RPC URL
    const rpcUrl = process.env.SOLANA_RPC_URL;
    checks.push({
      category: 'Blockchain',
      name: 'SOLANA_RPC_URL',
      status: rpcUrl ? 'pass' : 'warning',
      message: rpcUrl ? 'Configured' : 'Using default devnet',
      required: false
    });

    // Solana Private Keys
    const escrowKey = process.env.SOLANA_ESCROW_PRIVATE_KEY;
    checks.push({
      category: 'Blockchain',
      name: 'SOLANA_ESCROW_PRIVATE_KEY',
      status: escrowKey ? 'pass' : 'warning',
      message: escrowKey ? 'Configured' : 'Using temporary keypair',
      required: false
    });

    if (!escrowKey) {
      recommendations.push('Set SOLANA_ESCROW_PRIVATE_KEY for production deployment');
    }

    if (!rpcUrl && process.env.NODE_ENV === 'production') {
      recommendations.push('Configure SOLANA_RPC_URL for mainnet production deployment');
    }
  }

  private static checkExternalAPIs(checks: ProductionCheckResult['checks'], recommendations: string[]) {
    const apis = {
      'OpenAI': { key: 'OPENAI_API_KEY', required: true },
      'Stripe': { key: 'STRIPE_SECRET_KEY', required: false },
      'Twilio': { key: 'TWILIO_AUTH_TOKEN', required: false },
      'Twitter': { key: 'TWITTER_API_KEY', required: false }
    };

    Object.entries(apis).forEach(([service, config]) => {
      const isConfigured = !!process.env[config.key];
      checks.push({
        category: 'External APIs',
        name: `${service} API`,
        status: isConfigured ? 'pass' : config.required ? 'fail' : 'warning',
        message: isConfigured ? 'Configured' : 'Not configured',
        required: config.required
      });

      if (!isConfigured && config.required) {
        recommendations.push(`Configure ${config.key} for ${service} integration`);
      }
    });
  }

  private static checkSecurityConfig(checks: ProductionCheckResult['checks'], recommendations: string[]) {
    // JWT Secret
    const jwtSecret = process.env.JWT_SECRET;
    const jwtSecretStrong = jwtSecret && jwtSecret.length >= 32;
    checks.push({
      category: 'Security',
      name: 'JWT_SECRET',
      status: jwtSecretStrong ? 'pass' : jwtSecret ? 'warning' : 'fail',
      message: jwtSecretStrong ? 'Strong secret configured' : jwtSecret ? 'Weak secret' : 'Not configured',
      required: true
    });

    if (!jwtSecretStrong) {
      recommendations.push('Set strong JWT_SECRET (32+ characters) for secure authentication');
    }

    // Session Secret
    const sessionSecret = process.env.SESSION_SECRET;
    const sessionSecretStrong = sessionSecret && sessionSecret.length >= 32;
    checks.push({
      category: 'Security',
      name: 'SESSION_SECRET',
      status: sessionSecretStrong ? 'pass' : sessionSecret ? 'warning' : 'fail',
      message: sessionSecretStrong ? 'Strong secret configured' : sessionSecret ? 'Weak secret' : 'Not configured',
      required: true
    });

    if (!sessionSecretStrong) {
      recommendations.push('Set strong SESSION_SECRET (32+ characters) for secure sessions');
    }

    // Encryption Key
    const encryptionKey = process.env.ENCRYPTION_KEY;
    checks.push({
      category: 'Security',
      name: 'ENCRYPTION_KEY',
      status: encryptionKey ? 'pass' : 'warning',
      message: encryptionKey ? 'Configured' : 'Using generated key',
      required: false
    });

    if (!encryptionKey) {
      recommendations.push('Set ENCRYPTION_KEY for persistent data encryption');
    }
  }

  private static checkPerformanceConfig(checks: ProductionCheckResult['checks'], recommendations: string[]) {
    // Memory and CPU limits (if applicable)
    const memoryLimit = process.env.MEMORY_LIMIT;
    checks.push({
      category: 'Performance',
      name: 'Memory Configuration',
      status: memoryLimit ? 'pass' : 'warning',
      message: memoryLimit ? `Limited to ${memoryLimit}` : 'No memory limit set',
      required: false
    });

    // Redis/Cache configuration
    const redisUrl = process.env.REDIS_URL;
    checks.push({
      category: 'Performance',
      name: 'Cache Configuration',
      status: redisUrl ? 'pass' : 'warning',
      message: redisUrl ? 'Redis configured' : 'Using in-memory cache',
      required: false
    });

    if (!redisUrl && process.env.NODE_ENV === 'production') {
      recommendations.push('Consider Redis for production caching and session storage');
    }
  }

  // Quick deployment readiness check
  static isDeploymentReady(): { ready: boolean; blockers: string[] } {
    const blockers: string[] = [];

    // Critical checks only
    if (!process.env.DATABASE_URL) blockers.push('DATABASE_URL required');
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) blockers.push('Strong JWT_SECRET required');
    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) blockers.push('Strong SESSION_SECRET required');
    if (!process.env.OPENAI_API_KEY) blockers.push('OPENAI_API_KEY required');

    return {
      ready: blockers.length === 0,
      blockers
    };
  }
}