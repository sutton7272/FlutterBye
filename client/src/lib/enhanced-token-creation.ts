import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import { solanaService } from './solana';

export interface EnhancedTokenCreationParams {
  message: string;
  value?: number;
  recipients?: string[];
  walletAddress: string;
  walletKeypair?: Keypair; // For metadata creation
  customImage?: string;
  description?: string;
}

export interface EnhancedTokenCreationResult {
  success: boolean;
  tokenId?: string;
  mintAddress?: string;
  signature?: string;
  tokenName?: string;
  tokenSymbol?: string;
  phantomReady?: boolean;
  metadataSignature?: string;
  error?: string;
  blockchain?: string;
}

export class EnhancedTokenCreationService {
  
  // Create token with automatic metadata for Phantom display
  static async createTokenWithMetadata(params: EnhancedTokenCreationParams): Promise<EnhancedTokenCreationResult> {
    try {
      // Step 1: Create the SPL token
      console.log('🪙 Creating SPL token...');
      
      const tokenResponse = await fetch('/api/solana/create-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: params.message,
          value: params.value || 0,
          recipients: params.recipients || [],
          walletAddress: params.walletAddress,
          image: params.customImage
        })
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenData.success) {
        throw new Error(tokenData.error || 'Token creation failed');
      }

      console.log('✅ Token created:', tokenData.mintAddress);

      // Step 2: If this is a real token (not mock), create metadata automatically
      if (params.walletKeypair && tokenData.mintAddress && !tokenData.mintAddress.includes('_')) {
        try {
          console.log('🔧 Creating metadata for Phantom display...');
          
          const metadataResponse = await fetch('/api/tokens/auto-metadata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secretKey: params.walletKeypair.secretKey.toString(), // This would be handled securely
              mint: tokenData.mintAddress,
              name: tokenData.tokenName,
              symbol: tokenData.tokenSymbol,
              description: params.description || `${params.message} - Value-bearing message token on Solana`
            })
          });

          const metadataResult = await metadataResponse.json();
          
          if (metadataResult.success) {
            console.log('✅ Metadata created! Token ready for Phantom display');
            
            return {
              success: true,
              ...tokenData,
              phantomReady: true,
              metadataSignature: metadataResult.signature,
              blockchain: "solana-devnet"
            };
          } else {
            console.warn('⚠️ Metadata creation failed, but token was created successfully');
          }
        } catch (metadataError) {
          console.warn('⚠️ Metadata creation failed:', metadataError);
        }
      }

      // Return token creation result (metadata creation is optional)
      return {
        success: true,
        ...tokenData,
        phantomReady: tokenData.phantomReady || false,
        blockchain: "solana-devnet"
      };

    } catch (error) {
      console.error('Enhanced token creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        phantomReady: false
      };
    }
  }

  // Fix existing token metadata  
  static async fixExistingTokenMetadata(mintAddress: string, walletKeypair: Keypair, tokenName?: string, tokenSymbol?: string): Promise<{
    success: boolean;
    signature?: string;
    error?: string;
  }> {
    try {
      console.log(`🔧 Fixing metadata for existing token: ${mintAddress}`);
      
      const response = await fetch('/api/tokens/auto-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secretKey: walletKeypair.secretKey.toString(),
          mint: mintAddress,
          name: tokenName || `FLBY-TOKEN`,
          symbol: tokenSymbol || "FLBY-MSG",
          description: "Flutterbye message token on Solana - fixed for Phantom display"
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Token metadata fixed! Check Phantom wallet');
        return {
          success: true,
          signature: result.signature
        };
      } else {
        throw new Error(result.error || 'Metadata fix failed');
      }

    } catch (error) {
      console.error('Token metadata fix failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate metadata preview
  static generateMetadataPreview(message: string, tokenName?: string, tokenSymbol?: string): any {
    const name = tokenName || `FLBY-${message.toUpperCase()}`;
    const symbol = tokenSymbol || "FLBY-MSG";
    
    return {
      name,
      symbol,
      description: `${message} - Value-bearing message token on Solana`,
      image: "https://flutterbye.com/images/flutterbye-logo.png",
      attributes: [
        {
          trait_type: "Message",
          value: message
        },
        {
          trait_type: "Token Type",
          value: "Flutterbye Message"
        },
        {
          trait_type: "Platform", 
          value: "Solana"
        },
        {
          trait_type: "Created",
          value: new Date().toISOString()
        }
      ],
      properties: {
        category: "token",
        files: [
          {
            uri: "https://flutterbye.com/images/flutterbye-logo.png",
            type: "image/png"
          }
        ]
      }
    };
  }

  // Check if token has metadata
  static async checkTokenMetadata(mintAddress: string): Promise<{
    hasMetadata: boolean;
    phantomReady: boolean;
    metadata?: any;
  }> {
    try {
      // This would check the blockchain for existing metadata
      // For now, we'll return a simple check
      return {
        hasMetadata: false,
        phantomReady: false,
        metadata: null
      };
    } catch (error) {
      return {
        hasMetadata: false,
        phantomReady: false
      };
    }
  }
}

export const enhancedTokenCreationService = new EnhancedTokenCreationService();