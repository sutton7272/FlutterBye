/**
 * FlutterAI Intelligence Routes - Revolutionary Social Credit Score System
 * 
 * Comprehensive wallet intelligence and marketing data management
 * Detailed scoring system for targeted marketing, messaging, and communication
 */

import { Request, Response } from "express";
import { storage } from "./storage";
import { FlutterAIWalletScoringService } from "./flutterai-wallet-scoring";
import { flutterAIAutoCollection } from "./flutterai-auto-collection";

const scoringService = new FlutterAIWalletScoringService();

/**
 * Analyze a single wallet and store comprehensive intelligence data
 */
export async function analyzeWallet(req: Request, res: Response) {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    console.log(`🔍 Analyzing wallet: ${walletAddress}`);
    
    // Perform comprehensive scoring analysis
    const analysis = await scoringService.scoreWallet(walletAddress);
    
    // Always try to create new record first (safer approach)
    try {
      const intelligenceData = {
        walletAddress,
        blockchain: 'solana',
        network: 'devnet',
        socialCreditScore: analysis.socialCreditScore,
        riskLevel: analysis.riskLevel,
        tradingBehaviorScore: analysis.tradingBehaviorScore,
        portfolioQualityScore: analysis.portfolioQualityScore,
        liquidityScore: analysis.liquidityScore,
        activityScore: analysis.activityScore,
        defiEngagementScore: analysis.defiEngagementScore,
        marketingSegment: analysis.marketingSegment,
        communicationStyle: analysis.communicationStyle,
        preferredTokenTypes: Array.isArray(analysis.preferredTokenTypes) ? analysis.preferredTokenTypes : [analysis.preferredTokenTypes].filter(Boolean),
        riskTolerance: analysis.riskTolerance,
        investmentProfile: analysis.investmentProfile,
        tradingFrequency: analysis.tradingFrequency,
        portfolioSize: analysis.portfolioSize,
        influenceScore: analysis.influenceScore,
        socialConnections: analysis.socialConnections,
        marketingInsights: analysis.marketingInsights,
        analysisData: analysis.analysisData,
        sourcePlatform: 'manual_analysis',
        collectionMethod: 'ai_scoring',
        lastAnalyzed: new Date()
      };

      // Try to create new record first, fallback to update if exists
      let intelligenceRecord;
      try {
        intelligenceRecord = await storage.createWalletIntelligence(intelligenceData);
        console.log(`✅ Created new wallet intelligence for ${walletAddress}`);
      } catch (createError) {
        console.log(`⚠️ Create failed, trying update for ${walletAddress}`);
        try {
          intelligenceRecord = await storage.updateWalletIntelligence(walletAddress, intelligenceData);
          console.log(`✅ Updated existing wallet intelligence for ${walletAddress}`);
        } catch (updateError) {
          console.error(`❌ Both create and update failed for ${walletAddress}:`, createError, updateError);
          throw new Error("Failed to save wallet intelligence to database");
        }
      }
      
      return res.json({
        success: true,
        message: 'Wallet intelligence saved successfully',
        walletAddress,
        analysis: intelligenceRecord
      });
    } catch (storageError) {
      console.error('Storage error:', storageError);
      return res.json({
        success: true,
        message: 'Analysis completed but storage failed',
        walletAddress,
        analysis: analysis,
        storageError: storageError instanceof Error ? storageError.message : 'Unknown storage error'
      });
    }
    
  } catch (error) {
    console.error('Error analyzing wallet:', error);
    res.status(500).json({ 
      error: "Failed to analyze wallet",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * Get wallet intelligence data for targeted marketing
 */
export async function getWalletIntelligence(req: Request, res: Response) {
  try {
    const { walletAddress } = req.params;
    
    const intelligence = await storage.getWalletIntelligence(walletAddress);
    
    if (!intelligence) {
      return res.status(404).json({ error: "Wallet intelligence not found" });
    }
    
    res.json(intelligence);
  } catch (error) {
    console.error('Error getting wallet intelligence:', error);
    res.status(500).json({ error: "Failed to get wallet intelligence" });
  }
}

/**
 * Get all wallet intelligence with comprehensive filtering for marketing campaigns
 */
export async function getAllWalletIntelligence(req: Request, res: Response) {
  try {
    const {
      minSocialCreditScore,
      maxSocialCreditScore,
      riskLevel,
      marketingSegment,
      portfolioSize,
      limit = 50,
      offset = 0
    } = req.query;
    
    const filters: any = {};
    
    if (minSocialCreditScore) {
      filters.minSocialCreditScore = parseInt(minSocialCreditScore as string);
    }
    if (maxSocialCreditScore) {
      filters.maxSocialCreditScore = parseInt(maxSocialCreditScore as string);
    }
    if (riskLevel) {
      filters.riskLevel = riskLevel as string;
    }
    if (marketingSegment) {
      filters.marketingSegment = marketingSegment as string;
    }
    if (portfolioSize) {
      filters.portfolioSize = portfolioSize as string;
    }
    
    const allIntelligence = await storage.getAllWalletIntelligence(filters);
    console.log(`🔍 Route handler: Retrieved ${allIntelligence.length} records from storage`);
    console.log(`🔍 First record sample:`, allIntelligence[0] ? JSON.stringify(allIntelligence[0], null, 2) : 'No records');
    
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    
    const paginatedResults = allIntelligence.slice(offsetNum, offsetNum + limitNum);
    console.log(`🔍 Pagination: offset=${offsetNum}, limit=${limitNum}, paginated=${paginatedResults.length}`);
    
    const response = {
      data: paginatedResults,
      pagination: {
        total: allIntelligence.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < allIntelligence.length
      }
    };
    
    console.log(`🔍 Final response structure:`, { 
      dataLength: response.data.length, 
      pagination: response.pagination 
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error getting all wallet intelligence:', error);
    res.status(500).json({ error: "Failed to get wallet intelligence data" });
  }
}

/**
 * Comprehensive wallet intelligence statistics for marketing insights
 */
export async function getWalletIntelligenceStats(req: Request, res: Response) {
  try {
    const rawStats = await storage.getWalletIntelligenceStats();
    console.log(`🔍 Stats API: Raw stats from storage:`, rawStats);
    
    // Structure the response to match dashboard expectations
    const stats = {
      stats: {
        totalWallets: rawStats.totalWallets || 0,
        avgSocialCreditScore: rawStats.avgSocialCreditScore || 0,
        bySource: {
          flutterbye_connect: 0,
          perpetrader_connect: 0,
          manual_entry: 0,
          csv_upload: 0
        },
        byRiskLevel: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0
        },
        analysisStats: {
          queued: 0,
          processing: 0,
          completed: rawStats.totalWallets || 0
        }
      },
      topPerformers: rawStats.topPerformers || [],
      highRiskWallets: rawStats.highRiskWallets || [],
      marketingSegmentDistribution: rawStats.marketingSegmentDistribution || {},
      portfolioSizeDistribution: rawStats.portfolioSizeDistribution || {},
      riskDistribution: rawStats.riskDistribution || {}
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting wallet intelligence stats:', error);
    res.status(500).json({ error: "Failed to get wallet intelligence statistics" });
  }
}

/**
 * Batch analyze multiple wallets for comprehensive marketing campaigns
 */
export async function batchAnalyzeWallets(req: Request, res: Response) {
  try {
    const { walletAddresses } = req.body;
    
    if (!Array.isArray(walletAddresses) || walletAddresses.length === 0) {
      return res.status(400).json({ error: "Array of wallet addresses is required" });
    }
    
    if (walletAddresses.length > 100) {
      return res.status(400).json({ error: "Maximum 100 wallet addresses allowed per batch" });
    }
    
    console.log(`🔄 Starting batch analysis of ${walletAddresses.length} wallets`);
    
    const results = await scoringService.batchAnalyzeWallets(walletAddresses);
    
    // Store all successful analyses in the database
    const storedIntelligence = [];
    
    for (const [walletAddress, analysis] of results) {
      if (!analysis.error) {
        try {
          const existingIntelligence = await storage.getWalletIntelligence(walletAddress);
          
          let intelligence;
          if (existingIntelligence) {
            intelligence = await storage.updateWalletIntelligence(walletAddress, {
              ...analysis,
              lastAnalyzed: new Date()
            });
          } else {
            intelligence = await storage.createWalletIntelligence({
              walletAddress,
              ...analysis,
              sourcePlatform: 'FlutterAI',
              collectionMethod: 'batch_analysis'
            });
          }
          
          storedIntelligence.push(intelligence);
        } catch (storageError) {
          console.error(`Error storing intelligence for ${walletAddress}:`, storageError);
        }
      }
    }
    
    // Generate summary using the scoring service
    const summary = scoringService.getRiskSummary(results);
    
    console.log(`✅ Batch analysis complete: ${storedIntelligence.length} wallets analyzed and stored`);
    
    res.json({
      summary,
      results: Object.fromEntries(results),
      storedIntelligence: storedIntelligence.length,
      totalProcessed: walletAddresses.length
    });
  } catch (error) {
    console.error('Error in batch wallet analysis:', error);
    res.status(500).json({ 
      error: "Failed to batch analyze wallets",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * Get marketing recommendations for a specific wallet
 */
export async function getMarketingRecommendations(req: Request, res: Response) {
  try {
    const { walletAddress } = req.params;
    
    const intelligence = await storage.getWalletIntelligence(walletAddress);
    
    if (!intelligence) {
      return res.status(404).json({ error: "Wallet intelligence not found" });
    }
    
    // Extract marketing-specific insights
    const marketingProfile = {
      walletAddress,
      socialCreditScore: intelligence.socialCreditScore,
      marketingSegment: intelligence.marketingSegment,
      communicationStyle: intelligence.communicationStyle,
      riskTolerance: intelligence.riskTolerance,
      portfolioSize: intelligence.portfolioSize,
      influenceScore: intelligence.influenceScore,
      marketingInsights: intelligence.marketingInsights,
      recommendations: {
        targetAudience: intelligence.marketingInsights?.targetAudience || 'general audience',
        messagingStrategy: intelligence.marketingInsights?.messagingStrategy || 'educational approach',
        bestContactTimes: intelligence.marketingInsights?.bestContactTimes || ['evening'],
        preferredChannels: intelligence.marketingInsights?.preferredCommunicationChannels || ['email'],
        interests: intelligence.marketingInsights?.interests || ['crypto'],
        behaviorPatterns: intelligence.marketingInsights?.behaviorPatterns || ['moderate activity'],
        marketingActions: intelligence.marketingInsights?.marketingRecommendations || ['standard outreach']
      }
    };
    
    res.json(marketingProfile);
  } catch (error) {
    console.error('Error getting marketing recommendations:', error);
    res.status(500).json({ error: "Failed to get marketing recommendations" });
  }
}

/**
 * Delete wallet intelligence data
 */
export async function deleteWalletIntelligence(req: Request, res: Response) {
  try {
    const { walletAddress } = req.params;
    
    const deleted = await storage.deleteWalletIntelligence(walletAddress);
    
    if (!deleted) {
      return res.status(404).json({ error: "Wallet intelligence not found" });
    }
    
    res.json({ message: "Wallet intelligence deleted successfully" });
  } catch (error) {
    console.error('Error deleting wallet intelligence:', error);
    res.status(500).json({ error: "Failed to delete wallet intelligence" });
  }
}

/**
 * Get auto-collection statistics
 */
export async function getAutoCollectionStats(req: Request, res: Response) {
  try {
    const stats = await flutterAIAutoCollection.getCollectionStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting auto-collection stats:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to get auto-collection statistics" 
    });
  }
}

/**
 * Manually trigger wallet collection for testing
 */
export async function triggerWalletCollection(req: Request, res: Response) {
  try {
    const { walletAddress, source = 'manual_test' } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }
    
    await flutterAIAutoCollection.collectWalletOnAuthentication(
      walletAddress,
      source as 'flutterbye' | 'perpetrader',
      req.get('User-Agent') || 'Unknown',
      req.ip || 'Unknown'
    );
    
    res.json({
      success: true,
      message: `Wallet ${walletAddress} collected successfully`,
      source
    });
  } catch (error) {
    console.error('Error triggering wallet collection:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to trigger wallet collection" 
    });
  }
}

/**
 * Download entire wallet intelligence database as CSV
 */
export async function downloadWalletIntelligenceCSV(req: Request, res: Response) {
  try {
    console.log('📥 Starting CSV download of wallet intelligence database');
    
    // Get all wallet intelligence data
    const allWallets = await storage.getAllWalletIntelligence();
    
    if (allWallets.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No wallet data found in database'
      });
    }

    // Define CSV headers
    const csvHeaders = [
      'Wallet Address',
      'Blockchain',
      'Network',
      'Social Credit Score',
      'Risk Level',
      'Trading Behavior Score',
      'Portfolio Quality Score',
      'Liquidity Score',
      'Activity Score',
      'DeFi Engagement Score',
      'Marketing Segment',
      'Communication Style',
      'Preferred Token Types',
      'Risk Tolerance',
      'Investment Profile',
      'Trading Frequency',
      'Portfolio Size',
      'Influence Score',
      'Social Connections',
      'Source Platform',
      'Collection Method',
      'Created At',
      'Last Analyzed',
      'Target Audience',
      'Messaging Strategy',
      'Best Contact Times',
      'Preferred Channels',
      'Interests',
      'Behavior Patterns'
    ].join(',');

    // Convert wallet data to CSV rows
    const csvRows = allWallets.map(wallet => {
      const marketingInsights = wallet.marketingInsights || {};
      const preferredTokenTypes = Array.isArray(wallet.preferredTokenTypes) 
        ? wallet.preferredTokenTypes.join(';') 
        : (wallet.preferredTokenTypes || '');
      
      return [
        `"${wallet.walletAddress || ''}"`,
        `"${wallet.blockchain || ''}"`,
        `"${wallet.network || ''}"`,
        wallet.socialCreditScore || 0,
        `"${wallet.riskLevel || ''}"`,
        wallet.tradingBehaviorScore || 0,
        wallet.portfolioQualityScore || 0,
        wallet.liquidityScore || 0,
        wallet.activityScore || 0,
        wallet.defiEngagementScore || 0,
        `"${wallet.marketingSegment || ''}"`,
        `"${wallet.communicationStyle || ''}"`,
        `"${preferredTokenTypes}"`,
        `"${wallet.riskTolerance || ''}"`,
        `"${wallet.investmentProfile || ''}"`,
        `"${wallet.tradingFrequency || ''}"`,
        `"${wallet.portfolioSize || ''}"`,
        wallet.influenceScore || 0,
        wallet.socialConnections || 0,
        `"${wallet.sourcePlatform || ''}"`,
        `"${wallet.collectionMethod || ''}"`,
        `"${wallet.createdAt || ''}"`,
        `"${wallet.lastAnalyzed || ''}"`,
        `"${marketingInsights.targetAudience || ''}"`,
        `"${marketingInsights.messagingStrategy || ''}"`,
        `"${Array.isArray(marketingInsights.bestContactTimes) ? marketingInsights.bestContactTimes.join(';') : (marketingInsights.bestContactTimes || '')}"`,
        `"${Array.isArray(marketingInsights.preferredCommunicationChannels) ? marketingInsights.preferredCommunicationChannels.join(';') : (marketingInsights.preferredCommunicationChannels || '')}"`,
        `"${Array.isArray(marketingInsights.interests) ? marketingInsights.interests.join(';') : (marketingInsights.interests || '')}"`,
        `"${Array.isArray(marketingInsights.behaviorPatterns) ? marketingInsights.behaviorPatterns.join(';') : (marketingInsights.behaviorPatterns || '')}"`,
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [csvHeaders, ...csvRows].join('\n');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `flutterbye-wallet-intelligence-${timestamp}.csv`;

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(csvContent));

    console.log(`📥 CSV download complete: ${allWallets.length} wallets exported to ${filename}`);
    
    // Send CSV content
    res.send(csvContent);
    
  } catch (error) {
    console.error('Error generating CSV download:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate CSV download',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}