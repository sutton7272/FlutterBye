import type { Express } from 'express';
import { TwitterAPIService } from './twitter-api-service';

export function registerTwitterAPIRoutes(app: Express) {
  let twitterService: TwitterAPIService;
  
  try {
    twitterService = new TwitterAPIService();
  } catch (error) {
    console.error('❌ Twitter API service initialization failed:', error);
  }

  // Test Twitter API connection
  app.post('/api/social-automation/twitter-api-test', async (req, res) => {
    try {
      if (!twitterService) {
        return res.status(500).json({
          success: false,
          message: 'Twitter API service not initialized - check credentials'
        });
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });

      res.write(JSON.stringify({
        status: 'verifying',
        message: 'Verifying Twitter API credentials...',
        step: 1
      }) + '\n');

      const verification = await twitterService.verifyCredentials();
      
      res.write(JSON.stringify({
        status: 'getting_account',
        message: 'Getting account information...',
        step: 2
      }) + '\n');

      const accountInfo = await twitterService.getAccountInfo();

      res.write(JSON.stringify({
        status: 'complete',
        success: verification.success,
        message: verification.message,
        step: 3,
        accountInfo: accountInfo.success ? accountInfo.data : null
      }) + '\n');

      res.end();

    } catch (error: any) {
      try {
        res.write(JSON.stringify({
          status: 'error',
          success: false,
          error: error.message || 'API test failed',
          step: 'error'
        }) + '\n');
        res.end();
      } catch (e) {
        // Response already closed
      }
    }
  });

  // Post tweet via API
  app.post('/api/social-automation/twitter-api-post', async (req, res) => {
    try {
      if (!twitterService) {
        return res.status(500).json({
          success: false,
          message: 'Twitter API service not initialized'
        });
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });

      res.write(JSON.stringify({
        status: 'posting',
        message: 'Posting tweet via Twitter API...',
        step: 1
      }) + '\n');

      const postContent = {
        text: req.body.text || 'Test post from FlutterBye social automation! 🚀',
        hashtags: req.body.hashtags || ['#FlutterBye', '#Web3', '#Automation'],
        imagePath: req.body.imagePath
      };

      const result = await twitterService.postTweet(postContent);

      res.write(JSON.stringify({
        status: 'complete',
        success: result.success,
        message: result.message,
        tweetId: result.tweetId,
        step: 2,
        method: 'twitter_api'
      }) + '\n');

      res.end();

    } catch (error: any) {
      try {
        res.write(JSON.stringify({
          status: 'error',
          success: false,
          error: error.message || 'Posting failed',
          step: 'error'
        }) + '\n');
        res.end();
      } catch (e) {
        // Response already closed
      }
    }
  });

  console.log('🔧 Twitter API Routes registered');
}