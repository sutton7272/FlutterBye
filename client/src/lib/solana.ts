import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  createInitializeMintInstruction, 
  createCreateAccountInstruction,
  createMintToInstruction,
  createTransferInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';

// Solana configuration
const SOLANA_RPC_URL = process.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

export interface TokenCreationParams {
  message: string;
  totalSupply: number;
  creatorWallet: PublicKey;
  recipientWallets: PublicKey[];
}

export interface TokenCreationResult {
  mintAddress: string;
  signature: string;
  success: boolean;
  error?: string;
}

export class SolanaTokenService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(SOLANA_RPC_URL, 'confirmed');
  }

  // Create FlBY-MSG SPL token
  async createFlutterbyeToken(params: TokenCreationParams): Promise<TokenCreationResult> {
    try {
      // Generate mint keypair
      const mintKeypair = Keypair.generate();
      
      // Calculate rent for mint account
      const lamports = await getMinimumBalanceForRentExemptMint(this.connection);
      
      // Create transaction
      const transaction = new Transaction();
      
      // Add create mint account instruction
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: params.creatorWallet,
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
          0, // Decimals = 0 for whole number tokens only
          params.creatorWallet,
          params.creatorWallet
        )
      );

      // Distribute tokens to recipients
      for (const recipientWallet of params.recipientWallets) {
        const associatedTokenAddress = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          recipientWallet
        );
        
        // Create associated token account
        transaction.add(
          createAssociatedTokenAccountInstruction(
            params.creatorWallet,
            associatedTokenAddress,
            recipientWallet,
            mintKeypair.publicKey
          )
        );
        
        // Mint tokens to recipient (whole numbers only)
        const tokensPerRecipient = Math.floor(params.totalSupply / params.recipientWallets.length);
        transaction.add(
          createMintToInstruction(
            mintKeypair.publicKey,
            associatedTokenAddress,
            params.creatorWallet,
            tokensPerRecipient // Guaranteed whole number
          )
        );
      }

      // Set recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = params.creatorWallet;
      
      // Partial sign with mint keypair
      transaction.partialSign(mintKeypair);

      return {
        mintAddress: mintKeypair.publicKey.toString(),
        signature: '', // Will be completed after wallet signs
        success: true
      };
      
    } catch (error) {
      console.error('Solana token creation error:', error);
      return {
        mintAddress: '',
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Validate wallet address
  validateWalletAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  // Get token balance for whole number verification
  async getTokenBalance(mintAddress: string, walletAddress: string): Promise<number> {
    try {
      const mintPubkey = new PublicKey(mintAddress);
      const walletPubkey = new PublicKey(walletAddress);
      
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintPubkey,
        walletPubkey
      );
      
      const balance = await this.connection.getTokenAccountBalance(associatedTokenAddress);
      return parseInt(balance.value.amount); // Always whole number
    } catch {
      return 0;
    }
  }

  // Verify token metadata matches FlBY-MSG standard
  async verifyFlutterbyeToken(mintAddress: string): Promise<boolean> {
    try {
      const mintPubkey = new PublicKey(mintAddress);
      const mintInfo = await this.connection.getParsedAccountInfo(mintPubkey);
      
      if (!mintInfo.value?.data || typeof mintInfo.value.data !== 'object') {
        return false;
      }
      
      const parsedData = mintInfo.value.data as any;
      // Verify decimals = 0 for whole number tokens
      return parsedData.parsed?.info?.decimals === 0;
    } catch {
      return false;
    }
  }
}

export const solanaService = new SolanaTokenService();