import { aiContentGenerator } from './ai-content-generator';

// Test script to verify enhanced visual attachment system
async function testVisualAttachmentSystem() {
  console.log('🧪 Testing Enhanced Visual Attachment System...');
  
  try {
    // Test 1: Generate content with mandatory visual
    console.log('\n📋 Test 1: Content Generation with Mandatory Visual');
    const testContent = await aiContentGenerator.generateContent({
      category: 'promotional',
      customPrompt: 'FlutterBye revolutionary Web3 platform test',
      includeHashtags: true,
      timeSlot: 'afternoon',
      forceUnique: true
    });
    
    console.log('✅ Generated Content:');
    console.log(`   Content: ${testContent.content.substring(0, 100)}...`);
    console.log(`   Hashtags: ${testContent.hashtags.slice(0, 5).join(', ')}`);
    console.log(`   Image URL: ${testContent.imageUrl}`);
    console.log(`   Image Source: ${testContent.imageSource}`);
    console.log(`   Image Description: ${testContent.imageDescription}`);
    
    // Verify visual attachment exists
    if (!testContent.imageUrl) {
      throw new Error('❌ FAILED: No image URL in generated content!');
    }
    
    console.log('✅ Test 1 PASSED: Content includes mandatory visual attachment');
    
    // Test 2: Image selection system
    console.log('\n📋 Test 2: Optimal Image Selection');
    const imageData = await aiContentGenerator.selectOptimalImage(
      'FlutterBye blockchain technology',
      'technology',
      'morning'
    );
    
    console.log('✅ Image Selection Results:');
    console.log(`   Image URL: ${imageData.imageUrl}`);
    console.log(`   Source: ${imageData.source}`);
    console.log(`   Description: ${imageData.description}`);
    
    if (!imageData.imageUrl) {
      throw new Error('❌ FAILED: Image selection returned no URL!');
    }
    
    console.log('✅ Test 2 PASSED: Image selection system working');
    
    // Test 3: Multiple content generation (verify uniqueness and visuals)
    console.log('\n📋 Test 3: Multiple Content Generation with Visuals');
    const multipleContent = await Promise.all([
      aiContentGenerator.generateContent({ category: 'product', timeSlot: 'morning' }),
      aiContentGenerator.generateContent({ category: 'community', timeSlot: 'afternoon' }),
      aiContentGenerator.generateContent({ category: 'educational', timeSlot: 'evening' })
    ]);
    
    multipleContent.forEach((content, index) => {
      console.log(`✅ Content ${index + 1}:`);
      console.log(`   Has Image: ${!!content.imageUrl}`);
      console.log(`   Image Source: ${content.imageSource}`);
      console.log(`   Content Length: ${content.content.length} chars`);
    });
    
    // Verify all have images
    const allHaveImages = multipleContent.every(content => !!content.imageUrl);
    if (!allHaveImages) {
      throw new Error('❌ FAILED: Not all generated content has visual attachments!');
    }
    
    console.log('✅ Test 3 PASSED: All generated content includes visuals');
    
    console.log('\n🎉 ENHANCED VISUAL ATTACHMENT SYSTEM: ALL TESTS PASSED!');
    console.log('✅ Mandatory visual attachment working correctly');
    console.log('✅ Image selection system operational');
    console.log('✅ Multiple content generation with guaranteed visuals');
    
    return {
      success: true,
      testsRun: 3,
      testsPassed: 3,
      message: 'Enhanced Visual Attachment System fully operational'
    };
    
  } catch (error) {
    console.error('❌ VISUAL SYSTEM TEST FAILED:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export for use in API endpoints
export { testVisualAttachmentSystem };

// Run test if called directly (ES module version)
if (import.meta.url === `file://${process.argv[1]}`) {
  testVisualAttachmentSystem().then(result => {
    console.log('\n📊 Final Test Result:', result);
    process.exit(result.success ? 0 : 1);
  });
}