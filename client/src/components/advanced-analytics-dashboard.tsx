import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  BarChart3,
  TrendingUp,
  Network,
  Brain,
  Target,
  Globe,
  Zap,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Activity,
  Users,
  DollarSign
} from "lucide-react";

interface WalletFlowVisualization {
  nodes: Array<{
    id: string;
    walletAddress: string;
    socialCreditScore: number;
    riskLevel: string;
    portfolioSize: string;
    connections: number;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    source: string;
    target: string;
    weight: number;
    transactionVolume: number;
    frequency: string;
  }>;
  clusters: Array<{
    id: string;
    name: string;
    wallets: string[];
    characteristics: string[];
    riskProfile: string;
  }>;
}

interface PredictiveIntelligence {
  tokenTrends: Array<{
    tokenSymbol: string;
    currentTrend: 'bullish' | 'bearish' | 'neutral';
    predictionConfidence: number;
    priceMovementForecast: string;
    walletActivityTrend: string;
    volumeProjection: number;
    timeframe: string;
  }>;
  marketSegments: Array<{
    segment: string;
    growth: number;
    opportunities: string[];
    risks: string[];
    recommendedActions: string[];
  }>;
  emergingPatterns: Array<{
    pattern: string;
    significance: number;
    description: string;
    actionableInsights: string[];
  }>;
}

export default function AdvancedAnalyticsDashboard() {
  const [selectedVisualization, setSelectedVisualization] = useState('network');
  const [timeframe, setTimeframe] = useState('24h');

  // Fetch wallet flow visualization
  const { data: flowData, isLoading: flowLoading } = useQuery({
    queryKey: ['/api/flutterai/enterprise/analytics/wallet-flow-visualization'],
    retry: false
  });

  // Fetch predictive intelligence
  const { data: predictiveData, isLoading: predictiveLoading } = useQuery({
    queryKey: ['/api/flutterai/enterprise/analytics/predictive-intelligence'],
    retry: false
  });

  // Fetch advanced segmentation
  const { data: segmentationData, isLoading: segmentationLoading } = useQuery({
    queryKey: ['/api/flutterai/enterprise/analytics/advanced-segmentation'],
    retry: false
  });

  // Fetch competitive intelligence
  const { data: competitiveData, isLoading: competitiveLoading } = useQuery({
    queryKey: ['/api/flutterai/enterprise/analytics/competitive-intelligence'],
    retry: false
  });

  // Fetch ROI optimization
  const { data: roiData, isLoading: roiLoading } = useQuery({
    queryKey: ['/api/flutterai/enterprise/analytics/roi-optimization'],
    retry: false
  });

  const WalletNetworkVisualization = ({ data }: { data: WalletFlowVisualization }) => (
    <div className="relative h-96 bg-slate-800/30 rounded-lg border border-purple-500/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
      
      {/* Network nodes visualization */}
      <div className="relative h-full p-4">
        <div className="grid grid-cols-3 gap-4 h-full">
          {data.clusters.map((cluster, index) => (
            <div key={cluster.id} className="bg-slate-700/40 rounded-lg p-3">
              <div className="text-sm font-medium text-purple-300 mb-2">{cluster.name}</div>
              <div className="text-xs text-slate-400 mb-3">{cluster.wallets.length} wallets</div>
              
              {/* Risk level indicator */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  cluster.riskProfile === 'low' ? 'bg-green-400' :
                  cluster.riskProfile === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <span className="text-xs text-slate-300 capitalize">{cluster.riskProfile} Risk</span>
              </div>
              
              {/* Characteristics */}
              <div className="space-y-1">
                {cluster.characteristics.slice(0, 2).map((char, i) => (
                  <div key={i} className="text-xs text-slate-400 bg-slate-600/30 px-2 py-1 rounded">
                    {char}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Connection lines overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {data.edges.slice(0, 10).map((edge, index) => {
            const startX = Math.random() * 300 + 50;
            const startY = Math.random() * 200 + 50;
            const endX = Math.random() * 300 + 350;
            const endY = Math.random() * 200 + 150;
            
            return (
              <line
                key={index}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="rgba(168, 85, 247, 0.3)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );

  const PredictiveInsightsPanel = ({ data }: { data: PredictiveIntelligence }) => (
    <div className="space-y-6">
      {/* Token Trends */}
      <Card className="bg-slate-700/50 border-purple-500/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Token Trend Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.tokenTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="font-medium text-white">{trend.tokenSymbol}</div>
                  <Badge className={`${
                    trend.currentTrend === 'bullish' ? 'bg-green-500/20 text-green-300' :
                    trend.currentTrend === 'bearish' ? 'bg-red-500/20 text-red-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {trend.currentTrend}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-300">{trend.priceMovementForecast}</div>
                  <div className="text-xs text-slate-400">
                    {Math.round(trend.predictionConfidence * 100)}% confidence
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Segments */}
      <Card className="bg-slate-700/50 border-purple-500/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            Market Segment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.marketSegments.map((segment, index) => (
              <div key={index} className="p-4 bg-slate-600/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">{segment.segment}</h4>
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-green-400" />
                    <span className="text-green-300">{segment.growth}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Opportunities</div>
                    <div className="space-y-1">
                      {segment.opportunities.slice(0, 2).map((opp, i) => (
                        <div key={i} className="text-xs text-slate-300 bg-green-500/10 px-2 py-1 rounded">
                          {opp}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Recommended Actions</div>
                    <div className="space-y-1">
                      {segment.recommendedActions.slice(0, 2).map((action, i) => (
                        <div key={i} className="text-xs text-slate-300 bg-purple-500/10 px-2 py-1 rounded">
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emerging Patterns */}
      <Card className="bg-slate-700/50 border-purple-500/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Emerging Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.emergingPatterns.map((pattern, index) => (
              <div key={index} className="p-3 bg-slate-600/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{pattern.pattern}</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span className="text-xs text-purple-300">
                      {Math.round(pattern.significance * 100)}% significance
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-2">{pattern.description}</p>
                <div className="text-xs text-slate-400">
                  {pattern.actionableInsights.slice(0, 2).join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CompetitiveIntelligencePanel = ({ data }: { data: any }) => (
    <div className="space-y-6">
      {/* Market Position */}
      <Card className="bg-slate-700/50 border-purple-500/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Market Position
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-purple-300">
                  {data.marketPosition.ourMarketShare}%
                </div>
                <div className="text-sm text-slate-400">Our Market Share</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-slate-400 mb-2">Competitive Advantages</div>
                {data.marketPosition.competitiveAdvantages.map((advantage: string, index: number) => (
                  <div key={index} className="text-xs text-green-300 bg-green-500/10 px-2 py-1 rounded">
                    {advantage}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-slate-400 mb-3">Competitor Analysis</div>
              <div className="space-y-3">
                {data.marketPosition.competitorAnalysis.map((comp: any, index: number) => (
                  <div key={index} className="p-3 bg-slate-600/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{comp.competitor}</span>
                      <span className="text-sm text-slate-300">{comp.marketShare}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-slate-400 mb-1">Strengths</div>
                        {comp.strengths.slice(0, 2).map((strength: string, i: number) => (
                          <div key={i} className="text-slate-300 bg-slate-500/20 px-2 py-1 rounded mb-1">
                            {strength}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">Weaknesses</div>
                        {comp.weaknesses.slice(0, 2).map((weakness: string, i: number) => (
                          <div key={i} className="text-slate-300 bg-red-500/10 px-2 py-1 rounded mb-1">
                            {weakness}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Migration */}
      <Card className="bg-slate-700/50 border-purple-500/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            Wallet Migration Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-green-300 mb-3 flex items-center gap-2">
                <ArrowUp className="h-4 w-4" />
                Inflow Analysis
              </div>
              {data.walletMigration.inflow.map((flow: any, index: number) => (
                <div key={index} className="p-3 bg-green-500/10 rounded-lg mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-300">{flow.source}</span>
                    <span className="text-sm text-slate-300">{flow.walletCount} wallets</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Avg. Value: ${flow.averageValue.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-200 mt-1">
                    {flow.reasons.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <div className="text-sm text-red-300 mb-3 flex items-center gap-2">
                <ArrowDown className="h-4 w-4" />
                Outflow Analysis
              </div>
              {data.walletMigration.outflow.map((flow: any, index: number) => (
                <div key={index} className="p-3 bg-red-500/10 rounded-lg mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-red-300">{flow.destination}</span>
                    <span className="text-sm text-slate-300">{flow.walletCount} wallets</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Avg. Value: ${flow.averageValue.toLocaleString()}
                  </div>
                  <div className="text-xs text-red-200 mt-1">
                    {flow.reasons.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ROIOptimizationPanel = ({ data }: { data: any }) => (
    <div className="space-y-6">
      {/* Campaign Performance */}
      <Card className="bg-slate-700/50 border-purple-500/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            Campaign ROI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.campaigns.map((campaign: any, index: number) => (
              <div key={index} className="p-4 bg-slate-600/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white">{campaign.name}</h4>
                    <div className="text-sm text-slate-400">
                      {campaign.targetedWallets.toLocaleString()} wallets targeted
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-300">
                      {campaign.roi.toFixed(1)}x
                    </div>
                    <div className="text-xs text-slate-400">ROI</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-medium text-white">
                      ${campaign.cost.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-white">
                      {campaign.conversions.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">Conversions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-white">
                      ${campaign.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-white">
                      {((campaign.conversions / campaign.targetedWallets) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-400">Conv. Rate</div>
                  </div>
                </div>
                
                <div className="text-xs text-slate-400 mb-2">Optimization Suggestions</div>
                <div className="space-y-1">
                  {campaign.optimizationSuggestions.map((suggestion: string, i: number) => (
                    <div key={i} className="text-xs text-purple-300 bg-purple-500/10 px-2 py-1 rounded">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attribution Analysis */}
      <Card className="bg-slate-700/50 border-purple-500/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Attribution Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-slate-300 mb-3">Channel Performance</div>
            {data.attribution.touchpoints.map((touchpoint: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="font-medium text-white">{touchpoint.channel}</div>
                  <div className="text-sm text-slate-400">
                    ${touchpoint.cost.toLocaleString()} cost
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-purple-300">
                      {Math.round(touchpoint.impact * 100)}% impact
                    </div>
                    <div className="text-xs text-slate-400">
                      {touchpoint.efficiency.toFixed(2)} efficiency
                    </div>
                  </div>
                  <Progress 
                    value={touchpoint.efficiency * 100} 
                    className="w-20 h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (flowLoading || predictiveLoading || segmentationLoading || competitiveLoading || roiLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-slate-300">Loading advanced analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Analytics Dashboard</h2>
          <p className="text-slate-400">Enterprise-grade blockchain intelligence analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
            className="border-purple-500/20 text-purple-300 hover:bg-purple-500/10"
          >
            <Zap className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="network" className="space-y-6">
        <TabsList className="grid grid-cols-5 bg-slate-700/50 border border-purple-500/20">
          <TabsTrigger value="network" className="data-[state=active]:bg-purple-500/20">
            <Network className="h-4 w-4 mr-2" />
            Network Analysis
          </TabsTrigger>
          <TabsTrigger value="predictive" className="data-[state=active]:bg-purple-500/20">
            <Brain className="h-4 w-4 mr-2" />
            Predictive Intelligence
          </TabsTrigger>
          <TabsTrigger value="competitive" className="data-[state=active]:bg-purple-500/20">
            <Globe className="h-4 w-4 mr-2" />
            Competitive Intel
          </TabsTrigger>
          <TabsTrigger value="roi" className="data-[state=active]:bg-purple-500/20">
            <DollarSign className="h-4 w-4 mr-2" />
            ROI Optimization
          </TabsTrigger>
          <TabsTrigger value="segments" className="data-[state=active]:bg-purple-500/20">
            <Users className="h-4 w-4 mr-2" />
            Segmentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="network" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Network className="h-5 w-5 text-purple-400" />
                Real-time Wallet Flow Visualization
              </CardTitle>
              <CardDescription className="text-slate-400">
                Interactive network analysis of wallet relationships and clustering
              </CardDescription>
            </CardHeader>
            <CardContent>
              {flowData?.visualization && (
                <WalletNetworkVisualization data={flowData.visualization} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          {predictiveData?.intelligence && (
            <PredictiveInsightsPanel data={predictiveData.intelligence} />
          )}
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6">
          {competitiveData?.intelligence && (
            <CompetitiveIntelligencePanel data={competitiveData.intelligence} />
          )}
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          {roiData?.optimization && (
            <ROIOptimizationPanel data={roiData.optimization} />
          )}
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                ML-Powered Segmentation Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {segmentationData?.segmentation && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-300">
                        {segmentationData.segmentation.clustering.optimalClusters}
                      </div>
                      <div className="text-sm text-slate-400">Optimal Clusters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-300">
                        {Math.round(segmentationData.segmentation.clustering.confidence * 100)}%
                      </div>
                      <div className="text-sm text-slate-400">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-300">
                        {segmentationData.segmentation.clustering.silhouetteScore.toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-400">Silhouette Score</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {segmentationData.segmentation.segments.map((segment: any, index: number) => (
                      <div key={segment.id} className="p-4 bg-slate-600/30 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-white">{segment.name}</h4>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-purple-500/20 text-purple-300">
                              {segment.walletCount} wallets
                            </Badge>
                            <div className="text-sm text-slate-300">
                              Score: {segment.averageScore}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-xs text-slate-400 mb-2">Characteristics</div>
                            <div className="space-y-1">
                              {segment.characteristics.slice(0, 3).map((char: string, i: number) => (
                                <div key={i} className="text-xs text-slate-300 bg-slate-500/20 px-2 py-1 rounded">
                                  {char}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-2">Marketing Strategy</div>
                            <div className="text-xs text-purple-300 bg-purple-500/10 px-2 py-1 rounded">
                              {segment.recommendedStrategy}
                            </div>
                            <div className="mt-2">
                              <div className="text-xs text-slate-400">Marketing Potential</div>
                              <Progress 
                                value={segment.marketingPotential * 100} 
                                className="h-2 mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}