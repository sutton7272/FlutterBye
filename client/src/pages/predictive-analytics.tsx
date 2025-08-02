import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Brain, Target, Zap, AlertTriangle, Eye, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MarketPrediction {
  timestamp: string;
  predictedPrice: number;
  confidence: number;
  volatility: number;
  volume: number;
  sentiment: number;
}

interface TrendAnalysis {
  direction: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  timeframe: string;
  catalysts: string[];
  resistance: number;
  support: number;
}

interface AIInsight {
  type: 'opportunity' | 'warning' | 'trend' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}

export default function PredictiveAnalytics() {
  const [marketData, setMarketData] = useState<MarketPrediction[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Simulate real-time data updates
  useEffect(() => {
    const generateMarketData = () => {
      const data: MarketPrediction[] = [];
      const basePrice = 0.15;
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
        const volatility = Math.random() * 0.3 + 0.1;
        const sentiment = Math.random() * 100;
        
        data.push({
          timestamp: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          predictedPrice: basePrice + (Math.random() - 0.5) * 0.05,
          confidence: 70 + Math.random() * 25,
          volatility: volatility * 100,
          volume: Math.random() * 1000000,
          sentiment
        });
      }
      
      setMarketData(data);
    };

    const generateTrendAnalysis = () => {
      const trends: TrendAnalysis = {
        direction: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)] as any,
        strength: Math.random() * 100,
        timeframe: '4-6 hours',
        catalysts: [
          'Increased social media mentions',
          'Major wallet accumulation detected',
          'Cross-chain bridge volume surge',
          'Institutional FOMO indicators'
        ],
        resistance: 0.18,
        support: 0.12
      };
      
      setTrendAnalysis(trends);
    };

    const generateAIInsights = () => {
      const insights: AIInsight[] = [
        {
          type: 'opportunity',
          title: 'Accumulation Zone Detected',
          description: 'Large wallets are accumulating FLBY tokens at current price levels. Historical patterns suggest 40% upside potential within 48 hours.',
          confidence: 87,
          impact: 'high',
          timeframe: '48h'
        },
        {
          type: 'trend',
          title: 'Viral Coefficient Increasing',
          description: 'Social sharing velocity has increased 340% in the last 6 hours. Token creation rate correlates with viral adoption phases.',
          confidence: 94,
          impact: 'medium',
          timeframe: '12h'
        },
        {
          type: 'warning',
          title: 'Whale Activity Alert',
          description: 'Single wallet holds 12% of circulating supply. Monitor for potential large sell orders that could impact price stability.',
          confidence: 78,
          impact: 'medium',
          timeframe: 'ongoing'
        },
        {
          type: 'anomaly',
          title: 'Cross-Chain Bridge Surge',
          description: 'Ethereum → Solana bridge volume up 890%. This typically precedes major price movements within 24-48 hours.',
          confidence: 91,
          impact: 'high',
          timeframe: '24-48h'
        }
      ];
      
      setAiInsights(insights);
    };

    generateMarketData();
    generateTrendAnalysis();
    generateAIInsights();

    // Update data every 30 seconds
    const interval = setInterval(() => {
      generateMarketData();
      generateTrendAnalysis();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const runDeepAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate new insights
    const newInsight: AIInsight = {
      type: 'opportunity',
      title: 'Market Maker Pattern Detected',
      description: 'Advanced algorithms detect accumulation pattern similar to previous 300% rally. Entry zone identified.',
      confidence: 95,
      impact: 'high',
      timeframe: '6-12h'
    };
    
    setAiInsights(prev => [newInsight, ...prev.slice(0, 3)]);
    setIsAnalyzing(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'trend': return <BarChart3 className="w-4 h-4 text-blue-500" />;
      case 'anomaly': return <Eye className="w-4 h-4 text-purple-500" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'trend': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'anomaly': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-electric-blue" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
              Predictive Analytics
            </h1>
            <Target className="w-8 h-8 text-electric-green" />
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            AI-powered market predictions and trend analysis for FLBY token ecosystem
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Price Prediction', value: '$0.187', change: '+24.3%', color: 'text-green-400' },
            { label: 'Confidence Score', value: '94%', change: 'High', color: 'text-blue-400' },
            { label: 'Volatility Index', value: '23.4', change: 'Moderate', color: 'text-yellow-400' },
            { label: 'Sentiment Score', value: '78/100', change: 'Bullish', color: 'text-electric-green' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">{metric.label}</div>
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className={`text-sm ${metric.color}`}>{metric.change}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Prediction Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <TrendingUp className="w-5 h-5" />
                Price Prediction Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={['dataMin - 0.01', 'dataMax + 0.01']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="predictedPrice"
                      stroke="#0EA5E9"
                      fill="url(#priceGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-green">
                <BarChart3 className="w-5 h-5" />
                Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendAnalysis && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Market Direction</span>
                    <Badge className={`
                      ${trendAnalysis.direction === 'bullish' ? 'bg-green-100 text-green-800' : ''}
                      ${trendAnalysis.direction === 'bearish' ? 'bg-red-100 text-red-800' : ''}
                      ${trendAnalysis.direction === 'neutral' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {trendAnalysis.direction.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Trend Strength</span>
                      <span className="text-white">{Math.round(trendAnalysis.strength)}%</span>
                    </div>
                    <Progress value={trendAnalysis.strength} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Key Catalysts:</div>
                    <div className="space-y-1">
                      {trendAnalysis.catalysts.slice(0, 3).map((catalyst, index) => (
                        <div key={index} className="text-xs text-gray-400 flex items-center gap-2">
                          <div className="w-1 h-1 bg-electric-blue rounded-full" />
                          {catalyst}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-xs text-gray-400">Support</div>
                      <div className="text-sm font-medium text-green-400">${trendAnalysis.support}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Resistance</div>
                      <div className="text-sm font-medium text-red-400">${trendAnalysis.resistance}</div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-electric-blue">
              <Brain className="w-5 h-5" />
              AI Market Insights
            </CardTitle>
            <Button
              onClick={runDeepAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-electric-blue to-electric-green"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Deep Analysis
                </div>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={`${insight.title}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-700/50 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-white">{insight.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={getInsightColor(insight.type)}>
                              {insight.impact.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-400">{insight.timeframe}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">{insight.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Confidence:</span>
                          <div className="flex-1 max-w-32">
                            <Progress value={insight.confidence} className="h-1" />
                          </div>
                          <span className="text-xs text-white font-medium">{insight.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}