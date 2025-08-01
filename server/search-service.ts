// Advanced search service for tokens and users
import { storage } from './storage';

interface SearchFilters {
  query?: string;
  sortBy?: 'relevance' | 'date' | 'value' | 'popularity';
  tokenType?: 'all' | 'standard' | 'limitedEdition' | 'sms' | 'ai';
  priceRange?: [number, number];
  dateRange?: string;
  emotion?: string;
  hasValue?: boolean;
  isTimeLocked?: boolean;
  creatorAddress?: string;
  limit?: number;
  offset?: number;
}

interface SearchResult {
  tokens: any[];
  total: number;
  facets: {
    emotions: { [key: string]: number };
    types: { [key: string]: number };
    valueRanges: { [key: string]: number };
  };
}

class SearchService {
  // Main search function
  async searchTokens(filters: SearchFilters = {}): Promise<SearchResult> {
    try {
      const {
        query = '',
        sortBy = 'relevance',
        tokenType = 'all',
        priceRange = [0, 100],
        dateRange = 'all',
        emotion,
        hasValue = false,
        isTimeLocked = false,
        creatorAddress,
        limit = 50,
        offset = 0
      } = filters;

      // Get all tokens (in a real implementation, this would be a database query)
      let tokens = await this.getAllTokensFromStorage();

      // Apply filters
      tokens = this.applyFilters(tokens, {
        query,
        tokenType,
        priceRange,
        dateRange,
        emotion,
        hasValue,
        isTimeLocked,
        creatorAddress
      });

      // Calculate facets before sorting and pagination
      const facets = this.calculateFacets(tokens);

      // Apply sorting
      tokens = this.sortTokens(tokens, sortBy);

      // Apply pagination
      const paginatedTokens = tokens.slice(offset, offset + limit);

      return {
        tokens: paginatedTokens,
        total: tokens.length,
        facets
      };

    } catch (error) {
      console.error('Search error:', error);
      return {
        tokens: [],
        total: 0,
        facets: {
          emotions: {},
          types: {},
          valueRanges: {}
        }
      };
    }
  }

  // Get all tokens from storage
  private async getAllTokensFromStorage(): Promise<any[]> {
    try {
      if (storage && typeof storage.getAllTokensWithOptions === 'function') {
        return await storage.getAllTokensWithOptions({ limit: 10000, offset: 0 });
      }
      
      // Fallback: generate sample data for demonstration
      return this.generateSampleTokens();
    } catch (error) {
      console.error('Error fetching tokens from storage:', error);
      return this.generateSampleTokens();
    }
  }

  // Apply search filters
  private applyFilters(tokens: any[], filters: any): any[] {
    let filtered = [...tokens];

    // Text search
    if (filters.query && filters.query.trim().length > 0) {
      const query = filters.query.toLowerCase().trim();
      filtered = filtered.filter(token => 
        token.message?.toLowerCase().includes(query) ||
        token.description?.toLowerCase().includes(query) ||
        token.emotionType?.toLowerCase().includes(query) ||
        token.creatorAddress?.toLowerCase().includes(query)
      );
    }

    // Token type filter
    if (filters.tokenType !== 'all') {
      filtered = filtered.filter(token => {
        switch (filters.tokenType) {
          case 'limitedEdition':
            return token.isLimitedEdition;
          case 'sms':
            return token.smsOrigin;
          case 'ai':
            return token.aiEnhanced || token.emotionType;
          case 'standard':
            return !token.isLimitedEdition && !token.smsOrigin && !token.aiEnhanced;
          default:
            return true;
        }
      });
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(token => {
        const value = parseFloat(token.valuePerToken || '0');
        return value >= min && value <= max;
      });
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(token => {
        const tokenDate = new Date(token.createdAt || Date.now());
        return tokenDate >= cutoffDate;
      });
    }

    // Emotion filter
    if (filters.emotion) {
      filtered = filtered.filter(token => 
        token.emotionType?.toLowerCase() === filters.emotion.toLowerCase()
      );
    }

    // Has value filter
    if (filters.hasValue) {
      filtered = filtered.filter(token => 
        parseFloat(token.valuePerToken || '0') > 0
      );
    }

    // Time locked filter
    if (filters.isTimeLocked) {
      filtered = filtered.filter(token => token.isTimeLocked);
    }

    // Creator address filter
    if (filters.creatorAddress) {
      filtered = filtered.filter(token => 
        token.creatorAddress?.toLowerCase() === filters.creatorAddress.toLowerCase()
      );
    }

    return filtered;
  }

  // Sort tokens
  private sortTokens(tokens: any[], sortBy: string): any[] {
    return tokens.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        
        case 'value':
          return parseFloat(b.valuePerToken || '0') - parseFloat(a.valuePerToken || '0');
        
        case 'popularity':
          return (b.totalSupply || 0) - (a.totalSupply || 0);
        
        case 'relevance':
        default:
          // For relevance, we could implement a more sophisticated scoring algorithm
          // For now, just return by date as fallback
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });
  }

  // Calculate search facets
  private calculateFacets(tokens: any[]): SearchResult['facets'] {
    const facets = {
      emotions: {} as { [key: string]: number },
      types: {} as { [key: string]: number },
      valueRanges: {} as { [key: string]: number }
    };

    tokens.forEach(token => {
      // Emotion facets
      if (token.emotionType) {
        facets.emotions[token.emotionType] = (facets.emotions[token.emotionType] || 0) + 1;
      }

      // Type facets
      let type = 'standard';
      if (token.isLimitedEdition) type = 'limitedEdition';
      else if (token.smsOrigin) type = 'sms';
      else if (token.aiEnhanced) type = 'ai';
      
      facets.types[type] = (facets.types[type] || 0) + 1;

      // Value range facets
      const value = parseFloat(token.valuePerToken || '0');
      let range = '0';
      if (value > 0 && value <= 1) range = '0-1';
      else if (value > 1 && value <= 5) range = '1-5';
      else if (value > 5 && value <= 10) range = '5-10';
      else if (value > 10) range = '10+';
      
      facets.valueRanges[range] = (facets.valueRanges[range] || 0) + 1;
    });

    return facets;
  }

  // Generate sample tokens for demonstration
  private generateSampleTokens(): any[] {
    const emotions = ['joy', 'love', 'excitement', 'hope', 'gratitude', 'peace', 'surprise', 'curiosity'];
    const messages = [
      'gm frens', 'diamond hands forever', 'to the moon', 'wagmi always', 'hodl strong',
      'love crypto', 'blockchain future', 'defi revolution', 'nft magic', 'web3 vibes',
      'bullish on sol', 'bear market blues', 'altcoin season', 'staking rewards', 'yield farming',
      'crypto coffee', 'morning trades', 'evening charts', 'weekend pump', 'monday dump'
    ];

    return Array.from({ length: 100 }, (_, i) => ({
      id: `token_${i}`,
      message: messages[i % messages.length],
      creatorAddress: `creator_${Math.floor(i / 10)}`,
      totalSupply: Math.floor(Math.random() * 10000) + 100,
      valuePerToken: (Math.random() * 10).toFixed(4),
      isLimitedEdition: Math.random() > 0.8,
      smsOrigin: Math.random() > 0.7,
      aiEnhanced: Math.random() > 0.6,
      emotionType: Math.random() > 0.5 ? emotions[Math.floor(Math.random() * emotions.length)] : null,
      isTimeLocked: Math.random() > 0.8,
      isBurnToRead: Math.random() > 0.9,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      description: `A tokenized message expressing ${emotions[Math.floor(Math.random() * emotions.length)]}`
    }));
  }

  // Get trending tokens
  async getTrendingTokens(limit: number = 10): Promise<any[]> {
    try {
      const tokens = await this.getAllTokensFromStorage();
      
      // Sort by a combination of recent activity and value
      return tokens
        .sort((a, b) => {
          const aScore = (parseFloat(a.valuePerToken || '0') * 0.7) + 
                        (a.totalSupply * 0.3) + 
                        (new Date(a.createdAt || 0).getTime() / 1000000000);
          const bScore = (parseFloat(b.valuePerToken || '0') * 0.7) + 
                        (b.totalSupply * 0.3) + 
                        (new Date(b.createdAt || 0).getTime() / 1000000000);
          return bScore - aScore;
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting trending tokens:', error);
      return [];
    }
  }

  // Get popular search terms
  async getPopularSearches(): Promise<string[]> {
    // In a real implementation, this would track actual search queries
    return [
      'gm', 'love', 'moon', 'diamond hands', 'wagmi', 'hodl', 'crypto', 
      'blockchain', 'defi', 'nft', 'web3', 'solana', 'bitcoin', 'ethereum'
    ];
  }

  // Auto-complete suggestions
  async getSuggestions(query: string, limit: number = 10): Promise<string[]> {
    if (!query || query.length < 2) return [];

    try {
      const tokens = await this.getAllTokensFromStorage();
      const suggestions = new Set<string>();

      tokens.forEach(token => {
        // Add message suggestions
        if (token.message?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(token.message);
        }

        // Add emotion suggestions
        if (token.emotionType?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(token.emotionType);
        }
      });

      return Array.from(suggestions).slice(0, limit);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }
}

export const searchService = new SearchService();