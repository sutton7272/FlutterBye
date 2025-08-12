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

interface MetadataFixerOptions {
  rpcUrl: string;
  secretKey: string; // base58 encoded
  mint: string;
  name: string;
  symbol: string;
  uri: string;
}

export class PhantomMetadataFixer {
  async fixTokenMetadata(options: MetadataFixerOptions) {
    const { rpcUrl, secretKey, mint, name, symbol, uri } = options;

    try {
      // Initialize Umi with RPC and metadata plugin
      const umi = createUmi(rpcUrl).use(mplTokenMetadata());
      
      // Create keypair from secret key
      const secretBytes = bs58.decode(secretKey);
      const keypair = umi.eddsa.createKeypairFromSecretKey(secretBytes);
      umi.use(keypairIdentity(keypair));

      const mintPublicKey = publicKey(mint);
      const metadataPda = findMetadataPda(umi, { mint: mintPublicKey })[0];

      console.log(`Fixing metadata for mint: ${mint}`);
      console.log(`Metadata PDA: ${metadataPda.toString()}`);

      // Check if metadata already exists
      let exists = false;
      try {
        const md = await fetchMetadata(umi, metadataPda);
        exists = !!md;
        console.log('Metadata exists on-chain, will update it');
      } catch (e) {
        console.log('No metadata found, will create new metadata');
      }

      let signature: string;

      if (!exists) {
        // Create new metadata
        const tx = await createV1(umi, {
          mint: mintPublicKey,
          authority: umi.identity,
          name,
          symbol,
          uri,
          sellerFeeBasisPoints: percentAmount(0), // 0% for fungible tokens
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
            name,
            symbol,
            uri,
            sellerFeeBasisPoints: percentAmount(0),
            creators: null
          },
          primarySaleHappened: null,
          isMutable: true
        }).sendAndConfirm(umi);

        signature = bs58.encode(tx.signature);
        console.log('✅ Updated metadata');
      }

      return {
        success: true,
        signature,
        metadataPda: metadataPda.toString(),
        action: exists ? 'updated' : 'created'
      };

    } catch (error) {
      console.error('Error fixing token metadata:', error);
      throw error;
    }
  }

  /**
   * Generate default metadata JSON for Flutterbye tokens
   */
  generateDefaultMetadataJson(name: string, symbol: string, description?: string) {
    return {
      name,
      symbol,
      description: description || `${name} - Value-bearing message token on Solana`,
      image: "https://flutterbye.io/images/flby-token.png", // Default Flutterbye token image
      extensions: {
        website: "https://flutterbye.io"
      }
    };
  }

  /**
   * Validate metadata JSON structure
   */
  validateMetadataJson(json: any): boolean {
    return !!(
      json &&
      typeof json.name === 'string' &&
      typeof json.symbol === 'string' &&
      typeof json.description === 'string' &&
      typeof json.image === 'string'
    );
  }
}

export const phantomMetadataFixer = new PhantomMetadataFixer();