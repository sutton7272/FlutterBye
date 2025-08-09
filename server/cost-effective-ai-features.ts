// Cost-Effective AI Features - Maximum Value, Minimal Cost
import OpenAI from "openai";
import { queryOptimizer } from "./performance-optimizer";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class CostEffectiveAIFeatures {
  private cache = new Map<string, { data: any; expiry: number }>();
  private requestQueue = new Map<string, Promise<any>>();

  // Smart caching to prevent duplicate API calls
  private async getCachedOrFetch<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    cacheMinutes: number = 60
  ): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }

    // Prevent duplicate requests for the same key
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key);
    }

    const promise = fetcher();
    this.requestQueue.set(key, promise);

    try {
      const result = await promise;
      this.cache.set(key, {
        data: result,
        expiry: Date.now() + (cacheMinutes * 60 * 1000)
      });
      return result;
    } finally {
      this.requestQueue.delete(key);
    }
  }

  // 1. Smart Token Naming - Simple but powerful
  async generateTokenName(description: string): Promise<string> {
    const cacheKey = `token-name-${description.slice(0, 50)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Most cost-effective model
        messages: [
          {
            role: "system",
            content: "Create a catchy 1-3 word token name from the description. Make it memorable and brandable. Respond with just the name."
          },
          {
            role: "user", 
            content: description
          }
        ],
        max_tokens: 20, // Minimal tokens needed
        temperature: 0.7
      });

      return response.choices[0].message.content?.trim() || "FlutterToken";
    }, 180); // 3 hour cache
  }

  // 2. Emotion Detection - High value, low cost
  async detectEmotionFromText(text: string): Promise<{
    primary: string;
    intensity: number;
    secondary?: string;
    confidence: number;
  }> {
    const cacheKey = `emotion-${text.slice(0, 100)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Analyze emotion in text. Respond with JSON: {"primary": "emotion", "intensity": 1-10, "secondary": "emotion", "confidence": 0-1}. Primary emotions: joy, sadness, anger, fear, surprise, disgust, love, excitement, peace, anxiety.`
          },
          { role: "user", content: text }
        ],
        max_tokens: 50,
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content || '{"primary":"neutral","intensity":5,"confidence":0.5}');
    }, 60); // 1 hour cache
  }

  // 3. Auto-Hashtag Generation - Social media optimization
  async generateHashtags(content: string): Promise<string[]> {
    const cacheKey = `hashtags-${content.slice(0, 100)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Generate 5-8 relevant hashtags for social media. Respond with JSON array of strings without # symbols."
          },
          { role: "user", content: content }
        ],
        max_tokens: 60,
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{"hashtags": []}');
      return result.hashtags || [];
    }, 120); // 2 hour cache
  }

  // 4. Smart Content Categorization - Organization made easy
  async categorizeContent(content: string): Promise<{
    category: string;
    subcategory: string;
    tags: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
  }> {
    const cacheKey = `category-${content.slice(0, 100)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Categorize content into: Business, Personal, Entertainment, Technology, Finance, Art, Social. Add subcategory, 3-5 tags, and sentiment. Respond with JSON: {"category": "main", "subcategory": "sub", "tags": ["tag1"], "sentiment": "positive"}`
          },
          { role: "user", content: content }
        ],
        max_tokens: 80,
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content || '{"category":"General","subcategory":"Misc","tags":[],"sentiment":"neutral"}');
    }, 240); // 4 hour cache
  }

  // 5. Quick Sentiment Analysis - Fast and efficient
  async analyzeSentiment(text: string): Promise<{
    score: number; // -1 to 1
    label: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
    confidence: number;
  }> {
    const cacheKey = `sentiment-${text.slice(0, 100)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Analyze sentiment. Respond with JSON: {"score": -1 to 1, "label": "very_negative|negative|neutral|positive|very_positive", "confidence": 0-1}`
          },
          { role: "user", content: text }
        ],
        max_tokens: 40,
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content || '{"score":0,"label":"neutral","confidence":0.5}');
    }, 60); // 1 hour cache
  }

  // 6. Smart Reply Suggestions - Engagement booster
  async generateReplySuggestions(originalMessage: string, context?: string): Promise<string[]> {
    const cacheKey = `replies-${originalMessage.slice(0, 80)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Generate 3 short, engaging reply suggestions. Keep them under 100 characters each. Respond with JSON array."
          },
          { 
            role: "user", 
            content: `Message: ${originalMessage}${context ? `\nContext: ${context}` : ''}` 
          }
        ],
        max_tokens: 100,
        temperature: 0.6,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{"replies": []}');
      return result.replies || [];
    }, 30); // 30 minute cache
  }

  // 7. Content Quality Score - Improvement suggestions
  async scoreContent(content: string): Promise<{
    score: number; // 0-100
    improvements: string[];
    strengths: string[];
  }> {
    const cacheKey = `quality-${content.slice(0, 100)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Rate content quality 0-100. List 2-3 improvements and strengths. Respond with JSON: {"score": number, "improvements": ["tip1"], "strengths": ["strength1"]}`
          },
          { role: "user", content: content }
        ],
        max_tokens: 120,
        temperature: 0.2,
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content || '{"score":70,"improvements":[],"strengths":[]}');
    }, 180); // 3 hour cache
  }

  // 8. Smart Auto-Complete - Writing assistance
  async autoComplete(partialText: string, maxLength: number = 50): Promise<string> {
    const cacheKey = `complete-${partialText.slice(-30)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Complete the text naturally. Keep it under ${maxLength} characters. Respond with just the completion.`
          },
          { role: "user", content: partialText }
        ],
        max_tokens: Math.min(Math.ceil(maxLength / 3), 50),
        temperature: 0.4
      });

      return response.choices[0].message.content?.trim() || '';
    }, 15); // 15 minute cache
  }

  // 9. Trend Analysis - Market insights
  async analyzeTrends(keywords: string[]): Promise<{
    trending: string[];
    emerging: string[];
    declining: string[];
    recommendations: string[];
  }> {
    const cacheKey = `trends-${keywords.join('-')}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Analyze trends for keywords. Categorize as trending, emerging, or declining. Add recommendations. Respond with JSON: {"trending": [], "emerging": [], "declining": [], "recommendations": []}`
          },
          { role: "user", content: `Keywords: ${keywords.join(', ')}` }
        ],
        max_tokens: 150,
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content || '{"trending":[],"emerging":[],"declining":[],"recommendations":[]}');
    }, 360); // 6 hour cache
  }

  // 10. Smart Summarization - Information distillation
  async summarizeContent(content: string, maxSentences: number = 3): Promise<{
    summary: string;
    keyPoints: string[];
    wordCount: number;
  }> {
    const cacheKey = `summary-${content.slice(0, 100)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Summarize in ${maxSentences} sentences max. Extract 3-5 key points. Respond with JSON: {"summary": "text", "keyPoints": ["point1"], "wordCount": number}`
          },
          { role: "user", content: content }
        ],
        max_tokens: 200,
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{"summary":"","keyPoints":[],"wordCount":0}');
      result.wordCount = content.split(' ').length;
      return result;
    }, 120); // 2 hour cache
  }

  // Cost monitoring and optimization
  getUsageStats(): {
    cacheHitRate: number;
    totalRequests: number;
    estimatedSavings: number;
  } {
    const totalCached = this.cache.size;
    const estimatedRequests = totalCached * 2; // Assume each cache entry saved 1 additional request
    const costPerRequest = 0.002; // Estimated cost in USD
    
    return {
      cacheHitRate: totalCached > 0 ? (estimatedRequests / (estimatedRequests + totalCached)) * 100 : 0,
      totalRequests: estimatedRequests + totalCached,
      estimatedSavings: estimatedRequests * costPerRequest
    };
  }

  // Clear old cache entries to manage memory
  clearExpiredCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((value, key) => {
      if (value.expiry <= now) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

export const costEffectiveAI = new CostEffectiveAIFeatures();