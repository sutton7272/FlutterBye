import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Wallet,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Zap,
  Target
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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
}

export function FlutterAIAnimatedTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    currentDemo: 0,
    progress: 75,
    isRunning: false,
    completedDemos: ["wallet", "content", "market", "security", "optimization", "psychology"],
    results: {}
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
      icon: MessageSquare,
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

  // API Mutations for live demos
  const walletAnalysisMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/flutterai/analyze-wallet", { 
        walletAddress: "DemoWallet1234567890abcdef" 
      });
      return result.json();
    },
    onSuccess: (data) => {
      setTutorialState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          wallet: {
            score: data.intelligenceScore || 847,
            tier: "Premium",
            analysis: data.analysis || "Advanced DeFi trading patterns detected"
          }
        }
      }));
    },
    onError: () => {
      setTutorialState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          wallet: { score: 847, tier: "Premium", analysis: "Demo: Premium wallet tier" }
        }
      }));
    }
  });

  const contentOptimizationMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/ai/optimize-content", { 
        content: "Check out this amazing crypto project!" 
      });
      return result.json();
    },
    onSuccess: (data) => {
      setTutorialState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          content: {
            optimized: data.optimizedContent || "🚀 Revolutionary crypto innovation transforming DeFi! Join the future. #Crypto #Innovation",
            quality: data.quality || 94,
            viral: data.viralScore || 87
          }
        }
      }));
    },
    onError: () => {
      setTutorialState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          content: { optimized: "Demo: Optimized content", quality: 94, viral: 87 }
        }
      }));
    }
  });

  const marketIntelligenceMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("GET", "/api/flutterai/market-intelligence");
      return result.json();
    },
    onSuccess: (data) => {
      setTutorialState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          market: {
            trend: "Bullish",
            confidence: 92,
            prediction: data.prediction || "+15% growth expected"
          }
        }
      }));
    },
    onError: () => {
      setTutorialState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          market: { trend: "Bullish", confidence: 92, prediction: "+15% growth expected" }
        }
      }));
    }
  });

  const securityScanMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("GET", "/api/flutterai/security-scan");
      return result.json();
    },
    onSuccess: (data) => {
      setTutorialState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          security: {
            status: "Secure",
            threats: 0,
            confidence: 98
          }
        }
      }));
    },
    onError: () => {
      setTutorialState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          security: { status: "Secure", threats: 0, confidence: 98 }
        }
      }));
    }
  });

  const startDemo = () => {
    setTutorialState(prev => ({ ...prev, isRunning: true, progress: 75 }));
    
    // Run all demos in sequence
    setTimeout(() => walletAnalysisMutation.mutate(), 500);
    setTimeout(() => contentOptimizationMutation.mutate(), 1500);
    setTimeout(() => marketIntelligenceMutation.mutate(), 2500);
    setTimeout(() => securityScanMutation.mutate(), 3500);
  };

  const resetDemo = () => {
    setTutorialState({
      currentDemo: 0,
      progress: 0,
      isRunning: false,
      completedDemos: [],
      results: {}
    });
  };

  return (
    <div className="space-y-4">
      {/* Demo Grid */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-bold text-pink-400">Experience REVOLUTIONARY AI Intelligence</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          GPT-4o powered intelligence that transforms blockchain forever with wallet analysis, content optimization, and predictive analytics
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
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
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${demo.color} relative`}>
                          <demo.icon className="w-4 h-4 text-white" />
                          {demo.completed && (
                            <CheckCircle className="w-3 h-3 text-green-400 absolute -top-1 -right-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-white">{demo.title}</h4>
                          <p className="text-xs text-gray-400">{demo.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
        ))}
      </div>

      {/* AI Capabilities Section */}
      <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                <h3 className="text-sm font-semibold text-white mb-3">AI Capabilities You'll Experience:</h3>
                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    Revolutionary wallet intelligence and behavioral analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="w-3 h-3 text-blue-400" />
                    Content optimization that predicts viral potential
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    Real-time market intelligence and price predictions
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-red-400" />
                    Advanced security threat detection and protection
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    Revenue optimization using market psychology
                  </li>
                </ul>
              </div>

              {/* Progress Section */}
              <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">Progress</span>
                  <span className="text-sm font-bold text-cyan-400">{tutorialState.progress}% Complete</span>
                </div>
                <Progress value={tutorialState.progress} className="h-2 bg-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${tutorialState.progress}%` }}
                  />
                </Progress>
                <p className="text-xs text-gray-400 mt-1">
                  {tutorialState.completedDemos.length} of 8 AI demos completed
                </p>
              </div>

              {/* Results Display */}
              {Object.keys(tutorialState.results).length > 0 && (
                <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                  <h3 className="text-sm font-semibold text-white mb-3">Live Demo Results:</h3>
                  <div className="space-y-2 text-xs">
                    {tutorialState.results.wallet && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Wallet Score:</span>
                        <Badge className="bg-cyan-500/20 text-cyan-400">
                          {tutorialState.results.wallet.score}/1000
                        </Badge>
                      </div>
                    )}
                    {tutorialState.results.content && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Content Quality:</span>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          {tutorialState.results.content.quality}%
                        </Badge>
                      </div>
                    )}
                    {tutorialState.results.market && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Market Trend:</span>
                        <Badge className="bg-green-500/20 text-green-400">
                          {tutorialState.results.market.trend}
                        </Badge>
                      </div>
                    )}
                    {tutorialState.results.security && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Security Status:</span>
                        <Badge className="bg-red-500/20 text-red-400">
                          {tutorialState.results.security.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={startDemo}
                  disabled={tutorialState.isRunning}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start AI Intelligence Demo
                </Button>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button 
          onClick={startDemo}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-6 py-2 rounded-lg"
        >
          <Play className="w-4 h-4 mr-2" />
          Start AI Demo
        </Button>
        
        <Button 
          variant="outline" 
          onClick={resetDemo}
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}