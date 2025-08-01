import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Zap, Crown, Gift, Share2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface NetworkMetrics {
  influenceScore: number;
  reachMultiplier: number;
  socialProofLevel: 'newcomer' | 'active' | 'influencer' | 'whale' | 'legend';
  viralBonus: number;
  networkValue: number;
}

interface NetworkEffectsProps {
  senderWallet?: string;
  recipientCount: number;
  valuePerToken: number;
  messageCategory: string;
}

export function NetworkEffects({ 
  senderWallet, 
  recipientCount, 
  valuePerToken, 
  messageCategory 
}: NetworkEffectsProps) {
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    influenceScore: 0,
    reachMultiplier: 1,
    socialProofLevel: 'newcomer',
    viralBonus: 0,
    networkValue: 0
  });

  const [activeEffects, setActiveEffects] = useState<string[]>([]);

  // Calculate network effects (this would integrate with real wallet analysis)
  useEffect(() => {
    const calculateNetworkMetrics = () => {
      // Simulate wallet influence analysis
      let influenceScore = 0.3; // Base score
      let socialProofLevel: NetworkMetrics['socialProofLevel'] = 'newcomer';
      
      // Mock influence calculation (would be real wallet analysis)
      if (senderWallet) {
        // Simulate based on wallet activity patterns
        const mockScore = Math.random() * 0.7 + 0.3; // 0.3 to 1.0
        influenceScore = mockScore;
        
        if (mockScore < 0.4) socialProofLevel = 'newcomer';
        else if (mockScore < 0.6) socialProofLevel = 'active';
        else if (mockScore < 0.8) socialProofLevel = 'influencer';
        else if (mockScore < 0.95) socialProofLevel = 'whale';
        else socialProofLevel = 'legend';
      }
      
      // Calculate reach multiplier based on influence and distribution
      const baseReach = Math.min(3, 1 + (influenceScore * 2));
      const distributionBonus = Math.min(2, recipientCount / 100);
      const valueBonus = Math.min(1.5, valuePerToken * 10);
      const reachMultiplier = baseReach + distributionBonus + valueBonus;
      
      // Viral bonus calculation
      const categoryBonuses = {
        'romantic': 1.5,
        'celebration': 1.8,
        'gratitude': 1.3,
        'encouragement': 1.4,
        'friendship': 1.2,
        'business': 1.0,
        'other': 1.0
      };
      
      const viralBonus = (categoryBonuses[messageCategory as keyof typeof categoryBonuses] || 1.0) * influenceScore;
      
      // Network value (estimated additional reach value)
      const networkValue = (reachMultiplier - 1) * valuePerToken * recipientCount;
      
      return {
        influenceScore,
        reachMultiplier,
        socialProofLevel,
        viralBonus,
        networkValue
      };
    };

    const newMetrics = calculateNetworkMetrics();
    setMetrics(newMetrics);
    
    // Set active network effects
    const effects = [];
    if (newMetrics.influenceScore > 0.6) effects.push("High Influence Multiplier");
    if (recipientCount > 50) effects.push("Mass Distribution Boost");
    if (valuePerToken > 0.05) effects.push("High Value Amplification");
    if (newMetrics.socialProofLevel === 'whale' || newMetrics.socialProofLevel === 'legend') {
      effects.push("Whale Status Benefits");
    }
    
    setActiveEffects(effects);
  }, [senderWallet, recipientCount, valuePerToken, messageCategory]);

  const getSocialProofColor = (level: string) => {
    switch (level) {
      case 'legend': return 'text-purple-400 border-purple-400';
      case 'whale': return 'text-blue-400 border-blue-400';
      case 'influencer': return 'text-green-400 border-green-400';
      case 'active': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getSocialProofIcon = (level: string) => {
    switch (level) {
      case 'legend': return '👑';
      case 'whale': return '🐋';
      case 'influencer': return '⭐';
      case 'active': return '🔥';
      default: return '🌱';
    }
  };

  return (
    <Card className="glassmorphism border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-electric-blue" />
          Network Effects Engine
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Social Proof Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getSocialProofIcon(metrics.socialProofLevel)}</span>
            <div>
              <p className="text-sm font-medium">Social Proof Level</p>
              <Badge variant="outline" className={`capitalize ${getSocialProofColor(metrics.socialProofLevel)}`}>
                {metrics.socialProofLevel}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Influence Score</p>
            <p className="text-lg font-bold text-electric-blue">
              {Math.round(metrics.influenceScore * 100)}
            </p>
          </div>
        </div>

        {/* Reach Multiplier */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Reach Multiplier</span>
            </div>
            <span className="text-lg font-bold text-green-400">
              {metrics.reachMultiplier.toFixed(1)}x
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Your message will reach {Math.round(recipientCount * metrics.reachMultiplier)} people
          </div>
        </div>

        {/* Network Value */}
        {metrics.networkValue > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">Network Value Bonus</span>
              </div>
              <span className="text-lg font-bold text-purple-400">
                +{metrics.networkValue.toFixed(3)} SOL
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Additional value from network amplification effects
            </div>
          </div>
        )}

        {/* Active Effects */}
        {activeEffects.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Active Network Effects</span>
            </div>
            <div className="grid gap-2">
              {activeEffects.map((effect, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg p-2 border border-yellow-500/20"
                >
                  <span className="text-xs font-medium text-yellow-400">{effect}</span>
                  <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400">
                    Active
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Viral Reward System */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-3 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Viral Reward System</span>
          </div>
          <div className="text-xs text-gray-300 space-y-1">
            <p>• Earn rewards when your messages go viral</p>
            <p>• Higher influence = better reward multipliers</p>
            <p>• Sharers earn a percentage of viral success</p>
          </div>
        </div>

        {/* Network Growth Info */}
        <div className="text-center py-2">
          <p className="text-xs text-gray-400">
            Network effects increase exponentially with platform growth
          </p>
          <Button variant="link" className="text-xs p-0 h-auto text-electric-blue">
            Learn more about influence scoring →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}