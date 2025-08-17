// Simplified storage implementation for deployment
import { randomUUID } from "crypto";
import {
  type User, type InsertUser,
  type Token, type InsertToken,
  type TokenHolding, type InsertTokenHolding,
  type Transaction, type InsertTransaction,
  type AirdropSignup, type InsertAirdropSignup,
  type MarketListing, type InsertMarketListing,
  type Redemption, type InsertRedemption,
  type EscrowWallet, type InsertEscrowWallet
} from "@shared/schema";

export class SimpleStorage {
  private users = new Map<string, User>();
  private tokens = new Map<string, Token>();
  private tokenHoldings = new Map<string, TokenHolding>();
  private transactions = new Map<string, Transaction>();
  private airdropSignups = new Map<string, AirdropSignup>();
  private marketListings = new Map<string, MarketListing>();
  private redemptions = new Map<string, Redemption>();
  private escrowWallets = new Map<string, EscrowWallet>();

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
      role: insertUser.role || "user",
      email: insertUser.email || null,
      airdropPreferences: insertUser.airdropPreferences || null,
      credits: insertUser.credits || "0",
      isAdmin: insertUser.isAdmin || false,
      adminPermissions: insertUser.adminPermissions || null,
      adminAddedBy: insertUser.adminAddedBy || null,
      adminAddedAt: insertUser.adminAddedAt || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCredits(userId: string, credits: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = { ...user, credits };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Token operations
  async getToken(id: string): Promise<Token | undefined> {
    return this.tokens.get(id);
  }

  async createToken(insertToken: InsertToken): Promise<Token> {
    const id = randomUUID();
    const token: Token = { 
      ...insertToken, 
      id,
      symbol: insertToken.symbol || "FLBY-MSG",
      metadata: insertToken.metadata || null,
      additionalMessages: insertToken.additionalMessages || null,
      links: insertToken.links || null,
      gifs: insertToken.gifs || null,
      solscanMetadata: insertToken.solscanMetadata || null,
      hasAttachedValue: insertToken.hasAttachedValue || false,
      attachedValue: insertToken.attachedValue || "0",
      currency: insertToken.currency || "SOL",
      escrowStatus: insertToken.escrowStatus || "none",
      escrowWallet: insertToken.escrowWallet || null,
      expiresAt: insertToken.expiresAt || null,
      mintingCostPerToken: insertToken.mintingCostPerToken || "0.01",
      gasFeeIncluded: insertToken.gasFeeIncluded || true,
      bulkDiscountApplied: insertToken.bulkDiscountApplied || "0",
      totalMintingCost: insertToken.totalMintingCost || "0",
      smsOrigin: insertToken.smsOrigin || false,
      senderPhone: insertToken.senderPhone || null,
      recipientPhone: insertToken.recipientPhone || null,
      emotionType: insertToken.emotionType || null,
      isTimeLocked: insertToken.isTimeLocked || false,
      unlocksAt: insertToken.unlocksAt || null,
      isBurnToRead: insertToken.isBurnToRead || false,
      isReplyGated: insertToken.isReplyGated || false,
      requiresReply: insertToken.requiresReply || false,
      isPublic: insertToken.isPublic || false,
      isBlocked: insertToken.isBlocked || false,
      flaggedAt: insertToken.flaggedAt || null,
      flaggedReason: insertToken.flaggedReason || null,
      isLimitedEdition: insertToken.isLimitedEdition || false,
      editionNumber: insertToken.editionNumber || null,
      limitedEditionSetId: insertToken.limitedEditionSetId || null,
      createdAt: new Date()
    };
    this.tokens.set(id, token);
    return token;
  }

  // Simplified methods for basic functionality
  async getAllTokens(): Promise<Token[]> {
    return Array.from(this.tokens.values());
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

  // Placeholder methods to satisfy interface
  async getTokensByCreator(): Promise<Token[]> { return []; }
  async searchTokens(): Promise<Token[]> { return []; }
  async updateToken(): Promise<Token> { throw new Error("Not implemented"); }
  async deleteToken(): Promise<void> { }
  async getTokenHolding(): Promise<TokenHolding | undefined> { return undefined; }
  async createTokenHolding(): Promise<TokenHolding> { throw new Error("Not implemented"); }
  async updateTokenHolding(): Promise<TokenHolding> { throw new Error("Not implemented"); }
  async getUserHoldings(): Promise<TokenHolding[]> { return []; }
  async createTransaction(): Promise<Transaction> { throw new Error("Not implemented"); }
  async getTransactionsByUser(): Promise<Transaction[]> { return []; }
  async getAirdropSignup(): Promise<AirdropSignup | undefined> { return undefined; }
  async createAirdropSignup(): Promise<AirdropSignup> { throw new Error("Not implemented"); }
  async getAllAirdropSignups(): Promise<AirdropSignup[]> { return []; }
}