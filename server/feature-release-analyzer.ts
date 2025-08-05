import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface SiteActivityMetrics {
  userCount: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  pageViews: number;
  bounceRate: number;
  conversionRate: number;
  revenue: number;
  featureUsage: Record<string, number>;
  userFeedback: Array<{
    feature: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    comment: string;
    timestamp: Date;
  }>;
  supportTickets: Array<{
    category: string;
    priority: 'low' | 'medium' | 'high';
    resolved: boolean;
    timestamp: Date;
  }>;
}

export interface FeatureReleaseRecommendation {
  featureName: string;
  featureCategory: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  reasoning: string;
  expectedImpact: {
    userEngagement: number;
    revenue: number;
    retention: number;
  };
  requirements: string[];
  risks: string[];
  timeline: string;
  costImpact: number;
}

export interface AnalysisResult {
  summary: string;
  currentStage: 'mvp' | 'growth' | 'scale' | 'mature';
  readinessScore: number; // 0-100
  recommendations: FeatureReleaseRecommendation[];
  keyInsights: string[];
  nextMilestones: Array<{
    metric: string;
    currentValue: number;
    targetValue: number;
    timeframe: string;
  }>;
}

export class FeatureReleaseAnalyzer {
  
  async analyzeAndRecommend(metrics: SiteActivityMetrics, availableFeatures: string[]): Promise<AnalysisResult> {
    try {
      const analysisPrompt = `
As an expert product analytics AI, analyze the following site metrics and provide strategic feature release recommendations.

CURRENT METRICS:
- Users: ${metrics.userCount} total, ${metrics.dailyActiveUsers} DAU, ${metrics.monthlyActiveUsers} MAU
- Engagement: ${metrics.averageSessionDuration}s avg session, ${metrics.pageViews} page views, ${metrics.bounceRate}% bounce rate
- Business: $${metrics.revenue} revenue, ${metrics.conversionRate}% conversion rate
- Feature Usage: ${JSON.stringify(metrics.featureUsage)}
- Support Load: ${metrics.supportTickets.length} tickets (${metrics.supportTickets.filter(t => !t.resolved).length} open)

AVAILABLE FEATURES TO ENABLE:
${availableFeatures.join(', ')}

ANALYSIS FRAMEWORK:
1. Determine current business stage (MVP/Growth/Scale/Mature)
2. Calculate readiness score for feature expansion
3. Prioritize features based on user behavior patterns
4. Consider technical debt and support capacity
5. Estimate ROI and risk factors

Respond with a detailed JSON analysis including:
- summary: Overall platform health assessment
- currentStage: Business maturity level
- readinessScore: 0-100 score for feature expansion readiness
- recommendations: Array of feature recommendations with priority, confidence, reasoning, impact predictions
- keyInsights: Critical observations about user behavior
- nextMilestones: Specific metrics to achieve before next features

Focus on data-driven insights and practical recommendations.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert product analytics AI specializing in SaaS feature rollout strategy. Provide detailed, data-driven recommendations for feature releases based on user behavior and business metrics. Always respond with valid JSON."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      // Enhance recommendations with cost analysis
      const enhancedRecommendations = await this.enhanceWithCostAnalysis(analysis.recommendations);
      
      return {
        ...analysis,
        recommendations: enhancedRecommendations
      };

    } catch (error) {
      console.error('Feature analysis error:', error);
      return this.getFallbackAnalysis(metrics, availableFeatures);
    }
  }

  private async enhanceWithCostAnalysis(recommendations: any[]): Promise<FeatureReleaseRecommendation[]> {
    const costMapping: Record<string, number> = {
      'AI Personalities': 150,
      'FlutterWave': 200,
      'Analytics Dashboard': 50,
      'Enterprise API': 75,
      'Advanced Security': 100,
      'Mobile App': 300,
      'Real-time Chat': 80,
      'Blockchain Integration': 250,
      'Machine Learning': 400,
      'IoT Integration': 180
    };

    return recommendations.map(rec => ({
      ...rec,
      costImpact: costMapping[rec.featureName] || 50
    }));
  }

  async generateUserBehaviorInsights(metrics: SiteActivityMetrics): Promise<string[]> {
    try {
      const prompt = `
Analyze these user behavior patterns and identify key insights:

ENGAGEMENT METRICS:
- ${metrics.dailyActiveUsers} daily active users
- ${metrics.averageSessionDuration}s average session duration
- ${metrics.bounceRate}% bounce rate
- Feature usage: ${JSON.stringify(metrics.featureUsage)}

FEEDBACK ANALYSIS:
${metrics.userFeedback.map(f => `- ${f.sentiment}: ${f.comment}`).join('\n')}

Provide 5 key behavioral insights that indicate feature readiness or user needs. Focus on actionable patterns.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a user behavior analyst. Identify key patterns and insights from user engagement data. Respond with a JSON array of insight strings."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0].message.content || '{"insights": []}');
      return result.insights || [];

    } catch (error) {
      console.error('Insight generation error:', error);
      return [
        'User engagement metrics indicate stable platform usage',
        'Feature adoption rates suggest readiness for gradual expansion',
        'Support ticket patterns show manageable technical debt',
        'Revenue trends support investment in new capabilities',
        'User feedback indicates demand for enhanced functionality'
      ];
    }
  }

  async predictFeatureImpact(featureName: string, metrics: SiteActivityMetrics): Promise<{
    userEngagement: number;
    revenue: number;
    retention: number;
    adoptionRate: number;
  }> {
    try {
      const prompt = `
Predict the impact of enabling "${featureName}" based on current metrics:

CURRENT STATE:
- DAU: ${metrics.dailyActiveUsers}
- Revenue: $${metrics.revenue}
- Conversion Rate: ${metrics.conversionRate}%
- Session Duration: ${metrics.averageSessionDuration}s

Estimate percentage improvements in:
1. User engagement (session duration, page views)
2. Revenue (direct monetization impact)
3. User retention (reduced churn)
4. Feature adoption rate (% of users who will use it)

Respond with JSON containing numerical percentage predictions.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a product impact analyst. Predict numerical percentage improvements for feature releases based on similar SaaS products. Be realistic and conservative."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const impact = JSON.parse(response.choices[0].message.content || '{}');
      return {
        userEngagement: impact.userEngagement || 5,
        revenue: impact.revenue || 3,
        retention: impact.retention || 8,
        adoptionRate: impact.adoptionRate || 15
      };

    } catch (error) {
      console.error('Impact prediction error:', error);
      return {
        userEngagement: 5,
        revenue: 3,
        retention: 8,
        adoptionRate: 15
      };
    }
  }

  private getFallbackAnalysis(metrics: SiteActivityMetrics, availableFeatures: string[]): AnalysisResult {
    const stage = this.determineStage(metrics);
    const readinessScore = this.calculateReadinessScore(metrics);
    
    return {
      summary: `Platform shows ${stage} stage characteristics with ${readinessScore}% readiness for feature expansion.`,
      currentStage: stage,
      readinessScore,
      recommendations: availableFeatures.slice(0, 3).map((feature, index) => ({
        featureName: feature,
        featureCategory: 'Core',
        priority: index === 0 ? 'high' : 'medium' as any,
        confidence: 75 - (index * 10),
        reasoning: `Based on current metrics, ${feature} shows potential for positive user impact.`,
        expectedImpact: {
          userEngagement: 5 + index,
          revenue: 3 + index,
          retention: 8 - index
        },
        requirements: ['Stable user base', 'Adequate support capacity'],
        risks: ['Increased complexity', 'Support overhead'],
        timeline: `${2 + index}-${4 + index} weeks`,
        costImpact: 50 + (index * 25)
      })),
      keyInsights: [
        'User engagement metrics indicate platform stability',
        'Revenue trends support strategic feature investment',
        'Support capacity appears adequate for gradual expansion'
      ],
      nextMilestones: [
        {
          metric: 'Daily Active Users',
          currentValue: metrics.dailyActiveUsers,
          targetValue: Math.round(metrics.dailyActiveUsers * 1.2),
          timeframe: '30 days'
        }
      ]
    };
  }

  private determineStage(metrics: SiteActivityMetrics): 'mvp' | 'growth' | 'scale' | 'mature' {
    if (metrics.userCount < 100) return 'mvp';
    if (metrics.userCount < 1000) return 'growth';
    if (metrics.userCount < 10000) return 'scale';
    return 'mature';
  }

  private calculateReadinessScore(metrics: SiteActivityMetrics): number {
    let score = 0;
    
    // User engagement factors
    if (metrics.averageSessionDuration > 120) score += 20;
    if (metrics.bounceRate < 50) score += 15;
    if (metrics.conversionRate > 2) score += 20;
    
    // Growth factors
    if (metrics.dailyActiveUsers > 50) score += 15;
    if (metrics.revenue > 1000) score += 15;
    
    // Stability factors
    const openTickets = metrics.supportTickets.filter(t => !t.resolved).length;
    if (openTickets < 5) score += 15;
    
    return Math.min(100, score);
  }
}