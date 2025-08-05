import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Wallet, 
  Hash, 
  Activity, 
  TrendingUp, 
  BarChart3,
  Users,
  Coins,
  Zap
} from "lucide-react";

// Dashboard Loading State
export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-background/50 border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Chart Card */}
        <Card className="lg:col-span-2 bg-background/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Side Panel */}
        <Card className="bg-background/50 border-border/50">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Table Loading State
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
      
      {/* Table Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4 py-3 border-b border-border/30" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Search Results Loading
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="bg-background/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              
              <Skeleton className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Chat Loading State
export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
          <div className={`max-w-[70%] space-y-2 ${i % 2 === 0 ? '' : 'items-end'}`}>
            <Skeleton className="h-4 w-20" />
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          {i % 2 === 1 && <Skeleton className="h-8 w-8 rounded-full" />}
        </div>
      ))}
    </div>
  );
}

// AI Analysis Loading
export function AIAnalysisSkeleton() {
  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-primary/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary animate-pulse" />
          </div>
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress indicators */}
        <div className="space-y-3">
          {['Analyzing patterns...', 'Processing sentiment...', 'Generating insights...'].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
        
        {/* Skeleton content */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </CardContent>
    </Card>
  );
}

// Token Creation Loading
export function TokenCreationSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="bg-background/50 border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          <div>
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div className="flex justify-end gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Progressive Loading Component
interface ProgressiveLoadingProps {
  stage: 'connecting' | 'loading' | 'processing' | 'complete';
  message?: string;
  progress?: number;
}

export function ProgressiveLoading({ stage, message, progress }: ProgressiveLoadingProps) {
  const getStageIcon = () => {
    switch (stage) {
      case 'connecting':
        return <Zap className="w-5 h-5 animate-pulse" />;
      case 'loading':
        return <Activity className="w-5 h-5 animate-spin" />;
      case 'processing':
        return <Brain className="w-5 h-5 animate-pulse" />;
      case 'complete':
        return <Badge className="w-5 h-5" />;
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case 'connecting':
        return 'text-yellow-400';
      case 'loading':
        return 'text-blue-400';
      case 'processing':
        return 'text-purple-400';
      case 'complete':
        return 'text-green-400';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={`${getStageColor()}`}>
        {getStageIcon()}
      </div>
      
      {message && (
        <p className="text-sm text-muted-foreground text-center">
          {message}
        </p>
      )}
      
      {progress !== undefined && (
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Pulse Loading Animation
export function PulseLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}