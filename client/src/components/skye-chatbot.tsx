import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
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
      <div className="fixed bottom-4 left-4 z-50 flex items-center">
        <button
          onClick={handleToggle}
          className="h-16 w-16 rounded-full bg-black/80 backdrop-blur-sm border border-pink-500/50 hover:border-pink-400/80 shadow-lg text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-blue-400" />
          ) : (
            <SkyeCustomAvatar size={48} className="animate-pulse hover:animate-bounce" />
          )}
        </button>
        {!isOpen && (
          <div className="ml-3 relative pointer-events-none">
            {/* Animated dust particles */}
            <div className="absolute inset-0 -m-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-pink-400 rounded-full animate-ping"
                  style={{
                    left: `${20 + Math.sin(i * 45 * Math.PI / 180) * 25}px`,
                    top: `${10 + Math.cos(i * 45 * Math.PI / 180) * 15}px`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.5s',
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
            
            {/* Main text with pixelated effect */}
            <span 
              className="font-bold text-pink-400 animate-pulse relative z-10"
              style={{
                fontSize: '16px',
                fontFamily: 'monospace, "Courier New"',
                textShadow: `
                  0 0 2px rgba(236, 72, 153, 1),
                  0 0 5px rgba(236, 72, 153, 0.8),
                  0 0 10px rgba(236, 72, 153, 0.6),
                  0 0 15px rgba(236, 72, 153, 0.4),
                  1px 1px 0 rgba(236, 72, 153, 0.3),
                  -1px -1px 0 rgba(236, 72, 153, 0.3)
                `,
                filter: 'contrast(1.2) brightness(1.1)',
                letterSpacing: '1px',
              }}
            >
              Skye
            </span>
            
            {/* Floating dust particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`float-${i}`}
                className="absolute w-0.5 h-0.5 bg-pink-300 rounded-full"
                style={{
                  left: `${15 + i * 8}px`,
                  top: `${8 + (i % 2) * 6}px`,
                  animation: `float-${i % 3} 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SkyeCustomAvatar size={32} showName={true} />
                <div>
                  <p className="text-xs opacity-90">Your AI Fairy Companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 bg-transparent hover:bg-white/20 rounded flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.messageType === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-lg max-w-[80%] ${
                  msg.messageType === "user" 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm" 
                    : "bg-gray-100 dark:bg-gray-800 rounded-bl-sm border border-gray-200 dark:border-gray-700"
                }`}>
                  {msg.messageType === "assistant" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <SkyeCustomAvatar size={16} showName={false} />
                      <span className="font-medium text-blue-600 dark:text-blue-400">Skye</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.message}</p>
                  <div className={`text-xs mt-1 opacity-70 ${
                    msg.messageType === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-bl-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Skye anything about Flutterbye..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-md text-white flex items-center transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Press Enter to send</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}