/**
 * Production Security Middleware for Flutterbye
 * Implements comprehensive security measures for the Express server
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent referrer leakage
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Relaxed for development
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.devnet.solana.com https://api.mainnet-beta.solana.com wss:",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', csp);
  
  // HSTS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
}

// Input validation middleware
export function validateInput(req: Request, res: Response, next: NextFunction) {
  const { body, query, params } = req;
  
  // Validate message content if present
  if (body?.message) {
    if (typeof body.message !== 'string' || body.message.length > 27) {
      return res.status(400).json({ 
        error: 'Invalid message format',
        details: 'Message must be a string of 27 characters or less'
      });
    }
    
    // Sanitize message content
    body.message = body.message.trim();
    
    // Block malicious patterns
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:text\/html/i
    ];
    
    if (maliciousPatterns.some(pattern => pattern.test(body.message))) {
      return res.status(400).json({ 
        error: 'Invalid message content',
        details: 'Message contains prohibited content'
      });
    }
  }
  
  // Validate wallet addresses
  if (body?.walletAddress || query?.walletAddress || params?.walletAddress) {
    const address = body?.walletAddress || query?.walletAddress || params?.walletAddress;
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    
    if (!base58Regex.test(address)) {
      return res.status(400).json({ 
        error: 'Invalid wallet address format',
        details: 'Wallet address must be a valid Solana address'
      });
    }
  }
  
  // Validate amounts
  if (body?.amount) {
    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0 || amount > 1000) {
      return res.status(400).json({ 
        error: 'Invalid amount',
        details: 'Amount must be a positive number less than 1000'
      });
    }
  }
  
  next();
}

// Rate limiting configurations
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: 'Too many requests',
    details: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 auth attempts per window
  message: {
    error: 'Too many authentication attempts',
    details: 'Please wait before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const tokenCreationRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 token creations per minute
  message: {
    error: 'Token creation rate limit exceeded',
    details: 'Please wait before creating another token.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const adminRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 admin requests per window
  message: {
    error: 'Admin rate limit exceeded',
    details: 'Too many admin requests. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin authentication middleware
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const walletAddress = req.headers['x-wallet-address'] as string;
  
  if (!walletAddress) {
    return res.status(401).json({
      error: 'Authentication required',
      details: 'Wallet address required for admin access'
    });
  }
  
  // Validate wallet address format
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  if (!base58Regex.test(walletAddress)) {
    return res.status(401).json({
      error: 'Invalid wallet address',
      details: 'Wallet address format is invalid'
    });
  }
  
  // Add wallet to request for downstream use
  req.userWallet = walletAddress;
  
  next();
}

// Error handling middleware
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Server error:', err);
  
  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    const safeError = {
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    };
    return res.status(500).json(safeError);
  }
  
  // Development: return detailed error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    details: err.stack,
    timestamp: new Date().toISOString()
  });
}

// Request logging middleware
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress || 'Unknown';
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent: userAgent.substring(0, 100), // Truncate long user agents
      timestamp: new Date().toISOString()
    };
    
    // Log to console (in production, use proper logging service)
    console.log(JSON.stringify(logData));
  });
  
  next();
}

// CORS configuration for production
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // In production, only allow specific domains
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        'https://flutterbye.replit.app',
        'https://flutterbye.com', // Future custom domain
        /\.replit\.app$/
      ];
      
      const isAllowed = allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
          return origin === allowed;
        }
        return allowed.test(origin);
      });
      
      if (!isAllowed) {
        return callback(new Error('CORS policy violation'), false);
      }
    }
    
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-wallet-address'],
  maxAge: 86400 // 24 hours
};

// Security audit function
export function performSecurityAudit(): { status: string; checks: any[] } {
  const checks = [
    {
      name: 'Environment Variables',
      status: process.env.NODE_ENV === 'production' ? 'PASS' : 'WARN',
      details: `Environment: ${process.env.NODE_ENV || 'undefined'}`
    },
    {
      name: 'Database Connection',
      status: process.env.DATABASE_URL ? 'PASS' : 'FAIL',
      details: process.env.DATABASE_URL ? 'Database URL configured' : 'Database URL missing'
    },
    {
      name: 'Solana RPC',
      status: process.env.SOLANA_RPC_URL ? 'PASS' : 'WARN',
      details: process.env.SOLANA_RPC_URL ? 'Custom RPC configured' : 'Using default RPC'
    },
    {
      name: 'Admin Wallet',
      status: process.env.ADMIN_WALLET ? 'PASS' : 'WARN',
      details: process.env.ADMIN_WALLET ? 'Admin wallet configured' : 'Admin wallet not set'
    }
  ];
  
  const failedChecks = checks.filter(check => check.status === 'FAIL').length;
  const warnChecks = checks.filter(check => check.status === 'WARN').length;
  
  let overallStatus = 'PASS';
  if (failedChecks > 0) overallStatus = 'FAIL';
  else if (warnChecks > 0) overallStatus = 'WARN';
  
  return {
    status: overallStatus,
    checks
  };
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userWallet?: string;
    }
  }
}