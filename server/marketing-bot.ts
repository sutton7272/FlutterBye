import OpenAI from 'openai';
import { Storage } from './storage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface TwitterPost {
  id: string;
  content: string;
  hashtags: string[];
  scheduled_time: Date;
  posted: boolean;
  engagement?: {
    likes: number;
    retweets: number;
    replies: number;
  };
}

interface MarketingBotConfig {
  enabled: boolean;
  auto_post: boolean;
  platforms: string[];
  content_style: string;
  brand_voice: string;
  posting_schedule: {
    times: string[];
    frequency: number;
  };
  hashtags: string[];
}

interface NewsSource {
  title: string;
  content: string;
  url: string;
  source: string;
  published_at: string;
}

export class MarketingBot {
  private config: MarketingBotConfig;
  private storage: Storage;
  
  constructor(storage: Storage) {
    this.storage = storage;
    this.config = {
      enabled: true,
      auto_post: false, // Start with manual approval
      platforms: ['twitter'],
      content_style: 'Professional & Informative',
      brand_voice: 'Innovative, trustworthy, and forward-thinking in the crypto space',
      posting_schedule: {
        times: ['09:00', '13:00', '17:00', '21:00'], // 4 times daily
        frequency: 4
      },
      hashtags: ['#Flutterbye', '#Crypto', '#Blockchain', '#Web3', '#Solana', '#DeFi']
    };
  }

  // Generate AI content for social media posts
  async generateTwitterContent(context: {
    type: 'feature_highlight' | 'industry_news' | 'community' | 'educational';
    data?: any;
    news?: NewsSource[];
  }): Promise<string> {
    let prompt = `Create a Twitter post for Flutterbye, a Solana-based crypto messaging platform. `;
    
    switch (context.type) {
      case 'feature_highlight':
        prompt += `Highlight a platform feature. Focus on 27-character message tokens that carry real SOL value and emotional meaning. Make it engaging and informative. Include relevant crypto hashtags.`;
        break;
      case 'industry_news':
        prompt += `Comment on crypto industry news in relation to Flutterbye's mission. `;
        if (context.news && context.news.length > 0) {
          prompt += `Recent news: ${context.news[0].title} - ${context.news[0].content.substring(0, 200)}. `;
        }
        prompt += `Connect it to Flutterbye's value proposition.`;
        break;
      case 'community':
        prompt += `Create community engagement content. Focus on user success stories, tips for using the platform, or encouraging participation.`;
        break;
      case 'educational':
        prompt += `Create educational content about crypto, blockchain, or how Flutterbye works. Make it accessible and valuable.`;
        break;
    }
    
    prompt += `\n\nStyle: ${this.config.content_style}
Brand Voice: ${this.config.brand_voice}
Character limit: 280 characters
Include 2-3 relevant hashtags from: ${this.config.hashtags.join(', ')}
Make it engaging and authentic.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a crypto marketing expert creating engaging Twitter content for Flutterbye."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating Twitter content:', error);
      return `🚀 Flutterbye is revolutionizing crypto communication with 27-character messages that carry real value! Experience the future of Web3 messaging. #Flutterbye #Crypto #Solana`;
    }
  }

  // Fetch crypto industry news
  async fetchCryptoNews(): Promise<NewsSource[]> {
    // In a real implementation, you'd integrate with news APIs like:
    // - CoinDesk API
    // - CoinTelegraph API
    // - CryptoNews API
    // For now, return mock data structure
    return [
      {
        title: "Bitcoin reaches new all-time high",
        content: "Bitcoin surged to unprecedented levels as institutional adoption continues...",
        url: "https://example.com/news/1",
        source: "CoinDesk",
        published_at: new Date().toISOString()
      },
      {
        title: "Solana ecosystem shows strong growth",
        content: "The Solana blockchain ecosystem continues to expand with new DeFi protocols...",
        url: "https://example.com/news/2", 
        source: "CoinTelegraph",
        published_at: new Date().toISOString()
      }
    ];
  }

  // Generate content for all scheduled posts
  async generateScheduledContent(): Promise<TwitterPost[]> {
    const posts: TwitterPost[] = [];
    const news = await this.fetchCryptoNews();
    
    const contentTypes = ['feature_highlight', 'industry_news', 'community', 'educational'] as const;
    
    for (let i = 0; i < this.config.posting_schedule.frequency; i++) {
      const contentType = contentTypes[i % contentTypes.length];
      const content = await this.generateTwitterContent({
        type: contentType,
        news: contentType === 'industry_news' ? news : undefined
      });
      
      // Calculate scheduled time for today
      const today = new Date();
      const scheduledTime = new Date(today);
      const timeSlot = this.config.posting_schedule.times[i];
      const [hours, minutes] = timeSlot.split(':').map(Number);
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      posts.push({
        id: `post_${Date.now()}_${i}`,
        content,
        hashtags: this.extractHashtags(content),
        scheduled_time: scheduledTime,
        posted: false
      });
    }
    
    return posts;
  }

  // Extract hashtags from content
  private extractHashtags(content: string): string[] {
    const hashtagRegex = /#\w+/g;
    return content.match(hashtagRegex) || [];
  }

  // Generate weekly blog content
  async generateWeeklyBlog(): Promise<{
    title: string;
    content: string;
    excerpt: string;
    seo_keywords: string[];
    published_date: Date;
  }> {
    const news = await this.fetchCryptoNews();
    
    const prompt = `Create a comprehensive weekly blog post for Flutterbye's homepage. 

Topic: Weekly crypto industry roundup with focus on how trends relate to Flutterbye's mission.

Include:
1. SEO-optimized title (60 characters max)
2. Engaging excerpt (160 characters max) 
3. 5-7 relevant SEO keywords
4. 800-1200 word article covering:
   - Major crypto/blockchain news this week
   - How trends impact messaging and value transfer
   - Flutterbye's unique position in the market
   - Technical insights about Solana ecosystem
   - Future implications for crypto communication

Recent news context: ${news.map(n => `${n.title}: ${n.content.substring(0, 100)}`).join('\n')}

Style: Professional, informative, SEO-optimized
Target audience: Crypto enthusiasts, developers, and Web3 users
Brand voice: ${this.config.brand_voice}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system", 
            content: "You are a crypto industry expert and content marketing specialist creating SEO-optimized blog content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        title: result.title || 'Weekly Crypto Insights: Flutterbye Market Analysis',
        content: result.content || 'Weekly analysis of crypto market trends...',
        excerpt: result.excerpt || 'Stay updated with the latest crypto trends and how they impact Web3 communication.',
        seo_keywords: result.seo_keywords || ['crypto', 'blockchain', 'Solana', 'Web3', 'messaging'],
        published_date: new Date()
      };
    } catch (error) {
      console.error('Error generating blog content:', error);
      return {
        title: 'Weekly Crypto Market Analysis',
        content: 'This week in crypto brought significant developments...',
        excerpt: 'Weekly roundup of crypto trends and market analysis.',
        seo_keywords: ['crypto', 'blockchain', 'market', 'analysis'],
        published_date: new Date()
      };
    }
  }

  // Get marketing analytics
  async getAnalytics(): Promise<{
    total_posts: number;
    engagement_rate: number;
    follower_growth: number;
    click_through_rate: number;
    recent_posts: TwitterPost[];
  }> {
    // In real implementation, fetch from Twitter API and analytics services
    return {
      total_posts: 247,
      engagement_rate: 4.8,
      follower_growth: 892,
      click_through_rate: 3.2,
      recent_posts: [
        {
          id: 'recent_1',
          content: '🚀 FlutterAI just analyzed 10,000+ wallet patterns! Our AI can now predict market sentiment with 94% accuracy. The future of crypto intelligence is here. #Flutterbye #AI #Crypto',
          hashtags: ['#Flutterbye', '#AI', '#Crypto'],
          scheduled_time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          posted: true,
          engagement: { likes: 23, retweets: 5, replies: 2 }
        },
        {
          id: 'recent_2',
          content: 'Did you know? 🤯 Flutterbye\'s 27-character messages can carry real SOL value AND emotional meaning. It\'s like digital greeting cards that actually matter. Try it now! #Web3 #Solana',
          hashtags: ['#Web3', '#Solana'],
          scheduled_time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          posted: true,
          engagement: { likes: 41, retweets: 12, replies: 3 }
        }
      ]
    };
  }

  // Update bot configuration
  updateConfig(newConfig: Partial<MarketingBotConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): MarketingBotConfig {
    return { ...this.config };
  }
}