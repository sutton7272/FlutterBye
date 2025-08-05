import { Request, Response, NextFunction } from 'express';
import compression from 'compression';

// Response compression
export const responseCompression = compression({
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Balanced compression level
  threshold: 1024, // Only compress responses larger than 1KB
});

// Cache control middleware
export const cacheControl = (maxAge: number = 3600) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set cache headers for static resources
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${maxAge}`);
      res.set('ETag', generateETag(req.url));
    }
    next();
  };
};

// Simple ETag generation
const generateETag = (url: string): string => {
  return `"${Buffer.from(url + Date.now().toString()).toString('base64').slice(0, 16)}"`;
};

// Request timeout middleware
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({ message: 'Request timeout' });
      }
    }, timeoutMs);

    res.on('finish', () => {
      clearTimeout(timeout);
    });

    res.on('close', () => {
      clearTimeout(timeout);
    });

    next();
  };
};

// CORS configuration
export const corsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://flutterbye.com', 'https://www.flutterbye.com']
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400, // 24 hours
};

// Response optimization middleware
export const responseOptimization = (req: Request, res: Response, next: NextFunction) => {
  // Remove unnecessary headers
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();
};

// Database connection pooling configuration
export const dbPoolConfig = {
  min: 2,
  max: 10,
  idle: 10000,
  acquire: 60000,
  evict: 1000,
};

// Memory optimization
export const optimizeMemory = () => {
  // Force garbage collection periodically (if --expose-gc flag is used)
  if ((global as any).gc) {
    setInterval(() => {
      const usage = process.memoryUsage();
      const usedMB = usage.heapUsed / 1024 / 1024;
      
      if (usedMB > 300) {
        (global as any).gc();
        console.log('Garbage collection triggered - Memory optimized');
      }
    }, 60000); // Every minute
  }

  // Monitor event loop lag
  let start = process.hrtime.bigint();
  setInterval(() => {
    const delta = process.hrtime.bigint() - start;
    const lag = Number(delta) / 1e6; // Convert to milliseconds
    
    if (lag > 100) {
      console.warn(`Event loop lag detected: ${lag.toFixed(2)}ms`);
    }
    
    start = process.hrtime.bigint();
  }, 5000); // Check every 5 seconds
};

// API response caching
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class ResponseCache {
  private cache = new Map<string, CacheEntry>();
  private readonly maxEntries = 1000;

  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
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

  clear() {
    this.cache.clear();
  }
}

export const responseCache = new ResponseCache();

// Caching middleware
export const apiCache = (ttl: number = 300000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.originalUrl || req.url}`;
    const cached = responseCache.get(key);

    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    res.set('X-Cache', 'MISS');
    
    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(body: any) {
      responseCache.set(key, body, ttl);
      return originalJson.call(this, body);
    };

    next();
  };
};