import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WalletSelectionModal } from "@/components/wallet-selection-modal";
import { detectInstalledWallets } from "@/lib/wallet";

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: (args: any) => void) => void;
      off: (event: string, callback: (args: any) => void) => void;
      publicKey?: { toString: () => string };
      isConnected?: boolean;
    };
    solflare?: { isSolflare?: boolean };
    backpack?: any;
    coinbaseSolana?: any;
    exodus?: { solana?: any };
    trustwallet?: { solana?: any };
    glow?: any;
  }
}

export function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const { toast } = useToast();
  const installedWallets = detectInstalledWallets();

  useEffect(() => {
    // Check if wallet is already connected
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet && window.solana?.isConnected) {
      setWalletAddress(savedWallet);
    }

    // Listen for wallet events
    if (window.solana) {
      const handleConnect = () => {
        if (window.solana?.publicKey) {
          const address = window.solana.publicKey.toString();
          setWalletAddress(address);
          localStorage.setItem('walletAddress', address);
        }
      };

      const handleDisconnect = () => {
        setWalletAddress(null);
        localStorage.removeItem('walletAddress');
      };

      window.solana.on('connect', handleConnect);
      window.solana.on('disconnect', handleDisconnect);

      return () => {
        window.solana?.off('connect', handleConnect);
        window.solana?.off('disconnect', handleDisconnect);
      };
    }
  }, []);

  const connectWallet = async (walletName?: string) => {
    const walletToConnect = walletName || selectedWallet || 'Phantom';
    
    // For now, we'll primarily handle Phantom since it's most common
    if (!window.solana && walletToConnect === 'Phantom') {
      toast({
        title: "Phantom Wallet Not Found",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      let response;
      
      // Handle different wallet connections
      switch (walletToConnect) {
        case 'Phantom':
          if (window.solana?.isPhantom) {
            response = await window.solana.connect();
          }
          break;
        // Add other wallet connection logic here as needed
        default:
          if (window.solana) {
            response = await window.solana.connect();
          }
      }
      
      if (response?.publicKey) {
        const address = response.publicKey.toString();
        setWalletAddress(address);
        setSelectedWallet(walletToConnect);
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('selectedWallet', walletToConnect);
        
        toast({
          title: "Wallet Connected",
          description: `Connected ${walletToConnect} to ${address.slice(0, 4)}...${address.slice(-4)}`,
        });
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${walletToConnect}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.solana) {
        await window.solana.disconnect();
      }
      setWalletAddress(null);
      localStorage.removeItem('walletAddress');
      
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from wallet",
      });
    } catch (error) {
      console.error('Wallet disconnection error:', error);
    }
  };

  if (walletAddress) {
    return (
      <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
        <Check className="w-4 h-4 text-green-400" />
        <span className="text-sm font-medium text-white">
          {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
          className="h-auto p-1 text-green-400 hover:text-green-300"
        >
          <LogOut className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <WalletSelectionModal
      onWalletSelect={connectWallet}
      trigger={
        <Button
          disabled={isConnecting}
          className="bg-gradient-to-r from-electric-blue to-electric-green text-white border-0 hover:opacity-90"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnecting ? "Connecting..." : installedWallets.length > 0 ? "Connect Wallet" : "Select Wallet"}
        </Button>
      }
    />
  );
}