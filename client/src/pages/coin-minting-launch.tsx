import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Coins,
  Rocket,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  Users,
  Zap,
  Star,
  Globe,
  Smartphone,
  Shield,
  BarChart3,
  Calendar,
  Award,
  Sparkles
} from "lucide-react";

interface LaunchMetrics {
  readiness: number;
  estimatedRevenue: number;
  targetUsers: number;
  marketCapture: number;
  timeToLaunch: number;
}

export default function CoinMintingLaunchPage() {
  const [metrics, setMetrics] = useState<LaunchMetrics | null>(null);
  const [activePhase, setActivePhase] = useState('planning');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize launch metrics
    setMetrics({
      readiness: 95,
      estimatedRevenue: 50000,
      targetUsers: 10000,
      marketCapture: 15,
      timeToLaunch: 21 // days
    });
    setIsLoading(false);
  }, []);

  const launchPhases = [
    {
      id: 'planning',
      name: 'Strategic Planning',
      duration: '1 week',
      status: 'completed',
      progress: 100,
      tasks: [
        'Market analysis and positioning',
        'Revenue model definition', 
        'Technical readiness assessment',
        'Launch timeline creation'
      ]
    },
    {
      id: 'development',
      name: 'Platform Optimization',
      duration: '1 week',
      status: 'in-progress',
      progress: 75,
      tasks: [
        'Enhanced token creation UI/UX',
        'Payment processing integration',
        'MainNet deployment preparation',
        'Mobile optimization'
      ]
    },
    {
      id: 'testing',
      name: 'Beta Testing',
      duration: '1 week',
      status: 'pending',
      progress: 0,
      tasks: [
        'Community beta testing program',
        'Feedback collection and analysis',
        'Performance optimization',
        'Security audit completion'
      ]
    },
    {
      id: 'launch',
      name: 'Public Launch',
      duration: 'Ongoing',
      status: 'pending',
      progress: 0,
      tasks: [
        'Marketing campaign activation',
        'Community engagement',
        'Performance monitoring',
        'Rapid iteration based on feedback'
      ]
    }
  ];

  const revenueProjections = [
    { month: 'Month 1', tokens: 1000, revenue: 3000, users: 500 },
    { month: 'Month 3', tokens: 10000, revenue: 30000, users: 2500 },
    { month: 'Month 6', tokens: 50000, revenue: 150000, users: 10000 },
    { month: 'Month 12', tokens: 200000, revenue: 600000, users: 25000 }
  ];

  const coreFeatures = [
    {
      name: "60-Second Token Creation",
      description: "Fastest token deployment on Solana",
      status: "ready",
      priority: "high",
      icon: Zap
    },
    {
      name: "Visual Token Designer",
      description: "Drag-and-drop interface, no coding required",
      status: "ready", 
      priority: "high",
      icon: Sparkles
    },
    {
      name: "Mobile-First Experience",
      description: "Perfect mobile token creation",
      status: "ready",
      priority: "high", 
      icon: Smartphone
    },
    {
      name: "DevNet Testing",
      description: "Risk-free token creation and testing",
      status: "ready",
      priority: "medium",
      icon: Shield
    },
    {
      name: "Instant Deployment",
      description: "Real-time blockchain deployment",
      status: "ready",
      priority: "high",
      icon: Rocket
    },
    {
      name: "Analytics Dashboard",
      description: "Token performance tracking",
      status: "development",
      priority: "medium",
      icon: BarChart3
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold electric-text flex items-center justify-center gap-3">
            <Coins className="w-8 h-8" />
            Coin Minting Launch Strategy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Strategic focus on coin creation as the premier entry point to the Solana ecosystem
          </p>
          <div className="flex items-center justify-center gap-6">
            <Badge className="bg-green-500/10 text-green-400 border-green-500">
              Ready for Launch
            </Badge>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500">
              21 Days to Market
            </Badge>
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500">
              $50K+ Monthly Target
            </Badge>
          </div>
        </div>

        {/* Launch Overview */}
        <Card className="electric-border bg-gradient-to-r from-green-500/10 to-blue-500/10">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="w-6 h-6" />
              "The Coinbase of Token Creation"
            </CardTitle>
            <CardDescription>
              Position Flutterbye as the premier token creation platform for the Solana ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-500/10 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-400">95%</div>
                <div className="text-sm text-gray-400">Platform Readiness</div>
              </div>
              <div className="bg-blue-500/10 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">60 sec</div>
                <div className="text-sm text-gray-400">Token Creation Time</div>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">15%</div>
                <div className="text-sm text-gray-400">Target Market Share</div>
              </div>
              <div className="bg-yellow-500/10 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">$600K</div>
                <div className="text-sm text-gray-400">Year 1 Revenue Target</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Interface */}
        <Tabs defaultValue="strategy" className="w-full">
          <TabsList className="grid grid-cols-5 w-full bg-gray-800">
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
          </TabsList>

          <TabsContent value="strategy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="electric-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Rocket className="w-5 h-5" />
                    Core Value Proposition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">
                        "Create Your Token in 60 Seconds"
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Instant SPL token creation on Solana</li>
                        <li>• No coding required - visual designer</li>
                        <li>• Professional-grade security</li>
                        <li>• Mobile-first experience</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="electric-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Target className="w-5 h-5" />
                    Competitive Advantage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Creation Speed</span>
                      <span className="text-green-400 font-semibold">60s vs 30+ min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">User Experience</span>
                      <span className="text-green-400 font-semibold">Visual vs CLI</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Mobile Support</span>
                      <span className="text-green-400 font-semibold">Native vs None</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Target Market</span>
                      <span className="text-green-400 font-semibold">Creators vs Devs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert className="border-blue-500/20 bg-blue-500/10">
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Strategic Focus</AlertTitle>
              <AlertDescription>
                By focusing exclusively on coin minting, we can dominate this specific use case and 
                establish Flutterbye as the go-to platform before expanding to enterprise features.
                This focused approach enables faster time-to-market and clearer value proposition.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className="electric-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <feature.icon className="w-4 h-4" />
                      {feature.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400 mb-3">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={feature.status === 'ready' ? 'default' : 'secondary'}
                        className={feature.status === 'ready' ? 'bg-green-500/20 text-green-400' : ''}
                      >
                        {feature.status === 'ready' ? 'Ready' : 'In Development'}
                      </Badge>
                      <Badge variant={feature.priority === 'high' ? 'destructive' : 'secondary'}>
                        {feature.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <div className="space-y-6">
              {launchPhases.map((phase, index) => (
                <Card key={index} className="electric-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {phase.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{phase.duration}</Badge>
                        <Badge 
                          variant={
                            phase.status === 'completed' ? 'default' : 
                            phase.status === 'in-progress' ? 'secondary' : 'outline'
                          }
                          className={
                            phase.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            phase.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' : ''
                          }
                        >
                          {phase.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {phase.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center gap-2">
                          {phase.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : phase.status === 'in-progress' ? (
                            <Clock className="w-4 h-4 text-blue-400" />
                          ) : (
                            <div className="w-4 h-4 border border-gray-500 rounded-full" />
                          )}
                          <span className="text-sm text-gray-300">{task}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card className="electric-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Revenue Projections
                </CardTitle>
                <CardDescription>
                  Conservative estimates based on Solana token creation market analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {revenueProjections.map((projection, index) => (
                    <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-blue-400">{projection.month}</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tokens:</span>
                          <span className="text-white">{projection.tokens.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Revenue:</span>
                          <span className="text-green-400">${projection.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Users:</span>
                          <span className="text-blue-400">{projection.users.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="electric-border">
                <CardHeader>
                  <CardTitle className="text-sm">Basic Token Creation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400 mb-2">0.01 SOL</div>
                  <div className="text-sm text-gray-400 mb-3">~$2-3 per token</div>
                  <ul className="space-y-1 text-xs text-gray-300">
                    <li>• Standard SPL token</li>
                    <li>• Basic metadata</li>
                    <li>• Up to 1M supply</li>
                    <li>• Logo upload</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="electric-border">
                <CardHeader>
                  <CardTitle className="text-sm">Premium Creation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400 mb-2">0.05 SOL</div>
                  <div className="text-sm text-gray-400 mb-3">~$10-15 per token</div>
                  <ul className="space-y-1 text-xs text-gray-300">
                    <li>• Enhanced metadata</li>
                    <li>• Up to 1B supply</li>
                    <li>• Social links</li>
                    <li>• Priority deployment</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="electric-border">
                <CardHeader>
                  <CardTitle className="text-sm">Creator Pro Package</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400 mb-2">0.2 SOL</div>
                  <div className="text-sm text-gray-400 mb-3">~$40-60 monthly</div>
                  <ul className="space-y-1 text-xs text-gray-300">
                    <li>• Unlimited creation</li>
                    <li>• Advanced analytics</li>
                    <li>• API access</li>
                    <li>• White-label options</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="electric-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <Users className="w-5 h-5" />
                    Target Audience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-yellow-500/10 p-3 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-2">Crypto Creators & Influencers</h4>
                      <p className="text-sm text-gray-300">Content creators, gaming communities, social media influencers</p>
                    </div>
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-2">Small Businesses & Startups</h4>
                      <p className="text-sm text-gray-300">Local businesses, e-commerce platforms, loyalty programs</p>
                    </div>
                    <div className="bg-blue-500/10 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">Developers & Builders</h4>
                      <p className="text-sm text-gray-300">dApp developers, Web3 builders, educational institutions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="electric-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Globe className="w-5 h-5" />
                    Market Opportunity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Daily Solana Token Creations</span>
                      <span className="text-white font-semibold">500-1,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Target Market Capture</span>
                      <span className="text-green-400 font-semibold">10-20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Monthly Addressable Market</span>
                      <span className="text-blue-400 font-semibold">15,000-30,000 tokens</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Year 1 Revenue Potential</span>
                      <span className="text-purple-400 font-semibold">$400K-600K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert className="border-green-500/20 bg-green-500/10">
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>Market Timing</AlertTitle>
              <AlertDescription>
                The Solana ecosystem is experiencing rapid growth with increasing token creation demand. 
                Current tools are developer-focused, creating a perfect opportunity for a creator-friendly platform.
                First-mover advantage in the consumer token creation space.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            className="h-16 electric-border bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500"
            onClick={() => window.location.href = '/create'}
          >
            <Coins className="w-5 h-5 mr-2" />
            Start Token Creation
          </Button>
          <Button 
            className="h-16 electric-border bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500"
            onClick={() => window.location.href = '/production-deployment'}
          >
            <Rocket className="w-5 h-5 mr-2" />
            Deploy to Production
          </Button>
          <Button 
            className="h-16 electric-border bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500"
            onClick={() => window.location.href = '/enterprise-sales'}
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Launch Sales Pipeline
          </Button>
        </div>
      </div>
    </div>
  );
}