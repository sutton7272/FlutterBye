import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Coins, ArrowRightLeft, Clock, TrendingUp, AlertCircle, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PublicKey, Transaction } from '@solana/web3.js';

interface RedeemableToken {
  id: string;
  mintAddress: string;
  title: string;
  content: string;
  value: number;
  currency: string;
  expirationDate?: string;
  metadata: {
    name: string;
    symbol: string;
    description: string;
  };
  createdAt: string;
  redemptionRate: number;
  isExpired: boolean;
  currentValue: number;
}

interface RedemptionRate {
  currency: 'SOL' | 'USDC' | 'FLBY';
  rate: number;
  multiplier: number;
  description: string;
}

export default function Redeem() {
  const { isAuthenticated, walletAddress } = useAuth();
  const { toast } = useToast();
  const [tokens, setTokens] = useState<RedeemableToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<RedeemableToken | null>(null);
  const [redemptionRates, setRedemptionRates] = useState<RedemptionRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionAmount, setRedemptionAmount] = useState('');

  useEffect(() => {
    if (isAuthenticated && walletAddress) {
      loadRedeemableTokens();
      loadRedemptionRates();
    }
  }, [isAuthenticated, walletAddress]);

  const loadRedeemableTokens = async () => {
    try {
      const response = await fetch('/api/tokens/redeemable', {
        headers: {
          'X-Wallet-Address': walletAddress!
        }
      });

      if (response.ok) {
        const redeemableTokens = await response.json();
        setTokens(redeemableTokens);
      }
    } catch (error) {
      console.error('Error loading redeemable tokens:', error);
      toast({
        title: "Loading Failed",
        description: "Failed to load your redeemable tokens",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRedemptionRates = async () => {
    try {
      const response = await fetch('/api/redemption/rates');
      if (response.ok) {
        const rates = await response.json();
        setRedemptionRates(rates);
      }
    } catch (error) {
      console.error('Error loading redemption rates:', error);
    }
  };

  const calculateRedemptionValue = (token: RedeemableToken, amount: number) => {
    const ageInDays = Math.floor((Date.now() - new Date(token.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const ageMultiplier = Math.max(0.5, 1 - (ageInDays * 0.01)); // Decreases by 1% per day
    const baseValue = token.value * amount;
    return baseValue * ageMultiplier * token.redemptionRate;
  };

  const handleRedeemToken = async () => {
    if (!selectedToken || !redemptionAmount) {
      toast({
        title: "Missing Information",
        description: "Please select a token and enter redemption amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(redemptionAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid redemption amount",
        variant: "destructive"
      });
      return;
    }

    setIsRedeeming(true);
    try {
      const redemptionValue = calculateRedemptionValue(selectedToken, amount);
      
      // Real blockchain redemption process
      if (window.solana && window.solana.isPhantom) {
        toast({
          title: "Processing Redemption",
          description: "Please approve the redemption transaction in your wallet...",
        });

        const response = await fetch('/api/tokens/redeem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Wallet-Address': walletAddress!
          },
          body: JSON.stringify({
            tokenId: selectedToken.id,
            mintAddress: selectedToken.mintAddress,
            amount: amount,
            expectedValue: redemptionValue,
            currency: selectedToken.currency
          })
        });

        if (response.ok) {
          const result = await response.json();
          
          toast({
            title: "Redemption Successful!",
            description: `Redeemed ${amount} tokens for ${redemptionValue.toFixed(4)} ${selectedToken.currency}`,
          });

          // Refresh token list
          await loadRedeemableTokens();
          setSelectedToken(null);
          setRedemptionAmount('');
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Redemption failed');
        }
      } else {
        // Development fallback
        toast({
          title: "Development Mode",
          description: `Would redeem ${amount} tokens for ${redemptionValue.toFixed(4)} ${selectedToken.currency}`,
        });
      }

    } catch (error) {
      console.error('Redemption failed:', error);
      toast({
        title: "Redemption Failed",
        description: `Failed to redeem tokens: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const formatTimeRemaining = (expirationDate: string) => {
    const now = new Date();
    const expiry = new Date(expirationDate);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to redeem your tokens
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Token Redemption
            </h1>
            <p className="text-slate-400 mt-2">Loading your redeemable tokens...</p>
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Token Redemption
        </h1>
        <p className="text-slate-400 mt-2">
          Convert your tokenized messages back to real value
        </p>
      </div>

      {/* Current Redemption Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Current Redemption Rates
          </CardTitle>
          <CardDescription>
            Rates are dynamic and may change based on market conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {redemptionRates.map((rate) => (
              <div key={rate.currency} className="p-4 border border-slate-700 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{rate.currency}</div>
                  <div className="text-2xl font-bold text-green-400">
                    {(rate.rate * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {rate.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Redeemable Tokens</CardTitle>
            <CardDescription>
              Select a token to redeem for its current value
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tokens.length === 0 ? (
              <div className="text-center py-8">
                <Coins className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No redeemable tokens found</p>
                <Button 
                  onClick={() => window.location.href = '/mint'}
                  className="mt-4"
                  variant="outline"
                >
                  Create Tokens
                </Button>
              </div>
            ) : (
              tokens.map((token) => (
                <Card 
                  key={token.id} 
                  className={`cursor-pointer transition-all ${
                    selectedToken?.id === token.id 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-slate-700 hover:border-green-400'
                  }`}
                  onClick={() => setSelectedToken(token)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{token.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">{token.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="text-green-400">
                            Original: {token.value} {token.currency}
                          </span>
                          <span className="text-blue-400">
                            Current: {token.currentValue.toFixed(4)} {token.currency}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {token.isExpired ? (
                          <Badge variant="destructive">
                            <X className="h-3 w-3 mr-1" />
                            Expired
                          </Badge>
                        ) : token.expirationDate ? (
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeRemaining(token.expirationDate)}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* Redemption Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Redeem Selected Token</CardTitle>
            <CardDescription>
              Enter the amount you want to redeem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedToken ? (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Selected: {selectedToken.title} - Original value: {selectedToken.value} {selectedToken.currency}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="amount">Redemption Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount to redeem"
                    value={redemptionAmount}
                    onChange={(e) => setRedemptionAmount(e.target.value)}
                    min="0.001"
                    step="0.001"
                  />
                </div>

                {redemptionAmount && parseFloat(redemptionAmount) > 0 && (
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      You will receive: {calculateRedemptionValue(selectedToken, parseFloat(redemptionAmount)).toFixed(6)} {selectedToken.currency}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleRedeemToken}
                  disabled={!redemptionAmount || parseFloat(redemptionAmount) <= 0 || isRedeeming}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  {isRedeeming ? (
                    <>
                      <ArrowRightLeft className="h-4 w-4 mr-2 animate-spin" />
                      Processing Redemption...
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Redeem Token
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <ArrowRightLeft className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">Select a token to redeem</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}