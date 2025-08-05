// Core token operation types for Flutterbye

export interface CreateTokenParams {
  message: string;
  creatorId: string;
  creatorWallet: string;
  totalSupply: number;
  valuePerToken?: number;
  imageUrl?: string;
  attachedValue?: number;
  currency?: 'SOL' | 'USDC' | 'FLBY';
  expiresAt?: Date;
  smsOrigin?: boolean;
  emotionType?: string;
  isPublic?: boolean;
}

export interface TokenResult {
  success: boolean;
  token: any; // Token from database
  mintAddress: string;
  signature: string;
  creatorTokenAccount: string;
}

export interface EscrowResult {
  success: boolean;
  tokenId: string;
  attachedValue: number;
  currency: string;
  escrowWallet: string;
  signature: string;
  expiresAt?: Date;
}

export interface RedeemResult {
  success: boolean;
  tokenId: string;
  burnSignature: string;
  redeemedAmount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  redemptionId: string;
}

export interface TransferResult {
  success: boolean;
  tokenId: string;
  fromWallet: string;
  toWallet: string;
  amount: number;
  signature: string;
  transactionId: string;
}