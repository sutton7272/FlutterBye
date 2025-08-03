import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AIEnhancementButton } from '@/components/ai-enhancement-button';
import { useAIContent } from '@/hooks/useAIContent';
import { Sparkles, Zap, TrendingUp, MessageCircle, Brain } from 'lucide-react';

/**
 * AI Integration Demo Component - Showcases AI capabilities in action
 * Perfect for demonstrating AI features throughout the platform
 */
export function AIIntegrationDemo() {
  const [demoText, setDemoText] = useState('Create revolutionary blockchain tokens');
  const [enhancedText, setEnhancedText] = useState('');

  const {
    optimizeText,
    optimizedText,
    isOptimizingText,
    getChatSuggestions,
    chatSuggestions,
    generateMarketing,
    marketingCopy
  } = useAIContent();

  return (
    <Card className="bg-black/40 border-electric-blue/30 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-electric-blue">
          <Brain className="w-5 h-5 animate-pulse" />
          Live AI Integration Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* AI Text Optimization Demo */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-electric-blue" />
            AI Text Optimization
          </h3>
          <div className="flex gap-2">
            <Input
              value={demoText}
              onChange={(e) => setDemoText(e.target.value)}
              placeholder="Enter text to optimize..."
              className="bg-black/20 border-electric-blue/30 text-white flex-1"
            />
            <AIEnhancementButton
              text={demoText}
              onEnhanced={setEnhancedText}
              type="token"
            />
          </div>
          
          {enhancedText && (
            <div className="p-3 bg-gradient-to-r from-electric-blue/10 to-purple-500/10 rounded-lg border border-electric-blue/20">
              <p className="text-sm text-white/80 mb-2">AI Enhanced Result:</p>
              <p className="text-white font-medium">{enhancedText}</p>
            </div>
          )}
        </div>

        {/* Quick Demo Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => optimizeText({ 
              text: 'Join the blockchain revolution today',
              constraints: { maxLength: 27, tone: 'engaging' }
            })}
            disabled={isOptimizingText}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isOptimizingText ? 'Optimizing...' : 'Optimize Text'}
          </Button>
          
          <Button
            onClick={() => getChatSuggestions({ messageType: 'greeting' })}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white"
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat Suggestions
          </Button>
          
          <Button
            onClick={() => generateMarketing({
              product: 'AI-powered blockchain platform',
              audience: 'crypto enthusiasts',
              goal: 'engagement'
            })}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
            size="sm"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Marketing Copy
          </Button>
        </div>

        {/* Results Display */}
        {(optimizedText || chatSuggestions || marketingCopy) && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold">AI Results:</h4>
            
            {optimizedText && (
              <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <Badge className="bg-blue-500/20 text-blue-400 mb-2">Text Optimization</Badge>
                <p className="text-white text-sm">{(optimizedText as any)?.optimized || 'Processing...'}</p>
              </div>
            )}
            
            {chatSuggestions && (
              <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                <Badge className="bg-green-500/20 text-green-400 mb-2">Chat Suggestions</Badge>
                <div className="space-y-1">
                  {(chatSuggestions as any)?.quickReplies?.slice(0, 2).map((reply: string, index: number) => (
                    <p key={index} className="text-white text-sm">• {reply}</p>
                  ))}
                </div>
              </div>
            )}
            
            {marketingCopy && (
              <div className="p-3 bg-orange-500/10 rounded border border-orange-500/20">
                <Badge className="bg-orange-500/20 text-orange-400 mb-2">Marketing Copy</Badge>
                <div className="space-y-1">
                  {(marketingCopy as any)?.headlines?.slice(0, 2).map((headline: string, index: number) => (
                    <p key={index} className="text-white text-sm font-medium">• {headline}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Stats */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10">
          <div className="text-center">
            <p className="text-lg font-bold text-electric-blue">GPT-4o</p>
            <p className="text-xs text-white/60">AI Model</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-400">~$0.002</p>
            <p className="text-xs text-white/60">Per Query</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-purple-400">850ms</p>
            <p className="text-xs text-white/60">Response</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}