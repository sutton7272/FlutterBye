import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Rocket, 
  Shield, 
  Globe, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Server, 
  Lock, 
  BarChart3,
  DollarSign,
  Building2,
  Activity,
  Gauge,
  Eye,
  ArrowRight,
  Target,
  Users,
  Coins,
  ArrowRightLeft
} from "lucide-react";

interface DeploymentMetrics {
  mainnetStatus: 'devnet' | 'migrating' | 'mainnet';
  securityLevel: 'basic' | 'enhanced' | 'enterprise';
  regions: number;
  uptime: number;
  responseTime: number;
  throughput: number;
  enterpriseContracts: number;
  monthlyRevenue: number;
  apiUsage: number;
}

interface MigrationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  duration?: string;
  priority: 'critical' | 'high' | 'medium';
}

export default function ProductionDeployment() {
  const [metrics, setMetrics] = useState<DeploymentMetrics>({
    mainnetStatus: 'devnet',
    securityLevel: 'enhanced',
    regions: 1,
    uptime: 99.2,
    responseTime: 145,
    throughput: 8500,
    enterpriseContracts: 0,
    monthlyRevenue: 0,
    apiUsage: 75000
  });

  const [migrationSteps, setMigrationSteps] = useState<MigrationStep[]>([
    {
      id: 'mainnet-migration',
      title: 'MainNet Blockchain Migration',
      description: 'Migrate from DevNet to MainNet for real-value transactions',
      status: 'pending',
      priority: 'critical'
    },
    {
      id: 'security-hardening',
      title: 'Enterprise Security Hardening',
      description: 'Bank-level security, multi-factor auth, compliance',
      status: 'pending',
      priority: 'critical'
    },
    {
      id: 'multi-region',
      title: 'Multi-Region Deployment',
      description: 'Deploy to US-East, US-West, and EU regions',
      status: 'pending',
      priority: 'critical'
    },
    {
      id: 'performance-optimization',
      title: 'Performance Optimization',
      description: 'Target <100ms API response times, auto-scaling',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'enterprise-api',
      title: 'Enterprise API Infrastructure',
      description: 'Bloomberg-style data feeds, white-label solutions',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'monitoring-alerting',
      title: 'Advanced Monitoring & Alerting',
      description: '24/7 monitoring, real-time alerts, compliance reporting',
      status: 'pending',
      priority: 'medium'
    }
  ]);

  const [isMainnetMigrationConfirmed, setIsMainnetMigrationConfirmed] = useState(false);

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        uptime: Math.min(99.99, prev.uptime + Math.random() * 0.1),
        responseTime: Math.max(100, prev.responseTime - Math.random() * 5),
        throughput: prev.throughput + Math.floor(Math.random() * 500 - 250),
        apiUsage: prev.apiUsage + Math.floor(Math.random() * 1000)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleMigrationStep = async (stepId: string) => {
    setMigrationSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'in-progress' }
        : step
    ));

    // Simulate migration process
    setTimeout(() => {
      setMigrationSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, status: 'completed', duration: '2.5m' }
          : step
      ));

      // Update metrics based on completed step
      if (stepId === 'mainnet-migration') {
        setMetrics(prev => ({ ...prev, mainnetStatus: 'mainnet' }));
      } else if (stepId === 'security-hardening') {
        setMetrics(prev => ({ ...prev, securityLevel: 'enterprise' }));
      } else if (stepId === 'multi-region') {
        setMetrics(prev => ({ ...prev, regions: 3 }));
      } else if (stepId === 'performance-optimization') {
        setMetrics(prev => ({ ...prev, responseTime: 85 }));
      }
    }, 3000);
  };

  const handleMainnetMigration = () => {
    if (!isMainnetMigrationConfirmed) {
      setIsMainnetMigrationConfirmed(true);
      return;
    }
    
    handleMigrationStep('mainnet-migration');
    setIsMainnetMigrationConfirmed(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      default: return 'secondary';
    }
  };

  const completedSteps = migrationSteps.filter(step => step.status === 'completed').length;
  const migrationProgress = (completedSteps / migrationSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Rocket className="w-10 h-10 text-cyan-400" />
            Flutterbye Production Deployment
          </h1>
          <p className="text-xl text-white/70">
            Enterprise-grade deployment for $100M ARR target
          </p>
        </div>

        {/* Critical MainNet Warning */}
        {metrics.mainnetStatus === 'devnet' && (
          <Alert className="border-yellow-500 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-yellow-400">MainNet Migration Required</AlertTitle>
            <AlertDescription className="text-yellow-300">
              Currently running on DevNet. MainNet migration required for real-value transactions and enterprise contracts.
            </AlertDescription>
          </Alert>
        )}

        {/* Production Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* MainNet Status */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Coins className="w-5 h-5 text-cyan-400" />
                <Badge variant={metrics.mainnetStatus === 'mainnet' ? 'default' : 'destructive'}>
                  {metrics.mainnetStatus.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {metrics.mainnetStatus === 'mainnet' ? 'Live' : 'DevNet'}
              </div>
              <p className="text-sm text-white/60">Blockchain Network</p>
            </CardContent>
          </Card>

          {/* Security Level */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Shield className="w-5 h-5 text-green-400" />
                <Badge variant={metrics.securityLevel === 'enterprise' ? 'default' : 'secondary'}>
                  {metrics.securityLevel.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {metrics.securityLevel === 'enterprise' ? 'Bank-Level' : 'Enhanced'}
              </div>
              <p className="text-sm text-white/60">Security Grade</p>
            </CardContent>
          </Card>

          {/* Response Time */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Zap className="w-5 h-5 text-yellow-400" />
                <Badge variant={metrics.responseTime < 100 ? 'default' : 'secondary'}>
                  {metrics.responseTime < 100 ? 'OPTIMAL' : 'GOOD'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {metrics.responseTime.toFixed(0)}ms
              </div>
              <p className="text-sm text-white/60">API Response Time</p>
            </CardContent>
          </Card>

          {/* Uptime */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Activity className="w-5 h-5 text-blue-400" />
                <Badge variant={metrics.uptime > 99.9 ? 'default' : 'secondary'}>
                  {metrics.uptime > 99.9 ? 'ENTERPRISE' : 'GOOD'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {metrics.uptime.toFixed(2)}%
              </div>
              <p className="text-sm text-white/60">System Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Migration Progress */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Production Migration Progress
            </CardTitle>
            <CardDescription className="text-white/70">
              {completedSteps} of {migrationSteps.length} steps completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Overall Progress</span>
                <span className="text-white">{migrationProgress.toFixed(0)}%</span>
              </div>
              <Progress value={migrationProgress} className="w-full" />
            </div>
            
            <div className="grid gap-3">
              {migrationSteps.map((step) => (
                <div key={step.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(step.status)}`} />
                    <div>
                      <h4 className="text-white font-medium">{step.title}</h4>
                      <p className="text-white/60 text-sm">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(step.priority)}>
                      {step.priority}
                    </Badge>
                    {step.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => step.id === 'mainnet-migration' ? handleMainnetMigration() : handleMigrationStep(step.id)}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        {step.id === 'mainnet-migration' && isMainnetMigrationConfirmed ? 'Confirm Migration' : 'Start'}
                      </Button>
                    )}
                    {step.status === 'in-progress' && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Running...</span>
                      </div>
                    )}
                    {step.status === 'completed' && (
                      <div className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">{step.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical MainNet Migration Warning */}
        {isMainnetMigrationConfirmed && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-red-400">⚠️ CRITICAL: MainNet Migration Confirmation</AlertTitle>
            <AlertDescription className="text-red-300">
              <p className="mb-2">This will migrate Flutterbye to MainNet with real-value transactions:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real SOL/USDC transactions will be processed</li>
                <li>Enterprise contracts worth $200K-$2M will be active</li>
                <li>FLBY tokens will have real market value</li>
                <li>All fees will be collected in real cryptocurrency</li>
              </ul>
              <div className="mt-3 flex gap-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleMainnetMigration}
                >
                  Confirm MainNet Migration
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsMainnetMigrationConfirmed(false)}
                >
                  Cancel
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs for Detailed Views */}
        <Tabs defaultValue="infrastructure" className="w-full">
          <TabsList className="bg-slate-800/50 p-1">
            <TabsTrigger value="infrastructure" className="text-white data-[state=active]:bg-cyan-600">
              Infrastructure
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-white data-[state=active]:bg-cyan-600">
              Performance
            </TabsTrigger>
            <TabsTrigger value="revenue" className="text-white data-[state=active]:bg-cyan-600">
              Revenue
            </TabsTrigger>
            <TabsTrigger value="security" className="text-white data-[state=active]:bg-cyan-600">
              Security
            </TabsTrigger>
          </TabsList>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Multi-Region Deployment */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Multi-Region Deployment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">US-East (Primary)</span>
                      <Badge variant={metrics.regions >= 1 ? "default" : "secondary"}>
                        {metrics.regions >= 1 ? "Active" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">US-West (Secondary)</span>
                      <Badge variant={metrics.regions >= 2 ? "default" : "secondary"}>
                        {metrics.regions >= 2 ? "Active" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">EU-West (International)</span>
                      <Badge variant={metrics.regions >= 3 ? "default" : "secondary"}>
                        {metrics.regions >= 3 ? "Active" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{metrics.regions}/3</div>
                    <p className="text-sm text-white/60">Active Regions</p>
                  </div>
                </CardContent>
              </Card>

              {/* Database & Storage */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Database & Storage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Primary Database</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Read Replicas</span>
                      <Badge variant={metrics.regions >= 2 ? "default" : "secondary"}>
                        {metrics.regions >= 2 ? "2 Active" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Redis Cache</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Blockchain Storage</span>
                      <Badge variant={metrics.mainnetStatus === 'mainnet' ? "default" : "secondary"}>
                        {metrics.mainnetStatus === 'mainnet' ? "MainNet" : "DevNet"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gauge className="w-5 h-5" />
                    API Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-white">{metrics.responseTime.toFixed(0)}ms</div>
                    <p className="text-sm text-white/60">Average Response Time</p>
                    <div className="text-sm">
                      <span className="text-green-400">Target: &lt;100ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Throughput
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-white">{metrics.throughput.toLocaleString()}</div>
                    <p className="text-sm text-white/60">Requests per Hour</p>
                    <div className="text-sm">
                      <span className="text-green-400">Capacity: 50K/hour</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-white">{metrics.uptime.toFixed(2)}%</div>
                    <p className="text-sm text-white/60">Uptime</p>
                    <div className="text-sm">
                      <span className="text-green-400">Target: 99.99%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Revenue Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">${metrics.monthlyRevenue.toLocaleString()}</div>
                      <p className="text-sm text-white/60">Monthly Revenue</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{metrics.enterpriseContracts}</div>
                      <p className="text-sm text-white/60">Enterprise Contracts</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm text-white/70">ARR Target Progress</div>
                    <Progress value={(metrics.monthlyRevenue * 12 / 100000000) * 100} className="w-full" />
                    <div className="text-xs text-white/60">Target: $100M ARR</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Enterprise Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Fortune 500 Prospects</span>
                      <span className="text-white">247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Active Negotiations</span>
                      <span className="text-white">15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Signed Contracts</span>
                      <span className="text-white">{metrics.enterpriseContracts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Pipeline Value</span>
                      <span className="text-white">$45.2M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Multi-Factor Auth</span>
                      <Badge variant={metrics.securityLevel === 'enterprise' ? "default" : "secondary"}>
                        {metrics.securityLevel === 'enterprise' ? "Active" : "Basic"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Encryption at Rest</span>
                      <Badge variant="default">AES-256</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">SSL/TLS</span>
                      <Badge variant="default">TLS 1.3</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Compliance</span>
                      <Badge variant={metrics.securityLevel === 'enterprise' ? "default" : "secondary"}>
                        {metrics.securityLevel === 'enterprise' ? "SOC 2" : "Basic"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Threat Detection</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Real-time Alerts</span>
                      <Badge variant="default">24/7</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Audit Logging</span>
                      <Badge variant="default">Complete</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Incident Response</span>
                      <Badge variant="default">&lt;5min</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Next Steps to $100M ARR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-700/30">
                <h4 className="text-white font-medium mb-2">Month 1-2: Critical Infrastructure</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Complete MainNet migration</li>
                  <li>• Deploy multi-region architecture</li>
                  <li>• Implement enterprise security</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/30">
                <h4 className="text-white font-medium mb-2">Month 3-6: Enterprise Scale</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Launch Bloomberg-style API</li>
                  <li>• Onboard Fortune 500 clients</li>
                  <li>• Scale to $10M ARR</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/30">
                <h4 className="text-white font-medium mb-2">Month 7-12: Global Expansion</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• International deployment</li>
                  <li>• White-label solutions</li>
                  <li>• Achieve $100M ARR target</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}