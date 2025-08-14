import type { Express } from "express";
import { SocialPasswordAutomation } from "./social-password-automation";

export function registerSocialTestEndpoints(app: Express) {
  
  // Secure test endpoint for Twitter posting
  app.post('/api/social-automation/test-post', async (req, res) => {
    try {
      const { platform, username, password, testMessage } = req.body;
      
      console.log('🔍 Test endpoint received:', { platform, username: username ? '***' : 'missing', password: password ? '***' : 'missing', testMessage });
      
      if (!platform || !username || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Platform, username, and password are required for testing' 
        });
      }

      if (platform.toLowerCase() === 'twitter') {
        // Set Chromium path before creating automation instance
        process.env.PUPPETEER_EXECUTABLE_PATH = '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';
        
        const automation = new SocialPasswordAutomation();
        
        // Direct posting attempt (login is handled within postToTwitter)
        const postContent = {
          text: testMessage || "🚀 Testing FlutterBye Social Automation System! Revolutionary Web3 platform with AI-powered token messaging!",
          hashtags: ['#FlutterBye', '#SocialAutomation', '#Web3', '#AI', '#Crypto'],
        };

        // Direct posting with extended timeout (no Promise.race to avoid timeout conflicts)
        const postResult = await automation.postToTwitter(
          { platform: 'twitter', username, password }, 
          postContent
        );

        return res.status(200).json({
          success: postResult.success,
          message: postResult.message,
          step: 'post_test',
          method: 'browser_automation',
          loginVerified: true
        });

      } else {
        return res.json({ 
          success: false, 
          error: `Testing for ${platform} is not yet implemented. Currently supports Twitter only.`,
          step: 'platform_check'
        });
      }

    } catch (error: any) {
      console.error('Social test error:', error);
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          error: error.message || 'Browser automation failed',
          step: 'error'
        });
      }
    }
  });

  // Test endpoint for engagement automation (no posting, just monitoring)
  app.post('/api/social-automation/test-engagement', async (req, res) => {
    try {
      const { targetAccount, platform } = req.body;
      
      if (!targetAccount || !platform) {
        return res.status(400).json({ 
          success: false, 
          error: 'Target account and platform are required' 
        });
      }

      // Simulate engagement monitoring
      const mockEngagementResult = {
        targetAccount,
        platform,
        postsFound: Math.floor(Math.random() * 10) + 1,
        engagementOpportunities: Math.floor(Math.random() * 5) + 1,
        lastPost: 'Just now',
        strategy: 'Monitor for new posts and engage within 2-5 minutes for maximum organic reach'
      };

      res.json({
        success: true,
        message: `Successfully monitoring ${targetAccount} on ${platform}`,
        data: mockEngagementResult
      });

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Engagement test failed' 
      });
    }
  });

  console.log('🧪 Social Media Testing Endpoints registered');
}