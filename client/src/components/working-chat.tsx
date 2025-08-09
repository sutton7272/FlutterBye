import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Message {
  id: string;
  message: string;
  messageType: "user" | "assistant";
  createdAt: string;
}

export function WorkingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
      console.log('Working chat - Sending message:', messageData);
      return await apiRequest("/api/flutterina/messages", "POST", messageData);
    },
    onSuccess: (data) => {
      console.log('Working chat - Message sent successfully:', data);
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
      console.error('Working chat - Error sending message:', error);
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
      console.log('Working chat - Cannot send: empty message or already pending');
      return;
    }
    
    console.log('Working chat - Sending message:', trimmedMessage);
    
    try {
      await sendMessageMutation.mutateAsync({
        message: trimmedMessage,
        pageContext: location,
        sessionId: sessionId.current,
      });
    } catch (error) {
      console.error('Working chat - Send error:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Working chat - Key down:', e.key, 'Code:', e.code);
    if (e.key === "Enter") {
      console.log('Working chat - Enter key detected, sending message');
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => {
            console.log('Working chat - Toggle chat:', !isOpen);
            setIsOpen(!isOpen);
            // Focus input when opening
            if (!isOpen) {
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }
          }}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Working Chat</h3>
                  <p className="text-xs opacity-90">Test version</p>
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
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-600 dark:text-green-400">Working Chat</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Hello! This is the working chat test. Try typing and pressing Enter.
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.messageType === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-lg max-w-[80%] ${
                  msg.messageType === "user" 
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-br-sm" 
                    : "bg-gray-100 dark:bg-gray-800 rounded-bl-sm border border-gray-200 dark:border-gray-700"
                }`}>
                  {msg.messageType === "assistant" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-600 dark:text-green-400">Working Chat</span>
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
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Using simple input instead of Textarea */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => {
                  console.log('Working chat - Message changed:', e.target.value);
                  setMessage(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a message and press Enter..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={sendMessageMutation.isPending}
                autoComplete="off"
              />
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Working chat - Send button clicked!', message);
                  handleSendMessage();
                }}
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Press Enter to send message</span>
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