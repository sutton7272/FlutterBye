import { openaiService } from "./openai-service";
import axios from 'axios';

/**
 * SEO & Marketing Intelligence Service for FlutterAI
 * Comprehensive analytics, optimization, and campaign intelligence
 * Integrates with GA4, Google Search Console, Google Ads, Meta Ads, X Ads
 */

export interface SEOOpportunity {
  id: string;
  pageUrl: string;
  query: string;
  currentPosition: number;
  impressions: number;
  ctr: number;
  priority: 'high' | 'medium' | 'low';
  potentialImpact: number;
  suggestedActions: string[];
  briefGenerated: boolean;
}

export interface CampaignInsight {
  platform: string;
  campaignId: string;
  name: string;
  spend: number;
  conversions: number;
  roas: number;
  cac: number;
  recommendation: 'increase' | 'decrease' | 'optimize' | 'pause';
  suggestedBudgetChange: number;
  reasoning: string;
}

export interface ContentBrief {
  targetQuery: string;
  pageUrl: string;
  title: string;
  metaDescription: string;
  outline: string[];
  entities: string[];
  faqs: Array<{ question: string; answer: string }>;
  jsonLD: any;
  aiOverviewSnippet: string;
  internalLinks: string[];
}

export interface SiteAuditResult {
  pageUrl: string;
  coreWebVitals: {
    lcp: number;
    cls: number;
    inp: number;
    score: number;
  };
  seoChecks: {
    indexable: boolean;
    hasTitle: boolean;
    hasMeta: boolean;
    hasH1: boolean;
    hasSchema: boolean;
    wordCount: number;
    altTextCoverage: number;
  };
  eeatSignals: {
    authorBio: boolean;
    citations: boolean;
    experienceEvidence: boolean;
    expertise: boolean;
  };
  aiOverviewReadiness: number;
  fixItItems: Array<{
    type: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    implementation: string;
  }>;
}

class SEOMarketingIntelligenceService {
  private googleTokens: { accessToken?: string; refreshToken?: string } = {};
  private metaTokens: { accessToken?: string } = {};
  private xTokens: { accessToken?: string; refreshToken?: string } = {};

  /**
   * Connect Google APIs (GA4, GSC, Google Ads)
   */
  async connectGoogle(authCode: string): Promise<void> {
    try {
      console.log('🔗 Connecting Google APIs...');
      
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code: authCode,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      });

      this.googleTokens = {
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token,
      };

      console.log('✅ Google APIs connected successfully');
    } catch (error) {
      console.error('❌ Error connecting Google APIs:', error);
      throw new Error('Failed to connect Google APIs');
    }
  }

  /**
   * Pull data from Google Search Console
   */
  async pullGSCData(siteUrl: string, startDate: string, endDate: string): Promise<any[]> {
    try {
      console.log(`🔍 Pulling GSC data for ${siteUrl}...`);
      
      const response = await axios.post(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
        {
          startDate,
          endDate,
          dimensions: ['page', 'query'],
          rowLimit: 10000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.googleTokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Retrieved ${response.data.rows?.length || 0} GSC records`);
      return response.data.rows || [];
    } catch (error) {
      console.error('❌ Error pulling GSC data:', error);
      return [];
    }
  }

  /**
   * Pull data from GA4
   */
  async pullGA4Data(propertyId: string, startDate: string, endDate: string): Promise<any[]> {
    try {
      console.log(`📊 Pulling GA4 data for property ${propertyId}...`);
      
      const response = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          dateRanges: [{ startDate, endDate }],
          dimensions: [
            { name: 'sessionSource' },
            { name: 'sessionMedium' },
            { name: 'sessionCampaignName' },
          ],
          metrics: [
            { name: 'sessions' },
            { name: 'conversions' },
            { name: 'totalRevenue' },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.googleTokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Retrieved GA4 data with ${response.data.rows?.length || 0} records`);
      return response.data.rows || [];
    } catch (error) {
      console.error('❌ Error pulling GA4 data:', error);
      return [];
    }
  }

  /**
   * Run comprehensive site audit using PageSpeed Insights API
   */
  async auditSite(pageUrl: string): Promise<SiteAuditResult> {
    try {
      console.log(`🔍 Auditing page: ${pageUrl}`);
      
      // PageSpeed Insights API call
      const psiResponse = await axios.get(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(pageUrl)}&category=PERFORMANCE&category=SEO&category=BEST_PRACTICES&strategy=MOBILE`,
        {
          headers: {
            'X-API-Key': process.env.GOOGLE_API_KEY,
          },
        }
      );

      const audit = psiResponse.data;
      const lighthouseResult = audit.lighthouseResult;
      
      // Extract Core Web Vitals
      const coreWebVitals = {
        lcp: lighthouseResult.audits['largest-contentful-paint']?.numericValue || 0,
        cls: lighthouseResult.audits['cumulative-layout-shift']?.numericValue || 0,
        inp: lighthouseResult.audits['interaction-to-next-paint']?.numericValue || 0,
        score: Math.round((lighthouseResult.categories.performance?.score || 0) * 100),
      };

      // Fetch page content for SEO analysis
      const pageResponse = await axios.get(pageUrl);
      const html = pageResponse.data;
      
      // Basic SEO checks
      const seoChecks = {
        indexable: !html.includes('noindex'),
        hasTitle: /<title[^>]*>([^<]+)<\/title>/.test(html),
        hasMeta: /<meta[^>]+name=["\']description["\']/.test(html),
        hasH1: /<h1[^>]*>/.test(html),
        hasSchema: /application\/ld\+json/.test(html),
        wordCount: (html.match(/\b\w+\b/g) || []).length,
        altTextCoverage: this.calculateAltTextCoverage(html),
      };

      // E-E-A-T signals detection
      const eeatSignals = {
        authorBio: /author|by:|written by/i.test(html),
        citations: /\[[\d,\s]+\]|<sup>|<cite>/.test(html),
        experienceEvidence: /experience|tested|tried|review/i.test(html),
        expertise: /expert|certified|professional|qualification/i.test(html),
      };

      // AI Overview readiness score
      const aiOverviewReadiness = this.calculateAIOReadiness(html, seoChecks, eeatSignals);

      // Generate fix-it items
      const fixItItems = this.generateFixItItems(seoChecks, coreWebVitals, eeatSignals);

      const result: SiteAuditResult = {
        pageUrl,
        coreWebVitals,
        seoChecks,
        eeatSignals,
        aiOverviewReadiness,
        fixItItems,
      };

      console.log(`✅ Site audit complete for ${pageUrl} - Score: ${coreWebVitals.score}`);
      return result;
    } catch (error) {
      console.error(`❌ Error auditing site ${pageUrl}:`, error);
      throw new Error(`Site audit failed: ${error.message}`);
    }
  }

  /**
   * Find SEO opportunities from GSC data
   */
  async findSEOOpportunities(gscData: any[]): Promise<SEOOpportunity[]> {
    try {
      console.log('🎯 Analyzing SEO opportunities...');
      
      const opportunities: SEOOpportunity[] = [];
      
      for (const row of gscData) {
        const [pageUrl, query] = row.keys;
        const { impressions, clicks, ctr, position } = row;
        
        // High-value opportunity criteria
        if (
          position >= 5 && position <= 15 && // Page 1-2 ranking
          impressions >= 100 && // Decent search volume
          ctr < 0.03 // Low CTR indicates opportunity
        ) {
          const potentialImpact = impressions * (0.05 - ctr) * position; // Rough impact score
          
          opportunities.push({
            id: `${pageUrl}-${query}`.replace(/[^a-zA-Z0-9]/g, '-'),
            pageUrl,
            query,
            currentPosition: position,
            impressions,
            ctr,
            priority: potentialImpact > 1000 ? 'high' : potentialImpact > 500 ? 'medium' : 'low',
            potentialImpact,
            suggestedActions: [
              'Optimize title tag for target query',
              'Add FAQ section with JSON-LD markup',
              'Improve internal linking',
              'Add experience evidence and E-E-A-T signals',
            ],
            briefGenerated: false,
          });
        }
      }
      
      // Sort by potential impact
      opportunities.sort((a, b) => b.potentialImpact - a.potentialImpact);
      
      console.log(`✅ Found ${opportunities.length} SEO opportunities`);
      return opportunities.slice(0, 50); // Top 50 opportunities
    } catch (error) {
      console.error('❌ Error finding SEO opportunities:', error);
      return [];
    }
  }

  /**
   * Generate AI-powered content brief
   */
  async generateContentBrief(pageUrl: string, targetQuery: string, gscQueries: string[] = []): Promise<ContentBrief> {
    try {
      console.log(`✍️ Generating content brief for "${targetQuery}" on ${pageUrl}`);
      
      // Fetch competing pages for analysis
      const competitorAnalysis = await this.analyzeCompetitors(targetQuery);
      
      const prompt = `
Generate a comprehensive SEO content brief for optimizing this page:

Target Query: "${targetQuery}"
Page URL: ${pageUrl}
Related Queries: ${gscQueries.join(', ')}

Competitor Analysis: ${JSON.stringify(competitorAnalysis)}

Please provide:
1. Optimized title tag (max 60 characters)
2. Meta description (max 155 characters)  
3. Content outline with H2/H3 structure
4. Key entities to include
5. 5 FAQ questions with answers
6. JSON-LD schema markup
7. 3-5 sentence AI Overview snippet
8. Internal linking suggestions

Focus on E-E-A-T signals, user intent, and AI Overview readiness.
Format as JSON with clear structure.
`;

      const response = await openaiService.generateChatCompletion([
        { role: 'system', content: 'You are an expert SEO content strategist and technical SEO specialist.' },
        { role: 'user', content: prompt }
      ], {
        response_format: { type: "json_object" }
      });

      const briefData = JSON.parse(response);
      
      const brief: ContentBrief = {
        targetQuery,
        pageUrl,
        title: briefData.title || '',
        metaDescription: briefData.metaDescription || '',
        outline: briefData.outline || [],
        entities: briefData.entities || [],
        faqs: briefData.faqs || [],
        jsonLD: briefData.jsonLD || {},
        aiOverviewSnippet: briefData.aiOverviewSnippet || '',
        internalLinks: briefData.internalLinks || [],
      };

      console.log(`✅ Content brief generated for "${targetQuery}"`);
      return brief;
    } catch (error) {
      console.error(`❌ Error generating content brief:`, error);
      throw new Error(`Content brief generation failed: ${error.message}`);
    }
  }

  /**
   * Analyze campaign performance and generate recommendations
   */
  async analyzeCampaigns(campaignData: any[]): Promise<CampaignInsight[]> {
    try {
      console.log('📈 Analyzing campaign performance...');
      
      const insights: CampaignInsight[] = [];
      
      for (const campaign of campaignData) {
        const roas = campaign.revenue / campaign.spend;
        const cac = campaign.spend / campaign.conversions;
        
        let recommendation: 'increase' | 'decrease' | 'optimize' | 'pause' = 'optimize';
        let suggestedBudgetChange = 0;
        let reasoning = '';
        
        if (roas > 3 && campaign.conversions > 10) {
          recommendation = 'increase';
          suggestedBudgetChange = 25;
          reasoning = 'High ROAS with good conversion volume - scale up';
        } else if (roas < 1.5 && campaign.conversions < 5) {
          recommendation = 'pause';
          suggestedBudgetChange = -100;
          reasoning = 'Low ROAS and poor conversion volume - pause and optimize';
        } else if (roas < 2 && campaign.conversions > 5) {
          recommendation = 'optimize';
          suggestedBudgetChange = -10;
          reasoning = 'Decent volume but low efficiency - optimize targeting and creative';
        }
        
        insights.push({
          platform: campaign.platform,
          campaignId: campaign.campaignId,
          name: campaign.name,
          spend: campaign.spend,
          conversions: campaign.conversions,
          roas,
          cac,
          recommendation,
          suggestedBudgetChange,
          reasoning,
        });
      }
      
      console.log(`✅ Generated insights for ${insights.length} campaigns`);
      return insights;
    } catch (error) {
      console.error('❌ Error analyzing campaigns:', error);
      return [];
    }
  }

  /**
   * Insights Copilot - Natural language query over marketing data
   */
  async queryInsights(question: string, context: any): Promise<string> {
    try {
      console.log(`💬 Processing insights query: "${question}"`);
      
      const prompt = `
You are a marketing data analyst. Answer this question based on the provided data:

Question: "${question}"

Data Context:
${JSON.stringify(context, null, 2)}

Provide a clear, data-driven answer with specific numbers, trends, and actionable recommendations.
Include relevant charts or data visualizations if helpful.
`;

      const response = await openaiService.generateChatCompletion([
        { role: 'system', content: 'You are an expert marketing data analyst with deep knowledge of SEO, PPC, and web analytics.' },
        { role: 'user', content: prompt }
      ]);

      console.log(`✅ Generated insights response for: "${question}"`);
      return response;
    } catch (error) {
      console.error(`❌ Error processing insights query:`, error);
      return 'Sorry, I encountered an error processing your question. Please try again.';
    }
  }

  // Helper methods
  private calculateAltTextCoverage(html: string): number {
    const images = html.match(/<img[^>]*>/g) || [];
    const withAlt = images.filter(img => /alt\s*=\s*["'][^"']*["']/.test(img));
    return images.length > 0 ? (withAlt.length / images.length) * 100 : 100;
  }

  private calculateAIOReadiness(html: string, seoChecks: any, eeatSignals: any): number {
    let score = 0;
    
    // Content quality signals
    if (seoChecks.wordCount > 1000) score += 20;
    if (seoChecks.hasSchema) score += 15;
    if (html.includes('FAQ')) score += 15;
    
    // E-E-A-T signals
    if (eeatSignals.authorBio) score += 10;
    if (eeatSignals.citations) score += 10;
    if (eeatSignals.experienceEvidence) score += 15;
    if (eeatSignals.expertise) score += 15;
    
    return Math.min(score, 100);
  }

  private generateFixItItems(seoChecks: any, coreWebVitals: any, eeatSignals: any): any[] {
    const items = [];
    
    if (coreWebVitals.lcp > 2500) {
      items.push({
        type: 'performance',
        priority: 'high' as const,
        description: `Improve Largest Contentful Paint from ${Math.round(coreWebVitals.lcp)}ms to <2.5s`,
        implementation: 'Optimize images, use CDN, compress resources',
      });
    }
    
    if (!seoChecks.hasSchema) {
      items.push({
        type: 'seo',
        priority: 'high' as const,
        description: 'Add structured data markup (JSON-LD)',
        implementation: 'Implement Article, FAQPage, or Product schema',
      });
    }
    
    if (!eeatSignals.authorBio) {
      items.push({
        type: 'content',
        priority: 'medium' as const,
        description: 'Add author bio and credentials',
        implementation: 'Include author information with expertise details',
      });
    }
    
    if (seoChecks.altTextCoverage < 90) {
      items.push({
        type: 'seo',
        priority: 'medium' as const,
        description: `Improve alt text coverage from ${Math.round(seoChecks.altTextCoverage)}% to 100%`,
        implementation: 'Add descriptive alt text to all images',
      });
    }
    
    return items;
  }

  private async analyzeCompetitors(query: string): Promise<any> {
    // In a real implementation, this would scrape SERP results
    // For now, return mock competitive analysis
    return {
      topResults: [
        { title: 'Competitor 1 Title', url: 'https://example.com/1' },
        { title: 'Competitor 2 Title', url: 'https://example.com/2' },
      ],
      commonHeadings: ['What is', 'How to', 'Benefits', 'Best practices'],
      averageWordCount: 2500,
      commonEntities: ['SEO', 'content', 'optimization', 'Google'],
    };
  }
}

export const seoMarketingService = new SEOMarketingIntelligenceService();