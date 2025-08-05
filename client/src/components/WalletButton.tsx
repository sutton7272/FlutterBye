import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';

export const WalletButton: React.FC = () => {
  const { connected, publicKey, disconnect } = useWallet();

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-white/80">
          {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
        </div>
        <Button
          onClick={disconnect}
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
    <WalletMultiButton className="!bg-gradient-to-r !from-electric-blue !to-electric-green !text-black !font-semibold !px-6 !py-2 !rounded-lg !transition-all !duration-300 hover:!shadow-lg hover:!shadow-electric-blue/50 !border-0">
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </WalletMultiButton>
  );
};