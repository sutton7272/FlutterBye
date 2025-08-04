import { storage } from "./storage";
import { stripeService } from "./stripe-service";

export interface FlutterAIPricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    walletsPerMonth: number;
    apiCallsPerMonth: number;
    batchAnalysisSize: number;
    marketingInsights: boolean;
    realTimeAnalytics: boolean;
    exportData: boolean;
    prioritySupport: boolean;
  };
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

export interface FlutterAIUsage {
  userId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  walletsAnalyzed: number;
  apiCallsMade: number;
  batchAnalysisUsed: number;
  lastUpdated: Date;
}

export interface FlutterAISubscription {
  userId: string;
  tierId: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * FlutterAI Pricing and Monetization Service
 * 
 * Comprehensive monetization system for FlutterAI intelligence features
 * with Stripe integration and usage tracking
 */
export class FlutterAIPricingService {
  
  // Pricing tiers configuration
  private pricingTiers: FlutterAIPricingTier[] = [
    {
      id: 'free',
      name: 'Free Explorer',
      description: 'Perfect for getting started with wallet intelligence',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '10 wallet analyses per month',
        '100 API calls per month',
        'Basic social credit scoring',
        'Community support'
      ],
      limits: {
        walletsPerMonth: 10,
        apiCallsPerMonth: 100,
        batchAnalysisSize: 3,
        marketingInsights: false,
        realTimeAnalytics: false,
        exportData: false,
        prioritySupport: false
      }
    },
    {
      id: 'professional',
      name: 'Professional Marketer',
      description: 'Advanced intelligence for marketing professionals',
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        '500 wallet analyses per month',
        '5,000 API calls per month',
        'Advanced marketing insights',
        'Batch analysis (up to 25)',
        'Data export capabilities',
        'Real-time analytics',
        'Email support'
      ],
      limits: {
        walletsPerMonth: 500,
        apiCallsPerMonth: 5000,
        batchAnalysisSize: 25,
        marketingInsights: true,
        realTimeAnalytics: true,
        exportData: true,
        prioritySupport: false
      },
      stripePriceIdMonthly: 'price_professional_monthly',
      stripePriceIdYearly: 'price_professional_yearly'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Intelligence',
      description: 'Unlimited intelligence for large organizations',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        'Unlimited wallet analyses',
        'Unlimited API calls',
        'Advanced marketing automation',
        'Unlimited batch processing',
        'Priority API access',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantees'
      ],
      limits: {
        walletsPerMonth: -1, // Unlimited
        apiCallsPerMonth: -1, // Unlimited
        batchAnalysisSize: -1, // Unlimited
        marketingInsights: true,
        realTimeAnalytics: true,
        exportData: true,
        prioritySupport: true
      },
      stripePriceIdMonthly: 'price_enterprise_monthly',
      stripePriceIdYearly: 'price_enterprise_yearly'
    }
  ];

  constructor() {}

  /**
   * Get all pricing tiers
   */
  getPricingTiers(): FlutterAIPricingTier[] {
    return this.pricingTiers;
  }

  /**
   * Get specific pricing tier
   */
  getPricingTier(tierId: string): FlutterAIPricingTier | null {
    return this.pricingTiers.find(tier => tier.id === tierId) || null;
  }

  /**
   * Get user's current subscription
   */
  async getUserSubscription(userId: string): Promise<FlutterAISubscription | null> {
    try {
      // This would integrate with your database to get subscription info
      // For now, returning free tier as default
      return {
        userId,
        tierId: 'free',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
  }

  /**
   * Get user's current usage
   */
  async getUserUsage(userId: string): Promise<FlutterAIUsage> {
    try {
      // This would integrate with your database to get usage stats
      // For now, returning mock data
      const currentPeriodStart = new Date();
      currentPeriodStart.setDate(1); // Start of month
      
      const currentPeriodEnd = new Date(currentPeriodStart);
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      currentPeriodEnd.setDate(0); // End of month

      return {
        userId,
        currentPeriodStart,
        currentPeriodEnd,
        walletsAnalyzed: Math.floor(Math.random() * 50), // Mock data
        apiCallsMade: Math.floor(Math.random() * 500), // Mock data
        batchAnalysisUsed: Math.floor(Math.random() * 10), // Mock data
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error getting user usage:', error);
      throw error;
    }
  }

  /**
   * Check if user can perform action based on their subscription
   */
  async canPerformAction(
    userId: string, 
    action: 'analyze_wallet' | 'api_call' | 'batch_analysis' | 'export_data' | 'marketing_insights'
  ): Promise<{ allowed: boolean; reason?: string; upgradeRequired?: string }> {
    try {
      const subscription = await this.getUserSubscription(userId);
      const usage = await this.getUserUsage(userId);
      
      if (!subscription) {
        return { allowed: false, reason: 'No subscription found', upgradeRequired: 'professional' };
      }

      const tier = this.getPricingTier(subscription.tierId);
      if (!tier) {
        return { allowed: false, reason: 'Invalid subscription tier', upgradeRequired: 'professional' };
      }

      // Check specific action limits
      switch (action) {
        case 'analyze_wallet':
          if (tier.limits.walletsPerMonth === -1) return { allowed: true };
          if (usage.walletsAnalyzed >= tier.limits.walletsPerMonth) {
            return { 
              allowed: false, 
              reason: `Monthly wallet analysis limit reached (${tier.limits.walletsPerMonth})`,
              upgradeRequired: tier.id === 'free' ? 'professional' : 'enterprise'
            };
          }
          break;

        case 'api_call':
          if (tier.limits.apiCallsPerMonth === -1) return { allowed: true };
          if (usage.apiCallsMade >= tier.limits.apiCallsPerMonth) {
            return { 
              allowed: false, 
              reason: `Monthly API call limit reached (${tier.limits.apiCallsPerMonth})`,
              upgradeRequired: tier.id === 'free' ? 'professional' : 'enterprise'
            };
          }
          break;

        case 'batch_analysis':
          if (tier.limits.batchAnalysisSize === -1) return { allowed: true };
          if (usage.batchAnalysisUsed >= 10) { // Assuming 10 batch operations per month
            return { 
              allowed: false, 
              reason: 'Monthly batch analysis limit reached',
              upgradeRequired: tier.id === 'free' ? 'professional' : 'enterprise'
            };
          }
          break;

        case 'export_data':
          if (!tier.limits.exportData) {
            return { 
              allowed: false, 
              reason: 'Data export not available in your plan',
              upgradeRequired: 'professional'
            };
          }
          break;

        case 'marketing_insights':
          if (!tier.limits.marketingInsights) {
            return { 
              allowed: false, 
              reason: 'Marketing insights not available in your plan',
              upgradeRequired: 'professional'
            };
          }
          break;
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking action permission:', error);
      return { allowed: false, reason: 'Error checking permissions' };
    }
  }

  /**
   * Record usage for billing
   */
  async recordUsage(userId: string, action: string, quantity: number = 1): Promise<void> {
    try {
      // This would update usage in your database
      console.log(`Recording usage for user ${userId}: ${action} x${quantity}`);
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  }

  /**
   * Create Stripe checkout session for subscription
   */
  async createCheckoutSession(
    userId: string, 
    tierId: string, 
    billingPeriod: 'monthly' | 'yearly'
  ): Promise<{ checkoutUrl: string }> {
    try {
      const tier = this.getPricingTier(tierId);
      if (!tier) {
        throw new Error('Invalid pricing tier');
      }

      if (tierId === 'free') {
        throw new Error('Cannot create checkout for free tier');
      }

      const priceId = billingPeriod === 'monthly' 
        ? tier.stripePriceIdMonthly 
        : tier.stripePriceIdYearly;

      if (!priceId) {
        throw new Error('Price ID not configured for this tier');
      }

      // This would create a Stripe checkout session
      // For now, returning a mock URL
      const checkoutUrl = `https://checkout.stripe.com/pay/mock_session_for_${tierId}_${billingPeriod}`;
      
      return { checkoutUrl };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Get pricing analytics for admin dashboard
   */
  async getPricingAnalytics(): Promise<{
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    customersByTier: Record<string, number>;
    usageStats: {
      totalWalletsAnalyzed: number;
      totalApiCalls: number;
      avgWalletsPerUser: number;
    };
  }> {
    try {
      // This would query your database for real analytics
      return {
        totalRevenue: 24750, // Mock data
        monthlyRecurringRevenue: 8250, // Mock data
        customersByTier: {
          free: 1247,
          professional: 89,
          enterprise: 12
        },
        usageStats: {
          totalWalletsAnalyzed: 45678,
          totalApiCalls: 234567,
          avgWalletsPerUser: 34.2
        }
      };
    } catch (error) {
      console.error('Error getting pricing analytics:', error);
      throw error;
    }
  }
}

export const flutterAIPricingService = new FlutterAIPricingService();