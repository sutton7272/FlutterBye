import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let isReconnecting = false;

    const connect = () => {
      if (isReconnecting) return;
      
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      console.log('🚀 Connecting to WebSocket:', wsUrl);
      setConnectionStatus('connecting');
      
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setConnectionStatus('connected');
        setSocket(ws);
        isReconnecting = false;
        
        // Send initial connection message
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'connection',
            timestamp: new Date().toISOString(),
            clientId: `client_${Date.now()}`
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);
          setLastMessage(data);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setConnectionStatus('disconnected');
        setSocket(null);
        
        // Only attempt to reconnect if it wasn't a manual close
        if (event.code !== 1000 && !isReconnecting) {
          isReconnecting = true;
          console.log('🔄 Attempting to reconnect WebSocket in 3 seconds...');
          reconnectTimeout = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionStatus('error');
      };
    };

    connect();

    return () => {
      isReconnecting = false;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close(1000); // Normal closure
      }
    };
  }, []); // Remove the problematic dependency

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
      
      {/* Connection Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        {connectionStatus === 'connecting' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            Connecting...
          </div>
        )}
        
        {connectionStatus === 'connected' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm opacity-75 hover:opacity-100 transition-opacity">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Connected
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Connection Error
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Connection Error
          </div>
        )}
        
        {connectionStatus === 'disconnected' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-500/20 border border-gray-500/30 rounded-lg text-gray-200 text-sm">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            Offline
          </div>
        )}
      </div>
    </WebSocketContext.Provider>
  );
}