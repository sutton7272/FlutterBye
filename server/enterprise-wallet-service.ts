import { Connection, Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMultisig } from '@solana/spl-token';
import bs58 from 'bs58';
import { z } from 'zod';

// Enterprise wallet creation schema
const createEscrowWalletSchema = z.object({
  clientId: z.string(),
  contractValue: z.number().min(200000), // Minimum $200K for enterprise
  currency: z.enum(['SOL', 'USDC', 'FLBY']),
  signatories: z.array(z.string()).min(2).max(5), // 2-5 signature requirement
  requiredSignatures: z.number().min(2).max(5),
  expirationDate: z.string().optional(),
  complianceLevel: z.enum(['standard', 'enhanced', 'bank-level']).default('bank-level')
});

export type CreateEscrowWallet = z.infer<typeof createEscrowWalletSchema>;

// Escrow wallet metadata
interface EscrowWalletMetadata {
  id: string;
  clientId: string;
  multisigAddress: string;
  signatoryAddresses: string[];
  requiredSignatures: number;
  contractValue: number;
  currency: string;
  status: 'active' | 'locked' | 'released' | 'disputed';
  createdAt: Date;
  expiresAt?: Date;
  complianceLevel: string;
  auditTrail: AuditEntry[];
}

interface AuditEntry {
  timestamp: Date;
  action: string;
  actor: string;
  transactionHash?: string;
  amount?: number;
  notes?: string;
}

export class EnterpriseWalletService {
  private connection: Connection;
  private serviceKeypair: Keypair;
  
  constructor() {
    // Use environment variables for production
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    this.connection = new Connection(rpcUrl, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 });
    
    // Service keypair should be stored securely (HSM in production)
    const servicePrivateKey = process.env.SERVICE_PRIVATE_KEY;
    if (!servicePrivateKey) {
      // Generate a temporary keypair for development/demo purposes
      // In production, this should be replaced with HSM-backed keys
      console.warn('⚠️ SERVICE_PRIVATE_KEY not set. Using temporary keypair for development.');
      this.serviceKeypair = Keypair.generate();
    } else {
      this.serviceKeypair = Keypair.fromSecretKey(bs58.decode(servicePrivateKey));
    }
  }

  /**
   * Create a bank-level multi-signature escrow wallet
   */
  async createEscrowWallet(params: CreateEscrowWallet): Promise<EscrowWalletMetadata> {
    try {
      // Validate input
      const validatedParams = createEscrowWalletSchema.parse(params);
      
      // For demo purposes, generate valid signatory keys regardless of input
      // In production, validate actual wallet addresses from enterprise clients
      const signatoryPubkeys = validatedParams.signatories.map(addr => {
        // Generate demo keypairs for all signatories in development
        return Keypair.generate().publicKey;
      });
      
      // Add service key as required signatory for Solvitur oversight
      const allSignatories = [...signatoryPubkeys, this.serviceKeypair.publicKey];
      
      // For demo purposes, create a mock multisig address instead of actual Solana transaction
      // In production, this would create a real multisig account on-chain
      const multisigKeypair = Keypair.generate();
      const multisigAccount = multisigKeypair.publicKey;
      
      console.log('🏦 Demo multisig wallet created:', {
        address: multisigAccount.toBase58(),
        signatories: allSignatories.map(key => key.toBase58()),
        requiredSignatures: validatedParams.requiredSignatures
      });

      // Generate unique wallet ID
      const walletId = `ESC-${Date.now()}-${validatedParams.clientId}`;
      
      // Create audit trail entry
      const initialAuditEntry: AuditEntry = {
        timestamp: new Date(),
        action: 'WALLET_CREATED',
        actor: 'SYSTEM',
        notes: `Multi-sig escrow wallet created for ${validatedParams.currency} ${validatedParams.contractValue}`
      };

      // Create wallet metadata
      const walletMetadata: EscrowWalletMetadata = {
        id: walletId,
        clientId: validatedParams.clientId,
        multisigAddress: multisigAccount.toBase58(),
        signatoryAddresses: validatedParams.signatories,
        requiredSignatures: validatedParams.requiredSignatures,
        contractValue: validatedParams.contractValue,
        currency: validatedParams.currency,
        status: 'active',
        createdAt: new Date(),
        expiresAt: validatedParams.expirationDate ? new Date(validatedParams.expirationDate) : undefined,
        complianceLevel: validatedParams.complianceLevel,
        auditTrail: [initialAuditEntry]
      };

      // Store wallet metadata in database
      await this.storeWalletMetadata(walletMetadata);
      
      return walletMetadata;
      
    } catch (error) {
      console.error('Error creating escrow wallet:', error);
      throw new Error(`Failed to create escrow wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get wallet balance and transaction history
   */
  async getWalletInfo(walletId: string): Promise<{
    metadata: EscrowWalletMetadata;
    balance: number;
    transactions: any[];
  }> {
    try {
      // Retrieve wallet metadata from database
      const metadata = await this.getWalletMetadata(walletId);
      if (!metadata) {
        throw new Error('Wallet not found');
      }

      // Get current balance
      const multisigPubkey = new PublicKey(metadata.multisigAddress);
      const balance = await this.connection.getBalance(multisigPubkey);
      
      // Get transaction history
      const signatures = await this.connection.getSignaturesForAddress(multisigPubkey);
      const transactions = await Promise.all(
        signatures.slice(0, 50).map(async sig => {
          const tx = await this.connection.getTransaction(sig.signature);
          return {
            signature: sig.signature,
            blockTime: tx?.blockTime,
            amount: tx?.meta?.preBalances && tx?.meta?.postBalances 
              ? tx.meta.preBalances[0] - tx.meta.postBalances[0]
              : 0,
            status: tx?.meta?.err ? 'failed' : 'success'
          };
        })
      );

      return {
        metadata,
        balance: balance / LAMPORTS_PER_SOL,
        transactions
      };
      
    } catch (error) {
      console.error('Error getting wallet info:', error);
      throw new Error(`Failed to get wallet info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Release funds from escrow (requires multiple signatures)
   */
  async releaseEscrowFunds(
    walletId: string, 
    recipientAddress: string, 
    amount: number,
    signerPrivateKeys: string[]
  ): Promise<string> {
    try {
      const metadata = await this.getWalletMetadata(walletId);
      if (!metadata) {
        throw new Error('Wallet not found');
      }

      if (metadata.status !== 'active') {
        throw new Error('Wallet is not in active status');
      }

      // Create transaction
      const multisigPubkey = new PublicKey(metadata.multisigAddress);
      const recipientPubkey = new PublicKey(recipientAddress);
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: multisigPubkey,
          toPubkey: recipientPubkey,
          lamports: amount * LAMPORTS_PER_SOL
        })
      );

      // Sign with required number of signatures
      const signers = signerPrivateKeys.map(pk => Keypair.fromSecretKey(bs58.decode(pk)));
      
      if (signers.length < metadata.requiredSignatures) {
        throw new Error(`Insufficient signatures. Required: ${metadata.requiredSignatures}, Provided: ${signers.length}`);
      }

      // Send transaction
      const signature = await this.connection.sendTransaction(transaction, signers);
      
      // Update audit trail
      const auditEntry: AuditEntry = {
        timestamp: new Date(),
        action: 'FUNDS_RELEASED',
        actor: 'MULTI_SIG',
        transactionHash: signature,
        amount: amount,
        notes: `Funds released to ${recipientAddress}`
      };

      await this.addAuditEntry(walletId, auditEntry);
      
      return signature;
      
    } catch (error) {
      console.error('Error releasing escrow funds:', error);
      throw new Error(`Failed to release funds: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate compliance report for regulatory requirements
   */
  async generateComplianceReport(walletId: string): Promise<{
    walletId: string;
    clientId: string;
    contractValue: number;
    currency: string;
    createdAt: Date;
    status: string;
    totalTransactions: number;
    totalVolume: number;
    auditTrail: AuditEntry[];
    complianceStatus: 'compliant' | 'requires_review' | 'non_compliant';
  }> {
    try {
      const walletInfo = await this.getWalletInfo(walletId);
      const metadata = walletInfo.metadata;
      
      // Calculate compliance metrics
      const totalVolume = walletInfo.transactions.reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);
      const complianceStatus = this.assessCompliance(metadata, totalVolume);
      
      return {
        walletId: metadata.id,
        clientId: metadata.clientId,
        contractValue: metadata.contractValue,
        currency: metadata.currency,
        createdAt: metadata.createdAt,
        status: metadata.status,
        totalTransactions: walletInfo.transactions.length,
        totalVolume,
        auditTrail: metadata.auditTrail,
        complianceStatus
      };
      
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw new Error(`Failed to generate compliance report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private assessCompliance(metadata: EscrowWalletMetadata, totalVolume: number): 'compliant' | 'requires_review' | 'non_compliant' {
    // Implement compliance assessment logic
    if (metadata.contractValue > 1000000 && metadata.complianceLevel !== 'bank-level') {
      return 'non_compliant';
    }
    
    if (totalVolume > metadata.contractValue * 1.1) {
      return 'requires_review';
    }
    
    return 'compliant';
  }

  // Database operations (implement with your storage layer)
  private async storeWalletMetadata(metadata: EscrowWalletMetadata): Promise<void> {
    // Store wallet metadata in database
    // For now, log the operation (replace with actual DB storage)
    console.log('🏦 Enterprise wallet created:', {
      id: metadata.id,
      clientId: metadata.clientId,
      contractValue: metadata.contractValue,
      currency: metadata.currency,
      multisigAddress: metadata.multisigAddress,
      complianceLevel: metadata.complianceLevel
    });
  }

  private async getWalletMetadata(walletId: string): Promise<EscrowWalletMetadata | null> {
    // Retrieve wallet metadata from database
    // For now, return a mock wallet for demonstration
    console.log('🔍 Retrieving wallet metadata for:', walletId);
    
    // Return mock data for demo purposes - replace with actual DB query
    if (walletId.startsWith('ESC-')) {
      return {
        id: walletId,
        clientId: 'demo-client-001',
        multisigAddress: '11111111111111111111111111111111',
        signatoryAddresses: ['wallet1', 'wallet2', 'wallet3'],
        requiredSignatures: 2,
        contractValue: 500000,
        currency: 'SOL',
        status: 'active',
        createdAt: new Date(),
        complianceLevel: 'bank-level',
        auditTrail: [{
          timestamp: new Date(),
          action: 'WALLET_CREATED',
          actor: 'SYSTEM',
          notes: 'Mock wallet for demonstration'
        }]
      } as EscrowWalletMetadata;
    }
    
    return null;
  }

  private async addAuditEntry(walletId: string, entry: AuditEntry): Promise<void> {
    // Add audit trail entry to database
    console.log('📝 Adding audit entry for wallet:', walletId, {
      action: entry.action,
      actor: entry.actor,
      amount: entry.amount,
      timestamp: entry.timestamp
    });
  }
}

// Export singleton instance
export const enterpriseWalletService = new EnterpriseWalletService();