/**
 * Global error handling utilities to prevent unhandled rejections
 * from triggering the React error boundary during navigation
 */

// Global promise rejection handler
export function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('🚨 Unhandled promise rejection caught:', event.reason);
    console.warn('🚨 Promise rejection stack:', event.reason?.stack);
    console.warn('🚨 Promise rejection details:', JSON.stringify(event.reason, null, 2));
    
    // Check if it's a navigation-related error that we can safely ignore
    const reason = event.reason;
    if (reason && typeof reason === 'object') {
      // AbortError from cancelled fetch requests during navigation
      if (reason.name === 'AbortError') {
        console.log('📍 Navigation-related AbortError caught and handled');
        event.preventDefault();
        return;
      }
      
      // Network errors during navigation
      if (reason.message && (
        reason.message.includes('fetch') ||
        reason.message.includes('network') ||
        reason.message.includes('Failed to fetch') ||
        reason.message.includes('TypeError: Failed to fetch')
      )) {
        console.log('📍 Network-related error during navigation caught and handled');
        event.preventDefault();
        return;
      }

      // React Query errors that are already handled by the library
      if (reason.message && (
        reason.message.includes('401:') ||
        reason.message.includes('404:') ||
        reason.message.includes('500:')
      )) {
        console.log('📍 API error caught and handled by React Query');
        event.preventDefault();
        return;
      }

      // WebSocket errors that should not trigger error boundary
      if (reason.message && (
        reason.message.includes('WebSocket') ||
        reason.message.includes('Failed to construct') ||
        reason.message.includes('SyntaxError')
      )) {
        console.log('📍 WebSocket error caught and handled');
        event.preventDefault();
        return;
      }
    }
    
    // Prevent all unhandled rejections from triggering error boundary in development
    // These are typically logging/monitoring related and don't affect functionality
    console.error('🔥 Unhandled rejection prevented from triggering error boundary:', reason);
    event.preventDefault();
  });

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    console.warn('🚨 Global error caught:', event.error);
    
    // Check for React-related errors that shouldn't crash the app
    if (event.error && event.error.message) {
      const message = event.error.message;
      
      // Ignore certain non-critical errors
      if (
        message.includes('ResizeObserver loop limit exceeded') ||
        message.includes('Non-Error promise rejection captured') ||
        message.includes('Script error')
      ) {
        console.log('📍 Non-critical error ignored:', message);
        event.preventDefault();
        return;
      }
    }
  });
}

// Wrapper for async functions to handle errors gracefully
export function safeAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R | void> {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('🔥 Safe async error:', error);
      // Return void instead of throwing to prevent unhandled rejection
      return;
    }
  };
}

// Utility to create a debounced error handler
export function createDebouncedErrorHandler(
  handler: (error: any) => void,
  delay: number = 1000
) {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (error: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      handler(error);
      timeoutId = null;
    }, delay);
  };
}