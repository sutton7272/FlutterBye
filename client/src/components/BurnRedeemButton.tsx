import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Flame, Loader2 } from 'lucide-react';

interface BurnRedeemButtonProps {
  tokenId: string;
  mintAddress: string;
  attachedValue: number;
  currency: string;
  disabled?: boolean;
  onSuccess?: () => void;
}

export const BurnRedeemButton: React.FC<BurnRedeemButtonProps> = ({
  tokenId,
  mintAddress,
  attachedValue,
  currency,
  disabled = false,
  onSuccess
}) => {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBurnRedeem = async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Prepare burn transaction on backend
      toast({
        title: "Preparing Transaction",
        description: "Creating burn transaction...",
      });

      const prepareResponse = await apiRequest('POST', `/api/tokens/${tokenId}/prepare-burn`, {
        burnerWallet: publicKey.toBase58(),
        recipientWallet: publicKey.toBase58()
      });

      if (!prepareResponse.success) {
        throw new Error(prepareResponse.error || 'Failed to prepare transaction');
      }

      // Step 2: Deserialize and sign transaction
      toast({
        title: "Sign Transaction",
        description: "Please approve the transaction in your wallet",
      });

      const transaction = Transaction.from(
        Buffer.from(prepareResponse.transaction, 'base64')
      );

      const signedTransaction = await signTransaction(transaction);

      // Step 3: Send transaction to blockchain
      toast({
        title: "Processing",
        description: "Sending transaction to blockchain...",
      });

      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      // Step 4: Wait for confirmation
      toast({
        title: "Confirming",
        description: "Waiting for blockchain confirmation...",
      });

      await connection.confirmTransaction(signature);

      // Step 5: Confirm redemption on backend
      const confirmResponse = await apiRequest('POST', `/api/tokens/${tokenId}/confirm-burn`, {
        signature,
        burnerWallet: publicKey.toBase58(),
        recipientWallet: publicKey.toBase58()
      });

      if (!confirmResponse.success) {
        throw new Error(confirmResponse.error || 'Failed to confirm redemption');
      }

      // Success!
      toast({
        title: "Redemption Successful!",
        description: `You received ${attachedValue} ${currency}`,
      });

      onSuccess?.();

    } catch (error: any) {
      console.error('Burn redemption error:', error);
      
      toast({
        title: "Redemption Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!connected) {
    return (
      <Button variant="outline" disabled className="w-full">
        Connect Wallet to Redeem
      </Button>
    );
  }

  return (
    <Button
      onClick={handleBurnRedeem}
      disabled={disabled || isProcessing}
      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Flame className="w-4 h-4 mr-2" />
          Burn & Redeem {attachedValue} {currency}
        </>
      )}
    </Button>
  );
};