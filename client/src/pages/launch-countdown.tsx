import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FlutterAIInteractiveTutorial } from "@/components/flutterai-interactive-tutorial";
import {
  Calendar,
  Clock,
  Mail,
  CheckCircle,
  Shield,
  TrendingUp,
  Award,
  Users,
  Quote,
  Key,
  Unlock,
  Play,
  Sparkles,
  Palette,
  Brain,
  Zap,
  Coins,
  Wallet
} from "lucide-react";

export default function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [authorizedEmail, setAuthorizedEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [signupCount, setSignupCount] = useState(17853);
  const { toast } = useToast();

  // Set launch date to 30 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  useEffect(() => {
    const countupTimer = setInterval(() => {
      setSignupCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(countupTimer);
  }, []);

  const signupMutation = useMutation({
    mutationFn: async (data: { email: string; walletAddress?: string }) => {
      return await apiRequest("POST", "/api/signup", data);
    },
    onSuccess: () => {
      setSubmitted(true);
      setSignupCount(prev => prev + 1);
      toast({
        title: "Welcome to the VIP List!",
        description: "You'll be among the first to access Flutterbye. Check your email for confirmation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const checkAccessMutation = useMutation({
    mutationFn: async (data: { accessCode?: string; email?: string }) => {
      return await apiRequest("POST", "/api/check-access", data);
    },
    onSuccess: (data: any) => {
      if (data.hasAccess) {
        window.location.href = "/dashboard";
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid access code or email. Please check and try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Unable to verify access. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSignup = () => {
    signupMutation.mutate({ 
      email, 
      walletAddress: walletAddress || undefined 
    });
  };

  const handleAccessRequest = () => {
    checkAccessMutation.mutate({
      accessCode: accessCode || undefined,
      email: authorizedEmail || undefined
    });
  };

  return (
    <div className="min-h-screen electric-theme relative">
      <div className="container mx-auto p-8 pt-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-electric-blue/10 border border-electric-blue/20 rounded-full px-6 py-2 mb-6">
            <Calendar className="w-4 h-4 text-electric-blue" />
            <span className="text-sm font-medium text-electric-blue">Official Launch Coming Soon</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="text-gradient">Flutterbye</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Revolutionary crypto marketing platform combining AI wallet intelligence with precision messaging. 
            Target any crypto holder with 27-character message tokens.
          </p>

          {/* Countdown Timer */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            <div className="electric-frame p-6">
              <div className="text-3xl font-bold text-cyan-400">{timeLeft.days}</div>
              <div className="text-sm text-muted-foreground">Days</div>
            </div>
            <div className="electric-frame p-6">
              <div className="text-3xl font-bold text-blue-400">{timeLeft.hours}</div>
              <div className="text-sm text-muted-foreground">Hours</div>
            </div>
            <div className="electric-frame p-6">
              <div className="text-3xl font-bold text-purple-400">{timeLeft.minutes}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div className="electric-frame p-6">
              <div className="text-3xl font-bold text-green-400">{timeLeft.seconds}</div>
              <div className="text-sm text-muted-foreground">Seconds</div>
            </div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            
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
                  <div className="space-y-4">
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
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                              Joining...
                            </>
                          ) : (
                            <>
                              <Mail className="w-3 h-3 mr-2" />
                              Join VIP Waitlist
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Urgency Elements */}
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <h4 className="font-medium text-orange-400 text-sm">Limited Early Access</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Only <span className="text-orange-400 font-medium">2,153 spots</span> remaining for exclusive early access benefits.
                    </p>
                    <div className="w-full bg-muted/20 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-orange-400 to-red-400 h-1.5 rounded-full" style={{ width: '83.6%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">83.6% of early access spots claimed</p>
                  </div>
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
                      
                      <div className="bg-slate-800/50 rounded-lg p-2 border border-cyan/20">
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="w-3 h-3 text-cyan-400" />
                          <span className="font-medium text-cyan-400">FlutterWave</span>
                        </div>
                        <p className="text-muted-foreground text-xs">SMS integration</p>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-electric-blue to-purple text-white hover:opacity-90 text-sm py-2"
                      onClick={() => window.open('/dashboard', '_blank')}
                    >
                      <Play className="w-3 h-3 mr-2" />
                      Start Interactive Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* FlutterAI Tutorial */}
              <div>
                <FlutterAIInteractiveTutorial />
              </div>
            </div>

            {/* Right Column: What is Flutterbye */}
            <div>
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
        </div>

        {/* Two Column Section Below */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Early Access */}
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

            {/* Community Insights */}
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Community Insights
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
                          <span className="text-xs text-muted-foreground">• DeFi Researcher</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/10 border border-muted/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Quote className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          "The 27-character constraint forces creativity. It's like haiku for the blockchain age."
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
                          <span className="text-xs font-medium">Marcus Rodriguez</span>
                          <span className="text-xs text-muted-foreground">• Crypto Artist</span>
                        </div>
                      </div>
                    </div>
                  </div>
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