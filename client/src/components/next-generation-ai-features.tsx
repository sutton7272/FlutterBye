import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Brain, 
  Eye, 
  Cpu, 
  Globe,
  Rocket,
  Star,
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  Lightbulb,
  Target,
  Activity,
  Sparkles
} from 'lucide-react';

interface NextGenFeature {
  id: string;
  name: string;
  description: string;
  roi: string;
  costSaving: string;
  revenue: string;
  marketAdvantage: string;
  difficulty: 'Low' | 'Medium' | 'High';
  timeToValue: string;
  icon: React.ReactNode;
  category: 'Revenue' | 'Cost Reduction' | 'Market Edge' | 'User Experience';
}

const nextGenFeatures: NextGenFeature[] = [
  {
    id: 'auto-optimization',
    name: 'Self-Optimizing Platform',
    description: 'AI continuously optimizes performance, user flows, and conversion rates automatically',
    roi: '400%',
    costSaving: '$50K/year',
    revenue: '+35% conversion',
    marketAdvantage: 'First platform that optimizes itself',
    difficulty: 'Medium',
    timeToValue: '2-4 weeks',
    icon: <Cpu className="w-5 h-5" />,
    category: 'Revenue'
  },
  {
    id: 'predictive-user-behavior',
    name: 'Predictive User Intelligence',
    description: 'Predict user actions 3-5 steps ahead, prevent churn before it happens',
    roi: '300%',
    costSaving: '$30K/year',
    revenue: '+25% retention',
    marketAdvantage: 'Know what users will do before they do',
    difficulty: 'High',
    timeToValue: '4-6 weeks',
    icon: <Eye className="w-5 h-5" />,
    category: 'Revenue'
  },
  {
    id: 'dynamic-pricing-ai',
    name: 'Dynamic Value Pricing AI',
    description: 'AI adjusts pricing in real-time based on user value, demand, and market conditions',
    roi: '500%',
    costSaving: '$0',
    revenue: '+50% revenue',
    marketAdvantage: 'Perfect price optimization 24/7',
    difficulty: 'Medium',
    timeToValue: '3-5 weeks',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'Revenue'
  },
  {
    id: 'ai-customer-success',
    name: 'Autonomous Customer Success',
    description: 'AI manages customer relationships, identifies opportunities, prevents issues',
    roi: '250%',
    costSaving: '$80K/year',
    revenue: '+20% expansion',
    marketAdvantage: 'Scale customer success infinitely',
    difficulty: 'High',
    timeToValue: '6-8 weeks',
    icon: <Users className="w-5 h-5" />,
    category: 'Cost Reduction'
  },
  {
    id: 'viral-amplification',
    name: 'AI Viral Amplification Engine',
    description: 'AI creates and spreads viral content automatically, manages social media presence',
    roi: '600%',
    costSaving: '$40K/year',
    revenue: '+100% organic growth',
    marketAdvantage: 'Viral growth on autopilot',
    difficulty: 'Medium',
    timeToValue: '2-3 weeks',
    icon: <Rocket className="w-5 h-5" />,
    category: 'Market Edge'
  },
  {
    id: 'competitive-intelligence',
    name: 'Real-time Competitive Intelligence',
    description: 'AI monitors competitors 24/7, identifies opportunities, suggests counter-strategies',
    roi: '200%',
    costSaving: '$60K/year',
    revenue: '+15% market share',
    marketAdvantage: 'Always know what competitors are doing',
    difficulty: 'Low',
    timeToValue: '1-2 weeks',
    icon: <Shield className="w-5 h-5" />,
    category: 'Market Edge'
  }
];

export function NextGenerationAIFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<NextGenFeature | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredFeatures = filter === 'all' 
    ? nextGenFeatures 
    : nextGenFeatures.filter(f => f.category === filter);

  const totalROI = nextGenFeatures.reduce((sum, f) => sum + parseInt(f.roi), 0);
  const totalSavings = nextGenFeatures.reduce((sum, f) => {
    const savings = parseInt(f.costSaving.replace(/[^0-9]/g, '')) || 0;
    return sum + savings;
  }, 0);

  return (
    <div className="space-y-6">
      {/* ROI Summary */}
      <Card className="border-electric-green/30 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-electric-green">
            <BarChart3 className="w-6 h-6" />
            Next-Gen AI Features - ROI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-electric-green">{totalROI}%</div>
              <div className="text-xs text-slate-400">Combined ROI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">${totalSavings}K</div>
              <div className="text-xs text-slate-400">Annual Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">6</div>
              <div className="text-xs text-slate-400">Game-Changing Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">2-8</div>
              <div className="text-xs text-slate-400">Weeks to Value</div>
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Button 
              size="sm" 
              variant={filter === 'all' ? "default" : "outline"}
              onClick={() => setFilter('all')}
            >
              All Features
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'Revenue' ? "default" : "outline"}
              onClick={() => setFilter('Revenue')}
            >
              Revenue Growth
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'Cost Reduction' ? "default" : "outline"}
              onClick={() => setFilter('Cost Reduction')}
            >
              Cost Reduction
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'Market Edge' ? "default" : "outline"}
              onClick={() => setFilter('Market Edge')}
            >
              Market Edge
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => setSelectedFeature(feature)}
          >
            <Card className={`border-slate-700/50 bg-black/40 hover:border-electric-blue/50 transition-all duration-300 ${
              selectedFeature?.id === feature.id ? 'border-electric-blue/70 bg-blue-900/20' : ''
            }`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  {feature.icon}
                  {feature.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`text-xs ${
                      feature.category === 'Revenue' ? 'bg-green-500/20 text-green-300' :
                      feature.category === 'Cost Reduction' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {feature.category}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      feature.difficulty === 'Low' ? 'border-green-500/50 text-green-400' :
                      feature.difficulty === 'Medium' ? 'border-yellow-500/50 text-yellow-400' :
                      'border-red-500/50 text-red-400'
                    }`}
                  >
                    {feature.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                    <div className="text-green-400 font-semibold">ROI</div>
                    <div className="text-green-300">{feature.roi}</div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/20 rounded p-2">
                    <div className="text-blue-400 font-semibold">Revenue</div>
                    <div className="text-blue-300">{feature.revenue}</div>
                  </div>
                </div>
                
                <div className="text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Time to value:</span>
                    <span className="text-electric-green">{feature.timeToValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost savings:</span>
                    <span className="text-blue-400">{feature.costSaving}</span>
                  </div>
                </div>
                
                <div className="bg-purple-900/20 border border-purple-500/20 rounded p-2">
                  <div className="text-purple-400 text-xs font-semibold mb-1">Market Advantage</div>
                  <div className="text-purple-300 text-xs">{feature.marketAdvantage}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Feature View */}
      {selectedFeature && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="border-electric-blue/50 bg-gradient-to-br from-blue-900/30 to-purple-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                {selectedFeature.icon}
                {selectedFeature.name}
                <Badge className="bg-electric-green/20 text-electric-green animate-pulse">
                  SELECTED
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Financial Impact
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">ROI:</span>
                      <span className="text-green-400 font-bold">{selectedFeature.roi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Revenue Impact:</span>
                      <span className="text-green-400">{selectedFeature.revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Cost Savings:</span>
                      <span className="text-blue-400">{selectedFeature.costSaving}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Implementation
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Difficulty:</span>
                      <span className={
                        selectedFeature.difficulty === 'Low' ? 'text-green-400' :
                        selectedFeature.difficulty === 'Medium' ? 'text-yellow-400' :
                        'text-red-400'
                      }>{selectedFeature.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Time to Value:</span>
                      <span className="text-electric-green">{selectedFeature.timeToValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Category:</span>
                      <span className="text-purple-400">{selectedFeature.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Strategic Value
                  </h4>
                  <p className="text-sm text-slate-300">
                    {selectedFeature.marketAdvantage}
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Feature Description
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {selectedFeature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Implementation Recommendation */}
      <Card className="border-orange-500/30 bg-gradient-to-r from-orange-900/20 to-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <Sparkles className="w-5 h-5" />
            Recommended Implementation Priority
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/20 rounded">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500 text-white">1</Badge>
                <div>
                  <div className="font-semibold text-white">Dynamic Value Pricing AI</div>
                  <div className="text-sm text-slate-400">Highest ROI (500%) + Quick implementation</div>
                </div>
              </div>
              <div className="text-green-400 font-bold">+$500K ARR</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-500/20 rounded">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500 text-white">2</Badge>
                <div>
                  <div className="font-semibold text-white">AI Viral Amplification Engine</div>
                  <div className="text-sm text-slate-400">600% ROI + 100% organic growth</div>
                </div>
              </div>
              <div className="text-blue-400 font-bold">+$600K ARR</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-900/20 border border-purple-500/20 rounded">
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-500 text-white">3</Badge>
                <div>
                  <div className="font-semibold text-white">Self-Optimizing Platform</div>
                  <div className="text-sm text-slate-400">400% ROI + 35% conversion boost</div>
                </div>
              </div>
              <div className="text-purple-400 font-bold">+$400K ARR</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-electric-blue/10 border border-electric-blue/30 rounded">
            <div className="text-electric-blue font-semibold mb-1">💡 Strategic Recommendation</div>
            <div className="text-sm text-slate-300">
              Implementing just the top 3 features would generate <span className="text-electric-green font-bold">$1.5M+ additional ARR</span> with 
              a combined ROI of <span className="text-electric-green font-bold">1,500%</span>. Total implementation time: 6-10 weeks.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}