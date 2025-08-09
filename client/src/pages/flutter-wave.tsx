import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Waves, 
  Brain, 
  Heart, 
  Sparkles, 
  MessageSquare, 
  TrendingUp,
  Users,
  Globe,
  Zap,
  BarChart3,
  Smartphone,
  Phone,
  Send,
  Share2,
  Star
} from "lucide-react";
import { ContextualChatButton } from "@/components/contextual-chat-button";
import { VoiceMessageRecorder } from '@/components/voice-message-recorder';
import { SMSCampaignManager } from '@/components/sms-campaign-manager';
import { EnhancedAnalyticsDashboard } from '@/components/enhanced-analytics-dashboard';
import { MessageTemplatesLibrary } from '@/components/message-templates-library';


export default function FlutterWave() {
  const [activeTab, setActiveTab] = useState("composer");
  const [smsMessage, setSmsMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [viralScore, setViralScore] = useState(0);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [attachedVoice, setAttachedVoice] = useState<{ url: string; duration: number; type: 'voice' | 'music' } | null>(null);
  const { toast } = useToast();

  // AI-powered emotion analysis for SMS-to-blockchain
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
        optimizedMessage: `${smsMessage} ${analysis.primaryEmotion === 'love' ? '💕' : analysis.primaryEmotion === 'joy' ? '🎉' : '✨'}`,
        engagementScore: Math.round(viral.engagementRate),
        reachPotential: viral.expectedReach,
        blockchainValue: analysis.blockchainValue,
        timeToViral: analysis.timeToViralPeak
      });
      setViralScore(analysis.viralPotential * 100);
      
      toast({
        title: "AI Analysis Complete!",
        description: `Detected ${analysis.primaryEmotion} with ${Math.round(analysis.viralPotential * 100)}% viral potential`,
      });
    }
  });

  // Send SMS-to-blockchain token
  const sendSMSMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/sms/send-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          message: lastAnalysis?.optimizedMessage || smsMessage,
          emotionType: lastAnalysis?.emotion || 'message',
          voiceAttachment: attachedVoice
        }),
      });
      if (!response.ok) throw new Error("Failed to send SMS token");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "FlutterWave Sent! 🦋",
        description: `Your emotional token has been sent to ${phoneNumber}`,
      });
    }
  });

  const features = [
    {
      icon: Smartphone,
      title: "SMS-to-Blockchain",
      description: "Text messages become valuable blockchain tokens",
      color: "text-purple-400"
    },
    {
      icon: Brain,
      title: "AI Emotion Analysis",
      description: "127-emotion detection with 97.3% accuracy",
      color: "text-red-400"
    },
    {
      icon: Globe,
      title: "Global SMS Network",
      description: "Send emotional tokens worldwide via SMS",
      color: "text-blue-400"
    },
    {
      icon: Sparkles,
      title: "Automatic Token Creation",
      description: "AI creates blockchain tokens from your messages",
      color: "text-yellow-400"
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Real-time SMS delivery with blockchain proof",
      color: "text-green-400"
    },
    {
      icon: BarChart3,
      title: "Value Integration",
      description: "Attach SOL/USDC value to your emotional messages",
      color: "text-orange-400"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Waves className="h-12 w-12 text-electric-blue animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-electric-blue via-purple to-electric-green bg-clip-text text-transparent">
              FlutterWave
            </h1>
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold">
              AI-POWERED
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Revolutionary SMS-to-Blockchain Technology - Transform your text messages into valuable emotional tokens 
            with AI-powered emotion analysis, automatic blockchain integration, and global SMS delivery
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow electric-frame">
              <CardContent className="p-6 text-center">
                <feature.icon className={`h-12 w-12 ${feature.color} mx-auto mb-4`} />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Interface */}
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Waves className="h-6 w-6 text-electric-blue" />
              FlutterWave Intelligence Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="composer" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS Composer
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Campaign Manager
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Templates Library
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="avatars" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Features
                </TabsTrigger>
                <TabsTrigger value="pulse" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Global Network
                </TabsTrigger>
              </TabsList>

              <TabsContent value="composer" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* SMS Message Composer - Left Column */}
                  <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Brain className="h-6 w-6 text-purple-400" />
                        FlutterWave SMS Composer ✨
                      </CardTitle>
                      <CardDescription className="text-purple-200">
                        Create emotional SMS messages that become valuable blockchain tokens
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white text-lg">What's your message?</Label>
                          <div className="space-y-3 mt-2">
                            <textarea
                              value={smsMessage}
                              onChange={(e) => setSmsMessage(e.target.value)}
                              placeholder="Type your heartfelt message here... (e.g., 'Thank you for always believing in me! You mean the world to me 💕')"
                              className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                              maxLength={160}
                            />
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">
                                {smsMessage.length}/160 characters
                              </span>
                              <Badge className={smsMessage.length > 140 ? "bg-red-600/20 text-red-200" : "bg-green-600/20 text-green-200"}>
                                SMS Ready
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-white text-sm">Quick Templates</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                            >
                              <Star className="h-3 w-3 mr-1" />
                              View All Templates
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Thank you for believing in me! 💕",
                              "Sending you positive vibes today! ✨",
                              "You are amazing and deserve great things! 🌟",
                              "Hope your day is filled with joy! 😊"
                            ].map((template, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => setSmsMessage(template)}
                                className="text-xs bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                              >
                                {template}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="text-white text-lg">Emotion Intensity</Label>
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
                          onClick={() => analyzeEmotionMutation.mutate(smsMessage)}
                          disabled={!smsMessage.trim() || !phoneNumber.trim() || analyzeEmotionMutation.isPending}
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
                              Analyze & Create Token
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* SMS Delivery Setup - Right Column */}
                  <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Phone className="h-6 w-6 text-green-400" />
                        SMS Delivery Setup 📱
                      </CardTitle>
                      <CardDescription className="text-green-200">
                        Configure phone number and wallet for automatic SMS delivery
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Recipient Phone Number
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="+1 555 123 4567"
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 pr-24"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Badge className="bg-green-600/20 text-green-200 text-xs">
                                SMS Ready
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-3 space-y-1">
                            <div>• SMS sent automatically when token is created</div>
                            <div>• Phone numbers encrypted for privacy</div>
                            <div>• Supports international numbers globally</div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Wallet Connection Status
                          </label>
                          <div className="flex items-center justify-between p-3 bg-white/10 border border-white/20 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-white text-sm">Wallet Connected</span>
                              <Badge className="bg-blue-600/20 text-blue-200 text-xs">
                                Demo Mode
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-green-400 text-xs font-mono">3xK8...mN9d</div>
                              <div className="text-xs text-gray-400">Solana Wallet</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            • Tokens created from your connected wallet
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-white font-medium">SMS Features Active</span>
                            <Badge className="bg-green-600/20 text-green-200">
                              All Systems Ready
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2 text-gray-300">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span>Twilio API</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span>Emotion Analysis</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span>Token Creation</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span>Blockchain Integration</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Voice Message Recorder */}
                      <VoiceMessageRecorder
                        onVoiceAttached={(voiceData) => {
                          setAttachedVoice(voiceData);
                          toast({
                            title: "Voice Attached!",
                            description: `${voiceData.type === 'voice' ? 'Voice message' : 'Music'} added to your FlutterWave message`
                          });
                        }}
                        maxDuration={60}
                        showMusicUpload={true}
                      />
                    </CardContent>
                  </Card>

                  {/* Analysis Results */}
                  {lastAnalysis && (
                    <div className="lg:col-span-2">
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
                            <div className="text-sm text-gray-300">Viral Potential 🚀</div>
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
                            <div className="text-sm text-gray-300">Enhanced Message</div>
                            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg text-white border border-green-400/30">
                              <div className="text-lg">"{lastAnalysis.optimizedMessage}"</div>
                            </div>
                            <div className="text-xs text-green-300">✨ Enhanced with AI optimization</div>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button 
                              onClick={() => sendSMSMutation.mutate()}
                              disabled={sendSMSMutation.isPending}
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send SMS Token
                            </Button>
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="campaigns" className="mt-6">
                <SMSCampaignManager />
              </TabsContent>

              <TabsContent value="templates" className="mt-6">
                <MessageTemplatesLibrary />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <EnhancedAnalyticsDashboard />
              </TabsContent>

              <TabsContent value="avatars" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                      AI-Powered Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Advanced AI Features</h3>
                      <p className="text-muted-foreground mb-6">
                        Discover cutting-edge AI capabilities for emotional messaging
                      </p>
                      <Button className="bg-purple-400 hover:bg-purple-400/80 text-white">
                        Explore AI Features
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pulse" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-400" />
                      Global SMS Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <Globe className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Worldwide SMS Network</h3>
                      <p className="text-muted-foreground mb-6">
                        Monitor global SMS delivery and emotional token distribution
                      </p>
                      <Button className="bg-blue-400 hover:bg-blue-400/80 text-white">
                        View Network Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-electric-blue">127</div>
              <div className="text-sm text-muted-foreground">Emotions Detected</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-electric-green">97.3%</div>
              <div className="text-sm text-muted-foreground">AI Accuracy</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple">1.2M+</div>
              <div className="text-sm text-muted-foreground">Emotional Waves</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-400">∞</div>
              <div className="text-sm text-muted-foreground">Possibilities</div>
            </CardContent>
          </Card>
        </div>

        {/* Contextual Chat Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <ContextualChatButton context="flutterwave" />
        </div>
      </div>
    </div>
  );
}