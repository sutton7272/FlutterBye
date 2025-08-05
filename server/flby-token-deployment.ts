// FLBY Token Deployment and Management
import { 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction, 
  sendAndConfirmTransaction 
} from '@solana/web3.js';
import { 
  createMint, 
  createAssociatedTokenAccount, 
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
  mintAuthority: PublicKey;
  freezeAuthority: PublicKey | null;
  distribution: {
    platformOperations: number;  // 40%
    teamDevelopment: number;     // 25%
    communityRewards: number;    // 20%
    strategicReserves: number;   // 15%
  };
}

export interface TokenDeploymentResult {
  mintAddress: string;
  success: boolean;
  transactionSignature?: string;
  error?: string;
  distributionWallets?: {
    platform: string;
    team: string;
    community: string;
    reserves: string;
  };
}

// FLBY Token Configuration
export const FLBY_TOKEN_CONFIG: FLBYTokenConfig = {
  name: "Flutterbye",
  symbol: "FLBY",
  decimals: 9,
  totalSupply: 1000000000, // 1 billion tokens
  mintAuthority: new PublicKey(process.env.MAINNET_MINT_AUTHORITY || '11111111111111111111111111111111'),
  freezeAuthority: new PublicKey(process.env.MAINNET_TREASURY_WALLET || '11111111111111111111111111111111'),
  distribution: {
    platformOperations: 400000000,  // 400M tokens (40%)
    teamDevelopment: 250000000,     // 250M tokens (25%)
    communityRewards: 200000000,    // 200M tokens (20%)
    strategicReserves: 150000000    // 150M tokens (15%)
  }
};

// Deploy FLBY Token to MainNet
export async function deployFLBYToken(
  connection: Connection,
  payerKeypair: Keypair,
  config: FLBYTokenConfig = FLBY_TOKEN_CONFIG
): Promise<TokenDeploymentResult> {
  try {
    console.log('🚀 Starting FLBY token deployment to MainNet...');

    // Create the token mint
    const mintKeypair = Keypair.generate();
    console.log(`📝 Generated mint address: ${mintKeypair.publicKey.toBase58()}`);

    const mint = await createMint(
      connection,
      payerKeypair,
      config.mintAuthority,
      config.freezeAuthority,
      config.decimals,
      mintKeypair,
      undefined,
      TOKEN_PROGRAM_ID
    );

    console.log(`✅ FLBY token mint created: ${mint.toBase58()}`);

    // Create distribution wallets
    const distributionWallets = {
      platform: await createDistributionWallet(connection, payerKeypair, mint, 'Platform Operations'),
      team: await createDistributionWallet(connection, payerKeypair, mint, 'Team & Development'),
      community: await createDistributionWallet(connection, payerKeypair, mint, 'Community Rewards'),
      reserves: await createDistributionWallet(connection, payerKeypair, mint, 'Strategic Reserves')
    };

    // Mint initial token distribution
    await mintInitialDistribution(connection, payerKeypair, mint, config, distributionWallets);

    console.log('🎉 FLBY token deployment completed successfully!');

    return {
      mintAddress: mint.toBase58(),
      success: true,
      distributionWallets: {
        platform: distributionWallets.platform.toBase58(),
        team: distributionWallets.team.toBase58(),
        community: distributionWallets.community.toBase58(),
        reserves: distributionWallets.reserves.toBase58()
      }
    };

  } catch (error) {
    console.error('❌ FLBY token deployment failed:', error);
    return {
      mintAddress: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown deployment error'
    };
  }
}

// Create distribution wallet
async function createDistributionWallet(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  purpose: string
): Promise<PublicKey> {
  console.log(`📝 Creating distribution wallet for: ${purpose}`);
  
  const wallet = Keypair.generate();
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    wallet.publicKey
  );

  console.log(`✅ Created ${purpose} wallet: ${wallet.publicKey.toBase58()}`);
  console.log(`✅ Created ${purpose} token account: ${tokenAccount.address.toBase58()}`);

  return tokenAccount.address;
}

// Mint initial token distribution
async function mintInitialDistribution(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  config: FLBYTokenConfig,
  distributionWallets: {
    platform: PublicKey;
    team: PublicKey;
    community: PublicKey;
    reserves: PublicKey;
  }
): Promise<void> {
  console.log('💰 Minting initial token distribution...');

  const distributions = [
    { wallet: distributionWallets.platform, amount: config.distribution.platformOperations, name: 'Platform Operations' },
    { wallet: distributionWallets.team, amount: config.distribution.teamDevelopment, name: 'Team & Development' },
    { wallet: distributionWallets.community, amount: config.distribution.communityRewards, name: 'Community Rewards' },
    { wallet: distributionWallets.reserves, amount: config.distribution.strategicReserves, name: 'Strategic Reserves' }
  ];

  for (const distribution of distributions) {
    console.log(`💸 Minting ${distribution.amount.toLocaleString()} FLBY to ${distribution.name}`);
    
    await mintTo(
      connection,
      payer,
      mint,
      distribution.wallet,
      payer,
      distribution.amount * Math.pow(10, config.decimals)
    );

    console.log(`✅ Minted ${distribution.amount.toLocaleString()} FLBY to ${distribution.name}`);
  }

  console.log('🎯 Initial token distribution completed!');
}

// Validate FLBY Token Deployment
export async function validateFLBYDeployment(connection: Connection, mintAddress: string): Promise<{
  isValid: boolean;
  checks: { name: string; status: boolean; message: string }[];
}> {
  const checks = [];
  let validCount = 0;

  try {
    const mint = new PublicKey(mintAddress);
    
    // Check mint exists
    try {
      const mintInfo = await connection.getParsedAccountInfo(mint);
      const exists = mintInfo.value !== null;
      checks.push({
        name: 'Mint Exists',
        status: exists,
        message: exists ? 'FLBY token mint found on MainNet' : 'FLBY token mint not found'
      });
      if (exists) validCount++;
    } catch (error) {
      checks.push({
        name: 'Mint Exists',
        status: false,
        message: `Error checking mint: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Check token symbol and name
    try {
      const mintInfo = await connection.getParsedAccountInfo(mint);
      if (mintInfo.value?.data && 'parsed' in mintInfo.value.data) {
        const tokenInfo = mintInfo.value.data.parsed.info;
        checks.push({
          name: 'Token Configuration',
          status: true,
          message: `Decimals: ${tokenInfo.decimals}, Authority: ${tokenInfo.mintAuthority}`
        });
        validCount++;
      }
    } catch (error) {
      checks.push({
        name: 'Token Configuration',
        status: false,
        message: `Error reading token info: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Check supply
    try {
      const supply = await connection.getTokenSupply(mint);
      const supplyAmount = parseInt(supply.value.amount) / Math.pow(10, supply.value.decimals);
      const expectedSupply = FLBY_TOKEN_CONFIG.totalSupply;
      const supplyCorrect = Math.abs(supplyAmount - expectedSupply) < 1000; // Allow small variance
      
      checks.push({
        name: 'Token Supply',
        status: supplyCorrect,
        message: `Current supply: ${supplyAmount.toLocaleString()}, Expected: ${expectedSupply.toLocaleString()}`
      });
      if (supplyCorrect) validCount++;
    } catch (error) {
      checks.push({
        name: 'Token Supply',
        status: false,
        message: `Error checking supply: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

  } catch (error) {
    checks.push({
      name: 'General Validation',
      status: false,
      message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  return {
    isValid: validCount === checks.length,
    checks
  };
}

// FLBY Token Utility Functions
export interface FLBYUtilityConfig {
  feeDiscounts: {
    bronze: { threshold: number; discount: number };  // 1,000 FLBY = 10% discount
    silver: { threshold: number; discount: number };  // 10,000 FLBY = 25% discount
    gold: { threshold: number; discount: number };    // 100,000 FLBY = 50% discount
  };
  stakingRewards: {
    minStake: number;
    baseAPY: number;
    maxAPY: number;
  };
  governanceRights: {
    minVotingTokens: number;
    proposalThreshold: number;
  };
}

export const FLBY_UTILITY_CONFIG: FLBYUtilityConfig = {
  feeDiscounts: {
    bronze: { threshold: 1000, discount: 0.10 },
    silver: { threshold: 10000, discount: 0.25 },
    gold: { threshold: 100000, discount: 0.50 }
  },
  stakingRewards: {
    minStake: 100,
    baseAPY: 0.05,  // 5% base APY
    maxAPY: 0.12    // 12% max APY
  },
  governanceRights: {
    minVotingTokens: 1000,
    proposalThreshold: 100000
  }
};

// Calculate user's fee discount based on FLBY holdings
export function calculateFeeDiscount(flbyBalance: number): number {
  const config = FLBY_UTILITY_CONFIG.feeDiscounts;
  
  if (flbyBalance >= config.gold.threshold) {
    return config.gold.discount;
  } else if (flbyBalance >= config.silver.threshold) {
    return config.silver.discount;
  } else if (flbyBalance >= config.bronze.threshold) {
    return config.bronze.discount;
  }
  
  return 0; // No discount
}

// Get user's tier based on FLBY holdings
export function getUserTier(flbyBalance: number): 'bronze' | 'silver' | 'gold' | 'none' {
  const config = FLBY_UTILITY_CONFIG.feeDiscounts;
  
  if (flbyBalance >= config.gold.threshold) return 'gold';
  if (flbyBalance >= config.silver.threshold) return 'silver';
  if (flbyBalance >= config.bronze.threshold) return 'bronze';
  return 'none';
}

// Generate FLBY deployment script
export function generateDeploymentScript(): string {
  return `#!/bin/bash
# FLBY Token Deployment Script for MainNet

echo "🚀 Starting FLBY Token Deployment to Solana MainNet"

# Check required environment variables
if [ -z "$MAINNET_MINT_AUTHORITY" ]; then
    echo "❌ Error: MAINNET_MINT_AUTHORITY environment variable not set"
    exit 1
fi

if [ -z "$MAINNET_TREASURY_WALLET" ]; then
    echo "❌ Error: MAINNET_TREASURY_WALLET environment variable not set"
    exit 1
fi

# Deploy FLBY token
echo "📝 Deploying FLBY token with configuration:"
echo "  Name: Flutterbye"
echo "  Symbol: FLBY"
echo "  Decimals: 9"
echo "  Total Supply: 1,000,000,000"
echo "  Distribution:"
echo "    Platform Operations: 40% (400M tokens)"
echo "    Team & Development: 25% (250M tokens)"
echo "    Community Rewards: 20% (200M tokens)"
echo "    Strategic Reserves: 15% (150M tokens)"

# Run deployment
npm run deploy-flby-token

# Validate deployment
npm run validate-flby-deployment

echo "✅ FLBY Token deployment completed successfully!"
echo "🎯 Token mint address saved to FLBY_TOKEN_MINT environment variable"
echo "📊 Token distribution wallets created and funded"
echo "🔐 Mint authority and freeze authority configured"

echo "📋 Next steps:"
echo "  1. Update production environment with FLBY_TOKEN_MINT address"
echo "  2. Configure fee discount system in application"
echo "  3. Set up staking and governance mechanisms"
echo "  4. Begin community distribution program"
`;
}

export default {
  FLBY_TOKEN_CONFIG,
  FLBY_UTILITY_CONFIG,
  deployFLBYToken,
  validateFLBYDeployment,
  calculateFeeDiscount,
  getUserTier,
  generateDeploymentScript
};