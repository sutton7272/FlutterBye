import WebSocket, { WebSocketServer } from 'ws';
import { EventEmitter } from 'events';
import type { Server } from 'http';

// Real-time monitoring and WebSocket service
export class RealTimeMonitor extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private connections = new Map<string, WebSocket>();
  private userSessions = new Map<string, Set<string>>();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private metrics = {
    activeConnections: 0,
    totalConnections: 0,
    messagesPerMinute: 0,
    errorRate: 0
  };

  constructor() {
    super();
    this.setupMetricsTracking();
  }

  // Initialize WebSocket server
  initialize(server: Server): void {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws',
      verifyClient: this.verifyClient.bind(this)
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    this.startHeartbeat();
    
    console.log('🔄 Real-time WebSocket server initialized');
  }

  // Verify client connections (authentication)
  private verifyClient(info: any): boolean {
    // In production, verify JWT token from query params or headers
    const url = new URL(info.req.url!, `http://${info.req.headers.host}`);
    const token = url.searchParams.get('token');
    
    // For now, allow all connections (implement JWT verification)
    return true;
  }

  // Handle new WebSocket connections
  private handleConnection(ws: WebSocket, request: any): void {
    const connectionId = this.generateConnectionId();
    const userId = this.extractUserId(request);
    
    // Store connection
    this.connections.set(connectionId, ws);
    this.addUserSession(userId, connectionId);
    this.metrics.activeConnections++;
    this.metrics.totalConnections++;

    console.log(`🔗 New WebSocket connection: ${connectionId} (User: ${userId})`);

    // Set up connection handlers
    ws.on('message', (data) => this.handleMessage(connectionId, userId, data));
    ws.on('close', () => this.handleDisconnection(connectionId, userId));
    ws.on('error', (error) => this.handleError(connectionId, error));
    ws.on('pong', () => this.handlePong(connectionId));

    // Send welcome message
    this.sendToConnection(connectionId, {
      type: 'connection_established',
      connectionId,
      timestamp: new Date().toISOString(),
      serverTime: Date.now()
    });

    // Emit connection event
    this.emit('user_connected', { userId, connectionId });
  }

  // Handle incoming messages
  private handleMessage(connectionId: string, userId: string, data: WebSocket.Data): void {
    try {
      const message = JSON.parse(data.toString());
      
      // Update metrics
      this.metrics.messagesPerMinute++;
      
      // Handle different message types
      switch (message.type) {
        case 'ping':
          this.sendToConnection(connectionId, { type: 'pong', timestamp: Date.now() });
          break;
          
        case 'subscribe':
          this.handleSubscription(connectionId, userId, message.channel);
          break;
          
        case 'unsubscribe':
          this.handleUnsubscription(connectionId, userId, message.channel);
          break;
          
        case 'transaction_update':
          this.handleTransactionUpdate(userId, message.data);
          break;
          
        case 'portfolio_update':
          this.handlePortfolioUpdate(userId, message.data);
          break;
          
        default:
          console.warn(`Unknown message type: ${message.type}`);
      }
      
      // Emit message event for other services
      this.emit('message', { userId, connectionId, message });
      
    } catch (error) {
      console.error(`Message parsing error for connection ${connectionId}:`, error);
      this.metrics.errorRate++;
      this.sendError(connectionId, 'Invalid message format');
    }
  }

  // Handle client disconnections
  private handleDisconnection(connectionId: string, userId: string): void {
    this.connections.delete(connectionId);
    this.removeUserSession(userId, connectionId);
    this.metrics.activeConnections--;
    
    console.log(`❌ WebSocket disconnection: ${connectionId} (User: ${userId})`);
    
    // Emit disconnection event
    this.emit('user_disconnected', { userId, connectionId });
  }

  // Handle connection errors
  private handleError(connectionId: string, error: Error): void {
    console.error(`WebSocket error for connection ${connectionId}:`, error);
    this.metrics.errorRate++;
    
    // Emit error event
    this.emit('connection_error', { connectionId, error });
  }

  // Handle pong responses for heartbeat
  private handlePong(connectionId: string): void {
    // Connection is alive, update last seen timestamp
    const ws = this.connections.get(connectionId);
    if (ws) {
      (ws as any).lastPong = Date.now();
    }
  }

  // Send message to specific connection
  sendToConnection(connectionId: string, data: any): boolean {
    const ws = this.connections.get(connectionId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(data));
        return true;
      } catch (error) {
        console.error(`Failed to send message to ${connectionId}:`, error);
        return false;
      }
    }
    return false;
  }

  // Send message to all connections of a user
  sendToUser(userId: string, data: any): number {
    const userConnections = this.userSessions.get(userId);
    let sentCount = 0;
    
    if (userConnections) {
      userConnections.forEach(connectionId => {
        if (this.sendToConnection(connectionId, data)) {
          sentCount++;
        }
      });
    }
    
    return sentCount;
  }

  // Broadcast message to all connected users
  broadcast(data: any, excludeUser?: string): number {
    let sentCount = 0;
    
    this.connections.forEach((ws, connectionId) => {
      const userId = this.getConnectionUserId(connectionId);
      if (userId !== excludeUser && ws.readyState === WebSocket.OPEN) {
        if (this.sendToConnection(connectionId, data)) {
          sentCount++;
        }
      }
    });
    
    return sentCount;
  }

  // Send real-time transaction update
  sendTransactionUpdate(userId: string, transactionData: any): void {
    this.sendToUser(userId, {
      type: 'transaction_update',
      data: transactionData,
      timestamp: new Date().toISOString()
    });
  }

  // Send real-time portfolio update
  sendPortfolioUpdate(userId: string, portfolioData: any): void {
    this.sendToUser(userId, {
      type: 'portfolio_update',
      data: portfolioData,
      timestamp: new Date().toISOString()
    });
  }

  // Send real-time token creation notification
  sendTokenCreated(userId: string, tokenData: any): void {
    this.sendToUser(userId, {
      type: 'token_created',
      data: tokenData,
      timestamp: new Date().toISOString()
    });
  }

  // Send real-time governance update
  sendGovernanceUpdate(proposalData: any): void {
    this.broadcast({
      type: 'governance_update',
      data: proposalData,
      timestamp: new Date().toISOString()
    });
  }

  // Send system notification
  sendSystemNotification(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    this.broadcast({
      type: 'system_notification',
      level,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Handle subscription to channels
  private handleSubscription(connectionId: string, userId: string, channel: string): void {
    // Implement channel subscription logic
    console.log(`📡 User ${userId} subscribed to ${channel}`);
    
    this.sendToConnection(connectionId, {
      type: 'subscription_confirmed',
      channel,
      timestamp: new Date().toISOString()
    });
  }

  // Handle unsubscription from channels
  private handleUnsubscription(connectionId: string, userId: string, channel: string): void {
    // Implement channel unsubscription logic
    console.log(`📡 User ${userId} unsubscribed from ${channel}`);
    
    this.sendToConnection(connectionId, {
      type: 'unsubscription_confirmed',
      channel,
      timestamp: new Date().toISOString()
    });
  }

  // Handle transaction updates
  private handleTransactionUpdate(userId: string, data: any): void {
    // Process transaction update and relay to relevant users
    this.emit('transaction_update', { userId, data });
  }

  // Handle portfolio updates
  private handlePortfolioUpdate(userId: string, data: any): void {
    // Process portfolio update and relay to relevant users
    this.emit('portfolio_update', { userId, data });
  }

  // Send error message to connection
  private sendError(connectionId: string, message: string): void {
    this.sendToConnection(connectionId, {
      type: 'error',
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Start heartbeat to detect dead connections
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.connections.forEach((ws, connectionId) => {
        if (ws.readyState === WebSocket.OPEN) {
          // Check if connection responded to last ping
          const lastPong = (ws as any).lastPong || 0;
          const timeSinceLastPong = Date.now() - lastPong;
          
          if (timeSinceLastPong > 60000) { // 1 minute timeout
            console.log(`💔 Terminating dead connection: ${connectionId}`);
            ws.terminate();
          } else {
            // Send ping
            ws.ping();
          }
        }
      });
    }, 30000); // Check every 30 seconds
  }

  // Setup metrics tracking
  private setupMetricsTracking(): void {
    setInterval(() => {
      // Reset per-minute metrics
      this.metrics.messagesPerMinute = 0;
      this.metrics.errorRate = 0;
    }, 60000);
  }

  // Utility methods
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractUserId(request: any): string {
    // Extract user ID from JWT token or use fallback
    const url = new URL(request.url!, `http://${request.headers.host}`);
    return url.searchParams.get('userId') || 'anonymous';
  }

  private addUserSession(userId: string, connectionId: string): void {
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set());
    }
    this.userSessions.get(userId)!.add(connectionId);
  }

  private removeUserSession(userId: string, connectionId: string): void {
    const userConnections = this.userSessions.get(userId);
    if (userConnections) {
      userConnections.delete(connectionId);
      if (userConnections.size === 0) {
        this.userSessions.delete(userId);
      }
    }
  }

  private getConnectionUserId(connectionId: string): string | null {
    for (const [userId, connections] of this.userSessions.entries()) {
      if (connections.has(connectionId)) {
        return userId;
      }
    }
    return null;
  }

  // Get current metrics
  getMetrics() {
    return {
      ...this.metrics,
      connectedUsers: this.userSessions.size,
      totalSessions: Array.from(this.userSessions.values()).reduce((sum, set) => sum + set.size, 0)
    };
  }

  // Cleanup on shutdown
  shutdown(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    if (this.wss) {
      this.wss.close();
    }
    
    this.connections.clear();
    this.userSessions.clear();
    
    console.log('🛑 Real-time monitor shutdown complete');
  }
}

// Export singleton instance
export const realTimeMonitor = new RealTimeMonitor();