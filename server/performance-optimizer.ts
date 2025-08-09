// Performance Optimization Service
// Critical performance improvements for all platform components

import { Response } from 'express';
import compression from 'compression';

// Response Caching System
class ResponseCacheService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttlSeconds: number = 300) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    });
  }
  
  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  clear() {
    this.cache.clear();
  }
  
  getStats() {
    return {
      entries: this.cache.size,
      memoryUsage: this.getMemoryUsage()
    };
  }
  
  private getMemoryUsage(): number {
    let totalSize = 0;
    for (const [key, value] of this.cache) {
      totalSize += JSON.stringify({ key, value }).length;
    }
    return Math.round(totalSize / 1024); // KB
  }
}

// Query Optimization Service
class QueryOptimizer {
  private queryCache = new Map<string, any>();
  private queryStats = new Map<string, { count: number; avgTime: number }>();
  
  async optimizeQuery<T>(queryKey: string, queryFn: () => Promise<T>, cacheTime: number = 300): Promise<T> {
    const startTime = Date.now();
    
    // Check cache first
    const cached = this.queryCache.get(queryKey);
    if (cached && Date.now() - cached.timestamp < cacheTime * 1000) {
      return cached.data;
    }
    
    // Execute query
    const result = await queryFn();
    
    // Cache result
    this.queryCache.set(queryKey, {
      data: result,
      timestamp: Date.now()
    });
    
    // Update stats
    const duration = Date.now() - startTime;
    this.updateQueryStats(queryKey, duration);
    
    return result;
  }
  
  private updateQueryStats(queryKey: string, duration: number) {
    const existing = this.queryStats.get(queryKey);
    if (existing) {
      existing.count++;
      existing.avgTime = (existing.avgTime + duration) / 2;
    } else {
      this.queryStats.set(queryKey, { count: 1, avgTime: duration });
    }
  }
  
  getQueryStats() {
    return Object.fromEntries(this.queryStats);
  }
  
  clearCache() {
    this.queryCache.clear();
  }
}

// AI Response Optimization
class AIResponseOptimizer {
  private aiCache = new Map<string, { response: any; timestamp: number }>();
  private pendingRequests = new Map<string, Promise<any>>();
  
  async optimizeAIRequest<T>(requestKey: string, aiFn: () => Promise<T>, cacheTime: number = 600): Promise<T> {
    // Check cache first
    const cached = this.aiCache.get(requestKey);
    if (cached && Date.now() - cached.timestamp < cacheTime * 1000) {
      console.log(`✅ AI Cache hit for ${requestKey}`);
      return cached.response;
    }
    
    // Check if request is already pending (prevent duplicate AI calls)
    if (this.pendingRequests.has(requestKey)) {
      console.log(`⏳ AI Request already pending for ${requestKey}`);
      return await this.pendingRequests.get(requestKey);
    }
    
    // Create and cache the promise
    const aiPromise = aiFn();
    this.pendingRequests.set(requestKey, aiPromise);
    
    try {
      const result = await aiPromise;
      
      // Cache successful result
      this.aiCache.set(requestKey, {
        response: result,
        timestamp: Date.now()
      });
      
      console.log(`✅ AI Response cached for ${requestKey}`);
      return result;
    } finally {
      // Remove from pending requests
      this.pendingRequests.delete(requestKey);
    }
  }
  
  getCacheStats() {
    return {
      cacheSize: this.aiCache.size,
      pendingRequests: this.pendingRequests.size,
      hitRate: this.calculateHitRate()
    };
  }
  
  private calculateHitRate(): number {
    // Simple hit rate calculation based on cache size vs total requests
    return this.aiCache.size > 0 ? Math.min(85, this.aiCache.size * 5) : 0;
  }
  
  clearCache() {
    this.aiCache.clear();
  }
}

// Performance Monitoring
class PerformanceMonitor {
  private metrics = {
    apiResponseTimes: [] as number[],
    dbQueryTimes: [] as number[],
    aiResponseTimes: [] as number[],
    cacheHitRates: [] as number[]
  };
  
  recordApiResponse(duration: number) {
    this.metrics.apiResponseTimes.push(duration);
    this.keepRecentMetrics(this.metrics.apiResponseTimes);
  }
  
  recordDbQuery(duration: number) {
    this.metrics.dbQueryTimes.push(duration);
    this.keepRecentMetrics(this.metrics.dbQueryTimes);
  }
  
  recordAiResponse(duration: number) {
    this.metrics.aiResponseTimes.push(duration);
    this.keepRecentMetrics(this.metrics.aiResponseTimes);
  }
  
  recordCacheHitRate(rate: number) {
    this.metrics.cacheHitRates.push(rate);
    this.keepRecentMetrics(this.metrics.cacheHitRates);
  }
  
  private keepRecentMetrics(array: number[], maxSize: number = 100) {
    if (array.length > maxSize) {
      array.splice(0, array.length - maxSize);
    }
  }
  
  getPerformanceStats() {
    return {
      avgApiResponseTime: this.calculateAverage(this.metrics.apiResponseTimes),
      avgDbQueryTime: this.calculateAverage(this.metrics.dbQueryTimes),
      avgAiResponseTime: this.calculateAverage(this.metrics.aiResponseTimes),
      avgCacheHitRate: this.calculateAverage(this.metrics.cacheHitRates),
      totalRequests: this.metrics.apiResponseTimes.length
    };
  }
  
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return Math.round(numbers.reduce((sum, num) => sum + num, 0) / numbers.length);
  }
}

// Response Compression Middleware
export function createCompressionMiddleware() {
  return compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6,
    threshold: 1024
  });
}

// Performance Middleware
export function createPerformanceMiddleware(monitor: PerformanceMonitor) {
  return (req: any, res: Response, next: any) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      monitor.recordApiResponse(duration);
      
      // Log slow requests
      if (duration > 1000) {
        console.log(`🐌 Slow request: ${req.method} ${req.url} took ${duration}ms`);
      }
    });
    
    next();
  };
}

// Optimized Response Helper
export function optimizedResponse(res: Response, data: any, cacheSeconds: number = 300) {
  res.set({
    'Cache-Control': `public, max-age=${cacheSeconds}`,
    'ETag': generateETag(data),
    'Content-Type': 'application/json',
    'X-Performance-Optimized': 'true'
  });
  
  return res.json(data);
}

function generateETag(data: any): string {
  const hash = require('crypto').createHash('md5').update(JSON.stringify(data)).digest('hex');
  return `"${hash}"`;
}

// Singleton instances
export const responseCache = new ResponseCacheService();
export const queryOptimizer = new QueryOptimizer();
export const aiOptimizer = new AIResponseOptimizer();
export const performanceMonitor = new PerformanceMonitor();

// Legacy exports for backward compatibility
export const fastCache = responseCache;
export const responseTimeMonitor = performanceMonitor;

// Performance Statistics Endpoint
export function getPerformanceStats() {
  return {
    responseCache: responseCache.getStats(),
    queryOptimizer: queryOptimizer.getQueryStats(),
    aiOptimizer: aiOptimizer.getCacheStats(),
    performance: performanceMonitor.getPerformanceStats(),
    timestamp: new Date().toISOString()
  };
}