import { openaiService } from "./openai-service";
import { storage } from "./storage";

// Celestial themes and constellations
const CELESTIAL_THEMES = {
  nebula: {
    name: "Cosmic Nebula",
    colors: ["#4C1D95", "#7C3AED", "#A855F7", "#C084FC"],
    description: "Swirling cosmic clouds of creation",
    personality: "creative, visionary, expansive"
  },
  starforge: {
    name: "Star Forge",
    colors: ["#DC2626", "#F59E0B", "#FBBF24", "#FCD34D"],
    description: "The birthplace of stellar giants",
    personality: "powerful, ambitious, transformative"
  },
  voidwalker: {
    name: "Void Walker",
    colors: ["#111827", "#374151", "#6B7280", "#D1D5DB"],
    description: "Navigator of the cosmic unknown",
    personality: "mysterious, analytical, deep"
  },
  aurora: {
    name: "Celestial Aurora",
    colors: ["#065F46", "#047857", "#10B981", "#6EE7B7"],
    description: "Dancing lights of the cosmic dawn",
    personality: "harmonious, balanced, nurturing"
  },
  supernova: {
    name: "Supernova Burst",
    colors: ["#B91C1C", "#DC2626", "#F97316", "#FBBF24"],
    description: "Explosive stellar transformation",
    personality: "dynamic, energetic, revolutionary"
  },
  quantum: {
    name: "Quantum Realm",
    colors: ["#1E40AF", "#3B82F6", "#60A5FA", "#93C5FD"],
    description: "The fundamental fabric of reality",
    personality: "logical, precise, innovative"
  }
};

const CONSTELLATIONS = [
  "Orion", "Andromeda", "Cassiopeia", "Draco", "Phoenix", "Lyra",
  "Cygnus", "Aquila", "Pegasus", "Centaurus", "Ursa Major", "Ursa Minor",
  "Leo", "Virgo", "Scorpius", "Sagittarius", "Gemini", "Cancer"
];

const COSMIC_ELEMENTS = [
  "Stardust", "Neutron", "Quasar", "Pulsar", "Magnetar", "Blackhole",
  "Wormhole", "Darkstar", "Redgiant", "Whitedwarf", "Blueshift", "Redshift"
];

export interface PersonalizationProfile {
  userId: string;
  celestialTheme: keyof typeof CELESTIAL_THEMES;
  constellation: string;
  cosmicName: string;
  personality: {
    traits: string[];
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    tradingStyle: 'hodler' | 'trader' | 'defi_farmer' | 'nft_collector';
    preferences: string[];
  };
  achievements: {
    title: string;
    description: string;
    unlockedAt: string;
    rarity: 'common' | 'rare' | 'legendary' | 'mythic';
  }[];
  stats: {
    totalValue: number;
    portfolioGrowth: number;
    transactionCount: number;
    daysSinceFirstTransaction: number;
    favoriteToken: string;
    riskScore: number;
  };
  customization: {
    background: string;
    particleEffects: boolean;
    soundEffects: boolean;
    animations: boolean;
  };
  insights: string[];
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}

export class CelestialPersonalizationService {
  private static profiles = new Map<string, PersonalizationProfile>();

  // Generate personalized cosmic identity
  static async generateCosmicIdentity(userId: string, walletData: any): Promise<PersonalizationProfile> {
    try {
      // Analyze user's wallet behavior for theme selection
      const theme = this.selectThemeBasedOnBehavior(walletData);
      const constellation = CONSTELLATIONS[Math.floor(Math.random() * CONSTELLATIONS.length)];
      const cosmicElement = COSMIC_ELEMENTS[Math.floor(Math.random() * COSMIC_ELEMENTS.length)];
      const cosmicName = `${constellation} ${cosmicElement}`;

      // Generate AI-powered personality analysis
      const personalityAnalysis = await this.generatePersonalityAnalysis(walletData);
      
      // Create achievements based on wallet activity
      const achievements = await this.generateAchievements(walletData);
      
      // Generate AI insights and recommendations
      const insights = await this.generateCosmicInsights(walletData, theme);
      const recommendations = await this.generatePersonalizedRecommendations(walletData, personalityAnalysis);

      const profile: PersonalizationProfile = {
        userId,
        celestialTheme: theme,
        constellation,
        cosmicName,
        personality: personalityAnalysis,
        achievements,
        stats: {
          totalValue: walletData.totalValue || 0,
          portfolioGrowth: walletData.portfolioGrowth || 0,
          transactionCount: walletData.transactionCount || 0,
          daysSinceFirstTransaction: walletData.daysSinceFirstTransaction || 0,
          favoriteToken: walletData.favoriteToken || 'SOL',
          riskScore: walletData.riskScore || 50
        },
        customization: {
          background: `celestial-${theme}`,
          particleEffects: true,
          soundEffects: false,
          animations: true
        },
        insights,
        recommendations,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.profiles.set(userId, profile);
      return profile;
    } catch (error) {
      console.error('Error generating cosmic identity:', error);
      return this.createDefaultProfile(userId);
    }
  }

  // Select celestial theme based on wallet behavior
  private static selectThemeBasedOnBehavior(walletData: any): keyof typeof CELESTIAL_THEMES {
    const { riskScore = 50, transactionCount = 0, portfolioGrowth = 0, tradingFrequency = 'low' } = walletData;

    if (riskScore > 80 && portfolioGrowth > 50) return 'supernova';
    if (riskScore < 30 && tradingFrequency === 'low') return 'voidwalker';
    if (transactionCount > 1000) return 'starforge';
    if (portfolioGrowth > 30 && riskScore > 60) return 'nebula';
    if (riskScore < 50 && portfolioGrowth > 0) return 'aurora';
    return 'quantum';
  }

  // Generate AI-powered personality analysis
  private static async generatePersonalityAnalysis(walletData: any): Promise<PersonalizationProfile['personality']> {
    try {
      const analysisPrompt = `Analyze this crypto wallet behavior and generate a personality profile:
      
      Wallet Data:
      - Total Value: ${walletData.totalValue || 0}
      - Transaction Count: ${walletData.transactionCount || 0}
      - Portfolio Growth: ${walletData.portfolioGrowth || 0}%
      - Risk Score: ${walletData.riskScore || 50}/100
      - Trading Frequency: ${walletData.tradingFrequency || 'moderate'}
      - Favorite Tokens: ${walletData.favoriteTokens?.join(', ') || 'SOL'}
      
      Generate a JSON response with:
      {
        "traits": ["trait1", "trait2", "trait3"],
        "riskTolerance": "conservative|moderate|aggressive",
        "tradingStyle": "hodler|trader|defi_farmer|nft_collector",
        "preferences": ["pref1", "pref2", "pref3"]
      }`;

      const aiResponse = await openaiService.generateContent(analysisPrompt, { maxTokens: 200 });
      
      try {
        const parsed = JSON.parse(aiResponse);
        return {
          traits: parsed.traits || ['analytical', 'strategic', 'patient'],
          riskTolerance: parsed.riskTolerance || 'moderate',
          tradingStyle: parsed.tradingStyle || 'hodler',
          preferences: parsed.preferences || ['long-term growth', 'diversification', 'research-based decisions']
        };
      } catch {
        return this.createDefaultPersonality();
      }
    } catch (error) {
      return this.createDefaultPersonality();
    }
  }

  // Generate achievements based on wallet activity
  private static async generateAchievements(walletData: any): Promise<PersonalizationProfile['achievements']> {
    const achievements = [];
    const { totalValue = 0, transactionCount = 0, portfolioGrowth = 0, daysSinceFirstTransaction = 0 } = walletData;

    // Value-based achievements
    if (totalValue > 10000) {
      achievements.push({
        title: "Cosmic Whale",
        description: "Portfolio value exceeds 10,000 tokens",
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary' as const
      });
    } else if (totalValue > 1000) {
      achievements.push({
        title: "Stellar Navigator",
        description: "Portfolio value exceeds 1,000 tokens",
        unlockedAt: new Date().toISOString(),
        rarity: 'rare' as const
      });
    }

    // Transaction-based achievements
    if (transactionCount > 500) {
      achievements.push({
        title: "Transaction Master",
        description: "Completed over 500 transactions",
        unlockedAt: new Date().toISOString(),
        rarity: 'rare' as const
      });
    } else if (transactionCount > 100) {
      achievements.push({
        title: "Active Trader",
        description: "Completed over 100 transactions",
        unlockedAt: new Date().toISOString(),
        rarity: 'common' as const
      });
    }

    // Growth-based achievements
    if (portfolioGrowth > 100) {
      achievements.push({
        title: "Supernova Investor",
        description: "Portfolio doubled in value",
        unlockedAt: new Date().toISOString(),
        rarity: 'mythic' as const
      });
    } else if (portfolioGrowth > 50) {
      achievements.push({
        title: "Rising Star",
        description: "Portfolio grew by 50%",
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary' as const
      });
    }

    // Time-based achievements
    if (daysSinceFirstTransaction > 365) {
      achievements.push({
        title: "Cosmic Veteran",
        description: "Over 1 year in the crypto cosmos",
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary' as const
      });
    } else if (daysSinceFirstTransaction > 30) {
      achievements.push({
        title: "Space Explorer",
        description: "30+ days exploring the cosmos",
        unlockedAt: new Date().toISOString(),
        rarity: 'common' as const
      });
    }

    // Default achievement for new users
    if (achievements.length === 0) {
      achievements.push({
        title: "Cosmic Initiate",
        description: "Welcome to the celestial journey",
        unlockedAt: new Date().toISOString(),
        rarity: 'common' as const
      });
    }

    return achievements;
  }

  // Generate cosmic insights using AI
  private static async generateCosmicInsights(walletData: any, theme: keyof typeof CELESTIAL_THEMES): Promise<string[]> {
    try {
      const themeData = CELESTIAL_THEMES[theme];
      const insightPrompt = `Generate 3 cosmic-themed insights for a wallet with ${theme} theme:
      
      Theme: ${themeData.name} - ${themeData.description}
      Personality: ${themeData.personality}
      
      Wallet Stats:
      - Total Value: ${walletData.totalValue || 0}
      - Growth: ${walletData.portfolioGrowth || 0}%
      - Transactions: ${walletData.transactionCount || 0}
      
      Generate poetic, cosmic-themed insights about their journey. Each insight should be 1-2 sentences.`;

      const aiResponse = await openaiService.generateContent(insightPrompt, { maxTokens: 150 });
      
      const insights = aiResponse.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 3);

      return insights.length > 0 ? insights : [
        "Your cosmic journey has just begun, with infinite possibilities ahead.",
        "Like stars forming in the vast nebula, your portfolio is taking shape.",
        "The cosmic winds guide your path through the digital universe."
      ];
    } catch (error) {
      return [
        "Your cosmic journey has just begun, with infinite possibilities ahead.",
        "Like stars forming in the vast nebula, your portfolio is taking shape.",
        "The cosmic winds guide your path through the digital universe."
      ];
    }
  }

  // Generate personalized recommendations
  private static async generatePersonalizedRecommendations(walletData: any, personality: PersonalizationProfile['personality']): Promise<string[]> {
    try {
      const recommendationPrompt = `Generate 3 personalized investment recommendations:
      
      User Profile:
      - Risk Tolerance: ${personality.riskTolerance}
      - Trading Style: ${personality.tradingStyle}
      - Traits: ${personality.traits.join(', ')}
      - Current Portfolio Growth: ${walletData.portfolioGrowth || 0}%
      
      Generate specific, actionable recommendations for this user type.`;

      const aiResponse = await openaiService.generateContent(recommendationPrompt, { maxTokens: 150 });
      
      const recommendations = aiResponse.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 3);

      return recommendations.length > 0 ? recommendations : [
        "Consider diversifying across multiple blockchain ecosystems",
        "Set up automated DCA strategies for long-term growth",
        "Explore yield farming opportunities matching your risk profile"
      ];
    } catch (error) {
      return [
        "Consider diversifying across multiple blockchain ecosystems",
        "Set up automated DCA strategies for long-term growth",
        "Explore yield farming opportunities matching your risk profile"
      ];
    }
  }

  // Update personalization profile
  static async updateProfile(userId: string, updates: Partial<PersonalizationProfile>): Promise<PersonalizationProfile> {
    const existingProfile = this.profiles.get(userId);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    const updatedProfile = {
      ...existingProfile,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.profiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  // Get personalization profile
  static async getProfile(userId: string): Promise<PersonalizationProfile | null> {
    return this.profiles.get(userId) || null;
  }

  // Get all available themes
  static getAvailableThemes(): typeof CELESTIAL_THEMES {
    return CELESTIAL_THEMES;
  }

  // Get cosmic name suggestions
  static generateCosmicNames(count: number = 5): string[] {
    const names = [];
    for (let i = 0; i < count; i++) {
      const constellation = CONSTELLATIONS[Math.floor(Math.random() * CONSTELLATIONS.length)];
      const element = COSMIC_ELEMENTS[Math.floor(Math.random() * COSMIC_ELEMENTS.length)];
      names.push(`${constellation} ${element}`);
    }
    return names;
  }

  // Calculate cosmic compatibility between users
  static calculateCosmicCompatibility(profile1: PersonalizationProfile, profile2: PersonalizationProfile): {
    score: number;
    description: string;
    sharedTraits: string[];
  } {
    const sharedTraits = profile1.personality.traits.filter(trait => 
      profile2.personality.traits.includes(trait)
    );

    const themeCompatibility = profile1.celestialTheme === profile2.celestialTheme ? 30 : 10;
    const traitCompatibility = sharedTraits.length * 20;
    const riskCompatibility = profile1.personality.riskTolerance === profile2.personality.riskTolerance ? 20 : 0;
    const styleCompatibility = profile1.personality.tradingStyle === profile2.personality.tradingStyle ? 30 : 0;

    const totalScore = Math.min(themeCompatibility + traitCompatibility + riskCompatibility + styleCompatibility, 100);

    let description = "Distant cosmic neighbors";
    if (totalScore > 80) description = "Perfectly aligned cosmic twins";
    else if (totalScore > 60) description = "Harmonious celestial companions";
    else if (totalScore > 40) description = "Compatible cosmic travelers";
    else if (totalScore > 20) description = "Occasional cosmic encounters";

    return {
      score: totalScore,
      description,
      sharedTraits
    };
  }

  // Generate default profile for fallback
  private static createDefaultProfile(userId: string): PersonalizationProfile {
    return {
      userId,
      celestialTheme: 'quantum',
      constellation: 'Orion',
      cosmicName: 'Orion Stardust',
      personality: this.createDefaultPersonality(),
      achievements: [{
        title: 'Cosmic Initiate',
        description: 'Welcome to the celestial journey',
        unlockedAt: new Date().toISOString(),
        rarity: 'common'
      }],
      stats: {
        totalValue: 0,
        portfolioGrowth: 0,
        transactionCount: 0,
        daysSinceFirstTransaction: 0,
        favoriteToken: 'SOL',
        riskScore: 50
      },
      customization: {
        background: 'celestial-quantum',
        particleEffects: true,
        soundEffects: false,
        animations: true
      },
      insights: ['Your cosmic journey has just begun, with infinite possibilities ahead.'],
      recommendations: ['Consider exploring the celestial marketplace for your first investment.'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private static createDefaultPersonality(): PersonalizationProfile['personality'] {
    return {
      traits: ['curious', 'cautious', 'learning'],
      riskTolerance: 'moderate',
      tradingStyle: 'hodler',
      preferences: ['education', 'diversification', 'long-term growth']
    };
  }
}