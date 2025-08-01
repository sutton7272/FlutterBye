import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Coins, Clock, CheckCircle, AlertCircle, Flame } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Token {
  id: string;
  message: string;
  symbol: string;
  mintAddress: string;
  hasAttachedValue: boolean;
  attachedValue: string;
  currency: string;
  escrowStatus: string;
  imageUrl?: string;
  createdAt: string;
}

interface UserHolding {
  id: string;
  tokenId: string;
  quantity: number;
  token?: Token;
}

export default function RedeemPage() {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: userHoldings = [], isLoading: holdingsLoading } = useQuery({
    queryKey: ['/api/token-holdings', selectedWallet],
    enabled: !!selectedWallet,
  });

  const { data: tokensWithValue = [], isLoading: tokensLoading } = useQuery({
    queryKey: ['/api/tokens/with-value'],
  });

  const burnTokenMutation = useMutation({
    mutationFn: async ({ tokenId, userId }: { tokenId: string; userId: string }) => {
      // In a real implementation, this would:
      // 1. Create burn transaction on Solana
      // 2. Wait for confirmation
      // 3. Create redemption record
      // 4. Process escrow release
      return await apiRequest(`/api/redemptions`, 'POST', {
        tokenId,
        userId,
        burnTransactionSignature: `burn_${Date.now()}`, // Mock signature
        redeemedAmount: '0.25', // Mock amount
        currency: 'SOL',
        status: 'pending'
      });
    },
    onSuccess: () => {
      toast({
        title: "Redemption Initiated",
        description: "Your token has been burned and redemption is being processed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/token-holdings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/with-value'] });
    },
    onError: () => {
      toast({
        title: "Redemption Failed",
        description: "Failed to process token redemption. Please try again.",
        variant: "destructive",
      });
    },
  });

  const connectWallet = async () => {
    try {
      // Mock wallet connection - in production would use Solana wallet adapter
      const mockWallet = 'user-' + Math.random().toString(36).substr(2, 9);
      setSelectedWallet(mockWallet);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRedeem = async (tokenId: string) => {
    if (!selectedWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    burnTokenMutation.mutate({ tokenId, userId: selectedWallet });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'escrowed':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Escrowed</Badge>;
      case 'redeemed':
        return <Badge variant="outline"><CheckCircle className="w-3 h-3 mr-1" />Redeemed</Badge>;
      case 'none':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />No Value</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Redeem Fluttercoins
          </h1>
          <p className="text-lg text-muted-foreground">
            Burn your tokens to redeem their attached value
          </p>
        </div>

        {/* Wallet Connection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Connect your Solana wallet to view and redeem your tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedWallet ? (
              <Button onClick={connectWallet} size="lg" className="w-full sm:w-auto">
                <Coins className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  Connected: {selectedWallet}
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => setSelectedWallet('')}
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedWallet && (
          <>
            {/* Redeemable Tokens */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Redeemable Tokens</CardTitle>
                <CardDescription>
                  Tokens in your wallet that have attached value
                </CardDescription>
              </CardHeader>
              <CardContent>
                {holdingsLoading ? (
                  <div className="text-center py-8">Loading your tokens...</div>
                ) : (userHoldings as UserHolding[]).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No redeemable tokens found in your wallet
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(userHoldings as UserHolding[]).map((holding: UserHolding) => (
                      <Card key={holding.id} className="border-2 hover:border-purple-300 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-mono">
                              {holding.token?.message || 'Unknown Token'}
                            </CardTitle>
                            {holding.token && getStatusBadge(holding.token.escrowStatus)}
                          </div>
                          {holding.token?.imageUrl && (
                            <img 
                              src={holding.token.imageUrl} 
                              alt="Token"
                              className="w-16 h-16 rounded-lg object-cover mx-auto"
                            />
                          )}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Quantity:</span>
                              <span className="font-medium">{holding.quantity}</span>
                            </div>
                            {holding.token?.hasAttachedValue && (
                              <div className="flex justify-between">
                                <span>Value:</span>
                                <span className="font-medium text-green-600">
                                  {holding.token.attachedValue} {holding.token.currency}
                                </span>
                              </div>
                            )}
                          </div>
                          {holding.token?.hasAttachedValue && holding.token.escrowStatus === 'escrowed' && (
                            <Button
                              onClick={() => handleRedeem(holding.token!.id)}
                              disabled={burnTokenMutation.isPending}
                              size="sm"
                              className="w-full mt-4"
                            >
                              <Flame className="w-4 h-4 mr-2" />
                              {burnTokenMutation.isPending ? 'Redeeming...' : 'Burn & Redeem'}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Tokens with Value */}
            <Card>
              <CardHeader>
                <CardTitle>All Tokens with Value</CardTitle>
                <CardDescription>
                  Browse all tokens that have attached value
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tokensLoading ? (
                  <div className="text-center py-8">Loading tokens...</div>
                ) : (tokensWithValue as Token[]).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tokens with value found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(tokensWithValue as Token[]).map((token: Token) => (
                      <Card key={token.id} className="border hover:border-purple-300 transition-colors">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-mono">
                            {token.message}
                          </CardTitle>
                          {getStatusBadge(token.escrowStatus)}
                          {token.imageUrl && (
                            <img 
                              src={token.imageUrl} 
                              alt="Token"
                              className="w-12 h-12 rounded-lg object-cover mx-auto"
                            />
                          )}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-sm text-center">
                            <div className="font-medium text-green-600">
                              {token.attachedValue} {token.currency}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(token.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}