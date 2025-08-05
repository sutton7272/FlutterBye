import express from 'express';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import OpenAI from 'openai';

const router = express.Router();

// Initialize Solana connection
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Analyze wallet with enhanced AI insights
router.post('/analyze', async (req, res) => {
  try {
    const { address, deepAnalysis = false } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Validate Solana address format
    let publicKey: PublicKey;
    try {
      publicKey = new PublicKey(address);
    } catch {
      return res.status(400).json({ error: 'Invalid Solana wallet address format' });
    }

    // Get real blockchain data
    try {
      const [accountInfo, balance, signatures] = await Promise.all([
        connection.getAccountInfo(publicKey),
        connection.getBalance(publicKey),
        connection.getSignaturesForAddress(publicKey, { limit: 20 })
      ]);

      // Analyze transaction patterns
      const now = Date.now();
      const recentTransactions = signatures.filter(sig => 
        sig.blockTime && (now - sig.blockTime * 1000) < 30 * 24 * 60 * 60 * 1000 // 30 days
      );

      // Calculate risk factors
      const riskFactors = {
        hasBalance: balance > 0,
        isActive: signatures.length > 0,
        recentActivity: recentTransactions.length > 0,
        transactionCount: signatures.length,
        balanceSOL: balance / LAMPORTS_PER_SOL,
        avgDailyTransactions: recentTransactions.length / 30
      };

      // Calculate risk score (0-100, lower is better)
      let riskScore = 50; // Baseline
      
      if (riskFactors.hasBalance) riskScore -= 10;
      if (riskFactors.isActive) riskScore -= 15;
      if (riskFactors.recentActivity) riskScore -= 10;
      if (riskFactors.transactionCount > 10) riskScore -= 10;
      if (riskFactors.balanceSOL > 1) riskScore -= 15;
      if (riskFactors.avgDailyTransactions > 1) riskScore += 20; // High frequency can be risky

      riskScore = Math.max(0, Math.min(100, riskScore));

      // Determine activity level
      const activityLevel = riskFactors.transactionCount > 50 ? 'High' : 
                           riskFactors.transactionCount > 10 ? 'Medium' : 
                           riskFactors.transactionCount > 0 ? 'Low' : 'Inactive';

      // Get last activity
      const lastActivity = signatures.length > 0 ? 
        new Date(signatures[0].blockTime! * 1000).toLocaleDateString() : 'No activity';

      // Enhanced AI analysis if enabled and API key available
      let aiInsights = null;
      if (deepAnalysis && process.env.OPENAI_API_KEY) {
        try {
          const analysisPrompt = `
            Analyze this Solana wallet data and provide behavioral insights:
            
            Wallet Data:
            - Balance: ${riskFactors.balanceSOL.toFixed(4)} SOL
            - Total Transactions: ${riskFactors.transactionCount}
            - Recent Activity (30 days): ${recentTransactions.length} transactions
            - Account Exists: ${accountInfo !== null}
            - Risk Score: ${riskScore}/100
            
            Provide analysis in JSON format with:
            1. behaviorPattern (string describing the wallet's usage pattern)
            2. riskFactors (array of specific risk concerns)
            3. trustScore (0-100, higher is more trustworthy)
            4. recommendations (array of actionable recommendations)
          `;

          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are a blockchain security analyst. Provide professional wallet analysis in valid JSON format."
              },
              {
                role: "user",
                content: analysisPrompt
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
          });

          aiInsights = JSON.parse(response.choices[0].message.content || '{}');
        } catch (aiError) {
          console.error('AI analysis error:', aiError);
          // Continue without AI insights
        }
      }

      const analysis = {
        success: true,
        address,
        riskScore,
        activityLevel,
        balanceSOL: riskFactors.balanceSOL.toFixed(4),
        tokenCount: 'Analyzing...', // Would need additional API calls
        lastActivity,
        transactionCount: riskFactors.transactionCount,
        accountExists: accountInfo !== null,
        analysisTimestamp: new Date().toISOString(),
        network: 'solana-mainnet',
        insights: aiInsights || {
          behaviorPattern: activityLevel === 'High' ? 'Active trader/user' : 
                          activityLevel === 'Medium' ? 'Occasional user' : 
                          activityLevel === 'Low' ? 'Infrequent user' : 'Dormant account',
          riskFactors: riskScore > 70 ? ['High transaction frequency', 'Unusual patterns'] : 
                      riskScore > 30 ? ['Moderate activity'] : ['Low risk profile'],
          trustScore: Math.max(0, 100 - riskScore)
        }
      };

      console.log('Wallet analysis completed:', {
        address: address.slice(0, 8) + '...',
        riskScore,
        activityLevel,
        balance: riskFactors.balanceSOL.toFixed(4)
      });

      res.json(analysis);

    } catch (networkError) {
      console.error('Blockchain network error:', networkError);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch blockchain data',
        details: networkError instanceof Error ? networkError.message : 'Network error',
        note: 'Unable to connect to Solana network'
      });
    }

  } catch (error) {
    console.error('Wallet analysis error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Wallet analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get popular wallet addresses for testing
router.get('/popular', async (req, res) => {
  try {
    // Some well-known Solana addresses for testing
    const popularWallets = [
      {
        address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        description: 'Popular DEX wallet'
      },
      {
        address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
        description: 'NFT marketplace wallet'
      },
      {
        address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        description: 'USDC token account'
      }
    ];

    res.json(popularWallets);
  } catch (error) {
    console.error('Error fetching popular wallets:', error);
    res.status(500).json({ 
      error: 'Failed to fetch popular wallets',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get wallet transaction history
router.get('/:address/transactions', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 10 } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    let publicKey: PublicKey;
    try {
      publicKey = new PublicKey(address);
    } catch {
      return res.status(400).json({ error: 'Invalid Solana wallet address format' });
    }

    const signatures = await connection.getSignaturesForAddress(
      publicKey, 
      { limit: parseInt(limit as string) }
    );

    const transactions = signatures.map(sig => ({
      signature: sig.signature,
      slot: sig.slot,
      blockTime: sig.blockTime,
      confirmationStatus: sig.confirmationStatus,
      err: sig.err,
      memo: sig.memo,
      timestamp: sig.blockTime ? new Date(sig.blockTime * 1000).toISOString() : null
    }));

    res.json({
      success: true,
      address,
      transactions,
      count: transactions.length
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch transactions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;