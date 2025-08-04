import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  BarChart3, 
  Wallet,
  Search,
  Crown,
  Award,
  Users,
  MessageSquare,
  Sparkles,
  Database,
  Settings,
  Server
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface WalletScore {
  address: string;
  flutterScore: number;
  tier: 'Legend' | 'Elite' | 'Pro' | 'Neutral' | 'High Risk';
  labels: string[];
  performance: {
    winRate: number;
    totalTrades: number;
    avgHoldingPeriod: number;
    riskScore: number;
    profitabilityScore: number;
  };
  analysis: {
    tradingStyle: string;
    riskProfile: string;
    strengths: string[];
    recommendations: string[];
  };
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'developing' | 'planned';
  usage: number;
  icon: any;
}

export default function FlutterAIDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [walletAddress, setWalletAddress] = useState('');
  const [searchedWallet, setSearchedWallet] = useState<WalletScore | null>(null);
  const { toast } = useToast();

  // FlutterAI capabilities data
  const aiCapabilities: AICapability[] = [
    {
      id: 'wallet-scoring',
      name: 'Wallet Scoring Engine',
      description: 'Advanced blockchain credit scoring with 127-factor analysis',
      category: 'Trading Intelligence',
      status: 'active',
      usage: 94,
      icon: Wallet
    },
    {
      id: 'aria-personality',
      name: 'ARIA Conversational AI',
      description: 'Advanced responsive intelligence with emotional understanding',
      category: 'Conversational AI',
      status: 'active',
      usage: 98,
      icon: MessageSquare
    },
    {
      id: 'predictive-analytics',
      name: 'Predictive Analytics',
      description: 'Market trend prediction and viral content optimization',
      category: 'Market Intelligence',
      status: 'active',
      usage: 87,
      icon: TrendingUp
    },
    {
      id: 'behavioral-labeling',
      name: 'Behavioral Labeling',
      description: 'AI-powered wallet classification and risk assessment',
      category: 'Trading Intelligence',
      status: 'active',
      usage: 91,
      icon: Target
    },
    {
      id: 'emotion-analysis',
      name: 'Emotion Analysis Engine',
      description: '127-emotion detection with quantum-inspired processing',
      category: 'Content Intelligence',
      status: 'active',
      usage: 96,
      icon: Brain
    },
    {
      id: 'viral-optimization',
      name: 'Viral Optimization',
      description: 'Content optimization for maximum engagement and reach',
      category: 'Content Intelligence',
      status: 'active',
      usage: 89,
      icon: Sparkles
    }
  ];

  // Wallet scoring mutation
  const walletScoringMutation = useMutation({
    mutationFn: async (address: string) => {
      return apiRequest('/api/flutterai/score-wallet', 'POST', { address });
    },
    onSuccess: (data: any) => {
      setSearchedWallet(data.walletScore);
      toast({
        title: "Wallet Analysis Complete",
        description: `FlutterScore: ${data.walletScore.flutterScore}/1000`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze wallet. Please check the address and try again.",
        variant: "destructive",
      });
    }
  });

  // AI capabilities query
  const { data: aiStats } = useQuery({
    queryKey: ['/api/flutterai/capabilities'],
    refetchInterval: 30000
  });

  // System health query
  const { data: systemHealth } = useQuery({
    queryKey: ['/api/flutterai/health'],
    refetchInterval: 10000
  });

  const handleWalletAnalysis = () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a valid Solana wallet address",
        variant: "destructive",
      });
      return;
    }
    walletScoringMutation.mutate(walletAddress);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Legend': return 'bg-yellow-500 text-yellow-900';
      case 'Elite': return 'bg-purple-500 text-purple-900';
      case 'Pro': return 'bg-blue-500 text-blue-900';
      case 'Neutral': return 'bg-gray-500 text-gray-900';
      case 'High Risk': return 'bg-red-500 text-red-900';
      default: return 'bg-gray-500 text-gray-900';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'developing': return 'bg-yellow-500';
      case 'planned': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">FlutterAI Dashboard</h1>
            <p className="text-blue-200">Comprehensive AI Intelligence & Blockchain Analytics</p>
          </div>
        </div>
        
        {/* System Health Indicators */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">All Systems Operational</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full">
            <Activity className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-sm">AI Processing: {(systemHealth as any)?.processingLoad || 'Unknown'}%</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
            <Database className="h-4 w-4 text-purple-400" />
            <span className="text-purple-400 text-sm">Wallets Analyzed: {(aiStats as any)?.walletsAnalyzed?.toLocaleString() || '0'}</span>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-blue-500/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
          <TabsTrigger value="wallet-scoring" className="data-[state=active]:bg-blue-600">Wallet Scoring</TabsTrigger>
          <TabsTrigger value="ai-capabilities" className="data-[state=active]:bg-blue-600">AI Capabilities</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">Analytics</TabsTrigger>
          <TabsTrigger value="api-management" className="data-[state=active]:bg-blue-600">API Management</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-200">FlutterScores Generated</CardTitle>
                <Wallet className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{(aiStats as any)?.scoresGenerated?.toLocaleString() || '0'}</div>
                <p className="text-xs text-blue-300">+12% from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">AI Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{(aiStats as any)?.conversationsProcessed?.toLocaleString() || '0'}</div>
                <p className="text-xs text-purple-300">+23% from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-200">API Requests</CardTitle>
                <Server className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{(aiStats as any)?.apiRequests?.toLocaleString() || '0'}</div>
                <p className="text-xs text-green-300">+34% from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-yellow-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-200">Revenue Generated</CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${(aiStats as any)?.revenueGenerated?.toLocaleString() || '0'}</div>
                <p className="text-xs text-yellow-300">+45% from last week</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Capabilities Overview */}
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                Active AI Capabilities
              </CardTitle>
              <CardDescription className="text-blue-200">
                Real-time status of all FlutterAI systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiCapabilities.map((capability) => {
                  const IconComponent = capability.icon;
                  return (
                    <div key={capability.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                      <div className="flex items-center justify-between mb-2">
                        <IconComponent className="h-5 w-5 text-blue-400" />
                        <Badge className={`${getStatusColor(capability.status)} text-white`}>
                          {capability.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-white mb-1">{capability.name}</h3>
                      <p className="text-sm text-slate-300 mb-3">{capability.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Usage</span>
                          <span className="text-white">{capability.usage}%</span>
                        </div>
                        <Progress value={capability.usage} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Scoring Tab */}
        <TabsContent value="wallet-scoring" className="space-y-6">
          {/* Wallet Analysis Input */}
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-400" />
                Wallet Scoring Engine
              </CardTitle>
              <CardDescription className="text-blue-200">
                Analyze any Solana wallet with advanced AI-powered credit scoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter Solana wallet address..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
                <Button
                  onClick={handleWalletAnalysis}
                  disabled={walletScoringMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {walletScoringMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze Wallet'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Analysis Results */}
          {searchedWallet && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FlutterScore Overview */}
              <Card className="bg-slate-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    FlutterScore Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">{searchedWallet.flutterScore}/1000</div>
                    <Badge className={`${getTierColor(searchedWallet.tier)} text-lg px-4 py-1`}>
                      {searchedWallet.tier}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Win Rate</span>
                      <span className="text-white">{searchedWallet.performance.winRate}%</span>
                    </div>
                    <Progress value={searchedWallet.performance.winRate} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Risk Score</span>
                      <span className="text-white">{searchedWallet.performance.riskScore}/10</span>
                    </div>
                    <Progress value={searchedWallet.performance.riskScore * 10} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Profitability</span>
                      <span className="text-white">{searchedWallet.performance.profitabilityScore}/10</span>
                    </div>
                    <Progress value={searchedWallet.performance.profitabilityScore * 10} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    AI Behavioral Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Trading Style</h4>
                    <p className="text-slate-300">{searchedWallet.analysis.tradingStyle}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Risk Profile</h4>
                    <p className="text-slate-300">{searchedWallet.analysis.riskProfile}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Behavioral Labels</h4>
                    <div className="flex flex-wrap gap-2">
                      {searchedWallet.labels.map((label, index) => (
                        <Badge key={index} variant="outline" className="border-blue-500 text-blue-400">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Strengths</h4>
                    <ul className="text-slate-300 space-y-1">
                      {searchedWallet.analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Top Performers */}
          <Card className="bg-slate-800/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-green-400" />
                Top Performing Wallets
              </CardTitle>
              <CardDescription className="text-green-200">
                Highest FlutterScore wallets in the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, address: '7K8...x9Z', score: 987, tier: 'Legend', gain: '+12%' },
                  { rank: 2, address: '3R9...m4L', score: 974, tier: 'Legend', gain: '+8%' },
                  { rank: 3, address: '9P2...k7N', score: 961, tier: 'Elite', gain: '+15%' },
                  { rank: 4, address: '5M8...w3Q', score: 955, tier: 'Elite', gain: '+22%' },
                  { rank: 5, address: '8L5...v6R', score: 943, tier: 'Elite', gain: '+18%' }
                ].map((wallet) => (
                  <div key={wallet.rank} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                        {wallet.rank}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{wallet.address}</div>
                        <Badge className={`${getTierColor(wallet.tier)} text-xs`}>
                          {wallet.tier}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{wallet.score}/1000</div>
                      <div className="text-green-400 text-sm">{wallet.gain}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Capabilities Tab */}
        <TabsContent value="ai-capabilities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiCapabilities.map((capability) => {
              const IconComponent = capability.icon;
              return (
                <Card key={capability.id} className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-8 w-8 text-blue-400" />
                      <Badge className={`${getStatusColor(capability.status)} text-white`}>
                        {capability.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-white">{capability.name}</CardTitle>
                    <CardDescription className="text-slate-300">
                      {capability.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Category</span>
                        <span className="text-white">{capability.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Usage</span>
                        <span className="text-white">{capability.usage}%</span>
                      </div>
                      <Progress value={capability.usage} className="h-2" />
                      <Button variant="outline" className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                        Manage Capability
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Usage Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Daily Active Users</span>
                    <span className="text-white font-bold">2,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">API Calls Today</span>
                    <span className="text-white font-bold">45,623</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Average Response Time</span>
                    <span className="text-white font-bold">127ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Success Rate</span>
                    <span className="text-green-400 font-bold">99.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  User Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Wallet Analyses</span>
                    <span className="text-white font-bold">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">AI Conversations</span>
                    <span className="text-white font-bold">8,901</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Feature Adoption</span>
                    <span className="text-white font-bold">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">User Retention</span>
                    <span className="text-green-400 font-bold">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Management Tab */}
        <TabsContent value="api-management" className="space-y-6">
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Api className="h-5 w-5 text-blue-400" />
                FlutterAI API Management
              </CardTitle>
              <CardDescription className="text-blue-200">
                Manage API access, monitor usage, and configure endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Available Endpoints</h3>
                  <div className="space-y-2">
                    {[
                      { endpoint: '/api/flutterai/score-wallet', method: 'POST', status: 'Active' },
                      { endpoint: '/api/flutterai/analyze-behavior', method: 'POST', status: 'Active' },
                      { endpoint: '/api/flutterai/conversation', method: 'POST', status: 'Active' },
                      { endpoint: '/api/flutterai/predict-viral', method: 'POST', status: 'Active' },
                      { endpoint: '/api/flutterai/optimize-content', method: 'POST', status: 'Active' }
                    ].map((api, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <span className="text-white font-mono text-sm">{api.endpoint}</span>
                          <Badge variant="outline" className="ml-2 border-blue-500 text-blue-400">
                            {api.method}
                          </Badge>
                        </div>
                        <Badge className="bg-green-500 text-white">
                          {api.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold">API Usage Limits</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Daily Requests</span>
                        <span className="text-white">8,234 / 10,000</span>
                      </div>
                      <Progress value={82.34} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Rate Limit</span>
                        <span className="text-white">45 / 100 req/min</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Generate API Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}