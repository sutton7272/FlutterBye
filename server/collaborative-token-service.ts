import { WebSocket, WebSocketServer } from 'ws';
import { storage } from './storage';
import { monitoring } from './monitoring';

interface CollaborativeClient {
  ws: WebSocket;
  userId: string;
  walletAddress: string;
  sessionId: string;
  isAlive: boolean;
  permissions: string[];
}

interface TokenSession {
  id: string;
  creatorId: string;
  tokenData: {
    name: string;
    symbol: string;
    description: string;
    imageUrl?: string;
    supply: number;
    price: number;
    currency: string;
    tags: string[];
    expiryDate?: string;
  };
  collaborators: Set<string>; // user IDs
  permissions: Map<string, string[]>; // userId -> permissions
  lastModified: Date;
  isLocked: boolean;
  lockedBy?: string;
}

interface TokenChange {
  sessionId: string;
  userId: string;
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
  changeId: string;
}

export class CollaborativeTokenService {
  private clients = new Map<string, CollaborativeClient>();
  private sessions = new Map<string, TokenSession>(); // sessionId -> session
  private userSessions = new Map<string, string>(); // userId -> sessionId
  private changeHistory = new Map<string, TokenChange[]>(); // sessionId -> changes

  constructor() {}

  handleWebSocketConnection(ws: WebSocket, request: any) {
    this.handleConnection(ws, request);
  }

  startHeartbeat() {
    setInterval(() => {
      this.clients.forEach((client) => {
        if (!client.isAlive) {
          this.handleDisconnection(client);
          return client.ws.terminate();
        }
        client.isAlive = false;
        client.ws.ping();
      });
    }, 30000);
  }

  private async handleConnection(ws: WebSocket, request: any) {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const walletAddress = url.searchParams.get('wallet');
    const sessionId = url.searchParams.get('session');

    if (!walletAddress) {
      ws.close(1008, 'Wallet address required');
      return;
    }

    let user = await storage.getUserByWallet(walletAddress);
    if (!user) {
      user = await storage.createUser({ walletAddress });
    }

    const clientId = `${user.id}_${Date.now()}`;
    const client: CollaborativeClient = {
      ws,
      userId: user.id,
      walletAddress,
      sessionId: sessionId || '',
      isAlive: true,
      permissions: ['read', 'edit']
    };

    this.clients.set(clientId, client);

    // Join session if specified
    if (sessionId) {
      await this.joinSession(clientId, sessionId);
    }

    ws.on('message', (data) => this.handleMessage(clientId, data));
    ws.on('pong', () => {
      client.isAlive = true;
    });
    ws.on('close', () => this.handleDisconnection(client));
    ws.on('error', (error) => {
      console.error('Collaborative WebSocket error:', error);
      this.handleDisconnection(client);
    });

    // Send welcome message
    this.sendToClient(clientId, {
      type: 'connection_established',
      sessionId: sessionId || null,
      userId: user.id,
      permissions: client.permissions,
      timestamp: new Date().toISOString()
    });

    console.log(`🎨 User ${walletAddress} connected to collaborative token studio${sessionId ? ` in session ${sessionId}` : ''}`);
  }

  private async handleMessage(clientId: string, data: any) {
    try {
      const client = this.clients.get(clientId);
      if (!client) return;

      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'create_session':
          await this.createSession(clientId, message.tokenData);
          break;
        
        case 'join_session':
          await this.joinSession(clientId, message.sessionId);
          break;
        
        case 'leave_session':
          await this.leaveSession(clientId);
          break;
        
        case 'update_token':
          await this.updateToken(clientId, message.changes);
          break;
        
        case 'lock_field':
          await this.lockField(clientId, message.field);
          break;
        
        case 'unlock_field':
          await this.unlockField(clientId, message.field);
          break;
        
        case 'add_collaborator':
          await this.addCollaborator(clientId, message.walletAddress, message.permissions);
          break;
        
        case 'remove_collaborator':
          await this.removeCollaborator(clientId, message.userId);
          break;
        
        case 'get_change_history':
          await this.sendChangeHistory(clientId, message.sessionId);
          break;
        
        case 'finalize_token':
          await this.finalizeToken(clientId);
          break;

        default:
          console.log('Unknown collaborative message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling collaborative message:', error);
      this.sendError(clientId, 'Failed to process message');
    }
  }

  private async createSession(clientId: string, tokenData: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const sessionId = `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: TokenSession = {
      id: sessionId,
      creatorId: client.userId,
      tokenData: {
        name: tokenData.name || '',
        symbol: tokenData.symbol || '',
        description: tokenData.description || '',
        imageUrl: tokenData.imageUrl,
        supply: tokenData.supply || 1000000,
        price: tokenData.price || 0.01,
        currency: tokenData.currency || 'SOL',
        tags: tokenData.tags || [],
        expiryDate: tokenData.expiryDate
      },
      collaborators: new Set([client.userId]),
      permissions: new Map([[client.userId, ['read', 'edit', 'admin']]]),
      lastModified: new Date(),
      isLocked: false
    };

    this.sessions.set(sessionId, session);
    this.userSessions.set(client.userId, sessionId);
    this.changeHistory.set(sessionId, []);

    client.sessionId = sessionId;

    this.sendToClient(clientId, {
      type: 'session_created',
      sessionId,
      session: this.sanitizeSession(session),
      timestamp: new Date().toISOString()
    });

    // monitoring.recordBusinessMetric('collaborative_sessions_created', 1);
    console.log(`🎨 Collaborative session created: ${sessionId} by ${client.walletAddress}`);
  }

  private async joinSession(clientId: string, sessionId: string) {
    const client = this.clients.get(clientId);
    const session = this.sessions.get(sessionId);
    
    if (!client || !session) {
      this.sendError(clientId, 'Session not found');
      return;
    }

    // Check if user has permission to join
    if (!session.collaborators.has(client.userId) && session.creatorId !== client.userId) {
      this.sendError(clientId, 'Access denied to session');
      return;
    }

    // Add to session if not already added
    session.collaborators.add(client.userId);
    if (!session.permissions.has(client.userId)) {
      session.permissions.set(client.userId, ['read', 'edit']);
    }

    this.userSessions.set(client.userId, sessionId);
    client.sessionId = sessionId;
    client.permissions = session.permissions.get(client.userId) || ['read'];

    // Notify all participants
    this.broadcastToSession(sessionId, {
      type: 'collaborator_joined',
      userId: client.userId,
      walletAddress: client.walletAddress,
      permissions: client.permissions,
      timestamp: new Date().toISOString()
    }, clientId);

    // Send current session state to new participant
    this.sendToClient(clientId, {
      type: 'session_joined',
      sessionId,
      session: this.sanitizeSession(session),
      collaborators: Array.from(session.collaborators),
      permissions: client.permissions,
      timestamp: new Date().toISOString()
    });

    // monitoring.recordBusinessMetric('collaborative_joins', 1);
    console.log(`🤝 User ${client.walletAddress} joined session ${sessionId}`);
  }

  private async updateToken(clientId: string, changes: any) {
    const client = this.clients.get(clientId);
    const session = this.sessions.get(client?.sessionId || '');
    
    if (!client || !session) {
      this.sendError(clientId, 'No active session');
      return;
    }

    if (!client.permissions.includes('edit')) {
      this.sendError(clientId, 'No edit permission');
      return;
    }

    // Record changes
    const changeRecords: TokenChange[] = [];
    
    Object.keys(changes).forEach(field => {
      const oldValue = (session.tokenData as any)[field];
      const newValue = changes[field];
      
      if (oldValue !== newValue) {
        const change: TokenChange = {
          sessionId: session.id,
          userId: client.userId,
          field,
          oldValue,
          newValue,
          timestamp: new Date(),
          changeId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        changeRecords.push(change);
        
        // Apply change
        (session.tokenData as any)[field] = newValue;
      }
    });

    if (changeRecords.length > 0) {
      session.lastModified = new Date();
      
      // Add to history
      const history = this.changeHistory.get(session.id) || [];
      history.push(...changeRecords);
      this.changeHistory.set(session.id, history);

      // Broadcast changes to all participants
      this.broadcastToSession(session.id, {
        type: 'token_updated',
        changes: changeRecords,
        updatedFields: Object.keys(changes),
        tokenData: session.tokenData,
        updatedBy: client.userId,
        timestamp: new Date().toISOString()
      });

      // monitoring.recordBusinessMetric('collaborative_edits', changeRecords.length);
      console.log(`✏️ Token updated in session ${session.id}: ${Object.keys(changes).join(', ')}`);
    }
  }

  private async lockField(clientId: string, field: string) {
    const client = this.clients.get(clientId);
    const session = this.sessions.get(client?.sessionId || '');
    
    if (!client || !session) return;

    // Simple field locking (in production, implement per-field locking)
    session.isLocked = true;
    session.lockedBy = client.userId;

    this.broadcastToSession(session.id, {
      type: 'field_locked',
      field,
      lockedBy: client.userId,
      timestamp: new Date().toISOString()
    });
  }

  private async unlockField(clientId: string, field: string) {
    const client = this.clients.get(clientId);
    const session = this.sessions.get(client?.sessionId || '');
    
    if (!client || !session) return;

    if (session.lockedBy === client.userId) {
      session.isLocked = false;
      session.lockedBy = undefined;

      this.broadcastToSession(session.id, {
        type: 'field_unlocked',
        field,
        unlockedBy: client.userId,
        timestamp: new Date().toISOString()
      });
    }
  }

  private async addCollaborator(clientId: string, walletAddress: string, permissions: string[]) {
    const client = this.clients.get(clientId);
    const session = this.sessions.get(client?.sessionId || '');
    
    if (!client || !session) return;

    if (!client.permissions.includes('admin') && session.creatorId !== client.userId) {
      this.sendError(clientId, 'No admin permission');
      return;
    }

    try {
      let user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        user = await storage.createUser({ walletAddress });
      }

      session.collaborators.add(user.id);
      session.permissions.set(user.id, permissions);

      this.broadcastToSession(session.id, {
        type: 'collaborator_added',
        userId: user.id,
        walletAddress,
        permissions,
        addedBy: client.userId,
        timestamp: new Date().toISOString()
      });

      console.log(`👥 Collaborator added to session ${session.id}: ${walletAddress}`);
    } catch (error) {
      this.sendError(clientId, 'Failed to add collaborator');
    }
  }

  private async finalizeToken(clientId: string) {
    const client = this.clients.get(clientId);
    const session = this.sessions.get(client?.sessionId || '');
    
    if (!client || !session) return;

    if (session.creatorId !== client.userId && !client.permissions.includes('admin')) {
      this.sendError(clientId, 'Only creator can finalize token');
      return;
    }

    // This would integrate with the main token creation system
    this.broadcastToSession(session.id, {
      type: 'token_finalized',
      tokenData: session.tokenData,
      finalizedBy: client.userId,
      timestamp: new Date().toISOString()
    });

    // monitoring.recordBusinessMetric('collaborative_tokens_finalized', 1);
    console.log(`🎯 Token finalized from collaborative session: ${session.id}`);
  }

  private sendToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  private sendError(clientId: string, error: string) {
    this.sendToClient(clientId, {
      type: 'error',
      error,
      timestamp: new Date().toISOString()
    });
  }

  private broadcastToSession(sessionId: string, message: any, excludeClientId?: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    this.clients.forEach((client, clientId) => {
      if (client.sessionId === sessionId && clientId !== excludeClientId) {
        this.sendToClient(clientId, message);
      }
    });
  }

  private async leaveSession(clientId: string) {
    const client = this.clients.get(clientId);
    if (!client || !client.sessionId) return;

    const session = this.sessions.get(client.sessionId);
    if (session) {
      this.broadcastToSession(client.sessionId, {
        type: 'collaborator_left',
        userId: client.userId,
        timestamp: new Date().toISOString()
      }, clientId);
    }

    this.userSessions.delete(client.userId);
    client.sessionId = '';
  }

  private handleDisconnection(client: CollaborativeClient) {
    const clientId = Array.from(this.clients.entries())
      .find(([_, c]) => c === client)?.[0];
    
    if (clientId) {
      this.leaveSession(clientId);
      this.clients.delete(clientId);
    }
  }

  private async sendChangeHistory(clientId: string, sessionId: string) {
    const history = this.changeHistory.get(sessionId) || [];
    this.sendToClient(clientId, {
      type: 'change_history',
      sessionId,
      history: history.slice(-50), // Last 50 changes
      timestamp: new Date().toISOString()
    });
  }

  private sanitizeSession(session: TokenSession) {
    return {
      id: session.id,
      creatorId: session.creatorId,
      tokenData: session.tokenData,
      lastModified: session.lastModified,
      isLocked: session.isLocked,
      lockedBy: session.lockedBy,
      collaboratorCount: session.collaborators.size
    };
  }

  // Admin methods for monitoring
  getActiveSessionsCount(): number {
    return this.sessions.size;
  }

  getActiveCollaboratorsCount(): number {
    return this.clients.size;
  }

  getSessionMetrics() {
    return {
      activeSessions: this.sessions.size,
      activeCollaborators: this.clients.size,
      totalChangesMade: Array.from(this.changeHistory.values()).reduce((sum, changes) => sum + changes.length, 0)
    };
  }
}

export const collaborativeTokenService = new CollaborativeTokenService();