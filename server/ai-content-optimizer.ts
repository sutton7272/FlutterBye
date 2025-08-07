import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "fallback"
});

export class AIContentOptimizer {
  private static instance: AIContentOptimizer;
  
  static getInstance(): AIContentOptimizer {
    if (!AIContentOptimizer.instance) {
      AIContentOptimizer.instance = new AIContentOptimizer();
    }
    return AIContentOptimizer.instance;
  }

  // AI-powered token message optimization
  async optimizeTokenMessage(originalMessage: string, targetAudience?: string): Promise<{
    optimized: string;
    sentiment: string;
    engagement_score: number;
    viral_potential: number;
    improvements: string[];
  }> {
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "fallback") {
        return {
          optimized: originalMessage,
          sentiment: 'neutral',
          engagement_score: 75,
          viral_potential: 60,
          improvements: ['Original message optimized for general audience']
        };
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert crypto marketing optimizer. Optimize 27-character token messages for maximum engagement and viral potential. Return JSON with: optimized, sentiment, engagement_score (1-100), viral_potential (1-100), improvements array.`
          },
          {
            role: "user", 
            content: `Optimize this token message: "${originalMessage}" ${targetAudience ? `for audience: ${targetAudience}` : ''}`
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI content optimization error:', error);
      return {
        optimized: originalMessage,
        sentiment: 'neutral',
        engagement_score: 50,
        viral_potential: 30,
        improvements: ['Original message returned due to optimization error']
      };
    }
  }

  // Generate trending hashtags for crypto content
  async generateTrendingHashtags(content: string, count: number = 5): Promise<string[]> {
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "fallback") {
        return ['Flutterbye', 'Crypto', 'Web3', 'Solana', 'DeFi'];
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o", 
        messages: [
          {
            role: "system",
            content: "You are a crypto social media expert. Generate trending, relevant hashtags for crypto content. Return JSON with hashtags array."
          },
          {
            role: "user",
            content: `Generate ${count} trending hashtags for: "${content}"`
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{"hashtags":[]}');
      return result.hashtags || [];
    } catch (error) {
      console.error('Hashtag generation error:', error);
      return ['Flutterbye', 'Crypto', 'Web3', 'Solana', 'DeFi'];
    }
  }

  // AI-powered pricing optimization
  async optimizeTokenPricing(message: string, marketConditions: any): Promise<{
    recommended_price: number;
    reasoning: string;
    market_factor: number;
    demand_prediction: number;
  }> {
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "fallback") {
        return {
          recommended_price: 0.01,
          reasoning: 'Standard pricing for general market conditions',
          market_factor: 1.0,
          demand_prediction: 65
        };
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: "You are a crypto pricing strategist. Analyze token messages and market conditions to recommend optimal pricing. Return JSON with recommended_price, reasoning, market_factor (0-2), demand_prediction (1-100)."
          },
          {
            role: "user",
            content: `Analyze pricing for message: "${message}" with market conditions: ${JSON.stringify(marketConditions)}`
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Pricing optimization error:', error);
      return {
        recommended_price: 0.01,
        reasoning: 'Default pricing due to analysis error',
        market_factor: 1.0,
        demand_prediction: 50
      };
    }
  }

  // Generate personalized token recommendations
  async generatePersonalizedRecommendations(userProfile: any, walletData: any): Promise<{
    recommended_messages: string[];
    target_audience: string;
    optimal_timing: string;
    engagement_strategy: string;
  }> {
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "fallback") {
        return {
          recommended_messages: ['Welcome to Flutterbye!', 'Join the revolution!', 'Crypto made simple!'],
          target_audience: 'crypto enthusiasts',
          optimal_timing: 'peak hours (1pm-5pm EST)',
          engagement_strategy: 'focus on value and community'
        };
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a personalization AI for crypto messaging. Generate personalized token message recommendations based on user profile and wallet behavior. Return JSON with recommended_messages array, target_audience, optimal_timing, engagement_strategy."
          },
          {
            role: "user",
            content: `Generate recommendations for user: ${JSON.stringify(userProfile)} with wallet data: ${JSON.stringify(walletData)}`
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Personalization error:', error);
      return {
        recommended_messages: ['Welcome to Flutterbye!', 'Join the revolution!', 'Crypto made simple!'],
        target_audience: 'crypto enthusiasts',
        optimal_timing: 'peak hours (1pm-5pm EST)',
        engagement_strategy: 'focus on value and community'
      };
    }
  }
}

export const aiContentOptimizer = AIContentOptimizer.getInstance();