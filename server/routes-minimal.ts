import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';

// Minimal routes setup for WebSocket testing
export async function registerRoutes(app: Express): Promise<Server> {
  
  // Basic health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Set up WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws',
    perMessageDeflate: false
  });

  console.log('🚀 WebSocket server initialized on /ws path');

  // Handle WebSocket connections
  wss.on('connection', (ws: WebSocket, request) => {
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`✅ WebSocket client connected: ${clientId}`);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'welcome',
      clientId,
      message: 'Connected to Flutterbye Real-time Intelligence',
      serverTime: new Date().toISOString()
    }));

    // Handle incoming messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(`📨 Message from ${clientId}:`, message);
        
        // Echo back confirmation
        ws.send(JSON.stringify({
          type: 'confirmation',
          received: message,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error(`❌ Error parsing message from ${clientId}:`, error);
      }
    });

    // Handle client disconnect
    ws.on('close', (code, reason) => {
      console.log(`🔌 WebSocket client disconnected: ${clientId}, code: ${code}, reason: ${reason}`);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`❌ WebSocket error for client ${clientId}:`, error);
    });
  });

  // Handle WebSocket server errors
  wss.on('error', (error) => {
    console.error('❌ WebSocket Server error:', error);
  });

  return httpServer;
}