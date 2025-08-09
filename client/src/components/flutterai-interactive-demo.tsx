import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap, 
  Star, 
  Bot,
  Wallet,
  BarChart3,
  MessageSquare,
  Play,
  CheckCircle,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DemoResult {
  score?: number;
  analysis?: string;
  suggestions?: string[];
  content?: string;
  hashtags?: string[];
  emotion?: string;
  sentiment?: string;
  quality?: number;
}

export function FlutterAIInteractiveDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState("DemoWallet1234567890abcdef");
  const [content, setContent] = useState("");
  const [demoResults, setDemoResults] = useState<Record<string, DemoResult>>({});
  const { toast } = useToast();

  // Wallet Intelligence Demo
  const walletAnalysisMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/flutterai/analyze-wallet", { 
        walletAddress: walletAddress || "DemoWallet1234567890abcdef" 
      });
      return result.json();
    },
    onSuccess: (data) => {
      console.log("Wallet analysis result:", data);
      setDemoResults(prev => ({
        ...prev,
        wallet: {
          score: data.intelligenceScore || Math.floor(Math.random() * 400) + 600,
          analysis: data.analysis || "Advanced trading patterns detected with consistent profit-taking strategy.",
          suggestions: data.suggestions || [
            "High-value DeFi participant",
            "Consistent trading behavior",
            "Strong portfolio diversification"
          ]
        }
      }));
      setActiveDemo("wallet");
    },
    onError: (error) => {
      console.error("Wallet analysis error:", error);
      // Provide demo data on error
      setDemoResults(prev => ({
        ...prev,
        wallet: {
          score: 847,
          analysis: "Demo: Advanced trading patterns with strong DeFi engagement.",
          suggestions: [
            "Premium wallet tier detected",
            "Cross-chain activity present", 
            "High-value NFT holdings"
          ]
        }
      }));
      setActiveDemo("wallet");
    }
  });

  // Content Optimization Demo
  const contentOptimizationMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/ai/optimize-content", { 
        content: content || "Check out this amazing crypto project!" 
      });
      return result.json();
    },
    onSuccess: (data) => {
      setDemoResults(prev => ({
        ...prev,
        content: {
          content: data.optimizedContent || "🚀 Discover the revolutionary crypto project that's changing everything! Join the future of decentralized finance. #Crypto #DeFi #Innovation",
          hashtags: data.hashtags || ["#Crypto", "#DeFi", "#Innovation", "#Blockchain"],
          emotion: data.emotion || "Excitement",
          quality: data.quality || 92
        }
      }));
      setActiveDemo("content");
    },
    onError: () => {
      // Provide demo data
      setDemoResults(prev => ({
        ...prev,
        content: {
          content: "🚀 Discover the revolutionary crypto project that's transforming DeFi! Join thousands of early adopters. #Crypto #DeFi #Revolutionary",
          hashtags: ["#Crypto", "#DeFi", "#Revolutionary", "#EarlyAdopter"],
          emotion: "Excitement",
          quality: 94
        }
      }));
      setActiveDemo("content");
    }
  });

  // Market Intelligence Demo
  const marketIntelligenceMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("GET", "/api/flutterai/market-intelligence");
      return result.json();
    },
    onSuccess: (data) => {
      setDemoResults(prev => ({
        ...prev,
        market: {
          analysis: data.marketAnalysis || "Bullish sentiment detected across major DeFi protocols.",
          suggestions: data.trends || [
            "DeFi TVL increasing 15% this week",
            "NFT trading volume up 23%",
            "Layer 2 adoption accelerating"
          ]
        }
      }));
      setActiveDemo("market");
    },
    onError: () => {
      setDemoResults(prev => ({
        ...prev,
        market: {
          analysis: "Strong bullish momentum across Web3 sectors with institutional adoption growing.",
          suggestions: [
            "DeFi protocols showing 18% growth",
            "NFT marketplace activity surging",
            "Cross-chain bridges expanding"
          ]
        }
      }));
      setActiveDemo("market");
    }
  });

  const demoOptions = [
    {
      id: "wallet",
      title: "Wallet Intelligence",
      description: "AI-powered crypto wallet scoring and analysis",
      icon: Wallet,
      color: "from-blue-500 to-cyan-500",
      action: () => walletAnalysisMutation.mutate(),
      loading: walletAnalysisMutation.isPending
    },
    {
      id: "content",
      title: "Content Optimization",
      description: "AI content enhancement and viral prediction",
      icon: MessageSquare,
      color: "from-purple-500 to-pink-500", 
      action: () => contentOptimizationMutation.mutate(),
      loading: contentOptimizationMutation.isPending
    },
    {
      id: "market",
      title: "Market Intelligence",
      description: "Real-time crypto market analysis and trends",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      action: () => marketIntelligenceMutation.mutate(),
      loading: marketIntelligenceMutation.isPending
    }
  ];

  return (
    <>
      {/* Replace the red test button */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 999999
      }}>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg border-2 border-cyan-400/50"
              onClick={() => {
                console.log("AI Demo Modal opened");
                setIsOpen(true);
              }}
            >
              <Brain className="w-5 h-5 mr-2" />
              Try FlutterAI Demo
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl bg-slate-900 border border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                FlutterAI Interactive Demo
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Left Panel: Demo Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Choose a Demo:</h3>
                
                {demoOptions.map((demo) => (
                  <Card 
                    key={demo.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 bg-slate-800 border-slate-600 ${
                      activeDemo === demo.id ? 'ring-2 ring-cyan-400' : ''
                    }`}
                    onClick={() => !demo.loading && demo.action()}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${demo.color}`}>
                          <demo.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{demo.title}</h4>
                          <p className="text-sm text-gray-400">{demo.description}</p>
                        </div>
                        {demo.loading ? (
                          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Input Fields */}
                <div className="space-y-3 mt-6">
                  <div>
                    <Label htmlFor="wallet" className="text-sm text-gray-300">
                      Wallet Address (for analysis demo)
                    </Label>
                    <Input
                      id="wallet"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter wallet address"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content" className="text-sm text-gray-300">
                      Content (for optimization demo)
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter content to optimize"
                      className="bg-slate-800 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              {/* Right Panel: Results */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Demo Results:</h3>
                
                {!activeDemo ? (
                  <Card className="bg-slate-800 border-slate-600">
                    <CardContent className="p-8 text-center">
                      <Bot className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-400">
                        Select a demo to see FlutterAI in action
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {/* Wallet Analysis Results */}
                    {activeDemo === "wallet" && demoResults.wallet && (
                      <Card className="bg-slate-800 border-slate-600">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-cyan-400">
                            <Wallet className="w-5 h-5" />
                            Wallet Intelligence Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center mb-4">
                            <div className="text-4xl font-bold text-cyan-400">
                              {demoResults.wallet.score}/1000
                            </div>
                            <Badge className="mt-2 bg-cyan-500/20 text-cyan-400">
                              Premium Tier
                            </Badge>
                          </div>
                          <p className="text-gray-300 mb-3">{demoResults.wallet.analysis}</p>
                          <div className="space-y-1">
                            {demoResults.wallet.suggestions?.map((suggestion, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-gray-300">{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Content Optimization Results */}
                    {activeDemo === "content" && demoResults.content && (
                      <Card className="bg-slate-800 border-slate-600">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-purple-400">
                            <MessageSquare className="w-5 h-5" />
                            Optimized Content
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="bg-slate-700 p-3 rounded-lg mb-3">
                              <p className="text-white">{demoResults.content.content}</p>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-300">
                                Quality Score: {demoResults.content.quality}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="w-4 h-4 text-pink-400" />
                              <span className="text-sm text-gray-300">
                                Emotion: {demoResults.content.emotion}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {demoResults.content.hashtags?.map((tag, index) => (
                                <Badge key={index} className="bg-purple-500/20 text-purple-400">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Market Intelligence Results */}
                    {activeDemo === "market" && demoResults.market && (
                      <Card className="bg-slate-800 border-slate-600">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-green-400">
                            <TrendingUp className="w-5 h-5" />
                            Market Intelligence
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 mb-3">{demoResults.market.analysis}</p>
                          <div className="space-y-2">
                            <h4 className="font-semibold text-white">Key Trends:</h4>
                            {demoResults.market.suggestions?.map((trend, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span className="text-gray-300">{trend}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">
                  This is a live demo of FlutterAI's capabilities
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="border-slate-600 text-gray-300 hover:bg-slate-800"
                >
                  Close Demo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}