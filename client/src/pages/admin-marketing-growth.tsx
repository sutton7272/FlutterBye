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
        <Card className="bg-slate-800/50 border-pink-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="h-8 w-8 text-pink-400" />
                <div>
                  <CardTitle className="text-white text-xl">AI Marketing Bot</CardTitle>
                  <CardDescription className="text-slate-300">
                    Automated marketing campaign generation and content creation
                  </CardDescription>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600 text-white">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bot Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Bot Configuration</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <Label className="text-white">Campaign Frequency</Label>
                      <p className="text-sm text-slate-400">Daily</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <Label className="text-white">Target Audience</Label>
                      <p className="text-sm text-slate-400">All Users</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <Label className="text-white">Auto-publish campaigns</Label>
                      <p className="text-sm text-slate-400">Enabled</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold">Performance Overview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">12</div>
                    <div className="text-sm text-slate-300">Active Campaigns</div>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">347</div>
                    <div className="text-sm text-slate-300">Content Generated</div>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">24.5%</div>
                    <div className="text-sm text-slate-300">Engagement Rate</div>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">8.2%</div>
                    <div className="text-sm text-slate-300">Conversion Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bot Actions */}
            <div className="flex gap-4">
              <Button className="bg-pink-600 hover:bg-pink-700 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Campaign
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configure Bot
              </Button>
            </div>
          </CardContent>
        </Card>

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

        {/* Additional Features Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-blue-600">
              <Target className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-600">
              <Brain className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-orange-600">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <Card className="bg-slate-800/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white">Advanced Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Growth & Marketing Analytics</h3>
                  <p className="text-slate-400">Comprehensive insights into viral growth and marketing performance</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Campaign Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Marketing Campaigns</h3>
                  <p className="text-slate-400">Create, manage, and optimize marketing campaigns</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">AI Content Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Content Creator</h3>
                  <p className="text-slate-400">AI-powered content generation for marketing campaigns</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card className="bg-slate-800/50 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white">Pricing Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <DollarSign className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Smart Pricing</h3>
                  <p className="text-slate-400">AI-driven pricing optimization and revenue analytics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}