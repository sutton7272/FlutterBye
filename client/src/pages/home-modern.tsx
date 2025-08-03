import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, MessageSquare, Coins, Zap, TrendingUp, Users, Target, Sparkles, Shield, Clock, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Stats {
  totalTokens: number;
  totalValue: number;
  activeUsers: number;
  messages: number;
}

interface RecentToken {
  id: string;
  message: string;
  attachedValue: number;
  currency: string;
  createdAt: string;
}

export default function ModernHomePage() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  const { data: recentTokens } = useQuery<RecentToken[]>({
    queryKey: ['/api/tokens/recent'],
  });

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden py-20 lg:py-32">
        {/* Global cosmic background is handled by body CSS */}
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              Live on Solana Testnet
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="text-gradient">
                Tokenized Communication
              </span>
              <br />
              <span className="text-foreground">Reimagined</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your 27-character messages into tradeable SPL tokens with attached SOL value. 
              The future of Web3 messaging and value transfer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/mint">
                <Button size="lg" className="modern-gradient text-white font-semibold px-8 h-12 shadow-lg hover:shadow-xl transition-all">
                  <Coins className="mr-2 h-5 w-5" />
                  Create Your First Token
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/5 h-12 px-8">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gradient">
                {stats?.totalTokens?.toLocaleString() || '127'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Tokens Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gradient">
                {stats?.totalValue?.toFixed(2) || '24.7'} SOL
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gradient">
                {stats?.activeUsers || '89'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gradient">
                {stats?.messages?.toLocaleString() || '1.2K'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Messages Sent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-gradient">Why Flutterbye?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The first platform to merge messaging with tokenomics, creating a new economy of communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="premium-card group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 modern-gradient rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Tokenized Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Turn any 27-character message into a tradeable SPL token with built-in value and emotional context.
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 modern-gradient rounded-xl flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Instant Value Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Attach SOL value to your messages and enable instant peer-to-peer value transfer through communication.
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 modern-gradient rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Blockchain Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built on Solana blockchain for maximum security, transparency, and near-instant transaction finality.
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 modern-gradient rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Viral Mechanics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built-in gamification and viral sharing mechanisms that reward engagement and community growth.
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 modern-gradient rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join a community of creators, traders, and innovators building the future of Web3 communication.
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 modern-gradient rounded-xl flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced AI analyzes emotional context and suggests optimal tokenization strategies for maximum impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gradient mb-2">Live Activity</h2>
              <p className="text-muted-foreground">See what's happening on Flutterbye right now</p>
            </div>
            <Link href="/explore">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTokens?.slice(0, 6).map((token) => (
              <Card key={token.id} className="premium-card group cursor-pointer token-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="text-primary border-primary/30">
                      New Token
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {new Date(token.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-lg font-mono font-semibold mb-2">
                      "{token.message}"
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-accent font-semibold">
                        {token.attachedValue} {token.currency}
                      </div>
                      <div className="text-sm text-muted-foreground">attached</div>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="ghost" className="w-full text-primary hover:bg-primary/5">
                    <Coins className="mr-2 h-4 w-4" />
                    View Token
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Ready to Start?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users already creating, trading, and sharing tokenized messages on Flutterbye.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mint">
              <Button size="lg" className="modern-gradient text-white font-semibold px-8 h-12 shadow-lg">
                <Coins className="mr-2 h-5 w-5" />
                Create Your First Token
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/5 h-12 px-8">
                <Clock className="mr-2 h-4 w-4" />
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}