import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Settings, 
  Coins, 
  TrendingUp, 
  Users, 
  DollarSign,
  Lock,
  Percent,
  Calendar,
  Target,
  Save,
  RefreshCw
} from "lucide-react";

interface StakingPoolConfig {
  id: string;
  name: string;
  duration: number; // days
  apy: number;
  minStake: number;
  maxCapacity: number;
  isActive: boolean;
  earlyUnstakePenalty: number;
  bonusMultiplier: number;
}

interface ProfitSharingConfig {
  stakersShare: number; // percentage
  governanceShare: number; // percentage
  distributionFrequency: 'monthly' | 'quarterly' | 'yearly';
  minimumStakeForProfit: number;
  autoDistribute: boolean;
}

interface AirdropConfig {
  campaignName: string;
  totalTokens: number;
  eligibilityType: string;
  rewardAmount: number;
  isActive: boolean;
}

export default function AdminStaking() {
  const { toast } = useToast();

  // Mock current configurations
  const [stakingPools, setStakingPools] = useState<StakingPoolConfig[]>([
    {
      id: "flexible",
      name: "Flexible Staking",
      duration: 0,
      apy: 5,
      minStake: 100,
      maxCapacity: 10000000,
      isActive: true,
      earlyUnstakePenalty: 0,
      bonusMultiplier: 1.0
    },
    {
      id: "short",
      name: "30-Day Lock",
      duration: 30,
      apy: 8,
      minStake: 500,
      maxCapacity: 5000000,
      isActive: true,
      earlyUnstakePenalty: 2,
      bonusMultiplier: 1.2
    },
    {
      id: "medium",
      name: "90-Day Lock",
      duration: 90,
      apy: 12,
      minStake: 1000,
      maxCapacity: 3000000,
      isActive: true,
      earlyUnstakePenalty: 5,
      bonusMultiplier: 1.5
    },
    {
      id: "long",
      name: "1-Year Lock",
      duration: 365,
      apy: 18,
      minStake: 5000,
      maxCapacity: 1000000,
      isActive: true,
      earlyUnstakePenalty: 10,
      bonusMultiplier: 2.0
    }
  ]);

  const [profitSharing, setProfitSharing] = useState<ProfitSharingConfig>({
    stakersShare: 60,
    governanceShare: 25,
    distributionFrequency: 'quarterly',
    minimumStakeForProfit: 100,
    autoDistribute: true
  });

  const [airdrops, setAirdrops] = useState<AirdropConfig[]>([
    {
      campaignName: "Genesis Airdrop",
      totalTokens: 10000000,
      eligibilityType: "early_user",
      rewardAmount: 500,
      isActive: false
    },
    {
      campaignName: "Staker Bonus Drop",
      totalTokens: 5000000,
      eligibilityType: "staker",
      rewardAmount: 1000,
      isActive: false
    }
  ]);

  const updateStakingPoolMutation = useMutation({
    mutationFn: async (data: { poolId: string; config: Partial<StakingPoolConfig> }) => {
      return apiRequest(`/api/admin/staking/pools/${data.poolId}`, {
        method: "PUT",
        body: data.config
      });
    },
    onSuccess: () => {
      toast({
        title: "Pool Updated",
        description: "Staking pool configuration has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/staking/pools"] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Could not update staking pool configuration.",
        variant: "destructive"
      });
    }
  });

  const updateProfitSharingMutation = useMutation({
    mutationFn: async (config: ProfitSharingConfig) => {
      return apiRequest(`/api/admin/profit-sharing/config`, {
        method: "PUT",
        body: config
      });
    },
    onSuccess: () => {
      toast({
        title: "Profit Sharing Updated",
        description: "Profit sharing configuration has been saved."
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Could not update profit sharing configuration.",
        variant: "destructive"
      });
    }
  });

  const updateAirdropMutation = useMutation({
    mutationFn: async (data: { campaignId: string; config: Partial<AirdropConfig> }) => {
      return apiRequest(`/api/admin/airdrops/${data.campaignId}`, {
        method: "PUT",
        body: data.config
      });
    },
    onSuccess: () => {
      toast({
        title: "Airdrop Updated",
        description: "Airdrop campaign configuration has been updated."
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Could not update airdrop configuration.",
        variant: "destructive"
      });
    }
  });

  const updateStakingPool = (poolId: string, field: keyof StakingPoolConfig, value: any) => {
    setStakingPools(pools => 
      pools.map(pool => 
        pool.id === poolId ? { ...pool, [field]: value } : pool
      )
    );
  };

  const saveStakingPool = (poolId: string) => {
    const pool = stakingPools.find(p => p.id === poolId);
    if (pool) {
      updateStakingPoolMutation.mutate({ poolId, config: pool });
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Electric Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Admin: Staking & Rewards Configuration
            </span>
          </h1>
          <p className="text-gray-400">
            Configure staking pools, profit sharing, and airdrop campaigns
          </p>
        </div>

        <Tabs defaultValue="staking-pools" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="staking-pools">Staking Pools</TabsTrigger>
            <TabsTrigger value="profit-sharing">Profit Sharing</TabsTrigger>
            <TabsTrigger value="airdrops">Airdrops</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Staking Pools Tab */}
          <TabsContent value="staking-pools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stakingPools.map((pool) => (
                <Card key={pool.id} className="electric-frame">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gradient">{pool.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${pool.id}`}>Active</Label>
                        <Switch
                          id={`active-${pool.id}`}
                          checked={pool.isActive}
                          onCheckedChange={(checked) => updateStakingPool(pool.id, 'isActive', checked)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>APY (%)</Label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={pool.apy}
                            onChange={(e) => updateStakingPool(pool.id, 'apy', parseFloat(e.target.value))}
                            className="pl-10"
                            step="0.1"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Duration (Days)</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={pool.duration}
                            onChange={(e) => updateStakingPool(pool.id, 'duration', parseInt(e.target.value))}
                            className="pl-10"
                            min="0"
                            disabled={pool.id === 'flexible'}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Min Stake (FLBY)</Label>
                        <div className="relative">
                          <Coins className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={pool.minStake}
                            onChange={(e) => updateStakingPool(pool.id, 'minStake', parseInt(e.target.value))}
                            className="pl-10"
                            min="1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Max Capacity (FLBY)</Label>
                        <div className="relative">
                          <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={pool.maxCapacity}
                            onChange={(e) => updateStakingPool(pool.id, 'maxCapacity', parseInt(e.target.value))}
                            className="pl-10"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Early Unstake Penalty (%)</Label>
                        <Input
                          type="number"
                          value={pool.earlyUnstakePenalty}
                          onChange={(e) => updateStakingPool(pool.id, 'earlyUnstakePenalty', parseFloat(e.target.value))}
                          step="0.1"
                          min="0"
                          max="50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bonus Multiplier</Label>
                        <Input
                          type="number"
                          value={pool.bonusMultiplier}
                          onChange={(e) => updateStakingPool(pool.id, 'bonusMultiplier', parseFloat(e.target.value))}
                          step="0.1"
                          min="1"
                          max="5"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => saveStakingPool(pool.id)}
                      disabled={updateStakingPoolMutation.isPending}
                      className="w-full"
                    >
                      {updateStakingPoolMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Pool Configuration
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profit Sharing Tab */}
          <TabsContent value="profit-sharing" className="space-y-6">
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Profit Sharing Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Stakers Share (%)</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={profitSharing.stakersShare}
                          onChange={(e) => setProfitSharing({...profitSharing, stakersShare: parseFloat(e.target.value)})}
                          className="pl-10"
                          min="0"
                          max="100"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Percentage of revenue distributed to stakers
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Governance Share (%)</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={profitSharing.governanceShare}
                          onChange={(e) => setProfitSharing({...profitSharing, governanceShare: parseFloat(e.target.value)})}
                          className="pl-10"
                          min="0"
                          max="100"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Percentage for governance participants
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Minimum Stake for Profit (FLBY)</Label>
                      <div className="relative">
                        <Coins className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={profitSharing.minimumStakeForProfit}
                          onChange={(e) => setProfitSharing({...profitSharing, minimumStakeForProfit: parseInt(e.target.value)})}
                          className="pl-10"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Distribution Frequency</Label>
                      <select
                        value={profitSharing.distributionFrequency}
                        onChange={(e) => setProfitSharing({...profitSharing, distributionFrequency: e.target.value as any})}
                        className="w-full p-2 rounded-md bg-background border border-input"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-distribute">Auto-Distribute</Label>
                      <Switch
                        id="auto-distribute"
                        checked={profitSharing.autoDistribute}
                        onCheckedChange={(checked) => setProfitSharing({...profitSharing, autoDistribute: checked})}
                      />
                    </div>

                    <div className="bg-muted/20 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Distribution Preview</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Stakers:</span>
                          <span>{profitSharing.stakersShare}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Governance:</span>
                          <span>{profitSharing.governanceShare}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Platform Reserve:</span>
                          <span>{100 - profitSharing.stakersShare - profitSharing.governanceShare}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => updateProfitSharingMutation.mutate(profitSharing)}
                  disabled={updateProfitSharingMutation.isPending}
                  className="w-full"
                >
                  {updateProfitSharingMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profit Sharing Configuration
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Airdrops Tab */}
          <TabsContent value="airdrops" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {airdrops.map((airdrop, index) => (
                <Card key={index} className="electric-frame">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gradient">{airdrop.campaignName}</CardTitle>
                      <Switch
                        checked={airdrop.isActive}
                        onCheckedChange={(checked) => {
                          const newAirdrops = [...airdrops];
                          newAirdrops[index].isActive = checked;
                          setAirdrops(newAirdrops);
                        }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Total Tokens</Label>
                      <Input
                        type="number"
                        value={airdrop.totalTokens}
                        onChange={(e) => {
                          const newAirdrops = [...airdrops];
                          newAirdrops[index].totalTokens = parseInt(e.target.value);
                          setAirdrops(newAirdrops);
                        }}
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Reward Amount (FLBY)</Label>
                      <Input
                        type="number"
                        value={airdrop.rewardAmount}
                        onChange={(e) => {
                          const newAirdrops = [...airdrops];
                          newAirdrops[index].rewardAmount = parseInt(e.target.value);
                          setAirdrops(newAirdrops);
                        }}
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Eligibility Type</Label>
                      <select
                        value={airdrop.eligibilityType}
                        onChange={(e) => {
                          const newAirdrops = [...airdrops];
                          newAirdrops[index].eligibilityType = e.target.value;
                          setAirdrops(newAirdrops);
                        }}
                        className="w-full p-2 rounded-md bg-background border border-input"
                      >
                        <option value="early_user">Early User</option>
                        <option value="staker">Staker</option>
                        <option value="governance">Governance</option>
                        <option value="referral">Referral</option>
                        <option value="community">Community</option>
                      </select>
                    </div>

                    <Button
                      onClick={() => updateAirdropMutation.mutate({ 
                        campaignId: index.toString(), 
                        config: airdrop 
                      })}
                      disabled={updateAirdropMutation.isPending}
                      className="w-full"
                    >
                      Save Configuration
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <Lock className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                  <h3 className="font-medium mb-1">Total Staked</h3>
                  <p className="text-2xl font-bold">0 FLBY</p>
                  <p className="text-xs text-muted-foreground">Across all pools</p>
                </CardContent>
              </Card>
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <h3 className="font-medium mb-1">Active Stakers</h3>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Unique addresses</p>
                </CardContent>
              </Card>
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <h3 className="font-medium mb-1">Revenue Shared</h3>
                  <p className="text-2xl font-bold">$0</p>
                  <p className="text-xs text-muted-foreground">Total distributed</p>
                </CardContent>
              </Card>
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <h3 className="font-medium mb-1">Avg APY</h3>
                  <p className="text-2xl font-bold">0%</p>
                  <p className="text-xs text-muted-foreground">Weighted average</p>
                </CardContent>
              </Card>
            </div>

            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Pool Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Data Yet</h3>
                  <p className="text-muted-foreground">
                    Pool analytics will be available after FLBY token launch
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