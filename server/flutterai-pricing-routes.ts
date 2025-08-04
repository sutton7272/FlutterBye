import { Router } from "express";
import { flutterAIPricingService } from "./flutterai-pricing-service";
import { z } from "zod";

const router = Router();

/**
 * FlutterAI Pricing and Monetization Routes
 * 
 * Comprehensive API endpoints for subscription management,
 * usage tracking, and monetization controls
 */

// Get all pricing tiers
router.get('/pricing/tiers', async (req, res) => {
  try {
    const tiers = flutterAIPricingService.getPricingTiers();
    res.json({
      success: true,
      tiers
    });
  } catch (error) {
    console.error('Error getting pricing tiers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get pricing tiers'
    });
  }
});

// Get user's current subscription
router.get('/pricing/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = await flutterAIPricingService.getUserSubscription(userId);
    const usage = await flutterAIPricingService.getUserUsage(userId);
    
    res.json({
      success: true,
      subscription,
      usage
    });
  } catch (error) {
    console.error('Error getting user subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get subscription information'
    });
  }
});

// Get user's current usage
router.get('/pricing/usage/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const usage = await flutterAIPricingService.getUserUsage(userId);
    
    res.json({
      success: true,
      usage
    });
  } catch (error) {
    console.error('Error getting user usage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get usage information'
    });
  }
});

// Check if user can perform specific action
router.post('/pricing/check-permission', async (req, res) => {
  try {
    const { userId, action } = req.body;
    
    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId or action'
      });
    }

    const permission = await flutterAIPricingService.canPerformAction(userId, action);
    
    res.json({
      success: true,
      permission
    });
  } catch (error) {
    console.error('Error checking permission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check permission'
    });
  }
});

// Create checkout session for subscription upgrade
router.post('/pricing/checkout', async (req, res) => {
  try {
    const { userId, tierId, billingPeriod } = req.body;
    
    if (!userId || !tierId || !billingPeriod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, tierId, billingPeriod'
      });
    }

    if (!['monthly', 'yearly'].includes(billingPeriod)) {
      return res.status(400).json({
        success: false,
        error: 'Billing period must be monthly or yearly'
      });
    }

    const checkout = await flutterAIPricingService.createCheckoutSession(
      userId, 
      tierId, 
      billingPeriod
    );
    
    res.json({
      success: true,
      checkoutUrl: checkout.checkoutUrl
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create checkout session'
    });
  }
});

// Record usage (for API billing)
router.post('/pricing/record-usage', async (req, res) => {
  try {
    const { userId, action, quantity = 1 } = req.body;
    
    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId or action'
      });
    }

    await flutterAIPricingService.recordUsage(userId, action, quantity);
    
    res.json({
      success: true,
      message: 'Usage recorded successfully'
    });
  } catch (error) {
    console.error('Error recording usage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record usage'
    });
  }
});

// Get pricing analytics (admin only)
router.get('/pricing/analytics', async (req, res) => {
  try {
    // In a real app, you would check admin permissions here
    const analytics = await flutterAIPricingService.getPricingAnalytics();
    
    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Error getting pricing analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get pricing analytics'
    });
  }
});

// Webhook endpoint for Stripe events
router.post('/pricing/webhook', async (req, res) => {
  try {
    // This would handle Stripe webhook events for subscription updates
    console.log('Stripe webhook received:', req.body);
    
    res.json({
      success: true,
      message: 'Webhook processed'
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
});

// API rate limiting middleware
export const apiRateLimitMiddleware = async (req, res, next) => {
  try {
    // Extract user ID from request (this would come from authentication)
    const userId = req.headers['x-user-id'] || req.query.userId || 'anonymous';
    
    // Check if user can make API calls
    const permission = await flutterAIPricingService.canPerformAction(userId, 'api_call');
    
    if (!permission.allowed) {
      return res.status(429).json({
        success: false,
        error: permission.reason,
        upgradeRequired: permission.upgradeRequired,
        message: 'API limit exceeded. Please upgrade your plan to continue.'
      });
    }

    // Record the API call
    await flutterAIPricingService.recordUsage(userId, 'api_call', 1);
    
    next();
  } catch (error) {
    console.error('Error in API rate limiting:', error);
    // Allow the request to continue on error, but log it
    next();
  }
};

export default router;