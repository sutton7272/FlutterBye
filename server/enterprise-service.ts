import { db } from "./db";
import { 
  enterpriseClients, 
  campaignIntelligence, 
  apiUsageAnalytics, 
  campaignRecommendations,
  competitorIntelligence,
  whiteLabelConfigs,
  type EnterpriseClient,
  type InsertEnterpriseClient,
  type CampaignIntelligence,
  type InsertCampaignIntelligence
} from "@shared/enterprise-schema";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";
import { randomBytes } from "crypto";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export class EnterpriseService {
  
  // Client Management
  async createClient(data: InsertEnterpriseClient): Promise<EnterpriseClient> {
    const apiKey = this.generateApiKey();
    const apiSecretHash = this.hashApiSecret(randomBytes(32).toString('hex'));
    
    const [client] = await db
      .insert(enterpriseClients)
      .values({
        ...data,
        apiKey,
        apiSecretHash,
      })
      .returning();
    
    return client;
  }

  async getClients(): Promise<EnterpriseClient[]> {
    return await db
      .select()
      .from(enterpriseClients)
      .orderBy(desc(enterpriseClients.createdAt));
  }

  async getClientById(id: string): Promise<EnterpriseClient | undefined> {
    const [client] = await db
      .select()
      .from(enterpriseClients)
      .where(eq(enterpriseClients.id, id));
    return client;
  }

  async updateClient(id: string, data: Partial<InsertEnterpriseClient>): Promise<EnterpriseClient> {
    const [client] = await db
      .update(enterpriseClients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(enterpriseClients.id, id))
      .returning();
    return client;
  }

  async deleteClient(id: string): Promise<void> {
    await db.delete(enterpriseClients).where(eq(enterpriseClients.id, id));
  }

  // Campaign Intelligence
  async createCampaign(data: InsertCampaignIntelligence): Promise<CampaignIntelligence> {
    // Generate AI predictions
    const aiPredictions = await this.generateCampaignPredictions(data);
    
    const [campaign] = await db
      .insert(campaignIntelligence)
      .values({
        ...data,
        aiPredictions,
        performanceScore: aiPredictions.expectedScore || 75,
      })
      .returning();
    
    // Generate initial recommendations
    await this.generateCampaignRecommendations(campaign.id);
    
    return campaign;
  }

  async getCampaignsByClient(clientId: string): Promise<CampaignIntelligence[]> {
    return await db
      .select()
      .from(campaignIntelligence)
      .where(eq(campaignIntelligence.clientId, clientId))
      .orderBy(desc(campaignIntelligence.createdAt));
  }

  async getCampaignById(id: string): Promise<CampaignIntelligence | undefined> {
    const [campaign] = await db
      .select()
      .from(campaignIntelligence)
      .where(eq(campaignIntelligence.id, id));
    return campaign;
  }

  async updateCampaign(id: string, data: Partial<InsertCampaignIntelligence>): Promise<CampaignIntelligence> {
    const [campaign] = await db
      .update(campaignIntelligence)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(campaignIntelligence.id, id))
      .returning();
    return campaign;
  }

  // AI Campaign Analysis
  private async generateCampaignPredictions(campaignData: InsertCampaignIntelligence): Promise<any> {
    try {
      const prompt = `
        Analyze this Web3 marketing campaign and provide detailed predictions:
        
        Campaign: ${campaignData.campaignName}
        Type: ${campaignData.campaignType}
        Budget: $${campaignData.budget}
        Duration: ${campaignData.duration} days
        Target Chains: ${JSON.stringify(campaignData.targetChains)}
        Objectives: ${JSON.stringify(campaignData.objectives)}
        
        Provide analysis in JSON format with:
        1. expectedScore (0-100)
        2. roiPrediction (percentage)
        3. riskFactors (array)
        4. successProbability (percentage)
        5. optimizationSuggestions (array)
        6. targetAudienceInsights
        7. timingRecommendations
        8. budgetAllocation
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1500,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI prediction error:', error);
      return {
        expectedScore: 75,
        roiPrediction: 15,
        riskFactors: ['Market volatility', 'Regulatory uncertainty'],
        successProbability: 70
      };
    }
  }

  async generateCampaignRecommendations(campaignId: string): Promise<void> {
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) return;

    try {
      const prompt = `
        Generate actionable recommendations for this Web3 marketing campaign:
        
        Campaign: ${campaign.campaignName}
        Current Performance Score: ${campaign.performanceScore}
        AI Predictions: ${JSON.stringify(campaign.aiPredictions)}
        
        Generate 5 specific recommendations in JSON array format:
        [
          {
            "type": "budget|audience|timing|content|technical",
            "priority": "high|medium|low",
            "title": "Recommendation title",
            "description": "Detailed description",
            "confidence": 0-100,
            "expectedImpact": {
              "metric": "value",
              "improvement": "percentage"
            },
            "implementation": {
              "steps": ["step1", "step2"],
              "timeframe": "hours/days",
              "resources": ["resource1"]
            }
          }
        ]
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      });

      const recommendations = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
      
      // Insert recommendations
      for (const rec of recommendations.recommendations || []) {
        await db.insert(campaignRecommendations).values({
          campaignId: campaign.id,
          clientId: campaign.clientId,
          type: rec.type,
          priority: rec.priority,
          title: rec.title,
          description: rec.description,
          confidence: rec.confidence,
          expectedImpact: rec.expectedImpact,
          implementation: rec.implementation,
        });
      }
    } catch (error) {
      console.error('Recommendation generation error:', error);
    }
  }

  // Competitor Analysis
  async analyzeCompetitors(clientId: string, industry: string): Promise<any> {
    try {
      const prompt = `
        Analyze competitors in the ${industry} Web3/blockchain space:
        
        Provide competitor intelligence in JSON format:
        {
          "competitors": [
            {
              "name": "Competitor name",
              "marketShare": 0-100,
              "strengths": ["strength1", "strength2"],
              "weaknesses": ["weakness1", "weakness2"],
              "estimatedBudget": "monthly budget estimate",
              "keyStrategies": ["strategy1", "strategy2"],
              "audienceOverlap": 0-100,
              "threatLevel": "high|medium|low"
            }
          ],
          "marketInsights": {
            "totalMarketSize": "estimate",
            "growthRate": "percentage",
            "keyTrends": ["trend1", "trend2"],
            "opportunities": ["opp1", "opp2"]
          }
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Competitor analysis error:', error);
      return { competitors: [], marketInsights: {} };
    }
  }

  // API Usage Analytics
  async trackApiUsage(clientId: string, endpoint: string, method: string, responseTime: number, statusCode: number): Promise<void> {
    await db.insert(apiUsageAnalytics).values({
      clientId,
      endpoint,
      method,
      responseTime,
      statusCode,
      errorRate: statusCode >= 400 ? 1 : 0,
    });
  }

  async getApiUsageStats(clientId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const conditions = [eq(apiUsageAnalytics.clientId, clientId)];
    
    if (startDate) {
      conditions.push(gte(apiUsageAnalytics.createdAt, startDate));
    }
    if (endDate) {
      conditions.push(lte(apiUsageAnalytics.createdAt, endDate));
    }

    const usage = await db
      .select({
        totalRequests: sql<number>`count(*)`,
        averageResponseTime: sql<number>`avg(${apiUsageAnalytics.responseTime})`,
        errorRate: sql<number>`avg(${apiUsageAnalytics.errorRate}) * 100`,
        endpoint: apiUsageAnalytics.endpoint,
      })
      .from(apiUsageAnalytics)
      .where(and(...conditions))
      .groupBy(apiUsageAnalytics.endpoint);

    return usage;
  }

  // Revenue Intelligence
  async getRevenueAnalytics(): Promise<any> {
    const clients = await db
      .select({
        totalClients: sql<number>`count(*)`,
        totalRevenue: sql<number>`sum(${enterpriseClients.contractValue})`,
        averageContractValue: sql<number>`avg(${enterpriseClients.contractValue})`,
        subscriptionTier: enterpriseClients.subscriptionTier,
        industry: enterpriseClients.industry,
      })
      .from(enterpriseClients)
      .where(eq(enterpriseClients.status, 'active'))
      .groupBy(enterpriseClients.subscriptionTier, enterpriseClients.industry);

    return clients;
  }

  // Utility Methods
  private generateApiKey(): string {
    return `flby_${randomBytes(16).toString('hex')}`;
  }

  private hashApiSecret(secret: string): string {
    // In production, use proper hashing like bcrypt
    return Buffer.from(secret).toString('base64');
  }

  // Cross-Chain Analytics
  async getCrossChainAnalytics(clientId: string): Promise<any> {
    const campaigns = await this.getCampaignsByClient(clientId);
    
    const chainAnalytics = campaigns.reduce((acc: any, campaign) => {
      const chains = campaign.targetChains as string[] || [];
      chains.forEach(chain => {
        if (!acc[chain]) {
          acc[chain] = {
            totalCampaigns: 0,
            totalBudget: 0,
            totalConversions: 0,
            averagePerformance: 0,
          };
        }
        acc[chain].totalCampaigns++;
        acc[chain].totalBudget += campaign.budget || 0;
        acc[chain].totalConversions += campaign.conversions || 0;
        acc[chain].averagePerformance += campaign.performanceScore || 0;
      });
      return acc;
    }, {});

    // Calculate averages
    Object.keys(chainAnalytics).forEach(chain => {
      chainAnalytics[chain].averagePerformance = Math.round(
        chainAnalytics[chain].averagePerformance / chainAnalytics[chain].totalCampaigns
      );
    });

    return chainAnalytics;
  }

  // Whale Influence Scoring
  async analyzeWhaleInfluence(campaignId: string): Promise<any> {
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) return null;

    // This would integrate with wallet intelligence data
    try {
      const prompt = `
        Analyze whale influence potential for this Web3 marketing campaign:
        
        Campaign: ${campaign.campaignName}
        Target Chains: ${JSON.stringify(campaign.targetChains)}
        Budget: ${campaign.budget}
        
        Provide whale influence analysis in JSON:
        {
          "whaleSegments": [
            {
              "type": "DeFi Whales|NFT Collectors|Institutional|Retail Whales",
              "count": "estimated count",
              "influence": 0-100,
              "reachability": 0-100,
              "expectedImpact": "description"
            }
          ],
          "recommendations": [
            "specific targeting recommendation"
          ],
          "estimatedViralCoefficient": 0-10
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Whale analysis error:', error);
      return null;
    }
  }
}

export const enterpriseService = new EnterpriseService();