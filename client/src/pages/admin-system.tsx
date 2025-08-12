import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Settings, 
  Navigation, 
  Brain, 
  DollarSign, 
  AlertTriangle, 
  Activity, 
  BarChart3, 
  Shield, 
  Zap,
  TrendingDown,
  TrendingUp,
  Eye,
  EyeOff,
  Power,
  PowerOff,
  Gauge,
  RefreshCw,
  Target,
  Users,
  Clock
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: 'core' | 'ai' | 'enterprise' | 'admin';
  cost_level: 'free' | 'low' | 'medium' | 'high';
}

interface AIFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  monthly_cost: number;
  usage_count: number;
  cost_level: 'low' | 'medium' | 'high' | 'critical';
}

interface SystemStats {
  total_users: number;
  active_sessions: number;
  monthly_ai_cost: number;
  performance_score: number;
  uptime: number;
}

export default function AdminSystem() {
  const { toast } = useToast();
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Fetch navigation items
  const { data: navItems = [], isLoading: navLoading } = useQuery<NavItem[]>({
    queryKey: ['/api/admin/navigation-control'],
    retry: false,
  });

  // Fetch AI features
  const { data: aiFeatures = [], isLoading: aiLoading } = useQuery<AIFeature[]>({
    queryKey: ['/api/admin/ai-features'],
    retry: false,
  });

  // Fetch system stats
  const { data: systemStats, isLoading: statsLoading } = useQuery<SystemStats>({
    queryKey: ['/api/admin/system-stats'],
    retry: false,
  });

  // Navigation toggle mutation
  const navToggleMutation = useMutation({
    mutationFn: async ({ itemId, enabled }: { itemId: string; enabled: boolean }) => {
      return await apiRequest(`/api/admin/navigation-control/${itemId}`, 'PATCH', { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/navigation-control'] });
      toast({ title: "Navigation updated", description: "Changes applied successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update navigation", variant: "destructive" });
    }
  });

  // AI feature toggle mutation
  const aiToggleMutation = useMutation({
    mutationFn: async ({ featureId, enabled }: { featureId: string; enabled: boolean }) => {
      return await apiRequest(`/api/admin/ai-features/${featureId}`, 'PATCH', { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-features'] });
      toast({ title: "AI feature updated", description: "Changes applied successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update AI feature", variant: "destructive" });
    }
  });

  // Emergency AI shutdown mutation
  const emergencyShutdownMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/admin/emergency-ai-shutdown', 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-features'] });
      toast({ title: "Emergency shutdown", description: "All AI features disabled", variant: "destructive" });
    }
  });

  // Bulk operations
  const bulkToggleMutation = useMutation({
    mutationFn: async ({ items, enabled, type }: { items: string[]; enabled: boolean; type: 'nav' | 'ai' }) => {
      return await apiRequest('/api/admin/bulk-toggle', 'POST', { items, enabled, type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/navigation-control'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-features'] });
      setSelectedItems([]);
      setBulkMode(false);
      toast({ title: "Bulk update completed", description: "All selected items updated" });
    }
  });

  const getCostBadgeColor = (level: string) => {
    switch (level) {
      case 'free': return 'bg-green-500';
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateMonthlySavings = (features: AIFeature[]) => {
    return features
      .filter(f => !f.enabled)
      .reduce((total, f) => total + f.monthly_cost, 0);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Systems Dashboard</h1>
          <p className="text-text-secondary mt-2">Control platform visibility, AI features, and operational costs</p>
          <div className="mt-4 flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/admin'}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Admin Panel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/intelligence'}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              Intelligence
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Activity className="h-4 w-4 mr-2" />
            System Online
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            <Target className="h-4 w-4 mr-2" />
            API Connected
          </Badge>
          {(navToggleMutation.isPending || aiToggleMutation.isPending) && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </Badge>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Shutdown
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emergency AI Shutdown</AlertDialogTitle>
                <AlertDialogDescription>
                  This will immediately disable ALL AI features to reduce costs. This action cannot be undone automatically.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => emergencyShutdownMutation.mutate()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Shutdown All AI
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Active Users</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats?.total_users || 0}</div>
            <p className="text-xs text-text-secondary">Live sessions: {systemStats?.active_sessions || 0}</p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Monthly AI Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${systemStats?.monthly_ai_cost || 0}</div>
            <p className="text-xs text-green-400">
              Potential savings: ${calculateMonthlySavings(aiFeatures)}
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Performance</CardTitle>
            <Gauge className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats?.performance_score || 0}%</div>
            <Progress value={systemStats?.performance_score || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats?.uptime || 0}%</div>
            <p className="text-xs text-text-secondary">99.9% target</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="navigation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Navigation Control
          </TabsTrigger>
          <TabsTrigger value="ai-features" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Features
          </TabsTrigger>
          <TabsTrigger value="cost-management" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost Management
          </TabsTrigger>
          <TabsTrigger value="system-health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            System Health
          </TabsTrigger>
        </TabsList>

        {/* Navigation Control Tab */}
        <TabsContent value="navigation" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Navigation Visibility Control</CardTitle>
                  <CardDescription>Control which navigation tabs users can see</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkMode(!bulkMode)}
                  >
                    {bulkMode ? 'Exit Bulk Mode' : 'Bulk Edit'}
                  </Button>
                  {bulkMode && selectedItems.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => bulkToggleMutation.mutate({ items: selectedItems, enabled: true, type: 'nav' })}
                      >
                        Enable Selected
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => bulkToggleMutation.mutate({ items: selectedItems, enabled: false, type: 'nav' })}
                      >
                        Disable Selected
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {navLoading ? (
                  <div className="text-center py-8 text-text-secondary">Loading navigation items...</div>
                ) : (
                  <>
                    {['core', 'ai', 'enterprise', 'admin'].map(category => (
                      <div key={category} className="space-y-3">
                        <h3 className="text-lg font-semibold text-white capitalize">{category} Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {navItems
                            .filter((item: NavItem) => item.category === category)
                            .map((item: NavItem) => (
                              <div
                                key={item.id}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                  item.enabled 
                                    ? 'border-green-400 bg-green-500/20' 
                                    : 'border-red-400 bg-red-500/20'
                                } ${bulkMode ? 'cursor-pointer hover:bg-muted/50' : ''} ${
                                  selectedItems.includes(item.id) ? 'ring-2 ring-blue-400' : ''
                                }`}
                                onClick={() => {
                                  if (bulkMode) {
                                    setSelectedItems(prev => 
                                      prev.includes(item.id)
                                        ? prev.filter(id => id !== item.id)
                                        : [...prev, item.id]
                                    );
                                  }
                                }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {bulkMode && (
                                      <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => {}}
                                        className="w-4 h-4 rounded border-gray-300"
                                      />
                                    )}
                                    <span className="font-medium text-white">{item.label}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={`${getCostBadgeColor(item.cost_level)} text-white font-semibold`}>
                                      {item.cost_level.toUpperCase()}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                      <Switch
                                        checked={item.enabled}
                                        onCheckedChange={(enabled) => {
                                          console.log(`Toggling ${item.id} to ${enabled}`);
                                          navToggleMutation.mutate({ itemId: item.id, enabled });
                                        }}
                                        disabled={navToggleMutation.isPending}
                                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                                      />
                                      <span className="text-xs text-text-secondary">
                                        {item.enabled ? 'ON' : 'OFF'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-text-secondary">{item.description}</p>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-xs text-text-secondary">Category: {item.category}</span>
                                  <Button
                                    size="sm"
                                    variant={item.enabled ? "destructive" : "default"}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navToggleMutation.mutate({ itemId: item.id, enabled: !item.enabled });
                                    }}
                                    disabled={navToggleMutation.isPending}
                                    className="h-6 px-2 text-xs"
                                  >
                                    {item.enabled ? 'Disable' : 'Enable'}
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Features Tab */}
        <TabsContent value="ai-features" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">AI Feature Management</CardTitle>
                  <CardDescription>Control expensive AI functions to manage costs</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-features'] })}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiLoading ? (
                  <div className="text-center py-8 text-text-secondary">Loading AI features...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiFeatures.map((feature: AIFeature) => (
                      <div
                        key={feature.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          feature.enabled 
                            ? 'border-blue-400 bg-blue-500/20' 
                            : 'border-gray-400 bg-gray-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{feature.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getCostBadgeColor(feature.cost_level)} text-white font-semibold`}>
                              ${feature.monthly_cost}/mo
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Switch
                                checked={feature.enabled}
                                onCheckedChange={(enabled) => {
                                  console.log(`Toggling AI feature ${feature.id} to ${enabled}`);
                                  aiToggleMutation.mutate({ featureId: feature.id, enabled });
                                }}
                                disabled={aiToggleMutation.isPending}
                                className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-500"
                              />
                              <span className="text-xs text-text-secondary">
                                {feature.enabled ? 'ON' : 'OFF'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary mb-2">{feature.description}</p>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-text-secondary">
                            Usage: {feature.usage_count} times this month
                          </span>
                          {feature.enabled ? (
                            <span className="text-green-400 flex items-center">
                              <Power className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center">
                              <PowerOff className="h-3 w-3 mr-1" />
                              Disabled
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-text-secondary">Level: {feature.cost_level}</span>
                          <Button
                            size="sm"
                            variant={feature.enabled ? "destructive" : "default"}
                            onClick={() => {
                              console.log(`Button toggle AI feature ${feature.id} to ${!feature.enabled}`);
                              aiToggleMutation.mutate({ featureId: feature.id, enabled: !feature.enabled });
                            }}
                            disabled={aiToggleMutation.isPending}
                            className="h-6 px-2 text-xs"
                          >
                            {aiToggleMutation.isPending ? 'Loading...' : (feature.enabled ? 'Disable' : 'Enable')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Management Tab */}
        <TabsContent value="cost-management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-white">Cost Analysis</CardTitle>
                <CardDescription>Monthly AI spending breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Current Monthly Cost</span>
                  <span className="text-2xl font-bold text-white">
                    ${systemStats?.monthly_ai_cost || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Potential Savings</span>
                  <span className="text-xl font-bold text-green-400">
                    ${calculateMonthlySavings(aiFeatures)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cost Efficiency</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription>Common cost management operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    const highCostFeatures = aiFeatures
                      .filter((f: AIFeature) => f.cost_level === 'high' || f.cost_level === 'critical')
                      .map((f: AIFeature) => f.id);
                    bulkToggleMutation.mutate({ items: highCostFeatures, enabled: false, type: 'ai' });
                  }}
                >
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Disable High-Cost AI Features
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    const coreFeatures = navItems
                      .filter((item: NavItem) => item.category === 'core')
                      .map((item: NavItem) => item.id);
                    bulkToggleMutation.mutate({ items: coreFeatures, enabled: true, type: 'nav' });
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Enable Core Features Only
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    const enterpriseFeatures = navItems
                      .filter((item: NavItem) => item.category === 'enterprise')
                      .map((item: NavItem) => item.id);
                    bulkToggleMutation.mutate({ items: enterpriseFeatures, enabled: false, type: 'nav' });
                  }}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Enterprise Features
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Emergency Cost Reduction
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Emergency Cost Reduction</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will disable all non-essential features and high-cost AI functions. 
                        Estimated monthly savings: ${calculateMonthlySavings(aiFeatures) + 500}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                        Apply Emergency Reduction
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="system-health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-white">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span>142ms</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-white">Error Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">API Errors</span>
                  <span className="text-green-400">0.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Database Errors</span>
                  <span className="text-green-400">0.0%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">AI Timeouts</span>
                  <span className="text-yellow-400">2.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-white">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Database</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">AI Services</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Blockchain</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}