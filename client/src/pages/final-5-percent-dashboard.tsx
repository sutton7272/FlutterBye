import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  CheckCircle,
  AlertTriangle,
  Rocket,
  Shield,
  Activity,
  Database,
  Wifi,
  DollarSign,
  Settings,
  Clock,
  Target,
  TrendingUp,
  Server,
  Lock
} from "lucide-react";

interface Final5PercentStatus {
  overallProgress: number;
  isProductionReady: boolean;
  components: {
    mainnetConfig: number;
    flbyToken: number;
    websocketOptimization: number;
    rateLimiting: number;
    securityAudit: number;
  };
  nextSteps: string[];
}

interface MainNetStatus {
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    requirements: string[];
  };
  checklist: Array<{
    id: string;
    name: string;
    description: string;
    completed: boolean;
    required: boolean;
    action: string;
  }>;
  progress: {
    completed: number;
    total: number;
    percentage: number;
    requiredCompleted: number;
    requiredTotal: number;
  };
}

interface SecurityAudit {
  overallScore: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  isProductionReady: boolean;
  checks: Array<{
    id: string;
    name: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'pass' | 'fail' | 'warning';
    message: string;
    remediation?: string;
  }>;
  recommendations: string[];
}

export default function Final5PercentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: overallStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/final-5-percent/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: mainnetStatus } = useQuery({
    queryKey: ['/api/mainnet/status'],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: securityAudit, refetch: refetchSecurity } = useQuery<SecurityAudit>({
    queryKey: ['/api/security/audit'],
    queryFn: async () => {
      const response = await fetch('/api/security/audit', { method: 'POST' });
      return response.json();
    },
    refetchOnWindowFocus: false
  });

  const { data: rateLimitHealth } = useQuery({
    queryKey: ['/api/rate-limiting/health'],
    refetchInterval: 30000,
  });

  const { data: websocketStatus } = useQuery({
    queryKey: ['/api/websocket/status'],
  });

  const { data: flbyTokenStatus } = useQuery({
    queryKey: ['/api/flby-token/status'],
  });

  if (statusLoading) {
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

  const status = overallStatus as Final5PercentStatus;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold electric-text flex items-center justify-center gap-3">
            <Target className="w-8 h-8" />
            Final 5% Production Readiness
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Critical remaining tasks to achieve 100% production readiness
          </p>
          <div className="flex items-center justify-center gap-6">
            <Badge className={`${
              status?.isProductionReady 
                ? 'bg-green-500/10 text-green-400 border-green-500' 
                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500'
            }`}>
              {status?.isProductionReady ? 'Production Ready' : 'In Progress'}
            </Badge>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500">
              {status?.overallProgress || 0}% Complete
            </Badge>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="electric-border bg-gradient-to-r from-blue-500/10 to-green-500/10">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Overall Progress
            </CardTitle>
            <CardDescription>
              Current status of all production readiness components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total Progress</span>
                <span className="text-2xl font-bold text-blue-400">{status?.overallProgress || 0}%</span>
              </div>
              <Progress value={status?.overallProgress || 0} className="h-4" />
              
              {status?.nextSteps && status.nextSteps.length > 0 && (
                <Alert className="border-yellow-500/20 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Next Steps Required</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {status.nextSteps.map((step, index) => (
                        <li key={index} className="text-sm">{step}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Component Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Server className="w-4 h-4" />
                MainNet Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Progress</span>
                  <span className="font-bold">{status?.components.mainnetConfig || 0}%</span>
                </div>
                <Progress value={status?.components.mainnetConfig || 0} className="h-2" />
                <div className="flex items-center gap-2">
                  {(status?.components.mainnetConfig || 0) >= 100 ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-xs text-gray-400">
                    {(status?.components.mainnetConfig || 0) >= 100 ? 'Complete' : 'In Progress'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4" />
                FLBY Token Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Progress</span>
                  <span className="font-bold">{status?.components.flbyToken || 0}%</span>
                </div>
                <Progress value={status?.components.flbyToken || 0} className="h-2" />
                <div className="flex items-center gap-2">
                  {(status?.components.flbyToken || 0) >= 100 ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-xs text-gray-400">
                    {flbyTokenStatus?.deployed ? 'Deployed' : 'Pending'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wifi className="w-4 h-4" />
                WebSocket Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Progress</span>
                  <span className="font-bold">{status?.components.websocketOptimization || 0}%</span>
                </div>
                <Progress value={status?.components.websocketOptimization || 0} className="h-2" />
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Optimized</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4" />
                Rate Limiting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Progress</span>
                  <span className="font-bold">{status?.components.rateLimiting || 0}%</span>
                </div>
                <Progress value={status?.components.rateLimiting || 0} className="h-2" />
                <div className="flex items-center gap-2">
                  {rateLimitHealth?.status === 'healthy' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-xs text-gray-400">
                    {rateLimitHealth?.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                Security Audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Progress</span>
                  <span className="font-bold">{status?.components.securityAudit || 0}%</span>
                </div>
                <Progress value={status?.components.securityAudit || 0} className="h-2" />
                <div className="flex items-center gap-2">
                  {securityAudit?.isProductionReady ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-xs text-gray-400">
                    {securityAudit?.overallScore || 0}% Score
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mainnet">MainNet</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="electric-border">
              <CardHeader>
                <CardTitle>Production Readiness Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-green-400">Completed Components</h3>
                    <ul className="space-y-2">
                      {status?.components.websocketOptimization >= 100 && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm">WebSocket Optimization</span>
                        </li>
                      )}
                      {status?.components.mainnetConfig >= 100 && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm">MainNet Configuration</span>
                        </li>
                      )}
                      {status?.components.flbyToken >= 100 && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm">FLBY Token Deployment</span>
                        </li>
                      )}
                      {status?.components.rateLimiting >= 100 && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm">Rate Limiting</span>
                        </li>
                      )}
                      {status?.components.securityAudit >= 100 && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm">Security Audit</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-yellow-400">Pending Tasks</h3>
                    <ul className="space-y-2">
                      {status?.components.mainnetConfig < 100 && (
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">MainNet Configuration</span>
                        </li>
                      )}
                      {status?.components.flbyToken < 100 && (
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">FLBY Token Deployment</span>
                        </li>
                      )}
                      {status?.components.rateLimiting < 100 && (
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">Rate Limiting Optimization</span>
                        </li>
                      )}
                      {status?.components.securityAudit < 100 && (
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">Security Audit Completion</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mainnet" className="space-y-6">
            <Card className="electric-border">
              <CardHeader>
                <CardTitle>MainNet Configuration Status</CardTitle>
              </CardHeader>
              <CardContent>
                {mainnetStatus && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-500/10 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {(mainnetStatus as MainNetStatus).progress.percentage}%
                        </div>
                        <div className="text-sm text-gray-400">Configuration Complete</div>
                      </div>
                      <div className="bg-green-500/10 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                          {(mainnetStatus as MainNetStatus).progress.completed}
                        </div>
                        <div className="text-sm text-gray-400">Steps Completed</div>
                      </div>
                      <div className="bg-yellow-500/10 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-400">
                          {(mainnetStatus as MainNetStatus).progress.total - (mainnetStatus as MainNetStatus).progress.completed}
                        </div>
                        <div className="text-sm text-gray-400">Steps Remaining</div>
                      </div>
                    </div>

                    {(mainnetStatus as MainNetStatus).validation.errors.length > 0 && (
                      <Alert className="border-red-500/20 bg-red-500/10">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Configuration Errors</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside space-y-1 mt-2">
                            {(mainnetStatus as MainNetStatus).validation.errors.map((error, index) => (
                              <li key={index} className="text-sm">{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="electric-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Security Audit Results</CardTitle>
                  <Button 
                    onClick={() => refetchSecurity()}
                    size="sm"
                    className="bg-blue-500/20 hover:bg-blue-500/30"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Run Audit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {securityAudit && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-red-500/10 p-3 rounded-lg">
                        <div className="text-xl font-bold text-red-400">{securityAudit.criticalIssues}</div>
                        <div className="text-xs text-gray-400">Critical</div>
                      </div>
                      <div className="bg-orange-500/10 p-3 rounded-lg">
                        <div className="text-xl font-bold text-orange-400">{securityAudit.highIssues}</div>
                        <div className="text-xs text-gray-400">High</div>
                      </div>
                      <div className="bg-yellow-500/10 p-3 rounded-lg">
                        <div className="text-xl font-bold text-yellow-400">{securityAudit.mediumIssues}</div>
                        <div className="text-xs text-gray-400">Medium</div>
                      </div>
                      <div className="bg-blue-500/10 p-3 rounded-lg">
                        <div className="text-xl font-bold text-blue-400">{securityAudit.lowIssues}</div>
                        <div className="text-xs text-gray-400">Low</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold">Security Checks</h3>
                      {securityAudit.checks.slice(0, 5).map((check, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {check.status === 'pass' ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : check.status === 'warning' ? (
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                            <div>
                              <div className="font-medium text-sm">{check.name}</div>
                              <div className="text-xs text-gray-400">{check.message}</div>
                            </div>
                          </div>
                          <Badge variant={check.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {check.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="electric-border">
                <CardHeader>
                  <CardTitle>WebSocket Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {websocketStatus && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Status</span>
                        <Badge className="bg-green-500/20 text-green-400">
                          {websocketStatus.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Optimizations</h4>
                        <ul className="space-y-1">
                          {websocketStatus.improvements?.map((improvement: string, index: number) => (
                            <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="electric-border">
                <CardHeader>
                  <CardTitle>Rate Limiting</CardTitle>
                </CardHeader>
                <CardContent>
                  {rateLimitHealth && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Health Status</span>
                        <Badge className={
                          rateLimitHealth.status === 'healthy' 
                            ? 'bg-green-500/20 text-green-400'
                            : rateLimitHealth.status === 'degraded'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }>
                          {rateLimitHealth.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Total Requests</div>
                          <div className="font-bold">{rateLimitHealth.metrics?.totalRequests || 0}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Error Rate</div>
                          <div className="font-bold">{((rateLimitHealth.metrics?.errorRate || 0) * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <Card className="electric-border">
              <CardHeader>
                <CardTitle>Deployment Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="h-16 electric-border bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500"
                    onClick={() => window.location.href = '/api/mainnet/env-template'}
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Download Environment Template
                  </Button>
                  <Button 
                    className="h-16 electric-border bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500"
                    onClick={() => window.location.href = '/api/security/report'}
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Generate Security Report
                  </Button>
                  <Button 
                    className="h-16 electric-border bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500"
                    onClick={() => window.location.href = '/production-deployment'}
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Production Deployment
                  </Button>
                  <Button 
                    className="h-16 electric-border bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500"
                    onClick={() => window.location.href = '/coin-minting-launch'}
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Launch Strategy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}