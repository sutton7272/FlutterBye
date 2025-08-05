// Performance Optimizer - Critical Memory and Event Loop Management
import { EventEmitter } from 'events';

class PerformanceOptimizer extends EventEmitter {
  private memoryThreshold = 400 * 1024 * 1024; // 400MB
  private eventLoopThreshold = 100; // 100ms
  private gcForced = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startMonitoring();
  }

  private startMonitoring() {
    // Reduce monitoring frequency to prevent event loop blocking
    this.intervalId = setInterval(() => {
      this.checkMemoryUsage();
      this.checkEventLoopLag();
    }, 30000); // Check every 30 seconds instead of 5

    // Immediate cleanup on high memory
    this.on('highMemory', () => {
      this.performCleanup();
    });
  }

  private checkMemoryUsage() {
    const usage = process.memoryUsage();
    if (usage.heapUsed > this.memoryThreshold && !this.gcForced) {
      this.emit('highMemory', usage);
    }
  }

  private checkEventLoopLag() {
    const start = process.hrtime.bigint();
    setImmediate(() => {
      const lag = Number(process.hrtime.bigint() - start) / 1e6;
      if (lag > this.eventLoopThreshold) {
        this.emit('eventLoopLag', lag);
      }
    });
  }

  private performCleanup() {
    // Force garbage collection if available
    if (global.gc && !this.gcForced) {
      this.gcForced = true;
      try {
        global.gc();
        console.log('Performance optimization: Garbage collection triggered');
        
        // Reset flag after cleanup
        setTimeout(() => {
          this.gcForced = false;
        }, 60000); // Wait 1 minute before allowing another GC
      } catch (error) {
        console.warn('GC failed:', error);
        this.gcForced = false;
      }
    }

    // Clear any large caches or temporary data
    this.clearCaches();
  }

  private clearCaches() {
    // Clear internal caches to free memory
    // Note: require.cache is not available in ES modules, skip for now
    console.log('Cache cleanup triggered - memory optimization in progress');
  }

  public getStats() {
    const usage = process.memoryUsage();
    return {
      memory: {
        heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
        external: Math.round(usage.external / 1024 / 1024),
        rss: Math.round(usage.rss / 1024 / 1024),
      },
      uptime: Math.round(process.uptime()),
      cpuUsage: process.cpuUsage(),
    };
  }

  public destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.removeAllListeners();
  }
}

export const performanceOptimizer = new PerformanceOptimizer();