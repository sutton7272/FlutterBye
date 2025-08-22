import { pgTable, varchar, timestamp, jsonb, integer, text, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enterprise Clients Table
export const enterpriseClients = pgTable("enterprise_clients", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 100 }).notNull(),
  companySize: varchar("company_size", { length: 50 }).notNull(),
  website: varchar("website", { length: 500 }),
  description: text("description"),
  
  // API Configuration
  apiKey: varchar("api_key", { length: 100 }).notNull().unique(),
  apiSecretHash: varchar("api_secret_hash", { length: 255 }).notNull(),
  rateLimitTier: varchar("rate_limit_tier", { length: 50 }).default("standard"),
  
  // Subscription & Billing
  subscriptionTier: varchar("subscription_tier", { length: 50 }).notNull(),
  monthlySpend: integer("monthly_spend").default(0),
  billingCycle: varchar("billing_cycle", { length: 20 }).default("monthly"),
  contractValue: integer("contract_value").default(0),
  contractStartDate: timestamp("contract_start_date"),
  contractEndDate: timestamp("contract_end_date"),
  
  // Status & Configuration
  status: varchar("status", { length: 20 }).default("active"),
  whiteLabel: boolean("white_label").default(false),
  customBranding: jsonb("custom_branding"),
  allowedDomains: jsonb("allowed_domains"),
  
  // Blockchain Configuration
  supportedChains: jsonb("supported_chains").default("[]"),
  walletTypes: jsonb("wallet_types").default("[]"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign Intelligence Table
export const campaignIntelligence = pgTable("campaign_intelligence", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  clientId: varchar("client_id").references(() => enterpriseClients.id),
  campaignName: varchar("campaign_name", { length: 255 }).notNull(),
  campaignType: varchar("campaign_type", { length: 100 }).notNull(),
  
  // Campaign Configuration
  targetChains: jsonb("target_chains").default("[]"),
  targetAudience: jsonb("target_audience"),
  budget: integer("budget").default(0),
  duration: integer("duration"), // days
  objectives: jsonb("objectives"),
  
  // AI Analysis Results
  aiPredictions: jsonb("ai_predictions"),
  performanceScore: integer("performance_score"), // 0-100
  riskAssessment: jsonb("risk_assessment"),
  competitorAnalysis: jsonb("competitor_analysis"),
  audienceInsights: jsonb("audience_insights"),
  
  // Real-time Metrics
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  walletConnections: integer("wallet_connections").default(0),
  totalReach: integer("total_reach").default(0),
  
  // Status
  status: varchar("status", { length: 50 }).default("draft"),
  launchDate: timestamp("launch_date"),
  endDate: timestamp("end_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API Usage Analytics Table
export const apiUsageAnalytics = pgTable("api_usage_analytics", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  clientId: varchar("client_id").references(() => enterpriseClients.id),
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  method: varchar("method", { length: 10 }).notNull(),
  requestCount: integer("request_count").default(1),
  responseTime: integer("response_time"), // milliseconds
  statusCode: integer("status_code"),
  errorRate: integer("error_rate").default(0),
  dataTransferred: integer("data_transferred").default(0), // bytes
  
  // Time-based metrics
  hourlyUsage: jsonb("hourly_usage").default("{}"),
  dailyUsage: jsonb("daily_usage").default("{}"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign Recommendations Table
export const campaignRecommendations = pgTable("campaign_recommendations", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  campaignId: varchar("campaign_id").references(() => campaignIntelligence.id),
  clientId: varchar("client_id").references(() => enterpriseClients.id),
  
  // Recommendation Details
  type: varchar("type", { length: 100 }).notNull(), // budget, audience, timing, etc.
  priority: varchar("priority", { length: 20 }).default("medium"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  
  // AI Analysis
  confidence: integer("confidence"), // 0-100
  expectedImpact: jsonb("expected_impact"),
  implementation: jsonb("implementation"),
  
  // Status
  status: varchar("status", { length: 20 }).default("pending"),
  implementedAt: timestamp("implemented_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Competitor Intelligence Table
export const competitorIntelligence = pgTable("competitor_intelligence", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  clientId: varchar("client_id").references(() => enterpriseClients.id),
  
  // Competitor Details
  competitorName: varchar("competitor_name", { length: 255 }).notNull(),
  competitorDomain: varchar("competitor_domain", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  
  // Intelligence Data
  walletAddresses: jsonb("wallet_addresses").default("[]"),
  campaignActivity: jsonb("campaign_activity"),
  marketShare: integer("market_share"), // percentage
  audienceOverlap: integer("audience_overlap"), // percentage
  
  // Performance Metrics
  estimatedBudget: integer("estimated_budget"),
  reach: integer("reach"),
  engagement: integer("engagement"),
  conversionRate: integer("conversion_rate"), // basis points
  
  // AI Insights
  strengths: jsonb("strengths"),
  weaknesses: jsonb("weaknesses"),
  opportunities: jsonb("opportunities"),
  threats: jsonb("threats"),
  
  lastAnalyzed: timestamp("last_analyzed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// White Label Configurations Table
export const whiteLabelConfigs = pgTable("white_label_configs", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  clientId: varchar("client_id").references(() => enterpriseClients.id).unique(),
  
  // Branding
  companyLogo: varchar("company_logo", { length: 500 }),
  primaryColor: varchar("primary_color", { length: 7 }).default("#3b82f6"),
  secondaryColor: varchar("secondary_color", { length: 7 }).default("#1e40af"),
  accentColor: varchar("accent_color", { length: 7 }).default("#06b6d4"),
  
  // Domain Configuration
  customDomain: varchar("custom_domain", { length: 255 }),
  sslCertificate: text("ssl_certificate"),
  
  // Dashboard Customization
  dashboardTitle: varchar("dashboard_title", { length: 255 }).default("Marketing Intelligence"),
  welcomeMessage: text("welcome_message"),
  customCss: text("custom_css"),
  
  // Features Configuration
  enabledFeatures: jsonb("enabled_features").default("[]"),
  hiddenFeatures: jsonb("hidden_features").default("[]"),
  customMenuItems: jsonb("custom_menu_items").default("[]"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type EnterpriseClient = typeof enterpriseClients.$inferSelect;
export type InsertEnterpriseClient = typeof enterpriseClients.$inferInsert;
export type CampaignIntelligence = typeof campaignIntelligence.$inferSelect;
export type InsertCampaignIntelligence = typeof campaignIntelligence.$inferInsert;
export type ApiUsageAnalytics = typeof apiUsageAnalytics.$inferSelect;
export type InsertApiUsageAnalytics = typeof apiUsageAnalytics.$inferInsert;
export type CampaignRecommendations = typeof campaignRecommendations.$inferSelect;
export type InsertCampaignRecommendations = typeof campaignRecommendations.$inferInsert;
export type CompetitorIntelligence = typeof competitorIntelligence.$inferSelect;
export type InsertCompetitorIntelligence = typeof competitorIntelligence.$inferInsert;
export type WhiteLabelConfig = typeof whiteLabelConfigs.$inferSelect;
export type InsertWhiteLabelConfig = typeof whiteLabelConfigs.$inferInsert;

// Zod schemas
export const insertEnterpriseClientSchema = createInsertSchema(enterpriseClients).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertCampaignIntelligenceSchema = createInsertSchema(campaignIntelligence).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertCampaignRecommendationsSchema = createInsertSchema(campaignRecommendations).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});