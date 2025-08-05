import type { Express } from "express";
import { z } from "zod";
import { enterpriseWalletService, type CreateEscrowWallet } from "./enterprise-wallet-service";
import { requireAdmin, authenticateWallet } from "./admin-middleware";
import { apiRateLimit } from "./middleware/security";

// Request schemas
const createEscrowWalletSchema = z.object({
  clientId: z.string().min(1),
  contractValue: z.number().min(200000),
  currency: z.enum(['SOL', 'USDC', 'FLBY']),
  signatories: z.array(z.string()).min(2).max(5),
  requiredSignatures: z.number().min(2).max(5),
  expirationDate: z.string().optional(),
  complianceLevel: z.enum(['standard', 'enhanced', 'bank-level']).default('bank-level')
});

const releaseEscrowSchema = z.object({
  walletId: z.string(),
  recipientAddress: z.string(),
  amount: z.number().positive(),
  signerPrivateKeys: z.array(z.string()).min(2)
});

const walletViewSchema = z.object({
  walletId: z.string(),
  accessLevel: z.enum(['basic', 'detailed', 'audit']).default('basic')
});

export function registerEnterpriseWalletRoutes(app: Express) {
  
  /**
   * Create enterprise escrow wallet
   * POST /api/enterprise/wallet/create-escrow
   */
  app.post('/api/enterprise/wallet/create-escrow', 
    apiRateLimit,
    requireAdmin,
    async (req, res) => {
      try {
        const validatedData = createEscrowWalletSchema.parse(req.body);
        
        // Log enterprise wallet creation for compliance
        console.log(`Creating enterprise escrow wallet for client: ${validatedData.clientId}, value: ${validatedData.currency} ${validatedData.contractValue}`);
        
        const walletMetadata = await enterpriseWalletService.createEscrowWallet(validatedData);
        
        res.status(201).json({
          success: true,
          data: {
            walletId: walletMetadata.id,
            multisigAddress: walletMetadata.multisigAddress,
            requiredSignatures: walletMetadata.requiredSignatures,
            signatoryAddresses: walletMetadata.signatoryAddresses,
            status: walletMetadata.status,
            contractValue: walletMetadata.contractValue,
            currency: walletMetadata.currency,
            createdAt: walletMetadata.createdAt,
            complianceLevel: walletMetadata.complianceLevel
          }
        });
        
      } catch (error) {
        console.error('Error creating escrow wallet:', error);
        res.status(400).json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create escrow wallet'
        });
      }
    }
  );

  /**
   * Get wallet information (balance, transactions, metadata)
   * GET /api/enterprise/wallet/:walletId
   */
  app.get('/api/enterprise/wallet/:walletId',
    apiRateLimit,
    authenticateWallet,
    async (req, res) => {
      try {
        const { walletId } = req.params;
        const { accessLevel = 'basic' } = walletViewSchema.parse({ 
          walletId, 
          accessLevel: req.query.accessLevel 
        });

        const walletInfo = await enterpriseWalletService.getWalletInfo(walletId);
        
        // Filter response based on access level
        const response: any = {
          success: true,
          data: {
            walletId: walletInfo.metadata.id,
            multisigAddress: walletInfo.metadata.multisigAddress,
            balance: walletInfo.balance,
            currency: walletInfo.metadata.currency,
            status: walletInfo.metadata.status,
            contractValue: walletInfo.metadata.contractValue
          }
        };

        if (accessLevel === 'detailed' || accessLevel === 'audit') {
          response.data.transactions = walletInfo.transactions;
          response.data.requiredSignatures = walletInfo.metadata.requiredSignatures;
          response.data.signatoryAddresses = walletInfo.metadata.signatoryAddresses;
          response.data.createdAt = walletInfo.metadata.createdAt;
          response.data.expiresAt = walletInfo.metadata.expiresAt;
        }

        if (accessLevel === 'audit') {
          response.data.auditTrail = walletInfo.metadata.auditTrail;
          response.data.complianceLevel = walletInfo.metadata.complianceLevel;
        }

        res.json(response);
        
      } catch (error) {
        console.error('Error getting wallet info:', error);
        res.status(404).json({
          success: false,
          error: error instanceof Error ? error.message : 'Wallet not found'
        });
      }
    }
  );

  /**
   * Release funds from escrow wallet
   * POST /api/enterprise/wallet/release-escrow
   */
  app.post('/api/enterprise/wallet/release-escrow',
    apiRateLimit,
    requireAdmin,
    async (req, res) => {
      try {
        const validatedData = releaseEscrowSchema.parse(req.body);
        
        // Log escrow release for compliance
        console.log(`Releasing escrow funds from wallet: ${validatedData.walletId}, amount: ${validatedData.amount}`);
        
        const transactionSignature = await enterpriseWalletService.releaseEscrowFunds(
          validatedData.walletId,
          validatedData.recipientAddress,
          validatedData.amount,
          validatedData.signerPrivateKeys
        );
        
        res.json({
          success: true,
          data: {
            transactionSignature,
            walletId: validatedData.walletId,
            amount: validatedData.amount,
            recipientAddress: validatedData.recipientAddress,
            status: 'released',
            timestamp: new Date().toISOString()
          }
        });
        
      } catch (error) {
        console.error('Error releasing escrow funds:', error);
        res.status(400).json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to release escrow funds'
        });
      }
    }
  );

  /**
   * Generate compliance report for regulatory requirements
   * GET /api/enterprise/wallet/:walletId/compliance-report
   */
  app.get('/api/enterprise/wallet/:walletId/compliance-report',
    apiRateLimit,
    requireAdmin,
    async (req, res) => {
      try {
        const { walletId } = req.params;
        
        const complianceReport = await enterpriseWalletService.generateComplianceReport(walletId);
        
        res.json({
          success: true,
          data: complianceReport,
          generatedAt: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('Error generating compliance report:', error);
        res.status(400).json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to generate compliance report'
        });
      }
    }
  );

  /**
   * List all enterprise wallets (admin only)
   * GET /api/enterprise/wallets
   */
  app.get('/api/enterprise/wallets',
    apiRateLimit,
    requireAdmin,
    async (req, res) => {
      try {
        const { clientId, status, currency } = req.query;
        
        // TODO: Implement wallet listing with filtering
        // This would query the database for all wallets matching criteria
        
        res.json({
          success: true,
          data: {
            wallets: [], // TODO: Implement database query
            totalCount: 0,
            filters: { clientId, status, currency }
          }
        });
        
      } catch (error) {
        console.error('Error listing enterprise wallets:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to list enterprise wallets'
        });
      }
    }
  );

  /**
   * Enterprise wallet health check
   * GET /api/enterprise/wallet/health
   */
  app.get('/api/enterprise/wallet/health',
    async (req, res) => {
      try {
        // Check Solana connection
        const solanaConnection = await enterpriseWalletService['connection'].getVersion();
        
        res.json({
          success: true,
          data: {
            service: 'enterprise-wallet-service',
            status: 'healthy',
            solanaConnection: 'connected',
            solanaVersion: solanaConnection,
            timestamp: new Date().toISOString()
          }
        });
        
      } catch (error) {
        console.error('Enterprise wallet service health check failed:', error);
        res.status(503).json({
          success: false,
          error: 'Enterprise wallet service unhealthy',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );
}