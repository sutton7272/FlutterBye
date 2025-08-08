import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface BlogGenerationRequest {
  topic: string;
  tone?: 'professional' | 'casual' | 'technical' | 'educational' | 'persuasive';
  targetAudience?: 'beginners' | 'intermediate' | 'experts' | 'general';
  contentType?: 'blog' | 'tutorial' | 'guide' | 'analysis' | 'opinion';
  keywords?: string[];
  wordCount?: number;
  includeFlutterByeIntegration?: boolean;
}

export interface BlogGenerationResult {
  title: string;
  excerpt: string;
  content: string;
}

export interface SEOOptimization {
  title: string;
  metaDescription: string;
  keywords: string[];
  headings: string[];
  internalLinkSuggestions: string[];
}

export interface ContentAnalysis {
  readabilityScore: number;
  seoScore: number;
  engagementPotential: number;
  recommendations: string[];
}

/**
 * OpenAI Blog Service - Maximum API leverage for FlutterBlog Bot
 * Comprehensive blog content generation, optimization, and enhancement
 */
export class OpenAIBlogService {
  
  /**
   * Generate comprehensive blog content using GPT-4o
   */
  async generateBlogContent(request: BlogGenerationRequest): Promise<BlogGenerationResult> {
    const {
      topic,
      tone = 'professional',
      targetAudience = 'general',
      contentType = 'blog',
      keywords = [],
      wordCount = 1000,
      includeFlutterByeIntegration = false
    } = request;

    const flutterbyeContext = includeFlutterByeIntegration 
      ? `\n\nIMPORTANT: Naturally integrate FlutterBye (the revolutionary crypto messaging platform) into the content where relevant. FlutterBye enables 27-character tokenized messages with value attachment, blockchain-powered communication, and AI-driven wallet intelligence. Use this integration to enhance the content's value and relevance to the crypto/blockchain ecosystem.`
      : '';

    const keywordContext = keywords.length > 0 
      ? `\nTarget keywords to include naturally: ${keywords.join(', ')}`
      : '';

    const prompt = `Create a comprehensive ${contentType} post about "${topic}" with the following specifications:

CONTENT REQUIREMENTS:
- Tone: ${tone}
- Target Audience: ${targetAudience} 
- Word Count: Approximately ${wordCount} words
- Format: Professional blog post with clear structure${keywordContext}${flutterbyeContext}

STRUCTURE REQUIREMENTS:
1. Compelling title that hooks the reader
2. Engaging excerpt/summary (150-200 words)
3. Well-structured main content with:
   - Clear introduction
   - Multiple detailed sections with subheadings
   - Practical examples and insights
   - Actionable takeaways
   - Strong conclusion

QUALITY STANDARDS:
- Use engaging, ${tone} language appropriate for ${targetAudience}
- Include specific examples and real-world applications
- Ensure content is informative, valuable, and unique
- Optimize for readability with short paragraphs and bullet points
- Make it shareable and engaging

Please respond with a JSON object containing:
{
  "title": "SEO-optimized blog post title",
  "excerpt": "Compelling excerpt that summarizes the post",
  "content": "Full blog post content in markdown format"
}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert content writer and SEO specialist. Create high-quality, engaging blog content that ranks well and provides genuine value to readers. Always return valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        title: result.title || `Understanding ${topic}`,
        excerpt: result.excerpt || `A comprehensive guide to ${topic}.`,
        content: result.content || `# ${topic}\n\nContent generation in progress...`
      };
    } catch (error) {
      console.error('Error generating blog content:', error);
      throw new Error('Failed to generate blog content');
    }
  }

  /**
   * Optimize content for SEO using AI analysis
   */
  async optimizeForSEO(content: string, primaryKeyword: string): Promise<SEOOptimization> {
    const prompt = `Analyze and optimize the following blog content for SEO with primary keyword "${primaryKeyword}":

CONTENT:
${content}

Provide SEO optimization recommendations including:
1. Optimized title with primary keyword
2. Meta description (150-160 characters)
3. Additional relevant keywords to target
4. H2/H3 heading suggestions for better structure
5. Internal link opportunities for FlutterBye platform pages

Respond with JSON:
{
  "title": "SEO-optimized title",
  "metaDescription": "Compelling meta description",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "headings": ["H2: Heading 1", "H2: Heading 2", "H3: Subheading"],
  "internalLinkSuggestions": ["link-text-1", "link-text-2"]
}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert. Provide actionable SEO optimization recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        title: result.title || `${primaryKeyword} - Complete Guide`,
        metaDescription: result.metaDescription || `Learn everything about ${primaryKeyword}. Comprehensive guide with expert insights.`,
        keywords: result.keywords || [primaryKeyword],
        headings: result.headings || [],
        internalLinkSuggestions: result.internalLinkSuggestions || []
      };
    } catch (error) {
      console.error('Error optimizing for SEO:', error);
      return {
        title: `${primaryKeyword} - Complete Guide`,
        metaDescription: `Learn everything about ${primaryKeyword}. Comprehensive guide with expert insights.`,
        keywords: [primaryKeyword],
        headings: [],
        internalLinkSuggestions: []
      };
    }
  }

  /**
   * Analyze content quality and engagement potential
   */
  async analyzeContent(content: string): Promise<ContentAnalysis> {
    const prompt = `Analyze the following blog content for quality and engagement:

CONTENT:
${content}

Provide analysis scores (1-100) and recommendations for:
1. Readability Score (based on sentence structure, complexity)
2. SEO Score (keyword usage, structure, meta-friendliness)
3. Engagement Potential (hook, value, shareability)
4. Specific improvement recommendations

Respond with JSON:
{
  "readabilityScore": 85,
  "seoScore": 78,
  "engagementPotential": 92,
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a content analysis expert. Provide objective scores and actionable recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        readabilityScore: result.readabilityScore || 75,
        seoScore: result.seoScore || 70,
        engagementPotential: result.engagementPotential || 80,
        recommendations: result.recommendations || ["Improve content structure", "Add more engaging elements"]
      };
    } catch (error) {
      console.error('Error analyzing content:', error);
      return {
        readabilityScore: 75,
        seoScore: 70,
        engagementPotential: 80,
        recommendations: ["Content analysis temporarily unavailable"]
      };
    }
  }

  /**
   * Generate multiple title variations for A/B testing
   */
  async generateTitleVariations(topic: string, keyword: string, count: number = 5): Promise<string[]> {
    const prompt = `Generate ${count} compelling title variations for a blog post about "${topic}" with primary keyword "${keyword}".

Requirements:
- Each title should be unique and engaging
- Include the keyword naturally
- Optimize for click-through rate
- Vary the style (how-to, list, question, etc.)
- Keep titles under 60 characters for SEO

Respond with JSON:
{
  "titles": ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"]
}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a headline writing expert. Create compelling, SEO-optimized titles."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return result.titles || [`${keyword}: Complete Guide`, `Understanding ${topic}`, `${keyword} Explained`];
    } catch (error) {
      console.error('Error generating title variations:', error);
      return [`${keyword}: Complete Guide`, `Understanding ${topic}`, `${keyword} Explained`];
    }
  }

  /**
   * Suggest trending topics based on category
   */
  async suggestTrendingTopics(category: string = 'blockchain'): Promise<string[]> {
    const prompt = `Suggest 10 trending and valuable blog topics in the "${category}" category that would be relevant for a crypto/blockchain audience.

Focus on:
- Current trends and developments
- Practical, actionable content
- Topics with high search potential
- Educational value for readers
- Relevance to blockchain/crypto ecosystem

Respond with JSON:
{
  "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6", "Topic 7", "Topic 8", "Topic 9", "Topic 10"]
}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a content strategy expert specializing in blockchain and cryptocurrency topics."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return result.topics || [
        "DeFi Yield Farming Strategies",
        "NFT Market Analysis 2024",
        "Layer 2 Solutions Comparison",
        "Crypto Tax Planning Guide",
        "Blockchain Security Best Practices"
      ];
    } catch (error) {
      console.error('Error suggesting trending topics:', error);
      return [
        "DeFi Yield Farming Strategies",
        "NFT Market Analysis 2024", 
        "Layer 2 Solutions Comparison",
        "Crypto Tax Planning Guide",
        "Blockchain Security Best Practices"
      ];
    }
  }

  /**
   * Enhance existing content with AI improvements
   */
  async enhanceContent(content: string, improvements: string[]): Promise<string> {
    const improvementsList = improvements.join('\n- ');
    
    const prompt = `Enhance the following blog content based on these specific improvements:

REQUESTED IMPROVEMENTS:
- ${improvementsList}

ORIGINAL CONTENT:
${content}

Provide the enhanced version that incorporates all requested improvements while maintaining the original structure and voice. Return only the improved content in markdown format.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a content enhancement expert. Improve content while preserving its original intent and voice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 4000
      });

      return response.choices[0].message.content || content;
    } catch (error) {
      console.error('Error enhancing content:', error);
      return content; // Return original if enhancement fails
    }
  }
}

// Export singleton instance
export const blogService = new OpenAIBlogService();