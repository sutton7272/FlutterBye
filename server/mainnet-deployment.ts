// MainNet Deployment Configuration and Validation
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getCurrentEnvironment, validateEnvironment } from '@shared/environment-config';

export interface MainNetDeploymentConfig {
  rpcEndpoint: string;
  programId: string;
  mintAuthority: string;
  escrowWallet: string;
  feeWallet: string;
  flbyTokenMint: string;
  treasuryWallet: string;
}

export interface DeploymentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  requirements: string[];
}

// MainNet Configuration with Environment Variables
export function getMainNetConfig(): MainNetDeploymentConfig {
  return {
    rpcEndpoint: process.env.MAINNET_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
    programId: process.env.MAINNET_PROGRAM_ID || '',
    mintAuthority: process.env.MAINNET_MINT_AUTHORITY || '',
    escrowWallet: process.env.MAINNET_ESCROW_WALLET || '',
    feeWallet: process.env.MAINNET_FEE_WALLET || '',
    flbyTokenMint: process.env.FLBY_TOKEN_MINT || '',
    treasuryWallet: process.env.MAINNET_TREASURY_WALLET || ''
  };
}

// Validate MainNet Configuration
export async function validateMainNetDeployment(): Promise<DeploymentValidation> {
  const config = getMainNetConfig();
  const errors: string[] = [];
  const warnings: string[] = [];
  const requirements: string[] = [];

  // Check required environment variables
  if (!config.programId) {
    errors.push('MAINNET_PROGRAM_ID environment variable required');
    requirements.push('Deploy smart contract to MainNet and set MAINNET_PROGRAM_ID');
  }

  if (!config.mintAuthority) {
    errors.push('MAINNET_MINT_AUTHORITY environment variable required');
    requirements.push('Generate production mint authority keypair and set MAINNET_MINT_AUTHORITY');
  }

  if (!config.escrowWallet) {
    errors.push('MAINNET_ESCROW_WALLET environment variable required');
    requirements.push('Create multi-signature escrow wallet and set MAINNET_ESCROW_WALLET');
  }

  if (!config.feeWallet) {
    errors.push('MAINNET_FEE_WALLET environment variable required');
    requirements.push('Create fee collection wallet and set MAINNET_FEE_WALLET');
  }

  if (!config.flbyTokenMint) {
    warnings.push('FLBY_TOKEN_MINT not set - FLBY token not deployed');
    requirements.push('Deploy FLBY token to MainNet and set FLBY_TOKEN_MINT');
  }

  // Test RPC connection
  try {
    const connection = new Connection(config.rpcEndpoint, 'confirmed');
    const slot = await connection.getSlot();
    if (slot === 0) {
      errors.push('Unable to connect to MainNet RPC endpoint');
    }
  } catch (error) {
    errors.push(`RPC connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    requirements.push('Verify MainNet RPC endpoint connectivity');
  }

  // Validate wallet addresses if provided
  const walletsToValidate = [
    { name: 'Program ID', address: config.programId },
    { name: 'Mint Authority', address: config.mintAuthority },
    { name: 'Escrow Wallet', address: config.escrowWallet },
    { name: 'Fee Wallet', address: config.feeWallet },
    { name: 'Treasury Wallet', address: config.treasuryWallet }
  ];

  for (const wallet of walletsToValidate) {
    if (wallet.address) {
      try {
        new PublicKey(wallet.address);
      } catch {
        errors.push(`Invalid ${wallet.name} address format`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    requirements
  };
}

// Generate MainNet Environment Variables Template
export function generateMainNetEnvTemplate(): string {
  return `# MainNet Production Environment Variables
# Add these to your production environment

# Solana Network Configuration
SOLANA_NETWORK=mainnet-beta
MAINNET_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
MAINNET_WS_ENDPOINT=wss://api.mainnet-beta.solana.com

# Smart Contract Configuration
MAINNET_PROGRAM_ID=YOUR_DEPLOYED_PROGRAM_ID_HERE

# Wallet Configuration (Use multi-signature wallets for security)
MAINNET_MINT_AUTHORITY=YOUR_MINT_AUTHORITY_KEYPAIR_HERE
MAINNET_ESCROW_WALLET=YOUR_ESCROW_WALLET_ADDRESS_HERE
MAINNET_FEE_WALLET=YOUR_FEE_COLLECTION_WALLET_HERE
MAINNET_TREASURY_WALLET=YOUR_TREASURY_WALLET_ADDRESS_HERE

# FLBY Token Configuration
FLBY_TOKEN_MINT=YOUR_FLBY_TOKEN_MINT_ADDRESS_HERE

# Production Security
PRODUCTION_MODE=true
ENABLE_AUDIT_LOGGING=true
REQUIRE_TRANSACTION_APPROVAL=true

# API Rate Limiting
OPENAI_MAX_REQUESTS_PER_MINUTE=1000
OPENAI_MAX_COST_PER_HOUR=100

# WebSocket Configuration
WEBSOCKET_MAX_CONNECTIONS=10000
WEBSOCKET_HEARTBEAT_INTERVAL=30000
`;
}

// MainNet Deployment Checklist
export interface DeploymentStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  required: boolean;
  action: string;
}

export function getMainNetDeploymentChecklist(): DeploymentStep[] {
  const config = getMainNetConfig();
  
  return [
    {
      id: 'smart-contract',
      name: 'Deploy Smart Contract',
      description: 'Deploy Flutterbye smart contract to MainNet',
      completed: !!config.programId,
      required: true,
      action: 'Build and deploy smart contract using Anchor framework'
    },
    {
      id: 'mint-authority',
      name: 'Generate Mint Authority',
      description: 'Create secure mint authority keypair',
      completed: !!config.mintAuthority,
      required: true,
      action: 'Generate keypair with hardware security module'
    },
    {
      id: 'escrow-wallet',
      name: 'Create Escrow Wallet',
      description: 'Set up multi-signature escrow wallet',
      completed: !!config.escrowWallet,
      required: true,
      action: 'Create 3-of-5 multi-signature wallet for escrow operations'
    },
    {
      id: 'fee-wallet',
      name: 'Create Fee Collection Wallet',
      description: 'Set up fee collection wallet',
      completed: !!config.feeWallet,
      required: true,
      action: 'Create secure wallet for platform fee collection'
    },
    {
      id: 'flby-token',
      name: 'Deploy FLBY Token',
      description: 'Launch native FLBY token on MainNet',
      completed: !!config.flbyTokenMint,
      required: false,
      action: 'Deploy FLBY token with proper tokenomics'
    },
    {
      id: 'treasury-wallet',
      name: 'Set Up Treasury',
      description: 'Configure treasury wallet for platform funds',
      completed: !!config.treasuryWallet,
      required: true,
      action: 'Create multi-signature treasury wallet'
    },
    {
      id: 'environment-vars',
      name: 'Configure Environment',
      description: 'Set all production environment variables',
      completed: config.programId && config.mintAuthority && config.escrowWallet && config.feeWallet,
      required: true,
      action: 'Add all environment variables to production deployment'
    },
    {
      id: 'security-audit',
      name: 'Security Audit',
      description: 'Complete security audit of MainNet configuration',
      completed: false,
      required: true,
      action: 'Perform comprehensive security audit and penetration testing'
    }
  ];
}

// Deployment Progress Calculation
export function getDeploymentProgress(): {
  completed: number;
  total: number;
  percentage: number;
  requiredCompleted: number;
  requiredTotal: number;
} {
  const checklist = getMainNetDeploymentChecklist();
  const completed = checklist.filter(step => step.completed).length;
  const total = checklist.length;
  const requiredSteps = checklist.filter(step => step.required);
  const requiredCompleted = requiredSteps.filter(step => step.completed).length;
  const requiredTotal = requiredSteps.length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
    requiredCompleted,
    requiredTotal
  };
}

// MainNet Health Check
export async function performMainNetHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: { name: string; status: boolean; message: string }[];
}> {
  const checks = [];
  let healthyCount = 0;

  // RPC Connection Check
  try {
    const connection = new Connection(getMainNetConfig().rpcEndpoint, 'confirmed');
    const slot = await connection.getSlot();
    checks.push({
      name: 'RPC Connection',
      status: slot > 0,
      message: slot > 0 ? `Connected to slot ${slot}` : 'Unable to connect'
    });
    if (slot > 0) healthyCount++;
  } catch (error) {
    checks.push({
      name: 'RPC Connection',
      status: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  // Environment Configuration Check
  const envValidation = validateEnvironment();
  checks.push({
    name: 'Environment Config',
    status: envValidation.isValid,
    message: envValidation.isValid ? 'All environment variables configured' : `Errors: ${envValidation.errors.join(', ')}`
  });
  if (envValidation.isValid) healthyCount++;

  // Deployment Progress Check
  const progress = getDeploymentProgress();
  const deploymentReady = progress.requiredCompleted === progress.requiredTotal;
  checks.push({
    name: 'Deployment Readiness',
    status: deploymentReady,
    message: deploymentReady ? 'All required steps completed' : `${progress.requiredCompleted}/${progress.requiredTotal} required steps completed`
  });
  if (deploymentReady) healthyCount++;

  const totalChecks = checks.length;
  let status: 'healthy' | 'degraded' | 'unhealthy';
  
  if (healthyCount === totalChecks) {
    status = 'healthy';
  } else if (healthyCount >= totalChecks * 0.7) {
    status = 'degraded';
  } else {
    status = 'unhealthy';
  }

  return { status, checks };
}

export default {
  getMainNetConfig,
  validateMainNetDeployment,
  generateMainNetEnvTemplate,
  getMainNetDeploymentChecklist,
  getDeploymentProgress,
  performMainNetHealthCheck
};