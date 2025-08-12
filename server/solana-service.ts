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
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import bs58 from 'bs58';

export class SolanaService {
  private connection: Connection;
  private keypair: Keypair;

  constructor() {
    // Connect to Solana DevNet
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );

    // Load admin keypair from environment
    if (!process.env.SOLANA_PRIVATE_KEY) {
      throw new Error('SOLANA_PRIVATE_KEY environment variable is required');
    }

    try {
      const privateKeyArray = bs58.decode(process.env.SOLANA_PRIVATE_KEY);
      this.keypair = Keypair.fromSecretKey(privateKeyArray);
    } catch (error) {
      console.error('Error loading Solana keypair:', error);
      throw new Error('Invalid SOLANA_PRIVATE_KEY format. Must be base58 encoded.');
    }
  }

  // Create FLBY-MSG token on DevNet with standard SPL token implementation
  async createFlutterbyeToken(params: {
    message: string;
    totalSupply: number;
    recipientWallets?: string[];
    targetWallet?: string; // Connected wallet (gets surplus tokens)
    distributionWallets?: string[]; // Wallets to receive 1 token each
  }) {
    try {
      console.log('Creating SPL token with params:', {
        message: params.message,
        totalSupply: params.totalSupply,
        recipientWallets: params.recipientWallets,
        creatorWallet: params.targetWallet
      });

      // Generate new mint keypair
      const mintKeypair = Keypair.generate();
      console.log('Creating SPL token:', mintKeypair.publicKey.toString());
      
      // Get rent exemption for mint account
      const lamports = await getMinimumBalanceForRentExemptMint(this.connection);
      
      // Create transaction with standard SPL token instructions
      const transaction = new Transaction();
      
      // Create mint account
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: this.keypair.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );
      
      // Initialize mint (0 decimals for whole number tokens)
      transaction.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          0, // Decimals = 0 for whole number tokens
          this.keypair.publicKey, // Mint authority
          this.keypair.publicKey, // Freeze authority
          TOKEN_PROGRAM_ID
        )
      );

      // Optimized token distribution logic
      let minterWallet = this.keypair.publicKey.toString(); // Default to admin wallet
      
      // Validate and set minter's connected wallet
      if (params.targetWallet) {
        try {
          new PublicKey(params.targetWallet);
          minterWallet = params.targetWallet;
        } catch (error) {
          console.log(`Invalid target wallet address: ${params.targetWallet}, using admin wallet instead`);
        }
      }

      // Get distribution wallets (each gets 1 token)
      const distributionWallets = params.distributionWallets || params.recipientWallets || [];
      
      // Remove duplicates and exclude minter wallet from distribution
      const uniqueDistributionWallets = [...new Set(distributionWallets)]
        .filter(wallet => wallet !== minterWallet)
        .slice(0, params.totalSupply); // Limit to total supply
      
      // Calculate surplus tokens for minter
      const distributedTokens = uniqueDistributionWallets.length;
      const surplusTokens = params.totalSupply - distributedTokens;

      console.log(`Token Distribution Plan:
        - Total Supply: ${params.totalSupply}
        - Distribution Wallets: ${distributedTokens} (1 token each)
        - Surplus to Minter (${minterWallet}): ${surplusTokens}
      `);

      // Create token accounts and mint: 1 token to each distribution wallet
      for (const recipientAddress of uniqueDistributionWallets) {
        const recipientPubkey = new PublicKey(recipientAddress);
        const associatedTokenAddress = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          recipientPubkey,
          false,
          TOKEN_PROGRAM_ID
        );

        // Create associated token account for standard SPL token
        transaction.add(
          createAssociatedTokenAccountInstruction(
            this.keypair.publicKey,
            associatedTokenAddress,
            recipientPubkey,
            mintKeypair.publicKey,
            TOKEN_PROGRAM_ID
          )
        );

        // Mint exactly 1 token to this recipient
        transaction.add(
          createMintToInstruction(
            mintKeypair.publicKey,
            associatedTokenAddress,
            this.keypair.publicKey,
            1, // Always 1 token per distribution wallet
            [],
            TOKEN_PROGRAM_ID
          )
        );
      }

      // Mint surplus tokens to minter's wallet (if any)
      if (surplusTokens > 0) {
        const minterPubkey = new PublicKey(minterWallet);
        const minterTokenAddress = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          minterPubkey,
          false,
          TOKEN_PROGRAM_ID
        );

        // Create associated token account for minter (standard SPL token)
        transaction.add(
          createAssociatedTokenAccountInstruction(
            this.keypair.publicKey,
            minterTokenAddress,
            minterPubkey,
            mintKeypair.publicKey,
            TOKEN_PROGRAM_ID
          )
        );

        // Mint surplus tokens to minter
        transaction.add(
          createMintToInstruction(
            mintKeypair.publicKey,
            minterTokenAddress,
            this.keypair.publicKey,
            surplusTokens,
            [],
            TOKEN_PROGRAM_ID
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

      console.log('✅ SPL Token created successfully:', mintKeypair.publicKey.toString());
      console.log('📄 Token metadata available at:', `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/api/metadata/${mintKeypair.publicKey.toString()}`);

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
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Create metadata endpoint to serve token information
  // This creates a JSON metadata file that can be hosted and referenced
  createTokenMetadataJson(params: {
    mintAddress: string;
    message: string;
    totalSupply: number;
    imageUrl?: string;
  }) {
    return {
      name: params.message.slice(0, 32), // Use message as token name for wallet display
      symbol: "FLBY-MSG", 
      description: `Flutterbye Message Token: "${params.message}"`,
      image: params.imageUrl || `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/butterfly-logo.png`,
      animation_url: "",
      external_url: `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/token/${params.mintAddress}`,
      attributes: [
        {
          trait_type: "Message",
          value: params.message
        },
        {
          trait_type: "Total Supply", 
          value: params.totalSupply
        },
        {
          trait_type: "Token Type",
          value: "FLBY-MSG"
        }
      ],
      properties: {
        files: [
          {
            uri: params.imageUrl || `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/butterfly-logo.png`,
            type: "image/png"
          }
        ],
        category: "token",
        creators: [
          {
            address: this.keypair.publicKey.toString(),
            share: 100
          }
        ]
      }
    };
  }

  // Get token holder information
  async getTokenHolders(mintAddress: string) {
    try {
      const mintPubkey = new PublicKey(mintAddress);
      
      // Get all token accounts for this mint
      const tokenAccounts = await this.connection.getTokenAccountsByMint(mintPubkey);
      
      const holders = [];
      
      for (const accountInfo of tokenAccounts.value) {
        // Skip empty accounts
        if (accountInfo.account.data && accountInfo.account.data.toString('base64')) {
          holders.push({
            address: accountInfo.pubkey.toString(),
            // Note: Would need to parse token account data to get actual balance
            balance: 'Unknown' // Simplified for this implementation
          });
        }
      }
      
      return holders;
    } catch (error) {
      console.error('Error getting token holders:', error);
      return [];
    }
  }

  // Validate wallet address format
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