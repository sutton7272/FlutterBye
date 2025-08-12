import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
const app = express();

// Performance headers middleware
app.use((req, res, next) => {
  // Security headers for production - CSP temporarily disabled for debugging
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Performance headers
  res.setHeader('X-DNS-Prefetch-Control', 'on');
  res.setHeader('X-Powered-By', 'Flutterbye Enterprise');
  
  // Cache control for static assets
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.url.match(/\.(html|json)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  
  next();
});

// CORS configuration for DevNet deployment
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://2fcdd792-8ec1-4b56-bf3f-adca95719b09-00-myci2lu9eu0e.worf.replit.dev',
    'http://localhost:5000',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin || '')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    
    // Handle specific payload too large error
    if (err.type === 'entity.too.large') {
      message = "File too large. Maximum size is 50MB.";
    }

    res.status(status).json({ message });
    console.error('Server error:', err);
  });

  // Add fallback route for DevNet deployment
  app.get('/fallback', (req, res) => {
    res.sendFile(path.resolve(import.meta.dirname, '..', 'public', 'index.html'));
  });

  // Add catch-all route for DevNet to prevent 404s
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // For DevNet deployment, serve the fallback HTML for all non-API routes
    if (process.env.REPLIT_DOMAINS) {
      res.sendFile(path.resolve(import.meta.dirname, '..', 'public', 'index.html'));
    } else {
      next();
    }
  });

  // For DevNet deployment, always use Vite for proper development serving
  // Only use static serving for true production builds
  const useStaticServing = process.env.NODE_ENV === 'production' && process.env.BUILD_STATIC === 'true';
  
  if (useStaticServing) {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
