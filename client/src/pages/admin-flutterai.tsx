import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Brain, Database, Search, Plus, TrendingUp, Users, Activity, Zap, Download, BarChart3 } from "lucide-react";
import FlutterAIDashboard from "./flutterai-dashboard";
import MarketingIntelligence from "./MarketingIntelligence";

interface WalletIntelligence {
  id: string;
  walletAddress: string;
  blockchain?: string;
  network?: string;
  socialCreditScore: number;
  riskLevel: string;
  tradingBehaviorScore: number;
  portfolioQualityScore: number;
  liquidityScore: number;
  activityScore: number;
  defiEngagementScore: number;
  marketingSegment: string;
  communicationStyle: string;
  preferredTokenTypes: string[];
  riskTolerance: string;
  investmentProfile: string;
  tradingFrequency: string;
  portfolioSize: string;
  influenceScore: number;
  socialConnections: number;
  marketingInsights: any;
  analysisData: any;
  sourceToken?: string;
  lastAnalyzed: string;
  createdAt: string;
  updatedAt: string;
}

interface AnalysisStats {
  totalWallets: number;
  analyzedWallets: number;
  pendingAnalysis: number;
  avgFlutteraiScore: number;
  blockchainDistribution: Record<string, number>;
  scoreDistribution: Record<string, number>;
}

const SUPPORTED_BLOCKCHAINS = [
  "solana", "ethereum", "polygon", "arbitrum", "optimism", 
  "base", "avalanche", "fantom", "binance_smart_chain", "near", "aptos"
];

const SCORE_RANGES = {
  "S": { min: 900, max: 1000, color: "bg-yellow-500" },
  "A": { min: 800, max: 899, color: "bg-green-500" },
  "B": { min: 700, max: 799, color: "bg-blue-500" },
  "C": { min: 600, max: 699, color: "bg-orange-500" },
  "D": { min: 400, max: 599, color: "bg-red-500" },
  "F": { min: 0, max: 399, color: "bg-gray-500" }
};

function DatabaseManagement() {
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState("solana");
  const [bulkWallets, setBulkWallets] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBlockchain, setFilterBlockchain] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch wallet intelligence data
  const { data: walletData, isLoading: walletsLoading } = useQuery({
    queryKey: ["/api/flutterai/intelligence", searchTerm, filterBlockchain, filterStatus],
    queryFn: async () => {
      console.log("🔍 Frontend: Fetching wallet intelligence data...");
      const response = await apiRequest("GET", `/api/flutterai/intelligence?search=${searchTerm}&blockchain=${filterBlockchain}&status=${filterStatus}`);
      const data = await response.json();
      console.log("🔍 Frontend: Response received:", data);
      return data;
    }
  });

  const wallets = walletData?.data || [];
  console.log("🔍 Frontend: Processed wallets:", wallets.length);

  // Fetch analytics stats  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/flutterai/intelligence-stats"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/flutterai/intelligence-stats");
      const data = await response.json();
      console.log("🔍 Frontend: Stats received:", data);
      return data;
    }
  });

  // Add single wallet mutation
  const addWalletMutation = useMutation({
    mutationFn: (data: { walletAddress: string; blockchain: string }) =>
      apiRequest(`/api/flutterai/analyze/${data.walletAddress}`, "POST"),
    onSuccess: () => {
      toast({
        title: "Wallet Added",
        description: "Wallet has been analyzed and saved to database",
      });
      setNewWalletAddress("");
      queryClient.invalidateQueries({ queryKey: ["/api/flutterai/intelligence"] });
      queryClient.invalidateQueries({ queryKey: ["/api/flutterai/intelligence-stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Bulk add wallets mutation
  const bulkAddMutation = useMutation({
    mutationFn: (data: { wallets: Array<{ walletAddress: string; blockchain: string }> }) =>
      apiRequest("/api/flutterai/batch-analyze", "POST", { walletAddresses: data.wallets.map(w => w.walletAddress) }),
    onSuccess: (data) => {
      toast({
        title: "Bulk Analysis Started",
        description: `Processing ${(data as any)?.total || 0} wallets for FlutterAI analysis`,
      });
      setBulkWallets("");
      queryClient.invalidateQueries({ queryKey: ["/api/flutterai/intelligence"] });
      queryClient.invalidateQueries({ queryKey: ["/api/flutterai/intelligence-stats"] });
    },
    onError: (error) => {
      toast({
        title: "Bulk Analysis Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reanalyze wallet mutation
  const reanalyzeMutation = useMutation({
    mutationFn: (walletAddress: string) =>
      apiRequest(`/api/flutterai/analyze/${walletAddress}`, "POST"),
    onSuccess: () => {
      toast({
        title: "Reanalysis Complete",
        description: "Wallet has been reanalyzed with updated FlutterAI scoring",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/flutterai/intelligence"] });
    },
  });

  const handleAddWallet = () => {
    if (!newWalletAddress.trim()) return;
    addWalletMutation.mutate({
      walletAddress: newWalletAddress.trim(),
      blockchain: selectedBlockchain
    });
  };

  const handleBulkAdd = () => {
    const lines = bulkWallets.split('\n').filter(line => line.trim());
    const wallets = lines.map(line => {
      const [address, blockchain = "solana"] = line.trim().split(',');
      return { walletAddress: address.trim(), blockchain: blockchain.trim() };
    }).filter(w => w.walletAddress);

    if (wallets.length === 0) {
      toast({
        title: "No Valid Wallets",
        description: "Please enter wallet addresses (one per line, optionally with blockchain)",
        variant: "destructive",
      });
      return;
    }

    bulkAddMutation.mutate({ wallets });
  };

  const downloadCSV = async () => {
    try {
      toast({
        title: "Downloading...",
        description: "Preparing your wallet intelligence CSV export",
      });

      const response = await fetch('/api/flutterai/intelligence/export/csv');
      
      if (!response.ok) {
        throw new Error('Failed to download CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Get filename from response headers or generate one
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'flutterbye-wallet-intelligence.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Complete",
        description: `Successfully exported ${stats?.stats?.totalWallets || 0} wallet records to CSV`,
      });
    } catch (error) {
      console.error('CSV download error:', error);
      toast({
        title: "Download Failed",
        description: "Could not download CSV file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    for (const [rating, range] of Object.entries(SCORE_RANGES)) {
      if (score >= range.min && score <= range.max) {
        return range.color;
      }
    }
    return "bg-gray-500";
  };

  const formatWalletAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">FlutterAI Intelligence</h1>
              <p className="text-slate-300">Multi-Blockchain Wallet Analysis & Scoring System</p>
            </div>
          </div>
          
          <Button
            onClick={downloadCSV}
            className="bg-green-600 hover:bg-green-700 text-white"
            data-testid="button-download-csv"
          >
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>

        {/* Analytics Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Database className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-slate-400">Total Wallets</p>
                    <p className="text-2xl font-bold">{stats?.stats?.totalWallets?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-slate-400">Analyzed</p>
                    <p className="text-2xl font-bold">{stats?.stats?.totalWallets?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-slate-400">Pending Analysis</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-slate-400">Avg FlutterAI Score</p>
                    <p className="text-2xl font-bold">{Math.round(stats?.stats?.avgSocialCreditScore || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="wallets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="wallets" className="data-[state=active]:bg-blue-600">
              Database View
            </TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-blue-600">
              Quick Add
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              Database Stats
            </TabsTrigger>
          </TabsList>

          {/* Wallet Database Tab */}
          <TabsContent value="wallets" className="space-y-4">
            {/* Filters */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Search wallet addresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                  data-testid="search-wallets"
                />
                <Select value={filterBlockchain} onValueChange={setFilterBlockchain}>
                  <SelectTrigger className="bg-slate-700 border-slate-600" data-testid="filter-blockchain">
                    <SelectValue placeholder="Filter by blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blockchains</SelectItem>
                    {SUPPORTED_BLOCKCHAINS.map(chain => (
                      <SelectItem key={chain} value={chain}>
                        {chain.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-slate-700 border-slate-600" data-testid="filter-status">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Analyzed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="analyzing">Analyzing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Wallets List */}
            <div className="grid gap-4">
              {walletsLoading ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="mt-2">Loading wallets...</p>
                  </CardContent>
                </Card>
              ) : wallets.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <Database className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400">No wallets found</p>
                  </CardContent>
                </Card>
              ) : (
                wallets.map((wallet: WalletIntelligence) => (
                  <Card key={wallet.id} className="bg-slate-800 border-slate-700" data-testid={`wallet-card-${wallet.id}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <code className="bg-slate-700 px-2 py-1 rounded text-sm font-mono">
                              {formatWalletAddress(wallet.walletAddress)}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {wallet.blockchain?.toUpperCase() || 'SOLANA'}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="text-xs text-white bg-green-600"
                            >
                              ANALYZED
                            </Badge>
                          </div>
                          
                          {wallet.socialCreditScore && (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400">Social Credit Score:</span>
                                <Badge className={`${getScoreColor(wallet.socialCreditScore)} text-white`}>
                                  {wallet.socialCreditScore}/1000
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400">Risk Level:</span>
                                <Badge variant="outline">{wallet.riskLevel}</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400">Portfolio Size:</span>
                                <Badge variant="outline">{wallet.portfolioSize}</Badge>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {wallet.marketingSegment}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {wallet.communicationStyle}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {wallet.tradingFrequency}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Risk: {wallet.riskTolerance}
                            </Badge>
                            {wallet.sourceToken && (
                              <Badge variant="outline" className="text-xs bg-purple-600 text-white">
                                Source: {wallet.sourceToken}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => reanalyzeMutation.mutate(wallet.walletAddress)}
                            disabled={reanalyzeMutation.isPending}
                            data-testid={`reanalyze-${wallet.id}`}
                          >
                            {reanalyzeMutation.isPending ? "Reanalyzing..." : "Reanalyze"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Add Wallets Tab */}
          <TabsContent value="add" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Single Wallet */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Single Wallet
                  </CardTitle>
                  <CardDescription>
                    Add a single wallet address for FlutterAI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Wallet Address</label>
                    <Input
                      placeholder="Enter wallet address..."
                      value={newWalletAddress}
                      onChange={(e) => setNewWalletAddress(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                      data-testid="input-wallet-address"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Blockchain</label>
                    <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
                      <SelectTrigger className="bg-slate-700 border-slate-600" data-testid="select-blockchain">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_BLOCKCHAINS.map(chain => (
                          <SelectItem key={chain} value={chain}>
                            {chain.replace('_', ' ').toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleAddWallet} 
                    disabled={addWalletMutation.isPending || !newWalletAddress.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    data-testid="button-add-wallet"
                  >
                    {addWalletMutation.isPending ? "Adding..." : "Add Wallet"}
                  </Button>
                </CardContent>
              </Card>

              {/* Bulk Import */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Bulk Import
                  </CardTitle>
                  <CardDescription>
                    Import multiple wallets (one per line, format: address,blockchain)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Wallet Addresses</label>
                    <Textarea
                      placeholder={`7J9XfJK2P3wN5yQq8oLmCz4vR1sE6dT9mV3uA7bF5cG\n9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM,ethereum\n4rL8kKaKzEq9UqNEzP6e7QDHdHrQ2jEZ8hg7YvUZXqrE,polygon`}
                      value={bulkWallets}
                      onChange={(e) => setBulkWallets(e.target.value)}
                      className="bg-slate-700 border-slate-600 min-h-[120px]"
                      data-testid="textarea-bulk-wallets"
                    />
                  </div>
                  <Button 
                    onClick={handleBulkAdd} 
                    disabled={bulkAddMutation.isPending || !bulkWallets.trim()}
                    className="w-full bg-green-600 hover:bg-green-700"
                    data-testid="button-bulk-import"
                  >
                    {bulkAddMutation.isPending ? "Importing..." : "Bulk Import"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Blockchain Distribution */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Blockchain Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.blockchainDistribution && Object.entries(stats.blockchainDistribution).map(([blockchain, count]) => (
                      <div key={blockchain} className="flex justify-between items-center py-2">
                        <span className="capitalize">{blockchain.replace('_', ' ')}</span>
                        <Badge variant="outline">{String(count)}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Score Distribution */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>FlutterAI Score Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.scoreDistribution && Object.entries(stats.scoreDistribution).map(([rating, count]) => (
                      <div key={rating} className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${SCORE_RANGES[rating as keyof typeof SCORE_RANGES]?.color || 'bg-gray-500'} text-white`}>
                            {rating}
                          </Badge>
                          <span>
                            {SCORE_RANGES[rating as keyof typeof SCORE_RANGES]?.min}-{SCORE_RANGES[rating as keyof typeof SCORE_RANGES]?.max}
                          </span>
                        </div>
                        <Badge variant="outline">{String(count)}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminFlutterAI() {
  const [activeTab, setActiveTab] = useState("flutterai");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">FlutterAI Intelligence Hub</h1>
            <p className="text-slate-300">Multi-Blockchain AI Analysis & Data Collection System</p>
          </div>
        </div>

        <Tabs defaultValue="flutterai" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="flutterai" className="data-[state=active]:bg-blue-600">
              FlutterAI Analysis System
            </TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-blue-600">
              Database Management
            </TabsTrigger>
            <TabsTrigger value="marketing" className="data-[state=active]:bg-blue-600">
              SEO & Marketing Intelligence
            </TabsTrigger>
          </TabsList>

          {/* Original FlutterAI Dashboard */}
          <TabsContent value="flutterai">
            <FlutterAIDashboard />
          </TabsContent>

          {/* Database Management Tab */}
          <TabsContent value="database">
            <DatabaseManagement />
          </TabsContent>

          {/* SEO & Marketing Intelligence Tab */}
          <TabsContent value="marketing">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-white">SEO & Marketing Intelligence Platform</CardTitle>
                    <CardDescription className="text-slate-300">
                      Bloomberg Terminal of Web3 Marketing - Combining blockchain intelligence with traditional marketing analytics
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MarketingIntelligence />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}