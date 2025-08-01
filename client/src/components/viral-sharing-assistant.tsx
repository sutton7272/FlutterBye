import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Share2, 
  Target, 
  Zap,
  Users,
  Clock,
  Star,
  Trophy,
  ArrowUp
} from "lucide-react";

export function ViralSharingAssistant() {
  const { toast } = useToast();
  const [currentTrend, setCurrentTrend] = useState("meme");

  const trends = {
    meme: {
      name: "Meme Economy",
      hashtags: ["#MemeCoin", "#FlutterbySZN", "#DegenLife"],
      bestTime: "9-11 AM EST",
      audience: "Crypto Twitter",
      multiplier: "3.2x"
    },
    tech: {
      name: "Tech Innovation", 
      hashtags: ["#Web3", "#SolanaEcosystem", "#Blockchain"],
      bestTime: "1-3 PM EST",
      audience: "Tech Community",
      multiplier: "2.8x"
    },
    community: {
      name: "Community Building",
      hashtags: ["#CommunityFirst", "#TogetherWeCult", "#Flutterbye"],
      bestTime: "7-9 PM EST", 
      audience: "Community Leaders",
      multiplier: "2.5x"
    }
  };

  const viralTips = [
    {
      icon: <Clock className="h-4 w-4" />,
      title: "Perfect Timing",
      description: "Post during peak crypto hours (9-11 AM, 1-3 PM EST)",
      impact: "High"
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "Tag Influencers",
      description: "Mention @SolanaFloor @cryptocobain for visibility",
      impact: "Medium"
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: "Trending Hashtags",
      description: "Use 3-5 trending hashtags, mix general and specific",
      impact: "High"
    },
    {
      icon: <Target className="h-4 w-4" />,
      title: "Call to Action",
      description: "Ask followers to reply with their token messages",
      impact: "Medium"
    }
  ];

  const currentTrendData = trends[currentTrend as keyof typeof trends];

  const shareWithStrategy = () => {
    toast({
      title: "Viral Strategy Applied!",
      description: `Using ${currentTrendData.name} strategy for ${currentTrendData.multiplier} engagement boost`,
    });
  };

  return (
    <div className="space-y-4">
      
      {/* Trend Selector */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-200 dark:border-cyan-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-cyan-600" />
            Current Trend
            <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 text-xs">
              <ArrowUp className="h-3 w-3 mr-1" />
              {currentTrendData.multiplier}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            {Object.keys(trends).map((trend) => (
              <Button
                key={trend}
                variant={currentTrend === trend ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTrend(trend)}
                className="text-xs"
              >
                {trends[trend as keyof typeof trends].name}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground">Best Time</div>
              <div className="font-medium">{currentTrendData.bestTime}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Target Audience</div>
              <div className="font-medium">{currentTrendData.audience}</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {currentTrendData.hashtags.map((hashtag) => (
              <Badge key={hashtag} variant="secondary" className="text-xs">
                {hashtag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Viral Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-yellow-600" />
            Viral Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {viralTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="p-1 bg-purple-500/20 rounded">
                {tip.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-medium">{tip.title}</div>
                  <Badge 
                    variant={tip.impact === "High" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {tip.impact}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{tip.description}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Tracking */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-sm">Your Viral Score</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">847</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="text-center">
              <div className="font-bold">23</div>
              <div className="text-muted-foreground">Shares</div>
            </div>
            <div className="text-center">
              <div className="font-bold">156</div>
              <div className="text-muted-foreground">Reactions</div>
            </div>
            <div className="text-center">
              <div className="font-bold">12</div>
              <div className="text-muted-foreground">Converts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Share Button */}
      <Button 
        onClick={shareWithStrategy}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share with Viral Strategy
      </Button>
    </div>
  );
}