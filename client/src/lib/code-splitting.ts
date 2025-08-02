import { lazy, ComponentType } from 'react';

/**
 * Advanced code splitting utilities with loading states and error boundaries
 */

// Enhanced lazy loading with retry mechanism
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  componentName: string = 'Component'
) {
  return lazy(async () => {
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        return await componentImport();
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          console.error(`Failed to load ${componentName} after ${maxRetries} attempts:`, error);
          throw error;
        }
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }
    
    throw new Error(`Failed to load ${componentName}`);
  });
}

// Preload components for better UX
export const preloadComponent = (componentImport: () => Promise<any>) => {
  const componentPromise = componentImport();
  return componentPromise;
};

// Bundle splitting by feature
export const FeatureComponents = {
  // Core features - always loaded
  Home: lazy(() => import("@/pages/home")),
  Marketplace: lazy(() => import("@/pages/marketplace")),
  Mint: lazy(() => import("@/pages/mint")),
  
  // Secondary features - load on demand
  Portfolio: lazy(() => import("@/pages/portfolio")),
  Activity: lazy(() => import("@/pages/activity")),
  Explore: lazy(() => import("@/pages/explore")),
  
  // Advanced features - lazy loaded
  Admin: lazyWithRetry(() => import("@/pages/admin-unified"), 'AdminDashboard'),
  Chat: lazyWithRetry(() => import("@/pages/chat"), 'Chat'),
  LimitedEdition: lazyWithRetry(() => import("@/pages/limited-edition"), 'LimitedEdition'),
  
  // Enterprise features - separate bundle
  EnterpriseCampaigns: lazyWithRetry(() => import("@/pages/enterprise-campaigns"), 'EnterpriseCampaigns'),
  FlbyStaking: lazyWithRetry(() => import("@/pages/flby-staking"), 'FlbyStaking'),
  FlbyGovernance: lazyWithRetry(() => import("@/pages/flby-governance"), 'FlbyGovernance'),
  
  // Utility pages - minimal bundle
  HowItWorks: lazy(() => import("@/pages/how-it-works")),
  Info: lazy(() => import("@/pages/info")),
  NotFound: lazy(() => import("@/pages/not-found"))
};

// Component preloading based on user behavior
export const ComponentPreloader = {
  // Preload likely next components
  preloadCoreFeatures: () => {
    preloadComponent(() => import("@/pages/marketplace"));
    preloadComponent(() => import("@/pages/mint"));
    preloadComponent(() => import("@/pages/portfolio"));
  },
  
  // Preload admin features for admin users
  preloadAdminFeatures: () => {
    preloadComponent(() => import("@/pages/admin-unified"));
    preloadComponent(() => import("@/pages/admin-analytics"));
  },
  
  // Preload enterprise features for enterprise users
  preloadEnterpriseFeatures: () => {
    preloadComponent(() => import("@/pages/enterprise-campaigns"));
    preloadComponent(() => import("@/pages/flby-staking"));
  }
};

// Route-based code splitting configuration
export const RouteConfig = {
  core: ['/home', '/marketplace', '/mint', '/portfolio'],
  secondary: ['/activity', '/explore', '/how-it-works'],
  advanced: ['/admin', '/chat', '/limited-edition'],
  enterprise: ['/enterprise-campaigns', '/flby-staking', '/flby-governance'],
  utility: ['/info', '/not-found']
};

// Dynamic import with performance tracking
export const trackDynamicImport = async (
  componentName: string,
  importFunction: () => Promise<any>
) => {
  const startTime = performance.now();
  
  try {
    const result = await importFunction();
    const loadTime = performance.now() - startTime;
    
    // Track loading performance
    console.log(`${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    
    return result;
  } catch (error) {
    console.error(`Failed to load ${componentName}:`, error);
    throw error;
  }
};