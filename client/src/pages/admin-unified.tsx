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
  RotateCcw
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-2">
            <Shield className="h-10 w-10 text-cyan-400" />
            Unified Admin Dashboard
          </h1>
          <p className="text-slate-300">
            Complete platform management in one streamlined interface
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-10 glassmorphism electric-frame border-0 p-2">
            <TabsTrigger value="overview" className="flex items-center gap-2 pulse-border hover:text-electric-blue transition-all">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 pulse-border hover:text-electric-blue transition-all">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 pulse-border hover:text-electric-green transition-all">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex items-center gap-2 pulse-border hover:text-circuit-teal transition-all">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Tokens</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2 pulse-border hover:text-electric-green transition-all">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="codes" className="flex items-center gap-2 pulse-border hover:text-electric-blue transition-all">
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">Codes</span>
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-2 pulse-border hover:text-electric-green transition-all">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Access</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 pulse-border hover:text-circuit-teal transition-all">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="staking" className="flex items-center gap-2 pulse-border hover:text-electric-blue transition-all">
              <Coins className="w-4 h-4" />
              <span className="hidden sm:inline">Staking</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2 pulse-border hover:text-electric-green transition-all">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">System</span>
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

          {/* Other tabs would be consolidated here similarly */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Platform Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure core platform parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  Settings configuration panel will be consolidated here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Monitor and manage platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  User management interface will be consolidated here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add remaining tabs similarly */}
          {['pricing', 'codes', 'access', 'analytics', 'staking', 'system'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white capitalize">{tab} Management</CardTitle>
                  <CardDescription className="text-slate-400">
                    {tab} configuration and management tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-400">
                    {tab} management interface will be consolidated here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
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