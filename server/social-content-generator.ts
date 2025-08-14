import OpenAI from "openai";
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface ContentTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  platform: string[];
}

export interface GeneratedContent {
  id: string;
  content: string;
  hashtags: string[];
  mediaPath?: string;
  platform: string;
  createdAt: Date;
  exported?: boolean;
}

export class FlutterbySocialContentGenerator {
  private baseUrl: string;
  private contentDir: string;

  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.contentDir = path.join(process.cwd(), 'generated-content');
    this.initializeContentDirectory();
  }

  private async initializeContentDirectory() {
    try {
      await fs.mkdir(this.contentDir, { recursive: true });
      await fs.mkdir(path.join(this.contentDir, 'screenshots'), { recursive: true });
      await fs.mkdir(path.join(this.contentDir, 'posts'), { recursive: true });
    } catch (error) {
      console.error('Failed to create content directories:', error);
    }
  }

  // Alternative 1: Generate content files that can be manually posted
  async generateContentForExport(options: {
    platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook';
    contentType: 'feature-highlight' | 'platform-stats' | 'user-success' | 'tutorial';
    includeScreenshot?: boolean;
  }): Promise<GeneratedContent> {
    const { platform, contentType, includeScreenshot = true } = options;

    // Capture screenshot if requested
    let mediaPath: string | undefined;
    if (includeScreenshot) {
      mediaPath = await this.captureFlutterbyeScreenshot(contentType);
    }

    // Generate AI content
    const content = await this.generatePlatformContent(platform, contentType);
    const hashtags = await this.generateHashtags(platform, contentType);

    const generatedContent: GeneratedContent = {
      id: `content_${Date.now()}`,
      content,
      hashtags,
      mediaPath,
      platform,
      createdAt: new Date(),
      exported: false
    };

    // Save content to file for manual posting
    await this.saveContentToFile(generatedContent);

    return generatedContent;
  }

  // Alternative 2: Generate social media kit with multiple formats
  async generateSocialMediaKit(theme: string): Promise<{
    twitter: GeneratedContent;
    linkedin: GeneratedContent;
    instagram: GeneratedContent;
    facebook: GeneratedContent;
  }> {
    const platforms = ['twitter', 'linkedin', 'instagram', 'facebook'] as const;
    const kit: any = {};

    // Generate screenshot once for all platforms
    const screenshotPath = await this.captureFlutterbyeScreenshot('feature-highlight');

    for (const platform of platforms) {
      const content = await this.generatePlatformContent(platform, theme);
      const hashtags = await this.generateHashtags(platform, theme);

      kit[platform] = {
        id: `${platform}_${Date.now()}`,
        content,
        hashtags,
        mediaPath: screenshotPath,
        platform,
        createdAt: new Date(),
        exported: false
      };

      await this.saveContentToFile(kit[platform]);
    }

    return kit;
  }

  // Alternative 3: Generate scheduling CSV for third-party tools
  async generateSchedulingCSV(posts: GeneratedContent[]): Promise<string> {
    const csvHeader = 'Platform,Content,Hashtags,MediaPath,ScheduledTime\n';
    const csvRows = posts.map(post => {
      const scheduledTime = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      return `"${post.platform}","${post.content.replace(/"/g, '""')}","${post.hashtags.join(' ')}","${post.mediaPath || ''}","${scheduledTime.toISOString()}"`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;
    const csvPath = path.join(this.contentDir, `social-schedule-${Date.now()}.csv`);
    await fs.writeFile(csvPath, csvContent);

    return csvPath;
  }

  // Alternative 4: Generate webhook-ready content for Zapier/Make.com
  async generateWebhookContent(contentType: string): Promise<{
    webhook_url: string;
    payload: any;
    instructions: string;
  }> {
    const content = await this.generateContentForExport({
      platform: 'twitter',
      contentType: contentType as any,
      includeScreenshot: true
    });

    return {
      webhook_url: 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/',
      payload: {
        content: content.content,
        hashtags: content.hashtags.join(' '),
        image_path: content.mediaPath,
        platform: 'multiple',
        action: 'post_to_social'
      },
      instructions: `
1. Set up a Zapier webhook trigger
2. Connect to your social media accounts
3. Use this payload structure to auto-post
4. Schedule posts using Zapier's delay features
      `.trim()
    };
  }

  private async captureFlutterbyeScreenshot(contentType: string): Promise<string> {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      
      // Map content types to pages
      const pageMap: Record<string, string> = {
        'feature-highlight': '/dashboard',
        'platform-stats': '/intelligence',
        'user-success': '/create',
        'tutorial': '/info'
      };

      const targetPage = pageMap[contentType] || '/';
      
      await page.goto(`${this.baseUrl}${targetPage}`, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      await page.waitForTimeout(3000);
      
      const screenshotPath = path.join(
        this.contentDir, 
        'screenshots', 
        `${contentType}-${Date.now()}.png`
      );
      
      await page.screenshot({ 
        path: screenshotPath,
        type: 'png',
        fullPage: false
      });
      
      return screenshotPath;
    } finally {
      await browser.close();
    }
  }

  private async generatePlatformContent(platform: string, theme: string): Promise<string> {
    const prompts = {
      twitter: `Create an engaging Twitter post (max 280 characters) about Flutterbye's ${theme}. Focus on benefits, use emojis, and make it shareable.`,
      linkedin: `Write a professional LinkedIn post about Flutterbye's ${theme}. Include business benefits, target professionals, and encourage engagement.`,
      instagram: `Create an Instagram caption for Flutterbye's ${theme}. Use storytelling, emojis, and encourage community interaction.`,
      facebook: `Write a Facebook post about Flutterbye's ${theme}. Make it conversational, informative, and encourage shares.`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a social media expert creating content for Flutterbye, a revolutionary Web3 platform that tokenizes messages and enables value attachment. Focus on innovation, AI integration, and blockchain benefits."
        },
        {
          role: "user",
          content: prompts[platform as keyof typeof prompts] || prompts.twitter
        }
      ],
      max_tokens: 300
    });

    return response.choices[0].message.content?.trim() || '';
  }

  private async generateHashtags(platform: string, theme: string): Promise<string[]> {
    // Core brand hashtags that should always be included
    const coreHashtags = ['#Flutterbye', '#Web3', '#Blockchain'];
    
    // Platform-specific hashtags for maximum reach
    const platformHashtags: Record<string, string[]> = {
      twitter: ['#CryptoTwitter', '#BuildInPublic', '#Innovation', '#AIRevolution', '#Web3Community'],
      linkedin: ['#BlockchainInnovation', '#Web3Technology', '#DigitalTransformation', '#FutureOfWork', '#TechLeadership'],
      instagram: ['#Web3Life', '#CryptoInnovation', '#TechTrends', '#DigitalLife', '#Innovation'],
      facebook: ['#Innovation', '#Technology', '#DigitalFuture', '#Blockchain', '#AI']
    };

    // Theme-specific hashtags for targeted engagement
    const themeHashtags: Record<string, string[]> = {
      'Token Creation': ['#TokenMinting', '#CreateTokens', '#NFT', '#DigitalAssets', '#Crypto'],
      'AI Features': ['#AI', '#ArtificialIntelligence', '#MachineLearning', '#SmartContracts'],
      'Platform Updates': ['#News', '#Update', '#Launch', '#Breaking', '#Announcement'],
      'User Growth': ['#Growth', '#Analytics', '#Metrics', '#Success', '#Progress'],
      'Tutorial': ['#Tutorial', '#HowTo', '#Learn', '#Guide', '#Education', '#Web3Education']
    };

    // Trending hashtags that boost visibility
    const trendingHashtags = [
      '#TokenizedWorld', '#DecentralizedSocial', '#FutureOfMessaging', '#CryptoLife',
      '#Web3Tech', '#BlockchainSolutions', '#DigitalInnovation', '#SmartContracts',
      '#DeFi', '#NFTCommunity', '#CryptoInnovation', '#Web3Revolution', '#GameChanger'
    ];

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `Generate 2-3 strategic, trending hashtags for ${platform} about Flutterbye's ${theme}. Focus on viral potential and maximum engagement. Return as JSON array with "hashtags" field.`
          },
          {
            role: "user",
            content: `Create hashtags that will trend and maximize visibility for a revolutionary Web3 messaging platform discussing ${theme}.`
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{"hashtags":[]}');
      const aiHashtags = result.hashtags || [];
      
      // Combine hashtags strategically
      const specificTags = themeHashtags[theme] || [];
      const platformTags = platformHashtags[platform] || [];
      const randomTrending = trendingHashtags.sort(() => 0.5 - Math.random()).slice(0, 2);
      
      // Platform-specific limits for optimal engagement
      const platformLimits: Record<string, number> = {
        twitter: 10,    // Twitter allows more hashtags
        linkedin: 8,    // LinkedIn prefers fewer, more professional
        instagram: 15,  // Instagram supports many hashtags
        facebook: 6     // Facebook prefers minimal hashtags
      };

      // Build final hashtag list
      const finalHashtags = [
        ...coreHashtags,
        ...platformTags.slice(0, 3),
        ...specificTags.slice(0, 3),
        ...aiHashtags.slice(0, 2),
        ...randomTrending
      ];
      
      // Remove duplicates and ensure proper formatting
      const uniqueHashtags = [...new Set(finalHashtags)]
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
        .slice(0, platformLimits[platform] || 8);
      
      console.log(`🏷️ Generated ${uniqueHashtags.length} optimal hashtags for ${platform} ${theme}:`, uniqueHashtags);
      return uniqueHashtags;
      
    } catch (error) {
      console.error('Failed to generate AI hashtags, using enhanced fallback:', error);
      
      // Enhanced fallback with theme-specific tags
      const specificTags = themeHashtags[theme] || [];
      const platformTags = platformHashtags[platform] || [];
      const fallbackTags = [
        ...coreHashtags,
        ...platformTags.slice(0, 3),
        ...specificTags.slice(0, 3),
        '#CryptoTwitter',
        '#Innovation'
      ];
      
      return fallbackTags.slice(0, 10);
    }
  }

  private async saveContentToFile(content: GeneratedContent): Promise<void> {
    const fileName = `${content.platform}-${content.id}.json`;
    const filePath = path.join(this.contentDir, 'posts', fileName);
    
    const fileContent = {
      ...content,
      instructions: this.getPostingInstructions(content.platform),
      exportedAt: new Date()
    };

    await fs.writeFile(filePath, JSON.stringify(fileContent, null, 2));

    // Also create a human-readable text version
    const textFileName = `${content.platform}-${content.id}.txt`;
    const textFilePath = path.join(this.contentDir, 'posts', textFileName);
    
    const textContent = `
PLATFORM: ${content.platform.toUpperCase()}
CONTENT: ${content.content}
HASHTAGS: ${content.hashtags.join(' ')}
IMAGE: ${content.mediaPath || 'None'}
CREATED: ${content.createdAt.toISOString()}

POSTING INSTRUCTIONS:
${this.getPostingInstructions(content.platform)}
    `.trim();

    await fs.writeFile(textFilePath, textContent);
  }

  private getPostingInstructions(platform: string): string {
    const instructions = {
      twitter: `
1. Copy the content above
2. Go to twitter.com
3. Click "What's happening?"
4. Paste content and hashtags
5. Upload the screenshot image if provided
6. Click Tweet
      `,
      linkedin: `
1. Copy the content above
2. Go to linkedin.com
3. Click "Start a post"
4. Paste content
5. Add hashtags at the end
6. Upload screenshot if provided
7. Click Post
      `,
      instagram: `
1. Use Instagram mobile app or Creator Studio
2. Upload the screenshot image
3. Copy and paste the caption
4. Add hashtags
5. Share to feed
      `,
      facebook: `
1. Go to facebook.com
2. Click "What's on your mind?"
3. Paste content
4. Upload screenshot if provided
5. Add hashtags
6. Click Post
      `
    };

    return instructions[platform as keyof typeof instructions] || instructions.twitter;
  }

  // Get all generated content files
  async getGeneratedContent(): Promise<GeneratedContent[]> {
    try {
      const postsDir = path.join(this.contentDir, 'posts');
      const files = await fs.readdir(postsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const content = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(postsDir, file);
          const fileContent = await fs.readFile(filePath, 'utf-8');
          return JSON.parse(fileContent);
        })
      );

      return content.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return [];
    }
  }

  // Clean up old content files
  async cleanupOldContent(daysOld = 30): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - (daysOld * 24 * 60 * 60 * 1000));
      const content = await this.getGeneratedContent();
      
      for (const item of content) {
        if (new Date(item.createdAt) < cutoffDate) {
          const jsonPath = path.join(this.contentDir, 'posts', `${item.platform}-${item.id}.json`);
          const textPath = path.join(this.contentDir, 'posts', `${item.platform}-${item.id}.txt`);
          
          try {
            await fs.unlink(jsonPath);
            await fs.unlink(textPath);
            if (item.mediaPath) {
              await fs.unlink(item.mediaPath);
            }
          } catch {
            // File already deleted or doesn't exist
          }
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old content:', error);
    }
  }
}

export const contentGenerator = new FlutterbySocialContentGenerator();