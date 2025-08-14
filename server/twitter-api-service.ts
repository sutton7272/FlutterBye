import { TwitterApi } from 'twitter-api-v2';

interface PostContent {
  text: string;
  hashtags: string[];
  imagePath?: string;
}

export class TwitterAPIService {
  private client: TwitterApi;

  constructor() {
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET || 
        !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_TOKEN_SECRET) {
      throw new Error('Twitter API credentials not found');
    }

    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
  }

  async postTweet(content: PostContent): Promise<{success: boolean, message: string, tweetId?: string}> {
    try {
      console.log('🐦 Posting tweet via Twitter API...');
      
      const fullText = `${content.text} ${content.hashtags.join(' ')}`;
      
      // Post tweet using Twitter API v2
      const tweet = await this.client.v2.tweet(fullText);
      
      console.log('✅ Tweet posted successfully:', tweet.data.id);
      
      return {
        success: true,
        message: `Tweet posted successfully! ID: ${tweet.data.id}`,
        tweetId: tweet.data.id
      };
      
    } catch (error: any) {
      console.error('❌ Twitter API error:', error);
      
      // Handle specific Twitter API errors
      if (error.code === 429) {
        return {
          success: false,
          message: 'Rate limit exceeded - please wait before posting again'
        };
      } else if (error.code === 403) {
        return {
          success: false,
          message: 'Access forbidden - check API credentials and permissions'
        };
      } else if (error.message?.includes('duplicate')) {
        return {
          success: false,
          message: 'Duplicate tweet - Twitter prevents posting identical content'
        };
      } else {
        return {
          success: false,
          message: `Twitter API error: ${error.message || 'Unknown error'}`
        };
      }
    }
  }

  async verifyCredentials(): Promise<{success: boolean, message: string, user?: any}> {
    try {
      console.log('🔍 Verifying Twitter API credentials...');
      
      const user = await this.client.v2.me();
      
      console.log('✅ Twitter API credentials verified for:', user.data.username);
      
      return {
        success: true,
        message: `Connected as @${user.data.username}`,
        user: user.data
      };
      
    } catch (error: any) {
      console.error('❌ Twitter API verification failed:', error);
      
      return {
        success: false,
        message: `API verification failed: ${error.message || 'Invalid credentials'}`
      };
    }
  }

  async getAccountInfo(): Promise<{success: boolean, data?: any, message?: string}> {
    try {
      const user = await this.client.v2.me({
        'user.fields': ['public_metrics', 'verified', 'created_at', 'description']
      });
      
      return {
        success: true,
        data: {
          username: user.data.username,
          name: user.data.name,
          followers: user.data.public_metrics?.followers_count || 0,
          following: user.data.public_metrics?.following_count || 0,
          tweets: user.data.public_metrics?.tweet_count || 0,
          verified: user.data.verified || false,
          description: user.data.description || '',
          created: user.data.created_at
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to get account info: ${error.message}`
      };
    }
  }
}