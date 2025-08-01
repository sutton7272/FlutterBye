// Production monitoring and analytics system
import type { Request, Response, NextFunction } from 'express';

interface MetricData {
  timestamp: Date;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  ip?: string;
  error?: string;
}

class MonitoringService {
  private metrics: MetricData[] = [];
  private errorCounts: Map<string, number> = new Map();
  private endpointCounts: Map<string, number> = new Map();

  // Request monitoring middleware
  requestMonitor() {
    const self = this;
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      // Override res.end to capture response data
      const originalEnd = res.end;
      res.end = function(...args: any[]) {
        const responseTime = Date.now() - startTime;
        
        const metric: MetricData = {
          timestamp: new Date(),
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          responseTime,
          userAgent: req.get('User-Agent'),
          ip: req.ip
        };

        // Log error responses
        if (res.statusCode >= 400) {
          metric.error = res.locals.error || 'Unknown error';
        }

        self.logMetric(metric);
        originalEnd.apply(this, args);
      };

      next();
    };
  }

  private logMetric(metric: MetricData) {
    this.metrics.push(metric);
    
    // Update counters
    const endpointKey = `${metric.method} ${metric.endpoint}`;
    this.endpointCounts.set(endpointKey, (this.endpointCounts.get(endpointKey) || 0) + 1);
    
    if (metric.statusCode >= 400) {
      const errorKey = `${metric.statusCode}`;
      this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);
    }

    // Store critical metrics in database
    if (metric.statusCode >= 500 || metric.responseTime > 5000) {
      this.logToDatabase(metric);
    }

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  private async logToDatabase(metric: MetricData) {
    try {
      // Log to console for now, database integration later
      console.log('Critical metric:', metric);
    } catch (error) {
      console.error('Failed to log metric to database:', error);
    }
  }

  // Get metrics summary
  getMetricsSummary() {
    const now = Date.now();
    const lastHour = this.metrics.filter(m => now - m.timestamp.getTime() < 3600000);
    const last24Hours = this.metrics.filter(m => now - m.timestamp.getTime() < 86400000);

    return {
      totalRequests: this.metrics.length,
      requestsLastHour: lastHour.length,
      requestsLast24Hours: last24Hours.length,
      averageResponseTime: this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / this.metrics.length,
      errorRate: (this.metrics.filter(m => m.statusCode >= 400).length / this.metrics.length) * 100,
      topEndpoints: Array.from(this.endpointCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      errorCounts: Array.from(this.errorCounts.entries()),
      slowRequests: this.metrics
        .filter(m => m.responseTime > 1000)
        .sort((a, b) => b.responseTime - a.responseTime)
        .slice(0, 10)
    };
  }

  // Health check endpoint
  getHealthStatus() {
    const metrics = this.getMetricsSummary();
    const isHealthy = metrics.errorRate < 10 && metrics.averageResponseTime < 2000;

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      metrics: {
        requestsLastHour: metrics.requestsLastHour,
        averageResponseTime: Math.round(metrics.averageResponseTime),
        errorRate: Math.round(metrics.errorRate * 100) / 100
      }
    };
  }

  // Track business metrics
  async trackBusinessEvent(eventType: string, data: any, userId?: string) {
    try {
      // Log business events for now
      console.log('Business event:', { eventType, data, userId });
    } catch (error) {
      console.error('Failed to track business event:', error);
    }
  }
}

export const monitoringService = new MonitoringService();

// Business event tracking functions
export const trackTokenCreation = (tokenData: any, userId: string) => {
  return monitoringService.trackBusinessEvent('token_created', {
    tokenId: tokenData.id,
    message: tokenData.message,
    valuePerToken: tokenData.valuePerToken,
    totalSupply: tokenData.totalSupply
  }, userId);
};

export const trackTokenRedemption = (redemptionData: any, userId: string) => {
  return monitoringService.trackBusinessEvent('token_redeemed', {
    tokenId: redemptionData.tokenId,
    amount: redemptionData.amount,
    value: redemptionData.value
  }, userId);
};

export const trackUserSignup = (userData: any) => {
  return monitoringService.trackBusinessEvent('user_signup', {
    walletAddress: userData.walletAddress,
    signupMethod: userData.signupMethod || 'wallet'
  }, userData.id);
};

export const trackError = (error: Error, context: any) => {
  return monitoringService.trackBusinessEvent('application_error', {
    message: error.message,
    stack: error.stack,
    context
  });
};