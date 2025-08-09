import "./polyfills";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupGlobalErrorHandling } from "./lib/error-handling";

// Setup global error handling to prevent unnecessary error boundary triggers
setupGlobalErrorHandling();

createRoot(document.getElementById("root")!).render(<App />);
