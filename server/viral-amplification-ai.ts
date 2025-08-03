import OpenAI from 'openai';
import { storage } from './storage';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ViralContent {
  id: string;
  type: 'post' | 'story' | 'video' | 'thread';
  platform: 'twitter' | 'instagram' | 'tiktok' | 'linkedin' | 'all';
  content: string;
  hashtags: string[];
  viralScore: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  createdAt: Date;
}

interface ViralStrategy {
  contentPillars: string[];
  postingSchedule: { time: string; platform: string; contentType: string }[];
  hashtagStrategy: string[];
  engagementTactics: string[];
  viralTriggers: string[];
}

export class ViralAmplificationAI {
  private platforms = ['twitter', 'instagram', 'tiktok', 'linkedin'];
  private viralPatterns: Record<string, any> = {};

  async generateViralContent(topic: string, platform: string, userContext?: any): Promise<ViralContent> {
    try {
      const viralStrategy = await this.analyzeViralPatterns(topic, platform);
      const content = await this.createViralContent(topic, platform, viralStrategy);
      
      return {
        id: `viral_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: this.selectOptimalContentType(platform),
        platform: platform as any,
        content: content.text,
        hashtags: content.hashtags,
        viralScore: content.viralScore,
        engagement: { likes: 0, shares: 0, comments: 0, views: 0 },
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Viral content generation error:', error);
      return this.getFallbackContent(topic, platform);
    }
  }

  private async analyzeViralPatterns(topic: string, platform: string): Promise<any> {
    try {
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const prompt = `
        Analyze viral content patterns for topic "${topic}" on ${platform}.
        
        Provide analysis as JSON:
        {
          "trendingTopics": ["topic1", "topic2", "topic3"],
          "viralElements": ["element1", "element2", "element3"],
          "optimalTiming": "best posting time",
          "engagementHooks": ["hook1", "hook2", "hook3"],
          "hashtagTrends": ["#tag1", "#tag2", "#tag3"],
          "contentFormat": "recommended format",
          "viralTriggers": ["trigger1", "trigger2"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 400
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Viral pattern analysis error:', error);
      return this.getDefaultViralStrategy(platform);
    }
  }

  private async createViralContent(topic: string, platform: string, strategy: any): Promise<{
    text: string;
    hashtags: string[];
    viralScore: number;
  }> {
    try {
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const prompt = `
        Create viral ${platform} content about "${topic}" using these viral elements:
        - Trending topics: ${strategy.trendingTopics?.join(', ')}
        - Viral elements: ${strategy.viralElements?.join(', ')}
        - Engagement hooks: ${strategy.engagementHooks?.join(', ')}
        
        Platform-specific requirements:
        - Twitter: 280 chars, trending hashtags, engagement hooks
        - Instagram: Visual description, story-worthy, hashtag-heavy
        - TikTok: Hook in first 3 seconds, trend-based, action-oriented
        - LinkedIn: Professional angle, thought leadership, industry insights
        
        Return JSON:
        {
          "text": "viral content text",
          "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
          "viralScore": number (0-100),
          "callToAction": "specific CTA",
          "engagementBait": "engagement question/hook"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        text: result.text || `${topic} is changing everything! 🚀`,
        hashtags: result.hashtags || ['#viral', '#trending', '#ai'],
        viralScore: Math.min(100, Math.max(0, result.viralScore || 75))
      };
    } catch (error) {
      console.error('Viral content creation error:', error);
      return {
        text: `🚀 ${topic} is revolutionizing the game! Who else is excited? 👇`,
        hashtags: ['#innovation', '#trending', '#gameChanger'],
        viralScore: 60
      };
    }
  }

  async createViralCampaign(campaignGoal: string, duration: number = 7): Promise<{
    strategy: ViralStrategy;
    content: ViralContent[];
    scheduledPosts: any[];
  }> {
    try {
      const strategy = await this.generateViralStrategy(campaignGoal);
      const content = await this.generateCampaignContent(campaignGoal, strategy, duration);
      const schedule = this.createPostingSchedule(content, duration);
      
      return {
        strategy,
        content,
        scheduledPosts: schedule
      };
    } catch (error) {
      console.error('Viral campaign creation error:', error);
      return this.getFallbackCampaign(campaignGoal);
    }
  }

  private async generateViralStrategy(goal: string): Promise<ViralStrategy> {
    try {
      const prompt = `
        Create a viral marketing strategy for goal: "${goal}"
        
        Return comprehensive strategy as JSON:
        {
          "contentPillars": ["pillar1", "pillar2", "pillar3"],
          "postingSchedule": [
            {"time": "09:00", "platform": "twitter", "contentType": "thread"},
            {"time": "12:00", "platform": "instagram", "contentType": "story"},
            {"time": "18:00", "platform": "tiktok", "contentType": "video"}
          ],
          "hashtagStrategy": ["#primary", "#secondary", "#trending"],
          "engagementTactics": ["tactic1", "tactic2", "tactic3"],
          "viralTriggers": ["trigger1", "trigger2", "trigger3"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 600
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      return this.getDefaultStrategy();
    }
  }

  private async generateCampaignContent(goal: string, strategy: ViralStrategy, duration: number): Promise<ViralContent[]> {
    const contentPromises = [];
    const postsPerDay = 3;
    
    for (let day = 0; day < duration; day++) {
      for (let post = 0; post < postsPerDay; post++) {
        const platform = this.platforms[post % this.platforms.length];
        contentPromises.push(this.generateViralContent(goal, platform));
      }
    }
    
    return Promise.all(contentPromises);
  }

  private createPostingSchedule(content: ViralContent[], duration: number): any[] {
    const schedule = [];
    const optimalTimes = ['09:00', '12:00', '15:00', '18:00', '21:00'];
    
    content.forEach((item, index) => {
      const day = Math.floor(index / 3);
      const timeIndex = index % optimalTimes.length;
      
      schedule.push({
        contentId: item.id,
        platform: item.platform,
        scheduledTime: `Day ${day + 1} at ${optimalTimes[timeIndex]}`,
        content: item.content,
        hashtags: item.hashtags,
        viralScore: item.viralScore
      });
    });
    
    return schedule;
  }

  async trackViralPerformance(contentId: string, engagement: any): Promise<void> {
    try {
      // Track viral performance for machine learning optimization
      const viralScore = this.calculateViralScore(engagement);
      console.log(`Viral performance tracked: ${contentId} - Score: ${viralScore}`);
      
      // Update viral patterns for future optimization
      await this.updateViralPatterns(contentId, engagement, viralScore);
    } catch (error) {
      console.error('Error tracking viral performance:', error);
    }
  }

  private calculateViralScore(engagement: any): number {
    const { likes = 0, shares = 0, comments = 0, views = 0 } = engagement;
    
    // Weighted viral score calculation
    const shareWeight = 10; // Shares are most viral
    const commentWeight = 5; // Comments show deep engagement
    const likeWeight = 1; // Likes are basic engagement
    const viewWeight = 0.1; // Views are minimum engagement
    
    const score = (shares * shareWeight) + (comments * commentWeight) + 
                 (likes * likeWeight) + (views * viewWeight);
    
    return Math.min(100, Math.max(0, score / 100));
  }

  private async updateViralPatterns(contentId: string, engagement: any, viralScore: number): Promise<void> {
    // Machine learning optimization would happen here
    // For now, store patterns for future reference
    this.viralPatterns[contentId] = {
      engagement,
      viralScore,
      timestamp: new Date()
    };
  }

  private selectOptimalContentType(platform: string): 'post' | 'story' | 'video' | 'thread' {
    const typeMap: Record<string, ('post' | 'story' | 'video' | 'thread')> = {
      'twitter': 'thread',
      'instagram': 'story',
      'tiktok': 'video',
      'linkedin': 'post'
    };
    return typeMap[platform] || 'post';
  }

  private getFallbackContent(topic: string, platform: string): ViralContent {
    return {
      id: `fallback_${Date.now()}`,
      type: 'post',
      platform: platform as any,
      content: `🚀 ${topic} is changing everything! What's your take? 💭 #innovation #trending`,
      hashtags: ['#innovation', '#trending', '#viral'],
      viralScore: 50,
      engagement: { likes: 0, shares: 0, comments: 0, views: 0 },
      createdAt: new Date()
    };
  }

  private getDefaultViralStrategy(platform: string): any {
    return {
      trendingTopics: ['AI', 'innovation', 'future'],
      viralElements: ['controversy', 'emotion', 'relatability'],
      optimalTiming: '18:00',
      engagementHooks: ['question', 'poll', 'call-to-action'],
      hashtagTrends: ['#trending', '#viral', '#innovation'],
      contentFormat: 'short-form',
      viralTriggers: ['urgency', 'exclusivity']
    };
  }

  private getDefaultStrategy(): ViralStrategy {
    return {
      contentPillars: ['Innovation', 'Community', 'Value'],
      postingSchedule: [
        { time: '09:00', platform: 'twitter', contentType: 'thread' },
        { time: '12:00', platform: 'instagram', contentType: 'story' },
        { time: '18:00', platform: 'tiktok', contentType: 'video' }
      ],
      hashtagStrategy: ['#innovation', '#community', '#viral'],
      engagementTactics: ['Ask questions', 'Share stories', 'Create polls'],
      viralTriggers: ['Urgency', 'Exclusivity', 'Social proof']
    };
  }

  private getFallbackCampaign(goal: string): any {
    return {
      strategy: this.getDefaultStrategy(),
      content: [this.getFallbackContent(goal, 'twitter')],
      scheduledPosts: [{
        contentId: 'fallback_1',
        platform: 'twitter',
        scheduledTime: 'Day 1 at 09:00',
        content: `🚀 ${goal} - Let's make it viral!`,
        hashtags: ['#viral', '#trending'],
        viralScore: 50
      }]
    };
  }
}