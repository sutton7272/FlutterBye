import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

export interface OpenAICostConfig {
  hourlyLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  alertThreshold: number;
  trackingEnabled: boolean;
}

export interface UsageStats {
  requests: number;
  costs: number;
  errors: number;
  lastReset: number;
  period: 'hour' | 'day' | 'month';
}

export interface RateLimitHealth {
  status: 'healthy' | 'degraded' | 'critical';
  metrics: {
    totalRequests: number;
    rejectedRequests: number;
    errorRate: number;
    averageResponseTime: number;
  };
  alerts: string[];
}

export class APIUsageTracker {
  private usage: Map<string, UsageStats> = new Map();
  private costTracking: Map<string, number> = new Map();

  // Track API usage
  trackRequest(endpoint: string, cost: number = 0): void {
    const key = `${endpoint}_hour`;
    const stats = this.usage.get(key) || {
      requests: 0,
      costs: 0,
      errors: 0,
      lastReset: Date.now(),
      period: 'hour' as const
    };

    // Reset if hour has passed
    if (Date.now() - stats.lastReset > 3600000) {
      stats.requests = 0;
      stats.costs = 0;
      stats.errors = 0;
      stats.lastReset = Date.now();
    }

    stats.requests++;
    stats.costs += cost;
    this.usage.set(key, stats);

    // Track daily and monthly as well
    this.trackPeriod(endpoint, 'day', cost);
    this.trackPeriod(endpoint, 'month', cost);
  }

  // Track by time period
  private trackPeriod(endpoint: string, period: 'day' | 'month', cost: number): void {
    const key = `${endpoint}_${period}`;
    const resetTime = period === 'day' ? 86400000 : 2592000000; // 1 day or 30 days
    
    const stats = this.usage.get(key) || {
      requests: 0,
      costs: 0,
      errors: 0,
      lastReset: Date.now(),
      period
    };

    if (Date.now() - stats.lastReset > resetTime) {
      stats.requests = 0;
      stats.costs = 0;
      stats.errors = 0;
      stats.lastReset = Date.now();
    }

    stats.requests++;
    stats.costs += cost;
    this.usage.set(key, stats);
  }

  // Track error
  trackError(endpoint: string): void {
    const periods = ['hour', 'day', 'month'];
    for (const period of periods) {
      const key = `${endpoint}_${period}`;
      const stats = this.usage.get(key);
      if (stats) {
        stats.errors++;
        this.usage.set(key, stats);
      }
    }
  }

  // Get usage stats for endpoint and period
  getUsageStats(endpoint: string, period: 'hour' | 'day' | 'month' = 'hour'): UsageStats | null {
    return this.usage.get(`${endpoint}_${period}`) || null;
  }

  // Get all usage stats
  getAllUsageStats(): Record<string, UsageStats> {
    const result: Record<string, UsageStats> = {};
    for (const [key, stats] of this.usage) {
      result[key] = stats;
    }
    return result;
  }

  // Get cost data for a specific endpoint or 'global' for all
  getCostData(endpoint: string): { hourly: number; daily: number; monthly: number } {
    if (endpoint === 'global') {
      // Calculate total costs across all endpoints
      let hourly = 0, daily = 0, monthly = 0;
      for (const [key, stats] of this.usage) {
        if (key.endsWith('_hour')) hourly += stats.costs;
        if (key.endsWith('_day')) daily += stats.costs;
        if (key.endsWith('_month')) monthly += stats.costs;
      }
      return { hourly, daily, monthly };
    }

    return {
      hourly: this.usage.get(`${endpoint}_hour`)?.costs || 0,
      daily: this.usage.get(`${endpoint}_day`)?.costs || 0,
      monthly: this.usage.get(`${endpoint}_month`)?.costs || 0
    };
  }

  // Check if cost limits are exceeded
  checkCostLimits(config: OpenAICostConfig): { exceeded: boolean; alerts: string[] } {
    const costs = this.getCostData('global');
    const alerts: string[] = [];
    
    if (costs.hourly > config.hourlyLimit) {
      alerts.push(`Hourly cost limit exceeded: $${costs.hourly.toFixed(2)} > $${config.hourlyLimit}`);
    }
    
    if (costs.daily > config.dailyLimit) {
      alerts.push(`Daily cost limit exceeded: $${costs.daily.toFixed(2)} > $${config.dailyLimit}`);
    }
    
    if (costs.monthly > config.monthlyLimit) {
      alerts.push(`Monthly cost limit exceeded: $${costs.monthly.toFixed(2)} > $${config.monthlyLimit}`);
    }

    // Alert threshold warnings
    if (costs.hourly > config.hourlyLimit * config.alertThreshold) {
      alerts.push(`Hourly cost approaching limit: $${costs.hourly.toFixed(2)} (${(costs.hourly/config.hourlyLimit*100).toFixed(1)}%)`);
    }

    return {
      exceeded: alerts.length > 0,
      alerts
    };
  }
}

export class ProductionRateLimitingService {
  public readonly apiUsageTracker = new APIUsageTracker();
  
  // OpenAI Cost Control Configuration
  public readonly OPENAI_COST_CONFIG: OpenAICostConfig = {
    hourlyLimit: parseFloat(process.env.OPENAI_COST_LIMIT_HOURLY || '100'),   // $100/hour
    dailyLimit: parseFloat(process.env.OPENAI_COST_LIMIT_DAILY || '1000'),    // $1000/day
    monthlyLimit: parseFloat(process.env.OPENAI_COST_LIMIT_MONTHLY || '10000'), // $10K/month
    alertThreshold: 0.8, // Alert at 80% of limit
    trackingEnabled: true
  };

  // Standard API Rate Limiting
  createStandardRateLimit(): any {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.API_RATE_LIMIT_MAX || '1000'), // 1000 requests per 15 minutes
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        this.apiUsageTracker.trackError(req.path);
        res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil(15 * 60 * 1000 / 1000) // seconds
        });
      }
    });
  }

  // Strict rate limiting for sensitive endpoints
  createStrictRateLimit(): any {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per 15 minutes for sensitive endpoints
      message: {
        error: 'Too many requests to sensitive endpoint, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false
    });
  }

  // OpenAI-specific rate limiting with cost tracking
  createOpenAIRateLimit(): any {
    return rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 60, // 60 requests per minute for OpenAI
      message: {
        error: 'OpenAI rate limit exceeded, please try again later.',
        retryAfter: '1 minute'
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        this.apiUsageTracker.trackError('/api/openai');
        res.status(429).json({
          error: 'OpenAI rate limit exceeded',
          retryAfter: 60
        });
      }
    });
  }

  // Enterprise tier rate limiting
  createEnterpriseRateLimit(): any {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10000, // 10K requests per 15 minutes for enterprise
      message: {
        error: 'Enterprise rate limit exceeded.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req: Request) => {
        // Skip rate limiting for verified enterprise clients
        return req.headers['x-enterprise-key'] === process.env.ENTERPRISE_API_KEY;
      }
    });
  }

  // Cost control middleware for OpenAI endpoints
  createCostControlMiddleware(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.OPENAI_COST_CONFIG.trackingEnabled) {
        return next();
      }

      // Check cost limits before processing
      const costCheck = this.apiUsageTracker.checkCostLimits(this.OPENAI_COST_CONFIG);
      
      if (costCheck.exceeded) {
        console.warn('🚨 OpenAI cost limit exceeded:', costCheck.alerts);
        return res.status(429).json({
          error: 'API cost limit exceeded',
          message: 'OpenAI usage limits have been reached. Please try again later.',
          alerts: costCheck.alerts
        });
      }

      // Track the request
      this.apiUsageTracker.trackRequest('/api/openai', this.estimateOpenAICost(req));
      
      next();
    };
  }

  // Estimate OpenAI API cost based on request
  private estimateOpenAICost(req: Request): number {
    // Rough cost estimation based on endpoint and request size
    const baselineGPT4Cost = 0.03; // $0.03 per 1K tokens (rough estimate)
    const requestSize = JSON.stringify(req.body).length;
    const estimatedTokens = Math.ceil(requestSize / 4); // Rough token estimation
    
    return (estimatedTokens / 1000) * baselineGPT4Cost;
  }

  // Dynamic rate limiting based on user tier
  createDynamicRateLimit(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      const userTier = this.getUserTier(req);
      const limits = this.getTierLimits(userTier);
      
      // Apply dynamic rate limit based on user tier
      const dynamicLimit = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: limits.requestsPerWindow,
        message: {
          error: `Rate limit exceeded for ${userTier} tier`,
          tier: userTier,
          limit: limits.requestsPerWindow
        }
      });
      
      dynamicLimit(req, res, next);
    };
  }

  // Get user tier from request
  private getUserTier(req: Request): string {
    // Check for enterprise API key
    if (req.headers['x-enterprise-key']) {
      return 'enterprise';
    }
    
    // Check for premium user (this would integrate with user system)
    if (req.headers['x-user-tier'] === 'premium') {
      return 'premium';
    }
    
    return 'standard';
  }

  // Get rate limits for user tier
  private getTierLimits(tier: string): { requestsPerWindow: number; costMultiplier: number } {
    switch (tier) {
      case 'enterprise':
        return { requestsPerWindow: 10000, costMultiplier: 1.0 };
      case 'premium':
        return { requestsPerWindow: 5000, costMultiplier: 0.8 };
      case 'standard':
      default:
        return { requestsPerWindow: 1000, costMultiplier: 1.0 };
    }
  }

  // Get rate limiting health status
  getRateLimitHealth(): RateLimitHealth {
    const globalStats = this.apiUsageTracker.getCostData('global');
    const allStats = this.apiUsageTracker.getAllUsageStats();
    
    const totalRequests = Object.values(allStats)
      .filter(stat => stat.period === 'hour')
      .reduce((sum, stat) => sum + stat.requests, 0);
      
    const totalErrors = Object.values(allStats)
      .filter(stat => stat.period === 'hour')
      .reduce((sum, stat) => sum + stat.errors, 0);
    
    const errorRate = totalRequests > 0 ? totalErrors / totalRequests : 0;
    const costCheck = this.apiUsageTracker.checkCostLimits(this.OPENAI_COST_CONFIG);
    
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
    const alerts: string[] = [];
    
    // Determine health status
    if (costCheck.exceeded || errorRate > 0.1) {
      status = 'critical';
      alerts.push(...costCheck.alerts);
      if (errorRate > 0.1) alerts.push(`High error rate: ${(errorRate * 100).toFixed(1)}%`);
    } else if (errorRate > 0.05 || globalStats.hourly > this.OPENAI_COST_CONFIG.hourlyLimit * 0.8) {
      status = 'degraded';
      if (errorRate > 0.05) alerts.push(`Elevated error rate: ${(errorRate * 100).toFixed(1)}%`);
      if (globalStats.hourly > this.OPENAI_COST_CONFIG.hourlyLimit * 0.8) {
        alerts.push(`Approaching hourly cost limit: $${globalStats.hourly.toFixed(2)}`);
      }
    }
    
    return {
      status,
      metrics: {
        totalRequests,
        rejectedRequests: totalErrors,
        errorRate,
        averageResponseTime: 0 // Would need to implement response time tracking
      },
      alerts
    };
  }

  // Generate rate limiting report
  generateRateLimitingReport(): string {
    const health = this.getRateLimitHealth();
    const costs = this.apiUsageTracker.getCostData('global');
    const allStats = this.apiUsageTracker.getAllUsageStats();
    
    return `# Production Rate Limiting Report
Generated: ${new Date().toISOString()}

## Health Status
- **Overall Status**: ${health.status.toUpperCase()}
- **Total Requests (Hour)**: ${health.metrics.totalRequests.toLocaleString()}
- **Error Rate**: ${(health.metrics.errorRate * 100).toFixed(2)}%
- **Rejected Requests**: ${health.metrics.rejectedRequests.toLocaleString()}

## Cost Tracking
- **Hourly Cost**: $${costs.hourly.toFixed(2)} / $${this.OPENAI_COST_CONFIG.hourlyLimit}
- **Daily Cost**: $${costs.daily.toFixed(2)} / $${this.OPENAI_COST_CONFIG.dailyLimit}
- **Monthly Cost**: $${costs.monthly.toFixed(2)} / $${this.OPENAI_COST_CONFIG.monthlyLimit}

## Alerts
${health.alerts.length > 0 ? health.alerts.map(alert => `- ⚠️ ${alert}`).join('\n') : '- ✅ No active alerts'}

## Configuration
- **Standard Rate Limit**: ${process.env.API_RATE_LIMIT_MAX || '1000'} requests per 15 minutes
- **OpenAI Rate Limit**: 60 requests per minute
- **Enterprise Rate Limit**: 10,000 requests per 15 minutes
- **Cost Tracking**: ${this.OPENAI_COST_CONFIG.trackingEnabled ? 'Enabled' : 'Disabled'}

## Recommendations
${health.status === 'critical' ? '🔴 CRITICAL: Immediate action required to address rate limiting issues' : ''}
${health.status === 'degraded' ? '🟡 DEGRADED: Monitor closely and consider optimization' : ''}
${health.status === 'healthy' ? '✅ HEALTHY: Rate limiting operating normally' : ''}
`;
  }
}

export const productionRateLimiting = new ProductionRateLimitingService();