import { TwitterAPIService } from './twitter-api-service';
import cron from 'node-cron';

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
  private scheduledPosts: ScheduledPost[] = [];
  private isInitialized = false;

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

  private startScheduler() {
    if (!this.isInitialized) return;

    // Check for scheduled posts every minute
    cron.schedule('* * * * *', () => {
      this.checkAndPostScheduledContent();
    });

    console.log('🔄 Twitter scheduler active - checking every minute');
  }

  private async checkAndPostScheduledContent() {
    const now = new Date();
    const pendingPosts = this.scheduledPosts.filter(post => 
      post.status === 'pending' && new Date(post.scheduledTime) <= now
    );

    for (const post of pendingPosts) {
      try {
        console.log(`📤 Posting scheduled content: ${post.id}`);
        
        const result = await this.twitterService.postTweet({
          text: post.content,
          hashtags: post.hashtags
        });

        if (result.success) {
          post.status = 'posted';
          post.posted = true;
          console.log(`✅ Scheduled post ${post.id} posted successfully`);
        } else {
          post.status = 'failed';
          console.error(`❌ Failed to post scheduled content ${post.id}:`, result.message);
        }
      } catch (error) {
        post.status = 'failed';
        console.error(`❌ Error posting scheduled content ${post.id}:`, error);
      }
    }
  }

  schedulePost(content: string, hashtags: string[], scheduledTime: string): string {
    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const scheduledPost: ScheduledPost = {
      id: postId,
      content,
      hashtags,
      scheduledTime,
      status: 'pending'
    };

    this.scheduledPosts.push(scheduledPost);
    console.log(`📅 Scheduled post ${postId} for ${scheduledTime}`);
    
    return postId;
  }

  getScheduledPosts(): ScheduledPost[] {
    return this.scheduledPosts.map(post => ({ ...post }));
  }

  cancelScheduledPost(postId: string): boolean {
    const postIndex = this.scheduledPosts.findIndex(post => post.id === postId);
    
    if (postIndex !== -1 && this.scheduledPosts[postIndex].status === 'pending') {
      this.scheduledPosts.splice(postIndex, 1);
      console.log(`🗑️ Cancelled scheduled post ${postId}`);
      return true;
    }
    
    return false;
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
}

// Global scheduler instance
export const twitterScheduler = new TwitterContentScheduler();