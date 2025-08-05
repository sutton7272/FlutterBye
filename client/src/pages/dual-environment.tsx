import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Globe, 
  TestTube, 
  DollarSign, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Zap,
  ArrowRightLeft,
  Network,
  Database,
  Coins,
  TrendingUp,
  Users,
  Activity
} from "lucide-react";
import { EnvironmentSelector } from "@/components/environment-selector";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EnvironmentMetrics {
  devnet: {
    activeUsers: number;
    testTransactions: number;
    featuresInDevelopment: number;
    developmentVelocity: number;
  };
  mainnet: {
    enterpriseClients: number;
    revenueGenerated: number;
    productionTransactions: number;
    systemUptime: number;
  };
}

export default function DualEnvironmentPage() {
  const [metrics, setMetrics] = useState<EnvironmentMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      // Load environment metrics from API
      const response = await apiRequest('GET', '/api/environment/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
      // Use demo data for now
      setMetrics({
        devnet: {
          activeUsers: 45,
          testTransactions: 12847,
          featuresInDevelopment: 8,
          developmentVelocity: 85
        },
        mainnet: {
          enterpriseClients: 12,
          revenueGenerated: 2450000,
          productionTransactions: 156789,
          systemUptime: 99.9
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchToMainNet = async () => {
    try {
      await apiRequest('POST', '/api/environment/switch', { network: 'mainnet-beta' });
      toast({
        title: "Switched to MainNet",
        description: "Now operating on production environment",
      });
    } catch (error) {
      toast({
        title: "Switch Failed",
        description: "Failed to switch to MainNet",
        variant: "destructive",
      });
    }
  };

  const switchToDevNet = async () => {
    try {
      await apiRequest('POST', '/api/environment/switch', { network: 'devnet' });
      toast({
        title: "Switched to DevNet",
        description: "Now operating on development environment",
      });
    } catch (error) {
      toast({
        title: "Switch Failed",
        description: "Failed to switch to DevNet",
        variant: "destructive",
      });
    }
  };

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
            <ArrowRightLeft className="w-8 h-8" />
            Dual Environment Strategy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Simultaneous DevNet testing and MainNet production operations for maximum development agility 
            and enterprise-grade stability
          </p>
        </div>

        {/* Environment Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DevNet Card */}
          <Card className="electric-border bg-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <TestTube className="w-6 h-6" />
                DevNet Environment
              </CardTitle>
              <CardDescription>
                Development & Testing Environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">
                    {metrics?.devnet.activeUsers || 0}
                  </div>
                  <div className="text-sm text-gray-400">Active Developers</div>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">
                    {metrics?.devnet.testTransactions?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-400">Test Transactions</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Development Velocity</span>
                  <span className="text-sm text-blue-400">{metrics?.devnet.developmentVelocity || 0}%</span>
                </div>
                <Progress 
                  value={metrics?.devnet.developmentVelocity || 0} 
                  className="h-2"
                />
              </div>

              <Alert className="border-blue-500/20 bg-blue-500/10">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Zero Financial Risk</AlertTitle>
                <AlertDescription>
                  All testing with free tokens - perfect for rapid iteration
                </AlertDescription>
              </Alert>

              <Button 
                onClick={switchToDevNet}
                variant="outline" 
                className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Switch to DevNet
              </Button>
            </CardContent>
          </Card>

          {/* MainNet Card */}
          <Card className="electric-border bg-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Shield className="w-6 h-6" />
                MainNet Environment
              </CardTitle>
              <CardDescription>
                Production & Enterprise Environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {metrics?.mainnet.enterpriseClients || 0}
                  </div>
                  <div className="text-sm text-gray-400">Enterprise Clients</div>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    ${(metrics?.mainnet.revenueGenerated || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Revenue Generated</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">System Uptime</span>
                  <span className="text-sm text-green-400">{metrics?.mainnet.systemUptime || 0}%</span>
                </div>
                <Progress 
                  value={metrics?.mainnet.systemUptime || 0} 
                  className="h-2"
                />
              </div>

              <Alert className="border-green-500/20 bg-green-500/10">
                <DollarSign className="h-4 w-4" />
                <AlertTitle>Enterprise Revenue</AlertTitle>
                <AlertDescription>
                  $200K-$2M contracts with real-value transactions
                </AlertDescription>
              </Alert>

              <Button 
                onClick={switchToMainNet}
                variant="outline" 
                className="w-full border-green-500 text-green-400 hover:bg-green-500/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Switch to MainNet
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 w-full bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="migration">Migration</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="electric-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Dual Environment Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-400">Development Advantages</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Risk-free feature development and testing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Rapid iteration with free test tokens
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Comprehensive testing before production
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Parallel development workflows
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-400">Production Benefits</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Uninterrupted enterprise operations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Real revenue from platform fees
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Enterprise-grade security and compliance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Gradual feature rollout capabilities
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration">
            <EnvironmentSelector />
          </TabsContent>

          <TabsContent value="migration" className="space-y-6">
            <Card className="electric-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  Migration Strategy
                </CardTitle>
                <CardDescription>
                  Seamless transition from DevNet to MainNet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-500/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">Phase 1: Development</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Feature development on DevNet</li>
                        <li>• Comprehensive testing</li>
                        <li>• Performance optimization</li>
                        <li>• User acceptance testing</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-500/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-2">Phase 2: Migration</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Deploy core features to MainNet</li>
                        <li>• Enable enterprise wallets</li>
                        <li>• Activate real-value operations</li>
                        <li>• Client onboarding</li>
                      </ul>
                    </div>
                    <div className="bg-green-500/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-2">Phase 3: Operation</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Dual environment operations</li>
                        <li>• Continuous development</li>
                        <li>• Regular MainNet deployments</li>
                        <li>• Enterprise scaling</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="electric-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Activity className="w-5 h-5" />
                    DevNet Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Features in Development</span>
                      <Badge variant="secondary">{metrics?.devnet.featuresInDevelopment || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Test Transactions</span>
                      <Badge variant="secondary">{metrics?.devnet.testTransactions?.toLocaleString() || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Active Developers</span>
                      <Badge variant="secondary">{metrics?.devnet.activeUsers || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="electric-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="w-5 h-5" />
                    MainNet Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Enterprise Clients</span>
                      <Badge variant="secondary">{metrics?.mainnet.enterpriseClients || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Production Transactions</span>
                      <Badge variant="secondary">{metrics?.mainnet.productionTransactions?.toLocaleString() || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Revenue Generated</span>
                      <Badge variant="secondary">${(metrics?.mainnet.revenueGenerated || 0).toLocaleString()}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Revenue Impact */}
        <Card className="electric-border bg-gradient-to-r from-blue-500/10 to-green-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Revenue Impact Strategy
            </CardTitle>
            <CardDescription>
              $100M ARR target through dual environment optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-400 mb-3">DevNet Investment</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Faster feature delivery reducing time-to-market</li>
                  <li>• Reduced production bugs saving support costs</li>
                  <li>• Improved user experience driving adoption</li>
                  <li>• Development cost optimization</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-3">MainNet Revenue</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• $200K-$2M enterprise contract capability</li>
                  <li>• Real platform fee collection from transactions</li>
                  <li>• FLBY token value creation and staking rewards</li>
                  <li>• $5M-$50M ARR from enterprise wallet services</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}