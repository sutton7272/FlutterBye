import { Router } from 'express';
import { flutterinaService } from './flutterina-ai-service';
// Note: Using simple auth check - admin routes should be properly secured in production
import { storage } from './storage';

const router = Router();

/**
 * Flutterina Cost Control & Admin Management
 * Provides comprehensive control over AI system costs and usage
 */

// Admin middleware to check if user has admin permissions
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user?.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

/**
 * Toggle Flutterina system on/off (Emergency shutoff)
 */
router.post('/system/toggle', isAuthenticated, isAdmin, async (req: any, res) => {
  try {
    const { enabled } = req.body;
    const adminUserId = req.user.claims.sub;
    
    await flutterinaService.setSystemEnabled(enabled, adminUserId);
    
    res.json({
      success: true,
      message: `Flutterina system ${enabled ? 'enabled' : 'disabled'}`,
      systemEnabled: enabled,
      adminUserId
    });
  } catch (error) {
    console.error('System toggle error:', error);
    res.status(500).json({ error: 'Failed to toggle system' });
  }
});

/**
 * Get current system status and usage statistics
 */
router.get('/system/status', isAuthenticated, isAdmin, async (req: any, res) => {
  try {
    const systemEnabled = await flutterinaService.checkSystemEnabled();
    const globalUsageStats = await flutterinaService.getUsageStats();
    
    res.json({
      systemEnabled,
      usage: globalUsageStats,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to get system status' });
  }
});

/**
 * Get user-specific usage statistics
 */
router.get('/user/:userId/usage', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const userUsageStats = await flutterinaService.getUsageStats(userId);
    
    res.json({
      userId,
      usage: userUsageStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User usage check error:', error);
    res.status(500).json({ error: 'Failed to get user usage' });
  }
});

/**
 * User opt-out functionality (users can disable Flutterina for themselves)
 */
router.post('/user/opt-out', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { optOut } = req.body;
    
    // Store user preference in context
    const currentContext = await storage.getFlutterinaUserContext(userId) || {};
    const updatedContext = {
      ...currentContext,
      preferences: {
        ...currentContext.preferences,
        optedOut: optOut,
        optOutDate: optOut ? new Date() : null
      }
    };
    
    await storage.updateFlutterinaUserContext(userId, updatedContext);
    
    res.json({
      success: true,
      message: optOut ? 'Successfully opted out of Flutterina' : 'Successfully opted back into Flutterina',
      optedOut: optOut,
      userId
    });
  } catch (error) {
    console.error('User opt-out error:', error);
    res.status(500).json({ error: 'Failed to update opt-out preference' });
  }
});

/**
 * Get user's current Flutterina preferences and settings
 */
router.get('/user/preferences', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const context = await storage.getFlutterinaUserContext(userId) || {};
    
    res.json({
      userId,
      preferences: context.preferences || {},
      optedOut: context.preferences?.optedOut || false,
      usage: await flutterinaService.getUsageStats(userId)
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Failed to get user preferences' });
  }
});

/**
 * Cost monitoring and alerts
 */
router.get('/cost/monitor', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const stats = await flutterinaService.getUsageStats();
    const systemEnabled = await flutterinaService.checkSystemEnabled();
    
    // Calculate cost estimates (approximate)
    const estimatedCostPerToken = 0.00003; // Rough estimate for GPT-4o
    const dailyCostEstimate = stats.globalUsage.daily * estimatedCostPerToken;
    const monthlyCostEstimate = dailyCostEstimate * 30;
    
    const alerts = [];
    
    // Generate cost alerts
    if (stats.globalUsage.daily > stats.limits.globalDaily * 0.8) {
      alerts.push({
        type: 'warning',
        message: 'Daily token usage is above 80% of limit',
        severity: 'medium'
      });
    }
    
    if (stats.globalUsage.daily > stats.limits.globalDaily * 0.95) {
      alerts.push({
        type: 'critical',
        message: 'Daily token usage is above 95% of limit',
        severity: 'high'
      });
    }
    
    if (monthlyCostEstimate > 500) {
      alerts.push({
        type: 'cost',
        message: `Estimated monthly cost exceeds $500: $${monthlyCostEstimate.toFixed(2)}`,
        severity: 'high'
      });
    }
    
    res.json({
      systemEnabled,
      usage: stats,
      costEstimates: {
        dailyCost: dailyCostEstimate,
        monthlyCost: monthlyCostEstimate,
        perTokenCost: estimatedCostPerToken
      },
      alerts,
      recommendations: [
        'Monitor usage trends daily',
        'Set up automatic alerts for high usage',
        'Consider implementing usage-based pricing for enterprise users',
        'Review conversation quality vs cost metrics'
      ]
    });
  } catch (error) {
    console.error('Cost monitor error:', error);
    res.status(500).json({ error: 'Failed to get cost monitoring data' });
  }
});

/**
 * Get comprehensive statistics for Flutterina system
 */
router.get('/stats', async (req: any, res) => {
  try {
    const stats = await flutterinaService.getComprehensiveStats();
    
    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

/**
 * Get Flutterina system settings
 */
router.get('/settings', async (req: any, res) => {
  try {
    const settings = await flutterinaService.getSystemSettings();
    
    res.json({
      success: true,
      ...settings
    });
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

/**
 * Update Flutterina system settings
 */
router.put('/settings', async (req: any, res) => {
  try {
    const newSettings = req.body;
    const updated = await flutterinaService.updateSystemSettings(newSettings);
    
    res.json({
      success: true,
      settings: updated,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

/**
 * Get user conversations for admin monitoring
 */
router.get('/conversations', async (req: any, res) => {
  try {
    const conversations = await flutterinaService.getActiveConversations();
    
    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

/**
 * Emergency stop all AI processing
 */
router.post('/emergency-stop', async (req: any, res) => {
  try {
    await flutterinaService.emergencyStop();
    
    res.json({
      success: true,
      message: 'Emergency stop activated - All AI processing halted'
    });
  } catch (error) {
    console.error('Emergency stop error:', error);
    res.status(500).json({ error: 'Failed to execute emergency stop' });
  }
});

/**
 * Reset usage limits for all users
 */
router.post('/reset-usage', async (req: any, res) => {
  try {
    await flutterinaService.resetAllUsage();
    
    res.json({
      success: true,
      message: 'All usage limits have been reset'
    });
  } catch (error) {
    console.error('Reset usage error:', error);
    res.status(500).json({ error: 'Failed to reset usage' });
  }
});

export default router;