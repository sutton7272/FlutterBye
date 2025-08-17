// Polyfills for Solana web3.js browser compatibility
import { Buffer } from 'buffer';

// Make Buffer available globally for Solana libraries
if (typeof window !== 'undefined') {
  try {
    (window as any).Buffer = Buffer;
    (window as any).global = window;
    
    // Add additional error suppression for any polyfill-related issues
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Filter out common deployment-related warnings
      const message = args.join(' ');
      if (message.includes('unhandledrejection') || 
          message.includes('Promise') || 
          message.includes('WebSocket')) {
        return; // Silently ignore these
      }
      originalConsoleError.apply(console, args);
    };
  } catch (error) {
    // Silently handle any polyfill setup errors
  }
}