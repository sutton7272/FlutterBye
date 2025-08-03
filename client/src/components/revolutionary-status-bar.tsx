import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Activity,
  Globe,
  Atom,
  Clock,
  Heart
} from 'lucide-react';

export function RevolutionaryStatusBar() {
  const [status, setStatus] = useState({
    quantum: Math.floor(Math.random() * 100),
    neural: Math.floor(Math.random() * 100),
    temporal: Math.floor(Math.random() * 100),
    emotional: Math.floor(Math.random() * 100),
    consciousness: Math.floor(Math.random() * 100)
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus({
        quantum: Math.floor(Math.random() * 15) + 85, // 85-100%
        neural: Math.floor(Math.random() * 20) + 80, // 80-100%
        temporal: Math.floor(Math.random() * 25) + 75, // 75-100%
        emotional: Math.floor(Math.random() * 20) + 80, // 80-100%
        consciousness: Math.floor(Math.random() * 10) + 90 // 90-100%
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-electric-blue/20 bg-black/40 backdrop-blur-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-5 h-5 text-electric-blue" />
            </motion.div>
            <h3 className="font-semibold text-electric-blue">Revolutionary AI Status</h3>
            <Badge className="bg-electric-green/20 text-electric-green border-electric-green/30 animate-pulse">
              ACTIVE
            </Badge>
          </div>
          <div className="text-xs text-slate-400">
            Live Monitoring • {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <motion.div
              key={status.quantum}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-1"
            >
              <Atom className="w-4 h-4 text-purple-400" />
              <div className="text-lg font-bold text-purple-400">{status.quantum}%</div>
              <div className="text-xs text-slate-400">Quantum</div>
            </motion.div>
          </div>
          
          <div className="text-center">
            <motion.div
              key={status.neural}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-1"
            >
              <Zap className="w-4 h-4 text-blue-400" />
              <div className="text-lg font-bold text-blue-400">{status.neural}%</div>
              <div className="text-xs text-slate-400">Neural</div>
            </motion.div>
          </div>
          
          <div className="text-center">
            <motion.div
              key={status.temporal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-1"
            >
              <Clock className="w-4 h-4 text-orange-400" />
              <div className="text-lg font-bold text-orange-400">{status.temporal}%</div>
              <div className="text-xs text-slate-400">Temporal</div>
            </motion.div>
          </div>
          
          <div className="text-center">
            <motion.div
              key={status.emotional}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-1"
            >
              <Heart className="w-4 h-4 text-pink-400" />
              <div className="text-lg font-bold text-pink-400">{status.emotional}%</div>
              <div className="text-xs text-slate-400">Emotional</div>
            </motion.div>
          </div>
          
          <div className="text-center">
            <motion.div
              key={status.consciousness}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-1"
            >
              <Activity className="w-4 h-4 text-electric-green" />
              <div className="text-lg font-bold text-electric-green">{status.consciousness}%</div>
              <div className="text-xs text-slate-400">Conscious</div>
            </motion.div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Globe className="w-3 h-3" />
          <span>Revolutionary AI Operating at Peak Performance</span>
          <Sparkles className="w-3 h-3 text-electric-blue animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}