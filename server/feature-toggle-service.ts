// Feature Toggle Service for FlutterAI
// Centralized control system for all platform features

export interface FeatureConfig {
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

export class FeatureToggleService {
  private static features = new Map<string, FeatureConfig>();
  
  // Initialize all FlutterAI features
  static initializeFeatures() {
    const defaultFeatures: FeatureConfig[] = [
      // Core Platform Features
      {
        id: 'home',
        name: 'Home Dashboard',
        description: 'Main landing page and user dashboard',
        category: 'core',
        enabled: true,
        routes: ['/home', '/'],
        navItems: ['Home'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'mint',
        name: 'Token Minting',
        description: 'Create and mint new tokens',
        category: 'core',
        enabled: true,
        routes: ['/mint'],
        apiEndpoints: ['/api/tokens/create'],
        navItems: ['Mint'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'marketplace',
        name: 'Token Marketplace',
        description: 'Buy, sell, and trade tokens',
        category: 'core',
        enabled: true,
        routes: ['/marketplace'],
        apiEndpoints: ['/api/marketplace/*'],
        navItems: ['Marketplace'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'portfolio',
        name: 'Portfolio Management',
        description: 'View and manage user portfolio',
        category: 'core',
        enabled: true,
        routes: ['/portfolio', '/redeem'],
        apiEndpoints: ['/api/users/*/holdings'],
        navItems: ['Dashboard'],
        requiresAuth: true,
        lastUpdated: new Date().toISOString()
      },
      
      // AI Features
      {
        id: 'flutterai',
        name: 'FlutterAI Intelligence',
        description: 'AI-powered wallet analysis and insights',
        category: 'ai',
        enabled: true,
        routes: ['/flutterai-dashboard'],
        apiEndpoints: ['/api/flutterai/*'],
        navItems: ['FlutterAI'],
        premiumOnly: true,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ai_hub',
        name: 'AI Hub',
        description: 'Central AI features and ARIA chat',
        category: 'ai',
        enabled: true,
        routes: ['/ai-overview', '/ai-showcase', '/living-ai'],
        apiEndpoints: ['/api/ai/*'],
        navItems: ['AI Hub'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'celestial_wallet',
        name: 'Celestial Wallet Personalization',
        description: 'AI-powered cosmic wallet personalization',
        category: 'ai',
        enabled: true,
        routes: ['/celestial', '/cosmic-wallet'],
        apiEndpoints: ['/api/celestial/*'],
        betaFeature: true,
        lastUpdated: new Date().toISOString()
      },
      
      // Enterprise Features
      {
        id: 'enterprise_intelligence',
        name: 'Enterprise Intelligence APIs',
        description: 'Professional blockchain intelligence for enterprises',
        category: 'enterprise',
        enabled: true,
        routes: ['/enterprise-intelligence'],
        apiEndpoints: ['/api/enterprise/*'],
        premiumOnly: true,
        adminOnly: true,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'government_apis',
        name: 'Government Intelligence APIs',
        description: 'Government-grade blockchain analysis tools',
        category: 'enterprise',
        enabled: true,
        apiEndpoints: ['/api/government/*'],
        premiumOnly: true,
        adminOnly: true,
        lastUpdated: new Date().toISOString()
      },
      
      // Social Features
      {
        id: 'chat',
        name: 'Real-time Chat',
        description: 'Multi-room chat system with AI integration',
        category: 'social',
        enabled: true,
        routes: ['/chat'],
        apiEndpoints: ['/api/chat/*'],
        navItems: ['Chat'],
        requiresAuth: true,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'flutterwave',
        name: 'FlutterWave Messaging',
        description: 'AI-powered butterfly effect messaging',
        category: 'social',
        enabled: true,
        routes: ['/sms-nexus'],
        apiEndpoints: ['/api/sms/*'],
        navItems: ['FlutterWave'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'message_nfts',
        name: 'FlutterArt NFTs',
        description: 'Create and collect message NFTs',
        category: 'social',
        enabled: true,
        routes: ['/message-nfts', '/nft-marketplace'],
        apiEndpoints: ['/api/message-nfts/*'],
        navItems: ['FlutterArt'],
        lastUpdated: new Date().toISOString()
      },
      
      // Consumer Features
      {
        id: 'payments',
        name: 'Payment System',
        description: 'Stripe-powered payment processing',
        category: 'consumer',
        enabled: true,
        routes: ['/payments', '/subscribe'],
        apiEndpoints: ['/api/create-payment-intent', '/api/get-or-create-subscription'],
        navItems: ['Payments'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'greeting_cards',
        name: 'Digital Greeting Cards',
        description: 'Create and send personalized greeting cards',
        category: 'consumer',
        enabled: true,
        routes: ['/greeting-cards'],
        navItems: ['Cards'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'viral_trending',
        name: 'Viral Trending System',
        description: 'Track and promote viral content',
        category: 'consumer',
        enabled: true,
        routes: ['/trending', '/viral-dashboard'],
        apiEndpoints: ['/api/viral/*'],
        lastUpdated: new Date().toISOString()
      },
      
      // Admin Features
      {
        id: 'admin_dashboard',
        name: 'Admin Dashboard',
        description: 'Comprehensive admin control panel',
        category: 'admin',
        enabled: true,
        routes: ['/admin', '/admin-unified'],
        apiEndpoints: ['/api/admin/*'],
        navItems: ['Admin'],
        adminOnly: true,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'feature_toggles',
        name: 'Feature Toggle Control',
        description: 'Control feature availability across the platform',
        category: 'admin',
        enabled: true,
        routes: ['/admin/features'],
        apiEndpoints: ['/api/admin/features/*'],
        adminOnly: true,
        lastUpdated: new Date().toISOString()
      }
    ];

    // Initialize all features
    defaultFeatures.forEach(feature => {
      this.features.set(feature.id, feature);
    });

    console.log(`🎛️ Feature Toggle Service initialized with ${defaultFeatures.length} features`);
  }

  // Get all features
  static getAllFeatures(): FeatureConfig[] {
    return Array.from(this.features.values());
  }

  // Get features by category
  static getFeaturesByCategory(category: FeatureConfig['category']): FeatureConfig[] {
    return Array.from(this.features.values()).filter(f => f.category === category);
  }

  // Check if feature is enabled
  static isFeatureEnabled(featureId: string): boolean {
    const feature = this.features.get(featureId);
    return feature ? feature.enabled : false;
  }

  // Enable/disable feature
  static toggleFeature(featureId: string, enabled: boolean, updatedBy?: string): boolean {
    const feature = this.features.get(featureId);
    if (!feature) {
      return false;
    }

    feature.enabled = enabled;
    feature.lastUpdated = new Date().toISOString();
    if (updatedBy) {
      feature.updatedBy = updatedBy;
    }

    this.features.set(featureId, feature);

    console.log(`🎛️ Feature ${featureId} ${enabled ? 'enabled' : 'disabled'} by ${updatedBy || 'system'}`);
    return true;
  }

  // Bulk update features
  static bulkUpdateFeatures(updates: { featureId: string; enabled: boolean }[], updatedBy?: string): number {
    let updated = 0;
    updates.forEach(update => {
      if (this.toggleFeature(update.featureId, update.enabled, updatedBy)) {
        updated++;
      }
    });
    return updated;
  }

  // Get enabled navigation items
  static getEnabledNavItems(): string[] {
    const enabledFeatures = Array.from(this.features.values())
      .filter(f => f.enabled && f.navItems)
      .flatMap(f => f.navItems || []);
    
    return [...new Set(enabledFeatures)]; // Remove duplicates
  }

  // Get enabled routes
  static getEnabledRoutes(): string[] {
    const enabledFeatures = Array.from(this.features.values())
      .filter(f => f.enabled && f.routes)
      .flatMap(f => f.routes || []);
    
    return [...new Set(enabledFeatures)]; // Remove duplicates
  }

  // Get enabled API endpoints
  static getEnabledApiEndpoints(): string[] {
    const enabledFeatures = Array.from(this.features.values())
      .filter(f => f.enabled && f.apiEndpoints)
      .flatMap(f => f.apiEndpoints || []);
    
    return [...new Set(enabledFeatures)]; // Remove duplicates
  }

  // Check if route is accessible
  static isRouteAccessible(route: string): boolean {
    return Array.from(this.features.values()).some(feature => 
      feature.enabled && feature.routes?.some(r => 
        r === route || (r.includes('*') && route.startsWith(r.replace('*', '')))
      )
    );
  }

  // Check if API endpoint is accessible
  static isApiEndpointAccessible(endpoint: string): boolean {
    return Array.from(this.features.values()).some(feature => 
      feature.enabled && feature.apiEndpoints?.some(api => 
        api === endpoint || (api.includes('*') && endpoint.startsWith(api.replace('*', '')))
      )
    );
  }

  // Get feature statistics
  static getFeatureStats(): {
    total: number;
    enabled: number;
    disabled: number;
    byCategory: Record<string, { total: number; enabled: number }>;
    beta: number;
    premium: number;
    adminOnly: number;
  } {
    const allFeatures = Array.from(this.features.values());
    const enabled = allFeatures.filter(f => f.enabled).length;
    
    const byCategory: Record<string, { total: number; enabled: number }> = {};
    allFeatures.forEach(feature => {
      if (!byCategory[feature.category]) {
        byCategory[feature.category] = { total: 0, enabled: 0 };
      }
      byCategory[feature.category].total++;
      if (feature.enabled) {
        byCategory[feature.category].enabled++;
      }
    });

    return {
      total: allFeatures.length,
      enabled,
      disabled: allFeatures.length - enabled,
      byCategory,
      beta: allFeatures.filter(f => f.betaFeature).length,
      premium: allFeatures.filter(f => f.premiumOnly).length,
      adminOnly: allFeatures.filter(f => f.adminOnly).length
    };
  }

  // Create new feature
  static createFeature(feature: Omit<FeatureConfig, 'lastUpdated'>): boolean {
    if (this.features.has(feature.id)) {
      return false; // Feature already exists
    }

    const newFeature: FeatureConfig = {
      ...feature,
      lastUpdated: new Date().toISOString()
    };

    this.features.set(feature.id, newFeature);
    console.log(`🎛️ New feature created: ${feature.id}`);
    return true;
  }

  // Update feature configuration
  static updateFeature(featureId: string, updates: Partial<FeatureConfig>, updatedBy?: string): boolean {
    const feature = this.features.get(featureId);
    if (!feature) {
      return false;
    }

    const updatedFeature: FeatureConfig = {
      ...feature,
      ...updates,
      id: feature.id, // Prevent ID changes
      lastUpdated: new Date().toISOString(),
      updatedBy
    };

    this.features.set(featureId, updatedFeature);
    console.log(`🎛️ Feature updated: ${featureId} by ${updatedBy || 'system'}`);
    return true;
  }

  // Delete feature
  static deleteFeature(featureId: string): boolean {
    const deleted = this.features.delete(featureId);
    if (deleted) {
      console.log(`🎛️ Feature deleted: ${featureId}`);
    }
    return deleted;
  }

  // Export feature configuration
  static exportConfiguration(): Record<string, FeatureConfig> {
    const config: Record<string, FeatureConfig> = {};
    this.features.forEach((feature, id) => {
      config[id] = feature;
    });
    return config;
  }

  // Import feature configuration
  static importConfiguration(config: Record<string, FeatureConfig>): number {
    let imported = 0;
    Object.entries(config).forEach(([id, feature]) => {
      this.features.set(id, feature);
      imported++;
    });
    console.log(`🎛️ Imported ${imported} feature configurations`);
    return imported;
  }

  // Get feature by ID
  static getFeature(featureId: string): FeatureConfig | undefined {
    return this.features.get(featureId);
  }

  // Middleware to check feature access
  static createMiddleware() {
    return (req: any, res: any, next: any) => {
      const path = req.path;
      
      // Check if the API endpoint is accessible
      if (!this.isApiEndpointAccessible(path)) {
        return res.status(503).json({
          error: 'Feature temporarily unavailable',
          message: 'This feature has been disabled by administrators'
        });
      }
      
      next();
    };
  }
}

// Initialize features on service load
FeatureToggleService.initializeFeatures();