/**
 * AI Monetization Service - API monetization and subscription management
 */

import { openaiService } from './openai-service';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  aiCredits: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  advancedFeatures: string[];
}

interface APIUsageMetrics {
  userId: string;
  endpoint: string;
  requestCount: number;
  aiCreditsUsed: number;
  responseTime: number;
  timestamp: Date;
  subscriptionTier: string;
}

class AIMonetizationService {
  private subscriptionTiers: Map<string, SubscriptionTier> = new Map();
  private usageMetrics: APIUsageMetrics[] = [];
  private userSubscriptions: Map<string, string> = new Map(); // userId -> tierId

  constructor() {
    this.initializeSubscriptionTiers();
  }

  /**
   * Initialize subscription tiers for AI API monetization
   */
  private initializeSubscriptionTiers(): void {
    const tiers: SubscriptionTier[] = [
      {
        id: 'free',
        name: 'Free Tier',
        price: 0,
        currency: 'USD',
        features: [
          'Basic AI token creation',
          'Standard emotion analysis',
          'Community chat access',
          'Mobile app access'
        ],
        aiCredits: 100,
        rateLimit: {
          requestsPerMinute: 10,
          requestsPerDay: 1000
        },
        advancedFeatures: []
      },
      {
        id: 'starter',
        name: 'Starter Plan',
        price: 9.99,
        currency: 'USD',
        features: [
          'Advanced AI token creation',
          'Enhanced emotion analysis',
          'Priority chat support',
          'Voice-to-AI features',
          'Basic analytics dashboard'
        ],
        aiCredits: 1000,
        rateLimit: {
          requestsPerMinute: 30,
          requestsPerDay: 5000
        },
        advancedFeatures: ['voice_to_ai', 'basic_analytics']
      },
      {
        id: 'professional',
        name: 'Professional Plan',
        price: 29.99,
        currency: 'USD',
        features: [
          'All Starter features',
          'Cross-platform content generation',
          'Brand intelligence reports',
          'Competitive analysis',
          'Advanced gamification AI',
          'Social media AI bridge'
        ],
        aiCredits: 5000,
        rateLimit: {
          requestsPerMinute: 100,
          requestsPerDay: 20000
        },
        advancedFeatures: [
          'cross_platform_content',
          'brand_intelligence',
          'competitive_analysis',
          'advanced_gamification',
          'social_media_bridge'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        price: 99.99,
        currency: 'USD',
        features: [
          'All Professional features',
          'Enterprise AI dashboard',
          'Edge AI optimization',
          'Custom AI model training',
          'White-label solutions',
          'Dedicated support',
          'SLA guarantees'
        ],
        aiCredits: 25000,
        rateLimit: {
          requestsPerMinute: 500,
          requestsPerDay: 100000
        },
        advancedFeatures: [
          'enterprise_dashboard',
          'edge_optimization',
          'custom_training',
          'white_label',
          'sla_support',
          'unlimited_features'
        ]
      },
      {
        id: 'ultimate',
        name: 'Ultimate Plan',
        price: 299.99,
        currency: 'USD',
        features: [
          'All Enterprise features',
          'Unlimited AI credits',
          'Custom deployment',
          'Advanced API access',
          'Priority feature development',
          'Dedicated account manager'
        ],
        aiCredits: -1, // Unlimited
        rateLimit: {
          requestsPerMinute: 1000,
          requestsPerDay: -1 // Unlimited
        },
        advancedFeatures: [
          'unlimited_everything',
          'custom_deployment',
          'priority_development',
          'dedicated_manager'
        ]
      }
    ];

    tiers.forEach(tier => {
      this.subscriptionTiers.set(tier.id, tier);
    });
  }

  /**
   * Get all available subscription tiers
   */
  getSubscriptionTiers(): SubscriptionTier[] {
    return Array.from(this.subscriptionTiers.values());
  }

  /**
   * Get user's current subscription tier
   */
  getUserSubscriptionTier(userId: string): SubscriptionTier {
    const tierId = this.userSubscriptions.get(userId) || 'free';
    return this.subscriptionTiers.get(tierId) || this.subscriptionTiers.get('free')!;
  }

  /**
   * Check if user has access to a specific feature
   */
  hasFeatureAccess(userId: string, feature: string): boolean {
    const userTier = this.getUserSubscriptionTier(userId);
    return userTier.advancedFeatures.includes(feature) || 
           userTier.advancedFeatures.includes('unlimited_everything');
  }

  /**
   * Check if user is within rate limits
   */
  async checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
    const userTier = this.getUserSubscriptionTier(userId);
    
    // Count recent requests
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentMinuteRequests = this.usageMetrics.filter(
      metric => metric.userId === userId && metric.timestamp > oneMinuteAgo
    ).length;
    
    const recentDayRequests = this.usageMetrics.filter(
      metric => metric.userId === userId && metric.timestamp > oneDayAgo
    ).length;
    
    const withinMinuteLimit = userTier.rateLimit.requestsPerMinute === -1 || 
                             recentMinuteRequests < userTier.rateLimit.requestsPerMinute;
    
    const withinDayLimit = userTier.rateLimit.requestsPerDay === -1 || 
                          recentDayRequests < userTier.rateLimit.requestsPerDay;
    
    const allowed = withinMinuteLimit && withinDayLimit;
    const remaining = userTier.rateLimit.requestsPerDay === -1 ? 
                     -1 : userTier.rateLimit.requestsPerDay - recentDayRequests;
    
    return { allowed, remaining };
  }

  /**
   * Record API usage for billing and analytics
   */
  async recordAPIUsage(
    userId: string,
    endpoint: string,
    aiCreditsUsed: number = 1,
    responseTime: number = 0
  ): Promise<void> {
    const userTier = this.getUserSubscriptionTier(userId);
    
    const usage: APIUsageMetrics = {
      userId,
      endpoint,
      requestCount: 1,
      aiCreditsUsed,
      responseTime,
      timestamp: new Date(),
      subscriptionTier: userTier.id
    };
    
    this.usageMetrics.push(usage);
    
    // Keep only last 30 days of metrics
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    this.usageMetrics = this.usageMetrics.filter(metric => metric.timestamp > thirtyDaysAgo);
  }

  /**
   * Generate AI-powered pricing recommendations
   */
  async generatePricingRecommendations(
    userId: string,
    usagePattern: any
  ): Promise<any> {
    
    const currentTier = this.getUserSubscriptionTier(userId);
    const userMetrics = this.getUserUsageMetrics(userId);
    
    const recommendations = await openaiService.generateResponse(`
      Generate personalized pricing recommendations for AI API user:
      
      Current Tier: ${currentTier.name} ($${currentTier.price}/month)
      Monthly Usage: ${userMetrics.totalRequests} requests
      AI Credits Used: ${userMetrics.totalCreditsUsed}
      Most Used Features: ${userMetrics.topFeatures.join(', ')}
      Average Response Time: ${userMetrics.avgResponseTime}ms
      
      Available Tiers: ${this.getSubscriptionTiers().map(t => `${t.name} ($${t.price})`).join(', ')}
      
      Provide personalized recommendations in JSON format:
      {
        "currentAnalysis": {
          "utilizationRate": "percentage of current tier usage",
          "costEfficiency": "how cost-effective current tier is",
          "bottlenecks": ["limitation 1", "limitation 2"]
        },
        "recommendations": [
          {
            "action": "upgrade/downgrade/stay",
            "targetTier": "recommended tier name",
            "reasoning": "why this recommendation",
            "savings": "potential cost savings or value gained",
            "timeline": "when to make this change"
          }
        ],
        "optimizations": {
          "usageOptimization": ["optimization tip 1", "optimization tip 2"],
          "costReduction": ["cost reduction strategy 1", "cost reduction strategy 2"],
          "featureRecommendations": ["feature to try 1", "feature to try 2"]
        },
        "futureProjections": {
          "expectedGrowth": "predicted usage growth",
          "recommendedPath": "suggested upgrade path",
          "budgetPlanning": "budget planning advice"
        }
      }
    `, {
      response_format: { type: "json_object" },
      temperature: 0.5
    });

    return JSON.parse(recommendations);
  }

  /**
   * Generate usage analytics and insights
   */
  async generateUsageAnalytics(userId: string): Promise<any> {
    const userMetrics = this.getUserUsageMetrics(userId);
    const currentTier = this.getUserSubscriptionTier(userId);
    
    const analytics = await openaiService.generateResponse(`
      Generate comprehensive usage analytics for AI API user:
      
      User Tier: ${currentTier.name}
      Total Requests: ${userMetrics.totalRequests}
      AI Credits Used: ${userMetrics.totalCreditsUsed}
      Top Features: ${userMetrics.topFeatures.join(', ')}
      Peak Usage Times: ${userMetrics.peakTimes.join(', ')}
      
      Provide detailed analytics in JSON format:
      {
        "usageSummary": {
          "totalRequests": ${userMetrics.totalRequests},
          "successRate": "percentage of successful requests",
          "averageResponseTime": "${userMetrics.avgResponseTime}ms",
          "creditsUtilization": "percentage of tier credits used"
        },
        "trendAnalysis": {
          "weeklyGrowth": "weekly usage growth percentage",
          "popularFeatures": ["feature 1", "feature 2", "feature 3"],
          "usagePatterns": "description of usage patterns",
          "seasonality": "seasonal usage trends if any"
        },
        "performanceMetrics": {
          "apiLatency": "average API response time",
          "errorRate": "percentage of failed requests",
          "peakUsageHours": ["hour1", "hour2", "hour3"],
          "optimalUsageTimes": ["time1", "time2"]
        },
        "insights": {
          "efficiencyScore": "overall efficiency rating 1-10",
          "costPerRequest": "average cost per successful request",
          "valueRealization": "how well user utilizes paid features",
          "improvementAreas": ["area 1", "area 2"]
        },
        "recommendations": {
          "immediate": ["immediate action 1", "immediate action 2"],
          "shortTerm": ["1-month goal 1", "1-month goal 2"],
          "longTerm": ["strategic recommendation 1", "strategic recommendation 2"]
        }
      }
    `, {
      response_format: { type: "json_object" },
      temperature: 0.4
    });

    return JSON.parse(analytics);
  }

  /**
   * Get user usage metrics
   */
  private getUserUsageMetrics(userId: string): any {
    const userMetrics = this.usageMetrics.filter(metric => metric.userId === userId);
    
    if (userMetrics.length === 0) {
      return {
        totalRequests: 0,
        totalCreditsUsed: 0,
        avgResponseTime: 0,
        topFeatures: [],
        peakTimes: []
      };
    }
    
    const totalRequests = userMetrics.length;
    const totalCreditsUsed = userMetrics.reduce((sum, metric) => sum + metric.aiCreditsUsed, 0);
    const avgResponseTime = userMetrics.reduce((sum, metric) => sum + metric.responseTime, 0) / totalRequests;
    
    // Analyze top features
    const featureCount = new Map<string, number>();
    userMetrics.forEach(metric => {
      const feature = metric.endpoint.split('/').pop() || 'unknown';
      featureCount.set(feature, (featureCount.get(feature) || 0) + 1);
    });
    
    const topFeatures = Array.from(featureCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([feature]) => feature);
    
    // Analyze peak times
    const hourCount = new Map<number, number>();
    userMetrics.forEach(metric => {
      const hour = metric.timestamp.getHours();
      hourCount.set(hour, (hourCount.get(hour) || 0) + 1);
    });
    
    const peakTimes = Array.from(hourCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`);
    
    return {
      totalRequests,
      totalCreditsUsed,
      avgResponseTime: Math.round(avgResponseTime),
      topFeatures,
      peakTimes
    };
  }

  /**
   * Upgrade user subscription
   */
  async upgradeSubscription(userId: string, newTierId: string): Promise<{ success: boolean; message: string }> {
    const newTier = this.subscriptionTiers.get(newTierId);
    
    if (!newTier) {
      return { success: false, message: 'Invalid subscription tier' };
    }
    
    const currentTier = this.getUserSubscriptionTier(userId);
    
    if (newTier.price <= currentTier.price) {
      return { success: false, message: 'Cannot downgrade using upgrade method' };
    }
    
    this.userSubscriptions.set(userId, newTierId);
    
    return { 
      success: true, 
      message: `Successfully upgraded to ${newTier.name}` 
    };
  }

  /**
   * Get API monetization dashboard data
   */
  async getMonetizationDashboard(): Promise<any> {
    const totalUsers = this.userSubscriptions.size;
    const tierDistribution = new Map<string, number>();
    
    // Count users by tier
    this.userSubscriptions.forEach(tierId => {
      tierDistribution.set(tierId, (tierDistribution.get(tierId) || 0) + 1);
    });
    
    // Calculate revenue
    let totalRevenue = 0;
    tierDistribution.forEach((count, tierId) => {
      const tier = this.subscriptionTiers.get(tierId);
      if (tier) {
        totalRevenue += tier.price * count;
      }
    });
    
    return {
      totalUsers,
      totalRevenue,
      tierDistribution: Object.fromEntries(tierDistribution),
      averageRevenuePerUser: totalUsers > 0 ? totalRevenue / totalUsers : 0,
      subscriptionTiers: this.getSubscriptionTiers()
    };
  }
}

export const aiMonetizationService = new AIMonetizationService();