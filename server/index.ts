import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
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

  // Test deployment endpoint
  app.get('/test-deploy', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Flutterbye Deployment Test</title>
          <style>
              body { 
                  background: #000; 
                  color: #fff; 
                  font-family: Arial; 
                  text-align: center; 
                  padding: 50px;
              }
              .test-box { 
                  background: red; 
                  padding: 20px; 
                  margin: 20px;
                  border-radius: 10px;
              }
              .marketing-section {
                  background: linear-gradient(to right, #3b82f6, #10b981);
                  padding: 40px;
                  margin: 20px;
                  border-radius: 15px;
              }
          </style>
      </head>
      <body>
          <div class="test-box">
              DEPLOYMENT TEST - SERVER IS WORKING! Time: ${new Date().toISOString()}
          </div>
          
          <div class="marketing-section">
              <h1>🚀 AI MARKETING REVOLUTION - LIVE NOW</h1>
              <p>Revolutionary AI-powered blog content powered by Flutterbye Intelligence</p>
              <h2>The Future of Crypto Marketing: AI-Powered Precision Targeting</h2>
              <p>Discover how Flutterbye is revolutionizing crypto marketing.</p>
          </div>
          
          <p>Port: ${process.env.PORT || 5000} | Environment: ${process.env.NODE_ENV || 'development'}</p>
          <p>URL: ${req.protocol}://${req.get('host')}${req.originalUrl}</p>
          <p><a href="/" style="color: #3b82f6;">Go to Homepage (React App)</a></p>
          <p><a href="/?v=${Date.now()}" style="color: #10b981;">Force Refresh Homepage</a></p>
      </body>
      </html>
    `);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
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
