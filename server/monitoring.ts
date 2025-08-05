/**
 * Production Monitoring & Observability System
 * Enterprise-grade monitoring for Solvitur Inc. blockchain intelligence platform
 */

import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

interface MonitoringConfig {
  enableMetrics: boolean;
  enableAlerts: boolean;
  alertThresholds: {
    responseTime: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  businessMetrics: {
    trackRevenue: boolean;
    trackGovernmentPipeline: boolean;
    trackEnterpriseUsage: boolean;
  };
}

interface PerformanceMetric {
  timestamp: number;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  userAgent?: string;
  userId?: string;
  governmentClient?: boolean;
  enterpriseClient?: boolean;
}

interface BusinessMetric {
  timestamp: number;
  metricType: 'revenue' | 'pipeline' | 'usage' | 'compliance';
  value: number;
  metadata: Record<string, any>;
}

interface SystemHealth {
  timestamp: number;
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  database: {
    connections: number;
    queryTime: number;
    status: 'healthy' | 'degraded' | 'critical';
  };
}

interface Alert {
  id: string;
  timestamp: number;
  level: 'info' | 'warning' | 'critical' | 'emergency';
  type: 'performance' | 'security' | 'business' | 'compliance';
  title: string;
  description: string;
  metadata: Record<string, any>;
  resolved: boolean;
  resolvedAt?: number;
}

class ProductionMonitoringService {
  private config: MonitoringConfig;
  private performanceMetrics: PerformanceMetric[] = [];
  private businessMetrics: BusinessMetric[] = [];
  private systemHealthHistory: SystemHealth[] = [];
  private activeAlerts: Alert[] = [];
  private requestCounts: Map<string, number> = new Map();
  private errorCounts: Map<string, number> = new Map();

  constructor(config: MonitoringConfig) {
    this.config = config;
    this.startSystemHealthMonitoring();
    this.startMetricsAggregation();
  }

  // Performance Monitoring Middleware
  performanceMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = performance.now();
      const originalSend = res.send;

      // Track request count
      const endpoint = `${req.method} ${req.route?.path || req.path}`;
      this.requestCounts.set(endpoint, (this.requestCounts.get(endpoint) || 0) + 1);

      const self = this;
      res.send = function(body: any) {
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        // Record performance metric
        const metric: PerformanceMetric = {
          timestamp: Date.now(),
          endpoint: req.route?.path || req.path,
          method: req.method,
          responseTime,
          statusCode: res.statusCode,
          userAgent: req.get('User-Agent'),
          userId: (req as any).user?.id,
          governmentClient: req.get('X-Government-Client') === 'true',
          enterpriseClient: req.get('X-Enterprise-Client') === 'true'
        };

        self.recordPerformanceMetric(metric);

        // Track errors
        if (res.statusCode >= 400) {
          self.errorCounts.set(endpoint, (self.errorCounts.get(endpoint) || 0) + 1);
          
          if (res.statusCode >= 500) {
            self.createAlert({
              level: 'critical',
              type: 'performance',
              title: 'Server Error Detected',
              description: `${req.method} ${req.path} returned ${res.statusCode}`,
              metadata: { endpoint, responseTime, statusCode: res.statusCode }
            });
          }
        }

        // Check response time threshold
        if (responseTime > self.config.alertThresholds.responseTime) {
          self.createAlert({
            level: 'warning',
            type: 'performance',
            title: 'Slow Response Time',
            description: `Response time ${responseTime.toFixed(2)}ms exceeds threshold`,
            metadata: { endpoint, responseTime, threshold: self.config.alertThresholds.responseTime }
          });
        }

        return originalSend.call(this, body);
      };

      next();
    };
  }

  // Business Metrics Tracking
  trackBusinessMetric(type: BusinessMetric['metricType'], value: number, metadata: Record<string, any> = {}) {
    if (!this.config.businessMetrics.trackRevenue && type === 'revenue') return;
    if (!this.config.businessMetrics.trackGovernmentPipeline && type === 'pipeline') return;
    if (!this.config.businessMetrics.trackEnterpriseUsage && type === 'usage') return;

    const metric: BusinessMetric = {
      timestamp: Date.now(),
      metricType: type,
      value,
      metadata
    };

    this.businessMetrics.push(metric);

    // Government pipeline alerts
    if (type === 'pipeline' && metadata.category === 'government') {
      if (value < 15000000) { // Below $15M threshold
        this.createAlert({
          level: 'warning',
          type: 'business',
          title: 'Government Pipeline Below Target',
          description: `Pipeline value $${(value / 1000000).toFixed(1)}M below $15M threshold`,
          metadata: { currentValue: value, threshold: 15000000 }
        });
      }
    }

    // Enterprise usage alerts
    if (type === 'usage' && metadata.clientType === 'enterprise') {
      if (value > metadata.contractLimit * 0.9) {
        this.createAlert({
          level: 'info',
          type: 'business',
          title: 'Enterprise Client Approaching Usage Limit',
          description: `Client ${metadata.clientId} at ${((value / metadata.contractLimit) * 100).toFixed(1)}% of usage limit`,
          metadata: { clientId: metadata.clientId, usage: value, limit: metadata.contractLimit }
        });
      }
    }
  }

  // Government Sales Pipeline Monitoring
  trackGovernmentSales(pipelineValue: number, activeDeals: number, winRate: number) {
    this.trackBusinessMetric('pipeline', pipelineValue, {
      category: 'government',
      activeDeals,
      winRate,
      target: 18400000 // $18.4M target
    });

    // Critical alerts for government sales
    if (winRate < 0.7) { // Below 70% win rate
      this.createAlert({
        level: 'critical',
        type: 'business',
        title: 'Government Sales Win Rate Critical',
        description: `Win rate ${(winRate * 100).toFixed(1)}% below 70% threshold`,
        metadata: { winRate, threshold: 0.7, pipelineValue }
      });
    }
  }

  // Enterprise Revenue Monitoring
  trackEnterpriseRevenue(mrr: number, arr: number, churnRate: number) {
    this.trackBusinessMetric('revenue', arr, {
      category: 'enterprise',
      mrr,
      churnRate,
      target: 50700000 // $50.7M ARR target
    });

    // Enterprise revenue alerts
    if (churnRate > 0.05) { // Above 5% monthly churn
      this.createAlert({
        level: 'warning',
        type: 'business',
        title: 'Enterprise Churn Rate High',
        description: `Monthly churn rate ${(churnRate * 100).toFixed(1)}% above 5% threshold`,
        metadata: { churnRate, threshold: 0.05, arr }
      });
    }
  }

  // Compliance Monitoring
  trackComplianceMetric(framework: string, status: 'compliant' | 'warning' | 'violation', details: string) {
    this.trackBusinessMetric('compliance', status === 'compliant' ? 1 : 0, {
      framework,
      status,
      details
    });

    if (status === 'violation') {
      this.createAlert({
        level: 'emergency',
        type: 'compliance',
        title: `${framework} Compliance Violation`,
        description: details,
        metadata: { framework, status }
      });
    } else if (status === 'warning') {
      this.createAlert({
        level: 'warning',
        type: 'compliance',
        title: `${framework} Compliance Warning`,
        description: details,
        metadata: { framework, status }
      });
    }
  }

  // System Health Monitoring
  private startSystemHealthMonitoring() {
    setInterval(() => {
      const health = this.collectSystemHealth();
      this.systemHealthHistory.push(health);

      // Keep only last 24 hours of data
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      this.systemHealthHistory = this.systemHealthHistory.filter(h => h.timestamp > oneDayAgo);

      // Check thresholds
      this.checkSystemHealthThresholds(health);
    }, 60000); // Every minute
  }

  private collectSystemHealth(): SystemHealth {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      timestamp: Date.now(),
      cpu: {
        usage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
        cores: 4 // Default core count for production
      },
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
      },
      disk: {
        used: 0, // Would integrate with actual disk monitoring
        total: 0,
        percentage: 0
      },
      network: {
        bytesIn: 0, // Would integrate with actual network monitoring
        bytesOut: 0
      },
      database: {
        connections: 0, // Would integrate with actual DB monitoring
        queryTime: 0,
        status: 'healthy'
      }
    };
  }

  private checkSystemHealthThresholds(health: SystemHealth) {
    // Memory usage alert
    if (health.memory.percentage > this.config.alertThresholds.memoryUsage) {
      this.createAlert({
        level: 'warning',
        type: 'performance',
        title: 'High Memory Usage',
        description: `Memory usage ${health.memory.percentage.toFixed(1)}% above threshold`,
        metadata: { 
          memoryUsage: health.memory.percentage, 
          threshold: this.config.alertThresholds.memoryUsage 
        }
      });
    }
  }

  // Metrics Aggregation
  private startMetricsAggregation() {
    setInterval(() => {
      this.aggregateMetrics();
    }, 300000); // Every 5 minutes
  }

  private aggregateMetrics() {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    // Aggregate performance metrics
    const recentMetrics = this.performanceMetrics.filter(m => m.timestamp > fiveMinutesAgo);
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;
    const errorRate = recentMetrics.filter(m => m.statusCode >= 400).length / recentMetrics.length;

    // Check error rate threshold
    if (errorRate > this.config.alertThresholds.errorRate) {
      this.createAlert({
        level: 'critical',
        type: 'performance',
        title: 'High Error Rate',
        description: `Error rate ${(errorRate * 100).toFixed(1)}% above threshold`,
        metadata: { errorRate, threshold: this.config.alertThresholds.errorRate }
      });
    }

    // Clean up old metrics (keep last 24 hours)
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    this.performanceMetrics = this.performanceMetrics.filter(m => m.timestamp > oneDayAgo);
    this.businessMetrics = this.businessMetrics.filter(m => m.timestamp > oneDayAgo);
  }

  // Alert Management
  private createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'resolved'>) {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      resolved: false,
      ...alertData
    };

    this.activeAlerts.push(alert);

    // In production, would send to alerting system (PagerDuty, Slack, etc.)
    console.log(`🚨 ${alert.level.toUpperCase()} ALERT: ${alert.title} - ${alert.description}`);

    return alert;
  }

  // API Endpoints for Monitoring Dashboard
  getPerformanceMetrics(timeRange: number = 3600000): PerformanceMetric[] {
    const since = Date.now() - timeRange;
    return this.performanceMetrics.filter(m => m.timestamp > since);
  }

  getBusinessMetrics(timeRange: number = 3600000): BusinessMetric[] {
    const since = Date.now() - timeRange;
    return this.businessMetrics.filter(m => m.timestamp > since);
  }

  getSystemHealth(): SystemHealth | null {
    return this.systemHealthHistory[this.systemHealthHistory.length - 1] || null;
  }

  getActiveAlerts(): Alert[] {
    return this.activeAlerts.filter(a => !a.resolved);
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.activeAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = Date.now();
      return true;
    }
    return false;
  }

  // Dashboard Summary
  getDashboardSummary() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    
    const recentMetrics = this.performanceMetrics.filter(m => m.timestamp > oneHourAgo);
    const recentBusinessMetrics = this.businessMetrics.filter(m => m.timestamp > oneHourAgo);
    
    return {
      performance: {
        totalRequests: recentMetrics.length,
        avgResponseTime: recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length || 0,
        errorRate: recentMetrics.filter(m => m.statusCode >= 400).length / recentMetrics.length || 0,
        governmentRequests: recentMetrics.filter(m => m.governmentClient).length,
        enterpriseRequests: recentMetrics.filter(m => m.enterpriseClient).length
      },
      business: {
        governmentPipeline: recentBusinessMetrics
          .filter(m => m.metricType === 'pipeline' && m.metadata.category === 'government')
          .reduce((sum, m) => Math.max(sum, m.value), 0),
        enterpriseRevenue: recentBusinessMetrics
          .filter(m => m.metricType === 'revenue' && m.metadata.category === 'enterprise')
          .reduce((sum, m) => Math.max(sum, m.value), 0),
        complianceScore: recentBusinessMetrics
          .filter(m => m.metricType === 'compliance')
          .reduce((sum, m) => sum + m.value, 0) / 
          Math.max(1, recentBusinessMetrics.filter(m => m.metricType === 'compliance').length)
      },
      alerts: {
        critical: this.activeAlerts.filter(a => !a.resolved && a.level === 'critical').length,
        warning: this.activeAlerts.filter(a => !a.resolved && a.level === 'warning').length,
        info: this.activeAlerts.filter(a => !a.resolved && a.level === 'info').length
      },
      systemHealth: this.getSystemHealth()
    };
  }

  private recordPerformanceMetric(metric: PerformanceMetric) {
    this.performanceMetrics.push(metric);
  }
}

// Default configuration for production
export const productionMonitoringConfig: MonitoringConfig = {
  enableMetrics: true,
  enableAlerts: true,
  alertThresholds: {
    responseTime: 100, // 100ms
    errorRate: 0.001, // 0.1%
    memoryUsage: 80, // 80%
    cpuUsage: 80 // 80%
  },
  businessMetrics: {
    trackRevenue: true,
    trackGovernmentPipeline: true,
    trackEnterpriseUsage: true
  }
};

export default ProductionMonitoringService;