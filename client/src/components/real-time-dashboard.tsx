import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  Activity, 
  Users, 
  TrendingUp, 
  Zap,
  Globe,
  Wifi,
  Database,
  Clock,
  BarChart3,
  Eye,
  MessageSquare,
  Coins
} from "lucide-react";

interface RealTimeMetrics {
  activeUsers: number;
  totalTransactions: number;
  platformRevenue: string;
  networkStatus: 'healthy' | 'warning' | 'critical';
  responseTime: number;
  errorRate: number;
  throughput: number;
  connectedWallets: number;
  liveInteractions: number;
}

export function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 1247,
    totalTransactions: 45892,
    platformRevenue: "$2.4M",
    networkStatus: 'healthy',
    responseTime: 45,
    errorRate: 0.2,
    throughput: 1250,
    connectedWallets: 8934,
    liveInteractions: 342
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5),
        responseTime: Math.max(20, prev.responseTime + (Math.random() - 0.5) * 10),
        errorRate: Math.max(0, Math.min(2, prev.errorRate + (Math.random() - 0.5) * 0.2)),
        throughput: prev.throughput + Math.floor(Math.random() * 100) - 50,
        connectedWallets: prev.connectedWallets + Math.floor(Math.random() * 10) - 5,
        liveInteractions: prev.liveInteractions + Math.floor(Math.random() * 20) - 10
      }));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getResponseTimeStatus = (time: number) => {
    if (time < 50) return { color: 'text-green-500', status: 'Excellent' };
    if (time < 100) return { color: 'text-yellow-500', status: 'Good' };
    return { color: 'text-red-500', status: 'Needs Attention' };
  };

  const responseStatus = getResponseTimeStatus(metrics.responseTime);

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card className="circuit-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-electric-blue" />
              Real-Time Platform Status
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics.networkStatus)}`} />
              <Badge variant="outline" className="text-xs">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-electric-blue" />
            </div>
            <div className="mt-2">
              <Progress value={(metrics.activeUsers / 2000) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{metrics.totalTransactions.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-electric-green" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                +{Math.floor(Math.random() * 50)} this hour
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{metrics.platformRevenue}</p>
              </div>
              <Coins className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs text-green-500">
                +12.5% today
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">{metrics.responseTime.toFixed(0)}ms</p>
              </div>
              <Zap className={`h-8 w-8 ${responseStatus.color}`} />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className={`text-xs ${responseStatus.color}`}>
                {responseStatus.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-electric-blue" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm">{metrics.errorRate.toFixed(2)}%</span>
              </div>
              <Progress value={metrics.errorRate * 20} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Throughput</span>
                <span className="text-sm">{metrics.throughput.toLocaleString()} req/min</span>
              </div>
              <Progress value={(metrics.throughput / 2000) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Database Health</span>
                <Badge variant="outline" className="text-green-500">Optimal</Badge>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-electric-green" />
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-electric-blue" />
                <span className="font-medium">Connected Wallets</span>
              </div>
              <span className="font-bold">{metrics.connectedWallets.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple" />
                <span className="font-medium">Live Interactions</span>
              </div>
              <span className="font-bold">{metrics.liveInteractions.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-electric-green" />
                <span className="font-medium">Page Views/Hour</span>
              </div>
              <span className="font-bold">45.2K</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Optimize Database
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            <Button variant="outline" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              Check Network
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Performance Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}