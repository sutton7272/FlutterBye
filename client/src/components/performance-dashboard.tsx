import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePerformance, useOnlineStatus } from '@/hooks/use-performance';
import { Monitor, Wifi, WifiOff, Zap, AlertTriangle, Activity, MemoryStick, Globe } from 'lucide-react';

export function PerformanceDashboard() {
  const metrics = usePerformance();
  const isOnline = useOnlineStatus();

  const getMemoryStatus = (usage: number) => {
    if (usage < 50) return { color: 'bg-green-500', text: 'Good', variant: 'default' as const };
    if (usage < 80) return { color: 'bg-yellow-500', text: 'Moderate', variant: 'secondary' as const };
    return { color: 'bg-red-500', text: 'High', variant: 'destructive' as const };
  };

  const getRenderTimeStatus = (time: number) => {
    if (time < 100) return { color: 'bg-green-500', text: 'Fast', variant: 'default' as const };
    if (time < 300) return { color: 'bg-yellow-500', text: 'Good', variant: 'secondary' as const };
    return { color: 'bg-red-500', text: 'Slow', variant: 'destructive' as const };
  };

  const memoryStatus = getMemoryStatus(metrics.memoryUsage);
  const renderStatus = getRenderTimeStatus(metrics.renderTime);

  return (
    <Card className="bg-slate-800/50 border border-electric-blue/30 hover:border-electric-blue/50 transition-all duration-300 electric-frame">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm text-white">
          <Monitor className="w-4 h-4 text-electric-blue" />
          Performance Monitor
          <Badge variant={isOnline ? 'default' : 'destructive'} className="ml-auto bg-electric-blue/20 border border-electric-blue/40">
            {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <MemoryStick className="w-3 h-3 text-electric-green" />
              <span className="text-gray-200">Memory Usage</span>
            </div>
            <Badge variant={memoryStatus.variant} className="text-xs px-1 py-0">
              {memoryStatus.text}
            </Badge>
          </div>
          <Progress value={Math.min(metrics.memoryUsage, 100)} className="h-1" />
          <div className="text-xs text-gray-300">
            {metrics.memoryUsage.toFixed(1)} MB
          </div>
        </div>

        {/* Render Time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-electric-blue" />
              <span className="text-gray-200">Render Time</span>
            </div>
            <Badge variant={renderStatus.variant} className="text-xs px-1 py-0">
              {renderStatus.text}
            </Badge>
          </div>
          <div className="text-xs text-gray-300">
            {metrics.renderTime.toFixed(0)}ms
          </div>
        </div>

        {/* Network Requests */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-electric-green" />
              <span className="text-gray-200">Network Requests</span>
            </div>
            <span className="text-xs text-gray-300">
              {metrics.networkRequests}
            </span>
          </div>
        </div>

        {/* Error Count */}
        {metrics.errorCount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span className="text-gray-200">Errors</span>
              </div>
              <Badge variant="destructive" className="text-xs px-1 py-0">
                {metrics.errorCount}
              </Badge>
            </div>
          </div>
        )}

        {/* Load Time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-electric-blue" />
              <span className="text-gray-200">Page Load</span>
            </div>
            <span className="text-xs text-gray-300">
              {(metrics.loadTime / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}