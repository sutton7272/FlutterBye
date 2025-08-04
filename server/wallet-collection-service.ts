import { storage } from "./storage";
import { FlutterAIWalletScoringService } from "./flutterai-wallet-scoring";

/**
 * Comprehensive Wallet Collection Service for FlutterAI Intelligence System
 * 
 * This service automatically collects wallet addresses from:
 * - FlutterBye user connections
 * - PerpeTrader user connections  
 * - Manual admin entry
 * - CSV bulk uploads
 * 
 * All collected wallets are automatically queued for FlutterAI analysis and scoring
 */
export class WalletCollectionService {
  private aiScoringService: FlutterAIWalletScoringService;

  constructor() {
    this.aiScoringService = new FlutterAIWalletScoringService();
  }

  /**
   * Automatically collect wallet address when user connects to FlutterBye
   */
  async collectFromFlutterByeConnection(walletAddress: string, userId?: string): Promise<void> {
    try {
      console.log(`🔍 Collecting wallet from FlutterBye connection: ${walletAddress}`);
      
      // Check if wallet already exists
      const existing = await storage.getWalletIntelligence(walletAddress);
      if (existing) {
        // Update association with user if needed
        if (userId && !existing.associatedUserId) {
          await storage.updateWalletScore(walletAddress, {
            associatedUserId: userId,
            updatedAt: new Date(),
          });
        }
        console.log(`✅ Wallet already tracked: ${walletAddress}`);
        return;
      }

      // Collect new wallet
      const walletIntelligence = await storage.collectWalletAddress(
        walletAddress,
        'flutterbye_connect'
      );

      // Associate with user if provided
      if (userId) {
        await storage.updateWalletScore(walletAddress, {
          associatedUserId: userId,
        });
      }

      // Queue for AI analysis
      await storage.addToAnalysisQueue(walletAddress, 2); // Medium priority

      console.log(`✅ Collected FlutterBye wallet: ${walletAddress}`);
    } catch (error) {
      console.error(`❌ Error collecting FlutterBye wallet ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Automatically collect wallet address when user connects to PerpeTrader
   */
  async collectFromPerpeTraderConnection(walletAddress: string, userId?: string): Promise<void> {
    try {
      console.log(`🔍 Collecting wallet from PerpeTrader connection: ${walletAddress}`);
      
      // Check if wallet already exists
      const existing = await storage.getWalletIntelligence(walletAddress);
      if (existing) {
        // Update association with user if needed
        if (userId && !existing.associatedUserId) {
          await storage.updateWalletScore(walletAddress, {
            associatedUserId: userId,
            updatedAt: new Date(),
          });
        }
        console.log(`✅ Wallet already tracked: ${walletAddress}`);
        return;
      }

      // Collect new wallet
      const walletIntelligence = await storage.collectWalletAddress(
        walletAddress,
        'perpetrader_connect'
      );

      // Associate with user if provided
      if (userId) {
        await storage.updateWalletScore(walletAddress, {
          associatedUserId: userId,
        });
      }

      // Queue for AI analysis with high priority (trading platform)
      await storage.addToAnalysisQueue(walletAddress, 3); // High priority

      console.log(`✅ Collected PerpeTrader wallet: ${walletAddress}`);
    } catch (error) {
      console.error(`❌ Error collecting PerpeTrader wallet ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Manual wallet entry by admin
   */
  async collectManualEntry(walletAddress: string, adminUserId: string, tags?: string[], notes?: string): Promise<void> {
    try {
      console.log(`🔍 Manual wallet entry: ${walletAddress} by admin ${adminUserId}`);
      
      // Check if wallet already exists
      const existing = await storage.getWalletIntelligence(walletAddress);
      if (existing) {
        // Update with additional info if provided
        const updates: any = {};
        if (tags && tags.length > 0) {
          updates.tags = [...(existing.tags || []), ...tags];
        }
        if (notes) {
          updates.notes = existing.notes ? `${existing.notes}\n\nAdmin Note: ${notes}` : notes;
        }
        if (Object.keys(updates).length > 0) {
          await storage.updateWalletScore(walletAddress, updates);
        }
        console.log(`✅ Updated existing wallet: ${walletAddress}`);
        return;
      }

      // Collect new wallet
      const walletIntelligence = await storage.collectWalletAddress(
        walletAddress,
        'manual_entry',
        adminUserId
      );

      // Add tags and notes if provided
      if (tags || notes) {
        await storage.updateWalletScore(walletAddress, {
          tags: tags || [],
          notes: notes || '',
        });
      }

      // Queue for immediate AI analysis
      await storage.addToAnalysisQueue(walletAddress, 4, undefined, adminUserId); // Critical priority

      console.log(`✅ Manually collected wallet: ${walletAddress}`);
    } catch (error) {
      console.error(`❌ Error manually collecting wallet ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Process CSV file upload of wallet addresses
   */
  async processCsvUpload(
    csvContent: string, 
    fileName: string, 
    batchName: string, 
    uploadedBy: string
  ): Promise<{
    batchId: string;
    totalWallets: number;
    validWallets: number;
    invalidWallets: string[];
  }> {
    try {
      console.log(`📊 Processing CSV upload: ${fileName} by ${uploadedBy}`);
      
      // Parse CSV content
      const lines = csvContent.split('\n').filter(line => line.trim() !== '');
      const walletAddresses: string[] = [];
      const invalidWallets: string[] = [];

      // Extract wallet addresses (support multiple CSV formats)
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === '' || trimmedLine.toLowerCase().includes('wallet') || trimmedLine.toLowerCase().includes('address')) {
          continue; // Skip headers
        }

        // Extract wallet address (could be in different columns)
        const columns = trimmedLine.split(',').map(col => col.trim().replace(/['"]/g, ''));
        const potentialWallet = columns[0]; // Assume first column is wallet address

        if (this.isValidSolanaWallet(potentialWallet)) {
          walletAddresses.push(potentialWallet);
        } else {
          invalidWallets.push(potentialWallet);
        }
      }

      console.log(`📊 Parsed ${walletAddresses.length} valid wallets, ${invalidWallets.length} invalid`);

      // Create batch record
      const batch = await storage.createWalletBatch({
        batchName,
        uploadedBy,
        fileName,
        totalWallets: walletAddresses.length,
      });

      // Process each wallet address
      let processedCount = 0;
      for (const walletAddress of walletAddresses) {
        try {
          // Check if wallet already exists
          const existing = await storage.getWalletIntelligence(walletAddress);
          if (!existing) {
            // Collect new wallet
            await storage.collectWalletAddress(
              walletAddress,
              'csv_upload',
              uploadedBy
            );

            // Update with batch info
            await storage.updateWalletScore(walletAddress, {
              batchId: batch.id,
              batchName,
            });
          }

          // Queue for analysis
          await storage.addToAnalysisQueue(walletAddress, 1, batch.id, uploadedBy); // Low priority for bulk
          processedCount++;
        } catch (error) {
          console.error(`❌ Error processing wallet ${walletAddress}:`, error);
          invalidWallets.push(walletAddress);
        }
      }

      // Update batch with final counts
      await storage.updateWalletBatch(batch.id, {
        processedWallets: processedCount,
      });

      console.log(`✅ CSV batch processed: ${batch.id} - ${processedCount}/${walletAddresses.length} wallets`);

      return {
        batchId: batch.id,
        totalWallets: walletAddresses.length,
        validWallets: processedCount,
        invalidWallets,
      };
    } catch (error) {
      console.error(`❌ Error processing CSV upload:`, error);
      throw error;
    }
  }

  /**
   * Collect wallet from token analysis
   */
  async collectWalletFromTokenAnalysis(
    walletAddress: string, 
    source: string, 
    metadata: any
  ): Promise<void> {
    try {
      console.log(`🔍 Collecting wallet from token analysis: ${walletAddress}`);
      
      // Collect new wallet
      const walletIntelligence = await storage.collectWalletAddress(
        walletAddress,
        'token_analysis'
      );

      // Update with metadata
      await storage.updateWalletScore(walletAddress, {
        metadata: {
          tokenAnalysisSource: source,
          collectionDate: new Date().toISOString(),
          ...metadata
        }
      });

      // Queue for AI analysis
      await storage.addToAnalysisQueue(walletAddress, 2); // Medium priority

      console.log(`✅ Collected token analysis wallet: ${walletAddress}`);
    } catch (error) {
      console.error(`❌ Error collecting token analysis wallet ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Get comprehensive collection statistics
   */
  async getCollectionStats(): Promise<{
    totalWallets: number;
    bySource: {
      flutterbye_connect: number;
      perpetrader_connect: number;
      manual_entry: number;
      csv_upload: number;
    };
    byRiskLevel: {
      low: number;
      medium: number;
      high: number;
      critical: number;
      unknown: number;
    };
    analysisStats: {
      queued: number;
      processing: number;
      completed: number;
      failed: number;
    };
  }> {
    try {
      const allWallets = await storage.getAllWalletIntelligence();
      const analysisStats = await storage.getAnalysisQueueStats();

      const bySource = {
        flutterbye_connect: 0,
        perpetrader_connect: 0,
        manual_entry: 0,
        csv_upload: 0,
      };

      const byRiskLevel = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
        unknown: 0,
      };

      for (const wallet of allWallets) {
        // Count by source
        if (bySource.hasOwnProperty(wallet.collectionSource)) {
          (bySource as any)[wallet.collectionSource]++;
        }

        // Count by risk level
        if (byRiskLevel.hasOwnProperty(wallet.riskLevel)) {
          (byRiskLevel as any)[wallet.riskLevel]++;
        }
      }

      return {
        totalWallets: allWallets.length,
        bySource,
        byRiskLevel,
        analysisStats,
      };
    } catch (error) {
      console.error(`❌ Error getting collection stats:`, error);
      throw error;
    }
  }

  /**
   * Validate Solana wallet address format
   */
  private isValidSolanaWallet(address: string): boolean {
    // Basic validation for Solana wallet address
    // Should be 32-44 characters, base58 encoded
    if (!address || typeof address !== 'string') return false;
    if (address.length < 32 || address.length > 44) return false;
    
    // Check if it contains only valid base58 characters
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    return base58Regex.test(address);
  }

  /**
   * Trigger analysis for queued wallets
   */
  async processAnalysisQueue(maxBatchSize: number = 10): Promise<void> {
    try {
      console.log(`🔄 Processing analysis queue (max batch: ${maxBatchSize})`);
      
      for (let i = 0; i < maxBatchSize; i++) {
        const queueItem = await storage.getNextQueuedAnalysis();
        if (!queueItem) break;

        try {
          // Update status to processing
          await storage.updateAnalysisQueueStatus(queueItem.id, 'processing');

          // Perform AI analysis
          const analysisResult = await this.aiScoringService.scoreWallet(queueItem.walletAddress);

          // Update wallet with analysis results
          await storage.updateWalletScore(queueItem.walletAddress, {
            socialCreditScore: analysisResult.socialCreditScore,
            riskLevel: analysisResult.riskLevel,
            tradingBehaviorScore: analysisResult.tradingBehaviorScore,
            portfolioQualityScore: analysisResult.portfolioQualityScore,
            liquidityScore: analysisResult.liquidityScore,
            activityScore: analysisResult.activityScore,
            analysisData: analysisResult.analysisData,
            analysisStatus: 'completed',
            lastAnalyzed: new Date(),
          });

          // Mark queue item as completed
          await storage.updateAnalysisQueueStatus(queueItem.id, 'completed');

          console.log(`✅ Analyzed wallet: ${queueItem.walletAddress}`);
        } catch (error) {
          console.error(`❌ Error analyzing wallet ${queueItem.walletAddress}:`, error);
          
          // Update attempts and status
          await storage.updateAnalysisQueueStatus(
            queueItem.id, 
            queueItem.attempts >= queueItem.maxAttempts - 1 ? 'failed' : 'queued',
            queueItem.attempts + 1
          );

          // Update wallet with error
          await storage.updateWalletScore(queueItem.walletAddress, {
            analysisStatus: 'failed',
            analysisError: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    } catch (error) {
      console.error(`❌ Error processing analysis queue:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const walletCollectionService = new WalletCollectionService();