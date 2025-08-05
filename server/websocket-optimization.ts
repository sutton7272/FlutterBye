// WebSocket Connection Optimization for Production
import WebSocket from 'ws';
import { EventEmitter } from 'events';

export interface WebSocketConfig {
  maxConnections: number;
  heartbeatInterval: number;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  connectionTimeout: number;
  messageQueueSize: number;
  healthCheckInterval: number;
}

export interface ConnectionHealth {
  isHealthy: boolean;
  latency: number;
  uptime: number;
  messagesSent: number;
  messagesReceived: number;
  reconnectCount: number;
  lastError?: string;
}

// Production WebSocket Configuration
export const PRODUCTION_WEBSOCKET_CONFIG: WebSocketConfig = {
  maxConnections: 10000,
  heartbeatInterval: 30000,    // 30 seconds
  reconnectInterval: 1000,     // Start with 1 second
  maxReconnectAttempts: 10,
  connectionTimeout: 10000,    // 10 seconds
  messageQueueSize: 1000,
  healthCheckInterval: 60000   // 1 minute
};

export class OptimizedWebSocketConnection extends EventEmitter {
  private ws: WebSocket | null = null;
  private url: string;
  private config: WebSocketConfig;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private connectionStartTime: number = 0;
  private messageQueue: string[] = [];
  private health: ConnectionHealth;

  constructor(url: string, config: WebSocketConfig = PRODUCTION_WEBSOCKET_CONFIG) {
    super();
    this.url = url;
    this.config = config;
    this.health = {
      isHealthy: false,
      latency: 0,
      uptime: 0,
      messagesSent: 0,
      messagesReceived: 0,
      reconnectCount: 0
    };
  }

  // Connect with enhanced error handling and retry logic
  async connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    this.connectionStartTime = Date.now();

    try {
      console.log(`🚀 Connecting to WebSocket: ${this.url}`);
      
      this.ws = new WebSocket(this.url, {
        handshakeTimeout: this.config.connectionTimeout,
        perMessageDeflate: true,
        maxPayload: 1024 * 1024 // 1MB max message size
      });

      this.setupEventHandlers();
      
      // Connection timeout
      const connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          this.ws.terminate();
          this.handleConnectionError(new Error('Connection timeout'));
        }
      }, this.config.connectionTimeout);

      this.ws.addEventListener('open', () => {
        clearTimeout(connectionTimeout);
        this.onConnected();
      });

    } catch (error) {
      this.isConnecting = false;
      this.handleConnectionError(error as Error);
    }
  }

  // Enhanced event handler setup
  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.addEventListener('open', () => this.onConnected());
    this.ws.addEventListener('close', (event) => this.onDisconnected(event));
    this.ws.addEventListener('error', (error) => this.onError(error));
    this.ws.addEventListener('message', (event) => this.onMessage(event));
  }

  // Connection established
  private onConnected(): void {
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.health.isHealthy = true;
    this.health.uptime = Date.now() - this.connectionStartTime;
    
    console.log('✅ WebSocket connected successfully');
    this.emit('connected');
    
    this.startHeartbeat();
    this.startHealthCheck();
    this.processMessageQueue();
  }

  // Connection lost
  private onDisconnected(event: WebSocket.CloseEvent): void {
    this.cleanup();
    this.health.isHealthy = false;
    
    console.log(`🔌 WebSocket disconnected: ${event.code} ${event.reason}`);
    this.emit('disconnected', event.code, event.reason);
    
    // Attempt reconnection if not intentionally closed
    if (event.code !== 1000 && this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  // Error handling
  private onError(error: Event): void {
    const errorMessage = `WebSocket error: ${error.type}`;
    this.health.lastError = errorMessage;
    
    console.error('❌ WebSocket error:', error);
    this.emit('error', error);
  }

  // Message received
  private onMessage(event: WebSocket.MessageEvent): void {
    this.health.messagesReceived++;
    
    try {
      const data = JSON.parse(event.data.toString());
      
      // Handle heartbeat pong
      if (data.type === 'pong') {
        this.health.latency = Date.now() - data.timestamp;
        return;
      }
      
      this.emit('message', data);
    } catch (error) {
      console.error('❌ Error parsing WebSocket message:', error);
    }
  }

  // Enhanced reconnection with exponential backoff
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    this.health.reconnectCount++;
    
    // Exponential backoff with jitter
    const baseDelay = this.config.reconnectInterval;
    const exponentialDelay = baseDelay * Math.pow(2, Math.min(this.reconnectAttempts - 1, 6));
    const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
    const delay = Math.min(exponentialDelay + jitter, 30000); // Max 30 seconds
    
    console.log(`🔄 Attempting to reconnect in ${Math.round(delay)}ms (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.reconnectAttempts <= this.config.maxReconnectAttempts) {
        this.connect();
      }
    }, delay);
  }

  // Connection error handling
  private handleConnectionError(error: Error): void {
    this.isConnecting = false;
    this.health.lastError = error.message;
    
    console.error('❌ WebSocket connection error:', error.message);
    this.emit('error', error);
    
    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  // Send message with queue fallback
  send(data: any): boolean {
    const message = JSON.stringify(data);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(message);
        this.health.messagesSent++;
        return true;
      } catch (error) {
        console.error('❌ Error sending WebSocket message:', error);
        this.queueMessage(message);
        return false;
      }
    } else {
      this.queueMessage(message);
      return false;
    }
  }

  // Queue message for later delivery
  private queueMessage(message: string): void {
    if (this.messageQueue.length < this.config.messageQueueSize) {
      this.messageQueue.push(message);
    } else {
      // Remove oldest message if queue is full
      this.messageQueue.shift();
      this.messageQueue.push(message);
      console.warn('⚠️ WebSocket message queue is full, removing oldest message');
    }
  }

  // Process queued messages
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        try {
          this.ws.send(message);
          this.health.messagesSent++;
        } catch (error) {
          console.error('❌ Error sending queued message:', error);
          // Put message back at front of queue
          this.messageQueue.unshift(message);
          break;
        }
      }
    }
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({
          type: 'ping',
          timestamp: Date.now()
        });
      }
    }, this.config.heartbeatInterval);
  }

  // Start periodic health checks
  private startHealthCheck(): void {
    this.healthCheckTimer = setInterval(() => {
      this.updateHealthMetrics();
      this.emit('health', this.getHealth());
    }, this.config.healthCheckInterval);
  }

  // Update health metrics
  private updateHealthMetrics(): void {
    if (this.connectionStartTime > 0) {
      this.health.uptime = Date.now() - this.connectionStartTime;
    }
    
    this.health.isHealthy = this.ws !== null && 
                           this.ws.readyState === WebSocket.OPEN &&
                           this.health.latency < 5000; // Consider unhealthy if latency > 5s
  }

  // Get current connection health
  getHealth(): ConnectionHealth {
    return { ...this.health };
  }

  // Cleanup resources
  private cleanup(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }

  // Graceful disconnect
  disconnect(): void {
    this.reconnectAttempts = this.config.maxReconnectAttempts; // Prevent reconnection
    this.cleanup();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  // Get queued message count
  getQueuedMessageCount(): number {
    return this.messageQueue.length;
  }
}

// WebSocket Server Optimization
export class OptimizedWebSocketServer extends EventEmitter {
  private wss: WebSocket.Server;
  private connections: Map<string, WebSocket> = new Map();
  private connectionHealth: Map<string, ConnectionHealth> = new Map();
  private config: WebSocketConfig;

  constructor(server: any, config: WebSocketConfig = PRODUCTION_WEBSOCKET_CONFIG) {
    super();
    this.config = config;
    
    this.wss = new WebSocket.Server({
      server,
      path: '/ws',
      perMessageDeflate: true,
      maxPayload: 1024 * 1024, // 1MB max message size
      clientTracking: true
    });

    this.setupServerHandlers();
    this.startHealthMonitoring();
  }

  private setupServerHandlers(): void {
    this.wss.on('connection', (ws, request) => {
      const connectionId = this.generateConnectionId();
      const clientIP = request.socket.remoteAddress || 'unknown';
      
      console.log(`🔗 New WebSocket connection: ${connectionId} from ${clientIP}`);
      
      // Check connection limits
      if (this.connections.size >= this.config.maxConnections) {
        console.warn(`⚠️ Connection limit reached (${this.config.maxConnections}), rejecting new connection`);
        ws.close(1013, 'Server overloaded');
        return;
      }

      this.connections.set(connectionId, ws);
      this.connectionHealth.set(connectionId, {
        isHealthy: true,
        latency: 0,
        uptime: Date.now(),
        messagesSent: 0,
        messagesReceived: 0,
        reconnectCount: 0
      });

      this.setupConnectionHandlers(ws, connectionId);
    });

    this.wss.on('error', (error) => {
      console.error('❌ WebSocket server error:', error);
      this.emit('error', error);
    });
  }

  private setupConnectionHandlers(ws: WebSocket, connectionId: string): void {
    ws.on('message', (message) => {
      const health = this.connectionHealth.get(connectionId);
      if (health) {
        health.messagesReceived++;
      }

      try {
        const data = JSON.parse(message.toString());
        this.handleMessage(connectionId, data);
      } catch (error) {
        console.error(`❌ Error parsing message from ${connectionId}:`, error);
      }
    });

    ws.on('close', (code, reason) => {
      console.log(`🔌 WebSocket disconnected: ${connectionId} (${code} ${reason})`);
      this.connections.delete(connectionId);
      this.connectionHealth.delete(connectionId);
    });

    ws.on('error', (error) => {
      console.error(`❌ WebSocket error for ${connectionId}:`, error);
      const health = this.connectionHealth.get(connectionId);
      if (health) {
        health.lastError = error.message;
        health.isHealthy = false;
      }
    });

    // Send welcome message
    this.sendToConnection(connectionId, {
      type: 'welcome',
      connectionId,
      timestamp: Date.now()
    });
  }

  private handleMessage(connectionId: string, data: any): void {
    if (data.type === 'ping') {
      // Respond to ping with pong
      this.sendToConnection(connectionId, {
        type: 'pong',
        timestamp: data.timestamp
      });
      return;
    }

    this.emit('message', connectionId, data);
  }

  // Send message to specific connection
  sendToConnection(connectionId: string, data: any): boolean {
    const ws = this.connections.get(connectionId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(data));
        
        const health = this.connectionHealth.get(connectionId);
        if (health) {
          health.messagesSent++;
        }
        
        return true;
      } catch (error) {
        console.error(`❌ Error sending message to ${connectionId}:`, error);
        return false;
      }
    }
    return false;
  }

  // Broadcast message to all connections
  broadcast(data: any, excludeConnectionId?: string): number {
    const message = JSON.stringify(data);
    let sentCount = 0;

    for (const [connectionId, ws] of this.connections) {
      if (excludeConnectionId && connectionId === excludeConnectionId) {
        continue;
      }

      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(message);
          sentCount++;
          
          const health = this.connectionHealth.get(connectionId);
          if (health) {
            health.messagesSent++;
          }
        } catch (error) {
          console.error(`❌ Error broadcasting to ${connectionId}:`, error);
        }
      }
    }

    return sentCount;
  }

  // Generate unique connection ID
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Start health monitoring
  private startHealthMonitoring(): void {
    setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);
  }

  // Perform health check on all connections
  private performHealthCheck(): void {
    const now = Date.now();
    const staleConnections: string[] = [];

    for (const [connectionId, ws] of this.connections) {
      if (ws.readyState !== WebSocket.OPEN) {
        staleConnections.push(connectionId);
        continue;
      }

      const health = this.connectionHealth.get(connectionId);
      if (health) {
        health.uptime = now - health.uptime;
        
        // Check if connection is responsive
        if (health.latency > 10000) { // 10 seconds
          health.isHealthy = false;
        }
      }
    }

    // Clean up stale connections
    for (const connectionId of staleConnections) {
      this.connections.delete(connectionId);
      this.connectionHealth.delete(connectionId);
    }

    // Emit health status
    this.emit('health', this.getServerHealth());
  }

  // Get server health metrics
  getServerHealth(): {
    totalConnections: number;
    healthyConnections: number;
    averageLatency: number;
    totalMessagesSent: number;
    totalMessagesReceived: number;
  } {
    let healthyCount = 0;
    let totalLatency = 0;
    let latencyCount = 0;
    let totalSent = 0;
    let totalReceived = 0;

    for (const health of this.connectionHealth.values()) {
      if (health.isHealthy) healthyCount++;
      if (health.latency > 0) {
        totalLatency += health.latency;
        latencyCount++;
      }
      totalSent += health.messagesSent;
      totalReceived += health.messagesReceived;
    }

    return {
      totalConnections: this.connections.size,
      healthyConnections: healthyCount,
      averageLatency: latencyCount > 0 ? totalLatency / latencyCount : 0,
      totalMessagesSent: totalSent,
      totalMessagesReceived: totalReceived
    };
  }

  // Get connection count
  getConnectionCount(): number {
    return this.connections.size;
  }

  // Close all connections
  close(): void {
    for (const ws of this.connections.values()) {
      ws.close(1001, 'Server shutting down');
    }
    this.wss.close();
  }
}

export default {
  OptimizedWebSocketConnection,
  OptimizedWebSocketServer,
  PRODUCTION_WEBSOCKET_CONFIG
};