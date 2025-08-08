/**
 * Production Performance Middleware
 * Implements compression, caching, and optimization for enterprise deployment
 */

import compression from 'compression';
import { Request, Response, NextFunction } from 'express';

// Advanced compression middleware
export const compressionMiddleware = compression({
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Good balance of compression vs CPU
  threshold: 1024, // Only compress files larger than 1KB
  chunkSize: 16 * 1024, // 16KB chunks
});

// Cache control for static assets
export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    // Static assets cache for 1 year
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.url.match(/\.(html|json)$/)) {
    // HTML and JSON cache for 1 hour
    res.setHeader('Cache-Control', 'public, max-age=3600');
  } else {
    // Default cache for 5 minutes
    res.setHeader('Cache-Control', 'public, max-age=300');
  }
  next();
};

// Performance headers
export const performanceHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Security headers for production
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Performance headers
  res.setHeader('X-DNS-Prefetch-Control', 'on');
  res.setHeader('X-Powered-By', 'Flutterbye Enterprise');
  
  next();
};

// Memory optimization middleware
export const memoryOptimization = (req: Request, res: Response, next: NextFunction) => {
  // Cleanup request data after response
  res.on('finish', () => {
    if (req.body && typeof req.body === 'object') {
      Object.keys(req.body).forEach(key => delete req.body[key]);
    }
  });
  
  next();
};

// Request timing middleware
export const requestTiming = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 500) { // Only log slow requests
      console.log(`⚠️ Slow request: ${req.method} ${req.url} - ${duration}ms`);
    }
  });
  
  next();
};

// Bundle all performance middleware
export const performanceMiddlewareStack = [
  compressionMiddleware,
  cacheMiddleware,
  performanceHeaders,
  memoryOptimization,
  requestTiming
];