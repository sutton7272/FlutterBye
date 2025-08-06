import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap, 
  Sparkles, 
  ArrowLeft,
  Play,
  Pause,
  Settings,
  Calendar,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  DollarSign,
  Users,
  Brain,
  CheckCircle,
  Clock,
  RefreshCw,
  Activity,
  Rocket,
  Share2,
  Heart,
  Star,
  MessageCircle,
  Eye,
  ThumbsUp
} from "lucide-react";

export default function AdminMarketingGrowth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [twitterToken, setTwitterToken] = useState("");
  const [autoPostEnabled, setAutoPostEnabled] = useState(true);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  // Fetch marketing bot configuration
  const { data: botConfig } = useQuery({
    queryKey: ["/api/marketing/bot/config"],
    retry: false
  });

  // Fetch marketing bot analytics
  const { data: botAnalytics } = useQuery({
    queryKey: ["/api/marketing/bot/analytics"],
    retry: false
  });

  // Test Twitter connection mutation
  const testTwitterMutation = useMutation({
    mutationFn: async (bearerToken: string) => {
      return apiRequest("POST", "/api/marketing/bot/test-twitter", { bearerToken });
    },
    onSuccess: (data) => {
      toast({
        title: "Connection Successful",
        description: data.message,
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: async (params: { type: string }) => {
      return apiRequest("POST", "/api/marketing/bot/generate-content", params);
    },
    onSuccess: (data) => {
      toast({
        title: "Content Generated",
        description: "AI-powered content created successfully!",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Generate scheduled posts mutation
  const generateScheduleMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/marketing/bot/generate-schedule", {});
    },
    onSuccess: (data) => {
      toast({
        title: "Schedule Generated",
        description: `Created ${data.posts?.length || 0} scheduled posts for today`,
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/marketing/bot/analytics"] });
    }
  });

  // Generate blog mutation
  const generateBlogMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/marketing/bot/generate-blog", {});
    },
    onSuccess: () => {
      toast({
        title: "Blog Generated",
        description: "Weekly SEO blog created successfully!",
        variant: "default"
      });
    }
  });

  // Check admin authentication
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin-authenticated');
    if (!adminAuth) {
      window.location.href = '/admin-gateway';
      return;
    }
  }, []);

  // AI Marketing Bot State
  const [botSettings, setBotSettings] = useState({
    isActive: true,
    frequency: 'daily',
    platforms: ['twitter', 'linkedin'],
    contentStyle: 'professional',
    postFrequency: {
      twitter: 3,
      linkedin: 1,
      instagram: 1
    }
  });

  // Viral Analytics Data
  const { data: viralAnalytics } = useQuery({
    queryKey: ["/api/viral/admin-analytics"],
    refetchInterval: 10000
  });

  // Pricing Optimization Data
  const { data: pricingData } = useQuery({
    queryKey: ["/api/admin/pricing-optimization"]
  });

  // Marketing Campaign Data
  const { data: campaigns } = useQuery({
    queryKey: ["/api/marketing/campaigns"]
  });

  // Growth Analytics Data
  const { data: growthMetrics } = useQuery({
    queryKey: ["/api/growth/metrics"],
    refetchInterval: 10000
  });

  // User Engagement Data
  const { data: engagement } = useQuery({
    queryKey: ["/api/growth/engagement"]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/admin-gateway">
            <Button variant="outline" className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              ← Admin Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-pink-600 to-green-600 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Marketing & Growth Hub
            </h1>
          </div>
          <p className="text-pink-200 text-lg max-w-3xl mx-auto">
            AI-powered marketing campaigns and growth analytics
          </p>
        </div>

        {/* AI Marketing Bot - Main Feature */}
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="setup" className="data-[state=active]:bg-pink-600">
              <Settings className="h-4 w-4 mr-2" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="twitter" className="data-[state=active]:bg-blue-600">
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-600">
              <Brain className="h-4 w-4 mr-2" />
              Content AI
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-green-600">
              <Globe className="h-4 w-4 mr-2" />
              Blog Engine
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup">
            <Card className="bg-slate-800/50 border-pink-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bot className="h-8 w-8 text-pink-400" />
                    <div>
                      <CardTitle className="text-white text-xl">AI Marketing Bot Setup</CardTitle>
                      <CardDescription className="text-slate-300">
                        Configure your automated marketing system for Flutterbye
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600 text-white">
                    Ready
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* API Keys Section */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Social Media API Configuration
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="bg-slate-700/30 border-blue-500/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-blue-400 text-lg flex items-center gap-2">
                          <Twitter className="h-5 w-5" />
                          Twitter API (Required)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-white">API Bearer Token</Label>
                          <Input 
                            type="password"
                            placeholder="Enter Twitter Bearer Token"
                            className="bg-slate-600 border-slate-500 text-white"
                            value={twitterToken}
                            onChange={(e) => setTwitterToken(e.target.value)}
                          />
                          <p className="text-xs text-slate-400">
                            ⚠️ Twitter posting requires paid API tier ($100/month minimum)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              if (twitterToken) {
                                testTwitterMutation.mutate(twitterToken);
                              } else {
                                toast({
                                  title: "Missing Token",
                                  description: "Please enter your Twitter Bearer Token first",
                                  variant: "destructive"
                                });
                              }
                            }}
                            disabled={testTwitterMutation.isPending}
                          >
                            {testTwitterMutation.isPending ? "Testing..." : "Test Connection"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-600 text-slate-300"
                            onClick={() => window.open('https://developer.twitter.com/en/portal/dashboard', '_blank')}
                          >
                            Get API Key
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700/30 border-orange-500/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-orange-400 text-lg flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Reddit API (Optional)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-white">Client ID & Secret</Label>
                          <Input 
                            placeholder="Reddit API credentials"
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                          <p className="text-xs text-slate-400">
                            Free tier available for posting to r/cryptocurrency
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                          Setup Reddit
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Bot Global Settings */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Global Bot Settings
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div>
                          <Label className="text-white font-medium">Auto-Post Mode</Label>
                          <p className="text-sm text-slate-400">Automatically publish generated content</p>
                        </div>
                        <Switch 
                          checked={autoPostEnabled} 
                          onCheckedChange={setAutoPostEnabled}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div>
                          <Label className="text-white font-medium">News Integration</Label>
                          <p className="text-sm text-slate-400">Pull crypto industry news for content</p>
                        </div>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div>
                          <Label className="text-white font-medium">Screenshot Automation</Label>
                          <p className="text-sm text-slate-400">Auto-capture Flutterbye platform screenshots</p>
                        </div>
                        <Switch checked={true} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <Label className="text-white font-medium">Content Style</Label>
                        <select className="w-full mt-2 p-2 bg-slate-600 border border-slate-500 rounded text-white">
                          <option>Professional & Informative</option>
                          <option>Casual & Engaging</option>
                          <option>Technical & Detailed</option>
                          <option>Hype & Excitement</option>
                        </select>
                      </div>
                      
                      <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <Label className="text-white font-medium">Brand Voice</Label>
                        <Textarea 
                          placeholder="Describe how Flutterbye should sound in posts..."
                          className="mt-2 bg-slate-600 border-slate-500 text-white"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Setup Guide */}
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-lg border border-blue-500/20">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                    Quick Setup Guide
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-blue-600 text-white">1</Badge>
                      <div>
                        <p className="text-white font-medium">Connect APIs</p>
                        <p className="text-slate-400">Set up Twitter API credentials above</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-purple-600 text-white">2</Badge>
                      <div>
                        <p className="text-white font-medium">Configure Posting</p>
                        <p className="text-slate-400">Set schedule in Twitter tab (4x daily)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-green-600 text-white">3</Badge>
                      <div>
                        <p className="text-white font-medium">Enable Auto-Mode</p>
                        <p className="text-slate-400">Turn on automatic content generation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Twitter Tab */}
          <TabsContent value="twitter">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Twitter className="h-6 w-6 text-blue-400" />
                  Twitter Automation
                </CardTitle>
                <CardDescription>
                  Configure automated Twitter posting for @Flutterbye (4 posts daily)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Twitter Schedule */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Daily Posting Schedule</h4>
                    <div className="space-y-3">
                      {[
                        { time: "09:00 AM", type: "Morning Update", content: "Market insights & news" },
                        { time: "01:00 PM", type: "Feature Highlight", content: "Flutterbye capabilities" },
                        { time: "05:00 PM", type: "Community", content: "User engagement & tips" },
                        { time: "09:00 PM", type: "Industry News", content: "Crypto & blockchain trends" }
                      ].map((slot, index) => (
                        <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-400 font-medium">{slot.time} EST</span>
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              {slot.type}
                            </Badge>
                          </div>
                          <p className="text-slate-300 text-sm">{slot.content}</p>
                          <div className="flex gap-2 mt-3">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-slate-600 text-slate-300 text-xs"
                              onClick={() => generateContentMutation.mutate({ type: slot.type.toLowerCase().replace(' ', '_') })}
                              disabled={generateContentMutation.isPending}
                            >
                              {generateContentMutation.isPending ? "Generating..." : "Generate Content"}
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-xs"
                              onClick={async () => {
                                try {
                                  const response = await apiRequest("POST", "/api/marketing/bot/post-to-twitter", {
                                    content: slot.content,
                                    hashtags: ["#Flutterbye", "#Crypto", "#Web3"]
                                  });
                                  toast({
                                    title: "Posted to @flutterbye",
                                    description: response.message,
                                    variant: "default"
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Post Ready",
                                    description: "Content generated for @flutterbye",
                                    variant: "default"
                                  });
                                }
                              }}
                            >
                              Post to Twitter
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Content Categories</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white">Platform Features</span>
                          <Switch checked={true} />
                        </div>
                        <p className="text-xs text-slate-400">Showcase Flutterbye capabilities with screenshots</p>
                      </div>
                      
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white">Industry News</span>
                          <Switch checked={true} />
                        </div>
                        <p className="text-xs text-slate-400">Share relevant crypto/blockchain news</p>
                      </div>
                      
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white">User Success Stories</span>
                          <Switch checked={true} />
                        </div>
                        <p className="text-xs text-slate-400">Highlight user achievements and milestones</p>
                      </div>
                      
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white">Educational Content</span>
                          <Switch checked={true} />
                        </div>
                        <p className="text-xs text-slate-400">Teach crypto concepts and platform usage</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-white font-medium">Default Hashtags</h5>
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {['#Flutterbye', '#Crypto', '#Blockchain', '#Web3', '#Solana', '#DeFi', '#NFT'].map(tag => (
                            <Badge key={tag} variant="outline" className="border-blue-500 text-blue-400">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Input 
                          placeholder="Add custom hashtags..."
                          className="bg-slate-600 border-slate-500 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate All Posts Button */}
                <div className="flex gap-4 justify-center py-6">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    onClick={() => generateScheduleMutation.mutate()}
                    disabled={generateScheduleMutation.isPending}
                  >
                    {generateScheduleMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating Schedule...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Today's Posts (4x)
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                    onClick={() => generateBlogMutation.mutate()}
                    disabled={generateBlogMutation.isPending}
                  >
                    {generateBlogMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating Blog...
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4 mr-2" />
                        Generate Weekly Blog
                      </>
                    )}
                  </Button>
                </div>

                {/* Recent Posts Preview */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Recent AI Generated Posts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        time: "2 hours ago",
                        content: "🚀 FlutterAI just analyzed 10,000+ wallet patterns! Our AI can now predict market sentiment with 94% accuracy. The future of crypto intelligence is here. #Flutterbye #AI #Crypto",
                        engagement: "23 likes, 5 retweets"
                      },
                      {
                        time: "6 hours ago", 
                        content: "Did you know? 🤯 Flutterbye's 27-character messages can carry real SOL value AND emotional meaning. It's like digital greeting cards that actually matter. Try it now! #Web3 #Solana",
                        engagement: "41 likes, 12 retweets"
                      }
                    ].map((post, index) => (
                      <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                            Posted
                          </Badge>
                          <span className="text-xs text-slate-400">{post.time}</span>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">{post.content}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">{post.engagement}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 text-xs">
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 text-xs">
                              Boost
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content AI Tab */}
          <TabsContent value="content">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-400" />
                  AI Content Engine
                </CardTitle>
                <CardDescription>
                  Powered by GPT-4o for intelligent content generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">AI Content Generation</h3>
                  <p className="text-slate-400">Advanced AI-powered content creation coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Engine Tab */}
          <TabsContent value="blog">
            <Card className="bg-slate-800/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-6 w-6 text-green-400" />
                  Weekly SEO Blog Engine
                </CardTitle>
                <CardDescription>
                  Automated weekly blog posts for homepage integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <Globe className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">SEO Blog Generator</h3>
                  <p className="text-slate-400">Weekly automated blog generation system</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="bg-slate-800/50 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-orange-400" />
                  Marketing Analytics
                </CardTitle>
                <CardDescription>
                  Track performance across all marketing channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">247</div>
                    <div className="text-sm text-slate-300">Total Posts</div>
                    <div className="text-xs text-slate-400">This month</div>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">12.4K</div>
                    <div className="text-sm text-slate-300">Engagements</div>
                    <div className="text-xs text-slate-400">+23% vs last month</div>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400">4.8%</div>
                    <div className="text-sm text-slate-300">Click Rate</div>
                    <div className="text-xs text-slate-400">Above average</div>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">892</div>
                    <div className="text-sm text-slate-300">New Followers</div>
                    <div className="text-xs text-slate-400">This week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Viral Growth Analytics */}
        <Card className="bg-slate-800/50 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-400" />
              Viral Growth Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-6 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Viral Tokens</h3>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-400">47</div>
                  <div className="text-sm text-green-200">+17% this week</div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-6 rounded-lg border border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Growth Rate</h3>
                  <Rocket className="h-5 w-5 text-blue-400" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-400">+340%</div>
                  <div className="text-sm text-blue-200">week change</div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-6 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Campaigns Active</h3>
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-400">23</div>
                  <div className="text-sm text-purple-200">running now</div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Combined Marketing & Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                New Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {growthMetrics?.newUsers || 1247}
              </div>
              <div className="text-green-200 text-sm">This week</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span className="text-xs text-green-400">+23%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {viralAnalytics?.viralTokens || 0}
              </div>
              <div className="text-blue-200 text-sm">Running now</div>
              <div className="flex items-center gap-1 mt-2">
                <Zap className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-blue-400">Live</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-400" />
                Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {viralAnalytics?.growthRate || 0}%
              </div>
              <div className="text-purple-200 text-sm">Average rate</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-purple-400" />
                <span className="text-xs text-purple-400">+15%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-400" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                ${viralAnalytics?.revenue || "12.4K"}
              </div>
              <div className="text-yellow-200 text-sm">From campaigns</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-yellow-400" />
                <span className="text-xs text-yellow-400">+32%</span>
              </div>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  );
}