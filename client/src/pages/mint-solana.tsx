import { useState } from 'react';
import { useWallet } from '@/components/wallet-adapter';
import { WalletStatus } from '@/components/wallet-status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Coins, 
  Send, 
  Plus, 
  Trash2, 
  Sparkles, 
  TrendingUp,
  Users,
  Zap,
  DollarSign,
  Clock
} from 'lucide-react';

interface TokenCreationData {
  message: string;
  value: number;
  recipients: string[];
  walletAddress: string;
}

export default function MintSolanaPage() {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  
  const [message, setMessage] = useState('');
  const [value, setValue] = useState(0);
  const [recipients, setRecipients] = useState<string[]>(['']);
  const [recipientInput, setRecipientInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const createTokenMutation = useMutation({
    mutationFn: async (data: TokenCreationData) => {
      return apiRequest('/api/solana/create-token', 'POST', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Token Created Successfully!",
        description: `FLBY-MSG token "${message}" has been created on Solana DevNet`,
      });
      
      // Reset form
      setMessage('');
      setValue(0);
      setRecipients(['']);
      setRecipientInput('');
      setIsCreating(false);
    },
    onError: (error: any) => {
      toast({
        title: "Token Creation Failed",
        description: error.message || "Failed to create token. Please try again.",
        variant: "destructive",
      });
      setIsCreating(false);
    }
  });

  const addRecipient = () => {
    if (recipientInput.trim() && !recipients.includes(recipientInput.trim())) {
      setRecipients([...recipients.filter(r => r), recipientInput.trim()]);
      setRecipientInput('');
    }
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleCreateToken = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create tokens",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message for your token",
        variant: "destructive",
      });
      return;
    }

    if (message.length > 27) {
      toast({
        title: "Message Too Long",
        description: "Messages must be 27 characters or less",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    const validRecipients = recipients.filter(r => r.trim());
    
    createTokenMutation.mutate({
      message: message.trim(),
      value,
      recipients: validRecipients,
      walletAddress: publicKey.toBase58()
    });
  };

  const messageProgress = (message.length / 27) * 100;
  const isValidMessage = message.length > 0 && message.length <= 27;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
              <Coins className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mint FLBY-MSG Token
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transform your 27-character message into a unique SPL token on Solana DevNet. 
            Each token becomes a tradeable digital asset with programmable value.
          </p>
        </div>

        {/* Wallet Status */}
        <WalletStatus />

        {/* Main Creation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Token Creation Form */}
          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Create Your Token
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Message Input */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Token Message (Max 27 characters)
                </Label>
                <div className="space-y-2">
                  <Input
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message..."
                    maxLength={27}
                    className="bg-gray-800 border-gray-700 focus:border-purple-500"
                  />
                  <div className="flex justify-between items-center">
                    <Progress 
                      value={messageProgress} 
                      className="flex-1 h-2 mr-4"
                    />
                    <span className={`text-sm ${
                      isValidMessage ? 'text-green-400' : 
                      message.length > 27 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {message.length}/27
                    </span>
                  </div>
                </div>
              </div>

              {/* Value Input */}
              <div className="space-y-2">
                <Label htmlFor="value" className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Token Value (SOL)
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="0.001"
                  min="0"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  placeholder="0.001"
                  className="bg-gray-800 border-gray-700 focus:border-purple-500"
                />
                <p className="text-xs text-gray-500">
                  Optional: Add value that holders can redeem by burning the token
                </p>
              </div>

              {/* Recipients */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Distribution Recipients
                </Label>
                
                {/* Add Recipient */}
                <div className="flex gap-2">
                  <Input
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    placeholder="Wallet address..."
                    className="bg-gray-800 border-gray-700 focus:border-purple-500"
                  />
                  <Button
                    onClick={addRecipient}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Recipients List */}
                {recipients.filter(r => r).length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {recipients.filter(r => r).map((recipient, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                        <span className="text-sm font-mono truncate">
                          {recipient.slice(0, 8)}...{recipient.slice(-8)}
                        </span>
                        <Button
                          onClick={() => removeRecipient(index)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Create Button */}
              <Button
                onClick={handleCreateToken}
                disabled={!connected || !isValidMessage || isCreating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Token...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Create FLBY-MSG Token
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Token Preview & Info */}
          <div className="space-y-6">
            
            {/* Token Preview */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Token Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Name:</span>
                    <span className="font-mono">
                      {message ? `FLBY-${message.toUpperCase()}` : 'FLBY-[YOUR MESSAGE]'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Symbol:</span>
                    <span className="font-mono">FLBY-MSG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Supply:</span>
                    <span className="font-mono">
                      {recipients.filter(r => r).length + 1} tokens
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Value:</span>
                    <span className="font-mono">
                      {value > 0 ? `${value} SOL` : 'No value'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Network:</span>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      Solana DevNet
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-gray-900/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-lg">Token Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h4 className="font-medium">Instant Creation</h4>
                      <p className="text-sm text-gray-400">Deploy directly to Solana blockchain</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <div>
                      <h4 className="font-medium">Multi-Distribution</h4>
                      <p className="text-sm text-gray-400">Send to multiple wallets at once</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <div>
                      <h4 className="font-medium">Redeemable Value</h4>
                      <p className="text-sm text-gray-400">Burn tokens to claim SOL value</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="font-medium">Permanent Record</h4>
                      <p className="text-sm text-gray-400">Immutable blockchain storage</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}