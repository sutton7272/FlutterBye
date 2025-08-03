import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Heart,
  Lightbulb,
  Zap,
  Brain
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  mood?: string;
  suggestions?: string[];
}

interface AIConversationProps {
  userName?: string;
  initialGreeting?: boolean;
  showMoodSync?: boolean;
  compactMode?: boolean;
}

export function AIConversation({ 
  userName = 'Explorer', 
  initialGreeting = true,
  showMoodSync = true,
  compactMode = false 
}: AIConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userMood, setUserMood] = useState<string>('curious');
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate initial greeting
  useEffect(() => {
    if (initialGreeting && messages.length === 0) {
      setMessages([{
        id: `msg_${Date.now()}`,
        role: 'ai',
        content: `Hello ${userName}! 🦋 I'm ARIA, your AI companion at Flutterbye. How can I help you explore our revolutionary blockchain communication platform today?`,
        timestamp: new Date(),
        suggestions: [
          "Tell me about token creation",
          "How does the AI work?",
          "Show me around the platform"
        ]
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the actual ARIA conversation API
      const response = await fetch('/api/ai/conversation/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          userContext: {
            userName,
            mood: userMood,
            userId: `user_${Date.now()}`,
            intent: 'conversation'
          },
          conversationHistory: messages.slice(-5).map(msg => ({
            role: msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.success && data.conversation) {
        const aiMessage: Message = {
          id: `msg_${Date.now()}_ai`,
          role: 'ai',
          content: data.conversation.response,
          timestamp: new Date(),
          mood: data.conversation.emotionalTone,
          suggestions: data.conversation.suggestedFollowUps || []
        };

        setMessages(prev => [...prev, aiMessage]);
        setConversationId(data.conversationId || '');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('AI conversation error:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        role: 'ai',
        content: "I'm experiencing some technical difficulties, but I'm still here to help! Could you try asking your question again?",
        timestamp: new Date(),
        suggestions: [
          "Tell me about Flutterbye features",
          "How do I create a token?", 
          "What can ARIA do?"
        ]
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const syncMood = async () => {
    try {
      // Update mood with a simple rotation for demo purposes
      const moods = ['curious', 'excited', 'focused', 'creative'];
      const currentIndex = moods.indexOf(userMood);
      const nextMood = moods[(currentIndex + 1) % moods.length];
      setUserMood(nextMood);
    } catch (error) {
      console.error('Mood sync failed:', error);
    }
  };

  const lastAIMessage = messages.filter(m => m.role === 'ai').pop();

  return (
    <Card className={`${compactMode ? 'max-h-96' : 'max-h-[600px]'} bg-black/20 border-electric-blue/30 backdrop-blur-lg`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-electric-blue" />
            <span className="text-white">AI Conversation</span>
            <Badge className="bg-electric-blue/20 text-electric-blue">ARIA</Badge>
          </div>
          {showMoodSync && (
            <Button
              onClick={syncMood}
              size="sm"
              variant="ghost"
              className="text-purple-400 hover:text-purple-300"
            >
              <Heart className="w-4 h-4 mr-1" />
              {userMood}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Messages */}
        <div className={`${compactMode ? 'max-h-48' : 'max-h-80'} overflow-y-auto space-y-3 pr-2`}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'ai' 
                      ? 'bg-electric-blue/20 text-electric-blue' 
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {message.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.role === 'ai'
                      ? 'bg-electric-blue/10 border border-electric-blue/20 text-white'
                      : 'bg-purple-500/20 border border-purple-500/30 text-white'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    {message.role === 'ai' && message.mood && (
                      <Badge variant="secondary" className="mt-2 text-xs bg-transparent border-electric-blue/30 text-electric-blue">
                        {message.mood}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-electric-blue/20 text-electric-blue flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-electric-blue/10 border border-electric-blue/20 rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse delay-200"></div>
                    <span className="text-white/70 text-sm ml-2">ARIA is thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* AI Suggestions */}
        {lastAIMessage?.suggestions && lastAIMessage.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-white/60 text-xs flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              Suggested responses:
            </p>
            <div className="flex flex-wrap gap-2">
              {lastAIMessage.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  size="sm"
                  variant="ghost"
                  className="text-electric-blue border border-electric-blue/30 hover:bg-electric-blue/10 text-xs h-7"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask ARIA anything about Flutterbye..."
              className="bg-black/30 border-electric-blue/20 text-white placeholder:text-white/40 focus:border-electric-blue/50"
              disabled={isTyping}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            size="sm"
            className="bg-electric-blue hover:bg-electric-blue/80 text-black px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* AI Status */}
        <div className="flex items-center justify-between text-xs text-white/40">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Powered by OpenAI GPT-4o</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            <span>ARIA v2.0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}