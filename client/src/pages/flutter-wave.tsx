import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart3
} from "lucide-react";
import { ContextualChatButton } from "@/components/contextual-chat-button";


export default function FlutterWave() {
  const [activeTab, setActiveTab] = useState("composer");

  const features = [
    {
      icon: Brain,
      title: "Neural Emotional Spectrum",
      description: "127-emotion detection with 97.3% accuracy",
      color: "text-purple-400"
    },
    {
      icon: Heart,
      title: "AI Avatar Companions",
      description: "ARIA v2.0 intelligent conversation system",
      color: "text-red-400"
    },
    {
      icon: Globe,
      title: "Global Butterfly Effect",
      description: "Track emotional waves across the network",
      color: "text-blue-400"
    },
    {
      icon: Sparkles,
      title: "Quantum Message Threads",
      description: "Multi-dimensional conversation experiences",
      color: "text-yellow-400"
    },
    {
      icon: Zap,
      title: "Temporal Message Capsules",
      description: "Time-locked emotional delivery system",
      color: "text-green-400"
    },
    {
      icon: BarChart3,
      title: "Emotional Market Exchange",
      description: "Trade and monetize emotional intelligence",
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
            Revolutionary AI-Powered Butterfly Effect Messaging - Harness the quantum power of emotions 
            with advanced sentiment analysis, viral prediction algorithms, and quantum-inspired content creation
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
                  Neural Composer
                </TabsTrigger>
                <TabsTrigger value="threads" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Quantum Threads
                </TabsTrigger>
                <TabsTrigger value="capsules" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Time Capsules
                </TabsTrigger>
                <TabsTrigger value="exchange" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Emotion Exchange
                </TabsTrigger>
                <TabsTrigger value="avatars" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  AI Avatars
                </TabsTrigger>
                <TabsTrigger value="pulse" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Global Pulse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="composer" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-400" />
                      Neural Emotional Composer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <MessageSquare className="h-16 w-16 text-electric-blue mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Create Quantum Messages</h3>
                      <p className="text-muted-foreground mb-6">
                        Compose messages with advanced AI emotional analysis and viral prediction
                      </p>
                      <Button className="bg-electric-blue hover:bg-electric-blue/80">
                        Start Composing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="threads" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-400" />
                      Quantum Message Threads
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <TrendingUp className="h-16 w-16 text-electric-green mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Multi-Dimensional Conversations</h3>
                      <p className="text-muted-foreground mb-6">
                        Experience conversations that evolve across multiple emotional dimensions
                      </p>
                      <Button className="bg-electric-green hover:bg-electric-green/80">
                        Explore Threads
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="capsules" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-400" />
                      Temporal Message Capsules
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <Zap className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Time-Locked Emotions</h3>
                      <p className="text-muted-foreground mb-6">
                        Send messages through time with AI-powered optimal delivery timing
                      </p>
                      <Button className="bg-green-400 hover:bg-green-400/80 text-black">
                        Create Capsule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exchange" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-orange-400" />
                      Emotional Market Exchange
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <BarChart3 className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Monetize Emotional Intelligence</h3>
                      <p className="text-muted-foreground mb-6">
                        Trade emotional insights and participate in the attention economy
                      </p>
                      <Button className="bg-orange-400 hover:bg-orange-400/80 text-black">
                        Enter Exchange
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="avatars" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-400" />
                      AI Avatar Companions (ARIA v2.0)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <Heart className="h-16 w-16 text-red-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Intelligent Companions</h3>
                      <p className="text-muted-foreground mb-6">
                        Interact with advanced AI avatars that understand and respond to emotions
                      </p>
                      <Button className="bg-red-400 hover:bg-red-400/80 text-white">
                        Meet ARIA
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
                      Global Butterfly Effect Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <Globe className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Worldwide Emotional Waves</h3>
                      <p className="text-muted-foreground mb-6">
                        Monitor how emotions ripple across the global FlutterWave network
                      </p>
                      <Button className="bg-blue-400 hover:bg-blue-400/80 text-white">
                        View Global Pulse
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