import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Globe,
  Brain,
  Shield,
  Zap,
  Target,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wallet,
  Chain,
  Bot,
  Lightbulb,
  Award,
  Star
} from "lucide-react";

interface EnterpriseClient {
  id: string;
  companyName: string;
  contactEmail: string;
  contactName: string;
  industry: string;
  companySize: string;
  website?: string;
  description?: string;
  subscriptionTier: string;
  monthlySpend: number;
  contractValue: number;
  status: string;
  createdAt: string;
  apiKey: string;
}

interface Campaign {
  id: string;
  campaignName: string;
  campaignType: string;
  budget: number;
  duration: number;
  status: string;
  performanceScore: number;
  conversions: number;
  aiPredictions: any;
  createdAt: string;
}

function EnterpriseManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  // Fetch enterprise clients
  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['/api/enterprise/clients'],
    retry: false
  }) as { data: { clients: EnterpriseClient[] } | undefined; isLoading: boolean };

  // Fetch campaigns for selected client
  const { data: campaigns } = useQuery({
    queryKey: ['/api/enterprise/clients', selectedClient, 'campaigns'],
    enabled: !!selectedClient,
    retry: false
  }) as { data: { campaigns: Campaign[] } | undefined };

  // Fetch client dashboard
  const { data: dashboard } = useQuery({
    queryKey: ['/api/enterprise/dashboard', selectedClient],
    enabled: !!selectedClient,
    retry: false
  }) as { data: { dashboard: any } | undefined };

  // Fetch revenue analytics
  const { data: revenueAnalytics } = useQuery({
    queryKey: ['/api/enterprise/revenue-analytics'],
    retry: false
  }) as { data: { analytics: any[] } | undefined };

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/enterprise/clients', data);
    },
    onSuccess: () => {
      toast({
        title: "Client Created",
        description: "Enterprise client created successfully with API credentials",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/enterprise/clients'] });
      setShowCreateClient(false);
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create enterprise client",
        variant: "destructive",
      });
    },
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', `/api/enterprise/clients/${selectedClient}/campaigns`, data);
    },
    onSuccess: () => {
      toast({
        title: "Campaign Created",
        description: "Campaign created with AI analysis and recommendations",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/enterprise/clients', selectedClient, 'campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/enterprise/dashboard', selectedClient] });
      setShowCreateCampaign(false);
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    },
  });

  // Generate recommendations mutation
  const generateRecommendationsMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      return await apiRequest('POST', `/api/enterprise/campaigns/${campaignId}/recommendations`);
    },
    onSuccess: () => {
      toast({
        title: "Recommendations Generated",
        description: "AI recommendations have been generated for the campaign",
      });
    },
  });

  return (
    <div 
      className="min-h-screen p-6"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Enterprise Client Management
            </h1>
          </div>
          <p className="text-xl text-slate-300">
            Manage enterprise clients, analyze campaigns, and provide AI-powered insights
          </p>
        </div>

        {/* Revenue Overview Cards */}
        {revenueAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-sm text-green-300">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">
                      ${revenueAnalytics.analytics.reduce((sum: number, item: any) => sum + (item.totalRevenue || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-sm text-blue-300">Active Clients</p>
                    <p className="text-2xl font-bold text-white">
                      {clients?.clients?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                  <div>
                    <p className="text-sm text-purple-300">Avg Contract Value</p>
                    <p className="text-2xl font-bold text-white">
                      ${revenueAnalytics.analytics.reduce((sum: number, item: any) => sum + (item.averageContractValue || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-orange-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-orange-400" />
                  <div>
                    <p className="text-sm text-orange-300">Active Campaigns</p>
                    <p className="text-2xl font-bold text-white">
                      {campaigns?.campaigns?.filter(c => c.status === 'active').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <Globe className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-green-600">
              <Building2 className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-purple-600">
              <Target className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="data-[state=active]:bg-cyan-600">
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {dashboard?.dashboard && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Client Summary */}
                <Card className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-400" />
                      Client Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Company</span>
                        <span className="text-white font-medium">{dashboard.dashboard.client.companyName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Industry</span>
                        <Badge className="bg-blue-600">{dashboard.dashboard.client.industry}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Tier</span>
                        <Badge className="bg-purple-600">{dashboard.dashboard.client.subscriptionTier}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Contract Value</span>
                        <span className="text-green-400 font-bold">${dashboard.dashboard.summary.contractValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign Performance */}
                <Card className="bg-slate-800/50 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-400" />
                      Campaign Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{dashboard.dashboard.summary.totalCampaigns}</div>
                        <div className="text-sm text-slate-300">Total Campaigns</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{dashboard.dashboard.summary.activeCampaigns}</div>
                        <div className="text-sm text-slate-300">Active</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">{dashboard.dashboard.summary.averagePerformance}%</div>
                        <div className="text-sm text-slate-300">Avg Performance</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-400">{dashboard.dashboard.summary.totalConversions}</div>
                        <div className="text-sm text-slate-300">Conversions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cross-Chain Analytics */}
                <Card className="bg-slate-800/50 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Chain className="h-5 w-5 text-purple-400" />
                      Cross-Chain Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(dashboard.dashboard.crossChainAnalytics || {}).map(([chain, data]: [string, any]) => (
                        <div key={chain} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                          <span className="text-white capitalize">{chain}</span>
                          <div className="text-right">
                            <div className="text-sm text-purple-400">{data.totalCampaigns} campaigns</div>
                            <div className="text-xs text-slate-400">${data.totalBudget.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

              </div>
            )}
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Enterprise Clients</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowCreateClient(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="button-create-client"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </div>

            {/* Client Selection */}
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Label className="text-white">Select Client:</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="w-64 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients?.clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {clients?.clients?.map((client) => (
                <Card key={client.id} className="bg-slate-800/50 border-slate-600/50 hover:border-blue-500/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedClient(client.id)}
                      data-testid={`card-client-${client.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{client.companyName}</CardTitle>
                      <Badge className={client.status === 'active' ? 'bg-green-600' : 'bg-red-600'}>
                        {client.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-300">{client.industry}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Contact</span>
                      <span className="text-white text-sm">{client.contactName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Tier</span>
                      <Badge className="bg-purple-600">{client.subscriptionTier}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Contract Value</span>
                      <span className="text-green-400 font-bold">${client.contractValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Monthly Spend</span>
                      <span className="text-blue-400">${client.monthlySpend.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Create Client Modal */}
            {showCreateClient && <CreateClientForm onClose={() => setShowCreateClient(false)} onSubmit={createClientMutation.mutate} />}
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            {selectedClient ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Campaign Management</h2>
                  <Button 
                    onClick={() => setShowCreateCampaign(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                    data-testid="button-create-campaign"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {campaigns?.campaigns?.map((campaign) => (
                    <Card key={campaign.id} className="bg-slate-800/50 border-purple-500/20"
                          data-testid={`card-campaign-${campaign.id}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">{campaign.campaignName}</CardTitle>
                            <CardDescription className="text-slate-300">{campaign.campaignType}</CardDescription>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge className={campaign.status === 'active' ? 'bg-green-600' : 'bg-orange-600'}>
                              {campaign.status}
                            </Badge>
                            <Badge className="bg-purple-600">{campaign.performanceScore}% Score</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                            <div className="text-xl font-bold text-green-400">${campaign.budget.toLocaleString()}</div>
                            <div className="text-sm text-slate-300">Budget</div>
                          </div>
                          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                            <div className="text-xl font-bold text-blue-400">{campaign.conversions}</div>
                            <div className="text-sm text-slate-300">Conversions</div>
                          </div>
                        </div>

                        {campaign.aiPredictions && (
                          <div className="p-3 bg-slate-700/30 rounded-lg">
                            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                              <Brain className="h-4 w-4 text-cyan-400" />
                              AI Predictions
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-300">Expected ROI</span>
                                <span className="text-green-400">{campaign.aiPredictions.roiPrediction}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-300">Success Probability</span>
                                <span className="text-blue-400">{campaign.aiPredictions.successProbability}%</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateRecommendationsMutation.mutate(campaign.id)}
                            className="bg-slate-700 hover:bg-slate-600 border-cyan-500/20"
                            data-testid={`button-recommendations-${campaign.id}`}
                          >
                            <Lightbulb className="h-4 w-4 mr-1" />
                            Generate Recommendations
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Create Campaign Modal */}
                {showCreateCampaign && <CreateCampaignForm onClose={() => setShowCreateCampaign(false)} onSubmit={createCampaignMutation.mutate} />}
              </>
            ) : (
              <Card className="bg-slate-800/50 border-slate-600/50">
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No Client Selected</h3>
                  <p className="text-slate-400">Please select a client to view and manage their campaigns</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <AIInsightsTab selectedClient={selectedClient} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab selectedClient={selectedClient} />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

// Create Client Form Component
function CreateClientForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    contactName: '',
    industry: '',
    companySize: '',
    website: '',
    description: '',
    subscriptionTier: 'standard',
    contractValue: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-slate-800 border-blue-500/20 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-white">Create New Enterprise Client</CardTitle>
          <CardDescription className="text-slate-300">
            Add a new enterprise client with API access and campaign management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Company Name</Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                  data-testid="input-company-name"
                />
              </div>
              <div>
                <Label className="text-white">Contact Name</Label>
                <Input
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                  data-testid="input-contact-name"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-white">Contact Email</Label>
              <Input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                required
                data-testid="input-contact-email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defi">DeFi</SelectItem>
                    <SelectItem value="nft">NFT</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="exchange">Exchange</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => setFormData({...formData, companySize: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-10)</SelectItem>
                    <SelectItem value="small">Small (11-50)</SelectItem>
                    <SelectItem value="medium">Medium (51-200)</SelectItem>
                    <SelectItem value="large">Large (201-1000)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (1000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Website (optional)</Label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="input-website"
                />
              </div>
              <div>
                <Label className="text-white">Contract Value</Label>
                <Input
                  type="number"
                  value={formData.contractValue}
                  onChange={(e) => setFormData({...formData, contractValue: parseInt(e.target.value) || 0})}
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="input-contract-value"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">Description (optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
                data-testid="textarea-description"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}
                      className="bg-slate-700 hover:bg-slate-600 border-slate-600"
                      data-testid="button-cancel-client">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700"
                      data-testid="button-submit-client">
                Create Client
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Create Campaign Form Component
function CreateCampaignForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    campaignName: '',
    campaignType: '',
    budget: 0,
    duration: 30,
    targetChains: [],
    objectives: { awareness: true, conversion: false, retention: false },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-slate-800 border-purple-500/20 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-white">Create New Campaign</CardTitle>
          <CardDescription className="text-slate-300">
            Create a campaign with AI analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-white">Campaign Name</Label>
              <Input
                value={formData.campaignName}
                onChange={(e) => setFormData({...formData, campaignName: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                required
                data-testid="input-campaign-name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Campaign Type</Label>
                <Select value={formData.campaignType} onValueChange={(value) => setFormData({...formData, campaignType: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="acquisition">User Acquisition</SelectItem>
                    <SelectItem value="retention">User Retention</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                    <SelectItem value="launch">Product Launch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Duration (days)</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 30})}
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="input-duration"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">Budget (USD)</Label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value) || 0})}
                className="bg-slate-700 border-slate-600 text-white"
                required
                data-testid="input-budget"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}
                      className="bg-slate-700 hover:bg-slate-600 border-slate-600"
                      data-testid="button-cancel-campaign">
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700"
                      data-testid="button-submit-campaign">
                Create Campaign
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// AI Insights Tab Component
function AIInsightsTab({ selectedClient }: { selectedClient: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">AI-Powered Campaign Insights</h2>
      
      {selectedClient ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Performance Predictions */}
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-cyan-400" />
                Performance Predictions
              </CardTitle>
              <CardDescription className="text-slate-300">
                AI predictions for campaign performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Expected ROI</span>
                    <Badge className="bg-green-600">High Confidence</Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-400">245%</div>
                  <div className="text-sm text-slate-400">Based on similar campaigns in DeFi</div>
                </div>
                
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Conversion Rate</span>
                    <Badge className="bg-blue-600">Medium Confidence</Badge>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">3.2%</div>
                  <div className="text-sm text-slate-400">Above industry average</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Recommendations */}
          <Card className="bg-slate-800/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-green-400" />
                Smart Recommendations
              </CardTitle>
              <CardDescription className="text-slate-300">
                AI-generated optimization suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="p-3 bg-slate-700/50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium">Increase Solana Budget by 25%</h4>
                      <p className="text-sm text-slate-300">Expected 18% improvement in conversions</p>
                      <Badge className="bg-green-600 text-xs mt-1">High Impact</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-700/50 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium">Optimize Posting Schedule</h4>
                      <p className="text-sm text-slate-300">Target 2-4 PM EST for maximum engagement</p>
                      <Badge className="bg-yellow-600 text-xs mt-1">Medium Impact</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Intelligence */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Competitor Intelligence
              </CardTitle>
              <CardDescription className="text-slate-300">
                AI analysis of competitor activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Competitor A</span>
                    <Badge className="bg-red-600">High Threat</Badge>
                  </div>
                  <div className="text-sm text-slate-300">
                    Increased marketing spend by 40% in your target segment
                  </div>
                </div>
                
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Competitor B</span>
                    <Badge className="bg-yellow-600">Medium Threat</Badge>
                  </div>
                  <div className="text-sm text-slate-300">
                    Launching similar product in 2 weeks - opportunity to outbid
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Whale Influence Analysis */}
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="h-5 w-5 text-orange-400" />
                Whale Influence Potential
              </CardTitle>
              <CardDescription className="text-slate-300">
                High-value wallet targeting insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-xl font-bold text-orange-400">127</div>
                  <div className="text-sm text-slate-300">DeFi Whales</div>
                </div>
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-xl font-bold text-blue-400">8.2x</div>
                  <div className="text-sm text-slate-300">Viral Coefficient</div>
                </div>
              </div>
              
              <Alert className="bg-slate-700/50 border-orange-500/20">
                <Award className="h-4 w-4 text-orange-400" />
                <AlertDescription className="text-orange-200">
                  Target top 50 whales for maximum viral impact. Expected reach: 25K+ users.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

        </div>
      ) : (
        <Card className="bg-slate-800/50 border-slate-600/50">
          <CardContent className="p-8 text-center">
            <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Client Selected</h3>
            <p className="text-slate-400">Select a client to view AI-powered campaign insights and recommendations</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ selectedClient }: { selectedClient: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Enterprise Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Revenue Analytics */}
        <Card className="bg-slate-800/50 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Revenue Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">$2.4M</div>
                <div className="text-sm text-slate-300">Total ARR</div>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">$45K</div>
                <div className="text-sm text-slate-300">Avg Contract</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Usage Analytics */}
        <Card className="bg-slate-800/50 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              API Usage Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">12.4M</div>
                <div className="text-sm text-slate-300">Monthly Requests</div>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">99.7%</div>
                <div className="text-sm text-slate-300">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card className="bg-slate-800/50 border-purple-500/20 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              Platform Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-xl font-bold text-green-400">98.5%</div>
                <div className="text-sm text-slate-300">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-xl font-bold text-blue-400">145ms</div>
                <div className="text-sm text-slate-300">Avg Response</div>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-slate-300">Monitoring</div>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-xl font-bold text-orange-400">99.9%</div>
                <div className="text-sm text-slate-300">Data Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default EnterpriseManagement;