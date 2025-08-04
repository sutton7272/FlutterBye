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
    source: string = 'flutterbye',
    userAgent?: string,
    ipAddress?: string,
    additionalMetadata?: any
  ): Promise<void> {
    try {
      // Enhanced duplicate checking - check multiple ways to ensure no duplicates
      const existingWallet = await storage.getWalletIntelligence(walletAddress);
      
      if (existingWallet) {
        console.log(`🔄 Wallet already exists in FlutterAI intelligence: ${walletAddress} (skipping duplicate)`);
        
        // Update metadata for existing wallet to track additional connections
        try {
          const currentMetadata = existingWallet.metadata || {};
          const updatedMetadata = {
            ...currentMetadata,
            lastConnection: new Date().toISOString(),
            connectionCount: (currentMetadata.connectionCount || 0) + 1,
            additionalSources: [
              ...(currentMetadata.additionalSources || []),
              {
                source,
                connectedAt: new Date().toISOString(),
                userAgent,
                ipAddress
              }
            ]
          };
          
          await storage.updateWalletScore(walletAddress, { 
            metadata: updatedMetadata,
            updatedAt: new Date() 
          });
          console.log(`🔄 Updated connection metadata for existing wallet: ${walletAddress}`);
        } catch (updateError) {
          console.warn('Could not update existing wallet metadata:', updateError);
        }
        return;
      }

      // Double-check by searching all wallets to ensure absolute no duplicates
      const allWallets = await storage.getAllWalletIntelligence();
      const duplicateCheck = allWallets.find((w: any) => 
        w.walletAddress?.toLowerCase() === walletAddress.toLowerCase()
      );
      
      if (duplicateCheck) {
        console.log(`🚫 DUPLICATE PREVENTED: Wallet ${walletAddress} already exists (found in search)`);
        return;
      }

      // Determine source platform name  
      let sourcePlatform = 'Unknown';
      if (source === 'flutterbye') sourcePlatform = 'FlutterBye';
      else if (source === 'perpetrader') sourcePlatform = 'PerpeTrader';
      else sourcePlatform = additionalMetadata?.platformName || source;

      // Add to FlutterAI comprehensive intelligence database with unique ID generation
      const intelligenceData = {
        walletAddress: walletAddress.trim(), // Ensure no whitespace issues
        source: `automatic_collection_${source}`,
        collectedBy: 'FlutterAI Auto-Collection Service',
        collectionMethod: 'automatic',
        sourcePlatform,
        socialCreditScore: 0,
        riskLevel: 'unknown',
        tradingBehaviorScore: 0,
        portfolioQualityScore: 0,
        liquidityScore: 0,
        activityScore: 0,
        defiEngagementScore: 0,
        marketingSegment: 'pending_analysis',
        communicationStyle: 'unknown',
        preferredTokenTypes: [],
        riskTolerance: 'moderate',
        investmentProfile: '',
        tradingFrequency: 'unknown',
        portfolioSize: 'unknown',
        influenceScore: 0,
        socialConnections: 0,
        marketingInsights: {
          targetAudience: "pending analysis",
          messagingStrategy: "pending analysis",
          bestContactTimes: [],
          preferredCommunicationChannels: [],
          interests: [],
          behaviorPatterns: [],
          marketingRecommendations: []
        },
        analysisData: {},
        metadata: {
          connectionSource: source,
          firstConnection: new Date().toISOString(),
          userAgent,
          ipAddress,
          connectionCount: 1,
          collectionId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique collection ID
          ...additionalMetadata // Include any additional metadata from API integrations
        }
      };
      
      const newWallet = await storage.createWalletIntelligence(intelligenceData);
      console.log(`✅ Auto-collected NEW wallet for FlutterAI intelligence: ${walletAddress} from ${sourcePlatform}`);

    } catch (error) {
      console.error('Error in automatic wallet collection:', error);
      throw error; // Re-throw to help with debugging
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