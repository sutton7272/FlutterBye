import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface NavigationInfo {
  navItems: string[];
  routes: string[];
}

export function useFeatureToggle() {
  // Get enabled navigation items and routes
  const { data: navigationInfo, isLoading: navigationLoading } = useQuery({
    queryKey: ['features', 'navigation'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/features/navigation');
      return response as NavigationInfo;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep navigation current
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Check if a specific feature is enabled
  const checkFeature = async (featureId: string): Promise<boolean> => {
    try {
      const response = await apiRequest('GET', `/api/features/${featureId}/enabled`);
      return (response as { enabled: boolean }).enabled;
    } catch (error) {
      console.error(`Error checking feature ${featureId}:`, error);
      return false;
    }
  };

  // Check if a route is accessible
  const isRouteAccessible = (route: string): boolean => {
    if (!navigationInfo?.routes) return true; // Default to accessible if not loaded
    
    return navigationInfo.routes.some(enabledRoute => 
      enabledRoute === route || 
      (enabledRoute.includes('*') && route.startsWith(enabledRoute.replace('*', ''))) ||
      route === enabledRoute
    );
  };

  // Check if a navigation item should be shown
  const isNavItemVisible = (navItem: string): boolean => {
    if (!navigationInfo?.navItems) return true; // Default to visible if not loaded
    return navigationInfo.navItems.includes(navItem);
  };

  // Get all enabled navigation items
  const getEnabledNavItems = (): string[] => {
    return navigationInfo?.navItems || [];
  };

  // Get all enabled routes
  const getEnabledRoutes = (): string[] => {
    return navigationInfo?.routes || [];
  };

  return {
    navigationInfo,
    navigationLoading,
    checkFeature,
    isRouteAccessible,
    isNavItemVisible,
    getEnabledNavItems,
    getEnabledRoutes,
  };
}