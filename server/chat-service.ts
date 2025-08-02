import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { storage } from './storage';
import type { ChatMessage, ChatRoom } from '@shared/schema';

export interface ChatClient {
  ws: WebSocket;
  userId: string;
  walletAddress: string;
  roomId?: string;
  isAlive: boolean;
}

export interface WebSocketMessage {
  id: string;
  type: 'message' | 'join' | 'leave' | 'typing' | 'token_share' | 'room_update' | 'reaction' | 'edit' | 'pin';
  roomId: string;
  senderId?: string;
  senderWallet?: string;
  message?: string;
  messageId?: string;
  emoji?: string;
  isPinned?: boolean;
  reactions?: { [emoji: string]: string[] };
  replyTo?: string;
  data?: any;
  timestamp: string;
}

export class ChatService {
  private wss!: WebSocketServer;
  private clients = new Map<string, ChatClient>();
  private rooms = new Map<string, Set<string>>(); // roomId -> Set of clientIds

  constructor() {}

  // Method to handle WebSocket connections from the main server
  handleWebSocketConnection(ws: WebSocket, request: any) {
    this.handleConnection(ws, request);
  }

  // Heartbeat method to be called externally
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
    const roomId = url.searchParams.get('room');

    if (!walletAddress) {
      ws.close(1008, 'Wallet address required');
      return;
    }

    // Get or create user
    let user = await storage.getUserByWallet(walletAddress);
    if (!user) {
      user = await storage.createUser({ 
        walletAddress,
        id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`
      });
    }

    const clientId = `${user.id}_${Date.now()}`;
    const client: ChatClient = {
      ws,
      userId: user.id,
      walletAddress,
      roomId: roomId || undefined,
      isAlive: true
    };

    this.clients.set(clientId, client);

    // Join room if specified
    if (roomId) {
      await this.joinRoom(clientId, roomId);
    }

    // Set up message handlers
    ws.on('message', (data) => this.handleMessage(clientId, data));
    ws.on('pong', () => {
      client.isAlive = true;
    });
    ws.on('close', () => this.handleDisconnection(client));
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.handleDisconnection(client);
    });

    // Send welcome message
    this.sendToClient(clientId, {
      id: 'welcome',
      type: 'room_update',
      roomId: roomId || 'general',
      message: 'Connected to Flutterbye Chat',
      timestamp: new Date().toISOString()
    });

    console.log(`💬 User ${walletAddress} connected to chat${roomId ? ` in room ${roomId}` : ''}`);
  }

  private async handleMessage(clientId: string, data: any) {
    try {
      const client = this.clients.get(clientId);
      if (!client) return;

      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'join_room':
          await this.joinRoom(clientId, message.roomId);
          break;
        
        case 'leave_room':
          await this.leaveRoom(clientId, message.roomId);
          break;
        
        case 'message':
        case 'send_message':
          await this.handleChatMessage(clientId, message);
          break;
        
        case 'token_share':
        case 'share_token':
          await this.handleTokenShare(clientId, message);
          break;
        
        case 'reaction':
          await this.handleReaction(clientId, message);
          break;
        
        case 'edit':
          await this.handleEditMessage(clientId, message);
          break;
        
        case 'pin':
          await this.handlePinMessage(clientId, message);
          break;
        
        case 'typing':
          this.handleTyping(clientId, message);
          break;
        
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private async joinRoom(clientId: string, roomId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Leave current room if any
    if (client.roomId && client.roomId !== roomId) {
      await this.leaveRoom(clientId, client.roomId);
    }

    client.roomId = roomId;

    // Add to room
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(clientId);

    // Get or create room in database
    let room = await storage.getChatRoom(roomId);
    if (!room) {
      room = await storage.createChatRoom({
        name: `Room ${roomId}`,
        createdBy: client.userId,
        isPublic: true
      });
    }

    // Add participant to database
    await storage.joinChatRoom({
      roomId: room.id,
      userId: client.userId,
      walletAddress: client.walletAddress
    });

    // Notify room of new participant
    this.broadcastToRoom(roomId, {
      id: `join_${Date.now()}`,
      type: 'join',
      roomId,
      senderWallet: client.walletAddress,
      message: `${client.walletAddress} joined the chat`,
      timestamp: new Date().toISOString()
    }, clientId);

    // Send room history to new participant
    const messages = await storage.getChatMessages(room.id, 50);
    messages.forEach((msg, index) => {
      this.sendToClient(clientId, {
        id: msg.id,
        type: 'message',
        roomId,
        senderId: msg.senderId,
        senderWallet: msg.senderWallet,
        message: msg.message,
        data: { messageType: msg.messageType, mintAddress: msg.mintAddress },
        timestamp: msg.createdAt ? msg.createdAt.toISOString() : new Date().toISOString()
      });
    });
  }

  private async leaveRoom(clientId: string, roomId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const roomClients = this.rooms.get(roomId);
    if (roomClients) {
      roomClients.delete(clientId);
      if (roomClients.size === 0) {
        this.rooms.delete(roomId);
      }
    }

    // Update participant status
    await storage.updateChatParticipant(client.userId, roomId, { isOnline: false });

    // Notify room
    this.broadcastToRoom(roomId, {
      id: `leave_${Date.now()}`,
      type: 'leave',
      roomId,
      senderWallet: client.walletAddress,
      message: `${client.walletAddress} left the chat`,
      timestamp: new Date().toISOString()
    });

    client.roomId = undefined;
  }

  private async handleChatMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client || !client.roomId) return;

    // Save message to database
    const chatMessage = await storage.createChatMessage({
      roomId: client.roomId,
      senderId: client.userId,
      senderWallet: client.walletAddress,
      message: message.message,
      messageType: 'text'
    });

    // Broadcast to room
    this.broadcastToRoom(client.roomId, {
      id: chatMessage.id,
      type: 'message',
      roomId: client.roomId,
      senderId: client.userId,
      senderWallet: client.walletAddress,
      message: message.message,
      timestamp: new Date().toISOString()
    });

    // TODO: Optionally commit important messages to blockchain
    if (message.commitToBlockchain) {
      this.commitMessageToBlockchain(chatMessage);
    }
  }

  private async handleTokenShare(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client || !client.roomId) return;

    // Get token information
    const token = await storage.getTokenByMintAddress(message.mintAddress);
    if (!token) return;

    // Save token share message
    const chatMessage = await storage.createChatMessage({
      roomId: client.roomId,
      senderId: client.userId,
      senderWallet: client.walletAddress,
      message: `Shared token: ${token.message}`,
      messageType: 'token_share',
      mintAddress: token.mintAddress
    });

    // Broadcast token share
    this.broadcastToRoom(client.roomId, {
      id: chatMessage.id,
      type: 'token_share',
      roomId: client.roomId,
      senderId: client.userId,
      senderWallet: client.walletAddress,
      message: `Shared token: ${token.message}`,
      data: {
        token: {
          mintAddress: token.mintAddress,
          message: token.message,
          symbol: token.symbol,
          imageUrl: token.imageUrl
        }
      },
      timestamp: new Date().toISOString()
    });
  }

  private handleTyping(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client || !client.roomId) return;

    // Broadcast typing indicator (don't save to database)
    this.broadcastToRoom(client.roomId, {
      id: `typing_${Date.now()}`,
      type: 'typing',
      roomId: client.roomId,
      senderWallet: client.walletAddress,
      data: { isTyping: message.isTyping },
      timestamp: new Date().toISOString()
    }, clientId);
  }

  // Enhanced message handlers for reactions, editing, and pinning
  private async handleReaction(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client || !client.roomId) return;

    try {
      // Update message reactions in storage
      await storage.addMessageReaction(message.messageId, client.walletAddress, message.emoji);
      
      // Get updated reactions
      const reactions = await storage.getMessageReactions(message.messageId);
      
      // Broadcast reaction update to room
      this.broadcastToRoom(client.roomId, {
        id: `reaction_${Date.now()}`,
        type: 'reaction',
        roomId: client.roomId,
        messageId: message.messageId,
        senderWallet: client.walletAddress,
        reactions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  }

  private async handleEditMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client || !client.roomId) return;

    try {
      // Update message in storage
      await storage.updateChatMessage(message.messageId, { 
        message: message.message,
        isEdited: true 
      });
      
      // Broadcast edit to room
      this.broadcastToRoom(client.roomId, {
        id: `edit_${Date.now()}`,
        type: 'edit',
        roomId: client.roomId,
        messageId: message.messageId,
        senderWallet: client.walletAddress,
        message: message.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error handling message edit:', error);
    }
  }

  private async handlePinMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client || !client.roomId) return;

    try {
      // Update message pin status in storage
      await storage.updateChatMessage(message.messageId, { 
        isPinned: message.isPinned 
      });
      
      // Broadcast pin update to room
      this.broadcastToRoom(client.roomId, {
        id: `pin_${Date.now()}`,
        type: 'pin',
        roomId: client.roomId,
        messageId: message.messageId,
        senderWallet: client.walletAddress,
        isPinned: message.isPinned,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error handling message pin:', error);
    }
  }

  private async commitMessageToBlockchain(message: ChatMessage) {
    try {
      // Create a mini token for the message (optional feature)
      // This would create a permanent blockchain record of the chat message
      console.log('💎 Committing message to blockchain:', message.id);
      
      // TODO: Implement blockchain commitment
      // Could create a special "chat token" or add to a message registry
    } catch (error) {
      console.error('Error committing to blockchain:', error);
    }
  }

  private broadcastToRoom(roomId: string, message: WebSocketMessage, excludeClientId?: string) {
    const roomClients = this.rooms.get(roomId);
    if (!roomClients) return;

    roomClients.forEach(clientId => {
      if (clientId !== excludeClientId) {
        this.sendToClient(clientId, message);
      }
    });
  }

  private sendToClient(clientId: string, message: WebSocketMessage) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  private handleDisconnection(client: ChatClient) {
    // Find and remove client
    let clientId = '';
    for (const [id, c] of Array.from(this.clients.entries())) {
      if (c === client) {
        clientId = id;
        break;
      }
    }

    if (clientId) {
      this.clients.delete(clientId);
      
      // Remove from room
      if (client.roomId) {
        const roomClients = this.rooms.get(client.roomId);
        if (roomClients) {
          roomClients.delete(clientId);
          if (roomClients.size === 0) {
            this.rooms.delete(client.roomId);
          }
        }

        // Update database
        storage.updateChatParticipant(client.userId, client.roomId, { isOnline: false });

        // Notify room
        this.broadcastToRoom(client.roomId, {
          id: `disconnect_${Date.now()}`,
          type: 'leave',
          roomId: client.roomId,
          senderWallet: client.walletAddress,
          message: `${client.walletAddress} disconnected`,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`💬 User ${client.walletAddress} disconnected from chat`);
  }

  // Public methods for room management
  async createRoom(name: string, createdBy: string, isPublic: boolean = true) {
    return await storage.createChatRoom({
      name,
      createdBy,
      isPublic
    });
  }

  async getRoomList() {
    return await storage.getChatRooms();
  }

  async getRoomParticipants(roomId: string) {
    return await storage.getChatParticipants(roomId);
  }
}

export const chatService = new ChatService();