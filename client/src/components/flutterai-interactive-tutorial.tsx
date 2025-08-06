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
    title: "Wallet Intelligence Scanning",
    description: "Analyze any Solana wallet with AI-powered scoring and behavioral patterns",
    icon: <Brain className="w-6 h-6 text-purple-400" />,
    category: 'intelligence',
    demo: async () => apiRequest('POST', '/api/flutterai/analyze-wallet', { 
      walletAddress: '5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9' 
    }),
    interactionType: 'analyze',
    expectedResult: "Complete wallet profile with AI scoring, risk assessment, and behavioral insights"
  },
  {
    id: 2,
    title: "Content Optimization Engine",
    description: "Transform basic text into viral, engaging blockchain content",
    icon: <Wand2 className="w-6 h-6 text-blue-400" />,
    category: 'content',
    demo: async () => apiRequest('POST', '/api/ai/optimize-content', {
      text: "Buy our new token",
      constraints: { maxLength: 27, tone: 'viral', platform: 'twitter' }
    }),
    interactionType: 'type',
    expectedResult: "Viral-optimized content with engagement predictions"
  },
  {
    id: 3,
    title: "Real-Time Market Intelligence",
    description: "AI-powered market analysis with predictive insights",
    icon: <TrendingUp className="w-6 h-6 text-green-400" />,
    category: 'analytics',
    demo: async () => apiRequest('GET', '/api/flutterai/market-intelligence'),
    interactionType: 'watch',
    expectedResult: "Live market sentiment, trends, and price predictions"
  },
  {
    id: 4,
    title: "Security Threat Detection",
    description: "Advanced AI security monitoring and threat analysis",
    icon: <Shield className="w-6 h-6 text-red-400" />,
    category: 'security',
    demo: async () => apiRequest('GET', '/api/flutterai/security-scan'),
    interactionType: 'click',
    expectedResult: "Comprehensive security report with threat levels and recommendations"
  },
  {
    id: 5,
    title: "Revenue Optimization AI",
    description: "AI-driven pricing and revenue maximization strategies",
    icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
    category: 'revenue',
    demo: async () => apiRequest('GET', '/api/flutterai/pricing/analytics'),
    interactionType: 'analyze',
    expectedResult: "Dynamic pricing recommendations and revenue projections"
  },
  {
    id: 6,
    title: "Social Intelligence Engine",
    description: "AI analysis of social patterns and viral potential",
    icon: <Users className="w-6 h-6 text-indigo-400" />,
    category: 'intelligence',
    demo: async () => apiRequest('POST', '/api/ai/social-analysis', {
      content: "gm frens, new token launch tomorrow 🚀",
      platform: 'twitter'
    }),
    interactionType: 'type',
    expectedResult: "Viral potential score, audience insights, and optimization suggestions"
  },
  {
    id: 7,
    title: "Predictive Analytics Suite",
    description: "Future trend prediction with quantum-inspired algorithms",
    icon: <Target className="w-6 h-6 text-pink-400" />,
    category: 'analytics',
    demo: async () => apiRequest('GET', '/api/flutterai/predictive-analytics'),
    interactionType: 'watch',
    expectedResult: "Future market predictions and trend forecasts"
  },
  {
    id: 8,
    title: "Conversational AI ARIA",
    description: "Advanced AI companion with emotional intelligence",
    icon: <MessageCircle className="w-6 h-6 text-cyan-400" />,
    category: 'content',
    demo: async () => apiRequest('POST', '/api/ai/aria/chat', {
      message: "Help me create a viral token campaign",
      context: "marketing"
    }),
    interactionType: 'type',
    expectedResult: "Intelligent conversation with actionable marketing strategies"
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
          patterns: ['DeFi Trader', 'HODLer', 'NFT Collector'],
          insights: ['High activity in DeFi protocols', 'Long-term holder behavior', 'Diversified portfolio']
        };
      case 'content':
        return {
          optimizedText: "🚀 Revolutionary blockchain tech that's about to change everything - don't miss out! #NextGenCrypto",
          viralScore: 87,
          engagement: '+250% expected',
          suggestions: ['Add trending hashtags', 'Include call-to-action', 'Optimize timing']
        };
      case 'analytics':
        return {
          marketSentiment: 'BULLISH',
          trendScore: 92,
          predictions: ['Price increase likely', 'Volume surge expected', 'Social buzz growing'],
          timeframe: '24-48 hours'
        };
      case 'security':
        return {
          threatLevel: 'LOW',
          vulnerabilities: 0,
          recommendations: ['Enable 2FA', 'Regular security audits', 'Monitor suspicious activity'],
          securityScore: 94
        };
      case 'revenue':
        return {
          optimizedPrice: '$0.045',
          expectedRevenue: '+34%',
          recommendations: ['Dynamic pricing enabled', 'Peak hour optimization', 'User segmentation'],
          projectedROI: '156%'
        };
      default:
        return { status: 'success', data: 'Demo completed' };
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
              <span className="text-gray-300 text-sm">AI Score:</span>
              <Badge className="bg-purple-500/20 text-purple-400">{result.score}/100</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Risk Level:</span>
              <Badge className="bg-green-500/20 text-green-400">{result.riskLevel}</Badge>
            </div>
            <div>
              <span className="text-gray-300 text-sm">Patterns:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {result.patterns?.map((pattern: string, i: number) => (
                  <Badge key={i} className="bg-blue-500/20 text-blue-400 text-xs">
                    {pattern}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        );
      case 'content':
        return (
          <>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-2 rounded text-white text-sm">
              "{result.optimizedText}"
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Viral Score:</span>
              <Badge className="bg-yellow-500/20 text-yellow-400">{result.viralScore}/100</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Expected Engagement:</span>
              <span className="text-green-400 text-sm font-medium">{result.engagement}</span>
            </div>
          </>
        );
      case 'analytics':
        return (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Market Sentiment:</span>
              <Badge className="bg-green-500/20 text-green-400">{result.marketSentiment}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Trend Score:</span>
              <Badge className="bg-blue-500/20 text-blue-400">{result.trendScore}/100</Badge>
            </div>
            <div>
              <span className="text-gray-300 text-sm">Predictions:</span>
              <ul className="mt-1 space-y-1">
                {result.predictions?.map((pred: string, i: number) => (
                  <li key={i} className="text-white text-xs flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    {pred}
                  </li>
                ))}
              </ul>
            </div>
          </>
        );
      case 'security':
        return (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Threat Level:</span>
              <Badge className="bg-green-500/20 text-green-400">{result.threatLevel}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Security Score:</span>
              <Badge className="bg-blue-500/20 text-blue-400">{result.securityScore}/100</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Vulnerabilities:</span>
              <Badge className="bg-green-500/20 text-green-400">{result.vulnerabilities} found</Badge>
            </div>
          </>
        );
      case 'revenue':
        return (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Optimized Price:</span>
              <Badge className="bg-yellow-500/20 text-yellow-400">{result.optimizedPrice}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Revenue Increase:</span>
              <Badge className="bg-green-500/20 text-green-400">{result.expectedRevenue}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Projected ROI:</span>
              <Badge className="bg-purple-500/20 text-purple-400">{result.projectedROI}</Badge>
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
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-purple-400 bg-clip-text text-transparent">
                FlutterAI Interactive Tutorial
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">
                Experience the world's most advanced blockchain AI in action
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