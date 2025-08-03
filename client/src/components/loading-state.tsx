import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  message?: string;
  variant?: 'default' | 'card' | 'text' | 'button';
  className?: string;
}

export function LoadingState({ 
  message = "Loading...", 
  variant = 'default',
  className = ""
}: LoadingStateProps) {
  if (variant === 'card') {
    return (
      <Card className={`bg-gray-900/50 border-gray-700/50 ${className}`}>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-700/50" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4 bg-gray-700/50" />
              <Skeleton className="h-4 w-1/2 bg-gray-700/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-700/50" />
            <Skeleton className="h-4 w-5/6 bg-gray-700/50" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        <Skeleton className="h-4 w-3/4 bg-gray-700/50" />
        <Skeleton className="h-4 w-1/2 bg-gray-700/50" />
        <Skeleton className="h-4 w-5/6 bg-gray-700/50" />
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <Skeleton className={`h-10 w-24 bg-gray-700/50 ${className}`} />
    );
  }

  return (
    <div className={`flex items-center justify-center p-6 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 border-4 border-t-electric-blue border-r-electric-green border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <span className="text-gray-300 font-medium">{message}</span>
      </div>
    </div>
  );
}

// Performance optimized shimmer loading for lists
interface ShimmerListProps {
  items?: number;
  className?: string;
}

export function ShimmerList({ items = 3, className = "" }: ShimmerListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="loading-shimmer rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full bg-gray-600/50" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3 bg-gray-600/50" />
              <Skeleton className="h-3 w-1/4 bg-gray-600/50" />
            </div>
          </div>
          <Skeleton className="h-16 w-full bg-gray-600/50" />
        </div>
      ))}
    </div>
  );
}