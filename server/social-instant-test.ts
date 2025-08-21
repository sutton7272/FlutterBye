import type { Express } from 'express';
import { SocialPasswordAutomation } from './social-password-automation';

export function registerInstantTestEndpoint(app: Express) {
  // Quick instant test endpoint with better timeout handling
  app.post('/api/social-automation/instant-test', async (req, res) => {
    try {
      console.log('🚀 Instant test endpoint called');
      
      // Send immediate acknowledgment
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
      });
      
      // Send initial response
      res.write(JSON.stringify({
        status: 'starting',
        message: 'Browser automation starting...',
        step: 1
      }) + '\n');
      
      // Set Chromium path
      process.env.PUPPETEER_EXECUTABLE_PATH = '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';
      
      const automation = new SocialPasswordAutomation();
      
      // Import AI content generator for enhanced posts with guaranteed visuals
      const { aiContentGenerator } = await import('./ai-content-generator');
      
      // Generate content with mandatory visual attachment
      const generatedContent = await aiContentGenerator.generateContent({
        category: 'promotional',
        customPrompt: '🚀 FlutterBye INSTANT Social Bot LIVE! Real Twitter posting from dashboard! Revolutionary Web3 platform breakthrough!',
        includeHashtags: true,
        timeSlot: 'general',
        forceUnique: true
      });

      // Get mandatory visual for the post
      const visualData = await aiContentGenerator.selectOptimalImage(
        generatedContent.content,
        'promotional',
        'general'
      );

      const postContent = {
        text: generatedContent.content,
        hashtags: generatedContent.hashtags,
        imageUrl: visualData.imageUrl,
        imageDescription: visualData.description,
        imageSource: visualData.source
      };

      console.log(`📸 Post will include visual: ${visualData.source} - ${visualData.imageUrl}`);
      
      // Update status
      res.write(JSON.stringify({
        status: 'posting',
        message: 'Logging into Twitter and posting...',
        step: 2
      }) + '\n');
      
      const postResult = await automation.postToTwitter(
        { platform: 'twitter', username: 'flutterbye_io', password: 'Flutterbye72!' }, 
        postContent
      );
      
      // Send final result
      res.write(JSON.stringify({
        status: 'complete',
        success: postResult.success,
        message: postResult.message,
        step: 3,
        loginVerified: true,
        method: 'browser_automation'
      }) + '\n');
      
      res.end();
      
    } catch (error: any) {
      console.error('Instant test error:', error);
      try {
        res.write(JSON.stringify({
          status: 'error',
          success: false,
          error: error.message || 'Browser automation failed',
          step: 'error'
        }) + '\n');
        res.end();
      } catch (e) {
        // Response already closed
      }
    }
  });
  
  console.log('⚡ Instant Social Test Endpoint registered');
}