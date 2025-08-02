import { useState, useEffect } from 'react';
import { debounce } from '@/lib/performance';

// Mobile-optimized breakpoints
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useMobileOptimized() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [touchDevice, setTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports touch
    setTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    // Debounced resize handler for better performance
    const debouncedCheck = debounce(checkDevice, 150);
    
    checkDevice(); // Initial check
    window.addEventListener('resize', debouncedCheck);
    window.addEventListener('orientationchange', debouncedCheck);

    return () => {
      window.removeEventListener('resize', debouncedCheck);
      window.removeEventListener('orientationchange', debouncedCheck);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    orientation,
    touchDevice,
    // Utility functions
    getTouchTargetSize: () => touchDevice ? 'min-h-[44px] min-w-[44px]' : '',
    getFontSize: (base: string) => {
      if (isMobile) return `text-sm ${base}`;
      if (isTablet) return `text-base ${base}`;
      return `text-lg ${base}`;
    },
    getSpacing: (base: string) => {
      if (isMobile) return base.replace(/p-(\d+)/, 'p-3').replace(/m-(\d+)/, 'm-2');
      return base;
    }
  };
}

// Hook for mobile-optimized gestures
export function useMobileGestures() {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setSwipeDirection(null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = Math.abs(touch.clientY - touchStart.y);

    // Only register horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > 50 && deltaY < 100) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    }

    setTouchStart(null);
  };

  return {
    swipeDirection,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd
    },
    clearSwipe: () => setSwipeDirection(null)
  };
}

// Hook for mobile-optimized form inputs
export function useMobileInput() {
  const { isMobile, touchDevice } = useMobileOptimized();

  return {
    getInputProps: (type: string = 'text') => ({
      className: `
        ${touchDevice ? 'min-h-[44px]' : 'min-h-[36px]'}
        ${isMobile ? 'text-base' : 'text-sm'}
        transition-all duration-200
        focus:ring-2 focus:ring-electric-blue
        ${touchDevice ? 'touch-manipulation' : ''}
      `,
      autoComplete: isMobile ? 'off' : 'on', // Reduce keyboard suggestions on mobile
      inputMode: type === 'number' ? 'numeric' as const : 'text' as const
    }),
    
    getButtonProps: () => ({
      className: `
        ${touchDevice ? 'min-h-[44px] min-w-[44px]' : 'min-h-[36px]'}
        ${isMobile ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'}
        transition-all duration-200
        active:scale-95
        ${touchDevice ? 'touch-manipulation' : ''}
      `
    })
  };
}

// Hook for mobile-optimized virtualization (for large lists)
export function useMobileVirtualization<T>(
  items: T[],
  itemHeight: number = 60
) {
  const { isMobile } = useMobileOptimized();
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });

  useEffect(() => {
    if (!isMobile) {
      // Show all items on desktop
      setVisibleRange({ start: 0, end: items.length });
      return;
    }

    const handleScroll = debounce(() => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      const start = Math.floor(scrollTop / itemHeight) - 2; // Buffer
      const end = Math.ceil((scrollTop + viewportHeight) / itemHeight) + 2;
      
      setVisibleRange({
        start: Math.max(0, start),
        end: Math.min(items.length, end)
      });
    }, 100);

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items.length, itemHeight, isMobile]);

  return {
    visibleItems: items.slice(visibleRange.start, visibleRange.end),
    visibleRange,
    totalHeight: items.length * itemHeight,
    offsetY: visibleRange.start * itemHeight
  };
}