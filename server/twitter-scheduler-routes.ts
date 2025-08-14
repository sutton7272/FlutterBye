import type { Express } from 'express';
import { twitterScheduler } from './twitter-content-scheduler';
import { aiContentGenerator } from './ai-content-generator';

export function registerTwitterSchedulerRoutes(app: Express) {
  
  // Get scheduled posts
  app.get('/api/social-automation/scheduled-posts', (req, res) => {
    try {
      const posts = twitterScheduler.getScheduledPosts();
      res.json({ success: true, posts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Schedule a new post
  app.post('/api/social-automation/schedule-post', (req, res) => {
    try {
      const { content, hashtags, scheduledTime } = req.body;
      
      if (!content || !scheduledTime) {
        return res.status(400).json({ 
          success: false, 
          message: 'Content and scheduled time are required' 
        });
      }

      const postId = twitterScheduler.schedulePost(
        content, 
        hashtags || [], 
        scheduledTime
      );

      res.json({ 
        success: true, 
        message: 'Post scheduled successfully',
        postId 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Cancel scheduled post
  app.delete('/api/social-automation/scheduled-posts/:postId', (req, res) => {
    try {
      const { postId } = req.params;
      const cancelled = twitterScheduler.cancelScheduledPost(postId);
      
      if (cancelled) {
        res.json({ success: true, message: 'Post cancelled successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Post not found or already posted' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get content templates
  app.get('/api/social-automation/content-templates', (req, res) => {
    try {
      const templates = twitterScheduler.getContentTemplates();
      res.json({ success: true, templates });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Bot control endpoints
  app.post('/api/social-automation/bot/start', (req, res) => {
    try {
      const result = twitterScheduler.startBot();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post('/api/social-automation/bot/stop', (req, res) => {
    try {
      const result = twitterScheduler.stopBot();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get('/api/social-automation/bot/status', (req, res) => {
    try {
      const status = twitterScheduler.getBotStatus();
      res.json({ success: true, status });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put('/api/social-automation/bot/config', (req, res) => {
    try {
      const { config } = req.body;
      if (!config) {
        return res.status(400).json({ success: false, message: 'Config is required' });
      }
      const result = twitterScheduler.updateBotConfig(config);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // AI Content Generation endpoints
  app.post('/api/social-automation/ai/generate-content', async (req, res) => {
    try {
      const { timeSlot, customContext } = req.body;
      
      if (!timeSlot) {
        return res.status(400).json({ 
          success: false, 
          message: 'Time slot is required' 
        });
      }

      const postId = await twitterScheduler.generateAndScheduleContent(timeSlot, customContext);
      
      res.json({ 
        success: true, 
        message: 'AI content generated and scheduled successfully',
        postId 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post('/api/social-automation/ai/bulk-generate', async (req, res) => {
    try {
      const { count = 5 } = req.body;
      
      const postIds = await twitterScheduler.bulkGenerateAndSchedule(count);
      
      res.json({ 
        success: true, 
        message: `${postIds.length} AI-generated posts scheduled successfully`,
        postIds 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get('/api/social-automation/ai/templates', (req, res) => {
    try {
      const templates = aiContentGenerator.getTemplates();
      res.json({ success: true, templates });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post('/api/social-automation/ai/preview-content', async (req, res) => {
    try {
      const { timeSlot, templateId, customContext } = req.body;
      
      if (!timeSlot) {
        return res.status(400).json({ 
          success: false, 
          message: 'Time slot is required' 
        });
      }

      const templates = aiContentGenerator.getTemplates();
      const template = templates.find((t: any) => t.id === templateId) || templates[0];
      
      const generatedContent = await aiContentGenerator.generateContent(
        template, 
        timeSlot, 
        customContext
      );
      
      res.json({ 
        success: true, 
        content: generatedContent 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Quick schedule - daily post
  app.post('/api/social-automation/schedule-daily', (req, res) => {
    try {
      const { content, hashtags, hour, minute } = req.body;
      
      if (!content || hour === undefined) {
        return res.status(400).json({ 
          success: false, 
          message: 'Content and hour are required' 
        });
      }

      const postId = twitterScheduler.scheduleDaily(
        content, 
        hashtags || [], 
        hour, 
        minute || 0
      );

      res.json({ 
        success: true, 
        message: 'Daily post scheduled successfully',
        postId 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  console.log('📅 Twitter Scheduler Routes registered');
}