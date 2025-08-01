import twilio from 'twilio';

// SMS Integration Service for +1 (844) BYE-TEXT
export interface SMSMessage {
  from: string;
  to: string;
  body: string;
  emotionType?: 'hug' | 'heart' | 'apology' | 'celebration' | 'encouragement';
  isTimeLocked?: boolean;
  unlockDuration?: number; // hours
  isBurnToRead?: boolean;
  requiresReply?: boolean;
}

export interface EmotionAnalysis {
  primary: 'hug' | 'heart' | 'apology' | 'celebration' | 'encouragement';
  confidence: number;
  suggestedFeatures: {
    timeLocked: boolean;
    burnToRead: boolean;
    replyGated: boolean;
  };
}

export class SMSService {
  private client: twilio.Twilio | null = null;
  private flutteryeNumber = '+18442938398'; // +1 (844) BYE-TEXT

  constructor() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
  }

  // AI-powered emotion detection from message content
  analyzeEmotion(messageBody: string): EmotionAnalysis {
    const lowerBody = messageBody.toLowerCase();
    
    // Simple keyword-based emotion detection (can be enhanced with ML)
    const emotions = {
      hug: ['hug', 'comfort', 'support', 'here for you', 'thinking of you'],
      heart: ['love', 'heart', 'care', 'miss you', 'valentine', 'romantic'],
      apology: ['sorry', 'apologize', 'forgive', 'my bad', 'mistake', 'regret'],
      celebration: ['congrats', 'celebrate', 'party', 'achievement', 'success', 'birthday'],
      encouragement: ['you got this', 'believe', 'strong', 'proud', 'inspiration', 'motivation']
    };

    let bestMatch: keyof typeof emotions = 'encouragement';
    let bestScore = 0;

    for (const [emotion, keywords] of Object.entries(emotions)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (lowerBody.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = emotion as keyof typeof emotions;
      }
    }

    // Determine special features based on emotion
    const suggestedFeatures = {
      timeLocked: bestMatch === 'apology', // Apologies unlock after 24h
      burnToRead: ['heart', 'apology'].includes(bestMatch), // Intimate messages
      replyGated: bestMatch === 'celebration' // Celebrations might need confirmation
    };

    return {
      primary: bestMatch,
      confidence: bestScore > 0 ? Math.min(bestScore * 0.3, 1) : 0.1,
      suggestedFeatures
    };
  }

  // Process incoming SMS to +1 (844) BYE-TEXT
  async processIncomingSMS(smsData: {
    From: string;
    To: string;
    Body: string;
    MessageSid: string;
  }): Promise<{
    success: boolean;
    tokenId?: string;
    error?: string;
  }> {
    try {
      // Analyze emotion and determine token type
      const analysis = this.analyzeEmotion(smsData.Body);
      
      // Truncate message to 27 characters for token
      const tokenMessage = smsData.Body.substring(0, 27);
      
      // Create emotional token based on analysis
      const tokenData = {
        message: tokenMessage,
        totalSupply: 1, // Whole number only
        availableSupply: 1,
        smsOrigin: true,
        senderPhone: this.encryptPhone(smsData.From),
        emotionType: analysis.primary,
        isTimeLocked: analysis.suggestedFeatures.timeLocked,
        unlocksAt: analysis.suggestedFeatures.timeLocked ? 
          new Date(Date.now() + 24 * 60 * 60 * 1000) : null, // 24h for apologies
        isBurnToRead: analysis.suggestedFeatures.burnToRead,
        isReplyGated: analysis.suggestedFeatures.replyGated,
        isPublic: false, // SMS tokens are private by default
        creatorId: await this.getOrCreateUserFromPhone(smsData.From)
      };

      // This would integrate with the token creation service
      // const token = await storage.createToken(tokenData);
      
      return {
        success: true,
        // tokenId: token.id
      };
      
    } catch (error) {
      console.error('SMS processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'SMS processing failed'
      };
    }
  }

  // Send SMS notification about token creation
  async sendTokenNotification(phoneNumber: string, tokenData: {
    message: string;
    emotionType: string;
    viewUrl: string;
  }): Promise<boolean> {
    if (!this.client) {
      console.warn('Twilio not configured - SMS notification skipped');
      return false;
    }

    try {
      const messageBody = `You received a ${tokenData.emotionType} token: "${tokenData.message}". View at: ${tokenData.viewUrl}`;
      
      await this.client.messages.create({
        body: messageBody,
        from: this.flutteryeNumber,
        to: phoneNumber
      });
      
      return true;
    } catch (error) {
      console.error('SMS notification error:', error);
      return false;
    }
  }

  // Encrypt phone number for privacy
  private encryptPhone(phoneNumber: string): string {
    // Simple encryption - in production use proper encryption
    return Buffer.from(phoneNumber).toString('base64');
  }

  // Decrypt phone number
  private decryptPhone(encryptedPhone: string): string {
    return Buffer.from(encryptedPhone, 'base64').toString();
  }

  // Get or create user from phone number
  private async getOrCreateUserFromPhone(phoneNumber: string): Promise<string> {
    // This would integrate with user management
    // Check if phone is registered to a wallet
    // If not, create temporary user or prompt for wallet registration
    return 'temp_user_' + Date.now();
  }

  // Webhook endpoint for Twilio
  handleTwilioWebhook(req: any, res: any) {
    const twiml = new twilio.twiml.MessagingResponse();
    
    // Process the SMS
    this.processIncomingSMS({
      From: req.body.From,
      To: req.body.To,
      Body: req.body.Body,
      MessageSid: req.body.MessageSid
    }).then(result => {
      if (result.success) {
        twiml.message('Your message has been tokenized! Check your wallet for your FlBY-MSG token.');
      } else {
        twiml.message('Sorry, there was an error processing your message. Please try again.');
      }
    });

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  }
}

export const smsService = new SMSService();