import { Connection, PublicKey } from '@solana/web3.js';
import { storage } from './storage';

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

export interface TransactionStatus {
  signature: string;
  status: 'pending' | 'confirmed' | 'failed' | 'finalized';
  confirmations: number;
  blockTime?: number;
  error?: string;
}

export class TransactionMonitor {
  private monitoringTransactions = new Map<string, NodeJS.Timeout>();
  private maxRetries = 10;
  private retryDelay = 3000; // 3 seconds

  // Monitor a transaction until it's confirmed or fails
  async monitorTransaction(signature: string, tokenId?: string): Promise<TransactionStatus> {
    console.log(`Starting monitoring for transaction: ${signature}`);

    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      const checkTransaction = async () => {
        try {
          attempts++;
          console.log(`Checking transaction ${signature}, attempt ${attempts}`);

          const status = await connection.getSignatureStatus(signature, {
            searchTransactionHistory: true
          });

          if (status?.value) {
            const { confirmationStatus, err } = status.value;
            
            if (err) {
              // Transaction failed
              console.error(`Transaction ${signature} failed:`, err);
              this.stopMonitoring(signature);
              
              if (tokenId) {
                await this.updateTransactionStatus(tokenId, 'failed', err.toString());
              }
              
              resolve({
                signature,
                status: 'failed',
                confirmations: 0,
                error: err.toString()
              });
              return;
            }

            if (confirmationStatus === 'finalized') {
              // Transaction finalized
              console.log(`Transaction ${signature} finalized`);
              this.stopMonitoring(signature);
              
              if (tokenId) {
                await this.updateTransactionStatus(tokenId, 'confirmed');
              }
              
              // Get additional transaction details
              const transaction = await connection.getTransaction(signature);
              
              resolve({
                signature,
                status: 'finalized',
                confirmations: 32, // Finalized means 32+ confirmations
                blockTime: transaction?.blockTime || undefined
              });
              return;
            }

            if (confirmationStatus === 'confirmed') {
              console.log(`Transaction ${signature} confirmed`);
              resolve({
                signature,
                status: 'confirmed',
                confirmations: 1
              });
              return;
            }
          }

          // Transaction still pending
          if (attempts >= this.maxRetries) {
            console.warn(`Transaction ${signature} monitoring timeout after ${attempts} attempts`);
            this.stopMonitoring(signature);
            
            if (tokenId) {
              await this.updateTransactionStatus(tokenId, 'failed', 'Monitoring timeout');
            }
            
            resolve({
              signature,
              status: 'failed',
              confirmations: 0,
              error: 'Monitoring timeout'
            });
            return;
          }

          // Schedule next check
          const timeout = setTimeout(checkTransaction, this.retryDelay);
          this.monitoringTransactions.set(signature, timeout);

        } catch (error) {
          console.error(`Error monitoring transaction ${signature}:`, error);
          
          if (attempts >= this.maxRetries) {
            this.stopMonitoring(signature);
            reject(error);
          } else {
            // Retry on error
            const timeout = setTimeout(checkTransaction, this.retryDelay);
            this.monitoringTransactions.set(signature, timeout);
          }
        }
      };

      // Start monitoring
      checkTransaction();
    });
  }

  // Stop monitoring a transaction
  private stopMonitoring(signature: string) {
    const timeout = this.monitoringTransactions.get(signature);
    if (timeout) {
      clearTimeout(timeout);
      this.monitoringTransactions.delete(signature);
    }
  }

  // Update transaction status in database
  private async updateTransactionStatus(tokenId: string, status: string, error?: string) {
    try {
      const updateData: any = { status };
      if (error) {
        updateData.error = error;
      }
      
      // Update token or transaction record as needed
      await storage.updateToken(tokenId, updateData);
    } catch (error) {
      console.error('Failed to update transaction status:', error);
    }
  }

  // Get current status of a transaction
  async getTransactionStatus(signature: string): Promise<TransactionStatus | null> {
    try {
      const status = await connection.getSignatureStatus(signature, {
        searchTransactionHistory: true
      });

      if (!status?.value) {
        return {
          signature,
          status: 'pending',
          confirmations: 0
        };
      }

      const { confirmationStatus, err, confirmations } = status.value;

      if (err) {
        return {
          signature,
          status: 'failed',
          confirmations: 0,
          error: err.toString()
        };
      }

      let statusValue: 'pending' | 'confirmed' | 'finalized' = 'pending';
      if (confirmationStatus === 'finalized') {
        statusValue = 'finalized';
      } else if (confirmationStatus === 'confirmed') {
        statusValue = 'confirmed';
      }

      return {
        signature,
        status: statusValue,
        confirmations: confirmations || 0
      };

    } catch (error) {
      console.error('Error getting transaction status:', error);
      return null;
    }
  }

  // Monitor multiple transactions
  async monitorMultipleTransactions(signatures: string[]): Promise<TransactionStatus[]> {
    const promises = signatures.map(signature => this.monitorTransaction(signature));
    return Promise.all(promises);
  }

  // Cleanup - stop all monitoring
  cleanup() {
    for (const timeout of this.monitoringTransactions.values()) {
      clearTimeout(timeout);
    }
    this.monitoringTransactions.clear();
  }
}

// Singleton instance
export const transactionMonitor = new TransactionMonitor();

// Cleanup on process exit
process.on('SIGINT', () => {
  transactionMonitor.cleanup();
});

process.on('SIGTERM', () => {
  transactionMonitor.cleanup();
});