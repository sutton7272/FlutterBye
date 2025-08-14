import type { Express } from "express";
import FlutterbySocialBot, { type SocialMediaPost } from "./social-media-bot";
import cron from "node-cron";

// Global bot instance
let socialBot: FlutterbySocialBot | null = null;
let automationInterval: NodeJS.Timeout | null = null;

// Storage for social posts (in production, use database)
const socialPosts: SocialMediaPost[] = [];

export function registerSocialRoutes(app: Express) {
  // Initialize social media bot
  app.post('/api/social/initialize', async (req, res) => {
    try {
      const { baseUrl } = req.body;
      socialBot = new FlutterbySocialBot(baseUrl || 'http://localhost:3000');
      
      res.json({ 
        success: true, 
        message: "Social media bot initialized successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to initialize bot" 
      });
    }
  });

  // Create and post content manually
  app.post('/api/social/post', async (req, res) => {
    if (!socialBot) {
      return res.status(400).json({ 
        success: false, 
        error: "Bot not initialized. Call /api/social/initialize first" 
      });
    }

    try {
      const { 
        contentType = 'feature', 
        screenshotPage, 
        screenshotSelector 
      } = req.body;

      const result = await socialBot.createAndPostContent(
        contentType,
        screenshotPage,
        screenshotSelector
      );

      // Store result
      socialPosts.push(result);

      res.json({ 
        success: true, 
        post: result 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create post" 
      });
    }
  });

  // Start automated posting
  app.post('/api/social/start-automation', async (req, res) => {
    if (!socialBot) {
      return res.status(400).json({ 
        success: false, 
        error: "Bot not initialized" 
      });
    }

    try {
      const { intervalHours = 4 } = req.body;

      // Clear existing automation
      if (automationInterval) {
        clearInterval(automationInterval);
      }

      // Start new automation
      await socialBot.scheduleAutomation(intervalHours);

      res.json({ 
        success: true, 
        message: `Automation started with ${intervalHours}h intervals` 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to start automation" 
      });
    }
  });

  // Stop automation
  app.post('/api/social/stop-automation', async (req, res) => {
    if (automationInterval) {
      clearInterval(automationInterval);
      automationInterval = null;
    }

    res.json({ 
      success: true, 
      message: "Automation stopped" 
    });
  });

  // Get all social posts
  app.get('/api/social/posts', async (req, res) => {
    res.json({ 
      success: true, 
      posts: socialPosts.slice(-50), // Return last 50 posts
      total: socialPosts.length 
    });
  });

  // Generate content preview without posting
  app.post('/api/social/preview', async (req, res) => {
    if (!socialBot) {
      return res.status(400).json({ 
        success: false, 
        error: "Bot not initialized" 
      });
    }

    try {
      const { contentType = 'feature', platform = 'twitter' } = req.body;
      
      // Extract platform data
      const data = await socialBot.extractPlatformData();
      
      // Generate content preview
      const content = await socialBot.generateSocialContent(contentType, data, platform);

      res.json({ 
        success: true, 
        preview: {
          content,
          platform,
          contentType,
          characterCount: content.length,
          data
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate preview" 
      });
    }
  });

  // Capture screenshot endpoint
  app.post('/api/social/screenshot', async (req, res) => {
    if (!socialBot) {
      return res.status(400).json({ 
        success: false, 
        error: "Bot not initialized" 
      });
    }

    try {
      const { page = '/', selector } = req.body;
      
      const screenshot = await socialBot.captureFlutterbyeScreenshot(page, selector);
      
      // Convert to base64 for response
      const screenshotBase64 = screenshot.toString('base64');

      res.json({ 
        success: true, 
        screenshot: `data:image/png;base64,${screenshotBase64}`,
        size: screenshot.length
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to capture screenshot" 
      });
    }
  });

  // Social media metrics dashboard
  app.get('/api/social/dashboard', async (req, res) => {
    const stats = {
      totalPosts: socialPosts.length,
      successfulPosts: socialPosts.filter(p => p.status === 'posted').length,
      failedPosts: socialPosts.filter(p => p.status === 'failed').length,
      scheduledPosts: socialPosts.filter(p => p.status === 'scheduled').length,
      totalEngagement: socialPosts.reduce((sum, post) => 
        sum + (post.metrics?.likes || 0) + (post.metrics?.shares || 0) + (post.metrics?.comments || 0), 0
      ),
      platforms: ['twitter', 'linkedin', 'instagram'],
      automationStatus: automationInterval ? 'running' : 'stopped',
      recentPosts: socialPosts.slice(-10)
    };

    res.json({ 
      success: true, 
      dashboard: stats 
    });
  });

  // Scheduled content using cron jobs
  app.post('/api/social/schedule-cron', async (req, res) => {
    const { cronPattern = '0 */4 * * *', contentTypes } = req.body; // Every 4 hours by default
    
    try {
      // Schedule the job
      cron.schedule(cronPattern, async () => {
        if (socialBot) {
          const types = contentTypes || ['feature', 'stats', 'engagement', 'announcement'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          
          try {
            const result = await socialBot.createAndPostContent(randomType, '/dashboard');
            socialPosts.push(result);
            console.log(`🤖 Automated post created: ${result.status}`);
          } catch (error) {
            console.error('❌ Automated post failed:', error);
          }
        }
      });

      res.json({ 
        success: true, 
        message: `Cron job scheduled with pattern: ${cronPattern}` 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to schedule cron job" 
      });
    }
  });

  console.log("🤖 Social media bot routes registered");
}