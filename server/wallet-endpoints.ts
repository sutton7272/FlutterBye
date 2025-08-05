// Wallet integration endpoints for secure burn-to-redeem
import { Express } from 'express';
import { FlutterbyeTokenService } from './core-token-service';

export function addWalletEndpoints(app: Express, tokenService: FlutterbyeTokenService) {
  // Prepare burn transaction for client signing
  app.post('/api/tokens/:id/prepare-burn', async (req, res) => {
    try {
      console.log(`🔥 Preparing burn transaction for token ${req.params.id}`);
      
      const { burnerWallet, recipientWallet } = req.body;
      
      if (!burnerWallet || !recipientWallet) {
        return res.status(400).json({
          success: false,
          error: 'Burner wallet and recipient wallet are required'
        });
      }

      const result = await tokenService.prepareBurnTransaction({
        tokenId: req.params.id,
        burnerWallet,
        recipientWallet
      });

      console.log('✅ Burn transaction prepared for signing');
      res.json({
        success: true,
        transaction: result.transaction.serialize({ requireAllSignatures: false }).toString('base64')
      });
    } catch (error: any) {
      console.error('Prepare burn transaction error:', error);
      res.status(500).json({
        success: false,
        error: `Failed to prepare burn transaction: ${error.message}`
      });
    }
  });

  // Confirm burn transaction after client signing
  app.post('/api/tokens/:id/confirm-burn', async (req, res) => {
    try {
      console.log(`🔥 Confirming burn transaction for token ${req.params.id}`);
      
      const { signature, burnerWallet, recipientWallet } = req.body;
      
      if (!signature || !burnerWallet || !recipientWallet) {
        return res.status(400).json({
          success: false,
          error: 'Signature, burner wallet, and recipient wallet are required'
        });
      }

      const result = await tokenService.confirmBurnRedemption({
        tokenId: req.params.id,
        signature,
        burnerWallet,
        recipientWallet
      });

      console.log('✅ Burn redemption confirmed:', result);
      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      console.error('Confirm burn redemption error:', error);
      res.status(500).json({
        success: false,
        error: `Failed to confirm burn redemption: ${error.message}`
      });
    }
  });
}