import { openaiService } from "./openai-service";

/**
 * FlutterAI Wallet Scoring Service
 * Advanced AI-powered Social Credit Score system for Solana wallet addresses
 * 
 * This service analyzes wallet behavior, trading patterns, portfolio quality,
 * and blockchain activity to generate comprehensive intelligence scores.
 */
export class FlutterAIWalletScoringService {
  
  constructor() {
    console.log('🧠 FlutterAI Wallet Scoring Service initialized');
  }

  /**
   * Comprehensive wallet analysis and scoring
   */
  async scoreWallet(walletAddress: string): Promise<{
    socialCreditScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
    tradingBehaviorScore: number;
    portfolioQualityScore: number;
    liquidityScore: number;
    activityScore: number;
    analysisData: any;
  }> {
    try {
      console.log(`🔍 Analyzing wallet: ${walletAddress}`);
      
      // Step 1: Gather blockchain data
      const blockchainData = await this.gatherBlockchainData(walletAddress);
      
      // Step 2: AI-powered analysis
      const aiAnalysis = await this.performAIAnalysis(walletAddress, blockchainData);
      
      // Step 3: Calculate scores
      const scores = this.calculateScores(blockchainData, aiAnalysis);
      
      console.log(`✅ Wallet analysis complete: ${walletAddress} - Score: ${scores.socialCreditScore}`);
      
      return scores;
    } catch (error) {
      console.error(`❌ Error analyzing wallet ${walletAddress}:`, error);
      
      // Return default unknown scores on error
      return {
        socialCreditScore: 0,
        riskLevel: 'unknown',
        tradingBehaviorScore: 0,
        portfolioQualityScore: 0,
        liquidityScore: 0,
        activityScore: 0,
        analysisData: {
          error: error instanceof Error ? error.message : 'Analysis failed',
          analyzedAt: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Gather comprehensive blockchain data for analysis
   */
  private async gatherBlockchainData(walletAddress: string): Promise<any> {
    try {
      // For now, return simulated data since we don't have Helius/RPC integration
      // In production, this would call actual Solana RPC endpoints
      
      const mockData = {
        balance: Math.random() * 100, // SOL balance
        tokenCount: Math.floor(Math.random() * 50) + 1,
        nftCount: Math.floor(Math.random() * 20),
        transactionHistory: {
          totalTransactions: Math.floor(Math.random() * 1000) + 10,
          last30Days: Math.floor(Math.random() * 100) + 1,
          avgTransactionSize: Math.random() * 10,
          successRate: 0.95 + Math.random() * 0.05,
        },
        topTokens: [
          { symbol: 'SOL', balance: Math.random() * 50 },
          { symbol: 'USDC', balance: Math.random() * 1000 },
          { symbol: 'BONK', balance: Math.random() * 1000000 },
        ],
        deFiActivity: {
          staking: Math.random() > 0.5,
          lending: Math.random() > 0.7,
          swapping: Math.random() > 0.3,
        },
        riskFactors: [],
        accountAge: Math.floor(Math.random() * 365) + 30, // Days
        walletAddress,
        analyzedAt: new Date().toISOString(),
      };

      // Add risk factors based on patterns
      if (mockData.balance < 0.1) {
        mockData.riskFactors.push('Very low SOL balance');
      }
      if (mockData.transactionHistory.totalTransactions < 5) {
        mockData.riskFactors.push('Very few transactions');
      }
      if (mockData.accountAge < 7) {
        mockData.riskFactors.push('Very new account');
      }

      return mockData;
    } catch (error) {
      console.error('Error gathering blockchain data:', error);
      throw error;
    }
  }

  /**
   * Use AI to analyze wallet patterns and behavior
   */
  private async performAIAnalysis(walletAddress: string, blockchainData: any): Promise<any> {
    try {
      const analysisPrompt = `
        Analyze this Solana wallet for social credit scoring and risk assessment:
        
        Wallet: ${walletAddress}
        Balance: ${blockchainData.balance} SOL
        Token Count: ${blockchainData.tokenCount}
        NFT Count: ${blockchainData.nftCount}
        Total Transactions: ${blockchainData.transactionHistory.totalTransactions}
        Recent Activity (30d): ${blockchainData.transactionHistory.last30Days} transactions
        Average Transaction Size: ${blockchainData.avgTransactionSize} SOL
        Success Rate: ${(blockchainData.transactionHistory.successRate * 100).toFixed(1)}%
        Account Age: ${blockchainData.accountAge} days
        DeFi Activity: ${Object.entries(blockchainData.deFiActivity).filter(([_, active]) => active).map(([activity]) => activity).join(', ') || 'None'}
        Risk Factors: ${blockchainData.riskFactors.join(', ') || 'None identified'}
        
        Provide a JSON analysis with:
        {
          "behaviorPattern": "description of trading/usage patterns",
          "riskAssessment": "low/medium/high/critical with reasoning",
          "portfolioQuality": "assessment of token diversity and quality",
          "activityLevel": "description of account activity",
          "socialSignals": "community engagement indicators",
          "recommendations": ["list of recommendations"],
          "confidenceScore": 0.85
        }
      `;

      const aiResponse = await openaiService.generateResponse(analysisPrompt);
      
      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        console.warn('AI response not valid JSON, using fallback analysis');
        return {
          behaviorPattern: "Standard retail trading pattern",
          riskAssessment: blockchainData.riskFactors.length > 2 ? "high" : "medium",
          portfolioQuality: blockchainData.tokenCount > 10 ? "diversified" : "concentrated",
          activityLevel: blockchainData.transactionHistory.totalTransactions > 100 ? "active" : "moderate",
          socialSignals: "Limited social engagement data",
          recommendations: ["Increase portfolio diversification", "Maintain regular activity"],
          confidenceScore: 0.7,
        };
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      
      // Fallback analysis without AI
      return {
        behaviorPattern: "Unable to determine pattern",
        riskAssessment: "unknown",
        portfolioQuality: "insufficient data",
        activityLevel: "unknown",
        socialSignals: "No data available",
        recommendations: ["Gather more transaction data"],
        confidenceScore: 0.3,
      };
    }
  }

  /**
   * Calculate numerical scores based on data and AI analysis
   */
  private calculateScores(blockchainData: any, aiAnalysis: any): any {
    // Trading Behavior Score (0-100)
    let tradingScore = 0;
    if (blockchainData.transactionHistory.totalTransactions > 0) {
      tradingScore += Math.min(blockchainData.transactionHistory.totalTransactions / 10, 30); // Max 30 for volume
      tradingScore += Math.min(blockchainData.transactionHistory.successRate * 40, 40); // Max 40 for success rate
      tradingScore += Math.min(blockchainData.transactionHistory.last30Days * 2, 30); // Max 30 for recent activity
    }

    // Portfolio Quality Score (0-100)
    let portfolioScore = 0;
    portfolioScore += Math.min(blockchainData.tokenCount * 3, 40); // Max 40 for diversity
    portfolioScore += Math.min(blockchainData.balance * 10, 30); // Max 30 for SOL holdings
    portfolioScore += blockchainData.nftCount > 0 ? 15 : 0; // 15 for NFT holdings
    portfolioScore += Object.values(blockchainData.deFiActivity).filter(Boolean).length * 5; // 5 per DeFi activity

    // Liquidity Score (0-100)
    let liquidityScore = 0;
    liquidityScore += Math.min(blockchainData.balance * 20, 50); // SOL liquidity
    liquidityScore += blockchainData.topTokens.reduce((acc: number, token: any) => {
      if (token.symbol === 'USDC') return acc + Math.min(token.balance / 10, 30);
      return acc + Math.min(token.balance / 100, 10);
    }, 0);

    // Activity Score (0-100)
    let activityScore = 0;
    activityScore += Math.min(blockchainData.transactionHistory.totalTransactions / 5, 40);
    activityScore += Math.min(blockchainData.transactionHistory.last30Days * 3, 30);
    activityScore += Math.max(0, 30 - blockchainData.accountAge / 30); // Newer accounts get points

    // Risk Level Assessment
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'unknown' = 'unknown';
    const riskFactorCount = blockchainData.riskFactors.length;
    
    if (aiAnalysis.riskAssessment) {
      riskLevel = aiAnalysis.riskAssessment.toLowerCase() as any;
    } else if (riskFactorCount === 0 && tradingScore > 70) {
      riskLevel = 'low';
    } else if (riskFactorCount <= 1 && tradingScore > 50) {
      riskLevel = 'medium';
    } else if (riskFactorCount >= 3 || tradingScore < 30) {
      riskLevel = 'critical';
    } else {
      riskLevel = 'high';
    }

    // Social Credit Score (0-1000)
    let socialCreditScore = 0;
    socialCreditScore += tradingScore * 3; // Trading behavior worth 300 points
    socialCreditScore += portfolioScore * 2.5; // Portfolio quality worth 250 points
    socialCreditScore += liquidityScore * 2; // Liquidity worth 200 points
    socialCreditScore += activityScore * 2.5; // Activity worth 250 points

    // Apply risk penalties
    switch (riskLevel) {
      case 'critical':
        socialCreditScore *= 0.3; // 70% penalty
        break;
      case 'high':
        socialCreditScore *= 0.6; // 40% penalty
        break;
      case 'medium':
        socialCreditScore *= 0.8; // 20% penalty
        break;
      case 'low':
        socialCreditScore *= 1.1; // 10% bonus
        break;
    }

    // Apply AI confidence multiplier
    if (aiAnalysis.confidenceScore) {
      socialCreditScore *= aiAnalysis.confidenceScore;
    }

    return {
      socialCreditScore: Math.round(Math.min(socialCreditScore, 1000)),
      riskLevel,
      tradingBehaviorScore: Math.round(tradingScore),
      portfolioQualityScore: Math.round(portfolioScore),
      liquidityScore: Math.round(liquidityScore),
      activityScore: Math.round(activityScore),
      analysisData: {
        blockchainData,
        aiAnalysis,
        calculatedAt: new Date().toISOString(),
        riskFactors: blockchainData.riskFactors,
        behaviorPatterns: {
          tradingVolume: blockchainData.transactionHistory.totalTransactions,
          recentActivity: blockchainData.transactionHistory.last30Days,
          portfolioDiversity: blockchainData.tokenCount,
          defiEngagement: Object.values(blockchainData.deFiActivity).filter(Boolean).length,
        },
        portfolioAnalysis: {
          totalBalance: blockchainData.balance,
          tokenHoldings: blockchainData.tokenCount,
          nftCollections: blockchainData.nftCount,
          topAssets: blockchainData.topTokens,
        },
      },
    };
  }

  /**
   * Batch analyze multiple wallets
   */
  async batchAnalyzeWallets(walletAddresses: string[]): Promise<Map<string, any>> {
    const results = new Map();
    
    console.log(`🔄 Batch analyzing ${walletAddresses.length} wallets`);
    
    // Process in smaller batches to avoid overwhelming the AI service
    const batchSize = 5;
    for (let i = 0; i < walletAddresses.length; i += batchSize) {
      const batch = walletAddresses.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (address) => {
        try {
          const result = await this.scoreWallet(address);
          return { address, result };
        } catch (error) {
          console.error(`Error analyzing ${address}:`, error);
          return { address, error };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      
      batchResults.forEach(({ address, result, error }) => {
        if (result) {
          results.set(address, result);
        } else {
          results.set(address, { error: error?.message || 'Analysis failed' });
        }
      });
      
      // Small delay between batches
      if (i + batchSize < walletAddresses.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`✅ Batch analysis complete: ${results.size} wallets processed`);
    
    return results;
  }

  /**
   * Get risk assessment summary for multiple wallets
   */
  getRiskSummary(analysisResults: Map<string, any>): {
    totalWallets: number;
    riskDistribution: Record<string, number>;
    avgSocialCreditScore: number;
    highRiskWallets: string[];
    topPerformers: string[];
  } {
    const summary = {
      totalWallets: analysisResults.size,
      riskDistribution: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
        unknown: 0,
      },
      avgSocialCreditScore: 0,
      highRiskWallets: [] as string[],
      topPerformers: [] as string[],
    };

    let totalScore = 0;
    const scores: Array<{ address: string; score: number }> = [];

    for (const [address, result] of analysisResults) {
      if (result.error) continue;

      // Count risk levels
      if (summary.riskDistribution.hasOwnProperty(result.riskLevel)) {
        summary.riskDistribution[result.riskLevel as keyof typeof summary.riskDistribution]++;
      }

      // Accumulate scores
      totalScore += result.socialCreditScore;
      scores.push({ address, score: result.socialCreditScore });

      // Identify high-risk wallets
      if (result.riskLevel === 'high' || result.riskLevel === 'critical') {
        summary.highRiskWallets.push(address);
      }
    }

    // Calculate average score
    if (scores.length > 0) {
      summary.avgSocialCreditScore = Math.round(totalScore / scores.length);
    }

    // Get top performers (top 10%)
    scores.sort((a, b) => b.score - a.score);
    const topCount = Math.max(1, Math.floor(scores.length * 0.1));
    summary.topPerformers = scores.slice(0, topCount).map(s => s.address);

    return summary;
  }
}