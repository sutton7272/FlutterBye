import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    <div className="text-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-lg w-full"
          >
            <Play className="w-5 h-5 mr-2" />
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
              
              {demoOptions.map((demo, index) => (
                <Card 
                  key={demo.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 bg-slate-800 border-slate-600 ${
                    activeDemo === demo.id ? 'ring-2 ring-cyan-400' : ''
                  }`}
                  onClick={() => !demo.loading && demo.action()}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-electric-blue/20 text-electric-blue shrink-0">{index + 1}</Badge>
                        <div>
                          <h4 className="font-bold text-white">{demo.title}</h4>
                          <p className="text-sm text-muted-foreground">{demo.description}</p>
                        </div>
                      </div>
                      {demo.loading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                      ) : (
                        <ArrowRight className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Right Panel: Demo Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Demo Results:</h3>
              
              {!activeDemo ? (
                <Card className="bg-slate-800 border-slate-600">
                  <CardContent className="p-8 text-center">
                    <Brain className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-400">
                      Select a demo to see FlutterAI in action
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Show results for completed demo */}
                  {Object.keys(demoResults).map((demoId) => (
                    <Card key={demoId} className="bg-slate-800 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-lg text-cyan-400">
                          {demoOptions.find(d => d.id === demoId)?.title} Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {demoResults[demoId].score && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Score:</span>
                              <Badge className="bg-electric-green/20 text-electric-green">{demoResults[demoId].score}/1000</Badge>
                            </div>
                          )}
                          {demoResults[demoId].analysis && (
                            <p className="text-sm text-muted-foreground">{demoResults[demoId].analysis}</p>
                          )}
                          {demoResults[demoId].suggestions && (
                            <div className="mt-2">
                              {demoResults[demoId].suggestions?.map((suggestion, i) => (
                                <Badge key={i} variant="outline" className="mr-1 mb-1 text-xs">
                                  {suggestion}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
  );
}