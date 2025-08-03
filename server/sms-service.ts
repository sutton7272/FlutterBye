// SMS-to-blockchain integration service
import type { DatabaseStorage } from './storage';

let storage: DatabaseStorage | null = null;

async function initializeStorage() {
  try {
    const storageModule = await import('./storage.js');
    storage = storageModule.storage;
  } catch (error) {
    console.log('Storage not available for SMS service');
  }
}

// Initialize storage
initializeStorage();

// Simple event tracking function
const trackBusinessEvent = async (eventType: string, data: any, userId?: string) => {
  console.log('Business event:', { eventType, data, userId });
};

// SMS emotion mapping for AI-powered token creation
export const EMOTION_MAPPING = {
  // Positive emotions
  'love': { emoji: '💕', color: '#ff69b4', value: 0.02 },
  'heart': { emoji: '❤️', color: '#ff0000', value: 0.02 },
  'hug': { emoji: '🤗', color: '#ffa500', value: 0.015 },
  'celebration': { emoji: '🎉', color: '#ffd700', value: 0.025 },
  'congratulations': { emoji: '🎊', color: '#32cd32', value: 0.02 },
  'happiness': { emoji: '😊', color: '#ffeb3b', value: 0.015 },
  'gratitude': { emoji: '🙏', color: '#8bc34a', value: 0.02 },
  'support': { emoji: '💪', color: '#2196f3', value: 0.018 },
  
  // Apologies and comfort
  'sorry': { emoji: '😢', color: '#9c27b0', value: 0.025 },
  'apology': { emoji: '🥺', color: '#673ab7', value: 0.025 },
  'comfort': { emoji: '🫂', color: '#795548', value: 0.02 },
  'sympathy': { emoji: '💙', color: '#2196f3', value: 0.022 },
  
  // Encouragement
  'motivation': { emoji: '🔥', color: '#ff5722', value: 0.02 },
  'encouragement': { emoji: '✨', color: '#e91e63', value: 0.018 },
  'good luck': { emoji: '🍀', color: '#4caf50', value: 0.015 },
  
  // Special occasions
  'birthday': { emoji: '🎂', color: '#ff9800', value: 0.03 },
  'anniversary': { emoji: '💐', color: '#e91e63', value: 0.025 },
  'wedding': { emoji: '💒', color: '#f8bbd9', value: 0.05 },
  'graduation': { emoji: '🎓', color: '#9c27b0', value: 0.03 },
  
  // Default
  'message': { emoji: '💌', color: '#607d8b', value: 0.01 }
};

interface SMSTokenRequest {
  fromPhone: string;
  toPhone: string;
  message: string;
  emotionType?: string;
  isTimeLocked?: boolean;
  unlockDelay?: number; // minutes
  isBurnToRead?: boolean;
  requiresReply?: boolean;
}

class SMSService {
  private twilioClient: any = null;
  private isConfigured = false;

  constructor() {
    this.initializeTwilio();
  }

  private initializeTwilio() {
    try {
      // Check if Twilio credentials are available
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      
      if (accountSid && authToken) {
        // Dynamic import to avoid errors if twilio package isn't installed
        this.configureTwilio(accountSid, authToken);
        this.isConfigured = true;
      } else {
        console.log('Twilio credentials not configured - SMS features disabled');
      }
    } catch (error) {
      console.log('Twilio not available - SMS features disabled');
    }
  }

  private async configureTwilio(accountSid: string, authToken: string) {
    try {
      const { default: twilio } = await import('twilio');
      this.twilioClient = twilio(accountSid, authToken);
      console.log('Twilio configured successfully');
    } catch (error) {
      console.error('Failed to configure Twilio:', error);
    }
  }

  // Analyze message content to determine emotion type
  analyzeMessageEmotion(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Check for emotion keywords
    for (const [emotion, data] of Object.entries(EMOTION_MAPPING)) {
      if (lowerMessage.includes(emotion)) {
        return emotion;
      }
    }
    
    // Additional keyword matching
    const emotionKeywords = {
      'love': ['love you', 'i love', 'love u', 'luv', '💕', '❤️'],
      'sorry': ['sorry', 'apologize', 'my bad', 'forgive me'],
      'celebration': ['congrats', 'celebrate', 'woohoo', 'yay', 'amazing'],
      'support': ['here for you', 'support', 'got your back', 'believe in you'],
      'motivation': ['you got this', 'keep going', 'don\'t give up', 'push through']
    };
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return emotion;
      }
    }
    
    return 'message'; // default
  }

  // Create emotional token from SMS
  async createEmotionalToken(request: SMSTokenRequest): Promise<any> {
    try {
      const emotionType = request.emotionType || this.analyzeMessageEmotion(request.message);
      const emotionData = EMOTION_MAPPING[emotionType as keyof typeof EMOTION_MAPPING] || EMOTION_MAPPING.message;
      
      // Create enhanced message with emotion context
      const enhancedMessage = request.message.length <= 23 
        ? `${emotionData.emoji} ${request.message}`
        : request.message.substring(0, 27);
      
      // Calculate unlock time if time-locked
      const unlockTime = request.isTimeLocked && request.unlockDelay 
        ? new Date(Date.now() + request.unlockDelay * 60000)
        : undefined;
      
      // Create token data
      const tokenData = {
        message: enhancedMessage,
        symbol: 'FLBY-MSG',
        totalSupply: 1,
        availableSupply: 1,
        valuePerToken: emotionData.value.toString(),
        smsOrigin: true,
        senderPhone: this.encryptPhone(request.fromPhone),
        recipientPhone: this.encryptPhone(request.toPhone),
        emotionType,
        isTimeLocked: request.isTimeLocked || false,
        unlocksAt: unlockTime,
        isBurnToRead: request.isBurnToRead || false,
        requiresReply: request.requiresReply || false,
        isPublic: false,
        metadata: {
          emotionData,
          smsContext: {
            originalLength: request.message.length,
            hasEmoji: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu.test(request.message)
          }
        }
      };
      
      // Track business event
      await trackBusinessEvent('sms_token_created', {
        emotionType,
        hasTimeLock: request.isTimeLocked,
        isBurnToRead: request.isBurnToRead,
        messageLength: request.message.length
      });
      
      return tokenData;
    } catch (error) {
      console.error('Failed to create emotional token:', error);
      throw error;
    }
  }

  // Send SMS notification (when Twilio is configured)
  async sendSMSNotification(to: string, message: string): Promise<boolean> {
    if (!this.isConfigured || !this.twilioClient) {
      console.log('SMS not configured - would send:', { to, message });
      return false;
    }
    
    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });
      console.log('SMS sent successfully:', result.sid);
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  // Process incoming SMS webhook
  async processIncomingSMS(body: any): Promise<any> {
    try {
      const { From, To, Body } = body;
      
      // Create emotional token from SMS
      const tokenRequest: SMSTokenRequest = {
        fromPhone: From,
        toPhone: To,
        message: Body,
        isTimeLocked: Body.toLowerCase().includes('later'),
        isBurnToRead: Body.toLowerCase().includes('private'),
        requiresReply: Body.toLowerCase().includes('reply')
      };
      
      const tokenData = await this.createEmotionalToken(tokenRequest);
      
      // Send confirmation SMS
      const confirmationMessage = `🚀 Your emotional token "${tokenData.message}" has been created on Flutterbye! Value: ${tokenData.valuePerToken} SOL`;
      await this.sendSMSNotification(From, confirmationMessage);
      
      return tokenData;
    } catch (error) {
      console.error('Failed to process incoming SMS:', error);
      throw error;
    }
  }

  // Simple phone encryption for privacy
  private encryptPhone(phone: string): string {
    // Simple obfuscation - in production, use proper encryption
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '***-***-$3');
  }

  // Get SMS analytics
  async getSMSAnalytics(): Promise<any> {
    try {
      if (!storage || !storage.getAllTokensWithOptions) {
        return {
          totalSMSTokens: 0,
          emotionBreakdown: {},
          averageValue: 0,
          timeLockUsage: 0,
          burnToReadUsage: 0
        };
      }

      const smsTokens = await storage.getAllTokensWithOptions({
        limit: 1000,
        offset: 0
      });
      
      const smsOriginTokens = smsTokens.filter((token: any) => token.smsOrigin);
      
      const emotionCounts = smsOriginTokens.reduce((acc: any, token: any) => {
        const emotion = token.emotionType || 'unknown';
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
      }, {});
      
      return {
        totalSMSTokens: smsOriginTokens.length,
        emotionBreakdown: emotionCounts,
        averageValue: smsOriginTokens.reduce((sum: number, token: any) => sum + parseFloat(token.valuePerToken || '0'), 0) / smsOriginTokens.length,
        timeLockUsage: smsOriginTokens.filter((token: any) => token.isTimeLocked).length,
        burnToReadUsage: smsOriginTokens.filter((token: any) => token.isBurnToRead).length
      };
    } catch (error) {
      console.error('Failed to get SMS analytics:', error);
      return null;
    }
  }
}

export const smsService = new SMSService();