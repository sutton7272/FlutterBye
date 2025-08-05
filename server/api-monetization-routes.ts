import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

// Mock data for enterprise sales
const enterpriseProspects = [
  {
    id: 'prospect-001',
    companyName: 'Goldman Sachs Digital Assets',
    contactName: 'Sarah Chen',
    email: 'sarah.chen@gs.com',
    phone: '+1-212-555-0123',
    industry: 'Investment Banking',
    companySize: '1000+ employees',
    dealValue: 2500000,
    stage: 'proposal',
    priority: 'high',
    lastContact: new Date('2024-07-28'),
    nextFollowUp: new Date('2024-08-05'),
    notes: 'Interested in real-time cross-chain analytics for institutional trading. Requires SOC 2 compliance and dedicated support.',
    requirements: ['Real-time Data', 'SOC 2 Compliance', 'Dedicated Support', 'Custom Integration'],
    proposedSolution: 'Enterprise Intelligence Platform with dedicated infrastructure',
    createdAt: new Date('2024-07-15'),
    estimatedCloseDate: new Date('2024-08-30')
  },
  {
    id: 'prospect-002',
    companyName: 'Fidelity Digital Assets',
    contactName: 'Michael Rodriguez',
    email: 'michael.rodriguez@fidelity.com',
    phone: '+1-617-555-0456',
    industry: 'Asset Management',
    companySize: '1000+ employees',
    dealValue: 1800000,
    stage: 'demo',
    priority: 'high',
    lastContact: new Date('2024-07-30'),
    nextFollowUp: new Date('2024-08-02'),
    notes: 'Looking for comprehensive wallet intelligence and risk assessment tools for custody services.',
    requirements: ['Wallet Intelligence', 'Risk Assessment', 'Compliance Tools', 'API Access'],
    proposedSolution: 'Pro tier with custom compliance features',
    createdAt: new Date('2024-07-20'),
    estimatedCloseDate: new Date('2024-09-15')
  },
  {
    id: 'prospect-003',
    companyName: 'Chainalysis Inc',
    contactName: 'Dr. Lisa Wang',
    email: 'lisa.wang@chainalysis.com',
    phone: '+1-415-555-0789',
    industry: 'Fintech',
    companySize: '201-1000 employees',
    dealValue: 950000,
    stage: 'negotiation',
    priority: 'medium',
    lastContact: new Date('2024-07-29'),
    nextFollowUp: new Date('2024-08-01'),
    notes: 'Partnership opportunity for enhanced multi-chain coverage. Discussing white-label integration.',
    requirements: ['Multi-chain Analytics', 'White-label Solution', 'Partnership Terms'],
    proposedSolution: 'Strategic partnership with revenue sharing',
    createdAt: new Date('2024-07-10'),
    estimatedCloseDate: new Date('2024-08-20')
  }
];

const apiEndpoints = [
  // Intelligence Endpoints
  {
    id: 'wallet-intelligence',
    name: 'Wallet Intelligence Analysis',
    path: '/api/intelligence/wallet/{address}',
    method: 'GET',
    description: 'Comprehensive wallet analysis including risk score, transaction patterns, and behavioral insights',
    category: 'intelligence',
    pricing: { tier: 'pro', pricePerRequest: 0.50, monthlyLimit: 10000, overageRate: 0.75 },
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 60, requestsPerHour: 3600, requestsPerDay: 86400 },
    usage: { requests24h: 2340, requests30d: 78500, revenue30d: 39250 }
  },
  {
    id: 'risk-scoring',
    name: 'Real-time Risk Scoring',
    path: '/api/intelligence/risk-score/{address}',
    method: 'GET',
    description: 'AI-powered risk assessment with confidence scores and compliance flags',
    category: 'intelligence',
    pricing: { tier: 'basic', pricePerRequest: 0.25, monthlyLimit: 50000, overageRate: 0.35 },
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 100, requestsPerHour: 6000, requestsPerDay: 144000 },
    usage: { requests24h: 5670, requests30d: 167000, revenue30d: 41750 }
  },
  
  // Analytics Endpoints
  {
    id: 'cross-chain-analytics',
    name: 'Cross-chain Transaction Analytics',
    path: '/api/analytics/cross-chain/{address}',
    method: 'GET',
    description: 'Multi-chain transaction analysis across 6+ blockchain networks',
    category: 'analytics',
    pricing: { tier: 'pro', pricePerRequest: 0.75, monthlyLimit: 5000, overageRate: 1.00 },
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 30, requestsPerHour: 1800, requestsPerDay: 43200 },
    usage: { requests24h: 1890, requests30d: 45600, revenue30d: 34200 }
  },
  {
    id: 'defi-analytics',
    name: 'DeFi Protocol Analytics',
    path: '/api/analytics/defi/{protocol}',
    method: 'GET',
    description: 'Comprehensive DeFi protocol analysis including TVL, yield opportunities, and risk metrics',
    category: 'analytics',
    pricing: { tier: 'basic', pricePerRequest: 0.30, monthlyLimit: 25000, overageRate: 0.45 },
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 50, requestsPerHour: 3000, requestsPerDay: 72000 },
    usage: { requests24h: 3240, requests30d: 89700, revenue30d: 26910 }
  },

  // Trading Endpoints
  {
    id: 'arbitrage-opportunities',
    name: 'Cross-chain Arbitrage Scanner',
    path: '/api/trading/arbitrage',
    method: 'GET',
    description: 'Real-time arbitrage opportunities across multiple DEXs and chains',
    category: 'trading',
    pricing: { tier: 'enterprise', pricePerRequest: 2.00, monthlyLimit: 1000, overageRate: 3.00 },
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 10, requestsPerHour: 600, requestsPerDay: 14400 },
    usage: { requests24h: 456, requests30d: 12800, revenue30d: 25600 }
  },
  {
    id: 'market-signals',
    name: 'AI Trading Signals',
    path: '/api/trading/signals/{pair}',
    method: 'GET',
    description: 'AI-powered trading signals with confidence scores and risk assessment',
    category: 'trading',
    pricing: { tier: 'pro', pricePerRequest: 1.25, monthlyLimit: 2000, overageRate: 1.75 },
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 20, requestsPerHour: 1200, requestsPerDay: 28800 },
    usage: { requests24h: 890, requests30d: 23400, revenue30d: 29250 }
  },

  // Compliance Endpoints
  {
    id: 'sanctions-screening',
    name: 'OFAC Sanctions Screening',
    path: '/api/compliance/sanctions/{address}',
    method: 'GET',
    description: 'Government-grade sanctions screening with real-time updates',
    category: 'compliance',
    pricing: { tier: 'enterprise', pricePerRequest: 1.50, monthlyLimit: 5000, overageRate: 2.25 },
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 30, requestsPerHour: 1800, requestsPerDay: 43200 },
    usage: { requests24h: 1230, requests30d: 34500, revenue30d: 51750 }
  },
  {
    id: 'kyc-analysis',
    name: 'KYC Risk Analysis',
    path: '/api/compliance/kyc/{address}',
    method: 'POST',
    description: 'Advanced KYC analysis with identity clustering and risk profiling',
    category: 'compliance',
    pricing: { tier: 'pro', pricePerRequest: 0.85, monthlyLimit: 10000, overageRate: 1.20 },
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 40, requestsPerHour: 2400, requestsPerDay: 57600 },
    usage: { requests24h: 1670, requests30d: 43200, revenue30d: 36720 }
  },

  // Premium Endpoints
  {
    id: 'predictive-analytics',
    name: 'AI Predictive Analytics',
    path: '/api/premium/predictions/{address}',
    method: 'GET',
    description: 'Advanced AI predictions for wallet behavior and market movements',
    category: 'premium',
    pricing: { tier: 'enterprise', pricePerRequest: 5.00, monthlyLimit: 500, overageRate: 7.50 },
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 5, requestsPerHour: 300, requestsPerDay: 7200 },
    usage: { requests24h: 234, requests30d: 6780, revenue30d: 33900 }
  }
];

const apiClients = [
  {
    id: 'client-001',
    name: 'Coinbase Institutional',
    email: 'api@coinbase.com',
    tier: 'enterprise',
    apiKey: 'cb_live_9f8e7d6c5b4a3928f1e0d9c8b7a6f5e4d3c2b1a0',
    isActive: true,
    createdAt: new Date('2024-06-15'),
    lastUsed: new Date('2024-07-30'),
    usage: { requests24h: 15340, requests30d: 456700, spend30d: 12847 },
    limits: { requestsPerDay: 100000, requestsPerMonth: 3000000 }
  },
  {
    id: 'client-002',
    name: 'Binance Research',
    email: 'research@binance.com',
    tier: 'pro',
    apiKey: 'bn_live_1a2b3c4d5e6f7890abcdef1234567890fedcba09',
    isActive: true,
    createdAt: new Date('2024-07-01'),
    lastUsed: new Date('2024-07-29'),
    usage: { requests24h: 8970, requests30d: 234500, spend30d: 8765 },
    limits: { requestsPerDay: 50000, requestsPerMonth: 1500000 }
  },
  {
    id: 'client-003',
    name: 'Crypto.com Institutional',
    email: 'institutional@crypto.com',
    tier: 'basic',
    apiKey: 'cdc_live_abcdef1234567890987654321fedcba0123456789',
    isActive: true,
    createdAt: new Date('2024-07-10'),
    lastUsed: new Date('2024-07-30'),
    usage: { requests24h: 4560, requests30d: 127800, spend30d: 3890 },
    limits: { requestsPerDay: 10000, requestsPerMonth: 300000 }
  }
];

// Enterprise Sales Routes
router.get('/enterprise/sales-metrics', (req, res) => {
  const metrics = {
    totalPipeline: 12500000,
    qualifiedLeads: 23,
    activeDeals: 18,
    monthlyRecurring: 347000,
    conversionRate: 34,
    averageDealSize: 543000,
    salesCycle: 42
  };
  
  res.json({ success: true, metrics });
});

router.get('/enterprise/prospects', (req, res) => {
  res.json({ success: true, prospects: enterpriseProspects });
});

router.post('/enterprise/prospects', (req, res) => {
  const newProspect = {
    id: `prospect-${Date.now()}`,
    ...req.body,
    createdAt: new Date(),
    lastContact: new Date(),
    nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  };
  
  enterpriseProspects.push(newProspect);
  
  res.json({ success: true, prospect: newProspect });
});

// API Monetization Routes
router.get('/monetization/metrics', (req, res) => {
  const metrics = {
    totalRevenue: 347500,
    totalRequests: 2340000,
    activeClients: 127,
    avgRevenuePerClient: 2736,
    topEndpoints: [
      { endpoint: '/api/intelligence/risk-score/{address}', requests: 167000, revenue: 41750 },
      { endpoint: '/api/intelligence/wallet/{address}', requests: 78500, revenue: 39250 },
      { endpoint: '/api/analytics/cross-chain/{address}', requests: 45600, revenue: 34200 },
      { endpoint: '/api/premium/predictions/{address}', requests: 6780, revenue: 33900 },
      { endpoint: '/api/trading/signals/{pair}', requests: 23400, revenue: 29250 }
    ],
    revenueByTier: {
      free: 0,
      basic: 86420,
      pro: 178930,
      enterprise: 82150
    }
  };
  
  res.json({ success: true, metrics });
});

router.get('/monetization/endpoints', (req, res) => {
  res.json({ success: true, endpoints: apiEndpoints });
});

router.get('/monetization/clients', (req, res) => {
  res.json({ success: true, clients: apiClients });
});

// API Key Management
router.post('/monetization/api-keys', (req, res) => {
  const { name, email, tier } = req.body;
  
  const newClient = {
    id: `client-${Date.now()}`,
    name,
    email,
    tier: tier || 'basic',
    apiKey: crypto.randomBytes(20).toString('hex'),
    isActive: true,
    createdAt: new Date(),
    lastUsed: new Date(),
    usage: { requests24h: 0, requests30d: 0, spend30d: 0 },
    limits: {
      requestsPerDay: tier === 'enterprise' ? 100000 : tier === 'pro' ? 50000 : 10000,
      requestsPerMonth: tier === 'enterprise' ? 3000000 : tier === 'pro' ? 1500000 : 300000
    }
  };
  
  apiClients.push(newClient);
  
  res.json({ success: true, client: newClient });
});

// Usage Analytics
router.get('/monetization/usage/:clientId', (req, res) => {
  const { clientId } = req.params;
  const client = apiClients.find(c => c.id === clientId);
  
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  // Mock usage data
  const usageData = {
    daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      requests: Math.floor(Math.random() * 10000) + 1000,
      revenue: Math.floor(Math.random() * 500) + 100
    })),
    endpoints: apiEndpoints.map(endpoint => ({
      endpoint: endpoint.path,
      requests: Math.floor(Math.random() * 5000),
      revenue: Math.floor(Math.random() * 2000)
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 10)
  };
  
  res.json({ success: true, usage: usageData });
});

// Rate Limiting Configuration
router.put('/monetization/endpoints/:endpointId/rate-limit', (req, res) => {
  const { endpointId } = req.params;
  const { requestsPerMinute, requestsPerHour, requestsPerDay } = req.body;
  
  const endpoint = apiEndpoints.find(e => e.id === endpointId);
  if (!endpoint) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  
  endpoint.rateLimit = {
    requestsPerMinute: requestsPerMinute || endpoint.rateLimit.requestsPerMinute,
    requestsPerHour: requestsPerHour || endpoint.rateLimit.requestsPerHour,
    requestsPerDay: requestsPerDay || endpoint.rateLimit.requestsPerDay
  };
  
  res.json({ success: true, endpoint });
});

// Pricing Updates
router.put('/monetization/endpoints/:endpointId/pricing', (req, res) => {
  const { endpointId } = req.params;
  const { tier, pricePerRequest, monthlyLimit, overageRate } = req.body;
  
  const endpoint = apiEndpoints.find(e => e.id === endpointId);
  if (!endpoint) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  
  endpoint.pricing = {
    tier: tier || endpoint.pricing.tier,
    pricePerRequest: pricePerRequest !== undefined ? pricePerRequest : endpoint.pricing.pricePerRequest,
    monthlyLimit: monthlyLimit !== undefined ? monthlyLimit : endpoint.pricing.monthlyLimit,
    overageRate: overageRate !== undefined ? overageRate : endpoint.pricing.overageRate
  };
  
  res.json({ success: true, endpoint });
});

// Revenue Projections
router.get('/monetization/projections', (req, res) => {
  const currentMonthRevenue = 347500;
  const growthRate = 0.32; // 32% month-over-month growth
  
  const projections = {
    nextMonth: Math.round(currentMonthRevenue * (1 + growthRate)),
    nextQuarter: Math.round(currentMonthRevenue * Math.pow(1 + growthRate, 3)),
    nextYear: Math.round(currentMonthRevenue * Math.pow(1 + (growthRate * 0.8), 12)), // Slightly reduced growth rate over time
    assumptions: {
      monthlyGrowthRate: growthRate,
      newClientsPerMonth: 15,
      averageRevenuePerNewClient: 2500,
      churnRate: 0.05
    }
  };
  
  res.json({ success: true, projections });
});

export default router;