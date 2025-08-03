export interface AIUsageStats {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  apiCallsUsed: number;
  apiCallsLimit: number;
  subscriptionType: 'none' | 'starter' | 'pro' | 'enterprise' | 'unlimited';
  subscriptionExpiry?: Date;
}

export interface AITransaction {
  id: string;
  userId: string;
  type: 'credit_purchase' | 'subscription' | 'usage';
  amount: number;
  credits: number;
  description: string;
  timestamp: Date;
  stripePaymentId?: string;
}

export class AIPaymentService {
  private static instance: AIPaymentService;
  private userUsage: Map<string, AIUsageStats> = new Map();
  private transactions: AITransaction[] = [];

  static getInstance(): AIPaymentService {
    if (!AIPaymentService.instance) {
      AIPaymentService.instance = new AIPaymentService();
    }
    return AIPaymentService.instance;
  }

  // Get user's current AI usage stats
  getUserUsage(userId: string): AIUsageStats {
    if (!this.userUsage.has(userId)) {
      this.userUsage.set(userId, {
        totalCredits: 0,
        usedCredits: 0,
        remainingCredits: 0,
        apiCallsUsed: 0,
        apiCallsLimit: 0,
        subscriptionType: 'none'
      });
    }
    return this.userUsage.get(userId)!;
  }

  // Add credits to user account (from purchase)
  addCredits(userId: string, credits: number, apiCalls: number, paymentId?: string): void {
    const usage = this.getUserUsage(userId);
    usage.totalCredits += credits;
    usage.remainingCredits += credits;
    usage.apiCallsLimit += apiCalls;

    // Create transaction record
    this.transactions.push({
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'credit_purchase',
      amount: credits,
      credits,
      description: `Purchased ${credits} AI credits with ${apiCalls} API calls`,
      timestamp: new Date(),
      stripePaymentId: paymentId
    });

    console.log(`Added ${credits} AI credits to user ${userId}. Total: ${usage.totalCredits}`);
  }

  // Set subscription for user
  setSubscription(userId: string, type: AIUsageStats['subscriptionType'], expiryDate?: Date): void {
    const usage = this.getUserUsage(userId);
    usage.subscriptionType = type;
    usage.subscriptionExpiry = expiryDate;

    // Set credits based on subscription type
    switch (type) {
      case 'starter':
        usage.totalCredits = 100;
        usage.remainingCredits = 100;
        usage.apiCallsLimit = 500;
        break;
      case 'pro':
        usage.totalCredits = 500;
        usage.remainingCredits = 500;
        usage.apiCallsLimit = 2500;
        break;
      case 'enterprise':
        usage.totalCredits = 2000;
        usage.remainingCredits = 2000;
        usage.apiCallsLimit = 10000;
        break;
      case 'unlimited':
        usage.totalCredits = -1; // Unlimited
        usage.remainingCredits = -1;
        usage.apiCallsLimit = -1;
        break;
    }

    console.log(`Set ${type} subscription for user ${userId}`);
  }

  // Use credits for AI operation
  useCredits(userId: string, creditsToUse: number, operation: string): boolean {
    const usage = this.getUserUsage(userId);

    // Check unlimited subscription
    if (usage.subscriptionType === 'unlimited' && usage.subscriptionExpiry && usage.subscriptionExpiry > new Date()) {
      usage.apiCallsUsed += 1;
      this.recordUsage(userId, creditsToUse, operation);
      return true;
    }

    // Check if user has enough credits
    if (usage.remainingCredits < creditsToUse) {
      console.log(`Insufficient AI credits for user ${userId}. Required: ${creditsToUse}, Available: ${usage.remainingCredits}`);
      return false;
    }

    // Check API call limits
    if (usage.apiCallsLimit > 0 && usage.apiCallsUsed >= usage.apiCallsLimit) {
      console.log(`API call limit exceeded for user ${userId}`);
      return false;
    }

    // Deduct credits
    usage.remainingCredits -= creditsToUse;
    usage.usedCredits += creditsToUse;
    usage.apiCallsUsed += 1;

    this.recordUsage(userId, creditsToUse, operation);
    return true;
  }

  private recordUsage(userId: string, credits: number, operation: string): void {
    this.transactions.push({
      id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'usage',
      amount: -credits,
      credits: -credits,
      description: `Used ${credits} credits for ${operation}`,
      timestamp: new Date()
    });
  }

  // Get credit cost for different AI operations
  getOperationCost(operation: string): number {
    const costs: Record<string, number> = {
      'content_generation': 1,
      'sentiment_analysis': 1,
      'message_optimization': 2,
      'viral_prediction': 5,
      'emotional_intelligence': 5,
      'marketing_campaign': 10,
      'quantum_content': 10,
      'advanced_analytics': 15,
      'custom_training': 25
    };

    return costs[operation] || 1;
  }

  // Get user's transaction history
  getUserTransactions(userId: string): AITransaction[] {
    return this.transactions.filter(tx => tx.userId === userId);
  }

  // Check if user can perform operation
  canPerformOperation(userId: string, operation: string): boolean {
    const cost = this.getOperationCost(operation);
    const usage = this.getUserUsage(userId);

    // Unlimited subscription check
    if (usage.subscriptionType === 'unlimited' && usage.subscriptionExpiry && usage.subscriptionExpiry > new Date()) {
      return true;
    }

    return usage.remainingCredits >= cost && 
           (usage.apiCallsLimit === -1 || usage.apiCallsUsed < usage.apiCallsLimit);
  }

  // Get all users with AI usage (for admin)
  getAllUsersUsage(): { userId: string; usage: AIUsageStats }[] {
    return Array.from(this.userUsage.entries()).map(([userId, usage]) => ({
      userId,
      usage
    }));
  }

  // Reset monthly limits (for subscriptions)
  resetMonthlyLimits(userId: string): void {
    const usage = this.getUserUsage(userId);
    usage.apiCallsUsed = 0;
    
    // Reset credits based on subscription
    if (usage.subscriptionType !== 'none' && usage.subscriptionType !== 'unlimited') {
      this.setSubscription(userId, usage.subscriptionType, usage.subscriptionExpiry);
    }
  }
}

export const aiPaymentService = AIPaymentService.getInstance();