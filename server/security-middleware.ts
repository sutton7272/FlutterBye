// Production security middleware
import type { Request, Response, NextFunction } from 'express';
import { PublicKey } from '@solana/web3.js';

// Input sanitization
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Remove any potentially dangerous characters from string inputs
  const sanitizeString = (str: string): string => {
    return str.replace(/[<>'"]/g, '').trim();
  };

  // Recursively sanitize object properties
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  next();
}

// Validate Solana wallet addresses
export function validateWalletAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

// Validate message content
export function validateMessage(message: string): { isValid: boolean; error?: string } {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message is required' };
  }
  
  if (message.length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (message.length > 27) {
    return { isValid: false, error: 'Message must be 27 characters or less' };
  }
  
  // Check for potentially harmful content
  const bannedPatterns = [
    /javascript:/i,
    /<script/i,
    /vbscript:/i,
    /data:text\/html/i
  ];
  
  if (bannedPatterns.some(pattern => pattern.test(message))) {
    return { isValid: false, error: 'Message contains invalid content' };
  }
  
  return { isValid: true };
}

// Validate numeric values
export function validateNumericValue(value: any, min = 0, max = Number.MAX_SAFE_INTEGER): boolean {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max && Number.isFinite(num);
}

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remove potentially revealing headers
  res.removeHeader('X-Powered-By');
  
  next();
}

// Request validation middleware factory
export function validateRequest(schema: {
  body?: (body: any) => { isValid: boolean; errors?: string[] };
  query?: (query: any) => { isValid: boolean; errors?: string[] };
  params?: (params: any) => { isValid: boolean; errors?: string[] };
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
    
    if (schema.body && req.body) {
      const result = schema.body(req.body);
      if (!result.isValid && result.errors) {
        errors.push(...result.errors);
      }
    }
    
    if (schema.query && req.query) {
      const result = schema.query(req.query);
      if (!result.isValid && result.errors) {
        errors.push(...result.errors);
      }
    }
    
    if (schema.params && req.params) {
      const result = schema.params(req.params);
      if (!result.isValid && result.errors) {
        errors.push(...result.errors);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }
    
    next();
  };
}

// Content Security Policy
export function contentSecurityPolicy(req: Request, res: Response, next: NextFunction) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://replit.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.devnet.solana.com wss: ws:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', csp);
  next();
}