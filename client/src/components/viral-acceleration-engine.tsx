import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Zap, TrendingUp, Target, Globe, Users, Star, Flame, Timer, Brain } from 'lucide-react';

interface ViralAccelerationEngineProps {
  onBoostMessage: (boostType: string) => void;
}

export function ViralAccelerationEngine({ onBoostMessage }: ViralAccelerationEngineProps) {
  const [boostEnergy, setBoostEnergy] = useState(87);
  const [activeBoosts, setActiveBoosts] = useState(3);

  const boostOptions = [
    {
      name: "Quantum Amplifier",
      description: "Multiplies viral potential by 3.4x using quantum resonance patterns",
      cost: "12 Boost Points",
      duration: "2 hours",
      effectiveness: 94,
      color: "from-purple-500 to-indigo-600",
      icon: Brain,
      status: "Ready"
    },
    {
      name: "Butterfly Swarm",
      description: "Releases 500+ digital butterflies to carry your message across the network",
      cost: "8 Boost Points", 
      duration: "90 minutes",
      effectiveness: 89,
      color: "from-pink-500 to-purple-500",
      icon: Star,
      status: "Charging"
    },
    {
      name: "Emotion Storm",
      description: "Creates powerful emotional resonance waves that spread organically",
      cost: "15 Boost Points",
      duration: "3 hours", 
      effectiveness: 97,
      color: "from-red-500 to-orange-500",
      icon: Flame,
      status: "Ready"
    },
    {
      name: "Global Wave Pulse",
      description: "Synchronizes with worldwide emotional rhythms for maximum impact",
      cost: "20 Boost Points",
      duration: "4 hours",
      effectiveness: 99,
      color: "from-cyan-500 to-blue-500", 
      icon: Globe,
      status: "Premium"
    }
  ];

  const viralMetrics = {
    currentVelocity: "127 shares/min",
    peakReached: "2,847 simultaneous views",
    cascadeLevel: 4,
    globalReach: "23 countries",
    emotionalResonance: 94.2,
    blockchainMomentum: "High"
  };

  const realtimeBoosts = [
    { message: "Your gratitude wave hit viral velocity!", boost: "3.2x", time: "12s ago" },
    { message: "Butterfly swarm activated in Europe!", boost: "2.8x", time: "34s ago" },
    { message: "Emotion storm brewing in Asia-Pacific!", boost: "4.1x", time: "1m ago" },
    { message: "Quantum amplifier synchronized globally!", boost: "5.7x", time: "2m ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Viral Engine Header */}
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-400/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 animate-pulse"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-spin-slow">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl">Viral Acceleration Engine</div>
              <div className="text-red-200 text-sm font-normal">Supercharge your message's viral potential</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{boostEnergy}%</div>
              <div className="text-xs text-red-200">Boost Energy</div>
              <Progress value={boostEnergy} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{activeBoosts}</div>
              <div className="text-xs text-orange-200">Active Boosts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">5.7x</div>
              <div className="text-xs text-yellow-200">Peak Multiplier</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="boost-select" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black/40">
          <TabsTrigger value="boost-select" className="data-[state=active]:bg-red-600/20">Select Boost</TabsTrigger>
          <TabsTrigger value="real-time" className="data-[state=active]:bg-red-600/20">Live Tracking</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-red-600/20">Viral Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="boost-select" className="space-y-4">
          <div className="grid gap-4">
            {boostOptions.map((boost, index) => (
              <Card key={index} className={`bg-gradient-to-r ${boost.color}/10 border-${boost.color.split('-')[1]}-500/30 hover:scale-[1.02] transition-all`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${boost.color}/20`}>
                        <boost.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white">{boost.name}</h3>
                          <Badge className={`${
                            boost.status === 'Ready' ? 'bg-green-600/20 text-green-200' :
                            boost.status === 'Charging' ? 'bg-yellow-600/20 text-yellow-200' :
                            'bg-purple-600/20 text-purple-200'
                          }`}>
                            {boost.status}
                          </Badge>
                        </div>
                        <p className="text-gray-200 text-sm max-w-md">{boost.description}</p>
                        <div className="flex gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Cost: </span>
                            <span className="text-white font-semibold">{boost.cost}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Duration: </span>
                            <span className="text-white font-semibold">{boost.duration}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Power: </span>
                            <span className="text-green-400 font-semibold">{boost.effectiveness}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => onBoostMessage(boost.name)}
                      disabled={boost.status !== 'Ready'}
                      className={`bg-gradient-to-r ${boost.color} text-white px-8 py-3 ${
                        boost.status !== 'Ready' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      {boost.status === 'Ready' ? 'Activate Boost' : boost.status}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="real-time" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400 animate-bounce" />
                Live Viral Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {realtimeBoosts.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-white text-sm">{activity.message}</div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-600/20 text-green-200">
                    +{activity.boost} boost
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Current Viral Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                  <div className="text-xl font-bold text-blue-400">{viralMetrics.currentVelocity}</div>
                  <div className="text-xs text-blue-200">Viral Velocity</div>
                </div>
                <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                  <div className="text-xl font-bold text-purple-400">{viralMetrics.peakReached}</div>
                  <div className="text-xs text-purple-200">Peak Reach</div>
                </div>
                <div className="text-center p-3 bg-green-500/10 rounded-lg">
                  <div className="text-xl font-bold text-green-400">Level {viralMetrics.cascadeLevel}</div>
                  <div className="text-xs text-green-200">Cascade Level</div>
                </div>
                <div className="text-center p-3 bg-orange-500/10 rounded-lg">
                  <div className="text-xl font-bold text-orange-400">{viralMetrics.globalReach}</div>
                  <div className="text-xs text-orange-200">Global Reach</div>
                </div>
                <div className="text-center p-3 bg-pink-500/10 rounded-lg">
                  <div className="text-xl font-bold text-pink-400">{viralMetrics.emotionalResonance}%</div>
                  <div className="text-xs text-pink-200">Emotional Resonance</div>
                </div>
                <div className="text-center p-3 bg-cyan-500/10 rounded-lg">
                  <div className="text-xl font-bold text-cyan-400">{viralMetrics.blockchainMomentum}</div>
                  <div className="text-xs text-cyan-200">Momentum</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                Viral Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Butterfly Effect Propagation</span>
                    <span className="text-purple-400 font-bold">96%</span>
                  </div>
                  <Progress value={96} className="h-3" />
                  <div className="text-xs text-gray-400 mt-1">Your messages create perfect butterfly effects</div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Emotional Contagion Rate</span>
                    <span className="text-blue-400 font-bold">89%</span>
                  </div>
                  <Progress value={89} className="h-3" />
                  <div className="text-xs text-gray-400 mt-1">High emotional transfer to recipients</div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Network Amplification</span>
                    <span className="text-green-400 font-bold">94%</span>
                  </div>
                  <Progress value={94} className="h-3" />
                  <div className="text-xs text-gray-400 mt-1">Superior network effect generation</div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Blockchain Resonance</span>
                    <span className="text-orange-400 font-bold">91%</span>
                  </div>
                  <Progress value={91} className="h-3" />
                  <div className="text-xs text-gray-400 mt-1">Optimal blockchain integration harmony</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">Viral Mastery Level: Expert</div>
                  <div className="text-purple-200 text-sm">
                    Your messages consistently achieve viral breakthrough. You've mastered the art of emotional blockchain communication.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}