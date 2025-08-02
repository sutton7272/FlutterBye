import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Map, Zap, Users, Coins, Trophy, Star, CheckCircle, Clock, AlertCircle, Target, Rocket, FileText, TrendingUp, Shield, Globe, Heart, MessageSquare, DollarSign, Building2 } from "lucide-react";

export default function InfoPage() {
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
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
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
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Features
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
                  {/* Phase 1 - Complete */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="w-0.5 h-16 bg-green-500/30 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-green-400">Phase 1: Core Platform</h3>
                        <Badge className="bg-green-600">Complete</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Foundation tokenized messaging platform with value attachment
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>27-character token creation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Value attachment system</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Multi-currency support</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Dashboard & analytics</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2 - Current */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="w-0.5 h-16 bg-blue-500/30 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-blue-400">Phase 2: FLBY Token Economy</h3>
                        <Badge className="bg-blue-600">Current</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Native token launch with staking, governance, and advanced features
                      </p>
                      <Progress value={75} className="mb-3" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>FLBY token framework</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Staking system</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Governance platform</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>Limited Edition NFTs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3 - Future */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="w-0.5 h-16 bg-purple-500/30 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-purple-400">Phase 3: AI & Cross-Chain</h3>
                        <Badge variant="outline" className="border-purple-500 text-purple-400">Q2 2025</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        AI-powered features and multi-blockchain expansion
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-purple-400" />
                          <span>AI emotion analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-purple-400" />
                          <span>Cross-chain bridges</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-purple-400" />
                          <span>Smart contract automation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-purple-400" />
                          <span>Enterprise integrations</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 4 - Vision */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <Globe className="w-6 h-6 text-orange-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-orange-400">Phase 4: Web3 Protocol</h3>
                        <Badge variant="outline" className="border-orange-500 text-orange-400">2025+</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Universal Web3 communication layer with industry partnerships
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                          <span>Protocol standardization</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                          <span>Industry partnerships</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                          <span>Global adoption</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                          <span>Metaverse integration</span>
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
                  <BookOpen className="w-5 h-5" />
                  Flutterbye Whitepaper
                </CardTitle>
                <CardDescription>
                  Technical documentation and vision overview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-invert max-w-none">
                  <h3>Executive Summary</h3>
                  <p className="text-muted-foreground">
                    Flutterbye represents a paradigm shift in blockchain communication, introducing 
                    tokenized messaging that bridges traditional communication with Web3 value transfer. 
                    Our platform transforms every message into a unique SPL token, enabling unprecedented 
                    integration of communication and economic activity.
                  </p>

                  <h3>Technical Architecture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                    <Card className="border border-slate-700">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Blockchain Layer</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Solana DevNet integration</li>
                          <li>• SPL token standard</li>
                          <li>• Smart contract automation</li>
                          <li>• Cross-chain compatibility</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="border border-slate-700">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Application Layer</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• React/TypeScript frontend</li>
                          <li>• Node.js/Express backend</li>
                          <li>• PostgreSQL database</li>
                          <li>• Real-time WebSocket chat</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <h3>Token Economics</h3>
                  <p className="text-muted-foreground">
                    The FLBY token serves as the native currency for platform operations, providing 
                    fee discounts, governance rights, and staking rewards. Our economic model incentivizes 
                    long-term platform growth while rewarding early adopters and active participants.
                  </p>

                  <div className="flex gap-4">
                    <Button className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Download Full Whitepaper
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Technical Documentation
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
                {
                  title: "Tokenized Messaging",
                  description: "Transform messages into unique SPL tokens",
                  icon: Coins,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Value Attachment",
                  description: "Attach SOL, USDC, or FLBY value to tokens",
                  icon: DollarSign,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Multi-Currency Support",
                  description: "Support for SOL, USDC, and FLBY payments",
                  icon: Coins,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Real-time Chat",
                  description: "Blockchain-powered messaging system",
                  icon: MessageSquare,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Achievement System",
                  description: "Gamified badges and rewards",
                  icon: Trophy,
                  status: "Live",
                  color: "green"
                },
                {
                  title: "Limited Edition NFTs",
                  description: "Exclusive collectible token sets",
                  icon: Star,
                  status: "Coming Soon",
                  color: "blue"
                },
                {
                  title: "AI Emotion Analysis",
                  description: "Smart emotion-based token creation",
                  icon: Heart,
                  status: "Coming Soon",
                  color: "blue"
                },
                {
                  title: "Cross-Chain Support",
                  description: "Multi-blockchain compatibility",
                  icon: Globe,
                  status: "Planned",
                  color: "purple"
                },
                {
                  title: "Enterprise APIs",
                  description: "Business integration tools",
                  icon: Building2,
                  status: "Planned",
                  color: "purple"
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
        </Tabs>
      </div>
    </div>
  );
}