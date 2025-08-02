import { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID as METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';

// Connection to Solana network
export const connection = new Connection(
  import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
);

export interface TokenMessageData {
  title: string;
  content: string;
  value: number;
  currency: 'SOL' | 'USDC' | 'FLBY';
  expirationDate?: string;
  isLimitedEdition?: boolean;
  maxSupply?: number;
}

export interface CreatedToken {
  mintAddress: string;
  tokenAccount: string;
  signature: string;
  metadata: {
    name: string;
    symbol: string;
    description: string;
    image: string;
  };
}

// Create a tokenized message as SPL token
export async function createTokenizedMessage(
  walletAdapter: any,
  messageData: TokenMessageData
): Promise<CreatedToken> {
  if (!walletAdapter.connected || !walletAdapter.publicKey) {
    throw new Error('Wallet not connected');
  }

  const payer = walletAdapter.publicKey;
  
  // Create mint authority (usually the message creator)
  const mintAuthority = payer;
  const freezeAuthority = payer;

  try {
    // Create new mint for the tokenized message
    const mint = await createMint(
      connection,
      walletAdapter, // This will need proper signing
      mintAuthority,
      freezeAuthority,
      6 // 6 decimals for token
    );

    // Get or create associated token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      walletAdapter,
      mint,
      payer
    );

    // Mint tokens (typically 1 for unique messages, or more for distribution)
    const mintAmount = messageData.isLimitedEdition 
      ? (messageData.maxSupply || 1) * Math.pow(10, 6)
      : 1 * Math.pow(10, 6);

    const mintSignature = await mintTo(
      connection,
      walletAdapter,
      mint,
      tokenAccount.address,
      mintAuthority,
      mintAmount
    );

    // Create metadata for the token
    const tokenMetadata = {
      name: `FLBY-MSG: ${messageData.title.substring(0, 27)}`,
      symbol: 'FLBY-MSG',
      description: messageData.content,
      image: 'https://flutterbye.io/default-message-token.png',
      attributes: [
        { trait_type: 'Message Type', value: 'Tokenized Message' },
        { trait_type: 'Value', value: messageData.value.toString() },
        { trait_type: 'Currency', value: messageData.currency },
        { trait_type: 'Created By', value: payer.toString() },
        ...(messageData.expirationDate ? [{ trait_type: 'Expires', value: messageData.expirationDate }] : []),
        ...(messageData.isLimitedEdition ? [{ trait_type: 'Limited Edition', value: 'true' }] : [])
      ]
    };

    return {
      mintAddress: mint.toString(),
      tokenAccount: tokenAccount.address.toString(),
      signature: mintSignature,
      metadata: tokenMetadata
    };

  } catch (error) {
    console.error('Error creating tokenized message:', error);
    throw error;
  }
}

// Distribute tokens to recipients
export async function distributeTokens(
  walletAdapter: any,
  mintAddress: string,
  recipients: string[],
  amount: number = 1
): Promise<string[]> {
  if (!walletAdapter.connected || !walletAdapter.publicKey) {
    throw new Error('Wallet not connected');
  }

  const mint = new PublicKey(mintAddress);
  const signatures: string[] = [];

  for (const recipientAddress of recipients) {
    try {
      const recipient = new PublicKey(recipientAddress);
      
      // Get or create recipient's token account
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        walletAdapter,
        mint,
        recipient
      );

      // Transfer tokens
      const transferSignature = await mintTo(
        connection,
        walletAdapter,
        mint,
        recipientTokenAccount.address,
        walletAdapter.publicKey,
        amount * Math.pow(10, 6)
      );

      signatures.push(transferSignature);
    } catch (error) {
      console.error(`Error distributing to ${recipientAddress}:`, error);
    }
  }

  return signatures;
}

// Get token holders for a specific mint
export async function getTokenHolders(mintAddress: string): Promise<Array<{address: string, amount: number}>> {
  try {
    const mint = new PublicKey(mintAddress);
    const accounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        {
          dataSize: 165, // Token account data size
        },
        {
          memcmp: {
            offset: 0,
            bytes: mint.toBase58(),
          },
        },
      ],
    });

    const holders = accounts
      .map(account => ({
        address: account.account.owner.toString(),
        amount: Number(account.account.data.readBigUInt64LE(64)) / Math.pow(10, 6)
      }))
      .filter(holder => holder.amount > 0);

    return holders;
  } catch (error) {
    console.error('Error fetching token holders:', error);
    return [];
  }
}

// Verify wallet signature for authentication
export async function verifyWalletSignature(
  walletAddress: string,
  signature: string,
  message: string
): Promise<boolean> {
  try {
    // This would implement actual signature verification
    // For now, return true for development
    return true;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

// Get wallet balance
export async function getWalletBalance(walletAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / Math.pow(10, 9); // Convert lamports to SOL
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return 0;
  }
}

// FLBY token utilities
export const FLBY_TOKEN_MINT = 'FLBYTokenMintAddressHere'; // Replace with actual FLBY token mint

export async function getFLBYBalance(walletAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const mint = new PublicKey(FLBY_TOKEN_MINT);
    
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      null as any, // For read-only operations
      mint,
      publicKey
    );
    
    const balance = await connection.getTokenAccountBalance(tokenAccount.address);
    return Number(balance.value.amount) / Math.pow(10, 6);
  } catch (error) {
    console.error('Error fetching FLBY balance:', error);
    return 0;
  }
}