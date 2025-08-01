import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface EmotionAnalysis {
  primaryEmotion: string;
  emotionScore: number; // 0-1 scale
  sentiment: 'positive' | 'negative' | 'neutral';
  intensity: 'low' | 'medium' | 'high';
  category: 'romantic' | 'friendship' | 'celebration' | 'apology' | 'encouragement' | 'gratitude' | 'business' | 'other';
  suggestedValue: number; // Suggested SOL amount
  viralityScore: number; // 0-1 scale of viral potential
  marketingTags: string[];
}

export interface ValueSuggestion {
  baseValue: number;
  emotionMultiplier: number;
  finalSuggestion: number;
  reasoning: string;
}

export class AIEmotionService {
  
  /**
   * Analyze the emotional content and context of a message
   */
  async analyzeMessageEmotion(message: string, recipientCount: number = 1): Promise<EmotionAnalysis> {
    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert emotion AI for a tokenized messaging platform. Analyze messages for emotional content, sentiment, and viral potential. Consider the 27-character limit and crypto/meme culture context.
            
            Respond with JSON in this exact format:
            {
              "primaryEmotion": "string (joy, love, sadness, anger, surprise, fear, etc.)",
              "emotionScore": number (0-1, emotional intensity),
              "sentiment": "positive|negative|neutral",
              "intensity": "low|medium|high", 
              "category": "romantic|friendship|celebration|apology|encouragement|gratitude|business|other",
              "suggestedValue": number (SOL amount 0.001-1.0),
              "viralityScore": number (0-1, meme/viral potential),
              "marketingTags": ["array", "of", "relevant", "tags"]
            }`
          },
          {
            role: "user", 
            content: `Analyze this message for emotion and value suggestion:
            Message: "${message}"
            Recipient Count: ${recipientCount}
            
            Consider:
            - Emotional weight and personal value
            - Meme potential and shareability  
            - Cultural relevance in crypto space
            - Appropriate monetary value for the emotion expressed`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      // Ensure all required fields with defaults
      return {
        primaryEmotion: analysis.primaryEmotion || 'neutral',
        emotionScore: Math.max(0, Math.min(1, analysis.emotionScore || 0.5)),
        sentiment: analysis.sentiment || 'neutral',
        intensity: analysis.intensity || 'medium',
        category: analysis.category || 'other',
        suggestedValue: Math.max(0.001, Math.min(1.0, analysis.suggestedValue || 0.01)),
        viralityScore: Math.max(0, Math.min(1, analysis.viralityScore || 0.3)),
        marketingTags: Array.isArray(analysis.marketingTags) ? analysis.marketingTags : []
      };
      
    } catch (error) {
      console.error("AI emotion analysis error:", error);
      // Return safe defaults if AI fails
      return {
        primaryEmotion: 'neutral',
        emotionScore: 0.5,
        sentiment: 'neutral',
        intensity: 'medium',
        category: 'other',
        suggestedValue: 0.01,
        viralityScore: 0.3,
        marketingTags: []
      };
    }
  }

  /**
   * Generate dynamic value suggestion based on emotion and context
   */
  async generateValueSuggestion(
    message: string, 
    recipientCount: number,
    senderHistory?: { avgValue: number; totalSent: number }
  ): Promise<ValueSuggestion> {
    const emotion = await this.analyzeMessageEmotion(message, recipientCount);
    
    // Base value calculation
    let baseValue = 0.01; // Minimum value
    
    // Adjust base value by emotion category
    const categoryMultipliers = {
      romantic: 3.0,
      celebration: 2.5,
      apology: 2.0,
      gratitude: 1.8,
      encouragement: 1.5,
      friendship: 1.3,
      business: 1.0,
      other: 1.0
    };
    
    baseValue *= categoryMultipliers[emotion.category];
    
    // Emotion intensity multiplier
    const intensityMultipliers = {
      low: 0.7,
      medium: 1.0,
      high: 1.5
    };
    
    const emotionMultiplier = intensityMultipliers[emotion.intensity] * emotion.emotionScore;
    
    // Recipient count scaling (more recipients = lower per-recipient value)
    const recipientScaling = Math.max(0.5, 1 / Math.sqrt(recipientCount));
    
    // Sender history adjustment
    let historyMultiplier = 1.0;
    if (senderHistory) {
      // Users with higher average values get slightly higher suggestions
      historyMultiplier = Math.min(2.0, 1 + (senderHistory.avgValue / 0.1));
    }
    
    const finalSuggestion = Math.min(
      1.0, // Cap at 1 SOL
      baseValue * emotionMultiplier * recipientScaling * historyMultiplier
    );
    
    return {
      baseValue,
      emotionMultiplier: emotionMultiplier * recipientScaling * historyMultiplier,
      finalSuggestion: Math.round(finalSuggestion * 1000) / 1000, // Round to 3 decimals
      reasoning: `Based on ${emotion.category} emotion with ${emotion.intensity} intensity (${emotion.primaryEmotion}). Adjusted for ${recipientCount} recipients.`
    };
  }

  /**
   * Analyze message for viral potential and suggest optimization
   */
  async analyzeViralPotential(message: string): Promise<{
    score: number;
    suggestions: string[];
    optimizedMessage?: string;
  }> {
    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a viral content expert for crypto/Web3 messaging. Analyze messages for viral potential and suggest improvements within 27 characters.
            
            Respond with JSON:
            {
              "score": number (0-1),
              "suggestions": ["improvement1", "improvement2"],
              "optimizedMessage": "optional improved version"
            }`
          },
          {
            role: "user",
            content: `Analyze viral potential: "${message}"
            
            Consider:
            - Meme potential
            - Crypto culture relevance  
            - Emotional hook
            - Shareability
            - Character limit (27 max)`
          }
        ],
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        score: Math.max(0, Math.min(1, analysis.score || 0.3)),
        suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
        optimizedMessage: analysis.optimizedMessage?.slice(0, 27) // Ensure 27 char limit
      };
      
    } catch (error) {
      console.error("Viral analysis error:", error);
      return {
        score: 0.3,
        suggestions: ["Add crypto slang", "Use emojis", "Create urgency"],
        optimizedMessage: undefined
      };
    }
  }

  /**
   * Get personalized message suggestions based on recipient analysis
   */
  async generatePersonalizedSuggestions(
    recipientWallet: string,
    senderWallet: string,
    context?: string
  ): Promise<string[]> {
    // In production, this would analyze recipient's transaction history,
    // token preferences, and interaction patterns with the sender
    
    const suggestions = [
      "gm beautiful soul",
      "thinking of you always", 
      "you deserve the moon",
      "grateful for your vibe",
      "sending you good energy",
      "hodl tight my friend",
      "bullish on your dreams",
      "wen moon together ser"
    ];
    
    // Return randomized subset
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
  }
}

export const aiEmotionService = new AIEmotionService();