import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Message {
  id: string;
  message: string;
  messageType: "user" | "assistant";
  createdAt: string;
}

export function SkyeChatFinal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  const queryClient = useQueryClient();
  
  // Generate unique session ID
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Fetch conversation
  const { data: conversation } = useQuery<any>({
    queryKey: ["/api/flutterina/conversation", sessionId.current, location],
    enabled: isOpen,
  });

  // Fetch messages
  const { data: messages = [] } = useQuery<Message[]>({
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
      console.log('Final chat - Sending message:', messageData);
      return await apiRequest("/api/flutterina/messages", "POST", messageData);
    },
    onSuccess: (data) => {
      console.log('Final chat - Message sent successfully:', data);
      setMessage("");
      setIsTyping(false);
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ 
        queryKey: ["/api/flutterina/messages"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/flutterina/conversation"] 
      });
    },
    onError: (error) => {
      console.error('Final chat - Error sending message:', error);
      setIsTyping(false);
    },
    onMutate: () => {
      setIsTyping(true);
    }
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sendMessageMutation.isPending) {
      console.log('Final chat - Cannot send: empty message or already pending');
      return;
    }
    
    console.log('Final chat - Sending message:', trimmedMessage);
    
    try {
      await sendMessageMutation.mutateAsync({
        message: trimmedMessage,
        pageContext: location,
        sessionId: sessionId.current,
      });
    } catch (error) {
      console.error('Final chat - Send error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log('Final chat - Key pressed:', e.key, 'Shift:', e.shiftKey);
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => {
            console.log('Final chat - Toggle chat:', !isOpen);
            setIsOpen(!isOpen);
          }}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Skye</h3>
                  <p className="text-xs opacity-90">Your AI companion</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 bg-transparent hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && !isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-bl-sm max-w-[80%] border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-purple-600 dark:text-purple-400">Skye</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Good morning! I'm Skye, your AI companion. How can I help you today?
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.messageType === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-lg max-w-[80%] ${
                  msg.messageType === "user" 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm" 
                    : "bg-gray-100 dark:bg-gray-800 rounded-bl-sm border border-gray-200 dark:border-gray-700"
                }`}>
                  {msg.messageType === "assistant" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-purple-600 dark:text-purple-400">Skye</span>
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
            {isTyping && (
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
              <Textarea
                value={message}
                onChange={(e) => {
                  console.log('Final chat - Message changed:', e.target.value);
                  setMessage(e.target.value);
                }}
                onKeyDown={handleKeyPress}
                placeholder="Ask Skye anything about Flutterbye..."
                className="flex-1 min-h-[40px] max-h-[100px] text-sm resize-none"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Final chat - Send button clicked!', message);
                  handleSendMessage();
                }}
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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