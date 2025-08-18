import express, { type Express } from "express";
import path from "path";
import fs from "fs";

export function serveStaticProduction(app: Express) {
  // In production, first try to serve from dist (built files)
  const distPath = path.resolve(process.cwd(), "dist");
  
  console.log(`🔍 Checking for production build at: ${distPath}`);
  console.log(`📁 Current working directory: ${process.cwd()}`);
  
  // List current directory contents for debugging
  try {
    const files = fs.readdirSync(process.cwd());
    console.log(`📂 Root directory contents: ${files.join(', ')}`);
  } catch (err) {
    console.log(`❌ Error reading directory: ${err}`);
  }
  
  if (fs.existsSync(distPath)) {
    console.log(`✅ Found dist directory, serving production build`);
    app.use(express.static(distPath));
    
    // Serve index.html for all routes (SPA fallback)
    app.use("*", (_req, res) => {
      const indexPath = path.resolve(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Build files not found");
      }
    });
  } else {
    console.log(`⚠️ Dist directory not found, serving raw client files`);
    
    // Fallback: serve client files directly
    const clientPath = path.resolve(process.cwd(), "client");
    const publicPath = path.resolve(process.cwd(), "public");
    
    if (fs.existsSync(clientPath)) {
      console.log(`📁 Serving from client directory: ${clientPath}`);
      app.use(express.static(clientPath));
    }
    
    if (fs.existsSync(publicPath)) {
      console.log(`📁 Serving from public directory: ${publicPath}`);
      app.use(express.static(publicPath));
    }
    
    // Serve index.html for all routes
    app.use("*", (_req, res) => {
      const indexPath = path.resolve(clientPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(500).send("Application files not found");
      }
    });
  }
}