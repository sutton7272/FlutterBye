import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  }
}

export function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

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

  const connectWallet = async () => {
    if (!window.solana) {
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      const response = await window.solana.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      localStorage.setItem('walletAddress', address);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 4)}...${address.slice(-4)}`,
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
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
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-gradient-to-r from-primary to-cyan text-white border-0"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}