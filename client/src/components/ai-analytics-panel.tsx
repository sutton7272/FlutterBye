import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Zap,
  Target,
  Eye,
  Heart,
  MessageSquare,
  Sparkles,
  BarChart3,
  Globe,
  Clock
} from "lucide-react";

interface AIAnalytics {
  userEngagement: {
    score: number;
    trend: 'up' | 'down' | 'stable';
    insights: string[];
  };
  contentPerformance: {
    viralPotential: number;
    emotionalResonance: number;
    shareability: number;
  };
  platformOptimization: {
    conversionRate: number;
    retentionRate: number;
    satisfactionScore: number;
  };
  predictive: {
    nextWeekGrowth: number;
    trendingTopics: string[];
    recommendations: string[];
  };
}

export function AIAnalyticsPanel() {
  const [timeRange, setTimeRange] = useState("7d");
  
  // Fetch AI analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/ai/analytics', timeRange],
    staleTime: 60000, // Cache for 1 minute
  });

  // Simulate AI analytics data
  const mockAnalytics: AIAnalytics = {
    userEngagement: {
      score: 87,
      trend: 'up',
      insights: [
        "User engagement up 23% this week",
        "Peak activity during 2-4 PM EST",
        "Mobile users show 45% higher engagement"
      ]
    },
    contentPerformance: {
      viralPotential: 92,
      emotionalResonance: 78,
      shareability: 85
    },
    platformOptimization: {
      conversionRate: 12.4,
      retentionRate: 84.2,
      satisfactionScore: 9.1
    },
    predictive: {
      nextWeekGrowth: 15,
      trendingTopics: ["DeFi Innovation", "AI Partnerships", "Cross-chain Bridges"],
      recommendations: [
        "Increase content posting during peak hours",
        "Focus on mobile optimization",
        "Leverage AI-generated content for viral potential"
      ]
    }
  };

  const data = analytics || mockAnalytics;

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingUp className="h-4 w-4 rotate-180" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-electric-blue border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="circuit-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-electric-blue" />
            AI Analytics Dashboard
          </CardTitle>
          <div className="flex gap-2">
            {['1d', '7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-electric-blue" />
                  Engagement Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold">{data.userEngagement.score}</div>
                  <div className={`flex items-center gap-1 ${getTrendColor(data.userEngagement.trend)}`}>
                    {getTrendIcon(data.userEngagement.trend)}
                    <span className="text-sm font-medium">{data.userEngagement.trend}</span>
                  </div>
                </div>
                <Progress value={data.userEngagement.score} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-purple" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.userEngagement.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-electric-blue rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-electric-green" />
                  Real-time Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Users</span>
                    <Badge variant="outline">1,247</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Session Duration</span>
                    <Badge variant="outline">8m 34s</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bounce Rate</span>
                    <Badge variant="outline">23%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-electric-blue" />
                  Viral Potential
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{data.contentPerformance.viralPotential}%</div>
                <Progress value={data.contentPerformance.viralPotential} className="mb-2" />
                <p className="text-sm text-muted-foreground">Extremely high viral potential</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5 text-red-500" />
                  Emotional Resonance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{data.contentPerformance.emotionalResonance}%</div>
                <Progress value={data.contentPerformance.emotionalResonance} className="mb-2" />
                <p className="text-sm text-muted-foreground">Strong emotional connection</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-electric-green" />
                  Shareability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{data.contentPerformance.shareability}%</div>
                <Progress value={data.contentPerformance.shareability} className="mb-2" />
                <p className="text-sm text-muted-foreground">High share potential</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-electric-blue" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{data.platformOptimization.conversionRate}%</div>
                <Progress value={data.platformOptimization.conversionRate * 5} className="mb-2" />
                <p className="text-sm text-muted-foreground">Above industry average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-purple" />
                  Retention Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{data.platformOptimization.retentionRate}%</div>
                <Progress value={data.platformOptimization.retentionRate} className="mb-2" />
                <p className="text-sm text-muted-foreground">Excellent retention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-electric-green" />
                  Satisfaction Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{data.platformOptimization.satisfactionScore}/10</div>
                <Progress value={data.platformOptimization.satisfactionScore * 10} className="mb-2" />
                <p className="text-sm text-muted-foreground">Outstanding satisfaction</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-electric-blue" />
                  Growth Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Next Week Growth</span>
                      <span className="text-lg font-bold text-electric-green">+{data.predictive.nextWeekGrowth}%</span>
                    </div>
                    <Progress value={data.predictive.nextWeekGrowth * 2} />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Trending Topics</h4>
                    <div className="space-y-2">
                      {data.predictive.trendingTopics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="mr-2">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.predictive.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-electric-blue rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}