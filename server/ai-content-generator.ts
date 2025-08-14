import OpenAI from 'openai';

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
  private templates: ContentTemplate[] = [
    {
      id: 'web3_innovation',
      name: 'Web3 Innovation Focus',
      prompt: 'Create an engaging tweet about Web3 innovation and blockchain technology. Focus on FlutterBye as a tokenized messaging platform. Make it inspiring and forward-looking.',
      category: 'product',
      timeSlots: ['earlyMorning', 'lunch', 'evening']
    },
    {
      id: 'community_building',
      name: 'Community Engagement',
      prompt: 'Write a community-focused tweet that encourages engagement and interaction. Highlight FlutterBye\'s social features and value-driven communication.',
      category: 'community',
      timeSlots: ['breakfast', 'lateAfternoon', 'dinner']
    },
    {
      id: 'educational_content',
      name: 'Educational Web3',
      prompt: 'Create an educational tweet explaining blockchain concepts or tokenized messaging benefits. Make it accessible and informative.',
      category: 'educational',
      timeSlots: ['lateMorning', 'earlyAfternoon', 'earlyEvening']
    },
    {
      id: 'product_showcase',
      name: 'Product Features',
      prompt: 'Showcase FlutterBye\'s unique features like SPL token messages, burn-to-redeem, or value attachment. Make it compelling and feature-focused.',
      category: 'product',
      timeSlots: ['breakfast', 'lunch', 'lateAfternoon']
    },
    {
      id: 'trending_topics',
      name: 'Trending & Viral',
      prompt: 'Create content that taps into current crypto/Web3 trends while promoting FlutterBye. Make it shareable and viral-ready.',
      category: 'promotional',
      timeSlots: ['evening', 'lateNight']
    }
  ];

  async generateContent(
    template: ContentTemplate, 
    timeSlot: string,
    customContext?: string
  ): Promise<GeneratedContent> {
    try {
      const timeContext = this.getTimeContextPrompt(timeSlot);
      const fullPrompt = `
${template.prompt}

Context: ${timeContext}
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

  async generateBulkContent(
    activeTimeSlots: string[],
    count: number = 5
  ): Promise<{ timeSlot: string; content: GeneratedContent }[]> {
    const results: { timeSlot: string; content: GeneratedContent }[] = [];
    
    for (let i = 0; i < count; i++) {
      const timeSlot = activeTimeSlots[i % activeTimeSlots.length];
      const template = this.selectOptimalTemplate(timeSlot);
      
      try {
        const content = await this.generateContent(template, timeSlot);
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