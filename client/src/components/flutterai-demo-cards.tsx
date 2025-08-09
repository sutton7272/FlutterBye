import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Brain, 
  Zap, 
  TrendingUp, 
  Shield, 
  Target,
  MessageSquare,
  Palette,
  Waves,
  Rocket
} from "lucide-react";

interface DemoCardProps {
  title: string;
  description: string;
  features: string[];
  capabilities: string[];
  progress: number;
  completedDemos: number;
  totalDemos: number;
  isActive?: boolean;
  onStart: () => void;
  icon: React.ReactNode;
  gradient: string;
  badges: string[];
  setupTime?: string;
  productCount?: number;
  revenueReady?: boolean;
}

function DemoCard({ 
  title, 
  description, 
  features, 
  capabilities,
  progress, 
  completedDemos,
  totalDemos,
  isActive = false,
  onStart,
  icon,
  gradient,
  badges,
  setupTime,
  productCount,
  revenueReady
}: DemoCardProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(progress);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 100) {
            setIsRunning(false);
            return 100;
          }
          return prev + Math.random() * 5;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setCurrentProgress(progress);
    onStart();
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentProgress(0);
  };

  return (
    <Card className={`${gradient} border-opacity-30 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${isActive ? 'ring-2 ring-electric-blue' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <CardTitle className="text-white text-lg">{title}</CardTitle>
              <div className="flex gap-1 mt-1">
                {badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-300 text-sm mt-2">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div key={index} className="bg-black/20 rounded-lg p-3 border border-white/10">
              <div className="text-electric-blue text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse"></div>
                {feature}
              </div>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        <div className="space-y-2">
          <h4 className="text-white font-medium text-sm">AI Capabilities You'll Experience:</h4>
          <ul className="space-y-1">
            {capabilities.map((capability, index) => (
              <li key={index} className="text-gray-300 text-xs flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-electric-green"></div>
                {capability}
              </li>
            ))}
          </ul>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-electric-blue font-bold">{Math.round(currentProgress)}% Complete</span>
          </div>
          <Progress value={currentProgress} className="h-2" />
          <div className="text-xs text-gray-400">
            {completedDemos} of {totalDemos} AI demos completed
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleStart}
          disabled={isRunning}
          className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80 text-black font-bold py-3"
        >
          <Play className="mr-2 h-4 w-4" />
          {isRunning ? "Running Demo..." : `Start ${title}`}
        </Button>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handlePause}
            disabled={!isRunning}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Pause className="mr-1 h-3 w-3" />
            Pause
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Reset
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-400">8 AI systems</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-gray-400">Live demos</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-electric-blue"></div>
              <span className="text-gray-400">Future ready</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {setupTime && (
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
            <span>⚡ {setupTime} setup</span>
            {productCount && <span>🎁 {productCount} products</span>}
            {revenueReady && <span className="text-electric-green">💰 Revenue ready</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function FlutterAIDemoCards() {
  const [activeDemos, setActiveDemos] = useState<string[]>([]);

  const handleStartDemo = (demoName: string) => {
    setActiveDemos(prev => [...prev, demoName]);
  };

  const aiIntelligenceDemo = {
    title: "AI Intelligence Demo",
    description: "GPT-4o powered intelligence that transforms blockchain forever with wallet analysis, content optimization, and predictive analytics",
    features: [
      "🧠 Wallet Intelligence",
      "🚀 Content Engine", 
      "📊 Market Intel",
      "🔒 Security AI"
    ],
    capabilities: [
      "Revolutionary wallet intelligence and behavioral analysis",
      "Content optimization that predicts viral potential", 
      "Real-time market intelligence and price predictions",
      "Advanced security threat detection and protection",
      "Revenue optimization using market psychology"
    ],
    progress: 63,
    completedDemos: 5,
    totalDemos: 8,
    icon: <Brain className="h-6 w-6 text-electric-blue" />,
    gradient: "bg-gradient-to-br from-electric-blue/20 to-purple-900/40 border-electric-blue/30",
    badges: ["8 AI demos", "Pre-Launch", "Early Access", "Exclusive Airdrops"],
    onStart: () => handleStartDemo("AI Intelligence")
  };

  const platformTutorialDemo = {
    title: "Interactive Demo",
    description: 'Master the "Google Ads of Crypto" Platform. Interactive walkthrough of revolutionary crypto marketing tools that enable precision targeting of any wallet holder',
    features: [
      "📱 FlutterbyeMSG",
      "🎨 FlutterArt",
      "🧠 FlutterAI", 
      "📡 FlutterWave"
    ],
    capabilities: [
      "Create targeted crypto marketing campaigns",
      "Mint valuable NFTs with advanced features",
      "Analyze wallet behavior with AI intelligence", 
      "Deploy SMS-to-blockchain emotional tokens",
      "Generate revenue with precision targeting"
    ],
    progress: 85,
    completedDemos: 4,
    totalDemos: 4,
    icon: <Rocket className="h-6 w-6 text-electric-green" />,
    gradient: "bg-gradient-to-br from-electric-green/20 to-blue-900/40 border-electric-green/30",
    badges: ["3 min demo", "Platform Tutorial"],
    setupTime: "3 min",
    productCount: 4,
    revenueReady: true,
    onStart: () => handleStartDemo("Platform Tutorial")
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-electric-blue via-electric-green to-electric-blue bg-clip-text text-transparent">
            FlutterAI: The Future is HERE!
          </span>
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          Experience REVOLUTIONARY AI Intelligence. Transform your crypto journey with cutting-edge blockchain analytics and predictive capabilities.
        </p>
      </div>

      {/* Demo Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <DemoCard {...aiIntelligenceDemo} />
        <DemoCard {...platformTutorialDemo} />
      </div>

      {/* What is Flutterbye Section */}
      <Card className="bg-gradient-to-br from-gray-900/60 to-electric-blue/10 border-electric-blue/20 backdrop-blur-sm max-w-4xl mx-auto">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6 text-electric-blue" />
            What is Flutterbye?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-electric-blue font-bold text-lg mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Tokenized Messaging
              </h4>
              <p className="text-gray-300 text-sm">
                Turn your 27-character messages into valuable SPL tokens on Solana
              </p>
            </div>
            
            <div>
              <h4 className="text-electric-green font-bold text-lg mb-3 flex items-center gap-2">
                <Waves className="h-5 w-5" />
                SMS-to-Blockchain
              </h4>
              <p className="text-gray-300 text-sm">
                Revolutionary FlutterWave technology bridges emotional communication with blockchain value
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/flutterai">
                <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue/10">
                  <Brain className="mr-2 h-4 w-4" />
                  FlutterAI Dashboard
                </Button>
              </Link>
              <Link href="/advanced-analytics">
                <Button variant="outline" className="border-electric-green text-electric-green hover:bg-electric-green/10">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analytics Dashboard
                </Button>
              </Link>
              <Link href="/flutter-wave">
                <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/10">
                  <Waves className="mr-2 h-4 w-4" />
                  FlutterWave SMS
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}