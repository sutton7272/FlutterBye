import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Loader2, Sparkles, Coins, DollarSign, Users, TrendingUp, Gift, Crown, Zap, MessageSquare, Calculator, Award, BarChart3, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'token' | 'value' | 'economy' | 'trading';
  demo: () => Promise<any>;
  interactionType: 'click' | 'type' | 'watch' | 'analyze';
  expectedResult: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: "🪙 60-Second Token Creation",
    description: "REVOLUTIONARY simplicity! Create professional SPL tokens faster than ordering coffee. No coding, no complexity - just pure blockchain magic that turns your message into a tradeable digital asset!",
    icon: <Coins className="w-6 h-6 text-yellow-400" />,
    category: 'token',
    demo: async () => ({ 
      tokenAddress: 'FLByToken1234...abcd',
      message: 'StakeNowForMegaYield',
      supply: 1000,
      mintCost: '0.01 SOL'
    }),
    interactionType: 'click',
    expectedResult: "INSTANT token creation: Professional SPL token deployed to Solana blockchain with your 27-character message, complete supply control, and ready for trading!"
  },
  {
    id: 2,
    title: "💰 Smart Value Attachment",
    description: "GAME-CHANGING feature that lets you attach real cryptocurrency value to your tokens! Create instant rewards, gifts, airdrops, and incentives that holders can redeem. It's like putting money inside digital treasure chests!",
    icon: <DollarSign className="w-6 h-6 text-green-400" />,
    category: 'value',
    demo: async () => ({ 
      valueAttached: '10.0 SOL',
      valuePerToken: '0.01 SOL',
      expirationDate: '30 days',
      redemptionRate: '89%'
    }),
    interactionType: 'type',
    expectedResult: "VALUE-PACKED tokens: SOL/USDC/FLBY attached with expiration dates, creating urgency and real utility that drives demand and holder engagement!"
  },
  {
    id: 3,
    title: "💎 Volume Pricing Intelligence",
    description: "SMART pricing that gets smarter with scale! Our AI-powered system automatically applies volume discounts, tracks market rates, and optimizes pricing to maximize your savings while creating tokens at enterprise scale!",
    icon: <Calculator className="w-6 h-6 text-blue-400" />,
    category: 'economy',
    demo: async () => ({ 
      basePrice: '$2.00',
      volumeDiscount: '30%',
      finalPrice: '$1.40',
      savings: '$600',
      tier: 'Platinum (100+ tokens)'
    }),
    interactionType: 'analyze',
    expectedResult: "MAXIMUM savings unlocked: Volume pricing tiers automatically applied, saving hundreds of dollars on bulk token creation with transparent, fair pricing!"
  },
  {
    id: 4,
    title: "👑 FLBY Token Economics",
    description: "EXCLUSIVE benefits that make you feel like crypto royalty! FLBY token holders get massive fee discounts, staking rewards up to 18% APY, governance voting power, and revenue sharing. It's like having VIP access to the future!",
    icon: <Crown className="w-6 h-6 text-purple-400" />,
    category: 'economy',
    demo: async () => ({ 
      feeDiscount: '50%',
      stakingAPY: '18%',
      revenueShare: '12%',
      governanceVotes: 1247,
      vipStatus: 'Platinum Holder'
    }),
    interactionType: 'watch',
    expectedResult: "ROYAL treatment activated: Fee discounts, high-yield staking, profit sharing, and platform governance control - being a FLBY holder pays!"
  },
  {
    id: 5,
    title: "🌟 Advanced Staking System",
    description: "WEALTH-BUILDING machine that turns your FLBY tokens into a passive income powerhouse! Multiple staking tiers with increasing rewards, revenue sharing, and compound growth. Watch your crypto portfolio grow while you sleep!",
    icon: <Award className="w-6 h-6 text-orange-400" />,
    category: 'economy',
    demo: async () => ({ 
      stakingTier: 'Platinum (365 days)',
      currentAPY: '18%',
      revenueShare: '12%',
      projectedEarnings: '$4,320/year',
      compoundGrowth: '+156%'
    }),
    interactionType: 'analyze',
    expectedResult: "PASSIVE income engine: Long-term staking with compounding rewards, revenue sharing, and exponential growth potential for serious investors!"
  },
  {
    id: 6,
    title: "📈 Token Marketplace Magic",
    description: "TRADING paradise where your message tokens become valuable digital assets! Real-time price discovery, liquidity pools, trending algorithms, and a vibrant community of traders competing for the most valuable messages!",
    icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
    category: 'trading',
    demo: async () => ({ 
      topToken: '"HodlForDiamondHands"',
      currentPrice: '0.1 SOL',
      dailyGain: '+15%',
      volume24h: '47.3 SOL',
      marketCap: '$12,400'
    }),
    interactionType: 'watch',
    expectedResult: "TRADING revolution: Your message tokens gain real market value, creating a new economy where creativity meets cryptocurrency profits!"
  },
  {
    id: 7,
    title: "🎯 Viral Growth Engine",
    description: "EXPONENTIAL expansion system that turns every token holder into your marketing army! Built-in referral rewards, viral mechanics, social sharing incentives, and network effects that create unstoppable growth momentum!",
    icon: <TrendingUp className="w-6 h-6 text-pink-400" />,
    category: 'trading',
    demo: async () => ({ 
      referralRewards: '50-250 FLBY',
      viralMultiplier: '3.4x',
      networkGrowth: '+847% month',
      socialShares: 15420,
      communitySize: '89K+ members'
    }),
    interactionType: 'watch',
    expectedResult: "VIRAL explosion: Network effects, referral incentives, and social mechanics create exponential user growth and token value appreciation!"
  },
  {
    id: 8,
    title: "🚀 Launch Countdown Power",
    description: "EXCITEMENT generator that builds massive anticipation! Countdown timers, early access rewards, exclusive airdrops, and limited-time offers that create FOMO and drive explosive launch-day adoption!",
    icon: <Zap className="w-6 h-6 text-electric-blue" />,
    category: 'trading',
    demo: async () => ({ 
      launchCountdown: '2 days, 14 hours',
      earlyAccessSpots: '16.4% remaining',
      exclusiveAirdrops: '10,000 FLBY',
      launchBonus: '3x rewards',
      waitlistSize: '47,892 users'
    }),
    interactionType: 'click',
    expectedResult: "LAUNCH excitement: Countdown pressure, exclusive rewards, and limited availability create massive demand and guaranteed explosive launch success!"
  }
];

const CATEGORY_COLORS = {
  token: 'border-yellow-400/30 bg-yellow-400/10',
  value: 'border-green-400/30 bg-green-400/10', 
  economy: 'border-purple-400/30 bg-purple-400/10',
  trading: 'border-blue-400/30 bg-blue-400/10'
};

const CATEGORY_LABELS = {
  token: 'Token Creation',
  value: 'Value System',
  economy: 'Token Economy', 
  trading: 'Trading & Growth'
};

function InteractiveTutorialContent() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loadingSteps, setLoadingSteps] = useState<Set<number>>(new Set());
  const [stepResults, setStepResults] = useState<Record<number, any>>({});

  const currentStep = TUTORIAL_STEPS[currentStepIndex];

  const runDemo = useCallback(async (step: TutorialStep) => {
    if (loadingSteps.has(step.id)) return;

    setLoadingSteps(prev => new Set([...Array.from(prev), step.id]));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      const result = await step.demo();
      
      setStepResults(prev => ({ ...prev, [step.id]: result }));
      setCompletedSteps(prev => new Set([...Array.from(prev), step.id]));
    } catch (error) {
      console.error(`Demo failed for step ${step.id}:`, error);
    } finally {
      setLoadingSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(step.id);
        return newSet;
      });
    }
  }, [loadingSteps]);

  const nextStep = () => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < TUTORIAL_STEPS.length) {
      setCurrentStepIndex(index);
    }
  };

  const progress = ((currentStepIndex + 1) / TUTORIAL_STEPS.length) * 100;
  const isLoading = loadingSteps.has(currentStep.id);
  const isCompleted = completedSteps.has(currentStep.id);
  const result = stepResults[currentStep.id];

  const renderStepResult = (result: any, category: string, stepId: number) => {
    switch (category) {
      case 'token':
        return (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">🪙 Token Created:</span>
              <Badge className="bg-yellow-500/20 text-yellow-400 font-bold">{result.tokenAddress?.substring(0, 12)}...</Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">💬 Message:</span>
              <span className="text-white text-sm font-medium">"{result.message}"</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">🔢 Total Supply:</span>
              <Badge className="bg-blue-500/20 text-blue-400">{result.supply?.toLocaleString()} tokens</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">💰 Cost:</span>
              <Badge className="bg-green-500/20 text-green-400 font-bold">{result.mintCost}</Badge>
            </div>
            <div className="mt-3 p-2 bg-green-500/10 rounded border-l-2 border-green-400">
              <div className="text-green-400 text-xs font-medium">🎉 SUCCESS! Your professional SPL token is live on Solana blockchain!</div>
            </div>
          </>
        );

      case 'value':
        return (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">💰 Value Pool:</span>
              <Badge className="bg-green-500/20 text-green-400 font-bold">{result.valueAttached}</Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">🎯 Per Token:</span>
              <Badge className="bg-yellow-500/20 text-yellow-400">{result.valuePerToken}</Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">⏰ Expires in:</span>
              <Badge className="bg-orange-500/20 text-orange-400">{result.expirationDate}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">🔥 Redemption Rate:</span>
              <Badge className="bg-purple-500/20 text-purple-400">{result.redemptionRate}</Badge>
            </div>
            <div className="mt-3 p-2 bg-green-500/10 rounded border-l-2 border-green-400">
              <div className="text-green-400 text-xs font-medium">💎 TREASURE ACTIVATED! Real crypto value locked and ready for redemption!</div>
            </div>
          </>
        );

      case 'economy':
        if (stepId === 3) {
          return (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">💰 Base Price:</span>
                <span className="text-gray-400 text-sm line-through">{result.basePrice}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🎯 Volume Discount:</span>
                <Badge className="bg-green-500/20 text-green-400 font-bold">{result.volumeDiscount} OFF</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">✨ Final Price:</span>
                <Badge className="bg-electric-blue/20 text-electric-blue font-bold">{result.finalPrice}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">💸 Total Savings:</span>
                <Badge className="bg-green-500/20 text-green-400 font-bold">{result.savings}</Badge>
              </div>
              <div className="mt-3 p-2 bg-green-500/10 rounded border-l-2 border-green-400">
                <div className="text-green-400 text-xs font-medium">🎉 {result.tier} tier unlocked! Maximum savings achieved!</div>
              </div>
            </>
          );
        } else if (stepId === 4) {
          return (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">💰 Fee Discount:</span>
                <Badge className="bg-purple-500/20 text-purple-400 font-bold">{result.feeDiscount} OFF</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">📈 Staking APY:</span>
                <Badge className="bg-green-500/20 text-green-400 font-bold">{result.stakingAPY}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">💎 Revenue Share:</span>
                <Badge className="bg-blue-500/20 text-blue-400">{result.revenueShare}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">🗳️ Your Votes:</span>
                <Badge className="bg-yellow-500/20 text-yellow-400">{result.governanceVotes?.toLocaleString()}</Badge>
              </div>
              <div className="mt-3 p-2 bg-purple-500/10 rounded border-l-2 border-purple-400">
                <div className="text-purple-400 text-xs font-medium">👑 {result.vipStatus} status! Maximum FLBY benefits active!</div>
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🏆 Staking Tier:</span>
                <Badge className="bg-orange-500/20 text-orange-400 font-bold">{result.stakingTier}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">📊 Current APY:</span>
                <Badge className="bg-green-500/20 text-green-400 font-bold">{result.currentAPY}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">💰 Projected Earnings:</span>
                <Badge className="bg-blue-500/20 text-blue-400 font-bold">{result.projectedEarnings}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">🚀 Growth Potential:</span>
                <Badge className="bg-purple-500/20 text-purple-400 font-bold">{result.compoundGrowth}</Badge>
              </div>
              <div className="mt-3 p-2 bg-green-500/10 rounded border-l-2 border-green-400">
                <div className="text-green-400 text-xs font-medium">💸 WEALTH ENGINE: Passive income machine activated for maximum returns!</div>
              </div>
            </>
          );
        }

      case 'trading':
        if (stepId === 6) {
          return (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🏆 Top Token:</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 font-bold">{result.topToken}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">💰 Current Price:</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 font-bold">{result.currentPrice}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">📈 Daily Gain:</span>
                <Badge className="bg-green-500/20 text-green-400 font-bold">{result.dailyGain}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">💎 Market Cap:</span>
                <Badge className="bg-purple-500/20 text-purple-400">{result.marketCap}</Badge>
              </div>
              <div className="mt-3 p-2 bg-emerald-500/10 rounded border-l-2 border-emerald-400">
                <div className="text-emerald-400 text-xs font-medium">🎯 TRADING PARADISE: Your message tokens are becoming valuable digital assets!</div>
              </div>
            </>
          );
        } else if (stepId === 7) {
          return (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🎁 Referral Rewards:</span>
                <Badge className="bg-pink-500/20 text-pink-400 font-bold">{result.referralRewards} per user</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🚀 Viral Multiplier:</span>
                <Badge className="bg-orange-500/20 text-orange-400 font-bold">{result.viralMultiplier}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">📈 Network Growth:</span>
                <Badge className="bg-green-500/20 text-green-400 font-bold">{result.networkGrowth}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">👥 Community:</span>
                <Badge className="bg-blue-500/20 text-blue-400">{result.communitySize}</Badge>
              </div>
              <div className="mt-3 p-2 bg-pink-500/10 rounded border-l-2 border-pink-400">
                <div className="text-pink-400 text-xs font-medium">🌟 VIRAL EXPLOSION: Exponential growth engine creating unstoppable momentum!</div>
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">⏰ Launch Countdown:</span>
                <Badge className="bg-electric-blue/20 text-electric-blue font-bold">{result.launchCountdown}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🎯 Early Access Left:</span>
                <Badge className="bg-orange-500/20 text-orange-400 font-bold">{result.earlyAccessSpots}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🎁 Airdrop Bonus:</span>
                <Badge className="bg-green-500/20 text-green-400 font-bold">{result.exclusiveAirdrops}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">📋 Waitlist:</span>
                <Badge className="bg-purple-500/20 text-purple-400">{result.waitlistSize?.toLocaleString()} users</Badge>
              </div>
              <div className="mt-3 p-2 bg-electric-blue/10 rounded border-l-2 border-electric-blue">
                <div className="text-electric-blue text-xs font-medium">🚀 LAUNCH FEVER: Maximum hype building for explosive market entry!</div>
              </div>
            </>
          );
        }

      default:
        return <div className="text-green-400 text-sm">Demo completed successfully!</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Progress */}
      <Card className="electric-frame bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-purple-400 bg-clip-text text-transparent mb-2">
            🚀 Platform Interactive Tutorial
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Step {currentStepIndex + 1} of {TUTORIAL_STEPS.length} • {Math.round(progress)}% Complete
          </p>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3">
            <div 
              className="bg-gradient-to-r from-electric-blue to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Current Step Display */}
      <Card className={cn(
        "electric-frame border-2 min-h-[500px]",
        CATEGORY_COLORS[currentStep.category]
      )}>
        <CardHeader>
          <div className="flex items-start gap-4 mb-4">
            <div className={cn(
              "w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300",
              isCompleted ? "bg-green-500" : 
              isLoading ? "bg-electric-blue animate-pulse" :
              "bg-slate-700/50"
            )}>
              {isLoading ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                currentStep.icon
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-white mb-3 leading-tight">
                {currentStep.title}
              </CardTitle>
              <p className="text-gray-300 leading-relaxed mb-4">
                {currentStep.description}
              </p>
              <div className="flex items-center gap-4">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-sm font-medium",
                    CATEGORY_COLORS[currentStep.category]
                  )}
                >
                  {CATEGORY_LABELS[currentStep.category]}
                </Badge>
                <Button
                  onClick={() => runDemo(currentStep)}
                  disabled={isLoading}
                  className={cn(
                    "transition-all duration-200",
                    isCompleted 
                      ? "bg-green-600 hover:bg-green-500 text-white"
                      : isLoading
                      ? "bg-electric-blue/50 cursor-not-allowed"
                      : "bg-electric-blue hover:bg-electric-blue/80 text-white"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running Demo...
                    </>
                  ) : isCompleted ? (
                    <>
                      ✅ Demo Complete
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Try This Demo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        {(isLoading || result) && (
          <CardContent className="pt-0">
            <div className={cn(
              "p-6 rounded-lg border-2 transition-all duration-500",
              isLoading ? "border-electric-blue/30 bg-electric-blue/10" : 
              "border-green-400/30 bg-green-400/10"
            )}>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-electric-blue animate-spin" />
                    <span className="text-electric-blue font-medium">
                      {currentStep.interactionType === 'click' ? 'Processing your request...' :
                       currentStep.interactionType === 'type' ? 'Analyzing your input...' :
                       currentStep.interactionType === 'watch' ? 'Monitoring systems...' :
                       'Running advanced analysis...'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {currentStep.expectedResult}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-green-400 font-semibold text-lg mb-3">🎉 Demo Results</h4>
                  {renderStepResult(result, currentStep.category, currentStep.id)}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-electric-blue/30">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-2"
        >
          ← Previous
        </Button>

        {/* Step Dots */}
        <div className="flex items-center gap-2">
          {TUTORIAL_STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                index === currentStepIndex ? "bg-electric-blue" :
                completedSteps.has(TUTORIAL_STEPS[index].id) ? "bg-green-500" :
                "bg-slate-600 hover:bg-slate-500"
              )}
            />
          ))}
        </div>

        {currentStepIndex < TUTORIAL_STEPS.length - 1 ? (
          <Button
            onClick={nextStep}
            className="flex items-center gap-2 bg-gradient-to-r from-electric-blue to-circuit-teal"
          >
            Next →
          </Button>
        ) : (
          <Button
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600"
          >
            <Zap className="w-4 h-4" />
            Get Started!
          </Button>
        )}
      </div>

      {/* Completion Message */}
      {completedSteps.size === TUTORIAL_STEPS.length && (
        <Card className="electric-frame bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-400/30">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-400 mb-2">
              🎉 Tutorial Mastered!
            </CardTitle>
            <p className="text-gray-300">
              You've completed all demos! Ready to start creating your own tokens?
            </p>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

// Export for backward compatibility with old dialog-based interface
export function InteractiveTutorial() {
  return <InteractiveTutorialContent />;
}

// Tutorial Launch Button Component  
export function TutorialLaunchButton({ className = "", variant = "default" }: { 
  className?: string;
  variant?: "default" | "outline" | "ghost";
}) {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setShowTutorial(true)}
        className={`flex items-center gap-2 ${className}`}
      >
        <Play className="w-4 h-4" />
        Interactive Tutorial
      </Button>
      
      {/* Full-screen overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-full p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6 sticky top-4 bg-slate-900/90 backdrop-blur rounded-lg p-4 border border-electric-blue/30">
                <h1 className="text-2xl font-bold text-gradient">Platform Interactive Tutorial</h1>
                <Button
                  variant="ghost" 
                  onClick={() => setShowTutorial(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕ Close Tutorial
                </Button>
              </div>
              <InteractiveTutorialContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}