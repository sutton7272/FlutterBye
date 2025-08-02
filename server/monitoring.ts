import { EventEmitter } from 'events';
import os from 'os';
import v8 from 'v8';

// Production monitoring and performance tracking
export class MonitoringService extends EventEmitter {
  private metrics: any = {
    requests: {
      total: 0,
      successful: 0,
      failed: 0,
      averageResponseTime: 0
    },
    system: {
      cpuUsage: 0,
      memoryUsage: 0,
      uptime: 0
    },
    business: {
      tokensCreated: 0,
      totalValue: 0,
      activeUsers: 0
    },
    errors: []
  };
  
  private requestTimes: number[] = [];
  private errorLog: any[] = [];
  private performanceInterval: NodeJS.Timeout | null = null;
  private readonly maxErrorLog = 100;
  private readonly maxRequestTimes = 1000;

  constructor() {
    super();
    this.startPerformanceMonitoring();
  }

  // Start performance monitoring
  private startPerformanceMonitoring(): void {
    this.performanceInterval = setInterval(() => {
      this.updateSystemMetrics();
      this.cleanupOldData();
      this.emit('metrics_updated', this.getMetrics());
    }, 30000); // Update every 30 seconds
  }

  // Update system metrics
  private updateSystemMetrics(): void {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    this.metrics.system = {
      cpuUsage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
      memoryUsage: memUsage.heapUsed / 1024 / 1024, // Convert to MB
      heapTotal: memUsage.heapTotal / 1024 / 1024,
      heapUsed: memUsage.heapUsed / 1024 / 1024,
      external: memUsage.external / 1024 / 1024,
      rss: memUsage.rss / 1024 / 1024,
      uptime: process.uptime(),
      loadAverage: os.loadavg(),
      freeMemory: os.freemem() / 1024 / 1024,
      totalMemory: os.totalmem() / 1024 / 1024,
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version
    };

    // V8 heap statistics
    const heapStats = v8.getHeapStatistics();
    this.metrics.v8 = {
      heapSizeLimit: heapStats.heap_size_limit / 1024 / 1024,
      totalHeapSize: heapStats.total_heap_size / 1024 / 1024,
      usedHeapSize: heapStats.used_heap_size / 1024 / 1024,
      mallocedMemory: heapStats.malloced_memory / 1024 / 1024,
      peakMallocedMemory: heapStats.peak_malloced_memory / 1024 / 1024
    };
  }

  // Record request metrics
  recordRequest(responseTime: number, statusCode: number): void {
    this.metrics.requests.total++;
    
    if (statusCode >= 200 && statusCode < 400) {
      this.metrics.requests.successful++;
    } else {
      this.metrics.requests.failed++;
    }

    // Track response times
    this.requestTimes.push(responseTime);
    if (this.requestTimes.length > this.maxRequestTimes) {
      this.requestTimes.shift();
    }

    // Update average response time
    this.metrics.requests.averageResponseTime = 
      this.requestTimes.reduce((sum, time) => sum + time, 0) / this.requestTimes.length;

    // Calculate percentiles
    const sortedTimes = [...this.requestTimes].sort((a, b) => a - b);
    this.metrics.requests.p50 = this.getPercentile(sortedTimes, 50);
    this.metrics.requests.p95 = this.getPercentile(sortedTimes, 95);
    this.metrics.requests.p99 = this.getPercentile(sortedTimes, 99);
  }

  // Get percentile from sorted array
  private getPercentile(sortedArray: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[index] || 0;
  }

  // Record error
  recordError(error: Error, context?: any): void {
    const errorRecord = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      name: error.name,
      context: context || {},
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    this.errorLog.push(errorRecord);
    this.metrics.errors.push(errorRecord);

    // Keep error log within limits
    if (this.errorLog.length > this.maxErrorLog) {
      this.errorLog.shift();
    }
    if (this.metrics.errors.length > this.maxErrorLog) {
      this.metrics.errors.shift();
    }

    console.error(`🚨 Error recorded: ${error.message}`, { context });
    this.emit('error_recorded', errorRecord);
  }

  // Record business metrics
  recordTokenCreation(value: number, currency: string): void {
    this.metrics.business.tokensCreated++;
    
    // Convert to USD equivalent for tracking (simplified)
    const usdValue = currency === 'SOL' ? value * 100 : // Assume SOL = $100
                     currency === 'USDC' ? value :
                     currency === 'FLBY' ? value * 0.5 : // Assume FLBY = $0.50
                     value;
    
    this.metrics.business.totalValue += usdValue;
    
    this.emit('token_created', { value: usdValue, currency });
  }

  // Record user activity
  recordUserActivity(userId: string, action: string): void {
    // Track unique active users (simplified in-memory tracking)
    if (!this.metrics.business.activeUserIds) {
      this.metrics.business.activeUserIds = new Set();
    }
    
    this.metrics.business.activeUserIds.add(userId);
    this.metrics.business.activeUsers = this.metrics.business.activeUserIds.size;
    
    this.emit('user_activity', { userId, action });
  }

  // Get current metrics
  getMetrics(): any {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      performance: {
        requestsPerMinute: this.calculateRequestsPerMinute(),
        errorRate: this.calculateErrorRate(),
        uptimeHours: Math.floor(process.uptime() / 3600)
      }
    };
  }

  // Calculate requests per minute
  private calculateRequestsPerMinute(): number {
    const uptimeMinutes = process.uptime() / 60;
    return Math.round(this.metrics.requests.total / Math.max(uptimeMinutes, 1));
  }

  // Calculate error rate percentage
  private calculateErrorRate(): number {
    if (this.metrics.requests.total === 0) return 0;
    return Math.round((this.metrics.requests.failed / this.metrics.requests.total) * 100 * 100) / 100;
  }

  // Get health status
  getHealthStatus(): { status: string; issues: string[]; score: number } {
    const issues: string[] = [];
    let score = 100;

    // Check memory usage
    if (this.metrics.system.memoryUsage > 512) { // Over 512MB
      issues.push(`High memory usage: ${Math.round(this.metrics.system.memoryUsage)}MB`);
      score -= 20;
    }

    // Check error rate
    const errorRate = this.calculateErrorRate();
    if (errorRate > 5) {
      issues.push(`High error rate: ${errorRate}%`);
      score -= 30;
    }

    // Check response time
    if (this.metrics.requests.averageResponseTime > 2000) { // Over 2 seconds
      issues.push(`Slow response time: ${Math.round(this.metrics.requests.averageResponseTime)}ms`);
      score -= 25;
    }

    // Check for recent errors
    const recentErrors = this.errorLog.filter(error => 
      Date.now() - new Date(error.timestamp).getTime() < 5 * 60 * 1000 // Last 5 minutes
    );
    if (recentErrors.length > 10) {
      issues.push(`Many recent errors: ${recentErrors.length} in last 5 minutes`);
      score -= 25;
    }

    const status = score >= 80 ? 'healthy' : 
                   score >= 60 ? 'degraded' : 'unhealthy';

    return { status, issues, score };
  }

  // Get performance summary
  getPerformanceSummary(): any {
    return {
      uptime: {
        seconds: Math.floor(process.uptime()),
        formatted: this.formatUptime(process.uptime())
      },
      requests: {
        total: this.metrics.requests.total,
        successful: this.metrics.requests.successful,
        failed: this.metrics.requests.failed,
        successRate: this.metrics.requests.total > 0 ? 
          Math.round((this.metrics.requests.successful / this.metrics.requests.total) * 100) : 100,
        averageResponseTime: Math.round(this.metrics.requests.averageResponseTime),
        p95ResponseTime: Math.round(this.metrics.requests.p95 || 0)
      },
      memory: {
        heapUsed: Math.round(this.metrics.system.heapUsed),
        heapTotal: Math.round(this.metrics.system.heapTotal),
        rss: Math.round(this.metrics.system.rss),
        external: Math.round(this.metrics.system.external)
      },
      business: {
        tokensCreated: this.metrics.business.tokensCreated,
        totalValue: Math.round(this.metrics.business.totalValue * 100) / 100,
        activeUsers: this.metrics.business.activeUsers
      }
    };
  }

  // Format uptime in human readable format
  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  // Clean up old data
  private cleanupOldData(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    // Remove old errors
    this.errorLog = this.errorLog.filter(error => 
      new Date(error.timestamp).getTime() > oneHourAgo
    );
    
    // Reset active users daily
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    if (this.metrics.business.lastReset && 
        this.metrics.business.lastReset < oneDayAgo) {
      this.metrics.business.activeUserIds = new Set();
      this.metrics.business.activeUsers = 0;
      this.metrics.business.lastReset = Date.now();
    }
  }

  // Generate monitoring alert
  generateAlert(type: string, message: string, severity: 'low' | 'medium' | 'high' | 'critical'): void {
    const alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      severity,
      timestamp: new Date().toISOString(),
      metrics: this.getHealthStatus()
    };

    console.warn(`🚨 ${severity.toUpperCase()} ALERT: ${type} - ${message}`);
    this.emit('alert_generated', alert);
  }

  // Shutdown monitoring
  shutdown(): void {
    if (this.performanceInterval) {
      clearInterval(this.performanceInterval);
    }
    
    this.requestTimes.length = 0;
    this.errorLog.length = 0;
    
    console.log('🛑 Monitoring service shutdown complete');
  }
}

// Export singleton instance
export const monitoring = new MonitoringService();