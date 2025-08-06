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

import { ViralGrowthAccelerator } from "@/components/viral-growth-accelerator";
import { MobileOnboardingWizard } from "@/components/mobile-onboarding-wizard";
import { WalletConnectionWizard } from "@/components/wallet-connection-wizard";
import { QuickAccessFAB } from "@/components/quick-access-fab";
import { PersonalizedDashboard } from "@/components/PersonalizedDashboard";
import { PerformanceDashboard } from "@/components/performance-dashboard";
import ViralDashboard from "@/pages/viral-dashboard";
import { WalletProductsDisplay } from "@/components/dashboard/WalletProductsDisplay";

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
      title: "Redeem & Burn",
      description: "Claim your token rewards",
      icon: Gift,
      href: "/redeem",
      color: "electric-green",
      featured: true
    },
    {
      title: "AI Analysis",
      description: "Get intelligent insights",
      icon: Sparkles,
      href: "/intelligence",
      color: "purple"
    },
    {
      title: "Chat & Connect",
      description: "Join blockchain conversations",
      icon: MessageSquare,
      href: "/chat",
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Welcome to Flutterbye
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your unified platform for tokenized messaging, AI-powered trading, and blockchain intelligence
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-electric-blue/20 hover:border-electric-blue/40">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <action.icon className={`h-8 w-8 text-${action.color} group-hover:scale-110 transition-transform`} />
                    {action.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold">
                        HOT
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-electric-blue transition-colors">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-electric-blue/10">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="redeem" className="text-electric-green">
              <Gift className="h-4 w-4 mr-2" />
              Redeem & Burn
            </TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="trending">
              <Trophy className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="redeem" className="space-y-6">
            {/* Redeem & Burn Feature Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Redeem Tokens Section */}
              <Card className="border-electric-green/20 hover:border-electric-green/40 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-electric-green/10">
                      <Gift className="h-6 w-6 text-electric-green" />
                    </div>
                    <div>
                      <CardTitle className="text-electric-green">Redeem Tokens</CardTitle>
                      <CardDescription>
                        Claim your token rewards and unlock attached value
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium text-sm">How it Works:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-electric-green rounded-full"></div>
                        Enter your redemption code or scan QR
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-electric-green rounded-full"></div>
                        Verify token ownership in your wallet
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-electric-green rounded-full"></div>
                        Claim SOL/USDC value instantly
                      </li>
                    </ul>
                  </div>
                  
                  <Link href="/redeem">
                    <Button className="w-full bg-gradient-to-r from-electric-green to-teal-400 hover:from-electric-green/80 hover:to-teal-400/80">
                      <Gift className="mr-2 h-4 w-4" />
                      Start Redeeming Tokens
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Burn Tokens Section */}
              <Card className="border-orange-500/20 hover:border-orange-500/40 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-orange-500/10">
                      <Zap className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <CardTitle className="text-orange-500">Burn for Privacy</CardTitle>
                      <CardDescription>
                        Burn tokens to read private messages and unlock content
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium text-sm">Burn-to-Read Features:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        Private message unlocking
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        Time-locked content access
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        Premium content reveals
                      </li>
                    </ul>
                  </div>
                  
                  <Link href="/burn">
                    <Button variant="outline" className="w-full border-orange-500/50 text-orange-500 hover:bg-orange-500/10">
                      <Zap className="mr-2 h-4 w-4" />
                      Burn Tokens to Read
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Wallet Products Display */}
            <WalletProductsDisplay />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalTokens || 0}</div>
                  <p className="text-xs text-muted-foreground">Created by you</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalValue || '$0.00'}</div>
                  <p className="text-xs text-muted-foreground">Total holdings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeChats || 0}</div>
                  <p className="text-xs text-muted-foreground">Conversations</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Viral Score</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.viralScore || 0}</div>
                  <p className="text-xs text-muted-foreground">Growth potential</p>
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
            {/* Wallet Products Display */}
            <WalletProductsDisplay />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest transactions and interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                          <div>
                            <p className="font-medium">{activity.message}</p>
                            <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                          </div>
                        </div>
                        {activity.amount && (
                          <Badge variant="outline">+{activity.amount} SOL</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recent activity</p>
                    <Button asChild className="mt-4">
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