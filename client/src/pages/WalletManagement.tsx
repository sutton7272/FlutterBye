import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet, 
  Shield, 
  Plus, 
  Monitor, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowDownToLine
} from "lucide-react";
import Navbar from "@/components/navbar";

interface EscrowContract {
  id: string;
  contractAddress: string;
  clientId: string;
  amount: number;
  currency: string;
  status: 'active' | 'completed' | 'pending';
  createdAt: string;
  expiryDate?: string;
  description?: string;
}

interface CustodialWallet {
  id: string;
  walletAddress: string;
  userId?: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'pending';
  createdAt: string;
  lastTransaction?: string;
}

export default function WalletManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [newEscrowAmount, setNewEscrowAmount] = useState("");
  const [newEscrowDescription, setNewEscrowDescription] = useState("");
  const [newWalletUserId, setNewWalletUserId] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch escrow contracts
  const { data: escrowData, isLoading: escrowLoading } = useQuery({
    queryKey: ["/api/escrow/contracts"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/escrow/contracts");
      return response.json();
    }
  });

  // Fetch custodial wallets
  const { data: custodialData, isLoading: custodialLoading } = useQuery({
    queryKey: ["/api/custodial/wallets"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/custodial/wallets");
      return response.json();
    }
  });

  // Create escrow contract mutation
  const createEscrowMutation = useMutation({
    mutationFn: (data: { amount: number; description: string }) =>
      apiRequest("/api/escrow/contracts", "POST", data),
    onSuccess: () => {
      toast({
        title: "Escrow Contract Created",
        description: "New escrow contract has been successfully created",
      });
      setNewEscrowAmount("");
      setNewEscrowDescription("");
      queryClient.invalidateQueries({ queryKey: ["/api/escrow/contracts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create escrow contract",
        variant: "destructive",
      });
    },
  });

  // Create custodial wallet mutation
  const createCustodialMutation = useMutation({
    mutationFn: (data: { userId?: string }) =>
      apiRequest("/api/custodial/wallets", "POST", data),
    onSuccess: () => {
      toast({
        title: "Custodial Wallet Created",
        description: "New custodial wallet has been successfully created",
      });
      setNewWalletUserId("");
      queryClient.invalidateQueries({ queryKey: ["/api/custodial/wallets"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create custodial wallet",
        variant: "destructive",
      });
    },
  });

  const escrowContracts: EscrowContract[] = escrowData?.contracts || [];
  const custodialWallets: CustodialWallet[] = custodialData?.wallets || [];

  // Calculate overview stats
  const totalEscrowValue = escrowContracts.reduce((sum, contract) => sum + contract.amount, 0);
  const totalCustodialBalance = custodialWallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const activeContracts = escrowContracts.filter(c => c.status === 'active').length;
  const activeWallets = custodialWallets.filter(w => w.status === 'active').length;

  const handleCreateEscrow = () => {
    const amount = parseFloat(newEscrowAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    createEscrowMutation.mutate({ amount, description: newEscrowDescription });
  };

  const handleCreateCustodial = () => {
    createCustodialMutation.mutate({ userId: newWalletUserId || undefined });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'completed': return 'bg-blue-600';
      case 'pending': return 'bg-yellow-600';
      case 'frozen': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'frozen': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Wallet className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Wallet Management</h1>
              <p className="text-slate-300">
                Comprehensive wallet system with enterprise escrow contracts and secure custodial services
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                Overview
              </TabsTrigger>
              <TabsTrigger value="escrow" className="data-[state=active]:bg-blue-600">
                Escrow Contracts
              </TabsTrigger>
              <TabsTrigger value="custodial" className="data-[state=active]:bg-blue-600">
                Custodial Wallets
              </TabsTrigger>
              <TabsTrigger value="management" className="data-[state=active]:bg-blue-600">
                Create & Manage
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Total Escrow Value</p>
                        <p className="text-2xl font-bold text-green-400">
                          ${totalEscrowValue.toLocaleString()}
                        </p>
                      </div>
                      <Shield className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Custodial Balance</p>
                        <p className="text-2xl font-bold text-blue-400">
                          ${totalCustodialBalance.toLocaleString()}
                        </p>
                      </div>
                      <Wallet className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Active Contracts</p>
                        <p className="text-2xl font-bold">{activeContracts}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Active Wallets</p>
                        <p className="text-2xl font-bold">{activeWallets}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common wallet management tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => setActiveTab("management")}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      data-testid="button-create-escrow"
                    >
                      <Shield className="h-4 w-4" />
                      Create Escrow Contract
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("management")}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      data-testid="button-create-custodial"
                    >
                      <Wallet className="h-4 w-4" />
                      Create Custodial Wallet
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      data-testid="button-view-reports"
                    >
                      <TrendingUp className="h-4 w-4" />
                      View Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Escrow Contracts Tab */}
            <TabsContent value="escrow" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Escrow Contracts
                  </CardTitle>
                  <CardDescription>
                    Enterprise escrow contracts with automated profit withdrawal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {escrowLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                      <p className="mt-2">Loading contracts...</p>
                    </div>
                  ) : escrowContracts.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400">No escrow contracts found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {escrowContracts.map((contract) => {
                        const StatusIcon = getStatusIcon(contract.status);
                        return (
                          <div 
                            key={contract.id} 
                            className="p-4 bg-slate-700 rounded-lg border border-slate-600"
                            data-testid={`escrow-contract-${contract.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <StatusIcon className="h-5 w-5 text-green-400" />
                                <div>
                                  <p className="font-medium">
                                    Contract {contract.contractAddress.slice(0, 8)}...
                                  </p>
                                  <p className="text-sm text-slate-400">
                                    {contract.description || 'No description'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-400">
                                  ${contract.amount.toLocaleString()} {contract.currency}
                                </p>
                                <Badge className={`${getStatusColor(contract.status)} text-white`}>
                                  {contract.status.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custodial Wallets Tab */}
            <TabsContent value="custodial" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Custodial Wallets
                  </CardTitle>
                  <CardDescription>
                    Secure custodial wallet system for user value-attachment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {custodialLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                      <p className="mt-2">Loading wallets...</p>
                    </div>
                  ) : custodialWallets.length === 0 ? (
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400">No custodial wallets found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {custodialWallets.map((wallet) => {
                        const StatusIcon = getStatusIcon(wallet.status);
                        return (
                          <div 
                            key={wallet.id} 
                            className="p-4 bg-slate-700 rounded-lg border border-slate-600"
                            data-testid={`custodial-wallet-${wallet.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <StatusIcon className="h-5 w-5 text-blue-400" />
                                <div>
                                  <p className="font-medium">
                                    {wallet.walletAddress.slice(0, 8)}...{wallet.walletAddress.slice(-6)}
                                  </p>
                                  <p className="text-sm text-slate-400">
                                    {wallet.userId ? `User: ${wallet.userId}` : 'Unassigned'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-blue-400">
                                  ${wallet.balance.toLocaleString()} {wallet.currency}
                                </p>
                                <Badge className={`${getStatusColor(wallet.status)} text-white`}>
                                  {wallet.status.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create & Manage Tab */}
            <TabsContent value="management" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create Escrow Contract */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Create Escrow Contract
                    </CardTitle>
                    <CardDescription>
                      Set up a new enterprise escrow contract
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Contract Amount (USD)</label>
                      <Input
                        type="number"
                        placeholder="Enter contract amount..."
                        value={newEscrowAmount}
                        onChange={(e) => setNewEscrowAmount(e.target.value)}
                        className="bg-slate-700 border-slate-600"
                        data-testid="input-escrow-amount"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        placeholder="Enter contract description..."
                        value={newEscrowDescription}
                        onChange={(e) => setNewEscrowDescription(e.target.value)}
                        className="bg-slate-700 border-slate-600"
                        data-testid="textarea-escrow-description"
                      />
                    </div>
                    <Button 
                      onClick={handleCreateEscrow}
                      disabled={createEscrowMutation.isPending || !newEscrowAmount}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      data-testid="button-submit-escrow"
                    >
                      {createEscrowMutation.isPending ? "Creating..." : "Create Escrow Contract"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Create Custodial Wallet */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Create Custodial Wallet
                    </CardTitle>
                    <CardDescription>
                      Generate a new secure custodial wallet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">User ID (Optional)</label>
                      <Input
                        placeholder="Enter user ID or leave blank..."
                        value={newWalletUserId}
                        onChange={(e) => setNewWalletUserId(e.target.value)}
                        className="bg-slate-700 border-slate-600"
                        data-testid="input-wallet-user-id"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Leave blank to create an unassigned wallet
                      </p>
                    </div>
                    <Button 
                      onClick={handleCreateCustodial}
                      disabled={createCustodialMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700"
                      data-testid="button-submit-custodial"
                    >
                      {createCustodialMutation.isPending ? "Creating..." : "Create Custodial Wallet"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}