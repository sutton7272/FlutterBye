import { Connection, PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';

export interface EscrowContractConfig {
  programId: string;
  rpcUrl: string;
  authorityKeypair?: Keypair;
  network: 'devnet' | 'mainnet';
}

export interface CreateEscrowParams {
  amount: number;
  recipientAddress: string;
  timeoutHours: number;
  escrowId: string;
  mintAddress: string;
}

export interface TransferProfitsParams {
  fromWalletId: string;
  toAddress: string;
  amount: number;
  currency: string;
  memo?: string;
}

export interface EscrowInfo {
  escrowId: string;
  authority: string;
  recipient: string;
  amount: number;
  status: 'Active' | 'Released' | 'Cancelled' | 'Expired';
  createdAt: number;
  timeoutTimestamp: number;
  releasedAt?: number;
  cancelledAt?: number;
  expiredAt?: number;
}

export class EscrowContractService {
  private connection: Connection;
  private program: Program<FlutterbeyeEscrow>;
  private provider: AnchorProvider;
  private programId: PublicKey;

  constructor(config: EscrowContractConfig) {
    this.connection = new Connection(config.rpcUrl, 'confirmed');
    this.programId = new PublicKey(config.programId);
    
    // Set up provider with authority keypair
    const wallet = new Wallet(config.authorityKeypair || Keypair.generate());
    this.provider = new AnchorProvider(this.connection, wallet, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    });
    
    // Initialize program (will be properly configured when IDL is generated)
    this.program = null as any; // Temporary until smart contract is deployed
  }

  /**
   * Create a new escrow account
   */
  async createEscrow(params: CreateEscrowParams): Promise<{ signature: string; escrowAddress: string }> {
    try {
      const {
        amount,
        recipientAddress,
        timeoutHours,
        escrowId,
        mintAddress
      } = params;

      const authority = this.provider.wallet.publicKey;
      const recipient = new PublicKey(recipientAddress);
      const mint = new PublicKey(mintAddress);
      
      // Calculate timeout timestamp
      const timeoutTimestamp = new anchor.BN(Date.now() / 1000 + timeoutHours * 3600);
      
      // Derive escrow PDA
      const [escrowPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), authority.toBuffer(), Buffer.from(escrowId)],
        this.programId
      );

      // Derive vault PDA
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), escrowPda.toBuffer()],
        this.programId
      );

      // Get or create associated token accounts
      const authorityTokenAccount = await getAssociatedTokenAddress(mint, authority);
      
      // Create transaction
      const tx = await this.program.methods
        .initializeEscrow(
          new anchor.BN(amount),
          recipient,
          timeoutTimestamp,
          escrowId
        )
        .accounts({
          authority,
          escrow: escrowPda,
          vault: vaultPda,
          authorityTokenAccount,
          mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      console.log(`✅ Escrow created with signature: ${tx}`);
      console.log(`📦 Escrow address: ${escrowPda.toString()}`);

      return {
        signature: tx,
        escrowAddress: escrowPda.toString()
      };

    } catch (error) {
      console.error('❌ Error creating escrow:', error);
      throw error;
    }
  }

  /**
   * Release escrow funds to recipient
   */
  async releaseEscrow(escrowId: string, authorityKeypair?: Keypair): Promise<string> {
    try {
      const authority = authorityKeypair?.publicKey || this.provider.wallet.publicKey;
      
      // Derive escrow PDA
      const [escrowPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), authority.toBuffer(), Buffer.from(escrowId)],
        this.programId
      );

      // Get escrow account info
      const escrowAccount = await this.program.account.escrow.fetch(escrowPda);
      
      // Derive vault PDA
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), escrowPda.toBuffer()],
        this.programId
      );

      // Get recipient token account
      const recipientTokenAccount = await getAssociatedTokenAddress(
        escrowAccount.mint,
        escrowAccount.recipient
      );

      // Create release transaction
      const tx = await this.program.methods
        .releaseEscrow()
        .accounts({
          authority,
          escrow: escrowPda,
          vault: vaultPda,
          recipientTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers(authorityKeypair ? [authorityKeypair] : [])
        .rpc();

      console.log(`✅ Escrow released with signature: ${tx}`);
      return tx;

    } catch (error) {
      console.error('❌ Error releasing escrow:', error);
      throw error;
    }
  }

  /**
   * Cancel escrow and return funds to authority
   */
  async cancelEscrow(escrowId: string, authorityKeypair?: Keypair): Promise<string> {
    try {
      const authority = authorityKeypair?.publicKey || this.provider.wallet.publicKey;
      
      // Derive escrow PDA
      const [escrowPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), authority.toBuffer(), Buffer.from(escrowId)],
        this.programId
      );

      // Get escrow account info
      const escrowAccount = await this.program.account.escrow.fetch(escrowPda);
      
      // Derive vault PDA
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), escrowPda.toBuffer()],
        this.programId
      );

      // Get authority token account
      const authorityTokenAccount = await getAssociatedTokenAddress(
        escrowAccount.mint,
        authority
      );

      // Create cancel transaction
      const tx = await this.program.methods
        .cancelEscrow()
        .accounts({
          authority,
          escrow: escrowPda,
          vault: vaultPda,
          authorityTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers(authorityKeypair ? [authorityKeypair] : [])
        .rpc();

      console.log(`✅ Escrow cancelled with signature: ${tx}`);
      return tx;

    } catch (error) {
      console.error('❌ Error cancelling escrow:', error);
      throw error;
    }
  }

  /**
   * Claim expired escrow (can be called by anyone after timeout)
   */
  async claimExpiredEscrow(escrowId: string, authorityAddress: string): Promise<string> {
    try {
      const authority = new PublicKey(authorityAddress);
      const caller = this.provider.wallet.publicKey;
      
      // Derive escrow PDA
      const [escrowPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), authority.toBuffer(), Buffer.from(escrowId)],
        this.programId
      );

      // Get escrow account info
      const escrowAccount = await this.program.account.escrow.fetch(escrowPda);
      
      // Derive vault PDA
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), escrowPda.toBuffer()],
        this.programId
      );

      // Get authority token account
      const authorityTokenAccount = await getAssociatedTokenAddress(
        escrowAccount.mint,
        authority
      );

      // Create claim transaction
      const tx = await this.program.methods
        .claimExpiredEscrow()
        .accounts({
          caller,
          escrow: escrowPda,
          vault: vaultPda,
          authorityTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log(`✅ Expired escrow claimed with signature: ${tx}`);
      return tx;

    } catch (error) {
      console.error('❌ Error claiming expired escrow:', error);
      throw error;
    }
  }

  /**
   * Get escrow information
   */
  async getEscrowInfo(escrowId: string, authorityAddress: string): Promise<EscrowInfo> {
    try {
      const authority = new PublicKey(authorityAddress);
      
      // Derive escrow PDA
      const [escrowPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), authority.toBuffer(), Buffer.from(escrowId)],
        this.programId
      );

      // Fetch escrow account
      const escrowAccount = await this.program.account.escrow.fetch(escrowPda);

      return {
        escrowId: escrowAccount.escrowId,
        authority: escrowAccount.authority.toString(),
        recipient: escrowAccount.recipient.toString(),
        amount: escrowAccount.amount.toNumber(),
        status: Object.keys(escrowAccount.status)[0] as any,
        createdAt: escrowAccount.createdAt.toNumber(),
        timeoutTimestamp: escrowAccount.timeoutTimestamp.toNumber(),
        releasedAt: escrowAccount.releasedAt?.toNumber(),
        cancelledAt: escrowAccount.cancelledAt?.toNumber(),
        expiredAt: escrowAccount.expiredAt?.toNumber(),
      };

    } catch (error) {
      console.error('❌ Error getting escrow info:', error);
      throw error;
    }
  }

  /**
   * Get all escrows for an authority
   */
  async getEscrowsByAuthority(authorityAddress: string): Promise<EscrowInfo[]> {
    try {
      const authority = new PublicKey(authorityAddress);
      
      // Get all escrow accounts for this authority
      const escrows = await this.program.account.escrow.all([
        {
          memcmp: {
            offset: 8, // After discriminator
            bytes: authority.toBase58(),
          },
        },
      ]);

      return escrows.map(({ account }) => ({
        escrowId: account.escrowId,
        authority: account.authority.toString(),
        recipient: account.recipient.toString(),
        amount: account.amount.toNumber(),
        status: Object.keys(account.status)[0] as any,
        createdAt: account.createdAt.toNumber(),
        timeoutTimestamp: account.timeoutTimestamp.toNumber(),
        releasedAt: account.releasedAt?.toNumber(),
        cancelledAt: account.cancelledAt?.toNumber(),
        expiredAt: account.expiredAt?.toNumber(),
      }));

    } catch (error) {
      console.error('❌ Error getting escrows by authority:', error);
      throw error;
    }
  }

  /**
   * Check if escrow has expired
   */
  isEscrowExpired(escrowInfo: EscrowInfo): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= escrowInfo.timeoutTimestamp;
  }

  /**
   * Get escrow vault balance
   */
  async getEscrowVaultBalance(escrowId: string, authorityAddress: string): Promise<number> {
    try {
      const authority = new PublicKey(authorityAddress);
      
      // Derive escrow PDA
      const [escrowPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), authority.toBuffer(), Buffer.from(escrowId)],
        this.programId
      );

      // Derive vault PDA
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), escrowPda.toBuffer()],
        this.programId
      );

      // Get vault account info
      const vaultInfo = await this.connection.getTokenAccountBalance(vaultPda);
      return vaultInfo.value.uiAmount || 0;

    } catch (error) {
      console.error('❌ Error getting vault balance:', error);
      return 0;
    }
  }

  /**
   * Transfer profits from platform wallet to external address
   */
  async transferProfits(params: TransferProfitsParams): Promise<{ signature: string; txnId: string }> {
    try {
      const { fromWalletId, toAddress, amount, currency, memo } = params;
      
      // For development, simulate the transfer with a mock transaction
      // In production, this would interact with the actual Solana blockchain
      const mockSignature = `mock_transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const txnId = `TXN_${Date.now()}`;
      
      console.log(`💰 Transferring ${amount} ${currency} from wallet ${fromWalletId} to ${toAddress}`);
      console.log(`📝 Memo: ${memo || 'No memo'}`);
      console.log(`📧 Mock signature: ${mockSignature}`);
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        signature: mockSignature,
        txnId,
      };

    } catch (error) {
      console.error('❌ Error transferring profits:', error);
      throw error;
    }
  }
}

// Export singleton instance
let escrowContractService: EscrowContractService | null = null;

export function getEscrowContractService(): EscrowContractService {
  if (!escrowContractService) {
    const config: EscrowContractConfig = {
      programId: process.env.ESCROW_PROGRAM_ID || 'FLBYEscrow11111111111111111111111111111111',
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
      authorityKeypair: process.env.SOLANA_ESCROW_PRIVATE_KEY 
        ? Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.SOLANA_ESCROW_PRIVATE_KEY)))
        : undefined
    };
    
    escrowContractService = new EscrowContractService(config);
  }
  
  return escrowContractService;
}