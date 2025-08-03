import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

/**
 * Hook for AI-powered admin features and insights
 */
export function useAIAdmin() {
  
  // User insights with AI
  const userInsightsMutation = useMutation({
    mutationFn: async (userBehaviorData: any[]) => {
      return apiRequest('/api/admin/ai-insights', {
        method: 'POST',
        body: { userBehaviorData }
      });
    }
  });

  // Security analysis with AI
  const securityAnalysisMutation = useMutation({
    mutationFn: async (data: {
      securityLogs: any[];
      systemMetrics: any;
    }) => {
      return apiRequest('/api/admin/security-analysis', {
        method: 'POST',
        body: data
      });
    }
  });

  // Performance optimization with AI
  const performanceOptimizationMutation = useMutation({
    mutationFn: async (performanceMetrics: any) => {
      return apiRequest('/api/admin/performance-optimization', {
        method: 'POST',
        body: { performanceMetrics }
      });
    }
  });

  // Revenue optimization with AI
  const revenueOptimizationMutation = useMutation({
    mutationFn: async (data: {
      revenueData: any;
      userMetrics: any;
    }) => {
      return apiRequest('/api/admin/revenue-optimization', {
        method: 'POST',
        body: data
      });
    }
  });

  // Get AI insights for admin dashboard
  const { data: aiInsights, refetch: refetchInsights } = useQuery({
    queryKey: ['/api/admin/ai-insights'],
    enabled: false // Only fetch when explicitly called
  });

  return {
    // User insights
    generateUserInsights: userInsightsMutation.mutate,
    userInsights: userInsightsMutation.data,
    isGeneratingUserInsights: userInsightsMutation.isPending,
    
    // Security analysis
    analyzeSecurityThreats: securityAnalysisMutation.mutate,
    securityAnalysis: securityAnalysisMutation.data,
    isAnalyzingSecurity: securityAnalysisMutation.isPending,
    
    // Performance optimization
    optimizePerformance: performanceOptimizationMutation.mutate,
    performanceOptimization: performanceOptimizationMutation.data,
    isOptimizingPerformance: performanceOptimizationMutation.isPending,
    
    // Revenue optimization
    optimizeRevenue: revenueOptimizationMutation.mutate,
    revenueOptimization: revenueOptimizationMutation.data,
    isOptimizingRevenue: revenueOptimizationMutation.isPending,
    
    // Dashboard insights
    aiInsights,
    refetchInsights,
    
    // Helper functions
    analyzeUserBehavior: (behaviorData: any[]) => {
      userInsightsMutation.mutate(behaviorData);
    },
    
    analyzeSystemSecurity: (logs: any[], metrics: any) => {
      securityAnalysisMutation.mutate({ securityLogs: logs, systemMetrics: metrics });
    },
    
    optimizeSystemPerformance: (metrics: any) => {
      performanceOptimizationMutation.mutate(metrics);
    },
    
    optimizeBusinessRevenue: (revenueData: any, userMetrics: any) => {
      revenueOptimizationMutation.mutate({ revenueData, userMetrics });
    }
  };
}

/**
 * Hook for real-time AI admin monitoring
 */
export function useAIAdminMonitoring() {
  const { data: liveInsights } = useQuery({
    queryKey: ['/api/admin/ai-insights/live'],
    refetchInterval: 30000, // Every 30 seconds
    retry: false
  });

  const { data: securityMonitoring } = useQuery({
    queryKey: ['/api/admin/security-monitoring/ai'],
    refetchInterval: 15000, // Every 15 seconds
    retry: false
  });

  const { data: performanceInsights } = useQuery({
    queryKey: ['/api/admin/performance-insights/ai'],
    refetchInterval: 60000, // Every minute
    retry: false
  });

  return {
    liveInsights,
    securityMonitoring,
    performanceInsights,
    isMonitoring: true
  };
}