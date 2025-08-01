import { db } from "./db";
import { eq, desc, sql, and, or, like } from "drizzle-orm";
import { 
  users, tokens, tokenHoldings, transactions, marketListings, airdropSignups,
  redeemableCodes, adminUsers, adminLogs, analytics, limitedEditionSets,
  chatRooms, chatMessages, redemptions, escrowWallets,
  type User, type InsertUser, 
  type Token, type InsertToken,
  type TokenHolding, type InsertTokenHolding,
  type Transaction, type InsertTransaction,
  type MarketListing, type InsertMarketListing,
  type AirdropSignup, type InsertAirdropSignup,
  type RedeemableCode, type InsertRedeemableCode,
  type AdminUser, type InsertAdminUser,
  type AdminLog, type InsertAdminLog,
  type Analytics, type InsertAnalytics,
  type LimitedEditionSet, type InsertLimitedEditionSet,
  type ChatRoom, type InsertChatRoom,
  type ChatMessage, type InsertChatMessage,
  type Redemption, type InsertRedemption,
  type EscrowWallet, type InsertEscrowWallet
} from "@shared/schema";

export class DatabaseStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserCredits(userId: string, credits: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ credits })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Token operations
  async getToken(id: string): Promise<Token | undefined> {
    const [token] = await db.select().from(tokens).where(eq(tokens.id, id));
    return token;
  }

  async getTokenByMintAddress(mintAddress: string): Promise<Token | undefined> {
    const [token] = await db.select().from(tokens).where(eq(tokens.mintAddress, mintAddress));
    return token;
  }

  async createToken(insertToken: InsertToken | any): Promise<Token> {
    const [token] = await db.insert(tokens).values(insertToken).returning();
    return token;
  }

  async updateTokenSupply(tokenId: string, availableSupply: number): Promise<Token> {
    const [token] = await db
      .update(tokens)
      .set({ availableSupply })
      .where(eq(tokens.id, tokenId))
      .returning();
    return token;
  }

  async getTokensByCreator(creatorId: string): Promise<Token[]> {
    return await db
      .select()
      .from(tokens)
      .where(eq(tokens.creatorId, creatorId))
      .orderBy(desc(tokens.createdAt));
  }

  async getTokensByCreatorWallet(walletAddress: string): Promise<Token[]> {
    return await db
      .select()
      .from(tokens)
      .leftJoin(users, eq(tokens.creatorId, users.id))
      .where(eq(users.walletAddress, walletAddress))
      .orderBy(desc(tokens.createdAt));
  }

  async getTokensByRecipient(walletAddress: string): Promise<Token[]> {
    // This would require a more complex query with token holdings
    return await db
      .select()
      .from(tokens)
      .leftJoin(tokenHoldings, eq(tokens.id, tokenHoldings.tokenId))
      .leftJoin(users, eq(tokenHoldings.userId, users.id))
      .where(eq(users.walletAddress, walletAddress))
      .orderBy(desc(tokens.createdAt));
  }

  async getAllTokens(limit = 50, offset = 0): Promise<Token[]> {
    return await db
      .select()
      .from(tokens)
      .orderBy(desc(tokens.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getAllTokensWithOptions(options: {
    limit: number;
    offset: number;
    search?: string;
    sortBy?: string;
  }): Promise<Token[]> {
    let query = db.select().from(tokens);

    // Apply search filter
    if (options.search) {
      query = query.where(
        or(
          like(tokens.message, `%${options.search}%`),
          like(tokens.symbol, `%${options.search}%`)
        )
      );
    }

    // Apply sorting
    if (options.sortBy === 'value') {
      query = query.orderBy(desc(tokens.valuePerToken));
    } else {
      query = query.orderBy(desc(tokens.createdAt));
    }

    return await query.limit(options.limit).offset(options.offset);
  }

  async searchTokens(query: string): Promise<Token[]> {
    return await db
      .select()
      .from(tokens)
      .where(like(tokens.message, `%${query}%`))
      .orderBy(desc(tokens.createdAt));
  }

  async updateToken(tokenId: string, updateData: Partial<Token>): Promise<Token> {
    const [token] = await db
      .update(tokens)
      .set(updateData)
      .where(eq(tokens.id, tokenId))
      .returning();
    return token;
  }

  // Token Holdings operations
  async getTokenHolding(id: string): Promise<TokenHolding | undefined> {
    const [holding] = await db.select().from(tokenHoldings).where(eq(tokenHoldings.id, id));
    return holding;
  }

  async createTokenHolding(insertHolding: InsertTokenHolding): Promise<TokenHolding> {
    const [holding] = await db.insert(tokenHoldings).values(insertHolding).returning();
    return holding;
  }

  async getTokenHoldingsByUser(userId: string): Promise<TokenHolding[]> {
    return await db
      .select()
      .from(tokenHoldings)
      .where(eq(tokenHoldings.userId, userId));
  }

  async updateTokenHolding(holdingId: string, amount: number): Promise<TokenHolding> {
    const [holding] = await db
      .update(tokenHoldings)
      .set({ amount })
      .where(eq(tokenHoldings.id, holdingId))
      .returning();
    return holding;
  }

  // Transaction operations
  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(or(eq(transactions.fromUserId, userId), eq(transactions.toUserId, userId)))
      .orderBy(desc(transactions.createdAt));
  }

  // Market Listing operations
  async getMarketListing(id: string): Promise<MarketListing | undefined> {
    const [listing] = await db.select().from(marketListings).where(eq(marketListings.id, id));
    return listing;
  }

  async createMarketListing(insertListing: InsertMarketListing): Promise<MarketListing> {
    const [listing] = await db.insert(marketListings).values(insertListing).returning();
    return listing;
  }

  async getActiveMarketListings(): Promise<MarketListing[]> {
    return await db
      .select()
      .from(marketListings)
      .where(eq(marketListings.isActive, true))
      .orderBy(desc(marketListings.createdAt));
  }

  // Admin operations
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return admin;
  }

  async createAdminUser(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const [admin] = await db.insert(adminUsers).values(insertAdmin).returning();
    return admin;
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers).orderBy(desc(adminUsers.createdAt));
  }

  async createAdminLog(insertLog: InsertAdminLog): Promise<AdminLog> {
    const [log] = await db.insert(adminLogs).values(insertLog).returning();
    return log;
  }

  // Redemption operations
  async createRedemption(insertRedemption: InsertRedemption | any): Promise<Redemption> {
    const [redemption] = await db.insert(redemptions).values(insertRedemption).returning();
    return redemption;
  }

  async getRedemptionsByWallet(walletAddress: string): Promise<Redemption[]> {
    return await db
      .select()
      .from(redemptions)
      .leftJoin(users, eq(redemptions.userId, users.id))
      .where(eq(users.walletAddress, walletAddress))
      .orderBy(desc(redemptions.createdAt));
  }

  // Analytics operations
  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const [analytics_] = await db.insert(analytics).values(insertAnalytics).returning();
    return analytics_;
  }

  async getAnalyticsByDateRange(startDate: Date, endDate: Date): Promise<Analytics[]> {
    return await db
      .select()
      .from(analytics)
      .where(and(
        sql`${analytics.createdAt} >= ${startDate}`,
        sql`${analytics.createdAt} <= ${endDate}`
      ))
      .orderBy(desc(analytics.createdAt));
  }

  // Limited Edition operations
  async createLimitedEditionSet(insertSet: InsertLimitedEditionSet): Promise<LimitedEditionSet> {
    const [set] = await db.insert(limitedEditionSets).values(insertSet).returning();
    return set;
  }

  async getLimitedEditionSet(id: string): Promise<LimitedEditionSet | undefined> {
    const [set] = await db.select().from(limitedEditionSets).where(eq(limitedEditionSets.id, id));
    return set;
  }

  async getActiveLimitedEditionSets(): Promise<LimitedEditionSet[]> {
    return await db
      .select()
      .from(limitedEditionSets)
      .where(eq(limitedEditionSets.isActive, true))
      .orderBy(desc(limitedEditionSets.createdAt));
  }

  // Chat operations
  async createChatRoom(insertRoom: InsertChatRoom): Promise<ChatRoom> {
    const [room] = await db.insert(chatRooms).values(insertRoom).returning();
    return room;
  }

  async getChatRoom(id: string): Promise<ChatRoom | undefined> {
    const [room] = await db.select().from(chatRooms).where(eq(chatRooms.id, id));
    return room;
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(insertMessage).returning();
    return message;
  }

  async getChatMessagesByRoom(roomId: string, limit = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.roomId, roomId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();