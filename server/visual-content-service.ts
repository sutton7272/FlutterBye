import { openaiService } from "./openai-service";
import fs from 'fs';
import path from 'path';

interface VisualAsset {
  id: string;
  name: string;
  path: string;
  type: 'logo' | 'banner' | 'illustration' | 'icon' | 'background';
  category: string;
  dimensions: { width: number; height: number };
  optimizedForPlatforms: string[];
}

interface GeneratedVisual {
  imageUrl: string;
  prompt: string;
  style: string;
  platform: string;
  hashtags: string[];
  effectiveness: number;
}

class VisualContentService {
  private flutterbyeAssets: VisualAsset[] = [
    {
      id: 'cosmic-butterfly-main',
      name: 'Cosmic Butterfly Logo',
      path: '/images/cosmic-butterfly.png',
      type: 'logo',
      category: 'branding',
      dimensions: { width: 1200, height: 800 },
      optimizedForPlatforms: ['twitter', 'instagram', 'linkedin']
    },
    {
      id: 'flutterbye-banner',
      name: 'FlutterBye Banner',
      path: '/images/flutterbye-banner.png',
      type: 'banner',
      category: 'branding',
      dimensions: { width: 1500, height: 500 },
      optimizedForPlatforms: ['twitter', 'linkedin']
    },
    {
      id: 'web3-integration',
      name: 'Web3 Integration Visual',
      path: '/images/web3-integration.svg',
      type: 'illustration',
      category: 'technology',
      dimensions: { width: 800, height: 600 },
      optimizedForPlatforms: ['twitter', 'instagram']
    },
    {
      id: 'token-creation',
      name: 'Token Creation Flow',
      path: '/images/token-creation-flow.png',
      type: 'illustration',
      category: 'features',
      dimensions: { width: 1000, height: 750 },
      optimizedForPlatforms: ['twitter', 'linkedin']
    },
    {
      id: 'ai-intelligence',
      name: 'AI Intelligence Dashboard',
      path: '/images/ai-dashboard-preview.png',
      type: 'illustration',
      category: 'features',
      dimensions: { width: 1200, height: 900 },
      optimizedForPlatforms: ['twitter', 'linkedin']
    }
  ];

  // Get FlutterBye assets based on content relevance
  getRelevantFlutterbyeAssets(
    content: string, 
    platform: string = 'twitter',
    contentType: string = 'general'
  ): VisualAsset[] {
    const relevantAssets = this.flutterbyeAssets.filter(asset => {
      // Platform compatibility
      if (!asset.optimizedForPlatforms.includes(platform)) return false;
      
      // Content relevance matching
      const contentLower = content.toLowerCase();
      
      if (contentLower.includes('ai') && asset.category === 'features' && asset.id.includes('ai')) return true;
      if (contentLower.includes('token') && asset.id.includes('token')) return true;
      if (contentLower.includes('web3') && asset.id.includes('web3')) return true;
      if (contentLower.includes('flutterbye') && asset.type === 'logo') return true;
      
      // Default branding assets for general content
      if (contentType === 'general' && asset.type === 'logo') return true;
      
      return false;
    });

    // If no specific matches, return main branding assets
    if (relevantAssets.length === 0) {
      return this.flutterbyeAssets.filter(asset => 
        asset.type === 'logo' && asset.optimizedForPlatforms.includes(platform)
      );
    }

    return relevantAssets.slice(0, 3); // Limit to top 3 matches
  }

  // Generate AI visuals using DALL-E
  async generateAIVisual(
    content: string,
    platform: string = 'twitter',
    style: string = 'professional'
  ): Promise<GeneratedVisual> {
    try {
      const visualPrompt = await this.createVisualPrompt(content, platform, style);
      
      // Generate image using OpenAI DALL-E
      const imageResult = await openaiService.generateImage(visualPrompt);
      
      return {
        imageUrl: imageResult.url,
        prompt: visualPrompt,
        style,
        platform,
        hashtags: await this.generateVisualHashtags(content, style),
        effectiveness: this.calculateVisualEffectiveness(style, platform)
      };
    } catch (error) {
      console.error('Error generating AI visual:', error);
      throw new Error('Failed to generate AI visual content');
    }
  }

  // Create optimized visual prompts
  private async createVisualPrompt(
    content: string, 
    platform: string, 
    style: string
  ): Promise<string> {
    const platformSpecs = this.getPlatformVisualSpecs(platform);
    const styleGuide = this.getStyleGuide(style);
    
    const prompt = `Create a ${style} social media visual for ${platform} with ${platformSpecs.aspectRatio} aspect ratio.
    
Content theme: ${content}

Visual requirements:
- ${styleGuide.description}
- Colors: Electric blue, neon green, dark navy (FlutterBye brand colors)
- Include subtle circuit/tech aesthetic elements
- High-energy, modern design
- Professional yet innovative feel
- Optimized for ${platform} feed display
- No text overlay (text will be added separately)
- Clean, engaging composition

Style: ${styleGuide.elements.join(', ')}`;

    return prompt;
  }

  // Platform-specific visual specifications
  private getPlatformVisualSpecs(platform: string): any {
    const specs = {
      twitter: {
        aspectRatio: '16:9',
        optimalSize: '1200x675',
        characteristics: 'Clean, high-contrast, attention-grabbing'
      },
      instagram: {
        aspectRatio: '1:1',
        optimalSize: '1080x1080',
        characteristics: 'Vibrant, aesthetic, story-friendly'
      },
      linkedin: {
        aspectRatio: '1.91:1',
        optimalSize: '1200x627',
        characteristics: 'Professional, informative, business-focused'
      },
      tiktok: {
        aspectRatio: '9:16',
        optimalSize: '1080x1920',
        characteristics: 'Vertical, dynamic, eye-catching'
      }
    };

    return specs[platform] || specs.twitter;
  }

  // Visual style guidelines
  private getStyleGuide(style: string): any {
    const styles = {
      professional: {
        description: 'Clean, modern, business-appropriate design',
        elements: ['minimal layout', 'subtle gradients', 'corporate aesthetics']
      },
      creative: {
        description: 'Artistic, innovative, visually striking design',
        elements: ['dynamic compositions', 'bold colors', 'creative typography']
      },
      technical: {
        description: 'Tech-focused, data-driven, informative design',
        elements: ['circuit patterns', 'data visualizations', 'tech iconography']
      },
      community: {
        description: 'Friendly, inclusive, community-focused design',
        elements: ['warm colors', 'collaborative imagery', 'social elements']
      },
      futuristic: {
        description: 'Cutting-edge, sci-fi inspired, next-gen design',
        elements: ['neon accents', 'holographic effects', 'space-age aesthetics']
      }
    };

    return styles[style] || styles.professional;
  }

  // Generate hashtags specific to visual content
  private async generateVisualHashtags(content: string, style: string): Promise<string[]> {
    const baseHashtags = ['#FlutterBye', '#Web3Visual'];
    
    const styleHashtags = {
      professional: ['#TechProfessional', '#BusinessInnovation'],
      creative: ['#CreativeDesign', '#DigitalArt'],
      technical: ['#TechVisual', '#DataVisualization'],
      community: ['#CommunityBuilding', '#Web3Community'],
      futuristic: ['#FutureTech', '#NextGenDesign']
    };

    const contentHashtags = [];
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('ai')) contentHashtags.push('#AIVisualization');
    if (contentLower.includes('blockchain')) contentHashtags.push('#BlockchainArt');
    if (contentLower.includes('token')) contentHashtags.push('#TokenDesign');
    if (contentLower.includes('defi')) contentHashtags.push('#DeFiVisual');

    return [
      ...baseHashtags,
      ...(styleHashtags[style] || []),
      ...contentHashtags
    ].slice(0, 5); // Optimal hashtag count
  }

  // Calculate visual effectiveness score
  private calculateVisualEffectiveness(style: string, platform: string): number {
    const styleScores = {
      professional: 85,
      creative: 92,
      technical: 78,
      community: 88,
      futuristic: 94
    };

    const platformMultipliers = {
      twitter: 1.0,
      instagram: 1.15, // Visuals perform better on Instagram
      linkedin: 0.9,
      tiktok: 1.2
    };

    const baseScore = styleScores[style] || 80;
    const multiplier = platformMultipliers[platform] || 1.0;
    
    return Math.round(baseScore * multiplier);
  }

  // Comprehensive visual strategy for posts
  async createVisualStrategy(
    content: string,
    platform: string = 'twitter',
    preferences: any = {}
  ): Promise<any> {
    try {
      // Get relevant FlutterBye assets
      const flutterbyeAssets = this.getRelevantFlutterbyeAssets(content, platform);
      
      // Determine if AI generation is needed
      const useAIGeneration = preferences.generateAI !== false && 
        (flutterbyeAssets.length === 0 || Math.random() > 0.3); // 70% chance to use AI
      
      let aiVisual = null;
      if (useAIGeneration) {
        const style = this.determineOptimalStyle(content, platform);
        aiVisual = await this.generateAIVisual(content, platform, style);
      }

      return {
        strategy: 'hybrid', // Using both FlutterBye assets and AI generation
        flutterbyeAssets: flutterbyeAssets.map(asset => ({
          ...asset,
          fullUrl: `${process.env.BASE_URL || 'http://localhost:5000'}${asset.path}`,
          effectiveness: this.calculateAssetEffectiveness(asset, content, platform)
        })),
        aiGenerated: aiVisual,
        recommendation: this.getVisualRecommendation(flutterbyeAssets, aiVisual, platform),
        platformOptimization: this.getPlatformVisualSpecs(platform)
      };
    } catch (error) {
      console.error('Error creating visual strategy:', error);
      return this.getFallbackVisualStrategy(platform);
    }
  }

  // Determine optimal visual style based on content
  private determineOptimalStyle(content: string, platform: string): string {
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('ai') || contentLower.includes('future')) return 'futuristic';
    if (contentLower.includes('community') || contentLower.includes('social')) return 'community';
    if (contentLower.includes('technical') || contentLower.includes('development')) return 'technical';
    if (contentLower.includes('creative') || contentLower.includes('design')) return 'creative';
    
    return platform === 'linkedin' ? 'professional' : 'creative';
  }

  // Calculate effectiveness of FlutterBye assets for specific content
  private calculateAssetEffectiveness(
    asset: VisualAsset, 
    content: string, 
    platform: string
  ): number {
    let score = 70; // Base score
    
    // Platform optimization bonus
    if (asset.optimizedForPlatforms.includes(platform)) score += 15;
    
    // Content relevance bonus
    const contentLower = content.toLowerCase();
    if (asset.category === 'branding') score += 10;
    if (contentLower.includes(asset.category)) score += 20;
    if (asset.type === 'logo' && contentLower.includes('flutterbye')) score += 25;
    
    // Type effectiveness
    const typeScores = { logo: 15, banner: 12, illustration: 18, icon: 8, background: 10 };
    score += typeScores[asset.type] || 10;
    
    return Math.min(100, score);
  }

  // Get visual recommendation
  private getVisualRecommendation(
    flutterbyeAssets: VisualAsset[], 
    aiVisual: GeneratedVisual | null, 
    platform: string
  ): any {
    if (aiVisual && flutterbyeAssets.length > 0) {
      return {
        primary: aiVisual.effectiveness > 85 ? 'ai-generated' : 'flutterbye-asset',
        secondary: aiVisual.effectiveness > 85 ? 'flutterbye-asset' : 'ai-generated',
        reasoning: `AI visual effectiveness: ${aiVisual?.effectiveness || 0}%, FlutterBye assets available: ${flutterbyeAssets.length}`,
        strategy: 'Use AI visual for main post, FlutterBye assets for follow-up content'
      };
    } else if (aiVisual) {
      return {
        primary: 'ai-generated',
        reasoning: 'No relevant FlutterBye assets found, using AI-generated content',
        strategy: 'Focus on AI-generated visuals with brand hashtags'
      };
    } else {
      return {
        primary: 'flutterbye-asset',
        reasoning: 'Using existing FlutterBye brand assets for consistency',
        strategy: 'Leverage brand recognition with existing visual assets'
      };
    }
  }

  // Fallback visual strategy
  private getFallbackVisualStrategy(platform: string): any {
    return {
      strategy: 'text-only',
      flutterbyeAssets: [this.flutterbyeAssets[0]], // Default to main logo
      aiGenerated: null,
      recommendation: {
        primary: 'flutterbye-asset',
        reasoning: 'Fallback to brand assets due to generation error',
        strategy: 'Use simple brand visual with strong text content'
      },
      platformOptimization: this.getPlatformVisualSpecs(platform)
    };
  }

  // Get visual performance analytics
  getVisualAnalytics(): any {
    return {
      availableAssets: this.flutterbyeAssets.length,
      assetCategories: [...new Set(this.flutterbyeAssets.map(a => a.category))],
      platformCoverage: {
        twitter: this.flutterbyeAssets.filter(a => a.optimizedForPlatforms.includes('twitter')).length,
        instagram: this.flutterbyeAssets.filter(a => a.optimizedForPlatforms.includes('instagram')).length,
        linkedin: this.flutterbyeAssets.filter(a => a.optimizedForPlatforms.includes('linkedin')).length
      },
      aiGenerationCapability: true,
      recommendedStrategy: 'hybrid'
    };
  }
}

export const visualContentService = new VisualContentService();