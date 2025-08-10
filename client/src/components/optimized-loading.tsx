import { memo } from 'react';

// Optimized loading spinner with minimal re-renders
export const OptimizedLoadingSpinner = memo(() => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="w-8 h-8 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin"></div>
  </div>
));

OptimizedLoadingSpinner.displayName = 'OptimizedLoadingSpinner';

// Skeleton loader for cards
export const CardSkeleton = memo(() => (
  <div className="bg-slate-700/30 rounded-lg p-4 animate-pulse">
    <div className="h-4 bg-slate-600 rounded mb-2"></div>
    <div className="h-3 bg-slate-600 rounded w-3/4"></div>
  </div>
));

CardSkeleton.displayName = 'CardSkeleton';

// Grid skeleton for multiple cards
export const GridSkeleton = memo(({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
));

GridSkeleton.displayName = 'GridSkeleton';

// Stats skeleton
export const StatsSkeleton = memo(() => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="bg-slate-700/30 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-slate-600 rounded mb-2"></div>
        <div className="h-4 bg-slate-600 rounded w-2/3 mx-auto"></div>
      </div>
    ))}
  </div>
));

StatsSkeleton.displayName = 'StatsSkeleton';