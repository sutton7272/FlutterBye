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
import { Trash2, Edit, Plus, DollarSign, TrendingDown, TrendingUp, Users, CreditCard, Save, X } from "lucide-react";

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

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
  subscriberCount?: number;
  monthlyRevenue?: number;
}

interface Subscription {
  id: string;
  customerId: string;
  customerEmail: string;
  planId: string;
  status: string;
  currentPeriodEnd: number;
  createdAt: string;
}

export default function AdminPricing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);
  const [calculationQuantity, setCalculationQuantity] = useState<number>(1);
  
  // Subscription management states
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SubscriptionPlan>>({});
  const [newPlanDialog, setNewPlanDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('token-pricing');

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

  // Load subscription data
  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      // Load subscription plans
      const plansResponse = await apiRequest('GET', '/api/subscription/plans');
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setSubscriptionPlans(Object.values(plansData));
      }

      // Load active subscriptions
      const subsResponse = await apiRequest('GET', '/api/admin/subscriptions');
      if (subsResponse.ok) {
        const subsData = await subsResponse.json();
        setSubscriptions(subsData.subscriptions || []);
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
    }
  };

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

  // Subscription management functions
  const startEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan.id);
    setEditForm({ ...plan });
  };

  const cancelEditPlan = () => {
    setEditingPlan(null);
    setEditForm({});
  };

  const savePlan = async () => {
    if (!editingPlan || !editForm) return;

    try {
      const response = await apiRequest('PUT', `/api/admin/subscription/plans/${editingPlan}`, editForm);
      
      if (response.ok) {
        toast({
          title: "Plan Updated",
          description: "Subscription plan has been updated successfully.",
        });
        
        setSubscriptionPlans(subscriptionPlans.map(p => p.id === editingPlan ? { ...p, ...editForm } : p));
        cancelEditPlan();
      } else {
        throw new Error('Failed to update plan');
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update subscription plan.",
        variant: "destructive",
      });
    }
  };

  const updateSubscription = async (subscriptionId: string, newPlanId: string) => {
    try {
      const response = await apiRequest('PUT', `/api/subscription/${subscriptionId}`, {
        newPlan: newPlanId
      });
      
      if (response.ok) {
        toast({
          title: "Subscription Updated",
          description: "Customer subscription has been updated successfully.",
        });
        loadSubscriptionData();
      } else {
        throw new Error('Failed to update subscription');
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update customer subscription.",
        variant: "destructive",
      });
    }
  };

  // Calculate subscription analytics
  const totalRevenue = subscriptionPlans.reduce((sum, plan) => sum + (plan.monthlyRevenue || 0), 0);
  const totalSubscribers = subscriptionPlans.reduce((sum, plan) => sum + (plan.subscriberCount || 0), 0);
  const avgRevenuePerUser = totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-600 bg-clip-text text-transparent">
            Pricing & Subscription Management
          </h1>
          <p className="text-blue-300 text-lg">
            Configure token pricing, subscription plans, and manage customer billing
          </p>
        </div>

        {/* Tabs for different pricing sections */}
        <div className="w-full">
          <div className="border-b border-slate-700 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('token-pricing')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'token-pricing'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                }`}
              >
                <DollarSign className="w-4 h-4 inline mr-2" />
                Token Pricing
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'subscriptions'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Subscription Management
              </button>
            </nav>
          </div>

          {/* Token Pricing Tab Content */}
          {activeTab === 'token-pricing' && (
            <div className="space-y-6">
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

              {/* Pricing Tiers Management */}
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
                    {/* Create tier form content would go here */}
                  </DialogContent>
                </Dialog>
              </div>

              {/* Pricing Tiers Grid */}
              <div className="grid gap-4">
                {tiersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading pricing tiers...</p>
                  </div>
                ) : tiers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">No pricing tiers configured yet.</p>
                  </div>
                ) : (
                  tiers.map((tier: PricingTier) => (
                    <Card key={tier.id} className="bg-slate-800/50 border-slate-600">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-semibold text-lg">{tier.tierName}</h3>
                            <p className="text-slate-300">
                              {tier.minQuantity} - {tier.maxQuantity || '∞'} tokens
                            </p>
                            <div className="mt-2">
                              <Badge variant={tier.isActive ? "default" : "secondary"}>
                                {tier.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-xl font-bold">
                              ${parseFloat(tier.finalPricePerToken).toFixed(2)}
                            </p>
                            <p className="text-slate-400 text-sm">per token</p>
                            {tier.discountPercentage !== "0" && (
                              <Badge variant="outline" className="mt-1">
                                {tier.discountPercentage}% off
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Subscription Management Tab Content */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              {/* Subscription Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-300 text-sm font-medium">Total Monthly Revenue</p>
                        <p className="text-white text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-emerald-500/20 p-3 rounded-full">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-300 text-sm font-medium">Active Subscribers</p>
                        <p className="text-white text-2xl font-bold">{totalSubscribers.toLocaleString()}</p>
                      </div>
                      <div className="bg-blue-500/20 p-3 rounded-full">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-300 text-sm font-medium">Avg Revenue Per User</p>
                        <p className="text-white text-2xl font-bold">${avgRevenuePerUser.toFixed(2)}</p>
                      </div>
                      <div className="bg-purple-500/20 p-3 rounded-full">
                        <DollarSign className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subscription Plans Management */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white">Subscription Plans</CardTitle>
                      <CardDescription className="text-slate-300">
                        Manage pricing and features for subscription plans
                      </CardDescription>
                    </div>
                    <Button onClick={() => setNewPlanDialog(true)} className="bg-cyan-600 hover:bg-cyan-700">
                      <Plus className="w-4 h-4 mr-2" />
                      New Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {subscriptionPlans.map((plan) => (
                      <Card key={plan.id} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              {editingPlan === plan.id ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-white">Plan Name</Label>
                                      <Input
                                        value={editForm.name || ''}
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                        className="bg-slate-600 border-slate-500 text-white"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-white">Price ($)</Label>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={editForm.price || ''}
                                        onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                                        className="bg-slate-600 border-slate-500 text-white"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={savePlan} size="sm" className="bg-green-600 hover:bg-green-700">
                                      <Save className="w-4 h-4 mr-1" />
                                      Save
                                    </Button>
                                    <Button onClick={cancelEditPlan} size="sm" variant="outline">
                                      <X className="w-4 h-4 mr-1" />
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
                                    <Badge className="bg-cyan-500/20 text-cyan-400">
                                      ${plan.price}/month
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-slate-400">Subscribers</p>
                                      <p className="text-white font-medium">{plan.subscriberCount || 0}</p>
                                    </div>
                                    <div>
                                      <p className="text-slate-400">Monthly Revenue</p>
                                      <p className="text-white font-medium">${(plan.monthlyRevenue || 0).toLocaleString()}</p>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <p className="text-slate-400 text-sm mb-1">Features:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {plan.features.map((feature, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {feature}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            {editingPlan !== plan.id && (
                              <Button
                                onClick={() => startEditPlan(plan)}
                                size="sm"
                                variant="outline"
                                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Subscriptions Management */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">Customer Subscriptions</CardTitle>
                  <CardDescription className="text-slate-300">
                    Manage individual customer subscriptions and billing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscriptions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-400">No active subscriptions found.</p>
                      </div>
                    ) : (
                      subscriptions.map((subscription) => (
                        <Card key={subscription.id} className="bg-slate-700/30 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-white font-medium">{subscription.customerEmail}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                                    {subscription.status}
                                  </Badge>
                                  <p className="text-slate-400 text-sm">
                                    Plan: {subscription.planId}
                                  </p>
                                  <p className="text-slate-400 text-sm">
                                    Expires: {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Select
                                  onValueChange={(value) => updateSubscription(subscription.id, value)}
                                  defaultValue={subscription.planId}
                                >
                                  <SelectTrigger className="w-40 bg-slate-600 border-slate-500">
                                    <SelectValue placeholder="Change plan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {subscriptionPlans.map((plan) => (
                                      <SelectItem key={plan.id} value={plan.id}>
                                        {plan.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
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