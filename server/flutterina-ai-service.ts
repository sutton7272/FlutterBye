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
          pageContext: { initialPage: currentPage, timestamp: new Date().toISOString() },
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
   * Generate context-aware AI response using GPT-4o
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
  }> {
    try {
      const startTime = Date.now();
      
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
      
      return {
        response: aiResponse.message || "I'm here to help! Could you tell me more about what you need?",
        containsRecommendations: aiResponse.hasRecommendations || false,
        recommendationData: aiResponse.recommendations || { products: [], actions: [], links: [] },
        tokenUsage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        }
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
   * PHASE 2: Wallet intelligence integration (placeholder for future implementation)
   */
  async getWalletInsights(walletAddress: string): Promise<any> {
    // TODO: Phase 2 - Integrate with existing FlutterAI wallet intelligence
    return {
      riskScore: 0.5,
      behaviorPatterns: [],
      recommendations: []
    };
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