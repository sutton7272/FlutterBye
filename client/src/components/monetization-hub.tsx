import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Coins, CreditCard, Wallet, Star, Trophy, Target, Gem, Zap } from 'lucide-react';

interface MonetizationHubProps {
  onUpgrade: (plan: string) => void;
  onPurchase: (item: string) => void;
}

export function MonetizationHub({ onUpgrade, onPurchase }: MonetizationHubProps) {
  const [currentTier, setCurrentTier] = useState('free');
  const [earnedToday, setEarnedToday] = useState(2.47);

  const subscriptionTiers = [
    {
      name: "FlutterWave Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with emotional blockchain messaging",
      features: [
        "5 messages per day",
        "Basic emotion analysis", 
        "Community access",
        "Standard templates"
      ],
      color: "from-gray-500 to-gray-600",
      badge: "Current Plan",
      popular: false
    },
    {
      name: "FlutterWave Pro",
      price: "$29",
      period: "per month",
      description: "Unlock advanced AI features and boost your viral potential",
      features: [
        "Unlimited messages",
        "Advanced AI coach (ARIA)",
        "Smart scheduling",
        "Premium templates",
        "Priority support"
      ],
      color: "from-blue-500 to-cyan-500",
      badge: "Most Popular",
      popular: true
    },
    {
      name: "FlutterWave Elite",
      price: "$89",
      period: "per month", 
      description: "Maximum viral power with exclusive tools and analytics",
      features: [
        "Everything in Pro",
        "Viral acceleration engine",
        "Advanced analytics",
        "Custom AI personalities",
        "White-label options",
        "Revenue sharing program"
      ],
      color: "from-purple-500 to-pink-500",
      badge: "Maximum Power",
      popular: false
    }
  ];

  const powerUps = [
    {
      name: "Viral Boost Pack",
      description: "10x viral acceleration charges for your most important messages",
      price: "$9.99",
      originalPrice: "$19.99",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      discount: "50% OFF"
    },
    {
      name: "Premium Templates",
      description: "Access to 100+ high-performing message templates",
      price: "$14.99",
      originalPrice: null,
      icon: Star,
      color: "from-blue-500 to-purple-500",
      discount: null
    },
    {
      name: "Analytics Pro",
      description: "Advanced emotional analytics and trend prediction tools",
      price: "$19.99",
      originalPrice: "$29.99",
      icon: TrendingUp,
      color: "from-green-500 to-cyan-500",
      discount: "33% OFF"
    },
    {
      name: "AI Personality Pack",
      description: "5 custom AI coach personalities for different strategies",
      price: "$24.99",
      originalPrice: null,
      icon: Gem,
      color: "from-purple-500 to-indigo-500",
      discount: null
    }
  ];

  const revenueStreams = [
    {
      source: "Message Value Creation",
      earned: "1.83 SOL",
      percentage: 74,
      growth: "+12%"
    },
    {
      source: "Viral Bonuses",
      earned: "0.47 SOL", 
      percentage: 19,
      growth: "+28%"
    },
    {
      source: "Community Rewards",
      earned: "0.17 SOL",
      percentage: 7,
      growth: "+5%"
    }
  ];

  const achievements = [
    { name: "First Viral Message", reward: "0.05 SOL", unlocked: true },
    { name: "100 Messages Milestone", reward: "0.1 SOL", unlocked: true },
    { name: "Top 1% Creator", reward: "0.25 SOL", unlocked: false },
    { name: "Global Trend Starter", reward: "0.5 SOL", unlocked: false }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl">Monetization Hub</div>
              <div className="text-green-200 text-sm font-normal">Turn emotions into earnings</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{earnedToday} SOL</div>
              <div className="text-xs text-green-200">Earned Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">42.7 SOL</div>
              <div className="text-xs text-blue-200">Total Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">89.3%</div>
              <div className="text-xs text-purple-200">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">2.8x</div>
              <div className="text-xs text-orange-200">Avg Multiplier</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/40">
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-green-600/20">Plans</TabsTrigger>
          <TabsTrigger value="powerups" className="data-[state=active]:bg-green-600/20">Power-Ups</TabsTrigger>
          <TabsTrigger value="earnings" className="data-[state=active]:bg-green-600/20">Earnings</TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-green-600/20">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionTiers.map((tier, index) => (
              <Card key={index} className={`bg-gradient-to-br ${tier.color}/10 border-${tier.color.split('-')[1]}-500/30 ${tier.popular ? 'ring-2 ring-cyan-400/50 scale-105' : ''}`}>
                <CardHeader className="text-center">
                  <div className="mb-2">
                    <Badge className={`${
                      tier.popular ? 'bg-cyan-600/20 text-cyan-200' :
                      tier.name.includes('Free') ? 'bg-gray-600/20 text-gray-200' :
                      'bg-purple-600/20 text-purple-200'
                    }`}>
                      {tier.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-2xl">{tier.name}</CardTitle>
                  <div className="text-4xl font-bold text-white mb-2">
                    {tier.price}
                    <span className="text-lg font-normal text-gray-300">/{tier.period}</span>
                  </div>
                  <p className="text-gray-200 text-sm">{tier.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-200">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => onUpgrade(tier.name)}
                    className={`w-full ${
                      tier.name.includes('Free') 
                        ? 'bg-gray-600 text-white cursor-not-allowed' 
                        : tier.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    }`}
                    disabled={tier.name.includes('Free')}
                  >
                    {tier.name.includes('Free') ? 'Current Plan' : `Upgrade to ${tier.name.split(' ')[1]}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="powerups" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {powerUps.map((powerup, index) => (
              <Card key={index} className={`bg-gradient-to-br ${powerup.color}/10 border-${powerup.color.split('-')[1]}-500/30 hover:scale-[1.02] transition-all`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${powerup.color}/20`}>
                        <powerup.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{powerup.name}</h3>
                        {powerup.discount && (
                          <Badge className="bg-red-600/20 text-red-200 text-xs">
                            {powerup.discount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-200 text-sm mb-4">{powerup.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{powerup.price}</span>
                      {powerup.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">{powerup.originalPrice}</span>
                      )}
                    </div>
                    <Button
                      onClick={() => onPurchase(powerup.name)}
                      className={`bg-gradient-to-r ${powerup.color} text-white`}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Purchase
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Coins className="h-5 w-5 text-green-400" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {revenueStreams.map((stream, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{stream.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-bold">{stream.earned}</span>
                      <Badge className="bg-green-600/20 text-green-200 text-xs">
                        {stream.growth}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={stream.percentage} className="h-2" />
                  <div className="text-xs text-gray-400">{stream.percentage}% of total earnings</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-400" />
                Projected Earnings (Next 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-blue-400">12.8 SOL</div>
                <div className="text-blue-200">Based on current performance trends</div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">4.2 SOL</div>
                    <div className="text-xs text-gray-400">Conservative</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">12.8 SOL</div>
                    <div className="text-xs text-gray-400">Expected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">23.1 SOL</div>
                    <div className="text-xs text-gray-400">Optimistic</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-sm border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Achievement Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  achievement.unlocked 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-gray-500/10 border border-gray-500/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {achievement.unlocked ? '✓' : '?'}
                    </div>
                    <div>
                      <div className={`font-medium ${
                        achievement.unlocked ? 'text-white' : 'text-gray-400'
                      }`}>
                        {achievement.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Reward: {achievement.reward}
                      </div>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-green-600/20 text-green-200">
                      Claimed
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}