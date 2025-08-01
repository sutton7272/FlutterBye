import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Brain, TrendingUp, Sparkles, Target, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EmotionAnalysis {
  primaryEmotion: string;
  emotionScore: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  intensity: 'low' | 'medium' | 'high';
  category: string;
  suggestedValue: number;
  viralityScore: number;
  marketingTags: string[];
}

interface EmotionAnalyzerProps {
  message: string;
  recipientCount?: number;
  onValueSuggestion?: (value: number) => void;
  onOptimizedMessage?: (optimized: string) => void;
}

export function EmotionAnalyzer({ 
  message, 
  recipientCount = 1, 
  onValueSuggestion,
  onOptimizedMessage 
}: EmotionAnalyzerProps) {
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [viralSuggestions, setViralSuggestions] = useState<string[]>([]);
  const [optimizedMessage, setOptimizedMessage] = useState<string>("");

  // Auto-analyze when message changes (with debounce)
  useEffect(() => {
    if (message.length < 3) {
      setAnalysis(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      analyzeMessage();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [message, recipientCount]);

  const analyzeMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      // Analyze emotion
      const emotionResponse = await fetch('/api/ai/analyze-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, recipientCount })
      });
      
      if (emotionResponse.ok) {
        const emotionData = await emotionResponse.json();
        setAnalysis(emotionData);
        onValueSuggestion?.(emotionData.suggestedValue);
      }

      // Analyze viral potential
      const viralResponse = await fetch('/api/ai/analyze-viral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      if (viralResponse.ok) {
        const viralData = await viralResponse.json();
        setViralSuggestions(viralData.suggestions || []);
        if (viralData.optimizedMessage) {
          setOptimizedMessage(viralData.optimizedMessage);
        }
      }
      
    } catch (error) {
      console.error('Error analyzing message:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'romantic': return '💕';
      case 'celebration': return '🎉';
      case 'apology': return '🙏';
      case 'gratitude': return '🙏';
      case 'encouragement': return '💪';
      case 'friendship': return '🤝';
      case 'business': return '💼';
      default: return '💭';
    }
  };

  if (!message.trim() || message.length < 3) {
    return (
      <Card className="glassmorphism border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-gray-400 py-8">
            <Brain className="w-8 h-8 mr-2" />
            <span>Start typing to see AI emotion analysis...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="glassmorphism border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-electric-blue" />
            AI Emotion Analysis
            {loading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-electric-blue border-t-transparent rounded-full"
              />
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {analysis && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Primary Emotion & Sentiment */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span className="text-sm font-medium">Primary Emotion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold capitalize text-electric-blue">
                        {analysis.primaryEmotion}
                      </span>
                      <Badge variant="secondary" className={getIntensityColor(analysis.intensity)}>
                        {analysis.intensity} intensity
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium">Sentiment</span>
                    </div>
                    <div className={`text-lg font-bold capitalize ${getSentimentColor(analysis.sentiment)}`}>
                      {analysis.sentiment}
                      <span className="text-sm text-gray-400 ml-2">
                        ({Math.round(analysis.emotionScore * 100)}% confidence)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category & Value Suggestion */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(analysis.category)}</span>
                      <span className="text-sm font-medium">Category</span>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {analysis.category}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium">Suggested Value</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-400">
                        {analysis.suggestedValue.toFixed(3)} SOL
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onValueSuggestion?.(analysis.suggestedValue)}
                        className="text-xs"
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Virality Score */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">Viral Potential</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.viralityScore * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-bold text-yellow-400">
                      {Math.round(analysis.viralityScore * 100)}%
                    </span>
                  </div>
                </div>

                {/* Marketing Tags */}
                {analysis.marketingTags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium">Marketing Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.marketingTags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      {/* Viral Optimization Suggestions */}
      {(viralSuggestions.length > 0 || optimizedMessage) && (
        <Card className="glassmorphism border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Viral Optimization
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {optimizedMessage && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-green-400">AI Optimized Version:</span>
                <div className="flex items-center gap-2">
                  <Input 
                    value={optimizedMessage}
                    readOnly
                    className="bg-gray-800 border-gray-600"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOptimizedMessage?.(optimizedMessage)}
                    className="whitespace-nowrap"
                  >
                    Use This
                  </Button>
                </div>
              </div>
            )}
            
            {viralSuggestions.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Improvement Suggestions:</span>
                <div className="space-y-1">
                  {viralSuggestions.map((suggestion, index) => (
                    <div key={index} className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}