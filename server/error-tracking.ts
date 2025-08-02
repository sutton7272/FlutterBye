import { Request, Response, NextFunction } from 'express';

export interface ErrorLog {
  id: string;
  timestamp: Date;
  error: string;
  stack?: string;
  request: {
    method: string;
    url: string;
    headers: Record<string, any>;
    body?: any;
    user?: any;
  };
  level: 'error' | 'warn' | 'info';
  tags: string[];
}

class ErrorTracker {
  private errors: ErrorLog[] = [];
  private maxErrors = 1000; // Keep last 1000 errors in memory

  // Log an error
  logError(error: Error | string, request?: Request, level: 'error' | 'warn' | 'info' = 'error', tags: string[] = []) {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date(),
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      request: request ? {
        method: request.method,
        url: request.url,
        headers: this.sanitizeHeaders(request.headers),
        body: this.sanitizeBody(request.body),
        user: (request as any).user ? {
          id: (request as any).user.id,
          walletAddress: (request as any).user.walletAddress
        } : undefined
      } : {
        method: 'UNKNOWN',
        url: 'UNKNOWN',
        headers: {}
      },
      level,
      tags
    };

    this.errors.unshift(errorLog);
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console based on level
    if (level === 'error') {
      console.error('Error logged:', errorLog);
    } else if (level === 'warn') {
      console.warn('Warning logged:', errorLog);
    } else {
      console.log('Info logged:', errorLog);
    }

    // In production, send to external error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorLog);
    }
  }

  // Get recent errors
  getRecentErrors(limit = 50, level?: 'error' | 'warn' | 'info'): ErrorLog[] {
    let filteredErrors = this.errors;
    
    if (level) {
      filteredErrors = this.errors.filter(error => error.level === level);
    }
    
    return filteredErrors.slice(0, limit);
  }

  // Get error statistics
  getErrorStats() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const errorsLastHour = this.errors.filter(error => error.timestamp > oneHourAgo);
    const errorsLastDay = this.errors.filter(error => error.timestamp > oneDayAgo);

    return {
      total: this.errors.length,
      lastHour: errorsLastHour.length,
      lastDay: errorsLastDay.length,
      byLevel: {
        error: this.errors.filter(e => e.level === 'error').length,
        warn: this.errors.filter(e => e.level === 'warn').length,
        info: this.errors.filter(e => e.level === 'info').length
      },
      topTags: this.getTopTags()
    };
  }

  // Clear errors
  clearErrors() {
    this.errors = [];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private sanitizeHeaders(headers: any): Record<string, any> {
    const sanitized = { ...headers };
    
    // Remove sensitive headers
    delete sanitized.authorization;
    delete sanitized.cookie;
    delete sanitized['x-api-key'];
    
    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body) return undefined;
    
    const sanitized = { ...body };
    
    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.privateKey;
    delete sanitized.secret;
    delete sanitized.token;
    
    return sanitized;
  }

  private getTopTags(): Array<{ tag: string; count: number }> {
    const tagCounts: Record<string, number> = {};
    
    this.errors.forEach(error => {
      error.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private async sendToExternalService(errorLog: ErrorLog) {
    // Placeholder for external error tracking service integration
    // Examples: Sentry, LogRocket, Rollbar, etc.
    try {
      // await sentryClient.captureException(errorLog);
    } catch (error) {
      console.error('Failed to send error to external service:', error);
    }
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker();

// Express error handling middleware
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  errorTracker.logError(error, req, 'error', ['express', 'unhandled']);

  // Send appropriate response
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    error: 'Internal server error',
    message: isDevelopment ? error.message : 'Something went wrong',
    stack: isDevelopment ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    requestId: (req as any).requestId || 'unknown'
  });
};

// Request ID middleware for tracking
export const addRequestId = (req: Request, res: Response, next: NextFunction) => {
  const requestId = Math.random().toString(36).substr(2, 9);
  (req as any).requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      errorTracker.logError(error, req, 'error', ['async', 'handler']);
      next(error);
    });
  };
};