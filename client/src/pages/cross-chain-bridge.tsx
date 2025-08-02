import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeftRight, Shield, Zap, Timer, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportedChain {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  bridgeFee: number;
  estimatedTime: string;
  security: 'high' | 'medium';
}

interface BridgeTransaction {
  id: string;
  fromChain: string;
  toChain: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedCompletion: string;
  txHash?: string;
}

const SUPPORTED_CHAINS: SupportedChain[] = [
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: '◎',
    bridgeFee: 0.001,
    estimatedTime: '2-5 min',
    security: 'high'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    bridgeFee: 0.005,
    estimatedTime: '15-30 min',
    security: 'high'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: '⬢',
    bridgeFee: 0.0001,
    estimatedTime: '3-8 min',
    security: 'high'
  },
  {
    id: 'bsc',
    name: 'BNB Chain',
    symbol: 'BNB',
    icon: '🔶',
    bridgeFee: 0.002,
    estimatedTime: '5-10 min',
    security: 'medium'
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    icon: '🔺',
    bridgeFee: 0.003,
    estimatedTime: '1-3 min',
    security: 'high'
  }
];

export default function CrossChainBridge() {
  const [fromChain, setFromChain] = useState<string>('');
  const [toChain, setToChain] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [bridgeTransactions, setBridgeTransactions] = useState<BridgeTransaction[]>([]);
  const [isBridging, setIsBridging] = useState(false);

  const getChainByid = (id: string) => SUPPORTED_CHAINS.find(chain => chain.id === id);

  const initiateBridge = async () => {
    if (!fromChain || !toChain || !amount) return;
    
    setIsBridging(true);
    
    const newTransaction: BridgeTransaction = {
      id: Date.now().toString(),
      fromChain,
      toChain,
      amount: parseFloat(amount),
      status: 'pending',
      estimatedCompletion: new Date(Date.now() + 300000).toLocaleTimeString(), // 5 minutes
    };

    setBridgeTransactions(prev => [newTransaction, ...prev]);
    
    // Simulate bridge process
    setTimeout(() => {
      setBridgeTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'processing', txHash: `0x${Math.random().toString(16).slice(2, 18)}` }
            : tx
        )
      );
    }, 2000);

    setTimeout(() => {
      setBridgeTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'completed' }
            : tx
        )
      );
      setIsBridging(false);
    }, 8000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Timer className="w-4 h-4 text-yellow-500" />;
      case 'processing': return <Zap className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const selectedFromChain = getChainByid(fromChain);
  const selectedToChain = getChainByid(toChain);
  const bridgeFee = selectedFromChain?.bridgeFee || 0;
  const totalAmount = parseFloat(amount || '0') + bridgeFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <ArrowLeftRight className="w-8 h-8 text-electric-blue" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
              Cross-Chain Bridge
            </h1>
            <Shield className="w-8 h-8 text-electric-green" />
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Bridge your FLBY tokens across multiple blockchains with institutional-grade security
          </p>
        </motion.div>

        {/* Bridge Interface */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-electric-blue">Bridge Tokens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Chain */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">From Chain</label>
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select source chain" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {SUPPORTED_CHAINS.map(chain => (
                    <SelectItem key={chain.id} value={chain.id} className="text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{chain.icon}</span>
                        <span>{chain.name}</span>
                        <Badge variant={chain.security === 'high' ? 'default' : 'secondary'} className="ml-auto">
                          {chain.security}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bridge Direction Indicator */}
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: fromChain && toChain ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-slate-700 rounded-full"
              >
                <ArrowLeftRight className="w-6 h-6 text-electric-blue" />
              </motion.div>
            </div>

            {/* To Chain */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">To Chain</label>
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select destination chain" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {SUPPORTED_CHAINS.filter(chain => chain.id !== fromChain).map(chain => (
                    <SelectItem key={chain.id} value={chain.id} className="text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{chain.icon}</span>
                        <span>{chain.name}</span>
                        <Badge variant={chain.security === 'high' ? 'default' : 'secondary'} className="ml-auto">
                          {chain.security}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Amount</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="bg-slate-700 border-slate-600 text-white text-lg"
                step="0.000001"
              />
            </div>

            {/* Bridge Details */}
            <AnimatePresence>
              {selectedFromChain && selectedToChain && amount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-700/50 rounded-lg p-4 space-y-3"
                >
                  <h4 className="font-semibold text-white">Bridge Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bridge Fee:</span>
                      <span className="text-white">{bridgeFee} {selectedFromChain.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Estimated Time:</span>
                      <span className="text-white">{selectedToChain.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-300">Total Amount:</span>
                      <span className="text-electric-blue">{totalAmount.toFixed(6)} {selectedFromChain.symbol}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bridge Button */}
            <Button
              onClick={initiateBridge}
              disabled={!fromChain || !toChain || !amount || isBridging}
              className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80"
            >
              {isBridging ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Initiating Bridge...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4" />
                  Bridge Tokens
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Transaction History */}
        {bridgeTransactions.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-electric-green">Bridge Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bridgeTransactions.map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-700/50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(tx.status)}
                        <div>
                          <div className="font-medium text-white">
                            {tx.amount} FLBY
                          </div>
                          <div className="text-sm text-gray-400">
                            {getChainByid(tx.fromChain)?.name} → {getChainByid(tx.toChain)?.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={tx.status === 'completed' ? 'default' : 'secondary'}
                          className={tx.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {tx.status.toUpperCase()}
                        </Badge>
                        {tx.status === 'processing' && (
                          <div className="text-xs text-gray-400 mt-1">
                            ETA: {tx.estimatedCompletion}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {tx.status === 'processing' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Processing...</span>
                          <span>~3 min remaining</span>
                        </div>
                        <Progress value={65} className="h-1" />
                      </div>
                    )}
                    
                    {tx.txHash && (
                      <div className="mt-2 text-xs text-gray-400">
                        TX: {tx.txHash}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}