import OpenAI from 'openai';
import { storage } from './storage';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface PricingContext {
  userId?: string;
  productType: string;
  currentPrice: number;
  userBehavior?: any;
  marketConditions?: any;
  demandLevel?: 'low' | 'medium' | 'high';
  timeOfDay?: number;
  dayOfWeek?: number;
}

interface OptimalPricing {
  suggestedPrice: number;
  priceMultiplier: number;
  reasoning: string;
  confidence: number;
  expectedConversion: number;
  revenueImpact: string;
}

export class DynamicPricingAI {
  private basePrice: Record<string, number> = {
    'token_creation': 0.1,
    'premium_features': 10.0,
    'ai_enhancement': 5.0,
    'viral_boost': 2.0
  };

  async calculateOptimalPrice(context: PricingContext): Promise<OptimalPricing> {
    try {
      // Get user value score
      const userValueScore = await this.getUserValueScore(context.userId);
      
      // Analyze market conditions
      const marketMultiplier = this.getMarketMultiplier(context);
      
      // Get AI pricing recommendation
      const aiRecommendation = await this.getAIPricingRecommendation(context, userValueScore);
      
      const basePrice = this.basePrice[context.productType] || context.currentPrice;
      const suggestedPrice = Math.max(0.01, basePrice * aiRecommendation.multiplier * marketMultiplier);
      
      return {
        suggestedPrice: Math.round(suggestedPrice * 100) / 100,
        priceMultiplier: aiRecommendation.multiplier * marketMultiplier,
        reasoning: aiRecommendation.reasoning,
        confidence: aiRecommendation.confidence,
        expectedConversion: aiRecommendation.expectedConversion,
        revenueImpact: this.calculateRevenueImpact(basePrice, suggestedPrice)
      };
    } catch (error) {
      console.error('Dynamic pricing calculation error:', error);
      return {
        suggestedPrice: context.currentPrice,
        priceMultiplier: 1.0,
        reasoning: 'Using default pricing due to calculation error',
        confidence: 0.5,
        expectedConversion: 0.1,
        revenueImpact: 'neutral'
      };
    }
  }

  private async getUserValueScore(userId?: string): Promise<number> {
    if (!userId) return 0.5; // Default for anonymous users
    
    try {
      // Get user data and calculate value score based on engagement, spending, etc.
      const user = await storage.getUser(parseInt(userId));
      if (!user) return 0.5;
      
      // Simple scoring based on user activity (0-1 scale)
      let score = 0.5;
      
      // Adjust based on user behavior patterns
      // This would be enhanced with real user metrics
      return Math.min(1.0, Math.max(0.1, score));
    } catch (error) {
      return 0.5;
    }
  }

  private getMarketMultiplier(context: PricingContext): number {
    let multiplier = 1.0;
    
    // Time-based pricing
    const hour = context.timeOfDay || new Date().getHours();
    if (hour >= 9 && hour <= 17) multiplier *= 1.1; // Business hours
    if (hour >= 18 && hour <= 22) multiplier *= 1.2; // Peak evening
    
    // Day of week
    const day = context.dayOfWeek || new Date().getDay();
    if (day >= 1 && day <= 5) multiplier *= 1.05; // Weekdays
    
    // Demand level
    switch (context.demandLevel) {
      case 'high': multiplier *= 1.3; break;
      case 'medium': multiplier *= 1.1; break;
      case 'low': multiplier *= 0.9; break;
    }
    
    return multiplier;
  }

  private async getAIPricingRecommendation(context: PricingContext, userValueScore: number): Promise<{
    multiplier: number;
    reasoning: string;
    confidence: number;
    expectedConversion: number;
  }> {
    try {
      const prompt = `
        Analyze optimal pricing for this context:
        - Product: ${context.productType}
        - Current Price: $${context.currentPrice}
        - User Value Score: ${userValueScore} (0-1 scale)
        - Market Conditions: ${JSON.stringify(context.marketConditions || {})}
        
        Provide pricing recommendation as JSON:
        {
          "multiplier": number (0.5-2.0),
          "reasoning": "brief explanation",
          "confidence": number (0-1),
          "expectedConversion": number (0-1)
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 300
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        multiplier: Math.min(2.0, Math.max(0.5, result.multiplier || 1.0)),
        reasoning: result.reasoning || 'AI-optimized pricing based on market analysis',
        confidence: Math.min(1.0, Math.max(0.0, result.confidence || 0.7)),
        expectedConversion: Math.min(1.0, Math.max(0.0, result.expectedConversion || 0.15))
      };
    } catch (error) {
      return {
        multiplier: 1.0,
        reasoning: 'Default pricing applied',
        confidence: 0.5,
        expectedConversion: 0.1
      };
    }
  }

  private calculateRevenueImpact(basePrice: number, suggestedPrice: number): string {
    const change = ((suggestedPrice - basePrice) / basePrice) * 100;
    
    if (change > 20) return '+25-50% revenue potential';
    if (change > 10) return '+15-25% revenue potential';
    if (change > 0) return '+5-15% revenue potential';
    if (change > -10) return 'neutral revenue impact';
    return 'cost-optimized pricing';
  }

  async trackPricingPerformance(productType: string, price: number, conversion: boolean): Promise<void> {
    // Track pricing performance for continuous optimization
    try {
      // This would store performance data for ML model training
      console.log(`Pricing performance: ${productType} at $${price} - Conversion: ${conversion}`);
    } catch (error) {
      console.error('Error tracking pricing performance:', error);
    }
  }

  async getBatchPricingRecommendations(contexts: PricingContext[]): Promise<OptimalPricing[]> {
    // Process multiple pricing recommendations efficiently
    return Promise.all(contexts.map(context => this.calculateOptimalPrice(context)));
  }
}