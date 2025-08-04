import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, TrendingUp, Wallet, Copy, Check, Brain, Database, Zap, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TokenHolder {
  address: string;
  balance: number;
  percentage: number;
  rank: number;
}

interface CollectionResult {
  totalCollected: number;
  newWallets: number;
  duplicatesSkipped: number;
  aiScoringQueued: number;
}

export default function FlutterAITokenCollector() {
  const [tokenInput, setTokenInput] = useState("");
  const [holderCount, setHolderCount] = useState("25");
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [selectedHolders, setSelectedHolders] = useState<Set<number>>(new Set());
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [collectionResult, setCollectionResult] = useState<CollectionResult | null>(null);
  const { toast } = useToast();

  const analyzeToken = useMutation({
    mutationFn: async ({ token, count }: { token: string; count: number }): Promise<TokenHolder[]> => {
      const response = await apiRequest("POST", "/api/tokens/analyze-holders", { token, count });
      const data = response.json ? await response.json() : response;
      return Array.isArray(data) ? data : [];
    },
    onSuccess: (data: TokenHolder[]) => {
      if (Array.isArray(data) && data.length > 0) {
        setHolders(data);
        setSelectedHolders(new Set(data.map((_, i) => i))); // Select all by default
        setCollectionResult(null); // Reset previous results
        toast({
          title: "Token Analysis Complete",
          description: `Found ${data.length} top token holders ready for AI scoring`,
        });
      } else {
        toast({
          title: "No Holders Found",
          description: "No token holders found for this token address",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze token holders",
        variant: "destructive",
      });
    },
  });

  const collectWallets = useMutation({
    mutationFn: async (walletAddresses: string[]): Promise<CollectionResult> => {
      const response = await apiRequest("POST", "/api/flutterai/collect-wallets", { 
        walletAddresses,
        source: `token_analysis_${tokenInput.slice(0, 8)}`,
        metadata: {
          tokenAddress: tokenInput,
          totalHolders: holders.length,
          analysisDate: new Date().toISOString()
        }
      });
      const data = response.json ? await response.json() : response;
      return data as CollectionResult;
    },
    onSuccess: (result: CollectionResult) => {
      setCollectionResult(result);
      toast({
        title: "Wallets Collected Successfully",
        description: `${result.newWallets} new wallets added to AI scoring database`,
      });
    },
    onError: (error) => {
      toast({
        title: "Collection Failed",
        description: error instanceof Error ? error.message : "Failed to collect wallet addresses",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!tokenInput.trim()) {
      toast({
        title: "Token Address Required",
        description: "Please enter a valid Solana token address or symbol",
        variant: "destructive",
      });
      return;
    }

    analyzeToken.mutate({
      token: tokenInput.trim(),
      count: parseInt(holderCount),
    });
  };

  const handleCollectSelected = () => {
    const selectedWallets = holders
      .filter((_, i) => selectedHolders.has(i))
      .map(h => h.address);
    
    if (selectedWallets.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet address to collect",
        variant: "destructive",
      });
      return;
    }

    collectWallets.mutate(selectedWallets);
  };

  const toggleHolder = (index: number) => {
    const newSelected = new Set(selectedHolders);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedHolders(newSelected);
  };

  const selectAll = () => {
    setSelectedHolders(new Set(holders.map((_, i) => i)));
  };

  const selectNone = () => {
    setSelectedHolders(new Set());
  };

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Token Analysis Section */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            Token Holder Collection
          </CardTitle>
          <CardDescription className="text-purple-200">
            Analyze any Solana token to collect wallet addresses for AI-powered scoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="token-input" className="text-purple-200">Token Address or Symbol</Label>
              <Input
                id="token-input"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                className="font-mono text-sm bg-slate-700/50 border-purple-500/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="holder-count" className="text-purple-200">Number of Holders</Label>
              <Select value={holderCount} onValueChange={setHolderCount}>
                <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">Top 25</SelectItem>
                  <SelectItem value="50">Top 50</SelectItem>
                  <SelectItem value="100">Top 100</SelectItem>
                  <SelectItem value="250">Top 250</SelectItem>
                  <SelectItem value="500">Top 500</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAnalyze}
                disabled={analyzeToken.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {analyzeToken.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze Token
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Holders Results */}
      {holders.length > 0 && (
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  Token Holders ({holders.length} found)
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Select wallets to collect for AI-powered analysis and scoring
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-purple-900/50 text-purple-200">
                  {selectedHolders.size} selected
                </Badge>
                <Button
                  onClick={selectAll}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-600"
                >
                  Select All
                </Button>
                <Button
                  onClick={selectNone}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-600"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-96 overflow-y-auto space-y-2">
              {holders.map((holder, index) => (
                <div
                  key={holder.address}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedHolders.has(index)
                      ? "bg-purple-900/30 border-purple-500/50 shadow-lg"
                      : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 hover:border-purple-500/30"
                  }`}
                  onClick={() => toggleHolder(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                        #{holder.rank}
                      </Badge>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Wallet className="w-4 h-4 text-purple-400" />
                          <span className="font-mono text-sm text-white">
                            {holder.address.slice(0, 8)}...{holder.address.slice(-8)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyAddress(holder.address);
                            }}
                            className="p-1 h-auto text-purple-400 hover:text-purple-300"
                          >
                            {copiedAddress === holder.address ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <div className="text-xs text-purple-300">
                          {holder.balance.toLocaleString()} tokens ({holder.percentage.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedHolders.has(index)}
                      onChange={() => toggleHolder(index)}
                      className="w-4 h-4 text-purple-600 bg-slate-700 border-purple-500 rounded focus:ring-purple-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-600/30">
              <Button
                onClick={handleCollectSelected}
                disabled={collectWallets.isPending || selectedHolders.size === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {collectWallets.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Collecting & Scoring...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Collect Selected Wallets for AI Scoring ({selectedHolders.size})
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collection Results */}
      {collectionResult && (
        <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-green-400" />
              Collection Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {collectionResult.totalCollected}
                </div>
                <div className="text-sm text-green-300">Total Collected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {collectionResult.newWallets}
                </div>
                <div className="text-sm text-blue-300">New Wallets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {collectionResult.duplicatesSkipped}
                </div>
                <div className="text-sm text-yellow-300">Duplicates Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {collectionResult.aiScoringQueued}
                </div>
                <div className="text-sm text-purple-300">AI Scoring Queued</div>
              </div>
            </div>
            
            <Alert className="mt-4 bg-slate-700/50 border-green-500/20">
              <Zap className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-200">
                Wallet addresses have been successfully collected and queued for AI-powered scoring. 
                Check the Intelligence tab to monitor scoring progress and results.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}