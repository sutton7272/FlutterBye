import OpenAI from "openai";
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface SocialCredentials {
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook';
  username: string;
  password: string;
  email?: string;
}

export interface PostContent {
  text: string;
  hashtags: string[];
  imagePath?: string;
}

export class SocialPasswordAutomation {
  private baseUrl: string;
  private contentDir: string;

  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.contentDir = path.join(process.cwd(), 'social-automation');
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

  // Generate content and screenshot
  async generateContentWithScreenshot(contentType: string): Promise<PostContent> {
    // Generate AI content
    const content = await this.generateSocialContent(contentType);
    const hashtags = await this.generateHashtags(contentType);
    
    // Capture screenshot
    const imagePath = await this.captureFlutterbyeScreenshot(contentType);
    
    return {
      text: content,
      hashtags,
      imagePath
    };
  }

  // Twitter automation with password login
  async postToTwitter(credentials: SocialCredentials, postContent: PostContent): Promise<{success: boolean, message: string}> {
    const chromiumPath = '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';
    
    console.log(`🔍 Using Chromium path: ${chromiumPath}`);
    console.log(`🔍 Environment path: ${process.env.PUPPETEER_EXECUTABLE_PATH}`);
    
    const browser = await puppeteer.launch({ 
      headless: true, // Run headless for server environment
      executablePath: chromiumPath,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      
      // Navigate to Twitter login
      await page.goto('https://twitter.com/login', { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Enter username/email
      const usernameSelector = 'input[name="text"]';
      await page.waitForSelector(usernameSelector);
      await page.type(usernameSelector, credentials.username);
      
      // Click Next button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('[role="button"]'));
        const nextButton = buttons.find(btn => btn.textContent?.includes('Next'));
        if (nextButton) nextButton.click();
      });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Enter password
      const passwordSelector = 'input[name="password"]';
      await page.waitForSelector(passwordSelector);
      await page.type(passwordSelector, credentials.password);
      
      // Click Log in button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('[role="button"]'));
        const loginButton = buttons.find(btn => btn.textContent?.includes('Log in'));
        if (loginButton) loginButton.click();
      });
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Check if login successful by looking for compose button
      try {
        await page.waitForSelector('[data-testid="SideNav_NewTweet_Button"]', { timeout: 10000 });
      } catch {
        return { success: false, message: 'Login failed - check credentials' };
      }

      // Click compose tweet button
      await page.click('[data-testid="SideNav_NewTweet_Button"]');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Type the tweet content
      const tweetTextSelector = '[data-testid="tweetTextarea_0"]';
      await page.waitForSelector(tweetTextSelector);
      const fullText = `${postContent.text} ${postContent.hashtags.join(' ')}`;
      await page.type(tweetTextSelector, fullText);

      // Upload image if provided
      if (postContent.imagePath) {
        const imageInput = await page.$('input[data-testid="fileInput"]');
        if (imageInput) {
          await imageInput.uploadFile(postContent.imagePath);
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for image to process
        }
      }

      // Tweet the post
      await page.click('[data-testid="tweetButtonInline"]');
      await new Promise(resolve => setTimeout(resolve, 3000));

      return { success: true, message: 'Tweet posted successfully!' };
      
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to post tweet: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    } finally {
      await browser.close();
    }
  }

  // LinkedIn automation with password login
  async postToLinkedIn(credentials: SocialCredentials, postContent: PostContent): Promise<{success: boolean, message: string}> {
    const browser = await puppeteer.launch({ 
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      
      // Navigate to LinkedIn login
      await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000);

      // Enter email
      await page.type('#username', credentials.email || credentials.username);
      
      // Enter password  
      await page.type('#password', credentials.password);
      
      // Click Sign in
      await page.click('button[type="submit"]');
      await page.waitForTimeout(5000);

      // Check if login successful
      try {
        await page.waitForSelector('[data-control-name="share_via_linkedin"]', { timeout: 10000 });
      } catch {
        return { success: false, message: 'LinkedIn login failed - check credentials' };
      }

      // Click "Start a post" button
      await page.click('button[aria-label="Start a post"]');
      await page.waitForTimeout(2000);

      // Type the post content
      const contentArea = await page.waitForSelector('[data-placeholder="What do you want to talk about?"]');
      const fullText = `${postContent.text}\n\n${postContent.hashtags.join(' ')}`;
      await contentArea.type(fullText);

      // Upload image if provided
      if (postContent.imagePath) {
        const imageButton = await page.$('[aria-label="Add media"]');
        if (imageButton) {
          await imageButton.click();
          await page.waitForTimeout(1000);
          
          const fileInput = await page.$('input[type="file"]');
          if (fileInput) {
            await fileInput.uploadFile(postContent.imagePath);
            await page.waitForTimeout(5000); // Wait for image to process
          }
        }
      }

      // Post the content
      await page.click('button[aria-label="Post"]');
      await page.waitForTimeout(3000);

      return { success: true, message: 'LinkedIn post published successfully!' };
      
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to post to LinkedIn: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    } finally {
      await browser.close();
    }
  }

  // Facebook automation with password login
  async postToFacebook(credentials: SocialCredentials, postContent: PostContent): Promise<{success: boolean, message: string}> {
    const browser = await puppeteer.launch({ 
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      
      // Navigate to Facebook login
      await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000);

      // Enter email/username
      await page.type('#email', credentials.email || credentials.username);
      
      // Enter password
      await page.type('#pass', credentials.password);
      
      // Click Log In
      await page.click('#loginbutton');
      await page.waitForTimeout(5000);

      // Check if login successful
      try {
        await page.waitForSelector('[data-testid="status-attachment-mentions-input"]', { timeout: 10000 });
      } catch {
        return { success: false, message: 'Facebook login failed - check credentials' };
      }

      // Click on the "What's on your mind?" box
      await page.click('[data-testid="status-attachment-mentions-input"]');
      await page.waitForTimeout(2000);

      // Type the post content
      const textArea = await page.waitForSelector('[data-testid="status-attachment-mentions-input"]');
      const fullText = `${postContent.text}\n\n${postContent.hashtags.join(' ')}`;
      await textArea.type(fullText);

      // Upload image if provided
      if (postContent.imagePath) {
        const photoButton = await page.$('[aria-label="Photo/Video"]');
        if (photoButton) {
          await photoButton.click();
          await page.waitForTimeout(1000);
          
          const fileInput = await page.$('input[type="file"][accept*="image"]');
          if (fileInput) {
            await fileInput.uploadFile(postContent.imagePath);
            await page.waitForTimeout(5000);
          }
        }
      }

      // Post the content
      await page.click('[data-testid="react-composer-post-button"]');
      await page.waitForTimeout(3000);

      return { success: true, message: 'Facebook post published successfully!' };
      
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to post to Facebook: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    } finally {
      await browser.close();
    }
  }

  // Post to multiple platforms
  async postToMultiplePlatforms(
    credentialsMap: Map<string, SocialCredentials>, 
    postContent: PostContent
  ): Promise<{platform: string, success: boolean, message: string}[]> {
    const results = [];

    for (const [platform, credentials] of credentialsMap.entries()) {
      let result;
      
      switch (platform) {
        case 'twitter':
          result = await this.postToTwitter(credentials, postContent);
          break;
        case 'linkedin':
          result = await this.postToLinkedIn(credentials, postContent);
          break;
        case 'facebook':
          result = await this.postToFacebook(credentials, postContent);
          break;
        default:
          result = { success: false, message: `Unsupported platform: ${platform}` };
      }

      results.push({
        platform,
        ...result
      });

      // Wait between posts to avoid being flagged
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return results;
  }

  private async generateSocialContent(contentType: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a social media expert creating content for Flutterbye, a revolutionary Web3 platform that tokenizes messages and enables value attachment. Focus on innovation, AI integration, and blockchain benefits."
        },
        {
          role: "user",
          content: `Create an engaging social media post about Flutterbye's ${contentType}. Keep it under 250 characters, use emojis, and make it shareable.`
        }
      ],
      max_tokens: 150
    });

    return response.choices[0].message.content?.trim() || '';
  }

  private async generateHashtags(contentType: string): Promise<string[]> {
    // Core Flutterbye hashtags that should always be included
    const coreHashtags = ['#Flutterbye', '#Web3', '#Blockchain'];
    
    // Content-specific hashtag pools
    const contentHashtags: Record<string, string[]> = {
      'features': ['#TokenMessaging', '#AI', '#Innovation', '#DeFi', '#SmartContracts'],
      'stats': ['#Growth', '#Analytics', '#UserAdoption', '#Metrics', '#Success'],
      'tutorial': ['#Tutorial', '#HowTo', '#Learn', '#Guide', '#Education'],
      'token-creation': ['#TokenMinting', '#CreateTokens', '#NFT', '#DigitalAssets', '#Crypto']
    };

    // Trending/Popular hashtags that boost visibility
    const trendingHashtags = [
      '#CryptoTwitter', '#BuildInPublic', '#Web3Community', '#BlockchainInnovation',
      '#AIRevolution', '#FutureOfMessaging', '#DecentralizedSocial', '#TokenizedWorld',
      '#DigitalTransformation', '#CryptoLife', '#Web3Tech', '#InnovationHub'
    ];

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `Generate 3-4 strategic hashtags for Flutterbye's ${contentType} content. Focus on viral, trending tags that maximize reach and engagement. Consider current crypto/Web3 trends. Return as a JSON array with "hashtags" field.`
          },
          {
            role: "user",
            content: `Create hashtags that will trend and get maximum visibility for a revolutionary Web3 messaging platform. Focus on ${contentType} content.`
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{"hashtags":[]}');
      const aiHashtags = result.hashtags || [];
      
      // Combine hashtags strategically
      const specificTags = contentHashtags[contentType] || [];
      const randomTrending = trendingHashtags.sort(() => 0.5 - Math.random()).slice(0, 2);
      
      // Build final hashtag list (8-12 total for maximum reach)
      const finalHashtags = [
        ...coreHashtags,
        ...specificTags.slice(0, 3),
        ...aiHashtags.slice(0, 3),
        ...randomTrending
      ];
      
      // Remove duplicates and ensure they start with #
      const uniqueHashtags = [...new Set(finalHashtags)]
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
        .slice(0, 12); // Limit to 12 hashtags
      
      console.log(`🏷️ Generated ${uniqueHashtags.length} optimal hashtags for ${contentType}:`, uniqueHashtags);
      return uniqueHashtags;
      
    } catch (error) {
      console.error('Failed to generate AI hashtags, using fallback:', error);
      
      // Enhanced fallback with content-specific tags
      const specificTags = contentHashtags[contentType] || [];
      const fallbackTags = [
        ...coreHashtags,
        ...specificTags.slice(0, 4),
        '#CryptoTwitter',
        '#Innovation',
        '#BuildInPublic'
      ];
      
      return fallbackTags.slice(0, 10);
    }
  }

  private async captureFlutterbyeScreenshot(contentType: string): Promise<string> {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      
      // Map content types to pages
      const pageMap: Record<string, string> = {
        'features': '/dashboard',
        'stats': '/intelligence',
        'tutorial': '/info',
        'token-creation': '/create'
      };

      const targetPage = pageMap[contentType] || '/dashboard';
      
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

  // Schedule automated posting
  async schedulePost(
    credentialsMap: Map<string, SocialCredentials>,
    contentType: string,
    intervalHours: number = 4
  ): Promise<{success: boolean, message: string}> {
    try {
      setInterval(async () => {
        console.log('🤖 Generating and posting scheduled content...');
        
        const postContent = await this.generateContentWithScreenshot(contentType);
        const results = await this.postToMultiplePlatforms(credentialsMap, postContent);
        
        results.forEach(result => {
          console.log(`${result.platform}: ${result.success ? '✅' : '❌'} ${result.message}`);
        });
      }, intervalHours * 60 * 60 * 1000);

      return { 
        success: true, 
        message: `Scheduled posting every ${intervalHours} hours` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to schedule posts: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

export const passwordAutomation = new SocialPasswordAutomation();