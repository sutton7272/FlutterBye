// Performance Optimization Hook for Frontend
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  renderTime: number;
  networkLatency: number;
}

interface PerformanceConfig {
  enableLazyLoading: boolean;
  enableCaching: boolean;
  enableCompression: boolean;
  preloadCriticalResources: boolean;
}

export function usePerformanceOptimization() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTime: 0,
    renderTime: 0,
    networkLatency: 0
  });

  const [config, setConfig] = useState<PerformanceConfig>({
    enableLazyLoading: true,
    enableCaching: true,
    enableCompression: true,
    preloadCriticalResources: true
  });

  // Measure page load time
  useEffect(() => {
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, pageLoadTime: loadTime }));
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Measure render performance
  const measureRender = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, renderTime }));
      console.log(`🎭 ${componentName} render time: ${renderTime.toFixed(2)}ms`);
    };
  }, []);

  // Measure API response time
  const measureApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpointName: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const responseTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, apiResponseTime: responseTime }));
      
      if (responseTime > 1000) {
        console.warn(`🐌 Slow API call: ${endpointName} took ${responseTime.toFixed(2)}ms`);
      } else {
        console.log(`⚡ Fast API call: ${endpointName} took ${responseTime.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const errorTime = performance.now() - startTime;
      console.error(`❌ API call failed: ${endpointName} after ${errorTime.toFixed(2)}ms`, error);
      throw error;
    }
  }, []);

  // Preload critical resources
  const preloadResource = useCallback((url: string, type: 'script' | 'style' | 'image' = 'script') => {
    if (!config.preloadCriticalResources) return;

    const link = document.createElement('link');
    link.rel = type === 'image' ? 'preload' : 'preload';
    link.as = type === 'image' ? 'image' : type === 'style' ? 'style' : 'script';
    link.href = url;
    document.head.appendChild(link);
  }, [config.preloadCriticalResources]);

  // Lazy load component
  const createLazyComponent = useCallback((importFn: () => Promise<any>) => {
    if (!config.enableLazyLoading) {
      return importFn;
    }

    return () => {
      const startTime = performance.now();
      return importFn().then(module => {
        const loadTime = performance.now() - startTime;
        console.log(`📦 Lazy component loaded in ${loadTime.toFixed(2)}ms`);
        return module;
      });
    };
  }, [config.enableLazyLoading]);

  // Optimize images
  const optimizeImage = useCallback((src: string, options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'original';
  }) => {
    if (!src) return src;

    // Return optimized image URL based on options
    const params = new URLSearchParams();
    if (options?.width) params.set('w', options.width.toString());
    if (options?.height) params.set('h', options.height.toString());
    if (options?.quality) params.set('q', options.quality.toString());
    if (options?.format && options.format !== 'original') params.set('f', options.format);

    return params.toString() ? `${src}?${params.toString()}` : src;
  }, []);

  // Debounce function for search/input optimization
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Cache management
  const clearCache = useCallback(async () => {
    try {
      await fetch('/api/performance/clear-cache', { method: 'POST' });
      console.log('✅ Cache cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
    }
  }, []);

  // Get performance stats from server
  const { data: performanceStats } = useQuery({
    queryKey: ['/api/performance/comprehensive-stats'],
    queryFn: async () => {
      const response = await fetch('/api/performance/comprehensive-stats');
      if (!response.ok) throw new Error('Failed to fetch performance stats');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Performance score calculation
  const calculatePerformanceScore = useCallback(() => {
    const { pageLoadTime, apiResponseTime, renderTime } = metrics;
    
    let score = 100;
    
    // Deduct points for slow performance
    if (pageLoadTime > 3000) score -= 30;
    else if (pageLoadTime > 2000) score -= 20;
    else if (pageLoadTime > 1000) score -= 10;
    
    if (apiResponseTime > 2000) score -= 25;
    else if (apiResponseTime > 1000) score -= 15;
    else if (apiResponseTime > 500) score -= 5;
    
    if (renderTime > 100) score -= 15;
    else if (renderTime > 50) score -= 10;
    else if (renderTime > 16) score -= 5; // 60fps threshold
    
    return Math.max(0, score);
  }, [metrics]);

  // Performance recommendations
  const getPerformanceRecommendations = useCallback(() => {
    const recommendations = [];
    const { pageLoadTime, apiResponseTime, renderTime } = metrics;
    
    if (pageLoadTime > 2000) {
      recommendations.push("Enable code splitting and lazy loading");
      recommendations.push("Optimize images and assets");
      recommendations.push("Enable compression");
    }
    
    if (apiResponseTime > 1000) {
      recommendations.push("Implement API response caching");
      recommendations.push("Optimize database queries");
      recommendations.push("Consider using a CDN");
    }
    
    if (renderTime > 50) {
      recommendations.push("Optimize React components with memo()");
      recommendations.push("Reduce component re-renders");
      recommendations.push("Use virtualization for large lists");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Performance is excellent! 🎉");
    }
    
    return recommendations;
  }, [metrics]);

  return {
    metrics,
    config,
    setConfig,
    measureRender,
    measureApiCall,
    preloadResource,
    createLazyComponent,
    optimizeImage,
    debounce,
    clearCache,
    performanceStats,
    calculatePerformanceScore,
    getPerformanceRecommendations
  };
}