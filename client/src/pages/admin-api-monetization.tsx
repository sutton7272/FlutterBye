/**
 * Admin API Monetization Dashboard - Manage subscription tiers, pricing, and revenue optimization
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Settings, 
  BarChart3,
  CreditCard,
  Zap,
  Crown,
  Star,
  AlertCircle,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Target,
  Gauge,
  Brain
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  aiCredits: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  advancedFeatures: string[];
  active: boolean;
}

interface UsageMetrics {
  totalUsers: number;
  totalRevenue: number;
  tierDistribution: { [key: string]: number };
  averageRevenuePerUser: number;
  topEndpoints: Array<{ endpoint: string; usage: number; revenue: number }>;
  revenueGrowth: number;
  userGrowth: number;
}

interface PricingRecommendation {
  tier: string;
  currentPrice: number;
  recommendedPrice: number;
  reasoning: string;
  expectedImpact: string;
}

export default function AdminAPIMonetization() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [newTier, setNewTier] = useState<Partial<SubscriptionTier>>({
    name: '',
    price: 0,
    currency: 'USD',
    features: [],
    aiCredits: 1000,
    rateLimit: { requestsPerMinute: 60, requestsPerDay: 10000 },
    advancedFeatures: [],
    active: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch monetization dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['/api/ai-monetization/dashboard'],
    refetchInterval: 30000
  });

  // Fetch subscription tiers
  const { data: subscriptionTiers, isLoading: tiersLoading } = useQuery({
    queryKey: ['/api/ai-monetization/tiers']
  });

  // Fetch usage analytics
  const { data: usageAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/ai-monetization/analytics'],
    refetchInterval: 60000
  });

  // Fetch pricing recommendations
  const { data: pricingRecommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['/api/ai-monetization/pricing-recommendations']
  });

  // Update subscription tier mutation
  const updateTierMutation = useMutation({
    mutationFn: async (data: { tierId: string; updates: Partial<SubscriptionTier> }) =>
      apiRequest(`/api/ai-monetization/tiers/${data.tierId}`, 'PUT', data.updates),
    onSuccess: () => {
      toast({ title: "Tier updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-monetization/tiers'] });
      setEditingTier(null);
    },
    onError: (error) => {
      toast({ title: "Failed to update tier", description: error.message, variant: "destructive" });
    }
  });

  // Create new tier mutation
  const createTierMutation = useMutation({
    mutationFn: async (tierData: Partial<SubscriptionTier>) =>
      apiRequest('/api/ai-monetization/tiers', 'POST', tierData),
    onSuccess: () => {
      toast({ title: "New tier created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-monetization/tiers'] });
      setNewTier({
        name: '',
        price: 0,
        currency: 'USD',
        features: [],
        aiCredits: 1000,
        rateLimit: { requestsPerMinute: 60, requestsPerDay: 10000 },
        advancedFeatures: [],
        active: true
      });
    },
    onError: (error) => {
      toast({ title: "Failed to create tier", description: error.message, variant: "destructive" });
    }
  });

  // Delete tier mutation
  const deleteTierMutation = useMutation({
    mutationFn: async (tierId: string) =>
      apiRequest(`/api/ai-monetization/tiers/${tierId}`, 'DELETE'),
    onSuccess: () => {
      toast({ title: "Tier deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-monetization/tiers'] });
    },
    onError: (error) => {
      toast({ title: "Failed to delete tier", description: error.message, variant: "destructive" });
    }
  });

  // Apply pricing recommendations mutation
  const applyRecommendationMutation = useMutation({
    mutationFn: async (data: { tierId: string; newPrice: number }) =>
      apiRequest('/api/ai-monetization/apply-recommendation', 'POST', data),
    onSuccess: () => {
      toast({ title: "Pricing recommendation applied successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-monetization/tiers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-monetization/pricing-recommendations'] });
    },
    onError: (error) => {
      toast({ title: "Failed to apply recommendation", description: error.message, variant: "destructive" });
    }
  });

  const getTierIcon = (tierName: string) => {
    if (tierName.toLowerCase().includes('enterprise') || tierName.toLowerCase().includes('ultimate')) return Crown;
    if (tierName.toLowerCase().includes('professional') || tierName.toLowerCase().includes('pro')) return Star;
    if (tierName.toLowerCase().includes('starter') || tierName.toLowerCase().includes('basic')) return Zap;
    return CreditCard;
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (active: boolean) => {
    return active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Monetization Dashboard</h1>
          <p className="text-white/70">Manage subscription tiers, pricing, and revenue optimization</p>
        </div>
        <Button
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['/api/ai-monetization/dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['/api/ai-monetization/analytics'] });
          }}
          variant="outline"
          className="border-purple-500/30"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tiers">
            <CreditCard className="w-4 h-4 mr-2" />
            Subscription Tiers
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="w-4 h-4 mr-2" />
            Usage Analytics
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <Target className="w-4 h-4 mr-2" />
            Pricing AI
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">
                      {dashboardData ? formatCurrency(dashboardData.totalRevenue) : '$0'}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Active Users</p>
                    <p className="text-2xl font-bold text-white">
                      {dashboardData?.totalUsers || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">ARPU</p>
                    <p className="text-2xl font-bold text-white">
                      {dashboardData ? formatCurrency(dashboardData.averageRevenuePerUser) : '$0'}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Growth Rate</p>
                    <p className="text-2xl font-bold text-white">
                      {usageAnalytics ? `+${usageAnalytics.revenueGrowth}%` : '+0%'}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tier Distribution Chart */}
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Subscription Tier Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.tierDistribution && Object.entries(dashboardData.tierDistribution).map(([tier, count]) => (
                  <div key={tier} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="capitalize">{tier}</Badge>
                      <span className="text-white">{count} users</span>
                    </div>
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(count / dashboardData.totalUsers) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tiers Tab */}
        <TabsContent value="tiers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Manage Subscription Tiers</h3>
            <Button onClick={() => setActiveTab('create-tier')} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Tier
            </Button>
          </div>

          <div className="grid gap-6">
            {subscriptionTiers?.map((tier: SubscriptionTier) => {
              const TierIcon = getTierIcon(tier.name);
              const isEditing = editingTier === tier.id;

              return (
                <Card key={tier.id} className="bg-slate-900/50 border-purple-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                          <TierIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{tier.name}</CardTitle>
                          <p className="text-white/60">{formatCurrency(tier.price)}/month</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(tier.active)}>
                          {tier.active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTier(isEditing ? null : tier.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTierMutation.mutate(tier.id)}
                          className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Tier Name</Label>
                            <Input defaultValue={tier.name} className="bg-slate-800 border-slate-700" />
                          </div>
                          <div>
                            <Label>Price ({tier.currency})</Label>
                            <Input type="number" defaultValue={tier.price} className="bg-slate-800 border-slate-700" />
                          </div>
                          <div>
                            <Label>AI Credits</Label>
                            <Input type="number" defaultValue={tier.aiCredits} className="bg-slate-800 border-slate-700" />
                          </div>
                          <div>
                            <Label>Requests per Minute</Label>
                            <Input type="number" defaultValue={tier.rateLimit.requestsPerMinute} className="bg-slate-800 border-slate-700" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              // updateTierMutation.mutate({ tierId: tier.id, updates: formData });
                              setEditingTier(null);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setEditingTier(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-white mb-2">Features</h4>
                          <ul className="space-y-1">
                            {tier.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="text-sm text-white/70 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                                {feature}
                              </li>
                            ))}
                            {tier.features.length > 3 && (
                              <li className="text-sm text-white/50">+{tier.features.length - 3} more features</li>
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-2">Limits</h4>
                          <div className="space-y-1 text-sm text-white/70">
                            <p>AI Credits: {tier.aiCredits === -1 ? 'Unlimited' : tier.aiCredits.toLocaleString()}</p>
                            <p>Requests/min: {tier.rateLimit.requestsPerMinute === -1 ? 'Unlimited' : tier.rateLimit.requestsPerMinute}</p>
                            <p>Requests/day: {tier.rateLimit.requestsPerDay === -1 ? 'Unlimited' : tier.rateLimit.requestsPerDay.toLocaleString()}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-2">Advanced Features</h4>
                          <div className="space-y-1">
                            {tier.advancedFeatures.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                                {feature.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Usage Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Top API Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usageAnalytics?.topEndpoints?.map((endpoint, index) => (
                    <div key={endpoint.endpoint} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <code className="text-sm bg-slate-800 px-2 py-1 rounded text-purple-400">
                          {endpoint.endpoint}
                        </code>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">{endpoint.usage.toLocaleString()} calls</p>
                        <p className="text-xs text-green-400">{formatCurrency(endpoint.revenue)}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-white/60 text-center py-4">No analytics data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Monthly Growth</span>
                    <span className="text-green-400 font-semibold">
                      +{usageAnalytics?.revenueGrowth || 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">User Growth</span>
                    <span className="text-blue-400 font-semibold">
                      +{usageAnalytics?.userGrowth || 0}%
                    </span>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-sm text-white/60">
                      Revenue optimization suggestions will appear here based on usage patterns and AI analysis.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pricing AI Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-white">AI-Powered Pricing Recommendations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pricingRecommendations?.map((rec: PricingRecommendation, index: number) => (
                  <div key={index} className="p-4 border border-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white">{rec.tier}</h4>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        AI Recommendation
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-white/60">Current Price</p>
                        <p className="text-lg font-semibold text-white">{formatCurrency(rec.currentPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/60">Recommended Price</p>
                        <p className="text-lg font-semibold text-green-400">{formatCurrency(rec.recommendedPrice)}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-white/70">{rec.reasoning}</p>
                      <p className="text-sm text-blue-400">{rec.expectedImpact}</p>
                    </div>
                    <Button
                      onClick={() => applyRecommendationMutation.mutate({
                        tierId: rec.tier.toLowerCase(),
                        newPrice: rec.recommendedPrice
                      })}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      Apply Recommendation
                    </Button>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-white/70">AI is analyzing usage patterns to generate pricing recommendations...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Monetization Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Enable Auto-Pricing</Label>
                  <p className="text-sm text-white/60">Allow AI to automatically adjust prices based on market conditions</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Rate Limiting</Label>
                  <p className="text-sm text-white/60">Enforce API rate limits for subscription tiers</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Usage Analytics</Label>
                  <p className="text-sm text-white/60">Track detailed usage metrics for optimization</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Default Currency</Label>
                  <Input defaultValue="USD" className="bg-slate-800 border-slate-700 mt-2" />
                </div>
                <div>
                  <Label className="text-white">Revenue Target (Monthly)</Label>
                  <Input defaultValue="10000" type="number" className="bg-slate-800 border-slate-700 mt-2" />
                </div>
              </div>
              
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}