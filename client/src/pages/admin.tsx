import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { AdminPricingManagement } from "@/components/admin-pricing-management";
import { SkyeKnowledgeAdmin } from "@/components/skye-knowledge-admin";

import { 
  Settings, 
  Users, 
  DollarSign, 
  BarChart3, 
  Shield, 
  Database,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Save,
  Copy,
  TrendingUp,
  Activity,
  UserCheck,
  Coins,
  Globe,
  Ticket,
  Target,
  Sparkles,
  ImageIcon,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";

interface AdminSettings {
  baseMintingFee: number;
  imageUploadFee: number;
  maxMessageLength: number;
  maxImageSize: number;
  platformEnabled: boolean;
  maintenanceMode: boolean;
  allowedCurrencies: string[];
  minValueAttachment: number;
  maxValueAttachment: number;
  redemptionTimeoutHours: number;
}

interface UserData {
  id: string;
  walletAddress: string;
  totalTokensMinted: number;
  totalValueAttached: number;
  totalRedemptions: number;
  joinedAt: string;
  lastActive: string;
  isBlocked: boolean;
  riskScore: number;
}

interface PlatformStats {
  totalUsers: number;
  totalTokens: number;
  totalValueEscrowed: number;
  totalRedemptions: number;
  activeUsers24h: number;
  revenueToday: number;
  topTokens: Array<{
    id: string;
    message: string;
    attachedValue: number;
    redemptions: number;
  }>;
}

interface MarketingAnalytics {
  userAcquisition: {
    totalSignups: number;
    signupsLast7Days: number;
    signupsLast30Days: number;
    acquisitionChannels: Array<{
      channel: string;
      users: number;
      percentage: number;
    }>;
  };
  userEngagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    retentionRates: {
      day1: number;
      day7: number;
      day30: number;
    };
  };
  tokenMetrics: {
    averageTokensPerUser: number;
    totalValueAttached: number;
    averageValuePerToken: number;
    redemptionRate: number;
    topMessageCategories: Array<{
      category: string;
      count: number;
      totalValue: number;
    }>;
  };
  geographicData: Array<{
    region: string;
    users: number;
    tokens: number;
    revenue: number;
  }>;
  deviceData: Array<{
    device: string;
    users: number;
    percentage: number;
  }>;
}

interface UserBehaviorInsights {
  mostActiveTimeSlots: Array<{
    hour: number;
    activityCount: number;
  }>;
  popularFeatures: Array<{
    feature: string;
    usageCount: number;
    conversionRate: number;
  }>;
  userJourneyFunnels: {
    signupToFirstMint: number;
    firstMintToSecondMint: number;
    mintToValueAttachment: number;
    valueAttachmentToRedemption: number;
  };
  churnAnalysis: {
    churnRate: number;
    atRiskUsers: number;
    topChurnReasons: Array<{
      reason: string;
      percentage: number;
    }>;
  };
}

interface RevenueAnalytics {
  totalRevenue: number;
  revenueGrowth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  revenueByFeature: Array<{
    feature: string;
    revenue: number;
    percentage: number;
  }>;
  averageRevenuePerUser: number;
  lifetimeValue: number;
  paymentMethods: Array<{
    method: string;
    usage: number;
    revenue: number;
  }>;
}

interface RedemptionAnalytics {
  id: string;
  codeId: string;
  userId: string;
  walletAddress: string;
  tokenId?: string;
  ipAddress?: string;
  userAgent?: string;
  savingsAmount: string;
  originalCost: string;
  referralSource?: string;
  geolocation?: any;
  metadata?: any;
  timestamp: string;
}

interface PricingConfig {
  id: string;
  configKey: string;
  configValue: string;
  currency: string;
  description?: string;
  category: string;
  isActive: boolean;
  updatedAt: Date;
  updatedBy?: string;
}

interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: Record<string, any>;
  timestamp: string;
}

export default function AdminDashboard() {
  const [selectedUserId, setSelectedUserId] = useState("");

  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>({
    baseMintingFee: 0.01,
    imageUploadFee: 0.005,
    maxMessageLength: 27,
    maxImageSize: 5,
    platformEnabled: true,
    maintenanceMode: false,
    allowedCurrencies: ["SOL", "USDC"],
    minValueAttachment: 0.001,
    maxValueAttachment: 100,
    redemptionTimeoutHours: 24,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Data fetching queries
  const { data: platformStats, isLoading: statsLoading } = useQuery<PlatformStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<UserData[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: adminLogs = [], isLoading: logsLoading } = useQuery<AdminLog[]>({
    queryKey: ["/api/admin/logs"],
  });

  const { data: marketingData, isLoading: marketingLoading } = useQuery<MarketingAnalytics>({
    queryKey: ["/api/admin/marketing"],
  });

  const { data: behaviorData, isLoading: behaviorLoading } = useQuery<UserBehaviorInsights>({
    queryKey: ["/api/admin/behavior"],
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery<RevenueAnalytics>({
    queryKey: ["/api/admin/revenue"],
  });

  const { data: currentSettings, isLoading: settingsLoading } = useQuery<AdminSettings>({
    queryKey: ["/api/admin/settings"],
  });

  // New comprehensive data queries
  const { data: redemptionAnalytics = [], isLoading: redemptionLoading } = useQuery<RedemptionAnalytics[]>({
    queryKey: ["/api/admin/redemption-analytics"],
    select: (data: any) => data?.analytics || []
  });

  const { data: pricingConfig = [], isLoading: pricingLoading } = useQuery<PricingConfig[]>({
    queryKey: ["/api/admin/pricing-config"],
    select: (data: any) => data?.pricingConfig || []
  });

  // Update settings when currentSettings changes
  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  // Mutations for admin actions
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: AdminSettings) => {
      return await apiRequest("PUT", "/api/admin/settings", newSettings);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Platform settings have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
    },
  });

  const toggleUserBlockMutation = useMutation({
    mutationFn: async ({ userId, blocked }: { userId: string; blocked: boolean }) => {
      return await apiRequest("PATCH", `/api/admin/users/${userId}/block`, { blocked });
    },
    onSuccess: () => {
      toast({
        title: "User Status Updated",
        description: "User block status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const generateCodesMutation = useMutation({
    mutationFn: async ({ type, count }: { type: string; count: number }) => {
      return await apiRequest("POST", "/api/admin/codes/generate", { type, count });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Codes Generated",
        description: `Generated ${data.count} new redemption codes.`,
      });
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: async (dataType: string) => {
      return await apiRequest("POST", "/api/admin/export", { dataType });
    },
    onSuccess: (data: any) => {
      // Trigger download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flutterbye_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Data has been exported and downloaded.",
      });
    },
  });

  // Pricing configuration mutation
  const updatePricingMutation = useMutation({
    mutationFn: async ({ key, value, currency }: { key: string; value: string; currency?: string }) => {
      return await apiRequest("POST", "/api/admin/pricing-config", { key, value, currency });
    },
    onSuccess: () => {
      toast({
        title: "Pricing Updated",
        description: "Pricing configuration has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pricing-config"] });
    },
  });

  const handleSettingsUpdate = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleUserBlock = (userId: string, currentlyBlocked: boolean) => {
    toggleUserBlockMutation.mutate({ userId, blocked: !currentlyBlocked });
  };

  const handleExportData = (dataType: string) => {
    exportDataMutation.mutate(dataType);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 4
    }).format(amount);
  };

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
          <TabsList className="grid w-full grid-cols-11 glassmorphism electric-frame border-0 p-2">
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
            <TabsTrigger value="content" className="flex items-center gap-2 pulse-border hover:text-circuit-teal transition-all">
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2 pulse-border hover:text-electric-green transition-all">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Marketing</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 pulse-border hover:text-electric-blue transition-all">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 pulse-border hover:text-electric-green transition-all">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="codes" className="flex items-center gap-2 pulse-border hover:text-circuit-teal transition-all">
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">Codes</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2 pulse-border hover:text-electric-blue transition-all">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2 pulse-border hover:text-electric-green transition-all">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
            <TabsTrigger value="skye" className="flex items-center gap-2 pulse-border hover:text-purple-400 transition-all">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Skye AI</span>
            </TabsTrigger>
            <TabsTrigger value="api-monetization" className="flex items-center gap-2 pulse-border hover:text-electric-green transition-all">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">API $</span>
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Live Platform Status Bar */}
            <div className="electric-frame p-4 glassmorphism">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-electric-green rounded-full animate-pulse"></div>
                    <span className="font-bold text-electric-green">SYSTEM ONLINE</span>
                  </div>
                  <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue">
                    Platform Active
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Server Status</div>
                  <div className="text-electric-green font-bold">99.9% Uptime</div>
                </div>
              </div>
            </div>

            {/* Quick Access Management */}
            <Card className="glassmorphism electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-electric-blue" />
                  Quick Access Management
                </CardTitle>
                <CardDescription>
                  Direct access to key admin management tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
                  <Link href="/admin/default-image">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                      <ImageIcon className="h-6 w-6" />
                      <span className="text-sm">Default Token Image</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Button>
                  </Link>
                  <Link href="/admin/pricing">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10">
                      <DollarSign className="h-6 w-6" />
                      <span className="text-sm">Pricing Control</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Button>
                  </Link>
                  <Link href="/admin/free-codes">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                      <Ticket className="h-6 w-6" />
                      <span className="text-sm">Free Codes</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Button>
                  </Link>
                  <Link href="/admin/early-access">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                      <Shield className="h-6 w-6" />
                      <span className="text-sm">Early Access</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Button>
                  </Link>
                  <Link href="/admin/api-monetization">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10">
                      <DollarSign className="h-6 w-6" />
                      <span className="text-sm">API Monetization</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Button>
                  </Link>
                  <Link href="/admin-custodial-wallet">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                      <Database className="h-6 w-6" />
                      <span className="text-sm">Custodial Wallets</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="premium-card electric-frame circuit-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Total Users</p>
                      <p className="text-3xl font-bold text-gradient">
                        {platformStats?.totalUsers?.toLocaleString() || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-electric-blue animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-4 h-4 text-electric-green" />
                    <p className="text-xs text-electric-green font-bold">
                      +{platformStats?.activeUsers24h || 0} active (24h)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card electric-frame circuit-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Total Tokens</p>
                      <p className="text-3xl font-bold text-gradient">
                        {platformStats?.totalTokens?.toLocaleString() || 0}
                      </p>
                    </div>
                    <Coins className="w-8 h-8 text-electric-green animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Sparkles className="w-4 h-4 text-circuit-teal" />
                    <p className="text-xs text-circuit-teal font-bold">
                      FLBY-MSG tokens minted
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card electric-frame circuit-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Value Escrowed</p>
                      <p className="text-3xl font-bold text-gradient">
                        {platformStats?.totalValueEscrowed?.toFixed(3) || 0} SOL
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-circuit-teal animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <RefreshCw className="w-4 h-4 text-electric-blue" />
                    <p className="text-xs text-electric-blue font-bold">
                      {platformStats?.totalRedemptions || 0} redemptions completed
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card electric-frame circuit-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Revenue Today</p>
                      <p className="text-3xl font-bold text-gradient">
                        {platformStats?.revenueToday?.toFixed(3) || 0} SOL
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-electric-green animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Activity className="w-4 h-4 text-warning-orange" />
                    <p className="text-xs text-warning-orange font-bold">
                      Platform fees collected
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Top Tokens Section */}
            <Card className="premium-card electric-frame circuit-glow">
              <CardHeader className="border-b border-electric-blue/20">
                <CardTitle className="flex items-center gap-2 text-gradient">
                  <TrendingUp className="w-6 h-6 text-electric-green animate-pulse" />
                  Top Performing Tokens
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Most successful tokenized messages with highest engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {platformStats?.topTokens && platformStats.topTokens.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-electric-blue/20 hover:bg-electric-blue/5">
                          <TableHead className="text-electric-blue font-bold">Message</TableHead>
                          <TableHead className="text-electric-green font-bold">Value Attached</TableHead>
                          <TableHead className="text-circuit-teal font-bold">Redemptions</TableHead>
                          <TableHead className="text-electric-blue font-bold">Performance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {platformStats?.topTokens?.map((token, index) => (
                          <TableRow key={token.id} className="border-electric-blue/10 hover:bg-electric-blue/5 transition-all">
                            <TableCell className="font-mono text-white">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-electric-blue/20 text-electric-blue">#{index + 1}</Badge>
                                {token.message}
                              </div>
                            </TableCell>
                            <TableCell className="text-electric-green font-bold">
                              {token.attachedValue.toFixed(3)} SOL
                            </TableCell>
                            <TableCell className="text-circuit-teal font-bold">
                              {token.redemptions}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  token.redemptions > 10 
                                    ? "bg-electric-green/20 text-electric-green border-electric-green animate-pulse" 
                                    : "bg-electric-blue/20 text-electric-blue border-electric-blue"
                                }
                              >
                                {token.redemptions > 10 ? "🔥 HOT" : "📈 ACTIVE"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <Coins className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No token performance data available</p>
                    </div>
                  )}
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

                    <div className="space-y-2">
                      <Label htmlFor="minValue">Min Value Attachment (SOL)</Label>
                      <Input
                        id="minValue"
                        type="number"
                        step="0.001"
                        value={settings.minValueAttachment}
                        onChange={(e) => setSettings(prev => ({ ...prev, minValueAttachment: parseFloat(e.target.value) }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxValue">Max Value Attachment (SOL)</Label>
                      <Input
                        id="maxValue"
                        type="number"
                        step="0.1"
                        value={settings.maxValueAttachment}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxValueAttachment: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Platform Controls</h4>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="platformEnabled">Platform Enabled</Label>
                      <Switch
                        id="platformEnabled"
                        checked={settings.platformEnabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, platformEnabled: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <Switch
                        id="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxMessage">Max Message Length</Label>
                      <Input
                        id="maxMessage"
                        type="number"
                        value={settings.maxMessageLength}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxMessageLength: parseInt(e.target.value) }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxImageSize">Max Image Size (MB)</Label>
                      <Input
                        id="maxImageSize"
                        type="number"
                        value={settings.maxImageSize}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxImageSize: parseInt(e.target.value) }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="redemptionTimeout">Redemption Timeout (Hours)</Label>
                      <Input
                        id="redemptionTimeout"
                        type="number"
                        value={settings.redemptionTimeoutHours}
                        onChange={(e) => setSettings(prev => ({ ...prev, redemptionTimeoutHours: parseInt(e.target.value) }))}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Redemption Code Analytics */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    Redemption Code Analytics
                  </CardTitle>
                  <CardDescription>Track free token redemption usage and user data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {redemptionLoading ? (
                    <div className="text-center py-4">Loading redemption analytics...</div>
                  ) : redemptionAnalytics.length > 0 ? (
                    <>
                      {/* Summary Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {redemptionAnalytics.length}
                          </div>
                          <div className="text-sm text-gray-400">Total Redemptions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {redemptionAnalytics.reduce((sum, r) => sum + parseFloat(r.savingsAmount || "0"), 0).toFixed(4)}
                          </div>
                          <div className="text-sm text-gray-400">Total Savings (SOL)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">
                            {new Set(redemptionAnalytics.map(r => r.walletAddress)).size}
                          </div>
                          <div className="text-sm text-gray-400">Unique Wallets</div>
                        </div>
                      </div>

                      {/* Recent Redemptions Table */}
                      <div className="space-y-2">
                        <h4 className="font-semibold">Recent Redemptions</h4>
                        <div className="max-h-64 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Wallet</TableHead>
                                <TableHead>Savings</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {redemptionAnalytics.slice(0, 10).map((redemption) => (
                                <TableRow key={redemption.id}>
                                  <TableCell className="font-mono text-xs">
                                    {redemption.walletAddress.slice(0, 8)}...{redemption.walletAddress.slice(-4)}
                                  </TableCell>
                                  <TableCell className="text-green-400">
                                    {parseFloat(redemption.savingsAmount || "0").toFixed(4)} SOL
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">
                                      {redemption.referralSource || 'Direct'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-xs">
                                    {new Date(redemption.timestamp).toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No redemption data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comprehensive Pricing Configuration */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pricing Configuration
                  </CardTitle>
                  <CardDescription>Centralized pricing management for all platform features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pricingLoading ? (
                    <div className="text-center py-4">Loading pricing config...</div>
                  ) : (
                    <>
                      {/* Pricing Categories */}
                      {['minting', 'features', 'value_attachment', 'discounts'].map((category) => {
                        const categoryConfig = pricingConfig.filter(p => p.category === category);
                        return (
                          <div key={category} className="space-y-2">
                            <h4 className="font-semibold capitalize text-blue-400">
                              {category.replace('_', ' ')} ({categoryConfig.length} items)
                            </h4>
                            <div className="space-y-2 pl-4">
                              {categoryConfig.map((config) => (
                                <div key={config.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">{config.description}</div>
                                    <div className="text-xs text-gray-400">{config.configKey}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      step="0.0001"
                                      defaultValue={config.configValue}
                                      className="w-24 h-8"
                                      onBlur={(e) => {
                                        if (e.target.value !== config.configValue) {
                                          updatePricingMutation.mutate({
                                            key: config.configKey,
                                            value: e.target.value,
                                            currency: config.currency
                                          });
                                        }
                                      }}
                                    />
                                    <Badge variant="outline">{config.currency}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {/* Quick Actions */}
                      <div className="pt-4 border-t border-gray-700">
                        <h4 className="font-semibold mb-2">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export Config
                          </Button>
                          <Button size="sm" variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Import Config
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Advanced Analytics Section */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  User Behavior Insights from Redemptions
                </CardTitle>
                <CardDescription>Detailed analytics from free token redemption data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {redemptionAnalytics.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Geographic Distribution */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Geographic Distribution
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(
                          redemptionAnalytics.reduce((acc, r) => {
                            const country = r.geolocation?.country || 'Unknown';
                            acc[country] = (acc[country] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).slice(0, 5).map(([country, count]) => (
                          <div key={country} className="flex justify-between items-center text-sm">
                            <span>{country}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Referral Sources */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Referral Sources
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(
                          redemptionAnalytics.reduce((acc, r) => {
                            const source = r.referralSource || 'Direct';
                            acc[source] = (acc[source] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).slice(0, 5).map(([source, count]) => (
                          <div key={source} className="flex justify-between items-center text-sm">
                            <span className="capitalize">{source}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Device Information */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Device Types
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(
                          redemptionAnalytics.reduce((acc, r) => {
                            const isMobile = r.userAgent?.toLowerCase().includes('mobile') ? 'Mobile' : 'Desktop';
                            acc[isMobile] = (acc[isMobile] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([device, count]) => (
                          <div key={device} className="flex justify-between items-center text-sm">
                            <span>{device}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No redemption data available for analysis
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Content Management System
                </CardTitle>
                <CardDescription>
                  Manage all frontend content, layouts, and styling across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Mode
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Content
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Content
                      </Button>
                    </div>
                  </div>

                  <Tabs defaultValue="text" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="text">Text Content</TabsTrigger>
                      <TabsTrigger value="images">Images</TabsTrigger>
                      <TabsTrigger value="layout">Layouts</TabsTrigger>
                      <TabsTrigger value="theme">Theme</TabsTrigger>
                    </TabsList>

                    <TabsContent value="text" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Text Content Management</CardTitle>
                          <CardDescription>Edit headlines, descriptions, and copy across all pages</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Page</Label>
                              <Select defaultValue="home">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="home">Home</SelectItem>
                                  <SelectItem value="mint">Mint</SelectItem>
                                  <SelectItem value="portfolio">Portfolio</SelectItem>
                                  <SelectItem value="marketplace">Marketplace</SelectItem>
                                  <SelectItem value="limited-edition">Limited Edition</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Content Type</Label>
                              <Select defaultValue="headline">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="headline">Headlines</SelectItem>
                                  <SelectItem value="description">Descriptions</SelectItem>
                                  <SelectItem value="cta">Call-to-Action</SelectItem>
                                  <SelectItem value="navigation">Navigation</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                              placeholder="Enter content text..."
                              className="min-h-[100px]"
                            />
                          </div>
                          
                          <Button className="w-full">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="images" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Image Asset Management</CardTitle>
                          <CardDescription>Upload and manage images, icons, and graphics</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                            <div className="mx-auto w-12 h-12 mb-4 text-muted-foreground">
                              <Upload className="w-full h-full" />
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              Drop images here or click to upload
                            </p>
                            <Button variant="outline">
                              Choose Files
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div className="aspect-square bg-muted rounded-lg p-2 flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No images</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="layout" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Layout Configuration</CardTitle>
                          <CardDescription>Adjust page layouts and component positioning</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Page Layout</Label>
                              <Select defaultValue="default">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="default">Default</SelectItem>
                                  <SelectItem value="full-width">Full Width</SelectItem>
                                  <SelectItem value="sidebar">With Sidebar</SelectItem>
                                  <SelectItem value="centered">Centered</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Component Spacing</Label>
                              <Select defaultValue="normal">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="tight">Tight</SelectItem>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="loose">Loose</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <Button className="w-full">
                            <Save className="w-4 h-4 mr-2" />
                            Apply Layout Changes
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="theme" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Theme Customization</CardTitle>
                          <CardDescription>Adjust colors, fonts, and visual styling</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Primary Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="color"
                                  defaultValue="#0066FF"
                                  className="w-16 h-10"
                                />
                                <Input defaultValue="#0066FF" className="flex-1" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Secondary Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="color"
                                  defaultValue="#00CC66"
                                  className="w-16 h-10"
                                />
                                <Input defaultValue="#00CC66" className="flex-1" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Font Family</Label>
                            <Select defaultValue="inter">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inter">Inter</SelectItem>
                                <SelectItem value="roboto">Roboto</SelectItem>
                                <SelectItem value="system">System Default</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Button className="w-full">
                            <Save className="w-4 h-4 mr-2" />
                            Save Theme Changes
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Monitor and manage platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSensitiveData(!showSensitiveData)}
                    >
                      {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showSensitiveData ? "Hide" : "Show"} Sensitive Data
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportData("users")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Users
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Tokens Minted</TableHead>
                      <TableHead>Value Attached</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono">
                          {showSensitiveData 
                            ? user.walletAddress 
                            : `${user.walletAddress.slice(0, 8)}...${user.walletAddress.slice(-8)}`
                          }
                        </TableCell>
                        <TableCell>{user.totalTokensMinted}</TableCell>
                        <TableCell>{user.totalValueAttached.toFixed(3)} SOL</TableCell>
                        <TableCell>
                          <Badge variant={user.riskScore > 70 ? "destructive" : user.riskScore > 40 ? "default" : "secondary"}>
                            {user.riskScore}/100
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isBlocked ? "destructive" : "default"}>
                            {user.isBlocked ? "Blocked" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserBlock(user.id, user.isBlocked)}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skye AI Knowledge Management Tab */}
          <TabsContent value="skye" className="space-y-6">
            <SkyeKnowledgeAdmin />
          </TabsContent>

          {/* Codes Management Tab */}
          <TabsContent value="codes" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Free Message Codes Management
                </CardTitle>
                <CardDescription>
                  Access the dedicated admin panel for managing redemption codes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-8">
                  <Ticket className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold mb-2">Redemption Code Management</h3>
                  <p className="text-muted-foreground mb-6">
                    Generate, track, and manage redemption codes that allow users to mint free Flutterbye messages.
                  </p>
                  <Button asChild size="lg" className="w-full max-w-md">
                    <a href="/admin/free-codes">
                      <Ticket className="w-5 h-5 mr-2" />
                      Open Code Management Panel
                    </a>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">Active</div>
                    <div className="text-sm text-muted-foreground">Code Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">Unlimited</div>
                    <div className="text-sm text-muted-foreground">Usage Options</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">Flexible</div>
                    <div className="text-sm text-muted-foreground">Expiry Settings</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Export data, manage backups, and perform maintenance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Data Export</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleExportData("users")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export User Data
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleExportData("tokens")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Token Data
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleExportData("transactions")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Transaction Data
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleExportData("analytics")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Analytics Data
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Database Maintenance</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Statistics
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Optimize Database
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Create Backup
                      </Button>
                      <Button variant="destructive" className="w-full justify-start">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Emergency Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Admin Activity Logs
                </CardTitle>
                <CardDescription>
                  Track all administrative actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono">
                          {log.adminId.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.targetType}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {JSON.stringify(log.details)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Acquisition */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    User Acquisition
                  </CardTitle>
                  <CardDescription>Track how users discover and join Flutterbye</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {marketingLoading ? (
                    <div>Loading marketing data...</div>
                  ) : marketingData ? (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-electric-blue">
                            {marketingData.userAcquisition.totalSignups.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">Total Signups</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {marketingData.userAcquisition.signupsLast7Days.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">Last 7 Days</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-400">
                            {marketingData.userAcquisition.signupsLast30Days.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">Last 30 Days</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Acquisition Channels</h4>
                        {marketingData.userAcquisition.acquisitionChannels.map((channel) => (
                          <div key={channel.channel} className="flex justify-between items-center">
                            <span className="capitalize">{channel.channel}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{channel.users} users</span>
                              <Badge variant="secondary">{channel.percentage}%</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">No marketing data available</div>
                  )}
                </CardContent>
              </Card>

              {/* User Engagement */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    User Engagement
                  </CardTitle>
                  <CardDescription>Monitor user activity and retention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {marketingLoading ? (
                    <div>Loading engagement data...</div>
                  ) : marketingData ? (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-electric-blue">
                            {marketingData.userEngagement.dailyActiveUsers.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">Daily Active</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {marketingData.userEngagement.weeklyActiveUsers.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">Weekly Active</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-400">
                            {marketingData.userEngagement.monthlyActiveUsers.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">Monthly Active</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Retention Rates</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-green-400">
                              {(marketingData.userEngagement.retentionRates.day1 * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-400">Day 1</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-yellow-400">
                              {(marketingData.userEngagement.retentionRates.day7 * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-400">Day 7</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-400">
                              {(marketingData.userEngagement.retentionRates.day30 * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-400">Day 30</div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">No engagement data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Token Metrics */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    Token Performance
                  </CardTitle>
                  <CardDescription>Analyze token creation and value patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {marketingLoading ? (
                    <div>Loading token metrics...</div>
                  ) : marketingData ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-electric-blue">
                            {marketingData.tokenMetrics.averageTokensPerUser.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-400">Avg Tokens/User</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {(marketingData.tokenMetrics.redemptionRate * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-400">Redemption Rate</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Top Message Categories</h4>
                        {marketingData.tokenMetrics.topMessageCategories.map((category) => (
                          <div key={category.category} className="flex justify-between items-center">
                            <span className="capitalize">{category.category}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{category.count} tokens</span>
                              <Badge variant="secondary">{category.totalValue.toFixed(3)} SOL</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">No token data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Geographic Distribution */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>User distribution by region</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {marketingLoading ? (
                    <div>Loading geographic data...</div>
                  ) : marketingData ? (
                    <div className="space-y-2">
                      {marketingData.geographicData.map((region) => (
                        <div key={region.region} className="flex justify-between items-center">
                          <span>{region.region}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm">{region.users} users</span>
                            <span className="text-sm text-green-400">{region.tokens} tokens</span>
                            <Badge variant="secondary">{region.revenue.toFixed(3)} SOL</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400">No geographic data available</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Behavior Insights */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    User Behavior Insights
                  </CardTitle>
                  <CardDescription>Deep dive into user interaction patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {behaviorLoading ? (
                    <div>Loading behavior data...</div>
                  ) : behaviorData ? (
                    <>
                      <div className="space-y-2">
                        <h4 className="font-semibold">User Journey Conversion</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>Signup → First Mint:</span>
                            <Badge variant="secondary">
                              {(behaviorData.userJourneyFunnels.signupToFirstMint * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>First → Second Mint:</span>
                            <Badge variant="secondary">
                              {(behaviorData.userJourneyFunnels.firstMintToSecondMint * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Mint → Value Attach:</span>
                            <Badge variant="secondary">
                              {(behaviorData.userJourneyFunnels.mintToValueAttachment * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Value → Redemption:</span>
                            <Badge variant="secondary">
                              {(behaviorData.userJourneyFunnels.valueAttachmentToRedemption * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Popular Features</h4>
                        {behaviorData.popularFeatures.map((feature) => (
                          <div key={feature.feature} className="flex justify-between items-center">
                            <span className="capitalize">{feature.feature}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{feature.usageCount} uses</span>
                              <Badge variant="secondary">
                                {(feature.conversionRate * 100).toFixed(1)}% conv
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">No behavior data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Churn Analysis */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Churn Analysis
                  </CardTitle>
                  <CardDescription>Identify at-risk users and retention opportunities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {behaviorLoading ? (
                    <div>Loading churn data...</div>
                  ) : behaviorData ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">
                            {(behaviorData.churnAnalysis.churnRate * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-400">Churn Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            {behaviorData.churnAnalysis.atRiskUsers}
                          </div>
                          <div className="text-sm text-gray-400">At Risk Users</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Top Churn Reasons</h4>
                        {behaviorData.churnAnalysis.topChurnReasons.map((reason) => (
                          <div key={reason.reason} className="flex justify-between items-center">
                            <span className="capitalize">{reason.reason}</span>
                            <Badge variant="destructive">{reason.percentage}%</Badge>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">No churn data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Revenue Analytics */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Revenue Analytics
                  </CardTitle>
                  <CardDescription>Track revenue trends and monetization efficiency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {revenueLoading ? (
                    <div>Loading revenue data...</div>
                  ) : revenueData ? (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {revenueData.totalRevenue.toFixed(3)}
                          </div>
                          <div className="text-sm text-gray-400">Total Revenue (SOL)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {revenueData.averageRevenuePerUser.toFixed(4)}
                          </div>
                          <div className="text-sm text-gray-400">ARPU (SOL)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">
                            {revenueData.lifetimeValue.toFixed(3)}
                          </div>
                          <div className="text-sm text-gray-400">LTV (SOL)</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Revenue Growth</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-green-400">
                              {(revenueData.revenueGrowth.daily * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-400">Daily</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-400">
                              {(revenueData.revenueGrowth.weekly * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-400">Weekly</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-400">
                              {(revenueData.revenueGrowth.monthly * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-400">Monthly</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Revenue by Feature</h4>
                        {revenueData.revenueByFeature.map((feature) => (
                          <div key={feature.feature} className="flex justify-between items-center">
                            <span className="capitalize">{feature.feature}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{feature.revenue.toFixed(3)} SOL</span>
                              <Badge variant="secondary">{feature.percentage}%</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">No revenue data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Real-time Activity Monitor */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Real-time Activity
                  </CardTitle>
                  <CardDescription>Monitor live platform activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {behaviorLoading ? (
                    <div>Loading activity data...</div>
                  ) : behaviorData ? (
                    <>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Peak Activity Hours</h4>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          {behaviorData.mostActiveTimeSlots.map((slot) => (
                            <div key={slot.hour} className="text-center p-2 rounded bg-slate-800/50">
                              <div className="font-bold">{slot.hour}:00</div>
                              <div className="text-gray-400">{slot.activityCount}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh Live Data
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Export Analytics Report
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">No activity data available</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Monetization Tab */}
          <TabsContent value="api-monetization" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="glassmorphism electric-frame">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-electric-green" />
                    API Monetization Dashboard
                  </CardTitle>
                  <CardDescription>
                    Manage API subscriptions, revenue tracking, and monetization analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-2xl font-bold mb-4 text-electric-green">API Monetization System</h3>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                      Complete API monetization management with subscription tiers, revenue analytics, and intelligent rate limiting
                    </p>
                    <Link href="/admin/api-monetization">
                      <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Open Full API Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Footer with System Information */}
        <div className="mt-12 text-center">
          <div className="electric-frame p-4 glassmorphism inline-block">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-electric-green" />
                <span>Admin Panel v2.0</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-electric-blue" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-circuit-teal" />
                <span>Secure Data Management</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}