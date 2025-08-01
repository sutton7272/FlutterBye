import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Share2, Star, Zap, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";

interface ViralMetrics {
  viralityScore: number;
  shareability: number;
  memeability: number;
  emotionalHook: number;
  cryptoRelevance: number;
}

interface ViralMechanicsProps {
  message: string;
  recipientCount: number;
  valuePerToken: number;
  onBoostSuggestion?: (boost: string) => void;
}

export function ViralMechanics({ 
  message, 
  recipientCount, 
  valuePerToken,
  onBoostSuggestion 
}: ViralMechanicsProps) {
  const [metrics, setMetrics] = useState<ViralMetrics>({
    viralityScore: 0,
    shareability: 0,
    memeability: 0,
    emotionalHook: 0,
    cryptoRelevance: 0
  });
  const [viralLevel, setViralLevel] = useState<'low' | 'medium' | 'high' | 'viral'>('low');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Calculate viral metrics based on message characteristics
  useEffect(() => {
    if (!message.trim()) {
      setMetrics({
        viralityScore: 0,
        shareability: 0,
        memeability: 0,
        emotionalHook: 0,
        cryptoRelevance: 0
      });
      return;
    }

    const calculateMetrics = () => {
      const msg = message.toLowerCase();
      
      // Shareability factors
      let shareability = 0.3; // Base score
      if (msg.includes('gm') || msg.includes('hodl') || msg.includes('wen')) shareability += 0.2;
      if (msg.includes('moon') || msg.includes('diamond') || msg.includes('hands')) shareability += 0.15;
      if (msg.length <= 15) shareability += 0.1; // Shorter = more shareable
      if (/[!?]{2,}/.test(message)) shareability += 0.1; // Excitement
      
      // Memeability factors
      let memeability = 0.2;
      if (msg.includes('ser') || msg.includes('fren') || msg.includes('frens')) memeability += 0.2;
      if (msg.includes('chad') || msg.includes('alpha') || msg.includes('sigma')) memeability += 0.15;
      if (msg.includes('based') || msg.includes('wagmi') || msg.includes('ngmi')) memeability += 0.2;
      if (/\d+x/.test(msg)) memeability += 0.1; // "100x" etc
      
      // Emotional hook factors
      let emotionalHook = 0.25;
      const emotionalWords = ['love', 'miss', 'thank', 'sorry', 'congrat', 'proud', 'excited'];
      emotionalWords.forEach(word => {
        if (msg.includes(word)) emotionalHook += 0.1;
      });
      if (valuePerToken > 0.01) emotionalHook += 0.2; // Higher value = more emotional weight
      
      // Crypto relevance
      let cryptoRelevance = 0.1;
      const cryptoTerms = ['btc', 'eth', 'sol', 'doge', 'pump', 'dump', 'rekt', 'fomo', 'yolo'];
      cryptoTerms.forEach(term => {
        if (msg.includes(term)) cryptoRelevance += 0.1;
      });
      if (msg.includes('nft') || msg.includes('defi') || msg.includes('dao')) cryptoRelevance += 0.15;
      
      // Overall virality score
      const viralityScore = Math.min(1, (shareability + memeability + emotionalHook + cryptoRelevance) / 4);
      
      // Boost based on distribution strategy
      const distributionBoost = Math.min(0.2, recipientCount / 1000);
      const finalVirality = Math.min(1, viralityScore + distributionBoost);
      
      return {
        viralityScore: finalVirality,
        shareability: Math.min(1, shareability),
        memeability: Math.min(1, memeability),
        emotionalHook: Math.min(1, emotionalHook),
        cryptoRelevance: Math.min(1, cryptoRelevance)
      };
    };

    const newMetrics = calculateMetrics();
    setMetrics(newMetrics);
    
    // Determine viral level
    const score = newMetrics.viralityScore;
    if (score < 0.3) setViralLevel('low');
    else if (score < 0.6) setViralLevel('medium');
    else if (score < 0.8) setViralLevel('high');
    else setViralLevel('viral');
    
    // Generate suggestions
    const newSuggestions = [];
    if (newMetrics.shareability < 0.5) {
      newSuggestions.push("Add crypto slang like 'ser', 'fren', or 'WAGMI'");
    }
    if (newMetrics.memeability < 0.5) {
      newSuggestions.push("Include meme references like 'diamond hands' or 'to the moon'");
    }
    if (newMetrics.emotionalHook < 0.5) {
      newSuggestions.push("Add emotional words or increase token value");
    }
    if (newMetrics.cryptoRelevance < 0.5) {
      newSuggestions.push("Reference popular tokens or DeFi concepts");
    }
    if (message.length > 20) {
      newSuggestions.push("Shorten message for better viral potential");
    }
    
    setSuggestions(newSuggestions);
  }, [message, recipientCount, valuePerToken]);

  const getViralColor = (level: string) => {
    switch (level) {
      case 'viral': return 'text-purple-400';
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  const getViralBadgeColor = (level: string) => {
    switch (level) {
      case 'viral': return 'bg-purple-500';
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  if (!message.trim()) {
    return (
      <Card className="glassmorphism border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-gray-400 py-8">
            <TrendingUp className="w-8 h-8 mr-2" />
            <span>Enter a message to see viral potential...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-electric-blue" />
            Viral Mechanics Engine
          </div>
          <Badge className={`${getViralBadgeColor(viralLevel)} text-white capitalize`}>
            {viralLevel} Potential
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Viral Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Viral Score</span>
            <span className={`text-lg font-bold ${getViralColor(viralLevel)}`}>
              {Math.round(metrics.viralityScore * 100)}%
            </span>
          </div>
          <Progress 
            value={metrics.viralityScore * 100} 
            className="h-3"
          />
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            {/* Shareability */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Share2 className="w-3 h-3 text-blue-400" />
                <span className="text-xs font-medium">Shareability</span>
                <span className="text-xs text-blue-400 ml-auto">
                  {Math.round(metrics.shareability * 100)}%
                </span>
              </div>
              <Progress value={metrics.shareability * 100} className="h-1" />
            </div>

            {/* Memeability */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-medium">Memeability</span>
                <span className="text-xs text-yellow-400 ml-auto">
                  {Math.round(metrics.memeability * 100)}%
                </span>
              </div>
              <Progress value={metrics.memeability * 100} className="h-1" />
            </div>
          </div>

          <div className="space-y-3">
            {/* Emotional Hook */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-pink-400" />
                <span className="text-xs font-medium">Emotional Hook</span>
                <span className="text-xs text-pink-400 ml-auto">
                  {Math.round(metrics.emotionalHook * 100)}%
                </span>
              </div>
              <Progress value={metrics.emotionalHook * 100} className="h-1" />
            </div>

            {/* Crypto Relevance */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3 text-green-400" />
                <span className="text-xs font-medium">Crypto Relevance</span>
                <span className="text-xs text-green-400 ml-auto">
                  {Math.round(metrics.cryptoRelevance * 100)}%
                </span>
              </div>
              <Progress value={metrics.cryptoRelevance * 100} className="h-1" />
            </div>
          </div>
        </div>

        {/* Viral Boosters */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium">Viral Boosters</span>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between bg-gray-800 rounded-lg p-2"
                >
                  <span className="text-xs text-gray-300">{suggestion}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onBoostSuggestion?.(suggestion)}
                    className="text-xs h-6 px-2"
                  >
                    Apply
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Viral Multiplier Info */}
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-3 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Viral Multiplier Active</span>
          </div>
          <p className="text-xs text-gray-300">
            High viral potential messages get boosted distribution and earn social rewards for creators and sharers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}