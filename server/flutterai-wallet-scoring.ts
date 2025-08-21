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
   * Revolutionary Comprehensive Wallet Analysis and Scoring
   * The most advanced Social Credit Score system for blockchain addresses
   * 
   * Collects maximum data for targeted marketing, messaging, and communication
   */
  async scoreWallet(walletAddress: string): Promise<{
    socialCreditScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
    tradingBehaviorScore: number;
    portfolioQualityScore: number;
    liquidityScore: number;
    activityScore: number;
    defiEngagementScore: number;
    marketingSegment: string;
    communicationStyle: string;
    preferredTokenTypes: string[];
    riskTolerance: string;
    investmentProfile: string;
    tradingFrequency: string;
    portfolioSize: string;
    influenceScore: number;
    socialConnections: number;
    analysisData: any;
    marketingInsights: {
      targetAudience: string;
      messagingStrategy: string;
      bestContactTimes: string[];
      preferredCommunicationChannels: string[];
      interests: string[];
      behaviorPatterns: string[];
      marketingRecommendations: string[];
    };
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
        defiEngagementScore: 0,
        marketingSegment: 'unknown',
        communicationStyle: 'unknown',
        preferredTokenTypes: [],
        riskTolerance: 'unknown',
        investmentProfile: 'unknown',
        tradingFrequency: 'unknown',
        portfolioSize: 'unknown',
        influenceScore: 0,
        socialConnections: 0,
        analysisData: {
          error: error instanceof Error ? error.message : 'Analysis failed',
          analyzedAt: new Date().toISOString(),
        },
        marketingInsights: {
          targetAudience: 'unknown',
          messagingStrategy: 'generic',
          bestContactTimes: [],
          preferredCommunicationChannels: [],
          interests: [],
          behaviorPatterns: [],
          marketingRecommendations: []
        }
      };
    }
  }

  /**
   * Gather Revolutionary Comprehensive Blockchain Data for Marketing Intelligence
   * Collects maximum data points for targeted marketing analysis
   */
  private async gatherBlockchainData(walletAddress: string): Promise<any> {
    try {
      // Advanced blockchain data collection for marketing intelligence
      // In production, this would integrate with Helius, Solscan, and other APIs
      
      const mockData = {
        // Portfolio Analysis
        balance: Math.random() * 100, // SOL balance
        tokenCount: Math.floor(Math.random() * 50) + 1,
        nftCount: Math.floor(Math.random() * 20),
        totalPortfolioValue: Math.random() * 10000,
        
        // Trading Behavior Data
        transactionHistory: {
          totalTransactions: Math.floor(Math.random() * 1000) + 10,
          dailyAverage: Math.random() * 10,
          weeklyPattern: Array.from({length: 7}, () => Math.random() * 100),
          hourlyActivity: Array.from({length: 24}, () => Math.random() * 50),
          tradingFrequency: ['daily', 'weekly', 'monthly', 'rarely'][Math.floor(Math.random() * 4)],
        },
        
        // DeFi Engagement
        defiInteractions: {
          dexUsage: ['Raydium', 'Orca', 'Jupiter', 'Serum'].slice(0, Math.floor(Math.random() * 4) + 1),
          liquidityProviding: Math.random() > 0.7,
          stakingActivities: Math.random() > 0.6,
          lendingBorrowing: Math.random() > 0.8,
          protocolsUsed: Math.floor(Math.random() * 15) + 1,
        },
        
        // Social and Network Analysis
        socialMetrics: {
          connectedWallets: Math.floor(Math.random() * 500),
          followersEstimate: Math.floor(Math.random() * 1000),
          influenceScore: Math.random() * 100,
          communityEngagement: Math.random() * 100,
        },
        
        // Token Preferences Analysis
        tokenPreferences: {
          memeCoins: Math.random() * 100,
          utilityTokens: Math.random() * 100,
          governance: Math.random() * 100,
          stablecoins: Math.random() * 100,
          nftCollections: ['DeGods', 'Okay Bears', 'Solana Monkey Business'].slice(0, Math.floor(Math.random() * 3)),
        },
        
        // Risk Assessment Data
        riskIndicators: {
          rugPullExposure: Math.random() * 100,
          scamInteractions: Math.random() * 20,
          volatilityTolerance: Math.random() * 100,
          maxLossEvents: Math.floor(Math.random() * 5),
        },
        
        // Time-based Behavior Patterns
        behaviorPatterns: {
          activeHours: Array.from({length: 24}, () => Math.random() * 100),
          preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            .filter(() => Math.random() > 0.5),
          seasonalActivity: {
            spring: Math.random() * 100,
            summer: Math.random() * 100,
            fall: Math.random() * 100,
            winter: Math.random() * 100,
          },
        },
        
        // Additional Analysis Data
        accountMetrics: {
          accountAge: Math.floor(Math.random() * 365) + 30, // Days
          last30Days: Math.floor(Math.random() * 100) + 1,
          avgTransactionSize: Math.random() * 10,
          successRate: 0.95 + Math.random() * 0.05,
        },
        
        topTokens: [
          { symbol: 'SOL', balance: Math.random() * 50 },
          { symbol: 'USDC', balance: Math.random() * 1000 },
          { symbol: 'BONK', balance: Math.random() * 1000000 },
        ],
        
        riskFactors: [],
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
      if (mockData.accountMetrics.accountAge < 7) {
        mockData.riskFactors.push('Very new account');
      }

      return mockData;
    } catch (error) {
      console.error('Error gathering blockchain data:', error);
      throw error;
    }
  }

  /**
   * Revolutionary AI-Powered Marketing Intelligence Analysis
   * Uses GPT-4o to generate comprehensive insights for targeted marketing
   */
  private async performAIAnalysis(walletAddress: string, blockchainData: any): Promise<any> {
    try {
      const analysisPrompt = `
        Perform comprehensive marketing intelligence analysis for this Solana wallet address:
        
        Wallet Address: ${walletAddress}
        Portfolio Value: $${blockchainData.totalPortfolioValue?.toFixed(2) || 'Unknown'}
        SOL Balance: ${blockchainData.balance} SOL
        Token Count: ${blockchainData.tokenCount}
        NFT Count: ${blockchainData.nftCount}
        Total Transactions: ${blockchainData.transactionHistory.totalTransactions}
        Trading Frequency: ${blockchainData.transactionHistory.tradingFrequency}
        
        DeFi Engagement:
        - DEX Usage: ${blockchainData.defiInteractions.dexUsage.join(', ')}
        - Liquidity Providing: ${blockchainData.defiInteractions.liquidityProviding}
        - Staking Activities: ${blockchainData.defiInteractions.stakingActivities}
        - Protocols Used: ${blockchainData.defiInteractions.protocolsUsed}
        
        Social Metrics:
        - Connected Wallets: ${blockchainData.socialMetrics.connectedWallets}
        - Influence Score: ${blockchainData.socialMetrics.influenceScore}
        - Community Engagement: ${blockchainData.socialMetrics.communityEngagement}
        
        Token Preferences:
        - Meme Coins: ${blockchainData.tokenPreferences.memeCoins}%
        - Utility Tokens: ${blockchainData.tokenPreferences.utilityTokens}%
        - Governance: ${blockchainData.tokenPreferences.governance}%
        - Stablecoins: ${blockchainData.tokenPreferences.stablecoins}%
        
        Risk Indicators:
        - Rug Pull Exposure: ${blockchainData.riskIndicators.rugPullExposure}%
        - Volatility Tolerance: ${blockchainData.riskIndicators.volatilityTolerance}%
        
        Behavior Patterns:
        - Active Days: ${blockchainData.behaviorPatterns.preferredDays.join(', ')}
        - Account Age: ${blockchainData.accountMetrics.accountAge} days
        - Average Transaction Size: ${blockchainData.accountMetrics.avgTransactionSize} SOL
        - Success Rate: ${(blockchainData.accountMetrics.successRate * 100).toFixed(1)}%
        
        Risk Factors: ${blockchainData.riskFactors.join(', ') || 'None identified'}
        
        Provide comprehensive marketing intelligence analysis in JSON format with detailed insights for targeted marketing:
        {
          "behaviorPattern": "detailed trading/usage patterns description",
          "riskAssessment": "low/medium/high/critical with detailed reasoning",
          "portfolioQuality": "comprehensive token diversity and quality assessment", 
          "activityLevel": "detailed account activity description",
          "socialSignals": "community engagement and influence indicators",
          "marketingSegment": "ideal target market segment (whale, retail, degen, institutional, etc.)",
          "communicationStyle": "recommended communication approach (technical, casual, formal, etc.)",
          "preferredTokenTypes": ["list of token types they prefer"],
          "riskTolerance": "conservative/moderate/aggressive/extreme",
          "investmentProfile": "detailed investor type analysis",
          "tradingFrequency": "frequency pattern analysis",
          "portfolioSize": "small/medium/large/whale category",
          "influenceScore": 0-100,
          "targetAudience": "specific audience segment description",
          "messagingStrategy": "recommended messaging approach",
          "bestContactTimes": ["optimal contact time periods"],
          "preferredCommunicationChannels": ["recommended channels"],
          "interests": ["inferred interests and preferences"],
          "behaviorPatterns": ["key behavioral insights"],
          "marketingRecommendations": ["specific marketing action items"],
          "recommendations": ["general recommendations"],
          "confidenceScore": 0.85
        }
      `;

      const aiResponse = await openaiService.generateTextCompletion({
        prompt: analysisPrompt,
        maxTokens: 1000,
        temperature: 0.7
      });
      
      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        console.warn('AI response not valid JSON, using comprehensive fallback analysis');
        return {
          behaviorPattern: "Standard retail trading pattern with moderate engagement",
          riskAssessment: blockchainData.riskFactors.length > 2 ? "high" : "medium",
          portfolioQuality: blockchainData.tokenCount > 10 ? "diversified portfolio" : "concentrated holdings",
          activityLevel: blockchainData.transactionHistory.totalTransactions > 100 ? "highly active" : "moderate activity",
          socialSignals: "Limited social engagement data available",
          marketingSegment: blockchainData.totalPortfolioValue > 10000 ? "whale" : "retail",
          communicationStyle: "casual and informative",
          preferredTokenTypes: ["utility", "governance", "stablecoin"],
          riskTolerance: blockchainData.riskIndicators.volatilityTolerance > 70 ? "aggressive" : "moderate",
          investmentProfile: "balanced investor with diversification focus",
          tradingFrequency: blockchainData.transactionHistory.tradingFrequency,
          portfolioSize: blockchainData.totalPortfolioValue > 50000 ? "large" : blockchainData.totalPortfolioValue > 5000 ? "medium" : "small",
          influenceScore: blockchainData.socialMetrics.influenceScore || 35,
          targetAudience: "crypto-experienced retail investors",
          messagingStrategy: "educational content with growth opportunities",
          bestContactTimes: ["evening", "weekend"],
          preferredCommunicationChannels: ["email", "social media"],
          interests: ["defi", "trading", "portfolio growth"],
          behaviorPatterns: ["regular trading", "diversification seeking"],
          marketingRecommendations: ["personalized investment insights", "educational content", "exclusive opportunities"],
          recommendations: ["Increase portfolio diversification", "Maintain regular activity"],
          confidenceScore: 0.7,
        };
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      
      // Comprehensive fallback analysis without AI
      return {
        behaviorPattern: "Unable to determine detailed patterns - needs more data",
        riskAssessment: "unknown - insufficient data for assessment",
        portfolioQuality: "insufficient data for quality assessment",
        activityLevel: "unknown activity level",
        socialSignals: "No social engagement data available",
        marketingSegment: "unknown",
        communicationStyle: "generic approach recommended",
        preferredTokenTypes: [],
        riskTolerance: "unknown",
        investmentProfile: "insufficient data for profiling",
        tradingFrequency: "unknown",
        portfolioSize: "unknown",
        influenceScore: 0,
        targetAudience: "general audience",
        messagingStrategy: "broad educational content",
        bestContactTimes: [],
        preferredCommunicationChannels: [],
        interests: [],
        behaviorPatterns: [],
        marketingRecommendations: ["collect more wallet data", "implement tracking"],
        recommendations: ["Gather more transaction data", "Enable analytics tracking"],
        confidenceScore: 0.3,
      };
    }
  }

  /**
   * Revolutionary Comprehensive Score Calculation with Marketing Intelligence
   * Generates detailed scores for targeted marketing and communication strategies
   */
  private calculateScores(blockchainData: any, aiAnalysis: any): any {
    // Trading Behavior Score (0-100) - Enhanced with marketing insights
    let tradingScore = 0;
    if (blockchainData.transactionHistory.totalTransactions > 0) {
      tradingScore += Math.min(blockchainData.transactionHistory.totalTransactions / 10, 30); // Volume component
      tradingScore += Math.min(blockchainData.accountMetrics.successRate * 40, 40); // Success rate component
      tradingScore += Math.min(blockchainData.accountMetrics.last30Days * 2, 30); // Recent activity component
    }

    // Portfolio Quality Score (0-100) - Enhanced for investment profiling
    let portfolioScore = 0;
    portfolioScore += Math.min(blockchainData.tokenCount * 3, 40); // Diversity component
    portfolioScore += Math.min(blockchainData.balance * 10, 30); // SOL holdings component
    portfolioScore += blockchainData.nftCount > 0 ? 15 : 0; // NFT engagement component
    portfolioScore += blockchainData.defiInteractions.protocolsUsed * 1; // DeFi sophistication

    // Liquidity Score (0-100) - Enhanced for wealth assessment
    let liquidityScore = 0;
    liquidityScore += Math.min(blockchainData.balance * 20, 50); // SOL liquidity
    liquidityScore += blockchainData.topTokens.reduce((acc: number, token: any) => {
      if (token.symbol === 'USDC') return acc + Math.min(token.balance / 10, 30);
      return acc + Math.min(token.balance / 100, 10);
    }, 0);

    // Activity Score (0-100) - Enhanced with behavioral analysis
    let activityScore = 0;
    activityScore += Math.min(blockchainData.transactionHistory.totalTransactions / 5, 40);
    activityScore += Math.min(blockchainData.accountMetrics.last30Days * 3, 30);
    activityScore += Math.max(0, 30 - blockchainData.accountMetrics.accountAge / 30); // Newer accounts get points

    // DeFi Engagement Score (0-100) - NEW revolutionary metric
    let defiEngagementScore = 0;
    defiEngagementScore += blockchainData.defiInteractions.dexUsage.length * 10; // 10 points per DEX
    defiEngagementScore += blockchainData.defiInteractions.liquidityProviding ? 20 : 0;
    defiEngagementScore += blockchainData.defiInteractions.stakingActivities ? 15 : 0;
    defiEngagementScore += blockchainData.defiInteractions.lendingBorrowing ? 25 : 0;
    defiEngagementScore += Math.min(blockchainData.defiInteractions.protocolsUsed * 2, 30); // 2 points per protocol, max 30

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

    // Extract comprehensive marketing insights from AI analysis
    const marketingInsights = {
      targetAudience: aiAnalysis.targetAudience || 'general crypto audience',
      messagingStrategy: aiAnalysis.messagingStrategy || 'educational approach',
      bestContactTimes: aiAnalysis.bestContactTimes || ['evening', 'weekend'],
      preferredCommunicationChannels: aiAnalysis.preferredCommunicationChannels || ['email'],
      interests: aiAnalysis.interests || ['crypto', 'trading'],
      behaviorPatterns: aiAnalysis.behaviorPatterns || ['moderate activity'],
      marketingRecommendations: aiAnalysis.marketingRecommendations || ['generic outreach']
    };

    return {
      socialCreditScore: Math.round(Math.min(socialCreditScore, 1000)),
      riskLevel,
      tradingBehaviorScore: Math.round(tradingScore),
      portfolioQualityScore: Math.round(portfolioScore),
      liquidityScore: Math.round(liquidityScore),
      activityScore: Math.round(activityScore),
      defiEngagementScore: Math.round(defiEngagementScore),
      marketingSegment: aiAnalysis.marketingSegment || 'retail',
      communicationStyle: aiAnalysis.communicationStyle || 'casual',
      preferredTokenTypes: aiAnalysis.preferredTokenTypes || [],
      riskTolerance: aiAnalysis.riskTolerance || 'moderate',
      investmentProfile: aiAnalysis.investmentProfile || 'balanced investor',
      tradingFrequency: aiAnalysis.tradingFrequency || blockchainData.transactionHistory.tradingFrequency,
      portfolioSize: aiAnalysis.portfolioSize || 'medium',
      influenceScore: aiAnalysis.influenceScore || blockchainData.socialMetrics.influenceScore || 35,
      socialConnections: blockchainData.socialMetrics.connectedWallets || 0,
      marketingInsights,
      analysisData: {
        blockchainData,
        aiAnalysis,
        calculatedAt: new Date().toISOString(),
        riskFactors: blockchainData.riskFactors,
        behaviorPatterns: {
          tradingVolume: blockchainData.transactionHistory.totalTransactions,
          recentActivity: blockchainData.accountMetrics.last30Days,
          portfolioDiversity: blockchainData.tokenCount,
          defiEngagement: blockchainData.defiInteractions.protocolsUsed,
          socialActivity: blockchainData.socialMetrics.communityEngagement,
        },
        portfolioAnalysis: {
          totalBalance: blockchainData.balance,
          totalValue: blockchainData.totalPortfolioValue,
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