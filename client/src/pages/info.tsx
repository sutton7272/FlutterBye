import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { BookOpen, Map, Zap, Users, Coins, Trophy, Star, CheckCircle, Clock, AlertCircle, Target, Rocket, FileText, TrendingUp, Shield, Globe, Heart, MessageSquare, DollarSign, Building2, Gift, Sparkles, Ticket, UserPlus, Search, Filter, Eye, Share2, BarChart3, LineChart, PieChart, Activity, Brain, Lock, Settings } from "lucide-react";

interface Token {
  id: string;
  message: string;
  symbol: string;
  mintAddress: string;
  hasAttachedValue: boolean;
  attachedValue: string;
  currency: string;
  escrowStatus: string;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalTokens: number;
  totalValueEscrowed: string;
  totalRedemptions: number;
  activeUsers: number;
}

export default function InfoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [valueFilter, setValueFilter] = useState('all');

  // Data fetching for explore functionality
  const { data: publicTokens = [], isLoading: tokensLoading } = useQuery({
    queryKey: ['/api/tokens/public'],
  });

  const { data: tokensWithValue = [], isLoading: valueTokensLoading } = useQuery({
    queryKey: ['/api/tokens/with-value'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  // Filter functions for explore functionality
  const filteredPublicTokens = (publicTokens as Token[]).filter((token: Token) => {
    const searchMatch = token.message.toLowerCase().includes(searchQuery.toLowerCase());
    const valueMatch = valueFilter === 'all' || 
      (valueFilter === 'with-value' && token.hasAttachedValue) ||
      (valueFilter === 'no-value' && !token.hasAttachedValue);
    return searchMatch && valueMatch;
  });

  const filteredValueTokens = (tokensWithValue as Token[]).filter((token: Token) => 
    token.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (token: Token) => {
    if (token.hasAttachedValue) {
      switch (token.escrowStatus) {
        case 'escrowed':
          return <Badge className="bg-electric-green/20 text-electric-green border border-electric-green/30">💰 {token.attachedValue} {token.currency}</Badge>;
        case 'redeemed':
          return <Badge variant="outline">✅ Redeemed</Badge>;
        default:
          return <Badge variant="secondary">💎 Value Attached</Badge>;
      }
    }
    return <Badge variant="outline">💬 Message Only</Badge>;
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Flutterbye Information Hub</h1>
          <p className="text-xl text-muted-foreground">
            Roadmap, whitepaper, and comprehensive platform information
          </p>
        </div>

        <Tabs defaultValue="roadmap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
            <TabsTrigger value="roadmap" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="whitepaper" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Whitepaper
            </TabsTrigger>
            <TabsTrigger value="flby" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              FLBY Token
              <Badge className="bg-red-500 text-white text-xs ml-1 shadow-lg shadow-red-500/50 border border-red-400 animate-pulse glow-red">Coming Soon</Badge>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Programs
              <Badge className="bg-red-500 text-white text-xs ml-1 shadow-lg shadow-red-500/50 border border-red-400 animate-pulse glow-red">Coming Soon</Badge>
            </TabsTrigger>
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Explore
            </TabsTrigger>
          </TabsList>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Development Roadmap
                </CardTitle>
                <CardDescription>
                  Our journey from tokenized messaging to Web3 communication protocol
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Phase 1 - FlutterbyeMSG Core - Complete */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="w-0.5 h-16 bg-green-500/30 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-green-400">Phase 1: FlutterbyeMSG Platform</h3>
                        <Badge className="bg-green-600">Complete</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Revolutionary tokenized messaging system transforming communication into value
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>27-character SPL token creation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>SOL/USDC/FLBY value attachment</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Burn-to-redeem mechanism</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Viral distribution analytics</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2 - FlutterArt & Chat - Complete */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="w-0.5 h-16 bg-green-500/30 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-green-400">Phase 2: FlutterArt & Real-Time Chat</h3>
                        <Badge className="bg-green-600">Complete</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Advanced NFT creation platform and blockchain-powered messaging system
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Advanced NFT creation suite</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>QR code & time-lock features</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>WebSocket real-time chat</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Voice messages & media sharing</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3 - FlutterWave & FlutterAI - Complete */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="w-0.5 h-16 bg-green-500/30 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-green-400">Phase 3: FlutterWave & FlutterAI Intelligence</h3>
                        <Badge className="bg-green-600">Complete</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        AI-powered SMS-to-blockchain integration and comprehensive intelligence platform
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>127-emotion spectrum analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Viral prediction algorithms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>AI content generation suite</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Wallet intelligence gathering</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 4 - Enterprise & MainNet - Complete */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="w-0.5 h-16 bg-green-500/30 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-green-400">Phase 4: Enterprise Infrastructure</h3>
                        <Badge className="bg-green-600">Complete</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Bank-grade enterprise wallet infrastructure and MainNet deployment readiness
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Custodial wallet system</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Smart contract escrow</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>MainNet deployment ready</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Enterprise analytics dashboard</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 5 - Future Expansion */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-blue-400">Phase 5: Global Web3 Protocol</h3>
                        <Badge variant="outline" className="border-blue-500 text-blue-400">2025+</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Cross-chain expansion and universal Web3 communication standard
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>Multi-chain integration (6 blockchains)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>Industry protocol standardization</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>Enterprise partnership network</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>Metaverse integration layer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whitepaper Tab */}
          <TabsContent value="whitepaper" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Flutterbye Comprehensive Whitepaper
                </CardTitle>
                <CardDescription>
                  Complete technical architecture and ecosystem overview covering all five platform components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Executive Summary */}
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-gradient">Executive Summary</h3>
                    <p className="text-muted-foreground">
                      Flutterbye represents the world's first comprehensive Web3 communication ecosystem, featuring five revolutionary 
                      components that transform digital interaction into a value-bearing, AI-powered blockchain experience. Our platform 
                      enables tokenized messaging (FlutterbyeMSG), advanced NFT creation (FlutterArt), AI-driven communication (FlutterWave), 
                      real-time blockchain chat, and comprehensive artificial intelligence (FlutterAI).
                    </p>
                  </div>

                  {/* FlutterbyeMSG */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Coins className="w-5 h-5 text-electric-blue" />
                      FlutterbyeMSG: Tokenized Communication Engine
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Card className="p-4 border border-electric-blue/20 bg-electric-blue/5">
                        <h4 className="font-semibold mb-2">Core Architecture</h4>
                        <p className="text-sm text-muted-foreground">
                          27-character SPL token creation system with SOL, USDC, and FLBY value attachment. 
                          Revolutionary burn-to-redeem mechanism enables viral value distribution.
                        </p>
                      </Card>
                      <Card className="p-4 border border-electric-green/20 bg-electric-green/5">
                        <h4 className="font-semibold mb-2">Economic Model</h4>
                        <p className="text-sm text-muted-foreground">
                          Multi-currency support with configurable fee structures. FLBY token holders receive 
                          10% fee discounts and exclusive governance rights.
                        </p>
                      </Card>
                    </div>
                  </div>

                  {/* FlutterArt */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-400" />
                      FlutterArt: Advanced NFT Creation Platform
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Card className="p-4 border border-purple-500/20 bg-purple-500/5">
                        <h4 className="font-semibold mb-2">Creation Suite</h4>
                        <p className="text-sm text-muted-foreground">
                          Professional NFT minting with QR code generation, time-lock mechanisms, 
                          limited edition collections, and royalty management systems.
                        </p>
                      </Card>
                      <Card className="p-4 border border-pink-500/20 bg-pink-500/5">
                        <h4 className="font-semibold mb-2">Marketplace Integration</h4>
                        <p className="text-sm text-muted-foreground">
                          Built-in marketplace with advanced filtering, collection management, 
                          and integrated wallet connectivity for seamless transactions.
                        </p>
                      </Card>
                    </div>
                  </div>

                  {/* FlutterWave */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      FlutterWave: AI-Powered Emotional Intelligence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Card className="p-4 border border-red-500/20 bg-red-500/5">
                        <h4 className="font-semibold mb-2">Emotion Analysis Engine</h4>
                        <p className="text-sm text-muted-foreground">
                          127-emotion spectrum analysis with 97.3% accuracy. SMS-to-blockchain integration 
                          with viral prediction algorithms and cultural adaptation systems.
                        </p>
                      </Card>
                      <Card className="p-4 border border-orange-500/20 bg-orange-500/5">
                        <h4 className="font-semibold mb-2">ARIA AI Companions</h4>
                        <p className="text-sm text-muted-foreground">
                          Advanced AI avatar system with personality matching, conversation intelligence, 
                          and emotional resonance tracking for enhanced user engagement.
                        </p>
                      </Card>
                    </div>
                  </div>

                  {/* Real-Time Chat */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-green-400" />
                      Blockchain-Powered Real-Time Chat
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Card className="p-4 border border-green-500/20 bg-green-500/5">
                        <h4 className="font-semibold mb-2">WebSocket Infrastructure</h4>
                        <p className="text-sm text-muted-foreground">
                          Real-time messaging with voice notes, media sharing, and premium features. 
                          Gamified engagement with levels, streaks, and achievement systems.
                        </p>
                      </Card>
                      <Card className="p-4 border border-teal-500/20 bg-teal-500/5">
                        <h4 className="font-semibold mb-2">Premium Features</h4>
                        <p className="text-sm text-muted-foreground">
                          Voice recording, GIF integration, poll creation, and NFT sharing. 
                          Mobile-responsive design with contextual AI assistance.
                        </p>
                      </Card>
                    </div>
                  </div>

                  {/* FlutterAI */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-cyan-400" />
                      FlutterAI: Comprehensive Intelligence Platform
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Card className="p-4 border border-cyan-500/20 bg-cyan-500/5">
                        <h4 className="font-semibold mb-2">Wallet Intelligence</h4>
                        <p className="text-sm text-muted-foreground">
                          Advanced wallet analysis with behavioral patterns, wealth indicators, 
                          demographic insights, and targeted marketing capabilities.
                        </p>
                      </Card>
                      <Card className="p-4 border border-indigo-500/20 bg-indigo-500/5">
                        <h4 className="font-semibold mb-2">Content Generation</h4>
                        <p className="text-sm text-muted-foreground">
                          OpenAI GPT-4o integration for automated content creation, campaign optimization, 
                          and predictive analytics with enterprise-grade pricing management.
                        </p>
                      </Card>
                    </div>
                  </div>

                  {/* Enterprise Infrastructure */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-yellow-400" />
                      Enterprise Infrastructure & Security
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Card className="p-4 border border-yellow-500/20 bg-yellow-500/5">
                        <h4 className="font-semibold mb-2">Custodial Wallet System</h4>
                        <p className="text-sm text-muted-foreground">
                          Bank-grade multi-currency custodial wallet infrastructure with disaster recovery, 
                          AES-256 encryption, and comprehensive audit trail logging.
                        </p>
                      </Card>
                      <Card className="p-4 border border-amber-500/20 bg-amber-500/5">
                        <h4 className="font-semibold mb-2">Smart Contract Escrow</h4>
                        <p className="text-sm text-muted-foreground">
                          Rust/Anchor-based escrow system with timeout protection, multi-signature control, 
                          and automatic fund recovery for enterprise contracts up to $2M.
                        </p>
                      </Card>
                    </div>
                  </div>

                  {/* Technology Stack */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Core Technology Stack</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border border-slate-600 rounded-lg">
                        <Globe className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                        <div className="text-sm font-medium">Solana Blockchain</div>
                      </div>
                      <div className="text-center p-3 border border-slate-600 rounded-lg">
                        <Brain className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                        <div className="text-sm font-medium">OpenAI GPT-4o</div>
                      </div>
                      <div className="text-center p-3 border border-slate-600 rounded-lg">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-green-400" />
                        <div className="text-sm font-medium">Rust/Anchor</div>
                      </div>
                      <div className="text-center p-3 border border-slate-600 rounded-lg">
                        <Activity className="w-8 h-8 mx-auto mb-2 text-red-400" />
                        <div className="text-sm font-medium">WebSocket RT</div>
                      </div>
                    </div>
                  </div>

                  {/* Download Actions */}
                  <div className="flex flex-wrap gap-4">
                    <Button className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Download Complete Whitepaper (PDF)
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Technical Documentation
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      API Reference Guide
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FLBY Token Tab */}
          <TabsContent value="flby" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    FLBY Token Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border border-blue-500/20 bg-blue-500/5 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <div>
                        <h4 className="font-medium">Staking Rewards</h4>
                        <p className="text-sm text-muted-foreground">Up to 18% APY base rewards</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-green-500/20 bg-green-500/5 rounded-lg">
                      <Users className="w-5 h-5 text-green-400" />
                      <div>
                        <h4 className="font-medium">Governance Rights</h4>
                        <p className="text-sm text-muted-foreground">Vote on platform decisions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-purple-500/20 bg-purple-500/5 rounded-lg">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <div>
                        <h4 className="font-medium">Fee Discounts</h4>
                        <p className="text-sm text-muted-foreground">10% reduction on all fees</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <div>
                        <h4 className="font-medium">Exclusive Access</h4>
                        <p className="text-sm text-muted-foreground">Premium features & early access</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Token Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Community (40%)</span>
                        <span className="text-blue-400">400M FLBY</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Staking Rewards (25%)</span>
                        <span className="text-green-400">250M FLBY</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Development (20%)</span>
                        <span className="text-purple-400">200M FLBY</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Marketing (10%)</span>
                        <span className="text-orange-400">100M FLBY</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Reserve (5%)</span>
                        <span className="text-gray-400">50M FLBY</span>
                      </div>
                      <Progress value={5} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>FLBY Features Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-auto p-4 flex flex-col items-center gap-2">
                    <Zap className="w-6 h-6" />
                    <span>FLBY Staking</span>
                    <span className="text-xs text-muted-foreground">Earn rewards & governance</span>
                  </Button>
                  <Button className="h-auto p-4 flex flex-col items-center gap-2">
                    <Users className="w-6 h-6" />
                    <span>Governance</span>
                    <span className="text-xs text-muted-foreground">Vote on proposals</span>
                  </Button>
                  <Button className="h-auto p-4 flex flex-col items-center gap-2">
                    <Coins className="w-6 h-6" />
                    <span>Airdrop</span>
                    <span className="text-xs text-muted-foreground">Claim rewards</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                // FlutterbyeMSG Features
                {
                  title: "FlutterbyeMSG Platform",
                  description: "27-character SPL token creation with value attachment",
                  icon: Coins,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Multi-Currency Value",
                  description: "SOL, USDC, and FLBY value attachment system",
                  icon: DollarSign,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Burn-to-Redeem",
                  description: "Revolutionary viral value distribution mechanism",
                  icon: Zap,
                  status: "Live",
                  color: "green"
                },
                // FlutterArt Features
                {
                  title: "FlutterArt NFT Platform",
                  description: "Advanced NFT creation with QR codes & time-locks",
                  icon: Star,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "NFT Marketplace",
                  description: "Built-in marketplace with collection management",
                  icon: Building2,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Limited Edition Collections",
                  description: "Professional limited edition NFT sets",
                  icon: Trophy,
                  status: "Live",
                  color: "green"
                },
                // FlutterWave Features
                {
                  title: "FlutterWave AI Engine",
                  description: "127-emotion analysis with 97.3% accuracy",
                  icon: Heart,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "ARIA AI Companions",
                  description: "Intelligent conversation and personality matching",
                  icon: Users,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "SMS-to-Blockchain",
                  description: "Emotional token creation from SMS messages",
                  icon: MessageSquare,
                  status: "Live",
                  color: "green"
                },
                // Chat Features
                {
                  title: "Real-Time Chat System",
                  description: "WebSocket-powered blockchain messaging",
                  icon: MessageSquare,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Voice & Media Sharing",
                  description: "Voice notes, GIFs, and premium chat features",
                  icon: Activity,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Gamified Engagement",
                  description: "Levels, streaks, achievements, and leaderboards",
                  icon: Trophy,
                  status: "Live",
                  color: "green"
                },
                // FlutterAI Features
                {
                  title: "FlutterAI Intelligence",
                  description: "Comprehensive wallet analysis and insights",
                  icon: Brain,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "AI Content Generation",
                  description: "OpenAI GPT-4o powered content creation",
                  icon: FileText,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Predictive Analytics",
                  description: "Campaign optimization and market insights",
                  icon: BarChart3,
                  status: "Live",
                  color: "green"
                },
                // Enterprise Features
                {
                  title: "Custodial Wallet System",
                  description: "Bank-grade multi-currency wallet infrastructure",
                  icon: Shield,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Smart Contract Escrow",
                  description: "Rust/Anchor escrow for enterprise contracts",
                  icon: Lock,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "MainNet Ready",
                  description: "Production deployment infrastructure complete",
                  icon: Globe,
                  status: "Live",
                  color: "green"
                },
                // Additional Live Features
                {
                  title: "Viral Analytics Dashboard",
                  description: "Real-time viral token tracking and metrics",
                  icon: BarChart3,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Admin Content Management",
                  description: "Dynamic content editing and marketing analytics",
                  icon: Settings,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Enterprise Dashboard",
                  description: "Comprehensive business intelligence platform",
                  icon: Building2,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Advanced Analytics Suite",
                  description: "Real-time platform metrics and business intelligence",
                  icon: PieChart,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Automation Workflows",
                  description: "AI-powered automation and task orchestration",
                  icon: Zap,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Platform Diagnostics",
                  description: "Comprehensive health monitoring and diagnostics",
                  icon: Activity,
                  status: "Live",
                  color: "green"
                },
                // Future Features
                {
                  title: "Cross-Chain Integration",
                  description: "Multi-blockchain compatibility (6 chains)",
                  icon: Globe,
                  status: "Planned",
                  color: "blue"
                },
                {
                  title: "Metaverse Integration",
                  description: "Virtual world communication protocol",
                  icon: Star,
                  status: "Planned",
                  color: "blue"
                }
              ].map((feature, index) => (
                <Card key={index} className="glassmorphism">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        feature.color === 'green' ? 'bg-green-500/20' :
                        feature.color === 'blue' ? 'bg-blue-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        <feature.icon className={`w-5 h-5 ${
                          feature.color === 'green' ? 'text-green-400' :
                          feature.color === 'blue' ? 'text-blue-400' :
                          'text-purple-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {feature.description}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            feature.color === 'green' ? 'border-green-500 text-green-400' :
                            feature.color === 'blue' ? 'border-blue-500 text-blue-400' :
                            'border-purple-500 text-purple-400'
                          }`}
                        >
                          {feature.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Programs Tab - Referrals & Free Codes */}
          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Referral Program */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Referral Program
                  </CardTitle>
                  <CardDescription>
                    Earn FLBY tokens by inviting friends to the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border border-blue-500/20 bg-blue-500/5 rounded-lg">
                      <Trophy className="w-5 h-5 text-blue-400" />
                      <div>
                        <h4 className="font-medium">Bronze Tier</h4>
                        <p className="text-sm text-muted-foreground">50 FLBY per referral</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-green-500/20 bg-green-500/5 rounded-lg">
                      <Trophy className="w-5 h-5 text-green-400" />
                      <div>
                        <h4 className="font-medium">Silver Tier</h4>
                        <p className="text-sm text-muted-foreground">100 FLBY per referral</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <div>
                        <h4 className="font-medium">Gold Tier</h4>
                        <p className="text-sm text-muted-foreground">150 FLBY per referral</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-purple-500/20 bg-purple-500/5 rounded-lg">
                      <Trophy className="w-5 h-5 text-purple-400" />
                      <div>
                        <h4 className="font-medium">Platinum Tier</h4>
                        <p className="text-sm text-muted-foreground">250 FLBY per referral</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Get Referral Link
                  </Button>
                </CardContent>
              </Card>

              {/* Free Codes */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    Free Token Codes
                  </CardTitle>
                  <CardDescription>
                    Redeem promotional codes for free tokens and rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 border border-green-500/20 bg-green-500/5 rounded-lg">
                      <h4 className="font-medium text-green-400 mb-2">Welcome Bonus</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get 100 free tokens when you create your first token
                      </p>
                      <Badge className="bg-green-600">Auto-Applied</Badge>
                    </div>
                    <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg">
                      <h4 className="font-medium text-blue-400 mb-2">Community Rewards</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Special event codes shared in our community channels
                      </p>
                      <Badge variant="outline" className="border-blue-500 text-blue-400">
                        Event-Based
                      </Badge>
                    </div>
                    <div className="p-4 border border-purple-500/20 bg-purple-500/5 rounded-lg">
                      <h4 className="font-medium text-purple-400 mb-2">Partnership Codes</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Exclusive codes from our ecosystem partners
                      </p>
                      <Badge variant="outline" className="border-purple-500 text-purple-400">
                        Partner-Only
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter code..." 
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
                    />
                    <Button>Redeem</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Explore Tab - Full Functionality */}
          <TabsContent value="explore" className="space-y-6">
            {/* Search and Filter Controls */}
            <Card className="bg-slate-800/40 border border-electric-blue/30 electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-electric-blue/10 border border-electric-blue/20">
                    <Search className="w-5 h-5 text-electric-blue" />
                  </div>
                  Explore & Discover Tokens
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Browse community tokens, trending content, and valuable message tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search tokens by message content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-700/50 border-electric-blue/30 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={valueFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setValueFilter('all')}
                      size="sm"
                    >
                      All
                    </Button>
                    <Button
                      variant={valueFilter === 'with-value' ? 'default' : 'outline'}
                      onClick={() => setValueFilter('with-value')}
                      size="sm"
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      With Value
                    </Button>
                    <Button
                      variant={valueFilter === 'no-value' ? 'default' : 'outline'}
                      onClick={() => setValueFilter('no-value')}
                      size="sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Messages
                    </Button>
                  </div>
                </div>

                {/* Stats Overview */}
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-slate-700/30 border border-electric-blue/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-electric-blue">{stats.totalTokens}</div>
                        <div className="text-sm text-gray-400">Total Tokens</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-700/30 border border-electric-green/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-electric-green">{stats.totalValueEscrowed}</div>
                        <div className="text-sm text-gray-400">Value Escrowed</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-700/30 border border-purple-400/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-400">{stats.totalRedemptions}</div>
                        <div className="text-sm text-gray-400">Redemptions</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-700/30 border border-yellow-400/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-400">{stats.activeUsers}</div>
                        <div className="text-sm text-gray-400">Active Users</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Token Discovery Tabs */}
            <Tabs defaultValue="public" className="space-y-4">
              <div className="flex justify-center">
                <TabsList className="bg-slate-800/50 border border-electric-blue/20">
                  <TabsTrigger value="public">Public Tokens</TabsTrigger>
                  <TabsTrigger value="valued">Tokens with Value</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                </TabsList>
              </div>

              {/* Public Tokens */}
              <TabsContent value="public">
                <Card className="bg-slate-800/40 border border-electric-blue/30 electric-frame">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Globe className="w-5 h-5 text-electric-blue" />
                      Public Token Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tokensLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="bg-slate-700/30 rounded-lg p-4 animate-pulse">
                            <div className="h-4 bg-slate-600 rounded mb-2"></div>
                            <div className="h-3 bg-slate-600 rounded w-3/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredPublicTokens.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPublicTokens.map((token) => (
                          <Card key={token.id} className="bg-slate-700/50 border border-electric-blue/20 hover:border-electric-blue/40 transition-all duration-300">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <p className="font-medium text-white mb-1">{token.message}</p>
                                  <p className="text-sm text-gray-400">{token.symbol}</p>
                                </div>
                                {token.imageUrl && (
                                  <img src={token.imageUrl} alt="" className="w-10 h-10 rounded-lg" />
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                {getStatusBadge(token)}
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Share2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Search className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No tokens found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tokens with Value */}
              <TabsContent value="valued">
                <Card className="bg-slate-800/40 border border-electric-green/30 electric-frame">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <DollarSign className="w-5 h-5 text-electric-green" />
                      Tokens with Attached Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {valueTokensLoading ? (
                      <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-slate-700/30 rounded-lg p-4 animate-pulse">
                            <div className="h-4 bg-slate-600 rounded mb-2"></div>
                            <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredValueTokens.length > 0 ? (
                      <div className="space-y-4">
                        {filteredValueTokens.map((token) => (
                          <Card key={token.id} className="bg-slate-700/50 border border-electric-green/20 hover:border-electric-green/40 transition-all duration-300">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-white mb-1">{token.message}</p>
                                  <p className="text-sm text-gray-400">{token.symbol} • Created {new Date(token.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {getStatusBadge(token)}
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="ghost">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    {token.escrowStatus === 'escrowed' && (
                                      <Button size="sm" className="bg-electric-green hover:bg-electric-green/80">
                                        Redeem
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <DollarSign className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No value tokens found</h3>
                        <p className="text-gray-400">Check back later for tokens with attached value</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trending */}
              <TabsContent value="trending">
                <Card className="bg-slate-800/40 border border-purple-400/30 electric-frame">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      Trending Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <TrendingUp className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">Trending Analysis</h3>
                      <p className="text-gray-400 mb-6">Discover the most popular and viral tokens on the platform</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        <div className="border border-purple-400/20 bg-purple-400/5 rounded-lg p-4">
                          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                          <h4 className="font-medium text-purple-400 mb-2">Most Viewed</h4>
                          <p className="text-sm text-gray-400">Tokens with highest engagement</p>
                        </div>
                        <div className="border border-electric-blue/20 bg-electric-blue/5 rounded-lg p-4">
                          <Rocket className="w-8 h-8 mx-auto mb-2 text-electric-blue" />
                          <h4 className="font-medium text-electric-blue mb-2">Viral Growth</h4>
                          <p className="text-sm text-gray-400">Fastest spreading messages</p>
                        </div>
                        <div className="border border-electric-green/20 bg-electric-green/5 rounded-lg p-4">
                          <Trophy className="w-8 h-8 mx-auto mb-2 text-electric-green" />
                          <h4 className="font-medium text-electric-green mb-2">High Value</h4>
                          <p className="text-sm text-gray-400">Most valuable redemptions</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}