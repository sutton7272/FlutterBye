import type { Express, Request, Response } from 'express';
import ProductionMonitoringService from './monitoring';
import { transactionMonitor } from './transaction-monitor';
import { realTimeMonitor } from './real-time-monitor';
import { SecurityMiddleware, adminRateLimit, tokenCreationRateLimit } from './security-middleware';

// Production monitoring and analytics endpoints
export function registerProductionEndpoints(app: Express, monitoring: ProductionMonitoringService): void {
  
  // Advanced health check with comprehensive metrics
  app.get('/api/system/health', (req: Request, res: Response) => {
    const healthStatus = monitoring.getHealthStatus();
    const performanceSummary = monitoring.getPerformanceSummary();
    const transactionMetrics = transactionMonitor.getMetrics();
    const realTimeMetrics = realTimeMonitor.getMetrics();

    res.json({
      status: healthStatus.status,
      score: healthStatus.score,
      issues: healthStatus.issues,
      timestamp: new Date().toISOString(),
      uptime: performanceSummary.uptime,
      requests: performanceSummary.requests,
      memory: performanceSummary.memory,
      business: performanceSummary.business,
      transactions: transactionMetrics,
      realTime: realTimeMetrics,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    });
  });

  // Detailed system metrics for monitoring dashboards
  app.get('/api/system/metrics', (req: Request, res: Response) => {
    const metrics = monitoring.getMetrics();
    res.json(metrics);
  });

  // Performance analytics
  app.get('/api/system/performance', (req: Request, res: Response) => {
    const summary = monitoring.getPerformanceSummary();
    res.json(summary);
  });

  // Transaction monitoring status
  app.get('/api/system/transactions', (req: Request, res: Response) => {
    const metrics = transactionMonitor.getMetrics();
    res.json({
      ...metrics,
      timestamp: new Date().toISOString()
    });
  });

  // Real-time connections status
  app.get('/api/system/realtime', (req: Request, res: Response) => {
    const metrics = realTimeMonitor.getMetrics();
    res.json(metrics);
  });

  // Error log endpoint (admin only)
  app.get('/api/system/errors', adminRateLimit, (req: Request, res: Response) => {
    const metrics = monitoring.getMetrics();
    res.json({
      errors: metrics.errors,
      totalErrors: metrics.errors.length,
      timestamp: new Date().toISOString()
    });
  });

  // Create test transaction for monitoring
  app.post('/api/system/test-transaction', tokenCreationRateLimit, async (req: Request, res: Response) => {
    try {
      const { userId, type, amount, currency } = req.body;
      
      if (!userId || !type) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['userId', 'type']
        });
      }

      const transactionId = await transactionMonitor.monitorTransaction({
        userId,
        type,
        amount: amount || '0',
        currency: currency || 'SOL'
      });

      // Simulate processing
      setTimeout(async () => {
        const success = Math.random() > 0.3; // 70% success rate
        
        if (success) {
          await transactionMonitor.updateTransactionStatus(
            transactionId, 
            'confirmed',
            {
              signature: `test_tx_${Date.now()}`,
              blockHeight: Math.floor(Math.random() * 1000000)
            }
          );
        } else {
          await transactionMonitor.updateTransactionStatus(
            transactionId, 
            'failed',
            null,
            'Simulated transaction failure'
          );
        }
      }, 2000 + Math.random() * 3000); // 2-5 second delay

      res.json({
        success: true,
        transactionId,
        message: 'Test transaction initiated'
      });
    } catch (error) {
      console.error('Test transaction error:', error);
      res.status(500).json({
        error: 'Failed to create test transaction',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get transaction status
  app.get('/api/system/transactions/:transactionId', (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const transaction = transactionMonitor.getTransactionStatus(transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        error: 'Transaction not found',
        transactionId
      });
    }
    
    res.json(transaction);
  });

  // Get user pending transactions
  app.get('/api/system/users/:userId/transactions', (req: Request, res: Response) => {
    const { userId } = req.params;
    const transactions = transactionMonitor.getUserPendingTransactions(userId);
    
    res.json({
      userId,
      pendingTransactions: transactions,
      count: transactions.length
    });
  });

  // System alert endpoint
  app.post('/api/system/alert', adminRateLimit, (req: Request, res: Response) => {
    try {
      const { type, message, severity } = req.body;
      
      if (!type || !message || !severity) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['type', 'message', 'severity']
        });
      }

      monitoring.generateAlert(type, message, severity);
      
      res.json({
        success: true,
        message: 'Alert generated successfully'
      });
    } catch (error) {
      console.error('Alert generation error:', error);
      res.status(500).json({
        error: 'Failed to generate alert'
      });
    }
  });

  // System configuration endpoint
  app.get('/api/system/config', (req: Request, res: Response) => {
    res.json({
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      features: {
        realTimeMonitoring: true,
        transactionTracking: true,
        performanceMetrics: true,
        errorTracking: true,
        securityMiddleware: true
      },
      limits: {
        maxConnections: 10000,
        requestTimeout: 30000,
        maxRequestSize: 10485760, // 10MB
        rateLimitWindow: 900000 // 15 minutes
      },
      security: {
        rateLimit: true,
        cors: true,
        helmet: true,
        sanitization: true
      }
    });
  });

  // Emergency system shutdown endpoint (admin only)
  app.post('/api/system/shutdown', adminRateLimit, (req: Request, res: Response) => {
    console.log('🚨 Emergency shutdown initiated by admin');
    
    res.json({
      success: true,
      message: 'System shutdown initiated',
      timestamp: new Date().toISOString()
    });

    // Graceful shutdown
    setTimeout(() => {
      transactionMonitor.shutdown();
      monitoring.shutdown();
      realTimeMonitor.shutdown();
      
      console.log('🛑 Graceful shutdown complete');
      process.exit(0);
    }, 1000);
  });

  // System restart endpoint (admin only)
  app.post('/api/system/restart', adminRateLimit, (req: Request, res: Response) => {
    console.log('🔄 System restart initiated by admin');
    
    res.json({
      success: true,
      message: 'System restart initiated',
      timestamp: new Date().toISOString()
    });

    // Restart monitoring services
    setTimeout(() => {
      transactionMonitor.shutdown();
      monitoring.shutdown();
      realTimeMonitor.shutdown();
      
      console.log('🔄 Services restarted');
    }, 1000);
  });

  console.log('🏭 Production monitoring endpoints registered');
}