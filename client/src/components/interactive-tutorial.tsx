import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Play, Loader2, Sparkles, Coins, DollarSign, Users, TrendingUp, Gift, Crown, Zap, MessageSquare, Calculator, Award, BarChart3, Brain, ChevronRight, Trophy, Star, Wallet, Shield, PieChart, Activity, CheckCircle } from "lucide-react";
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
    title: "🧠 FlutterAI Wallet Intelligence",
    description: "REVOLUTIONARY AI that analyzes any wallet with 1-1000 intelligence points! Instant behavioral analysis, risk assessment, portfolio quality scoring, and predictive insights across 11+ blockchains for perfect token targeting!",
    icon: <Brain className="w-6 h-6 text-electric-blue" />,
    category: 'token',
    demo: async () => ({ 
      walletScore: 847,
      riskLevel: 'Low',
      portfolioHealth: 'Excellent',
      marketingPotential: 'Very High',
      targetingAccuracy: '94%'
    }),
    interactionType: 'analyze',
    expectedResult: "INTELLIGENT targeting: 847/1000 wallet score with perfect behavioral analysis for laser-focused token distribution and marketing!"
  },
  {
    id: 4,
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
    id: 5,
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
    id: 6,
    title: "🎨 FlutterART NFT Creation",
    description: "COMING SOON: Revolutionary NFT creation platform! AI-powered artwork generation, custom collections, metadata automation, and marketplace integration. Turn your tokens into stunning digital art pieces that collectors crave!",
    icon: <Star className="w-6 h-6 text-pink-400" />,
    category: 'token',
    demo: async () => ({ 
      artworkGenerated: 'AI Abstract #847',
      rarity: 'Legendary',
      estimatedValue: '2.5 SOL',
      collectionSize: '10,000 pieces',
      status: 'Beta Testing'
    }),
    interactionType: 'click',
    expectedResult: "ARTISTIC revolution: AI-generated NFT artwork with automatic rarity scoring and marketplace-ready metadata - coming soon to Flutterbye!"
  },
  {
    id: 7,
    title: "📱 FlutterWave SMS Integration",
    description: "COMING SOON: Send blockchain tokens via SMS! Revolutionary bridge between traditional messaging and Web3. Your friends can receive and redeem crypto without wallets - pure magical user experience!",
    icon: <MessageSquare className="w-6 h-6 text-cyan-400" />,
    category: 'value',
    demo: async () => ({ 
      smsTokensSent: '47 messages',
      redemptionRate: '89%',
      avgClaimTime: '3.2 minutes',
      viralSpread: '+234% growth',
      status: 'Development Phase'
    }),
    interactionType: 'type',
    expectedResult: "SMS revolution: Blockchain tokens sent via text message with incredible redemption rates - bringing crypto to the masses via FlutterWave!"
  },
  {
    id: 8,
    title: "🎯 Viral Marketing Engine",
    description: "EXPONENTIAL expansion system powered by FlutterAI intelligence! Smart targeting, viral mechanics, social sharing incentives, and network effects that create unstoppable growth momentum for your tokens!",
    icon: <TrendingUp className="w-6 h-6 text-orange-400" />,
    category: 'trading',
    demo: async () => ({ 
      viralMultiplier: '3.4x',
      targetingAccuracy: '94%',
      networkGrowth: '+847% month',
      socialShares: 15420,
      communitySize: '89K+ members'
    }),
    interactionType: 'watch',
    expectedResult: "VIRAL explosion: AI-powered targeting, network effects, and social mechanics create exponential user growth and token value appreciation!"
  },
  {
    id: 9,
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
    id: 10,
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

interface TutorialState {
  showPopup: boolean;
  currentSlide: number;
  isRunning: boolean;
  progress: number;
  completedSteps: Set<number>;
  loadingSteps: Set<number>;
  stepResults: Record<number, any>;
  achievements: string[];
  totalScore: number;
  animatingProgress: boolean;
}

function InteractiveTutorialContent() {
  const { toast } = useToast();
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    showPopup: false,
    currentSlide: 0,
    isRunning: false,
    progress: 0,
    completedSteps: new Set(),
    loadingSteps: new Set(),
    stepResults: {},
    achievements: ["Tutorial Explorer", "Platform Pioneer"],
    totalScore: 2450,
    animatingProgress: false
  });

  const currentStep = TUTORIAL_STEPS[tutorialState.currentSlide];

  const runDemo = useCallback(async (step: TutorialStep) => {
    if (tutorialState.loadingSteps.has(step.id)) return;

    setTutorialState(prev => ({
      ...prev,
      loadingSteps: new Set([...Array.from(prev.loadingSteps), step.id]),
      animatingProgress: true
    }));

    try {
      // AI thinking simulation
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      const result = await step.demo();
      
      setTutorialState(prev => ({
        ...prev,
        stepResults: { ...prev.stepResults, [step.id]: result },
        completedSteps: new Set([...Array.from(prev.completedSteps), step.id]),
        progress: Math.min(prev.progress + (100 / TUTORIAL_STEPS.length), 100),
        totalScore: prev.totalScore + (step.category === 'token' ? 500 : step.category === 'value' ? 350 : step.category === 'economy' ? 420 : 280),
        achievements: [...prev.achievements, getStepAchievement(step)]
      }));

      // Success feedback - completion popup removed per user request
      // toast({
      //   title: "✅ Demo Complete!",
      //   description: `${step.title} completed successfully!`,
      //   duration: 2000
      // });
    } catch (error) {
      console.error(`Demo failed for step ${step.id}:`, error);
    } finally {
      setTutorialState(prev => {
        const newLoadingSteps = new Set(prev.loadingSteps);
        newLoadingSteps.delete(step.id);
        return {
          ...prev,
          loadingSteps: newLoadingSteps,
          animatingProgress: false
        };
      });
    }
  }, [tutorialState.loadingSteps, toast]);

  const getStepAchievement = (step: TutorialStep): string => {
    const achievements = {
      1: "Token Creator",
      2: "Value Attacher", 
      3: "AI Intelligence Expert",
      4: "Pricing Guru",
      5: "FLBY Master",
      6: "Art Pioneer",
      7: "SMS Innovator",
      8: "Growth Hacker",
      9: "Trading Expert",
      10: "Launch Specialist"
    };
    return achievements[step.id] || "Platform Explorer";
  };

  const startInteractiveTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      showPopup: true,
      isRunning: true,
      currentSlide: 0,
      progress: 0
    }));

    // Auto-run first demo
    setTimeout(() => {
      runDemo(TUTORIAL_STEPS[0]);
    }, 1000);
  };

  const nextSlide = () => {
    if (tutorialState.currentSlide < TUTORIAL_STEPS.length - 1) {
      setTutorialState(prev => ({
        ...prev,
        currentSlide: prev.currentSlide + 1
      }));
      
      // Auto-run demo for new slide
      const nextStep = TUTORIAL_STEPS[tutorialState.currentSlide + 1];
      if (nextStep) {
        setTimeout(() => runDemo(nextStep), 800);
      }
    }
  };

  const prevSlide = () => {
    if (tutorialState.currentSlide > 0) {
      setTutorialState(prev => ({
        ...prev,
        currentSlide: prev.currentSlide - 1
      }));
    }
  };

  const closeDemo = () => {
    setTutorialState(prev => ({
      ...prev,
      showPopup: false,
      isRunning: false
    }));
  };

  const isLoading = tutorialState.loadingSteps.has(currentStep.id);
  const isCompleted = tutorialState.completedSteps.has(currentStep.id);
  const result = tutorialState.stepResults[currentStep.id];

  const renderStepResult = (result: any, category: string, stepId: number) => {
    switch (category) {
      case 'token':
        if (stepId === 1) {
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
        } else if (stepId === 3) {
          // FlutterAI Wallet Intelligence
          return (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🧠 Intelligence Score:</span>
                <Badge className="bg-electric-blue/20 text-electric-blue font-bold">{result.walletScore}/1000</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">⚠️ Risk Level:</span>
                <Badge className="bg-green-500/20 text-green-400">{result.riskLevel}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">💼 Portfolio Health:</span>
                <Badge className="bg-purple-500/20 text-purple-400">{result.portfolioHealth}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🎯 Marketing Potential:</span>
                <Badge className="bg-pink-500/20 text-pink-400">{result.marketingPotential}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">🎪 Targeting Accuracy:</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 font-bold">{result.targetingAccuracy}</Badge>
              </div>
              <div className="mt-3 p-2 bg-electric-blue/10 rounded border-l-2 border-electric-blue">
                <div className="text-electric-blue text-xs font-medium">🚀 FLUTTERAI: Advanced wallet intelligence analysis complete!</div>
              </div>
            </>
          );
        } else if (stepId === 6) {
          // FlutterART NFT Creation
          return (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🎨 Artwork Generated:</span>
                <Badge className="bg-pink-500/20 text-pink-400 font-bold">{result.artworkGenerated}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">✨ Rarity Level:</span>
                <Badge className="bg-yellow-500/20 text-yellow-400">{result.rarity}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">💰 Estimated Value:</span>
                <Badge className="bg-green-500/20 text-green-400">{result.estimatedValue}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🔢 Collection Size:</span>
                <Badge className="bg-blue-500/20 text-blue-400">{result.collectionSize}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">⚗️ Status:</span>
                <Badge className="bg-orange-500/20 text-orange-400">{result.status}</Badge>
              </div>
              <div className="mt-3 p-2 bg-pink-500/10 rounded border-l-2 border-pink-400">
                <div className="text-pink-400 text-xs font-medium">🎨 FLUTTERART: AI-powered NFT creation coming soon!</div>
              </div>
            </>
          );
        }
        return null;

      case 'value':
        if (stepId === 2) {
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
        } else if (stepId === 7) {
          // FlutterWave SMS Integration
          return (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">📱 SMS Tokens Sent:</span>
                <Badge className="bg-cyan-500/20 text-cyan-400 font-bold">{result.smsTokensSent}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🎯 Redemption Rate:</span>
                <Badge className="bg-green-500/20 text-green-400">{result.redemptionRate}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">⚡ Avg Claim Time:</span>
                <Badge className="bg-yellow-500/20 text-yellow-400">{result.avgClaimTime}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">🚀 Viral Spread:</span>
                <Badge className="bg-pink-500/20 text-pink-400">{result.viralSpread}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">⚗️ Status:</span>
                <Badge className="bg-orange-500/20 text-orange-400">{result.status}</Badge>
              </div>
              <div className="mt-3 p-2 bg-cyan-500/10 rounded border-l-2 border-cyan-400">
                <div className="text-cyan-400 text-xs font-medium">📱 FLUTTERWAVE: SMS-to-blockchain revolution coming soon!</div>
              </div>
            </>
          );
        }
        return null;

      case 'economy':
        if (stepId === 4) {
          // Volume Pricing Intelligence (now step 4)
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
        } else if (stepId === 5) {
          // FLBY Token Economics (now step 5)
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
        }
        return null;

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
    <>
      <Button 
        onClick={startInteractiveTutorial}
        className="bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80 text-white px-4 py-2 text-sm w-full flex items-center justify-center gap-2 shadow-lg"
      >
        <Play className="w-4 h-4" />
        Start Interactive Demo
      </Button>

      <Dialog open={tutorialState.showPopup} onOpenChange={closeDemo}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-electric-blue/30">
          <DialogHeader className="space-y-4 pb-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gradient flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-electric-blue/20 to-purple/20">
                  <Sparkles className="w-6 h-6 text-electric-blue" />
                </div>
                Platform Tutorial Demo
              </DialogTitle>
              <Badge className="bg-electric-green/20 text-electric-green font-medium">
                Slide {tutorialState.currentSlide + 1} of {TUTORIAL_STEPS.length}
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Progress</span>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{tutorialState.totalScore}</span>
                </div>
              </div>
              <Progress 
                value={tutorialState.progress} 
                className="h-2 bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-electric-blue [&>div]:to-circuit-teal [&>div]:transition-all [&>div]:duration-1000"
              />
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            {/* Current Step */}
            <Card className={cn(
              "electric-frame border-2 min-h-[400px]",
              CATEGORY_COLORS[currentStep.category]
            )}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                      isCompleted ? "bg-green-500" : 
                      isLoading ? "bg-electric-blue animate-pulse" :
                      "bg-slate-700/50"
                    )}>
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        currentStep.icon
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg">{currentStep.title}</h3>
                      <Badge variant="secondary" className={cn(
                        "mt-1 text-xs",
                        `bg-${currentStep.category === 'token' ? 'yellow' : 
                          currentStep.category === 'value' ? 'green' : 
                          currentStep.category === 'economy' ? 'purple' : 'blue'}-500/20`
                      )}>
                        {CATEGORY_LABELS[currentStep.category]}
                      </Badge>
                    </div>
                  </CardTitle>
                  <Button
                    onClick={() => runDemo(currentStep)}
                    disabled={isLoading || isCompleted}
                    className="bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Running Demo...
                      </>
                    ) : isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Demo
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-gray-300 leading-relaxed mt-4">
                  {currentStep.description}
                </p>
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

            {/* Navigation */}
            <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-electric-blue/30">
              <Button
                variant="outline"
                onClick={prevSlide}
                disabled={tutorialState.currentSlide === 0}
                className="flex items-center gap-2"
              >
                ← Previous
              </Button>

              {/* Slide Indicators */}
              <div className="flex items-center gap-2">
                {TUTORIAL_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-200",
                      index === tutorialState.currentSlide ? "bg-electric-blue scale-110" :
                      tutorialState.completedSteps.has(TUTORIAL_STEPS[index].id) ? "bg-green-500" :
                      "bg-slate-600"
                    )}
                  />
                ))}
              </div>

              {tutorialState.currentSlide < TUTORIAL_STEPS.length - 1 ? (
                <Button
                  onClick={nextSlide}
                  className="flex items-center gap-2 bg-gradient-to-r from-electric-blue to-circuit-teal"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <Star className="w-4 h-4" />
                  Complete!
                </Button>
              )}
            </div>

            {/* Achievements Panel */}
            {tutorialState.achievements.length > 2 && (
              <Card className="electric-frame bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Achievements Unlocked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tutorialState.achievements.map((achievement, index) => (
                      <Badge key={index} className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
                        🏆 {achievement}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export main component
export function InteractiveTutorial() {
  return <InteractiveTutorialContent />;
}

// Default export
export default InteractiveTutorial;