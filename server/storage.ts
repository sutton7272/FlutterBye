import { type User, type InsertUser, type Token, type InsertToken, type TokenHolding, type InsertTokenHolding, type Transaction, type InsertTransaction, type AirdropSignup, type InsertAirdropSignup, type MarketListing, type InsertMarketListing, type Redemption, type InsertRedemption, type EscrowWallet, type InsertEscrowWallet, type AdminUser, type InsertAdminUser, type AdminLog, type InsertAdminLog, type Analytics, type InsertAnalytics, users, tokens, tokenHoldings, transactions, airdropSignups, marketListings, redemptions, escrowWallets, adminUsers, adminLogs, analytics } from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, and, or, gte, lte, count } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(userId: string, credits: string): Promise<User>;

  // Token operations
  getToken(id: string): Promise<Token | undefined>;
  getTokenByMintAddress(mintAddress: string): Promise<Token | undefined>;
  createToken(token: InsertToken): Promise<Token>;
  updateTokenSupply(tokenId: string, availableSupply: number): Promise<Token>;
  getTokensByCreator(creatorId: string): Promise<Token[]>;
  getAllTokens(limit?: number, offset?: number): Promise<Token[]>;
  searchTokens(query: string): Promise<Token[]>;

  // Token holdings operations
  getTokenHolding(userId: string, tokenId: string): Promise<TokenHolding | undefined>;
  createTokenHolding(holding: InsertTokenHolding): Promise<TokenHolding>;
  updateTokenHolding(userId: string, tokenId: string, quantity: number): Promise<TokenHolding>;
  getUserHoldings(userId: string): Promise<TokenHolding[]>;

  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  updateTransactionStatus(transactionId: string, status: string, signature?: string): Promise<Transaction>;

  // Airdrop operations
  createAirdropSignup(signup: InsertAirdropSignup): Promise<AirdropSignup>;
  getAirdropSignups(): Promise<AirdropSignup[]>;

  // Market listing operations
  createMarketListing(listing: InsertMarketListing): Promise<MarketListing>;
  getMarketListings(tokenId?: string): Promise<MarketListing[]>;
  updateMarketListing(listingId: string, isActive: boolean): Promise<MarketListing>;
  getActiveListings(): Promise<MarketListing[]>;

  // Phase 2: Token value and escrow operations
  updateTokenEscrowStatus(tokenId: string, status: string, escrowWallet?: string): Promise<Token>;
  getTokensWithValue(): Promise<Token[]>;
  getPublicTokens(limit?: number, offset?: number): Promise<Token[]>;
  flagToken(tokenId: string, reason: string, adminId: string): Promise<Token>;
  blockToken(tokenId: string, adminId: string): Promise<Token>;

  // Phase 2: Redemption operations
  createRedemption(redemption: InsertRedemption): Promise<Redemption>;
  getRedemption(id: string): Promise<Redemption | undefined>;
  getUserRedemptions(userId: string): Promise<Redemption[]>;
  updateRedemptionStatus(redemptionId: string, status: string, signature?: string): Promise<Redemption>;
  getRedemptionsByToken(tokenId: string): Promise<Redemption[]>;

  // Phase 2: Escrow wallet operations
  createEscrowWallet(wallet: InsertEscrowWallet): Promise<EscrowWallet>;
  getActiveEscrowWallet(): Promise<EscrowWallet | undefined>;
  updateEscrowBalance(walletId: string, balance: string): Promise<EscrowWallet>;

  // Phase 2: Admin operations
  createAdminUser(admin: InsertAdminUser): Promise<AdminUser>;
  getAdminByWallet(walletAddress: string): Promise<AdminUser | undefined>;
  updateAdminStatus(adminId: string, isActive: boolean): Promise<AdminUser>;
  getAdminUsers(): Promise<AdminUser[]>;
  getSuperAdmins(): Promise<AdminUser[]>;
  updateUserAdminStatus(userId: string, updates: Partial<User>): Promise<User>;
  updateUserBlockStatus(userId: string, blocked: boolean, reason?: string): Promise<User>;
  getAllUsersForAdmin(): Promise<User[]>;
  getPlatformStats(): Promise<any>;
  getRecentAdminActivity(): Promise<any>;
  getPlatformSettings(): Promise<any>;
  updatePlatformSettings(settings: any): Promise<any>;
  getEscrowWallets(): Promise<EscrowWallet[]>;
  createAdminLog(log: InsertAdminLog): Promise<AdminLog>;
  getAdminLogs(limit?: number, offset?: number): Promise<AdminLog[]>;

  // Phase 2: Analytics operations
  createAnalyticsRecord(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalyticsByMetric(metric: string, startDate?: Date, endDate?: Date): Promise<Analytics[]>;
  getDashboardStats(): Promise<{
    totalTokens: number;
    totalValueEscrowed: string;
    totalRedemptions: number;
    activeUsers: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private tokens: Map<string, Token> = new Map();
  private tokenHoldings: Map<string, TokenHolding> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private airdropSignups: Map<string, AirdropSignup> = new Map();
  private marketListings: Map<string, MarketListing> = new Map();

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample tokens
    const sampleTokens = [
      {
        id: "token-1",
        message: "DiamondHandsOnly",
        symbol: "FlBY-MSG",
        mintAddress: "mint-1",
        creatorId: "user-1",
        totalSupply: 750,
        availableSupply: 245,
        valuePerToken: "0.25",
        createdAt: new Date(),
      },
      {
        id: "token-2",
        message: "ToTheMoonAndBack",
        symbol: "FlBY-MSG",
        mintAddress: "mint-2",
        creatorId: "user-1",
        totalSupply: 1000,
        availableSupply: 532,
        valuePerToken: "0.1",
        createdAt: new Date(),
      },
      {
        id: "token-3",
        message: "FlutterLoveForever",
        symbol: "FlBY-MSG",
        mintAddress: "mint-3",
        creatorId: "user-2",
        totalSupply: 100,
        availableSupply: 27,
        valuePerToken: "1.0",
        createdAt: new Date(),
      },
    ];

    sampleTokens.forEach(token => {
      this.tokens.set(token.id, token as Token);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCredits(userId: string, credits: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, credits };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getToken(id: string): Promise<Token | undefined> {
    return this.tokens.get(id);
  }

  async getTokenByMintAddress(mintAddress: string): Promise<Token | undefined> {
    return Array.from(this.tokens.values()).find(
      (token) => token.mintAddress === mintAddress,
    );
  }

  async createToken(insertToken: InsertToken): Promise<Token> {
    const id = randomUUID();
    const mintAddress = `mint-${id}`;
    const token: Token = { 
      ...insertToken, 
      id,
      mintAddress,
      createdAt: new Date()
    };
    this.tokens.set(id, token);
    return token;
  }

  async updateTokenSupply(tokenId: string, availableSupply: number): Promise<Token> {
    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error("Token not found");
    }
    const updatedToken = { ...token, availableSupply };
    this.tokens.set(tokenId, updatedToken);
    return updatedToken;
  }

  async getTokensByCreator(creatorId: string): Promise<Token[]> {
    return Array.from(this.tokens.values()).filter(
      (token) => token.creatorId === creatorId,
    );
  }

  async getAllTokens(limit = 50, offset = 0): Promise<Token[]> {
    const allTokens = Array.from(this.tokens.values());
    return allTokens.slice(offset, offset + limit);
  }

  async searchTokens(query: string): Promise<Token[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.tokens.values()).filter(
      (token) => token.message.toLowerCase().includes(lowercaseQuery),
    );
  }

  async getTokenHolding(userId: string, tokenId: string): Promise<TokenHolding | undefined> {
    const key = `${userId}-${tokenId}`;
    return this.tokenHoldings.get(key);
  }

  async createTokenHolding(insertHolding: InsertTokenHolding): Promise<TokenHolding> {
    const id = randomUUID();
    const holding: TokenHolding = { 
      ...insertHolding, 
      id,
      acquiredAt: new Date()
    };
    const key = `${holding.userId}-${holding.tokenId}`;
    this.tokenHoldings.set(key, holding);
    return holding;
  }

  async updateTokenHolding(userId: string, tokenId: string, quantity: number): Promise<TokenHolding> {
    const key = `${userId}-${tokenId}`;
    const holding = this.tokenHoldings.get(key);
    if (!holding) {
      throw new Error("Token holding not found");
    }
    const updatedHolding = { ...holding, quantity };
    this.tokenHoldings.set(key, updatedHolding);
    return updatedHolding;
  }

  async getUserHoldings(userId: string): Promise<TokenHolding[]> {
    return Array.from(this.tokenHoldings.values()).filter(
      (holding) => holding.userId === userId,
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.fromUserId === userId || transaction.toUserId === userId,
    );
  }

  async updateTransactionStatus(transactionId: string, status: string, signature?: string): Promise<Transaction> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    const updatedTransaction = { ...transaction, status, solanaSignature: signature };
    this.transactions.set(transactionId, updatedTransaction);
    return updatedTransaction;
  }

  async createAirdropSignup(insertSignup: InsertAirdropSignup): Promise<AirdropSignup> {
    const id = randomUUID();
    const signup: AirdropSignup = { 
      ...insertSignup, 
      id,
      createdAt: new Date()
    };
    this.airdropSignups.set(id, signup);
    return signup;
  }

  async getAirdropSignups(): Promise<AirdropSignup[]> {
    return Array.from(this.airdropSignups.values());
  }

  async createMarketListing(insertListing: InsertMarketListing): Promise<MarketListing> {
    const id = randomUUID();
    const listing: MarketListing = { 
      ...insertListing, 
      id,
      createdAt: new Date()
    };
    this.marketListings.set(id, listing);
    return listing;
  }

  async getMarketListings(tokenId?: string): Promise<MarketListing[]> {
    const listings = Array.from(this.marketListings.values());
    if (tokenId) {
      return listings.filter((listing) => listing.tokenId === tokenId);
    }
    return listings;
  }

  async updateMarketListing(listingId: string, isActive: boolean): Promise<MarketListing> {
    const listing = this.marketListings.get(listingId);
    if (!listing) {
      throw new Error("Market listing not found");
    }
    const updatedListing = { ...listing, isActive };
    this.marketListings.set(listingId, updatedListing);
    return updatedListing;
  }

  async getActiveListings(): Promise<MarketListing[]> {
    return Array.from(this.marketListings.values()).filter(
      (listing) => listing.isActive,
    );
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
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

  async getToken(id: string): Promise<Token | undefined> {
    const [token] = await db.select().from(tokens).where(eq(tokens.id, id));
    return token || undefined;
  }

  async getTokenByMintAddress(mintAddress: string): Promise<Token | undefined> {
    const [token] = await db.select().from(tokens).where(eq(tokens.mintAddress, mintAddress));
    return token || undefined;
  }

  async createToken(insertToken: InsertToken): Promise<Token> {
    const [token] = await db
      .insert(tokens)
      .values(insertToken)
      .returning();
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
    return await db.select().from(tokens).where(eq(tokens.creatorId, creatorId)).orderBy(desc(tokens.createdAt));
  }

  async getAllTokens(limit = 50, offset = 0): Promise<Token[]> {
    return await db.select().from(tokens).orderBy(desc(tokens.createdAt)).limit(limit).offset(offset);
  }

  async searchTokens(query: string): Promise<Token[]> {
    return await db.select().from(tokens).where(like(tokens.message, `%${query}%`)).orderBy(desc(tokens.createdAt));
  }

  async getTokenHolding(userId: string, tokenId: string): Promise<TokenHolding | undefined> {
    const [holding] = await db
      .select()
      .from(tokenHoldings)
      .where(eq(tokenHoldings.userId, userId))
      .where(eq(tokenHoldings.tokenId, tokenId));
    return holding || undefined;
  }

  async createTokenHolding(insertHolding: InsertTokenHolding): Promise<TokenHolding> {
    const [holding] = await db
      .insert(tokenHoldings)
      .values(insertHolding)
      .returning();
    return holding;
  }

  async updateTokenHolding(userId: string, tokenId: string, quantity: number): Promise<TokenHolding> {
    const [holding] = await db
      .update(tokenHoldings)
      .set({ quantity })
      .where(eq(tokenHoldings.userId, userId))
      .where(eq(tokenHoldings.tokenId, tokenId))
      .returning();
    return holding;
  }

  async getUserHoldings(userId: string): Promise<TokenHolding[]> {
    return await db.select().from(tokenHoldings).where(eq(tokenHoldings.userId, userId));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.fromUserId, userId))
      .or(eq(transactions.toUserId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async updateTransactionStatus(transactionId: string, status: string, signature?: string): Promise<Transaction> {
    const [transaction] = await db
      .update(transactions)
      .set({ status, solanaSignature: signature })
      .where(eq(transactions.id, transactionId))
      .returning();
    return transaction;
  }

  async createAirdropSignup(insertSignup: InsertAirdropSignup): Promise<AirdropSignup> {
    const [signup] = await db
      .insert(airdropSignups)
      .values(insertSignup)
      .returning();
    return signup;
  }

  async getAirdropSignups(): Promise<AirdropSignup[]> {
    return await db.select().from(airdropSignups).orderBy(desc(airdropSignups.createdAt));
  }

  async createMarketListing(insertListing: InsertMarketListing): Promise<MarketListing> {
    const [listing] = await db
      .insert(marketListings)
      .values(insertListing)
      .returning();
    return listing;
  }

  async getMarketListings(tokenId?: string): Promise<MarketListing[]> {
    if (tokenId) {
      return await db.select().from(marketListings).where(eq(marketListings.tokenId, tokenId));
    }
    return await db.select().from(marketListings).orderBy(desc(marketListings.createdAt));
  }

  async updateMarketListing(listingId: string, isActive: boolean): Promise<MarketListing> {
    const [listing] = await db
      .update(marketListings)
      .set({ isActive })
      .where(eq(marketListings.id, listingId))
      .returning();
    return listing;
  }

  async getActiveListings(): Promise<MarketListing[]> {
    return await db.select().from(marketListings).where(eq(marketListings.isActive, true));
  }

  // Phase 2: Token value and escrow operations
  async updateTokenEscrowStatus(tokenId: string, status: string, escrowWallet?: string): Promise<Token> {
    const [token] = await db
      .update(tokens)
      .set({ 
        escrowStatus: status,
        escrowWallet: escrowWallet 
      })
      .where(eq(tokens.id, tokenId))
      .returning();
    return token;
  }

  async getTokensWithValue(): Promise<Token[]> {
    return await db.select().from(tokens).where(eq(tokens.hasAttachedValue, true));
  }

  async getPublicTokens(limit = 50, offset = 0): Promise<Token[]> {
    return await db
      .select()
      .from(tokens)
      .where(and(eq(tokens.isPublic, true), eq(tokens.isBlocked, false)))
      .orderBy(desc(tokens.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async flagToken(tokenId: string, reason: string, adminId: string): Promise<Token> {
    const [token] = await db
      .update(tokens)
      .set({ 
        flaggedAt: new Date(),
        flaggedReason: reason 
      })
      .where(eq(tokens.id, tokenId))
      .returning();

    // Log the admin action
    await this.createAdminLog({
      adminId,
      action: "flag_token",
      targetType: "token",
      targetId: tokenId,
      details: { reason }
    });

    return token;
  }

  async blockToken(tokenId: string, adminId: string): Promise<Token> {
    const [token] = await db
      .update(tokens)
      .set({ isBlocked: true })
      .where(eq(tokens.id, tokenId))
      .returning();

    // Log the admin action
    await this.createAdminLog({
      adminId,
      action: "block_token",
      targetType: "token",
      targetId: tokenId,
      details: {}
    });

    return token;
  }

  // Phase 2: Redemption operations
  async createRedemption(insertRedemption: InsertRedemption): Promise<Redemption> {
    const [redemption] = await db
      .insert(redemptions)
      .values(insertRedemption)
      .returning();
    return redemption;
  }

  async getRedemption(id: string): Promise<Redemption | undefined> {
    const [redemption] = await db.select().from(redemptions).where(eq(redemptions.id, id));
    return redemption || undefined;
  }

  async getUserRedemptions(userId: string): Promise<Redemption[]> {
    return await db
      .select()
      .from(redemptions)
      .where(eq(redemptions.userId, userId))
      .orderBy(desc(redemptions.createdAt));
  }

  async updateRedemptionStatus(redemptionId: string, status: string, signature?: string): Promise<Redemption> {
    const [redemption] = await db
      .update(redemptions)
      .set({ 
        status,
        redemptionTransactionSignature: signature,
        completedAt: status === "completed" ? new Date() : undefined
      })
      .where(eq(redemptions.id, redemptionId))
      .returning();
    return redemption;
  }

  async getRedemptionsByToken(tokenId: string): Promise<Redemption[]> {
    return await db
      .select()
      .from(redemptions)
      .where(eq(redemptions.tokenId, tokenId))
      .orderBy(desc(redemptions.createdAt));
  }

  // Phase 2: Escrow wallet operations
  async createEscrowWallet(insertWallet: InsertEscrowWallet): Promise<EscrowWallet> {
    const [wallet] = await db
      .insert(escrowWallets)
      .values(insertWallet)
      .returning();
    return wallet;
  }

  async getActiveEscrowWallet(): Promise<EscrowWallet | undefined> {
    const [wallet] = await db
      .select()
      .from(escrowWallets)
      .where(eq(escrowWallets.isActive, true));
    return wallet || undefined;
  }

  async updateEscrowBalance(walletId: string, balance: string): Promise<EscrowWallet> {
    const [wallet] = await db
      .update(escrowWallets)
      .set({ totalBalance: balance })
      .where(eq(escrowWallets.id, walletId))
      .returning();
    return wallet;
  }

  // Phase 2: Admin operations
  async createAdminUser(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const [admin] = await db
      .insert(adminUsers)
      .values(insertAdmin)
      .returning();
    return admin;
  }

  async getAdminByWallet(walletAddress: string): Promise<AdminUser | undefined> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.walletAddress, walletAddress));
    return admin || undefined;
  }

  async updateAdminStatus(adminId: string, isActive: boolean): Promise<AdminUser> {
    const [admin] = await db
      .update(adminUsers)
      .set({ isActive })
      .where(eq(adminUsers.id, adminId))
      .returning();
    return admin;
  }

  async createAdminLog(insertLog: InsertAdminLog): Promise<AdminLog> {
    const [log] = await db
      .insert(adminLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  async getAdminLogs(limit = 50, offset = 0): Promise<AdminLog[]> {
    return await db
      .select()
      .from(adminLogs)
      .orderBy(desc(adminLogs.createdAt))
      .limit(limit)
      .offset(offset);
  }

  // Phase 2: Analytics operations
  async createAnalyticsRecord(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const [analytics] = await db
      .insert(analytics)
      .values(insertAnalytics)
      .returning();
    return analytics;
  }

  async getAnalyticsByMetric(metric: string, startDate?: Date, endDate?: Date): Promise<Analytics[]> {
    let query = db.select().from(analytics).where(eq(analytics.metric, metric));
    
    if (startDate && endDate) {
      query = query.where(and(
        gte(analytics.date, startDate),
        lte(analytics.date, endDate)
      ));
    }
    
    return await query.orderBy(desc(analytics.date));
  }

  async getDashboardStats(): Promise<{
    totalTokens: number;
    totalValueEscrowed: string;
    totalRedemptions: number;
    activeUsers: number;
  }> {
    const [tokenCount] = await db.select({ count: count() }).from(tokens);
    const [redemptionCount] = await db.select({ count: count() }).from(redemptions);
    const [userCount] = await db.select({ count: count() }).from(users);
    
    // Calculate total value escrowed
    const tokensWithValue = await db
      .select({ attachedValue: tokens.attachedValue })
      .from(tokens)
      .where(eq(tokens.hasAttachedValue, true));
    
    const totalValueEscrowed = tokensWithValue
      .reduce((sum, token) => sum + parseFloat(token.attachedValue || "0"), 0)
      .toString();

    return {
      totalTokens: tokenCount.count,
      totalValueEscrowed,
      totalRedemptions: redemptionCount.count,
      activeUsers: userCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
