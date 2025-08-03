import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Zap, 
  Brain, 
  TrendingUp, 
  Waves,
  Star,
  Sparkles,
  Rocket,
  Globe,
  Target,
  Diamond,
  Award,
  CheckCircle,
  ArrowRight,
  Mic,
  Music,
  Eye,
  Share2
} from 'lucide-react';

interface TechnologyShowcaseProps {
  onExploreClick: () => void;
}

export function TechnologyShowcase({ onExploreClick }: TechnologyShowcaseProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const revolutionaryFeatures = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "VoiceAttachmentUploader™",
      subtitle: "WORLD FIRST",
      description: "Record voice messages directly to blockchain. Upload songs and music to SPL tokens permanently.",
      highlights: ["Real-time recording", "Multi-format support", "Instant emotion analysis", "Blockchain permanence"],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-900/20 to-cyan-900/20",
      borderColor: "border-blue-500/30"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AIVoiceEnhancer™",
      subtitle: "IMPOSSIBLE ELSEWHERE",
      description: "Neural voice pattern analysis with personality detection and market value prediction.",
      highlights: ["Voice fingerprinting", "Emotional depth mapping", "Rarity scoring", "Market prediction"],
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-900/20 to-pink-900/20",
      borderColor: "border-purple-500/30"
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: "BlockchainAudioVisualizer™",
      subtitle: "NEVER SEEN BEFORE",
      description: "Real-time audio waveform visualization with blockchain pulse effects and energy mapping.",
      highlights: ["Live waveform display", "Blockchain sync effects", "Emotion-reactive visuals", "Energy visualization"],
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-900/20 to-teal-900/20",
      borderColor: "border-emerald-500/30"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "SocialViralPredictor™",
      subtitle: "BREAKTHROUGH TECHNOLOGY",
      description: "Multi-platform viral analysis predicting success across Twitter, TikTok, Instagram, YouTube.",
      highlights: ["Viral coefficient calculation", "Platform optimization", "Monetization forecasting", "Engagement prediction"],
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-900/20 to-orange-900/20",
      borderColor: "border-yellow-500/30"
    }
  ];

  const achievements = [
    { icon: <Crown className="w-5 h-5" />, text: "World's First Multimedia Blockchain Platform" },
    { icon: <Diamond className="w-5 h-5" />, text: "Voice Emotion Analysis + Token Economics" },
    { icon: <Rocket className="w-5 h-5" />, text: "AI Enhancement + Viral Prediction Integration" },
    { icon: <Globe className="w-5 h-5" />, text: "Multi-Platform Social Intelligence" },
    { icon: <Award className="w-5 h-5" />, text: "Permanent Audio Storage on Solana Blockchain" }
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-900/95 border-2 border-yellow-500/40 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
            Revolutionary Technology Showcase
          </CardTitle>
          <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-red-500/20 text-red-300 animate-pulse border border-red-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            ABSOLUTELY IMPOSSIBLE TO FIND ELSEWHERE
          </Badge>
        </div>

        <p className="text-gray-300 text-lg max-w-4xl mx-auto">
          Experience the world's most advanced multimedia blockchain platform with 4 revolutionary components 
          that have never existed before. This technology creates entirely new possibilities for digital value creation.
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Technology Achievement Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border border-yellow-500/20"
            >
              <div className="text-yellow-400">{achievement.icon}</div>
              <span className="text-yellow-300 text-sm font-medium">{achievement.text}</span>
            </div>
          ))}
        </div>

        {/* Interactive Feature Showcase */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Revolutionary Components
          </h3>
          
          {/* Feature Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {revolutionaryFeatures.map((feature, index) => (
              <Button
                key={index}
                variant={activeFeature === index ? "default" : "outline"}
                onClick={() => setActiveFeature(index)}
                className={`p-4 h-auto flex-col gap-2 transition-all duration-300 ${
                  activeFeature === index 
                    ? `bg-gradient-to-r ${feature.color} text-white border-transparent` 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className={activeFeature === index ? 'text-white' : 'text-gray-400'}>
                  {feature.icon}
                </div>
                <div className="text-center">
                  <div className={`font-medium text-sm ${activeFeature === index ? 'text-white' : 'text-gray-300'}`}>
                    {feature.title.replace('™', '')}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs mt-1 ${
                      activeFeature === index 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-800/50 text-gray-400'
                    }`}
                  >
                    {feature.subtitle}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>

          {/* Active Feature Display */}
          <Card className={`${revolutionaryFeatures[activeFeature].bgColor} border-2 ${revolutionaryFeatures[activeFeature].borderColor} transition-all duration-500`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${revolutionaryFeatures[activeFeature].color} flex items-center gap-3`}>
                <div className={`text-transparent bg-clip-text bg-gradient-to-r ${revolutionaryFeatures[activeFeature].color}`}>
                  {revolutionaryFeatures[activeFeature].icon}
                </div>
                {revolutionaryFeatures[activeFeature].title}
                <Badge variant="secondary" className="bg-red-500/20 text-red-300 animate-pulse">
                  {revolutionaryFeatures[activeFeature].subtitle}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-lg">
                {revolutionaryFeatures[activeFeature].description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {revolutionaryFeatures[activeFeature].highlights.map((highlight, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-900/30 rounded-lg border border-gray-700/30"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Experience Flow */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Complete User Experience Flow
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Audio Creation", desc: "Record voice or upload music", icon: <Mic className="w-5 h-5" /> },
              { step: "2", title: "AI Enhancement", desc: "Neural analysis & fingerprinting", icon: <Brain className="w-5 h-5" /> },
              { step: "3", title: "Viral Prediction", desc: "Multi-platform success analysis", icon: <TrendingUp className="w-5 h-5" /> },
              { step: "4", title: "Ultimate Token", desc: "Blockchain permanence achieved", icon: <Crown className="w-5 h-5" /> }
            ].map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/30 p-4 text-center">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  <div className="text-gray-300 mb-2">{step.icon}</div>
                  <h4 className="font-medium text-white mb-1">{step.title}</h4>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </Card>
                
                {index < 3 && (
                  <ArrowRight className="absolute top-1/2 -right-2 w-4 h-4 text-blue-400 transform -translate-y-1/2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <div className="p-6 bg-gradient-to-r from-yellow-900/30 via-orange-900/30 to-red-900/30 rounded-lg border border-yellow-500/30">
            <h3 className="text-2xl font-bold text-yellow-300 mb-2">Experience the Revolutionary Platform</h3>
            <p className="text-gray-300 mb-4">
              Be among the first to use technology that literally doesn't exist anywhere else in the world.
            </p>
            <Button
              onClick={onExploreClick}
              size="lg"
              className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-700 hover:via-orange-700 hover:to-red-700 text-white font-bold py-3 px-8"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Explore Revolutionary Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}