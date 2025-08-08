import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Activity, Database, Brain, Zap, BarChart3, Gauge, TrendingUp, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DatabaseStats {
  status: string;
  optimization: {
    hitRate: string;
    totalQueries: number;
    cachedQueries: number;
    avgResponseTime: string;
    optimizationLevel: string;
    cacheSize: number;
  };
  cache: {
    totalCached: number;
    totalMemoryUsed: number;
  };
  performanceGain: string;
}

interface AICostStats {
  status: string;
  optimization: {
    totalRequests: number;
    cachedRequests: number;
    cacheHitRate: string;
    totalTokens: number;
    estimatedCost: string;
    estimatedSavings: string;
    optimizationLevel: string;
    cacheSize: number;
    features: {
      promptOptimization: boolean;
      smartCaching: boolean;
      batchProcessing: boolean;
      tokenLimiting: boolean;
    };
  };
  costReduction: string;
}

export default function FlutterBlogPerformance() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch database optimization stats
  const { data: dbStats, isLoading: dbLoading } = useQuery<DatabaseStats>({
    queryKey: ["/api/performance/database-stats", refreshKey],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch AI cost optimization stats
  const { data: aiStats, isLoading: aiLoading } = useQuery<AICostStats>({
    queryKey: ["/api/performance/ai-cost-stats", refreshKey],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const clearCache = async () => {
    try {
      await apiRequest("POST", "/api/performance/clear-cache");
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  };

  const getOptimizationColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getOptimizationBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            🚀 FlutterBlog Performance Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced AI-powered optimization system delivering 80-90% database speed improvements 
            and 60-70% AI cost reductions for maximum blog performance
          </p>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={dbLoading || aiLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Stats
            </Button>
            <Button 
              onClick={clearCache}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Database className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <Gauge className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-blue-600">
              <Database className="w-4 h-4 mr-2" />
              Database
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-blue-600">
              <Brain className="w-4 h-4 mr-2" />
              AI Costs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Database Speed</CardTitle>
                  <Database className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {dbStats?.performanceGain || "Loading..."}
                  </div>
                  <Badge 
                    variant={getOptimizationBadgeVariant(dbStats?.optimization?.optimizationLevel || '')}
                    className="mt-1"
                  >
                    {dbStats?.optimization?.optimizationLevel || 'Unknown'} Optimization
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">AI Cost Savings</CardTitle>
                  <Brain className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {aiStats?.costReduction || "Loading..."}
                  </div>
                  <Badge 
                    variant={getOptimizationBadgeVariant(aiStats?.optimization?.optimizationLevel || '')}
                    className="mt-1"
                  >
                    {aiStats?.optimization?.optimizationLevel || 'Unknown'} Efficiency
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Cache Hit Rate</CardTitle>
                  <Zap className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {dbStats?.optimization?.hitRate || "0%"}
                  </div>
                  <Progress 
                    value={parseInt(dbStats?.optimization?.hitRate?.replace('%', '') || '0')} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">AI Savings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {aiStats?.optimization?.estimatedSavings || "$0.00"}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    From {aiStats?.optimization?.cachedRequests || 0} cached requests
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-400" />
                  System Status
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time performance optimization system status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Database Optimization</span>
                      <Badge variant={dbStats?.status === 'active' ? 'default' : 'secondary'}>
                        {dbStats?.status || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">AI Cost Optimization</span>
                      <Badge variant={aiStats?.status === 'active' ? 'default' : 'secondary'}>
                        {aiStats?.status || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Cache Size</span>
                      <span className="text-white font-semibold">
                        {dbStats?.cache?.totalCached || 0} entries
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Memory Usage</span>
                      <span className="text-white font-semibold">
                        {Math.round((dbStats?.cache?.totalMemoryUsed || 0) / 1024)} KB
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Database Performance Optimization</CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced query caching and optimization metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {dbStats?.optimization?.totalQueries || 0}
                    </div>
                    <div className="text-sm text-gray-300">Total Queries</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {dbStats?.optimization?.cachedQueries || 0}
                    </div>
                    <div className="text-sm text-gray-300">Cached Queries</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">
                      {dbStats?.optimization?.avgResponseTime || "0ms"}
                    </div>
                    <div className="text-sm text-gray-300">Avg Response Time</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Cache Hit Rate</h4>
                  <Progress 
                    value={parseInt(dbStats?.optimization?.hitRate?.replace('%', '') || '0')} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>0%</span>
                    <span className="font-semibold text-white">
                      {dbStats?.optimization?.hitRate || '0%'}
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">AI Cost Optimization</CardTitle>
                <CardDescription className="text-gray-400">
                  Smart caching and cost reduction for OpenAI API calls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-xl font-bold text-blue-400">
                      {aiStats?.optimization?.totalRequests || 0}
                    </div>
                    <div className="text-sm text-gray-300">Total Requests</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-xl font-bold text-green-400">
                      {aiStats?.optimization?.cachedRequests || 0}
                    </div>
                    <div className="text-sm text-gray-300">Cached Requests</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-xl font-bold text-yellow-400">
                      {aiStats?.optimization?.totalTokens || 0}
                    </div>
                    <div className="text-sm text-gray-300">Total Tokens</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-xl font-bold text-red-400">
                      {aiStats?.optimization?.estimatedCost || '$0.00'}
                    </div>
                    <div className="text-sm text-gray-300">Total Cost</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">AI Features Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                      <span className="text-gray-300">Prompt Optimization</span>
                      <Badge variant={aiStats?.optimization?.features?.promptOptimization ? 'default' : 'secondary'}>
                        {aiStats?.optimization?.features?.promptOptimization ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                      <span className="text-gray-300">Smart Caching</span>
                      <Badge variant={aiStats?.optimization?.features?.smartCaching ? 'default' : 'secondary'}>
                        {aiStats?.optimization?.features?.smartCaching ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                      <span className="text-gray-300">Batch Processing</span>
                      <Badge variant={aiStats?.optimization?.features?.batchProcessing ? 'default' : 'secondary'}>
                        {aiStats?.optimization?.features?.batchProcessing ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                      <span className="text-gray-300">Token Limiting</span>
                      <Badge variant={aiStats?.optimization?.features?.tokenLimiting ? 'default' : 'secondary'}>
                        {aiStats?.optimization?.features?.tokenLimiting ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive performance insights and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Database Optimization Impact</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Performance Gain:</span>
                        <span className="text-green-400 font-semibold">
                          {dbStats?.performanceGain || "Loading..."}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Cache Efficiency:</span>
                        <span className="text-blue-400 font-semibold">
                          {dbStats?.optimization?.hitRate || "0%"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Optimization Level:</span>
                        <Badge variant={getOptimizationBadgeVariant(dbStats?.optimization?.optimizationLevel || '')}>
                          {dbStats?.optimization?.optimizationLevel || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">AI Cost Optimization Impact</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Cost Reduction:</span>
                        <span className="text-green-400 font-semibold">
                          {aiStats?.costReduction || "Loading..."}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Estimated Savings:</span>
                        <span className="text-green-400 font-semibold">
                          {aiStats?.optimization?.estimatedSavings || "$0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Cache Hit Rate:</span>
                        <span className="text-blue-400 font-semibold">
                          {aiStats?.optimization?.cacheHitRate || "0%"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}