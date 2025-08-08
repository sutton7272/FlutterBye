import "./polyfills";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  // Prevent default behavior to avoid console errors
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
