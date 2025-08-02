import { useMobileOptimized, useMobileGestures, useMobileInput } from '@/hooks/use-mobile-optimized';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Smartphone, Tablet, Monitor } from 'lucide-react';

// Mobile-optimized navigation component
export function MobileNavigation({ children }: { children: React.ReactNode }) {
  const { isMobile, touchDevice, getTouchTargetSize } = useMobileOptimized();
  const { swipeDirection, touchHandlers, clearSwipe } = useMobileGestures();

  // Handle swipe navigation
  React.useEffect(() => {
    if (swipeDirection) {
      // Implement swipe navigation logic
      if (swipeDirection === 'left') {
        // Navigate to next page
      } else if (swipeDirection === 'right') {
        // Navigate to previous page
      }
      clearSwipe();
    }
  }, [swipeDirection, clearSwipe]);

  return (
    <div 
      {...touchHandlers}
      className={`
        ${isMobile ? 'touch-manipulation' : ''}
        ${touchDevice ? 'select-none' : ''}
      `}
    >
      {children}
    </div>
  );
}

// Mobile-optimized form component
export function MobileOptimizedForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const { isMobile, getFontSize, getSpacing } = useMobileOptimized();
  const { getInputProps, getButtonProps } = useMobileInput();

  return (
    <Card className={`${getSpacing('p-6')} ${isMobile ? 'rounded-lg' : 'rounded-xl'}`}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className={`block ${getFontSize('font-medium')} mb-2`}>
            Message (27 characters max)
          </label>
          <Input
            {...getInputProps('text')}
            maxLength={27}
            placeholder="StakeNowForYield"
          />
        </div>
        
        <div>
          <label className={`block ${getFontSize('font-medium')} mb-2`}>
            Value Attachment
          </label>
          <Input
            {...getInputProps('number')}
            placeholder="0.1"
            step="0.001"
          />
        </div>

        <Button
          {...getButtonProps()}
          type="submit"
          className="w-full bg-gradient-to-r from-electric-blue to-electric-green"
        >
          Create Token
        </Button>
      </form>
    </Card>
  );
}

// Touch-optimized button grid
export function TouchButtonGrid({ buttons }: { buttons: Array<{ label: string; action: () => void; icon?: React.ReactNode }> }) {
  const { touchDevice, getTouchTargetSize } = useMobileOptimized();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={button.action}
          variant="outline"
          className={`
            ${getTouchTargetSize()}
            ${touchDevice ? 'active:scale-95' : 'hover:scale-105'}
            transition-transform duration-150
            flex flex-col gap-2 p-4
          `}
        >
          {button.icon}
          <span className="text-sm font-medium">{button.label}</span>
        </Button>
      ))}
    </div>
  );
}

// Mobile-optimized data table
export function MobileDataTable({ 
  data, 
  columns 
}: { 
  data: any[]; 
  columns: Array<{ key: string; label: string; render?: (value: any) => React.ReactNode }>; 
}) {
  const { isMobile } = useMobileOptimized();

  if (isMobile) {
    // Card-based layout for mobile
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <Card key={index} className="p-4">
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between items-center py-1">
                <span className="text-sm font-medium text-gray-600">
                  {column.label}:
                </span>
                <span className="text-sm">
                  {column.render ? column.render(item[column.key]) : item[column.key]}
                </span>
              </div>
            ))}
          </Card>
        ))}
      </div>
    );
  }

  // Traditional table for desktop
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th key={column.key} className="text-left p-3 font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="p-3">
                  {column.render ? column.render(item[column.key]) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Device indicator for development
export function DeviceIndicator() {
  const { isMobile, isTablet, isDesktop, touchDevice, orientation } = useMobileOptimized();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/80 text-white p-2 rounded text-xs font-mono">
      <div className="flex items-center gap-2">
        {isMobile && <Smartphone className="w-3 h-3" />}
        {isTablet && <Tablet className="w-3 h-3" />}
        {isDesktop && <Monitor className="w-3 h-3" />}
        
        <span>
          {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
        </span>
        
        {touchDevice && <Badge variant="secondary" className="text-xs">Touch</Badge>}
        
        <span className="text-gray-400">
          {orientation}
        </span>
      </div>
    </div>
  );
}

// Swipe indicator for mobile navigation
export function SwipeIndicator({ onSwipeLeft, onSwipeRight }: { onSwipeLeft?: () => void; onSwipeRight?: () => void }) {
  const { swipeDirection, clearSwipe } = useMobileGestures();
  const { isMobile } = useMobileOptimized();

  React.useEffect(() => {
    if (swipeDirection === 'left' && onSwipeLeft) {
      onSwipeLeft();
      clearSwipe();
    } else if (swipeDirection === 'right' && onSwipeRight) {
      onSwipeRight();
      clearSwipe();
    }
  }, [swipeDirection, onSwipeLeft, onSwipeRight, clearSwipe]);

  if (!isMobile) return null;

  return (
    <div className="flex justify-center gap-4 py-2 text-gray-400">
      {onSwipeRight && (
        <div className="flex items-center gap-1 text-xs">
          <ChevronLeft className="w-3 h-3" />
          <span>Swipe right</span>
        </div>
      )}
      {onSwipeLeft && (
        <div className="flex items-center gap-1 text-xs">
          <span>Swipe left</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );
}

// Import React for useEffect
import React from 'react';