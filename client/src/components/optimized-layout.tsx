/**
 * Optimized Layout Component
 * Implements lazy loading and performance optimization for better loading speeds
 */

import { lazy, Suspense, useEffect } from "react";
import { LoadingSpinner } from "./loading-spinner";
import { FlyingButterflies } from "./flying-butterflies";

// Lazy load heavy components
const HeavyTooltip = lazy(() => import("./ui/tooltip").then(module => ({ default: module.TooltipProvider })));
const HeavyToaster = lazy(() => import("./ui/toaster").then(module => ({ default: module.Toaster })));

interface OptimizedLayoutProps {
  children: React.ReactNode;
}

export function OptimizedLayout({ children }: OptimizedLayoutProps) {
  // Preload critical CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = '/src/index.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Global Flying Butterflies Background */}
      <FlyingButterflies />
      
      <Suspense fallback={<LoadingSpinner />}>
        <HeavyTooltip>
          <div className="relative z-10">
            {children}
          </div>
          <HeavyToaster />
        </HeavyTooltip>
      </Suspense>
    </div>
  );
}

export default OptimizedLayout;