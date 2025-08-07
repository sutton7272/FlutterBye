import { Router } from "express";
import { ApiKeyService, DEMO_API_KEYS } from "./api-key-service";
import { validateRequest } from "./validation";
import { z } from "zod";

const router = Router();

// Schema for API key creation
const CreateApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(z.string()).optional()
});

// Get demo/sample API keys (for development and testing)
router.get('/api/keys/demo', async (req, res) => {
  try {
    // Return demo keys for testing
    res.json({
      success: true,
      message: "Demo API keys for Flutterbye platform testing",
      keys: {
        walletIntelligence: DEMO_API_KEYS.FLUTTERBYE_WALLET_INTELLIGENCE,
        messageTokens: DEMO_API_KEYS.FLUTTERBYE_MESSAGE_TOKENS,
        enterprise: DEMO_API_KEYS.FLUTTERBYE_ENTERPRISE,
        flutterAI: DEMO_API_KEYS.FLUTTERBYE_FLUTTERAI
      },
      endpoints: {
        walletIntelligence: [
          'GET /api/intelligence/wallet/{address}',
          'POST /api/intelligence/batch-analyze',
          'GET /api/intelligence/stats'
        ],
        messageTokens: [
          'POST /api/tokens/create',
          'GET /api/tokens/list',
          'POST /api/tokens/redeem'
        ],
        enterprise: [
          'GET /api/enterprise/analytics',
          'POST /api/enterprise/campaigns',
          'GET /api/enterprise/compliance'
        ],
        flutterAI: [
          'POST /api/flutterai/analyze',
          'GET /api/flutterai/intelligence',
          'POST /api/flutterai/campaign-generate'
        ]
      },
      usage: "Include these keys in your API requests as 'Authorization: Bearer {api_key}'"
    });
  } catch (error) {
    console.error('Error getting demo keys:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve demo API keys'
    });
  }
});

// Create a new API key for authenticated user
router.post('/api/keys/generate', validateRequest(CreateApiKeySchema), async (req, res) => {
  try {
    // This would need wallet authentication in production
    const userId = req.body.userId || 'demo-user'; // Placeholder
    
    const result = await ApiKeyService.generateUserApiKey(
      userId,
      req.body.name
    );
    
    res.json({
      success: true,
      apiKey: result.apiKey, // Only returned once
      keyId: result.keyId,
      name: result.name,
      warning: "Store this API key securely. It won't be shown again.",
      created: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate API key'
    });
  }
});

// Get user's API keys (without revealing actual keys)
router.get('/api/keys', async (req, res) => {
  try {
    const userId = req.query.userId as string || 'demo-user';
    const keys = await ApiKeyService.getUserApiKeys(userId);
    
    res.json({
      success: true,
      keys: keys || [],
      total: keys?.length || 0
    });
    
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch API keys'
    });
  }
});

// Revoke an API key
router.delete('/api/keys/:keyId', async (req, res) => {
  try {
    const { keyId } = req.params;
    const userId = req.body.userId || 'demo-user';
    
    const revoked = await ApiKeyService.revokeApiKey(keyId, userId);
    
    if (revoked) {
      res.json({
        success: true,
        message: 'API key revoked successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'API key not found'
      });
    }
    
  } catch (error) {
    console.error('Error revoking API key:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke API key'
    });
  }
});

export default router;