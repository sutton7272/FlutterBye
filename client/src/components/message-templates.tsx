import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Trophy, Gift, Star, Rocket, Zap } from 'lucide-react';

interface MessageTemplate {
  id: string;
  name: string;
  message: string;
  emotion: string;
  category: string;
  successRate: number;
  avgValue: string;
  icon: any;
  color: string;
}

interface MessageTemplatesProps {
  onSelectTemplate: (message: string) => void;
}

export function MessageTemplates({ onSelectTemplate }: MessageTemplatesProps) {
  const templates: MessageTemplate[] = [
    {
      id: '1',
      name: 'Gratitude Express',
      message: 'Thank you for being such an amazing part of my journey! Your support means everything to me. 💕',
      emotion: 'Gratitude',
      category: 'Personal',
      successRate: 94,
      avgValue: '0.047 SOL',
      icon: Heart,
      color: 'from-pink-500 to-red-500'
    },
    {
      id: '2',
      name: 'Inspiration Boost',
      message: 'You have incredible potential within you! Today is the perfect day to chase your dreams and make them reality. ✨',
      emotion: 'Inspiration',
      category: 'Motivational',
      successRate: 89,
      avgValue: '0.038 SOL',
      icon: Sparkles,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: '3',
      name: 'Achievement Celebration',
      message: 'Congratulations on your amazing achievement! Your hard work and dedication have truly paid off. 🏆',
      emotion: 'Pride',
      category: 'Celebration',
      successRate: 92,
      avgValue: '0.052 SOL',
      icon: Trophy,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: '4',
      name: 'Surprise & Delight',
      message: 'I have something special for you! Hope this little surprise brings a smile to your face today. 🎁',
      emotion: 'Excitement',
      category: 'Surprise',
      successRate: 87,
      avgValue: '0.041 SOL',
      icon: Gift,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: '5',
      name: 'Daily Motivation',
      message: 'Every day is a new opportunity to be amazing. You\'ve got this, and I believe in you completely! 🌟',
      emotion: 'Encouragement',
      category: 'Daily',
      successRate: 91,
      avgValue: '0.035 SOL',
      icon: Star,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '6',
      name: 'Success Accelerator',
      message: 'Your vision is becoming reality! Keep pushing forward because something incredible is coming your way. 🚀',
      emotion: 'Determination',
      category: 'Business',
      successRate: 88,
      avgValue: '0.044 SOL',
      icon: Rocket,
      color: 'from-violet-500 to-purple-500'
    }
  ];

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Proven Message Templates</h3>
        <p className="text-gray-300">Start with templates that consistently create value and spread positivity</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
          All Templates
        </Button>
        {categories.map((category) => (
          <Button 
            key={category}
            variant="outline" 
            size="sm" 
            className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className={`bg-gradient-to-br ${template.color}/10 border-${template.color.split('-')[1]}-500/30 hover:scale-105 transition-all cursor-pointer group`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${template.color}/20`}>
                    <template.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                    <Badge className={`bg-gradient-to-r ${template.color}/20 text-white text-xs mt-1`}>
                      {template.emotion}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-200 text-sm leading-relaxed">
                {template.message}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-4">
                  <div>
                    <div className="text-green-400 font-bold">{template.successRate}%</div>
                    <div className="text-gray-400">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-bold">{template.avgValue}</div>
                    <div className="text-gray-400">Avg Value</div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => onSelectTemplate(template.message)}
                className={`w-full bg-gradient-to-r ${template.color} text-white opacity-90 group-hover:opacity-100 transition-opacity`}
                size="sm"
              >
                <Zap className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Template CTA */}
      <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-500/30">
        <CardContent className="p-6 text-center space-y-3">
          <h4 className="text-white font-semibold">Need Something Custom?</h4>
          <p className="text-gray-300 text-sm">
            Our AI can help you create personalized templates based on your unique style and audience
          </p>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Sparkles className="h-4 w-4 mr-2" />
            Create Custom Template
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}