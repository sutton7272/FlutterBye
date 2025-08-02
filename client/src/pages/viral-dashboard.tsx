import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  TrendingUp, 
  Zap, 
  Eye, 
  Share2, 
  Heart, 
  MessageSquare, 
  Award,
  Target,
  BarChart3,
  Users,
  Coins,
  Rocket
} from 'lucide-react';

interface TrendingToken {
  tokenId: string;
  symbol: string;
  message: string;
  viralScore: number;
  interactions: {
    views: number;
    shares: number;
    reactions: number;
    comments: number;
  };
  growth: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  creator: string;
  createdAt: string;
}

interface ViralMetrics {
  tokenId: string;
  viralScore: number;
  interactionCount: number;
  uniqueUsers: number;
  shareCount: number;
  averageEngagementTime: number;
  viralMilestones: Array<{
    milestone: string;
    achievedAt: string;
    reward: number;
  }>;
  hourlyStats: Array<{
    hour: string;
    interactions: number;
    newUsers: number;
  }>;
}

interface NetworkAnalysis {
  userId: string;
  influence: {
    score: number;
    rank: number;
    category: 'Micro' | 'Macro' | 'Mega' | 'Celebrity';
  };
  reach: {
    directFollowers: number;
    networkReach: number;
    potentialReach: number;
  };
  engagement: {
    averageRate: number;
    recentTrend: 'increasing' | 'stable' | 'decreasing';
  };
  viralPotential: {
    score: number;
    factors: Array<{
      factor: string;
      weight: number;
      contribution: number;
    }>;
  };
}

export default function ViralDashboard() {
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [trackingTokenId, setTrackingTokenId] = useState<string>('');

  // Fetch trending tokens
  const { data: trendingTokens, refetch: refetchTrending } = useQuery<TrendingToken[]>({
    queryKey: ['/api/viral/trending'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch viral metrics for selected token
  const { data: viralMetrics } = useQuery<ViralMetrics>({
    queryKey: ['/api/viral/metrics', selectedTokenId],
    enabled: !!selectedTokenId,
    refetchInterval: 10000
  });

  // Fetch viral prediction for selected token
  const { data: viralPrediction } = useQuery({
    queryKey: ['/api/viral/prediction', selectedTokenId],
    enabled: !!selectedTokenId
  });

  // Fetch network analysis for selected user
  const { data: networkAnalysis } = useQuery<NetworkAnalysis>({
    queryKey: ['/api/viral/network', selectedUserId],
    enabled: !!selectedUserId
  });

  // Fetch creator rewards
  const { data: creatorRewards } = useQuery({
    queryKey: ['/api/viral/rewards', selectedUserId],
    enabled: !!selectedUserId
  });

  // Track viral interaction
  const trackInteractionMutation = useMutation({
    mutationFn: async (data: { tokenId: string; interactionType: string }) => {
      const response = await fetch('/api/viral/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: data.tokenId,
          userId: 'current-user',
          interactionType: data.interactionType
        })
      });
      return response.json();
    },
    onSuccess: () => {
      refetchTrending();
      queryClient.invalidateQueries({ queryKey: ['/api/viral/metrics', trackingTokenId] });
    }
  });

  const handleTrackInteraction = (tokenId: string, type: string) => {
    setTrackingTokenId(tokenId);
    trackInteractionMutation.mutate({ tokenId, interactionType: type });
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    if (score >= 20) return 'text-blue-400';
    return 'text-slate-400';
  };

  const getViralScoreLabel = (score: number) => {
    if (score >= 80) return 'Viral';
    if (score >= 60) return 'Trending';
    if (score >= 40) return 'Growing';
    if (score >= 20) return 'Building';
    return 'Starting';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Viral Acceleration Dashboard
          </h1>
          <p className="text-purple-200">
            Track viral potential, monitor trending tokens, and accelerate your reach
          </p>
        </div>

        <Tabs defaultValue="trending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="trending" className="text-white">Trending Tokens</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Token Analytics</TabsTrigger>
            <TabsTrigger value="network" className="text-white">Network Analysis</TabsTrigger>
            <TabsTrigger value="rewards" className="text-white">Creator Rewards</TabsTrigger>
          </TabsList>

          {/* Trending Tokens Tab */}
          <TabsContent value="trending" className="space-y-6">
            
            {/* Trending Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Rocket className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="text-sm text-slate-300">Viral Tokens</p>
                      <p className="text-2xl font-bold text-white">
                        {trendingTokens?.filter(t => t.viralScore >= 80).length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-sm text-slate-300">Trending</p>
                      <p className="text-2xl font-bold text-white">
                        {trendingTokens?.filter(t => t.viralScore >= 60 && t.viralScore < 80).length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-slate-300">Growing</p>
                      <p className="text-2xl font-bold text-white">
                        {trendingTokens?.filter(t => t.viralScore >= 40 && t.viralScore < 60).length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-slate-300">Total Tracked</p>
                      <p className="text-2xl font-bold text-white">
                        {trendingTokens?.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trending Tokens List */}
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Live Trending Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {trendingTokens?.map((token: any, index: number) => (
                      <div 
                        key={token.tokenId}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedTokenId === token.tokenId 
                            ? 'bg-purple-900/30 border-purple-500' 
                            : 'bg-slate-700/30 border-slate-600 hover:border-purple-500/50'
                        }`}
                        onClick={() => setSelectedTokenId(token.tokenId)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-purple-400 border-purple-400">
                              #{index + 1}
                            </Badge>
                            <h3 className="text-white font-medium">{token.symbol}</h3>
                            <Badge 
                              variant="outline" 
                              className={`${getViralScoreColor(token.viralScore)} border-current`}
                            >
                              {getViralScoreLabel(token.viralScore)} {token.viralScore}/100
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTrackInteraction(token.tokenId, 'view');
                              }}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTrackInteraction(token.tokenId, 'share');
                              }}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTrackInteraction(token.tokenId, 'reaction');
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-slate-300 text-sm mb-3">{token.message}</p>
                        
                        <div className="grid grid-cols-4 gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-blue-400" />
                            <span className="text-slate-400">Views:</span>
                            <span className="text-white">{token.interactions.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="h-3 w-3 text-green-400" />
                            <span className="text-slate-400">Shares:</span>
                            <span className="text-white">{token.interactions.shares.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-400" />
                            <span className="text-slate-400">Reactions:</span>
                            <span className="text-white">{token.interactions.reactions.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 text-yellow-400" />
                            <span className="text-slate-400">Comments:</span>
                            <span className="text-white">{token.interactions.comments.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-600">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Growth</span>
                            <div className="flex gap-3">
                              <span className="text-green-400">1h: +{token.growth.hourly}%</span>
                              <span className="text-blue-400">1d: +{token.growth.daily}%</span>
                              <span className="text-purple-400">1w: +{token.growth.weekly}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {!trendingTokens?.length && (
                      <div className="text-center py-8">
                        <TrendingUp className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">No trending tokens yet</p>
                        <p className="text-slate-500 text-sm">Create some tokens to see them trending here</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Token Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            
            {/* Token Selection */}
            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Token Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    value={selectedTokenId}
                    onChange={(e) => setSelectedTokenId(e.target.value)}
                    placeholder="Enter Token ID to analyze..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/viral/metrics', selectedTokenId] })}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Viral Metrics */}
            {viralMetrics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Viral Score */}
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Viral Score Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`text-6xl font-bold ${getViralScoreColor(viralMetrics.viralScore)}`}>
                        {viralMetrics.viralScore}
                      </div>
                      <p className="text-slate-400 mt-2">{getViralScoreLabel(viralMetrics.viralScore)}</p>
                      <Progress 
                        value={viralMetrics.viralScore} 
                        className="mt-4 h-3"
                      />
                    </div>
                    
                    <Separator className="bg-slate-600" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Total Interactions</p>
                        <p className="text-white font-medium text-lg">
                          {viralMetrics.interactionCount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Unique Users</p>
                        <p className="text-white font-medium text-lg">
                          {viralMetrics.uniqueUsers.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Share Count</p>
                        <p className="text-white font-medium text-lg">
                          {viralMetrics.shareCount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Avg. Engagement</p>
                        <p className="text-white font-medium text-lg">
                          {viralMetrics.averageEngagementTime.toFixed(1)}s
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Viral Milestones */}
                <Card className="bg-slate-800/50 border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-400" />
                      Viral Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {viralMetrics.viralMilestones.map((milestone, index) => (
                          <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-white font-medium text-sm">{milestone.milestone}</h4>
                              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                +{milestone.reward} FLBY
                              </Badge>
                            </div>
                            <p className="text-slate-400 text-xs">
                              {new Date(milestone.achievedAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                        
                        {!viralMetrics.viralMilestones.length && (
                          <div className="text-center py-4">
                            <Award className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                            <p className="text-slate-400 text-sm">No milestones reached yet</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Viral Prediction */}
            {viralPrediction && (
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-400" />
                    AI Viral Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-slate-400 text-sm mb-2">Predicted Peak Score</p>
                      <p className="text-2xl font-bold text-green-400">
                        {(viralPrediction as any)?.predictedPeakScore || 0}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-slate-400 text-sm mb-2">Time to Peak</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {(viralPrediction as any)?.timeToPeak || '0h'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-slate-400 text-sm mb-2">Confidence</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {(((viralPrediction as any)?.confidence || 0) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Network Analysis Tab */}
          <TabsContent value="network" className="space-y-6">
            
            {/* User Selection */}
            <Card className="bg-slate-800/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white">Network Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    placeholder="Enter User ID to analyze network..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/viral/network', selectedUserId] })}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Analyze Network
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Network Analysis Results */}
            {networkAnalysis && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Influence Metrics */}
                <Card className="bg-slate-800/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      Influence Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400">
                        {networkAnalysis.influence.score}
                      </div>
                      <p className="text-slate-400">Influence Score</p>
                      <Badge variant="outline" className="mt-2 text-blue-400 border-blue-400">
                        {networkAnalysis.influence.category} Influencer
                      </Badge>
                      <p className="text-sm text-slate-400 mt-1">
                        Rank #{networkAnalysis.influence.rank}
                      </p>
                    </div>
                    
                    <Separator className="bg-slate-600" />
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Direct Followers</span>
                        <span className="text-white font-medium">
                          {networkAnalysis.reach.directFollowers.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Network Reach</span>
                        <span className="text-white font-medium">
                          {networkAnalysis.reach.networkReach.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Potential Reach</span>
                        <span className="text-white font-medium">
                          {networkAnalysis.reach.potentialReach.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Engagement Rate</span>
                        <span className="text-white font-medium">
                          {(networkAnalysis.engagement.averageRate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Viral Potential */}
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-purple-400" />
                      Viral Potential
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-400">
                        {networkAnalysis.viralPotential.score}
                      </div>
                      <p className="text-slate-400">Viral Potential Score</p>
                      <Progress 
                        value={networkAnalysis.viralPotential.score} 
                        className="mt-4 h-3"
                      />
                    </div>
                    
                    <Separator className="bg-slate-600" />
                    
                    <div className="space-y-2">
                      <h4 className="text-white font-medium text-sm">Contributing Factors</h4>
                      {networkAnalysis.viralPotential.factors.map((factor: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">{factor.factor}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Weight: {factor.weight}</span>
                            <span className="text-white font-medium">+{factor.contribution}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Creator Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            
            {/* Creator Selection */}
            <Card className="bg-slate-800/50 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white">Creator Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    placeholder="Enter Creator ID to view rewards..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/viral/rewards', selectedUserId] })}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    View Rewards
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Summary */}
            {creatorRewards && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-yellow-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Coins className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-sm text-slate-300">Total FLBY Earned</p>
                        <p className="text-2xl font-bold text-white">
                          {(creatorRewards as any)?.totalEarned || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm text-slate-300">Viral Milestones</p>
                        <p className="text-2xl font-bold text-white">
                          {(creatorRewards as any)?.milestonesHit || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-blue-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-slate-300">Trending Tokens</p>
                        <p className="text-2xl font-bold text-white">
                          {(creatorRewards as any)?.trendingTokens || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Rocket className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-slate-300">Viral Multiplier</p>
                        <p className="text-2xl font-bold text-white">
                          {(creatorRewards as any)?.viralMultiplier || '1.0'}x
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}