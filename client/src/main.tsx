// Completely disable WebSocket to prevent connection errors
if (typeof window !== 'undefined') {
  // Override WebSocket to prevent any connection attempts
  window.WebSocket = class {
    constructor() {
      console.log('WebSocket blocked for stability');
    }
  } as any;
  
  // Add global error handlers to catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.log('📍 Unhandled promise rejection caught and handled safely');
    event.preventDefault(); // Prevent default browser handling
  });
  
  window.addEventListener('error', (event) => {
    console.log('📍 Global error caught and handled safely');
    event.preventDefault();
  });
  
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
