import { EventEmitter } from 'events';
import { storage } from './storage';
import { realTimeMonitor } from './real-time-monitor';

// Transaction monitoring and failure recovery service
export class TransactionMonitor extends EventEmitter {
  private pendingTransactions = new Map<string, any>();
  private retryAttempts = new Map<string, number>();
  private maxRetries = 3;
  private retryDelay = 5000; // 5 seconds
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startHealthCheck();
  }

  // Monitor a new transaction
  async monitorTransaction(transactionData: any): Promise<string> {
    const transactionId = this.generateTransactionId();
    
    const transaction = {
      id: transactionId,
      userId: transactionData.userId,
      type: transactionData.type, // 'token_creation', 'value_attachment', 'redemption'
      status: 'pending',
      data: transactionData,
      createdAt: new Date(),
      lastUpdated: new Date(),
      retryCount: 0
    };

    this.pendingTransactions.set(transactionId, transaction);
    this.retryAttempts.set(transactionId, 0);

    console.log(`🔄 Monitoring transaction: ${transactionId} (${transaction.type})`);

    // Emit monitoring started event
    this.emit('transaction_started', transaction);

    // Send real-time update to user
    realTimeMonitor.sendTransactionUpdate(transaction.userId, {
      transactionId,
      status: 'pending',
      type: transaction.type,
      message: 'Transaction initiated...'
    });

    return transactionId;
  }

  // Update transaction status
  async updateTransactionStatus(
    transactionId: string, 
    status: 'pending' | 'confirmed' | 'failed' | 'retrying',
    result?: any,
    error?: string
  ): Promise<void> {
    const transaction = this.pendingTransactions.get(transactionId);
    
    if (!transaction) {
      console.warn(`⚠️ Transaction not found for update: ${transactionId}`);
      return;
    }

    transaction.status = status;
    transaction.lastUpdated = new Date();
    
    if (result) {
      transaction.result = result;
    }
    
    if (error) {
      transaction.error = error;
    }

    // Log status update
    console.log(`📊 Transaction ${transactionId} status: ${status}`);

    // Send real-time update to user
    realTimeMonitor.sendTransactionUpdate(transaction.userId, {
      transactionId,
      status,
      type: transaction.type,
      message: this.getStatusMessage(status, error),
      result: result || null,
      error: error || null
    });

    // Handle status-specific logic
    switch (status) {
      case 'confirmed':
        await this.handleConfirmedTransaction(transaction);
        break;
      case 'failed':
        await this.handleFailedTransaction(transaction);
        break;
      case 'retrying':
        await this.handleRetryTransaction(transaction);
        break;
    }

    // Emit status update event
    this.emit('transaction_updated', transaction);
  }

  // Handle confirmed transaction
  private async handleConfirmedTransaction(transaction: any): Promise<void> {
    try {
      // Store transaction record in database
      await storage.createTransaction({
        id: transaction.id,
        userId: transaction.userId,
        type: transaction.type,
        status: 'confirmed',
        amount: transaction.data.amount || '0',
        currency: transaction.data.currency || 'SOL',
        metadata: {
          ...transaction.data,
          result: transaction.result,
          confirmedAt: new Date().toISOString()
        }
      });

      // Remove from pending transactions
      this.pendingTransactions.delete(transaction.id);
      this.retryAttempts.delete(transaction.id);

      // Update user analytics
      await this.updateUserAnalytics(transaction);

      console.log(`✅ Transaction confirmed and stored: ${transaction.id}`);
    } catch (error) {
      console.error(`❌ Error handling confirmed transaction ${transaction.id}:`, error);
    }
  }

  // Handle failed transaction with retry logic
  private async handleFailedTransaction(transaction: any): Promise<void> {
    const currentRetries = this.retryAttempts.get(transaction.id) || 0;
    
    if (currentRetries < this.maxRetries) {
      // Schedule retry
      setTimeout(async () => {
        await this.retryTransaction(transaction.id);
      }, this.retryDelay * (currentRetries + 1)); // Exponential backoff
    } else {
      // Max retries reached, mark as failed permanently
      try {
        await storage.createTransaction({
          id: transaction.id,
          userId: transaction.userId,
          type: transaction.type,
          status: 'failed',
          amount: transaction.data.amount || '0',
          currency: transaction.data.currency || 'SOL',
          metadata: {
            ...transaction.data,
            error: transaction.error,
            failedAt: new Date().toISOString(),
            retryCount: currentRetries
          }
        });

        // Remove from pending transactions
        this.pendingTransactions.delete(transaction.id);
        this.retryAttempts.delete(transaction.id);

        console.log(`❌ Transaction failed permanently: ${transaction.id}`);
      } catch (error) {
        console.error(`❌ Error storing failed transaction ${transaction.id}:`, error);
      }
    }
  }

  // Handle retry transaction
  private async handleRetryTransaction(transaction: any): Promise<void> {
    const currentRetries = this.retryAttempts.get(transaction.id) || 0;
    this.retryAttempts.set(transaction.id, currentRetries + 1);
    transaction.retryCount = currentRetries + 1;

    console.log(`🔄 Retrying transaction: ${transaction.id} (attempt ${currentRetries + 1}/${this.maxRetries})`);
  }

  // Retry a failed transaction
  private async retryTransaction(transactionId: string): Promise<void> {
    const transaction = this.pendingTransactions.get(transactionId);
    
    if (!transaction) {
      console.warn(`⚠️ Cannot retry transaction - not found: ${transactionId}`);
      return;
    }

    await this.updateTransactionStatus(transactionId, 'retrying');

    // Simulate transaction retry (in production, call actual blockchain service)
    try {
      // This would be the actual transaction execution
      const success = await this.executeTransaction(transaction);
      
      if (success) {
        await this.updateTransactionStatus(transactionId, 'confirmed', success);
      } else {
        await this.updateTransactionStatus(transactionId, 'failed', null, 'Transaction execution failed');
      }
    } catch (error) {
      await this.updateTransactionStatus(
        transactionId, 
        'failed', 
        null, 
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  // Execute transaction (placeholder for actual blockchain calls)
  private async executeTransaction(transaction: any): Promise<any> {
    // Simulate transaction processing
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 80% success rate
        if (Math.random() > 0.2) {
          resolve({
            signature: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            blockHash: `block_${Date.now()}`,
            confirmations: 1,
            timestamp: new Date().toISOString()
          });
        } else {
          reject(new Error('Simulated transaction failure'));
        }
      }, 2000); // 2 second processing time
    });
  }

  // Update user analytics based on transaction
  private async updateUserAnalytics(transaction: any): Promise<void> {
    try {
      // Update user analytics (token creation count, total value, etc.)
      const analyticsData = {
        userId: transaction.userId,
        eventType: transaction.type,
        value: parseFloat(transaction.data.amount || '0'),
        currency: transaction.data.currency || 'SOL',
        timestamp: new Date(),
        metadata: {
          transactionId: transaction.id,
          platform: 'web',
          source: 'production'
        }
      };

      await storage.createAnalytics(analyticsData);
    } catch (error) {
      console.error('Error updating user analytics:', error);
    }
  }

  // Get status message for user display
  private getStatusMessage(status: string, error?: string): string {
    switch (status) {
      case 'pending':
        return 'Processing transaction...';
      case 'confirmed':
        return 'Transaction confirmed successfully!';
      case 'failed':
        return error ? `Transaction failed: ${error}` : 'Transaction failed. Please try again.';
      case 'retrying':
        return 'Transaction failed, retrying...';
      default:
        return 'Unknown transaction status';
    }
  }

  // Start health check for pending transactions
  private startHealthCheck(): void {
    this.healthCheckInterval = setInterval(() => {
      this.checkPendingTransactions();
    }, 30000); // Check every 30 seconds
  }

  // Check for stale pending transactions
  private checkPendingTransactions(): void {
    const now = new Date();
    const staleThreshold = 5 * 60 * 1000; // 5 minutes

    for (const [transactionId, transaction] of this.pendingTransactions.entries()) {
      const timeSinceUpdate = now.getTime() - transaction.lastUpdated.getTime();
      
      if (timeSinceUpdate > staleThreshold && transaction.status === 'pending') {
        console.warn(`⚠️ Stale transaction detected: ${transactionId}`);
        this.updateTransactionStatus(transactionId, 'failed', null, 'Transaction timeout');
      }
    }
  }

  // Get transaction status
  getTransactionStatus(transactionId: string): any | null {
    return this.pendingTransactions.get(transactionId) || null;
  }

  // Get all pending transactions for a user
  getUserPendingTransactions(userId: string): any[] {
    return Array.from(this.pendingTransactions.values())
      .filter(tx => tx.userId === userId);
  }

  // Get metrics
  getMetrics() {
    const pending = this.pendingTransactions.size;
    const retrying = Array.from(this.pendingTransactions.values())
      .filter(tx => tx.status === 'retrying').length;
    
    return {
      pendingTransactions: pending,
      retryingTransactions: retrying,
      totalMonitored: pending + retrying
    };
  }

  // Generate unique transaction ID
  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup on shutdown
  shutdown(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    this.pendingTransactions.clear();
    this.retryAttempts.clear();
    
    console.log('🛑 Transaction monitor shutdown complete');
  }
}

// Export singleton instance
export const transactionMonitor = new TransactionMonitor();