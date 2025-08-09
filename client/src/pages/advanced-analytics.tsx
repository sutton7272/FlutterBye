import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Activity, Shield, BarChart3, Target, Zap, Brain } from "lucide-react";

interface PortfolioMetrics {
  totalValue: number;
  chainDistribution: Record<string, number>;
  riskScore: number;
  diversificationIndex: number;
  activityLevel: 'low' | 'medium' | 'high' | 'extreme';
  wealthCategory: 'retail' | 'whale' | 'institution';
  trends: {
    valueChange24h: number;
    riskChange7d: number;
    activityChange30d: number;
  };
}

interface WhaleAlert {
  id: string;
  walletAddress: string;
  chain: string;
  alertType: string;
  value: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export default function AdvancedAnalytics() {
  const [walletAddresses, setWalletAddresses] = useState({
    ethereum: "0x742d35Cc6436C0532925a3b8D5c0E3b5B7c4e8d0",
    bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    solana: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    sui: "0x456def789abc012345678901234567890abcdef12",
    xrp: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
  });

  // Portfolio Analytics Query
  const { data: portfolioData, isLoading: portfolioLoading } = useQuery({
    queryKey: ['/api/advanced-analytics/portfolio-analytics', encodeURIComponent(JSON.stringify(walletAddresses))],
    queryFn: () => fetch(`/api/advanced-analytics/portfolio-analytics/${encodeURIComponent(JSON.stringify(walletAddresses))}`).then(r => r.json()),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Whale Alerts Query
  const { data: whaleData, isLoading: whaleLoading } = useQuery({
    queryKey: ['/api/advanced-analytics/whale-alerts'],
    queryFn: () => fetch('/api/advanced-analytics/whale-alerts?chains=all&minValue=100000&timeframe=24h').then(r => r.json()),
    refetchInterval: 60000 // Refresh every minute
  });

  // Market Intelligence Query
  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ['/api/advanced-analytics/market-intelligence'],
    queryFn: () => fetch('/api/advanced-analytics/market-intelligence?timeframe=24h').then(r => r.json()),
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  // Predictive Analytics Query
  const { data: predictiveData, isLoading: predictiveLoading, refetch: refetchPredictive } = useQuery({
    queryKey: ['/api/advanced-analytics/predictive-analysis'],
    queryFn: () => fetch('/api/advanced-analytics/predictive-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddresses, timeframes: ['7d', '30d'] })
    }).then(r => r.json()),
    enabled: false // Only run when manually triggered
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getRiskColor = (risk: number) => {
    if (risk < 25) return 'text-green-500';
    if (risk < 50) return 'text-yellow-500';
    if (risk < 75) return 'text-orange-500';
    return 'text-red-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Advanced Analytics Dashboard 2.0</h1>
          <p className="text-gray-400">Enterprise-grade cross-chain intelligence and predictive analytics</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetchPredictive()}
            disabled={predictiveLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            {predictiveLoading ? 'Analyzing...' : 'AI Prediction'}
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      {portfolioData?.success && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(portfolioData.metrics.totalValue)}
              </div>
              <div className="flex items-center text-xs text-gray-400">
                {portfolioData.metrics.trends.valueChange24h >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                )}
                {formatPercentage(portfolioData.metrics.trends.valueChange24h)} from yesterday
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Risk Score</CardTitle>
              <Shield className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getRiskColor(portfolioData.metrics.riskScore)}`}>
                {portfolioData.metrics.riskScore}/100
              </div>
              <div className="flex items-center text-xs text-gray-400">
                {portfolioData.metrics.trends.riskChange7d >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-red-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
                )}
                {formatPercentage(Math.abs(portfolioData.metrics.trends.riskChange7d))} from last week
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Diversification</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {portfolioData.metrics.diversificationIndex}%
              </div>
              <Progress 
                value={portfolioData.metrics.diversificationIndex} 
                className="mt-2"
              />
              <div className="text-xs text-gray-400 mt-1">
                Across {Object.keys(portfolioData.metrics.chainDistribution).length} chains
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Activity Level</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white capitalize">
                {portfolioData.metrics.activityLevel}
              </div>
              <Badge variant="secondary" className="mt-2">
                {portfolioData.metrics.wealthCategory}
              </Badge>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <Zap className="w-3 h-3 mr-1" />
                {formatPercentage(portfolioData.metrics.trends.activityChange30d)} vs last month
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="portfolio" className="data-[state=active]:bg-blue-600">Portfolio</TabsTrigger>
          <TabsTrigger value="predictions" className="data-[state=active]:bg-blue-600">AI Predictions</TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">Whale Alerts</TabsTrigger>
          <TabsTrigger value="market" className="data-[state=active]:bg-blue-600">Market Intel</TabsTrigger>
        </TabsList>

        {/* Portfolio Analysis Tab */}
        <TabsContent value="portfolio" className="space-y-4">
          {portfolioData?.success && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chain Distribution */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Chain Distribution</CardTitle>
                  <CardDescription className="text-gray-400">
                    Portfolio allocation across supported blockchains
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(portfolioData.metrics.chainDistribution).map(([chain, percentage]) => (
                    <div key={chain} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 capitalize">{chain}</span>
                        <span className="text-white">{percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance Trends</CardTitle>
                  <CardDescription className="text-gray-400">
                    Recent portfolio performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">24h Value Change</span>
                    <span className={`font-bold ${portfolioData.metrics.trends.valueChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercentage(portfolioData.metrics.trends.valueChange24h)}
                    </span>
                  </div>
                  <Separator className="bg-gray-600" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">7d Risk Change</span>
                    <span className={`font-bold ${portfolioData.metrics.trends.riskChange7d <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercentage(portfolioData.metrics.trends.riskChange7d)}
                    </span>
                  </div>
                  <Separator className="bg-gray-600" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">30d Activity Change</span>
                    <span className={`font-bold ${portfolioData.metrics.trends.activityChange30d >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
                      {formatPercentage(portfolioData.metrics.trends.activityChange30d)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* AI Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          {predictiveData?.success ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Risk Forecast */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Risk Forecast</CardTitle>
                  <CardDescription className="text-gray-400">
                    AI-powered risk predictions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Next Week</span>
                      <span className={`font-bold ${getRiskColor(predictiveData.predictions.riskForecast.nextWeek)}`}>
                        {Math.round(predictiveData.predictions.riskForecast.nextWeek)}/100
                      </span>
                    </div>
                    <Progress value={predictiveData.predictions.riskForecast.nextWeek} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Next Month</span>
                      <span className={`font-bold ${getRiskColor(predictiveData.predictions.riskForecast.nextMonth)}`}>
                        {Math.round(predictiveData.predictions.riskForecast.nextMonth)}/100
                      </span>
                    </div>
                    <Progress value={predictiveData.predictions.riskForecast.nextMonth} className="h-2" />
                  </div>
                  <div className="text-xs text-gray-400">
                    Confidence: {Math.round(predictiveData.predictions.riskForecast.confidence * 100)}%
                  </div>
                </CardContent>
              </Card>

              {/* Value Predictions */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Value Predictions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Expected returns and volatility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">7d Expected Return</span>
                    <span className={`font-bold ${predictiveData.predictions.valuePrediction.expectedReturn7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercentage(predictiveData.predictions.valuePrediction.expectedReturn7d)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">30d Expected Return</span>
                    <span className={`font-bold ${predictiveData.predictions.valuePrediction.expectedReturn30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercentage(predictiveData.predictions.valuePrediction.expectedReturn30d)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Volatility Score</span>
                    <span className="font-bold text-yellow-500">
                      {Math.round(predictiveData.predictions.valuePrediction.volatilityScore)}/100
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Behavior Predictions */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Behavior Forecast</CardTitle>
                  <CardDescription className="text-gray-400">
                    Predicted wallet activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {predictiveData.predictions.behaviorPrediction.likelyActions.map((action: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                        {action}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-gray-300">
                    Timeframe: {predictiveData.predictions.behaviorPrediction.timeframe}
                  </div>
                  <div className="text-xs text-gray-400">
                    Confidence: {Math.round(predictiveData.predictions.behaviorPrediction.confidence * 100)}%
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex items-center justify-center h-48">
                <div className="text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400 mb-4">Click "AI Prediction" to generate advanced analytics</p>
                  <Button 
                    onClick={() => refetchPredictive()}
                    disabled={predictiveLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {predictiveLoading ? 'Analyzing...' : 'Generate Predictions'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Whale Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {whaleData?.success && (
            <>
              {/* Alert Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-white">{whaleData.alertSummary.totalAlerts}</div>
                    <div className="text-sm text-gray-400">Total Alerts</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-500">{whaleData.alertSummary.criticalAlerts}</div>
                    <div className="text-sm text-gray-400">Critical Alerts</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-500">
                      {formatCurrency(whaleData.alertSummary.totalValue)}
                    </div>
                    <div className="text-sm text-gray-400">Total Value</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-500">{whaleData.alertSummary.chainsAffected}</div>
                    <div className="text-sm text-gray-400">Chains Affected</div>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts List */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Whale Activities</CardTitle>
                  <CardDescription className="text-gray-400">
                    Real-time monitoring across all {whaleData.monitoringStatus.chainsMonitored} supported chains
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {whaleData.alerts.slice(0, 10).map((alert: WhaleAlert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className={`w-5 h-5 ${
                            alert.severity === 'critical' ? 'text-red-500' :
                            alert.severity === 'high' ? 'text-orange-500' :
                            alert.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                          }`} />
                          <div>
                            <p className="text-white font-medium">{alert.description}</p>
                            <p className="text-sm text-gray-400">
                              {alert.chain} • {new Date(alert.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Market Intelligence Tab */}
        <TabsContent value="market" className="space-y-4">
          {marketData?.success && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cross-Chain Flows */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Cross-Chain Flows</CardTitle>
                  <CardDescription className="text-gray-400">
                    Major capital movements between chains
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {marketData.marketIntelligence.crossChainFlows.slice(0, 5).map((flow: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-700">
                      <div>
                        <p className="text-white font-medium">
                          {flow.sourceChain} → {flow.targetChain}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatCurrency(flow.volume24h)} volume
                        </p>
                      </div>
                      <Badge variant={
                        flow.trend === 'increasing' ? 'default' :
                        flow.trend === 'decreasing' ? 'destructive' : 'secondary'
                      }>
                        {flow.trend}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Market Insights</CardTitle>
                  <CardDescription className="text-gray-400">
                    AI-generated market intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {marketData.insights.map((insight: string, index: number) => (
                    <Alert key={index} className="bg-gray-700 border-gray-600">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-gray-300">
                        {insight}
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>

              {/* Activity Comparison */}
              <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Market Activity Analysis</CardTitle>
                  <CardDescription className="text-gray-400">
                    Institutional vs retail trading patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Institutional Activity</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Volume</span>
                          <span className="text-white">{formatCurrency(marketData.marketIntelligence.institutionalActivity.volume)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Transactions</span>
                          <span className="text-white">{marketData.marketIntelligence.institutionalActivity.transactions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Avg Size</span>
                          <span className="text-white">{formatCurrency(marketData.marketIntelligence.institutionalActivity.averageSize)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Retail Activity</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Volume</span>
                          <span className="text-white">{formatCurrency(marketData.marketIntelligence.retailActivity.volume)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Transactions</span>
                          <span className="text-white">{marketData.marketIntelligence.retailActivity.transactions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Avg Size</span>
                          <span className="text-white">{formatCurrency(marketData.marketIntelligence.retailActivity.averageSize)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}