import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Power, 
  Shield, 
  Star, 
  Brain, 
  Building2, 
  Users, 
  CreditCard,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
  Lock
} from 'lucide-react';

interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'enterprise' | 'consumer' | 'ai' | 'social' | 'admin';
  enabled: boolean;
  requiresAuth?: boolean;
  premiumOnly?: boolean;
  dependencies?: string[];
  routes?: string[];
  apiEndpoints?: string[];
  navItems?: string[];
  adminOnly?: boolean;
  betaFeature?: boolean;
  lastUpdated: string;
  updatedBy?: string;
}

const categoryIcons = {
  core: Activity,
  enterprise: Building2,
  consumer: CreditCard,
  ai: Brain,
  social: Users,
  admin: Shield
};

const categoryColors = {
  core: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  enterprise: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  consumer: 'bg-green-500/20 text-green-300 border-green-500/30',
  ai: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  social: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  admin: 'bg-red-500/20 text-red-300 border-red-500/30'
};

const AdminFeatureToggle: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureConfig | null>(null);

  // Fetch all features
  const { data: features, isLoading } = useQuery({
    queryKey: ['admin-features'],
    queryFn: () => apiRequest('GET', '/api/admin/features')
  });

  // Fetch feature statistics
  const { data: stats } = useQuery({
    queryKey: ['admin-features-stats'],
    queryFn: () => apiRequest('GET', '/api/admin/features/stats')
  });

  // Toggle feature mutation
  const toggleFeatureMutation = useMutation({
    mutationFn: ({ featureId, enabled }: { featureId: string; enabled: boolean }) =>
      apiRequest('PUT', `/api/admin/features/${featureId}/toggle`, { enabled }),
    onSuccess: (_, { featureId, enabled }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-features'] });
      queryClient.invalidateQueries({ queryKey: ['admin-features-stats'] });
      toast({
        title: 'Feature Updated',
        description: `Feature ${enabled ? 'enabled' : 'disabled'} successfully`,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update feature status',
        variant: 'destructive',
      });
    }
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: (updates: { featureId: string; enabled: boolean }[]) =>
      apiRequest('PUT', '/api/admin/features/bulk-update', { updates }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-features'] });
      queryClient.invalidateQueries({ queryKey: ['admin-features-stats'] });
      toast({
        title: 'Bulk Update Complete',
        description: `Updated ${data.updated} features successfully`,
      });
    }
  });

  // Create feature mutation
  const createFeatureMutation = useMutation({
    mutationFn: (feature: Omit<FeatureConfig, 'lastUpdated'>) =>
      apiRequest('POST', '/api/admin/features', feature),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-features'] });
      queryClient.invalidateQueries({ queryKey: ['admin-features-stats'] });
      setSelectedFeature(null);
      toast({
        title: 'Feature Created',
        description: 'New feature added successfully',
      });
    }
  });

  // Filter features based on search and category
  const filteredFeatures = (features || []).filter((feature: FeatureConfig) => {
    const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    const matchesStatus = !showOnlyEnabled || feature.enabled;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Group features by category
  const featuresByCategory = (features || []).reduce((acc: any, feature: FeatureConfig) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {});

  const handleToggleFeature = (featureId: string, enabled: boolean) => {
    toggleFeatureMutation.mutate({ featureId, enabled });
  };

  const handleBulkEnableCategory = (category: string) => {
    const categoryFeatures = featuresByCategory[category] || [];
    const updates = categoryFeatures.map((f: FeatureConfig) => ({
      featureId: f.id,
      enabled: true
    }));
    bulkUpdateMutation.mutate(updates);
  };

  const handleBulkDisableCategory = (category: string) => {
    const categoryFeatures = featuresByCategory[category] || [];
    const updates = categoryFeatures.map((f: FeatureConfig) => ({
      featureId: f.id,
      enabled: false
    }));
    bulkUpdateMutation.mutate(updates);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Settings className="w-6 h-6 animate-spin" />
          <span>Loading feature toggles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-6 h-6" />
            <span>Feature Toggle Control Center</span>
          </CardTitle>
          <p className="text-gray-400">
            Control the availability of all FlutterAI features. Disable features to hide them from users.
          </p>
        </CardHeader>
      </Card>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-blue-900/20 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-300">{stats.total}</div>
              <p className="text-sm text-blue-400">Total Features</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-900/20 border-green-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-300">{stats.enabled}</div>
              <p className="text-sm text-green-400">Enabled</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-900/20 border-red-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-300">{stats.disabled}</div>
              <p className="text-sm text-red-400">Disabled</p>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-900/20 border-yellow-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-300">{stats.beta}</div>
              <p className="text-sm text-yellow-400">Beta Features</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Features</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">Category Filter</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="core">Core Platform</SelectItem>
                  <SelectItem value="ai">AI Features</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end space-x-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled-only"
                  checked={showOnlyEnabled}
                  onCheckedChange={setShowOnlyEnabled}
                />
                <Label htmlFor="enabled-only">Enabled Only</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Feature List</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFeatures.map((feature: FeatureConfig) => {
              const CategoryIcon = categoryIcons[feature.category];
              return (
                <Card key={feature.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <CategoryIcon className="w-5 h-5 text-gray-400" />
                        <h3 className="font-medium">{feature.name}</h3>
                      </div>
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={(enabled) => handleToggleFeature(feature.id, enabled)}
                        disabled={toggleFeatureMutation.isPending}
                      />
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3">{feature.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge 
                        variant="outline" 
                        className={categoryColors[feature.category]}
                      >
                        {feature.category}
                      </Badge>
                      
                      {feature.betaFeature && (
                        <Badge variant="outline" className="text-orange-300 border-orange-500/30">
                          <Star className="w-3 h-3 mr-1" />
                          Beta
                        </Badge>
                      )}
                      
                      {feature.premiumOnly && (
                        <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                          <Lock className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      
                      {feature.adminOnly && (
                        <Badge variant="outline" className="text-red-300 border-red-500/30">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin Only
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {feature.enabled ? (
                          <CheckCircle className="w-4 h-4 text-green-400 inline mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 inline mr-1" />
                        )}
                        {feature.enabled ? 'Active' : 'Disabled'}
                      </span>
                      <span>Updated: {new Date(feature.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    
                    {(feature.routes || feature.apiEndpoints || feature.navItems) && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="text-xs text-gray-500">
                          {feature.routes && (
                            <div>Routes: {feature.routes.join(', ')}</div>
                          )}
                          {feature.navItems && (
                            <div>Nav: {feature.navItems.join(', ')}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {Object.entries(featuresByCategory).map(([category, categoryFeatures]: [string, any]) => {
            const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
            const enabledCount = categoryFeatures.filter((f: FeatureConfig) => f.enabled).length;
            
            return (
              <Card key={category} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CategoryIcon className="w-5 h-5" />
                      <CardTitle className="capitalize">{category} Features</CardTitle>
                      <Badge variant="outline">
                        {enabledCount}/{categoryFeatures.length} enabled
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkEnableCategory(category)}
                        disabled={bulkUpdateMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Enable All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkDisableCategory(category)}
                        disabled={bulkUpdateMutation.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Disable All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryFeatures.map((feature: FeatureConfig) => (
                      <div
                        key={feature.id}
                        className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{feature.name}</div>
                          <div className="text-sm text-gray-400">{feature.description}</div>
                        </div>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={(enabled) => handleToggleFeature(feature.id, enabled)}
                          disabled={toggleFeatureMutation.isPending}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
              <p className="text-gray-400">
                Perform actions on multiple features at once.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const updates = (features || []).map((f: FeatureConfig) => ({
                      featureId: f.id,
                      enabled: true
                    }));
                    bulkUpdateMutation.mutate(updates);
                  }}
                  disabled={bulkUpdateMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Enable All
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const updates = (features || []).map((f: FeatureConfig) => ({
                      featureId: f.id,
                      enabled: false
                    }));
                    bulkUpdateMutation.mutate(updates);
                  }}
                  disabled={bulkUpdateMutation.isPending}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Disable All
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const coreFeatures = (features || [])
                      .filter((f: FeatureConfig) => f.category === 'core')
                      .map((f: FeatureConfig) => ({ featureId: f.id, enabled: true }));
                    bulkUpdateMutation.mutate(coreFeatures);
                  }}
                  disabled={bulkUpdateMutation.isPending}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Core Only
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const betaFeatures = (features || [])
                      .map((f: FeatureConfig) => ({ 
                        featureId: f.id, 
                        enabled: f.betaFeature ? false : f.enabled 
                      }));
                    bulkUpdateMutation.mutate(betaFeatures);
                  }}
                  disabled={bulkUpdateMutation.isPending}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Disable Beta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFeatureToggle;