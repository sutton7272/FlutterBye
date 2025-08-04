/**
 * FlutterAI Group Wallet Analysis API Routes
 */

import { Router } from 'express';
import { flutterAIGroupAnalysisService, type GroupAnalysisFilter } from './flutterai-group-analysis';

const router = Router();

// Get filter templates for group analysis
router.get('/group-analysis/templates', async (req, res) => {
  try {
    const templates = await flutterAIGroupAnalysisService.getFilterTemplates();
    
    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error getting filter templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get filter templates'
    });
  }
});

// Create group analysis
router.post('/group-analysis/create', async (req, res) => {
  try {
    const { filter, analysisName, requestedBy = 'admin' } = req.body;
    
    if (!filter || !analysisName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: filter and analysisName'
      });
    }

    const result = await flutterAIGroupAnalysisService.analyzeWalletGroup(
      filter as GroupAnalysisFilter,
      analysisName,
      requestedBy
    );
    
    res.json({
      success: true,
      analysis: result
    });
  } catch (error) {
    console.error('Error creating group analysis:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create group analysis'
    });
  }
});

// Quick analysis templates
router.post('/group-analysis/quick/:templateName', async (req, res) => {
  try {
    const { templateName } = req.params;
    const { analysisName, requestedBy = 'admin' } = req.body;
    
    const templates = await flutterAIGroupAnalysisService.getFilterTemplates();
    const template = templates.find(t => t.name.toLowerCase().replace(/\s+/g, '_') === templateName.toLowerCase());
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    const result = await flutterAIGroupAnalysisService.analyzeWalletGroup(
      template.filter,
      analysisName || template.name,
      requestedBy
    );
    
    res.json({
      success: true,
      analysis: result,
      template: template.name
    });
  } catch (error) {
    console.error('Error running quick group analysis:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to run quick group analysis'
    });
  }
});

// Preview filtered wallets (without full analysis)
router.post('/group-analysis/preview', async (req, res) => {
  try {
    const { filter } = req.body;
    
    if (!filter) {
      return res.status(400).json({
        success: false,
        error: 'Missing filter criteria'
      });
    }

    // Get filtered wallets but don't run full analysis
    const allWallets = await (await import('./storage')).storage.getAllWalletIntelligence();
    
    // Apply filters (simplified version of the filtering logic)
    const filteredWallets = allWallets.filter(wallet => {
      // Risk level filter
      if (filter.riskLevels && filter.riskLevels.length > 0) {
        if (!filter.riskLevels.includes(wallet.riskLevel)) return false;
      }

      // Marketing segment filter
      if (filter.marketingSegments && filter.marketingSegments.length > 0) {
        if (!filter.marketingSegments.includes(wallet.marketingSegment)) return false;
      }

      // Source platform filter
      if (filter.sourcePlatforms && filter.sourcePlatforms.length > 0) {
        if (!filter.sourcePlatforms.includes(wallet.sourcePlatform)) return false;
      }

      // Portfolio size filter
      if (filter.portfolioSizes && filter.portfolioSizes.length > 0) {
        if (!filter.portfolioSizes.includes(wallet.portfolioSize)) return false;
      }

      return true;
    });
    
    // Calculate basic stats
    const stats = {
      totalWallets: filteredWallets.length,
      riskDistribution: {} as Record<string, number>,
      segmentDistribution: {} as Record<string, number>,
      platformDistribution: {} as Record<string, number>,
      averageScores: {
        socialCreditScore: 0,
        tradingBehaviorScore: 0,
        activityScore: 0
      }
    };

    filteredWallets.forEach(wallet => {
      // Risk distribution
      const risk = wallet.riskLevel || 'unknown';
      stats.riskDistribution[risk] = (stats.riskDistribution[risk] || 0) + 1;

      // Segment distribution
      const segment = wallet.marketingSegment || 'unknown';
      stats.segmentDistribution[segment] = (stats.segmentDistribution[segment] || 0) + 1;

      // Platform distribution
      const platform = wallet.sourcePlatform || 'unknown';
      stats.platformDistribution[platform] = (stats.platformDistribution[platform] || 0) + 1;

      // Average scores
      stats.averageScores.socialCreditScore += (wallet.socialCreditScore || 0);
      stats.averageScores.tradingBehaviorScore += (wallet.tradingBehaviorScore || 0);
      stats.averageScores.activityScore += (wallet.activityScore || 0);
    });

    // Calculate averages
    if (filteredWallets.length > 0) {
      (Object.keys(stats.averageScores) as Array<keyof typeof stats.averageScores>).forEach(key => {
        stats.averageScores[key] = Math.round(stats.averageScores[key] / filteredWallets.length);
      });
    }
    
    res.json({
      success: true,
      preview: {
        walletCount: filteredWallets.length,
        stats,
        sampleWallets: filteredWallets.slice(0, 5).map(w => ({
          walletAddress: w.walletAddress,
          riskLevel: w.riskLevel,
          marketingSegment: w.marketingSegment,
          sourcePlatform: w.sourcePlatform,
          socialCreditScore: w.socialCreditScore
        }))
      }
    });
  } catch (error) {
    console.error('Error previewing group analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to preview group analysis'
    });
  }
});

// Collect wallets from token analysis
router.post('/collect-wallets', async (req, res) => {
  try {
    const { walletAddresses, source, metadata } = req.body;
    
    if (!walletAddresses || !Array.isArray(walletAddresses)) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid walletAddresses array'
      });
    }

    // Import storage and wallet collection service
    const { storage } = await import('./storage');
    const { WalletCollectionService } = await import('./wallet-collection-service');
    const walletService = new WalletCollectionService();
    
    let totalCollected = 0;
    let newWallets = 0;
    let duplicatesSkipped = 0;
    let aiScoringQueued = 0;

    for (const address of walletAddresses) {
      try {
        // Check if wallet already exists
        const existingWallet = await storage.getWalletIntelligence(address);
        
        if (existingWallet) {
          // Update existing wallet with new token analysis source if different
          if (existingWallet.analysisData?.tokenAnalysisSource !== source) {
            await storage.updateWalletScore(address, {
              analysisData: {
                ...existingWallet.analysisData,
                additionalTokenSources: [
                  ...(existingWallet.analysisData?.additionalTokenSources || []),
                  {
                    source,
                    collectionDate: new Date().toISOString(),
                    metadata
                  }
                ],
                lastTokenAnalysisUpdate: new Date().toISOString()
              },
              lastAnalyzed: new Date()
            });
            // Re-queue for analysis to update score based on new token data
            await storage.addToAnalysisQueue(address, 2);
            aiScoringQueued++;
          }
          duplicatesSkipped++;
        } else {
          // Collect new wallet using the wallet collection service
          await walletService.collectWalletFromTokenAnalysis(address, source, metadata);
          newWallets++;
          aiScoringQueued++;
        }
        totalCollected++;
      } catch (error) {
        console.error(`Error processing wallet ${address}:`, error);
        // Continue with other wallets even if one fails
      }
    }

    res.json({
      success: true,
      totalCollected,
      newWallets,
      duplicatesSkipped,
      aiScoringQueued
    });
  } catch (error) {
    console.error('Error collecting wallets:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to collect wallets'
    });
  }
});

// Endpoint for periodic wallet re-analysis
router.post('/schedule-reanalysis', async (req, res) => {
  try {
    console.log('🔄 Scheduling periodic wallet re-analysis');
    
    const { WalletCollectionService } = await import('./wallet-collection-service');
    const walletService = new WalletCollectionService();
    
    const result = await walletService.schedulePeriodicReanalysis();
    
    res.json({
      success: true,
      message: 'Periodic re-analysis scheduled successfully',
      ...result
    });
  } catch (error) {
    console.error('Error scheduling periodic re-analysis:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to schedule re-analysis'
    });
  }
});

export default router;