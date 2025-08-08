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
  Trophy
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
import { PerformanceDashboard } from "@/components/performance-dashboard";
import ViralDashboard from "@/pages/viral-dashboard";
import { ContextualChatButton } from "@/components/contextual-chat-button";

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
      href: "/flutterwave",
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
      href: "/flutterart",
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
            <ContextualChatButton context="dashboard" />
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

            {/* Embedded Marketplace */}
            <Card className="bg-slate-800/40 border border-electric-blue/30 electric-frame">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">Token Marketplace</CardTitle>
                    <CardDescription>Buy and sell tokens directly from your dashboard</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80">
                    View Full Market
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-400">Marketplace integration loading...</p>
                  <p className="text-sm text-gray-500 mt-2">Trade functionality will be available here</p>
                </div>
              </CardContent>
            </Card>
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
    </div>
  );
}