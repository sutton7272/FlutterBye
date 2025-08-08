import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  Database, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart3,
  Zap,
  Shield
} from "lucide-react";

interface SystemHealth {
  timestamp: string;
  status: 'healthy' | 'warning' | 'critical';
  database: {
    status: 'connected' | 'disconnected' | 'slow';
    responseTime: number;
    activeConnections?: number;
  };
  apis: {
    [endpoint: string]: {
      status: 'ok' | 'slow' | 'error';
      responseTime: number;
      lastChecked: string;
      errorCount: number;
    };
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: number;
}

export default function MonitoringDashboard() {
  const { toast } = useToast();
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Fetch system health data
  const { data: healthData, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/health"],
    refetchInterval: autoRefresh ? 5000 : false // Refresh every 5 seconds
  }) as { data: SystemHealth, isLoading: boolean, error: any };

  // Fetch monitoring metrics
  const { data: metricsData } = useQuery({
    queryKey: ["/api/monitoring/metrics"],
    refetchInterval: autoRefresh ? 10000 : false // Refresh every 10 seconds
  });

  // Fetch dashboard data
  const { data: dashboardData } = useQuery({
    queryKey: ["/api/monitoring/dashboard"],
    refetchInterval: autoRefresh ? 15000 : false // Refresh every 15 seconds
  });

  // Test alerts function
  const testAlerts = async () => {
    try {
      const response = await apiRequest("POST", "/api/monitoring/alerts/test", {
        type: "performance",
        message: "Test alert triggered from monitoring dashboard"
      });
      
      toast({
        title: "Alert Test Successful",
        description: "Test alert has been sent to the monitoring system",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Alert Test Failed",
        description: error.message || "Failed to send test alert",
        variant: "destructive"
      });
    }
  };

  // Status indicator component
  const StatusIndicator = ({ status }: { status: 'healthy' | 'warning' | 'critical' | 'ok' | 'slow' | 'error' | 'connected' | 'disconnected' }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'healthy':
        case 'ok':
        case 'connected':
          return 'text-green-400';
        case 'warning':
        case 'slow':
          return 'text-yellow-400';
        case 'critical':
        case 'error':
        case 'disconnected':
          return 'text-red-400';
        default:
          return 'text-gray-400';
      }
    };

    const getIcon = () => {
      switch (status) {
        case 'healthy':
        case 'ok':
        case 'connected':
          return <CheckCircle className="h-5 w-5" />;
        case 'warning':
        case 'slow':
          return <AlertTriangle className="h-5 w-5" />;
        case 'critical':
        case 'error':
        case 'disconnected':
          return <XCircle className="h-5 w-5" />;
        default:
          return <Clock className="h-5 w-5" />;
      }
    };

    return (
      <div className={`flex items-center gap-2 ${getStatusColor()}`}>
        {getIcon()}
        <span className="font-medium capitalize">{status}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="h-16 w-16 text-blue-400 animate-pulse mx-auto" />
          <h2 className="text-2xl font-bold text-white">Loading Monitoring Dashboard...</h2>
          <p className="text-slate-400">Initializing system health monitoring</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="h-16 w-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Monitoring Dashboard Error</h2>
          <p className="text-slate-400">Failed to load system health data</p>
          <Button onClick={() => refetch()} className="bg-blue-600 hover:bg-blue-700">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Activity className="h-12 w-12 text-blue-400 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              System Monitoring
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Phase 1: Real-time System Health, Performance & Stability Monitoring
          </p>
          
          {/* System Status Overview */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                <StatusIndicator status={healthData?.status || 'warning'} />
              </div>
              <div className="text-sm text-slate-400">System Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {healthData ? Math.floor(healthData.uptime / 60) : 0}m
              </div>
              <div className="text-sm text-slate-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Object.keys(healthData?.apis || {}).length}
              </div>
              <div className="text-sm text-slate-400">APIs Monitored</div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
          </Button>
          <Button onClick={testAlerts} variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Test Alerts
          </Button>
          <Button onClick={() => refetch()} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Refresh Now
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="apis" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              APIs
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Database className="h-5 w-5" />
                    Database Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StatusIndicator status={healthData?.database?.status || 'disconnected'} />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Response Time</span>
                      <span className="text-sm font-medium">{healthData?.database?.responseTime || 0}ms</span>
                    </div>
                    {healthData?.database?.activeConnections !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Active Connections</span>
                        <span className="text-sm font-medium">{healthData.database.activeConnections}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Server className="h-5 w-5" />
                    Memory Usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Used</span>
                      <span className="text-sm font-medium">
                        {Math.round((healthData?.memory?.used || 0) / 1024 / 1024)}MB
                      </span>
                    </div>
                    <Progress 
                      value={healthData?.memory?.percentage || 0} 
                      className="h-2"
                    />
                    <div className="text-right">
                      <span className="text-xs text-slate-500">
                        {healthData?.memory?.percentage || 0}% of {Math.round((healthData?.memory?.total || 0) / 1024 / 1024)}MB
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Activity className="h-5 w-5" />
                    API Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {healthData?.apis && Object.entries(healthData.apis).slice(0, 3).map(([endpoint, api]) => (
                      <div key={endpoint} className="flex justify-between items-center">
                        <span className="text-sm text-slate-400 truncate max-w-32">
                          {endpoint.replace('/api/', '')}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={api.status === 'ok' ? 'default' : api.status === 'slow' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {api.responseTime}ms
                          </Badge>
                          <StatusIndicator status={api.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Database className="h-5 w-5" />
                  Database Performance Metrics
                </CardTitle>
                <CardDescription>
                  Real-time database health and performance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-300">Connection Status</h4>
                    <StatusIndicator status={healthData?.database?.status || 'disconnected'} />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Response Time</span>
                        <Badge variant={
                          (healthData?.database?.responseTime || 0) < 100 ? 'default' : 
                          (healthData?.database?.responseTime || 0) < 500 ? 'secondary' : 'destructive'
                        }>
                          {healthData?.database?.responseTime || 0}ms
                        </Badge>
                      </div>
                      
                      {healthData?.database?.activeConnections !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Active Connections</span>
                          <span className="text-sm font-medium">{healthData.database.activeConnections}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APIs Tab */}
          <TabsContent value="apis" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Server className="h-5 w-5" />
                  API Endpoint Monitoring
                </CardTitle>
                <CardDescription>
                  Individual API endpoint health and performance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthData?.apis && Object.entries(healthData.apis).map(([endpoint, api]) => (
                    <div key={endpoint} className="p-4 border border-slate-700 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-slate-300">{endpoint}</h4>
                          <p className="text-xs text-slate-500">Last checked: {new Date(api.lastChecked).toLocaleTimeString()}</p>
                        </div>
                        <StatusIndicator status={api.status} />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Response Time</span>
                          <div className="font-medium">{api.responseTime}ms</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Error Count</span>
                          <div className="font-medium">{api.errorCount}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Status</span>
                          <Badge variant={
                            api.status === 'ok' ? 'default' : 
                            api.status === 'slow' ? 'secondary' : 'destructive'
                          }>
                            {api.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Shield className="h-5 w-5" />
                  System Resources & Performance
                </CardTitle>
                <CardDescription>
                  Server resource utilization and system performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-300">Memory Usage</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Used Memory</span>
                        <span className="text-sm font-medium">
                          {Math.round((healthData?.memory?.used || 0) / 1024 / 1024)}MB
                        </span>
                      </div>
                      <Progress 
                        value={healthData?.memory?.percentage || 0} 
                        className="h-3"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{healthData?.memory?.percentage || 0}% utilized</span>
                        <span>Total: {Math.round((healthData?.memory?.total || 0) / 1024 / 1024)}MB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-300">System Info</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Uptime</span>
                        <span className="text-sm font-medium">
                          {Math.floor((healthData?.uptime || 0) / 60)}m {(healthData?.uptime || 0) % 60}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Status</span>
                        <StatusIndicator status={healthData?.status || 'warning'} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Last Updated</span>
                        <span className="text-sm font-medium">
                          {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleTimeString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}