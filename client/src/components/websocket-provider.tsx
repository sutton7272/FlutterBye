import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessage: any;
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connectionStatus: 'disconnected',
  lastMessage: null,
  sendMessage: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Refs for cleanup and mount tracking
  const isMountedRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Temporarily disable all WebSocket functionality to prevent errors
  const WEBSOCKET_DISABLED = true;

  const connectWebSocket = useCallback(() => {
    // Completely disable WebSocket to prevent all errors
    if (WEBSOCKET_DISABLED) {
      console.log('📍 WebSocket disabled for stability - running without real-time features');
      setConnectionStatus('disconnected');
      return;
    }
    
    // Check if component is still mounted before connecting
    if (!isMountedRef.current) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log('🚀 Connecting to WebSocket:', wsUrl);
    setConnectionStatus('connecting');
    
    let ws: WebSocket;
    try {
      // Only attempt WebSocket connection if we have a valid URL and environment
      if (!wsUrl || typeof WebSocket === 'undefined') {
        console.log('📍 WebSocket not available or invalid URL, running without real-time features');
        setConnectionStatus('disconnected');
        return;
      }
      
      ws = new WebSocket(wsUrl);
    } catch (constructorError) {
      console.log('📍 WebSocket constructor failed, continuing without real-time features:', constructorError.message);
      setConnectionStatus('disconnected');
      
      // Don't attempt reconnection on constructor failures
      return;
    }
    
    ws.onopen = () => {
      if (!isMountedRef.current) {
        ws.close();
        return;
      }
      console.log('✅ WebSocket connected');
      setConnectionStatus('connected');
      setSocket(ws);
      setReconnectAttempts(0); // Reset reconnect attempts on successful connection
      
      // Send initial connection message
      try {
        ws.send(JSON.stringify({
          type: 'connection',
          timestamp: new Date().toISOString(),
          clientId: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));
      } catch (error) {
        console.error('❌ Error sending connection message:', error);
        // Don't throw - just log and continue
      }
    };

    ws.onmessage = (event) => {
      if (!isMountedRef.current) return;
      
      try {
        const data = JSON.parse(event.data);
        
        // Handle heartbeat messages separately to avoid spam
        if (data.type === 'heartbeat') {
          // Respond with pong to keep connection alive
          try {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
            }
          } catch (error) {
            console.error('❌ Error sending pong:', error);
            // Don't throw - just log and continue
          }
          return;
        }
        
        console.log('📨 WebSocket message received:', data);
        setLastMessage(data);
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      if (!isMountedRef.current) return;
      
      console.log('🔌 WebSocket disconnected:', event.code, event.reason);
      setConnectionStatus('disconnected');
      setSocket(null);
      
      // Only attempt reconnection if not intentionally closed, under max attempts, and component is still mounted
      if (event.code !== 1000 && reconnectAttempts < 5 && isMountedRef.current) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff, max 30s
        console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1}/5)`);
        
        const timeoutId = setTimeout(() => {
          if (isMountedRef.current) {
            setReconnectAttempts(prev => prev + 1);
            connectWebSocket();
          }
        }, delay);
        
        // Store timeout ID for cleanup
        reconnectTimeoutRef.current = timeoutId;
      } else if (reconnectAttempts >= 5) {
        console.log('❌ Max reconnection attempts reached');
        setConnectionStatus('error');
      }
    };

    ws.onerror = (error) => {
      if (!isMountedRef.current) return;
      console.error('❌ WebSocket error:', error);
      setConnectionStatus('error');
      // Don't throw - WebSocket errors are handled by onclose
    };

    return ws;
  }, [reconnectAttempts]);

  useEffect(() => {
    isMountedRef.current = true;
    connectWebSocket();
    
    return () => {
      isMountedRef.current = false;
      
      // Clear any pending reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Close WebSocket if still open
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close(1000, 'Component unmounting'); // Normal closure
      }
    };
  }, []); // Only connect once on mount

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageWithTimestamp = {
        ...message,
        timestamp: new Date().toISOString()
      };
      socket.send(JSON.stringify(messageWithTimestamp));
      console.log('📤 WebSocket message sent:', messageWithTimestamp);
    } else {
      console.warn('⚠️ WebSocket not connected, message not sent:', message);
    }
  };

  const value: WebSocketContextType = {
    socket,
    connectionStatus,
    lastMessage,
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
      

    </WebSocketContext.Provider>
  );
}