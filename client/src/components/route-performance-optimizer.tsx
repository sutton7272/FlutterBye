import { memo, ComponentType, ReactNode } from 'react';
import { OptimizedNavbar } from './optimized-navbar';
import { OptimizedSuspense } from './performance-optimized-suspense';

interface RouteWrapperProps {
  component: ComponentType;
  showNavbar?: boolean;
  showFooter?: boolean;
}

// High-performance route wrapper with memoization
export const OptimizedRouteWrapper = memo(({ 
  component: Component, 
  showNavbar = true, 
  showFooter = false 
}: RouteWrapperProps) => (
  <>
    {showNavbar && <OptimizedNavbar />}
    <OptimizedSuspense>
      <Component />
    </OptimizedSuspense>
    {/* Footer can be added here if needed */}
  </>
));

OptimizedRouteWrapper.displayName = 'OptimizedRouteWrapper';

// Simple route wrapper without navbar for special pages
export const SimpleRouteWrapper = memo(({ children }: { children: ReactNode }) => (
  <OptimizedSuspense>
    {children}
  </OptimizedSuspense>
));

SimpleRouteWrapper.displayName = 'SimpleRouteWrapper';