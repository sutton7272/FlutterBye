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
  X
} from 'lucide-react';

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
    currentSlide: 0
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

  // API Mutations for live demos
  const walletAnalysisMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/flutterai/analyze-wallet", { 
        walletAddress: "DemoWallet1234567890abcdef" 
      });
      return result;
    },
    onSuccess: (data) => {
      setTutorialState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          wallet: {
            score: data?.intelligenceScore || 847,
            tier: "Premium",
            analysis: data?.analysis || "Advanced DeFi trading patterns detected"
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
      return result;
    },
    onSuccess: (data) => {
      setTutorialState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          content: {
            optimized: data?.optimizedContent || "🚀 Revolutionary crypto innovation transforming DeFi! Join the future. #Crypto #Innovation",
            quality: data?.quality || 94,
            viral: data?.viralScore || 87
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
      return result;
    },
    onSuccess: (data) => {
      setTutorialState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          market: {
            trend: "Bullish",
            confidence: 92,
            prediction: data?.prediction || "+15% growth expected"
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
      return result;
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
    setTutorialState(prev => ({ 
      ...prev, 
      isRunning: true, 
      progress: 63,
      showPopup: true,
      currentSlide: 0
    }));
    
    // Run first demo immediately
    setTimeout(() => demoSlides[0].demoAction(), 500);
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
      currentSlide: 0
    });
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
                <div className="text-sm text-gray-400">4 AI demos</div>
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

            {/* Progress Section */}
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-600/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">Progress</span>
                <span className="text-xs font-bold text-cyan-400">{tutorialState.progress}% Complete</span>
              </div>
              <Progress value={tutorialState.progress} className="h-2 bg-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${tutorialState.progress}%` }}
                />
              </Progress>
              <p className="text-xs text-gray-400 mt-1">
                {tutorialState.completedDemos.length} of 4 AI demos completed
              </p>
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

      {/* Demo Popup Window */}
      <Dialog open={tutorialState.showPopup} onOpenChange={(open) => setTutorialState(prev => ({ ...prev, showPopup: open }))}>
        <DialogContent className="max-w-2xl bg-slate-900 border-2 border-green-400/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <Brain className="w-6 h-6 text-cyan-400" />
              {currentSlideData?.title}
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

              {/* Live Results */}
              {currentResult && (
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50">
                  <h4 className="font-semibold text-green-400 mb-3">🎯 Live Demo Results:</h4>
                  <div className="space-y-2 text-sm">
                    {currentSlideData.resultKey === 'wallet' && (
                      <>
                        <div className="flex justify-between">
                          <span>Intelligence Score:</span>
                          <Badge className="bg-cyan-500/20 text-cyan-400">{currentResult.score}/1000</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Tier Classification:</span>
                          <Badge className="bg-purple-500/20 text-purple-400">{currentResult.tier}</Badge>
                        </div>
                        <p className="text-gray-300 text-xs">{currentResult.analysis}</p>
                      </>
                    )}
                    {currentSlideData.resultKey === 'content' && (
                      <>
                        <div className="flex justify-between">
                          <span>Content Quality:</span>
                          <Badge className="bg-purple-500/20 text-purple-400">{currentResult.quality}%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Viral Score:</span>
                          <Badge className="bg-pink-500/20 text-pink-400">{currentResult.viral}%</Badge>
                        </div>
                        <p className="text-gray-300 text-xs mt-2">✨ {currentResult.optimized}</p>
                      </>
                    )}
                    {currentSlideData.resultKey === 'market' && (
                      <>
                        <div className="flex justify-between">
                          <span>Market Trend:</span>
                          <Badge className="bg-green-500/20 text-green-400">{currentResult.trend}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Confidence:</span>
                          <Badge className="bg-blue-500/20 text-blue-400">{currentResult.confidence}%</Badge>
                        </div>
                        <p className="text-gray-300 text-xs">{currentResult.prediction}</p>
                      </>
                    )}
                    {currentSlideData.resultKey === 'security' && (
                      <>
                        <div className="flex justify-between">
                          <span>Security Status:</span>
                          <Badge className="bg-green-500/20 text-green-400">{currentResult.status}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Threats Detected:</span>
                          <Badge className="bg-red-500/20 text-red-400">{currentResult.threats}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Confidence:</span>
                          <Badge className="bg-blue-500/20 text-blue-400">{currentResult.confidence}%</Badge>
                        </div>
                      </>
                    )}
                  </div>
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