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
  RefreshCw
} from "lucide-react";

export default function AdminMarketing() {
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

  // AI Content Generation
  const generateContentMutation = useMutation({
    mutationFn: async (data: { type: string; topic: string; platform: string }) => {
      return await apiRequest('POST', '/api/ai/generate-marketing-content', data);
    },
    onSuccess: () => {
      toast({
        title: "Content Generated",
        description: "AI marketing content created successfully",
      });
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
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
            <div className="p-3 bg-blue-600 rounded-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Marketing Intelligence Hub
            </h1>
          </div>
          <p className="text-blue-200 text-lg max-w-3xl mx-auto">
            AI-powered marketing automation, viral analytics, and campaign optimization
          </p>
        </div>

        {/* Marketing Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Viral Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {viralAnalytics?.viralTokens || 0}
              </div>
              <div className="text-green-200 text-sm">Active campaigns</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Growth Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {viralAnalytics?.growthRate || 0}%
              </div>
              <div className="text-blue-200 text-sm">This month</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Reach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {viralAnalytics?.totalReach?.toLocaleString() || "0"}
              </div>
              <div className="text-purple-200 text-sm">Total users</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-400" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                ${viralAnalytics?.revenue || "0"}
              </div>
              <div className="text-yellow-200 text-sm">From campaigns</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Marketing Tabs */}
        <Tabs defaultValue="ai-bot" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="ai-bot" className="data-[state=active]:bg-blue-600">
              <Bot className="h-4 w-4 mr-2" />
              AI Marketing Bot
            </TabsTrigger>
            <TabsTrigger value="viral" className="data-[state=active]:bg-green-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              Viral Analytics
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-purple-600">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing Optimization
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-orange-600">
              <Target className="h-4 w-4 mr-2" />
              Campaign Management
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-pink-600">
              <Sparkles className="h-4 w-4 mr-2" />
              Content Generation
            </TabsTrigger>
          </TabsList>

          {/* AI Marketing Bot Tab */}
          <TabsContent value="ai-bot">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="h-6 w-6 text-blue-400" />
                  AI Marketing Bot Control Center
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Automated marketing campaigns with AI-generated content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bot Status */}
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${botSettings.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <div>
                      <h3 className="text-white font-semibold">Marketing Bot Status</h3>
                      <p className="text-sm text-slate-400">
                        {botSettings.isActive ? 'Active - Generating content automatically' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={botSettings.isActive}
                    onCheckedChange={(checked) => setBotSettings({...botSettings, isActive: checked})}
                  />
                </div>

                {/* Platform Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Platform Configuration</h4>
                    <div className="space-y-3">
                      {[
                        { id: 'twitter', name: 'Twitter', icon: Twitter },
                        { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
                        { id: 'instagram', name: 'Instagram', icon: Instagram }
                      ].map(({ id, name, icon: Icon }) => (
                        <div key={id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-blue-400" />
                            <span className="text-white">{name}</span>
                          </div>
                          <Switch
                            checked={botSettings.platforms.includes(id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setBotSettings({
                                  ...botSettings,
                                  platforms: [...botSettings.platforms, id]
                                });
                              } else {
                                setBotSettings({
                                  ...botSettings,
                                  platforms: botSettings.platforms.filter(p => p !== id)
                                });
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Posting Frequency</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-blue-300">Twitter/day</Label>
                        <Input 
                          type="number" 
                          value={botSettings.postFrequency.twitter}
                          className="bg-slate-700 border-blue-500/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-blue-300">LinkedIn/day</Label>
                        <Input 
                          type="number" 
                          value={botSettings.postFrequency.linkedin}
                          className="bg-slate-700 border-blue-500/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-blue-300">Instagram/day</Label>
                        <Input 
                          type="number" 
                          value={botSettings.postFrequency.instagram}
                          className="bg-slate-700 border-blue-500/20 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Viral Analytics Tab */}
          <TabsContent value="viral">
            <Card className="bg-slate-800/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                  Viral Growth Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Viral Analytics Dashboard</h3>
                  <p className="text-slate-400 mb-6">Track viral performance and growth metrics</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{viralAnalytics?.viralTokens || 0}</div>
                      <div className="text-sm text-slate-300">Viral Tokens</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{viralAnalytics?.growthRate || 0}%</div>
                      <div className="text-sm text-slate-300">Growth Rate</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">{viralAnalytics?.engagement || 0}%</div>
                      <div className="text-sm text-slate-300">Engagement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Optimization Tab */}
          <TabsContent value="pricing">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-purple-400" />
                  AI Pricing Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <DollarSign className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Smart Pricing Engine</h3>
                  <p className="text-slate-400">AI-powered dynamic pricing optimization</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaign Management Tab */}
          <TabsContent value="campaigns">
            <Card className="bg-slate-800/50 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-400" />
                  Campaign Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Marketing Campaigns</h3>
                  <p className="text-slate-400">Manage and optimize marketing campaigns</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Generation Tab */}
          <TabsContent value="content">
            <Card className="bg-slate-800/50 border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-pink-400" />
                  AI Content Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Brain className="h-16 w-16 text-pink-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">AI Content Creator</h3>
                  <p className="text-slate-400">Generate marketing content with AI</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}