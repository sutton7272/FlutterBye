import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Crown, 
  Shield, 
  Sparkles, 
  DollarSign, 
  Users, 
  Edit, 
  Save, 
  X, 
  Plus,
  Settings,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

export default function AdminSubscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SubscriptionPlan>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newPlanDialog, setNewPlanDialog] = useState(false);
  const { toast } = useToast();

  // Load plans and subscriptions
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load subscription plans
      const plansResponse = await apiRequest('GET', '/api/subscription/plans');
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setPlans(Object.values(plansData));
      }

      // Load active subscriptions
      const subsResponse = await apiRequest('GET', '/api/admin/subscriptions');
      if (subsResponse.ok) {
        const subsData = await subsResponse.json();
        setSubscriptions(subsData.subscriptions || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan.id);
    setEditForm({ ...plan });
  };

  const cancelEdit = () => {
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
        
        setPlans(plans.map(p => p.id === editingPlan ? { ...p, ...editForm } : p));
        cancelEdit();
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

  const createNewPlan = async () => {
    try {
      const response = await apiRequest('POST', '/api/admin/subscription/plans', editForm);
      
      if (response.ok) {
        const newPlan = await response.json();
        toast({
          title: "Plan Created",
          description: "New subscription plan has been created successfully.",
        });
        
        setPlans([...plans, newPlan]);
        setNewPlanDialog(false);
        setEditForm({});
      } else {
        throw new Error('Failed to create plan');
      }
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create subscription plan.",
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
        loadData(); // Reload data
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

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      const response = await apiRequest('DELETE', `/api/subscription/${subscriptionId}`);
      
      if (response.ok) {
        toast({
          title: "Subscription Cancelled",
          description: "Customer subscription has been cancelled successfully.",
        });
        loadData(); // Reload data
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel customer subscription.",
        variant: "destructive",
      });
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic': return Sparkles;
      case 'pro': return Crown;
      case 'enterprise': return Shield;
      default: return Settings;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'basic': return 'purple';
      case 'pro': return 'yellow';
      case 'enterprise': return 'cyan';
      default: return 'gray';
    }
  };

  // Calculate analytics
  const totalRevenue = plans.reduce((sum, plan) => sum + (plan.monthlyRevenue || 0), 0);
  const totalSubscribers = plans.reduce((sum, plan) => sum + (plan.subscriberCount || 0), 0);
  const avgRevenuePerUser = totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0;

  return (
    <div className="min-h-screen p-6 pt-20 bg-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-600 bg-clip-text text-transparent mb-4">
            Subscription Management
          </h1>
          <p className="text-slate-400 text-lg">
            Manage subscription plans, pricing, and customer subscriptions
          </p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Subscribers</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {totalSubscribers.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">ARPU</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ${avgRevenuePerUser.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Plans Active</p>
                  <p className="text-2xl font-bold text-green-400">
                    {plans.length}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Plans Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Subscription Plans</h2>
              <Dialog open={newPlanDialog} onOpenChange={setNewPlanDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Plan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Plan Name</Label>
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., Premium"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Price (USD)</Label>
                      <Input
                        type="number"
                        value={editForm.price || ''}
                        onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="29.99"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Features (comma-separated)</Label>
                      <Input
                        value={editForm.features?.join(', ') || ''}
                        onChange={(e) => setEditForm({ ...editForm, features: e.target.value.split(', ') })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Feature 1, Feature 2, Feature 3"
                      />
                    </div>
                    <Button onClick={createNewPlan} className="w-full bg-cyan-600 hover:bg-cyan-700">
                      Create Plan
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {plans.map((plan) => {
                const IconComponent = getPlanIcon(plan.id);
                const color = getPlanColor(plan.id);
                const isEditing = editingPlan === plan.id;

                return (
                  <Card key={plan.id} className={`bg-slate-800/50 border-${color}-500/20`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
                            <IconComponent className={`w-6 h-6 text-${color}-400`} />
                          </div>
                          {isEditing ? (
                            <Input
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="bg-slate-700 border-slate-600 text-white text-lg font-bold"
                            />
                          ) : (
                            <CardTitle className={`text-xl text-${color}-400`}>
                              {plan.name}
                            </CardTitle>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <Button size="sm" onClick={savePlan} className="bg-green-600 hover:bg-green-700">
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit} className="border-red-500/30 text-red-400">
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => startEdit(plan)} className="border-slate-600 text-slate-300">
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Price:</span>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editForm.price || ''}
                            onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                            className="w-24 bg-slate-700 border-slate-600 text-white"
                          />
                        ) : (
                          <span className="text-white font-bold">${plan.price}/month</span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-slate-400">Features:</span>
                        {isEditing ? (
                          <Input
                            value={editForm.features?.join(', ') || ''}
                            onChange={(e) => setEditForm({ ...editForm, features: e.target.value.split(', ') })}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {plan.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center">
                          <p className="text-sm text-slate-400">Subscribers</p>
                          <p className="text-lg font-bold text-white">{plan.subscriberCount || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-slate-400">Monthly Revenue</p>
                          <p className="text-lg font-bold text-white">${(plan.monthlyRevenue || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Active Subscriptions */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Active Subscriptions</h2>
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <Card key={subscription.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-white">{subscription.customerEmail}</p>
                        <p className="text-sm text-slate-400">ID: {subscription.id}</p>
                      </div>
                      <Badge 
                        variant={subscription.status === 'active' ? 'default' : 'destructive'}
                        className={subscription.status === 'active' ? 'bg-green-600' : 'bg-red-600'}
                      >
                        {subscription.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Current Plan:</span>
                        <span className="text-white font-medium">{subscription.planId}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Period Ends:</span>
                        <span className="text-white">
                          {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Select onValueChange={(newPlan) => updateSubscription(subscription.id, newPlan)}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Change Plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {plans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name} - ${plan.price}/mo
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => cancelSubscription(subscription.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {subscriptions.length === 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <p className="text-slate-400">No active subscriptions found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}