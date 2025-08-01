import { db } from "./db";
import { 
  journeyMilestones, 
  userJourneyProgress, 
  journeyInsights, 
  userPreferences,
  userRewards,
  users,
  type JourneyMilestone,
  type UserJourneyProgress,
  type JourneyInsight,
  type UserPreferences,
  type InsertJourneyMilestone,
  type InsertUserJourneyProgress,
  type InsertJourneyInsight,
  type InsertUserPreferences,
  type UserReward
} from "@shared/schema";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";

export class JourneyService {
  
  // Initialize user preferences with defaults
  async initializeUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const existing = await this.getUserPreferences(userId);
      if (existing) return existing;

      const preferencesData: InsertUserPreferences = {
        userId,
        dashboardLayout: 'default',
        notificationSettings: {
          milestones: true,
          insights: true,
          challenges: true,
          badges: true,
        },
        favoriteCategories: [],
        privacyLevel: 'public',
      };

      const [preferences] = await db
        .insert(userPreferences)
        .values(preferencesData)
        .returning();

      return preferences;
    } catch (error) {
      console.error('Error initializing user preferences:', error);
      throw error;
    }
  }

  // Get user preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences;
  }

  // Update user preferences
  async updateUserPreferences(userId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    const [preferences] = await db
      .update(userPreferences)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId))
      .returning();
    
    return preferences;
  }

  // Get user's complete journey dashboard data
  async getUserJourneyDashboard(userId: string) {
    try {
      // Get user rewards data
      const userReward = await db
        .select()
        .from(userRewards)
        .where(eq(userRewards.userId, userId))
        .limit(1);

      // Get user preferences
      const preferences = await this.getUserPreferences(userId) || 
        await this.initializeUserPreferences(userId);

      // Get achieved milestones
      const achievedMilestones = await db
        .select({
          milestone: {
            id: journeyMilestones.id,
            name: journeyMilestones.name,
            description: journeyMilestones.description,
            category: journeyMilestones.category,
            order: journeyMilestones.order,
            iconUrl: journeyMilestones.iconUrl,
            pointsReward: journeyMilestones.pointsReward,
          },
          achievedAt: userJourneyProgress.achievedAt,
          notificationShown: userJourneyProgress.notificationShown,
        })
        .from(userJourneyProgress)
        .innerJoin(journeyMilestones, eq(userJourneyProgress.milestoneId, journeyMilestones.id))
        .where(eq(userJourneyProgress.userId, userId))
        .orderBy(desc(userJourneyProgress.achievedAt));

      // Get all milestones for progress calculation
      const allMilestones = await db
        .select()
        .from(journeyMilestones)
        .where(eq(journeyMilestones.isActive, true))
        .orderBy(journeyMilestones.category, journeyMilestones.order);

      // Calculate next milestones
      const achievedMilestoneIds = new Set(achievedMilestones.map(am => am.milestone.id));
      const nextMilestones = await this.calculateNextMilestones(userId, allMilestones, achievedMilestoneIds);

      // Get recent insights
      const recentInsights = await db
        .select()
        .from(journeyInsights)
        .where(eq(journeyInsights.userId, userId))
        .orderBy(desc(journeyInsights.createdAt))
        .limit(5);

      // Calculate journey statistics
      const journeyStats = this.calculateJourneyStats(userReward[0], achievedMilestones, allMilestones);

      return {
        userReward: userReward[0],
        preferences,
        achievedMilestones,
        nextMilestones,
        recentInsights,
        journeyStats,
        milestonesByCategory: this.groupMilestonesByCategory(allMilestones, achievedMilestoneIds),
      };
    } catch (error) {
      console.error('Error getting user journey dashboard:', error);
      throw error;
    }
  }

  // Calculate next available milestones for user
  private async calculateNextMilestones(
    userId: string, 
    allMilestones: JourneyMilestone[], 
    achievedIds: Set<string>
  ) {
    const userReward = await db
      .select()
      .from(userRewards)
      .where(eq(userRewards.userId, userId))
      .limit(1);

    if (!userReward[0]) return [];

    const nextMilestones = [];
    
    for (const milestone of allMilestones) {
      if (achievedIds.has(milestone.id)) continue;
      
      const isEligible = await this.checkMilestoneEligibility(userId, milestone.requiredCondition, userReward[0]);
      const progress = await this.calculateMilestoneProgress(userId, milestone.requiredCondition, userReward[0]);
      
      if (isEligible || progress > 0) {
        nextMilestones.push({
          ...milestone,
          isEligible,
          progress,
        });
      }

      // Limit to 6 next milestones
      if (nextMilestones.length >= 6) break;
    }

    return nextMilestones.sort((a, b) => b.progress - a.progress);
  }

  // Check if user meets milestone condition
  private async checkMilestoneEligibility(userId: string, condition: string, userReward: UserReward): Promise<boolean> {
    const [type, value] = condition.split(':');
    const targetValue = parseInt(value);

    switch (type) {
      case 'sms_count':
        return (userReward.totalSmsMessages || 0) >= targetValue;
      case 'tokens_minted':
        return (userReward.totalTokensMinted || 0) >= targetValue;
      case 'points':
        return (userReward.totalPoints || 0) >= targetValue;
      case 'level':
        return (userReward.currentLevel || 1) >= targetValue;
      case 'streak':
        return (userReward.currentStreak || 0) >= targetValue;
      case 'longest_streak':
        return (userReward.longestStreak || 0) >= targetValue;
      case 'value_attached':
        return parseFloat(userReward.totalValueAttached || "0") >= targetValue;
      case 'phone_registered':
        // Check if user has verified phone
        return targetValue === 1; // For now, assume registered if milestone exists
      default:
        return false;
    }
  }

  // Calculate progress toward milestone
  private async calculateMilestoneProgress(userId: string, condition: string, userReward: UserReward): Promise<number> {
    const [type, value] = condition.split(':');
    const targetValue = parseInt(value);

    let currentValue = 0;
    switch (type) {
      case 'sms_count':
        currentValue = userReward.totalSmsMessages || 0;
        break;
      case 'tokens_minted':
        currentValue = userReward.totalTokensMinted || 0;
        break;
      case 'points':
        currentValue = userReward.totalPoints || 0;
        break;
      case 'level':
        currentValue = userReward.currentLevel || 1;
        break;
      case 'streak':
        currentValue = userReward.currentStreak || 0;
        break;
      case 'longest_streak':
        currentValue = userReward.longestStreak || 0;
        break;
      case 'value_attached':
        currentValue = parseFloat(userReward.totalValueAttached || "0");
        break;
      case 'phone_registered':
        currentValue = 1; // Assume registered for demo
        break;
    }

    return Math.min((currentValue / targetValue) * 100, 100);
  }

  // Group milestones by category
  private groupMilestonesByCategory(milestones: JourneyMilestone[], achievedIds: Set<string>) {
    const categories = {
      onboarding: [],
      engagement: [],
      mastery: [],
      social: [],
      value: [],
    };

    for (const milestone of milestones) {
      const category = milestone.category as keyof typeof categories;
      if (categories[category]) {
        categories[category].push({
          ...milestone,
          isAchieved: achievedIds.has(milestone.id),
        });
      }
    }

    return categories;
  }

  // Calculate overall journey statistics
  private calculateJourneyStats(userReward: UserReward | undefined, achievedMilestones: any[], allMilestones: JourneyMilestone[]) {
    if (!userReward) {
      return {
        completionPercentage: 0,
        totalMilestones: allMilestones.length,
        achievedMilestones: 0,
        daysActive: 0,
        favoriteCategory: 'onboarding',
        nextLevelProgress: 0,
      };
    }

    const completionPercentage = (achievedMilestones.length / allMilestones.length) * 100;
    const daysActive = userReward.createdAt 
      ? Math.floor((Date.now() - new Date(userReward.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 1;

    // Calculate favorite category based on achieved milestones
    const categoryCount = achievedMilestones.reduce((acc, am) => {
      const category = am.milestone.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b, 'onboarding');

    // Calculate next level progress
    const levelThresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 17000, 25000, 35000, 50000, 75000];
    const currentLevel = userReward.currentLevel || 1;
    const currentPoints = userReward.totalPoints || 0;
    const currentThreshold = levelThresholds[currentLevel - 1] || 0;
    const nextThreshold = levelThresholds[currentLevel] || levelThresholds[levelThresholds.length - 1];
    const nextLevelProgress = ((currentPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

    return {
      completionPercentage: Math.round(completionPercentage),
      totalMilestones: allMilestones.length,
      achievedMilestones: achievedMilestones.length,
      daysActive,
      favoriteCategory,
      nextLevelProgress: Math.min(Math.max(nextLevelProgress, 0), 100),
    };
  }

  // Award milestone achievement
  async awardMilestone(userId: string, milestoneId: string): Promise<void> {
    try {
      // Check if already achieved
      const existing = await db
        .select()
        .from(userJourneyProgress)
        .where(
          and(
            eq(userJourneyProgress.userId, userId),
            eq(userJourneyProgress.milestoneId, milestoneId)
          )
        )
        .limit(1);

      if (existing.length > 0) return;

      // Award the milestone
      const progressData: InsertUserJourneyProgress = {
        userId,
        milestoneId,
        notificationShown: false,
      };

      await db
        .insert(userJourneyProgress)
        .values(progressData);

      // Get milestone details for points reward
      const milestone = await db
        .select()
        .from(journeyMilestones)
        .where(eq(journeyMilestones.id, milestoneId))
        .limit(1);

      // Award points if milestone has rewards (integrate with rewards service)
      if (milestone[0] && milestone[0].pointsReward && milestone[0].pointsReward > 0) {
        // Import rewards service dynamically to avoid circular dependency
        const { rewardsService } = await import("./rewards-service");
        await rewardsService.awardPoints(
          userId, 
          'milestone_achieved', 
          milestone[0].pointsReward, 
          `Achieved milestone: ${milestone[0].name}`,
          milestoneId
        );
      }
    } catch (error) {
      console.error('Error awarding milestone:', error);
    }
  }

  // Check milestone eligibility for user and award if eligible
  async checkAndAwardMilestones(userId: string): Promise<void> {
    try {
      const userReward = await db
        .select()
        .from(userRewards)
        .where(eq(userRewards.userId, userId))
        .limit(1);

      if (!userReward[0]) return;

      // Get all active milestones
      const allMilestones = await db
        .select()
        .from(journeyMilestones)
        .where(eq(journeyMilestones.isActive, true));

      // Get already achieved milestones
      const achievedMilestones = await db
        .select({ milestoneId: userJourneyProgress.milestoneId })
        .from(userJourneyProgress)
        .where(eq(userJourneyProgress.userId, userId));

      const achievedIds = new Set(achievedMilestones.map(am => am.milestoneId));

      // Check each milestone
      for (const milestone of allMilestones) {
        if (achievedIds.has(milestone.id)) continue;

        const isEligible = await this.checkMilestoneEligibility(userId, milestone.requiredCondition, userReward[0]);
        
        if (isEligible) {
          await this.awardMilestone(userId, milestone.id);
        }
      }
    } catch (error) {
      console.error('Error checking milestone eligibility:', error);
    }
  }

  // Generate personalized insights
  async generatePersonalizedInsights(userId: string): Promise<void> {
    try {
      const userReward = await db
        .select()
        .from(userRewards)
        .where(eq(userRewards.userId, userId))
        .limit(1);

      if (!userReward[0]) return;

      const insights: InsertJourneyInsight[] = [];

      // Weekly summary insight
      const weeklyInsight = this.generateWeeklySummary(userReward[0]);
      if (weeklyInsight) insights.push(weeklyInsight);

      // Personal best insight
      const personalBestInsight = this.generatePersonalBestInsight(userReward[0]);
      if (personalBestInsight) insights.push(personalBestInsight);

      // Trend analysis insight
      const trendInsight = this.generateTrendAnalysis(userReward[0]);
      if (trendInsight) insights.push(trendInsight);

      // Insert insights
      if (insights.length > 0) {
        await db.insert(journeyInsights).values(insights);
      }
    } catch (error) {
      console.error('Error generating personalized insights:', error);
    }
  }

  // Generate weekly summary
  private generateWeeklySummary(userReward: UserReward): InsertJourneyInsight | null {
    const totalPoints = userReward.totalPoints || 0;
    const currentStreak = userReward.currentStreak || 0;
    const smsCount = userReward.totalSmsMessages || 0;

    if (totalPoints === 0) return null;

    return {
      userId: userReward.userId,
      insightType: 'weekly_summary',
      title: 'Your Week in Review',
      description: `You've earned ${totalPoints} points this week with ${smsCount} messages sent and a ${currentStreak}-day streak!`,
      data: {
        totalPoints,
        currentStreak,
        smsCount,
        tokensCount: userReward.totalTokensMinted || 0,
      },
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Valid for 7 days
    };
  }

  // Generate personal best insight
  private generatePersonalBestInsight(userReward: UserReward): InsertJourneyInsight | null {
    const longestStreak = userReward.longestStreak || 0;
    const currentStreak = userReward.currentStreak || 0;

    if (longestStreak === 0) return null;

    const isNewRecord = currentStreak === longestStreak && longestStreak > 1;

    return {
      userId: userReward.userId,
      insightType: 'personal_best',
      title: isNewRecord ? '🎉 New Personal Record!' : '📈 Your Best Performance',
      description: isNewRecord 
        ? `Congratulations! You've set a new personal record with a ${longestStreak}-day streak!`
        : `Your longest streak is ${longestStreak} days. Current streak: ${currentStreak} days.`,
      data: {
        longestStreak,
        currentStreak,
        isNewRecord,
      },
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Valid for 3 days
    };
  }

  // Generate trend analysis
  private generateTrendAnalysis(userReward: UserReward): InsertJourneyInsight | null {
    const totalPoints = userReward.totalPoints || 0;
    const currentLevel = userReward.currentLevel || 1;
    const smsCount = userReward.totalSmsMessages || 0;

    if (totalPoints < 50) return null;

    const averagePointsPerMessage = smsCount > 0 ? totalPoints / smsCount : 0;

    return {
      userId: userReward.userId,
      insightType: 'trend_analysis',
      title: '📊 Your Growth Trends',
      description: `You're averaging ${Math.round(averagePointsPerMessage)} points per message and are level ${currentLevel}. Keep it up!`,
      data: {
        averagePointsPerMessage: Math.round(averagePointsPerMessage),
        currentLevel,
        totalPoints,
        smsCount,
      },
      validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Valid for 5 days
    };
  }

  // Mark insight as read
  async markInsightAsRead(userId: string, insightId: string): Promise<void> {
    await db
      .update(journeyInsights)
      .set({ isRead: true })
      .where(
        and(
          eq(journeyInsights.id, insightId),
          eq(journeyInsights.userId, userId)
        )
      );
  }

  // Get milestone by ID
  async getMilestone(milestoneId: string): Promise<JourneyMilestone | undefined> {
    const [milestone] = await db
      .select()
      .from(journeyMilestones)
      .where(eq(journeyMilestones.id, milestoneId));
    return milestone;
  }
}

export const journeyService = new JourneyService();