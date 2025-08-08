import { db } from "./db";
import { sql } from "drizzle-orm";

export interface SystemHealth {
  timestamp: string;
  status: 'healthy' | 'warning' | 'critical';
  database: {
    status: 'connected' | 'disconnected' | 'slow';
    responseTime: number;
    activeConnections?: number;
  };
  apis: {
    [endpoint: string]: {
      status: 'ok' | 'slow' | 'error';
      responseTime: number;
      lastChecked: string;
      errorCount: number;
    };
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: number;
}

export interface AlertConfig {
  responseTimeThreshold: number; // ms
  errorRateThreshold: number; // percentage
  memoryThreshold: number; // percentage
  diskThreshold: number; // percentage
}

class MonitoringService {
  private healthData: SystemHealth | null = null;
  private alertConfig: AlertConfig = {
    responseTimeThreshold: 500,
    errorRateThreshold: 5,
    memoryThreshold: 85,
    diskThreshold: 90
  };
  private errorCounts: Map<string, number> = new Map();
  private responseTimes: Map<string, number[]> = new Map();
  private startTime = Date.now();

  async checkDatabaseHealth(): Promise<SystemHealth['database']> {
    const startTime = Date.now();
    
    try {
      // Test basic database connectivity
      await db.execute(sql`SELECT 1`);
      const responseTime = Date.now() - startTime;
      
      // Get connection stats if available
      let activeConnections: number | undefined;
      try {
        const result = await db.execute(sql`
          SELECT count(*) as active_connections 
          FROM pg_stat_activity 
          WHERE state = 'active'
        `);
        activeConnections = Number(result.rows[0]?.active_connections) || 0;
      } catch {
        // Ignore if we can't get connection stats
      }

      return {
        status: responseTime > 1000 ? 'slow' : 'connected',
        responseTime,
        activeConnections
      };
    } catch (error) {
      return {
        status: 'disconnected',
        responseTime: Date.now() - startTime
      };
    }
  }

  async checkAPIHealth(endpoints: string[]): Promise<SystemHealth['apis']> {
    const apis: SystemHealth['apis'] = {};
    
    for (const endpoint of endpoints) {
      const startTime = Date.now();
      try {
        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method: 'GET'
        });
        
        const responseTime = Date.now() - startTime;
        const errorCount = this.errorCounts.get(endpoint) || 0;
        
        // Track response times for averaging
        const times = this.responseTimes.get(endpoint) || [];
        times.push(responseTime);
        if (times.length > 10) times.shift(); // Keep last 10 measurements
        this.responseTimes.set(endpoint, times);
        
        apis[endpoint] = {
          status: response.ok ? (responseTime > this.alertConfig.responseTimeThreshold ? 'slow' : 'ok') : 'error',
          responseTime,
          lastChecked: new Date().toISOString(),
          errorCount
        };
        
        // Reset error count on success
        if (response.ok) {
          this.errorCounts.set(endpoint, 0);
        }
      } catch (error) {
        const responseTime = Date.now() - startTime;
        const errorCount = (this.errorCounts.get(endpoint) || 0) + 1;
        this.errorCounts.set(endpoint, errorCount);
        
        apis[endpoint] = {
          status: 'error',
          responseTime,
          lastChecked: new Date().toISOString(),
          errorCount
        };
      }
    }
    
    return apis;
  }

  getMemoryUsage(): SystemHealth['memory'] {
    const used = process.memoryUsage();
    const total = used.heapTotal;
    
    return {
      used: used.heapUsed,
      total,
      percentage: Math.round((used.heapUsed / total) * 100)
    };
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const criticalEndpoints = [
      '/api/blog/posts',
      '/api/blog/schedules', 
      '/api/blog/analytics',
      '/api/admin/features'
    ];

    const [database, apis] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkAPIHealth(criticalEndpoints)
    ]);

    const memory = this.getMemoryUsage();
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    
    // Determine overall system status
    let status: SystemHealth['status'] = 'healthy';
    
    if (database.status === 'disconnected') {
      status = 'critical';
    } else if (database.status === 'slow' || memory.percentage > this.alertConfig.memoryThreshold) {
      status = 'warning';
    }
    
    // Check API health
    const errorAPIs = Object.values(apis).filter(api => api.status === 'error');
    const slowAPIs = Object.values(apis).filter(api => api.status === 'slow');
    
    if (errorAPIs.length > 0) {
      status = 'critical';
    } else if (slowAPIs.length > 2) {
      status = 'warning';
    }

    this.healthData = {
      timestamp: new Date().toISOString(),
      status,
      database,
      apis,
      memory,
      uptime
    };

    return this.healthData;
  }

  async triggerAlert(type: 'performance' | 'error' | 'system', message: string, data?: any): Promise<void> {
    const alert = {
      type,
      message,
      timestamp: new Date().toISOString(),
      data,
      severity: type === 'error' ? 'high' : type === 'system' ? 'critical' : 'medium'
    };

    // Log the alert (in production, this would go to alerting system)
    console.log(`🚨 SYSTEM ALERT [${alert.severity.toUpperCase()}]: ${message}`, data || '');
    
    // Store in database for tracking
    try {
      await db.execute(sql`
        INSERT INTO system_alerts (type, message, severity, data, created_at)
        VALUES (${alert.type}, ${alert.message}, ${alert.severity}, ${JSON.stringify(alert.data)}, NOW())
        ON CONFLICT DO NOTHING
      `);
    } catch {
      // Ignore database errors for alerts to prevent recursion
    }
  }

  // Middleware to track API performance
  trackAPIPerformance(req: any, res: any, next: any) {
    const startTime = Date.now();
    const endpoint = req.path;

    // Override res.end to capture response time
    const originalEnd = res.end;
    res.end = function(chunk: any, encoding: any) {
      const responseTime = Date.now() - startTime;
      
      // Track performance
      if (responseTime > monitoringService.alertConfig.responseTimeThreshold) {
        monitoringService.triggerAlert(
          'performance',
          `Slow Response Time - ${endpoint} took ${responseTime}ms`,
          { endpoint, responseTime, threshold: monitoringService.alertConfig.responseTimeThreshold }
        );
      }
      
      // Track errors
      if (res.statusCode >= 500) {
        const errorCount = (monitoringService.errorCounts.get(endpoint) || 0) + 1;
        monitoringService.errorCounts.set(endpoint, errorCount);
        
        monitoringService.triggerAlert(
          'error',
          `Server Error - ${endpoint} returned ${res.statusCode}`,
          { endpoint, statusCode: res.statusCode, errorCount }
        );
      }

      originalEnd.call(this, chunk, encoding);
    };

    next();
  }

  async validateDatabaseSchema(): Promise<{valid: boolean, errors: string[]}> {
    const errors: string[] = [];
    
    try {
      // Check critical tables exist
      const criticalTables = ['blog_posts', 'blog_schedules', 'blog_analytics', 'users'];
      
      for (const table of criticalTables) {
        const result = await db.execute(sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = ${table}
          )
        `);
        
        if (!result.rows[0]?.exists) {
          errors.push(`Critical table missing: ${table}`);
        }
      }
      
      // Check blog_schedules has required columns after our fix
      const scheduleColumns = await db.execute(sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'blog_schedules'
      `);
      
      const requiredColumns = ['id', 'name', 'frequency', 'is_active'];
      const existingColumns = scheduleColumns.rows.map(row => row.column_name);
      
      for (const col of requiredColumns) {
        if (!existingColumns.includes(col)) {
          errors.push(`Missing required column in blog_schedules: ${col}`);
        }
      }
      
    } catch (error) {
      errors.push(`Schema validation failed: ${error}`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  getAlertConfig(): AlertConfig {
    return { ...this.alertConfig };
  }

  updateAlertConfig(config: Partial<AlertConfig>): void {
    this.alertConfig = { ...this.alertConfig, ...config };
  }
}

export const monitoringService = new MonitoringService();