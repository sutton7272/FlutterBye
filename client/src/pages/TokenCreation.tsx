import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Coins, Zap, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface TokenCreationResult {
  success: boolean;
  signature?: string;
  tokenAddress?: string;
  message: string;
  network: string;
  timestamp: string;
  error?: string;
}

export default function TokenCreation() {
  const [message, setMessage] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const { toast } = useToast();

  // Get user's recent tokens
  const { data: recentTokens } = useQuery({
    queryKey: ['/api/tokens/my-tokens'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Create token mutation
  const createTokenMutation = useMutation({
    mutationFn: async (tokenData: {
      message: string;
      name?: string;
      symbol?: string;
    }) => {
      return await apiRequest('/api/tokens/create', {
        method: 'POST',
        body: tokenData
      });
    },
    onSuccess: (data: TokenCreationResult) => {
      toast({
        title: "Token Created Successfully!",
        description: `${data.tokenAddress?.slice(0, 20)}...`,
      });
      setMessage('');
      setTokenName('');
      setTokenSymbol('');
    },
    onError: (error) => {
      toast({
        title: "Token Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Address copied successfully",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message for your token",
        variant: "destructive"
      });
      return;
    }

    createTokenMutation.mutate({
      message: message.trim(),
      name: tokenName.trim() || undefined,
      symbol: tokenSymbol.trim() || undefined
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your Token
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Transform your message into a unique Solana token
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Token Creation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="text-yellow-500" />
                Token Creation
              </CardTitle>
              <CardDescription>
                Create a new SPL token on Solana blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message that will be tokenized..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] mt-2"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This message will be embedded in your token's metadata
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tokenName">Token Name (Optional)</Label>
                    <Input
                      id="tokenName"
                      placeholder="My Awesome Token"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tokenSymbol">Symbol (Optional)</Label>
                    <Input
                      id="tokenSymbol"
                      placeholder="MAT"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                      className="mt-2"
                      maxLength={10}
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={!message.trim() || createTokenMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {createTokenMutation.isPending ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Creating Token...
                    </>
                  ) : (
                    <>
                      <Coins className="mr-2 h-4 w-4" />
                      Create Token
                    </>
                  )}
                </Button>

                {createTokenMutation.data && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                          Token Created Successfully!
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Token Address:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">
                                {createTokenMutation.data.tokenAddress}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(createTokenMutation.data.tokenAddress!)}
                              >
                                <Copy size={14} />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Transaction:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">
                                {createTokenMutation.data.signature}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(createTokenMutation.data.signature!)}
                              >
                                <Copy size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {createTokenMutation.error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200">
                          Creation Failed
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          {createTokenMutation.error.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Recent Tokens */}
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Tokens</CardTitle>
              <CardDescription>
                Tokens you've created recently
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentTokens && recentTokens.length > 0 ? (
                <div className="space-y-4">
                  {recentTokens.slice(0, 5).map((token: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {token.name || 'Unnamed Token'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {token.message?.slice(0, 60)}...
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {token.symbol || 'TOKEN'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(token.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(token.address)}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Coins className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No tokens created yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create your first token to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}