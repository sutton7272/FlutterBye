import { TwitterAPIService } from './twitter-api-service';
import { aiContentGenerator } from './ai-content-generator';
import { openaiService } from './openai-service';

export class SocialMediaTester {
  private twitterService: TwitterAPIService;

  constructor() {
    this.twitterService = new TwitterAPIService();
  }

  async testImageSupportedPost(): Promise<any> {
    console.log('🧪 Testing image-supported social media post...');
    
    try {
      // Generate content with image support
      const content = await aiContentGenerator.generateContent({
        category: 'product',
        includeHashtags: true,
        customPrompt: 'FlutterBye blockchain innovation showcase with visual appeal',
        timeSlot: 'evening'
      });

      console.log('📝 Generated content:', content);
      
      // Test image selection
      const imageData = await aiContentGenerator.selectOptimalImage(
        content.content || 'FlutterBye innovation',
        'product',
        'evening'
      );

      console.log('📷 Selected image:', imageData);

      // Test hashtag optimization
      const optimizedHashtags = await this.testHashtagOptimization(content.content || 'test');

      // Post to Twitter with image if available
      let postResult;
      if (imageData?.imageUrl) {
        console.log('📱 Posting with image to Twitter...');
        postResult = await this.twitterService.postTweetWithImage(
          content.content || 'Default content',
          imageData.imageUrl
        );
      } else {
        console.log('📱 Posting text-only to Twitter...');
        postResult = await this.twitterService.postTweet(content.content || 'Default content');
      }

      return {
        success: true,
        test: 'image-supported-post',
        generatedContent: content,
        imageData,
        optimizedHashtags,
        postResult,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Image-supported post test failed:', error);
      return {
        success: false,
        test: 'image-supported-post',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async testHashtagOptimization(text: string): Promise<any> {
    console.log('🏷️ Testing advanced hashtag optimization...');
    
    try {
      // Test AI-powered hashtag generation
      const aiHashtags = await openaiService.generateOptimizedHashtags(text, 'technology');
      
      // Test analytics-optimized hashtags
      const analyticsHashtags = this.getAnalyticsOptimizedHashtags(text, 'evening', 'technology');
      
      // Test trend-based optimization
      const trendHashtags = this.getTrendingHashtags();
      
      // Test performance-based selection
      const performanceHashtags = this.getPerformanceOptimizedHashtags();

      const results = {
        aiGenerated: aiHashtags,
        analyticsOptimized: analyticsHashtags,
        trendBased: trendHashtags,
        performanceBased: performanceHashtags,
        totalOptimized: [...new Set([...aiHashtags, ...analyticsHashtags, ...trendHashtags])].slice(0, 12)
      };

      console.log('📊 Hashtag optimization results:', results);
      return results;

    } catch (error) {
      console.error('❌ Hashtag optimization test failed:', error);
      return {
        error: error.message,
        fallback: ['#FlutterBye', '#Web3', '#Blockchain', '#AI', '#Innovation']
      };
    }
  }

  private getAnalyticsOptimizedHashtags(text: string, timeSlot: string, category: string): string[] {
    const hashtags = ['#FlutterBye'];
    
    // Add trending hashtags
    hashtags.push('#Web3Innovation', '#BlockchainTech');
    
    // Add high engagement hashtags
    hashtags.push('#CryptoFuture', '#AIRevolution');
    
    // Add platform specific
    hashtags.push('#SocialWeb3', '#DecentralizedSocial');
    
    // Add time-optimized hashtags
    const timeOfDay = this.getTimeOfDay(timeSlot);
    const timeHashtags = {
      morning: ['#MorningInnovation', '#StartStrong'],
      afternoon: ['#AfternoonInsights', '#TechProgress'],
      evening: ['#TrendingTech', '#PrimeTech'],
      night: ['#NightOwls', '#TechThoughts']
    };
    
    hashtags.push(...(timeHashtags[timeOfDay as keyof typeof timeHashtags] || []));
    
    // Add category-specific hashtags
    const categoryHashtags = {
      technology: ['#TechInnovation', '#FutureTech'],
      product: ['#ProductInnovation', '#NextGenTech'],
      community: ['#Web3Community', '#BuildTogether'],
      educational: ['#LearnWeb3', '#BlockchainEducation']
    };
    
    hashtags.push(...(categoryHashtags[category as keyof typeof categoryHashtags] || []));
    
    return [...new Set(hashtags)];
  }

  private getTimeOfDay(timeSlot: string): string {
    const timeMapping = {
      earlyMorning: 'morning',
      breakfast: 'morning', 
      lateMorning: 'morning',
      lunch: 'afternoon',
      earlyAfternoon: 'afternoon',
      lateAfternoon: 'afternoon',
      dinner: 'evening',
      earlyEvening: 'evening',
      evening: 'evening',
      lateNight: 'night'
    };
    
    return timeMapping[timeSlot as keyof typeof timeMapping] || 'afternoon';
  }

  private getTrendingHashtags(): string[] {
    // Simulated trending hashtags - in production, this would fetch real trending data
    return [
      '#Web3Trends',
      '#BlockchainNews',
      '#CryptoInnovation',
      '#DeFiRevolution',
      '#NFTCommunity',
      '#SolanaEcosystem',
      '#AIIntegration',
      '#FutureOfSocial'
    ];
  }

  private getPerformanceOptimizedHashtags(): string[] {
    // Based on historical performance data - in production, this would use real analytics
    return [
      '#FlutterBye',
      '#Web3',
      '#Blockchain',
      '#Innovation',
      '#SocialAutomation',
      '#CryptoTech',
      '#AIpowered',
      '#DecentralizedFuture'
    ];
  }

  async testComprehensiveSocialStrategy(): Promise<any> {
    console.log('🎯 Testing comprehensive social media strategy...');
    
    try {
      const results = {
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // Test 1: Image-supported post
      results.tests['image-support'] = await this.testImageSupportedPost();
      
      // Test 2: Multiple content categories
      const categories = ['product', 'community', 'educational', 'promotional'];
      results.tests['multi-category'] = {};
      
      for (const category of categories) {
        console.log(`📝 Testing ${category} content generation...`);
        const content = await aiContentGenerator.generateContent({
          category,
          includeHashtags: true,
          customPrompt: `FlutterBye ${category} content with optimal engagement`
        });
        
        results.tests['multi-category'][category] = {
          content: content,
          wordCount: content.content?.length || 0,
          hashtagCount: content.hashtags?.length || 0
        };
      }
      
      // Test 3: Time-slot optimization
      const timeSlots = ['morning', 'afternoon', 'evening', 'night'];
      results.tests['time-optimization'] = {};
      
      for (const timeSlot of timeSlots) {
        console.log(`⏰ Testing ${timeSlot} optimization...`);
        const hashtags = this.getAnalyticsOptimizedHashtags('test content', timeSlot, 'technology');
        results.tests['time-optimization'][timeSlot] = {
          optimizedHashtags: hashtags,
          hashtagCount: hashtags.length
        };
      }
      
      // Test 4: AI image generation capability
      if (process.env.OPENAI_API_KEY) {
        console.log('🎨 Testing AI image generation...');
        try {
          const imageResult = await openaiService.generateImage(
            "Professional tech product showcase, Web3 themes, butterfly motifs, electric blue and green colors"
          );
          results.tests['ai-image-generation'] = {
            success: true,
            imageUrl: imageResult.url
          };
        } catch (error) {
          results.tests['ai-image-generation'] = {
            success: false,
            error: error.message
          };
        }
      }

      console.log('✅ Comprehensive social strategy test completed');
      return {
        success: true,
        summary: {
          totalTests: Object.keys(results.tests).length,
          timestamp: results.timestamp
        },
        results
      };

    } catch (error) {
      console.error('❌ Comprehensive social strategy test failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async testImageLibrarySelection(): Promise<any> {
    console.log('📚 Testing site image library selection...');
    
    try {
      const testCases = [
        { text: 'FlutterBye product launch', category: 'product', expected: 'logo-related' },
        { text: 'Community building Web3', category: 'community', expected: 'community-image' },
        { text: 'Blockchain technology education', category: 'educational', expected: 'tech-image' },
        { text: 'Innovation announcement', category: 'promotional', expected: 'random-selection' }
      ];

      const results = [];
      
      for (const testCase of testCases) {
        console.log(`🧪 Testing: ${testCase.text} (${testCase.category})`);
        
        const imageData = await aiContentGenerator.selectOptimalImage(
          testCase.text,
          testCase.category,
          'evening'
        );
        
        results.push({
          input: testCase,
          output: imageData,
          success: !!imageData?.imageUrl
        });
      }

      return {
        success: true,
        test: 'image-library-selection',
        results,
        summary: {
          totalTests: results.length,
          successfulSelections: results.filter(r => r.success).length
        }
      };

    } catch (error) {
      console.error('❌ Image library selection test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const socialMediaTester = new SocialMediaTester();