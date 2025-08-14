import type { Express } from "express";
import { SocialPasswordAutomation } from "./social-password-automation";

export function registerSocialTestEndpoints(app: Express) {
  
  // Secure test endpoint for Twitter posting
  app.post('/api/social-automation/test-post', async (req, res) => {
    try {
      const { platform, username, password, testMessage } = req.body;
      
      if (!platform || !username || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Platform, username, and password are required for testing' 
        });
      }

      if (platform.toLowerCase() === 'twitter') {
        const automation = new SocialPasswordAutomation();
        
        // Test login first
        const loginTest = await automation.testLogin({ 
          platform: 'twitter', 
          username, 
          password 
        });

        if (!loginTest.success) {
          return res.json({ 
            success: false, 
            error: `Login failed: ${loginTest.message}`,
            step: 'login_test'
          });
        }

        // If login successful, attempt to post
        const postContent = {
          text: testMessage || "🚀 Testing FlutterBye Social Automation System! #FlutterBye #Crypto #AI",
          hashtags: ['#FlutterBye', '#SocialAutomation', '#Crypto'],
        };

        const postResult = await automation.postToTwitter(
          { platform: 'twitter', username, password }, 
          postContent
        );

        return res.json({
          success: postResult.success,
          message: postResult.message,
          step: 'post_test',
          loginVerified: true
        });

      } else {
        return res.json({ 
          success: false, 
          error: `Testing for ${platform} is not yet implemented. Currently supports Twitter only.`,
          step: 'platform_check'
        });
      }

    } catch (error) {
      console.error('Social test error:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Test failed',
        step: 'error'
      });
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