import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bot, Brain, Target, TrendingUp, Lightbulb, Zap, Star, Award, Heart, Clock, Sparkles } from 'lucide-react';

interface AICoachProps {
  userStats: {
    totalMessages: number;
    successRate: number;
    avgViralScore: number;
    totalValue: string;
  };
  onSuggestion: (suggestion: string) => void;
}

export function AICoach({ userStats, onSuggestion }: AICoachProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [coachLevel, setCoachLevel] = useState(1);
  const [achievements, setAchievements] = useState<string[]>([]);

  const personalizedTips = [
    {
      title: "Emotion Diversification Opportunity",
      description: "Your gratitude messages perform 23% better than average. Try mixing in 'hope' emotions for viral amplification.",
      action: "Create Hope-Based Message",
      impact: "Potential +15% viral score",
      icon: Heart,
      color: "from-pink-500 to-red-500"
    },
    {
      title: "Peak Performance Timing",
      description: "Messages sent between 2-4 PM get 34% more engagement. Schedule your next high-value message for optimal reach.",
      action: "Schedule Prime Time",
      impact: "Expected +0.012 SOL value",
      icon: Clock,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Viral Pattern Recognition",
      description: "Your butterfly metaphors create 28% more shares. Consider enhancing messages with transformation imagery.",
      action: "Apply Butterfly Pattern",
      impact: "Viral coefficient +0.3x",
      icon: Sparkles,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Value Optimization Insight",
      description: "Messages with 85-120 characters achieve peak blockchain value. Your current average is 67 characters.",
      action: "Optimize Length",
      impact: "Value increase +18%",
      icon: Target,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const milestones = [
    { threshold: 100, title: "Message Apprentice", reward: "Unlock emotion booster", achieved: userStats.totalMessages >= 100 },
    { threshold: 500, title: "Viral Craftsperson", reward: "Advanced templates access", achieved: userStats.totalMessages >= 500 },
    { threshold: 1000, title: "Butterfly Master", reward: "Custom AI personality", achieved: userStats.totalMessages >= 1000 },
    { threshold: 2500, title: "FlutterWave Legend", reward: "Exclusive creator tools", achieved: userStats.totalMessages >= 2500 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % personalizedTips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate coach level based on performance
    let level = 1;
    if (userStats.successRate > 70) level = 2;
    if (userStats.successRate > 85 && userStats.avgViralScore > 60) level = 3;
    if (userStats.successRate > 90 && userStats.avgViralScore > 75) level = 4;
    setCoachLevel(level);

    // Check achievements
    const newAchievements = milestones.filter(m => m.achieved).map(m => m.title);
    setAchievements(newAchievements);
  }, [userStats]);

  const currentTipData = personalizedTips[currentTip];

  return (
    <div className="space-y-6">
      {/* AI Coach Header */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-400/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">ARIA - Your AI Coach</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-indigo-600/20 text-indigo-200 text-xs">
                    Level {coachLevel} • Advanced Intelligence
                  </Badge>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < coachLevel ? 'text-yellow-400' : 'text-gray-500'}`} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-indigo-200 text-sm">Performance Score</div>
              <div className="text-2xl font-bold text-white">{Math.round(userStats.successRate * userStats.avgViralScore / 100)}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-time Personalized Suggestion */}
      <Card className={`bg-gradient-to-br ${currentTipData.color}/10 border-${currentTipData.color.split('-')[1]}-500/30`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${currentTipData.color}/20`}>
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-white font-semibold text-lg">{currentTipData.title}</h3>
                <p className="text-gray-200 text-sm mt-1">{currentTipData.description}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => onSuggestion(currentTipData.action)}
                    className={`bg-gradient-to-r ${currentTipData.color} text-white`}
                    size="sm"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {currentTipData.action}
                  </Button>
                  <div className="text-green-300 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    {currentTipData.impact}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  Tip {currentTip + 1} of {personalizedTips.length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Milestones */}
      <Card className="bg-black/40 backdrop-blur-sm border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" />
            Progress Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    milestone.achieved 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {milestone.achieved ? '✓' : index + 1}
                  </div>
                  <div>
                    <div className={`font-medium ${milestone.achieved ? 'text-white' : 'text-gray-400'}`}>
                      {milestone.title}
                    </div>
                    <div className="text-xs text-gray-500">{milestone.reward}</div>
                  </div>
                </div>
                <div className={`text-sm ${milestone.achieved ? 'text-green-400' : 'text-gray-400'}`}>
                  {userStats.totalMessages}/{milestone.threshold}
                </div>
              </div>
              
              <Progress 
                value={Math.min((userStats.totalMessages / milestone.threshold) * 100, 100)} 
                className="h-2"
              />
              
              {milestone.achieved && (
                <Badge className="bg-green-600/20 text-green-200 text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Unlocked!
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions Based on Performance */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-400" />
            Smart Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[
              { action: "Boost Low Performers", description: "Revive 3 messages below 50% viral score", color: "bg-red-600/20 text-red-200" },
              { action: "Clone Top Performer", description: "Replicate your best viral pattern", color: "bg-green-600/20 text-green-200" },
              { action: "Schedule Peak Hours", description: "Auto-send during optimal times", color: "bg-blue-600/20 text-blue-200" },
              { action: "Emotion Mixer", description: "Blend successful emotion combinations", color: "bg-purple-600/20 text-purple-200" }
            ].map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className={`${action.color} border-current hover:opacity-80 h-auto p-3 flex-col gap-1`}
                onClick={() => onSuggestion(action.action)}
              >
                <div className="font-medium text-sm">{action.action}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}