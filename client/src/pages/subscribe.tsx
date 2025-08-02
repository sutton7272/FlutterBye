import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Crown, CheckCircle2, Sparkles, Bot, Mic, Image, Palette, Shield, Award } from 'lucide-react';

// Stripe configuration
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

interface SubscriptionFormProps {
  selectedPlan: 'basic' | 'pro' | 'enterprise';
  onSuccess: () => void;
}

function SubscriptionForm({ selectedPlan, onSuccess }: SubscriptionFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/chat?upgraded=true`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Premium!",
          description: "Your subscription is now active.",
        });
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {isLoading ? 'Processing...' : `Subscribe to ${selectedPlan} Plan`}
      </Button>
    </form>
  );
}

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'enterprise'>('pro');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const plans = {
    basic: {
      name: 'Basic',
      price: 9.99,
      features: ['Custom Reactions', 'Premium Themes', 'Voice Messages'],
      color: 'purple',
      icon: Sparkles
    },
    pro: {
      name: 'Pro',
      price: 19.99,
      features: ['Everything in Basic', 'AI Chat Assistant', 'File Sharing', 'NFT Integration', 'Poll Creation'],
      color: 'yellow',
      icon: Crown,
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      price: 49.99,
      features: ['Everything in Pro', 'Priority Support', 'Analytics Dashboard', 'White-label Options', 'API Access'],
      color: 'cyan',
      icon: Shield
    }
  };

  const createSubscription = async (plan: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/create-subscription', { 
        plan: plan,
        priceId: `price_${plan}_monthly` // Placeholder price IDs
      });
      
      if (response.ok) {
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } else {
        throw new Error('Failed to create subscription');
      }
    } catch (error) {
      toast({
        title: "Setup Error",
        description: "Stripe is not configured yet. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only create subscription if we have valid Stripe keys
    if (import.meta.env.VITE_STRIPE_PUBLIC_KEY && import.meta.env.VITE_STRIPE_PUBLIC_KEY !== 'pk_test_placeholder') {
      createSubscription(selectedPlan);
    }
  }, [selectedPlan]);

  return (
    <div className="min-h-screen p-6 pt-20 bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Choose Your Premium Plan
          </h1>
          <p className="text-slate-400 text-lg">
            Unlock powerful features and elevate your blockchain messaging experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(plans).map(([planKey, plan]) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === planKey;
            
            return (
              <Card 
                key={planKey}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? (plan.color === 'purple' ? 'border-purple-500 bg-purple-500/5' :
                       plan.color === 'yellow' ? 'border-yellow-500 bg-yellow-500/5' :
                       'border-cyan-500 bg-cyan-500/5')
                    : 'border-slate-700 hover:border-slate-600'
                } ${'popular' in plan && plan.popular ? 'scale-105' : ''}`}
                onClick={() => setSelectedPlan(planKey as any)}
              >
                {'popular' in plan && plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-3">
                    <div className={`p-3 rounded-full ${
                      plan.color === 'purple' ? 'bg-purple-500/20' :
                      plan.color === 'yellow' ? 'bg-yellow-500/20' :
                      'bg-cyan-500/20'
                    }`}>
                      <IconComponent className={`w-8 h-8 ${
                        plan.color === 'purple' ? 'text-purple-400' :
                        plan.color === 'yellow' ? 'text-yellow-400' :
                        'text-cyan-400'
                      }`} />
                    </div>
                  </div>
                  <CardTitle className={`text-2xl ${
                    plan.color === 'purple' ? 'text-purple-400' :
                    plan.color === 'yellow' ? 'text-yellow-400' :
                    'text-cyan-400'
                  }`}>
                    {plan.name}
                  </CardTitle>
                  <div className="text-4xl font-bold text-white">
                    ${plan.price}
                    <span className="text-lg text-slate-400 font-normal">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <Button 
                      className={`w-full ${
                        isSelected 
                          ? (plan.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' :
                             plan.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' :
                             'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700')
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      onClick={() => setSelectedPlan(planKey as any)}
                    >
                      {isSelected ? 'Selected' : 'Select Plan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Payment Form */}
        {clientSecret && stripePromise ? (
          <Card className="max-w-md mx-auto bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-center text-purple-400">
                Complete Your Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscriptionForm 
                  selectedPlan={selectedPlan} 
                  onSuccess={() => window.location.href = '/chat?upgraded=true'}
                />
              </Elements>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-md mx-auto bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="text-slate-400 mb-4">
                Payment system is being configured...
              </div>
              <Button 
                disabled={isLoading}
                onClick={() => createSubscription(selectedPlan)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? 'Setting up...' : 'Continue'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Feature Showcase */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Bot className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="font-medium text-white">AI Assistant</h3>
            <p className="text-sm text-slate-400">Smart message crafting</p>
          </div>
          <div className="text-center">
            <Mic className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h3 className="font-medium text-white">Voice Messages</h3>
            <p className="text-sm text-slate-400">Audio communication</p>
          </div>
          <div className="text-center">
            <Palette className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-medium text-white">Premium Themes</h3>
            <p className="text-sm text-slate-400">6 exclusive designs</p>
          </div>
          <div className="text-center">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-medium text-white">Priority Support</h3>
            <p className="text-sm text-slate-400">24/7 assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
}