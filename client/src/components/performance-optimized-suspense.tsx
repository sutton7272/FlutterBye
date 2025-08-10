import { Suspense, memo, ReactNode } from 'react';
import { OptimizedLoadingSpinner } from './optimized-loading';

interface OptimizedSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// High-performance Suspense wrapper with minimal overhead
export const OptimizedSuspense = memo(({ children, fallback }: OptimizedSuspenseProps) => (
  <Suspense fallback={fallback || <OptimizedLoadingSpinner />}>
    {children}
  </Suspense>
));

OptimizedSuspense.displayName = 'OptimizedSuspense';

// Lazy loading wrapper for route components
export const LazyRouteWrapper = memo(({ children }: { children: ReactNode }) => (
  <OptimizedSuspense>
    {children}
  </OptimizedSuspense>
));

LazyRouteWrapper.displayName = 'LazyRouteWrapper';