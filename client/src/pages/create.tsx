import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Coins, 
  Sparkles, 
  Star, 
  Gift,
  Brain,
  Zap,
  Palette,
  Image,
  Mic,
  Users,
  Waves,
  Heart,
  Globe,
  BarChart3
} from "lucide-react";

export default function Create() {
  const [activeTab, setActiveTab] = useState("flutterbye-coins");

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gradient">Flutterbye Creation Hub</h1>
          <p className="text-xl text-muted-foreground mb-8">Revolutionary blockchain creation platform for Web3 communication</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger 
              value="flutterbye-coins" 
              className="flex items-center gap-2 text-lg py-3"
            >
              <Coins className="w-5 h-5" />
              Flutterbye Coins
            </TabsTrigger>
            <TabsTrigger 
              value="flutter-art" 
              className="flex items-center gap-2 text-lg py-3"
            >
              <Palette className="w-5 h-5" />
              FlutterArt
            </TabsTrigger>
            <TabsTrigger 
              value="flutter-wave" 
              className="flex items-center gap-2 text-lg py-3"
            >
              <Waves className="w-5 h-5" />
              FlutterWave
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flutterbye-coins" className="space-y-8">
            <FlutterbyCoinCreation />
          </TabsContent>

          <TabsContent value="flutter-art" className="space-y-8">
            <FlutterArtCreation />
          </TabsContent>

          <TabsContent value="flutter-wave" className="space-y-8">
            <FlutterWaveCreation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function FlutterbyCoinCreation() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-electric-blue">Create Flutterbye Coins</h2>
        <p className="text-xl text-muted-foreground">Revolutionary tokenized messages with redeemable value</p>
      </div>

      <Card className="electric-frame bg-gradient-to-br from-electric-blue/20 to-circuit-teal/20 border-2 border-electric-blue/50 hover:border-electric-blue/80 transition-all duration-500 hover:shadow-2xl hover:shadow-electric-blue/25">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-electric-blue to-circuit-teal rounded-full flex items-center justify-center">
            <Coins className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-electric-blue mb-2">Flutterbye Coins</CardTitle>
          <CardDescription className="text-lg text-gray-300">
            Create personalized message tokens with attached value
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-electric-blue/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-electric-blue" />
                <span className="font-semibold text-electric-blue">27-Character Messages</span>
              </div>
              <p className="text-sm text-gray-400">Precision messaging on blockchain</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-electric-green/30">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-electric-green" />
                <span className="font-semibold text-electric-green">Value Attachment</span>
              </div>
              <p className="text-sm text-gray-400">SOL, USDC, FLBY rewards</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-purple-400">AI Targeting</span>
              </div>
              <p className="text-sm text-gray-400">Precision holder analysis</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-orange-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-400" />
                <span className="font-semibold text-orange-400">Viral Mechanics</span>
              </div>
              <p className="text-sm text-gray-400">Growth amplification</p>
            </div>
          </div>
          <Link href="/mint">
            <Button className="w-full bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80 text-white py-6 text-lg font-semibold">
              <Coins className="w-5 h-5 mr-2" />
              Create Flutterbye Coin
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function FlutterArtCreation() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-purple-400">Create FlutterArt</h2>
        <p className="text-xl text-muted-foreground">AI-powered artistic blockchain creations with unique digital signatures</p>
      </div>

      <Card className="electric-frame bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 hover:border-purple-500/80 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-purple-400 mb-2">FlutterArt</CardTitle>
          <CardDescription className="text-lg text-gray-300">
            AI-generated artistic blockchain creations with collectible value
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-purple-400">AI-Generated Art</span>
              </div>
              <p className="text-sm text-gray-400">Unique digital masterpieces</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-pink-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-pink-400" />
                <span className="font-semibold text-pink-400">Unique Signatures</span>
              </div>
              <p className="text-sm text-gray-400">Blockchain authentication</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-yellow-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Image className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-yellow-400">Collectible NFTs</span>
              </div>
              <p className="text-sm text-gray-400">Limited edition artwork</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-green-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-green-400">Creative Expression</span>
              </div>
              <p className="text-sm text-gray-400">Personal artistic vision</p>
            </div>
          </div>
          <Link href="/flutter-art">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold">
              <Palette className="w-5 h-5 mr-2" />
              Create FlutterArt
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function FlutterWaveCreation() {
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
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Waves className="h-12 w-12 text-electric-blue animate-pulse" />
          <h2 className="text-5xl font-bold bg-gradient-to-r from-electric-blue via-purple to-electric-green bg-clip-text text-transparent">
            FlutterWave
          </h2>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold">
            AI-POWERED
          </Badge>
        </div>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
          Revolutionary AI-Powered Butterfly Effect Messaging - Harness the quantum power of emotions with advanced sentiment analysis, viral prediction algorithms, and quantum-inspired sentiment creation
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card 
              key={index}
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/50 hover:border-electric-blue/50 transition-all duration-300 hover:shadow-lg hover:shadow-electric-blue/10"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Link href="/flutter-wave">
          <Button className="bg-gradient-to-r from-electric-blue to-purple hover:from-electric-blue/80 hover:to-purple/80 text-white px-8 py-6 text-lg font-semibold">
            <Waves className="w-5 h-5 mr-2" />
            Launch FlutterWave Experience
          </Button>
        </Link>
      </div>
    </div>
  );
}