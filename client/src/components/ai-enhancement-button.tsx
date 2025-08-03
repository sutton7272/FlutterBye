import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAIContent } from '@/hooks/useAIContent';
import { Sparkles, Zap, TrendingUp, MessageCircle } from 'lucide-react';

interface AIEnhancementButtonProps {
  text: string;
  onEnhanced: (enhancedText: string) => void;
  type?: 'text' | 'chat' | 'token' | 'marketing';
  className?: string;
  disabled?: boolean;
}

/**
 * Universal AI Enhancement Button - Works throughout the platform
 * Provides intelligent text optimization with visual feedback
 */
export function AIEnhancementButton({
  text,
  onEnhanced,
  type = 'text',
  className = '',
  disabled = false
}: AIEnhancementButtonProps) {
  const [showResults, setShowResults] = useState(false);
  const { optimizeText, optimizedText, isOptimizingText } = useAIContent();

  const handleEnhance = async () => {
    if (!text.trim() || disabled) return;

    const constraints = {
      maxLength: type === 'token' ? 27 : undefined,
      tone: type === 'marketing' ? 'persuasive' : 'engaging',
      purpose: type,
      audience: 'crypto_enthusiasts'
    };

    optimizeText({ text, constraints });
    setShowResults(true);
  };

  const handleAcceptSuggestion = (suggestion: string) => {
    onEnhanced(suggestion);
    setShowResults(false);
  };

  const getIcon = () => {
    switch (type) {
      case 'chat': return <MessageCircle className="w-4 h-4" />;
      case 'token': return <Zap className="w-4 h-4" />;
      case 'marketing': return <TrendingUp className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getButtonText = () => {
    if (isOptimizingText) return 'AI Enhancing...';
    switch (type) {
      case 'chat': return 'AI Chat Boost';
      case 'token': return 'AI Token Optimize';
      case 'marketing': return 'AI Marketing Power';
      default: return 'AI Enhance';
    }
  };

  return (
    <TooltipProvider>
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleEnhance}
              disabled={disabled || isOptimizingText || !text.trim()}
              className={`
                relative overflow-hidden transition-all duration-300
                bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                text-white border-0 shadow-lg hover:shadow-xl
                ${isOptimizingText ? 'animate-pulse' : ''}
                ${className}
              `}
              size="sm"
            >
              <div className="relative flex items-center gap-2">
                {getIcon()}
                <span className="text-sm font-medium">{getButtonText()}</span>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                  AI
                </Badge>
              </div>
              
              {/* Animated background for loading state */}
              {isOptimizingText && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 animate-pulse" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enhance with revolutionary AI technology</p>
          </TooltipContent>
        </Tooltip>

        {/* Results Popup */}
        {showResults && optimizedText && (
          <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-black/90 backdrop-blur-lg border border-electric-blue/30 rounded-lg p-4 shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-electric-blue" />
                  AI Enhancement Results
                </h3>
                <Button
                  onClick={() => setShowResults(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white p-1 h-6 w-6"
                >
                  ×
                </Button>
              </div>

              {/* Main suggestion */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                    Viral Score: {(optimizedText as any)?.viralScore || 0}
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    AI Optimized
                  </Badge>
                </div>
                
                <div 
                  className="p-3 bg-gradient-to-r from-electric-blue/10 to-purple-500/10 rounded-lg border border-electric-blue/20 cursor-pointer hover:bg-electric-blue/20 transition-colors"
                  onClick={() => handleAcceptSuggestion((optimizedText as any)?.optimized || text)}
                >
                  <p className="text-white text-sm">{(optimizedText as any)?.optimized || text}</p>
                  <p className="text-electric-blue text-xs mt-1">Click to use this version</p>
                </div>
              </div>

              {/* Alternative suggestions */}
              {(optimizedText as any)?.alternatives && (optimizedText as any).alternatives.length > 0 && (
                <div className="space-y-2">
                  <p className="text-white/80 text-xs">Alternative suggestions:</p>
                  {(optimizedText as any).alternatives.slice(0, 2).map((alt: string, index: number) => (
                    <div
                      key={index}
                      className="p-2 bg-white/5 rounded border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => handleAcceptSuggestion(alt)}
                    >
                      <p className="text-white/90 text-sm">{alt}</p>
                      <p className="text-white/50 text-xs">Alternative {index + 1}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Improvement tips */}
              {(optimizedText as any)?.improvementTips && (optimizedText as any).improvementTips.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-white/80 text-xs mb-1">💡 AI Tips:</p>
                  <p className="text-white/70 text-xs">{(optimizedText as any).improvementTips[0]}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

/**
 * Compact version for smaller spaces
 */
export function AIEnhancementButtonCompact({ text, onEnhanced, type = 'text', className = '' }: AIEnhancementButtonProps) {
  const { optimizeText, isOptimizingText } = useAIContent();

  const handleQuickEnhance = async () => {
    if (!text.trim()) return;
    
    optimizeText({ 
      text, 
      constraints: { 
        maxLength: type === 'token' ? 27 : undefined,
        tone: 'engaging',
        purpose: type 
      } 
    });
  };

  return (
    <Button
      onClick={handleQuickEnhance}
      disabled={isOptimizingText || !text.trim()}
      size="sm"
      className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 ${className}`}
    >
      <Sparkles className="w-3 h-3" />
      {isOptimizingText ? '...' : 'AI'}
    </Button>
  );
}