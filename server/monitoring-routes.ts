import type { Express } from "express";
import { monitoringService, SystemHealth } from "./monitoring-service";
import { db } from "./db";
import { sql } from "drizzle-orm";

export function registerMonitoringRoutes(app: Express) {
  // Health check endpoint - critical for production monitoring
  app.get("/api/health", async (req, res) => {
    try {
      const health = await monitoringService.getSystemHealth();
      
      // Return appropriate HTTP status based on health
      const statusCode = health.status === 'healthy' ? 200 : 
                        health.status === 'warning' ? 200 : 503;
      
      res.status(statusCode).json(health);
    } catch (error) {
      res.status(503).json({
        status: 'critical',
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Database schema validation endpoint
  app.get("/api/health/database/schema", async (req, res) => {
    try {
      const validation = await monitoringService.validateDatabaseSchema();
      
      res.status(validation.valid ? 200 : 500).json({
        valid: validation.valid,
        errors: validation.errors,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        valid: false,
        errors: [`Schema validation failed: ${error}`],
        timestamp: new Date().toISOString()
      });
    }
  });

  // Performance metrics endpoint
  app.get("/api/monitoring/metrics", async (req, res) => {
    try {
      const health = await monitoringService.getSystemHealth();
      
      // Calculate additional performance metrics
      const metrics = {
        uptime: health.uptime,
        memory: health.memory,
        database: {
          status: health.database.status,
          responseTime: health.database.responseTime,
          activeConnections: health.database.activeConnections
        },
        apis: Object.entries(health.apis).map(([endpoint, data]) => ({
          endpoint,
          ...data,
          avgResponseTime: data.responseTime // Could calculate rolling average here
        })),
        alerts: {
          config: monitoringService.getAlertConfig(),
          recent: await getRecentAlerts()
        }
      };
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve metrics',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Alert configuration endpoint
  app.put("/api/monitoring/alerts/config", async (req, res) => {
    try {
      const { responseTimeThreshold, errorRateThreshold, memoryThreshold, diskThreshold } = req.body;
      
      const config: any = {};
      if (responseTimeThreshold && responseTimeThreshold > 0) config.responseTimeThreshold = responseTimeThreshold;
      if (errorRateThreshold && errorRateThreshold > 0) config.errorRateThreshold = errorRateThreshold;
      if (memoryThreshold && memoryThreshold > 0) config.memoryThreshold = memoryThreshold;
      if (diskThreshold && diskThreshold > 0) config.diskThreshold = diskThreshold;
      
      monitoringService.updateAlertConfig(config);
      
      res.json({
        message: 'Alert configuration updated',
        config: monitoringService.getAlertConfig()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update alert configuration'
      });
    }
  });

  // Test alert endpoint (for testing monitoring system)
  app.post("/api/monitoring/alerts/test", async (req, res) => {
    try {
      const { type = 'performance', message = 'Test alert from monitoring system' } = req.body;
      
      await monitoringService.triggerAlert(type, message, {
        test: true,
        triggeredBy: 'manual',
        timestamp: new Date().toISOString()
      });
      
      res.json({
        message: 'Test alert triggered successfully',
        type,
        alert: message
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to trigger test alert'
      });
    }
  });

  // System status dashboard data
  app.get("/api/monitoring/dashboard", async (req, res) => {
    try {
      const health = await monitoringService.getSystemHealth();
      const recentAlerts = await getRecentAlerts(10);
      
      // Calculate system statistics
      const stats = {
        totalRequests: await getTotalRequestCount(),
        averageResponseTime: await getAverageResponseTime(),
        errorRate: await getErrorRate(),
        systemLoad: {
          cpu: process.cpuUsage(),
          memory: health.memory,
          uptime: health.uptime
        }
      };
      
      const dashboard = {
        status: health.status,
        timestamp: health.timestamp,
        stats,
        health: {
          database: health.database,
          apis: health.apis,
          memory: health.memory
        },
        alerts: recentAlerts
      };
      
      res.json(dashboard);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to load dashboard data',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Install monitoring middleware
  app.use(monitoringService.trackAPIPerformance);
}

// Helper functions
async function getRecentAlerts(limit: number = 50) {
  try {
    const result = await db.execute(sql`
      SELECT type, message, severity, data, created_at 
      FROM system_alerts 
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `);
    return result.rows;
  } catch {
    return [];
  }
}

async function getTotalRequestCount(): Promise<number> {
  // This would typically be tracked in Redis or similar
  // For now, return a placeholder
  return 0;
}

async function getAverageResponseTime(): Promise<number> {
  // This would calculate average from tracked metrics
  return 0;
}

async function getErrorRate(): Promise<number> {
  // This would calculate error percentage
  return 0;
}