import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Coins, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Gift, 
  Crown, 
  Zap,
  MessageSquare,
  Wallet,
  Upload,
  Calculator,
  Target,
  Award,
  Sparkles,
  BarChart3,
  Lock
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  content: React.ReactNode;
  isDemo?: boolean;
  requiresAuth?: boolean;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to Flutterbye",
    description: "The revolutionary blockchain messaging platform",
    icon: Sparkles,
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-electric-blue to-circuit-teal rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gradient mb-2">Welcome to Flutterbye</h3>
          <p className="text-gray-400">
            Transform your messages into valuable blockchain tokens on Solana. 
            Each 27-character message becomes a unique SPL token that can carry value, 
            be traded, and create lasting digital connections.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 bg-blue-900/20 border border-electric-blue/30 rounded-lg">
            <Coins className="w-6 h-6 text-electric-blue mb-2" />
            <p className="text-sm font-medium">Tokenized Messages</p>
          </div>
          <div className="p-3 bg-green-900/20 border border-circuit-teal/30 rounded-lg">
            <DollarSign className="w-6 h-6 text-circuit-teal mb-2" />
            <p className="text-sm font-medium">Value Attachment</p>
          </div>
          <div className="p-3 bg-purple-900/20 border border-purple-400/30 rounded-lg">
            <Users className="w-6 h-6 text-purple-400 mb-2" />
            <p className="text-sm font-medium">Community Driven</p>
          </div>
          <div className="p-3 bg-orange-900/20 border border-orange-400/30 rounded-lg">
            <TrendingUp className="w-6 h-6 text-orange-400 mb-2" />
            <p className="text-sm font-medium">Growth Rewards</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "token-minting",
    title: "Create Message Tokens",
    description: "Turn your 27-character messages into blockchain tokens",
    icon: Coins,
    isDemo: true,
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-electric-blue/30">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-electric-blue" />
            Message Token Creation
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded border">
              <span className="text-sm">Message:</span>
              <Badge className="bg-electric-blue/20 text-electric-blue">
                "StakeNowForMegaYield"
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded border">
              <span className="text-sm">Supply:</span>
              <span className="font-bold text-white">1,000 tokens</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded border">
              <span className="text-sm">Symbol:</span>
              <Badge variant="secondary">FLBY-MSG</Badge>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 p-4 rounded-lg border border-electric-blue/30">
          <h4 className="font-semibold mb-2 text-electric-green">Dynamic Pricing</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-sm text-gray-400">Per Token</p>
              <p className="text-lg font-bold text-white">$1.80</p>
              <Badge className="bg-green-600/20 text-green-400 text-xs">10% OFF</Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Total Cost</p>
              <p className="text-lg font-bold text-electric-green">$1,800.00</p>
              <p className="text-xs text-gray-400">Volume discount applied</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "pricing-tiers",
    title: "Volume Discounts",
    description: "Save more with larger token quantities",
    icon: Calculator,
    isDemo: true,
    content: (
      <div className="space-y-4">
        <h4 className="font-semibold text-center mb-4">Volume Pricing Tiers</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-800/50 border border-gray-600 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-400">1-9 tokens</p>
              <p className="text-xl font-bold text-white">$2.00</p>
              <Badge variant="secondary" className="text-xs">Base Price</Badge>
            </div>
          </div>
          <div className="p-3 bg-blue-900/30 border border-electric-blue/30 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-400">10-49 tokens</p>
              <p className="text-xl font-bold text-white">$1.80</p>
              <Badge className="bg-green-600/20 text-green-400 text-xs">10% OFF</Badge>
            </div>
          </div>
          <div className="p-3 bg-green-900/30 border border-circuit-teal/30 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-400">50-99 tokens</p>
              <p className="text-xl font-bold text-white">$1.60</p>
              <Badge className="bg-green-600/20 text-green-400 text-xs">20% OFF</Badge>
            </div>
          </div>
          <div className="p-3 bg-purple-900/30 border border-purple-400/30 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-400">100+ tokens</p>
              <p className="text-xl font-bold text-white">$1.40</p>
              <Badge className="bg-purple-600/20 text-purple-400 text-xs">30% OFF</Badge>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-400/30 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <p className="text-sm font-medium text-green-400">
              Save up to $600 on 1,000 tokens with volume pricing!
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "value-attachment",
    title: "Attach Value to Tokens",
    description: "Add cryptocurrency value that holders can redeem",
    icon: DollarSign,
    isDemo: true,
    requiresAuth: true,
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-4 rounded-lg border border-green-400/30">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-400" />
            Value Attachment Example
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total Value Pool:</span>
              <span className="font-bold text-green-400">10.0 SOL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Token Supply:</span>
              <span className="font-bold text-white">1,000 tokens</span>
            </div>
            <div className="flex items-center justify-between border-t border-green-400/20 pt-2">
              <span className="text-sm text-gray-400">Value per Token:</span>
              <span className="font-bold text-green-400">0.01 SOL</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-electric-blue/30">
          <h4 className="font-semibold mb-2">How It Works</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Attach SOL, USDC, or FLBY value to your tokens</p>
            <p>• Set expiration dates for time-limited offers</p>
            <p>• Token holders can redeem attached value</p>
            <p>• Perfect for rewards, gifts, and incentives</p>
          </div>
        </div>
        {!true && (
          <div className="p-3 bg-orange-900/20 border border-orange-400/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-400" />
              <p className="text-sm text-orange-400">
                Feature available after early access authorization
              </p>
            </div>
          </div>
        )}
      </div>
    )
  },
  {
    id: "flby-token",
    title: "FLBY Token Economy",
    description: "Earn rewards and get discounts with native tokens",
    icon: Crown,
    isDemo: true,
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-lg border border-purple-400/30">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-400" />
            FLBY Token Benefits
          </h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-2 bg-purple-950/30 rounded">
              <span className="text-sm">Platform Fee Discount:</span>
              <Badge className="bg-purple-600/20 text-purple-400">10% OFF</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-950/30 rounded">
              <span className="text-sm">Staking Rewards APY:</span>
              <Badge className="bg-green-600/20 text-green-400">5-18%</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-950/30 rounded">
              <span className="text-sm">Revenue Sharing:</span>
              <Badge className="bg-blue-600/20 text-blue-400">2-12%</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-950/30 rounded">
              <span className="text-sm">Governance Rights:</span>
              <Badge className="bg-electric-blue/20 text-electric-blue">Vote</Badge>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-electric-blue/30">
          <h4 className="font-semibold mb-2">Airdrop Program</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Early platform usage rewards</p>
            <p>• Referral bonuses (50-250 FLBY per referral)</p>
            <p>• Community engagement incentives</p>
            <p>• Long-term holder benefits</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "staking-governance",
    title: "Staking & Governance",
    description: "Earn rewards and shape the platform's future",
    icon: Award,
    isDemo: true,
    requiresAuth: true,
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-4 rounded-lg border border-blue-400/30">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            Staking Tiers & Rewards
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-950/30 rounded">
              <span className="text-sm">Bronze (30 days):</span>
              <span className="font-bold text-blue-400">5% APY + 2% Revenue</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-950/30 rounded">
              <span className="text-sm">Silver (90 days):</span>
              <span className="font-bold text-blue-400">8% APY + 5% Revenue</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-950/30 rounded">
              <span className="text-sm">Gold (180 days):</span>
              <span className="font-bold text-blue-400">12% APY + 8% Revenue</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-950/30 rounded">
              <span className="text-sm">Platinum (365 days):</span>
              <span className="font-bold text-blue-400">18% APY + 12% Revenue</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-electric-blue/30">
          <h4 className="font-semibold mb-2">Governance Participation</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Vote on platform upgrades and features</p>
            <p>• Propose new initiatives</p>
            <p>• Community-driven decision making</p>
            <p>• Bonus rewards for active participation</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "marketplace",
    title: "Token Marketplace",
    description: "Trade and discover valuable message tokens",
    icon: BarChart3,
    isDemo: true,
    requiresAuth: true,
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 p-4 rounded-lg border border-emerald-400/30">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Featured Token Listings
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-emerald-950/30 rounded border border-emerald-400/20">
              <div>
                <p className="font-medium text-white">"HodlForDiamondHands"</p>
                <p className="text-xs text-gray-400">FLBY-MSG • 500 supply</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-400">0.1 SOL</p>
                <p className="text-xs text-gray-400">+15% 24h</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-950/30 rounded border border-emerald-400/20">
              <div>
                <p className="font-medium text-white">"JoinTheHiveNow"</p>
                <p className="text-xs text-gray-400">FLBY-MSG • 1000 supply</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-400">0.05 SOL</p>
                <p className="text-xs text-gray-400">+8% 24h</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-electric-blue/30">
          <h4 className="font-semibold mb-2">Trading Features</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Real-time price tracking and charts</p>
            <p>• Advanced filtering and search</p>
            <p>• Portfolio management tools</p>
            <p>• Market analytics and insights</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "next-steps",
    title: "Ready to Start?",
    description: "Join the blockchain messaging revolution",
    icon: Zap,
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-electric-blue to-circuit-teal rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gradient mb-2">You're Ready to Begin!</h3>
          <p className="text-gray-400 mb-4">
            Start creating valuable message tokens and join our growing community
            of blockchain innovators.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div className="p-4 bg-gradient-to-r from-electric-blue/20 to-circuit-teal/20 border border-electric-blue/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-electric-blue" />
              <div>
                <p className="font-medium text-white">Connect Your Wallet</p>
                <p className="text-sm text-gray-400">Phantom, Solflare, or any Solana wallet</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-400/30 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-green-400" />
              <div>
                <p className="font-medium text-white">Create Your First Token</p>
                <p className="text-sm text-gray-400">27 characters to blockchain immortality</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-400/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-400" />
              <div>
                <p className="font-medium text-white">Join the Community</p>
                <p className="text-sm text-gray-400">Connect with other tokenized messengers</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-400/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-orange-400" />
            <p className="font-medium text-orange-400">Early Access Special</p>
          </div>
          <p className="text-sm text-gray-400">
            Get free minting codes and exclusive FLBY token airdrops during our launch phase!
          </p>
        </div>
      </div>
    )
  }
];

interface InteractiveTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  autoStart?: boolean;
  skipWelcome?: boolean;
}

export function InteractiveTutorial({ isOpen, onClose, autoStart = false, skipWelcome = false }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(skipWelcome ? 1 : 0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;
  const step = tutorialSteps[currentStep];

  useEffect(() => {
    if (isOpen && autoStart) {
      setIsPlaying(true);
    }
  }, [isOpen, autoStart]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, step.id]));
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepSelect = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setCurrentStep(skipWelcome ? 1 : 0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] bg-slate-900 border-electric-blue/30 overflow-hidden">
        <DialogHeader className="border-b border-electric-blue/20 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gradient">
              Platform Tutorial
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Step {currentStep + 1} of {tutorialSteps.length}
              </span>
              <span className="text-electric-blue font-medium">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-800" />
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Step Navigation Sidebar */}
          <div className="w-64 border-r border-electric-blue/20 p-4 overflow-y-auto">
            <h4 className="font-semibold mb-4 text-gray-300">Tutorial Steps</h4>
            <div className="space-y-2">
              {tutorialSteps.map((tutorialStep, index) => {
                const IconComponent = tutorialStep.icon;
                const isCompleted = completedSteps.has(tutorialStep.id);
                const isCurrent = index === currentStep;
                
                return (
                  <button
                    key={tutorialStep.id}
                    onClick={() => handleStepSelect(index)}
                    className={`
                      w-full text-left p-3 rounded-lg border transition-all duration-200
                      ${isCurrent 
                        ? 'bg-electric-blue/20 border-electric-blue/30 text-white' 
                        : isCompleted
                        ? 'bg-green-900/20 border-green-400/30 text-green-300'
                        : 'bg-slate-800/50 border-gray-700 text-gray-400 hover:bg-slate-800 hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${isCurrent 
                          ? 'bg-electric-blue text-white' 
                          : isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                        }
                      `}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {tutorialStep.title}
                        </p>
                        <p className="text-xs opacity-75 truncate">
                          {tutorialStep.description}
                        </p>
                      </div>
                    </div>
                    {tutorialStep.requiresAuth && (
                      <div className="mt-2 ml-11">
                        <Badge className="bg-orange-600/20 text-orange-400 border-orange-400 text-xs">
                          <Lock className="w-3 h-3 mr-1" />
                          Early Access
                        </Badge>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${step.isDemo 
                        ? 'bg-gradient-to-br from-electric-blue to-circuit-teal' 
                        : 'bg-gradient-to-br from-purple-600 to-pink-600'
                      }
                    `}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                    {step.isDemo && (
                      <Badge className="bg-blue-600/20 text-blue-400 border-blue-400">
                        <Play className="w-3 h-3 mr-1" />
                        Demo
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {step.content}
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="border-t border-electric-blue/20 p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    {currentStep + 1} / {tutorialSteps.length}
                  </p>
                </div>

                {currentStep < tutorialSteps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-gradient-to-r from-electric-blue to-circuit-teal"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleClose}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    Get Started
                    <Zap className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
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
      
      <InteractiveTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        autoStart={true}
      />
    </>
  );
}