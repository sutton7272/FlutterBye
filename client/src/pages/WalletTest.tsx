import React, { useState } from 'react';
import { SimpleWalletConnect } from '@/components/SimpleWalletConnect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, Wallet, CheckCircle, Database, Brain, Zap, Play, Trash2, Server, Shield } from 'lucide-react';
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

      const data = await response.json();

      const result = {
        test: 'Burn Preparation',
        status: data.success ? 'PASSED' : 'FAILED',
        details: data.message || 'Unknown result',
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

      const data = await response.json();

      const result = {
        test: 'Burn Confirmation',
        status: data.success ? 'PASSED' : 'FAILED',
        details: data.message || 'Unknown result',
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

  const testAPIEndpoints = async () => {
    const endpoints = [
      { name: 'Dashboard Stats', url: '/api/dashboard/stats' },
      { name: 'Admin Features', url: '/api/admin/features' },
      { name: 'System Health', url: '/api/admin/system-health' },
      { name: 'User Analytics', url: '/api/admin/analytics' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await apiRequest('GET', endpoint.url);
        const data = await response.json();
        
        const result = {
          test: `API Test: ${endpoint.name}`,
          status: response.ok ? 'PASSED' : 'FAILED',
          details: response.ok ? `Response received (${response.status})` : `HTTP ${response.status}`,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setTestResults(prev => [...prev, result]);
      } catch (error: any) {
        const result = {
          test: `API Test: ${endpoint.name}`,
          status: 'ERROR',
          details: error.message,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setTestResults(prev => [...prev, result]);
      }
    }
    
    toast({
      title: "API Tests Completed",
      description: `Tested ${endpoints.length} endpoints`,
    });
  };

  const testDatabaseConnection = async () => {
    try {
      const response = await apiRequest('GET', '/api/admin/database-test');
      const data = await response.json();
      
      const result = {
        test: 'Database Connection',
        status: data.connected ? 'PASSED' : 'FAILED',
        details: data.message || 'Database connectivity test',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
      
      toast({
        title: result.status === 'PASSED' ? "Database Connected" : "Database Error",
        description: result.details,
        variant: result.status === 'PASSED' ? "default" : "destructive",
      });
    } catch (error: any) {
      const result = {
        test: 'Database Connection',
        status: 'ERROR',
        details: error.message,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
      
      toast({
        title: "Database Test Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testAIServices = async () => {
    try {
      const response = await apiRequest('POST', '/api/ai/test', {
        message: 'Test AI connectivity'
      });
      const data = await response.json();
      
      const result = {
        test: 'AI Services (OpenAI)',
        status: data.success ? 'PASSED' : 'FAILED',
        details: data.message || 'AI service connectivity test',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
      
      toast({
        title: result.status === 'PASSED' ? "AI Services Online" : "AI Services Error",
        description: result.details,
        variant: result.status === 'PASSED' ? "default" : "destructive",
      });
    } catch (error: any) {
      const result = {
        test: 'AI Services (OpenAI)',
        status: 'ERROR',
        details: error.message,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
      
      toast({
        title: "AI Test Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testTokenCreation = async () => {
    try {
      const response = await apiRequest('POST', '/api/tokens/test-creation', {
        message: 'Test token creation',
        walletAddress: connectedWallet || 'test-wallet'
      });
      const data = await response.json();
      
      const result = {
        test: 'Token Creation System',
        status: data.success ? 'PASSED' : 'FAILED',
        details: data.message || 'Token creation test',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
      
      toast({
        title: result.status === 'PASSED' ? "Token System Ready" : "Token System Error",
        description: result.details,
        variant: result.status === 'PASSED' ? "default" : "destructive",
      });
    } catch (error: any) {
      const result = {
        test: 'Token Creation System',
        status: 'ERROR',
        details: error.message,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
      
      toast({
        title: "Token Test Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    toast({
      title: "Running Full Test Suite",
      description: "Testing all platform components...",
    });

    await testAPIEndpoints();
    await testDatabaseConnection();
    await testAIServices();
    await testTokenCreation();
    
    if (connectedWallet) {
      await testBurnPreparation();
      await testBurnConfirmation();
    }

    toast({
      title: "Test Suite Completed",
      description: "All tests have been executed",
    });
  };

  const clearResults = () => {
    setTestResults([]);
    toast({
      title: "Results Cleared",
      description: "Test history has been cleared",
    });
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

        {/* Test Suite */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Comprehensive Test Suite
            </CardTitle>
            <CardDescription className="text-white/70">
              Test all platform components including blockchain, AI, and infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="individual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="individual" className="text-white data-[state=active]:bg-blue-600">Individual Tests</TabsTrigger>
                <TabsTrigger value="suite" className="text-white data-[state=active]:bg-blue-600">Test Suites</TabsTrigger>
              </TabsList>

              <TabsContent value="individual" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Blockchain Tests */}
                  <Card className="bg-slate-800/50 border-blue-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-blue-400 text-lg flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Blockchain Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        onClick={testBurnPreparation}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        disabled={!connectedWallet}
                      >
                        <Flame className="w-4 h-4 mr-2" />
                        Burn Preparation
                      </Button>
                      
                      <Button 
                        onClick={testBurnConfirmation}
                        className="w-full bg-red-600 hover:bg-red-700"
                        disabled={!connectedWallet}
                      >
                        <Flame className="w-4 h-4 mr-2" />
                        Burn Confirmation
                      </Button>

                      <Button 
                        onClick={testTokenCreation}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Token Creation
                      </Button>
                      
                      {!connectedWallet && (
                        <p className="text-yellow-400 text-xs">
                          Connect wallet for burn tests
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Infrastructure Tests */}
                  <Card className="bg-slate-800/50 border-green-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-400 text-lg flex items-center gap-2">
                        <Server className="w-5 h-5" />
                        Infrastructure Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        onClick={testDatabaseConnection}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Database className="w-4 h-4 mr-2" />
                        Database Connection
                      </Button>
                      
                      <Button 
                        onClick={testAPIEndpoints}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Server className="w-4 h-4 mr-2" />
                        API Endpoints
                      </Button>

                      <Button 
                        onClick={testAIServices}
                        className="w-full bg-pink-600 hover:bg-pink-700"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        AI Services
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="suite" className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={runAllTests}
                    className="bg-cyan-600 hover:bg-cyan-700 flex-1 min-w-48"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run Full Test Suite
                  </Button>
                  
                  <Button 
                    onClick={clearResults}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Results
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <Card className="bg-slate-800/30 border-slate-600">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-cyan-400">
                        {testResults.filter(r => r.status === 'PASSED').length}
                      </div>
                      <div className="text-sm text-slate-400">Tests Passed</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/30 border-slate-600">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-red-400">
                        {testResults.filter(r => r.status === 'FAILED' || r.status === 'ERROR').length}
                      </div>
                      <div className="text-sm text-slate-400">Tests Failed</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/30 border-slate-600">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-white">
                        {testResults.length}
                      </div>
                      <div className="text-sm text-slate-400">Total Tests</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
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
            ✅ Comprehensive Testing Suite Active
          </div>
          <div className="text-white/70 mt-2">
            Ready to test all platform components: blockchain, infrastructure, AI services, and more
          </div>
        </div>
      </div>
    </div>
  );
}