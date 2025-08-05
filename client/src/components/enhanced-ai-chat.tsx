import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Send, 
  Mic, 
  MicOff, 
  Settings, 
  Sparkles, 
  TrendingUp, 
  Wallet, 
  Activity, 
  Hash,
  MessageSquare,
  Zap,
  Star,
  Clock,
  ChevronDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "./websocket-provider";
import { ChatSkeleton, AIAnalysisSkeleton } from "./smart-loading-states";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  confidence?: number;
  sources?: string[];
  suggestions?: string[];
  metadata?: any;
}

interface AIPersonality {
  id: string;
  name: string;
  description: string;
  expertise: string[];
  tone: 'professional' | 'friendly' | 'technical' | 'casual';
  icon: any;
}

const AI_PERSONALITIES: AIPersonality[] = [
  {
    id: 'aria',
    name: 'ARIA',
    description: 'Advanced blockchain intelligence specialist',
    expertise: ['DeFi Analysis', 'Risk Assessment', 'Market Intelligence', 'Wallet Analytics'],
    tone: 'professional',
    icon: Brain
  },
  {
    id: 'quantum',
    name: 'Quantum',
    description: 'Multi-chain technical analyst',
    expertise: ['Cross-chain Analysis', 'Smart Contracts', 'Protocol Intelligence', 'Security'],
    tone: 'technical',
    icon: Zap
  },
  {
    id: 'nova',
    name: 'Nova',
    description: 'Social and trend analysis expert',
    expertise: ['Social Intelligence', 'Viral Patterns', 'Community Analysis', 'Trend Prediction'],
    tone: 'friendly',
    icon: Star
  }
];

export function EnhancedAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your enhanced AI assistant. I can analyze blockchain data, predict market trends, assess wallet risks, and provide deep intelligence insights. How can I help you today?",
      timestamp: new Date(),
      confidence: 100,
      suggestions: [
        "Analyze a specific wallet address",
        "Show me trending DeFi protocols",
        "What are the latest market risks?",
        "Find high-value transactions"
      ]
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality>(AI_PERSONALITIES[0]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { sendMessage, lastMessage } = useWebSocket();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === 'ai_update') {
      const newMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: lastMessage.data.message || 'Received real-time intelligence update',
        timestamp: new Date(),
        confidence: lastMessage.data.confidence || 95,
        sources: lastMessage.data.sources,
        metadata: lastMessage.data
      };
      setMessages(prev => [...prev, newMessage]);
    }
  }, [lastMessage]);

  // Enhanced AI chat mutation
  const sendChatMessage = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/ai/enhanced-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          personality: selectedPersonality.id,
          context: messages.slice(-5), // Last 5 messages for context
          features: {
            realTimeData: true,
            crossChainAnalysis: true,
            riskAssessment: true,
            marketIntelligence: true
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        confidence: data.confidence,
        sources: data.sources,
        suggestions: data.suggestions,
        metadata: data.metadata
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Send to WebSocket for real-time updates
      sendMessage({
        type: 'ai_chat',
        data: aiMessage
      });
    },
    onError: () => {
      setIsTyping(false);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim() || sendChatMessage.isPending) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    sendChatMessage.mutate(currentMessage);
    setCurrentMessage("");
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentMessage(transcript);
      };

      recognition.start();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const regenerateResponse = (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex > 0) {
      const previousUserMessage = messages[messageIndex - 1];
      if (previousUserMessage.type === 'user') {
        setIsTyping(true);
        sendChatMessage.mutate(previousUserMessage.content);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* AI Personality Selector */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <selectedPersonality.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{selectedPersonality.name}</CardTitle>
                <CardDescription>{selectedPersonality.description}</CardDescription>
              </div>
            </div>
            
            <Tabs value={selectedPersonality.id} onValueChange={(value) => {
              const personality = AI_PERSONALITIES.find(p => p.id === value);
              if (personality) setSelectedPersonality(personality);
            }}>
              <TabsList className="grid w-full grid-cols-3">
                {AI_PERSONALITIES.map((personality) => (
                  <TabsTrigger key={personality.id} value={personality.id} className="text-xs">
                    {personality.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedPersonality.expertise.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Chat Interface */}
      <Card className="bg-background/50 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Enhanced AI Chat
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live Intelligence
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Messages Area */}
          <ScrollArea className="h-96 px-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type !== 'user' && (
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] space-y-2 ${message.type === 'user' ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{message.type === 'user' ? 'You' : selectedPersonality.name}</span>
                      <Clock className="h-3 w-3" />
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.confidence && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {message.confidence}% confidence
                        </Badge>
                      )}
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : message.type === 'system'
                        ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-200'
                        : 'bg-muted'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <p className="text-xs text-muted-foreground mb-1">Sources:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.sources.map((source, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Suggested follow-ups:</p>
                        <div className="space-y-1">
                          {message.suggestions.map((suggestion, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 justify-start"
                              onClick={() => setCurrentMessage(suggestion)}
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {message.type === 'ai' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyMessage(message.content)}
                          className="h-6 px-2 text-xs"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => regenerateResponse(message.id)}
                          className="h-6 px-2 text-xs"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">You</span>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Brain className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Input Area */}
          <div className="p-6 border-t border-border/30">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder={`Ask ${selectedPersonality.name} anything about blockchain intelligence...`}
                  className="pr-12"
                  disabled={sendChatMessage.isPending}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 ${
                    isListening ? 'text-red-500' : 'text-muted-foreground'
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || sendChatMessage.isPending}
                className="px-6"
              >
                {sendChatMessage.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Press Enter to send</span>
                <span>•</span>
                <span>Shift+Enter for new line</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Real-time intelligence active</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}