import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Plus, 
  Zap,
  MessageSquare,
  Wallet,
  Brain,
  X,
  Sparkles
} from "lucide-react";

export function QuickAccessFAB() {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      href: "/create",
      label: "Create Token",
      icon: Plus,
      color: "bg-electric-blue",
      description: "Mint new token"
    },
    {
      href: "/chat",
      label: "AI Chat",
      icon: Brain,
      color: "bg-purple",
      description: "Talk to ARIA",
      special: true
    },
    {
      href: "/trade",
      label: "Quick Trade",
      icon: Zap,
      color: "bg-electric-green",
      description: "Buy/sell tokens"
    },
    {
      href: "/wallet",
      label: "Wallet",
      icon: Wallet,
      color: "bg-orange",
      description: "Manage assets"
    }
  ];

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (!isMobile) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Menu */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 space-y-3">
          {quickActions.map((action, index) => (
            <div
              key={action.href}
              className={`transform transition-all duration-300 delay-${index * 50}`}
              style={{
                transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0)',
                opacity: isOpen ? 1 : 0
              }}
            >
              <Link href={action.href}>
                <Card className="w-48 hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm">{action.label}</span>
                          {action.special && (
                            <Badge className="h-4 w-4 p-0 text-xs bg-purple text-white">
                              AI
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <Button
        size="lg"
        className={`fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? "bg-destructive hover:bg-destructive/90 rotate-45" 
            : "bg-electric-blue hover:bg-electric-blue/90"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Sparkles className="h-6 w-6" />
        )}
      </Button>
    </>
  );
}