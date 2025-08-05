import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Search, 
  Filter,
  Eye,
  ShoppingCart,
  ArrowUpDown,
  BarChart3,
  Coins,
  Star,
  Zap,
  Activity
} from "lucide-react";
import Marketplace from "./marketplace";
import Portfolio from "./portfolio";

export default function Trade() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");

  const tradingStats = [
    {
      label: "24h Volume",
      value: "2,847 SOL",
      change: "+12.3%",
      positive: true
    },
    {
      label: "Active Traders",
      value: "1,249",
      change: "+8.7%",
      positive: true
    },
    {
      label: "Total Listings",
      value: "15,847",
      change: "+5.2%",
      positive: true
    },
    {
      label: "Avg Price",
      value: "0.24 SOL",
      change: "-2.1%",
      positive: false
    }
  ];

  const quickActions = [
    {
      title: "Buy Trending",
      description: "Browse hot tokens",
      icon: TrendingUp,
      action: "marketplace"
    },
    {
      title: "Sell Holdings",
      description: "List your tokens",
      icon: ShoppingCart,
      action: "portfolio"
    },
    {
      title: "Portfolio Review",
      description: "Check performance",
      icon: BarChart3,
      action: "portfolio"
    },
    {
      title: "Market Analysis",
      description: "AI insights",
      icon: Eye,
      action: "analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Trade & Discover
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Buy, sell, and discover valuable tokens in the Flutterbye marketplace
          </p>
        </div>

        {/* Trading Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tradingStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Badge variant={stat.positive ? "default" : "destructive"} className="ml-2">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex-col space-y-2 hover:bg-muted/50"
              onClick={() => setActiveTab(action.action)}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tokens, creators, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="volume">Highest Volume</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Trading Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <Marketplace />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Portfolio />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Market Trends
                  </CardTitle>
                  <CardDescription>
                    Real-time market analysis and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Most Active Category</span>
                      <Badge>Emotional Tokens</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Top Performer (24h)</span>
                      <span className="text-sm font-medium text-electric-green">+47.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Market Sentiment</span>
                      <Badge className="bg-electric-green/20 text-electric-green">Bullish</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Your Performance
                  </CardTitle>
                  <CardDescription>
                    Your trading statistics and insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total ROI</span>
                      <span className="text-sm font-medium text-electric-green">+23.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Win Rate</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Best Trade</span>
                      <span className="text-sm font-medium text-electric-green">+156%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet Overview
                  </CardTitle>
                  <CardDescription>
                    Your connected wallet details and balances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Balance Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Coins className="h-8 w-8 text-electric-blue mx-auto mb-2" />
                        <p className="text-2xl font-bold">12.47 SOL</p>
                        <p className="text-sm text-muted-foreground">Solana</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Star className="h-8 w-8 text-electric-green mx-auto mb-2" />
                        <p className="text-2xl font-bold">1,247 FLBY</p>
                        <p className="text-sm text-muted-foreground">Flutterbye Tokens</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold">847 USDC</p>
                        <p className="text-sm text-muted-foreground">USD Coin</p>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div>
                      <h4 className="font-medium mb-3">Recent Transactions</h4>
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-3">
                              <Activity className="h-4 w-4 text-electric-blue" />
                              <div>
                                <p className="text-sm font-medium">Token Purchase</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                              </div>
                            </div>
                            <span className="text-sm font-medium">-0.5 SOL</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Swap Tokens
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Coins className="mr-2 h-4 w-4" />
                    Add Funds
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Activity className="mr-2 h-4 w-4" />
                    Transaction History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}