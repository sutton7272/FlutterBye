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
