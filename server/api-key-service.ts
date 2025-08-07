import crypto from "crypto";
import { storage } from "./storage";

export class ApiKeyService {
  // Generate a secure API key
  static generateApiKey(prefix: string = "flby"): string {
    const randomBytes = crypto.randomBytes(24);
    const apiKey = `${prefix}_${randomBytes.toString('base64').replace(/[+/=]/g, '')}`;
    return apiKey;
  }

  // Generate API key for a user
  static async generateUserApiKey(userId: string, keyName?: string): Promise<{
    apiKey: string;
    keyId: string;
    name: string;
  }> {
    const apiKey = this.generateApiKey("flby");
    const keyId = crypto.randomUUID();
    const name = keyName || `API Key ${new Date().toLocaleDateString()}`;

    // Store in database (you'll need to add this to your schema)
    await storage.createApiKey({
      id: keyId,
      userId,
      name,
      apiKey: this.hashApiKey(apiKey),
      isActive: true,
      createdAt: new Date()
    });

    return {
      apiKey, // Return the raw key (only time it's visible)
      keyId,
      name
    };
  }

  // Hash API key for secure storage
  static hashApiKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  // Verify API key
  static async verifyApiKey(apiKey: string): Promise<{
    isValid: boolean;
    userId?: string;
    keyId?: string;
  }> {
    const hashedKey = this.hashApiKey(apiKey);
    const keyData = await storage.getApiKeyByHash(hashedKey);
    
    if (!keyData || !keyData.isActive) {
      return { isValid: false };
    }

    return {
      isValid: true,
      userId: keyData.userId,
      keyId: keyData.id
    };
  }

  // Get user's API keys (without revealing the actual keys)
  static async getUserApiKeys(userId: string) {
    return await storage.getUserApiKeys(userId);
  }

  // Revoke an API key
  static async revokeApiKey(keyId: string, userId: string): Promise<boolean> {
    return await storage.revokeApiKey(keyId, userId);
  }
}

// Sample API keys for demonstration (these would be stored securely in production)
export const DEMO_API_KEYS = {
  // Your demo/development API keys
  FLUTTERBYE_WALLET_INTELLIGENCE: "flby_demo_wallet_intel_2024_v1_secure",
  FLUTTERBYE_MESSAGE_TOKENS: "flby_demo_msg_tokens_2024_v1_secure", 
  FLUTTERBYE_ENTERPRISE: "flby_demo_enterprise_2024_v1_secure",
  FLUTTERBYE_FLUTTERAI: "flby_demo_flutterai_2024_v1_secure"
};

// API Key Usage tracking
export class ApiKeyUsageTracker {
  static async trackUsage(keyId: string, endpoint: string, responseTime: number) {
    await storage.recordApiUsage({
      keyId,
      endpoint,
      responseTime,
      timestamp: new Date()
    });
  }

  static async getUsageStats(keyId: string, period: 'day' | 'week' | 'month' = 'day') {
    return await storage.getApiKeyUsage(keyId, period);
  }
}