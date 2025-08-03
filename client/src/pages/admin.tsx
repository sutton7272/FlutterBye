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
  Ticket
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleSettingsUpdate = () => {
    updateSettingsMutation.mutate(settings);
  };

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
          <TabsContent value="overview" className="space-y-8">
            <Card className="glassmorphism electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-electric-blue" />
                  Platform Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-electric-green rounded-full animate-pulse"></div>
                    <span className="font-bold text-electric-green">SYSTEM ONLINE</span>
                  </div>
                  <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue">
                    All Systems Operational
                  </Badge>
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
            <Card className="glassmorphism electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-electric-blue" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage platform users and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-400">User management features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="glassmorphism electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-electric-green" />
                  Platform Analytics
                </CardTitle>
                <CardDescription>
                  Monitor platform performance and user engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-400">Advanced analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}