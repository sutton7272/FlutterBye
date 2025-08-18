import express, { type Express } from "express";
import path from "path";
import fs from "fs";

export function serveStaticProduction(app: Express) {
  // In production, serve static files from the dist directory created by the build process
  const distPath = path.resolve(process.cwd(), "dist");
  
  console.log(`Looking for production build at: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.log(`Dist directory not found, creating fallback...`);
    // If dist doesn't exist, serve the client files directly during AWS build
    const clientPath = path.resolve(process.cwd(), "client");
    app.use(express.static(clientPath));
    
    // Serve index.html for all routes
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(clientPath, "index.html"));
    });
    return;
  }

  console.log(`✅ Serving production build from ${distPath}`);
  app.use(express.static(distPath));

  // Serve index.html for all routes (SPA fallback)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}