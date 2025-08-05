import { Request, Response, NextFunction } from 'express';

// Log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// Logger configuration
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  maxFileSize: number;
  maxFiles: number;
}

// Production logger
class ProductionLogger {
  private config: LoggerConfig;
  private logBuffer: string[] = [];
  private readonly maxBufferSize = 1000;

  constructor(config: LoggerConfig) {
    this.config = config;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
      pid: process.pid,
      service: 'flutterbye-api',
    };
    
    return JSON.stringify(logEntry);
  }

  private writeLog(formattedMessage: string) {
    if (this.config.enableConsole) {
      console.log(formattedMessage);
    }

    // Buffer logs for file writing
    if (this.config.enableFile) {
      this.logBuffer.push(formattedMessage);
      if (this.logBuffer.length > this.maxBufferSize) {
        this.logBuffer.shift(); // Remove oldest entry
      }
    }
  }

  error(message: string, meta?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.writeLog(this.formatMessage('ERROR', message, meta));
    }
  }

  warn(message: string, meta?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      this.writeLog(this.formatMessage('WARN', message, meta));
    }
  }

  info(message: string, meta?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      this.writeLog(this.formatMessage('INFO', message, meta));
    }
  }

  debug(message: string, meta?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.writeLog(this.formatMessage('DEBUG', message, meta));
    }
  }

  getBufferedLogs(): string[] {
    return [...this.logBuffer];
  }

  clearBuffer() {
    this.logBuffer = [];
  }
}

// Default logger instance
export const logger = new ProductionLogger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableFile: process.env.NODE_ENV === 'production',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
});

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  // Add request ID to request object
  (req as any).requestId = requestId;

  logger.info('Request started', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'error' : 'info';
    
    logger[level]('Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      contentLength: res.get('Content-Length'),
    });
  });

  next();
};

// Error logging middleware
export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const requestId = (req as any).requestId;
  
  logger.error('Request error', {
    requestId,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    },
  });

  next(error);
};