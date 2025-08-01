import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wallet, CheckCircle } from "lucide-react";

export default function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      // In a real implementation, this would use @solana/wallet-adapter-react
      // For now, simulate wallet connection
      toast({
        title: "Wallet Connection",
        description: "Please approve the connection in your wallet",
      });

      // Simulate connection delay
      setTimeout(() => {
        setIsConnected(true);
        setWalletAddress("7Vg...3kN9"); // Truncated address
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Phantom wallet",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected",
    });
  };

  if (isConnected) {
    return (
      <Button
        variant="outline"
        onClick={disconnectWallet}
        className="cyber-glow"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        {walletAddress}
      </Button>
    );
  }

  return (
    <Button 
      onClick={connectWallet}
      className="bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary cyber-glow"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
