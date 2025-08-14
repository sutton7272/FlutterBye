import type { Express } from 'express';
import { twitterScheduler } from './twitter-content-scheduler';

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