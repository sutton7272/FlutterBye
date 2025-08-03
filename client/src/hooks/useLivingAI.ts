import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface LivePersonalityState {
  message: string;
  emotion: string;
  energy: number;
  suggestions: string[];
  contextualHints: string[];
  isVisible: boolean;
}

interface PlatformMood {
  overallMood: string;
  energyLevel: number;
  ambientColor: string;
  globalMessage: string;
  viralMomentum: string;
}

interface ContextualAwareness {
  ambientMessages: string[];
  dynamicHints: string[];
  personalizedSuggestions: string[];
  moodIndicators: {
    color: string;
    pulse: string;
    message: string;
  };
}

/**
 * Hook for integrating living AI personality throughout the platform
 * Provides contextual awareness and dynamic responses
 */
export function useLivingAI(pageContext: string) {
  const [personalityState, setPersonalityState] = useState<LivePersonalityState>({
    message: '',
    emotion: 'curious',
    energy: 70,
    suggestions: [],
    contextualHints: [],
    isVisible: false
  });

  const [userBehavior, setUserBehavior] = useState<any[]>([]);

  // Track user interactions for AI context
  const trackInteraction = useCallback((action: string, details?: any) => {
    const interaction = {
      action,
      details,
      timestamp: Date.now(),
      page: pageContext
    };
    
    setUserBehavior(prev => [...prev.slice(-9), interaction]); // Keep last 10 interactions
  }, [pageContext]);

  // Get platform's living mood
  const { data: platformMood, refetch: refreshMood } = useQuery<PlatformMood>({
    queryKey: ['/api/living-ai/platform-mood'],
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
    staleTime: 5 * 60 * 1000, // 5-minute stale time
  });

  // Get contextual awareness for current page
  const { data: awareness, refetch: refreshAwareness } = useQuery<ContextualAwareness>({
    queryKey: ['/api/living-ai/contextual-awareness', pageContext, userBehavior.slice(-3)],
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
    enabled: userBehavior.length > 0,
  });

  // Generate living response mutation
  const livingResponseMutation = useMutation({
    mutationFn: async (data: { action: string; context: any }) => {
      return apiRequest('/api/living-ai/generate-response', {
        method: 'POST',
        body: data
      });
    },
    onSuccess: (response) => {
      setPersonalityState({
        ...response,
        isVisible: true
      });
      
      // Auto-hide after 5 seconds unless high energy
      if (response.energy < 80) {
        setTimeout(() => {
          setPersonalityState(prev => ({ ...prev, isVisible: false }));
        }, 5000);
      }
    }
  });

  // Generate contextual response based on user action
  const respondToAction = useCallback(async (action: string, forceShow = false) => {
    trackInteraction(action);
    
    const context = {
      recentActions: userBehavior.slice(-3).map(b => b.action),
      mood: platformMood?.overallMood || 'electric',
      engagement: userBehavior.length,
      timeOfDay: new Date().getHours() < 12 ? 'morning' : 
                 new Date().getHours() < 18 ? 'afternoon' : 'evening',
      platform: pageContext
    };

    livingResponseMutation.mutate({ action, context });
  }, [userBehavior, platformMood, pageContext, livingResponseMutation, trackInteraction]);

  // Auto-trigger responses for significant actions
  useEffect(() => {
    const lastAction = userBehavior[userBehavior.length - 1];
    if (!lastAction) return;

    const significantActions = [
      'create_nft_collection',
      'buy_nft',
      'burn_nft',
      'create_token',
      'join_chat',
      'first_visit'
    ];

    if (significantActions.includes(lastAction.action)) {
      setTimeout(() => respondToAction(lastAction.action), 1000);
    }
  }, [userBehavior, respondToAction]);

  // Dismiss personality message
  const dismissPersonality = useCallback(() => {
    setPersonalityState(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Force show personality
  const showPersonality = useCallback((message?: string) => {
    if (message) {
      setPersonalityState(prev => ({
        ...prev,
        message,
        isVisible: true
      }));
    } else {
      respondToAction('manual_trigger', true);
    }
  }, [respondToAction]);

  return {
    // State
    personalityState,
    platformMood,
    awareness,
    userBehavior: userBehavior.slice(-5), // Only expose recent behavior
    
    // Actions
    trackInteraction,
    respondToAction,
    dismissPersonality,
    showPersonality,
    refreshMood,
    refreshAwareness,
    
    // Loading states
    isGenerating: livingResponseMutation.isPending,
    isMoodLoading: !platformMood,
    
    // Quick access to common properties
    platformEnergy: platformMood?.energyLevel || 70,
    ambientColor: platformMood?.ambientColor || '#00BFFF',
    currentMood: platformMood?.overallMood || 'electric',
    globalMessage: platformMood?.globalMessage || '',
    
    // Contextual suggestions
    suggestions: awareness?.personalizedSuggestions || [],
    ambientMessages: awareness?.ambientMessages || [],
    dynamicHints: awareness?.dynamicHints || []
  };
}

/**
 * Simplified hook for basic AI personality integration
 */
export function useBasicLivingAI() {
  const { data: platformMood } = useQuery<PlatformMood>({
    queryKey: ['/api/living-ai/platform-mood'],
    refetchInterval: 15 * 60 * 1000, // Less frequent for basic usage
  });

  return {
    mood: platformMood?.overallMood || 'electric',
    energy: platformMood?.energyLevel || 70,
    color: platformMood?.ambientColor || '#00BFFF',
    message: platformMood?.globalMessage || '⚡ Electric energy flows...',
    momentum: platformMood?.viralMomentum || 'Building'
  };
}