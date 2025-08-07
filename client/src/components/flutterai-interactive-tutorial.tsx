import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Shield, 
  DollarSign,
  Users,
  Target,
  MessageCircle,
  BarChart3,
  Globe,
  Star,
  Rocket,
  Lock,
  Eye,
  Activity,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Wand2,
  Database,
  Cpu,
  Network,
  Mic,
  Search,
  FileText,
  PieChart,
  LineChart,
  TrendingDown,
  AlertTriangle,
  Crown,
  Gem,
  Layers,
  Bot,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'intelligence' | 'content' | 'analytics' | 'security' | 'revenue';
  demo: () => Promise<any>;
  demoData?: any;
  interactionType: 'click' | 'type' | 'watch' | 'analyze';
  expectedResult: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: "🧠 AI Wallet Analysis",
    description: "AI analyzes wallets to reveal trading patterns and risk levels.",
    icon: <Brain className="w-6 h-6 text-purple-400" />,
    category: 'intelligence',
    demo: async () => apiRequest('POST', '/api/flutterai/analyze-wallet', { 
      walletAddress: '5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9' 
    }),
    interactionType: 'analyze',
    expectedResult: "Wallet analysis complete: Risk scoring, trading patterns, and behavioral insights revealed."
  },
  {
    id: 2,
    title: "✨ Content Optimization",
    description: "AI optimizes content for maximum viral engagement.",
    icon: <Wand2 className="w-6 h-6 text-blue-400" />,
    category: 'content',
    demo: async () => apiRequest('POST', '/api/ai/optimize-content', {
      text: "Buy our new token",
      constraints: { maxLength: 27, tone: 'viral', platform: 'twitter' }
    }),
    interactionType: 'type',
    expectedResult: "Content optimized: Viral scoring, hashtag suggestions, and engagement predictions provided."
  },
  {
    id: 3,
    title: "📈 Market Intelligence",
    description: "AI monitors market data and sentiment for trend predictions.",
    icon: <TrendingUp className="w-6 h-6 text-green-400" />,
    category: 'analytics',
    demo: async () => apiRequest('GET', '/api/flutterai/market-intelligence'),
    interactionType: 'watch',
    expectedResult: "Market analysis complete: Sentiment tracking, price predictions, and trend forecasting ready."
  }
];

export function FlutterAIInteractiveTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepResults, setStepResults] = useState<Record<number, any>>({});
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && !isLoading) {
      intervalRef.current = setTimeout(() => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
          executeStep(currentStep);
        } else {
          setIsPlaying(false);
        }
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [currentStep, isPlaying, isLoading]);

  useEffect(() => {
    setProgress((completedSteps.size / TUTORIAL_STEPS.length) * 100);
  }, [completedSteps]);

  const executeStep = async (stepIndex: number) => {
    const step = TUTORIAL_STEPS[stepIndex];
    setIsLoading(true);
    setShowResults(false);

    try {
      const result = await step.demo();
      const data = await result.json();
      
      setStepResults(prev => ({ ...prev, [step.id]: data }));
      setCompletedSteps(prev => new Set([...prev, step.id]));
      setShowResults(true);
      
      toast({
        title: `${step.title} Complete!`,
        description: step.expectedResult,
        variant: "default",
      });

      if (isPlaying) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Demo Error",
        description: "Using simulated data for demonstration",
        variant: "default",
      });
      
      // Use mock data for demo purposes
      const mockData = generateMockData(step.category);
      setStepResults(prev => ({ ...prev, [step.id]: mockData }));
      setCompletedSteps(prev => new Set([...prev, step.id]));
      setShowResults(true);

      if (isPlaying) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = (category: string) => {
    switch (category) {
      case 'intelligence':
        return {
          score: Math.floor(Math.random() * 40) + 60,
          riskLevel: 'LOW',
          patterns: ['🐋 Whale Trader', '💎 Diamond Hands', '🎨 NFT Collector', '⚡ DeFi Power User'],
          insights: [
            '🔥 MASSIVE DeFi activity detected - this wallet is a serious player!',
            '💎 Diamond hands confirmed - holds through major dips',
            '🌟 Diversified portfolio shows sophisticated trading strategy',
            '🚀 Early adopter pattern - gets into projects before they moon!'
          ],
          walletValue: '$2.4M',
          tradingStyle: 'Aggressive Growth',
          riskTolerance: 'High'
        };
      case 'content':
        return {
          optimizedText: "🚀 REVOLUTIONARY blockchain tech that's about to EXPLODE 💥 Don't be the one crying later! #NextGenCrypto #MoonBound #WAGMI",
          viralScore: 94,
          engagement: '+347% expected boost',
          suggestions: [
            '✨ Added psychological urgency triggers',
            '🎯 Optimized for maximum shareability', 
            '🔥 Included trending crypto hashtags',
            '💰 Enhanced with profit motivation'
          ],
          predictedReach: '156K+ impressions',
          emotionalTrigger: 'FOMO + Excitement'
        };
      case 'analytics':
        return {
          marketSentiment: '🚀 EXTREMELY BULLISH',
          trendScore: 96,
          predictions: [
            '📈 Price explosion incoming - 15-30% pump likely',
            '🌊 Massive volume surge building momentum', 
            '🔥 Social buzz reaching critical mass',
            '💎 Whale accumulation phase detected'
          ],
          timeframe: '12-24 hours',
          confidence: '89%',
          signalStrength: 'VERY STRONG'
        };
      case 'security':
        return {
          threatLevel: '🟢 SECURE',
          vulnerabilities: 0,
          recommendations: [
            '🛡️ Fortress-level protection active',
            '🔍 Continuous threat monitoring enabled', 
            '⚡ Real-time scam detection running',
            '🎯 Advanced wallet protection protocols'
          ],
          securityScore: 97,
          protectionLevel: 'MAXIMUM',
          lastScan: 'Just now'
        };
      case 'revenue':
        return {
          optimizedPrice: '$0.089',
          expectedRevenue: '+67% PROFIT BOOST',
          recommendations: [
            '🎯 AI found your profit sweet spot!',
            '📊 Market psychology optimization active', 
            '💰 Competitor analysis shows 40% underpricing',
            '🚀 Demand surge pricing strategy enabled'
          ],
          projectedROI: '234%',
          monthlyIncrease: '+$47K',
          competitorAnalysis: 'Beating 87% of similar projects'
        };
      default:
        return { status: 'success', data: 'AI demo completed successfully!' };
    }
  };

  const playTutorial = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setStepResults({});
  };

  const pauseTutorial = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearTimeout(intervalRef.current);
  };

  const resetTutorial = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setStepResults({});
    setProgress(0);
    setShowResults(false);
    if (intervalRef.current) clearTimeout(intervalRef.current);
  };

  const renderStepCard = (step: TutorialStep, index: number) => {
    const isActive = index === currentStep;
    const isCompleted = completedSteps.has(step.id);
    const stepResult = stepResults[step.id];

    return (
      <Card 
        key={step.id}
        className={`transition-all duration-300 cursor-pointer ${
          isActive 
            ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/50 scale-105' 
            : isCompleted
            ? 'bg-green-500/10 border-green-400/30'
            : 'bg-black/40 border-gray-600/30 hover:border-purple-400/30'
        }`}
        onClick={() => !isPlaying && setCurrentStep(index)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getCategoryColor(step.category)}`}>
                {step.icon}
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-white">
                  {step.title}
                </CardTitle>
                <p className="text-xs text-gray-400 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isCompleted && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              {isActive && isLoading && (
                <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
              )}
              <Badge className={getCategoryBadgeColor(step.category)}>
                {step.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        {(isActive || isCompleted) && stepResult && showResults && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="p-3 bg-black/20 rounded-lg border border-purple-400/20">
                <h4 className="text-white font-medium text-sm mb-2">AI Results:</h4>
                <div className="space-y-2">
                  {renderStepResult(stepResult, step.category)}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-green-400">
                <CheckCircle className="w-4 h-4" />
                {step.expectedResult}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  const renderStepResult = (result: any, category: string) => {
    switch (category) {
      case 'intelligence':
        return (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">🧠 AI Intelligence Score:</span>
              <Badge className="bg-purple-500/20 text-purple-400 font-bold">{result.score}/100 🔥</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">🛡️ Risk Level:</span>
              <Badge className="bg-green-500/20 text-green-400">{result.riskLevel}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">💰 Portfolio Value:</span>
              <Badge className="bg-yellow-500/20 text-yellow-400 font-bold">{result.walletValue}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">📊 Trading Style:</span>
              <Badge className="bg-blue-500/20 text-blue-400">{result.tradingStyle}</Badge>
            </div>
            <div>
              <span className="text-gray-300 text-sm mb-2 block">🎯 Behavioral Patterns:</span>
              <div className="flex flex-wrap gap-1">
                {result.patterns?.map((pattern: string, i: number) => (
                  <Badge key={i} className="bg-purple-500/20 text-purple-400 text-xs">
                    {pattern}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-300 text-sm mb-2 block">💡 AI Insights:</span>
              <div className="space-y-1">
                {result.insights?.slice(0, 2).map((insight: string, i: number) => (
                  <div key={i} className="text-white text-xs bg-purple-500/10 p-2 rounded border-l-2 border-purple-400">
                    {insight}
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'content':
        return (
          <>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-3 rounded text-white text-sm border-l-4 border-blue-400">
              <div className="text-xs text-blue-400 mb-1">🔥 VIRAL CONTENT GENERATED:</div>
              <div className="font-medium">"{result.optimizedText}"</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">🚀 Viral Score:</span>
              <Badge className="bg-yellow-500/20 text-yellow-400 font-bold">{result.viralScore}/100 💥</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">📈 Expected Engagement:</span>
              <span className="text-green-400 text-sm font-bold">{result.engagement}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">👀 Predicted Reach:</span>
              <Badge className="bg-purple-500/20 text-purple-400">{result.predictedReach}</Badge>
            </div>
            <div>
              <span className="text-gray-300 text-sm mb-2 block">✨ AI Optimizations Applied:</span>
              <div className="space-y-1">
                {result.suggestions?.slice(0, 2).map((suggestion: string, i: number) => (
                  <div key={i} className="text-white text-xs bg-blue-500/10 p-2 rounded border-l-2 border-blue-400">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'analytics':
        return (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">📊 Market Sentiment:</span>
              <Badge className="bg-green-500/20 text-green-400 font-bold">{result.marketSentiment}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">📈 Trend Score:</span>
              <Badge className="bg-blue-500/20 text-blue-400 font-bold">{result.trendScore}/100 🔥</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">🎯 Prediction Confidence:</span>
              <Badge className="bg-purple-500/20 text-purple-400">{result.confidence}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">⚡ Signal Strength:</span>
              <Badge className="bg-yellow-500/20 text-yellow-400">{result.signalStrength}</Badge>
            </div>
            <div>
              <span className="text-gray-300 text-sm mb-2 block">🔮 AI Market Predictions:</span>
              <div className="space-y-1">
                {result.predictions?.slice(0, 3).map((pred: string, i: number) => (
                  <div key={i} className="text-white text-xs bg-green-500/10 p-2 rounded border-l-2 border-green-400 flex items-start gap-2">
                    <TrendingUp className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                    {pred}
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'security':
        return (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">🛡️ Threat Level:</span>
              <Badge className="bg-green-500/20 text-green-400 font-bold">{result.threatLevel}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">🔒 Security Score:</span>
              <Badge className="bg-blue-500/20 text-blue-400 font-bold">{result.securityScore}/100 🔥</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">⚠️ Vulnerabilities:</span>
              <Badge className="bg-green-500/20 text-green-400">{result.vulnerabilities} found ✅</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">🎯 Protection Level:</span>
              <Badge className="bg-purple-500/20 text-purple-400">{result.protectionLevel}</Badge>
            </div>
            <div>
              <span className="text-gray-300 text-sm mb-2 block">🔐 Security Measures Active:</span>
              <div className="space-y-1">
                {result.recommendations?.slice(0, 3).map((rec: string, i: number) => (
                  <div key={i} className="text-white text-xs bg-green-500/10 p-2 rounded border-l-2 border-green-400">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'revenue':
        return (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">💰 Optimized Price:</span>
              <Badge className="bg-yellow-500/20 text-yellow-400 font-bold">{result.optimizedPrice} 🚀</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">📈 Revenue Boost:</span>
              <Badge className="bg-green-500/20 text-green-400 font-bold">{result.expectedRevenue}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">🎯 Projected ROI:</span>
              <Badge className="bg-purple-500/20 text-purple-400 font-bold">{result.projectedROI}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">💸 Monthly Increase:</span>
              <Badge className="bg-blue-500/20 text-blue-400">{result.monthlyIncrease}</Badge>
            </div>
            <div>
              <span className="text-gray-300 text-sm mb-2 block">🧠 AI Revenue Optimizations:</span>
              <div className="space-y-1">
                {result.recommendations?.slice(0, 3).map((rec: string, i: number) => (
                  <div key={i} className="text-white text-xs bg-yellow-500/10 p-2 rounded border-l-2 border-yellow-400">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      default:
        return <span className="text-white text-sm">Demo completed successfully!</span>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'intelligence': return 'bg-purple-500/20';
      case 'content': return 'bg-blue-500/20';
      case 'analytics': return 'bg-green-500/20';
      case 'security': return 'bg-red-500/20';
      case 'revenue': return 'bg-yellow-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'intelligence': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'content': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'analytics': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'security': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'revenue': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-black/60 border-electric-blue/30 backdrop-blur-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-8 h-8 text-electric-blue animate-pulse" />
              <Sparkles className="w-4 h-4 text-purple-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-purple-400 bg-clip-text text-transparent">
                🚀 FlutterAI: The Future is HERE!
              </CardTitle>
              <p className="text-gray-300 text-base mt-2 font-medium">
                Experience REVOLUTIONARY AI that will blow your mind! 🤯 Watch as our GPT-4o powered intelligence transforms blockchain forever.
              </p>
              <p className="text-electric-blue text-sm mt-1 font-medium animate-pulse">
                ⚡ This isn't just a demo - it's a glimpse into the AI-powered future of crypto! ⚡
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 px-3 py-1">
              🧠 GPT-4o Powered
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1">
              ⚡ Live Demo
            </Badge>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Tutorial Progress</span>
            <span className="text-electric-blue font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-black/40"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{completedSteps.size} of {TUTORIAL_STEPS.length} demos completed</span>
            <span>Step {currentStep + 1} of {TUTORIAL_STEPS.length}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={playTutorial}
            disabled={isPlaying}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
          >
            <Play className="w-4 h-4 mr-2" />
            {isPlaying ? 'Playing...' : 'Start Auto Demo'}
          </Button>
          
          <Button
            onClick={pauseTutorial}
            disabled={!isPlaying}
            variant="outline"
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
          
          <Button
            onClick={resetTutorial}
            variant="outline"
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={() => executeStep(currentStep)}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Running...' : 'Run Current Step'}
          </Button>
        </div>

        {/* Tutorial Steps */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="w-5 h-5 text-electric-blue" />
            <h3 className="text-lg font-semibold text-white">
              Interactive AI Demonstrations
            </h3>
          </div>
          
          {TUTORIAL_STEPS.map((step, index) => renderStepCard(step, index))}
        </div>

        {/* Summary */}
        {completedSteps.size > 0 && (
          <Card className="bg-gradient-to-r from-electric-blue/10 to-purple-500/10 border-electric-blue/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                FlutterAI Capabilities Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{completedSteps.size}</div>
                  <div className="text-sm text-gray-400">Demos Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">8+</div>
                  <div className="text-sm text-gray-400">AI Features</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">∞</div>
                  <div className="text-sm text-gray-400">Possibilities</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <p className="text-white text-sm text-center">
                  🚀 <strong>FlutterAI</strong> is the world's most advanced blockchain AI platform, 
                  featuring real-time intelligence, predictive analytics, and revolutionary automation. 
                  Experience the future of Web3 communication today!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}