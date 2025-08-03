import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

/**
 * Hook for AI-powered content enhancement throughout the platform
 */
export function useAIContent() {
  
  // Text optimization with AI
  const textOptimizationMutation = useMutation({
    mutationFn: async (data: { 
      text: string; 
      constraints?: {
        maxLength?: number;
        tone?: string;
        purpose?: string;
        audience?: string;
      } 
    }) => {
      return apiRequest('/api/ai/optimize-text', {
        method: 'POST',
        body: data
      });
    }
  });

  // Chat suggestions with AI
  const chatSuggestionsMutation = useMutation({
    mutationFn: async (context: {
      conversationHistory?: any[];
      userMood?: string;
      messageType?: string;
      recipient?: string;
    }) => {
      return apiRequest('/api/ai/chat-suggestions', {
        method: 'POST',
        body: { context }
      });
    }
  });

  // Form enhancement with AI
  const formEnhancementMutation = useMutation({
    mutationFn: async (data: {
      formData: any;
      formType: string;
    }) => {
      return apiRequest('/api/ai/enhance-form', {
        method: 'POST',
        body: data
      });
    }
  });

  // Marketing copy generation
  const marketingGenerationMutation = useMutation({
    mutationFn: async (data: {
      product: string;
      audience: string;
      goal: string;
    }) => {
      return apiRequest('/api/ai/generate-marketing', {
        method: 'POST',
        body: data
      });
    }
  });

  // SEO optimization
  const seoOptimizationMutation = useMutation({
    mutationFn: async (data: {
      content: string;
      keywords: string[];
      purpose: string;
    }) => {
      return apiRequest('/api/ai/optimize-seo', {
        method: 'POST',
        body: data
      });
    }
  });

  // Voice message enhancement
  const voiceEnhancementMutation = useMutation({
    mutationFn: async (data: {
      transcript: string;
      audioMetadata: any;
    }) => {
      return apiRequest('/api/ai/enhance-voice', {
        method: 'POST',
        body: data
      });
    }
  });

  // Image generation suggestions
  const imageSuggestionsMutation = useMutation({
    mutationFn: async (data: {
      tokenMessage: string;
      style?: string;
    }) => {
      return apiRequest('/api/ai/generate-image-suggestions', {
        method: 'POST',
        body: data
      });
    }
  });

  // Token content generation
  const tokenContentMutation = useMutation({
    mutationFn: async (data: {
      userInput: string;
      context?: any;
    }) => {
      return apiRequest('/api/ai/generate-token-content', {
        method: 'POST',
        body: data
      });
    }
  });

  // Chat enhancement
  const chatEnhancementMutation = useMutation({
    mutationFn: async (data: {
      message: string;
      userContext?: any;
    }) => {
      return apiRequest('/api/ai/enhance-chat', {
        method: 'POST',
        body: data
      });
    }
  });

  return {
    // Text optimization
    optimizeText: textOptimizationMutation.mutate,
    optimizedText: textOptimizationMutation.data,
    isOptimizingText: textOptimizationMutation.isPending,
    
    // Chat suggestions
    getChatSuggestions: chatSuggestionsMutation.mutate,
    chatSuggestions: chatSuggestionsMutation.data,
    isGettingChatSuggestions: chatSuggestionsMutation.isPending,
    
    // Form enhancement
    enhanceForm: formEnhancementMutation.mutate,
    formEnhancement: formEnhancementMutation.data,
    isEnhancingForm: formEnhancementMutation.isPending,
    
    // Marketing generation
    generateMarketing: marketingGenerationMutation.mutate,
    marketingCopy: marketingGenerationMutation.data,
    isGeneratingMarketing: marketingGenerationMutation.isPending,
    
    // SEO optimization
    optimizeSEO: seoOptimizationMutation.mutate,
    seoOptimization: seoOptimizationMutation.data,
    isOptimizingSEO: seoOptimizationMutation.isPending,
    
    // Voice enhancement
    enhanceVoice: voiceEnhancementMutation.mutate,
    voiceEnhancement: voiceEnhancementMutation.data,
    isEnhancingVoice: voiceEnhancementMutation.isPending,
    
    // Image suggestions
    getImageSuggestions: imageSuggestionsMutation.mutate,
    imageSuggestions: imageSuggestionsMutation.data,
    isGettingImageSuggestions: imageSuggestionsMutation.isPending,
    
    // Token content
    generateTokenContent: tokenContentMutation.mutate,
    tokenContent: tokenContentMutation.data,
    isGeneratingTokenContent: tokenContentMutation.isPending,
    
    // Chat enhancement
    enhanceChat: chatEnhancementMutation.mutate,
    chatEnhancement: chatEnhancementMutation.data,
    isEnhancingChat: chatEnhancementMutation.isPending,
  };
}

/**
 * Simplified hook for basic AI text optimization
 */
export function useAITextOptimizer() {
  const [optimizedText, setOptimizedText] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizeText = async (text: string, constraints?: any) => {
    setIsOptimizing(true);
    try {
      const result = await apiRequest('/api/ai/optimize-text', {
        method: 'POST',
        body: { text, constraints }
      });
      setOptimizedText(result.optimized);
      return result;
    } catch (error) {
      console.error('Text optimization error:', error);
      return null;
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    optimizeText,
    optimizedText,
    isOptimizing
  };
}