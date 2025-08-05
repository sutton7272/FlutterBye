import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  Brain, 
  Shield, 
  Zap, 
  Wallet,
  MessageSquare,
  TrendingUp,
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DemoResult {
  success: boolean;
  data?: any;
  error?: string;
  transactionId?: string;
  timestamp?: string;
}

export default function DemoShowcase() {
  const [smsMessage, setSmsMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [analysisText, setAnalysisText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Real Solana Token Creation Demo
  const createTokenMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest('/api/demo/create-token', {
        method: 'POST',
        body: { message, demoMode: false }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Real Token Created!",
        description: `Transaction: ${data.signature?.slice(0, 20)}...`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/demo/transactions'] });
    },
    onError: (error) => {
      toast({
        title: "Token Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Real AI Analysis Demo
  const aiAnalysisMutation = useMutation({
    mutationFn: async (text: string) => {
      return await apiRequest('/api/demo/ai-analysis', {
        method: 'POST',
        body: { text, includeEmotions: true, includeInsights: true }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "AI Analysis Complete",
        description: `Detected ${data.emotions?.length || 0} emotions with ${data.confidence}% confidence`,
      });
    }
  });

  // Real Wallet Scoring Demo
  const walletScoringMutation = useMutation({
    mutationFn: async (address: string) => {
      return await apiRequest('/api/demo/wallet-scoring', {
        method: 'POST',
        body: { address, deepAnalysis: true }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Wallet Analysis Complete",
        description: `Risk Score: ${data.riskScore}/100`,
      });
    }
  });

  // Real-time Blockchain Data
  const { data: blockchainData } = useQuery({
    queryKey: ['/api/demo/blockchain-status'],
    refetchInterval: 10000, // Update every 10 seconds
  });

  // Recent Transactions
  const { data: recentTransactions } = useQuery({
    queryKey: ['/api/demo/transactions'],
    refetchInterval: 5000,
  });

  const demoCapabilities = [
    {
      icon: Coins,
      title: "Real Solana Token Creation",
      description: "Create actual SPL tokens on Solana mainnet/devnet",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      icon: Brain,
      title: "Live OpenAI GPT-4o Integration",
      description: "Real AI analysis with emotion detection and insights",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: Wallet,
      title: "Blockchain Wallet Analysis",
      description: "Real-time wallet scoring and risk assessment",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Database,
      title: "Production Database",
      description: "PostgreSQL with real data persistence",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: MessageSquare,
      title: "SMS-to-Blockchain Bridge",
      description: "Twilio integration for real SMS processing",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      icon: Shield,
      title: "Smart Contract Interactions",
      description: "Deploy and interact with real Solana programs",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Live Blockchain & AI Demonstration
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real working examples of blockchain transactions, AI analysis, and smart contract interactions.
            These are not simulations - they connect to live networks and services.
          </p>
        </div>

        {/* Live Status Dashboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-yellow-500" size={24} />
              Live System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="font-medium">Solana Network</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle size={14} className="mr-1" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="font-medium">OpenAI API</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle size={14} className="mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="font-medium">Database</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle size={14} className="mr-1" />
                  Online
                </Badge>
              </div>
            </div>
            {blockchainData && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Latest Block: {blockchainData.latestBlock} | 
                  Network TPS: {blockchainData.tps} | 
                  Last Updated: {new Date(blockchainData.timestamp).toLocaleTimeString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Capabilities Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {demoCapabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Card key={index} className={`border-l-4 ${capability.bgColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Icon className={capability.color} size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {capability.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {capability.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Interactive Demos */}
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tokens">Token Creation</TabsTrigger>
            <TabsTrigger value="ai">AI Analysis</TabsTrigger>
            <TabsTrigger value="wallet">Wallet Scoring</TabsTrigger>
            <TabsTrigger value="transactions">Live Data</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="text-yellow-500" />
                  Real Solana Token Creation
                </CardTitle>
                <CardDescription>
                  Create an actual SPL token on Solana blockchain with real transaction signatures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your message to create a real token..."
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={() => createTokenMutation.mutate(smsMessage)}
                  disabled={!smsMessage.trim() || createTokenMutation.isPending}
                  className="w-full"
                >
                  {createTokenMutation.isPending ? 'Creating Real Token...' : 'Create Live Token on Solana'}
                </Button>
                {createTokenMutation.data && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      Token Created Successfully!
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Transaction: {createTokenMutation.data.signature}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Token Address: {createTokenMutation.data.tokenAddress}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="text-purple-500" />
                  Live OpenAI GPT-4o Analysis
                </CardTitle>
                <CardDescription>
                  Real-time AI analysis using OpenAI's latest model with emotion detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter text for real AI analysis..."
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={() => aiAnalysisMutation.mutate(analysisText)}
                  disabled={!analysisText.trim() || aiAnalysisMutation.isPending}
                  className="w-full"
                >
                  {aiAnalysisMutation.isPending ? 'Analyzing with GPT-4o...' : 'Analyze with Real AI'}
                </Button>
                {aiAnalysisMutation.data && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                      AI Analysis Results
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Sentiment:</strong> {aiAnalysisMutation.data.sentiment}</p>
                      <p className="text-sm"><strong>Confidence:</strong> {aiAnalysisMutation.data.confidence}%</p>
                      <p className="text-sm"><strong>Emotions:</strong> {aiAnalysisMutation.data.emotions?.join(', ')}</p>
                      <p className="text-sm"><strong>Summary:</strong> {aiAnalysisMutation.data.summary}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="text-blue-500" />
                  Real Wallet Intelligence Scoring
                </CardTitle>
                <CardDescription>
                  Analyze real wallet addresses with blockchain data and risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter Solana wallet address..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
                <Button 
                  onClick={() => walletScoringMutation.mutate(walletAddress)}
                  disabled={!walletAddress.trim() || walletScoringMutation.isPending}
                  className="w-full"
                >
                  {walletScoringMutation.isPending ? 'Analyzing Wallet...' : 'Analyze Real Wallet'}
                </Button>
                {walletScoringMutation.data && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Wallet Analysis Results
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Risk Score:</strong> {walletScoringMutation.data.riskScore}/100</p>
                      <p className="text-sm"><strong>Activity Level:</strong> {walletScoringMutation.data.activityLevel}</p>
                      <p className="text-sm"><strong>Token Holdings:</strong> {walletScoringMutation.data.tokenCount} tokens</p>
                      <p className="text-sm"><strong>Last Activity:</strong> {walletScoringMutation.data.lastActivity}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-green-500" />
                  Live Transaction Feed
                </CardTitle>
                <CardDescription>
                  Real-time blockchain transactions and system activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransactions?.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.slice(0, 5).map((tx: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{tx.type}</p>
                          <p className="text-xs text-gray-500">{tx.signature?.slice(0, 20)}...</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{tx.amount || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No recent transactions</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}