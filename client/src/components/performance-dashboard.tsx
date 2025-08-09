// Performance Dashboard Component
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Zap, 
  Database, 
  Globe, 
  Cpu, 
  Clock, 
  TrendingUp, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';

function PerformanceDashboard() {
  const {
    metrics,
    calculatePerformanceScore,
    getPerformanceRecommendations,
    clearCache,
    performanceStats
  } = usePerformanceOptimization();

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 0,
    activeConnections: 0
  });

  // Simulate real-time metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics({
        cpuUsage: Math.random() * 30 + 20, // 20-50%
        memoryUsage: Math.random() * 40 + 30, // 30-70%
        networkLatency: Math.random() * 50 + 10, // 10-60ms
        activeConnections: Math.floor(Math.random() * 20) + 5 // 5-25
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Fetch performance data
  const { data: serverStats, refetch } = useQuery({
    queryKey: ['/api/performance/comprehensive-stats'],
    queryFn: async () => {
      const response = await fetch('/api/performance/comprehensive-stats');
      if (!response.ok) throw new Error('Failed to fetch performance stats');
      return response.json();
    },
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const performanceScore = calculatePerformanceScore();
  const recommendations = getPerformanceRecommendations();

  // Performance chart data
  const performanceChartData = [
    { name: 'Page Load', time: metrics.pageLoadTime, target: 2000, status: metrics.pageLoadTime < 2000 ? 'good' : 'needs-improvement' },
    { name: 'API Response', time: metrics.apiResponseTime, target: 500, status: metrics.apiResponseTime < 500 ? 'good' : 'needs-improvement' },
    { name: 'Render Time', time: metrics.renderTime, target: 50, status: metrics.renderTime < 50 ? 'good' : 'needs-improvement' },
    { name: 'Network', time: realTimeMetrics.networkLatency, target: 100, status: realTimeMetrics.networkLatency < 100 ? 'good' : 'needs-improvement' }
  ];

  // AI Performance data
  const aiPerformanceData = serverStats?.ai ? [
    { name: 'Cache Hit Rate', value: serverStats.ai.cacheStats.hitRate, target: 80 },
    { name: 'Cache Size', value: serverStats.ai.cacheStats.cacheSize, target: 100 },
    { name: 'Pending Requests', value: serverStats.ai.cacheStats.pendingRequests, target: 5 }
  ] : [];

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-green-600 text-white">Excellent</Badge>;
      case 'needs-improvement':
        return <Badge className="bg-yellow-600 text-white">Needs Improvement</Badge>;
      default:
        return <Badge className="bg-red-600 text-white">Poor</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-black via-gray-900 to-blue-900 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Zap className="h-10 w-10 text-yellow-400" />
          <h1 className="text-4xl font-bold text-white">Performance Dashboard</h1>
          <Activity className="h-10 w-10 text-green-400" />
        </div>
        <p className="text-gray-300">Real-time performance monitoring and optimization</p>
      </div>

      {/* Performance Score */}
      <Card className="bg-black/40 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Overall Performance Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Progress value={performanceScore} className="h-6" />
            </div>
            <div className={`text-3xl font-bold ${getPerformanceColor(performanceScore)}`}>
              {performanceScore}/100
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            {performanceScore >= 90 ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            )}
            <span className="text-gray-300">
              {performanceScore >= 90 ? 'Excellent performance!' : 'Room for improvement'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{realTimeMetrics.cpuUsage.toFixed(1)}%</div>
            <Progress value={realTimeMetrics.cpuUsage} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{realTimeMetrics.memoryUsage.toFixed(1)}%</div>
            <Progress value={realTimeMetrics.memoryUsage} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Network Latency</CardTitle>
            <Globe className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{realTimeMetrics.networkLatency.toFixed(0)}ms</div>
            <p className="text-xs text-gray-500">Average response time</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-orange-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Connections</CardTitle>
            <Activity className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{realTimeMetrics.activeConnections}</div>
            <p className="text-xs text-gray-500">Real-time connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 bg-black/40">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-green-600">Metrics</TabsTrigger>
          <TabsTrigger value="ai-performance" className="data-[state=active]:bg-purple-600">AI Performance</TabsTrigger>
          <TabsTrigger value="optimization" className="data-[state=active]:bg-yellow-600">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Metrics Chart */}
          <Card className="bg-black/40 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance Metrics</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Response times across different components</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                  <YAxis tick={{ fill: '#9CA3AF' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="time" fill="#3B82F6" />
                  <Bar dataKey="target" fill="#10B981" opacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Status */}
          <Card className="bg-black/40 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Performance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceChartData.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{metric.name}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">{metric.time.toFixed(0)}ms</span>
                      {getStatusBadge(metric.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          {/* Real-time Performance Chart */}
          <Card className="bg-black/40 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Real-time Performance Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                <Activity className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-lg">Real-time metrics visualization</p>
                <p className="text-sm">Live performance tracking and trend analysis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-performance" className="space-y-6">
          {/* AI Performance Metrics */}
          <Card className="bg-black/40 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Cpu className="h-5 w-5" />
                <span>AI Performance Metrics</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                AI optimization and caching performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiPerformanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={aiPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="value" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Cpu className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <p>Loading AI performance data...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Cache Stats */}
          {serverStats?.ai && (
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">AI Cache Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{serverStats.ai.cacheStats.hitRate}%</div>
                    <p className="text-sm text-gray-400">Cache Hit Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{serverStats.ai.cacheStats.cacheSize}</div>
                    <p className="text-sm text-gray-400">Cached Responses</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{serverStats.ai.cacheStats.pendingRequests}</div>
                    <p className="text-sm text-gray-400">Pending Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Optimization Actions */}
          <Card className="bg-black/40 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Performance Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Button 
                  onClick={() => clearCache()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
                <Button 
                  onClick={() => refetch()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Refresh Stats
                </Button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Performance Recommendations</h3>
                <div className="space-y-2">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PerformanceDashboard;