import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Award, 
  TrendingUp, 
  Calendar, 
  Gift,
  Medal,
  Crown,
  Zap,
  Heart,
  MessageSquare,
  Coins
} from "lucide-react";

interface UserReward {
  id: string;
  userId: string;
  totalPoints: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalSmsMessages: number;
  totalTokensMinted: number;
  totalValueAttached: string;
  lastActivityDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  category: string;
  rarity: string;
  pointsReward: number;
  earnedAt?: string;
}

interface RewardTransaction {
  id: string;
  userId: string;
  type: string;
  action: string;
  pointsChange: number;
  description: string;
  createdAt: string;
}

interface DailyChallenge {
  id: string;
  challengeType: string;
  targetValue: number;
  description: string;
  pointsReward: number;
  currentProgress?: number;
  isCompleted?: boolean;
}

interface LeaderboardEntry {
  id: string;
  userId: string;
  totalPoints: number;
  currentLevel: number;
  currentStreak: number;
  user: {
    walletAddress: string;
  };
}

export function RewardsPage() {
  const [selectedUserId, setSelectedUserId] = useState("user-1"); // Mock user ID
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user rewards
  const { data: userRewards, isLoading: rewardsLoading } = useQuery({
    queryKey: ["/api/rewards/user", selectedUserId],
    enabled: !!selectedUserId,
  });

  // Fetch user badges
  const { data: userBadges = [], isLoading: badgesLoading } = useQuery({
    queryKey: ["/api/rewards/user", selectedUserId, "badges"],
    enabled: !!selectedUserId,
  });

  // Fetch user transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/rewards/user", selectedUserId, "transactions"],
    enabled: !!selectedUserId,
  });

  // Fetch leaderboard
  const { data: leaderboard = [] } = useQuery({
    queryKey: ["/api/rewards/leaderboard"],
  });

  // Fetch daily challenges
  const { data: challenges = [] } = useQuery({
    queryKey: ["/api/rewards/challenges"],
  });

  // Fetch user challenge progress
  const { data: challengeProgress = [] } = useQuery({
    queryKey: ["/api/rewards/user", selectedUserId, "challenges"],
    enabled: !!selectedUserId,
  });

  // Initialize user rewards
  const initializeRewardsMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/rewards/initialize/${userId}`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to initialize rewards");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Welcome to Flutterbye Rewards!", description: "Your rewards profile has been created!" });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards/user", selectedUserId] });
    },
  });

  // Process daily login
  const dailyLoginMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/rewards/user/${userId}/login`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to process daily login");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Daily Login Bonus!", description: "You earned points for logging in today!" });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards/user", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards/user", selectedUserId, "transactions"] });
    },
  });

  // Calculate level progress
  const calculateLevelProgress = (points: number, level: number) => {
    const levelThresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 17000, 25000, 35000, 50000, 75000];
    const currentThreshold = levelThresholds[level - 1] || 0;
    const nextThreshold = levelThresholds[level] || levelThresholds[levelThresholds.length - 1];
    const progress = ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return <Crown className="h-4 w-4" />;
      case 'epic': return <Medal className="h-4 w-4" />;
      case 'rare': return <Star className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sms': return <MessageSquare className="h-5 w-5" />;
      case 'trading': return <TrendingUp className="h-5 w-5" />;
      case 'social': return <Heart className="h-5 w-5" />;
      case 'milestone': return <Target className="h-5 w-5" />;
      default: return <Trophy className="h-5 w-5" />;
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Flutterbye Rewards</h1>
          <p className="text-xl text-purple-200">
            Earn points, unlock badges, and climb the leaderboard through SMS engagement
          </p>
        </div>

        {/* User Rewards Overview */}
        {!userRewards && !rewardsLoading && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="py-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to Flutterbye Rewards!</h2>
              <p className="text-purple-200 mb-6">
                Start earning points by sending SMS messages, minting tokens, and engaging with the platform.
              </p>
              <Button 
                onClick={() => initializeRewardsMutation.mutate(selectedUserId)}
                disabled={initializeRewardsMutation.isPending}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {initializeRewardsMutation.isPending ? "Initializing..." : "Start Earning Rewards"}
              </Button>
            </CardContent>
          </Card>
        )}

        {userRewards && (
          <>
            {/* Rewards Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border-white/20">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-200">Total Points</p>
                      <p className="text-3xl font-bold text-yellow-100">{userRewards.totalPoints?.toLocaleString()}</p>
                    </div>
                    <Coins className="h-8 w-8 text-yellow-300" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-white/20">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-200">Level</p>
                      <p className="text-3xl font-bold text-purple-100">{userRewards.currentLevel}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-purple-300" />
                  </div>
                  <div className="mt-4">
                    <Progress 
                      value={calculateLevelProgress(userRewards.totalPoints, userRewards.currentLevel)} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border-white/20">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-200">Current Streak</p>
                      <p className="text-3xl font-bold text-orange-100">{userRewards.currentStreak} days</p>
                    </div>
                    <Flame className="h-8 w-8 text-orange-300" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-white/20">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-200">SMS Messages</p>
                      <p className="text-3xl font-bold text-green-100">{userRewards.totalSmsMessages}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-green-300" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Login Button */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Daily Login Bonus</h3>
                    <p className="text-gray-300">Earn 5 points for logging in each day and maintain your streak!</p>
                  </div>
                  <Button 
                    onClick={() => dailyLoginMutation.mutate(selectedUserId)}
                    disabled={dailyLoginMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    {dailyLoginMutation.isPending ? "Processing..." : "Claim Daily Bonus"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="badges" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="history">Transaction History</TabsTrigger>
              </TabsList>

              {/* Badges Tab */}
              <TabsContent value="badges">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Your Badges</CardTitle>
                    <CardDescription className="text-purple-200">
                      Collect badges by completing various activities on Flutterbye
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userBadges.length === 0 ? (
                      <div className="text-center py-8 text-purple-200">
                        No badges earned yet. Keep engaging to unlock your first badge!
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userBadges.map((userBadge: any) => (
                          <Card 
                            key={userBadge.id} 
                            className={`bg-gradient-to-br ${getRarityColor(userBadge.badge.rarity)} backdrop-blur-sm border-white/20`}
                          >
                            <CardContent className="py-4">
                              <div className="flex items-center gap-3 mb-3">
                                {getCategoryIcon(userBadge.badge.category)}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-white">{userBadge.badge.name}</h3>
                                  <div className="flex items-center gap-1">
                                    {getRarityIcon(userBadge.badge.rarity)}
                                    <span className="text-sm text-white/80 capitalize">
                                      {userBadge.badge.rarity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-white/90 mb-2">{userBadge.badge.description}</p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-white/80">+{userBadge.badge.pointsReward} points</span>
                                <span className="text-white/80">
                                  Earned {formatDate(userBadge.earnedAt)}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Daily Challenges Tab */}
              <TabsContent value="challenges">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Daily Challenges</CardTitle>
                    <CardDescription className="text-purple-200">
                      Complete daily tasks to earn bonus points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {challenges.length === 0 ? (
                      <div className="text-center py-8 text-purple-200">
                        No active challenges today. Check back tomorrow for new challenges!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {challenges.map((challenge: DailyChallenge) => {
                          const progress = challengeProgress.find((p: any) => p.challengeId === challenge.id);
                          const currentProgress = progress?.currentProgress || 0;
                          const isCompleted = progress?.isCompleted || false;
                          const progressPercent = Math.min((currentProgress / challenge.targetValue) * 100, 100);

                          return (
                            <Card key={challenge.id} className="bg-white/5 border-white/10">
                              <CardContent className="py-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <Target className="h-5 w-5 text-blue-300" />
                                    <h3 className="font-semibold text-white">{challenge.description}</h3>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant={isCompleted ? "default" : "secondary"}
                                      className={isCompleted ? "bg-green-600" : "bg-gray-600"}
                                    >
                                      {isCompleted ? "Completed" : "In Progress"}
                                    </Badge>
                                    <span className="text-sm text-yellow-300">+{challenge.pointsReward} pts</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-300">Progress</span>
                                    <span className="text-white">{currentProgress} / {challenge.targetValue}</span>
                                  </div>
                                  <Progress value={progressPercent} className="h-3" />
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Global Leaderboard</CardTitle>
                    <CardDescription className="text-purple-200">
                      See how you rank against other Flutterbye users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white">Rank</TableHead>
                          <TableHead className="text-white">User</TableHead>
                          <TableHead className="text-white">Level</TableHead>
                          <TableHead className="text-white">Points</TableHead>
                          <TableHead className="text-white">Streak</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaderboard.slice(0, 10).map((entry: LeaderboardEntry, index: number) => (
                          <TableRow key={entry.id}>
                            <TableCell className="text-white font-medium">
                              <div className="flex items-center gap-2">
                                {index < 3 && (
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    index === 0 ? 'bg-yellow-500' : 
                                    index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                                  }`}>
                                    {index + 1}
                                  </div>
                                )}
                                {index >= 3 && <span>{index + 1}</span>}
                              </div>
                            </TableCell>
                            <TableCell className="text-white font-mono">
                              {formatWalletAddress(entry.user.walletAddress)}
                            </TableCell>
                            <TableCell className="text-purple-300">{entry.currentLevel}</TableCell>
                            <TableCell className="text-yellow-300">{entry.totalPoints.toLocaleString()}</TableCell>
                            <TableCell className="text-orange-300">{entry.currentStreak} days</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Transaction History Tab */}
              <TabsContent value="history">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-purple-200">
                      Your recent point transactions and achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactions.length === 0 ? (
                      <div className="text-center py-8 text-purple-200">
                        No transaction history yet. Start earning points to see your activity here!
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.map((transaction: RewardTransaction) => (
                          <div 
                            key={transaction.id} 
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                transaction.pointsChange > 0 ? 'bg-green-600' : 'bg-red-600'
                              }`}>
                                {transaction.pointsChange > 0 ? '+' : '-'}
                              </div>
                              <div>
                                <p className="text-white font-medium">{transaction.description}</p>
                                <p className="text-xs text-gray-400">{formatDate(transaction.createdAt)}</p>
                              </div>
                            </div>
                            <div className={`font-bold ${
                              transaction.pointsChange > 0 ? 'text-green-300' : 'text-red-300'
                            }`}>
                              {transaction.pointsChange > 0 ? '+' : ''}{transaction.pointsChange} pts
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}