import { createContext, useContext, ReactNode } from 'react';

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
  console.log('📍 WebSocket completely disabled - running without real-time features');

  const contextValue: WebSocketContextType = {
    socket: null,
    connectionStatus: 'disconnected',
    lastMessage: null,
    sendMessage: () => {
      console.log('📍 WebSocket message send attempted but disabled');
    },
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}