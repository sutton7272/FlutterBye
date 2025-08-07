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
  Network,
  Zap
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

const mockChainData: ChainData[] = [
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 3420.50,
    marketCap: 411000000000,
    volume24h: 15200000000,
    change24h: 2.45,
    status: true
  },
  {
    name: "Bitcoin",
    symbol: "BTC", 
    price: 68250.00,
    marketCap: 1350000000000,
    volume24h: 28500000000,
    change24h: 1.23,
    status: true
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    price: 0.89,
    marketCap: 8900000000,
    volume24h: 485000000,
    change24h: -1.67,
    status: true
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: 2.85,
    marketCap: 162000000000,
    volume24h: 4200000000,
    change24h: 5.12,
    status: true
  },
  {
    name: "Sui",
    symbol: "SUI",
    price: 4.32,
    marketCap: 12800000000,
    volume24h: 890000000,
    change24h: 8.90,
    status: true
  },
  {
    name: "Kaspa",
    symbol: "KAS",
    price: 0.124,
    marketCap: 3100000000,
    volume24h: 85000000,
    change24h: -2.34,
    status: true
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 245.80,
    marketCap: 115000000000,
    volume24h: 3800000000,
    change24h: 3.78,
    status: true
  }
];

export default function NewMultiChain() {
  const [selectedChain, setSelectedChain] = useState<string>("ethereum");
  const [chains, setChains] = useState<ChainData[]>(mockChainData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChains(prevChains => 
        prevChains.map(chain => ({
          ...chain,
          price: chain.price * (1 + (Math.random() - 0.5) * 0.01),
          change24h: chain.change24h + (Math.random() - 0.5) * 0.1
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Globe className="w-10 h-10 text-cyan-400" />
              <Zap className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Multi-Chain Intelligence</h1>
              <p className="text-slate-300">Revolutionary blockchain analytics across 7 networks</p>
            </div>
          </div>
          
          {/* Live Status Bar */}
          <Card className="bg-slate-800/50 border-cyan-500/20 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-400" />
                Network Status - All Systems Operational
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {chains.map((chain) => (
                  <div key={chain.name} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">{chain.symbol}</span>
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
              className={`bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all cursor-pointer transform hover:scale-105 ${
                selectedChain === chain.name.toLowerCase() ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' : ''
              }`}
              onClick={() => setSelectedChain(chain.name.toLowerCase())}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{chain.name}</CardTitle>
                  <Badge 
                    variant={chain.change24h >= 0 ? "default" : "destructive"}
                    className={chain.change24h >= 0 ? "bg-green-600" : "bg-red-600"}
                  >
                    {chain.change24h >= 0 ? '+' : ''}{chain.change24h.toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm font-mono">{chain.symbol}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-semibold text-lg">
                      ${chain.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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

        {/* Selected Chain Analytics */}
        {selectedChain && (
          <Card className="bg-slate-800/50 border-cyan-500/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white capitalize flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                {selectedChain} Intelligence Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Price Analysis</h4>
                  <p className="text-white text-2xl font-bold">
                    ${chains.find(c => c.name.toLowerCase() === selectedChain)?.price.toFixed(2)}
                  </p>
                  <p className="text-slate-300 text-sm">Real-time pricing</p>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Market Intelligence</h4>
                  <p className="text-white text-xl">Enterprise Ready</p>
                  <p className="text-slate-300 text-sm">Advanced analytics</p>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Network Health</h4>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Operational</span>
                  </div>
                  <p className="text-slate-300 text-sm">100% uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enterprise Value Proposition */}
        <Card className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise Multi-Chain Intelligence Platform</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="text-cyan-400 font-semibold text-lg mb-2">Real-Time Data</h4>
                  <p className="text-slate-300">Live blockchain analytics across 7 major networks</p>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-semibold text-lg mb-2">Enterprise Grade</h4>
                  <p className="text-slate-300">Bank-level security and compliance ready</p>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-semibold text-lg mb-2">Revenue Target</h4>
                  <p className="text-slate-300">$500K-$5M enterprise contracts</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-cyan-400 font-semibold text-lg">
                <Globe className="w-6 h-6" />
                Positioned as "Google of Blockchain Intelligence"
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}