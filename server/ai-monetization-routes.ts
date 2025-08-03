/**
 * AI Monetization Routes - Premium AI features and subscription management
 */

import { Router } from 'express';
import { aiMonetizationService } from './ai-monetization-service';

const router = Router();

// Get subscription tiers and pricing
router.get('/subscription-tiers', async (req, res) => {
  try {
    const tiers = aiMonetizationService.getSubscriptionTiers();
    res.json({
      success: true,
      subscriptionTiers: tiers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get subscription tiers error:', error);
    res.status(500).json({ error: 'Failed to get subscription tiers' });
  }
});

// Check feature access for user
router.post('/check-access', async (req, res) => {
  try {
    const { userId, feature, userTier = 'free' } = req.body;
    
    if (!userId || !feature) {
      return res.status(400).json({ error: 'userId and feature are required' });
    }

    const accessCheck = await aiMonetizationService.canAccessFeature(userId, feature, userTier);
    
    res.json({
      success: true,
      accessCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Check access error:', error);
    res.status(500).json({ error: 'Failed to check feature access' });
  }
});

// Premium emotion analysis endpoint
router.post('/premium-emotion-analysis', async (req, res) => {
  try {
    const { 
      text, 
      userId, 
      userTier = 'free',
      options = {}
    } = req.body;
    
    if (!text || !userId) {
      return res.status(400).json({ error: 'text and userId are required' });
    }

    const analysis = await aiMonetizationService.performPremiumEmotionAnalysis(
      text, 
      userId, 
      userTier, 
      options
    );
    
    res.json({
      success: true,
      analysis,
      tier: userTier,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Premium emotion analysis error:', error);
    if (error.message.includes('limit') || error.message.includes('requires')) {
      res.status(402).json({ 
        error: error.message,
        upgradeRequired: true,
        recommendedTier: 'pro'
      });
    } else {
      res.status(500).json({ error: 'Failed to perform premium emotion analysis' });
    }
  }
});

// Token performance prediction endpoint
router.post('/predict-token-performance', async (req, res) => {
  try {
    const { tokenData, userId, userTier = 'free' } = req.body;
    
    if (!tokenData || !userId) {
      return res.status(400).json({ error: 'tokenData and userId are required' });
    }

    const prediction = await aiMonetizationService.predictTokenPerformance(
      tokenData,
      userId,
      userTier
    );
    
    res.json({
      success: true,
      prediction,
      tier: userTier,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Token performance prediction error:', error);
    if (error.message.includes('limit') || error.message.includes('requires')) {
      res.status(402).json({ 
        error: error.message,
        upgradeRequired: true,
        recommendedTier: 'pro'
      });
    } else {
      res.status(500).json({ error: 'Failed to predict token performance' });
    }
  }
});

// API access endpoint for enterprise users
router.post('/api/:endpoint', async (req, res) => {
  try {
    const { endpoint } = req.params;
    const { userId, apiKey, data } = req.body;
    
    if (!userId || !apiKey) {
      return res.status(401).json({ error: 'userId and apiKey are required' });
    }

    const result = await aiMonetizationService.processAPIRequest(
      `/ai/${endpoint}`,
      data,
      userId,
      apiKey
    );
    
    res.json({
      success: true,
      result,
      endpoint,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API request error:', error);
    if (error.message.includes('requires Enterprise')) {
      res.status(402).json({ 
        error: error.message,
        upgradeRequired: true,
        recommendedTier: 'enterprise'
      });
    } else if (error.message.includes('limit')) {
      res.status(429).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to process API request' });
    }
  }
});

// Get user usage statistics
router.get('/usage/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const stats = aiMonetizationService.getUserUsageStats(userId);
    
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({ error: 'Failed to get usage statistics' });
  }
});

// Premium AI features showcase
router.get('/premium-features', async (req, res) => {
  try {
    const premiumFeatures = {
      advanced_emotion_analysis: {
        name: 'Advanced Emotion Analysis',
        description: '127-emotion spectrum analysis with behavioral prediction',
        tier: 'pro',
        benefits: [
          'Deep emotional understanding',
          'Behavioral pattern recognition', 
          'Personalized optimization',
          'Cultural adaptation insights'
        ]
      },
      market_intelligence: {
        name: 'Market Intelligence',
        description: 'Real-time market analysis and competitive intelligence',
        tier: 'pro',
        benefits: [
          'Market trend prediction',
          'Competitor analysis',
          'Optimal timing recommendations',
          'Risk assessment'
        ]
      },
      token_performance_prediction: {
        name: 'Token Performance Prediction',
        description: 'AI-powered token success prediction and optimization',
        tier: 'pro',
        benefits: [
          'Performance scoring',
          'Viral potential analysis',
          'Price projection',
          'Launch strategy optimization'
        ]
      },
      api_access: {
        name: 'Enterprise API Access',
        description: 'Full API access to all AI capabilities',
        tier: 'enterprise',
        benefits: [
          'Bulk processing',
          'Custom integrations',
          'White-label solutions',
          'Priority processing'
        ]
      }
    };

    res.json({
      success: true,
      premiumFeatures,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get premium features error:', error);
    res.status(500).json({ error: 'Failed to get premium features' });
  }
});

export default router;