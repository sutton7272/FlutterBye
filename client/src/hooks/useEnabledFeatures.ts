import { useQuery } from '@tanstack/react-query';

interface EnabledFeaturesResponse {
  enabledFeatures: string[];
}

export function useEnabledFeatures() {
  const { data, isLoading, error } = useQuery<EnabledFeaturesResponse>({
    queryKey: ['/api/feature-toggle/enabled'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
  });

  const enabledFeatures = data?.enabledFeatures || [];

  const isFeatureEnabled = (featureId: string): boolean => {
    return enabledFeatures.includes(featureId);
  };

  return {
    enabledFeatures,
    isFeatureEnabled,
    isLoading,
    error
  };
}