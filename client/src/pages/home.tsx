import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import ButterflyLogo from "@/components/butterfly-logo";
import { Coins, Send, RotateCcw, Zap, Heart, Rocket } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);

  const airdropSignup = useMutation({
    mutationFn: async (data: { email: string; walletAddress: string; preferences: string[] }) => {
      const response = await apiRequest("POST", "/api/airdrop/signup", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully joined airdrop list!",
        description: "You'll be notified when tokens are available",
      });
      setEmail("");
      setWalletAddress("");
      setPreferences([]);
    },
    onError: () => {
      toast({
        title: "Signup failed",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handlePreferenceChange = (preference: string, checked: boolean) => {
    if (checked) {
      setPreferences([...preferences, preference]);
    } else {
      setPreferences(preferences.filter(p => p !== preference));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    airdropSignup.mutate({ email, walletAddress, preferences });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <ButterflyLogo size="lg" animate />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
              Text. Share. Give.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Blockchain-powered messaging protocol that turns your 27-character messages into valuable SPL tokens on Solana.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/mint">
              <Button className="bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary px-8 py-4 text-lg cyber-glow">
                Start Minting FlBY-MSG Tokens
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="glassmorphism px-8 py-4 text-lg"
              onClick={() => document.getElementById('airdrop')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Join Airdrop List
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="glassmorphism">
              <CardContent className="p-6 text-center">
                <Coins className="text-3xl text-primary mb-4 mx-auto" />
                <h3 className="font-bold text-lg mb-2">Every Message is a Coin</h3>
                <p className="text-muted-foreground">27-character messages become unique SPL tokens with FlBY-MSG symbol</p>
              </CardContent>
            </Card>
            <Card className="glassmorphism">
              <CardContent className="p-6 text-center">
                <Send className="text-3xl text-primary mb-4 mx-auto" />
                <h3 className="font-bold text-lg mb-2">Targeted Distribution</h3>
                <p className="text-muted-foreground">Send tokens to specific wallets with optional SOL value attached</p>
              </CardContent>
            </Card>
            <Card className="glassmorphism">
              <CardContent className="p-6 text-center">
                <RotateCcw className="text-3xl text-primary mb-4 mx-auto" />
                <h3 className="font-bold text-lg mb-2">Refund-to-Credit</h3>
                <p className="text-muted-foreground">Unclaimed tokens return as credits for future minting</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Airdrop Signup Section */}
      <section id="airdrop" className="py-20 bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Join the Flutterbye Airdrop</h2>
            <p className="text-xl text-muted-foreground">Be among the first to receive FlBY-MSG tokens and exclusive rewards</p>
          </div>
          
          <Card className="glassmorphism">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="mt-2"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wallet">Solana Wallet Address</Label>
                    <Input 
                      id="wallet"
                      type="text" 
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      required 
                      className="mt-2"
                      placeholder="Your SOL wallet address"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Airdrop Preferences</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      "Protocol Updates",
                      "Exclusive Token Drops", 
                      "Partnership Announcements",
                      "Early Access Features"
                    ].map((preference) => (
                      <div key={preference} className="flex items-center space-x-2">
                        <Checkbox 
                          id={preference}
                          checked={preferences.includes(preference)}
                          onCheckedChange={(checked) => handlePreferenceChange(preference, checked as boolean)}
                        />
                        <Label htmlFor={preference}>{preference}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={airdropSignup.isPending}
                  className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary py-4 text-lg cyber-glow"
                >
                  {airdropSignup.isPending ? "Joining..." : "Join Airdrop List"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Partners & Collaborators</h2>
            <p className="text-xl text-muted-foreground">Building the future of tokenized communication together</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glassmorphism h-24 hover:scale-105 transition-transform">
                <CardContent className="p-6 flex items-center justify-center h-full">
                  <div className="w-16 h-8 bg-gradient-to-r from-muted to-muted-foreground rounded opacity-50" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">Interested in partnering with Flutterbye?</p>
            <Button className="bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary cyber-glow">
              Become a Partner
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <ButterflyLogo size="sm" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  FLUTTERBYE
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Revolutionizing Web3 communication through tokenized messaging on Solana.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Protocol</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Whitepaper</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bug Reports</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Feature Requests</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Flutterbye Protocol. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.37a9.6 9.6 0 0 1-2.83.8 5.04 5.04 0 0 0 2.17-2.8c-.95.58-2 1-3.13 1.22A4.86 4.86 0 0 0 16.61 2a4.99 4.99 0 0 0-4.79 6.2A13.87 13.87 0 0 1 1.67 2.92 5.12 5.12 0 0 0 3.2 9.67a4.82 4.82 0 0 1-2.23-.64v.07c0 2.44 1.7 4.48 3.95 4.95a4.84 4.84 0 0 1-2.22.08c.63 2.01 2.45 3.47 4.6 3.51A9.72 9.72 0 0 1 0 19.74 13.68 13.68 0 0 0 7.55 22c9.06 0 14-7.7 14-14.37v-.65c.96-.71 1.79-1.6 2.45-2.61z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
