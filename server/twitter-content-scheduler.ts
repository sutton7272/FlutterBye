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
}

export class TwitterContentScheduler {
  private twitterService: TwitterAPIService;
  private isInitialized = false;
  private isActive = false;
  private activeBotConfigId?: string;
  private postingSchedule: any = {
    earlyMorning: { enabled: true, time: '06:00' },
    breakfast: { enabled: true, time: '08:30' },
    lateMorning: { enabled: false, time: '10:00' },
    lunch: { enabled: true, time: '12:00' },
    earlyAfternoon: { enabled: false, time: '14:00' },
    lateAfternoon: { enabled: true, time: '16:00' },
    dinner: { enabled: true, time: '18:30' },
    earlyEvening: { enabled: false, time: '20:00' },
    evening: { enabled: true, time: '21:30' },
    lateNight: { enabled: false, time: '23:00' }
  };

  constructor() {
    try {
      this.twitterService = new TwitterAPIService();
      this.isInitialized = true;
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
    cron.schedule('* * * * *', () => {
      this.checkAndPostScheduledContent();
    });

    console.log('🔄 Twitter scheduler active - checking every minute');
  }

  private async checkAndPostScheduledContent() {
    try {
      const pendingPosts = await socialBotStorage.getPendingScheduledPosts();
      console.log(`🔄 Scheduler check - Bot active: ${this.isActive}, Pending posts: ${pendingPosts.length}`);
      
      if (!this.isActive) return; // Only check if bot is active
      
      const now = new Date();
      const readyPosts = pendingPosts.filter(post => 
        new Date(post.scheduledTime) <= now
      );
      
      if (readyPosts.length > 0) {
        console.log(`📤 Found ${readyPosts.length} posts ready to publish`);
        
        for (const post of readyPosts) {
          try {
            console.log(`📤 Posting: "${post.content.substring(0, 50)}..."`);
            const tweetResult = await this.twitterService.postTweet(post.content);
            
            if (tweetResult.success) {
              await socialBotStorage.updateScheduledPostStatus(
                post.id, 
                'posted', 
                tweetResult.tweetId
              );
              console.log(`✅ Posted successfully - Tweet ID: ${tweetResult.tweetId}`);
            } else {
              await socialBotStorage.updateScheduledPostStatus(
                post.id, 
                'failed', 
                undefined, 
                tweetResult.error
              );
              console.error(`❌ Failed to post: ${tweetResult.error}`);
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
  scheduleDaily(content: string, hashtags: string[], hour: number, minute: number = 0): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hour, minute, 0, 0);
    
    return this.schedulePost(content, hashtags, tomorrow.toISOString());
  }

  scheduleWeekly(content: string, hashtags: string[], dayOfWeek: number, hour: number): string {
    const nextWeek = new Date();
    const daysUntilTarget = (dayOfWeek + 7 - nextWeek.getDay()) % 7 || 7;
    nextWeek.setDate(nextWeek.getDate() + daysUntilTarget);
    nextWeek.setHours(hour, 0, 0, 0);
    
    return this.schedulePost(content, hashtags, nextWeek.toISOString());
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
      scheduledPostsCount: this.scheduledPosts.length
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
      const template = aiContentGenerator.getTemplates().find(t => 
        t.timeSlots.includes(timeSlot)
      ) || aiContentGenerator.getTemplates()[0];
      
      const generatedContent = await aiContentGenerator.generateContent(
        template, 
        timeSlot, 
        customContext
      );
      
      // Schedule for next occurrence of this time slot
      const scheduledTime = this.calculateNextTimeSlot(timeSlot);
      
      const postId = this.schedulePost(
        generatedContent.text,
        generatedContent.hashtags,
        scheduledTime.toISOString()
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