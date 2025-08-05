import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, LogOut } from 'lucide-react';

interface SimpleWalletConnectProps {
  onWalletConnect?: (publicKey: string) => void;
  onWalletDisconnect?: () => void;
}

export const SimpleWalletConnect: React.FC<SimpleWalletConnectProps> = ({
  onWalletConnect,
  onWalletDisconnect
}) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string>('');
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      // Check if Phantom wallet is available
      if (typeof window !== 'undefined' && (window as any).solana) {
        const solana = (window as any).solana;
        
        if (solana.isPhantom) {
          const response = await solana.connect();
          const pubKey = response.publicKey.toString();
          
          setConnected(true);
          setPublicKey(pubKey);
          onWalletConnect?.(pubKey);
          
          toast({
            title: "Wallet Connected",
            description: `Connected to ${pubKey.slice(0, 4)}...${pubKey.slice(-4)}`,
          });
        }
      } else {
        toast({
          title: "Wallet Not Found",
          description: "Please install Phantom wallet to continue",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setPublicKey('');
    onWalletDisconnect?.();
    
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected",
    });
  };

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-white/80">
          {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
        </div>
        <Button
          onClick={disconnectWallet}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      className="bg-gradient-to-r from-electric-blue to-electric-green text-black font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-electric-blue/50"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  );
};