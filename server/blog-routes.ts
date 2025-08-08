import type { Express } from "express";
import { db } from "./db";
import { blogPosts, blogCategories, blogSchedules, blogAnalytics, blogTitleVariations } from "@shared/schema";
import { eq, desc, and, sql, like } from "drizzle-orm";
import { blogService } from "./openai-blog-service";
import type { BlogGenerationRequest } from "./openai-blog-service";
import { databaseOptimizer } from "./database-optimizer";
import { aiCostOptimizer } from "./ai-cost-optimizer";
import { fastCache, responseTimeMonitor } from "./performance-optimizer";

/**
 * Blog API Routes for FlutterBlog Bot System
 */
export function registerBlogRoutes(app: Express) {
  
  // ================== BLOG POSTS CRUD ==================
  
  /**
   * Get all blog posts with pagination and filtering - PERFORMANCE OPTIMIZED
   */
  app.get("/api/blog/posts", fastCache(30000), responseTimeMonitor, async (req, res) => {
    try {
      const start = Date.now();
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 20); // Reduced limit
      const offset = parseInt(req.query.offset as string) || 0;
      const status = req.query.status as string || undefined;
      
      // Simplified query for better performance
      const posts = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          content: sql<string>`SUBSTR(${blogPosts.content}, 1, 500)`, // Limit content for performance
          excerpt: blogPosts.excerpt,
          status: blogPosts.status,
          createdAt: blogPosts.createdAt,
          tone: blogPosts.tone,
          contentType: blogPosts.contentType,
          keywords: blogPosts.keywords,
          seoScore: blogPosts.seoScore,
          readabilityScore: blogPosts.readabilityScore,
          engagementPotential: blogPosts.engagementPotential
        })
        .from(blogPosts)
        .where(status ? eq(blogPosts.status, status) : undefined)
        .orderBy(desc(blogPosts.createdAt))
        .limit(limit);
      
      const responseTime = Date.now() - start;
      res.setHeader('X-Response-Time', `${responseTime}ms`);
      res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
      
      res.json({ posts });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });
  
  /**
   * Get published blog posts for public display (landing page)
   */
  app.get("/api/blog/published", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      
      const posts = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          featuredImage: blogPosts.featuredImage,
          publishedAt: blogPosts.publishedAt,
          viewCount: blogPosts.viewCount,
          avgReadTime: blogPosts.avgReadTime
        })
        .from(blogPosts)
        .where(eq(blogPosts.status, 'published'))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit);
      
      res.json({ posts });
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      res.status(500).json({ error: "Failed to fetch published blog posts" });
    }
  });
  
  /**
   * Get single blog post by slug
   */
  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      const post = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1);
      
      if (!post.length) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      // Increment view count
      await db
        .update(blogPosts)
        .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
        .where(eq(blogPosts.id, post[0].id));
      
      res.json({ post: post[0] });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });
  
  /**
   * Create new blog post
   */
  app.post("/api/blog/posts", async (req, res) => {
    try {
      const postData = req.body;
      
      // Generate slug from title if not provided
      if (!postData.slug) {
        postData.slug = postData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      const [newPost] = await db
        .insert(blogPosts)
        .values(postData)
        .returning();
      
      res.status(201).json({ post: newPost });
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });
  
  /**
   * Update blog post
   */
  app.put("/api/blog/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };
      
      const [updatedPost] = await db
        .update(blogPosts)
        .set(updateData)
        .where(eq(blogPosts.id, id))
        .returning();
      
      if (!updatedPost) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json({ post: updatedPost });
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });
  
  /**
   * Delete blog post
   */
  app.delete("/api/blog/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });
  
  // ================== AI CONTENT GENERATION ==================
  
  /**
   * Generate blog content using AI
   */
  app.post("/api/blog/generate", async (req, res) => {
    try {
      const request: BlogGenerationRequest = req.body;
      
      if (!request.topic) {
        return res.status(400).json({ error: "Topic is required" });
      }
      
      // Generate content using OpenAI
      const result = await blogService.generateBlogContent(request);
      
      // Generate SEO optimization
      const seoOptimization = await blogService.optimizeForSEO(
        result.content, 
        request.keywords?.[0] || request.topic
      );
      
      // Analyze content quality
      const analysis = await blogService.analyzeContent(result.content);
      
      // Create slug from title
      const slug = result.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Create draft blog post
      const [newPost] = await db.insert(blogPosts).values({
        title: result.title,
        slug: slug,
        excerpt: result.excerpt,
        content: result.content,
        metaDescription: seoOptimization.metaDescription,
        keywords: seoOptimization.keywords,
        tone: request.tone,
        targetAudience: request.targetAudience,
        contentType: request.contentType,
        readabilityScore: analysis.readabilityScore,
        seoScore: analysis.seoScore,
        engagementPotential: analysis.engagementPotential,
        aiRecommendations: analysis.recommendations,
        seoTitle: seoOptimization.title,
        internalLinks: seoOptimization.internalLinkSuggestions,
        headingStructure: seoOptimization.headings,
        generatedByAI: true,
        aiPrompt: JSON.stringify(request),
        aiModel: "gpt-4o",
        aiGeneratedAt: new Date(),
        status: "draft"
      }).returning();
      
      res.json({
        post: newPost,
        analysis,
        seoOptimization
      });
    } catch (error) {
      console.error("Error generating blog content:", error);
      res.status(500).json({ error: "Failed to generate blog content" });
    }
  });
  
  /**
   * Generate title variations for A/B testing
   */
  app.post("/api/blog/generate-titles", async (req, res) => {
    try {
      const { topic, keyword, count = 5 } = req.body;
      
      if (!topic || !keyword) {
        return res.status(400).json({ error: "Topic and keyword are required" });
      }
      
      const titles = await blogService.generateTitleVariations(topic, keyword, count);
      
      res.json({ titles });
    } catch (error) {
      console.error("Error generating title variations:", error);
      res.status(500).json({ error: "Failed to generate title variations" });
    }
  });
  
  /**
   * Get trending topic suggestions
   */
  app.get("/api/blog/trending-topics", async (req, res) => {
    try {
      const category = req.query.category as string || 'blockchain';
      
      const topics = await blogService.suggestTrendingTopics(category);
      
      res.json({ topics });
    } catch (error) {
      console.error("Error getting trending topics:", error);
      res.status(500).json({ error: "Failed to get trending topics" });
    }
  });
  
  /**
   * Enhance existing blog content
   */
  app.post("/api/blog/enhance/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { improvements } = req.body;
      
      if (!improvements || !Array.isArray(improvements)) {
        return res.status(400).json({ error: "Improvements array is required" });
      }
      
      // Get current post
      const post = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      
      if (!post.length) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      // Enhance content
      const enhancedContent = await blogService.enhanceContent(post[0].content, improvements);
      
      // Update post with enhanced content
      const [updatedPost] = await db
        .update(blogPosts)
        .set({ 
          content: enhancedContent,
          updatedAt: new Date()
        })
        .where(eq(blogPosts.id, id))
        .returning();
      
      res.json({ post: updatedPost });
    } catch (error) {
      console.error("Error enhancing blog content:", error);
      res.status(500).json({ error: "Failed to enhance blog content" });
    }
  });
  
  // ================== BLOG CATEGORIES ==================
  
  /**
   * Get all blog categories
   */
  app.get("/api/blog/categories", async (req, res) => {
    try {
      const categories = await db
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.isActive, true))
        .orderBy(blogCategories.sortOrder, blogCategories.name);
      
      res.json({ categories });
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      res.status(500).json({ error: "Failed to fetch blog categories" });
    }
  });
  
  /**
   * Create new blog category
   */
  app.post("/api/blog/categories", async (req, res) => {
    try {
      const categoryData = req.body;
      
      // Generate slug if not provided
      if (!categoryData.slug) {
        categoryData.slug = categoryData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      const [newCategory] = await db
        .insert(blogCategories)
        .values(categoryData)
        .returning();
      
      res.status(201).json({ category: newCategory });
    } catch (error) {
      console.error("Error creating blog category:", error);
      res.status(500).json({ error: "Failed to create blog category" });
    }
  });
  
  // ================== BLOG SCHEDULES ==================
  
  /**
   * Get all blog schedules - EMERGENCY FIX
   */
  app.get("/api/blog/schedules", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      
      // Use raw SQL to avoid Drizzle schema issues
      const schedules = await db.execute(
        sql`SELECT 
          id, name, is_active, frequency, next_run_at, 
          last_run_at, posts_generated, posts_published, 
          created_at, updated_at
        FROM blog_schedules 
        ORDER BY created_at DESC 
        LIMIT ${limit}`
      );
      
      res.json({ schedules: schedules.rows });
    } catch (error) {
      console.error("Error fetching blog schedules:", error);
      res.status(500).json({ error: "Failed to fetch blog schedules" });
    }
  });
  
  /**
   * Create new blog schedule
   */
  app.post("/api/blog/schedules", async (req, res) => {
    try {
      const scheduleData = req.body;
      
      const [newSchedule] = await db
        .insert(blogSchedules)
        .values(scheduleData)
        .returning();
      
      res.status(201).json({ schedule: newSchedule });
    } catch (error) {
      console.error("Error creating blog schedule:", error);
      res.status(500).json({ error: "Failed to create blog schedule" });
    }
  });
  
  /**
   * Update blog schedule
   */
  app.put("/api/blog/schedules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };
      
      const [updatedSchedule] = await db
        .update(blogSchedules)
        .set(updateData)
        .where(eq(blogSchedules.id, id))
        .returning();
      
      if (!updatedSchedule) {
        return res.status(404).json({ error: "Blog schedule not found" });
      }
      
      res.json({ schedule: updatedSchedule });
    } catch (error) {
      console.error("Error updating blog schedule:", error);
      res.status(500).json({ error: "Failed to update blog schedule" });
    }
  });
  
  // =====================================================
  // BUNDLE 2 AI ENHANCEMENT: Advanced API Routes
  // =====================================================

  /**
   * Advanced competitive analysis endpoint
   */
  app.post("/api/blog/analyze-competition", async (req, res) => {
    try {
      const { topic, competitors } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }
      
      const analysis = await blogService.analyzeCompetitorContent(topic, competitors || []);
      
      res.json({ 
        topic,
        analysis,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error analyzing competition:", error);
      res.status(500).json({ error: "Failed to analyze competition" });
    }
  });

  /**
   * AI-powered content trend prediction
   */
  app.post("/api/blog/predict-trends", async (req, res) => {
    try {
      const { industry } = req.body;
      
      const predictions = await blogService.predictContentTrends(industry || 'blockchain');
      
      res.json({
        industry: industry || 'blockchain',
        predictions,
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      });
    } catch (error) {
      console.error("Error predicting trends:", error);
      res.status(500).json({ error: "Failed to predict content trends" });
    }
  });

  /**
   * AI content performance prediction
   */
  app.post("/api/blog/predict-performance", async (req, res) => {
    try {
      const { content, targetAudience } = req.body;
      
      if (!content || !targetAudience) {
        return res.status(400).json({ error: "Content and target audience are required" });
      }
      
      const prediction = await blogService.predictContentPerformance(content, targetAudience);
      
      res.json({
        prediction,
        targetAudience,
        analyzedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error predicting performance:", error);
      res.status(500).json({ error: "Failed to predict content performance" });
    }
  });

  /**
   * Advanced SEO keyword research
   */
  app.post("/api/blog/advanced-keywords", async (req, res) => {
    try {
      const { topic, competitionLevel } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }
      
      const keywords = await blogService.generateAdvancedKeywords(
        topic, 
        competitionLevel || 'medium'
      );
      
      res.json({
        topic,
        competitionLevel: competitionLevel || 'medium',
        keywords,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating keywords:", error);
      res.status(500).json({ error: "Failed to generate advanced keywords" });
    }
  });

  /**
   * A/B testing title variations generator  
   */
  app.post("/api/blog/ab-title-variations", async (req, res) => {
    try {
      const { title, count } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
      
      const variations = await blogService.generateTitleVariations(title, count || 5);
      
      res.json({
        originalTitle: title,
        variations,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating title variations:", error);
      res.status(500).json({ error: "Failed to generate title variations" });
    }
  });

  // =====================================================
  // BUNDLE 3: Advanced Analytics & Automation API Routes
  // =====================================================

  /**
   * Advanced content performance analytics
   */
  app.post("/api/blog/analyze-performance", async (req, res) => {
    try {
      const posts = await db.select().from(blogPosts).limit(50);
      
      const analysis = await blogService.analyzeContentPerformance(posts);
      
      res.json({
        analysis,
        totalPosts: posts.length,
        analyzedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error analyzing content performance:", error);
      res.status(500).json({ error: "Failed to analyze content performance" });
    }
  });

  /**
   * Automated content strategy generation
   */
  app.post("/api/blog/generate-strategy", async (req, res) => {
    try {
      const { businessGoals, targetAudience, timeframe } = req.body;
      
      if (!businessGoals || !targetAudience) {
        return res.status(400).json({ error: "Business goals and target audience are required" });
      }
      
      const strategy = await blogService.generateContentStrategy(
        businessGoals,
        targetAudience,
        timeframe || 30
      );
      
      res.json({
        strategy,
        businessGoals,
        targetAudience,
        timeframe: timeframe || 30,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating content strategy:", error);
      res.status(500).json({ error: "Failed to generate content strategy" });
    }
  });

  /**
   * AI-powered content personalization
   */
  app.post("/api/blog/personalize-content", async (req, res) => {
    try {
      const { content, audienceSegment, personalityType } = req.body;
      
      if (!content || !audienceSegment || !personalityType) {
        return res.status(400).json({ 
          error: "Content, audience segment, and personality type are required" 
        });
      }
      
      const personalized = await blogService.personalizeContent(
        content,
        audienceSegment,
        personalityType
      );
      
      res.json({
        personalized,
        originalContent: content.substring(0, 200) + "...",
        audienceSegment,
        personalityType,
        processedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error personalizing content:", error);
      res.status(500).json({ error: "Failed to personalize content" });
    }
  });

  /**
   * Advanced SEO optimization engine
   */
  app.post("/api/blog/optimize-seo", async (req, res) => {
    try {
      const { content, targetKeywords, competitionLevel } = req.body;
      
      if (!content || !targetKeywords) {
        return res.status(400).json({ error: "Content and target keywords are required" });
      }
      
      const optimization = await blogService.optimizeForSEO(
        content,
        targetKeywords,
        competitionLevel || 'medium'
      );
      
      res.json({
        optimization,
        targetKeywords,
        competitionLevel: competitionLevel || 'medium',
        optimizedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error optimizing for SEO:", error);
      res.status(500).json({ error: "Failed to optimize for SEO" });
    }
  });

  /**
   * Automated distribution planning
   */
  app.post("/api/blog/distribution-plan", async (req, res) => {
    try {
      const { content, businessType, goals } = req.body;
      
      if (!content || !businessType || !goals) {
        return res.status(400).json({ 
          error: "Content, business type, and goals are required" 
        });
      }
      
      const plan = await blogService.generateDistributionPlan(
        content,
        businessType,
        goals
      );
      
      res.json({
        plan,
        businessType,
        goals,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating distribution plan:", error);
      res.status(500).json({ error: "Failed to generate distribution plan" });
    }
  });

  // =====================================================
  // BUNDLE 4: Enterprise Intelligence & Automation API Routes
  // =====================================================

  /**
   * Advanced business intelligence analytics
   */
  app.post("/api/blog/business-intelligence", async (req, res) => {
    try {
      const posts = await db.select().from(blogPosts).limit(100);
      const analytics = await db.select().from(blogAnalytics).limit(50);
      
      const performanceMetrics = {
        totalPosts: posts.length,
        avgReadabilityScore: posts.reduce((sum, p) => sum + (p.readabilityScore || 0), 0) / posts.length,
        avgSeoScore: posts.reduce((sum, p) => sum + (p.seoScore || 0), 0) / posts.length,
        totalViews: analytics.reduce((sum, a) => sum + (a.views || 0), 0)
      };
      
      const intelligence = await blogService.generateBusinessIntelligence(
        posts.slice(0, 20),
        performanceMetrics
      );
      
      res.json({
        intelligence,
        performanceMetrics,
        dataPoints: posts.length,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating business intelligence:", error);
      res.status(500).json({ error: "Failed to generate business intelligence" });
    }
  });

  /**
   * Automated workflow optimization
   */
  app.post("/api/blog/optimize-workflow", async (req, res) => {
    try {
      const { currentWorkflow, bottlenecks } = req.body;
      
      if (!currentWorkflow) {
        return res.status(400).json({ error: "Current workflow is required" });
      }
      
      const optimization = await blogService.optimizeContentWorkflow(
        currentWorkflow,
        bottlenecks || []
      );
      
      res.json({
        optimization,
        originalWorkflow: currentWorkflow,
        optimizedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error optimizing workflow:", error);
      res.status(500).json({ error: "Failed to optimize workflow" });
    }
  });

  /**
   * Predictive analytics for content performance
   */
  app.post("/api/blog/predict-future-performance", async (req, res) => {
    try {
      const posts = await db.select().from(blogPosts).limit(50);
      const analytics = await db.select().from(blogAnalytics).limit(100);
      
      const { marketTrends } = req.body;
      
      const historicalData = posts.map(post => ({
        title: post.title,
        views: 0, // Would be populated from analytics
        engagement: post.engagementPotential || 0,
        publishedAt: post.publishedAt
      }));
      
      const predictions = await blogService.predictFuturePerformance(
        historicalData,
        marketTrends || ['AI adoption', 'blockchain growth', 'crypto regulation']
      );
      
      res.json({
        predictions,
        historicalDataPoints: historicalData.length,
        marketTrends: marketTrends || ['AI adoption', 'blockchain growth'],
        forecastedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error predicting future performance:", error);
      res.status(500).json({ error: "Failed to predict future performance" });
    }
  });

  /**
   * Advanced competitor intelligence
   */
  app.post("/api/blog/competitor-intelligence", async (req, res) => {
    try {
      const { competitors, industry } = req.body;
      
      if (!competitors || !industry) {
        return res.status(400).json({ error: "Competitors and industry are required" });
      }
      
      const intelligence = await blogService.analyzeCompetitorStrategy(
        competitors,
        industry
      );
      
      res.json({
        intelligence,
        competitors,
        industry,
        analyzedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error analyzing competitor intelligence:", error);
      res.status(500).json({ error: "Failed to analyze competitor intelligence" });
    }
  });

  /**
   * Automated executive summary generation
   */
  app.post("/api/blog/executive-summary", async (req, res) => {
    try {
      const { timeframe } = req.body;
      
      const posts = await db.select().from(blogPosts).limit(100);
      const analytics = await db.select().from(blogAnalytics).limit(50);
      
      const analyticsData = {
        totalPosts: posts.length,
        publishedPosts: posts.filter(p => p.status === 'published').length,
        avgReadabilityScore: posts.reduce((sum, p) => sum + (p.readabilityScore || 0), 0) / posts.length,
        avgSeoScore: posts.reduce((sum, p) => sum + (p.seoScore || 0), 0) / posts.length,
        totalViews: analytics.reduce((sum, a) => sum + (a.views || 0), 0),
        totalShares: analytics.reduce((sum, a) => sum + (a.shares || 0), 0)
      };
      
      const summary = await blogService.generateExecutiveSummary(
        analyticsData,
        timeframe || 'monthly'
      );
      
      res.json({
        summary,
        analyticsData,
        timeframe: timeframe || 'monthly',
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating executive summary:", error);
      res.status(500).json({ error: "Failed to generate executive summary" });
    }
  });

  // =====================================================
  // BUNDLE 5: Advanced Automation & AI Orchestration API Routes
  // =====================================================

  /**
   * Multi-language content generation and localization
   */
  app.post("/api/blog/multi-language-content", async (req, res) => {
    try {
      const { content, targetLanguages, culturalAdaptation } = req.body;
      
      if (!content || !targetLanguages) {
        return res.status(400).json({ error: "Content and target languages are required" });
      }
      
      const localization = await blogService.generateMultiLanguageContent(
        content,
        targetLanguages,
        culturalAdaptation !== false
      );
      
      res.json({
        localization,
        originalContent: content.substring(0, 200) + "...",
        targetLanguages,
        culturalAdaptation: culturalAdaptation !== false,
        localizedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating multi-language content:", error);
      res.status(500).json({ error: "Failed to generate multi-language content" });
    }
  });

  /**
   * Advanced content automation workflows
   */
  app.post("/api/blog/automation-workflow", async (req, res) => {
    try {
      const { contentGoals, targetMetrics, automationLevel } = req.body;
      
      if (!contentGoals || !automationLevel) {
        return res.status(400).json({ error: "Content goals and automation level are required" });
      }
      
      const workflow = await blogService.createAutomationWorkflow(
        contentGoals,
        targetMetrics || {},
        automationLevel
      );
      
      res.json({
        workflow,
        contentGoals,
        automationLevel,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error creating automation workflow:", error);
      res.status(500).json({ error: "Failed to create automation workflow" });
    }
  });

  /**
   * AI-powered content quality assurance
   */
  app.post("/api/blog/quality-assurance", async (req, res) => {
    try {
      const { content, brandGuidelines, targetAudience } = req.body;
      
      if (!content || !targetAudience) {
        return res.status(400).json({ error: "Content and target audience are required" });
      }
      
      const qa = await blogService.performQualityAssurance(
        content,
        brandGuidelines || {},
        targetAudience
      );
      
      res.json({
        qa,
        originalContent: content.substring(0, 200) + "...",
        targetAudience,
        analyzedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error performing quality assurance:", error);
      res.status(500).json({ error: "Failed to perform quality assurance" });
    }
  });

  /**
   * Advanced analytics integration and reporting
   */
  app.post("/api/blog/advanced-analytics", async (req, res) => {
    try {
      const { comparisonPeriod, goals } = req.body;
      
      // Get actual performance data from database
      const posts = await db.select().from(blogPosts).limit(100);
      const analytics = await db.select().from(blogAnalytics).limit(100);
      
      const performanceData = posts.map(post => ({
        id: post.id,
        title: post.title,
        views: 0, // Would be populated from analytics
        engagement: post.engagementPotential || 0,
        seoScore: post.seoScore || 0,
        publishedAt: post.publishedAt
      }));
      
      const advancedAnalytics = await blogService.generateAdvancedAnalytics(
        performanceData,
        comparisonPeriod || 'monthly',
        goals || ['increase engagement', 'improve SEO', 'grow audience']
      );
      
      res.json({
        analytics: advancedAnalytics,
        dataPoints: performanceData.length,
        comparisonPeriod: comparisonPeriod || 'monthly',
        goals: goals || ['increase engagement', 'improve SEO'],
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating advanced analytics:", error);
      res.status(500).json({ error: "Failed to generate advanced analytics" });
    }
  });

  /**
   * AI orchestration for complex content campaigns
   */
  app.post("/api/blog/campaign-orchestration", async (req, res) => {
    try {
      const { campaignObjectives, timeline, budget, channels } = req.body;
      
      if (!campaignObjectives || !timeline) {
        return res.status(400).json({ error: "Campaign objectives and timeline are required" });
      }
      
      const orchestration = await blogService.orchestrateContentCampaign(
        campaignObjectives,
        timeline,
        budget || 1000,
        channels || ['blog', 'social', 'email']
      );
      
      res.json({
        campaign: orchestration,
        campaignObjectives,
        timeline,
        budget: budget || 1000,
        channels: channels || ['blog', 'social', 'email'],
        orchestratedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error orchestrating content campaign:", error);
      res.status(500).json({ error: "Failed to orchestrate content campaign" });
    }
  });

  // ================== BLOG ANALYTICS ==================
  
  /**
   * Get blog analytics dashboard data - OPTIMIZED
   */
  app.get("/api/blog/analytics", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 7; // Reduced default
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Single optimized query for all counts
      const stats = await db
        .select({
          totalPosts: sql<number>`count(*)`,
          publishedPosts: sql<number>`sum(case when ${blogPosts.status} = 'published' then 1 else 0 end)`,
          draftPosts: sql<number>`sum(case when ${blogPosts.status} = 'draft' then 1 else 0 end)`,
          scheduledPosts: sql<number>`sum(case when ${blogPosts.status} = 'scheduled' then 1 else 0 end)`
        })
        .from(blogPosts);
      
      // Simplified analytics with limit
      const recentAnalytics = await db
        .select({
          id: blogAnalytics.id,
          postId: blogAnalytics.postId,
          views: blogAnalytics.views,
          shares: blogAnalytics.shares,
          date: blogAnalytics.date
        })
        .from(blogAnalytics)
        .orderBy(desc(blogAnalytics.date))
        .limit(10); // Strict limit for performance
      
      // Quick aggregation
      const totalViews = recentAnalytics.reduce((sum, record) => sum + (record.views || 0), 0);
      const totalShares = recentAnalytics.reduce((sum, record) => sum + (record.shares || 0), 0);
      
      const summary = stats[0];
      
      res.json({
        summary: {
          totalPosts: summary.totalPosts.toString(),
          publishedPosts: summary.publishedPosts.toString(), 
          draftPosts: summary.draftPosts.toString(),
          scheduledPosts: summary.scheduledPosts.toString(),
          totalViews,
          totalShares,
          avgReadTime: 0 // Simplified for performance
        },
        analytics: recentAnalytics.slice(0, 5) // Further limit
      });
    } catch (error) {
      console.error("Error fetching blog analytics:", error);
      res.status(500).json({ error: "Failed to fetch blog analytics" });
    }
  });
  
  /**
   * Get blog statistics for admin dashboard - OPTIMIZED
   */
  app.get("/api/blog/stats", async (req, res) => {
    try {
      // Single combined query for blog stats
      const blogStats = await db
        .select({
          totalPosts: sql<number>`count(*)`,
          publishedPosts: sql<number>`sum(case when ${blogPosts.status} = 'published' then 1 else 0 end)`,
          draftPosts: sql<number>`sum(case when ${blogPosts.status} = 'draft' then 1 else 0 end)`,
          aiGeneratedPosts: sql<number>`sum(case when ${blogPosts.generatedByAI} = true then 1 else 0 end)`
        })
        .from(blogPosts);
      
      // Separate quick query for schedules
      const activeSchedules = await db
        .select({ count: sql<number>`count(*)` })
        .from(blogSchedules)
        .where(eq(blogSchedules.isActive, true))
        .limit(1);
      
      const stats = blogStats[0];
      
      res.json({
        totalPosts: stats.totalPosts,
        publishedPosts: stats.publishedPosts,
        draftPosts: stats.draftPosts,
        aiGeneratedPosts: stats.aiGeneratedPosts,
        activeSchedules: activeSchedules[0]?.count || 0
      });
    } catch (error) {
      console.error("Error fetching blog stats:", error);
      res.status(500).json({ error: "Failed to fetch blog stats" });
    }
  });
}