/**
 * FlutterAI Automatic Wallet Collection Service
 * 
 * Automatically collects wallet addresses when users connect to FlutterBye/PerpeTrader
 * and adds them to the FlutterAI intelligence database for scoring and analysis
 */

import { storage } from './storage';

export class FlutterAIAutoCollectionService {
  constructor() {}

  /**
   * Automatically collect wallet address during authentication
   * Called when user connects wallet to FlutterBye or PerpeTrader
   */
  async collectWalletOnAuthentication(
    walletAddress: string,
    source: 'flutterbye' | 'perpetrader' = 'flutterbye',
    userAgent?: string,
    ipAddress?: string
  ): Promise<void> {
    try {
      // Check if wallet already exists in FlutterAI intelligence
      const existingWallet = await storage.getWalletIntelligence(walletAddress);
      
      if (existingWallet) {
        console.log(`🔄 Wallet already exists in FlutterAI intelligence: ${walletAddress}`);
        return;
      }

      // Add to FlutterAI comprehensive intelligence database 
      const intelligenceData = {
        walletAddress,
        source: `automatic_collection_${source}`,
        collectedBy: 'FlutterAI Auto-Collection Service',
        collectionMethod: 'automatic',
        sourcePlatform: source === 'flutterbye' ? 'FlutterBye' : 'PerpeTrader',
        metadata: {
          connectionSource: source,
          firstConnection: new Date().toISOString(),
          userAgent,
          ipAddress,
          connectionCount: 1
        }
      };
      
      const newWallet = await storage.createWalletIntelligence(intelligenceData);
      console.log(`✅ Auto-collected new wallet for FlutterAI intelligence: ${walletAddress}`);

    } catch (error) {
      console.error('Error in automatic wallet collection:', error);
    }
  }

  /**
   * Get collection statistics
   */
  async getCollectionStats(): Promise<{
    totalAutoCollected: number;
    bySource: Record<string, number>;
    recentCollections: number;
  }> {
    try {
      const wallets = await storage.getAllWalletIntelligence();
      
      // Debug: log the first wallet to see its structure
      if (wallets.length > 0) {
        console.log('🔍 Sample wallet structure:', JSON.stringify(wallets[0], null, 2));
      }
      
      console.log(`🔍 Total wallets found: ${wallets.length}`);
      
      const autoCollected = wallets.filter((w: any) => {
        const isAutoCollected = w.source?.includes('automatic_collection') ||
          w.collectedBy === 'FlutterAI Auto-Collection Service' ||
          w.collectionMethod === 'automatic';
        
        console.log(`🔍 Wallet ${w.walletAddress}: collectionMethod="${w.collectionMethod}", isAutoCollected=${isAutoCollected}`);
        return isAutoCollected;
      });

      const bySource = autoCollected.reduce((acc: Record<string, number>, wallet: any) => {
        let source = 'unknown';
        console.log(`🔍 Processing wallet with sourcePlatform: "${wallet.sourcePlatform}"`);
        if (wallet.sourcePlatform === 'FlutterBye') {
          source = 'flutterbye';
          console.log(`✅ Categorized as flutterbye`);
        } else if (wallet.sourcePlatform === 'PerpeTrader') {
          source = 'perpetrader';  
          console.log(`✅ Categorized as perpetrader`);
        } else {
          console.log(`❌ No match found, defaulting to unknown`);
        }
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      // Count collections in last 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentCollections = autoCollected.filter((w: any) => 
        new Date(w.createdAt) > yesterday
      ).length;

      return {
        totalAutoCollected: autoCollected.length,
        bySource,
        recentCollections
      };
    } catch (error) {
      console.error('Error getting collection stats:', error);
      return {
        totalAutoCollected: 0,
        bySource: {},
        recentCollections: 0
      };
    }
  }
}

// Export singleton instance
export const flutterAIAutoCollection = new FlutterAIAutoCollectionService();