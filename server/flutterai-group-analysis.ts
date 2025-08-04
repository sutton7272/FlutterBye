/**
 * FlutterAI Group Wallet Analysis Service
 * 
 * Analyzes groups of wallets collectively to identify patterns, trends,
 * and insights that emerge from wallet clusters rather than individual analysis
 */

import { storage } from './storage';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface GroupAnalysisFilter {
  riskLevels?: string[];
  marketingSegments?: string[];
  sourcePlatforms?: string[];
  scoringRanges?: {
    socialCreditScore?: { min?: number; max?: number };
    tradingBehaviorScore?: { min?: number; max?: number };
    portfolioQualityScore?: { min?: number; max?: number };
    activityScore?: { min?: number; max?: number };
  };
  dateRanges?: {
    createdAfter?: Date;
    createdBefore?: Date;
    lastAnalyzedAfter?: Date;
  };
  portfolioSizes?: string[];
  tradingFrequencies?: string[];
  customTags?: string[];
}

export interface GroupAnalysisResult {
  id: string;
  analysisName: string;
  walletCount: number;
  filterCriteria: GroupAnalysisFilter;
  insights: {
    demographics: {
      averageScores: Record<string, number>;
      distributionPatterns: Record<string, any>;
      riskProfile: string;
      marketingSegmentation: Record<string, number>;
    };
    behavioral: {
      tradingPatterns: string[];
      riskTolerance: Record<string, number>;
      activityLevels: Record<string, number>;
      portfolioComposition: any;
    };
    strategic: {
      marketingRecommendations: string[];
      targetingStrategy: string;
      riskMitigation: string[];
      opportunities: string[];
    };
    comparative: {
      vsAverageUser: Record<string, string>;
      marketPosition: string;
      competitiveAdvantages: string[];
    };
  };
  aiAnalysis: {
    summary: string;
    keyFindings: string[];
    actionableInsights: string[];
    riskAssessment: string;
    marketingStrategy: string;
  };
  confidence: number;
  generatedAt: Date;
  requestedBy: string;
}

export class FlutterAIGroupAnalysisService {
  constructor() {}

  /**
   * Analyze a group of wallets based on filter criteria
   */
  async analyzeWalletGroup(
    filter: GroupAnalysisFilter,
    analysisName: string,
    requestedBy: string = 'admin'
  ): Promise<GroupAnalysisResult> {
    try {
      // Get filtered wallets
      const wallets = await this.getFilteredWallets(filter);
      
      if (wallets.length === 0) {
        throw new Error('No wallets found matching the specified criteria');
      }

      console.log(`🔍 Analyzing group of ${wallets.length} wallets: ${analysisName}`);

      // Calculate demographic insights
      const demographics = this.calculateDemographics(wallets);
      
      // Calculate behavioral patterns
      const behavioral = this.analyzeBehavioralPatterns(wallets);
      
      // Generate AI-powered strategic insights
      const aiAnalysis = await this.generateAIGroupInsights(wallets, demographics, behavioral);
      
      // Generate strategic recommendations
      const strategic = this.generateStrategicRecommendations(demographics, behavioral, aiAnalysis);
      
      // Generate comparative analysis
      const comparative = await this.generateComparativeAnalysis(wallets, demographics);

      const result: GroupAnalysisResult = {
        id: `group_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        analysisName,
        walletCount: wallets.length,
        filterCriteria: filter,
        insights: {
          demographics,
          behavioral,
          strategic,
          comparative
        },
        aiAnalysis,
        confidence: this.calculateConfidenceScore(wallets.length, aiAnalysis),
        generatedAt: new Date(),
        requestedBy
      };

      console.log(`✅ Group analysis complete: ${result.id}`);
      return result;

    } catch (error) {
      console.error('Error in group wallet analysis:', error);
      throw error;
    }
  }

  /**
   * Filter wallets based on criteria
   */
  private async getFilteredWallets(filter: GroupAnalysisFilter): Promise<any[]> {
    const allWallets = await storage.getAllWalletIntelligence();
    
    return allWallets.filter(wallet => {
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

      // Score range filters
      if (filter.scoringRanges) {
        const ranges = filter.scoringRanges;
        
        if (ranges.socialCreditScore) {
          const score = wallet.socialCreditScore || 0;
          if (ranges.socialCreditScore.min && score < ranges.socialCreditScore.min) return false;
          if (ranges.socialCreditScore.max && score > ranges.socialCreditScore.max) return false;
        }

        if (ranges.tradingBehaviorScore) {
          const score = wallet.tradingBehaviorScore || 0;
          if (ranges.tradingBehaviorScore.min && score < ranges.tradingBehaviorScore.min) return false;
          if (ranges.tradingBehaviorScore.max && score > ranges.tradingBehaviorScore.max) return false;
        }

        if (ranges.portfolioQualityScore) {
          const score = wallet.portfolioQualityScore || 0;
          if (ranges.portfolioQualityScore.min && score < ranges.portfolioQualityScore.min) return false;
          if (ranges.portfolioQualityScore.max && score > ranges.portfolioQualityScore.max) return false;
        }

        if (ranges.activityScore) {
          const score = wallet.activityScore || 0;
          if (ranges.activityScore.min && score < ranges.activityScore.min) return false;
          if (ranges.activityScore.max && score > ranges.activityScore.max) return false;
        }
      }

      // Date range filters
      if (filter.dateRanges) {
        const dates = filter.dateRanges;
        
        if (dates.createdAfter && wallet.createdAt < dates.createdAfter) return false;
        if (dates.createdBefore && wallet.createdAt > dates.createdBefore) return false;
        if (dates.lastAnalyzedAfter && wallet.lastAnalyzed < dates.lastAnalyzedAfter) return false;
      }

      // Portfolio size filter
      if (filter.portfolioSizes && filter.portfolioSizes.length > 0) {
        if (!filter.portfolioSizes.includes(wallet.portfolioSize)) return false;
      }

      // Trading frequency filter
      if (filter.tradingFrequencies && filter.tradingFrequencies.length > 0) {
        if (!filter.tradingFrequencies.includes(wallet.tradingFrequency)) return false;
      }

      return true;
    });
  }

  /**
   * Calculate demographic insights
   */
  private calculateDemographics(wallets: any[]): any {
    const scores = {
      socialCreditScore: 0,
      tradingBehaviorScore: 0,
      portfolioQualityScore: 0,
      liquidityScore: 0,
      activityScore: 0,
      defiEngagementScore: 0,
      influenceScore: 0
    };

    // Calculate averages
    wallets.forEach(wallet => {
      Object.keys(scores).forEach(key => {
        scores[key] += (wallet[key] || 0);
      });
    });

    Object.keys(scores).forEach(key => {
      scores[key] = Math.round(scores[key] / wallets.length);
    });

    // Distribution patterns
    const riskLevelDistribution = {};
    const marketingSegmentDistribution = {};
    const sourcePlatformDistribution = {};
    const portfolioSizeDistribution = {};

    wallets.forEach(wallet => {
      // Risk levels
      const risk = wallet.riskLevel || 'unknown';
      riskLevelDistribution[risk] = (riskLevelDistribution[risk] || 0) + 1;

      // Marketing segments
      const segment = wallet.marketingSegment || 'unknown';
      marketingSegmentDistribution[segment] = (marketingSegmentDistribution[segment] || 0) + 1;

      // Source platforms
      const platform = wallet.sourcePlatform || 'unknown';
      sourcePlatformDistribution[platform] = (sourcePlatformDistribution[platform] || 0) + 1;

      // Portfolio sizes
      const size = wallet.portfolioSize || 'unknown';
      portfolioSizeDistribution[size] = (portfolioSizeDistribution[size] || 0) + 1;
    });

    // Determine overall risk profile
    const highRiskCount = (riskLevelDistribution['high'] || 0) + (riskLevelDistribution['critical'] || 0);
    const totalCount = wallets.length;
    const riskProfile = highRiskCount / totalCount > 0.3 ? 'high_risk_group' : 
                      highRiskCount / totalCount > 0.1 ? 'moderate_risk_group' : 'low_risk_group';

    return {
      averageScores: scores,
      distributionPatterns: {
        riskLevels: riskLevelDistribution,
        marketingSegments: marketingSegmentDistribution,
        sourcePlatforms: sourcePlatformDistribution,
        portfolioSizes: portfolioSizeDistribution
      },
      riskProfile,
      marketingSegmentation: marketingSegmentDistribution
    };
  }

  /**
   * Analyze behavioral patterns
   */
  private analyzeBehavioralPatterns(wallets: any[]): any {
    const tradingFrequencyDistribution = {};
    const riskToleranceDistribution = {};
    const activityLevelDistribution = {};

    wallets.forEach(wallet => {
      // Trading frequency
      const freq = wallet.tradingFrequency || 'unknown';
      tradingFrequencyDistribution[freq] = (tradingFrequencyDistribution[freq] || 0) + 1;

      // Risk tolerance
      const tolerance = wallet.riskTolerance || 'moderate';
      riskToleranceDistribution[tolerance] = (riskToleranceDistribution[tolerance] || 0) + 1;

      // Activity levels based on activity score
      const score = wallet.activityScore || 0;
      const level = score > 750 ? 'high' : score > 500 ? 'medium' : score > 250 ? 'low' : 'inactive';
      activityLevelDistribution[level] = (activityLevelDistribution[level] || 0) + 1;
    });

    // Identify common trading patterns
    const tradingPatterns = [];
    const totalWallets = wallets.length;

    if ((tradingFrequencyDistribution['high'] || 0) / totalWallets > 0.4) {
      tradingPatterns.push('High frequency trading dominant');
    }
    if ((riskToleranceDistribution['aggressive'] || 0) / totalWallets > 0.3) {
      tradingPatterns.push('Aggressive risk-taking behavior');
    }
    if ((activityLevelDistribution['high'] || 0) / totalWallets > 0.5) {
      tradingPatterns.push('Highly active user base');
    }

    // Portfolio composition analysis
    const portfolioComposition = {
      whales: (wallets.filter(w => w.portfolioSize === 'whale').length / totalWallets * 100).toFixed(1),
      large: (wallets.filter(w => w.portfolioSize === 'large').length / totalWallets * 100).toFixed(1),
      medium: (wallets.filter(w => w.portfolioSize === 'medium').length / totalWallets * 100).toFixed(1),
      small: (wallets.filter(w => w.portfolioSize === 'small').length / totalWallets * 100).toFixed(1)
    };

    return {
      tradingPatterns,
      riskTolerance: riskToleranceDistribution,
      activityLevels: activityLevelDistribution,
      portfolioComposition
    };
  }

  /**
   * Generate AI-powered insights
   */
  private async generateAIGroupInsights(wallets: any[], demographics: any, behavioral: any): Promise<any> {
    try {
      const prompt = `You are an expert blockchain wallet analyst. Analyze this group of ${wallets.length} wallets and provide insights.

Group Demographics:
- Average Social Credit Score: ${demographics.averageScores.socialCreditScore}
- Average Trading Behavior Score: ${demographics.averageScores.tradingBehaviorScore}
- Average Portfolio Quality Score: ${demographics.averageScores.portfolioQualityScore}
- Average Activity Score: ${demographics.averageScores.activityScore}
- Risk Profile: ${demographics.riskProfile}

Marketing Segments: ${JSON.stringify(demographics.marketingSegmentation)}
Risk Tolerance: ${JSON.stringify(behavioral.riskTolerance)}
Portfolio Composition: ${JSON.stringify(behavioral.portfolioComposition)}

Provide analysis in JSON format:
{
  "summary": "2-3 sentence overview of this wallet group",
  "keyFindings": ["finding1", "finding2", "finding3"],
  "actionableInsights": ["insight1", "insight2", "insight3"],
  "riskAssessment": "risk level and mitigation strategies",
  "marketingStrategy": "recommended marketing approach for this group"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.warn('AI analysis failed, using fallback insights:', error);
      return {
        summary: `Analysis of ${wallets.length} wallets with average social credit score of ${demographics.averageScores.socialCreditScore}`,
        keyFindings: [
          `Group shows ${demographics.riskProfile} characteristics`,
          `Primary marketing segment: ${Object.keys(demographics.marketingSegmentation)[0] || 'unknown'}`,
          `Average activity level indicates ${demographics.averageScores.activityScore > 500 ? 'high' : 'moderate'} engagement`
        ],
        actionableInsights: [
          'Customize marketing messages based on risk tolerance distribution',
          'Focus on high-activity segments for engagement campaigns',
          'Implement risk-appropriate product offerings'
        ],
        riskAssessment: `Group classified as ${demographics.riskProfile}`,
        marketingStrategy: 'Segment-based targeted campaigns recommended'
      };
    }
  }

  /**
   * Generate strategic recommendations
   */
  private generateStrategicRecommendations(demographics: any, behavioral: any, aiAnalysis: any): any {
    const recommendations = [];
    const targetingStrategy = [];
    const riskMitigation = [];
    const opportunities = [];

    // Marketing recommendations based on segments
    const topSegment = Object.keys(demographics.marketingSegmentation)
      .reduce((a, b) => demographics.marketingSegmentation[a] > demographics.marketingSegmentation[b] ? a : b);

    if (topSegment === 'whale') {
      recommendations.push('VIP treatment and exclusive access programs');
      targetingStrategy.push('High-touch, personalized outreach');
    } else if (topSegment === 'retail') {
      recommendations.push('Educational content and beginner-friendly features');
      targetingStrategy.push('Broad-based marketing with simple messaging');
    }

    // Risk-based recommendations
    if (demographics.riskProfile === 'high_risk_group') {
      riskMitigation.push('Enhanced KYC and monitoring protocols');
      riskMitigation.push('Automated risk alerts and intervention systems');
    }

    // Activity-based opportunities
    const highActivityRatio = (behavioral.activityLevels.high || 0) / Object.values(behavioral.activityLevels).reduce((a: any, b: any) => a + b, 0);
    if (highActivityRatio > 0.3) {
      opportunities.push('Gamification and rewards programs');
      opportunities.push('Advanced trading features and tools');
    }

    return {
      marketingRecommendations: recommendations,
      targetingStrategy: targetingStrategy.join(', ') || 'Balanced approach across segments',
      riskMitigation,
      opportunities
    };
  }

  /**
   * Generate comparative analysis
   */
  private async generateComparativeAnalysis(wallets: any[], demographics: any): Promise<any> {
    const allWallets = await storage.getAllWalletIntelligence();
    const avgScores = {
      socialCreditScore: 0,
      tradingBehaviorScore: 0,
      portfolioQualityScore: 0,
      activityScore: 0
    };

    // Calculate platform averages
    allWallets.forEach(wallet => {
      Object.keys(avgScores).forEach(key => {
        avgScores[key] += (wallet[key] || 0);
      });
    });

    Object.keys(avgScores).forEach(key => {
      avgScores[key] = Math.round(avgScores[key] / allWallets.length);
    });

    const vsAverage = {};
    Object.keys(avgScores).forEach(key => {
      const groupScore = demographics.averageScores[key];
      const platformAvg = avgScores[key];
      const diff = ((groupScore - platformAvg) / platformAvg * 100).toFixed(1);
      vsAverage[key] = `${diff}% ${parseFloat(diff) > 0 ? 'above' : 'below'} platform average`;
    });

    const marketPosition = demographics.averageScores.socialCreditScore > avgScores.socialCreditScore ? 
      'Above average market position' : 'Below average market position';

    const competitiveAdvantages = [];
    if (demographics.averageScores.tradingBehaviorScore > avgScores.tradingBehaviorScore) {
      competitiveAdvantages.push('Superior trading behavior patterns');
    }
    if (demographics.averageScores.activityScore > avgScores.activityScore) {
      competitiveAdvantages.push('Higher engagement levels');
    }

    return {
      vsAverageUser: vsAverage,
      marketPosition,
      competitiveAdvantages
    };
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidenceScore(walletCount: number, aiAnalysis: any): number {
    let confidence = 0.5; // Base confidence

    // More wallets = higher confidence
    if (walletCount > 100) confidence += 0.3;
    else if (walletCount > 50) confidence += 0.2;
    else if (walletCount > 20) confidence += 0.1;

    // AI analysis quality
    if (aiAnalysis.keyFindings && aiAnalysis.keyFindings.length >= 3) confidence += 0.1;
    if (aiAnalysis.actionableInsights && aiAnalysis.actionableInsights.length >= 3) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  /**
   * Get predefined filter templates
   */
  async getFilterTemplates(): Promise<Array<{name: string, description: string, filter: GroupAnalysisFilter}>> {
    return [
      {
        name: 'High Risk Wallets',
        description: 'Analyze wallets with high or critical risk levels',
        filter: { riskLevels: ['high', 'critical'] }
      },
      {
        name: 'Whale Investors',
        description: 'Analyze large portfolio holders and whales',
        filter: { portfolioSizes: ['whale', 'large'] }
      },
      {
        name: 'Active Traders',
        description: 'Analyze highly active trading wallets',
        filter: { 
          tradingFrequencies: ['high', 'very_high'],
          scoringRanges: { activityScore: { min: 500 } }
        }
      },
      {
        name: 'FlutterBye Users',
        description: 'Analyze wallets collected from FlutterBye platform',
        filter: { sourcePlatforms: ['FlutterBye'] }
      },
      {
        name: 'PerpeTrader Users',
        description: 'Analyze wallets collected from PerpeTrader platform',
        filter: { sourcePlatforms: ['PerpeTrader'] }
      },
      {
        name: 'New Wallets (Last 30 Days)',
        description: 'Analyze recently collected wallets',
        filter: { 
          dateRanges: { 
            createdAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
          } 
        }
      },
      {
        name: 'High Score Wallets',
        description: 'Analyze wallets with high social credit scores',
        filter: { 
          scoringRanges: { 
            socialCreditScore: { min: 700 } 
          } 
        }
      }
    ];
  }
}

export const flutterAIGroupAnalysisService = new FlutterAIGroupAnalysisService();