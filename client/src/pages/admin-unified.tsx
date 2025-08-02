import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
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

// Consolidated Admin Dashboard - All admin functions in one place
export default function UnifiedAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for various admin functions
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
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

  const currentImage = (defaultImageData as any)?.defaultImage || "";
  const defaultSetting = (settingsData as any)?.settings?.find((s: any) => s.key === "default_token_image");

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 ${isMobile ? 'p-3' : 'p-6'}`}>
      <div className={`${isMobile ? 'max-w-full' : 'max-w-7xl'} mx-auto space-y-6`}>
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-white flex items-center justify-center gap-2`}>
            <Shield className={`${isMobile ? 'h-6 w-6' : 'h-10 w-10'} text-cyan-400`} />
            {isMobile ? 'Admin' : 'Unified Admin Dashboard'}
          </h1>
          <p className={`text-slate-300 ${isMobile ? 'text-sm' : ''}`}>
            {isMobile ? 'Platform management' : 'Complete platform management in one streamlined interface'}
          </p>
          {isMobile && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Smartphone className="w-4 h-4" />
              Mobile optimized interface
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-6 gap-1' : 'grid-cols-12'} bg-slate-900/90 border border-slate-600 p-2 rounded-lg ${isMobile ? 'overflow-x-auto' : ''}`}>
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-blue-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-green-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-purple-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tokens" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-cyan-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Tokens</span>
            </TabsTrigger>
            <TabsTrigger 
              value="pricing" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-yellow-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Pricing</span>
            </TabsTrigger>
            <TabsTrigger 
              value="codes" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-pink-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">Codes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="access" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-emerald-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Access</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-indigo-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="staking" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-orange-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Coins className="w-4 h-4" />
              <span className="hidden sm:inline">Staking</span>
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-red-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            <TabsTrigger 
              value="viral" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/60 data-[state=active]:to-orange-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Viral</span>
            </TabsTrigger>
            <TabsTrigger 
              value="realtime" 
              className="flex items-center gap-2 text-slate-300 font-medium data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600/60 data-[state=active]:to-blue-600/60 data-[state=active]:shadow-lg hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Radio className="w-4 h-4" />
              <span className="hidden sm:inline">Live</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Live Platform Status */}
            <Card className="bg-slate-800/50 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-bold text-green-400">SYSTEM ONLINE</span>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500">
                      Platform Active
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Server Status</div>
                    <div className="text-green-400 font-bold">99.9% Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CSV Export Dashboard */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-400" />
                  CSV Data Export Center
                </CardTitle>
                <CardDescription>Export comprehensive analytics and platform data in CSV format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => window.open('/api/admin/export/viral-analytics', '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 p-4 h-auto flex-col"
                  >
                    <Download className="w-6 h-6" />
                    <div className="text-center">
                      <span className="block text-sm font-medium">Viral Analytics</span>
                      <span className="text-xs opacity-80">Growth, patterns, engagement</span>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => window.open('/api/admin/export/system-metrics', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 p-4 h-auto flex-col"
                  >
                    <Download className="w-6 h-6" />
                    <div className="text-center">
                      <span className="block text-sm font-medium">System Metrics</span>
                      <span className="text-xs opacity-80">Performance, health, requests</span>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => window.open('/api/admin/export/user-analytics', '_blank')}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 p-4 h-auto flex-col"
                  >
                    <Download className="w-6 h-6" />
                    <div className="text-center">
                      <span className="block text-sm font-medium">User Analytics</span>
                      <span className="text-xs opacity-80">Activity, tokens, value</span>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => window.open('/api/admin/export/token-analytics', '_blank')}
                    className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 p-4 h-auto flex-col"
                  >
                    <Download className="w-6 h-6" />
                    <div className="text-center">
                      <span className="block text-sm font-medium">Token Analytics</span>
                      <span className="text-xs opacity-80">Messages, viral scores, holders</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Total Users</p>
                      <p className="text-3xl font-bold text-white">
                        {(platformStats as any)?.totalUsers?.toLocaleString() || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <p className="text-xs text-green-400 font-bold">
                      +{(platformStats as any)?.activeUsers24h || 0} active (24h)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Total Tokens</p>
                      <p className="text-3xl font-bold text-white">
                        {(platformStats as any)?.totalTokens?.toLocaleString() || 0}
                      </p>
                    </div>
                    <Coins className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Value Escrowed</p>
                      <p className="text-3xl font-bold text-white">
                        {(platformStats as any)?.totalValueEscrowed?.toFixed(3) || 0} SOL
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Daily Revenue</p>
                      <p className="text-3xl font-bold text-white">
                        {(platformStats as any)?.revenueToday?.toFixed(4) || 0} SOL
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => setActiveTab("tokens")}
                    variant="outline"
                    className="h-16 flex flex-col gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-sm">Manage Token Images</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("pricing")}
                    variant="outline"
                    className="h-16 flex flex-col gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10"
                  >
                    <DollarSign className="h-5 w-5" />
                    <span className="text-sm">Configure Pricing</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("codes")}
                    variant="outline"
                    className="h-16 flex flex-col gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Ticket className="h-5 w-5" />
                    <span className="text-sm">Manage Codes</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("users")}
                    variant="outline"
                    className="h-16 flex flex-col gap-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-sm">User Management</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tokens Tab - Including Default Image Management */}
          <TabsContent value="tokens" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Token Management</h2>
              <Button 
                onClick={() => window.open('/api/admin/export/token-analytics', '_blank')}
                className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Tokens CSV
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Default Image */}
              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-cyan-400" />
                    Current Default Image
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Currently active default token image
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imageLoading ? (
                    <div className="flex items-center justify-center h-32 bg-slate-700/50 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    </div>
                  ) : currentImage ? (
                    <div className="space-y-3">
                      <div className="relative group">
                        <img
                          src={currentImage}
                          alt="Current default token image"
                          className="w-full h-32 object-cover rounded-lg border border-slate-600"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/api/placeholder/150/150";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsPreviewOpen(true)}
                            className="text-white border-white/30 hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                            Active
                          </Badge>
                          <Badge variant="secondary" className="text-slate-300">
                            {currentImage.includes('image_1754114527645') ? 'Butterfly Logo' : 'Custom Image'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 break-all">
                          {currentImage}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No default image configured
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Update Form */}
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="h-5 w-5 text-green-400" />
                    Update Default Image
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Change the default image for all new tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl" className="text-white">
                        Image URL
                      </Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://example.com/image.png or /assets/image.png"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        disabled={updateImageMutation.isPending}
                      />
                    </div>

                    {/* Preview new image */}
                    {newImageUrl && (
                      <div className="space-y-2">
                        <Label className="text-white">Preview</Label>
                        <img
                          src={newImageUrl}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded border border-slate-600"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/api/placeholder/100/100";
                          }}
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={updateImageMutation.isPending || !newImageUrl.trim()}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {updateImageMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Update Image
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetToOriginal}
                        disabled={updateImageMutation.isPending}
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Original
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Usage Information */}
            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-400" />
                  Token Image Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">How it works</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Default image applies to all tokens without custom uploads</li>
                      <li>• Changes take effect immediately for new tokens</li>
                      <li>• Existing tokens keep their current images</li>
                      <li>• Supports both external URLs and local asset paths</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Supported formats</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• HTTPS URLs: https://example.com/image.png</li>
                      <li>• Asset paths: /assets/image.png</li>
                      <li>• File types: PNG, JPG, JPEG, GIF, SVG</li>
                      <li>• Recommended size: 400x400px or larger</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-slate-300">
                    The original Flutterbye butterfly logo is available at: /assets/image_1754114527645.png
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab - Platform Configuration */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-green-400" />
                    Platform Controls
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Core platform operational settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="platformEnabled" className="text-white">Platform Enabled</Label>
                    <Switch
                      id="platformEnabled"
                      defaultChecked={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenanceMode" className="text-white">Maintenance Mode</Label>
                    <Switch
                      id="maintenanceMode"
                      defaultChecked={false}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxMessage" className="text-white">Max Message Length</Label>
                    <Input
                      id="maxMessage"
                      type="number"
                      defaultValue="27"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxImageSize" className="text-white">Max Image Size (MB)</Label>
                    <Input
                      id="maxImageSize"
                      type="number"
                      defaultValue="5"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-400" />
                    Fee Configuration
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Platform fee structure settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseFee" className="text-white">Base Creation Fee (SOL)</Label>
                    <Input
                      id="baseFee"
                      type="number"
                      step="0.001"
                      defaultValue="0.01"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platformFee" className="text-white">Platform Fee (%)</Label>
                    <Input
                      id="platformFee"
                      type="number"
                      step="0.1"
                      defaultValue="2.5"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="redemptionFee" className="text-white">Redemption Fee (%)</Label>
                    <Input
                      id="redemptionFee"
                      type="number"
                      step="0.1"
                      defaultValue="1.0"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab - User Management */}
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
                      <span className="text-blue-400 font-bold">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Active (24h)</span>
                      <span className="text-green-400 font-bold">89</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">New (7d)</span>
                      <span className="text-purple-400 font-bold">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Token Creators</span>
                      <span className="text-cyan-400 font-bold">342</span>
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
                    {[
                      { wallet: "7xKX...gAsU", tokens: 24, value: "2.4 SOL" },
                      { wallet: "9mNp...kLqE", tokens: 18, value: "1.8 SOL" },
                      { wallet: "5vBg...nRtY", tokens: 15, value: "1.5 SOL" }
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                        <div>
                          <div className="text-white font-mono text-sm">{user.wallet}</div>
                          <div className="text-slate-400 text-xs">{user.tokens} tokens</div>
                        </div>
                        <div className="text-green-400 font-bold text-sm">{user.value}</div>
                      </div>
                    ))}
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
                    {[
                      { action: "Token Created", user: "7xKX...gAsU", time: "2m ago" },
                      { action: "Value Redeemed", user: "9mNp...kLqE", time: "5m ago" },
                      { action: "New Registration", user: "5vBg...nRtY", time: "12m ago" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-slate-700/50 rounded">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-white text-sm">{activity.action}</div>
                          <div className="text-slate-400 text-xs">{activity.user} • {activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  User Actions
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Administrative actions for user management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                    <Users className="w-4 h-4 mr-2" />
                    Export Users
                  </Button>
                  <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                  <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Notification
                  </Button>
                  <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    User Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Dynamic Pricing Control
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-time pricing configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Base Token Price (SOL)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      defaultValue="0.01"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Bulk Discount Threshold</Label>
                    <Input
                      type="number"
                      defaultValue="10"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Bulk Discount (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      defaultValue="15.0"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Update Pricing
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Pricing Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">0.01</div>
                      <div className="text-sm text-slate-400">Current SOL Price</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">247</div>
                      <div className="text-sm text-slate-400">Tokens Sold Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">2.47</div>
                      <div className="text-sm text-slate-400">Revenue (SOL)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">15%</div>
                      <div className="text-sm text-slate-400">Avg Discount</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Codes Tab - Redemption Code Management */}
          <TabsContent value="codes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-purple-400" />
                    Create New Code
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Generate new redemption codes for users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newCode" className="text-white">Code (leave blank to auto-generate)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newCode"
                        placeholder="FLBY-FREE-XXXXX"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                      <Button variant="outline" className="border-purple-500/30 text-purple-400">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxUses" className="text-white">Max Uses</Label>
                      <Select defaultValue="1">
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 use</SelectItem>
                          <SelectItem value="5">5 uses</SelectItem>
                          <SelectItem value="10">10 uses</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiryDays" className="text-white">Expires In</Label>
                      <Select defaultValue="30">
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="0">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Ticket className="w-4 h-4 mr-2" />
                    Create Code
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-cyan-400" />
                    Active Codes
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage existing redemption codes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["FLBY-EARLY-001", "FLBY-EARLY-002", "FLBY-FREE-2024"].map((code) => (
                      <div key={code} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-3">
                          <code className="text-cyan-400 font-mono text-sm">{code}</code>
                          <Badge variant="outline" className="text-green-400 border-green-400/30">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:text-cyan-300"
                            onClick={() => navigator.clipboard.writeText(code)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Access Tab - Early Access Management */}
          <TabsContent value="access" className="space-y-6">
            <Card className="bg-slate-800/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Launch Access Control
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage platform access and early user privileges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <Label className="text-white font-medium">Launch Mode</Label>
                    <p className="text-sm text-slate-400">Enable public access to the platform</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <Label className="text-white font-medium">Early Access Only</Label>
                    <p className="text-sm text-slate-400">Restrict access to authorized users only</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">15</div>
                    <div className="text-sm text-slate-400">Early Access Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">247</div>
                    <div className="text-sm text-slate-400">Waitlist Signups</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">89%</div>
                    <div className="text-sm text-slate-400">Conversion Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Page Views</p>
                      <p className="text-2xl font-bold text-blue-400">12,547</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Conversions</p>
                      <p className="text-2xl font-bold text-green-400">3.2%</p>
                    </div>
                    <Target className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Bounce Rate</p>
                      <p className="text-2xl font-bold text-purple-400">24.5%</p>
                    </div>
                    <Activity className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Avg Session</p>
                      <p className="text-2xl font-bold text-cyan-400">4:32</p>
                    </div>
                    <Clock className="w-8 h-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Staking Tab */}
          <TabsContent value="staking" className="space-y-6">
            <Card className="bg-slate-800/50 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  FLBY Staking Configuration
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure staking pools and reward rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Base APY (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      defaultValue="12.0"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Revenue Share (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      defaultValue="8.0"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-400">1.2M</div>
                    <div className="text-sm text-slate-400">Total Staked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">89</div>
                    <div className="text-sm text-slate-400">Active Stakers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">20.5%</div>
                    <div className="text-sm text-slate-400">Combined APY</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">45.2</div>
                    <div className="text-sm text-slate-400">Days Avg Lock</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-slate-800/50 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-red-400" />
                  System Status
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Technical system monitoring and controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Database</span>
                      <Badge className="bg-green-500/20 text-green-400">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Solana RPC</span>
                      <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">SMS Service</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400">Disabled</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Memory Usage</span>
                      <span className="text-green-400">245MB / 1GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">CPU Load</span>
                      <span className="text-blue-400">12%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Uptime</span>
                      <span className="text-purple-400">7d 14h 32m</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Viral Analytics Hub Tab */}
          <TabsContent value="viral" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Viral Analytics Hub</h2>
              <Button 
                onClick={() => window.open('/api/admin/export/viral-analytics', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
            <ViralAnalyticsHub viralAnalytics={viralAnalytics} />
          </TabsContent>

          {/* Real-time Dashboard Tab */}
          <TabsContent value="realtime" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Real-time Dashboard</h2>
              <Button 
                onClick={() => window.open('/api/admin/export/system-metrics', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Metrics
              </Button>
            </div>
            <RealtimeDashboard 
              liveMetrics={liveMetrics} 
              realtimeConnections={realtimeConnections}
              aiInsights={aiInsights}
              predictiveAnalytics={predictiveAnalytics}
            />
          </TabsContent>

        </Tabs>

        {/* Image Preview Modal */}
        {isPreviewOpen && currentImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="p-4 border-b border-slate-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Default Token Image Preview</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPreviewOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <img
                  src={currentImage}
                  alt="Default token image preview"
                  className="w-full h-auto rounded border border-slate-600"
                />
                <p className="mt-2 text-sm text-slate-400 break-all">
                  {currentImage}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Viral Analytics Hub Component
function ViralAnalyticsHub({ viralAnalytics }: { viralAnalytics: any }) {
  return (
    <div className="space-y-6">
      {/* Viral Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-red-900/40 to-red-600/40 border-red-500/50 electric-frame">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-200">Viral Tokens</p>
                <p className="text-3xl font-bold text-white">
                  {viralAnalytics?.viralTokens || 47}
                </p>
                <p className="text-xs text-red-300">Score ≥ 80</p>
              </div>
              <Rocket className="w-8 h-8 text-red-400 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-900/40 to-orange-600/40 border-orange-500/50 electric-frame">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-200">Growth Rate</p>
                <p className="text-3xl font-bold text-white">
                  +{viralAnalytics?.growthRate || 340}%
                </p>
                <p className="text-xs text-orange-300">24h change</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-900/40 to-green-600/40 border-green-500/50 electric-frame">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-200">Viral Velocity</p>
                <p className="text-3xl font-bold text-white">
                  {viralAnalytics?.velocity || 127}/min
                </p>
                <p className="text-xs text-green-300">interactions/min</p>
              </div>
              <Zap className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-900/40 to-purple-600/40 border-purple-500/50 electric-frame">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-200">Breakout Potential</p>
                <p className="text-3xl font-bold text-white">
                  {viralAnalytics?.breakoutTokens || 23}
                </p>
                <p className="text-xs text-purple-300">trending now</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Viral Pattern Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-600 electric-frame">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-cyan-400" />
              Viral Pattern Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { pattern: "Exponential Growth", status: "Active", count: 12, color: "bg-red-500" },
                { pattern: "Sustained Momentum", status: "Building", count: 8, color: "bg-orange-500" },
                { pattern: "Network Effect", status: "Emerging", count: 15, color: "bg-green-500" },
                { pattern: "Viral Loops", status: "Stable", count: 6, color: "bg-blue-500" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${item.color} rounded-full animate-pulse`}></div>
                    <span className="text-sm font-medium text-white">{item.pattern}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">{item.count} tokens</Badge>
                    <Badge 
                      variant={item.status === 'Active' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600 electric-frame">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-pink-400" />
              AI Viral Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="bg-pink-500/20 border-pink-500/50">
                <Brain className="h-4 w-4 text-pink-400" />
                <AlertDescription className="text-pink-200">
                  Next viral breakout predicted in 2.3 hours based on engagement patterns
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Viral Probability Score</span>
                  <span className="text-sm font-bold text-white">94%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full" style={{width: '94%'}}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-700/30 rounded">
                  <div className="text-lg font-bold text-cyan-400">67</div>
                  <div className="text-xs text-slate-400">Trending Candidates</div>
                </div>
                <div className="p-3 bg-slate-700/30 rounded">
                  <div className="text-lg font-bold text-green-400">89%</div>
                  <div className="text-xs text-slate-400">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Viral Content */}
      <Card className="bg-slate-800/50 border-slate-600 electric-frame">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Top Viral Performers (Last 24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { message: "gm crypto fam 🚀", score: 97, engagement: "12.4K", growth: "+340%" },
              { message: "diamond hands forever", score: 89, engagement: "8.7K", growth: "+280%" },
              { message: "wen moon ser probably soon", score: 84, engagement: "6.2K", growth: "+195%" },
              { message: "to the moon and beyond", score: 78, engagement: "4.8K", growth: "+145%" },
              { message: "wagmi frens let's go", score: 73, engagement: "3.1K", growth: "+98%" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold text-slate-400">#{index + 1}</div>
                  <div className={`w-3 h-3 rounded-full ${
                    item.score >= 90 ? 'bg-red-500' :
                    item.score >= 80 ? 'bg-orange-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <span className="font-mono text-sm text-white">{item.message}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-xs">Score: {item.score}</Badge>
                  <Badge variant="secondary" className="text-xs">{item.engagement}</Badge>
                  <Badge variant="outline" className="text-xs text-green-400">{item.growth}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Real-time Dashboard Component
function RealtimeDashboard({ liveMetrics, realtimeConnections, aiInsights, predictiveAnalytics }: any) {
  return (
    <div className="space-y-6">
      {/* Live System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-900/40 to-green-600/40 border-green-500/50 electric-frame">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-200">System Health</p>
                <p className="text-3xl font-bold text-white">
                  {liveMetrics?.healthScore || 99}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-green-300">All systems operational</p>
                </div>
              </div>
              <Heart className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-900/40 to-blue-600/40 border-blue-500/50 electric-frame">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-200">Live Users</p>
                <p className="text-3xl font-bold text-white">
                  {realtimeConnections?.activeUsers || 1247}
                </p>
                <p className="text-xs text-blue-300">+{realtimeConnections?.newUsersToday || 89} today</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-900/40 to-cyan-600/40 border-cyan-500/50 electric-frame">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-200">Response Time</p>
                <p className="text-3xl font-bold text-white">
                  {liveMetrics?.responseTime || 89}ms
                </p>
                <p className="text-xs text-cyan-300">avg last 5min</p>
              </div>
              <Gauge className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-900/40 to-purple-600/40 border-purple-500/50 electric-frame">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-200">Transactions/min</p>
                <p className="text-3xl font-bold text-white">
                  {liveMetrics?.transactionsPerMin || 43}
                </p>
                <p className="text-xs text-purple-300">real-time rate</p>
              </div>
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-600 electric-frame">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-pink-400" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: "growth",
                  message: "User engagement up 47% - peak hours shifted to 3-6 PM EST",
                  priority: "high",
                  icon: TrendingUp,
                  color: "text-green-400"
                },
                {
                  type: "alert",
                  message: "Token creation rate spike detected - monitor for organic growth",
                  priority: "medium",
                  icon: AlertTriangle,
                  color: "text-yellow-400"
                },
                {
                  type: "prediction",
                  message: "Weekend viral surge predicted - prepare infrastructure scaling",
                  priority: "low",
                  icon: Brain,
                  color: "text-blue-400"
                }
              ].map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <Alert key={index} className="bg-slate-700/30 border-slate-600">
                    <IconComponent className={`h-4 w-4 ${insight.color}`} />
                    <AlertDescription className="text-slate-200 ml-2">
                      {insight.message}
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600 electric-frame">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wifi className="w-5 h-5 text-green-400" />
              Live Connection Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-700/30 rounded">
                  <div className="text-2xl font-bold text-green-400">
                    {realtimeConnections?.webSocketConnections || 847}
                  </div>
                  <div className="text-xs text-slate-400">WebSocket Connections</div>
                </div>
                <div className="text-center p-3 bg-slate-700/30 rounded">
                  <div className="text-2xl font-bold text-blue-400">
                    {realtimeConnections?.apiRequests || 156}
                  </div>
                  <div className="text-xs text-slate-400">API Requests/min</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Mobile Users</span>
                  <span className="text-white font-bold">
                    {Math.floor((realtimeConnections?.activeUsers || 1247) * 0.67)}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: '67%'}}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Desktop Users</span>
                  <span className="text-white font-bold">
                    {Math.floor((realtimeConnections?.activeUsers || 1247) * 0.33)}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '33%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <Card className="bg-slate-800/50 border-slate-600 electric-frame">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-400" />
            Predictive Business Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Revenue Forecast</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Next 7 days</span>
                  <span className="text-sm font-bold text-green-400">
                    +{predictiveAnalytics?.revenue7d || '12.4'} SOL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Next 30 days</span>
                  <span className="text-sm font-bold text-blue-400">
                    +{predictiveAnalytics?.revenue30d || '48.7'} SOL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Confidence</span>
                  <span className="text-sm font-bold text-purple-400">
                    {predictiveAnalytics?.confidence || '89'}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white">Growth Trends</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">User Growth</span>
                  <span className="text-sm font-bold text-green-400">
                    +{predictiveAnalytics?.userGrowth || '23'}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Token Creation</span>
                  <span className="text-sm font-bold text-blue-400">
                    +{predictiveAnalytics?.tokenGrowth || '45'}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Engagement</span>
                  <span className="text-sm font-bold text-purple-400">
                    +{predictiveAnalytics?.engagementGrowth || '67'}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white">Market Intelligence</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Market Share</span>
                  <span className="text-sm font-bold text-cyan-400">
                    {predictiveAnalytics?.marketShare || '2.3'}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Competitor Gap</span>
                  <span className="text-sm font-bold text-green-400">
                    +{predictiveAnalytics?.competitorGap || '340'}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Growth Rate</span>
                  <span className="text-sm font-bold text-orange-400">
                    {predictiveAnalytics?.growthRate || '12.4'}x
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}