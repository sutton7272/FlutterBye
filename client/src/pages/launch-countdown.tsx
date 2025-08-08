import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  ArrowRight
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
      <div className="border-t border-electric-blue/30 bg-gradient-to-r from-gray-900/80 via-electric-blue/10 to-purple-900/80 py-12 mt-16">
        <div className="container mx-auto px-4">
          {/* Simple Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-electric-blue via-electric-green to-electric-blue bg-clip-text text-transparent">
                AI-Generated Content
              </span>
            </h2>
          </div>

          {/* Generated Content Display Only */}
          {latestContent && latestContent.length > 0 ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {latestContent.slice(0, 3).map((content: any, index: number) => (
                <Card key={index} className="bg-gradient-to-r from-gray-900/80 to-electric-blue/10 border-electric-blue/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                        {content.type || 'AI Generated'}
                      </Badge>
                      <span className="text-xs text-gray-400">{content.timestamp || 'Just now'}</span>
                    </div>
                    
                    <h4 className="font-bold text-lg text-white mb-3 leading-tight">
                      {content.title || content.topic || 'AI-Generated Content'}
                    </h4>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {content.content?.slice(0, 300) || content.preview || 'Advanced AI-powered content generation system creating SEO-optimized blog posts with comprehensive metadata analysis...'}
                      {(content.content?.length > 300 || content.preview?.length > 300) && '...'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
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
            <div className="text-center max-w-2xl mx-auto">
              <Bot className="h-16 w-16 text-electric-blue mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">AI Content System Online</h3>
              <p className="text-gray-400">
                FlutterBlog Bot ready to generate SEO-optimized content with 60-70% cost reduction
              </p>
            </div>
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
        {/* Countdown Timer - Top of Page */}
        <Card className="electric-frame max-w-4xl mx-auto mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-2xl text-gradient flex items-center justify-center gap-3">
              <Clock className="w-6 h-6" />
              Launch Countdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg p-3 electric-frame relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse"></div>
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-cyan-400 mb-1 font-mono tabular-nums">
                    {timeLeft.days.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold tracking-wider">DAYS</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-3 electric-frame relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent animate-pulse delay-300"></div>
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-blue-400 mb-1 font-mono tabular-nums">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold tracking-wider">HOURS</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-3 electric-frame relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent animate-pulse delay-700"></div>
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-purple-400 mb-1 font-mono tabular-nums">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold tracking-wider">MINUTES</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-lg p-3 electric-frame relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400/10 to-transparent animate-pulse delay-1000"></div>
                <div className="relative z-10">
                  <div className={`text-2xl font-bold mb-1 font-mono tabular-nums transition-colors duration-300 ${
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

        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            {/* Main FLUTTERBYE text */}
            <h1 className="text-8xl font-bold mb-3 relative z-10">
              <span className="bg-gradient-to-r from-cyan-300 via-green-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-2xl filter animate-pulse">
                FLUTTERBYE
              </span>
            </h1>
            
            {/* Flying Electric Butterflies */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Butterfly 1 - Top Left to Right */}
              <div className="absolute w-6 h-4 animate-butterfly-1">
                <svg className="w-full h-full text-cyan-400 drop-shadow-lg" viewBox="0 0 24 16" fill="currentColor">
                  <path d="M4 8c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z" opacity="0.8"/>
                  <path d="M12 8c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z" opacity="0.8"/>
                  <circle cx="12" cy="8" r="1" className="text-white"/>
                </svg>
                <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-sm animate-pulse"></div>
              </div>
              
              {/* Butterfly 2 - Top Right to Left */}
              <div className="absolute w-5 h-3 animate-butterfly-2">
                <svg className="w-full h-full text-blue-400 drop-shadow-lg" viewBox="0 0 20 12" fill="currentColor">
                  <path d="M3 6c0-1.5 1.5-3 3-3s3 1.5 3 6-1.5 3-3 3-3-1.5-3-3z" opacity="0.8"/>
                  <path d="M9 6c0-1.5 1.5-3 3-3s3 1.5 3 6-1.5 3-3 3-3-1.5-3-3z" opacity="0.8"/>
                  <circle cx="10" cy="6" r="0.8" className="text-white"/>
                </svg>
                <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-sm animate-pulse delay-500"></div>
              </div>
              
              {/* Butterfly 3 - Bottom Left Circular */}
              <div className="absolute w-4 h-3 animate-butterfly-3">
                <svg className="w-full h-full text-purple-400 drop-shadow-lg" viewBox="0 0 16 12" fill="currentColor">
                  <path d="M2 6c0-1.2 1.2-2.4 2.4-2.4s2.4 1.2 2.4 2.4-1.2 2.4-2.4 2.4S2 7.2 2 6z" opacity="0.8"/>
                  <path d="M7.2 6c0-1.2 1.2-2.4 2.4-2.4s2.4 1.2 2.4 2.4-1.2 2.4-2.4 2.4-2.4-1.2-2.4-2.4z" opacity="0.8"/>
                  <circle cx="8" cy="6" r="0.6" className="text-white"/>
                </svg>
                <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-sm animate-pulse delay-1000"></div>
              </div>
              
              {/* Butterfly 4 - Bottom Right Figure-8 */}
              <div className="absolute w-5 h-4 animate-butterfly-4">
                <svg className="w-full h-full text-green-400 drop-shadow-lg" viewBox="0 0 20 16" fill="currentColor">
                  <path d="M3 8c0-1.8 1.8-3.6 3.6-3.6s3.6 1.8 3.6 3.6-1.8 3.6-3.6 3.6S3 9.8 3 8z" opacity="0.8"/>
                  <path d="M10 8c0-1.8 1.8-3.6 3.6-3.6s3.6 1.8 3.6 3.6-1.8 3.6-3.6 3.6S10 9.8 10 8z" opacity="0.8"/>
                  <circle cx="10" cy="8" r="0.7" className="text-white"/>
                </svg>
                <div className="absolute inset-0 bg-green-400/30 rounded-full blur-sm animate-pulse delay-1500"></div>
              </div>

              {/* Additional Butterflies for More Magic */}
              {/* Butterfly 5 - Far Left Orbit */}
              <div className="absolute w-4 h-3 animate-butterfly-5">
                <svg className="w-full h-full text-cyan-500 drop-shadow-lg" viewBox="0 0 16 12" fill="currentColor">
                  <path d="M2 6c0-1.2 1.2-2.4 2.4-2.4s2.4 1.2 2.4 2.4-1.2 2.4-2.4 2.4S2 7.2 2 6z" opacity="0.9"/>
                  <path d="M7.2 6c0-1.2 1.2-2.4 2.4-2.4s2.4 1.2 2.4 2.4-1.2 2.4-2.4 2.4-2.4-1.2-2.4-2.4z" opacity="0.9"/>
                  <circle cx="8" cy="6" r="0.6" className="text-white"/>
                </svg>
                <div className="absolute inset-0 bg-cyan-500/40 rounded-full blur-sm animate-pulse delay-2000"></div>
              </div>

              {/* Butterfly 6 - Far Right Spiral */}
              <div className="absolute w-6 h-4 animate-butterfly-6">
                <svg className="w-full h-full text-emerald-400 drop-shadow-lg" viewBox="0 0 24 16" fill="currentColor">
                  <path d="M4 8c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z" opacity="0.9"/>
                  <path d="M12 8c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z" opacity="0.9"/>
                  <circle cx="12" cy="8" r="1" className="text-white"/>
                </svg>
                <div className="absolute inset-0 bg-emerald-400/40 rounded-full blur-sm animate-pulse delay-2500"></div>
              </div>

              {/* Butterfly 7 - Center Hover */}
              <div className="absolute w-3 h-2 animate-butterfly-7">
                <svg className="w-full h-full text-teal-400 drop-shadow-lg" viewBox="0 0 12 8" fill="currentColor">
                  <path d="M1 4c0-0.8 0.8-1.6 1.6-1.6s1.6 0.8 1.6 1.6-0.8 1.6-1.6 1.6S1 4.8 1 4z" opacity="0.9"/>
                  <path d="M5.8 4c0-0.8 0.8-1.6 1.6-1.6s1.6 0.8 1.6 1.6-0.8 1.6-1.6 1.6-1.6-0.8-1.6-1.6z" opacity="0.9"/>
                  <circle cx="6" cy="4" r="0.4" className="text-white"/>
                </svg>
                <div className="absolute inset-0 bg-teal-400/40 rounded-full blur-sm animate-pulse delay-3000"></div>
              </div>

              {/* Butterfly 8 - Outer Orbit */}
              <div className="absolute w-5 h-4 animate-butterfly-8">
                <svg className="w-full h-full text-lime-400 drop-shadow-lg" viewBox="0 0 20 16" fill="currentColor">
                  <path d="M3 8c0-1.8 1.8-3.6 3.6-3.6s3.6 1.8 3.6 3.6-1.8 3.6-3.6 3.6S3 9.8 3 8z" opacity="0.9"/>
                  <path d="M10 8c0-1.8 1.8-3.6 3.6-3.6s3.6 1.8 3.6 3.6-1.8 3.6-3.6 3.6S10 9.8 10 8z" opacity="0.9"/>
                  <circle cx="10" cy="8" r="0.7" className="text-white"/>
                </svg>
                <div className="absolute inset-0 bg-lime-400/40 rounded-full blur-sm animate-pulse delay-3500"></div>
              </div>
            </div>
          </div>
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

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8 items-stretch">
          {/* Left Column: FlutterAI Tutorial + Early Access */}
          <div className="space-y-4 flex flex-col">
            {/* FlutterAI Tutorial */}
            <div className="max-w-full">
              <FlutterAIInteractiveTutorial />
            </div>

            {/* Early Access */}
            <Card className="electric-frame flex-grow">
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

          {/* Middle Column: Platform Tutorial */}
          <div className="flex flex-col space-y-4">
            {/* Platform Tutorial */}
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

            {/* What is Flutterbye */}
            <Card className="electric-frame mt-4 flex-grow">
              <CardHeader>
                <CardTitle className="text-gradient text-lg">What is Flutterbye?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-yellow-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm">Tokenized Messaging</h4>
                      <p className="text-xs text-muted-foreground">
                        Turn your 27-character messages into valuable SPL tokens on Solana
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Coins className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm">Value Attachment</h4>
                      <p className="text-xs text-muted-foreground">
                        Attach real value to your messages - turn words into wealth
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm">Viral Distribution</h4>
                      <p className="text-xs text-muted-foreground">
                        Share tokens with specific wallets, create viral campaigns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wallet className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm">FLBY Token Economy</h4>
                      <p className="text-xs text-muted-foreground">
                        Stake, govern, and earn with our native FLBY token ecosystem
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/20 rounded-lg p-3 mt-4">
                  <h4 className="font-medium text-cyan-400 mb-2 text-sm">Revolutionary Features Coming:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
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

          {/* Right Column: VIP Waitlist */}
          <div className="flex flex-col space-y-4">
            <Card className="electric-frame relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-blue/5 to-purple/5 pointer-events-none"></div>
              <CardHeader className="pb-3 relative">
                <CardTitle className="text-gradient text-lg flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-cyan/20 to-blue/20">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  Join VIP Waitlist
                  <Badge className="bg-cyan/20 text-cyan-400 text-xs ml-auto">
                    Exclusive
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                {submitted ? (
                  <div className="text-center space-y-4">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-400" />
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-green-400">You're In!</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Welcome to the exclusive VIP list. You'll be among the first to access Flutterbye.
                      </p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <h4 className="font-medium text-green-400 mb-2 text-sm">What's Next?</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Early access invitation</li>
                        <li>• Exclusive FLBY airdrops</li>
                        <li>• VIP community access</li>
                        <li>• Beta testing privileges</li>
                      </ul>
                    </div>
                    
                    {/* Additional padding to match Platform Tutorial height */}
                    <div className="space-y-3 pt-4">
                      <div className="text-center">
                        <h4 className="text-sm font-semibold text-white mb-2">
                          🎯 VIP Access Benefits
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Exclusive early access to the revolutionary crypto marketing platform
                        </p>
                      </div>
                      
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                        <h5 className="text-xs font-semibold text-white mb-2">Your VIP Status:</h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Priority platform access</li>
                          <li>• Exclusive FLBY token rewards</li>
                          <li>• Beta testing participation</li>
                          <li>• VIP community membership</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="text-sm font-semibold text-white mb-2">
                        🚀 Join the Elite Early Access Program
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Get exclusive access to the "Google Ads of Crypto" platform before public launch
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
                          className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 text-sm"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="wallet" className="text-sm">Wallet Address (Optional)</Label>
                        <Input
                          id="wallet"
                          placeholder="Solana wallet address"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
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
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                      <h5 className="text-xs font-semibold text-white mb-2">VIP Exclusive Benefits:</h5>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• First access to crypto marketing tools</li>
                        <li>• Exclusive FLBY token airdrops</li>
                        <li>• Beta testing privileges & feedback priority</li>
                        <li>• VIP community access & networking</li>
                        <li>• Early revenue generation opportunities</li>
                      </ul>
                    </div>

                    {/* Stats to match Platform Tutorial */}
                    <div className="flex justify-center gap-4 text-xs text-muted-foreground pt-2 border-t border-slate-700">
                      <span>🎯 VIP access</span>
                      <span>💰 FLBY rewards</span>
                      <span>🚀 Early launch</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Join Thousands of Early Adopters */}
            <Card className="electric-frame flex-grow">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5" />
                  Join Thousands of Early Adopters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-cyan-400 transition-all duration-500">
                      {signupCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Early Access Signups</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-green-400">500+</div>
                    <div className="text-xs text-muted-foreground">Beta Testers</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-purple-400">98%</div>
                    <div className="text-xs text-muted-foreground">Satisfaction Rate</div>
                  </div>
                </div>

                {/* Testimonials - Condensed */}
                <div className="space-y-3">
                  <div className="bg-muted/10 border border-muted/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Quote className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          "Flutterbye revolutionizes messaging and value. Brilliant concept!"
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          <span className="text-xs font-medium">Sarah Chen</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/10 border border-muted/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Quote className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          "Multi-currency support and staking rewards are game-changing."
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"></div>
                          <span className="text-xs font-medium">Alex Rodriguez</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators - Compact */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-xs">Audited smart contracts by CertiK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-xs">Backed by leading Solana funds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span className="text-xs">Winner of Solana Global Hackathon 2024</span>
                  </div>
                </div>

                {/* Urgency Elements - Compact */}
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <h4 className="font-medium text-orange-400 text-sm">Limited Early Access</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Only <span className="text-orange-400 font-medium">2,153 spots</span> remaining for exclusive benefits.
                  </p>
                  <div className="w-full bg-muted/20 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-orange-400 to-red-400 h-1.5 rounded-full" style={{ width: '83.6%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">83.6% of spots claimed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Single Column Content Below Three Columns */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-8">

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

        {/* AI-Generated Content Showcase */}
        <AIContentShowcase />

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