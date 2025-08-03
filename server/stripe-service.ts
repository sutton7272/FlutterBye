import Stripe from "stripe";

let stripe: Stripe | null = null;

// Initialize Stripe with error handling
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-07-30.basil",
    });
  }
} catch (error) {
  console.error("Failed to initialize Stripe:", error);
}

export class StripeService {
  private stripe: Stripe;

  constructor() {
    if (!stripe) {
      throw new Error("Stripe not initialized. Please check STRIPE_SECRET_KEY environment variable.");
    }
    this.stripe = stripe;
  }

  // Create payment intent for one-time payments (token purchases)
  async createPaymentIntent(amount: number, currency: string = "usd", metadata?: Record<string, string>) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  }

  // Create or retrieve customer
  async createOrGetCustomer(email: string, name?: string, userId?: string) {
    try {
      // First try to find existing customer
      const existingCustomers = await this.stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
      }

      // Create new customer
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: userId ? { userId } : {},
      });

      return customer;
    } catch (error) {
      console.error("Error creating/getting customer:", error);
      throw error;
    }
  }

  // Create subscription for premium features
  async createSubscription(customerId: string, priceId: string, metadata?: Record<string, string>) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata: metadata || {},
      });

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = latestInvoice?.payment_intent as Stripe.PaymentIntent;
      
      return {
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret,
        status: subscription.status,
      };
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId: string) {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.error("Error retrieving subscription:", error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string) {
    try {
      return await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  }

  // Create product and price for API monetization
  async createProduct(name: string, description?: string) {
    try {
      return await this.stripe.products.create({
        name,
        description,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  // Create price for a product
  async createPrice(productId: string, amount: number, currency: string = "usd", interval?: "month" | "year") {
    try {
      const priceData: Stripe.PriceCreateParams = {
        product: productId,
        unit_amount: Math.round(amount * 100),
        currency,
      };

      if (interval) {
        priceData.recurring = { interval };
      }

      return await this.stripe.prices.create(priceData);
    } catch (error) {
      console.error("Error creating price:", error);
      throw error;
    }
  }

  // Get customer payment methods
  async getCustomerPaymentMethods(customerId: string) {
    try {
      return await this.stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });
    } catch (error) {
      console.error("Error getting payment methods:", error);
      throw error;
    }
  }

  // Create invoice for API usage billing
  async createInvoice(customerId: string, items: Array<{ description: string; amount: number; quantity?: number }>) {
    try {
      // Add invoice items
      for (const item of items) {
        await this.stripe.invoiceItems.create({
          customer: customerId,
          amount: Math.round(item.amount * 100),
          currency: "usd",
          description: item.description,
          quantity: item.quantity || 1,
        });
      }

      // Create and send invoice
      const invoice = await this.stripe.invoices.create({
        customer: customerId,
        auto_advance: true,
      });

      if (invoice.id) {
        await this.stripe.invoices.finalizeInvoice(invoice.id);
      }
      return invoice;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  }

  // Webhook event handling
  constructEvent(payload: string | Buffer, signature: string, endpointSecret: string) {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (error) {
      console.error("Error constructing webhook event:", error);
      throw error;
    }
  }

  // Get payment intent details
  async getPaymentIntent(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      throw error;
    }
  }

  // Refund payment
  async createRefund(paymentIntentId: string, amount?: number) {
    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }

      return await this.stripe.refunds.create(refundData);
    } catch (error) {
      console.error("Error creating refund:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const stripeService = process.env.STRIPE_SECRET_KEY ? new StripeService() : null;