import type { Express } from "express";
import { aiContentGenerator } from './ai-content-generator';

export function registerVisualTestEndpoint(app: Express) {
  // Simple endpoint to test visual attachment system
  app.post('/api/test-visual', async (req, res) => {
    try {
      console.log('🧪 Testing Enhanced Visual Attachment System...');
      
      // Test content generation with mandatory visual
      const testContent = await aiContentGenerator.generateContent({
        category: 'promotional',
        customPrompt: 'FlutterBye revolutionary Web3 platform test',
        includeHashtags: true,
        timeSlot: 'afternoon',
        forceUnique: true
      });
      
      // Verify visual attachment exists
      if (!testContent.imageUrl) {
        return res.status(500).json({
          success: false,
          error: 'Visual attachment system failed - no image URL generated'
        });
      }
      
      // Test image selection system
      const imageData = await aiContentGenerator.selectOptimalImage(
        'FlutterBye blockchain technology',
        'technology',
        'morning'
      );
      
      if (!imageData.imageUrl) {
        return res.status(500).json({
          success: false,
          error: 'Image selection system failed - no image URL selected'
        });
      }
      
      console.log('✅ Enhanced Visual Attachment System: ALL TESTS PASSED!');
      
      res.json({
        success: true,
        message: 'Enhanced Visual Attachment System fully operational',
        testResults: {
          contentGeneration: {
            hasImage: !!testContent.imageUrl,
            imageUrl: testContent.imageUrl,
            imageSource: testContent.imageSource,
            imageDescription: testContent.imageDescription,
            contentLength: testContent.content.length,
            hashtagCount: testContent.hashtags.length
          },
          imageSelection: {
            hasImage: !!imageData.imageUrl,
            imageUrl: imageData.imageUrl,
            source: imageData.source,
            description: imageData.description
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Visual System Test Failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}