import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Bot, 
  BarChart3, 
  Users, 
  FileText, 
  Calendar, 
  Brain,
  Activity,
  TrendingUp,
  MessageSquare,
  Settings,
  Play,
  Pause,
  Plus,
  Eye,
  Target,
  Zap,
  Heart,
  MessageCircle,
  Repeat2,
  Clock,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  EyeOff,
  Trash2,
  Upload,
  Image,
  Video,
  Music,
  Folder,
  Search,
  Tag,
  Edit,
  Copy,
  Sparkles,
  RefreshCw
} from 'lucide-react';

// Component for Analytics Dashboard Content
function SocialAnalyticsDashboardContent() {
  const [posts, setPosts] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('7d');
  
  const mockPosts = [
    {
      id: '1',
      content: '🚀 FlutterBye is revolutionizing Web3 communication! Join our tokenized messaging platform #FlutterBye #Web3',
      platform: 'Twitter',
      timestamp: '2025-01-14T10:00:00Z',
      likes: 245,
      comments: 32,
      retweets: 89,
      impressions: 15420,
      engagementRate: 2.38,
      reach: 12340,
      clicks: 156,
      hashtags: ['#FlutterBye', '#Web3', '#TokenizedMessaging']
    },
    {
      id: '2',
      content: 'Every message has value! Experience blockchain-powered communication ⚡ #SocialFi #Blockchain',
      platform: 'Twitter',
      timestamp: '2025-01-14T14:30:00Z',
      likes: 189,
      comments: 24,
      retweets: 67,
      impressions: 11230,
      engagementRate: 2.49,
      reach: 9870,
      clicks: 134,
      hashtags: ['#SocialFi', '#Blockchain', '#Innovation']
    }
  ];

  const engagementByHour = [
    { hour: '6AM', engagement: 1.8 },
    { hour: '9AM', engagement: 2.4 },
    { hour: '12PM', engagement: 3.1 },
    { hour: '3PM', engagement: 2.8 },
    { hour: '6PM', engagement: 3.5 },
    { hour: '9PM', engagement: 2.9 },
    { hour: '12AM', engagement: 1.5 }
  ];

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const calculateTotalMetrics = () => {
    return posts.reduce((totals, post) => ({
      likes: totals.likes + post.likes,
      comments: totals.comments + post.comments,
      retweets: totals.retweets + post.retweets,
      impressions: totals.impressions + post.impressions,
      reach: totals.reach + post.reach,
      clicks: totals.clicks + post.clicks
    }), { likes: 0, comments: 0, retweets: 0, impressions: 0, reach: 0, clicks: 0 });
  };

  const totalMetrics = calculateTotalMetrics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Impressions</p>
                <p className="text-3xl font-bold text-blue-400">{totalMetrics.impressions.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Engagement</p>
                <p className="text-3xl font-bold text-green-400">{(totalMetrics.likes + totalMetrics.comments + totalMetrics.retweets).toLocaleString()}</p>
              </div>
              <Heart className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Reach</p>
                <p className="text-3xl font-bold text-purple-400">{totalMetrics.reach.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Avg Engagement Rate</p>
                <p className="text-3xl font-bold text-yellow-400">2.44%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Engagement by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="engagement" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Posts Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-slate-300 mb-2 line-clamp-2">{post.content}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{post.platform}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat2 className="w-3 h-3" />
                        {post.retweets}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Component for Engagement Accounts Content
function EngagementAccountsContent() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showAddAccount, setShowAddAccount] = useState(false);

  const mockAccounts = [
    {
      id: '1',
      platform: 'Twitter',
      username: '@FlutterByeHQ',
      displayName: 'FlutterBye Official',
      isConnected: true,
      lastSync: '2025-01-14T12:00:00Z',
      followers: 15420,
      following: 892,
      posts: 1247
    }
  ];

  const platformConfigs = {
    Twitter: {
      icon: Twitter,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20 border-blue-500/30'
    },
    Instagram: {
      icon: Instagram,
      color: 'text-pink-400',
      bgColor: 'bg-pink-900/20 border-pink-500/30'
    },
    LinkedIn: {
      icon: Linkedin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-900/20 border-blue-500/30'
    }
  };

  useEffect(() => {
    setAccounts(mockAccounts);
  }, []);

  const handleAddAccount = () => {
    toast({
      title: "Account Connection",
      description: "Opening authentication flow...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Connected Accounts</h3>
          <p className="text-slate-400">Manage your social media accounts for automation</p>
        </div>
        <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle>Connect Social Media Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(platformConfigs).map(([platform, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <Button
                      key={platform}
                      variant="outline"
                      className={`p-6 h-auto flex-col gap-2 ${config.bgColor} ${config.color}`}
                      onClick={handleAddAccount}
                    >
                      <IconComponent className="w-8 h-8" />
                      <span>{platform}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => {
          const config = platformConfigs[account.platform as keyof typeof platformConfigs];
          const IconComponent = config?.icon || Twitter;
          
          return (
            <Card key={account.id} className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm ${config?.bgColor}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-6 h-6 ${config?.color}`} />
                    <div>
                      <h4 className="font-semibold text-white">{account.displayName}</h4>
                      <p className="text-sm text-slate-400">{account.username}</p>
                    </div>
                  </div>
                  <Badge variant={account.isConnected ? "default" : "secondary"}>
                    {account.isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-white">{account.followers.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Followers</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{account.following.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Following</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{account.posts.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Posts</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="w-4 h-4 mr-1" />
                    Settings
                  </Button>
                  <Button size="sm" variant="outline">
                    <TestTube className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Component for Content Library Content
function ContentLibraryContent() {
  const { toast } = useToast();
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [generating, setGenerating] = useState(false);

  const mockContent = [
    {
      id: '1',
      name: 'FlutterBye Logo Primary',
      type: 'image',
      url: '/public-objects/brand/flutter-logo-primary.png',
      tags: ['logo', 'brand', 'primary'],
      category: 'Brand Assets',
      createdAt: '2025-01-14T10:00:00Z',
      usage: 45,
      aiGenerated: false
    },
    {
      id: '2',
      name: 'Token Creation Guide',
      type: 'text',
      content: 'Step-by-step guide to creating your first FlutterBye token. Perfect for educational content and tutorials.',
      tags: ['guide', 'tutorial', 'tokens'],
      category: 'Educational',
      createdAt: '2025-01-14T11:00:00Z',
      usage: 23,
      aiGenerated: true
    },
    {
      id: '3',
      name: 'Web3 Communication Template',
      type: 'template',
      content: '🚀 Discover the future of communication with FlutterBye! [CUSTOM_MESSAGE] Join the revolution at [LINK] #FlutterBye #Web3',
      tags: ['template', 'web3', 'communication'],
      category: 'Templates',
      createdAt: '2025-01-14T12:00:00Z',
      usage: 67,
      aiGenerated: true
    }
  ];

  useEffect(() => {
    setContentItems(mockContent);
  }, []);

  const handleGenerateContent = async () => {
    setGenerating(true);
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Content Generated",
        description: "AI-powered content has been added to your library",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'text': return FileText;
      case 'template': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Content Library</h3>
          <p className="text-slate-400">Manage and organize your content assets</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleGenerateContent}
            disabled={generating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            AI Generate
          </Button>
          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle>Upload Content</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="bg-slate-700 border-slate-600"
                    accept="image/*,video/*,.txt,.pdf"
                  />
                </div>
                <div>
                  <Label htmlFor="content-name">Content Name</Label>
                  <Input
                    id="content-name"
                    placeholder="Enter content name"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="content-tags">Tags (comma separated)</Label>
                  <Input
                    id="content-tags"
                    placeholder="brand, logo, primary"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Button className="w-full">Upload Content</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentItems.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          
          return (
            <Card key={item.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                  </div>
                  <div className="flex gap-1">
                    {item.aiGenerated && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {item.type === 'text' || item.type === 'template' ? (
                  <p className="text-sm text-slate-300 mb-3 line-clamp-3">{item.content}</p>
                ) : (
                  <div className="h-32 bg-slate-700 rounded-lg mb-3 flex items-center justify-center">
                    <TypeIcon className="w-8 h-8 text-slate-500" />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span>{item.category}</span>
                  <span>{item.usage} uses</span>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Copy className="w-3 h-3 mr-1" />
                    Use
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Component for Post Queue Content
function PostQueueContent() {
  const { toast } = useToast();
  const [queuedPosts, setQueuedPosts] = useState<any[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const mockQueuedPosts = [
    {
      id: '1',
      content: '🚀 FlutterBye is revolutionizing Web3 communication! Join our tokenized messaging platform #FlutterBye #Web3',
      platforms: ['Twitter', 'LinkedIn'],
      scheduledTime: '2025-01-14T15:00:00Z',
      status: 'scheduled',
      estimatedReach: 15000
    },
    {
      id: '2',
      content: 'Every message has value! Experience blockchain-powered communication ⚡ #SocialFi #Blockchain',
      platforms: ['Twitter'],
      scheduledTime: '2025-01-14T18:00:00Z',
      status: 'scheduled',
      estimatedReach: 12000
    }
  ];

  useEffect(() => {
    setQueuedPosts(mockQueuedPosts);
  }, []);

  const handleCreatePost = () => {
    toast({
      title: "Post Creator",
      description: "Opening post creation interface...",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'published': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Post Queue</h3>
          <p className="text-slate-400">Schedule and manage your social media posts</p>
        </div>
        <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Scheduled Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="post-content">Post Content</Label>
                <Textarea
                  id="post-content"
                  placeholder="What's happening? #FlutterBye"
                  className="bg-slate-700 border-slate-600 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Platforms</Label>
                  <div className="space-y-2 mt-2">
                    {['Twitter', 'LinkedIn', 'Instagram'].map((platform) => (
                      <label key={platform} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-slate-300">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="schedule-time">Schedule Time</Label>
                  <Input
                    id="schedule-time"
                    type="datetime-local"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
              <Button onClick={handleCreatePost} className="w-full">Schedule Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {queuedPosts.map((post) => (
          <Card key={post.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-slate-300 mb-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(post.scheduledTime).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Est. reach: {post.estimatedReach.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(post.status)}`} />
                  <Badge variant="outline">{post.status}</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {post.platforms.map((platform: string) => (
                    <Badge key={platform} variant="secondary" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Play className="w-3 h-3 mr-1" />
                    Post Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Component for AI Optimization Content
function AIOptimizationContent() {
  const { toast } = useToast();
  const [optimization, setOptimization] = useState({
    viralScore: 87,
    engagementPrediction: 2.4,
    bestPostingTime: '3:00 PM',
    recommendedHashtags: ['#FlutterBye', '#Web3', '#SocialFi'],
    contentSuggestions: [
      'Add trending emoji combinations',
      'Include call-to-action phrases',
      'Reference current events'
    ]
  });

  const handleOptimizeContent = () => {
    toast({
      title: "AI Optimization",
      description: "Analyzing content for viral potential...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">AI Optimization Center</h3>
          <p className="text-slate-400">Maximize viral reach with AI-powered insights</p>
        </div>
        <Button onClick={handleOptimizeContent} className="bg-purple-600 hover:bg-purple-700">
          <Brain className="w-4 h-4 mr-2" />
          Optimize Content
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Viral Score Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{optimization.viralScore}/100</div>
              <p className="text-slate-400">Current Content Score</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Engagement Potential</span>
                  <span className="text-white">{optimization.engagementPrediction}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${optimization.engagementPrediction * 10}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Viral Probability</span>
                  <span className="text-white">{optimization.viralScore}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full"
                    style={{ width: `${optimization.viralScore}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Best Posting Time</h4>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">{optimization.bestPostingTime}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Recommended Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {optimization.recommendedHashtags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-blue-900/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Content Suggestions</h4>
                <ul className="space-y-2">
                  {optimization.contentSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ComprehensiveSocialDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [botConfigs, setBotConfigs] = useState<any[]>([]);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const response = await fetch('/api/social/bots');
      if (response.ok) {
        const data = await response.json();
        setBotConfigs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch bots:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Social Media Command Center
          </h1>
          <p className="text-xl text-slate-300">
            AI-powered social automation for maximum viral reach and engagement
          </p>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Queue
            </TabsTrigger>
            <TabsTrigger value="ai-optimization" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Center
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Active Bots</p>
                      <p className="text-3xl font-bold text-blue-400">
                        {botConfigs.filter(bot => bot.status === 'running').length}
                      </p>
                    </div>
                    <Bot className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Posts Today</p>
                      <p className="text-3xl font-bold text-green-400">42</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Engagement Rate</p>
                      <p className="text-3xl font-bold text-purple-400">8.7%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Viral Score</p>
                      <p className="text-3xl font-bold text-yellow-400">94</p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bot Status Overview */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Bot Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {botConfigs.length > 0 ? (
                    botConfigs.map((bot) => (
                      <div key={bot.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            bot.status === 'running' ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <div>
                            <p className="font-medium text-white">{bot.name}</p>
                            <p className="text-sm text-slate-400">{bot.platform} • {bot.postingFrequency} posts/day</p>
                          </div>
                        </div>
                        <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                          {bot.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                      <p>No bots configured yet</p>
                      <p className="text-sm">Create your first automation bot to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Dashboard */}
          <TabsContent value="analytics" className="space-y-6">
            <SocialAnalyticsDashboardContent />
          </TabsContent>

          {/* Engagement Accounts */}
          <TabsContent value="accounts" className="space-y-6">
            <EngagementAccountsContent />
          </TabsContent>

          {/* Content Library */}
          <TabsContent value="content" className="space-y-6">
            <ContentLibraryContent />
          </TabsContent>

          {/* Post Queue Manager */}
          <TabsContent value="queue" className="space-y-6">
            <PostQueueContent />
          </TabsContent>

          {/* AI Optimization Center */}
          <TabsContent value="ai-optimization" className="space-y-6">
            <AIOptimizationContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}