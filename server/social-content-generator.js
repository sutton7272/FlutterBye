import OpenAI from "openai";

class SocialContentGenerator {
  constructor() {
    this.openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });
    
    // FlutterBye platform features and data
    this.platformFeatures = [
      'Tokenized messaging system',
      'SPL token creation and distribution',
      'Burn-to-redeem functionality',
      'Viral token distribution',
      'AI-powered FlutterAI intelligence scoring',
      'SMS-to-blockchain integration',
      'Multi-wallet support',
      'Enterprise blockchain solutions',
      'Real-time chat with token value',
      'Limited edition token sets',
      'Cross-chain intelligence platform'
    ];

    this.successStories = [
      'Users creating viral token messages with 1000+ interactions',
      'Businesses using FlutterBye for customer loyalty tokens',
      'Creators monetizing their content through token messaging',
      'Enterprise clients using blockchain intelligence scoring',
      'Community building through tokenized engagement'
    ];

    this.platformStats = {
      tokensCreated: '50,000+',
      totalValueDistributed: '$2.5M+',
      activeUsers: '25,000+',
      averageEngagement: '850%',
      platformUptime: '99.9%'
    };
  }

  async generateContent(contentType, platform = 'twitter') {
    try {
      const prompts = {
        feature_highlight: this.getFeatureHighlightPrompt(),
        user_success: this.getUserSuccessPrompt(),
        platform_update: this.getPlatformUpdatePrompt(),
        community_growth: this.getCommunityGrowthPrompt(),
        innovation_showcase: this.getInnovationShowcasePrompt()
      };

      const prompt = prompts[contentType] || prompts.feature_highlight;
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a social media content expert for FlutterBye, a revolutionary Web3 tokenized messaging platform. Create engaging ${platform} content that:
            - Highlights the unique value of tokenized messaging
            - Uses trending hashtags and emojis appropriately
            - Creates excitement about blockchain innovation
            - Keeps content under ${platform === 'twitter' ? '280' : '2000'} characters
            - Includes a clear call-to-action
            - Responds in JSON format with 'content' and 'hashtags' fields`
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      return {
        content: result.content || "Experience the future of Web3 communication with FlutterBye! 🚀",
        hashtags: result.hashtags || ['#FlutterBye', '#Web3', '#TokenizedMessaging'],
        contentType,
        platform,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('AI content generation error:', error);
      return this.getFallbackContent(contentType);
    }
  }

  getFeatureHighlightPrompt() {
    const feature = this.platformFeatures[Math.floor(Math.random() * this.platformFeatures.length)];
    return `Create exciting social media content highlighting FlutterBye's ${feature}. Focus on how this revolutionizes Web3 communication and creates value for users. Make it viral and engaging with relevant hashtags.`;
  }

  getUserSuccessPrompt() {
    const story = this.successStories[Math.floor(Math.random() * this.successStories.length)];
    return `Create inspiring social media content about FlutterBye user success: ${story}. Make it motivational and show the potential for others to achieve similar success. Include relevant statistics and hashtags.`;
  }

  getPlatformUpdatePrompt() {
    return `Create announcement-style content about FlutterBye platform improvements and new features. Highlight innovation, user benefits, and platform growth. Use statistics like ${this.platformStats.tokensCreated} tokens created and ${this.platformStats.activeUsers} active users.`;
  }

  getCommunityGrowthPrompt() {
    return `Create community-focused content about FlutterBye's growing ecosystem. Mention ${this.platformStats.activeUsers} users, ${this.platformStats.totalValueDistributed} in value distributed, and invite others to join the tokenized messaging revolution.`;
  }

  getInnovationShowcasePrompt() {
    return `Create forward-looking content about how FlutterBye is pioneering the future of Web3 communication. Focus on blockchain innovation, AI integration, and the transformation from traditional messaging to value-based communication.`;
  }

  getFallbackContent(contentType) {
    const fallbackMessages = {
      feature_highlight: {
        content: "🚀 Experience tokenized messaging like never before! FlutterBye transforms every conversation into an opportunity for value creation and viral distribution. Join the Web3 communication revolution!",
        hashtags: ['#FlutterBye', '#TokenizedMessaging', '#Web3Revolution']
      },
      user_success: {
        content: "💎 Another FlutterBye success story! Users are creating viral token messages with 1000+ interactions, monetizing their creativity through blockchain innovation. Your message could be next!",
        hashtags: ['#FlutterByeSuccess', '#Web3Creator', '#TokenizedContent']
      },
      platform_update: {
        content: "📈 FlutterBye platform update: 50,000+ tokens created, $2.5M+ value distributed, 25,000+ active users! The tokenized messaging ecosystem is thriving and growing every day.",
        hashtags: ['#FlutterBye', '#PlatformGrowth', '#BlockchainStats']
      },
      community_growth: {
        content: "🌟 Join 25,000+ users in the FlutterBye ecosystem! Together we've distributed $2.5M+ in token value and created 50,000+ unique messaging experiences. Your voice matters in Web3!",
        hashtags: ['#FlutterByeCommunity', '#Web3Together', '#TokenizedSocial']
      },
      innovation_showcase: {
        content: "⚡ FlutterBye is redefining communication for Web3! From SMS-to-blockchain integration to AI-powered intelligence scoring, we're building the future of value-based messaging.",
        hashtags: ['#FlutterBye', '#Web3Innovation', '#FutureOfMessaging']
      }
    };

    return fallbackMessages[contentType] || fallbackMessages.feature_highlight;
  }

  // Generate visual content suggestions (for future implementation)
  async generateVisualSuggestions(contentType) {
    const visualIdeas = {
      feature_highlight: [
        "Animated butterfly logo with electric pulse effects",
        "Screenshot of token creation interface with success metrics",
        "Infographic showing tokenized messaging flow"
      ],
      user_success: [
        "User testimonial graphics with token statistics",
        "Before/after comparison of traditional vs tokenized messaging",
        "Success milestone celebration graphics"
      ],
      platform_update: [
        "Platform statistics dashboard screenshot",
        "Growth chart animations showing user adoption",
        "Feature update announcement graphics"
      ],
      community_growth: [
        "Community member collage with token achievements",
        "Network visualization showing global FlutterBye usage",
        "Community milestone celebration graphics"
      ],
      innovation_showcase: [
        "Futuristic Web3 communication concept art",
        "Technology stack visualization",
        "Innovation timeline graphics"
      ]
    };

    return visualIdeas[contentType] || visualIdeas.feature_highlight;
  }
}

export const contentGenerator = new SocialContentGenerator();