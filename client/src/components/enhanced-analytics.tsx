import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Users, Globe, Zap, Heart, Star, Target, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  totalMessages: number;
  totalValue: string;
  successRate: number;
  avgViralScore: number;
  topEmotions: Array<{ name: string; count: number; percentage: number }>;
  recentPerformance: Array<{ period: string; messages: number; value: string; growth: number }>;
  globalReach: {
    countries: number;
    cities: number;
    totalReach: number;
  };
  viralMetrics: {
    totalShares: number;
    peakVelocity: string;
    viralCoefficient: number;
  };
}

interface EnhancedAnalyticsProps {
  data?: AnalyticsData;
}

export function EnhancedAnalytics({ data }: EnhancedAnalyticsProps) {
  // Mock data for demonstration
  const analyticsData: AnalyticsData = data || {
    totalMessages: 1247,
    totalValue: "42.7 SOL",
    successRate: 89.3,
    avgViralScore: 73.2,
    topEmotions: [
      { name: "Gratitude", count: 342, percentage: 27.4 },
      { name: "Love", count: 298, percentage: 23.9 },
      { name: "Joy", count: 234, percentage: 18.8 },
      { name: "Hope", count: 189, percentage: 15.2 },
      { name: "Inspiration", count: 184, percentage: 14.7 }
    ],
    recentPerformance: [
      { period: "Today", messages: 47, value: "1.8 SOL", growth: 12.3 },
      { period: "This Week", messages: 298, value: "11.2 SOL", growth: 8.7 },
      { period: "This Month", messages: 1247, value: "42.7 SOL", growth: 15.4 }
    ],
    globalReach: {
      countries: 23,
      cities: 156,
      totalReach: 47892
    },
    viralMetrics: {
      totalShares: 8943,
      peakVelocity: "127 shares/min",
      viralCoefficient: 2.34
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{analyticsData.totalMessages.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Total Messages</div>
            <div className="text-xs text-green-300 mt-1">+12.3% this week</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{analyticsData.totalValue}</div>
            <div className="text-xs text-gray-400">Total Value</div>
            <div className="text-xs text-blue-300 mt-1">+8.7% this week</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{analyticsData.successRate}%</div>
            <div className="text-xs text-gray-400">Success Rate</div>
            <div className="text-xs text-purple-300 mt-1">+2.1% this week</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{analyticsData.avgViralScore}%</div>
            <div className="text-xs text-gray-400">Avg Viral Score</div>
            <div className="text-xs text-orange-300 mt-1">+5.4% this week</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Emotions */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-400" />
              Top Performing Emotions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.topEmotions.map((emotion, index) => (
              <div key={emotion.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-pink-500' :
                      index === 1 ? 'bg-red-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-blue-500' : 'bg-purple-500'
                    }`} />
                    <span className="text-white font-medium">{emotion.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">{emotion.count}</div>
                    <div className="text-gray-400 text-xs">{emotion.percentage}%</div>
                  </div>
                </div>
                <Progress value={emotion.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.recentPerformance.map((period, index) => (
              <div key={period.period} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{period.period}</span>
                  <Badge className={`${
                    period.growth > 10 ? 'bg-green-600/20 text-green-200' :
                    period.growth > 5 ? 'bg-blue-600/20 text-blue-200' :
                    'bg-gray-600/20 text-gray-200'
                  }`}>
                    +{period.growth}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Messages</div>
                    <div className="text-white font-semibold">{period.messages}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Value</div>
                    <div className="text-white font-semibold">{period.value}</div>
                  </div>
                </div>
                {index < analyticsData.recentPerformance.length - 1 && <Separator className="bg-gray-600" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Global Reach */}
        <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-400" />
              Global Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{analyticsData.globalReach.countries}</div>
                <div className="text-xs text-gray-400">Countries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{analyticsData.globalReach.cities}</div>
                <div className="text-xs text-gray-400">Cities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{analyticsData.globalReach.totalReach.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Total Reach</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
              <div className="text-green-200 text-sm text-center">
                Your messages have created positive waves across {analyticsData.globalReach.countries} countries! 🌍
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Viral Metrics */}
        <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-400" />
              Viral Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Shares</span>
                <span className="text-white font-bold">{analyticsData.viralMetrics.totalShares.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Peak Velocity</span>
                <span className="text-orange-400 font-bold">{analyticsData.viralMetrics.peakVelocity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Viral Coefficient</span>
                <Badge className="bg-orange-600/20 text-orange-200">
                  {analyticsData.viralMetrics.viralCoefficient}x
                </Badge>
              </div>
            </div>
            <div className="mt-4 p-3 bg-orange-500/10 rounded-lg">
              <div className="text-orange-200 text-sm text-center">
                <Star className="h-4 w-4 inline mr-1" />
                Your content is spreading 2.3x faster than average!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badges */}
      <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Viral Master", description: "100+ viral messages", icon: "🚀", unlocked: true },
              { name: "Emotion Wizard", description: "5 different emotions", icon: "🧙‍♂️", unlocked: true },
              { name: "Global Connector", description: "Reached 20+ countries", icon: "🌍", unlocked: true },
              { name: "Value Creator", description: "Generated 50+ SOL", icon: "💎", unlocked: false }
            ].map((achievement, index) => (
              <div key={index} className={`p-3 rounded-lg border text-center ${
                achievement.unlocked 
                  ? 'bg-purple-500/20 border-purple-400/30' 
                  : 'bg-gray-500/10 border-gray-500/30'
              }`}>
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <div className={`font-semibold text-sm ${
                  achievement.unlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">{achievement.description}</div>
                {achievement.unlocked && (
                  <Badge className="mt-2 bg-green-600/20 text-green-200 text-xs">
                    Unlocked!
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}