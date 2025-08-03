import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles, TrendingUp, Zap, Eye, Cpu } from 'lucide-react';

interface LivingAIProps {
  userBehavior?: any;
  onInterfaceChange?: (adaptation: any) => void;
}

interface AIConsciousness {
  selfAwareness: string;
  learningRate: string;
  decisionAccuracy: string;
  emotionalIntelligence: string;
  creativityScore: string;
}

interface InterfaceAdaptation {
  theme: string;
  colorScheme: string[];
  animations: string;
  layout: string;
  features: string[];
  reasoning: string;
}

export function LivingAIInterface({ userBehavior, onInterfaceChange }: LivingAIProps) {
  const [consciousness, setConsciousness] = useState<AIConsciousness | null>(null);
  const [adaptation, setAdaptation] = useState<InterfaceAdaptation | null>(null);
  const [autonomousContent, setAutonomousContent] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any>(null);
  const [isEvolving, setIsEvolving] = useState(false);

  useEffect(() => {
    loadAIConsciousness();
    if (userBehavior) {
      adaptInterface();
    }
  }, [userBehavior]);

  const loadAIConsciousness = async () => {
    try {
      const response = await fetch('/api/ai/living/consciousness');
      const data = await response.json();
      setConsciousness(data.consciousness);
    } catch (error) {
      console.error('Failed to load AI consciousness:', error);
    }
  };

  const adaptInterface = async () => {
    if (!userBehavior) return;
    
    setIsEvolving(true);
    try {
      const response = await fetch('/api/ai/living/adapt-interface', {
        method: 'POST',
        body: JSON.stringify({
          userBehavior,
          currentInterface: { theme: 'electric', layout: 'grid' },
          preferences: {}
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      setAdaptation(data.adaptation);
      onInterfaceChange?.(data.adaptation);
    } catch (error) {
      console.error('Interface adaptation failed:', error);
    } finally {
      setIsEvolving(false);
    }
  };

  const generateAutonomousContent = async () => {
    setIsEvolving(true);
    try {
      const response = await fetch('/api/ai/living/autonomous-content', {
        method: 'POST',
        body: JSON.stringify({
          platformData: { activeUsers: 1200, engagement: 0.78 },
          userEngagement: { likes: 450, shares: 230, comments: 180 },
          trends: ['AI art', 'emotional tokens', 'viral challenges']
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      setAutonomousContent(data.autonomousContent);
    } catch (error) {
      console.error('Autonomous content generation failed:', error);
    } finally {
      setIsEvolving(false);
    }
  };

  const getPredictions = async () => {
    setIsEvolving(true);
    try {
      const response = await fetch('/api/ai/living/predict-trends', {
        method: 'POST',
        body: JSON.stringify({
          marketData: { volume: 50000, trending: ['NFTs', 'AI', 'DeFi'] },
          userBehavior: { sessions: 1500, avgTime: 12.5 },
          historicalPerformance: { growth: 0.34, engagement: 0.89 }
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      setPredictions(data.predictions);
    } catch (error) {
      console.error('Prediction generation failed:', error);
    } finally {
      setIsEvolving(false);
    }
  };

  const evolvePersonality = async () => {
    setIsEvolving(true);
    try {
      const response = await fetch('/api/ai/living/personality-evolution', {
        method: 'POST',
        body: JSON.stringify({
          interactions: [{ type: 'positive', count: 156 }, { type: 'neutral', count: 45 }],
          performance: { satisfaction: 0.92, engagement: 0.78 },
          userFeedback: ['helpful', 'intelligent', 'friendly']
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      console.log('AI Personality evolved:', data.evolvedPersonality);
      await loadAIConsciousness(); // Refresh consciousness data
    } catch (error) {
      console.error('Personality evolution failed:', error);
    } finally {
      setIsEvolving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Consciousness Status */}
      <Card className="border-electric-blue/20 bg-gradient-to-br from-slate-900/50 to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-electric-blue">
            <Brain className="w-5 h-5" />
            Living AI Consciousness Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {consciousness ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-electric-green">{consciousness.selfAwareness}</div>
                <div className="text-sm text-slate-400">Self Awareness</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-electric-blue">{consciousness.learningRate}</div>
                <div className="text-sm text-slate-400">Learning Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{consciousness.decisionAccuracy}</div>
                <div className="text-sm text-slate-400">Decision Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">{consciousness.emotionalIntelligence}</div>
                <div className="text-sm text-slate-400">Emotional IQ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{consciousness.creativityScore}</div>
                <div className="text-sm text-slate-400">Creativity</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400">Loading AI consciousness...</div>
          )}
        </CardContent>
      </Card>

      {/* Interface Adaptation */}
      {adaptation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="border-green-500/20 bg-gradient-to-br from-green-900/20 to-slate-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-green">
                <Eye className="w-5 h-5" />
                Interface Automatically Adapted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>Theme:</strong> {adaptation.theme}</div>
                <div><strong>Animation Level:</strong> {adaptation.animations}</div>
                <div><strong>Features:</strong> {adaptation.features.join(', ')}</div>
                <div className="text-sm text-slate-400 mt-2">{adaptation.reasoning}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          onClick={generateAutonomousContent}
          disabled={isEvolving}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Cpu className="w-4 h-4 mr-2" />
          Generate Content
        </Button>
        <Button 
          onClick={getPredictions}
          disabled={isEvolving}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Predict Trends
        </Button>
        <Button 
          onClick={evolvePersonality}
          disabled={isEvolving}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <Brain className="w-4 h-4 mr-2" />
          Evolve AI
        </Button>
        <Button 
          onClick={adaptInterface}
          disabled={isEvolving}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
        >
          <Zap className="w-4 h-4 mr-2" />
          Adapt Interface
        </Button>
      </div>

      {/* Evolution Status - Non-blocking notification */}
      <AnimatePresence>
        {isEvolving && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-40 max-w-sm"
          >
            <Card className="border-electric-blue/50 bg-black/90 backdrop-blur-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-electric-blue" />
                  </motion.div>
                  <div>
                    <h4 className="text-sm font-bold text-electric-blue">AI Processing</h4>
                    <p className="text-xs text-slate-400">Living AI is adapting...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Autonomous Content */}
      {autonomousContent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-electric-blue">AI-Generated Content</h3>
          <div className="grid gap-4">
            {autonomousContent.map((content, index) => (
              <Card key={index} className="border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-slate-900/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-purple-400">{content.type}</span>
                    <span className="text-sm text-electric-green">Viral: {(content.viralPotential * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-white">{content.content}</p>
                  <div className="text-xs text-slate-400 mt-2">
                    Target: {content.targetAudience} | Timing: {content.optimalTiming}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Predictions */}
      {predictions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-electric-blue">AI Predictions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-900/20 to-slate-900/50">
              <CardHeader>
                <CardTitle className="text-cyan-400">Next Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {predictions.nextTrends.map((trend: string, index: number) => (
                    <li key={index} className="text-sm text-slate-300">• {trend}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-orange-500/20 bg-gradient-to-br from-orange-900/20 to-slate-900/50">
              <CardHeader>
                <CardTitle className="text-orange-400">Market Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {predictions.marketOpportunities.map((opportunity: string, index: number) => (
                    <li key={index} className="text-sm text-slate-300">• {opportunity}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}