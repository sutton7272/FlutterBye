import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, 
  Search, 
  TrendingUp, 
  Shield, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface WalletAnalysisResult {
  success: boolean;
  address: string;
  riskScore: number;
  activityLevel: string;
  balanceSOL: string;
  tokenCount: number | string;
  lastActivity: string;
  transactionCount: number;
  accountExists: boolean;
  analysisTimestamp: string;
  network: string;
  recommendations?: string[];
  insights?: {
    behaviorPattern: string;
    riskFactors: string[];
    trustScore: number;
  };
}

export default function WalletAnalysis() {
  const [walletAddress, setWalletAddress] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState<WalletAnalysisResult[]>([]);
  const { toast } = useToast();

  // Get popular wallet addresses for quick analysis
  const { data: popularWallets } = useQuery({
    queryKey: ['/api/wallets/popular'],
    staleTime: 300000, // 5 minutes
  });

  // Analyze wallet mutation
  const analyzeWalletMutation = useMutation({
    mutationFn: async (address: string) => {
      return await apiRequest('/api/wallets/analyze', {
        method: 'POST',
        body: { address, deepAnalysis: true }
      });
    },
    onSuccess: (data: WalletAnalysisResult) => {
      toast({
        title: "Analysis Complete",
        description: `Risk Score: ${data.riskScore}/100`,
      });
      setAnalysisHistory(prev => [data, ...prev.slice(0, 4)]); // Keep last 5 analyses
      setWalletAddress('');
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a valid Solana wallet address",
        variant: "destructive"
      });
      return;
    }

    // Basic validation for Solana address format
    if (walletAddress.length < 32 || walletAddress.length > 44) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Solana wallet address",
        variant: "destructive"
      });
      return;
    }

    analyzeWalletMutation.mutate(walletAddress.trim());
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBadgeColor = (score: number) => {
    if (score <= 30) return 'bg-green-100 text-green-800 border-green-200';
    if (score <= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const quickAnalyze = (address: string) => {
    setWalletAddress(address);
    analyzeWalletMutation.mutate(address);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Wallet Intelligence Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Real-time blockchain wallet analysis and risk assessment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="text-blue-500" />
                  Analyze Wallet
                </CardTitle>
                <CardDescription>
                  Enter a Solana wallet address for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="address">Wallet Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter Solana wallet address..."
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="mt-2 font-mono text-sm"
                      disabled={analyzeWalletMutation.isPending}
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={!walletAddress.trim() || analyzeWalletMutation.isPending}
                    className="w-full"
                  >
                    {analyzeWalletMutation.isPending ? (
                      <>
                        <Activity className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Analyze Wallet
                      </>
                    )}
                  </Button>
                </form>

                {/* Popular Wallets for Quick Analysis */}
                {popularWallets && popularWallets.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Quick Analysis
                    </h4>
                    <div className="space-y-2">
                      {popularWallets.slice(0, 3).map((wallet: any, index: number) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left font-mono text-xs"
                          onClick={() => quickAnalyze(wallet.address)}
                          disabled={analyzeWalletMutation.isPending}
                        >
                          {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {analysisHistory.length > 0 ? (
              <div className="space-y-6">
                {analysisHistory.map((analysis, index) => (
                  <Card key={index} className={index === 0 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Wallet className="text-blue-500" size={20} />
                            Wallet Analysis
                            {index === 0 && <Badge variant="secondary">Latest</Badge>}
                          </CardTitle>
                          <CardDescription className="font-mono text-xs mt-1">
                            {analysis.address}
                          </CardDescription>
                        </div>
                        <Badge className={getRiskBadgeColor(analysis.riskScore)}>
                          Risk: {analysis.riskScore}/100
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {/* Risk Score */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Risk Score</span>
                            <span className={`text-sm font-bold ${getRiskColor(analysis.riskScore)}`}>
                              {analysis.riskScore}/100
                            </span>
                          </div>
                          <Progress value={analysis.riskScore} className="h-2" />
                        </div>

                        {/* Activity Level */}
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} className="text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Activity Level</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {analysis.activityLevel}
                            </p>
                          </div>
                        </div>

                        {/* Account Status */}
                        <div className="flex items-center gap-2">
                          {analysis.accountExists ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <AlertTriangle size={16} className="text-red-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">Account Status</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {analysis.accountExists ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Balance</p>
                          <p className="font-semibold">{analysis.balanceSOL} SOL</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Transactions</p>
                          <p className="font-semibold">{analysis.transactionCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Tokens</p>
                          <p className="font-semibold">{analysis.tokenCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Last Activity</p>
                          <p className="font-semibold text-xs">{analysis.lastActivity}</p>
                        </div>
                      </div>

                      {analysis.insights && (
                        <div className="mt-4 space-y-3">
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Behavior Pattern</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {analysis.insights.behaviorPattern}
                            </p>
                          </div>

                          {analysis.insights.riskFactors && analysis.insights.riskFactors.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Risk Factors</h5>
                              <div className="flex flex-wrap gap-2">
                                {analysis.insights.riskFactors.map((factor, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {factor}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(analysis.analysisTimestamp).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield size={12} />
                            {analysis.network}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Wallet className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Analysis Yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Enter a wallet address to start analyzing blockchain activity
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Shield size={14} />
                      Real-time data
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp size={14} />
                      Risk assessment
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity size={14} />
                      Behavior analysis
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}