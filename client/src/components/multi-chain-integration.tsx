import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  TrendingUp, 
  Wallet, 
  DollarSign, 
  BarChart3,
  Zap,
  Shield,
  Globe,
  Link,
  Layers,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "./websocket-provider";

interface ChainData {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  status: 'active' | 'syncing' | 'error' | 'maintenance';
  blockHeight: number;
  tvl: number;
  volume24h: number;
  transactions24h: number;
  gasPrice: number;
  avgBlockTime: number;
  validators?: number;
  marketCap?: number;
}

interface CrossChainAnalytics {
  totalTVL: number;
  totalVolume: number;
  totalTransactions: number;
  activeChains: number;
  bridgeVolume: number;
  arbitrageOpportunities: number;
}

const SUPPORTED_CHAINS: ChainData[] = [
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: '◎',
    color: 'from-purple-500 to-blue-500',
    status: 'active',
    blockHeight: 245231567,
    tvl: 1200000000,
    volume24h: 450000000,
    transactions24h: 2400000,
    gasPrice: 0.00025,
    avgBlockTime: 0.4,
    validators: 1200,
    marketCap: 45000000000
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    color: 'from-blue-500 to-cyan-500',
    status: 'active',
    blockHeight: 19234567,
    tvl: 25000000000,
    volume24h: 1200000000,
    transactions24h: 1100000,
    gasPrice: 25.5,
    avgBlockTime: 12,
    validators: 850000,
    marketCap: 280000000000
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: '⬟',
    color: 'from-purple-600 to-pink-500',
    status: 'active',
    blockHeight: 52234567,
    tvl: 850000000,
    volume24h: 180000000,
    transactions24h: 3200000,
    gasPrice: 0.001,
    avgBlockTime: 2.3,
    validators: 100,
    marketCap: 8500000000
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    icon: '🔺',
    color: 'from-blue-600 to-indigo-500',
    status: 'active',
    blockHeight: 45234567,
    tvl: 1800000000,
    volume24h: 320000000,
    transactions24h: 850000,
    gasPrice: 0.1,
    avgBlockTime: 0.25,
    marketCap: 2800000000
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    icon: '🔺',
    color: 'from-red-500 to-orange-500',
    status: 'syncing',
    blockHeight: 38234567,
    tvl: 680000000,
    volume24h: 95000000,
    transactions24h: 450000,
    gasPrice: 0.5,
    avgBlockTime: 1.0,
    validators: 1500,
    marketCap: 12000000000
  },
  {
    id: 'bsc',
    name: 'BNB Chain',
    symbol: 'BNB',
    icon: '●',
    color: 'from-yellow-500 to-orange-500',
    status: 'active',
    blockHeight: 35234567,
    tvl: 950000000,
    volume24h: 210000000,
    transactions24h: 1800000,
    gasPrice: 0.002,
    avgBlockTime: 3,
    validators: 21,
    marketCap: 35000000000
  }
];

export function MultiChainIntegration() {
  const [selectedChain, setSelectedChain] = useState<ChainData>(SUPPORTED_CHAINS[0]);
  const [crossChainData, setCrossChainData] = useState<CrossChainAnalytics | null>(null);
  const { sendMessage, lastMessage } = useWebSocket();

  // Fetch multi-chain data
  const { data: chainData, isLoading, refetch } = useQuery({
    queryKey: ['multi-chain-data'],
    queryFn: async () => {
      const response = await fetch('/api/multi-chain/overview');
      if (!response.ok) {
        throw new Error('Failed to fetch chain data');
      }
      return response.json();
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Cross-chain analytics query
  const { data: analytics } = useQuery({
    queryKey: ['cross-chain-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/multi-chain/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      return response.json();
    },
    refetchInterval: 60000
  });

  // WebSocket updates
  useEffect(() => {
    if (lastMessage?.type === 'chain_update') {
      // Handle real-time chain updates
      refetch();
    }
  }, [lastMessage, refetch]);

  const formatNumber = (num: number, prefix = '') => {
    if (num >= 1e9) return `${prefix}${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${prefix}${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${prefix}${(num / 1e3).toFixed(2)}K`;
    return `${prefix}${num.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'syncing': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'maintenance': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance': return <Shield className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total TVL</CardTitle>
              <Globe className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatNumber(SUPPORTED_CHAINS.reduce((sum, chain) => sum + chain.tvl, 0), '$')}
            </div>
            <p className="text-sm text-muted-foreground">Across {SUPPORTED_CHAINS.length} chains</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {formatNumber(SUPPORTED_CHAINS.reduce((sum, chain) => sum + chain.volume24h, 0), '$')}
            </div>
            <p className="text-sm text-muted-foreground">+12.5% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Activity className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {formatNumber(SUPPORTED_CHAINS.reduce((sum, chain) => sum + chain.transactions24h, 0))}
            </div>
            <p className="text-sm text-muted-foreground">24h activity</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Chains</CardTitle>
              <Layers className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {SUPPORTED_CHAINS.filter(chain => chain.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">of {SUPPORTED_CHAINS.length} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Chain Selection and Details */}
      <Card className="bg-background/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5 text-primary" />
                Multi-Chain Intelligence
              </CardTitle>
              <CardDescription>
                Real-time cross-chain analytics and monitoring
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={selectedChain.id} onValueChange={(value) => {
            const chain = SUPPORTED_CHAINS.find(c => c.id === value);
            if (chain) setSelectedChain(chain);
          }}>
            {/* Chain Tabs */}
            <TabsList className="grid w-full grid-cols-6 mb-6">
              {SUPPORTED_CHAINS.map((chain) => (
                <TabsTrigger key={chain.id} value={chain.id} className="text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-base">{chain.icon}</span>
                    <span className="hidden sm:inline">{chain.symbol}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Chain Details */}
            {SUPPORTED_CHAINS.map((chain) => (
              <TabsContent key={chain.id} value={chain.id} className="space-y-6">
                {/* Chain Header */}
                <div className={`p-6 rounded-lg bg-gradient-to-r ${chain.color} bg-opacity-10 border border-primary/20`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{chain.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{chain.name}</h3>
                        <p className="text-muted-foreground">{chain.symbol} Network</p>
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(chain.status)}>
                      {getStatusIcon(chain.status)}
                      <span className="ml-1 capitalize">{chain.status}</span>
                    </Badge>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Block Height</p>
                      <p className="text-lg font-semibold">{chain.blockHeight.toLocaleString()}</p>
                    </div>
                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">TVL</p>
                      <p className="text-lg font-semibold">{formatNumber(chain.tvl, '$')}</p>
                    </div>
                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">24h Volume</p>
                      <p className="text-lg font-semibold">{formatNumber(chain.volume24h, '$')}</p>
                    </div>
                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Transactions</p>
                      <p className="text-lg font-semibold">{formatNumber(chain.transactions24h)}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-background/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Network Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Avg Block Time</span>
                        <span className="font-medium">{chain.avgBlockTime}s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Gas Price</span>
                        <span className="font-medium">{chain.gasPrice} {chain.symbol}</span>
                      </div>
                      {chain.validators && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Validators</span>
                          <span className="font-medium">{chain.validators.toLocaleString()}</span>
                        </div>
                      )}
                      {chain.marketCap && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Market Cap</span>
                          <span className="font-medium">{formatNumber(chain.marketCap, '$')}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-background/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Activity Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>DeFi</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Trading</span>
                          <span>32%</span>
                        </div>
                        <Progress value={32} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>NFTs</span>
                          <span>15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Other</span>
                          <span>8%</span>
                        </div>
                        <Progress value={8} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm">
                    <Wallet className="h-4 w-4 mr-2" />
                    Top Wallets
                  </Button>
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Live Transactions
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Price Analysis
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Cross-Chain Opportunities */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-400" />
            Cross-Chain Opportunities
          </CardTitle>
          <CardDescription>
            Real-time arbitrage and bridge analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Bridge Volume</span>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-xl font-semibold text-green-400">$245M</p>
              <p className="text-xs text-muted-foreground">24h cross-chain transfers</p>
            </div>
            
            <div className="bg-background/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Arbitrage Ops</span>
                <DollarSign className="h-4 w-4 text-yellow-400" />
              </div>
              <p className="text-xl font-semibold text-yellow-400">127</p>
              <p className="text-xs text-muted-foreground">Active opportunities</p>
            </div>
            
            <div className="bg-background/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Best Yield</span>
                <Zap className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-xl font-semibold text-purple-400">23.4%</p>
              <p className="text-xs text-muted-foreground">ETH-SOL bridge farming</p>
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
            <ChevronRight className="h-4 w-4 mr-2" />
            Explore Cross-Chain Analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}