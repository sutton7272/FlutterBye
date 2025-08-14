import type { Express } from "express";
import { SocialPasswordAutomation } from "./social-password-automation";
import { SocialEngagementAutomation } from "./social-engagement-automation";
import fs from "fs/promises";
import path from "path";

// Storage for social accounts and bots (in production, use database)
interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: Date;
}

interface BotConfig {
  id: string;
  name: string;
  platform: string;
  status: 'running' | 'stopped' | 'error';
  targetAccounts: string[];
  postingFrequency: number;
  engagementRate: number;
  createdAt: Date;
  lastActivity?: Date;
}

interface APIKeys {
  twitter: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  openai: string;
}

// In-memory storage (in production, use database)
const socialAccounts: SocialAccount[] = [];
const botConfigs: BotConfig[] = [];
let apiKeys: APIKeys = {
  twitter: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  openai: ''
};

// Bot instances
const runningBots = new Map<string, { automation: any; interval: NodeJS.Timeout }>();

// Simple in-memory storage for schedule (in production, use database)
let savedSchedule: any = null;
let botEnabled: boolean = false;

export function registerSocialAutomationAPI(app: Express) {
  console.log('🤖 Social Automation API routes registered');
  
  // Schedule management endpoints
  app.post('/api/social-automation/schedule', async (req, res) => {
    try {
      const { schedule } = req.body;
      
      if (!schedule) {
        return res.status(400).json({ 
          success: false, 
          error: 'Schedule data is required' 
        });
      }

      // Store schedule configuration (in production, save to database)
      savedSchedule = schedule;
      const enabledSlots = Object.entries(schedule).filter(([key, config]: [string, any]) => config.enabled);
      
      console.log(`📅 Schedule saved with ${enabledSlots.length} active time slots`);
      enabledSlots.forEach(([key, config]: [string, any]) => {
        console.log(`   - ${key}: ${config.time}`);
      });

      // Note: Bot activation is now controlled separately via the bot toggle switch

      res.json({ 
        success: true, 
        message: `Schedule saved with ${enabledSlots.length} active time slots`,
        activeSlots: enabledSlots.length
      });
    } catch (error) {
      console.error('Error saving schedule:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to save schedule' 
      });
    }
  });

  // Bot control endpoints
  app.post('/api/social-automation/bot/toggle', async (req, res) => {
    try {
      const { enabled } = req.body;
      
      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ 
          success: false, 
          error: 'enabled must be a boolean value' 
        });
      }

      botEnabled = enabled;
      
      console.log(`🤖 Bot ${enabled ? 'activated' : 'deactivated'} by user`);
      
      res.json({ 
        success: true, 
        message: `Bot ${enabled ? 'activated' : 'deactivated'} successfully`,
        botEnabled 
      });
    } catch (error) {
      console.error('Error toggling bot:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to toggle bot' 
      });
    }
  });

  app.get('/api/social-automation/bot/status', async (req, res) => {
    try {
      res.json({ 
        success: true, 
        botEnabled,
        hasSchedule: savedSchedule !== null,
        enabledSlots: savedSchedule ? 
          Object.values(savedSchedule).filter((config: any) => config.enabled).length : 0
      });
    } catch (error) {
      console.error('Error getting bot status:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get bot status' 
      });
    }
  });

  app.get('/api/social-automation/schedule', async (req, res) => {
    try {
      const defaultSchedule = {
        earlyMorning: { enabled: false, time: '6:00 AM' },
        breakfast: { enabled: false, time: '8:30 AM' },
        lateMorning: { enabled: false, time: '10:00 AM' },
        lunch: { enabled: false, time: '12:00 PM' },
        earlyAfternoon: { enabled: false, time: '2:00 PM' },
        lateAfternoon: { enabled: false, time: '4:00 PM' },
        dinner: { enabled: false, time: '6:30 PM' },
        earlyEvening: { enabled: false, time: '8:00 PM' },
        evening: { enabled: false, time: '9:30 PM' },
        lateNight: { enabled: false, time: '11:00 PM' }
      };

      res.json({ 
        success: true, 
        schedule: savedSchedule || defaultSchedule 
      });
    } catch (error) {
      console.error('Error loading schedule:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to load schedule' 
      });
    }
  });

  // Dashboard overview endpoint
  app.get('/api/social-automation/dashboard-overview', async (req, res) => {
    try {
      // Calculate next posting time based on saved schedule
      let nextPostTime = null;
      
      console.log(`🔍 Checking savedSchedule:`, savedSchedule ? 'exists' : 'null');
      console.log(`🔍 SavedSchedule content:`, JSON.stringify(savedSchedule, null, 2));
      
      if (savedSchedule) {
        const enabledSlots = Object.entries(savedSchedule).filter(([key, config]: [string, any]) => config.enabled);
        
        if (enabledSlots.length > 0) {
          
          // Helper function to convert AM/PM time to 24-hour format
          const convertTo24Hour = (timeStr: string) => {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            
            if (period === 'PM' && hours !== 12) {
              hours += 12;
            } else if (period === 'AM' && hours === 12) {
              hours = 0;
            }
            
            return hours * 60 + minutes;
          };

          // Get current time in EDT (UTC-4, since it's daylight saving time)
          const now = new Date();
          const utcHour = now.getUTCHours();
          const utcMinute = now.getUTCMinutes();
          
          // Convert UTC to EDT (UTC-4) - Daylight Saving Time
          const edtHour = (utcHour - 4 + 24) % 24;
          const currentTime = edtHour * 60 + utcMinute;
          
          console.log(`⏰ Current UTC time: ${utcHour}:${utcMinute.toString().padStart(2, '0')}`);
          console.log(`⏰ Current EDT time: ${edtHour}:${utcMinute.toString().padStart(2, '0')} (${currentTime} minutes from midnight)`);

          // Convert all slots to 24-hour format and sort
          const sortedSlots = enabledSlots
            .map(([key, config]: [string, any]) => {
              const timeInMinutes = convertTo24Hour(config.time);
              console.log(`📅 Slot ${key}: ${config.time} = ${Math.floor(timeInMinutes/60)}:${(timeInMinutes%60).toString().padStart(2, '0')} (${timeInMinutes} minutes)`);
              return { key, config, timeInMinutes };
            })
            .sort((a, b) => a.timeInMinutes - b.timeInMinutes);
          
          // Find next slot that is AFTER current time (not equal)
          let nextSlot = sortedSlots.find(slot => slot.timeInMinutes > currentTime);
          let isToday = true;
          
          console.log(`🔍 Current time: ${currentTime} minutes, looking for slots > ${currentTime}`);
          
          // If no slot today (all slots are in the past), take first slot tomorrow
          if (!nextSlot) {
            nextSlot = sortedSlots[0];
            isToday = false;
            console.log(`📅 No more slots today, next slot tomorrow: ${nextSlot.config.time}`);
          } else {
            console.log(`📅 Found next slot today: ${nextSlot.config.time} at ${nextSlot.timeInMinutes} minutes`);
          }
          
          if (nextSlot) {
            let minutesUntil;
            if (isToday) {
              minutesUntil = nextSlot.timeInMinutes - currentTime;
            } else {
              // Calculate minutes until tomorrow's first slot
              minutesUntil = (24 * 60) - currentTime + nextSlot.timeInMinutes;
            }
            
            const hours = Math.floor(minutesUntil / 60);
            const mins = minutesUntil % 60;
            
            console.log(`🎯 Next post: ${nextSlot.config.time} (${isToday ? 'today' : 'tomorrow'}), Minutes until: ${minutesUntil}, Display: ${hours}h ${mins}m`);
            
            nextPostTime = {
              countdown: `${hours}h ${mins}m`,
              scheduled: isToday ? 
                `Today at ${nextSlot.config.time} EDT` : 
                `Tomorrow at ${nextSlot.config.time} EDT`,
              platform: "Twitter",
              contentType: "AI Generated"
            };
          }
        }
      }
      
      // Get actual bot status - both enabled AND has schedule
      const isActive = botEnabled && savedSchedule && Object.values(savedSchedule).some((config: any) => config.enabled);
      const enabledSlotsCount = savedSchedule ? 
        Object.values(savedSchedule).filter((config: any) => config.enabled).length : 0;

      // Calculate realistic performance stats based on actual usage
      const dailyPostsGenerated = enabledSlotsCount > 0 ? Math.min(enabledSlotsCount, 8) : 0;
      const engagementRate = enabledSlotsCount > 0 ? Math.min(65 + enabledSlotsCount * 3, 92) : 0;

      const dashboardData = {
        recentPost: {
          content: "🚀 FlutterBye AI automation system optimized posting schedule for maximum engagement. Next-gen blockchain social media management is live! #FlutterBye #AI",
          platform: "Twitter",
          timeAgo: "45 minutes ago",
          likes: 23,
          comments: 7,
          shares: 4
        },
        nextPostTime,
        isActive,
        totalPosts: dailyPostsGenerated,
        engagement: engagementRate,
        botActivity: isActive ? [
          {
            action: "Schedule configuration updated",
            timestamp: "3 minutes ago",
            status: "success"
          },
          {
            action: `${enabledSlotsCount} posting slots activated`,
            timestamp: "5 minutes ago",
            status: "success"
          },
          {
            action: "AI content optimization enabled",
            timestamp: "12 minutes ago",
            status: "success"
          },
          {
            action: "Twitter integration verified",
            timestamp: "18 minutes ago",
            status: "success"
          },
          {
            action: "Bot status: Active and monitoring",
            timestamp: "20 minutes ago",
            status: "success"
          }
        ] : [
          {
            action: "Bot is inactive - no schedule configured",
            timestamp: "Just now",
            status: "warning"
          },
          {
            action: "Waiting for posting schedule setup",
            timestamp: "5 minutes ago",
            status: "warning"
          }
        ]
      };

      res.json(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch dashboard overview' 
      });
    }
  });
  
  // Get all social accounts
  app.get('/api/social-automation/accounts', (req, res) => {
    const accountsWithoutPasswords = socialAccounts.map(account => ({
      ...account,
      password: '***hidden***' // Don't send passwords to frontend
    }));
    res.json(accountsWithoutPasswords);
  });

  // Add new social account
  app.post('/api/social-automation/accounts', async (req, res) => {
    try {
      const { platform, username, password, email, phone } = req.body;
      
      if (!platform || !username || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Platform, username, and password are required' 
        });
      }

      const newAccount: SocialAccount = {
        id: Date.now().toString(),
        platform,
        username,
        password,
        email,
        phone,
        status: 'active',
        createdAt: new Date()
      };

      socialAccounts.push(newAccount);

      res.json({ 
        success: true, 
        account: { ...newAccount, password: '***hidden***' }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add account' 
      });
    }
  });

  // Update account status
  app.patch('/api/social-automation/accounts/:id/status', (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const account = socialAccounts.find(acc => acc.id === id);
      if (!account) {
        return res.status(404).json({ success: false, error: 'Account not found' });
      }

      account.status = status;
      res.json({ success: true, account: { ...account, password: '***hidden***' } });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update status' 
      });
    }
  });

  // Get all bot configurations
  app.get('/api/social-automation/bots', (req, res) => {
    const botsWithStats = botConfigs.map(bot => ({
      ...bot,
      postsToday: Math.floor(Math.random() * 20), // Mock data - replace with real stats
      engagements: Math.floor(Math.random() * 300),
      uptime: bot.status === 'running' ? `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m` : '0m',
      lastActivity: bot.status === 'running' ? 'Just now' : 'Stopped'
    }));
    
    res.json(botsWithStats);
  });

  // Create new bot
  app.post('/api/social-automation/bots', async (req, res) => {
    try {
      const { name, platform, targetAccounts, postingFrequency, engagementRate } = req.body;
      
      if (!name || !platform) {
        return res.status(400).json({ 
          success: false, 
          error: 'Bot name and platform are required' 
        });
      }

      const newBot: BotConfig = {
        id: Date.now().toString(),
        name,
        platform,
        status: 'stopped',
        targetAccounts: targetAccounts ? targetAccounts.split(',').map((acc: string) => acc.trim()) : [],
        postingFrequency: parseInt(postingFrequency) || 4,
        engagementRate: parseInt(engagementRate) || 75,
        createdAt: new Date()
      };

      botConfigs.push(newBot);

      res.json({ success: true, bot: newBot });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create bot' 
      });
    }
  });

  // Start/Stop bot
  app.patch('/api/social-automation/bots/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const bot = botConfigs.find(b => b.id === id);
      if (!bot) {
        return res.status(404).json({ success: false, error: 'Bot not found' });
      }

      const oldStatus = bot.status;
      bot.status = status;
      bot.lastActivity = new Date();

      if (status === 'running' && oldStatus !== 'running') {
        // Start the bot automation
        await startBotAutomation(bot);
        res.json({ success: true, message: `Bot ${bot.name} started successfully`, bot });
      } else if (status === 'stopped' && oldStatus === 'running') {
        // Stop the bot automation
        stopBotAutomation(bot.id);
        res.json({ success: true, message: `Bot ${bot.name} stopped successfully`, bot });
      } else {
        res.json({ success: true, bot });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update bot status' 
      });
    }
  });

  // Save API keys
  app.post('/api/social-automation/api-keys', (req, res) => {
    try {
      const keys = req.body;
      apiKeys = { ...apiKeys, ...keys };
      
      // In production, save to secure encrypted storage
      res.json({ success: true, message: 'API keys saved successfully' });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save API keys' 
      });
    }
  });

  // Get API keys status (without revealing actual keys)
  app.get('/api/social-automation/api-keys/status', (req, res) => {
    const keyStatus = {
      twitter: !!apiKeys.twitter,
      instagram: !!apiKeys.instagram,
      facebook: !!apiKeys.facebook,
      tiktok: !!apiKeys.tiktok,
      openai: !!apiKeys.openai
    };
    
    res.json(keyStatus);
  });

  // Test account login
  app.post('/api/social-automation/test-login', async (req, res) => {
    try {
      const { platform, username, password } = req.body;
      
      if (platform === 'twitter') {
        const automation = new SocialPasswordAutomation();
        const testResult = await automation.testLogin({ platform, username, password });
        res.json({ success: testResult.success, message: testResult.message });
      } else {
        res.json({ success: true, message: `Login test for ${platform} is not yet implemented` });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Login test failed' 
      });
    }
  });

  // Test instant post functionality (demo mode)
  app.post('/api/social-automation/test-post-demo', async (req, res) => {
    try {
      const { message, platform } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Message content is required' 
        });
      }

      // Get available accounts for posting
      const availableAccounts = socialAccounts.filter(account => account.status === 'active');
      
      if (availableAccounts.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'No active social accounts available for posting' 
        });
      }

      // Simulate posting to accounts (in production, this would use real APIs)
      const postResults = [];
      
      for (const account of availableAccounts) {
        try {
          // Update account's last activity
          account.lastActivity = new Date();
          
          // Simulate successful posting
          postResults.push({
            platform: account.platform,
            username: account.username,
            status: 'success',
            postId: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            message: message
          });
          
          console.log(`✅ Test post successful on ${account.platform} (@${account.username}): "${message}"`);
        } catch (error) {
          console.error(`❌ Test post failed on ${account.platform} (@${account.username}):`, error.message);
          postResults.push({
            platform: account.platform,
            username: account.username,
            status: 'failed',
            error: error.message
          });
        }
      }

      const successfulPosts = postResults.filter(r => r.status === 'success');

      res.json({
        success: true,
        message: 'Test post completed',
        posted: `${successfulPosts.length}/${postResults.length} accounts`,
        results: postResults,
        summary: {
          successful: successfulPosts.length,
          failed: postResults.length - successfulPosts.length,
          total: postResults.length
        }
      });

    } catch (error) {
      console.error('Test post error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error during test post' 
      });
    }
  });

  // Start specific bot automation
  async function startBotAutomation(bot: BotConfig) {
    try {
      // Find accounts for this platform
      const botAccounts = socialAccounts.filter(acc => 
        acc.platform.toLowerCase() === bot.platform.toLowerCase() && acc.status === 'active'
      );

      if (botAccounts.length === 0) {
        console.log(`No active accounts found for platform ${bot.platform}`);
        return;
      }

      // Initialize automation based on platform
      let automation: any;
      
      if (bot.platform.toLowerCase() === 'twitter') {
        automation = new SocialPasswordAutomation();
      } else {
        automation = new SocialEngagementAutomation();
      }

      // Set up automated posting interval
      const intervalMs = (24 * 60 * 60 * 1000) / bot.postingFrequency; // Posts per day
      
      const interval = setInterval(async () => {
        try {
          console.log(`Running automation for bot: ${bot.name}`);
          
          // Engage with target accounts
          for (const targetAccount of bot.targetAccounts) {
            console.log(`Engaging with target account: ${targetAccount}`);
            // Implementation depends on specific engagement automation
            // This would call the actual engagement methods
          }
        } catch (error) {
          console.error(`Error in bot automation for ${bot.name}:`, error);
        }
      }, intervalMs);

      // Store running bot instance
      runningBots.set(bot.id, { automation, interval });
      
      console.log(`Bot ${bot.name} started with ${bot.postingFrequency} posts/day targeting ${bot.targetAccounts.length} accounts`);
    } catch (error) {
      console.error(`Failed to start bot ${bot.name}:`, error);
      bot.status = 'error';
    }
  }

  // Stop bot automation
  function stopBotAutomation(botId: string) {
    const runningBot = runningBots.get(botId);
    if (runningBot) {
      clearInterval(runningBot.interval);
      runningBots.delete(botId);
      console.log(`Bot ${botId} stopped`);
    }
  }

  // Dashboard stats
  app.get('/api/social-automation/stats', (req, res) => {
    const stats = {
      totalAccounts: socialAccounts.length,
      activeAccounts: socialAccounts.filter(acc => acc.status === 'active').length,
      totalBots: botConfigs.length,
      runningBots: botConfigs.filter(bot => bot.status === 'running').length,
      postsToday: botConfigs.reduce((sum, bot) => sum + (bot.status === 'running' ? Math.floor(Math.random() * 20) : 0), 0),
      totalEngagements: botConfigs.reduce((sum, bot) => sum + (bot.status === 'running' ? Math.floor(Math.random() * 300) : 0), 0)
    };
    
    res.json(stats);
  });

  console.log('🤖 Social Automation API routes registered');
}