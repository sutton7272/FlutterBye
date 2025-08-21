import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Play, Loader2, Brain, BarChart3, Target, Shield, TrendingUp, Database, Users, Star, ChevronRight, Trophy, Activity, Zap, Eye, PieChart, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AITourStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'intelligence' | 'scoring' | 'marketing' | 'analytics';
  demo: () => Promise<any>;
  interactionType: 'analyze' | 'scan' | 'process' | 'predict';
  expectedResult: string;
}

const AI_TOUR_STEPS: AITourStep[] = [
  {
    id: 1,
    title: "🧠 Wallet Intelligence Scoring",
    description: "REVOLUTIONARY credit scoring system for crypto wallets! Analyze any wallet with 1-1000 intelligence points, covering trading behavior, portfolio quality, and success patterns across 11+ blockchains including Solana, Sui, XRP, and Kaspa!",
    icon: <Brain className="w-6 h-6 text-electric-blue" />,
    category: 'intelligence',
    demo: async () => ({ 
      walletScore: 847,
      riskLevel: 'Low',
      portfolioHealth: 'Excellent',
      tradingSuccess: '89%',
      blockchainActivity: 'Very Active'
    }),
    interactionType: 'analyze',
    expectedResult: "COMPLETE wallet intelligence: 847/1000 score with detailed behavioral analysis, risk assessment, and success patterns!"
  },
  {
    id: 2,
    title: "📊 Cross-Chain Data Gathering",
    description: "COMPREHENSIVE data collection across 11+ blockchain networks! Real-time scanning of transactions, holdings, DeFi positions, NFT collections, and trading patterns to build the most complete wallet profile in Web3!",
    icon: <Database className="w-6 h-6 text-green-400" />,
    category: 'analytics',
    demo: async () => ({ 
      chainsScanned: 11,
      transactionsAnalyzed: 2847,
      tokensHeld: 156,
      nftCollections: 23,
      defiPositions: 8
    }),
    interactionType: 'scan',
    expectedResult: "MASSIVE data collection: 2,847 transactions across 11 blockchains analyzed for complete wallet intelligence!"
  },
  {
    id: 3,
    title: "🎯 Behavioral Pattern Recognition",
    description: "AI-POWERED analysis that identifies wallet behavior patterns! Detect trading strategies, investment styles, risk appetite, market timing, and success indicators using advanced machine learning algorithms!",
    icon: <Activity className="w-6 h-6 text-purple-400" />,
    category: 'intelligence',
    demo: async () => ({ 
      behaviorType: 'Strategic Holder',
      tradingStyle: 'Conservative Growth',
      riskAppetite: 'Moderate',
      marketTiming: 'Excellent',
      successRate: '76%'
    }),
    interactionType: 'analyze',
    expectedResult: "BEHAVIORAL insights: Strategic holder with conservative growth approach and excellent market timing skills!"
  },
  {
    id: 4,
    title: "💎 Wealth & Portfolio Intelligence",
    description: "PRECISE wealth assessment and portfolio analysis! Track total holdings, asset diversification, investment quality, yield farming positions, and wealth accumulation patterns to understand true financial status!",
    icon: <PieChart className="w-6 h-6 text-yellow-400" />,
    category: 'scoring',
    demo: async () => ({ 
      totalPortfolioValue: '$47,300',
      diversificationScore: 8.4,
      blueChipRatio: '67%',
      yieldFarmingAPY: '12.3%',
      wealthTier: 'High Net Worth'
    }),
    interactionType: 'analyze',
    expectedResult: "WEALTH assessment: $47,300 portfolio with excellent diversification and high-quality asset allocation!"
  },
  {
    id: 5,
    title: "🚀 Viral Marketing Potential",
    description: "PREDICTIVE marketing intelligence that identifies high-value users for viral campaigns! Analyze social influence, network connections, spending power, and viral potential to target the right audiences!",
    icon: <TrendingUp className="w-6 h-6 text-pink-400" />,
    category: 'marketing',
    demo: async () => ({ 
      viralPotential: 'Very High',
      influenceScore: 892,
      networkSize: '2,400+ connections',
      spendingPower: '$12K+ monthly',
      campaignFit: '94% match'
    }),
    interactionType: 'predict',
    expectedResult: "VIRAL marketing goldmine: 892 influence score with $12K+ spending power and 94% campaign compatibility!"
  },
  {
    id: 6,
    title: "📈 Predictive Analytics Engine",
    description: "FUTURE-FOCUSED AI that predicts wallet behavior, investment success, and market movements! Advanced algorithms analyze patterns to forecast portfolio performance and investment opportunities!",
    icon: <Eye className="w-6 h-6 text-cyan-400" />,
    category: 'intelligence',
    demo: async () => ({ 
      portfolioGrowth: '+23% (6 months)',
      successProbability: '78%',
      recommendedTokens: 'SOL, MATIC, AVAX',
      riskWarnings: '2 alerts',
      opportunityScore: 847
    }),
    interactionType: 'predict',
    expectedResult: "FUTURE insights: 78% success probability with +23% projected growth and strategic investment recommendations!"
  },
  {
    id: 7,
    title: "🎪 Targeted Marketing Segments",
    description: "PRECISION targeting system that categorizes wallets into marketing segments! Identify DeFi enthusiasts, NFT collectors, yield farmers, traders, and investors for laser-focused marketing campaigns!",
    icon: <Target className="w-6 h-6 text-orange-400" />,
    category: 'marketing',
    demo: async () => ({ 
      primarySegment: 'DeFi Power User',
      secondarySegments: ['Yield Farmer', 'Governance Voter'],
      marketingValue: 'Premium Tier',
      conversionRate: '34%',
      ltv: '$4,700'
    }),
    interactionType: 'process',
    expectedResult: "PERFECT targeting: DeFi Power User with 34% conversion rate and $4,700 lifetime value potential!"
  },
  {
    id: 8,
    title: "⚡ Real-Time Intelligence Dashboard",
    description: "COMPREHENSIVE command center displaying all wallet intelligence! Live scoring updates, behavioral changes, market opportunities, risk alerts, and actionable insights in one powerful dashboard!",
    icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
    category: 'analytics',
    demo: async () => ({ 
      liveWallets: '12,847 active',
      scoresUpdated: '347 today',
      marketAlerts: '23 opportunities',
      riskWarnings: '5 flagged',
      apiCalls: '156K daily'
    }),
    interactionType: 'process',
    expectedResult: "LIVE intelligence: 12,847 wallets tracked with real-time scoring, market alerts, and 156K daily API interactions!"
  }
];

interface TourState {
  isActive: boolean;
  currentSlide: number;
  showPopup: boolean;
  isLoading: boolean;
  result: any;
  totalScore: number;
}

export function FlutterAIInteractiveDemo() {
  const [tourState, setTourState] = useState<TourState>({
    isActive: false,
    currentSlide: 0,
    showPopup: false,
    isLoading: false,
    result: null,
    totalScore: 0
  });
  
  const { toast } = useToast();

  const startAITour = () => {
    setTourState({
      isActive: true,
      currentSlide: 0,
      showPopup: true,
      isLoading: false,
      result: null,
      totalScore: 0
    });
    
    toast({
      title: "FlutterAI Tour Started!",
      description: "Experience the power of blockchain intelligence"
    });
  };

  const closeDemo = () => {
    setTourState(prev => ({ ...prev, showPopup: false, isActive: false }));
  };

  const nextSlide = () => {
    if (tourState.currentSlide < AI_TOUR_STEPS.length - 1) {
      setTourState(prev => ({ 
        ...prev, 
        currentSlide: prev.currentSlide + 1,
        result: null,
        isLoading: false
      }));
    }
  };

  const prevSlide = () => {
    if (tourState.currentSlide > 0) {
      setTourState(prev => ({ 
        ...prev, 
        currentSlide: prev.currentSlide - 1,
        result: null,
        isLoading: false
      }));
    }
  };

  const runCurrentDemo = useCallback(async () => {
    const currentStep = AI_TOUR_STEPS[tourState.currentSlide];
    setTourState(prev => ({ ...prev, isLoading: true, result: null }));
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      const result = await currentStep.demo();
      const score = Math.floor(Math.random() * 50) + 80; // 80-130 points per step
      
      setTourState(prev => ({ 
        ...prev, 
        isLoading: false, 
        result,
        totalScore: prev.totalScore + score
      }));
      
      // Completion popup removed per user request
      // toast({
      //   title: "Analysis Complete!",
      //   description: currentStep.expectedResult.split(':')[0] + " analysis completed!"
      // });
    } catch (error) {
      setTourState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Demo Error",
        description: "Demo simulation failed. Please try again.",
        variant: "destructive"
      });
    }
  }, [tourState.currentSlide, toast]);

  const currentStep = AI_TOUR_STEPS[tourState.currentSlide];
  const progress = ((tourState.currentSlide + 1) / AI_TOUR_STEPS.length) * 100;

  const renderStepContent = () => {
    if (!currentStep) return null;

    const { result, isLoading } = tourState;

    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-electric-blue animate-spin" />
            <span className="text-electric-blue font-medium">
              {currentStep.interactionType === 'analyze' ? 'Analyzing wallet intelligence...' :
               currentStep.interactionType === 'scan' ? 'Scanning blockchain networks...' :
               currentStep.interactionType === 'process' ? 'Processing data patterns...' :
               'Generating predictions...'}
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-electric-blue to-circuit-teal animate-pulse" style={{width: '60%'}}></div>
            </div>
            <div className="text-sm text-gray-400">FlutterAI processing blockchain data...</div>
          </div>
        </div>
      );
    }

    if (result) {
      switch (currentStep.id) {
        case 1: // Wallet Intelligence Scoring
          return (
            <div className="space-y-3">
              <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Wallet Intelligence Analysis Complete!
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Intelligence Score:</span>
                  <Badge className="bg-electric-blue/20 text-electric-blue font-bold">{result.walletScore}/1000</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Risk Level:</span>
                  <Badge className="bg-green-500/20 text-green-400">{result.riskLevel}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Portfolio Health:</span>
                  <Badge className="bg-purple-500/20 text-purple-400">{result.portfolioHealth}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Trading Success:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">{result.tradingSuccess}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Activity Level:</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400">{result.blockchainActivity}</Badge>
                </div>
              </div>
              <div className="mt-3 p-2 bg-electric-blue/10 rounded border-l-2 border-electric-blue">
                <div className="text-electric-blue text-xs font-medium">🎯 HIGH-VALUE WALLET: Excellent investment potential detected!</div>
              </div>
            </div>
          );

        case 2: // Cross-Chain Data Gathering
          return (
            <div className="space-y-3">
              <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Cross-Chain Scan Complete!
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Chains Scanned:</span>
                  <Badge className="bg-electric-blue/20 text-electric-blue font-bold">{result.chainsScanned}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Transactions:</span>
                  <Badge className="bg-green-500/20 text-green-400">{result.transactionsAnalyzed?.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tokens Held:</span>
                  <Badge className="bg-purple-500/20 text-purple-400">{result.tokensHeld}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">NFT Collections:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">{result.nftCollections}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">DeFi Positions:</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400">{result.defiPositions}</Badge>
                </div>
              </div>
              <div className="mt-3 p-2 bg-green-500/10 rounded border-l-2 border-green-500">
                <div className="text-green-400 text-xs font-medium">📊 COMPREHENSIVE: Multi-chain intelligence gathered successfully!</div>
              </div>
            </div>
          );

        case 3: // Behavioral Pattern Recognition
          return (
            <div className="space-y-3">
              <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Behavioral Analysis Complete!
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Behavior Type:</span>
                  <Badge className="bg-electric-blue/20 text-electric-blue font-bold">{result.behaviorType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Trading Style:</span>
                  <Badge className="bg-green-500/20 text-green-400">{result.tradingStyle}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Risk Appetite:</span>
                  <Badge className="bg-purple-500/20 text-purple-400">{result.riskAppetite}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Market Timing:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">{result.marketTiming}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Success Rate:</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400">{result.successRate}</Badge>
                </div>
              </div>
              <div className="mt-3 p-2 bg-purple-500/10 rounded border-l-2 border-purple-500">
                <div className="text-purple-400 text-xs font-medium">🎯 STRATEGIC: Professional trading patterns identified!</div>
              </div>
            </div>
          );

        case 4: // Wealth & Portfolio Intelligence
          return (
            <div className="space-y-3">
              <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Wealth Assessment Complete!
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Portfolio Value:</span>
                  <Badge className="bg-electric-blue/20 text-electric-blue font-bold">{result.totalPortfolioValue}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Diversification:</span>
                  <Badge className="bg-green-500/20 text-green-400">{result.diversificationScore}/10</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Blue Chip Ratio:</span>
                  <Badge className="bg-purple-500/20 text-purple-400">{result.blueChipRatio}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Yield Farming:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">{result.yieldFarmingAPY}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Wealth Tier:</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400">{result.wealthTier}</Badge>
                </div>
              </div>
              <div className="mt-3 p-2 bg-yellow-500/10 rounded border-l-2 border-yellow-500">
                <div className="text-yellow-400 text-xs font-medium">💎 HIGH NET WORTH: Premium wealth tier detected!</div>
              </div>
            </div>
          );

        case 5: // Viral Marketing Potential
          return (
            <div className="space-y-3">
              <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Marketing Analysis Complete!
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Viral Potential:</span>
                  <Badge className="bg-electric-blue/20 text-electric-blue font-bold">{result.viralPotential}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Influence Score:</span>
                  <Badge className="bg-green-500/20 text-green-400">{result.influenceScore}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Network Size:</span>
                  <Badge className="bg-purple-500/20 text-purple-400">{result.networkSize}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Spending Power:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">{result.spendingPower}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Campaign Fit:</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400">{result.campaignFit}</Badge>
                </div>
              </div>
              <div className="mt-3 p-2 bg-pink-500/10 rounded border-l-2 border-pink-500">
                <div className="text-pink-400 text-xs font-medium">🚀 VIRAL GOLDMINE: Maximum marketing potential unlocked!</div>
              </div>
            </div>
          );

        case 6: // Predictive Analytics Engine
          return (
            <div className="space-y-3">
              <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Predictive Analysis Complete!
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Portfolio Growth:</span>
                  <Badge className="bg-electric-blue/20 text-electric-blue font-bold">{result.portfolioGrowth}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Success Probability:</span>
                  <Badge className="bg-green-500/20 text-green-400">{result.successProbability}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Recommended:</span>
                  <Badge className="bg-purple-500/20 text-purple-400">{result.recommendedTokens}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Risk Alerts:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">{result.riskWarnings}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Opportunity Score:</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400">{result.opportunityScore}</Badge>
                </div>
              </div>
              <div className="mt-3 p-2 bg-cyan-500/10 rounded border-l-2 border-cyan-500">
                <div className="text-cyan-400 text-xs font-medium">🔮 FUTURE INSIGHTS: High-probability growth predictions generated!</div>
              </div>
            </div>
          );

        case 7: // Targeted Marketing Segments
          return (
            <div className="space-y-3">
              <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Segmentation Complete!
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Primary Segment:</span>
                  <Badge className="bg-electric-blue/20 text-electric-blue font-bold">{result.primarySegment}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Secondary:</span>
                  <Badge className="bg-green-500/20 text-green-400">{result.secondarySegments?.[0]}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Marketing Value:</span>
                  <Badge className="bg-purple-500/20 text-purple-400">{result.marketingValue}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Conversion Rate:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">{result.conversionRate}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Lifetime Value:</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400">{result.ltv}</Badge>
                </div>
              </div>
              <div className="mt-3 p-2 bg-orange-500/10 rounded border-l-2 border-orange-500">
                <div className="text-orange-400 text-xs font-medium">🎯 PERFECT TARGET: Premium DeFi user with high conversion potential!</div>
              </div>
            </div>
          );

        case 8: // Real-Time Intelligence Dashboard
          return (
            <div className="space-y-3">
              <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Dashboard Intelligence Active!
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Live Wallets:</span>
                  <Badge className="bg-electric-blue/20 text-electric-blue font-bold">{result.liveWallets}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Scores Updated:</span>
                  <Badge className="bg-green-500/20 text-green-400">{result.scoresUpdated}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Market Alerts:</span>
                  <Badge className="bg-purple-500/20 text-purple-400">{result.marketAlerts}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Risk Warnings:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">{result.riskWarnings}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Daily API Calls:</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400">{result.apiCalls}</Badge>
                </div>
              </div>
              <div className="mt-3 p-2 bg-emerald-500/10 rounded border-l-2 border-emerald-500">
                <div className="text-emerald-400 text-xs font-medium">⚡ LIVE INTELLIGENCE: Real-time blockchain monitoring operational!</div>
              </div>
            </div>
          );

        default:
          return <div className="text-green-400 text-sm">Demo completed successfully!</div>;
      }
    }

    return (
      <div className="text-center py-8">
        <div className="p-3 rounded-lg bg-gradient-to-br from-electric-blue/20 to-purple/20 mb-4 w-16 h-16 mx-auto flex items-center justify-center">
          {currentStep.icon}
        </div>
        <p className="text-gray-400 mb-4">Ready to experience FlutterAI intelligence</p>
        <Button 
          onClick={runCurrentDemo}
          className="bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80"
        >
          {currentStep.interactionType === 'analyze' ? 'Analyze Wallet' :
           currentStep.interactionType === 'scan' ? 'Scan Blockchains' :
           currentStep.interactionType === 'process' ? 'Process Data' :
           'Generate Predictions'}
        </Button>
      </div>
    );
  };

  return (
    <>
      <Button 
        onClick={startAITour}
        className="bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80 text-white px-4 py-2 text-sm w-full flex items-center justify-center gap-2 shadow-lg"
      >
        <Play className="w-4 h-4" />
        Start Interactive Demo
      </Button>

      <Dialog open={tourState.showPopup} onOpenChange={closeDemo}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-electric-blue/30">
          <DialogHeader className="space-y-4 pb-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gradient flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-electric-blue/20 to-purple/20">
                  <Brain className="w-6 h-6 text-electric-blue" />
                </div>
                FlutterAI Intelligence Tour
              </DialogTitle>
              <Badge className="bg-electric-green/20 text-electric-green font-medium">
                Slide {tourState.currentSlide + 1} of {AI_TOUR_STEPS.length}
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Progress</span>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{tourState.totalScore}</span>
                </div>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-slate-700"
              />
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left Panel: Step Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={cn(
                  "text-xs px-2 py-1",
                  currentStep?.category === 'intelligence' && "bg-electric-blue/20 text-electric-blue",
                  currentStep?.category === 'scoring' && "bg-yellow-500/20 text-yellow-400",
                  currentStep?.category === 'marketing' && "bg-pink-500/20 text-pink-400",
                  currentStep?.category === 'analytics' && "bg-green-500/20 text-green-400"
                )}>
                  {currentStep?.category?.toUpperCase()}
                </Badge>
                <span className="text-xs text-gray-500">
                  {currentStep?.interactionType?.toUpperCase()} DEMO
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white leading-tight">
                {currentStep?.title}
              </h3>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                {currentStep?.description}
              </p>
              
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <h4 className="text-sm font-semibold text-electric-blue mb-2">Expected Result:</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {currentStep?.expectedResult}
                </p>
              </div>
            </div>
            
            {/* Right Panel: Demo Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Live Intelligence Results:</h3>
              
              <Card className="bg-slate-800/50 border border-slate-600 min-h-[300px] flex flex-col justify-center">
                <CardContent className="p-6">
                  {renderStepContent()}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Navigation Footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
            <Button 
              variant="outline" 
              onClick={prevSlide}
              disabled={tourState.currentSlide === 0}
              className="border-slate-600 text-gray-300 hover:bg-slate-800"
            >
              Previous
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                {tourState.currentSlide === AI_TOUR_STEPS.length - 1 
                  ? "FlutterAI Tour Complete!" 
                  : "Experience the future of blockchain intelligence"}
              </p>
            </div>
            
            <Button 
              onClick={tourState.currentSlide === AI_TOUR_STEPS.length - 1 ? closeDemo : nextSlide}
              className="bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80"
            >
              {tourState.currentSlide === AI_TOUR_STEPS.length - 1 ? 'Complete Tour' : 'Next'}
              {tourState.currentSlide < AI_TOUR_STEPS.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}