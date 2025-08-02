import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Send, 
  Users, 
  Smile, 
  Reply, 
  Edit3, 
  Pin, 
  Heart, 
  Zap, 
  Star, 
  ThumbsUp,
  MessageCircle,
  Volume2,
  VolumeX,
  Settings,
  Crown,
  Gift,
  Flame,
  Target,
  Coffee,
  Rocket,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderWallet: string;
  message: string;
  messageType: string;
  reactions?: { [emoji: string]: string[] };
  replyTo?: string;
  isEdited?: boolean;
  isPinned?: boolean;
  threadCount?: number;
  createdAt: string;
}

interface ChatProps {
  roomId: string;
  userWallet: string;
  onLeaveRoom?: () => void;
}

const commonReactions = ['👍', '❤️', '😂', '🚀', '⚡', '🔥', '💎', '🎉'];

export function EnhancedChatInterface({ roomId, userWallet, onLeaveRoom }: ChatProps) {
  // Enhanced state management
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [replyingTo, setReplyingTo] = useState<EnhancedMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [pinnedMessages, setPinnedMessages] = useState<EnhancedMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Enhanced WebSocket connection with real authentication
  useEffect(() => {
    if (!roomId || !userWallet) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?wallet=${userWallet}&room=${roomId}`;
    
    const ws = new WebSocket(wsUrl);
    setConnectionStatus('connecting');

    ws.onopen = () => {
      console.log('Enhanced chat connected');
      setSocket(ws);
      setConnectionStatus('connected');
      toast({
        title: "Chat Connected",
        description: "Real-time messaging enabled",
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message':
            setMessages(prev => [...prev, data]);
            if (data.senderWallet !== userWallet) {
              setUnreadCount(prev => prev + 1);
              playNotificationSound();
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
            setMessages(prev => prev.map(msg => 
              msg.id === data.messageId 
                ? { ...msg, isPinned: data.isPinned }
                : msg
            ));
            if (data.isPinned) {
              setPinnedMessages(prev => [...prev, data]);
            } else {
              setPinnedMessages(prev => prev.filter(m => m.id !== data.messageId));
            }
            break;
          case 'join':
            setParticipants(prev => Array.from(new Set([...prev, data.senderWallet])));
            break;
          case 'leave':
            setParticipants(prev => prev.filter(p => p !== data.senderWallet));
            break;
          case 'typing':
            if (data.data?.isTyping && data.senderWallet !== userWallet) {
              setIsTyping(prev => Array.from(new Set([...prev, data.senderWallet])));
              setTimeout(() => {
                setIsTyping(prev => prev.filter(p => p !== data.senderWallet));
              }, 3000);
            }
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };

    return () => {
      ws.close();
    };
  }, [roomId, userWallet, toast]);

  // Enhanced notification sound
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Audio notification unavailable');
    }
  }, [soundEnabled]);

  // Enhanced message sending with reply and edit support
  const sendMessage = useCallback(() => {
    if (!message.trim() || !socket || connectionStatus !== 'connected') return;

    const messageData = {
      id: `msg_${Date.now()}`,
      type: editingMessage ? 'edit' : 'message',
      roomId,
      messageId: editingMessage || undefined,
      senderWallet: userWallet,
      message: message.trim(),
      replyTo: replyingTo?.id,
      timestamp: new Date().toISOString()
    };

    socket.send(JSON.stringify(messageData));
    setMessage('');
    setReplyingTo(null);
    setEditingMessage(null);
    
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [message, socket, connectionStatus, roomId, userWallet, editingMessage, replyingTo]);

  // Typing indicator
  const handleTyping = useCallback(() => {
    if (!socket || connectionStatus !== 'connected') return;

    socket.send(JSON.stringify({
      type: 'typing',
      roomId,
      senderWallet: userWallet,
      data: { isTyping: true },
      timestamp: new Date().toISOString()
    }));

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socket && connectionStatus === 'connected') {
        socket.send(JSON.stringify({
          type: 'typing',
          roomId,
          senderWallet: userWallet,
          data: { isTyping: false },
          timestamp: new Date().toISOString()
        }));
      }
    }, 1000);
  }, [socket, connectionStatus, roomId, userWallet]);

  // Reaction system
  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!socket || connectionStatus !== 'connected') return;

    socket.send(JSON.stringify({
      type: 'reaction',
      roomId,
      messageId,
      senderWallet: userWallet,
      emoji,
      timestamp: new Date().toISOString()
    }));
    
    setShowReactionPicker(null);
  }, [socket, connectionStatus, roomId, userWallet]);

  // Pin/Unpin messages
  const togglePin = useCallback((messageId: string, isPinned: boolean) => {
    if (!socket || connectionStatus !== 'connected') return;

    socket.send(JSON.stringify({
      type: 'pin',
      roomId,
      messageId,
      senderWallet: userWallet,
      isPinned: !isPinned,
      timestamp: new Date().toISOString()
    }));
  }, [socket, connectionStatus, roomId, userWallet]);

  // Utility functions
  const truncateWallet = (wallet: string) => 
    `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <Card className="bg-slate-900/50 border-purple-500/20 rounded-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400">Room: {roomId}</span>
              <Badge 
                variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
                className="ml-2"
              >
                {connectionStatus}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-purple-400 hover:text-purple-300"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Badge className="bg-green-500/20 text-green-400">
                <Users className="w-3 h-3 mr-1" />
                {participants.length}
              </Badge>
              {unreadCount > 0 && (
                <Badge className="bg-red-500/20 text-red-400">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {/* Pinned Messages */}
            {pinnedMessages.length > 0 && (
              <Card className="bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="p-3">
                  <div className="text-xs text-yellow-400 mb-2 flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    Pinned Messages
                  </div>
                  {pinnedMessages.map(msg => (
                    <div key={msg.id} className="text-sm text-gray-300 truncate">
                      {truncateWallet(msg.senderWallet)}: {msg.message}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Messages */}
            {messages.map((msg) => (
              <div key={msg.id} className="group">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                      {msg.senderWallet.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-purple-400">
                        {truncateWallet(msg.senderWallet)}
                      </span>
                      {msg.senderWallet === userWallet && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">You</Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.createdAt)}
                      </span>
                      {msg.isEdited && (
                        <Badge variant="outline" className="text-xs">edited</Badge>
                      )}
                      {msg.isPinned && (
                        <Pin className="w-3 h-3 text-yellow-400" />
                      )}
                    </div>
                    
                    {msg.replyTo && (
                      <div className="text-xs text-gray-400 mb-1 pl-2 border-l-2 border-purple-500/30">
                        Replying to previous message
                      </div>
                    )}
                    
                    <div className="text-white whitespace-pre-wrap break-words">
                      {msg.message}
                    </div>
                    
                    {/* Reactions */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                          <Badge
                            key={emoji}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-purple-900/20"
                            onClick={() => addReaction(msg.id, emoji)}
                          >
                            {emoji} {users.length}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Message Actions */}
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TooltipProvider>
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
                      </TooltipProvider>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Smile className="w-3 h-3" />
                      </Button>
                      
                      {msg.senderWallet === userWallet && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingMessage(msg.id);
                              setMessage(msg.message);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePin(msg.id, msg.isPinned || false)}
                            className="h-6 w-6 p-0"
                          >
                            <Pin className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {/* Reaction Picker */}
                    {showReactionPicker === msg.id && (
                      <div className="flex flex-wrap gap-1 mt-2 p-2 bg-slate-800 rounded-lg">
                        {commonReactions.map(emoji => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            className="text-lg hover:bg-purple-900/20 h-8 w-8 p-0"
                            onClick={() => addReaction(msg.id, emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicators */}
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
      </div>

      {/* Reply/Edit Indicator */}
      {(replyingTo || editingMessage) && (
        <Card className="bg-purple-900/20 border-purple-500/20 rounded-none">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                {replyingTo && (
                  <span className="text-purple-400">
                    Replying to: {truncateWallet(replyingTo.senderWallet)}
                  </span>
                )}
                {editingMessage && (
                  <span className="text-yellow-400">Editing message</span>
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
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Input */}
      <Card className="bg-slate-900/50 border-purple-500/20 rounded-none">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Textarea
              ref={messageInputRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
              className="flex-1 min-h-[40px] max-h-[120px] bg-slate-800 border-purple-500/20 text-white resize-none"
              disabled={connectionStatus !== 'connected'}
            />
            <Button
              onClick={sendMessage}
              disabled={!message.trim() || connectionStatus !== 'connected'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}