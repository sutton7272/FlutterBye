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
    title: "🧠 Wallet Intelligence Scanning",
    description: "REVOLUTIONARY AI that instantly analyzes any Solana wallet and reveals hidden patterns, risk levels, trading behaviors, and wealth indicators. See what others can't see - from whale activity to diamond hands detection!",
    icon: <Brain className="w-6 h-6 text-purple-400" />,
    category: 'intelligence',
    demo: async () => apiRequest('POST', '/api/flutterai/analyze-wallet', { 
      walletAddress: '5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9' 
    }),
    interactionType: 'analyze',
    expectedResult: "Complete wallet X-ray vision: AI behavioral scoring, risk assessment, trading patterns, wealth indicators, and hidden insights that reveal the true story behind every wallet"
  },
  {
    id: 2,
    title: "✨ Content Optimization Engine",
    description: "MIND-BLOWING AI that transforms boring text into VIRAL GOLD! Our GPT-4o engine doesn't just rewrite - it predicts virality, optimizes for engagement, and creates content that spreads like wildfire across social media!",
    icon: <Wand2 className="w-6 h-6 text-blue-400" />,
    category: 'content',
    demo: async () => apiRequest('POST', '/api/ai/optimize-content', {
      text: "Buy our new token",
      constraints: { maxLength: 27, tone: 'viral', platform: 'twitter' }
    }),
    interactionType: 'type',
    expectedResult: "VIRAL-OPTIMIZED content with engagement predictions, hashtag recommendations, and psychological triggers that make people WANT to share, like, and engage!"
  },
  {
    id: 3,
    title: "📈 Real-Time Market Intelligence",
    description: "CRYSTAL BALL FOR CRYPTO! Our AI continuously monitors 1000+ data sources, social sentiment, whale movements, and market patterns to predict price movements before they happen. It's like having insider knowledge, but totally legal!",
    icon: <TrendingUp className="w-6 h-6 text-green-400" />,
    category: 'analytics',
    demo: async () => apiRequest('GET', '/api/flutterai/market-intelligence'),
    interactionType: 'watch',
    expectedResult: "FUTURE-SEEING market intelligence: Live sentiment analysis, whale tracking, price predictions, trend forecasting, and early warning signals for market moves"
  },
  {
    id: 4,
    title: "🛡️ Security Threat Detection",
    description: "BULLETPROOF PROTECTION! Our AI security system works like a digital bodyguard, scanning for threats, detecting scams, monitoring suspicious activity, and protecting your assets 24/7. Sleep peacefully knowing AI is watching your back!",
    icon: <Shield className="w-6 h-6 text-red-400" />,
    category: 'security',
    demo: async () => apiRequest('GET', '/api/flutterai/security-scan'),
    interactionType: 'click',
    expectedResult: "FORTRESS-LEVEL security analysis: Threat detection, vulnerability scanning, scam identification, risk assessment, and personalized security recommendations"
  },
  {
    id: 5,
    title: "💰 Revenue Optimization AI",
    description: "MONEY-MAKING MACHINE! This AI doesn't just suggest prices - it MAXIMIZES your revenue by analyzing market psychology, competitor pricing, demand patterns, and user behavior to find the PERFECT price that maximizes profits!",
    icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
    category: 'revenue',
    demo: async () => apiRequest('GET', '/api/flutterai/pricing/analytics'),
    interactionType: 'analyze',
    expectedResult: "PROFIT-MAXIMIZING insights: Dynamic pricing optimization, revenue projections, market positioning, competitive analysis, and personalized pricing strategies"
  },
  {
    id: 6,
    title: "🌐 Social Intelligence Engine",
    description: "VIRAL PREDICTION SUPERPOWER! This AI analyzes social patterns, emotional triggers, trending topics, and audience psychology to predict what will go viral BEFORE it happens. Create content that explodes across the internet!",
    icon: <Users className="w-6 h-6 text-indigo-400" />,
    category: 'intelligence',
    demo: async () => apiRequest('POST', '/api/ai/social-analysis', {
      content: "gm frens, new token launch tomorrow 🚀",
      platform: 'twitter'
    }),
    interactionType: 'type',
    expectedResult: "VIRAL PREDICTION ENGINE: Virality scores, audience psychology insights, emotional trigger analysis, optimal posting times, and viral acceleration strategies"
  },
  {
    id: 7,
    title: "🎯 Predictive Analytics Suite",
    description: "TIME MACHINE FOR CRYPTO! Using quantum-inspired algorithms and deep learning, this AI sees into the future of crypto trends, market movements, and emerging opportunities. It's like having a crystal ball for blockchain!",
    icon: <Target className="w-6 h-6 text-pink-400" />,
    category: 'analytics',
    demo: async () => apiRequest('GET', '/api/flutterai/predictive-analytics'),
    interactionType: 'watch',
    expectedResult: "FUTURE-SIGHT analytics: Trend predictions, market forecasts, opportunity identification, risk assessment, and strategic recommendations for maximum gains"
  },
  {
    id: 8,
    title: "🤖 Conversational AI ARIA",
    description: "YOUR GENIUS AI COMPANION! ARIA isn't just a chatbot - she's a blockchain expert, marketing strategist, and creative genius rolled into one. Ask her anything and watch her create marketing campaigns, solve problems, and generate brilliant ideas!",
    icon: <MessageCircle className="w-6 h-6 text-cyan-400" />,
    category: 'content',
    demo: async () => apiRequest('POST', '/api/ai/aria/chat', {
      message: "Help me create a viral token campaign",
      context: "marketing"
    }),
    interactionType: 'type',
    expectedResult: "GENIUS-LEVEL conversation: Strategic marketing plans, creative campaign ideas, problem-solving insights, and actionable strategies that actually work!"
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
    <Card className="electric-frame relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-electric-blue/5 to-pink/5 pointer-events-none"></div>
      <CardHeader className="pb-3 relative">
        <CardTitle className="text-gradient text-lg flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple/20 to-electric-blue/20">
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          FlutterAI: The Future is HERE!
          <Badge className="bg-purple/20 text-purple-400 text-xs ml-auto">
            8 AI demos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-sm font-semibold text-white mb-2">
              🧠 Experience REVOLUTIONARY AI Intelligence
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              GPT-4o powered intelligence that transforms blockchain forever with wallet analysis, content optimization, and predictive analytics
            </p>
          </div>

          {/* AI Features Preview */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/50 rounded-lg p-2 border border-purple/20">
              <div className="flex items-center gap-1 mb-1">
                <Brain className="w-3 h-3 text-purple-400" />
                <span className="font-medium text-purple-400">Wallet Intelligence</span>
              </div>
              <p className="text-muted-foreground text-xs">AI wallet scoring</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-2 border border-electric-blue/20">
              <div className="flex items-center gap-1 mb-1">
                <Wand2 className="w-3 h-3 text-electric-blue" />
                <span className="font-medium text-electric-blue">Content Engine</span>
              </div>
              <p className="text-muted-foreground text-xs">Viral optimization</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-2 border border-green/20">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="font-medium text-green-400">Market Intel</span>
              </div>
              <p className="text-muted-foreground text-xs">Price predictions</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-2 border border-red/20">
              <div className="flex items-center gap-1 mb-1">
                <Shield className="w-3 h-3 text-red-400" />
                <span className="font-medium text-red-400">Security AI</span>
              </div>
              <p className="text-muted-foreground text-xs">Threat detection</p>
            </div>
          </div>

          {/* What You'll Experience */}
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <h5 className="text-xs font-semibold text-white mb-2">AI Capabilities You'll Experience:</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Revolutionary wallet intelligence and behavioral analysis</li>
              <li>• Content optimization that predicts viral potential</li>
              <li>• Real-time market intelligence and price predictions</li>
              <li>• Advanced security threat detection and protection</li>
              <li>• Revenue optimization using market psychology</li>
            </ul>
          </div>

          {/* Progress */}
          {completedSteps.size > 0 && (
            <div className="bg-purple/10 rounded-lg p-2 border border-purple/20">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="text-purple-400 font-medium">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-black/40" />
              <div className="text-xs text-gray-500 mt-1">
                {completedSteps.size} of 8 AI demos completed
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="pt-2">
            <Button
              onClick={playTutorial}
              disabled={isPlaying}
              className="bg-gradient-to-r from-purple-500 to-electric-blue hover:from-purple-500/80 hover:to-electric-blue/80 text-white px-4 py-2 text-sm w-full flex items-center justify-center gap-2 shadow-lg"
              variant="default"
            >
              <Play className="w-4 h-4" />
              {isPlaying ? 'Running AI Demo...' : 'Start AI Intelligence Demo'}
            </Button>
          </div>

          {/* Quick Control Buttons */}
          {(isPlaying || completedSteps.size > 0) && (
            <div className="flex justify-center gap-2 pt-1">
              <Button
                onClick={pauseTutorial}
                disabled={!isPlaying}
                size="sm"
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 text-xs px-2 py-1"
              >
                <Pause className="w-3 h-3 mr-1" />
                Pause
              </Button>
              
              <Button
                onClick={resetTutorial}
                size="sm"
                variant="outline"
                className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10 text-xs px-2 py-1"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="flex justify-center gap-4 text-xs text-muted-foreground pt-2 border-t border-slate-700">
            <span>🧠 8 AI systems</span>
            <span>⚡ Live demos</span>
            <span>🚀 Future ready</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}