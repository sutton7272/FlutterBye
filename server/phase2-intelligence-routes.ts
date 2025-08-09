// PHASE 2: Advanced Intelligence Routes - Enhanced Cross-Chain AI Analysis
// Next-generation wallet intelligence with behavioral insights and portfolio analysis

import { Router } from "express";
import { storage } from "./storage";
import { phase2AdvancedIntelligence, calculatePhase2Statistics } from "./phase2-advanced-intelligence";

const router = Router();

// PHASE 2: Enhanced Wallet Analysis with Advanced AI
router.post("/analyze-advanced", async (req, res) => {
  try {
    const { walletAddress, blockchain = "solana", includeMarketingInsights = false } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: "Wallet address is required"
      });
    }
    
    console.log(`🚀 PHASE 2: Advanced analysis initiated for ${walletAddress} on ${blockchain}`);
    
    // Phase 2 enhanced analysis
    const advancedScoring = await phase2AdvancedIntelligence.enhancedWalletAnalysis(walletAddress, blockchain);
    
    // Generate marketing insights if requested
    let marketingIntelligence = null;
    if (includeMarketingInsights) {
      try {
        marketingIntelligence = await phase2AdvancedIntelligence.generateMarketingIntelligence(walletAddress);
      } catch (error) {
        console.error("⚠️ Marketing intelligence generation failed:", error);
      }
    }
    
    // Store enhanced results
    const enhancedIntelligence = {
      walletAddress,
      blockchain,
      overallScore: advancedScoring.overallScore,
      scoreGrade: getPhase2ScoreGrade(advancedScoring.overallScore),
      scorePercentile: calculateScorePercentile(advancedScoring.overallScore),
      
      // Phase 1 scores
      socialCreditScore: advancedScoring.socialCreditScore,
      tradingBehaviorScore: advancedScoring.tradingBehaviorScore,
      portfolioQualityScore: advancedScoring.portfolioQualityScore,
      liquidityScore: advancedScoring.liquidityScore,
      activityScore: advancedScoring.activityScore,
      defiEngagementScore: advancedScoring.defiEngagementScore,
      
      // PHASE 2: Enhanced scores
      crossChainScore: advancedScoring.crossChainMasteryScore,
      arbitrageDetectionScore: advancedScoring.arbitrageDetectionScore,
      wealthIndicatorScore: advancedScoring.wealthIndicatorScore,
      influenceNetworkScore: advancedScoring.influenceNetworkScore,
      complianceScore: advancedScoring.complianceScore,
      innovationScore: advancedScoring.innovationScore,
      riskManagementScore: advancedScoring.riskManagementScore,
      marketTimingScore: advancedScoring.marketTimingScore,
      
      // AI-Enhanced behavioral metrics
      tradingPatternComplexity: advancedScoring.tradingPatternComplexity,
      strategicThinking: advancedScoring.strategicThinking,
      adaptabilityScore: advancedScoring.adaptabilityScore,
      leadershipInfluence: advancedScoring.leadershipInfluence,
      
      // Metadata
      analysisStatus: 'phase2_complete',
      riskLevel: getRiskLevel(advancedScoring),
      marketingSegment: getMarketingSegment(advancedScoring),
      lastScoreUpdate: new Date(),
      tags: generateAITags(advancedScoring),
      notes: generateAIInsights(advancedScoring)
    };
    
    // Upsert enhanced intelligence
    const savedIntelligence = await storage.upsertWalletIntelligence(enhancedIntelligence);
    
    res.json({
      success: true,
      phase: 2,
      data: {
        walletIntelligence: savedIntelligence,
        advancedScoring,
        marketingIntelligence,
        analysis: {
          scoreBreakdown: getPhase2ScoreBreakdown(advancedScoring),
          behavioralProfile: getBehavioralProfile(advancedScoring),
          riskAssessment: getRiskAssessment(advancedScoring),
          recommendations: getPhase2Recommendations(advancedScoring)
        }
      },
      metadata: {
        analysisVersion: "2.0",
        aiPowered: true,
        crossChainEnabled: true,
        behavioralInsights: true,
        revolutionaryScoring: true
      }
    });
    
  } catch (error) {
    console.error("❌ PHASE 2: Advanced analysis failed:", error);
    res.status(500).json({
      success: false,
      error: "Phase 2 advanced analysis failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// PHASE 2: Enhanced Dashboard Data with Advanced Metrics
router.get("/advanced-dashboard", async (req, res) => {
  try {
    const { blockchain = "all", scoreRange = "all", behaviorType = "all", limit = 50, offset = 0 } = req.query;
    
    console.log(`📊 PHASE 2: Fetching advanced dashboard data - ${blockchain}, ${scoreRange}, ${behaviorType}`);
    
    // Enhanced filters for Phase 2
    const filters: any = {};
    if (blockchain !== "all") filters.blockchain = blockchain;
    if (scoreRange !== "all") {
      const ranges = {
        "900-1000": { min: 900, max: 1000 },
        "800-899": { min: 800, max: 899 },
        "700-799": { min: 700, max: 799 },
        "600-699": { min: 600, max: 699 },
        "500-599": { min: 500, max: 599 },
        "400-499": { min: 400, max: 499 },
        "1-399": { min: 1, max: 399 }
      };
      if (ranges[scoreRange as string]) {
        filters.scoreRange = ranges[scoreRange as string];
      }
    }
    
    // Fetch enhanced wallet data
    const wallets = await storage.getWalletIntelligenceList(
      Number(limit),
      Number(offset),
      filters
    );
    
    // Calculate Phase 2 enhanced statistics
    const phase2Statistics = await calculatePhase2Statistics(wallets);
    
    res.json({
      success: true,
      phase: 2,
      data: {
        wallets: wallets.map(wallet => ({
          ...wallet,
          phase2Enhanced: true,
          behavioralProfile: getBehavioralProfile(wallet),
          riskProfile: getRiskAssessment(wallet)
        })),
        statistics: phase2Statistics,
        metadata: {
          totalWallets: wallets.length,
          blockchain: blockchain,
          scoreRange: scoreRange,
          behaviorType: behaviorType,
          enhancedAnalysis: true
        }
      }
    });
    
  } catch (error) {
    console.error("❌ PHASE 2: Advanced dashboard failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch advanced dashboard data",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// PHASE 2: Batch Analysis with Advanced AI
router.post("/batch-analyze-advanced", async (req, res) => {
  try {
    const { walletAddresses, blockchain = "solana", priority = 1 } = req.body;
    
    if (!Array.isArray(walletAddresses) || walletAddresses.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Array of wallet addresses is required"
      });
    }
    
    if (walletAddresses.length > 100) {
      return res.status(400).json({
        success: false,
        error: "Maximum 100 wallets per batch"
      });
    }
    
    console.log(`🚀 PHASE 2: Batch advanced analysis for ${walletAddresses.length} wallets`);
    
    // Create batch record
    const batchId = Date.now().toString();
    const batch = await storage.createWalletBatch({
      name: `Phase2_Batch_${batchId}`,
      description: `Advanced AI analysis batch for ${walletAddresses.length} wallets`,
      walletAddresses: walletAddresses,
      status: 'processing',
      totalWallets: walletAddresses.length,
      processedWallets: 0,
      failedWallets: 0,
      requestedBy: 'phase2_api',
      priority: priority
    });
    
    // Queue wallets for analysis
    const queuePromises = walletAddresses.map(address => 
      storage.addToAnalysisQueue(address, priority, batch.id, 'phase2_batch')
    );
    
    await Promise.all(queuePromises);
    
    res.json({
      success: true,
      phase: 2,
      data: {
        batchId: batch.id,
        totalWallets: walletAddresses.length,
        status: 'queued',
        estimatedCompletionTime: `${Math.ceil(walletAddresses.length / 10)} minutes`,
        advancedAnalysis: true
      }
    });
    
  } catch (error) {
    console.error("❌ PHASE 2: Batch analysis failed:", error);
    res.status(500).json({
      success: false,
      error: "Phase 2 batch analysis failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// PHASE 2: Advanced Score Breakdown with AI Insights
router.get("/advanced-score-breakdown/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { blockchain = "solana" } = req.query;
    
    const intelligence = await storage.getWalletIntelligence(walletAddress, blockchain as string);
    
    if (!intelligence) {
      return res.status(404).json({
        success: false,
        error: "Wallet intelligence not found",
        recommendation: "Run Phase 2 advanced analysis first"
      });
    }
    
    const advancedBreakdown = {
      // Core Phase 2 metrics
      overallScore: intelligence.overallScore || 500,
      scoreGrade: getPhase2ScoreGrade(intelligence.overallScore || 500),
      scorePercentile: calculateScorePercentile(intelligence.overallScore || 500),
      
      // Enhanced scoring categories
      coreScores: {
        social: intelligence.socialCreditScore || 50,
        trading: intelligence.tradingBehaviorScore || 50,
        portfolio: intelligence.portfolioQualityScore || 50,
        liquidity: intelligence.liquidityScore || 50,
        activity: intelligence.activityScore || 50,
        defi: intelligence.defiEngagementScore || 50
      },
      
      // PHASE 2: Advanced categories
      advancedScores: {
        crossChain: intelligence.crossChainScore || 50,
        arbitrage: intelligence.arbitrageDetectionScore || 30,
        wealth: intelligence.wealthIndicatorScore || 50,
        influence: intelligence.influenceNetworkScore || 25,
        compliance: intelligence.complianceScore || 75,
        innovation: intelligence.innovationScore || 40,
        riskManagement: intelligence.riskManagementScore || 50,
        marketTiming: intelligence.marketTimingScore || 45
      },
      
      // AI-Enhanced behavioral metrics
      behavioralScores: {
        complexity: intelligence.tradingPatternComplexity || 35,
        strategic: intelligence.strategicThinking || 40,
        adaptability: intelligence.adaptabilityScore || 45,
        leadership: intelligence.leadershipInfluence || 30
      },
      
      // Analysis insights
      insights: {
        strengthAreas: getStrengthAreas(intelligence),
        improvementAreas: getImprovementAreas(intelligence),
        riskFactors: getRiskFactors(intelligence),
        opportunities: getOpportunities(intelligence)
      }
    };
    
    res.json({
      success: true,
      phase: 2,
      data: advancedBreakdown,
      lastUpdate: intelligence.lastScoreUpdate
    });
    
  } catch (error) {
    console.error("❌ PHASE 2: Advanced score breakdown failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get advanced score breakdown",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// PHASE 2: AI-Powered Market Intelligence
router.get("/market-intelligence/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    console.log(`🎯 PHASE 2: Generating market intelligence for ${walletAddress}`);
    
    const marketingIntelligence = await phase2AdvancedIntelligence.generateMarketingIntelligence(walletAddress);
    
    res.json({
      success: true,
      phase: 2,
      data: marketingIntelligence,
      generated: new Date()
    });
    
  } catch (error) {
    console.error("❌ PHASE 2: Market intelligence failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate market intelligence",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// PHASE 2: Supported Features and Capabilities
router.get("/capabilities", async (req, res) => {
  res.json({
    success: true,
    phase: 2,
    capabilities: {
      aiPowered: true,
      crossChainAnalysis: true,
      behavioralInsights: true,
      marketingIntelligence: true,
      riskAssessment: true,
      portfolioAnalysis: true,
      scoringRange: "1-1000",
      supportedBlockchains: [
        "solana", "ethereum", "bitcoin", "polygon", 
        "bsc", "arbitrum", "avalanche", "base"
      ],
      analysisTypes: [
        "enhanced_scoring", "behavioral_analysis", "cross_chain_intelligence",
        "portfolio_strategy", "marketing_segmentation", "risk_assessment"
      ],
      features: {
        advancedAI: "GPT-4o powered analysis",
        crossChainMastery: "Multi-blockchain intelligence",
        behavioralProfiling: "AI-driven personality assessment",
        marketingTargeting: "Precision audience segmentation",
        riskScoring: "Advanced compliance assessment",
        portfolioIntelligence: "Strategy analysis and optimization"
      }
    }
  });
});

// Helper functions for Phase 2 enhancements

function getPhase2ScoreGrade(score: number): string {
  if (score >= 900) return "S+ Elite";
  if (score >= 850) return "S Advanced";
  if (score >= 800) return "A+ Excellent";
  if (score >= 750) return "A Good";
  if (score >= 700) return "B+ Above Average";
  if (score >= 650) return "B Average";
  if (score >= 600) return "B- Below Average";
  if (score >= 500) return "C+ Fair";
  if (score >= 400) return "C Poor";
  return "D Needs Improvement";
}

function calculateScorePercentile(score: number): number {
  // Simplified percentile calculation
  return Math.min(100, Math.round((score / 1000) * 100));
}

function getRiskLevel(scoring: any): string {
  const complianceScore = scoring.complianceScore || 75;
  const riskManagementScore = scoring.riskManagementScore || 50;
  
  const avgRisk = (complianceScore + riskManagementScore) / 2;
  
  if (avgRisk >= 80) return "low";
  if (avgRisk >= 60) return "medium";
  return "high";
}

function getMarketingSegment(scoring: any): string {
  const overallScore = scoring.overallScore || 500;
  const crossChainScore = scoring.crossChainMasteryScore || 50;
  const wealthScore = scoring.wealthIndicatorScore || 50;
  
  if (overallScore > 850 || wealthScore > 90) return "whale_investor";
  if (overallScore > 700 || crossChainScore > 80) return "advanced_trader";
  if (crossChainScore > 70) return "defi_power_user";
  return "retail_investor";
}

function generateAITags(scoring: any): string[] {
  const tags = [];
  
  if (scoring.crossChainMasteryScore > 80) tags.push("cross_chain_expert");
  if (scoring.arbitrageDetectionScore > 70) tags.push("arbitrage_trader");
  if (scoring.innovationScore > 80) tags.push("early_adopter");
  if (scoring.leadershipInfluence > 75) tags.push("community_leader");
  if (scoring.wealthIndicatorScore > 85) tags.push("high_net_worth");
  if (scoring.complianceScore > 90) tags.push("compliant_user");
  
  return tags;
}

function generateAIInsights(scoring: any): string {
  const insights = [];
  
  if (scoring.overallScore > 800) {
    insights.push("Exceptional wallet performance with advanced trading capabilities");
  }
  
  if (scoring.crossChainMasteryScore > 80) {
    insights.push("Strong cross-chain expertise and multi-blockchain engagement");
  }
  
  if (scoring.innovationScore > 75) {
    insights.push("Early adoption patterns and innovative protocol usage");
  }
  
  return insights.join(". ");
}

function getPhase2ScoreBreakdown(scoring: any): any {
  return {
    excellent: scoring.overallScore >= 800 ? 1 : 0,
    good: scoring.overallScore >= 600 && scoring.overallScore < 800 ? 1 : 0,
    average: scoring.overallScore >= 400 && scoring.overallScore < 600 ? 1 : 0,
    poor: scoring.overallScore < 400 ? 1 : 0
  };
}

function getBehavioralProfile(scoring: any): any {
  return {
    tradingStyle: scoring.tradingPatternComplexity > 70 ? "sophisticated" : "basic",
    riskTolerance: scoring.riskManagementScore > 70 ? "high" : "medium",
    innovationLevel: scoring.innovationScore > 75 ? "early_adopter" : "mainstream"
  };
}

function getRiskAssessment(scoring: any): any {
  return {
    overallRisk: getRiskLevel(scoring),
    complianceRisk: scoring.complianceScore < 70 ? "high" : "low",
    liquidityRisk: scoring.liquidityScore < 50 ? "high" : "low"
  };
}

function getPhase2Recommendations(scoring: any): string[] {
  const recommendations = [];
  
  if (scoring.crossChainMasteryScore < 50) {
    recommendations.push("Consider diversifying across multiple blockchains");
  }
  
  if (scoring.riskManagementScore < 60) {
    recommendations.push("Implement better risk management strategies");
  }
  
  if (scoring.innovationScore > 80) {
    recommendations.push("Excellent early adoption - continue exploring new protocols");
  }
  
  return recommendations;
}

function getStrengthAreas(intelligence: any): string[] {
  const strengths = [];
  
  if ((intelligence.crossChainScore || 50) > 70) strengths.push("Cross-chain expertise");
  if ((intelligence.innovationScore || 40) > 70) strengths.push("Innovation adoption");
  if ((intelligence.complianceScore || 75) > 80) strengths.push("Regulatory compliance");
  if ((intelligence.leadershipInfluence || 30) > 60) strengths.push("Community influence");
  
  return strengths;
}

function getImprovementAreas(intelligence: any): string[] {
  const improvements = [];
  
  if ((intelligence.riskManagementScore || 50) < 50) improvements.push("Risk management");
  if ((intelligence.liquidityScore || 50) < 50) improvements.push("Liquidity optimization");
  if ((intelligence.tradingBehaviorScore || 50) < 50) improvements.push("Trading strategy");
  
  return improvements;
}

function getRiskFactors(intelligence: any): string[] {
  const risks = [];
  
  if ((intelligence.complianceScore || 75) < 60) risks.push("Compliance concerns");
  if ((intelligence.arbitrageDetectionScore || 30) > 80) risks.push("High-frequency trading");
  if ((intelligence.riskManagementScore || 50) < 40) risks.push("Poor risk controls");
  
  return risks;
}

function getOpportunities(intelligence: any): string[] {
  const opportunities = [];
  
  if ((intelligence.crossChainScore || 50) > 70) opportunities.push("Cross-chain arbitrage");
  if ((intelligence.innovationScore || 40) > 60) opportunities.push("Early protocol adoption");
  if ((intelligence.wealthIndicatorScore || 50) > 80) opportunities.push("Premium services");
  
  return opportunities;
}

export { router as phase2IntelligenceRoutes };