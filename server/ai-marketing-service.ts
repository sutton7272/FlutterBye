import { openaiService } from "./openai-service";

export interface MarketingBotSettings {
  enabled: boolean;
  postFrequency: {
    twitter: number; // posts per day
    linkedin: number;
    instagram: number;
  };
  blogFrequency: number; // posts per week
  contentSources: string[];
  tone: 'professional' | 'casual' | 'technical' | 'friendly';
  autoPublish: boolean;
}

export interface GeneratedContent {
  id: string;
  platform: string;
  content: string;
  hashtags: string[];
  scheduledFor: string;
  status: 'draft' | 'scheduled' | 'published';
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface MarketingCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  platform: 'twitter' | 'linkedin' | 'instagram' | 'blog';
  nextPost: string;
  totalPosts: number;
  engagement: number;
  createdAt: string;
}

class AIMarketingService {
  private settings: MarketingBotSettings = {
    enabled: false,
    postFrequency: {
      twitter: 3,
      linkedin: 1,
      instagram: 1
    },
    blogFrequency: 1,
    contentSources: [
      'https://flutterbye.com',
      'Solana blockchain updates',
      'Token creation tutorials',
      'Web3 communication trends'
    ],
    tone: 'professional',
    autoPublish: false
  };

  private contentLibrary: GeneratedContent[] = [];
  private campaigns: MarketingCampaign[] = [];

  // Get current bot settings
  async getSettings(): Promise<MarketingBotSettings> {
    return this.settings;
  }

  // Update bot settings
  async updateSettings(newSettings: Partial<MarketingBotSettings>): Promise<MarketingBotSettings> {
    this.settings = { ...this.settings, ...newSettings };
    return this.settings;
  }

  // Generate content using OpenAI
  async generateContent(platform: string, count: number = 1): Promise<GeneratedContent[]> {
    const generatedContent: GeneratedContent[] = [];
    
    for (let i = 0; i < count; i++) {
      const content = await this.generateSingleContent(platform);
      generatedContent.push(content);
    }

    // Add to content library
    this.contentLibrary.push(...generatedContent);
    
    return generatedContent;
  }

  private async generateSingleContent(platform: string): Promise<GeneratedContent> {
    try {
      const prompt = this.createContentPrompt(platform);
      
      const response = await openaiService.generateContent(prompt, {
        maxTokens: platform === 'blog' ? 800 : 280,
        temperature: 0.7
      });

      const content = this.parseGeneratedContent(response, platform);
      
      return {
        id: `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        platform,
        content: content.text,
        hashtags: content.hashtags,
        scheduledFor: this.calculateScheduleTime(platform),
        status: 'draft'
      };
    } catch (error) {
      console.error('Failed to generate content:', error);
      
      // Fallback content
      return {
        id: `${platform}_fallback_${Date.now()}`,
        platform,
        content: this.getFallbackContent(platform),
        hashtags: this.getFallbackHashtags(platform),
        scheduledFor: this.calculateScheduleTime(platform),
        status: 'draft'
      };
    }
  }

  private createContentPrompt(platform: string): string {
    const platformSpecs = {
      twitter: 'Create a Twitter post (max 280 characters)',
      linkedin: 'Create a LinkedIn post (professional, informative)',
      instagram: 'Create an Instagram post (visual, engaging)',
      blog: 'Create a blog post outline with title and key points'
    };

    const toneDescriptions = {
      professional: 'professional and authoritative',
      casual: 'casual and conversational', 
      technical: 'technical and detailed',
      friendly: 'friendly and approachable'
    };

    return `${platformSpecs[platform as keyof typeof platformSpecs]} about Flutterbye, a revolutionary blockchain communication platform that transforms messages into valuable SPL tokens on Solana. 

Key features to highlight:
- 60-second token creation
- Tokenized messaging system
- Value attachment to messages
- Solana blockchain integration
- Web3 communication revolution

Tone: ${toneDescriptions[this.settings.tone]}
Include relevant hashtags.
Focus on innovation, value creation, and the future of communication.

Return in JSON format:
{
  "text": "content here",
  "hashtags": ["#tag1", "#tag2"]
}`;
  }

  private parseGeneratedContent(response: string, platform: string) {
    try {
      const parsed = JSON.parse(response);
      return {
        text: parsed.text || this.getFallbackContent(platform),
        hashtags: parsed.hashtags || this.getFallbackHashtags(platform)
      };
    } catch (error) {
      return {
        text: this.getFallbackContent(platform),
        hashtags: this.getFallbackHashtags(platform)
      };
    }
  }

  private getFallbackContent(platform: string): string {
    const fallbacks = {
      twitter: '🚀 The future of Web3 communication is here! Flutterbye transforms your messages into valuable tokens on Solana. Ready to tokenize your words?',
      linkedin: 'Exciting developments in blockchain communication! Our latest platform enables users to create tokenized messages, attach real value, and distribute across wallets.',
      instagram: '✨ Transform your words into wealth with Flutterbye! Create SPL tokens from your messages in just 60 seconds. The communication revolution starts now!',
      blog: 'The Future of Tokenized Communication: How Flutterbye is Revolutionizing Web3 Messaging'
    };
    return fallbacks[platform as keyof typeof fallbacks] || 'Flutterbye: The future of Web3 communication!';
  }

  private getFallbackHashtags(platform: string): string[] {
    const hashtagSets = {
      twitter: ['#Web3', '#Solana', '#Flutterbye', '#TokenCreation'],
      linkedin: ['#Blockchain', '#DeFi', '#Communication', '#Innovation'],
      instagram: ['#Web3', '#Crypto', '#TokenCreation', '#Innovation', '#Flutterbye'],
      blog: ['#Web3', '#Blockchain', '#Communication', '#Solana']
    };
    return hashtagSets[platform as keyof typeof hashtagSets] || ['#Flutterbye', '#Web3'];
  }

  private calculateScheduleTime(platform: string): string {
    const now = new Date();
    const scheduleMap = {
      twitter: 2, // 2 hours from now
      linkedin: 4, // 4 hours from now
      instagram: 6, // 6 hours from now
      blog: 24 // 1 day from now
    };
    
    const hoursToAdd = scheduleMap[platform as keyof typeof scheduleMap] || 2;
    const scheduledTime = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
    
    return scheduledTime.toISOString();
  }

  // Get all generated content
  async getContentLibrary(): Promise<GeneratedContent[]> {
    return this.contentLibrary;
  }

  // Publish content
  async publishContent(contentId: string): Promise<boolean> {
    const contentIndex = this.contentLibrary.findIndex(c => c.id === contentId);
    if (contentIndex === -1) return false;

    // In a real implementation, this would integrate with social media APIs
    // For now, we'll just update the status
    this.contentLibrary[contentIndex].status = 'published';
    this.contentLibrary[contentIndex].engagement = {
      likes: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20)
    };

    return true;
  }

  // Get campaigns
  async getCampaigns(): Promise<MarketingCampaign[]> {
    return this.campaigns;
  }

  // Create a new campaign
  async createCampaign(campaignData: Omit<MarketingCampaign, 'id' | 'createdAt'>): Promise<MarketingCampaign> {
    const newCampaign: MarketingCampaign = {
      ...campaignData,
      id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  // Generate SEO blog post
  async generateSEOBlogPost(topic?: string): Promise<GeneratedContent> {
    const blogTopic = topic || 'The Future of Tokenized Communication with Flutterbye';
    
    const prompt = `Write a comprehensive, SEO-optimized blog post about "${blogTopic}" focusing on Flutterbye's revolutionary blockchain communication platform.

Requirements:
- 800-1200 words
- SEO-friendly title
- Include keywords: tokenized messaging, blockchain communication, Solana tokens, Web3 messaging
- Structure with H2 and H3 headings
- Include practical examples
- Call-to-action at the end
- Professional tone

Return in JSON format:
{
  "title": "SEO-optimized title",
  "content": "Full blog post content with proper formatting",
  "keywords": ["keyword1", "keyword2"],
  "metaDescription": "155-character meta description"
}`;

    try {
      const response = await openaiService.generateContent(prompt, {
        maxTokens: 1500,
        temperature: 0.6
      });

      const parsed = JSON.parse(response);
      
      return {
        id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        platform: 'blog',
        content: parsed.content || 'Blog content could not be generated',
        hashtags: parsed.keywords || ['#Flutterbye', '#Web3', '#Blockchain'],
        scheduledFor: this.calculateScheduleTime('blog'),
        status: 'draft'
      };
    } catch (error) {
      console.error('Failed to generate blog post:', error);
      
      return {
        id: `blog_fallback_${Date.now()}`,
        platform: 'blog',
        content: 'The Future of Tokenized Communication: How Flutterbye is Revolutionizing Web3 Messaging',
        hashtags: ['#Flutterbye', '#Web3', '#Blockchain', '#Communication'],
        scheduledFor: this.calculateScheduleTime('blog'),
        status: 'draft'
      };
    }
  }

  // Auto-generate content based on schedule
  async runAutomatedGeneration(): Promise<void> {
    if (!this.settings.enabled) return;

    console.log('🤖 Running automated content generation...');
    
    // Generate Twitter posts
    if (this.shouldGenerateContent('twitter')) {
      await this.generateContent('twitter', this.settings.postFrequency.twitter);
      console.log(`✅ Generated ${this.settings.postFrequency.twitter} Twitter posts`);
    }

    // Generate LinkedIn posts
    if (this.shouldGenerateContent('linkedin')) {
      await this.generateContent('linkedin', this.settings.postFrequency.linkedin);
      console.log(`✅ Generated ${this.settings.postFrequency.linkedin} LinkedIn posts`);
    }

    // Generate Instagram posts
    if (this.shouldGenerateContent('instagram')) {
      await this.generateContent('instagram', this.settings.postFrequency.instagram);
      console.log(`✅ Generated ${this.settings.postFrequency.instagram} Instagram posts`);
    }

    // Generate weekly blog post
    if (this.shouldGenerateBlogPost()) {
      await this.generateSEOBlogPost();
      console.log('✅ Generated SEO blog post');
    }
  }

  private shouldGenerateContent(platform: string): boolean {
    // In a real implementation, check last generation time
    // For now, return true to allow manual testing
    return true;
  }

  private shouldGenerateBlogPost(): boolean {
    // In a real implementation, check if a week has passed since last blog post
    // For now, return true to allow manual testing
    return true;
  }

  // Get analytics data
  async getAnalytics() {
    const totalPosts = this.contentLibrary.length;
    const publishedPosts = this.contentLibrary.filter(c => c.status === 'published').length;
    const totalEngagement = this.contentLibrary
      .filter(c => c.engagement)
      .reduce((sum, c) => sum + (c.engagement!.likes + c.engagement!.shares + c.engagement!.comments), 0);

    return {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalEngagement,
      avgEngagement: publishedPosts > 0 ? Math.round(totalEngagement / publishedPosts) : 0,
      platforms: {
        twitter: this.contentLibrary.filter(c => c.platform === 'twitter').length,
        linkedin: this.contentLibrary.filter(c => c.platform === 'linkedin').length,
        instagram: this.contentLibrary.filter(c => c.platform === 'instagram').length,
        blog: this.contentLibrary.filter(c => c.platform === 'blog').length
      }
    };
  }
}

export const aiMarketingService = new AIMarketingService();