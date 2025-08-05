import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  createBurnInstruction
} from '@solana/spl-token';
import bs58 from 'bs58';
import { storage } from './storage';
import type { CreateTokenParams, TokenResult, EscrowResult, RedeemResult, TransferResult } from '../shared/types';

export class FlutterbyeTokenService {
  private connection: Connection;
  private authorityKeypair: Keypair;
  private escrowWallet: Keypair;

  constructor() {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    this.connection = new Connection(rpcUrl, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 });
    
    // Initialize service keypairs
    const privateKey = process.env.SOLANA_PRIVATE_KEY;
    if (!privateKey) {
      console.warn('⚠️ SOLANA_PRIVATE_KEY not set. Using temporary keypair for development.');
      this.authorityKeypair = Keypair.generate();
    } else {
      try {
        const privateKeyBytes = bs58.decode(privateKey);
        this.authorityKeypair = Keypair.fromSecretKey(privateKeyBytes);
      } catch (error) {
        console.error('Invalid SOLANA_PRIVATE_KEY format. Using temporary keypair.');
        this.authorityKeypair = Keypair.generate();
      }
    }

    // Initialize escrow wallet for value attachment
    const escrowKey = process.env.SOLANA_ESCROW_PRIVATE_KEY;
    if (!escrowKey) {
      console.warn('⚠️ SOLANA_ESCROW_PRIVATE_KEY not set. Using temporary keypair for development.');
      this.escrowWallet = Keypair.generate();
    } else {
      try {
        const escrowKeyBytes = bs58.decode(escrowKey);
        this.escrowWallet = Keypair.fromSecretKey(escrowKeyBytes);
      } catch (error) {
        console.error('Invalid SOLANA_ESCROW_PRIVATE_KEY format. Using temporary keypair.');
        this.escrowWallet = Keypair.generate();
      }
    }

    console.log('🪙 Flutterbye Token Service initialized');
    console.log('🔑 Authority wallet:', this.authorityKeypair.publicKey.toBase58());
    console.log('🏦 Escrow wallet:', this.escrowWallet.publicKey.toBase58());
  }

  /**
   * Create a new FLBY-MSG token with metadata and optional value attachment
   */
  async createMessageToken(params: CreateTokenParams): Promise<TokenResult> {
    try {
      console.log('🪙 Creating message token:', params.message.substring(0, 50) + '...');

      // Generate mint keypair for the new token
      const mintKeypair = Keypair.generate();
      const mintAddress = mintKeypair.publicKey.toBase58();

      // Calculate rent exemption for mint account
      const lamports = await getMinimumBalanceForRentExemptMint(this.connection);

      // Create transaction for token minting
      const transaction = new Transaction();

      // Add create mint account instruction
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: this.authorityKeypair.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );

      // Add initialize mint instruction (0 decimals for whole number tokens)
      transaction.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey, // mint
          0, // decimals
          this.authorityKeypair.publicKey, // mint authority
          this.authorityKeypair.publicKey, // freeze authority
          TOKEN_PROGRAM_ID
        )
      );

      // Create associated token account for the creator
      // Use a valid test wallet address or the authority wallet for development
      let creatorWallet: PublicKey;
      try {
        creatorWallet = new PublicKey(params.creatorWallet);
      } catch (error) {
        console.warn('⚠️ Invalid creator wallet address, using authority wallet for development:', params.creatorWallet);
        creatorWallet = this.authorityKeypair.publicKey;
      }

      const creatorTokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        creatorWallet
      );

      transaction.add(
        createAssociatedTokenAccountInstruction(
          this.authorityKeypair.publicKey, // payer
          creatorTokenAccount, // associated token account
          creatorWallet, // wallet address
          mintKeypair.publicKey // mint
        )
      );

      // Mint tokens to creator's account
      transaction.add(
        createMintToInstruction(
          mintKeypair.publicKey, // mint
          creatorTokenAccount, // destination
          this.authorityKeypair.publicKey, // authority
          params.totalSupply // amount
        )
      );

      // Send and confirm transaction
      const signature = await this.connection.sendTransaction(
        transaction,
        [this.authorityKeypair, mintKeypair],
        { skipPreflight: false, preflightCommitment: 'confirmed' }
      );

      console.log('⏳ Confirming token creation transaction:', signature);

      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      // Store token in database
      const tokenData = {
        message: params.message,
        symbol: 'FLBY-MSG',
        mintAddress,
        creatorId: params.creatorId,
        totalSupply: params.totalSupply,
        availableSupply: params.totalSupply,
        valuePerToken: (params.valuePerToken || 0).toString(),
        imageUrl: params.imageUrl,
        metadata: {
          description: `Flutterbye Message Token: "${params.message}"`,
          image: params.imageUrl,
          attributes: [
            { trait_type: 'Token Type', value: 'FLBY-MSG' },
            { trait_type: 'Total Supply', value: params.totalSupply },
            { trait_type: 'Creator', value: creatorWallet.toBase58() }
          ]
        },
        // Value attachment fields
        hasAttachedValue: (params.attachedValue || 0) > 0,
        attachedValue: (params.attachedValue || 0).toString(),
        currency: params.currency || 'SOL',
        expiresAt: params.expiresAt,
        // SMS fields if applicable
        smsOrigin: params.smsOrigin || false,
        emotionType: params.emotionType,
        isPublic: params.isPublic !== false // Default to public
      };

      const token = await storage.createToken(tokenData);

      console.log('✅ Token created successfully:', {
        tokenId: token.id,
        mintAddress,
        totalSupply: params.totalSupply,
        signature
      });

      return {
        success: true,
        token,
        mintAddress,
        signature,
        creatorTokenAccount: creatorTokenAccount.toBase58()
      };

    } catch (error) {
      console.error('❌ Token creation failed:', error);
      throw new Error(`Failed to create message token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Attach value to an existing token by creating an escrow
   */
  async attachValue(tokenId: string, value: number, currency: 'SOL' | 'USDC' | 'FLBY', expirationDate?: Date): Promise<EscrowResult> {
    try {
      console.log(`💰 Attaching ${value} ${currency} to token ${tokenId}`);

      // Get token from database
      const token = await storage.getToken(tokenId);
      if (!token) {
        throw new Error('Token not found');
      }

      // Convert value to lamports if SOL
      const valueInLamports = currency === 'SOL' ? value * LAMPORTS_PER_SOL : value;

      // Create escrow transaction
      const transaction = new Transaction();

      // Transfer value to escrow wallet
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: this.authorityKeypair.publicKey,
          toPubkey: this.escrowWallet.publicKey,
          lamports: valueInLamports,
        })
      );

      // Send transaction
      const signature = await this.connection.sendTransaction(
        transaction,
        [this.authorityKeypair],
        { skipPreflight: false, preflightCommitment: 'confirmed' }
      );

      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Escrow transaction failed: ${confirmation.value.err}`);
      }

      // Update token in database with escrow information
      const updatedToken = await storage.updateToken(tokenId, {
        hasAttachedValue: true,
        attachedValue: value.toString(),
        currency,
        escrowStatus: 'escrowed',
        escrowWallet: this.escrowWallet.publicKey.toBase58(),
        expiresAt: expirationDate
      });

      console.log('✅ Value attached successfully:', {
        tokenId,
        value,
        currency,
        signature
      });

      return {
        success: true,
        tokenId,
        attachedValue: value,
        currency,
        escrowWallet: this.escrowWallet.publicKey.toBase58(),
        signature,
        expiresAt: expirationDate
      };

    } catch (error) {
      console.error('❌ Value attachment failed:', error);
      throw new Error(`Failed to attach value: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Burn token to redeem attached value
   */
  async burnForRedemption(tokenId: string, burnerWallet: string, recipientWallet?: string): Promise<RedeemResult> {
    try {
      console.log(`🔥 Processing burn redemption for token ${tokenId}`);

      // Get token from database
      const token = await storage.getToken(tokenId);
      if (!token) {
        throw new Error('Token not found');
      }

      if (!token.hasAttachedValue || !token.attachedValue) {
        throw new Error('Token has no attached value to redeem');
      }

      if (token.escrowStatus !== 'escrowed') {
        throw new Error('Token value is not in escrow');
      }

      // Check if token has expired
      if (token.expiresAt && new Date() > new Date(token.expiresAt)) {
        throw new Error('Token has expired and cannot be redeemed');
      }

      const burnerPubkey = new PublicKey(burnerWallet);
      const recipientPubkey = recipientWallet ? new PublicKey(recipientWallet) : burnerPubkey;
      const mintPubkey = new PublicKey(token.mintAddress);

      // Get burner's token account
      const burnerTokenAccount = await getAssociatedTokenAddress(mintPubkey, burnerPubkey);

      // Create burn transaction
      const transaction = new Transaction();

      // Add burn instruction (burn 1 token)
      transaction.add(
        createBurnInstruction(
          burnerTokenAccount, // account to burn from
          mintPubkey, // mint
          burnerPubkey, // owner
          1 // amount (1 token)
        )
      );

      // Calculate platform fee (2% default)
      const feePercentage = 0.02;
      const attachedValue = parseFloat(token.attachedValue);
      const platformFee = attachedValue * feePercentage;
      const netAmount = attachedValue - platformFee;

      // Transfer redeemed value from escrow to recipient
      const valueInLamports = token.currency === 'SOL' ? netAmount * LAMPORTS_PER_SOL : netAmount;
      
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: this.escrowWallet.publicKey,
          toPubkey: recipientPubkey,
          lamports: Math.floor(valueInLamports),
        })
      );

      // Send transaction (requires both burner and escrow signatures)
      const signature = await this.connection.sendTransaction(
        transaction,
        [this.escrowWallet], // Only escrow signs, burner signs separately in client
        { skipPreflight: false, preflightCommitment: 'confirmed' }
      );

      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Redemption transaction failed: ${confirmation.value.err}`);
      }

      // Update token status in database
      await storage.updateToken(tokenId, {
        escrowStatus: 'redeemed',
        availableSupply: token.availableSupply - 1
      });

      // Create redemption record
      const redemptionData = {
        tokenId,
        userId: burnerWallet, // Using wallet as user ID for now
        burnTransactionSignature: signature,
        redeemedAmount: attachedValue.toString(),
        platformFee: platformFee.toString(),
        feePercentage: (feePercentage * 100).toString(),
        netAmount: netAmount.toString(),
        currency: token.currency,
        redemptionTransactionSignature: signature,
        status: 'completed'
      };

      const redemption = await storage.createRedemption(redemptionData);

      console.log('✅ Token burned and value redeemed successfully:', {
        tokenId,
        redeemedAmount: netAmount,
        currency: token.currency,
        signature
      });

      return {
        success: true,
        tokenId,
        burnSignature: signature,
        redeemedAmount: netAmount,
        platformFee,
        netAmount,
        currency: token.currency,
        redemptionId: redemption.id
      };

    } catch (error) {
      console.error('❌ Burn redemption failed:', error);
      throw new Error(`Failed to burn token for redemption: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transfer token between wallets
   */
  async transferToken(tokenId: string, fromWallet: string, toWallet: string, amount: number = 1): Promise<TransferResult> {
    try {
      console.log(`📤 Transferring ${amount} token(s) from ${fromWallet} to ${toWallet}`);

      // Get token from database
      const token = await storage.getToken(tokenId);
      if (!token) {
        throw new Error('Token not found');
      }

      const fromPubkey = new PublicKey(fromWallet);
      const toPubkey = new PublicKey(toWallet);
      const mintPubkey = new PublicKey(token.mintAddress);

      // Get or create associated token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(mintPubkey, fromPubkey);
      const toTokenAccount = await getAssociatedTokenAddress(mintPubkey, toPubkey);

      const transaction = new Transaction();

      // Create recipient token account if it doesn't exist
      try {
        await this.connection.getAccountInfo(toTokenAccount);
      } catch {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            this.authorityKeypair.publicKey, // payer
            toTokenAccount, // associated token account
            toPubkey, // wallet address
            mintPubkey // mint
          )
        );
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          fromTokenAccount, // source
          toTokenAccount, // destination
          fromPubkey, // owner
          amount // amount
        )
      );

      // Send transaction (requires sender signature)
      const signature = await this.connection.sendTransaction(
        transaction,
        [this.authorityKeypair], // Platform signs for now, in production sender would sign
        { skipPreflight: false, preflightCommitment: 'confirmed' }
      );

      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transfer transaction failed: ${confirmation.value.err}`);
      }

      // Record transaction in database
      const transactionData = {
        type: 'transfer',
        fromUserId: fromWallet, // Using wallet as user ID for now
        toUserId: toWallet,
        tokenId,
        quantity: amount,
        solanaSignature: signature,
        status: 'confirmed'
      };

      const dbTransaction = await storage.createTransaction(transactionData);

      console.log('✅ Token transfer completed successfully:', {
        tokenId,
        amount,
        fromWallet,
        toWallet,
        signature
      });

      return {
        success: true,
        tokenId,
        fromWallet,
        toWallet,
        amount,
        signature,
        transactionId: dbTransaction.id
      };

    } catch (error) {
      console.error('❌ Token transfer failed:', error);
      throw new Error(`Failed to transfer token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get token balance for a wallet
   */
  async getTokenBalance(mintAddress: string, walletAddress: string): Promise<number> {
    try {
      const walletPubkey = new PublicKey(walletAddress);
      const mintPubkey = new PublicKey(mintAddress);
      
      const tokenAccount = await getAssociatedTokenAddress(mintPubkey, walletPubkey);
      const balance = await this.connection.getTokenAccountBalance(tokenAccount);
      
      return balance.value.uiAmount || 0;
    } catch (error) {
      console.log(`No token balance found for ${walletAddress} with mint ${mintAddress}`);
      return 0;
    }
  }

  /**
   * Handle expired tokens and refund escrowed value
   */
  async handleExpiredTokens(): Promise<void> {
    try {
      console.log('🕐 Checking for expired tokens...');

      // This would typically be called by a cron job
      // Get all tokens with attached value that have expired
      const expiredTokens = await storage.getExpiredTokensWithValue();

      for (const token of expiredTokens) {
        if (token.escrowStatus === 'escrowed' && token.attachedValue) {
          console.log(`🔄 Processing refund for expired token ${token.id}`);

          // Refund escrowed value to original creator
          const creatorWallet = new PublicKey(token.creatorId); // Assuming creatorId is wallet address
          const valueInLamports = token.currency === 'SOL' ? 
            parseFloat(token.attachedValue) * LAMPORTS_PER_SOL : 
            parseFloat(token.attachedValue);

          const transaction = new Transaction();
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: this.escrowWallet.publicKey,
              toPubkey: creatorWallet,
              lamports: Math.floor(valueInLamports),
            })
          );

          const signature = await this.connection.sendTransaction(
            transaction,
            [this.escrowWallet],
            { skipPreflight: false, preflightCommitment: 'confirmed' }
          );

          // Update token status
          await storage.updateToken(token.id, {
            escrowStatus: 'refunded'
          });

          console.log(`✅ Refunded ${token.attachedValue} ${token.currency} for expired token ${token.id}`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to handle expired tokens:', error);
    }
  }
}

// Export singleton instance
export const flutterbyeTokenService = new FlutterbyeTokenService();