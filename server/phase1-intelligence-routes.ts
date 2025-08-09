// PHASE 1: Enhanced Intelligence Routes - Revolutionary 1-1000 Scoring API
// Industry-shattering blockchain wallet intelligence platform

import { Router } from "express";
import { storage } from "./storage";
import { phase1AIEngine } from "./phase1-enhanced-ai-analysis";
import { phase1CrossChainManager } from "./phase1-cross-chain-adapter";

const router = Router();

// PHASE 1: Enhanced Wallet Analysis with 1-1000 Scoring
router.post("/analyze-wallet", async (req, res) => {
  try {
    const { walletAddress, blockchain = "solana", forceRefresh = false } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        error: "Wallet address is required" 
      });
    }

    console.log(`🚀 PHASE 1: Starting enhanced analysis for ${walletAddress} on ${blockchain}`);

    // Check if we have recent analysis (unless force refresh)
    if (!forceRefresh) {
      const existingAnalysis = await storage.getWalletIntelligence(walletAddress, blockchain);
      if (existingAnalysis && existingAnalysis.lastScoreUpdate) {
        const lastUpdate = new Date(existingAnalysis.lastScoreUpdate);
        const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceUpdate < 24) { // Use cached data if less than 24 hours old
          console.log(`✅ PHASE 1: Using cached analysis for ${walletAddress}`);
          return res.json({
            success: true,
            data: existingAnalysis,
            cached: true,
            lastUpdate: existingAnalysis.lastScoreUpdate
          });
        }
      }
    }

    // Perform fresh cross-chain analysis
    const blockchainData = await phase1CrossChainManager.analyzeWalletAcrossChains(
      walletAddress, 
      blockchain
    );

    // Enhanced AI analysis with 1-1000 scoring
    const analysisResult = await phase1AIEngine.analyzeWallet(
      walletAddress,
      blockchain,
      blockchainData
    );

    // Prepare data for storage
    const walletIntelligenceData = {
      walletAddress,
      blockchain,
      network: "mainnet",
      
      // PHASE 1: Revolutionary 1-1000 Scoring System
      overallScore: analysisResult.overallScore,
      scoreGrade: analysisResult.scoreGrade,
      scorePercentile: analysisResult.scorePercentile,
      lastScoreUpdate: new Date(),
      
      // Enhanced scoring components
      socialCreditScore: analysisResult.componentScores.socialCreditScore,
      tradingBehaviorScore: analysisResult.componentScores.tradingBehaviorScore,
      portfolioQualityScore: analysisResult.componentScores.portfolioQualityScore,
      liquidityScore: analysisResult.componentScores.liquidityScore,
      activityScore: analysisResult.componentScores.activityScore,
      defiEngagementScore: analysisResult.componentScores.defiEngagementScore,
      crossChainScore: analysisResult.componentScores.crossChainScore,
      arbitrageDetectionScore: analysisResult.componentScores.arbitrageDetectionScore,
      wealthIndicatorScore: analysisResult.componentScores.wealthIndicatorScore,
      influenceNetworkScore: analysisResult.componentScores.influenceNetworkScore,
      complianceScore: analysisResult.componentScores.complianceScore,
      
      // Cross-chain intelligence
      primaryChain: analysisResult.crossChainIntelligence.primaryChain,
      chainDistribution: analysisResult.crossChainIntelligence.chainDistribution,
      crossChainBehavior: {
        migrationPatterns: analysisResult.crossChainIntelligence.migrationPatterns,
        arbitrageActivity: analysisResult.crossChainIntelligence.arbitrageActivity,
        multiChainStrategies: analysisResult.crossChainIntelligence.multiChainStrategies,
        bridgeUsage: {}
      },
      
      // Marketing intelligence
      marketingSegment: analysisResult.aiInsights.marketingSegment,
      communicationStyle: "technical",
      riskTolerance: "moderate",
      portfolioSize: blockchainData.totalValue > 1000000 ? "whale" : 
                   blockchainData.totalValue > 100000 ? "large" : 
                   blockchainData.totalValue > 10000 ? "medium" : "small",
      
      // Analysis data
      analysisData: {
        blockchainData,
        aiAnalysis: analysisResult.aiInsights,
        calculatedAt: new Date().toISOString(),
        riskFactors: analysisResult.aiInsights.riskFactors,
        behaviorPatterns: analysisResult.aiInsights.behaviorPatterns,
        portfolioAnalysis: {
          totalValue: blockchainData.totalValue,
          transactionCount: blockchainData.transactionCount,
          activeChains: blockchainData.activeChains
        }
      },
      
      sourcePlatform: "FlutterAI_Phase1",
      collectionMethod: "enhanced_ai_analysis"
    };

    // Store the analysis results
    const savedIntelligence = await storage.upsertWalletIntelligence(walletIntelligenceData);

    console.log(`✅ PHASE 1: Enhanced analysis completed for ${walletAddress} - Score: ${analysisResult.overallScore}/1000`);

    res.json({
      success: true,
      data: savedIntelligence,
      analysis: analysisResult,
      cached: false,
      phase1Features: {
        revolutionaryScoring: true,
        crossChainIntelligence: true,
        aiEnhancedAnalysis: true,
        industryShatteringPlatform: true
      }
    });

  } catch (error) {
    console.error("❌ PHASE 1: Enhanced analysis failed:", error);
    res.status(500).json({
      success: false,
      error: "Enhanced analysis failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// PHASE 1: Get Enhanced Dashboard Data
router.get("/dashboard-data", async (req, res) => {
  try {
    const { limit = 50, blockchain, scoreRange } = req.query;

    console.log("🚀 PHASE 1: Fetching enhanced dashboard data");

    // Get wallet intelligence data with filters
    const filters: any = {};
    if (blockchain) filters.blockchain = blockchain;
    if (scoreRange) {
      const [min, max] = String(scoreRange).split("-").map(Number);
      filters.scoreRange = { min, max };
    }

    const walletData = await storage.getWalletIntelligenceList(
      parseInt(String(limit)), 
      0, 
      filters
    );

    // Calculate enhanced statistics
    const stats = await calculatePhase1Statistics(walletData);

    res.json({
      success: true,
      data: {
        wallets: walletData,
        statistics: stats,
        phase1Features: {
          totalWallets: walletData.length,
          averageScore: stats.averageScore,
          topScorers: stats.topScorers,
          crossChainWallets: stats.crossChainWallets,
          supportedBlockchains: phase1CrossChainManager.getSupportedBlockchains()
        }
      }
    });

  } catch (error) {
    console.error("❌ PHASE 1: Dashboard data fetch failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard data",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// PHASE 1: Get Wallet Score Breakdown
router.get("/score-breakdown/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { blockchain = "solana" } = req.query;

    const intelligence = await storage.getWalletIntelligence(walletAddress, blockchain as string);
    
    if (!intelligence) {
      return res.status(404).json({
        success: false,
        error: "Wallet analysis not found"
      });
    }

    const breakdown = {
      overallScore: intelligence.overallScore,
      scoreGrade: intelligence.scoreGrade,
      scorePercentile: intelligence.scorePercentile,
      components: {
        socialCredit: intelligence.socialCreditScore,
        tradingBehavior: intelligence.tradingBehaviorScore,
        portfolioQuality: intelligence.portfolioQualityScore,
        liquidity: intelligence.liquidityScore,
        activity: intelligence.activityScore,
        defiEngagement: intelligence.defiEngagementScore,
        crossChain: intelligence.crossChainScore,
        arbitrageDetection: intelligence.arbitrageDetectionScore,
        wealthIndicator: intelligence.wealthIndicatorScore,
        influenceNetwork: intelligence.influenceNetworkScore,
        compliance: intelligence.complianceScore
      },
      crossChainIntelligence: {
        primaryChain: intelligence.primaryChain,
        chainDistribution: intelligence.chainDistribution,
        crossChainBehavior: intelligence.crossChainBehavior
      }
    };

    res.json({
      success: true,
      data: breakdown,
      lastUpdate: intelligence.lastScoreUpdate
    });

  } catch (error) {
    console.error("❌ PHASE 1: Score breakdown failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get score breakdown",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// PHASE 1: Get Supported Blockchains
router.get("/supported-blockchains", async (req, res) => {
  try {
    const blockchains = phase1CrossChainManager.getSupportedBlockchains();
    
    res.json({
      success: true,
      data: {
        blockchains,
        count: blockchains.length,
        phase1Ready: true,
        crossChainIntelligence: true
      }
    });

  } catch (error) {
    console.error("❌ PHASE 1: Failed to get supported blockchains:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get supported blockchains"
    });
  }
});

// Helper method for calculating Phase 1 statistics
async function calculatePhase1Statistics(walletData: any[]) {
  const totalWallets = walletData.length;
  const totalScore = walletData.reduce((sum, wallet) => sum + (wallet.overallScore || 500), 0);
  const averageScore = totalWallets > 0 ? Math.round(totalScore / totalWallets) : 500;
  
  const topScorers = walletData
    .filter(w => w.overallScore >= 800)
    .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
    .slice(0, 10);
    
  const crossChainWallets = walletData.filter(w => 
    w.crossChainScore > 600 || 
    (w.chainDistribution && Object.keys(w.chainDistribution).length > 1)
  ).length;
  
  return {
    totalWallets,
    averageScore,
    topScorers,
    crossChainWallets,
    scoreDistribution: {
      excellent: walletData.filter(w => w.overallScore >= 800).length,
      good: walletData.filter(w => w.overallScore >= 600 && w.overallScore < 800).length,
      average: walletData.filter(w => w.overallScore >= 400 && w.overallScore < 600).length,
      poor: walletData.filter(w => w.overallScore < 400).length
    }
  };
}

export { router as phase1IntelligenceRoutes };