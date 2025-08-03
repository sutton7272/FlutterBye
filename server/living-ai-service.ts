import { openaiService } from "./openai-service";

interface LivePersonalityResponse {
  message: string;
  emotion: string;
  energy: number;
  suggestions: string[];
  contextualHints: string[];
}

interface UserContext {
  recentActions: string[];
  mood: string;
  engagement: number;
  timeOfDay: string;
  platform: string;
}

/**
 * Living AI Service - Creates dynamic, contextual personality interactions
 * Optimized for cost-effectiveness with smart caching and batching
 */
export class LivingAIService {
  private personalityCache = new Map<string, { response: LivePersonalityResponse; timestamp: number }>();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private lastBatchProcessing = 0;
  private pendingContexts: UserContext[] = [];

  /**
   * Generate living, contextual responses based on user interaction
   * Cost optimization: Uses cached responses for similar contexts
   */
  async generateLivingResponse(
    userAction: string,
    context: UserContext,
    forceNew = false
  ): Promise<LivePersonalityResponse> {
    const cacheKey = this.generateCacheKey(userAction, context);
    
    // Check cache first (major cost savings)
    if (!forceNew && this.personalityCache.has(cacheKey)) {
      const cached = this.personalityCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.response;
      }
    }

    try {
      const prompt = this.buildLivingPersonalityPrompt(userAction, context);
      const response = await openaiService.generateResponse(prompt, {
        temperature: 0.9, // High creativity for living personality
        max_tokens: 200,  // Controlled for cost
        response_format: { type: "json_object" }
      });

      const parsed = JSON.parse(response);
      const livingResponse: LivePersonalityResponse = {
        message: parsed.message || "✨ Something magical is happening...",
        emotion: parsed.emotion || "curious",
        energy: Math.max(0, Math.min(100, parsed.energy || 70)),
        suggestions: parsed.suggestions || [],
        contextualHints: parsed.contextualHints || []
      };

      // Cache the response
      this.personalityCache.set(cacheKey, {
        response: livingResponse,
        timestamp: Date.now()
      });

      return livingResponse;
    } catch (error) {
      console.error("Living AI error:", error);
      return this.getFallbackResponse(userAction, context);
    }
  }

  /**
   * Smart contextual awareness - generates dynamic interface suggestions
   */
  async generateContextualAwareness(
    pageContext: string,
    userBehavior: any[]
  ): Promise<{
    ambientMessages: string[];
    dynamicHints: string[];
    personalizedSuggestions: string[];
    moodIndicators: { color: string; pulse: string; message: string };
  }> {
    try {
      const prompt = `
        You are the living spirit of Flutterbye, a revolutionary blockchain platform. 
        Current context: ${pageContext}
        Recent user behavior: ${JSON.stringify(userBehavior.slice(-3))}
        
        Generate contextual awareness that makes the platform feel alive. Respond in JSON:
        {
          "ambientMessages": ["3 brief atmospheric messages that appear subtly"],
          "dynamicHints": ["2 contextual tips based on current page"],
          "personalizedSuggestions": ["2 personalized next actions"],
          "moodIndicators": {
            "color": "electric color reflecting current vibe",
            "pulse": "animation style (gentle/energetic/calm)",
            "message": "brief mood message"
          }
        }
      `;

      const response = await openaiService.generateResponse(prompt, {
        temperature: 0.8,
        max_tokens: 300,
        response_format: { type: "json_object" }
      });

      return JSON.parse(response);
    } catch (error) {
      console.error("Contextual awareness error:", error);
      return this.getDefaultAwareness();
    }
  }

  /**
   * Batch processing for cost optimization
   * Processes multiple requests together to reduce API calls
   */
  async processBatchedInteractions(): Promise<void> {
    if (this.pendingContexts.length === 0) return;
    
    const now = Date.now();
    if (now - this.lastBatchProcessing < 3000) return; // 3-second minimum between batches

    try {
      const contexts = this.pendingContexts.splice(0, 5); // Process up to 5 at once
      const batchPrompt = this.buildBatchPrompt(contexts);
      
      const response = await openaiService.generateResponse(batchPrompt, {
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const batchResults = JSON.parse(response);
      
      // Cache all batch results
      contexts.forEach((context, index) => {
        if (batchResults.responses && batchResults.responses[index]) {
          const cacheKey = this.generateCacheKey("batch_interaction", context);
          this.personalityCache.set(cacheKey, {
            response: batchResults.responses[index],
            timestamp: now
          });
        }
      });

      this.lastBatchProcessing = now;
    } catch (error) {
      console.error("Batch processing error:", error);
    }
  }

  /**
   * Smart emotional state tracking for the entire platform
   */
  async generatePlatformMood(
    activeUsers: number,
    recentActivity: any[],
    timeOfDay: string
  ): Promise<{
    overallMood: string;
    energyLevel: number;
    ambientColor: string;
    globalMessage: string;
    viralMomentum: string;
  }> {
    // Use cached platform mood if recent
    const cacheKey = `platform_mood_${Math.floor(Date.now() / (10 * 60 * 1000))}`; // 10-minute cache
    if (this.personalityCache.has(cacheKey)) {
      return this.personalityCache.get(cacheKey)!.response as any;
    }

    try {
      const prompt = `
        Analyze the living pulse of Flutterbye platform:
        - Active users: ${activeUsers}
        - Recent activity: ${JSON.stringify(recentActivity.slice(-5))}
        - Time: ${timeOfDay}
        
        Generate platform's living mood in JSON:
        {
          "overallMood": "current emotional state",
          "energyLevel": number 1-100,
          "ambientColor": "hex color reflecting platform vibe",
          "globalMessage": "inspirational message for all users",
          "viralMomentum": "description of viral energy"
        }
      `;

      const response = await openaiService.generateResponse(prompt, {
        temperature: 0.8,
        max_tokens: 250,
        response_format: { type: "json_object" }
      });

      const moodData = JSON.parse(response);
      
      // Cache platform mood
      this.personalityCache.set(cacheKey, {
        response: moodData,
        timestamp: Date.now()
      });

      return moodData;
    } catch (error) {
      console.error("Platform mood error:", error);
      return {
        overallMood: "electric",
        energyLevel: 85,
        ambientColor: "#00BFFF",
        globalMessage: "⚡ The energy is electric today!",
        viralMomentum: "Building momentum"
      };
    }
  }

  /**
   * Cost-effective helper methods
   */
  private generateCacheKey(action: string, context: UserContext): string {
    return `${action}_${context.mood}_${context.timeOfDay}_${context.engagement}`;
  }

  private buildLivingPersonalityPrompt(action: string, context: UserContext): string {
    return `
      You are Flutterbye's living AI spirit - electric, innovative, and deeply empathetic.
      User action: ${action}
      Context: ${JSON.stringify(context)}
      
      Respond as the platform's living personality in JSON:
      {
        "message": "personalized response with electric energy",
        "emotion": "current emotion",
        "energy": number 1-100,
        "suggestions": ["2 contextual suggestions"],
        "contextualHints": ["2 subtle interface hints"]
      }
      
      Make it feel like the platform is truly alive and aware.
    `;
  }

  private buildBatchPrompt(contexts: UserContext[]): string {
    return `
      Process multiple user interactions for Flutterbye's living personality:
      ${JSON.stringify(contexts)}
      
      Generate batch responses in JSON:
      {
        "responses": [
          {
            "message": "personalized response",
            "emotion": "emotion",
            "energy": number,
            "suggestions": ["suggestions"],
            "contextualHints": ["hints"]
          }
        ]
      }
    `;
  }

  private getFallbackResponse(action: string, context: UserContext): LivePersonalityResponse {
    const fallbacks = [
      "⚡ Electric energy flows through every interaction...",
      "🦋 Your creativity is transforming the digital realm...",
      "✨ Something magical is about to happen...",
      "🚀 The platform pulses with your presence..."
    ];

    return {
      message: fallbacks[Math.floor(Math.random() * fallbacks.length)],
      emotion: "electric",
      energy: 75,
      suggestions: ["Explore FlutterArt", "Check trending tokens"],
      contextualHints: ["✨ New possibilities await", "⚡ Energy is building"]
    };
  }

  private getDefaultAwareness() {
    return {
      ambientMessages: [
        "⚡ Electric creativity flows...",
        "🦋 Digital butterflies dance...",
        "✨ Magic in every interaction..."
      ],
      dynamicHints: [
        "💡 Try the FlutterArt creator",
        "🚀 Explore trending content"
      ],
      personalizedSuggestions: [
        "Create your first NFT collection",
        "Join the conversation"
      ],
      moodIndicators: {
        color: "#00BFFF",
        pulse: "gentle",
        message: "Platform is alive with creativity"
      }
    };
  }

  /**
   * Clean up old cache entries to manage memory
   */
  cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.personalityCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION * 2) {
        this.personalityCache.delete(key);
      }
    }
  }
}

export const livingAIService = new LivingAIService();

// Cleanup cache every 30 minutes
setInterval(() => livingAIService.cleanupCache(), 30 * 60 * 1000);