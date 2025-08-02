import Stripe from 'stripe';

// Initialize Stripe - will use test keys when no real keys are provided
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', 
  {
    apiVersion: '2024-06-20',
  }
);

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
}

export const subscriptionPlans: Record<string, SubscriptionPlan> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic_monthly',
    features: ['Custom Reactions', 'Premium Themes', 'Voice Messages']
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    features: ['Everything in Basic', 'AI Chat Assistant', 'File Sharing', 'NFT Integration', 'Poll Creation']
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49.99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_monthly',
    features: ['Everything in Pro', 'Priority Support', 'Analytics Dashboard', 'White-label Options', 'API Access']
  }
};

export class StripeService {
  private stripe: Stripe;
  private isConfigured: boolean;

  constructor() {
    this.stripe = stripe;
    this.isConfigured = !!(process.env.STRIPE_SECRET_KEY && 
                           process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder');
  }

  isStripeConfigured(): boolean {
    return this.isConfigured;
  }

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    if (!this.isConfigured) {
      throw new Error('Stripe is not configured');
    }

    return await this.stripe.customers.create({
      email,
      name,
    });
  }

  async createSubscription(
    customerId: string, 
    planId: string
  ): Promise<{ subscription: Stripe.Subscription; clientSecret: string }> {
    if (!this.isConfigured) {
      throw new Error('Stripe is not configured');
    }

    const plan = subscriptionPlans[planId];
    if (!plan) {
      throw new Error(`Invalid plan: ${planId}`);
    }

    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: plan.priceId,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return {
      subscription,
      clientSecret: paymentIntent.client_secret!,
    };
  }

  async createPaymentIntent(amount: number, currency = 'usd'): Promise<Stripe.PaymentIntent> {
    if (!this.isConfigured) {
      throw new Error('Stripe is not configured');
    }

    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: { enabled: true },
    });
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    if (!this.isConfigured) {
      throw new Error('Stripe is not configured');
    }

    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async updateSubscription(
    subscriptionId: string, 
    newPlanId: string
  ): Promise<Stripe.Subscription> {
    if (!this.isConfigured) {
      throw new Error('Stripe is not configured');
    }

    const plan = subscriptionPlans[newPlanId];
    if (!plan) {
      throw new Error(`Invalid plan: ${newPlanId}`);
    }

    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    
    return await this.stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: plan.priceId,
      }],
      proration_behavior: 'always_invoice',
    });
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    if (!this.isConfigured) {
      throw new Error('Stripe is not configured');
    }

    return await this.stripe.subscriptions.cancel(subscriptionId);
  }

  async handleWebhook(
    payload: string | Buffer, 
    signature: string
  ): Promise<Stripe.Event> {
    if (!this.isConfigured) {
      throw new Error('Stripe is not configured');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  // Mock methods for when Stripe is not configured
  createMockResponse(message: string) {
    return {
      success: false,
      message,
      mock: true
    };
  }
}

export const stripeService = new StripeService();