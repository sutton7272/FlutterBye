import type { Express } from "express";
import { skyeEnhancedIntelligence } from "./skye-enhanced-intelligence";
import { storage } from "./storage";

/**
 * Enhanced Skye AI Routes with Memory and Emotional Intelligence
 */
export function registerSkyeEnhancedRoutes(app: Express) {

  // Enhanced Chat endpoint with emotional intelligence
  app.post('/api/skye/enhanced-chat', async (req, res) => {
    try {
      const { message, userId, walletAddress, conversationId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Analyze emotional state
      const emotionalAnalysis = await skyeEnhancedIntelligence.analyzeEmotionalState(
        userId || 'anonymous',
        message,
        conversationId || `conv_${Date.now()}`,
        0 // response time would be calculated in real implementation
      );

      // Get or create user memory
      let userMemory = null;
      if (userId && walletAddress) {
        userMemory = await skyeEnhancedIntelligence.getUserMemory(userId, walletAddress);
        if (!userMemory) {
          userMemory = await skyeEnhancedIntelligence.createUserMemory(userId, walletAddress);
        }
      }

      // Generate personalized response
      const personalizedResponse = await skyeEnhancedIntelligence.generatePersonalizedResponse(
        message,
        userMemory,
        emotionalAnalysis,
        { platform: 'flutterbye', feature: 'chat' }
      );

      // Update user memory with conversation insights
      if (userMemory && emotionalAnalysis) {
        await skyeEnhancedIntelligence.updateUserMemory(
          userId,
          walletAddress,
          {
            topics: [message.substring(0, 50)], // simplified topic extraction
            mood: emotionalAnalysis.overallMood || 'neutral',
            keyOutcomes: ['ai_assistance_provided']
          }
        );
      }

      res.json({
        success: true,
        response: personalizedResponse.response,
        emotionalAnalysis: {
          emotion: emotionalAnalysis?.detectedEmotion,
          mood: emotionalAnalysis?.overallMood,
          sentiment: emotionalAnalysis?.sentimentLabel,
          adaptedPersonality: personalizedResponse.adaptedPersonality
        },
        memory: {
          interactionCount: userMemory?.totalInteractions || 0,
          knownInterests: userMemory?.interests?.slice(0, 3) || [],
          trustLevel: userMemory?.trustLevel || 5
        }
      });

    } catch (error) {
      console.error("Enhanced chat error:", error);
      res.status(500).json({ error: "Failed to process enhanced chat request" });
    }
  });

  // Get user memory profile
  app.get('/api/skye/memory/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { walletAddress } = req.query;

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address is required" });
      }

      const userMemory = await skyeEnhancedIntelligence.getUserMemory(userId, walletAddress as string);
      
      if (!userMemory) {
        return res.json({
          success: true,
          memory: null,
          message: "No memory profile found for this user"
        });
      }

      // Return sanitized memory data
      res.json({
        success: true,
        memory: {
          preferredName: userMemory.preferredName,
          communicationStyle: userMemory.communicationStyle,
          interests: userMemory.interests,
          goals: userMemory.goals,
          trustLevel: userMemory.trustLevel,
          totalInteractions: userMemory.totalInteractions,
          lastInteraction: userMemory.lastInteraction,
          recentTopics: userMemory.conversationHistory?.slice(-5).map(c => c.topics).flat() || []
        }
      });

    } catch (error) {
      console.error("Memory retrieval error:", error);
      res.status(500).json({ error: "Failed to retrieve user memory" });
    }
  });

  // Predict user needs
  app.post('/api/skye/predict-needs', async (req, res) => {
    try {
      const { userId, walletAddress } = req.body;

      if (!userId || !walletAddress) {
        return res.status(400).json({ error: "User ID and wallet address are required" });
      }

      const userMemory = await skyeEnhancedIntelligence.getUserMemory(userId, walletAddress);
      
      if (!userMemory) {
        return res.json({
          success: true,
          predictions: ["Getting started with Flutterbye", "Wallet analysis", "Token creation"],
          message: "Default predictions for new user"
        });
      }

      const predictions = await skyeEnhancedIntelligence.predictUserNeeds(userMemory);

      res.json({
        success: true,
        predictions,
        confidence: userMemory.totalInteractions > 5 ? "high" : "medium"
      });

    } catch (error) {
      console.error("Prediction error:", error);
      res.status(500).json({ error: "Failed to predict user needs" });
    }
  });

  // Emotional analysis endpoint
  app.post('/api/skye/analyze-emotion', async (req, res) => {
    try {
      const { message, userId, conversationId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const analysis = await skyeEnhancedIntelligence.analyzeEmotionalState(
        userId || 'anonymous',
        message,
        conversationId || `analysis_${Date.now()}`
      );

      res.json({
        success: true,
        analysis: {
          emotion: analysis?.detectedEmotion,
          confidence: analysis?.emotionConfidence,
          intensity: analysis?.emotionIntensity,
          sentiment: analysis?.sentimentLabel,
          sentimentScore: analysis?.sentimentScore,
          mood: analysis?.overallMood,
          recommendedApproach: analysis?.recommendedApproach,
          adaptedPersonality: analysis?.adaptedPersonality
        }
      });

    } catch (error) {
      console.error("Emotional analysis error:", error);
      res.status(500).json({ error: "Failed to analyze emotional state" });
    }
  });

  // Test endpoint for enhanced features
  app.get('/api/skye/enhanced-status', async (req, res) => {
    try {
      res.json({
        success: true,
        features: {
          emotionalIntelligence: true,
          deepLearningMemory: true,
          personalizedResponses: true,
          conversationThreads: true,
          predictiveAnalytics: true
        },
        status: "Enhanced Skye AI system operational",
        version: "2.0.0-enhanced"
      });
    } catch (error) {
      res.status(500).json({ error: "Enhanced system status check failed" });
    }
  });
}