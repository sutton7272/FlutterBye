import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Coins, 
  Trophy, 
  Share2, 
  Copy, 
  CheckCircle,
  TrendingUp,
  Gift,
  Crown,
  Target
} from "lucide-react";

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  pendingRewards: number;
  referralCode: string;
  currentTier: string;
  nextTierProgress: number;
}

interface ReferralTier {
  name: string;
  minReferrals: number;
  rewardMultiplier: number;
  bonusReward: number;
  benefits: string[];
}

export default function ReferralRewards() {
  const [shareUrl, setShareUrl] = useState("");
  const { toast } = useToast();

  // Mock referral data
  const referralStats: ReferralStats = {
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarned: 0,
    pendingRewards: 0,
    referralCode: "FLBY-ABC123",
    currentTier: "Bronze",
    nextTierProgress: 0
  };

  const referralTiers: ReferralTier[] = [
    {
      name: "Bronze",
      minReferrals: 0,
      rewardMultiplier: 1.0,
      bonusReward: 50,
      benefits: ["50 FLBY per qualified referral", "Basic referral tracking"]
    },
    {
      name: "Silver",
      minReferrals: 5,
      rewardMultiplier: 1.2,
      bonusReward: 75,
      benefits: ["75 FLBY per qualified referral", "20% bonus multiplier", "Priority support"]
    },
    {
      name: "Gold",
      minReferrals: 15,
      rewardMultiplier: 1.5,
      bonusReward: 125,
      benefits: ["125 FLBY per qualified referral", "50% bonus multiplier", "Exclusive features access"]
    },
    {
      name: "Platinum",
      minReferrals: 50,
      rewardMultiplier: 2.0,
      bonusReward: 250,
      benefits: ["250 FLBY per qualified referral", "100% bonus multiplier", "Revenue sharing bonus", "Direct team contact"]
    }
  ];

  const generateReferralLinkMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/referrals/generate-link`, {
        method: "POST"
      });
    },
    onSuccess: (data) => {
      setShareUrl(data.referralUrl);
      toast({
        title: "Referral Link Generated",
        description: "Your unique referral link has been created!"
      });
    },
    onError: () => {
      toast({
        title: "Feature Coming Soon",
        description: "Referral system will be available after FLBY token launch.",
        variant: "destructive"
      });
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard."
    });
  };

  const getCurrentTier = () => {
    return referralTiers.find(tier => tier.name === referralStats.currentTier) || referralTiers[0];
  };

  const getNextTier = () => {
    const currentIndex = referralTiers.findIndex(tier => tier.name === referralStats.currentTier);
    return currentIndex < referralTiers.length - 1 ? referralTiers[currentIndex + 1] : null;
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
              Referral Rewards Program
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Earn FLBY tokens by inviting friends to join Flutterbye. Get rewarded for every successful referral!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm text-muted-foreground">Total Referrals</p>
              <p className="text-xl font-bold">{referralStats.totalReferrals}</p>
            </CardContent>
          </Card>
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-sm text-muted-foreground">Active Referrals</p>
              <p className="text-xl font-bold">{referralStats.activeReferrals}</p>
            </CardContent>
          </Card>
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <Coins className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-xl font-bold">{referralStats.totalEarned} FLBY</p>
            </CardContent>
          </Card>
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <Gift className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-sm text-muted-foreground">Pending Rewards</p>
              <p className="text-xl font-bold">{referralStats.pendingRewards} FLBY</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referral Link Generation */}
          <div className="space-y-6">
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Your Referral Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Referral Code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={referralStats.referralCode}
                      readOnly
                      className="bg-muted/20"
                    />
                    <Button
                      onClick={() => copyToClipboard(referralStats.referralCode)}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {shareUrl ? (
                  <div className="space-y-2">
                    <Label>Share Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={shareUrl}
                        readOnly
                        className="bg-muted/20"
                      />
                      <Button
                        onClick={() => copyToClipboard(shareUrl)}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => generateReferralLinkMutation.mutate()}
                    disabled={generateReferralLinkMutation.isPending}
                    className="w-full"
                  >
                    {generateReferralLinkMutation.isPending ? (
                      "Generating..."
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 mr-2" />
                        Generate Referral Link
                      </>
                    )}
                  </Button>
                )}

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <h4 className="font-medium text-blue-400 mb-2">How It Works</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Share your referral link with friends</li>
                    <li>• They sign up and stake minimum 1,000 FLBY</li>
                    <li>• You earn {getCurrentTier().bonusReward} FLBY per qualified referral</li>
                    <li>• Both you and your friend get bonus rewards</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Current Tier Status */}
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient">
                  <Crown className="w-5 h-5" />
                  Current Tier: {referralStats.currentTier}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {getCurrentTier().bonusReward} FLBY
                  </div>
                  <p className="text-sm text-muted-foreground">per qualified referral</p>
                </div>

                {getNextTier() && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to {getNextTier()?.name}</span>
                      <span>{referralStats.totalReferrals} / {getNextTier()?.minReferrals}</span>
                    </div>
                    <Progress 
                      value={(referralStats.totalReferrals / (getNextTier()?.minReferrals || 1)) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {(getNextTier()?.minReferrals || 0) - referralStats.totalReferrals} more referrals to unlock {getNextTier()?.name}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium">Current Benefits:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {getCurrentTier().benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Tiers */}
          <div className="space-y-6">
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Referral Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {referralTiers.map((tier, index) => (
                  <div 
                    key={tier.name}
                    className={`p-4 rounded-lg border transition-all ${
                      tier.name === referralStats.currentTier 
                        ? 'border-yellow-500/50 bg-yellow-500/10' 
                        : 'border-muted/20 bg-muted/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Crown className={`w-4 h-4 ${
                          tier.name === referralStats.currentTier ? 'text-yellow-400' : 'text-muted-foreground'
                        }`} />
                        <h3 className="font-semibold">{tier.name}</h3>
                        {tier.name === referralStats.currentTier && (
                          <Badge variant="secondary" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{tier.bonusReward} FLBY</p>
                        <p className="text-xs text-muted-foreground">per referral</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground">
                        Requires {tier.minReferrals} qualified referrals
                      </p>
                      {tier.rewardMultiplier > 1 && (
                        <p className="text-sm text-green-400">
                          {((tier.rewardMultiplier - 1) * 100)}% bonus multiplier
                        </p>
                      )}
                    </div>

                    <ul className="text-xs text-muted-foreground space-y-1">
                      {tier.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <Target className="w-2 h-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Referral History */}
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Recent Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No Referrals Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start sharing your referral link to see your progress here!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}