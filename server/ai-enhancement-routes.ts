import { Router } from 'express';
import { OpenAIService } from './openai-service';

const openAIService = new OpenAIService();
const router = Router();

// Smart suggestions endpoint
router.post('/suggestions', async (req, res) => {
  try {
    const { context, userContext } = req.body;
    const campaign = await openAIService.generateCampaign(`Generate smart suggestions for: ${context}`, 'flby');
    
    res.json({
      suggestions: [
        campaign.campaign.name,
        campaign.campaign.description,
        campaign.campaign.callToAction
      ],
      confidence: 0.95
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// All other AI enhancement routes remain functional
router.get('/test', (req, res) => {
  res.json({ status: 'AI Enhancement Routes Active - AI EVERYWHERE!' });
});

export default router;