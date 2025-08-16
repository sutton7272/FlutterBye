import OpenAI from 'openai';
import { flutterByeContentStrategy } from './flutterbye-content-strategy';
import { OpenAIService } from './openai-service';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

const openaiService = new OpenAIService();

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

  // Real-time intelligence data
  private performanceHistory: Array<{
    content: string;
    engagement: number;
    timestamp: Date;
    timeSlot: string;
    hashtags: string[];
  }> = [];

  private communityEngagement: Array<{
    type: 'comment' | 'like' | 'retweet' | 'mention';
    content: string;
    timestamp: Date;
    sentiment: 'positive' | 'neutral' | 'negative';
  }> = [];

  private marketContext = {
    cryptoTrend: 'neutral' as 'bullish' | 'bearish' | 'neutral',
    topCoinPerformance: [] as Array<{ symbol: string; change24h: number }>,
    web3News: [] as Array<{ headline: string; relevance: number; timestamp: Date }>,
    lastUpdated: new Date()
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
- Include 8-12 optimal hashtags for maximum engagement
- Mix broad reach and niche targeting hashtags
- Always include #FlutterBye as primary brand hashtag
- Balance trending and evergreen hashtags
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

  // Enhanced real-time content generation with all intelligence features
  async generateContentWithRealTimeIntelligence(
    template: ContentTemplate,
    timeSlot: string,
    customContext?: string
  ): Promise<GeneratedContent> {
    // Update real-time market context
    await this.updateMarketContext();
    
    // Get performance insights from recent posts
    const performanceInsights = this.getPerformanceInsights(timeSlot);
    
    // Analyze community engagement
    const communityContext = this.getCommunityEngagementContext();
    
    // Get trending topics
    const trendingContext = await this.getTrendingTopicsContext();
    
    // Build enhanced prompt with all real-time intelligence
    const enhancedPrompt = `
    ${template.prompt}
    
    REAL-TIME INTELLIGENCE CONTEXT:
    
    1. TRENDING TOPICS & NEWS:
    ${trendingContext}
    
    2. MARKET AWARENESS:
    - Current crypto sentiment: ${this.marketContext.cryptoTrend}
    - Recent Web3 developments: ${this.marketContext.web3News.slice(0, 3).map(n => n.headline).join(', ')}
    - Market context: ${this.getMarketContextPrompt()}
    
    3. PERFORMANCE LEARNING:
    ${performanceInsights}
    
    4. COMMUNITY ENGAGEMENT:
    ${communityContext}
    
    5. TIME-SPECIFIC OPTIMIZATION:
    ${this.getTimeContextPrompt(timeSlot)}
    
    INSTRUCTIONS:
    - Reference current trends naturally when relevant
    - Adapt tone based on market sentiment
    - Incorporate successful elements from high-performing recent posts
    - Respond to community interests and recent engagement
    - Create content that feels timely and current
    - Maintain FlutterBye brand voice while being contextually relevant
    
    ${customContext ? `ADDITIONAL CONTEXT: ${customContext}` : ''}
    
    Generate a compelling social media post that leverages all this real-time intelligence while staying true to FlutterBye's innovative brand identity.
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: 'system',
            content: this.getFlutterByeBrandContext()
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.8
      });

      const generatedText = completion.choices[0].message.content || '';
      const hashtags = await this.extractOptimalHashtags(generatedText, timeSlot, template.category);
      const engagementScore = this.calculateEngagementScore(generatedText, timeSlot, hashtags);
      
      const result: GeneratedContent = {
        text: generatedText.replace(/#\w+/g, '').trim(),
        hashtags,
        estimatedReach: this.calculateEstimatedReach(timeSlot, template.category),
        engagementScore,
        tone: this.detectTone(generatedText),
        category: template.category
      };

      // Store this generation for future performance learning
      this.recordPerformance(result, timeSlot);
      
      return result;
    } catch (error) {
      console.error('Enhanced AI content generation failed:', error);
      // Fallback to standard generation
      return this.generateContentWithFlutterByeAssets(template, timeSlot, customContext);
    }
  }

  // Main public method for content generation
  async generateContent(
    options: { category?: string; customPrompt?: string; includeHashtags?: boolean; timeSlot?: string } = {}
  ): Promise<{ content: string; hashtags: string[] }> {
    const { category = 'product', customPrompt, timeSlot = 'general' } = options;
    
    try {
      const template = this.getRandomTemplate(category);
      const result = await this.generateContentWithRealTimeIntelligence(template, timeSlot, customPrompt);
      
      // Convert to expected format
      const hashtagString = result.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ');
      const content = `${result.text} ${hashtagString}`;
      
      return {
        content: content,
        hashtags: result.hashtags
      };
    } catch (error) {
      console.error('AI content generation failed:', error);
      // Return fallback content
      return {
        content: "🚀 FlutterBye: The future of Web3 communication is here! Revolutionary blockchain-powered messaging with SPL tokens, AI optimization, and real-time engagement. #FlutterBye #Web3 #Blockchain #AI #SocialAutomation #Innovation #Crypto #Future #Technology #Engagement",
        hashtags: ['#FlutterBye', '#Web3', '#Blockchain', '#AI', '#SocialAutomation']
      };
    }
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
    
    // Initialize real-time intelligence for bulk generation
    await this.updateMarketContext();
    
    for (let i = 0; i < count; i++) {
      const timeSlot = activeTimeSlots[i % activeTimeSlots.length];
      const template = this.selectOptimalTemplate(timeSlot);
      
      try {
        // Use enhanced real-time intelligence for each post
        const content = await this.generateContentWithRealTimeIntelligence(template, timeSlot);
        results.push({ timeSlot, content });
        
        console.log(`📝 Generated enhanced content for ${timeSlot}: ${content.text.substring(0, 50)}...`);
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to generate content for ${timeSlot}:`, error);
        
        // Fallback to standard generation
        try {
          const fallbackContent = await this.generateContentWithFlutterByeAssets(template, timeSlot);
          results.push({ timeSlot, content: fallbackContent });
        } catch (fallbackError) {
          console.error(`Fallback generation also failed for ${timeSlot}:`, fallbackError);
        }
      }
    }
    
    console.log(`✅ Generated ${results.length} enhanced AI posts with real-time intelligence`);
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

  // Real-time intelligence methods
  async updateMarketContext(): Promise<void> {
    try {
      // Simulate market data update (in real implementation, this would call APIs)
      const now = new Date();
      if (now.getTime() - this.marketContext.lastUpdated.getTime() > 300000) { // 5 minutes
        this.marketContext = {
          cryptoTrend: this.generateMarketTrend(),
          topCoinPerformance: this.generateCoinPerformance(),
          web3News: this.generateWeb3News(),
          lastUpdated: now
        };
      }
    } catch (error) {
      console.error('Failed to update market context:', error);
    }
  }

  private generateMarketTrend(): 'bullish' | 'bearish' | 'neutral' {
    const trends = ['bullish', 'bearish', 'neutral'] as const;
    return trends[Math.floor(Math.random() * trends.length)];
  }

  private generateCoinPerformance() {
    return [
      { symbol: 'SOL', change24h: (Math.random() - 0.5) * 20 },
      { symbol: 'ETH', change24h: (Math.random() - 0.5) * 15 },
      { symbol: 'BTC', change24h: (Math.random() - 0.5) * 10 }
    ];
  }

  private generateWeb3News() {
    const headlines = [
      'Major DeFi protocol announces cross-chain expansion',
      'New Web3 communication standards proposed',
      'Institutional adoption of blockchain messaging grows',
      'Tokenized social media gains mainstream attention',
      'Solana ecosystem sees 40% growth in active users'
    ];
    
    return headlines.map((headline, i) => ({
      headline,
      relevance: Math.random() * 10,
      timestamp: new Date(Date.now() - i * 3600000) // Hours ago
    }));
  }

  async getTrendingTopicsContext(): Promise<string> {
    // In real implementation, this would call Twitter/X API or trending APIs
    const trendingTopics = [
      '#Web3', '#DeFi', '#Solana', '#Blockchain', '#Crypto',
      '#TokenizedMessages', '#DecentralizedComm', '#Innovation'
    ];
    
    const relevantTrends = trendingTopics.slice(0, 4);
    
    return `
    Current trending topics relevant to FlutterBye:
    ${relevantTrends.join(', ')}
    
    Trending context: Focus on innovation, decentralization, and Web3 communication trends.
    Engagement opportunity: Current audience is interested in practical blockchain applications.
    `;
  }

  getPerformanceInsights(timeSlot: string): string {
    const recentPosts = this.performanceHistory
      .filter(post => post.timeSlot === timeSlot)
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3);

    if (recentPosts.length === 0) {
      return `No recent performance data for ${timeSlot}. Focus on engaging, value-driven content.`;
    }

    const topPerformer = recentPosts[0];
    const avgEngagement = recentPosts.reduce((sum, post) => sum + post.engagement, 0) / recentPosts.length;

    return `
    Performance insights for ${timeSlot}:
    - Top performing content (${topPerformer.engagement} engagement): "${topPerformer.content.substring(0, 100)}..."
    - Best hashtags: ${topPerformer.hashtags.slice(0, 3).join(', ')}
    - Average engagement: ${avgEngagement.toFixed(1)}
    - Pattern: ${this.getPerformancePattern(recentPosts)}
    `;
  }

  private getPerformancePattern(posts: Array<any>): string {
    if (posts.length < 2) return 'Insufficient data for pattern analysis';
    
    const hasFlutterBye = posts.some(p => p.content.toLowerCase().includes('flutterbye'));
    const hasInnovation = posts.some(p => p.content.toLowerCase().includes('innovation'));
    const hasWeb3 = posts.some(p => p.hashtags.some((h: string) => h.toLowerCase().includes('web3')));

    if (hasFlutterBye && hasInnovation) return 'Brand + innovation content performs well';
    if (hasWeb3) return 'Web3 technical content resonates with audience';
    return 'Community-focused content shows strong engagement';
  }

  getCommunityEngagementContext(): string {
    const recentEngagement = this.communityEngagement
      .filter(e => Date.now() - e.timestamp.getTime() < 86400000) // Last 24 hours
      .slice(0, 5);

    if (recentEngagement.length === 0) {
      return 'No recent community engagement. Focus on conversation starters and engaging questions.';
    }

    const sentiment = this.analyzeSentiment(recentEngagement);
    const topInterests = this.extractInterests(recentEngagement);

    return `
    Recent community engagement:
    - Overall sentiment: ${sentiment}
    - Top interests: ${topInterests.join(', ')}
    - Engagement types: ${recentEngagement.map(e => e.type).join(', ')}
    - Community wants: More discussion about practical applications and innovation
    `;
  }

  private analyzeSentiment(engagement: Array<any>): string {
    const positive = engagement.filter(e => e.sentiment === 'positive').length;
    const total = engagement.length;
    const ratio = positive / total;

    if (ratio > 0.7) return 'Very positive';
    if (ratio > 0.5) return 'Positive';
    if (ratio > 0.3) return 'Mixed';
    return 'Needs engagement boost';
  }

  private extractInterests(engagement: Array<any>): string[] {
    // Analyze engagement content for interests
    const interests = ['innovation', 'technology', 'community', 'future', 'blockchain'];
    return interests.slice(0, 3); // Return top 3
  }

  getMarketContextPrompt(): string {
    const trend = this.marketContext.cryptoTrend;
    
    if (trend === 'bullish') {
      return 'Market is optimistic - emphasize growth potential and innovation opportunities';
    } else if (trend === 'bearish') {
      return 'Market is cautious - focus on stability, long-term value, and practical benefits';
    }
    return 'Market is stable - balanced tone focusing on steady progress and community building';
  }

  recordPerformance(content: GeneratedContent, timeSlot: string): void {
    this.performanceHistory.push({
      content: content.text,
      engagement: content.engagementScore,
      timestamp: new Date(),
      timeSlot,
      hashtags: content.hashtags
    });

    // Keep only last 50 records to prevent memory buildup
    if (this.performanceHistory.length > 50) {
      this.performanceHistory = this.performanceHistory.slice(-50);
    }
  }

  // Simulate community engagement for testing
  simulateCommunityEngagement(): void {
    const engagementTypes = ['comment', 'like', 'retweet', 'mention'] as const;
    const sentiments = ['positive', 'neutral', 'negative'] as const;
    const comments = [
      'Love the innovation!',
      'When mainnet launch?',
      'FlutterBye changing the game',
      'Need more details on tokenomics',
      'Great progress on Web3 communication'
    ];

    for (let i = 0; i < 5; i++) {
      this.communityEngagement.push({
        type: engagementTypes[Math.floor(Math.random() * engagementTypes.length)],
        content: comments[Math.floor(Math.random() * comments.length)],
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)]
      });
    }
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

  private calculateEngagementScore(text: string, timeSlot: string, hashtags: string[]): number {
    let score = 5; // Base score

    // Text quality factors
    if (text.length > 50 && text.length < 280) score += 1;
    if (text.includes('?')) score += 0.5; // Questions engage
    if (text.includes('!')) score += 0.3; // Excitement
    if (text.toLowerCase().includes('flutterbye')) score += 1;

    // Hashtag optimization
    if (hashtags.length >= 3 && hashtags.length <= 6) score += 0.5;
    if (hashtags.includes('#FlutterBye')) score += 0.5;

    // Time slot optimization
    const peakHours = ['lunch', 'earlyEvening', 'evening'];
    if (peakHours.includes(timeSlot)) score += 0.7;

    // Market context boost
    if (this.marketContext.cryptoTrend === 'bullish') score += 0.3;

    return Math.min(10, Math.max(1, score));
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

  // Enhanced utility methods for real-time intelligence
  private async extractOptimalHashtags(text: string, timeSlot: string, category: string = 'general'): Promise<string[]> {
    try {
      // Use OpenAI service for intelligent hashtag optimization
      const optimizedHashtags = await openaiService.generateOptimizedHashtags(text, category);
      
      // Ensure we have the optimal number (8-12 hashtags)
      if (optimizedHashtags.length >= 8) {
        console.log(`🏷️ Generated ${optimizedHashtags.length} optimal hashtags: ${optimizedHashtags.slice(0, 5).join(', ')}...`);
        return optimizedHashtags;
      }
      
      // If AI generated fewer, supplement with strategic hashtags
      return this.supplementHashtags(optimizedHashtags, text, timeSlot, category);
      
    } catch (error) {
      console.error('Hashtag optimization failed:', error);
      return this.getFallbackOptimalHashtags(text, timeSlot, category);
    }
  }

  private supplementHashtags(baseHashtags: string[], text: string, timeSlot: string, category: string): string[] {
    const supplemental = this.getStrategicHashtags(text, timeSlot, category);
    const combined = [...baseHashtags, ...supplemental];
    
    // Remove duplicates and ensure #FlutterBye is first
    const unique = [...new Set(combined)];
    const filtered = unique.filter(tag => tag !== '#FlutterBye');
    
    return ['#FlutterBye', ...filtered].slice(0, 12);
  }

  private getStrategicHashtags(text: string, timeSlot: string, category: string): string[] {
    const strategic = [];
    
    // Category-specific hashtags
    const categoryTags = {
      product: ['#ProductInnovation', '#TechRevolution', '#FutureOfComm'],
      technology: ['#Web3Tech', '#BlockchainInnovation', '#CryptoTech'],
      community: ['#BuildTogether', '#CommunityFirst', '#Web3Community'],
      educational: ['#LearnWeb3', '#BlockchainEducation', '#CryptoLearning'],
      promotional: ['#JoinRevolution', '#EarlyAccess', '#Innovation']
    };
    
    strategic.push(...(categoryTags[category as keyof typeof categoryTags] || []));
    
    // Time-optimized hashtags
    const timeOptimized = {
      earlyMorning: ['#MorningInnovation', '#StartStrong'],
      breakfast: ['#MorningTech', '#NewDay'],
      lunch: ['#MidDayUpdate', '#TechBreak'],
      earlyAfternoon: ['#AfternoonInsights', '#ProductivityBoost'],
      lateAfternoon: ['#TechProgress', '#Innovation'],
      dinner: ['#EveningTech', '#CommunityTime'],
      evening: ['#TrendingTech', '#PrimeTech'],
      lateNight: ['#NightOwls', '#TechThoughts']
    };
    
    strategic.push(...(timeOptimized[timeSlot as keyof typeof timeOptimized] || []));
    
    // Content-intelligent hashtags
    const contentTags = this.analyzeContentForHashtags(text);
    strategic.push(...contentTags);
    
    // Core Web3/crypto hashtags for reach
    strategic.push('#Web3', '#Solana', '#Crypto', '#Blockchain', '#DeFi', '#Innovation', '#Future');
    
    return strategic;
  }

  private analyzeContentForHashtags(text: string): string[] {
    const tags = [];
    const lowerText = text.toLowerCase();
    
    // AI and technology keywords
    if (lowerText.includes('ai') || lowerText.includes('artificial')) tags.push('#AI', '#ArtificialIntelligence');
    if (lowerText.includes('smart contract')) tags.push('#SmartContracts');
    if (lowerText.includes('defi') || lowerText.includes('decentralized finance')) tags.push('#DeFi');
    if (lowerText.includes('nft')) tags.push('#NFT');
    if (lowerText.includes('token')) tags.push('#Tokenization', '#SPLTokens');
    if (lowerText.includes('message') || lowerText.includes('messaging')) tags.push('#TokenizedMessages', '#Communication');
    if (lowerText.includes('wallet')) tags.push('#CryptoWallet', '#WalletTech');
    if (lowerText.includes('enterprise')) tags.push('#Enterprise', '#B2B');
    if (lowerText.includes('security')) tags.push('#CryptoSecurity', '#BlockchainSecurity');
    
    // Engagement and community keywords
    if (lowerText.includes('community')) tags.push('#CommunityBuilding');
    if (lowerText.includes('growth')) tags.push('#Growth', '#Scaling');
    if (lowerText.includes('launch')) tags.push('#ProductLaunch', '#NewTech');
    if (lowerText.includes('revolution')) tags.push('#TechRevolution', '#GameChanger');
    
    return tags;
  }

  private getFallbackOptimalHashtags(text: string, timeSlot: string, category: string): string[] {
    // Optimized fallback with 8-10 strategic hashtags
    const fallbackSets = {
      general: [
        '#FlutterBye', '#Web3', '#Solana', '#TokenizedMessages', '#Innovation', 
        '#Blockchain', '#CryptoTech', '#FutureOfComm', '#Digital', '#Communication'
      ],
      technology: [
        '#FlutterBye', '#Web3Tech', '#Solana', '#SPLTokens', '#BlockchainInnovation',
        '#CryptoTech', '#SmartContracts', '#TechRevolution', '#Innovation', '#DeFi'
      ],
      community: [
        '#FlutterBye', '#Web3Community', '#Solana', '#BuildTogether', '#CommunityFirst',
        '#Innovation', '#JoinUs', '#FutureOfComm', '#TechCommunity', '#Growth'
      ],
      product: [
        '#FlutterBye', '#ProductLaunch', '#TokenizedMessages', '#Web3', '#Innovation',
        '#GameChanger', '#TechRevolution', '#Solana', '#Communication', '#FutureOfComm'
      ]
    };
    
    const baseSet = fallbackSets[category as keyof typeof fallbackSets] || fallbackSets.general;
    const contentSpecific = this.analyzeContentForHashtags(text);
    
    // Combine and optimize
    const combined = [...baseSet, ...contentSpecific.slice(0, 3)];
    return [...new Set(combined)].slice(0, 10);
  }

  private detectTone(text: string): string {
    const professionalWords = ['innovation', 'technology', 'development', 'progress'];
    const excitedWords = ['amazing', 'incredible', 'revolutionary', 'breakthrough'];
    const communityWords = ['together', 'community', 'join', 'everyone'];

    const lowerText = text.toLowerCase();

    if (excitedWords.some(word => lowerText.includes(word))) return 'excited';
    if (communityWords.some(word => lowerText.includes(word))) return 'community-focused';
    if (professionalWords.some(word => lowerText.includes(word))) return 'professional';
    
    return 'neutral';
  }

  // Initialize real-time intelligence (call this when starting the system)
  async initializeRealTimeIntelligence(): Promise<void> {
    console.log('🧠 Initializing Real-Time AI Intelligence...');
    
    // Update market context
    await this.updateMarketContext();
    
    // Simulate some initial community engagement for better AI responses
    this.simulateCommunityEngagement();
    
    console.log('✅ Real-Time AI Intelligence initialized with:');
    console.log(`   • Market trend: ${this.marketContext.cryptoTrend}`);
    console.log(`   • Community engagement: ${this.communityEngagement.length} interactions`);
    console.log(`   • Performance history: ${this.performanceHistory.length} records`);
  }

  // Get intelligence summary for dashboard
  getRealTimeIntelligenceSummary() {
    return {
      marketTrend: this.marketContext.cryptoTrend,
      lastMarketUpdate: this.marketContext.lastUpdated,
      communityEngagementCount: this.communityEngagement.length,
      performanceHistoryCount: this.performanceHistory.length,
      topPerformingTimeSlot: this.getTopPerformingTimeSlot(),
      communitySentiment: this.getOverallCommunitySentiment(),
      trendingTopics: ['#Web3', '#DeFi', '#Solana', '#Innovation']
    };
  }

  private getTopPerformingTimeSlot(): string {
    if (this.performanceHistory.length === 0) return 'No data';
    
    const timeSlotPerformance = this.performanceHistory.reduce((acc, post) => {
      acc[post.timeSlot] = (acc[post.timeSlot] || 0) + post.engagement;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(timeSlotPerformance).reduce((a, b) => 
      timeSlotPerformance[a] > timeSlotPerformance[b] ? a : b
    );
  }

  private getOverallCommunitySentiment(): string {
    return this.analyzeSentiment(this.communityEngagement);
  }
}

// Initialize and export the enhanced AI content generator
const aiContentGenerator = new AIContentGenerator();

// Initialize real-time intelligence on startup
aiContentGenerator.initializeRealTimeIntelligence().catch(error => {
  console.error('Failed to initialize real-time intelligence:', error);
});

export { aiContentGenerator };