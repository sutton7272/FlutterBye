import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Zap, 
  MessageSquare, 
  Coins, 
  TrendingUp, 
  Gift, 
  Target,
  Sparkles,
  ArrowRight,
  Clock,
  Star
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
  badge?: string;
  estimatedTime?: string;
}

export function QuickActionPanel() {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const quickActions: QuickAction[] = [
    {
      id: "instant-mint",
      title: "Instant Mint",
      description: "Create tokens in 30 seconds",
      icon: <Zap className="h-5 w-5" />,
      color: "from-yellow-500 to-orange-500",
      href: "/mint",
      badge: "FASTEST",
      estimatedTime: "30s"
    },
    {
      id: "sms-token",
      title: "SMS to Token", 
      description: "Text +1 (844) BYE-TEXT",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
      href: "/sms-integration",
      badge: "HOT",
      estimatedTime: "1m"
    },
    {
      id: "enhanced-mint",
      title: "Pro Mint",
      description: "Full metadata & bulk pricing",
      icon: <Sparkles className="h-5 w-5" />,
      color: "from-purple-500 to-pink-500",
      href: "/mint-enhanced",
      badge: "ADVANCED",
      estimatedTime: "3m"
    },
    {
      id: "explore-tokens",
      title: "Discover",
      description: "Find trending tokens",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
      href: "/explore",
      estimatedTime: "Browse"
    },
    {
      id: "redeem-codes",
      title: "Free Codes",
      description: "Claim free Flutterbye tokens",
      icon: <Gift className="h-5 w-5" />,
      color: "from-red-500 to-pink-500",
      href: "/free-codes",
      badge: "FREE",
      estimatedTime: "Instant"
    },
    {
      id: "holder-analysis",
      title: "Analyze Holders",
      description: "Target top token holders",
      icon: <Target className="h-5 w-5" />,
      color: "from-indigo-500 to-purple-500",
      href: "/mint-enhanced",
      badge: "BETA",
      estimatedTime: "2m"
    }
  ];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <Badge variant="outline" className="text-xs">
          <Star className="h-3 w-3 mr-1" />
          Most Popular
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((action) => (
          <Link key={action.id} href={action.href}>
            <Card 
              className={`
                cursor-pointer transition-all duration-300 hover:scale-105 
                bg-gradient-to-br ${action.color} 
                border-0 text-white hover:shadow-xl
                ${hoveredAction === action.id ? 'shadow-2xl scale-105' : ''}
              `}
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {action.icon}
                  </div>
                  {action.badge && (
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] bg-white/20 text-white border-white/30"
                    >
                      {action.badge}
                    </Badge>
                  )}
                </div>
                
                <h4 className="font-semibold mb-1">{action.title}</h4>
                <p className="text-sm text-white/80 mb-3">{action.description}</p>
                
                <div className="flex items-center justify-between">
                  {action.estimatedTime && (
                    <div className="flex items-center gap-1 text-xs text-white/70">
                      <Clock className="h-3 w-3" />
                      {action.estimatedTime}
                    </div>
                  )}
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}