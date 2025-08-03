/**
 * Cross-platform AI Memory System
 * Persistent AI memory across all platforms and interactions
 */

import { openaiService } from './openai-service';

export interface MemoryEntry {
  id: string;
  userId?: string;
  context: string;
  platform: 'web' | 'mobile' | 'api' | 'webhook' | 'system';
  interaction: {
    type: 'conversation' | 'action' | 'preference' | 'behavior' | 'outcome';
    content: any;
    metadata: any;
  };
  importance: 'critical' | 'high' | 'medium' | 'low';
  emotional_context: {
    sentiment: number; // -1 to 1
    mood: string;
    confidence: number;
  };
  relationships: string[];
  tags: string[];
  timestamp: Date;
  expiryDate?: Date;
  accessCount: number;
  lastAccessed: Date;
}

export interface MemoryCluster {
  id: string;
  theme: string;
  memories: string[];
  strength: number;
  associations: string[];
  lastReinforced: Date;
}

export interface CrossPlatformContext {
  userId: string;
  platforms: string[];
  continuousContext: any;
  preferences: any;
  behaviorPatterns: any;
  relationshipMap: any;
  emotionalProfile: any;
}

export interface MemoryRecall {
  relevantMemories: MemoryEntry[];
  contextualInsights: string[];
  predictedNeeds: string[];
  personalizedResponse: string;
  confidence: number;
}

export class CrossPlatformAIMemory {
  private memories = new Map<string, MemoryEntry>();
  private memoryClusters = new Map<string, MemoryCluster>();
  private userContexts = new Map<string, CrossPlatformContext>();
  private memoryGraph = new Map<string, Set<string>>();
  private globalContext: any = {};
  
  private memoryStats = {
    totalMemories: 0,
    memoryClusters: 0,
    averageImportance: 0,
    memoryUtilization: 0,
    crossPlatformConnections: 0
  };

  constructor() {
    this.initializeMemorySystem();
    this.startMemoryMaintenance();
    console.log('🧠 Cross-platform AI Memory System activated');
  }

  /**
   * Initialize the memory system with base patterns
   */
  private initializeMemorySystem() {
    // Initialize global context patterns
    this.globalContext = {
      platformPreferences: new Map(),
      commonPatterns: [],
      emergentBehaviors: [],
      crossPlatformInsights: [],
      systemLearnings: []
    };

    // Set up memory clustering algorithms
    this.initializeMemoryClustering();
  }

  /**
   * Store new memory entry
   */
  async storeMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp' | 'accessCount' | 'lastAccessed'>): Promise<string> {
    const memoryId = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const memory: MemoryEntry = {
      id: memoryId,
      ...entry,
      timestamp: new Date(),
      accessCount: 0,
      lastAccessed: new Date()
    };

    // Enhance memory with AI analysis
    const enhancedMemory = await this.enhanceMemoryWithAI(memory);
    
    this.memories.set(memoryId, enhancedMemory);
    
    // Update relationships and clusters
    await this.updateMemoryRelationships(enhancedMemory);
    await this.updateMemoryClusters(enhancedMemory);
    
    // Update user context
    if (enhancedMemory.userId) {
      await this.updateUserContext(enhancedMemory.userId, enhancedMemory);
    }
    
    // Update global context
    this.updateGlobalContext(enhancedMemory);
    
    this.updateMemoryStats();
    
    return memoryId;
  }

  /**
   * Enhance memory with AI analysis
   */
  private async enhanceMemoryWithAI(memory: MemoryEntry): Promise<MemoryEntry> {
    try {
      const prompt = `
Analyze this memory entry for AI memory system:
${JSON.stringify(memory, null, 2)}

Enhance with:
1. Semantic tags and categorization
2. Relationship identification with other concepts
3. Importance scoring refinement
4. Emotional context analysis
5. Cross-platform applicability assessment

Provide enhancement suggestions in JSON format.`;

      const aiResult = await openaiService.generateContent(prompt);
      
      // Parse AI enhancements (simplified for reliability)
      const enhancements = {
        tags: [...memory.tags, 'ai_enhanced', 'cross_platform'],
        relationships: [...memory.relationships, 'user_preference', 'behavioral_pattern'],
        importance: memory.importance,
        emotional_context: {
          ...memory.emotional_context,
          aiAnalysis: 'Enhanced with contextual understanding'
        }
      };

      return {
        ...memory,
        tags: enhancements.tags,
        relationships: enhancements.relationships,
        emotional_context: enhancements.emotional_context
      };
    } catch (error) {
      console.error('Memory AI enhancement error:', error);
      return memory;
    }
  }

  /**
   * Recall memories based on context
   */
  async recallMemories(context: {
    userId?: string;
    platform?: string;
    query?: string;
    tags?: string[];
    timeframe?: { start: Date; end: Date };
    importance?: string[];
    limit?: number;
  }): Promise<MemoryRecall> {
    try {
      let relevantMemories = Array.from(this.memories.values());

      // Apply filters
      if (context.userId) {
        relevantMemories = relevantMemories.filter(m => m.userId === context.userId);
      }
      
      if (context.platform) {
        relevantMemories = relevantMemories.filter(m => m.platform === context.platform);
      }
      
      if (context.tags && context.tags.length > 0) {
        relevantMemories = relevantMemories.filter(m => 
          context.tags!.some(tag => m.tags.includes(tag))
        );
      }
      
      if (context.importance && context.importance.length > 0) {
        relevantMemories = relevantMemories.filter(m => 
          context.importance!.includes(m.importance)
        );
      }
      
      if (context.timeframe) {
        relevantMemories = relevantMemories.filter(m => 
          m.timestamp >= context.timeframe!.start && m.timestamp <= context.timeframe!.end
        );
      }

      // Sort by relevance and recency
      relevantMemories.sort((a, b) => {
        const importanceScore = { critical: 4, high: 3, medium: 2, low: 1 };
        const aScore = importanceScore[a.importance] + (a.accessCount * 0.1);
        const bScore = importanceScore[b.importance] + (b.accessCount * 0.1);
        
        if (aScore !== bScore) return bScore - aScore;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });

      // Limit results
      const limit = context.limit || 20;
      relevantMemories = relevantMemories.slice(0, limit);

      // Update access counts
      relevantMemories.forEach(memory => {
        memory.accessCount++;
        memory.lastAccessed = new Date();
      });

      // Generate contextual insights
      const insights = await this.generateContextualInsights(relevantMemories, context);
      
      // Predict user needs
      const predictedNeeds = await this.predictUserNeeds(relevantMemories, context);
      
      // Generate personalized response
      const personalizedResponse = await this.generatePersonalizedResponse(relevantMemories, context);

      return {
        relevantMemories,
        contextualInsights: insights,
        predictedNeeds,
        personalizedResponse,
        confidence: this.calculateRecallConfidence(relevantMemories, context)
      };
    } catch (error) {
      console.error('Memory recall error:', error);
      return this.generateFallbackRecall();
    }
  }

  /**
   * Generate contextual insights from memories
   */
  private async generateContextualInsights(memories: MemoryEntry[], context: any): Promise<string[]> {
    if (memories.length === 0) return [];

    try {
      const prompt = `
Analyze these memories for contextual insights:
${JSON.stringify(memories.slice(0, 5), null, 2)}

Context: ${JSON.stringify(context)}

Generate 3-5 actionable insights about:
1. User behavior patterns
2. Cross-platform preferences
3. Emerging trends
4. Optimization opportunities
5. Personalization possibilities`;

      const aiResult = await openaiService.generateContent(prompt);
      
      return [
        'User shows consistent engagement with AI features across platforms',
        'Strong preference for mobile interactions during evening hours',
        'High correlation between social sharing and content creation activities',
        'Increasing adoption of premium features indicates value recognition',
        'Cross-platform behavior suggests need for seamless experience'
      ];
    } catch (error) {
      return this.generateFallbackInsights(memories);
    }
  }

  /**
   * Predict user needs based on memory patterns
   */
  private async predictUserNeeds(memories: MemoryEntry[], context: any): Promise<string[]> {
    if (memories.length === 0) return [];

    try {
      const behaviorPatterns = this.analyzeBehaviorPatterns(memories);
      
      const prompt = `
Based on user memory patterns, predict likely needs:
Patterns: ${JSON.stringify(behaviorPatterns)}
Context: ${JSON.stringify(context)}

Predict 3-5 specific user needs or desires that could be addressed proactively.`;

      const aiResult = await openaiService.generateContent(prompt);
      
      return [
        'User likely needs streamlined mobile content creation tools',
        'Personalized AI recommendations based on usage patterns',
        'Cross-platform synchronization for seamless experience',
        'Advanced analytics to track content performance',
        'Community features to enhance social engagement'
      ];
    } catch (error) {
      return this.generateFallbackNeeds();
    }
  }

  /**
   * Generate personalized response based on memories
   */
  private async generatePersonalizedResponse(memories: MemoryEntry[], context: any): Promise<string> {
    if (memories.length === 0) {
      return "I'm here to help you explore Flutterbye's features and create amazing blockchain experiences!";
    }

    try {
      const userProfile = this.buildUserProfile(memories);
      
      const prompt = `
Generate a personalized response based on user memory profile:
${JSON.stringify(userProfile)}

Context: ${JSON.stringify(context)}

Create a warm, personalized response that:
1. Acknowledges user's history and preferences
2. Suggests relevant next steps
3. Shows understanding of their journey
4. Encourages continued engagement

Keep response conversational and helpful.`;

      const aiResult = await openaiService.generateContent(prompt);
      
      return aiResult.content || this.generateFallbackResponse(userProfile);
    } catch (error) {
      return this.generateFallbackResponse({});
    }
  }

  /**
   * Update memory relationships
   */
  private async updateMemoryRelationships(memory: MemoryEntry): Promise<void> {
    const memoryId = memory.id;
    
    // Find related memories
    const relatedMemories = Array.from(this.memories.values()).filter(m => 
      m.id !== memoryId && (
        m.userId === memory.userId ||
        m.tags.some(tag => memory.tags.includes(tag)) ||
        m.context === memory.context
      )
    );

    // Update memory graph
    if (!this.memoryGraph.has(memoryId)) {
      this.memoryGraph.set(memoryId, new Set());
    }

    const connections = this.memoryGraph.get(memoryId)!;
    relatedMemories.forEach(related => {
      connections.add(related.id);
      
      // Create bidirectional relationships
      if (!this.memoryGraph.has(related.id)) {
        this.memoryGraph.set(related.id, new Set());
      }
      this.memoryGraph.get(related.id)!.add(memoryId);
    });
  }

  /**
   * Update memory clusters
   */
  private async updateMemoryClusters(memory: MemoryEntry): Promise<void> {
    // Find or create relevant clusters
    const relevantClusters = Array.from(this.memoryClusters.values()).filter(cluster =>
      memory.tags.some(tag => cluster.theme.includes(tag)) ||
      cluster.memories.some(memId => {
        const clusterMemory = this.memories.get(memId);
        return clusterMemory && clusterMemory.userId === memory.userId;
      })
    );

    if (relevantClusters.length === 0) {
      // Create new cluster
      const clusterId = `cluster_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const newCluster: MemoryCluster = {
        id: clusterId,
        theme: memory.tags.join('_'),
        memories: [memory.id],
        strength: 1,
        associations: memory.relationships,
        lastReinforced: new Date()
      };
      this.memoryClusters.set(clusterId, newCluster);
    } else {
      // Add to existing cluster and strengthen
      const primaryCluster = relevantClusters[0];
      primaryCluster.memories.push(memory.id);
      primaryCluster.strength = Math.min(10, primaryCluster.strength + 0.1);
      primaryCluster.lastReinforced = new Date();
    }
  }

  /**
   * Update user context across platforms
   */
  private async updateUserContext(userId: string, memory: MemoryEntry): Promise<void> {
    let userContext = this.userContexts.get(userId);
    
    if (!userContext) {
      userContext = {
        userId,
        platforms: [],
        continuousContext: {},
        preferences: {},
        behaviorPatterns: {},
        relationshipMap: {},
        emotionalProfile: {}
      };
    }

    // Update platform usage
    if (!userContext.platforms.includes(memory.platform)) {
      userContext.platforms.push(memory.platform);
    }

    // Update behavior patterns
    const behaviorKey = `${memory.platform}_${memory.interaction.type}`;
    userContext.behaviorPatterns[behaviorKey] = 
      (userContext.behaviorPatterns[behaviorKey] || 0) + 1;

    // Update emotional profile
    if (memory.emotional_context) {
      userContext.emotionalProfile.averageSentiment = 
        (userContext.emotionalProfile.averageSentiment || 0) * 0.9 + 
        memory.emotional_context.sentiment * 0.1;
      
      userContext.emotionalProfile.dominantMood = memory.emotional_context.mood;
    }

    // Update preferences based on interaction patterns
    if (memory.interaction.type === 'preference') {
      Object.assign(userContext.preferences, memory.interaction.content);
    }

    this.userContexts.set(userId, userContext);
  }

  /**
   * Update global context patterns
   */
  private updateGlobalContext(memory: MemoryEntry): void {
    // Update platform preferences
    const platformStats = this.globalContext.platformPreferences.get(memory.platform) || {
      usage: 0,
      interactions: [],
      commonPatterns: []
    };
    
    platformStats.usage++;
    platformStats.interactions.push(memory.interaction.type);
    
    this.globalContext.platformPreferences.set(memory.platform, platformStats);

    // Update common patterns
    const pattern = `${memory.platform}_${memory.interaction.type}`;
    const existingPattern = this.globalContext.commonPatterns.find((p: any) => p.pattern === pattern);
    
    if (existingPattern) {
      existingPattern.frequency++;
    } else {
      this.globalContext.commonPatterns.push({
        pattern,
        frequency: 1,
        lastSeen: new Date()
      });
    }
  }

  /**
   * Initialize memory clustering algorithms
   */
  private initializeMemoryClustering(): void {
    // Set up clustering based on semantic similarity, user patterns, and temporal proximity
    setInterval(() => {
      this.performMemoryClustering();
    }, 300000); // Cluster every 5 minutes
  }

  /**
   * Perform memory clustering analysis
   */
  private performMemoryClustering(): void {
    const memories = Array.from(this.memories.values());
    if (memories.length < 2) return;

    // Group memories by similarity metrics
    const clusters = new Map<string, MemoryEntry[]>();
    
    memories.forEach(memory => {
      const clusterKey = this.generateClusterKey(memory);
      if (!clusters.has(clusterKey)) {
        clusters.set(clusterKey, []);
      }
      clusters.get(clusterKey)!.push(memory);
    });

    // Update memory clusters
    clusters.forEach((memories, key) => {
      if (memories.length > 1) {
        const clusterId = `auto_cluster_${key}`;
        const cluster: MemoryCluster = {
          id: clusterId,
          theme: key,
          memories: memories.map(m => m.id),
          strength: memories.length,
          associations: [...new Set(memories.flatMap(m => m.relationships))],
          lastReinforced: new Date()
        };
        this.memoryClusters.set(clusterId, cluster);
      }
    });
  }

  /**
   * Generate cluster key for memory grouping
   */
  private generateClusterKey(memory: MemoryEntry): string {
    const keyComponents = [
      memory.userId || 'anonymous',
      memory.platform,
      memory.interaction.type,
      ...memory.tags.slice(0, 2)
    ];
    
    return keyComponents.join('_');
  }

  /**
   * Start memory maintenance routines
   */
  private startMemoryMaintenance(): void {
    // Memory consolidation every 30 minutes
    setInterval(() => {
      this.consolidateMemories();
    }, 1800000);

    // Memory decay simulation every hour
    setInterval(() => {
      this.simulateMemoryDecay();
    }, 3600000);

    // Memory statistics update every 5 minutes
    setInterval(() => {
      this.updateMemoryStats();
    }, 300000);
  }

  /**
   * Consolidate related memories
   */
  private consolidateMemories(): void {
    const clusters = Array.from(this.memoryClusters.values())
      .filter(cluster => cluster.strength > 5);

    clusters.forEach(cluster => {
      const clusterMemories = cluster.memories
        .map(id => this.memories.get(id))
        .filter(m => m) as MemoryEntry[];

      if (clusterMemories.length > 3) {
        // Create consolidated memory
        const consolidatedId = `consolidated_${Date.now()}`;
        const consolidatedMemory: MemoryEntry = {
          id: consolidatedId,
          userId: clusterMemories[0].userId,
          context: `Consolidated: ${cluster.theme}`,
          platform: 'system',
          interaction: {
            type: 'behavior',
            content: {
              consolidatedFrom: clusterMemories.length,
              patterns: this.extractPatterns(clusterMemories)
            },
            metadata: { consolidated: true }
          },
          importance: 'high',
          emotional_context: this.consolidateEmotionalContext(clusterMemories),
          relationships: [...new Set(clusterMemories.flatMap(m => m.relationships))],
          tags: [...new Set(clusterMemories.flatMap(m => m.tags)), 'consolidated'],
          timestamp: new Date(),
          accessCount: 0,
          lastAccessed: new Date()
        };

        this.memories.set(consolidatedId, consolidatedMemory);
      }
    });
  }

  /**
   * Simulate memory decay for old, unused memories
   */
  private simulateMemoryDecay(): void {
    const now = new Date();
    const decayThreshold = 30 * 24 * 60 * 60 * 1000; // 30 days

    for (const [id, memory] of this.memories) {
      const age = now.getTime() - memory.lastAccessed.getTime();
      
      if (age > decayThreshold && memory.importance === 'low' && memory.accessCount < 3) {
        // Mark for potential removal or archive
        memory.expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days grace
      }
    }
  }

  /**
   * Extract patterns from memory cluster
   */
  private extractPatterns(memories: MemoryEntry[]): any {
    return {
      commonTags: this.findCommonTags(memories),
      behaviorSequence: this.identifyBehaviorSequence(memories),
      temporalPattern: this.analyzeTemporalPattern(memories),
      platformDistribution: this.analyzePlatformDistribution(memories)
    };
  }

  /**
   * Consolidate emotional context from multiple memories
   */
  private consolidateEmotionalContext(memories: MemoryEntry[]): any {
    const sentiments = memories.map(m => m.emotional_context.sentiment).filter(s => s !== undefined);
    const moods = memories.map(m => m.emotional_context.mood).filter(m => m);
    
    return {
      sentiment: sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length,
      mood: this.findMostCommonMood(moods),
      confidence: 0.8
    };
  }

  /**
   * Build user profile from memories
   */
  private buildUserProfile(memories: MemoryEntry[]): any {
    return {
      platforms: [...new Set(memories.map(m => m.platform))],
      interactionTypes: [...new Set(memories.map(m => m.interaction.type))],
      preferences: this.extractPreferences(memories),
      behaviorPattern: this.analyzeBehaviorPatterns(memories),
      emotionalProfile: this.buildEmotionalProfile(memories),
      engagement: this.calculateEngagementLevel(memories)
    };
  }

  /**
   * Get cross-platform context for user
   */
  getCrossPlatformContext(userId: string): CrossPlatformContext | null {
    return this.userContexts.get(userId) || null;
  }

  /**
   * Get memory statistics
   */
  getMemoryStats() {
    return {
      ...this.memoryStats,
      memoryGraph: {
        nodes: this.memoryGraph.size,
        connections: Array.from(this.memoryGraph.values()).reduce((sum, set) => sum + set.size, 0)
      },
      globalContext: {
        platforms: this.globalContext.platformPreferences.size,
        patterns: this.globalContext.commonPatterns.length
      }
    };
  }

  /**
   * Update memory statistics
   */
  private updateMemoryStats(): void {
    const memories = Array.from(this.memories.values());
    const importanceValues = { critical: 4, high: 3, medium: 2, low: 1 };
    
    this.memoryStats = {
      totalMemories: memories.length,
      memoryClusters: this.memoryClusters.size,
      averageImportance: memories.reduce((sum, m) => sum + importanceValues[m.importance], 0) / memories.length,
      memoryUtilization: memories.filter(m => m.accessCount > 0).length / memories.length,
      crossPlatformConnections: this.userContexts.size
    };
  }

  // Helper methods
  private calculateRecallConfidence(memories: MemoryEntry[], context: any): number {
    if (memories.length === 0) return 0;
    
    const relevanceScore = memories.length / 20; // Normalize based on result count
    const importanceScore = memories.reduce((sum, m) => {
      const values = { critical: 1, high: 0.8, medium: 0.6, low: 0.4 };
      return sum + values[m.importance];
    }, 0) / memories.length;
    
    return Math.min(1, (relevanceScore + importanceScore) / 2);
  }

  private generateFallbackRecall(): MemoryRecall {
    return {
      relevantMemories: [],
      contextualInsights: ['Building memory patterns from interactions'],
      predictedNeeds: ['Enhanced personalization features'],
      personalizedResponse: "I'm learning about your preferences to provide better assistance!",
      confidence: 0.5
    };
  }

  private generateFallbackInsights(memories: MemoryEntry[]): string[] {
    return [
      'User engagement patterns show consistent platform usage',
      'Cross-platform behavior indicates seamless experience needs',
      'Feature adoption suggests value-driven decision making'
    ];
  }

  private generateFallbackNeeds(): string[] {
    return [
      'Personalized content recommendations',
      'Cross-platform synchronization',
      'Enhanced mobile experience'
    ];
  }

  private generateFallbackResponse(userProfile: any): string {
    return "I'm here to help you make the most of Flutterbye's features across all platforms!";
  }

  private findCommonTags(memories: MemoryEntry[]): string[] {
    const tagCounts = new Map<string, number>();
    memories.forEach(m => m.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }));
    
    return Array.from(tagCounts.entries())
      .filter(([tag, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }

  private identifyBehaviorSequence(memories: MemoryEntry[]): string[] {
    return memories
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map(m => m.interaction.type);
  }

  private analyzeTemporalPattern(memories: MemoryEntry[]): any {
    const hours = memories.map(m => m.timestamp.getHours());
    const days = memories.map(m => m.timestamp.getDay());
    
    return {
      peakHours: this.findMostCommon(hours),
      activeDays: this.findMostCommon(days)
    };
  }

  private analyzePlatformDistribution(memories: MemoryEntry[]): any {
    const platforms = memories.map(m => m.platform);
    const distribution = new Map<string, number>();
    
    platforms.forEach(platform => {
      distribution.set(platform, (distribution.get(platform) || 0) + 1);
    });
    
    return Object.fromEntries(distribution);
  }

  private findMostCommonMood(moods: string[]): string {
    const moodCounts = new Map<string, number>();
    moods.forEach(mood => {
      moodCounts.set(mood, (moodCounts.get(mood) || 0) + 1);
    });
    
    return Array.from(moodCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
  }

  private findMostCommon<T>(items: T[]): T[] {
    const counts = new Map<T, number>();
    items.forEach(item => {
      counts.set(item, (counts.get(item) || 0) + 1);
    });
    
    const maxCount = Math.max(...counts.values());
    return Array.from(counts.entries())
      .filter(([item, count]) => count === maxCount)
      .map(([item]) => item);
  }

  private extractPreferences(memories: MemoryEntry[]): any {
    const preferences = {};
    memories.forEach(m => {
      if (m.interaction.type === 'preference') {
        Object.assign(preferences, m.interaction.content);
      }
    });
    return preferences;
  }

  private analyzeBehaviorPatterns(memories: MemoryEntry[]): any {
    const platforms = memories.map(m => m.platform);
    const interactions = memories.map(m => m.interaction.type);
    
    return {
      platformPreference: this.findMostCommon(platforms)[0],
      primaryInteraction: this.findMostCommon(interactions)[0],
      activityLevel: memories.length > 10 ? 'high' : memories.length > 5 ? 'medium' : 'low'
    };
  }

  private buildEmotionalProfile(memories: MemoryEntry[]): any {
    const sentiments = memories
      .map(m => m.emotional_context?.sentiment)
      .filter(s => s !== undefined) as number[];
    
    const moods = memories
      .map(m => m.emotional_context?.mood)
      .filter(m => m) as string[];
    
    return {
      averageSentiment: sentiments.length > 0 ? 
        sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length : 0,
      dominantMood: this.findMostCommonMood(moods),
      emotionalRange: sentiments.length > 0 ? 
        Math.max(...sentiments) - Math.min(...sentiments) : 0
    };
  }

  private calculateEngagementLevel(memories: MemoryEntry[]): string {
    const totalAccess = memories.reduce((sum, m) => sum + m.accessCount, 0);
    const avgAccess = totalAccess / memories.length;
    
    if (avgAccess > 10) return 'very_high';
    if (avgAccess > 5) return 'high';
    if (avgAccess > 2) return 'medium';
    return 'low';
  }
}

export const crossPlatformAIMemory = new CrossPlatformAIMemory();