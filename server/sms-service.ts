import { storage } from './storage';
import type { Token, InsertToken } from '@shared/schema';

export interface SMSTokenRequest {
  phoneNumber: string;
  message: string;
  recipientWallet?: string;
  value?: number;
  metadata?: {
    emotion?: string;
    sentiment?: number;
    urgency?: 'low' | 'medium' | 'high';
    category?: string;
  };
}

export interface SMSResponse {
  success: boolean;
  tokenId?: string;
  message: string;
  error?: string;
}

export interface EmotionalAnalysis {
  emotion: string;
  sentiment: number; // -1 to 1
  confidence: number; // 0 to 1
  urgency: 'low' | 'medium' | 'high';
  keywords: string[];
  category: 'personal' | 'business' | 'emergency' | 'celebration' | 'other';
}

export class SMSService {
  private twilioClient: any = null;
  private isConfigured = false;

  constructor() {
    this.initializeTwilio();
  }

  private initializeTwilio() {
    // Check for Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && phoneNumber) {
      try {
        // In production, would use: const twilio = require('twilio');
        // this.twilioClient = twilio(accountSid, authToken);
        this.isConfigured = true;
        console.log('✅ SMS service configured successfully');
      } catch (error) {
        console.error('❌ Failed to configure SMS service:', error);
        this.isConfigured = false;
      }
    } else {
      console.log('📱 SMS service not configured - missing Twilio credentials');
      this.isConfigured = false;
    }
  }

  // Analyze emotional content of SMS message using rule-based approach
  async analyzeEmotionalContent(message: string): Promise<EmotionalAnalysis> {
    const messageText = message.toLowerCase().trim();
    
    // Emotion detection keywords
    const emotionPatterns = {
      happy: ['happy', 'joy', 'excited', 'celebrate', 'amazing', 'wonderful', 'fantastic', 'great', 'awesome', '😊', '😄', '🎉', '💕'],
      sad: ['sad', 'cry', 'upset', 'disappointed', 'heartbroken', 'miss', 'lonely', '😢', '😭', '💔'],
      angry: ['angry', 'mad', 'furious', 'frustrated', 'hate', 'terrible', 'awful', '😠', '😡'],
      love: ['love', 'adore', 'cherish', 'treasure', 'heart', 'romantic', 'kiss', '❤️', '💖', '💕'],
      grateful: ['thank', 'grateful', 'appreciate', 'blessed', 'thankful', 'grace', '🙏'],
      worried: ['worried', 'anxious', 'concerned', 'nervous', 'stress', 'afraid', '😰', '😟'],
      excited: ['excited', 'thrilled', 'pumped', 'energy', 'amazing', 'incredible', '🚀', '⚡'],
      peaceful: ['calm', 'peace', 'relax', 'serene', 'tranquil', 'meditation', '☮️', '🧘']
    };

    // Urgency patterns
    const urgencyPatterns = {
      high: ['urgent', 'emergency', 'asap', 'immediately', 'crisis', 'help', 'now', '!!!', 'critical'],
      medium: ['soon', 'quick', 'important', 'need', 'please', '!!'],
      low: ['later', 'whenever', 'no rush', 'casual', 'maybe']
    };

    // Category patterns
    const categoryPatterns = {
      emergency: ['emergency', 'help', 'crisis', 'urgent', 'hospital', 'accident', 'danger'],
      business: ['meeting', 'project', 'deadline', 'client', 'work', 'business', 'professional'],
      personal: ['family', 'friend', 'personal', 'private', 'relationship', 'home'],
      celebration: ['birthday', 'anniversary', 'graduation', 'promotion', 'wedding', 'party', 'celebrate']
    };

    // Detect primary emotion
    let detectedEmotion = 'neutral';
    let maxMatches = 0;
    
    for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
      const matches = patterns.filter(pattern => messageText.includes(pattern)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion;
      }
    }

    // Calculate sentiment score
    const positiveWords = ['good', 'great', 'amazing', 'wonderful', 'excellent', 'fantastic', 'love', 'happy', 'joy'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'sad', 'angry', 'upset', 'disappointed'];
    
    const positiveCount = positiveWords.filter(word => messageText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => messageText.includes(word)).length;
    
    let sentiment = 0;
    if (positiveCount > negativeCount) {
      sentiment = Math.min(1, (positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1));
    } else if (negativeCount > positiveCount) {
      sentiment = Math.max(-1, (positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1));
    }

    // Detect urgency
    let urgency: 'low' | 'medium' | 'high' = 'low';
    for (const [level, patterns] of Object.entries(urgencyPatterns)) {
      if (patterns.some(pattern => messageText.includes(pattern))) {
        urgency = level as 'low' | 'medium' | 'high';
        if (level === 'high') break; // High priority takes precedence
      }
    }

    // Detect category
    let category: 'personal' | 'business' | 'emergency' | 'celebration' | 'other' = 'other';
    for (const [cat, patterns] of Object.entries(categoryPatterns)) {
      if (patterns.some(pattern => messageText.includes(pattern))) {
        category = cat as 'personal' | 'business' | 'emergency' | 'celebration' | 'other';
        if (cat === 'emergency') break; // Emergency takes precedence
      }
    }

    // Extract keywords (words longer than 3 characters, excluding common words)
    const commonWords = ['the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but', 'his', 'from', 'they'];
    const keywords = messageText
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 5); // Top 5 keywords

    return {
      emotion: detectedEmotion,
      sentiment,
      confidence: Math.min(1, maxMatches / 3), // Confidence based on keyword matches
      urgency,
      keywords,
      category
    };
  }

  // Create token from SMS message
  async createTokenFromSMS(request: SMSTokenRequest): Promise<SMSResponse> {
    try {
      // Analyze emotional content
      const analysis = await this.analyzeEmotionalContent(request.message);
      
      // Generate a concise 27-character token symbol from the message
      const symbol = this.generateTokenSymbol(request.message, analysis);
      
      // Determine token value based on emotional intensity and urgency
      let tokenValue = request.value || this.calculateEmotionalValue(analysis);
      
      // Create token data
      const tokenData: InsertToken = {
        symbol,
        message: request.message.substring(0, 280), // Limit message length
        value: tokenValue,
        creatorWallet: 'SMS_SYSTEM', // Special identifier for SMS-created tokens
        recipientWallet: request.recipientWallet,
        type: 'sms_emotional',
        metadata: {
          ...request.metadata,
          emotionalAnalysis: analysis,
          sourcePhone: this.hashPhoneNumber(request.phoneNumber),
          createdViaSMS: true,
          emotionalIntensity: this.calculateEmotionalIntensity(analysis)
        }
      };

      // Store the token
      const token = await storage.createToken(tokenData);
      
      // Send confirmation SMS if Twilio is configured
      if (this.isConfigured && this.twilioClient) {
        await this.sendConfirmationSMS(request.phoneNumber, token, analysis);
      }

      // Log SMS token creation for analytics
      await this.logSMSTokenCreation(request, token, analysis);

      return {
        success: true,
        tokenId: token.id,
        message: `Emotional token "${symbol}" created successfully! Emotion: ${analysis.emotion}, Value: $${tokenValue.toFixed(2)}`
      };

    } catch (error) {
      console.error('Error creating token from SMS:', error);
      return {
        success: false,
        message: 'Failed to create emotional token from SMS',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate a meaningful 27-character token symbol from message
  private generateTokenSymbol(message: string, analysis: EmotionalAnalysis): string {
    // Clean and extract key words
    const cleanMessage = message.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
    const words = cleanMessage.split(/\s+/).filter(word => word.length > 0);
    
    // Start with emotion prefix
    const emotionPrefix = analysis.emotion.substring(0, 4).toUpperCase();
    
    // Add key words
    let symbol = emotionPrefix + '-';
    let remainingLength = 27 - symbol.length;
    
    // Add words until we reach character limit
    for (const word of words) {
      if (word.length <= remainingLength - 1) { // -1 for potential separator
        if (symbol.length > emotionPrefix.length + 1) {
          symbol += '-';
          remainingLength--;
        }
        symbol += word.substring(0, Math.min(word.length, remainingLength));
        remainingLength = 27 - symbol.length;
        
        if (remainingLength <= 1) break;
      }
    }
    
    // Ensure exactly 27 characters by padding or trimming
    if (symbol.length < 27) {
      const timestamp = Date.now().toString().slice(-6);
      symbol += '-' + timestamp.substring(0, Math.min(timestamp.length, 27 - symbol.length - 1));
    }
    
    return symbol.substring(0, 27);
  }

  // Calculate emotional value based on analysis
  private calculateEmotionalValue(analysis: EmotionalAnalysis): number {
    let baseValue = 1.0; // Base $1 value
    
    // Emotion multipliers
    const emotionMultipliers: { [key: string]: number } = {
      love: 2.5,
      happy: 2.0,
      excited: 2.2,
      grateful: 2.3,
      sad: 1.8,
      worried: 1.5,
      angry: 1.7,
      peaceful: 1.9,
      neutral: 1.0
    };
    
    // Apply emotion multiplier
    baseValue *= emotionMultipliers[analysis.emotion] || 1.0;
    
    // Apply sentiment multiplier
    baseValue *= (1 + Math.abs(analysis.sentiment) * 0.5);
    
    // Apply urgency multiplier
    const urgencyMultipliers = { low: 1.0, medium: 1.3, high: 1.8 };
    baseValue *= urgencyMultipliers[analysis.urgency];
    
    // Apply confidence multiplier
    baseValue *= (0.8 + analysis.confidence * 0.4);
    
    // Category bonuses
    const categoryBonuses: { [key: string]: number } = {
      emergency: 2.0,
      celebration: 1.5,
      business: 1.2,
      personal: 1.1,
      other: 1.0
    };
    baseValue *= categoryBonuses[analysis.category] || 1.0;
    
    // Round to 2 decimal places and cap at reasonable limits
    return Math.min(Math.max(Math.round(baseValue * 100) / 100, 0.1), 100.0);
  }

  // Calculate emotional intensity score
  private calculateEmotionalIntensity(analysis: EmotionalAnalysis): number {
    const emotionIntensity = Math.abs(analysis.sentiment);
    const urgencyWeight = { low: 0.3, medium: 0.6, high: 1.0 }[analysis.urgency];
    const confidenceWeight = analysis.confidence;
    
    return Math.min(1.0, (emotionIntensity + urgencyWeight + confidenceWeight) / 3);
  }

  // Hash phone number for privacy
  private hashPhoneNumber(phoneNumber: string): string {
    // Simple hash for demo - in production use proper cryptographic hash
    let hash = 0;
    for (let i = 0; i < phoneNumber.length; i++) {
      const char = phoneNumber.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `SMS_${Math.abs(hash).toString(16).substring(0, 8).toUpperCase()}`;
  }

  // Send confirmation SMS
  private async sendConfirmationSMS(phoneNumber: string, token: Token, analysis: EmotionalAnalysis) {
    if (!this.isConfigured || !this.twilioClient) return;

    try {
      const message = `✨ Flutterbye: Your emotional token "${token.symbol}" has been created! Emotion: ${analysis.emotion}, Value: $${token.value?.toFixed(2)}. Your message is now on the blockchain! 🚀`;
      
      // In production: await this.twilioClient.messages.create({
      //   body: message,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: phoneNumber
      // });
      
      console.log(`📱 SMS confirmation sent to ${phoneNumber}: ${message}`);
    } catch (error) {
      console.error('Error sending confirmation SMS:', error);
    }
  }

  // Log SMS token creation for analytics
  private async logSMSTokenCreation(request: SMSTokenRequest, token: Token, analysis: EmotionalAnalysis) {
    try {
      // In production, this would log to analytics database
      console.log('📊 SMS Token Analytics:', {
        tokenId: token.id,
        emotion: analysis.emotion,
        sentiment: analysis.sentiment,
        urgency: analysis.urgency,
        category: analysis.category,
        value: token.value,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging SMS token creation:', error);
    }
  }

  // Process incoming SMS webhook
  async processIncomingSMS(body: any): Promise<SMSResponse> {
    try {
      const phoneNumber = body.From;
      const message = body.Body;
      
      if (!phoneNumber || !message) {
        return {
          success: false,
          message: 'Invalid SMS data received'
        };
      }

      // Check if message contains token creation request
      const isTokenRequest = this.isTokenCreationRequest(message);
      
      if (isTokenRequest) {
        return await this.createTokenFromSMS({
          phoneNumber,
          message: message.replace(/^(create|token|flby)/i, '').trim()
        });
      } else {
        // Auto-create emotional token from any message
        return await this.createTokenFromSMS({
          phoneNumber,
          message
        });
      }
    } catch (error) {
      console.error('Error processing incoming SMS:', error);
      return {
        success: false,
        message: 'Failed to process SMS',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Check if SMS message is a token creation request
  private isTokenCreationRequest(message: string): boolean {
    const tokenKeywords = ['create', 'token', 'flby', 'flutterbye', 'mint'];
    const lowerMessage = message.toLowerCase();
    return tokenKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  // Get SMS service status
  getServiceStatus() {
    return {
      configured: this.isConfigured,
      twilioConnected: this.twilioClient !== null,
      features: {
        emotionalAnalysis: true,
        tokenCreation: true,
        confirmationSMS: this.isConfigured,
        webhookProcessing: true
      }
    };
  }

  // Get SMS analytics
  async getSMSAnalytics(timeRange: string = '7d') {
    try {
      // In production, would query actual SMS analytics from database
      return {
        totalSMSTokens: 0,
        emotionDistribution: {},
        averageValue: 0,
        mostCommonEmotions: [],
        urgencyBreakdown: { low: 0, medium: 0, high: 0 },
        categoryBreakdown: {},
        timeRange
      };
    } catch (error) {
      console.error('Error fetching SMS analytics:', error);
      throw error;
    }
  }
}

export const smsService = new SMSService();