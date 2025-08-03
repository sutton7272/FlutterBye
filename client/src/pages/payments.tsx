import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StripeProvider } from "@/components/stripe/StripeProvider";
import { CheckoutForm } from "@/components/stripe/CheckoutForm";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Zap, 
  Star, 
  Crown, 
  Rocket,
  Coins,
  TrendingUp,
  Shield
} from "lucide-react";

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "token-pack-small",
    name: "Starter Pack",
    description: "Perfect for trying out Flutterbye",
    price: 9.99,
    features: [
      "100 FLBY Tokens",
      "Basic messaging features",
      "Standard support",
      "7-day money-back guarantee"
    ],
    icon: <Coins className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "token-pack-medium",
    name: "Growth Pack",
    description: "For active users and creators",
    price: 24.99,
    features: [
      "300 FLBY Tokens",
      "AI-powered messaging",
      "Priority support",
      "Viral acceleration tools",
      "Advanced analytics"
    ],
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    popular: true
  },
  {
    id: "token-pack-large",
    name: "Creator Pro",
    description: "For serious content creators",
    price: 49.99,
    features: [
      "750 FLBY Tokens",
      "All AI features unlocked",
      "Premium support",
      "Custom token designs",
      "Revenue sharing eligible",
      "Early access to features"
    ],
    icon: <Star className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "subscription-premium",
    name: "Premium Monthly",
    description: "Unlimited access to all features",
    price: 19.99,
    features: [
      "Unlimited FLBY Tokens",
      "All AI features",
      "Priority support",
      "Advanced analytics",
      "API access",
      "Revenue sharing"
    ],
    icon: <Crown className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500"
  }
];

export default function Payments() {
  const [selectedOption, setSelectedOption] = useState<PaymentOption | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectOption = async (option: PaymentOption) => {
    setSelectedOption(option);
    setLoading(true);

    try {
      let response;
      
      if (option.id === "subscription-premium") {
        // Handle subscription
        response = await apiRequest("POST", "/api/stripe/create-subscription", {
          priceId: "price_premium_monthly", // This would be created in Stripe dashboard
          metadata: {
            type: "subscription",
            plan: option.id
          }
        });
      } else {
        // Handle one-time payment
        response = await apiRequest("POST", "/api/stripe/create-payment-intent", {
          amount: option.price,
          description: option.description,
          metadata: {
            type: "token_purchase",
            package: option.id
          }
        });
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error creating payment:", error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setSelectedOption(null);
    setClientSecret("");
    toast({
      title: "Payment Successful!",
      description: "Your purchase has been completed. Tokens will be added to your account shortly.",
    });
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Power Up Your Flutterbye Experience
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the perfect plan to unlock AI-powered messaging, viral content creation, 
            and blockchain communication features.
          </p>
        </div>

        {!selectedOption ? (
          /* Payment Options Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {paymentOptions.map((option) => (
              <Card 
                key={option.id}
                className={`relative bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  option.popular ? 'ring-2 ring-green-500/50' : ''
                }`}
                onClick={() => handleSelectOption(option)}
              >
                {option.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 hover:bg-green-600">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center text-white mb-4`}>
                    {option.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{option.name}</CardTitle>
                  <p className="text-slate-400 text-sm">{option.description}</p>
                  <div className="text-3xl font-bold text-white">
                    ${option.price}
                    {option.id === "subscription-premium" && (
                      <span className="text-sm text-slate-400">/month</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-slate-300 text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90 text-white font-medium`}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Checkout Form */
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedOption(null);
                  setClientSecret("");
                }}
                className="mb-4"
              >
                ← Back to Plans
              </Button>
            </div>

            {clientSecret ? (
              <StripeProvider clientSecret={clientSecret}>
                <CheckoutForm
                  amount={selectedOption.price}
                  description={`${selectedOption.name} - ${selectedOption.description}`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </StripeProvider>
            ) : (
              <Card className="bg-slate-900/50 border-blue-500/30">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-300">Preparing your payment...</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Security Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-slate-300 text-sm">Secured by Stripe • SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}