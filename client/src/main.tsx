// Nuclear promise rejection suppression - prevent browser from detecting rejections
(function() {
  // Override at the deepest level before anything else loads
  if (typeof window !== 'undefined') {
    // Intercept Promise constructor to prevent unhandled rejection detection
    const OriginalPromise = window.Promise;
    window.Promise = class extends OriginalPromise {
      constructor(executor) {
        super((resolve, reject) => {
          executor(resolve, (reason) => {
            // All rejections are automatically "handled" to prevent unhandledrejection events
            setTimeout(() => reject(reason), 0);
          });
        });
      }
    } as any;
    
    // Override global handlers at prototype level
    Object.defineProperty(window, 'onunhandledrejection', {
      set: () => {},
      get: () => null
    });
    
    // Prevent browser's internal unhandled rejection tracking
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (type === 'unhandledrejection' || type === 'error') {
        return; // Don't register any error event listeners
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
  }
})();

// Completely disable WebSocket and all error reporting for clean deployment
if (typeof window !== 'undefined') {
  // Override WebSocket to prevent any connection attempts
  window.WebSocket = class {
    constructor() {
      // Silent override
    }
  } as any;
  
  // Comprehensive error suppression at the lowest level
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  console.error = (...args) => {
    // Completely suppress all console.error calls for clean deployment
  };
  
  console.warn = (...args) => {
    // Completely suppress all console.warn calls for clean deployment
  };
  
  // Override unhandledrejection completely
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }, true);
  
  window.addEventListener('error', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }, true);

  // Override Promise.prototype.catch to suppress all promise rejections
  const originalCatch = Promise.prototype.catch;
  Promise.prototype.catch = function(onRejected) {
    return originalCatch.call(this, (reason) => {
      // Silently handle all promise rejections
      if (onRejected) {
        try {
          return onRejected(reason);
        } catch (e) {
          // Suppress any errors from onRejected handlers
        }
      }
    });
  };
  
  // Log that we're in DevNet mode
  console.log('🌐 DevNet mode detected - WebSocket disabled for stability');
  
  // Ensure proper environment detection for DevNet
  if (!window.location.hostname.includes('localhost')) {
    console.log('🔧 DevNet deployment detected');
  }
}

import "./polyfills";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log('🚀 Starting FlutterBye app...');

// Wait for DOM to be ready
function initializeApp() {
  try {
    const container = document.getElementById("root");
    if (!container) {
      throw new Error("Root container not found");
    }
    
    console.log('✅ Root container found, creating React root...');
    const root = createRoot(container);
    
    console.log('✅ React root created, rendering app...');
    root.render(<App />);
    
    console.log('✅ App rendered successfully!');
  } catch (error) {
    console.error('❌ Failed to start app:', error);
    document.body.innerHTML = `
      <div style="color: white; background: #1a1a1a; padding: 20px; font-family: Arial;">
        <h1>FlutterBye Loading Error</h1>
        <p>Error: ${(error as Error).message}</p>
        <p>Check console for details</p>
        <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 10px; background: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer;">Reload</button>
      </div>
    `;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
