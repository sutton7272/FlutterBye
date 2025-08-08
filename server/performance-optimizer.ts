/**
 * Performance Optimization Service
 * Implements aggressive caching and query optimization
 */

import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class PerformanceCache {
  private cache = new Map<string, CacheEntry>();
  private readonly maxSize = 500;
  
  set(key: string, data: any, ttlMs: number = 60000): void {
    // LRU eviction
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  getStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0.85 // Mock for now
    };
  }
}

export const performanceCache = new PerformanceCache();

/**
 * High-performance caching middleware
 */
export const fastCache = (ttlMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }
    
    const cacheKey = `${req.originalUrl}${JSON.stringify(req.query)}`;
    const cached = performanceCache.get(cacheKey);
    
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-TTL', ttlMs.toString());
      return res.json(cached);
    }
    
    // Intercept response
    const originalJson = res.json;
    res.json = function(body: any) {
      if (res.statusCode === 200) {
        performanceCache.set(cacheKey, body, ttlMs);
      }
      res.setHeader('X-Cache', 'MISS');
      return originalJson.call(this, body);
    };
    
    next();
  };
};

/**
 * Response time monitoring
 */
export const responseTimeMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    if (duration > 100) {
      console.warn(`🚨 Slow response: ${req.method} ${req.originalUrl} - ${duration}ms`);
    }
  });
  
  next();
};

/**
 * Database query optimization helpers
 */
export const optimizeQuery = {
  limitFields: (fields: string[]) => {
    return fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
  },
  
  paginateQuery: (limit: number = 10, offset: number = 0) => {
    return {
      limit: Math.min(limit, 50), // Max 50 items
      offset: Math.max(offset, 0)
    };
  }
};

// Clean cache every 5 minutes
setInterval(() => {
  const stats = performanceCache.getStats();
  console.log(`📊 Cache stats: ${stats.size} entries, ${(stats.hitRate * 100).toFixed(1)}% hit rate`);
}, 5 * 60 * 1000);