import OpenAI from 'openai';

export class OpenAIService {
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

  async generateOptimizedHashtags(content: string, category: string = 'general'): Promise<string[]> {
    if (!this.client) {
      return this.getOptimalHashtagSet(category);
    }

    try {
      const prompt = `Generate the optimal 8-12 hashtags for this Twitter post about FlutterBye (a Web3 tokenized messaging platform on Solana blockchain):

"${content}"

Category: ${category}

Requirements:
- Use 8-12 hashtags total (Twitter's optimal range for engagement)
- Mix of broad and niche hashtags for reach and engagement
- Always include #FlutterBye as the primary brand hashtag
- Include relevant Web3, crypto, and technology hashtags
- Add trending or seasonal hashtags when relevant
- Balance high-competition and low-competition hashtags
- Ensure hashtags are actually relevant to the content

Return as a JSON array of hashtag strings (with # symbols).

Example format: ["#FlutterBye", "#Web3", "#Solana", "#Crypto", "#Innovation", "#Blockchain", "#SocialMedia", "#Future", "#Tech", "#Communication"]`;

      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const result = response.choices[0]?.message?.content;
      if (result) {
        const parsed = JSON.parse(result);
        if (Array.isArray(parsed.hashtags)) {
          return parsed.hashtags.slice(0, 12); // Ensure max 12 hashtags
        }
      }
    } catch (error) {
      console.error('Hashtag generation error:', error);
    }

    return this.getOptimalHashtagSet(category);
  }

  private getOptimalHashtagSet(category: string): string[] {
    const hashtagSets = {
      general: [
        '#FlutterBye', '#Web3', '#Solana', '#Crypto', '#Blockchain', 
        '#Innovation', '#Future', '#Tech', '#Communication', '#Digital'
      ],
      technology: [
        '#FlutterBye', '#Web3', '#Solana', '#SPLTokens', '#Blockchain', 
        '#DeFi', '#SmartContracts', '#Innovation', '#TechTrends', '#CryptoTech'
      ],
      community: [
        '#FlutterBye', '#Web3Community', '#Solana', '#CryptoCommunity', 
        '#BuildTogether', '#Innovation', '#Future', '#JoinUs', '#Community', '#Growth'
      ],
      product: [
        '#FlutterBye', '#TokenizedMessages', '#Web3', '#Solana', '#ProductLaunch', 
        '#Innovation', '#MessagingRevolution', '#Crypto', '#Communication', '#GameChanger'
      ],
      trading: [
        '#FlutterBye', '#Solana', '#SPLTokens', '#CryptoTrading', '#DeFi', 
        '#TokenUtility', '#Web3', '#Investment', '#Digital', '#Finance'
      ]
    };

    return hashtagSets[category] || hashtagSets.general;
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