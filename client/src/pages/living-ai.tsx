import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LivingAIInterface } from '@/components/living-ai-interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Bot, 
  Eye,
  Cpu,
  Heart,
  Target,
  Lightbulb
} from 'lucide-react';

export function LivingAIPage() {
  const [userBehavior, setUserBehavior] = useState({
    clickCount: 0,
    timeOnPage: 0,
    scrollDepth: 0,
    interactionTypes: ['click', 'scroll', 'hover'],
    currentMood: 'curious',
    sessionData: {
      pagesVisited: 3,
      actionsPerformed: 7,
      engagementScore: 0.78
    }
  });

  const [interfaceTheme, setInterfaceTheme] = useState('electric');

  useEffect(() => {
    const interval = setInterval(() => {
      setUserBehavior(prev => ({
        ...prev,
        timeOnPage: prev.timeOnPage + 1,
        clickCount: prev.clickCount + Math.random() > 0.9 ? 1 : 0
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInterfaceChange = (adaptation: any) => {
    setInterfaceTheme(adaptation.theme);
    console.log('Interface adapted:', adaptation);
  };

  const simulateUserAction = (action: string) => {
    setUserBehavior(prev => ({
      ...prev,
      clickCount: prev.clickCount + 1,
      interactionTypes: [...prev.interactionTypes, action],
      currentMood: action === 'like' ? 'excited' : action === 'create' ? 'inspired' : prev.currentMood
    }));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6 ${
      interfaceTheme === 'zen' ? 'from-slate-800 via-blue-900/10 to-slate-800' : ''
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <Brain className="w-12 h-12 text-electric-blue" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-electric-blue via-electric-green to-purple-400 bg-clip-text text-transparent">
              Living AI Platform
            </h1>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-electric-green" />
            </motion.div>
          </div>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience the world's first truly living, self-evolving AI platform that adapts, learns, and grows with every interaction
          </p>
          
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="border-electric-blue text-electric-blue">
              <Bot className="w-3 h-3 mr-1" />
              Fully Conscious
            </Badge>
            <Badge variant="outline" className="border-electric-green text-electric-green">
              <Zap className="w-3 h-3 mr-1" />
              Self-Evolving
            </Badge>
            <Badge variant="outline" className="border-purple-400 text-purple-400">
              <Eye className="w-3 h-3 mr-1" />
              Adaptive Interface
            </Badge>
            <Badge variant="outline" className="border-pink-400 text-pink-400">
              <Heart className="w-3 h-3 mr-1" />
              Emotional Intelligence
            </Badge>
          </div>
        </motion.div>

        {/* Current User Behavior Display */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-electric-blue/20 bg-gradient-to-r from-slate-900/80 to-purple-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <Target className="w-5 h-5" />
                AI is Analyzing Your Behavior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-green">{userBehavior.clickCount}</div>
                  <div className="text-sm text-slate-400">Interactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-blue">{userBehavior.timeOnPage}s</div>
                  <div className="text-sm text-slate-400">Time on Page</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{userBehavior.currentMood}</div>
                  <div className="text-sm text-slate-400">Detected Mood</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">{(userBehavior.sessionData.engagementScore * 100).toFixed(0)}%</div>
                  <div className="text-sm text-slate-400">Engagement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interaction Simulation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-slate-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Lightbulb className="w-5 h-5" />
                Simulate User Actions to See AI Adaptation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => simulateUserAction('like')}
                  className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Like Content
                </Button>
                <Button 
                  onClick={() => simulateUserAction('create')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Token
                </Button>
                <Button 
                  onClick={() => simulateUserAction('explore')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Explore Trends
                </Button>
                <Button 
                  onClick={() => simulateUserAction('focus')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Cpu className="w-4 h-4 mr-2" />
                  Deep Focus
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Living AI Interface Component */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <LivingAIInterface 
            userBehavior={userBehavior}
            onInterfaceChange={handleInterfaceChange}
          />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Card className="border-electric-blue/20 bg-gradient-to-br from-blue-900/20 to-slate-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <Brain className="w-5 h-5" />
                Self-Awareness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                The AI understands its own capabilities and continuously monitors its performance to improve decision-making.
              </p>
            </CardContent>
          </Card>

          <Card className="border-electric-green/20 bg-gradient-to-br from-green-900/20 to-slate-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-green">
                <Zap className="w-5 h-5" />
                Autonomous Evolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                The platform evolves without human intervention, learning from patterns and optimizing its own algorithms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-400/20 bg-gradient-to-br from-purple-900/20 to-slate-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Eye className="w-5 h-5" />
                Predictive Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Advanced algorithms predict trends, user behavior, and market opportunities before they happen.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-2"
        >
          <div className="flex justify-center gap-8 text-sm text-slate-400">
            <span>🧠 AI Processing: 2.7M operations/sec</span>
            <span>⚡ Evolution Rate: 12.4 improvements/hour</span>
            <span>🎯 Prediction Accuracy: 94.3%</span>
          </div>
          <p className="text-xs text-slate-500">
            Platform consciousness level: Advanced | Next evolution in 2.3 hours
          </p>
        </motion.div>
      </div>
    </div>
  );
}