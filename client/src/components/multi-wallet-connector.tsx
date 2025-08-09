import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, Shield, Smartphone, Chrome, Globe, Star, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
  supported: boolean;
  mobile: boolean;
  desktop: boolean;
  browser: boolean;
  popularity: 'high' | 'medium' | 'low';
  security: 'excellent' | 'good' | 'basic';
}

const SUPPORTED_WALLETS: WalletOption[] = [
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '👻',
    description: 'Most popular Solana wallet with excellent DeFi support',
    features: ['NFT Storage', 'DeFi Integration', 'Hardware Wallet Support', 'Multi-Chain'],
    supported: true,
    mobile: true,
    desktop: true,
    browser: true,
    popularity: 'high',
    security: 'excellent'
  },
  {
    id: 'solflare',
    name: 'Solflare',
    icon: '🔥',
    description: 'Native Solana wallet with advanced staking features',
    features: ['Native Staking', 'Hardware Integration', 'Portfolio Tracking', 'DApp Browser'],
    supported: true,
    mobile: true,
    desktop: true,
    browser: true,
    popularity: 'high',
    security: 'excellent'
  },
  {
    id: 'backpack',
    name: 'Backpack',
    icon: '🎒',
    description: 'Social wallet with integrated messaging and trading',
    features: ['Social Features', 'Integrated Trading', 'Cross-Chain', 'Mobile First'],
    supported: true,
    mobile: true,
    desktop: false,
    browser: true,
    popularity: 'medium',
    security: 'good'
  },
  {
    id: 'glow',
    name: 'Glow',
    icon: '✨',
    description: 'Simple and secure wallet for everyday use',
    features: ['Simple UI', 'Fast Transactions', 'Low Fees', 'Beginner Friendly'],
    supported: true,
    mobile: true,
    desktop: false,
    browser: true,
    popularity: 'medium',
    security: 'good'
  },
  {
    id: 'slope',
    name: 'Slope',
    icon: '📱',
    description: 'Mobile-first wallet with excellent UX',
    features: ['Mobile Optimized', 'QR Code Support', 'Touch ID', 'Portfolio View'],
    supported: true,
    mobile: true,
    desktop: false,
    browser: false,
    popularity: 'medium',
    security: 'good'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🅰️',
    description: 'Trusted wallet from major exchange',
    features: ['Exchange Integration', 'Institutional Grade', 'Multi-Chain', 'Backup Recovery'],
    supported: true,
    mobile: true,
    desktop: true,
    browser: true,
    popularity: 'high',
    security: 'excellent'
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    icon: '🛡️',
    description: 'Multi-chain wallet with broad crypto support',
    features: ['Multi-Chain', 'DeFi Access', 'NFT Gallery', 'Staking Rewards'],
    supported: true,
    mobile: true,
    desktop: false,
    browser: false,
    popularity: 'high',
    security: 'excellent'
  },
  {
    id: 'exodus',
    name: 'Exodus',
    icon: '🚀',
    description: 'Beautiful desktop wallet with built-in exchange',
    features: ['Built-in Exchange', 'Portfolio Tracker', 'Beautiful UI', '24/7 Support'],
    supported: true,
    mobile: true,
    desktop: true,
    browser: false,
    popularity: 'medium',
    security: 'good'
  }
];

interface MultiWalletConnectorProps {
  onWalletConnect: (walletId: string, walletName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function MultiWalletConnector({ onWalletConnect, isOpen, onClose }: MultiWalletConnectorProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [installedWallets, setInstalledWallets] = useState<string[]>([]);
  const { toast } = useToast();

  // Check which wallets are installed
  useEffect(() => {
    const checkInstalledWallets = () => {
      const installed: string[] = [];
      
      // Check for Phantom
      if (typeof window !== 'undefined' && (window as any).phantom?.solana) {
        installed.push('phantom');
      }
      
      // Check for Solflare
      if (typeof window !== 'undefined' && (window as any).solflare) {
        installed.push('solflare');
      }
      
      // Check for Backpack
      if (typeof window !== 'undefined' && (window as any).backpack) {
        installed.push('backpack');
      }
      
      // Check for Glow
      if (typeof window !== 'undefined' && (window as any).glow) {
        installed.push('glow');
      }
      
      // Check for Coinbase
      if (typeof window !== 'undefined' && (window as any).coinbaseSolana) {
        installed.push('coinbase');
      }

      setInstalledWallets(installed);
    };

    checkInstalledWallets();
  }, []);

  const handleWalletConnect = async (wallet: WalletOption) => {
    if (!installedWallets.includes(wallet.id)) {
      toast({
        title: "Wallet Not Installed",
        description: `Please install ${wallet.name} to continue`,
        variant: "destructive",
      });
      return;
    }

    setConnecting(true);
    setSelectedWallet(wallet.id);

    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onWalletConnect(wallet.id, wallet.name);
      
      toast({
        title: "Wallet Connected!",
        description: `Successfully connected to ${wallet.name}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${wallet.name}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
      setSelectedWallet(null);
    }
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getSecurityColor = (security: string) => {
    switch (security) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      default: return 'text-yellow-400';
    }
  };

  const getWalletDownloadLink = (walletId: string) => {
    const links: Record<string, string> = {
      phantom: 'https://phantom.app/',
      solflare: 'https://solflare.com/',
      backpack: 'https://backpack.app/',
      glow: 'https://glow.app/',
      slope: 'https://slope.finance/',
      coinbase: 'https://wallet.coinbase.com/',
      trustwallet: 'https://trustwallet.com/',
      exodus: 'https://exodus.com/'
    };
    return links[walletId] || '#';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black border border-electric-blue/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neon-green flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription className="text-electric-blue/80">
            Choose from {SUPPORTED_WALLETS.length} supported Solana wallets. Each wallet offers unique features for different use cases.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {SUPPORTED_WALLETS.map((wallet) => {
            const isInstalled = installedWallets.includes(wallet.id);
            const isConnecting = connecting && selectedWallet === wallet.id;

            return (
              <Card 
                key={wallet.id}
                className={`bg-gray-900/50 border cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isInstalled 
                    ? 'border-neon-green/50 hover:border-neon-green' 
                    : 'border-electric-blue/30 hover:border-electric-blue/50'
                }`}
                onClick={() => !isConnecting && handleWalletConnect(wallet)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div>
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          {wallet.name}
                          {isInstalled && <CheckCircle className="h-4 w-4 text-neon-green" />}
                          {!isInstalled && <AlertCircle className="h-4 w-4 text-yellow-400" />}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getPopularityColor(wallet.popularity)}`}></div>
                          <span className="text-xs text-gray-400 capitalize">{wallet.popularity} popularity</span>
                          <Shield className={`h-3 w-3 ${getSecurityColor(wallet.security)}`} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {wallet.mobile && <Smartphone className="h-4 w-4 text-electric-blue" />}
                      {wallet.desktop && <Chrome className="h-4 w-4 text-electric-blue" />}
                      {wallet.browser && <Globe className="h-4 w-4 text-electric-blue" />}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-300 mb-3">
                    {wallet.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {wallet.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs bg-electric-blue/20 text-electric-blue">
                        {feature}
                      </Badge>
                    ))}
                    {wallet.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                        +{wallet.features.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {isInstalled ? (
                    <Button 
                      className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                          Connecting...
                        </div>
                      ) : (
                        'Connect Wallet'
                      )}
                    </Button>
                  ) : (
                    <a 
                      href={getWalletDownloadLink(wallet.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button 
                        variant="outline"
                        className="w-full border-electric-blue/50 text-electric-blue hover:bg-electric-blue/10"
                      >
                        Install {wallet.name}
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-900/30 rounded-lg border border-electric-blue/20">
          <h4 className="text-sm font-semibold text-neon-green mb-2">Security Notice</h4>
          <p className="text-xs text-gray-400">
            Always download wallets from official sources. FlutterBye supports hardware wallet integration 
            for maximum security when dealing with high-value transactions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MultiWalletConnector;