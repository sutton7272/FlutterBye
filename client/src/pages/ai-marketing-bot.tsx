import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Calendar, 
  BarChart3, 
  Settings, 
  Play, 
  Pause, 
  Zap,
  Twitter,
  Linkedin,
  Instagram,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface MarketingCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  platform: 'twitter' | 'linkedin' | 'instagram' | 'blog';
  nextPost: string;
  totalPosts: number;
  engagement: number;
  createdAt: string;
}

interface BotSettings {
  enabled: boolean;
  postFrequency: {
    twitter: number; // posts per day
    linkedin: number;
    instagram: number;
  };
  blogFrequency: number; // posts per week
  contentSources: string[];
  tone: 'professional' | 'casual' | 'technical' | 'friendly';
  autoPublish: boolean;
}

interface GeneratedContent {
  id: string;
  platform: string;
  content: string;
  hashtags: string[];
  scheduledFor: string;
  status: 'draft' | 'scheduled' | 'published';
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export default function AIMarketingBot() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch bot settings
  const { data: botSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/admin/marketing-bot/settings'],
    retry: false
  });

  // Fetch campaigns
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['/api/admin/marketing-bot/campaigns'],
    retry: false
  });

  // Fetch generated content
  const { data: generatedContent, isLoading: contentLoading } = useQuery({
    queryKey: ['/api/admin/marketing-bot/content'],
    retry: false
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<BotSettings>) => {
      return apiRequest("PUT", "/api/admin/marketing-bot/settings", settings);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "AI Marketing Bot settings have been saved successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketing-bot/settings'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update bot settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: async (params: { platform: string; count: number }) => {
      return apiRequest("POST", "/api/admin/marketing-bot/generate", params);
    },
    onSuccess: () => {
      toast({
        title: "Content Generated",
        description: "New content has been generated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketing-bot/content'] });
    }
  });

  // Publish content mutation
  const publishContentMutation = useMutation({
    mutationFn: async (contentId: string) => {
      return apiRequest("POST", `/api/admin/marketing-bot/content/${contentId}/publish`);
    },
    onSuccess: () => {
      toast({
        title: "Content Published",
        description: "Content has been published successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketing-bot/content'] });
    }
  });

  const handleToggleBot = (enabled: boolean) => {
    updateSettingsMutation.mutate({ enabled });
  };

  const handleGenerateContent = (platform: string) => {
    generateContentMutation.mutate({ platform, count: 5 });
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AI Marketing Bot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
            <Bot className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">AI Marketing Bot</h1>
            <p className="text-muted-foreground">
              Automated social media management and SEO content generation
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="bot-toggle">Bot Status:</Label>
            <Switch
              id="bot-toggle"
              checked={(botSettings as BotSettings)?.enabled || false}
              onCheckedChange={handleToggleBot}
              disabled={updateSettingsMutation.isPending}
            />
            <Badge variant={(botSettings as BotSettings)?.enabled ? "default" : "secondary"}>
              {(botSettings as BotSettings)?.enabled ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="content">Content Library</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Status Cards */}
            <Card className="electric-frame">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts This Week</CardTitle>
                <Twitter className="w-4 h-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>

            <Card className="electric-frame">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.7%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last week</p>
              </CardContent>
            </Card>

            <Card className="electric-frame">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                <FileText className="w-4 h-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="electric-frame">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Post</CardTitle>
                <Clock className="w-4 h-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2h</div>
                <p className="text-xs text-muted-foreground">Twitter post scheduled</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Generate and manage content with one click</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => handleGenerateContent('twitter')}
                  disabled={generateContentMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  Generate Tweets
                  {generateContentMutation.isPending && <RefreshCw className="w-4 h-4 animate-spin" />}
                </Button>
                
                <Button
                  onClick={() => handleGenerateContent('linkedin')}
                  disabled={generateContentMutation.isPending}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  Generate LinkedIn Posts
                </Button>
                
                <Button
                  onClick={() => handleGenerateContent('instagram')}
                  disabled={generateContentMutation.isPending}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  Generate Instagram Posts
                </Button>
                
                <Button
                  onClick={() => handleGenerateContent('blog')}
                  disabled={generateContentMutation.isPending}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generate Blog Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Blog post "The Future of Token Creation" published</span>
                  <Badge variant="secondary">2 hours ago</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">5 Twitter posts generated and scheduled</span>
                  <Badge variant="secondary">4 hours ago</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">LinkedIn campaign started for Flutterbye launch</span>
                  <Badge variant="secondary">6 hours ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Library Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Content Library</h2>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contentLoading ? (
              <div className="col-span-2 text-center py-8">
                <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading content...</p>
              </div>
            ) : (
              // Mock content for demonstration
              [
                {
                  id: '1',
                  platform: 'twitter',
                  content: '🚀 The future of Web3 communication is here! Flutterbye transforms your messages into valuable tokens on Solana. Ready to tokenize your words? #Web3 #Solana #Flutterbye',
                  hashtags: ['#Web3', '#Solana', '#Flutterbye'],
                  scheduledFor: '2024-01-15T10:00:00Z',
                  status: 'scheduled' as const
                },
                {
                  id: '2',
                  platform: 'linkedin',
                  content: 'Exciting developments in blockchain communication! Our latest platform enables users to create tokenized messages, attach real value, and distribute across wallets. The intersection of communication and DeFi has never been more promising.',
                  hashtags: ['#Blockchain', '#DeFi', '#Communication'],
                  scheduledFor: '2024-01-15T14:00:00Z',
                  status: 'draft' as const
                },
                {
                  id: '3',
                  platform: 'twitter',
                  content: '💎 Just launched our revolutionary token creation platform! Create, distribute, and manage SPL tokens in under 60 seconds. The future is here! #TokenCreation #Solana',
                  hashtags: ['#TokenCreation', '#Solana'],
                  scheduledFor: '2024-01-14T16:00:00Z',
                  status: 'published' as const,
                  engagement: { likes: 45, shares: 12, comments: 8 }
                }
              ].map((content) => (
                <Card key={content.id} className="electric-frame">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {content.platform === 'twitter' && <Twitter className="w-4 h-4 text-blue-400" />}
                        {content.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-600" />}
                        {content.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                        <Badge variant={content.status === 'published' ? 'default' : content.status === 'scheduled' ? 'secondary' : 'outline'}>
                          {content.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(content.scheduledFor).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{content.content}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {content.hashtags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      {content.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => publishContentMutation.mutate(content.id)}
                          disabled={publishContentMutation.isPending}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
              <CardDescription>Configure how the AI marketing bot operates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Content Tone</Label>
                  <Select defaultValue="professional">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Auto-Publish</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-publish" defaultChecked />
                    <Label htmlFor="auto-publish">Enable automatic publishing</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Posting Frequency</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Twitter (posts/day)</Label>
                    <Input type="number" defaultValue="3" min="0" max="10" />
                  </div>
                  <div>
                    <Label className="text-sm">LinkedIn (posts/day)</Label>
                    <Input type="number" defaultValue="1" min="0" max="5" />
                  </div>
                  <div>
                    <Label className="text-sm">Blog (posts/week)</Label>
                    <Input type="number" defaultValue="1" min="0" max="3" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Content Sources</Label>
                <Textarea
                  placeholder="Enter URLs or topics to source content from..."
                  className="min-h-[100px]"
                  defaultValue="https://flutterbye.com
Solana blockchain updates
Token creation tutorials
Web3 communication trends"
                />
              </div>

              <Button
                onClick={() => updateSettingsMutation.mutate({})}
                disabled={updateSettingsMutation.isPending}
                className="w-full"
              >
                {updateSettingsMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Track your AI-generated content performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed analytics and performance metrics will be available once content generation is active.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle>Marketing Campaigns</CardTitle>
              <CardDescription>Manage automated marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Campaigns</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first automated marketing campaign to get started.
                </p>
                <Button>
                  <Zap className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}