import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  Gift, 
  Zap, 
  Clock, 
  Coins,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Copy
} from "lucide-react";
import { Link } from "wouter";

interface WalletToken {
  id: string;
  message: string;
  symbol: string;
  mintAddress: string;
  attachedValue: string;
  currency: string;
  escrowStatus: string;
  expiresAt: string | null;
  isExpired: boolean;
  hasValue: boolean;
  canRedeem: boolean;
  canBurn: boolean;
  expiresInDays: number | null;
  isBurnToRead: boolean;
  imageUrl?: string;
  createdAt: string;
}

interface WalletTokensData {
  created: WalletToken[];
  received: WalletToken[];
  walletAddress: string;
  totalCreated: number;
  totalReceived: number;
  totalValue: number;
}

export function WalletProductsDisplay() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  // Mock wallet connection for demo - in real app this would come from wallet adapter
  const mockWalletAddress = "11111111111111111111111111111111";

  const { data: walletTokens, isLoading, error } = useQuery<WalletTokensData>({
    queryKey: ["/api/wallet", mockWalletAddress, "tokens"],
    enabled: !!mockWalletAddress,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleConnectWallet = () => {
    // Mock wallet connection - in real app this would trigger wallet adapter
    setConnectedWallet(mockWalletAddress);
  };

  const formatTimeRemaining = (days: number | null) => {
    if (!days) return "No expiration";
    if (days < 0) return "Expired";
    if (days < 1) return "Expires today";
    if (days === 1) return "1 day left";
    return `${Math.floor(days)} days left`;
  };

  const formatValue = (value: string, currency: string) => {
    const numValue = parseFloat(value);
    return `${numValue.toFixed(4)} ${currency}`;
  };

  const TokenCard = ({ token, isCreated }: { token: WalletToken; isCreated: boolean }) => (
    <Card key={token.id} className="border-muted/40 hover:border-electric-blue/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium truncate">{token.message}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {token.symbol} • {isCreated ? "Created" : "Received"}
            </CardDescription>
          </div>
          {token.imageUrl && (
            <img 
              src={token.imageUrl} 
              alt={token.message}
              className="w-8 h-8 rounded-lg object-cover"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Value and Expiration Info */}
        <div className="space-y-2">
          {token.hasValue && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Value:</span>
              <span className="font-medium text-electric-green">
                {formatValue(token.attachedValue, token.currency)}
              </span>
            </div>
          )}
          
          {token.expiresAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Expires:</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className={token.isExpired ? "text-red-400" : "text-orange-400"}>
                  {formatTimeRemaining(token.expiresInDays)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex gap-2 flex-wrap">
          {token.isExpired && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Expired
            </Badge>
          )}
          
          {token.canRedeem && (
            <Badge className="text-xs bg-electric-green/10 text-electric-green border-electric-green/20">
              <Gift className="h-3 w-3 mr-1" />
              Redeemable
            </Badge>
          )}
          
          {token.canBurn && (
            <Badge className="text-xs bg-orange-500/10 text-orange-500 border-orange-500/20">
              <Zap className="h-3 w-3 mr-1" />
              Burn to Read
            </Badge>
          )}
          
          {token.escrowStatus === 'escrowed' && (
            <Badge variant="outline" className="text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Escrowed
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        {(token.canRedeem || token.canBurn) && (
          <div className="flex gap-2 pt-2">
            {token.canRedeem && (
              <Link href={`/redeem?token=${token.id}`}>
                <Button size="sm" className="flex-1 bg-electric-green hover:bg-electric-green/80">
                  <Gift className="h-3 w-3 mr-1" />
                  Redeem
                </Button>
              </Link>
            )}
            
            {token.canBurn && (
              <Link href={`/burn?token=${token.id}`}>
                <Button size="sm" variant="outline" className="flex-1 border-orange-500/50 text-orange-500 hover:bg-orange-500/10">
                  <Zap className="h-3 w-3 mr-1" />
                  Burn
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Mint Address with Copy */}
        <div className="flex items-center gap-2 pt-2 border-t border-muted/20">
          <span className="text-xs text-muted-foreground">Mint:</span>
          <code className="text-xs font-mono flex-1 truncate">{token.mintAddress}</code>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 w-6 p-0"
            onClick={() => navigator.clipboard.writeText(token.mintAddress)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (!mockWalletAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Your Wallet Products
          </CardTitle>
          <CardDescription>
            Connect your wallet to see all tokens you've created and received
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">Connect your wallet to view your products</p>
            <Button onClick={handleConnectWallet} className="bg-electric-blue hover:bg-electric-blue/80">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Your Wallet Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your wallet products...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Your Wallet Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <p>Failed to load wallet products</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalProducts = (walletTokens?.totalCreated || 0) + (walletTokens?.totalReceived || 0);
  const redeemableCount = [...(walletTokens?.created || []), ...(walletTokens?.received || [])]
    .filter(token => token.canRedeem).length;
  const burnableCount = [...(walletTokens?.created || []), ...(walletTokens?.received || [])]
    .filter(token => token.canBurn).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Your Wallet Products
            </CardTitle>
            <CardDescription>
              All tokens and NFTs in your connected wallet with redeem & burn functionality
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalProducts}</div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-electric-blue/5 border border-electric-blue/20">
            <div className="text-lg font-bold text-electric-blue">{walletTokens?.totalCreated || 0}</div>
            <div className="text-xs text-muted-foreground">Created</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <div className="text-lg font-bold text-purple-400">{walletTokens?.totalReceived || 0}</div>
            <div className="text-xs text-muted-foreground">Received</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-electric-green/5 border border-electric-green/20">
            <div className="text-lg font-bold text-electric-green">{redeemableCount}</div>
            <div className="text-xs text-muted-foreground">Redeemable</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
            <div className="text-lg font-bold text-orange-500">{burnableCount}</div>
            <div className="text-xs text-muted-foreground">Burnable</div>
          </div>
        </div>

        {/* Tokens Display */}
        <Tabs defaultValue="created" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="created">
              Created ({walletTokens?.totalCreated || 0})
            </TabsTrigger>
            <TabsTrigger value="received">
              Received ({walletTokens?.totalReceived || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="space-y-4">
            {walletTokens?.created && walletTokens.created.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {walletTokens.created.map(token => (
                  <TokenCard key={token.id} token={token} isCreated={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tokens created yet</p>
                <Link href="/create">
                  <Button className="mt-4">
                    Create Your First Token
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="received" className="space-y-4">
            {walletTokens?.received && walletTokens.received.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {walletTokens.received.map(token => (
                  <TokenCard key={token.id} token={token} isCreated={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tokens received yet</p>
                <p className="text-sm">Share your wallet address to receive tokens</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Total Value Display */}
        {walletTokens?.totalValue && walletTokens.totalValue > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-blue/10 border border-electric-green/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-electric-green">
                {walletTokens.totalValue.toFixed(4)} SOL
              </div>
              <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}