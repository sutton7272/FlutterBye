import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { 
  createMint, 
  getMint, 
  createAccount, 
  mintTo, 
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

export interface FLBYTokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  description: string;
  website: string;
  image: string;
}

export interface FLBYUtilityConfig {
  feeDiscounts: {
    tier1: { threshold: number; discount: number };
    tier2: { threshold: number; discount: number };
    tier3: { threshold: number; discount: number };
    tier4: { threshold: number; discount: number };
  };
  governance: {
    votingPowerThreshold: number;
    proposalThreshold: number;
  };
  staking: {
    enabled: boolean;
    rewardRate: number;
    lockupPeriods: number[];
  };
  exclusiveAccess: {
    premiumFeatures: string[];
    earlyAccess: boolean;
  };
}

export interface TokenDistribution {
  platform: number;    // 40%
  team: number;        // 25%
  community: number;   // 20%
  reserves: number;    // 15%
}

export interface UserTier {
  name: string;
  threshold: number;
  benefits: string[];
  feeDiscount: number;
}

export class FLBYTokenDeploymentService {
  private connection: Connection;
  
  // FLBY Token Configuration
  public readonly FLBY_TOKEN_CONFIG: FLBYTokenConfig = {
    name: 'Flutterbye',
    symbol: 'FLBY',
    decimals: 9,
    totalSupply: 1_000_000_000, // 1 billion tokens
    description: 'Native utility token for the Flutterbye blockchain communication platform',
    website: 'https://flutterbye.com',
    image: 'https://flutterbye.com/images/flby-token.png'
  };

  // FLBY Utility Configuration
  public readonly FLBY_UTILITY_CONFIG: FLBYUtilityConfig = {
    feeDiscounts: {
      tier1: { threshold: 1000, discount: 0.10 },      // 10% discount for 1K+ FLBY
      tier2: { threshold: 10000, discount: 0.25 },     // 25% discount for 10K+ FLBY
      tier3: { threshold: 100000, discount: 0.40 },    // 40% discount for 100K+ FLBY
      tier4: { threshold: 1000000, discount: 0.50 }    // 50% discount for 1M+ FLBY
    },
    governance: {
      votingPowerThreshold: 1000,   // Minimum FLBY to vote
      proposalThreshold: 100000     // Minimum FLBY to create proposals
    },
    staking: {
      enabled: true,
      rewardRate: 0.08,            // 8% annual reward rate
      lockupPeriods: [30, 90, 180, 365] // Days
    },
    exclusiveAccess: {
      premiumFeatures: [
        'Advanced Analytics',
        'Priority Support', 
        'Beta Features',
        'Enhanced API Limits'
      ],
      earlyAccess: true
    }
  };

  // Token Distribution Plan
  public readonly TOKEN_DISTRIBUTION: TokenDistribution = {
    platform: 0.40,    // 40% - 400M tokens
    team: 0.25,        // 25% - 250M tokens  
    community: 0.20,   // 20% - 200M tokens
    reserves: 0.15     // 15% - 150M tokens
  };

  constructor() {
    this.connection = new Connection(
      process.env.MAINNET_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );
  }

  // Calculate fee discount based on FLBY balance
  calculateFeeDiscount(flbyBalance: number): number {
    const { feeDiscounts } = this.FLBY_UTILITY_CONFIG;
    
    if (flbyBalance >= feeDiscounts.tier4.threshold) {
      return feeDiscounts.tier4.discount;
    } else if (flbyBalance >= feeDiscounts.tier3.threshold) {
      return feeDiscounts.tier3.discount;
    } else if (flbyBalance >= feeDiscounts.tier2.threshold) {
      return feeDiscounts.tier2.discount;
    } else if (flbyBalance >= feeDiscounts.tier1.threshold) {
      return feeDiscounts.tier1.discount;
    }
    
    return 0; // No discount
  }

  // Get user tier based on FLBY balance
  getUserTier(flbyBalance: number): UserTier {
    const { feeDiscounts } = this.FLBY_UTILITY_CONFIG;
    
    if (flbyBalance >= feeDiscounts.tier4.threshold) {
      return {
        name: 'Diamond',
        threshold: feeDiscounts.tier4.threshold,
        benefits: [
          '50% fee discount on all transactions',
          'Priority customer support',
          'Exclusive beta features access',
          'Governance proposal creation rights',
          'Maximum staking rewards'
        ],
        feeDiscount: feeDiscounts.tier4.discount
      };
    } else if (flbyBalance >= feeDiscounts.tier3.threshold) {
      return {
        name: 'Platinum',
        threshold: feeDiscounts.tier3.threshold,
        benefits: [
          '40% fee discount on all transactions',
          'Enhanced API rate limits',
          'Early access to new features',
          'Voting rights in governance',
          'Premium staking tiers'
        ],
        feeDiscount: feeDiscounts.tier3.discount
      };
    } else if (flbyBalance >= feeDiscounts.tier2.threshold) {
      return {
        name: 'Gold',
        threshold: feeDiscounts.tier2.threshold,
        benefits: [
          '25% fee discount on all transactions',
          'Advanced analytics dashboard',
          'Community governance voting',
          'Standard staking rewards'
        ],
        feeDiscount: feeDiscounts.tier2.discount
      };
    } else if (flbyBalance >= feeDiscounts.tier1.threshold) {
      return {
        name: 'Silver',
        threshold: feeDiscounts.tier1.threshold,
        benefits: [
          '10% fee discount on all transactions',
          'Basic analytics access',
          'Community voting rights'
        ],
        feeDiscount: feeDiscounts.tier1.discount
      };
    }
    
    return {
      name: 'Bronze',
      threshold: 0,
      benefits: [
        'Full platform access',
        'Standard transaction fees'
      ],
      feeDiscount: 0
    };
  }

  // Check if FLBY token is deployed
  async isTokenDeployed(): Promise<boolean> {
    const mintAddress = process.env.FLBY_TOKEN_MINT;
    if (!mintAddress) return false;

    try {
      const mint = new PublicKey(mintAddress);
      const mintInfo = await getMint(this.connection, mint);
      return !!mintInfo;
    } catch {
      return false;
    }
  }

  // Get FLBY token information
  async getTokenInfo(): Promise<any> {
    const mintAddress = process.env.FLBY_TOKEN_MINT;
    if (!mintAddress) {
      throw new Error('FLBY_TOKEN_MINT not set');
    }

    try {
      const mint = new PublicKey(mintAddress);
      const mintInfo = await getMint(this.connection, mint);
      
      return {
        ...this.FLBY_TOKEN_CONFIG,
        mintAddress,
        supply: Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals),
        isInitialized: mintInfo.isInitialized,
        freezeAuthority: mintInfo.freezeAuthority?.toString(),
        mintAuthority: mintInfo.mintAuthority?.toString()
      };
    } catch (error) {
      throw new Error(`Failed to get token info: ${error.message}`);
    }
  }

  // Deploy FLBY token to MainNet (requires proper authority)
  async deployToken(authority: Keypair): Promise<string> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Token deployment should only be done through secure deployment scripts');
    }

    try {
      // Create the mint
      const mint = await createMint(
        this.connection,
        authority, // Payer
        authority.publicKey, // Mint authority
        authority.publicKey, // Freeze authority  
        this.FLBY_TOKEN_CONFIG.decimals,
        undefined, // Keypair for mint account
        undefined, // Confirmation options
        TOKEN_PROGRAM_ID
      );

      console.log(`FLBY Token mint created: ${mint.toString()}`);
      
      // Create distribution accounts and mint initial supply
      await this.mintInitialSupply(mint, authority);

      return mint.toString();
    } catch (error) {
      throw new Error(`Failed to deploy FLBY token: ${error.message}`);
    }
  }

  // Mint initial token supply to distribution wallets
  private async mintInitialSupply(mint: PublicKey, authority: Keypair): Promise<void> {
    const totalSupply = this.FLBY_TOKEN_CONFIG.totalSupply * Math.pow(10, this.FLBY_TOKEN_CONFIG.decimals);
    
    // Calculate distribution amounts
    const distributions = {
      platform: Math.floor(totalSupply * this.TOKEN_DISTRIBUTION.platform),
      team: Math.floor(totalSupply * this.TOKEN_DISTRIBUTION.team),
      community: Math.floor(totalSupply * this.TOKEN_DISTRIBUTION.community),
      reserves: Math.floor(totalSupply * this.TOKEN_DISTRIBUTION.reserves)
    };

    // Create distribution accounts
    const distributionAccounts = {
      platform: await this.createDistributionAccount(mint, authority, 'platform'),
      team: await this.createDistributionAccount(mint, authority, 'team'),
      community: await this.createDistributionAccount(mint, authority, 'community'),
      reserves: await this.createDistributionAccount(mint, authority, 'reserves')
    };

    // Mint tokens to distribution accounts
    await mintTo(
      this.connection,
      authority,
      mint,
      distributionAccounts.platform,
      authority,
      distributions.platform
    );

    await mintTo(
      this.connection,
      authority,
      mint,
      distributionAccounts.team,
      authority,
      distributions.team
    );

    await mintTo(
      this.connection,
      authority,
      mint,
      distributionAccounts.community,
      authority,
      distributions.community
    );

    await mintTo(
      this.connection,
      authority,
      mint,
      distributionAccounts.reserves,
      authority,
      distributions.reserves
    );

    console.log('Initial FLBY token supply distributed');
    console.log(`Platform: ${distributions.platform / Math.pow(10, this.FLBY_TOKEN_CONFIG.decimals)} FLBY`);
    console.log(`Team: ${distributions.team / Math.pow(10, this.FLBY_TOKEN_CONFIG.decimals)} FLBY`);
    console.log(`Community: ${distributions.community / Math.pow(10, this.FLBY_TOKEN_CONFIG.decimals)} FLBY`);
    console.log(`Reserves: ${distributions.reserves / Math.pow(10, this.FLBY_TOKEN_CONFIG.decimals)} FLBY`);
  }

  // Create distribution account for specific category
  private async createDistributionAccount(
    mint: PublicKey, 
    authority: Keypair, 
    category: string
  ): Promise<PublicKey> {
    // In production, these should be proper distribution wallets
    // For now, create temporary accounts
    const account = await createAccount(
      this.connection,
      authority, // Payer
      mint,
      authority.publicKey // Owner
    );

    console.log(`Created ${category} distribution account: ${account.toString()}`);
    return account;
  }

  // Calculate transaction fee with FLBY discount
  calculateDiscountedFee(baseFee: number, flbyBalance: number): number {
    const discount = this.calculateFeeDiscount(flbyBalance);
    return baseFee * (1 - discount);
  }

  // Check if user has governance voting rights
  hasVotingRights(flbyBalance: number): boolean {
    return flbyBalance >= this.FLBY_UTILITY_CONFIG.governance.votingPowerThreshold;
  }

  // Check if user can create governance proposals
  canCreateProposal(flbyBalance: number): boolean {
    return flbyBalance >= this.FLBY_UTILITY_CONFIG.governance.proposalThreshold;
  }

  // Get staking reward for given amount and period
  calculateStakingReward(amount: number, days: number): number {
    const annualRate = this.FLBY_UTILITY_CONFIG.staking.rewardRate;
    const dailyRate = annualRate / 365;
    return amount * dailyRate * days;
  }

  // Generate deployment report
  generateDeploymentReport(): string {
    const isDeployed = !!process.env.FLBY_TOKEN_MINT;
    
    return `# FLBY Token Deployment Report
Generated: ${new Date().toISOString()}

## Token Configuration
- **Name**: ${this.FLBY_TOKEN_CONFIG.name}
- **Symbol**: ${this.FLBY_TOKEN_CONFIG.symbol}
- **Total Supply**: ${this.FLBY_TOKEN_CONFIG.totalSupply.toLocaleString()} FLBY
- **Decimals**: ${this.FLBY_TOKEN_CONFIG.decimals}

## Deployment Status
- **MainNet Deployed**: ${isDeployed ? '✅ Yes' : '❌ No'}
- **Mint Address**: ${process.env.FLBY_TOKEN_MINT || 'Not deployed'}

## Token Distribution
- **Platform (40%)**: ${(this.FLBY_TOKEN_CONFIG.totalSupply * this.TOKEN_DISTRIBUTION.platform).toLocaleString()} FLBY
- **Team (25%)**: ${(this.FLBY_TOKEN_CONFIG.totalSupply * this.TOKEN_DISTRIBUTION.team).toLocaleString()} FLBY
- **Community (20%)**: ${(this.FLBY_TOKEN_CONFIG.totalSupply * this.TOKEN_DISTRIBUTION.community).toLocaleString()} FLBY
- **Reserves (15%)**: ${(this.FLBY_TOKEN_CONFIG.totalSupply * this.TOKEN_DISTRIBUTION.reserves).toLocaleString()} FLBY

## Utility Features
### Fee Discounts
- **Silver (1K+ FLBY)**: 10% discount
- **Gold (10K+ FLBY)**: 25% discount  
- **Platinum (100K+ FLBY)**: 40% discount
- **Diamond (1M+ FLBY)**: 50% discount

### Governance
- **Voting Threshold**: ${this.FLBY_UTILITY_CONFIG.governance.votingPowerThreshold.toLocaleString()} FLBY
- **Proposal Threshold**: ${this.FLBY_UTILITY_CONFIG.governance.proposalThreshold.toLocaleString()} FLBY

### Staking
- **Annual Rate**: ${(this.FLBY_UTILITY_CONFIG.staking.rewardRate * 100)}%
- **Lockup Periods**: ${this.FLBY_UTILITY_CONFIG.staking.lockupPeriods.join(', ')} days

## Next Steps
${isDeployed ? '- ✅ Token deployed to MainNet' : '- ❌ Deploy token to MainNet'}
${isDeployed ? '- ✅ Configure distribution wallets' : '- ❌ Set up distribution mechanism'}
${isDeployed ? '- ✅ Enable utility features' : '- ❌ Implement fee discount system'}
`;
  }
}

export const flbyTokenDeployment = new FLBYTokenDeploymentService();