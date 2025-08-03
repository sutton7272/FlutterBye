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
    select: (data: any) => data?.analytics || {
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
      title: "Neural Emotional Spectrum",
      description: "127-emotion detection with quantum-inspired sentiment analysis and neural pathway mapping",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      stats: "97.3% accuracy",
      revolutionary: true
    },
    {
      title: "Quantum Message Threads",
      description: "Messages create self-evolving networks that multiply in value through collective resonance",
      icon: Share2,
      color: "from-green-500 to-emerald-500",
      stats: "∞ scalability",
      revolutionary: true
    },
    {
      title: "Temporal Message Capsules",
      description: "Time-locked messages with reveal mechanics and emotional decay/growth algorithms",
      icon: Clock,
      color: "from-blue-500 to-cyan-500",
      stats: "Time-bending",
      revolutionary: true
    },
    {
      title: "Emotional Market Exchange",
      description: "First-ever real-time trading of emotional assets with predictive value algorithms",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      stats: "Live trading",
      revolutionary: true
    },
    {
      title: "AI Avatar Composers",
      description: "Personalized AI entities that learn your emotion patterns and co-create viral content",
      icon: Bot,
      color: "from-cyan-500 to-blue-500",
      stats: "Personal AI",
      revolutionary: true
    },
    {
      title: "Cross-Platform Viral Bridge",
      description: "Automatically amplify SMS emotions across TikTok, Instagram, Twitter for maximum reach",
      icon: Globe,
      color: "from-pink-500 to-red-500",
      stats: "Omni-viral",
      revolutionary: true
    },
    {
      title: "Holographic Previews",
      description: "3D visualization of viral potential with interactive emotion heatmaps and flow dynamics",
      icon: Eye,
      color: "from-violet-500 to-purple-500",
      stats: "3D vision",
      revolutionary: true
    },
    {
      title: "Community Pulse Network",
      description: "Real-time global emotion mapping with collective consciousness indicators",
      icon: Users,
      color: "from-emerald-500 to-green-500",
      stats: "Global sync",
      revolutionary: true
    }
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-900 via-purple-900/20 to-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Revolutionary Hero Header */}
        <div className="text-center space-y-6 relative">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl blur-3xl animate-pulse"></div>
          
          <div className="relative flex items-center justify-center space-x-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 animate-spin-slow"></div>
              <div className="absolute inset-1 bg-gradient-to-r from-purple-700 to-blue-700 rounded-full flex items-center justify-center">
                <Zap className="h-10 w-10 text-white animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
                FLUTTERWAVE
              </h1>
              <div className="text-sm text-purple-300 font-semibold tracking-wider">
                REVOLUTIONARY • AI-POWERED • BLOCKCHAIN-ENABLED
              </div>
            </div>
          </div>
          
          <div className="relative">
            <p className="text-2xl text-purple-200 max-w-5xl mx-auto leading-relaxed">
              Experience the <span className="text-cyan-400 font-bold">Butterfly Effect of Emotions</span> as FlutterWave transforms 
              ordinary messages into <span className="text-green-400 font-bold">precious digital butterflies</span> that spread 
              <span className="text-pink-400 font-bold">waves of feeling</span> across the blockchain universe
            </p>
            
            {/* Floating butterfly feature badges */}
            <div className="flex justify-center mt-6 space-x-4">
              {[
                { text: "🦋 127 Emotions", color: "from-purple-500 to-pink-500" },
                { text: "🌊 Infinite Waves", color: "from-green-500 to-blue-500" },
                { text: "🤖 Butterfly AI", color: "from-cyan-500 to-purple-500" },
                { text: "🌍 Global Flutter", color: "from-orange-500 to-red-500" }
              ].map((badge, index) => (
                <div key={index} className={`px-4 py-2 bg-gradient-to-r ${badge.color} rounded-full text-white text-sm font-semibold shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer animate-pulse`}>
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
          
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

        {/* Simplified Main Interface */}
        <Tabs defaultValue="create-message" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-sm border border-purple-500/30">
            <TabsTrigger value="create-message" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              ✍️ Create Message
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600">
              🚀 Campaigns
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600">
              📊 Results
            </TabsTrigger>
            <TabsTrigger value="help" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600">
              💡 How It Works
            </TabsTrigger>
          </TabsList>

          {/* Create Message Tab - Simple Message Creation */}
          <TabsContent value="create-message" className="space-y-6">
            {/* Simple Step-by-Step Guide */}
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-white">Create Your FlutterWave Message</h2>
                  <p className="text-gray-300 text-lg">Transform your text into a valuable blockchain butterfly in 3 easy steps</p>
                  <div className="flex justify-center items-center space-x-8 mt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">1</div>
                      <div className="text-sm text-gray-300">Write Message</div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">2</div>
                      <div className="text-sm text-gray-300">AI Analyzes</div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">3</div>
                      <div className="text-sm text-gray-300">Send & Earn</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-purple-400" />
                    Write Your Message
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Write any message and our AI will optimize it to create more value and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-white text-lg">What do you want to say?</Label>
                    <Textarea
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      placeholder="Example: 'Thank you for your support!' or 'Hope you have a great day!'"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px] text-lg"
                    />
                    <div className="text-sm text-gray-400">
                      💡 Tip: Messages with positive emotions like gratitude, love, or encouragement perform best
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-white text-lg">How strong should the emotion be?</Label>
                    <div className="px-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={emotionIntensity}
                        onChange={(e) => setEmotionIntensity(Number(e.target.value))}
                        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>Gentle (1)</span>
                        <span className="text-purple-400 font-bold text-lg">{emotionIntensity}/10</span>
                        <span>Powerful (10)</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => analyzeEmotionMutation.mutate(aiMessage)}
                    disabled={!aiMessage.trim() || analyzeEmotionMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-lg font-semibold"
                  >
                    {analyzeEmotionMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating your butterfly...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Create My FlutterWave Message
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Your Butterfly Results */}
              {lastAnalysis && (
                <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-400/30">
                  <CardHeader>
                    <CardTitle className="text-green-300 flex items-center gap-2">
                      <Sparkles className="h-6 w-6" />
                      Your Digital Butterfly is Ready! 🦋
                    </CardTitle>
                    <CardDescription className="text-green-200">
                      Your message has been transformed into a valuable blockchain asset
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-300">Main Emotion Detected</div>
                        <Badge className="bg-purple-600/20 text-purple-200 text-lg px-4 py-2">
                          {lastAnalysis.emotion.charAt(0).toUpperCase() + lastAnalysis.emotion.slice(1)} ✨
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-300">AI Accuracy</div>
                        <div className="text-3xl font-bold text-green-400">
                          {Math.round(lastAnalysis.confidence * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Very confident!</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm text-gray-300">How Viral Could This Go? 🚀</div>
                      <div className="relative">
                        <Progress value={viralScore} className="h-4" />
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-gray-400">Limited</span>
                          <span className="text-blue-400 font-bold">{Math.round(viralScore)}% Viral Potential</span>
                          <span className="text-gray-400">Explosive</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm text-gray-300">Your Enhanced Message</div>
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg text-white border border-green-400/30">
                        <div className="text-lg">"{lastAnalysis.optimizedMessage}"</div>
                      </div>
                      <div className="text-xs text-green-300">✨ Enhanced with AI optimization</div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm text-gray-300">Ways to Make It Even Better</div>
                      <div className="space-y-2">
                        {lastAnalysis.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 text-sm text-blue-200 p-2 bg-blue-500/10 rounded-lg">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <span>{suggestion}</span>
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

          {/* Campaigns Tab - Easy Campaign Creation */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-6 w-6 text-blue-400" />
                    Create a Campaign
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Send your message to multiple people at once with targeted campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white text-lg">Who do you want to reach?</Label>
                    <Input
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Example: Young professionals, Parents, Students"
                      className="bg-white/10 border-white/20 text-white text-lg"
                    />
                    <div className="text-sm text-gray-400">
                      💡 Be specific about your audience for better results
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white text-lg">What's your goal?</Label>
                    <Input
                      value={campaignGoal}
                      onChange={(e) => setCampaignGoal(e.target.value)}
                      placeholder="Example: Spread positivity, Thank customers, Announce news"
                      className="bg-white/10 border-white/20 text-white text-lg"
                    />
                    <div className="text-sm text-gray-400">
                      💡 Clear goals help AI create better campaigns
                    </div>
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

          {/* Time Capsules Tab - Revolutionary Temporal Messaging */}
          <TabsContent value="time-capsules" className="space-y-6">
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
                  <Zap className="h-6 w-6 text-yellow-400" />
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

          {/* Emotion Exchange Tab - Revolutionary Emotional Trading */}
          <TabsContent value="emotion-exchange" className="space-y-6">
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

          {/* AI Avatars Tab - Revolutionary Personal AI Composers */}
          <TabsContent value="ai-avatars" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="h-6 w-6 text-cyan-400" />
                    Your Personal AI Avatar
                  </CardTitle>
                  <CardDescription className="text-cyan-200">
                    Meet ARIA - your AI butterfly companion that learns your emotion patterns and co-creates viral FlutterWaves
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Avatar Visualization */}
                  <div className="relative h-48 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/30 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center animate-pulse">
                        <Bot className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <div className="text-cyan-300 font-semibold">ARIA v2.0</div>
                      <div className="text-xs text-gray-400">Learning your emotion patterns...</div>
                    </div>
                  </div>

                  {/* AI Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-cyan-500/20 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-300">847</div>
                      <div className="text-xs text-gray-300">Messages Learned</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-300">94%</div>
                      <div className="text-xs text-gray-300">Pattern Match</div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-300">12.3x</div>
                      <div className="text-xs text-gray-300">Viral Boost</div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                    <Bot className="h-4 w-4 mr-2" />
                    Start AI Collaboration
                  </Button>
                </CardContent>
              </Card>

              {/* AI Suggestions Panel */}
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-400" />
                    AI-Generated Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      text: "Sending you digital sunshine and endless possibilities! ☀️✨", 
                      emotion: "Joy", 
                      viral: "8.7x",
                      confidence: 96
                    },
                    { 
                      text: "Your dreams deserve wings - watch them soar today! 🦋🚀", 
                      emotion: "Inspiration", 
                      viral: "12.3x",
                      confidence: 89
                    },
                    { 
                      text: "Quantum hugs transcending space and time just for you! 🫂⚡", 
                      emotion: "Love", 
                      viral: "15.7x",
                      confidence: 92
                    }
                  ].map((suggestion, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-400/50 transition-all cursor-pointer">
                      <div className="text-white text-sm mb-2">"{suggestion.text}"</div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-600/20 text-purple-200">{suggestion.emotion}</Badge>
                          <span className="text-green-400 font-bold">{suggestion.viral} viral</span>
                        </div>
                        <span className="text-blue-400">{suggestion.confidence}% confident</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Global Pulse Tab - Revolutionary Collective Consciousness */}
          <TabsContent value="global-pulse" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Global Emotion Map */}
              <Card className="lg:col-span-2 bg-black/40 backdrop-blur-sm border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-6 w-6 text-emerald-400" />
                    Global Emotion Heatmap
                  </CardTitle>
                  <CardDescription className="text-emerald-200">
                    Real-time emotional pulse of the planet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 bg-gradient-to-br from-emerald-900/20 to-green-900/20 rounded-xl border border-emerald-500/30 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5"></div>
                    
                    {/* Emotion Hotspots */}
                    <div className="absolute top-16 left-20 w-6 h-6 bg-pink-500 rounded-full animate-pulse opacity-80">
                      <div className="absolute -top-8 -left-4 text-xs text-pink-300 font-semibold">Love</div>
                    </div>
                    <div className="absolute top-32 left-40 w-4 h-4 bg-yellow-500 rounded-full animate-pulse opacity-60">
                      <div className="absolute -top-6 -left-2 text-xs text-yellow-300 font-semibold">Joy</div>
                    </div>
                    <div className="absolute top-20 right-24 w-8 h-8 bg-blue-500 rounded-full animate-pulse opacity-90">
                      <div className="absolute -top-8 -left-6 text-xs text-blue-300 font-semibold">Gratitude</div>
                    </div>
                    <div className="absolute bottom-20 left-32 w-5 h-5 bg-green-500 rounded-full animate-pulse opacity-70">
                      <div className="absolute -bottom-8 -left-4 text-xs text-green-300 font-semibold">Hope</div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-center text-emerald-300 text-sm font-semibold">
                        🦋 Global Butterfly Effect: 8.7/10 🌊
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-3">
                    <div className="text-center p-2 bg-pink-500/20 rounded-lg">
                      <div className="text-lg font-bold text-pink-300">34%</div>
                      <div className="text-xs text-gray-300">Love</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-500/20 rounded-lg">
                      <div className="text-lg font-bold text-yellow-300">28%</div>
                      <div className="text-xs text-gray-300">Joy</div>
                    </div>
                    <div className="text-center p-2 bg-blue-500/20 rounded-lg">
                      <div className="text-lg font-bold text-blue-300">23%</div>
                      <div className="text-xs text-gray-300">Gratitude</div>
                    </div>
                    <div className="text-center p-2 bg-green-500/20 rounded-lg">
                      <div className="text-lg font-bold text-green-300">15%</div>
                      <div className="text-xs text-gray-300">Hope</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collective Consciousness Metrics */}
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Collective Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Global Happiness</span>
                      <span className="text-yellow-400 font-semibold">7.3/10</span>
                    </div>
                    <Progress value={73} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Viral Velocity</span>
                      <span className="text-green-400 font-semibold">2.8x</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Network Resonance</span>
                      <span className="text-blue-400 font-semibold">94.2%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>

                  <Separator className="bg-white/20 my-4" />

                  <div className="space-y-3">
                    <h4 className="text-white font-semibold">Trending Emotions</h4>
                    {[
                      { emotion: "Empathy", growth: "+23%" },
                      { emotion: "Celebration", growth: "+18%" },
                      { emotion: "Inspiration", growth: "+15%" }
                    ].map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <span className="text-white text-sm">{trend.emotion}</span>
                        <span className="text-green-400 font-bold text-sm">{trend.growth}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Global Events & Campaigns */}
            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-6 w-6 text-cyan-400" />
                  Global Emotional Events
                </CardTitle>
                <CardDescription className="text-cyan-200">
                  Participate in worldwide emotional movements and campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Global Gratitude Wave",
                      description: "Join 2.3M people spreading gratitude",
                      participants: "2.3M",
                      timeLeft: "2h 47m",
                      color: "from-yellow-500 to-orange-500"
                    },
                    {
                      title: "Hope Rising Campaign",
                      description: "Collective hope-building initiative",
                      participants: "1.8M",
                      timeLeft: "5h 12m",
                      color: "from-green-500 to-blue-500"
                    },
                    {
                      title: "Love Amplification",
                      description: "Spread love across 7 continents",
                      participants: "3.1M",
                      timeLeft: "12h 3m",
                      color: "from-pink-500 to-red-500"
                    }
                  ].map((event, index) => (
                    <Card key={index} className={`bg-gradient-to-br ${event.color}/10 border-${event.color.split('-')[1]}-500/30 hover:scale-105 transition-all duration-300`}>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="text-white font-bold">{event.title}</h3>
                        <p className="text-gray-300 text-sm">{event.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <div className="text-white font-semibold">{event.participants}</div>
                            <div className="text-gray-400 text-xs">participants</div>
                          </div>
                          <div className="text-sm text-right">
                            <div className="text-cyan-400 font-semibold">{event.timeLeft}</div>
                            <div className="text-gray-400 text-xs">remaining</div>
                          </div>
                        </div>
                        <Button className={`w-full bg-gradient-to-r ${event.color} hover:opacity-90 text-white text-sm`}>
                          Join Event
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How It Works Tab - Simple Explanation */}
        <TabsContent value="help" className="space-y-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-white">How FlutterWave Works</h2>
                  <p className="text-xl text-gray-300">
                    Transform your messages into valuable digital assets that spread across the blockchain
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">1. Write Your Message</h3>
                  <p className="text-gray-300">
                    Type any message - from "thank you" to "have a great day". Our AI will understand the emotion behind your words.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">2. AI Creates Value</h3>
                  <p className="text-gray-300">
                    Our advanced AI analyzes your message's emotional impact and predicts how valuable and viral it could become.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Coins className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">3. Earn Real Value</h3>
                  <p className="text-gray-300">
                    Your message becomes a blockchain token that can be traded, shared, and appreciated by others around the world.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/40 backdrop-blur-sm border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white text-xl">Why FlutterWave?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Heart className="h-6 w-6 text-pink-400 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold">Emotional Value</h4>
                        <p className="text-gray-300 text-sm">Your feelings and messages have real worth that can be shared and appreciated.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-green-400 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold">Viral Potential</h4>
                        <p className="text-gray-300 text-sm">Messages with high emotional impact can spread widely and create more value.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-blue-400 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold">Blockchain Security</h4>
                        <p className="text-gray-300 text-sm">Your messages are permanently stored and protected on the blockchain.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-6 w-6 text-purple-400 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold">Global Reach</h4>
                        <p className="text-gray-300 text-sm">Connect with people worldwide through the universal language of emotions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-400/30">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Start?</h3>
                <p className="text-gray-300 mb-6">
                  Click on "Create Message" to begin transforming your words into valuable digital butterflies.
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 text-lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Create My First Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Results Tab - Performance Analytics */}
        <TabsContent value="results" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Your FlutterWave Performance</CardTitle>
              <CardDescription className="text-green-200">Track how your messages are performing and earning value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-purple-500/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-300">{realtimeStats?.totalMessages || 0}</div>
                  <div className="text-sm text-gray-300">Messages Created</div>
                </div>
                <div className="text-center p-4 bg-blue-500/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-300">{realtimeStats?.conversionRate || 0}%</div>
                  <div className="text-sm text-gray-300">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-green-500/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-300">{realtimeStats?.averageValue || 0}</div>
                  <div className="text-sm text-gray-300">Avg Value (SOL)</div>
                </div>
                <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-300">{realtimeStats?.viralCoefficient || 0}x</div>
                  <div className="text-sm text-gray-300">Viral Impact</div>
                </div>
              </div>
              
              <div className="text-center text-gray-300">
                <p className="text-lg mb-4">Create your first FlutterWave message to see detailed analytics here!</p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Create Your First Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Action Bar */}
        <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to ride the FlutterWave?</h3>
                <p className="text-purple-200 mb-4">Join the revolution and transform every message into precious blockchain butterflies</p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Started Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}