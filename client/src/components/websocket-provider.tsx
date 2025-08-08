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
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log('🚀 Connecting to WebSocket:', wsUrl);
    setConnectionStatus('connecting');
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setConnectionStatus('connected');
      setSocket(ws);
      
      // Send initial connection message
      ws.send(JSON.stringify({
        type: 'connection',
        timestamp: new Date().toISOString(),
        clientId: `client_${Date.now()}`
      }));
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
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (!socket || socket.readyState === WebSocket.CLOSED) {
          console.log('🔄 Attempting to reconnect WebSocket...');
          // Trigger re-render to reconnect
          setConnectionStatus('connecting');
        }
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setConnectionStatus('error');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [connectionStatus === 'connecting']); // Reconnect trigger

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