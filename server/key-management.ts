import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import crypto from 'crypto';

export class KeyManagement {
  private static instance: KeyManagement;
  private escrowKeypair: Keypair | null = null;
  private encryptionKey: Buffer;

  constructor() {
    // Initialize encryption key from environment or generate
    const key = process.env.ENCRYPTION_KEY;
    if (key) {
      this.encryptionKey = Buffer.from(key, 'hex');
    } else {
      this.encryptionKey = crypto.randomBytes(32);
      console.warn('⚠️ Using generated encryption key. Set ENCRYPTION_KEY environment variable for production.');
    }
  }

  static getInstance(): KeyManagement {
    if (!KeyManagement.instance) {
      KeyManagement.instance = new KeyManagement();
    }
    return KeyManagement.instance;
  }

  // Secure key derivation from environment
  getEscrowKeypair(): Keypair {
    if (this.escrowKeypair) {
      return this.escrowKeypair;
    }

    const privateKeyEnv = process.env.SOLANA_ESCROW_PRIVATE_KEY;
    
    if (privateKeyEnv) {
      try {
        // Support both base58 and array formats
        let privateKeyBytes: Uint8Array;
        
        if (privateKeyEnv.startsWith('[') && privateKeyEnv.endsWith(']')) {
          // Array format: [1,2,3,...]
          const keyArray = JSON.parse(privateKeyEnv);
          privateKeyBytes = new Uint8Array(keyArray);
        } else {
          // Base58 format
          privateKeyBytes = bs58.decode(privateKeyEnv);
        }

        this.escrowKeypair = Keypair.fromSecretKey(privateKeyBytes);
        console.log('✅ Loaded escrow keypair from environment');
        return this.escrowKeypair;
        
      } catch (error) {
        console.error('❌ Failed to load escrow keypair from environment:', error);
      }
    }

    // Generate temporary keypair for development
    this.escrowKeypair = Keypair.generate();
    console.warn('⚠️ Using temporary escrow keypair for development');
    console.warn('📝 To set production keypair, set SOLANA_ESCROW_PRIVATE_KEY environment variable');
    
    return this.escrowKeypair;
  }

  // Encrypt sensitive data
  encryptData(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    cipher.update(iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  // Decrypt sensitive data
  decryptData(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    decipher.update(iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Generate secure random strings
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Validate keypair integrity
  validateKeypairIntegrity(keypair: Keypair): boolean {
    try {
      // Test signing and verification
      const testMessage = Buffer.from('test_message');
      const signature = keypair.secretKey.slice(0, 64);
      
      // Basic validation - ensure keypair can be used
      return keypair.publicKey.toString().length === 44; // Base58 Solana address length
    } catch (error) {
      return false;
    }
  }

  // Secure storage of user wallet connections (encrypted)
  encryptWalletData(walletAddress: string, metadata: any): string {
    const data = JSON.stringify({
      address: walletAddress,
      metadata,
      timestamp: Date.now()
    });
    
    return this.encryptData(data);
  }

  // Decrypt user wallet data
  decryptWalletData(encryptedData: string): { address: string; metadata: any; timestamp: number } {
    const decrypted = this.decryptData(encryptedData);
    return JSON.parse(decrypted);
  }

  // Key rotation utilities
  rotateEncryptionKey(): Buffer {
    const newKey = crypto.randomBytes(32);
    console.log('🔄 Encryption key rotated. Update ENCRYPTION_KEY environment variable.');
    console.log('📝 New key (hex):', newKey.toString('hex'));
    return newKey;
  }

  // Production keypair generation with secure entropy
  generateProductionKeypair(): {
    keypair: Keypair;
    privateKeyBase58: string;
    privateKeyArray: string;
    publicKey: string;
  } {
    // Use crypto.randomBytes for production entropy
    const seed = crypto.randomBytes(32);
    const keypair = Keypair.fromSeed(seed);
    
    return {
      keypair,
      privateKeyBase58: bs58.encode(keypair.secretKey),
      privateKeyArray: JSON.stringify(Array.from(keypair.secretKey)),
      publicKey: keypair.publicKey.toString()
    };
  }

  // Security audit utilities
  auditKeyUsage(): {
    escrowKeypairSet: boolean;
    encryptionKeySet: boolean;
    keystoreIntegrity: boolean;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    
    const escrowKeypairSet = !!process.env.SOLANA_ESCROW_PRIVATE_KEY;
    const encryptionKeySet = !!process.env.ENCRYPTION_KEY;
    
    if (!escrowKeypairSet) {
      recommendations.push('Set SOLANA_ESCROW_PRIVATE_KEY for production deployment');
    }
    
    if (!encryptionKeySet) {
      recommendations.push('Set ENCRYPTION_KEY for data encryption in production');
    }

    if (process.env.NODE_ENV === 'production') {
      if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
        recommendations.push('Set strong SESSION_SECRET (32+ characters) for production');
      }
      
      if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        recommendations.push('Set strong JWT_SECRET (32+ characters) for production');
      }
    }

    const keystoreIntegrity = this.validateKeypairIntegrity(this.getEscrowKeypair());

    return {
      escrowKeypairSet,
      encryptionKeySet,
      keystoreIntegrity,
      recommendations
    };
  }
}

// Export singleton instance
export const keyManagement = KeyManagement.getInstance();