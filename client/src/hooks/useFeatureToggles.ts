import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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

export function useFeatureToggles() {
  const { data: features, isLoading, error } = useQuery({
    queryKey: ['feature-toggles'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/features');
      return response.json() as Promise<FeatureConfig[]>;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });

  // Create a map for quick lookups
  const featureMap = (features || []).reduce((acc, feature) => {
    acc[feature.id] = feature;
    return acc;
  }, {} as Record<string, FeatureConfig>);

  // Helper function to check if a feature is enabled
  const isFeatureEnabled = (featureId: string): boolean => {
    const feature = featureMap[featureId];
    return feature?.enabled ?? false;
  };

  // Helper function to check if a route is enabled
  const isRouteEnabled = (route: string): boolean => {
    // Check if any feature controls this route
    for (const feature of features || []) {
      if (feature.routes?.includes(route) || feature.navItems?.includes(route)) {
        return feature.enabled;
      }
    }
    // If no feature controls this route, it's enabled by default
    return true;
  };

  return {
    features: features || [],
    featureMap,
    isFeatureEnabled,
    isRouteEnabled,
    isLoading,
    error,
  };
}