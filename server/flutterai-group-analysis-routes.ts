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
      error: error.message || 'Failed to create group analysis'
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
      error: error.message || 'Failed to run quick group analysis'
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
      riskDistribution: {},
      segmentDistribution: {},
      platformDistribution: {},
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
      Object.keys(stats.averageScores).forEach(key => {
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

export default router;