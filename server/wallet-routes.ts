import express from "express";
import { randomUUID } from "crypto";

const router = express.Router();

// COMPREHENSIVE FLUTTERBYE WALLET MANAGEMENT SYSTEM
// Includes: Payment Collection Wallets, Attached Value Escrow, Enterprise Contracts

// FlutterBye Core Payment Collection Wallets
let paymentCollectionWallets: any[] = [
  {
    id: "payment-main-sol",
    walletAddress: "FLBYpay1234567890ABCDEFGHJKLMNPQRSTUVWXYZabcd",
    purpose: "Main SOL Payment Collection",
    type: "payment_collection",
    currency: "SOL",
    balance: 1250000, // $1.25M in SOL
    status: "active",
    totalCollected: 8750000, // $8.75M lifetime
    monthlyVolume: 950000,
    associatedProducts: ["Token Minting", "Value Attachment", "Premium Features"],
    createdAt: "2024-01-01T00:00:00Z",
    isMainWallet: true
  },
  {
    id: "payment-main-usdc",
    walletAddress: "FLBYusdc567890123DEFGHJKLMNPQRSTUVWXYZabcdef",
    purpose: "Main USDC Payment Collection",
    type: "payment_collection",
    currency: "USDC",
    balance: 875000, // $875K in USDC
    status: "active",
    totalCollected: 6200000, // $6.2M lifetime
    monthlyVolume: 720000,
    associatedProducts: ["Enterprise Subscriptions", "Bulk Token Orders"],
    createdAt: "2024-01-01T00:00:00Z",
    isMainWallet: true
  },
  {
    id: "payment-flby-rewards",
    walletAddress: "FLBYrewd890123456GHJKLMNPQRSTUVWXYZabcdefgh",
    purpose: "FLBY Token Rewards & Discounts",
    type: "payment_collection",
    currency: "FLBY",
    balance: 2500000, // 2.5M FLBY tokens
    status: "active",
    totalCollected: 15000000, // 15M FLBY lifetime
    monthlyVolume: 1800000,
    associatedProducts: ["Fee Discounts", "Governance Participation", "Staking Rewards"],
    createdAt: "2024-01-01T00:00:00Z",
    isMainWallet: true
  }
];

// Attached Value Escrow Wallets (for minted coins with attached value)
let attachedValueEscrows: any[] = [
  {
    id: "escrow-attached-001",
    tokenId: "token-love-message-001",
    escrowWallet: "ESCattach123456789ABCDEFGHJKLMNPQRSTUVWXYZab",
    attachedValue: 500, // $500 attached to this token
    currency: "USDC",
    status: "escrowed",
    creatorWallet: "Creator123456789ABCDEFGHJKLMNPQRSTUVWXYZabcd",
    recipientWallet: "Recipient123456789ABCDEFGHJKLMNPQRSTUVWXYZab",
    expiresAt: "2024-12-31T23:59:59Z",
    message: "Happy Anniversary! Redeem for dinner at our favorite restaurant 💕",
    escrowType: "attached_value",
    redemptionCode: "LOVE2024-ANNI",
    createdAt: "2024-02-14T12:00:00Z"
  },
  {
    id: "escrow-attached-002", 
    tokenId: "token-graduation-gift",
    escrowWallet: "ESCattach234567890ABCDEFGHJKLMNPQRSTUVWXYZbc",
    attachedValue: 1000, // $1000 graduation gift
    currency: "SOL",
    status: "escrowed",
    creatorWallet: "Parent123456789ABCDEFGHJKLMNPQRSTUVWXYZabcd",
    recipientWallet: "Graduate123456789ABCDEFGHJKLMNPQRSTUVWXYZab",
    expiresAt: "2025-06-30T23:59:59Z",
    message: "Congratulations on graduating! Use this towards your first apartment 🎓",
    escrowType: "attached_value",
    redemptionCode: "GRAD2024-GIFT",
    createdAt: "2024-05-15T18:00:00Z"
  },
  {
    id: "escrow-attached-003",
    tokenId: "token-birthday-surprise",
    escrowWallet: "ESCattach345678901ABCDEFGHJKLMNPQRSTUVWXYZcd",
    attachedValue: 250, // $250 birthday surprise
    currency: "USDC",
    status: "redeemed",
    creatorWallet: "Friend123456789ABCDEFGHJKLMNPQRSTUVWXYZabcd",
    recipientWallet: "Birthday123456789ABCDEFGHJKLMNPQRSTUVWXYZab",
    redeemedAt: "2024-06-10T15:30:00Z",
    message: "Happy 25th Birthday! 🎉 Treat yourself to something special!",
    escrowType: "attached_value",
    redemptionCode: "BDAY2024-FUN",
    createdAt: "2024-06-01T10:00:00Z"
  }
];

// Enterprise Escrow Contracts (high-value business contracts)
let escrowContracts: any[] = [
  {
    id: "escrow-001",
    contractAddress: "0x742d35Cc6634C0532925a3b8D5A5C13D5c5dA81A",
    clientId: "client-enterprise-001",
    amount: 150000,
    currency: "USDC",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    expiryDate: "2024-12-31T23:59:59Z",
    description: "Enterprise DeFi Protocol Development Contract"
  },
  {
    id: "escrow-002", 
    contractAddress: "0x893f56C3c5A8C9A5D5B4E9F2C8D7A6B5C4F3E2D1",
    clientId: "client-nft-marketplace",
    amount: 75000,
    currency: "SOL",
    status: "pending",
    createdAt: "2024-01-20T14:30:00Z",
    expiryDate: "2024-06-30T23:59:59Z",
    description: "NFT Marketplace Integration & Analytics"
  },
  {
    id: "escrow-003",
    contractAddress: "0x456b78C9d0E1F2A3B4C5D6E7F8G9H0I1J2K3L4M5",
    clientId: "client-dao-governance", 
    amount: 200000,
    currency: "USDC",
    status: "completed",
    createdAt: "2023-12-01T09:15:00Z",
    expiryDate: "2024-03-31T23:59:59Z",
    description: "DAO Governance Platform & Token Economics"
  }
];

let custodialWallets: any[] = [
  {
    id: "wallet-001",
    walletAddress: "8o85ELbk7Ny8WNQjCEo5pHjPctcMbWxsK1qC6tYFdHa7",
    userId: "user-premium-001",
    balance: 25000,
    currency: "USDC",
    status: "active",
    createdAt: "2024-01-10T08:00:00Z",
    lastTransaction: "2024-01-22T16:45:00Z"
  },
  {
    id: "wallet-002",
    walletAddress: "4xY2D8F3nQ9sM1pR6tZ5bV7wX0aH8cJ2kL4mN7oP9qS3",
    userId: "user-institutional-002",
    balance: 180000,
    currency: "SOL",
    status: "active", 
    createdAt: "2024-01-12T11:20:00Z",
    lastTransaction: "2024-01-23T09:30:00Z"
  },
  {
    id: "wallet-003",
    walletAddress: "9zA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1",
    userId: undefined,
    balance: 0,
    currency: "USDC", 
    status: "pending",
    createdAt: "2024-01-25T13:15:00Z",
    lastTransaction: undefined
  },
  {
    id: "wallet-004",
    walletAddress: "3mV4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4",
    userId: "user-frozen-account",
    balance: 5000,
    currency: "USDC",
    status: "frozen",
    createdAt: "2024-01-18T15:45:00Z", 
    lastTransaction: "2024-01-19T10:20:00Z"
  }
];

// Comprehensive Analytics including all wallet types
let walletAnalytics = {
  // Payment Collection Analytics
  totalPaymentCollected: paymentCollectionWallets.reduce((sum, wallet) => sum + wallet.totalCollected, 0),
  monthlyPaymentVolume: paymentCollectionWallets.reduce((sum, wallet) => sum + wallet.monthlyVolume, 0),
  currentPaymentBalance: paymentCollectionWallets.reduce((sum, wallet) => sum + wallet.balance, 0),
  
  // Attached Value Escrow Analytics  
  totalAttachedValueEscrowed: attachedValueEscrows.filter(e => e.status === 'escrowed').reduce((sum, escrow) => sum + escrow.attachedValue, 0),
  totalAttachedValueRedeemed: attachedValueEscrows.filter(e => e.status === 'redeemed').reduce((sum, escrow) => sum + escrow.attachedValue, 0),
  activeAttachedValueEscrows: attachedValueEscrows.filter(e => e.status === 'escrowed').length,
  
  // Enterprise Contract Analytics
  totalEscrowValue: escrowContracts.reduce((sum, contract) => sum + contract.amount, 0),
  totalCustodialBalance: custodialWallets.reduce((sum, wallet) => sum + wallet.balance, 0),
  activeContracts: escrowContracts.filter(c => c.status === 'active').length,
  activeWallets: custodialWallets.filter(w => w.status === 'active').length,
  
  // Comprehensive metrics
  monthlyTransactionVolume: 2500000,
  averageContractValue: 141666.67,
  averageAttachedValue: 583.33,
  complianceScore: 98.5,
  securityRating: "AAA",
  
  // Platform revenue metrics
  platformRevenueThisMonth: 125000,
  totalPlatformRevenue: 2450000,
  averageTokenMintingFee: 0.25,
  attachedValueFeeRate: 2.5 // 2.5% fee on attached values
};

// GET /api/escrow/contracts - Fetch all escrow contracts
router.get("/escrow/contracts", (req, res) => {
  try {
    const sortedContracts = escrowContracts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    res.json({
      success: true,
      contracts: sortedContracts,
      total: escrowContracts.length,
      totalValue: escrowContracts.reduce((sum, contract) => sum + contract.amount, 0)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch escrow contracts",
      details: error
    });
  }
});

// POST /api/escrow/contracts - Create new escrow contract
router.post("/escrow/contracts", (req, res) => {
  try {
    const { amount, description, clientId, currency = "USDC", expiryDays = 365 } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid amount is required"
      });
    }

    const newContract = {
      id: `escrow-${randomUUID().slice(0, 8)}`,
      contractAddress: `0x${randomUUID().replace(/-/g, '')}`.slice(0, 42),
      clientId: clientId || `client-${randomUUID().slice(0, 8)}`,
      amount: parseFloat(amount),
      currency,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiryDate: new Date(Date.now() + (expiryDays * 24 * 60 * 60 * 1000)).toISOString(),
      description: description || "New escrow contract"
    };

    escrowContracts.push(newContract);

    // Update analytics
    walletAnalytics.totalEscrowValue += newContract.amount;
    walletAnalytics.activeContracts = escrowContracts.filter(c => c.status === 'active').length;

    res.status(201).json({
      success: true,
      message: "Escrow contract created successfully",
      contract: newContract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create escrow contract",
      details: error
    });
  }
});

// PUT /api/escrow/contracts/:id/status - Update contract status
router.put("/escrow/contracts/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be one of: " + validStatuses.join(', ')
      });
    }

    const contractIndex = escrowContracts.findIndex(c => c.id === id);
    if (contractIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Contract not found"
      });
    }

    escrowContracts[contractIndex].status = status;
    escrowContracts[contractIndex].updatedAt = new Date().toISOString();

    // Update analytics
    walletAnalytics.activeContracts = escrowContracts.filter(c => c.status === 'active').length;

    res.json({
      success: true,
      message: "Contract status updated successfully",
      contract: escrowContracts[contractIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update contract status",
      details: error
    });
  }
});

// GET /api/custodial/wallets - Fetch all custodial wallets
router.get("/custodial/wallets", (req, res) => {
  try {
    const sortedWallets = custodialWallets.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    res.json({
      success: true,
      wallets: sortedWallets,
      total: custodialWallets.length,
      totalBalance: custodialWallets.reduce((sum, wallet) => sum + wallet.balance, 0)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch custodial wallets",
      details: error
    });
  }
});

// POST /api/custodial/wallets - Create new custodial wallet
router.post("/custodial/wallets", (req, res) => {
  try {
    const { userId, currency = "USDC", initialBalance = 0 } = req.body;

    // Generate a realistic Solana wallet address
    const generateWalletAddress = () => {
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
      let result = '';
      for (let i = 0; i < 44; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const newWallet = {
      id: `wallet-${randomUUID().slice(0, 8)}`,
      walletAddress: generateWalletAddress(),
      userId: userId || undefined,
      balance: parseFloat(initialBalance),
      currency,
      status: "active",
      createdAt: new Date().toISOString(),
      lastTransaction: initialBalance > 0 ? new Date().toISOString() : undefined
    };

    custodialWallets.push(newWallet);

    // Update analytics
    walletAnalytics.totalCustodialBalance += newWallet.balance;
    walletAnalytics.activeWallets = custodialWallets.filter(w => w.status === 'active').length;

    res.status(201).json({
      success: true,
      message: "Custodial wallet created successfully",
      wallet: newWallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create custodial wallet",
      details: error
    });
  }
});

// PUT /api/custodial/wallets/:id/status - Update wallet status
router.put("/custodial/wallets/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['active', 'frozen', 'pending', 'disabled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be one of: " + validStatuses.join(', ')
      });
    }

    const walletIndex = custodialWallets.findIndex(w => w.id === id);
    if (walletIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Wallet not found"
      });
    }

    custodialWallets[walletIndex].status = status;
    custodialWallets[walletIndex].updatedAt = new Date().toISOString();

    // Update analytics
    walletAnalytics.activeWallets = custodialWallets.filter(w => w.status === 'active').length;

    res.json({
      success: true,
      message: "Wallet status updated successfully",
      wallet: custodialWallets[walletIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update wallet status",
      details: error
    });
  }
});

// POST /api/custodial/wallets/:id/transfer - Transfer funds between wallets
router.post("/custodial/wallets/:id/transfer", (req, res) => {
  try {
    const { id } = req.params;
    const { toWalletId, amount, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid transfer amount is required"
      });
    }

    const fromWalletIndex = custodialWallets.findIndex(w => w.id === id);
    const toWalletIndex = custodialWallets.findIndex(w => w.id === toWalletId);

    if (fromWalletIndex === -1 || toWalletIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "One or both wallets not found"
      });
    }

    const fromWallet = custodialWallets[fromWalletIndex];
    const toWallet = custodialWallets[toWalletIndex];

    if (fromWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        error: "Insufficient balance"
      });
    }

    if (fromWallet.status !== 'active' || toWallet.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: "Both wallets must be active for transfers"
      });
    }

    // Perform transfer
    custodialWallets[fromWalletIndex].balance -= amount;
    custodialWallets[toWalletIndex].balance += amount;
    
    const timestamp = new Date().toISOString();
    custodialWallets[fromWalletIndex].lastTransaction = timestamp;
    custodialWallets[toWalletIndex].lastTransaction = timestamp;

    res.json({
      success: true,
      message: "Transfer completed successfully",
      transfer: {
        from: fromWallet.walletAddress,
        to: toWallet.walletAddress,
        amount,
        description,
        timestamp
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to process transfer",
      details: error
    });
  }
});

// GET /api/wallet/analytics - Get comprehensive wallet analytics
router.get("/wallet/analytics", (req, res) => {
  try {
    // Recalculate real-time analytics
    const currentAnalytics = {
      ...walletAnalytics,
      totalEscrowValue: escrowContracts.reduce((sum, contract) => sum + contract.amount, 0),
      totalCustodialBalance: custodialWallets.reduce((sum, wallet) => sum + wallet.balance, 0),
      activeContracts: escrowContracts.filter(c => c.status === 'active').length,
      activeWallets: custodialWallets.filter(w => w.status === 'active').length,
      pendingContracts: escrowContracts.filter(c => c.status === 'pending').length,
      frozenWallets: custodialWallets.filter(w => w.status === 'frozen').length,
      completedContracts: escrowContracts.filter(c => c.status === 'completed').length,
      lastUpdated: new Date().toISOString()
    };

    // Add performance metrics
    const performanceMetrics = {
      contractSuccessRate: escrowContracts.length > 0 ? 
        (escrowContracts.filter(c => c.status === 'completed').length / escrowContracts.length * 100) : 0,
      averageContractDuration: "45 days",
      walletUtilizationRate: custodialWallets.length > 0 ?
        (custodialWallets.filter(w => w.balance > 0).length / custodialWallets.length * 100) : 0,
      securityIncidents: 0,
      uptimePercentage: 99.9
    };

    res.json({
      success: true,
      analytics: currentAnalytics,
      performance: performanceMetrics,
      trends: {
        weeklyGrowth: 12.5,
        monthlyGrowth: 45.2,
        quarterlyGrowth: 187.3
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics",
      details: error
    });
  }
});

// POST /api/wallet/bulk-create - Bulk create custodial wallets
router.post("/wallet/bulk-create", (req, res) => {
  try {
    const { count = 1, currency = "USDC", userIdPrefix } = req.body;
    
    if (count < 1 || count > 100) {
      return res.status(400).json({
        success: false,
        error: "Count must be between 1 and 100"
      });
    }

    const generateWalletAddress = () => {
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
      let result = '';
      for (let i = 0; i < 44; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const newWallets = [];
    for (let i = 0; i < count; i++) {
      const newWallet = {
        id: `wallet-bulk-${randomUUID().slice(0, 8)}`,
        walletAddress: generateWalletAddress(),
        userId: userIdPrefix ? `${userIdPrefix}-${i + 1}` : undefined,
        balance: 0,
        currency,
        status: "active",
        createdAt: new Date().toISOString(),
        lastTransaction: undefined
      };
      
      custodialWallets.push(newWallet);
      newWallets.push(newWallet);
    }

    // Update analytics
    walletAnalytics.activeWallets = custodialWallets.filter(w => w.status === 'active').length;

    res.status(201).json({
      success: true,
      message: `${count} custodial wallets created successfully`,
      wallets: newWallets,
      count: newWallets.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to bulk create wallets",
      details: error
    });
  }
});

// POST /api/escrow/contracts/:id/release - Release escrow funds
router.post("/escrow/contracts/:id/release", (req, res) => {
  try {
    const { id } = req.params;
    const { releaseAmount, reason } = req.body;
    
    const contractIndex = escrowContracts.findIndex(c => c.id === id);
    if (contractIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Contract not found"
      });
    }

    const contract = escrowContracts[contractIndex];
    
    if (contract.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: "Only active contracts can release funds"
      });
    }

    const amountToRelease = releaseAmount || contract.amount;
    
    if (amountToRelease > contract.amount) {
      return res.status(400).json({
        success: false,
        error: "Release amount cannot exceed contract amount"
      });
    }

    // Update contract
    escrowContracts[contractIndex].amount -= amountToRelease;
    escrowContracts[contractIndex].status = contract.amount === 0 ? 'completed' : 'active';
    escrowContracts[contractIndex].lastRelease = {
      amount: amountToRelease,
      reason: reason || "Standard release",
      timestamp: new Date().toISOString()
    };

    // Update analytics
    walletAnalytics.totalEscrowValue -= amountToRelease;
    if (escrowContracts[contractIndex].status === 'completed') {
      walletAnalytics.activeContracts--;
    }

    res.json({
      success: true,
      message: "Funds released successfully",
      released: {
        amount: amountToRelease,
        currency: contract.currency,
        reason,
        timestamp: new Date().toISOString()
      },
      contract: escrowContracts[contractIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to release funds",
      details: error
    });
  }
});

// GET /api/payment/wallets - Get all FlutterBye payment collection wallets
router.get("/payment/wallets", (req, res) => {
  try {
    const sortedWallets = paymentCollectionWallets.sort((a, b) => 
      b.totalCollected - a.totalCollected
    );
    
    res.json({
      success: true,
      wallets: sortedWallets,
      total: paymentCollectionWallets.length,
      totalBalance: paymentCollectionWallets.reduce((sum, wallet) => sum + wallet.balance, 0),
      totalCollected: paymentCollectionWallets.reduce((sum, wallet) => sum + wallet.totalCollected, 0)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment collection wallets",
      details: error
    });
  }
});

// GET /api/attached-value/escrows - Get all attached value escrow wallets
router.get("/attached-value/escrows", (req, res) => {
  try {
    const sortedEscrows = attachedValueEscrows.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    res.json({
      success: true,
      escrows: sortedEscrows,
      total: attachedValueEscrows.length,
      totalEscrowed: attachedValueEscrows.filter(e => e.status === 'escrowed').reduce((sum, escrow) => sum + escrow.attachedValue, 0),
      totalRedeemed: attachedValueEscrows.filter(e => e.status === 'redeemed').reduce((sum, escrow) => sum + escrow.attachedValue, 0)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch attached value escrows",
      details: error
    });
  }
});

// POST /api/attached-value/escrows - Create new attached value escrow
router.post("/attached-value/escrows", (req, res) => {
  try {
    const { 
      tokenId, 
      attachedValue, 
      currency = "USDC", 
      creatorWallet, 
      recipientWallet, 
      message, 
      expiryDays = 365 
    } = req.body;
    
    if (!tokenId || !attachedValue || !creatorWallet) {
      return res.status(400).json({
        success: false,
        error: "tokenId, attachedValue, and creatorWallet are required"
      });
    }

    const generateEscrowWallet = () => {
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
      let result = 'ESCattach';
      for (let i = 0; i < 36; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const generateRedemptionCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
      let result = '';
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (i < 3) result += '-';
      }
      return result;
    };

    const newEscrow = {
      id: `escrow-attached-${randomUUID().slice(0, 8)}`,
      tokenId,
      escrowWallet: generateEscrowWallet(),
      attachedValue: parseFloat(attachedValue),
      currency,
      status: "escrowed",
      creatorWallet,
      recipientWallet: recipientWallet || null,
      expiresAt: new Date(Date.now() + (expiryDays * 24 * 60 * 60 * 1000)).toISOString(),
      message: message || "Value attached to FlutterBye token",
      escrowType: "attached_value",
      redemptionCode: generateRedemptionCode(),
      createdAt: new Date().toISOString()
    };

    attachedValueEscrows.push(newEscrow);

    res.status(201).json({
      success: true,
      message: "Attached value escrow created successfully",
      escrow: newEscrow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create attached value escrow",
      details: error
    });
  }
});

// POST /api/attached-value/escrows/:id/redeem - Redeem attached value
router.post("/attached-value/escrows/:id/redeem", (req, res) => {
  try {
    const { id } = req.params;
    const { recipientWallet, redemptionCode } = req.body;
    
    const escrowIndex = attachedValueEscrows.findIndex(e => e.id === id);
    if (escrowIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Attached value escrow not found"
      });
    }

    const escrow = attachedValueEscrows[escrowIndex];
    
    if (escrow.status !== 'escrowed') {
      return res.status(400).json({
        success: false,
        error: "This escrow has already been processed"
      });
    }

    if (escrow.redemptionCode && escrow.redemptionCode !== redemptionCode) {
      return res.status(400).json({
        success: false,
        error: "Invalid redemption code"
      });
    }

    if (escrow.expiresAt && new Date() > new Date(escrow.expiresAt)) {
      return res.status(400).json({
        success: false,
        error: "This escrow has expired"
      });
    }

    // Update escrow status
    attachedValueEscrows[escrowIndex].status = 'redeemed';
    attachedValueEscrows[escrowIndex].redeemedAt = new Date().toISOString();
    attachedValueEscrows[escrowIndex].redeemedBy = recipientWallet;

    res.json({
      success: true,
      message: "Attached value redeemed successfully",
      redeemed: {
        amount: escrow.attachedValue,
        currency: escrow.currency,
        message: escrow.message,
        timestamp: new Date().toISOString()
      },
      escrow: attachedValueEscrows[escrowIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to redeem attached value",
      details: error
    });
  }
});

// GET /api/payment/revenue-analytics - Get comprehensive payment and revenue analytics
router.get("/payment/revenue-analytics", (req, res) => {
  try {
    const currentAnalytics = {
      // Payment Collection Analytics
      paymentWallets: {
        totalCollected: paymentCollectionWallets.reduce((sum, wallet) => sum + wallet.totalCollected, 0),
        monthlyVolume: paymentCollectionWallets.reduce((sum, wallet) => sum + wallet.monthlyVolume, 0),
        currentBalance: paymentCollectionWallets.reduce((sum, wallet) => sum + wallet.balance, 0),
        walletCount: paymentCollectionWallets.length,
        byProduct: {
          "Token Minting": 5200000,
          "Value Attachment": 3800000,
          "Enterprise Subscriptions": 6200000,
          "Premium Features": 2950000,
          "FLBY Rewards": 15000000
        }
      },
      
      // Attached Value Analytics
      attachedValues: {
        totalEscrowed: attachedValueEscrows.filter(e => e.status === 'escrowed').reduce((sum, escrow) => sum + escrow.attachedValue, 0),
        totalRedeemed: attachedValueEscrows.filter(e => e.status === 'redeemed').reduce((sum, escrow) => sum + escrow.attachedValue, 0),
        activeEscrows: attachedValueEscrows.filter(e => e.status === 'escrowed').length,
        redemptionRate: attachedValueEscrows.length > 0 ? 
          (attachedValueEscrows.filter(e => e.status === 'redeemed').length / attachedValueEscrows.length * 100) : 0,
        averageValue: attachedValueEscrows.length > 0 ?
          (attachedValueEscrows.reduce((sum, escrow) => sum + escrow.attachedValue, 0) / attachedValueEscrows.length) : 0
      },
      
      // Revenue Breakdown
      revenue: {
        totalPlatformRevenue: 2450000,
        monthlyRevenue: 125000,
        revenueBySource: {
          "Minting Fees": 87500,
          "Attached Value Fees": 23750,
          "Enterprise Contracts": 13750
        },
        projectedAnnualRevenue: 1500000
      },
      
      // Platform Metrics
      platform: {
        totalUsers: 25847,
        activeUsers: 8932,
        averageTransactionValue: 127.50,
        platformGrowthRate: 23.5,
        customerRetentionRate: 87.2
      }
    };

    res.json({
      success: true,
      analytics: currentAnalytics,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch revenue analytics",
      details: error
    });
  }
});

// GET /api/wallet/comprehensive-overview - Get all wallet types in one overview
router.get("/wallet/comprehensive-overview", (req, res) => {
  try {
    const overview = {
      paymentCollection: {
        wallets: paymentCollectionWallets,
        totalBalance: paymentCollectionWallets.reduce((sum, wallet) => sum + wallet.balance, 0),
        totalCollected: paymentCollectionWallets.reduce((sum, wallet) => sum + wallet.totalCollected, 0)
      },
      attachedValueEscrows: {
        escrows: attachedValueEscrows,
        totalEscrowed: attachedValueEscrows.filter(e => e.status === 'escrowed').reduce((sum, escrow) => sum + escrow.attachedValue, 0),
        totalRedeemed: attachedValueEscrows.filter(e => e.status === 'redeemed').reduce((sum, escrow) => sum + escrow.attachedValue, 0)
      },
      enterpriseContracts: {
        contracts: escrowContracts,
        totalValue: escrowContracts.reduce((sum, contract) => sum + contract.amount, 0),
        activeCount: escrowContracts.filter(c => c.status === 'active').length
      },
      custodialWallets: {
        wallets: custodialWallets,
        totalBalance: custodialWallets.reduce((sum, wallet) => sum + wallet.balance, 0),
        activeCount: custodialWallets.filter(w => w.status === 'active').length
      },
      summary: {
        totalValue: 
          paymentCollectionWallets.reduce((sum, wallet) => sum + wallet.balance, 0) +
          attachedValueEscrows.filter(e => e.status === 'escrowed').reduce((sum, escrow) => sum + escrow.attachedValue, 0) +
          escrowContracts.reduce((sum, contract) => sum + contract.amount, 0) +
          custodialWallets.reduce((sum, wallet) => sum + wallet.balance, 0),
        totalWallets: paymentCollectionWallets.length + custodialWallets.length,
        totalContracts: escrowContracts.length + attachedValueEscrows.length
      }
    };

    res.json({
      success: true,
      overview,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch comprehensive wallet overview",
      details: error
    });
  }
});

export default router;