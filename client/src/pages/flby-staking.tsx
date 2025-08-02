import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Zap, 
  Lock, 
  TrendingUp, 
  Clock, 
  Coins, 
  Trophy, 
  Calendar,
  Info,
  Shield,
  Gift,
  Target
} from "lucide-react";

interface StakingPool {
  id: string;
  name: string;
  duration: number; // days
  apy: number;
  minStake: number;
  totalStaked: number;
  maxCapacity: number;
  isActive: boolean;
  earlyUnstakePenalty: number;
  rewards: string[];
}

interface StakingPosition {
  id: string;
  poolId: string;
  amount: number;
  startDate: string;
  endDate: string;
  currentRewards: number;
  status: 'active' | 'completed' | 'withdrawn';
}

export default function FlbyStaking() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedPool, setSelectedPool] = useState<string>("");
  const { toast } = useToast();

  // Mock data for staking pools (will be real API calls post-launch)
  const stakingPools: StakingPool[] = [
    {
      id: "flexible",
      name: "Flexible Staking",
      duration: 0,
      apy: 5,
      minStake: 100,
      totalStaked: 0,
      maxCapacity: 10000000,
      isActive: false,
      earlyUnstakePenalty: 0,
      rewards: ["FLBY Tokens", "Platform Fees Share"]
    },
    {
      id: "short",
      name: "30-Day Lock",
      duration: 30,
      apy: 8,
      minStake: 500,
      totalStaked: 0,
      maxCapacity: 5000000,
      isActive: false,
      earlyUnstakePenalty: 2,
      rewards: ["FLBY Tokens", "Governance Votes", "Premium Support"]
    },
    {
      id: "medium",
      name: "90-Day Lock",
      duration: 90,
      apy: 12,
      minStake: 1000,
      totalStaked: 0,
      maxCapacity: 3000000,
      isActive: false,
      earlyUnstakePenalty: 5,
      rewards: ["FLBY Tokens", "Enhanced Governance", "Exclusive Features", "Fee Discounts"]
    },
    {
      id: "long",
      name: "1-Year Lock",
      duration: 365,
      apy: 18,
      minStake: 5000,
      totalStaked: 0,
      maxCapacity: 1000000,
      isActive: false,
      earlyUnstakePenalty: 10,
      rewards: ["Maximum FLBY Rewards", "Governance Council Access", "All Premium Features", "Revenue Sharing"]
    }
  ];

  const mockPositions: StakingPosition[] = [];

  const stakeMutation = useMutation({
    mutationFn: async (data: { poolId: string; amount: number }) => {
      return apiRequest(`/api/flby/stake`, {
        method: "POST",
        body: data
      });
    },
    onSuccess: () => {
      toast({
        title: "Staking Position Created",
        description: "Your FLBY tokens have been staked successfully!"
      });
      setStakeAmount("");
      setSelectedPool("");
    },
    onError: () => {
      toast({
        title: "Feature Coming Soon",
        description: "FLBY staking will be available after token launch in Q2 2024.",
        variant: "destructive"
      });
    }
  });

  const calculateRewards = (amount: number, apy: number, days: number) => {
    return (amount * (apy / 100) * days) / 365;
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Electric Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              FLBY Staking & Rewards
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stake your FLBY tokens to earn rewards, gain governance power, and access exclusive platform benefits
          </p>
          <Badge variant="secondary" className="mt-4 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            Coming Soon - Q2 2024
          </Badge>
        </div>

        <Tabs defaultValue="stake" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stake">Stake Tokens</TabsTrigger>
            <TabsTrigger value="positions">My Positions</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          {/* Staking Tab */}
          <TabsContent value="stake" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Staking Pools */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-gradient">Available Staking Pools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stakingPools.map((pool) => (
                    <Card 
                      key={pool.id} 
                      className={`electric-frame cursor-pointer transition-all ${
                        selectedPool === pool.id ? 'ring-2 ring-cyan-500' : ''
                      }`}
                      onClick={() => setSelectedPool(pool.id)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-gradient">{pool.name}</span>
                          <Badge variant={pool.isActive ? "default" : "secondary"}>
                            {pool.apy}% APY
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <p className="font-medium">
                              {pool.duration === 0 ? "Flexible" : `${pool.duration} days`}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Min Stake:</span>
                            <p className="font-medium">{pool.minStake.toLocaleString()} FLBY</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Pool Capacity</span>
                            <span>{((pool.totalStaked / pool.maxCapacity) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(pool.totalStaked / pool.maxCapacity) * 100} />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Rewards Include:</h4>
                          <div className="flex flex-wrap gap-1">
                            {pool.rewards.map((reward, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {reward}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {pool.earlyUnstakePenalty > 0 && (
                          <div className="flex items-center gap-2 text-xs text-yellow-500">
                            <Info className="w-3 h-3" />
                            Early unstake penalty: {pool.earlyUnstakePenalty}%
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Staking Interface */}
              <div className="space-y-6">
                <Card className="electric-frame">
                  <CardHeader>
                    <CardTitle className="text-gradient">Stake FLBY Tokens</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Amount to Stake</Label>
                      <div className="relative">
                        <Coins className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          placeholder="Enter FLBY amount"
                          className="pl-10 pulse-border"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Available: 0 FLBY (After token launch)
                      </p>
                    </div>

                    {selectedPool && stakeAmount && (
                      <div className="bg-muted/20 rounded-lg p-4 space-y-2">
                        <h4 className="font-medium">Staking Preview</h4>
                        {(() => {
                          const pool = stakingPools.find(p => p.id === selectedPool);
                          const amount = parseFloat(stakeAmount);
                          const expectedRewards = pool ? calculateRewards(amount, pool.apy, pool.duration || 365) : 0;
                          
                          return (
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Pool:</span>
                                <span>{pool?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>APY:</span>
                                <span className="text-green-400">{pool?.apy}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Duration:</span>
                                <span>{pool?.duration === 0 ? "Flexible" : `${pool?.duration} days`}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Est. Rewards:</span>
                                <span className="text-cyan-400">+{expectedRewards.toFixed(2)} FLBY</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        if (selectedPool && stakeAmount) {
                          stakeMutation.mutate({
                            poolId: selectedPool,
                            amount: parseFloat(stakeAmount)
                          });
                        }
                      }}
                      disabled={!selectedPool || !stakeAmount || stakeMutation.isPending}
                      className="w-full"
                      size="lg"
                    >
                      {stakeMutation.isPending ? (
                        <>
                          <Lock className="w-4 h-4 mr-2 animate-spin" />
                          Staking...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Stake FLBY Tokens
                        </>
                      )}
                    </Button>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        <strong>Coming Soon:</strong> FLBY staking will be available after token launch in Q2 2024. 
                        Join our early access list to be notified when staking goes live!
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Benefits Overview */}
                <Card className="electric-frame">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gradient">
                      <Gift className="w-5 h-5" />
                      Staking Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { icon: TrendingUp, title: "Earn Rewards", desc: "Up to 18% APY" },
                      { icon: Shield, title: "Governance Power", desc: "Vote on proposals" },
                      { icon: Target, title: "Fee Discounts", desc: "Reduced platform fees" },
                      { icon: Trophy, title: "Exclusive Access", desc: "Premium features" }
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <benefit.icon className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{benefit.title}</p>
                          <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Positions Tab */}
          <TabsContent value="positions" className="space-y-6">
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">My Staking Positions</CardTitle>
              </CardHeader>
              <CardContent>
                {mockPositions.length === 0 ? (
                  <div className="text-center py-12">
                    <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Staking Positions</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't staked any FLBY tokens yet. Start staking to earn rewards!
                    </p>
                    <Badge variant="secondary">
                      Available after FLBY token launch
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Position cards will be rendered here when user has staking positions */}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <Coins className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                  <h3 className="font-medium mb-1">Total Staked</h3>
                  <p className="text-2xl font-bold">0 FLBY</p>
                </CardContent>
              </Card>
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <h3 className="font-medium mb-1">Total Rewards</h3>
                  <p className="text-2xl font-bold">0 FLBY</p>
                </CardContent>
              </Card>
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <h3 className="font-medium mb-1">Average APY</h3>
                  <p className="text-2xl font-bold">0%</p>
                </CardContent>
              </Card>
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <h3 className="font-medium mb-1">Governance Power</h3>
                  <p className="text-2xl font-bold">0 Votes</p>
                </CardContent>
              </Card>
            </div>

            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Rewards History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Rewards Yet</h3>
                  <p className="text-muted-foreground">
                    Start staking FLBY tokens to begin earning rewards!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}