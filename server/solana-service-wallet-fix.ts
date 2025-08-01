import { Connection, PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
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
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://devnet.helius-rpc.com/?api-key=070d7528-d275-45b4-bec6-2bfd09926d7d';
    this.connection = new Connection(rpcUrl, 'confirmed');
    
    if (!process.env.SOLANA_PRIVATE_KEY) {
      throw new Error('SOLANA_PRIVATE_KEY environment variable is required');
    }
    
    try {
      const privateKeyBytes = bs58.decode(process.env.SOLANA_PRIVATE_KEY);
      this.keypair = Keypair.fromSecretKey(privateKeyBytes);
      console.log('Solana admin wallet loaded:', this.keypair.publicKey.toString());
    } catch (error) {
      console.error('Error loading Solana private key:', error);
      throw new Error('Invalid SOLANA_PRIVATE_KEY format. Must be base58 encoded.');
    }
  }

  // Create standard SPL token that will display properly in wallets
  async createFlutterbyeToken(params: {
    message: string;
    totalSupply: number;
    recipientWallets?: string[];
    targetWallet?: string;
    distributionWallets?: string[];
  }) {
    try {
      // Generate new mint keypair
      const mintKeypair = Keypair.generate();
      console.log('Creating SPL token:', mintKeypair.publicKey.toString());

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

      // Add initialize mint instruction (0 decimals for whole numbers)
      transaction.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          0, // Decimals = 0 for whole number tokens
          this.keypair.publicKey,
          this.keypair.publicKey
        )
      );

      // Handle distribution logic
      const distributionWallets = params.distributionWallets || params.recipientWallets || [];
      const validDistributionWallets: string[] = [];

      // Filter valid wallet addresses
      for (const wallet of distributionWallets) {
        try {
          new PublicKey(wallet);
          validDistributionWallets.push(wallet);
        } catch (error) {
          console.log(`Invalid wallet address: ${wallet}, skipping`);
        }
      }

      // Get minter wallet
      const minterWallet = this.isValidSolanaAddress(params.targetWallet) 
        ? params.targetWallet 
        : this.keypair.publicKey.toString();

      // Remove duplicates and exclude minter
      const uniqueDistributionWallets = Array.from(new Set(validDistributionWallets))
        .filter(wallet => wallet !== minterWallet);

      const distributedTokens = uniqueDistributionWallets.length;
      const surplusTokens = params.totalSupply - distributedTokens;

      console.log(`Token Distribution Plan:
        - Total Supply: ${params.totalSupply}
        - Distribution Wallets: ${distributedTokens} (1 token each)
        - Surplus to Minter (${minterWallet}): ${surplusTokens}`);

      // Create token accounts and mint tokens for distribution wallets
      for (const recipientAddress of uniqueDistributionWallets) {
        const recipientPubkey = new PublicKey(recipientAddress);
        const associatedTokenAddress = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          recipientPubkey
        );

        // Create associated token account
        transaction.add(
          createAssociatedTokenAccountInstruction(
            this.keypair.publicKey,
            associatedTokenAddress,
            recipientPubkey,
            mintKeypair.publicKey
          )
        );

        // Mint 1 token to recipient
        transaction.add(
          createMintToInstruction(
            mintKeypair.publicKey,
            associatedTokenAddress,
            this.keypair.publicKey,
            1
          )
        );
      }

      // Mint surplus tokens to minter's wallet
      if (surplusTokens > 0) {
        const minterPubkey = new PublicKey(minterWallet);
        const minterTokenAddress = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          minterPubkey
        );

        // Create associated token account for minter
        transaction.add(
          createAssociatedTokenAccountInstruction(
            this.keypair.publicKey,
            minterTokenAddress,
            minterPubkey,
            mintKeypair.publicKey
          )
        );

        // Mint surplus tokens to minter
        transaction.add(
          createMintToInstruction(
            mintKeypair.publicKey,
            minterTokenAddress,
            this.keypair.publicKey,
            surplusTokens
          )
        );
      }

      // Send and confirm transaction
      const signature = await this.connection.sendTransaction(
        transaction, 
        [this.keypair, mintKeypair]
      );
      
      await this.connection.confirmTransaction(signature);

      return {
        success: true,
        mintAddress: mintKeypair.publicKey.toString(),
        transactionSignature: signature,
        metadataUri: `http://localhost:5000/api/metadata/${mintKeypair.publicKey.toString()}`,
        totalSupply: params.totalSupply,
        distributedTokens,
        surplusTokens
      };

    } catch (error) {
      console.error('Solana token creation error:', error);
      throw error;
    }
  }

  private isValidSolanaAddress(address?: string): boolean {
    if (!address) return false;
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }
}