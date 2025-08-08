import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Coins, 
  Sparkles, 
  MessageSquare, 
  Heart, 
  Mic, 
  Image,
  Zap,
  Star,
  Gift,
  ArrowRight,
  Brain,
  Palette,
  Music,
  Video,
  Users
} from "lucide-react";
import Mint from "./mint";
import { VoiceMessageRecorder } from "@/components/voice-message-recorder";

export default function Create() {
  const [activeTab, setActiveTab] = useState("tokens");

  // Function to get creation route based on option type
  const getCreationRoute = (optionId: string) => {
    switch (optionId) {
      case "basic-token":
        return "/mint/basic";
      case "ai-enhanced":
        return "/mint/ai-enhanced";
      case "voice-token":
        return "/mint/voice";
      case "multimedia":
        return "/mint/multimedia";
      case "targeted-marketing":
        return "/campaign-builder";
      default:
        return "/mint";
    }
  };

  const creationOptions = [
    {
      id: "greeting-card",
      title: "Digital Greeting Card",
      description: "Personal 27-character messages with SOL value",
      icon: Gift,
      color: "electric-green",
      features: ["27-character message", "Attach SOL value", "Perfect for gifts"],
      recommended: true,
      category: "retail",
      examples: ["Happy Birthday! $5 gift", "Coffee on me - enjoy!", "Thank you for everything"]
    },
    {
      id: "targeted-marketing",
      title: "Targeted Marketing",
      description: "Precision crypto marketing with FlutterAI",
      icon: Brain,
      color: "purple",
      features: ["FlutterAI wallet targeting", "Campaign analytics", "Bulk distribution"],
      recommended: true,
      category: "enterprise",
      examples: ["Try our 5% yield pool!", "New NFT drop preview", "Beta access unlocked!"]
    },

  ];

  const aiTools = [
    {
      title: "Message Optimizer",
      description: "AI-powered message enhancement for maximum impact",
      icon: Sparkles,
      href: "/ai-content-optimizer"
    },
    {
      title: "Viral Predictor",
      description: "Predict and optimize viral potential",
      icon: Zap,
      href: "/viral-predictor"
    },
    {
      title: "Smart Pricing",
      description: "AI-recommended token pricing",
      icon: Star,
      href: "/smart-pricing"
    },
    {
      title: "Emotion Analysis",
      description: "Deep emotional intelligence for your content",
      icon: Heart,
      href: "/emotion-analysis"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Create Message Tokens
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create 27-character message tokens with redeemable value - perfect for digital greeting cards or targeted crypto marketing
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="outline" className="text-electric-blue border-electric-blue">
              27 Characters Max
            </Badge>
            <Badge variant="outline" className="text-electric-green border-electric-green">
              Redeemable Value
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              FlutterAI Targeting
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-electric-blue/20">
            <TabsTrigger value="tokens">Token Creation</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-6">
            {/* Compact Creation Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {creationOptions.map((option) => (
                <Card key={option.id} className="group hover:shadow-md transition-all duration-300 cursor-pointer bg-slate-800/30 border border-electric-blue/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${option.color}/10 group-hover:bg-${option.color}/20 transition-colors`}>
                          <option.icon className={`h-4 w-4 text-${option.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm group-hover:text-electric-blue transition-colors">
                            {option.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {option.recommended && (
                          <Badge className="bg-gradient-to-r from-electric-blue to-electric-green text-white text-xs px-2 py-1">
                            RECOMMENDED
                          </Badge>
                        )}
                        <Link href={getCreationRoute(option.id)}>
                          <Button size="sm" variant={option.recommended ? "default" : "outline"}>
                            Create <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Flutterbye Message Creation Center */}
            <div className="bg-transparent">
              <Mint />
            </div>
          </TabsContent>

          <TabsContent value="ai-tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiTools.map((tool) => (
                <Link key={tool.href} href={tool.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-purple/10 group-hover:bg-purple/20 transition-colors">
                          <tool.icon className="h-6 w-6 text-purple" />
                        </div>
                        <div>
                          <CardTitle className="group-hover:text-electric-blue transition-colors">
                            {tool.title}
                          </CardTitle>
                          <CardDescription>{tool.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full group-hover:bg-purple/10">
                        Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            {/* Advanced Creation Tools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/collaborative-creation">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <Users className="h-8 w-8 text-electric-green mb-2" />
                    <CardTitle>Collaborative Creation</CardTitle>
                    <CardDescription>Create tokens with multiple contributors</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/limited-edition">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <Star className="h-8 w-8 text-yellow-400 mb-2" />
                    <CardTitle>Limited Edition Sets</CardTitle>
                    <CardDescription>Create exclusive token collections</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/message-nfts">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <Palette className="h-8 w-8 text-pink-400 mb-2" />
                    <CardTitle>NFT Messages</CardTitle>
                    <CardDescription>Create artistic message NFTs</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>

            {/* Voice Recording */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-electric-green" />
                  Voice Message Creator
                </CardTitle>
                <CardDescription>
                  Record emotional voice messages and turn them into tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceMessageRecorder onVoiceRecord={(audioData) => {
                  console.log('Voice message recorded:', audioData);
                  // Handle the voice message attachment
                }} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}