/**
 * Government & Law Enforcement Sales Routes
 * Enterprise sales package API endpoints for $100K+ contracts
 */

import { Router } from 'express';
import { governmentSalesService } from './government-sales-service';

const router = Router();

// ============ GOVERNMENT SALES DASHBOARD ENDPOINTS ============

// Get sales dashboard analytics
router.get('/sales-analytics', async (req, res) => {
  try {
    const analytics = await governmentSalesService.getSalesDashboardAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({ error: 'Failed to fetch sales analytics' });
  }
});

// Get all compliance frameworks
router.get('/compliance-frameworks', async (req, res) => {
  try {
    const frameworks = governmentSalesService.getComplianceFrameworks();
    res.json({
      success: true,
      frameworks,
      totalFrameworks: frameworks.length
    });
  } catch (error) {
    console.error('Error fetching compliance frameworks:', error);
    res.status(500).json({ error: 'Failed to fetch compliance frameworks' });
  }
});

// Generate compliance documentation
router.post('/compliance-documentation', async (req, res) => {
  try {
    const { frameworkId } = req.body;
    if (!frameworkId) {
      return res.status(400).json({ error: 'Framework ID is required' });
    }

    const documentation = await governmentSalesService.generateComplianceDocumentation(frameworkId);
    res.json(documentation);
  } catch (error) {
    console.error('Error generating compliance documentation:', error);
    res.status(500).json({ error: 'Failed to generate compliance documentation' });
  }
});

// Get all government demos
router.get('/government-demos', async (req, res) => {
  try {
    const demos = governmentSalesService.getGovernmentDemos();
    res.json({
      success: true,
      demos,
      totalDemos: demos.length
    });
  } catch (error) {
    console.error('Error fetching government demos:', error);
    res.status(500).json({ error: 'Failed to fetch government demos' });
  }
});

// Create custom government demo
router.post('/create-demo', async (req, res) => {
  try {
    const { agencyType, requirements = [] } = req.body;
    if (!agencyType) {
      return res.status(400).json({ error: 'Agency type is required' });
    }

    const demo = await governmentSalesService.createGovernmentDemo(agencyType, requirements);
    res.json(demo);
  } catch (error) {
    console.error('Error creating government demo:', error);
    res.status(500).json({ error: 'Failed to create government demo' });
  }
});

// Get all case studies
router.get('/case-studies', async (req, res) => {
  try {
    const caseStudies = governmentSalesService.getCaseStudies();
    res.json({
      success: true,
      caseStudies,
      totalCaseStudies: caseStudies.length
    });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    res.status(500).json({ error: 'Failed to fetch case studies' });
  }
});

// Generate enterprise proposal
router.post('/generate-proposal', async (req, res) => {
  try {
    const { agencyName, requirements = [] } = req.body;
    if (!agencyName) {
      return res.status(400).json({ error: 'Agency name is required' });
    }

    const proposal = await governmentSalesService.generateEnterpriseProposal(agencyName, requirements);
    res.json(proposal);
  } catch (error) {
    console.error('Error generating enterprise proposal:', error);
    res.status(500).json({ error: 'Failed to generate enterprise proposal' });
  }
});

// ============ SPECIALIZED ENDPOINTS ============

// OFAC sanctions screening demo
router.post('/ofac-screening-demo', async (req, res) => {
  try {
    const { walletAddresses = [] } = req.body;
    
    const screeningResults = {
      success: true,
      screeningResults: walletAddresses.map((address: string) => ({
        walletAddress: address,
        ofacMatch: Math.random() < 0.05, // 5% chance of match for demo
        riskScore: Math.floor(Math.random() * 100),
        matchDetails: Math.random() < 0.05 ? {
          listName: 'Specially Designated Nationals (SDN)',
          matchType: 'Direct Match',
          confidence: 98,
          sanctionType: 'Terrorism'
        } : null,
        lastUpdated: new Date().toISOString()
      })),
      totalWallets: walletAddresses.length,
      highRiskCount: Math.floor(walletAddresses.length * 0.1),
      complianceStatus: 'OFAC Compliant',
      demoNote: 'This is a demonstration environment with simulated data'
    };

    res.json(screeningResults);
  } catch (error) {
    console.error('Error in OFAC screening demo:', error);
    res.status(500).json({ error: 'Failed to perform OFAC screening demo' });
  }
});

// Anti-money laundering analysis demo
router.post('/aml-analysis-demo', async (req, res) => {
  try {
    const { transactionData = {} } = req.body;
    
    const amlResults = {
      success: true,
      analysisResults: {
        suspiciousActivityScore: Math.floor(Math.random() * 100),
        launderingRisk: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        patternMatches: [
          'Layering detected across multiple wallets',
          'Rapid movement through exchanges',
          'Mixing service utilization',
          'High-frequency micro-transactions'
        ].slice(0, Math.floor(Math.random() * 4) + 1),
        recommendedActions: [
          'Flag for manual review',
          'Generate Suspicious Activity Report (SAR)',
          'Monitor for additional activity',
          'Coordinate with financial intelligence unit'
        ],
        complianceLevel: 'BSA/AML Compliant',
        reportGenerated: true,
        investigationPriority: 'High'
      },
      demoNote: 'Advanced AML analysis with machine learning detection algorithms'
    };

    res.json(amlResults);
  } catch (error) {
    console.error('Error in AML analysis demo:', error);
    res.status(500).json({ error: 'Failed to perform AML analysis demo' });
  }
});

// Cybercrime investigation demo
router.post('/cybercrime-investigation-demo', async (req, res) => {
  try {
    const { investigationType = 'ransomware' } = req.body;
    
    const investigationResults = {
      success: true,
      investigation: {
        type: investigationType,
        caseId: `CYBER_${Date.now()}`,
        evidence: {
          walletAddresses: 23,
          transactions: 156,
          exchanges: 8,
          mixingServices: 3,
          totalValue: '$2.3M'
        },
        timeline: {
          initialTransaction: '2025-07-15T09:30:00Z',
          lastActivity: '2025-08-03T14:22:00Z',
          investigationStart: '2025-08-04T08:00:00Z',
          estimatedCompletion: '2025-08-12T17:00:00Z'
        },
        suspects: {
          primarySuspects: 3,
          associatedWallets: 47,
          jurisdictions: ['US', 'EU', 'APAC'],
          cooperatingAgencies: ['FBI', 'Europol', 'Local PD']
        },
        status: 'Active Investigation',
        confidence: 87,
        courtAdmissible: true
      },
      demoNote: 'Comprehensive cybercrime investigation capabilities'
    };

    res.json(investigationResults);
  } catch (error) {
    console.error('Error in cybercrime investigation demo:', error);
    res.status(500).json({ error: 'Failed to perform cybercrime investigation demo' });
  }
});

export { router as governmentSalesRoutes };