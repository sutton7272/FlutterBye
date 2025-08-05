import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Download,
  Link as LinkIcon,
  ArrowRight,
  Coins
} from "lucide-react";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  mobile: boolean;
  installed?: boolean;
  recommended?: boolean;
}

interface WalletConnectionWizardProps {
  onConnect: (walletId: string) => void;
  onClose: () => void;
  isConnecting?: boolean;
}

export function WalletConnectionWizard({ onConnect, onClose, isConnecting = false }: WalletConnectionWizardProps) {
  const [step, setStep] = useState<"options" | "connecting" | "success">("options");
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [connectionProgress, setConnectionProgress] = useState(0);

  const walletOptions: WalletOption[] = [
    {
      id: "phantom",
      name: "Phantom",
      icon: "👻",
      description: "Most popular Solana wallet with mobile app",
      mobile: true,
      recommended: true,
      installed: typeof window !== "undefined" && "solana" in window
    },
    {
      id: "solflare",
      name: "Solflare",
      icon: "🔥",
      description: "Feature-rich wallet with web and mobile support",
      mobile: true,
      installed: typeof window !== "undefined" && "solflare" in window
    },
    {
      id: "backpack",
      name: "Backpack",
      icon: "🎒",
      description: "Modern wallet with advanced features",
      mobile: false,
      installed: typeof window !== "undefined" && "backpack" in window
    }
  ];

  const handleWalletSelect = async (walletId: string) => {
    const wallet = walletOptions.find(w => w.id === walletId);
    
    if (!wallet?.installed) {
      // Redirect to wallet installation
      window.open(getWalletDownloadUrl(walletId), '_blank');
      return;
    }

    setSelectedWallet(walletId);
    setStep("connecting");
    
    // Simulate connection progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setConnectionProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep("success");
          onConnect(walletId);
        }, 500);
      }
    }, 300);
  };

  const getWalletDownloadUrl = (walletId: string) => {
    const urls = {
      phantom: "https://phantom.app/download",
      solflare: "https://solflare.com/download",
      backpack: "https://backpack.app/download"
    };
    return urls[walletId as keyof typeof urls];
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (step === "connecting") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-electric-blue/10 flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-electric-blue animate-pulse" />
            </div>
            <CardTitle>Connecting Wallet</CardTitle>
            <CardDescription>
              Connecting to {walletOptions.find(w => w.id === selectedWallet)?.name}...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={connectionProgress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              {connectionProgress < 40 && "Detecting wallet..."}
              {connectionProgress >= 40 && connectionProgress < 70 && "Requesting permission..."}
              {connectionProgress >= 70 && connectionProgress < 100 && "Establishing connection..."}
              {connectionProgress >= 100 && "Connected successfully!"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-electric-green/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-electric-green" />
            </div>
            <CardTitle>Wallet Connected!</CardTitle>
            <CardDescription>
              Your {walletOptions.find(w => w.id === selectedWallet)?.name} wallet is now connected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onClose} className="w-full">
              Continue to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </CardTitle>
          <CardDescription>
            Choose a wallet to connect to Flutterbye. All transactions are secure and encrypted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Mobile Notice */}
          {isMobile && (
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                For the best mobile experience, we recommend using Phantom or Solflare mobile apps.
              </AlertDescription>
            </Alert>
          )}

          {/* Wallet Options */}
          <div className="space-y-3">
            {walletOptions.map((wallet) => (
              <Card 
                key={wallet.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  wallet.recommended ? "ring-2 ring-electric-blue/20" : ""
                }`}
                onClick={() => handleWalletSelect(wallet.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{wallet.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{wallet.name}</span>
                          {wallet.recommended && (
                            <Badge variant="default" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                          {wallet.mobile && isMobile && (
                            <Badge variant="outline" className="text-xs">
                              Mobile
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {wallet.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {wallet.installed ? (
                        <CheckCircle className="h-5 w-5 text-electric-green" />
                      ) : (
                        <Download className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your wallet connection is secure. Flutterbye never stores your private keys or seed phrases.
            </AlertDescription>
          </Alert>

          {/* Benefits */}
          <div className="space-y-2">
            <p className="text-sm font-medium">With a connected wallet you can:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Coins className="h-3 w-3" />
                Create valuable tokens
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Trade instantly
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="h-3 w-3" />
                Connect with others
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Secure transactions
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 text-muted-foreground"
              onClick={() => {
                // Continue without wallet (guest mode)
                onClose();
              }}
            >
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}