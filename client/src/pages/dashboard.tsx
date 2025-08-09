import { useState, useEffect } from "react";
import { DashboardStatsSkeleton } from "@/components/loading-states";
import { usePerformance } from "@/hooks/use-performance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  ArrowRight, 
  TrendingUp, 
  Coins, 
  Users, 
  Zap, 
  Eye,
  Wallet,
  Activity,
  Star,
  BarChart3,
  MessageSquare,
  Heart,
  Gift,
  Target,
  Sparkles,
  Trophy,
  Search,
  Filter,
  ShoppingCart,
  Flame,
  Image as ImageIcon,
  Volume2,
  Crown,
  Gem,
  TrendingDown
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import TokenCard from "@/components/token-card";
import { type Token } from "@shared/schema";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InteractiveStatsDashboard } from "@/components/interactive-stats-dashboard";
import { QuickActionPanel } from "@/components/quick-action-panel";
import { EngagementBooster } from "@/components/engagement-booster";
import { NFTPortfolioQuickView } from "@/components/dashboard/NFTPortfolioQuickView";
import { ViralSharingAssistant } from "@/components/viral-sharing-assistant";
import { VoiceMessageRecorder } from "@/components/voice-message-recorder";
import { ViralGrowthAccelerator } from "@/components/viral-growth-accelerator";
import { MobileOnboardingWizard } from "@/components/mobile-onboarding-wizard";
import { WalletConnectionWizard } from "@/components/wallet-connection-wizard";
import { QuickAccessFAB } from "@/components/quick-access-fab";
import { PersonalizedDashboard } from "@/components/PersonalizedDashboard";
import PerformanceDashboard from "@/components/performance-dashboard";
import ViralDashboard from "@/pages/viral-dashboard";
import { ContextualChatButton } from "@/components/contextual-chat-button";

interface NFTListing {
  id: string;
  collectionId: string;
  tokenNumber: number;
  message: string;
  imageFile?: string;
  voiceFile?: string;
  owner: string;
  price: number;
  currency: string;
  burnToRedeem: boolean;
  originalValue: number;
  collectionName: string;
  listedAt: string;
  rarity?: string;
}

interface DashboardStats {
  totalTokens: number;
  totalValue: string;
  activeChats: number;
  viralScore: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    amount?: number;
  }>;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWalletWizard, setShowWalletWizard] = useState(false);
  const performanceMetrics = usePerformance();
  const [isMobile, setIsMobile] = useState(false);
  
  // Marketplace state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [selectedNFT, setSelectedNFT] = useState<NFTListing | null>(null);
  const [showBurnDialog, setShowBurnDialog] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const { toast } = useToast();
  
  // Check if user is new (mobile)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check if user is new (simplified check)
    const isFirstTime = !localStorage.getItem('flutterbye_visited');
    if (isFirstTime && window.innerWidth < 768) {
      setShowOnboarding(true);
      localStorage.setItem('flutterbye_visited', 'true');
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("flutter_onboarding_complete", "true");
    setShowOnboarding(false);
  };

  const handleWalletConnect = (walletId: string) => {
    console.log("Connecting to wallet:", walletId);
    setShowWalletWizard(false);
  };

  // Fetch dashboard data
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000,
  });

  // Fetch FLBY tokens for marketplace
  const { data: tokens = [], isLoading: isLoadingTokens } = useQuery<Token[]>({
    queryKey: ["/api/tokens", { search: searchQuery }],
    enabled: true,
  });

  // Fetch NFT listings for marketplace
  const { data: nftData, isLoading: isLoadingNFTs } = useQuery({
    queryKey: ['/api/marketplace/nfts'],
    refetchInterval: 30000
  });

  // Buy NFT mutation
  const buyNFTMutation = useMutation({
    mutationFn: async (nftId: string) => {
      const response = await apiRequest(`/api/marketplace/buy/${nftId}`, {
        method: 'POST',
        body: JSON.stringify({ buyerId: 'demo-buyer' })
      });
      return response;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Purchase Successful!",
        description: data?.message || "NFT purchased successfully",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/nfts'] });
      setShowBuyDialog(false);
      setSelectedNFT(null);
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to buy NFT",
        variant: "destructive",
      });
    }
  });

  // Burn NFT mutation
  const burnNFTMutation = useMutation({
    mutationFn: async (nftId: string) => {
      const response = await apiRequest(`/api/marketplace/burn/${nftId}`, {
        method: 'POST',
        body: JSON.stringify({ burnerId: 'demo-burner' })
      });
      return response;
    },
    onSuccess: (data: any) => {
      toast({
        title: "NFT Burned Successfully!",
        description: data?.message || "NFT burned and value redeemed",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/nfts'] });
      setShowBurnDialog(false);
      setSelectedNFT(null);
    },
    onError: (error) => {
      toast({
        title: "Burn Failed",
        description: error instanceof Error ? error.message : "Failed to burn NFT",
        variant: "destructive",
      });
    }
  });

  // Marketplace helper functions
  const handleBuyToken = (token: Token) => {
    toast({
      title: "Purchase Initiated",
      description: `Purchasing ${token.message} token for ${token.valuePerToken} SOL`,
    });
    // TODO: Implement actual token purchase logic
  };

  const filteredTokens = tokens.filter((token) => {
    if (searchQuery && !token.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (priceFilter !== "all") {
      const price = parseFloat(token.valuePerToken || "0");
      switch (priceFilter) {
        case "free":
          if (price !== 0) return false;
          break;
        case "low":
          if (price === 0 || price > 0.1) return false;
          break;
        case "medium":
          if (price <= 0.1 || price > 1) return false;
          break;
        case "high":
          if (price <= 1) return false;
          break;
      }
    }
    
    return true;
  });

  const nftListings = nftData?.nfts || [];

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'uncommon': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const getRarityIcon = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return <Crown className="w-4 h-4" />;
      case 'epic': return <Gem className="w-4 h-4" />;
      case 'rare': return <Star className="w-4 h-4" />;
      case 'uncommon': return <Zap className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  // Loading state - show skeleton while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8 pt-20">
          <DashboardStatsSkeleton />
        </div>
      </div>
    );
  }

  // Quick actions data
  const quickActions = [
    {
      title: "Create Token",
      description: "Turn your message into money",
      icon: Coins,
      href: "/create",
      color: "electric-blue",
      featured: true
    },
    {
      title: "FlutterWave",
      description: "SMS-to-blockchain emotional tokens",
      icon: Heart,
      href: "/flutter-wave",
      color: "electric-green"
    },
    {
      title: "AI Analysis",
      description: "Get intelligent insights",
      icon: Sparkles,
      href: "/intelligence",
      color: "purple"
    },
    {
      title: "FlutterArt",
      description: "Create and trade NFTs",
      icon: Star,
      href: "/flutter-art",
      color: "teal"
    }
  ];

  if (showOnboarding) {
    return <MobileOnboardingWizard onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
              Welcome to Flutterbye
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your unified platform for tokenized messaging, AI-powered trading, and blockchain intelligence
          </p>
        </div>

        {/* Quick Actions - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-slate-800/40 border border-electric-blue/30 hover:border-electric-blue/60 electric-frame">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-lg bg-${action.color === 'electric-blue' ? 'electric-blue' : action.color === 'electric-green' ? 'electric-green' : action.color === 'purple' ? 'purple-400' : 'teal-400'}/10 group-hover:bg-${action.color === 'electric-blue' ? 'electric-blue' : action.color === 'electric-green' ? 'electric-green' : action.color === 'purple' ? 'purple-400' : 'teal-400'}/20 transition-colors border border-${action.color === 'electric-blue' ? 'electric-blue' : action.color === 'electric-green' ? 'electric-green' : action.color === 'purple' ? 'purple-400' : 'teal-400'}/20`}>
                      <action.icon className={`h-6 w-6 ${action.color === 'electric-blue' ? 'text-electric-blue' : action.color === 'electric-green' ? 'text-electric-green' : action.color === 'purple' ? 'text-purple-400' : 'text-teal-400'} group-hover:scale-110 transition-transform`} />
                    </div>
                    {action.featured && (
                      <Badge className="bg-gradient-to-r from-electric-blue to-electric-green text-white font-bold animate-pulse">
                        HOT
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg text-white group-hover:text-electric-blue transition-colors">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-300">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-electric-blue hover:to-electric-green transition-all duration-300 text-white border-0">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-electric-blue/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trade">
              <Coins className="h-4 w-4 mr-2" />
              Trade
            </TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="trending">
              <Trophy className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-slate-800/40 border border-electric-blue/30 hover:border-electric-blue/60 transition-all duration-300 electric-frame">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Tokens</CardTitle>
                  <div className="p-1 rounded bg-electric-blue/10 border border-electric-blue/20">
                    <Coins className="h-4 w-4 text-electric-blue" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.totalTokens || 0}</div>
                  <p className="text-xs text-gray-300">Created by you</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/40 border border-electric-green/30 hover:border-electric-green/60 transition-all duration-300 electric-frame">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Portfolio Value</CardTitle>
                  <div className="p-1 rounded bg-electric-green/10 border border-electric-green/20">
                    <TrendingUp className="h-4 w-4 text-electric-green" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.totalValue || '$0.00'}</div>
                  <p className="text-xs text-gray-300">Total holdings</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/40 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 electric-frame">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Active Chats</CardTitle>
                  <div className="p-1 rounded bg-purple-400/10 border border-purple-400/20">
                    <MessageSquare className="h-4 w-4 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.activeChats || 0}</div>
                  <p className="text-xs text-gray-300">Conversations</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/40 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 electric-frame">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Viral Score</CardTitle>
                  <div className="p-1 rounded bg-yellow-400/10 border border-yellow-400/20">
                    <Zap className="h-4 w-4 text-yellow-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.viralScore || 0}</div>
                  <p className="text-xs text-gray-300">Growth potential</p>
                </CardContent>
              </Card>

              {/* Performance Monitoring */}
              <PerformanceDashboard />
            </div>

            {/* Interactive Stats */}
            <InteractiveStatsDashboard />
            
            {/* Quick Action Panel */}
            <QuickActionPanel />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <NFTPortfolioQuickView />
            <PersonalizedDashboard />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-slate-800/40 border border-electric-blue/30 electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 rounded-lg bg-electric-blue/10 border border-electric-blue/20">
                    <Activity className="h-5 w-5 text-electric-blue" />
                  </div>
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Your latest transactions and interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 border border-electric-blue/10 hover:border-electric-blue/30 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse"></div>
                          <div>
                            <p className="font-medium text-white">{activity.message}</p>
                            <p className="text-sm text-gray-400">{activity.timestamp}</p>
                          </div>
                        </div>
                        {activity.amount && (
                          <Badge className="bg-electric-green/10 text-electric-green border border-electric-green/30">+{activity.amount} SOL</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="p-4 rounded-full bg-electric-blue/10 border border-electric-blue/20 w-fit mx-auto mb-4">
                      <Activity className="h-12 w-12 text-electric-blue" />
                    </div>
                    <p className="text-gray-300 mb-4">No recent activity</p>
                    <Button asChild className="bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue hover:to-electric-green">
                      <Link href="/create">Create your first token</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <ViralDashboard />
          </TabsContent>

          <TabsContent value="trade" className="space-y-6">
            {/* Trading Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "24h Volume", value: "2,847 SOL", change: "+12.3%", positive: true },
                { label: "Active Traders", value: "1,249", change: "+8.7%", positive: true },
                { label: "Total Listings", value: "15,847", change: "+5.2%", positive: true },
                { label: "Avg Price", value: "0.24 SOL", change: "-2.1%", positive: false }
              ].map((stat, index) => (
                <Card key={index} className="bg-slate-800/40 border border-electric-blue/30 electric-frame">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <Badge variant={stat.positive ? "default" : "destructive"} className="ml-2">
                        {stat.change}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Trade Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Buy Trending", description: "Browse hot tokens", icon: TrendingUp, color: "electric-blue" },
                { title: "Sell Holdings", description: "List your tokens", icon: Wallet, color: "electric-green" },
                { title: "Portfolio Review", description: "Check performance", icon: BarChart3, color: "purple" },
                { title: "Market Analysis", description: "AI insights", icon: Eye, color: "teal" }
              ].map((action, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-800/40 border border-electric-blue/30 hover:border-electric-blue/60 electric-frame">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg bg-${action.color === 'electric-blue' ? 'electric-blue' : action.color === 'electric-green' ? 'electric-green' : action.color === 'purple' ? 'purple-400' : 'teal-400'}/10 border border-${action.color === 'electric-blue' ? 'electric-blue' : action.color === 'electric-green' ? 'electric-green' : action.color === 'purple' ? 'purple-400' : 'teal-400'}/20`}>
                        <action.icon className={`h-5 w-5 ${action.color === 'electric-blue' ? 'text-electric-blue' : action.color === 'electric-green' ? 'text-electric-green' : action.color === 'purple' ? 'text-purple-400' : 'text-teal-400'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{action.title}</h3>
                        <p className="text-sm text-gray-300">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Unified Marketplace */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-electric-cyan via-cyber-purple to-neon-pink bg-clip-text text-transparent">
                  🚀 UNIFIED MARKETPLACE
                </h2>
                <p className="text-lg text-gray-300">Trade FLBY tokens and revolutionary FlutterArt NFTs with burn-to-redeem mechanics</p>
              </div>
              
              <Tabs defaultValue="tokens" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/40 border border-electric-blue/30 electric-frame">
                  <TabsTrigger value="tokens" className="flex items-center gap-2 data-[state=active]:bg-electric-blue/20 text-white">
                    <Zap className="w-4 h-4" />
                    FLBY Tokens
                  </TabsTrigger>
                  <TabsTrigger value="nfts" className="flex items-center gap-2 data-[state=active]:bg-electric-green/20 text-white">
                    <Gem className="w-4 h-4" />
                    FlutterArt NFTs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tokens" className="space-y-6">
                  {/* Search and Filters for Tokens */}
                  <Card className="bg-slate-800/40 border border-electric-blue/30 electric-frame">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Search tokens by message or creator..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-700/50 border-electric-blue/30 text-white"
                          />
                        </div>
                        
                        <Select value={priceFilter} onValueChange={setPriceFilter}>
                          <SelectTrigger className="w-full md:w-48 bg-slate-700/50 border-electric-blue/30 text-white">
                            <SelectValue placeholder="Filter by price" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="free">Free (0 SOL)</SelectItem>
                            <SelectItem value="low">Low (0-0.1 SOL)</SelectItem>
                            <SelectItem value="medium">Medium (0.1-1 SOL)</SelectItem>
                            <SelectItem value="high">High (1+ SOL)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Token Grid */}
                  {isLoadingTokens ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <Card key={i} className="bg-slate-800/40 border-slate-700 animate-pulse">
                          <CardContent className="p-6">
                            <div className="h-6 bg-slate-700 rounded mb-4"></div>
                            <div className="h-4 bg-slate-700 rounded mb-2"></div>
                            <div className="h-4 bg-slate-700 rounded"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredTokens.length === 0 ? (
                    <Card className="bg-slate-800/40 border-slate-700">
                      <CardContent className="p-12 text-center">
                        <h3 className="text-lg font-semibold mb-2 text-white">No tokens found</h3>
                        <p className="text-slate-400 mb-4">
                          Try adjusting your search or filter criteria
                        </p>
                        <Button onClick={() => {
                          setSearchQuery("");
                          setPriceFilter("all");
                        }} className="bg-gradient-to-r from-electric-blue to-electric-green">
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTokens.map((token) => (
                        <TokenCard 
                          key={token.id} 
                          token={token} 
                          onBuy={() => handleBuyToken(token)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="nfts" className="space-y-6">
                  {/* Search and Filters for NFTs */}
                  <Card className="bg-slate-800/40 border border-electric-green/30 electric-frame">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Search NFTs by message, collection, or rarity..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 bg-slate-700/50 border-electric-green/30 text-white"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-48 bg-slate-700/50 border-electric-green/30 text-white">
                              <Filter className="w-4 h-4 mr-2" />
                              <SelectValue placeholder="Filter by..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All NFTs</SelectItem>
                              <SelectItem value="voice">Has Voice</SelectItem>
                              <SelectItem value="image">Has Image</SelectItem> 
                              <SelectItem value="burnable">Burn-to-Redeem</SelectItem>
                              <SelectItem value="legendary">Legendary</SelectItem>
                              <SelectItem value="epic">Epic</SelectItem>
                              <SelectItem value="rare">Rare</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* NFT Grid */}
                  {isLoadingNFTs ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {[...Array(8)].map((_, i) => (
                        <Card key={i} className="bg-slate-800/40 border-slate-700 animate-pulse">
                          <CardContent className="p-6">
                            <div className="aspect-square bg-slate-700 rounded-lg mb-4"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-slate-700 rounded"></div>
                              <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : nftListings.length === 0 ? (
                    <Card className="bg-slate-800/40 border-slate-700">
                      <CardContent className="p-12 text-center">
                        <Gem className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No NFTs Available</h3>
                        <p className="text-slate-400">
                          No FlutterArt NFTs are currently listed for sale.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {nftListings.map((nft: NFTListing) => (
                        <Card key={nft.id} className="bg-slate-800/40 border border-electric-green/20 hover:border-electric-green/50 transition-all duration-300 group electric-frame">
                          <CardContent className="p-6">
                            {/* NFT Image/Preview */}
                            <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                              {nft.imageFile ? (
                                <img 
                                  src={nft.imageFile} 
                                  alt={`NFT #${nft.tokenNumber}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="text-6xl opacity-20">
                                  🦋
                                </div>
                              )}
                              
                              {/* Rarity Badge */}
                              {nft.rarity && (
                                <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white border-0`}>
                                  <span className="flex items-center gap-1">
                                    {getRarityIcon(nft.rarity)}
                                    {nft.rarity}
                                  </span>
                                </Badge>
                              )}

                              {/* Media Icons */}
                              <div className="absolute bottom-2 left-2 flex gap-1">
                                {nft.imageFile && (
                                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                    <ImageIcon className="w-3 h-3" />
                                  </Badge>
                                )}
                                {nft.voiceFile && (
                                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                    <Volume2 className="w-3 h-3" />
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* NFT Details */}
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold text-white text-sm mb-1">
                                  {nft.collectionName} #{nft.tokenNumber}
                                </h3>
                                <p className="text-slate-400 text-xs line-clamp-2">
                                  {nft.message}
                                </p>
                              </div>

                              {/* Price and Actions */}
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-xs text-slate-400">Price</p>
                                    <p className="font-bold text-lg text-white">
                                      {nft.price} {nft.currency}
                                    </p>
                                  </div>
                                  {nft.burnToRedeem && (
                                    <div className="text-right">
                                      <p className="text-xs text-slate-400">Burnable Value</p>
                                      <p className="font-semibold text-sm text-orange-400">
                                        {nft.originalValue} {nft.currency}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <Button 
                                    onClick={() => {
                                      setSelectedNFT(nft);
                                      setShowBuyDialog(true);
                                    }}
                                    className="flex-1 bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80"
                                    size="sm"
                                  >
                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                    Buy
                                  </Button>
                                  {nft.burnToRedeem && (
                                    <Button 
                                      onClick={() => {
                                        setSelectedNFT(nft);
                                        setShowBurnDialog(true);
                                      }}
                                      variant="outline"
                                      className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                                      size="sm"
                                    >
                                      <Flame className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <EngagementBooster />
            <ViralGrowthAccelerator />
            <ViralSharingAssistant />
          </TabsContent>
        </Tabs>


        
      </div>
      
      {/* Mobile Onboarding Wizard */}
      {showOnboarding && (
        <MobileOnboardingWizard onComplete={handleOnboardingComplete} />
      )}
      
      {/* Wallet Connection Wizard */}
      {showWalletWizard && (
        <WalletConnectionWizard 
          onConnect={handleWalletConnect}
          onClose={() => setShowWalletWizard(false)}
        />
      )}
      
      {/* Quick Access FAB for mobile */}
      <QuickAccessFAB />

      {/* Contextual Chat Button - Bottom Right Position */}
      <div className="fixed bottom-6 right-6 z-40">
        <ContextualChatButton context="dashboard" />
      </div>

      {/* Buy NFT Dialog */}
      <AlertDialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Purchase NFT #{selectedNFT?.tokenNumber}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Are you sure you want to buy this NFT for {selectedNFT?.price} {selectedNFT?.currency}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white border-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedNFT && buyNFTMutation.mutate(selectedNFT.id)}
              disabled={buyNFTMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {buyNFTMutation.isPending ? "Processing..." : "Buy NFT"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Burn NFT Dialog */}
      <AlertDialog open={showBurnDialog} onOpenChange={setShowBurnDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Burn NFT #{selectedNFT?.tokenNumber}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              <div className="space-y-2">
                <p>
                  Burning this NFT will permanently destroy it and redeem {selectedNFT?.originalValue} {selectedNFT?.currency}.
                </p>
                <p className="text-orange-400 font-semibold">
                  This action is irreversible and creates permanent scarcity!
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white border-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedNFT && burnNFTMutation.mutate(selectedNFT.id)}
              disabled={burnNFTMutation.isPending}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {burnNFTMutation.isPending ? "Burning..." : "Burn & Redeem"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}