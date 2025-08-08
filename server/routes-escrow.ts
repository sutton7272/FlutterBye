import type { Express, Request, Response } from "express";
import { getEscrowContractService } from "./escrow-contract-service";
import { z } from "zod";

// Validation schemas
const createEscrowSchema = z.object({
  amount: z.number().positive(),
  recipientAddress: z.string().length(44), // Solana address length
  timeoutHours: z.number().min(1).max(8760), // 1 hour to 1 year
  escrowId: z.string().min(1).max(50),
  mintAddress: z.string().length(44).optional().default('So11111111111111111111111111111111111111112'), // Default to SOL
});

const releaseEscrowSchema = z.object({
  escrowId: z.string().min(1).max(50),
});

const cancelEscrowSchema = z.object({
  escrowId: z.string().min(1).max(50),
});

export function registerEscrowRoutes(app: Express) {
  
  /**
   * Create new escrow contract
   * POST /api/escrow/create
   */
  app.post("/api/escrow/create", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = createEscrowSchema.parse(req.body);
      
      const escrowService = getEscrowContractService();
      
      // Create escrow on blockchain
      const result = await escrowService.createEscrow({
        amount: validatedData.amount,
        recipientAddress: validatedData.recipientAddress,
        timeoutHours: validatedData.timeoutHours,
        escrowId: validatedData.escrowId,
        mintAddress: validatedData.mintAddress,
      });

      res.json({
        success: true,
        message: "Escrow contract created successfully",
        data: {
          escrowId: validatedData.escrowId,
          escrowAddress: result.escrowAddress,
          signature: result.signature,
          amount: validatedData.amount,
          recipient: validatedData.recipientAddress,
          timeoutHours: validatedData.timeoutHours,
          mintAddress: validatedData.mintAddress,
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error: any) {
      console.error("Error creating escrow:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: "Invalid request data",
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to create escrow contract",
        details: error.message,
      });
    }
  });

  /**
   * Release escrow funds to recipient
   * POST /api/escrow/release
   */
  app.post("/api/escrow/release", async (req: Request, res: Response) => {
    try {
      const validatedData = releaseEscrowSchema.parse(req.body);
      
      const escrowService = getEscrowContractService();
      
      // Release escrow funds
      const signature = await escrowService.releaseEscrow(validatedData.escrowId);

      res.json({
        success: true,
        message: "Escrow funds released successfully",
        data: {
          escrowId: validatedData.escrowId,
          signature,
          status: "released",
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error: any) {
      console.error("Error releasing escrow:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: "Invalid request data",
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to release escrow",
        details: error.message,
      });
    }
  });

  /**
   * Cancel escrow and return funds to authority
   * POST /api/escrow/cancel
   */
  app.post("/api/escrow/cancel", async (req: Request, res: Response) => {
    try {
      const validatedData = cancelEscrowSchema.parse(req.body);
      
      const escrowService = getEscrowContractService();
      
      // Cancel escrow
      const signature = await escrowService.cancelEscrow(validatedData.escrowId);

      res.json({
        success: true,
        message: "Escrow cancelled successfully",
        data: {
          escrowId: validatedData.escrowId,
          signature,
          status: "cancelled",
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error: any) {
      console.error("Error cancelling escrow:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: "Invalid request data",
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to cancel escrow",
        details: error.message,
      });
    }
  });

  /**
   * Get escrow information
   * GET /api/escrow/:escrowId/:authorityAddress
   */
  app.get("/api/escrow/:escrowId/:authorityAddress", async (req: Request, res: Response) => {
    try {
      const { escrowId, authorityAddress } = req.params;
      
      // Validate address format
      if (authorityAddress.length !== 44) {
        return res.status(400).json({
          success: false,
          error: "Invalid authority address format",
        });
      }

      const escrowService = getEscrowContractService();
      
      // Get escrow info
      const escrowInfo = await escrowService.getEscrowInfo(escrowId, authorityAddress);
      
      // Get vault balance
      const vaultBalance = await escrowService.getEscrowVaultBalance(escrowId, authorityAddress);
      
      // Check if expired
      const isExpired = escrowService.isEscrowExpired(escrowInfo);

      res.json({
        success: true,
        data: {
          ...escrowInfo,
          vaultBalance,
          isExpired,
          timeRemaining: isExpired ? 0 : escrowInfo.timeoutTimestamp - Math.floor(Date.now() / 1000),
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error: any) {
      console.error("Error getting escrow info:", error);
      
      res.status(500).json({
        success: false,
        error: "Failed to get escrow information",
        details: error.message,
      });
    }
  });

  /**
   * Get all escrows for an authority
   * GET /api/escrow/authority/:authorityAddress
   */
  app.get("/api/escrow/authority/:authorityAddress", async (req: Request, res: Response) => {
    try {
      const { authorityAddress } = req.params;
      
      // Validate address format
      if (authorityAddress.length !== 44) {
        return res.status(400).json({
          success: false,
          error: "Invalid authority address format",
        });
      }

      const escrowService = getEscrowContractService();
      
      // Get all escrows for authority
      const escrows = await escrowService.getEscrowsByAuthority(authorityAddress);
      
      // Add additional info for each escrow
      const escrowsWithInfo = escrows.map(escrow => ({
        ...escrow,
        isExpired: escrowService.isEscrowExpired(escrow),
        timeRemaining: escrowService.isEscrowExpired(escrow) 
          ? 0 
          : escrow.timeoutTimestamp - Math.floor(Date.now() / 1000),
      }));

      res.json({
        success: true,
        data: {
          escrows: escrowsWithInfo,
          total: escrowsWithInfo.length,
          active: escrowsWithInfo.filter(e => e.status === 'Active').length,
          released: escrowsWithInfo.filter(e => e.status === 'Released').length,
          cancelled: escrowsWithInfo.filter(e => e.status === 'Cancelled').length,
          expired: escrowsWithInfo.filter(e => e.status === 'Expired').length,
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error: any) {
      console.error("Error getting escrows by authority:", error);
      
      res.status(500).json({
        success: false,
        error: "Failed to get escrows",
        details: error.message,
      });
    }
  });

  /**
   * Claim expired escrow (can be called by anyone)
   * POST /api/escrow/claim-expired
   */
  app.post("/api/escrow/claim-expired", async (req: Request, res: Response) => {
    try {
      const { escrowId, authorityAddress } = req.body;
      
      if (!escrowId || !authorityAddress) {
        return res.status(400).json({
          success: false,
          error: "escrowId and authorityAddress are required",
        });
      }

      if (authorityAddress.length !== 44) {
        return res.status(400).json({
          success: false,
          error: "Invalid authority address format",
        });
      }

      const escrowService = getEscrowContractService();
      
      // Claim expired escrow
      const signature = await escrowService.claimExpiredEscrow(escrowId, authorityAddress);

      res.json({
        success: true,
        message: "Expired escrow claimed successfully",
        data: {
          escrowId,
          authorityAddress,
          signature,
          status: "expired_claimed",
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error: any) {
      console.error("Error claiming expired escrow:", error);
      
      res.status(500).json({
        success: false,
        error: "Failed to claim expired escrow",
        details: error.message,
      });
    }
  });

  /**
   * Get escrow contract statistics
   * GET /api/escrow/stats
   */
  app.get("/api/escrow/stats", async (req: Request, res: Response) => {
    try {
      // This would query the blockchain for all escrow accounts
      // For now, return mock stats until contract is deployed
      
      const stats = {
        totalEscrows: 0,
        totalValue: 0,
        activeEscrows: 0,
        releasedEscrows: 0,
        cancelledEscrows: 0,
        expiredEscrows: 0,
        averageEscrowValue: 0,
        contractStatus: process.env.ESCROW_PROGRAM_ID ? "configured" : "not_configured",
      };

      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      });

    } catch (error: any) {
      console.error("Error getting escrow stats:", error);
      
      res.status(500).json({
        success: false,
        error: "Failed to get escrow statistics",
        details: error.message,
      });
    }
  });

  console.log("🔒 Enterprise Escrow Smart Contract API routes registered");
}