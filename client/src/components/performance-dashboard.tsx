import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { 
  Activity, 
  Zap, 
  Clock, 
  Cpu, 
  HardDrive,
  Wifi,
  Battery,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  errorRate: number;
  uptime: number;
  activeUsers: number;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 45,
    memoryUsage: 67,
    cacheHitRate: 94,
    errorRate: 0.2,
    uptime: 99.9,
    activeUsers: 1247
  });

  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online');
  const [batteryLevel, setBatteryLevel] = useState<number>(75);
  const { renderCount, checkMemoryUsage } = usePerformanceOptimization();

  // Monitor performance metrics
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time metrics updates
      setMetrics(prev => ({
        responseTime: prev.responseTime + (Math.random() - 0.5) * 10,
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        cacheHitRate: Math.max(80, Math.min(99, prev.cacheHitRate + (Math.random() - 0.5) * 2)),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5)),
        uptime: Math.max(95, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
        activeUsers: Math.max(800, prev.activeUsers + Math.floor((Math.random() - 0.5) * 50))
      }));

      // Check memory usage
      checkMemoryUsage();
    }, 5000);

    return () => clearInterval(interval);
  }, [checkMemoryUsage]);

  // Monitor network status
  useEffect(() => {
    const updateNetworkStatus = () => {
      if (!navigator.onLine) {
        setNetworkStatus('offline');
      } else if ((navigator as any).connection?.effectiveType === '2g') {
        setNetworkStatus('slow');
      } else {
        setNetworkStatus('online');
      }
    };

    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  // Monitor battery (if available)
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  const getStatusColor = (value: number, good: number, warning: number) => {
    if (value >= good) return 'text-green-500';
    if (value >= warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = (value: number, good: number, warning: number) => {
    if (value >= good) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (value >= warning) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <Card className="circuit-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-electric-blue" />
            Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Response Time */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-electric-blue" />
                  <span className="text-sm font-medium">Response Time</span>
                </div>
                {getStatusIcon(100 - metrics.responseTime, 60, 40)}
              </div>
              <div className="text-2xl font-bold">{metrics.responseTime.toFixed(0)}ms</div>
              <Progress value={Math.max(0, 100 - metrics.responseTime)} className="h-2" />
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-purple" />
                  <span className="text-sm font-medium">Memory Usage</span>
                </div>
                {getStatusIcon(100 - metrics.memoryUsage, 50, 30)}
              </div>
              <div className="text-2xl font-bold">{metrics.memoryUsage.toFixed(0)}%</div>
              <Progress value={metrics.memoryUsage} className="h-2" />
            </div>

            {/* Cache Hit Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-electric-green" />
                  <span className="text-sm font-medium">Cache Hit Rate</span>
                </div>
                {getStatusIcon(metrics.cacheHitRate, 90, 80)}
              </div>
              <div className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
              <Progress value={metrics.cacheHitRate} className="h-2" />
            </div>

            {/* Error Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange" />
                  <span className="text-sm font-medium">Error Rate</span>
                </div>
                {getStatusIcon(100 - metrics.errorRate * 20, 98, 95)}
              </div>
              <div className="text-2xl font-bold">{metrics.errorRate.toFixed(2)}%</div>
              <Progress value={metrics.errorRate * 20} className="h-2" />
            </div>

            {/* Uptime */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-electric-blue" />
                  <span className="text-sm font-medium">Uptime</span>
                </div>
                {getStatusIcon(metrics.uptime, 99, 95)}
              </div>
              <div className="text-2xl font-bold">{metrics.uptime.toFixed(1)}%</div>
              <Progress value={metrics.uptime} className="h-2" />
            </div>

            {/* Active Users */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-electric-green" />
                  <span className="text-sm font-medium">Active Users</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Online now</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-electric-green" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Network Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Wifi className={`h-4 w-4 ${
                  networkStatus === 'online' ? 'text-green-500' :
                  networkStatus === 'slow' ? 'text-yellow-500' : 'text-red-500'
                }`} />
                <span className="font-medium">Network</span>
              </div>
              <Badge variant={
                networkStatus === 'online' ? 'default' :
                networkStatus === 'slow' ? 'secondary' : 'destructive'
              }>
                {networkStatus}
              </Badge>
            </div>

            {/* Battery Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Battery className={`h-4 w-4 ${
                  batteryLevel > 50 ? 'text-green-500' :
                  batteryLevel > 20 ? 'text-yellow-500' : 'text-red-500'
                }`} />
                <span className="font-medium">Battery</span>
              </div>
              <Badge variant="outline">
                {batteryLevel}%
              </Badge>
            </div>

            {/* Render Count */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-electric-blue" />
                <span className="font-medium">Renders</span>
              </div>
              <Badge variant="outline">
                {renderCount}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={checkMemoryUsage}>
              Check Memory
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Clear Cache
            </Button>
            <Button variant="outline" size="sm">
              Optimize Database
            </Button>
            <Button variant="outline" size="sm">
              Preload Assets
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}