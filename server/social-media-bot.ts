import OpenAI from "openai";
import puppeteer from "puppeteer";
import { TwitterApi } from "twitter-api-v2";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Twitter client setup
let twitterClient: TwitterApi | null = null;
if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET && 
    process.env.TWITTER_ACCESS_TOKEN && process.env.TWITTER_ACCESS_TOKEN_SECRET) {
  twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });
}

export interface SocialMediaPost {
  id: string;
  platform: 'twitter' | 'linkedin' | 'instagram';
  content: string;
  mediaUrls?: string[];
  scheduledAt?: Date;
  postedAt?: Date;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  metrics?: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
}

export class FlutterbySocialBot {
  private baseUrl: string;
  
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  // Capture screenshot of specific Flutterbye pages/features
  async captureFlutterbyeScreenshot(page: string, selector?: string): Promise<Buffer> {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const browserPage = await browser.newPage();
      await browserPage.setViewport({ width: 1200, height: 800 });
      
      // Navigate to Flutterbye page
      await browserPage.goto(`${this.baseUrl}${page}`, { 
        waitUntil: 'networkidle0' 
      });
      
      // Wait for content to load
      await browserPage.waitForTimeout(3000);
      
      let screenshot: Buffer;
      if (selector) {
        // Screenshot specific element
        const element = await browserPage.$(selector);
        if (element) {
          screenshot = await element.screenshot({ type: 'png' });
        } else {
          screenshot = await browserPage.screenshot({ type: 'png' });
        }
      } else {
        // Screenshot full page
        screenshot = await browserPage.screenshot({ 
          type: 'png',
          fullPage: true 
        });
      }
      
      return screenshot;
    } finally {
      await browser.close();
    }
  }

  // Extract platform data for content creation
  async extractPlatformData(): Promise<any> {
    const data = {
      tokenStats: {
        totalCreated: Math.floor(Math.random() * 10000) + 50000, // Mock data - replace with real API
        dailyActive: Math.floor(Math.random() * 1000) + 5000,
        totalValue: Math.floor(Math.random() * 1000000) + 10000000
      },
      featuredTokens: [
        { name: "GM Sunshine", value: "5.2 SOL", creator: "CryptoSun" },
        { name: "Coffee Break", value: "2.1 SOL", creator: "MorningBoost" },
        { name: "Thank You!", value: "1.8 SOL", creator: "GratefulHeart" }
      ],
      trends: [
        "Emotional tokens trending 📈",
        "AI-generated messages +340%",
        "Cross-chain integration launched"
      ]
    };
    
    return data;
  }

  // Generate social media content using OpenAI
  async generateSocialContent(
    contentType: 'announcement' | 'feature' | 'stats' | 'engagement',
    data: any,
    platform: 'twitter' | 'linkedin' | 'instagram' = 'twitter'
  ): Promise<string> {
    const platformLimits = {
      twitter: 280,
      linkedin: 3000,
      instagram: 2200
    };

    const prompts = {
      announcement: `Create an exciting ${platform} announcement about Flutterbye's latest milestone: ${JSON.stringify(data)}. Make it engaging and include relevant hashtags.`,
      feature: `Write a ${platform} post showcasing Flutterbye's revolutionary features. Focus on: ${JSON.stringify(data)}. Include call-to-action.`,
      stats: `Create a compelling ${platform} post about Flutterbye's impressive statistics: ${JSON.stringify(data)}. Make numbers exciting.`,
      engagement: `Write an engaging ${platform} post that encourages community interaction about Flutterbye. Include: ${JSON.stringify(data)}.`
    };

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are Flutterbye's social media manager. Create engaging ${platform} content that:
            - Stays under ${platformLimits[platform]} characters
            - Uses trending hashtags (#Web3 #Solana #AI #DeFi #Blockchain)
            - Includes emojis appropriately
            - Has a clear call-to-action
            - Maintains Flutterbye's innovative, tech-forward brand voice
            - Emphasizes the revolutionary nature of tokenized messaging`
          },
          {
            role: "user",
            content: prompts[contentType]
          }
        ],
        max_tokens: 300,
        temperature: 0.8
      });

      return response.choices[0].message.content || "Failed to generate content";
    } catch (error) {
      console.error("Error generating social content:", error);
      throw new Error("Failed to generate social media content");
    }
  }

  // Post to Twitter
  async postToTwitter(content: string, mediaBuffer?: Buffer): Promise<any> {
    if (!twitterClient) {
      throw new Error("Twitter API not configured");
    }

    try {
      let mediaId: string | undefined;
      
      if (mediaBuffer) {
        // Upload media first
        const mediaUpload = await twitterClient.v1.uploadMedia(mediaBuffer, {
          mimeType: 'image/png'
        });
        mediaId = mediaUpload;
      }

      // Post tweet
      const tweet = await twitterClient.v2.tweet({
        text: content,
        ...(mediaId && { media: { media_ids: [mediaId] } })
      });

      return {
        success: true,
        tweetId: tweet.data.id,
        url: `https://twitter.com/user/status/${tweet.data.id}`
      };
    } catch (error) {
      console.error("Error posting to Twitter:", error);
      throw error;
    }
  }

  // Main automation function
  async createAndPostContent(
    contentType: 'announcement' | 'feature' | 'stats' | 'engagement',
    screenshotPage?: string,
    screenshotSelector?: string
  ): Promise<SocialMediaPost> {
    const postId = Math.random().toString(36).substr(2, 9);
    
    try {
      // Extract platform data
      const data = await this.extractPlatformData();
      
      // Generate content
      const content = await this.generateSocialContent(contentType, data, 'twitter');
      
      // Capture screenshot if requested
      let screenshot: Buffer | undefined;
      if (screenshotPage) {
        screenshot = await this.captureFlutterbyeScreenshot(screenshotPage, screenshotSelector);
      }
      
      // Post to Twitter
      let twitterResult;
      if (twitterClient) {
        twitterResult = await this.postToTwitter(content, screenshot);
      }
      
      const socialPost: SocialMediaPost = {
        id: postId,
        platform: 'twitter',
        content,
        mediaUrls: twitterResult?.url ? [twitterResult.url] : undefined,
        postedAt: new Date(),
        status: twitterResult?.success ? 'posted' : 'failed',
        metrics: {
          likes: 0,
          shares: 0,
          comments: 0,
          views: 0
        }
      };

      return socialPost;
    } catch (error) {
      console.error("Error in social automation:", error);
      
      return {
        id: postId,
        platform: 'twitter',
        content: "Failed to generate content",
        status: 'failed',
        metrics: { likes: 0, shares: 0, comments: 0, views: 0 }
      };
    }
  }

  // Schedule automated posts
  async scheduleAutomation(intervalHours: number = 4): Promise<void> {
    const contentTypes: Array<'announcement' | 'feature' | 'stats' | 'engagement'> = [
      'stats', 'feature', 'engagement', 'announcement'
    ];
    
    const screenshotPages = [
      '/dashboard',
      '/create',
      '/ai-intelligence',
      '/'
    ];

    console.log(`🤖 Starting Flutterbye Social Bot with ${intervalHours}h intervals`);
    
    setInterval(async () => {
      try {
        const randomContentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
        const randomPage = screenshotPages[Math.floor(Math.random() * screenshotPages.length)];
        
        console.log(`🚀 Creating ${randomContentType} post with screenshot from ${randomPage}`);
        
        const result = await this.createAndPostContent(
          randomContentType,
          randomPage,
          '.main-content, .premium-card, .dashboard-grid' // Common selectors
        );
        
        console.log(`✅ Social post created: ${result.status}`, result);
      } catch (error) {
        console.error("❌ Automation error:", error);
      }
    }, intervalHours * 60 * 60 * 1000);
  }
}

export default FlutterbySocialBot;