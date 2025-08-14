import { db } from './db';
import { socialBotConfigurations, scheduledPosts, type SocialBotConfiguration, type InsertSocialBotConfiguration, type ScheduledPost, type InsertScheduledPost } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

export class SocialBotStorage {
  // Bot Configuration Methods
  async createBotConfiguration(botData: InsertSocialBotConfiguration): Promise<SocialBotConfiguration> {
    const [bot] = await db
      .insert(socialBotConfigurations)
      .values(botData)
      .returning();
    return bot;
  }

  async getBotConfiguration(id: string): Promise<SocialBotConfiguration | undefined> {
    const [bot] = await db
      .select()
      .from(socialBotConfigurations)
      .where(eq(socialBotConfigurations.id, id));
    return bot;
  }

  async getAllBotConfigurations(): Promise<SocialBotConfiguration[]> {
    return await db
      .select()
      .from(socialBotConfigurations)
      .orderBy(desc(socialBotConfigurations.createdAt));
  }

  async updateBotConfiguration(id: string, updates: Partial<InsertSocialBotConfiguration>): Promise<SocialBotConfiguration | undefined> {
    const [bot] = await db
      .update(socialBotConfigurations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(socialBotConfigurations.id, id))
      .returning();
    return bot;
  }

  async deleteBotConfiguration(id: string): Promise<void> {
    await db
      .delete(socialBotConfigurations)
      .where(eq(socialBotConfigurations.id, id));
  }

  async getActiveBotConfigurations(): Promise<SocialBotConfiguration[]> {
    return await db
      .select()
      .from(socialBotConfigurations)
      .where(eq(socialBotConfigurations.isActive, true));
  }

  // Scheduled Posts Methods
  async createScheduledPost(postData: InsertScheduledPost): Promise<ScheduledPost> {
    const [post] = await db
      .insert(scheduledPosts)
      .values(postData)
      .returning();
    return post;
  }

  async getScheduledPost(id: string): Promise<ScheduledPost | undefined> {
    const [post] = await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.id, id));
    return post;
  }

  async getAllScheduledPosts(limit?: number): Promise<ScheduledPost[]> {
    const query = db
      .select()
      .from(scheduledPosts)
      .orderBy(desc(scheduledPosts.scheduledTime));
    
    if (limit) {
      query.limit(limit);
    }
    
    return await query;
  }

  async getScheduledPostsByBotId(botConfigId: string): Promise<ScheduledPost[]> {
    return await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.botConfigId, botConfigId))
      .orderBy(desc(scheduledPosts.scheduledTime));
  }

  async getPendingScheduledPosts(): Promise<ScheduledPost[]> {
    return await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.status, 'pending'))
      .orderBy(scheduledPosts.scheduledTime);
  }

  async getPostsDueForScheduling(currentTime: Date): Promise<ScheduledPost[]> {
    return await db
      .select()
      .from(scheduledPosts)
      .where(
        and(
          eq(scheduledPosts.status, 'pending'),
          eq(scheduledPosts.scheduledTime, currentTime)
        )
      )
      .orderBy(scheduledPosts.scheduledTime);
  }

  async updateScheduledPost(id: string, updates: Partial<InsertScheduledPost>): Promise<ScheduledPost | undefined> {
    const [post] = await db
      .update(scheduledPosts)
      .set(updates)
      .where(eq(scheduledPosts.id, id))
      .returning();
    return post;
  }

  async updateScheduledPostStatus(id: string, status: string, platformPostId?: string, errorMessage?: string): Promise<void> {
    const updates: any = { 
      status,
      ...(status === 'posted' && { postedAt: new Date() }),
      ...(platformPostId && { platformPostId }),
      ...(errorMessage && { errorMessage })
    };

    await db
      .update(scheduledPosts)
      .set(updates)
      .where(eq(scheduledPosts.id, id));
  }

  async deleteScheduledPost(id: string): Promise<void> {
    await db
      .delete(scheduledPosts)
      .where(eq(scheduledPosts.id, id));
  }

  async getPostsForTimeWindow(startTime: Date, endTime: Date): Promise<ScheduledPost[]> {
    return await db
      .select()
      .from(scheduledPosts)
      .where(
        and(
          eq(scheduledPosts.status, 'pending'),
          /* scheduledTime between startTime and endTime */
        )
      )
      .orderBy(scheduledPosts.scheduledTime);
  }
}

export const socialBotStorage = new SocialBotStorage();