import type { Express } from "express";
import { flutterinaService } from "./flutterina-ai-service";
import { storage } from "./storage";
import { 
  insertFlutterinaConversationSchema,
  insertFlutterinaMessageSchema 
} from "@shared/schema";

export function registerFlutterinaRoutes(app: Express) {
  
  /**
   * PHASE 1: Basic floating chat with page context
   */
  
  // Get or create conversation for a session
  app.get("/api/flutterina/conversation/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { page } = req.query;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      const currentPage = (page as string) || "/";
      
      // Try to get user context if available
      const userId = req.user?.claims?.sub;
      const walletAddress = req.user?.claims?.wallet_address;
      
      const conversation = await flutterinaService.createOrGetConversation(
        sessionId,
        currentPage,
        userId,
        walletAddress
      );
      
      res.json(conversation);
    } catch (error) {
      console.error("Error getting conversation:", error);
      res.status(500).json({ message: "Failed to get conversation" });
    }
  });

  // Get messages for a conversation
  app.get("/api/flutterina/messages/:conversationId", async (req, res) => {
    try {
      const { conversationId } = req.params;
      
      if (!conversationId) {
        return res.status(400).json({ message: "Conversation ID is required" });
      }

      const messages = await storage.getFlutterinaMessages(conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  // Send a message
  app.post("/api/flutterina/messages", async (req, res) => {
    try {
      const { message, pageContext, sessionId, actionContext } = req.body;
      
      if (!message?.trim()) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      // Get user context if available
      const userId = req.user?.claims?.sub;
      const walletAddress = req.user?.claims?.wallet_address;
      
      // Get or create conversation
      const conversation = await flutterinaService.createOrGetConversation(
        sessionId,
        pageContext || "/",
        userId,
        walletAddress
      );

      // Get recent message history for context
      const messageHistory = await storage.getFlutterinaMessages(conversation.id, 10);
      
      // Save user message
      const userMessage = await flutterinaService.saveMessage(
        conversation.id,
        message,
        "user",
        pageContext || "/",
        actionContext || {}
      );

      // Generate AI response
      const aiResponseData = await flutterinaService.generateResponse(
        message,
        conversation,
        messageHistory
      );

      // Save AI response
      const aiMessage = await flutterinaService.saveMessage(
        conversation.id,
        aiResponseData.response,
        "assistant",
        pageContext || "/",
        actionContext || {},
        {
          containsRecommendations: aiResponseData.containsRecommendations,
          recommendationData: aiResponseData.recommendationData,
          tokenUsage: aiResponseData.tokenUsage,
          responseTime: 500 // Approximate response time
        }
      );

      res.json({
        userMessage,
        aiMessage,
        conversation
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Get conversation analytics (for admin/monitoring)
  app.get("/api/flutterina/analytics", async (req, res) => {
    try {
      // Basic analytics for Phase 1
      const analytics = await storage.getFlutterinaAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error getting analytics:", error);
      res.status(500).json({ message: "Failed to get analytics" });
    }
  });

  // Health check endpoint
  app.get("/api/flutterina/health", async (req, res) => {
    try {
      const health = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        features: {
          phase1: "active", // Basic floating chat with page context
          phase2: "planned", // Wallet intelligence integration
          phase3: "planned", // Advanced personalization  
          phase4: "planned"  // Product recommendations and friendship
        },
        openai: !!process.env.OPENAI_API_KEY
      };
      
      res.json(health);
    } catch (error) {
      console.error("Error checking health:", error);
      res.status(500).json({ message: "Health check failed" });
    }
  });
}