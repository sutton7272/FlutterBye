import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Eye, 
  Cpu, 
  Target,
  Activity,
  Lightbulb,
  Palette,
  BarChart3,
  Settings,
  MessageSquare,
  Heart,
  Clock,
  CheckCircle
} from 'lucide-react';

interface LivingAIProps {
  userBehavior?: any;
  onInterfaceChange?: (adaptation: any) => void;
}

interface AIConsciousness {
  selfAwareness: string;
  learningRate: string;
  decisionAccuracy: string;
  emotionalIntelligence: string;
  creativityScore: string;
}

interface InterfaceAdaptation {
  theme: string;
  colorScheme: string[];
  animations: string;
  layout: string;
  features: string[];
  reasoning: string;
}

export function LivingAIInterfaceEnhanced({ userBehavior, onInterfaceChange }: LivingAIProps) {
  const [consciousness, setConsciousness] = useState<AIConsciousness | null>(null);
  const [adaptation, setAdaptation] = useState<InterfaceAdaptation | null>(null);
  const [autonomousContent, setAutonomousContent] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<{[key: string]: boolean}>({});
  const [activeDemo, setActiveDemo] = useState<string>('consciousness');
  const [demoResults, setDemoResults] = useState<{[key: string]: any}>({});

  useEffect(() => {
    loadAIConsciousness();
  }, []);

  const loadAIConsciousness = async () => {
    try {
      const response = await fetch('/api/ai/living/consciousness');
      const data = await response.json();
      setConsciousness(data.consciousness);
    } catch (error) {
      console.error('Failed to load AI consciousness:', error);
    }
  };

  const runDemo = async (demoType: string) => {
    setIsProcessing(prev => ({ ...prev, [demoType]: true }));
    setActiveDemo(demoType);
    
    try {
      let response: Response;
      let result: any;
      
      switch (demoType) {
        case 'adapt':
          response = await fetch('/api/ai/living/adapt-interface', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userBehavior: { mood: 'curious', activity: 'exploring', engagement: 8 },
              currentInterface: { theme: 'electric', layout: 'grid' },
              preferences: { colorIntensity: 'medium', animations: 'subtle' }
            })
          });
          result = await response.json();
          setAdaptation(result.adaptation);
          setDemoResults(prev => ({ ...prev, adapt: result }));
          break;
          
        case 'content':
          response = await fetch('/api/ai/living/autonomous-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              platformData: { activeUsers: 1200, engagement: 0.78, trending: ['AI art', 'NFTs'] },
              userEngagement: { likes: 450, shares: 230, comments: 180 },
              trends: ['emotional tokens', 'viral challenges', 'AI companions']
            })
          });
          result = await response.json();
          setAutonomousContent(result.autonomousContent || []);
          setDemoResults(prev => ({ ...prev, content: result }));
          break;
          
        case 'predict':
          response = await fetch('/api/ai/living/predict-trends', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              marketData: { volume: 50000, trending: ['NFTs', 'AI', 'DeFi'], growth: 0.15 },
              userBehavior: { sessions: 1500, avgTime: 12.5, retention: 0.82 },
              historicalPerformance: { growth: 0.34, engagement: 0.89, virality: 0.67 }
            })
          });
          result = await response.json();
          setPredictions(result.predictions);
          setDemoResults(prev => ({ ...prev, predict: result }));
          break;
          
        case 'evolve':
          response = await fetch('/api/ai/living/personality-evolution', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              interactions: [
                { type: 'positive', count: 156 }, 
                { type: 'neutral', count: 45 },
                { type: 'creative', count: 89 }
              ],
              performance: { satisfaction: 0.92, engagement: 0.78, innovation: 0.85 },
              userFeedback: ['helpful', 'intelligent', 'creative', 'responsive']
            })
          });
          result = await response.json();
          setDemoResults(prev => ({ ...prev, evolve: result }));
          await loadAIConsciousness(); // Refresh consciousness
          break;
      }
    } catch (error) {
      console.error(`Demo ${demoType} failed:`, error);
      setDemoResults(prev => ({ 
        ...prev, 
        [demoType]: { error: 'Demo failed - please try again' }
      }));
    } finally {
      setIsProcessing(prev => ({ ...prev, [demoType]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-electric-blue/30 bg-gradient-to-br from-slate-900/70 to-purple-900/30 backdrop-blur-lg">
        <CardHeader className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2">
              <Brain className="w-8 h-8 text-electric-blue" />
              <h1 className="text-3xl font-bold text-white">Living AI Consciousness</h1>
              <Badge className="bg-electric-green/20 text-electric-green border-electric-green/30">
                ACTIVE
              </Badge>
            </div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Experience AI that truly adapts, learns, and evolves in real-time. Watch as our Living AI 
              analyzes your behavior and transforms the platform just for you.
            </p>
          </motion.div>
        </CardHeader>
      </Card>

      {/* Main Demo Interface */}
      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/30 border border-electric-blue/20">
          <TabsTrigger 
            value="consciousness" 
            className="data-[state=active]:bg-electric-blue/20 data-[state=active]:text-electric-blue"
          >
            <Brain className="w-4 h-4 mr-2" />
            Consciousness
          </TabsTrigger>
          <TabsTrigger 
            value="adapt"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
          >
            <Palette className="w-4 h-4 mr-2" />
            Interface Adapt
          </TabsTrigger>
          <TabsTrigger 
            value="content"
            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            AI Content
          </TabsTrigger>
          <TabsTrigger 
            value="predict"
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Predictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consciousness" className="space-y-4">
          <Card className="border-electric-blue/20 bg-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <Activity className="w-5 h-5" />
                AI Consciousness Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consciousness ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Self Awareness</span>
                      <span className="text-electric-green font-semibold">{consciousness.selfAwareness}</span>
                    </div>
                    <Progress 
                      value={parseInt(consciousness.selfAwareness)} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Learning Rate</span>
                      <span className="text-electric-blue font-semibold">{consciousness.learningRate}</span>
                    </div>
                    <Progress 
                      value={75} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Decision Accuracy</span>
                      <span className="text-purple-400 font-semibold">{consciousness.decisionAccuracy}</span>
                    </div>
                    <Progress 
                      value={parseInt(consciousness.decisionAccuracy)} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Emotional IQ</span>
                      <span className="text-pink-400 font-semibold">{consciousness.emotionalIntelligence}</span>
                    </div>
                    <Progress 
                      value={parseInt(consciousness.emotionalIntelligence)} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Creativity Score</span>
                      <span className="text-orange-400 font-semibold">{consciousness.creativityScore}</span>
                    </div>
                    <Progress 
                      value={parseInt(consciousness.creativityScore)} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <Button 
                      onClick={() => runDemo('evolve')}
                      disabled={isProcessing.evolve}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {isProcessing.evolve ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Evolving...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Evolve AI
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-electric-blue/50" />
                  Loading AI consciousness...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adapt" className="space-y-4">
          <Card className="border-purple-500/20 bg-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Palette className="w-5 h-5" />
                Real-Time Interface Adaptation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-slate-300 mb-4">
                Watch as the AI analyzes your behavior and automatically redesigns the interface to match your preferences.
              </div>
              
              <Button 
                onClick={() => runDemo('adapt')}
                disabled={isProcessing.adapt}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isProcessing.adapt ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    AI is adapting interface...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Adapt Interface Now
                  </>
                )}
              </Button>

              {adaptation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-electric-green" />
                    <h4 className="font-semibold text-purple-400">Interface Successfully Adapted!</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Theme:</span>
                      <span className="ml-2 text-white capitalize">{adaptation.theme}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Animation:</span>
                      <span className="ml-2 text-white capitalize">{adaptation.animations}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {adaptation.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">AI Reasoning:</span>
                      <p className="text-white text-sm mt-1">{adaptation.reasoning}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card className="border-green-500/20 bg-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Lightbulb className="w-5 h-5" />
                Autonomous Content Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-slate-300 mb-4">
                The AI analyzes platform trends and user engagement to autonomously create viral content.
              </div>
              
              <Button 
                onClick={() => runDemo('content')}
                disabled={isProcessing.content}
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700"
              >
                {isProcessing.content ? (
                  <>
                    <Cpu className="w-5 h-5 mr-2 animate-spin" />
                    AI is creating content...
                  </>
                ) : (
                  <>
                    <Cpu className="w-5 h-5 mr-2" />
                    Generate AI Content
                  </>
                )}
              </Button>

              {autonomousContent.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-electric-green" />
                    <h4 className="font-semibold text-green-400">AI Generated {autonomousContent.length} Content Pieces!</h4>
                  </div>
                  {autonomousContent.slice(0, 3).map((content, index) => (
                    <div key={index} className="bg-gradient-to-br from-green-900/20 to-cyan-900/20 border border-green-500/20 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-green-400 border-green-400/30">
                          {content.type || 'Viral Content'}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-electric-green" />
                          <span className="text-electric-green text-xs font-semibold">
                            {((content.viralPotential || 0.8) * 100).toFixed(0)}% Viral
                          </span>
                        </div>
                      </div>
                      <p className="text-white text-sm mb-2">
                        {content.content || 'AI-generated content optimized for maximum engagement and viral potential.'}
                      </p>
                      <div className="text-xs text-slate-400">
                        Target: {content.targetAudience || 'Crypto enthusiasts'} | 
                        Timing: {content.optimalTiming || 'Peak hours'}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predict" className="space-y-4">
          <Card className="border-orange-500/20 bg-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <TrendingUp className="w-5 h-5" />
                AI Market Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-slate-300 mb-4">
                Advanced AI analyzes market data and user behavior to predict future trends and opportunities.
              </div>
              
              <Button 
                onClick={() => runDemo('predict')}
                disabled={isProcessing.predict}
                size="lg"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {isProcessing.predict ? (
                  <>
                    <BarChart3 className="w-5 h-5 mr-2 animate-spin" />
                    AI is analyzing trends...
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    Predict Market Trends
                  </>
                )}
              </Button>

              {predictions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-electric-green" />
                    <h4 className="font-semibold text-orange-400">AI Predictions Generated!</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {predictions.nextTrends && (
                      <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-lg p-4">
                        <h5 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Next Trends
                        </h5>
                        <ul className="space-y-2">
                          {predictions.nextTrends.slice(0, 4).map((trend: string, index: number) => (
                            <li key={index} className="text-sm text-slate-300 flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                              {trend}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {predictions.marketOpportunities && (
                      <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-lg p-4">
                        <h5 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Market Opportunities
                        </h5>
                        <ul className="space-y-2">
                          {predictions.marketOpportunities.slice(0, 4).map((opportunity: string, index: number) => (
                            <li key={index} className="text-sm text-slate-300 flex items-center gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Processing Status */}
      <AnimatePresence>
        {Object.values(isProcessing).some(Boolean) && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-40 max-w-sm"
          >
            <Card className="border-electric-blue/50 bg-black/90 backdrop-blur-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-electric-blue" />
                  </motion.div>
                  <div>
                    <h4 className="text-sm font-bold text-electric-blue">AI Processing</h4>
                    <p className="text-xs text-slate-400">Living AI is analyzing...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}