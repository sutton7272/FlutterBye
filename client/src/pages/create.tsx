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
  Crown
} from "lucide-react";
import Mint from "./mint";
import { VoiceMessageRecorder } from "@/components/voice-message-recorder";

export default function Create() {
  const [activeTab, setActiveTab] = useState("message-coins");

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
      default:
        return "/mint";
    }
  };

  // Message Coins - Traditional Flutterbye tokens
  const messageCoinOptions = [
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
    {
      id: "quick-message",
      title: "Quick Message",
      description: "Simple 27-character token creation",
      icon: MessageSquare,
      color: "electric-blue",
      features: ["Fast creation", "Basic targeting", "Instant deployment"],
      recommended: false,
      category: "basic",
      examples: ["GM! Have a great day", "Thanks for the follow", "Welcome to crypto!"]
    }
  ];

  // FlutterArt NFT Options - Enhanced multimedia tokens
  const nftArtOptions = [
    {
      id: "basic-nft",
      title: "Basic Message NFT",
      description: "Simple NFT with text message",
      icon: MessageSquare,
      color: "electric-blue",
      features: ["Text message", "Custom image", "Basic metadata"],
      recommended: false,
      category: "nft",
      route: "/flutter-art",
      examples: ["Memorable quotes", "Digital certificates", "Simple announcements"]
    },
    {
      id: "multimedia-nft",
      title: "Multimedia NFT",
      description: "Rich NFT with custom artwork and voice",
      icon: Palette,
      color: "purple",
      features: ["Custom artwork", "Voice recording", "Rich metadata"],
      recommended: true,
      category: "nft",
      route: "/flutter-art",
      examples: ["Personal messages", "Art collections", "Voice memories"]
    },
    {
      id: "ai-generated-nft",
      title: "AI-Generated Art NFT",
      description: "NFT with AI-created artwork",
      icon: Sparkles,
      color: "electric-green",
      features: ["AI artwork generation", "DALL-E integration", "Unique designs"],
      recommended: true,
      category: "nft",
      route: "/flutter-art",
      examples: ["Fantasy landscapes", "Abstract art", "Digital portraits"]
    },
    {
      id: "limited-edition",
      title: "Limited Edition Set",
      description: "Exclusive NFT collections with limited supply",
      icon: Crown,
      color: "gold",
      features: ["Limited supply", "Collection series", "Exclusive access"],
      recommended: false,
      category: "nft",
      route: "/flutter-art",
      examples: ["Artist collections", "Event commemoratives", "VIP access tokens"]
    }
  ];

  // Voice NFT Options - Combining voice with blockchain
  const voiceNftOptions = [
    {
      id: "sms-to-token",
      title: "FlutterWave SMS",
      description: "Transform SMS messages into emotional blockchain tokens",
      icon: MessageSquare,
      color: "electric-blue",
      features: ["SMS-to-blockchain", "Emotional AI analysis", "Time-locked delivery", "Burn-to-read privacy"],
      recommended: true,
      category: "voice",
      route: "/flutter-wave",
      examples: ["Happy Birthday! 🎂", "I love you ❤️", "Thinking of you 💭"],
      badge: "AI-POWERED"
    },
    {
      id: "voice-message",
      title: "Voice Message NFT",
      description: "Personal voice recordings as NFTs",
      icon: Mic,
      color: "purple",
      features: ["Voice recording", "Audio quality", "Personal touch"],
      recommended: true,
      category: "voice",
      route: "/flutter-art",
      examples: ["Birthday wishes", "Thank you messages", "Motivational quotes"]
    },
    {
      id: "music-nft",
      title: "Music NFT",
      description: "Musical compositions and audio art",
      icon: Music,
      color: "electric-green",
      features: ["Music composition", "Audio art", "Sound design"],
      recommended: false,
      category: "voice",
      route: "/flutter-art",
      examples: ["Original compositions", "Audio loops", "Sound effects"]
    },
    {
      id: "podcast-nft",
      title: "Podcast Clip NFT",
      description: "Memorable podcast moments as collectibles",
      icon: Users,
      color: "gold",
      features: ["Podcast clips", "Interview highlights", "Discussion moments"],
      recommended: false,
      category: "voice",
      route: "/flutter-art",
      examples: ["Key insights", "Funny moments", "Expert advice"]
    }
  ];

  // Collection Options - Batch and series creation
  const collectionOptions = [
    {
      id: "batch-tokens",
      title: "Batch Token Creation",
      description: "Create multiple tokens simultaneously",
      icon: Users,
      color: "electric-blue",
      features: ["Bulk creation", "Consistent theming", "Efficient workflow"],
      recommended: true,
      category: "collection",
      route: "/campaign-builder",
      examples: ["Event invitations", "Team rewards", "Marketing campaigns"]
    },
    {
      id: "series-collection",
      title: "NFT Series",
      description: "Connected NFT collections with shared themes",
      icon: Star,
      color: "purple",
      features: ["Series narrative", "Progressive unlocking", "Collector value"],
      recommended: false,
      category: "collection",
      route: "/flutter-art",
      examples: ["Story chapters", "Character series", "Evolution chains"]
    },
    {
      id: "interactive-collection",
      title: "Interactive Collection",
      description: "Dynamic collections that evolve over time",
      icon: Zap,
      color: "electric-green",
      features: ["Dynamic content", "User interaction", "Evolving metadata"],
      recommended: false,
      category: "collection",
      route: "/flutter-art",
      examples: ["Growing plants", "Aging characters", "Weather systems"]
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

  // Render creation option cards
  const renderCreationOptions = (options: any[], title: string, description: string) => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option) => (
          <Card key={option.id} className="group hover:shadow-lg hover:shadow-electric-blue/20 transition-all duration-300 cursor-pointer relative electric-frame">
            {option.recommended && (
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold pulse-glow">
                  RECOMMENDED
                </Badge>
              </div>
            )}
            {option.badge && (
              <div className="absolute -top-2 -left-2">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold pulse-glow">
                  {option.badge}
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-${option.color}/10 group-hover:bg-${option.color}/20 transition-colors electric-pulse`}>
                  <option.icon className={`h-6 w-6 text-${option.color === 'gold' ? 'yellow-400' : option.color}`} />
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
                {option.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1 h-1 bg-electric-blue rounded-full pulse-dot"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Examples:</span>
                  <div className="mt-1 space-y-1">
                    {option.examples.slice(0, 2).map((example: string, index: number) => (
                      <div key={index} className="italic text-electric-green/70">"{example}"</div>
                    ))}
                  </div>
                </div>
                
                <Link href={option.route || getCreationRoute(option.id)}>
                  <Button className="w-full group modern-gradient hover:shadow-lg hover:shadow-electric-blue/30 transition-all duration-300">
                    Create {option.title}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Creation Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Create everything from simple message tokens to complex NFT collections. Choose your creation type and start building on the blockchain.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Badge variant="outline" className="text-electric-blue border-electric-blue">
              Message Coins
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              Art NFTs
            </Badge>
            <Badge variant="outline" className="text-electric-green border-electric-green">
              Voice NFTs
            </Badge>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              Collections
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 electric-frame">
            <TabsTrigger value="message-coins" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Message Coins
            </TabsTrigger>
            <TabsTrigger value="art-nfts" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Art NFTs
            </TabsTrigger>
            <TabsTrigger value="voice-nfts" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice NFTs
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Collections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="message-coins" className="space-y-6">
            {renderCreationOptions(
              messageCoinOptions,
              "Flutterbye Message Coins",
              "27-character tokens perfect for greetings, marketing, and value transfer"
            )}
          </TabsContent>

          <TabsContent value="art-nfts" className="space-y-6">
            {renderCreationOptions(
              nftArtOptions,
              "FlutterArt NFT Collection",
              "Rich multimedia NFTs with custom artwork, AI generation, and unique designs"
            )}
          </TabsContent>

          <TabsContent value="voice-nfts" className="space-y-6">
            {renderCreationOptions(
              voiceNftOptions,
              "Voice-Powered NFTs",
              "Combine voice recordings with blockchain technology for personal, memorable tokens"
            )}
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            {renderCreationOptions(
              collectionOptions,
              "Collection & Series Creation",
              "Batch creation tools and series management for large-scale token deployment"
            )}
          </TabsContent>

          {/* Cross-promotion section */}
          <div className="mt-12 p-6 bg-gradient-to-r from-electric-blue/10 to-purple-600/10 rounded-lg border border-electric-blue/20 electric-frame">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-white">Need Help Choosing?</h3>
              <p className="text-muted-foreground">
                Not sure which creation type fits your needs? Start with Message Coins for simple value transfer, 
                or explore Art NFTs for rich multimedia experiences.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/info">
                  <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue/10">
                    Learn More
                  </Button>
                </Link>
                <Link href="/flutterai">
                  <Button className="modern-gradient">
                    <Brain className="mr-2 h-4 w-4" />
                    AI-Powered Targeting
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </Tabs>
      </div>
    </div>
  );
}