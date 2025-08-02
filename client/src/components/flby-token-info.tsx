import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Coins, TrendingUp, Gift, Star, Shield, Vote, Lock } from "lucide-react";
import { Link } from "wouter";

interface FlbyTokenInfoProps {
  onGetTokens?: () => void;
  showGetTokensButton?: boolean;
}

export default function FlbyTokenInfo({ onGetTokens, showGetTokensButton = true }: FlbyTokenInfoProps) {
  const tokenBenefits = [
    {
      icon: Zap,
      title: "10% Fee Discount",
      description: "Save on all platform fees when paying with FLBY tokens"
    },
    {
      icon: TrendingUp,
      title: "Governance Rights",
      description: "Vote on platform improvements and new features"
    },
    {
      icon: Gift,
      title: "Exclusive Access",
      description: "Early access to new features and premium templates"
    },
    {
      icon: Star,
      title: "Staking Rewards",
      description: "Earn additional FLBY tokens by staking your holdings"
    },
    {
      icon: Shield,
      title: "Priority Support",
      description: "Premium customer support and faster processing"
    }
  ];

  return (
    <Card className="electric-frame">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient">
          <Zap className="w-5 h-5" />
          FLBY Native Token
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <span className="text-2xl font-bold text-gradient">FLBY Token</span>
          </div>
          <p className="text-sm text-muted-foreground">
            The native utility token powering the Flutterbye ecosystem
          </p>
          <Badge variant="secondary" className="mt-2">
            Coming Soon - Q2 2024
          </Badge>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Token Benefits</h4>
          <div className="grid grid-cols-1 gap-3">
            {tokenBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                <benefit.icon className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h5 className="font-medium text-sm">{benefit.title}</h5>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-yellow-600 dark:text-yellow-400">
            Early Access Program
          </h4>
          <p className="text-sm text-muted-foreground">
            Get notified when FLBY tokens become available and receive early access benefits.
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            <Link href="/flby/staking">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Lock className="w-3 h-3 mr-1" />
                Staking
              </Button>
            </Link>
            <Link href="/flby/governance">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <Vote className="w-3 h-3 mr-1" />
                Governance
              </Button>
            </Link>
          </div>
          
          {showGetTokensButton && (
            <Button
              onClick={onGetTokens}
              variant="outline"
              size="sm"
              className="w-full border-yellow-500/50 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/10"
            >
              <Zap className="w-4 h-4 mr-2" />
              Join Early Access
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <p className="mb-1"><strong>Token Address:</strong> FLBY1234...567890 (Testnet)</p>
          <p><strong>Total Supply:</strong> 1,000,000,000 FLBY</p>
        </div>
      </CardContent>
    </Card>
  );
}