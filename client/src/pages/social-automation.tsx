import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { LoadingSpinner } from "@/components/loading-spinner";
import { 
  Bot, 
  Twitter, 
  Camera, 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  Heart, 
  Share, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  Image as ImageIcon,
  Calendar
} from "lucide-react";

interface SocialPost {
  id: string;
  platform: 'twitter' | 'linkedin' | 'instagram';
  content: string;
  mediaUrls?: string[];
  scheduledAt?: Date;
  postedAt?: Date;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  metrics?: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
}

export default function SocialAutomation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // States
  const [isInitialized, setIsInitialized] = useState(false);
  const [automationRunning, setAutomationRunning] = useState(false);
  const [intervalHours, setIntervalHours] = useState(4);
  const [contentType, setContentType] = useState('feature');
  const [screenshotPage, setScreenshotPage] = useState('/dashboard');
  const [screenshotSelector, setScreenshotSelector] = useState('');
  const [previewContent, setPreviewContent] = useState('');

  // Initialize bot
  const initializeBot = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/social/initialize', 'POST', {
        baseUrl: window.location.origin
      });
    },
    onSuccess: () => {
      setIsInitialized(true);
      toast({
        title: "Bot Initialized",
        description: "Social media bot is ready to use",
      });
    },
    onError: (error) => {
      toast({
        title: "Initialization Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create manual post
  const createPost = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/social/post', 'POST', data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/social/dashboard'] });
      toast({
        title: "Post Created",
        description: `Successfully ${data.post.status === 'posted' ? 'posted to' : 'created'} social media`,
      });
    },
    onError: (error) => {
      toast({
        title: "Post Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Start automation
  const startAutomation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/social/start-automation', 'POST', {
        intervalHours
      });
    },
    onSuccess: () => {
      setAutomationRunning(true);
      toast({
        title: "Automation Started",
        description: `Bot will post every ${intervalHours} hours`,
      });
    }
  });

  // Stop automation
  const stopAutomation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/social/stop-automation', 'POST');
    },
    onSuccess: () => {
      setAutomationRunning(false);
      toast({
        title: "Automation Stopped",
        description: "Social media automation has been paused",
      });
    }
  });

  // Generate preview
  const generatePreview = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/social/preview', 'POST', data);
    },
    onSuccess: (data) => {
      setPreviewContent(data.preview.content);
    }
  });

  // Capture screenshot
  const captureScreenshot = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/social/screenshot', 'POST', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Screenshot Captured",
        description: "Screenshot ready for social media post",
      });
    }
  });

  // Fetch dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['/api/social/dashboard'],
    enabled: isInitialized
  });

  // Fetch posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['/api/social/posts'],
    enabled: isInitialized
  });

  // Initialize on mount
  useEffect(() => {
    if (!isInitialized && !initializeBot.isPending) {
      initializeBot.mutate();
    }
  }, []);

  const handleCreatePost = () => {
    createPost.mutate({
      contentType,
      screenshotPage: screenshotPage || undefined,
      screenshotSelector: screenshotSelector || undefined
    });
  };

  const handlePreview = () => {
    generatePreview.mutate({
      contentType,
      platform: 'twitter'
    });
  };

  const handleScreenshot = () => {
    captureScreenshot.mutate({
      page: screenshotPage || '/',
      selector: screenshotSelector || undefined
    });
  };

  if (!isInitialized && initializeBot.isPending) {
    return (
      <div className="min-h-screen pt-16 pb-8 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Initializing Social Media Bot</h2>
          <p className="text-muted-foreground">Setting up automation system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gradient">
            Flutterbye Social Media Bot
          </h1>
          <p className="text-xl text-muted-foreground">
            Automated content creation and posting for Twitter, LinkedIn, and Instagram
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Create Post
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                      <p className="text-3xl font-bold text-electric-blue">
                        {dashboardData?.dashboard?.totalPosts || 0}
                      </p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-electric-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Successful</p>
                      <p className="text-3xl font-bold text-green-500">
                        {dashboardData?.dashboard?.successfulPosts || 0}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                      <p className="text-3xl font-bold text-purple-500">
                        {dashboardData?.dashboard?.totalEngagement || 0}
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <p className="text-lg font-semibold">
                        <Badge className={automationRunning ? "bg-green-600" : "bg-gray-600"}>
                          {automationRunning ? "Running" : "Stopped"}
                        </Badge>
                      </p>
                    </div>
                    <Bot className={`w-8 h-8 ${automationRunning ? 'text-green-500' : 'text-gray-500'}`} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Posts */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.dashboard?.recentPosts?.map((post: any) => (
                    <div key={post.id} className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-gray-300 mb-2">{post.content.substring(0, 100)}...</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Twitter className="w-3 h-3" />
                            {post.platform}
                          </span>
                          {post.postedAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(post.postedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={
                        post.status === 'posted' ? 'default' : 
                        post.status === 'failed' ? 'destructive' : 'secondary'
                      }>
                        {post.status}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-8">
                      No posts yet. Create your first automated post!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Create Social Media Post</CardTitle>
                  <CardDescription>
                    Generate and post content automatically to your social media accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger data-testid="select-content-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feature">Feature Highlight</SelectItem>
                        <SelectItem value="stats">Platform Statistics</SelectItem>
                        <SelectItem value="engagement">Community Engagement</SelectItem>
                        <SelectItem value="announcement">Major Announcement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Screenshot Page</Label>
                    <Select value={screenshotPage} onValueChange={setScreenshotPage}>
                      <SelectTrigger data-testid="select-screenshot-page">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/">Home Page</SelectItem>
                        <SelectItem value="/dashboard">Dashboard</SelectItem>
                        <SelectItem value="/create">Create Tokens</SelectItem>
                        <SelectItem value="/ai-intelligence">AI Intelligence</SelectItem>
                        <SelectItem value="/admin">Admin Panel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>CSS Selector (Optional)</Label>
                    <Input
                      data-testid="input-css-selector"
                      value={screenshotSelector}
                      onChange={(e) => setScreenshotSelector(e.target.value)}
                      placeholder=".main-content, .premium-card"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to capture full page
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handlePreview}
                      disabled={generatePreview.isPending}
                      variant="outline"
                      className="flex-1"
                      data-testid="button-preview"
                    >
                      {generatePreview.isPending ? <LoadingSpinner className="mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      Preview
                    </Button>
                    <Button 
                      onClick={handleScreenshot}
                      disabled={captureScreenshot.isPending}
                      variant="outline"
                      className="flex-1"
                      data-testid="button-screenshot"
                    >
                      {captureScreenshot.isPending ? <LoadingSpinner className="mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                      Screenshot
                    </Button>
                  </div>

                  <Button 
                    onClick={handleCreatePost}
                    disabled={createPost.isPending || !isInitialized}
                    className="w-full bg-gradient-to-r from-electric-blue to-circuit-teal"
                    data-testid="button-create-post"
                  >
                    {createPost.isPending ? <LoadingSpinner className="mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                    Create & Post
                  </Button>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Content Preview</CardTitle>
                  <CardDescription>
                    Preview generated content before posting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {previewContent ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg border">
                        <p className="whitespace-pre-wrap text-sm">{previewContent}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Character count: {previewContent.length}/280</span>
                        <Badge variant={previewContent.length > 280 ? "destructive" : "secondary"}>
                          Twitter
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Preview" to generate content preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Automation Settings
                </CardTitle>
                <CardDescription>
                  Configure automated posting schedule and content preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Auto-posting Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {automationRunning ? `Posts every ${intervalHours} hours` : 'Automation is paused'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={automationRunning ? "bg-green-600" : "bg-gray-600"}>
                      {automationRunning ? "Active" : "Inactive"}
                    </Badge>
                    {automationRunning ? (
                      <Button 
                        onClick={() => stopAutomation.mutate()}
                        disabled={stopAutomation.isPending}
                        variant="outline"
                        size="sm"
                        data-testid="button-stop-automation"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => startAutomation.mutate()}
                        disabled={startAutomation.isPending}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        data-testid="button-start-automation"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Posting Interval (Hours)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      value={intervalHours}
                      onChange={(e) => setIntervalHours(parseInt(e.target.value) || 4)}
                      className="w-20"
                      data-testid="input-interval-hours"
                    />
                    <span className="text-sm text-muted-foreground">hours between posts</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Content Preferences</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'feature', label: 'Feature Highlights', icon: Target },
                      { id: 'stats', label: 'Platform Stats', icon: BarChart3 },
                      { id: 'engagement', label: 'Community Posts', icon: Heart },
                      { id: 'announcement', label: 'Announcements', icon: AlertCircle }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center space-x-2 p-3 bg-slate-800/50 rounded-lg">
                        <item.icon className="w-4 h-4 text-electric-blue" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Social Media Configuration</CardTitle>
                <CardDescription>
                  Connect your social media accounts and configure posting preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Connected Accounts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Twitter className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="font-medium">Twitter</p>
                          <p className="text-xs text-muted-foreground">@flutterbye_ai</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-blue-600 rounded"></div>
                        <div>
                          <p className="font-medium">LinkedIn</p>
                          <p className="text-xs text-muted-foreground">Coming Soon</p>
                        </div>
                      </div>
                      <Badge variant="outline">Soon</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="font-semibold text-blue-300 mb-2">API Configuration Required</h4>
                  <p className="text-sm text-blue-200 mb-3">
                    To enable Twitter posting, configure your API keys in environment variables:
                  </p>
                  <ul className="text-xs text-blue-200 space-y-1 list-disc list-inside">
                    <li>TWITTER_API_KEY</li>
                    <li>TWITTER_API_SECRET</li>
                    <li>TWITTER_ACCESS_TOKEN</li>
                    <li>TWITTER_ACCESS_TOKEN_SECRET</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}