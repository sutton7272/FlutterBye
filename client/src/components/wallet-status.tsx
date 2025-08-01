import { useState, useEffect } from 'react';
import { useWallet } from '@/components/wallet-adapter';
import { solanaService } from '@/lib/solana';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function WalletStatus() {
  const { publicKey, connected, walletName } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [networkStatus, setNetworkStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      loadWalletData();
      loadNetworkStatus();
    }
  }, [connected, publicKey]);

  const loadWalletData = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const walletBalance = await solanaService.getWalletBalance(publicKey.toBase58());
      setBalance(walletBalance);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNetworkStatus = async () => {
    try {
      const response = await fetch('/api/solana/status');
      const status = await response.json();
      setNetworkStatus(status);
    } catch (error) {
      console.error('Error loading network status:', error);
    }
  };

  const formatBalance = (balance: number) => {
    return balance.toFixed(4);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!connected) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20">
        <CardContent className="p-6 text-center">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-gray-400 mb-4">
            Connect your Solana wallet to start creating tokenized messages
          </p>
          <Badge variant="outline" className="border-red-500/50 text-red-400">
            Not Connected
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-400" />
            Wallet Connected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadWalletData}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Wallet:</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                {walletName}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => navigator.clipboard.writeText(publicKey!.toBase58())}
              >
                {shortenAddress(publicKey!.toBase58())}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Balance:</span>
            <span className="font-mono">
              {balance !== null ? `${formatBalance(balance)} SOL` : (
                <div className="animate-pulse bg-gray-700 h-4 w-16 rounded"></div>
              )}
            </span>
          </div>
          
          {networkStatus && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Network:</span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`border-${networkStatus.connected ? 'green' : 'red'}-500/50 text-${networkStatus.connected ? 'green' : 'red'}-400`}
                >
                  {networkStatus.network}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => window.open(`https://explorer.solana.com/?cluster=${networkStatus.network}`, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {balance !== null && balance < 0.001 && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ Low SOL balance. You'll need SOL to pay for transaction fees.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 h-7 text-xs border-yellow-500/50"
              onClick={() => window.open('https://faucet.solana.com/', '_blank')}
            >
              Get DevNet SOL
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}