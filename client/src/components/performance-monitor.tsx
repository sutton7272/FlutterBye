import { useEffect, useState } from 'react';
import { performanceMonitor, memoryManager } from '@/lib/performance';

interface PerformanceStats {
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };
  bundleSize?: number;
  loadTime?: number;
}

export function PerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    // Track Core Web Vitals
    performanceMonitor.trackLCP();
    performanceMonitor.trackFID();
    performanceMonitor.trackCLS();
    performanceMonitor.trackBundleSize();

    // Update memory stats periodically
    const updateStats = () => {
      const memory = memoryManager.checkMemoryUsage();
      if (memory) {
        setStats(prev => ({ ...prev, memoryUsage: memory }));
      }
    };

    const interval = setInterval(updateStats, 5000);
    updateStats(); // Initial update

    // Toggle visibility with keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Cleanup unused images periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      memoryManager.cleanupUnusedImages();
    }, 30000); // Every 30 seconds

    return () => clearInterval(cleanup);
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Performance</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      {stats.memoryUsage && (
        <div className="space-y-1">
          <div>Memory: {stats.memoryUsage.used}MB / {stats.memoryUsage.total}MB</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(stats.memoryUsage.used / stats.memoryUsage.total) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}

// Production performance tracking hook
export function usePerformanceTracking() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Track page load time
      const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      
      // Track critical resources
      const resources = performance.getEntriesByType('resource');
      const jsResources = resources.filter(r => r.name.includes('.js'));
      const cssResources = resources.filter(r => r.name.includes('.css'));
      
      // Log performance metrics (in production, send to analytics)
      console.log('Performance Metrics:', {
        pageLoadTime,
        jsResourceCount: jsResources.length,
        cssResourceCount: cssResources.length,
        totalResources: resources.length
      });
    }
  }, []);
}

// Component to track render performance
export function RenderTracker({ componentName, children }: { componentName: string; children: React.ReactNode }) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      if (renderTime > 16) { // More than one frame
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  return <>{children}</>;
}