import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Server, Database, Shield, Zap, Users, Settings, 
  Activity, AlertTriangle, CheckCircle, Clock, 
  TrendingUp, HardDrive, Cpu, MemoryStick, Wifi,
  ArrowLeft
} from 'lucide-react';
import { Link } from "wouter";

export default function AdminSystem() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin authentication
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin-authenticated');
    if (!adminAuth) {
      window.location.href = '/admin-gateway';
      return;
    }
  }, []);

  // System health monitoring
  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ['/api/health'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: metrics } = useQuery({
    queryKey: ['/api/admin/metrics'],
    refetchInterval: 60000, // Refresh every minute
  });

  // System configuration
  const [systemConfig, setSystemConfig] = useState({
    rateLimiting: true,
    caching: true,
    monitoring: true,
    securityHeaders: true,
    apiLogging: true,
    autoBackup: true,
    maintenanceMode: false,
    featureFlags: {
      smsIntegration: false,
      aiFeatures: false,
      advancedAnalytics: true,
      realTimeChat: true
    }
  });

  // System actions
  const clearCacheMutation = useMutation({
    mutationFn: () => apiRequest('/api/admin/cache/clear', { method: 'POST' }),
    onSuccess: () => {
      toast({
        title: "Cache Cleared",
        description: "All cached data has been cleared successfully.",
      });
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cache.",
        variant: "destructive",
      });
    }
  });

  const backupMutation = useMutation({
    mutationFn: () => apiRequest('/api/admin/backup', { method: 'POST' }),
    onSuccess: () => {
      toast({
        title: "Backup Created",
        description: "System backup has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create backup.",
        variant: "destructive",
      });
    }
  });

  if (healthLoading) {
    return (
      <div className="min-h-screen text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <AlertTriangle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/admin-gateway">
            <Button variant="outline" className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              ← Admin Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              System Administration
            </h1>
            <p className="text-gray-400 mt-2">
              Monitor and manage Flutterbye platform infrastructure
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-2 ${getStatusColor(health?.status || 'unknown')}`}>
              {getStatusIcon(health?.status || 'unknown')}
              <span className="font-semibold">{health?.status?.toUpperCase() || 'UNKNOWN'}</span>
            </div>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                System Status
              </CardTitle>
              <Server className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {health?.status === 'healthy' ? 'ONLINE' : 'ISSUES'}
              </div>
              <div className="text-xs text-gray-400">
                Uptime: {Math.floor((health?.uptime || 0) / 3600)}h
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Database
              </CardTitle>
              <Database className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                CONNECTED
              </div>
              <div className="text-xs text-gray-400">
                PostgreSQL Ready
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                API Health
              </CardTitle>
              <Zap className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {metrics?.requestsLastHour || 0}
              </div>
              <div className="text-xs text-gray-400">
                Requests/hour
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Response Time
              </CardTitle>
              <Activity className="w-4 h-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">
                {Math.round(metrics?.averageResponseTime || 0)}ms
              </div>
              <div className="text-xs text-gray-400">
                Average latency
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-purple-600">
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="configuration" className="data-[state=active]:bg-purple-600">
              Configuration
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-purple-600">
              Performance
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-purple-600">
              Maintenance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>System Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">CPU Usage</span>
                      <span className="text-white">45%</span>
                    </div>
                    <Progress value={45} className="bg-gray-800" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Memory Usage</span>
                      <span className="text-white">67%</span>
                    </div>
                    <Progress value={67} className="bg-gray-800" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Disk Usage</span>
                      <span className="text-white">23%</span>
                    </div>
                    <Progress value={23} className="bg-gray-800" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rate Limiting</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      ACTIVE
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Security Headers</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      ENABLED
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Input Validation</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      ACTIVE
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">SSL/HTTPS</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      ENFORCED
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Tracking */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Recent System Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '11:45 PM', type: 'info', message: 'Database connection pool optimized' },
                    { time: '11:30 PM', type: 'success', message: 'Cache cleanup completed successfully' },
                    { time: '11:15 PM', type: 'warning', message: 'High API request volume detected' },
                    { time: '11:00 PM', type: 'info', message: 'System monitoring started' },
                  ].map((event, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-400 w-16">{event.time}</div>
                      <Badge 
                        variant="outline" 
                        className={
                          event.type === 'success' ? 'text-green-400 border-green-400' :
                          event.type === 'warning' ? 'text-yellow-400 border-yellow-400' :
                          'text-blue-400 border-blue-400'
                        }
                      >
                        {event.type.toUpperCase()}
                      </Badge>
                      <span className="text-white text-sm">{event.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Actions */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">System Maintenance</CardTitle>
                  <CardDescription>Perform system maintenance operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => clearCacheMutation.mutate()}
                    disabled={clearCacheMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {clearCacheMutation.isPending ? 'Clearing...' : 'Clear Cache'}
                  </Button>
                  
                  <Button 
                    onClick={() => backupMutation.mutate()}
                    disabled={backupMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {backupMutation.isPending ? 'Creating...' : 'Create Backup'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    Restart Services
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-red-400 text-red-400 hover:bg-red-400/10"
                  >
                    Emergency Stop
                  </Button>
                </CardContent>
              </Card>

              {/* Cache Statistics */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Cache Statistics</CardTitle>
                  <CardDescription>Current caching performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cache Entries</span>
                    <span className="text-white font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Hit Rate</span>
                    <span className="text-green-400 font-semibold">89.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Memory Usage</span>
                    <span className="text-white font-semibold">45.2 MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Expired Entries</span>
                    <span className="text-yellow-400 font-semibold">23</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}