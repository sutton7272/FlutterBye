import { TwitterAPIService } from './twitter-api-service';
import { aiContentGenerator, type GeneratedContent } from './ai-content-generator';
import { socialBotStorage } from './social-bot-storage';
import * as cron from 'node-cron';

interface ScheduledPost {
  id: string;
  content: string;
  hashtags: string[];
  scheduledTime: string;
  status: 'pending' | 'posted' | 'failed';
  posted?: boolean;
  imageUrl?: string;
  imageDescription?: string;
}

export class TwitterContentScheduler {
  private twitterService!: TwitterAPIService;
  private isInitialized = false;
  private isActive = false;
  private activeBotConfigId?: string;
  private postingSchedule: any = {
    earlyMorning: { enabled: true, time: '6:00 AM' },
    breakfast: { enabled: true, time: '8:30 AM' },
    lateMorning: { enabled: true, time: '10:00 AM' },
    lunch: { enabled: true, time: '12:00 PM' },
    earlyAfternoon: { enabled: true, time: '2:00 PM' },
    lateAfternoon: { enabled: true, time: '4:30 PM' },
    dinner: { enabled: true, time: '6:30 PM' },
    earlyEvening: { enabled: true, time: '8:00 PM' },
    evening: { enabled: true, time: '9:30 PM' },
    lateNight: { enabled: true, time: '11:00 PM' }
  };

  constructor() {
    try {
      this.twitterService = new TwitterAPIService();
      this.isInitialized = true;
      this.isActive = true; // Auto-enable the bot
      this.startScheduler();
      console.log('📅 Twitter Content Scheduler initialized');
    } catch (error) {
      console.error('❌ Twitter Content Scheduler failed to initialize:', error);
    }
  }

  activateBot(botConfigId?: string) {
    this.isActive = true;
    this.activeBotConfigId = botConfigId;
    console.log(`🤖 Twitter bot activated with config: ${botConfigId || 'default'}`);
  }

  deactivateBot() {
    this.isActive = false;
    this.activeBotConfigId = undefined;
    console.log('🔴 Twitter bot deactivated');
  }

  private startScheduler() {
    if (!this.isInitialized) return;

    // Check for scheduled posts every minute
    cron.schedule('* * * * *', async () => {
      try {
        await this.checkAndPostScheduledContent();
      } catch (error) {
        console.log('📍 Scheduler error handled safely');
      }
    });

    console.log('🔄 Twitter scheduler active - checking every minute');
    
    // Only run initial check, no auto-posting on startup
    setTimeout(async () => {
      try {
        console.log('🔍 Initial scheduler check...');
        await this.checkScheduleAndPost();
      } catch (error) {
        console.log('📍 Initial check error handled safely');
      }
    }, 5000);
  }

  private async checkScheduleAndPost() {
    if (!this.isActive) return;
    
    // Get current time in EDT (UTC-4)
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    const edtHour = (utcHour - 4 + 24) % 24;
    const currentTime = `${edtHour.toString().padStart(2, '0')}:${utcMinute.toString().padStart(2, '0')}`;
    
    console.log(`⏰ Checking current time ${currentTime} against schedule...`);
    
    // Check if current time matches any enabled schedule slot
    const enabledSlots = Object.entries(this.postingSchedule)
      .filter(([key, config]: [string, any]) => config.enabled);
    
    for (const [slotName, config] of enabledSlots) {
      const slotTime = config.time;
      if (this.timeMatches(currentTime, slotTime)) {
        console.log(`🎯 Time match! Posting for slot: ${slotName} at ${slotTime}`);
        
        // Add cooldown check to prevent duplicate posts within same minute
        const lastPostKey = `lastPost_${slotName}`;
        const lastPostTime = this.getLastPostTime(lastPostKey);
        const currentMinute = Math.floor(Date.now() / 60000);
        
        if (lastPostTime === currentMinute) {
          console.log(`⏸️ Already posted for ${slotName} this minute, skipping...`);
          return;
        }
        
        try {
          await this.createAndPostContent();
          this.setLastPostTime(lastPostKey, currentMinute);
        } catch (error) {
          console.log('📍 Scheduled post error handled safely');
        }
        return; // Exit after posting to prevent multiple posts
      }
    }
  }

  private lastPostTimes: Map<string, number> = new Map();

  private getLastPostTime(key: string): number {
    return this.lastPostTimes.get(key) || 0;
  }

  private setLastPostTime(key: string, time: number): void {
    this.lastPostTimes.set(key, time);
  }

  private timeMatches(currentTime: string, scheduleTime: string): boolean {
    // Convert 12-hour format to 24-hour format
    const convert24Hour = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const converted = convert24Hour(scheduleTime);
    return currentTime === converted;
  }

  private async createAndPostContent() {
    try {
      console.log('🤖 AUTO-POSTING: Creating and posting new content...');
      
      // Generate content with proper structure
      const generatedContent = await aiContentGenerator.generateContent({
        category: 'technology',
        includeHashtags: true,
        customPrompt: 'FlutterBye social media automation with AI-powered optimization and smart engagement'
      });
      
      // Handle the content structure properly
      let content: {
        content: string;
        hashtags: string[];
        imageUrl?: string;
        imageDescription?: string;
      };
      
      if (generatedContent && generatedContent.content) {
        content = {
          content: generatedContent.content,
          hashtags: generatedContent.hashtags || [],
          imageUrl: (generatedContent as any).imageUrl,
          imageDescription: (generatedContent as any).imageDescription
        };
      } else if (generatedContent && (generatedContent as any).text) {
        content = { 
          content: (generatedContent as any).text, 
          hashtags: generatedContent.hashtags || [],
          imageUrl: (generatedContent as any).imageUrl,
          imageDescription: (generatedContent as any).imageDescription
        };
      } else {
        // Fallback content if AI generation fails
        content = {
          content: "🚀 FlutterBye: The future of Web3 communication is here! Revolutionary blockchain-powered messaging with SPL tokens, AI optimization, and real-time engagement. Transform your social media strategy today! #FlutterBye #Web3 #Blockchain #AI #SocialAutomation #Innovation #Crypto #Future #Technology #Engagement",
          hashtags: [],
          imageUrl: '/public/butterfly-logo.png'
        };
      }

      console.log(`📝 Generated content object:`, content);
      
      // Check if content is valid
      if (!content || !content.content) {
        console.error('❌ Generated content is invalid:', content);
        return { success: false, error: 'Invalid content generated' };
      }
      
      console.log(`📝 Generated content text: ${content.content}`);
      
      // Post with image if available
      let postResult;
      if (content.imageUrl) {
        console.log(`📷 Posting with image: ${content.imageUrl}`);
        postResult = await this.twitterService.postTweetWithImage(content.content, content.imageUrl);
      } else {
        postResult = await this.twitterService.postTweet(content.content);
      }
      
      if (postResult.success) {
        console.log(`✅ AUTO-POST SUCCESS: Posted tweet with ID ${postResult.tweetId}`);
        console.log(`📊 Content: ${content.content.substring(0, 100)}...`);
      } else {
        console.error(`❌ AUTO-POST FAILED: ${postResult.error}`);
        
        // Handle specific Twitter API errors
        if (postResult.error && postResult.error.includes('duplicate content')) {
          console.log('🔄 Attempting to generate new unique content...');
          
          // Try generating new unique content one more time
          const uniqueContent = await aiContentGenerator.generateContent({
            category: 'technology',
            includeHashtags: true,
            customPrompt: `FlutterBye unique post ${Date.now()} - blockchain innovation and Web3 advancement`,
            forceUnique: true
          });
          
          if (uniqueContent && uniqueContent.content) {
            let retryResult;
            if ((uniqueContent as any).imageUrl) {
              retryResult = await this.twitterService.postTweetWithImage(uniqueContent.content, (uniqueContent as any).imageUrl);
            } else {
              retryResult = await this.twitterService.postTweet(uniqueContent.content);
            }
            if (retryResult.success) {
              console.log(`✅ RETRY SUCCESS: Posted unique tweet with ID ${retryResult.tweetId}`);
              return retryResult;
            }
          }
        }
      }
      
      return postResult;
    } catch (error) {
      console.error('❌ Error in auto-posting system:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async checkAndPostScheduledContent() {
    try {
      const pendingPosts = await socialBotStorage.getPendingScheduledPosts();
      console.log(`🔄 Scheduler check - Bot active: ${this.isActive}, Pending posts: ${pendingPosts.length}`);
      
      if (!this.isActive) return; // Only check if bot is active
      
      // Check for scheduled time slots (this handles auto-generated content)
      await this.checkScheduleAndPost();
      
      // Handle manually scheduled posts separately
      const now = new Date();
      const readyPosts = pendingPosts.filter(post => 
        new Date(post.scheduledTime) <= now
      );
      
      if (readyPosts.length > 0) {
        console.log(`📤 Found ${readyPosts.length} manual posts ready to publish`);
        
        for (const post of readyPosts) {
          try {
            console.log(`📤 Posting manual: "${post.content.substring(0, 50)}..."`);
            const tweetResult = await this.twitterService.postTweet(post.content);
            
            if (tweetResult.success) {
              await socialBotStorage.updateScheduledPostStatus(
                post.id, 
                'posted', 
                tweetResult.tweetId
              );
              console.log(`✅ Posted manually scheduled successfully - Tweet ID: ${tweetResult.tweetId}`);
            } else {
              await socialBotStorage.updateScheduledPostStatus(
                post.id, 
                'failed', 
                undefined, 
                tweetResult.error
              );
              console.error(`❌ Failed to post manual: ${tweetResult.error}`);
            }
          } catch (error) {
            await socialBotStorage.updateScheduledPostStatus(
              post.id, 
              'failed', 
              undefined, 
              error instanceof Error ? error.message : 'Unknown error'
            );
            console.error(`❌ Error posting scheduled content:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error in scheduler check:`, error);
    }
  }

  async schedulePost(content: string, hashtags: string[], scheduledTime: string, botConfigId?: string): Promise<string> {
    try {
      const post = await socialBotStorage.createScheduledPost({
        botConfigId: botConfigId || this.activeBotConfigId,
        platform: 'twitter',
        content,
        hashtags,
        scheduledTime: new Date(scheduledTime),
        status: 'pending',
        isAIGenerated: false
      });
      
      console.log(`📅 Scheduled post ${post.id} for ${scheduledTime}`);
      return post.id;
    } catch (error) {
      console.error('❌ Failed to schedule post:', error);
      throw error;
    }
  }

  async getScheduledPosts(): Promise<any[]> {
    try {
      const posts = await socialBotStorage.getAllScheduledPosts(50);
      return posts.map(post => ({
        id: post.id,
        content: post.content,
        hashtags: post.hashtags,
        scheduledTime: post.scheduledTime.toISOString(),
        status: post.status,
        posted: post.status === 'posted'
      }));
    } catch (error) {
      console.error('❌ Failed to get scheduled posts:', error);
      return [];
    }
  }

  async cancelScheduledPost(postId: string): Promise<boolean> {
    try {
      const post = await socialBotStorage.getScheduledPost(postId);
      if (post && post.status === 'pending') {
        await socialBotStorage.updateScheduledPostStatus(postId, 'cancelled');
        console.log(`🗑️ Cancelled scheduled post ${postId}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to cancel post:', error);
      return false;
    }
  }

  // Predefined content templates for FlutterBye
  getContentTemplates() {
    return [
      {
        category: 'Innovation',
        templates: [
          {
            text: "The future of communication doesn't need permission. It needs FlutterBye.",
            hashtags: ['#FlutterBye', '#Web3', '#Communication', '#Innovation']
          },
          {
            text: "What if every message carried real value? Welcome to the tokenized communication revolution.",
            hashtags: ['#FlutterBye', '#TokenizedMessages', '#Web3', '#Blockchain']
          }
        ]
      },
      {
        category: 'Technology',
        templates: [
          {
            text: "SPL tokens meet social messaging. The result? Messages that matter, literally.",
            hashtags: ['#FlutterBye', '#Solana', '#SPLTokens', '#SocialMedia']
          },
          {
            text: "No gatekeepers. No noise. Just signal. This is how communication should work.",
            hashtags: ['#FlutterBye', '#DecentralizedComm', '#Web3', '#Signal']
          }
        ]
      },
      {
        category: 'Community',
        templates: [
          {
            text: "Join the communication revolution. Every message is an opportunity.",
            hashtags: ['#FlutterBye', '#Community', '#Web3Revolution', '#JoinUs']
          },
          {
            text: "Building the future of value-driven communication, one token at a time.",
            hashtags: ['#FlutterBye', '#Building', '#Future', '#ValueDriven']
          }
        ]
      }
    ];
  }

  // Quick scheduling methods
  async scheduleDaily(content: string, hashtags: string[], hour: number, minute: number = 0): Promise<string> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hour, minute, 0, 0);
    
    return await this.schedulePost(content, hashtags, tomorrow.toISOString());
  }

  async scheduleWeekly(content: string, hashtags: string[], dayOfWeek: number, hour: number): Promise<string> {
    const nextWeek = new Date();
    const daysUntilTarget = (dayOfWeek + 7 - nextWeek.getDay()) % 7 || 7;
    nextWeek.setDate(nextWeek.getDate() + daysUntilTarget);
    nextWeek.setHours(hour, 0, 0, 0);
    
    return await this.schedulePost(content, hashtags, nextWeek.toISOString());
  }

  // Bot control methods
  startBot() {
    this.isActive = true;
    console.log('🤖 Twitter bot activated');
    return { success: true, message: 'Bot started successfully' };
  }

  stopBot() {
    this.isActive = false;
    console.log('🛑 Twitter bot deactivated');
    return { success: true, message: 'Bot stopped successfully' };
  }

  getBotStatus() {
    return {
      isActive: this.isActive,
      isInitialized: this.isInitialized,
      postingSchedule: this.postingSchedule,
      scheduledPostsCount: 0
    };
  }

  updateBotConfig(config: any) {
    this.isActive = config.isActive;
    this.postingSchedule = config.postingSchedule;
    console.log('⚙️ Bot configuration updated:', config);
    return { success: true, message: 'Configuration updated successfully' };
  }

  // AI-powered content generation and scheduling
  async generateAndScheduleContent(timeSlot: string, customContext?: string): Promise<string> {
    try {
      const generatedContent = await aiContentGenerator.generateContent({
        category: 'technology',
        includeHashtags: true,
        customPrompt: customContext || `FlutterBye content for ${timeSlot}`
      });
      
      // Schedule for next occurrence of this time slot  
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(12, 0, 0, 0); // Default to noon
      
      const postId = await this.schedulePost(
        generatedContent.content,
        generatedContent.hashtags,
        tomorrow.toISOString()
      );
      
      console.log(`🤖 AI-generated content scheduled for ${timeSlot}: ${postId}`);
      return postId;
      
    } catch (error) {
      console.error('Failed to generate and schedule AI content:', error);
      throw error;
    }
  }

  async bulkGenerateAndSchedule(count: number = 5): Promise<string[]> {
    try {
      const activeSlots = Object.entries(this.postingSchedule)
        .filter(([_, config]) => config.enabled)
        .map(([slot, _]) => slot);
      
      if (activeSlots.length === 0) {
        throw new Error('No active time slots configured');
      }
      
      const bulkContent = await aiContentGenerator.generateBulkContent(activeSlots, count);
      const postIds: string[] = [];
      
      for (const { timeSlot, content } of bulkContent) {
        const scheduledTime = this.calculateNextTimeSlot(timeSlot);
        
        const postId = this.schedulePost(
          content.text,
          content.hashtags,
          scheduledTime.toISOString()
        );
        
        postIds.push(postId);
      }
      
      console.log(`🤖 Bulk AI content generated: ${postIds.length} posts scheduled`);
      return postIds;
      
    } catch (error) {
      console.error('Failed to bulk generate AI content:', error);
      throw error;
    }
  }

  private calculateNextTimeSlot(timeSlotKey: string): Date {
    const slotConfig = this.postingSchedule[timeSlotKey];
    if (!slotConfig) {
      throw new Error(`Invalid time slot: ${timeSlotKey}`);
    }
    
    const [hour, minute] = slotConfig.time.split(':').map(Number);
    const nextSlot = new Date();
    
    nextSlot.setHours(hour, minute, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (nextSlot <= new Date()) {
      nextSlot.setDate(nextSlot.getDate() + 1);
    }
    
    return nextSlot;
  }
}

// Global scheduler instance
export const twitterScheduler = new TwitterContentScheduler();