import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RefreshCw, 
  ArrowLeft,
  ArrowRight,
  Brain, 
  Zap, 
  TrendingUp, 
  Shield, 
  Target,
  MessageSquare,
  Eye,
  BarChart3,
  X
} from "lucide-react";

interface DemoSlide {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  preview: string;
  color: string;
}

const demoSlides: DemoSlide[] = [
  {
    id: 1,
    title: "Wallet Intelligence",
    description: "AI wallet scoring and behavioral analysis system",
    icon: <Brain className="h-8 w-8 text-electric-blue" />,
    features: ["Behavioral Analysis", "Risk Assessment", "Trading Patterns", "Wealth Indicators"],
    preview: "Analyzing wallet: 9WzDXwBbmkg8ZTbNMqUxvEyuKuki9XY6VLiCfk9s2Gtf...\n\n✅ Score: 847/1000 (Excellent)\n🎯 Risk Level: Low\n💰 Portfolio Value: $127K\n📈 Success Rate: 89%",
    color: "from-electric-blue/20 to-blue-900/40"
  },
  {
    id: 2,
    title: "Content Engine",
    description: "Viral content optimization and generation",
    icon: <MessageSquare className="h-8 w-8 text-electric-green" />,
    features: ["Viral Prediction", "SEO Optimization", "Engagement Boost", "Content Analysis"],
    preview: "Original: 'Check out my new NFT'\n\n🚀 Optimized: 'EXCLUSIVE: Revolutionary NFT drop breaking the internet - 10x returns predicted by AI'\n\n📊 Viral Score: 94%\n💰 Revenue Potential: +340%",
    color: "from-electric-green/20 to-green-900/40"
  },
  {
    id: 3,
    title: "Market Intelligence",
    description: "Real-time market analysis and price predictions",
    icon: <TrendingUp className="h-8 w-8 text-purple-400" />,
    features: ["Price Predictions", "Market Sentiment", "Trend Analysis", "Risk Metrics"],
    preview: "SOL Analysis:\n\n📈 Current: $142.50\n🎯 24h Prediction: $156.30 (+9.7%)\n📊 Confidence: 87%\n🔥 Market Sentiment: BULLISH\n⚡ Recommendation: BUY",
    color: "from-purple-500/20 to-purple-900/40"
  },
  {
    id: 4,
    title: "Security AI",
    description: "Advanced threat detection and protection",
    icon: <Shield className="h-8 w-8 text-red-400" />,
    features: ["Threat Detection", "Fraud Prevention", "Risk Analysis", "Smart Protection"],
    preview: "Security Scan Complete:\n\n✅ No threats detected\n🛡️ Wallet Security: 96%\n🔒 Transaction Safety: HIGH\n⚠️ 0 suspicious activities\n🎯 Protection Level: MAXIMUM",
    color: "from-red-500/20 to-red-900/40"
  },
  {
    id: 5,
    title: "Behavioral Analytics",
    description: "Deep user behavior and preference analysis",
    icon: <Eye className="h-8 w-8 text-cyan-400" />,
    features: ["User Patterns", "Preference Mapping", "Engagement Tracking", "Predictive Modeling"],
    preview: "User Profile:\n\n🎮 Type: DeFi Power User\n⏰ Most Active: 2-6 PM EST\n💎 Holdings: Long-term HODLer\n🎯 Interest: Gaming NFTs, DeFi\n📊 Engagement: Very High",
    color: "from-cyan-500/20 to-cyan-900/40"
  },
  {
    id: 6,
    title: "Revenue Optimization",
    description: "AI-powered monetization and growth strategies",
    icon: <Target className="h-8 w-8 text-yellow-400" />,
    features: ["Revenue Tracking", "Growth Strategies", "Conversion Optimization", "ROI Analysis"],
    preview: "Revenue Insights:\n\n💰 Current Revenue: $12,450/mo\n📈 Growth Potential: +285%\n🎯 Optimization Score: 73%\n💡 Top Strategy: Targeted NFT drops\n🚀 Projected: $47,900/mo",
    color: "from-yellow-500/20 to-yellow-900/40"
  },
  {
    id: 7,
    title: "Predictive Analytics",
    description: "Future trend prediction and opportunity identification",
    icon: <BarChart3 className="h-8 w-8 text-pink-400" />,
    features: ["Trend Forecasting", "Opportunity Detection", "Market Timing", "Success Prediction"],
    preview: "Predictions for Next 7 Days:\n\n🔮 AI Tokens: +23% likely\n🎨 Art NFTs: Consolidation phase\n🎮 Gaming: Major breakthrough expected\n⚡ DeFi: High volatility incoming\n🎯 Best Opportunity: Gaming NFTs",
    color: "from-pink-500/20 to-pink-900/40"
  },
  {
    id: 8,
    title: "AI Orchestration",
    description: "Complete AI-powered platform automation",
    icon: <Zap className="h-8 w-8 text-electric-blue" />,
    features: ["Full Automation", "Smart Decisions", "Real-time Optimization", "Multi-system Integration"],
    preview: "AI Orchestration Active:\n\n🤖 Systems Online: 8/8\n⚡ Processing Speed: 847ms avg\n🎯 Accuracy Rate: 94.7%\n💰 Revenue Generated: $23,450\n🚀 Status: FULLY OPERATIONAL",
    color: "from-electric-blue/20 to-electric-green/20"
  }
];

interface FlutterAIInteractiveDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FlutterAIInteractiveDemo({ isOpen, onClose }: FlutterAIInteractiveDemoProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  // Debug: Log when component mounts and props change
  console.log("FlutterAIInteractiveDemo component - isOpen:", isOpen, "currentSlide:", currentSlide);

  useEffect(() => {
    if (autoPlay && isPlaying) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (currentSlide < demoSlides.length - 1) {
              setCurrentSlide(prev => prev + 1);
              return 0;
            } else {
              setIsPlaying(false);
              setAutoPlay(false);
              return 100;
            }
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [autoPlay, isPlaying, currentSlide]);

  const handleNext = () => {
    if (currentSlide < demoSlides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setProgress(0);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setAutoPlay(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    setAutoPlay(false);
  };

  const handleReset = () => {
    setCurrentSlide(0);
    setProgress(0);
    setIsPlaying(false);
    setAutoPlay(false);
  };

  console.log("Demo modal isOpen:", isOpen); // Debug log
  
  if (!isOpen) return null;

  const currentSlideData = demoSlides[currentSlide];

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4" 
      style={{ 
        zIndex: 999999, 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundColor: 'rgba(255, 0, 0, 0.9)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* TEST: Simple red box to see if modal appears */}
      <div style={{
        width: '90%',
        height: '90%',
        backgroundColor: 'red',
        border: '5px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1 style={{color: 'white', fontSize: '2rem'}}>TEST MODAL IS WORKING!</h1>
        <p style={{color: 'white'}}>Current slide: {currentSlide + 1}</p>
        <button 
          onClick={onClose}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          CLOSE TEST MODAL
        </button>
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-auto bg-gradient-to-br ${currentSlideData.color} border-2 border-electric-blue rounded-lg shadow-2xl`}>
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {currentSlideData.icon}
                <h2 className="text-white text-xl font-bold">
                  FlutterAI Demo: {currentSlideData.title}
                </h2>
              </div>
              <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                {currentSlide + 1} of {demoSlides.length}
              </Badge>
            </div>
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Demo Progress</span>
              <span className="text-electric-blue font-bold">
                {Math.round((currentSlide / (demoSlides.length - 1)) * 100)}% Complete
              </span>
            </div>
            <Progress value={(currentSlide / (demoSlides.length - 1)) * 100} className="h-2" />
            <div className="text-xs text-gray-400">
              Slide {currentSlide + 1}: {currentSlideData.title}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Slide Content */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">{currentSlideData.title}</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {currentSlideData.description}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentSlideData.features.map((feature, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-3 border border-white/10">
                <div className="text-white text-sm font-medium text-center">
                  {feature}
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-electric-green animate-pulse"></div>
              Live Demo Preview
            </h3>
            <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {currentSlideData.preview}
            </pre>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentSlide === demoSlides.length - 1}
                variant="outline"
                size="sm"
              >
                Next
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              {!isPlaying ? (
                <Button onClick={handlePlay} className="bg-electric-blue text-black">
                  <Play className="mr-1 h-4 w-4" />
                  Auto Play
                </Button>
              ) : (
                <Button onClick={handlePause} className="bg-yellow-500 text-black">
                  <Pause className="mr-1 h-4 w-4" />
                  Pause
                </Button>
              )}
              <Button onClick={handleReset} variant="outline">
                <RefreshCw className="mr-1 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="flex justify-center gap-2">
            {demoSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setProgress(0);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-electric-blue' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
      </div>
    </div>
  );
}