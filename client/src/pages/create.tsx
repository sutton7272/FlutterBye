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
  Video
} from "lucide-react";
import Mint from "./mint";
import { VoiceMessageRecorder } from "@/components/voice-message-recorder";

export default function Create() {
  const [activeTab, setActiveTab] = useState("tokens");

  const creationOptions = [
    {
      id: "basic-token",
      title: "Basic Token",
      description: "Simple message token with value",
      icon: Coins,
      color: "electric-blue",
      features: ["Custom message", "Set value", "Choose expiration"],
      recommended: false
    },
    {
      id: "ai-enhanced",
      title: "AI Enhanced Token",
      description: "Smart tokens with AI optimization",
      icon: Brain,
      color: "purple",
      features: ["AI message optimization", "Viral prediction", "Smart pricing"],
      recommended: true
    },
    {
      id: "voice-token",
      title: "Voice Message",
      description: "Audio-powered emotional tokens",
      icon: Mic,
      color: "electric-green",
      features: ["Voice recording", "Emotion analysis", "Audio NFT"],
      recommended: false
    },
    {
      id: "multimedia",
      title: "Multimedia Token",
      description: "Rich media experiences",
      icon: Image,
      color: "orange",
      features: ["Images & GIFs", "Video content", "Interactive media"],
      recommended: false
    }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Create & Build
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into valuable tokens with AI-powered tools and blockchain technology
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tokens">Token Creation</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-6">
            {/* Creation Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creationOptions.map((option) => (
                <Card key={option.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer relative">
                  {option.recommended && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold">
                        RECOMMENDED
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-${option.color}/10 group-hover:bg-${option.color}/20 transition-colors`}>
                        <option.icon className={`h-6 w-6 text-${option.color}`} />
                      </div>
                      <div>
                        <CardTitle className="group-hover:text-electric-blue transition-colors">
                          {option.title}
                        </CardTitle>
                        <CardDescription>{option.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1 h-1 bg-electric-blue rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={option.recommended ? "default" : "outline"}
                    >
                      Create {option.title} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Token Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-electric-blue" />
                  Quick Token Creation
                </CardTitle>
                <CardDescription>
                  Create a token instantly with smart defaults
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Mint />
              </CardContent>
            </Card>
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
                <VoiceMessageRecorder />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}