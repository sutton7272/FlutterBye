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
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-electric-blue/20 z-40 md:hidden electric-frame">
      <div className="grid grid-cols-4 gap-1 p-3">
        {visibleItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full h-16 flex-col gap-1 relative transition-all duration-300 ${
                isActive(item.href) 
                  ? "bg-electric-blue/20 text-electric-blue border border-electric-blue/30 shadow-lg" 
                  : item.special
                  ? "text-purple-400 hover:text-purple-300 hover:bg-purple-400/10"
                  : item.highlight
                  ? "text-electric-green hover:text-electric-green hover:bg-electric-green/10"
                  : "text-gray-400 hover:text-white hover:bg-slate-800/50"
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