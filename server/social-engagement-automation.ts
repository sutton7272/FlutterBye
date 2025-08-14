import OpenAI from "openai";
import puppeteer from "puppeteer";
import { SocialCredentials, PostContent } from "./social-password-automation";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface EngagementCredentials extends SocialCredentials {
  role: 'poster' | 'engager';
  engagementStyle: 'supportive' | 'curious' | 'technical' | 'casual';
  delay?: number; // Minutes to wait before engaging
}

export interface EngagementAction {
  type: 'like' | 'comment' | 'retweet' | 'reply';
  content?: string;
  targetUrl?: string;
}

export class SocialEngagementAutomation {
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  // Enhanced posting with engagement automation
  async postWithEngagement(
    posterCredentials: EngagementCredentials,
    engagerCredentials: EngagementCredentials[],
    postContent: PostContent
  ): Promise<{success: boolean, postUrl?: string, engagementResults: any[]}> {
    
    // First, post the main content
    const postResult = await this.postToTwitterWithTracking(posterCredentials, postContent);
    
    if (!postResult.success || !postResult.postUrl) {
      return {
        success: false,
        engagementResults: []
      };
    }

    // Wait a bit, then engage with other accounts
    const engagementResults = [];
    
    for (const engager of engagerCredentials) {
      // Random delay to seem more natural
      const delayMinutes = engager.delay || (Math.random() * 5 + 2); // 2-7 minutes
      console.log(`⏰ Waiting ${delayMinutes.toFixed(1)} minutes before ${engager.username} engages...`);
      
      await new Promise(resolve => setTimeout(resolve, delayMinutes * 60 * 1000));
      
      const engagementResult = await this.engageWithPost(
        engager, 
        postResult.postUrl, 
        postContent,
        posterCredentials.username
      );
      
      engagementResults.push({
        account: engager.username,
        ...engagementResult
      });
    }

    return {
      success: true,
      postUrl: postResult.postUrl,
      engagementResults
    };
  }

  // Post to Twitter and capture the post URL
  private async postToTwitterWithTracking(
    credentials: EngagementCredentials, 
    postContent: PostContent
  ): Promise<{success: boolean, message: string, postUrl?: string}> {
    const browser = await puppeteer.launch({ 
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      
      // Login to Twitter
      await page.goto('https://twitter.com/login', { waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000);

      // Enter username
      const usernameSelector = 'input[name="text"]';
      await page.waitForSelector(usernameSelector);
      await page.type(usernameSelector, credentials.username);
      await page.click('[role="button"]:has-text("Next")');
      await page.waitForTimeout(2000);

      // Enter password
      const passwordSelector = 'input[name="password"]';
      await page.waitForSelector(passwordSelector);
      await page.type(passwordSelector, credentials.password);
      await page.click('[role="button"]:has-text("Log in")');
      await page.waitForTimeout(5000);

      // Compose tweet
      await page.click('[data-testid="SideNav_NewTweet_Button"]');
      await page.waitForTimeout(2000);

      const tweetTextSelector = '[data-testid="tweetTextarea_0"]';
      await page.waitForSelector(tweetTextSelector);
      const fullText = `${postContent.text} ${postContent.hashtags.join(' ')}`;
      await page.type(tweetTextSelector, fullText);

      // Upload image if provided
      if (postContent.imagePath) {
        const imageInput = await page.$('input[data-testid="fileInput"]');
        if (imageInput) {
          await imageInput.uploadFile(postContent.imagePath);
          await page.waitForTimeout(3000);
        }
      }

      // Tweet and capture URL
      await page.click('[data-testid="tweetButtonInline"]');
      await page.waitForTimeout(5000);

      // Get the tweet URL from the current page
      const currentUrl = page.url();
      const tweetUrlMatch = currentUrl.match(/twitter\.com\/\w+\/status\/(\d+)/);
      
      if (tweetUrlMatch) {
        return { 
          success: true, 
          message: 'Tweet posted and URL captured!', 
          postUrl: currentUrl 
        };
      } else {
        return { 
          success: true, 
          message: 'Tweet posted but URL not captured', 
          postUrl: undefined 
        };
      }
      
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to post tweet: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    } finally {
      await browser.close();
    }
  }

  // Engage with a specific post using engager account
  private async engageWithPost(
    engagerCredentials: EngagementCredentials,
    postUrl: string,
    originalContent: PostContent,
    originalPoster: string
  ): Promise<{success: boolean, actions: EngagementAction[]}> {
    const browser = await puppeteer.launch({ 
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      
      // Login to Twitter with engager account
      await page.goto('https://twitter.com/login', { waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000);

      // Login process
      const usernameSelector = 'input[name="text"]';
      await page.waitForSelector(usernameSelector);
      await page.type(usernameSelector, engagerCredentials.username);
      await page.click('[role="button"]:has-text("Next")');
      await page.waitForTimeout(2000);

      const passwordSelector = 'input[name="password"]';
      await page.waitForSelector(passwordSelector);
      await page.type(passwordSelector, engagerCredentials.password);
      await page.click('[role="button"]:has-text("Log in")');
      await page.waitForTimeout(5000);

      // Navigate to the post
      await page.goto(postUrl, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(3000);

      const actions: EngagementAction[] = [];

      // Like the post
      try {
        const likeButton = await page.$('[data-testid="like"]');
        if (likeButton) {
          await likeButton.click();
          await page.waitForTimeout(1000);
          actions.push({ type: 'like' });
          console.log(`❤️ ${engagerCredentials.username} liked the post`);
        }
      } catch (error) {
        console.log(`Failed to like: ${error}`);
      }

      // Retweet the post
      try {
        const retweetButton = await page.$('[data-testid="retweet"]');
        if (retweetButton) {
          await retweetButton.click();
          await page.waitForTimeout(1000);
          
          // Click "Retweet" in the dropdown
          const confirmRetweet = await page.$('[data-testid="retweetConfirm"]');
          if (confirmRetweet) {
            await confirmRetweet.click();
            await page.waitForTimeout(2000);
            actions.push({ type: 'retweet' });
            console.log(`🔄 ${engagerCredentials.username} retweeted the post`);
          }
        }
      } catch (error) {
        console.log(`Failed to retweet: ${error}`);
      }

      // Generate and post a comment
      try {
        const replyButton = await page.$('[data-testid="reply"]');
        if (replyButton) {
          await replyButton.click();
          await page.waitForTimeout(2000);

          // Generate contextual comment
          const comment = await this.generateContextualComment(
            engagerCredentials.engagementStyle,
            originalContent,
            originalPoster
          );

          const replyTextarea = await page.$('[data-testid="tweetTextarea_0"]');
          if (replyTextarea && comment) {
            await replyTextarea.type(comment);
            await page.waitForTimeout(1000);

            const replyTweetButton = await page.$('[data-testid="tweetButtonInline"]');
            if (replyTweetButton) {
              await replyTweetButton.click();
              await page.waitForTimeout(3000);
              actions.push({ type: 'comment', content: comment });
              console.log(`💬 ${engagerCredentials.username} commented: "${comment}"`);
            }
          }
        }
      } catch (error) {
        console.log(`Failed to comment: ${error}`);
      }

      return { success: true, actions };
      
    } catch (error) {
      return { 
        success: false, 
        actions: []
      };
    } finally {
      await browser.close();
    }
  }

  // Generate contextual comments based on engagement style
  private async generateContextualComment(
    style: string,
    originalContent: PostContent,
    originalPoster: string
  ): Promise<string> {
    const stylePrompts = {
      supportive: "Write a brief supportive comment (1-2 sentences) that encourages the post and shows enthusiasm about Flutterbye's innovation.",
      curious: "Write a brief curious question (1-2 sentences) asking about a specific feature or how something works in Flutterbye.",
      technical: "Write a brief technical comment (1-2 sentences) that shows understanding of the blockchain/Web3 aspects mentioned.",
      casual: "Write a brief casual, friendly response (1-2 sentences) that sounds like a regular user who's interested in trying Flutterbye."
    };

    const prompt = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.supportive;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are commenting on a social media post about Flutterbye. Original post: "${originalContent.text}". ${prompt} Keep it under 100 characters and natural. Don't use hashtags in comments.`
          },
          {
            role: "user",
            content: "Generate a natural comment response."
          }
        ],
        max_tokens: 50
      });

      return response.choices[0].message.content?.trim() || '';
    } catch (error) {
      // Fallback comments by style
      const fallbacks = {
        supportive: "This looks amazing! 🚀",
        curious: "How does the token creation work exactly?",
        technical: "The blockchain integration seems solid 👍",
        casual: "Definitely want to try this out!"
      };

      return fallbacks[style as keyof typeof fallbacks] || "Great post! 👏";
    }
  }

  // Respond to other people's replies on your posts
  async respondToReplies(
    posterCredentials: EngagementCredentials,
    postUrl: string,
    engagementStyle: string = 'professional'
  ): Promise<{success: boolean, responses: any[]}> {
    const browser = await puppeteer.launch({ 
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      
      // Login as poster
      await page.goto('https://twitter.com/login', { waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000);

      const usernameSelector = 'input[name="text"]';
      await page.waitForSelector(usernameSelector);
      await page.type(usernameSelector, posterCredentials.username);
      await page.click('[role="button"]:has-text("Next")');
      await page.waitForTimeout(2000);

      const passwordSelector = 'input[name="password"]';
      await page.waitForSelector(passwordSelector);
      await page.type(passwordSelector, posterCredentials.password);
      await page.click('[role="button"]:has-text("Log in")');
      await page.waitForTimeout(5000);

      // Go to the post and check for replies
      await page.goto(postUrl, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(3000);

      // Find reply elements
      const replies = await page.$$('[data-testid="tweet"]');
      const responses = [];

      for (let i = 1; i < Math.min(replies.length, 4); i++) { // Skip first (original post), limit to 3 replies
        try {
          const reply = replies[i];
          
          // Get reply text
          const replyText = await reply.$eval('[data-testid="tweetText"]', el => el.textContent).catch(() => '');
          
          if (replyText && replyText.length > 10) {
            // Generate response
            const response = await this.generateReplyResponse(replyText, engagementStyle);
            
            // Click reply button on this specific reply
            const replyButton = await reply.$('[data-testid="reply"]');
            if (replyButton && response) {
              await replyButton.click();
              await page.waitForTimeout(2000);

              const replyTextarea = await page.$('[data-testid="tweetTextarea_0"]');
              if (replyTextarea) {
                await replyTextarea.type(response);
                await page.waitForTimeout(1000);

                const replyTweetButton = await page.$('[data-testid="tweetButtonInline"]');
                if (replyTweetButton) {
                  await replyTweetButton.click();
                  await page.waitForTimeout(3000);
                  
                  responses.push({
                    originalReply: replyText.substring(0, 100),
                    response: response
                  });
                  
                  console.log(`✅ Responded to: "${replyText.substring(0, 50)}..." with: "${response}"`);
                }
              }
            }
          }
        } catch (error) {
          console.log(`Failed to respond to reply: ${error}`);
        }
      }

      return { success: true, responses };
      
    } catch (error) {
      return { success: false, responses: [] };
    } finally {
      await browser.close();
    }
  }

  private async generateReplyResponse(originalReply: string, style: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are the Flutterbye team responding to user replies. Original reply: "${originalReply}". Write a brief, helpful response (under 200 characters) that's ${style} in tone. Answer questions about Flutterbye, thank users for interest, or provide helpful info.`
          },
          {
            role: "user",
            content: "Generate a response to this user's reply."
          }
        ],
        max_tokens: 80
      });

      return response.choices[0].message.content?.trim() || '';
    } catch (error) {
      return "Thanks for your interest in Flutterbye! Feel free to reach out if you have any questions. 🚀";
    }
  }

  // Full automation: Post + Engagement + Reply to responses
  async fullEngagementCycle(
    posterCredentials: EngagementCredentials,
    engagerCredentials: EngagementCredentials[],
    postContent: PostContent
  ): Promise<{success: boolean, summary: string}> {
    console.log('🚀 Starting full engagement automation cycle...');
    
    // Step 1: Post with engagement
    const postResult = await this.postWithEngagement(posterCredentials, engagerCredentials, postContent);
    
    if (!postResult.success || !postResult.postUrl) {
      return { success: false, summary: 'Failed to post content' };
    }

    // Step 2: Wait for potential real user replies (15-30 minutes)
    const waitTime = 20 + Math.random() * 10; // 20-30 minutes
    console.log(`⏰ Waiting ${waitTime.toFixed(1)} minutes for user replies...`);
    await new Promise(resolve => setTimeout(resolve, waitTime * 60 * 1000));

    // Step 3: Respond to any replies
    const replyResult = await this.respondToReplies(posterCredentials, postResult.postUrl);

    const summary = `Posted content, ${postResult.engagementResults.length} accounts engaged, responded to ${replyResult.responses.length} user replies`;
    
    return { success: true, summary };
  }
}

export const engagementAutomation = new SocialEngagementAutomation();