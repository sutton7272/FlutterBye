import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
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
export type InsertCodeRedemption = z.infer<typeof insertCodeRedemptionSchema>;
