import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function SkyeTestChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'ai'}>>([]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { message: string; pageContext: string; sessionId: string }) => {
      console.log('Sending message via test chatbox:', messageData);
      return await apiRequest("/api/flutterina/messages", "POST", messageData);
    },
    onSuccess: (data: any) => {
      console.log('Response received:', data);
      setMessages(prev => [
        ...prev,
        { id: data.userMessage.id, text: data.userMessage.message, sender: 'user' },
        { id: data.aiMessage.id, text: data.aiMessage.message, sender: 'ai' }
      ]);
      setMessage("");
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + error.message);
    }
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    console.log('Sending message:', message);
    sendMessageMutation.mutate({
      message: message.trim(),
      pageContext: "/",
      sessionId: `test_session_${Date.now()}`
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Test Chat Button */}
      <div className="fixed bottom-20 right-20 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Test Chat Window */}
      {isOpen && (
        <div className="fixed bottom-36 right-20 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-red-500 p-3 text-white rounded-t-lg">
            <h3 className="font-semibold">Skye Test Chat</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-gray-500 text-sm">Type a message to test Skye...</div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-500 text-white ml-8' 
                    : 'bg-gray-100 dark:bg-gray-800 mr-8'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex space-x-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Test message..."
                className="flex-1 min-h-[40px] max-h-[80px] text-sm resize-none"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="bg-red-500 hover:bg-red-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}