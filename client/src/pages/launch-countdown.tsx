import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  Clock, 
  Mail, 
  Wallet, 
  Sparkles, 
  Zap, 
  Coins, 
  Users, 
  CheckCircle,
  Gift,
  Star,
  Rocket,
  Key,
  Lock,
  Unlock,
  TrendingUp,
  Award,
  Shield,
  Quote,
  Play,
  Palette,
  Brain,
  Bot,
  ArrowRight,
  MessageSquare,
  Activity
} from "lucide-react";
import flutterbeyeLogoPath from "@assets/image_1754068877999.png";
import Navbar from "@/components/navbar";


import { FlutterAIInteractiveTutorial } from "@/components/flutterai-interactive-tutorial";
import { FlutterAIInteractiveDemo } from "@/components/flutterai-interactive-demo";
import { FlutterAIAnimatedTutorial } from "@/components/flutterai-animated-tutorial";
import { InteractiveTutorial } from "@/components/interactive-tutorial";
import { DevNetNavigation } from "@/components/devnet-navigation";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Set launch date to September 1, 2025 (outside component to prevent re-renders)
const LAUNCH_DATE = new Date('2025-09-01T00:00:00Z');

export default function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [authorizedEmail, setAuthorizedEmail] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [signupCount, setSignupCount] = useState(12847);

  // Set launch date to September 1, 2025 (moved outside component to prevent re-renders)

  // AI Content Showcase Component
  function AIContentShowcase() {
    const { data: latestContent, isLoading } = useQuery({
      queryKey: ['/api/ai/latest-content'],
      refetchInterval: 30000, // Refresh every 30 seconds
    });

    const { data: aiStats } = useQuery({
      queryKey: ['/api/ai/advanced-stats']
    });



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
      <div className="border-t border-electric-blue/30 py-12 mt-16">
        <div className="container mx-auto px-4">
          {/* Simple Header */}
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold mb-2 relative">
              <span className="bg-gradient-to-r from-electric-blue via-electric-green to-electric-blue bg-clip-text text-transparent drop-shadow-2xl animate-pulse filter">
                FLUTTERBLOG CONTENT
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-electric-green/20 to-electric-blue/20 blur-xl -z-10 animate-pulse"></div>
            </h2>
          </div>

          {/* Static Content Display - All Articles */}
          {latestContent && Array.isArray(latestContent) && latestContent.length > 0 ? (
            <div className="space-y-8 max-w-4xl mx-auto">
              {latestContent.slice(0, 3).map((content: any, index: number) => (
                <Card key={index} className="electric-frame bg-gradient-to-br from-cyan-500/20 to-blue-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse"></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0 shadow-lg">
                        {content.type || 'FlutterBlog'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{content.timestamp || 'Just now'}</span>
                    </div>
                    
                    <h2 className="font-bold text-2xl text-gradient mb-6 leading-tight">
                      {content.title || content.topic || 'FlutterBlog Content'}
                    </h2>
                    
                    <div className="text-muted-foreground leading-relaxed mb-6 text-base whitespace-pre-wrap">
                      {content.content || content.preview || 'Advanced AI-powered content generation showcasing FlutterBlog\'s revolutionary AI-powered SEO optimization with 60-70% cost reduction through intelligent batch processing and advanced content analytics.'}
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground border-t border-cyan-500/20 pt-4">
                      {content.wordCount && <span className="flex items-center gap-2"><span className="text-cyan-400">📊</span> {content.wordCount} words</span>}
                      {content.seoScore && <span className="flex items-center gap-2"><span className="text-green-400">🎯</span> SEO: {content.seoScore}%</span>}
                      {content.readabilityScore && <span className="flex items-center gap-2"><span className="text-blue-400">📖</span> Readability: {content.readabilityScore}%</span>}
                      <span className="text-electric-green font-semibold">✨ AI Optimized</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="electric-frame max-w-2xl mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse"></div>
              <CardContent className="p-8 text-center relative z-10">
                <Bot className="h-16 w-16 text-electric-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gradient mb-2">FlutterBlog System Online</h3>
                <p className="text-muted-foreground">
                  FlutterBlog Bot ready to generate SEO-optimized content with 60-70% cost reduction
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Check early access on component mount
  useEffect(() => {
    const storedAccess = localStorage.getItem("flutterbye_early_access");
    const isLaunchMode = localStorage.getItem("flutterbye_launch_mode") === "true";
    
    if (isLaunchMode || storedAccess === "granted") {
      setHasAccess(true);
    }
    setIsCheckingAccess(false);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = LAUNCH_DATE.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // Launch day has arrived!
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array is now safe

  // Dynamic signup counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly increment signup count every 15-45 seconds
      if (Math.random() > 0.7) {
        setSignupCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, Math.random() * 30000 + 15000);

    return () => clearInterval(interval);
  }, []);

  const signupMutation = useMutation({
    mutationFn: async () => {
      console.log("🚀 Starting API request:", { email, walletAddress });
      try {
        const result = await apiRequest("POST", "/api/launch/waitlist", { email, walletAddress });
        console.log("✅ API Response received:", result);
        const data = await result.json();
        console.log("✅ JSON parsed:", data);
        return data;
      } catch (error) {
        console.error("❌ API Error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("🎉 Mutation success:", data);
      setSubmitted(true);
      toast({
        title: "Welcome to the Revolution!",
        description: "You're on the VIP list for early access and FLBY airdrops."
      });
    },
    onError: (error) => {
      console.error("💥 Mutation error:", error);
      toast({
        title: "Error",
        description: `Failed to join waitlist: ${error.message || 'Please try again.'}`,
        variant: "destructive"
      });
    }
  });

  const checkAccessMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/admin/check-access", { 
        accessCode, 
        email: authorizedEmail 
      });
      return result.json();
    },
    onSuccess: (data: any) => {
      if (data.hasAccess) {
        localStorage.setItem("flutterbye_early_access", "granted");
        setHasAccess(true);
        toast({
          title: "Access Granted!",
          description: `Welcome to Flutterbye (${data.accessMethod} verification).`
        });
        // No redirect - stay on launch page
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid access code or email. Please contact support.",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Unable to verify access. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAccessRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode && !authorizedEmail) {
      toast({
        title: "Credentials Required",
        description: "Please enter your access code or email address.",
        variant: "destructive"
      });
      return;
    }
    checkAccessMutation.mutate();
  };

  const handleSignup = async () => {
    if (!email || email.trim() === "") {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    signupMutation.mutate();
  };

  // Loading state
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Flutterbye...</p>
        </div>
      </div>
    );
  }



  // Main Launch Countdown & Waitlist (for authorized users)
  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      
      {/* Show navbar if access is granted */}
      {hasAccess && (
        <>
          <Navbar />
        </>
      )}
      {/* Global cosmic background is handled by body CSS */}
      
      {/* Electric Circuit Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-pulse" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse delay-2000" />
        
        {/* Floating countdown elements */}
        <div className="absolute top-20 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
        <div className="absolute bottom-32 left-16 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40 delay-500"></div>
        <div className="absolute top-1/3 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-35 delay-1000"></div>
        <div className="absolute bottom-40 right-24 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-30 delay-1500"></div>
      </div>

      <div className={`container mx-auto px-4 relative z-10 ${hasAccess ? 'pt-24 pb-8' : 'py-8'}`}>
        
        {/* Main Flutterbye Title */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src={flutterbeyeLogoPath} alt="Flutterbye" className="w-16 h-16" />
            <h1 className="text-6xl font-bold text-gradient">
              Flutterbye
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Revolutionary blockchain communication platform transforming messages into valuable, tradeable digital assets
          </p>
          <div className="mt-8 flex items-center justify-center gap-6">
            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 px-4 py-2 text-sm">
              🚀 Quantum Pioneer Platform
            </Badge>
            <Badge className="bg-electric-green/20 text-electric-green border-electric-green/30 px-4 py-2 text-sm">
              🎯 $250M+ ARR Target
            </Badge>
            <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30 px-4 py-2 text-sm">
              🧠 FlutterAI Intelligence
            </Badge>
          </div>
        </div>
        
        {/* SECTION 1: SINGLE COLUMN - What is Flutterbye */}
        <Card className="electric-frame max-w-4xl mx-auto mb-12">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={flutterbeyeLogoPath} alt="Flutterbye" className="w-12 h-12" />
              <CardTitle className="text-4xl text-gradient">
                What is Flutterbye?
              </CardTitle>
            </div>
            <CardDescription className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Revolutionary blockchain messaging platform that transforms communication into valuable, tradeable tokens. 
              Create 27-character message tokens with attached value, distribute them across networks, and watch as your words become assets.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <MessageSquare className="w-12 h-12 text-electric-blue mx-auto" />
              <h3 className="font-bold text-xl text-gradient">Message Tokens</h3>
              <p className="text-sm text-muted-foreground">Transform words into blockchain assets with our unique 27-character message token system</p>
            </div>
            <div className="text-center space-y-3">
              <Coins className="w-12 h-12 text-electric-green mx-auto" />
              <h3 className="font-bold text-xl text-gradient">Value Attachment</h3>
              <p className="text-sm text-muted-foreground">Attach SOL, USDC, or FLBY value to messages with expiration dates and secure escrow</p>
            </div>
            <div className="text-center space-y-3">
              <TrendingUp className="w-12 h-12 text-purple-400 mx-auto" />
              <h3 className="font-bold text-xl text-gradient">Viral Distribution</h3>
              <p className="text-sm text-muted-foreground">AI-powered viral acceleration engine multiplies your message reach exponentially</p>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: SINGLE COLUMN - Platform Tutorial with FlutterAI */}
        <Card className="electric-frame max-w-4xl mx-auto mb-12">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl text-gradient flex items-center justify-center gap-3">
              <Play className="w-10 h-10" />
              Complete Platform Tutorial
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Master token creation, FlutterAI intelligence, and experience FlutterART & FlutterWave previews in one unified walkthrough
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 shrink-0">1</Badge>
                  <div>
                    <h4 className="font-bold mb-2">Token Creation Mastery</h4>
                    <p className="text-sm text-muted-foreground">60-second SPL token creation with FlutterAI wallet intelligence scoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Badge className="bg-electric-green/20 text-electric-green border-electric-green/30 shrink-0">2</Badge>
                  <div>
                    <h4 className="font-bold mb-2">AI-Powered Features</h4>
                    <p className="text-sm text-muted-foreground">Experience FlutterAI intelligence, volume pricing, and FLBY economics</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30 shrink-0">3</Badge>
                  <div>
                    <h4 className="font-bold mb-2">Coming Soon Preview</h4>
                    <p className="text-sm text-muted-foreground">FlutterART NFT creation and FlutterWave SMS integration demonstrations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Badge className="bg-orange-400/20 text-orange-400 border-orange-400/30 shrink-0">4</Badge>
                  <div>
                    <h4 className="font-bold mb-2">Marketing & Trading</h4>
                    <p className="text-sm text-muted-foreground">Viral growth engine, marketplace dynamics, and launch strategies</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-electric-blue/10 to-purple-500/10 rounded-xl p-6 electric-frame">
                <InteractiveTutorial />
              </div>
            </div>
          </CardContent>
        </Card>



        {/* SECTION 4: THREE COLUMNS - VIP Waitlist, Early Adopters, Early Access */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          
          {/* Column 1: VIP Waitlist */}
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle className="text-gradient text-xl flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan/20 to-blue/20">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                Join VIP Waitlist
                <Badge className="bg-cyan/20 text-cyan-400 text-xs ml-auto">Exclusive</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-400" />
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-green-400">You're In!</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Welcome to the exclusive VIP list for early access and FLBY airdrops.
                    </p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-400 mb-2 text-sm">VIP Benefits:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Priority platform access</li>
                      <li>• Exclusive FLBY airdrops</li>
                      <li>• VIP community access</li>
                      <li>• Beta testing privileges</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">🚀 Elite Early Access</h4>
                    <p className="text-xs text-muted-foreground">
                      Get exclusive access before public launch
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="email" className="text-sm">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="wallet" className="text-sm">Wallet Address (Optional)</Label>
                      <Input
                        id="wallet"
                        placeholder="Solana wallet address"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400"
                      />
                      <p className="text-xs text-muted-foreground mt-1">💰 For FLBY token airdrops</p>
                    </div>

                    <Button 
                      type="button" 
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold"
                      disabled={signupMutation.isPending || !email}
                      onClick={handleSignup}
                    >
                      {signupMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Joining...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Join VIP Waitlist
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Column 2: Join Thousands of Early Adopters */}
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle className="text-gradient text-xl flex items-center gap-2">
                <Users className="w-5 h-5 text-electric-green" />
                Join Thousands of Early Adopters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-cyan-400 transition-all duration-500">
                    {signupCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Early Access Signups</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-electric-green">156</div>
                  <div className="text-xs text-muted-foreground">Countries</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-electric-green/10 to-blue-500/10 rounded-lg p-4 electric-frame">
                <h4 className="font-bold text-electric-green mb-2">Community Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Global network of crypto innovators</li>
                  <li>• Exclusive community events & networking</li>
                  <li>• Early feedback on new features</li>
                  <li>• Premium support and onboarding</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Community Growth</span>
                  <span className="text-xs text-electric-green">+2.4% daily</span>
                </div>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">78% to next milestone</p>
              </div>

              <div className="text-center">
                <Button variant="outline" className="border-electric-green/50 text-electric-green hover:bg-electric-green/10">
                  <Users className="w-4 h-4 mr-2" />
                  View Community Stats
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Column 3: Early Access */}
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle className="text-gradient text-xl flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                Early Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-4">
                <h4 className="text-sm font-semibold text-white mb-2">🔐 Exclusive Access Portal</h4>
                <p className="text-xs text-muted-foreground">
                  Enter your access credentials
                </p>
              </div>

              <form onSubmit={handleAccessRequest} className="space-y-3">
                <div>
                  <Label htmlFor="accessCode" className="text-sm">Access Code</Label>
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder="Enter access code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                  />
                </div>

                <div>
                  <Label htmlFor="authorizedEmail" className="text-sm">Authorized Email</Label>
                  <Input
                    id="authorizedEmail"
                    type="email"
                    placeholder="authorized@email.com"
                    value={authorizedEmail}
                    onChange={(e) => setAuthorizedEmail(e.target.value)}
                    className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={checkAccessMutation.isPending}
                >
                  {checkAccessMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Request Access
                    </>
                  )}
                </Button>
              </form>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <h4 className="font-medium text-purple-400 mb-2 text-sm">Access Levels:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Developer Preview Access</li>
                  <li>• Beta Testing Privileges</li>
                  <li>• Advanced Feature Access</li>
                  <li>• Priority Support Channel</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* SECTION 5: SINGLE COLUMN - FlutterBlog */}
        <Card className="electric-frame max-w-4xl mx-auto mb-16">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl text-gradient flex items-center justify-center gap-3">
              <Bot className="w-10 h-10" />
              FlutterBlog
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-3xl mx-auto">
              AI-powered content generation with revolutionary SEO optimization and 60-70% cost reduction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIContentShowcase />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
