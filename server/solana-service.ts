import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  createInitializeMintInstruction, 
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';
import bs58 from 'bs58';

export class SolanaBackendService {
  private connection: Connection;
  private keypair: Keypair;

  constructor() {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
    
    if (!process.env.SOLANA_PRIVATE_KEY) {
      throw new Error('SOLANA_PRIVATE_KEY environment variable is required');
    }
    
    try {
      // Decode the base58 private key
      const privateKeyBytes = bs58.decode(process.env.SOLANA_PRIVATE_KEY);
      this.keypair = Keypair.fromSecretKey(privateKeyBytes);
    } catch (error) {
      throw new Error('Invalid SOLANA_PRIVATE_KEY format. Must be base58 encoded.');
    }
  }

  // Create FlBY-MSG token on mainnet
  async createFlutterbyeToken(params: {
    message: string;
    totalSupply: number;
    recipientWallets: string[];
  }) {
    try {
      // Generate new mint keypair
      const mintKeypair = Keypair.generate();
      
      // Calculate rent for mint account
      const lamports = await getMinimumBalanceForRentExemptMint(this.connection);
      
      // Create transaction
      const transaction = new Transaction();
      
      // Add create mint account instruction
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: this.keypair.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );
      
      // Add initialize mint instruction (0 decimals for whole numbers only)
      transaction.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          0, // Decimals = 0 for whole number tokens
          this.keypair.publicKey,
          this.keypair.publicKey
        )
      );

      // Create associated token accounts and mint tokens to recipients
      for (const recipientAddress of params.recipientWallets) {
        const recipientPubkey = new PublicKey(recipientAddress);
        const associatedTokenAddress = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          recipientPubkey
        );

        // Create associated token account
        transaction.add(
          createAssociatedTokenAccountInstruction(
            this.keypair.publicKey, // payer
            associatedTokenAddress,
            recipientPubkey,
            mintKeypair.publicKey
          )
        );

        // Mint tokens to recipient (whole numbers only)
        transaction.add(
          createMintToInstruction(
            mintKeypair.publicKey,
            associatedTokenAddress,
            this.keypair.publicKey,
            params.totalSupply // No decimals, so this is the actual amount
          )
        );
      }

      // Set recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.keypair.publicKey;

      // Sign transaction
      transaction.sign(this.keypair, mintKeypair);

      // Send transaction
      const signature = await this.connection.sendRawTransaction(transaction.serialize());
      
      // Confirm transaction
      await this.connection.confirmTransaction(signature, 'confirmed');

      return {
        mintAddress: mintKeypair.publicKey.toString(),
        signature,
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

  // Get token holder information
  async getTokenHolders(mintAddress: string) {
    try {
      const mintPubkey = new PublicKey(mintAddress);
      const tokenAccounts = await this.connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: [
          {
            dataSize: 165, // Token account data size
          },
          {
            memcmp: {
              offset: 0,
              bytes: mintPubkey.toBase58(),
            },
          },
        ],
      });

      const holders = [];
      for (const account of tokenAccounts) {
        const balance = await this.connection.getTokenAccountBalance(account.pubkey);
        if (parseInt(balance.value.amount) > 0) {
          holders.push({
            address: account.pubkey.toString(),
            balance: parseInt(balance.value.amount)
          });
        }
      }

      return holders;
    } catch (error) {
      console.error('Error getting token holders:', error);
      return [];
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

  // Get wallet SOL balance
  async getWalletBalance(address: string): Promise<number> {
    try {
      const pubkey = new PublicKey(address);
      const balance = await this.connection.getBalance(pubkey);
      return balance / LAMPORTS_PER_SOL;
    } catch {
      return 0;
    }
  }
}

export const solanaBackendService = new SolanaBackendService();