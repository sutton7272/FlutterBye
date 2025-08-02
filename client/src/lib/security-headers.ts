/**
 * Client-side security utilities and Content Security Policy helpers
 */

// CSP directives for the application
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in development
    "'unsafe-eval'", // Required for development
    'https://cdn.jsdelivr.net',
    'https://unpkg.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind and styled components
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'data:'
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.replit.app',
    'https://storage.googleapis.com',
    'https://replit.com'
  ],
  'connect-src': [
    "'self'",
    'wss://*.replit.app',
    'https://api.solana.com',
    'https://api.devnet.solana.com',
    'https://*.helius-rpc.com'
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

// Generate CSP header value
export const generateCSPHeader = (): string => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
};

// Input sanitization utilities
export const sanitizeInput = {
  // Remove potentially dangerous characters
  text: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  },

  // Sanitize for blockchain addresses
  address: (input: string): string => {
    return input.replace(/[^a-zA-Z0-9]/g, '').slice(0, 44);
  },

  // Sanitize numeric input
  number: (input: string): string => {
    return input.replace(/[^0-9.-]/g, '');
  },

  // Sanitize URLs
  url: (input: string): string => {
    try {
      const url = new URL(input);
      // Only allow http/https protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        return '';
      }
      return url.toString();
    } catch {
      return '';
    }
  }
};

// XSS prevention utilities
export const xssProtection = {
  // Escape HTML entities
  escapeHtml: (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Validate and sanitize user content
  sanitizeUserContent: (content: string): string => {
    return sanitizeInput.text(xssProtection.escapeHtml(content));
  },

  // Check for suspicious patterns
  detectSuspiciousContent: (content: string): boolean => {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(content));
  }
};

// Secure local storage wrapper
export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const sanitizedKey = sanitizeInput.text(key);
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(sanitizedKey, serializedValue);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const sanitizedKey = sanitizeInput.text(key);
      const item = localStorage.getItem(sanitizedKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue;
    }
  },

  removeItem: (key: string): void => {
    try {
      const sanitizedKey = sanitizeInput.text(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }
};

// Security headers validation (for development)
export const validateSecurityHeaders = (): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Security Headers Validation:');
    console.log('CSP Header:', generateCSPHeader());
  }
};

// Rate limiting for client-side actions
export class ClientRateLimit {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(action: string, limit: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(action) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= limit) {
      return false;
    }

    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(action, validAttempts);
    
    return true;
  }

  reset(action: string): void {
    this.attempts.delete(action);
  }
}

// Global rate limiter instance
export const rateLimiter = new ClientRateLimit();