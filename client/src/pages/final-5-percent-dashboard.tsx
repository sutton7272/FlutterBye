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
  overallReadiness: number;
  status: string;
  components: Array<{
    name: string;
    status: string;
    readiness: number;
    details: any;
  }>;
  lastUpdated: string;
  milestone: string;
}

interface ComponentStatus {
  name: string;
  status: string;
  readiness: number;
  details: any;
}

export default function Final5PercentDashboard() {
  const { data: comprehensiveStatus, isLoading: statusLoading, refetch: refetchStatus } = useQuery<Final5PercentStatus>({
    queryKey: ['/api/final-5-percent/comprehensive-status'],
    refetchInterval: 30000,
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

  if (!comprehensiveStatus) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400">Failed to load status</h1>
            <Button onClick={() => refetchStatus()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getComponentIcon = (componentName: string) => {
    switch (componentName.toLowerCase()) {
      case 'mainnet deployment':
        return <Server className="w-4 h-4" />;
      case 'flby token deployment':
        return <DollarSign className="w-4 h-4" />;
      case 'websocket optimization':
        return <Wifi className="w-4 h-4" />;
      case 'production rate limiting':
        return <Shield className="w-4 h-4" />;
      case 'final security audit':
        return <Lock className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETE':
        return 'bg-green-500/10 text-green-400 border-green-500';
      case 'CONFIGURING':
      case 'DEPLOYING':
      case 'OPTIMIZING':
      case 'AUDITING':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500';
    }
  };

  const isProductionReady = comprehensiveStatus.status === 'PRODUCTION_READY';

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
            {comprehensiveStatus.milestone}
          </p>
          <div className="flex items-center justify-center gap-6">
            <Badge className={`${
              isProductionReady 
                ? 'bg-green-500/10 text-green-400 border-green-500' 
                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500'
            }`}>
              {comprehensiveStatus.status.replace('_', ' ')}
            </Badge>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500">
              {comprehensiveStatus.overallReadiness}% Complete
            </Badge>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="electric-border bg-gradient-to-r from-blue-500/10 to-green-500/10">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Overall Infrastructure Progress
            </CardTitle>
            <CardDescription>
              Status of all critical production readiness components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total Readiness</span>
                <span className="text-2xl font-bold text-blue-400">{comprehensiveStatus.overallReadiness}%</span>
              </div>
              <Progress value={comprehensiveStatus.overallReadiness} className="h-4" />
              
              {isProductionReady ? (
                <Alert className="border-green-500/20 bg-green-500/10">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Production Ready!</AlertTitle>
                  <AlertDescription>
                    All critical infrastructure components are complete and operational.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-yellow-500/20 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Final Optimization in Progress</AlertTitle>
                  <AlertDescription>
                    Some components are still being finalized for production deployment.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Component Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comprehensiveStatus.components.map((component: ComponentStatus, index: number) => (
            <Card key={index} className="electric-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  {getComponentIcon(component.name)}
                  {component.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Progress</span>
                    <span className="font-bold text-blue-400">{component.readiness}%</span>
                  </div>
                  <Progress value={component.readiness} className="h-2" />
                  <Badge className={getStatusColor(component.status)}>
                    {component.status}
                  </Badge>
                  {component.status === 'COMPLETE' && (
                    <div className="flex items-center gap-1 text-green-400 text-xs">
                      <CheckCircle className="w-3 h-3" />
                      Operational
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="electric-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-6 h-6" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Manage and monitor production readiness status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => refetchStatus()} 
                className="electric-button"
              >
                <Activity className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
              
              {isProductionReady && (
                <Button className="electric-button bg-green-600 hover:bg-green-700">
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy to Production
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                <Database className="w-4 h-4 mr-2" />
                View Diagnostics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Component Status */}
        <Card className="electric-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Detailed Component Status
            </CardTitle>
            <CardDescription>
              In-depth status and configuration details for each component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comprehensiveStatus.components.map((component: ComponentStatus, index: number) => (
                    <div key={index} className="p-4 border border-gray-700 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {getComponentIcon(component.name)}
                        <h4 className="font-semibold">{component.name}</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Status:</span>
                          <Badge className={getStatusColor(component.status)}>
                            {component.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Readiness:</span>
                          <span className="text-sm font-medium text-blue-400">{component.readiness}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="infrastructure" className="space-y-4">
                <Alert>
                  <Server className="h-4 w-4" />
                  <AlertTitle>Infrastructure Components</AlertTitle>
                  <AlertDescription>
                    MainNet deployment and core blockchain infrastructure status
                  </AlertDescription>
                </Alert>
                <div className="space-y-4">
                  {comprehensiveStatus.components
                    .filter((comp: ComponentStatus) => 
                      comp.name.toLowerCase().includes('mainnet') || 
                      comp.name.toLowerCase().includes('token') ||
                      comp.name.toLowerCase().includes('websocket')
                    )
                    .map((component: ComponentStatus, index: number) => (
                      <div key={index} className="p-4 border border-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">{component.name}</h4>
                        <Progress value={component.readiness} className="mb-2" />
                        <Badge className={getStatusColor(component.status)}>
                          {component.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Security & Compliance</AlertTitle>
                  <AlertDescription>
                    Security audit results and production hardening status
                  </AlertDescription>
                </Alert>
                <div className="space-y-4">
                  {comprehensiveStatus.components
                    .filter((comp: ComponentStatus) => 
                      comp.name.toLowerCase().includes('security') || 
                      comp.name.toLowerCase().includes('audit') ||
                      comp.name.toLowerCase().includes('rate')
                    )
                    .map((component: ComponentStatus, index: number) => (
                      <div key={index} className="p-4 border border-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">{component.name}</h4>
                        <Progress value={component.readiness} className="mb-2" />
                        <Badge className={getStatusColor(component.status)}>
                          {component.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertTitle>Performance Optimization</AlertTitle>
                  <AlertDescription>
                    System performance and optimization status
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">Overall Readiness</h4>
                    <div className="text-2xl font-bold text-blue-400">
                      {comprehensiveStatus.overallReadiness}%
                    </div>
                  </div>
                  <div className="p-4 border border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">Last Updated</h4>
                    <div className="text-sm text-gray-400">
                      {new Date(comprehensiveStatus.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Status */}
        <div className="text-center text-sm text-gray-400">
          Last updated: {new Date(comprehensiveStatus.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  );
}