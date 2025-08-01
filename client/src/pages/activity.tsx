import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Download, Clock, CheckCircle, XCircle, Send, ArrowDownLeft, History, Filter } from 'lucide-react';

interface Redemption {
  id: string;
  tokenId: string;
  userId: string;
  burnTransactionSignature: string;
  redeemedAmount: string;
  currency: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}

interface Transaction {
  id: string;
  type: string;
  fromUserId?: string;
  toUserId?: string;
  tokenId: string;
  quantity: number;
  totalValue?: string;
  status: string;
  createdAt: string;
}

export default function ActivityPage() {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: redemptions = [], isLoading: redemptionsLoading } = useQuery({
    queryKey: ['/api/users', selectedWallet, 'redemptions'],
    enabled: !!selectedWallet,
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions', selectedWallet],
    enabled: !!selectedWallet,
  });

  const connectWallet = async () => {
    try {
      const mockWallet = 'user-' + Math.random().toString(36).substr(2, 9);
      setSelectedWallet(mockWallet);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const csvData = (redemptions as Redemption[]).map((redemption: Redemption) => ({
      Date: new Date(redemption.createdAt).toLocaleDateString(),
      Type: 'Redemption',
      Amount: `${redemption.redeemedAmount} ${redemption.currency}`,
      Status: redemption.status,
      'Transaction ID': redemption.burnTransactionSignature,
    }));

    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map((row: any) => Object.values(row).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flutterbye-activity-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Activity data exported to CSV file.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'completed':
      case 'confirmed':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'mint':
        return <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center"><Send className="w-4 h-4 text-green-600" /></div>;
      case 'buy':
      case 'receive':
        return <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"><ArrowDownLeft className="w-4 h-4 text-blue-600" /></div>;
      case 'sell':
      case 'transfer':
        return <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center"><Send className="w-4 h-4 text-orange-600" /></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><History className="w-4 h-4 text-gray-600" /></div>;
    }
  };

  const filteredRedemptions = (redemptions as Redemption[]).filter((redemption: Redemption) => {
    const dateMatch = !dateFilter || redemption.createdAt.includes(dateFilter);
    const statusMatch = statusFilter === 'all' || redemption.status === statusFilter;
    return dateMatch && statusMatch;
  });

  const filteredTransactions = (transactions as Transaction[]).filter((transaction: Transaction) => {
    const dateMatch = !dateFilter || transaction.createdAt.includes(dateFilter);
    const statusMatch = statusFilter === 'all' || transaction.status === statusFilter;
    return dateMatch && statusMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            My Activity
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your token transactions and redemption history
          </p>
        </div>

        {/* Wallet Connection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view your activity history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedWallet ? (
              <Button onClick={connectWallet} size="lg" className="w-full sm:w-auto">
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-sm">
                  Connected: {selectedWallet}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    onClick={exportToCSV}
                    variant="outline"
                    size="sm"
                    disabled={(redemptions as Redemption[]).length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedWallet('')}
                    size="sm"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedWallet && (
          <>
            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      placeholder="Filter by date"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Tabs */}
            <Tabs defaultValue="redemptions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="redemptions">Redemptions</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>

              <TabsContent value="redemptions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Redemption History</CardTitle>
                    <CardDescription>
                      Track all your token redemptions and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {redemptionsLoading ? (
                      <div className="text-center py-8">Loading redemptions...</div>
                    ) : filteredRedemptions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No redemptions found
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredRedemptions.map((redemption: Redemption) => (
                          <div key={redemption.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-red-600" />
                              </div>
                              <div>
                                <div className="font-medium">Token Redemption</div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(redemption.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-green-600">
                                +{redemption.redeemedAmount} {redemption.currency}
                              </div>
                              <div className="text-sm">
                                {getStatusBadge(redemption.status)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      View all your token mints, buys, sells, and transfers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactionsLoading ? (
                      <div className="text-center py-8">Loading transactions...</div>
                    ) : filteredTransactions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredTransactions.map((transaction: Transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center space-x-4">
                              {getTransactionIcon(transaction.type)}
                              <div>
                                <div className="font-medium capitalize">
                                  {transaction.type} Token
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Quantity: {transaction.quantity}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(transaction.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {transaction.totalValue && (
                                <div className="font-medium">
                                  {transaction.totalValue} SOL
                                </div>
                              )}
                              <div className="text-sm">
                                {getStatusBadge(transaction.status)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}