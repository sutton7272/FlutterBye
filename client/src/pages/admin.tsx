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
  Coins
} from "lucide-react";

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
  const [newCodeType, setNewCodeType] = useState("free_flutterbye");
  const [codeCount, setCodeCount] = useState(10);
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

  const { data: currentSettings, isLoading: settingsLoading } = useQuery<AdminSettings>({
    queryKey: ["/api/admin/settings"],
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
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage platform settings, users, and monitor activity
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-slate-800/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="codes" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Codes
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glassmorphism">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold text-blue-400">
                        {platformStats?.totalUsers?.toLocaleString() || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {platformStats?.activeUsers24h || 0} active in 24h
                  </p>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tokens</p>
                      <p className="text-3xl font-bold text-green-400">
                        {platformStats?.totalTokens?.toLocaleString() || 0}
                      </p>
                    </div>
                    <Coins className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    FLBY-MSG tokens minted
                  </p>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Value Escrowed</p>
                      <p className="text-3xl font-bold text-purple-400">
                        {platformStats?.totalValueEscrowed?.toFixed(3) || 0} SOL
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {platformStats?.totalRedemptions || 0} redemptions
                  </p>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue Today</p>
                      <p className="text-3xl font-bold text-yellow-400">
                        {platformStats?.revenueToday?.toFixed(3) || 0} SOL
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Platform fees collected
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top Tokens */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Performing Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Message</TableHead>
                      <TableHead>Value Attached</TableHead>
                      <TableHead>Redemptions</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {platformStats?.topTokens?.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell className="font-mono">{token.message}</TableCell>
                        <TableCell>{token.attachedValue.toFixed(3)} SOL</TableCell>
                        <TableCell>{token.redemptions}</TableCell>
                        <TableCell>
                          <Badge variant={token.redemptions > 10 ? "default" : "secondary"}>
                            {token.redemptions > 10 ? "High" : "Normal"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Pricing & Fee Management
                </CardTitle>
                <CardDescription>
                  Configure flexible pricing tiers, bulk discounts, and platform fees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminPricingManagement />
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

          {/* Codes Management Tab */}
          <TabsContent value="codes" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Redemption Code Management
                </CardTitle>
                <CardDescription>
                  Generate and manage Free Flutterbye redemption codes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codeType">Code Type</Label>
                    <Select value={newCodeType} onValueChange={setNewCodeType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free_flutterbye">Free Flutterbye</SelectItem>
                        <SelectItem value="premium_bonus">Premium Bonus</SelectItem>
                        <SelectItem value="marketing_campaign">Marketing Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codeCount">Number of Codes</Label>
                    <Input
                      id="codeCount"
                      type="number"
                      min="1"
                      max="1000"
                      value={codeCount}
                      onChange={(e) => setCodeCount(parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={() => generateCodesMutation.mutate({ type: newCodeType, count: codeCount })}
                      disabled={generateCodesMutation.isPending}
                      className="w-full"
                    >
                      {generateCodesMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Generate Codes
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Generated Codes Usage</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Generated:</span>
                      <p className="font-semibold">1,247 codes</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Redeemed:</span>
                      <p className="font-semibold">823 codes (66%)</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Remaining:</span>
                      <p className="font-semibold">424 codes</p>
                    </div>
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
        </Tabs>
      </div>
    </div>
  );
}