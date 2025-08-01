import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, TrendingUp, Wallet, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TokenHolder {
  address: string;
  balance: number;
  percentage: number;
  rank: number;
}

interface TokenHolderAnalysisProps {
  onHoldersSelected: (holders: TokenHolder[]) => void;
}

export default function TokenHolderAnalysis({ onHoldersSelected }: TokenHolderAnalysisProps) {
  const [tokenInput, setTokenInput] = useState("");
  const [holderCount, setHolderCount] = useState("25");
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [selectedHolders, setSelectedHolders] = useState<Set<number>>(new Set());
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeToken = useMutation({
    mutationFn: async ({ token, count }: { token: string; count: number }): Promise<TokenHolder[]> => {
      const response = await apiRequest("POST", "/api/tokens/analyze-holders", { token, count });
      return response as unknown as TokenHolder[];
    },
    onSuccess: (data: TokenHolder[]) => {
      setHolders(data);
      setSelectedHolders(new Set(data.map((_, i) => i))); // Select all by default
      toast({
        title: "Analysis Complete",
        description: `Found ${data.length} top token holders`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze token holders",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!tokenInput.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter a token address or symbol",
        variant: "destructive",
      });
      return;
    }

    analyzeToken.mutate({
      token: tokenInput.trim(),
      count: parseInt(holderCount),
    });
  };

  const handleSelectHolders = () => {
    const selected = holders.filter((_, i) => selectedHolders.has(i));
    onHoldersSelected(selected);
    toast({
      title: "Holders Selected",
      description: `Selected ${selected.length} wallet addresses for targeting`,
    });
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
    <div className="mt-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Token Holder Analysis
          </CardTitle>
          <CardDescription>
            Analyze top holders of any Solana token for targeted marketing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="token-input">Token Address or Symbol</Label>
              <Input
                id="token-input"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="holder-count">Number of Holders</Label>
              <Select value={holderCount} onValueChange={setHolderCount}>
                <SelectTrigger>
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
                className="w-full"
              >
                {analyzeToken.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>

          {holders.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Top Token Holders</h4>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {selectedHolders.size} selected
                  </Badge>
                  <Button
                    onClick={handleSelectHolders}
                    disabled={selectedHolders.size === 0}
                    size="sm"
                  >
                    Use Selected Wallets
                  </Button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2">
                {holders.map((holder, index) => (
                  <div
                    key={holder.address}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedHolders.has(index)
                        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                    onClick={() => toggleHolder(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">#{holder.rank}</Badge>
                        <div>
                          <div className="flex items-center space-x-2">
                            <Wallet className="w-4 h-4 text-gray-500" />
                            <span className="font-mono text-sm">
                              {holder.address.slice(0, 8)}...{holder.address.slice(-8)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyAddress(holder.address);
                              }}
                              className="p-1 h-auto"
                            >
                              {copiedAddress === holder.address ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500">
                            {holder.balance.toLocaleString()} tokens ({holder.percentage.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedHolders.has(index)}
                        onChange={() => toggleHolder(index)}
                        className="w-4 h-4"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}