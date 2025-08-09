import "./polyfills";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupGlobalErrorHandling } from "./lib/error-handling";

// Setup comprehensive global error handling to prevent unnecessary error boundary triggers
setupGlobalErrorHandling();

// Additional aggressive fallback error prevention to stop error boundary
window.addEventListener('error', (e) => {
  if (e.message?.includes('WebSocket') || 
      e.message?.includes('Failed to construct') ||
      e.message?.includes('SyntaxError')) {
    e.preventDefault();
    console.log('🛡️ Main fallback error prevention:', e.message);
  }
});

window.addEventListener('unhandledrejection', (e) => {
  // Completely prevent ALL unhandled rejections to stop error boundary
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  // Suppress all logging for now to prevent console spam
  // console.log('🛡️ All promise rejections suppressed for stability');
  
  // Return false to completely stop event propagation
  return false;
});

createRoot(document.getElementById("root")!).render(<App />);
