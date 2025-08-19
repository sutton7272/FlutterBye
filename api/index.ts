import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';

// Simplified serverless function without complex dependencies

let app: express.Application | null = null;

async function getApp() {
  if (!app) {
    app = express();
    
    // Basic middleware setup for serverless
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // CORS for Vercel deployment
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      next();
    });
    
    // Early Access Authentication - Complete implementation
    const activeAccessCodes = new Set([
      'FLBY-EARLY-2025-001',
      'FLBY-EARLY-2025-002', 
      'FLBY-EARLY-2025-003',
      'FLBY-BETA-ACCESS-001',
      'FLBY-FOUNDER-001',
      'FLBY-VIP-2025'
    ]);
    
    const approvedEmails = new Set([
      'admin@flutterbye.io',
      'support@flutterbye.io',
      'demo@flutterbye.io',
      'test@flutterbye.io'
    ]);
    
    const activeSessions = new Map();
    const waitlistEntries = new Map(); // Store waitlist entries in memory
    
    // Generate session token
    function generateSessionToken() {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    // Request early access
    app.post('/api/early-access/request-access', async (req, res) => {
      try {
        const { accessCode, email } = req.body;
        
        let accessGranted = false;
        let accessMethod = '';
        let sessionToken = '';

        // Check access code
        if (accessCode && activeAccessCodes.has(accessCode.toUpperCase())) {
          accessGranted = true;
          accessMethod = 'access_code';
          sessionToken = generateSessionToken();
          
          // Create session
          const session = {
            sessionToken,
            accessMethod,
            accessCodeUsed: accessCode.toUpperCase(),
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          };
          
          activeSessions.set(sessionToken, session);
          console.log(`✅ Early access granted via code: ${accessCode}`);
        }
        // Check approved email
        else if (email && approvedEmails.has(email.toLowerCase())) {
          accessGranted = true;
          accessMethod = 'approved_email';
          sessionToken = generateSessionToken();
          
          // Create session
          const session = {
            sessionToken,
            email: email.toLowerCase(),
            accessMethod,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days for email access
          };
          
          activeSessions.set(sessionToken, session);
          console.log(`✅ Early access granted via email: ${email}`);
        }

        if (accessGranted) {
          res.json({
            accessGranted: true,
            sessionToken,
            accessMethod,
            message: `Access granted via ${accessMethod === 'access_code' ? 'access code' : 'approved email'}`
          });
        } else {
          console.log(`❌ Early access denied for code: ${accessCode}, email: ${email}`);
          res.json({
            accessGranted: false,
            message: 'Invalid access code or email not approved for early access'
          });
        }
      } catch (error) {
        console.error('❌ Error processing early access request:', error);
        res.status(500).json({
          accessGranted: false,
          message: 'Server error processing access request'
        });
      }
    });

    // Verify existing session
    app.post('/api/early-access/verify-session', async (req, res) => {
      try {
        const { sessionToken } = req.body;
        
        if (!sessionToken) {
          return res.json({ isValid: false, message: 'No session token provided' });
        }

        const session = activeSessions.get(sessionToken);
        
        if (!session) {
          return res.json({ isValid: false, message: 'Session not found' });
        }
        
        // Check if session expired
        if (session.expiresAt < new Date()) {
          activeSessions.delete(sessionToken);
          return res.json({ isValid: false, message: 'Session expired' });
        }

        console.log(`✅ Valid early access session verified: ${session.accessMethod}`);
        res.json({
          isValid: true,
          accessMethod: session.accessMethod,
          email: session.email,
          expiresAt: session.expiresAt
        });
      } catch (error) {
        console.error('❌ Error verifying session:', error);
        res.status(500).json({ isValid: false, message: 'Server error' });
      }
    });
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', service: 'FlutterBye API' });
    });
    
    // VIP Waitlist endpoint with persistent database storage
    app.post('/api/launch/waitlist', async (req, res) => {
      try {
        const { VipWaitlistDB } = await import('../server/db-utils');
        const { email, walletAddress } = req.body;
        
        if (!email || !email.includes('@')) {
          return res.status(400).json({
            success: false,
            message: 'Valid email address is required'
          });
        }

        // Generate unique entry ID
        const entryId = `waitlist_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        
        const benefits = [
          "Early access before public launch",
          "Exclusive FLBY token airdrops",
          "Beta testing privileges", 
          "VIP community access"
        ];
        
        // Store in database permanently
        const entry = await VipWaitlistDB.add({
          entryId,
          email: email.toLowerCase().trim(),
          walletAddress: walletAddress || null,
          benefits,
          status: 'active',
          source: 'website'
        });
        
        console.log(`📝 New waitlist signup: ${email}${walletAddress ? ` (${walletAddress})` : ''}`);
        
        const summary = await VipWaitlistDB.getSummary();
        console.log(`📊 Total waitlist entries: ${summary.totalEmails}`);
        
        res.json({
          success: true,
          entryId,
          message: 'Successfully joined the VIP waitlist',
          benefits
        });
      } catch (error) {
        console.error('❌ Error processing waitlist signup:', error);
        res.status(500).json({
          success: false,
          message: 'Server error processing signup'
        });
      }
    });

    // Admin endpoint to view all waitlist entries
    app.get('/api/admin/waitlist', async (req, res) => {
      try {
        // Convert Map to Array for easy viewing
        const entries = Array.from(waitlistEntries.values());
        
        // Sort by join date (newest first)
        entries.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
        
        res.json({
          success: true,
          totalEntries: entries.length,
          entries: entries,
          summary: {
            totalEmails: entries.length,
            withWallets: entries.filter(e => e.walletAddress).length,
            withoutWallets: entries.filter(e => !e.walletAddress).length,
            lastEntry: entries[0]?.joinedAt || null
          }
        });
      } catch (error) {
        console.error('❌ Error fetching waitlist entries:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch waitlist entries'
        });
      }
    });

    // Basic API endpoints
    app.get('/api/tokens', async (req, res) => {
      try {
        // Return mock data for now - full API will be available after deployment
        res.json({ tokens: [], message: 'API endpoint available' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tokens' });
      }
    });
    
    // Fallback for undefined routes
    app.use('*', (req, res) => {
      res.status(404).json({ message: 'API endpoint not found' });
    });
  }
  
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await getApp();
    
    // Handle the request with Express
    app(req as any, res as any);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}