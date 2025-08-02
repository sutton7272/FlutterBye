import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Smile, Plus } from 'lucide-react';

interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

interface MessageReactionsProps {
  messageId: string;
  reactions?: { [emoji: string]: string[] };
  currentUserWallet: string;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
}

const commonEmojis = [
  '👍', '❤️', '😂', '🚀', '⚡', '🔥', '💎', '🎉',
  '🤔', '👏', '💪', '🌟', '🎯', '🔴', '🟢', '🟡'
];

export function MessageReactions({ 
  messageId, 
  reactions = {}, 
  currentUserWallet, 
  onAddReaction, 
  onRemoveReaction 
}: MessageReactionsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleReactionClick = (emoji: string) => {
    const users = reactions[emoji] || [];
    const hasReacted = users.includes(currentUserWallet);
    
    if (hasReacted) {
      onRemoveReaction(messageId, emoji);
    } else {
      onAddReaction(messageId, emoji);
    }
  };

  const existingReactions = Object.entries(reactions).filter(([_, users]) => users.length > 0);

  return (
    <div className="flex items-center gap-1 mt-2">
      {/* Existing Reactions */}
      {existingReactions.map(([emoji, users]) => {
        const hasReacted = users.includes(currentUserWallet);
        return (
          <TooltipProvider key={emoji}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={hasReacted ? "default" : "outline"}
                  className={`cursor-pointer text-xs hover:bg-purple-900/20 transition-colors ${
                    hasReacted ? 'bg-purple-600 text-white' : 'text-gray-300'
                  }`}
                  onClick={() => handleReactionClick(emoji)}
                >
                  {emoji} {users.length}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  {users.length === 1 ? 
                    `${users[0].slice(0, 6)}...` : 
                    `${users.length} users reacted`
                  }
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}

      {/* Add Reaction Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="h-6 w-6 p-0 text-gray-400 hover:text-purple-400"
        >
          <Smile className="w-3 h-3" />
        </Button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 mb-2 p-3 bg-slate-800 border border-purple-500/20 rounded-lg shadow-lg z-50">
            <div className="grid grid-cols-8 gap-1">
              {commonEmojis.map(emoji => (
                <Button
                  key={emoji}
                  variant="ghost"
                  className="text-lg hover:bg-purple-900/20 h-8 w-8 p-0"
                  onClick={() => {
                    onAddReaction(messageId, emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}