import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Server } from 'http';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  id: string;
}

export interface ConnectionHealth {
  id: string;
  status: 'connected' | 'connecting' | 'disconnected';
  lastPing: number;
  lastPong: number;
  messagesSent: number;
  messagesReceived: number;
  connectionTime: number;
  errors: number;
}

export interface WebSocketConfig {
  maxConnections: number;
  pingInterval: number;
  pongTimeout: number;
  messageQueueSize: number;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  compressionEnabled: boolean;
  heartbeatEnabled: boolean;
}

export class WebSocketOptimizationService {
  private wss: WebSocketServer | null = null;
  private connections: Map<string, WebSocket> = new Map();
  private connectionHealth: Map<string, ConnectionHealth> = new Map();
  private messageQueue: Map<string, WebSocketMessage[]> = new Map();
  private pingIntervals: Map<string, NodeJS.Timeout> = new Map();

  // Production WebSocket Configuration
  public readonly PRODUCTION_WEBSOCKET_CONFIG: WebSocketConfig = {
    maxConnections: 10000,           // Support up to 10K concurrent connections
    pingInterval: 30000,             // Ping every 30 seconds
    pongTimeout: 5000,               // Wait 5 seconds for pong response
    messageQueueSize: 100,           // Queue up to 100 messages per connection
    reconnectInterval: 1000,         // Start reconnection after 1 second
    maxReconnectAttempts: 5,         // Try up to 5 reconnection attempts
    compressionEnabled: true,        // Enable compression for large messages
    heartbeatEnabled: true           // Enable heartbeat for connection health
  };

  constructor() {
    this.setupOptimizations();
  }

  // Initialize WebSocket server with optimizations
  initializeServer(server: Server): WebSocketServer {
    this.wss = new WebSocketServer({
      server,
      path: '/ws',
      perMessageDeflate: this.PRODUCTION_WEBSOCKET_CONFIG.compressionEnabled ? {
        zlibDeflateOptions: {
          level: 6,
          chunkSize: 1024
        }
      } : false,
      maxPayload: 16 * 1024, // 16KB max message size
      clientTracking: true,
      verifyClient: (info) => this.verifyClient(info)
    });

    this.setupConnectionHandlers();
    this.startHealthMonitoring();

    console.log('🚀 WebSocket server initialized with production optimizations');
    return this.wss;
  }

  // Setup production optimizations
  private setupOptimizations(): void {
    // Set process-level optimizations
    if (process.env.NODE_ENV === 'production') {
      process.setMaxListeners(20); // Increase event listener limit
      
      // Set memory limits for WebSocket operations
      if (global.gc) {
        setInterval(() => {
          global.gc();
        }, 300000); // Run garbage collection every 5 minutes
      }
    }
  }

  // Verify client connections for security
  private verifyClient(info: { req: IncomingMessage; secure: boolean }): boolean {
    // Check connection limits
    if (this.connections.size >= this.PRODUCTION_WEBSOCKET_CONFIG.maxConnections) {
      console.warn('🚫 WebSocket connection rejected: Maximum connections reached');
      return false;
    }

    // Verify origin in production
    if (process.env.NODE_ENV === 'production') {
      const origin = info.req.headers.origin;
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
      
      if (origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
        console.warn(`🚫 WebSocket connection rejected: Invalid origin ${origin}`);
        return false;
      }
    }

    return true;
  }

  // Setup connection event handlers
  private setupConnectionHandlers(): void {
    if (!this.wss) return;

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const connectionId = this.generateConnectionId();
      
      // Store connection
      this.connections.set(connectionId, ws);
      this.messageQueue.set(connectionId, []);
      
      // Initialize connection health tracking
      this.connectionHealth.set(connectionId, {
        id: connectionId,
        status: 'connected',
        lastPing: Date.now(),
        lastPong: Date.now(),
        messagesSent: 0,
        messagesReceived: 0,
        connectionTime: Date.now(),
        errors: 0
      });

      // Setup heartbeat
      if (this.PRODUCTION_WEBSOCKET_CONFIG.heartbeatEnabled) {
        this.startHeartbeat(connectionId, ws);
      }

      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        this.handleMessage(connectionId, data);
      });

      // Handle connection close
      ws.on('close', (code: number, reason: Buffer) => {
        this.handleDisconnection(connectionId, code, reason);
      });

      // Handle errors
      ws.on('error', (error: Error) => {
        this.handleError(connectionId, error);
      });

      // Handle pong responses
      ws.on('pong', () => {
        this.handlePong(connectionId);
      });

      console.log(`🔌 WebSocket client connected: ${connectionId} (${this.connections.size} total)`);
      
      // Send welcome message
      this.sendMessage(connectionId, {
        type: 'connection',
        data: { 
          connectionId, 
          status: 'connected',
          config: {
            pingInterval: this.PRODUCTION_WEBSOCKET_CONFIG.pingInterval,
            compressionEnabled: this.PRODUCTION_WEBSOCKET_CONFIG.compressionEnabled
          }
        },
        timestamp: Date.now(),
        id: this.generateMessageId()
      });
    });

    this.wss.on('error', (error: Error) => {
      console.error('🚨 WebSocket server error:', error);
    });
  }

  // Start heartbeat for connection health monitoring
  private startHeartbeat(connectionId: string, ws: WebSocket): void {
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const health = this.connectionHealth.get(connectionId);
        if (health) {
          const now = Date.now();
          
          // Check if pong was received within timeout
          if (now - health.lastPong > this.PRODUCTION_WEBSOCKET_CONFIG.pongTimeout) {
            console.warn(`💔 WebSocket heartbeat timeout: ${connectionId}`);
            ws.terminate();
            return;
          }

          // Send ping
          ws.ping();
          health.lastPing = now;
          this.connectionHealth.set(connectionId, health);
        }
      } else {
        clearInterval(interval);
        this.pingIntervals.delete(connectionId);
      }
    }, this.PRODUCTION_WEBSOCKET_CONFIG.pingInterval);

    this.pingIntervals.set(connectionId, interval);
  }

  // Handle incoming messages with queuing
  private handleMessage(connectionId: string, data: Buffer): void {
    try {
      const message = JSON.parse(data.toString()) as WebSocketMessage;
      
      // Update connection health
      const health = this.connectionHealth.get(connectionId);
      if (health) {
        health.messagesReceived++;
        this.connectionHealth.set(connectionId, health);
      }

      // Process message based on type
      switch (message.type) {
        case 'ping':
          this.sendMessage(connectionId, {
            type: 'pong',
            data: { timestamp: Date.now() },
            timestamp: Date.now(),
            id: this.generateMessageId()
          });
          break;

        case 'subscribe':
          this.handleSubscription(connectionId, message.data);
          break;

        case 'unsubscribe':
          this.handleUnsubscription(connectionId, message.data);
          break;

        default:
          console.log(`📨 WebSocket message received: ${message.type} from ${connectionId}`);
      }

    } catch (error) {
      console.error(`🚨 WebSocket message parsing error for ${connectionId}:`, error);
      this.handleError(connectionId, error as Error);
    }
  }

  // Handle pong responses
  private handlePong(connectionId: string): void {
    const health = this.connectionHealth.get(connectionId);
    if (health) {
      health.lastPong = Date.now();
      this.connectionHealth.set(connectionId, health);
    }
  }

  // Handle connection errors
  private handleError(connectionId: string, error: Error): void {
    console.error(`🚨 WebSocket error for ${connectionId}:`, error);
    
    const health = this.connectionHealth.get(connectionId);
    if (health) {
      health.errors++;
      this.connectionHealth.set(connectionId, health);
    }
  }

  // Handle client disconnection
  private handleDisconnection(connectionId: string, code: number, reason: Buffer): void {
    console.log(`🔌 WebSocket client disconnected: ${connectionId} (code: ${code}, reason: ${reason})`);
    
    // Cleanup connection
    this.connections.delete(connectionId);
    this.messageQueue.delete(connectionId);
    this.connectionHealth.delete(connectionId);
    
    // Clear ping interval
    const interval = this.pingIntervals.get(connectionId);
    if (interval) {
      clearInterval(interval);
      this.pingIntervals.delete(connectionId);
    }
  }

  // Send message with queuing and retry logic
  sendMessage(connectionId: string, message: WebSocketMessage): boolean {
    const ws = this.connections.get(connectionId);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      // Queue message for later delivery
      this.queueMessage(connectionId, message);
      return false;
    }

    try {
      ws.send(JSON.stringify(message));
      
      // Update connection health
      const health = this.connectionHealth.get(connectionId);
      if (health) {
        health.messagesSent++;
        this.connectionHealth.set(connectionId, health);
      }

      return true;
    } catch (error) {
      console.error(`🚨 Failed to send WebSocket message to ${connectionId}:`, error);
      this.queueMessage(connectionId, message);
      return false;
    }
  }

  // Queue message for delivery when connection is restored
  private queueMessage(connectionId: string, message: WebSocketMessage): void {
    const queue = this.messageQueue.get(connectionId) || [];
    
    // Respect queue size limit
    if (queue.length >= this.PRODUCTION_WEBSOCKET_CONFIG.messageQueueSize) {
      queue.shift(); // Remove oldest message
    }
    
    queue.push(message);
    this.messageQueue.set(connectionId, queue);
  }

  // Process queued messages when connection is restored
  private processQueuedMessages(connectionId: string): void {
    const queue = this.messageQueue.get(connectionId);
    if (!queue || queue.length === 0) return;

    const ws = this.connections.get(connectionId);
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    // Send all queued messages
    while (queue.length > 0) {
      const message = queue.shift();
      if (message && !this.sendMessage(connectionId, message)) {
        // If sending fails, put message back at front of queue
        queue.unshift(message);
        break;
      }
    }
  }

  // Broadcast message to all connected clients
  broadcast(message: WebSocketMessage): void {
    for (const [connectionId] of this.connections) {
      this.sendMessage(connectionId, message);
    }
  }

  // Broadcast to specific group of connections
  broadcastToGroup(connectionIds: string[], message: WebSocketMessage): void {
    for (const connectionId of connectionIds) {
      this.sendMessage(connectionId, message);
    }
  }

  // Handle subscription management
  private handleSubscription(connectionId: string, data: any): void {
    console.log(`📢 WebSocket subscription: ${connectionId} -> ${data.channel}`);
    // Implementation for channel-based subscriptions
  }

  // Handle unsubscription
  private handleUnsubscription(connectionId: string, data: any): void {
    console.log(`📢 WebSocket unsubscription: ${connectionId} -> ${data.channel}`);
    // Implementation for channel-based unsubscriptions
  }

  // Start health monitoring
  private startHealthMonitoring(): void {
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Check health every minute
  }

  // Perform comprehensive health check
  private performHealthCheck(): void {
    const now = Date.now();
    const unhealthyConnections: string[] = [];

    for (const [connectionId, health] of this.connectionHealth) {
      // Check for stale connections
      if (now - health.lastPong > this.PRODUCTION_WEBSOCKET_CONFIG.pongTimeout * 2) {
        unhealthyConnections.push(connectionId);
      }

      // Check for high error rates
      if (health.errors > 10) {
        console.warn(`⚠️ High error rate for connection ${connectionId}: ${health.errors} errors`);
      }
    }

    // Cleanup unhealthy connections
    for (const connectionId of unhealthyConnections) {
      const ws = this.connections.get(connectionId);
      if (ws) {
        console.warn(`🚫 Terminating unhealthy connection: ${connectionId}`);
        ws.terminate();
      }
    }

    // Log health statistics
    if (this.connections.size > 0) {
      console.log(`📊 WebSocket Health: ${this.connections.size} connections, ${unhealthyConnections.length} terminated`);
    }
  }

  // Get connection statistics
  getConnectionStats(): any {
    const totalConnections = this.connections.size;
    const totalMessages = Array.from(this.connectionHealth.values())
      .reduce((sum, health) => sum + health.messagesSent + health.messagesReceived, 0);
    
    return {
      totalConnections,
      totalMessages,
      queuedMessages: Array.from(this.messageQueue.values())
        .reduce((sum, queue) => sum + queue.length, 0),
      config: this.PRODUCTION_WEBSOCKET_CONFIG,
      uptime: process.uptime()
    };
  }

  // Generate unique connection ID
  private generateConnectionId(): string {
    return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate unique message ID
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    console.log('🔄 Shutting down WebSocket server...');
    
    if (this.wss) {
      // Send shutdown notice to all clients
      this.broadcast({
        type: 'shutdown',
        data: { message: 'Server shutting down' },
        timestamp: Date.now(),
        id: this.generateMessageId()
      });

      // Close all connections gracefully
      for (const [connectionId, ws] of this.connections) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1001, 'Server shutdown');
        }
      }

      // Clear all intervals
      for (const interval of this.pingIntervals.values()) {
        clearInterval(interval);
      }

      this.wss.close();
    }

    console.log('✅ WebSocket server shutdown complete');
  }
}

export const websocketOptimization = new WebSocketOptimizationService();