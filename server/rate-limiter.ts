// Production-grade rate limiting system
import type { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();

  createLimiter(config: RateLimitConfig) {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = req.ip || 'unknown';
      const now = Date.now();
      const windowStart = now - config.windowMs;

      // Clean old entries
      for (const [ip, data] of this.requests.entries()) {
        if (data.resetTime < now) {
          this.requests.delete(ip);
        }
      }

      // Get current request data
      const requestData = this.requests.get(key);
      
      if (!requestData || requestData.resetTime < now) {
        // New window
        this.requests.set(key, {
          count: 1,
          resetTime: now + config.windowMs
        });
        
        if (config.standardHeaders) {
          res.set('X-RateLimit-Limit', config.max.toString());
          res.set('X-RateLimit-Remaining', (config.max - 1).toString());
          res.set('X-RateLimit-Reset', new Date(now + config.windowMs).toISOString());
        }
        
        return next();
      }

      // Existing window
      if (requestData.count >= config.max) {
        if (config.standardHeaders) {
          res.set('X-RateLimit-Limit', config.max.toString());
          res.set('X-RateLimit-Remaining', '0');
          res.set('X-RateLimit-Reset', new Date(requestData.resetTime).toISOString());
          res.set('Retry-After', Math.ceil((requestData.resetTime - now) / 1000).toString());
        }
        
        return res.status(429).json({
          error: config.message,
          retryAfter: Math.ceil((requestData.resetTime - now) / 1000)
        });
      }

      // Increment count
      requestData.count++;
      
      if (config.standardHeaders) {
        res.set('X-RateLimit-Limit', config.max.toString());
        res.set('X-RateLimit-Remaining', (config.max - requestData.count).toString());
        res.set('X-RateLimit-Reset', new Date(requestData.resetTime).toISOString());
      }

      next();
    };
  }
}

const rateLimiter = new RateLimiter();

// General API rate limiting
export const generalRateLimit = rateLimiter.createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Token creation rate limiting (more restrictive)
export const tokenCreationRateLimit = rateLimiter.createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 token creations per minute
  message: 'Token creation rate limit exceeded',
  standardHeaders: true,
  legacyHeaders: false
});

// Wallet operations rate limiting
export const walletRateLimit = rateLimiter.createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 wallet operations per minute
  message: 'Wallet operation rate limit exceeded',
  standardHeaders: true,
  legacyHeaders: false
});

// Admin operations rate limiting
export const adminRateLimit = rateLimiter.createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 admin operations per minute
  message: 'Admin operation rate limit exceeded',
  standardHeaders: true,
  legacyHeaders: false
});

// Search operations rate limiting
export const searchRateLimit = rateLimiter.createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: 'Search rate limit exceeded',
  standardHeaders: true,
  legacyHeaders: false
});