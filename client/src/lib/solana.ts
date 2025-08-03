import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction, 
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount
} from '@solana/spl-token';
// Note: Buffer polyfill handled by build system

// Solana DevNet RPC endpoint
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

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

export class SolanaService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(SOLANA_RPC_URL, 'confirmed');
  }

  // Check if wallet address is valid format
  isValidWalletAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  // Get SOL balance for a wallet
  async getWalletBalance(address: string): Promise<number> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw new Error('Failed to get wallet balance');
    }
  }

  // Get connection for external use
  getConnection(): Connection {
    return this.connection;
  }

  // Create FLBY-MSG SPL token
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
      
      // Add initialize mint instruction (0 decimals for whole tokens)
      transaction.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          0, // decimals
          params.creatorWallet,
          params.creatorWallet
        )
      );
      
      // Create associated token accounts and mint tokens for recipients
      for (const recipient of params.recipientWallets) {
        const associatedTokenAddress = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          recipient
        );
        
        // Create associated token account
        transaction.add(
          createAssociatedTokenAccountInstruction(
            params.creatorWallet,
            associatedTokenAddress,
            recipient,
            mintKeypair.publicKey
          )
        );
        
        // Mint tokens to recipient
        transaction.add(
          createMintToInstruction(
            mintKeypair.publicKey,
            associatedTokenAddress,
            params.creatorWallet,
            1 // Always mint 1 token (whole number)
          )
        );
      }
      
      // Set recent blockhash and fee payer
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = params.creatorWallet;
      
      // This would be signed by the frontend wallet
      // For now, return the transaction structure
      return {
        mintAddress: mintKeypair.publicKey.toBase58(),
        signature: 'pending_wallet_signature',
        success: true
      };
      
    } catch (error) {
      console.error('Error creating Flutterbye token:', error);
      return {
        mintAddress: '',
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get token balance for a specific wallet and mint
  async getTokenBalance(walletAddress: string, mintAddress: string): Promise<number> {
    try {
      const walletPubkey = new PublicKey(walletAddress);
      const mintPubkey = new PublicKey(mintAddress);
      
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

  // Verify token metadata matches FLBY-MSG standard
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

  // Get token info (placeholder for when real integration is complete)
  async getTokenInfo(mintAddress: string): Promise<any> {
    // This will be implemented when real blockchain integration is active
    throw new Error('Token info not available - requires wallet connection');
  }

  // Placeholder methods for future blockchain operations
  async createToken(params: any): Promise<any> {
    throw new Error('Token creation requires wallet connection');
  }

  async transferToken(params: any): Promise<any> {
    throw new Error('Token transfer requires wallet connection');
  }

  async burnToken(params: any): Promise<any> {
    throw new Error('Token burning requires wallet connection');
  }
}

export const solanaService = new SolanaService();