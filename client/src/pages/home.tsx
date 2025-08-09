import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, MessageSquare, Coins, Zap, TrendingUp, Users, Target, Sparkles, Heart, Building2, Mic, DollarSign, CreditCard, Palette, Bot, Shield, Star } from "lucide-react";
import flutterbeyeLogoPath from "@assets/image_1754068877999.png";
import cosmicBackgroundPath from "@assets/image_1754257352191.png";
import { QuickActionPanel } from "@/components/quick-action-panel";
import { InteractiveStatsDashboard } from "@/components/interactive-stats-dashboard";
import { EngagementBooster } from "@/components/engagement-booster";
import { NFTPortfolioQuickView } from "@/components/dashboard/NFTPortfolioQuickView";
import { ViralSharingAssistant } from "@/components/viral-sharing-assistant";
// import { TutorialLaunchButton } from "@/components/interactive-tutorial"; // Disabled to prevent interference with demo modal
import { VoiceMessageRecorder } from "@/components/voice-message-recorder";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingState } from "@/components/loading-state";
import { ViralGrowthAccelerator } from "@/components/viral-growth-accelerator";
import { MobileOnboardingWizard } from "@/components/mobile-onboarding-wizard";
import { usePerformance } from "@/hooks/use-performance";
import { FlutterAIDemoCards } from "@/components/flutterai-demo-cards";
import { SimpleTestModal } from "@/components/simple-test-modal";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface RecentActivity {
  id: string;
  type: 'sms' | 'mint' | 'redeem';
  message: string;
  user: string;
  amount?: number;
  timestamp: string;
}

export default function Home() {
  const performanceMetrics = usePerformance();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device and first-time user
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check if user is new (simplified check)
    const isFirstTime = !localStorage.getItem('flutterbye_visited');
    if (isFirstTime && window.innerWidth < 768) {
      setShowOnboarding(true);
      localStorage.setItem('flutterbye_visited', 'true');
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const marqueeText = [
    "TURN MESSAGES INTO MONEY",
    "27 CHARACTERS TO RICHES", 
    "SMS TO SOLANA BRIDGE",
    "FLUTTERBYE OR DIE TRYING",
    "TOKENIZE YOUR THOUGHTS",
    "FROM TEXT TO TREASURE",
    "MESSAGING MEETS MEMECONOMY", 
    "BUILD CULTS WITH CODE",
    "VIRAL VALUE DISTRIBUTION",
    "SMS DEGEN PARADISE",
    "EMOTIONAL TOKENS FOR REAL FEELS",
    "TEXT TO TOKEN IN SECONDS"
  ];

  // Mock recent activity for demo
  const recentActivity: RecentActivity[] = [
    { id: '1', type: 'sms', message: 'gm frens lets moon', user: '2hXj...M2u5', timestamp: '2m ago' },
    { id: '2', type: 'mint', message: 'hodl till we make it', user: '5LuH...2F6W', amount: 0.05, timestamp: '5m ago' },
    { id: '3', type: 'sms', message: 'wen lambo ser', user: 'GrQY...xTwa', timestamp: '8m ago' },
    { id: '4', type: 'redeem', message: 'love you mom', user: '58mt...CteS', amount: 0.1, timestamp: '12m ago' },
    { id: '5', type: 'sms', message: 'probably nothing', user: 'DEtj...rLTp', timestamp: '15m ago' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'mint': return <Coins className="h-4 w-4" />;
      case 'redeem': return <Zap className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sms': return 'from-blue-600 to-blue-400';
      case 'mint': return 'from-green-600 to-green-400';
      case 'redeem': return 'from-cyber-purple to-neon-pink';
      default: return 'from-blue-500 to-green-500';
    }
  };

  // AI Content Showcase Component
  function AIContentShowcase() {
    const { data: latestContent, isLoading } = useQuery({
      queryKey: ['/api/ai/latest-content'],
      refetchInterval: 30000, // Refresh every 30 seconds
    });

    const { data: aiStats } = useQuery({
      queryKey: ['/api/ai/advanced-stats']
    });

    const [selectedContent, setSelectedContent] = useState<any>(null);
    
    // Type guard for aiStats
    const typedAiStats = aiStats as { queueSize?: number } | undefined;
    
    // Type guard for latestContent
    const typedLatestContent = latestContent as Array<{
      id?: number;
      type?: string;
      title?: string;
      topic?: string;
      content?: string;
      preview?: string;
      timestamp?: string;
      wordCount?: number;
      seoScore?: number;
      readabilityScore?: number;
    }> | undefined;

    if (isLoading) {
      return (
        <div className="border-t border-electric-blue/30 bg-gradient-to-r from-gray-900/80 via-electric-blue/10 to-purple-900/80 py-16 mt-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-electric-blue border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-electric-blue">Loading AI-generated content...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="border-t border-electric-blue/30 bg-gradient-to-r from-gray-900/80 via-electric-blue/10 to-purple-900/80 py-16 mt-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-electric-blue via-electric-green to-electric-blue bg-clip-text text-transparent">
                AI CONTENT GENERATION
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-6">
              Witness the power of FlutterBlog Bot's revolutionary AI content generation system. 
              Real-time SEO-optimized content creation with 60-70% cost reduction.
            </p>
            
            {/* AI Stats */}
            {typedAiStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                <Card className="bg-electric-blue/20 border-electric-blue/30 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-electric-blue">{typedAiStats.queueSize || 0}</div>
                    <div className="text-xs text-gray-400">Queue Size</div>
                  </CardContent>
                </Card>
                <Card className="bg-electric-green/20 border-electric-green/30 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-electric-green">60-70%</div>
                    <div className="text-xs text-gray-400">Cost Reduction</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-500/20 border-purple-500/30 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">GPT-4o</div>
                    <div className="text-xs text-gray-400">AI Model</div>
                  </CardContent>
                </Card>
                <Card className="bg-pink-500/20 border-pink-500/30 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-pink-400">LIVE</div>
                    <div className="text-xs text-gray-400">System Status</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Content Generation Demo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Content Types */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-6 text-electric-blue">AI Content Types</h3>
              <div className="space-y-3">
                {[
                  { type: 'Blog Post', icon: '📝', description: 'SEO-optimized blog posts with metadata' },
                  { type: 'Content Series', icon: '📚', description: 'Multi-part coherent content series' },
                  { type: 'Optimization', icon: '⚡', description: 'Content improvement and enhancement' },
                  { type: 'Social Media', icon: '📱', description: 'Platform-specific social content' },
                ].map((item, index) => (
                  <Card 
                    key={index}
                    className="bg-gray-900/60 border-electric-blue/20 hover:border-electric-blue/40 transition-all cursor-pointer"
                    onClick={() => setSelectedContent(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-semibold text-white">{item.type}</div>
                          <div className="text-xs text-gray-400">{item.description}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Latest Generated Content Preview */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 text-electric-green">Latest AI-Generated Content</h3>
              
              {typedLatestContent && typedLatestContent.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {typedLatestContent.slice(0, 3).map((content, index: number) => (
                    <Card key={index} className="bg-gradient-to-r from-gray-900/80 to-electric-blue/10 border-electric-blue/20 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                            {content.type || 'AI Generated'}
                          </Badge>
                          <span className="text-xs text-gray-400">{content.timestamp || 'Just now'}</span>
                        </div>
                        
                        <h4 className="font-bold text-lg text-white mb-2 leading-tight">
                          {content.title || content.topic || 'AI-Generated Content'}
                        </h4>
                        
                        <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                          {content.content?.slice(0, 200) || content.preview || 'Advanced AI-powered content generation system creating SEO-optimized blog posts with comprehensive metadata analysis...'}
                          {((content.content && content.content.length > 200) || (content.preview && content.preview.length > 200)) && '...'}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                          {content.wordCount && <span>📊 {content.wordCount} words</span>}
                          {content.seoScore && <span>🎯 SEO: {content.seoScore}%</span>}
                          {content.readabilityScore && <span>📖 Readability: {content.readabilityScore}%</span>}
                          <span className="text-electric-green">✨ AI Optimized</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Bot className="h-12 w-12 text-electric-blue mx-auto mb-4" />
                    <h4 className="font-bold text-lg text-white mb-2">AI Content Generation Ready</h4>
                    <p className="text-gray-400 mb-4">
                      The FlutterBlog Bot AI system is operational and ready to generate 
                      SEO-optimized content with advanced cost optimization.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-electric-blue font-bold">15s</div>
                        <div className="text-gray-400">Avg Generation Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-electric-green font-bold">60-70%</div>
                        <div className="text-gray-400">Cost Reduction</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link href="/admin/flutterai">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80 text-black font-bold px-8 py-6 text-lg border-0"
              >
                EXPLORE AI DASHBOARD
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Performance metrics available in performanceMetrics object

  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen text-white pt-20 overflow-hidden bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `url(${cosmicBackgroundPath})`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
        <div className="relative z-10">
        
        {/* Top Scrolling Marquee */}
        <div className="border-y border-primary/30 py-6 mb-12 overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <div className="flex animate-marquee whitespace-nowrap text-3xl font-bold">
            {[...marqueeText, ...marqueeText].map((text, i) => (
              <span 
                key={i} 
                className="mx-12 flex-shrink-0 flutter-animate bg-gradient-to-r from-electric-blue via-electric-green to-electric-blue bg-clip-text text-transparent font-black drop-shadow-lg" 
                style={{
                  animationDelay: `${i * 0.2}s`,
                  textShadow: '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)'
                }}
              >
                {text}
              </span>
            ))}
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-8xl font-black mb-8 text-gradient relative z-10">
              FLUTTERBYE
            </h1>
            
            {/* Animated Electric Blue Butterfly Circling */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="butterfly-orbit">
                <div className="butterfly-container">
                  <svg 
                    className="butterfly-svg animate-pulse" 
                    width="45" 
                    height="35" 
                    viewBox="0 0 40 30" 
                    fill="none"
                  >
                    {/* Butterfly Wings */}
                    <path 
                      d="M20 15 C15 5, 5 5, 8 15 C5 25, 15 25, 20 15 Z" 
                      fill="url(#butterfly-gradient-left)"
                      className="animate-flutter-wing"
                    />
                    <path 
                      d="M20 15 C25 5, 35 5, 32 15 C35 25, 25 25, 20 15 Z" 
                      fill="url(#butterfly-gradient-right)"
                      className="animate-flutter-wing"
                      style={{ animationDelay: '0.1s' }}
                    />
                    {/* Butterfly Body */}
                    <line 
                      x1="20" 
                      y1="8" 
                      x2="20" 
                      y2="22" 
                      stroke="#0088FF" 
                      strokeWidth="4"
                      className="animate-pulse"
                      strokeOpacity="1"
                    />
                    {/* Antennae */}
                    <path 
                      d="M20 8 L18 5 M20 8 L22 5" 
                      stroke="#0066CC" 
                      strokeWidth="3"
                      fill="none"
                      strokeOpacity="1"
                    />
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="butterfly-gradient-left" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0088FF" stopOpacity="1"/>
                        <stop offset="100%" stopColor="#0066CC" stopOpacity="0.95"/>
                      </linearGradient>
                      <linearGradient id="butterfly-gradient-right" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0066CC" stopOpacity="1"/>
                        <stop offset="100%" stopColor="#0088FF" stopOpacity="0.95"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-2xl md:text-3xl text-primary mb-6 font-bold">
            Turn Messages Into Money
          </p>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Transform 27-character messages into SPL tokens. Build cults, distribute value, get rewarded even if you get rugged.
          </p>
          
          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center mb-16">
            <Link href="/mint">
              <Button size="lg" className="w-full text-lg px-8 py-6 modern-gradient text-white font-bold rounded-2xl circuit-glow h-24 flex flex-col items-center justify-center">
                <Coins className="mb-2 h-8 w-8" />
                <span>MINT TOKENS</span>
              </Button>
            </Link>
            
            <Link href="/payments">
              <Button size="lg" className="w-full text-lg px-8 py-6 bg-gradient-to-r from-electric-green to-electric-blue text-white font-bold rounded-2xl circuit-glow h-24 flex flex-col items-center justify-center">
                <CreditCard className="mb-2 h-8 w-8" />
                <span>GET CREDITS</span>
              </Button>
            </Link>
            
            <Link href="/sms-nexus">
              <Button size="lg" className="w-full text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl circuit-glow h-24 flex flex-col items-center justify-center">
                <Heart className="mb-2 h-8 w-8" />
                <span>FLUTTERWAVE</span>
              </Button>
            </Link>
            
            <Link href="/message-nfts">
              <Button size="lg" className="w-full text-lg px-8 py-6 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-2xl circuit-glow h-24 flex flex-col items-center justify-center">
                <Sparkles className="mb-2 h-8 w-8" />
                <span>FLUTTERART</span>
              </Button>
            </Link>
          </div>

          {/* Secondary Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Link href="/chat">
              <Button variant="outline" className="w-full text-sm py-4 pulse-border text-primary font-bold rounded-xl circuit-glow">
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat
              </Button>
            </Link>
            
            <Link href="/trending">
              <Button variant="outline" className="w-full text-sm py-4 pulse-border text-primary font-bold rounded-xl circuit-glow">
                <TrendingUp className="mr-2 h-5 w-5" />
                Trending
              </Button>
            </Link>
            
            <Link href="/redeem">
              <Button variant="outline" className="w-full text-sm py-4 pulse-border text-primary font-bold rounded-xl circuit-glow">
                <Target className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            
            <Link href="/sms">
              <Button variant="outline" className="w-full text-sm py-4 pulse-border text-primary font-bold rounded-xl circuit-glow">
                <Mic className="mr-2 h-5 w-5" />
                SMS Bridge
              </Button>
            </Link>
          </div>

          {/* Tutorial Access for All Users */}
          <div className="flex justify-center mb-16">
            {/* Tutorial button temporarily disabled to prevent demo interference */}
            <div className="text-center text-gray-500 text-sm">
              Interactive Tutorial temporarily disabled
            </div>
          </div>
        </div>

        {/* Platform Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            EXPLORE FLUTTERBYE ECOSYSTEM
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Hub */}
            <Link href="/ai-hub">
              <Card className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-purple-500/30 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-300 h-full cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <Bot className="h-12 w-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl mb-2">AI Hub</h3>
                  <p className="text-gray-400 text-sm">Chat with ARIA, enhance content with AI, and unlock intelligent features</p>
                  <Badge className="mt-4 bg-purple-500/20 text-purple-300">Revolutionary AI</Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Admin Portal */}
            <Link href="/admin-unified">
              <Card className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 border-blue-500/30 backdrop-blur-sm hover:border-blue-400/60 transition-all duration-300 h-full cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl mb-2">Admin Portal</h3>
                  <p className="text-gray-400 text-sm">Manage platform settings, analytics, and user administration</p>
                  <Badge className="mt-4 bg-blue-500/20 text-blue-300">Management</Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Voice Messages */}
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
              <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 pointer-events-none" />
              <Link href="/voice">
                <Card className="electric-frame w-full max-w-md mx-4 bg-gradient-to-br from-green-900/60 to-emerald-900/60 border-green-500/30 backdrop-blur-sm hover:border-green-400/60 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <Mic className="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-xl mb-2">Voice Messages</h3>
                    <p className="text-gray-400 text-sm">Record voice messages and turn them into valuable blockchain assets</p>
                    <Badge className="mt-4 bg-green-500/20 text-green-300">Audio NFTs</Badge>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Limited Edition */}
            <Link href="/limited-edition">
              <Card className="bg-gradient-to-br from-yellow-900/60 to-orange-900/60 border-yellow-500/30 backdrop-blur-sm hover:border-yellow-400/60 transition-all duration-300 h-full cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl mb-2">Limited Edition</h3>
                  <p className="text-gray-400 text-sm">Exclusive NFT collections and rare digital collectibles</p>
                  <Badge className="mt-4 bg-yellow-500/20 text-yellow-300">Exclusive</Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Market */}
            <Link href="/market">
              <Card className="bg-gradient-to-br from-red-900/60 to-pink-900/60 border-red-500/30 backdrop-blur-sm hover:border-red-400/60 transition-all duration-300 h-full cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-12 w-12 text-red-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl mb-2">Marketplace</h3>
                  <p className="text-gray-400 text-sm">Buy, sell, and trade FLBY tokens and digital assets</p>
                  <Badge className="mt-4 bg-red-500/20 text-red-300">Trading</Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Analytics */}
            <Link href="/analytics">
              <Card className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-indigo-500/30 backdrop-blur-sm hover:border-indigo-400/60 transition-all duration-300 h-full cursor-pointer group min-h-[240px]">
                <CardContent className="p-6 text-center flex flex-col justify-between h-full">
                  <div className="flex flex-col items-center flex-grow">
                    <TrendingUp className="h-12 w-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-xl mb-2">Analytics</h3>
                    <p className="text-gray-400 text-sm flex-grow">Track performance, viral metrics, and user engagement</p>
                  </div>
                  <Badge className="mt-4 bg-indigo-500/20 text-indigo-300">Insights</Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Viral Growth Accelerator - Mobile Priority */}
        <div className="mb-16">
          <ViralGrowthAccelerator />
        </div>

        {/* Interactive Stats Dashboard */}
        <div className="mb-16">
          <InteractiveStatsDashboard />
        </div>

        {/* NFT Portfolio Quick View */}
        <div className="mb-16">
          <NFTPortfolioQuickView />
        </div>

        {/* Quick Actions Panel */}
        <div className="mb-16">
          <QuickActionPanel />
        </div>

        {/* Engagement Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            {/* Activity Feed already here */}
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Daily Challenges
              </h3>
              <EngagementBooster />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Viral Assistant
              </h3>
              <ViralSharingAssistant />
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                LIVE ACTIVITY FEED
              </span>
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => (
                <Card key={activity.id} className="bg-gray-900/60 border-gray-700/50 backdrop-blur-sm animate-pulse-custom">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          "{activity.message}"
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{activity.user}</span>
                          {activity.amount && <span>• {activity.amount} SOL</span>}
                          <span>• {activity.timestamp}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                        {activity.type.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                WHY FLUTTERBYE?
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <MessageSquare className="h-8 w-8 text-purple-400" />
                    <div>
                      <h3 className="font-bold text-lg">SMS TO BLOCKCHAIN</h3>
                      <p className="text-gray-400 text-sm">Text +1 (844) BYE-TEXT to mint emotional tokens instantly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Zap className="h-8 w-8 text-green-400" />
                    <div>
                      <h3 className="font-bold text-lg">INSTANT REWARDS</h3>
                      <p className="text-gray-400 text-sm">Earn points, badges, and climb levels with every interaction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-blue-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="font-bold text-lg">VIRAL DISTRIBUTION</h3>
                      <p className="text-gray-400 text-sm">Time-locked, burn-to-read, reply-gated token mechanics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-pink-900/40 to-rose-900/40 border-pink-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Users className="h-8 w-8 text-pink-400" />
                    <div>
                      <h3 className="font-bold text-lg">COMMUNITY DRIVEN</h3>
                      <p className="text-gray-400 text-sm">Join thousands building the future of Web3 communication</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-electric-blue/40 to-electric-green/40 border-electric-blue/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Bot className="h-8 w-8 text-electric-blue" />
                    <div>
                      <h3 className="font-bold text-lg">AI POWERED</h3>
                      <p className="text-gray-400 text-sm">Advanced AI enhances every message and interaction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-purple-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Shield className="h-8 w-8 text-purple-400" />
                    <div>
                      <h3 className="font-bold text-lg">BUILD CULTS</h3>
                      <p className="text-gray-400 text-sm">Create communities around your tokenized messages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-900/40 to-amber-900/40 border-orange-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Mic className="h-8 w-8 text-orange-400" />
                    <div>
                      <h3 className="font-bold text-lg">VOICE MESSAGES</h3>
                      <p className="text-gray-400 text-sm">Attach voice notes and music to your emotional tokens</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 py-12 border-t border-purple-500/20">
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              READY TO FLUTTERBYE?
            </span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the memeconomy revolution. Turn your thoughts into tokens, your messages into money.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            <Link href="/greeting-cards">
              <Button size="lg" className="w-full text-lg px-6 py-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 border-0 font-bold">
                SEND CARDS
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/enterprise">
              <Button size="lg" className="w-full text-lg px-6 py-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 border-0 font-bold">
                ENTERPRISE
                <Building2 className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/journey">
              <Button size="lg" className="w-full text-lg px-6 py-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 font-bold">
                START JOURNEY
                <Target className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/admin/api-monetization">
              <Button size="lg" className="w-full text-lg px-6 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 font-bold">
                API MONETIZATION
                <DollarSign className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/flby/staking">
              <Button variant="outline" size="lg" className="w-full text-lg px-6 py-6 border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 font-bold">
                FLBY STAKING
                <Coins className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

        {/* FlutterAI Demo Cards */}
        <div className="border-t border-electric-blue/30 bg-gradient-to-r from-gray-900/80 via-electric-blue/10 to-purple-900/80 py-16 mt-16">
          <div className="container mx-auto px-4">
            <FlutterAIDemoCards />
          </div>
        </div>

        {/* AI-Generated Content Showcase */}
        <AIContentShowcase />

        {/* Bottom Scrolling Marquee */}
        <div className="border-t border-purple-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 py-4 mt-16 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap text-xl font-bold text-blue-300">
            {[...marqueeText.slice().reverse(), ...marqueeText.slice().reverse()].map((text, i) => (
              <span key={`bottom-${i}`} className="mx-8 flex-shrink-0">{text}</span>
            ))}
          </div>
        </div>
        </div>

        {/* Mobile Onboarding Wizard */}
        {showOnboarding && (
          <MobileOnboardingWizard
            onComplete={() => setShowOnboarding(false)}
          />
        )}
        
        {/* Test Modal Component */}
        <SimpleTestModal />
        
      </div>
    </ErrorBoundary>
  );
}