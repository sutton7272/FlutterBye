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
  Users
} from "lucide-react";

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

  // Data queries
  const { data: stats } = useQuery({
    queryKey: ['/api/flutterai/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: wallets, isLoading: walletsLoading } = useQuery({
    queryKey: ['/api/flutterai/wallets', selectedRiskLevel],
    queryFn: async () => {
      const url = selectedRiskLevel 
        ? `/api/flutterai/wallets?riskLevel=${selectedRiskLevel}`
        : '/api/flutterai/wallets';
      return await apiRequest('GET', url);
    },
  });

  const { data: batches } = useQuery({
    queryKey: ['/api/flutterai/batches'],
  });

  const { data: queueStatus } = useQuery({
    queryKey: ['/api/flutterai/queue-status'],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

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
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Total Wallets</CardTitle>
                <Database className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.stats.totalWallets.toLocaleString()}</div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="text-green-400">FlutterBye: {stats.stats.bySource.flutterbye_connect}</div>
                  <div className="text-blue-400">PerpeTrader: {stats.stats.bySource.perpetrader_connect}</div>
                  <div className="text-yellow-400">Manual: {stats.stats.bySource.manual_entry}</div>
                  <div className="text-purple-400">CSV: {stats.stats.bySource.csv_upload}</div>
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
                    <Badge variant="default" className="bg-green-600">{stats.stats.byRiskLevel.low}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 text-sm">Medium</span>
                    <Badge variant="secondary" className="bg-yellow-600">{stats.stats.byRiskLevel.medium}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 text-sm">High+</span>
                    <Badge variant="destructive">{stats.stats.byRiskLevel.high + stats.stats.byRiskLevel.critical}</Badge>
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
                    <span className="text-white font-bold">{stats.stats.analysisStats.queued}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400 text-sm">Processing</span>
                    <span className="text-white font-bold">{stats.stats.analysisStats.processing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400 text-sm">Completed</span>
                    <span className="text-white font-bold">{stats.stats.analysisStats.completed}</span>
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
        <Tabs defaultValue="collection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
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
          </TabsList>

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
                  {walletsLoading ? 'Loading...' : `${wallets?.wallets?.length || 0} wallets found`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {walletsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {wallets?.wallets?.map((wallet: any) => (
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
                  {stats && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-purple-200 mb-3">Collection Sources</h4>
                        <div className="space-y-2">
                          {Object.entries(stats.stats.bySource).map(([source, count]) => (
                            <div key={source} className="flex justify-between items-center">
                              <span className="text-white capitalize">{source.replace('_', ' ')}</span>
                              <Badge variant="outline" className="border-purple-500 text-purple-300">
                                {count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-purple-200 mb-3">Risk Distribution</h4>
                        <div className="space-y-2">
                          {Object.entries(stats.stats.byRiskLevel).map(([level, count]) => (
                            <div key={level} className="flex justify-between items-center">
                              <span className="text-white capitalize">{level}</span>
                              <Badge 
                                variant={getRiskVariant(level)}
                                className={`${getRiskColor(level)} text-white`}
                              >
                                {count}
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
        </Tabs>
      </div>
    </div>
  );
}