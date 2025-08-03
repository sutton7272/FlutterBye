import { useEffect, useCallback, useRef } from 'react';

// Performance monitoring hook
export function usePerformance(componentName: string) {
  const renderStartTime = useRef<number>();
  const mountTime = useRef<number>();

  useEffect(() => {
    mountTime.current = performance.now();
    
    return () => {
      if (mountTime.current) {
        const unmountTime = performance.now();
        const totalTime = unmountTime - mountTime.current;
        
        // Only log in development
        if (process.env.NODE_ENV === 'development' && totalTime > 100) {
          console.log(`⚡ ${componentName} was mounted for ${totalTime.toFixed(2)}ms`);
        }
      }
    };
  }, [componentName]);

  const measureRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderMeasurement = useCallback(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`🐌 ${componentName} render took ${renderTime.toFixed(2)}ms (>16ms)`);
      }
    }
  }, [componentName]);

  return { measureRender, endRenderMeasurement };
}

// Debounce hook for performance optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for performance optimization
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastExecuted.current >= delay) {
        lastExecuted.current = now;
        return callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          lastExecuted.current = Date.now();
          callback(...args);
        }, delay - (now - lastExecuted.current));
      }
    }) as T,
    [callback, delay]
  );
}

// Memory usage monitoring (development only)
export function useMemoryMonitor(componentName: string) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // @ts-ignore - performance.memory is available in Chrome
    if (performance.memory) {
      const interval = setInterval(() => {
        // @ts-ignore
        const memory = performance.memory;
        const used = Math.round((memory.usedJSHeapSize / 1048576) * 100) / 100;
        const total = Math.round((memory.totalJSHeapSize / 1048576) * 100) / 100;
        
        if (used > 50) { // Alert if using more than 50MB
          console.warn(`🧠 ${componentName} memory usage: ${used}MB / ${total}MB`);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [componentName]);
}

import { useState } from 'react';