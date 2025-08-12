import bs58 from 'bs58';
import {
  createUmi,
  publicKey,
  keypairIdentity,
  percentAmount,
} from '@metaplex-foundation/umi';
import {
  mplTokenMetadata,
  findMetadataPda,
  fetchMetadata,
  createV1,
  updateV1,
  TokenStandard
} from '@metaplex-foundation/mpl-token-metadata';

interface AutoMetadataParams {
  rpcUrl?: string;
  secretKey: string;
  mint: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl?: string;
}

export class AutoMetadataService {
  
  // Generate default metadata JSON for Flutterbye tokens
  static generateFlutterbyeMetadataJson(name: string, symbol: string, description: string, message: string): any {
    const defaultImageUrl = "https://flutterbye.com/images/flutterbye-logo.png";
    
    return {
      name,
      symbol,
      description,
      image: defaultImageUrl,
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
          trait_type: "Network",
          value: "DevNet"
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
            uri: defaultImageUrl,
            type: "image/png"
          }
        ]
      },
      external_url: "https://flutterbye.com",
      animation_url: null,
      youtube_url: null
    };
  }

  // Automatically create metadata for newly minted tokens  
  static async createMetadataForNewToken(params: AutoMetadataParams): Promise<{
    success: boolean;
    signature?: string;
    action: string;
    error?: string;
  }> {
    try {
      console.log(`🔧 Auto-creating metadata for token: ${params.mint}`);
      
      const umi = createUmi(params.rpcUrl || "https://api.devnet.solana.com").use(mplTokenMetadata());
      
      // Convert secret key from base58 to bytes
      const secretBytes = bs58.decode(params.secretKey);
      const keypair = umi.eddsa.createKeypairFromSecretKey(secretBytes);
      umi.use(keypairIdentity(keypair));

      const mintPublicKey = publicKey(params.mint);
      const metadataPda = findMetadataPda(umi, { mint: mintPublicKey })[0];

      console.log(`Creating metadata for mint: ${params.mint}`);
      console.log(`Metadata PDA: ${metadataPda.toString()}`);

      // Check if metadata already exists
      let exists = false;
      try {
        await fetchMetadata(umi, metadataPda);
        exists = true;
        console.log('⚠️ Metadata already exists, updating...');
      } catch {
        console.log('✅ No existing metadata found, creating new...');
      }

      // Generate metadata URI (this would typically be hosted metadata JSON)
      const metadataJson = this.generateFlutterbyeMetadataJson(
        params.name, 
        params.symbol, 
        params.description,
        params.name.replace('FLBY-', '') // Extract message from name
      );
      
      // For DevNet, we'll use a placeholder URI
      // In production, this JSON would be uploaded to IPFS or Arweave
      const uri = `https://api.flutterbye.com/metadata/${params.mint}.json`;

      let signature: string;

      if (!exists) {
        // Create new metadata
        const tx = await createV1(umi, {
          mint: mintPublicKey,
          authority: umi.identity,
          name: params.name,
          symbol: params.symbol,
          uri: uri,
          sellerFeeBasisPoints: percentAmount(0),
          tokenStandard: TokenStandard.Fungible,
          isMutable: true
        }).sendAndConfirm(umi);

        signature = bs58.encode(tx.signature);
        console.log('✅ Created metadata');
      } else {
        // Update existing metadata
        const tx = await updateV1(umi, {
          mint: mintPublicKey,
          authority: umi.identity,
          data: {
            name: params.name,
            symbol: params.symbol,
            uri: uri,
            sellerFeeBasisPoints: percentAmount(0),
            creators: null
          },
          primarySaleHappened: null,
          isMutable: true
        }).sendAndConfirm(umi);

        signature = bs58.encode(tx.signature);
        console.log('✅ Updated metadata');
      }

      console.log(`Transaction signature: ${signature}`);
      console.log(`🎉 Token ${params.mint} now has proper metadata for Phantom display!`);

      return {
        success: true,
        signature,
        action: exists ? 'updated' : 'created'
      };

    } catch (error: any) {
      console.error('Auto metadata creation failed:', error);
      return {
        success: false,
        action: 'failed',
        error: error.message
      };
    }
  }

  // Host metadata JSON endpoint (for the URI)
  static async getMetadataJson(mint: string, tokenData: any): Promise<any> {
    const message = tokenData.message || tokenData.name?.replace('FLBY-', '') || 'Unknown';
    
    return this.generateFlutterbyeMetadataJson(
      tokenData.name || `FLBY-${message.toUpperCase()}`,
      tokenData.symbol || "FLBY-MSG", 
      tokenData.description || `${message} - Value-bearing message token on Solana`,
      message
    );
  }
}

export const autoMetadataService = new AutoMetadataService();