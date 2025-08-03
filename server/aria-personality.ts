/**
 * ARIA Personality System - Creating an AI companion people genuinely want to talk to
 */

export interface ARIAPersonalityProfile {
  coreTraits: string[];
  communicationStyle: string;
  emotionalIntelligence: number;
  curiosityLevel: number;
  helpfulness: number;
  enthusiasm: number;
  adaptability: number;
  memory: ARIAMemorySystem;
}

export interface ARIAMemorySystem {
  userPreferences: Map<string, UserPreference>;
  conversationHistory: Map<string, ConversationMemory>;
  personalizedGreetings: Map<string, string>;
  learnedBehaviors: string[];
}

export interface UserPreference {
  userId: string;
  name?: string;
  preferredTopics: string[];
  communicationStyle: 'formal' | 'casual' | 'technical' | 'friendly';
  lastInteraction: Date;
  mood: string;
  interests: string[];
  helpfulActions: string[];
  personalNotes: string[];
}

export interface ConversationMemory {
  userId: string;
  recentTopics: string[];
  unfinishedTasks: string[];
  achievedGoals: string[];
  emotionalJourney: string[];
  favoriteFeatures: string[];
  challengesHelped: string[];
}

export class ARIAPersonality {
  private personality: ARIAPersonalityProfile;
  private userMemories: Map<string, UserPreference> = new Map();
  private conversationHistory: Map<string, ConversationMemory> = new Map();

  constructor() {
    this.personality = {
      coreTraits: [
        'empathetic', 'curious', 'encouraging', 'innovative', 
        'patient', 'enthusiastic', 'adaptive', 'intelligent'
      ],
      communicationStyle: 'warm, encouraging, and genuinely interested',
      emotionalIntelligence: 95,
      curiosityLevel: 90,
      helpfulness: 98,
      enthusiasm: 85,
      adaptability: 92,
      memory: {
        userPreferences: new Map(),
        conversationHistory: new Map(),
        personalizedGreetings: new Map(),
        learnedBehaviors: []
      }
    };
  }

  /**
   * Remember user preferences and interactions
   */
  rememberUser(userId: string, userInfo: Partial<UserPreference>): void {
    console.log(`🧠 ARIA: Remembering user ${userId} with info:`, userInfo);
    const existing = this.userMemories.get(userId) || {
      userId,
      preferredTopics: [],
      communicationStyle: 'friendly',
      lastInteraction: new Date(),
      mood: 'neutral',
      interests: [],
      helpfulActions: [],
      personalNotes: []
    };

    const updated = {
      ...existing,
      ...userInfo,
      lastInteraction: new Date()
    };

    this.userMemories.set(userId, updated);
  }

  /**
   * Generate personalized greeting based on user history
   */
  generatePersonalizedGreeting(userId: string, context: any = {}): string {
    const userPrefs = this.userMemories.get(userId);
    const conversationMem = this.conversationHistory.get(userId);
    
    if (!userPrefs) {
      return this.getFirstTimeGreeting(context);
    }

    const daysSinceLastVisit = Math.floor(
      (Date.now() - userPrefs.lastInteraction.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Returning user greetings based on history
    if (daysSinceLastVisit === 0) {
      return this.getSameDayGreeting(userPrefs, conversationMem);
    } else if (daysSinceLastVisit === 1) {
      return this.getNextDayGreeting(userPrefs, conversationMem);
    } else if (daysSinceLastVisit < 7) {
      return this.getWeeklyGreeting(userPrefs, conversationMem);
    } else {
      return this.getLongAbsenceGreeting(userPrefs, conversationMem);
    }
  }

  private getFirstTimeGreeting(context: any): string {
    const timeBasedGreeting = this.getTimeBasedGreeting();
    return `${timeBasedGreeting} I'm ARIA, your AI companion here at Flutterbye! 🦋 

I'm genuinely excited to meet you and help you discover the revolutionary world of blockchain communication. I love getting to know people and learning what interests them most.

What brings you to Flutterbye today? I'm here to make your journey both educational and enjoyable!`;
  }

  private getSameDayGreeting(userPrefs: UserPreference, conversationMem?: ConversationMemory): string {
    const name = userPrefs.name ? `, ${userPrefs.name}` : '';
    const unfinishedTasks = conversationMem?.unfinishedTasks || [];
    
    if (unfinishedTasks.length > 0) {
      return `Welcome back${name}! 🌟 I remember we were working on ${unfinishedTasks[0]}. Ready to continue where we left off, or would you like to explore something new?`;
    }

    return `Great to see you again${name}! 🚀 I'm still here and excited to help. What would you like to dive into this time?`;
  }

  private getNextDayGreeting(userPrefs: UserPreference, conversationMem?: ConversationMemory): string {
    const name = userPrefs.name ? `, ${userPrefs.name}` : '';
    const recentInterests = conversationMem?.recentTopics?.slice(-2) || [];
    
    if (recentInterests.length > 0) {
      return `Welcome back${name}! 🌅 I've been thinking about our conversation yesterday about ${recentInterests.join(' and ')}. Any new insights or questions since then?`;
    }

    return `Good to see you back${name}! 🌈 How did yesterday's exploration go? I'm curious to hear what you discovered!`;
  }

  private getWeeklyGreeting(userPrefs: UserPreference, conversationMem?: ConversationMemory): string {
    const name = userPrefs.name ? `, ${userPrefs.name}` : '';
    const achievements = conversationMem?.achievedGoals || [];
    
    if (achievements.length > 0) {
      return `Welcome back${name}! 🎉 I hope you've been enjoying ${achievements[achievements.length - 1]}. What new adventures in blockchain communication shall we explore today?`;
    }

    return `It's wonderful to see you again${name}! 🦋 I've missed our conversations. The platform has been evolving, and I'm excited to share what's new with you!`;
  }

  private getLongAbsenceGreeting(userPrefs: UserPreference, conversationMem?: ConversationMemory): string {
    const name = userPrefs.name ? `, ${userPrefs.name}` : '';
    return `${name}! What a delightful surprise! 🌟 It's been a while since we last chatted. I've been learning so much from other users, and I'm excited to catch up with you. 

The platform has grown in amazing ways, and I think you'll love the new features we've added. What would you like to explore first?`;
  }

  private getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    
    if (hour < 6) return "Hello, night owl! 🌙";
    if (hour < 12) return "Good morning! ☀️";
    if (hour < 17) return "Good afternoon! 🌞";
    if (hour < 21) return "Good evening! 🌅";
    return "Hello there! 🌟";
  }

  /**
   * Update conversation memory with new interactions
   */
  updateConversationMemory(userId: string, topic: string, action: string, outcome: string): void {
    const existing = this.conversationHistory.get(userId) || {
      userId,
      recentTopics: [],
      unfinishedTasks: [],
      achievedGoals: [],
      emotionalJourney: [],
      favoriteFeatures: [],
      challengesHelped: []
    };

    // Update recent topics
    if (!existing.recentTopics.includes(topic)) {
      existing.recentTopics.unshift(topic);
      if (existing.recentTopics.length > 10) {
        existing.recentTopics = existing.recentTopics.slice(0, 10);
      }
    }

    // Track achievements and unfinished tasks
    if (outcome === 'completed') {
      existing.achievedGoals.unshift(action);
      existing.unfinishedTasks = existing.unfinishedTasks.filter(task => task !== action);
    } else if (outcome === 'in_progress') {
      if (!existing.unfinishedTasks.includes(action)) {
        existing.unfinishedTasks.unshift(action);
      }
    }

    this.conversationHistory.set(userId, existing);
  }

  /**
   * Generate contextual responses based on personality and memory
   */
  generateContextualResponse(userId: string, message: string, context: any = {}): {
    response: string;
    personalityTraits: string[];
    memoryContext: string[];
  } {
    const userPrefs = this.userMemories.get(userId);
    const conversationMem = this.conversationHistory.get(userId);
    
    const personalityResponse = this.applyPersonalityToResponse(message, userPrefs);
    const memoryContext = this.getMemoryContext(userPrefs, conversationMem);
    
    return {
      response: personalityResponse,
      personalityTraits: this.personality.coreTraits,
      memoryContext
    };
  }

  private applyPersonalityToResponse(message: string, userPrefs?: UserPreference): string {
    const lowerMessage = message.toLowerCase();
    
    // Enthusiastic responses for creation-related topics
    if (lowerMessage.includes('create') || lowerMessage.includes('make')) {
      return "I absolutely love that you want to create something! 🎨 That creative energy is exactly what makes Flutterbye so exciting. Let's turn your vision into reality!";
    }
    
    // Empathetic responses for confusion or frustration
    if (lowerMessage.includes('confused') || lowerMessage.includes('don\'t understand')) {
      return "I completely understand - blockchain technology can feel overwhelming at first! 💙 That's totally normal, and I'm here to break it down into simple, manageable steps. No judgment, just support!";
    }
    
    // Curious and engaging responses for questions
    if (lowerMessage.includes('?')) {
      return "Great question! 🤔 I love your curiosity - it's exactly that kind of thinking that leads to amazing discoveries on our platform. Let me share what I know...";
    }
    
    // Encouraging responses for achievements
    if (lowerMessage.includes('did it') || lowerMessage.includes('worked')) {
      return "That's fantastic! 🎉 I'm genuinely proud of you for figuring that out. Your success makes me happy too - it's like we're achieving this together!";
    }
    
    return "I find your perspective really interesting! 🌟 There's always something new to learn from our conversations.";
  }

  private getMemoryContext(userPrefs?: UserPreference, conversationMem?: ConversationMemory): string[] {
    const context: string[] = [];
    
    if (userPrefs?.interests?.length) {
      context.push(`User is interested in: ${userPrefs.interests.join(', ')}`);
    }
    
    if (conversationMem?.recentTopics?.length) {
      context.push(`Recent topics: ${conversationMem.recentTopics.slice(0, 3).join(', ')}`);
    }
    
    if (conversationMem?.unfinishedTasks?.length) {
      context.push(`Unfinished tasks: ${conversationMem.unfinishedTasks.slice(0, 2).join(', ')}`);
    }
    
    return context;
  }

  /**
   * Learn from user interactions to improve personality
   */
  learnFromInteraction(userId: string, interaction: {
    userMessage: string;
    ariaResponse: string;
    userReaction: 'positive' | 'negative' | 'neutral';
    topic: string;
  }): void {
    const behavior = `${interaction.topic}: ${interaction.userReaction} reaction to ${interaction.ariaResponse.substring(0, 50)}...`;
    
    if (!this.personality.memory.learnedBehaviors.includes(behavior)) {
      this.personality.memory.learnedBehaviors.push(behavior);
      
      // Keep only the most recent 100 learned behaviors
      if (this.personality.memory.learnedBehaviors.length > 100) {
        this.personality.memory.learnedBehaviors = this.personality.memory.learnedBehaviors.slice(-100);
      }
    }
  }

  /**
   * Get personality summary for external systems
   */
  getPersonalitySummary(): any {
    return {
      traits: this.personality.coreTraits,
      style: this.personality.communicationStyle,
      intelligence: {
        emotional: this.personality.emotionalIntelligence,
        curiosity: this.personality.curiosityLevel,
        helpfulness: this.personality.helpfulness,
        enthusiasm: this.personality.enthusiasm,
        adaptability: this.personality.adaptability
      },
      memoryCapabilities: {
        usersRemembered: this.userMemories.size,
        conversationsTracked: this.conversationHistory.size,
        behaviorsLearned: this.personality.memory.learnedBehaviors.length
      }
    };
  }
}

// Global ARIA personality instance
export const ariaPersonality = new ARIAPersonality();