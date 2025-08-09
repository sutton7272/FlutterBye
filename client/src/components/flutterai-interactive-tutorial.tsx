import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { 
  Brain, 
  MessageCircle,
  TrendingUp, 
  Shield, 
  DollarSign,
  Users,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Wallet,
  ChevronRight,
  X,
  Sparkles,
  Zap,
  Star,
  Trophy,
  Target,
  Activity,
  PieChart,
  BarChart3,
  LineChart,
  Gauge,
  AlertTriangle,
  Crown,
  Gem,
  Award
} from 'lucide-react';
import { PieChart as RechartsPie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart as RechartsLine, Line, Area, AreaChart } from 'recharts';

interface DemoCard {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  completed: boolean;
}

interface TutorialState {
  currentDemo: number;
  progress: number;
  isRunning: boolean;
  completedDemos: string[];
  results: Record<string, any>;
  showPopup: boolean;
  currentSlide: number;
  aiThinking: boolean;
  achievements: string[];
  totalScore: number;
  animatingProgress: boolean;
}

interface DemoSlide {
  id: string;
  title: string;
  description: string;
  features: string[];
  demoAction: () => void;
  resultKey: string;
}

export function FlutterAIInteractiveTutorial() {
  const { toast } = useToast();
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    currentDemo: 0,
    progress: 63,
    isRunning: false,
    completedDemos: ["wallet", "content", "market", "security"],
    results: {},
    showPopup: false,
    currentSlide: 0,
    aiThinking: false,
    achievements: ["Demo Explorer", "AI Pioneer"],
    totalScore: 2847,
    animatingProgress: false
  });

  const demoCards: DemoCard[] = [
    {
      id: "wallet",
      title: "Wallet Intelligence",
      subtitle: "AI wallet scoring",
      icon: Wallet,
      color: "from-blue-500 to-cyan-500",
      completed: tutorialState.completedDemos.includes("wallet")
    },
    {
      id: "content",
      title: "Content Engine", 
      subtitle: "Viral optimization",
      icon: MessageCircle,
      color: "from-purple-500 to-pink-500",
      completed: tutorialState.completedDemos.includes("content")
    },
    {
      id: "market",
      title: "Market Intel",
      subtitle: "Price predictions",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      completed: tutorialState.completedDemos.includes("market")
    },
    {
      id: "security",
      title: "Security AI",
      subtitle: "Threat detection",
      icon: Shield,
      color: "from-red-500 to-orange-500",
      completed: tutorialState.completedDemos.includes("security")
    }
  ];

  // Demo slides for popup
  const demoSlides: DemoSlide[] = [
    {
      id: "wallet",
      title: "🧠 Wallet Intelligence Engine",
      description: "Revolutionary AI that instantly analyzes any Solana wallet and reveals hidden patterns, risk levels, trading behaviors, and wealth indicators.",
      features: [
        "AI behavioral scoring (0-1000 scale)",
        "Risk assessment & fraud detection",
        "Trading pattern analysis",
        "Whale activity monitoring",
        "Diamond hands detection"
      ],
      demoAction: () => walletAnalysisMutation.mutate(),
      resultKey: "wallet"
    },
    {
      id: "content",
      title: "✨ Content Optimization Engine",
      description: "GPT-4o powered AI that transforms boring text into viral content with engagement predictions and psychological triggers.",
      features: [
        "Viral content optimization",
        "Engagement prediction",
        "Hashtag recommendations",
        "Psychological trigger analysis",
        "Platform-specific optimization"
      ],
      demoAction: () => contentOptimizationMutation.mutate(),
      resultKey: "content"
    },
    {
      id: "market",
      title: "📈 Market Intelligence AI",
      description: "Crystal ball for crypto that monitors 1000+ data sources to predict price movements before they happen.",
      features: [
        "Real-time sentiment analysis",
        "Whale movement tracking",
        "Price prediction models",
        "Trend forecasting",
        "Early warning signals"
      ],
      demoAction: () => marketIntelligenceMutation.mutate(),
      resultKey: "market"
    },
    {
      id: "security",
      title: "🛡️ Security Threat Detection",
      description: "Digital bodyguard that scans for threats, detects scams, and protects your assets 24/7.",
      features: [
        "Real-time threat detection",
        "Scam identification",
        "Vulnerability scanning",
        "Risk assessment",
        "Security recommendations"
      ],
      demoAction: () => securityScanMutation.mutate(),
      resultKey: "security"
    }
  ];

  // Auto-run demo progression
  useEffect(() => {
    if (tutorialState.isRunning && tutorialState.progress < 100) {
      const interval = setInterval(() => {
        setTutorialState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 1, 100)
        }));
      }, 150);
      return () => clearInterval(interval);
    }
  }, [tutorialState.isRunning, tutorialState.progress]);

  // Enhanced data for visualizations
  const walletPortfolioData = [
    { name: 'SOL', value: 35, color: '#9945FF' },
    { name: 'USDC', value: 28, color: '#2775CA' },
    { name: 'BONK', value: 15, color: '#FF6B35' },
    { name: 'JUP', value: 12, color: '#00D4FF' },
    { name: 'Others', value: 10, color: '#10B981' }
  ];

  const tradingPatternData = [
    { month: 'Jan', profit: 2400, trades: 45 },
    { month: 'Feb', profit: 1398, trades: 52 },
    { month: 'Mar', profit: 9800, trades: 38 },
    { month: 'Apr', profit: 3908, trades: 61 },
    { month: 'May', profit: 4800, trades: 44 },
    { month: 'Jun', profit: 7800, trades: 39 }
  ];

  const marketSentimentData = [
    { time: '9AM', sentiment: 65 },
    { time: '10AM', sentiment: 72 },
    { time: '11AM', sentiment: 68 },
    { time: '12PM', sentiment: 85 },
    { time: '1PM', sentiment: 91 },
    { time: '2PM', sentiment: 87 }
  ];

  // API Mutations with enhanced AI thinking states
  const walletAnalysisMutation = useMutation({
    mutationFn: async () => {
      setTutorialState(prev => ({ ...prev, aiThinking: true }));
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing
      const result = await apiRequest("POST", "/api/flutterai/analyze-wallet", { 
        walletAddress: "DemoWallet1234567890abcdef" 
      });
      return result;
    },
    onSuccess: (data) => {
      setTutorialState(prev => ({
        ...prev,
        aiThinking: false,
        results: {
          ...prev.results,
          wallet: {
            score: data?.intelligenceScore || 847,
            tier: "Premium Elite",
            analysis: "Advanced DeFi yield farming strategies detected with 94.2% success rate",
            riskLevel: "Low-Medium",
            tradingStyle: "Strategic HODLer with tactical swings",
            portfolioBalance: "$127,450",
            weeklyPnL: "+$12,847",
            confidence: 94.2,
            behaviorScore: 892,
            wealthIndicator: "High Net Worth",
            tradingFrequency: "Moderate (3-5 trades/week)"
          }
        },
        achievements: [...prev.achievements, "Wallet Whisperer"],
        totalScore: prev.totalScore + 500
      }));
    },
    onError: () => {
      setTutorialState(prev => ({
        ...prev,
        aiThinking: false,
        results: {
          ...prev.results,
          wallet: { 
            score: 847, 
            tier: "Premium Elite", 
            analysis: "Demo: Advanced trading patterns detected",
            confidence: 94.2
          }
        }
      }));
    }
  });

  const contentOptimizationMutation = useMutation({
    mutationFn: async () => {
      setTutorialState(prev => ({ ...prev, aiThinking: true }));
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await apiRequest("POST", "/api/ai/optimize-content", { 
        content: "Check out this amazing crypto project!" 
      });
      return result;
    },
    onSuccess: (data) => {
      setTutorialState(prev => ({
        ...prev,
        aiThinking: false,
        results: {
          ...prev.results,
          content: {
            original: "Check out this amazing crypto project!",
            optimized: data?.optimizedContent || "🔥 REVOLUTIONARY crypto that's about to EXPLODE! Early access before 1000x gains! 🚀 Don't miss the next Bitcoin! #CryptoGems #DeFi #Web3",
            quality: data?.quality || 96,
            viral: data?.viralScore || 91,
            engagement: 847,
            shareability: 93,
            emotionalImpact: 89,
            psychologyTriggers: ["FOMO", "Social Proof", "Urgency", "Exclusivity"],
            platformOptimization: {
              twitter: 94,
              linkedin: 78,
              telegram: 96,
              discord: 89
            }
          }
        },
        achievements: [...prev.achievements, "Content Alchemist"],
        totalScore: prev.totalScore + 350
      }));
    },
    onError: () => {
      setTutorialState(prev => ({
        ...prev,
        aiThinking: false,
        results: {
          ...prev.results,
          content: { 
            optimized: "Demo: Viral-optimized content", 
            quality: 96, 
            viral: 91,
            engagement: 847
          }
        }
      }));
    }
  });

  const marketIntelligenceMutation = useMutation({
    mutationFn: async () => {
      setTutorialState(prev => ({ ...prev, aiThinking: true }));
      await new Promise(resolve => setTimeout(resolve, 1800));
      const result = await apiRequest("GET", "/api/flutterai/market-intelligence");
      return result;
    },
    onSuccess: (data) => {
      setTutorialState(prev => ({
        ...prev,
        aiThinking: false,
        results: {
          ...prev.results,
          market: {
            trend: "Strong Bullish",
            confidence: 94.7,
            prediction: "+23.4% growth in next 7 days",
            shortTerm: "+8.2% (24h)",
            mediumTerm: "+23.4% (7d)",
            longTerm: "+67.8% (30d)",
            riskLevel: "Medium",
            volumeIncrease: "+342%",
            whaleActivity: "High accumulation detected",
            socialSentiment: 0.87,
            technicalSignals: ["Golden Cross", "RSI Oversold Recovery", "Volume Breakout"],
            keyLevels: {
              support: "$0.142",
              resistance: "$0.189",
              breakout: "$0.205"
            }
          }
        },
        achievements: [...prev.achievements, "Market Prophet"],
        totalScore: prev.totalScore + 420
      }));
    },
    onError: () => {
      setTutorialState(prev => ({
        ...prev,
        aiThinking: false,
        results: {
          ...prev.results,
          market: { 
            trend: "Strong Bullish", 
            confidence: 94.7, 
            prediction: "+23.4% growth expected"
          }
        }
      }));
    }
  });

  const securityScanMutation = useMutation({
    mutationFn: async () => {
      setTutorialState(prev => ({ ...prev, aiThinking: true }));
      await new Promise(resolve => setTimeout(resolve, 2200));
      const result = await apiRequest("GET", "/api/flutterai/security-scan");
      return result;
    },
    onSuccess: (data) => {
      setTutorialState(prev => ({
        ...prev,
        aiThinking: false,
        results: {
          ...prev.results,
          security: {
            status: "Fortress Level Security",
            overallScore: 97.8,
            threats: 0,
            vulnerabilities: 0,
            confidence: 98.4,
            lastScan: "Real-time",
            protectionLevel: "Military Grade",
            features: {
              malwareDetection: 100,
              phishingProtection: 98,
              smartContractAudit: 96,
              privateKeySecurity: 100,
              networkMonitoring: 99
            },
            recommendations: [
              "Enable 2FA for additional security",
              "Regular security audits recommended",
              "Consider multi-sig wallet for large holdings"
            ],
            compliance: ["SOC 2", "ISO 27001", "GDPR Compliant"]
          }
        },
        achievements: [...prev.achievements, "Security Guardian"],
        totalScore: prev.totalScore + 280
      }));
    },
    onError: () => {
      setTutorialState(prev => ({
        ...prev,
        aiThinking: false,
        results: {
          ...prev.results,
          security: { 
            status: "Fortress Level Security", 
            threats: 0, 
            confidence: 98.4,
            overallScore: 97.8
          }
        }
      }));
    }
  });

  const startDemo = () => {
    setTutorialState(prev => ({ 
      ...prev, 
      isRunning: true, 
      progress: 63,
      showPopup: true,
      currentSlide: 0,
      animatingProgress: true
    }));
    
    // Animated progress increase
    setTimeout(() => {
      setTutorialState(prev => ({ ...prev, animatingProgress: false }));
    }, 1000);
    
    // Run first demo with delay for effect
    setTimeout(() => demoSlides[0].demoAction(), 1200);
  };

  const nextSlide = () => {
    const nextIndex = tutorialState.currentSlide + 1;
    if (nextIndex < demoSlides.length) {
      setTutorialState(prev => ({ ...prev, currentSlide: nextIndex }));
      // Trigger the demo for the new slide
      setTimeout(() => demoSlides[nextIndex].demoAction(), 500);
    } else {
      // Demo complete
      setTutorialState(prev => ({ 
        ...prev, 
        showPopup: false, 
        isRunning: false,
        progress: 100
      }));
      toast({
        title: "Demo Complete!",
        description: "You've experienced the full power of FlutterAI intelligence.",
      });
    }
  };

  const resetDemo = () => {
    setTutorialState({
      currentDemo: 0,
      progress: 0,
      isRunning: false,
      completedDemos: [],
      results: {},
      showPopup: false,
      currentSlide: 0,
      aiThinking: false,
      achievements: [],
      totalScore: 0,
      animatingProgress: false
    });
  };

  // Achievement system
  const getAchievementIcon = (achievement: string) => {
    switch (achievement) {
      case "Demo Explorer": return <Star className="w-4 h-4" />;
      case "AI Pioneer": return <Brain className="w-4 h-4" />;
      case "Wallet Whisperer": return <Wallet className="w-4 h-4" />;
      case "Content Alchemist": return <Sparkles className="w-4 h-4" />;
      case "Market Prophet": return <TrendingUp className="w-4 h-4" />;
      case "Security Guardian": return <Shield className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const currentSlideData = demoSlides[tutorialState.currentSlide];
  const currentResult = currentSlideData ? tutorialState.results[currentSlideData.resultKey] : null;

  return (
    <>
      <Card className="electric-frame border-2 border-green-400/50 bg-slate-900/95 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 rounded-lg"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="relative z-10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  FlutterAI: The Future is HERE!
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                4 AI demos
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{tutorialState.totalScore}</span>
                </div>
              </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Revolutionary AI Intelligence Banner */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <h3 className="text-sm font-bold text-pink-400">Experience REVOLUTIONARY AI Intelligence</h3>
              </div>
              <p className="text-xs text-gray-300">
                GPT-4o powered intelligence that transforms blockchain forever with wallet analysis, content optimization, and predictive analytics
              </p>
            </div>

            {/* Demo Cards Grid */}
            <div className="grid grid-cols-2 gap-2">
              {demoCards.map((demo, index) => (
                <Card 
                  key={demo.id}
                  className={`bg-slate-800/80 border-slate-600/50 transition-all duration-300 hover:scale-105 cursor-pointer ${
                    demo.completed ? 'ring-1 ring-green-400/50' : ''
                  }`}
                  onClick={() => {
                    if (demo.id === 'wallet') walletAnalysisMutation.mutate();
                    else if (demo.id === 'content') contentOptimizationMutation.mutate();
                    else if (demo.id === 'market') marketIntelligenceMutation.mutate();
                    else if (demo.id === 'security') securityScanMutation.mutate();
                  }}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${demo.color} relative`}>
                        <demo.icon className="w-3 h-3 text-white" />
                        {demo.completed && (
                          <CheckCircle className="w-2 h-2 text-green-400 absolute -top-0.5 -right-0.5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-semibold text-white">{demo.title}</h4>
                        <p className="text-xs text-gray-400">{demo.subtitle}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress Section with Achievements */}
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-600/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">Progress</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400">{tutorialState.progress}% Complete</span>
                  {tutorialState.animatingProgress && (
                    <Sparkles className="w-3 h-3 text-yellow-400 animate-spin" />
                  )}
                </div>
              </div>
              <Progress value={tutorialState.progress} className="h-2 bg-slate-700">
                <div 
                  className={`h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-1000 ease-out rounded-full ${
                    tutorialState.animatingProgress ? 'animate-pulse' : ''
                  }`}
                  style={{ width: `${tutorialState.progress}%` }}
                />
              </Progress>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">
                  {tutorialState.completedDemos.length} of 4 AI demos completed
                </p>
                <div className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-400 font-bold">
                    Level {Math.floor(tutorialState.totalScore / 1000) + 1}
                  </span>
                </div>
              </div>
              
              {/* Achievements Display */}
              {tutorialState.achievements.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-700">
                  <div className="flex items-center gap-1 mb-2">
                    <Award className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-400">Achievements</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tutorialState.achievements.map((achievement, index) => (
                      <Badge 
                        key={index} 
                        className="bg-yellow-500/20 text-yellow-400 text-xs flex items-center gap-1"
                      >
                        {getAchievementIcon(achievement)}
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results Display */}
            {Object.keys(tutorialState.results).length > 0 && (
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-600/50">
                <h3 className="text-xs font-semibold text-white mb-2">Live Demo Results:</h3>
                <div className="space-y-1 text-xs">
                  {tutorialState.results.wallet && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Wallet Score:</span>
                      <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                        {tutorialState.results.wallet.score}/1000
                      </Badge>
                    </div>
                  )}
                  {tutorialState.results.content && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Content Quality:</span>
                      <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                        {tutorialState.results.content.quality}%
                      </Badge>
                    </div>
                  )}
                  {tutorialState.results.market && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Market Trend:</span>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        {tutorialState.results.market.trend}
                      </Badge>
                    </div>
                  )}
                  {tutorialState.results.security && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Security Status:</span>
                      <Badge className="bg-red-500/20 text-red-400 text-xs">
                        {tutorialState.results.security.status}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button 
              onClick={startDemo}
              disabled={tutorialState.isRunning}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 rounded-lg text-sm"
            >
              <Play className="w-4 h-4 mr-2" />
              {tutorialState.isRunning ? 'Running AI Demo...' : 'Start AI Intelligence Demo'}
            </Button>

            {/* Control Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setTutorialState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                className="text-yellow-400 hover:bg-yellow-400/10 text-xs"
              >
                {tutorialState.isRunning ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                {tutorialState.isRunning ? 'Pause' : 'Resume'}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={resetDemo}
                className="text-gray-400 hover:bg-gray-400/10 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Enhanced Demo Popup Window */}
      <Dialog open={tutorialState.showPopup} onOpenChange={(open) => setTutorialState(prev => ({ ...prev, showPopup: open }))}>
        <DialogContent className="max-w-4xl bg-slate-900 border-2 border-green-400/50 text-white overflow-hidden">
          {/* AI Thinking Overlay */}
          {tutorialState.aiThinking && (
            <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-50">
              <div className="text-center space-y-4">
                <div className="relative">
                  <Brain className="w-12 h-12 text-cyan-400 animate-pulse mx-auto" />
                  <div className="absolute inset-0 animate-ping">
                    <Brain className="w-12 h-12 text-cyan-400/50 mx-auto" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-cyan-400">AI Intelligence Processing...</h3>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-sm text-gray-400">Analyzing patterns, processing data...</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <Brain className="w-6 h-6 text-cyan-400" />
              {currentSlideData?.title}
              <div className="ml-auto flex items-center gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-400">
                  <Trophy className="w-3 h-3 mr-1" />
                  {tutorialState.totalScore} pts
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {currentSlideData && (
            <div className="space-y-6">
              {/* Slide Content */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                <p className="text-gray-300 mb-4">{currentSlideData.description}</p>
                
                <div className="grid grid-cols-1 gap-2">
                  <h4 className="font-semibold text-cyan-400 mb-2">Key Features:</h4>
                  {currentSlideData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Live Results with Visualizations */}
              {currentResult && (
                <div className="space-y-4">
                  {/* Wallet Analysis Results */}
                  {currentSlideData.resultKey === 'wallet' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Main Stats */}
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                        <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Wallet Intelligence Score
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Overall Score:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={(currentResult.score / 1000) * 100} className="w-16 h-2" />
                              <Badge className="bg-cyan-500/20 text-cyan-400 font-bold">
                                {currentResult.score}/1000
                              </Badge>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Tier:</span>
                            <Badge className="bg-purple-500/20 text-purple-400">{currentResult.tier}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk Level:</span>
                            <Badge className="bg-green-500/20 text-green-400">{currentResult.riskLevel}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Portfolio Value:</span>
                            <Badge className="bg-yellow-500/20 text-yellow-400">{currentResult.portfolioBalance}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Portfolio Visualization */}
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                        <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                          <PieChart className="w-4 h-4" />
                          Portfolio Distribution
                        </h4>
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie data={walletPortfolioData} dataKey="value" cx="50%" cy="50%" outerRadius={50}>
                              {walletPortfolioData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </RechartsPie>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content Analysis Results */}
                  {currentSlideData.resultKey === 'content' && (
                    <div className="space-y-4">
                      {/* Before/After Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-400/30">
                          <h4 className="font-semibold text-red-400 mb-2">❌ Before (Original)</h4>
                          <p className="text-sm text-gray-300 italic">"{currentResult.original}"</p>
                          <div className="mt-2 flex gap-2">
                            <Badge className="bg-red-500/20 text-red-400 text-xs">Quality: 45%</Badge>
                            <Badge className="bg-red-500/20 text-red-400 text-xs">Viral: 23%</Badge>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-400/30">
                          <h4 className="font-semibold text-green-400 mb-2">✅ After (AI Optimized)</h4>
                          <p className="text-sm text-gray-300 font-medium">"{currentResult.optimized}"</p>
                          <div className="mt-2 flex gap-2">
                            <Badge className="bg-green-500/20 text-green-400 text-xs">Quality: {currentResult.quality}%</Badge>
                            <Badge className="bg-green-500/20 text-green-400 text-xs">Viral: {currentResult.viral}%</Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Psychology Triggers */}
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                        <h4 className="font-semibold text-pink-400 mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Psychology Triggers Detected
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentResult.psychologyTriggers?.map((trigger: string, index: number) => (
                            <Badge key={index} className="bg-pink-500/20 text-pink-400">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Market Intelligence Results */}
                  {currentSlideData.resultKey === 'market' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                          <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Market Trend
                          </h4>
                          <div className="text-center space-y-2">
                            <div className="text-2xl font-bold text-green-400">{currentResult.trend}</div>
                            <Progress value={currentResult.confidence} className="h-2" />
                            <div className="text-xs text-gray-400">{currentResult.confidence}% Confidence</div>
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                          <h4 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Price Predictions
                          </h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span>24h:</span>
                              <Badge className="bg-green-500/20 text-green-400">{currentResult.shortTerm}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>7d:</span>
                              <Badge className="bg-green-500/20 text-green-400">{currentResult.mediumTerm}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>30d:</span>
                              <Badge className="bg-green-500/20 text-green-400">{currentResult.longTerm}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                          <h4 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Market Activity
                          </h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span>Volume:</span>
                              <Badge className="bg-purple-500/20 text-purple-400">{currentResult.volumeIncrease}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Sentiment:</span>
                              <Badge className="bg-blue-500/20 text-blue-400">{(currentResult.socialSentiment * 100).toFixed(0)}%</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Market Sentiment Chart */}
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                        <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                          <LineChart className="w-4 h-4" />
                          Real-Time Sentiment Analysis
                        </h4>
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketSentimentData}>
                              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                              <YAxis hide />
                              <Area
                                type="monotone"
                                dataKey="sentiment"
                                stroke="#3b82f6"
                                fill="url(#gradient)"
                                strokeWidth={2}
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                </linearGradient>
                              </defs>
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Results */}
                  {currentSlideData.resultKey === 'security' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Security Score Gauge */}
                        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                          <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Security Score
                          </h4>
                          <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-green-400">{currentResult.overallScore}/100</div>
                            <div className="flex justify-center">
                              <Gauge className="w-12 h-12 text-green-400" />
                            </div>
                            <Badge className="bg-green-500/20 text-green-400">{currentResult.status}</Badge>
                          </div>
                        </div>
                        
                        {/* Security Features */}
                        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                          <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Protection Levels
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(currentResult.features || {}).map(([feature, score]) => (
                              <div key={feature} className="flex items-center justify-between text-xs">
                                <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                <div className="flex items-center gap-2">
                                  <Progress value={score as number} className="w-12 h-1" />
                                  <span className="text-green-400 font-bold">{score}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Compliance Badges */}
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                        <h4 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Compliance & Certifications
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentResult.compliance?.map((cert: string, index: number) => (
                            <Badge key={index} className="bg-yellow-500/20 text-yellow-400">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Progress & Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Demo Progress</span>
                    <span className="text-sm text-cyan-400">{tutorialState.currentSlide + 1}/{demoSlides.length}</span>
                  </div>
                  <Progress value={((tutorialState.currentSlide + 1) / demoSlides.length) * 100} className="h-2" />
                </div>
                
                <div className="ml-4">
                  <Button 
                    onClick={nextSlide}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {tutorialState.currentSlide < demoSlides.length - 1 ? (
                      <>
                        Next Demo <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      'Complete Demo'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}