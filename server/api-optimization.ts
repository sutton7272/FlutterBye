// API Response Optimization and Caching Layer
import { Request, Response, NextFunction } from 'express';

// Smart caching with memory management
class SmartCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number; hits: number }>();
  private maxSize = 500; // Reduced from 1000
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Disable cleanup during optimization phase
    // this.cleanupInterval = setInterval(() => {
    //   this.cleanup();
    // }, 600000); // Every 10 minutes when enabled
  }

  set(key: string, data: any, ttl: number = 300000) {
    // Remove oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Increment hit counter
    entry.hits++;
    return entry.data;
  }

  cleanup() {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`Cache cleanup: Removed ${keysToDelete.length} expired entries`);
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key: key.substring(0, 50),
        age: Date.now() - entry.timestamp,
        hits: entry.hits
      })).slice(0, 10) // Top 10 entries
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

export const smartCache = new SmartCache();

// Optimized middleware for high-traffic endpoints
export const optimizedCache = (ttl: number = 300000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.originalUrl || req.url}`;
    const cached = smartCache.get(key);

    if (cached) {
      res.set('X-Cache', 'HIT');
      res.set('X-Cache-Age', Math.floor((Date.now() - cached.timestamp) / 1000).toString());
      return res.json(cached.data);
    }

    res.set('X-Cache', 'MISS');
    
    // Override res.json to cache successful responses
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      if (res.statusCode === 200) {
        smartCache.set(key, body, ttl);
      }
      return originalJson(body);
    };

    next();
  };
};

// Response compression with intelligent detection
export const intelligentCompression = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = parseInt(res.get('Content-Length') || '0');
  
  // Only compress responses larger than 1KB
  if (contentLength > 1024) {
    res.set('Content-Encoding', 'gzip');
  }
  
  next();
};

// Request deduplication for identical requests
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  async deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    const promise = fn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  getStats() {
    return {
      pendingRequests: this.pendingRequests.size,
      keys: Array.from(this.pendingRequests.keys()).slice(0, 10)
    };
  }
}

export const requestDeduplicator = new RequestDeduplicator();