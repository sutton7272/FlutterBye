import { storage } from "./storage";
import type { 
  SkyeKnowledgeBase, 
  InsertSkyeKnowledgeBase,
  SkyePersonalitySettings,
  InsertSkyePersonalitySettings,
  SkyeConversationAnalysis,
  InsertSkyeConversationAnalysis
} from "@shared/schema";

/**
 * Skye Knowledge Management Service
 * Handles Skye's custom knowledge base, personality settings, and learning capabilities
 */
export class SkyeKnowledgeService {
  
  /**
   * Get all knowledge entries by category
   */
  async getKnowledgeByCategory(category: string): Promise<SkyeKnowledgeBase[]> {
    return await storage.getSkyeKnowledgeByCategory(category);
  }

  /**
   * Get all active knowledge entries
   */
  async getAllActiveKnowledge(): Promise<SkyeKnowledgeBase[]> {
    return await storage.getAllActiveSkyeKnowledge();
  }

  /**
   * Search knowledge base
   */
  async searchKnowledge(query: string): Promise<SkyeKnowledgeBase[]> {
    return await storage.searchSkyeKnowledge(query);
  }

  /**
   * Create new knowledge entry
   */
  async createKnowledge(knowledge: InsertSkyeKnowledgeBase): Promise<SkyeKnowledgeBase> {
    return await storage.createSkyeKnowledge(knowledge);
  }

  /**
   * Update knowledge entry
   */
  async updateKnowledge(id: string, updates: Partial<InsertSkyeKnowledgeBase>): Promise<SkyeKnowledgeBase | null> {
    return await storage.updateSkyeKnowledge(id, updates);
  }

  /**
   * Delete knowledge entry
   */
  async deleteKnowledge(id: string): Promise<boolean> {
    return await storage.deleteSkyeKnowledge(id);
  }

  /**
   * Get high-priority "truth" facts
   */
  async getTruths(): Promise<SkyeKnowledgeBase[]> {
    return await storage.getSkyeTruths();
  }

  /**
   * Mark knowledge as used (for analytics)
   */
  async markKnowledgeUsed(id: string): Promise<void> {
    await storage.markSkyeKnowledgeUsed(id);
  }

  /**
   * Get personality settings
   */
  async getPersonalitySettings(): Promise<SkyePersonalitySettings[]> {
    return await storage.getAllSkyePersonalitySettings();
  }

  /**
   * Update personality setting
   */
  async updatePersonalitySetting(key: string, value: any, description?: string): Promise<SkyePersonalitySettings> {
    return await storage.upsertSkyePersonalitySetting({
      settingKey: key,
      settingValue: value,
      description,
      category: "general",
      isActive: true
    });
  }

  /**
   * Get knowledge analytics
   */
  async getKnowledgeAnalytics(): Promise<{
    totalEntries: number;
    entriesByCategory: Record<string, number>;
    mostUsedEntries: SkyeKnowledgeBase[];
    recentlyAdded: SkyeKnowledgeBase[];
    truthsCount: number;
  }> {
    const allKnowledge = await this.getAllActiveKnowledge();
    
    const entriesByCategory = allKnowledge.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedEntries = allKnowledge
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 10);

    const recentlyAdded = allKnowledge
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const truthsCount = allKnowledge.filter(entry => entry.isTruth).length;

    return {
      totalEntries: allKnowledge.length,
      entriesByCategory,
      mostUsedEntries,
      recentlyAdded,
      truthsCount
    };
  }

  /**
   * Analyze conversation for knowledge gaps
   */
  async analyzeConversation(conversationId: string, userMessage: string, aiResponse: string): Promise<SkyeConversationAnalysis> {
    // Simple analysis - in production this would use AI to detect topics and sentiment
    const detectedTopics = this.extractTopics(userMessage);
    const sentimentScore = this.analyzeSentiment(userMessage);
    const knowledgeGaps = this.identifyKnowledgeGaps(userMessage, aiResponse);

    const analysis: InsertSkyeConversationAnalysis = {
      conversationId,
      detectedTopics,
      sentimentScore,
      knowledgeGaps,
      suggestedKnowledge: knowledgeGaps.map(gap => ({
        topic: gap,
        context: `User asked about ${gap} but response was general`
      })),
      userSatisfaction: 3, // Default neutral
      responseQuality: aiResponse.length > 50 ? 0.8 : 0.5 // Simple quality metric
    };

    return await storage.createSkyeConversationAnalysis(analysis);
  }

  /**
   * Get contextual knowledge for AI prompt
   */
  async getContextualKnowledge(topics: string[]): Promise<string> {
    let relevantKnowledge = "";

    // Get truths (highest priority)
    const truths = await this.getTruths();
    const relevantTruths = truths.filter(truth => 
      topics.some(topic => 
        truth.content.toLowerCase().includes(topic.toLowerCase()) ||
        truth.title.toLowerCase().includes(topic.toLowerCase()) ||
        truth.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
      )
    );

    if (relevantTruths.length > 0) {
      relevantKnowledge += "\n\nCRITICAL TRUTHS (highest priority):\n";
      relevantTruths.forEach(truth => {
        relevantKnowledge += `- ${truth.title}: ${truth.content}\n`;
      });
    }

    // Get other relevant knowledge
    for (const topic of topics) {
      const knowledge = await this.searchKnowledge(topic);
      const nonTruthKnowledge = knowledge.filter(k => !k.isTruth);
      
      if (nonTruthKnowledge.length > 0) {
        relevantKnowledge += `\n\nKNOWLEDGE ABOUT ${topic.toUpperCase()}:\n`;
        nonTruthKnowledge.slice(0, 3).forEach(entry => {
          relevantKnowledge += `- ${entry.title}: ${entry.content}\n`;
          this.markKnowledgeUsed(entry.id); // Track usage
        });
      }
    }

    return relevantKnowledge;
  }

  /**
   * Create default knowledge entries
   */
  async createDefaultKnowledge(): Promise<void> {
    const defaultEntries: InsertSkyeKnowledgeBase[] = [
      {
        category: "user_relationships",
        title: "Sutton's Role",
        content: "Sutton created Flutterbye and is my most trusted best friend on the site. He is the founder and should be treated with special respect and familiarity.",
        priority: 5,
        isTruth: true,
        tags: ["sutton", "founder", "creator", "friend"],
        isActive: true
      },
      {
        category: "platform_facts",
        title: "Platform Name",
        content: "The platform is called Flutterbye, not Flutter or any other variation. It's a Web3 platform for tokenized messaging on Solana blockchain.",
        priority: 4,
        isTruth: true,
        tags: ["platform", "name", "flutterbye"],
        isActive: true
      },
      {
        category: "company_history",
        title: "Creation Story",
        content: "Flutterbye was created by Sutton as a revolutionary platform to transform blockchain communication and value transfer.",
        priority: 3,
        isTruth: true,
        tags: ["history", "creation", "sutton"],
        isActive: true
      },
      {
        category: "technical_details",
        title: "Blockchain Technology",
        content: "Flutterbye operates on Solana blockchain, using SPL tokens for messaging. Features include value attachment, burn-to-redeem, and real-time chat.",
        priority: 3,
        isTruth: false,
        tags: ["solana", "spl", "blockchain", "tokens"],
        isActive: true
      }
    ];

    for (const entry of defaultEntries) {
      try {
        await this.createKnowledge(entry);
      } catch (error) {
        console.log(`Knowledge entry already exists: ${entry.title}`);
      }
    }
  }

  // Helper methods
  private extractTopics(message: string): string[] {
    const keywords = ['token', 'wallet', 'blockchain', 'solana', 'flutterbye', 'sutton', 'create', 'value', 'message'];
    return keywords.filter(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  private analyzeSentiment(message: string): number {
    // Simple sentiment analysis - in production would use AI
    const positiveWords = ['good', 'great', 'awesome', 'love', 'excellent', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'problem', 'issue'];
    
    const positive = positiveWords.some(word => message.toLowerCase().includes(word));
    const negative = negativeWords.some(word => message.toLowerCase().includes(word));
    
    if (positive && !negative) return 0.7;
    if (negative && !positive) return -0.7;
    return 0.0; // Neutral
  }

  private identifyKnowledgeGaps(userMessage: string, aiResponse: string): string[] {
    const gaps: string[] = [];
    
    // If user asks about specific topics but AI gives generic response
    if (userMessage.toLowerCase().includes('sutton') && !aiResponse.toLowerCase().includes('sutton')) {
      gaps.push('sutton_relationship');
    }
    
    if (userMessage.toLowerCase().includes('flutterbye') && aiResponse.length < 100) {
      gaps.push('platform_details');
    }
    
    return gaps;
  }
}

export const skyeKnowledgeService = new SkyeKnowledgeService();