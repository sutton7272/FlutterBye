import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  email: text("email"),
  airdropPreferences: json("airdrop_preferences").$type<string[]>(),
  credits: decimal("credits", { precision: 18, scale: 9 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tokens = pgTable("tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  message: text("message").notNull(),
  symbol: text("symbol").notNull().default("FlBY-MSG"),
  mintAddress: text("mint_address").notNull().unique(),
  creatorId: varchar("creator_id").references(() => users.id).notNull(),
  totalSupply: integer("total_supply").notNull(),
  availableSupply: integer("available_supply").notNull(),
  valuePerToken: decimal("value_per_token", { precision: 18, scale: 9 }).default("0"),
  imageUrl: text("image_url"),
  metadata: json("metadata").$type<Record<string, any>>(),
  // Phase 2: Value attachment
  hasAttachedValue: boolean("has_attached_value").default(false),
  attachedValue: decimal("attached_value", { precision: 18, scale: 9 }).default("0"),
  currency: text("currency").default("SOL"), // SOL or USDC
  escrowStatus: text("escrow_status").default("none"), // none, escrowed, redeemed, refunded
  escrowWallet: text("escrow_wallet"),
  expiresAt: timestamp("expires_at"),
  // SMS Integration Features
  smsOrigin: boolean("sms_origin").default(false), // Created via SMS
  senderPhone: text("sender_phone"), // Phone number of sender (encrypted)
  recipientPhone: text("recipient_phone"), // Phone number of recipient (encrypted)
  emotionType: text("emotion_type"), // hug, heart, apology, celebration, etc.
  isTimeLocked: boolean("is_time_locked").default(false),
  unlocksAt: timestamp("unlocks_at"),
  isBurnToRead: boolean("is_burn_to_read").default(false),
  isReplyGated: boolean("is_reply_gated").default(false),
  requiresReply: boolean("requires_reply").default(false),
  // Public visibility
  isPublic: boolean("is_public").default(false),
  // Moderation
  isBlocked: boolean("is_blocked").default(false),
  flaggedAt: timestamp("flagged_at"),
  flaggedReason: text("flagged_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tokenHoldings = pgTable("token_holdings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tokenId: varchar("token_id").references(() => tokens.id).notNull(),
  quantity: integer("quantity").notNull(),
  purchasePrice: decimal("purchase_price", { precision: 18, scale: 9 }),
  acquiredAt: timestamp("acquired_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'mint', 'buy', 'sell', 'transfer'
  fromUserId: varchar("from_user_id").references(() => users.id),
  toUserId: varchar("to_user_id").references(() => users.id),
  tokenId: varchar("token_id").references(() => tokens.id).notNull(),
  quantity: integer("quantity").notNull(),
  pricePerToken: decimal("price_per_token", { precision: 18, scale: 9 }),
  totalValue: decimal("total_value", { precision: 18, scale: 9 }),
  solanaSignature: text("solana_signature"),
  status: text("status").notNull().default("pending"), // 'pending', 'confirmed', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const airdropSignups = pgTable("airdrop_signups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  walletAddress: text("wallet_address").notNull(),
  preferences: json("preferences").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketListings = pgTable("market_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: varchar("token_id").references(() => tokens.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  quantity: integer("quantity").notNull(),
  pricePerToken: decimal("price_per_token", { precision: 18, scale: 9 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Phase 2: New tables for redemption, analytics, and admin
export const redemptions = pgTable("redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: varchar("token_id").references(() => tokens.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  burnTransactionSignature: text("burn_transaction_signature").notNull(),
  redeemedAmount: decimal("redeemed_amount", { precision: 18, scale: 9 }).notNull(),
  currency: text("currency").notNull(),
  redemptionTransactionSignature: text("redemption_transaction_signature"),
  status: text("status").default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const escrowWallets = pgTable("escrow_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  privateKey: text("private_key").notNull(), // Encrypted
  isActive: boolean("is_active").default(true),
  totalBalance: decimal("total_balance", { precision: 18, scale: 9 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  email: text("email"),
  role: text("role").notNull().default("admin"), // admin, moderator, viewer
  permissions: json("permissions").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminLogs = pgTable("admin_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => adminUsers.id).notNull(),
  action: text("action").notNull(), // flag_token, block_wallet, force_refund, etc.
  targetType: text("target_type").notNull(), // token, user, transaction
  targetId: varchar("target_id").notNull(),
  details: json("details").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin settings table for platform configuration
export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  type: text("type").notNull(), // 'number', 'boolean', 'string', 'array'
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by").references(() => adminUsers.id),
});

// Platform statistics tracking
export const platformStats = pgTable("platform_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").defaultNow(),
  totalUsers: integer("total_users").default(0),
  totalTokens: integer("total_tokens").default(0),
  totalValueEscrowed: decimal("total_value_escrowed", { precision: 18, scale: 9 }).default("0"),
  totalRedemptions: integer("total_redemptions").default(0),
  activeUsers24h: integer("active_users_24h").default(0),
  revenueToday: decimal("revenue_today", { precision: 18, scale: 9 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User analytics and behavior tracking
export const userAnalytics = pgTable("user_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  event: text("event").notNull(), // 'login', 'token_mint', 'value_attach', etc.
  data: json("data").$type<Record<string, any>>(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Gamified Rewards System Tables
export const userRewards = pgTable("user_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  totalPoints: integer("total_points").default(0),
  currentLevel: integer("current_level").default(1),
  currentStreak: integer("current_streak").default(0), // consecutive days active
  longestStreak: integer("longest_streak").default(0),
  totalSmsMessages: integer("total_sms_messages").default(0),
  totalTokensMinted: integer("total_tokens_minted").default(0),
  totalValueAttached: decimal("total_value_attached", { precision: 18, scale: 9 }).default("0"),
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  category: text("category").notNull(), // 'sms', 'trading', 'social', 'milestone'
  requiredCondition: text("required_condition").notNull(), // 'sms_count:10', 'streak:7', etc.
  pointsReward: integer("points_reward").default(0),
  rarity: text("rarity").notNull().default("common"), // common, rare, epic, legendary
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  badgeId: varchar("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  notificationShown: boolean("notification_shown").default(false),
});

export const rewardTransactions = pgTable("reward_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'earn', 'spend', 'bonus'
  action: text("action").notNull(), // 'sms_sent', 'token_minted', 'daily_login', etc.
  pointsChange: integer("points_change").notNull(),
  description: text("description").notNull(),
  relatedId: varchar("related_id"), // token_id, sms_id, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyChallenges = pgTable("daily_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  challengeType: text("challenge_type").notNull(), // 'sms_count', 'token_mint', 'value_attach'
  targetValue: integer("target_value").notNull(),
  description: text("description").notNull(),
  pointsReward: integer("points_reward").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  challengeId: varchar("challenge_id").references(() => dailyChallenges.id).notNull(),
  currentProgress: integer("current_progress").default(0),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Redeemable codes for Free Flutterbye system
export const redeemableCodes = pgTable("redeemable_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").unique().notNull(),
  type: text("type").notNull(), // 'free_flutterbye', 'premium_bonus', etc.
  value: decimal("value", { precision: 18, scale: 9 }).default("0"),
  maxUses: integer("max_uses").default(1),
  currentUses: integer("current_uses").default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by").references(() => adminUsers.id),
});

// Updated code redemptions tracking
export const codeRedemptions = pgTable("code_redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  codeId: varchar("code_id").references(() => redeemableCodes.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  redeemedAt: timestamp("redeemed_at").defaultNow(),
});

// SMS Integration Tables
export const smsMessages = pgTable("sms_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromPhone: text("from_phone").notNull(), // Encrypted phone number
  toPhone: text("to_phone").notNull(), // Encrypted phone number
  messageBody: text("message_body").notNull(),
  tokenId: varchar("token_id").references(() => tokens.id),
  emotionType: text("emotion_type"), // hug, heart, apology, celebration
  status: text("status").default("pending"), // pending, minted, delivered, failed
  twilioSid: text("twilio_sid"), // Twilio message SID for tracking
  deliveryStatus: text("delivery_status"), // sent, delivered, failed, undelivered
  recipientWallet: text("recipient_wallet"), // Auto-discovered or manually provided
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Phone to wallet mappings (users can register their phone with wallet)
export const phoneWalletMappings = pgTable("phone_wallet_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").unique().notNull(), // Encrypted
  walletAddress: text("wallet_address").notNull(),
  isVerified: boolean("is_verified").default(false),
  verificationCode: text("verification_code"), // For SMS verification
  verificationExpiry: timestamp("verification_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  verifiedAt: timestamp("verified_at"),
});

// Emotional token interactions (reactions, burns, replies)
export const emotionalInteractions = pgTable("emotional_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: varchar("token_id").references(() => tokens.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  interactionType: text("interaction_type").notNull(), // burn_to_read, reply, reaction
  interactionData: jsonb("interaction_data"), // Stores reply message, reaction type, etc.
  burnTransactionSig: text("burn_transaction_sig"), // If token was burned to read
  createdAt: timestamp("created_at").defaultNow(),
});

// SMS delivery tracking
export const smsDeliveries = pgTable("sms_deliveries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  smsMessageId: varchar("sms_message_id").references(() => smsMessages.id).notNull(),
  tokenId: varchar("token_id").references(() => tokens.id),
  recipientPhone: text("recipient_phone").notNull(), // Encrypted
  deliveryUrl: text("delivery_url"), // flutterbye.io/view?id=xyz
  notificationSent: boolean("notification_sent").default(false),
  notificationSid: text("notification_sid"), // Twilio SID for notification SMS
  viewed: boolean("viewed").default(false),
  viewedAt: timestamp("viewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  metric: text("metric").notNull(), // tokens_minted, value_escrowed, redemptions_completed
  value: decimal("value", { precision: 18, scale: 9 }).notNull(),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTokenSchema = createInsertSchema(tokens).omit({
  id: true,
  createdAt: true,
  mintAddress: true,
}).extend({
  imageFile: z.string().optional(), // Base64 encoded image data
});

export const insertTokenHoldingSchema = createInsertSchema(tokenHoldings).omit({
  id: true,
  acquiredAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertAirdropSignupSchema = createInsertSchema(airdropSignups).omit({
  id: true,
  createdAt: true,
});

export const insertMarketListingSchema = createInsertSchema(marketListings).omit({
  id: true,
  createdAt: true,
});

export const insertRedemptionSchema = createInsertSchema(redemptions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertEscrowWalletSchema = createInsertSchema(escrowWallets).omit({
  id: true,
  createdAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertAdminLogSchema = createInsertSchema(adminLogs).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertRedeemableCodeSchema = createInsertSchema(redeemableCodes).omit({
  id: true,
  createdAt: true,
});

export const insertCodeRedemptionSchema = createInsertSchema(codeRedemptions).omit({
  id: true,
  redeemedAt: true,
});

export const insertAdminSettingsSchema = createInsertSchema(adminSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertPlatformStatsSchema = createInsertSchema(platformStats).omit({
  id: true,
  createdAt: true,
});

export const insertUserAnalyticsSchema = createInsertSchema(userAnalytics).omit({
  id: true,
  timestamp: true,
});

// SMS Integration Schemas
export const insertSmsMessageSchema = createInsertSchema(smsMessages).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertPhoneWalletMappingSchema = createInsertSchema(phoneWalletMappings).omit({
  id: true,
  createdAt: true,
  verifiedAt: true,
});

export const insertEmotionalInteractionSchema = createInsertSchema(emotionalInteractions).omit({
  id: true,
  createdAt: true,
});

export const insertSmsDeliverySchema = createInsertSchema(smsDeliveries).omit({
  id: true,
  createdAt: true,
  viewedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Token = typeof tokens.$inferSelect;
export type InsertToken = z.infer<typeof insertTokenSchema>;

export type TokenHolding = typeof tokenHoldings.$inferSelect;
export type InsertTokenHolding = z.infer<typeof insertTokenHoldingSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type AirdropSignup = typeof airdropSignups.$inferSelect;
export type InsertAirdropSignup = z.infer<typeof insertAirdropSignupSchema>;

export type MarketListing = typeof marketListings.$inferSelect;
export type InsertMarketListing = z.infer<typeof insertMarketListingSchema>;

export type Redemption = typeof redemptions.$inferSelect;
export type InsertRedemption = z.infer<typeof insertRedemptionSchema>;

export type EscrowWallet = typeof escrowWallets.$inferSelect;
export type InsertEscrowWallet = z.infer<typeof insertEscrowWalletSchema>;

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = z.infer<typeof insertAdminLogSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export type RedeemableCode = typeof redeemableCodes.$inferSelect;
export type InsertRedeemableCode = z.infer<typeof insertRedeemableCodeSchema>;

export type CodeRedemption = typeof codeRedemptions.$inferSelect;

// Gamified Rewards System Types
export const insertUserRewardSchema = createInsertSchema(userRewards).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserReward = z.infer<typeof insertUserRewardSchema>;
export type UserReward = typeof userRewards.$inferSelect;

export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true });
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true, earnedAt: true });
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;

export const insertRewardTransactionSchema = createInsertSchema(rewardTransactions).omit({ id: true, createdAt: true });
export type InsertRewardTransaction = z.infer<typeof insertRewardTransactionSchema>;
export type RewardTransaction = typeof rewardTransactions.$inferSelect;

export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).omit({ id: true, createdAt: true });
export type InsertDailyChallenge = z.infer<typeof insertDailyChallengeSchema>;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;

export const insertUserChallengeProgressSchema = createInsertSchema(userChallengeProgress).omit({ id: true, createdAt: true });
export type InsertUserChallengeProgress = z.infer<typeof insertUserChallengeProgressSchema>;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;

// Blockchain Journey Dashboard Tables
export const journeyMilestones = pgTable("journey_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'onboarding', 'engagement', 'mastery', 'social', 'value'
  requiredCondition: text("required_condition").notNull(), // 'sms_count:1', 'tokens_minted:5', etc.
  order: integer("order").notNull(), // Display order within category
  iconUrl: text("icon_url"),
  pointsReward: integer("points_reward").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userJourneyProgress = pgTable("user_journey_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  milestoneId: varchar("milestone_id").references(() => journeyMilestones.id).notNull(),
  achievedAt: timestamp("achieved_at").defaultNow(),
  notificationShown: boolean("notification_shown").default(false),
});

export const journeyInsights = pgTable("journey_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  insightType: text("insight_type").notNull(), // 'weekly_summary', 'personal_best', 'trend_analysis'
  title: text("title").notNull(),
  description: text("description").notNull(),
  data: json("data").$type<Record<string, any>>(),
  isRead: boolean("is_read").default(false),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  dashboardLayout: text("dashboard_layout").default("default"), // 'default', 'compact', 'detailed'
  notificationSettings: json("notification_settings").$type<{
    milestones: boolean;
    insights: boolean;
    challenges: boolean;
    badges: boolean;
  }>().default({
    milestones: true,
    insights: true,
    challenges: true,
    badges: true,
  }),
  favoriteCategories: text("favorite_categories").array().default(sql`ARRAY[]::text[]`),
  privacyLevel: text("privacy_level").default("public"), // 'public', 'friends', 'private'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blockchain Journey Dashboard Types
export const insertJourneyMilestoneSchema = createInsertSchema(journeyMilestones).omit({ id: true, createdAt: true });
export type InsertJourneyMilestone = z.infer<typeof insertJourneyMilestoneSchema>;
export type JourneyMilestone = typeof journeyMilestones.$inferSelect;

export const insertUserJourneyProgressSchema = createInsertSchema(userJourneyProgress).omit({ id: true, achievedAt: true });
export type InsertUserJourneyProgress = z.infer<typeof insertUserJourneyProgressSchema>;
export type UserJourneyProgress = typeof userJourneyProgress.$inferSelect;

export const insertJourneyInsightSchema = createInsertSchema(journeyInsights).omit({ id: true, createdAt: true });
export type InsertJourneyInsight = z.infer<typeof insertJourneyInsightSchema>;
export type JourneyInsight = typeof journeyInsights.$inferSelect;

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

export type InsertCodeRedemption = z.infer<typeof insertCodeRedemptionSchema>;

export type AdminSettings = typeof adminSettings.$inferSelect;
export type InsertAdminSettings = z.infer<typeof insertAdminSettingsSchema>;

export type PlatformStats = typeof platformStats.$inferSelect;
export type InsertPlatformStats = z.infer<typeof insertPlatformStatsSchema>;

export type UserAnalytics = typeof userAnalytics.$inferSelect;
export type InsertUserAnalytics = z.infer<typeof insertUserAnalyticsSchema>;

// SMS Integration Types
export type SmsMessage = typeof smsMessages.$inferSelect;
export type InsertSmsMessage = z.infer<typeof insertSmsMessageSchema>;

export type PhoneWalletMapping = typeof phoneWalletMappings.$inferSelect;
export type InsertPhoneWalletMapping = z.infer<typeof insertPhoneWalletMappingSchema>;

export type EmotionalInteraction = typeof emotionalInteractions.$inferSelect;
export type InsertEmotionalInteraction = z.infer<typeof insertEmotionalInteractionSchema>;

export type SmsDelivery = typeof smsDeliveries.$inferSelect;
export type InsertSmsDelivery = z.infer<typeof insertSmsDeliverySchema>;
