import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MessageSquare, 
  BarChart3,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import { Link } from "wouter";

interface PlatformStats {
  totalUsers: number;
  totalTokens: number;
  totalValueEscrowed: number;
  activeUsers24h: number;
  recentTokens: Array<{
    id: string;
    message: string;
    attachedValue: number;
    createdAt: string;
  }>;
}

export default function ProfessionalHome() {
  const { data: stats } = useQuery<PlatformStats>({
    queryKey: ["/api/platform/stats"],
    refetchInterval: 30000,
  });

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Tokenized Messaging",
      description: "Transform messages into SPL tokens with attached value",
      action: "Start Minting",
      href: "/mint"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Value Distribution",
      description: "Attach SOL value to tokens for recipients to redeem",
      action: "Explore Tokens",
      href: "/explore"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Portfolio Tracking",
      description: "Monitor your token holdings and redemption history",
      action: "View Portfolio",
      href: "/portfolio"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Trading",
      description: "Trade tokens in a secure, decentralized marketplace",
      action: "Visit Marketplace",
      href: "/marketplace"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              Solana Blockchain • SPL Tokens
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Tokenized Messaging for{" "}
              <span className="text-primary">Web3</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create 27-character tokenized messages as SPL tokens, attach value, 
              and enable seamless communication with built-in financial utility on Solana.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/mint">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Create Token Message
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                <Link href="/explore">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Explore Platform
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      {stats && (
        <section className="py-16 border-b">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stats.totalTokens.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Tokens Created</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stats.totalValueEscrowed.toFixed(2)} SOL</div>
                  <p className="text-sm text-muted-foreground">Value Escrowed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stats.activeUsers24h}</div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for tokenized communication and value distribution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                  <Button variant="ghost" asChild className="group-hover:bg-primary/5">
                    <Link href={feature.href}>
                      {feature.action}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      {stats?.recentTokens && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Recent Token Activity</h2>
                <p className="text-muted-foreground">
                  Latest tokenized messages created on the platform
                </p>
              </div>
              
              <div className="space-y-4">
                {stats.recentTokens.slice(0, 5).map((token) => (
                  <Card key={token.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">"{token.message}"</p>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(token.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">
                            {token.attachedValue.toFixed(3)} SOL
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            FLBY-MSG
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/explore">
                    View All Tokens
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Technology Stack */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Built on Solana</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">High Performance</h3>
                <p className="text-muted-foreground">
                  Fast transactions with low fees on Solana blockchain
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Secure & Decentralized</h3>
                <p className="text-muted-foreground">
                  Non-custodial platform with smart contract security
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Global Access</h3>
                <p className="text-muted-foreground">
                  Accessible worldwide with wallet-based authentication
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Creating?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the tokenized messaging revolution on Solana
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/mint">
              Create Your First Token
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}