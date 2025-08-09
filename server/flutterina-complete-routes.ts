import { Router } from 'express';
import { flutterinaService } from './flutterina-ai-service';

const router = Router();

/**
 * Complete Flutterina API Routes - Phases 1-4 Implementation
 * Advanced AI chatbox with wallet-based memory, personality profiling, and smart recommendations
 */

/**
 * Create new conversation (Phase 1)
 */
router.post('/conversation', async (req, res) => {
  try {
    const { sessionId, currentPage, walletAddress, userIntent } = req.body;
    
    const conversation = await flutterinaService.createConversation(
      sessionId, 
      currentPage, 
      userIntent, 
      walletAddress
    );
    
    res.json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

/**
 * Send message and get AI response (Phases 1-3 integrated)
 */
router.post('/message', async (req, res) => {
  try {
    const { conversationId, message, messageType } = req.body;
    
    if (!conversationId || !message || !messageType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const response = await flutterinaService.sendMessage(conversationId, message, messageType);
    res.json(response);
  } catch (error: any) {
    console.error('Send message error:', error);
    
    if (error.message?.includes('token limit') || error.message?.includes('system disabled')) {
      return res.status(429).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to process message' });
  }
});

/**
 * Get smart assistance for conversation (Phase 4)
 */
router.get('/smart-assistance/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const conversation = await flutterinaService.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const smartAssistance = await flutterinaService.getSmartAssistance(conversation);
    res.json(smartAssistance);
  } catch (error) {
    console.error('Smart assistance error:', error);
    res.status(500).json({ error: 'Failed to get smart assistance' });
  }
});

/**
 * Get user personality profile (Phase 3)
 */
router.get('/personality/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Find user by wallet address to get userId
    const userId = walletAddress; // In this implementation, wallet address serves as userId
    
    const profile = await flutterinaService.getPersonalityProfile(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Personality profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Get personality profile error:', error);
    res.status(500).json({ error: 'Failed to get personality profile' });
  }
});

/**
 * Get personalized recommendations (Phase 4)
 */
router.get('/recommendations/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const conversation = await flutterinaService.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const recommendations = await flutterinaService.generatePersonalizedRecommendations(conversation);
    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

/**
 * Update user preferences (Phase 3)
 */
router.post('/preferences/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { preferences } = req.body;
    
    const userId = walletAddress;
    await flutterinaService.updateUserPreferences(userId, preferences);
    
    res.json({ success: true, message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

/**
 * Get conversation history
 */
router.get('/conversation/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50 } = req.query;
    
    const messages = await flutterinaService.getConversationMessages(conversationId, Number(limit));
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

/**
 * Get user's conversation history
 */
router.get('/user/:walletAddress/conversations', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const conversations = await flutterinaService.getUserConversations(walletAddress);
    res.json(conversations);
  } catch (error) {
    console.error('Get user conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

/**
 * System health check
 */
router.get('/health', async (req, res) => {
  try {
    const systemEnabled = await flutterinaService.checkSystemEnabled();
    const stats = await flutterinaService.getUsageStats();
    
    res.json({
      status: systemEnabled ? 'online' : 'offline',
      systemEnabled,
      uptime: process.uptime(),
      usage: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

/**
 * User usage statistics
 */
router.get('/usage/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const userId = walletAddress;
    
    const stats = await flutterinaService.getUsageStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({ error: 'Failed to get usage statistics' });
  }
});

export default router;