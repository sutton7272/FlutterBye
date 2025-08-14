import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface PostingInsights {
  optimalTimes: Array<{
    platform: string;
    dayOfWeek: string;
    hour: number;
    timezone: string;
    engagement_score: number;
  }>;
  frequency: {
    daily_posts: number;
    weekly_posts: number;
    optimal_gap_hours: number;
  };
  audience_analysis: {
    peak_activity_windows: string[];
    demographic_insights: string[];
    content_preferences: string[];
  };
}

interface ContentOptimization {
  improved_text: string;
  engagement_score: number;
  viral_potential: number;
  suggested_improvements: string[];
  emotional_hooks: string[];
  call_to_action: string;
}

interface AIResponseOptimization {
  response_variants: Array<{
    text: string;
    style: string;
    engagement_potential: number;
  }>;
  timing_strategy: {
    immediate_response: boolean;
    optimal_delay_minutes: number;
    follow_up_schedule: string[];
  };
}

export class AIPostingOptimizer {
  
  // Analyze optimal posting times using AI
  async analyzeOptimalPostingTimes(
    platform: string, 
    userTimezone: string = 'UTC',
    contentType: string = 'general'
  ): Promise<PostingInsights> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are a social media analytics expert. Analyze optimal posting times for ${platform} for a Web3/blockchain audience. Consider current social media trends, platform algorithms, and crypto community behavior patterns. Return detailed JSON analysis.`
          },
          {
            role: "user",
            content: `Analyze optimal posting times for ${platform} targeting crypto/Web3 audience in ${userTimezone} timezone for ${contentType} content. Include specific hours, days, frequency recommendations, and audience behavior insights.`
          }
        ],
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      // Add intelligent defaults if AI response is incomplete
      const insights: PostingInsights = {
        optimalTimes: analysis.optimalTimes || this.getDefaultOptimalTimes(platform),
        frequency: analysis.frequency || this.getDefaultFrequency(platform),
        audience_analysis: analysis.audience_analysis || {
          peak_activity_windows: ['9-11 AM', '7-9 PM'],
          demographic_insights: ['Tech-savvy millennials', 'Crypto enthusiasts'],
          content_preferences: ['Educational content', 'Market insights', 'Innovation updates']
        }
      };

      console.log(`🎯 AI analyzed optimal posting for ${platform}:`, {
        times: insights.optimalTimes.length,
        frequency: insights.frequency.daily_posts,
        peak_windows: insights.audience_analysis.peak_activity_windows.length
      });

      return insights;
    } catch (error) {
      console.error('AI posting analysis failed, using intelligent fallbacks:', error);
      return this.getIntelligentFallbackInsights(platform, userTimezone);
    }
  }

  // AI-powered content optimization
  async optimizePostContent(
    originalContent: string,
    platform: string,
    goals: string[] = ['engagement', 'viral_potential']
  ): Promise<ContentOptimization> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are a viral content optimization expert specializing in Web3/crypto social media. Analyze and improve the given content for maximum ${goals.join(' and ')} on ${platform}. Return optimized content with metrics and suggestions in JSON format.`
          },
          {
            role: "user",
            content: `Optimize this ${platform} post for Flutterbye (Web3 messaging platform): "${originalContent}". Make it more engaging, viral, and compelling while maintaining authenticity. Include engagement score (1-100), viral potential (1-100), and specific improvements.`
          }
        ],
        response_format: { type: "json_object" }
      });

      const optimization = JSON.parse(response.choices[0].message.content || '{}');
      
      const result: ContentOptimization = {
        improved_text: optimization.improved_text || originalContent,
        engagement_score: optimization.engagement_score || 75,
        viral_potential: optimization.viral_potential || 70,
        suggested_improvements: optimization.suggested_improvements || ['Add emotional hook', 'Include call-to-action'],
        emotional_hooks: optimization.emotional_hooks || ['🚀 Revolutionary', '💡 Game-changing'],
        call_to_action: optimization.call_to_action || 'Try Flutterbye today!'
      };

      console.log(`✨ AI optimized content: ${result.engagement_score}% engagement, ${result.viral_potential}% viral potential`);
      return result;
    } catch (error) {
      console.error('Content optimization failed:', error);
      return {
        improved_text: originalContent,
        engagement_score: 65,
        viral_potential: 60,
        suggested_improvements: ['Add emojis', 'Include trending hashtags'],
        emotional_hooks: ['🔥 Hot', '⚡ Electric'],
        call_to_action: 'Check out Flutterbye!'
      };
    }
  }

  // AI-optimized response generation
  async optimizeEngagementResponses(
    originalPost: string,
    userComment: string,
    responseStyle: string = 'helpful'
  ): Promise<AIResponseOptimization> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an AI social media manager for Flutterbye. Generate optimized response variants to user comments that maximize engagement, build community, and drive interest. Consider timing strategy and follow-up opportunities. Return JSON with multiple response options and timing recommendations.`
          },
          {
            role: "user",
            content: `Original post: "${originalPost}"\nUser comment: "${userComment}"\nGenerate 3-4 response variants in ${responseStyle} style with different engagement approaches. Include timing strategy for maximum impact.`
          }
        ],
        response_format: { type: "json_object" }
      });

      const optimization = JSON.parse(response.choices[0].message.content || '{}');
      
      const result: AIResponseOptimization = {
        response_variants: optimization.response_variants || [
          { text: "Thanks for your interest! 🚀", style: "friendly", engagement_potential: 70 },
          { text: "Great question! Let me explain...", style: "helpful", engagement_potential: 80 }
        ],
        timing_strategy: optimization.timing_strategy || {
          immediate_response: false,
          optimal_delay_minutes: 15,
          follow_up_schedule: ['2 hours later', '1 day later']
        }
      };

      console.log(`🤖 AI generated ${result.response_variants.length} response variants with timing strategy`);
      return result;
    } catch (error) {
      console.error('Response optimization failed:', error);
      return {
        response_variants: [
          { text: "Thanks for commenting! 🙏", style: "grateful", engagement_potential: 75 }
        ],
        timing_strategy: {
          immediate_response: true,
          optimal_delay_minutes: 0,
          follow_up_schedule: []
        }
      };
    }
  }

  // Generate AI-powered posting schedule
  async generatePostingSchedule(
    platform: string,
    contentTypes: string[],
    weeklyGoal: number = 5
  ): Promise<Array<{
    day: string;
    time: string;
    contentType: string;
    rationale: string;
  }>> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `Create an optimal weekly posting schedule for ${platform} targeting Web3/crypto audience. Consider platform algorithms, audience behavior, content variety, and engagement patterns. Return detailed schedule in JSON format.`
          },
          {
            role: "user",
            content: `Generate a weekly posting schedule with ${weeklyGoal} posts covering these content types: ${contentTypes.join(', ')}. Include specific days, times, content types, and rationale for each slot.`
          }
        ],
        response_format: { type: "json_object" }
      });

      const schedule = JSON.parse(response.choices[0].message.content || '{}');
      return schedule.posts || this.getDefaultSchedule(platform, weeklyGoal);
    } catch (error) {
      console.error('Schedule generation failed:', error);
      return this.getDefaultSchedule(platform, weeklyGoal);
    }
  }

  // Private helper methods
  private getDefaultOptimalTimes(platform: string) {
    const defaults: Record<string, any[]> = {
      twitter: [
        { platform: 'twitter', dayOfWeek: 'Tuesday', hour: 9, timezone: 'UTC', engagement_score: 85 },
        { platform: 'twitter', dayOfWeek: 'Wednesday', hour: 15, timezone: 'UTC', engagement_score: 90 },
        { platform: 'twitter', dayOfWeek: 'Thursday', hour: 10, timezone: 'UTC', engagement_score: 88 }
      ],
      linkedin: [
        { platform: 'linkedin', dayOfWeek: 'Tuesday', hour: 10, timezone: 'UTC', engagement_score: 92 },
        { platform: 'linkedin', dayOfWeek: 'Wednesday', hour: 14, timezone: 'UTC', engagement_score: 89 }
      ]
    };
    return defaults[platform] || defaults.twitter;
  }

  private getDefaultFrequency(platform: string) {
    const frequencies: Record<string, any> = {
      twitter: { daily_posts: 2, weekly_posts: 14, optimal_gap_hours: 4 },
      linkedin: { daily_posts: 1, weekly_posts: 5, optimal_gap_hours: 24 },
      instagram: { daily_posts: 1, weekly_posts: 7, optimal_gap_hours: 24 }
    };
    return frequencies[platform] || frequencies.twitter;
  }

  private getIntelligentFallbackInsights(platform: string, timezone: string): PostingInsights {
    return {
      optimalTimes: this.getDefaultOptimalTimes(platform),
      frequency: this.getDefaultFrequency(platform),
      audience_analysis: {
        peak_activity_windows: ['9-11 AM', '3-5 PM', '7-9 PM'],
        demographic_insights: ['Crypto enthusiasts', 'Tech professionals', 'Early adopters'],
        content_preferences: ['Innovation updates', 'Educational content', 'Community discussions']
      }
    };
  }

  private getDefaultSchedule(platform: string, weeklyGoal: number) {
    return [
      { day: 'Monday', time: '9:00 AM', contentType: 'weekly-recap', rationale: 'Start week with summary' },
      { day: 'Wednesday', time: '2:00 PM', contentType: 'feature-highlight', rationale: 'Mid-week engagement boost' },
      { day: 'Friday', time: '11:00 AM', contentType: 'community-update', rationale: 'End week on positive note' }
    ].slice(0, weeklyGoal);
  }
}

export const aiPostingOptimizer = new AIPostingOptimizer();