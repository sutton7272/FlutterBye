import { Router } from "express";
import { enterpriseService } from "./enterprise-service";
import { insertEnterpriseClientSchema, insertCampaignIntelligenceSchema } from "@shared/enterprise-schema";
import { z } from "zod";

const router = Router();

// Enterprise Client Management Routes

// Get all clients
router.get('/clients', async (req, res) => {
  try {
    const clients = await enterpriseService.getClients();
    res.json({ success: true, clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch clients' });
  }
});

// Get client by ID
router.get('/clients/:id', async (req, res) => {
  try {
    const client = await enterpriseService.getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    res.json({ success: true, client });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch client' });
  }
});

// Create new client
router.post('/clients', async (req, res) => {
  try {
    const validatedData = insertEnterpriseClientSchema.parse(req.body);
    const client = await enterpriseService.createClient(validatedData);
    res.json({ success: true, client });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid data', details: error.errors });
    }
    console.error('Error creating client:', error);
    res.status(500).json({ success: false, error: 'Failed to create client' });
  }
});

// Update client
router.put('/clients/:id', async (req, res) => {
  try {
    const client = await enterpriseService.updateClient(req.params.id, req.body);
    res.json({ success: true, client });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ success: false, error: 'Failed to update client' });
  }
});

// Delete client
router.delete('/clients/:id', async (req, res) => {
  try {
    await enterpriseService.deleteClient(req.params.id);
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ success: false, error: 'Failed to delete client' });
  }
});

// Campaign Intelligence Routes

// Get campaigns for client
router.get('/clients/:clientId/campaigns', async (req, res) => {
  try {
    const campaigns = await enterpriseService.getCampaignsByClient(req.params.clientId);
    res.json({ success: true, campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch campaigns' });
  }
});

// Create new campaign with AI analysis
router.post('/clients/:clientId/campaigns', async (req, res) => {
  try {
    const campaignData = {
      ...req.body,
      clientId: req.params.clientId,
    };
    
    const validatedData = insertCampaignIntelligenceSchema.parse(campaignData);
    const campaign = await enterpriseService.createCampaign(validatedData);
    
    res.json({ success: true, campaign });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid data', details: error.errors });
    }
    console.error('Error creating campaign:', error);
    res.status(500).json({ success: false, error: 'Failed to create campaign' });
  }
});

// Get campaign by ID
router.get('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await enterpriseService.getCampaignById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    res.json({ success: true, campaign });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch campaign' });
  }
});

// Update campaign
router.put('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await enterpriseService.updateCampaign(req.params.id, req.body);
    res.json({ success: true, campaign });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ success: false, error: 'Failed to update campaign' });
  }
});

// Generate campaign recommendations
router.post('/campaigns/:id/recommendations', async (req, res) => {
  try {
    await enterpriseService.generateCampaignRecommendations(req.params.id);
    res.json({ success: true, message: 'Recommendations generated successfully' });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ success: false, error: 'Failed to generate recommendations' });
  }
});

// Whale influence analysis
router.get('/campaigns/:id/whale-analysis', async (req, res) => {
  try {
    const analysis = await enterpriseService.analyzeWhaleInfluence(req.params.id);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Error analyzing whale influence:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze whale influence' });
  }
});

// Cross-chain analytics
router.get('/clients/:clientId/cross-chain-analytics', async (req, res) => {
  try {
    const analytics = await enterpriseService.getCrossChainAnalytics(req.params.clientId);
    res.json({ success: true, analytics });
  } catch (error) {
    console.error('Error fetching cross-chain analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
});

// Competitor analysis
router.post('/clients/:clientId/competitor-analysis', async (req, res) => {
  try {
    const { industry } = req.body;
    const analysis = await enterpriseService.analyzeCompetitors(req.params.clientId, industry);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Error analyzing competitors:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze competitors' });
  }
});

// API Usage Analytics Routes

// Get API usage stats
router.get('/clients/:clientId/api-usage', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await enterpriseService.getApiUsageStats(
      req.params.clientId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching API usage:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch API usage' });
  }
});

// Revenue Analytics
router.get('/revenue-analytics', async (req, res) => {
  try {
    const analytics = await enterpriseService.getRevenueAnalytics();
    res.json({ success: true, analytics });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch revenue analytics' });
  }
});

// Dashboard Overview
router.get('/dashboard/:clientId', async (req, res) => {
  try {
    const clientId = req.params.clientId;
    
    // Fetch comprehensive dashboard data
    const [client, campaigns, crossChainAnalytics, apiUsage] = await Promise.all([
      enterpriseService.getClientById(clientId),
      enterpriseService.getCampaignsByClient(clientId),
      enterpriseService.getCrossChainAnalytics(clientId),
      enterpriseService.getApiUsageStats(clientId),
    ]);

    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    // Calculate summary metrics
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
    const averagePerformance = campaigns.length > 0 
      ? Math.round(campaigns.reduce((sum, c) => sum + (c.performanceScore || 0), 0) / campaigns.length)
      : 0;

    const dashboard = {
      client,
      summary: {
        totalCampaigns,
        activeCampaigns,
        totalBudget,
        totalConversions,
        averagePerformance,
        monthlySpend: client.monthlySpend,
        contractValue: client.contractValue,
      },
      campaigns: campaigns.slice(0, 5), // Recent campaigns
      crossChainAnalytics,
      apiUsage,
    };

    res.json({ success: true, dashboard });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
  }
});

export { router };