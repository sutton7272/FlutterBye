import { Request, Response, NextFunction } from 'express';

// Performance monitoring
export interface PerformanceMetrics {
  totalRequests: number;
  errorCount: number;
  averageResponseTime: number;
  activeConnections: number;
  memoryUsage: NodeJS.MemoryUsage;
  uptime: number;
}

class MonitoringService {
  private metrics: PerformanceMetrics = {
    totalRequests: 0,
    errorCount: 0,
    averageResponseTime: 0,
    activeConnections: 0,
    memoryUsage: process.memoryUsage(),
    uptime: 0,
  };

  private responseTimes: number[] = [];
  private readonly maxResponseTimeEntries = 1000;

  updateMetrics(responseTime: number, isError: boolean = false) {
    this.metrics.totalRequests++;
    
    if (isError) {
      this.metrics.errorCount++;
    }

    // Update response times
    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > this.maxResponseTimeEntries) {
      this.responseTimes.shift();
    }

    // Calculate average response time
    this.metrics.averageResponseTime = 
      this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;

    // Update memory usage
    this.metrics.memoryUsage = process.memoryUsage();
    this.metrics.uptime = process.uptime();
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getHealthStatus() {
    const metrics = this.getMetrics();
    const errorRate = metrics.totalRequests > 0 ? metrics.errorCount / metrics.totalRequests : 0;
    const memoryUsageMB = metrics.memoryUsage.heapUsed / 1024 / 1024;

    return {
      status: errorRate < 0.05 && memoryUsageMB < 512 ? 'healthy' : 'degraded',
      metrics,
      checks: {
        errorRate: { value: errorRate, threshold: 0.05, status: errorRate < 0.05 ? 'pass' : 'fail' },
        memoryUsage: { value: memoryUsageMB, threshold: 512, status: memoryUsageMB < 512 ? 'pass' : 'fail' },
        responseTime: { value: metrics.averageResponseTime, threshold: 1000, status: metrics.averageResponseTime < 1000 ? 'pass' : 'fail' },
      },
    };
  }
}

export const monitoringService = new MonitoringService();

// Performance monitoring middleware
export const performanceMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - start;
    const isError = res.statusCode >= 400;
    monitoringService.updateMetrics(responseTime, isError);

    // Log slow requests
    if (responseTime > 1000) {
      console.warn('Slow request:', {
        method: req.method,
        url: req.url,
        responseTime,
        statusCode: res.statusCode,
      });
    }
  });

  next();
};

// Health check endpoints
export const setupHealthChecks = (app: any) => {
  // Basic health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Detailed health check
  app.get('/health/detailed', (req: Request, res: Response) => {
    const health = monitoringService.getHealthStatus();
    res.status(health.status === 'healthy' ? 200 : 503).json(health);
  });

  // Metrics endpoint
  app.get('/metrics', (req: Request, res: Response) => {
    const metrics = monitoringService.getMetrics();
    res.json(metrics);
  });
};

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    // Add actual database ping here
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Disable memory monitoring during optimization
export const memoryMonitoring = () => {
  // setInterval(() => {
  //   const usage = process.memoryUsage();
  //   const usedMB = usage.heapUsed / 1024 / 1024;
  //   
  //   if (usedMB > 400) {
  //     console.warn('High memory usage:', {
  //       heapUsed: `${usedMB.toFixed(2)} MB`,
  //       heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
  //       external: `${(usage.external / 1024 / 1024).toFixed(2)} MB`,
  //     });
  //   }
  // }, 120000); // Reduced frequency when enabled
};