import React, { useState, useEffect } from 'react';
import cosmicBackgroundPath from "@assets/image_1754257352191.png";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FlutterAIGroupAnalysis from './flutterai-group-analysis';
import FlutterAITokenCollector from '@/components/flutterai-token-collector';
import AdvancedAnalyticsDashboard from '@/components/advanced-analytics-dashboard';
import EnterpriseDashboard from '@/components/enterprise-dashboard';
import RealTimeIntelligenceDashboard from '@/components/real-time-intelligence-dashboard';
import { SolviturBrandBadge } from '@/components/solvitur-brand-badge';
import { FlutterinaAdminPanel } from '@/components/flutterina-admin-panel';
import { SkyeKnowledgeAdmin } from "@/components/skye-knowledge-admin";
import { EnhancedSkyeChat } from "@/components/enhanced-skye-chat";
import { 
  Brain, 
  Wallet, 
  Upload, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Activity,
  Database,
  FileText,
  Download,
  RefreshCw,
  Zap,
  BarChart3,
  Globe,
  Lock,
  Users,
  DollarSign,
  CheckCircle,
  Star,
  Target,
  MessageSquare,
  MessageCircle,
  Trash2,
  Settings,
  Bot,
  Calendar,
  Play,
  Pause,
  Twitter,
  Linkedin,
  Instagram,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

/**
 * Admin Pricing Editor Component
 */
function AdminPricingEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});

  // Fetch admin pricing data
  const { data: adminTiers, isLoading: adminLoading } = useQuery({
    queryKey: ['/api/flutterai/pricing/admin/tiers'],
    retry: false
  });

  // Update pricing mutation
  const updatePricingMutation = useMutation({
    mutationFn: async ({ tierId, updates }: { tierId: string; updates: any }) => {
      return await apiRequest('PUT', `/api/flutterai/pricing/admin/tiers/${tierId}`, updates);
    },
    onSuccess: (data) => {
      toast({
        title: "Pricing Updated",
        description: `Successfully updated ${data.tier.name} pricing`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/pricing/admin/tiers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/pricing/tiers'] });
      setEditingTier(null);
      setEditValues({});
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update pricing",
        variant: "destructive",
      });
    },
  });

  const startEditing = (tier: any) => {
    setEditingTier(tier.id);
    setEditValues({
      monthlyPrice: tier.monthlyPrice,
      yearlyPrice: tier.yearlyPrice,
      name: tier.name,
      description: tier.description
    });
  };

  const saveChanges = (tierId: string) => {
    updatePricingMutation.mutate({ tierId, updates: editValues });
  };

  const cancelEditing = () => {
    setEditingTier(null);
    setEditValues({});
  };

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {adminTiers?.tiers?.map((tier: any) => (
        <Card key={tier.id} className="bg-slate-700/50 border-purple-500/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white capitalize">
                  {editingTier === tier.id ? (
                    <Input
                      value={editValues.name || ''}
                      onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-slate-600 border-purple-500/20 text-white"
                    />
                  ) : (
                    tier.name
                  )}
                </CardTitle>
                <CardDescription className="text-purple-200">
                  {editingTier === tier.id ? (
                    <Input
                      value={editValues.description || ''}
                      onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-600 border-purple-500/20 text-white mt-2"
                    />
                  ) : (
                    tier.description
                  )}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {editingTier === tier.id ? (
                  <>
                    <Button
                      onClick={() => saveChanges(tier.id)}
                      disabled={updatePricingMutation.isPending}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {updatePricingMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={cancelEditing}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => startEditing(tier)}
                    size="sm"
                    variant="outline"
                    className="border-purple-500 text-purple-300 hover:bg-purple-600"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-purple-200">Monthly Price ($)</Label>
                {editingTier === tier.id ? (
                  <Input
                    type="number"
                    value={editValues.monthlyPrice || 0}
                    onChange={(e) => setEditValues(prev => ({ ...prev, monthlyPrice: parseFloat(e.target.value) || 0 }))}
                    className="bg-slate-600 border-purple-500/20 text-white"
                  />
                ) : (
                  <div className="text-2xl font-bold text-white">${tier.monthlyPrice}</div>
                )}
              </div>
              <div>
                <Label className="text-purple-200">Yearly Price ($)</Label>
                {editingTier === tier.id ? (
                  <Input
                    type="number"
                    value={editValues.yearlyPrice || 0}
                    onChange={(e) => setEditValues(prev => ({ ...prev, yearlyPrice: parseFloat(e.target.value) || 0 }))}
                    className="bg-slate-600 border-purple-500/20 text-white"
                  />
                ) : (
                  <div className="text-2xl font-bold text-white">${tier.yearlyPrice}</div>
                )}
                {tier.yearlyPrice > 0 && tier.monthlyPrice > 0 && (
                  <div className="text-sm text-green-400 mt-1">
                    Save ${(tier.monthlyPrice * 12) - tier.yearlyPrice}/year
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <Label className="text-purple-200">Features</Label>
              <ul className="mt-2 space-y-1">
                {tier.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-purple-200">
                    <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * AI Marketing Bot Component for FlutterAI Dashboard
 */
function AIMarketingBotContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeMarketingTab, setActiveMarketingTab] = useState("dashboard");

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

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/admin/marketing-bot/analytics'],
    retry: false
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      return apiRequest("PUT", "/api/admin/marketing-bot/settings", settings);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "AI Marketing Bot settings saved successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketing-bot/settings'] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update bot settings.",
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
        description: "New marketing content generated successfully."
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
        description: "Content published successfully."
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-purple-200">Loading AI Marketing Bot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
            <Bot className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Marketing Bot</h2>
            <p className="text-purple-200">
              Automated social media and SEO content generation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={botSettings?.enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
            {botSettings?.enabled ? "Active" : "Inactive"}
          </Badge>
          <Button
            onClick={() => handleToggleBot(!botSettings?.enabled)}
            variant={botSettings?.enabled ? "destructive" : "default"}
            size="sm"
          >
            {botSettings?.enabled ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Bot
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Bot
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Marketing Bot Tabs */}
      <Tabs value={activeMarketingTab} onValueChange={setActiveMarketingTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-purple-600">
            <FileText className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-purple-600">
            <Calendar className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-200">Total Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics?.totalPosts || 0}</div>
                <div className="text-xs text-purple-400 mt-1">Posts generated</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-200">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics?.publishedPosts || 0}</div>
                <div className="text-xs text-purple-400 mt-1">Live content</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-200">Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics?.totalEngagement || 0}</div>
                <div className="text-xs text-purple-400 mt-1">Total interactions</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                Quick Generate
              </CardTitle>
              <CardDescription className="text-purple-200">
                Generate content for different platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={() => handleGenerateContent('twitter')}
                  disabled={generateContentMutation.isPending}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
                <Button
                  onClick={() => handleGenerateContent('linkedin')}
                  disabled={generateContentMutation.isPending}
                  className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Button>
                <Button
                  onClick={() => handleGenerateContent('instagram')}
                  disabled={generateContentMutation.isPending}
                  className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Button>
                <Button
                  onClick={() => handleGenerateContent('blog')}
                  disabled={generateContentMutation.isPending}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <FileText className="w-4 h-4" />
                  Blog
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Generated Content</CardTitle>
              <CardDescription className="text-purple-200">
                All AI-generated marketing content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contentLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
                </div>
              ) : generatedContent?.length > 0 ? (
                <div className="space-y-4">
                  {generatedContent.slice(0, 10).map((content: any) => (
                    <div key={content.id} className="p-4 bg-slate-700/50 rounded-lg border border-purple-500/10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-500/20 text-purple-400">
                            {content.platform}
                          </Badge>
                          <Badge className={
                            content.status === 'published' 
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }>
                            {content.status}
                          </Badge>
                        </div>
                        {content.status === 'draft' && (
                          <Button
                            onClick={() => publishContentMutation.mutate(content.id)}
                            disabled={publishContentMutation.isPending}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Publish
                          </Button>
                        )}
                      </div>
                      <p className="text-white text-sm mb-2">{content.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {content.hashtags?.map((tag: string, i: number) => (
                          <span key={i} className="text-xs text-purple-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-purple-300 mt-2">
                        Scheduled: {new Date(content.scheduledFor).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Content Generated</h3>
                  <p className="text-purple-200 mb-4">
                    Start generating content for your social media platforms.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Marketing Campaigns</CardTitle>
              <CardDescription className="text-purple-200">
                Automated campaign management and scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Active Campaigns</h3>
                <p className="text-purple-200 mb-4">
                  Create your first automated marketing campaign.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Bot Configuration</CardTitle>
              <CardDescription className="text-purple-200">
                Configure AI marketing bot settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-purple-200">Content Tone</Label>
                  <Select value={botSettings?.tone || 'professional'}>
                    <SelectTrigger className="bg-slate-700 border-purple-500/20 text-white">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-200">Post Frequency</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-purple-300">Twitter/day</Label>
                      <Input 
                        type="number" 
                        value={botSettings?.postFrequency?.twitter || 3}
                        className="bg-slate-700 border-purple-500/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-purple-300">LinkedIn/day</Label>
                      <Input 
                        type="number" 
                        value={botSettings?.postFrequency?.linkedin || 1}
                        className="bg-slate-700 border-purple-500/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-purple-300">Instagram/day</Label>
                      <Input 
                        type="number" 
                        value={botSettings?.postFrequency?.instagram || 1}
                        className="bg-slate-700 border-purple-500/20 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * FlutterAI Intelligence Dashboard
 * 
 * Comprehensive wallet intelligence and social credit scoring system
 * Features automatic collection, manual entry, CSV uploads, and AI analysis
 */
/**
 * Enhanced AI Testing Interface Component
 */
function EnhancedAITestingInterface() {
  const [chatVisible, setChatVisible] = useState(false);
  const [testingMode, setTestingMode] = useState<'memory' | 'emotion' | 'both'>('both');

  return (
    <div className="space-y-6">
      {/* Testing Overview */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Enhanced AI Testing Interface
          </CardTitle>
          <CardDescription className="text-purple-200">
            Test advanced memory system and emotional intelligence capabilities of Skye AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-blue-500/20">
              <Brain className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-300">Deep Learning Memory</div>
              <div className="text-sm text-slate-400">Cross-session conversation continuity</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-pink-500/20">
              <MessageSquare className="h-8 w-8 text-pink-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-pink-300">Emotional Intelligence</div>
              <div className="text-sm text-slate-400">Real-time emotion detection & adaptation</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-green-500/20">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-300">Predictive Analytics</div>
              <div className="text-sm text-slate-400">AI-powered need prediction</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Controls */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-400" />
            Testing Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label className="text-white">Testing Mode:</Label>
            <div className="flex gap-2">
              <Button
                variant={testingMode === 'memory' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTestingMode('memory')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Brain className="h-4 w-4 mr-2" />
                Memory Only
              </Button>
              <Button
                variant={testingMode === 'emotion' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTestingMode('emotion')}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Emotion Only
              </Button>
              <Button
                variant={testingMode === 'both' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTestingMode('both')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Star className="h-4 w-4 mr-2" />
                Full Intelligence
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setChatVisible(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Launch Enhanced Chat Test
            </Button>
            <Badge variant="outline" className="text-purple-300 border-purple-500/50">
              GPT-4o Powered
            </Badge>
            <Badge variant="outline" className="text-green-300 border-green-500/50">
              300-500% Retention Boost
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              Memory System Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Cross-session conversation history</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">User interest and preference tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Progressive trust level building</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Contextual response adaptation</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-pink-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-pink-400" />
              Emotional Intelligence Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Real-time emotion detection</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Adaptive personality adjustments</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Sentiment-aware responses</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Predictive need analysis</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Chat Component */}
      {chatVisible && (
        <EnhancedSkyeChat
          userId="test-user"
          walletAddress="demo-wallet"
          isVisible={chatVisible}
          onClose={() => setChatVisible(false)}
        />
      )}
    </div>
  );
}

function FlutterAIDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [manualWallet, setManualWallet] = useState('');
  const [manualTags, setManualTags] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [batchName, setBatchName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('');

  // Comprehensive Intelligence Data Queries
  const { data: intelligenceStats } = useQuery({
    queryKey: ['/api/flutterai/intelligence-stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  }) as { data: any };

  const { data: walletIntelligence, isLoading: walletsLoading } = useQuery({
    queryKey: ['/api/flutterai/intelligence', selectedRiskLevel],
    queryFn: async () => {
      const url = selectedRiskLevel 
        ? `/api/flutterai/intelligence?riskLevel=${selectedRiskLevel}`
        : '/api/flutterai/intelligence';
      return await apiRequest('GET', url);
    },
  }) as { data: any; isLoading: boolean };

  // Pricing and Monetization Data Queries
  const { data: pricingTiers } = useQuery({
    queryKey: ['/api/flutterai/pricing/tiers'],
  }) as { data: any };

  const { data: userSubscription } = useQuery({
    queryKey: ['/api/flutterai/pricing/subscription/demo-user'],
    refetchInterval: 60000, // Refresh every minute
  }) as { data: any };

  const { data: pricingAnalytics } = useQuery({
    queryKey: ['/api/flutterai/pricing/analytics'],
    refetchInterval: 30000, // Refresh every 30 seconds
  }) as { data: any };

  const { data: batches } = useQuery({
    queryKey: ['/api/flutterai/batches'],
  }) as { data: any };

  const { data: queueStatus } = useQuery({
    queryKey: ['/api/flutterai/queue-status'],
    refetchInterval: 15000, // Refresh every 15 seconds
  }) as { data: any };

  // Mutations
  const manualEntryMutation = useMutation({
    mutationFn: async (data: { walletAddress: string; tags?: string[]; notes?: string }) => {
      return await apiRequest('POST', '/api/flutterai/collect/manual', data);
    },
    onSuccess: () => {
      toast({
        title: "Wallet Collected",
        description: "Wallet address added and queued for analysis",
      });
      setManualWallet('');
      setManualTags('');
      setManualNotes('');
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/wallets'] });
    },
    onError: (error: any) => {
      toast({
        title: "Collection Failed",
        description: error.message || "Failed to collect wallet address",
        variant: "destructive",
      });
    },
  });

  const csvUploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/flutterai/collect/csv-upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('CSV upload failed');
      }
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "CSV Upload Complete",
        description: `Processed ${data.validWallets}/${data.totalWallets} wallets successfully`,
      });
      setCsvFile(null);
      setBatchName('');
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/batches'] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to process CSV file",
        variant: "destructive",
      });
    },
  });

  const processQueueMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/flutterai/process-queue', { batchSize: 10 });
    },
    onSuccess: () => {
      toast({
        title: "Queue Processing",
        description: "Analysis queue processing initiated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/queue-status'] });
    },
  });

  // Comprehensive Wallet Intelligence Analysis
  const analyzeWalletMutation = useMutation({
    mutationFn: async (walletAddress: string) => {
      return await apiRequest('POST', `/api/flutterai/intelligence/analyze/${walletAddress}`);
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: `Wallet scored: ${data.socialCreditScore}/1000 (${data.riskLevel} risk)`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/intelligence'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/intelligence-stats'] });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze wallet",
        variant: "destructive",
      });
    },
  });

  // Batch Intelligence Analysis
  const batchAnalyzeMutation = useMutation({
    mutationFn: async (walletAddresses: string[]) => {
      return await apiRequest('POST', '/api/flutterai/intelligence/batch-analyze', { walletAddresses });
    },
    onSuccess: (data) => {
      toast({
        title: "Batch Analysis Complete",
        description: `Analyzed ${data.storedIntelligence}/${data.totalProcessed} wallets successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/intelligence'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/intelligence-stats'] });
    },
    onError: (error: any) => {
      toast({
        title: "Batch Analysis Failed",
        description: error.message || "Failed to analyze wallets",
        variant: "destructive",
      });
    },
  });

  // Pricing and Subscription Mutations
  const upgradeSubscriptionMutation = useMutation({
    mutationFn: async ({ tierId, billingPeriod }: { tierId: string; billingPeriod: 'monthly' | 'yearly' }) => {
      return await apiRequest('POST', '/api/flutterai/pricing/checkout', {
        userId: 'demo-user',
        tierId,
        billingPeriod
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Redirecting to Checkout",
        description: "Opening secure payment portal...",
      });
      // In a real app, redirect to Stripe checkout
      window.open(data.checkoutUrl, '_blank');
    },
    onError: (error: any) => {
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    },
  });

  // Event handlers
  const handleManualEntry = async () => {
    if (!manualWallet.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a wallet address",
        variant: "destructive",
      });
      return;
    }

    const tags = manualTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    manualEntryMutation.mutate({
      walletAddress: manualWallet.trim(),
      tags: tags.length > 0 ? tags : undefined,
      notes: manualNotes.trim() || undefined,
    });
  };

  const handleCsvUpload = async () => {
    if (!csvFile || !batchName.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please select a CSV file and enter a batch name",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', csvFile);
    formData.append('batchName', batchName.trim());

    csvUploadMutation.mutate(formData);
  };

  const handleExport = async (format: 'json' | 'csv' = 'csv') => {
    try {
      let url = `/api/flutterai/export?format=${format}`;
      if (selectedRiskLevel) {
        url += `&riskLevel=${selectedRiskLevel}`;
      }
      
      const response = await fetch(url);
      const blob = await response.blob();
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `flutterai-wallets.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Export Complete",
        description: `Wallet data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export wallet data",
        variant: "destructive",
      });
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskVariant = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div 
      className="min-h-screen p-6 relative overflow-hidden bg-cover bg-center bg-no-repeat" 
      style={{
        backgroundImage: `url(${cosmicBackgroundPath})`,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      
      {/* Cosmic Butterfly Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Flying Butterflies */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 8)}%`,
              animation: `butterfly-flight-${(i % 4) + 1} ${25 + (i * 4)}s infinite linear`,
              animationDelay: `${i * 3}s`
            }}
          >
            <div className="w-5 h-5 relative">
              {/* Butterfly Wings */}
              <div className="absolute inset-0">
                <div 
                  className="absolute w-2.5 h-3 bg-gradient-to-br from-purple-400/80 to-blue-400/80 rounded-full transform -rotate-12 animate-wing-flutter"
                  style={{ 
                    top: '0px', 
                    left: '0px',
                    animationDelay: `${i * 0.3}s`,
                    filter: 'drop-shadow(0 0 4px rgba(147, 51, 234, 0.7))'
                  }}
                />
                <div 
                  className="absolute w-2.5 h-3 bg-gradient-to-bl from-blue-400/80 to-purple-400/80 rounded-full transform rotate-12 animate-wing-flutter" 
                  style={{ 
                    top: '0px', 
                    right: '0px',
                    animationDelay: `${i * 0.3 + 0.15}s`,
                    filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.7))'
                  }}
                />
                <div 
                  className="absolute w-2 h-2.5 bg-gradient-to-br from-purple-300/70 to-blue-300/70 rounded-full transform -rotate-6 animate-wing-flutter" 
                  style={{ 
                    bottom: '1px', 
                    left: '1px',
                    animationDelay: `${i * 0.3}s`,
                    filter: 'drop-shadow(0 0 3px rgba(147, 51, 234, 0.5))'
                  }}
                />
                <div 
                  className="absolute w-2 h-2.5 bg-gradient-to-bl from-blue-300/70 to-purple-300/70 rounded-full transform rotate-6 animate-wing-flutter" 
                  style={{ 
                    bottom: '1px', 
                    right: '1px',
                    animationDelay: `${i * 0.3 + 0.15}s`,
                    filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.5))'
                  }}
                />
                {/* Butterfly Body */}
                <div 
                  className="absolute w-0.5 h-4 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"
                  style={{ 
                    top: '0px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    filter: 'drop-shadow(0 0 2px rgba(147, 197, 253, 0.8))'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        
        {/* AI Circuit Overlays for Intelligence Theme */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-32 left-32 w-48 h-48 border border-purple-400/30 rounded-lg animate-pulse-slow" />
          <div className="absolute bottom-40 right-40 w-40 h-40 border border-blue-400/30 rounded-full rotate-45 animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-purple-300/20 rounded-lg rotate-12 animate-pulse-slow" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              FlutterAI Intelligence Dashboard
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-purple-300 text-sm">Powered by</span>
            <SolviturBrandBadge size="sm" showText={true} />
          </div>
          <p className="text-purple-200 text-lg max-w-3xl mx-auto">
            World's first Social Credit Score system for Solana wallets. 
            Automatically collect, analyze, and score wallet addresses with advanced AI intelligence.
          </p>
        </div>

        {/* Statistics Cards */}
        {intelligenceStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Total Wallets</CardTitle>
                <Database className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{intelligenceStats.stats.totalWallets.toLocaleString()}</div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="text-green-400">FlutterBye: {intelligenceStats.stats.bySource.flutterbye_connect}</div>
                  <div className="text-blue-400">PerpeTrader: {intelligenceStats.stats.bySource.perpetrader_connect}</div>
                  <div className="text-yellow-400">Manual: {intelligenceStats.stats.bySource.manual_entry}</div>
                  <div className="text-purple-400">CSV: {intelligenceStats.stats.bySource.csv_upload}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Risk Distribution</CardTitle>
                <Shield className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 text-sm">Low</span>
                    <Badge variant="default" className="bg-green-600">{intelligenceStats.stats.byRiskLevel.low}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 text-sm">Medium</span>
                    <Badge variant="secondary" className="bg-yellow-600">{intelligenceStats.stats.byRiskLevel.medium}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 text-sm">High+</span>
                    <Badge variant="destructive">{intelligenceStats.stats.byRiskLevel.high + intelligenceStats.stats.byRiskLevel.critical}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Analysis Queue</CardTitle>
                <Activity className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-400 text-sm">Queued</span>
                    <span className="text-white font-bold">{intelligenceStats.stats.analysisStats.queued}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400 text-sm">Processing</span>
                    <span className="text-white font-bold">{intelligenceStats.stats.analysisStats.processing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400 text-sm">Completed</span>
                    <span className="text-white font-bold">{intelligenceStats.stats.analysisStats.completed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">System Status</CardTitle>
                <Zap className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">AI Analysis Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 text-sm">Auto Collection ON</span>
                  </div>
                  <Button
                    onClick={() => processQueueMutation.mutate()}
                    disabled={processQueueMutation.isPending}
                    size="sm"
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                  >
                    {processQueueMutation.isPending ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      'Process Queue'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced FlutterAI Dashboard - 5 Essential Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-slate-800/50 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <Brain className="h-4 w-4 mr-2" />
              Intelligence Overview
            </TabsTrigger>
            <TabsTrigger value="collection" className="data-[state=active]:bg-blue-600">
              <Upload className="h-4 w-4 mr-2" />
              Collection & Scoring
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics & Insights
            </TabsTrigger>
            <TabsTrigger value="skye" className="data-[state=active]:bg-purple-600">
              <Brain className="h-4 w-4 mr-2" />
              Skye AI Knowledge
            </TabsTrigger>
            <TabsTrigger value="flutterina" className="data-[state=active]:bg-pink-600">
              <Settings className="h-4 w-4 mr-2" />
              Skye AI Settings
            </TabsTrigger>
            <TabsTrigger value="scoring" className="data-[state=active]:bg-indigo-600">
              <Target className="h-4 w-4 mr-2" />
              Scoring Methodology
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-orange-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="enhanced-ai" className="data-[state=active]:bg-purple-600">
              <MessageCircle className="h-4 w-4 mr-2" />
              Enhanced AI Test
            </TabsTrigger>
          </TabsList>

          {/* 1. INTELLIGENCE OVERVIEW TAB - Core Wallet Intelligence Dashboard */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Intelligence Analytics */}
              <Card className="bg-slate-800/50 border-purple-500/20 xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-400" />
                    Social Credit Analytics
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Revolutionary wallet intelligence with comprehensive marketing insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {intelligenceStats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="text-blue-400 text-sm font-medium">Avg Social Score</div>
                        <div className="text-2xl font-bold text-white">
                          {Math.round(intelligenceStats.avgSocialCreditScore || 0)}/1000
                        </div>
                        <Progress 
                          value={(intelligenceStats.avgSocialCreditScore || 0) / 10} 
                          className="mt-2 h-2" 
                        />
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="text-green-400 text-sm font-medium">High Value</div>
                        <div className="text-2xl font-bold text-white">
                          {intelligenceStats.topPerformers?.length || 0}
                        </div>
                        <div className="text-xs text-green-300 mt-1">750+ Score</div>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="text-orange-400 text-sm font-medium">Marketing Segments</div>
                        <div className="text-2xl font-bold text-white">
                          {Object.keys(intelligenceStats.marketingSegmentDistribution || {}).length}
                        </div>
                        <div className="text-xs text-orange-300 mt-1">Active</div>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="text-red-400 text-sm font-medium">Risk Flagged</div>
                        <div className="text-2xl font-bold text-white">
                          {intelligenceStats.highRiskWallets?.length || 0}
                        </div>
                        <div className="text-xs text-red-300 mt-1">High Risk</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Marketing Segment Distribution */}
                  {intelligenceStats?.marketingSegmentDistribution && (
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Marketing Segment Distribution</h4>
                      <div className="space-y-2">
                        {Object.entries(intelligenceStats.marketingSegmentDistribution).map(([segment, count]) => (
                          <div key={segment} className="flex justify-between items-center">
                            <span className="text-purple-200 capitalize">{segment}</span>
                            <Badge variant="secondary" className="bg-purple-600">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Wallet Intelligence Analysis */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    Analyze Wallet
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Get comprehensive intelligence on any wallet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={manualWallet}
                      onChange={(e) => setManualWallet(e.target.value)}
                      placeholder="Enter wallet address..."
                      className="bg-slate-700 border-purple-500/20 text-white flex-1"
                    />
                    <Button
                      onClick={() => analyzeWalletMutation.mutate(manualWallet)}
                      disabled={!manualWallet || analyzeWalletMutation.isPending}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {analyzeWalletMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Analyze"
                      )}
                    </Button>
                  </div>
                  
                  {/* Batch Analysis */}
                  <div className="border-t border-purple-500/20 pt-4">
                    <h4 className="text-white font-medium mb-2">Batch Analysis</h4>
                    <Button
                      onClick={() => {
                        if (walletIntelligence?.data?.length) {
                          const addresses = walletIntelligence.data.slice(0, 5).map((w: any) => w.walletAddress);
                          batchAnalyzeMutation.mutate(addresses);
                        }
                      }}
                      disabled={!walletIntelligence?.data?.length || batchAnalyzeMutation.isPending}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      {batchAnalyzeMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Users className="h-4 w-4 mr-2" />
                      )}
                      Batch Analyze ({Math.min(walletIntelligence?.data?.length || 0, 5)})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Wallets */}
            {intelligenceStats?.topPerformers?.length > 0 && (
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Top Performing Wallets
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Highest social credit scores with premium marketing potential
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {intelligenceStats.topPerformers.slice(0, 6).map((wallet: any, index: number) => (
                      <div key={wallet.walletAddress} className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-white font-mono text-sm">
                            {wallet.walletAddress.slice(0, 8)}...{wallet.walletAddress.slice(-8)}
                          </div>
                          <Badge className="bg-green-600">{wallet.socialCreditScore}/1000</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-purple-300">
                            Segment: <span className="text-white">{wallet.marketingSegment}</span>
                          </div>
                          <div className="text-purple-300">
                            Risk: <span className="text-white">{wallet.riskLevel}</span>
                          </div>
                          <div className="text-purple-300">
                            DeFi: <span className="text-white">{wallet.defiEngagementScore}/100</span>
                          </div>
                          <div className="text-purple-300">
                            Influence: <span className="text-white">{wallet.influenceScore}/100</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Comprehensive Pricing and Monetization Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              
              {/* Current Subscription Status */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    Current Plan
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Your subscription and usage details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userSubscription && (
                    <>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="text-green-400 text-sm font-medium mb-1">Active Plan</div>
                        <div className="text-xl font-bold text-white capitalize">
                          {userSubscription.subscription?.tierId || 'Free Explorer'}
                        </div>
                        <div className="text-xs text-purple-300 mt-1">
                          Status: {userSubscription.subscription?.status || 'Active'}
                        </div>
                      </div>
                      
                      {userSubscription.usage && (
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-purple-300">Wallets Analyzed</span>
                              <span className="text-white">{userSubscription.usage.walletsAnalyzed}/10</span>
                            </div>
                            <Progress value={(userSubscription.usage.walletsAnalyzed / 10) * 100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-purple-300">API Calls</span>
                              <span className="text-white">{userSubscription.usage.apiCallsMade}/100</span>
                            </div>
                            <Progress value={(userSubscription.usage.apiCallsMade / 100) * 100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-purple-300">Batch Analysis</span>
                              <span className="text-white">{userSubscription.usage.batchAnalysisUsed}/2</span>
                            </div>
                            <Progress value={(userSubscription.usage.batchAnalysisUsed / 2) * 100} className="h-2" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Pricing Tiers */}
              <div className="xl:col-span-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {pricingTiers?.tiers?.map((tier: any) => (
                    <Card 
                      key={tier.id} 
                      className={`bg-slate-800/50 border-purple-500/20 ${
                        tier.id === 'professional' ? 'ring-2 ring-purple-500 relative' : ''
                      }`}
                    >
                      {tier.id === 'professional' && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
                        <CardDescription className="text-purple-200">
                          {tier.description}
                        </CardDescription>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-white">${tier.monthlyPrice}</span>
                          <span className="text-purple-300">/month</span>
                        </div>
                        {tier.yearlyPrice > 0 && (
                          <div className="text-sm text-green-400">
                            Save ${(tier.monthlyPrice * 12) - tier.yearlyPrice}/year with yearly
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {tier.features.map((feature: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-purple-200">
                              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="space-y-2">
                          {tier.id !== 'free' && (
                            <>
                              <Button
                                onClick={() => upgradeSubscriptionMutation.mutate({ 
                                  tierId: tier.id, 
                                  billingPeriod: 'monthly' 
                                })}
                                disabled={upgradeSubscriptionMutation.isPending}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                              >
                                {upgradeSubscriptionMutation.isPending ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  "Upgrade Monthly"
                                )}
                              </Button>
                              {tier.yearlyPrice > 0 && (
                                <Button
                                  onClick={() => upgradeSubscriptionMutation.mutate({ 
                                    tierId: tier.id, 
                                    billingPeriod: 'yearly' 
                                  })}
                                  disabled={upgradeSubscriptionMutation.isPending}
                                  variant="outline"
                                  className="w-full border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white"
                                >
                                  Upgrade Yearly (Save ${(tier.monthlyPrice * 12) - tier.yearlyPrice})
                                </Button>
                              )}
                            </>
                          )}
                          {tier.id === 'free' && (
                            <Button disabled className="w-full bg-slate-600 text-slate-300">
                              Current Plan
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue Analytics */}
            {pricingAnalytics && (
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-400" />
                    Revenue Analytics
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    FlutterAI monetization performance and customer insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-green-400 text-sm font-medium">Total Revenue</div>
                      <div className="text-2xl font-bold text-white">
                        ${pricingAnalytics.analytics.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-300 mt-1">All-time earnings</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-blue-400 text-sm font-medium">Monthly Recurring</div>
                      <div className="text-2xl font-bold text-white">
                        ${pricingAnalytics.analytics.monthlyRecurringRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-300 mt-1">MRR growth</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-purple-400 text-sm font-medium">Total Customers</div>
                      <div className="text-2xl font-bold text-white">
                        {Object.values(pricingAnalytics.analytics.customersByTier).reduce((a: number, b: number) => a + b, 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-purple-300 mt-1">Active subscribers</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-orange-400 text-sm font-medium">API Usage</div>
                      <div className="text-2xl font-bold text-white">
                        {pricingAnalytics.analytics.usageStats.totalApiCalls.toLocaleString()}
                      </div>
                      <div className="text-xs text-orange-300 mt-1">Total API calls</div>
                    </div>
                  </div>
                  
                  {/* Customer Distribution */}
                  <div className="mt-6">
                    <h4 className="text-white font-medium mb-4">Customer Distribution by Tier</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(pricingAnalytics.analytics.customersByTier).map(([tier, count]) => (
                        <div key={tier} className="bg-slate-700/50 p-3 rounded-lg">
                          <div className="text-sm text-purple-300 capitalize">{tier}</div>
                          <div className="text-xl font-bold text-white">{count}</div>
                          <div className="text-xs text-purple-400">
                            {(count / Object.values(pricingAnalytics.analytics.customersByTier).reduce((a: number, b: number) => a + b, 0) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Access and Integration */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  API Access & Integration
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Monetize FlutterAI intelligence through API access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Available API Endpoints</h4>
                    <div className="space-y-2">
                      {[
                        { endpoint: '/api/flutterai/intelligence/analyze/:wallet', description: 'Analyze wallet social credit score' },
                        { endpoint: '/api/flutterai/intelligence/:wallet', description: 'Get wallet intelligence data' },
                        { endpoint: '/api/flutterai/intelligence', description: 'List all wallet intelligence' },
                        { endpoint: '/api/flutterai/intelligence/batch-analyze', description: 'Batch analyze multiple wallets' },
                        { endpoint: '/api/flutterai/intelligence/:wallet/marketing', description: 'Get marketing recommendations' }
                      ].map((api, index) => (
                        <div key={index} className="bg-slate-700/50 p-3 rounded-lg">
                          <div className="text-green-400 font-mono text-sm">{api.endpoint}</div>
                          <div className="text-purple-200 text-sm mt-1">{api.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Integration Benefits</h4>
                    <ul className="space-y-2">
                      {[
                        'Real-time wallet intelligence scoring',
                        'Advanced marketing segmentation',
                        'Behavioral analysis and insights',
                        'Risk assessment capabilities',
                        'Batch processing for scale',
                        'RESTful API design',
                        'Comprehensive documentation',
                        'Rate limiting and usage tracking'
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-purple-200">
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. COLLECTION & SCORING TAB - Wallet Collection and AI Scoring */}
          <TabsContent value="collection" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Manual Entry */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-400" />
                    Manual Wallet Entry
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Add individual wallet addresses for AI scoring analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="manual-wallet" className="text-blue-200">Wallet Address</Label>
                    <Input
                      id="manual-wallet"
                      value={manualWallet}
                      onChange={(e) => setManualWallet(e.target.value)}
                      placeholder="Enter Solana wallet address..."
                      className="bg-slate-700 border-blue-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manual-tags" className="text-blue-200">Tags (comma-separated)</Label>
                    <Input
                      id="manual-tags"
                      value={manualTags}
                      onChange={(e) => setManualTags(e.target.value)}
                      placeholder="e.g., high-value, suspicious, whale"
                      className="bg-slate-700 border-blue-500/20 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleManualEntry}
                    disabled={manualEntryMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {manualEntryMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wallet className="h-4 w-4 mr-2" />
                    )}
                    Add & Score Wallet
                  </Button>
                </CardContent>
              </Card>

              {/* CSV Upload */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-400" />
                    Bulk CSV Upload
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Upload multiple wallet addresses for batch AI scoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="batch-name" className="text-blue-200">Batch Name</Label>
                    <Input
                      id="batch-name"
                      value={batchName}
                      onChange={(e) => setBatchName(e.target.value)}
                      placeholder="Enter batch name..."
                      className="bg-slate-700 border-blue-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="csv-file" className="text-blue-200">CSV File</Label>
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      className="bg-slate-700 border-blue-500/20 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleCsvUpload}
                    disabled={csvUploadMutation.isPending || !csvFile || !batchName}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {csvUploadMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload & Score CSV
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Token Holder Collection with AI Scoring */}
            <FlutterAITokenCollector />

            {/* AI Scoring Engine Status */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-400" />
                  AI Scoring Engine
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Real-time wallet intelligence scoring with advanced AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">Social Credit</div>
                    <div className="text-sm text-purple-300">0-1000 point scale</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <Shield className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">Risk Analysis</div>
                    <div className="text-sm text-purple-300">4-tier classification</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">Behavior</div>
                    <div className="text-sm text-purple-300">Pattern recognition</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3. ANALYTICS & INSIGHTS TAB - Consolidated Analytics Dashboard */}
          <TabsContent value="analytics" className="space-y-6">
            
            {/* Advanced Analytics Dashboard */}
            <AdvancedAnalyticsDashboard />

            {/* Additional Analytics Insights */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-green-400" />
                  AI Behavioral Insights
                </CardTitle>
                <CardDescription className="text-green-200">
                  Advanced behavioral pattern analysis and marketing intelligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Trading Patterns</h3>
                    <p className="text-green-200 text-sm">
                      Volume analysis, frequency patterns, and timing behavior for precise marketing targeting
                    </p>
                  </div>
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Social Influence</h3>
                    <p className="text-green-200 text-sm">
                      Network analysis, influence scores, and community engagement for viral marketing potential
                    </p>
                  </div>
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <Target className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Marketing Segments</h3>
                    <p className="text-green-200 text-sm">
                      AI-powered segmentation for precision targeting and campaign optimization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Intelligence Integration */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Real-time Intelligence Stream
                </CardTitle>
                <CardDescription className="text-green-200">
                  Live wallet activity and market intelligence updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RealTimeIntelligenceDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. SKYE AI KNOWLEDGE MANAGEMENT TAB */}
          <TabsContent value="skye" className="space-y-6">
            <SkyeKnowledgeAdmin />
          </TabsContent>

          {/* 5. SETTINGS TAB - Configuration and Technical Settings */}
          <TabsContent value="settings" className="space-y-6">
            
            {/* Core Configuration */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-400" />
                  FlutterAI Configuration
                </CardTitle>
                <CardDescription className="text-orange-200">
                  Configure wallet intelligence settings and AI parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Scoring Parameters</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-orange-200">Social Credit Weight</Label>
                        <Badge className="bg-orange-600">0.4</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-orange-200">Risk Assessment Weight</Label>
                        <Badge className="bg-orange-600">0.3</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-orange-200">Behavior Pattern Weight</Label>
                        <Badge className="bg-orange-600">0.3</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Collection Settings</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-orange-200">Auto-Collection</Label>
                        <Badge className="bg-green-600">Enabled</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-orange-200">Batch Processing</Label>
                        <Badge className="bg-green-600">Enabled</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-orange-200">Real-time Updates</Label>
                        <Badge className="bg-green-600">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Configuration */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-400" />
                  API Integration Settings
                </CardTitle>
                <CardDescription className="text-orange-200">
                  External service configurations and webhook settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Active Webhooks</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-white">FlutterBye Integration</span>
                        <Badge className="bg-green-600">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-white">PerpeTrader Integration</span>
                        <Badge className="bg-green-600">Active</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-3">Processing Queue</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-200">Queue Size</span>
                        <Badge className="bg-blue-600">{intelligenceStats?.stats.analysisStats.queued || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-200">Processing Rate</span>
                        <Badge className="bg-blue-600">~50/min</Badge>
                      </div>
                      <Button
                        onClick={() => processQueueMutation.mutate()}
                        disabled={processQueueMutation.isPending}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        {processQueueMutation.isPending ? (
                          <RefreshCw className="h-3 w-3 animate-spin mr-2" />
                        ) : (
                          <Zap className="h-3 w-3 mr-2" />
                        )}
                        Process Queue
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Export and Management */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="h-5 w-5 text-orange-400" />
                  Data Export & Management
                </CardTitle>
                <CardDescription className="text-orange-200">
                  Export wallet intelligence data and manage system backups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Export Options</h4>
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleExport('csv')}
                        variant="outline"
                        className="w-full border-orange-500 text-orange-300 hover:bg-orange-600"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button
                        onClick={() => handleExport('json')}
                        variant="outline"
                        className="w-full border-orange-500 text-orange-300 hover:bg-orange-600"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Export JSON
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-3">Database Statistics</h4>
                    {intelligenceStats && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-200">Total Wallets</span>
                          <Badge className="bg-blue-600">{intelligenceStats.stats.totalWallets.toLocaleString()}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-orange-200">Analyzed</span>
                          <Badge className="bg-green-600">{intelligenceStats.stats.analysisStats.completed}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-orange-200">Avg Score</span>
                          <Badge className="bg-purple-600">{Math.round(intelligenceStats.avgSocialCreditScore || 0)}/1000</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Alert className="bg-slate-700/50 border-orange-500/20 mt-4">
                  <Lock className="h-4 w-4 text-orange-400" />
                  <AlertDescription className="text-orange-200">
                    Exported data includes sensitive wallet intelligence. Handle with appropriate security measures.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ENHANCED AI TESTING TAB - Memory & Emotional Intelligence */}
          <TabsContent value="enhanced-ai" className="space-y-6">
            <EnhancedAITestingInterface />
          </TabsContent>

          {/* 5. SCORING METHODOLOGY TAB - Complete Scoring Framework */}
          <TabsContent value="scoring" className="space-y-6">
            
            {/* Overall Scoring Framework */}
            <Card className="bg-slate-800/50 border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-400" />
                  Wallet Intelligence Scoring Framework
                </CardTitle>
                <CardDescription className="text-indigo-200">
                  Complete methodology for the 0-1000 point social credit scoring system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400 mb-2">0-200</div>
                    <div className="text-sm text-red-300">Low Risk</div>
                    <div className="text-xs text-slate-400 mt-1">Minimal activity, new accounts</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">201-500</div>
                    <div className="text-sm text-yellow-300">Medium</div>
                    <div className="text-xs text-slate-400 mt-1">Regular users, moderate activity</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400 mb-2">501-750</div>
                    <div className="text-sm text-blue-300">High Value</div>
                    <div className="text-xs text-slate-400 mt-1">Active traders, good patterns</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400 mb-2">751-1000</div>
                    <div className="text-sm text-green-300">Elite</div>
                    <div className="text-xs text-slate-400 mt-1">Whales, influencers, innovators</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Core Scoring Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Trading Behavior (25%) */}
              <Card className="bg-slate-800/50 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Trading Behavior (25%)
                  </CardTitle>
                  <CardDescription className="text-indigo-200">
                    Transaction patterns, volume analysis, and trading frequency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Volume per Transaction</span>
                      <Badge className="bg-green-600">0-100 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Trading Frequency</span>
                      <Badge className="bg-green-600">0-75 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Timing Patterns</span>
                      <Badge className="bg-green-600">0-50 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Market Timing</span>
                      <Badge className="bg-green-600">0-25 pts</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Quality (20%) */}
              <Card className="bg-slate-800/50 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    Portfolio Quality (20%)
                  </CardTitle>
                  <CardDescription className="text-indigo-200">
                    Asset diversity, blue-chip holdings, and DeFi participation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Asset Diversity</span>
                      <Badge className="bg-yellow-600">0-80 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Blue-chip Holdings</span>
                      <Badge className="bg-yellow-600">0-60 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">DeFi Participation</span>
                      <Badge className="bg-yellow-600">0-40 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Portfolio Balance</span>
                      <Badge className="bg-yellow-600">0-20 pts</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Activity (15%) */}
              <Card className="bg-slate-800/50 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    Network Activity (15%)
                  </CardTitle>
                  <CardDescription className="text-indigo-200">
                    Social connections, influence metrics, and community engagement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Social Connections</span>
                      <Badge className="bg-blue-600">0-60 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Influence Score</span>
                      <Badge className="bg-blue-600">0-45 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Community Engagement</span>
                      <Badge className="bg-blue-600">0-30 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Viral Potential</span>
                      <Badge className="bg-blue-600">0-15 pts</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment (15%) */}
              <Card className="bg-slate-800/50 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-400" />
                    Risk Assessment (15%)
                  </CardTitle>
                  <CardDescription className="text-indigo-200">
                    Suspicious activity detection and compliance flags
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Clean Transaction History</span>
                      <Badge className="bg-green-600">+60 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">No Compliance Flags</span>
                      <Badge className="bg-green-600">+45 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Suspicious Activity</span>
                      <Badge className="bg-red-600">-150 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Mixer/Tornado Usage</span>
                      <Badge className="bg-red-600">-45 pts</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wealth Indicators (10%) */}
              <Card className="bg-slate-800/50 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    Wealth Indicators (10%)
                  </CardTitle>
                  <CardDescription className="text-indigo-200">
                    Total holdings, transaction sizes, and liquidity depth
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Total Portfolio Value</span>
                      <Badge className="bg-green-600">0-40 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Avg Transaction Size</span>
                      <Badge className="bg-green-600">0-30 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Liquidity Provision</span>
                      <Badge className="bg-green-600">0-20 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Staking Activities</span>
                      <Badge className="bg-green-600">0-10 pts</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Innovation Adoption (10%) */}
              <Card className="bg-slate-800/50 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-400" />
                    Innovation Adoption (10%)
                  </CardTitle>
                  <CardDescription className="text-indigo-200">
                    Early adopter behavior and new protocol usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Early Adopter Score</span>
                      <Badge className="bg-purple-600">0-40 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">New Protocol Usage</span>
                      <Badge className="bg-purple-600">0-30 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">NFT Activity</span>
                      <Badge className="bg-purple-600">0-20 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Innovation Index</span>
                      <Badge className="bg-purple-600">0-10 pts</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* AI Enhancement & Score Validation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* AI Enhancement Factors */}
              <Card className="bg-slate-800/50 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-indigo-400" />
                    AI Enhancement Factors
                  </CardTitle>
                  <CardDescription className="text-indigo-200">
                    Machine learning pattern recognition and behavioral analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Pattern Recognition Bonus</span>
                      <Badge className="bg-indigo-600">0-50 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Behavioral Anomaly Detection</span>
                      <Badge className="bg-orange-600">±30 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Cross-chain Analysis</span>
                      <Badge className="bg-indigo-600">0-25 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Predictive Adjustments</span>
                      <Badge className="bg-indigo-600">±20 pts</Badge>
                    </div>
                  </div>
                  <Alert className="bg-slate-700/50 border-indigo-500/20">
                    <Brain className="h-4 w-4 text-indigo-400" />
                    <AlertDescription className="text-indigo-200">
                      AI enhancements are applied after base scoring calculation and can significantly boost high-performing wallets.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Score Validation & Quality */}
              <Card className="bg-slate-800/50 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Score Validation & Quality
                  </CardTitle>
                  <CardDescription className="text-indigo-200">
                    Confidence intervals and data quality metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">High Confidence (90%+)</span>
                      <Badge className="bg-green-600">Complete Data</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Medium Confidence (70-89%)</span>
                      <Badge className="bg-yellow-600">Partial Data</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Low Confidence (&lt;70%)</span>
                      <Badge className="bg-red-600">Limited Data</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">Manual Override Available</span>
                      <Badge className="bg-purple-600">Admin Control</Badge>
                    </div>
                  </div>
                  <Alert className="bg-slate-700/50 border-green-500/20">
                    <Lock className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-200">
                      All scores include confidence intervals. Lower confidence scores are flagged for manual review.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

            </div>

          </TabsContent>

          {/* 6. FLUTTERINA AI MANAGEMENT TAB */}
          <TabsContent value="flutterina" className="space-y-6">
            <FlutterinaAdminPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default FlutterAIDashboard;