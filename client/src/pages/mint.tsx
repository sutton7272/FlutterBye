import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Coins, Send, Timer, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createTokenizedMessage, distributeTokens, type TokenMessageData, type CreatedToken } from '@/lib/solana-real';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';

export default function Mint() {
  const { isAuthenticated, walletAddress } = useAuth();
  const { toast } = useToast();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);
  const [createdToken, setCreatedToken] = useState<CreatedToken | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    value: 0,
    currency: 'SOL' as 'SOL' | 'USDC' | 'FLBY',
    expirationDate: '',
    isLimitedEdition: false,
    maxSupply: 1,
    recipients: ''
  });

  const handleCreateToken = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to create tokenized messages. You can browse without connecting.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for your message",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const messageData: TokenMessageData = {
        title: formData.title,
        content: formData.content,
        value: formData.value,
        currency: formData.currency,
        expirationDate: formData.expirationDate || undefined,
        isLimitedEdition: formData.isLimitedEdition,
        maxSupply: formData.isLimitedEdition ? formData.maxSupply : undefined
      };

      // Real blockchain token creation
      let createdTokenResult: CreatedToken;
      
      if (window.solana && window.solana.isPhantom) {
        // Real Phantom wallet integration
        const walletPublicKey = new PublicKey(walletAddress!);
        const signTransaction = async (transaction: Transaction) => {
          return await window.solana.signTransaction(transaction);
        };
        
        toast({
          title: "Creating Token",
          description: "Please approve the transaction in your wallet...",
        });
        
        createdTokenResult = await createTokenizedMessage(
          walletPublicKey,
          signTransaction,
          messageData
        );
        
        toast({
          title: "Token Created on Blockchain!",
          description: `Successfully minted SPL token: ${formData.title}`,
        });
        
      } else {
        // Fallback for development
        createdTokenResult = {
          mintAddress: 'DevToken' + Math.random().toString(36).substring(2, 15),
          tokenAccount: 'DevAcc' + Math.random().toString(36).substring(2, 15),
          signature: 'DevSig' + Math.random().toString(36).substring(2, 15),
          metadata: {
            name: `FLBY-MSG: ${messageData.title.substring(0, 27)}`,
            symbol: 'FLBY-MSG',
            description: messageData.content,
            image: 'https://flutterbye.io/default-message-token.png'
          }
        };
        
        toast({
          title: "Development Token Created",
          description: "Real blockchain integration available with Phantom wallet",
        });
      }

      setCreatedToken(createdTokenResult);

      // Store in backend
      const response = await fetch('/api/tokens/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': walletAddress!
        },
        body: JSON.stringify({
          ...messageData,
          mintAddress: createdTokenResult.mintAddress,
          tokenAccount: createdTokenResult.tokenAccount,
          signature: createdTokenResult.signature,
          metadata: createdTokenResult.metadata
        })
      });

      if (!response.ok) {
        throw new Error('Failed to store token data');
      }

    } catch (error) {
      console.error('Token creation failed:', error);
      toast({
        title: "Creation Failed",
        description: `Failed to create tokenized message: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDistributeTokens = async () => {
    if (!createdToken || !formData.recipients.trim()) {
      toast({
        title: "Missing Information",
        description: "Please create a token and provide recipient addresses",
        variant: "destructive"
      });
      return;
    }

    setIsDistributing(true);
    try {
      const recipients = formData.recipients
        .split('\n')
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0);

      let signatures: string[];

      if (window.solana && window.solana.isPhantom) {
        // Real blockchain distribution
        const walletPublicKey = new PublicKey(walletAddress!);
        const signTransaction = async (transaction: Transaction) => {
          return await window.solana.signTransaction(transaction);
        };
        
        toast({
          title: "Distributing Tokens",
          description: "Please approve transactions in your wallet...",
        });
        
        signatures = await distributeTokens(
          walletPublicKey,
          signTransaction,
          createdToken.mintAddress,
          recipients
        );
        
        toast({
          title: "Tokens Distributed on Blockchain!",
          description: `Successfully sent to ${recipients.length} recipients`,
        });
        
      } else {
        // Development fallback
        signatures = recipients.map(() => 
          'DevDistSig' + Math.random().toString(36).substring(2, 15)
        );
        
        toast({
          title: "Development Distribution",
          description: "Real blockchain distribution available with Phantom wallet",
        });
      }

      // Store distribution data
      await fetch('/api/tokens/distribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': walletAddress!
        },
        body: JSON.stringify({
          mintAddress: createdToken.mintAddress,
          recipients,
          signatures
        })
      });

    } catch (error) {
      console.error('Distribution failed:', error);
      toast({
        title: "Distribution Failed",
        description: `Failed to distribute tokens: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsDistributing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
            <CardTitle>Wallet Connection Required</CardTitle>
            <CardDescription>
              Please connect your Solana wallet to create tokenized messages
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Create Tokenized Message
        </h1>
        <p className="text-slate-400 mt-2">
          Transform your message into a unique SPL token on Solana
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Message Details
            </CardTitle>
            <CardDescription>
              Configure your tokenized message parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Message Title (Max 27 characters)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value.substring(0, 27) }))}
                placeholder="Enter message title..."
                maxLength={27}
              />
              <div className="text-xs text-slate-400 mt-1">
                {formData.title.length}/27 characters
              </div>
            </div>

            <div>
              <Label htmlFor="content">Message Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your message content..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Attached Value</Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value: 'SOL' | 'USDC' | 'FLBY') => 
                  setFormData(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOL">SOL</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="FLBY">FLBY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="expiration">Expiration Date (Optional)</Label>
              <Input
                id="expiration"
                type="datetime-local"
                value={formData.expirationDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Limited Edition</Label>
                <p className="text-sm text-slate-400">Create a limited supply token</p>
              </div>
              <Switch
                checked={formData.isLimitedEdition}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isLimitedEdition: checked }))}
              />
            </div>

            {formData.isLimitedEdition && (
              <div>
                <Label htmlFor="maxSupply">Maximum Supply</Label>
                <Input
                  id="maxSupply"
                  type="number"
                  min="1"
                  value={formData.maxSupply}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxSupply: parseInt(e.target.value) || 1 }))}
                />
              </div>
            )}

            <Button
              onClick={handleCreateToken}
              disabled={isCreating || !formData.title.trim() || !formData.content.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Creating Token...
                </div>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Create Token
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Distribution Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Token Distribution
            </CardTitle>
            <CardDescription>
              Distribute your tokenized message to recipients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {createdToken ? (
              <>
                <div className="p-4 bg-slate-900 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">Created Token</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <Star className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                  <div className="font-mono text-sm text-blue-400">
                    {createdToken.metadata.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    Mint: {createdToken.mintAddress.substring(0, 8)}...
                  </div>
                </div>

                <div>
                  <Label htmlFor="recipients">Recipient Addresses (One per line)</Label>
                  <Textarea
                    id="recipients"
                    value={formData.recipients}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                    placeholder="Enter Solana wallet addresses, one per line..."
                    rows={6}
                  />
                </div>

                <Button
                  onClick={handleDistributeTokens}
                  disabled={isDistributing || !formData.recipients.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isDistributing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Distributing...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Distribute Tokens
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Timer className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">
                  Create a token first to enable distribution
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}