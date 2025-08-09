// Cost-Effective AI Routes - Maximum Value Features
import type { Express } from "express";
import { costEffectiveAI } from "./cost-effective-ai-features";
import { queryOptimizer } from "./performance-optimizer";

// Optimized response helper
function optimizedResponse(res: any, data: any, cacheSeconds: number = 60) {
  res.set('Cache-Control', `public, max-age=${cacheSeconds}`);
  return res.json(data);
}

export function registerCostEffectiveAIRoutes(app: Express) {
  console.log("💡 Initializing Cost-Effective AI Features...");

  // 1. Smart Token Naming
  app.post("/api/ai/generate-token-name", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ 
          success: false, 
          error: "Description is required" 
        });
      }

      const tokenName = await costEffectiveAI.generateTokenName(description);
      
      return optimizedResponse(res, {
        success: true,
        tokenName,
        description,
        timestamp: new Date().toISOString()
      }, 180);

    } catch (error) {
      console.error("❌ Token name generation error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to generate token name"
      });
    }
  });

  // 2. Emotion Detection
  app.post("/api/ai/detect-emotion", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ 
          success: false, 
          error: "Text is required" 
        });
      }

      const emotion = await costEffectiveAI.detectEmotionFromText(text);
      
      return optimizedResponse(res, {
        success: true,
        text,
        emotion,
        timestamp: new Date().toISOString()
      }, 60);

    } catch (error) {
      console.error("❌ Emotion detection error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to detect emotion"
      });
    }
  });

  // 3. Hashtag Generation
  app.post("/api/ai/generate-hashtags", async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ 
          success: false, 
          error: "Content is required" 
        });
      }

      const hashtags = await costEffectiveAI.generateHashtags(content);
      
      return optimizedResponse(res, {
        success: true,
        content,
        hashtags,
        timestamp: new Date().toISOString()
      }, 120);

    } catch (error) {
      console.error("❌ Hashtag generation error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to generate hashtags"
      });
    }
  });

  // 4. Content Categorization
  app.post("/api/ai/categorize-content", async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ 
          success: false, 
          error: "Content is required" 
        });
      }

      const categorization = await costEffectiveAI.categorizeContent(content);
      
      return optimizedResponse(res, {
        success: true,
        content,
        categorization,
        timestamp: new Date().toISOString()
      }, 240);

    } catch (error) {
      console.error("❌ Content categorization error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to categorize content"
      });
    }
  });

  // 5. Sentiment Analysis
  app.post("/api/ai/analyze-sentiment", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ 
          success: false, 
          error: "Text is required" 
        });
      }

      const sentiment = await costEffectiveAI.analyzeSentiment(text);
      
      return optimizedResponse(res, {
        success: true,
        text,
        sentiment,
        timestamp: new Date().toISOString()
      }, 60);

    } catch (error) {
      console.error("❌ Sentiment analysis error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to analyze sentiment"
      });
    }
  });

  // 6. Reply Suggestions
  app.post("/api/ai/suggest-replies", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          success: false, 
          error: "Message is required" 
        });
      }

      const suggestions = await costEffectiveAI.generateReplySuggestions(message, context);
      
      return optimizedResponse(res, {
        success: true,
        originalMessage: message,
        context,
        suggestions,
        timestamp: new Date().toISOString()
      }, 30);

    } catch (error) {
      console.error("❌ Reply suggestions error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to generate reply suggestions"
      });
    }
  });

  // 7. Content Quality Scoring
  app.post("/api/ai/score-content", async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ 
          success: false, 
          error: "Content is required" 
        });
      }

      const qualityScore = await costEffectiveAI.scoreContent(content);
      
      return optimizedResponse(res, {
        success: true,
        content,
        qualityScore,
        timestamp: new Date().toISOString()
      }, 180);

    } catch (error) {
      console.error("❌ Content scoring error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to score content"
      });
    }
  });

  // 8. Auto-Complete
  app.post("/api/ai/auto-complete", async (req, res) => {
    try {
      const { partialText, maxLength = 50 } = req.body;
      
      if (!partialText) {
        return res.status(400).json({ 
          success: false, 
          error: "Partial text is required" 
        });
      }

      const completion = await costEffectiveAI.autoComplete(partialText, maxLength);
      
      return optimizedResponse(res, {
        success: true,
        partialText,
        completion,
        fullText: partialText + completion,
        timestamp: new Date().toISOString()
      }, 15);

    } catch (error) {
      console.error("❌ Auto-complete error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to auto-complete text"
      });
    }
  });

  // 9. Trend Analysis
  app.post("/api/ai/analyze-trends", async (req, res) => {
    try {
      const { keywords } = req.body;
      
      if (!keywords || !Array.isArray(keywords)) {
        return res.status(400).json({ 
          success: false, 
          error: "Keywords array is required" 
        });
      }

      const trendAnalysis = await costEffectiveAI.analyzeTrends(keywords);
      
      return optimizedResponse(res, {
        success: true,
        keywords,
        trendAnalysis,
        timestamp: new Date().toISOString()
      }, 360);

    } catch (error) {
      console.error("❌ Trend analysis error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to analyze trends"
      });
    }
  });

  // 10. Content Summarization
  app.post("/api/ai/summarize-content", async (req, res) => {
    try {
      const { content, maxSentences = 3 } = req.body;
      
      if (!content) {
        return res.status(400).json({ 
          success: false, 
          error: "Content is required" 
        });
      }

      const summary = await costEffectiveAI.summarizeContent(content, maxSentences);
      
      return optimizedResponse(res, {
        success: true,
        originalContent: content,
        summary,
        timestamp: new Date().toISOString()
      }, 120);

    } catch (error) {
      console.error("❌ Content summarization error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to summarize content"
      });
    }
  });

  // AI Usage Statistics
  app.get("/api/ai/usage-stats", async (req, res) => {
    try {
      const stats = costEffectiveAI.getUsageStats();
      
      return optimizedResponse(res, {
        success: true,
        stats,
        timestamp: new Date().toISOString()
      }, 60);

    } catch (error) {
      console.error("❌ Usage stats error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve usage statistics"
      });
    }
  });

  // Bulk AI Processing - Cost optimization through batching
  app.post("/api/ai/bulk-process", async (req, res) => {
    try {
      const { items, operations } = req.body;
      
      if (!items || !Array.isArray(items) || !operations || !Array.isArray(operations)) {
        return res.status(400).json({ 
          success: false, 
          error: "Items array and operations array are required" 
        });
      }

      const results = [];
      
      for (const item of items.slice(0, 10)) { // Limit to 10 items for cost control
        const itemResults = {};
        
        for (const operation of operations) {
          try {
            switch (operation) {
              case 'emotion':
                itemResults[operation] = await costEffectiveAI.detectEmotionFromText(item.text || item.content || '');
                break;
              case 'sentiment':
                itemResults[operation] = await costEffectiveAI.analyzeSentiment(item.text || item.content || '');
                break;
              case 'hashtags':
                itemResults[operation] = await costEffectiveAI.generateHashtags(item.text || item.content || '');
                break;
              case 'categorize':
                itemResults[operation] = await costEffectiveAI.categorizeContent(item.text || item.content || '');
                break;
              case 'quality':
                itemResults[operation] = await costEffectiveAI.scoreContent(item.text || item.content || '');
                break;
            }
          } catch (opError) {
            itemResults[operation] = { error: "Processing failed" };
          }
        }
        
        results.push({
          item,
          results: itemResults
        });
      }
      
      return optimizedResponse(res, {
        success: true,
        processedItems: results.length,
        results,
        timestamp: new Date().toISOString()
      }, 60);

    } catch (error) {
      console.error("❌ Bulk processing error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to process items in bulk"
      });
    }
  });

  // Clear expired cache (maintenance endpoint)
  app.post("/api/ai/clear-cache", async (req, res) => {
    try {
      costEffectiveAI.clearExpiredCache();
      
      return res.json({
        success: true,
        message: "Expired cache entries cleared",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("❌ Cache clearing error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to clear cache"
      });
    }
  });

  console.log("✅ Cost-Effective AI Features activated!");
  console.log("💡 Features: Token naming, emotion detection, hashtags, categorization");
  console.log("📊 Analytics: Sentiment analysis, quality scoring, trend analysis");
  console.log("🚀 Productivity: Auto-complete, reply suggestions, summarization");
  console.log("💰 Cost optimized: Smart caching, batch processing, minimal token usage");
}