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
  Gift, 
  Coins, 
  Trophy, 
  Users, 
  TrendingUp, 
  Clock, 
  Star,
  CheckCircle,
  Calendar,
  Zap,
  Target,
  Wallet,
  DollarSign
} from "lucide-react";

interface AirdropCampaign {
  id: string;
  name: string;
  description: string;
  totalTokens: number;
  tokensDistributed: number;
  eligibilityType: 'early_user' | 'staker' | 'governance' | 'referral' | 'community';
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  requirements: string[];
  rewardAmount: number;
}

interface ProfitSharingPool {
  id: string;
  name: string;
  totalRevenue: number;
  distributionDate: string;
  stakersShare: number; // percentage
  governanceShare: number; // percentage
  distributedAmount: number;
  participantCount: number;
  userEligible: boolean;
  userShare: number;
}

export default function FlbyAirdrop() {
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();

  // Mock airdrop campaigns
  const airdropCampaigns: AirdropCampaign[] = [
    {
      id: "airdrop-001",
      name: "Genesis Airdrop",
      description: "Reward early Flutterbye users who helped build the community before token launch",
      totalTokens: 10000000,
      tokensDistributed: 0,
      eligibilityType: "early_user",
      status: "upcoming",
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      requirements: [
        "Account created before Feb 1, 2024",
        "Minted at least 3 tokens",
        "Participated in community events"
      ],
      rewardAmount: 500
    },
    {
      id: "airdrop-002",
      name: "Staker Bonus Drop",
      description: "Additional rewards for users who stake FLBY tokens in the first month",
      totalTokens: 5000000,
      tokensDistributed: 0,
      eligibilityType: "staker",
      status: "upcoming",
      startDate: "2024-03-15",
      endDate: "2024-04-15",
      requirements: [
        "Stake minimum 1,000 FLBY tokens",
        "Maintain stake for 30+ days",
        "Choose 90-day or 1-year lock period"
      ],
      rewardAmount: 1000
    },
    {
      id: "airdrop-003",
      name: "Governance Participation",
      description: "Reward active governance participants who vote on proposals",
      totalTokens: 3000000,
      tokensDistributed: 0,
      eligibilityType: "governance",
      status: "upcoming",
      startDate: "2024-04-01",
      endDate: "2024-06-01",
      requirements: [
        "Vote on at least 3 proposals",
        "Hold minimum voting power",
        "Create or support community proposals"
      ],
      rewardAmount: 750
    }
  ];

  // Mock profit sharing data
  const profitSharingPools: ProfitSharingPool[] = [
    {
      id: "revenue-q1-2024",
      name: "Q1 2024 Revenue Share",
      totalRevenue: 50000,
      distributionDate: "2024-04-01",
      stakersShare: 60,
      governanceShare: 25,
      distributedAmount: 42500,
      participantCount: 1250,
      userEligible: false,
      userShare: 0
    },
    {
      id: "revenue-q2-2024",
      name: "Q2 2024 Revenue Share",
      totalRevenue: 85000,
      distributionDate: "2024-07-01",
      stakersShare: 60,
      governanceShare: 25,
      distributedAmount: 0,
      participantCount: 0,
      userEligible: true,
      userShare: 34.50
    }
  ];

  const claimAirdropMutation = useMutation({
    mutationFn: async (data: { campaignId: string; walletAddress: string }) => {
      return apiRequest(`/api/flby/airdrop/claim`, {
        method: "POST",
        body: data
      });
    },
    onSuccess: () => {
      toast({
        title: "Airdrop Claimed",
        description: "Your FLBY tokens have been added to your wallet!"
      });
    },
    onError: () => {
      toast({
        title: "Feature Coming Soon",
        description: "FLBY airdrops will be available after token launch in Q2 2024.",
        variant: "destructive"
      });
    }
  });

  const claimProfitShareMutation = useMutation({
    mutationFn: async (data: { poolId: string }) => {
      return apiRequest(`/api/flby/profit-share/claim`, {
        method: "POST",
        body: data
      });
    },
    onSuccess: () => {
      toast({
        title: "Profit Share Claimed",
        description: "Your revenue share has been distributed to your wallet!"
      });
    },
    onError: () => {
      toast({
        title: "Feature Coming Soon",
        description: "Profit sharing will be available after token launch.",
        variant: "destructive"
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400';
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getEligibilityIcon = (type: string) => {
    switch (type) {
      case 'early_user':
        return <Star className="w-4 h-4" />;
      case 'staker':
        return <Coins className="w-4 h-4" />;
      case 'governance':
        return <Trophy className="w-4 h-4" />;
      case 'referral':
        return <Users className="w-4 h-4" />;
      case 'community':
        return <Target className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
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
              FLBY Rewards & Profit Sharing
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Earn FLBY tokens through airdrops and receive revenue sharing from platform profits
          </p>
          <Badge variant="secondary" className="mt-4 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            Coming Soon - Q2 2024
          </Badge>
        </div>

        <Tabs defaultValue="airdrops" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="airdrops">Airdrops</TabsTrigger>
            <TabsTrigger value="profit-sharing">Profit Sharing</TabsTrigger>
            <TabsTrigger value="my-rewards">My Rewards</TabsTrigger>
          </TabsList>

          {/* Airdrops Tab */}
          <TabsContent value="airdrops" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {airdropCampaigns.map((campaign) => (
                <Card key={campaign.id} className="electric-frame">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getEligibilityIcon(campaign.eligibilityType)}
                          <h3 className="text-lg font-semibold text-gradient">{campaign.name}</h3>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400">
                          {campaign.rewardAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">FLBY Tokens</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{campaign.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Distribution Progress</span>
                        <span>{((campaign.tokensDistributed / campaign.totalTokens) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(campaign.tokensDistributed / campaign.totalTokens) * 100} />
                      <p className="text-xs text-muted-foreground">
                        {campaign.tokensDistributed.toLocaleString()} / {campaign.totalTokens.toLocaleString()} distributed
                      </p>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Eligibility Requirements:</h4>
                      <ul className="space-y-1">
                        {campaign.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {campaign.startDate} - {campaign.endDate}
                      </div>
                    </div>

                    {campaign.status === 'active' && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Wallet Address</Label>
                          <Input
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            placeholder="Enter your Solana wallet address"
                            className="pulse-border"
                          />
                        </div>
                        <Button
                          onClick={() => {
                            if (walletAddress) {
                              claimAirdropMutation.mutate({
                                campaignId: campaign.id,
                                walletAddress
                              });
                            }
                          }}
                          disabled={!walletAddress || claimAirdropMutation.isPending}
                          className="w-full"
                          size="sm"
                        >
                          {claimAirdropMutation.isPending ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Claiming...
                            </>
                          ) : (
                            <>
                              <Gift className="w-4 h-4 mr-2" />
                              Claim Airdrop
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {campaign.status === 'upcoming' && (
                      <Button disabled className="w-full" size="sm">
                        <Clock className="w-4 h-4 mr-2" />
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profit Sharing Tab */}
          <TabsContent value="profit-sharing" className="space-y-6">
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">How Profit Sharing Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <h3 className="font-medium mb-1">Platform Revenue</h3>
                    <p className="text-sm text-muted-foreground">
                      85% of platform fees and transaction revenue distributed to token holders
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <Coins className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                    <h3 className="font-medium mb-1">Staker Share (60%)</h3>
                    <p className="text-sm text-muted-foreground">
                      FLBY stakers receive the majority of profit sharing based on stake amount
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <h3 className="font-medium mb-1">Governance Share (25%)</h3>
                    <p className="text-sm text-muted-foreground">
                      Active governance participants receive additional revenue sharing
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {profitSharingPools.map((pool) => (
                <Card key={pool.id} className="electric-frame">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gradient">{pool.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Distribution: {pool.distributionDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">
                          ${pool.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Revenue</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-cyan-400">{pool.stakersShare}%</p>
                        <p className="text-xs text-muted-foreground">Stakers Share</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-400">{pool.governanceShare}%</p>
                        <p className="text-xs text-muted-foreground">Governance Share</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{pool.participantCount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Participants</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-400">
                          ${pool.distributedAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Distributed</p>
                      </div>
                    </div>

                    {pool.userEligible && pool.userShare > 0 && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-green-400">Your Share Available</h4>
                            <p className="text-sm text-muted-foreground">
                              Based on your staking and governance participation
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-400">
                              ${pool.userShare.toFixed(2)}
                            </p>
                            <Button
                              onClick={() => claimProfitShareMutation.mutate({ poolId: pool.id })}
                              disabled={claimProfitShareMutation.isPending}
                              size="sm"
                              className="mt-2"
                            >
                              Claim Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {!pool.userEligible && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          Stake FLBY tokens and participate in governance to earn profit sharing rewards.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Rewards Tab */}
          <TabsContent value="my-rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <Gift className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                  <h3 className="font-medium mb-1">Total Airdrops</h3>
                  <p className="text-2xl font-bold">0 FLBY</p>
                  <p className="text-xs text-muted-foreground">Claimed from campaigns</p>
                </CardContent>
              </Card>
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <h3 className="font-medium mb-1">Profit Sharing</h3>
                  <p className="text-2xl font-bold">$0.00</p>
                  <p className="text-xs text-muted-foreground">Revenue share earned</p>
                </CardContent>
              </Card>
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <h3 className="font-medium mb-1">Total Value</h3>
                  <p className="text-2xl font-bold">$0.00</p>
                  <p className="text-xs text-muted-foreground">Combined rewards value</p>
                </CardContent>
              </Card>
            </div>

            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Reward History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Rewards Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Participate in airdrops and profit sharing to start earning FLBY rewards!
                  </p>
                  <Badge variant="secondary">
                    Available after FLBY token launch
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}