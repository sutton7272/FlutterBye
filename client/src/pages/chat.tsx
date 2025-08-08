import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Send, Users, Hash, Coins, MessageSquare, Plus, Settings, Smile, Reply, Edit3, Copy, Star, AlertTriangle, Volume2, VolumeX, Maximize2, Minimize2, Search, Filter, Clock, CheckCircle2, Circle, MoreVertical, Trash2, Pin, Heart, Zap, Gift, BarChart3, RotateCcw, Crown, Sparkles, TrendingUp, DollarSign, Award, Shield, Image, Paperclip, Mic, Video, Calendar, MapPin, Users2, Bot, Lock, Unlock, Eye, EyeOff, Bell, BellOff, Palette, Wand2, Flame, Target, MessageCircle, ThumbsUp, Share2, Download, Upload, Bookmark, Flag, Coffee, Rocket, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VoiceMessageRecorder } from '@/components/voice-message-recorder';
import RealTimeAIAssistant from '@/components/RealTimeAIAssistant';

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
  type: 'message' | 'join' | 'leave' | 'typing' | 'token_share' | 'room_update' | 'reaction' | 'edit' | 'delete' | 'pin';
  roomId: string;
  senderId?: string;
  senderWallet?: string;
  message?: string;
  data?: any;
  timestamp: string;
  replyTo?: string;
  reactions?: { [emoji: string]: string[] }; // emoji -> array of wallet addresses
  isEdited?: boolean;
  isPinned?: boolean;
  messageId?: string;
}

interface ChatMessageExtended extends ChatMessage {
  reactions?: { [emoji: string]: string[] };
  replyTo?: ChatMessage;
  isEdited?: boolean;
  isPinned?: boolean;
}

// TODO: Replace with real wallet authentication from useWallet hook
// This is a critical production issue that needs immediate fixing
const MOCK_WALLET = "4xY2D8F3nQ9sM1pR6tZ5bV7wX0aH8cJ2kL4mN7oP9qS3uT";

// Production authentication integration needed:
// import { useWallet } from '@/components/wallet-adapter';
// const { publicKey, connected } = useWallet();
// const userWallet = publicKey?.toBase58() || null;

export function Chat() {
  // Get room from URL parameters
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const roomFromUrl = urlParams.get('room') || 'general';
  
  const [selectedRoom, setSelectedRoom] = useState<string>(roomFromUrl);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<WebSocketMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<WebSocketMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadMessageId, setLastReadMessageId] = useState<string>('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(250);
  const [nextLevelXP, setNextLevelXP] = useState(500);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('electric');
  const [messageType, setMessageType] = useState<'text' | 'token' | 'nft' | 'poll'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [currentTypingMode, setCurrentTypingMode] = useState<'normal' | 'premium' | 'ai'>('normal');
  const [isMobile, setIsMobile] = useState(false);
  const [attachedVoice, setAttachedVoice] = useState<{ url: string; duration: number; type: 'voice' | 'music' } | null>(null);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Handle URL parameter changes for room selection
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const roomFromUrl = urlParams.get('room') || 'general';
    if (roomFromUrl !== selectedRoom) {
      setSelectedRoom(roomFromUrl);
    }
  }, [location, selectedRoom]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Enhanced utility functions
  const playNotificationSound = useCallback(() => {
    if (soundEnabled) {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }, [soundEnabled]);

  const markMessagesAsRead = useCallback(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      setLastReadMessageId(latestMessage.id);
      setUnreadCount(0);
    }
  }, [messages]);

  // Enhanced WebSocket connection with reconnection logic
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = useCallback(() => {
    if (!selectedRoom) return;

    setConnectionStatus('connecting');
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?wallet=${MOCK_WALLET}&room=${selectedRoom}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Connected to chat WebSocket');
      setSocket(ws);
      setConnectionStatus('connected');
      setReconnectAttempts(0);
      toast({
        title: "Connected",
        description: `Joined ${selectedRoom} room`,
      });
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message':
          case 'token_share':
            setMessages(prev => [...prev, data]);
            if (data.senderWallet !== MOCK_WALLET) {
              setUnreadCount(prev => prev + 1);
              playNotificationSound();
            }
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
          case 'reaction':
            setMessages(prev => prev.map(msg => 
              msg.id === data.messageId 
                ? { ...msg, reactions: data.reactions } 
                : msg
            ));
            break;
          case 'edit':
            setMessages(prev => prev.map(msg => 
              msg.id === data.messageId 
                ? { ...msg, message: data.message, isEdited: true } 
                : msg
            ));
            break;
          case 'pin':
            if (data.isPinned) {
              setPinnedMessages(prev => [...prev, data]);
            } else {
              setPinnedMessages(prev => prev.filter(msg => msg.id !== data.messageId));
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
      console.log('Disconnected from chat WebSocket');
      setSocket(null);
      setConnectionStatus('disconnected');
      
      // Attempt reconnection if not intentional
      if (reconnectAttempts < 5) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000); // Exponential backoff
        reconnectIntervalRef.current = setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connectWebSocket();
        }, delay);
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection Failed",
          description: "Unable to maintain chat connection. Please refresh.",
          variant: "destructive"
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    return () => {
      if (reconnectIntervalRef.current) {
        clearTimeout(reconnectIntervalRef.current);
      }
      ws.close();
    };
  }, [selectedRoom, playNotificationSound, toast]);

  // WebSocket connection effect
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (reconnectIntervalRef.current) {
        clearTimeout(reconnectIntervalRef.current);
      }
    };
  }, [connectWebSocket]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced message sending with reply support
  const sendMessage = useCallback(() => {
    if (!socket || !message.trim()) return;

    const messageData = {
      type: editingMessage ? 'edit_message' : 'send_message',
      message: message.trim(),
      roomId: selectedRoom,
      replyTo: replyingTo?.id,
      messageId: editingMessage
    };

    socket.send(JSON.stringify(messageData));
    setMessage('');
    setReplyingTo(null);
    setEditingMessage(null);
  }, [socket, message, selectedRoom, replyingTo, editingMessage]);

  // Enhanced typing indicator
  const handleTyping = useCallback(() => {
    if (!socket) return;
    
    socket.send(JSON.stringify({
      type: 'typing',
      isTyping: true,
      roomId: selectedRoom
    }));
  }, [socket, selectedRoom]);

  // Message reactions
  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'add_reaction',
      messageId,
      emoji,
      roomId: selectedRoom
    }));
  }, [socket, selectedRoom]);

  // Pin/unpin messages
  const togglePin = useCallback((messageId: string, isPinned: boolean) => {
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'toggle_pin',
      messageId,
      isPinned: !isPinned,
      roomId: selectedRoom
    }));
  }, [socket, selectedRoom]);

  // Create new room
  const createRoom = useMutation({
    mutationFn: async (roomData: { name: string; description?: string }) => {
      const response = await apiRequest('POST', '/api/chat/rooms', roomData);
      return response.json();
    },
    onSuccess: (room) => {
      toast({
        title: "Room Created",
        description: `Successfully created ${room.name}`,
      });
      setIsCreatingRoom(false);
      setNewRoomName('');
      setNewRoomDescription('');
      queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive"
      });
    }
  });

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
    } else if (e.key === 'Escape') {
      setReplyingTo(null);
      setEditingMessage(null);
    } else {
      handleTyping();
    }
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter(msg => 
    !searchQuery || 
    msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.senderWallet?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Enhanced reaction system with premium reactions
  const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '😡', '🚀', '⚡'];
  const premiumReactions = ['🔥', '💎', '🌟', '👑', '💰', '🎯', '⭐', '🌈', '🦋', '✨'];
  
  // Premium features and monetization
  const premiumFeatures = [
    { name: 'Custom Reactions', price: 5, icon: Sparkles },
    { name: 'Premium Themes', price: 10, icon: Palette },
    { name: 'Voice Messages', price: 15, icon: Mic },
    { name: 'File Sharing', price: 20, icon: Paperclip },
    { name: 'AI Chat Assistant', price: 25, icon: Bot },
    { name: 'Priority Support', price: 30, icon: Crown }
  ];
  
  const availableThemes = [
    { id: 'electric', name: 'Electric Blue', preview: 'from-blue-600 to-purple-600' },
    { id: 'fire', name: 'Fire Orange', preview: 'from-orange-500 to-red-600', premium: true },
    { id: 'forest', name: 'Forest Green', preview: 'from-green-500 to-emerald-600', premium: true },
    { id: 'sunset', name: 'Sunset Pink', preview: 'from-pink-500 to-purple-600', premium: true },
    { id: 'ocean', name: 'Ocean Depths', preview: 'from-cyan-500 to-blue-700', premium: true },
    { id: 'galaxy', name: 'Galaxy Purple', preview: 'from-purple-600 to-indigo-800', premium: true }
  ];

  // Focus message input when replying
  useEffect(() => {
    if (replyingTo && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [replyingTo]);

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
    <TooltipProvider>
      <div className={`min-h-screen p-6 pt-20 bg-transparent ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 pt-6' : ''}`}>
        <div className="mx-auto max-w-7xl">
          {/* World-Class Header with User Progress */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-600 bg-clip-text text-transparent">
                    Flutterbye Chat
                  </h1>
                  <p className="text-slate-400 mt-1">Enterprise blockchain messaging platform</p>
                </div>
                
                {/* Premium Badge */}
                {isPremiumUser && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              
              {/* User Level & XP System */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">Level {userLevel}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-20 h-1 bg-slate-700 rounded-full">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                        style={{ width: `${(userXP / nextLevelXP) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{userXP}/{nextLevelXP} XP</span>
                  </div>
                </div>
                
                {/* Daily Streak */}
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-400">{dailyStreak}</span>
                  </div>
                  <div className="text-xs text-slate-400">day streak</div>
                </div>
                
                {/* Enhanced Chat Controls */}
                <div className="flex items-center gap-2">
                  {/* Connection Status Indicator */}
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                      connectionStatus === 'connecting' ? 'bg-yellow-500 animate-spin' :
                      connectionStatus === 'disconnected' ? 'bg-gray-500' :
                      'bg-red-500 animate-pulse'
                    }`} />
                    <span className="text-xs text-slate-400">
                      {connectionStatus === 'connected' ? 'Online' :
                       connectionStatus === 'connecting' ? 'Connecting...' :
                       connectionStatus === 'disconnected' ? 'Offline' :
                       'Error'}
                    </span>
                  </div>

                  {/* Unread messages indicator */}
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white animate-pulse">
                      {unreadCount} unread
                    </Badge>
                  )}
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="border-purple-500/20"
                      >
                        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Sound notifications</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="border-purple-500/20"
                      >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fullscreen mode</TooltipContent>
                  </Tooltip>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPremiumModal(true)}
                    className="border-yellow-500/20 hover:bg-yellow-900/20 text-yellow-400"
                  >
                    <Crown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Premium Upgrade Banner */}
            {!isPremiumUser && (
              <Card className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="font-medium text-purple-300">Unlock Premium Features</h3>
                        <p className="text-sm text-slate-400">Voice messages, custom themes, AI assistant & more</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowPremiumModal(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[700px]'}`}>
            {/* Enhanced Room List */}
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Hash className="w-5 h-5" />
                    Rooms
                  </CardTitle>
                  <Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-purple-500/20">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-purple-500/20">
                      <DialogHeader>
                        <DialogTitle className="text-purple-400">Create New Room</DialogTitle>
                        <DialogDescription>
                          Create a new chat room for your community
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Input
                            placeholder="Room name"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            className="bg-slate-800 border-purple-500/20"
                          />
                        </div>
                        <div>
                          <Textarea
                            placeholder="Room description (optional)"
                            value={newRoomDescription}
                            onChange={(e) => setNewRoomDescription(e.target.value)}
                            className="bg-slate-800 border-purple-500/20"
                          />
                        </div>
                        <Button
                          onClick={() => createRoom.mutate({ name: newRoomName, description: newRoomDescription })}
                          disabled={!newRoomName.trim() || createRoom.isPending}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          {createRoom.isPending ? 'Creating...' : 'Create Room'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roomsLoading ? (
                    <div className="text-gray-400 animate-pulse">Loading rooms...</div>
                  ) : (
                    rooms?.map((room) => (
                      <Button
                        key={room.id}
                        variant={selectedRoom === room.id ? "secondary" : "ghost"}
                        className={`w-full justify-start transition-all duration-200 ${
                          selectedRoom === room.id 
                            ? 'bg-purple-600/20 border border-purple-500/30' 
                            : 'hover:bg-purple-900/20'
                        }`}
                        onClick={() => setSelectedRoom(room.id)}
                      >
                        <Hash className="w-4 h-4 mr-2" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{room.name}</div>
                          {room.description && (
                            <div className="text-xs text-gray-400 truncate">{room.description}</div>
                          )}
                        </div>
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

            {/* Enhanced Chat Area */}
            <Card className="lg:col-span-2 bg-slate-900/50 border-purple-500/20 flex flex-col backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <MessageSquare className="w-5 h-5" />
                    #{selectedRoom}
                    {socket && (
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        <Circle className="w-2 h-2 mr-1 fill-green-400" />
                        Connected
                      </Badge>
                    )}
                  </CardTitle>
                  
                  {/* Chat Search */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-48 bg-slate-800 border-purple-500/20 text-sm"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                      className="border-purple-500/20"
                    >
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Pinned Messages */}
                {pinnedMessages.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
                      <Pin className="w-3 h-3" />
                      Pinned Messages
                    </div>
                    {pinnedMessages.slice(0, 2).map(msg => (
                      <div key={msg.id} className="bg-purple-900/20 rounded-lg p-2 border border-purple-500/20">
                        <div className="text-xs text-purple-400">{truncateWallet(msg.senderWallet || '')}</div>
                        <div className="text-sm text-white truncate">{msg.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {filteredMessages.map((msg) => (
                      <div key={msg.id} className="group relative">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                              {msg.senderWallet?.slice(0, 2) || '??'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            {/* Reply indicator */}
                            {msg.replyTo && (
                              <div className="mb-2 ml-4 pl-3 border-l-2 border-purple-500/30 bg-purple-900/10 rounded-r p-2">
                                <div className="text-xs text-purple-400">Replying to {truncateWallet(msg.replyTo)}</div>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-purple-400">
                                {truncateWallet(msg.senderWallet || 'Unknown')}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTime(msg.timestamp)}
                              </span>
                              {msg.isEdited && (
                                <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                                  edited
                                </Badge>
                              )}
                              {msg.isPinned && (
                                <Pin className="w-3 h-3 text-yellow-400" />
                              )}
                            </div>
                            
                            {/* Message Content */}
                            {msg.type === 'token_share' ? (
                              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-3 border border-purple-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Coins className="w-4 h-4 text-yellow-400" />
                                  <span className="text-sm text-purple-400">Shared Token</span>
                                  <Badge className="bg-yellow-500/20 text-yellow-400">
                                    <Zap className="w-3 h-3 mr-1" />
                                    FLBY Token
                                  </Badge>
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
                              <div className="text-sm text-gray-300 bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                                {msg.message}
                              </div>
                            )}
                            
                            {/* Reactions */}
                            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {Object.entries(msg.reactions).map(([emoji, wallets]) => (
                                  <Button
                                    key={emoji}
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2 text-xs border-purple-500/20 hover:bg-purple-900/20"
                                    onClick={() => addReaction(msg.id, emoji)}
                                  >
                                    {emoji} {wallets.length}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Message Actions */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setReplyingTo(msg)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Reply className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Reply</TooltipContent>
                            </Tooltip>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Smile className="w-3 h-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-slate-900 border-purple-500/20 w-auto">
                                <div className="grid grid-cols-4 gap-2 p-4">
                                  {commonReactions.map(emoji => (
                                    <Button
                                      key={emoji}
                                      variant="ghost"
                                      className="text-lg hover:bg-purple-900/20"
                                      onClick={() => addReaction(msg.id, emoji)}
                                    >
                                      {emoji}
                                    </Button>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {msg.senderWallet === MOCK_WALLET && (
                              <>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingMessage(msg.id);
                                        setMessage(msg.message || '');
                                      }}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit</TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => togglePin(msg.id, msg.isPinned || false)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Pin className="w-3 h-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Pin Message</TooltipContent>
                                </Tooltip>
                              </>
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
                        {isTyping.filter(wallet => wallet !== MOCK_WALLET).map(wallet => truncateWallet(wallet)).join(', ')} typing...
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Reply/Edit Indicator */}
                {(replyingTo || editingMessage) && (
                  <div className="mb-3 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20 flex items-center justify-between">
                    <div className="text-sm">
                      {replyingTo && (
                        <div>
                          <span className="text-purple-400">Replying to:</span>
                          <span className="text-white ml-2">{truncateWallet(replyingTo.senderWallet || '')}</span>
                        </div>
                      )}
                      {editingMessage && (
                        <div>
                          <span className="text-yellow-400">Editing message</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(null);
                        setEditingMessage(null);
                        setMessage('');
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                )}

                {/* Enhanced Message Input with Premium Features */}
                <div className="space-y-3">
                  {/* Message Type Selector */}
                  <div className="flex items-center gap-2">
                    <Tabs value={messageType} onValueChange={(value) => setMessageType(value as any)} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                        <TabsTrigger value="text" className="text-xs">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Text
                        </TabsTrigger>
                        <TabsTrigger value="token" className="text-xs">
                          <Coins className="w-3 h-3 mr-1" />
                          Token
                        </TabsTrigger>
                        <TabsTrigger value="nft" className="text-xs" disabled={!isPremiumUser}>
                          <Image className="w-3 h-3 mr-1" />
                          NFT {!isPremiumUser && <Lock className="w-2 h-2 ml-1" />}
                        </TabsTrigger>
                        <TabsTrigger value="poll" className="text-xs" disabled={!isPremiumUser}>
                          <BarChart3 className="w-3 h-3 mr-1" />
                          Poll {!isPremiumUser && <Lock className="w-2 h-2 ml-1" />}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      {/* AI Typing Mode Indicator */}
                      {currentTypingMode === 'ai' && (
                        <div className="flex items-center gap-2 text-xs text-cyan-400">
                          <Bot className="w-3 h-3" />
                          AI Assistant is helping you craft this message...
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Textarea
                          ref={messageInputRef}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder={
                            messageType === 'token' ? 'Share a token with the room...' :
                            messageType === 'nft' ? 'Share an NFT (Premium feature)...' :
                            messageType === 'poll' ? 'Create a poll (Premium feature)...' :
                            replyingTo ? `Reply to ${truncateWallet(replyingTo.senderWallet || '')}...` : 
                            "Type your message..."
                          }
                          className={`min-h-[50px] max-h-[100px] bg-slate-800/50 border-purple-500/20 resize-none ${
                            currentTypingMode === 'ai' ? 'border-cyan-500/50' : ''
                          }`}
                          disabled={!socket}
                        />
                        
                        {/* AI Enhancement Integration */}
                        {currentTypingMode === 'ai' && message.length > 5 && (
                          <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4 text-cyan-400 animate-pulse" />
                              <span className="text-sm text-cyan-400 font-medium">AI Assistant Active</span>
                            </div>
                            <p className="text-xs text-white/70">
                              AI is analyzing your message for optimization, sentiment, and viral potential...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {/* Premium Features */}
                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={`border-purple-500/20 hover:bg-purple-900/20 w-8 h-8 p-0 ${showVoiceRecorder ? 'bg-purple-900/30 border-purple-400/50' : ''}`}
                              onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                            >
                              <Mic className={`w-3 h-3 ${showVoiceRecorder ? 'text-purple-400 animate-pulse' : 'text-gray-400'}`} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isPremiumUser ? 'Voice message' : 'Premium: Voice messages'}
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-purple-500/20 w-8 h-8 p-0"
                              disabled={!isPremiumUser}
                              onClick={() => {
                                if (isPremiumUser) setShowGifPicker(true);
                                else setShowPremiumModal(true);
                              }}
                            >
                              <Image className="w-3 h-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isPremiumUser ? 'Attach file' : 'Premium: File sharing'}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      {/* AI Assistant Toggle */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`border-purple-500/20 w-8 h-8 p-0 ${
                              currentTypingMode === 'ai' ? 'bg-cyan-900/30 border-cyan-500/50' : ''
                            }`}
                            disabled={!isPremiumUser}
                            onClick={() => {
                              if (isPremiumUser) {
                                setCurrentTypingMode(prev => prev === 'ai' ? 'normal' : 'ai');
                              } else {
                                setShowPremiumModal(true);
                              }
                            }}
                          >
                            <Bot className={`w-3 h-3 ${currentTypingMode === 'ai' ? 'text-cyan-400' : ''}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isPremiumUser ? 'AI Assistant' : 'Premium: AI message helper'}
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Send Button */}
                      <Button 
                        onClick={sendMessage}
                        disabled={!socket || (!message.trim() && !attachedVoice)}
                        className="bg-purple-600 hover:bg-purple-700 w-8 h-8 p-0"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                      
                      {/* Emoji Picker */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="border-purple-500/20 w-8 h-8 p-0">
                            <Smile className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-purple-500/20 w-auto">
                          <div className="space-y-4 p-4">
                            <div>
                              <h3 className="text-sm font-medium text-white mb-2">Common Reactions</h3>
                              <div className="grid grid-cols-4 gap-2">
                                {commonReactions.map(emoji => (
                                  <Button
                                    key={emoji}
                                    variant="ghost"
                                    className="text-lg hover:bg-purple-900/20"
                                    onClick={() => setMessage(prev => prev + emoji)}
                                  >
                                    {emoji}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            
                            {isPremiumUser && (
                              <div>
                                <h3 className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-1">
                                  <Crown className="w-3 h-3" />
                                  Premium Reactions
                                </h3>
                                <div className="grid grid-cols-5 gap-2">
                                  {premiumReactions.map(emoji => (
                                    <Button
                                      key={emoji}
                                      variant="ghost"
                                      className="text-lg hover:bg-yellow-900/20"
                                      onClick={() => setMessage(prev => prev + emoji)}
                                    >
                                      {emoji}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  {/* Voice Message Recorder */}
                  {showVoiceRecorder && (
                    <div className="mt-3">
                      <VoiceMessageRecorder
                        onVoiceAttached={(voiceData) => {
                          setAttachedVoice(voiceData);
                          toast({
                            title: "Voice Attached!",
                            description: `${voiceData.type === 'voice' ? 'Voice message' : 'Music'} ready to send`
                          });
                        }}
                        maxDuration={120}
                        showMusicUpload={true}
                      />
                    </div>
                  )}
                  
                  {/* Attached Voice Preview */}
                  {attachedVoice && (
                    <div className="mt-3 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                            {attachedVoice.type === 'voice' ? 
                              <Mic className="w-4 h-4 text-purple-400" /> : 
                              <Volume2 className="w-4 h-4 text-purple-400" />
                            }
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {attachedVoice.type === 'voice' ? 'Voice Message' : 'Background Music'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {Math.round(attachedVoice.duration)}s duration
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAttachedVoice(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Participants & Features */}
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Users className="w-5 h-5" />
                  Users ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Online Participants */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-purple-400 uppercase tracking-wider">Online Now</div>
                  {participants.length > 0 ? (
                    participants.map((participant) => (
                      <div key={participant} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-900/20 transition-colors">
                        <div className="relative">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
                              {participant.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-300">{truncateWallet(participant)}</div>
                          <div className="text-xs text-green-400">Active</div>
                        </div>
                        {participant === MOCK_WALLET && (
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">You</Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 italic">No one online yet</div>
                  )}
                </div>

                {/* Chat Stats */}
                <div className="border-t border-purple-500/20 pt-4">
                  <div className="text-xs font-medium text-purple-400 uppercase tracking-wider mb-2">Room Stats</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Messages</span>
                      <span className="text-white">{messages.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tokens Shared</span>
                      <span className="text-white">{messages.filter(m => m.type === 'token_share').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Pinned</span>
                      <span className="text-white">{pinnedMessages.length}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="border-t border-purple-500/20 pt-4">
                  <div className="text-xs font-medium text-purple-400 uppercase tracking-wider mb-2">Quick Actions</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareToken("example_mint_address")}
                      className="border-purple-500/20 hover:bg-purple-900/20 text-xs"
                      disabled={!socket}
                    >
                      <Gift className="w-3 h-3 mr-1" />
                      Share Token
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        toast({ title: "Link copied!", description: "Share this room with others" });
                      }}
                      className="border-purple-500/20 hover:bg-purple-900/20 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy Link
                    </Button>
                  </div>
                </div>

                {/* Room Settings */}
                <div className="border-t border-purple-500/20 pt-4">
                  <div className="text-xs font-medium text-purple-400 uppercase tracking-wider mb-2">Settings</div>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs hover:bg-purple-900/20"
                      onClick={() => markMessagesAsRead()}
                    >
                      <CheckCircle2 className="w-3 h-3 mr-2" />
                      Mark All Read
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs hover:bg-purple-900/20"
                      onClick={() => {
                        setMessages([]);
                        toast({ title: "Chat cleared", description: "Local message history cleared" });
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Clear History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Quick Actions */}
          <Card className="mt-6 bg-slate-900/50 border-purple-500/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Advanced Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="share" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger value="share" className="text-xs">Token Share</TabsTrigger>
                  <TabsTrigger value="room" className="text-xs">Room Tools</TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="share" className="space-y-3 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => shareToken("flby_token_123")}
                      className="border-yellow-500/20 hover:bg-yellow-900/20 text-yellow-400"
                      disabled={!socket}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      Share FLBY
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Token Gift",
                          description: "Send a token as a gift to the room",
                        });
                      }}
                      className="border-pink-500/20 hover:bg-pink-900/20 text-pink-400"
                      disabled={!socket}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Gift Token
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-purple-500/20 hover:bg-purple-900/20"
                    disabled={!socket}
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Custom token creation will be available soon",
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Custom Token
                  </Button>
                </TabsContent>
                
                <TabsContent value="room" className="space-y-3 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const url = `${window.location.origin}/chat?room=${selectedRoom}`;
                        navigator.clipboard?.writeText(url);
                        toast({ title: "Room link copied!" });
                      }}
                      className="border-blue-500/20 hover:bg-blue-900/20 text-blue-400"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Room
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingRoom(true)}
                      className="border-green-500/20 hover:bg-green-900/20 text-green-400"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Room
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-orange-500/20 hover:bg-orange-900/20 text-orange-400"
                    onClick={() => {
                      toast({
                        title: "Room Analytics",
                        description: `${messages.length} messages, ${participants.length} active users`,
                      });
                    }}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Room Analytics
                  </Button>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Sound Notifications</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={soundEnabled ? "border-green-500/20 text-green-400" : "border-gray-500/20 text-gray-400"}
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Fullscreen Mode</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="border-purple-500/20 hover:bg-purple-900/20"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-red-500/20 hover:bg-red-900/20 text-red-400"
                    onClick={() => {
                      setMessages([]);
                      setUnreadCount(0);
                      toast({ title: "Chat reset", description: "All local data cleared" });
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Chat
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium Features Modal */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent className="bg-slate-900 border-purple-500/20 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              Flutterbye Premium
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Unlock powerful features and elevate your blockchain messaging experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Pricing Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic Plan */}
              <Card className="border-slate-700 relative">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">Basic</h3>
                    <div className="text-3xl font-bold text-purple-400 mt-2">$9.99</div>
                    <div className="text-sm text-slate-400">per month</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Custom Reactions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Premium Themes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Voice Messages</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    Choose Basic
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan - Most Popular */}
              <Card className="border-yellow-500/50 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                    Most Popular
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-yellow-400">Pro</h3>
                    <div className="text-3xl font-bold text-yellow-400 mt-2">$19.99</div>
                    <div className="text-sm text-slate-400">per month</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Everything in Basic</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>AI Chat Assistant</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>File Sharing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>NFT Integration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Poll Creation</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold">
                    Choose Pro
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="border-cyan-500/50 relative">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-cyan-400">Enterprise</h3>
                    <div className="text-3xl font-bold text-cyan-400 mt-2">$49.99</div>
                    <div className="text-sm text-slate-400">per month</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Everything in Pro</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Priority Support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>White-label Options</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>API Access</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700">
                    Choose Enterprise
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Feature Comparison */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Premium Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {premiumFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className="border-purple-500/20 bg-slate-800/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-600/20 rounded-lg">
                            <IconComponent className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{feature.name}</h4>
                            <p className="text-sm text-slate-400">${feature.price}/month value</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Theme Previews */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Premium Themes</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {availableThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`relative p-3 rounded-lg cursor-pointer transition-all ${
                      selectedTheme === theme.id ? 'ring-2 ring-purple-500' : ''
                    } ${
                      theme.premium && !isPremiumUser ? 'opacity-50' : ''
                    }`}
                    onClick={() => {
                      if (!theme.premium || isPremiumUser) {
                        setSelectedTheme(theme.id);
                      }
                    }}
                  >
                    <div className={`w-full h-8 bg-gradient-to-r ${theme.preview} rounded`} />
                    <div className="text-xs text-center mt-1 text-white">{theme.name}</div>
                    {theme.premium && (
                      <div className="absolute top-1 right-1">
                        <Crown className="w-3 h-3 text-yellow-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Analytics */}
            <div className="border-t border-slate-700 pt-6">
              <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <div>
                      <h3 className="font-medium text-green-300">Revenue Potential</h3>
                      <p className="text-sm text-slate-400">Estimated monthly earnings from premium features</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">$127K</div>
                    <div className="text-sm text-slate-400">projected monthly</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}