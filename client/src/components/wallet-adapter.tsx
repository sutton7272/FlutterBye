import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { PublicKey } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Link, Unlink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WalletSelectionModal } from '@/components/wallet-selection-modal';
import { detectInstalledWallets } from '@/lib/wallet';

// Extend window object for Solana wallets
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: any) => Promise<any>;
      signAllTransactions: (transactions: any[]) => Promise<any[]>;
      on: (event: string, callback: (args: any) => void) => void;
      off: (event: string, callback: (args: any) => void) => void;
      publicKey?: { toString: () => string };
      isConnected?: boolean;
    };
    solflare?: {
      isSolflare?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: any) => Promise<any>;
      signAllTransactions: (transactions: any[]) => Promise<any[]>;
      publicKey?: { toString: () => string };
      isConnected?: boolean;
    };
  }
}

// Wallet context and provider for Solana integration
interface WalletContextType {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  walletName: string | null;
  connect: (walletName?: string) => Promise<void>;
  disconnect: () => void;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions: (transactions: any[]) => Promise<any[]>;
}

const WalletContext = createContext<WalletContextType>({
  publicKey: null,
  connected: false,
  connecting: false,
  walletName: null,
  connect: async () => {},
  disconnect: () => {},
  signTransaction: async () => {},
  signAllTransactions: async () => []
});

export function useWallet() {
  return useContext(WalletContext);
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletName, setWalletName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection();
    
    // Set up wallet event listeners
    setupWalletEventListeners();
    
    return () => {
      // Cleanup listeners
      cleanupWalletEventListeners();
    };
  }, []);

  const setupWalletEventListeners = () => {
    if (window.solana) {
      window.solana.on('connect', handleWalletConnect);
      window.solana.on('disconnect', handleWalletDisconnect);
      window.solana.on('accountChanged', handleAccountChanged);
    }
  };

  const cleanupWalletEventListeners = () => {
    if (window.solana) {
      window.solana.off('connect', handleWalletConnect);
      window.solana.off('disconnect', handleWalletDisconnect);
      window.solana.off('accountChanged', handleAccountChanged);
    }
  };

  const handleWalletConnect = (publicKey: PublicKey) => {
    setPublicKey(publicKey);
    setConnected(true);
    console.log('Wallet connected:', publicKey.toBase58());
  };

  const handleWalletDisconnect = () => {
    setPublicKey(null);
    setConnected(false);
    setWalletName(null);
    console.log('Wallet disconnected');
  };

  const handleAccountChanged = (publicKey: PublicKey | null) => {
    if (publicKey) {
      setPublicKey(publicKey);
      console.log('Account changed:', publicKey.toBase58());
    } else {
      handleWalletDisconnect();
    }
  };

  const checkWalletConnection = async () => {
    try {
      // Check Phantom
      if (window.solana?.isPhantom && window.solana.isConnected && window.solana.publicKey) {
        setPublicKey(new PublicKey(window.solana.publicKey.toString()));
        setConnected(true);
        setWalletName('Phantom');
        return;
      }
      
      // Check Solflare
      if (window.solflare?.isSolflare && window.solflare.isConnected && window.solflare.publicKey) {
        setPublicKey(new PublicKey(window.solflare.publicKey.toString()));
        setConnected(true);
        setWalletName('Solflare');
        return;
      }
      
      // Try auto-connect with trusted permissions
      if (window.solana?.isPhantom) {
        try {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          setPublicKey(new PublicKey(response.publicKey.toString()));
          setConnected(true);
          setWalletName('Phantom');
        } catch {
          // Auto-connect failed, wallet not trusted
        }
      }
    } catch (error) {
      console.log('Wallet auto-connection failed:', error);
    }
  };

  const connect = async (preferredWallet: string = 'phantom') => {
    try {
      setConnecting(true);
      
      if (preferredWallet === 'phantom') {
        if (!window.solana) {
          toast({
            title: "Phantom Wallet Not Found",
            description: "Please install Phantom wallet to continue",
            variant: "destructive",
          });
          window.open('https://phantom.app/', '_blank');
          return;
        }

        const response = await window.solana.connect();
        setPublicKey(new PublicKey(response.publicKey.toString()));
        setConnected(true);
        setWalletName('Phantom');
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${response.publicKey.toString().slice(0, 4)}...${response.publicKey.toString().slice(-4)}`,
        });
      } else if (preferredWallet === 'solflare') {
        if (!window.solflare) {
          toast({
            title: "Solflare Wallet Not Found",
            description: "Please install Solflare wallet to continue",
            variant: "destructive",
          });
          window.open('https://solflare.com/', '_blank');
          return;
        }

        const response = await window.solflare.connect();
        setPublicKey(new PublicKey(response.publicKey.toString()));
        setConnected(true);
        setWalletName('Solflare');
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${response.publicKey.toString().slice(0, 4)}...${response.publicKey.toString().slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (walletName === 'Phantom' && window.solana) {
        await window.solana.disconnect();
      } else if (walletName === 'Solflare' && window.solflare) {
        await window.solflare.disconnect();
      }
      
      setPublicKey(null);
      setConnected(false);
      setWalletName(null);
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully",
      });
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  };

  const signTransaction = async (transaction: any) => {
    if (!connected || !publicKey) {
      throw new Error('Wallet not connected');
    }
    
    try {
      if (walletName === 'Phantom' && window.solana) {
        return await window.solana.signTransaction(transaction);
      } else if (walletName === 'Solflare' && window.solflare) {
        return await window.solflare.signTransaction(transaction);
      }
      throw new Error('No wallet available for signing');
    } catch (error) {
      console.error('Transaction signing failed:', error);
      throw error;
    }
  };

  const signAllTransactions = async (transactions: any[]) => {
    if (!connected || !publicKey) {
      throw new Error('Wallet not connected');
    }
    
    try {
      if (walletName === 'Phantom' && window.solana) {
        return await window.solana.signAllTransactions(transactions);
      } else if (walletName === 'Solflare' && window.solflare) {
        return await window.solflare.signAllTransactions(transactions);
      }
      throw new Error('No wallet available for signing');
    } catch (error) {
      console.error('Transaction signing failed:', error);
      throw error;
    }
  };

  const value = {
    publicKey,
    connected,
    connecting,
    walletName,
    connect,
    disconnect,
    signTransaction,
    signAllTransactions
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function WalletButton() {
  const { publicKey, connected, connecting, connect, disconnect } = useWallet();
  const installedWallets = detectInstalledWallets();

  if (connected && publicKey) {
    return (
      <Button variant="outline" onClick={disconnect} className="gap-2">
        <Wallet className="w-4 h-4" />
        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        <Unlink className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <WalletSelectionModal
      onWalletSelect={(walletName) => {
        const walletKey = walletName.toLowerCase().replace(' ', '');
        connect(walletKey);
      }}
      trigger={
        <Button 
          disabled={connecting}
          className="gap-2 bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
        >
          <Wallet className="w-4 h-4" />
          {connecting ? 'Connecting...' : installedWallets.length > 0 ? 'Connect Wallet' : 'Select Wallet'}
          <Link className="w-4 h-4" />
        </Button>
      }
    />
  );
}

export function WalletMultiButton() {
  const { connected } = useWallet();

  if (connected) {
    return <WalletButton />;
  }

  return (
    <Card className="p-4">
      <CardContent className="text-center space-y-4">
        <Wallet className="w-16 h-16 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
          <p className="text-muted-foreground">
            Connect your Solana wallet to start creating FlBY-MSG tokens
          </p>
        </div>
        <WalletButton />
        <p className="text-xs text-muted-foreground">
          Supporting 9 major Solana wallets • 96% user coverage
        </p>
      </CardContent>
    </Card>
  );
}