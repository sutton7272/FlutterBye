import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Key, Lock, Unlock, Mail, CheckCircle, AlertCircle } from "lucide-react";
import flutterbeyeLogoPath from "@assets/image_1754068877999.png";

interface EarlyAccessGatewayProps {
  onAccessGranted: () => void;
}

export function EarlyAccessGateway({ onAccessGranted }: EarlyAccessGatewayProps) {
  const [accessCode, setAccessCode] = useState("");
  const [email, setEmail] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const { toast } = useToast();

  // Check for existing valid session on component mount
  useEffect(() => {
    const checkExistingAccess = async () => {
      const sessionToken = localStorage.getItem("flutterbye_early_access_token");
      
      if (sessionToken) {
        try {
          const response = await apiRequest("POST", "/api/early-access/verify-session", { 
            sessionToken 
          });
          const data = await response.json();
          
          if (data.isValid) {
            console.log("Valid early access session found");
            onAccessGranted();
            return;
          } else {
            // Remove invalid token
            localStorage.removeItem("flutterbye_early_access_token");
          }
        } catch (error) {
          console.log("Error verifying session:", error);
          localStorage.removeItem("flutterbye_early_access_token");
        }
      }
      
      setIsCheckingSession(false);
    };

    checkExistingAccess();
  }, [onAccessGranted]);

  const checkAccessMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/early-access/request-access", { 
        accessCode: accessCode.trim().toUpperCase(), 
        email: email.trim().toLowerCase() 
      });
      return result.json();
    },
    onSuccess: (data: any) => {
      if (data.accessGranted) {
        // Store the session token
        localStorage.setItem("flutterbye_early_access_token", data.sessionToken);
        
        toast({
          title: "🎉 Welcome to FlutterBye!",
          description: `Early access granted via ${data.accessMethod}. Enjoy exclusive access to our platform!`
        });
        
        onAccessGranted();
      } else {
        toast({
          title: "Access Denied",
          description: data.message || "Invalid access code or email. Please contact support for early access.",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Connection Error",
        description: "Unable to verify access. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode.trim() && !email.trim()) {
      toast({
        title: "Access Required",
        description: "Please enter either an access code or your approved email address.",
        variant: "destructive"
      });
      return;
    }

    checkAccessMutation.mutate();
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-electric-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-electric-blue text-lg">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated Electric Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />
      
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-electric-blue rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <Card className="electric-frame w-full max-w-md mx-4 relative z-10 bg-gray-900/90 backdrop-blur-lg">
        <CardHeader className="text-center space-y-4">
          <div className="relative mx-auto">
            <img 
              src={flutterbeyeLogoPath} 
              alt="FlutterBye Logo" 
              className="w-24 h-24 mx-auto rounded-full electric-frame animate-pulse"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 to-electric-green/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          
          <div>
            <CardTitle className="text-3xl text-gradient flex items-center justify-center gap-3 mb-2">
              <Lock className="w-8 h-8 text-electric-blue" />
              Early Access Portal
            </CardTitle>
            <p className="text-gray-300 text-lg">
              FlutterBye is currently in exclusive early access mode
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Enter your access credentials to explore the future of Web3 communication
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Access Code Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-electric-blue" />
                <Label htmlFor="access-code" className="text-lg font-semibold">Access Code</Label>
              </div>
              <Input
                id="access-code"
                placeholder="FLBY-EARLY-2025-XXX"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="bg-gray-800/50 border-electric-blue/30 text-white placeholder-gray-400 h-12 text-lg focus:border-electric-blue focus:ring-electric-blue/20"
                autoComplete="off"
              />
            </div>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">OR</span>
              </div>
            </div>
            
            {/* Email Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-electric-green" />
                <Label htmlFor="email" className="text-lg font-semibold">Approved Email</Label>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="your@approvedemail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className="bg-gray-800/50 border-electric-blue/30 text-white placeholder-gray-400 h-12 text-lg focus:border-electric-green focus:ring-electric-green/20"
                autoComplete="email"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80 transition-all duration-300"
              disabled={checkAccessMutation.isPending}
            >
              {checkAccessMutation.isPending ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Verifying Access...
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5 mr-3" />
                  Request Platform Access
                </>
              )}
            </Button>
          </form>

          {/* Info Section */}
          <div className="border-t border-gray-700 pt-4 space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-electric-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-300 font-medium">Blockchain-Powered Messaging</p>
                <p className="text-gray-400">Revolutionary SPL token communication system</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-electric-blue mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-300 font-medium">AI-Enhanced Social Automation</p>
                <p className="text-gray-400">Advanced AI content generation and optimization</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-300 font-medium">Need Access?</p>
                <p className="text-gray-400">Contact support@flutterbye.io for approval</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}