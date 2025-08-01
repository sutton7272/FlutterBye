import { db } from "./db";
import { 
  userRewards, 
  badges, 
  userBadges, 
  rewardTransactions, 
  dailyChallenges, 
  userChallengeProgress,
  users,
  type UserReward,
  type Badge,
  type UserBadge,
  type RewardTransaction,
  type DailyChallenge,
  type UserChallengeProgress,
  type InsertUserReward,
  type InsertBadge,
  type InsertUserBadge,
  type InsertRewardTransaction,
  type InsertDailyChallenge,
  type InsertUserChallengeProgress
} from "@shared/schema";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";

export class RewardsService {
  // Point values for different actions
  private static readonly POINT_VALUES = {
    SMS_SENT: 10,
    PHONE_REGISTERED: 25,
    TOKEN_MINTED: 15,
    VALUE_ATTACHED: 20,
    DAILY_LOGIN: 5,
    STREAK_BONUS: 5, // per day in streak
    FIRST_TIME_ACTION: 50,
    BADGE_EARNED: 100,
    CHALLENGE_COMPLETED: 100,
  };

  // Level thresholds (points needed for each level)
  private static readonly LEVEL_THRESHOLDS = [
    0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 17000, 25000, 35000, 50000, 75000
  ];

  // Initialize user rewards profile
  async initializeUserRewards(userId: string): Promise<UserReward> {
    try {
      // Check if user already has rewards profile
      const existing = await this.getUserRewards(userId);
      if (existing) return existing;

      const rewardData: InsertUserReward = {
        userId,
        totalPoints: 0,
        currentLevel: 1,
        currentStreak: 0,
        longestStreak: 0,
        totalSmsMessages: 0,
        totalTokensMinted: 0,
        totalValueAttached: "0",
        lastActivityDate: new Date(),
      };

      const [userReward] = await db
        .insert(userRewards)
        .values(rewardData)
        .returning();

      // Award welcome bonus
      await this.awardPoints(userId, 'first_time_user', RewardsService.POINT_VALUES.FIRST_TIME_ACTION, 'Welcome bonus for joining Flutterbye!');

      return userReward;
    } catch (error) {
      console.error('Error initializing user rewards:', error);
      throw error;
    }
  }

  // Get user rewards profile
  async getUserRewards(userId: string): Promise<UserReward | undefined> {
    const [reward] = await db
      .select()
      .from(userRewards)
      .where(eq(userRewards.userId, userId));
    return reward;
  }

  // Award points for user actions
  async awardPoints(userId: string, action: string, points: number, description: string, relatedId?: string): Promise<void> {
    try {
      // Get or create user rewards profile
      let userReward = await this.getUserRewards(userId);
      if (!userReward) {
        userReward = await this.initializeUserRewards(userId);
      }

      // Calculate new totals
      const newTotalPoints = (userReward.totalPoints || 0) + points;
      const newLevel = this.calculateLevel(newTotalPoints);
      const leveledUp = newLevel > (userReward.currentLevel || 1);

      // Update user rewards
      await db
        .update(userRewards)
        .set({
          totalPoints: newTotalPoints,
          currentLevel: newLevel,
          lastActivityDate: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userRewards.userId, userId));

      // Record transaction
      const transactionData: InsertRewardTransaction = {
        userId,
        type: 'earn',
        action,
        pointsChange: points,
        description,
        relatedId,
      };

      await db
        .insert(rewardTransactions)
        .values(transactionData);

      // Award level up bonus if applicable
      if (leveledUp) {
        const levelBonusPoints = newLevel * 50;
        await this.awardPoints(userId, 'level_up', levelBonusPoints, `Level ${newLevel} achieved! Bonus reward.`);
      }

      // Check for badge eligibility
      await this.checkBadgeEligibility(userId);

    } catch (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
  }

  // Calculate user level based on points
  private calculateLevel(points: number): number {
    for (let i = RewardsService.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (points >= RewardsService.LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  // Update user streak
  async updateStreak(userId: string): Promise<void> {
    try {
      const userReward = await this.getUserRewards(userId);
      if (!userReward) return;

      const today = new Date();
      const lastActivity = userReward.lastActivityDate;
      const daysDiff = lastActivity ? Math.floor((today.getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)) : 0;

      let newStreak = userReward.currentStreak || 0;
      let newLongestStreak = userReward.longestStreak || 0;

      if (daysDiff === 1) {
        // Continue streak
        newStreak += 1;
        newLongestStreak = Math.max(newLongestStreak, newStreak);
        
        // Award streak bonus
        const streakBonus = RewardsService.POINT_VALUES.STREAK_BONUS * newStreak;
        await this.awardPoints(userId, 'daily_streak', streakBonus, `${newStreak}-day streak bonus!`);
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1;
      }

      await db
        .update(userRewards)
        .set({
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastActivityDate: today,
          updatedAt: new Date(),
        })
        .where(eq(userRewards.userId, userId));

    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  // Check if user is eligible for new badges
  async checkBadgeEligibility(userId: string): Promise<void> {
    try {
      const userReward = await this.getUserRewards(userId);
      if (!userReward) return;

      // Get all active badges
      const availableBadges = await db
        .select()
        .from(badges)
        .where(eq(badges.isActive, true));

      // Get user's current badges
      const userCurrentBadges = await db
        .select({ badgeId: userBadges.badgeId })
        .from(userBadges)
        .where(eq(userBadges.userId, userId));

      const earnedBadgeIds = new Set(userCurrentBadges.map(b => b.badgeId));

      // Check each badge condition
      for (const badge of availableBadges) {
        if (earnedBadgeIds.has(badge.id)) continue; // Already earned

        const isEligible = await this.checkBadgeCondition(userId, badge.requiredCondition, userReward);
        
        if (isEligible) {
          await this.awardBadge(userId, badge.id);
        }
      }
    } catch (error) {
      console.error('Error checking badge eligibility:', error);
    }
  }

  // Check if user meets badge condition
  private async checkBadgeCondition(userId: string, condition: string, userReward: UserReward): Promise<boolean> {
    const [type, value] = condition.split(':');
    const targetValue = parseInt(value);

    switch (type) {
      case 'sms_count':
        return (userReward.totalSmsMessages || 0) >= targetValue;
      case 'token_count':
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
      default:
        return false;
    }
  }

  // Award badge to user
  async awardBadge(userId: string, badgeId: string): Promise<void> {
    try {
      const badgeData: InsertUserBadge = {
        userId,
        badgeId,
        notificationShown: false,
      };

      await db
        .insert(userBadges)
        .values(badgeData);

      // Award points for earning badge
      const badge = await db
        .select()
        .from(badges)
        .where(eq(badges.id, badgeId))
        .limit(1);

      if (badge[0]) {
        const points = badge[0].pointsReward || RewardsService.POINT_VALUES.BADGE_EARNED;
        await this.awardPoints(userId, 'badge_earned', points, `Earned "${badge[0].name}" badge!`, badgeId);
      }
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  }

  // Get user's badges
  async getUserBadges(userId: string): Promise<any[]> {
    return await db
      .select({
        id: userBadges.id,
        userId: userBadges.userId,
        badgeId: userBadges.badgeId,
        earnedAt: userBadges.earnedAt,
        notificationShown: userBadges.notificationShown,
        badge: {
          id: badges.id,
          name: badges.name,
          description: badges.description,
          iconUrl: badges.iconUrl,
          category: badges.category,
          rarity: badges.rarity,
          pointsReward: badges.pointsReward,
          requiredCondition: badges.requiredCondition,
          isActive: badges.isActive,
          createdAt: badges.createdAt,
        }
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));
  }

  // Get user's reward transactions
  async getUserTransactions(userId: string, limit: number = 50): Promise<RewardTransaction[]> {
    return await db
      .select()
      .from(rewardTransactions)
      .where(eq(rewardTransactions.userId, userId))
      .orderBy(desc(rewardTransactions.createdAt))
      .limit(limit);
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 100): Promise<(UserReward & { user: { walletAddress: string } })[]> {
    return await db
      .select({
        id: userRewards.id,
        userId: userRewards.userId,
        totalPoints: userRewards.totalPoints,
        currentLevel: userRewards.currentLevel,
        currentStreak: userRewards.currentStreak,
        longestStreak: userRewards.longestStreak,
        totalSmsMessages: userRewards.totalSmsMessages,
        totalTokensMinted: userRewards.totalTokensMinted,
        totalValueAttached: userRewards.totalValueAttached,
        lastActivityDate: userRewards.lastActivityDate,
        createdAt: userRewards.createdAt,
        updatedAt: userRewards.updatedAt,
        user: {
          walletAddress: users.walletAddress,
        }
      })
      .from(userRewards)
      .innerJoin(users, eq(userRewards.userId, users.id))
      .orderBy(desc(userRewards.totalPoints))
      .limit(limit);
  }

  // Create daily challenges
  async createDailyChallenge(challengeData: InsertDailyChallenge): Promise<DailyChallenge> {
    const [challenge] = await db
      .insert(dailyChallenges)
      .values(challengeData)
      .returning();
    return challenge;
  }

  // Get active daily challenges
  async getActiveDailyChallenges(): Promise<DailyChallenge[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db
      .select()
      .from(dailyChallenges)
      .where(
        and(
          eq(dailyChallenges.isActive, true),
          gte(dailyChallenges.date, today),
          lte(dailyChallenges.date, tomorrow)
        )
      );
  }

  // Get user's challenge progress
  async getUserChallengeProgress(userId: string): Promise<(UserChallengeProgress & { challenge: DailyChallenge })[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await db
      .select({
        id: userChallengeProgress.id,
        userId: userChallengeProgress.userId,
        challengeId: userChallengeProgress.challengeId,
        currentProgress: userChallengeProgress.currentProgress,
        isCompleted: userChallengeProgress.isCompleted,
        completedAt: userChallengeProgress.completedAt,
        createdAt: userChallengeProgress.createdAt,
        challenge: {
          id: dailyChallenges.id,
          date: dailyChallenges.date,
          challengeType: dailyChallenges.challengeType,
          targetValue: dailyChallenges.targetValue,
          description: dailyChallenges.description,
          pointsReward: dailyChallenges.pointsReward,
          isActive: dailyChallenges.isActive,
          createdAt: dailyChallenges.createdAt,
        }
      })
      .from(userChallengeProgress)
      .innerJoin(dailyChallenges, eq(userChallengeProgress.challengeId, dailyChallenges.id))
      .where(
        and(
          eq(userChallengeProgress.userId, userId),
          gte(dailyChallenges.date, today)
        )
      );
  }

  // Update challenge progress
  async updateChallengeProgress(userId: string, challengeType: string, increment: number = 1): Promise<void> {
    try {
      const activeChallenges = await this.getActiveDailyChallenges();
      const relevantChallenge = activeChallenges.find(c => c.challengeType === challengeType);
      
      if (!relevantChallenge) return;

      // Get or create progress record
      let progress = await db
        .select()
        .from(userChallengeProgress)
        .where(
          and(
            eq(userChallengeProgress.userId, userId),
            eq(userChallengeProgress.challengeId, relevantChallenge.id)
          )
        )
        .limit(1);

      if (progress.length === 0) {
        // Create new progress record
        const progressData: InsertUserChallengeProgress = {
          userId,
          challengeId: relevantChallenge.id,
          currentProgress: increment,
          isCompleted: increment >= relevantChallenge.targetValue,
          completedAt: increment >= relevantChallenge.targetValue ? new Date() : undefined,
        };

        await db
          .insert(userChallengeProgress)
          .values(progressData);

        if (increment >= relevantChallenge.targetValue) {
          await this.awardPoints(userId, 'challenge_completed', relevantChallenge.pointsReward, `Completed daily challenge: ${relevantChallenge.description}`);
        }
      } else {
        // Update existing progress
        const currentProgress = progress[0];
        const newProgress = (currentProgress.currentProgress || 0) + increment;
        const justCompleted = !currentProgress.isCompleted && newProgress >= relevantChallenge.targetValue;

        await db
          .update(userChallengeProgress)
          .set({
            currentProgress: newProgress,
            isCompleted: newProgress >= relevantChallenge.targetValue,
            completedAt: justCompleted ? new Date() : currentProgress.completedAt,
          })
          .where(eq(userChallengeProgress.id, currentProgress.id));

        if (justCompleted) {
          await this.awardPoints(userId, 'challenge_completed', relevantChallenge.pointsReward, `Completed daily challenge: ${relevantChallenge.description}`);
        }
      }
    } catch (error) {
      console.error('Error updating challenge progress:', error);
    }
  }

  // Process SMS action rewards
  async processSmsAction(userId: string, messageId: string): Promise<void> {
    // Award points for SMS
    await this.awardPoints(userId, 'sms_sent', RewardsService.POINT_VALUES.SMS_SENT, 'Sent SMS message', messageId);
    
    // Update SMS count
    await db
      .update(userRewards)
      .set({
        totalSmsMessages: sql`${userRewards.totalSmsMessages} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(userRewards.userId, userId));

    // Update daily streak
    await this.updateStreak(userId);

    // Update challenge progress
    await this.updateChallengeProgress(userId, 'sms_count', 1);
  }

  // Process token minting rewards
  async processTokenMintAction(userId: string, tokenId: string, valueAttached?: string): Promise<void> {
    // Award points for token minting
    await this.awardPoints(userId, 'token_minted', RewardsService.POINT_VALUES.TOKEN_MINTED, 'Minted new token', tokenId);
    
    // Additional points for value attachment
    if (valueAttached && parseFloat(valueAttached) > 0) {
      await this.awardPoints(userId, 'value_attached', RewardsService.POINT_VALUES.VALUE_ATTACHED, `Attached ${valueAttached} value to token`, tokenId);
    }

    // Update token count and value attached
    const updates: any = {
      totalTokensMinted: sql`${userRewards.totalTokensMinted} + 1`,
      updatedAt: new Date(),
    };

    if (valueAttached) {
      updates.totalValueAttached = sql`${userRewards.totalValueAttached} + ${valueAttached}`;
    }

    await db
      .update(userRewards)
      .set(updates)
      .where(eq(userRewards.userId, userId));

    // Update challenge progress
    await this.updateChallengeProgress(userId, 'token_mint', 1);
    if (valueAttached && parseFloat(valueAttached) > 0) {
      await this.updateChallengeProgress(userId, 'value_attach', 1);
    }
  }

  // Process phone registration rewards
  async processPhoneRegistrationAction(userId: string): Promise<void> {
    await this.awardPoints(userId, 'phone_registered', RewardsService.POINT_VALUES.PHONE_REGISTERED, 'Registered phone number for SMS');
  }

  // Process daily login rewards
  async processDailyLoginAction(userId: string): Promise<void> {
    // Check if already awarded today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLogin = await db
      .select()
      .from(rewardTransactions)
      .where(
        and(
          eq(rewardTransactions.userId, userId),
          eq(rewardTransactions.action, 'daily_login'),
          gte(rewardTransactions.createdAt, today),
          lte(rewardTransactions.createdAt, tomorrow)
        )
      )
      .limit(1);

    if (todayLogin.length === 0) {
      await this.awardPoints(userId, 'daily_login', RewardsService.POINT_VALUES.DAILY_LOGIN, 'Daily login bonus');
      await this.updateStreak(userId);
    }
  }
}

export const rewardsService = new RewardsService();