import OpenAI from 'openai';

class OpenAIService {
  private client: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  async generateTextCompletion(options: {
    prompt: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<string> {
    if (!this.client) {
      // Return simulated response when API key is not available
      return this.generateMockCompletion(options.prompt);
    }

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "user",
            content: options.prompt
          }
        ],
        max_tokens: options.maxTokens || 200,
        temperature: options.temperature || 0.7
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateMockCompletion(options.prompt);
    }
  }

  async generateImage(prompt: string): Promise<{ url: string }> {
    if (!this.client) {
      // Return placeholder when API key is not available
      return {
        url: '/images/ai-generated-placeholder.png'
      };
    }

    try {
      const response = await this.client.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      });

      return {
        url: response.data[0]?.url || '/images/ai-generated-placeholder.png'
      };
    } catch (error) {
      console.error('DALL-E API error:', error);
      return {
        url: '/images/ai-generated-placeholder.png'
      };
    }
  }

  private generateMockCompletion(prompt: string): string {
    // Generate contextual mock responses based on prompt content
    if (prompt.toLowerCase().includes('hashtag')) {
      return JSON.stringify({
        primaryTheme: 'web3',
        secondaryThemes: ['ai', 'blockchain'],
        tone: 'innovative',
        audience: 'crypto',
        trendingRelevance: 85
      });
    }

    if (prompt.toLowerCase().includes('visual')) {
      return 'Professional tech-focused visual with electric blue and neon green colors, featuring modern circuit aesthetics and clean composition optimized for social media engagement.';
    }

    return 'AI-powered analysis and optimization recommendations for enhanced social media performance.';
  }

  isAvailable(): boolean {
    return this.client !== null;
  }
}

export const openaiService = new OpenAIService();