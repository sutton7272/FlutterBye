import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';

// Optimized query hook with performance enhancements
export function useOptimizedQuery<T>(
  queryKey: string | string[],
  options?: Omit<UseQueryOptions<T>, 'queryKey'>
) {
  const optimizedOptions = useMemo(() => ({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  }), [queryKey, options]);

  return useQuery(optimizedOptions);
}

// Hook for critical data that needs immediate loading
export function useCriticalQuery<T>(
  queryKey: string | string[],
  options?: Omit<UseQueryOptions<T>, 'queryKey'>
) {
  const criticalOptions = useMemo(() => ({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    staleTime: 0, // Always fresh for critical data
    gcTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
    retryDelay: 300,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    ...options,
  }), [queryKey, options]);

  return useQuery(criticalOptions);
}

// Hook for low-priority data that can wait
export function useLowPriorityQuery<T>(
  queryKey: string | string[],
  options?: Omit<UseQueryOptions<T>, 'queryKey'>
) {
  const lowPriorityOptions = useMemo(() => ({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 0, // No retries for low priority
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true, // Can be disabled if not immediately needed
    ...options,
  }), [queryKey, options]);

  return useQuery(lowPriorityOptions);
}