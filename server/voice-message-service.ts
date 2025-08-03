import { storage } from './storage';

interface VoiceMessage {
  id: string;
  audioUrl: string;
  duration: number;
  type: 'voice' | 'music';
  transcription?: string;
  tokenId?: string;
  chatMessageId?: string;
  createdAt: Date;
  userId: string;
}

interface VoiceAnalysis {
  emotion: string;
  confidence: number;
  transcription: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  voiceCharacteristics: {
    pitch: 'high' | 'medium' | 'low';
    speed: 'fast' | 'medium' | 'slow';
    energy: 'high' | 'medium' | 'low';
  };
}

class VoiceMessageService {
  constructor() {
    // Using the global storage instance
  }

  // Process uploaded voice message
  async processVoiceMessage(audioData: Buffer, userId: string, type: 'voice' | 'music'): Promise<VoiceMessage> {
    try {
      // In a real implementation, you would:
      // 1. Upload audio to cloud storage (S3, Google Cloud Storage, etc.)
      // 2. Get transcription from speech-to-text service
      // 3. Analyze voice characteristics
      
      const voiceMessage: VoiceMessage = {
        id: this.generateId(),
        audioUrl: await this.uploadAudio(audioData, userId),
        duration: await this.getAudioDuration(audioData),
        type,
        transcription: type === 'voice' ? await this.getTranscription(audioData) : undefined,
        createdAt: new Date(),
        userId
      };

      // Store in database (you would need to add voice_messages table to schema)
      await this.storeVoiceMessage(voiceMessage);

      return voiceMessage;
    } catch (error) {
      console.error('Failed to process voice message:', error);
      throw error;
    }
  }

  // Analyze voice message for emotion and characteristics using OpenAI
  async analyzeVoiceMessage(audioData: Buffer): Promise<VoiceAnalysis> {
    try {
      const { openaiVoiceService } = await import("./openai-voice-service");
      const analysis = await openaiVoiceService.processVoiceMessage(audioData, 'system', 'voice');
      
      return {
        emotion: analysis.emotion,
        confidence: analysis.confidence,
        transcription: analysis.transcription,
        sentiment: analysis.sentiment,
        voiceCharacteristics: {
          pitch: 'medium',
          speed: 'medium',
          energy: 'high'
        }
      };

      return mockAnalysis;
    } catch (error) {
      console.error('Failed to analyze voice message:', error);
      throw error;
    }
  }

  // Attach voice message to token
  async attachVoiceToToken(tokenId: string, voiceMessageId: string): Promise<void> {
    try {
      // Update token with voice message reference
      await this.storage.updateToken(tokenId, {
        voiceMessageId,
        hasVoiceMessage: true
      });
    } catch (error) {
      console.error('Failed to attach voice to token:', error);
      throw error;
    }
  }

  // Attach voice message to chat message
  async attachVoiceToChat(chatMessageId: string, voiceMessageId: string): Promise<void> {
    try {
      // Update chat message with voice message reference
      // This would require updating the chat message schema
      console.log('Attaching voice to chat message:', chatMessageId, voiceMessageId);
    } catch (error) {
      console.error('Failed to attach voice to chat:', error);
      throw error;
    }
  }

  // Get voice messages for a token
  async getTokenVoiceMessages(tokenId: string): Promise<VoiceMessage[]> {
    try {
      // Query voice messages by token ID
      return await this.getVoiceMessagesByToken(tokenId);
    } catch (error) {
      console.error('Failed to get token voice messages:', error);
      return [];
    }
  }

  // Get voice messages for a chat message
  async getChatVoiceMessages(chatMessageId: string): Promise<VoiceMessage[]> {
    try {
      // Query voice messages by chat message ID
      return await this.getVoiceMessagesByChat(chatMessageId);
    } catch (error) {
      console.error('Failed to get chat voice messages:', error);
      return [];
    }
  }

  // Private helper methods
  private generateId(): string {
    return `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async uploadAudio(audioData: Buffer, userId: string): Promise<string> {
    // Mock implementation - in production, upload to cloud storage
    // For now, we'll create a base64 data URL (not recommended for production)
    const base64Audio = audioData.toString('base64');
    return `data:audio/wav;base64,${base64Audio}`;
  }

  private async getAudioDuration(audioData: Buffer): Promise<number> {
    // Mock duration calculation
    // In production, you would use audio processing libraries like ffprobe
    return Math.random() * 50 + 10; // 10-60 seconds
  }

  private async getTranscription(audioData: Buffer): Promise<string> {
    // Mock transcription - in production use speech-to-text service
    const mockTranscriptions = [
      "Thank you so much for your support!",
      "I hope you have a wonderful day ahead.",
      "Sending you lots of love and positive energy.",
      "This message comes from the heart.",
      "I'm grateful for everything you do.",
      "Hope this brightens your day!"
    ];
    
    return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  }

  private detectMockEmotion(): string {
    const emotions = ['gratitude', 'love', 'joy', 'encouragement', 'support', 'celebration'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  }

  private async storeVoiceMessage(voiceMessage: VoiceMessage): Promise<void> {
    // Mock storage - in production, store in database
    console.log('Storing voice message:', voiceMessage.id);
  }

  private async getVoiceMessagesByToken(tokenId: string): Promise<VoiceMessage[]> {
    // Mock query - in production, query database
    return [];
  }

  private async getVoiceMessagesByChat(chatMessageId: string): Promise<VoiceMessage[]> {
    // Mock query - in production, query database
    return [];
  }

  // Enhanced features for different platforms
  async createVoiceToken(voiceAnalysis: VoiceAnalysis, userId: string): Promise<any> {
    try {
      // Create a special voice-enabled token
      const tokenData = {
        message: `🎵 ${voiceAnalysis.transcription}`,
        symbol: 'FLBY-VOICE',
        totalSupply: 1,
        availableSupply: 1,
        valuePerToken: this.calculateVoiceValue(voiceAnalysis),
        hasVoiceMessage: true,
        voiceEmotion: voiceAnalysis.emotion,
        voiceConfidence: voiceAnalysis.confidence,
        voiceCharacteristics: voiceAnalysis.voiceCharacteristics,
        metadata: {
          type: 'voice_token',
          transcription: voiceAnalysis.transcription,
          sentiment: voiceAnalysis.sentiment,
          voiceFeatures: voiceAnalysis.voiceCharacteristics
        }
      };

      return tokenData;
    } catch (error) {
      console.error('Failed to create voice token:', error);
      throw error;
    }
  }

  private calculateVoiceValue(analysis: VoiceAnalysis): string {
    let baseValue = 0.015; // Base value for voice messages
    
    // Bonus for high confidence
    if (analysis.confidence > 0.9) baseValue += 0.005;
    
    // Bonus for positive emotions
    if (['gratitude', 'love', 'joy', 'celebration'].includes(analysis.emotion)) {
      baseValue += 0.01;
    }
    
    // Bonus for high energy voice
    if (analysis.voiceCharacteristics.energy === 'high') {
      baseValue += 0.005;
    }
    
    return baseValue.toString();
  }
}

export { VoiceMessageService, type VoiceMessage, type VoiceAnalysis };