import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Coins, Wallet, Send, Flame, Shield, ArrowRight, CheckCircle, Users, TrendingUp, Zap, MessageCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <Wallet className="w-8 h-8 text-blue-500" />,
      title: "Connect Your Wallet",
      description: "Connect your Solana wallet (Phantom, Solflare) to start creating and receiving tokens.",
      details: ["Secure wallet integration", "No private key sharing", "One-click connection", "9 major wallets supported"]
    },
    {
      icon: <Coins className="w-8 h-8 text-green-500" />,
      title: "Create Solo or Collaborate",
      description: "Create tokens alone or join collaborative sessions with others in real-time.",
      details: ["Solo creation with AI optimization", "Real-time collaborative sessions", "Live contribution tracking", "Multi-user decision making"]
    },
    {
      icon: <Flame className="w-8 h-8 text-orange-500" />,
      title: "Go Viral & Trending",
      description: "Track viral potential and discover trending tokens with advanced engagement analytics.",
      details: ["Real-time viral scoring", "Growth trend analysis", "Engagement optimization", "Trending discovery"]
    },
    {
      icon: <Send className="w-8 h-8 text-purple-500" />,
      title: "Send & Share",
      description: "Send your tokens to friends, share publicly, or trade on the marketplace.",
      details: ["Direct wallet transfers", "Public sharing options", "Marketplace trading", "Batch distribution"]
    },
    {
      icon: <Flame className="w-8 h-8 text-red-500" />,
      title: "Burn to Redeem",
      description: "Burn your tokens to redeem their attached value directly to your wallet.",
      details: ["Instant redemption", "Secure escrow release", "Transaction transparency", "Automated processing"]
    }
  ];

  const features = [
    {
      title: "Real-Time Collaboration",
      description: "Create tokens together with others in live collaborative sessions with instant updates.",
      icon: <Users className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Viral Acceleration Engine",
      description: "Advanced viral scoring tracks engagement trends and optimizes your token's viral potential.",
      icon: <TrendingUp className="w-6 h-6 text-green-500" />
    },
    {
      title: "AI-Powered Optimization",
      description: "Smart text optimization helps you create the most effective 27-character messages.",
      icon: <Zap className="w-6 h-6 text-yellow-500" />
    },
    {
      title: "Secure Escrow System",
      description: "Your attached value is safely held in secure escrow wallets until redemption.",
      icon: <Shield className="w-6 h-6 text-green-500" />
    },
    {
      title: "SMS Integration",
      description: "Send emotional tokens directly through SMS messages for cross-platform communication.",
      icon: <MessageCircle className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Transparent Tracking",
      description: "Track all your transactions, redemptions, and token activity in your dashboard.",
      icon: <CheckCircle className="w-6 h-6 text-blue-500" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 bg-clip-text text-transparent electric-frame">
            How Flutterbye Works
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Revolutionary blockchain messaging with collaborative creation and viral acceleration
          </p>
          <Badge variant="outline" className="mb-2 border-blue-500 text-blue-400">
            Industry-First Collaborative Features
          </Badge>
        </div>

        {/* Process Steps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Simple 5-Step Process</h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Step {index + 1}</Badge>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base mt-2">
                        {step.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                {index < steps.length - 1 && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary-foreground rotate-90" />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Revolutionary Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Revolutionary Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Collaborative & Viral Features */}
        <Card className="mb-8 electric-frame">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Industry-Disrupting Features
            </CardTitle>
            <CardDescription className="text-center">
              Revolutionary collaborative and viral mechanics that no competitor offers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Collaborative Creation
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Real-time multi-user token sessions</li>
                  <li>• Live contribution tracking and analytics</li>
                  <li>• Creator/contributor role management</li>
                  <li>• Session discovery and joining</li>
                  <li>• Collaborative decision making</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Viral Acceleration
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Real-time viral score calculation</li>
                  <li>• Growth trend analysis (hourly/daily/weekly)</li>
                  <li>• Engagement optimization suggestions</li>
                  <li>• Trending discovery mechanisms</li>
                  <li>• Viral potential prediction</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Economics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Token Economics</CardTitle>
            <CardDescription className="text-center">
              Understanding FLBY-MSG tokens and value attachment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-green-500" />
                  Token Creation
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Standard symbol: FLBY-MSG</li>
                  <li>• 27-character message limit</li>
                  <li>• Optional SOL/USDC attachment</li>
                  <li>• Custom image support</li>
                  <li>• Immutable once created</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-500" />
                  Escrow System
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Secure value storage</li>
                  <li>• Automated release on burn</li>
                  <li>• Transparent tracking</li>
                  <li>• Refund mechanisms</li>
                  <li>• Multi-currency support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What happens when I burn a token?</h3>
              <p className="text-sm text-muted-foreground">
                When you burn a token with attached value, the token is permanently destroyed and the escrowed SOL/USDC is automatically released to your wallet. This process is irreversible.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I create tokens without attaching value?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can create message-only tokens without any attached value. These tokens can still be shared and traded, but have no redemption value.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How long can I hold tokens before redeeming?</h3>
              <p className="text-sm text-muted-foreground">
                Tokens with attached value can be held indefinitely. However, some tokens may have expiration dates set by their creators for automatic refunds.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do collaborative sessions work?</h3>
              <p className="text-sm text-muted-foreground">
                Start a collaborative session from the Mint page, share the session ID, and invite others to contribute in real-time. All participants can suggest changes, vote on decisions, and track viral potential together.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What makes tokens go viral?</h3>
              <p className="text-sm text-muted-foreground">
                Our viral acceleration engine tracks engagement patterns, sharing velocity, and community interaction to calculate viral scores. Higher engagement leads to trending status and increased visibility.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Are there any fees for creating or redeeming tokens?</h3>
              <p className="text-sm text-muted-foreground">
                Standard Solana network fees apply for all blockchain transactions. There's also a small platform fee for image uploads and premium features.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}