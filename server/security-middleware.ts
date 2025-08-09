import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Enhanced security middleware for production
export class SecurityMiddleware {
  
  // CORS configuration
  static corsMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://*.replit.app',
        'https://*.replit.co',
        'https://*.replit.dev'
      ];

      const origin = req.headers.origin;
      
      if (origin && allowedOrigins.some(allowed => 
        allowed.includes('*') ? origin.includes(allowed.replace('*', '')) : allowed === origin
      )) {
        res.header('Access-Control-Allow-Origin', origin);
      }

      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-User-ID');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400');

      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    };
  }

  // Comprehensive security headers
  static securityHeaders() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Content Security Policy - DISABLED to fix error boundary issues
      // res.setHeader('Content-Security-Policy', [
      //   "default-src 'self'",
      //   "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://cdn.jsdelivr.net blob:",
      //   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      //   "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:",
      //   "img-src 'self' data: https: blob:",
      //   "connect-src 'self' wss: ws: https: wss://*.replit.dev ws://*.replit.dev",
      //   "frame-src 'self' https://vercel.live",
      //   "object-src 'none'",
      //   "base-uri 'self'",
      //   "worker-src 'self' blob:"
      // ].join('; '));

      // Security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=(self)',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'accelerometer=()'
      ].join(', '));

      // HSTS (HTTP Strict Transport Security)
      if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      }

      next();
    };
  }

  // Rate limiting with different tiers
  static createRateLimiter(maxRequests: number, windowMs: number, message?: string) {
    return rateLimit({
      windowMs,
      max: maxRequests,
      message: {
        error: 'Rate limit exceeded',
        message: message || `Too many requests. Try again in ${Math.ceil(windowMs / 60000)} minutes.`,
        retryAfter: Math.ceil(windowMs / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => {
        // Skip rate limiting for health checks and system endpoints
        return req.path === '/api/health' || req.path.startsWith('/api/system/');
      }
    });
  }

  // Input sanitization middleware
  static sanitizeInput() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.body) {
        req.body = this.sanitizeObject(req.body);
      }
      
      if (req.query) {
        req.query = this.sanitizeObject(req.query);
      }
      
      if (req.params) {
        req.params = this.sanitizeObject(req.params);
      }
      
      next();
    };
  }

  // Sanitize object recursively
  private static sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    } else if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[this.sanitizeString(key)] = this.sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  }

  // Sanitize string input
  private static sanitizeString(str: string): string {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/[<>]/g, '') // Remove basic XSS vectors
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 10000); // Limit length
  }

  // Request logging middleware
  static requestLogger() {
    return (req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      const userAgent = req.headers['user-agent'] || 'unknown';
      const userKey = (req as any).user?.userId || 'anonymous';
      
      // Log request
      console.log(`🌐 ${req.method} ${req.path} - ${req.ip} - ${userKey}`);
      
      // Log response when finished
      res.on('finish', () => {
        const duration = Date.now() - start;
        const level = res.statusCode >= 400 ? '❌' : '✅';
        console.log(`${level} ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
      });
      
      next();
    };
  }

  // Error handling middleware
  static errorHandler() {
    return (err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('🚨 Server error:', err);
      
      // Don't leak error details in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      const errorResponse = {
        error: 'Internal server error',
        message: isDevelopment ? err.message : 'Something went wrong',
        ...(isDevelopment && { stack: err.stack }),
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'unknown'
      };
      
      res.status(err.status || 500).json(errorResponse);
    };
  }

  // Request timeout middleware
  static requestTimeout(timeoutMs: number = 30000) {
    return (req: Request, res: Response, next: NextFunction) => {
      const timeout = setTimeout(() => {
        if (!res.headersSent) {
          res.status(408).json({
            error: 'Request timeout',
            message: `Request took longer than ${timeoutMs}ms to complete`
          });
        }
      }, timeoutMs);
      
      res.on('finish', () => clearTimeout(timeout));
      res.on('close', () => clearTimeout(timeout));
      
      next();
    };
  }

  // Content validation middleware
  static validateContentType(allowedTypes: string[] = ['application/json']) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.headers['content-type'];
        
        if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
          return res.status(415).json({
            error: 'Unsupported Media Type',
            message: `Content-Type must be one of: ${allowedTypes.join(', ')}`
          });
        }
      }
      
      next();
    };
  }

  // Request size limit middleware
  static requestSizeLimit(maxSizeBytes: number = 10 * 1024 * 1024) { // 10MB default
    return (req: Request, res: Response, next: NextFunction) => {
      const contentLength = parseInt(req.headers['content-length'] || '0');
      
      if (contentLength > maxSizeBytes) {
        return res.status(413).json({
          error: 'Request too large',
          message: `Request size ${contentLength} bytes exceeds limit of ${maxSizeBytes} bytes`
        });
      }
      
      next();
    };
  }
}

// Pre-configured middleware bundles
export const productionMiddleware = [
  SecurityMiddleware.corsMiddleware(),
  SecurityMiddleware.securityHeaders(),
  SecurityMiddleware.sanitizeInput(),
  SecurityMiddleware.requestLogger(),
  SecurityMiddleware.requestTimeout(30000),
  SecurityMiddleware.validateContentType(),
  SecurityMiddleware.requestSizeLimit()
];

export const authenticationRateLimit = SecurityMiddleware.createRateLimiter(
  50, 15 * 60 * 1000, 'Too many authentication attempts'
);

export const adminRateLimit = SecurityMiddleware.createRateLimiter(
  500, 15 * 60 * 1000, 'Too many admin requests'
);

export const tokenCreationRateLimit = SecurityMiddleware.createRateLimiter(
  100, 60 * 1000, 'Too many token creation attempts'
);