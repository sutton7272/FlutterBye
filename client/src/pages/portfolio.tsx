import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Send, Clock, TrendingUp, Users, Copy, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TokenPortfolio {
  id: string;
  mintAddress: string;
  title: string;
  content: string;
  value: number;
  currency: string;
  isLimitedEdition: boolean;
  maxSupply?: number;
  signature: string;
  metadata: {
    name: string;
    symbol: string;
    description: string;
    image: string;
  };
  createdAt: string;
}

export default function Portfolio() {
  const { isAuthenticated, walletAddress } = useAuth();
  const { toast } = useToast();
  const [tokens, setTokens] = useState<TokenPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedMint, setCopiedMint] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && walletAddress) {
      loadUserTokens();
    }
  }, [isAuthenticated, walletAddress]);

  const loadUserTokens = async () => {
    try {
      const response = await fetch('/api/tokens/created', {
        headers: {
          'X-Wallet-Address': walletAddress!
        }
      });

      if (response.ok) {
        const userTokens = await response.json();
        setTokens(userTokens);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
      toast({
        title: "Loading Failed",
        description: "Failed to load your token portfolio",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyMintAddress = async (mintAddress: string) => {
    await navigator.clipboard.writeText(mintAddress);
    setCopiedMint(mintAddress);
    setTimeout(() => setCopiedMint(null), 2000);
    
    toast({
      title: "Copied!",
      description: "Mint address copied to clipboard",
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to view your token portfolio
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Token Portfolio
            </h1>
            <p className="text-slate-400 mt-2">Loading your tokenized messages...</p>
          </div>
          
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Token Portfolio
        </h1>
        <p className="text-slate-400 mt-2">
          Your created tokenized messages on Solana blockchain
        </p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Coins className="h-8 w-8 mx-auto text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-blue-400">{tokens.length}</div>
            <div className="text-sm text-slate-400">Tokens Created</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-green-400 mb-2" />
            <div className="text-2xl font-bold text-green-400">
              {tokens.reduce((sum, token) => sum + token.value, 0).toFixed(2)}
            </div>
            <div className="text-sm text-slate-400">Total Value</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-purple-400">
              {tokens.filter(t => t.isLimitedEdition).length}
            </div>
            <div className="text-sm text-slate-400">Limited Edition</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto text-yellow-400 mb-2" />
            <div className="text-2xl font-bold text-yellow-400">
              {tokens.length > 0 ? Math.ceil((Date.now() - new Date(tokens[tokens.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
            </div>
            <div className="text-sm text-slate-400">Days Since Last</div>
          </CardContent>
        </Card>
      </div>

      {/* Token List */}
      {tokens.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Coins className="h-16 w-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Tokens Created</h3>
            <p className="text-slate-400 mb-6">
              You haven't created any tokenized messages yet. Start by minting your first token!
            </p>
            <Button 
              onClick={() => window.location.href = '/mint'}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              <Coins className="h-4 w-4 mr-2" />
              Create Your First Token
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tokens.map((token) => (
            <Card key={token.id} className="border border-slate-700 hover:border-blue-500 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-white">
                      {token.metadata.name}
                    </CardTitle>
                    <CardDescription className="text-slate-400 mt-1">
                      {token.content}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {token.isLimitedEdition && (
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        Limited Edition
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {token.value} {token.currency}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Mint Address:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMintAddress(token.mintAddress)}
                        className="h-6 px-2 text-xs"
                      >
                        {copiedMint === token.mintAddress ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className="font-mono text-xs text-blue-400">
                      {truncateAddress(token.mintAddress)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-slate-400">Created:</div>
                    <div className="text-white">
                      {new Date(token.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-slate-400">Symbol:</div>
                    <div className="text-white font-mono">
                      {token.metadata.symbol}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                  <div className="text-xs text-slate-400">
                    Transaction: {token.signature.substring(0, 16)}...
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://explorer.solana.com/tx/${token.signature}?cluster=devnet`, '_blank')}
                    className="h-8 text-xs"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    View on Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}