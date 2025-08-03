import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, MessageSquare, Coins, Zap, TrendingUp, Users, Target, Sparkles, Heart, Building2, Mic } from "lucide-react";
import flutterbeyeLogoPath from "@assets/image_1754068877999.png";
import { QuickActionPanel } from "@/components/quick-action-panel";
import { InteractiveStatsDashboard } from "@/components/interactive-stats-dashboard";
import { EngagementBooster } from "@/components/engagement-booster";
import { ViralSharingAssistant } from "@/components/viral-sharing-assistant";
import { TutorialLaunchButton } from "@/components/interactive-tutorial";
import { VoiceMessageRecorder } from "@/components/voice-message-recorder";

interface RecentActivity {
  id: string;
  type: 'sms' | 'mint' | 'redeem';
  message: string;
  user: string;
  amount?: number;
  timestamp: string;
}

export default function Home() {
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

  return (
    <div className="min-h-screen text-white pt-20 overflow-hidden">
      
      {/* Top Scrolling Marquee */}
      <div className="border-y border-primary/30 modern-gradient py-6 mb-12 overflow-hidden electric-frame">
        <div className="flex animate-marquee whitespace-nowrap text-3xl font-bold text-white text-gradient">
          {[...marqueeText, ...marqueeText].map((text, i) => (
            <span key={i} className="mx-12 flex-shrink-0 flutter-animate" style={{animationDelay: `${i * 0.2}s`}}>
              {text}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-10">
            <div className="relative">
              <img 
                src={flutterbeyeLogoPath} 
                alt="Flutterbye Logo" 
                className="h-36 md:h-44 object-contain flutter-animate pulse-electric"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue to-electric-green opacity-20 rounded-full blur-3xl"></div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 text-gradient">
            FLUTTERBYE
          </h1>
          
          <p className="text-2xl md:text-3xl text-primary mb-6 font-bold">
            Turn Messages Into Money
          </p>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Transform 27-character messages into SPL tokens. Build cults, distribute value, get rewarded even if you get rugged.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Link href="/mint-solana">
              <Button size="lg" className="text-xl px-10 py-6 modern-gradient text-white font-bold rounded-2xl circuit-glow">
                <Coins className="mr-3 h-6 w-6" />
                MINT FLBY-MSG TOKEN
              </Button>
            </Link>
            
            <Link href="/limited-edition">
              <Button size="lg" className="text-xl px-10 py-6 modern-gradient text-white font-bold rounded-2xl circuit-glow">
                <Sparkles className="mr-3 h-6 w-6" />
                LIMITED EDITION
              </Button>
            </Link>
            
            <Link href="/sms">
              <Button variant="outline" size="lg" className="text-xl px-10 py-6 pulse-border text-primary font-bold rounded-2xl circuit-glow">
                <MessageSquare className="mr-3 h-6 w-6" />
                TEXT TO TOKENIZE
              </Button>
            </Link>
          </div>

          {/* Tutorial Access for All Users */}
          <div className="flex justify-center mb-16">
            <TutorialLaunchButton 
              className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl border-2 border-purple-400/30 shadow-lg shadow-purple-500/25" 
              variant="default"
            />
          </div>
        </div>

        {/* Interactive Stats Dashboard */}
        <div className="mb-16">
          <InteractiveStatsDashboard />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
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
            <Link href="/flby/staking">
              <Button variant="outline" size="lg" className="w-full text-lg px-6 py-6 border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 font-bold">
                FLBY STAKING
                <Coins className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Scrolling Marquee */}
      <div className="border-t border-purple-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 py-4 mt-16 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap text-xl font-bold text-blue-300">
          {[...marqueeText.slice().reverse(), ...marqueeText.slice().reverse()].map((text, i) => (
            <span key={`bottom-${i}`} className="mx-8 flex-shrink-0">{text}</span>
          ))}
        </div>
      </div>
    </div>
  );
}