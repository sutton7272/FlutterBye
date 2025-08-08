/**
 * FLBY Token MainNet Deployment Service
 * Handles production deployment of native FLBY token with enterprise features
 */

import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createSetAuthorityInstruction,
  AuthorityType
} from '@solana/spl-token';
import { mainNetService } from './mainnet-config';
import bs58 from 'bs58';

export interface FLBYTokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  mintAuthority: PublicKey[];
  freezeAuthority: PublicKey[];
  distribution: {
    public: number;    // 40% - 400M tokens
    team: number;      // 20% - 200M tokens
    ecosystem: number; // 25% - 250M tokens
    treasury: number;  // 15% - 150M tokens
  };
}

export interface TokenDeploymentResult {
  success: boolean;
  mintAddress?: string;
  transactionSignature?: string;
  totalSupply?: number;
  authorities?: {
    mint: string[];
    freeze: string[];
  };
  distribution?: {
    wallets: string[];
    amounts: number[];
  };
  error?: string;
}

export interface FeeDiscountTier {
  minimumFLBY: number;
  discountPercentage: number;
  description: string;
}

/**
 * Production FLBY Token Configuration
 */
export const FLBY_PRODUCTION_CONFIG: FLBYTokenConfig = {
  name: "Flutterbye",
  symbol: "FLBY",
  decimals: 9,
  totalSupply: 1_000_000_000, // 1 billion tokens
  mintAuthority: [], // Will be set during deployment
  freezeAuthority: [], // Will be set during deployment
  distribution: {
    public: 40,    // 400M tokens for public distribution
    team: 20,      // 200M tokens for team
    ecosystem: 25, // 250M tokens for ecosystem growth
    treasury: 15   // 150M tokens for treasury
  }
};

/**
 * Fee Discount Tiers for FLBY holders
 */
export const FLBY_FEE_DISCOUNT_TIERS: FeeDiscountTier[] = [
  { minimumFLBY: 1000, discountPercentage: 10, description: "Bronze Tier - 10% discount" },
  { minimumFLBY: 10000, discountPercentage: 25, description: "Silver Tier - 25% discount" },
  { minimumFLBY: 50000, discountPercentage: 40, description: "Gold Tier - 40% discount" },
  { minimumFLBY: 100000, discountPercentage: 50, description: "Platinum Tier - 50% discount" },
];

/**
 * FLBY Token MainNet Deployment Service
 */
export class FLBYTokenMainNetService {
  private connection: Connection;
  private config: FLBYTokenConfig;

  constructor() {
    this.connection = mainNetService.getConnection();
    this.config = FLBY_PRODUCTION_CONFIG;
    
    console.log('🪙 FLBY Token MainNet Service initialized');
    console.log('📊 Total Supply:', this.config.totalSupply.toLocaleString());
    console.log('🎯 Distribution:', this.config.distribution);
  }

  /**
   * Deploy FLBY token to MainNet with multi-signature authorities
   */
  async deployFLBYTokenToMainNet(params: {
    authorityWallets: string[]; // Multi-sig authority wallets
    distributionWallets: {
      public: string[];
      team: string[];
      ecosystem: string[];
      treasury: string[];
    };
  }): Promise<TokenDeploymentResult> {
    try {
      console.log('🚀 Starting FLBY token deployment to MainNet...');

      // Validate MainNet connection
      const connectionTest = await mainNetService.validateMainNetConnection();
      if (!connectionTest.success) {
        throw new Error(`MainNet connection failed: ${connectionTest.error}`);
      }

      // Get production authority wallet
      const authorityWallet = mainNetService.getProductionWallet();
      if (!authorityWallet) {
        throw new Error('Production authority wallet not configured');
      }

      // Generate new mint keypair for FLBY token
      const mintKeypair = Keypair.generate();
      const mintAddress = mintKeypair.publicKey.toBase58();

      console.log('🪙 FLBY Token Mint Address:', mintAddress);

      // Calculate distribution amounts
      const distributionAmounts = {
        public: (this.config.totalSupply * this.config.distribution.public) / 100,
        team: (this.config.totalSupply * this.config.distribution.team) / 100,
        ecosystem: (this.config.totalSupply * this.config.distribution.ecosystem) / 100,
        treasury: (this.config.totalSupply * this.config.distribution.treasury) / 100
      };

      // Create mint account with rent exemption
      const lamports = await getMinimumBalanceForRentExemptMint(this.connection);
      const transaction = new Transaction();

      // Add create mint account instruction
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: authorityWallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );

      // Add initialize mint instruction
      transaction.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          this.config.decimals,
          authorityWallet.publicKey, // Initial mint authority
          authorityWallet.publicKey  // Initial freeze authority
        )
      );

      // Send transaction to create mint
      console.log('📝 Creating FLBY token mint...');
      const signature = await this.connection.sendTransaction(
        transaction,
        [authorityWallet, mintKeypair],
        { commitment: 'confirmed' }
      );

      await this.connection.confirmTransaction(signature, 'confirmed');
      console.log('✅ FLBY token mint created:', signature);

      // Mint tokens to distribution wallets
      const distributionResults = await this.mintDistributionTokens(
        mintKeypair.publicKey,
        authorityWallet,
        distributionAmounts,
        params.distributionWallets
      );

      // Set up multi-signature authorities
      await this.setupMultiSignatureAuthorities(
        mintKeypair.publicKey,
        authorityWallet,
        params.authorityWallets
      );

      return {
        success: true,
        mintAddress,
        transactionSignature: signature,
        totalSupply: this.config.totalSupply,
        authorities: {
          mint: params.authorityWallets,
          freeze: params.authorityWallets
        },
        distribution: distributionResults
      };

    } catch (error) {
      console.error('❌ FLBY token deployment failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown deployment error'
      };
    }
  }

  /**
   * Mint tokens to distribution wallets
   */
  private async mintDistributionTokens(
    mintAddress: PublicKey,
    authorityWallet: Keypair,
    amounts: Record<string, number>,
    wallets: {
      public: string[];
      team: string[];
      ecosystem: string[];
      treasury: string[];
    }
  ): Promise<{ wallets: string[]; amounts: number[] }> {
    const allWallets: string[] = [];
    const allAmounts: number[] = [];

    // Distribute to each category
    for (const [category, categoryWallets] of Object.entries(wallets)) {
      const categoryAmount = amounts[category];
      const amountPerWallet = categoryAmount / categoryWallets.length;

      for (const walletAddress of categoryWallets) {
        const destinationPublicKey = new PublicKey(walletAddress);

        // Get or create associated token account
        const associatedTokenAddress = await getAssociatedTokenAddress(
          mintAddress,
          destinationPublicKey
        );

        // Create associated token account transaction
        const createATATransaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            authorityWallet.publicKey,
            associatedTokenAddress,
            destinationPublicKey,
            mintAddress
          )
        );

        // Mint tokens to the account
        const mintTransaction = new Transaction().add(
          createMintToInstruction(
            mintAddress,
            associatedTokenAddress,
            authorityWallet.publicKey,
            amountPerWallet * Math.pow(10, this.config.decimals)
          )
        );

        // Send transactions
        await this.connection.sendTransaction(createATATransaction, [authorityWallet]);
        await this.connection.sendTransaction(mintTransaction, [authorityWallet]);

        allWallets.push(walletAddress);
        allAmounts.push(amountPerWallet);
      }
    }

    return { wallets: allWallets, amounts: allAmounts };
  }

  /**
   * Set up multi-signature authorities for production security
   */
  private async setupMultiSignatureAuthorities(
    mintAddress: PublicKey,
    currentAuthority: Keypair,
    newAuthorities: string[]
  ): Promise<void> {
    // Note: This is a simplified version. In production, you would use
    // a proper multi-signature program like Squads or create a custom one
    
    console.log('🔐 Setting up multi-signature authorities...');
    
    // For now, we'll set a single new authority
    // In production, implement proper multi-sig
    if (newAuthorities.length > 0) {
      const newAuthority = new PublicKey(newAuthorities[0]);
      
      const setAuthorityTransaction = new Transaction().add(
        createSetAuthorityInstruction(
          mintAddress,
          currentAuthority.publicKey,
          AuthorityType.MintTokens,
          newAuthority
        )
      );

      await this.connection.sendTransaction(setAuthorityTransaction, [currentAuthority]);
      console.log('✅ Mint authority transferred to:', newAuthority.toBase58());
    }
  }

  /**
   * Calculate fee discount based on FLBY holdings
   */
  calculateFeeDiscount(flbyBalance: number): {
    tier: FeeDiscountTier | null;
    discountPercentage: number;
    discountedFee: number;
    originalFee: number;
  } {
    // Find the highest tier the user qualifies for
    let applicableTier: FeeDiscountTier | null = null;
    
    for (const tier of FLBY_FEE_DISCOUNT_TIERS) {
      if (flbyBalance >= tier.minimumFLBY) {
        applicableTier = tier;
      }
    }

    const discountPercentage = applicableTier?.discountPercentage || 0;
    
    return {
      tier: applicableTier,
      discountPercentage,
      discountedFee: 0, // Will be calculated with actual fee
      originalFee: 0    // Will be calculated with actual fee
    };
  }

  /**
   * Apply FLBY fee discount to a transaction
   */
  applyFLBYDiscount(originalFee: number, flbyBalance: number): {
    originalFee: number;
    discountPercentage: number;
    discountAmount: number;
    finalFee: number;
    tier: string | null;
  } {
    const discount = this.calculateFeeDiscount(flbyBalance);
    const discountAmount = (originalFee * discount.discountPercentage) / 100;
    const finalFee = originalFee - discountAmount;

    return {
      originalFee,
      discountPercentage: discount.discountPercentage,
      discountAmount,
      finalFee,
      tier: discount.tier?.description || null
    };
  }

  /**
   * Get FLBY token information
   */
  async getFLBYTokenInfo(mintAddress: string): Promise<{
    exists: boolean;
    supply?: number;
    decimals?: number;
    authorities?: {
      mint: string | null;
      freeze: string | null;
    };
    error?: string;
  }> {
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const mintInfo = await this.connection.getParsedAccountInfo(mintPublicKey);

      if (!mintInfo.value) {
        return { exists: false };
      }

      const data = mintInfo.value.data;
      if ('parsed' in data && data.parsed.type === 'mint') {
        const mintData = data.parsed.info;
        
        return {
          exists: true,
          supply: parseInt(mintData.supply),
          decimals: mintData.decimals,
          authorities: {
            mint: mintData.mintAuthority,
            freeze: mintData.freezeAuthority
          }
        };
      }

      return { exists: false };
    } catch (error) {
      return {
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validate FLBY token deployment readiness
   */
  async validateDeploymentReadiness(): Promise<{
    ready: boolean;
    checks: Record<string, boolean>;
    errors: string[];
  }> {
    const checks: Record<string, boolean> = {};
    const errors: string[] = [];

    // Check MainNet connection
    const connectionTest = await mainNetService.validateMainNetConnection();
    checks.mainnetConnection = connectionTest.success;
    if (!connectionTest.success) {
      errors.push(`MainNet connection failed: ${connectionTest.error}`);
    }

    // Check production wallets
    const walletValidation = await mainNetService.validateProductionWallets();
    checks.authorityWallet = walletValidation.authority.valid;
    checks.escrowWallet = walletValidation.escrow.valid;

    if (!walletValidation.authority.valid) {
      errors.push('Authority wallet not configured or insufficient balance');
    }
    if (!walletValidation.escrow.valid) {
      errors.push('Escrow wallet not configured or insufficient balance');
    }

    // Check SOL balance for transaction fees
    if (walletValidation.authority.balance !== undefined) {
      checks.sufficientSOL = walletValidation.authority.balance > 0.1; // Need at least 0.1 SOL
      if (!checks.sufficientSOL) {
        errors.push('Insufficient SOL balance for deployment transactions');
      }
    }

    const ready = Object.values(checks).every(Boolean);

    return { ready, checks, errors };
  }
}

// Export singleton instance
export const flbyTokenMainNetService = new FLBYTokenMainNetService();