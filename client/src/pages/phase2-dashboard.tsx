// PHASE 2: Advanced Cross-Chain AI Intelligence Dashboard
// Revolutionary behavioral analysis and portfolio intelligence platform

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  Brain, 
  Zap, 
  Target,
  ChartBar,
  Users,
  Search,
  Filter,
  RefreshCw,
  Star,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Link,
  TrendingUp,
  Shield,
  Lightbulb,
  Network,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Coins,
  TrendingDown
} from "lucide-react";

// Phase 2 Advanced interfaces
interface Phase2WalletData {
  id: string;
  walletAddress: string;
  blockchain: string;
  overallScore: number;
  scoreGrade: string;
  
  // Phase 1 base scores
  socialCreditScore: number;
  tradingBehaviorScore: number;
  portfolioQualityScore: number;
  liquidityScore: number;
  activityScore: number;
  defiEngagementScore: number;
  
  // PHASE 2: Advanced scores
  crossChainScore: number;
  arbitrageDetectionScore: number;
  wealthIndicatorScore: number;
  influenceNetworkScore: number;
  complianceScore: number;
  innovationScore: number;
  riskManagementScore: number;
  marketTimingScore: number;
  
  // AI-Enhanced behavioral scores
  tradingPatternComplexity: number;
  strategicThinking: number;
  adaptabilityScore: number;
  leadershipInfluence: number;
  
  // Behavioral profile
  behavioralProfile?: {
    tradingStyle: string;
    riskTolerance: string;
    innovationLevel: string;
  };
  
  // Risk assessment
  riskProfile?: {
    overallRisk: string;
    complianceRisk: string;
    liquidityRisk: string;
  };
}

interface Phase2Statistics {
  totalAdvancedAnalysis: number;
  averagePhase2Score: number;
  crossChainWallets: number;
  advancedTraders: number;
  whaleInvestors: number;
  defiPowerUsers: number;
  marketingSegments: {
    whale_investor: number;
    advanced_trader: number;
    defi_power_user: number;
    retail_investor: number;
  };
  behavioralDistribution: {
    aggressive: number;
    conservative: number;
    balanced: number;
    experimental: number;
  };
  riskDistribution: {
    very_low: number;
    low: number;
    medium: number;
    high: number;
    very_high: number;
  };
}

const PHASE2_COLORS = {
  primary: "#00ff88", // Advanced green
  secondary: "#0088ff", // AI blue  
  accent: "#ff8800", // Innovation orange
  warning: "#ffaa00", // Caution yellow
  danger: "#ff4444", // Risk red
  success: "#00aa44" // Success green
};

export default function Phase2Dashboard() {
  const [searchAddress, setSearchAddress] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState("all");
  const [behaviorFilter, setBehaviorFilter] = useState("all");
  const [includeMarketingInsights, setIncludeMarketingInsights] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Phase 2 advanced dashboard data
  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ["/api/phase2/advanced-dashboard", selectedBlockchain, behaviorFilter],
    queryFn: async () => {
      const response = await fetch(`/api/phase2/advanced-dashboard?blockchain=${selectedBlockchain}&behaviorType=${behaviorFilter}&limit=100`);
      if (!response.ok) throw new Error('Failed to fetch Phase 2 dashboard data');
      return response.json();
    },
    refetchInterval: 45000, // Auto-refresh every 45 seconds
  });

  // Fetch Phase 2 capabilities
  const { data: capabilities } = useQuery({
    queryKey: ["/api/phase2/capabilities"],
    queryFn: async () => {
      const response = await fetch("/api/phase2/capabilities");
      if (!response.ok) throw new Error('Failed to fetch capabilities');
      return response.json();
    },
  });

  // Phase 2 advanced analysis mutation
  const advancedAnalysisMutation = useMutation({
    mutationFn: async ({ address, blockchain, includeMarketing }: { address: string; blockchain: string; includeMarketing: boolean }) => {
      const response = await fetch("/api/phase2/analyze-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          walletAddress: address, 
          blockchain, 
          includeMarketingInsights: includeMarketing 
        })
      });
      if (!response.ok) throw new Error('Failed to perform advanced analysis');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Phase 2 Analysis Complete",
        description: "Advanced AI behavioral analysis completed successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/phase2/advanced-dashboard"] });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAdvancedAnalysis = () => {
    if (!searchAddress) {
      toast({
        title: "Address Required",
        description: "Please enter a wallet address for Phase 2 analysis.",
        variant: "destructive",
      });
      return;
    }

    advancedAnalysisMutation.mutate({
      address: searchAddress,
      blockchain: selectedBlockchain === "all" ? "solana" : selectedBlockchain,
      includeMarketing: includeMarketingInsights
    });
  };

  const wallets: Phase2WalletData[] = dashboardData?.data?.wallets || [];
  const stats: Phase2Statistics = dashboardData?.data?.statistics || {
    totalAdvancedAnalysis: 0,
    averagePhase2Score: 500,
    crossChainWallets: 0,
    advancedTraders: 0,
    whaleInvestors: 0,
    defiPowerUsers: 0,
    marketingSegments: { whale_investor: 0, advanced_trader: 0, defi_power_user: 0, retail_investor: 0 },
    behavioralDistribution: { aggressive: 0, conservative: 0, balanced: 0, experimental: 0 },
    riskDistribution: { very_low: 0, low: 0, medium: 0, high: 0, very_high: 0 }
  };

  // Advanced radar chart data for behavioral analysis
  const behavioralRadarData = [
    { category: 'Cross-Chain', value: stats.crossChainWallets },
    { category: 'Innovation', value: stats.defiPowerUsers },
    { category: 'Trading', value: stats.advancedTraders },
    { category: 'Wealth', value: stats.whaleInvestors },
    { category: 'Activity', value: stats.totalAdvancedAnalysis },
    { category: 'Compliance', value: Math.round(stats.totalAdvancedAnalysis * 0.8) }
  ];

  // Marketing segments distribution
  const marketingData = Object.entries(stats.marketingSegments).map(([key, value]) => ({
    name: key.replace('_', ' ').toUpperCase(),
    value,
    color: key === 'whale_investor' ? PHASE2_COLORS.primary :
           key === 'advanced_trader' ? PHASE2_COLORS.secondary :
           key === 'defi_power_user' ? PHASE2_COLORS.accent : PHASE2_COLORS.warning
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Phase 2 Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="h-10 w-10 text-green-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              PHASE 2: Advanced AI Intelligence Platform
            </h1>
            <Zap className="h-10 w-10 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Revolutionary cross-chain behavioral analysis with AI-powered portfolio intelligence and marketing insights
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Network className="h-4 w-4" />
              <span>Cross-Chain Mastery</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Behavioral Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Marketing Intelligence</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Risk Assessment</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-black/40 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Advanced Analysis</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.totalAdvancedAnalysis}</div>
              <p className="text-xs text-gray-500">AI-analyzed wallets</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Cross-Chain</CardTitle>
              <Network className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{stats.crossChainWallets}</div>
              <p className="text-xs text-gray-500">Multi-chain experts</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Whale Investors</CardTitle>
              <Coins className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{stats.whaleInvestors}</div>
              <p className="text-xs text-gray-500">High-value wallets</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-yellow-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">DeFi Power Users</CardTitle>
              <Lightbulb className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{stats.defiPowerUsers}</div>
              <p className="text-xs text-gray-500">Protocol innovators</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-orange-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Avg Phase 2 Score</CardTitle>
              <Star className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{stats.averagePhase2Score}/1000</div>
              <p className="text-xs text-gray-500">Advanced scoring</p>
            </CardContent>
          </Card>
        </div>

        {/* Phase 2 Advanced Analysis Section */}
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <span className="text-purple-400">Phase 2: Advanced AI Analysis</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Revolutionary cross-chain behavioral analysis with AI-powered insights and marketing intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Input
                  placeholder="Enter wallet address for Phase 2 advanced analysis..."
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  className="flex-1 bg-black/60 border-gray-600 text-white"
                />
                <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
                  <SelectTrigger className="w-40 bg-black/60 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chains</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="bsc">BSC</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="avalanche">Avalanche</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleAdvancedAnalysis}
                  disabled={advancedAnalysisMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {advancedAnalysisMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    "Analyze Phase 2"
                  )}
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <Switch 
                  checked={includeMarketingInsights}
                  onCheckedChange={setIncludeMarketingInsights}
                />
                <label className="text-sm text-gray-300">Include Marketing Intelligence</label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Dashboard Tabs */}
        <Tabs defaultValue="advanced-overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 bg-black/40">
            <TabsTrigger value="advanced-overview" className="data-[state=active]:bg-purple-600">Advanced Overview</TabsTrigger>
            <TabsTrigger value="behavioral-analysis" className="data-[state=active]:bg-blue-600">Behavioral Analysis</TabsTrigger>
            <TabsTrigger value="cross-chain-intelligence" className="data-[state=active]:bg-green-600">Cross-Chain Intel</TabsTrigger>
            <TabsTrigger value="risk-assessment" className="data-[state=active]:bg-red-600">Risk Assessment</TabsTrigger>
            <TabsTrigger value="marketing-insights" className="data-[state=active]:bg-yellow-600">Marketing Intel</TabsTrigger>
          </TabsList>

          <TabsContent value="advanced-overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Behavioral Radar Chart */}
              <Card className="bg-black/40 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Behavioral Intelligence Radar</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">Multi-dimensional behavioral analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={behavioralRadarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7280' }} />
                      <Radar 
                        name="Behavioral Score" 
                        dataKey="value" 
                        stroke={PHASE2_COLORS.primary}
                        fill={PHASE2_COLORS.primary}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Marketing Segments */}
              <Card className="bg-black/40 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Marketing Segments</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">AI-powered audience segmentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={marketingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${entry.value}`}
                      >
                        {marketingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="behavioral-analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Behavioral Distribution */}
              <Card className="bg-black/40 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Trading Personality</CardTitle>
                  <CardDescription className="text-gray-400">AI behavioral classification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Aggressive</span>
                      <span className="text-red-400 font-bold">{stats.behavioralDistribution.aggressive}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Balanced</span>
                      <span className="text-green-400 font-bold">{stats.behavioralDistribution.balanced}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Conservative</span>
                      <span className="text-blue-400 font-bold">{stats.behavioralDistribution.conservative}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Experimental</span>
                      <span className="text-purple-400 font-bold">{stats.behavioralDistribution.experimental}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Distribution */}
              <Card className="bg-black/40 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Risk Tolerance</CardTitle>
                  <CardDescription className="text-gray-400">Risk profile distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Very High</span>
                      <span className="text-red-500 font-bold">{stats.riskDistribution.very_high}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">High</span>
                      <span className="text-orange-400 font-bold">{stats.riskDistribution.high}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Medium</span>
                      <span className="text-yellow-400 font-bold">{stats.riskDistribution.medium}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Low</span>
                      <span className="text-green-400 font-bold">{stats.riskDistribution.low}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Very Low</span>
                      <span className="text-blue-400 font-bold">{stats.riskDistribution.very_low}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phase 2 Capabilities */}
              <Card className="bg-black/40 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Phase 2 Capabilities</CardTitle>
                  <CardDescription className="text-gray-400">Advanced analysis features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">AI-Powered Behavioral Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Cross-Chain Intelligence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Portfolio Strategy Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Marketing Intelligence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Risk Assessment Engine</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Advanced Scoring (1-1000)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cross-chain-intelligence" className="space-y-6">
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Network className="h-5 w-5" />
                  <span>Cross-Chain Intelligence Analysis</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced multi-blockchain behavior analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <Network className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">Cross-chain intelligence data will be displayed here</p>
                  <p className="text-sm">Run Phase 2 analysis on wallets to see advanced cross-chain insights</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk-assessment" className="space-y-6">
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Advanced Risk Assessment</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI-powered risk profiling and compliance analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <Shield className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">Risk assessment data will be displayed here</p>
                  <p className="text-sm">Comprehensive risk profiles generated through Phase 2 analysis</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing-insights" className="space-y-6">
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>AI Marketing Intelligence</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced audience segmentation and targeting insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">Marketing intelligence will be displayed here</p>
                  <p className="text-sm">Enable marketing insights in Phase 2 analysis for detailed targeting data</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Phase 2 Status Banner */}
        <Card className="bg-black/40 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>PHASE 2: ADVANCED AI INTELLIGENCE SYSTEM</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Revolutionary cross-chain behavioral analysis and portfolio intelligence platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">✅</div>
                <div className="text-sm text-gray-300">AI Behavioral Engine</div>
                <div className="text-xs text-gray-500">GPT-4o powered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">✅</div>
                <div className="text-sm text-gray-300">Cross-Chain Intelligence</div>
                <div className="text-xs text-gray-500">Multi-blockchain analysis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">✅</div>
                <div className="text-sm text-gray-300">Portfolio Analysis</div>
                <div className="text-xs text-gray-500">Strategy assessment</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">✅</div>
                <div className="text-sm text-gray-300">Marketing Intelligence</div>
                <div className="text-xs text-gray-500">Audience segmentation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-400" />
            <p className="text-gray-400 mt-2">Loading advanced AI intelligence...</p>
          </div>
        )}
      </div>
    </div>
  );
}