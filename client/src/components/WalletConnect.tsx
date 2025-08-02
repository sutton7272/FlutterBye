import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWalletAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const { login, walletAddress: connectedWallet, isAuthenticated } = useWalletAuth();
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!walletAddress.trim()) return;

    setIsConnecting(true);
    try {
      // Create a simple signature message for authentication
      const message = `Connect to Flutterbye Chat\nWallet: ${walletAddress}\nTime: ${Date.now()}`;
      const mockSignature = `mock_signature_${Date.now()}`; // In production, this would come from wallet adapter
      
      const success = await login(walletAddress, mockSignature, message);
      
      if (success) {
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Flutterbye Chat",
        });
        setShowDialog(false);
        setWalletAddress('');
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span className="text-sm text-green-400">
          {connectedWallet?.slice(0, 8)}...{connectedWallet?.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-600/20 border-blue-500 text-blue-300 hover:bg-blue-600/30">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-gray-300">
            Enter your Solana wallet address to connect to Flutterbye Chat
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="wallet" className="text-sm font-medium text-gray-300">
              Wallet Address
            </Label>
            <Input
              id="wallet"
              type="text"
              placeholder="Enter your Solana wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <Button
            onClick={handleConnect}
            disabled={!walletAddress.trim() || isConnecting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}