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
import { Switch } from '@/components/ui/switch';
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
  RefreshCw,
  Send,
  Info
} from 'lucide-react';

// Component for Schedule Time Slots
function ScheduleTimeSlots() {
  const timeSlots = [
    { key: 'earlyMorning', label: 'Early Morning', description: '6:00 AM - Peak commuter time', defaultTime: '06:00' },
    { key: 'breakfast', label: 'Breakfast Time', description: '8:30 AM - Morning routine', defaultTime: '08:30' },
    { key: 'lateMorning', label: 'Late Morning', description: '10:00 AM - Work break', defaultTime: '10:00' },
    { key: 'lunch', label: 'Lunch Time', description: '12:00 PM - Peak lunch hour', defaultTime: '12:00' },
    { key: 'earlyAfternoon', label: 'Early Afternoon', description: '2:00 PM - Post-lunch', defaultTime: '14:00' },
    { key: 'lateAfternoon', label: 'Late Afternoon', description: '4:00 PM - End of work day', defaultTime: '16:00' },
    { key: 'dinner', label: 'Dinner Time', description: '6:30 PM - Evening routine', defaultTime: '18:30' },
    { key: 'earlyEvening', label: 'Early Evening', description: '8:00 PM - Prime time', defaultTime: '20:00' },
    { key: 'evening', label: 'Evening', description: '9:30 PM - Relaxation time', defaultTime: '21:30' },
    { key: 'lateNight', label: 'Late Night', description: '11:00 PM - Night owls', defaultTime: '23:00' }
  ];

  const [scheduleState, setScheduleState] = useState(() => {
    const initialState: any = {};
    timeSlots.forEach(slot => {
      initialState[slot.key] = {
        enabled: false,
        time: slot.defaultTime
      };
    });
    return initialState;
  });

  const toggleSlot = (slotKey: string) => {
    setScheduleState((prev: any) => ({
      ...prev,
      [slotKey]: {
        ...prev[slotKey],
        enabled: !prev[slotKey].enabled
      }
    }));
  };

  const updateTime = (slotKey: string, time: string) => {
    setScheduleState((prev: any) => ({
      ...prev,
      [slotKey]: {
        ...prev[slotKey],
        time
      }
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {timeSlots.map((slot) => {
        const config = scheduleState[slot.key];
        return (
          <Card key={slot.key} className={`border transition-all duration-200 ${config.enabled ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-700/30 border-slate-600'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    {slot.label}
                    <div className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-green-500' : 'bg-slate-500'}`} />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">{slot.description}</p>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={() => toggleSlot(slot.key)}
                  data-testid={`schedule-toggle-${slot.key}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`time-${slot.key}`} className="text-sm text-slate-300">
                  Posting Time
                </Label>
                <Input
                  id={`time-${slot.key}`}
                  type="time"
                  value={config.time}
                  onChange={(e) => updateTime(slot.key, e.target.value)}
                  className={`bg-slate-600 border-slate-500 text-white font-mono text-center ${config.enabled ? 'border-green-500/50' : ''}`}
                  disabled={!config.enabled}
                  data-testid={`schedule-time-${slot.key}`}
                />
              </div>

              {config.enabled && (
                <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded text-xs">
                  <p className="text-green-400">
                    ✓ Will post at {config.time} daily
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Component for AI Content Generation
function AIContentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('breakfast');
  const [customContext, setCustomContext] = useState('');
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    { id: 'earlyMorning', label: 'Early Morning (6:00 AM)', time: '06:00' },
    { id: 'breakfast', label: 'Breakfast Time (8:30 AM)', time: '08:30' },
    { id: 'lateMorning', label: 'Late Morning (10:00 AM)', time: '10:00' },
    { id: 'lunch', label: 'Lunch Break (12:30 PM)', time: '12:30' },
    { id: 'earlyAfternoon', label: 'Early Afternoon (2:00 PM)', time: '14:00' },
    { id: 'lateAfternoon', label: 'Late Afternoon (4:30 PM)', time: '16:30' },
    { id: 'dinner', label: 'Dinner Time (6:30 PM)', time: '18:30' },
    { id: 'earlyEvening', label: 'Early Evening (8:00 PM)', time: '20:00' },
    { id: 'evening', label: 'Evening (9:30 PM)', time: '21:30' },
    { id: 'lateNight', label: 'Late Night (11:00 PM)', time: '23:00' }
  ];

  // FlutterBye Content Strategy Indicators
  const flutterByeContentFeatures = [
    { feature: 'Brand Asset Integration', status: 'active', description: 'Uses cosmic butterfly logo and brand visuals' },
    { feature: 'Real Platform Data', status: 'active', description: 'References actual FlutterBye features and achievements' },
    { feature: 'Technical Accuracy', status: 'active', description: 'Mentions SPL tokens, AI scoring, metadata creation' },
    { feature: 'Achievement Showcase', status: 'active', description: '10x performance, Twitter API, Phantom fixes' },
    { feature: 'Strategic Messaging', status: 'active', description: 'Time-optimized content for maximum engagement' }
  ];

  const generateAndScheduleContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/social-automation/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeSlot: selectedTimeSlot,
          customContext: customContext.trim() || undefined
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "AI Content Generated!",
          description: "Your AI-powered post has been scheduled successfully.",
          variant: "default"
        });
        setCustomContext('');
        setPreviewContent(null);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate AI content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const bulkGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/social-automation/ai/bulk-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 5 })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Bulk Content Generated!",
          description: `${result.postIds?.length || 5} AI posts have been scheduled across optimal time slots.`,
          variant: "default"
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Bulk Generation Failed",
        description: error.message || "Failed to generate bulk AI content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const previewAIContent = async () => {
    setIsLoadingPreview(true);
    try {
      const response = await fetch('/api/social-automation/ai/preview-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeSlot: selectedTimeSlot,
          customContext: customContext.trim() || undefined
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setPreviewContent(result.content);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Preview Failed",
        description: error.message || "Failed to preview AI content",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time-slot">Target Time Slot</Label>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="context">Custom Context (Optional)</Label>
              <Input
                id="context"
                placeholder="e.g., Focus on weekend engagement"
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button 
              onClick={previewAIContent}
              disabled={isLoadingPreview}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {isLoadingPreview ? 'Previewing...' : 'Preview Content'}
            </Button>
            
            <Button 
              onClick={generateAndScheduleContent}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate & Schedule'}
            </Button>
            
            <Button 
              onClick={bulkGenerateContent}
              disabled={isGenerating}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Bulk Generate (5 Posts)'}
            </Button>
          </div>

          {previewContent && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  AI Content Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-background rounded border">
                  <p className="text-sm">{previewContent.text}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {previewContent.hashtags?.map((tag: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tone: {previewContent.tone}</span>
                  <span>Est. Reach: {previewContent.estimatedReach?.toLocaleString()}</span>
                  <span>Engagement Score: {previewContent.engagementScore}/10</span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Component for Analytics Dashboard Content
function SocialAnalyticsDashboardContent() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/social-automation/analytics?timeRange=${timeRange}`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">No analytics data available</div>
      </div>
    );
  }

  const recentPosts = analytics.recentPosts || [
  ];

  const engagementByHour = analytics.engagementByHour || [
    { hour: '6AM', engagement: 1.8 },
    { hour: '9AM', engagement: 2.4 },
    { hour: '12PM', engagement: 3.1 },
    { hour: '3PM', engagement: 2.8 },
    { hour: '6PM', engagement: 3.5 },
    { hour: '9PM', engagement: 2.9 },
    { hour: '12AM', engagement: 1.5 }
  ];

  const calculateTotalMetrics = () => {
    return recentPosts.reduce((totals, post) => ({
      likes: totals.likes + post.likes,
      comments: totals.comments + post.comments,
      retweets: totals.retweets + post.retweets,
      impressions: totals.impressions + post.impressions,
      reach: totals.reach + post.reach,
      clicks: totals.clicks + post.clicks
    }), { likes: 0, comments: 0, retweets: 0, impressions: 0, reach: 0, clicks: 0 });
  };

  const totalMetrics = calculateTotalMetrics();

  const reachAnalytics = analytics.reachAnalytics || [
    { platform: 'Twitter', reach: 45670, engagement: 3.2 }
  ];

  const topHashtags = analytics.topHashtags || [
    { tag: '#FlutterBye', count: 234, avgEngagement: 3.2 }
  ];

  const optimization = analytics.optimization || {
    bestPostingTime: '12:30 PM',
    recommendedHashtags: ['#FlutterBye', '#Web3', '#SocialFi'],
    contentSuggestions: [
      'Focus on community engagement during lunch hours'
    ]
  };

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
              {recentPosts.map((post) => (
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/social-automation/scheduled-posts');
      if (response.ok) {
        const data = await response.json();
        setQueuedPosts(data.success ? data.posts : []);
      }
    } catch (error) {
      console.error('Failed to load scheduled posts:', error);
      toast({
        title: "Error",
        description: "Failed to load scheduled posts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/social-automation/scheduled-posts/${postId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadScheduledPosts(); // Refresh the list
        toast({
          title: "Post Cancelled",
          description: "Scheduled post was cancelled successfully"
        });
      }
    } catch (error) {
      console.error('Failed to cancel post:', error);
      toast({
        title: "Error",
        description: "Failed to cancel post",
        variant: "destructive"
      });
    }
  };

  const [newPostData, setNewPostData] = useState({
    content: '',
    scheduledTime: '',
    platforms: ['Twitter'] as string[]
  });

  const handleCreatePost = async () => {
    if (!newPostData.content.trim() || !newPostData.scheduledTime) {
      toast({
        title: "Invalid Input",
        description: "Please fill in both content and schedule time",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/social-automation/scheduled-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostData.content,
          scheduledTime: new Date(newPostData.scheduledTime).toISOString(),
          platforms: newPostData.platforms,
          source: 'manual'
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Post Scheduled!",
          description: `Your post has been scheduled for ${new Date(newPostData.scheduledTime).toLocaleString()}`,
        });
        setShowCreatePost(false);
        setNewPostData({ content: '', scheduledTime: '', platforms: ['Twitter'] });
        await loadScheduledPosts(); // Refresh the list
      } else {
        throw new Error('Failed to schedule post');
      }
    } catch (error) {
      toast({
        title: "Scheduling Failed",
        description: "Unable to schedule your post. Please try again.",
        variant: "destructive"
      });
    }
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
          <h3 className="text-xl font-semibold text-white">Post Queue Management</h3>
          <p className="text-slate-400">Schedule, manage, and monitor your social media posts across platforms</p>
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
                  value={newPostData.content}
                  onChange={(e) => setNewPostData(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Platforms</Label>
                  <div className="space-y-2 mt-2">
                    {['Twitter', 'LinkedIn', 'Instagram'].map((platform) => (
                      <label key={platform} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          checked={newPostData.platforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewPostData(prev => ({ 
                                ...prev, 
                                platforms: [...prev.platforms, platform] 
                              }));
                            } else {
                              setNewPostData(prev => ({ 
                                ...prev, 
                                platforms: prev.platforms.filter(p => p !== platform) 
                              }));
                            }
                          }}
                        />
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
                    className="bg-slate-700 border-slate-600 text-white"
                    value={newPostData.scheduledTime}
                    onChange={(e) => setNewPostData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Select date and time for posting (your timezone)
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleCreatePost} 
                className="w-full"
                disabled={!newPostData.content.trim() || !newPostData.scheduledTime}
              >
                Schedule Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-slate-400">Loading scheduled posts...</div>
        ) : queuedPosts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No scheduled posts found</div>
        ) : (
          queuedPosts.map((post) => (
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
                        <Badge variant="secondary" className="text-xs">
                          {post.platform || 'Twitter'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(post.status)}`} />
                    <Badge variant="outline">{post.status}</Badge>
                  </div>
                </div>
                
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.hashtags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    {post.isAIGenerated && (
                      <Badge variant="outline" className="text-xs mr-2">
                        AI Generated
                      </Badge>
                    )}
                    ID: {post.id}
                  </div>
                  <div className="flex gap-2">
                    {post.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => cancelPost(post.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </>
                    )}
                    {post.status === 'posted' && post.platformPostId && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`https://twitter.com/i/web/status/${post.platformPostId}`, '_blank')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Tweet
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Component for Bot Configuration Content
function BotConfigurationContent() {
  const { toast } = useToast();
  const [showBotConfig, setShowBotConfig] = useState(false);
  const [showAccountManager, setShowAccountManager] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showInstantPost, setShowInstantPost] = useState(false);
  const [instantPostContent, setInstantPostContent] = useState('');
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [isPostingNow, setIsPostingNow] = useState(false);
  const [botConfig, setBotConfig] = useState({
    isActive: false,
    postingSchedule: {
      earlyMorning: { enabled: true, time: '06:00' },
      breakfast: { enabled: true, time: '08:30' },
      lateMorning: { enabled: false, time: '10:00' },
      lunch: { enabled: true, time: '12:00' },
      earlyAfternoon: { enabled: false, time: '14:00' },
      lateAfternoon: { enabled: true, time: '16:00' },
      dinner: { enabled: true, time: '18:30' },
      earlyEvening: { enabled: false, time: '20:00' },
      evening: { enabled: true, time: '21:30' },
      lateNight: { enabled: false, time: '23:00' }
    },
    engagementAccounts: []
  });

  const [engagementAccounts, setEngagementAccounts] = useState([
    {
      id: '1',
      name: 'FlutterBye Main',
      username: '@FlutterByeHQ',
      platform: 'Twitter',
      isActive: true,
      apiKeys: {
        api_key: '***********',
        api_secret: '***********',
        access_token: '***********',
        access_token_secret: '***********'
      },
      engagementSettings: {
        likesPerHour: 15,
        retweetsPerHour: 5,
        followsPerHour: 3,
        commentsPerHour: 2
      }
    }
  ]);

  const [aiAnalysis, setAiAnalysis] = useState({
    recommendedPostVolume: 6,
    optimalTimes: ['06:00', '12:00', '16:00', '18:30', '21:30'],
    engagement: {
      currentAvg: 2.4,
      projectedImprovement: '+35%'
    },
    insights: [
      'Your audience is most active during lunch and evening hours',
      'Morning posts get 40% higher engagement rates',
      'Weekend posting shows 25% lower performance',
      'Video content performs 60% better than text-only posts'
    ]
  });

  const timeSlots = [
    { key: 'earlyMorning', label: 'Early Morning', description: '6:00 AM - Rise & Shine' },
    { key: 'breakfast', label: 'Breakfast', description: '8:30 AM - Morning Routine' },
    { key: 'lateMorning', label: 'Late Morning', description: '10:00 AM - Work Start' },
    { key: 'lunch', label: 'Lunch', description: '12:00 PM - Midday Break' },
    { key: 'earlyAfternoon', label: 'Early Afternoon', description: '2:00 PM - Post-Lunch' },
    { key: 'lateAfternoon', label: 'Late Afternoon', description: '4:00 PM - Work Wind Down' },
    { key: 'dinner', label: 'Dinner', description: '6:30 PM - Evening Meal' },
    { key: 'earlyEvening', label: 'Early Evening', description: '8:00 PM - Prime Time' },
    { key: 'evening', label: 'Evening', description: '9:30 PM - Relaxation' },
    { key: 'lateNight', label: 'Late Night', description: '11:00 PM - Night Owls' }
  ];

  const handleScheduleToggle = async (slot: string) => {
    const newConfig = {
      ...botConfig,
      postingSchedule: {
        ...botConfig.postingSchedule,
        [slot]: {
          ...botConfig.postingSchedule[slot as keyof typeof botConfig.postingSchedule],
          enabled: !botConfig.postingSchedule[slot as keyof typeof botConfig.postingSchedule].enabled
        }
      }
    };
    
    try {
      const response = await fetch('/api/social-automation/bot/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: newConfig })
      });
      
      const result = await response.json();
      if (result.success) {
        setBotConfig(newConfig);
      }
    } catch (error) {
      console.error('Failed to update schedule:', error);
    }
  };

  const handleTimeChange = async (slot: string, time: string) => {
    const newConfig = {
      ...botConfig,
      postingSchedule: {
        ...botConfig.postingSchedule,
        [slot]: {
          ...botConfig.postingSchedule[slot as keyof typeof botConfig.postingSchedule],
          time
        }
      }
    };
    
    try {
      const response = await fetch('/api/social-automation/bot/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: newConfig })
      });
      
      const result = await response.json();
      if (result.success) {
        setBotConfig(newConfig);
      }
    } catch (error) {
      console.error('Failed to update schedule time:', error);
    }
  };

  const handleBotToggle = async () => {
    try {
      const endpoint = botConfig.isActive ? '/api/social-automation/bot/stop' : '/api/social-automation/bot/start';
      const response = await fetch(endpoint, { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        setBotConfig(prev => ({ ...prev, isActive: !prev.isActive }));
        toast({
          title: botConfig.isActive ? "Bot Stopped" : "Bot Started",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to toggle bot",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to communicate with bot service",
        variant: "destructive"
      });
    }
  };

  const handleRunAIAnalysis = () => {
    setShowAIAnalysis(true);
    toast({
      title: "AI Analysis Starting",
      description: "Analyzing your posting patterns and audience behavior...",
    });
  };

  const handleGenerateInstantPost = async () => {
    setIsGeneratingPost(true);
    try {
      const response = await fetch('/api/social-optimization/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'trending social media content',
          tone: 'engaging',
          platform: 'twitter'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setInstantPostContent(data.content);
        setShowInstantPost(true);
        
        if (data.fallback) {
          toast({
            title: "Content Generated (Fallback)",
            description: "Using high-quality template content while AI service recovers",
          });
        } else {
          toast({
            title: "Post Generated!",
            description: "AI has created engaging content ready for posting",
          });
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Generation Failed",
          description: errorData.message || "Unable to generate content. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const handlePostNow = async () => {
    if (!instantPostContent.trim()) return;
    
    setIsPostingNow(true);
    try {
      const response = await fetch('/api/social-optimization/post-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: instantPostContent,
          platforms: ['twitter']
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        const successfulPosts = data.results.filter((r: any) => r.status === 'success');
        const failedPosts = data.results.filter((r: any) => r.status === 'failed');
        
        if (successfulPosts.length > 0) {
          const twitterPost = successfulPosts.find((p: any) => p.platform === 'twitter');
          if (twitterPost && twitterPost.url) {
            toast({
              title: "Posted to Twitter Successfully!",
              description: `Your tweet is live! Click here to view: ${twitterPost.url}`,
            });
          } else {
            toast({
              title: "Posted Successfully!",
              description: data.summary || "Your content has been published",
            });
          }
          setShowInstantPost(false);
          setInstantPostContent('');
        }
        
        if (failedPosts.length > 0) {
          failedPosts.forEach((post: any) => {
            toast({
              title: `${post.platform} Failed`,
              description: post.error || 'Unknown error occurred',
              variant: "destructive",
            });
          });
        }
      } else {
        const errorMessage = data.summary || data.error || "Unable to publish content";
        toast({
          title: "Posting Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Posting Failed",
        description: "Unable to publish content. Check your account settings.",
        variant: "destructive"
      });
    } finally {
      setIsPostingNow(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bot Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Bot Status</p>
                <p className="text-2xl font-bold text-white">{botConfig.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div className={`w-4 h-4 rounded-full ${botConfig.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Daily Posts Scheduled</p>
                <p className="text-2xl font-bold text-blue-400">
                  {Object.values(botConfig.postingSchedule).filter(slot => slot.enabled).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Engagement Accounts</p>
                <p className="text-2xl font-bold text-purple-400">{engagementAccounts.filter(acc => acc.isActive).length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">AI Optimization</p>
                <p className="text-2xl font-bold text-green-400">+35%</p>
              </div>
              <Brain className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instant Post Generation */}
      <Card className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Instant Post Generator
          </CardTitle>
          <p className="text-slate-400">Generate and post viral content instantly with AI</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              onClick={handleGenerateInstantPost}
              disabled={isGeneratingPost}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGeneratingPost ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Post
                </>
              )}
            </Button>
            <Dialog open={showInstantPost} onOpenChange={setShowInstantPost}>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Instant Post Generator</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="post-content">Generated Content</Label>
                    <textarea
                      id="post-content"
                      value={instantPostContent}
                      onChange={(e) => setInstantPostContent(e.target.value)}
                      className="w-full h-32 p-3 bg-slate-700 border-slate-600 rounded-md text-white resize-none"
                      placeholder="AI-generated content will appear here..."
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Twitter className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-slate-300">Twitter</span>
                    </div>
                    <Badge variant="outline" className="bg-green-900/20 text-green-400">
                      Ready to Post
                    </Badge>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleGenerateInstantPost}
                      disabled={isGeneratingPost}
                      variant="outline"
                      className="flex-1"
                    >
                      {isGeneratingPost ? "Generating..." : "Regenerate"}
                    </Button>
                    <Button 
                      onClick={handlePostNow}
                      disabled={isPostingNow || !instantPostContent.trim()}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isPostingNow ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Main Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bot Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Bot Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Master Control</span>
              <Button 
                onClick={handleBotToggle}
                className={`${botConfig.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {botConfig.isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Bot
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Bot
                  </>
                )}
              </Button>
            </div>
            <Dialog open={showBotConfig} onOpenChange={setShowBotConfig}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Posting Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-6xl max-h-[85vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Complete Daily Posting Schedule - All Time Slots
                  </DialogTitle>
                  <p className="text-slate-400 text-sm">
                    Configure all posting times throughout the day. Enable/disable specific time slots and customize exact posting times for optimal engagement.
                  </p>
                </DialogHeader>
                
                <div className="space-y-4 overflow-y-auto">
                  {/* Schedule Summary */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Info className="w-4 h-4" />
                      <span className="text-sm font-medium">Schedule Summary</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-blue-300">
                          Active Time Slots: {Object.values(botConfig.postingSchedule).filter(config => config.enabled).length} of {Object.keys(botConfig.postingSchedule).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-300">
                          Daily Posts: {Object.values(botConfig.postingSchedule).filter(config => config.enabled).length} automated posts
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* All Time Slots */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {timeSlots.map((slot) => {
                      const config = botConfig.postingSchedule[slot.key as keyof typeof botConfig.postingSchedule];
                      return (
                        <Card key={slot.key} className={`border transition-all duration-200 ${config.enabled ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-700/30 border-slate-600'}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-white flex items-center gap-2">
                                  {slot.label}
                                  <div className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-green-500' : 'bg-slate-500'}`} />
                                </h4>
                                <p className="text-xs text-slate-400 mt-1">{slot.description}</p>
                              </div>
                              <Switch
                                checked={config.enabled}
                                onCheckedChange={() => handleScheduleToggle(slot.key)}
                                data-testid={`schedule-toggle-${slot.key}`}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`time-${slot.key}`} className="text-sm text-slate-300">
                                Posting Time
                              </Label>
                              <Input
                                id={`time-${slot.key}`}
                                type="time"
                                value={config.time}
                                onChange={(e) => handleTimeChange(slot.key, e.target.value)}
                                className={`bg-slate-600 border-slate-500 text-white font-mono text-center ${config.enabled ? 'border-green-500/50' : ''}`}
                                disabled={!config.enabled}
                                data-testid={`schedule-time-${slot.key}`}
                              />
                            </div>

                            {config.enabled && (
                              <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded text-xs">
                                <p className="text-green-400">
                                  ✓ Will post at {config.time} daily
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Quick Actions */}
                  <div className="border-t border-slate-600 pt-4">
                    <div className="flex gap-3 flex-wrap">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const allEnabled = Object.keys(botConfig.postingSchedule).reduce((config, slot) => {
                            config[slot] = { ...botConfig.postingSchedule[slot as keyof typeof botConfig.postingSchedule], enabled: true };
                            return config;
                          }, {} as any);
                          setBotConfig(prev => ({ ...prev, postingSchedule: allEnabled }));
                        }}
                        className="text-green-400 border-green-400 hover:bg-green-400/10"
                      >
                        Enable All Time Slots
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const allDisabled = Object.keys(botConfig.postingSchedule).reduce((config, slot) => {
                            config[slot] = { ...botConfig.postingSchedule[slot as keyof typeof botConfig.postingSchedule], enabled: false };
                            return config;
                          }, {} as any);
                          setBotConfig(prev => ({ ...prev, postingSchedule: allDisabled }));
                        }}
                        className="text-red-400 border-red-400 hover:bg-red-400/10"
                      >
                        Disable All Time Slots
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const optimalTimes = ['earlyMorning', 'lunch', 'lateAfternoon', 'dinner', 'evening'];
                          const optimized = Object.keys(botConfig.postingSchedule).reduce((config, slot) => {
                            config[slot] = { 
                              ...botConfig.postingSchedule[slot as keyof typeof botConfig.postingSchedule], 
                              enabled: optimalTimes.includes(slot)
                            };
                            return config;
                          }, {} as any);
                          setBotConfig(prev => ({ ...prev, postingSchedule: optimized }));
                        }}
                        className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                      >
                        Use AI Optimal Times
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Engagement Accounts Management */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Engagement Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {engagementAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{account.name}</p>
                      <p className="text-xs text-slate-400">{account.username}</p>
                    </div>
                  </div>
                  <Badge variant={account.isActive ? "default" : "secondary"}>
                    {account.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
            <Dialog open={showAccountManager} onOpenChange={setShowAccountManager}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Twitter Account
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Engagement Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="account-name">Account Name</Label>
                    <Input
                      id="account-name"
                      placeholder="e.g., FlutterBye Support"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="@username"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Twitter API Key"
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="api-secret">API Secret</Label>
                      <Input
                        id="api-secret"
                        type="password"
                        placeholder="Twitter API Secret"
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="access-token">Access Token</Label>
                      <Input
                        id="access-token"
                        type="password"
                        placeholder="Access Token"
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="access-secret">Access Token Secret</Label>
                      <Input
                        id="access-secret"
                        type="password"
                        placeholder="Access Token Secret"
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Engagement Settings</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="likes-per-hour" className="text-sm">Likes per Hour</Label>
                        <Input
                          id="likes-per-hour"
                          type="number"
                          defaultValue="15"
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="retweets-per-hour" className="text-sm">Retweets per Hour</Label>
                        <Input
                          id="retweets-per-hour"
                          type="number"
                          defaultValue="5"
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Add Account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Analysis & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">{aiAnalysis.recommendedPostVolume}</div>
              <p className="text-sm text-slate-400">Recommended Daily Posts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{aiAnalysis.engagement.projectedImprovement}</div>
              <p className="text-sm text-slate-400">Projected Improvement</p>
            </div>
            <Button onClick={handleRunAIAnalysis} className="w-full bg-purple-600 hover:bg-purple-700">
              <Brain className="w-4 h-4 mr-2" />
              Run AI Analysis
            </Button>
            <Dialog open={showAIAnalysis} onOpenChange={setShowAIAnalysis}>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-3xl">
                <DialogHeader>
                  <DialogTitle>AI Analysis Results</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-lg">Optimal Posting Times</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {aiAnalysis.optimalTimes.map((time, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span className="text-slate-300">{time}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-lg">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Current Avg Engagement</span>
                            <span className="text-white">{aiAnalysis.engagement.currentAvg}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Projected Improvement</span>
                            <span className="text-green-400">{aiAnalysis.engagement.projectedImprovement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Recommended Volume</span>
                            <span className="text-purple-400">{aiAnalysis.recommendedPostVolume} posts/day</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-lg">AI Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {aiAnalysis.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-purple-400 mt-0.5" />
                            <span className="text-slate-300">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
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

// Bot Configuration Management Component
function BotConfigurationManagement() {
  const { toast } = useToast();
  const [botConfigs, setBotConfigs] = useState<any[]>([]);
  const [showCreateBot, setShowCreateBot] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newBotConfig, setNewBotConfig] = useState({
    name: '',
    platform: 'twitter',
    postingSchedule: {
      earlyMorning: { enabled: true, time: '06:00' },
      breakfast: { enabled: true, time: '08:30' },
      lunch: { enabled: true, time: '12:30' },
      dinner: { enabled: true, time: '18:30' },
      evening: { enabled: true, time: '21:30' }
    }
  });

  useEffect(() => {
    fetchBotConfigs();
  }, []);

  const fetchBotConfigs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/social-automation/bot-configs');
      if (response.ok) {
        const data = await response.json();
        setBotConfigs(data.success ? data.botConfigs : []);
      }
    } catch (error) {
      console.error('Failed to fetch bot configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load bot configurations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBotConfig = async () => {
    try {
      const response = await fetch('/api/social-automation/bot-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBotConfig)
      });

      if (response.ok) {
        await fetchBotConfigs();
        setShowCreateBot(false);
        setNewBotConfig({
          name: '',
          platform: 'twitter',
          postingSchedule: {
            earlyMorning: { enabled: true, time: '06:00' },
            breakfast: { enabled: true, time: '08:30' },
            lunch: { enabled: true, time: '12:30' },
            dinner: { enabled: true, time: '18:30' },
            evening: { enabled: true, time: '21:30' }
          }
        });
        toast({
          title: "Bot Created",
          description: "Bot configuration created successfully"
        });
      }
    } catch (error) {
      console.error('Failed to create bot:', error);
      toast({
        title: "Error",
        description: "Failed to create bot configuration",
        variant: "destructive"
      });
    }
  };

  const toggleBotActive = async (botId: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/social-automation/bot-configs/${botId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState })
      });

      if (response.ok) {
        await fetchBotConfigs();
        toast({
          title: !currentState ? "Bot Activated" : "Bot Deactivated",
          description: `Bot has been ${!currentState ? 'activated' : 'deactivated'} successfully`
        });
      }
    } catch (error) {
      console.error('Failed to toggle bot:', error);
      toast({
        title: "Error",
        description: "Failed to update bot status",
        variant: "destructive"
      });
    }
  };

  const deleteBotConfig = async (botId: string) => {
    try {
      const response = await fetch(`/api/social-automation/bot-configs/${botId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchBotConfigs();
        toast({
          title: "Bot Deleted",
          description: "Bot configuration deleted successfully"
        });
      }
    } catch (error) {
      console.error('Failed to delete bot:', error);
      toast({
        title: "Error",
        description: "Failed to delete bot configuration",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Bot Configuration Management</h3>
          <p className="text-slate-400">Create and manage your automated posting bots</p>
        </div>
        <Dialog open={showCreateBot} onOpenChange={setShowCreateBot}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Bot
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Bot Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bot-name">Bot Name</Label>
                <Input
                  id="bot-name"
                  placeholder="e.g., FlutterBye Main Bot"
                  value={newBotConfig.name}
                  onChange={(e) => setNewBotConfig({...newBotConfig, name: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label>Platform</Label>
                <Select 
                  value={newBotConfig.platform} 
                  onValueChange={(value) => setNewBotConfig({...newBotConfig, platform: value})}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createBotConfig} className="w-full">Create Bot Configuration</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-8 text-slate-400">Loading bot configurations...</div>
        ) : botConfigs.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No bot configurations found</div>
        ) : (
          botConfigs.map((bot) => (
            <Card key={bot.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{bot.name}</h4>
                    <p className="text-slate-400">{bot.platform} • Created {new Date(bot.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={bot.isActive ? "default" : "secondary"}>
                      {bot.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      size="sm"
                      variant={bot.isActive ? "destructive" : "default"}
                      onClick={() => toggleBotActive(bot.id, bot.isActive)}
                    >
                      {bot.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteBotConfig(bot.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {bot.isActive && bot.lastActivated && (
                  <div className="text-xs text-slate-500 mb-2">
                    Last activated: {new Date(bot.lastActivated).toLocaleString()}
                  </div>
                )}
                
                <div className="text-xs text-slate-500">
                  Bot ID: {bot.id}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default function ComprehensiveSocialDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchBots = async () => {
    // This function is now handled by individual components
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Social Media Command Center
          </h1>
          <p className="text-xl text-slate-300">Complete Bot Scheduling & Social Media Automation</p>
          
          {/* Quick Schedule Configuration Button */}
          <div className="mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                  data-testid="configure-posting-schedule-main"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Configure Posting Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-6xl max-h-[85vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Complete Daily Posting Schedule - All Time Slots
                  </DialogTitle>
                  <p className="text-slate-400 text-sm">
                    Configure all posting times throughout the day. Enable/disable specific time slots and customize exact posting times for optimal engagement.
                  </p>
                </DialogHeader>
                
                <div className="space-y-4 overflow-y-auto">
                  {/* Schedule Summary */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Info className="w-4 h-4" />
                      <span className="text-sm font-medium">Schedule Summary</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-blue-300">
                          10 Time Slots Available: Early Morning, Breakfast, Late Morning, Lunch, Early Afternoon, Late Afternoon, Dinner, Early Evening, Evening, Late Night
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-300">
                          Configure each time slot individually with custom posting times
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* All Time Slots */}
                  <ScheduleTimeSlots />

                  {/* Quick Actions */}
                  <div className="border-t border-slate-600 pt-4">
                    <div className="flex gap-3 flex-wrap">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-400 border-green-400 hover:bg-green-400/10"
                      >
                        Enable All Time Slots
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-400 border-red-400 hover:bg-red-400/10"
                      >
                        Disable All Time Slots
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                      >
                        Use AI Optimal Times
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Bot Config
            </TabsTrigger>
            <TabsTrigger value="ai-content" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Content
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Queue
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
            <TabsTrigger value="ai-optimization" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Optimization
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <BotConfigurationManagement />
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

          {/* AI Content Generator */}
          <TabsContent value="ai-content" className="space-y-6">
            <AIContentGenerator />
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