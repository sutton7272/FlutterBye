import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Coins, 
  Users, 
  Brain, 
  Settings,
  Home,
  Plus,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { useFeatureToggles } from "@/hooks/useFeatureToggles";

export function MobileNavigation() {
  const [location] = useLocation();
  const { isFeatureEnabled } = useFeatureToggles();

  // Simplified mobile navigation items
  const navItems = [
    { 
      href: "/dashboard", 
      label: "Home", 
      icon: LayoutDashboard, 
      featureId: "home" 
    },
    { 
      href: "/create", 
      label: "Create", 
      icon: Plus, 
      featureId: "mint",
      highlight: true
    },
    { 
      href: "/trade", 
      label: "Trade", 
      icon: TrendingUp, 
      featureId: "marketplace" 
    },
    { 
      href: "/intelligence", 
      label: "AI", 
      icon: Brain, 
      featureId: "flutterai",
      special: true
    }
  ];

  // Filter based on feature toggles
  const visibleItems = navItems.filter(item => {
    if (!item.featureId) return true;
    return isFeatureEnabled(item.featureId);
  });

  const isActive = (href: string) => {
    return location === href || (href !== "/" && location.startsWith(href));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40 md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {visibleItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full h-14 flex-col gap-1 relative ${
                isActive(item.href) 
                  ? "bg-electric-blue/10 text-electric-blue" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {/* Highlight indicators */}
              {item.highlight && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-2 h-2 bg-electric-green rounded-full animate-pulse"></div>
                </div>
              )}
              
              {item.special && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-purple text-white">
                  AI
                </Badge>
              )}

              <item.icon className={`h-5 w-5 ${isActive(item.href) ? "text-electric-blue" : ""}`} />
              <span className={`text-xs font-medium ${isActive(item.href) ? "text-electric-blue" : ""}`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive(item.href) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-electric-blue rounded-full"></div>
              )}
            </Button>
          </Link>
        ))}
      </div>
      
      {/* Safe area for devices with home indicators */}
      <div className="h-safe-area-inset-bottom"></div>
    </div>
  );
}