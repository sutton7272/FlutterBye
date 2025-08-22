import express from "express";
import { randomUUID } from "crypto";

const router = express.Router();

// Mock data stores (in production, these would be database operations)
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

// Analytics data
let walletAnalytics = {
  totalEscrowValue: escrowContracts.reduce((sum, contract) => sum + contract.amount, 0),
  totalCustodialBalance: custodialWallets.reduce((sum, wallet) => sum + wallet.balance, 0),
  activeContracts: escrowContracts.filter(c => c.status === 'active').length,
  activeWallets: custodialWallets.filter(w => w.status === 'active').length,
  monthlyTransactionVolume: 2500000,
  averageContractValue: 141666.67,
  complianceScore: 98.5,
  securityRating: "AAA"
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

export default router;