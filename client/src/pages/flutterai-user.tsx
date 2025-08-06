import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Brain, 
  Target, 
  Users, 
  BarChart3, 
  Wallet, 
  Sparkles, 
  TrendingUp, 
  MessageSquare, 
  DollarSign,
  Star,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Building2,
  Globe,
  Rocket,
  Award,
  Eye,
  Crown,
  Lock
} from "lucide-react";
import { Link } from "wouter";

interface WalletInsight {
  address: string;
  score: number;
  activity: string;
  value: string;
  category: string;
  recommendation: string;
}

interface CampaignSuggestion {
  id: string;
  title: string;
  audience: string;
  expectedReach: number;
  confidence: number;
  strategy: string;
}

export default function FlutterAIUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [walletAddress, setWalletAddress] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");

  // Fetch user wallet insights
  const { data: walletInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/flutterai/user/insights'],
    retry: false
  });

  // Fetch pricing tiers for display
  const { data: pricingTiers, isLoading: pricingLoading } = useQuery({
    queryKey: ['/api/flutterai/pricing/tiers'],
    retry: false
  });

  // Wallet analysis mutation
  const analyzeWalletMutation = useMutation({
    mutationFn: async (address: string) => {
      return apiRequest("POST", "/api/flutterai/analyze-wallet", { address });
    },
    onSuccess: (data) => {
      toast({
        title: "Wallet Analyzed",
        description: "AI analysis complete! Check your insights below."
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze wallet. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Campaign suggestion mutation
  const getCampaignSuggestionsMutation = useMutation({
    mutationFn: async (goal: string) => {
      return apiRequest("POST", "/api/flutterai/campaign-suggestions", { goal });
    },
    onSuccess: () => {
      toast({
        title: "Suggestions Ready",
        description: "AI has generated campaign strategies for you."
      });
    }
  });

  const handleWalletAnalysis = () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Wallet Required",
        description: "Please enter a wallet address to analyze.",
        variant: "destructive"
      });
      return;
    }
    analyzeWalletMutation.mutate(walletAddress);
  };

  const handleCampaignSuggestions = () => {
    if (!campaignGoal.trim()) {
      toast({
        title: "Goal Required", 
        description: "Please describe your campaign goal.",
        variant: "destructive"
      });
      return;
    }
    getCampaignSuggestionsMutation.mutate(campaignGoal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              FlutterAI
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Supercharge your crypto marketing with AI-powered wallet intelligence and precision targeting. 
            Reach the right holders with the perfect message.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
              <Target className="h-4 w-4 mr-2" />
              Precision Targeting
            </Badge>
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
              <Brain className="h-4 w-4 mr-2" />
              AI Intelligence
            </Badge>
            <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30">
              <BarChart3 className="h-4 w-4 mr-2" />
              Real-time Analytics
            </Badge>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <Eye className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-purple-600">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Tools
            </TabsTrigger>
            <TabsTrigger value="enterprise" className="data-[state=active]:bg-green-600">
              <Building2 className="h-4 w-4 mr-2" />
              Enterprise
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-orange-600">
              <Crown className="h-4 w-4 mr-2" />
              Pricing
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            
            {/* Key Features Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Wallet className="h-8 w-8 text-blue-400" />
                    <CardTitle className="text-blue-100">Wallet Intelligence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-blue-200">
                  <p className="mb-4">AI analyzes crypto holder behavior, demographics, and activity patterns to score wallet quality and engagement potential.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Behavioral scoring algorithm
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Activity pattern analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Wealth & risk assessment
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-purple-400" />
                    <CardTitle className="text-purple-100">Precision Targeting</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-purple-200">
                  <p className="mb-4">Target specific crypto holder segments with laser precision using AI-powered audience discovery and campaign optimization.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Audience segmentation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Campaign optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Success prediction
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-green-400" />
                    <CardTitle className="text-green-100">Marketing Analytics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-green-200">
                  <p className="mb-4">Track campaign performance with real-time analytics and AI-powered insights to optimize your marketing ROI.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Real-time monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Performance insights
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      ROI optimization
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Live Demo Section */}
            <Card className="bg-gradient-to-r from-gray-900/80 to-gray-800/60 border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-white">See FlutterAI in Action</CardTitle>
                <p className="text-center text-gray-400">Experience the power of AI-driven crypto marketing intelligence</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Quick Wallet Analysis
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Enter any Solana wallet address to see AI-powered insights instantly
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter wallet address..."
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Button 
                        onClick={handleWalletAnalysis}
                        disabled={analyzeWalletMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {analyzeWalletMutation.isPending ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          "Analyze"
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Campaign Assistant
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Describe your marketing goal to get AI-powered campaign strategies
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Target NFT collectors..."
                        value={campaignGoal}
                        onChange={(e) => setCampaignGoal(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Button 
                        onClick={handleCampaignSuggestions}
                        disabled={getCampaignSuggestionsMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {getCampaignSuggestionsMutation.isPending ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          "Suggest"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Wallet Intelligence Tool */}
              <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-100 flex items-center gap-2">
                    <Wallet className="h-6 w-6" />
                    My Wallet Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-200">
                  <p className="mb-4">Get AI insights about your wallet activity and optimization suggestions.</p>
                  <Link href="/create">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Analyze My Wallet
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Campaign Builder */}
              <Card className="bg-gradient-to-br from-purple-900/50 to-pink-800/30 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    Campaign Builder
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-purple-200">
                  <p className="mb-4">Create AI-optimized campaigns with precision targeting and messaging.</p>
                  <Link href="/campaign-builder">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Build Campaign
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Audience Discovery */}
              <Card className="bg-gradient-to-br from-green-900/50 to-teal-800/30 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-100 flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Audience Discovery
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-green-200">
                  <p className="mb-4">Find ideal recipients and similar wallet holders for your campaigns.</p>
                  <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                    <Lock className="h-4 w-4 mr-2" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Analytics */}
              <Card className="bg-gradient-to-br from-orange-900/50 to-red-800/30 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-orange-100 flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-orange-200">
                  <p className="mb-4">Track your campaign success with real-time analytics and AI insights.</p>
                  <Link href="/dashboard">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      View Analytics
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enterprise Tab */}
          <TabsContent value="enterprise" className="space-y-6">
            <Card className="bg-gradient-to-r from-gray-900/80 to-gray-800/60 border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-3xl text-center text-white mb-4">
                  Enterprise FlutterAI
                </CardTitle>
                <p className="text-center text-gray-400 text-lg">
                  Scale your crypto marketing with enterprise-grade AI intelligence
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-blue-300">Enterprise Features</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-300">
                        <Shield className="h-5 w-5 text-green-400" />
                        Multi-signature wallet security
                      </li>
                      <li className="flex items-center gap-3 text-gray-300">
                        <Globe className="h-5 w-5 text-blue-400" />
                        Cross-chain intelligence (6 blockchains)
                      </li>
                      <li className="flex items-center gap-3 text-gray-300">
                        <BarChart3 className="h-5 w-5 text-purple-400" />
                        Advanced analytics & reporting
                      </li>
                      <li className="flex items-center gap-3 text-gray-300">
                        <Users className="h-5 w-5 text-orange-400" />
                        Dedicated account management
                      </li>
                      <li className="flex items-center gap-3 text-gray-300">
                        <Rocket className="h-5 w-5 text-red-400" />
                        White-label solutions
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-green-300">Success Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                        <div className="text-2xl font-bold text-blue-300">95%</div>
                        <div className="text-sm text-gray-400">Higher engagement</div>
                      </div>
                      <div className="text-center p-4 bg-green-900/30 rounded-lg border border-green-500/30">
                        <div className="text-2xl font-bold text-green-300">500%</div>
                        <div className="text-sm text-gray-400">Faster targeting</div>
                      </div>
                      <div className="text-center p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
                        <div className="text-2xl font-bold text-purple-300">$2M+</div>
                        <div className="text-sm text-gray-400">Contract value</div>
                      </div>
                      <div className="text-center p-4 bg-orange-900/30 rounded-lg border border-orange-500/30">
                        <div className="text-2xl font-bold text-orange-300">24/7</div>
                        <div className="text-sm text-gray-400">AI monitoring</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link href="/admin-unified">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                      Explore Enterprise Dashboard
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your FlutterAI Plan</h2>
              <p className="text-gray-400">Start free, scale with enterprise features</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-white">Free</CardTitle>
                  <div className="text-3xl font-bold text-gray-300">$0</div>
                  <p className="text-gray-400">Perfect for getting started</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Basic wallet analysis
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      5 campaign suggestions/month
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Standard analytics
                    </li>
                  </ul>
                  <Button className="w-full bg-gray-600 hover:bg-gray-700">
                    Get Started Free
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Tier */}
              <Card className="bg-gradient-to-br from-blue-900/50 to-purple-800/30 border-blue-500/50 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-white">Pro</CardTitle>
                  <div className="text-3xl font-bold text-blue-300">0.1 SOL</div>
                  <p className="text-gray-400">For serious marketers</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Advanced wallet intelligence
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Unlimited campaigns
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Real-time analytics
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Priority support
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Tier */}
              <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-800/30 border-yellow-500/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-white flex items-center justify-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    Enterprise
                  </CardTitle>
                  <div className="text-3xl font-bold text-yellow-300">Custom</div>
                  <p className="text-gray-400">For large organizations</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Everything in Pro
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Multi-chain intelligence
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      White-label solutions
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Dedicated support
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-900/80 to-purple-900/80 border-blue-500/30">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Crypto Marketing?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of crypto marketers using FlutterAI to reach the right audience with precision targeting and AI-powered insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/create">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3">
                  Start Creating Campaigns
                  <Rocket className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/admin-unified">
                <Button size="lg" variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white px-8 py-3">
                  View Enterprise Demo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}