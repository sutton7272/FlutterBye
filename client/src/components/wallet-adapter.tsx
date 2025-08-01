import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { PublicKey } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Link, Unlink } from 'lucide-react';

// Wallet context and provider for Solana integration
interface WalletContextType {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  signTransaction: (transaction: any) => Promise<any>;
}

const WalletContext = createContext<WalletContextType>({
  publicKey: null,
  connected: false,
  connecting: false,
  connect: async () => {},
  disconnect: () => {},
  signTransaction: async () => {}
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

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const { solana } = window as any;
      if (solana?.isPhantom && solana.isConnected) {
        const response = await solana.connect({ onlyIfTrusted: true });
        setPublicKey(new PublicKey(response.publicKey.toString()));
        setConnected(true);
      }
    } catch (error) {
      console.log('Wallet not auto-connected:', error);
    }
  };

  const connect = async () => {
    try {
      setConnecting(true);
      const { solana } = window as any;
      
      if (!solana) {
        throw new Error('Phantom wallet not found! Please install Phantom wallet.');
      }

      const response = await solana.connect();
      setPublicKey(new PublicKey(response.publicKey.toString()));
      setConnected(true);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    const { solana } = window as any;
    if (solana) {
      solana.disconnect();
    }
    setPublicKey(null);
    setConnected(false);
  };

  const signTransaction = async (transaction: any) => {
    try {
      const { solana } = window as any;
      if (!solana) {
        throw new Error('Wallet not connected');
      }
      return await solana.signTransaction(transaction);
    } catch (error) {
      console.error('Transaction signing failed:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{
      publicKey,
      connected,
      connecting,
      connect,
      disconnect,
      signTransaction
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function WalletButton() {
  const { publicKey, connected, connecting, connect, disconnect } = useWallet();

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
    <Button 
      onClick={connect} 
      disabled={connecting}
      className="gap-2"
    >
      <Wallet className="w-4 h-4" />
      {connecting ? 'Connecting...' : 'Connect Wallet'}
      <Link className="w-4 h-4" />
    </Button>
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
          Supported wallets: Phantom, Solflare, Backpack
        </p>
      </CardContent>
    </Card>
  );
}