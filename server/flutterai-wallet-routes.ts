import type { Express } from "express";
import { walletCollectionService } from "./wallet-collection-service";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";

// Configure multer for CSV file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Validation schemas
const manualWalletEntrySchema = z.object({
  walletAddress: z.string().min(32).max(44),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const csvUploadSchema = z.object({
  batchName: z.string().min(1).max(100),
});

/**
 * FlutterAI Wallet Intelligence Routes
 * Complete API endpoints for wallet collection, analysis, and management
 */
export function registerFlutterAIWalletRoutes(app: Express): void {
  
  // ==================== BASIC WALLET ENDPOINTS ====================
  
  /**
   * Get wallet balance
   * GET /api/wallet/balance/:address
   */
  app.get('/api/wallet/balance/:address', async (req, res) => {
    try {
      const { address } = req.params;
      
      // TODO: Implement actual balance checking via Solana RPC
      const mockBalance = {
        sol: Math.random() * 10,
        usdc: Math.random() * 1000,
        flby: Math.random() * 500
      };
      
      res.json({
        success: true,
        walletAddress: address,
        balances: mockBalance,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Wallet balance error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch wallet balance'
      });
    }
  });

  /**
   * Get token holdings
   * GET /api/tokens/holdings/:address
   */
  app.get('/api/tokens/holdings/:address', async (req, res) => {
    try {
      const { address } = req.params;
      
      // TODO: Implement actual token holdings via storage/database
      const mockHoldings = [
        {
          tokenId: 'FLBY-MSG-001',
          amount: 1,
          message: 'Welcome to Flutterbye!',
          value: 0.1,
          currency: 'SOL'
        }
      ];
      
      res.json({
        success: true,
        walletAddress: address,
        holdings: mockHoldings,
        totalCount: mockHoldings.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Token holdings error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch token holdings'
      });
    }
  });

  /**
   * Connect wallet endpoint
   * POST /api/wallet/connect
   */
  app.post('/api/wallet/connect', async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          error: 'Wallet address is required'
        });
      }
      
      res.json({
        success: true,
        message: 'Wallet connected successfully',
        walletAddress,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Wallet connect error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect wallet'
      });
    }
  });
  
  // ==================== WALLET COLLECTION ENDPOINTS ====================
  
  /**
   * Manual wallet entry by admin
   * POST /api/flutterai/collect/manual
   */
  app.post('/api/flutterai/collect/manual', async (req, res) => {
    try {
      const { walletAddress, tags, notes } = manualWalletEntrySchema.parse(req.body);
      const adminUserId = req.user?.id || 'system'; // TODO: Implement proper admin auth
      
      await walletCollectionService.collectManualEntry(walletAddress, adminUserId, tags, notes);
      
      res.json({
        success: true,
        message: 'Wallet address collected and queued for analysis',
        walletAddress,
      });
    } catch (error) {
      console.error('Manual wallet collection error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to collect wallet address',
      });
    }
  });

  /**
   * CSV bulk upload of wallet addresses
   * POST /api/flutterai/collect/csv-upload
   */
  app.post('/api/flutterai/collect/csv-upload', upload.single('csvFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No CSV file provided',
        });
      }

      const { batchName } = csvUploadSchema.parse(req.body);
      const uploadedBy = req.user?.id || 'system'; // TODO: Implement proper admin auth
      const csvContent = req.file.buffer.toString('utf-8');
      
      const result = await walletCollectionService.processCsvUpload(
        csvContent,
        req.file.originalname,
        batchName,
        uploadedBy
      );
      
      res.json({
        success: true,
        message: 'CSV file processed successfully',
        ...result,
      });
    } catch (error) {
      console.error('CSV upload error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process CSV file',
      });
    }
  });

  /**
   * Automatic wallet collection webhook for FlutterBye connections
   * POST /api/flutterai/collect/flutterbye-webhook
   */
  app.post('/api/flutterai/collect/flutterbye-webhook', async (req, res) => {
    try {
      const { walletAddress, userId } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          error: 'Wallet address is required',
        });
      }
      
      await walletCollectionService.collectFromFlutterByeConnection(walletAddress, userId);
      
      res.json({
        success: true,
        message: 'FlutterBye wallet collected successfully',
        walletAddress,
      });
    } catch (error) {
      console.error('FlutterBye webhook error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to collect FlutterBye wallet',
      });
    }
  });

  /**
   * Automatic wallet collection webhook for PerpeTrader connections
   * POST /api/flutterai/collect/perpetrader-webhook
   */
  app.post('/api/flutterai/collect/perpetrader-webhook', async (req, res) => {
    try {
      const { walletAddress, userId } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          error: 'Wallet address is required',
        });
      }
      
      await walletCollectionService.collectFromPerpeTraderConnection(walletAddress, userId);
      
      res.json({
        success: true,
        message: 'PerpeTrader wallet collected successfully',
        walletAddress,
      });
    } catch (error) {
      console.error('PerpeTrader webhook error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to collect PerpeTrader wallet',
      });
    }
  });

  // ==================== WALLET INTELLIGENCE QUERIES ====================

  /**
   * Get all collected wallets with filtering and pagination
   * GET /api/flutterai/wallets
   */
  app.get('/api/flutterai/wallets', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const riskLevel = req.query.riskLevel as string;
      const source = req.query.source as string;
      
      let wallets;
      
      if (riskLevel) {
        wallets = await storage.getWalletsByRiskLevel(riskLevel);
      } else {
        wallets = await storage.getAllWalletIntelligence(limit, offset);
      }
      
      // Filter by source if specified
      if (source) {
        wallets = wallets.filter(w => w.collectionSource === source);
      }
      
      res.json({
        success: true,
        wallets,
        pagination: {
          limit,
          offset,
          total: wallets.length,
        },
      });
    } catch (error) {
      console.error('Get wallets error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve wallets',
      });
    }
  });

  /**
   * Get specific wallet intelligence data
   * GET /api/flutterai/wallets/:walletAddress
   */
  app.get('/api/flutterai/wallets/:walletAddress', async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const wallet = await storage.getWalletIntelligence(walletAddress);
      
      if (!wallet) {
        return res.status(404).json({
          success: false,
          error: 'Wallet not found',
        });
      }
      
      res.json({
        success: true,
        wallet,
      });
    } catch (error) {
      console.error('Get wallet error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve wallet',
      });
    }
  });

  /**
   * Search wallets by address or analysis data
   * GET /api/flutterai/wallets/search
   */
  app.get('/api/flutterai/wallets/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required',
        });
      }
      
      const wallets = await storage.searchWalletIntelligence(query);
      
      res.json({
        success: true,
        wallets,
        query,
      });
    } catch (error) {
      console.error('Search wallets error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search wallets',
      });
    }
  });

  // ==================== BATCH MANAGEMENT ====================

  /**
   * Get all wallet batches
   * GET /api/flutterai/batches
   */
  app.get('/api/flutterai/batches', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 25;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const batches = await storage.getAllWalletBatches(limit, offset);
      
      res.json({
        success: true,
        batches,
        pagination: {
          limit,
          offset,
          total: batches.length,
        },
      });
    } catch (error) {
      console.error('Get batches error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve batches',
      });
    }
  });

  /**
   * Get specific batch details
   * GET /api/flutterai/batches/:batchId
   */
  app.get('/api/flutterai/batches/:batchId', async (req, res) => {
    try {
      const { batchId } = req.params;
      const batch = await storage.getWalletBatch(batchId);
      
      if (!batch) {
        return res.status(404).json({
          success: false,
          error: 'Batch not found',
        });
      }
      
      // Get wallets in this batch
      const allWallets = await storage.getAllWalletIntelligence();
      const batchWallets = allWallets.filter(w => w.batchId === batchId);
      
      res.json({
        success: true,
        batch,
        wallets: batchWallets,
      });
    } catch (error) {
      console.error('Get batch error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve batch',
      });
    }
  });

  // ==================== ANALYSIS MANAGEMENT ====================

  /**
   * Trigger manual analysis for a specific wallet
   * POST /api/flutterai/analyze/:walletAddress
   */
  app.post('/api/flutterai/analyze/:walletAddress', async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const adminUserId = req.user?.id || 'system';
      
      // Check if wallet exists
      const wallet = await storage.getWalletIntelligence(walletAddress);
      if (!wallet) {
        return res.status(404).json({
          success: false,
          error: 'Wallet not found',
        });
      }
      
      // Queue for immediate analysis
      await storage.addToAnalysisQueue(walletAddress, 4, undefined, adminUserId);
      
      res.json({
        success: true,
        message: 'Wallet queued for priority analysis',
        walletAddress,
      });
    } catch (error) {
      console.error('Manual analysis error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to queue wallet for analysis',
      });
    }
  });

  /**
   * Process analysis queue (trigger background processing)
   * POST /api/flutterai/process-queue
   */
  app.post('/api/flutterai/process-queue', async (req, res) => {
    try {
      const batchSize = parseInt(req.body.batchSize) || 10;
      
      await walletCollectionService.processAnalysisQueue(batchSize);
      
      res.json({
        success: true,
        message: `Processing up to ${batchSize} wallets from analysis queue`,
      });
    } catch (error) {
      console.error('Process queue error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process analysis queue',
      });
    }
  });

  /**
   * Get analysis queue status
   * GET /api/flutterai/queue-status
   */
  app.get('/api/flutterai/queue-status', async (req, res) => {
    try {
      const stats = await storage.getAnalysisQueueStats();
      
      res.json({
        success: true,
        queueStats: stats,
      });
    } catch (error) {
      console.error('Queue status error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get queue status',
      });
    }
  });

  // ==================== STATISTICS AND ANALYTICS ====================

  /**
   * Get comprehensive collection statistics
   * GET /api/flutterai/stats
   */
  app.get('/api/flutterai/stats', async (req, res) => {
    try {
      const stats = await walletCollectionService.getCollectionStats();
      
      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve statistics',
      });
    }
  });

  /**
   * Export wallet data (filtered results)
   * GET /api/flutterai/export
   */
  app.get('/api/flutterai/export', async (req, res) => {
    try {
      const format = req.query.format as string || 'json';
      const riskLevel = req.query.riskLevel as string;
      const source = req.query.source as string;
      
      let wallets;
      
      if (riskLevel) {
        wallets = await storage.getWalletsByRiskLevel(riskLevel);
      } else {
        wallets = await storage.getAllWalletIntelligence();
      }
      
      // Filter by source if specified
      if (source) {
        wallets = wallets.filter(w => w.collectionSource === source);
      }
      
      if (format === 'csv') {
        // Generate CSV format
        const csvHeader = 'Wallet Address,Collection Source,Social Credit Score,Risk Level,Trading Score,Portfolio Score,Liquidity Score,Activity Score,Last Analyzed,Collection Date\n';
        const csvRows = wallets.map(w => 
          `${w.walletAddress},${w.collectionSource},${w.socialCreditScore},${w.riskLevel},${w.tradingBehaviorScore},${w.portfolioQualityScore},${w.liquidityScore},${w.activityScore},${w.lastAnalyzed || 'Never'},${w.collectedAt}`
        ).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=flutterai-wallets.csv');
        res.send(csvHeader + csvRows);
      } else {
        res.json({
          success: true,
          wallets,
          exportedAt: new Date().toISOString(),
          totalWallets: wallets.length,
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export wallet data',
      });
    }
  });

  console.log('🧠 FlutterAI Wallet Intelligence routes registered');
}