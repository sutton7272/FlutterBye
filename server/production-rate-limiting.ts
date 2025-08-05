// Production API Rate Limiting and Cost Controls
import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface APIUsageMetrics {
  requestCount: number;
  costAccumulated: number;
  lastReset: Date;
  averageResponseTime: number;
  errorRate: number;
}

// Production Rate Limit Configurations
export const PRODUCTION_RATE_LIMITS = {
  // General API rate limiting
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per 15 minutes
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  } as RateLimitConfig,

  // OpenAI API rate limiting
  openai: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: 'AI service rate limit exceeded, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  } as RateLimitConfig,

  // Token creation rate limiting
  tokenCreation: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 token creations per hour per IP
    message: 'Token creation rate limit exceeded, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  } as RateLimitConfig,

  // Enterprise API rate limiting (higher limits)
  enterprise: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // 5000 requests per 15 minutes
    message: 'Enterprise rate limit exceeded, please contact support.',
    standardHeaders: true,
    legacyHeaders: false,
  } as RateLimitConfig,

  // Authentication rate limiting
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 auth attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
  } as RateLimitConfig,
};

// OpenAI Cost Control Configuration
export interface OpenAICostConfig {
  maxCostPerHour: number;
  maxCostPerDay: number;
  maxCostPerMonth: number;
  costPerRequest: {
    'gpt-4o': number;
    'gpt-4': number;
    'gpt-3.5-turbo': number;
  };
  alertThresholds: {
    hourly: number;
    daily: number;
    monthly: number;
  };
}

export const OPENAI_COST_CONFIG: OpenAICostConfig = {
  maxCostPerHour: 100,    // $100 per hour
  maxCostPerDay: 1000,    // $1000 per day
  maxCostPerMonth: 10000, // $10,000 per month
  costPerRequest: {
    'gpt-4o': 0.03,       // Estimated $0.03 per request
    'gpt-4': 0.06,        // Estimated $0.06 per request
    'gpt-3.5-turbo': 0.002 // Estimated $0.002 per request
  },
  alertThresholds: {
    hourly: 0.8,   // Alert at 80% of hourly limit
    daily: 0.8,    // Alert at 80% of daily limit
    monthly: 0.9   // Alert at 90% of monthly limit
  }
};

// API Usage Tracking
class APIUsageTracker {
  private usageMetrics: Map<string, APIUsageMetrics> = new Map();
  private costTracking: Map<string, { hourly: number; daily: number; monthly: number; lastReset: { hour: Date; day: Date; month: Date } }> = new Map();

  // Track API request
  trackRequest(apiKey: string, cost: number = 0, responseTime: number = 0, isError: boolean = false): void {
    const now = new Date();
    
    // Get or create usage metrics
    let metrics = this.usageMetrics.get(apiKey);
    if (!metrics) {
      metrics = {
        requestCount: 0,
        costAccumulated: 0,
        lastReset: now,
        averageResponseTime: 0,
        errorRate: 0
      };
      this.usageMetrics.set(apiKey, metrics);
    }

    // Update metrics
    metrics.requestCount++;
    metrics.costAccumulated += cost;
    
    // Update average response time
    metrics.averageResponseTime = (metrics.averageResponseTime + responseTime) / 2;
    
    // Update error rate
    if (isError) {
      metrics.errorRate = (metrics.errorRate * (metrics.requestCount - 1) + 1) / metrics.requestCount;
    } else {
      metrics.errorRate = (metrics.errorRate * (metrics.requestCount - 1)) / metrics.requestCount;
    }

    // Track costs with time windows
    this.trackCosts(apiKey, cost, now);
  }

  // Track costs in time windows
  private trackCosts(apiKey: string, cost: number, now: Date): void {
    let costData = this.costTracking.get(apiKey);
    if (!costData) {
      costData = {
        hourly: 0,
        daily: 0,
        monthly: 0,
        lastReset: {
          hour: now,
          day: now,
          month: now
        }
      };
      this.costTracking.set(apiKey, costData);
    }

    // Reset hourly if needed
    if (now.getTime() - costData.lastReset.hour.getTime() > 60 * 60 * 1000) {
      costData.hourly = 0;
      costData.lastReset.hour = now;
    }

    // Reset daily if needed
    if (now.getTime() - costData.lastReset.day.getTime() > 24 * 60 * 60 * 1000) {
      costData.daily = 0;
      costData.lastReset.day = now;
    }

    // Reset monthly if needed (30 days)
    if (now.getTime() - costData.lastReset.month.getTime() > 30 * 24 * 60 * 60 * 1000) {
      costData.monthly = 0;
      costData.lastReset.month = now;
    }

    // Add cost to all windows
    costData.hourly += cost;
    costData.daily += cost;
    costData.monthly += cost;
  }

  // Check if cost limits are exceeded
  checkCostLimits(apiKey: string): { exceeded: boolean; window: string; currentCost: number; limit: number } | null {
    const costData = this.costTracking.get(apiKey);
    if (!costData) return null;

    const config = OPENAI_COST_CONFIG;

    if (costData.hourly > config.maxCostPerHour) {
      return { exceeded: true, window: 'hourly', currentCost: costData.hourly, limit: config.maxCostPerHour };
    }

    if (costData.daily > config.maxCostPerDay) {
      return { exceeded: true, window: 'daily', currentCost: costData.daily, limit: config.maxCostPerDay };
    }

    if (costData.monthly > config.maxCostPerMonth) {
      return { exceeded: true, window: 'monthly', currentCost: costData.monthly, limit: config.maxCostPerMonth };
    }

    return null;
  }

  // Check if alert thresholds are reached
  checkAlertThresholds(apiKey: string): { alert: boolean; window: string; currentCost: number; threshold: number } | null {
    const costData = this.costTracking.get(apiKey);
    if (!costData) return null;

    const config = OPENAI_COST_CONFIG;

    const hourlyThreshold = config.maxCostPerHour * config.alertThresholds.hourly;
    if (costData.hourly > hourlyThreshold) {
      return { alert: true, window: 'hourly', currentCost: costData.hourly, threshold: hourlyThreshold };
    }

    const dailyThreshold = config.maxCostPerDay * config.alertThresholds.daily;
    if (costData.daily > dailyThreshold) {
      return { alert: true, window: 'daily', currentCost: costData.daily, threshold: dailyThreshold };
    }

    const monthlyThreshold = config.maxCostPerMonth * config.alertThresholds.monthly;
    if (costData.monthly > monthlyThreshold) {
      return { alert: true, window: 'monthly', currentCost: costData.monthly, threshold: monthlyThreshold };
    }

    return null;
  }

  // Get usage metrics
  getUsageMetrics(apiKey: string): APIUsageMetrics | null {
    return this.usageMetrics.get(apiKey) || null;
  }

  // Get cost data
  getCostData(apiKey: string) {
    return this.costTracking.get(apiKey) || null;
  }

  // Get all usage stats
  getAllUsageStats(): { totalRequests: number; totalCost: number; averageResponseTime: number; errorRate: number } {
    let totalRequests = 0;
    let totalCost = 0;
    let totalResponseTime = 0;
    let totalErrorRate = 0;
    let count = 0;

    for (const metrics of this.usageMetrics.values()) {
      totalRequests += metrics.requestCount;
      totalCost += metrics.costAccumulated;
      totalResponseTime += metrics.averageResponseTime;
      totalErrorRate += metrics.errorRate;
      count++;
    }

    return {
      totalRequests,
      totalCost,
      averageResponseTime: count > 0 ? totalResponseTime / count : 0,
      errorRate: count > 0 ? totalErrorRate / count : 0
    };
  }
}

// Global usage tracker instance
export const apiUsageTracker = new APIUsageTracker();

// Rate limiting middleware factory
export function createRateLimit(config: RateLimitConfig) {
  return rateLimit(config);
}

// OpenAI cost control middleware
export function openAICostControl(req: Request, res: Response, next: NextFunction): void {
  const apiKey = 'global'; // Could be per-user or per-API-key
  
  // Check cost limits before processing
  const costLimit = apiUsageTracker.checkCostLimits(apiKey);
  if (costLimit?.exceeded) {
    res.status(429).json({
      error: 'Cost limit exceeded',
      message: `${costLimit.window} cost limit of $${costLimit.limit} exceeded (current: $${costLimit.currentCost.toFixed(2)})`,
      retryAfter: costLimit.window === 'hourly' ? 3600 : costLimit.window === 'daily' ? 86400 : 2592000
    });
    return;
  }

  // Check alert thresholds
  const alert = apiUsageTracker.checkAlertThresholds(apiKey);
  if (alert?.alert) {
    console.warn(`⚠️ Cost alert: ${alert.window} spending at $${alert.currentCost.toFixed(2)} (threshold: $${alert.threshold.toFixed(2)})`);
  }

  next();
}

// Request tracking middleware
export function trackAPIUsage(model: keyof typeof OPENAI_COST_CONFIG.costPerRequest = 'gpt-4o') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const apiKey = 'global'; // Could be extracted from headers
    
    // Override res.json to track completion
    const originalJson = res.json;
    res.json = function(data: any) {
      const responseTime = Date.now() - startTime;
      const cost = OPENAI_COST_CONFIG.costPerRequest[model];
      const isError = res.statusCode >= 400;
      
      apiUsageTracker.trackRequest(apiKey, cost, responseTime, isError);
      
      return originalJson.call(this, data);
    };

    next();
  };
}

// Production rate limiters
export const productionRateLimiters = {
  general: createRateLimit(PRODUCTION_RATE_LIMITS.general),
  openai: createRateLimit(PRODUCTION_RATE_LIMITS.openai),
  tokenCreation: createRateLimit(PRODUCTION_RATE_LIMITS.tokenCreation),
  enterprise: createRateLimit(PRODUCTION_RATE_LIMITS.enterprise),
  auth: createRateLimit(PRODUCTION_RATE_LIMITS.auth),
};

// Dynamic rate limiter based on user tier
export function dynamicRateLimit(req: Request, res: Response, next: NextFunction): void {
  // Determine user tier (could be from JWT, database, etc.)
  const userTier = req.headers['x-user-tier'] as string || 'free';
  
  let limiter;
  switch (userTier) {
    case 'enterprise':
      limiter = productionRateLimiters.enterprise;
      break;
    case 'premium':
      limiter = createRateLimit({
        ...PRODUCTION_RATE_LIMITS.general,
        max: 2000 // Higher limit for premium users
      });
      break;
    default:
      limiter = productionRateLimiters.general;
  }
  
  limiter(req, res, next);
}

// Health check endpoint for monitoring
export function getRateLimitHealth(): {
  status: 'healthy' | 'degraded' | 'critical';
  metrics: ReturnType<typeof apiUsageTracker.getAllUsageStats>;
  costs: { hourly: number; daily: number; monthly: number };
} {
  const metrics = apiUsageTracker.getAllUsageStats();
  const costData = apiUsageTracker.getCostData('global');
  
  let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
  
  // Determine health status based on error rate and cost
  if (metrics.errorRate > 0.1 || (costData && costData.hourly > OPENAI_COST_CONFIG.maxCostPerHour * 0.9)) {
    status = 'critical';
  } else if (metrics.errorRate > 0.05 || (costData && costData.hourly > OPENAI_COST_CONFIG.maxCostPerHour * 0.7)) {
    status = 'degraded';
  }

  return {
    status,
    metrics,
    costs: {
      hourly: costData?.hourly || 0,
      daily: costData?.daily || 0,
      monthly: costData?.monthly || 0
    }
  };
}

export default {
  PRODUCTION_RATE_LIMITS,
  OPENAI_COST_CONFIG,
  apiUsageTracker,
  createRateLimit,
  openAICostControl,
  trackAPIUsage,
  productionRateLimiters,
  dynamicRateLimit,
  getRateLimitHealth
};