import { Router } from 'express';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { EscrowContractService } from './escrow-contract-service';

// Initialize service instance lazily to avoid base58 errors on startup
let escrowContractService: EscrowContractService | null = null;

const getEscrowService = () => {
  if (!escrowContractService) {
    escrowContractService = new EscrowContractService();
  }
  return escrowContractService;
};

const router = Router();

// Withdraw profits from accumulated escrow fees
router.post('/withdraw-profits', async (req, res) => {
  try {
    const { toAddress, amount, currency = 'SOL' } = req.body;

    if (!toAddress || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: toAddress, amount'
      });
    }

    // Validate amount
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    // Minimum withdrawal amounts
    const minimums = {
      SOL: 0.01,
      USDC: 1,
      FLBY: 100
    };

    if (withdrawAmount < minimums[currency as keyof typeof minimums]) {
      return res.status(400).json({
        success: false,
        error: `Minimum withdrawal for ${currency}: ${minimums[currency as keyof typeof minimums]}`
      });
    }

    // Validate destination address
    let destinationPubkey: PublicKey;
    try {
      destinationPubkey = new PublicKey(toAddress);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid destination address'
      });
    }

    // Get authority wallet from service
    const escrowService = getEscrowService();
    const authorityWallet = escrowService.getAuthorityWallet();
    if (!authorityWallet) {
      return res.status(500).json({
        success: false,
        error: 'Escrow authority not configured'
      });
    }

    const connection = escrowService.getConnection();

    // Create withdrawal transaction based on currency
    let transaction: Transaction;
    let actualAmount: number;

    if (currency === 'SOL') {
      // SOL transfer
      actualAmount = withdrawAmount * LAMPORTS_PER_SOL;
      
      // Check authority balance
      const balance = await connection.getBalance(authorityWallet.publicKey);
      const rentExemption = await connection.getMinimumBalanceForRentExemption(0);
      const availableBalance = balance - rentExemption - 5000; // Keep 0.000005 SOL for fees
      
      if (actualAmount > availableBalance) {
        return res.status(400).json({
          success: false,
          error: `Insufficient balance. Available: ${(availableBalance / LAMPORTS_PER_SOL).toFixed(6)} SOL`
        });
      }

      transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: authorityWallet.publicKey,
          toPubkey: destinationPubkey,
          lamports: actualAmount
        })
      );
    } else {
      // Token transfer (USDC, FLBY, etc.)
      const tokenMints = {
        USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mainnet
        FLBY: 'So11111111111111111111111111111111111111112' // Placeholder for FLBY token
      };

      const mintPubkey = new PublicKey(tokenMints[currency as keyof typeof tokenMints]);
      
      // Get decimals for the token (assuming 6 for USDC, 9 for others)
      const decimals = currency === 'USDC' ? 6 : 9;
      actualAmount = withdrawAmount * Math.pow(10, decimals);

      // Get associated token accounts
      const sourceTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        authorityWallet.publicKey
      );
      const destinationTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        destinationPubkey
      );

      // Check source token balance
      try {
        const tokenAccountInfo = await connection.getTokenAccountBalance(sourceTokenAccount);
        const availableTokens = parseInt(tokenAccountInfo.value.amount);
        
        if (actualAmount > availableTokens) {
          return res.status(400).json({
            success: false,
            error: `Insufficient ${currency} balance. Available: ${(availableTokens / Math.pow(10, decimals)).toFixed(decimals === 6 ? 2 : 4)} ${currency}`
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: `No ${currency} tokens available for withdrawal`
        });
      }

      transaction = new Transaction().add(
        createTransferInstruction(
          sourceTokenAccount,
          destinationTokenAccount,
          authorityWallet.publicKey,
          actualAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      );
    }

    // Get recent blockhash and sign transaction
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = authorityWallet.publicKey;
    
    transaction.sign(authorityWallet);

    // Send transaction
    const signature = await connection.sendRawTransaction(transaction.serialize());
    
    // Confirm transaction
    await connection.confirmTransaction(signature, 'confirmed');

    // Log the withdrawal for audit purposes
    console.log(`Profit withdrawal: ${amount} ${currency} to ${toAddress.slice(0, 8)}...${toAddress.slice(-8)}, tx: ${signature}`);

    res.json({
      success: true,
      data: {
        signature,
        amount: withdrawAmount,
        currency,
        toAddress,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Withdrawal error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process withdrawal'
    });
  }
});

// Get available profits for withdrawal
router.get('/available-profits', async (req, res) => {
  try {
    const escrowService = getEscrowService();
    const authorityWallet = escrowService.getAuthorityWallet();
    if (!authorityWallet) {
      return res.status(500).json({
        success: false,
        error: 'Escrow authority not configured'
      });
    }

    const connection = escrowService.getConnection();

    // Get SOL balance
    const solBalance = await connection.getBalance(authorityWallet.publicKey);
    const rentExemption = await connection.getMinimumBalanceForRentExemption(0);
    const availableSol = Math.max(0, (solBalance - rentExemption - 5000) / LAMPORTS_PER_SOL);

    // Get token balances (you can expand this for USDC, FLBY, etc.)
    const profits = {
      SOL: {
        balance: availableSol,
        formatted: `${availableSol.toFixed(6)} SOL`,
        usdValue: availableSol * 150 // Approximate SOL price - should use real price feed
      },
      USDC: {
        balance: 0,
        formatted: '$0.00',
        usdValue: 0
      },
      FLBY: {
        balance: 0,
        formatted: '0 FLBY',
        usdValue: 0
      }
    };

    res.json({
      success: true,
      data: {
        profits,
        totalUsdValue: Object.values(profits).reduce((sum, p) => sum + p.usdValue, 0),
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Error fetching available profits:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch available profits'
    });
  }
});

// Get withdrawal history
router.get('/withdrawal-history', async (req, res) => {
  try {
    const escrowService = getEscrowService();
    const authorityWallet = escrowService.getAuthorityWallet();
    if (!authorityWallet) {
      return res.status(500).json({
        success: false,
        error: 'Escrow authority not configured'
      });
    }

    const connection = escrowService.getConnection();

    // Get transaction history for the authority wallet
    const signatures = await connection.getSignaturesForAddress(
      authorityWallet.publicKey,
      { limit: 50 }
    );

    // Filter for withdrawal transactions (this is a simplified approach)
    const withdrawalHistory = signatures
      .filter((sig: any) => sig.memo && sig.memo.includes('withdrawal'))
      .map((sig: any) => ({
        signature: sig.signature,
        timestamp: new Date(sig.blockTime * 1000).toISOString(),
        slot: sig.slot,
        confirmationStatus: sig.confirmationStatus
      }));

    res.json({
      success: true,
      data: {
        withdrawals: withdrawalHistory,
        totalWithdrawals: withdrawalHistory.length
      }
    });

  } catch (error: any) {
    console.error('Error fetching withdrawal history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch withdrawal history'
    });
  }
});

export default router;