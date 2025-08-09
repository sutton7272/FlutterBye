import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface FlutterinaMessage {
  id: string;
  message: string;
  messageType: "user" | "assistant" | "system";
  pageContext: string;
  createdAt: string;
  containsRecommendations?: boolean;
  recommendationData?: {
    products: string[];
    actions: string[];
    links: Array<{ url: string; title: string }>;
  };
}

interface FlutterinaConversation {
  id: string;
  currentPage: string;
  relationshipLevel: "new" | "familiar" | "friend" | "trusted";
  totalMessages: number;
  lastInteractionAt: string;
}

export function FlutterinaFloatingChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  const queryClient = useQueryClient();
  
  // Generate session ID
  const sessionId = useRef(
    typeof window !== "undefined" 
      ? sessionStorage.getItem("flutterina-session") || 
        (() => {
          const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem("flutterina-session", id);
          return id;
        })()
      : `session_${Date.now()}`
  );

  // Fetch conversation history
  const { data: conversation } = useQuery<FlutterinaConversation>({
    queryKey: ["/api/flutterina/conversation", sessionId.current, location],
    enabled: isOpen,
  });

  const { data: messages = [] } = useQuery<FlutterinaMessage[]>({
    queryKey: ["/api/flutterina/messages", conversation?.id],
    enabled: !!conversation?.id && isOpen,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: {
      message: string;
      pageContext: string;
      sessionId: string;
    }) => {
      return await apiRequest("/api/flutterina/messages", "POST", messageData);
    },
    onSuccess: () => {
      setMessage("");
      setIsTyping(false);
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ 
        queryKey: ["/api/flutterina/messages", conversation?.id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/flutterina/conversation", sessionId.current, location] 
      });
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setIsTyping(true);
    sendMessageMutation.mutate({
      message: message.trim(),
      pageContext: location,
      sessionId: sessionId.current,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getGreeting = () => {
    const relationship = conversation?.relationshipLevel || "new";
    const hour = new Date().getHours();
    
    if (relationship === "new") {
      return hour < 12 
        ? "Good morning! I'm Skye, your AI companion. How can I help you today?" 
        : hour < 18 
        ? "Good afternoon! I'm Skye, here to assist with anything you need."
        : "Good evening! I'm Skye, ready to help you navigate the platform.";
    } else {
      return hour < 12 
        ? "Good morning! Nice to see you again. What can I help with today?" 
        : hour < 18 
        ? "Welcome back! How can I assist you this afternoon?"
        : "Evening! Ready for another productive session together?";
    }
  };

  const getPersonalityEmoji = () => {
    const relationship = conversation?.relationshipLevel || "new";
    return relationship === "new" ? "✨" : 
           relationship === "familiar" ? "💫" :
           relationship === "friend" ? "💖" : "🌟";
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative h-14 w-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110",
            "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
            "hover:from-blue-600 hover:via-purple-600 hover:to-pink-600",
            "border-2 border-white/20 backdrop-blur-sm",
            "animate-pulse hover:animate-none"
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <div className="relative">
              <MessageCircle className="h-6 w-6 text-white" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center">
                <Heart className="h-2 w-2 text-white" />
              </div>
            </div>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="absolute -top-1 -right-1 text-xs">
                    {getPersonalityEmoji()}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Skye</h3>
                  <p className="text-xs text-white/80">
                    Your AI companion
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {getGreeting()}
                  </div>
                </div>
              </div>
            )}

            {/* Message History */}
            {messages.map((msg: FlutterinaMessage) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.messageType === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg text-sm",
                    msg.messageType === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm border border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div className="whitespace-pre-wrap">{msg.message}</div>
                  
                  {/* Recommendations */}
                  {msg.containsRecommendations && msg.recommendationData && (
                    <div className="mt-3 space-y-2">
                      {msg.recommendationData.actions.length > 0 && (
                        <div className="space-y-1">
                          {msg.recommendationData.actions.map((action, index) => (
                            <button
                              key={index}
                              className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded border border-white/30 transition-colors"
                            >
                              <Zap className="h-3 w-3 inline mr-1" />
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {msg.recommendationData.links.length > 0 && (
                        <div className="space-y-1">
                          {msg.recommendationData.links.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              className="block text-xs text-blue-200 hover:text-white underline"
                            >
                              🔗 {link.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={cn(
                    "text-xs mt-1 opacity-70",
                    msg.messageType === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-bl-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Skye anything about Flutterbye..."
                className="flex-1 min-h-[40px] max-h-[100px] text-sm resize-none"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Press Enter to send, Shift+Enter for new line</span>
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