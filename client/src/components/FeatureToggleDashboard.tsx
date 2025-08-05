import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Zap, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Rocket,
  TrendingUp,
  Brain,
  Shield
} from "lucide-react";

interface FeatureToggle {
  featureId: string;
  name: string;
  description: string;
  category: 'core' | 'advanced' | 'enterprise' | 'ai' | 'analytics';
  enabled: boolean;
  requiresAuth: boolean;
  dependencies?: string[];
  aiEndpoints?: string[];
  estimatedApiCost?: number;
}

interface AIEndpointConfig {
  endpoint: string;
  description: string;
  category: 'essential' | 'enhancement' | 'advanced' | 'experimental';
  monthlyRequestEstimate: number;
  costPerRequest: number;
  requiredFeatures: string[];
}

interface CostAnalysis {
  featureCosts: { feature: string; cost: number }[];
  aiCosts: { endpoint: string; cost: number }[];
  totalFeatureCost: number;
  totalAICost: number;
  totalCost: number;
}

interface MVPRecommendations {
  enabledFeatures: string[];
  disabledFeatures: string[];
  essentialAI: string[];
  disabledAI: string[];
  estimatedMonthlyCost: number;
  reasoning: string;
}

export default function FeatureToggleDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch all features
  const { data: featuresData, isLoading: featuresLoading } = useQuery<{success: boolean; data: FeatureToggle[]}>({
    queryKey: ["/api/admin/features"],
  });

  // Fetch AI endpoints
  const { data: aiData } = useQuery<{success: boolean; data: { active: AIEndpointConfig[]; inactive: AIEndpointConfig[] }}>({
    queryKey: ["/api/admin/features/ai-endpoints"],
  });

  // Fetch cost analysis
  const { data: costData } = useQuery<{success: boolean; data: CostAnalysis}>({
    queryKey: ["/api/admin/features/costs"],
  });

  // Fetch MVP recommendations
  const { data: mvpData } = useQuery<{success: boolean; data: MVPRecommendations}>({
    queryKey: ["/api/admin/features/mvp-recommendations"],
  });

  // Toggle feature mutation
  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ featureId, enabled }: { featureId: string; enabled: boolean }) => {
      const method = enabled ? 'POST' : 'DELETE';
      const response = await fetch(`/api/admin/features/${featureId}/toggle`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to toggle feature');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/features"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/features/costs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/features/ai-endpoints"] });
      toast({
        title: "Feature Updated",
        description: "Feature toggle updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Toggle Failed",
        description: error.message || "Failed to toggle feature",
        variant: "destructive",
      });
    },
  });

  // Apply MVP settings mutation
  const applyMVPMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/features/apply-mvp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to apply MVP settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/features"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/features/costs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/features/ai-endpoints"] });
      toast({
        title: "MVP Configuration Applied",
        description: "All features configured for MVP launch",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to apply MVP configuration",
        variant: "destructive",
      });
    },
  });

  const handleToggleFeature = (featureId: string, currentEnabled: boolean) => {
    toggleFeatureMutation.mutate({ featureId, enabled: !currentEnabled });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <Rocket className="h-4 w-4" />;
      case 'advanced': return <TrendingUp className="h-4 w-4" />;
      case 'enterprise': return <Shield className="h-4 w-4" />;
      case 'ai': return <Brain className="h-4 w-4" />;
      case 'analytics': return <TrendingUp className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'advanced': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'enterprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'ai': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'analytics': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getAICategoryColor = (category: string) => {
    switch (category) {
      case 'essential': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'enhancement': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'experimental': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredFeatures = featuresData?.data?.filter(feature => 
    selectedCategory === 'all' || feature.category === selectedCategory
  ) || [];

  if (featuresLoading) {
    return <div className="flex items-center justify-center p-8">Loading feature configuration...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            Feature Toggle Dashboard
          </h2>
          <p className="text-gray-600">
            Control which features are available to users and optimize API costs for launch
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => applyMVPMutation.mutate()}
            disabled={applyMVPMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Apply MVP Settings
          </Button>
        </div>
      </div>

      {/* Cost Overview */}
      {costData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${costData.data.totalCost.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Features + AI endpoints
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Features</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {featuresData?.data?.filter(f => f.enabled).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                of {featuresData?.data?.length || 0} total features
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active AI Endpoints</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {aiData?.data?.active.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                of {(aiData?.data?.active.length || 0) + (aiData?.data?.inactive.length || 0)} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Cost</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${costData.data.totalAICost.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Monthly API requests
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="ai">AI Endpoints</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="mvp">MVP Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {['core', 'advanced', 'enterprise', 'ai', 'analytics'].map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryIcon(category)}
                <span className="ml-1 capitalize">{category}</span>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeatures.map((feature) => (
              <Card key={feature.featureId} className={feature.enabled ? 'border-green-500' : 'border-gray-300'}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{feature.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(feature.category)}>
                        {getCategoryIcon(feature.category)}
                        <span className="ml-1">{feature.category}</span>
                      </Badge>
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={() => handleToggleFeature(feature.featureId, feature.enabled)}
                        disabled={toggleFeatureMutation.isPending}
                      />
                    </div>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {feature.requiresAuth && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        <span>Requires Authentication</span>
                      </div>
                    )}
                    
                    {feature.estimatedApiCost && feature.estimatedApiCost > 0 && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3" />
                        <span>${feature.estimatedApiCost}/month</span>
                      </div>
                    )}

                    {feature.dependencies && feature.dependencies.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <strong>Depends on:</strong> {feature.dependencies.join(', ')}
                      </div>
                    )}

                    {feature.aiEndpoints && feature.aiEndpoints.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <strong>AI Endpoints:</strong> {feature.aiEndpoints.join(', ')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">Active AI Endpoints</CardTitle>
                <CardDescription>AI endpoints currently enabled based on active features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiData?.data?.active.map((endpoint) => (
                    <div key={endpoint.endpoint} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{endpoint.endpoint}</h4>
                        <Badge className={getAICategoryColor(endpoint.category)}>
                          {endpoint.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                      <div className="text-xs text-gray-500">
                        <div>Monthly requests: {endpoint.monthlyRequestEstimate.toLocaleString()}</div>
                        <div>Cost per request: ${endpoint.costPerRequest.toFixed(4)}</div>
                        <div>Monthly cost: ${(endpoint.monthlyRequestEstimate * endpoint.costPerRequest).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                  {(!aiData?.data?.active || aiData.data.active.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No active AI endpoints</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-700 dark:text-gray-400">Inactive AI Endpoints</CardTitle>
                <CardDescription>AI endpoints disabled due to feature toggles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiData?.data?.inactive.map((endpoint) => (
                    <div key={endpoint.endpoint} className="p-3 border rounded-lg opacity-60">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{endpoint.endpoint}</h4>
                        <Badge className={getAICategoryColor(endpoint.category)}>
                          {endpoint.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                      <div className="text-xs text-gray-500">
                        <div>Required features: {endpoint.requiredFeatures.join(', ')}</div>
                        <div>Potential monthly cost: ${(endpoint.monthlyRequestEstimate * endpoint.costPerRequest).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                  {(!aiData?.data?.inactive || aiData.data.inactive.length === 0) && (
                    <p className="text-gray-500 text-center py-4">All AI endpoints are active</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          {costData?.data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Costs</CardTitle>
                  <CardDescription>Monthly costs by enabled features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {costData.data.featureCosts.map((item) => (
                      <div key={item.feature} className="flex justify-between">
                        <span>{item.feature}</span>
                        <span className="font-medium">${item.cost}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total Feature Cost</span>
                      <span>${costData.data.totalFeatureCost}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Endpoint Costs</CardTitle>
                  <CardDescription>Monthly costs by active AI endpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {costData.data.aiCosts.map((item) => (
                      <div key={item.endpoint} className="flex justify-between">
                        <span>{item.endpoint}</span>
                        <span className="font-medium">${item.cost.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total AI Cost</span>
                      <span>${costData.data.totalAICost.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {costData?.data && (
            <Card>
              <CardHeader>
                <CardTitle>Total Monthly Cost Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-blue-600">
                    ${costData.data.totalCost.toFixed(2)}
                  </div>
                  <p className="text-gray-600">
                    Total estimated monthly cost for all enabled features and AI endpoints
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-xl font-semibold">${costData.data.totalFeatureCost}</div>
                      <div className="text-sm text-gray-500">Feature Costs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold">${costData.data.totalAICost.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">AI Costs</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mvp" className="space-y-4">
          {mvpData?.data && (
            <>
              <Alert>
                <Rocket className="h-4 w-4" />
                <AlertDescription>
                  <strong>MVP Launch Strategy:</strong> {mvpData.data.reasoning}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700 dark:text-green-400">
                      Recommended for MVP Launch
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Core Features</h4>
                        <div className="space-y-1">
                          {mvpData.data.enabledFeatures.map((featureId) => {
                            const feature = featuresData?.data?.find(f => f.featureId === featureId);
                            return (
                              <div key={featureId} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{feature?.name || featureId}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Essential AI Endpoints</h4>
                        <div className="space-y-1">
                          {mvpData.data.essentialAI.map((aiId) => (
                            <div key={aiId} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{aiId}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-700 dark:text-red-400">
                      Recommended to Disable for MVP
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Advanced Features</h4>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {mvpData.data.disabledFeatures.slice(0, 10).map((featureId) => {
                            const feature = featuresData?.data?.find(f => f.featureId === featureId);
                            return (
                              <div key={featureId} className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-sm">{feature?.name || featureId}</span>
                              </div>
                            );
                          })}
                          {mvpData.data.disabledFeatures.length > 10 && (
                            <div className="text-sm text-gray-500">
                              +{mvpData.data.disabledFeatures.length - 10} more features
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Advanced AI Endpoints</h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {mvpData.data.disabledAI.slice(0, 8).map((aiId) => (
                            <div key={aiId} className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span className="text-sm">{aiId}</span>
                            </div>
                          ))}
                          {mvpData.data.disabledAI.length > 8 && (
                            <div className="text-sm text-gray-500">
                              +{mvpData.data.disabledAI.length - 8} more endpoints
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>MVP Cost Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-green-600">
                      ${mvpData.data.estimatedMonthlyCost.toFixed(2)}/month
                    </div>
                    <p className="text-gray-600">
                      Estimated monthly cost for MVP configuration
                    </p>
                    
                    <Button
                      onClick={() => applyMVPMutation.mutate()}
                      disabled={applyMVPMutation.isPending}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      {applyMVPMutation.isPending ? "Applying..." : "Apply MVP Configuration"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}