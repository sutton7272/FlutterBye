import { useEffect, useCallback, useRef } from 'react';

export function usePerformanceOptimization() {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  // Performance monitoring
  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && timeSinceLastRender > 16) {
      console.warn(`Slow render detected: ${timeSinceLastRender}ms`);
    }
  });

  // Debounced function utility
  const useDebounce = useCallback((func: (...args: any[]) => void, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    
    return useCallback((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), delay);
    }, [func, delay]);
  }, []);

  // Throttled function utility
  const useThrottle = useCallback((func: (...args: any[]) => void, delay: number) => {
    const lastRun = useRef(Date.now());
    
    return useCallback((...args: any[]) => {
      if (Date.now() - lastRun.current >= delay) {
        func(...args);
        lastRun.current = Date.now();
      }
    }, [func, delay]);
  }, []);

  // Memory usage monitoring
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize / 1048576; // Convert to MB
      const total = memory.totalJSHeapSize / 1048576;
      
      if (used / total > 0.8) {
        console.warn(`High memory usage: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`);
      }
    }
  }, []);

  // Intersection Observer for lazy loading
  const useIntersectionObserver = useCallback((
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) => {
    const observer = useRef<IntersectionObserver>();
    
    const observe = useCallback((element: Element) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(callback, options);
      observer.current.observe(element);
    }, [callback, options]);

    useEffect(() => {
      return () => observer.current?.disconnect();
    }, []);

    return observe;
  }, []);

  return {
    renderCount: renderCount.current,
    useDebounce,
    useThrottle,
    checkMemoryUsage,
    useIntersectionObserver
  };
}