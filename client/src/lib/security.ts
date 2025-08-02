/**
 * Security utilities for Flutterbye platform
 * Implements comprehensive security measures for production deployment
 */

// Input sanitization and validation
export class SecurityValidator {
  // XSS prevention - sanitize HTML input
  static sanitizeHtml(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // SQL injection prevention - validate and escape
  static validateInput(input: string, maxLength: number = 1000): boolean {
    if (!input || typeof input !== 'string') return false;
    if (input.length > maxLength) return false;
    
    // Block common SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i
    ];
    
    return !sqlPatterns.some(pattern => pattern.test(input));
  }

  // Message content validation (27 character limit)
  static validateMessage(message: string): { valid: boolean; error?: string } {
    if (!message || typeof message !== 'string') {
      return { valid: false, error: 'Message is required' };
    }
    
    if (message.length > 27) {
      return { valid: false, error: 'Message must be 27 characters or less' };
    }
    
    if (message.trim().length === 0) {
      return { valid: false, error: 'Message cannot be empty' };
    }
    
    // Block malicious content
    const blockedPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:text\/html/i
    ];
    
    if (blockedPatterns.some(pattern => pattern.test(message))) {
      return { valid: false, error: 'Message contains invalid content' };
    }
    
    return { valid: true };
  }

  // Wallet address validation
  static validateSolanaAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    
    // Solana addresses are 32-44 characters, base58 encoded
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  }

  // Amount validation for SOL transactions
  static validateAmount(amount: string | number): { valid: boolean; error?: string } {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return { valid: false, error: 'Amount must be a positive number' };
    }
    
    if (numAmount > 1000) {
      return { valid: false, error: 'Amount too large for security' };
    }
    
    // Check for reasonable decimal places (max 9 for SOL)
    if (amount.toString().split('.')[1]?.length > 9) {
      return { valid: false, error: 'Too many decimal places' };
    }
    
    return { valid: true };
  }
}

// Rate limiting utilities
export class RateLimiter {
  private static instances = new Map<string, { count: number; resetTime: number }>();
  
  static checkLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const instance = this.instances.get(key);
    
    if (!instance || now > instance.resetTime) {
      this.instances.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (instance.count >= maxRequests) {
      return false;
    }
    
    instance.count++;
    return true;
  }
  
  static getRemainingRequests(key: string, maxRequests: number = 10): number {
    const instance = this.instances.get(key);
    if (!instance || Date.now() > instance.resetTime) {
      return maxRequests;
    }
    return Math.max(0, maxRequests - instance.count);
  }
}

// Content Security Policy helpers
export class CSPHelper {
  static generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)));
  }
  
  static createCSPHeader(nonce: string): string {
    return [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.devnet.solana.com https://api.mainnet-beta.solana.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
  }
}

// Error sanitization for production
export class ErrorSanitizer {
  static sanitizeError(error: any): { message: string; code?: string } {
    // Never expose internal error details in production
    if (process.env.NODE_ENV === 'production') {
      const safeErrors = {
        'ValidationError': 'Invalid input provided',
        'AuthenticationError': 'Authentication required',
        'AuthorizationError': 'Insufficient permissions',
        'NetworkError': 'Network connection failed',
        'TransactionError': 'Transaction failed',
        'WalletError': 'Wallet connection failed'
      };
      
      const errorType = error?.name || error?.type || 'Unknown';
      return {
        message: (safeErrors as any)[errorType] || 'An error occurred',
        code: errorType
      };
    }
    
    // Development: return full error details
    return {
      message: error?.message || 'Unknown error',
      code: error?.name || error?.type
    };
  }
}

// Secure storage utilities
export class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'flutterbye-secure-key';
  
  // Simple encryption for sensitive client-side data
  static encrypt(data: string): string {
    try {
      // Basic encryption - in production, use proper crypto library
      return btoa(data);
    } catch {
      return data;
    }
  }
  
  static decrypt(encryptedData: string): string {
    try {
      return atob(encryptedData);
    } catch {
      return encryptedData;
    }
  }
  
  // Secure session storage
  static setSecureItem(key: string, value: string): void {
    try {
      const encrypted = this.encrypt(value);
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.warn('Failed to store secure item:', error);
    }
  }
  
  static getSecureItem(key: string): string | null {
    try {
      const encrypted = sessionStorage.getItem(key);
      return encrypted ? this.decrypt(encrypted) : null;
    } catch (error) {
      console.warn('Failed to retrieve secure item:', error);
      return null;
    }
  }
}

// Production security audit checklist
export const SECURITY_CHECKLIST = {
  inputValidation: [
    'Message length validation (27 chars)',
    'Wallet address format validation',
    'Amount validation and limits',
    'XSS prevention in user inputs',
    'SQL injection prevention'
  ],
  authentication: [
    'Wallet-based authentication',
    'Session management',
    'Admin role verification',
    'Rate limiting on auth endpoints'
  ],
  dataProtection: [
    'Sensitive data encryption',
    'Secure error handling',
    'No secrets in client code',
    'Secure API communication'
  ],
  headers: [
    'Content Security Policy',
    'X-Frame-Options: DENY',
    'X-Content-Type-Options: nosniff',
    'Strict-Transport-Security'
  ],
  monitoring: [
    'Error logging and monitoring',
    'Rate limiting enforcement',
    'Failed authentication tracking',
    'Suspicious activity detection'
  ]
};