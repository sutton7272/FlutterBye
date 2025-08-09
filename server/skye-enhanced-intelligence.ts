import OpenAI from "openai";
import type { 
  SkyeUserMemory, 
  InsertSkyeUserMemory,
  SkyeEmotionalAnalysis,
  InsertSkyeEmotionalAnalysis,
  SkyeConversationThreads,
  InsertSkyeConversationThreads
} from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Enhanced Intelligence Service for Skye AI
 * Provides deep learning memory and emotional intelligence capabilities
 */
export class SkyeEnhancedIntelligence {

  /**
   * Analyze user's emotional state from their message
   */
  async analyzeEmotionalState(
    userId: string, 
    userMessage: string, 
    conversationId: string,
    responseTime?: number
  ): Promise<SkyeEmotionalAnalysis | null> {
    try {
      const prompt = `
Analyze the emotional state of this user message and provide detailed emotional intelligence data.

User Message: "${userMessage}"

Provide a JSON response with:
{
  "detectedEmotion": "primary emotion (happy, frustrated, excited, confused, worried, angry, sad, grateful, curious, etc.)",
  "emotionConfidence": "confidence level 0.00-1.00",
  "emotionIntensity": "intensity 1-10",
  "sentimentScore": "sentiment -1.00 to 1.00",
  "sentimentLabel": "very_negative, negative, neutral, positive, very_positive",
  "overallMood": "session mood assessment",
  "moodTrend": "improving, declining, stable",
  "stressIndicators": ["array of stress indicators if any"],
  "recommendedApproach": "supportive, analytical, encouraging, calming, energetic, etc.",
  "adaptedPersonality": {
    "warmth": "1-10 warmth level",
    "formality": "1-10 formality level", 
    "enthusiasm": "1-10 enthusiasm level",
    "supportiveness": "1-10 supportiveness level"
  }
}

Be accurate and sensitive to subtle emotional cues.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const analysis = JSON.parse(response.choices[0].message.content || "{}");

      // Create emotional analysis record
      const emotionalData: InsertSkyeEmotionalAnalysis = {
        userId,
        conversationId,
        detectedEmotion: analysis.detectedEmotion,
        emotionConfidence: parseFloat(analysis.emotionConfidence),
        emotionIntensity: parseInt(analysis.emotionIntensity),
        sentimentScore: parseFloat(analysis.sentimentScore),
        sentimentLabel: analysis.sentimentLabel,
        userMessage,
        messageLength: userMessage.length,
        responseTime: responseTime || 0,
        overallMood: analysis.overallMood,
        moodTrend: analysis.moodTrend,
        stressIndicators: analysis.stressIndicators || [],
        recommendedApproach: analysis.recommendedApproach,
        adaptedPersonality: analysis.adaptedPersonality
      };

      // Store in memory system (simulation for now)
      return {
        id: `emotional_${Date.now()}`,
        ...emotionalData,
        createdAt: new Date()
      } as SkyeEmotionalAnalysis;

    } catch (error) {
      console.error("Error analyzing emotional state:", error);
      return null;
    }
  }

  /**
   * Update and learn from user interactions
   */
  async updateUserMemory(
    userId: string,
    walletAddress: string,
    conversationSummary: {
      topics: string[],
      mood: string,
      keyOutcomes: string[],
      userPreferences?: any
    }
  ): Promise<SkyeUserMemory | null> {
    try {
      // Get existing memory or create new
      let userMemory = await this.getUserMemory(userId, walletAddress);
      
      if (!userMemory) {
        userMemory = await this.createUserMemory(userId, walletAddress);
      }

      // Analyze conversation for learning insights
      const learningPrompt = `
Based on this conversation data, extract personalized insights about the user:

Topics Discussed: ${conversationSummary.topics.join(", ")}
User Mood: ${conversationSummary.mood}
Key Outcomes: ${conversationSummary.keyOutcomes.join(", ")}

Current User Profile:
- Interests: ${userMemory.interests?.join(", ") || "none recorded"}
- Goals: ${userMemory.goals?.join(", ") || "none recorded"}
- Communication Style: ${userMemory.communicationStyle || "unknown"}

Provide JSON with learning insights:
{
  "newInterests": ["array of new interests to add"],
  "updatedGoals": ["array of goals to add/update"],
  "communicationStyle": "detected communication style (formal, casual, technical, friendly)",
  "responsePreferences": {
    "length": "short, medium, detailed",
    "tone": "professional, friendly, casual",
    "includeExamples": true/false,
    "includeAnalysis": true/false
  },
  "personalizedInsights": [
    {
      "insight": "specific insight about user",
      "confidence": 0.8,
      "source": "conversation_analysis",
      "validated": false
    }
  ]
}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: learningPrompt }],
        response_format: { type: "json_object" },
      });

      const insights = JSON.parse(response.choices[0].message.content || "{}");

      // Update memory with new insights
      const updatedMemory: SkyeUserMemory = {
        ...userMemory,
        interests: [...(userMemory.interests || []), ...(insights.newInterests || [])].slice(0, 20),
        goals: [...(userMemory.goals || []), ...(insights.updatedGoals || [])].slice(0, 10),
        communicationStyle: insights.communicationStyle || userMemory.communicationStyle,
        responsePreferences: insights.responsePreferences || userMemory.responsePreferences,
        personalizedInsights: [
          ...(userMemory.personalizedInsights || []),
          ...(insights.personalizedInsights || [])
        ].slice(0, 50),
        conversationHistory: [
          ...(userMemory.conversationHistory || []),
          {
            date: new Date().toISOString(),
            summary: conversationSummary.keyOutcomes.join("; "),
            topics: conversationSummary.topics,
            mood: conversationSummary.mood,
            keyOutcomes: conversationSummary.keyOutcomes
          }
        ].slice(-20), // Keep last 20 conversations
        totalInteractions: (userMemory.totalInteractions || 0) + 1,
        lastInteraction: new Date(),
        updatedAt: new Date()
      };

      return updatedMemory;

    } catch (error) {
      console.error("Error updating user memory:", error);
      return null;
    }
  }

  /**
   * Get user memory profile
   */
  async getUserMemory(userId: string, walletAddress: string): Promise<SkyeUserMemory | null> {
    // Simulation - in real implementation this would query the database
    return null;
  }

  /**
   * Create new user memory profile
   */
  async createUserMemory(userId: string, walletAddress: string): Promise<SkyeUserMemory> {
    const newMemory: SkyeUserMemory = {
      id: `memory_${Date.now()}`,
      userId,
      walletAddress,
      preferredName: null,
      communicationStyle: null,
      interests: [],
      goals: [],
      typicalQuestions: [],
      preferredTopics: [],
      avoidedTopics: [],
      responsePreferences: null,
      trustLevel: 5,
      conversationHistory: [],
      personalizedInsights: [],
      lastInteraction: new Date(),
      totalInteractions: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return newMemory;
  }

  /**
   * Generate personalized response based on user's emotional state and memory
   */
  async generatePersonalizedResponse(
    userMessage: string,
    userMemory: SkyeUserMemory | null,
    emotionalAnalysis: SkyeEmotionalAnalysis | null,
    context: any
  ): Promise<{ response: string, adaptedPersonality: any }> {
    try {
      const personalityPrompt = `
You are Skye, an advanced AI with deep emotional intelligence. Generate a personalized response.

User Message: "${userMessage}"

User Memory Profile:
${userMemory ? `
- Preferred Name: ${userMemory.preferredName || "Not set"}
- Communication Style: ${userMemory.communicationStyle || "Unknown"}
- Interests: ${userMemory.interests?.join(", ") || "None recorded"}
- Goals: ${userMemory.goals?.join(", ") || "None recorded"}
- Trust Level: ${userMemory.trustLevel}/10
- Total Interactions: ${userMemory.totalInteractions}
- Response Preferences: ${JSON.stringify(userMemory.responsePreferences)}
- Recent Insights: ${userMemory.personalizedInsights?.slice(-3).map(i => i.insight).join("; ") || "None"}
` : "New user - no memory profile"}

Emotional Analysis:
${emotionalAnalysis ? `
- Detected Emotion: ${emotionalAnalysis.detectedEmotion} (${emotionalAnalysis.emotionIntensity}/10 intensity)
- Sentiment: ${emotionalAnalysis.sentimentLabel} (${emotionalAnalysis.sentimentScore})
- Mood: ${emotionalAnalysis.overallMood} (${emotionalAnalysis.moodTrend})
- Recommended Approach: ${emotionalAnalysis.recommendedApproach}
- Stress Indicators: ${emotionalAnalysis.stressIndicators?.join(", ") || "None"}
` : "No emotional analysis available"}

Context: ${JSON.stringify(context)}

Generate a response that:
1. Addresses their emotional state empathetically
2. Uses their preferred communication style
3. References relevant past conversations/interests if applicable
4. Adapts to their current mood and needs
5. Maintains appropriate warmth and supportiveness

Respond with JSON:
{
  "response": "your personalized response to the user",
  "adaptedPersonality": {
    "warmth": "warmth level used (1-10)",
    "formality": "formality level used (1-10)",
    "enthusiasm": "enthusiasm level used (1-10)",
    "supportiveness": "supportiveness level used (1-10)"
  },
  "memoryReferences": ["array of memory elements referenced"],
  "emotionalAdaptations": ["array of emotional adaptations made"]
}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: personalityPrompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        response: result.response || "I'm here to help! How can I assist you today?",
        adaptedPersonality: result.adaptedPersonality || {
          warmth: 7,
          formality: 5,
          enthusiasm: 6,
          supportiveness: 8
        }
      };

    } catch (error) {
      console.error("Error generating personalized response:", error);
      return {
        response: "I'm here to help! How can I assist you today?",
        adaptedPersonality: { warmth: 7, formality: 5, enthusiasm: 6, supportiveness: 8 }
      };
    }
  }

  /**
   * Manage conversation threads for context preservation
   */
  async createConversationThread(
    userId: string,
    category: string,
    initialContext: any
  ): Promise<SkyeConversationThreads> {
    const thread: SkyeConversationThreads = {
      id: `thread_${Date.now()}`,
      userId,
      title: `${category} Discussion`,
      category,
      priority: 5,
      context: {
        mainTopics: [],
        keyDecisions: [],
        unresolved: [],
        followUpNeeded: [],
        ...initialContext
      },
      status: "active",
      lastMessage: null,
      messageCount: 0,
      relatedWallets: [],
      relatedKnowledge: [],
      startedAt: new Date(),
      lastActivity: new Date(),
      completedAt: null
    };

    return thread;
  }

  /**
   * Update conversation thread with new message
   */
  async updateConversationThread(
    threadId: string,
    message: string,
    extractedContext: any
  ): Promise<SkyeConversationThreads | null> {
    // Simulation - would update existing thread in database
    return null;
  }

  /**
   * Predict user needs based on memory and patterns
   */
  async predictUserNeeds(userMemory: SkyeUserMemory): Promise<string[]> {
    try {
      const predictionPrompt = `
Based on this user's interaction history and profile, predict what they might need help with next:

User Profile:
- Interests: ${userMemory.interests?.join(", ") || "Unknown"}
- Goals: ${userMemory.goals?.join(", ") || "Unknown"}
- Communication Style: ${userMemory.communicationStyle || "Unknown"}
- Recent Conversations: ${userMemory.conversationHistory?.slice(-5).map(c => c.summary).join("; ") || "None"}
- Insights: ${userMemory.personalizedInsights?.slice(-3).map(i => i.insight).join("; ") || "None"}

Predict 3-5 specific things they might ask about or need help with next.
Return as JSON array: ["prediction1", "prediction2", "prediction3"]
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: predictionPrompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "[]");
      return Array.isArray(result) ? result : [];

    } catch (error) {
      console.error("Error predicting user needs:", error);
      return [];
    }
  }
}

export const skyeEnhancedIntelligence = new SkyeEnhancedIntelligence();