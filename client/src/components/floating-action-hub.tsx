import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Plus, 
  MessageSquare, 
  Zap, 
  Share2, 
  Gift,
  TrendingUp,
  X,
  Sparkles
} from "lucide-react";

export function FloatingActionHub() {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    {
      id: "instant-mint",
      title: "Instant Mint",
      href: "/mint",
      icon: <Zap className="h-4 w-4" />,
      color: "from-yellow-500 to-orange-500",
      badge: "FAST"
    },
    {
      id: "sms-token",
      title: "SMS → Token",
      href: "/sms-integration", 
      icon: <MessageSquare className="h-4 w-4" />,
      color: "from-blue-500 to-cyan-500",
      badge: "HOT"
    },
    {
      id: "share-showcase",
      title: "Share Token",
      href: "/portfolio",
      icon: <Share2 className="h-4 w-4" />,
      color: "from-purple-500 to-pink-500",
      badge: "VIRAL"
    },
    {
      id: "free-codes",
      title: "Free Codes",
      href: "/free-codes",
      icon: <Gift className="h-4 w-4" />,
      color: "from-green-500 to-emerald-500", 
      badge: "FREE"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Actions */}
      {isExpanded && (
        <div className="mb-4 space-y-2">
          {quickActions.map((action, index) => (
            <Link key={action.id} href={action.href}>
              <Card 
                className={`
                  cursor-pointer transition-all duration-300 hover:scale-105
                  bg-gradient-to-r ${action.color} border-0 text-white
                  transform translate-x-0 opacity-100
                  animate-in slide-in-from-right duration-300
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-3 flex items-center gap-3 min-w-[180px]">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{action.title}</div>
                  </div>
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                      {action.badge}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Main Action Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        size="lg"
        className={`
          w-14 h-14 rounded-full shadow-xl transition-all duration-300
          bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
      >
        {isExpanded ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>

      {/* Pulse Animation Ring */}
      {!isExpanded && (
        <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping"></div>
      )}
    </div>
  );
}