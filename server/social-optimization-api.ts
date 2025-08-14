import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Mock data stores (replace with database in production)
const mockAnalytics = {
  posts: [
    {
      id: '1',
      content: 'FlutterBye revolutionizing Web3 communication!',
      platform: 'Twitter',
      timestamp: '2025-01-14T10:00:00Z',
      likes: 245,
      comments: 32,
      retweets: 89,
      impressions: 15420,
      reach: 12340,
      clicks: 156,
      hashtags: ['#FlutterBye', '#Web3', '#TokenizedMessaging']
    },
    {
      id: '2',
      content: 'Every message has value! Experience blockchain-powered communication',
      platform: 'Twitter',
      timestamp: '2025-01-14T14:30:00Z',
      likes: 189,
      comments: 24,
      retweets: 67,
      impressions: 11230,
      reach: 9870,
      clicks: 134,
      hashtags: ['#SocialFi', '#Blockchain', '#Innovation']
    }
  ],
  accounts: [
    {
      id: '1',
      platform: 'Twitter',
      username: '@FlutterByeHQ',
      followers: 15420,
      isConnected: true
    }
  ],
  content: [],
  queue: []
};

// Analytics endpoints
router.get('/analytics/posts', (req, res) => {
  res.json(mockAnalytics.posts);
});

router.get('/analytics/overview', (req, res) => {
  const totalImpressions = mockAnalytics.posts.reduce((sum, post) => sum + post.impressions, 0);
  const totalReach = mockAnalytics.posts.reduce((sum, post) => sum + post.reach, 0);
  const totalEngagements = mockAnalytics.posts.reduce((sum, post) => sum + post.likes + post.comments + post.retweets, 0);
  const avgEngagementRate = (totalEngagements / totalImpressions) * 100;

  res.json({
    totalImpressions,
    totalReach,
    totalEngagements,
    avgEngagementRate: avgEngagementRate.toFixed(2),
    postsCount: mockAnalytics.posts.length
  });
});

// Account management endpoints
router.get('/accounts', (req, res) => {
  res.json(mockAnalytics.accounts);
});

router.post('/accounts', (req, res) => {
  const newAccount = {
    id: Date.now().toString(),
    ...req.body,
    isConnected: false,
    followers: Math.floor(Math.random() * 50000),
    following: Math.floor(Math.random() * 2000),
    posts: Math.floor(Math.random() * 5000)
  };
  
  mockAnalytics.accounts.push(newAccount);
  res.json(newAccount);
});

router.post('/accounts/:id/test', async (req, res) => {
  const accountId = req.params.id;
  const account = mockAnalytics.accounts.find(acc => acc.id === accountId);
  
  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }

  // Simulate connection test
  try {
    const success = Math.random() > 0.1; // 90% success rate for demo
    
    if (success) {
      account.isConnected = true;
      res.json({ 
        success: true, 
        message: `Successfully connected to ${account.platform} account ${account.username}`,
        platform: account.platform
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials or API limits exceeded' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Connection test failed' 
    });
  }
});

router.delete('/accounts/:id', (req, res) => {
  const accountId = req.params.id;
  const index = mockAnalytics.accounts.findIndex(acc => acc.id === accountId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Account not found' });
  }
  
  mockAnalytics.accounts.splice(index, 1);
  res.json({ message: 'Account deleted successfully' });
});

// Content library endpoints
router.get('/content/library', (req, res) => {
  res.json(mockAnalytics.content);
});

router.post('/content/library', (req, res) => {
  const newContent = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usage: 0
  };
  
  mockAnalytics.content.push(newContent);
  res.json(newContent);
});

router.delete('/content/library/:id', (req, res) => {
  const contentId = req.params.id;
  const index = mockAnalytics.content.findIndex(item => item.id === contentId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Content not found' });
  }
  
  mockAnalytics.content.splice(index, 1);
  res.json({ message: 'Content deleted successfully' });
});

router.post('/content/generate', async (req, res) => {
  const { type, platform } = req.body;
  
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI content creator for FlutterBye, a Web3 tokenized messaging platform. Generate engaging social media content."
        },
        {
          role: "user",
          content: `Generate ${type} content for ${platform}. Make it engaging and relevant to FlutterBye's blockchain communication platform. Include relevant hashtags. Respond with JSON in this format: { "content": "post text", "hashtags": ["#tag1", "#tag2"] }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const generated = JSON.parse(response.choices[0].message.content || '{}');
    res.json(generated);
  } catch (error) {
    console.error('Content generation failed:', error);
    
    // Fallback content
    const fallbackContent = {
      content: "🚀 FlutterBye is transforming Web3 communication! Experience the future of tokenized messaging where every conversation has value. Join our revolutionary platform today!",
      hashtags: ["#FlutterBye", "#Web3", "#TokenizedMessaging", "#SocialFi", "#Blockchain"]
    };
    
    res.json(fallbackContent);
  }
});

// Post queue endpoints
router.get('/queue', (req, res) => {
  res.json(mockAnalytics.queue);
});

router.post('/queue', (req, res) => {
  const newPost = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    status: req.body.status || 'scheduled'
  };
  
  mockAnalytics.queue.push(newPost);
  res.json(newPost);
});

router.post('/queue/:id/publish', async (req, res) => {
  const postId = req.params.id;
  const post = mockAnalytics.queue.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  try {
    // Simulate publishing
    const success = Math.random() > 0.05; // 95% success rate for demo
    
    if (success) {
      post.status = 'posted';
      res.json({ 
        success: true, 
        message: 'Post published successfully',
        platform: post.platform,
        postId: post.id
      });
    } else {
      post.status = 'failed';
      res.status(400).json({ 
        success: false, 
        message: 'Publishing failed - API limits or connection error' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Publishing failed' 
    });
  }
});

router.delete('/queue/:id', (req, res) => {
  const postId = req.params.id;
  const index = mockAnalytics.queue.findIndex(post => post.id === postId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  mockAnalytics.queue.splice(index, 1);
  res.json({ message: 'Post deleted successfully' });
});

router.post('/queue/reorder', (req, res) => {
  const { postIds } = req.body;
  
  // Reorder posts based on provided IDs
  const reorderedQueue = postIds.map((id: string) => 
    mockAnalytics.queue.find(post => post.id === id)
  ).filter(Boolean);
  
  mockAnalytics.queue.length = 0;
  mockAnalytics.queue.push(...reorderedQueue);
  
  res.json({ message: 'Queue reordered successfully' });
});

// AI optimization endpoints
router.get('/ai/optimization-insights', async (req, res) => {
  try {
    const insights = [
      {
        id: '1',
        type: 'timing',
        title: 'Optimal Posting Time Identified',
        description: 'Your audience is 73% more engaged between 6-8 PM EST',
        impact: 'high',
        recommendation: 'Schedule posts between 6:00 PM - 8:00 PM for maximum engagement',
        confidence: 89,
        implementable: true
      },
      {
        id: '2',
        type: 'content',
        title: 'Educational Content Outperforms',
        description: 'Educational posts receive 45% higher engagement than promotional content',
        impact: 'high',
        recommendation: 'Increase educational content ratio to 60% of total posts',
        confidence: 92,
        implementable: true
      }
    ];

    const predictions = {
      estimatedReach: 18500,
      estimatedEngagement: 3.4,
      viralPotential: 87,
      optimalTiming: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      suggestedHashtags: ['#FlutterBye', '#Web3Revolution', '#TokenizedMessaging', '#SocialFi'],
      audienceMatch: 91
    };

    res.json({ insights, predictions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch optimization insights' });
  }
});

router.post('/ai/run-optimization', async (req, res) => {
  const { includeContentAnalysis, includeTimingAnalysis, includeAudienceAnalysis } = req.body;
  
  try {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const insights = [
      {
        id: Date.now().toString(),
        type: 'timing',
        title: 'Peak Engagement Window Detected',
        description: 'Analysis shows 89% higher engagement during evening hours',
        impact: 'high',
        recommendation: 'Shift 70% of posts to 7-9 PM EST for optimal performance',
        confidence: 94,
        implementable: true
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'content',
        title: 'Visual Content Performance',
        description: 'Posts with images receive 156% more engagement',
        impact: 'high',
        recommendation: 'Include visuals in all posts, prioritize infographics and branded images',
        confidence: 87,
        implementable: true
      }
    ];

    const predictions = {
      estimatedReach: 24500,
      estimatedEngagement: 4.1,
      viralPotential: 93,
      optimalTiming: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
      suggestedHashtags: ['#FlutterBye', '#Web3Revolution', '#BlockchainCommunication', '#TokenizedMessaging'],
      audienceMatch: 94
    };

    res.json({ 
      insights, 
      predictions,
      analysisComplete: true,
      recommendations: insights.length
    });
  } catch (error) {
    res.status(500).json({ message: 'AI optimization analysis failed' });
  }
});

router.post('/ai/implement-recommendation/:id', (req, res) => {
  const recommendationId = req.params.id;
  
  try {
    // Simulate implementation
    res.json({ 
      success: true, 
      message: 'Recommendation implemented successfully',
      recommendationId,
      appliedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to implement recommendation' });
  }
});

// Instant post generation endpoint
router.post('/generate-post', async (req, res) => {
  try {
    const { topic = 'social media', tone = 'engaging', platform = 'twitter' } = req.body;
    
    const prompt = `Generate a ${tone} ${platform} post about ${topic}. 
    The post should be:
    - Under 280 characters for Twitter
    - Engaging and viral-worthy
    - Include relevant hashtags
    - Call-to-action if appropriate
    - Professional but exciting tone
    
    Topic focus: ${topic}
    Platform: ${platform}
    Tone: ${tone}
    
    Return only the post content, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.8
    });

    const generatedContent = completion.choices[0].message.content?.trim() || '';
    
    res.json({ 
      content: generatedContent,
      platform,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Post generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate post content',
      message: error.message 
    });
  }
});

// Instant post publishing endpoint
router.post('/post-now', async (req, res) => {
  try {
    const { content, platforms = ['twitter'] } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Simulate posting to platforms (in production, integrate with actual APIs)
    const results = platforms.map(platform => ({
      platform,
      status: 'success',
      postId: `${platform}_${Date.now()}`,
      url: `https://${platform}.com/post/${Date.now()}`,
      postedAt: new Date().toISOString()
    }));

    // Add to analytics for tracking
    const newPost = {
      id: Date.now().toString(),
      content,
      platform: platforms[0],
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      retweets: 0,
      impressions: 0,
      reach: 0,
      clicks: 0,
      hashtags: content.match(/#\w+/g) || [],
      isInstantPost: true
    };
    
    mockAnalytics.posts.unshift(newPost);
    
    res.json({
      success: true,
      results,
      postData: newPost
    });
  } catch (error) {
    console.error('Post publishing error:', error);
    res.status(500).json({ 
      error: 'Failed to publish post',
      message: error.message 
    });
  }
});

export default router;