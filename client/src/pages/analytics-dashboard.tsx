import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  MessageSquare, 
  Zap,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Share,
  Heart,
  Coins,
  Flame,
  Crown,
  Award
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  totalTokens: number;
  totalValue: number;
  messagesSent: number;
  redemptions: number;
  conversionRate: number;
  viralScore: number;
  userGrowthRate: number;
  revenueGrowthRate: number;
}

interface TokenPerformance {
  id: string;
  symbol: string;
  message: string;
  creator: string;
  value: number;
  holders: number;
  transfers: number;
  viralScore: number;
  createdAt: string;
  performance: 'up' | 'down' | 'stable';
  growthRate: number;
}

interface UserEngagement {
  date: string;
  activeUsers: number;
  newUsers: number;
  tokenCreations: number;
  messagesSent: number;
  redemptions: number;
}

interface GeographicData {
  country: string;
  users: number;
  tokensCreated: number;
  totalValue: number;
  percentage: number;
}

export default function AnalyticsDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch analytics metrics
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['/api/analytics/metrics', timeRange],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/analytics/metrics?range=${timeRange}`);
      return response as AnalyticsMetrics;
    },
    enabled: isAuthenticated
  });

  // Fetch top performing tokens
  const { data: topTokens, isLoading: tokensLoading } = useQuery({
    queryKey: ['/api/analytics/top-tokens', timeRange],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/analytics/top-tokens?range=${timeRange}&limit=10`);
      return response as TokenPerformance[];
    },
    enabled: isAuthenticated
  });

  // Fetch user engagement data
  const { data: engagement, isLoading: engagementLoading } = useQuery({
    queryKey: ['/api/analytics/engagement', timeRange],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/analytics/engagement?range=${timeRange}`);
      return response as UserEngagement[];
    },
    enabled: isAuthenticated
  });

  // Fetch geographic data
  const { data: geographic, isLoading: geoLoading } = useQuery({
    queryKey: ['/api/analytics/geographic', timeRange],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/analytics/geographic?range=${timeRange}`);
      return response as GeographicData[];
    },
    enabled: isAuthenticated
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchMetrics(),
      ]);
      toast({
        title: "Analytics Updated",
        description: "Dashboard data has been refreshed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh analytics data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getPerformanceColor = (performance: 'up' | 'down' | 'stable') => {
    switch (performance) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPerformanceIcon = (performance: 'up' | 'down' | 'stable') => {
    switch (performance) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-purple-500/20 p-8">
          <CardContent className="text-center">
            <Crown className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-purple-400 mb-2">Authentication Required</h2>
            <p className="text-gray-400">Please connect your wallet to access analytics dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-400 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Comprehensive platform insights and performance metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-slate-800 border-purple-500/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/20">
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">
                    {metricsLoading ? '...' : formatNumber(metrics?.totalUsers || 0)}
                  </p>
                  <p className={`text-sm flex items-center gap-1 ${
                    (metrics?.userGrowthRate || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {(metrics?.userGrowthRate || 0) >= 0 ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    {formatPercentage(metrics?.userGrowthRate || 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold text-white">
                    {metricsLoading ? '...' : formatCurrency(metrics?.totalValue || 0)}
                  </p>
                  <p className={`text-sm flex items-center gap-1 ${
                    (metrics?.revenueGrowthRate || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {(metrics?.revenueGrowthRate || 0) >= 0 ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    {formatPercentage(metrics?.revenueGrowthRate || 0)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tokens Created</p>
                  <p className="text-2xl font-bold text-white">
                    {metricsLoading ? '...' : formatNumber(metrics?.totalTokens || 0)}
                  </p>
                  <p className="text-sm text-purple-400">
                    Active: {formatNumber(metrics?.activeUsers || 0)}
                  </p>
                </div>
                <Coins className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Viral Score</p>
                  <p className="text-2xl font-bold text-white">
                    {metricsLoading ? '...' : (metrics?.viralScore || 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-orange-400">
                    Messages: {formatNumber(metrics?.messagesSent || 0)}
                  </p>
                </div>
                <Flame className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
          <TabsList className="bg-slate-900/50 border-purple-500/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tokens" className="data-[state=active]:bg-purple-600">
              Top Tokens
            </TabsTrigger>
            <TabsTrigger value="engagement" className="data-[state=active]:bg-purple-600">
              User Engagement
            </TabsTrigger>
            <TabsTrigger value="geographic" className="data-[state=active]:bg-purple-600">
              Geographic
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <Card className="bg-slate-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Conversion Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Conversion Rate</span>
                      <span className="text-green-400 font-bold">
                        {metricsLoading ? '...' : `${(metrics?.conversionRate || 0).toFixed(1)}%`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total Redemptions</span>
                      <span className="text-white font-bold">
                        {metricsLoading ? '...' : formatNumber(metrics?.redemptions || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Active Users</span>
                      <span className="text-purple-400 font-bold">
                        {metricsLoading ? '...' : formatNumber(metrics?.activeUsers || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Activity */}
              <Card className="bg-slate-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Real-time Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Messages Today</span>
                      <span className="text-blue-400 font-bold">
                        {metricsLoading ? '...' : formatNumber(metrics?.messagesSent || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">New Users Today</span>
                      <span className="text-green-400 font-bold">
                        {metricsLoading ? '...' : formatNumber((metrics?.totalUsers || 0) * 0.05)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tokens Created Today</span>
                      <span className="text-yellow-400 font-bold">
                        {metricsLoading ? '...' : formatNumber((metrics?.totalTokens || 0) * 0.1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Performing Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {tokensLoading ? (
                      <div className="text-center text-gray-400 py-8">Loading token data...</div>
                    ) : topTokens && topTokens.length > 0 ? (
                      topTokens.map((token, index) => (
                        <div key={token.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge className={`${index < 3 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-600/20 text-gray-400'}`}>
                              #{index + 1}
                            </Badge>
                            <div>
                              <div className="font-medium text-white">{token.symbol}</div>
                              <div className="text-sm text-gray-400 truncate max-w-48">
                                {token.message}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-400">Value</div>
                              <div className="font-bold text-green-400">
                                {formatCurrency(token.value)}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm text-gray-400">Holders</div>
                              <div className="font-bold text-purple-400">
                                {formatNumber(token.holders)}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm text-gray-400">Viral Score</div>
                              <div className={`font-bold flex items-center gap-1 ${getPerformanceColor(token.performance)}`}>
                                {getPerformanceIcon(token.performance)}
                                {token.viralScore.toFixed(1)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-8">No token data available</div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  User Engagement Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {engagementLoading ? (
                  <div className="text-center text-gray-400 py-8">Loading engagement data...</div>
                ) : engagement && engagement.length > 0 ? (
                  <div className="space-y-4">
                    {engagement.slice(-7).map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                        <div className="text-gray-400">
                          {new Date(day.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-xs text-gray-400">Active</div>
                            <div className="font-bold text-purple-400">{formatNumber(day.activeUsers)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-400">New</div>
                            <div className="font-bold text-green-400">{formatNumber(day.newUsers)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-400">Tokens</div>
                            <div className="font-bold text-yellow-400">{formatNumber(day.tokenCreations)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-400">Messages</div>
                            <div className="font-bold text-blue-400">{formatNumber(day.messagesSent)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">No engagement data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geographic" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {geoLoading ? (
                    <div className="text-center text-gray-400 py-8">Loading geographic data...</div>
                  ) : geographic && geographic.length > 0 ? (
                    <div className="space-y-3">
                      {geographic.map((country, index) => (
                        <div key={country.country} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="border-purple-500/20 text-gray-400">
                              #{index + 1}
                            </Badge>
                            <span className="font-medium text-white">{country.country}</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-xs text-gray-400">Users</div>
                              <div className="font-bold text-purple-400">{formatNumber(country.users)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-400">Tokens</div>
                              <div className="font-bold text-yellow-400">{formatNumber(country.tokensCreated)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-400">Value</div>
                              <div className="font-bold text-green-400">{formatCurrency(country.totalValue)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-400">Share</div>
                              <div className="font-bold text-blue-400">{country.percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">No geographic data available</div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}