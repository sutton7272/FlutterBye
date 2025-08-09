import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Sparkles, User, Bot, TrendingUp, Clock } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface EmotionalAnalysis {
  emotion: string;
  mood: string;
  sentiment: string;
  adaptedPersonality: {
    warmth: number;
    formality: number;
    enthusiasm: number;
    supportiveness: number;
  };
}

interface UserMemory {
  interactionCount: number;
  knownInterests: string[];
  trustLevel: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotionalAnalysis?: EmotionalAnalysis;
  memory?: UserMemory;
}

interface EnhancedSkyeChatProps {
  userId?: string;
  walletAddress?: string;
  isVisible: boolean;
  onClose: () => void;
}

export function EnhancedSkyeChat({ userId = 'demo-user', walletAddress = 'demo-wallet', isVisible, onClose }: EnhancedSkyeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Skye, your enhanced AI companion with emotional intelligence and deep learning memory. I can understand your mood, remember our conversations, and adapt my personality to better assist you. How are you feeling today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [userMemory, setUserMemory] = useState<UserMemory | null>(null);
  const [predictions, setPredictions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef(`conv_${Date.now()}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user memory on mount
  useEffect(() => {
    if (userId && walletAddress) {
      loadUserMemory();
      loadPredictions();
    }
  }, [userId, walletAddress]);

  const loadUserMemory = async () => {
    try {
      const response = await apiRequest(`/api/skye/memory/${userId}?walletAddress=${walletAddress}`);
      if (response.memory) {
        setUserMemory(response.memory);
      }
    } catch (error) {
      console.error('Failed to load user memory:', error);
    }
  };

  const loadPredictions = async () => {
    try {
      const response = await apiRequest('/api/skye/predict-needs', {
        method: 'POST',
        body: JSON.stringify({ userId, walletAddress })
      });
      setPredictions(response.predictions || []);
    } catch (error) {
      console.error('Failed to load predictions:', error);
    }
  };

  const analyzeEmotion = async (message: string) => {
    try {
      const response = await apiRequest('/api/skye/analyze-emotion', {
        method: 'POST',
        body: JSON.stringify({
          message,
          userId,
          conversationId: conversationId.current
        })
      });
      return response.analysis;
    } catch (error) {
      console.error('Failed to analyze emotion:', error);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use enhanced chat endpoint with emotional intelligence
      const response = await apiRequest('/api/skye/enhanced-chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage.content,
          userId,
          walletAddress,
          conversationId: conversationId.current
        })
      });

      if (response.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
          emotionalAnalysis: response.emotionalAnalysis,
          memory: response.memory
        };

        setMessages(prev => [...prev, assistantMessage]);
        setCurrentEmotion(response.emotionalAnalysis?.emotion);
        setUserMemory(response.memory);

        // Update predictions after conversation
        loadPredictions();
      }
    } catch (error) {
      console.error('Enhanced chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your message. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const usePrediction = (prediction: string) => {
    setInput(prediction);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col bg-gray-900 border-purple-500/30">
        <CardHeader className="flex-shrink-0 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-8 w-8 text-purple-400" />
                <Sparkles className="h-4 w-4 text-purple-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  Enhanced Skye AI
                  <Badge variant="outline" className="text-purple-300 border-purple-500/50">
                    Emotional Intelligence
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  {currentEmotion && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-pink-400" />
                      <span>Detected: {currentEmotion}</span>
                    </div>
                  )}
                  {userMemory && (
                    <div className="flex items-center gap-1">
                      <Brain className="h-3 w-3 text-blue-400" />
                      <span>Trust: {userMemory.trustLevel}/10</span>
                    </div>
                  )}
                  {userMemory && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span>{userMemory.interactionCount} chats</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Predictions Panel */}
          {predictions.length > 0 && (
            <div className="p-4 border-b border-purple-500/20 bg-gray-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300 font-medium">Predicted needs:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {predictions.slice(0, 3).map((prediction, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => usePrediction(prediction)}
                    className="text-xs text-purple-300 border-purple-500/50 hover:bg-purple-500/20"
                  >
                    {prediction}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* User Memory Panel */}
          {userMemory && userMemory.knownInterests.length > 0 && (
            <div className="p-4 border-b border-purple-500/20 bg-gray-800/30">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">Known interests:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {userMemory.knownInterests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-blue-300 border-blue-500/50">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white ml-auto'
                        : 'bg-gray-800 text-gray-100 border border-purple-500/20'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Emotional Analysis Display */}
                    {message.emotionalAnalysis && message.role === 'assistant' && (
                      <div className="mt-2 pt-2 border-t border-purple-500/20">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-pink-400" />
                            <span className="text-pink-300">{message.emotionalAnalysis.emotion}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Brain className="h-3 w-3 text-blue-400" />
                            <span className="text-blue-300">{message.emotionalAnalysis.mood}</span>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          Warmth: {message.emotionalAnalysis.adaptedPersonality.warmth}/10 |
                          Support: {message.emotionalAnalysis.adaptedPersonality.supportiveness}/10
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <Clock className="h-3 w-3" />
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                
                <div className={`flex-shrink-0 ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                  {message.role === 'user' ? (
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-800 border border-purple-500/30 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-purple-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gray-800 border border-purple-500/30 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-purple-400" />
                </div>
                <div className="bg-gray-800 border border-purple-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-purple-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="text-sm ml-2">Analyzing emotion and generating response...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-purple-500/20 bg-gray-800/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... I'll analyze your emotion and adapt my response"
                className="flex-1 bg-gray-900 border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-400"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
              <span>Enhanced with emotional intelligence and memory</span>
              <Badge variant="outline" className="text-purple-300 border-purple-500/50">
                Deep Learning
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}