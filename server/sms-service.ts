import { db } from "./db";
import { 
  smsMessages, 
  phoneWalletMappings, 
  emotionalInteractions, 
  smsDeliveries,
  tokens,
  users
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

interface EmotionMapping {
  keywords: string[];
  type: string;
  description: string;
  defaultImage: string;
}

export class SmsService {
  private emotionMap: EmotionMapping[] = [
    {
      keywords: ["hug", "hugs", "hugging", "embrace", "comfort"],
      type: "hug",
      description: "A warm digital embrace",
      defaultImage: "🫂"
    },
    {
      keywords: ["love", "heart", "hearts", "❤️", "💕", "💖"],
      type: "heart",
      description: "Love and affection",
      defaultImage: "💕"
    },
    {
      keywords: ["sorry", "apologize", "forgive", "mistake", "apology"],
      type: "apology",
      description: "A heartfelt apology",
      defaultImage: "🙏"
    },
    {
      keywords: ["congrats", "congratulations", "celebrate", "celebration", "🎉"],
      type: "celebration",
      description: "Celebration and joy",
      defaultImage: "🎉"
    },
    {
      keywords: ["support", "thinking of you", "here for you", "strength"],
      type: "support",
      description: "Support and encouragement",
      defaultImage: "💪"
    },
    {
      keywords: ["miss", "missing", "distance", "away"],
      type: "longing",
      description: "Missing someone special",
      defaultImage: "💭"
    }
  ];

  // Process incoming SMS message
  async processIncomingSms(fromPhone: string, toPhone: string, messageBody: string, twilioSid?: string) {
    try {
      // Detect emotion type from message content
      const emotionType = this.detectEmotion(messageBody);
      
      // Check if recipient has a registered wallet
      const recipientWallet = await this.findWalletForPhone(toPhone);
      
      // Create SMS message record
      const [smsMessage] = await db
        .insert(smsMessages)
        .values({
          fromPhone: this.encryptPhone(fromPhone),
          toPhone: this.encryptPhone(toPhone),
          messageBody: messageBody,
          emotionType,
          status: "pending",
          twilioSid,
          recipientWallet: recipientWallet?.walletAddress || null
        })
        .returning();

      // If recipient has wallet, mint token immediately
      if (recipientWallet) {
        await this.mintEmotionalToken(smsMessage.id, messageBody, emotionType, recipientWallet.walletAddress);
      } else {
        // Send onboarding SMS to recipient
        await this.sendOnboardingSms(toPhone, smsMessage.id);
      }

      return smsMessage;
    } catch (error) {
      console.error("Error processing SMS:", error);
      throw error;
    }
  }

  // Detect emotion type from message content
  private detectEmotion(messageBody: string): string {
    const lowerMessage = messageBody.toLowerCase();
    
    for (const emotion of this.emotionMap) {
      for (const keyword of emotion.keywords) {
        if (lowerMessage.includes(keyword)) {
          return emotion.type;
        }
      }
    }
    
    return "message"; // Default type for general messages
  }

  // Find wallet address for phone number
  private async findWalletForPhone(phone: string) {
    try {
      const encryptedPhone = this.encryptPhone(phone);
      const [mapping] = await db
        .select()
        .from(phoneWalletMappings)
        .where(eq(phoneWalletMappings.phoneNumber, encryptedPhone))
        .limit(1);
      
      return mapping || null;
    } catch (error) {
      console.error("Error finding wallet for phone:", error);
      return null;
    }
  }

  // Mint emotional token from SMS
  private async mintEmotionalToken(smsMessageId: string, message: string, emotionType: string, recipientWallet: string) {
    try {
      // Truncate message to 27 characters for token
      const tokenMessage = message.length > 27 ? message.substring(0, 27) : message;
      
      // Generate mock mint address (in real implementation, use Solana)
      const mintAddress = `mint_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create token with SMS features
      const [token] = await db
        .insert(tokens)
        .values({
          message: tokenMessage,
          symbol: "FlBY-MSG",
          mintAddress,
          creatorId: "sms-system", // System-generated
          totalSupply: 1,
          availableSupply: 1,
          smsOrigin: true,
          emotionType,
          isTimeLocked: emotionType === "apology" || emotionType === "support", // Some emotions are time-locked
          unlocksAt: emotionType === "apology" ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null, // 24 hours for apologies
          isBurnToRead: emotionType === "heart" || emotionType === "hug", // Intimate emotions require burning
          isReplyGated: emotionType === "support" || emotionType === "longing", // Some require replies
        })
        .returning();

      // Update SMS message with token ID
      await db
        .update(smsMessages)
        .set({ 
          tokenId: token.id, 
          status: "minted",
          processedAt: new Date()
        })
        .where(eq(smsMessages.id, smsMessageId));

      // Create delivery record
      const deliveryUrl = `https://flutterbye.io/view?id=${token.id}`;
      await db
        .insert(smsDeliveries)
        .values({
          smsMessageId,
          tokenId: token.id,
          recipientPhone: this.encryptPhone(recipientWallet), // Using wallet as recipient identifier
          deliveryUrl,
          notificationSent: true
        });

      // Send notification to recipient
      await this.sendTokenNotification(recipientWallet, token, deliveryUrl);

      return token;
    } catch (error) {
      console.error("Error minting emotional token:", error);
      throw error;
    }
  }

  // Send onboarding SMS for non-wallet users
  private async sendOnboardingSms(phone: string, smsMessageId: string) {
    try {
      const onboardingMessage = `🔗 You've received a message on the blockchain! Create your free crypto wallet to view it: https://flutterbye.io/onboard?sms=${smsMessageId}`;
      
      // TODO: Send via Twilio
      console.log(`Sending onboarding SMS to ${phone}: ${onboardingMessage}`);
      
      // Update SMS status
      await db
        .update(smsMessages)
        .set({ 
          status: "delivered",
          deliveryStatus: "sent"
        })
        .where(eq(smsMessages.id, smsMessageId));
        
    } catch (error) {
      console.error("Error sending onboarding SMS:", error);
    }
  }

  // Send token notification
  private async sendTokenNotification(recipientWallet: string, token: any, deliveryUrl: string) {
    try {
      const emotionEmoji = this.getEmotionEmoji(token.emotionType);
      const lockStatus = token.isTimeLocked ? "🔒 Time-locked" : "";
      const burnStatus = token.isBurnToRead ? "🔥 Burn to read" : "";
      
      const notificationMessage = `${emotionEmoji} You've received an emotional token: "${token.message}" ${lockStatus} ${burnStatus}\n\n🔗 ${deliveryUrl}`;
      
      // TODO: Send SMS notification
      console.log(`Token notification for ${recipientWallet}: ${notificationMessage}`);
      
    } catch (error) {
      console.error("Error sending token notification:", error);
    }
  }

  // Register phone number with wallet
  async registerPhoneWallet(phone: string, walletAddress: string) {
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      const [mapping] = await db
        .insert(phoneWalletMappings)
        .values({
          phoneNumber: this.encryptPhone(phone),
          walletAddress,
          verificationCode,
          verificationExpiry,
          isVerified: false
        })
        .returning();

      // Send verification SMS
      const verificationMessage = `Your Flutterbye verification code: ${verificationCode}\n\nThis allows you to receive emotional tokens via text message.`;
      
      // TODO: Send via Twilio
      console.log(`Verification SMS to ${phone}: ${verificationMessage}`);
      
      return mapping;
    } catch (error) {
      console.error("Error registering phone wallet:", error);
      throw error;
    }
  }

  // Verify phone number
  async verifyPhone(phone: string, code: string) {
    try {
      const encryptedPhone = this.encryptPhone(phone);
      const [mapping] = await db
        .select()
        .from(phoneWalletMappings)
        .where(eq(phoneWalletMappings.phoneNumber, encryptedPhone))
        .limit(1);

      if (!mapping) {
        throw new Error("Phone number not found");
      }

      if (mapping.verificationCode !== code) {
        throw new Error("Invalid verification code");
      }

      if (mapping.verificationExpiry && mapping.verificationExpiry < new Date()) {
        throw new Error("Verification code expired");
      }

      // Verify the mapping
      await db
        .update(phoneWalletMappings)
        .set({
          isVerified: true,
          verifiedAt: new Date(),
          verificationCode: null,
          verificationExpiry: null
        })
        .where(eq(phoneWalletMappings.id, mapping.id));

      return { success: true, walletAddress: mapping.walletAddress };
    } catch (error) {
      console.error("Error verifying phone:", error);
      throw error;
    }
  }

  // Handle token interactions (burn to read, reply, etc.)
  async handleTokenInteraction(tokenId: string, userId: string, interactionType: string, data?: any) {
    try {
      const [interaction] = await db
        .insert(emotionalInteractions)
        .values({
          tokenId,
          userId,
          interactionType,
          interactionData: data || {},
          burnTransactionSig: data?.burnTransactionSig || null
        })
        .returning();

      // If it's a burn-to-read interaction, update token status
      if (interactionType === "burn_to_read") {
        // TODO: Process burn transaction on Solana
        console.log(`Token ${tokenId} burned to read by user ${userId}`);
      }

      // If it's a reply, handle reply logic
      if (interactionType === "reply" && data?.replyMessage) {
        await this.handleTokenReply(tokenId, userId, data.replyMessage);
      }

      return interaction;
    } catch (error) {
      console.error("Error handling token interaction:", error);
      throw error;
    }
  }

  // Handle token reply
  private async handleTokenReply(tokenId: string, userId: string, replyMessage: string) {
    try {
      // Get original token and sender info
      const [token] = await db
        .select()
        .from(tokens)
        .where(eq(tokens.id, tokenId))
        .limit(1);

      if (!token || !token.senderPhone) {
        return;
      }

      // Send reply notification to original sender
      const replyNotification = `💬 Reply to your message "${token.message}": ${replyMessage}\n\n🔗 View conversation: https://flutterbye.io/conversation?token=${tokenId}`;
      
      // TODO: Send SMS reply
      console.log(`Reply notification: ${replyNotification}`);
      
    } catch (error) {
      console.error("Error handling token reply:", error);
    }
  }

  // Get emotion emoji
  private getEmotionEmoji(emotionType: string): string {
    const emotion = this.emotionMap.find(e => e.type === emotionType);
    return emotion?.defaultImage || "💌";
  }

  // Simple phone encryption (in production, use proper encryption)
  private encryptPhone(phone: string): string {
    // Remove formatting and encrypt
    const cleanPhone = phone.replace(/\D/g, '');
    // TODO: Implement proper encryption
    return `enc_${Buffer.from(cleanPhone).toString('base64')}`;
  }

  // Get SMS analytics
  async getSmsAnalytics() {
    try {
      const totalMessages = await db
        .select({ count: smsMessages.id })
        .from(smsMessages);

      const emotionBreakdown = await db
        .select({
          emotionType: smsMessages.emotionType,
          count: sql<number>`count(*)::int`
        })
        .from(smsMessages)
        .groupBy(smsMessages.emotionType);

      const recentMessages = await db
        .select()
        .from(smsMessages)
        .orderBy(desc(smsMessages.createdAt))
        .limit(10);

      return {
        totalMessages: totalMessages.length,
        emotionBreakdown,
        recentMessages: recentMessages.map(msg => ({
          id: msg.id,
          emotionType: msg.emotionType,
          status: msg.status,
          createdAt: msg.createdAt
        }))
      };
    } catch (error) {
      console.error("Error getting SMS analytics:", error);
      throw error;
    }
  }
}

export const smsService = new SmsService();