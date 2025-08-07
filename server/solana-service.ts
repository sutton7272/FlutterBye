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
// Note: Using simplified metadata approach for DevNet compatibility
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import bs58 from 'bs58';

export class SolanaBackendService {
  private connection: Connection;
  private keypair: Keypair;

  constructor() {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://devnet.helius-rpc.com/?api-key=070d7528-d275-45b4-bec6-2bfd09926d7d';
    this.connection = new Connection(rpcUrl, 'confirmed');
    
    if (!process.env.SOLANA_PRIVATE_KEY) {
      throw new Error('SOLANA_PRIVATE_KEY environment variable is required');
    }
    
    try {
      // Decode the base58 private key
      const privateKeyBytes = bs58.decode(process.env.SOLANA_PRIVATE_KEY);
      this.keypair = Keypair.fromSecretKey(privateKeyBytes);
      console.log('Solana admin wallet loaded:', this.keypair.publicKey.toString());
    } catch (error) {
      console.error('Error loading Solana private key:', error);
      throw new Error('Invalid SOLANA_PRIVATE_KEY format. Must be base58 encoded.');
    }
  }

  // Create FLBY-MSG token on DevNet with optimized distribution
  async createFlutterbyeToken(params: {
    message: string;
    totalSupply: number;
    recipientWallets?: string[];
    targetWallet?: string; // Connected wallet (gets surplus tokens)
    distributionWallets?: string[]; // Wallets to receive 1 token each
  }) {
    try {
      // Generate new mint keypair
      const mintKeypair = Keypair.generate();
      
      // Define token metadata (simplified for DevNet)
      const metadata = {
        mint: mintKeypair.publicKey,
        name: "FLBY-MSG",
        symbol: "FLBY-MSG",
        uri: `http://localhost:5000/api/metadata/${mintKeypair.publicKey.toString()}`,
        message: params.message,
        totalSupply: params.totalSupply.toString(),
        tokenType: "FLBY-MSG",
        description: `Flutterbye Message Token: "${params.message}"`
      };

      // Calculate space needed for basic mint
      const lamports = await getMinimumBalanceForRentExemptMint(this.connection);
      
      // Create transaction
      const transaction = new Transaction();
      
      // Add create mint account instruction (standard SPL)
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
          this.keypair.publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      // Note: Metaplex metadata creation temporarily disabled due to deprecated API
      // Tokens will work properly but may show as "Unknown Token" in wallets
      // The JSON metadata endpoint at /api/metadata/{mintAddress} provides all token information

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
      const uniqueDistributionWallets = Array.from(new Set(distributionWallets))
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

        // Create associated token account for Token-2022
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

        // Create associated token account for minter (Token-2022)
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
      name: "FLBY-MSG",
      symbol: "FLBY-MSG", 
      description: `Flutterbye Message Token: "${params.message}"`,
      image: params.imageUrl || "https://flutterbye.app/assets/token-icon.png",
      animation_url: "",
      external_url: "https://flutterbye.app",
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
            uri: params.imageUrl || "https://flutterbye.app/assets/token-icon.png",
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