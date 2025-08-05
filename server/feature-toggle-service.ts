// Feature Toggle Service for Phased Release Management

interface FeatureToggle {
  featureId: string;
  name: string;
  description: string;
  category: 'core' | 'advanced' | 'enterprise' | 'ai' | 'analytics';
  enabled: boolean;
  requiresAuth: boolean;
  dependencies?: string[];
  aiEndpoints?: string[];
  estimatedApiCost?: number; // Monthly cost in USD
}

interface AIEndpointConfig {
  endpoint: string;
  description: string;
  category: 'essential' | 'enhancement' | 'advanced' | 'experimental';
  monthlyRequestEstimate: number;
  costPerRequest: number;
  requiredFeatures: string[];
}

class FeatureToggleService {
  private features: Map<string, FeatureToggle> = new Map();
  private aiEndpoints: Map<string, AIEndpointConfig> = new Map();

  constructor() {
    this.initializeFeatures();
    this.initializeAIEndpoints();
  }

  // ========== FEATURE DEFINITIONS ==========
  
  private initializeFeatures() {
    const defaultFeatures: FeatureToggle[] = [
      // === CORE FEATURES (MVP) ===
      {
        featureId: 'core_coin_minting',
        name: 'Coin Minting',
        description: 'Core SMS-to-blockchain token creation',
        category: 'core',
        enabled: true,
        requiresAuth: true,
        aiEndpoints: ['emotion_analysis', 'message_optimization'],
        estimatedApiCost: 50
      },
      {
        featureId: 'core_address_capture',
        name: 'Address Intelligence Capture',
        description: 'Basic wallet address collection and scoring',
        category: 'core',
        enabled: true,
        requiresAuth: false,
        aiEndpoints: ['address_scoring'],
        estimatedApiCost: 30
      },
      {
        featureId: 'core_user_management',
        name: 'User Authentication',
        description: 'Basic user registration and login',
        category: 'core',
        enabled: true,
        requiresAuth: false,
        estimatedApiCost: 0
      },

      // === ADVANCED FEATURES ===
      {
        featureId: 'advanced_analytics',
        name: 'Analytics Dashboard',
        description: 'Advanced user analytics and intelligence reporting',
        category: 'advanced',
        enabled: false, // Disabled for MVP
        requiresAuth: true,
        dependencies: ['core_address_capture'],
        aiEndpoints: ['predictive_analytics', 'behavior_analysis'],
        estimatedApiCost: 150
      },
      {
        featureId: 'advanced_flutterwave',
        name: 'FlutterWave Product',
        description: 'Advanced butterfly-effect messaging with AI avatars',
        category: 'advanced',
        enabled: false, // Disabled for MVP
        requiresAuth: true,
        dependencies: ['core_coin_minting'],
        aiEndpoints: ['aria_companion', 'emotion_spectrum', 'viral_prediction'],
        estimatedApiCost: 200
      },
      {
        featureId: 'advanced_trending',
        name: 'Viral Trending',
        description: 'Advanced viral content discovery and tracking',
        category: 'advanced',
        enabled: false, // Disabled for MVP
        requiresAuth: false,
        dependencies: ['advanced_analytics'],
        aiEndpoints: ['viral_analysis', 'trend_prediction'],
        estimatedApiCost: 100
      },

      // === ENTERPRISE FEATURES ===
      {
        featureId: 'enterprise_api',
        name: 'Data-as-a-Service API',
        description: 'Enterprise API for address intelligence',
        category: 'enterprise',
        enabled: false, // Future release
        requiresAuth: true,
        dependencies: ['advanced_analytics'],
        estimatedApiCost: 0 // Revenue generating
      },
      {
        featureId: 'enterprise_government',
        name: 'Government Sales Portal',
        description: 'Specialized government and law enforcement features',
        category: 'enterprise',
        enabled: false, // Future release
        requiresAuth: true,
        dependencies: ['enterprise_api'],
        estimatedApiCost: 0
      },
      {
        featureId: 'enterprise_compliance',
        name: 'Advanced Compliance',
        description: 'Enterprise compliance monitoring and reporting',
        category: 'enterprise',
        enabled: false, // Future release
        requiresAuth: true,
        dependencies: ['enterprise_api'],
        aiEndpoints: ['compliance_analysis'],
        estimatedApiCost: 75
      },

      // === AI FEATURES ===
      {
        featureId: 'ai_living_personality',
        name: 'Living AI Personality',
        description: 'Advanced AI personality with dynamic responses',
        category: 'ai',
        enabled: false, // Disabled for MVP
        requiresAuth: false,
        aiEndpoints: ['living_ai', 'mood_sync', 'personality_evolution'],
        estimatedApiCost: 300
      },
      {
        featureId: 'ai_content_generation',
        name: 'AI Content Generation',
        description: 'Advanced AI-powered content creation',
        category: 'ai',
        enabled: false, // Disabled for MVP
        requiresAuth: true,
        aiEndpoints: ['content_generation', 'seo_optimization'],
        estimatedApiCost: 120
      },
      {
        featureId: 'ai_admin_insights',
        name: 'AI Admin Insights',
        description: 'AI-powered admin dashboard insights',
        category: 'ai',
        enabled: false, // Disabled for MVP
        requiresAuth: true,
        dependencies: ['advanced_analytics'],
        aiEndpoints: ['admin_insights', 'user_analysis'],
        estimatedApiCost: 80
      },

      // === DATA PROTECTION ===
      {
        featureId: 'data_mirrors',
        name: 'Data Mirror System',
        description: 'Advanced data mirroring and backup system',
        category: 'advanced',
        enabled: false, // Disabled for MVP
        requiresAuth: true,
        dependencies: ['core_address_capture'],
        estimatedApiCost: 20
      },
      {
        featureId: 'data_export',
        name: 'Data Export System',
        description: 'Comprehensive database export capabilities',
        category: 'advanced',
        enabled: false, // Disabled for MVP
        requiresAuth: true,
        dependencies: ['data_mirrors'],
        estimatedApiCost: 10
      }
    ];

    defaultFeatures.forEach(feature => {
      this.features.set(feature.featureId, feature);
    });
  }

  // ========== AI ENDPOINT DEFINITIONS ==========
  
  private initializeAIEndpoints() {
    const aiEndpoints: AIEndpointConfig[] = [
      // === ESSENTIAL AI (Keep for MVP) ===
      {
        endpoint: 'emotion_analysis',
        description: 'Basic emotion detection for token creation',
        category: 'essential',
        monthlyRequestEstimate: 5000,
        costPerRequest: 0.002,
        requiredFeatures: ['core_coin_minting']
      },
      {
        endpoint: 'message_optimization',
        description: 'Basic message enhancement for tokens',
        category: 'essential',
        monthlyRequestEstimate: 3000,
        costPerRequest: 0.002,
        requiredFeatures: ['core_coin_minting']
      },
      {
        endpoint: 'address_scoring',
        description: 'Basic wallet address intelligence scoring',
        category: 'essential',
        monthlyRequestEstimate: 10000,
        costPerRequest: 0.001,
        requiredFeatures: ['core_address_capture']
      },

      // === ENHANCEMENT AI (Disable for MVP) ===
      {
        endpoint: 'predictive_analytics',
        description: 'Advanced user behavior prediction',
        category: 'enhancement',
        monthlyRequestEstimate: 15000,
        costPerRequest: 0.003,
        requiredFeatures: ['advanced_analytics']
      },
      {
        endpoint: 'behavior_analysis',
        description: 'Deep behavioral pattern analysis',
        category: 'enhancement',
        monthlyRequestEstimate: 8000,
        costPerRequest: 0.004,
        requiredFeatures: ['advanced_analytics']
      },
      {
        endpoint: 'aria_companion',
        description: 'AI companion conversational system',
        category: 'enhancement',
        monthlyRequestEstimate: 12000,
        costPerRequest: 0.005,
        requiredFeatures: ['advanced_flutterwave']
      },

      // === ADVANCED AI (Disable for MVP) ===
      {
        endpoint: 'living_ai',
        description: 'Advanced living AI personality system',
        category: 'advanced',
        monthlyRequestEstimate: 20000,
        costPerRequest: 0.006,
        requiredFeatures: ['ai_living_personality']
      },
      {
        endpoint: 'viral_prediction',
        description: 'Advanced viral content prediction',
        category: 'advanced',
        monthlyRequestEstimate: 6000,
        costPerRequest: 0.004,
        requiredFeatures: ['advanced_flutterwave', 'advanced_trending']
      },
      {
        endpoint: 'content_generation',
        description: 'AI content creation and optimization',
        category: 'advanced',
        monthlyRequestEstimate: 10000,
        costPerRequest: 0.003,
        requiredFeatures: ['ai_content_generation']
      },

      // === EXPERIMENTAL AI (Disable for MVP) ===
      {
        endpoint: 'personality_evolution',
        description: 'Self-evolving AI personality traits',
        category: 'experimental',
        monthlyRequestEstimate: 5000,
        costPerRequest: 0.008,
        requiredFeatures: ['ai_living_personality']
      },
      {
        endpoint: 'quantum_content',
        description: 'Quantum-inspired content generation',
        category: 'experimental',
        monthlyRequestEstimate: 3000,
        costPerRequest: 0.010,
        requiredFeatures: ['ai_content_generation']
      },
      {
        endpoint: 'compliance_analysis',
        description: 'Advanced regulatory compliance analysis',
        category: 'experimental',
        monthlyRequestEstimate: 2000,
        costPerRequest: 0.005,
        requiredFeatures: ['enterprise_compliance']
      }
    ];

    aiEndpoints.forEach(endpoint => {
      this.aiEndpoints.set(endpoint.endpoint, endpoint);
    });
  }

  // ========== FEATURE MANAGEMENT ==========
  
  isFeatureEnabled(featureId: string): boolean {
    const feature = this.features.get(featureId);
    return feature ? feature.enabled : false;
  }

  enableFeature(featureId: string): boolean {
    const feature = this.features.get(featureId);
    if (!feature) return false;

    // Check dependencies
    if (feature.dependencies) {
      for (const dep of feature.dependencies) {
        if (!this.isFeatureEnabled(dep)) {
          throw new Error(`Cannot enable ${featureId}: dependency ${dep} is not enabled`);
        }
      }
    }

    feature.enabled = true;
    return true;
  }

  disableFeature(featureId: string): boolean {
    const feature = this.features.get(featureId);
    if (!feature) return false;

    // Check if other features depend on this one
    const dependentFeatures = Array.from(this.features.values())
      .filter(f => f.dependencies?.includes(featureId) && f.enabled);
    
    if (dependentFeatures.length > 0) {
      throw new Error(`Cannot disable ${featureId}: required by ${dependentFeatures.map(f => f.name).join(', ')}`);
    }

    feature.enabled = false;
    return true;
  }

  getAllFeatures(): FeatureToggle[] {
    return Array.from(this.features.values());
  }

  getEnabledFeatures(): FeatureToggle[] {
    return Array.from(this.features.values()).filter(f => f.enabled);
  }

  // ========== AI OPTIMIZATION ==========
  
  getActiveAIEndpoints(): AIEndpointConfig[] {
    const enabledFeatures = this.getEnabledFeatures().map(f => f.featureId);
    
    return Array.from(this.aiEndpoints.values()).filter(endpoint => {
      return endpoint.requiredFeatures.some(feature => enabledFeatures.includes(feature));
    });
  }

  getInactiveAIEndpoints(): AIEndpointConfig[] {
    const enabledFeatures = this.getEnabledFeatures().map(f => f.featureId);
    
    return Array.from(this.aiEndpoints.values()).filter(endpoint => {
      return !endpoint.requiredFeatures.some(feature => enabledFeatures.includes(feature));
    });
  }

  calculateMonthlyCosts(): {
    featureCosts: { feature: string; cost: number }[];
    aiCosts: { endpoint: string; cost: number }[];
    totalFeatureCost: number;
    totalAICost: number;
    totalCost: number;
  } {
    const enabledFeatures = this.getEnabledFeatures();
    const activeAI = this.getActiveAIEndpoints();

    const featureCosts = enabledFeatures.map(f => ({
      feature: f.name,
      cost: f.estimatedApiCost || 0
    }));

    const aiCosts = activeAI.map(ai => ({
      endpoint: ai.endpoint,
      cost: ai.monthlyRequestEstimate * ai.costPerRequest
    }));

    const totalFeatureCost = featureCosts.reduce((sum, f) => sum + f.cost, 0);
    const totalAICost = aiCosts.reduce((sum, ai) => sum + ai.cost, 0);

    return {
      featureCosts,
      aiCosts,
      totalFeatureCost,
      totalAICost,
      totalCost: totalFeatureCost + totalAICost
    };
  }

  // ========== LAUNCH RECOMMENDATIONS ==========
  
  getMVPRecommendations(): {
    enabledFeatures: string[];
    disabledFeatures: string[];
    essentialAI: string[];
    disabledAI: string[];
    estimatedMonthlyCost: number;
    reasoning: string;
  } {
    const mvpFeatures = ['core_coin_minting', 'core_address_capture', 'core_user_management'];
    const essentialAI = ['emotion_analysis', 'message_optimization', 'address_scoring'];
    
    const allFeatures = this.getAllFeatures();
    const disabledFeatures = allFeatures
      .filter(f => !mvpFeatures.includes(f.featureId))
      .map(f => f.featureId);

    const allAI = Array.from(this.aiEndpoints.keys());
    const disabledAI = allAI.filter(ai => !essentialAI.includes(ai));

    // Calculate MVP costs
    const mvpFeatureCost = mvpFeatures.reduce((sum, fId) => {
      const feature = this.features.get(fId);
      return sum + (feature?.estimatedApiCost || 0);
    }, 0);

    const mvpAICost = essentialAI.reduce((sum, aiId) => {
      const ai = this.aiEndpoints.get(aiId);
      return sum + (ai ? ai.monthlyRequestEstimate * ai.costPerRequest : 0);
    }, 0);

    return {
      enabledFeatures: mvpFeatures,
      disabledFeatures,
      essentialAI,
      disabledAI,
      estimatedMonthlyCost: mvpFeatureCost + mvpAICost,
      reasoning: "MVP focuses on core coin minting and basic address intelligence. Advanced features like FlutterWave, analytics dashboards, and AI personalities are disabled to reduce complexity and API costs. Essential AI endpoints for emotion analysis and address scoring remain active."
    };
  }
}

export const featureToggleService = new FeatureToggleService();
export type { FeatureToggle, AIEndpointConfig };