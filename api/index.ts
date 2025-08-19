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
    
    // Essential routes for early access and basic functionality
    app.post('/api/early-access/validate', async (req, res) => {
      try {
        const { code } = req.body;
        const validCodes = ['FLBY-EARLY-2025-001', 'FLBY-EARLY-2025'];
        
        if (validCodes.includes(code)) {
          res.json({ valid: true, message: 'Access granted' });
        } else {
          res.status(400).json({ valid: false, message: 'Invalid access code' });
        }
      } catch (error) {
        res.status(500).json({ valid: false, message: 'Server error' });
      }
    });
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', service: 'FlutterBye API' });
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