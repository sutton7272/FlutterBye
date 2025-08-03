import { storage } from './storage';
import { openaiService } from './openai-service';
import { errorTracker } from './error-tracking';
import QRCode from 'qrcode';
import { randomUUID } from 'crypto';

export interface MessageNFTMetadata {
  id: string;
  message: string;
  image?: string; // Base64 or URL
  creator: string;
  totalSupply: number;
  currentSupply: number;
  valuePerNFT: number; // SOL value attached to each NFT
  currency: 'SOL' | 'USDC' | 'FLBY';
  qrCode: string; // Base64 QR code image
  qrCodeData: string; // The data encoded in QR code
  collectionName: string;
  description: string;
  attributes: Record<string, string | number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageNFT {
  id: string;
  collectionId: string;
  tokenNumber: number; // 1, 2, 3, etc. for limited numbered series
  owner: string;
  metadata: MessageNFTMetadata;
  mintSignature?: string; // Solana transaction signature
  claimed: boolean;
  claimedAt?: Date;
  valueAttached: number;
  currency: 'SOL' | 'USDC' | 'FLBY';
  qrClaimCode: string; // Unique code for QR claiming
  createdAt: Date;
}

export interface CreateMessageNFTRequest {
  message: string;
  image?: string;
  creator: string;
  totalSupply: number;
  valuePerNFT: number;
  currency: 'SOL' | 'USDC' | 'FLBY';
  collectionName?: string;
  description?: string;
  customAttributes?: Record<string, string | number>;
}

export class MessageNFTService {
  private collections = new Map<string, MessageNFTMetadata>();
  private nfts = new Map<string, MessageNFT>();

  // Create a new Message NFT collection with specified quantity
  async createMessageNFTCollection(request: CreateMessageNFTRequest): Promise<{
    collection: MessageNFTMetadata;
    nfts: MessageNFT[];
    claimUrl: string;
  }> {
    try {
      const collectionId = randomUUID();
      
      // Generate QR code data for the collection
      const qrData = {
        type: 'message_nft_collection',
        collectionId,
        claimUrl: `${process.env.BASE_URL || 'https://flutterbye.com'}/claim/${collectionId}`,
        message: request.message,
        totalSupply: request.totalSupply,
        valuePerNFT: request.valuePerNFT,
        currency: request.currency
      };
      
      const qrCodeData = JSON.stringify(qrData);
      const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
        errorCorrectionLevel: 'M',
        margin: 1,
        color: {
          dark: '#0079F2',
          light: '#FFFFFF'
        },
        width: 256
      });

      // Use AI to enhance the collection description if not provided
      let enhancedDescription = request.description || '';
      if (!enhancedDescription && request.message) {
        try {
          const aiResult = await openaiService.optimizeMessage(
            `Create a compelling NFT collection description for: "${request.message}"`,
            'excitement'
          );
          enhancedDescription = aiResult.optimizedMessage;
        } catch (error) {
          enhancedDescription = `Limited edition Message NFT collection: "${request.message}"`;
        }
      }

      // Create collection metadata
      const metadata: MessageNFTMetadata = {
        id: collectionId,
        message: request.message,
        image: request.image,
        creator: request.creator,
        totalSupply: request.totalSupply,
        currentSupply: 0,
        valuePerNFT: request.valuePerNFT,
        currency: request.currency,
        qrCode: qrCodeImage,
        qrCodeData,
        collectionName: request.collectionName || `Message NFT #${Date.now()}`,
        description: enhancedDescription,
        attributes: {
          'Message Length': request.message.length,
          'Value Attached': request.valuePerNFT,
          'Currency': request.currency,
          'Edition Size': request.totalSupply,
          'Collection Type': 'Message NFT',
          ...request.customAttributes
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Create individual numbered NFTs
      const nfts: MessageNFT[] = [];
      for (let i = 1; i <= request.totalSupply; i++) {
        const nftId = randomUUID();
        const claimCode = this.generateClaimCode();
        
        const nft: MessageNFT = {
          id: nftId,
          collectionId,
          tokenNumber: i,
          owner: '', // Will be set when claimed
          metadata,
          claimed: false,
          valueAttached: request.valuePerNFT,
          currency: request.currency,
          qrClaimCode: claimCode,
          createdAt: new Date()
        };
        
        nfts.push(nft);
        this.nfts.set(nftId, nft);
      }

      this.collections.set(collectionId, metadata);

      // Store in persistent storage
      await this.saveCollection(metadata);
      await Promise.all(nfts.map(nft => this.saveNFT(nft)));

      // Track analytics
      await storage.createAnalytics({
        date: new Date(),
        metric: 'message_nft_collection_created',
        value: `Collection "${metadata.collectionName}" created with ${request.totalSupply} NFTs`,
        metadata: {
          collectionId,
          creator: request.creator,
          totalSupply: request.totalSupply,
          valuePerNFT: request.valuePerNFT,
          currency: request.currency,
          messageLength: request.message.length
        }
      });

      const claimUrl = `${process.env.BASE_URL || 'https://flutterbye.com'}/claim/${collectionId}`;

      return {
        collection: metadata,
        nfts,
        claimUrl
      };

    } catch (error) {
      errorTracker.logError(error as Error, undefined, 'error', ['message-nft', 'create']);
      throw new Error('Failed to create Message NFT collection');
    }
  }

  // Claim a specific NFT from a collection
  async claimMessageNFT(collectionId: string, claimerAddress: string, tokenNumber?: number): Promise<MessageNFT> {
    try {
      const collection = this.collections.get(collectionId);
      if (!collection) {
        throw new Error('Collection not found');
      }

      // Find available NFT (specific number or first available)
      const availableNFTs = Array.from(this.nfts.values())
        .filter(nft => nft.collectionId === collectionId && !nft.claimed);

      if (availableNFTs.length === 0) {
        throw new Error('All NFTs in this collection have been claimed');
      }

      let nftToClaim: MessageNFT;
      if (tokenNumber) {
        nftToClaim = availableNFTs.find(nft => nft.tokenNumber === tokenNumber)!;
        if (!nftToClaim) {
          throw new Error(`NFT #${tokenNumber} is not available or already claimed`);
        }
      } else {
        // Claim the lowest numbered available NFT
        nftToClaim = availableNFTs.sort((a, b) => a.tokenNumber - b.tokenNumber)[0];
      }

      // Update NFT as claimed
      nftToClaim.claimed = true;
      nftToClaim.owner = claimerAddress;
      nftToClaim.claimedAt = new Date();

      // Update collection supply
      collection.currentSupply += 1;
      collection.updatedAt = new Date();

      // Save updates
      await this.saveNFT(nftToClaim);
      await this.saveCollection(collection);

      // Track analytics
      await storage.createAnalytics({
        date: new Date(),
        metric: 'message_nft_claimed',
        value: `NFT #${nftToClaim.tokenNumber} claimed from "${collection.collectionName}"`,
        metadata: {
          nftId: nftToClaim.id,
          collectionId,
          tokenNumber: nftToClaim.tokenNumber,
          claimer: claimerAddress,
          valueAttached: nftToClaim.valueAttached,
          currency: nftToClaim.currency
        }
      });

      return nftToClaim;

    } catch (error) {
      errorTracker.logError(error as Error, undefined, 'error', ['message-nft', 'claim']);
      throw error;
    }
  }

  // Get collection details with availability
  async getCollection(collectionId: string): Promise<{
    collection: MessageNFTMetadata;
    availableNFTs: number[];
    claimedNFTs: number[];
    claimUrl: string;
  }> {
    const collection = this.collections.get(collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }

    const nfts = Array.from(this.nfts.values())
      .filter(nft => nft.collectionId === collectionId);

    const availableNFTs = nfts
      .filter(nft => !nft.claimed)
      .map(nft => nft.tokenNumber)
      .sort((a, b) => a - b);

    const claimedNFTs = nfts
      .filter(nft => nft.claimed)
      .map(nft => nft.tokenNumber)
      .sort((a, b) => a - b);

    const claimUrl = `${process.env.BASE_URL || 'https://flutterbye.com'}/claim/${collectionId}`;

    return {
      collection,
      availableNFTs,
      claimedNFTs,
      claimUrl
    };
  }

  // Get user's claimed NFTs
  async getUserNFTs(userAddress: string): Promise<MessageNFT[]> {
    return Array.from(this.nfts.values())
      .filter(nft => nft.owner === userAddress && nft.claimed);
  }

  // Generate QR code for claiming
  async generateClaimQR(collectionId: string, tokenNumber?: number): Promise<string> {
    const qrData = {
      type: 'claim_message_nft',
      collectionId,
      tokenNumber,
      claimUrl: `${process.env.BASE_URL || 'https://flutterbye.com'}/claim/${collectionId}${tokenNumber ? `/${tokenNumber}` : ''}`,
      timestamp: Date.now()
    };

    return await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#0079F2',
        light: '#FFFFFF'
      },
      width: 256
    });
  }

  // Get all collections (for admin/browse)
  async getAllCollections(page: number = 1, limit: number = 20): Promise<{
    collections: MessageNFTMetadata[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const allCollections = Array.from(this.collections.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCollections = allCollections.slice(startIndex, endIndex);

    return {
      collections: paginatedCollections,
      totalCount: allCollections.length,
      hasMore: endIndex < allCollections.length
    };
  }

  // Analytics and insights
  async getCollectionAnalytics(collectionId: string): Promise<{
    totalViews: number;
    claimRate: number;
    avgClaimTime: number;
    topClaimHours: number[];
    valueDistributed: number;
    currency: string;
  }> {
    const collection = this.collections.get(collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }

    const nfts = Array.from(this.nfts.values())
      .filter(nft => nft.collectionId === collectionId);

    const claimedNFTs = nfts.filter(nft => nft.claimed);
    const claimRate = (claimedNFTs.length / collection.totalSupply) * 100;

    // Calculate average claim time (mock data for now)
    const avgClaimTime = claimedNFTs.length > 0 
      ? claimedNFTs.reduce((acc, nft) => {
          if (nft.claimedAt) {
            return acc + (nft.claimedAt.getTime() - collection.createdAt.getTime());
          }
          return acc;
        }, 0) / claimedNFTs.length
      : 0;

    const valueDistributed = claimedNFTs.length * collection.valuePerNFT;

    // Mock claim hours distribution (in real implementation, track actual claim times)
    const topClaimHours = [9, 14, 18, 20, 22]; // Popular hours

    return {
      totalViews: Math.floor(Math.random() * 1000) + 100, // Mock data
      claimRate,
      avgClaimTime: Math.floor(avgClaimTime / (1000 * 60 * 60)), // Convert to hours
      topClaimHours,
      valueDistributed,
      currency: collection.currency
    };
  }

  // Private helper methods
  private generateClaimCode(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private async saveCollection(collection: MessageNFTMetadata): Promise<void> {
    try {
      await storage.createAnalytics({
        date: new Date(),
        metric: 'message_nft_collection_data',
        value: `Collection data for ${collection.id}`,
        metadata: {
          type: 'collection',
          collectionId: collection.id,
          data: collection
        }
      });
    } catch (error) {
      console.error('Failed to save collection:', error);
    }
  }

  private async saveNFT(nft: MessageNFT): Promise<void> {
    try {
      await storage.createAnalytics({
        date: new Date(),
        metric: 'message_nft_data',
        value: `NFT data for ${nft.id}`,
        metadata: {
          type: 'nft',
          nftId: nft.id,
          data: nft
        }
      });
    } catch (error) {
      console.error('Failed to save NFT:', error);
    }
  }

  // Load data from storage on service initialization
  async initialize(): Promise<void> {
    try {
      const analytics = await storage.getAnalytics() ?? [];
      
      // Load collections
      const collectionData = analytics.filter((entry: any) => 
        entry.metric === 'message_nft_collection_data' && entry.metadata?.type === 'collection'
      );
      
      for (const entry of collectionData) {
        if (entry.metadata?.data) {
          const collection = entry.metadata.data as MessageNFTMetadata;
          this.collections.set(collection.id, collection);
        }
      }

      // Load NFTs
      const nftData = analytics.filter((entry: any) => 
        entry.metric === 'message_nft_data' && entry.metadata?.type === 'nft'
      );
      
      for (const entry of nftData) {
        if (entry.metadata?.data) {
          const nft = entry.metadata.data as MessageNFT;
          this.nfts.set(nft.id, nft);
        }
      }

      console.log(`Message NFT Service initialized with ${this.collections.size} collections and ${this.nfts.size} NFTs`);
      
    } catch (error) {
      console.error('Failed to initialize Message NFT service:', error);
    }
  }
}

// Singleton instance
export const messageNFTService = new MessageNFTService();

// Initialize on module load
messageNFTService.initialize();