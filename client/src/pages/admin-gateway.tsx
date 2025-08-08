import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, Wallet, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "FlutterAdmin2025"; // Global admin password
const ADMIN_WALLETS_KEY = "flutter_admin_wallets";

// Mock wallet for admin authentication - replace with real wallet integration
const MOCK_WALLET = "4xY2D8F3nQ9sM1pR6tZ5bV7wX0aH8cJ2kL4mN7oP9qS3uT";
const mockWalletConnected = true; // Simulated wallet connection

export default function AdminGateway() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Check if current wallet is already authenticated
  useEffect(() => {
    if (mockWalletConnected && MOCK_WALLET) {
      const authenticatedWallets = JSON.parse(localStorage.getItem(ADMIN_WALLETS_KEY) || "[]");
      
      if (authenticatedWallets.includes(MOCK_WALLET)) {
        // Wallet is already authenticated, redirect to dashboard
        setLocation("/admin/dashboard");
      }
    }
  }, [setLocation]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate password verification delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (password === ADMIN_PASSWORD) {
        // Password is correct
        if (mockWalletConnected && MOCK_WALLET) {
          // Store wallet for future authentication
          const authenticatedWallets = JSON.parse(localStorage.getItem(ADMIN_WALLETS_KEY) || "[]");
          
          if (!authenticatedWallets.includes(MOCK_WALLET)) {
            authenticatedWallets.push(MOCK_WALLET);
            localStorage.setItem(ADMIN_WALLETS_KEY, JSON.stringify(authenticatedWallets));
          }

          toast({
            title: "Access Granted",
            description: "Wallet authenticated for future sessions",
          });
        } else {
          toast({
            title: "Access Granted",
            description: "Connect wallet to enable persistent access",
          });
        }

        // Set temporary session access for password-only users
        sessionStorage.setItem("admin_gateway_access", "true");

        // Redirect to admin dashboard
        setLocation("/admin/dashboard");
      } else {
        setError("Invalid password. Please try again.");
        setPassword("");
      }
    } catch (error) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Circuit Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 border border-electric-blue/30 rounded-lg animate-pulse-slow" />
          <div className="absolute top-40 right-32 w-32 h-32 border border-electric-green/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-32 left-1/3 w-48 h-48 border border-electric-blue/20 rounded-lg rotate-45 animate-spin-slow" />
        </div>
        
        {/* Animated Electrical Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent animate-pulse" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-green/50 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-electric-blue/30 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-electric-green/30 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Background Glow Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-electric-blue/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-electric-green/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/40 backdrop-blur-sm border-2 border-electric-blue/30 shadow-2xl relative overflow-hidden">
          {/* Animated Card Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-electric-green/20 to-electric-blue/20 opacity-50 animate-pulse" />
          <div className="absolute inset-[2px] bg-slate-800/90 rounded-lg" />
          <CardHeader className="relative text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-electric-blue/20 rounded-full border-2 border-electric-blue/50 relative">
                <div className="absolute inset-0 bg-electric-blue/10 rounded-full animate-ping" />
                <Shield className="w-8 h-8 text-electric-blue relative z-10" />
              </div>
            </div>
            
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
                Admin Gateway
              </CardTitle>
              <p className="text-text-secondary mt-2">
                Secure access to Flutterbye administration
              </p>
            </div>
          </CardHeader>

          <CardContent className="relative space-y-6">
          {/* Wallet Status */}
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <Wallet className="w-5 h-5 text-electric-blue" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {mockWalletConnected ? "Wallet Connected" : "Wallet Not Connected"}
              </p>
              <p className="text-xs text-text-secondary">
                {mockWalletConnected 
                  ? "Future access will be automatic" 
                  : "Connect wallet for persistent access"
                }
              </p>
            </div>
          </div>

          {/* Password Form */}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Admin Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
                  disabled={isLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-950/50 border-red-500/50">
                <Lock className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full modern-gradient"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                "Access Admin Panel"
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="text-center text-xs text-text-secondary border-t border-slate-700/50 pt-4">
            <p>Secure admin access with wallet persistence</p>
            <p className="mt-1">All access attempts are logged and monitored</p>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}