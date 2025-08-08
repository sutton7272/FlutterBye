import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users } from "lucide-react";

interface ContextualChatButtonProps {
  context: "dashboard" | "flutterbyemsg" | "flutterwave" | "flutterart";
  className?: string;
}

const contextConfig = {
  dashboard: {
    title: "Community Chat",
    description: "General discussions about Flutterbye",
    color: "electric-blue",
    icon: MessageSquare,
    room: "general"
  },
  flutterbyemsg: {
    title: "Message Chat", 
    description: "Discuss tokens and campaigns",
    color: "electric-green",
    icon: MessageSquare,
    room: "message-tokens"
  },
  flutterwave: {
    title: "SMS Community",
    description: "Emotional token discussions", 
    color: "purple",
    icon: MessageSquare,
    room: "sms-community"
  },
  flutterart: {
    title: "Artist Chat",
    description: "NFT creators and collectors",
    color: "teal", 
    icon: MessageSquare,
    room: "artists"
  }
};

export function ContextualChatButton({ context, className = "" }: ContextualChatButtonProps) {
  const config = contextConfig[context];
  
  const colorClass = config.color === 'electric-blue' ? 'text-electric-blue border-electric-blue/20 bg-electric-blue/5' 
    : config.color === 'electric-green' ? 'text-electric-green border-electric-green/20 bg-electric-green/5'
    : config.color === 'purple' ? 'text-purple-400 border-purple-400/20 bg-purple-400/5'
    : 'text-teal-400 border-teal-400/20 bg-teal-400/5';

  const buttonColorClass = config.color === 'electric-blue' ? 'hover:bg-electric-blue/10 border-electric-blue/30' 
    : config.color === 'electric-green' ? 'hover:bg-electric-green/10 border-electric-green/30'
    : config.color === 'purple' ? 'hover:bg-purple-400/10 border-purple-400/30'
    : 'hover:bg-teal-400/10 border-teal-400/30';

  return (
    <Link href={`/chat?room=${config.room}`}>
      <Button 
        variant="outline" 
        size="sm"
        className={`${buttonColorClass} ${colorClass} transition-all duration-300 electric-frame fixed bottom-6 right-6 z-50 shadow-lg ${className}`}
      >
        <config.icon className="h-4 w-4 mr-2" />
        {config.title}
        <Badge variant="secondary" className="ml-2 text-xs">
          <Users className="h-3 w-3 mr-1" />
          12
        </Badge>
      </Button>
    </Link>
  );
}