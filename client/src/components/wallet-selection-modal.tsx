import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Shield, Smartphone, Monitor, Zap } from "lucide-react";
import { WALLET_ADAPTERS, detectInstalledWallets, getWalletSupport } from "@/lib/wallet";

interface WalletSelectionModalProps {
  trigger?: React.ReactNode;
  onWalletSelect?: (walletName: string) => void;
}

export function WalletSelectionModal({ trigger, onWalletSelect }: WalletSelectionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const installedWallets = detectInstalledWallets();
  const walletSupport = getWalletSupport();

  const getWalletIcon = (walletName: string) => {
    switch (walletName) {
      case 'Ledger':
      case 'Trezor':
        return <Shield className="h-5 w-5" />;
      case 'Trust Wallet':
        return <Smartphone className="h-5 w-5" />;
      case 'Backpack':
        return <Zap className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getWalletDescription = (walletName: string) => {
    const descriptions = {
      'Phantom': '15+ million users • Most popular Solana wallet',
      'Solflare': 'Official Solana Labs wallet • 24/7 support',
      'Backpack': 'Web3/NFT focused • xNFT support',
      'Coinbase Wallet': 'Exchange integration • Beginner friendly',
      'Exodus': '30+ blockchains • 1000+ cryptocurrencies',
      'Ledger': 'Hardware security • Never been hacked',
      'Trezor': 'Pioneer hardware wallet • 2+ million users',
      'Trust Wallet': 'Binance-owned • Mobile first',
      'Glow': 'Solana-native features • Advanced users'
    };
    return descriptions[walletName as keyof typeof descriptions] || 'Secure Solana wallet';
  };

  const handleWalletClick = (wallet: typeof WALLET_ADAPTERS[0]) => {
    const isInstalled = installedWallets.includes(wallet.name);
    
    if (isInstalled) {
      onWalletSelect?.(wallet.name);
      setIsOpen(false);
    } else {
      // Open wallet installation page
      window.open(wallet.url, '_blank');
    }
  };

  const installedWalletsList = WALLET_ADAPTERS.filter(wallet => 
    installedWallets.includes(wallet.name)
  );
  
  const uninstalledWalletsList = WALLET_ADAPTERS.filter(wallet => 
    !installedWallets.includes(wallet.name)
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90">
            Connect Wallet
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Connect Your Wallet
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Supporting {WALLET_ADAPTERS.length} major Solana wallets • {walletSupport.coveragePercentage}% user coverage
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Installed Wallets */}
          {installedWalletsList.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-electric-blue">
                Ready to Connect ({installedWalletsList.length})
              </h3>
              <div className="grid gap-3">
                {installedWalletsList.map((wallet) => (
                  <div
                    key={wallet.name}
                    onClick={() => handleWalletClick(wallet)}
                    className="flex items-center p-4 border border-electric-blue/20 rounded-lg cursor-pointer hover:bg-electric-blue/5 hover:border-electric-blue/40 transition-all group"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue/20 to-electric-green/20 flex items-center justify-center">
                        {getWalletIcon(wallet.name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-white group-hover:text-electric-blue">
                            {wallet.name}
                          </h4>
                          <Badge variant="outline" className="text-electric-green border-electric-green">
                            Installed
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getWalletDescription(wallet.name)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-electric-blue">
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Wallets to Install */}
          {uninstalledWalletsList.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-electric-green">
                Available Wallets ({uninstalledWalletsList.length})
              </h3>
              <div className="grid gap-3">
                {uninstalledWalletsList.map((wallet) => (
                  <div
                    key={wallet.name}
                    onClick={() => handleWalletClick(wallet)}
                    className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/50 hover:border-electric-green/40 transition-all group"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                        {getWalletIcon(wallet.name)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white group-hover:text-electric-green">
                          {wallet.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {getWalletDescription(wallet.name)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-electric-green">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Install
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wallet Security Notice */}
          <div className="bg-electric-blue/10 border border-electric-blue/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-electric-blue mt-0.5" />
              <div>
                <h4 className="font-semibold text-electric-blue mb-1">Security Best Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Hardware wallets (Ledger, Trezor) offer maximum security</li>
                  <li>• Only download wallets from official websites</li>
                  <li>• Never share your seed phrase with anyone</li>
                  <li>• Use different wallets for trading vs long-term storage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Coverage Statistics */}
          <div className="bg-electric-green/10 border border-electric-green/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-electric-green">Wallet Ecosystem Coverage</h4>
                <p className="text-sm text-muted-foreground">
                  Supporting {WALLET_ADAPTERS.length} wallets covers 96% of Solana users
                </p>
              </div>
              <Badge variant="outline" className="text-electric-green border-electric-green text-lg px-3 py-1">
                96%
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}