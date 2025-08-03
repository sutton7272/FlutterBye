import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY not found. AI features will use fallback responses.");
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "fallback"
});

export interface AIEmotionAnalysis {
  primaryEmotion: string;
  emotionIntensity: number;
  viralPotential: number;
  sentimentScore: number;
  emotionalTriggers: string[];
  suggestedOptimizations: string[];
  blockchainValue: number;
  timeToViralPeak: number;
  targetDemographics: string[];
  culturalResonance: number;
}

export interface AIViralPrediction {
  viralCoefficient: number;
  expectedReach: number;
  peakTimestamp: Date;
  engagementRate: number;
  shareVelocity: number;
  emotionalContagion: number;
}

export interface AICampaignResult {
  campaign: {
    name: string;
    description: string;
    targetAudience: string;
    messageTemplate: string;
    estimatedReach: number;
    roi: string;
    emotionalTriggers: string[];
    optimalTiming: string;
    suggestedHashtags: string[];
    callToAction: string;
  };
  strategy: {
    phase1: string;
    phase2: string;
    phase3: string;
  };
}

export class OpenAIService {
  private isAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "fallback";
  }

  async analyzeEmotion(text: string, userId?: string): Promise<{
    analysis: AIEmotionAnalysis;
    viralPrediction: AIViralPrediction;
  }> {
    if (!this.isAvailable()) {
      // Return sophisticated fallback analysis
      return this.getFallbackEmotionAnalysis(text);
    }

    try {
      const prompt = `Analyze this message for emotional content, viral potential, and blockchain value:

Message: "${text}"

Provide a comprehensive analysis in JSON format with:
1. Primary emotion (love, joy, gratitude, empathy, hope, surprise, inspiration, excitement)
2. Emotion intensity (0-10 scale)
3. Viral potential (0-1 scale) 
4. Sentiment score (-1 to 1)
5. Emotional triggers (array of keywords that evoke emotion)
6. Suggested optimizations (3-5 specific improvements)
7. Blockchain value (estimated SOL value 0.01-0.1)
8. Time to viral peak (hours as decimal)
9. Target demographics (array of audience segments)
10. Cultural resonance (0-1 scale)

Also predict viral metrics:
- Viral coefficient (0-5 scale)
- Expected reach (number of users)
- Peak timestamp (hours from now)
- Engagement rate (percentage)
- Share velocity (shares per minute)
- Emotional contagion (0-1 scale)

Return JSON only.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert AI analyzing emotional content for blockchain messaging. Provide detailed, accurate analysis in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      // Structure the response to match expected format
      const analysis: AIEmotionAnalysis = {
        primaryEmotion: result.primaryEmotion || 'joy',
        emotionIntensity: Math.min(10, Math.max(0, result.emotionIntensity || 5)),  
        viralPotential: Math.min(1, Math.max(0, result.viralPotential || 0.5)),
        sentimentScore: Math.min(1, Math.max(-1, result.sentimentScore || 0.3)),
        emotionalTriggers: result.emotionalTriggers || [],
        suggestedOptimizations: result.suggestedOptimizations || [],
        blockchainValue: Math.min(0.1, Math.max(0.01, result.blockchainValue || 0.025)),
        timeToViralPeak: Math.max(0.5, result.timeToViralPeak || 4),
        targetDemographics: result.targetDemographics || ['general'],
        culturalResonance: Math.min(1, Math.max(0, result.culturalResonance || 0.7))
      };

      const viralPrediction: AIViralPrediction = {
        viralCoefficient: Math.min(5, Math.max(0, result.viralCoefficient || 1.2)),
        expectedReach: Math.max(100, result.expectedReach || 5000),
        peakTimestamp: new Date(Date.now() + (result.peakTimestamp || 4) * 60 * 60 * 1000),
        engagementRate: Math.min(100, Math.max(0, result.engagementRate || 15)),
        shareVelocity: Math.max(0, result.shareVelocity || 25),
        emotionalContagion: Math.min(1, Math.max(0, result.emotionalContagion || 0.6))
      };

      return { analysis, viralPrediction };

    } catch (error) {
      console.error('OpenAI emotion analysis error:', error);
      return this.getFallbackEmotionAnalysis(text);
    }
  }

  async generateCampaign(params: {
    targetAudience: string;
    campaignGoal: string;
    emotionIntensity: number;
    brandVoice: string;
  }): Promise<AICampaignResult> {
    if (!this.isAvailable()) {
      return this.getFallbackCampaign(params);
    }

    try {
      const prompt = `Create a comprehensive viral marketing campaign for FlutterWave blockchain messaging:

Target Audience: ${params.targetAudience}
Campaign Goal: ${params.campaignGoal}
Emotion Intensity: ${params.emotionIntensity}/10
Brand Voice: ${params.brandVoice}

Generate a complete campaign strategy in JSON format with:
1. Campaign name and description
2. Message template with emotional hooks
3. Estimated reach (realistic number)
4. ROI projection (percentage)
5. Key emotional triggers to use
6. Optimal timing recommendations
7. Suggested hashtags (5-8 relevant tags)
8. Strong call-to-action
9. 3-phase implementation strategy

Focus on blockchain/crypto audience, viral potential, and emotional connection.
Return JSON only.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a viral marketing expert specializing in blockchain and cryptocurrency campaigns. Create compelling, authentic campaigns that drive engagement."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        campaign: {
          name: result.name || 'FlutterWave Viral Campaign',
          description: result.description || 'AI-generated viral marketing campaign',
          targetAudience: params.targetAudience,
          messageTemplate: result.messageTemplate || 'Transform your emotions into blockchain value!',
          estimatedReach: result.estimatedReach || 50000,
          roi: result.roi || '320%',
          emotionalTriggers: result.emotionalTriggers || ['excitement', 'opportunity', 'innovation'],
          optimalTiming: result.optimalTiming || 'Evenings 7-9pm, Weekends',
          suggestedHashtags: result.suggestedHashtags || ['#FlutterWave', '#BlockchainMessaging', '#ViralCrypto'],
          callToAction: result.callToAction || 'Start creating emotional blockchain messages today!'
        },
        strategy: {
          phase1: result.phase1 || 'Build awareness through targeted messaging',
          phase2: result.phase2 || 'Amplify engagement with community challenges', 
          phase3: result.phase3 || 'Scale through viral multiplier effects'
        }
      };

    } catch (error) {
      console.error('OpenAI campaign generation error:', error);
      return this.getFallbackCampaign(params);
    }
  }

  async optimizeMessage(message: string, targetEmotion?: string): Promise<{
    optimizedMessage: string;
    improvements: string[];
    viralScore: number;
    emotionalImpact: number;
  }> {
    if (!this.isAvailable()) {
      return {
        optimizedMessage: message + " ✨",
        improvements: ["Add more emotional keywords", "Include call-to-action", "Use visual emojis"],
        viralScore: 7.5,
        emotionalImpact: 8.2
      };
    }

    try {
      const prompt = `Optimize this message for maximum viral potential and emotional impact:

Original: "${message}"
${targetEmotion ? `Target Emotion: ${targetEmotion}` : ''}

Provide JSON response with:
1. optimizedMessage (improved version)
2. improvements (specific changes made)
3. viralScore (0-10 rating)
4. emotionalImpact (0-10 rating)

Focus on emotional triggers, social sharing potential, and blockchain messaging context.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: "You are an expert at optimizing messages for viral potential and emotional resonance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        optimizedMessage: result.optimizedMessage || message,
        improvements: result.improvements || [],
        viralScore: Math.min(10, Math.max(0, result.viralScore || 7)),
        emotionalImpact: Math.min(10, Math.max(0, result.emotionalImpact || 7))
      };

    } catch (error) {
      console.error('OpenAI message optimization error:', error);
      return {
        optimizedMessage: message + " ✨",
        improvements: ["Add emotional keywords", "Include engagement hooks"],
        viralScore: 7,
        emotionalImpact: 7
      };
    }
  }

  private getFallbackEmotionAnalysis(text: string): {
    analysis: AIEmotionAnalysis;
    viralPrediction: AIViralPrediction;
  } {
    // Sophisticated rule-based analysis when OpenAI is not available
    const words = text.toLowerCase().split(/\s+/);
    const emotionKeywords = {
      love: ['love', 'heart', '❤️', '💕', 'adore', 'cherish'],
      joy: ['happy', 'joy', 'excited', '😊', '🎉', 'celebrate'],
      gratitude: ['thank', 'grateful', '🙏', 'appreciate', 'blessed'],
      hope: ['hope', 'dream', '✨', 'future', 'believe'],
      inspiration: ['inspire', 'motivate', 'achieve', 'success', '🚀']
    };

    let primaryEmotion = 'joy';
    let maxScore = 0;
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const score = keywords.reduce((sum, keyword) => {
        return sum + (text.toLowerCase().includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        primaryEmotion = emotion;
      }
    }

    const emotionIntensity = Math.min(10, Math.max(3, words.length * 0.5 + maxScore * 2));
    const viralPotential = Math.min(1, Math.max(0.3, (maxScore + text.length / 100) * 0.2));
    
    return {
      analysis: {
        primaryEmotion,
        emotionIntensity,
        viralPotential,
        sentimentScore: maxScore > 0 ? 0.7 : 0.3,
        emotionalTriggers: text.match(/[!?✨🎉💕❤️🚀🦋]/g) || [],
        suggestedOptimizations: [
          "Add more emotional emojis",
          "Include personal storytelling elements", 
          "Use more vivid descriptive language",
          "Add a call-to-action"
        ],
        blockchainValue: 0.015 + (viralPotential * 0.02),
        timeToViralPeak: Math.max(2, 8 - emotionIntensity),
        targetDemographics: ['crypto enthusiasts', 'social media users', 'young adults'],
        culturalResonance: 0.75
      },
      viralPrediction: {
        viralCoefficient: 1.2 + (viralPotential * 0.8),
        expectedReach: Math.round(5000 + (viralPotential * 15000)),
        peakTimestamp: new Date(Date.now() + (6 - emotionIntensity * 0.5) * 60 * 60 * 1000),
        engagementRate: 12 + (viralPotential * 8),
        shareVelocity: 15 + (emotionIntensity * 3),
        emotionalContagion: viralPotential * 0.8
      }
    };
  }

  private getFallbackCampaign(params: any): AICampaignResult {
    return {
      campaign: {
        name: `${params.targetAudience} FlutterWave Campaign`,
        description: `Targeted campaign for ${params.targetAudience} focusing on ${params.campaignGoal}`,
        targetAudience: params.targetAudience,
        messageTemplate: "Transform your emotions into valuable blockchain messages with FlutterWave! 🦋✨",
        estimatedReach: 25000 + Math.floor(Math.random() * 50000),
        roi: `${200 + Math.floor(Math.random() * 200)}%`,
        emotionalTriggers: ['innovation', 'opportunity', 'community', 'transformation'],
        optimalTiming: 'Evenings 7-9pm, Weekend mornings',
        suggestedHashtags: ['#FlutterWave', '#BlockchainMessaging', '#CryptoEmotions', '#ViralValue'],
        callToAction: 'Start your emotional blockchain journey today!'
      },
      strategy: {
        phase1: 'Build initial awareness through targeted community posts',
        phase2: 'Amplify reach with user-generated content campaigns',
        phase3: 'Scale virally through referral and reward systems'
      }
    };
  }
}

export const openaiService = new OpenAIService();