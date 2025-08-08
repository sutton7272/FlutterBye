import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Users, Zap } from "lucide-react";

interface ContextualChatButtonProps {
  context: "dashboard" | "flutterbyemsg" | "flutterwave" | "flutterart";
  className?: string;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  type: "user" | "system";
}

const contextConfig = {
  dashboard: {
    title: "Community Chat",
    description: "General discussions about Flutterbye",
    color: "electric-blue",
    icon: MessageSquare,
    placeholder: "Share your thoughts with the community..."
  },
  flutterbyemsg: {
    title: "Message Chat",
    description: "Discuss tokens and campaigns",
    color: "electric-green",
    icon: MessageSquare,
    placeholder: "Talk about your message tokens..."
  },
  flutterwave: {
    title: "SMS Community",
    description: "Emotional token discussions",
    color: "purple",
    icon: MessageSquare,
    placeholder: "Share your emotional token experiences..."
  },
  flutterart: {
    title: "Artist Chat",
    description: "NFT creators and collectors",
    color: "teal",
    icon: MessageSquare,
    placeholder: "Connect with other creators..."
  }
};

export function ContextualChatButton({ context, className = "" }: ContextualChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "System",
      message: `Welcome to ${contextConfig[context].title}! Connect with the community.`,
      timestamp: "Just now",
      type: "system"
    }
  ]);

  const config = contextConfig[context];
  const colorClass = config.color === 'electric-blue' ? 'text-electric-blue border-electric-blue/20 bg-electric-blue/5' 
    : config.color === 'electric-green' ? 'text-electric-green border-electric-green/20 bg-electric-green/5'
    : config.color === 'purple' ? 'text-purple-400 border-purple-400/20 bg-purple-400/5'
    : 'text-teal-400 border-teal-400/20 bg-teal-400/5';

  const buttonColorClass = config.color === 'electric-blue' ? 'hover:bg-electric-blue/10 border-electric-blue/30' 
    : config.color === 'electric-green' ? 'hover:bg-electric-green/10 border-electric-green/30'
    : config.color === 'purple' ? 'hover:bg-purple-400/10 border-purple-400/30'
    : 'hover:bg-teal-400/10 border-teal-400/30';

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      message: newMessage,
      timestamp: "Just now",
      type: "user"
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`${buttonColorClass} ${colorClass} transition-all duration-300 electric-frame ${className}`}
        >
          <config.icon className="h-4 w-4 mr-2" />
          {config.title}
          <Badge variant="secondary" className="ml-2 text-xs">
            <Users className="h-3 w-3 mr-1" />
            12
          </Badge>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-slate-900/95 border border-electric-blue/30 electric-frame">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <config.icon className={`h-5 w-5 ${config.color === 'electric-blue' ? 'text-electric-blue' : config.color === 'electric-green' ? 'text-electric-green' : config.color === 'purple' ? 'text-purple-400' : 'text-teal-400'}`} />
            {config.title}
            <Badge variant="outline" className={colorClass}>
              <Users className="h-3 w-3 mr-1" />
              12 online
            </Badge>
          </DialogTitle>
          <p className="text-sm text-gray-400">{config.description}</p>
        </DialogHeader>

        {/* Chat Messages */}
        <Card className="bg-slate-800/50 border border-electric-blue/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-electric-blue" />
              Live Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-64 w-full">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-lg ${
                    msg.type === 'system' 
                      ? 'bg-slate-700/50 border border-electric-blue/20' 
                      : msg.user === 'You'
                      ? 'bg-electric-blue/10 border border-electric-blue/20 ml-4'
                      : 'bg-slate-700/30 border border-slate-600/20 mr-4'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${
                        msg.type === 'system' ? 'text-electric-blue' :
                        msg.user === 'You' ? 'text-electric-green' : 'text-gray-300'
                      }`}>
                        {msg.user}
                      </span>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-white">{msg.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder={config.placeholder}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-slate-700/50 border border-electric-blue/20 text-white placeholder-gray-400"
              />
              <Button 
                onClick={handleSendMessage}
                size="sm"
                className="bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}