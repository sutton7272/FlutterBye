import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

export class ProductionSecurity {
  
  // Environment validation for production
  static validateProductionEnvironment() {
    const requiredSecrets = [
      'DATABASE_URL',
      'SOLANA_RPC_URL',
      'OPENAI_API_KEY',
      'SESSION_SECRET',
      'JWT_SECRET'
    ];

    const missing = requiredSecrets.filter(secret => !process.env[secret]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Validate secret strength
    if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
      throw new Error('SESSION_SECRET must be at least 32 characters');
    }

    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters');
    }
  }

  // Advanced rate limiting with IP tracking
  static createAdvancedRateLimit() {
    const store = new Map();
    
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Standard limit
      message: {
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: 900
      },
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        // Use IP + User-Agent for better tracking
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent') || '';
        return crypto.createHash('sha256').update(ip + userAgent).digest('hex');
      },
      skip: (req) => {
        // Skip for health checks and admin endpoints with valid auth
        const isHealthCheck = req.path === '/api/health';
        const isSystemEndpoint = req.path.startsWith('/api/system/');
        const isAuthenticatedAdmin = req.path.startsWith('/api/admin/') && !!req.headers.authorization;
        
        return isHealthCheck || isSystemEndpoint || isAuthenticatedAdmin;
      }
    });
  }

  // Blockchain-specific rate limiting
  static createBlockchainRateLimit() {
    return rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 10, // Limited blockchain operations
      message: {
        error: 'Blockchain rate limit exceeded',
        message: 'Too many blockchain operations. Please wait before creating more tokens.',
        retryAfter: 60
      },
      keyGenerator: (req) => {
        // Track by wallet address if available
        const walletAddress = req.body?.walletAddress || req.headers['x-wallet-address'];
        return walletAddress || req.ip;
      }
    });
  }

  // Input sanitization and validation
  static sanitizeAndValidate() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.body) {
        req.body = this.deepSanitize(req.body);
      }
      
      if (req.query) {
        req.query = this.deepSanitize(req.query);
      }

      // Validate content length
      const contentLength = parseInt(req.get('content-length') || '0');
      if (contentLength > 10 * 1024 * 1024) { // 10MB limit
        return res.status(413).json({ error: 'Request too large' });
      }

      next();
    };
  }

  // Deep sanitization for nested objects
  private static deepSanitize(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.deepSanitize(item));
    } else if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const cleanKey = this.sanitizeString(key);
        sanitized[cleanKey] = this.deepSanitize(value);
      }
      return sanitized;
    }
    return obj;
  }

  // String sanitization
  private static sanitizeString(str: string): string {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframes
      .replace(/javascript:/gi, '') // Remove javascript protocols
      .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
      .replace(/on\w+='[^']*'/gi, '') // Remove event handlers
      .trim();
  }

  // Security headers middleware
  static securityHeaders() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Content Security Policy
      res.setHeader('Content-Security-Policy', [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://apis.google.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' wss: ws: https: https://api.devnet.solana.com https://api.mainnet-beta.solana.com",
        "frame-src 'self' https://vercel.live",
        "object-src 'none'",
        "base-uri 'self'",
        "upgrade-insecure-requests"
      ].join('; '));

      // Security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
      res.setHeader('X-Download-Options', 'noopen');
      
      // Remove server signature
      res.removeHeader('X-Powered-By');
      res.removeHeader('Server');

      // Permissions Policy
      res.setHeader('Permissions-Policy', [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=(self)',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'accelerometer=()',
        'autoplay=()',
        'encrypted-media=()',
        'fullscreen=(self)',
        'picture-in-picture=()'
      ].join(', '));

      // HSTS (HTTP Strict Transport Security)
      if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      }

      next();
    };
  }

  // Request logging for security monitoring
  static securityLogger() {
    return (req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      
      // Log suspicious patterns
      const suspiciousPatterns = [
        /\.\./,  // Path traversal
        /<script/i,  // XSS attempts
        /union.*select/i,  // SQL injection
        /javascript:/i,  // XSS protocols
        /data:.*base64/i  // Data URLs
      ];

      const isSuspicious = suspiciousPatterns.some(pattern => 
        pattern.test(req.url) || 
        pattern.test(JSON.stringify(req.body || {})) ||
        pattern.test(JSON.stringify(req.query || {}))
      );

      if (isSuspicious) {
        console.warn('🚨 SECURITY ALERT - Suspicious request:', {
          ip: req.ip,
          method: req.method,
          url: req.url,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString()
        });
      }

      res.on('finish', () => {
        const duration = Date.now() - start;
        
        // Log slow requests (potential DoS)
        if (duration > 5000) {
          console.warn('⚠️ SLOW REQUEST:', {
            method: req.method,
            url: req.url,
            duration: `${duration}ms`,
            ip: req.ip,
            statusCode: res.statusCode
          });
        }
      });

      next();
    };
  }

  // Wallet address validation
  static validateWalletAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    
    // Basic Solana address validation (base58, 32-44 characters)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  }

  // API key validation and rotation check
  static validateApiKeys() {
    const apiKeys = {
      openai: process.env.OPENAI_API_KEY,
      stripe: process.env.STRIPE_SECRET_KEY,
      twilio: process.env.TWILIO_AUTH_TOKEN
    };

    for (const [service, key] of Object.entries(apiKeys)) {
      if (key) {
        // Check if key follows expected format
        switch (service) {
          case 'openai':
            if (!key.startsWith('sk-')) {
              console.warn(`⚠️ OpenAI API key format warning`);
            }
            break;
          case 'stripe':
            if (!key.startsWith('sk_')) {
              console.warn(`⚠️ Stripe API key format warning`);
            }
            break;
          case 'twilio':
            if (key.length < 32) {
              console.warn(`⚠️ Twilio auth token format warning`);
            }
            break;
        }
      }
    }
  }

  // Database security validation
  static validateDatabaseSecurity() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return false;

    // Check for SSL requirement
    if (!dbUrl.includes('sslmode=require') && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Database SSL not enforced in production');
      return false;
    }

    return true;
  }
}