import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Brain, Zap, Settings } from 'lucide-react';

export default function AIMarketingDashboard() {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState('demo-user');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('flby-premium');
  const [basePrice, setBasePrice] = useState(29.99);

  // Marketing Analytics Dashboard Query
  const marketingDashboardQuery = useQuery({
    queryKey: ['/api/admin/marketing-analytics'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Marketing Insights Query
  const marketingInsightsQuery = useQuery({
    queryKey: ['/api/admin/marketing-insights'],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Site-wide Pricing Query
  const siteWidePricingQuery = useQuery({
    queryKey: ['/api/admin/site-wide-pricing'],
    refetchInterval: 900000, // Refresh every 15 minutes
  });

  // User Behavior Analysis Mutation
  const userBehaviorMutation = useMutation({
    mutationFn: async (data: { userId: string; walletAddress?: string }) => {
      return apiRequest('/api/admin/analyze-user-behavior', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "User Behavior Analyzed",
        description: "Comprehensive behavioral analysis complete",
      });
    }
  });

  // Dynamic Pricing Mutation
  const dynamicPricingMutation = useMutation({
    mutationFn: async (data: { productId: string; basePrice: number }) => {
      return apiRequest('/api/admin/dynamic-pricing', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Dynamic Pricing Generated",
        description: "AI-powered pricing recommendation calculated",
      });
    }
  });

  // Personalized Pricing Mutation
  const personalizedPricingMutation = useMutation({
    mutationFn: async (data: { userId: string; walletAddress?: string }) => {
      return apiRequest('/api/pricing/personalized', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Personalized Pricing Generated",
        description: "User-specific pricing optimization complete",
      });
    }
  });

  // User Activity Factors Mutation
  const activityFactorsMutation = useMutation({
    mutationFn: async (data: { userId: string; walletAddress?: string }) => {
      return apiRequest('/api/admin/user-activity-factors', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Activity Factors Analyzed",
        description: "User activity patterns and pricing factors calculated",
      });
    }
  });

  const handleUserBehaviorAnalysis = () => {
    userBehaviorMutation.mutate({
      userId: selectedUserId,
      walletAddress: selectedWallet || undefined
    });
  };

  const handleDynamicPricing = () => {
    dynamicPricingMutation.mutate({
      productId: selectedProduct,
      basePrice: basePrice
    });
  };

  const handlePersonalizedPricing = () => {
    personalizedPricingMutation.mutate({
      userId: selectedUserId,
      walletAddress: selectedWallet || undefined
    });
  };

  const handleActivityFactors = () => {
    activityFactorsMutation.mutate({
      userId: selectedUserId,
      walletAddress: selectedWallet || undefined
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI Marketing Analytics & Dynamic Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Comprehensive marketing insights from user behavior and wallet analysis with AI-powered dynamic pricing optimization across all products.
          </p>
        </div>

        {/* Dashboard Overview */}
        {marketingDashboardQuery.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{marketingDashboardQuery.data.dashboard.overview.totalUsers}</p>
                    <p className="text-sm text-gray-400">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">${marketingDashboardQuery.data.dashboard.overview.avgRevenuePerUser}</p>
                    <p className="text-sm text-gray-400">Avg Revenue/User</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{Math.round(marketingDashboardQuery.data.dashboard.overview.conversionRate * 100)}%</p>
                    <p className="text-sm text-gray-400">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-8 w-8 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{marketingDashboardQuery.data.dashboard.overview.viralCoefficient.toFixed(1)}x</p>
                    <p className="text-sm text-gray-400">Viral Coefficient</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="segments">User Segments</TabsTrigger>
            <TabsTrigger value="pricing">Dynamic Pricing</TabsTrigger>
            <TabsTrigger value="behavior">User Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Marketing Dashboard */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Segments Overview */}
              {marketingDashboardQuery.data && (
                <Card className="bg-slate-800/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-2xl text-blue-400 flex items-center">
                      <Target className="mr-2" />
                      User Segments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketingDashboardQuery.data.dashboard.userSegments.map((segment: any) => (
                        <div key={segment.id} className="bg-slate-700 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-white">{segment.name}</h4>
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                              {segment.userCount} users
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{segment.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="text-gray-400">Avg Spend</p>
                              <p className="text-green-400 font-semibold">${segment.behavior.avgSpend}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Conversion Rate</p>
                              <p className="text-purple-400 font-semibold">{Math.round(segment.behavior.conversionRate * 100)}%</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Retention</p>
                              <p className="text-blue-400 font-semibold">{Math.round(segment.behavior.retentionRate * 100)}%</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Viral Factor</p>
                              <p className="text-yellow-400 font-semibold">{segment.behavior.viralCoefficient}x</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Behavior Trends */}
              {marketingDashboardQuery.data && (
                <Card className="bg-slate-800/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-2xl text-green-400 flex items-center">
                      <BarChart3 className="mr-2" />
                      Behavior Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketingDashboardQuery.data.dashboard.behaviorTrends.map((trend: any, index: number) => (
                        <div key={index} className="bg-slate-700 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-white">{trend.trend}</h4>
                            <Badge variant="outline" className={`${
                              trend.impact === 'high' ? 'text-red-400 border-red-400' :
                              trend.impact === 'medium' ? 'text-yellow-400 border-yellow-400' :
                              'text-green-400 border-green-400'
                            }`}>
                              {trend.impact} impact
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">{trend.timeframe}</span>
                            <span className="text-green-400 font-semibold">+{trend.growth}%</span>
                          </div>
                          
                          <p className="text-sm text-gray-300">{trend.predictedOutcome}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* User Segments Detail */}
          <TabsContent value="segments">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-400">Detailed User Segmentation Analysis</CardTitle>
                <CardDescription>
                  AI-powered user segments with behavioral clustering and pricing preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {marketingInsightsQuery.data && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketingInsightsQuery.data.insights.userSegments.map((segment: any) => (
                      <div key={segment.id} className="bg-slate-700 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-purple-400 mb-2">{segment.name}</h3>
                        <p className="text-gray-300 text-sm mb-4">{segment.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">User Count</p>
                            <p className="text-lg font-semibold text-white">{segment.userCount}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Characteristics</p>
                            <div className="flex flex-wrap gap-1">
                              {segment.characteristics.map((char: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {char}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Preferred Price Range</p>
                            <p className="text-green-400 font-semibold">
                              ${segment.preferredPricing.priceRange[0]} - ${segment.preferredPricing.priceRange[1]}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Discount Sensitivity</p>
                            <Progress 
                              value={segment.preferredPricing.discountSensitivity * 100} 
                              className="h-2"
                            />
                            <p className="text-xs text-yellow-400 mt-1">
                              {Math.round(segment.preferredPricing.discountSensitivity * 100)}% sensitive
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dynamic Pricing */}
          <TabsContent value="pricing">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pricing Controls */}
              <Card className="bg-slate-800/50 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-yellow-400 flex items-center">
                    <Settings className="mr-2" />
                    Dynamic Pricing Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Product ID</label>
                    <Input
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Enter product ID..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Base Price ($)</label>
                    <Input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Enter base price..."
                    />
                  </div>
                  
                  <Button
                    onClick={handleDynamicPricing}
                    disabled={dynamicPricingMutation.isPending}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    {dynamicPricingMutation.isPending ? 'Calculating...' : 'Generate Dynamic Pricing'}
                  </Button>
                  
                  {dynamicPricingMutation.data && (
                    <div className="bg-slate-700 p-4 rounded-lg mt-4">
                      <h4 className="font-semibold text-yellow-400 mb-2">Pricing Recommendation</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Original Price</p>
                          <p className="text-white font-semibold">${dynamicPricingMutation.data.recommendation.currentPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Recommended Price</p>
                          <p className="text-green-400 font-semibold">${dynamicPricingMutation.data.recommendation.recommendedPrice}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-1">Price Change</p>
                        <p className={`font-semibold ${
                          dynamicPricingMutation.data.recommendation.priceChange > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {dynamicPricingMutation.data.recommendation.priceChange > 0 ? '+' : ''}
                          {dynamicPricingMutation.data.recommendation.priceChange.toFixed(1)}%
                        </p>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-1">Reasoning</p>
                        <div className="space-y-1">
                          {dynamicPricingMutation.data.recommendation.reasoning.map((reason: string, index: number) => (
                            <p key={index} className="text-xs text-gray-300">• {reason}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Site-wide Pricing Overview */}
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-400">Site-wide Pricing Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {siteWidePricingQuery.data && (
                    <div className="space-y-4">
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-400 mb-2">Global Modifiers</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(siteWidePricingQuery.data.pricing.globalModifiers).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                              <p className="text-white font-semibold">{(value as number).toFixed(2)}x</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-400 mb-2">Active Products</h4>
                        <div className="space-y-2">
                          {siteWidePricingQuery.data.pricing.products.slice(0, 6).map((product: any) => (
                            <div key={product.productId} className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">{product.productName}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-400">${product.basePricing.price}</span>
                                <span className="text-green-400 font-semibold">${product.dynamicPricing.currentPrice}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Behavior Analysis */}
          <TabsContent value="behavior">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Analysis Controls */}
              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-400 flex items-center">
                    <Brain className="mr-2" />
                    User Behavior Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                    <Input
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Enter user ID..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Wallet Address (Optional)</label>
                    <Input
                      value={selectedWallet}
                      onChange={(e) => setSelectedWallet(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Enter wallet address..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={handleUserBehaviorAnalysis}
                      disabled={userBehaviorMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {userBehaviorMutation.isPending ? 'Analyzing...' : 'Analyze Behavior'}
                    </Button>
                    
                    <Button
                      onClick={handleActivityFactors}
                      disabled={activityFactorsMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {activityFactorsMutation.isPending ? 'Calculating...' : 'Activity Factors'}
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handlePersonalizedPricing}
                    disabled={personalizedPricingMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {personalizedPricingMutation.isPending ? 'Generating...' : 'Get Personalized Pricing'}
                  </Button>
                </CardContent>
              </Card>

              {/* Analysis Results */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-400">Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User Behavior Results */}
                  {userBehaviorMutation.data && (
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">User Behavior Analysis</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Total Sessions</p>
                          <p className="text-white font-semibold">{userBehaviorMutation.data.behavior.sessionMetrics.totalSessions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Avg Session (min)</p>
                          <p className="text-white font-semibold">{Math.round(userBehaviorMutation.data.behavior.sessionMetrics.avgSessionDuration / 60)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Total Transactions</p>
                          <p className="text-green-400 font-semibold">{userBehaviorMutation.data.behavior.transactionBehavior.totalTransactions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Avg Transaction ($)</p>
                          <p className="text-green-400 font-semibold">${userBehaviorMutation.data.behavior.transactionBehavior.avgTransactionValue.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity Factors Results */}
                  {activityFactorsMutation.data && (
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-400 mb-2">Activity Factors</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-400">Activity Score</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={activityFactorsMutation.data.factors.activityScore} className="flex-1" />
                            <span className="text-white font-semibold">{activityFactorsMutation.data.factors.activityScore}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-400">Engagement Level</p>
                            <Badge variant="outline" className="capitalize">
                              {activityFactorsMutation.data.factors.engagementLevel}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Spending Pattern</p>
                            <Badge variant="outline" className="capitalize">
                              {activityFactorsMutation.data.factors.spendingPattern}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personalized Pricing Results */}
                  {personalizedPricingMutation.data && (
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-2">Personalized Pricing</h4>
                      <div className="space-y-2">
                        {Object.entries(personalizedPricingMutation.data.personalizedPricing.personalizedPrices).slice(0, 3).map(([productId, pricing]: [string, any]) => (
                          <div key={productId} className="flex justify-between items-center">
                            <span className="text-sm text-gray-300 capitalize">{productId.replace(/-/g, ' ')}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-400 line-through">${pricing.originalPrice}</span>
                              <span className="text-green-400 font-semibold">${pricing.personalizedPrice}</span>
                              <Badge variant="outline" className="text-xs text-yellow-400">
                                -{pricing.discount}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights */}
          <TabsContent value="insights">
            <Card className="bg-slate-800/50 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-400">AI Marketing Recommendations</CardTitle>
                <CardDescription>
                  AI-powered actionable insights for marketing optimization and revenue growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                {marketingInsightsQuery.data && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {marketingInsightsQuery.data.insights.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="bg-slate-700 p-6 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-orange-400">{rec.category}</h3>
                          <Badge variant="outline" className={`${
                            rec.priority === 'high' ? 'text-red-400 border-red-400' :
                            rec.priority === 'medium' ? 'text-yellow-400 border-yellow-400' :
                            'text-green-400 border-green-400'
                          }`}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        
                        <p className="text-gray-300 mb-3">{rec.recommendation}</p>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-400">Expected Impact</p>
                            <p className="text-green-400 font-semibold">{rec.expectedImpact}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-400">Implementation</p>
                            <p className="text-gray-300 text-sm">{rec.implementation}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-400">Confidence Score</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={rec.confidenceScore * 100} className="flex-1 h-2" />
                              <span className="text-white text-sm">{Math.round(rec.confidenceScore * 100)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}