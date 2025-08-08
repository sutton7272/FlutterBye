/**
 * MainNet Performance Monitoring & Optimization Service
 * Enterprise-grade performance for 10,000+ daily transactions
 */

import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { mainNetService } from './mainnet-config';

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  successRate: number;
  rpcLatency: number;
  transactionConfirmationTime: number;
  networkCongestion: number;
}

export interface SystemAlert {
  id: string;
  type: 'performance' | 'network' | 'rpc' | 'transaction' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  metrics?: Record<string, number>;
}

export interface TransactionBatch {
  batchId: string;
  transactions: (Transaction | VersionedTransaction)[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
  startTime: Date;
  endTime?: Date;
  averageConfirmationTime: number;
}

/**
 * MainNet Performance & Monitoring Service
 * Optimized for enterprise-scale operations
 */
export class MainNetPerformanceMonitorService {
  private connection: Connection;
  private fallbackConnections: Connection[] = [];
  private metrics: PerformanceMetrics;
  private alerts: SystemAlert[] = [];
  private transactionBatches: Map<string, TransactionBatch> = new Map();
  private performanceHistory: PerformanceMetrics[] = [];
  private retryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  };

  constructor() {
    this.connection = mainNetService.getConnection();
    this.initializeFallbackConnections();
    this.initializeMetrics();
    this.startPerformanceMonitoring();
    
    console.log('⚡ MainNet Performance Monitor initialized');
    console.log('🎯 Target: 10,000+ daily transactions');
    console.log('⏱️ Target: <2 second confirmations');
    console.log('📊 Real-time monitoring active');
  }

  /**
   * Initialize fallback RPC connections for load balancing
   */
  private initializeFallbackConnections(): void {
    const fallbackEndpoints = [
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com',
      'https://rpc.ankr.com/solana'
    ];

    this.fallbackConnections = fallbackEndpoints.map(endpoint => 
      new Connection(endpoint, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000
      })
    );

    console.log(`🔗 Initialized ${this.fallbackConnections.length} fallback RPC connections`);
  }

  /**
   * Initialize performance metrics
   */
  private initializeMetrics(): void {
    this.metrics = {
      responseTime: 0,
      throughput: 0,
      errorRate: 0,
      successRate: 100,
      rpcLatency: 0,
      transactionConfirmationTime: 0,
      networkCongestion: 0
    };
  }

  /**
   * Start continuous performance monitoring
   */
  private startPerformanceMonitoring(): void {
    // Monitor every 30 seconds
    setInterval(async () => {
      await this.collectPerformanceMetrics();
      this.analyzePerformanceTrends();
      this.checkPerformanceThresholds();
    }, 30000);

    // Network health check every 5 minutes
    setInterval(async () => {
      await this.performNetworkHealthCheck();
    }, 300000);

    console.log('📊 Performance monitoring started (30s intervals)');
  }

  /**
   * Optimized transaction sending with retry logic and load balancing
   */
  async sendTransactionOptimized(
    transaction: Transaction | VersionedTransaction,
    options: {
      maxRetries?: number;
      skipPreflight?: boolean;
      preflightCommitment?: 'processed' | 'confirmed' | 'finalized';
    } = {}
  ): Promise<{
    signature: string;
    confirmationTime: number;
    rpcEndpoint: string;
    retryCount: number;
  }> {
    const startTime = Date.now();
    let lastError: Error | null = null;
    let retryCount = 0;
    const maxRetries = options.maxRetries || this.retryConfig.maxRetries;

    // Try primary connection first, then fallbacks
    const connections = [this.connection, ...this.fallbackConnections];

    for (let connectionIndex = 0; connectionIndex < connections.length; connectionIndex++) {
      const connection = connections[connectionIndex];
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const signature = await connection.sendTransaction(transaction, {
            skipPreflight: options.skipPreflight || false,
            preflightCommitment: options.preflightCommitment || 'confirmed',
            maxRetries: 0 // We handle retries manually
          });

          // Wait for confirmation
          const confirmation = await connection.confirmTransaction(
            signature,
            'confirmed'
          );

          if (confirmation.value.err) {
            throw new Error(`Transaction failed: ${confirmation.value.err}`);
          }

          const confirmationTime = Date.now() - startTime;
          
          // Update metrics
          await this.updateTransactionMetrics(confirmationTime, true);

          return {
            signature,
            confirmationTime,
            rpcEndpoint: connection.rpcEndpoint,
            retryCount: attempt
          };

        } catch (error) {
          lastError = error as Error;
          retryCount++;
          
          console.warn(`Transaction attempt ${attempt + 1} failed on ${connection.rpcEndpoint}:`, error.message);

          if (attempt < maxRetries) {
            const delay = Math.min(
              this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt),
              this.retryConfig.maxDelay
            );
            await this.delay(delay);
          }
        }
      }
    }

    // All attempts failed
    await this.updateTransactionMetrics(Date.now() - startTime, false);
    throw new Error(`Transaction failed after ${retryCount} attempts across ${connections.length} RPC endpoints: ${lastError?.message}`);
  }

  /**
   * Batch transaction processing for high throughput
   */
  async processBatchTransactions(
    transactions: (Transaction | VersionedTransaction)[],
    batchSize: number = 10
  ): Promise<TransactionBatch> {
    const batchId = `batch-${Date.now()}`;
    const batch: TransactionBatch = {
      batchId,
      transactions,
      status: 'pending',
      totalTransactions: transactions.length,
      completedTransactions: 0,
      failedTransactions: 0,
      startTime: new Date(),
      averageConfirmationTime: 0
    };

    this.transactionBatches.set(batchId, batch);
    batch.status = 'processing';

    console.log(`🚀 Processing batch ${batchId} with ${transactions.length} transactions`);

    const confirmationTimes: number[] = [];
    const promises: Promise<void>[] = [];

    // Process in smaller batches to avoid overwhelming the network
    for (let i = 0; i < transactions.length; i += batchSize) {
      const chunk = transactions.slice(i, i + batchSize);
      
      for (const transaction of chunk) {
        promises.push(
          this.sendTransactionOptimized(transaction)
            .then(result => {
              batch.completedTransactions++;
              confirmationTimes.push(result.confirmationTime);
            })
            .catch(error => {
              batch.failedTransactions++;
              console.error(`Batch transaction failed:`, error.message);
            })
        );
      }

      // Add small delay between batches to prevent congestion
      if (i + batchSize < transactions.length) {
        await this.delay(100);
      }
    }

    await Promise.allSettled(promises);

    batch.endTime = new Date();
    batch.status = 'completed';
    batch.averageConfirmationTime = confirmationTimes.length > 0 
      ? confirmationTimes.reduce((a, b) => a + b, 0) / confirmationTimes.length 
      : 0;

    console.log(`✅ Batch ${batchId} completed: ${batch.completedTransactions}/${batch.totalTransactions} successful`);
    console.log(`⏱️ Average confirmation time: ${batch.averageConfirmationTime}ms`);

    return batch;
  }

  /**
   * Collect real-time performance metrics
   */
  private async collectPerformanceMetrics(): Promise<void> {
    const startTime = Date.now();

    try {
      // Test RPC latency
      const rpcStart = Date.now();
      await this.connection.getLatestBlockhash();
      const rpcLatency = Date.now() - rpcStart;

      // Get network performance info
      const performanceInfo = await this.connection.getRecentPerformanceSamples(1);
      const networkCongestion = performanceInfo.length > 0 
        ? performanceInfo[0].numTransactions / performanceInfo[0].samplePeriodSecs 
        : 0;

      // Update metrics
      this.metrics = {
        ...this.metrics,
        rpcLatency,
        networkCongestion,
        responseTime: Date.now() - startTime
      };

      // Store in history (keep last 100 samples)
      this.performanceHistory.push({ ...this.metrics });
      if (this.performanceHistory.length > 100) {
        this.performanceHistory.shift();
      }

    } catch (error) {
      console.error('Failed to collect performance metrics:', error);
      await this.createAlert({
        type: 'performance',
        severity: 'medium',
        message: `Failed to collect performance metrics: ${error.message}`
      });
    }
  }

  /**
   * Analyze performance trends and predict issues
   */
  private analyzePerformanceTrends(): void {
    if (this.performanceHistory.length < 10) return;

    const recent = this.performanceHistory.slice(-10);
    const averageLatency = recent.reduce((sum, m) => sum + m.rpcLatency, 0) / recent.length;
    const averageResponseTime = recent.reduce((sum, m) => sum + m.responseTime, 0) / recent.length;

    // Trend analysis
    const latencyTrend = this.calculateTrend(recent.map(m => m.rpcLatency));
    const responseTrend = this.calculateTrend(recent.map(m => m.responseTime));

    // Performance degradation detection
    if (latencyTrend > 0.2 && averageLatency > 1000) {
      this.createAlert({
        type: 'performance',
        severity: 'medium',
        message: `RPC latency increasing trend detected. Average: ${averageLatency.toFixed(0)}ms`
      });
    }

    if (responseTrend > 0.3 && averageResponseTime > 2000) {
      this.createAlert({
        type: 'performance',
        severity: 'high',
        message: `Response time degradation detected. Average: ${averageResponseTime.toFixed(0)}ms`
      });
    }
  }

  /**
   * Check performance against thresholds and create alerts
   */
  private checkPerformanceThresholds(): void {
    const thresholds = {
      rpcLatency: { warning: 1000, critical: 3000 },
      responseTime: { warning: 2000, critical: 5000 },
      errorRate: { warning: 5, critical: 10 },
      successRate: { warning: 95, critical: 90 }
    };

    Object.entries(thresholds).forEach(([metric, threshold]) => {
      const value = this.metrics[metric as keyof PerformanceMetrics];
      
      if (value >= threshold.critical) {
        this.createAlert({
          type: 'performance',
          severity: 'critical',
          message: `Critical ${metric} threshold exceeded: ${value}`,
          metrics: { [metric]: value }
        });
      } else if (value >= threshold.warning) {
        this.createAlert({
          type: 'performance',
          severity: 'medium',
          message: `Warning ${metric} threshold exceeded: ${value}`,
          metrics: { [metric]: value }
        });
      }
    });
  }

  /**
   * Perform comprehensive network health check
   */
  private async performNetworkHealthCheck(): Promise<void> {
    try {
      const healthPromises = [
        this.connection.getHealth(),
        this.connection.getVersion(),
        this.connection.getEpochInfo()
      ];

      const [health, version, epochInfo] = await Promise.allSettled(healthPromises);

      const healthResults = {
        health: health.status === 'fulfilled' ? health.value : 'unknown',
        version: version.status === 'fulfilled' ? version.value : null,
        epochInfo: epochInfo.status === 'fulfilled' ? epochInfo.value : null
      };

      if (health.status === 'rejected' || healthResults.health !== 'ok') {
        await this.createAlert({
          type: 'network',
          severity: 'critical',
          message: 'Network health check failed - RPC endpoint may be unhealthy'
        });
      }

      console.log('🏥 Network health check completed:', healthResults.health);

    } catch (error) {
      await this.createAlert({
        type: 'network',
        severity: 'high',
        message: `Network health check error: ${error.message}`
      });
    }
  }

  // Helper methods
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    return (secondAvg - firstAvg) / firstAvg;
  }

  private async updateTransactionMetrics(duration: number, success: boolean): Promise<void> {
    if (success) {
      this.metrics.transactionConfirmationTime = duration;
      this.metrics.successRate = Math.min(100, this.metrics.successRate + 0.1);
      this.metrics.errorRate = Math.max(0, this.metrics.errorRate - 0.1);
    } else {
      this.metrics.errorRate = Math.min(100, this.metrics.errorRate + 1);
      this.metrics.successRate = Math.max(0, this.metrics.successRate - 1);
    }
  }

  private async createAlert(alert: Omit<SystemAlert, 'id' | 'timestamp' | 'resolved'>): Promise<string> {
    const id = `alert-${Date.now()}`;
    const systemAlert: SystemAlert = {
      id,
      timestamp: new Date(),
      resolved: false,
      ...alert
    };

    this.alerts.push(systemAlert);
    console.log(`🚨 ${alert.severity.toUpperCase()} Alert: ${alert.message}`);
    
    return id;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current performance dashboard
   */
  getPerformanceDashboard(): {
    metrics: PerformanceMetrics;
    alerts: SystemAlert[];
    batches: TransactionBatch[];
    systemStatus: 'optimal' | 'degraded' | 'critical';
    uptime: number;
  } {
    const activeAlerts = this.alerts.filter(a => !a.resolved);
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
    
    let systemStatus: 'optimal' | 'degraded' | 'critical';
    if (criticalAlerts.length > 0) {
      systemStatus = 'critical';
    } else if (activeAlerts.length > 0 || this.metrics.errorRate > 5) {
      systemStatus = 'degraded';
    } else {
      systemStatus = 'optimal';
    }

    return {
      metrics: this.metrics,
      alerts: this.alerts.slice(-50), // Last 50 alerts
      batches: Array.from(this.transactionBatches.values()).slice(-20), // Last 20 batches
      systemStatus,
      uptime: process.uptime()
    };
  }

  /**
   * Get transaction batch status
   */
  getBatchStatus(batchId: string): TransactionBatch | undefined {
    return this.transactionBatches.get(batchId);
  }
}

// Export singleton instance
export const mainNetPerformanceMonitor = new MainNetPerformanceMonitorService();