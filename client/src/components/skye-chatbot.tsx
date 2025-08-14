import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Clock, Zap, Brain } from "lucide-react";
import { SkyeCustomAvatar } from "./skye-custom-avatar";

interface Message {
  id: string;
  message: string;
  messageType: "user" | "assistant";
  createdAt: string;
}

interface ApiResponse {
  userMessage: Message;
  aiMessage: Message;
  conversation: any;
}

export function SkyeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Load persisted chat data on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('skye_messages');
    const savedSessionId = localStorage.getItem('skye_session_id');
    
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.warn('Failed to load saved messages');
      }
    }
    
    if (savedSessionId) {
      sessionId.current = savedSessionId;
    } else {
      localStorage.setItem('skye_session_id', sessionId.current);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('skye_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);
    
    // Add user message immediately
    const tempUserMsg: Message = {
      id: `temp_${Date.now()}`,
      message: userMessage,
      messageType: "user",
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    
    try {
      const response = await fetch('/api/flutterina/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          pageContext: '/',
          sessionId: sessionId.current
        })
      });
      
      if (response.ok) {
        const data: ApiResponse = await response.json();
        
        // Replace temp message with real user message and add AI response
        setMessages(prev => {
          const withoutTemp = prev.filter(msg => msg.id !== tempUserMsg.id);
          return [
            ...withoutTemp,
            data.userMessage,
            data.aiMessage
          ];
        });
      } else {
        console.error('Chat API Error:', response.status, response.statusText);
        
        // Add error message to chat
        const errorMsg: Message = {
          id: `error_${Date.now()}`,
          message: "I'm having trouble connecting right now. Please try again in a moment! 🔄",
          messageType: "assistant",
          createdAt: new Date().toISOString()
        };
        
        setMessages(prev => {
          const withoutTemp = prev.filter(msg => msg.id !== tempUserMsg.id);
          return [...withoutTemp, tempUserMsg, errorMsg];
        });
      }
    } catch (error) {
      // Show error message
      const errorMsg: Message = {
        id: `error_${Date.now()}`,
        message: "Connection error. Please check your internet and try again.",
        messageType: "assistant",
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Show welcome message when opening for the first time
      if (messages.length === 0) {
        const welcomeMsg: Message = {
          id: `welcome_${Date.now()}`,
          message: "Hi! I'm Skye, your AI companion for Flutterbye. I can help you with token creation, blockchain questions, or anything about our platform. I remember our conversations and learn your preferences over time. How can I assist you today?",
          messageType: "assistant",
          createdAt: new Date().toISOString()
        };
        setMessages([welcomeMsg]);
      }
      // Focus input after opening
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center">
        <div className="group relative">
          <button
            onClick={handleToggle}
            className="relative h-16 w-16 rounded-full bg-gradient-to-r from-pink-500/80 via-purple-600/80 to-electric-blue/80 backdrop-blur-sm border border-pink-500/50 hover:border-electric-blue/80 shadow-xl shadow-pink-500/30 text-white flex items-center justify-center transition-all duration-500 hover:scale-110 animate-pulse"
          >
            {/* Rotating glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-600/20 to-electric-blue/20 blur-lg animate-spin" style={{animationDuration: '4s'}} />
            
            {isOpen ? (
              <X className="h-6 w-6 text-white relative z-10 transition-transform duration-300 group-hover:rotate-90" />
            ) : (
              <div className="relative z-10">
                <SkyeCustomAvatar size={42} className="animate-pulse hover:animate-bounce" />
                {/* Notification pulse for new users */}
                {messages.length === 0 && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-electric-green rounded-full animate-bounce shadow-lg shadow-electric-green/50">
                    <div className="absolute inset-0 bg-electric-green rounded-full animate-ping" />
                    <div className="absolute inset-1 bg-white rounded-full" />
                  </div>
                )}
              </div>
            )}
          </button>
          
          {!isOpen && (
            <div className="ml-4 relative pointer-events-none animate-in slide-in-from-left-2 duration-500">
              {/* Enhanced animated dust particles */}
              <div className="absolute inset-0 -m-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full animate-ping"
                    style={{
                      background: `linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6)`,
                      left: `${25 + Math.sin(i * 30 * Math.PI / 180) * 30}px`,
                      top: `${15 + Math.cos(i * 30 * Math.PI / 180) * 20}px`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '2s',
                      opacity: 0.8,
                      boxShadow: `0 0 4px ${i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#8b5cf6' : '#3b82f6'}`,
                    }}
                  />
                ))}
              </div>
              
              {/* Enhanced pixelated name with better effects */}
              <span 
                className="font-bold text-pink-400 animate-pulse relative z-10 select-none"
                style={{
                  fontSize: '18px',
                  fontFamily: 'monospace, "Courier New"',
                  textShadow: `
                    0 0 3px rgba(236, 72, 153, 1),
                    0 0 8px rgba(236, 72, 153, 0.8),
                    0 0 15px rgba(236, 72, 153, 0.6),
                    0 0 25px rgba(236, 72, 153, 0.4),
                    2px 2px 0 rgba(139, 92, 246, 0.5),
                    -2px -2px 0 rgba(59, 130, 246, 0.5)
                  `,
                  filter: 'contrast(1.3) brightness(1.2) saturate(1.2)',
                  letterSpacing: '2px',
                  background: 'linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Skye
              </span>
              
              {/* Enhanced floating particles with varied movement */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`float-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${2 + (i % 3)}px`,
                    height: `${2 + (i % 3)}px`,
                    background: `linear-gradient(45deg, ${
                      i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#8b5cf6' : '#3b82f6'
                    }, ${i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#3b82f6' : '#ec4899'})`,
                    left: `${20 + i * 10}px`,
                    top: `${10 + (i % 3) * 8}px`,
                    animation: `float-${i % 4} ${2 + (i % 2)}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.7,
                    boxShadow: `0 0 6px ${i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#8b5cf6' : '#3b82f6'}`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-4 w-[420px] h-[600px] bg-gradient-to-br from-slate-900/98 via-purple-900/20 to-slate-900/98 border border-electric-blue/30 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-lg animate-in slide-in-from-left-2 fade-in duration-300">
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-600/10 to-electric-blue/10 opacity-50 animate-pulse" />
          <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-slate-900/98 via-purple-900/20 to-slate-900/98" />
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-pink-500/10 via-purple-600/10 to-electric-blue/10 p-5 border-b border-electric-blue/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 via-purple-500 to-electric-blue rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-pink-500/30">
                    <SkyeCustomAvatar size={32} showName={false} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-electric-green rounded-full animate-bounce shadow-lg shadow-electric-green/50">
                    <div className="absolute inset-1 bg-white rounded-full" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg bg-gradient-to-r from-pink-400 via-purple-300 to-electric-blue bg-clip-text text-transparent">
                    Skye AI
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-electric-green rounded-full animate-pulse" />
                    <p className="text-xs text-electric-green font-medium">
                      Online & Learning
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90 hover:scale-110 p-2 rounded-full hover:bg-slate-700/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="relative flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-electric-blue/30 scrollbar-track-transparent">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-3">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-electric-blue/5 rounded-full blur-3xl transform rotate-45" />
            </div>
            
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.messageType === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-${msg.messageType === "user" ? "right" : "left"}-2 duration-300`}
                style={{animationDelay: `${index * 50}ms`}}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl relative shadow-lg ${
                    msg.messageType === "user"
                      ? "bg-gradient-to-r from-pink-500 via-purple-600 to-electric-blue text-white shadow-pink-500/20"
                      : "bg-gradient-to-r from-slate-800/90 to-slate-700/90 text-white border border-electric-blue/30 shadow-electric-blue/10"
                  }`}
                >
                  {/* Message glow effect */}
                  <div className={`absolute inset-0 rounded-2xl blur opacity-20 ${
                    msg.messageType === "user" 
                      ? "bg-gradient-to-r from-pink-500 to-electric-blue" 
                      : "bg-gradient-to-r from-electric-blue/50 to-purple-600/50"
                  }`} />
                  
                  <div className="relative z-10">
                    {msg.messageType === "assistant" && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-5 h-5 bg-gradient-to-r from-pink-400 to-electric-blue rounded-full flex items-center justify-center">
                          <Brain className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-electric-blue text-xs">Skye AI</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed font-medium">{msg.message}</p>
                    <div className="flex items-center mt-2 text-xs opacity-70">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in slide-in-from-left-2 duration-300">
                <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 border border-electric-blue/30 px-4 py-3 rounded-2xl relative shadow-lg shadow-electric-blue/10">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-electric-blue/10 to-purple-600/10 blur opacity-50" />
                  <div className="relative z-10 flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-gray-300 flex items-center">
                      <Brain className="w-3 h-3 mr-1" />
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="relative p-5 border-t border-electric-blue/20 bg-gradient-to-r from-slate-800/60 to-slate-700/60">
            <div className="flex space-x-3 mb-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about FlutterBye..."
                  className="w-full bg-slate-800/80 border border-electric-blue/30 rounded-full px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue/60 focus:ring-2 focus:ring-electric-blue/20 transition-all duration-300 pr-12"
                  disabled={isLoading}
                  autoComplete="off"
                />
                {/* Input glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-electric-blue/5 to-purple-600/5 blur opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                className="w-12 h-12 bg-gradient-to-r from-pink-500 via-purple-600 to-electric-blue hover:from-pink-400 hover:via-purple-500 hover:to-electric-blue/80 disabled:from-gray-600 disabled:to-gray-700 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-electric-blue/50 shadow-lg disabled:shadow-none relative group"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-electric-blue blur opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                <Send className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
            
            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMessage("How do I create a token?")}
                className="text-xs px-3 py-1.5 bg-electric-blue/20 text-electric-blue rounded-full hover:bg-electric-blue/30 transition-all duration-200 border border-electric-blue/30 hover:border-electric-blue/50"
              >
                <Zap className="w-3 h-3 inline mr-1" />
                Token Creation
              </button>
              <button
                onClick={() => setMessage("What's new in FlutterBye?")}
                className="text-xs px-3 py-1.5 bg-purple-600/20 text-purple-300 rounded-full hover:bg-purple-600/30 transition-all duration-200 border border-purple-600/30 hover:border-purple-600/50"
              >
                <Sparkles className="w-3 h-3 inline mr-1" />
                What's New
              </button>
              <button
                onClick={() => setMessage("Help me get started")}
                className="text-xs px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-full hover:bg-pink-500/30 transition-all duration-200 border border-pink-500/30 hover:border-pink-500/50"
              >
                <Brain className="w-3 h-3 inline mr-1" />
                Get Started
              </button>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Press Enter to send</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-electric-green rounded-full animate-pulse" />
                <span className="text-electric-green">AI Active</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}