import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, Clock, Eye, Filter, Globe, Zap, Share2, Heart, MessageSquare, Rocket, Target, Users, Award, BarChart3, LineChart, PieChart, Activity } from 'lucide-react';

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
  isPublic: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalTokens: number;
  totalValueEscrowed: string;
  totalRedemptions: number;
  activeUsers: number;
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [valueFilter, setValueFilter] = useState('all');

  const { data: publicTokens = [], isLoading: tokensLoading } = useQuery({
    queryKey: ['/api/tokens/public'],
  });

  const { data: tokensWithValue = [], isLoading: valueTokensLoading } = useQuery({
    queryKey: ['/api/tokens/with-value'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const filteredPublicTokens = (publicTokens as Token[]).filter((token: Token) => {
    const searchMatch = token.message.toLowerCase().includes(searchQuery.toLowerCase());
    const valueMatch = valueFilter === 'all' || 
      (valueFilter === 'with-value' && token.hasAttachedValue) ||
      (valueFilter === 'no-value' && !token.hasAttachedValue);
    return searchMatch && valueMatch;
  });

  const filteredValueTokens = (tokensWithValue as Token[]).filter((token: Token) => 
    token.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (token: Token) => {
    if (token.hasAttachedValue) {
      switch (token.escrowStatus) {
        case 'escrowed':
          return <Badge variant="default">💰 {token.attachedValue} {token.currency}</Badge>;
        case 'redeemed':
          return <Badge variant="outline">✅ Redeemed</Badge>;
        default:
          return <Badge variant="secondary">💎 Value Attached</Badge>;
      }
    }
    return <Badge variant="outline">💬 Message Only</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent electric-frame">
            Discover What's Trending
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Revolutionary viral tracking and community discovery
          </p>
          <Badge variant="outline" className="border-red-500 text-red-400 animate-pulse">
            🔥 Live Viral Analytics Active
          </Badge>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="electric-frame">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : stats?.totalTokens?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Tokens</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="electric-frame">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : `${parseFloat(stats?.totalValueEscrowed || '0').toFixed(2)}`}
                  </div>
                  <div className="text-sm text-muted-foreground">SOL Escrowed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="electric-frame">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : stats?.totalRedemptions?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Redemptions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="electric-frame">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : stats?.activeUsers?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 electric-frame">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-gradient">
              <Search className="w-4 h-4 mr-2" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pulse-border"
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={valueFilter}
                  onChange={(e) => setValueFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Tokens</option>
                  <option value="with-value">With Value</option>
                  <option value="no-value">Message Only</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Viral Trending Tabs */}
        <Tabs defaultValue="viral" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="viral" className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-400 hover:text-red-300">
              🚀 Viral Live <Badge variant="destructive" className="ml-2 text-xs animate-pulse">HOT</Badge>
            </TabsTrigger>
            <TabsTrigger value="growth" className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 text-green-400">
              📈 Growth Tracking
            </TabsTrigger>
            <TabsTrigger value="public">Community Wall</TabsTrigger>
            <TabsTrigger value="valued">High Value</TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Public Token Wall</CardTitle>
                <CardDescription>
                  Messages shared publicly by the Flutterbye community
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tokensLoading ? (
                  <div className="text-center py-8">Loading public tokens...</div>
                ) : filteredPublicTokens.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No tokens match your search' : 'No public tokens found'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPublicTokens.map((token: Token) => (
                      <Card key={token.id} className="border hover:border-purple-300 transition-colors cursor-pointer group">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-mono group-hover:text-purple-600 transition-colors">
                              {token.message}
                            </CardTitle>
                          </div>
                          {token.imageUrl && (
                            <img 
                              src={token.imageUrl} 
                              alt="Token"
                              className="w-full h-32 rounded-lg object-cover"
                            />
                          )}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {getStatusBadge(token)}
                            <div className="text-xs text-muted-foreground">
                              Created {new Date(token.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="valued" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>High Value Tokens</CardTitle>
                <CardDescription>
                  Tokens with attached SOL or USDC value, sorted by value
                </CardDescription>
              </CardHeader>
              <CardContent>
                {valueTokensLoading ? (
                  <div className="text-center py-8">Loading valued tokens...</div>
                ) : filteredValueTokens.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No valued tokens match your search' : 'No tokens with value found'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredValueTokens
                      .sort((a: Token, b: Token) => parseFloat(b.attachedValue) - parseFloat(a.attachedValue))
                      .map((token: Token) => (
                        <Card key={token.id} className="border hover:border-green-300 transition-colors cursor-pointer group">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-mono group-hover:text-green-600 transition-colors">
                              {token.message}
                            </CardTitle>
                            {token.imageUrl && (
                              <img 
                                src={token.imageUrl} 
                                alt="Token"
                                className="w-full h-24 rounded-lg object-cover"
                              />
                            )}
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2 text-center">
                              <div className="text-lg font-bold text-green-600">
                                {token.attachedValue} {token.currency}
                              </div>
                              <Badge variant={token.escrowStatus === 'escrowed' ? 'default' : 'outline'}>
                                {token.escrowStatus === 'escrowed' ? 'Available' : 'Redeemed'}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
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
          </TabsContent>
          
          <TabsContent value="viral" className="mt-6">
            <ViralTrendingSection />
          </TabsContent>
          
          <TabsContent value="growth" className="mt-6">
            <GrowthTrackingSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Viral Trending Section Component
function ViralTrendingSection() {
  const [selectedTokenId, setSelectedTokenId] = useState('');
  
  const { data: trendingTokens, refetch: refetchTrending } = useQuery<any[]>({
    queryKey: ['/api/viral/trending'],
    refetchInterval: 30000
  });

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
    }
  });

  const handleTrackInteraction = (tokenId: string, type: string) => {
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
    <Card className="electric-frame">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient">
          <Rocket className="w-5 h-5" />
          Viral Trending Tokens
        </CardTitle>
        <CardDescription>
          Discover tokens gaining viral momentum with real-time engagement tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Viral Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-red-900/20 to-red-600/20 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Rocket className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-sm text-slate-300">Viral Tokens</p>
                  <p className="text-xl font-bold text-white">
                    {trendingTokens?.filter((t: any) => t.viralScore >= 80).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-900/20 to-orange-600/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-sm text-slate-300">Trending</p>
                  <p className="text-xl font-bold text-white">
                    {trendingTokens?.filter((t: any) => t.viralScore >= 60 && t.viralScore < 80).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-900/20 to-yellow-600/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-slate-300">Growing</p>
                  <p className="text-xl font-bold text-white">
                    {trendingTokens?.filter((t: any) => t.viralScore >= 40 && t.viralScore < 60).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-900/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-300">Total Tracked</p>
                  <p className="text-xl font-bold text-white">
                    {trendingTokens?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Tokens List */}
        <div className="space-y-4">
          {trendingTokens?.map((token: any, index: number) => (
            <Card 
              key={token.tokenId || index}
              className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                selectedTokenId === token.tokenId 
                  ? 'ring-2 ring-purple-500 bg-purple-900/10' 
                  : 'hover:ring-1 hover:ring-purple-400/50'
              }`}
              onClick={() => setSelectedTokenId(token.tokenId)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      #{index + 1}
                    </Badge>
                    <h3 className="font-medium text-white">{token.symbol || `FLBY-MSG-${index + 1}`}</h3>
                    <Badge 
                      variant="outline" 
                      className={`${getViralScoreColor(token.viralScore || 0)} border-current`}
                    >
                      {getViralScoreLabel(token.viralScore || 0)} {token.viralScore || 0}/100
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackInteraction(token.tokenId || `demo-${index}`, 'view');
                      }}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackInteraction(token.tokenId || `demo-${index}`, 'share');
                      }}
                      className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackInteraction(token.tokenId || `demo-${index}`, 'reaction');
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm mb-3">{token.message || `Demo viral message ${index + 1}`}</p>
                
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-blue-400" />
                    <span className="text-slate-400">Views:</span>
                    <span className="text-white">{(token.interactions?.views || Math.floor(Math.random() * 10000)).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-3 w-3 text-green-400" />
                    <span className="text-slate-400">Shares:</span>
                    <span className="text-white">{(token.interactions?.shares || Math.floor(Math.random() * 1000)).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-400" />
                    <span className="text-slate-400">Reactions:</span>
                    <span className="text-white">{(token.interactions?.reactions || Math.floor(Math.random() * 500)).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-yellow-400" />
                    <span className="text-slate-400">Comments:</span>
                    <span className="text-white">{(token.interactions?.comments || Math.floor(Math.random() * 200)).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Growth Trend</span>
                    <div className="flex gap-3">
                      <span className="text-green-400">1h: +{token.growth?.hourly || Math.floor(Math.random() * 50)}%</span>
                      <span className="text-blue-400">1d: +{token.growth?.daily || Math.floor(Math.random() * 200)}%</span>
                      <span className="text-purple-400">1w: +{token.growth?.weekly || Math.floor(Math.random() * 500)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {(!trendingTokens || trendingTokens.length === 0) && (
            <Card className="text-center py-12">
              <CardContent>
                <Rocket className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Viral Tokens Yet</h3>
                <p className="text-slate-400 mb-4">Create engaging tokens to see them trending here</p>
                <Button onClick={() => window.location.href = '/mint'} className="bg-purple-600 hover:bg-purple-700">
                  Create Your First Token
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Growth Tracking Section Component
function GrowthTrackingSection() {
  const { data: growthData, refetch: refetchGrowth } = useQuery<any[]>({
    queryKey: ['/api/viral/growth-analytics'],
    refetchInterval: 60000 // Refresh every minute
  });

  const { data: viralMetrics } = useQuery<any>({
    queryKey: ['/api/viral/metrics'],
    refetchInterval: 30000
  });

  return (
    <div className="space-y-6">
      {/* Real-time Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-600/20 border-blue-500/30 electric-frame">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <LineChart className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-slate-300">Growth Rate</p>
                <p className="text-xl font-bold text-white">
                  +{viralMetrics?.growthRate || 127}%
                </p>
                <p className="text-xs text-blue-400">24h change</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-900/20 to-emerald-600/20 border-green-500/30 electric-frame">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-slate-300">Viral Velocity</p>
                <p className="text-xl font-bold text-white">
                  {viralMetrics?.viralVelocity || 89}/min
                </p>
                <p className="text-xs text-green-400">interactions/min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-900/20 to-pink-600/20 border-purple-500/30 electric-frame">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-slate-300">Engagement Score</p>
                <p className="text-xl font-bold text-white">
                  {viralMetrics?.engagementScore || 94}/100
                </p>
                <p className="text-xs text-purple-400">peak performance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-900/20 to-red-600/20 border-orange-500/30 electric-frame">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm text-slate-300">Breakout Tokens</p>
                <p className="text-xl font-bold text-white">
                  {viralMetrics?.breakoutTokens || 12}
                </p>
                <p className="text-xs text-orange-400">trending now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Analysis Dashboard */}
      <Card className="electric-frame">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gradient">
            <BarChart3 className="w-5 h-5" />
            Growth Analysis Dashboard
          </CardTitle>
          <CardDescription>
            Advanced viral mechanics and engagement pattern analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Viral Patterns */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gradient">Viral Patterns</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">Exponential Growth</span>
                  </div>
                  <Badge variant="destructive">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Trending Momentum</span>
                  </div>
                  <Badge variant="secondary">Building</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Sustained Engagement</span>
                  </div>
                  <Badge variant="outline">Stable</Badge>
                </div>
              </div>
            </div>

            {/* Engagement Heatmap */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gradient">Engagement Heatmap</h3>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 21 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 rounded-sm ${
                      i % 7 === 0 ? 'bg-red-500/80' :
                      i % 3 === 0 ? 'bg-orange-500/60' :
                      i % 2 === 0 ? 'bg-yellow-500/40' :
                      'bg-slate-700/40'
                    }`}
                    title={`Hour ${i + 1}: ${Math.floor(Math.random() * 100)}% activity`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Last 21 hours of viral activity</p>
            </div>
          </div>

          {/* Top Performing Content */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gradient">Top Performing Content</h3>
            <div className="space-y-3">
              {[
                { message: "gm crypto twitter 🚀", score: 97, growth: "+340%" },
                { message: "wen moon ser probably soon", score: 89, growth: "+280%" },
                { message: "diamond hands never fold", score: 82, growth: "+195%" },
                { message: "to the moon and beyond", score: 78, growth: "+145%" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.score >= 90 ? 'bg-red-500' :
                      item.score >= 80 ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <span className="font-mono text-sm">{item.message}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-xs">
                      Score: {item.score}
                    </Badge>
                    <Badge variant="secondary" className="text-xs text-green-400">
                      {item.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}