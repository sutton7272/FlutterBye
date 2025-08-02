import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  Rocket
} from "lucide-react";
import flutterbeyeLogoPath from "@assets/image_1754068877999.png";

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
  const { toast } = useToast();

  // Set launch date to 30 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const signupMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/launch/waitlist", "POST", { email, walletAddress });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Welcome to the Revolution!",
        description: "You're on the VIP list for early access and FLBY airdrops."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    signupMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 pointer-events-none" />
      
      {/* Electric Circuit Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-pulse" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse delay-2000" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src={flutterbeyeLogoPath} 
            alt="Flutterbye Logo" 
            className="w-32 h-32 mx-auto mb-6 rounded-full electric-frame"
          />
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              FLUTTERBYE
            </span>
          </h1>
          <p className="text-2xl text-gray-300 mb-6">
            The Future of Communication is Coming
          </p>
          <div className="flex justify-center gap-2 mb-8">
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

        {/* Countdown Timer */}
        <Card className="electric-frame max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-gradient flex items-center justify-center gap-3">
              <Clock className="w-8 h-8" />
              Launch Countdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg p-6 electric-frame">
                <div className="text-4xl font-bold text-cyan-400 mb-2">{timeLeft.days}</div>
                <div className="text-sm text-muted-foreground">DAYS</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-6 electric-frame">
                <div className="text-4xl font-bold text-blue-400 mb-2">{timeLeft.hours}</div>
                <div className="text-sm text-muted-foreground">HOURS</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-6 electric-frame">
                <div className="text-4xl font-bold text-purple-400 mb-2">{timeLeft.minutes}</div>
                <div className="text-sm text-muted-foreground">MINUTES</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-lg p-6 electric-frame">
                <div className="text-4xl font-bold text-pink-400 mb-2">{timeLeft.seconds}</div>
                <div className="text-sm text-muted-foreground">SECONDS</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Waitlist Signup */}
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle className="text-gradient flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Join the VIP Waitlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <h3 className="text-xl font-bold mb-2 text-green-400">You're In!</h3>
                  <p className="text-muted-foreground mb-4">
                    Welcome to the exclusive VIP list. You'll be among the first to access Flutterbye and receive FLBY token airdrops.
                  </p>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-green-400 mb-2">What's Next?</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Early access invitation before public launch</li>
                      <li>• Exclusive FLBY token airdrop eligibility</li>
                      <li>• VIP community Discord access</li>
                      <li>• Beta testing privileges and feedback opportunities</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-muted/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wallet">Solana Wallet Address (Optional)</Label>
                    <Input
                      id="wallet"
                      placeholder="e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="bg-muted/20"
                    />
                    <p className="text-xs text-muted-foreground">
                      For FLBY token airdrops (can be added later)
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending ? (
                      "Joining..."
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Join VIP Waitlist
                      </>
                    )}
                  </Button>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <h4 className="font-medium text-blue-400 mb-2">VIP Benefits</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Early access before public launch</li>
                      <li>• Exclusive FLBY token airdrops</li>
                      <li>• Beta testing privileges</li>
                      <li>• VIP community access</li>
                    </ul>
                  </div>
                </form>
              )}
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

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground">
          <p className="mb-2">
            Built on Solana • Powered by Innovation • Driven by Community
          </p>
          <p className="text-sm">
            The future of communication starts here. Be part of the revolution.
          </p>
        </div>
      </div>
    </div>
  );
}