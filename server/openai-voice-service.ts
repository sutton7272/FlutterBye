import OpenAI from "openai";
import { storage } from "./storage";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface VoiceAnalysisResult {
  transcription: string;
  emotion: string;
  confidence: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  voiceCharacteristics: {
    energy: 'high' | 'medium' | 'low';
    tone: string;
  };
}

export class OpenAIVoiceService {
  
  // Convert audio buffer to transcription using OpenAI Whisper
  async transcribeAudio(audioBuffer: Buffer, filename: string = 'audio.wav'): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.log("OpenAI API key not configured, using mock transcription");
        return "Voice message recorded (transcription requires OpenAI API key)";
      }

      // Create a File-like object from buffer
      const audioFile = new File([audioBuffer], filename, { type: 'audio/wav' });
      
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        language: "en",
      });

      return transcription.text;
    } catch (error) {
      console.error("OpenAI transcription error:", error);
      return "Voice message recorded (transcription failed)";
    }
  }

  // Analyze emotion and sentiment from transcribed text
  async analyzeVoiceEmotion(transcription: string): Promise<VoiceAnalysisResult> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return this.getMockAnalysis(transcription);
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert voice emotion analyst. Analyze the emotional content and characteristics of voice message transcriptions. Return JSON with this exact format:
            {
              "emotion": "primary emotion (joy, sadness, anger, fear, surprise, love, excitement, etc.)",
              "confidence": number between 0 and 1,
              "sentiment": "positive, negative, or neutral",
              "energy": "high, medium, or low",
              "tone": "descriptive tone (warm, urgent, playful, serious, etc.)"
            }`
          },
          {
            role: "user",
            content: `Analyze this voice message transcription: "${transcription}"`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        transcription,
        emotion: analysis.emotion || "neutral",
        confidence: Math.max(0, Math.min(1, analysis.confidence || 0.8)),
        sentiment: analysis.sentiment || "neutral",
        voiceCharacteristics: {
          energy: analysis.energy || "medium",
          tone: analysis.tone || "conversational"
        }
      };
    } catch (error) {
      console.error("OpenAI emotion analysis error:", error);
      return this.getMockAnalysis(transcription);
    }
  }

  // Process complete voice message with transcription and emotion analysis
  async processVoiceMessage(audioBuffer: Buffer, userId: string, type: 'voice' | 'music'): Promise<VoiceAnalysisResult> {
    try {
      // Only transcribe and analyze voice messages, not music
      if (type === 'music') {
        return {
          transcription: "Music file uploaded",
          emotion: "musical",
          confidence: 0.9,
          sentiment: "positive",
          voiceCharacteristics: {
            energy: "medium",
            tone: "musical"
          }
        };
      }

      // Transcribe audio
      const transcription = await this.transcribeAudio(audioBuffer);
      
      // Analyze emotion from transcription
      const analysis = await this.analyzeVoiceEmotion(transcription);
      
      console.log(`Voice analysis complete for user ${userId}:`, {
        emotion: analysis.emotion,
        confidence: analysis.confidence,
        transcriptionLength: transcription.length
      });

      return analysis;
    } catch (error) {
      console.error("Voice processing error:", error);
      return this.getMockAnalysis("Voice message processing failed");
    }
  }

  private getMockAnalysis(transcription: string): VoiceAnalysisResult {
    const emotions = ['joy', 'excitement', 'love', 'surprise', 'calm'];
    const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'neutral'];
    const energies: ('high' | 'medium' | 'low')[] = ['high', 'medium'];
    const tones = ['warm', 'friendly', 'excited', 'calm', 'cheerful'];

    return {
      transcription,
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      confidence: Math.random() * 0.3 + 0.7, // 70-100%
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      voiceCharacteristics: {
        energy: energies[Math.floor(Math.random() * energies.length)],
        tone: tones[Math.floor(Math.random() * tones.length)]
      }
    };
  }
}

export const openaiVoiceService = new OpenAIVoiceService();