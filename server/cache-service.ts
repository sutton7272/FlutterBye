// Production caching service for performance optimization
import type { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

class CacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  // Generate cache key from request
  private generateKey(req: Request, prefix?: string): string {
    const baseKey = `${req.method}:${req.path}`;
    const queryKey = Object.keys(req.query).length > 0 
      ? `?${new URLSearchParams(req.query as Record<string, string>).toString()}`
      : '';
    
    return prefix ? `${prefix}:${baseKey}${queryKey}` : `${baseKey}${queryKey}`;
  }

  // Cache middleware factory
  createCacheMiddleware(options: {
    ttl?: number;
    prefix?: string;
    condition?: (req: Request) => boolean;
    keyGenerator?: (req: Request) => string;
  } = {}) {
    return (req: Request, res: Response, next: NextFunction) => {
      // Skip caching for non-GET requests
      if (req.method !== 'GET') {
        return next();
      }

      // Check condition if provided
      if (options.condition && !options.condition(req)) {
        return next();
      }

      const key = options.keyGenerator 
        ? options.keyGenerator(req)
        : this.generateKey(req, options.prefix);
      
      const cached = this.get(key);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Key', key);
        return res.json(cached);
      }

      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function(data: any) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const ttl = options.ttl || 5 * 60 * 1000; // Default 5 minutes
          const cacheService = res.locals.cacheService as CacheService;
          if (cacheService) {
            cacheService.set(key, data, ttl);
          }
        }
        
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('X-Cache-Key', key);
        return originalJson.call(this, data);
      };

      // Make cache service available to the response
      res.locals.cacheService = this;
      next();
    };
  }

  // Set cache entry
  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  // Get cache entry
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // Delete cache entry
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear expired entries
  cleanup(): number {
    const now = Date.now();
    let deletedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  // Clear all cache entries
  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats(): {
    totalEntries: number;
    expiredEntries: number;
    memoryUsage: number;
    hitRate?: number;
  } {
    const now = Date.now();
    let expiredCount = 0;

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expiredCount++;
      }
    }

    return {
      totalEntries: this.cache.size,
      expiredEntries: expiredCount,
      memoryUsage: this.cache.size * 1024, // Rough estimate
    };
  }

  // Invalidate cache by pattern
  invalidatePattern(pattern: string): number {
    let deletedCount = 0;
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

// Create global cache service instance
export const cacheService = new CacheService();

// Pre-configured cache middleware for common use cases
export const tokenCacheMiddleware = cacheService.createCacheMiddleware({
  ttl: 2 * 60 * 1000, // 2 minutes for token data
  prefix: 'tokens',
  condition: (req) => req.path.startsWith('/api/tokens/')
});

export const userCacheMiddleware = cacheService.createCacheMiddleware({
  ttl: 10 * 60 * 1000, // 10 minutes for user data
  prefix: 'users',
  condition: (req) => req.path.startsWith('/api/users/')
});

export const analyticsCacheMiddleware = cacheService.createCacheMiddleware({
  ttl: 15 * 60 * 1000, // 15 minutes for analytics
  prefix: 'analytics',
  condition: (req) => req.path.includes('analytics')
});

export const searchCacheMiddleware = cacheService.createCacheMiddleware({
  ttl: 5 * 60 * 1000, // 5 minutes for search results
  prefix: 'search',
  condition: (req) => req.path.includes('search')
});

// Start cleanup interval
setInterval(() => {
  const deletedCount = cacheService.cleanup();
  if (deletedCount > 0) {
    console.log(`Cache cleanup: removed ${deletedCount} expired entries`);
  }
}, 5 * 60 * 1000); // Every 5 minutes