import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StripeProvider } from "@/components/stripe/StripeProvider";
import { CheckoutForm } from "@/components/stripe/CheckoutForm";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Zap, 
  Star, 
  Crown, 
  Rocket,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Shield,
  Cpu,
  Bot,
  Wand2
} from "lucide-react";

interface AIPaymentOption {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  icon: React.ReactNode;
  color: string;
  aiCredits: number;
  popular?: boolean;
  apiCalls: number;
}

const aiPaymentOptions: AIPaymentOption[] = [
  {
    id: "ai-starter",
    name: "AI Starter",
    description: "Basic AI features for casual users",
    price: 4.99,
    aiCredits: 100,
    apiCalls: 500,
    features: [
      "100 AI Credits",
      "500 API calls/month",
      "Basic content generation",
      "Sentiment analysis",
      "Message optimization",
      "Standard support"
    ],
    icon: <Brain className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "ai-pro",
    name: "AI Professional",
    description: "Advanced AI for power users",
    price: 14.99,
    aiCredits: 500,
    apiCalls: 2500,
    features: [
      "500 AI Credits",
      "2,500 API calls/month",
      "Advanced content generation",
      "Emotional intelligence analysis",
      "Viral prediction algorithms",
      "Marketing copy optimization",
      "Priority support"
    ],
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    popular: true
  },
  {
    id: "ai-enterprise",
    name: "AI Enterprise",
    description: "Full AI suite for businesses",
    price: 39.99,
    aiCredits: 2000,
    apiCalls: 10000,
    features: [
      "2,000 AI Credits",
      "10,000 API calls/month",
      "All AI features unlocked",
      "Custom AI model training",
      "Quantum content generation",
      "Advanced analytics & insights",
      "White-label API access",
      "Dedicated support"
    ],
    icon: <Crown className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "ai-unlimited",
    name: "AI Unlimited",
    description: "Unlimited AI access subscription",
    price: 29.99,
    aiCredits: -1, // Unlimited
    apiCalls: -1, // Unlimited
    features: [
      "Unlimited AI Credits",
      "Unlimited API calls",
      "All premium AI features",
      "Real-time processing",
      "Custom integrations",
      "Advanced automation",
      "24/7 priority support"
    ],
    icon: <Rocket className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500"
  }
];

const aiFeatureCategories = [
  {
    name: "Content AI",
    features: ["Text generation", "Message optimization", "Campaign creation"],
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    name: "Emotional AI",
    features: ["Sentiment analysis", "Mood detection", "Emotional intelligence"],
    icon: <Bot className="w-5 h-5" />
  },
  {
    name: "Viral AI",
    features: ["Viral prediction", "Trend analysis", "Growth optimization"],
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    name: "Advanced AI",
    features: ["Quantum processing", "Neural networks", "Predictive analytics"],
    icon: <Cpu className="w-5 h-5" />
  }
];

export default function AIPayments() {
  const [selectedOption, setSelectedOption] = useState<AIPaymentOption | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectOption = async (option: AIPaymentOption) => {
    setSelectedOption(option);
    setLoading(true);

    try {
      let response;
      
      if (option.id === "ai-unlimited") {
        // Handle subscription for unlimited plan
        response = await apiRequest("POST", "/api/stripe/create-subscription", {
          priceId: "price_ai_unlimited_monthly", // This would be created in Stripe dashboard
          metadata: {
            type: "ai_subscription",
            plan: option.id,
            aiCredits: "unlimited",
            apiCalls: "unlimited"
          }
        });
      } else {
        // Handle one-time payment for AI credits
        response = await apiRequest("POST", "/api/stripe/create-payment-intent", {
          amount: option.price,
          description: `${option.name} - ${option.aiCredits} AI Credits`,
          metadata: {
            type: "ai_credits_purchase",
            package: option.id,
            aiCredits: option.aiCredits.toString(),
            apiCalls: option.apiCalls.toString()
          }
        });
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error creating AI payment:", error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize AI payment. Please try again.",
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
      title: "AI Payment Successful!",
      description: "Your AI credits have been added. Start using advanced AI features now!",
    });
  };

  const handlePaymentError = (error: string) => {
    console.error("AI payment error:", error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              AI-Powered Features
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Unlock the full potential of Flutterbye's revolutionary AI system. From emotional 
            intelligence to viral prediction algorithms - choose your AI power level.
          </p>
        </div>

        {/* AI Feature Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {aiFeatureCategories.map((category, index) => (
            <Card key={index} className="bg-slate-800/30 border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {category.features.map((feature, i) => (
                    <li key={i} className="text-slate-400 text-xs flex items-center gap-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {!selectedOption ? (
          /* AI Payment Options Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {aiPaymentOptions.map((option) => (
              <Card 
                key={option.id}
                className={`relative bg-slate-900/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
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
                    {option.id === "ai-unlimited" && (
                      <span className="text-sm text-slate-400">/month</span>
                    )}
                  </div>
                  <div className="text-sm text-purple-400 font-medium">
                    {option.aiCredits === -1 ? "Unlimited Credits" : `${option.aiCredits} AI Credits`}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-slate-300 text-sm">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90 text-white font-medium`}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Select AI Plan"}
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
                ← Back to AI Plans
              </Button>
            </div>

            {clientSecret ? (
              <StripeProvider clientSecret={clientSecret}>
                <CheckoutForm
                  amount={selectedOption.price}
                  description={`${selectedOption.name} - ${
                    selectedOption.aiCredits === -1 
                      ? "Unlimited AI Credits" 
                      : `${selectedOption.aiCredits} AI Credits`
                  }`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </StripeProvider>
            ) : (
              <Card className="bg-slate-900/50 border-purple-500/30">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-300">Preparing your AI payment...</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* AI Usage Info */}
        <div className="text-center mt-12">
          <div className="bg-slate-800/30 rounded-lg p-6 border border-purple-500/20 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-400" />
              How AI Credits Work
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">1 Credit</div>
                <p>Basic AI content generation or sentiment analysis</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">5 Credits</div>
                <p>Advanced viral prediction or emotional intelligence analysis</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">10 Credits</div>
                <p>Quantum content generation or complex marketing campaigns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-slate-300 text-sm">AI Processing Secured by Stripe • OpenAI GPT-4o</span>
          </div>
        </div>
      </div>
    </div>
  );
}