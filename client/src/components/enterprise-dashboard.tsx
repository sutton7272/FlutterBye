import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building,
  Palette,
  Shield,
  Key,
  Users,
  Settings,
  Globe,
  Lock,
  BarChart3,
  Zap,
  CheckCircle,
  AlertTriangle,
  Copy,
  Download,
  Search,
  Eye,
  FileSearch,
  Network,
  Bitcoin,
  Gavel,
  Target,
  Brain
} from "lucide-react";

export default function EnterpriseDashboard() {
  const { toast } = useToast();
  const [walletInput, setWalletInput] = useState("");
  const [analyzingWallet, setAnalyzingWallet] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleCrossChainAnalysis = async () => {
    if (!walletInput.trim()) return;
    
    setAnalyzingWallet(true);
    try {
      const response = await apiRequest("POST", "/api/enterprise/multi-chain/analyze-wallet", {
        walletAddress: walletInput.trim()
      });
      
      setAnalysisResult(response);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${response.detectedBlockchain} wallet`,
        variant: "default",
      });
    } catch (error) {
      console.error("Cross-chain analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze wallet. Please check the address format.",
        variant: "destructive",
      });
    } finally {
      setAnalyzingWallet(false);
    }
  };
  const queryClient = useQueryClient();
  
  const [whiteLabelConfig, setWhiteLabelConfig] = useState({
    clientId: '',
    brandName: '',
    logoUrl: '',
    primaryColor: '#7c3aed',
    secondaryColor: '#06b6d4',
    customDomain: '',
    features: []
  });

  const [permissionConfig, setPermissionConfig] = useState({
    clientId: '',
    userId: '',
    role: 'analyst',
    customPermissions: {},
    dataAccessLimits: {}
  });

  const [complianceConfig, setComplianceConfig] = useState({
    clientId: '',
    requirements: []
  });

  const [apiConfig, setApiConfig] = useState({
    clientId: '',
    tierLimits: {
      requestsPerMinute: 1000,
      requestsPerMonth: 100000,
      walletsPerAnalysis: 10000
    }
  });

  // White-label solution creation
  const createWhiteLabelMutation = useMutation({
    mutationFn: async (config: any) => {
      return await apiRequest('POST', '/api/flutterai/enterprise/white-label/create', config);
    },
    onSuccess: (data) => {
      toast({
        title: "White-label Solution Created",
        description: `Successfully created white-label solution for ${whiteLabelConfig.brandName}`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/enterprise'] });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create white-label solution",
        variant: "destructive",
      });
    },
  });

  // Enterprise permissions management
  const managePermissionsMutation = useMutation({
    mutationFn: async (config: any) => {
      return await apiRequest('POST', '/api/flutterai/enterprise/permissions/manage', config);
    },
    onSuccess: (data) => {
      toast({
        title: "Permissions Updated",
        description: "Enterprise permissions configured successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Permission Update Failed",
        description: error.message || "Failed to update permissions",
        variant: "destructive",
      });
    },
  });

  // Compliance framework setup
  const setupComplianceMutation = useMutation({
    mutationFn: async (config: any) => {
      return await apiRequest('POST', '/api/flutterai/enterprise/compliance/setup', config);
    },
    onSuccess: (data) => {
      toast({
        title: "Compliance Framework Setup",
        description: "Compliance framework configured successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to setup compliance framework",
        variant: "destructive",
      });
    },
  });

  // API management setup
  const setupAPIMutation = useMutation({
    mutationFn: async (config: any) => {
      return await apiRequest('POST', '/api/flutterai/enterprise/api-management/setup', config);
    },
    onSuccess: (data) => {
      toast({
        title: "API Management Setup",
        description: "API management configured successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to setup API management",
        variant: "destructive",
      });
    },
  });

  const handleCreateWhiteLabel = () => {
    if (!whiteLabelConfig.clientId || !whiteLabelConfig.brandName) {
      toast({
        title: "Missing Information",
        description: "Please provide client ID and brand name",
        variant: "destructive",
      });
      return;
    }
    createWhiteLabelMutation.mutate(whiteLabelConfig);
  };

  const handleManagePermissions = () => {
    if (!permissionConfig.clientId || !permissionConfig.userId) {
      toast({
        title: "Missing Information",
        description: "Please provide client ID and user ID",
        variant: "destructive",
      });
      return;
    }
    managePermissionsMutation.mutate(permissionConfig);
  };

  const handleSetupCompliance = () => {
    if (!complianceConfig.clientId || complianceConfig.requirements.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide client ID and compliance requirements",
        variant: "destructive",
      });
      return;
    }
    setupComplianceMutation.mutate(complianceConfig);
  };

  const handleSetupAPI = () => {
    if (!apiConfig.clientId) {
      toast({
        title: "Missing Information",
        description: "Please provide client ID",
        variant: "destructive",
      });
      return;
    }
    setupAPIMutation.mutate(apiConfig);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Information copied successfully",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Enterprise Dashboard</h2>
          <p className="text-slate-400">Manage enterprise features, white-label solutions, and client configurations</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/20">
          <Building className="h-4 w-4 mr-2" />
          Enterprise Mode
        </Badge>
      </div>

      {/* Enterprise Features Tabs */}
      <Tabs defaultValue="cross-chain" className="space-y-6">
        <TabsList className="grid grid-cols-4 bg-slate-700/50 border border-purple-500/20 mb-4">
          <TabsTrigger value="cross-chain" className="data-[state=active]:bg-green-500/20">
            <Network className="h-4 w-4 mr-2" />
            Cross-Chain
          </TabsTrigger>
          <TabsTrigger value="government" className="data-[state=active]:bg-red-500/20">
            <Gavel className="h-4 w-4 mr-2" />
            Government
          </TabsTrigger>
          <TabsTrigger value="investigation" className="data-[state=active]:bg-orange-500/20">
            <FileSearch className="h-4 w-4 mr-2" />
            Investigation
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-blue-500/20">
            <Shield className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsList className="grid grid-cols-4 bg-slate-700/30 border border-purple-500/10">
          <TabsTrigger value="white-label" className="data-[state=active]:bg-purple-500/20">
            <Palette className="h-4 w-4 mr-2" />
            White-label
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-purple-500/20">
            <Users className="h-4 w-4 mr-2" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-purple-500/20">
            <Key className="h-4 w-4 mr-2" />
            API Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Cross-Chain Intelligence Tab */}
        <TabsContent value="cross-chain" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-700/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Network className="h-5 w-5 text-green-400" />
                  Cross-Chain Analysis Engine
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Analyze wallet activities across Ethereum, Bitcoin, and Solana blockchains
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">ETH</span>
                      </div>
                    </div>
                    <div className="text-white font-semibold">Ethereum</div>
                    <div className="text-green-400 text-sm">Active</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Bitcoin className="h-8 w-8 text-orange-400" />
                    </div>
                    <div className="text-white font-semibold">Bitcoin</div>
                    <div className="text-green-400 text-sm">Active</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">SOL</span>
                      </div>
                    </div>
                    <div className="text-white font-semibold">Solana</div>
                    <div className="text-green-400 text-sm">Active</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-white">Cross-Chain Wallet Address</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={walletInput}
                      onChange={(e) => setWalletInput(e.target.value)}
                      placeholder="Enter wallet address for cross-chain analysis..."
                      className="bg-slate-800 border-green-500/20 text-white"
                    />
                    <Button 
                      onClick={handleCrossChainAnalysis}
                      disabled={analyzingWallet || !walletInput}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600"
                    >
                      {analyzingWallet ? (
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      {analyzingWallet ? 'Analyzing...' : 'Analyze'}
                    </Button>
                  </div>
                </div>

                {/* Live Analysis Results */}
                {analysisResult && (
                  <div className="mt-6 space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/20">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        Cross-Chain Analysis Complete
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-green-400 text-sm">Detected Blockchain</div>
                          <div className="text-white text-lg font-bold capitalize">{analysisResult.detectedBlockchain}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 text-sm">Total Portfolio</div>
                          <div className="text-white text-lg font-bold">${analysisResult.summary?.totalPortfolioValue?.toLocaleString() || '0'}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 text-sm">Risk Profile</div>
                          <div className="text-white text-lg font-bold capitalize">{analysisResult.summary?.riskProfile || 'Unknown'}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 text-sm">Active Chains</div>
                          <div className="text-white text-lg font-bold">{analysisResult.summary?.activeChains?.length || 0}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Detailed Analysis */}
                    {analysisResult.detailedAnalysis?.map((chainData: any, index: number) => (
                      <div key={index} className="bg-slate-800/30 p-4 rounded-lg">
                        <h5 className="text-white font-semibold mb-2 capitalize">{chainData.blockchain} Analysis</h5>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-slate-400">Balance: </span>
                            <span className="text-white">{chainData.balance} {chainData.blockchain === 'ethereum' ? 'ETH' : chainData.blockchain === 'bitcoin' ? 'BTC' : 'SOL'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Transactions: </span>
                            <span className="text-white">{chainData.transactionCount?.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Portfolio Value: </span>
                            <span className="text-white">${chainData.portfolioValue?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-800/30 p-3 rounded">
                    <div className="text-green-400 text-sm">Total Transactions</div>
                    <div className="text-white text-xl font-bold">847,329</div>
                  </div>
                  <div className="bg-slate-800/30 p-3 rounded">
                    <div className="text-green-400 text-sm">Cross-Chain Volume</div>
                    <div className="text-white text-xl font-bold">$12.4M</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-400" />
                  Enterprise Analytics
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Advanced cross-chain intelligence for enterprise clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { feature: 'Multi-chain Transaction Tracking', status: 'Active', price: '$50K/year' },
                    { feature: 'Cross-chain Risk Assessment', status: 'Active', price: '$75K/year' },
                    { feature: 'Enterprise API Access', status: 'Active', price: '$100K/year' },
                    { feature: 'Custom Analytics Dashboard', status: 'Active', price: '$150K/year' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{item.feature}</div>
                        <div className="text-green-400 text-sm">{item.status}</div>
                      </div>
                      <Badge className="bg-green-600/20 text-green-300 border-green-500/20">
                        {item.price}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Government & Law Enforcement Tab */}
        <TabsContent value="government" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-700/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-red-400" />
                  Government Intelligence Tools
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Specialized tools for law enforcement and regulatory compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-red-400" />
                      <span className="text-white font-semibold">OFAC Compliance Scanner</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">
                      Real-time screening against OFAC sanctions lists
                    </p>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Search className="h-4 w-4 mr-2" />
                      Run OFAC Scan
                    </Button>
                  </div>

                  <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-red-400" />
                      <span className="text-white font-semibold">AML Investigation Suite</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">
                      Advanced anti-money laundering detection and reporting
                    </p>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <FileSearch className="h-4 w-4 mr-2" />
                      Start Investigation
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 p-3 rounded text-center">
                    <div className="text-red-400 text-sm">High Risk Wallets</div>
                    <div className="text-white text-xl font-bold">2,847</div>
                  </div>
                  <div className="bg-slate-800/30 p-3 rounded text-center">
                    <div className="text-red-400 text-sm">OFAC Matches</div>
                    <div className="text-white text-xl font-bold">143</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-red-400" />
                  Enterprise Government Contracts
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Premium government and law enforcement packages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { package: 'Law Enforcement Basic', agencies: '15 Agencies', price: '$200K/year' },
                    { package: 'Federal Investigation Suite', agencies: '8 Federal Agencies', price: '$500K/year' },
                    { package: 'International Compliance', agencies: '25 Countries', price: '$1M/year' },
                    { package: 'Custom Government Solution', agencies: 'Unlimited', price: '$2M+/year' }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white font-semibold">{item.package}</div>
                          <div className="text-red-300 text-sm">{item.agencies}</div>
                        </div>
                        <Badge className="bg-red-600/20 text-red-300 border-red-500/20">
                          {item.price}
                        </Badge>
                      </div>
                      <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 mt-2">
                        Request Access
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Investigation Tools Tab */}
        <TabsContent value="investigation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-700/50 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileSearch className="h-5 w-5 text-orange-400" />
                  Advanced Investigation Platform
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Comprehensive blockchain forensics and investigation tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-white">Investigation Target</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        placeholder="Wallet address, transaction hash, or entity..."
                        className="bg-slate-800 border-orange-500/20 text-white"
                      />
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-orange-900/20 border border-orange-500/20 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-2">Investigation Features</div>
                    <div className="space-y-2">
                      {[
                        'Transaction Path Analysis',
                        'Entity Clustering',
                        'Risk Scoring & Profiling',
                        'Cross-chain Transaction Tracing',
                        'Automated Report Generation'
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-orange-400" />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-orange-400" />
                  AI-Powered Analysis
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Machine learning enhanced investigation capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-orange-900/20 border border-orange-500/20 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-2">AI Investigation Tools</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-orange-400 text-2xl font-bold">97.3%</div>
                        <div className="text-slate-400 text-xs">Detection Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-400 text-2xl font-bold">45ms</div>
                        <div className="text-slate-400 text-xs">Analysis Speed</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { tool: 'Pattern Recognition Engine', price: '$300K/year' },
                      { tool: 'Behavioral Analysis Suite', price: '$250K/year' },
                      { tool: 'Predictive Risk Modeling', price: '$400K/year' },
                      { tool: 'Custom AI Training', price: '$500K/year' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-slate-800/30 rounded">
                        <span className="text-white text-sm">{item.tool}</span>
                        <Badge className="bg-orange-600/20 text-orange-300 border-orange-500/20 text-xs">
                          {item.price}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-700/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Enterprise Compliance Suite
                </CardTitle>
                <CardDescription className="text-slate-400">
                  SOC2, GDPR, and regulatory compliance frameworks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-900/20 border border-blue-500/20 p-3 rounded text-center">
                    <div className="text-blue-400 font-semibold">SOC2</div>
                    <div className="text-green-400 text-sm">Certified</div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/20 p-3 rounded text-center">
                    <div className="text-blue-400 font-semibold">GDPR</div>
                    <div className="text-green-400 text-sm">Compliant</div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/20 p-3 rounded text-center">
                    <div className="text-blue-400 font-semibold">ISO 27001</div>
                    <div className="text-green-400 text-sm">Certified</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-white">Client Compliance Setup</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800 border-blue-500/20 text-white">
                        <SelectValue placeholder="Select compliance framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soc2">SOC2 Type II</SelectItem>
                        <SelectItem value="gdpr">GDPR Compliance</SelectItem>
                        <SelectItem value="iso27001">ISO 27001</SelectItem>
                        <SelectItem value="custom">Custom Framework</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Shield className="h-4 w-4 mr-2" />
                    Setup Compliance Framework
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-400" />
                  Data Security & Privacy
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Enterprise-grade security and privacy controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { feature: 'End-to-End Encryption', status: 'Active' },
                    { feature: 'Zero-Knowledge Architecture', status: 'Active' },
                    { feature: 'Multi-Factor Authentication', status: 'Active' },
                    { feature: 'Audit Trail Logging', status: 'Active' },
                    { feature: 'Data Residency Controls', status: 'Active' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-blue-900/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{item.feature}</span>
                      </div>
                      <Badge className="bg-green-600/20 text-green-300 border-green-500/20">
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* White-label Solution Tab */}
        <TabsContent value="white-label" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-400" />
                White-label Solution Configuration
              </CardTitle>
              <CardDescription className="text-slate-400">
                Create custom-branded FlutterAI solutions for enterprise clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientId" className="text-white">Client ID</Label>
                    <Input
                      id="clientId"
                      value={whiteLabelConfig.clientId}
                      onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, clientId: e.target.value})}
                      placeholder="enterprise-client-001"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="brandName" className="text-white">Brand Name</Label>
                    <Input
                      id="brandName"
                      value={whiteLabelConfig.brandName}
                      onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, brandName: e.target.value})}
                      placeholder="Acme Intelligence Platform"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="logoUrl" className="text-white">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={whiteLabelConfig.logoUrl}
                      onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, logoUrl: e.target.value})}
                      placeholder="https://example.com/logo.png"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customDomain" className="text-white">Custom Domain (Optional)</Label>
                    <Input
                      id="customDomain"
                      value={whiteLabelConfig.customDomain}
                      onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, customDomain: e.target.value})}
                      placeholder="intelligence.acme.com"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primaryColor" className="text-white">Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={whiteLabelConfig.primaryColor}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, primaryColor: e.target.value})}
                        className="w-16 h-10 bg-slate-600 border-slate-500"
                      />
                      <Input
                        value={whiteLabelConfig.primaryColor}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, primaryColor: e.target.value})}
                        className="bg-slate-600 border-slate-500 text-white"
                        placeholder="#7c3aed"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryColor" className="text-white">Secondary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={whiteLabelConfig.secondaryColor}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, secondaryColor: e.target.value})}
                        className="w-16 h-10 bg-slate-600 border-slate-500"
                      />
                      <Input
                        value={whiteLabelConfig.secondaryColor}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, secondaryColor: e.target.value})}
                        className="bg-slate-600 border-slate-500 text-white"
                        placeholder="#06b6d4"
                      />
                    </div>
                  </div>
                  
                  {/* Color Preview */}
                  <div className="p-4 rounded-lg border border-slate-500" 
                       style={{ 
                         background: `linear-gradient(135deg, ${whiteLabelConfig.primaryColor}, ${whiteLabelConfig.secondaryColor})` 
                       }}>
                    <div className="text-white font-medium">{whiteLabelConfig.brandName || 'Brand Preview'}</div>
                    <div className="text-white/80 text-sm">Intelligence Platform</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleCreateWhiteLabel}
                  disabled={createWhiteLabelMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {createWhiteLabelMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Create White-label Solution
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-slate-500 text-slate-300 hover:bg-slate-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Management Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Enterprise Permissions Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure role-based access control and data access limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="permClientId" className="text-white">Client ID</Label>
                    <Input
                      id="permClientId"
                      value={permissionConfig.clientId}
                      onChange={(e) => setPermissionConfig({...permissionConfig, clientId: e.target.value})}
                      placeholder="enterprise-client-001"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="userId" className="text-white">User ID</Label>
                    <Input
                      id="userId"
                      value={permissionConfig.userId}
                      onChange={(e) => setPermissionConfig({...permissionConfig, userId: e.target.value})}
                      placeholder="user@enterprise.com"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role" className="text-white">Role</Label>
                    <Select 
                      value={permissionConfig.role}
                      onValueChange={(value) => setPermissionConfig({...permissionConfig, role: value})}
                    >
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-600 border-slate-500">
                        <SelectItem value="admin">Admin - Full access</SelectItem>
                        <SelectItem value="analyst">Analyst - Analysis & Reports</SelectItem>
                        <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                        <SelectItem value="api_user">API User - API access only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-white font-medium mb-3">Permission Settings</div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Wallet Analysis</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Group Analysis</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Export Data</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Manage Users</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">API Access</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Real-time Data</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleManagePermissions}
                disabled={managePermissionsMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {managePermissionsMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Update Permissions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Framework Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                Compliance Framework Setup
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure compliance requirements for enterprise clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="complianceClientId" className="text-white">Client ID</Label>
                    <Input
                      id="complianceClientId"
                      value={complianceConfig.clientId}
                      onChange={(e) => setComplianceConfig({...complianceConfig, clientId: e.target.value})}
                      placeholder="enterprise-client-001"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div className="text-white font-medium mb-3">Compliance Requirements</div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">GDPR</div>
                        <div className="text-xs text-slate-400">EU General Data Protection Regulation</div>
                      </div>
                      <Switch 
                        onCheckedChange={(checked) => {
                          const reqs = complianceConfig.requirements;
                          if (checked) {
                            setComplianceConfig({...complianceConfig, requirements: [...reqs, 'gdpr']});
                          } else {
                            setComplianceConfig({...complianceConfig, requirements: reqs.filter(r => r !== 'gdpr')});
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">SOC 2</div>
                        <div className="text-xs text-slate-400">Service Organization Control 2</div>
                      </div>
                      <Switch 
                        onCheckedChange={(checked) => {
                          const reqs = complianceConfig.requirements;
                          if (checked) {
                            setComplianceConfig({...complianceConfig, requirements: [...reqs, 'soc2']});
                          } else {
                            setComplianceConfig({...complianceConfig, requirements: reqs.filter(r => r !== 'soc2')});
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">CCPA</div>
                        <div className="text-xs text-slate-400">California Consumer Privacy Act</div>
                      </div>
                      <Switch 
                        onCheckedChange={(checked) => {
                          const reqs = complianceConfig.requirements;
                          if (checked) {
                            setComplianceConfig({...complianceConfig, requirements: [...reqs, 'ccpa']});
                          } else {
                            setComplianceConfig({...complianceConfig, requirements: reqs.filter(r => r !== 'ccpa')});
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">AML</div>
                        <div className="text-xs text-slate-400">Anti-Money Laundering</div>
                      </div>
                      <Switch 
                        onCheckedChange={(checked) => {
                          const reqs = complianceConfig.requirements;
                          if (checked) {
                            setComplianceConfig({...complianceConfig, requirements: [...reqs, 'aml']});
                          } else {
                            setComplianceConfig({...complianceConfig, requirements: reqs.filter(r => r !== 'aml')});
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-white font-medium mb-3">Audit Settings</div>
                  
                  <div className="p-4 bg-slate-600/30 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Real-time Monitoring</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Audit Trail</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Data Encryption</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Incident Response</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white">Log Retention (Days)</Label>
                    <Input
                      type="number"
                      defaultValue="2555"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSetupCompliance}
                disabled={setupComplianceMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {setupComplianceMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Setup Compliance Framework
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Management Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-yellow-400" />
                Enterprise API Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure API access, rate limits, and usage monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiClientId" className="text-white">Client ID</Label>
                    <Input
                      id="apiClientId"
                      value={apiConfig.clientId}
                      onChange={(e) => setApiConfig({...apiConfig, clientId: e.target.value})}
                      placeholder="enterprise-client-001"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Rate Limits</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-slate-300">Requests per Minute</Label>
                        <Input
                          type="number"
                          value={apiConfig.tierLimits.requestsPerMinute}
                          onChange={(e) => setApiConfig({
                            ...apiConfig, 
                            tierLimits: {...apiConfig.tierLimits, requestsPerMinute: parseInt(e.target.value)}
                          })}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-slate-300">Monthly Quota</Label>
                        <Input
                          type="number"
                          value={apiConfig.tierLimits.requestsPerMonth}
                          onChange={(e) => setApiConfig({
                            ...apiConfig, 
                            tierLimits: {...apiConfig.tierLimits, requestsPerMonth: parseInt(e.target.value)}
                          })}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-slate-300">Wallets per Analysis</Label>
                        <Input
                          type="number"
                          value={apiConfig.tierLimits.walletsPerAnalysis}
                          onChange={(e) => setApiConfig({
                            ...apiConfig, 
                            tierLimits: {...apiConfig.tierLimits, walletsPerAnalysis: parseInt(e.target.value)}
                          })}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-white font-medium mb-3">API Key Preview</div>
                  
                  <div className="p-4 bg-slate-600/30 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Primary Key</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard('flai_ent_abc123xyz789...')}
                        className="text-purple-300 hover:bg-purple-500/10"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="font-mono text-xs text-slate-400 bg-slate-700/50 p-2 rounded break-all">
                      flai_ent_abc123xyz789...
                    </div>
                  </div>
                  
                  <div className="text-white font-medium mb-3">Available Endpoints</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className="bg-green-500/20 text-green-300">GET</Badge>
                      <span className="text-slate-300">/api/enterprise/wallet-analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className="bg-blue-500/20 text-blue-300">POST</Badge>
                      <span className="text-slate-300">/api/enterprise/group-analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className="bg-purple-500/20 text-purple-300">GET</Badge>
                      <span className="text-slate-300">/api/enterprise/real-time-intelligence</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className="bg-yellow-500/20 text-yellow-300">POST</Badge>
                      <span className="text-slate-300">/api/enterprise/custom-reports</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSetupAPI}
                disabled={setupAPIMutation.isPending}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {setupAPIMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Setup API Management
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enterprise Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Enterprise Analytics Overview
              </CardTitle>
              <CardDescription className="text-slate-400">
                Monitor enterprise client usage, performance, and business metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-300">127</div>
                  <div className="text-sm text-slate-400">Total Enterprise Clients</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-3xl font-bold text-green-300">$1.27M</div>
                  <div className="text-sm text-slate-400">Monthly Recurring Revenue</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-300">15.2M</div>
                  <div className="text-sm text-slate-400">API Calls This Month</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-3xl font-bold text-red-300">98.9%</div>
                  <div className="text-sm text-slate-400">System Uptime</div>
                </div>
              </div>

              {/* Enterprise Pricing Tiers Breakdown */}
              <div className="bg-slate-600/30 p-4 rounded-lg mb-6">
                <h4 className="text-white font-semibold mb-4">Enterprise Pricing Tiers Performance</h4>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <div className="text-green-400 font-semibold">Enterprise Plus</div>
                    <div className="text-white text-2xl font-bold">43</div>
                    <div className="text-slate-400 text-sm">$5K/month clients</div>
                    <div className="text-green-400 text-sm mt-2">$215K MRR</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <div className="text-purple-400 font-semibold">Enterprise Elite</div>
                    <div className="text-white text-2xl font-bold">18</div>
                    <div className="text-slate-400 text-sm">$25K/month clients</div>
                    <div className="text-purple-400 text-sm mt-2">$450K MRR</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <div className="text-red-400 font-semibold">Government/Law</div>
                    <div className="text-white text-2xl font-bold">12</div>
                    <div className="text-slate-400 text-sm">$50K+/month clients</div>
                    <div className="text-red-400 text-sm mt-2">$600K+ MRR</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <div className="text-blue-400 font-semibold">Standard Enterprise</div>
                    <div className="text-white text-2xl font-bold">54</div>
                    <div className="text-slate-400 text-sm">$99.99/month clients</div>
                    <div className="text-blue-400 text-sm mt-2">$5.4K MRR</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-slate-600/30 rounded-lg">
                <div className="text-white font-medium mb-3">Recent Enterprise Activity</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-slate-300">White-label solution deployed for Acme Corp</span>
                    </div>
                    <span className="text-xs text-slate-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-slate-300">API rate limit reached for TechStart Inc</span>
                    </div>
                    <span className="text-xs text-slate-400">5 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-slate-300">Compliance audit completed for BigBank Ltd</span>
                    </div>
                    <span className="text-xs text-slate-400">1 day ago</span>
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