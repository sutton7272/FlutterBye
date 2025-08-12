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
  Users,
  Wallet
} from "lucide-react";
import Mint from "./mint";
import { VoiceMessageRecorder } from "@/components/voice-message-recorder";
import { ContextualChatButton } from "@/components/contextual-chat-button";


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
        


        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-electric-blue/20">
            <TabsTrigger value="tokens">Message Creator</TabsTrigger>
            <TabsTrigger value="greeting-cards">Greeting Cards</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-6">
            {/* Main Flutterbye Message Creation Center */}
            <div className="bg-transparent">
              <Mint />
            </div>
          </TabsContent>

          <TabsContent value="greeting-cards" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Digital Greeting Cards</h2>
              <p className="text-gray-300">Create personal 27-character messages with SOL value - perfect for gifts</p>
            </div>
            
            <Card className="group hover:shadow-lg transition-all duration-300 bg-slate-800/40 border border-electric-green/30 hover:border-electric-green/60 electric-frame max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-electric-green/10 group-hover:bg-electric-green/20 transition-colors border border-electric-green/20">
                        <Gift className="h-5 w-5 text-electric-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white group-hover:text-electric-blue transition-colors">
                          Digital Greeting Card
                        </h3>
                        <p className="text-sm text-gray-300">Personal 27-character messages with SOL value</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-electric-blue to-electric-green text-white text-xs px-2 py-1 animate-pulse">
                      POPULAR
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-gray-300 border-gray-600 bg-slate-700/50 text-xs">27-character message</Badge>
                    <Badge variant="outline" className="text-gray-300 border-gray-600 bg-slate-700/50 text-xs">Attach SOL value</Badge>
                    <Badge variant="outline" className="text-gray-300 border-gray-600 bg-slate-700/50 text-xs">Perfect for gifts</Badge>
                  </div>

                  <div className="text-xs text-gray-400">
                    <p className="font-medium">Examples:</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>"Happy Birthday! $5 gift"</li>
                      <li>"Coffee on me - enjoy!"</li>
                    </ul>
                  </div>

                  <Link href="/mint/basic">
                    <Button className="w-full group-hover:from-electric-blue group-hover:to-electric-green bg-gradient-to-r from-slate-700 to-slate-600 hover:from-electric-blue hover:to-electric-green transition-all duration-300">
                      Create Greeting Card <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Targeted Marketing</h2>
              <p className="text-gray-300">Precision crypto marketing with FlutterAI wallet targeting</p>
            </div>
            
            <Card className="group hover:shadow-lg transition-all duration-300 bg-slate-800/40 border border-purple-400/30 hover:border-purple-400/60 electric-frame max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-purple-400/10 group-hover:bg-purple-400/20 transition-colors border border-purple-400/20">
                        <Brain className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white group-hover:text-electric-blue transition-colors">
                          Targeted Marketing
                        </h3>
                        <p className="text-sm text-gray-300">Precision crypto marketing with FlutterAI</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-electric-blue to-electric-green text-white text-xs px-2 py-1 animate-pulse">
                      POPULAR
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-gray-300 border-gray-600 bg-slate-700/50 text-xs">FlutterAI wallet targeting</Badge>
                    <Badge variant="outline" className="text-gray-300 border-gray-600 bg-slate-700/50 text-xs">Campaign analytics</Badge>
                    <Badge variant="outline" className="text-gray-300 border-gray-600 bg-slate-700/50 text-xs">Bulk distribution</Badge>
                  </div>

                  <div className="text-xs text-gray-400">
                    <p className="font-medium">Examples:</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>"Try our 5% yield pool!"</li>
                      <li>"New NFT drop preview"</li>
                    </ul>
                  </div>

                  <Link href="/campaign-builder">
                    <Button className="w-full group-hover:from-electric-blue group-hover:to-electric-green bg-gradient-to-r from-slate-700 to-slate-600 hover:from-electric-blue hover:to-electric-green transition-all duration-300">
                      Create Marketing Campaign <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-tools" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">AI-Powered Tools</h2>
              <p className="text-gray-300">Enhance your message tokens with advanced AI capabilities</p>
            </div>
            
            {/* Automatic Metadata Creation Notice */}
            <div className="mb-8">
              <Card className="glassmorphism border-green-500/30 bg-green-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-400">Phantom Display Fixed!</h3>
                      <p className="text-sm text-gray-300">All tokens now display properly in Phantom automatically</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 space-y-2">
                    <p>✅ Automatic metadata creation during token minting</p>
                    <p>✅ Proper token names, symbols, and images in Phantom</p>
                    <p>✅ No more "Unknown" token display issues</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiTools.map((tool) => (
                <Link key={tool.href} href={tool.href}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-slate-800/40 border border-purple-400/30 hover:border-purple-400/60 electric-frame">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-purple-400/10 group-hover:bg-purple-400/20 transition-colors border border-purple-400/20">
                          <tool.icon className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white group-hover:text-electric-blue transition-colors text-lg">
                            {tool.title}
                          </CardTitle>
                          <CardDescription className="text-gray-300">{tool.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white border-0 transition-all duration-300">
                        Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>


        </Tabs>

        {/* Contextual Chat Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <ContextualChatButton context="flutterbyemsg" />
        </div>
      </div>
    </div>
  );
}