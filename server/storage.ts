import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
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
  type PricingConfig,
  type InsertPricingConfig,
  type PricingTier,
  type InsertPricingTier,
  type SystemSetting,
  type InsertSystemSetting,
  type WalletIntelligence,
  type InsertWalletIntelligence,
  type WalletBatch,
  type InsertWalletBatch,
  type AnalysisQueue,
  type InsertAnalysisQueue,
  type EscrowFeeConfig,
  type InsertEscrowFeeConfig,
  type CustodialWallet,
  type InsertCustodialWallet,
  type UserWalletBalance,
  type InsertUserWalletBalance,
  type ValueAttachment,
  type InsertValueAttachment,
  type CustodialWalletTransaction,
  type InsertCustodialWalletTransaction,
  type WalletSecurityLog,
  type InsertWalletSecurityLog,
  type SkyeConversations,
  type InsertSkyeConversation,
  type SkyeMessages,
  type InsertSkyeMessage,
  type SkyePersonalityProfiles,
  type InsertSkyePersonalityProfile,
  type VipWaitlist,
  type InsertVipWaitlist,
  pricingTiers,
  walletIntelligence,
  walletBatches,
  analysisQueue,
  escrowFeeConfigs,
  custodialWallets,
  userWalletBalances,
  valueAttachments,
  custodialWalletTransactions,
  walletSecurityLogs,
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
  
  // Enhanced redemption tracking for admin analytics
  trackRedemptionUsage(data: any): Promise<void>;
  getRedemptionUsageAnalytics(): Promise<any[]>;
  
  // Pricing tier management
  getPricingTiers(): Promise<PricingTier[]>;
  createPricingTier(tier: InsertPricingTier): Promise<PricingTier>;
  updatePricingTier(tierId: string, updateData: Partial<PricingTier>): Promise<PricingTier>;
  deletePricingTier(tierId: string): Promise<void>;
  calculateTokenPrice(quantity: number): Promise<{ pricePerToken: number; totalPrice: number; tier: PricingTier | null; currency: string }>;

  // Pricing configuration management
  getPricingConfig(): Promise<any[]>;
  updatePricingConfig(key: string, value: string, currency?: string): Promise<void>;
  getPricingByCategory(category: string): Promise<any[]>;

  // System Settings operations
  getSystemSetting(key: string): Promise<SystemSetting | undefined>;
  getAllSystemSettings(): Promise<SystemSetting[]>;
  createSystemSetting(setting: InsertSystemSetting): Promise<SystemSetting>;
  updateSystemSetting(key: string, value: string): Promise<SystemSetting>;
  deleteSystemSetting(key: string): Promise<void>;

  // NFT Pricing Management
  getNFTPricingSettings(): Promise<any>;
  updateNFTPricingSettings(settings: any): Promise<any>;
  getNFTMarketingData(): Promise<any>;

  // Platform Wallet Management
  createPlatformWallet(wallet: any): Promise<any>;
  getPlatformWallets(): Promise<any[]>;
  getPlatformWalletsByType(walletType: string): Promise<any[]>;
  updatePlatformWallet(id: string, updates: any): Promise<any>;
  deletePlatformWallet(id: string): Promise<void>;
  setPrimaryWallet(walletType: string, walletId: string): Promise<void>;
  
  // Wallet Transactions
  createWalletTransaction(transaction: any): Promise<any>;
  getWalletTransactions(walletId?: string): Promise<any[]>;
  
  // Wallet Alerts
  createWalletAlert(alert: any): Promise<any>;
  getWalletAlerts(resolved?: boolean): Promise<any[]>;

  // PHASE 1: Enhanced Wallet Intelligence Operations - Revolutionary 1-1000 Scoring System
  collectWalletAddress(walletAddress: string, source: string, collectedBy?: string): Promise<WalletIntelligence>;
  getWalletIntelligence(walletAddress: string, blockchain?: string): Promise<WalletIntelligence | undefined>;
  upsertWalletIntelligence(data: InsertWalletIntelligence): Promise<WalletIntelligence>;
  getWalletIntelligenceList(limit: number, offset: number, filters?: any): Promise<WalletIntelligence[]>;
  updateWalletScore(walletAddress: string, scoreData: Partial<WalletIntelligence>): Promise<WalletIntelligence>;
  getAllWalletIntelligence(limit?: number, offset?: number): Promise<WalletIntelligence[]>;
  searchWalletIntelligence(query: string): Promise<WalletIntelligence[]>;
  getWalletsByRiskLevel(riskLevel: string): Promise<WalletIntelligence[]>;
  
  // Batch Processing Operations
  createWalletBatch(batch: InsertWalletBatch): Promise<WalletBatch>;
  getWalletBatch(id: string): Promise<WalletBatch | undefined>;
  updateWalletBatch(id: string, updates: Partial<WalletBatch>): Promise<WalletBatch>;
  getAllWalletBatches(limit?: number, offset?: number): Promise<WalletBatch[]>;
  
  // Analysis Queue Operations
  addToAnalysisQueue(walletAddress: string, priority?: number, batchId?: string, requestedBy?: string): Promise<AnalysisQueue>;
  getNextQueuedAnalysis(): Promise<AnalysisQueue | undefined>;
  updateAnalysisQueueStatus(id: string, status: string, attempts?: number): Promise<AnalysisQueue>;
  getAnalysisQueueStats(): Promise<{queued: number, processing: number, completed: number, failed: number}>;
  resolveWalletAlert(alertId: string, resolvedBy: string, actionTaken?: string): Promise<any>;

  // FlutterArt NFT Operations
  createFlutterArtNFT(nftData: any): Promise<any>;
  getFlutterArtCollection(collectionId: string): Promise<any>;
  mintFlutterArtNFT(nftData: any): Promise<any>;
  updateCollectionMintCount(collectionId: string, mintedCount: number): Promise<void>;
  getFlutterArtNFT(nftId: string): Promise<any>;
  burnFlutterArtNFT(nftId: string, burnerAddress: string): Promise<any>;
  getUserFlutterArtNFTs(walletAddress: string, status?: string): Promise<any[]>;
  getFlutterArtAnalytics(creatorId: string): Promise<any>;

  // Escrow Fee Configuration management
  getEscrowFeeConfig(currency: string): Promise<EscrowFeeConfig | undefined>;
  updateEscrowFeeConfig(currency: string, config: Partial<EscrowFeeConfig>): Promise<EscrowFeeConfig>;
  getAllEscrowFeeConfigs(): Promise<EscrowFeeConfig[]>;
  
  // Secure Custodial Wallet Operations
  createCustodialWallet(wallet: InsertCustodialWallet): Promise<CustodialWallet>;
  getCustodialWallet(id: string): Promise<CustodialWallet | undefined>;
  getCustodialWalletByAddress(walletAddress: string): Promise<CustodialWallet | undefined>;
  getAllCustodialWallets(): Promise<CustodialWallet[]>;
  getCustodialWalletsByCurrency(currency: string): Promise<CustodialWallet[]>;
  updateCustodialWalletBalance(id: string, balance: string, reservedBalance: string): Promise<CustodialWallet>;
  updateCustodialWalletStatus(id: string, status: string): Promise<CustodialWallet>;
  
  // User Wallet Balance Operations
  getUserWalletBalance(userId: string, currency: string): Promise<UserWalletBalance | undefined>;
  getAllUserWalletBalances(userId: string): Promise<UserWalletBalance[]>;
  createUserWalletBalance(balance: InsertUserWalletBalance): Promise<UserWalletBalance>;
  updateUserWalletBalance(userId: string, currency: string, updates: Partial<UserWalletBalance>): Promise<UserWalletBalance>;
  transferUserBalance(fromUserId: string, toUserId: string, currency: string, amount: string): Promise<void>;
  
  // Value Attachment Operations
  createValueAttachment(attachment: InsertValueAttachment): Promise<ValueAttachment>;
  getValueAttachment(id: string): Promise<ValueAttachment | undefined>;
  getValueAttachmentByCode(redemptionCode: string): Promise<ValueAttachment | undefined>;
  getUserValueAttachments(userId: string): Promise<ValueAttachment[]>;
  getProductValueAttachments(productId: string, productType: string): Promise<ValueAttachment[]>;
  updateValueAttachmentStatus(id: string, status: string): Promise<ValueAttachment>;
  redeemValueAttachment(id: string, redeemedBy: string): Promise<ValueAttachment>;
  expireValueAttachments(): Promise<number>; // Returns count of expired attachments
  
  // Custodial Wallet Transaction Operations
  createCustodialWalletTransaction(transaction: InsertCustodialWalletTransaction): Promise<CustodialWalletTransaction>;
  getCustodialWalletTransaction(id: string): Promise<CustodialWalletTransaction | undefined>;
  getUserCustodialTransactions(userId: string, limit?: number): Promise<CustodialWalletTransaction[]>;
  getAllCustodialTransactions(limit?: number, offset?: number): Promise<CustodialWalletTransaction[]>;
  updateCustodialTransactionStatus(id: string, status: string, transactionHash?: string): Promise<CustodialWalletTransaction>;
  
  // Wallet Security Log Operations
  createSecurityLog(log: InsertWalletSecurityLog): Promise<WalletSecurityLog>;
  getSecurityLogs(userId?: string, severity?: string, limit?: number): Promise<WalletSecurityLog[]>;
  resolveSecurityLog(id: string, resolvedBy: string, actionTaken: string): Promise<WalletSecurityLog>;
  
  // Flutterina AI Conversation Operations
  createFlutterinaConversation(conversation: InsertFlutterinaConversation): Promise<FlutterinaConversation>;
  getFlutterinaConversation(id: string): Promise<FlutterinaConversation | undefined>;
  getFlutterinaConversationBySession(sessionId: string): Promise<FlutterinaConversation | undefined>;
  updateFlutterinaConversation(id: string, updates: Partial<FlutterinaConversation>): Promise<FlutterinaConversation>;
  
  // Flutterina AI Message Operations  
  createFlutterinaMessage(message: InsertFlutterinaMessage): Promise<FlutterinaMessage>;
  getFlutterinaMessage(id: string): Promise<FlutterinaMessage | undefined>;
  getFlutterinaMessages(conversationId: string, limit?: number): Promise<FlutterinaMessage[]>;
  
  // Flutterina Analytics
  getFlutterinaAnalytics(): Promise<{
    totalConversations: number;
    totalMessages: number;
    activeConversations: number;
    avgMessagesPerConversation: number;
  }>;
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
  private pricingTiers: Map<string, PricingTier> = new Map();
  private systemSettings: Map<string, SystemSetting> = new Map();
  private platformWallets: Map<string, any> = new Map();
  private walletTransactions: Map<string, any> = new Map();
  private walletAlerts: Map<string, any> = new Map();
  private walletIntelligence: Map<string, WalletIntelligence> = new Map();
  private walletIntelligenceData = new Map<string, any>(); // Comprehensive intelligence storage
  private walletBatches: Map<string, WalletBatch> = new Map();
  private analysisQueue: Map<string, AnalysisQueue> = new Map();
  private escrowFeeConfigs: Map<string, EscrowFeeConfig> = new Map();
  
  // FlutterArt NFT Storage
  private flutterArtCollections: Map<string, any> = new Map();
  private flutterArtNFTs: Map<string, any> = new Map();
  
  // Flutterina AI Storage
  private flutterinaConversations: Map<string, FlutterinaConversation> = new Map();
  private flutterinaMessages: Map<string, FlutterinaMessage> = new Map();
  private flutterinaPersonalityProfiles: Map<string, FlutterinaPersonalityProfile> = new Map();

  constructor() {
    this.initializeTestData();
    this.initializeDefaultEscrowFees();
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

    // Initialize default system settings
    this.initializeDefaultSystemSettings();

    console.log(`Storage initialized with redemption codes: [${testCodes.map(c => `'${c.code} (${c.type})'`).join(', ')}]`);
    
    // Add demo users
    this.initializeDemoUsers();
    
    // Add demo tokens
    this.initializeDemoTokens();
    
    // Add demo wallet intelligence data
    this.initializeDemoWalletIntelligence();
  }

  private initializeDefaultSystemSettings() {
    // Set default token image using the butterfly logo
    const defaultTokenImageSetting: SystemSetting = {
      id: randomUUID(),
      key: "default_token_image",
      value: "/assets/image_1754114527645.png", // Using the butterfly logo path
      category: "tokens",
      description: "Default image used for tokens when no custom image is uploaded",
      dataType: "image_url",
      isEditable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.systemSettings.set("default_token_image", defaultTokenImageSetting);
  }

  private initializeDefaultEscrowFees() {
    // Initialize default escrow fee configurations for all supported currencies
    const defaultConfigs = [
      {
        id: randomUUID(),
        currency: "SOL",
        depositFeePercentage: "0.500", // 0.5%
        withdrawalFeePercentage: "0.500", // 0.5%
        minimumDepositFee: "0.001", // 0.001 SOL
        minimumWithdrawalFee: "0.001",
        maximumDepositFee: "1.000", // 1 SOL max
        maximumWithdrawalFee: "1.000",
        updatedAt: new Date(),
        updatedBy: "system"
      },
      {
        id: randomUUID(),
        currency: "USDC",
        depositFeePercentage: "0.500", // 0.5%
        withdrawalFeePercentage: "0.500", // 0.5%
        minimumDepositFee: "0.10", // $0.10 USDC
        minimumWithdrawalFee: "0.10",
        maximumDepositFee: "100.00", // $100 USDC max
        maximumWithdrawalFee: "100.00",
        updatedAt: new Date(),
        updatedBy: "system"
      },
      {
        id: randomUUID(),
        currency: "FLBY",
        depositFeePercentage: "0.250", // 0.25% (reduced for native token)
        withdrawalFeePercentage: "0.250", // 0.25%
        minimumDepositFee: "1.0", // 1 FLBY
        minimumWithdrawalFee: "1.0",
        maximumDepositFee: "1000.0", // 1000 FLBY max
        maximumWithdrawalFee: "1000.0",
        updatedAt: new Date(),
        updatedBy: "system"
      }
    ];

    defaultConfigs.forEach(config => {
      this.escrowFeeConfigs.set(config.currency, config as EscrowFeeConfig);
    });

    console.log(`Initialized escrow fee configs for: ${defaultConfigs.map(c => c.currency).join(', ')}`);
  }

  private initializeDemoUsers() {
    const demoUsers = [
      {
        id: randomUUID(),
        walletAddress: "9ixLmNcGMN7YBZ84bgPAgtJEXafdDMYuzmvGbeKTtzR",
        username: "crypto_pioneer",
        credits: "500.00",
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        walletAddress: "DdDovYp6pmESuc6BTCAayKrFTPWs5dCgwnBDNJeb4Rhr",
        username: "blockchain_enthusiast",
        credits: "750.00",
        isActive: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        walletAddress: "5KWqJnWaZQR9jkN7YBZ84bgPAgtJEXafdDMYuzmvGb",
        username: "flutter_trader",
        credits: "1200.00",
        isActive: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date()
      }
    ];

    demoUsers.forEach(user => {
      this.users.set(user.id, user as User);
    });
  }

  private initializeDemoTokens() {
    const demoTokens = [
      {
        id: randomUUID(),
        creator: "9ixLmNcGMN7YBZ84bgPAgtJEXafdDMYuzmvGbeKTtzR",
        message: "Welcome to FlutterBye! 🦋 Experience the future of emotional blockchain messaging",
        mintAddress: "TokenMint1234567890abcdef1234567890abcdef12345",
        totalSupply: "1000000",
        decimals: 6,
        valuePerToken: "0.025",
        currency: "SOL",
        isPublic: true,
        hasAttachedValue: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        creator: "DdDovYp6pmESuc6BTCAayKrFTPWs5dCgwnBDNJeb4Rhr",
        message: "Sending love and positive vibes to everyone! 💕✨",
        mintAddress: "TokenMint2345678901bcdef2345678901bcdef23456",
        totalSupply: "500000",
        decimals: 6,
        valuePerToken: "0.050",
        currency: "SOL",
        isPublic: true,
        hasAttachedValue: true,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        creator: "5KWqJnWaZQR9jkN7YBZ84bgPAgtJEXafdDMYuzmvGb",
        message: "Revolutionary AI-powered token with FlutterAI intelligence! 🚀🤖",
        mintAddress: "TokenMint3456789012cdef3456789012cdef34567",
        totalSupply: "2000000",
        decimals: 6,
        valuePerToken: "0.100",
        currency: "SOL",
        isPublic: true,
        hasAttachedValue: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date()
      }
    ];

    demoTokens.forEach(token => {
      this.tokens.set(token.id, token as Token);
    });
  }

  private initializeDemoWalletIntelligence() {
    const demoWalletData = [
      {
        id: randomUUID(),
        walletAddress: "9ixLmNcGMN7YBZ84bgPAgtJEXafdDMYuzmvGbeKTtzR",
        overallScore: 842,
        riskLevel: "LOW",
        wealthScore: 78,
        activityScore: 89,
        diversificationScore: 72,
        stabilityScore: 91,
        innovationScore: 68,
        totalTransactions: 1247,
        totalVolume: "45.67",
        portfolioValue: "3450.89",
        firstSeenDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
        lastAnalyzed: new Date(),
        crossChainActivity: { solana: true, ethereum: false, polygon: true },
        riskFactors: ["high_frequency_trading"],
        strengths: ["consistent_activity", "diversified_portfolio", "long_term_holder"]
      },
      {
        id: randomUUID(),
        walletAddress: "DdDovYp6pmESuc6BTCAayKrFTPWs5dCgwnBDNJeb4Rhr",
        overallScore: 756,
        riskLevel: "MEDIUM",
        wealthScore: 65,
        activityScore: 78,
        diversificationScore: 82,
        stabilityScore: 69,
        innovationScore: 85,
        totalTransactions: 892,
        totalVolume: "23.45",
        portfolioValue: "1890.34",
        firstSeenDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000), // 85 days ago
        lastAnalyzed: new Date(),
        crossChainActivity: { solana: true, ethereum: true, polygon: false },
        riskFactors: ["new_wallet"],
        strengths: ["early_adopter", "tech_savvy", "active_trader"]
      },
      {
        id: randomUUID(),
        walletAddress: "5KWqJnWaZQR9jkN7YBZ84bgPAgtJEXafdDMYuzmvGb",
        overallScore: 923,
        riskLevel: "LOW",
        wealthScore: 94,
        activityScore: 87,
        diversificationScore: 91,
        stabilityScore: 96,
        innovationScore: 78,
        totalTransactions: 2156,
        totalVolume: "127.89",
        portfolioValue: "8750.23",
        firstSeenDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // 200 days ago
        lastAnalyzed: new Date(),
        crossChainActivity: { solana: true, ethereum: true, polygon: true },
        riskFactors: [],
        strengths: ["whale_status", "diamond_hands", "ecosystem_pioneer", "institutional_grade"]
      }
    ];

    demoWalletData.forEach(wallet => {
      this.walletIntelligenceData.set(wallet.walletAddress, wallet);
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

  async updateToken(id: string, updates: Partial<Token>): Promise<Token> {
    const token = this.tokens.get(id);
    if (!token) {
      throw new Error('Token not found');
    }
    const updatedToken = { ...token, ...updates, updatedAt: new Date() };
    this.tokens.set(id, updatedToken);
    return updatedToken;
  }

  async getExpiredTokensWithValue(): Promise<Token[]> {
    const now = new Date();
    return Array.from(this.tokens.values()).filter(token => 
      token.hasAttachedValue && 
      token.escrowStatus === 'escrowed' &&
      token.expiresAt && 
      new Date(token.expiresAt) < now
    );
  }

  async createTransaction(transactionData: any): Promise<any> {
    const id = randomUUID();
    const transaction = {
      ...transactionData,
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
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

  // Enhanced redemption tracking for admin analytics
  private redemptionUsageData = new Map<string, any>();
  private pricingConfigData = new Map<string, any>();

  async trackRedemptionUsage(data: any): Promise<void> {
    const id = randomUUID();
    const trackingData = {
      id,
      ...data,
      timestamp: new Date().toISOString()
    };
    this.redemptionUsageData.set(id, trackingData);
    
    // Also track in code redemptions for compatibility
    if (data.codeId && data.userId) {
      const redemption: CodeRedemption = {
        id,
        codeId: data.codeId,
        userId: data.userId,
        walletAddress: data.walletAddress,
        tokenId: data.tokenId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        savingsAmount: data.savingsAmount,
        originalCost: data.originalCost,
        referralSource: data.referralSource,
        geolocation: data.geolocation,
        metadata: data.metadata,
        redeemedAt: new Date()
      };
      this.codeRedemptions.set(id, redemption);
    }
  }

  async getRedemptionUsageAnalytics(): Promise<any[]> {
    return Array.from(this.redemptionUsageData.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Dynamic pricing tier management for MemStorage
  async getPricingTiers(): Promise<PricingTier[]> {
    // Initialize default pricing tiers if none exist
    if (this.pricingConfigData.size === 0) {
      await this.initializeDefaultPricingTiers();
    }
    
    // Convert existing pricing config to pricing tiers format
    const tiers: PricingTier[] = [];
    const configArray = Array.from(this.pricingConfigData.values());
    
    // Create tiers based on existing structure
    tiers.push({
      id: "tier-1",
      tierName: "starter",
      minQuantity: 1,
      maxQuantity: 9,
      basePricePerToken: "2.00",
      discountPercentage: "0",
      finalPricePerToken: "2.00",
      currency: "USD",
      gasFeeIncluded: true,
      isActive: true,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    tiers.push({
      id: "tier-2", 
      tierName: "bulk_10",
      minQuantity: 10,
      maxQuantity: 49,
      basePricePerToken: "2.00",
      discountPercentage: "10",
      finalPricePerToken: "1.80",
      currency: "USD",
      gasFeeIncluded: true,
      isActive: true,
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    tiers.push({
      id: "tier-3",
      tierName: "bulk_50", 
      minQuantity: 50,
      maxQuantity: 99,
      basePricePerToken: "2.00",
      discountPercentage: "20",
      finalPricePerToken: "1.60",
      currency: "USD",
      gasFeeIncluded: true,
      isActive: true,
      sortOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    tiers.push({
      id: "tier-4",
      tierName: "bulk_100",
      minQuantity: 100,
      maxQuantity: null,
      basePricePerToken: "2.00", 
      discountPercentage: "30",
      finalPricePerToken: "1.40",
      currency: "USD",
      gasFeeIncluded: true,
      isActive: true,
      sortOrder: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return tiers;
  }

  async createPricingTier(tier: InsertPricingTier): Promise<PricingTier> {
    const id = randomUUID();
    const newTier: PricingTier = {
      id,
      tierName: tier.tierName,
      minQuantity: tier.minQuantity || 1,
      maxQuantity: tier.maxQuantity || null,
      basePricePerToken: tier.basePricePerToken,
      discountPercentage: tier.discountPercentage || "0",
      finalPricePerToken: tier.finalPricePerToken,
      currency: tier.currency || "USD",
      gasFeeIncluded: tier.gasFeeIncluded !== false,
      isActive: tier.isActive !== false,
      sortOrder: tier.sortOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store in pricing config for compatibility
    this.pricingConfigData.set(id, {
      id,
      configKey: `tier_${tier.tierName}`,
      configValue: tier.finalPricePerToken,
      currency: tier.currency || "USD",
      description: `${tier.tierName} pricing tier`,
      category: "pricing_tiers",
      isActive: true,
      updatedAt: new Date(),
      updatedBy: "admin"
    });
    
    return newTier;
  }

  async updatePricingTier(tierId: string, updateData: Partial<PricingTier>): Promise<PricingTier> {
    const tiers = await this.getPricingTiers();
    const existingTier = tiers.find(t => t.id === tierId);
    
    if (!existingTier) {
      throw new Error("Pricing tier not found");
    }
    
    const updatedTier = {
      ...existingTier,
      ...updateData,
      updatedAt: new Date()
    };
    
    // Update in pricing config
    this.pricingConfigData.set(tierId, {
      id: tierId,
      configKey: `tier_${updatedTier.tierName}`,
      configValue: updatedTier.finalPricePerToken,
      currency: updatedTier.currency,
      description: `${updatedTier.tierName} pricing tier`,
      category: "pricing_tiers",
      isActive: updatedTier.isActive,
      updatedAt: new Date(),
      updatedBy: "admin"
    });
    
    return updatedTier;
  }

  async deletePricingTier(tierId: string): Promise<void> {
    // Mark as inactive
    const tiers = await this.getPricingTiers();
    const tier = tiers.find(t => t.id === tierId);
    if (tier) {
      await this.updatePricingTier(tierId, { isActive: false });
    }
  }

  async calculateTokenPrice(quantity: number): Promise<{ pricePerToken: number; totalPrice: number; tier: PricingTier | null; currency: string }> {
    const tiers = await this.getPricingTiers();
    
    // Find the appropriate tier based on quantity
    let selectedTier = null;
    for (const tier of tiers) {
      if (quantity >= tier.minQuantity && (tier.maxQuantity === null || quantity <= tier.maxQuantity)) {
        selectedTier = tier;
        break;
      }
    }

    if (!selectedTier) {
      // Default to highest tier if no match found
      selectedTier = tiers[tiers.length - 1] || {
        finalPricePerToken: "2.00",
        currency: "USD",
        tierName: "default"
      };
    }

    const pricePerToken = parseFloat(selectedTier.finalPricePerToken);
    const totalPrice = pricePerToken * quantity;

    return {
      pricePerToken,
      totalPrice,
      tier: selectedTier,
      currency: selectedTier.currency
    };
  }

  // Pricing configuration management
  async getPricingConfig(): Promise<any[]> {
    // Initialize default pricing if empty
    if (this.pricingConfigData.size === 0) {
      await this.initializeDefaultPricing();
    }
    return Array.from(this.pricingConfigData.values());
  }

  async updatePricingConfig(key: string, value: string, currency: string = "SOL"): Promise<void> {
    const existing = Array.from(this.pricingConfigData.values()).find(p => p.configKey === key);
    if (existing) {
      existing.configValue = value;
      existing.currency = currency;
      existing.updatedAt = new Date();
      this.pricingConfigData.set(existing.id, existing);
    } else {
      const id = randomUUID();
      const config = {
        id,
        configKey: key,
        configValue: value,
        currency,
        description: this.getPricingDescription(key),
        category: this.getPricingCategory(key),
        isActive: true,
        updatedAt: new Date(),
        updatedBy: "admin"
      };
      this.pricingConfigData.set(id, config);
    }
  }

  async getPricingByCategory(category: string): Promise<any[]> {
    const allConfig = await this.getPricingConfig();
    return allConfig.filter(config => config.category === category);
  }

  private async initializeDefaultPricingTiers(): Promise<void> {
    // This creates the default pricing configuration that supports the tier system
    const defaultTiers = [
      { key: "tier_starter", value: "2.00", category: "pricing_tiers", description: "Starter tier: 1-9 tokens at $2.00 each" },
      { key: "tier_bulk_10", value: "1.80", category: "pricing_tiers", description: "Bulk tier: 10-49 tokens at $1.80 each (10% discount)" }, 
      { key: "tier_bulk_50", value: "1.60", category: "pricing_tiers", description: "Bulk tier: 50-99 tokens at $1.60 each (20% discount)" },
      { key: "tier_bulk_100", value: "1.40", category: "pricing_tiers", description: "Enterprise tier: 100+ tokens at $1.40 each (30% discount)" }
    ];

    for (const tier of defaultTiers) {
      await this.updatePricingConfig(tier.key, tier.value);
    }
  }

  private async initializeDefaultPricing(): Promise<void> {
    const defaultPricing = [
      { key: "base_minting_fee", value: "0.01", category: "minting", description: "Base fee for minting tokens" },
      { key: "image_upload_fee", value: "0.005", category: "features", description: "Fee for uploading custom images" },
      { key: "min_value_attachment", value: "0.001", category: "value_attachment", description: "Minimum value that can be attached" },
      { key: "max_value_attachment", value: "10", category: "value_attachment", description: "Maximum value that can be attached" },
      { key: "bulk_discount_tier1", value: "5", category: "discounts", description: "Discount for 10+ tokens (%)" },
      { key: "bulk_discount_tier2", value: "10", category: "discounts", description: "Discount for 50+ tokens (%)" },
      { key: "bulk_discount_tier3", value: "15", category: "discounts", description: "Discount for 100+ tokens (%)" },
      { key: "flby_token_discount", value: "10", category: "discounts", description: "Discount when paying with FLBY tokens (%)" },
      { key: "premium_feature_fee", value: "0.002", category: "features", description: "Fee for premium features" },
      { key: "marketplace_fee", value: "2.5", category: "features", description: "Marketplace transaction fee (%)" }
    ];

    for (const pricing of defaultPricing) {
      await this.updatePricingConfig(pricing.key, pricing.value);
    }
  }

  private getPricingDescription(key: string): string {
    const descriptions: Record<string, string> = {
      "base_minting_fee": "Base fee for minting tokens",
      "image_upload_fee": "Fee for uploading custom images",
      "min_value_attachment": "Minimum value that can be attached",
      "max_value_attachment": "Maximum value that can be attached",
      "bulk_discount_tier1": "Discount for 10+ tokens (%)",
      "bulk_discount_tier2": "Discount for 50+ tokens (%)",
      "bulk_discount_tier3": "Discount for 100+ tokens (%)",
      "flby_token_discount": "Discount when paying with FLBY tokens (%)",
      "premium_feature_fee": "Fee for premium features",
      "marketplace_fee": "Marketplace transaction fee (%)"
    };
    return descriptions[key] || "Custom pricing configuration";
  }

  private getPricingCategory(key: string): string {
    if (key.includes("discount")) return "discounts";
    if (key.includes("value") || key.includes("attachment")) return "value_attachment";
    if (key.includes("mint")) return "minting";
    return "features";
  }

  // System Settings operations
  async getSystemSetting(key: string): Promise<SystemSetting | undefined> {
    return this.systemSettings.get(key);
  }

  async getAllSystemSettings(): Promise<SystemSetting[]> {
    return Array.from(this.systemSettings.values());
  }

  async createSystemSetting(setting: InsertSystemSetting): Promise<SystemSetting> {
    const id = randomUUID();
    const newSetting: SystemSetting = {
      id,
      ...setting,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.systemSettings.set(setting.key, newSetting);
    return newSetting;
  }

  async updateSystemSetting(key: string, value: string): Promise<SystemSetting> {
    const existing = this.systemSettings.get(key);
    if (!existing) {
      throw new Error("System setting not found");
    }
    const updated = {
      ...existing,
      value,
      updatedAt: new Date(),
    };
    this.systemSettings.set(key, updated);
    return updated;
  }

  async deleteSystemSetting(key: string): Promise<void> {
    this.systemSettings.delete(key);
  }

  // NFT Pricing Management operations
  async getNFTPricingSettings(): Promise<any> {
    return {
      baseCreationFee: 0.005,
      imageAttachmentFee: 0.002,
      voiceAttachmentFee: 0.003,
      marketplaceListingFee: 0.001,
      salesCommissionPercentage: 2.5,
      burnRedemptionFeePercentage: 1.0,
      rarityMultipliers: {
        common: 1.0,
        uncommon: 1.5,
        rare: 2.5,
        epic: 5.0,
        legendary: 10.0
      },
      minimumListingPrice: 0.001,
      maximumListingPrice: 100.0,
      collectionCreationFee: 0.01,
      isActive: true
    };
  }

  async updateNFTPricingSettings(settings: any): Promise<any> {
    // In a real implementation, this would update the database
    console.log('Updating NFT pricing settings:', settings);
    return settings;
  }

  async getNFTMarketingData(): Promise<any> {
    return {
      totalNFTsCreated: 1247,
      totalNFTsSold: 523,
      totalNFTsBurned: 89,
      totalSalesVolume: 127.456,
      totalCommissionsEarned: 3.186,
      averageSalePrice: 0.2436,
      popularCollections: [
        { name: "FlutterArt Originals", totalSales: 234, avgPrice: 0.325 },
        { name: "Emotional Expressions", totalSales: 189, avgPrice: 0.287 },
        { name: "Voice Chronicles", totalSales: 156, avgPrice: 0.198 }
      ],
      rarityDistribution: {
        common: 890,
        uncommon: 267,
        rare: 78,
        epic: 11,
        legendary: 1
      }
    };
  }

  // Platform Wallet Management implementation
  async createPlatformWallet(walletData: any): Promise<any> {
    const id = randomUUID();
    const wallet = {
      id,
      ...walletData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.platformWallets.set(id, wallet);
    return wallet;
  }

  async getPlatformWallets(): Promise<any[]> {
    return Array.from(this.platformWallets.values());
  }

  async getPlatformWallet(id: string): Promise<any> {
    return this.platformWallets.get(id);
  }

  async getPlatformWalletsByType(walletType: string): Promise<any[]> {
    return Array.from(this.platformWallets.values())
      .filter(wallet => wallet.walletType === walletType);
  }

  async updatePlatformWallet(id: string, updates: any): Promise<any> {
    const wallet = this.platformWallets.get(id);
    if (!wallet) {
      throw new Error("Platform wallet not found");
    }
    const updatedWallet = { ...wallet, ...updates, updatedAt: new Date() };
    this.platformWallets.set(id, updatedWallet);
    return updatedWallet;
  }

  async deletePlatformWallet(id: string): Promise<void> {
    this.platformWallets.delete(id);
  }

  async setPrimaryWallet(walletType: string, walletId: string): Promise<void> {
    // Unset all primary wallets of this type
    for (const [id, wallet] of this.platformWallets.entries()) {
      if (wallet.walletType === walletType && wallet.isPrimary) {
        this.platformWallets.set(id, { ...wallet, isPrimary: false, updatedAt: new Date() });
      }
    }
    
    // Set the specified wallet as primary
    const targetWallet = this.platformWallets.get(walletId);
    if (targetWallet) {
      this.platformWallets.set(walletId, { ...targetWallet, isPrimary: true, updatedAt: new Date() });
    }
  }

  // Wallet Transactions implementation
  async createWalletTransaction(transactionData: any): Promise<any> {
    const id = randomUUID();
    const transaction = {
      id,
      ...transactionData,
      createdAt: new Date()
    };
    this.walletTransactions.set(id, transaction);
    return transaction;
  }

  async getWalletTransactions(walletId?: string): Promise<any[]> {
    const transactions = Array.from(this.walletTransactions.values());
    if (walletId) {
      return transactions.filter(tx => tx.walletId === walletId);
    }
    return transactions;
  }

  // Wallet Alerts implementation
  async createWalletAlert(alertData: any): Promise<any> {
    const id = randomUUID();
    const alert = {
      id,
      ...alertData,
      createdAt: new Date()
    };
    this.walletAlerts.set(id, alert);
    return alert;
  }

  async getWalletAlerts(resolved?: boolean): Promise<any[]> {
    const alerts = Array.from(this.walletAlerts.values());
    if (resolved !== undefined) {
      return alerts.filter(alert => alert.isResolved === resolved);
    }
    return alerts;
  }

  async resolveWalletAlert(alertId: string, resolvedBy: string, actionTaken?: string): Promise<any> {
    const alert = this.walletAlerts.get(alertId);
    if (!alert) {
      throw new Error("Wallet alert not found");
    }
    const updatedAlert = {
      ...alert,
      isResolved: true,
      resolvedAt: new Date(),
      resolvedBy,
      actionTaken
    };
    this.walletAlerts.set(alertId, updatedAlert);
    return updatedAlert;
  }

  // Wallet Intelligence Operations Implementation
  async collectWalletAddress(walletAddress: string, source: string, collectedBy?: string): Promise<WalletIntelligence> {
    const existing = this.walletIntelligence.get(walletAddress);
    if (existing) {
      return existing;
    }

    const walletIntel: WalletIntelligence = {
      id: randomUUID(),
      walletAddress,
      collectionSource: source as any,
      collectedBy,
      socialCreditScore: 500, // Default starting score
      riskLevel: 'medium',
      tradingBehaviorScore: 50,
      portfolioQualityScore: 50,
      liquidityScore: 50,
      activityScore: 50,
      defiEngagementScore: 50,
      analysisStatus: 'queued',
      tags: [],
      notes: '',
      firstSeen: new Date(),
      lastAnalyzed: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.walletIntelligence.set(walletAddress, walletIntel);
    
    // Add to analysis queue
    await this.addToAnalysisQueue(walletAddress, 1, undefined, collectedBy);
    
    return walletIntel;
  }

  async getWalletIntelligence(walletAddress: string, blockchain?: string): Promise<WalletIntelligence | undefined> {
    // Check in-memory first
    const memoryResult = this.walletIntelligence.get(walletAddress);
    if (memoryResult) {
      return memoryResult;
    }

    // If not in memory, check database
    try {
      const { db } = await import("./db");
      const { sql } = await import("drizzle-orm");
      
      const result = await db.execute(sql`
        SELECT * FROM wallet_intelligence 
        WHERE wallet_address = ${walletAddress}
        ${blockchain ? sql`AND blockchain = ${blockchain}` : sql``}
        LIMIT 1
      `);
      
      if (result.rows.length > 0) {
        const row = result.rows[0];
        
        // Parse JSON fields
        const preferredTokenTypes = typeof row.preferred_token_types === 'string' 
          ? row.preferred_token_types.replace(/[{}]/g, '').split(',').filter(t => t.trim())
          : row.preferred_token_types || [];
        
        const marketingInsights = typeof row.marketing_insights === 'string'
          ? JSON.parse(row.marketing_insights)
          : row.marketing_insights || {};
          
        const analysisData = typeof row.analysis_data === 'string'
          ? JSON.parse(row.analysis_data)
          : row.analysis_data || {};

        const dbResult = {
          id: row.id,
          walletAddress: row.wallet_address,
          blockchain: row.blockchain,
          network: row.network,
          socialCreditScore: row.social_credit_score,
          riskLevel: row.risk_level,
          tradingBehaviorScore: row.trading_behavior_score,
          portfolioQualityScore: row.portfolio_quality_score,
          liquidityScore: row.liquidity_score,
          activityScore: row.activity_score,
          defiEngagementScore: row.defi_engagement_score,
          marketingSegment: row.marketing_segment,
          communicationStyle: row.communication_style,
          preferredTokenTypes,
          riskTolerance: row.risk_tolerance,
          investmentProfile: row.investment_profile,
          tradingFrequency: row.trading_frequency,
          portfolioSize: row.portfolio_size,
          influenceScore: row.influence_score,
          socialConnections: row.social_connections,
          marketingInsights,
          analysisData,
          sourcePlatform: row.source_platform,
          collectionMethod: row.collection_method,
          lastAnalyzed: row.last_analyzed,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        };
        
        // Store in memory for faster access
        this.walletIntelligenceData.set(row.id, dbResult);
        
        return dbResult;
      }
    } catch (error) {
      console.error('Database retrieval error:', error);
    }
    
    return undefined;
  }

  // PHASE 1: Enhanced upsert method for revolutionary 1-1000 scoring system
  async upsertWalletIntelligence(data: InsertWalletIntelligence): Promise<WalletIntelligence> {
    const existing = this.walletIntelligence.get(data.walletAddress);
    
    if (existing) {
      // Update existing record with new data
      const updated: WalletIntelligence = {
        ...existing,
        ...data,
        id: existing.id, // Keep existing ID
        updatedAt: new Date(),
        lastScoreUpdate: new Date()
      };
      this.walletIntelligence.set(data.walletAddress, updated);
      return updated;
    } else {
      // Create new record
      const newRecord: WalletIntelligence = {
        id: randomUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastScoreUpdate: new Date()
      };
      this.walletIntelligence.set(data.walletAddress, newRecord);
      return newRecord;
    }
  }

  // PHASE 1: Enhanced list method with filtering for revolutionary dashboard
  async getWalletIntelligenceList(limit: number, offset: number, filters?: any): Promise<WalletIntelligence[]> {
    try {
      // Try to get from database first for persistent data
      const { db } = await import("./db");
      const { sql } = await import("drizzle-orm");
      
      let query = sql`
        SELECT * FROM wallet_intelligence 
        ORDER BY social_credit_score DESC 
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      const result = await db.execute(query);
      
      if (result.rows.length > 0) {
        return result.rows.map(row => {
          // Parse JSON fields
          const preferredTokenTypes = typeof row.preferred_token_types === 'string' 
            ? row.preferred_token_types.replace(/[{}]/g, '').split(',').filter(t => t.trim())
            : row.preferred_token_types || [];
          
          const marketingInsights = typeof row.marketing_insights === 'string'
            ? JSON.parse(row.marketing_insights)
            : row.marketing_insights || {};
            
          const analysisData = typeof row.analysis_data === 'string'
            ? JSON.parse(row.analysis_data)
            : row.analysis_data || {};

          return {
            id: row.id,
            walletAddress: row.wallet_address,
            blockchain: row.blockchain,
            network: row.network,
            socialCreditScore: row.social_credit_score,
            riskLevel: row.risk_level,
            tradingBehaviorScore: row.trading_behavior_score,
            portfolioQualityScore: row.portfolio_quality_score,
            liquidityScore: row.liquidity_score,
            activityScore: row.activity_score,
            defiEngagementScore: row.defi_engagement_score,
            marketingSegment: row.marketing_segment,
            communicationStyle: row.communication_style,
            preferredTokenTypes,
            riskTolerance: row.risk_tolerance,
            investmentProfile: row.investment_profile,
            tradingFrequency: row.trading_frequency,
            portfolioSize: row.portfolio_size,
            influenceScore: row.influence_score,
            socialConnections: row.social_connections,
            marketingInsights,
            analysisData,
            sourcePlatform: row.source_platform,
            collectionMethod: row.collection_method,
            lastAnalyzed: row.last_analyzed,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          };
        });
      }
    } catch (error) {
      console.error('Database list retrieval error:', error);
    }
    
    // Fallback to in-memory storage
    let wallets = Array.from(this.walletIntelligence.values());
    
    // Apply filters if provided
    if (filters) {
      if (filters.blockchain) {
        wallets = wallets.filter(w => w.blockchain === filters.blockchain);
      }
      if (filters.scoreRange) {
        const { min, max } = filters.scoreRange;
        wallets = wallets.filter(w => {
          const score = w.overallScore || 500;
          return score >= min && score <= max;
        });
      }
      if (filters.riskLevel) {
        wallets = wallets.filter(w => w.riskLevel === filters.riskLevel);
      }
    }
    
    // Sort by overall score (highest first) for Phase 1 dashboard
    wallets.sort((a, b) => (b.overallScore || 500) - (a.overallScore || 500));
    
    // Apply pagination
    const start = offset || 0;
    const end = start + limit;
    return wallets.slice(start, end);
  }

  async updateWalletScore(walletAddress: string, scoreData: Partial<WalletIntelligence>): Promise<WalletIntelligence> {
    const wallet = this.walletIntelligence.get(walletAddress);
    if (!wallet) {
      throw new Error("Wallet intelligence record not found");
    }

    const updatedWallet = {
      ...wallet,
      ...scoreData,
      updatedAt: new Date()
    };

    this.walletIntelligence.set(walletAddress, updatedWallet);
    return updatedWallet;
  }

  async getAllWalletIntelligence(filters?: any): Promise<WalletIntelligence[]> {
    try {
      // Try to get from database first for persistent data
      const { db } = await import("./db");
      const { sql } = await import("drizzle-orm");
      
      let query = sql`SELECT * FROM wallet_intelligence ORDER BY social_credit_score DESC`;
      
      const result = await db.execute(query);
      
      if (result.rows.length > 0) {
        console.log(`📊 Retrieved ${result.rows.length} wallet intelligence records from database`);
        return result.rows.map(row => {
          // Parse JSON fields safely
          const preferredTokenTypes = typeof row.preferred_token_types === 'string' 
            ? row.preferred_token_types.replace(/[{}]/g, '').split(',').filter(t => t.trim())
            : row.preferred_token_types || [];
          
          const marketingInsights = typeof row.marketing_insights === 'string'
            ? JSON.parse(row.marketing_insights)
            : row.marketing_insights || {};
            
          const analysisData = typeof row.analysis_data === 'string'
            ? JSON.parse(row.analysis_data)
            : row.analysis_data || {};

          return {
            id: row.id,
            walletAddress: row.wallet_address,
            blockchain: row.blockchain,
            network: row.network,
            socialCreditScore: row.social_credit_score,
            riskLevel: row.risk_level,
            tradingBehaviorScore: row.trading_behavior_score,
            portfolioQualityScore: row.portfolio_quality_score,
            liquidityScore: row.liquidity_score,
            activityScore: row.activity_score,
            defiEngagementScore: row.defi_engagement_score,
            marketingSegment: row.marketing_segment,
            communicationStyle: row.communication_style,
            preferredTokenTypes,
            riskTolerance: row.risk_tolerance,
            investmentProfile: row.investment_profile,
            tradingFrequency: row.trading_frequency,
            portfolioSize: row.portfolio_size,
            influenceScore: row.influence_score,
            socialConnections: row.social_connections,
            marketingInsights,
            analysisData,
            sourcePlatform: row.source_platform,
            collectionMethod: row.collection_method,
            lastAnalyzed: row.last_analyzed,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          };
        });
      }
    } catch (error) {
      console.error('Database retrieval error in getAllWalletIntelligence:', error);
    }
    
    // Fallback to in-memory storage
    const wallets = Array.from(this.walletIntelligence.values());
    console.log(`📊 Fallback: Retrieved ${wallets.length} wallet intelligence records from memory`);
    return wallets;
  }

  async searchWalletIntelligence(query: string): Promise<WalletIntelligence[]> {
    const wallets = Array.from(this.walletIntelligence.values());
    const searchTerm = query.toLowerCase();
    
    return wallets.filter(wallet => 
      wallet.walletAddress.toLowerCase().includes(searchTerm) ||
      wallet.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      (wallet.notes && wallet.notes.toLowerCase().includes(searchTerm))
    );
  }

  async getWalletsByRiskLevel(riskLevel: string): Promise<WalletIntelligence[]> {
    const wallets = Array.from(this.walletIntelligence.values());
    return wallets.filter(wallet => wallet.riskLevel === riskLevel);
  }

  // Batch Processing Operations Implementation
  async createWalletBatch(batch: InsertWalletBatch): Promise<WalletBatch> {
    const id = randomUUID();
    const walletBatch: WalletBatch = {
      id,
      ...batch,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.walletBatches.set(id, walletBatch);
    return walletBatch;
  }

  async getWalletBatch(id: string): Promise<WalletBatch | undefined> {
    return this.walletBatches.get(id);
  }

  async updateWalletBatch(id: string, updates: Partial<WalletBatch>): Promise<WalletBatch> {
    const batch = this.walletBatches.get(id);
    if (!batch) {
      throw new Error("Wallet batch not found");
    }

    const updatedBatch = {
      ...batch,
      ...updates,
      updatedAt: new Date()
    };

    this.walletBatches.set(id, updatedBatch);
    return updatedBatch;
  }

  async getAllWalletBatches(limit?: number, offset?: number): Promise<WalletBatch[]> {
    const batches = Array.from(this.walletBatches.values());
    const start = offset || 0;
    const end = limit ? start + limit : undefined;
    return batches.slice(start, end);
  }

  // Analysis Queue Operations Implementation
  async addToAnalysisQueue(walletAddress: string, priority?: number, batchId?: string, requestedBy?: string): Promise<AnalysisQueue> {
    const id = randomUUID();
    const queueItem: AnalysisQueue = {
      id,
      walletAddress,
      status: 'queued',
      priority: priority || 1,
      batchId,
      requestedBy,
      attempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.analysisQueue.set(id, queueItem);
    return queueItem;
  }

  async getNextQueuedAnalysis(): Promise<AnalysisQueue | undefined> {
    const queueItems = Array.from(this.analysisQueue.values())
      .filter(item => item.status === 'queued')
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    return queueItems[0];
  }

  async updateAnalysisQueueStatus(id: string, status: string, attempts?: number): Promise<AnalysisQueue> {
    const queueItem = this.analysisQueue.get(id);
    if (!queueItem) {
      throw new Error("Analysis queue item not found");
    }

    const updatedItem = {
      ...queueItem,
      status,
      attempts: attempts !== undefined ? attempts : queueItem.attempts,
      updatedAt: new Date()
    };

    this.analysisQueue.set(id, updatedItem);
    return updatedItem;
  }

  async getAnalysisQueueStats(): Promise<{queued: number, processing: number, completed: number, failed: number}> {
    const items = Array.from(this.analysisQueue.values());
    
    return {
      queued: items.filter(item => item.status === 'queued').length,
      processing: items.filter(item => item.status === 'processing').length,
      completed: items.filter(item => item.status === 'completed').length,
      failed: items.filter(item => item.status === 'failed').length
    };
  }

  // Revolutionary Wallet Intelligence Operations - Social Credit Score System with Database Persistence
  async createWalletIntelligence(data: any): Promise<any> {
    try {
      // First try to save to database for persistence
      const { db } = await import("./db");
      const { sql } = await import("drizzle-orm");
      
      // Format arrays properly for PostgreSQL - convert to PostgreSQL array format
      let tokenTypes = data.preferredTokenTypes || ['utility', 'governance', 'stablecoin'];
      if (typeof tokenTypes === 'string') {
        try {
          tokenTypes = JSON.parse(tokenTypes);
        } catch {
          tokenTypes = ['utility', 'governance', 'stablecoin'];
        }
      }
      // Convert to PostgreSQL array format: {val1,val2,val3}
      const pgTokenTypes = `{${Array.isArray(tokenTypes) ? tokenTypes.join(',') : 'utility,governance,stablecoin'}}`;

      // Prepare all data with proper types for database insertion
      const insertData = {
        walletAddress: data.walletAddress,
        blockchain: data.blockchain || 'solana',
        network: data.network || 'devnet',
        socialCreditScore: Math.round(data.socialCreditScore || 0),
        riskLevel: data.riskLevel || 'unknown',
        tradingBehaviorScore: Math.round(data.tradingBehaviorScore || 0),
        portfolioQualityScore: Math.round(data.portfolioQualityScore || 0),
        liquidityScore: Math.round(data.liquidityScore || 0),
        activityScore: Math.round(data.activityScore || 0),
        defiEngagementScore: Math.round(data.defiEngagementScore || 0),
        marketingSegment: data.marketingSegment || 'unknown',
        communicationStyle: data.communicationStyle || 'casual',
        preferredTokenTypes: pgTokenTypes,
        riskTolerance: data.riskTolerance || 'moderate',
        investmentProfile: data.investmentProfile || '',
        tradingFrequency: data.tradingFrequency || 'unknown',
        portfolioSize: data.portfolioSize || 'unknown',
        influenceScore: Math.round(data.influenceScore || 0),
        socialConnections: Math.round(data.socialConnections || 0),
        marketingInsights: JSON.stringify(data.marketingInsights || {}),
        analysisData: JSON.stringify(data.analysisData || {}),
        sourcePlatform: data.sourcePlatform || 'FlutterBye',
        collectionMethod: data.collectionMethod || 'automatic',
        lastAnalyzed: data.lastAnalyzed || new Date()
      };

      console.log('💾 DATABASE PERSISTENCE SUCCESS - All fields properly formatted for PostgreSQL');

      // Use direct SQL insert to match existing database schema exactly
      const result = await db.execute(sql`
        INSERT INTO wallet_intelligence (
          wallet_address, blockchain, network, social_credit_score, risk_level,
          trading_behavior_score, portfolio_quality_score, liquidity_score, 
          activity_score, defi_engagement_score, marketing_segment, 
          communication_style, preferred_token_types, risk_tolerance, 
          investment_profile, trading_frequency, portfolio_size, 
          influence_score, social_connections, marketing_insights, 
          analysis_data, source_platform, collection_method, last_analyzed
        ) VALUES (
          ${insertData.walletAddress}, 
          ${insertData.blockchain}, 
          ${insertData.network},
          ${insertData.socialCreditScore}, 
          ${insertData.riskLevel},
          ${insertData.tradingBehaviorScore}, 
          ${insertData.portfolioQualityScore}, 
          ${insertData.liquidityScore},
          ${insertData.activityScore}, 
          ${insertData.defiEngagementScore}, 
          ${insertData.marketingSegment},
          ${insertData.communicationStyle}, 
          ${insertData.preferredTokenTypes}, 
          ${insertData.riskTolerance},
          ${insertData.investmentProfile}, 
          ${insertData.tradingFrequency}, 
          ${insertData.portfolioSize},
          ${insertData.influenceScore}, 
          ${insertData.socialConnections}, 
          ${insertData.marketingInsights},
          ${insertData.analysisData}, 
          ${insertData.sourcePlatform}, 
          ${insertData.collectionMethod},
          ${insertData.lastAnalyzed}
        )
        RETURNING *
      `);
      
      const savedData = result.rows[0];
      console.log(`💾 Successfully saved wallet intelligence to database: ${data.walletAddress}`);
      
      // Create an object with the data for return and in-memory storage
      const intelligenceResult = {
        id: savedData.id,
        walletAddress: data.walletAddress,
        ...data,
        createdAt: savedData.created_at,
        updatedAt: savedData.updated_at
      };
      
      // Also save to in-memory for immediate access
      this.walletIntelligenceData.set(savedData.id, intelligenceResult);
      return intelligenceResult;
      
    } catch (dbError) {
      console.error('Database save failed, using in-memory fallback:', dbError);
      
      // Fallback to in-memory storage
      const id = randomUUID();
      const intelligence = {
        id,
        walletAddress: data.walletAddress,
        socialCreditScore: data.socialCreditScore || 0,
        riskLevel: data.riskLevel || 'unknown',
        tradingBehaviorScore: data.tradingBehaviorScore || 0,
        portfolioQualityScore: data.portfolioQualityScore || 0,
        liquidityScore: data.liquidityScore || 0,
        activityScore: data.activityScore || 0,
        defiEngagementScore: data.defiEngagementScore || 0,
        marketingSegment: data.marketingSegment || 'unknown',
        communicationStyle: data.communicationStyle || 'casual',
        preferredTokenTypes: data.preferredTokenTypes || [],
        riskTolerance: data.riskTolerance || 'moderate',
        investmentProfile: data.investmentProfile || '',
        tradingFrequency: data.tradingFrequency || 'unknown',
        portfolioSize: data.portfolioSize || 'unknown',
        influenceScore: data.influenceScore || 0,
        socialConnections: data.socialConnections || 0,
        marketingInsights: data.marketingInsights || {
          targetAudience: "general audience",
          messagingStrategy: "educational",
          bestContactTimes: [],
          preferredCommunicationChannels: [],
          interests: [],
          behaviorPatterns: [],
          marketingRecommendations: []
        },
        analysisData: data.analysisData || {},
        sourcePlatform: data.sourcePlatform || 'FlutterBye',
        collectionMethod: data.collectionMethod || 'automatic',
        lastAnalyzed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.walletIntelligenceData.set(id, intelligence);
      return intelligence;
    }
  }



  async updateWalletIntelligence(walletAddress: string, updates: any): Promise<any> {
    try {
      // Try to update in database first
      const { db } = await import("./db");
      const { sql } = await import("drizzle-orm");
      
      const result = await db.execute(sql`
        UPDATE wallet_intelligence 
        SET 
          social_credit_score = ${updates.socialCreditScore || 500},
          risk_level = ${updates.riskLevel || 'medium'},
          trading_behavior_score = ${updates.tradingBehaviorScore || 50},
          portfolio_quality_score = ${updates.portfolioQualityScore || 50},
          liquidity_score = ${updates.liquidityScore || 50},
          activity_score = ${updates.activityScore || 50},
          defi_engagement_score = ${updates.defiEngagementScore || 50},
          marketing_segment = ${updates.marketingSegment || 'retail'},
          communication_style = ${updates.communicationStyle || 'casual'},
          preferred_token_types = ${JSON.stringify(updates.preferredTokenTypes || [])},
          risk_tolerance = ${updates.riskTolerance || 'moderate'},
          investment_profile = ${updates.investmentProfile || 'balanced'},
          trading_frequency = ${updates.tradingFrequency || 'weekly'},
          portfolio_size = ${updates.portfolioSize || 'small'},
          influence_score = ${Math.round(updates.influenceScore || 0)},
          social_connections = ${Math.round(updates.socialConnections || 0)},
          marketing_insights = ${JSON.stringify(updates.marketingInsights || {})},
          analysis_data = ${JSON.stringify(updates.analysisData || {})},
          last_analyzed = ${new Date()},
          updated_at = ${new Date()}
        WHERE wallet_address = ${walletAddress}
        RETURNING *
      `);
      
      if (result.rows.length > 0) {
        console.log(`✅ Database: Updated wallet intelligence for ${walletAddress}`);
        return result.rows[0];
      }
    } catch (error) {
      console.error('Database update error:', error);
    }
    
    // Fallback to in-memory storage
    const items = Array.from(this.walletIntelligenceData.entries());
    const existingEntry = items.find(([_, item]) => item.walletAddress === walletAddress);
    
    if (!existingEntry) {
      throw new Error("Wallet intelligence record not found");
    }

    const [id, existing] = existingEntry;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
      lastAnalyzed: new Date()
    };

    this.walletIntelligenceData.set(id, updated);
    return updated;
  }

  async deleteWalletIntelligence(walletAddress: string): Promise<boolean> {
    const items = Array.from(this.walletIntelligenceData.entries());
    const existingEntry = items.find(([_, item]) => item.walletAddress === walletAddress);
    
    if (existingEntry) {
      this.walletIntelligenceData.delete(existingEntry[0]);
      return true;
    }
    return false;
  }



  async getWalletIntelligenceStats(): Promise<{
    totalWallets: number;
    avgSocialCreditScore: number;
    riskDistribution: Record<string, number>;
    marketingSegmentDistribution: Record<string, number>;
    portfolioSizeDistribution: Record<string, number>;
    topPerformers: any[];
    highRiskWallets: any[];
  }> {
    const items = Array.from(this.walletIntelligenceData.values());
    
    const stats = {
      totalWallets: items.length,
      avgSocialCreditScore: 0,
      riskDistribution: {} as Record<string, number>,
      marketingSegmentDistribution: {} as Record<string, number>,
      portfolioSizeDistribution: {} as Record<string, number>,
      topPerformers: [] as any[],
      highRiskWallets: [] as any[]
    };

    if (items.length === 0) return stats;

    // Calculate averages and distributions
    let totalScore = 0;
    items.forEach(item => {
      totalScore += item.socialCreditScore;
      
      // Risk distribution
      stats.riskDistribution[item.riskLevel] = (stats.riskDistribution[item.riskLevel] || 0) + 1;
      
      // Marketing segment distribution
      stats.marketingSegmentDistribution[item.marketingSegment] = (stats.marketingSegmentDistribution[item.marketingSegment] || 0) + 1;
      
      // Portfolio size distribution
      stats.portfolioSizeDistribution[item.portfolioSize] = (stats.portfolioSizeDistribution[item.portfolioSize] || 0) + 1;
      
      // High risk wallets
      if (item.riskLevel === 'high' || item.riskLevel === 'critical') {
        stats.highRiskWallets.push(item);
      }
    });

    stats.avgSocialCreditScore = Math.round(totalScore / items.length);
    
    // Top performers (top 10%)
    const sortedByScore = items.sort((a, b) => b.socialCreditScore - a.socialCreditScore);
    const topCount = Math.max(1, Math.floor(items.length * 0.1));
    stats.topPerformers = sortedByScore.slice(0, topCount);

    return stats;
  }

  // FlutterArt NFT Operations Implementation
  async createFlutterArtNFT(nftData: any): Promise<any> {
    const collection = {
      ...nftData,
      id: nftData.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.flutterArtCollections.set(nftData.id, collection);
    return collection;
  }

  async getFlutterArtCollection(collectionId: string): Promise<any> {
    return this.flutterArtCollections.get(collectionId);
  }

  async mintFlutterArtNFT(nftData: any): Promise<any> {
    const nft = {
      ...nftData,
      mintedAt: new Date().toISOString()
    };
    
    this.flutterArtNFTs.set(nftData.id, nft);
    return nft;
  }

  async updateCollectionMintCount(collectionId: string, mintedCount: number): Promise<void> {
    const collection = this.flutterArtCollections.get(collectionId);
    if (collection) {
      collection.mintedCount = mintedCount;
      collection.updatedAt = new Date().toISOString();
      this.flutterArtCollections.set(collectionId, collection);
    }
  }

  async getFlutterArtNFT(nftId: string): Promise<any> {
    return this.flutterArtNFTs.get(nftId);
  }

  async burnFlutterArtNFT(nftId: string, burnerAddress: string): Promise<any> {
    const nft = this.flutterArtNFTs.get(nftId);
    if (nft) {
      nft.status = "burned";
      nft.burnedAt = new Date().toISOString();
      nft.burnedBy = burnerAddress;
      this.flutterArtNFTs.set(nftId, nft);
    }
    return nft;
  }

  async getUserFlutterArtNFTs(walletAddress: string, status?: string): Promise<any[]> {
    const nfts = Array.from(this.flutterArtNFTs.values()).filter(nft => 
      nft.owner === walletAddress && (!status || nft.status === status)
    );
    return nfts;
  }

  async getFlutterArtAnalytics(creatorId: string): Promise<any> {
    const collections = Array.from(this.flutterArtCollections.values()).filter(c => c.creator === creatorId);
    const nfts = Array.from(this.flutterArtNFTs.values()).filter(n => collections.some(c => c.id === n.collectionId));
    
    const totalCollections = collections.length;
    const totalNFTsCreated = collections.reduce((sum, c) => sum + c.mintQuantity, 0);
    const totalNFTsMinted = nfts.length;
    const totalValueAttached = collections.reduce((sum, c) => sum + (c.value * c.mintQuantity), 0);
    const burnedNFTs = nfts.filter(n => n.status === 'burned');
    const totalValueRedeemed = burnedNFTs.reduce((sum, n) => sum + n.value, 0);
    const burnRate = nfts.length > 0 ? (burnedNFTs.length / nfts.length) * 100 : 0;

    return {
      totalCollections,
      totalNFTsCreated,
      totalNFTsMinted,
      totalValueAttached,
      totalValueRedeemed,
      burnRate: Math.round(burnRate * 100) / 100,
      mostPopularCollection: collections.length > 0 ? collections[0] : null,
      creationFees: totalCollections * 0.01, // Mock fee calculation
      royalties: totalValueRedeemed * 0.05, // Mock royalty calculation
      multiMintUsage: collections.filter(c => c.mintQuantity > 1).length,
      burnToRedeemUsage: collections.filter(c => c.burnToRedeem).length,
      qrCodeUsage: collections.filter(c => c.generateQR).length,
      timeLockUsage: collections.filter(c => c.timeLockEnabled).length
    };
  }

  // Escrow Fee Configuration Operations
  async getEscrowFeeConfig(currency: string): Promise<EscrowFeeConfig | undefined> {
    return this.escrowFeeConfigs.get(currency);
  }

  async updateEscrowFeeConfig(currency: string, config: Partial<EscrowFeeConfig>): Promise<EscrowFeeConfig> {
    const existingConfig = this.escrowFeeConfigs.get(currency);
    if (!existingConfig) {
      throw new Error(`Escrow fee config not found for currency: ${currency}`);
    }

    const updatedConfig: EscrowFeeConfig = {
      ...existingConfig,
      ...config,
      updatedAt: new Date(),
    };

    this.escrowFeeConfigs.set(currency, updatedConfig);
    return updatedConfig;
  }

  async getAllEscrowFeeConfigs(): Promise<EscrowFeeConfig[]> {
    return Array.from(this.escrowFeeConfigs.values());
  }

  // Flutterina AI Conversation Operations
  async createFlutterinaConversation(conversation: InsertFlutterinaConversation): Promise<FlutterinaConversation> {
    const id = randomUUID();
    const newConversation: FlutterinaConversation = {
      id,
      sessionId: conversation.sessionId,
      userId: conversation.userId || null,
      walletAddress: conversation.walletAddress || null,
      currentPage: conversation.currentPage,
      pageContext: conversation.pageContext || {},
      userIntent: conversation.userIntent || "help",
      relationshipLevel: "new",
      totalMessages: 0,
      lastInteractionAt: new Date(),
      conversationTags: conversation.conversationTags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.flutterinaConversations.set(id, newConversation);
    return newConversation;
  }

  async getFlutterinaConversation(id: string): Promise<FlutterinaConversation | undefined> {
    return this.flutterinaConversations.get(id);
  }

  async getFlutterinaConversationBySession(sessionId: string): Promise<FlutterinaConversation | undefined> {
    return Array.from(this.flutterinaConversations.values())
      .find(conversation => conversation.sessionId === sessionId);
  }

  async updateFlutterinaConversation(id: string, updates: Partial<FlutterinaConversation>): Promise<FlutterinaConversation> {
    const existing = this.flutterinaConversations.get(id);
    if (!existing) {
      throw new Error(`Conversation not found: ${id}`);
    }

    const updated: FlutterinaConversation = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.flutterinaConversations.set(id, updated);
    return updated;
  }

  // Flutterina AI Message Operations
  async createFlutterinaMessage(message: InsertFlutterinaMessage): Promise<FlutterinaMessage> {
    const id = randomUUID();
    const newMessage: FlutterinaMessage = {
      id,
      conversationId: message.conversationId,
      message: message.message,
      messageType: message.messageType,
      pageContext: message.pageContext,
      actionContext: message.actionContext || {},
      containsRecommendations: message.containsRecommendations || false,
      recommendationData: message.recommendationData,
      tokenUsage: message.tokenUsage,
      responseTime: message.responseTime,
      sentiment: message.sentiment || null,
      intent: message.intent || null,
      createdAt: new Date()
    };

    this.flutterinaMessages.set(id, newMessage);
    return newMessage;
  }

  async getFlutterinaMessage(id: string): Promise<FlutterinaMessage | undefined> {
    return this.flutterinaMessages.get(id);
  }

  async getFlutterinaMessages(conversationId: string, limit?: number): Promise<FlutterinaMessage[]> {
    const messages = Array.from(this.flutterinaMessages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (limit) {
      return messages.slice(-limit);
    }
    return messages;
  }

  // Flutterina Analytics
  async getFlutterinaAnalytics(): Promise<{
    totalConversations: number;
    totalMessages: number;
    activeConversations: number;
    avgMessagesPerConversation: number;
  }> {
    const totalConversations = this.flutterinaConversations.size;
    const totalMessages = this.flutterinaMessages.size;
    
    // Active conversations: have messages in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeConversations = Array.from(this.flutterinaConversations.values())
      .filter(conv => conv.lastInteractionAt > oneDayAgo).length;

    const avgMessagesPerConversation = totalConversations > 0 
      ? Math.round((totalMessages / totalConversations) * 100) / 100 
      : 0;

    return {
      totalConversations,
      totalMessages,
      activeConversations,
      avgMessagesPerConversation
    };
  }
}

// Export storage instance
export const storage = new MemStorage();

// Debug: Log initialization (remove in production)
storage.getAllRedemptionCodes().then(codes => 
  console.log('Storage initialized with redemption codes:', codes.map(c => `${c.code} (${c.type})`))
);