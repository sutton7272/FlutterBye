import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Key, Shield, DollarSign, RefreshCw, Eye, EyeOff, Copy } from "lucide-react";

export function WalletManagementPage() {
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newPrivateKey, setNewPrivateKey] = useState("");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch active escrow wallet
  const { data: activeWallet } = useQuery({
    queryKey: ["/api/escrow-wallets/active"],
  });

  // Fetch all escrow wallets (admin only)
  const { data: allWallets } = useQuery({
    queryKey: ["/api/admin/escrow-wallets"],
  });

  // Create new escrow wallet mutation
  const createWalletMutation = useMutation({
    mutationFn: async (data: { walletAddress: string; privateKey: string }) => {
      const response = await fetch("/api/escrow-wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create wallet");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Escrow Wallet Created", description: "New escrow wallet created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/escrow-wallets/active"] });
      setNewWalletAddress("");
      setNewPrivateKey("");
    },
    onError: (error) => {
      toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
    },
  });

  // Update wallet balance mutation
  const updateBalanceMutation = useMutation({
    mutationFn: async (data: { walletId: string; balance: string }) => {
      const response = await fetch(`/api/escrow-wallets/${data.walletId}/balance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: data.balance }),
      });
      if (!response.ok) throw new Error("Failed to update balance");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Balance Updated", description: "Wallet balance updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/escrow-wallets/active"] });
      setNewBalance("");
    },
    onError: (error) => {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    },
  });

  const handleCreateWallet = () => {
    if (!newWalletAddress || !newPrivateKey) {
      toast({
        title: "Missing Information",
        description: "Please enter both wallet address and private key",
        variant: "destructive",
      });
      return;
    }
    createWalletMutation.mutate({ walletAddress: newWalletAddress, privateKey: newPrivateKey });
  };

  const handleUpdateBalance = () => {
    if (!selectedWalletId || !newBalance) {
      toast({
        title: "Missing Information",
        description: "Please select a wallet and enter a balance",
        variant: "destructive",
      });
      return;
    }
    updateBalanceMutation.mutate({ walletId: selectedWalletId, balance: newBalance });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Copied to clipboard" });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const maskPrivateKey = (key: string) => {
    return showPrivateKeys ? key : "*".repeat(32);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Wallet Management</h1>
          <p className="text-xl text-purple-200">
            Manage escrow wallets and payment processing for Flutterbye
          </p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active Wallet</TabsTrigger>
            <TabsTrigger value="create">Create Wallet</TabsTrigger>
            <TabsTrigger value="manage">Manage Balances</TabsTrigger>
            <TabsTrigger value="all">All Wallets</TabsTrigger>
          </TabsList>

          {/* Active Escrow Wallet */}
          <TabsContent value="active">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet className="h-6 w-6" />
                  Active Escrow Wallet
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Primary wallet for handling escrowed value and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeWallet ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Wallet Address</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={activeWallet.walletAddress}
                            readOnly
                            className="bg-white/10 border-white/20 text-white font-mono"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(activeWallet.walletAddress)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Total Balance</Label>
                        <div className="text-2xl font-bold text-green-300">
                          {activeWallet.totalBalance} SOL
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Private Key</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowPrivateKeys(!showPrivateKeys)}
                        >
                          {showPrivateKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={maskPrivateKey(activeWallet.privateKey)}
                          readOnly
                          type={showPrivateKeys ? "text" : "password"}
                          className="bg-white/10 border-white/20 text-white font-mono"
                        />
                        {showPrivateKeys && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(activeWallet.privateKey)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        <Shield className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                      <span className="text-sm text-gray-300">
                        Created: {new Date(activeWallet.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-purple-200">
                    No active escrow wallet found. Create one to start processing payments.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create New Wallet */}
          <TabsContent value="create">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="h-6 w-6" />
                  Create Escrow Wallet
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Add a new Solana wallet for escrow and payment processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet-address" className="text-white">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    placeholder="Enter Solana wallet address"
                    value={newWalletAddress}
                    onChange={(e) => setNewWalletAddress(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="private-key" className="text-white">Private Key</Label>
                  <Input
                    id="private-key"
                    type="password"
                    placeholder="Enter private key (will be encrypted)"
                    value={newPrivateKey}
                    onChange={(e) => setNewPrivateKey(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                  <p className="text-yellow-200 text-sm">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Private keys are encrypted and stored securely. Only use wallets dedicated to escrow operations.
                  </p>
                </div>

                <Button 
                  onClick={handleCreateWallet}
                  disabled={createWalletMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {createWalletMutation.isPending ? "Creating..." : "Create Escrow Wallet"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Balances */}
          <TabsContent value="manage">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  Update Wallet Balance
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Manually update wallet balances after blockchain transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet-select" className="text-white">Select Wallet</Label>
                  <select
                    id="wallet-select"
                    value={selectedWalletId}
                    onChange={(e) => setSelectedWalletId(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                  >
                    <option value="">Select a wallet</option>
                    {activeWallet && (
                      <option value={activeWallet.id}>
                        {formatAddress(activeWallet.walletAddress)} (Active)
                      </option>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-balance" className="text-white">New Balance (SOL)</Label>
                  <Input
                    id="new-balance"
                    type="number"
                    step="0.000000001"
                    placeholder="0.000000000"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <Button 
                  onClick={handleUpdateBalance}
                  disabled={updateBalanceMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {updateBalanceMutation.isPending ? "Updating..." : "Update Balance"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Wallets */}
          <TabsContent value="all">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">All Escrow Wallets</CardTitle>
                <CardDescription className="text-purple-200">
                  Complete list of escrow wallets in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeWallet ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white">Address</TableHead>
                        <TableHead className="text-white">Balance</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="text-white">Created</TableHead>
                        <TableHead className="text-white">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-white font-mono">
                          {formatAddress(activeWallet.walletAddress)}
                        </TableCell>
                        <TableCell className="text-green-300 font-semibold">
                          {activeWallet.totalBalance} SOL
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-600 text-white">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(activeWallet.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(activeWallet.walletAddress)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-purple-200">
                    No escrow wallets configured
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Access Panel */}
        <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border-white/20">
          <CardContent className="py-6">
            <h2 className="text-xl font-bold text-white mb-4">Payment & Escrow Access</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">
                  {activeWallet?.totalBalance || "0"} SOL
                </div>
                <div className="text-sm text-gray-300">Available Balance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-300">Encrypted</div>
                <div className="text-sm text-gray-300">Private Key Security</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-300">Ready</div>
                <div className="text-sm text-gray-300">Payment Processing</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}