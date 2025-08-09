import OpenAI from "openai";
import { storage } from "./storage";
import type { 
  FlutterinaConversation,
  InsertFlutterinaConversation,
  FlutterinaMessage,
  InsertFlutterinaMessage,
  FlutterinaPersonalityProfile,
  InsertFlutterinaPersonalityProfile
} from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export class FlutterinaAIService {
  // Cost Control Configuration
  private maxTokensPerUser = 10000; // Daily token limit per user
  private maxTokensGlobal = 100000; // Daily global token limit
  private tokenUsageTracking: Map<string, { daily: number, lastReset: Date }> = new Map();
  private globalTokenUsage = { daily: 0, lastReset: new Date() };
  private isSystemEnabled = true; // Admin toggle to disable entire system
  
  /**
   * PHASE 1: Basic floating chat with page context
   */
  async createOrGetConversation(sessionId: string, currentPage: string, userId?: string, walletAddress?: string): Promise<FlutterinaConversation> {
    try {
      // Try to get existing conversation
      let conversation = await storage.getFlutterinaConversationBySession(sessionId);
      
      if (!conversation) {
        // Create new conversation
        const conversationData: InsertFlutterinaConversation = {
          sessionId,
          currentPage,
          pageContext: [{ initialPage: currentPage, timestamp: new Date().toISOString() }],
          userIntent: "help",
          userId,
          walletAddress
        };
        
        conversation = await storage.createFlutterinaConversation(conversationData);
      } else {
        // Update current page if changed
        if (conversation.currentPage !== currentPage) {
          conversation = await storage.updateFlutterinaConversation(conversation.id, {
            currentPage,
            pageContext: { 
              ...conversation.pageContext,
              lastPage: conversation.currentPage,
              updatedAt: new Date().toISOString()
            }
          });
        }
      }
      
      return conversation;
    } catch (error) {
      console.error("Error creating/getting conversation:", error);
      throw new Error("Failed to initialize conversation");
    }
  }

  /**
   * Cost Control Methods
   */
  async checkSystemEnabled(): Promise<boolean> {
    return this.isSystemEnabled;
  }

  async setSystemEnabled(enabled: boolean, adminUserId?: string): Promise<void> {
    this.isSystemEnabled = enabled;
    console.log(`Flutterina system ${enabled ? 'enabled' : 'disabled'} by admin: ${adminUserId}`);
  }

  private resetTokenUsageIfNeeded(userId: string): void {
    const now = new Date();
    const userUsage = this.tokenUsageTracking.get(userId);
    
    // Reset user usage if new day
    if (userUsage && now.getDate() !== userUsage.lastReset.getDate()) {
      this.tokenUsageTracking.set(userId, { daily: 0, lastReset: now });
    }
    
    // Reset global usage if new day
    if (now.getDate() !== this.globalTokenUsage.lastReset.getDate()) {
      this.globalTokenUsage = { daily: 0, lastReset: now };
    }
  }

  private async checkTokenLimits(userId: string, estimatedTokens: number = 500): Promise<{ allowed: boolean, reason?: string }> {
    if (!this.isSystemEnabled) {
      return { allowed: false, reason: 'Flutterina system is currently disabled by administrator.' };
    }

    this.resetTokenUsageIfNeeded(userId);
    
    const userUsage = this.tokenUsageTracking.get(userId) || { daily: 0, lastReset: new Date() };
    
    // Check user limits
    if (userUsage.daily + estimatedTokens > this.maxTokensPerUser) {
      return { allowed: false, reason: 'Daily token limit reached. Try again tomorrow or contact support for increased limits.' };
    }
    
    // Check global limits
    if (this.globalTokenUsage.daily + estimatedTokens > this.maxTokensGlobal) {
      return { allowed: false, reason: 'System-wide token limit reached. Please try again later.' };
    }
    
    return { allowed: true };
  }

  private updateTokenUsage(userId: string, tokensUsed: number): void {
    const userUsage = this.tokenUsageTracking.get(userId) || { daily: 0, lastReset: new Date() };
    userUsage.daily += tokensUsed;
    this.tokenUsageTracking.set(userId, userUsage);
    
    this.globalTokenUsage.daily += tokensUsed;
  }

  async getUsageStats(userId?: string): Promise<{ userUsage?: any, globalUsage: any, limits: any }> {
    const userUsage = userId ? this.tokenUsageTracking.get(userId) : undefined;
    return {
      userUsage: userUsage ? {
        daily: userUsage.daily,
        remaining: this.maxTokensPerUser - userUsage.daily,
        lastReset: userUsage.lastReset
      } : undefined,
      globalUsage: {
        daily: this.globalTokenUsage.daily,
        remaining: this.maxTokensGlobal - this.globalTokenUsage.daily,
        lastReset: this.globalTokenUsage.lastReset
      },
      limits: {
        userDaily: this.maxTokensPerUser,
        globalDaily: this.maxTokensGlobal,
        systemEnabled: this.isSystemEnabled
      }
    };
  }

  /**
   * Generate context-aware AI response using GPT-4o with cost controls
   */
  async generateResponse(
    message: string, 
    conversation: FlutterinaConversation, 
    messageHistory: FlutterinaMessage[] = []
  ): Promise<{
    response: string;
    containsRecommendations: boolean;
    recommendationData?: {
      products: string[];
      actions: string[];
      links: Array<{ url: string; title: string }>;
    };
    tokenUsage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    costInfo?: {
      allowed: boolean;
      reason?: string;
      usageStats?: any;
    };
  }> {
    try {
      const startTime = Date.now();
      const userId = conversation.userId || 'anonymous';
      
      // Check cost limits first
      const limitCheck = await this.checkTokenLimits(userId, 500);
      if (!limitCheck.allowed) {
        return {
          response: limitCheck.reason || 'Service temporarily unavailable.',
          containsRecommendations: false,
          recommendationData: { products: [], actions: [], links: [] },
          costInfo: { allowed: false, reason: limitCheck.reason }
        };
      }
      
      // Build context-aware system prompt
      const systemPrompt = this.buildSystemPrompt(conversation, messageHistory);
      
      // Build conversation history for context
      const conversationMessages = [
        { role: "system" as const, content: systemPrompt },
        ...messageHistory.slice(-10).map(msg => ({
          role: msg.messageType === "user" ? "user" as const : "assistant" as const,
          content: msg.message
        })),
        { role: "user" as const, content: message }
      ];

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: conversationMessages,
        max_tokens: 500,
        temperature: 0.8,
        response_format: { type: "json_object" }
      });

      const responseTime = Date.now() - startTime;
      const aiResponse = JSON.parse(response.choices[0].message.content || "{}");
      
      // Track token usage for cost control
      const tokensUsed = response.usage?.total_tokens || 0;
      this.updateTokenUsage(userId, tokensUsed);
      
      const usageStats = await this.getUsageStats(userId);
      
      return {
        response: aiResponse.message || "I'm here to help! Could you tell me more about what you need?",
        containsRecommendations: aiResponse.hasRecommendations || false,
        recommendationData: aiResponse.recommendations || { products: [], actions: [], links: [] },
        tokenUsage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        },
        costInfo: { allowed: true, usageStats }
      };
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Fallback response
      return {
        response: "I'm experiencing some technical difficulties right now, but I'm still here to help! Could you try rephrasing your question?",
        containsRecommendations: false,
        recommendationData: { products: [], actions: [], links: [] }
      };
    }
  }

  /**
   * Build context-aware system prompt based on current page and user state
   */
  private buildSystemPrompt(conversation: FlutterinaConversation, messageHistory: FlutterinaMessage[]): string {
    const currentPage = conversation.currentPage;
    const relationshipLevel = conversation.relationshipLevel;
    const totalMessages = conversation.totalMessages;
    
    let pageContext = "";
    
    // Generate page-specific context
    switch (currentPage) {
      case "/":
        pageContext = "User is on the homepage. Focus on helping them understand Flutterbye's core features: tokenized messaging, value attachment, and blockchain communication.";
        break;
      case "/create":
        pageContext = "User is on the token creation page. Help them understand how to create tokens, attach value, set expiration dates, and customize their messages.";
        break;
      case "/marketplace":
        pageContext = "User is on the marketplace. Help them discover tokens, understand pricing, and guide them through purchasing decisions.";
        break;
      case "/chat":
        pageContext = "User is in the chat system. Help them understand real-time blockchain messaging, token sharing, and community features.";
        break;
      case "/info":
        pageContext = "User is viewing platform information. Help them understand features, pricing, or provide detailed explanations about specific capabilities.";
        break;
      case "/flutterai-dashboard":
        pageContext = "User is on the FlutterAI dashboard. Help them with wallet intelligence, analytics, scoring systems, and AI-powered insights.";
        break;
      default:
        pageContext = "User is exploring the platform. Provide helpful guidance based on their questions and suggest relevant features.";
    }

    return `You are Flutterina, a friendly and intelligent AI companion for the Flutterbye platform. You are knowledgeable, helpful, and have a warm personality that builds relationships with users.

PERSONALITY: ${relationshipLevel === "new" ? "Introduce yourself warmly and be extra helpful with explanations." : "You know this user and can be more casual and personal."}

CONTEXT: ${pageContext}

RELATIONSHIP LEVEL: ${relationshipLevel} (${totalMessages} messages exchanged)

PLATFORM KNOWLEDGE:
- Flutterbye is a Web3 platform for tokenized messaging on Solana blockchain
- Users can create SPL tokens with attached messages and value
- Features include: token creation, value attachment, burn-to-redeem, marketplace, chat, FlutterAI analytics
- Core currencies: SOL, USDC, FLBY (platform token)
- FlutterAI provides wallet intelligence and viral growth analytics

RESPONSE FORMAT: Respond in JSON format:
{
  "message": "Your helpful response here",
  "hasRecommendations": boolean,
  "recommendations": {
    "products": ["relevant features/products"],
    "actions": ["suggested next steps"],
    "links": [{"url": "/path", "title": "Link title"}]
  }
}

GUIDELINES:
- Be conversational and friendly, not robotic
- Provide specific, actionable help
- Reference the current page context when relevant
- Suggest relevant platform features naturally
- Keep responses concise but informative
- Ask follow-up questions to better help the user
- Remember you're building a relationship - be personal but professional`;
  }

  /**
   * Save user message to conversation
   */
  async saveMessage(
    conversationId: string,
    message: string,
    messageType: "user" | "assistant" | "system",
    pageContext: string,
    actionContext?: Record<string, any>,
    responseData?: {
      containsRecommendations: boolean;
      recommendationData?: any;
      tokenUsage?: any;
      responseTime?: number;
    }
  ): Promise<FlutterinaMessage> {
    try {
      const messageData: InsertFlutterinaMessage = {
        conversationId,
        message,
        messageType,
        pageContext,
        actionContext: actionContext || {},
        containsRecommendations: responseData?.containsRecommendations || false,
        recommendationData: responseData?.recommendationData,
        tokenUsage: responseData?.tokenUsage,
        responseTime: responseData?.responseTime
      };

      const savedMessage = await storage.createFlutterinaMessage(messageData);
      
      // Update conversation message count
      await storage.updateFlutterinaConversation(conversationId, {
        totalMessages: (await storage.getFlutterinaMessages(conversationId)).length,
        lastInteractionAt: new Date()
      });

      return savedMessage;
    } catch (error) {
      console.error("Error saving message:", error);
      throw new Error("Failed to save message");
    }
  }

  /**
   * PHASE 2: Wallet intelligence integration
   */
  async getWalletInsights(walletAddress: string): Promise<{
    riskScore: number;
    behaviorPatterns: string[];
    recommendations: string[];
    experienceLevel: string;
    activityLevel: string;
    preferredCurrencies: string[];
    walletValue: number;
    marketingSegment: string;
  }> {
    try {
      // Get comprehensive wallet intelligence from existing FlutterAI system
      const walletData = await storage.getWalletIntelligence(walletAddress);
      
      if (!walletData) {
        return {
          riskScore: 0.5,
          behaviorPatterns: ['new_user'],
          recommendations: ['start_with_token_creation', 'explore_marketplace'],
          experienceLevel: 'beginner',
          activityLevel: 'low',
          preferredCurrencies: ['SOL'],
          walletValue: 0,
          marketingSegment: 'new_user'
        };
      }

      // Extract insights from wallet intelligence using correct schema properties
      const insights = {
        riskScore: (walletData.socialCreditScore || 0) / 100, // Convert to 0-1 scale
        behaviorPatterns: this.extractBehaviorPatterns(walletData),
        recommendations: this.generateWalletRecommendations(walletData),
        experienceLevel: this.determineExperienceLevel(walletData),
        activityLevel: this.determineActivityLevel(walletData),
        preferredCurrencies: walletData.preferredTokenTypes || ['SOL'],
        walletValue: this.estimateWalletValue(walletData),
        marketingSegment: walletData.marketingSegment || 'new_user'
      };

      return insights;
    } catch (error) {
      console.error('Error getting wallet insights:', error);
      return {
        riskScore: 0.5,
        behaviorPatterns: ['error_retrieving_data'],
        recommendations: ['verify_wallet_connection'],
        experienceLevel: 'unknown',
        activityLevel: 'unknown',
        preferredCurrencies: ['SOL'],
        walletValue: 0,
        marketingSegment: 'unknown'
      };
    }
  }

  private extractBehaviorPatterns(walletData: any): string[] {
    const patterns = [];
    
    if (walletData.frequentTransactionTimes) {
      patterns.push(`active_during_${walletData.frequentTransactionTimes[0]}`);
    }
    
    if (walletData.averageTransactionValue > 100) {
      patterns.push('high_value_transactions');
    } else if (walletData.averageTransactionValue < 10) {
      patterns.push('micro_transactions');
    }
    
    if (walletData.tokenCreationCount > 5) {
      patterns.push('active_token_creator');
    }
    
    if (walletData.socialInteractions > 10) {
      patterns.push('social_trader');
    }
    
    return patterns.length > 0 ? patterns : ['standard_user'];
  }

  private generateWalletRecommendations(walletData: any): string[] {
    const recommendations = [];
    
    if (walletData.experienceLevel === 'beginner') {
      recommendations.push('explore_token_creation_tutorial');
      recommendations.push('start_with_small_amounts');
    } else if (walletData.experienceLevel === 'advanced') {
      recommendations.push('try_enterprise_features');
      recommendations.push('explore_bulk_operations');
    }
    
    if (walletData.activityLevel === 'low') {
      recommendations.push('set_up_notifications');
      recommendations.push('join_community_chat');
    } else if (walletData.activityLevel === 'high') {
      recommendations.push('upgrade_to_premium');
      recommendations.push('enable_api_access');
    }
    
    return recommendations;
  }

  private determineExperienceLevel(walletData: any): string {
    const activityScore = walletData.activityScore || 0;
    const tradingScore = walletData.tradingBehaviorScore || 0;
    const defiScore = walletData.defiEngagementScore || 0;
    
    const combinedScore = activityScore + tradingScore + defiScore;
    
    if (combinedScore < 50) return 'beginner';
    if (combinedScore < 150) return 'intermediate';
    if (combinedScore < 250) return 'advanced';
    return 'expert';
  }

  private determineActivityLevel(walletData: any): string {
    const activityScore = walletData.activityScore || 0;
    
    if (activityScore < 25) return 'low';
    if (activityScore < 75) return 'medium';
    return 'high';
  }

  private estimateWalletValue(walletData: any): number {
    // Estimate based on portfolio size and liquidity score
    const portfolioSize = walletData.portfolioSize || 'small';
    const liquidityScore = walletData.liquidityScore || 0;
    
    switch (portfolioSize) {
      case 'whale': return 1000000 + (liquidityScore * 10000);
      case 'large': return 100000 + (liquidityScore * 1000);
      case 'medium': return 10000 + (liquidityScore * 100);
      case 'small': return 1000 + (liquidityScore * 10);
      default: return liquidityScore * 10;
    }
  }

  /**
   * PHASE 3: Advanced personalization (placeholder for future implementation)
   */
  async analyzeUserPersonality(userId: string, messages: FlutterinaMessage[]): Promise<FlutterinaPersonalityProfile | null> {
    // TODO: Phase 3 - Implement personality analysis
    return null;
  }

  /**
   * PHASE 4: Product recommendations and friendship features (placeholder for future implementation)  
   */
  async generatePersonalizedRecommendations(conversation: FlutterinaConversation): Promise<any[]> {
    // TODO: Phase 4 - Implement advanced recommendation engine
    return [];
  }
}

export const flutterinaService = new FlutterinaAIService();