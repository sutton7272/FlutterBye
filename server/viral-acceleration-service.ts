import { storage } from './storage';
import { monitoring } from './monitoring';

interface ViralMetrics {
  tokenId: string;
  views: number;
  shares: number;
  reactions: number;
  comments: number;
  uniqueInteractions: number;
  viralScore: number;
  velocityScore: number;
  networkReach: number;
  lastCalculated: Date;
}

interface ViralTrend {
  tokenId: string;
  trendingRank: number;
  growthRate: number;
  peakScore: number;
  category: string;
  timeToViral: number; // minutes
  predictedPeak: Date;
}

interface ViralReward {
  tokenId: string;
  creatorId: string;
  rewardType: 'viral_bonus' | 'trending_bonus' | 'network_effect' | 'achievement';
  amount: number;
  currency: string;
  multiplier: number;
  milestone: string;
  timestamp: Date;
}

export class ViralAccelerationService {
  private viralMetrics = new Map<string, ViralMetrics>();
  private viralTrends = new Map<string, ViralTrend>();
  private rewardHistory = new Map<string, ViralReward[]>(); // creatorId -> rewards
  private networkGraph = new Map<string, Set<string>>(); // userId -> connected users
  
  constructor() {
    // Update viral scores every 5 minutes
    setInterval(() => this.updateViralScores(), 5 * 60 * 1000);
    
    // Process rewards every hour
    setInterval(() => this.processViralRewards(), 60 * 60 * 1000);
    
    // Update trending tokens every 15 minutes
    setInterval(() => this.updateTrendingTokens(), 15 * 60 * 1000);
  }

  // Track token interaction for viral scoring
  async trackInteraction(tokenId: string, userId: string, interactionType: 'view' | 'share' | 'reaction' | 'comment') {
    let metrics = this.viralMetrics.get(tokenId);
    
    if (!metrics) {
      metrics = {
        tokenId,
        views: 0,
        shares: 0,
        reactions: 0,
        comments: 0,
        uniqueInteractions: 0,
        viralScore: 0,
        velocityScore: 0,
        networkReach: 0,
        lastCalculated: new Date()
      };
      this.viralMetrics.set(tokenId, metrics);
    }

    // Update counters
    switch (interactionType) {
      case 'view':
        metrics.views++;
        break;
      case 'share':
        metrics.shares++;
        break;
      case 'reaction':
        metrics.reactions++;
        break;
      case 'comment':
        metrics.comments++;
        break;
    }

    // Track unique users
    const uniqueKey = `${tokenId}_${userId}`;
    if (!this.hasInteracted(uniqueKey)) {
      metrics.uniqueInteractions++;
      this.markInteraction(uniqueKey);
    }

    // Update network connections
    await this.updateNetworkGraph(userId, tokenId);

    // Recalculate viral score
    await this.calculateViralScore(tokenId);

    // Check for viral milestones
    await this.checkViralMilestones(tokenId);

    // monitoring.recordBusinessMetric(`viral_${interactionType}`, 1);
  }

  // Calculate comprehensive viral score
  private async calculateViralScore(tokenId: string): Promise<number> {
    const metrics = this.viralMetrics.get(tokenId);
    if (!metrics) return 0;

    // Get token data for context
    const token = await storage.getToken(tokenId);
    if (!token) return 0;

    // Time-based velocity (how fast it's growing)
    const tokenAge = Date.now() - new Date(token.createdAt || Date.now()).getTime();
    const ageInHours = tokenAge / (1000 * 60 * 60);
    const velocityScore = (metrics.shares + metrics.reactions) / Math.max(ageInHours, 0.1);

    // Engagement quality score
    const engagementRatio = metrics.uniqueInteractions > 0 ? 
      (metrics.shares + metrics.reactions + metrics.comments) / metrics.uniqueInteractions : 0;

    // Network reach multiplier
    const networkReach = this.calculateNetworkReach(tokenId);

    // Viral coefficient (shares per view)
    const viralCoefficient = metrics.views > 0 ? metrics.shares / metrics.views : 0;

    // Combined viral score (0-100)
    const viralScore = Math.min(100, 
      (velocityScore * 0.3) + 
      (engagementRatio * 0.25) + 
      (networkReach * 0.25) + 
      (viralCoefficient * 100 * 0.2)
    );

    // Update metrics
    metrics.viralScore = viralScore;
    metrics.velocityScore = velocityScore;
    metrics.networkReach = networkReach;
    metrics.lastCalculated = new Date();

    console.log(`📈 Viral score updated for token ${tokenId}: ${viralScore.toFixed(2)}`);
    return viralScore;
  }

  // Calculate network reach using graph analysis
  private calculateNetworkReach(tokenId: string): number {
    // Simplified network reach calculation
    // In production, use proper graph algorithms
    const metrics = this.viralMetrics.get(tokenId);
    if (!metrics) return 0;

    // Estimate reach based on shares and network effects
    const baseReach = metrics.uniqueInteractions;
    const amplifiedReach = metrics.shares * 5; // Each share reaches ~5 new people
    const networkMultiplier = Math.min(2.0, 1 + (metrics.shares / 100)); // Max 2x multiplier

    return (baseReach + amplifiedReach) * networkMultiplier;
  }

  // Update network graph with user connections
  private async updateNetworkGraph(userId: string, tokenId: string) {
    if (!this.networkGraph.has(userId)) {
      this.networkGraph.set(userId, new Set());
    }

    // Get users who also interacted with this token
    const tokenInteractors = await this.getTokenInteractors(tokenId);
    const userConnections = this.networkGraph.get(userId)!;

    tokenInteractors.forEach(interactorId => {
      if (interactorId !== userId) {
        userConnections.add(interactorId);
      }
    });
  }

  // Get trending tokens based on viral scores
  private async updateTrendingTokens() {
    const trendingCandidates: ViralTrend[] = [];

    for (const [tokenId, metrics] of this.viralMetrics) {
      if (metrics.viralScore > 10) { // Minimum threshold for trending
        const token = await storage.getToken(tokenId);
        if (!token) continue;

        const tokenAge = Date.now() - new Date(token.createdAt || Date.now()).getTime();
        const timeToViral = tokenAge / (1000 * 60); // minutes

        const trend: ViralTrend = {
          tokenId,
          trendingRank: 0, // Will be set after sorting
          growthRate: metrics.velocityScore,
          peakScore: metrics.viralScore,
          category: this.categorizeToken(token),
          timeToViral,
          predictedPeak: new Date(Date.now() + (2 * 60 * 60 * 1000)) // 2 hours ahead
        };

        trendingCandidates.push(trend);
      }
    }

    // Sort by viral score and assign ranks
    trendingCandidates
      .sort((a, b) => b.peakScore - a.peakScore)
      .forEach((trend, index) => {
        trend.trendingRank = index + 1;
        this.viralTrends.set(trend.tokenId, trend);
      });

    console.log(`🔥 Updated trending tokens: ${trendingCandidates.length} tokens trending`);
    // monitoring.recordBusinessMetric('trending_tokens_count', trendingCandidates.length);
  }

  // Check for viral milestones and award bonuses
  private async checkViralMilestones(tokenId: string) {
    const metrics = this.viralMetrics.get(tokenId);
    if (!metrics) return;

    const token = await storage.getToken(tokenId);
    if (!token) return;

    const milestones = [
      { threshold: 50, reward: 10, milestone: 'viral_champion' },
      { threshold: 75, reward: 25, milestone: 'viral_legend' },
      { threshold: 90, reward: 50, milestone: 'viral_superstar' },
      { threshold: 95, reward: 100, milestone: 'viral_phenomenon' }
    ];

    for (const { threshold, reward, milestone } of milestones) {
      if (metrics.viralScore >= threshold && !this.hasRewardedMilestone(tokenId, milestone)) {
        await this.awardViralReward(token.creatorId, {
          tokenId,
          creatorId: token.creatorId,
          rewardType: 'viral_bonus',
          amount: reward,
          currency: 'FLBY',
          multiplier: threshold / 100,
          milestone,
          timestamp: new Date()
        });

        this.markMilestoneRewarded(tokenId, milestone);
        console.log(`🏆 Viral milestone reached: ${milestone} for token ${tokenId}`);
      }
    }
  }

  // Process viral rewards and calculate bonuses
  private async processViralRewards() {
    const topViralTokens = Array.from(this.viralMetrics.entries())
      .sort(([,a], [,b]) => b.viralScore - a.viralScore)
      .slice(0, 10); // Top 10 viral tokens

    for (const [tokenId, metrics] of topViralTokens) {
      const token = await storage.getToken(tokenId);
      if (!token) continue;

      // Network effect bonus
      if (metrics.networkReach > 1000) {
        await this.awardViralReward(token.creatorId, {
          tokenId,
          creatorId: token.creatorId,
          rewardType: 'network_effect',
          amount: Math.floor(metrics.networkReach / 100),
          currency: 'FLBY',
          multiplier: 1.0,
          milestone: 'network_reach_1k',
          timestamp: new Date()
        });
      }

      // Trending bonus
      const trend = this.viralTrends.get(tokenId);
      if (trend && trend.trendingRank <= 5) {
        const trendingBonus = (6 - trend.trendingRank) * 20; // 20-100 FLBY based on rank
        await this.awardViralReward(token.creatorId, {
          tokenId,
          creatorId: token.creatorId,
          rewardType: 'trending_bonus',
          amount: trendingBonus,
          currency: 'FLBY',
          multiplier: 1.0,
          milestone: `trending_rank_${trend.trendingRank}`,
          timestamp: new Date()
        });
      }
    }
  }

  // Award viral reward to creator
  private async awardViralReward(creatorId: string, reward: ViralReward) {
    if (!this.rewardHistory.has(creatorId)) {
      this.rewardHistory.set(creatorId, []);
    }

    this.rewardHistory.get(creatorId)!.push(reward);

    // In production, this would credit the user's FLBY balance
    console.log(`💰 Viral reward awarded: ${reward.amount} ${reward.currency} to ${creatorId} for ${reward.milestone}`);
    
    // monitoring.recordBusinessMetric('viral_rewards_awarded', reward.amount);
    // monitoring.recordBusinessMetric('viral_rewards_count', 1);
  }

  // Public API methods

  async getViralMetrics(tokenId: string): Promise<ViralMetrics | null> {
    return this.viralMetrics.get(tokenId) || null;
  }

  async getTrendingTokens(limit: number = 10): Promise<ViralTrend[]> {
    return Array.from(this.viralTrends.values())
      .sort((a, b) => a.trendingRank - b.trendingRank)
      .slice(0, limit);
  }

  async getCreatorRewards(creatorId: string): Promise<ViralReward[]> {
    return this.rewardHistory.get(creatorId) || [];
  }

  async getViralPrediction(tokenId: string): Promise<{viralPotential: number, timeToViral: number, recommendations: string[]}> {
    const metrics = this.viralMetrics.get(tokenId);
    if (!metrics) {
      return {
        viralPotential: 0,
        timeToViral: 0,
        recommendations: ['Start sharing to build momentum']
      };
    }

    const viralPotential = Math.min(100, metrics.viralScore * 1.2);
    const timeToViral = this.estimateTimeToViral(metrics);
    const recommendations = this.generateViralRecommendations(metrics);

    return {
      viralPotential,
      timeToViral,
      recommendations
    };
  }

  async getNetworkAnalysis(userId: string): Promise<{connections: number, influence: number, reach: number}> {
    const connections = this.networkGraph.get(userId)?.size || 0;
    const influence = this.calculateUserInfluence(userId);
    const reach = connections * 5; // Simplified reach calculation

    return { connections, influence, reach };
  }

  // Helper methods
  private hasInteracted(uniqueKey: string): boolean {
    // In production, use a proper cache or database
    return false; // Simplified
  }

  private markInteraction(uniqueKey: string): void {
    // Mark interaction in cache/database
  }

  private async getTokenInteractors(tokenId: string): Promise<string[]> {
    // In production, query database for users who interacted with token
    return []; // Simplified
  }

  private categorizeToken(token: any): string {
    // Categorize based on token content, tags, etc.
    if (token.tags?.includes('meme')) return 'meme';
    if (token.tags?.includes('art')) return 'art';
    if (token.tags?.includes('gaming')) return 'gaming';
    return 'general';
  }

  private hasRewardedMilestone(tokenId: string, milestone: string): boolean {
    // Check if milestone was already rewarded
    return false; // Simplified
  }

  private markMilestoneRewarded(tokenId: string, milestone: string): void {
    // Mark milestone as rewarded in storage
  }

  private estimateTimeToViral(metrics: ViralMetrics): number {
    // Estimate time to reach viral status based on current trajectory
    if (metrics.velocityScore > 5) return 30; // 30 minutes
    if (metrics.velocityScore > 2) return 120; // 2 hours
    return 480; // 8 hours
  }

  private generateViralRecommendations(metrics: ViralMetrics): string[] {
    const recommendations: string[] = [];
    
    if (metrics.shares < metrics.views * 0.1) {
      recommendations.push('Add compelling call-to-action to increase shares');
    }
    
    if (metrics.reactions < metrics.views * 0.2) {
      recommendations.push('Create more engaging content to boost reactions');
    }
    
    if (metrics.uniqueInteractions < 50) {
      recommendations.push('Promote to targeted communities to reach more users');
    }

    return recommendations.length > 0 ? recommendations : ['Keep engaging with your audience!'];
  }

  private calculateUserInfluence(userId: string): number {
    // Calculate user's influence score based on their network and viral contributions
    const connections = this.networkGraph.get(userId)?.size || 0;
    const creatorRewards = this.rewardHistory.get(userId) || [];
    const rewardScore = creatorRewards.reduce((sum, reward) => sum + reward.amount, 0);
    
    return Math.min(100, (connections * 2) + (rewardScore / 10));
  }

  private async updateViralScores() {
    const updatePromises = Array.from(this.viralMetrics.keys()).map(tokenId => 
      this.calculateViralScore(tokenId)
    );
    
    await Promise.all(updatePromises);
    console.log(`📊 Updated viral scores for ${updatePromises.length} tokens`);
  }

  // Admin methods for monitoring
  getServiceMetrics() {
    return {
      totalTokensTracked: this.viralMetrics.size,
      trendingTokens: this.viralTrends.size,
      totalRewardsAwarded: Array.from(this.rewardHistory.values()).reduce((sum, rewards) => sum + rewards.length, 0),
      networkConnections: Array.from(this.networkGraph.values()).reduce((sum, connections) => sum + connections.size, 0)
    };
  }
}

export const viralAccelerationService = new ViralAccelerationService();