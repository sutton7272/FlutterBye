import { useEffect, useState } from 'react';

interface TypingIndicatorProps {
  typingUsers: string[];
  currentUserWallet: string;
}

export function TypingIndicator({ typingUsers, currentUserWallet }: TypingIndicatorProps) {
  const [dots, setDots] = useState('');

  // Filter out current user from typing users
  const otherTypingUsers = typingUsers.filter(user => user !== currentUserWallet);

  useEffect(() => {
    if (otherTypingUsers.length === 0) return;

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [otherTypingUsers.length]);

  if (otherTypingUsers.length === 0) return null;

  const truncateWallet = (wallet: string) => `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;

  const getTypingText = () => {
    if (otherTypingUsers.length === 1) {
      return `${truncateWallet(otherTypingUsers[0])} is typing${dots}`;
    } else if (otherTypingUsers.length === 2) {
      return `${truncateWallet(otherTypingUsers[0])} and ${truncateWallet(otherTypingUsers[1])} are typing${dots}`;
    } else {
      return `${otherTypingUsers.length} users are typing${dots}`;
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400 p-3 bg-slate-800/50 rounded-lg">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></div>
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span>{getTypingText()}</span>
    </div>
  );
}