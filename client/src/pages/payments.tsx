import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StripeProvider } from "@/components/stripe/StripeProvider";
import { CheckoutForm } from "@/components/stripe/CheckoutForm";
import { AICreditDisplay } from "@/components/ai-credit-display";
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
  Shield,
  Brain,
  Sparkles,
  Bot,
  Cpu,
  Palette,
  Music,
  Image,
  Video,
  Heart,
  Waves
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
  type: 'token' | 'ai' | 'subscription';
  credits?: number;
  tokens?: number;
  apiCalls?: number;
}

const tokenOptions: PaymentOption[] = [
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
    color: "from-blue-500 to-cyan-500",
    type: "token",
    tokens: 100
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
    popular: true,
    type: "token",
    tokens: 300
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
    color: "from-purple-500 to-pink-500",
    type: "token",
    tokens: 750
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
    color: "from-yellow-500 to-orange-500",
    type: "subscription"
  }
];

const aiCreditOptions: PaymentOption[] = [
  {
    id: "ai-starter",
    name: "AI Starter",
    description: "Perfect for exploring AI features",
    price: 4.99,
    features: [
      "100 AI Credits",
      "500 AI API Calls",
      "Basic AI features",
      "Text optimization",
      "Standard support"
    ],
    icon: <Brain className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    type: "ai",
    credits: 100,
    apiCalls: 500
  },
  {
    id: "ai-professional",
    name: "AI Professional",
    description: "Most popular for regular users",
    price: 14.99,
    features: [
      "500 AI Credits",
      "2,500 AI API Calls",
      "All AI features unlocked",
      "Priority AI processing",
      "Advanced analytics"
    ],
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    popular: true,
    type: "ai",
    credits: 500,
    apiCalls: 2500
  },
  {
    id: "ai-enterprise",
    name: "AI Enterprise",
    description: "For power users and businesses",
    price: 39.99,
    features: [
      "2,000 AI Credits",
      "10,000 AI API Calls",
      "Premium AI models",
      "Custom AI training",
      "Priority support",
      "API access"
    ],
    icon: <Bot className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    type: "ai",
    credits: 2000,
    apiCalls: 10000
  },
  {
    id: "ai-unlimited",
    name: "AI Unlimited",
    description: "Unlimited AI power for creators",
    price: 29.99,
    features: [
      "Unlimited AI Credits",
      "Unlimited AI API Calls",
      "All premium AI models",
      "Custom AI personalities",
      "White-label options",
      "24/7 priority support"
    ],
    icon: <Cpu className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
    type: "subscription"
  }
];

const flutterWaveOptions: PaymentOption[] = [
  {
    id: "flutterwave-basic",
    name: "FlutterWave Basic",
    description: "AI-powered emotional messaging starter pack",
    price: 7.99,
    features: [
      "50 AI emotional tokens",
      "Basic butterfly effect analysis",
      "SMS-to-blockchain integration",
      "Neural emotion detection",
      "Basic viral tracking"
    ],
    icon: <Waves className="w-6 h-6" />,
    color: "from-pink-500 to-purple-500",
    type: "token",
    tokens: 50
  },
  {
    id: "flutterwave-pro",
    name: "FlutterWave Pro",
    description: "Advanced emotional intelligence messaging",
    price: 19.99,
    features: [
      "200 AI emotional tokens",
      "Advanced butterfly effect simulation",
      "Quantum message threads",
      "Temporal message capsules",
      "Global butterfly pulse tracking",
      "ARIA AI companion access"
    ],
    icon: <Heart className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    popular: true,
    type: "token",
    tokens: 200
  },
  {
    id: "flutterwave-enterprise",
    name: "FlutterWave Enterprise",
    description: "Complete emotional ecosystem for businesses",
    price: 49.99,
    features: [
      "500 AI emotional tokens",
      "Custom ARIA personalities",
      "Emotional market exchange access",
      "Advanced analytics dashboard",
      "White-label integration",
      "Priority neural processing"
    ],
    icon: <Brain className="w-6 h-6" />,
    color: "from-purple-600 to-blue-600",
    type: "token",
    tokens: 500
  }
];

const flutterArtOptions: PaymentOption[] = [
  {
    id: "flutterart-creative",
    name: "FlutterArt Creative",
    description: "Revolutionary multimedia NFT creation starter",
    price: 12.99,
    features: [
      "25 multimedia NFT creations",
      "Basic AI art generation",
      "Standard templates",
      "Image & audio NFTs",
      "Basic marketplace access"
    ],
    icon: <Palette className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    type: "token",
    tokens: 25
  },
  {
    id: "flutterart-professional",
    name: "FlutterArt Professional",
    description: "Advanced multimedia NFT creator suite",
    price: 34.99,
    features: [
      "100 multimedia NFT creations",
      "Advanced AI art generation",
      "Video & interactive NFTs",
      "Custom templates & styles",
      "Premium marketplace features",
      "Revenue sharing eligible"
    ],
    icon: <Video className="w-6 h-6" />,
    color: "from-red-500 to-pink-500",
    popular: true,
    type: "token",
    tokens: 100
  },
  {
    id: "flutterart-studio",
    name: "FlutterArt Studio",
    description: "Complete creative studio for artists",
    price: 79.99,
    features: [
      "300 multimedia NFT creations",
      "AI-powered music generation",
      "3D & VR NFT support",
      "Collaborative creation tools",
      "Advanced analytics",
      "Custom branding & galleries",
      "Priority marketplace placement"
    ],
    icon: <Music className="w-6 h-6" />,
    color: "from-pink-500 to-purple-500",
    type: "token",
    tokens: 300
  }
];

interface PaymentCardProps {
  option: PaymentOption;
  onSelect: (option: PaymentOption) => void;
  loading: boolean;
}

function PaymentCard({ option, onSelect, loading }: PaymentCardProps) {
  return (
    <Card 
      className={`relative bg-slate-900/80 border-electric-blue/30 hover:border-electric-green/70 transition-all duration-300 transform hover:scale-105 cursor-pointer backdrop-blur-lg ${
        option.popular ? 'ring-2 ring-electric-green/70 shadow-lg shadow-electric-green/20' : ''
      }`}
      onClick={() => onSelect(option)}
    >
      {option.popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-electric-green to-electric-blue hover:opacity-90 animate-pulse-electric text-black font-bold">
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
          {(option.id === "subscription-premium" || option.id === "ai-unlimited") && (
            <span className="text-sm text-slate-400">/month</span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2 mb-6">
          {option.features.map((feature, index) => (
            <li key={index} className="flex items-center text-slate-300 text-sm">
              <div className="w-2 h-2 bg-electric-blue rounded-full mr-3 animate-pulse"></div>
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
  );
}

export default function Payments() {
  const [selectedOption, setSelectedOption] = useState<PaymentOption | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tokens");
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
      } else if (option.type === "ai") {
        // Handle AI credits purchase
        response = await apiRequest("POST", "/api/stripe/create-payment-intent", {
          amount: option.price,
          description: option.description,
          metadata: {
            type: "ai_credits_purchase",
            aiCredits: option.credits?.toString() || "0",
            apiCalls: option.apiCalls?.toString() || "0",
            package: option.id
          }
        });
      } else {
        // Handle regular token purchase
        response = await apiRequest("POST", "/api/stripe/create-payment-intent", {
          amount: option.price,
          description: option.description,
          metadata: {
            type: "token_purchase",
            tokens: option.tokens?.toString() || "0",
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
    <div className="min-h-screen p-4 relative">
      {/* Global background is now handled by body CSS */}
      
      {/* Electric Grid Overlay */}
      <div className="fixed inset-0 opacity-5 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-transparent to-electric-green/20" />
        <div className="absolute inset-0 bg-grid-electric opacity-30" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with Electric Effects */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Power Up Your Flutterbye Experience
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the perfect plan to unlock AI-powered messaging, viral content creation, 
            and blockchain communication features.
          </p>
          
          {/* Electric Pulse Animation */}
          <div className="flex justify-center mt-6">
            <div className="w-32 h-1 bg-gradient-to-r from-electric-blue via-electric-green to-electric-blue rounded-full">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent rounded-full animate-pulse-electric" />
            </div>
          </div>
        </div>

        {/* AI Credits Status with Electric Border */}
        <div className="mb-8">
          <div className="p-1 bg-gradient-to-r from-electric-blue/30 to-electric-green/30 rounded-lg animate-pulse-electric-slow">
            <div className="bg-slate-900/80 rounded-lg">
              <AICreditDisplay userId="demo-user" />
            </div>
          </div>
        </div>

        {!selectedOption ? (
          /* Tabbed Payment Interface */
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-900/80 border-electric-blue/30 backdrop-blur-lg">
              <TabsTrigger 
                value="tokens" 
                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-blue/20 data-[state=active]:to-electric-green/20 data-[state=active]:text-electric-blue border-electric-blue/20"
              >
                FLBY Tokens
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-blue/20 data-[state=active]:to-electric-green/20 data-[state=active]:text-electric-blue border-electric-blue/20"
              >
                AI Credits
              </TabsTrigger>
              <TabsTrigger 
                value="flutterwave" 
                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-blue/20 data-[state=active]:to-electric-green/20 data-[state=active]:text-electric-blue border-electric-blue/20"
              >
                FlutterWave
              </TabsTrigger>
              <TabsTrigger 
                value="flutterart" 
                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-blue/20 data-[state=active]:to-electric-green/20 data-[state=active]:text-electric-blue border-electric-blue/20"
              >
                FlutterArt
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tokens" className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">FLBY Token Packages</h2>
                <p className="text-slate-400">Power your blockchain messaging with FLBY tokens</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tokenOptions.map((option) => (
                  <PaymentCard key={option.id} option={option} onSelect={handleSelectOption} loading={loading} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">AI Credit Packages</h2>
                <p className="text-slate-400">Unlock advanced AI features and capabilities</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {aiCreditOptions.map((option) => (
                  <PaymentCard key={option.id} option={option} onSelect={handleSelectOption} loading={loading} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="flutterwave" className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">FlutterWave Packages</h2>
                <p className="text-slate-400">AI-powered emotional messaging with butterfly effect simulation</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {flutterWaveOptions.map((option) => (
                  <PaymentCard key={option.id} option={option} onSelect={handleSelectOption} loading={loading} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="flutterart" className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">FlutterArt Packages</h2>
                <p className="text-slate-400">Revolutionary multimedia NFT creation and management</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {flutterArtOptions.map((option) => (
                  <PaymentCard key={option.id} option={option} onSelect={handleSelectOption} loading={loading} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
                className="mb-4 border-electric-blue/50 text-electric-blue hover:bg-electric-blue/10"
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
              <Card className="bg-slate-900/80 border-electric-blue/30 backdrop-blur-lg">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-electric-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-300">Preparing your payment...</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Security Badge with Electric Effects */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-full border border-electric-blue/30 backdrop-blur-lg">
            <Shield className="w-4 h-4 text-electric-green animate-pulse" />
            <span className="text-slate-300 text-sm">Secured by Stripe • SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}