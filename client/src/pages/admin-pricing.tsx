import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, DollarSign, TrendingDown } from "lucide-react";

interface PricingTier {
  id: string;
  tierName: string;
  minQuantity: number;
  maxQuantity: number | null;
  basePricePerToken: string;
  discountPercentage: string;
  finalPricePerToken: string;
  currency: string;
  gasFeeIncluded: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface PriceCalculation {
  pricePerToken: number;
  totalPrice: number;
  tier: PricingTier | null;
  currency: string;
}

export default function AdminPricing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);
  const [calculationQuantity, setCalculationQuantity] = useState<number>(1);

  // Fetch pricing tiers
  const { data: tiersData, isLoading: tiersLoading } = useQuery({
    queryKey: ["/api/admin/pricing-tiers"],
  });

  // Price calculation
  const { data: priceCalculation, refetch: refetchPrice } = useQuery<PriceCalculation>({
    queryKey: ["/api/calculate-token-price", calculationQuantity],
    queryFn: async () => {
      const response = await apiRequest("/api/calculate-token-price", {
        method: "POST",
        body: JSON.stringify({ quantity: calculationQuantity }),
        headers: { "Content-Type": "application/json" }
      });
      return response;
    },
    enabled: calculationQuantity > 0
  });

  // Create tier mutation
  const createTierMutation = useMutation({
    mutationFn: async (tierData: any) => {
      return await apiRequest("/api/admin/pricing-tiers", {
        method: "POST",
        body: JSON.stringify(tierData),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pricing-tiers"] });
      setIsCreateDialogOpen(false);
      toast({ title: "Success", description: "Pricing tier created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Update tier mutation
  const updateTierMutation = useMutation({
    mutationFn: async ({ tierId, ...updateData }: any) => {
      return await apiRequest(`/api/admin/pricing-tiers/${tierId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pricing-tiers"] });
      setIsEditDialogOpen(false);
      setEditingTier(null);
      toast({ title: "Success", description: "Pricing tier updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Delete tier mutation
  const deleteTierMutation = useMutation({
    mutationFn: async (tierId: string) => {
      return await apiRequest(`/api/admin/pricing-tiers/${tierId}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pricing-tiers"] });
      toast({ title: "Success", description: "Pricing tier deactivated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleCreateTier = (formData: FormData) => {
    const tierData = {
      tierName: formData.get("tierName"),
      minQuantity: parseInt(formData.get("minQuantity") as string),
      maxQuantity: formData.get("maxQuantity") ? parseInt(formData.get("maxQuantity") as string) : null,
      basePricePerToken: formData.get("basePricePerToken"),
      discountPercentage: formData.get("discountPercentage"),
      currency: formData.get("currency") || "USD",
      gasFeeIncluded: formData.get("gasFeeIncluded") === "on",
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0
    };
    createTierMutation.mutate(tierData);
  };

  const handleEditTier = (formData: FormData) => {
    if (!editingTier) return;
    
    const updateData = {
      tierId: editingTier.id,
      tierName: formData.get("tierName"),
      minQuantity: parseInt(formData.get("minQuantity") as string),
      maxQuantity: formData.get("maxQuantity") ? parseInt(formData.get("maxQuantity") as string) : null,
      basePricePerToken: formData.get("basePricePerToken"),
      discountPercentage: formData.get("discountPercentage"),
      currency: formData.get("currency") || "USD",
      gasFeeIncluded: formData.get("gasFeeIncluded") === "on",
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0
    };
    updateTierMutation.mutate(updateData);
  };

  const tiers = tiersData?.tiers || [];

  // Update price calculation when quantity changes
  useEffect(() => {
    if (calculationQuantity > 0) {
      refetchPrice();
    }
  }, [calculationQuantity, refetchPrice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Dynamic Pricing Management</h1>
          <p className="text-blue-300 text-lg">
            Configure token pricing tiers with volume-based discounts
          </p>
        </div>

        {/* Price Calculator */}
        <Card className="bg-slate-800/50 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Price Calculator
            </CardTitle>
            <CardDescription className="text-blue-300">
              Test pricing calculations across different quantities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="quantity" className="text-white">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={calculationQuantity}
                  onChange={(e) => setCalculationQuantity(parseInt(e.target.value) || 1)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              {priceCalculation && (
                <div className="flex-2 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-blue-300 text-sm">Price per Token</p>
                    <p className="text-white text-xl font-bold">
                      ${priceCalculation.pricePerToken.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-300 text-sm">Total Price</p>
                    <p className="text-white text-xl font-bold">
                      ${priceCalculation.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {priceCalculation?.tier && (
              <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
                <p className="text-blue-200">
                  <strong>Active Tier:</strong> {priceCalculation.tier.tierName} 
                  {priceCalculation.tier.discountPercentage !== "0" && (
                    <Badge variant="secondary" className="ml-2">
                      {priceCalculation.tier.discountPercentage}% off
                    </Badge>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Tiers */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Pricing Tiers</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Tier
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-600">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Pricing Tier</DialogTitle>
                <DialogDescription className="text-slate-300">
                  Add a new pricing tier with quantity-based discounts
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateTier(new FormData(e.currentTarget)); }}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tierName" className="text-white">Tier Name</Label>
                    <Input
                      id="tierName"
                      name="tierName"
                      placeholder="e.g., bulk_50"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basePricePerToken" className="text-white">Base Price ($)</Label>
                    <Input
                      id="basePricePerToken"
                      name="basePricePerToken"
                      type="number"
                      step="0.01"
                      placeholder="2.00"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minQuantity" className="text-white">Min Quantity</Label>
                    <Input
                      id="minQuantity"
                      name="minQuantity"
                      type="number"
                      min="1"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxQuantity" className="text-white">Max Quantity</Label>
                    <Input
                      id="maxQuantity"
                      name="maxQuantity"
                      type="number"
                      placeholder="Leave empty for unlimited"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountPercentage" className="text-white">Discount %</Label>
                    <Input
                      id="discountPercentage"
                      name="discountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="0"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-white">Currency</Label>
                    <Select name="currency" defaultValue="USD">
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="FLBY">FLBY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder" className="text-white">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      name="sortOrder"
                      type="number"
                      min="0"
                      placeholder="0"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="gasFeeIncluded" name="gasFeeIncluded" defaultChecked />
                    <Label htmlFor="gasFeeIncluded" className="text-white">Include Gas Fees</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createTierMutation.isPending}>
                    {createTierMutation.isPending ? "Creating..." : "Create Tier"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {tiersLoading ? (
          <div className="text-center text-white">Loading pricing tiers...</div>
        ) : (
          <div className="grid gap-4">
            {tiers.map((tier: PricingTier) => (
              <Card key={tier.id} className="bg-slate-800/50 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{tier.tierName}</h3>
                        {!tier.isActive && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                        {tier.discountPercentage !== "0" && (
                          <Badge variant="secondary" className="bg-green-600">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            {tier.discountPercentage}% off
                          </Badge>
                        )}
                      </div>
                      <p className="text-blue-300">
                        Quantity: {tier.minQuantity}
                        {tier.maxQuantity ? ` - ${tier.maxQuantity}` : '+'} tokens
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-white">
                          <span className="text-slate-400">Base:</span> ${tier.basePricePerToken}
                        </p>
                        <p className="text-white font-bold">
                          <span className="text-slate-400">Final:</span> ${tier.finalPricePerToken}
                        </p>
                        <p className="text-blue-300">{tier.currency}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTier(tier);
                          setIsEditDialogOpen(true);
                        }}
                        className="border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTierMutation.mutate(tier.id)}
                        className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
                        disabled={deleteTierMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        {editingTier && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-slate-800 border-slate-600">
              <DialogHeader>
                <DialogTitle className="text-white">Edit Pricing Tier</DialogTitle>
                <DialogDescription className="text-slate-300">
                  Modify the pricing tier configuration
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleEditTier(new FormData(e.currentTarget)); }}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-tierName" className="text-white">Tier Name</Label>
                    <Input
                      id="edit-tierName"
                      name="tierName"
                      defaultValue={editingTier.tierName}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-basePricePerToken" className="text-white">Base Price ($)</Label>
                    <Input
                      id="edit-basePricePerToken"
                      name="basePricePerToken"
                      type="number"
                      step="0.01"
                      defaultValue={editingTier.basePricePerToken}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-minQuantity" className="text-white">Min Quantity</Label>
                    <Input
                      id="edit-minQuantity"
                      name="minQuantity"
                      type="number"
                      min="1"
                      defaultValue={editingTier.minQuantity}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-maxQuantity" className="text-white">Max Quantity</Label>
                    <Input
                      id="edit-maxQuantity"
                      name="maxQuantity"
                      type="number"
                      defaultValue={editingTier.maxQuantity || ""}
                      placeholder="Leave empty for unlimited"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-discountPercentage" className="text-white">Discount %</Label>
                    <Input
                      id="edit-discountPercentage"
                      name="discountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      defaultValue={editingTier.discountPercentage}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-currency" className="text-white">Currency</Label>
                    <Select name="currency" defaultValue={editingTier.currency}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="FLBY">FLBY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-sortOrder" className="text-white">Sort Order</Label>
                    <Input
                      id="edit-sortOrder"
                      name="sortOrder"
                      type="number"
                      min="0"
                      defaultValue={editingTier.sortOrder}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="edit-gasFeeIncluded" name="gasFeeIncluded" defaultChecked={editingTier.gasFeeIncluded} />
                    <Label htmlFor="edit-gasFeeIncluded" className="text-white">Include Gas Fees</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={updateTierMutation.isPending}>
                    {updateTierMutation.isPending ? "Updating..." : "Update Tier"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}