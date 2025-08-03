import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, Globe, Heart, MessageSquare, Star, Trophy, Flame, Target } from 'lucide-react';

interface CommunityInsightsProps {
  onJoinTrend: (trend: string) => void;
}

export function CommunityInsights({ onJoinTrend }: CommunityInsightsProps) {
  const [selectedRegion, setSelectedRegion] = useState('global');

  const globalTrends = [
    {
      trend: "Gratitude Waves",
      participants: 1247,
      growth: '+23%',
      description: "Thank you messages creating positive ripples worldwide",
      topMessage: "Thank you for making my world brighter! ✨",
      avgValue: "0.047 SOL",
      viralScore: 89,
      regions: ['Americas', 'Europe', 'Asia'],
      emotion: 'Gratitude',
      color: 'from-pink-500 to-red-500'
    },
    {
      trend: "Hope Springs",
      participants: 892,
      growth: '+31%',
      description: "Messages of hope spreading like wildfire across continents",
      topMessage: "Tomorrow brings new possibilities! 🌅",
      avgValue: "0.039 SOL",
      viralScore: 94,
      regions: ['Global'],
      emotion: 'Hope',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      trend: "Success Celebrations",
      participants: 674,
      growth: '+18%',
      description: "Achievements and victories being shared and amplified",
      topMessage: "Your hard work is paying off beautifully! 🏆",
      avgValue: "0.052 SOL",
      viralScore: 87,
      regions: ['Americas', 'Europe'],
      emotion: 'Pride',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      trend: "Butterfly Transformations",
      participants: 543,
      growth: '+42%',
      description: "Personal growth stories inspiring massive transformation",
      topMessage: "Like a butterfly, you're becoming who you're meant to be! 🦋",
      avgValue: "0.061 SOL",
      viralScore: 96,
      regions: ['Global'],
      emotion: 'Inspiration',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const communityStats = {
    totalUsers: 47892,
    activeToday: 8934,
    messagesShared: 234567,
    totalValue: "1,247.8 SOL",
    countriesReached: 89,
    languagesUsed: 23
  };

  const topCreators = [
    { name: "ButterflyMaven", messages: 3247, value: "89.4 SOL", specialty: "Inspiration", badge: "🦋 Master", rank: 1 },
    { name: "GratitudeGuru", messages: 2891, value: "76.2 SOL", specialty: "Gratitude", badge: "🙏 Sage", rank: 2 },
    { name: "HopeWeaver", messages: 2543, value: "68.7 SOL", specialty: "Hope", badge: "⭐ Luminary", rank: 3 },
    { name: "JoyBringer", messages: 2234, value: "62.1 SOL", specialty: "Joy", badge: "🎉 Catalyst", rank: 4 }
  ];

  const regionalHotspots = [
    { region: "San Francisco Bay", activity: 94, topEmotion: "Innovation", trend: "Tech gratitude wave" },
    { region: "London-Paris Corridor", activity: 91, topEmotion: "Hope", trend: "Cross-cultural inspiration" },
    { region: "Tokyo Metropolitan", activity: 87, topEmotion: "Harmony", trend: "Mindful appreciation" },
    { region: "New York Tri-State", activity: 89, topEmotion: "Ambition", trend: "Success celebration" }
  ];

  return (
    <div className="space-y-6">
      {/* Community Overview */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-400" />
            Global FlutterWave Community
          </CardTitle>
          <p className="text-blue-200 text-sm">
            Real-time insights from the world's largest emotional blockchain network
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{communityStats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{communityStats.activeToday.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Active Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{communityStats.messagesShared.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Messages Shared</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{communityStats.totalValue}</div>
              <div className="text-xs text-gray-400">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{communityStats.countriesReached}</div>
              <div className="text-xs text-gray-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{communityStats.languagesUsed}</div>
              <div className="text-xs text-gray-400">Languages</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/40">
          <TabsTrigger value="trends" className="data-[state=active]:bg-purple-600/20">Viral Trends</TabsTrigger>
          <TabsTrigger value="creators" className="data-[state=active]:bg-purple-600/20">Top Creators</TabsTrigger>
          <TabsTrigger value="regions" className="data-[state=active]:bg-purple-600/20">Regional Hotspots</TabsTrigger>
          <TabsTrigger value="real-time" className="data-[state=active]:bg-purple-600/20">Live Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4">
            {globalTrends.map((trend, index) => (
              <Card key={index} className={`bg-gradient-to-r ${trend.color}/10 border-${trend.color.split('-')[1]}-500/30 hover:scale-[1.02] transition-all`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${trend.color}/20`}>
                        <Flame className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{trend.trend}</h3>
                        <p className="text-gray-200 text-sm">{trend.description}</p>
                      </div>
                    </div>
                    <Badge className={`bg-gradient-to-r ${trend.color}/20 text-white`}>
                      {trend.growth} growth
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Top Message</div>
                        <div className="text-white text-sm italic">"{trend.topMessage}"</div>
                      </div>
                      
                      <div className="flex gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Participants</div>
                          <div className="text-white font-semibold">{trend.participants.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Avg Value</div>
                          <div className="text-green-400 font-semibold">{trend.avgValue}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Viral Score</div>
                          <div className="text-blue-400 font-semibold">{trend.viralScore}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Active Regions</div>
                        <div className="flex flex-wrap gap-1">
                          {trend.regions.map((region, i) => (
                            <Badge key={i} className="bg-white/10 text-white text-xs">
                              {region}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => onJoinTrend(trend.trend)}
                        className={`w-full bg-gradient-to-r ${trend.color} text-white`}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Join This Trend
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="creators" className="space-y-4">
          <div className="grid gap-4">
            {topCreators.map((creator, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-sm border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        #{creator.rank}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{creator.name}</div>
                        <div className="text-yellow-200 text-sm">{creator.badge}</div>
                        <div className="text-xs text-gray-400">Specializes in {creator.specialty}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{creator.messages.toLocaleString()} messages</div>
                      <div className="text-green-400 font-semibold">{creator.value} earned</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <div className="grid gap-4">
            {regionalHotspots.map((hotspot, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-sm border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Globe className="h-6 w-6 text-green-400" />
                      <div>
                        <div className="text-white font-semibold">{hotspot.region}</div>
                        <div className="text-green-200 text-sm">{hotspot.trend}</div>
                      </div>
                    </div>
                    <Badge className="bg-green-600/20 text-green-200">
                      {hotspot.activity}% active
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-1">Top Emotion: {hotspot.topEmotion}</div>
                      <Progress value={hotspot.activity} className="h-2" />
                    </div>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      <Target className="h-4 w-4 mr-1" />
                      Target Region
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="real-time" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                Live Message Stream
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { user: "Anonymous User", message: "Sending love across the blockchain! 💕", location: "San Francisco", time: "2s ago", value: "0.034 SOL" },
                { user: "ButterflyLover", message: "Your transformation inspires us all! ✨", location: "London", time: "7s ago", value: "0.041 SOL" },
                { user: "GratefulHeart", message: "Thank you for believing in dreams! 🌟", location: "Tokyo", time: "12s ago", value: "0.029 SOL" },
                { user: "HopeBuilder", message: "Together we create a better tomorrow! 🚀", location: "New York", time: "18s ago", value: "0.037 SOL" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <div className="text-white text-sm">"{activity.message}"</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {activity.user} • {activity.location} • {activity.time}
                    </div>
                  </div>
                  <div className="text-green-400 font-semibold text-sm">{activity.value}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}