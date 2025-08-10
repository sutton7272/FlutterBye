import { useEffect, useCallback } from 'react';
import { queryClient } from '@/lib/queryClient';

// Hook to optimize performance across the application
export function usePerformanceOptimizer() {
  // Preload critical queries
  const preloadCriticalData = useCallback(() => {
    // Preload dashboard stats for faster navigation
    queryClient.prefetchQuery({
      queryKey: ['/api/dashboard/stats'],
      staleTime: 2 * 60 * 1000, // 2 minutes
    });

    // Preload admin features if user might need them
    queryClient.prefetchQuery({
      queryKey: ['/api/admin/features'],
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }, []);

  // Cleanup unused queries to free memory
  const cleanupUnusedQueries = useCallback(() => {
    queryClient.removeQueries({
      predicate: (query) => {
        const isStale = Date.now() - query.dataUpdatedAt > 10 * 60 * 1000; // 10 minutes
        const isInactive = query.observers.length === 0;
        return isStale && isInactive;
      },
    });
  }, []);

  // Performance monitoring
  useEffect(() => {
    // Preload critical data on mount
    preloadCriticalData();

    // Set up periodic cleanup
    const cleanupInterval = setInterval(cleanupUnusedQueries, 5 * 60 * 1000); // Every 5 minutes

    // Monitor and log slow operations
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 100) { // Log operations taking longer than 100ms
          console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });

    // Start observing performance
    if (typeof PerformanceObserver !== 'undefined') {
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }

    return () => {
      clearInterval(cleanupInterval);
      if (typeof PerformanceObserver !== 'undefined') {
        observer.disconnect();
      }
    };
  }, [preloadCriticalData, cleanupUnusedQueries]);

  return {
    preloadCriticalData,
    cleanupUnusedQueries,
  };
}