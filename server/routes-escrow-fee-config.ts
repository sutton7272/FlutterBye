import { Router } from "express";
import { storage } from "./storage";
import { z } from "zod";

const router = Router();

// Zod schemas for validation
const updateEscrowFeeConfigSchema = z.object({
  depositFeePercentage: z.string().regex(/^\d+\.\d{3}$/).optional(),
  withdrawalFeePercentage: z.string().regex(/^\d+\.\d{3}$/).optional(),
  minimumDepositFee: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  minimumWithdrawalFee: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  maximumDepositFee: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  maximumWithdrawalFee: z.string().regex(/^\d+(\.\d+)?$/).optional(),
});

// Get all escrow fee configurations
router.get("/configs", async (req, res) => {
  try {
    const configs = await storage.getAllEscrowFeeConfigs();
    res.json({
      success: true,
      data: configs
    });
  } catch (error: any) {
    console.error("Error fetching escrow fee configs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch escrow fee configurations"
    });
  }
});

// Get specific currency escrow fee configuration
router.get("/configs/:currency", async (req, res) => {
  try {
    const { currency } = req.params;
    const config = await storage.getEscrowFeeConfig(currency.toUpperCase());
    
    if (!config) {
      return res.status(404).json({
        success: false,
        message: `Escrow fee configuration not found for ${currency}`
      });
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error: any) {
    console.error("Error fetching escrow fee config:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch escrow fee configuration"
    });
  }
});

// Update escrow fee configuration for specific currency
router.put("/configs/:currency", async (req, res) => {
  try {
    const { currency } = req.params;
    const validatedData = updateEscrowFeeConfigSchema.parse(req.body);

    const updatedConfig = await storage.updateEscrowFeeConfig(currency.toUpperCase(), validatedData);

    res.json({
      success: true,
      data: updatedConfig,
      message: `Escrow fee configuration updated for ${currency}`
    });
  } catch (error: any) {
    console.error("Error updating escrow fee config:", error);
    
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid fee configuration data",
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update escrow fee configuration"
    });
  }
});

// Calculate escrow fees for a given amount and currency
router.post("/calculate", async (req, res) => {
  try {
    const { amount, currency, operation } = req.body;

    if (!amount || !currency || !operation) {
      return res.status(400).json({
        success: false,
        message: "Amount, currency, and operation (deposit/withdrawal) are required"
      });
    }

    const config = await storage.getEscrowFeeConfig(currency.toUpperCase());
    
    if (!config) {
      return res.status(404).json({
        success: false,
        message: `Escrow fee configuration not found for ${currency}`
      });
    }

    const numAmount = parseFloat(amount);
    const isDeposit = operation.toLowerCase() === "deposit";
    
    const feePercentage = parseFloat(isDeposit ? config.depositFeePercentage : config.withdrawalFeePercentage);
    const minFee = parseFloat(isDeposit ? config.minimumDepositFee : config.minimumWithdrawalFee);
    const maxFee = parseFloat(isDeposit ? config.maximumDepositFee : config.maximumWithdrawalFee);

    // Calculate percentage fee
    let calculatedFee = (numAmount * feePercentage) / 100;
    
    // Apply min/max constraints
    calculatedFee = Math.max(minFee, Math.min(maxFee, calculatedFee));
    
    const netAmount = isDeposit ? numAmount - calculatedFee : numAmount - calculatedFee;

    res.json({
      success: true,
      data: {
        originalAmount: numAmount,
        feeAmount: calculatedFee,
        netAmount: netAmount,
        feePercentage: feePercentage,
        operation: operation,
        currency: currency.toUpperCase(),
        appliedMinFee: calculatedFee === minFee,
        appliedMaxFee: calculatedFee === maxFee
      }
    });
  } catch (error: any) {
    console.error("Error calculating escrow fees:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate escrow fees"
    });
  }
});

export default router;