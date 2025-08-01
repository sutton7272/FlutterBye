import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Gift, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface RedeemableCode {
  id: string;
  code: string;
  codeType: string;
  isActive: boolean;
  maxUses: number;
  currentUses: number;
  expiresAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

interface CodeRedemption {
  id: string;
  codeId: string;
  userId: string;
  tokenId?: string;
  redeemedAt: string;
  metadata?: Record<string, any>;
}

export default function GreenCodesPage() {
  const [redeemCode, setRedeemCode] = useState('');
  const [userWallet, setUserWallet] = useState('');
  const queryClient = useQueryClient();

  const { data: availableCodes = [], isLoading: codesLoading } = useQuery({
    queryKey: ['/api/codes/green-flutterbye'],
  });

  const { data: userRedemptions = [], isLoading: redemptionsLoading } = useQuery({
    queryKey: ['/api/codes/redemptions', userWallet],
    enabled: !!userWallet,
  });

  const redeemCodeMutation = useMutation({
    mutationFn: async ({ code, userId }: { code: string; userId: string }) => {
      return await apiRequest(`/api/codes/redeem`, 'POST', {
        code,
        userId,
        codeType: 'green_flutterbye'
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Green Flutterbye Claimed!",
        description: `Successfully claimed your Green Flutterbye mint: ${data.tokenId}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/codes/green-flutterbye'] });
      queryClient.invalidateQueries({ queryKey: ['/api/codes/redemptions', userWallet] });
      setRedeemCode('');
    },
    onError: (error: any) => {
      toast({
        title: "Redemption Failed",
        description: error.message || "Failed to redeem code. Please check if the code is valid and not expired.",
        variant: "destructive",
      });
    },
  });

  const connectWallet = async () => {
    // Mock wallet connection
    const mockWallet = 'user-' + Math.random().toString(36).substr(2, 9);
    setUserWallet(mockWallet);
    toast({
      title: "Wallet Connected",
      description: "Ready to claim Green Flutterbye mints!",
    });
  };

  const handleRedeemCode = () => {
    if (!redeemCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid redemption code.",
        variant: "destructive",
      });
      return;
    }

    if (!userWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    redeemCodeMutation.mutate({ code: redeemCode.trim().toUpperCase(), userId: userWallet });
  };

  const generateSampleCode = () => {
    const sampleCode = 'GREEN-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setRedeemCode(sampleCode);
    toast({
      title: "Sample Code Generated",
      description: "This is a sample code for demonstration purposes.",
    });
  };

  const isCodeExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isCodeFullyUsed = (code: RedeemableCode) => {
    return code.currentUses >= code.maxUses;
  };

  const getCodeStatus = (code: RedeemableCode) => {
    if (!code.isActive) return { label: 'Inactive', variant: 'secondary' as const };
    if (isCodeExpired(code.expiresAt)) return { label: 'Expired', variant: 'destructive' as const };
    if (isCodeFullyUsed(code)) return { label: 'Fully Used', variant: 'destructive' as const };
    return { label: 'Active', variant: 'default' as const };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 mr-3 text-green-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Green Flutterbye Codes
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Claim exclusive Green Flutterbye mints with special redemption codes
          </p>
        </div>

        {/* Wallet Connection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="w-5 h-5 mr-2" />
              Wallet Connection
            </CardTitle>
            <CardDescription>
              Connect your wallet to claim Green Flutterbye mints
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!userWallet ? (
              <Button onClick={connectWallet} size="lg" className="w-full sm:w-auto">
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-sm">
                  Connected: {userWallet}
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => setUserWallet('')}
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Redemption */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="w-5 h-5 mr-2 text-green-500" />
                Redeem Code
              </CardTitle>
              <CardDescription>
                Enter your Green Flutterbye redemption code to claim your mint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="redemption-code">Redemption Code</Label>
                <Input
                  id="redemption-code"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                  placeholder="GREEN-XXXXXX"
                  className="font-mono text-center text-lg"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleRedeemCode}
                  disabled={redeemCodeMutation.isPending || !userWallet}
                  className="w-full"
                  size="lg"
                >
                  {redeemCodeMutation.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Claim Green Flutterbye
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={generateSampleCode}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Generate Sample Code (Demo)
                </Button>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-green-700 dark:text-green-300">Green Flutterbye Benefits:</div>
                    <ul className="text-green-600 dark:text-green-400 mt-1 space-y-1">
                      <li>• Exclusive special edition FlBY-MSG token</li>
                      <li>• Unique green-themed design and metadata</li>
                      <li>• Limited availability through codes only</li>
                      <li>• May include bonus value attachment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Codes (Admin/Demo View) */}
          <Card>
            <CardHeader>
              <CardTitle>Available Green Codes</CardTitle>
              <CardDescription>
                Current active redemption codes (Demo view)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {codesLoading ? (
                <div className="text-center py-4">Loading codes...</div>
              ) : (availableCodes as RedeemableCode[]).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  No active codes available
                </div>
              ) : (
                <div className="space-y-3">
                  {(availableCodes as RedeemableCode[]).slice(0, 5).map((code: RedeemableCode) => {
                    const status = getCodeStatus(code);
                    return (
                      <div key={code.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-mono font-medium">{code.code}</div>
                          <div className="text-sm text-muted-foreground">
                            Uses: {code.currentUses}/{code.maxUses}
                            {code.expiresAt && (
                              <span className="ml-2">
                                • Expires: {new Date(code.expiresAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge variant={status.variant}>
                          {status.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Redemption History */}
        {userWallet && (
          <>
            <Separator className="my-8" />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Your Redemptions
                </CardTitle>
                <CardDescription>
                  Green Flutterbye mints you've claimed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {redemptionsLoading ? (
                  <div className="text-center py-4">Loading redemptions...</div>
                ) : (userRedemptions as CodeRedemption[]).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No redemptions yet. Use a code above to claim your first Green Flutterbye!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(userRedemptions as CodeRedemption[]).map((redemption: CodeRedemption) => (
                      <div key={redemption.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">
                            Token: {redemption.tokenId || 'Processing...'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Claimed: {new Date(redemption.redeemedAt).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Green Flutterbye
                        </Badge>
                      </div>
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