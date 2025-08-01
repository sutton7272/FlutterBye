import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  TrendingUp, 
  Zap,
  Gift,
  Users,
  MessageSquare,
  Share2,
  Target,
  Crown,
  Flame
} from "lucide-react";

export function EngagementBooster() {
  const { toast } = useToast();
  const [currentChallenge, setCurrentChallenge] = useState<string>("mint");
  const [streakCount, setStreakCount] = useState(3);
  const [showBonus, setShowBonus] = useState(false);

  useEffect(() => {
    // Simulate daily challenge rotation
    const challenges = ["mint", "sms", "share", "refer"];
    const interval = setInterval(() => {
      setCurrentChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const activateBonus = (bonusType: string) => {
    setShowBonus(true);
    setTimeout(() => setShowBonus(false), 3000);
    
    toast({
      title: "Bonus Activated!",
      description: `${bonusType} bonus is now active for 24 hours`,
    });
  };

  const challenges = {
    mint: {
      title: "Mint Master",
      description: "Create 5 tokens today",
      progress: "3/5",
      reward: "50 XP + Double rewards",
      icon: <Sparkles className="h-4 w-4" />,
      color: "from-purple-500 to-pink-500"
    },
    sms: {
      title: "SMS Wizard",
      description: "Send 3 SMS to blockchain",
      progress: "1/3", 
      reward: "30 XP + SMS bonus",
      icon: <MessageSquare className="h-4 w-4" />,
      color: "from-blue-500 to-cyan-500"
    },
    share: {
      title: "Social Butterfly",
      description: "Share 2 token showcases",
      progress: "0/2",
      reward: "25 XP + Viral multiplier",
      icon: <Share2 className="h-4 w-4" />,
      color: "from-green-500 to-emerald-500"
    },
    refer: {
      title: "Cult Builder",
      description: "Invite 1 friend to Flutterbye",
      progress: "0/1",
      reward: "100 XP + Referral bonus",
      icon: <Users className="h-4 w-4" />,
      color: "from-orange-500 to-red-500"
    }
  };

  const bonuses = [
    {
      id: "double-rewards",
      title: "2x Rewards",
      description: "Double all points earned",
      duration: "24h",
      cost: "50 XP",
      icon: <Crown className="h-4 w-4" />
    },
    {
      id: "gas-discount",
      title: "Gas Discount",
      description: "50% off minting fees",
      duration: "12h", 
      cost: "30 XP",
      icon: <Zap className="h-4 w-4" />
    },
    {
      id: "streak-shield",
      title: "Streak Shield",
      description: "Protect your streak for 3 days",
      duration: "72h",
      cost: "75 XP", 
      icon: <Flame className="h-4 w-4" />
    }
  ];

  const currentChallengeData = challenges[currentChallenge as keyof typeof challenges];

  return (
    <div className="space-y-4">
      
      {/* Daily Challenge */}
      <Card className={`bg-gradient-to-br ${currentChallengeData.color}/10 border-transparent`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${currentChallengeData.color}`}>
                {currentChallengeData.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{currentChallengeData.title}</h4>
                <Badge variant="secondary" className="text-xs">Daily Challenge</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Progress</div>
              <div className="font-bold">{currentChallengeData.progress}</div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {currentChallengeData.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-green-600">
              Reward: {currentChallengeData.reward}
            </span>
            <Badge className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Streak Counter */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-200 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg">
                <Flame className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Current Streak</h4>
                <p className="text-xs text-muted-foreground">Daily activity</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{streakCount}</div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Power-up Store */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="h-4 w-4 text-purple-600" />
            <h4 className="font-semibold text-sm">Power-up Store</h4>
            <Badge variant="outline" className="text-xs">125 XP Available</Badge>
          </div>
          
          <div className="space-y-2">
            {bonuses.map((bonus) => (
              <div 
                key={bonus.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-purple-500/20 rounded">
                    {bonus.icon}
                  </div>
                  <div>
                    <div className="text-xs font-medium">{bonus.title}</div>
                    <div className="text-xs text-muted-foreground">{bonus.description}</div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => activateBonus(bonus.title)}
                >
                  {bonus.cost}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Competitions */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-200 dark:border-cyan-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-600" />
              <h4 className="font-semibold text-sm">Live Competition</h4>
            </div>
            <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Live
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Most Tokens Minted Today</div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">2hXj...M2u5</span>
                <span className="text-muted-foreground ml-2">47 tokens</span>
              </div>
              <Badge variant="secondary" className="text-xs">#1</Badge>
            </div>
            <div className="text-xs text-cyan-600">
              Prize Pool: 5 SOL • Ends in 6h 23m
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bonus Activation Animation */}
      {showBonus && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg shadow-xl animate-bounce">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-bold">BONUS ACTIVATED!</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}