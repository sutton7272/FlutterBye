import { CronJob } from 'cron';
import { db } from "./db";
import { blogSchedules, blogPosts } from "@shared/schema";
import { eq, and, lte } from "drizzle-orm";
import { blogService } from "./openai-blog-service";
import type { BlogGenerationRequest } from "./openai-blog-service";

/**
 * Blog Content Scheduler - Automated content generation and publishing
 * Manages cron jobs for scheduled blog content creation
 */
export class BlogContentScheduler {
  private jobs: Map<string, CronJob> = new Map();
  private isInitialized = false;

  /**
   * Initialize scheduler and load active schedules
   */
  async initialize() {
    if (this.isInitialized) return;
    
    console.log("🤖 Initializing Blog Content Scheduler...");
    
    try {
      // Load all active schedules from database
      const activeSchedules = await db
        .select()
        .from(blogSchedules)
        .where(eq(blogSchedules.isActive, true));

      // Create cron jobs for each schedule
      for (const schedule of activeSchedules) {
        await this.createScheduleJob(schedule);
      }

      this.isInitialized = true;
      console.log(`✅ Blog Content Scheduler initialized with ${activeSchedules.length} active schedules`);
    } catch (error) {
      console.error("❌ Failed to initialize Blog Content Scheduler:", error);
    }
  }

  /**
   * Create a cron job for a blog schedule
   */
  async createScheduleJob(schedule: any) {
    try {
      const cronExpression = this.getCronExpression(schedule);
      
      const job = new CronJob(
        cronExpression,
        () => this.executeSchedule(schedule.id),
        null,
        true, // Start immediately
        'America/New_York' // Default timezone
      );

      this.jobs.set(schedule.id, job);
      
      // Update next run time
      await this.updateNextRunTime(schedule.id, job.nextDate().toJSDate());
      
      console.log(`📅 Created blog schedule job: ${schedule.name} (${cronExpression})`);
    } catch (error) {
      console.error(`❌ Failed to create schedule job for ${schedule.name}:`, error);
    }
  }

  /**
   * Execute a scheduled content generation
   */
  async executeSchedule(scheduleId: string) {
    console.log(`🤖 Executing blog schedule: ${scheduleId}`);
    
    try {
      // Get schedule details
      const [schedule] = await db
        .select()
        .from(blogSchedules)
        .where(eq(blogSchedules.id, scheduleId))
        .limit(1);

      if (!schedule || !schedule.isActive) {
        console.log(`⚠️ Schedule ${scheduleId} is inactive or not found`);
        return;
      }

      // Generate trending topics
      const topics = await blogService.suggestTrendingTopics('blockchain');
      
      if (!topics.length) {
        console.log(`⚠️ No trending topics found for schedule ${schedule.name}`);
        return;
      }

      // Select random topic from suggestions
      const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
      
      // Build content generation request
      const generationRequest: BlogGenerationRequest = {
        topic: selectedTopic,
        tone: schedule.defaultTone as any || 'professional',
        targetAudience: schedule.defaultTargetAudience as any || 'general',
        contentType: schedule.defaultContentType as any || 'blog',
        keywords: schedule.keywordFocus || [],
        wordCount: this.getWordCount(schedule.wordCountRange),
        includeFlutterByeIntegration: schedule.includeFlutterByeIntegration || false
      };

      // Generate content
      const result = await blogService.generateBlogContent(generationRequest);
      
      // Generate SEO optimization
      const seoOptimization = await blogService.optimizeForSEO(
        result.content, 
        generationRequest.keywords?.[0] || selectedTopic
      );
      
      // Analyze content quality
      const analysis = await blogService.analyzeContent(result.content);
      
      // Create slug
      const slug = result.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Determine status based on schedule settings
      const status = schedule.autoPublish && !schedule.requiresApproval ? 'published' : 'draft';
      const publishedAt = status === 'published' ? new Date() : null;

      // Create blog post
      const [newPost] = await db.insert(blogPosts).values({
        title: result.title,
        slug: slug,
        excerpt: result.excerpt,
        content: result.content,
        metaDescription: seoOptimization.metaDescription,
        keywords: seoOptimization.keywords,
        tone: generationRequest.tone,
        targetAudience: generationRequest.targetAudience,
        contentType: generationRequest.contentType,
        readabilityScore: analysis.readabilityScore,
        seoScore: analysis.seoScore,
        engagementPotential: analysis.engagementPotential,
        aiRecommendations: analysis.recommendations,
        seoTitle: seoOptimization.title,
        internalLinks: seoOptimization.internalLinkSuggestions,
        headingStructure: seoOptimization.headings,
        generatedByAI: true,
        aiPrompt: JSON.stringify(generationRequest),
        aiModel: "gpt-4o",
        aiGeneratedAt: new Date(),
        status: status,
        publishedAt: publishedAt,
        categoryId: this.selectRandomCategory(schedule.preferredCategories)
      }).returning();

      // Update schedule statistics
      await db
        .update(blogSchedules)
        .set({
          postsGenerated: (schedule.postsGenerated || 0) + 1,
          postsPublished: status === 'published' ? (schedule.postsPublished || 0) + 1 : (schedule.postsPublished || 0),
          lastRunAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(blogSchedules.id, scheduleId));

      // Update next run time
      const job = this.jobs.get(scheduleId);
      if (job) {
        await this.updateNextRunTime(scheduleId, job.nextDate().toJSDate());
      }

      console.log(`✅ Successfully generated blog post: ${result.title} (${status})`);
      
    } catch (error) {
      console.error(`❌ Failed to execute blog schedule ${scheduleId}:`, error);
    }
  }

  /**
   * Add or update a schedule
   */
  async updateSchedule(schedule: any) {
    // Stop existing job if it exists
    const existingJob = this.jobs.get(schedule.id);
    if (existingJob) {
      existingJob.stop();
      this.jobs.delete(schedule.id);
    }

    // Create new job if schedule is active
    if (schedule.isActive) {
      await this.createScheduleJob(schedule);
    }
  }

  /**
   * Remove a schedule
   */
  removeSchedule(scheduleId: string) {
    const job = this.jobs.get(scheduleId);
    if (job) {
      job.stop();
      this.jobs.delete(scheduleId);
      console.log(`🗑️ Removed blog schedule job: ${scheduleId}`);
    }
  }

  /**
   * Get cron expression from schedule frequency
   */
  private getCronExpression(schedule: any): string {
    switch (schedule.frequency) {
      case 'daily':
        return '0 9 * * *'; // 9 AM daily
      case 'weekly':
        return '0 9 * * 1'; // 9 AM every Monday
      case 'bi-weekly':
        return '0 9 */14 * *'; // 9 AM every 14 days
      case 'monthly':
        return '0 9 1 * *'; // 9 AM first day of month
      case 'custom':
        return schedule.customCronExpression || '0 9 * * *';
      default:
        return '0 9 * * *'; // Default to daily
    }
  }

  /**
   * Get word count from range
   */
  private getWordCount(wordCountRange: any): number {
    if (!wordCountRange || typeof wordCountRange !== 'object') {
      return 1000; // Default word count
    }
    
    const { min = 800, max = 1200 } = wordCountRange;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Select random category from preferred categories
   */
  private selectRandomCategory(preferredCategories: string[] | null): string | null {
    if (!preferredCategories || !preferredCategories.length) {
      return null;
    }
    
    return preferredCategories[Math.floor(Math.random() * preferredCategories.length)];
  }

  /**
   * Update next run time for schedule
   */
  private async updateNextRunTime(scheduleId: string, nextRunTime: Date) {
    try {
      await db
        .update(blogSchedules)
        .set({ 
          nextRunAt: nextRunTime,
          updatedAt: new Date()
        })
        .where(eq(blogSchedules.id, scheduleId));
    } catch (error) {
      console.error(`Failed to update next run time for schedule ${scheduleId}:`, error);
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      activeJobs: this.jobs.size,
      jobIds: Array.from(this.jobs.keys())
    };
  }

  /**
   * Stop all jobs (for graceful shutdown)
   */
  shutdown() {
    console.log("🛑 Shutting down Blog Content Scheduler...");
    
    for (const [id, job] of Array.from(this.jobs.entries())) {
      job.stop();
      console.log(`⏹️ Stopped job: ${id}`);
    }
    
    this.jobs.clear();
    this.isInitialized = false;
    console.log("✅ Blog Content Scheduler shutdown complete");
  }
}

// Export singleton instance
export const blogScheduler = new BlogContentScheduler();