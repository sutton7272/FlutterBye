import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAIContent } from '@/hooks/useAIContent';
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

  const {
    generateAIGreeting,
    isGeneratingGreeting,
    startConversation,
    isConversingWithAI,
    syncMoodWithAI,
    isSyncingMood,
    getSmartHelp,
    isGettingSmartHelp
  } = useAIContent();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate initial greeting
  useEffect(() => {
    if (initialGreeting && messages.length === 0) {
      handleInitialGreeting();
    }
  }, []);

  const handleInitialGreeting = async () => {
    try {
      const greetingResponse = await generateAIGreeting({
        userName,
        visitCount: 1,
        mood: userMood
      });

      if (greetingResponse?.greeting) {
        const greeting = greetingResponse.greeting;
        setMessages([{
          id: `msg_${Date.now()}`,
          role: 'ai',
          content: greeting.greeting,
          timestamp: new Date(),
          mood: greeting.mood,
          suggestions: greeting.conversationStarters
        }]);
        setUserMood(greeting.mood);
      }
    } catch (error) {
      console.error('Failed to generate greeting:', error);
      // Fallback greeting
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
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const conversationHistory = messages.slice(-5).map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      }));

      const response = await startConversation({
        message: inputMessage,
        conversationHistory,
        userContext: {
          userName,
          mood: userMood
        }
      });

      if (response?.conversation) {
        const aiMessage: Message = {
          id: `msg_${Date.now()}_ai`,
          role: 'ai',
          content: response.conversation.response,
          timestamp: new Date(),
          mood: response.conversation.emotionalTone,
          suggestions: response.conversation.suggestedFollowUps
        };

        setMessages(prev => [...prev, aiMessage]);
        setConversationId(response.conversationId || '');
        
        // Update mood if detected
        if (response.conversation.emotionalTone) {
          setUserMood(response.conversation.emotionalTone);
        }
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      // Fallback response
      const fallbackMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        role: 'ai',
        content: "I'm here to help! Could you tell me more about what you're looking for? I can assist with token creation, AI features, or any questions about Flutterbye.",
        timestamp: new Date(),
        suggestions: [
          "Tell me about your interests",
          "How can I assist you?",
          "What would you like to explore?"
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
      const recentMessages = messages.slice(-3).map(m => m.content).join(' ');
      const moodResponse = await syncMoodWithAI({
        userInput: recentMessages,
        behaviorData: { currentConversation: conversationId }
      });

      if (moodResponse?.moodAnalysis) {
        setUserMood(moodResponse.moodAnalysis.detectedMood);
      }
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
              disabled={isSyncingMood}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 items-center text-electric-blue"
            >
              <Bot className="w-4 h-4" />
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm">ARIA is thinking...</span>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {lastAIMessage?.suggestions && lastAIMessage.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {lastAIMessage.suggestions.slice(0, 3).map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                variant="ghost"
                size="sm"
                className="text-xs bg-electric-blue/10 hover:bg-electric-blue/20 text-electric-blue border border-electric-blue/20"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                {suggestion}
              </Button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask ARIA anything about Flutterbye..."
            className="bg-black/20 border-electric-blue/30 text-white placeholder:text-gray-400"
            disabled={isConversingWithAI || isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isConversingWithAI || isTyping}
            className="bg-electric-blue hover:bg-electric-blue/80"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        {!compactMode && (
          <div className="flex gap-2 pt-2 border-t border-electric-blue/20">
            <Button
              onClick={() => handleSuggestionClick("How do I create my first token?")}
              variant="ghost"
              size="sm"
              className="text-xs text-green-400 hover:text-green-300"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Create Token
            </Button>
            <Button
              onClick={() => handleSuggestionClick("Show me the AI features")}
              variant="ghost"
              size="sm"
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              <Brain className="w-3 h-3 mr-1" />
              AI Features
            </Button>
            <Button
              onClick={() => handleSuggestionClick("What makes Flutterbye special?")}
              variant="ghost"
              size="sm"
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              <Zap className="w-3 h-3 mr-1" />
              Learn More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}