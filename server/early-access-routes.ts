import type { Express } from "express";
import { storage } from "./storage";
import crypto from "crypto";

// In-memory storage for simplicity - in production, use database
const activeAccessCodes = new Set([
  "FLBY-EARLY-2025-001",
  "FLBY-EARLY-2025-002", 
  "FLBY-EARLY-2025-003",
  "FLBY-BETA-ACCESS-001",
  "FLBY-FOUNDER-001",
  "FLBY-VIP-2025"
]);

const approvedEmails = new Set([
  "admin@flutterbye.io",
  "support@flutterbye.io",
  "demo@flutterbye.io",
  "test@flutterbye.io"
]);

const activeSessions = new Map<string, {
  sessionToken: string;
  email?: string;
  accessMethod: string;
  accessCodeUsed?: string;
  createdAt: Date;
  expiresAt: Date;
}>();

// Generate session token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Clean expired sessions
function cleanExpiredSessions() {
  const now = new Date();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(token);
    }
  }
}

export function registerEarlyAccessRoutes(app: Express) {
  console.log('🔐 Early Access Gateway routes registered');

  // Clean expired sessions every hour
  setInterval(cleanExpiredSessions, 60 * 60 * 1000);

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

  // Admin endpoints for managing early access
  app.post('/api/admin/early-access/add-code', async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ success: false, message: 'Code is required' });
      }

      activeAccessCodes.add(code.toUpperCase());
      
      console.log(`➕ New access code added: ${code.toUpperCase()}`);
      res.json({ 
        success: true, 
        message: `Access code ${code.toUpperCase()} added successfully`,
        totalCodes: activeAccessCodes.size
      });
    } catch (error) {
      console.error('❌ Error adding access code:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.post('/api/admin/early-access/add-email', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      approvedEmails.add(email.toLowerCase());
      
      console.log(`➕ New approved email added: ${email.toLowerCase()}`);
      res.json({ 
        success: true, 
        message: `Email ${email.toLowerCase()} added to approved list`,
        totalEmails: approvedEmails.size
      });
    } catch (error) {
      console.error('❌ Error adding approved email:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.get('/api/admin/early-access/status', async (req, res) => {
    try {
      cleanExpiredSessions();
      
      res.json({
        success: true,
        stats: {
          totalAccessCodes: activeAccessCodes.size,
          totalApprovedEmails: approvedEmails.size,
          activeSessions: activeSessions.size,
          accessCodes: Array.from(activeAccessCodes),
          approvedEmails: Array.from(approvedEmails)
        }
      });
    } catch (error) {
      console.error('❌ Error getting early access status:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.delete('/api/admin/early-access/remove-code/:code', async (req, res) => {
    try {
      const { code } = req.params;
      const removed = activeAccessCodes.delete(code.toUpperCase());
      
      if (removed) {
        console.log(`➖ Access code removed: ${code.toUpperCase()}`);
        res.json({ 
          success: true, 
          message: `Access code ${code.toUpperCase()} removed`,
          totalCodes: activeAccessCodes.size
        });
      } else {
        res.status(404).json({ success: false, message: 'Access code not found' });
      }
    } catch (error) {
      console.error('❌ Error removing access code:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.delete('/api/admin/early-access/remove-email/:email', async (req, res) => {
    try {
      const { email } = req.params;
      const removed = approvedEmails.delete(email.toLowerCase());
      
      if (removed) {
        console.log(`➖ Approved email removed: ${email.toLowerCase()}`);
        res.json({ 
          success: true, 
          message: `Email ${email.toLowerCase()} removed from approved list`,
          totalEmails: approvedEmails.size
        });
      } else {
        res.status(404).json({ success: false, message: 'Approved email not found' });
      }
    } catch (error) {
      console.error('❌ Error removing approved email:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
}