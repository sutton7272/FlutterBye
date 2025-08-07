import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  Globe, 
  TrendingUp, 
  DollarSign, 
  Activity,
  CheckCircle,
  XCircle,
  BarChart3,
  Network
} from "lucide-react";

interface ChainData {
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  status: boolean;
}

export default function MultiChainIntelligence() {
  const [selectedChain, setSelectedChain] = useState<string>("ethereum");

  // Fetch chain data from our backend
  const { data: chainsData, isLoading } = useQuery<{ chains: ChainData[] }>({
    queryKey: ['/api/multi-chain/data'],
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Fetch chain health
  const { data: healthData } = useQuery<{ health: Record<string, boolean> }>({
    queryKey: ['/api/multi-chain/health'],
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const chains = chainsData?.chains || [];
  const health = healthData?.health || {};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading Multi-Chain Intelligence...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-10 h-10 text-cyan-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Multi-Chain Intelligence</h1>
              <p className="text-slate-300">Real-time blockchain analytics across 7 networks</p>
            </div>
          </div>
          
          {/* Network Status Overview */}
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-400" />
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {['ethereum', 'bitcoin', 'polygon', 'xrp', 'sui', 'kaspa', 'solana'].map((chain) => (
                  <div key={chain} className="flex items-center gap-2">
                    {health[chain] ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-white text-sm capitalize">{chain}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chain Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {chains.map((chain) => (
            <Card 
              key={chain.name}
              className={`bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all cursor-pointer ${
                selectedChain === chain.name.toLowerCase() ? 'border-cyan-400' : ''
              }`}
              onClick={() => setSelectedChain(chain.name.toLowerCase())}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{chain.name}</CardTitle>
                  <Badge variant={chain.change24h >= 0 ? "default" : "destructive"}>
                    {chain.change24h >= 0 ? '+' : ''}{chain.change24h.toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm">{chain.symbol}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-semibold">
                      ${chain.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      MCap: ${(chain.marketCap / 1e9).toFixed(1)}B
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      Vol: ${(chain.volume24h / 1e9).toFixed(1)}B
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Chain Details */}
        {selectedChain && (
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white capitalize flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                {selectedChain} Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-slate-300 text-lg mb-4">
                  Advanced analytics for {selectedChain} coming soon
                </p>
                <p className="text-slate-400">
                  Enterprise-grade blockchain intelligence and predictive analytics
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enterprise Notice */}
        <Card className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30 mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise Multi-Chain Intelligence</h3>
              <p className="text-slate-300 mb-4">
                Complete blockchain analytics across 7 networks with real-time data and predictive insights
              </p>
              <p className="text-cyan-400 font-semibold">
                Positioned for $500K-$5M enterprise contracts
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}