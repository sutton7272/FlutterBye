import OpenAI from 'openai';
import { flutterByeContentStrategy } from './flutterbye-content-strategy';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface ContentTemplate {
  id: string;
  name: string;
  prompt: string;
  category: 'product' | 'engagement' | 'educational' | 'promotional' | 'community';
  timeSlots: string[]; // Which time slots this template is best for
}

export interface GeneratedContent {
  text: string;
  hashtags: string[];
  estimatedReach: number;
  engagementScore: number;
  tone: string;
  category: string;
}

export class AIContentGenerator {
  private flutterByeBrandAssets = {
    tagline: "Tokens That Talk",
    motto: "The Web3 communication layer",
    keyFeatures: [
      "SPL token messages (FLBY-MSG)",
      "Burn-to-redeem functionality", 
      "Value attachment with expiration dates",
      "Free token minting system",
      "Limited Edition Token sets",
      "Real-time blockchain chat",
      "SMS-to-blockchain integration",
      "AI-powered social credit scoring",
      "Multi-chain wallet intelligence",
      "Enterprise escrow wallet system"
    ],
    visualAssets: [
      "/images/cosmic-butterfly.png",
      "/images/flutterbye-logo.png", 
      "/public-objects/flutterbye-banner.jpg",
      "/public-objects/web3-communication.gif"
    ],
    brandColors: ["Electric blue", "Electric green", "Dark navy", "Cosmic purple"],
    brandPersonality: ["Innovative", "Friendly", "Professional", "Cutting-edge", "Community-focused"]
  };

  private templates: ContentTemplate[] = [
    {
      id: 'flutterbye_vision',
      name: 'FlutterBye Vision & Mission',
      prompt: `Create an inspiring tweet about FlutterBye's mission to become the universal Web3 communication protocol. Reference: "${this.flutterByeBrandAssets.tagline}" and "${this.flutterByeBrandAssets.motto}". Highlight our revolutionary approach to tokenized messaging that transforms how people communicate value and emotion across blockchain.`,
      category: 'product',
      timeSlots: ['earlyMorning', 'lunch', 'evening']
    },
    {
      id: 'token_features',
      name: 'FLBY-MSG Token Features',
      prompt: `Showcase FlutterBye's unique SPL token messages (FLBY-MSG) and core features: ${this.flutterByeBrandAssets.keyFeatures.slice(0,4).join(', ')}. Make it technical yet accessible, emphasizing the innovation of attaching real value to messages. Reference our cosmic butterfly branding.`,
      category: 'product',
      timeSlots: ['breakfast', 'lunch', 'lateAfternoon']
    },
    {
      id: 'ai_intelligence',
      name: 'FlutterAI Intelligence Platform',
      prompt: `Create engaging content about FlutterBye's revolutionary AI-powered wallet intelligence and social credit scoring system. Mention our 1-1000 scoring scale, cross-chain analysis, and how we're creating the "credit score for crypto wallets". Position as industry-disrupting technology.`,
      category: 'product',
      timeSlots: ['lateMorning', 'earlyAfternoon', 'earlyEvening']
    },
    {
      id: 'community_ecosystem',
      name: 'FlutterBye Ecosystem',
      prompt: `Highlight FlutterBye's growing ecosystem: SMS integration, real-time chat, enterprise solutions, and viral communication tools. Reference our community-focused approach and how we're building the Web3 communication infrastructure. Use inspiring, community-building tone.`,
      category: 'community',
      timeSlots: ['breakfast', 'lateAfternoon', 'dinner']
    },
    {
      id: 'enterprise_solutions',
      name: 'Enterprise & B2B Features',
      prompt: `Showcase FlutterBye's enterprise-grade solutions: bank-level multi-signature escrow system, API monetization, enterprise wallet infrastructure. Target businesses looking for secure Web3 communication and value transfer solutions. Professional yet innovative tone.`,
      category: 'promotional',
      timeSlots: ['lateMorning', 'lunch', 'earlyAfternoon']
    },
    {
      id: 'technical_innovation',
      name: 'Technical Deep Dive',
      prompt: `Create educational content about FlutterBye's technical innovations: Solana blockchain integration, automatic metadata creation, burn-to-redeem mechanisms, or real-time blockchain communication. Make complex concepts accessible while highlighting our technical excellence.`,
      category: 'educational',
      timeSlots: ['lunch', 'earlyAfternoon', 'earlyEvening']
    },
    {
      id: 'success_stories',
      name: 'Platform Success & Milestones',
      prompt: `Share FlutterBye's achievements and milestones: AI optimization implementation, Twitter API integration success, performance improvements, or user adoption stories. Create excitement around our growth and technological advancement.`,
      category: 'promotional',
      timeSlots: ['evening', 'lateNight']
    },
    {
      id: 'web3_education',
      name: 'Web3 & Blockchain Education',
      prompt: `Create educational content that positions FlutterBye as a thought leader in Web3 communication. Explain tokenized messaging benefits, blockchain communication advantages, or the future of value-attached messages. Reference our platform as the leading solution.`,
      category: 'educational',
      timeSlots: ['lateMorning', 'lunch', 'earlyEvening']
    }
  ];

  async generateContentWithFlutterByeAssets(
    template: ContentTemplate, 
    timeSlot: string,
    customContext?: string
  ): Promise<GeneratedContent> {
    try {
      const timeContext = this.getTimeContextPrompt(timeSlot);
      const brandContext = this.getFlutterByeBrandContext();
      const fullPrompt = `
${template.prompt}

FlutterBye Brand Context: ${brandContext}
Time Context: ${timeContext}
${customContext ? `Additional context: ${customContext}` : ''}

Requirements:
- Keep it under 280 characters
- Include 3-5 relevant hashtags
- Make it engaging and authentic
- Optimize for ${timeSlot} audience
- Focus on FlutterBye's value proposition

Respond with JSON in this format:
{
  "text": "tweet content without hashtags",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "tone": "inspirational|educational|casual|professional",
  "category": "${template.category}"
}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Latest model for best results
        messages: [
          {
            role: "system",
            content: "You are FlutterBye's AI content strategist. Create compelling, authentic social media content that drives engagement and showcases our tokenized messaging platform."
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8 // Higher creativity for social content
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        text: result.text,
        hashtags: result.hashtags || ['#FlutterBye', '#Web3', '#Blockchain'],
        estimatedReach: this.calculateEstimatedReach(timeSlot, template.category),
        engagementScore: this.calculateEngagementScore(result.tone, timeSlot),
        tone: result.tone || 'professional',
        category: template.category
      };

    } catch (error) {
      console.error('AI content generation failed:', error);
      
      // Fallback content if AI fails
      return {
        text: "FlutterBye is revolutionizing Web3 communication with tokenized messaging. Every message has value!",
        hashtags: ['#FlutterBye', '#Web3', '#TokenizedMessaging'],
        estimatedReach: 5000,
        engagementScore: 7,
        tone: 'professional',
        category: template.category
      };
    }
  }

  // Legacy method for backward compatibility
  async generateContent(
    template: ContentTemplate, 
    timeSlot: string,
    customContext?: string
  ): Promise<GeneratedContent> {
    return this.generateContentWithFlutterByeAssets(template, timeSlot, customContext);
  }

  private getFlutterByeBrandContext(): string {
    // Get comprehensive FlutterBye content strategy and assets
    const contentStrategy = flutterByeContentStrategy.generateContentStrategy('general', 'innovation');
    const factsheet = flutterByeContentStrategy.getFlutterByeFactsheet();
    
    return `
    ${factsheet}
    
    CONTENT STRATEGY GUIDANCE:
    ${contentStrategy.contentDirection}
    
    RECOMMENDED VISUAL: ${contentStrategy.visualRecommendation}
    
    AVAILABLE CONTENT ASSETS:
    ${contentStrategy.suggestedAssets.map(asset => 
      `- ${asset.type}: ${asset.content} (${asset.metadata.category})`
    ).join('\n')}
    `;
  }

  async generateBulkContent(
    activeTimeSlots: string[],
    count: number = 5
  ): Promise<{ timeSlot: string; content: GeneratedContent }[]> {
    const results: { timeSlot: string; content: GeneratedContent }[] = [];
    
    for (let i = 0; i < count; i++) {
      const timeSlot = activeTimeSlots[i % activeTimeSlots.length];
      const template = this.selectOptimalTemplate(timeSlot);
      
      try {
        const content = await this.generateContentWithFlutterByeAssets(template, timeSlot);
        results.push({ timeSlot, content });
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to generate content for ${timeSlot}:`, error);
      }
    }
    
    return results;
  }

  private selectOptimalTemplate(timeSlot: string): ContentTemplate {
    // Find templates optimized for this time slot
    const optimizedTemplates = this.templates.filter(t => 
      t.timeSlots.includes(timeSlot)
    );
    
    if (optimizedTemplates.length > 0) {
      return optimizedTemplates[Math.floor(Math.random() * optimizedTemplates.length)];
    }
    
    // Fallback to any template
    return this.templates[Math.floor(Math.random() * this.templates.length)];
  }

  private getTimeContextPrompt(timeSlot: string): string {
    const contexts = {
      earlyMorning: "Early morning audience - professionals starting their day, looking for inspiration and motivation",
      breakfast: "Breakfast time - casual tone, people checking social media over coffee",
      lateMorning: "Late morning - business focus, professionals at work seeking insights",
      lunch: "Lunch break - people have time to engage, educational content works well",
      earlyAfternoon: "Early afternoon - productivity focus, informational content preferred",
      lateAfternoon: "Late afternoon - winding down work, community engagement increases",
      dinner: "Dinner time - relaxed tone, personal stories and community content",
      earlyEvening: "Early evening - peak engagement time, viral content opportunity",
      evening: "Evening - entertainment focus, trending topics and discussions",
      lateNight: "Late night - engaged audience, thoughtful discussions and deep content"
    };
    
    return contexts[timeSlot as keyof typeof contexts] || "General audience";
  }

  private calculateEstimatedReach(timeSlot: string, category: string): number {
    const baseReach = 8000;
    
    // Time slot multipliers
    const timeMultipliers = {
      earlyMorning: 0.7,
      breakfast: 0.9,
      lateMorning: 0.8,
      lunch: 1.2,
      earlyAfternoon: 0.9,
      lateAfternoon: 1.1,
      dinner: 1.0,
      earlyEvening: 1.4,
      evening: 1.3,
      lateNight: 0.6
    };
    
    // Category multipliers
    const categoryMultipliers = {
      product: 1.0,
      engagement: 1.2,
      educational: 0.9,
      promotional: 1.1,
      community: 1.3
    };
    
    const timeMultiplier = timeMultipliers[timeSlot as keyof typeof timeMultipliers] || 1.0;
    const categoryMultiplier = categoryMultipliers[category as keyof typeof categoryMultipliers] || 1.0;
    
    return Math.round(baseReach * timeMultiplier * categoryMultiplier);
  }

  private calculateEngagementScore(tone: string, timeSlot: string): number {
    const basScore = 7;
    
    const toneBonus = {
      'inspirational': 2,
      'casual': 1,
      'educational': 0,
      'professional': -1
    };
    
    const peakTimeBonus = ['lunch', 'earlyEvening', 'evening'].includes(timeSlot) ? 1 : 0;
    
    const bonus = (toneBonus[tone as keyof typeof toneBonus] || 0) + peakTimeBonus;
    return Math.min(10, Math.max(1, basScore + bonus));
  }

  getTemplates(): ContentTemplate[] {
    return this.templates;
  }

  async analyzeAndOptimize(pastPerformance: any[]): Promise<string[]> {
    // Analyze past performance to suggest optimal content strategies
    // This would integrate with analytics data in a full implementation
    return [
      "Focus on community engagement during evening slots",
      "Educational content performs well during lunch",
      "Product showcases work best in afternoon slots"
    ];
  }
}

export const aiContentGenerator = new AIContentGenerator();