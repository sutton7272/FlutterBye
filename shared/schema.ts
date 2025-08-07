import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users: any = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  email: text("email"),
  airdropPreferences: json("airdrop_preferences").$type<string[]>(),
  credits: decimal("credits", { precision: 18, scale: 9 }).default("0"),
  // Admin role management
  role: text("role").default("user"), // 'user', 'admin', 'super_admin'
  isAdmin: boolean("is_admin").default(false),
  adminPermissions: json("admin_permissions").$type<string[]>(), // ['dashboard', 'users', 'wallet_management', 'settings']
  adminAddedBy: varchar("admin_added_by").references((): any => users.id),
  adminAddedAt: timestamp("admin_added_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tokens = pgTable("tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  message: text("message").notNull(),
  symbol: text("symbol").notNull().default("FLBY-MSG"),
  mintAddress: text("mint_address").notNull().unique(),
  creatorId: varchar("creator_id").references(() => users.id).notNull(),
  totalSupply: integer("total_supply").notNull(),
  availableSupply: integer("available_supply").notNull(),
  valuePerToken: decimal("value_per_token", { precision: 18, scale: 9 }).default("0"),
  imageUrl: text("image_url"),
  metadata: json("metadata").$type<Record<string, any>>(),
  
  // Enhanced metadata for Solscan display
  additionalMessages: json("additional_messages").$type<string[]>(), // Array of additional text messages
  links: json("links").$type<Array<{url: string, title: string}>>(), // Array of {url, title} objects
  gifs: json("gifs").$type<string[]>(), // Array of GIF URLs
  solscanMetadata: json("solscan_metadata").$type<Record<string, any>>(), // Custom metadata for blockchain display
  
  // Phase 2: Value attachment
  hasAttachedValue: boolean("has_attached_value").default(false),
  attachedValue: decimal("attached_value", { precision: 18, scale: 9 }).default("0"),
  currency: text("currency").default("SOL"), // SOL, USDC, or FLBY
  escrowStatus: text("escrow_status").default("none"), // none, escrowed, redeemed, refunded
  escrowWallet: text("escrow_wallet"),
  expiresAt: timestamp("expires_at"),
  
  // Pricing and fee information
  mintingCostPerToken: decimal("minting_cost_per_token", { precision: 18, scale: 9 }).default("0.01"), // Base cost per token including gas
  gasFeeIncluded: boolean("gas_fee_included").default(true),
  bulkDiscountApplied: decimal("bulk_discount_applied", { precision: 5, scale: 2 }).default("0"), // Percentage discount applied
  totalMintingCost: decimal("total_minting_cost", { precision: 18, scale: 9 }).default("0"), // Total cost paid by user
  
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
  
  // Limited Edition fields
  isLimitedEdition: boolean("is_limited_edition").default(false),
  editionNumber: integer("edition_number"), // Current edition number (1, 2, 3...)
  limitedEditionSetId: varchar("limited_edition_set_id").references(() => limitedEditionSets.id),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Blockchain Chat System
export const chatRooms = pgTable("chat_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(true),
  maxParticipants: integer("max_participants").default(50),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").references(() => chatRooms.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  senderWallet: text("sender_wallet").notNull(),
  message: text("message").notNull(),
  messageType: text("message_type").default("text"), // text, token_share, gif, image
  
  // Blockchain integration
  blockchainHash: text("blockchain_hash"), // Transaction hash when message is committed to blockchain
  blockchainStatus: text("blockchain_status").default("pending"), // pending, confirmed, failed
  mintAddress: text("mint_address"), // If sharing a token
  
  // Message features
  isEdited: boolean("is_edited").default(false),
  editedAt: timestamp("edited_at"),
  replyToMessageId: varchar("reply_to_message_id").references((): any => chatMessages.id),
  
  // Moderation
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatParticipants = pgTable("chat_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").references(() => chatRooms.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  walletAddress: text("wallet_address").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  isOnline: boolean("is_online").default(false),
});

// Redemption Codes
export const redemptionCodes = pgTable("redemption_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 50 }).notNull().unique(),
  maxUses: integer("max_uses").notNull().default(1),
  currentUses: integer("current_uses").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export type RedemptionCode = typeof redemptionCodes.$inferSelect;
export type InsertRedemptionCode = typeof redemptionCodes.$inferInsert;

// Limited Edition Token Sets
export const limitedEditionSets = pgTable("limited_edition_sets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").references(() => users.id).notNull(),
  name: text("name").notNull(), // Name of the limited edition set
  description: text("description"),
  baseMessage: text("base_message").notNull(), // Base message for the tokens
  totalEditions: integer("total_editions").notNull(), // Total number of editions to create
  mintedEditions: integer("minted_editions").default(0), // Number already minted
  pricePerEdition: decimal("price_per_edition", { precision: 18, scale: 9 }).default("0.01"),
  isActive: boolean("is_active").default(true),
  category: text("category").default("limited"),
  imageUrl: text("image_url"), // Base image for all editions
  
  // Limited edition specific metadata
  editionPrefix: text("edition_prefix").default("#"), // e.g., "#1", "#2", etc.
  rarityTier: text("rarity_tier").default("rare"), // common, rare, epic, legendary
  specialProperties: json("special_properties").$type<Record<string, any>>(),
  
  // Sale configuration
  saleStartsAt: timestamp("sale_starts_at"),
  saleEndsAt: timestamp("sale_ends_at"),
  maxPurchasePerWallet: integer("max_purchase_per_wallet").default(1),
  
  // Blockchain configuration
  masterMintAddress: text("master_mint_address"), // Master collection mint address
  royaltyPercentage: decimal("royalty_percentage", { precision: 5, scale: 2 }).default("5"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  platformFee: decimal("platform_fee", { precision: 18, scale: 9 }).notNull(), // Fee paid to Flutterbye
  feePercentage: decimal("fee_percentage", { precision: 5, scale: 2 }).notNull(), // Percentage charged
  netAmount: decimal("net_amount", { precision: 18, scale: 9 }).notNull(), // Amount after fees
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

// Dynamic pricing tiers based on quantity minted
export const pricingTiers = pgTable("pricing_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tierName: text("tier_name").notNull().unique(), // 'starter', 'bulk_100', 'bulk_500', 'bulk_1000', etc.
  minQuantity: integer("min_quantity").notNull().default(1),
  maxQuantity: integer("max_quantity"), // null for unlimited
  basePricePerToken: decimal("base_price_per_token", { precision: 18, scale: 9 }).notNull(),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"), // 0-100%
  finalPricePerToken: decimal("final_price_per_token", { precision: 18, scale: 9 }).notNull(), // After discount
  currency: text("currency").notNull().default("USD"), // USD, SOL, USDC, FLBY
  gasFeeIncluded: boolean("gas_fee_included").default(true),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0), // For admin panel ordering
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Platform fee configuration
export const platformFees = pgTable("platform_fees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  feeType: text("fee_type").notNull().unique(), // 'value_redemption', 'minting', 'marketplace'
  feePercentage: decimal("fee_percentage", { precision: 5, scale: 2 }).notNull(), // 0-100%
  minimumFee: decimal("minimum_fee", { precision: 18, scale: 9 }).default("0"),
  maximumFee: decimal("maximum_fee", { precision: 18, scale: 9 }), // null for unlimited
  isActive: boolean("is_active").default(true),
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

// Enhanced code redemptions tracking with comprehensive user data
export const codeRedemptions = pgTable("code_redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  codeId: varchar("code_id").references(() => redeemableCodes.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  walletAddress: text("wallet_address").notNull(),
  tokenId: varchar("token_id").references(() => tokens.id), // Token created with this redemption
  ipAddress: text("ip_address"), // For analytics and fraud prevention
  userAgent: text("user_agent"), // Browser/device information
  savingsAmount: decimal("savings_amount", { precision: 18, scale: 9 }).default("0"), // How much they saved
  originalCost: decimal("original_cost", { precision: 18, scale: 9 }).default("0"), // What they would have paid
  referralSource: text("referral_source"), // How they found the code
  geolocation: json("geolocation").$type<{country?: string, region?: string, city?: string}>(),
  metadata: json("metadata").$type<Record<string, any>>(),
  redeemedAt: timestamp("redeemed_at").defaultNow(),
});

// Platform pricing configuration for centralized pricing management
export const pricingConfig = pgTable("pricing_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  configKey: text("config_key").notNull().unique(), // 'base_minting_fee', 'image_upload_fee', etc.
  configValue: decimal("config_value", { precision: 18, scale: 9 }).notNull(),
  currency: text("currency").default("SOL"), // SOL, USDC, FLBY
  description: text("description"),
  category: text("category").notNull(), // 'minting', 'features', 'value_attachment', 'discounts'
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by").references(() => users.id),
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

// System Settings for Admin Configuration
export const systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(), // e.g., "default_token_image", "platform_name", etc.
  value: text("value"), // Stored as text, can be JSON stringified for complex values
  category: text("category").default("general"), // general, tokens, pricing, features, etc.
  description: text("description"), // Human-readable description of the setting
  dataType: text("data_type").default("string"), // string, number, boolean, json, image_url
  isEditable: boolean("is_editable").default(true), // Whether admins can edit this setting
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NOTE: walletIntelligence schema moved to comprehensive version below to avoid duplicates

// Batch Upload Tracking
export const walletBatches = pgTable("wallet_batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchName: text("batch_name").notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id).notNull(),
  fileName: text("file_name"),
  totalWallets: integer("total_wallets").default(0),
  processedWallets: integer("processed_wallets").default(0),
  successfulAnalyses: integer("successful_analyses").default(0),
  failedAnalyses: integer("failed_analyses").default(0),
  status: text("status").default("processing"), // 'processing', 'completed', 'failed'
  processingStarted: timestamp("processing_started").defaultNow(),
  processingCompleted: timestamp("processing_completed"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enterprise Escrow Wallets for Bank-Level Transactions
export const enterpriseEscrowWallets = pgTable("enterprise_escrow_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: text("client_id").notNull(),
  multisigAddress: text("multisig_address").notNull().unique(),
  signatoryAddresses: json("signatory_addresses").$type<string[]>(),
  requiredSignatures: integer("required_signatures").notNull(),
  contractValue: decimal("contract_value", { precision: 18, scale: 9 }).notNull(),
  currency: text("currency").notNull(), // SOL, USDC, FLBY
  status: text("status").default("active"), // active, locked, released, disputed
  complianceLevel: text("compliance_level").default("bank-level"), // standard, enhanced, bank-level
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enterprise Wallet Audit Trail
export const enterpriseWalletAuditTrail = pgTable("enterprise_wallet_audit_trail", { 
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").references(() => enterpriseEscrowWallets.id).notNull(),
  action: text("action").notNull(), // WALLET_CREATED, FUNDS_DEPOSITED, FUNDS_RELEASED, etc.
  actor: text("actor").notNull(), // SYSTEM, MULTI_SIG, CLIENT, ADMIN
  transactionHash: text("transaction_hash"),
  amount: decimal("amount", { precision: 18, scale: 9 }),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Analysis Queue for Background Processing
export const analysisQueue = pgTable("analysis_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  priority: integer("priority").default(1), // 1=low, 2=medium, 3=high, 4=critical
  status: text("status").default("queued"), // 'queued', 'processing', 'completed', 'failed'
  attempts: integer("attempts").default(0),
  maxAttempts: integer("max_attempts").default(3),
  batchId: varchar("batch_id").references(() => walletBatches.id),
  requestedBy: varchar("requested_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTokenSchema = createInsertSchema(tokens, {
  totalSupply: z.number().int().positive().min(1).max(1000000),
  availableSupply: z.number().int().positive().min(0).max(1000000),
  message: z.string().min(1).max(27)
}).omit({
  id: true,
  createdAt: true,
  mintAddress: true,
}).extend({
  imageFile: z.string().optional(), // Base64 encoded image data
});

export const insertLimitedEditionSetSchema = createInsertSchema(limitedEditionSets, {
  totalEditions: z.number().int().positive().min(1).max(10000),
  pricePerEdition: z.string().min(1),
  maxPurchasePerWallet: z.number().int().positive().min(1).max(100),
  baseMessage: z.string().min(1).max(20) // Leave room for edition number
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  mintedEditions: true,
  masterMintAddress: true,
});

export const insertTokenHoldingSchema = createInsertSchema(tokenHoldings, {
  quantity: z.number().int().positive().min(1)
}).omit({
  id: true,
  acquiredAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions, {
  quantity: z.number().int().positive().min(1)
}).omit({
  id: true,
  createdAt: true,
});

export const insertAirdropSignupSchema = createInsertSchema(airdropSignups).omit({
  id: true,
  createdAt: true,
});

export const insertMarketListingSchema = createInsertSchema(marketListings, {
  quantity: z.number().int().positive().min(1)
}).omit({
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

export const insertRedemptionCodeSchema = createInsertSchema(redemptionCodes).omit({
  id: true,
  createdAt: true,
});
export type InsertRedemptionCodeForm = z.infer<typeof insertRedemptionCodeSchema>;

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

// Chat System Schemas
export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
  editedAt: true,
  deletedAt: true,
});

export const insertChatParticipantSchema = createInsertSchema(chatParticipants).omit({
  id: true,
  joinedAt: true,
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

// System Settings types
export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;

export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

// NOTE: Wallet Intelligence schemas moved to comprehensive version below to avoid duplicates

export const insertWalletBatchSchema = createInsertSchema(walletBatches).omit({
  id: true,
  createdAt: true,
  processingStarted: true,
});

export const insertAnalysisQueueSchema = createInsertSchema(analysisQueue).omit({
  id: true,
  createdAt: true,
});

export type InsertWalletBatch = z.infer<typeof insertWalletBatchSchema>;
export type WalletBatch = typeof walletBatches.$inferSelect;
export type InsertAnalysisQueue = z.infer<typeof insertAnalysisQueueSchema>;
export type AnalysisQueue = typeof analysisQueue.$inferSelect;

export type RedeemableCode = typeof redeemableCodes.$inferSelect;
export type InsertRedeemableCode = z.infer<typeof insertRedeemableCodeSchema>;

export type CodeRedemption = typeof codeRedemptions.$inferSelect;
// Voice messages table for production voice functionality
export const voiceMessages = pgTable("voice_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  audioUrl: text("audio_url").notNull(),
  duration: integer("duration").notNull(), // in seconds
  type: text("type").notNull().default("voice"), // 'voice' | 'music'
  transcription: text("transcription"),
  tokenId: varchar("token_id").references(() => tokens.id),
  chatMessageId: varchar("chat_message_id").references(() => chatMessages.id),
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform Wallet Management System
export const platformWallets = pgTable("platform_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletType: text("wallet_type").notNull(), // 'gas_funding', 'fee_collection', 'treasury', 'escrow_master', 'emergency_backup'
  walletAddress: text("wallet_address").notNull().unique(),
  privateKey: text("private_key"), // Encrypted, only for gas funding wallet
  publicKey: text("public_key").notNull(),
  network: text("network").notNull().default("devnet"), // 'devnet' | 'mainnet-beta'
  balance: decimal("balance", { precision: 18, scale: 9 }).default("0"),
  currency: text("currency").notNull().default("SOL"), // SOL, USDC, FLBY
  isActive: boolean("is_active").default(true),
  isPrimary: boolean("is_primary").default(false), // Only one primary per type
  description: text("description"),
  lastBalanceCheck: timestamp("last_balance_check"),
  minimumBalance: decimal("minimum_balance", { precision: 18, scale: 9 }).default("0.1"), // Alert threshold
  alertsEnabled: boolean("alerts_enabled").default(true),
  metadata: json("metadata").$type<{
    createdBy?: string;
    purpose?: string;
    gasEstimate?: number;
    feeCollectionRate?: number;
    backupOf?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

// Wallet transaction logs for audit and monitoring
export const walletTransactions = pgTable("wallet_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").references(() => platformWallets.id).notNull(),
  transactionType: text("transaction_type").notNull(), // 'fee_collection', 'gas_payment', 'transfer_in', 'transfer_out'
  amount: decimal("amount", { precision: 18, scale: 9 }).notNull(),
  currency: text("currency").notNull().default("SOL"),
  fromAddress: text("from_address"),
  toAddress: text("to_address"),
  transactionSignature: text("transaction_signature"),
  blockchainNetwork: text("blockchain_network").default("solana"),
  status: text("status").notNull().default("pending"), // 'pending', 'confirmed', 'failed'
  purpose: text("purpose"), // Description of transaction purpose
  relatedTokenId: varchar("related_token_id").references(() => tokens.id),
  relatedUserId: varchar("related_user_id").references(() => users.id),
  gasUsed: decimal("gas_used", { precision: 18, scale: 9 }),
  fees: decimal("fees", { precision: 18, scale: 9 }),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wallet health monitoring and alerts
export const walletAlerts = pgTable("wallet_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").references(() => platformWallets.id).notNull(),
  alertType: text("alert_type").notNull(), // 'low_balance', 'transaction_failed', 'suspicious_activity', 'maintenance_required'
  severity: text("severity").notNull().default("medium"), // 'low', 'medium', 'high', 'critical'
  title: text("title").notNull(),
  message: text("message").notNull(),
  currentBalance: decimal("current_balance", { precision: 18, scale: 9 }),
  thresholdBalance: decimal("threshold_balance", { precision: 18, scale: 9 }),
  isResolved: boolean("is_resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  actionTaken: text("action_taken"),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type VoiceMessage = typeof voiceMessages.$inferSelect;
export type InsertVoiceMessage = typeof voiceMessages.$inferInsert;
// Removed duplicate - using the one with proper schema reference below
export type PricingConfig = typeof pricingConfig.$inferSelect;
export type InsertPricingConfig = typeof pricingConfig.$inferInsert;

// Gamified Rewards System Types
export const insertUserRewardSchema = createInsertSchema(userRewards).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserReward = z.infer<typeof insertUserRewardSchema>;
export type UserReward = typeof userRewards.$inferSelect;

// Pricing Tier Types
export const insertPricingTierSchema = createInsertSchema(pricingTiers).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPricingTier = z.infer<typeof insertPricingTierSchema>;
export type PricingTier = typeof pricingTiers.$inferSelect;

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

// Blog Posts for SEO and Marketing
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  metaDescription: text("meta_description"),
  featuredImage: text("featured_image"),
  tags: json("tags").$type<string[]>(),
  keywords: json("keywords").$type<string[]>(),
  author: text("author").default("Flutterbye AI"),
  readTime: text("read_time"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Comments
export const blogComments = pgTable("blog_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").references(() => blogPosts.id).notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  content: text("content").notNull(),
  approved: boolean("approved").default(false),
  parentCommentId: varchar("parent_comment_id").references((): any => blogComments.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog schema types and validation
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogCommentSchema = createInsertSchema(blogComments).omit({
  id: true,
  createdAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogComment = z.infer<typeof insertBlogCommentSchema>;
export type BlogComment = typeof blogComments.$inferSelect;

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

export type LimitedEditionSet = typeof limitedEditionSets.$inferSelect;
export type InsertLimitedEditionSet = z.infer<typeof insertLimitedEditionSetSchema>;

// Chat System Types
export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type ChatParticipant = typeof chatParticipants.$inferSelect;
export type InsertChatParticipant = z.infer<typeof insertChatParticipantSchema>;

// Custom Badge System Tables
export const customUserBadges = pgTable("custom_user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  description: varchar("description", { length: 200 }),
  backgroundColor: varchar("background_color", { length: 7 }).default("#1a1a1a"),
  textColor: varchar("text_color", { length: 7 }).default("#ffffff"),
  borderColor: varchar("border_color", { length: 7 }).default("#8b5cf6"),
  icon: varchar("icon", { length: 50 }).default("star"),
  pattern: varchar("pattern", { length: 20 }).default("solid"),
  mintAddress: varchar("mint_address"),
  isNFT: boolean("is_nft").default(false),
  shareableUrl: varchar("shareable_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const customBadgeShares = pgTable("custom_badge_shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  badgeId: varchar("badge_id").notNull(),
  sharedBy: varchar("shared_by").notNull(),
  sharedWith: varchar("shared_with"),
  platform: varchar("platform", { length: 20 }), // twitter, discord, telegram
  shareCount: integer("share_count").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customBadgeTemplates = pgTable("custom_badge_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 50 }).notNull(),
  description: varchar("description", { length: 200 }),
  category: varchar("category", { length: 30 }).notNull(), // achievement, social, custom
  backgroundColor: varchar("background_color", { length: 7 }).notNull(),
  textColor: varchar("text_color", { length: 7 }).notNull(),
  borderColor: varchar("border_color", { length: 7 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  pattern: varchar("pattern", { length: 20 }).notNull(),
  isPublic: boolean("is_public").default(true),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Custom Badge insert schemas
export const insertCustomUserBadgeSchema = createInsertSchema(customUserBadges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomBadgeShareSchema = createInsertSchema(customBadgeShares).omit({
  id: true,
  createdAt: true,
});

export const insertCustomBadgeTemplateSchema = createInsertSchema(customBadgeTemplates).omit({
  id: true,
  createdAt: true,
});

// Custom Badge types
export type CustomUserBadge = typeof customUserBadges.$inferSelect;
export type InsertCustomUserBadge = z.infer<typeof insertCustomUserBadgeSchema>;

export type CustomBadgeShare = typeof customBadgeShares.$inferSelect;
export type InsertCustomBadgeShare = z.infer<typeof insertCustomBadgeShareSchema>;

export type CustomBadgeTemplate = typeof customBadgeTemplates.$inferSelect;
export type InsertCustomBadgeTemplate = z.infer<typeof insertCustomBadgeTemplateSchema>;

// Re-export content management schemas
export * from "./content-schema";

// Wallet management types - added at end to avoid initialization issues
export type PlatformWallet = typeof platformWallets.$inferSelect;
export type InsertPlatformWallet = typeof platformWallets.$inferInsert;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = typeof walletTransactions.$inferInsert;
export type WalletAlert = typeof walletAlerts.$inferSelect;
export type InsertWalletAlert = typeof walletAlerts.$inferInsert;

export const insertPlatformWalletSchema = createInsertSchema(platformWallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertWalletAlertSchema = createInsertSchema(walletAlerts).omit({
  id: true,
  createdAt: true,
});

// Wallet Intelligence Schema - Revolutionary Social Credit Score System
export const walletIntelligence = pgTable("wallet_intelligence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: varchar("wallet_address").notNull(),
  blockchain: varchar("blockchain", { length: 20 }).notNull().default("solana"), // solana, ethereum, bitcoin
  network: varchar("network", { length: 20 }).default("mainnet"), // mainnet, testnet, devnet
  socialCreditScore: integer("social_credit_score").default(0),
  riskLevel: varchar("risk_level", { length: 20 }).default("unknown"), // low, medium, high, critical, unknown
  tradingBehaviorScore: integer("trading_behavior_score").default(0),
  portfolioQualityScore: integer("portfolio_quality_score").default(0),
  liquidityScore: integer("liquidity_score").default(0),
  activityScore: integer("activity_score").default(0),
  defiEngagementScore: integer("defi_engagement_score").default(0),
  
  // Marketing Intelligence Data
  marketingSegment: varchar("marketing_segment", { length: 50 }).default("unknown"), // whale, retail, degen, institutional
  communicationStyle: varchar("communication_style", { length: 50 }).default("casual"), // technical, casual, formal
  preferredTokenTypes: text("preferred_token_types").array().default(sql`ARRAY[]::text[]`),
  riskTolerance: varchar("risk_tolerance", { length: 30 }).default("moderate"), // conservative, moderate, aggressive, extreme
  investmentProfile: text("investment_profile"),
  tradingFrequency: varchar("trading_frequency", { length: 30 }).default("unknown"),
  portfolioSize: varchar("portfolio_size", { length: 20 }).default("unknown"), // small, medium, large, whale
  influenceScore: integer("influence_score").default(0),
  socialConnections: integer("social_connections").default(0),
  
  // Comprehensive Marketing Insights (JSON field)
  marketingInsights: json("marketing_insights").$type<{
    targetAudience: string;
    messagingStrategy: string;
    bestContactTimes: string[];
    preferredCommunicationChannels: string[];
    interests: string[];
    behaviorPatterns: string[];
    marketingRecommendations: string[];
  }>().default({
    targetAudience: "general audience",
    messagingStrategy: "educational",
    bestContactTimes: [],
    preferredCommunicationChannels: [],
    interests: [],
    behaviorPatterns: [],
    marketingRecommendations: []
  }),
  
  // Comprehensive Analysis Data (JSON field)
  analysisData: json("analysis_data").$type<{
    blockchainData: any;
    aiAnalysis: any;
    calculatedAt: string;
    riskFactors: string[];
    behaviorPatterns: any;
    portfolioAnalysis: any;
  }>(),
  
  // Collection metadata
  sourcePlatform: varchar("source_platform", { length: 50 }), // FlutterBye, PerpeTrader, Manual
  collectionMethod: varchar("collection_method", { length: 50 }), // automatic, manual, imported
  lastAnalyzed: timestamp("last_analyzed").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  // Unique constraint on wallet address + blockchain combination
  walletBlockchainUnique: sql`UNIQUE (wallet_address, blockchain)`,
}));

export const insertWalletIntelligenceSchema = createInsertSchema(walletIntelligence).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type WalletIntelligence = typeof walletIntelligence.$inferSelect;
export type InsertWalletIntelligence = z.infer<typeof insertWalletIntelligenceSchema>;
