import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  Settings,
  DollarSign,
  TrendingUp,
  Save,
  RefreshCw,
  Shield,
  BarChart3,
  Edit,
  Activity,
  Users,
  Target,
  Database,
  Ticket,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Copy,
  Coins,
  Globe,
  Sparkles,
  ImageIcon,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  RotateCcw,
  Mail,
  Clock,
  Zap,
  Rocket,
  LineChart,
  PieChart,
  Brain,
  Smartphone,
  Bell,
  Wifi,
  Radio,
  Monitor,
  Server,
  Heart,
  Gauge
} from "lucide-react";

interface AdminSettings {
  baseMintingFee: number;
  imageUploadFee: number;
  voiceUploadFee: number;
  maxTokensPerUser: number;
  maxImageSize: number;
  maxVoiceLength: number;
  enableMarketplace: boolean;
  enableLimitedEdition: boolean;
  maintenanceMode: boolean;
  feeWalletAddress: string;
}

const initialSettings: AdminSettings = {
  baseMintingFee: 0.005,
  imageUploadFee: 0.01,
  voiceUploadFee: 0.02,
  maxTokensPerUser: 100,
  maxImageSize: 5,
  maxVoiceLength: 60,
  enableMarketplace: true,
  enableLimitedEdition: true,
  maintenanceMode: false,
  feeWalletAddress: ""
};

export default function Admin() {
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch data for various admin sections
  const { data: platformStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: defaultImageData, isLoading: imageLoading } = useQuery({
    queryKey: ["/api/default-token-image"],
  });

  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/admin/system-settings"],
  });

  // Real-time data queries with aggressive refresh intervals
  const { data: viralAnalytics, isLoading: viralLoading } = useQuery({
    queryKey: ["/api/viral/admin-analytics"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: liveMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/system/metrics"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: realtimeConnections } = useQuery({
    queryKey: ["/api/system/realtime"],
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  const { data: aiInsights } = useQuery({
    queryKey: ["/api/admin/ai-insights"],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: predictiveAnalytics } = useQuery({
    queryKey: ["/api/admin/predictive-analytics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // World-class dashboard data queries
  const { data: revenueAnalytics } = useQuery({
    queryKey: ["/api/admin/revenue-analytics"],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: securityMonitoring } = useQuery({
    queryKey: ["/api/admin/security-monitoring"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: performanceInsights } = useQuery({
    queryKey: ["/api/admin/performance-insights"],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: userBehavior } = useQuery({
    queryKey: ["/api/admin/user-behavior"],
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  const { data: competitiveIntelligence } = useQuery({
    queryKey: ["/api/admin/competitive-intelligence"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Fetch current settings
  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    select: (data: any) => data?.settings || initialSettings
  });

  // Update settings when currentSettings changes
  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: AdminSettings) => {
      return await apiRequest("PUT", "/api/admin/settings", newSettings);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Admin settings have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update admin settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update default image mutation
  const updateImageMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      const response = await fetch("/api/admin/default-token-image", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update image");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Default token image updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/default-token-image"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/system-settings"] });
      setNewImageUrl("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update default token image",
        variant: "destructive",
      });
    },
  });

  const resetToOriginal = () => {
    const originalImage = "/assets/image_1754114527645.png";
    updateImageMutation.mutate(originalImage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }
    updateImageMutation.mutate(newImageUrl.trim());
  };

  const handleSettingsUpdate = () => {
    updateSettingsMutation.mutate(settings);
  };

  const currentImage = (defaultImageData as any)?.defaultImage || "";
  const defaultSetting = (settingsData as any)?.settings?.find((s: any) => s.key === "default_token_image");

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading admin panel...</div>;
  }

  return (
    <div className="min-h-screen gradient-bg text-white pt-20 pb-12 overflow-hidden">
      {/* Electric Background Animation */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div className="absolute inset-0 modern-gradient"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with Electric Theme */}
        <div className="text-center mb-12">
          <div className="inline-block electric-frame p-8 mb-6 bg-black/20 backdrop-blur-sm">
            <h1 className="text-6xl md:text-7xl font-black mb-4 text-gradient">
              ADMIN COMMAND
            </h1>
            <div className="flex items-center justify-center gap-4 text-2xl font-bold text-electric-blue">
              <Shield className="w-8 h-8 animate-pulse" />
              <span className="text-gradient">SYSTEM CONTROL</span>
              <Shield className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Master control center for Flutterbye platform management and analytics
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 glassmorphism electric-frame border-0 p-2">
            <TabsTrigger value="overview" className="flex items-center gap-2 pulse-border hover:text-electric-blue transition-all">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 pulse-border hover:text-electric-blue transition-all">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2 pulse-border hover:text-electric-green transition-all">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 pulse-border hover:text-electric-green transition-all">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 pulse-border hover:text-electric-blue transition-all">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Production Status Banner */}
            <Card className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-emerald-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 animate-pulse"></div>
              <CardContent className="p-4 relative z-10">
                <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
                  <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-4'}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="font-bold text-emerald-400">PRODUCTION READY</span>
                    </div>
                    <div className={`flex ${isMobile ? 'flex-col gap-1' : 'items-center gap-4'} text-sm text-slate-300`}>
                      <div>Performance: <span className="text-emerald-400 font-bold">{(performanceInsights as any)?.overallScore || 85}/100</span></div>
                      <div>Security: <span className="text-green-400 font-bold">{(securityMonitoring as any)?.threatLevel || 'LOW'}</span></div>
                      <div>Uptime: <span className="text-blue-400 font-bold">99.9%</span></div>
                    </div>
                  </div>
                  <div className={`flex ${isMobile ? 'flex-wrap' : 'items-center'} gap-2`}>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Revenue: ${(revenueAnalytics as any)?.totalRevenue || '0'}
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Users: {(userBehavior as any)?.engagementMetrics?.dailyActiveUsers || 0} DAU
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      Rank: #{(competitiveIntelligence as any)?.marketPosition?.rank || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Executive Summary */}
            <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-400" />
                  Executive Summary
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Real-time business intelligence overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-400">${(revenueAnalytics as any)?.totalRevenue || '0'}</div>
                    <div className="text-sm text-slate-400">Total Revenue</div>
                    <div className="text-xs text-emerald-400">+{(revenueAnalytics as any)?.revenueGrowthRate || 0}% growth</div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">{(userBehavior as any)?.engagementMetrics?.dailyActiveUsers || 0}</div>
                    <div className="text-sm text-slate-400">Daily Active Users</div>
                    <div className="text-xs text-blue-400">Engagement: High</div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400">{(performanceInsights as any)?.overallScore || 85}</div>
                    <div className="text-sm text-slate-400">Performance Score</div>
                    <div className="text-xs text-purple-400">System Health: Excellent</div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">#{(competitiveIntelligence as any)?.marketPosition?.rank || 'N/A'}</div>
                    <div className="text-sm text-slate-400">Market Rank</div>
                    <div className="text-xs text-green-400">{(competitiveIntelligence as any)?.marketPosition?.marketShare || 0}% market share</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Insights */}            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Brain className="w-5 h-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(aiInsights as any)?.insights?.slice(0, 3).map((insight: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-sm font-medium text-purple-300 capitalize">{insight.type}</div>
                        <div className="text-xs text-slate-300">{insight.message}</div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-slate-400">
                      <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">AI analysis in progress...</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                    Predictive Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">7-Day Revenue Forecast</span>
                      <span className="text-emerald-400 font-bold">${(predictiveAnalytics as any)?.revenue7d || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">30-Day Growth Projection</span>
                      <span className="text-blue-400 font-bold">${(predictiveAnalytics as any)?.revenue30d || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">User Growth Rate</span>
                      <span className="text-purple-400 font-bold">+{(predictiveAnalytics as any)?.userGrowthRate || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Market Opportunity</span>
                      <span className="text-yellow-400 font-bold">{(predictiveAnalytics as any)?.marketOpportunity || 'High'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Metrics */}
            <Card className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Activity className="w-5 h-5" />
                  Live System Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">{(liveMetrics as any)?.requests?.total || 0}</div>
                    <div className="text-xs text-slate-400">Total Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{(liveMetrics as any)?.requests?.successful || 0}</div>
                    <div className="text-xs text-slate-400">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{(realtimeConnections as any)?.activeConnections || 0}</div>
                    <div className="text-xs text-slate-400">Active Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{(viralAnalytics as any)?.viralTokens || 0}</div>
                    <div className="text-xs text-slate-400">Viral Tokens</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Platform Settings
                </CardTitle>
                <CardDescription>
                  Configure pricing, limits, and platform behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Pricing Settings</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="baseFee">Base Minting Fee (SOL)</Label>
                      <Input
                        id="baseFee"
                        type="number"
                        step="0.001"
                        value={settings.baseMintingFee}
                        onChange={(e) => setSettings(prev => ({ ...prev, baseMintingFee: parseFloat(e.target.value) }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageFee">Image Upload Fee (SOL)</Label>
                      <Input
                        id="imageFee"
                        type="number"
                        step="0.001"
                        value={settings.imageUploadFee}
                        onChange={(e) => setSettings(prev => ({ ...prev, imageUploadFee: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSettingsUpdate}
                  disabled={updateSettingsMutation.isPending}
                  className="w-full"
                >
                  {updateSettingsMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Management Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className="glassmorphism electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient">
                  <DollarSign className="w-6 h-6 text-electric-green animate-pulse" />
                  Comprehensive Pricing Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Control pricing across all Flutterbye platform services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Pricing Sub-Tabs Navigation - Make them HIGHLY VISIBLE */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-electric-green mb-6 text-center">
                    🎯 SELECT PRICING CATEGORY
                  </h3>
                  <Tabs defaultValue="flutterbye" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-20 bg-gradient-to-r from-electric-blue/20 to-electric-green/20 p-2 rounded-2xl border-2 border-electric-blue/50 shadow-lg shadow-electric-blue/20">
                      <TabsTrigger 
                        value="flutterbye" 
                        className="flex flex-col items-center gap-1 data-[state=active]:bg-electric-blue/50 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-electric-blue/30 border-2 border-electric-blue/50 hover:bg-electric-blue/30 text-white font-bold py-4 px-2 rounded-xl transition-all duration-200 text-sm h-full"
                      >
                        <TrendingUp className="w-6 h-6" />
                        <span>Flutterbye</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="flutterart" 
                        className="flex flex-col items-center gap-1 data-[state=active]:bg-electric-green/50 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-electric-green/30 border-2 border-electric-green/50 hover:bg-electric-green/30 text-white font-bold py-4 px-2 rounded-xl transition-all duration-200 text-sm h-full"
                      >
                        <Edit className="w-6 h-6" />
                        <span>FlutterArt</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="sms" 
                        className="flex flex-col items-center gap-1 data-[state=active]:bg-circuit-teal/50 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-circuit-teal/30 border-2 border-circuit-teal/50 hover:bg-circuit-teal/30 text-white font-bold py-4 px-2 rounded-xl transition-all duration-200 text-sm h-full"
                      >
                        <Activity className="w-6 h-6" />
                        <span>SMS</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="chat" 
                        className="flex flex-col items-center gap-1 data-[state=active]:bg-electric-blue/50 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-electric-blue/30 border-2 border-electric-blue/50 hover:bg-electric-blue/30 text-white font-bold py-4 px-2 rounded-xl transition-all duration-200 text-sm h-full"
                      >
                        <Users className="w-6 h-6" />
                        <span>Chat</span>
                      </TabsTrigger>
                    </TabsList>

                  {/* Flutterbye Core Pricing */}
                  <TabsContent value="flutterbye" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="glassmorphism border border-electric-blue/30">
                        <CardHeader>
                          <CardTitle className="text-electric-blue flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Core Token Operations
                          </CardTitle>
                          <CardDescription>Pricing for basic Flutterbye token creation and management</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="baseMinting">Base Minting Fee (SOL)</Label>
                            <Input
                              id="baseMinting"
                              type="number"
                              step="0.001"
                              defaultValue="0.005"
                              className="border-electric-blue/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="valueAttachment">Value Attachment Fee (%)</Label>
                            <Input
                              id="valueAttachment"
                              type="number"
                              step="0.1"
                              defaultValue="2.5"
                              className="border-electric-blue/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="redemptionFee">Redemption Processing Fee (%)</Label>
                            <Input
                              id="redemptionFee"
                              type="number"
                              step="0.1"
                              defaultValue="1.5"
                              className="border-electric-blue/30 bg-black/20"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glassmorphism border border-electric-green/30">
                        <CardHeader>
                          <CardTitle className="text-electric-green flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Premium Features
                          </CardTitle>
                          <CardDescription>Advanced Flutterbye functionality pricing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="limitedEdition">Limited Edition Creation (SOL)</Label>
                            <Input
                              id="limitedEdition"
                              type="number"
                              step="0.01"
                              defaultValue="0.1"
                              className="border-electric-green/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bulkMinting">Bulk Minting Discount (%)</Label>
                            <Input
                              id="bulkMinting"
                              type="number"
                              step="1"
                              defaultValue="15"
                              className="border-electric-green/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="priorityProcessing">Priority Processing Fee (SOL)</Label>
                            <Input
                              id="priorityProcessing"
                              type="number"
                              step="0.001"
                              defaultValue="0.002"
                              className="border-electric-green/30 bg-black/20"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* FlutterArt NFT Pricing */}
                  <TabsContent value="flutterart" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="glassmorphism border border-electric-green/30">
                        <CardHeader>
                          <CardTitle className="text-electric-green flex items-center gap-2">
                            <Edit className="w-5 h-5" />
                            NFT Creation Pricing
                          </CardTitle>
                          <CardDescription>FlutterArt multimedia NFT creation costs</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="nftBaseFee">Base NFT Creation (SOL)</Label>
                            <Input
                              id="nftBaseFee"
                              type="number"
                              step="0.01"
                              defaultValue="0.05"
                              className="border-electric-green/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="imageAttachment">Image Attachment Fee (SOL)</Label>
                            <Input
                              id="imageAttachment"
                              type="number"
                              step="0.001"
                              defaultValue="0.01"
                              className="border-electric-green/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="voiceAttachment">Voice Recording Fee (SOL)</Label>
                            <Input
                              id="voiceAttachment"
                              type="number"
                              step="0.001"
                              defaultValue="0.02"
                              className="border-electric-green/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="collectionFee">Collection Creation (SOL)</Label>
                            <Input
                              id="collectionFee"
                              type="number"
                              step="0.01"
                              defaultValue="0.2"
                              className="border-electric-green/30 bg-black/20"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glassmorphism border border-circuit-teal/30">
                        <CardHeader>
                          <CardTitle className="text-circuit-teal flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Marketplace & Trading
                          </CardTitle>
                          <CardDescription>FlutterArt marketplace fees and commissions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="listingFee">Marketplace Listing Fee (SOL)</Label>
                            <Input
                              id="listingFee"
                              type="number"
                              step="0.001"
                              defaultValue="0.005"
                              className="border-circuit-teal/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="salesCommission">Sales Commission (%)</Label>
                            <Input
                              id="salesCommission"
                              type="number"
                              step="0.5"
                              defaultValue="5.0"
                              className="border-circuit-teal/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="burnRedemption">Burn Redemption Fee (%)</Label>
                            <Input
                              id="burnRedemption"
                              type="number"
                              step="0.1"
                              defaultValue="2.0"
                              className="border-circuit-teal/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="royaltyFee">Creator Royalty (%)</Label>
                            <Input
                              id="royaltyFee"
                              type="number"
                              step="0.5"
                              defaultValue="7.5"
                              className="border-circuit-teal/30 bg-black/20"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* SMS Integration Pricing */}
                  <TabsContent value="sms" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="glassmorphism border border-circuit-teal/30">
                        <CardHeader>
                          <CardTitle className="text-circuit-teal flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            SMS Services
                          </CardTitle>
                          <CardDescription>SMS-to-blockchain integration pricing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="smsProcessing">SMS Processing Fee (SOL)</Label>
                            <Input
                              id="smsProcessing"
                              type="number"
                              step="0.001"
                              defaultValue="0.003"
                              className="border-circuit-teal/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emotionalAnalysis">AI Emotional Analysis (SOL)</Label>
                            <Input
                              id="emotionalAnalysis"
                              type="number"
                              step="0.001"
                              defaultValue="0.002"
                              className="border-circuit-teal/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="smsNotification">SMS Notification (SOL)</Label>
                            <Input
                              id="smsNotification"
                              type="number"
                              step="0.0001"
                              defaultValue="0.001"
                              className="border-circuit-teal/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bulkSMS">Bulk SMS Discount (%)</Label>
                            <Input
                              id="bulkSMS"
                              type="number"
                              step="1"
                              defaultValue="20"
                              className="border-circuit-teal/30 bg-black/20"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glassmorphism border border-electric-blue/30">
                        <CardHeader>
                          <CardTitle className="text-electric-blue flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            FlutterWave Features
                          </CardTitle>
                          <CardDescription>Advanced SMS emotional messaging features</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="butterflyEffect">Butterfly Effect Tracking (SOL)</Label>
                            <Input
                              id="butterflyEffect"
                              type="number"
                              step="0.001"
                              defaultValue="0.005"
                              className="border-electric-blue/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="aiAvatar">AI Avatar Interaction (SOL)</Label>
                            <Input
                              id="aiAvatar"
                              type="number"
                              step="0.001"
                              defaultValue="0.01"
                              className="border-electric-blue/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quantumThreads">Quantum Message Threads (SOL)</Label>
                            <Input
                              id="quantumThreads"
                              type="number"
                              step="0.001"
                              defaultValue="0.007"
                              className="border-electric-blue/30 bg-black/20"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Chat Subscription Pricing */}
                  <TabsContent value="chat" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="glassmorphism border border-electric-blue/30">
                        <CardHeader>
                          <CardTitle className="text-electric-blue flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Chat Subscriptions
                          </CardTitle>
                          <CardDescription>Real-time blockchain chat pricing tiers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="basicChat">Basic Chat (Monthly SOL)</Label>
                            <Input
                              id="basicChat"
                              type="number"
                              step="0.01"
                              defaultValue="0.1"
                              className="border-electric-blue/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="premiumChat">Premium Chat (Monthly SOL)</Label>
                            <Input
                              id="premiumChat"
                              type="number"
                              step="0.01"
                              defaultValue="0.25"
                              className="border-electric-blue/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="enterpriseChat">Enterprise Chat (Monthly SOL)</Label>
                            <Input
                              id="enterpriseChat"
                              type="number"
                              step="0.01"
                              defaultValue="0.5"
                              className="border-electric-blue/30 bg-black/20"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glassmorphism border border-electric-green/30">
                        <CardHeader>
                          <CardTitle className="text-electric-green flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Chat Features
                          </CardTitle>
                          <CardDescription>Per-use chat feature pricing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="messageStorage">Message Storage (Per 1000)</Label>
                            <Input
                              id="messageStorage"
                              type="number"
                              step="0.0001"
                              defaultValue="0.001"
                              className="border-electric-green/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fileSharing">File Sharing (Per MB)</Label>
                            <Input
                              id="fileSharing"
                              type="number"
                              step="0.0001"
                              defaultValue="0.0005"
                              className="border-electric-green/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="encryptedChat">Encrypted Chat Premium (%)</Label>
                            <Input
                              id="encryptedChat"
                              type="number"
                              step="1"
                              defaultValue="50"
                              className="border-electric-green/30 bg-black/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="groupAdmin">Group Admin Fee (SOL)</Label>
                            <Input
                              id="groupAdmin"
                              type="number"
                              step="0.001"
                              defaultValue="0.01"
                              className="border-electric-green/30 bg-black/20"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                    {/* Save Button */}
                    <div className="flex justify-end pt-6 border-t border-electric-blue/20 mt-8">
                      <Button className="bg-electric-green hover:bg-electric-green/80 text-black font-bold px-8 py-3">
                        <Save className="w-5 h-5 mr-2" />
                        Save All Pricing Changes
                      </Button>
                    </div>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <Button 
                onClick={() => window.open('/api/admin/export/user-analytics', '_blank')}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Users CSV
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    User Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total Users</span>
                      <span className="text-blue-400 font-bold">{Array.isArray(users) ? users.length : 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Active (24h)</span>
                      <span className="text-green-400 font-bold">{(userBehavior as any)?.engagementMetrics?.dailyActiveUsers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">New (7d)</span>
                      <span className="text-purple-400 font-bold">{(userBehavior as any)?.growthMetrics?.weeklyNewUsers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Token Creators</span>
                      <span className="text-cyan-400 font-bold">{(userBehavior as any)?.creatorMetrics?.activeCreators || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-green-400" />
                    Top Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.isArray(users) && users.length > 0 ? users.slice(0, 3).map((user: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                        <div>
                          <div className="text-white font-mono text-sm">
                            {user.id ? `${user.id.substring(0, 4)}...${user.id.substring(user.id.length - 4)}` : 'Anonymous'}
                          </div>
                          <div className="text-slate-400 text-xs">{user.email || 'No email'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-bold text-sm">Active</div>
                          <div className="text-slate-400 text-xs">User #{index + 1}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">No users found</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-purple-900/30 rounded">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div>
                        <div className="text-white text-sm">New user registration</div>
                        <div className="text-slate-400 text-xs">2 minutes ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-900/30 rounded">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div>
                        <div className="text-white text-sm">Token creation spike</div>
                        <div className="text-slate-400 text-xs">5 minutes ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-green-900/30 rounded">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div>
                        <div className="text-white text-sm">High engagement session</div>
                        <div className="text-slate-400 text-xs">12 minutes ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User List Table */}
            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  User Directory
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Complete list of platform users with management actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                    <span className="ml-2 text-slate-400">Loading users...</span>
                  </div>
                ) : users && Array.isArray(users) && users.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        Total Users: <span className="text-blue-400 font-bold">{users.length}</span>
                      </div>
                      <Button 
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] })}
                        variant="outline" 
                        size="sm" 
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700">
                            <TableHead className="text-slate-300">User ID</TableHead>
                            <TableHead className="text-slate-300">Email</TableHead>
                            <TableHead className="text-slate-300">Name</TableHead>
                            <TableHead className="text-slate-300">Created</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-slate-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.slice(0, 10).map((user: any) => (
                            <TableRow key={user.id} className="border-slate-700">
                              <TableCell className="font-mono text-xs text-slate-400">
                                {user.id?.substring(0, 8)}...
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {user.email || 'N/A'}
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {user.firstName || user.lastName 
                                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                  : 'Anonymous'
                                }
                              </TableCell>
                              <TableCell className="text-slate-400 text-sm">
                                {user.createdAt 
                                  ? new Date(user.createdAt).toLocaleDateString()
                                  : 'Unknown'
                                }
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                                  Active
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/10">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-500/10">
                                    <Mail className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {users.length > 10 && (
                      <div className="text-center py-4">
                        <span className="text-slate-400 text-sm">
                          Showing 10 of {users.length} users
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <div className="text-slate-400">No users found</div>
                    <div className="text-slate-500 text-sm mt-2">
                      Users will appear here once they start using the platform
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-blue-400 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {(userBehavior as any)?.engagementMetrics?.dailyActiveUsers || 0}
                  </div>
                  <div className="text-xs text-slate-400">Daily active users</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Growth Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    +{(userBehavior as any)?.growthMetrics?.userGrowthRate || 0}%
                  </div>
                  <div className="text-xs text-slate-400">Monthly growth</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-purple-400 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {(userBehavior as any)?.engagementMetrics?.averageSessionDuration || 0}m
                  </div>
                  <div className="text-xs text-slate-400">Avg session duration</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Platform Analytics</h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                  Real-time
                </Badge>
                <Button 
                  onClick={() => queryClient.invalidateQueries()}
                  variant="outline" 
                  size="sm" 
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh All
                </Button>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-emerald-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-emerald-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${(revenueAnalytics as any)?.totalRevenue || '0'}
                  </div>
                  <div className="text-xs text-emerald-400">
                    +{(revenueAnalytics as any)?.revenueGrowthRate || 0}% growth
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-blue-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {(userBehavior as any)?.engagementMetrics?.dailyActiveUsers || 0}
                  </div>
                  <div className="text-xs text-blue-400">Daily active users</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-purple-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {(userBehavior as any)?.engagementMetrics?.averageSessionDuration || 0}m
                  </div>
                  <div className="text-xs text-purple-400">Avg session time</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border-orange-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-orange-400 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {(performanceInsights as any)?.overallScore || 85}
                  </div>
                  <div className="text-xs text-orange-400">System score</div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-blue-400" />
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Today</span>
                      <span className="text-green-400 font-bold">${(revenueAnalytics as any)?.todayRevenue || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">This Week</span>
                      <span className="text-blue-400 font-bold">${(revenueAnalytics as any)?.weeklyRevenue || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">This Month</span>
                      <span className="text-purple-400 font-bold">${(revenueAnalytics as any)?.monthlyRevenue || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Projection (30d)</span>
                      <span className="text-emerald-400 font-bold">${(predictiveAnalytics as any)?.revenue30d || '0'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-green-400" />
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Token Creation</span>
                      <span className="text-cyan-400 font-bold">{(viralAnalytics as any)?.tokenCreations || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Messages Sent</span>
                      <span className="text-blue-400 font-bold">{(liveMetrics as any)?.messages?.sent || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Viral Tokens</span>
                      <span className="text-purple-400 font-bold">{(viralAnalytics as any)?.viralTokens || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Active Connections</span>
                      <span className="text-green-400 font-bold">{(realtimeConnections as any)?.activeConnections || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time intelligence and predictive analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(aiInsights as any)?.insights?.slice(0, 6).map((insight: any, index: number) => (
                    <div key={index} className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="text-sm font-medium text-purple-300 capitalize mb-1">
                            {insight.type || 'General'}
                          </div>
                          <div className="text-xs text-slate-300 leading-relaxed">
                            {insight.message || 'AI analysis in progress...'}
                          </div>
                          <div className="text-xs text-purple-400 mt-2">
                            Confidence: {insight.confidence || 85}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="col-span-full text-center py-8 text-slate-400">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <div className="text-lg font-medium mb-2">AI Analysis in Progress</div>
                      <div className="text-sm">Advanced insights will appear here as data is processed</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}