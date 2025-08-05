// Additional methods for wallet integration in FlutterbyeTokenService
import { Transaction, PublicKey } from '@solana/web3.js';
import { createBurnInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Add these methods to FlutterbyeTokenService class:

export const walletIntegrationMethods = {
  // Prepare burn transaction without signing (for client wallet signing)
  async prepareBurnTransaction(params: {
    tokenId: string;
    burnerWallet: string;
    recipientWallet: string;
  }) {
    console.log(`🔥 Preparing burn transaction for token ${params.tokenId}`);

    // Get token details from storage
    const token = await this.storage.getToken(params.tokenId);
    if (!token) {
      throw new Error('Token not found');
    }

    if (!token.hasAttachedValue || token.escrowStatus !== 'escrowed') {
      throw new Error('Token has no value attached or not properly escrowed');
    }

    const mintPublicKey = new PublicKey(token.mintAddress);
    const burnerPublicKey = new PublicKey(params.burnerWallet);

    // Get token account for burner
    const burnerTokenAccount = await this.getAssociatedTokenAddress(
      mintPublicKey,
      burnerPublicKey
    );

    // Check if burner has tokens
    const tokenBalance = await this.connection.getTokenAccountBalance(burnerTokenAccount);
    if (tokenBalance.value.uiAmount === 0) {
      throw new Error('No tokens to burn');
    }

    // Create burn instruction
    const burnInstruction = createBurnInstruction(
      burnerTokenAccount,
      mintPublicKey,
      burnerPublicKey,
      1, // Burn 1 token
      [],
      TOKEN_PROGRAM_ID
    );

    // Create transaction
    const transaction = new Transaction().add(burnInstruction);

    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = burnerPublicKey;

    return {
      transaction,
      tokenAccount: burnerTokenAccount.toBase58(),
      mintAddress: token.mintAddress
    };
  },

  // Confirm burn redemption after client has signed and sent transaction
  async confirmBurnRedemption(params: {
    tokenId: string;
    signature: string;
    burnerWallet: string;
    recipientWallet: string;
  }) {
    console.log(`🔥 Confirming burn redemption for token ${params.tokenId}`);

    // Verify transaction was successful
    const txInfo = await this.connection.getTransaction(params.signature);
    if (!txInfo || txInfo.meta?.err) {
      throw new Error('Transaction failed or not found');
    }

    // Get token details
    const token = await this.storage.getToken(params.tokenId);
    if (!token) {
      throw new Error('Token not found');
    }

    // Process value release from escrow
    const recipientPublicKey = new PublicKey(params.recipientWallet);
    const attachedValue = parseFloat(token.attachedValue);
    
    // Calculate platform fee (2% default)
    const platformFeeRate = 0.02;
    const platformFee = attachedValue * platformFeeRate;
    const userReceives = attachedValue - platformFee;

    // Transfer SOL from escrow to recipient
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: this.escrowKeypair.publicKey,
      toPubkey: recipientPublicKey,
      lamports: Math.floor(userReceives * LAMPORTS_PER_SOL)
    });

    const transaction = new Transaction().add(transferInstruction);
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = this.escrowKeypair.publicKey;

    // Sign and send transfer
    transaction.sign(this.escrowKeypair);
    const transferSignature = await this.connection.sendTransaction(transaction, [this.escrowKeypair]);

    // Wait for confirmation
    await this.connection.confirmTransaction(transferSignature);

    // Update token status in database
    await this.storage.updateToken(params.tokenId, {
      escrowStatus: 'redeemed' as any,
      availableSupply: token.availableSupply - 1
    });

    // Record redemption
    const redemption = await this.storage.createRedemption({
      tokenId: params.tokenId,
      redeemerWallet: params.burnerWallet,
      recipientWallet: params.recipientWallet,
      valueRedeemed: userReceives.toString(),
      currency: token.currency,
      platformFee: platformFee.toString(),
      burnSignature: params.signature,
      transferSignature,
      status: 'completed'
    });

    console.log('✅ Burn redemption completed:', {
      tokenId: params.tokenId,
      valueRedeemed: userReceives,
      platformFee,
      burnSignature: params.signature,
      transferSignature
    });

    return {
      redemption,
      valueRedeemed: userReceives,
      currency: token.currency,
      platformFee,
      burnSignature: params.signature,
      transferSignature
    };
  }
};