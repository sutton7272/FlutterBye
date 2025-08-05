import { useState, useEffect, useCallback } from 'react';

// Client-side performance monitoring and optimization
export function usePerformanceOptimization() {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    connectionStatus: 'connected',
    responseTime: 0,
    errorRate: 0,
  });

  const [optimizations, setOptimizations] = useState({
    prefetchEnabled: true,
    cacheEnabled: true,
    compressionEnabled: true,
  });

  // Monitor memory usage
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memInfo.usedJSHeapSize / 1024 / 1024),
        }));
      }
    };

    const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Monitor connection status
  useEffect(() => {
    const updateConnectionStatus = () => {
      setMetrics(prev => ({
        ...prev,
        connectionStatus: navigator.onLine ? 'connected' : 'offline',
      }));
    };

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  // Measure API response time
  const measureResponseTime = useCallback(async (apiCall: () => Promise<any>) => {
    const start = performance.now();
    try {
      const result = await apiCall();
      const responseTime = performance.now() - start;
      
      setMetrics(prev => ({
        ...prev,
        responseTime: Math.round(responseTime),
      }));
      
      return result;
    } catch (error) {
      setMetrics(prev => ({
        ...prev,
        errorRate: prev.errorRate + 1,
      }));
      throw error;
    }
  }, []);

  // Optimize images with lazy loading
  const optimizeImage = useCallback((src: string, options?: { lazy?: boolean; quality?: number }) => {
    if (options?.lazy) {
      // Use Intersection Observer for lazy loading
      return `${src}?optimize=true&quality=${options.quality || 75}`;
    }
    return src;
  }, []);

  // Prefetch critical resources
  const prefetchResource = useCallback((url: string, type: 'script' | 'style' | 'fetch' = 'fetch') => {
    if (!optimizations.prefetchEnabled) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    if (type !== 'fetch') {
      link.as = type;
    }
    document.head.appendChild(link);
  }, [optimizations.prefetchEnabled]);

  // Clean up resources to prevent memory leaks
  const cleanupResources = useCallback(() => {
    // Clear any cached data that's no longer needed
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('old-') || cacheName.includes('expired-')) {
            caches.delete(cacheName);
          }
        });
      });
    }

    // Clear performance entries
    if (performance.clearResourceTimings) {
      performance.clearResourceTimings();
    }
  }, []);

  // Auto-cleanup on high memory usage
  useEffect(() => {
    if (metrics.memoryUsage > 100) { // 100MB threshold
      cleanupResources();
    }
  }, [metrics.memoryUsage, cleanupResources]);

  return {
    metrics,
    optimizations,
    setOptimizations,
    measureResponseTime,
    optimizeImage,
    prefetchResource,
    cleanupResources,
  };
}