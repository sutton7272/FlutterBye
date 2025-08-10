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
  // Only suppress WebSocket and known non-critical rejections
  if (e.reason?.message?.includes('WebSocket') || 
      e.reason?.message?.includes('Failed to construct') ||
      e.reason?.name === 'AbortError') {
    e.preventDefault();
    console.log('🛡️ Suppressed non-critical rejection:', e.reason?.message);
    return false;
  }
  
  // Allow other rejections through for proper error handling
  console.log('🔍 Unhandled rejection:', e.reason);
});

// Ensure DOM is ready before rendering
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Root container not found");
}
