/**
 * Performance optimization utilities for Flutterbye platform
 */

// Image optimization utilities
export const optimizeImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate optimal dimensions
      const { width, height } = calculateOptimalDimensions(img.width, img.height, maxWidth);
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve!, 'image/webp', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const calculateOptimalDimensions = (originalWidth: number, originalHeight: number, maxWidth: number) => {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }
  
  const ratio = originalHeight / originalWidth;
  return {
    width: maxWidth,
    height: Math.round(maxWidth * ratio)
  };
};

// Lazy loading intersection observer
export const createLazyObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });
};

// Performance monitoring
export const performanceMonitor = {
  // Core Web Vitals tracking
  trackLCP: () => {
    if ('web-vital' in window) {
      // Track Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    }
  },

  trackFID: () => {
    if ('web-vital' in window) {
      // Track First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });
    }
  },

  trackCLS: () => {
    if ('web-vital' in window) {
      // Track Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  },

  // Bundle size monitoring
  trackBundleSize: () => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => r.name.includes('.js'));
      const totalSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      console.log('Total JS Bundle Size:', (totalSize / 1024).toFixed(2) + 'KB');
    }
  }
};

// Memory management
export const memoryManager = {
  cleanupUnusedImages: () => {
    // Clean up blob URLs to prevent memory leaks
    const images = document.querySelectorAll('img[src^="blob:"]');
    images.forEach((img: any) => {
      if (!img.complete) return;
      const oldSrc = img.src;
      img.src = '';
      URL.revokeObjectURL(oldSrc);
    });
  },

  checkMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};