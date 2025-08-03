import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Smartphone, 
  Heart, 
  Clock, 
  Flame, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Brain, 
  Target,
  TrendingUp,
  Users,
  Globe,
  Rocket,
  Bot,
  Share2,
  DollarSign,
  BarChart3,
  Eye,
  ChevronRight,
  Star,
  Lightning,
  Coins,
  Calendar,
  MessageCircle,
  Send
} from "lucide-react";

export function SMSNexusPage() {
  const [aiMessage, setAiMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [viralScore, setViralScore] = useState(0);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const { toast } = useToast();

  // Revolutionary AI-powered emotion analysis
  const analyzeEmotionMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch("/api/ai/analyze-emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, userId: 'demo-user' }),
      });
      if (!response.ok) throw new Error("Failed to analyze emotion");
      return response.json();
    },
    onSuccess: (data) => {
      const analysis = data.analysis;
      const viral = data.viralPrediction;
      
      setLastAnalysis({
        emotion: analysis.primaryEmotion,
        confidence: analysis.emotionIntensity / 10,
        viralPotential: analysis.viralPotential,
        suggestions: analysis.suggestedOptimizations,
        optimizedMessage: `${aiMessage} ${analysis.primaryEmotion === 'love' ? '💕' : analysis.primaryEmotion === 'joy' ? '🎉' : '✨'}`,
        engagementScore: Math.round(viral.engagementRate),
        reachPotential: viral.expectedReach,
        blockchainValue: analysis.blockchainValue,
        timeToViral: analysis.timeToViralPeak,
        culturalResonance: analysis.culturalResonance,
        emotionalTriggers: analysis.emotionalTriggers,
        targetDemographics: analysis.targetDemographics,
        viralCoefficient: viral.viralCoefficient,
        shareVelocity: viral.shareVelocity,
        peakTimestamp: viral.peakTimestamp
      });
      setViralScore(analysis.viralPotential * 100);
      
      toast({
        title: "AI Analysis Complete!",
        description: `Detected ${analysis.primaryEmotion} with ${Math.round(analysis.viralPotential * 100)}% viral potential`,
      });
    }
  });

  // Revolutionary AI campaign generator
  const generateCampaignMutation = useMutation({
    mutationFn: async (params: { audience: string; goal: string; intensity: number }) => {
      const response = await fetch("/api/ai/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          targetAudience: params.audience, 
          campaignGoal: params.goal, 
          emotionIntensity: params.intensity,
          brandVoice: 'authentic'
        }),
      });
      if (!response.ok) throw new Error("Failed to generate campaign");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "AI Campaign Generated!",
        description: `Smart campaign created with ${data.campaign.estimatedReach?.toLocaleString()} estimated reach and ${data.campaign.roi} ROI`,
      });
    }
  });

  // Real-time stats
  const { data: realtimeStats } = useQuery({
    queryKey: ['/api/sms/analytics'],
    refetchInterval: 5000,
    select: (data) => data?.analytics || {
      totalMessages: 2847,
      activeUsers: 1234,
      conversionRate: 23.4,
      averageValue: 0.025,
      viralCoefficient: 1.8,
      recentGrowth: 15.2
    }
  });

  const groundbreakingFeatures = [
    {
      title: "AI Emotion Amplification",
      description: "Our neural networks analyze sentiment and automatically boost emotional impact",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      stats: "94% accuracy"
    },
    {
      title: "Viral Velocity Engine",
      description: "Predictive algorithms determine viral potential and optimize message timing",
      icon: Rocket,
      color: "from-blue-500 to-cyan-500",
      stats: "3.2x reach boost"
    },
    {
      title: "Quantum Message Threading",
      description: "Messages create interconnected emotional networks across recipients",
      icon: Share2,
      color: "from-green-500 to-emerald-500",
      stats: "Infinite scalability"
    },
    {
      title: "Emotional Market Dynamics",
      description: "Real-time emotion pricing based on supply, demand, and social sentiment",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      stats: "Live pricing"
    }
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-900 via-purple-900/20 to-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SMS Nexus
            </h1>
          </div>
          <p className="text-2xl text-purple-200 max-w-4xl mx-auto">
            The world's first AI-powered emotional blockchain messaging platform that turns text into treasured digital assets
          </p>
          
          {/* Live Stats Bar */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{realtimeStats?.totalMessages?.toLocaleString()}</div>
                <div className="text-sm text-gray-300">Messages Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{realtimeStats?.activeUsers?.toLocaleString()}</div>
                <div className="text-sm text-gray-300">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{realtimeStats?.conversionRate}%</div>
                <div className="text-sm text-gray-300">Conversion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{realtimeStats?.averageValue} SOL</div>
                <div className="text-sm text-gray-300">Avg Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">{realtimeStats?.viralCoefficient}x</div>
                <div className="text-sm text-gray-300">Viral Coefficient</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">+{realtimeStats?.recentGrowth}%</div>
                <div className="text-sm text-gray-300">24h Growth</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tabs Interface */}
        <Tabs defaultValue="ai-composer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-sm">
            <TabsTrigger value="ai-composer" className="data-[state=active]:bg-purple-600">
              🧠 AI Composer
            </TabsTrigger>
            <TabsTrigger value="campaign-nexus" className="data-[state=active]:bg-blue-600">
              🚀 Campaign Nexus
            </TabsTrigger>
            <TabsTrigger value="viral-lab" className="data-[state=active]:bg-green-600">
              ⚡ Viral Lab
            </TabsTrigger>
            <TabsTrigger value="analytics-hub" className="data-[state=active]:bg-orange-600">
              📊 Analytics Hub
            </TabsTrigger>
          </TabsList>

          {/* AI Composer Tab */}
          <TabsContent value="ai-composer" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-400" />
                    AI-Powered Message Composer
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Let our neural networks optimize your message for maximum emotional impact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Your Message</Label>
                    <Textarea
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      placeholder="Type your emotional message here..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Emotional Intensity</Label>
                    <div className="px-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={emotionIntensity}
                        onChange={(e) => setEmotionIntensity(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>Subtle</span>
                        <span className="text-purple-400 font-bold">{emotionIntensity}/10</span>
                        <span>Intense</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => analyzeEmotionMutation.mutate(aiMessage)}
                    disabled={!aiMessage.trim() || analyzeEmotionMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {analyzeEmotionMutation.isPending ? (
                      "Analyzing..."
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze & Optimize
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Analysis Results */}
              {lastAnalysis && (
                <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-400/30">
                  <CardHeader>
                    <CardTitle className="text-green-300 flex items-center gap-2">
                      <Sparkles className="h-6 w-6" />
                      AI Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-300">Detected Emotion</div>
                        <Badge className="bg-purple-600/20 text-purple-200 text-lg">
                          {lastAnalysis.emotion}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-300">Confidence</div>
                        <div className="text-2xl font-bold text-green-400">
                          {Math.round(lastAnalysis.confidence * 100)}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">Viral Potential</div>
                      <Progress value={viralScore} className="h-3" />
                      <div className="text-right text-sm text-blue-400">
                        {Math.round(viralScore)}% viral score
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">Optimized Message</div>
                      <div className="p-3 bg-black/40 rounded-lg text-white border border-green-400/30">
                        "{lastAnalysis.optimizedMessage}"
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">AI Recommendations</div>
                      <div className="space-y-1">
                        {lastAnalysis.suggestions.map((suggestion: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-blue-200">
                            <ArrowRight className="h-3 w-3" />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>

                    {lastAnalysis.emotionalTriggers && lastAnalysis.emotionalTriggers.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-300">Emotional Triggers Detected</div>
                        <div className="flex flex-wrap gap-1">
                          {lastAnalysis.emotionalTriggers.map((trigger: string, index: number) => (
                            <Badge key={index} className="bg-yellow-600/20 text-yellow-200 text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {lastAnalysis.targetDemographics && (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-300">Target Demographics</div>
                        <div className="flex flex-wrap gap-1">
                          {lastAnalysis.targetDemographics.map((demo: string, index: number) => (
                            <Badge key={index} className="bg-cyan-600/20 text-cyan-200 text-xs">
                              {demo}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center p-3 bg-blue-500/20 rounded-lg">
                        <div className="text-lg font-bold text-blue-300">
                          {lastAnalysis.engagementScore}%
                        </div>
                        <div className="text-xs text-gray-300">Engagement Rate</div>
                      </div>
                      <div className="text-center p-3 bg-purple-500/20 rounded-lg">
                        <div className="text-lg font-bold text-purple-300">
                          {lastAnalysis.reachPotential?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-300">Est. Reach</div>
                      </div>
                    </div>

                    {lastAnalysis.blockchainValue && (
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="text-center p-2 bg-green-500/20 rounded-lg">
                          <div className="text-sm font-bold text-green-300">
                            {lastAnalysis.blockchainValue} SOL
                          </div>
                          <div className="text-xs text-gray-300">Token Value</div>
                        </div>
                        <div className="text-center p-2 bg-orange-500/20 rounded-lg">
                          <div className="text-sm font-bold text-orange-300">
                            {lastAnalysis.timeToViral?.toFixed(1)}h
                          </div>
                          <div className="text-xs text-gray-300">Time to Peak</div>
                        </div>
                        <div className="text-center p-2 bg-pink-500/20 rounded-lg">
                          <div className="text-sm font-bold text-pink-300">
                            {lastAnalysis.viralCoefficient?.toFixed(1)}x
                          </div>
                          <div className="text-xs text-gray-300">Viral Coefficient</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Campaign Nexus Tab */}
          <TabsContent value="campaign-nexus" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-6 w-6 text-blue-400" />
                    Smart Campaign Generator
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    AI-powered campaigns tailored to your audience and goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Target Audience</Label>
                    <Input
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g., Millennials, Entrepreneurs, Families"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Campaign Goal</Label>
                    <Input
                      value={campaignGoal}
                      onChange={(e) => setCampaignGoal(e.target.value)}
                      placeholder="e.g., Increase engagement, Drive sales, Build community"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <Button
                    onClick={() => generateCampaignMutation.mutate({ 
                      audience: targetAudience, 
                      goal: campaignGoal, 
                      intensity: emotionIntensity 
                    })}
                    disabled={!targetAudience.trim() || generateCampaignMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {generateCampaignMutation.isPending ? (
                      "Generating..."
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-2" />
                        Generate Campaign
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Real-time Campaign Performance */}
              <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-orange-400" />
                    Live Campaign Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">Active Campaigns</div>
                      <div className="text-3xl font-bold text-orange-400">12</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">Total Reach</div>
                      <div className="text-3xl font-bold text-green-400">847K</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">Engagement Rate</div>
                      <div className="text-3xl font-bold text-blue-400">34.2%</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">ROI</div>
                      <div className="text-3xl font-bold text-purple-400">312%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Viral Lab Tab */}
          <TabsContent value="viral-lab" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {groundbreakingFeatures.map((feature, index) => (
                <Card key={index} className={`bg-gradient-to-br ${feature.color}/10 border-${feature.color.split('-')[1]}-500/30 hover:scale-105 transition-all duration-300`}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                    <Badge className="bg-white/20 text-white">{feature.stats}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightning className="h-6 w-6 text-yellow-400" />
                  Viral Acceleration Engine
                </CardTitle>
                <CardDescription className="text-green-200">
                  Real-time viral coefficient tracking and optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-400">1.8x</div>
                      <div className="text-sm text-gray-300">Current Viral Coefficient</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400">94%</div>
                      <div className="text-sm text-gray-300">Accuracy Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-400">2.3M</div>
                      <div className="text-sm text-gray-300">Messages Amplified</div>
                    </div>
                  </div>
                  
                  <Separator className="bg-white/20" />
                  
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Recent Viral Successes</h4>
                    <div className="space-y-3">
                      {[
                        { message: "Sending virtual hugs to everyone today! 🫂", reach: "847K", viral: "12.3x" },
                        { message: "Your dreams are valid and achievable ✨", reach: "623K", viral: "8.7x" },
                        { message: "Thank you for believing in me 💕", reach: "445K", viral: "6.2x" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex-1">
                            <div className="text-white text-sm">"{item.message}"</div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-green-400 font-bold">{item.reach}</div>
                            <div className="text-blue-400 text-sm">{item.viral} viral</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Hub Tab */}
          <TabsContent value="analytics-hub" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Today</span>
                      <span className="text-green-400 font-bold">$2,847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">This Week</span>
                      <span className="text-green-400 font-bold">$18,392</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">This Month</span>
                      <span className="text-green-400 font-bold">$94,847</span>
                    </div>
                    <Separator className="bg-white/20" />
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">Total Revenue</span>
                      <span className="text-green-400 font-bold text-xl">$847,293</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">User Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Daily Active Users</span>
                        <span className="text-blue-400">12,847</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Message Completion Rate</span>
                        <span className="text-green-400">94.2%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Viral Share Rate</span>
                        <span className="text-purple-400">67.8%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Network Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400">2.7x</div>
                      <div className="text-sm text-gray-300">Network Growth Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400">847K</div>
                      <div className="text-sm text-gray-300">Connected Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-400">∞</div>
                      <div className="text-sm text-gray-300">Scalability Potential</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Action Bar */}
        <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to revolutionize messaging?</h3>
                <p className="text-purple-200">Join the SMS Nexus and turn every text into a blockchain treasure</p>
              </div>
              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8">
                  Start Creating
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}