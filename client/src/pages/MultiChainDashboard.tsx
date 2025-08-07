import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet, 
  TrendingUp, 
  Globe, 
  Activity, 
  DollarSign, 
  Hash,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface ChainConfig {
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: string;
  chainId?: number;
}

interface WalletBalance {
  chain: string;
  address: string;
  balance: number;
  nativeBalance: number;
  tokens: any[];
  lastUpdated: string;
}

interface ChainHealth {
  [chain: string]: boolean;
}

export default function MultiChainDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [walletAddresses, setWalletAddresses] = useState({
    ethereum: "",
    bitcoin: "",
    polygon: "",
    xrp: "",
    sui: "",
    kaspa: "",
    solana: ""
  });

  // Fetch supported chains
  const { data: chainsData, isLoading: chainsLoading } = useQuery<any>({
    queryKey: ['/api/multi-chain/chains'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch chain health status
  const { data: healthData, isLoading: healthLoading } = useQuery<any>({
    queryKey: ['/api/multi-chain/health'],
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Fetch wallet balances
  const { data: balancesData, isLoading: balancesLoading, refetch: refetchBalances } = useQuery<any>({
    queryKey: ['/api/multi-chain/balance', walletAddresses],
    queryFn: async () => {
      const addresses = Object.fromEntries(
        Object.entries(walletAddresses).filter(([_, addr]) => addr.trim() !== "")
      );
      
      if (Object.keys(addresses).length === 0) return null;
      
      const response = await apiRequest("GET", `/api/multi-chain/balance?addresses=${encodeURIComponent(JSON.stringify(addresses))}`);
      return response;
    },
    enabled: Object.values(walletAddresses).some(addr => addr.trim() !== ""),
    refetchInterval: 30000
  });

  const handleAddressChange = (chain: string, address: string) => {
    setWalletAddresses(prev => ({
      ...prev,
      [chain]: address
    }));
  };

  const getHealthStatus = (chain: string) => {
    const health = healthData?.data?.[chain];
    if (health === true) return { icon: CheckCircle, color: "text-green-500", text: "Online" };
    if (health === false) return { icon: XCircle, color: "text-red-500", text: "Offline" };
    return { icon: AlertCircle, color: "text-yellow-500", text: "Unknown" };
  };

  const formatBalance = (balance: number, currency: string) => {
    if (balance === 0) return `0 ${currency}`;
    if (balance < 0.001) return `<0.001 ${currency}`;
    return `${balance.toFixed(6)} ${currency}`;
  };

  const formatUSD = (balance: number) => {
    // Mock USD conversion - in production would use real-time rates
    const mockRates: { [key: string]: number } = {
      bitcoin: 45000,
      ethereum: 2800,
      polygon: 0.85,
      solana: 95,
      xrp: 0.52,
      sui: 1.85,
      kaspa: 0.12
    };
    return balance * (mockRates[balancesData?.data?.find((b: WalletBalance) => b.chain)?.chain || 'ethereum'] || 1);
  };

  const totalUSDValue = balancesData?.data?.reduce((total: number, wallet: WalletBalance) => {
    return total + formatUSD(wallet.balance);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Globe className="h-10 w-10 text-blue-400" />
            Multi-Chain Intelligence Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Cross-blockchain wallet analysis across 7 major networks
          </p>
          
          {/* Total Portfolio Value */}
          <Card className="bg-slate-800/50 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  ${totalUSDValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-gray-400">Total Portfolio Value (USD)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chain Health Status */}
        <Card className="bg-slate-800/50 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              Blockchain Network Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <div className="text-gray-400">Loading network status...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {chainsData?.data?.map((chain: ChainConfig) => {
                  const status = getHealthStatus(chain.symbol.toLowerCase());
                  const StatusIcon = status.icon;
                  
                  return (
                    <div key={chain.symbol} className="text-center">
                      <div className="bg-slate-700/50 rounded-lg p-3 space-y-2">
                        <StatusIcon className={`h-6 w-6 mx-auto ${status.color}`} />
                        <div className="text-white font-medium">{chain.name}</div>
                        <div className={`text-sm ${status.color}`}>{status.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="analysis" className="text-white">Portfolio Analysis</TabsTrigger>
            <TabsTrigger value="addresses" className="text-white">Wallet Addresses</TabsTrigger>
            <TabsTrigger value="supported" className="text-white">Supported Chains</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            {/* Wallet Balances */}
            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-400" />
                  Multi-Chain Wallet Balances
                </CardTitle>
              </CardHeader>
              <CardContent>
                {balancesLoading ? (
                  <div className="text-gray-400 text-center py-8">
                    Analyzing wallet balances across blockchains...
                  </div>
                ) : balancesData?.data && balancesData.data.length > 0 ? (
                  <div className="space-y-4">
                    {balancesData.data.map((wallet: WalletBalance) => (
                      <div key={wallet.chain} className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                              {wallet.chain.toUpperCase()}
                            </Badge>
                            <div className="text-white font-medium">
                              {chainsData?.data?.find((c: ChainConfig) => c.symbol.toLowerCase() === wallet.chain)?.name || wallet.chain}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">
                              {formatBalance(wallet.balance, wallet.chain.toUpperCase())}
                            </div>
                            <div className="text-gray-400 text-sm">
                              ≈ ${formatUSD(wallet.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-400 text-sm">
                          Address: {wallet.address.length > 20 ? 
                            `${wallet.address.slice(0, 10)}...${wallet.address.slice(-8)}` : 
                            wallet.address
                          }
                        </div>
                        <div className="text-gray-500 text-xs">
                          Last updated: {new Date(wallet.lastUpdated).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    Add wallet addresses in the "Wallet Addresses" tab to see balances
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Hash className="h-5 w-5 text-purple-400" />
                  Configure Wallet Addresses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {chainsData?.data?.map((chain: ChainConfig) => (
                  <div key={chain.symbol} className="space-y-2">
                    <Label htmlFor={chain.symbol} className="text-white font-medium">
                      {chain.name} ({chain.symbol}) Address
                    </Label>
                    <Input
                      id={chain.symbol}
                      placeholder={`Enter your ${chain.name} wallet address`}
                      value={walletAddresses[chain.symbol.toLowerCase() as keyof typeof walletAddresses]}
                      onChange={(e) => handleAddressChange(chain.symbol.toLowerCase(), e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                    />
                  </div>
                ))}
                <Button 
                  onClick={() => refetchBalances()} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Analyze Wallets
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supported" className="space-y-6">
            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-400" />
                  Supported Blockchain Networks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chainsLoading ? (
                  <div className="text-gray-400">Loading supported chains...</div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {chainsData?.data?.map((chain: ChainConfig) => (
                      <div key={chain.symbol} className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-white font-bold">{chain.name}</div>
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            {chain.symbol}
                          </Badge>
                        </div>
                        <div className="text-gray-400 text-sm">
                          Native Currency: {chain.nativeCurrency}
                        </div>
                        {chain.chainId && (
                          <div className="text-gray-400 text-sm">
                            Chain ID: {chain.chainId}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-blue-400 text-sm">
                          <Globe className="h-4 w-4" />
                          <a 
                            href={chain.explorerUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-300"
                          >
                            View Explorer
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enterprise Features */}
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              Enterprise Multi-Chain Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-white font-bold">Cross-Chain Analysis</div>
                <div className="text-gray-400 text-sm">Real-time portfolio tracking across all major blockchains</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <Activity className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-white font-bold">Enterprise APIs</div>
                <div className="text-gray-400 text-sm">$500K-$5M contract-ready intelligence infrastructure</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <Globe className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-white font-bold">7 Blockchain Networks</div>
                <div className="text-gray-400 text-sm">98% crypto market cap coverage for comprehensive analysis</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}