import type { Express } from "express";
import { DynamicPricingAI } from "./dynamic-pricing-ai";
import { ViralAmplificationAI } from "./viral-amplification-ai";
import { SelfOptimizingPlatform } from "./self-optimizing-platform";

const dynamicPricing = new DynamicPricingAI();
const viralAmplification = new ViralAmplificationAI();
const selfOptimizing = new SelfOptimizingPlatform();

export function registerNextGenAIRoutes(app: Express) {
  
  // DYNAMIC PRICING AI ROUTES
  app.post("/api/ai/dynamic-pricing/calculate", async (req, res) => {
    try {
      const { userId, productType, currentPrice, userBehavior, marketConditions } = req.body;
      
      const pricingResult = await dynamicPricing.calculateOptimalPrice({
        userId,
        productType,
        currentPrice,
        userBehavior,
        marketConditions,
        demandLevel: req.body.demandLevel || 'medium',
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay()
      });
      
      res.json({
        success: true,
        pricing: pricingResult,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Dynamic pricing calculation error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to calculate optimal pricing",
        fallback: {
          suggestedPrice: req.body.currentPrice || 1.0,
          reasoning: "Using fallback pricing due to calculation error"
        }
      });
    }
  });

  app.post("/api/ai/dynamic-pricing/batch", async (req, res) => {
    try {
      const { pricingContexts } = req.body;
      
      const batchResults = await dynamicPricing.getBatchPricingRecommendations(pricingContexts);
      
      res.json({
        success: true,
        results: batchResults,
        totalRecommendations: batchResults.length
      });
    } catch (error) {
      console.error("Batch pricing calculation error:", error);
      res.status(500).json({ success: false, error: "Failed to calculate batch pricing" });
    }
  });

  app.post("/api/ai/dynamic-pricing/track", async (req, res) => {
    try {
      const { productType, price, conversion } = req.body;
      
      await dynamicPricing.trackPricingPerformance(productType, price, conversion);
      
      res.json({ success: true, message: "Pricing performance tracked" });
    } catch (error) {
      console.error("Pricing tracking error:", error);
      res.status(500).json({ success: false, error: "Failed to track pricing performance" });
    }
  });

  // VIRAL AMPLIFICATION AI ROUTES
  app.post("/api/ai/viral/generate", async (req, res) => {
    try {
      const { topic, platforms, targetAudience, tone } = req.body;
      
      const results = [];
      const platformsToUse = platforms || ['twitter', 'instagram', 'tiktok'];
      
      for (const platform of platformsToUse) {
        const viralContent = await viralAmplification.generateViralContent(
          topic, 
          platform, 
          { targetAudience, tone }
        );
        results.push({
          platform,
          ...viralContent
        });
      }
      
      res.json({
        success: true,
        results,
        summary: {
          totalContent: results.length,
          platforms: platformsToUse,
          averageViralScore: results.reduce((sum, r) => sum + r.viralScore, 0) / results.length
        }
      });
    } catch (error) {
      console.error("Viral generation error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to generate viral content",
        fallback: {
          results: [
            {
              platform: 'twitter',
              content: `🚀 ${req.body.topic || 'Innovation'} is changing everything! What do you think? 💭`,
              hashtags: ['#viral', '#trending', '#innovation'],
              viralScore: 75
            }
          ]
        }
      });
    }
  });

  app.post("/api/ai/viral/generate-content", async (req, res) => {
    try {
      const { topic, platform, userContext } = req.body;
      
      const viralContent = await viralAmplification.generateViralContent(topic, platform, userContext);
      
      res.json({
        success: true,
        content: viralContent,
        optimizationTips: [
          `Post at optimal time for ${platform}`,
          "Use trending hashtags for maximum reach",
          "Engage with comments within first hour",
          "Cross-promote on other platforms"
        ]
      });
    } catch (error) {
      console.error("Viral content generation error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to generate viral content",
        fallback: {
          content: `🚀 ${req.body.topic || 'Innovation'} is changing everything! What do you think? 💭`,
          hashtags: ['#viral', '#trending', '#innovation']
        }
      });
    }
  });

  app.post("/api/ai/viral/create-campaign", async (req, res) => {
    try {
      const { campaignGoal, duration = 7 } = req.body;
      
      const campaign = await viralAmplification.createViralCampaign(campaignGoal, duration);
      
      res.json({
        success: true,
        campaign,
        summary: {
          totalContent: campaign.content.length,
          platforms: [...new Set(campaign.content.map(c => c.platform))],
          averageViralScore: campaign.content.reduce((sum, c) => sum + c.viralScore, 0) / campaign.content.length,
          duration: `${duration} days`
        }
      });
    } catch (error) {
      console.error("Viral campaign creation error:", error);
      res.status(500).json({ success: false, error: "Failed to create viral campaign" });
    }
  });

  app.post("/api/ai/viral/track-performance", async (req, res) => {
    try {
      const { contentId, engagement } = req.body;
      
      await viralAmplification.trackViralPerformance(contentId, engagement);
      
      res.json({ 
        success: true, 
        message: "Viral performance tracked",
        nextOptimizations: [
          "Analyze top-performing content patterns",
          "Adjust posting schedule based on engagement",
          "Optimize hashtag strategy",
          "Create similar high-performing content"
        ]
      });
    } catch (error) {
      console.error("Viral tracking error:", error);
      res.status(500).json({ success: false, error: "Failed to track viral performance" });
    }
  });

  // SELF-OPTIMIZING PLATFORM ROUTES
  app.post("/api/ai/optimization/analyze", async (req, res) => {
    try {
      const { metrics } = req.body;
      
      const recommendations = await selfOptimizing.analyzePerformance(metrics);
      
      res.json({
        success: true,
        recommendations,
        summary: {
          totalRecommendations: recommendations.length,
          criticalIssues: recommendations.filter(r => r.priority === 'Critical').length,
          highPriority: recommendations.filter(r => r.priority === 'High').length,
          estimatedImpact: recommendations.reduce((sum, r) => {
            const impact = parseInt(r.potentialROI.match(/\d+/)?.[0] || '0');
            return sum + impact;
          }, 0)
        }
      });
    } catch (error) {
      console.error("Performance analysis error:", error);
      res.status(500).json({ success: false, error: "Failed to analyze performance" });
    }
  });

  app.post("/api/ai/optimization/implement", async (req, res) => {
    try {
      const { recommendation } = req.body;
      
      const implementation = await selfOptimizing.implementOptimization(recommendation);
      
      res.json({
        success: implementation.success,
        implementation,
        nextSteps: [
          "Monitor implementation metrics",
          "Run A/B test if applicable",
          "Track performance improvements",
          "Apply learnings to future optimizations"
        ]
      });
    } catch (error) {
      console.error("Optimization implementation error:", error);
      res.status(500).json({ success: false, error: "Failed to implement optimization" });
    }
  });

  app.get("/api/ai/optimization/continuous", async (req, res) => {
    try {
      const result = await selfOptimizing.runContinuousOptimization();
      
      res.json({
        success: true,
        optimization: result,
        insights: [
          `Applied ${result.optimizationsApplied} automatic optimizations`,
          `Achieved ${result.performanceImprovement.toFixed(1)}% performance improvement`,
          `${result.nextRecommendations.length} recommendations require manual review`,
          "Platform is continuously learning and improving"
        ]
      });
    } catch (error) {
      console.error("Continuous optimization error:", error);
      res.status(500).json({ success: false, error: "Failed to run continuous optimization" });
    }
  });

  app.get("/api/ai/optimization/dashboard", async (req, res) => {
    try {
      const dashboard = await selfOptimizing.getOptimizationDashboard();
      
      res.json({
        success: true,
        dashboard,
        status: "Platform self-optimization active",
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Optimization dashboard error:", error);
      res.status(500).json({ success: false, error: "Failed to load optimization dashboard" });
    }
  });

  // COMBINED INTELLIGENCE ENDPOINT
  app.post("/api/ai/next-gen/full-analysis", async (req, res) => {
    try {
      const { userId, productType, currentPrice, topic, platform, metrics } = req.body;
      
      // Run all three AI systems simultaneously
      const [pricingResult, viralContent, optimizationRecommendations] = await Promise.all([
        dynamicPricing.calculateOptimalPrice({
          userId,
          productType,
          currentPrice,
          demandLevel: 'medium',
          timeOfDay: new Date().getHours(),
          dayOfWeek: new Date().getDay()
        }),
        viralAmplification.generateViralContent(topic || productType, platform || 'twitter'),
        selfOptimizing.analyzePerformance(metrics || {
          conversionRate: 0.15,
          userEngagement: 0.65,
          pageLoadTime: 2.5,
          bounceRate: 0.45,
          userSatisfaction: 0.75,
          revenuePerUser: 25.0
        })
      ]);
      
      const combinedROI = 
        parseInt(pricingResult.revenueImpact.match(/\d+/)?.[0] || '25') +
        (viralContent.viralScore > 75 ? 100 : 50) +
        optimizationRecommendations.reduce((sum, r) => {
          return sum + parseInt(r.potentialROI.match(/\d+/)?.[0] || '0');
        }, 0);
      
      res.json({
        success: true,
        analysis: {
          pricing: pricingResult,
          viral: viralContent,
          optimization: optimizationRecommendations.slice(0, 3)
        },
        summary: {
          combinedROI: `${combinedROI}%`,
          implementationTime: "2-6 weeks",
          expectedRevenue: `+$${Math.round(combinedROI * 100)}K ARR`,
          confidence: "High (85%+)"
        },
        recommendations: [
          "Implement dynamic pricing immediately for instant revenue boost",
          "Launch viral campaign for organic growth acceleration",
          "Apply top optimization recommendations for conversion improvement",
          "Monitor all three systems for compound growth effects"
        ]
      });
    } catch (error) {
      console.error("Full AI analysis error:", error);
      res.status(500).json({ success: false, error: "Failed to run full AI analysis" });
    }
  });
}