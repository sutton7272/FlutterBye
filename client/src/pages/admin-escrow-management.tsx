import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

const transferProfitsSchema = z.object({
  fromWalletId: z.string().min(1, "Please select a wallet"),
  toAddress: z.string().min(32, "Valid Solana address required").max(44, "Invalid address length"),
  amount: z.number().min(0.001, "Minimum amount is 0.001").max(1000000, "Maximum amount is 1,000,000"),
  currency: z.enum(["SOL", "USDC", "FLBY"]).default("SOL"),
  memo: z.string().max(100, "Memo too long").optional(),
});

type WalletFormData = z.infer<typeof walletFormSchema>;
type EscrowFormData = z.infer<typeof escrowFormSchema>;
type TransferProfitsData = z.infer<typeof transferProfitsSchema>;

// Transfer Profits Form Component
function TransferProfitsForm({ wallets }: { wallets: any[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<TransferProfitsData>({
    resolver: zodResolver(transferProfitsSchema),
    defaultValues: {
      fromWalletId: "",
      toAddress: "",
      amount: 0,
      currency: "SOL",
      memo: "",
    },
  });

  const transferMutation = useMutation({
    mutationFn: async (data: TransferProfitsData) => {
      const response = await apiRequest("POST", "/api/escrow/transfer-profits", data);
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Transfer Successful",
        description: `Transferred ${form.getValues().amount} ${form.getValues().currency} successfully`,
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/escrow/wallets'] });
    },
    onError: (error: any) => {
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer profits",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TransferProfitsData) => {
    transferMutation.mutate(data);
  };

  const selectedWallet = wallets.find(w => w.id === form.watch("fromWalletId"));

  return (
    <div className="space-y-6">
      {/* Wallet Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="bg-slate-700 border-slate-600">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">{wallet.name}</p>
                  <p className="text-lg font-semibold text-white">
                    {wallet.solBalance.toFixed(4)} SOL
                  </p>
                  <p className="text-sm text-slate-400">
                    ${(wallet.solBalance * 150).toFixed(2)} USD
                  </p>
                </div>
                <Badge 
                  variant={wallet.type === 'escrow' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {wallet.type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transfer Form */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Transfer Platform Profits</CardTitle>
          <CardDescription className="text-slate-400">
            Securely transfer accumulated profits from platform wallets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromWalletId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Source Wallet</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select wallet" />
                          </SelectTrigger>
                          <SelectContent>
                            {wallets.map((wallet) => (
                              <SelectItem key={wallet.id} value={wallet.id}>
                                {wallet.name} ({wallet.solBalance.toFixed(4)} SOL)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
              </div>

              <FormField
                control={form.control}
                name="toAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Destination Address</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Enter Solana wallet address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.001"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="0.000"
                        />
                      </FormControl>
                      <FormMessage />
                      {selectedWallet && (
                        <p className="text-xs text-slate-400">
                          Available: {selectedWallet.solBalance.toFixed(4)} {form.watch("currency")}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="memo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Memo (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Transaction memo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Transaction Summary */}
              {form.watch("amount") > 0 && selectedWallet && (
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                  <h4 className="text-white font-medium">Transaction Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Amount:</span>
                      <span className="text-white ml-2">{form.watch("amount")} {form.watch("currency")}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">USD Value:</span>
                      <span className="text-white ml-2">${(form.watch("amount") * 150).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Network Fee:</span>
                      <span className="text-white ml-2">~0.000005 SOL</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Remaining Balance:</span>
                      <span className="text-white ml-2">
                        {(selectedWallet.solBalance - form.watch("amount")).toFixed(4)} {form.watch("currency")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={transferMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {transferMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processing Transfer...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Transfer Profits
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Wallet Management Tab Component
function WalletManagementTab({ wallets, isLoading, onCreateWallet }: any) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Platform Wallets</h2>
        <Button onClick={onCreateWallet} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Wallet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet: any) => (
          <Card key={wallet.id} className="bg-slate-800 border-slate-600">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-lg">{wallet.name}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {wallet.type.replace('_', ' ').toUpperCase()}
                  </CardDescription>
                </div>
                <Badge variant={wallet.network === 'mainnet' ? 'default' : 'secondary'}>
                  {wallet.network}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">Balance</p>
                  <p className="text-white font-semibold">{wallet.solBalance.toFixed(4)} SOL</p>
                  <p className="text-slate-500 text-xs">${(wallet.solBalance * 150).toFixed(2)} USD</p>
                </div>
                
                <div>
                  <p className="text-slate-400 text-sm">Address</p>
                  <p className="text-white text-xs font-mono break-all">
                    {wallet.address}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Fund
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Active Escrows Tab Component
function ActiveEscrowsTab({ contracts, isLoading }: any) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const activeContracts = contracts.filter((c: any) => c.status === 'active');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Active Escrow Contracts</h2>
      
      {activeContracts.length === 0 ? (
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="text-center py-12">
            <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No active escrow contracts</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeContracts.map((contract: any) => (
            <Card key={contract.id} className="bg-slate-800 border-slate-600">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{contract.description}</CardTitle>
                    <CardDescription className="text-slate-400">
                      Contract #{contract.id.slice(0, 8)}...
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Amount</p>
                      <p className="text-white font-semibold">{contract.amount} {contract.currency}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Timeout</p>
                      <p className="text-white">{Math.round(contract.timeoutDuration / 3600)}h</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm">Payer</p>
                    <p className="text-white text-xs font-mono">{contract.payerAddress.slice(0, 20)}...</p>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm">Payee</p>
                    <p className="text-white text-xs font-mono">{contract.payeeAddress.slice(0, 20)}...</p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Release
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <XCircle className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Create New Tab Component
function CreateNewTab({ onCreateEscrow }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Create New Escrow</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Standard Escrow</CardTitle>
            <CardDescription className="text-slate-400">
              Create a standard escrow contract with timeout protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onCreateEscrow} className="w-full bg-blue-600 hover:bg-blue-700">
              <Shield className="w-4 h-4 mr-2" />
              Create Standard Escrow
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Multi-Signature Escrow</CardTitle>
            <CardDescription className="text-slate-400">
              Create an escrow requiring multiple signatures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
              <Shield className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Expired Escrows Tab Component
function ExpiredEscrowsTab({ contracts }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Expired Escrow Contracts</h2>
      
      {contracts.length === 0 ? (
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="text-center py-12">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No expired escrow contracts</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {contracts.map((contract: any) => (
            <Card key={contract.id} className="bg-slate-800 border-slate-600">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold">{contract.description}</h3>
                    <p className="text-slate-400 text-sm">#{contract.id.slice(0, 8)}...</p>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400">Expired</Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-white">{contract.amount} {contract.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expired:</span>
                    <span className="text-white">{new Date(contract.expiredAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="w-full mt-4">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Recover Funds
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Create Escrow Modal Component
function CreateEscrowModal({ open, onOpenChange, onEscrowCreated }: any) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

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

  const onSubmit = async (data: EscrowFormData) => {
    setIsCreating(true);
    try {
      await onEscrowCreated(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating escrow:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-white">Create Escrow Contract</DialogTitle>
          <DialogDescription className="text-slate-400">
            Set up a new smart contract escrow
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="Enter contract description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.001"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-slate-700 border-slate-600 text-white"
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
            </div>

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
                      placeholder="Enter payer Solana address"
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
                      placeholder="Enter payee Solana address"
                    />
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
                  <FormLabel className="text-white">Timeout (seconds)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 86400)}
                      className="bg-slate-700 border-slate-600 text-white"
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isCreating ? (
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
      </DialogContent>
    </Dialog>
  );
}

// Create Wallet Modal Component
function CreateWalletModal({ open, onOpenChange, onWalletCreated }: any) {
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

// Main Dashboard Component
function EscrowManagementDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("wallets");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showEscrowModal, setShowEscrowModal] = useState(false);

  // Fetch platform wallets
  const { data: wallets = [], isLoading: walletsLoading } = useQuery({
    queryKey: ["/api/admin/platform-wallets"],
  });

  // Fetch escrow contracts
  const { data: escrowContracts = [], isLoading: escrowLoading } = useQuery({
    queryKey: ["/api/escrow/contracts"],
  });

  const handleWalletCreated = async (walletData: any) => {
    try {
      await apiRequest("POST", "/api/admin/platform-wallets", walletData);
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/platform-wallets"] });
      
      toast({
        title: "Wallet Created",
        description: `${walletData.name} wallet created successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create wallet",
        variant: "destructive",
      });
    }
  };

  const handleEscrowCreated = async (escrowData: any) => {
    try {
      await apiRequest("POST", "/api/escrow/contracts", escrowData);
      
      queryClient.invalidateQueries({ queryKey: ["/api/escrow/contracts"] });
      
      toast({
        title: "Escrow Created",
        description: "Escrow contract created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create escrow",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Enterprise Escrow Management
          </h1>
          <p className="text-slate-400">
            Complete smart contract escrow system for high-value transactions ($200K-$2M)
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-slate-600">
            <TabsTrigger value="wallets" className="text-white">
              <Wallet className="w-4 h-4 mr-2" />
              Platform Wallets
            </TabsTrigger>
            <TabsTrigger value="active" className="text-white">
              <Shield className="w-4 h-4 mr-2" />
              Active Escrows
            </TabsTrigger>
            <TabsTrigger value="create" className="text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </TabsTrigger>
            <TabsTrigger value="transfer" className="text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Transfer Profits
            </TabsTrigger>
            <TabsTrigger value="expired" className="text-white">
              <Clock className="w-4 h-4 mr-2" />
              Expired
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallets">
            <WalletManagementTab
              wallets={wallets}
              isLoading={walletsLoading}
              onCreateWallet={() => setShowWalletModal(true)}
            />
          </TabsContent>

          <TabsContent value="active">
            <ActiveEscrowsTab contracts={escrowContracts} isLoading={escrowLoading} />
          </TabsContent>

          <TabsContent value="create">
            <CreateNewTab onCreateEscrow={() => setShowEscrowModal(true)} />
          </TabsContent>

          <TabsContent value="transfer">
            <TransferProfitsForm wallets={wallets} />
          </TabsContent>

          <TabsContent value="expired">
            <ExpiredEscrowsTab contracts={(escrowContracts as any[]).filter((c: any) => c.status === 'expired')} />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <CreateWalletModal
          open={showWalletModal}
          onOpenChange={setShowWalletModal}
          onWalletCreated={handleWalletCreated}
        />

        <CreateEscrowModal
          open={showEscrowModal}
          onOpenChange={setShowEscrowModal}
          onEscrowCreated={handleEscrowCreated}
        />
      </div>
    </div>
  );
}

export default EscrowManagementDashboard;