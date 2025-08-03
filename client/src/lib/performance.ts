// Production performance optimizations
export const performanceConfig = {
  // Enable performance monitoring in development
  enablePerfMonitoring: process.env.NODE_ENV === 'development',
  
  // Render performance thresholds
  slowRenderThreshold: 16, // 16ms for 60fps
  verySlowRenderThreshold: 100, // 100ms is very slow
  
  // Memory usage thresholds
  memoryWarningThreshold: 50 * 1024 * 1024, // 50MB
  memoryCriticalThreshold: 100 * 1024 * 1024, // 100MB
  
  // Network performance
  slowNetworkThreshold: 2000, // 2 seconds
  
  // Animation frame budget
  animationFrameBudget: 16.67, // ~60fps
};

// Performance utilities
export class PerformanceManager {
  private static instance: PerformanceManager;
  private renderTimes: Map<string, number> = new Map();
  private memoryCheckInterval?: NodeJS.Timeout;

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  // Track component render performance
  trackRender(componentName: string, renderTime: number) {
    if (!performanceConfig.enablePerfMonitoring) return;

    this.renderTimes.set(componentName, renderTime);

    if (renderTime > performanceConfig.slowRenderThreshold) {
      console.warn(`🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }

    if (renderTime > performanceConfig.verySlowRenderThreshold) {
      console.error(`🚨 Very slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  // Monitor memory usage
  startMemoryMonitoring() {
    if (!performanceConfig.enablePerfMonitoring) return;

    this.memoryCheckInterval = setInterval(() => {
      // @ts-ignore - performance.memory is available in Chrome
      if (performance.memory) {
        // @ts-ignore
        const used = performance.memory.usedJSHeapSize;
        
        if (used > performanceConfig.memoryWarningThreshold) {
          console.warn(`🧠 High memory usage: ${(used / 1024 / 1024).toFixed(2)}MB`);
        }
        
        if (used > performanceConfig.memoryCriticalThreshold) {
          console.error(`🚨 Critical memory usage: ${(used / 1024 / 1024).toFixed(2)}MB`);
        }
      }
    }, 5000);
  }

  stopMemoryMonitoring() {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
  }

  // Get performance report
  getPerformanceReport() {
    if (!performanceConfig.enablePerfMonitoring) return null;

    const report = {
      slowRenders: Array.from(this.renderTimes.entries())
        .filter(([, time]) => time > performanceConfig.slowRenderThreshold)
        .sort(([, a], [, b]) => b - a),
      averageRenderTime: this.getAverageRenderTime(),
      totalComponents: this.renderTimes.size,
    };

    return report;
  }

  private getAverageRenderTime(): number {
    if (this.renderTimes.size === 0) return 0;
    
    const total = Array.from(this.renderTimes.values()).reduce((sum, time) => sum + time, 0);
    return total / this.renderTimes.size;
  }
}

// Initialize performance monitoring
export const perfManager = PerformanceManager.getInstance();

// Production optimizations
export const optimizeForProduction = () => {
  // Disable console logs in production
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
  }

  // Start memory monitoring in development
  if (process.env.NODE_ENV === 'development') {
    perfManager.startMemoryMonitoring();
  }
};

// Bundle optimization helpers
export const lazyImport = <T>(importFn: () => Promise<T>) => {
  return importFn;
};

// Image optimization
export const optimizeImage = (src: string, options?: { width?: number; height?: number; quality?: number }) => {
  // In a real app, this would integrate with image optimization service
  return src;
};

// Network request optimization
export const optimizeNetworkRequest = async (url: string, options?: RequestInit) => {
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, {
      ...options,
      // Add cache headers for static resources
      headers: {
        ...options?.headers,
        'Cache-Control': 'public, max-age=31536000',
      },
    });

    const endTime = performance.now();
    const requestTime = endTime - startTime;

    if (requestTime > performanceConfig.slowNetworkThreshold) {
      console.warn(`🌐 Slow network request: ${url} took ${requestTime.toFixed(2)}ms`);
    }

    return response;
  } catch (error) {
    const endTime = performance.now();
    console.error(`🚨 Network request failed: ${url} (${(endTime - startTime).toFixed(2)}ms)`, error);
    throw error;
  }
};

// Initialize optimizations
if (typeof window !== 'undefined') {
  optimizeForProduction();
}