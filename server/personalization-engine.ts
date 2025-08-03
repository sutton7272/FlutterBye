import { storage } from './storage';
import { errorTracker } from './error-tracking';
import { openaiService } from './openai-service';

export interface UserPreferences {
  theme: 'electric' | 'minimal' | 'dark' | 'neon';
  defaultCurrency: 'SOL' | 'USDC' | 'FLBY';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    transactionUpdates: boolean;
    marketingUpdates: boolean;
    communityUpdates: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list' | 'cards';
    widgets: string[];
    chartType: 'line' | 'bar' | 'pie';
  };
  trading: {
    defaultQuantity: number;
    riskLevel: 'low' | 'medium' | 'high';
    autoRebalance: boolean;
  };
  privacy: {
    showPortfolio: boolean;
    shareActivity: boolean;
    allowAnalytics: boolean;
  };
}

export interface UserBehavior {
  totalSessions: number;
  averageSessionDuration: number;
  preferredFeatures: string[];
  mostUsedCurrency: string;
  tradingPattern: 'conservative' | 'moderate' | 'aggressive';
  peakActivityHours: number[];
  devicePreference: 'mobile' | 'desktop' | 'tablet';
  lastActiveFeature: string;
  featureUsageCount: Record<string, number>;
}

export interface PersonalizationProfile {
  userId: string;
  preferences: UserPreferences;
  behavior: UserBehavior;
  recommendations: string[];
  insights: string[];
  riskScore: number;
  engagementLevel: 'low' | 'medium' | 'high';
  userSegment: 'casual' | 'trader' | 'enterprise' | 'whale';
  createdAt: Date;
  updatedAt: Date;
}

export class PersonalizationEngine {
  private profiles = new Map<string, PersonalizationProfile>();

  // Initialize user profile with default preferences
  async initializeProfile(userId: string): Promise<PersonalizationProfile> {
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const defaultProfile: PersonalizationProfile = {
        userId,
        preferences: this.getDefaultPreferences(),
        behavior: this.getDefaultBehavior(),
        recommendations: [],
        insights: [],
        riskScore: 0.5,
        engagementLevel: 'medium',
        userSegment: 'casual',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.profiles.set(userId, defaultProfile);
      await this.saveProfile(defaultProfile);
      
      return defaultProfile;
    } catch (error) {
      errorTracker.logError(error as Error, undefined, 'error', ['personalization', 'init']);
      throw error;
    }
  }

  // Get user's personalization profile
  async getProfile(userId: string): Promise<PersonalizationProfile | null> {
    try {
      // Check cache first
      if (this.profiles.has(userId)) {
        return this.profiles.get(userId)!;
      }

      // Load from database
      const profile = await this.loadProfile(userId);
      if (profile) {
        this.profiles.set(userId, profile);
        return profile;
      }

      return null;
    } catch (error) {
      errorTracker.logError(error as Error, undefined, 'error', ['personalization', 'get']);
      return null;
    }
  }

  // Update user preferences
  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<PersonalizationProfile> {
    try {
      let profile = await this.getProfile(userId);
      if (!profile) {
        profile = await this.initializeProfile(userId);
      }

      profile.preferences = { ...profile.preferences, ...preferences };
      profile.updatedAt = new Date();

      await this.saveProfile(profile);
      this.profiles.set(userId, profile);

      return profile;
    } catch (error) {
      errorTracker.logError(error as Error, undefined, 'error', ['personalization', 'update']);
      throw error;
    }
  }

  // Track user behavior
  async trackBehavior(userId: string, action: string, metadata?: Record<string, any>): Promise<void> {
    try {
      let profile = await this.getProfile(userId);
      if (!profile) {
        profile = await this.initializeProfile(userId);
      }

      // Update behavior metrics
      profile.behavior.featureUsageCount[action] = (profile.behavior.featureUsageCount[action] || 0) + 1;
      profile.behavior.lastActiveFeature = action;
      profile.behavior.totalSessions += 1;

      // Update preferred features based on usage
      this.updatePreferredFeatures(profile, action);

      // Analyze trading patterns
      if (action.includes('trade') || action.includes('mint') || action.includes('buy')) {
        this.analyzeTradingPattern(profile, metadata);
      }

      // Update engagement level
      this.updateEngagementLevel(profile);

      // Generate new recommendations
      profile.recommendations = await this.generateRecommendations(profile);
      profile.insights = this.generateInsights(profile);

      profile.updatedAt = new Date();
      await this.saveProfile(profile);
      this.profiles.set(userId, profile);

    } catch (error) {
      errorTracker.logError(error as Error, undefined, 'error', ['personalization', 'track']);
    }
  }

  // AI-powered personalized recommendations using OpenAI
  async generateRecommendations(profile: PersonalizationProfile): Promise<string[]> {
    try {
      // Gather user context for AI analysis
      const userContext = {
        engagementLevel: profile.engagementLevel,
        tradingPattern: profile.behavior.tradingPattern,
        preferredCurrency: profile.preferences.defaultCurrency,
        topFeatures: Object.entries(profile.behavior.featureUsageCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([feature]) => feature),
        riskScore: profile.riskScore,
        sessionCount: profile.behavior.totalSessions,
        userSegment: profile.userSegment
      };

      // Use OpenAI to generate personalized recommendations
      const aiRecommendations = await this.generateAIRecommendations(userContext);
      
      // Fallback to rule-based if AI fails
      if (aiRecommendations.length === 0) {
        return this.getFallbackRecommendations(profile);
      }
      
      return aiRecommendations.slice(0, 5);
    } catch (error) {
      console.error('AI recommendation generation failed:', error);
      return this.getFallbackRecommendations(profile);
    }
  }

  private async generateAIRecommendations(userContext: any): Promise<string[]> {
    const prompt = `Generate 5 personalized recommendations for a FlutterWave blockchain messaging platform user:

User Profile:
- Engagement Level: ${userContext.engagementLevel}
- Trading Pattern: ${userContext.tradingPattern}  
- Preferred Currency: ${userContext.preferredCurrency}
- Top Features: ${userContext.topFeatures.join(', ')}
- Risk Score: ${userContext.riskScore}
- Sessions: ${userContext.sessionCount}
- User Segment: ${userContext.userSegment}

Platform Features:
- Emotional token minting
- Value-attached messaging
- Blockchain chat
- Token staking (FLBY)
- Limited edition collections
- Viral messaging campaigns
- SMS-to-blockchain integration

Return 5 specific, actionable recommendations in JSON array format that would increase user engagement and platform value.`;

    try {
      const result = await openaiService.optimizeMessage(prompt);
      // Parse recommendations from the optimized response
      const recommendations = [
        result.optimizedMessage,
        ...result.improvements
      ];
      
      return recommendations.slice(0, 5);
    } catch (error) {
      console.error('OpenAI recommendations failed:', error); 
      return [];
    }
  }

  private getFallbackRecommendations(profile: PersonalizationProfile): string[] {
    const recommendations: string[] = [];

    // Currency recommendations
    if (profile.behavior.mostUsedCurrency === 'SOL') {
      recommendations.push('Try using FLBY tokens for 10% fee discounts on all transactions');
    }

    // Feature recommendations
    const topFeatures = Object.entries(profile.behavior.featureUsageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([feature]) => feature);

    if (topFeatures.includes('mint') && !topFeatures.includes('value_attach')) {
      recommendations.push('Add value to your tokens to increase engagement and potential returns');
    }

    if (profile.behavior.tradingPattern === 'aggressive') {
      recommendations.push('Consider our staking program for passive income on your FLBY holdings');
    }

    // Engagement-based recommendations
    if (profile.engagementLevel === 'high') {
      recommendations.push('Join our governance program to vote on platform decisions');
      recommendations.push('Explore enterprise features for advanced token management');
    }

    // Time-based recommendations
    const currentHour = new Date().getHours();
    if (profile.behavior.peakActivityHours.includes(currentHour)) {
      recommendations.push('Perfect time for trading - market activity is high');
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  }

  // Generate personalized insights
  generateInsights(profile: PersonalizationProfile): string[] {
    const insights: string[] = [];

    // Usage insights
    const totalActions = Object.values(profile.behavior.featureUsageCount).reduce((a, b) => a + b, 0);
    if (totalActions > 50) {
      insights.push(`You're a power user with ${totalActions} platform interactions`);
    }

    // Currency insights
    if (profile.behavior.mostUsedCurrency === 'FLBY') {
      insights.push('You save an average of 10% on fees by using FLBY tokens');
    }

    // Trading insights
    if (profile.behavior.tradingPattern === 'conservative') {
      insights.push('Your conservative approach minimizes risk while maintaining growth');
    }

    // Engagement insights
    if (profile.engagementLevel === 'high') {
      insights.push('You\'re in the top 10% of most engaged users');
    }

    return insights;
  }

  // Get personalized dashboard configuration
  getDashboardConfig(profile: PersonalizationProfile): any {
    const config = {
      theme: profile.preferences.theme,
      layout: profile.preferences.dashboard.layout,
      widgets: profile.preferences.dashboard.widgets,
      quickActions: this.getQuickActions(profile),
      featuredContent: this.getFeaturedContent(profile),
      notifications: this.getPersonalizedNotifications(profile)
    };

    return config;
  }

  // Get quick actions based on user behavior
  private getQuickActions(profile: PersonalizationProfile): string[] {
    const actions: string[] = [];
    
    const topFeatures = Object.entries(profile.behavior.featureUsageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([feature]) => feature);

    topFeatures.forEach(feature => {
      switch (feature) {
        case 'mint':
          actions.push('Quick Mint');
          break;
        case 'trade':
          actions.push('Quick Trade');
          break;
        case 'stake':
          actions.push('Stake FLBY');
          break;
        case 'portfolio':
          actions.push('View Portfolio');
          break;
      }
    });

    return actions;
  }

  // Get featured content based on user segment
  private getFeaturedContent(profile: PersonalizationProfile): any[] {
    const content: any[] = [];

    switch (profile.userSegment) {
      case 'casual':
        content.push({
          type: 'tutorial',
          title: 'Getting Started with Token Messaging',
          priority: 'high'
        });
        break;
      case 'trader':
        content.push({
          type: 'market_analysis',
          title: 'Token Market Trends',
          priority: 'high'
        });
        break;
      case 'enterprise':
        content.push({
          type: 'feature',
          title: 'Enterprise Marketing Tools',
          priority: 'medium'
        });
        break;
      case 'whale':
        content.push({
          type: 'exclusive',
          title: 'VIP Governance Access',
          priority: 'high'
        });
        break;
    }

    return content;
  }

  // Get personalized notifications
  private getPersonalizedNotifications(profile: PersonalizationProfile): any[] {
    const notifications: any[] = [];

    if (profile.preferences.notifications.transactionUpdates) {
      notifications.push({
        type: 'transaction',
        message: 'Your recent mint transaction was successful',
        priority: 'high'
      });
    }

    if (profile.engagementLevel === 'high' && profile.preferences.notifications.communityUpdates) {
      notifications.push({
        type: 'community',
        message: 'New governance proposal needs your vote',
        priority: 'medium'
      });
    }

    return notifications;
  }

  // Helper methods
  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'electric',
      defaultCurrency: 'SOL',
      notifications: {
        email: true,
        push: true,
        sms: false,
        transactionUpdates: true,
        marketingUpdates: false,
        communityUpdates: true
      },
      dashboard: {
        layout: 'grid',
        widgets: ['portfolio', 'recent_activity', 'recommendations'],
        chartType: 'line'
      },
      trading: {
        defaultQuantity: 10,
        riskLevel: 'medium',
        autoRebalance: false
      },
      privacy: {
        showPortfolio: true,
        shareActivity: true,
        allowAnalytics: true
      }
    };
  }

  private getDefaultBehavior(): UserBehavior {
    return {
      totalSessions: 0,
      averageSessionDuration: 0,
      preferredFeatures: [],
      mostUsedCurrency: 'SOL',
      tradingPattern: 'moderate',
      peakActivityHours: [],
      devicePreference: 'desktop',
      lastActiveFeature: '',
      featureUsageCount: {}
    };
  }

  private updatePreferredFeatures(profile: PersonalizationProfile, action: string): void {
    const usage = profile.behavior.featureUsageCount[action] || 0;
    if (usage > 5 && !profile.behavior.preferredFeatures.includes(action)) {
      profile.behavior.preferredFeatures.push(action);
    }
  }

  private analyzeTradingPattern(profile: PersonalizationProfile, metadata?: Record<string, any>): void {
    // Simple pattern analysis based on transaction frequency and amounts
    const totalTrades = Object.values(profile.behavior.featureUsageCount)
      .filter((_, index) => Object.keys(profile.behavior.featureUsageCount)[index].includes('trade'))
      .reduce((a, b) => a + b, 0);

    if (totalTrades < 5) {
      profile.behavior.tradingPattern = 'conservative';
    } else if (totalTrades < 20) {
      profile.behavior.tradingPattern = 'moderate';
    } else {
      profile.behavior.tradingPattern = 'aggressive';
    }
  }

  private updateEngagementLevel(profile: PersonalizationProfile): void {
    const totalActions = Object.values(profile.behavior.featureUsageCount).reduce((a, b) => a + b, 0);
    
    if (totalActions < 10) {
      profile.engagementLevel = 'low';
      profile.userSegment = 'casual';
    } else if (totalActions < 50) {
      profile.engagementLevel = 'medium';
      profile.userSegment = profile.behavior.tradingPattern === 'aggressive' ? 'trader' : 'casual';
    } else {
      profile.engagementLevel = 'high';
      
      // Determine segment based on behavior
      if (totalActions > 200) {
        profile.userSegment = 'whale';
      } else if (profile.behavior.tradingPattern === 'aggressive') {
        profile.userSegment = 'trader';
      } else {
        profile.userSegment = 'enterprise';
      }
    }
  }

  private async saveProfile(profile: PersonalizationProfile): Promise<void> {
    try {
      // In a real implementation, save to database
      // For now, we'll use the analytics system to store user preferences
      await storage.createAnalytics({
        date: new Date(),
        metric: 'personalization_update',
        value: `Profile updated for user ${profile.userId}`,
        metadata: {
          userId: profile.userId,
          preferences: profile.preferences,
          behavior: profile.behavior,
          segment: profile.userSegment,
          engagementLevel: profile.engagementLevel
        }
      });
    } catch (error) {
      errorTracker.logError(error as Error, undefined, 'error', ['personalization', 'save']);
    }
  }

  private async loadProfile(userId: string): Promise<PersonalizationProfile | null> {
    try {
      // Load from analytics data
      const analytics = await storage.getAnalytics();
      const userAnalytics = analytics.filter(entry => entry.metadata?.userId === userId);
      const personalizationData = userAnalytics.find((a: any) => a.metric === 'personalization_update');
      
      if (personalizationData?.metadata) {
        return {
          userId,
          preferences: personalizationData.metadata.preferences || this.getDefaultPreferences(),
          behavior: personalizationData.metadata.behavior || this.getDefaultBehavior(),
          recommendations: [],
          insights: [],
          riskScore: 0.5,
          engagementLevel: personalizationData.metadata.engagementLevel || 'medium',
          userSegment: personalizationData.metadata.segment || 'casual',
          createdAt: personalizationData.date,
          updatedAt: personalizationData.date
        };
      }
      
      return null;
    } catch (error) {
      errorTracker.logError(error as Error, undefined, 'error', ['personalization', 'load']);
      return null;
    }
  }
}

// Singleton instance
export const personalizationEngine = new PersonalizationEngine();