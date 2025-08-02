// Production security middleware
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Basic security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https: wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', csp);
  
  // HSTS for HTTPS
  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
};

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize query parameters
  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') {
        req.query[key] = sanitizeString(value);
      }
    }
  }
  
  // Sanitize body parameters
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  
  next();
};

// String sanitization
function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
}

// Object sanitization
function sanitizeObject(obj: any): void {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      obj[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitizeObject(value);
    }
  }
}

// Request validation middleware factory
export const validateRequest = (validation: {
  body?: (body: any) => { isValid: boolean; errors?: string[] };
  query?: (query: any) => { isValid: boolean; errors?: string[] };
  params?: (params: any) => { isValid: boolean; errors?: string[] };
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
    
    // Validate body
    if (validation.body && req.body) {
      const bodyValidation = validation.body(req.body);
      if (!bodyValidation.isValid) {
        errors.push(...(bodyValidation.errors || ['Invalid body']));
      }
    }
    
    // Validate query
    if (validation.query && req.query) {
      const queryValidation = validation.query(req.query);
      if (!queryValidation.isValid) {
        errors.push(...(queryValidation.errors || ['Invalid query parameters']));
      }
    }
    
    // Validate params
    if (validation.params && req.params) {
      const paramsValidation = validation.params(req.params);
      if (!paramsValidation.isValid) {
        errors.push(...(paramsValidation.errors || ['Invalid URL parameters']));
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
};

// Message validation
export const validateMessage = (message: string): { isValid: boolean; error?: string } => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message is required and must be a string' };
  }
  
  if (message.length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (message.length > 27) {
    return { isValid: false, error: 'Message must be 27 characters or less' };
  }
  
  // Check for prohibited content
  const prohibited = ['script', 'javascript:', 'data:', 'vbscript:', 'onload', 'onerror'];
  const lowerMessage = message.toLowerCase();
  
  for (const term of prohibited) {
    if (lowerMessage.includes(term)) {
      return { isValid: false, error: 'Message contains prohibited content' };
    }
  }
  
  return { isValid: true };
};

// Wallet address validation
export const validateWalletAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  // Solana wallet addresses are base58 encoded and typically 44 characters
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
};

// Numeric validation
export const validateNumeric = (value: any, options: {
  min?: number;
  max?: number;
  integer?: boolean;
} = {}): { isValid: boolean; error?: string } => {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Must be a valid number' };
  }
  
  if (options.integer && !Number.isInteger(num)) {
    return { isValid: false, error: 'Must be an integer' };
  }
  
  if (options.min !== undefined && num < options.min) {
    return { isValid: false, error: `Must be at least ${options.min}` };
  }
  
  if (options.max !== undefined && num > options.max) {
    return { isValid: false, error: `Must be at most ${options.max}` };
  }
  
  return { isValid: true };
};

// CORS middleware for production
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'https://flutterbye.replit.app',
    'https://flutterbye-production.replit.app',
    process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : null
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};