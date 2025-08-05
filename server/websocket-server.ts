import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface ClientConnection {
  ws: WebSocket;
  id: string;
  connectedAt: Date;
  lastActivity: Date;
}

export class FlutterbeyeWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  private heartbeatInterval!: NodeJS.Timeout;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws',
      perMessageDeflate: false
    });

    this.setupWebSocketServer();
    this.startHeartbeat();

    console.log('🚀 WebSocket server initialized on /ws path');
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, request) => {
      const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const clientInfo: ClientConnection = {
        ws,
        id: clientId,
        connectedAt: new Date(),
        lastActivity: new Date()
      };

      this.clients.set(clientId, clientInfo);
      console.log(`✅ WebSocket client connected: ${clientId} (Total: ${this.clients.size})`);

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'welcome',
        clientId,
        message: 'Connected to Flutterbye Real-time Intelligence',
        serverTime: new Date().toISOString(),
        features: ['live_data', 'ai_updates', 'market_alerts', 'system_status']
      });

      // Handle incoming messages
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
          
          // Update last activity
          const client = this.clients.get(clientId);
          if (client) {
            client.lastActivity = new Date();
          }
        } catch (error) {
          console.error(`❌ Error parsing WebSocket message from ${clientId}:`, error);
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`🔌 WebSocket client disconnected: ${clientId} (Remaining: ${this.clients.size})`);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`❌ WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });

      // Send initial platform stats
      setTimeout(() => {
        this.sendPlatformStats(clientId);
      }, 1000);
    });
  }

  private handleClientMessage(clientId: string, message: any) {
    console.log(`📨 Message from ${clientId}:`, message);

    switch (message.type) {
      case 'connection':
        this.sendToClient(clientId, {
          type: 'connection_ack',
          message: 'Connection acknowledged',
          timestamp: new Date().toISOString()
        });
        break;

      case 'subscribe':
        this.handleSubscription(clientId, message.data);
        break;

      case 'unsubscribe':
        this.handleUnsubscription(clientId, message.data);
        break;

      case 'ping':
        this.sendToClient(clientId, {
          type: 'pong',
          timestamp: new Date().toISOString()
        });
        break;

      case 'request_stats':
        this.sendPlatformStats(clientId);
        break;

      default:
        console.log(`🤔 Unknown message type from ${clientId}:`, message.type);
    }
  }

  private handleSubscription(clientId: string, data: any) {
    console.log(`📡 Client ${clientId} subscribing to:`, data);
    
    // Send confirmation
    this.sendToClient(clientId, {
      type: 'subscription_confirmed',
      subscription: data,
      message: `Subscribed to ${data.channel || 'unknown channel'}`,
      timestamp: new Date().toISOString()
    });
  }

  private handleUnsubscription(clientId: string, data: any) {
    console.log(`📡 Client ${clientId} unsubscribing from:`, data);
    
    // Send confirmation
    this.sendToClient(clientId, {
      type: 'unsubscription_confirmed',
      subscription: data,
      message: `Unsubscribed from ${data.channel || 'unknown channel'}`,
      timestamp: new Date().toISOString()
    });
  }

  private sendPlatformStats(clientId: string) {
    const stats = {
      type: 'platform_stats',
      data: {
        connectedClients: this.clients.size,
        serverUptime: process.uptime(),
        memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        timestamp: new Date().toISOString(),
        features: {
          realTimeData: true,
          aiIntelligence: true,
          multiChain: true,
          enterpriseReady: true
        }
      },
      timestamp: new Date().toISOString()
    };

    this.sendToClient(clientId, stats);
  }

  private sendToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`❌ Error sending message to ${clientId}:`, error);
        this.clients.delete(clientId);
      }
    }
  }

  // Broadcast to all connected clients
  public broadcast(message: any) {
    const messageStr = JSON.stringify({
      ...message,
      timestamp: new Date().toISOString()
    });

    let successCount = 0;
    let errorCount = 0;

    this.clients.forEach((client, clientId) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(messageStr);
          successCount++;
        } catch (error) {
          console.error(`❌ Error broadcasting to ${clientId}:`, error);
          this.clients.delete(clientId);
          errorCount++;
        }
      } else {
        this.clients.delete(clientId);
        errorCount++;
      }
    });

    if (successCount > 0) {
      console.log(`📡 Broadcast sent to ${successCount} clients${errorCount > 0 ? ` (${errorCount} errors)` : ''}`);
    }
  }

  // Send live market data updates
  public sendMarketUpdate(data: any) {
    this.broadcast({
      type: 'market_update',
      data,
      category: 'live_data'
    });
  }

  // Send AI analysis updates
  public sendAIUpdate(data: any) {
    this.broadcast({
      type: 'ai_update',
      data,
      category: 'intelligence'
    });
  }

  // Send system alerts
  public sendSystemAlert(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    this.broadcast({
      type: 'system_alert',
      data: {
        message,
        level,
        timestamp: new Date().toISOString()
      },
      category: 'system'
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      // Clean up stale connections
      const now = new Date();
      const staleConnections: string[] = [];

      this.clients.forEach((client, clientId) => {
        const timeSinceActivity = now.getTime() - client.lastActivity.getTime();
        
        // Remove connections inactive for more than 5 minutes
        if (timeSinceActivity > 5 * 60 * 1000) {
          staleConnections.push(clientId);
        } else if (client.ws.readyState === WebSocket.OPEN) {
          // Send heartbeat to active connections
          try {
            client.ws.send(JSON.stringify({
              type: 'heartbeat',
              timestamp: new Date().toISOString()
            }));
          } catch (error) {
            staleConnections.push(clientId);
          }
        } else {
          staleConnections.push(clientId);
        }
      });

      // Clean up stale connections
      staleConnections.forEach(clientId => {
        this.clients.delete(clientId);
        console.log(`🧹 Cleaned up stale connection: ${clientId}`);
      });

    }, 30000); // Every 30 seconds
  }

  public getStats() {
    return {
      connectedClients: this.clients.size,
      clients: Array.from(this.clients.entries()).map(([id, client]) => ({
        id,
        connectedAt: client.connectedAt,
        lastActivity: client.lastActivity,
        status: client.ws.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'
      }))
    };
  }

  public close() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.close();
      }
    });
    
    this.wss.close();
    console.log('🔌 WebSocket server closed');
  }
}

export default FlutterbeyeWebSocketServer;