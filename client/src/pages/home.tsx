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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Fun vibrant background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-flutter-purple/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-flutter-cyan/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-flutter-pink/15 rounded-full blur-2xl animate-ping delay-500"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-neon-green/10 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-20" style={{
        background: `
          radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, hsl(var(--background)) 0%, rgba(30, 30, 46, 0.8) 100%)
        `
      }}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4 relative overflow-hidden" style={{
              background: 'linear-gradient(45deg, rgba(168, 85, 247, 0.2), rgba(6, 182, 212, 0.2))',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
              animation: 'cyber-pulse 2s ease-in-out infinite alternate'
            }}>
              <span className="relative z-10">
                <span className="solana-accent font-semibold">⚡ Solana Blockchain</span> • 🎯 SPL Tokens
              </span>
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              🚀 Tokenized Messaging for{" "}
              <span className="flutter-gradient relative">
                <span className="relative z-10">Web3</span>
                <span className="absolute inset-0 bg-gradient-to-r from-flutter-purple via-flutter-cyan to-flutter-pink opacity-20 blur-xl"></span>
              </span> 
              🌟
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              💫 Create <span className="text-flutter-cyan font-semibold">27-character</span> tokenized messages as 
              <span className="text-flutter-purple font-semibold"> SPL tokens</span>, attach value, 
              and enable seamless communication with built-in financial utility on 
              <span className="text-solana-green font-semibold">Solana</span>. 🔥
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg" className="text-lg px-8 btn-primary">
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
              <Card key={index} className="group hover-lift blockchain-glow relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-flutter-purple/10 via-flutter-cyan/8 to-flutter-pink/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-flutter-purple/30 via-flutter-cyan/25 to-flutter-pink/30 rounded-lg text-accent border border-accent/20 group-hover:shadow-xl group-hover:animate-pulse transition-all">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:flutter-gradient transition-all">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                  <Button variant="ghost" asChild className="group-hover:bg-primary/10 hover:text-accent transition-all">
                    <Link href={feature.href}>
                      {feature.action}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-flutter-purple/30 via-flutter-cyan/20 to-flutter-pink/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/70"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 flutter-gradient">
            Ready to Start Creating?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join the tokenized messaging revolution on <span className="solana-accent font-semibold">Solana</span>
          </p>
          <Button size="lg" className="btn-primary text-lg px-8" asChild>
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