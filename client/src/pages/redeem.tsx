import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Coins, Clock, CheckCircle, AlertCircle, Flame, TrendingUp, User, Calendar, DollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { TransactionSuccessOverlay } from "@/components/confetti-celebration";
import { format, differenceInDays, isAfter } from 'date-fns';

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
  expiresAt?: string;
  creatorId?: string;
  totalSupply?: number;
  circulatingSupply?: number;
}

interface UserHolding {
  id: string;
  tokenId: string;
  quantity: number;
  token?: Token;
}

export default function RedeemPage() {
  const [selectedWallet, setSelectedWallet] = useState<string>('user-1'); // Mock user
  const queryClient = useQueryClient();
  
  // Confetti celebration state
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successData, setSuccessData] = useState<{
    message: string;
    amount: string;
    type: string;
  } | null>(null);

  // User's holdings with attached value
  const { data: userHoldings = [], isLoading: holdingsLoading } = useQuery({
    queryKey: ['/api/users', selectedWallet, 'holdings'],
    enabled: !!selectedWallet,
  });

  // Tokens created by user with attached value
  const { data: userCreatedTokens = [], isLoading: createdLoading } = useQuery({
    queryKey: ['/api/users', selectedWallet, 'created-tokens'],
    enabled: !!selectedWallet,
  });

  // All tokens with value for discovery
  const { data: tokensWithValue = [], isLoading: tokensLoading } = useQuery({
    queryKey: ['/api/tokens/with-value'],
  });

  // Helper functions for date/expiration handling
  const getExpirationStatus = (expiresAt?: string) => {
    if (!expiresAt) return { status: 'no-expiry', daysLeft: null, expired: false };
    
    const expiration = new Date(expiresAt);
    const now = new Date();
    const daysLeft = differenceInDays(expiration, now);
    const expired = isAfter(now, expiration);
    
    if (expired) return { status: 'expired', daysLeft: 0, expired: true };
    if (daysLeft <= 7) return { status: 'expiring-soon', daysLeft, expired: false };
    return { status: 'active', daysLeft, expired: false };
  };

  const getExpirationBadge = (expiresAt?: string) => {
    const { status, daysLeft, expired } = getExpirationStatus(expiresAt);
    
    if (status === 'no-expiry') return <Badge variant="secondary">No Expiry</Badge>;
    if (expired) return <Badge variant="destructive">Expired</Badge>;
    if (status === 'expiring-soon') return <Badge variant="destructive">{daysLeft} days left</Badge>;
    return <Badge variant="outline">{daysLeft} days left</Badge>;
  };

  const burnTokenMutation = useMutation({
    mutationFn: async ({ tokenId, userId }: { tokenId: string; userId: string }) => {
      return await apiRequest(`/api/redemptions`, 'POST', {
        tokenId,
        userId,
        burnTransactionSignature: `burn_${Date.now()}`,
        redeemedAmount: '0.25',
        currency: 'SOL',
        status: 'pending'
      });
    },
    onSuccess: (data, variables) => {
      const token = userHoldings.find((h: UserHolding) => h.tokenId === variables.tokenId)?.token;
      
      setSuccessData({
        message: `Successfully redeemed: ${token?.message || 'Token'}`,
        amount: `${token?.attachedValue || '0.25'} ${token?.currency || 'SOL'}`,
        type: 'redemption'
      });
      setShowSuccessOverlay(true);
      
      toast({
        title: "Redemption Successful",
        description: `Redeemed ${token?.attachedValue || '0.25'} ${token?.currency || 'SOL'}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/users', selectedWallet, 'holdings'] });
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

  // Mock data for demonstration
  const mockUserHoldings: UserHolding[] = [
    {
      id: '1',
      tokenId: 'token-1',
      quantity: 2,
      token: {
        id: 'token-1',
        message: 'Happy Birthday Sarah!',
        symbol: 'HBDSA',
        mintAddress: 'mint123',
        hasAttachedValue: true,
        attachedValue: '0.5',
        currency: 'SOL',
        escrowStatus: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        expiresAt: '2024-12-31T23:59:59Z',
        totalSupply: 100,
        circulatingSupply: 85
      }
    },
    {
      id: '2',
      tokenId: 'token-2',
      quantity: 1,
      token: {
        id: 'token-2',
        message: 'Congratulations on graduation',
        symbol: 'CONGR',
        mintAddress: 'mint456',
        hasAttachedValue: true,
        attachedValue: '0.25',
        currency: 'USDC',
        escrowStatus: 'active',
        createdAt: '2024-02-10T14:30:00Z',
        expiresAt: '2024-08-15T23:59:59Z',
        totalSupply: 50,
        circulatingSupply: 45
      }
    }
  ];

  const mockCreatedTokens: Token[] = [
    {
      id: 'created-1',
      message: 'Welcome new team member!',
      symbol: 'WLCM',
      mintAddress: 'mint789',
      hasAttachedValue: true,
      attachedValue: '1.0',
      currency: 'SOL',
      escrowStatus: 'active',
      createdAt: '2024-01-20T09:00:00Z',
      expiresAt: '2024-06-30T23:59:59Z',
      creatorId: 'user-1',
      totalSupply: 200,
      circulatingSupply: 150
    }
  ];

  // Use mock data for now (in production this would come from API)
  const actualHoldings = userHoldings.length > 0 ? userHoldings : mockUserHoldings;
  const actualCreatedTokens = userCreatedTokens.length > 0 ? userCreatedTokens : mockCreatedTokens;

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

  // Filter tokens and calculate statistics
  const redeemableTokens = actualHoldings.filter((holding: UserHolding) => 
    holding.token?.hasAttachedValue && holding.token?.escrowStatus === 'active'
  );

  const totalRedeemableValue = redeemableTokens.reduce((sum, holding) => {
    const value = parseFloat(holding.token?.attachedValue || '0');
    return sum + (value * holding.quantity);
  }, 0);

  const totalCreatedValue = actualCreatedTokens.reduce((sum, token) => {
    const value = parseFloat(token.attachedValue || '0');
    const remaining = (token.totalSupply || 0) - (token.circulatingSupply || 0);
    return sum + (value * remaining);
  }, 0);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Token Value Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your tokens with attached value and track expirations
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available to Redeem</p>
                  <p className="text-3xl font-bold text-green-400">
                    {totalRedeemableValue.toFixed(3)} SOL
                  </p>
                </div>
                <ArrowDownCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created Token Value</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {totalCreatedValue.toFixed(3)} SOL
                  </p>
                </div>
                <ArrowUpCircle className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tokens</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {redeemableTokens.length + actualCreatedTokens.length}
                  </p>
                </div>
                <Coins className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="redeem" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="redeem" className="flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4" />
              Redeem
            </TabsTrigger>
            <TabsTrigger value="created" className="flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4" />
              Created
            </TabsTrigger>
            <TabsTrigger value="holdings" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Holdings
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Stats
            </TabsTrigger>
          </TabsList>

          {/* Redeemable Tokens Tab */}
          <TabsContent value="redeem" className="space-y-4">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownCircle className="w-5 h-5" />
                  Your Redeemable Tokens
                </CardTitle>
                <CardDescription>
                  Tokens you own that have attached value you can redeem
                </CardDescription>
              </CardHeader>
              <CardContent>
                {redeemableTokens.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No redeemable tokens found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {redeemableTokens.map((holding) => (
                      <Card key={holding.id} className="border border-blue-500/20 bg-blue-500/5">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-medium text-lg mb-1">{holding.token?.message}</h3>
                              <Badge variant="outline" className="text-xs mb-2">
                                {holding.token?.symbol}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-400">
                                {holding.token?.attachedValue} {holding.token?.currency}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                × {holding.quantity} tokens
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            {getExpirationBadge(holding.token?.expiresAt)}
                            {getStatusBadge(holding.token?.escrowStatus || 'none')}
                          </div>
                          
                          <Button
                            onClick={() => handleRedeem(holding.tokenId)}
                            disabled={burnTokenMutation.isPending}
                            size="sm"
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          >
                            {burnTokenMutation.isPending ? "Processing..." : "Redeem Value"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Created Tokens Tab */}
          <TabsContent value="created" className="space-y-4">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpCircle className="w-5 h-5" />
                  Tokens You Created
                </CardTitle>
                <CardDescription>
                  Track value distribution and expiration dates for tokens you've created
                </CardDescription>
              </CardHeader>
              <CardContent>
                {actualCreatedTokens.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No created tokens found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {actualCreatedTokens.map((token) => (
                      <Card key={token.id} className="border border-purple-500/20 bg-purple-500/5">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-medium text-lg mb-1">{token.message}</h3>
                              <Badge variant="outline" className="text-xs mb-2">
                                {token.symbol}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-400">
                                {token.attachedValue} {token.currency}
                              </p>
                              <p className="text-xs text-muted-foreground">per token</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Supply:</span>
                              <span>{token.circulatingSupply}/{token.totalSupply}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Remaining Value:</span>
                              <span className="font-medium">
                                {((token.totalSupply || 0) - (token.circulatingSupply || 0)) * parseFloat(token.attachedValue || '0')} {token.currency}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            {getExpirationBadge(token.expiresAt)}
                            {getStatusBadge(token.escrowStatus || 'none')}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Holdings Tab - Portfolio Functionality */}
          <TabsContent value="holdings" className="space-y-4">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  All Token Holdings
                </CardTitle>
                <CardDescription>
                  Complete view of all tokens in your wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="border border-blue-500/20 bg-blue-500/5">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">Total Holdings</p>
                      <p className="text-2xl font-bold text-blue-400">47</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-green-500/20 bg-green-500/5">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">Portfolio Value</p>
                      <p className="text-2xl font-bold text-green-400">12.75 SOL</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-purple-500/20 bg-purple-500/5">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">Unique Tokens</p>
                      <p className="text-2xl font-bold text-purple-400">23</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { symbol: 'HELLO', message: 'Hello World!', quantity: 5, value: 0.5 },
                    { symbol: 'LOVE', message: 'Spread Love', quantity: 12, value: 0.25 },
                    { symbol: 'HAPPY', message: 'Happy Birthday!', quantity: 3, value: 1.0 },
                    { symbol: 'MAGIC', message: 'Magic Moments', quantity: 8, value: 0.1 },
                  ].map((holding, index) => (
                    <Card key={index} className="border border-slate-700 hover:border-blue-500/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{holding.message}</h3>
                            <Badge variant="outline" className="text-xs mt-1">
                              {holding.symbol}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-green-400">
                              {holding.value} SOL
                            </p>
                            <p className="text-xs text-muted-foreground">
                              × {holding.quantity}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1">
                            Trade
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab - Analytics */}
          <TabsContent value="stats" className="space-y-4">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Portfolio Analytics
                </CardTitle>
                <CardDescription>
                  Detailed statistics and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="border border-green-500/20 bg-green-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <p className="text-sm text-muted-foreground">Total Gains</p>
                      </div>
                      <p className="text-xl font-bold text-green-400">+2.45 SOL</p>
                      <p className="text-xs text-green-400">+23.7%</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-blue-500/20 bg-blue-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="w-4 h-4 text-blue-400" />
                        <p className="text-sm text-muted-foreground">Tokens Created</p>
                      </div>
                      <p className="text-xl font-bold text-blue-400">8</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-purple-500/20 bg-purple-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <p className="text-sm text-muted-foreground">Avg Hold Time</p>
                      </div>
                      <p className="text-xl font-bold text-purple-400">12d</p>
                      <p className="text-xs text-muted-foreground">Average</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-orange-500/20 bg-orange-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-orange-400" />
                        <p className="text-sm text-muted-foreground">Redeemed</p>
                      </div>
                      <p className="text-xl font-bold text-orange-400">4.2 SOL</p>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg">Token Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { action: 'Created', token: 'BIRTHDAY', time: '2h ago', value: '+1.0 SOL' },
                          { action: 'Redeemed', token: 'THANKS', time: '1d ago', value: '-0.5 SOL' },
                          { action: 'Received', token: 'LOVE', time: '3d ago', value: '+0.25 SOL' },
                          { action: 'Created', token: 'CONGRATS', time: '5d ago', value: '+2.0 SOL' },
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                            <div>
                              <p className="font-medium">{activity.action} {activity.token}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                            <div className={`font-medium ${activity.value.startsWith('+') ? 'text-green-400' : 'text-orange-400'}`}>
                              {activity.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg">Top Performing Tokens</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { symbol: 'MAGIC', performance: '+45%', value: '0.8 SOL' },
                          { symbol: 'LOVE', performance: '+32%', value: '1.2 SOL' },
                          { symbol: 'HAPPY', performance: '+28%', value: '2.1 SOL' },
                          { symbol: 'CONGRATS', performance: '+15%', value: '1.5 SOL' },
                        ].map((token, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                            <div>
                              <p className="font-medium">{token.symbol}</p>
                              <p className="text-xs text-green-400">{token.performance}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{token.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Success Overlay */}
        {showSuccessOverlay && successData && (
          <TransactionSuccessOverlay
            message={successData.message}
            amount={successData.amount}
            type={successData.type}
            onClose={() => setShowSuccessOverlay(false)}
          />
        )}
      </div>
    </div>
  );
}