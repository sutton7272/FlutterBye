import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Progress } from '@/components/ui/progress';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Shield, Wallet, TrendingUp, AlertCircle, DollarSign, Users, Settings, RefreshCw, Eye, Download, Upload, Sliders } from 'lucide-react';

interface EscrowStats {
  totalEscrows: number;
  totalValue: number;
  activeEscrows: number;
  releasedEscrows: number;
  cancelledEscrows: number;
  expiredEscrows: number;
  averageEscrowValue: number;
  contractStatus: string;
}

interface EscrowContract {
  id: string;
  amount: number;
  recipientAddress: string;
  authorityAddress: string;
  mintAddress: string;
  timeoutHours: number;
  status: 'active' | 'released' | 'cancelled' | 'expired';
  createdAt: string;
  expiresAt: string;
  contractValue: number;
  fees: number;
}

interface EscrowFeeConfig {
  id: string;
  currency: string;
  depositFeePercentage: string;
  withdrawalFeePercentage: string;
  minimumDepositFee: string;
  minimumWithdrawalFee: string;
  maximumDepositFee: string;
  maximumWithdrawalFee: string;
  updatedAt: string;
  updatedBy?: string;
}

export function EscrowWalletManagement() {
  const [stats, setStats] = useState<EscrowStats | null>(null);
  const [contracts, setContracts] = useState<EscrowContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('SOL');
  const [newContractData, setNewContractData] = useState({
    amount: '',
    recipientAddress: '',
    timeoutHours: '72',
    mintAddress: 'So11111111111111111111111111111111111111112', // SOL
    escrowId: ''
  });
  const [feeConfigs, setFeeConfigs] = useState<EscrowFeeConfig[]>([]);
  const [editingFeeConfig, setEditingFeeConfig] = useState<EscrowFeeConfig | null>(null);
  const [isFeeDialogOpen, setIsFeeDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEscrowData();
    fetchFeeConfigs();
    const interval = setInterval(() => {
      fetchEscrowData();
      fetchFeeConfigs();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchEscrowData = async () => {
    try {
      const [statsResponse, contractsResponse] = await Promise.all([
        fetch('/api/escrow/stats'),
        fetch('/api/escrow/authority/9ixLmNcGMN7YBZ84bgPAgtJEXafdDMYuzmvGbeKTtzR') // Your authority address
      ]);
      
      const statsData = await statsResponse.json();
      const contractsData = await contractsResponse.json();
      
      setStats(statsData.data);
      setContracts(contractsData.success ? contractsData.escrows : []);
    } catch (error) {
      console.error('Error fetching escrow data:', error);
    }
  };

  const handleCreateEscrow = async () => {
    if (!newContractData.amount || !newContractData.recipientAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in amount and recipient address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/escrow/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newContractData,
          amount: parseFloat(newContractData.amount) * 1000000000, // Convert to lamports
          timeoutHours: parseInt(newContractData.timeoutHours),
          escrowId: newContractData.escrowId || `escrow_${Date.now()}`
        })
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Escrow Created",
          description: `Escrow contract created successfully: ${result.escrowId}`,
        });
        setNewContractData({
          amount: '',
          recipientAddress: '',
          timeoutHours: '72',
          mintAddress: 'So11111111111111111111111111111111111111112',
          escrowId: ''
        });
        fetchEscrowData();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error Creating Escrow",
        description: error.message || "Failed to create escrow contract",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseEscrow = async (escrowId: string, authorityAddress: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/escrow/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escrowId, authorityAddress })
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Escrow Released",
          description: `Funds released successfully to recipient`,
        });
        fetchEscrowData();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error Releasing Escrow",
        description: error.message || "Failed to release escrow funds",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeConfigs = async () => {
    try {
      const response = await fetch('/api/escrow-fees/configs');
      const data = await response.json();
      if (data.success) {
        setFeeConfigs(data.data);
      }
    } catch (error) {
      console.error('Error fetching fee configs:', error);
    }
  };

  const handleUpdateFeeConfig = async (feeConfig: EscrowFeeConfig) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/escrow-fees/configs/${feeConfig.currency}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositFeePercentage: feeConfig.depositFeePercentage,
          withdrawalFeePercentage: feeConfig.withdrawalFeePercentage,
          minimumDepositFee: feeConfig.minimumDepositFee,
          minimumWithdrawalFee: feeConfig.minimumWithdrawalFee,
          maximumDepositFee: feeConfig.maximumDepositFee,
          maximumWithdrawalFee: feeConfig.maximumWithdrawalFee
        })
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Fee Configuration Updated",
          description: `${feeConfig.currency} escrow fees updated successfully`,
        });
        fetchFeeConfigs(); // Refresh data
        setIsFeeDialogOpen(false);
        setEditingFeeConfig(null);
      } else {
        throw new Error(result.message || 'Failed to update fee configuration');
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const openFeeEditDialog = (feeConfig: EscrowFeeConfig) => {
    setEditingFeeConfig({ ...feeConfig });
    setIsFeeDialogOpen(true);
  };

  const handleWithdrawProfits = async () => {
    if (!withdrawAddress || !withdrawAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in withdrawal address and amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // This would be a custom endpoint for profit withdrawal
      const response = await fetch('/api/escrow/withdraw-profits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toAddress: withdrawAddress,
          amount: parseFloat(withdrawAmount),
          currency: selectedCurrency
        })
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Withdrawal Successful",
          description: `${withdrawAmount} ${selectedCurrency} withdrawn to ${withdrawAddress.slice(0, 8)}...`,
        });
        setWithdrawAddress('');
        setWithdrawAmount('');
        fetchEscrowData();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to withdraw profits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'SOL') => {
    if (currency === 'SOL') {
      return `${(amount / 1000000000).toFixed(4)} SOL`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'released': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'expired': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (!stats) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading escrow data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Escrow Wallet Management</h2>
          <p className="text-muted-foreground">
            Manage enterprise escrow contracts and withdraw profits
          </p>
        </div>
        <Badge variant="outline" className="flex items-center space-x-1">
          <Shield className="h-3 w-3" />
          <span>Enterprise Grade</span>
        </Badge>
      </div>

      {/* Status Alert */}
      {stats.contractStatus === 'not_configured' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Smart Contract Not Deployed</AlertTitle>
          <AlertDescription>
            The escrow smart contract needs to be deployed to mainnet for production use.
            Currently running on DevNet for testing.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Escrows</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEscrows}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeEscrows} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(stats.averageEscrowValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalEscrows > 0 
                ? Math.round((stats.releasedEscrows / stats.totalEscrows) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.releasedEscrows} released
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Fees</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalValue * 0.005)} {/* 0.5% fee */}
            </div>
            <p className="text-xs text-muted-foreground">
              0.5% escrow fees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create Escrow</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw Profits</TabsTrigger>
          <TabsTrigger value="contracts">Active Contracts</TabsTrigger>
          <TabsTrigger value="fees">Fee Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common escrow management tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Create New Escrow Contract
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Withdraw Accumulated Fees
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Monitor Active Contracts
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Setup Instructions</CardTitle>
                <CardDescription>
                  How to use the escrow system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Badge className="mt-0.5">1</Badge>
                  <div className="text-sm">
                    <p className="font-medium">Deploy Smart Contract</p>
                    <p className="text-muted-foreground">Deploy to Solana MainNet for production</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge className="mt-0.5">2</Badge>
                  <div className="text-sm">
                    <p className="font-medium">Create Escrow</p>
                    <p className="text-muted-foreground">Set amount, recipient, and timeout period</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge className="mt-0.5">3</Badge>
                  <div className="text-sm">
                    <p className="font-medium">Monitor & Release</p>
                    <p className="text-muted-foreground">Track contracts and release when conditions are met</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge className="mt-0.5">4</Badge>
                  <div className="text-sm">
                    <p className="font-medium">Withdraw Profits</p>
                    <p className="text-muted-foreground">Collect 0.5% fees from completed escrows</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Escrow Contract</CardTitle>
              <CardDescription>
                Set up a secure escrow for high-value transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Escrow Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1.0"
                    value={newContractData.amount}
                    onChange={(e) => setNewContractData(prev => ({
                      ...prev,
                      amount: e.target.value
                    }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Amount in SOL (minimum 0.001)
                  </p>
                </div>

                <div>
                  <Label htmlFor="timeout">Timeout (Hours)</Label>
                  <Select
                    value={newContractData.timeoutHours}
                    onValueChange={(value) => setNewContractData(prev => ({
                      ...prev,
                      timeoutHours: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 Hours</SelectItem>
                      <SelectItem value="48">48 Hours</SelectItem>
                      <SelectItem value="72">72 Hours (Recommended)</SelectItem>
                      <SelectItem value="168">1 Week</SelectItem>
                      <SelectItem value="720">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="Enter Solana wallet address (44 characters)"
                  value={newContractData.recipientAddress}
                  onChange={(e) => setNewContractData(prev => ({
                    ...prev,
                    recipientAddress: e.target.value
                  }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The wallet address that will receive funds when released
                </p>
              </div>

              <div>
                <Label htmlFor="escrowId">Contract ID (Optional)</Label>
                <Input
                  id="escrowId"
                  placeholder="Leave blank for auto-generated ID"
                  value={newContractData.escrowId}
                  onChange={(e) => setNewContractData(prev => ({
                    ...prev,
                    escrowId: e.target.value
                  }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Custom identifier for tracking purposes
                </p>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Security Notice</AlertTitle>
                <AlertDescription>
                  Funds will be locked in the smart contract until released by authority or timeout expires.
                  A 0.5% fee will be charged upon creation.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleCreateEscrow} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating Escrow...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Create Escrow Contract
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Profits</CardTitle>
              <CardDescription>
                Transfer accumulated escrow fees to another wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="withdrawAmount">Amount to Withdraw</Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    placeholder="0.1"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
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
                <Label htmlFor="withdrawAddress">Destination Address</Label>
                <Input
                  id="withdrawAddress"
                  placeholder="Enter destination wallet address"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your personal wallet address to receive the profits
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Available for Withdrawal</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Accumulated Fees (SOL):</span>
                    <span className="font-mono">{formatCurrency(stats.totalValue * 0.005)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Setup Fees:</span>
                    <span className="font-mono">${(stats.totalEscrows * 100).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Alert>
                <DollarSign className="h-4 w-4" />
                <AlertTitle>Withdrawal Policy</AlertTitle>
                <AlertDescription>
                  Only accumulated fees can be withdrawn. Escrowed funds remain locked until released or expired.
                  Minimum withdrawal: 0.01 SOL or equivalent.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleWithdrawProfits}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing Withdrawal...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Withdraw Profits
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Active Contracts</CardTitle>
              <CardDescription>
                Monitor and manage all escrow contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contracts.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No escrow contracts found</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first escrow contract to get started
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-mono text-sm">
                          {contract.id}
                        </TableCell>
                        <TableCell>{formatCurrency(contract.amount)}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {contract.recipientAddress.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(contract.status)}>
                            {contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(contract.expiresAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {contract.status === 'active' && (
                            <Button
                              size="sm"
                              onClick={() => handleReleaseEscrow(contract.id, contract.authorityAddress)}
                              disabled={loading}
                            >
                              Release
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sliders className="h-5 w-5" />
                <span>Fee Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure escrow deposit and withdrawal fees for each currency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feeConfigs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Currency</TableHead>
                        <TableHead>Deposit Fee</TableHead>
                        <TableHead>Withdrawal Fee</TableHead>
                        <TableHead>Min Fees</TableHead>
                        <TableHead>Max Fees</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feeConfigs.map((config) => (
                        <TableRow key={config.currency}>
                          <TableCell>
                            <Badge variant="outline">{config.currency}</Badge>
                          </TableCell>
                          <TableCell>{config.depositFeePercentage}%</TableCell>
                          <TableCell>{config.withdrawalFeePercentage}%</TableCell>
                          <TableCell>
                            {config.minimumDepositFee} / {config.minimumWithdrawalFee}
                          </TableCell>
                          <TableCell>
                            {config.maximumDepositFee} / {config.maximumWithdrawalFee}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openFeeEditDialog(config)}
                              disabled={loading}
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert>
                    <DollarSign className="h-4 w-4" />
                    <AlertTitle>No Fee Configurations Found</AlertTitle>
                    <AlertDescription>
                      Fee configurations will be automatically created when you process your first transactions.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fee Configuration Dialog */}
      {editingFeeConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Edit {editingFeeConfig.currency} Fees</CardTitle>
              <CardDescription>
                Update escrow fee configuration for {editingFeeConfig.currency}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="depositFeePercentage">Deposit Fee (%)</Label>
                  <Input
                    id="depositFeePercentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={editingFeeConfig.depositFeePercentage}
                    onChange={(e) => setEditingFeeConfig({
                      ...editingFeeConfig,
                      depositFeePercentage: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="withdrawalFeePercentage">Withdrawal Fee (%)</Label>
                  <Input
                    id="withdrawalFeePercentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={editingFeeConfig.withdrawalFeePercentage}
                    onChange={(e) => setEditingFeeConfig({
                      ...editingFeeConfig,
                      withdrawalFeePercentage: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minimumDepositFee">Min Deposit Fee</Label>
                  <Input
                    id="minimumDepositFee"
                    type="number"
                    step="0.000001"
                    min="0"
                    value={editingFeeConfig.minimumDepositFee}
                    onChange={(e) => setEditingFeeConfig({
                      ...editingFeeConfig,
                      minimumDepositFee: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="minimumWithdrawalFee">Min Withdrawal Fee</Label>
                  <Input
                    id="minimumWithdrawalFee"
                    type="number"
                    step="0.000001"
                    min="0"
                    value={editingFeeConfig.minimumWithdrawalFee}
                    onChange={(e) => setEditingFeeConfig({
                      ...editingFeeConfig,
                      minimumWithdrawalFee: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maximumDepositFee">Max Deposit Fee</Label>
                  <Input
                    id="maximumDepositFee"
                    type="number"
                    step="0.000001"
                    min="0"
                    value={editingFeeConfig.maximumDepositFee}
                    onChange={(e) => setEditingFeeConfig({
                      ...editingFeeConfig,
                      maximumDepositFee: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="maximumWithdrawalFee">Max Withdrawal Fee</Label>
                  <Input
                    id="maximumWithdrawalFee"
                    type="number"
                    step="0.000001"
                    min="0"
                    value={editingFeeConfig.maximumWithdrawalFee}
                    onChange={(e) => setEditingFeeConfig({
                      ...editingFeeConfig,
                      maximumWithdrawalFee: e.target.value
                    })}
                  />
                </div>
              </div>
            </CardContent>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsFeeDialogOpen(false);
                    setEditingFeeConfig(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpdateFeeConfig(editingFeeConfig)}
                  disabled={loading}
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}