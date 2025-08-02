import { randomUUID } from "crypto";
import {
  type User,
  type InsertUser,
  type Token,
  type InsertToken,
  type TokenHolding,
  type InsertTokenHolding,
  type Transaction,
  type InsertTransaction,
  type AirdropSignup,
  type InsertAirdropSignup,
  type MarketListing,
  type InsertMarketListing,
  type Redemption,
  type InsertRedemption,
  type EscrowWallet,
  type InsertEscrowWallet,
  type RedeemableCode,
  type InsertRedeemableCode,
  type CodeRedemption,
  type InsertCodeRedemption,
  type AdminUser,
  type InsertAdminUser,
  type AdminLog,
  type InsertAdminLog,
  type Analytics,
  type InsertAnalytics,
  type ChatRoom,
  type InsertChatRoom,
  type ChatMessage,
  type InsertChatMessage,
  type ChatParticipant,
  type InsertChatParticipant,
  type LimitedEditionSet,
  type InsertLimitedEditionSet,
  type RedemptionCode,
  type InsertRedemptionCodeForm,
} from "@shared/schema";

// Storage interface for both in-memory and database implementations
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
  updateToken(tokenId: string, updateData: Partial<Token>): Promise<Token>;
  deleteToken(tokenId: string): Promise<void>;

  // Token holdings
  getTokenHolding(userId: string, tokenId: string): Promise<TokenHolding | undefined>;
  createTokenHolding(holding: InsertTokenHolding): Promise<TokenHolding>;
  updateTokenHolding(userId: string, tokenId: string, quantity: number): Promise<TokenHolding>;
  getUserHoldings(userId: string): Promise<TokenHolding[]>;

  // Transactions
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;

  // Airdrop signups
  getAirdropSignup(walletAddress: string): Promise<AirdropSignup | undefined>;
  createAirdropSignup(signup: InsertAirdropSignup): Promise<AirdropSignup>;
  getAllAirdropSignups(): Promise<AirdropSignup[]>;

  // Redemptions
  createRedemption(redemption: InsertRedemption): Promise<Redemption>;
  getRedemptionsByUser(userId: string): Promise<Redemption[]>;
  getRedemptionsByToken(tokenId: string): Promise<Redemption[]>;

  // Escrow wallets
  createEscrowWallet(wallet: InsertEscrowWallet): Promise<EscrowWallet>;
  getEscrowWallet(id: string): Promise<EscrowWallet | undefined>;
  getEscrowWalletsByToken(tokenId: string): Promise<EscrowWallet[]>;
  updateEscrowWallet(walletId: string, balance: string): Promise<EscrowWallet>;

  // Market listings
  createMarketListing(listing: InsertMarketListing): Promise<MarketListing>;
  getMarketListings(tokenId?: string): Promise<MarketListing[]>;
  updateMarketListing(listingId: string, isActive: boolean): Promise<MarketListing>;
  getActiveListings(): Promise<MarketListing[]>;

  // Redeemable codes
  createRedeemableCode(code: InsertRedeemableCode): Promise<RedeemableCode>;
  getRedeemableCode(code: string): Promise<RedeemableCode | undefined>;
  getAllRedeemableCodes(): Promise<RedeemableCode[]>;
  updateRedeemableCode(codeId: string, isUsed: boolean): Promise<RedeemableCode>;

  // Code redemptions
  createCodeRedemption(redemption: InsertCodeRedemption): Promise<CodeRedemption>;
  getCodeRedemptionsByUser(userId: string): Promise<CodeRedemption[]>;
  getCodeRedemptionsByCode(codeId: string): Promise<CodeRedemption[]>;

  // Admin operations
  createAdminUser(admin: InsertAdminUser): Promise<AdminUser>;
  getAdminUser(walletAddress: string): Promise<AdminUser | undefined>;
  updateAdminUserPermissions(adminId: string, permissions: string[]): Promise<AdminUser>;
  createAdminLog(log: InsertAdminLog): Promise<AdminLog>;
  getAdminLogs(limit?: number, offset?: number): Promise<AdminLog[]>;

  // Analytics
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalytics(date: Date): Promise<Analytics | undefined>;
  getAnalyticsRange(startDate: Date, endDate: Date): Promise<Analytics[]>;
  getDashboardStats(): Promise<{
    totalUsers: number;
    totalTokens: number;
    totalTransactions: number;
    activeUsers: number;
  }>;

  // Chat methods
  createChatRoom(data: InsertChatRoom): Promise<ChatRoom>;
  getChatRoom(id: string): Promise<ChatRoom | undefined>;
  getChatRooms(): Promise<ChatRoom[]>;
  createChatMessage(data: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(roomId: string, limit?: number): Promise<ChatMessage[]>;
  joinChatRoom(data: InsertChatParticipant): Promise<ChatParticipant>;
  updateChatParticipant(userId: string, roomId: string, updates: Partial<ChatParticipant>): Promise<void>;
  getChatParticipants(roomId: string): Promise<ChatParticipant[]>;

  // Limited Edition Set methods
  createLimitedEditionSet(set: InsertLimitedEditionSet): Promise<LimitedEditionSet>;
  getLimitedEditionSet(id: string): Promise<LimitedEditionSet | undefined>;
  getLimitedEditionSets(creatorId?: string): Promise<LimitedEditionSet[]>;
  updateLimitedEditionSet(setId: string, updates: Partial<LimitedEditionSet>): Promise<LimitedEditionSet>;
  incrementMintedEditions(setId: string): Promise<LimitedEditionSet>;
  getLimitedEditionTokens(setId: string): Promise<Token[]>;

  // Redemption code operations  
  getAllRedemptionCodes(): Promise<RedemptionCode[]>;
  createRedemptionCode(code: InsertRedemptionCodeForm): Promise<RedemptionCode>;
  updateRedemptionCode(id: string, updates: Partial<RedemptionCode>): Promise<RedemptionCode>;
  deleteRedemptionCode(id: string): Promise<void>;
  validateAndUseRedemptionCode(code: string): Promise<RedemptionCode | null>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private tokens: Map<string, Token> = new Map();
  private tokenHoldings: Map<string, TokenHolding> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private airdropSignups: Map<string, AirdropSignup> = new Map();
  private redemptions: Map<string, Redemption> = new Map();
  private escrowWallets: Map<string, EscrowWallet> = new Map();
  private marketListings: Map<string, MarketListing> = new Map();
  private redeemableCodes: Map<string, RedeemableCode> = new Map();
  private codeRedemptions: Map<string, CodeRedemption> = new Map();
  private adminUsers: Map<string, AdminUser> = new Map();
  private adminLogs: Map<string, AdminLog> = new Map();
  private analytics: Map<string, Analytics> = new Map();
  private chatRooms: Map<string, ChatRoom> = new Map();
  private chatMessages: Map<string, ChatMessage> = new Map();
  private chatParticipants: Map<string, ChatParticipant> = new Map();
  private limitedEditionSets: Map<string, LimitedEditionSet> = new Map();
  private redemptionCodes: Map<string, RedemptionCode> = new Map();

  constructor() {
    this.initializeTestData();
  }

  private initializeTestData() {
    // Create test redemption codes for development
    const testCodes = [
      {
        id: "test-1",
        code: "FLBY-EARLY-001",
        type: "early_access",
        value: "free_mint",
        description: "Early access free minting code",
        isActive: true,
        maxUses: 10,
        currentUses: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdAt: new Date(),
      },
      {
        id: "test-2", 
        code: "FLBY-EARLY-002",
        type: "beta_tester",
        value: "free_mint",
        description: "Beta tester free minting code",
        isActive: true,
        maxUses: 5,
        currentUses: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: "test-3",
        code: "FLBY-FREE-2024",
        type: "promotional",
        value: "free_mint",
        description: "2024 promotional free minting code",
        isActive: true,
        maxUses: -1, // Unlimited uses
        currentUses: 0,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        createdAt: new Date(),
      }
    ];

    testCodes.forEach(code => {
      this.redemptionCodes.set(code.id, code as RedemptionCode);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCredits(userId: string, credits: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, credits, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Token operations
  async getToken(id: string): Promise<Token | undefined> {
    return this.tokens.get(id);
  }

  async getTokenByMintAddress(mintAddress: string): Promise<Token | undefined> {
    return Array.from(this.tokens.values()).find(token => token.mintAddress === mintAddress);
  }

  async createToken(insertToken: InsertToken | any): Promise<Token> {
    const id = randomUUID();
    const token: Token = { 
      ...insertToken, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tokens.set(id, token);
    return token;
  }

  // Additional methods for Solana integration
  async getTokensByCreatorWallet(walletAddress: string): Promise<Token[]> {
    return Array.from(this.tokens.values())
      .filter(token => (token as any).creatorWallet === walletAddress);
  }

  async getTokensByRecipient(walletAddress: string): Promise<Token[]> {
    return Array.from(this.tokens.values())
      .filter(token => {
        const recipients = (token as any).recipients;
        return recipients && recipients.includes(walletAddress);
      });
  }

  async createRedemption(redemption: any): Promise<any> {
    const id = randomUUID();
    const newRedemption = {
      id,
      ...redemption,
      createdAt: new Date()
    };
    if (!this.redemptions) {
      this.redemptions = new Map();
    }
    this.redemptions.set(id, newRedemption);
    return newRedemption;
  }

  async getRedemptionsByWallet(walletAddress: string): Promise<any[]> {
    if (!this.redemptions) return [];
    return Array.from(this.redemptions.values())
      .filter(redemption => redemption.walletAddress === walletAddress);
  }

  async getAllTokensWithOptions(options: {
    limit: number;
    offset: number;
    search?: string;
    sortBy?: string;
  }): Promise<Token[]> {
    let filtered = Array.from(this.tokens.values());
    
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(token => {
        const tokenData = token as any;
        return tokenData.message?.toLowerCase().includes(searchLower) ||
               tokenData.creatorWallet?.toLowerCase().includes(searchLower);
      });
    }
    
    // Sort by specified field
    if (options.sortBy === 'createdAt') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (options.sortBy === 'value') {
      filtered.sort((a, b) => ((b as any).value || 0) - ((a as any).value || 0));
    }
    
    return filtered.slice(options.offset, options.offset + options.limit);
  }

  async updateTokenSupply(tokenId: string, availableSupply: number): Promise<Token> {
    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error("Token not found");
    }
    const updatedToken = { ...token, availableSupply, updatedAt: new Date() };
    this.tokens.set(tokenId, updatedToken);
    return updatedToken;
  }

  async getTokensByCreator(creatorId: string): Promise<Token[]> {
    return Array.from(this.tokens.values())
      .filter(token => token.creatorId === creatorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllTokens(limit = 50, offset = 0): Promise<Token[]> {
    return Array.from(this.tokens.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async searchTokens(query: string): Promise<Token[]> {
    return Array.from(this.tokens.values())
      .filter(token => token.message.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateToken(tokenId: string, updateData: Partial<Token>): Promise<Token> {
    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error("Token not found");
    }
    const updatedToken = { ...token, ...updateData, updatedAt: new Date() };
    this.tokens.set(tokenId, updatedToken);
    return updatedToken;
  }

  async deleteToken(tokenId: string): Promise<void> {
    this.tokens.delete(tokenId);
  }

  // Token holdings
  async getTokenHolding(userId: string, tokenId: string): Promise<TokenHolding | undefined> {
    const key = `${userId}-${tokenId}`;
    return this.tokenHoldings.get(key);
  }

  async createTokenHolding(insertHolding: InsertTokenHolding): Promise<TokenHolding> {
    const id = randomUUID();
    const holding: TokenHolding = { 
      ...insertHolding, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
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
    const updatedHolding = { ...holding, quantity, updatedAt: new Date() };
    this.tokenHoldings.set(key, updatedHolding);
    return updatedHolding;
  }

  async getUserHoldings(userId: string): Promise<TokenHolding[]> {
    return Array.from(this.tokenHoldings.values())
      .filter(holding => holding.userId === userId);
  }

  // Transactions
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
    return Array.from(this.transactions.values())
      .filter(tx => tx.fromUserId === userId || tx.toUserId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Continue with other methods following same pattern...
  async getAirdropSignup(walletAddress: string): Promise<AirdropSignup | undefined> {
    return Array.from(this.airdropSignups.values()).find(signup => signup.walletAddress === walletAddress);
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

  async getAllAirdropSignups(): Promise<AirdropSignup[]> {
    return Array.from(this.airdropSignups.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createRedemption(insertRedemption: InsertRedemption): Promise<Redemption> {
    const id = randomUUID();
    const redemption: Redemption = { 
      ...insertRedemption, 
      id,
      createdAt: new Date()
    };
    this.redemptions.set(id, redemption);
    return redemption;
  }

  async getRedemptionsByUser(userId: string): Promise<Redemption[]> {
    return Array.from(this.redemptions.values())
      .filter(r => r.userId === userId);
  }

  async getRedemptionsByToken(tokenId: string): Promise<Redemption[]> {
    return Array.from(this.redemptions.values())
      .filter(r => r.tokenId === tokenId);
  }

  async createEscrowWallet(insertWallet: InsertEscrowWallet): Promise<EscrowWallet> {
    const id = randomUUID();
    const wallet: EscrowWallet = { 
      ...insertWallet, 
      id,
      createdAt: new Date()
    };
    this.escrowWallets.set(id, wallet);
    return wallet;
  }

  async getEscrowWallet(id: string): Promise<EscrowWallet | undefined> {
    return this.escrowWallets.get(id);
  }

  async getEscrowWalletsByToken(tokenId: string): Promise<EscrowWallet[]> {
    return Array.from(this.escrowWallets.values())
      .filter(wallet => wallet.tokenId === tokenId);
  }

  async updateEscrowWallet(walletId: string, balance: string): Promise<EscrowWallet> {
    const wallet = this.escrowWallets.get(walletId);
    if (!wallet) {
      throw new Error("Escrow wallet not found");
    }
    const updatedWallet = { ...wallet, balance };
    this.escrowWallets.set(walletId, updatedWallet);
    return updatedWallet;
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

  // Implement remaining methods with similar pattern
  async createRedeemableCode(insertCode: InsertRedeemableCode): Promise<RedeemableCode> {
    const id = randomUUID();
    const code: RedeemableCode = { 
      ...insertCode, 
      id,
      createdAt: new Date()
    };
    this.redeemableCodes.set(id, code);
    return code;
  }

  async getRedeemableCode(code: string): Promise<RedeemableCode | undefined> {
    return Array.from(this.redeemableCodes.values()).find(c => c.code === code);
  }

  async getAllRedeemableCodes(): Promise<RedeemableCode[]> {
    return Array.from(this.redeemableCodes.values());
  }

  async updateRedeemableCode(codeId: string, isUsed: boolean): Promise<RedeemableCode> {
    const code = this.redeemableCodes.get(codeId);
    if (!code) {
      throw new Error("Code not found");
    }
    const updatedCode = { ...code, isUsed };
    this.redeemableCodes.set(codeId, updatedCode);
    return updatedCode;
  }

  async createCodeRedemption(insertRedemption: InsertCodeRedemption): Promise<CodeRedemption> {
    const id = randomUUID();
    const redemption: CodeRedemption = { 
      ...insertRedemption, 
      id,
      createdAt: new Date()
    };
    this.codeRedemptions.set(id, redemption);
    return redemption;
  }

  async getCodeRedemptionsByUser(userId: string): Promise<CodeRedemption[]> {
    return Array.from(this.codeRedemptions.values())
      .filter(r => r.userId === userId);
  }

  async getCodeRedemptionsByCode(codeId: string): Promise<CodeRedemption[]> {
    return Array.from(this.codeRedemptions.values())
      .filter(r => r.codeId === codeId);
  }

  async createAdminUser(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const id = randomUUID();
    const admin: AdminUser = { 
      ...insertAdmin, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.adminUsers.set(id, admin);
    return admin;
  }

  async getAdminUser(walletAddress: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(admin => admin.walletAddress === walletAddress);
  }

  async updateAdminUserPermissions(adminId: string, permissions: string[]): Promise<AdminUser> {
    const admin = this.adminUsers.get(adminId);
    if (!admin) {
      throw new Error("Admin user not found");
    }
    const updatedAdmin = { ...admin, permissions, updatedAt: new Date() };
    this.adminUsers.set(adminId, updatedAdmin);
    return updatedAdmin;
  }

  async createAdminLog(insertLog: InsertAdminLog): Promise<AdminLog> {
    const id = randomUUID();
    const log: AdminLog = { 
      ...insertLog, 
      id,
      createdAt: new Date()
    };
    this.adminLogs.set(id, log);
    return log;
  }

  async getAdminLogs(limit = 50, offset = 0): Promise<AdminLog[]> {
    return Array.from(this.adminLogs.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const analytics: Analytics = { 
      ...insertAnalytics, 
      id,
      createdAt: new Date()
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async getAnalytics(date: Date): Promise<Analytics | undefined> {
    return Array.from(this.analytics.values()).find(a => 
      a.date.toDateString() === date.toDateString()
    );
  }

  async getAnalyticsRange(startDate: Date, endDate: Date): Promise<Analytics[]> {
    return Array.from(this.analytics.values())
      .filter(a => a.date >= startDate && a.date <= endDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalTokens: number;
    totalTransactions: number;
    activeUsers: number;
  }> {
    return {
      totalUsers: this.users.size,
      totalTokens: this.tokens.size,
      totalTransactions: this.transactions.size,
      activeUsers: Math.floor(this.users.size * 0.3) // Simulate active users
    };
  }

  // Chat methods
  async createChatRoom(data: InsertChatRoom): Promise<ChatRoom> {
    const id = randomUUID();
    const room: ChatRoom = {
      ...data,
      id,
      createdAt: new Date(),
    };
    this.chatRooms.set(id, room);
    return room;
  }

  async getChatRoom(id: string): Promise<ChatRoom | undefined> {
    return this.chatRooms.get(id);
  }

  async getChatRooms(): Promise<ChatRoom[]> {
    return Array.from(this.chatRooms.values()).filter(room => room.isPublic);
  }

  async createChatMessage(data: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...data,
      id,
      createdAt: new Date(),
      isEdited: false,
      isDeleted: false,
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessages(roomId: string, limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.roomId === roomId && !msg.isDeleted)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async joinChatRoom(data: InsertChatParticipant): Promise<ChatParticipant> {
    // Check if participant already exists
    const existing = Array.from(this.chatParticipants.values())
      .find(p => p.roomId === data.roomId && p.userId === data.userId);

    if (existing) {
      // Update to online
      const updated: ChatParticipant = {
        ...existing,
        isOnline: true,
        lastSeenAt: new Date(),
      };
      this.chatParticipants.set(existing.id, updated);
      return updated;
    }

    // Create new participant
    const id = randomUUID();
    const participant: ChatParticipant = {
      ...data,
      id,
      joinedAt: new Date(),
      lastSeenAt: new Date(),
      isOnline: true,
    };
    this.chatParticipants.set(id, participant);
    return participant;
  }

  async updateChatParticipant(userId: string, roomId: string, updates: Partial<ChatParticipant>): Promise<void> {
    const participant = Array.from(this.chatParticipants.values())
      .find(p => p.userId === userId && p.roomId === roomId);
    
    if (participant) {
      const updated: ChatParticipant = {
        ...participant,
        ...updates,
        lastSeenAt: new Date(),
      };
      this.chatParticipants.set(participant.id, updated);
    }
  }

  async getChatParticipants(roomId: string): Promise<ChatParticipant[]> {
    return Array.from(this.chatParticipants.values())
      .filter(p => p.roomId === roomId);
  }

  // Limited Edition Set methods
  async createLimitedEditionSet(set: InsertLimitedEditionSet): Promise<LimitedEditionSet> {
    const newSet: LimitedEditionSet = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      mintedEditions: 0,
      ...set,
    };
    this.limitedEditionSets.set(newSet.id, newSet);
    return newSet;
  }

  async getLimitedEditionSet(id: string): Promise<LimitedEditionSet | undefined> {
    return this.limitedEditionSets.get(id);
  }

  async getLimitedEditionSets(creatorId?: string): Promise<LimitedEditionSet[]> {
    const sets = Array.from(this.limitedEditionSets.values());
    if (creatorId) {
      return sets.filter(set => set.creatorId === creatorId);
    }
    return sets;
  }

  async updateLimitedEditionSet(setId: string, updates: Partial<LimitedEditionSet>): Promise<LimitedEditionSet> {
    const existingSet = this.limitedEditionSets.get(setId);
    if (!existingSet) {
      throw new Error("Limited edition set not found");
    }
    const updatedSet = { ...existingSet, ...updates, updatedAt: new Date() };
    this.limitedEditionSets.set(setId, updatedSet);
    return updatedSet;
  }

  async incrementMintedEditions(setId: string): Promise<LimitedEditionSet> {
    const set = this.limitedEditionSets.get(setId);
    if (!set) {
      throw new Error("Limited edition set not found");
    }
    const updatedSet = { ...set, mintedEditions: set.mintedEditions + 1, updatedAt: new Date() };
    this.limitedEditionSets.set(setId, updatedSet);
    return updatedSet;
  }

  async getLimitedEditionTokens(setId: string): Promise<Token[]> {
    return Array.from(this.tokens.values()).filter(token => token.limitedEditionSetId === setId);
  }

  // Redemption code operations
  async getAllRedemptionCodes(): Promise<RedemptionCode[]> {
    return Array.from(this.redemptionCodes.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createRedemptionCode(codeData: InsertRedemptionCodeForm): Promise<RedemptionCode> {
    const id = randomUUID();
    const code: RedemptionCode = {
      ...codeData,
      id,
      createdAt: new Date(),
    };
    this.redemptionCodes.set(id, code);
    return code;
  }

  async updateRedemptionCode(id: string, updates: Partial<RedemptionCode>): Promise<RedemptionCode> {
    const existingCode = this.redemptionCodes.get(id);
    if (!existingCode) {
      throw new Error("Redemption code not found");
    }
    const updatedCode = { ...existingCode, ...updates };
    this.redemptionCodes.set(id, updatedCode);
    return updatedCode;
  }

  async deleteRedemptionCode(id: string): Promise<void> {
    this.redemptionCodes.delete(id);
  }

  async validateAndUseRedemptionCode(code: string): Promise<RedemptionCode | null> {
    const redemptionCode = Array.from(this.redemptionCodes.values())
      .find(rc => rc.code === code.toUpperCase());
    
    if (!redemptionCode) return null;
    
    // Check if code is active
    if (!redemptionCode.isActive) return null;
    
    // Check if expired
    if (redemptionCode.expiresAt && new Date(redemptionCode.expiresAt) < new Date()) {
      return null;
    }
    
    // Check if uses exhausted (unlimited uses = -1)
    if (redemptionCode.maxUses !== -1 && redemptionCode.currentUses >= redemptionCode.maxUses) {
      return null;
    }
    
    // Increment usage
    redemptionCode.currentUses += 1;
    this.redemptionCodes.set(redemptionCode.id, redemptionCode);
    
    return redemptionCode;
  }
}

// Export storage instance
export const storage = new MemStorage();

// Debug: Log initialization (remove in production)
storage.getAllRedemptionCodes().then(codes => 
  console.log('Storage initialized with redemption codes:', codes.map(c => `${c.code} (${c.type})`))
);