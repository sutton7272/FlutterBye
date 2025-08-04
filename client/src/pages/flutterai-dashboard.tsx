import React, { useState, useEffect } from 'react';
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
  Trash2,
  Settings
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
 * FlutterAI Intelligence Dashboard
 * 
 * Comprehensive wallet intelligence and social credit scoring system
 * Features automatic collection, manual entry, CSV uploads, and AI analysis
 */
export default function FlutterAIDashboard() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
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

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="intelligence" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-slate-800/50">
            <TabsTrigger value="intelligence" className="data-[state=active]:bg-purple-600">
              <Star className="h-4 w-4 mr-2" />
              Intelligence
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-purple-600">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="collection" className="data-[state=active]:bg-purple-600">
              <Upload className="h-4 w-4 mr-2" />
              Collection
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600">
              <Brain className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="wallets" className="data-[state=active]:bg-purple-600">
              <Wallet className="h-4 w-4 mr-2" />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="batches" className="data-[state=active]:bg-purple-600">
              <FileText className="h-4 w-4 mr-2" />
              Batches
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-purple-600">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Revolutionary Social Credit Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6">
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

          {/* Collection Tab */}
          <TabsContent value="collection" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Manual Entry */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-purple-400" />
                    Manual Wallet Entry
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Add individual wallet addresses for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="manual-wallet" className="text-purple-200">Wallet Address</Label>
                    <Input
                      id="manual-wallet"
                      value={manualWallet}
                      onChange={(e) => setManualWallet(e.target.value)}
                      placeholder="Enter Solana wallet address..."
                      className="bg-slate-700 border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manual-tags" className="text-purple-200">Tags (comma-separated)</Label>
                    <Input
                      id="manual-tags"
                      value={manualTags}
                      onChange={(e) => setManualTags(e.target.value)}
                      placeholder="e.g., high-value, suspicious, whale"
                      className="bg-slate-700 border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manual-notes" className="text-purple-200">Notes</Label>
                    <Input
                      id="manual-notes"
                      value={manualNotes}
                      onChange={(e) => setManualNotes(e.target.value)}
                      placeholder="Additional notes about this wallet..."
                      className="bg-slate-700 border-purple-500/20 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleManualEntry}
                    disabled={manualEntryMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {manualEntryMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wallet className="h-4 w-4 mr-2" />
                    )}
                    Add Wallet
                  </Button>
                </CardContent>
              </Card>

              {/* CSV Upload */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="h-5 w-5 text-purple-400" />
                    Bulk CSV Upload
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Upload multiple wallet addresses from CSV file
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="batch-name" className="text-purple-200">Batch Name</Label>
                    <Input
                      id="batch-name"
                      value={batchName}
                      onChange={(e) => setBatchName(e.target.value)}
                      placeholder="Enter batch name..."
                      className="bg-slate-700 border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="csv-file" className="text-purple-200">CSV File</Label>
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      className="bg-slate-700 border-purple-500/20 text-white"
                    />
                  </div>
                  <Alert className="bg-slate-700/50 border-purple-500/20">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-purple-200">
                      CSV format: First column should contain wallet addresses. Headers will be automatically detected.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleCsvUpload}
                    disabled={csvUploadMutation.isPending || !csvFile || !batchName}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {csvUploadMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload CSV
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Automatic Collection Status */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-400" />
                  Automatic Collection Status
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Real-time wallet collection from FlutterBye and PerpeTrader connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">FlutterBye Webhook</span>
                    </div>
                    <Badge variant="default" className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">PerpeTrader Webhook</span>
                    </div>
                    <Badge variant="default" className="bg-blue-600">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Analysis Engine
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Advanced AI-powered wallet intelligence and social credit scoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Social Credit Scoring</h3>
                    <p className="text-purple-200 text-sm">
                      0-1000 point scoring system based on trading behavior, portfolio quality, and activity patterns
                    </p>
                  </div>
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Risk Assessment</h3>
                    <p className="text-purple-200 text-sm">
                      Multi-level risk classification from low to critical based on behavioral analysis
                    </p>
                  </div>
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Behavioral Patterns</h3>
                    <p className="text-purple-200 text-sm">
                      Trading volume, DeFi engagement, liquidity management, and portfolio diversity analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallets Tab */}
          <TabsContent value="wallets" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={selectedRiskLevel === '' ? 'default' : 'outline'}
                  onClick={() => setSelectedRiskLevel('')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  All Risks
                </Button>
                <Button
                  variant={selectedRiskLevel === 'low' ? 'default' : 'outline'}
                  onClick={() => setSelectedRiskLevel('low')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Low Risk
                </Button>
                <Button
                  variant={selectedRiskLevel === 'medium' ? 'default' : 'outline'}
                  onClick={() => setSelectedRiskLevel('medium')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Medium Risk
                </Button>
                <Button
                  variant={selectedRiskLevel === 'high' ? 'default' : 'outline'}
                  onClick={() => setSelectedRiskLevel('high')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  High Risk
                </Button>
              </div>
              <Button
                onClick={() => handleExport('csv')}
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Wallet Intelligence Database</CardTitle>
                <CardDescription className="text-purple-200">
                  {walletsLoading ? 'Loading...' : `${walletIntelligence?.data?.length || 0} wallets found`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {walletsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {walletIntelligence?.data?.map((wallet: any) => (
                      <div
                        key={wallet.walletAddress}
                        className="p-4 bg-slate-700/50 rounded-lg border border-purple-500/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <code className="text-purple-300 text-sm font-mono">
                              {wallet.walletAddress.slice(0, 8)}...{wallet.walletAddress.slice(-8)}
                            </code>
                            <Badge 
                              variant={getRiskVariant(wallet.riskLevel)}
                              className={`${getRiskColor(wallet.riskLevel)} text-white`}
                            >
                              {wallet.riskLevel.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                              {wallet.socialCreditScore}
                            </div>
                            <div className="text-xs text-purple-300">Credit Score</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-purple-200">Trading</div>
                            <div className="text-white font-medium">{wallet.tradingBehaviorScore}/100</div>
                          </div>
                          <div>
                            <div className="text-purple-200">Portfolio</div>
                            <div className="text-white font-medium">{wallet.portfolioQualityScore}/100</div>
                          </div>
                          <div>
                            <div className="text-purple-200">Liquidity</div>
                            <div className="text-white font-medium">{wallet.liquidityScore}/100</div>
                          </div>
                          <div>
                            <div className="text-purple-200">Activity</div>
                            <div className="text-white font-medium">{wallet.activityScore}/100</div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between text-xs text-purple-300">
                          <span>Source: {wallet.collectionSource.replace('_', ' ')}</span>
                          <span>
                            {wallet.lastAnalyzed 
                              ? `Analyzed ${new Date(wallet.lastAnalyzed).toLocaleDateString()}`
                              : 'Analysis pending'
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Batches Tab */}
          <TabsContent value="batches">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  Upload Batches
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Track and manage CSV upload batches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batches?.batches?.map((batch: any) => (
                    <div
                      key={batch.id}
                      className="p-4 bg-slate-700/50 rounded-lg border border-purple-500/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{batch.batchName}</h3>
                        <Badge variant="outline" className="border-purple-500 text-purple-300">
                          {batch.fileName}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-purple-200">Total Wallets</div>
                          <div className="text-white font-medium">{batch.totalWallets}</div>
                        </div>
                        <div>
                          <div className="text-purple-200">Processed</div>
                          <div className="text-white font-medium">{batch.processedWallets || 0}</div>
                        </div>
                        <div>
                          <div className="text-purple-200">Uploaded By</div>
                          <div className="text-white font-medium">{batch.uploadedBy}</div>
                        </div>
                        <div>
                          <div className="text-purple-200">Date</div>
                          <div className="text-white font-medium">
                            {new Date(batch.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={(batch.processedWallets / batch.totalWallets) * 100} 
                        className="mt-3"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    System Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {intelligenceStats && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-purple-200 mb-3">Collection Sources</h4>
                        <div className="space-y-2">
                          {Object.entries(intelligenceStats.stats.bySource).map(([source, count]) => (
                            <div key={source} className="flex justify-between items-center">
                              <span className="text-white capitalize">{source.replace('_', ' ')}</span>
                              <Badge variant="outline" className="border-purple-500 text-purple-300">
                                {count as any}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-purple-200 mb-3">Risk Distribution</h4>
                        <div className="space-y-2">
                          {Object.entries(intelligenceStats.stats.byRiskLevel).map(([level, count]) => (
                            <div key={level} className="flex justify-between items-center">
                              <span className="text-white capitalize">{level}</span>
                              <Badge 
                                variant={getRiskVariant(level) as any}
                                className={`${getRiskColor(level)} text-white`}
                              >
                                {count as any}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Download className="h-5 w-5 text-purple-400" />
                    Data Export
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleExport('csv')}
                      variant="outline"
                      className="border-purple-500 text-purple-300 hover:bg-purple-600"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button
                      onClick={() => handleExport('json')}
                      variant="outline"
                      className="border-purple-500 text-purple-300 hover:bg-purple-600"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                  
                  <Alert className="bg-slate-700/50 border-purple-500/20">
                    <Lock className="h-4 w-4 text-purple-400" />
                    <AlertDescription className="text-purple-200">
                      Exported data includes wallet addresses, scores, risk levels, and analysis metadata.
                      Handle with appropriate security measures.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admin Controls Tab */}
          <TabsContent value="admin" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    Pricing Management
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Edit pricing plans and features for FlutterAI services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AdminPricingEditor />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}