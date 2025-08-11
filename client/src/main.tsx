import "./polyfills";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log('🚀 Starting FlutterBye app...');

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
    </div>
  `;
}
