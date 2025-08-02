import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getWalletBalance, getFLBYBalance } from '@/lib/solana';

interface WalletConnectProps {
  className?: string;
}

export function WalletConnect({ className }: WalletConnectProps) {
  const { user, isAuthenticated, login, logout, walletAddress } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [flbyBalance, setFlbyBalance] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Load wallet balances when authenticated
  useEffect(() => {
    if (isAuthenticated && walletAddress) {
      loadBalances();
    }
  }, [isAuthenticated, walletAddress]);

  const loadBalances = async () => {
    if (!walletAddress) return;
    
    try {
      const [sol, flby] = await Promise.all([
        getWalletBalance(walletAddress),
        getFLBYBalance(walletAddress)
      ]);
      setSolBalance(sol);
      setFlbyBalance(flby);
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Check if Phantom wallet is available
      if (window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect();
        const walletAddress = response.publicKey.toString();
        
        // Create signature message for authentication
        const message = `Sign this message to authenticate with Flutterbye: ${Date.now()}`;
        const encodedMessage = new TextEncoder().encode(message);
        const signature = await window.solana.signMessage(encodedMessage);
        
        // Login with wallet credentials
        const success = await login(walletAddress, signature.signature, message);
        if (success) {
          console.log('Wallet connected successfully');
        }
      } else {
        // Fallback for development - simulate wallet connection
        const mockWallet = 'FlutterbyeDemoWallet' + Math.random().toString(36).substring(7);
        await login(mockWallet, 'mock-signature', 'mock-message');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    logout();
    setSolBalance(0);
    setFlbyBalance(0);
  };

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  if (isAuthenticated && user) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            Connected to Solana network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wallet Address */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-300">Address</div>
              <div className="font-mono text-sm">
                {walletAddress ? truncateAddress(walletAddress) : 'Unknown'}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Balances */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900 rounded-lg text-center">
              <div className="text-sm font-medium text-slate-300">SOL</div>
              <div className="text-lg font-bold text-blue-400">
                {solBalance.toFixed(4)}
              </div>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg text-center">
              <div className="text-sm font-medium text-slate-300">FLBY</div>
              <div className="text-lg font-bold text-green-400">
                {flbyBalance.toFixed(2)}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={user.isAdmin ? "default" : "secondary"}>
                {user.role}
              </Badge>
              {user.isAdmin && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  Admin
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnectWallet}
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Wallet className="h-6 w-6" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Connect your Solana wallet to access Flutterbye
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
        >
          {isConnecting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Connecting...
            </div>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Phantom Wallet
            </>
          )}
        </Button>
        
        <div className="mt-4 text-xs text-slate-400 text-center">
          Don't have a wallet?{' '}
          <a 
            href="https://phantom.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Download Phantom
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// Extend window object for Phantom wallet
declare global {
  interface Window {
    solana?: {
      isPhantom: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      signMessage: (message: Uint8Array) => Promise<{ signature: string }>;
    };
  }
}