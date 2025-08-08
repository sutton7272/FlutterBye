import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Icons
import { 
  Wallet, 
  Plus, 
  Clock, 
  Shield, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff
} from "lucide-react";

// Form schemas
const walletFormSchema = z.object({
  mode: z.enum(["dev", "production"]),
  name: z.string().min(1, "Wallet name is required"),
  type: z.enum(["gas_funding", "fee_collection", "escrow", "admin"]),
});

const escrowFormSchema = z.object({
  payerAddress: z.string().min(32, "Valid Solana address required"),
  payeeAddress: z.string().min(32, "Valid Solana address required"),
  amount: z.number().min(0.001, "Minimum amount is 0.001 SOL"),
  currency: z.enum(["SOL", "USDC", "FLBY"]).default("SOL"),
  timeoutDuration: z.number().min(3600, "Minimum timeout is 1 hour").default(86400),
  description: z.string().min(1, "Description is required"),
});

type WalletFormData = z.infer<typeof walletFormSchema>;
type EscrowFormData = z.infer<typeof escrowFormSchema>;

function AdminUnifiedDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("platform-wallets");
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState<string | null>(null);

  // Fetch platform wallets
  const { data: wallets = [], isLoading: walletsLoading } = useQuery({
    queryKey: ["/api/admin/platform-wallets"],
    retry: false,
  });

  // Fetch escrow contracts
  const { data: escrowContracts = [], isLoading: escrowLoading } = useQuery({
    queryKey: ["/api/escrow/contracts"],
    retry: false,
  });

  // Create platform wallet mutation
  const createWalletMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/platform-wallets", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/platform-wallets"] });
      toast({
        title: "Wallet Created Successfully!",
        description: "Platform wallet is ready for use",
      });
      setShowCreateWallet(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create wallet. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create escrow mutation
  const createEscrowMutation = useMutation({
    mutationFn: async (data: EscrowFormData) => {
      const response = await apiRequest("POST", "/api/escrow/create", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/escrow/contracts"] });
      toast({
        title: "Escrow Created Successfully!",
        description: "Escrow contract has been deployed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create escrow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const activeContracts = escrowContracts.filter((contract: any) => 
    contract.status === 'active' || contract.status === 'funded'
  );
  
  const expiredContracts = escrowContracts.filter((contract: any) => 
    contract.status === 'expired' || contract.status === 'timeout'
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Enterprise Escrow Management
          </h1>
          <p className="text-slate-400">
            Comprehensive platform for managing high-value escrow contracts ($200K-$2M)
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-600">
            <TabsTrigger value="platform-wallets" className="text-white">
              <Wallet className="w-4 h-4 mr-2" />
              Platform Wallets
            </TabsTrigger>
            <TabsTrigger value="active-escrows" className="text-white">
              <Shield className="w-4 h-4 mr-2" />
              Active Escrows
            </TabsTrigger>
            <TabsTrigger value="create-escrow" className="text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </TabsTrigger>
            <TabsTrigger value="expired-escrows" className="text-white">
              <Clock className="w-4 h-4 mr-2" />
              Expired
            </TabsTrigger>
          </TabsList>

          {/* Platform Wallets Tab */}
          <TabsContent value="platform-wallets">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Platform Wallets</CardTitle>
                    <CardDescription className="text-slate-400">
                      Manage platform operational wallets
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowCreateWallet(true)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Wallet
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {walletsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading wallets...</p>
                  </div>
                ) : wallets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wallets.map((wallet: any) => (
                      <Card key={wallet.id} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-blue-500/20 text-blue-400">
                                {wallet.type?.replace('_', ' ') || 'platform'}
                              </Badge>
                              <div className={`w-2 h-2 rounded-full ${wallet.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{wallet.name}</p>
                              <p className="text-xs text-slate-400 font-mono">
                                {wallet.address ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-8)}` : 'No address'}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-500">
                                Balance: {wallet.balance || '0'} SOL
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowPrivateKey(wallet.id)}
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wallet className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg mb-2">No Platform Wallets</p>
                    <p className="text-slate-500">Create your first platform wallet to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Escrows Tab */}
          <TabsContent value="active-escrows">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Active Escrow Contracts</CardTitle>
                <CardDescription className="text-slate-400">
                  Monitor and manage active escrow transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {escrowLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading escrow contracts...</p>
                  </div>
                ) : activeContracts.length > 0 ? (
                  <div className="space-y-4">
                    {activeContracts.map((contract: any) => (
                      <Card key={contract.id} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-slate-400">Amount</p>
                              <p className="text-white font-semibold">
                                {contract.amount} {contract.currency}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">Status</p>
                              <Badge className="bg-green-500/20 text-green-400">
                                {contract.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">Created</p>
                              <p className="text-white text-sm">
                                {new Date(contract.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">Actions</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-xs">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg mb-2">No Active Escrows</p>
                    <p className="text-slate-500">Active escrow contracts will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Escrow Tab */}
          <TabsContent value="create-escrow">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Create New Escrow Contract</CardTitle>
                <CardDescription className="text-slate-400">
                  Set up a new enterprise escrow contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EscrowCreateForm 
                  onSubmit={createEscrowMutation.mutate}
                  isLoading={createEscrowMutation.isPending}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expired Escrows Tab */}
          <TabsContent value="expired-escrows">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Expired Escrow Contracts</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage expired and timed-out escrow contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {expiredContracts.length > 0 ? (
                  <div className="space-y-4">
                    {expiredContracts.map((contract: any) => (
                      <Card key={contract.id} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-slate-400">Amount</p>
                              <p className="text-white font-semibold">
                                {contract.amount} {contract.currency}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">Status</p>
                              <Badge className="bg-red-500/20 text-red-400">
                                {contract.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">Expired</p>
                              <p className="text-white text-sm">
                                {new Date(contract.timeoutAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">Actions</p>
                              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs">
                                Claim Funds
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg mb-2">No Expired Escrows</p>
                    <p className="text-slate-500">All escrow contracts are within their active timeframe</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Wallet Creation Modal */}
        <WalletCreationModal 
          open={showCreateWallet} 
          onOpenChange={setShowCreateWallet}
          onWalletCreated={createWalletMutation.mutate}
        />
      </div>
    </div>
  );
}

// Escrow Creation Form Component
function EscrowCreateForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: EscrowFormData) => void;
  isLoading: boolean;
}) {
  const form = useForm<EscrowFormData>({
    resolver: zodResolver(escrowFormSchema),
    defaultValues: {
      payerAddress: "",
      payeeAddress: "",
      amount: 0,
      currency: "SOL",
      timeoutDuration: 86400,
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="payerAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Payer Address</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Solana address of the payer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payeeAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Payee Address</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Solana address of the payee"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Amount</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number"
                    step="0.001"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="0.000"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Currency</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOL">SOL</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="FLBY">FLBY</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeoutDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Timeout Duration (seconds)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="86400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Description</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Contract description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Create Escrow
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Wallet Creation Modal Component
function WalletCreationModal({ 
  open, 
  onOpenChange, 
  onWalletCreated 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onWalletCreated: (data: any) => void;
}) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<WalletFormData>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: {
      mode: "dev",
      name: "",
      type: "gas_funding",
    },
  });

  const onSubmit = async (data: WalletFormData) => {
    setIsCreating(true);
    try {
      const walletData = {
        name: data.name,
        type: data.type,
        network: data.mode === "dev" ? "devnet" : "mainnet",
      };

      await onWalletCreated(walletData);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating wallet:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-white">Create Platform Wallet</DialogTitle>
          <DialogDescription className="text-slate-400">
            Set up a new wallet for platform operations
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Mode</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dev" id="dev" />
                        <Label htmlFor="dev" className="text-slate-300">Development</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="production" id="production" />
                        <Label htmlFor="production" className="text-slate-300">Production</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Wallet Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gas_funding">Gas Funding</SelectItem>
                        <SelectItem value="fee_collection">Fee Collection</SelectItem>
                        <SelectItem value="escrow">Escrow</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Wallet Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter wallet name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Wallet
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminUnifiedDashboard;