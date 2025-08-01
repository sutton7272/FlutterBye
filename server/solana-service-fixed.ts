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

export class SolanaBackendService {
  private connection: Connection;
  private keypair: Keypair;
  private metaplex: Metaplex;

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
      
      // Initialize Metaplex for metadata handling
      this.metaplex = Metaplex.make(this.connection)
        .use(keypairIdentity(this.keypair));
    } catch (error) {
      console.error('Error loading Solana private key:', error);
      throw new Error('Invalid SOLANA_PRIVATE_KEY format. Must be base58 encoded.');
    }
  }

  // Create FLBY-MSG token on DevNet with proper metadata for wallet display
  async createFlutterbyeToken(params: {
    message: string;
    totalSupply: number;
    recipientWallets?: string[];
    targetWallet?: string; // Connected wallet (gets surplus tokens)
    distributionWallets?: string[]; // Wallets to receive 1 token each
  }) {
    try {
      // Create token with Metaplex for proper metadata support
      const { nft } = await this.metaplex.nfts().create({
        uri: `http://localhost:5000/api/metadata/placeholder`,
        name: "FLBY-MSG",
        symbol: "FLBY-MSG",
        sellerFeeBasisPoints: 0,
        creators: [
          {
            address: this.keypair.publicKey,
            share: 100,
          },
        ],
        collection: null,
        uses: null,
        isMutable: true,
        maxSupply: params.totalSupply,
        // This creates a proper SPL token that wallets will recognize
        tokenStandard: 0, // Fungible token
      });

      const mintAddress = nft.address;
      console.log('Created SPL token with metadata:', mintAddress.toString());

      // Update metadata URI to point to our dynamic endpoint
      const metadataUri = `http://localhost:5000/api/metadata/${mintAddress.toString()}`;
      
      // Handle distribution
      const distributionWallets = params.distributionWallets || params.recipientWallets || [];
      const validDistributionWallets: string[] = [];
      
      // Filter valid wallet addresses
      for (const wallet of distributionWallets) {
        try {
          new PublicKey(wallet);
          validDistributionWallets.push(wallet);
        } catch (error) {
          console.log(`Invalid target wallet address: ${wallet}, skipping`);
        }
      }

      // Remove duplicate wallets and exclude minter
      const minterWallet = this.isValidSolanaAddress(params.targetWallet) 
        ? params.targetWallet 
        : this.keypair.publicKey.toString();
      
      const uniqueDistributionWallets = Array.from(new Set(validDistributionWallets))
        .filter(wallet => wallet !== minterWallet);

      const distributedTokens = uniqueDistributionWallets.length;
      const surplusTokens = params.totalSupply - distributedTokens;

      console.log(`Token Distribution Plan:
        - Total Supply: ${params.totalSupply}
        - Distribution Wallets: ${distributedTokens} (1 token each)
        - Surplus to Minter (${minterWallet}): ${surplusTokens}`);

      // Create distribution transactions using standard SPL token operations
      const transaction = new Transaction();

      // Mint tokens to distribution wallets (1 each)
      for (const recipientAddress of uniqueDistributionWallets) {
        const recipientPubkey = new PublicKey(recipientAddress);
        const associatedTokenAddress = await getAssociatedTokenAddress(
          mintAddress,
          recipientPubkey
        );

        // Create associated token account if needed
        transaction.add(
          createAssociatedTokenAccountInstruction(
            this.keypair.publicKey,
            associatedTokenAddress,
            recipientPubkey,
            mintAddress
          )
        );

        // Mint 1 token to recipient
        transaction.add(
          createMintToInstruction(
            mintAddress,
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
          mintAddress,
          minterPubkey
        );

        transaction.add(
          createAssociatedTokenAccountInstruction(
            this.keypair.publicKey,
            minterTokenAddress,
            minterPubkey,
            mintAddress
          )
        );

        if (minterWallet) {
          transaction.add(
            createMintToInstruction(
              mintAddress,
              minterTokenAddress,
              this.keypair.publicKey,
              surplusTokens
            )
          );
        }
      }

      // Send distribution transaction if there are any operations
      let distributionSignature = '';
      if (transaction.instructions.length > 0) {
        distributionSignature = await this.connection.sendTransaction(transaction, [this.keypair]);
        await this.connection.confirmTransaction(distributionSignature);
      }

      return {
        success: true,
        mintAddress: mintAddress.toString(),
        transactionSignature: distributionSignature || nft.mint.address.toString(),
        metadataUri,
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