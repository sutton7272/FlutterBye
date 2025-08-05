import React, { useState } from 'react';
import { SimpleWalletConnect } from '@/components/SimpleWalletConnect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Wallet, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function WalletTest() {
  const [connectedWallet, setConnectedWallet] = useState<string>('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleWalletConnect = (publicKey: string) => {
    setConnectedWallet(publicKey);
    toast({
      title: "Wallet Connected Successfully",
      description: `Connected to ${publicKey.slice(0, 8)}...${publicKey.slice(-8)}`,
    });
  };

  const handleWalletDisconnect = () => {
    setConnectedWallet('');
    setTestResults([]);
  };

  const testBurnPreparation = async () => {
    if (!connectedWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest('POST', '/api/tokens/test-token/prepare-burn', {
        burnerWallet: connectedWallet,
        recipientWallet: connectedWallet
      });

      const result = {
        test: 'Burn Preparation',
        status: response.success ? 'PASSED' : 'FAILED',
        details: response.message || 'Unknown result',
        timestamp: new Date().toLocaleTimeString()
      };

      setTestResults(prev => [...prev, result]);
      
      toast({
        title: result.status === 'PASSED' ? "Test Passed" : "Test Failed",
        description: result.details,
        variant: result.status === 'PASSED' ? "default" : "destructive",
      });
    } catch (error: any) {
      const result = {
        test: 'Burn Preparation',
        status: 'ERROR',
        details: error.message,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
      
      toast({
        title: "Test Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testBurnConfirmation = async () => {
    if (!connectedWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest('POST', '/api/tokens/test-token/confirm-burn', {
        signature: 'test-signature-' + Date.now(),
        burnerWallet: connectedWallet,
        recipientWallet: connectedWallet
      });

      const result = {
        test: 'Burn Confirmation',
        status: response.success ? 'PASSED' : 'FAILED',
        details: response.message || 'Unknown result',
        timestamp: new Date().toLocaleTimeString()
      };

      setTestResults(prev => [...prev, result]);
      
      toast({
        title: result.status === 'PASSED' ? "Test Passed" : "Test Failed",
        description: result.details,
        variant: result.status === 'PASSED' ? "default" : "destructive",
      });
    } catch (error: any) {
      const result = {
        test: 'Burn Confirmation',
        status: 'ERROR',
        details: error.message,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
      
      toast({
        title: "Test Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            🔐 Wallet Integration Test Suite
          </h1>
          <p className="text-xl text-white/70">
            Test secure wallet connection and burn-to-redeem functionality
          </p>
        </div>

        {/* Wallet Connection */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Connection
            </CardTitle>
            <CardDescription className="text-white/70">
              Connect your Phantom wallet to test the integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SimpleWalletConnect
              onWalletConnect={handleWalletConnect}
              onWalletDisconnect={handleWalletDisconnect}
            />
            
            {connectedWallet && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Wallet Connected</span>
                </div>
                <div className="text-sm text-white/70 mt-2">
                  Address: {connectedWallet}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Burn-to-Redeem Tests
            </CardTitle>
            <CardDescription className="text-white/70">
              Test the burn transaction preparation and confirmation endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={testBurnPreparation}
                disabled={!connectedWallet}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Test Burn Preparation
              </Button>
              
              <Button
                onClick={testBurnConfirmation}
                disabled={!connectedWallet}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Test Burn Confirmation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold">
                          {result.test}
                        </span>
                        <Badge
                          variant={
                            result.status === 'PASSED'
                              ? 'default'
                              : result.status === 'FAILED'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {result.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-white/50">
                        {result.timestamp}
                      </span>
                    </div>
                    <div className="text-sm text-white/70 mt-2">
                      {result.details}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status */}
        <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="text-green-400 font-semibold text-lg">
            ✅ Wallet Integration System Active
          </div>
          <div className="text-white/70 mt-2">
            Ready for secure burn-to-redeem operations with client-side wallet signing
          </div>
        </div>
      </div>
    </div>
  );
}