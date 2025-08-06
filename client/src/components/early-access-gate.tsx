import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Key, Lock, Unlock } from "lucide-react";
import flutterbeyeLogoPath from "@assets/image_1754068877999.png";

interface EarlyAccessGateProps {
  onAccessGranted: () => void;
}

export function EarlyAccessGate({ onAccessGranted }: EarlyAccessGateProps) {
  const [accessCode, setAccessCode] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const checkAccessMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/admin/check-access", { accessCode, email });
      return result.json();
    },
    onSuccess: (data: any) => {
      if (data.hasAccess) {
        localStorage.setItem("flutterbye_early_access", "granted");
        toast({
          title: "Access Granted!",
          description: `Welcome to Flutterbye early access (${data.accessMethod} verification).`
        });
        onAccessGranted();
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid access code or email. Please contact support for early access.",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode && !email) {
      toast({
        title: "Credentials Required",
        description: "Please enter your access code or email address.",
        variant: "destructive"
      });
      return;
    }
    checkAccessMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Electric Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 pointer-events-none" />
      
      <Card className="electric-frame w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <img 
            src={flutterbeyeLogoPath} 
            alt="Flutterbye Logo" 
            className="w-20 h-20 mx-auto mb-4 rounded-full electric-frame"
          />
          <CardTitle className="text-2xl text-gradient flex items-center justify-center gap-2">
            <Lock className="w-6 h-6" />
            Early Access Required
          </CardTitle>
          <p className="text-muted-foreground">
            Flutterbye is currently in early access mode. Enter your credentials to continue.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                placeholder="FLBY-EARLY-XXX"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="bg-muted/20"
              />
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              OR
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Authorized Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/20"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={checkAccessMutation.isPending}
            >
              {checkAccessMutation.isPending ? (
                "Verifying..."
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Request Access
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <h4 className="font-medium text-blue-400 mb-2">Need Access?</h4>
              <p className="text-sm text-muted-foreground">
                Join our waitlist for early access and FLBY token airdrops.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.location.href = '/launch'}
              >
                Join Waitlist
              </Button>
            </div>

            <div className="bg-muted/10 border border-muted/20 rounded-lg p-3">
              <h4 className="font-medium mb-2">Public Launch</h4>
              <p className="text-sm text-muted-foreground">
                Flutterbye will be publicly available in 30 days. Early access users get exclusive benefits and token rewards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}