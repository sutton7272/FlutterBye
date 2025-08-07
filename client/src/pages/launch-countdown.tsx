import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
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
  Brain
} from "lucide-react";
import flutterbeyeLogoPath from "@assets/image_1754068877999.png";
import Navbar from "@/components/navbar";

import { TutorialLaunchButton } from "@/components/interactive-tutorial";
import { FlutterAIInteractiveTutorial } from "@/components/flutterai-interactive-tutorial";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

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

  // Set launch date to September 1, 2025
  const launchDate = new Date('2025-09-01T00:00:00Z'); // Public launch date

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
      const distance = launchDate.getTime() - now;

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
  }, []); // Remove launchDate dependency to prevent re-renders

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
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src={flutterbeyeLogoPath} 
            alt="Flutterbye Logo" 
            className="w-24 h-24 mx-auto mb-4 rounded-full electric-frame"
          />
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              FLUTTERBYE
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            The Future of Communication is Coming
          </p>
          <div className="flex justify-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Rocket className="w-3 h-3 mr-1" />
              Pre-Launch
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              <Gift className="w-3 h-3 mr-1" />
              Early Access
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Star className="w-3 h-3 mr-1" />
              Exclusive Airdrops
            </Badge>
          </div>
        </div>

        {/* Countdown Timer - Top of Page */}
        <Card className="electric-frame max-w-4xl mx-auto mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-2xl text-gradient flex items-center justify-center gap-3">
              <Clock className="w-6 h-6" />
              Launch Countdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg p-4 electric-frame relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse"></div>
                <div className="relative z-10">
                  <div className="text-3xl font-bold text-cyan-400 mb-1 font-mono tabular-nums">
                    {timeLeft.days.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold tracking-wider">DAYS</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-4 electric-frame relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent animate-pulse delay-300"></div>
                <div className="relative z-10">
                  <div className="text-3xl font-bold text-blue-400 mb-1 font-mono tabular-nums">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold tracking-wider">HOURS</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 electric-frame relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent animate-pulse delay-700"></div>
                <div className="relative z-10">
                  <div className="text-3xl font-bold text-purple-400 mb-1 font-mono tabular-nums">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold tracking-wider">MINUTES</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-lg p-4 electric-frame relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400/10 to-transparent animate-pulse delay-1000"></div>
                <div className="relative z-10">
                  <div className={`text-3xl font-bold mb-1 font-mono tabular-nums transition-colors duration-300 ${
                    timeLeft.seconds % 2 === 0 ? 'text-pink-400' : 'text-pink-300'
                  }`}>
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold tracking-wider">SECONDS</div>
                </div>
              </div>
            </div>

            {/* Launch Date Display */}
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Public Launch: <span className="text-cyan-400 font-semibold">
                  {launchDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    timeZone: 'UTC'
                  })}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
          {/* Left Column: VIP Signup */}
          <div>
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center gap-2 text-lg">
                  <Mail className="w-5 h-5" />
                  Join VIP Waitlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-6">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                    <h3 className="text-lg font-bold mb-2 text-green-400">You're In!</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Welcome to the exclusive VIP list. You'll be among the first to access Flutterbye.
                    </p>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <h4 className="font-medium text-green-400 mb-2 text-sm">What's Next?</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Early access invitation</li>
                        <li>• Exclusive FLBY airdrops</li>
                        <li>• VIP community access</li>
                        <li>• Beta testing privileges</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wallet" className="text-sm">Wallet Address (Optional)</Label>
                      <Input
                        id="wallet"
                        placeholder="Solana wallet address"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        💰 For FLBY token airdrops
                      </p>
                    </div>

                    <Button 
                      type="button" 
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 text-sm"
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

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <h4 className="font-medium text-blue-400 mb-2 text-sm">VIP Benefits</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Early access before launch</li>
                        <li>• Exclusive FLBY airdrops</li>
                        <li>• Beta testing privileges</li>
                        <li>• VIP community access</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle Column: Both Tutorials */}
          <div className="space-y-4">
            {/* Interactive Tutorial */}
            <Card className="electric-frame relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-purple/5 to-electric-green/5 pointer-events-none"></div>
              <CardHeader className="pb-3 relative">
                <CardTitle className="text-gradient text-lg flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-electric-blue/20 to-purple/20">
                    <Play className="w-4 h-4 text-electric-blue" />
                  </div>
                  Platform Tutorial
                  <Badge className="bg-electric-green/20 text-electric-green text-xs ml-auto">
                    3 min demo
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-sm font-semibold text-white mb-2">
                      🚀 Master the "Google Ads of Crypto" Platform
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Interactive walkthrough of revolutionary crypto marketing tools that enable precision targeting of any wallet holder
                    </p>
                  </div>

                  {/* Tutorial Features Preview */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-electric-blue/20">
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-electric-blue" />
                        <span className="font-medium text-electric-blue">FlutterbyeMSG</span>
                      </div>
                      <p className="text-muted-foreground text-xs">27-char message tokens</p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-purple/20">
                      <div className="flex items-center gap-1 mb-1">
                        <Palette className="w-3 h-3 text-purple-400" />
                        <span className="font-medium text-purple-400">FlutterArt</span>
                      </div>
                      <p className="text-muted-foreground text-xs">Advanced NFT creation</p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-electric-green/20">
                      <div className="flex items-center gap-1 mb-1">
                        <Brain className="w-3 h-3 text-electric-green" />
                        <span className="font-medium text-electric-green">FlutterAI</span>
                      </div>
                      <p className="text-muted-foreground text-xs">Wallet intelligence</p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-orange/20">
                      <div className="flex items-center gap-1 mb-1">
                        <Zap className="w-3 h-3 text-orange-400" />
                        <span className="font-medium text-orange-400">FlutterWave</span>
                      </div>
                      <p className="text-muted-foreground text-xs">SMS-to-blockchain</p>
                    </div>
                  </div>

                  {/* What You'll Learn */}
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                    <h5 className="text-xs font-semibold text-white mb-2">What You'll Learn:</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Create targeted crypto marketing campaigns</li>
                      <li>• Mint valuable NFTs with advanced features</li>
                      <li>• Analyze wallet behavior with AI intelligence</li>
                      <li>• Deploy SMS-to-blockchain emotional tokens</li>
                      <li>• Generate revenue with precision targeting</li>
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <TutorialLaunchButton 
                      className="bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80 text-white px-4 py-2 text-sm w-full flex items-center justify-center gap-2 shadow-lg" 
                      variant="default"
                    >
                      <Play className="w-4 h-4" />
                      Start Interactive Demo
                    </TutorialLaunchButton>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-center gap-4 text-xs text-muted-foreground pt-2 border-t border-slate-700">
                    <span>⚡ 3 min setup</span>
                    <span>🎯 4 products</span>
                    <span>💰 Revenue ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FlutterAI Tutorial */}
            <div className="max-w-full">
              <FlutterAIInteractiveTutorial />
            </div>
          </div>

          {/* Right Column: Early Access */}
          <div>
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center gap-2 text-lg">
                  <Key className="w-5 h-5" />
                  Early Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Have an early access code or authorized email? Get immediate access to the full platform features.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="accessCode" className="text-sm">Access Code</Label>
                      <Input
                        id="accessCode"
                        placeholder="FLBY-EARLY-XXX"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 text-sm"
                      />
                    </div>

                    <div className="text-center text-muted-foreground text-xs">OR</div>

                    <div>
                      <Label htmlFor="authorizedEmail" className="text-sm">Authorized Email</Label>
                      <Input
                        id="authorizedEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={authorizedEmail}
                        onChange={(e) => setAuthorizedEmail(e.target.value)}
                        className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 text-sm"
                      />
                    </div>

                    <Button 
                      onClick={handleAccessRequest}
                      disabled={(!accessCode && !authorizedEmail) || checkAccessMutation.isPending}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm py-2"
                    >
                      {checkAccessMutation.isPending ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3 mr-2" />
                          Get Early Access
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <h4 className="font-medium text-purple-400 mb-2 text-sm">Instant Access</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Full platform access now</li>
                      <li>• Skip the waitlist</li>
                      <li>• Premium features unlocked</li>
                      <li>• Direct platform entry</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Single Column Content Below Three Columns */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Social Proof Elements */}
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Join Thousands of Early Adopters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-cyan-400 transition-all duration-500">
                    {signupCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Early Access Signups</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-400">500+</div>
                  <div className="text-xs text-muted-foreground">Beta Testers</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-400">98%</div>
                  <div className="text-xs text-muted-foreground">Satisfaction Rate</div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="space-y-4">
                <div className="bg-muted/10 border border-muted/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        "Flutterbye revolutionizes how we think about messaging and value. The tokenized message concept is brilliant!"
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <span className="text-xs font-medium">Sarah Chen</span>
                        <span className="text-xs text-muted-foreground">Blockchain Developer</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/10 border border-muted/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        "Been using the beta for 2 weeks. The multi-currency support and staking rewards are game-changing."
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"></div>
                        <span className="text-xs font-medium">Alex Rodriguez</span>
                        <span className="text-xs text-muted-foreground">DeFi Investor</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/10 border border-muted/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        "Finally, a platform that combines messaging with real utility. The enterprise features are exactly what we needed."
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        <span className="text-xs font-medium">Michael Kim</span>
                        <span className="text-xs text-muted-foreground">Marketing Director</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Audited smart contracts by CertiK</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">Backed by leading Solana ecosystem funds</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">Winner of Solana Global Hackathon 2024</span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-400 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Recent Activity
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center animate-fade-in">
                    <span className="text-muted-foreground">🔥 crypto_whale_2024 joined</span>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">🚀 defi_builder signed up</span>
                    <span className="text-xs text-muted-foreground">5 min ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">💎 solana_dev joined waitlist</span>
                    <span className="text-xs text-muted-foreground">8 min ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">⚡ web3_investor signed up</span>
                    <span className="text-xs text-muted-foreground">12 min ago</span>
                  </div>
                </div>
              </div>

              {/* Urgency Elements */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                  <h4 className="font-medium text-orange-400">Limited Early Access</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Only <span className="text-orange-400 font-medium">2,153 spots</span> remaining for exclusive early access benefits and FLBY token airdrops.
                </p>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full" style={{ width: '83.6%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">83.6% of early access spots claimed</p>
              </div>
            </CardContent>
          </Card>

          {/* What is Flutterbye */}
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle className="text-gradient">What is Flutterbye?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className="font-medium">Tokenized Messaging</h4>
                    <p className="text-sm text-muted-foreground">
                      Turn your 27-character messages into valuable SPL tokens on Solana
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Coins className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-medium">Value Attachment</h4>
                    <p className="text-sm text-muted-foreground">
                      Attach real value to your messages - turn words into wealth
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <h4 className="font-medium">Viral Distribution</h4>
                    <p className="text-sm text-muted-foreground">
                      Share tokens with specific wallets, create viral campaigns
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wallet className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <h4 className="font-medium">FLBY Token Economy</h4>
                    <p className="text-sm text-muted-foreground">
                      Stake, govern, and earn with our native FLBY token ecosystem
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/20 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-cyan-400 mb-2">Revolutionary Features Coming:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• SMS-to-blockchain integration</li>
                  <li>• AI-powered emotion analysis</li>
                  <li>• Enterprise marketing campaigns</li>
                  <li>• Greeting cards with scheduled delivery</li>
                  <li>• Real-time chat with tokenized rewards</li>
                  <li>• Comprehensive staking and governance</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-muted/20 rounded-full h-2 overflow-hidden electric-frame">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-1000 ease-out"
              style={{
                width: `${Math.max(0, Math.min(100, 
                  100 - ((launchDate.getTime() - new Date().getTime()) / (30 * 24 * 60 * 60 * 1000)) * 100
                ))}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Pre-Launch Started</span>
            <span>Launch Day</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground">
          <p className="mb-2">
            Built on Solana • Powered by Innovation • Driven by Community
          </p>
          <p className="text-sm">
            The future of communication starts here. Be part of the revolution.
          </p>
          <div className="mt-4 text-xs opacity-60">
            Countdown updates every second • Launch time: UTC
          </div>
        </div>
      </div>
    </div>
  );
}