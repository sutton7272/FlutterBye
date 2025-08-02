import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Users, Hash, Coins, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  maxParticipants: number;
  createdBy: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderWallet: string;
  message: string;
  messageType: string;
  mintAddress?: string;
  createdAt: string;
}

interface WebSocketMessage {
  id: string;
  type: 'message' | 'join' | 'leave' | 'typing' | 'token_share' | 'room_update';
  roomId: string;
  senderId?: string;
  senderWallet?: string;
  message?: string;
  data?: any;
  timestamp: string;
}

// Mock wallet address for now - in production this would come from wallet connection
const MOCK_WALLET = "4xY2D8F3nQ9sM1pR6tZ5bV7wX0aH8cJ2kL4mN7oP9qS3uT";

export function Chat() {
  const [selectedRoom, setSelectedRoom] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch available chat rooms
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['/api/chat/rooms'],
    queryFn: async () => {
      const response = await fetch('/api/chat/rooms');
      if (!response.ok) throw new Error('Failed to fetch rooms');
      return response.json() as Promise<ChatRoom[]>;
    }
  });

  // Fetch room messages
  const { data: roomMessages } = useQuery({
    queryKey: ['/api/chat/rooms', selectedRoom, 'messages'],
    queryFn: async () => {
      const response = await fetch(`/api/chat/rooms/${selectedRoom}/messages?limit=50`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json() as Promise<ChatMessage[]>;
    },
    enabled: !!selectedRoom
  });

  // WebSocket connection
  useEffect(() => {
    if (!selectedRoom) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?wallet=${MOCK_WALLET}&room=${selectedRoom}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('💬 Connected to chat WebSocket');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message':
          case 'token_share':
            setMessages(prev => [...prev, data]);
            break;
          case 'join':
            setParticipants(prev => Array.from(new Set([...prev, data.senderWallet!])));
            setMessages(prev => [...prev, data]);
            break;
          case 'leave':
            setParticipants(prev => prev.filter(p => p !== data.senderWallet));
            setMessages(prev => [...prev, data]);
            break;
          case 'typing':
            if (data.data?.isTyping) {
              setIsTyping(prev => Array.from(new Set([...prev, data.senderWallet!])));
              setTimeout(() => {
                setIsTyping(prev => prev.filter(p => p !== data.senderWallet));
              }, 3000);
            } else {
              setIsTyping(prev => prev.filter(p => p !== data.senderWallet));
            }
            break;
          case 'room_update':
            if (data.message) {
              toast({
                title: "Chat Update",
                description: data.message,
              });
            }
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('💬 Disconnected from chat WebSocket');
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat. Please refresh the page.",
        variant: "destructive"
      });
    };

    return () => {
      ws.close();
    };
  }, [selectedRoom, toast]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!socket || !message.trim()) return;

    const messageData = {
      type: 'send_message',
      message: message.trim(),
      roomId: selectedRoom
    };

    socket.send(JSON.stringify(messageData));
    setMessage('');
  };

  const shareToken = (mintAddress: string) => {
    if (!socket) return;

    const shareData = {
      type: 'share_token',
      mintAddress,
      roomId: selectedRoom
    };

    socket.send(JSON.stringify(shareData));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const truncateWallet = (wallet: string) => {
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-background p-6 pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gradient">
            Flutterbye Chat
          </h1>
          <p className="text-muted-foreground mt-2">Real-time blockchain messaging with token sharing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Room List */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Hash className="w-5 h-5" />
                Chat Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {roomsLoading ? (
                  <div className="text-gray-400">Loading rooms...</div>
                ) : (
                  rooms?.map((room) => (
                    <Button
                      key={room.id}
                      variant={selectedRoom === room.id ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedRoom(room.id)}
                    >
                      <Hash className="w-4 h-4 mr-2" />
                      {room.name}
                    </Button>
                  ))
                )}
                
                {/* Default General Room if no rooms */}
                {!roomsLoading && (!rooms || rooms.length === 0) && (
                  <Button
                    variant={selectedRoom === 'general' ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedRoom('general')}
                  >
                    <Hash className="w-4 h-4 mr-2" />
                    General
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 bg-black/40 border-purple-500/20 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <MessageSquare className="w-5 h-5" />
                #{selectedRoom}
                {socket && (
                  <Badge variant="outline" className="ml-auto border-green-500 text-green-400">
                    Connected
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                          {msg.senderWallet?.slice(0, 2) || '??'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-purple-400">
                              {truncateWallet(msg.senderWallet || 'Unknown')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          
                          {msg.type === 'token_share' ? (
                            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Coins className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-purple-400">Shared Token</span>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium text-white">
                                  {msg.data?.token?.message || 'Unknown Token'}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {msg.data?.token?.mintAddress && truncateWallet(msg.data.token.mintAddress)}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-300">
                              {msg.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicators */}
                  {isTyping.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      {isTyping.map(wallet => truncateWallet(wallet)).join(', ')} typing...
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="mt-4 flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-black/20 border-purple-500/20"
                  disabled={!socket}
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!socket || !message.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Users className="w-5 h-5" />
                Online ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-300">
                      {truncateWallet(participant)}
                    </span>
                  </div>
                ))}
                {participants.length === 0 && (
                  <div className="text-sm text-gray-500">No participants online</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-400">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => shareToken("example_mint_address")}
                className="border-purple-500/20 hover:bg-purple-900/20"
                disabled={!socket}
              >
                <Coins className="w-4 h-4 mr-2" />
                Share Token
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (socket) {
                    socket.send(JSON.stringify({
                      type: 'typing',
                      isTyping: true,
                      roomId: selectedRoom
                    }));
                  }
                }}
                className="border-purple-500/20 hover:bg-purple-900/20"
                disabled={!socket}
              >
                Test Typing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}