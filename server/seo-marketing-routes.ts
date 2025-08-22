import express from 'express';
import { seoMarketingService } from './seo-marketing-intelligence';
import { storage } from './storage';

const router = express.Router();

/**
 * SEO & Marketing Intelligence API Routes for FlutterAI
 * Comprehensive analytics, optimization, and campaign intelligence
 */

// Connect external platforms
router.post('/connect/google', async (req, res) => {
  try {
    const { authCode } = req.body;
    
    if (!authCode) {
      return res.status(400).json({ error: 'Authorization code required' });
    }
    
    await seoMarketingService.connectGoogle(authCode);
    
    res.json({ 
      success: true, 
      message: 'Google APIs connected successfully' 
    });
  } catch (error) {
    console.error('Error connecting Google APIs:', error);
    res.status(500).json({ error: 'Failed to connect Google APIs' });
  }
});

// ETL Operations
router.post('/etl/run', async (req, res) => {
  try {
    const { siteUrl, propertyId, startDate, endDate } = req.body;
    
    if (!siteUrl || !startDate || !endDate) {
      return res.status(400).json({ error: 'siteUrl, startDate, and endDate are required' });
    }
    
    console.log('🔄 Starting ETL process...');
    
    // Pull GSC data
    const gscData = await seoMarketingService.pullGSCData(siteUrl, startDate, endDate);
    
    // Pull GA4 data if propertyId provided
    let ga4Data = [];
    if (propertyId) {
      ga4Data = await seoMarketingService.pullGA4Data(propertyId, startDate, endDate);
    }
    
    // Store data (in a real implementation, you'd save to database)
    const result = {
      gscRecords: gscData.length,
      ga4Records: ga4Data.length,
      dateRange: { startDate, endDate },
      lastUpdated: new Date().toISOString(),
    };
    
    console.log('✅ ETL process completed');
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error running ETL:', error);
    res.status(500).json({ error: 'ETL process failed' });
  }
});

// Site audit
router.post('/audit/scan', async (req, res) => {
  try {
    const { pageUrl } = req.body;
    
    if (!pageUrl) {
      return res.status(400).json({ error: 'pageUrl is required' });
    }
    
    const auditResult = await seoMarketingService.auditSite(pageUrl);
    
    res.json({ 
      success: true, 
      data: auditResult 
    });
  } catch (error) {
    console.error('Error auditing site:', error);
    res.status(500).json({ error: 'Site audit failed' });
  }
});

// SEO opportunities
router.get('/opportunities/seo', async (req, res) => {
  try {
    const { siteUrl, startDate, endDate } = req.query;
    
    if (!siteUrl || !startDate || !endDate) {
      return res.status(400).json({ error: 'siteUrl, startDate, and endDate are required' });
    }
    
    // Pull fresh GSC data
    const gscData = await seoMarketingService.pullGSCData(
      siteUrl as string, 
      startDate as string, 
      endDate as string
    );
    
    // Find opportunities
    const opportunities = await seoMarketingService.findSEOOpportunities(gscData);
    
    res.json({ 
      success: true, 
      data: {
        opportunities,
        totalCount: opportunities.length,
        highPriority: opportunities.filter(o => o.priority === 'high').length,
        mediumPriority: opportunities.filter(o => o.priority === 'medium').length,
        lowPriority: opportunities.filter(o => o.priority === 'low').length,
      }
    });
  } catch (error) {
    console.error('Error finding SEO opportunities:', error);
    res.status(500).json({ error: 'Failed to find SEO opportunities' });
  }
});

// Generate content brief
router.post('/content/brief', async (req, res) => {
  try {
    const { pageUrl, targetQuery, gscQueries } = req.body;
    
    if (!pageUrl || !targetQuery) {
      return res.status(400).json({ error: 'pageUrl and targetQuery are required' });
    }
    
    const brief = await seoMarketingService.generateContentBrief(
      pageUrl, 
      targetQuery, 
      gscQueries || []
    );
    
    res.json({ 
      success: true, 
      data: brief 
    });
  } catch (error) {
    console.error('Error generating content brief:', error);
    res.status(500).json({ error: 'Content brief generation failed' });
  }
});

// Campaign analytics
router.get('/campaigns/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Mock campaign data for demonstration
    // In real implementation, this would pull from ads platforms
    const mockCampaignData = [
      {
        platform: 'Google Ads',
        campaignId: 'gad-001',
        name: 'FlutterAI Keyword Campaign',
        spend: 5000,
        conversions: 25,
        revenue: 15000,
      },
      {
        platform: 'Meta Ads',
        campaignId: 'meta-001',
        name: 'FlutterAI Social Campaign',
        spend: 3000,
        conversions: 18,
        revenue: 9000,
      },
      {
        platform: 'X Ads',
        campaignId: 'x-001',
        name: 'FlutterAI Brand Campaign',
        spend: 2000,
        conversions: 8,
        revenue: 4000,
      },
    ];
    
    const insights = await seoMarketingService.analyzeCampaigns(mockCampaignData);
    
    // Calculate summary metrics
    const totalSpend = mockCampaignData.reduce((sum, c) => sum + c.spend, 0);
    const totalRevenue = mockCampaignData.reduce((sum, c) => sum + c.revenue, 0);
    const totalConversions = mockCampaignData.reduce((sum, c) => sum + c.conversions, 0);
    const blendedROAS = totalRevenue / totalSpend;
    const blendedCAC = totalSpend / totalConversions;
    
    res.json({ 
      success: true, 
      data: {
        insights,
        summary: {
          totalSpend,
          totalRevenue,
          totalConversions,
          blendedROAS: Math.round(blendedROAS * 100) / 100,
          blendedCAC: Math.round(blendedCAC * 100) / 100,
        },
        recommendations: insights.filter(i => i.recommendation === 'increase' || i.recommendation === 'decrease'),
      }
    });
  } catch (error) {
    console.error('Error analyzing campaigns:', error);
    res.status(500).json({ error: 'Campaign analysis failed' });
  }
});

// Budget recommendations
router.post('/recommendations/budget', async (req, res) => {
  try {
    const { campaignData, constraints } = req.body;
    
    if (!campaignData || !Array.isArray(campaignData)) {
      return res.status(400).json({ error: 'campaignData array is required' });
    }
    
    const insights = await seoMarketingService.analyzeCampaigns(campaignData);
    
    // Generate budget shift recommendations
    const recommendations = insights
      .filter(insight => Math.abs(insight.suggestedBudgetChange) > 0)
      .map(insight => ({
        campaignId: insight.campaignId,
        campaignName: insight.name,
        currentSpend: insight.spend,
        recommendedChange: insight.suggestedBudgetChange,
        newSpend: insight.spend * (1 + insight.suggestedBudgetChange / 100),
        reasoning: insight.reasoning,
        expectedImpact: insight.roas > 2 ? 'positive' : 'neutral',
      }))
      .sort((a, b) => Math.abs(b.recommendedChange) - Math.abs(a.recommendedChange));
    
    res.json({ 
      success: true, 
      data: {
        recommendations,
        totalBudgetChange: recommendations.reduce((sum, r) => sum + (r.newSpend - r.currentSpend), 0),
        implementationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
      }
    });
  } catch (error) {
    console.error('Error generating budget recommendations:', error);
    res.status(500).json({ error: 'Budget recommendations failed' });
  }
});

// Insights Copilot
router.post('/copilot/query', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }
    
    // Provide default context if none given
    const defaultContext = {
      timeRange: 'last 30 days',
      platforms: ['Google Ads', 'Meta Ads', 'X Ads'],
      metrics: ['spend', 'conversions', 'revenue', 'ROAS', 'CAC'],
    };
    
    const response = await seoMarketingService.queryInsights(
      question, 
      context || defaultContext
    );
    
    res.json({ 
      success: true, 
      data: {
        question,
        answer: response,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error processing copilot query:', error);
    res.status(500).json({ error: 'Insights query failed' });
  }
});

// Get growth health score
router.get('/health-score/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    
    if (!domain) {
      return res.status(400).json({ error: 'domain is required' });
    }
    
    // Mock health score calculation
    // In real implementation, this would aggregate various metrics
    const healthMetrics = {
      seoHealth: 85,
      performanceHealth: 78,
      contentHealth: 92,
      campaignHealth: 88,
    };
    
    const overallScore = Math.round(
      (healthMetrics.seoHealth + 
       healthMetrics.performanceHealth + 
       healthMetrics.contentHealth + 
       healthMetrics.campaignHealth) / 4
    );
    
    res.json({ 
      success: true, 
      data: {
        domain,
        overallScore,
        metrics: healthMetrics,
        grade: overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : 'D',
        recommendations: [
          'Improve Core Web Vitals performance',
          'Add more structured data markup',
          'Optimize low-performing ad campaigns',
        ],
        lastUpdated: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error calculating health score:', error);
    res.status(500).json({ error: 'Health score calculation failed' });
  }
});

// Export router
export default router;