import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from './storage';
import { insertUserSchema, insertJobSchema, insertRatingSchema, insertMessageSchema } from '../shared/schema';
import { z } from 'zod';
import { flutterboyeService } from './flutterbye';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'poolpal-secret-key';

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ========== AUTH ROUTES ==========

// Register user with comprehensive marketing data collection
router.post('/auth/register', async (req, res) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Log comprehensive user registration activity
    await storage.updateUserEngagement(user.id, 'user_registered', {
      registrationMethod: 'enhanced_web_form',
      poolInformation: {
        type: userData.poolType,
        size: userData.poolSize,
        age: userData.poolAge,
        equipment: userData.poolEquipment
      },
      propertyDetails: {
        type: userData.propertyType,
        location: {
          city: userData.city,
          state: userData.state,
          zipCode: userData.zipCode
        }
      },
      servicePreferences: {
        frequency: userData.serviceFrequency,
        budgetRange: userData.budgetRange,
        preferredDay: userData.preferredServiceDay,
        preferredTime: userData.preferredServiceTime
      },
      marketingPreferences: {
        optIn: userData.marketingOptIn,
        emailNotifications: userData.emailNotifications,
        smsNotifications: userData.smsNotifications,
        contactMethod: userData.preferredContactMethod,
        frequency: userData.communicationFrequency
      },
      customerJourney: {
        referralSource: userData.referralSource,
        interests: userData.interests
      }
    });

    // Send personalized welcome communication if opted in
    if (userData.marketingOptIn && userData.emailNotifications) {
      const welcomeMessage = `Welcome to PoolPal, ${userData.firstName}! 

We're thrilled to help you maintain your beautiful ${userData.poolType} pool in ${userData.city}. Based on your ${userData.poolSize} pool size and preference for ${userData.serviceFrequency || 'customized'} service, we'll connect you with the perfect pool cleaning professional in your area.

Our pool sharks (that's what we call our amazing customers!) love the convenience of our platform. You'll receive ${userData.communicationFrequency} updates via ${userData.preferredContactMethod}, and we'll make sure your pool care fits within your ${userData.budgetRange || 'preferred'} budget range.

Ready to dive in? Start by posting your first cleaning request, and watch our qualified pool cleaners compete to give you the best service!

Welcome to the PoolPal family! 🏊‍♀️`;

      await storage.logCommunication({
        userId: user.id,
        type: 'email',
        subject: `Welcome to PoolPal, ${userData.firstName}! Your Pool Care Journey Starts Now`,
        content: welcomeMessage,
        campaignId: 'welcome_pool_sharks_v1'
      });
    }

    // Integrate with Flutterbye for enhanced user tracking and rewards
    if (user.id) {
      await storage.trackFlutterboyeIntegration(user.id, {
        flutterboyeUserId: `poolpal_customer_${user.id}`,
        rewards: 100, // Welcome bonus for new pool sharks
        activityType: 'new_pool_customer_registration',
        customerProfile: {
          segment: 'new_pool_shark',
          poolType: userData.poolType,
          poolSize: userData.poolSize,
          serviceNeeds: userData.serviceFrequency,
          location: `${userData.city}, ${userData.state}`,
          contactPreferences: userData.preferredContactMethod,
          marketingValue: userData.marketingOptIn ? 'high' : 'low'
        }
      });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isCleaner: user.isCleaner,
        firstName: userData.firstName,
        poolType: userData.poolType,
        city: userData.city
      },
      message: `Welcome to PoolPal, ${userData.firstName}! Your pool care data has been saved and you've earned 100 Flutterbye rewards points.`,
      flutterboyeRewards: 100,
      marketingDataCaptured: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Invalid user data or registration failed' });
  }
});

// Login user
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isCleaner: user.isCleaner 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== USER ROUTES ==========

// Get current user profile
router.get('/user/me', authenticateToken, async (req: any, res) => {
  try {
    const user = await storage.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't send password
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/user/me', authenticateToken, async (req: any, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates here
    
    const user = await storage.updateUser(req.user.userId, updates);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all cleaners
router.get('/cleaners', async (req, res) => {
  try {
    const cleaners = await storage.getAllCleaners();
    res.json(cleaners.map(cleaner => {
      const { password, ...cleanerProfile } = cleaner;
      return cleanerProfile;
    }));
  } catch (error) {
    console.error('Get cleaners error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== MARKETING & ANALYTICS ROUTES ==========

// Get marketing insights and user activity data
router.get('/marketing/insights', authenticateToken, async (req: any, res) => {
  try {
    const insights = await storage.getMarketingInsights();
    res.json({
      success: true,
      data: insights,
      message: "Marketing insights retrieved successfully"
    });
  } catch (error) {
    console.error('Marketing insights error:', error);
    res.status(500).json({ error: 'Failed to retrieve marketing insights' });
  }
});

// Get user activities for a specific user
router.get('/marketing/user/:userId/activities', authenticateToken, async (req: any, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const activities = await storage.getUserActivities(userId);
    res.json({
      success: true,
      data: activities,
      message: "User activities retrieved successfully"
    });
  } catch (error) {
    console.error('User activities error:', error);
    res.status(500).json({ error: 'Failed to retrieve user activities' });
  }
});

// Get communication logs for a specific user
router.get('/marketing/user/:userId/communications', authenticateToken, async (req: any, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const communications = await storage.getCommunicationLogs(userId);
    res.json({
      success: true,
      data: communications,
      message: "Communication logs retrieved successfully"
    });
  } catch (error) {
    console.error('Communication logs error:', error);
    res.status(500).json({ error: 'Failed to retrieve communication logs' });
  }
});

// Track user activity manually (for specific events)
router.post('/marketing/track-activity', authenticateToken, async (req: any, res) => {
  try {
    const { action, details } = req.body;
    await storage.updateUserEngagement(req.user.userId, action, details);
    res.json({
      success: true,
      message: "Activity tracked successfully"
    });
  } catch (error) {
    console.error('Activity tracking error:', error);
    res.status(500).json({ error: 'Failed to track activity' });
  }
});

// ========== FLUTTERBYE-FLUTTERAI INTEGRATION ROUTES ==========

// Address Intelligence API
router.get('/ai/address/:address/intelligence', authenticateToken, async (req: any, res) => {
  try {
    const { flutterAIIntelligence } = await import('./flutterAI-address-intelligence');
    const intelligence = await flutterAIIntelligence.getAddressIntelligence(req.params.address);
    
    if (!intelligence) {
      return res.status(404).json({ error: 'Address intelligence not found' });
    }

    res.json({
      success: true,
      data: intelligence,
      message: "Address intelligence retrieved successfully"
    });
  } catch (error) {
    console.error('Address intelligence error:', error);
    res.status(500).json({ error: 'Failed to retrieve address intelligence' });
  }
});

// Bulk Address Analysis
router.post('/ai/addresses/analyze', authenticateToken, async (req: any, res) => {
  try {
    const { addresses } = req.body;
    const { flutterboyeFlutterAIBridge } = await import('./flutterbye-flutterAI-bridge');
    
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of addresses to analyze' });
    }

    const analysis = await flutterboyeFlutterAIBridge.bulkAddressAnalysis(addresses);
    
    res.json({
      success: true,
      data: analysis,
      message: `Analyzed ${addresses.length} addresses successfully`
    });
  } catch (error) {
    console.error('Bulk address analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze addresses' });
  }
});

// Optimize Flutterbye Campaign with AI
router.post('/ai/campaign/optimize', authenticateToken, async (req: any, res) => {
  try {
    const { targetAddresses, campaignType } = req.body;
    const { flutterboyeFlutterAIBridge } = await import('./flutterbye-flutterAI-bridge');
    
    if (!Array.isArray(targetAddresses) || !campaignType) {
      return res.status(400).json({ error: 'Please provide targetAddresses array and campaignType' });
    }

    const optimizedCampaign = await flutterboyeFlutterAIBridge.optimizeFlutterboyeCampaign(
      targetAddresses, 
      campaignType
    );
    
    res.json({
      success: true,
      data: optimizedCampaign,
      message: `Campaign optimized for ${targetAddresses.length} addresses`
    });
  } catch (error) {
    console.error('Campaign optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize campaign' });
  }
});

// Process Flutterbye Message (webhook endpoint)
router.post('/ai/flutterbye/message', async (req: any, res) => {
  try {
    const message = req.body;
    const { flutterboyeFlutterAIBridge } = await import('./flutterbye-flutterAI-bridge');
    
    // Process the message and extract addresses
    await flutterboyeFlutterAIBridge.processFlutterboyeMessage(message);
    
    res.json({
      success: true,
      message: "Flutterbye message processed and addresses captured"
    });
  } catch (error) {
    console.error('Flutterbye message processing error:', error);
    res.status(500).json({ error: 'Failed to process Flutterbye message' });
  }
});

// Address Intelligence Report (Data-as-a-Service)
router.get('/ai/intelligence/report', authenticateToken, async (req: any, res) => {
  try {
    const { flutterboyeFlutterAIBridge } = await import('./flutterbye-flutterAI-bridge');
    const report = await flutterboyeFlutterAIBridge.generateAddressIntelligenceReport();
    
    res.json({
      success: true,
      data: report,
      message: "Intelligence report generated successfully"
    });
  } catch (error) {
    console.error('Intelligence report error:', error);
    res.status(500).json({ error: 'Failed to generate intelligence report' });
  }
});

// Top Value Addresses
router.get('/ai/addresses/top/:limit?', authenticateToken, async (req: any, res) => {
  try {
    const limit = parseInt(req.params.limit) || 50;
    const { flutterAIIntelligence } = await import('./flutterAI-address-intelligence');
    
    const topAddresses = await flutterAIIntelligence.getTopValueAddresses(limit);
    
    res.json({
      success: true,
      data: topAddresses,
      message: `Retrieved top ${topAddresses.length} value addresses`
    });
  } catch (error) {
    console.error('Top addresses error:', error);
    res.status(500).json({ error: 'Failed to retrieve top addresses' });
  }
});

// Get Addresses by Customer Segment
router.get('/ai/addresses/segment/:segment', authenticateToken, async (req: any, res) => {
  try {
    const segment = req.params.segment;
    const { flutterAIIntelligence } = await import('./flutterAI-address-intelligence');
    
    const addresses = await flutterAIIntelligence.getAddressesBySegment(segment);
    
    res.json({
      success: true,
      data: addresses,
      message: `Retrieved ${addresses.length} addresses in ${segment} segment`
    });
  } catch (error) {
    console.error('Segment addresses error:', error);
    res.status(500).json({ error: 'Failed to retrieve addresses by segment' });
  }
});

// ========== DATA PROTECTION & BACKUP ROUTES ==========

// Storage Capacity Analysis
router.get('/data/capacity/analysis', authenticateToken, async (req: any, res) => {
  try {
    const { dataProtectionService } = await import('./data-protection-service');
    const analysis = await dataProtectionService.analyzeStorageCapacity();
    
    res.json({
      success: true,
      data: analysis,
      message: "Storage capacity analysis completed"
    });
  } catch (error) {
    console.error('Storage analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze storage capacity' });
  }
});

// Create Backup
router.post('/data/backup/create', authenticateToken, async (req: any, res) => {
  try {
    const { dataTypes = ['all'] } = req.body;
    const { dataProtectionService } = await import('./data-protection-service');
    
    const manifest = await dataProtectionService.createBackup(dataTypes);
    
    res.json({
      success: true,
      data: manifest,
      message: `Backup created successfully: ${manifest.backupId}`
    });
  } catch (error) {
    console.error('Backup creation error:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// Restore from Backup
router.post('/data/backup/restore', authenticateToken, async (req: any, res) => {
  try {
    const { backupId } = req.body;
    const { dataProtectionService } = await import('./data-protection-service');
    
    if (!backupId) {
      return res.status(400).json({ error: 'Backup ID is required' });
    }
    
    const result = await dataProtectionService.restoreFromBackup(backupId);
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 
        `Restored ${result.recordsRestored} records successfully` : 
        'Restore failed'
    });
  } catch (error) {
    console.error('Backup restore error:', error);
    res.status(500).json({ error: 'Failed to restore backup' });
  }
});

// Data Health Report
router.get('/data/health/report', authenticateToken, async (req: any, res) => {
  try {
    const { dataProtectionService } = await import('./data-protection-service');
    const healthReport = await dataProtectionService.generateDataHealthReport();
    
    res.json({
      success: true,
      data: healthReport,
      message: "Data health report generated successfully"
    });
  } catch (error) {
    console.error('Health report error:', error);
    res.status(500).json({ error: 'Failed to generate health report' });
  }
});

// Data Protection Audit
router.get('/data/protection/audit', authenticateToken, async (req: any, res) => {
  try {
    const { dataProtectionService } = await import('./data-protection-service');
    const audit = await dataProtectionService.auditDataProtection();
    
    res.json({
      success: true,
      data: audit,
      message: "Data protection audit completed"
    });
  } catch (error) {
    console.error('Protection audit error:', error);
    res.status(500).json({ error: 'Failed to complete protection audit' });
  }
});

// Setup Automated Protection
router.post('/data/protection/setup', authenticateToken, async (req: any, res) => {
  try {
    const { dataProtectionService } = await import('./data-protection-service');
    await dataProtectionService.setupAutomatedProtection();
    
    res.json({
      success: true,
      message: "Automated data protection configured successfully"
    });
  } catch (error) {
    console.error('Protection setup error:', error);
    res.status(500).json({ error: 'Failed to setup automated protection' });
  }
});

// ========== DATA MIRROR ROUTES ==========

// Create Data Mirror
router.post('/data/mirror/create', authenticateToken, async (req: any, res) => {
  try {
    const { dataTypes = ['all'] } = req.body;
    const { dataMirrorService } = await import('./data-mirror-service');
    
    const manifest = await dataMirrorService.createDataMirror(dataTypes);
    
    res.json({
      success: true,
      data: manifest,
      message: `Data mirror created successfully: ${manifest.mirrorId}`
    });
  } catch (error) {
    console.error('Mirror creation error:', error);
    res.status(500).json({ error: 'Failed to create data mirror' });
  }
});

// List All Mirrors
router.get('/data/mirror/list', authenticateToken, async (req: any, res) => {
  try {
    const { dataMirrorService } = await import('./data-mirror-service');
    const mirrors = await dataMirrorService.listAllMirrors();
    
    res.json({
      success: true,
      data: mirrors,
      message: `Retrieved ${mirrors.length} data mirrors`
    });
  } catch (error) {
    console.error('Mirror listing error:', error);
    res.status(500).json({ error: 'Failed to list data mirrors' });
  }
});

// Sync All Mirrors
router.post('/data/mirror/sync', authenticateToken, async (req: any, res) => {
  try {
    const { dataMirrorService } = await import('./data-mirror-service');
    const result = await dataMirrorService.syncAllMirrors();
    
    res.json({
      success: true,
      data: result,
      message: `Mirror sync completed: ${result.syncedCount} synced, ${result.failedCount} failed`
    });
  } catch (error) {
    console.error('Mirror sync error:', error);
    res.status(500).json({ error: 'Failed to sync mirrors' });
  }
});

// Restore from Mirror
router.post('/data/mirror/restore', authenticateToken, async (req: any, res) => {
  try {
    const { mirrorId } = req.body;
    const { dataMirrorService } = await import('./data-mirror-service');
    
    if (!mirrorId) {
      return res.status(400).json({ error: 'Mirror ID is required' });
    }
    
    const result = await dataMirrorService.restoreFromMirror(mirrorId);
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 
        `Restored ${result.recordsRestored} records from mirror` : 
        'Mirror restore failed'
    });
  } catch (error) {
    console.error('Mirror restore error:', error);
    res.status(500).json({ error: 'Failed to restore from mirror' });
  }
});

// Mirror Health Report
router.get('/data/mirror/health', authenticateToken, async (req: any, res) => {
  try {
    const { dataMirrorService } = await import('./data-mirror-service');
    const healthReport = await dataMirrorService.generateMirrorHealthReport();
    
    res.json({
      success: true,
      data: healthReport,
      message: "Mirror health report generated successfully"
    });
  } catch (error) {
    console.error('Mirror health error:', error);
    res.status(500).json({ error: 'Failed to generate mirror health report' });
  }
});

// Setup Automated Mirroring
router.post('/data/mirror/setup', authenticateToken, async (req: any, res) => {
  try {
    const { dataMirrorService } = await import('./data-mirror-service');
    await dataMirrorService.setupAutomatedMirroring();
    
    res.json({
      success: true,
      message: "Automated data mirroring configured successfully"
    });
  } catch (error) {
    console.error('Mirror setup error:', error);
    res.status(500).json({ error: 'Failed to setup automated mirroring' });
  }
});

// Delete Mirror
router.delete('/data/mirror/:mirrorId', authenticateToken, async (req: any, res) => {
  try {
    const { mirrorId } = req.params;
    const { dataMirrorService } = await import('./data-mirror-service');
    
    const deleted = await dataMirrorService.deleteMirror(mirrorId);
    
    if (deleted) {
      res.json({
        success: true,
        message: `Mirror ${mirrorId} deleted successfully`
      });
    } else {
      res.status(404).json({ error: 'Mirror not found or deletion failed' });
    }
  } catch (error) {
    console.error('Mirror deletion error:', error);
    res.status(500).json({ error: 'Failed to delete mirror' });
  }
});

// Download Mirror File
router.get('/data/mirror/download/:mirrorId', authenticateToken, async (req: any, res) => {
  try {
    const { mirrorId } = req.params;
    const { dataMirrorService } = await import('./data-mirror-service');
    
    const { data, filename } = await dataMirrorService.downloadMirrorFile(mirrorId);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(data);
  } catch (error) {
    console.error('Mirror download error:', error);
    res.status(500).json({ error: 'Failed to download mirror file' });
  }
});

// ========== FEATURE TOGGLE ROUTES ==========

// Get all features
router.get('/admin/features', authenticateToken, async (req: any, res) => {
  try {
    const { featureToggleService } = await import('./feature-toggle-service');
    const features = featureToggleService.getAllFeatures();
    
    res.json({
      success: true,
      data: features
    });
  } catch (error) {
    console.error('Get features error:', error);
    res.status(500).json({ error: 'Failed to get features' });
  }
});

// Get AI endpoints status
router.get('/admin/features/ai-endpoints', authenticateToken, async (req: any, res) => {
  try {
    const { featureToggleService } = await import('./feature-toggle-service');
    const active = featureToggleService.getActiveAIEndpoints();
    const inactive = featureToggleService.getInactiveAIEndpoints();
    
    res.json({
      success: true,
      data: { active, inactive }
    });
  } catch (error) {
    console.error('Get AI endpoints error:', error);
    res.status(500).json({ error: 'Failed to get AI endpoints' });
  }
});

// Get cost analysis
router.get('/admin/features/costs', authenticateToken, async (req: any, res) => {
  try {
    const { featureToggleService } = await import('./feature-toggle-service');
    const costs = featureToggleService.calculateMonthlyCosts();
    
    res.json({
      success: true,
      data: costs
    });
  } catch (error) {
    console.error('Get costs error:', error);
    res.status(500).json({ error: 'Failed to get cost analysis' });
  }
});

// Get MVP recommendations
router.get('/admin/features/mvp-recommendations', authenticateToken, async (req: any, res) => {
  try {
    const { featureToggleService } = await import('./feature-toggle-service');
    const recommendations = featureToggleService.getMVPRecommendations();
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get MVP recommendations error:', error);
    res.status(500).json({ error: 'Failed to get MVP recommendations' });
  }
});

// Enable feature
router.post('/admin/features/:featureId/toggle', authenticateToken, async (req: any, res) => {
  try {
    const { featureId } = req.params;
    const { featureToggleService } = await import('./feature-toggle-service');
    
    const success = featureToggleService.enableFeature(featureId);
    
    if (success) {
      res.json({
        success: true,
        message: `Feature ${featureId} enabled successfully`
      });
    } else {
      res.status(404).json({ error: 'Feature not found' });
    }
  } catch (error: any) {
    console.error('Enable feature error:', error);
    res.status(400).json({ error: error.message || 'Failed to enable feature' });
  }
});

// Disable feature
router.delete('/admin/features/:featureId/toggle', authenticateToken, async (req: any, res) => {
  try {
    const { featureId } = req.params;
    const { featureToggleService } = await import('./feature-toggle-service');
    
    const success = featureToggleService.disableFeature(featureId);
    
    if (success) {
      res.json({
        success: true,
        message: `Feature ${featureId} disabled successfully`
      });
    } else {
      res.status(404).json({ error: 'Feature not found' });
    }
  } catch (error: any) {
    console.error('Disable feature error:', error);
    res.status(400).json({ error: error.message || 'Failed to disable feature' });
  }
});

// Apply MVP configuration
router.post('/admin/features/apply-mvp', authenticateToken, async (req: any, res) => {
  try {
    const { featureToggleService } = await import('./feature-toggle-service');
    const recommendations = featureToggleService.getMVPRecommendations();
    
    // Disable all non-MVP features
    const allFeatures = featureToggleService.getAllFeatures();
    let changes = 0;
    
    for (const feature of allFeatures) {
      const shouldBeEnabled = recommendations.enabledFeatures.includes(feature.featureId);
      
      if (feature.enabled !== shouldBeEnabled) {
        try {
          if (shouldBeEnabled) {
            featureToggleService.enableFeature(feature.featureId);
          } else {
            featureToggleService.disableFeature(feature.featureId);
          }
          changes++;
        } catch (error) {
          console.warn(`Could not toggle ${feature.featureId}:`, error);
        }
      }
    }
    
    res.json({
      success: true,
      message: `MVP configuration applied. ${changes} features updated.`,
      data: {
        changesApplied: changes,
        estimatedMonthlyCost: recommendations.estimatedMonthlyCost
      }
    });
  } catch (error) {
    console.error('Apply MVP error:', error);
    res.status(500).json({ error: 'Failed to apply MVP configuration' });
  }
});

// ========== DATABASE EXPORT ROUTES ==========

// Export Database as CSV
router.get('/data/export/csv', authenticateToken, async (req: any, res) => {
  try {
    const { tables } = req.query;
    const tablesToExport = tables ? tables.split(',') : ['all'];
    
    const csvData = await exportDatabaseToCSV(tablesToExport);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const filename = `database-export-${timestamp}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (error) {
    console.error('Database export error:', error);
    res.status(500).json({ error: 'Failed to export database' });
  }
});

// Export Database as JSON
router.get('/data/export/json', authenticateToken, async (req: any, res) => {
  try {
    const { tables } = req.query;
    const tablesToExport = tables ? tables.split(',') : ['all'];
    
    const jsonData = await exportDatabaseToJSON(tablesToExport);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const filename = `database-export-${timestamp}.json`;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(JSON.stringify(jsonData, null, 2));
  } catch (error) {
    console.error('Database export error:', error);
    res.status(500).json({ error: 'Failed to export database' });
  }
});

async function exportDatabaseToCSV(tables: string[]): Promise<string> {
  let csvContent = '';
  
  // Sample data structure - in production this would query actual database
  const sampleData = {
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: '2024-01-01' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: '2024-01-02' }
    ],
    user_activities: [
      { id: 1, userId: 1, action: 'login', timestamp: '2024-01-01 10:00:00' },
      { id: 2, userId: 2, action: 'view_profile', timestamp: '2024-01-02 11:30:00' }
    ],
    address_intelligence: [
      { id: 1, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', score: 95, tier: 'premium' },
      { id: 2, address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', score: 87, tier: 'high-value' }
    ],
    communication_logs: [
      { id: 1, userId: 1, type: 'sms', message: 'Welcome message', timestamp: '2024-01-01' },
      { id: 2, userId: 2, type: 'email', message: 'Newsletter', timestamp: '2024-01-02' }
    ]
  };
  
  for (const [tableName, records] of Object.entries(sampleData)) {
    if (tables.includes('all') || tables.includes(tableName)) {
      // Add table header
      csvContent += `\n=== ${tableName.toUpperCase()} ===\n`;
      
      if (records.length > 0) {
        // Add column headers
        const headers = Object.keys(records[0]);
        csvContent += headers.join(',') + '\n';
        
        // Add data rows
        for (const record of records) {
          const row = headers.map(header => {
            const value = record[header as keyof typeof record];
            // Escape commas and quotes in CSV
            const stringValue = String(value);
            return typeof value === 'string' && stringValue.includes(',') 
              ? `"${stringValue.replace(/"/g, '""')}"` 
              : stringValue;
          });
          csvContent += row.join(',') + '\n';
        }
      }
      
      csvContent += '\n';
    }
  }
  
  return csvContent;
}

async function exportDatabaseToJSON(tables: string[]): Promise<any> {
  // Sample data structure - in production this would query actual database
  const sampleData = {
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: '2024-01-01' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: '2024-01-02' }
    ],
    user_activities: [
      { id: 1, userId: 1, action: 'login', timestamp: '2024-01-01 10:00:00' },
      { id: 2, userId: 2, action: 'view_profile', timestamp: '2024-01-02 11:30:00' }
    ],
    address_intelligence: [
      { id: 1, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', score: 95, tier: 'premium' },
      { id: 2, address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', score: 87, tier: 'high-value' }
    ],
    communication_logs: [
      { id: 1, userId: 1, type: 'sms', message: 'Welcome message', timestamp: '2024-01-01' },
      { id: 2, userId: 2, type: 'email', message: 'Newsletter', timestamp: '2024-01-02' }
    ]
  };
  
  const exportData: any = {
    metadata: {
      exportTime: new Date().toISOString(),
      version: '1.0',
      source: 'PoolPal-FlutterAI-System',
      exportedTables: []
    }
  };
  
  for (const [tableName, records] of Object.entries(sampleData)) {
    if (tables.includes('all') || tables.includes(tableName)) {
      exportData[tableName] = records;
      exportData.metadata.exportedTables.push(tableName);
    }
  }
  
  return exportData;
}

// ========== JOB ROUTES ==========

// Create new job
router.post('/jobs', authenticateToken, async (req: any, res) => {
  try {
    const jobData = insertJobSchema.parse({
      ...req.body,
      customerId: req.user.userId,
    });
    
    const job = await storage.createJob(jobData);
    
    // Send Flutterbye notification to cleaners about new job
    flutterboyeService.createNotification({
      recipientId: 'all_cleaners',
      message: `New pool cleaning job posted: ${job.title}`,
      type: 'job_posted',
      metadata: { jobId: job.id, address: job.address }
    });
    
    res.json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(400).json({ error: 'Invalid job data' });
  }
});

// Get all open jobs
router.get('/jobs/open', async (req, res) => {
  try {
    const jobs = await storage.getOpenJobs();
    res.json(jobs);
  } catch (error) {
    console.error('Get open jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's jobs (customer or cleaner)
router.get('/jobs/my', authenticateToken, async (req: any, res) => {
  try {
    const user = await storage.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let jobs;
    if (user.isCleaner) {
      jobs = await storage.getJobsByCleaner(req.user.userId);
    } else {
      jobs = await storage.getJobsByCustomer(req.user.userId);
    }
    
    res.json(jobs);
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific job
router.get('/jobs/:id', authenticateToken, async (req: any, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const job = await storage.getJobById(jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept job (cleaner only)
router.post('/jobs/:id/accept', authenticateToken, async (req: any, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const user = await storage.getUserById(req.user.userId);
    
    if (!user || !user.isCleaner) {
      return res.status(403).json({ error: 'Only cleaners can accept jobs' });
    }

    const job = await storage.updateJob(jobId, {
      cleanerId: req.user.userId,
      status: 'accepted',
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Send Flutterbye notification to customer
    flutterboyeService.createNotification({
      recipientId: job.customerId.toString(),
      message: `Your pool cleaning job has been accepted by ${user.name}`,
      type: 'job_accepted',
      metadata: { jobId: job.id, cleanerName: user.name }
    });
    
    // Track activity
    flutterboyeService.trackUserActivity({
      userId: req.user.userId.toString(),
      action: 'job_accepted',
      details: { jobId: job.id, jobTitle: job.title }
    });
    
    res.json(job);
  } catch (error) {
    console.error('Accept job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update job status
router.put('/jobs/:id/status', authenticateToken, async (req: any, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const { status } = req.body;
    
    const job = await storage.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Check permissions
    if (job.customerId !== req.user.userId && job.cleanerId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updatedJob = await storage.updateJob(jobId, { status });
    
    // Send notifications for job completion
    if (status === 'completed') {
      const customer = await storage.getUserById(job.customerId);
      const cleaner = job.cleanerId ? await storage.getUserById(job.cleanerId) : null;
      
      if (customer) {
        flutterboyeService.createNotification({
          recipientId: customer.id.toString(),
          message: `Your pool cleaning job has been completed by ${cleaner?.name}`,
          type: 'job_completed',
          metadata: { jobId: job.id, cleanerName: cleaner?.name }
        });
      }
      
      // Send rewards to cleaner
      if (cleaner && job.cleanerId) {
        flutterboyeService.sendRewards({
          userId: cleaner.id.toString(),
          amount: 25, // $25 completion bonus
          reason: 'Job completion bonus',
          jobId: job.id
        });
      }
    }
    
    res.json(updatedJob);
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== RATING ROUTES ==========

// Create rating
router.post('/ratings', authenticateToken, async (req: any, res) => {
  try {
    const ratingData = insertRatingSchema.parse({
      ...req.body,
      fromUserId: req.user.userId,
    });
    
    const rating = await storage.createRating(ratingData);
    res.json(rating);
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(400).json({ error: 'Invalid rating data' });
  }
});

// Get ratings for a user
router.get('/ratings/user/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const ratings = await storage.getRatingsByUser(userId);
    res.json(ratings);
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== MESSAGE ROUTES ==========

// Create message
router.post('/messages', authenticateToken, async (req: any, res) => {
  try {
    const messageData = insertMessageSchema.parse({
      ...req.body,
      fromUserId: req.user.userId,
    });
    
    const message = await storage.createMessage(messageData);
    res.json(message);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(400).json({ error: 'Invalid message data' });
  }
});

// Get messages for a job
router.get('/messages/job/:id', authenticateToken, async (req: any, res) => {
  try {
    const jobId = parseInt(req.params.id);
    
    // Check if user has access to this job
    const job = await storage.getJobById(jobId);
    if (!job || (job.customerId !== req.user.userId && job.cleanerId !== req.user.userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const messages = await storage.getMessagesByJob(jobId);
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== FLUTTERBYE INTEGRATION ROUTES ==========

// Get Flutterbye status
router.get('/flutterbye/status', (req, res) => {
  res.json({ 
    connected: flutterboyeService.isConfigured(),
    service: 'Flutterbye Integration',
    features: ['notifications', 'rewards', 'activity_tracking']
  });
});

// Get user notifications (placeholder - would connect to actual Flutterbye API)
router.get('/flutterbye/notifications', authenticateToken, async (req: any, res) => {
  try {
    // In a real implementation, this would fetch from Flutterbye API
    const mockNotifications = [
      {
        id: '1',
        message: 'Welcome to PoolPal with Flutterbye integration!',
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];
    
    res.json(mockNotifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user rewards (placeholder - would connect to actual Flutterbye API)
router.get('/flutterbye/rewards', authenticateToken, async (req: any, res) => {
  try {
    // In a real implementation, this would fetch from Flutterbye API
    const mockRewards = {
      rewards: [
        {
          id: '1',
          amount: 50,
          reason: 'Welcome bonus',
          timestamp: new Date().toISOString()
        }
      ],
      stats: {
        totalEarnings: 150,
        completedJobs: 5,
        customerRating: 4.8,
        rewardsEarned: 50
      }
    };
    
    res.json(mockRewards);
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark notification as read
router.post('/flutterbye/notifications/:id/read', authenticateToken, async (req: any, res) => {
  try {
    const notificationId = req.params.id;
    // In real implementation, would call Flutterbye API
    console.log(`Marking notification ${notificationId} as read for user ${req.user.userId}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Feature Release Analyzer endpoints
router.get('/feature-analysis', async (req, res) => {
  try {
    const { FeatureReleaseAnalyzer } = await import('./feature-release-analyzer');
    const analyzer = new FeatureReleaseAnalyzer();
    
    // Get current site metrics
    const metrics = {
      userCount: 150,
      dailyActiveUsers: 45,
      monthlyActiveUsers: 120,
      averageSessionDuration: 180,
      pageViews: 850,
      bounceRate: 35,
      conversionRate: 4.2,
      revenue: 2500,
      featureUsage: {
        'coin_minting': 85,
        'address_intelligence': 62,
        'dashboard': 140,
        'data_protection': 23
      },
      userFeedback: [
        { feature: 'coin_minting', sentiment: 'positive' as const, comment: 'Love the simplicity', timestamp: new Date() },
        { feature: 'analytics', sentiment: 'neutral' as const, comment: 'Would like more features', timestamp: new Date() }
      ],
      supportTickets: [
        { category: 'feature_request', priority: 'medium' as const, resolved: true, timestamp: new Date() },
        { category: 'bug', priority: 'low' as const, resolved: false, timestamp: new Date() }
      ]
    };

    // Get available features to enable
    const availableFeatures = [
      'FlutterWave', 'AI Personalities', 'Analytics Dashboard', 
      'Enterprise API', 'Advanced Security', 'Mobile App',
      'Real-time Chat', 'Blockchain Integration', 'Machine Learning'
    ];

    const analysis = await analyzer.analyzeAndRecommend(metrics, availableFeatures);
    res.json(analysis);
  } catch (error) {
    console.error('Feature analysis error:', error);
    res.status(500).json({ error: 'Failed to generate feature analysis' });
  }
});

router.post('/feature-toggle/enable', async (req, res) => {
  try {
    const { feature } = req.body;
    
    if (!feature) {
      return res.status(400).json({ error: 'Feature name is required' });
    }

    // Import featureToggleService dynamically for this route
    const { featureToggleService } = await import('./feature-toggle-service');
    const result = await featureToggleService.enableFeature(feature);
    res.json({ 
      success: true, 
      message: `Feature '${feature}' has been enabled`,
      feature: result 
    });
  } catch (error) {
    console.error('Error enabling feature:', error);
    res.status(500).json({ error: 'Failed to enable feature' });
  }
});

export default router;