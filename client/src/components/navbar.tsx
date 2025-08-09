import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/wallet-connect";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Coins, Trophy, Users, MessageSquare, Settings, Sparkles, Zap, Heart, Building2, MapPin, Gift, Award, Star, Ticket, HelpCircle, LayoutDashboard, Brain, CreditCard, Stars, DollarSign, Code2, Rocket, Target, Shield, Activity } from "lucide-react";

import { useFeatureToggles } from "@/hooks/useFeatureToggles";
import { MobileNavigation } from "@/components/mobile-navigation";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isFeatureEnabled, isLoading: featuresLoading } = useFeatureToggles();

  // Primary navigation - core platform sections focused on launch products
  const allNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Portfolio & activity", featureId: "dashboard", priority: true },
    { href: "/create", label: "FlutterbyeMSG", icon: MessageSquare, description: "27-character message tokens with value", featureId: "mint", priority: true },
    { href: "/flutter-art", label: "FlutterArt", icon: Sparkles, description: "NFT message tokens & visual messages", featureId: "flutter_art", priority: true },
    { href: "/flutter-wave", label: "FlutterWave", icon: Zap, description: "SMS-to-blockchain emotional tokens", featureId: "flutter_wave", priority: true },
    { href: "/redeem", label: "Redeem", icon: Gift, description: "Discover & redeem message tokens", featureId: "marketplace", priority: true },
    { href: "/info", label: "Info", icon: HelpCircle, description: "Platform info, tutorials & analytics", featureId: "info", priority: true },
    { href: "/enterprise-campaigns", label: "Marketing", icon: Target, description: "Enterprise marketing campaigns", featureId: "enterprise" },
    { href: "/intelligence", label: "AI Hub", icon: Brain, description: "AI intelligence and analytics", featureId: "intelligence" },
    { href: "/admin/performance", label: "Performance", icon: Activity, description: "Performance optimization dashboard", featureId: "performance" },
    { href: "/admin", label: "Admin", icon: Settings, description: "Platform management", featureId: "admin_panel" },
  ];

  // Filter navigation items based on feature toggles
  const primaryNavItems = featuresLoading 
    ? allNavItems // Show all items while loading including admin
    : allNavItems.filter(item => {
        // Admin panel is always visible (critical for platform management)
        if (item.featureId === "admin_panel") {
          return true;
        }
        // Show core features by default
        if (["home", "mint", "marketplace", "flutter_wave", "flutter_art", "chat", "dashboard", "info"].includes(item.featureId)) {
          return true;
        }
        // If no featureId is specified, show the item by default
        if (!item.featureId) return true;
        // Otherwise, check if the feature is enabled
        return isFeatureEnabled(item.featureId);
      });

  const isActive = (href: string) => location === href;

  return (
    <>
    <nav className="glassmorphism border-b border-border sticky top-0 z-50 electric-frame">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-8 flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center">
              <svg 
                width="32" 
                height="26" 
                viewBox="0 0 100 80" 
                className="butterfly-logo"
                style={{
                  filter: 'drop-shadow(0 0 6px #00bfff) drop-shadow(0 0 12px #00ffcc)',
                }}
              >
                {/* Central body line */}
                <line x1="50" y1="15" x2="50" y2="65" stroke="#00bfff" strokeWidth="2" opacity="1" />
                <circle cx="50" cy="40" r="2" fill="#00bfff" opacity="1" />
                
                {/* Upper wings - symmetric triangular shapes */}
                <path 
                  d="M50 40 L20 15 L10 25 L25 35 L50 40" 
                  fill="none" 
                  stroke="#00bfff" 
                  strokeWidth="1.5" 
                  opacity="0.9"
                />
                <path 
                  d="M50 40 L80 15 L90 25 L75 35 L50 40" 
                  fill="none" 
                  stroke="#00bfff" 
                  strokeWidth="1.5" 
                  opacity="0.9"
                />
                
                {/* Lower wings - rounded triangular shapes */}
                <path 
                  d="M50 40 L25 55 L15 70 L30 75 L50 40" 
                  fill="none" 
                  stroke="#00ffcc" 
                  strokeWidth="1.5" 
                  opacity="0.9"
                />
                <path 
                  d="M50 40 L75 55 L85 70 L70 75 L50 40" 
                  fill="none" 
                  stroke="#00ffcc" 
                  strokeWidth="1.5" 
                  opacity="0.9"
                />
                
                {/* Internal wing network - triangular mesh */}
                <line x1="50" y1="40" x2="20" y2="15" stroke="#00bfff" strokeWidth="0.8" opacity="0.7" />
                <line x1="50" y1="40" x2="80" y2="15" stroke="#00bfff" strokeWidth="0.8" opacity="0.7" />
                <line x1="50" y1="40" x2="25" y2="55" stroke="#00ffcc" strokeWidth="0.8" opacity="0.7" />
                <line x1="50" y1="40" x2="75" y2="55" stroke="#00ffcc" strokeWidth="0.8" opacity="0.7" />
                
                {/* Cross connections */}
                <line x1="25" y1="35" x2="35" y2="30" stroke="#00bfff" strokeWidth="0.5" opacity="0.6" />
                <line x1="75" y1="35" x2="65" y2="30" stroke="#00bfff" strokeWidth="0.5" opacity="0.6" />
                <line x1="30" y1="75" x2="40" y2="60" stroke="#00ffcc" strokeWidth="0.5" opacity="0.6" />
                <line x1="70" y1="75" x2="60" y2="60" stroke="#00ffcc" strokeWidth="0.5" opacity="0.6" />
                
                {/* Node points at key intersections */}
                <circle cx="20" cy="15" r="1.5" fill="#00bfff" opacity="0.9" />
                <circle cx="80" cy="15" r="1.5" fill="#00bfff" opacity="0.9" />
                <circle cx="25" cy="55" r="1.5" fill="#00ffcc" opacity="0.9" />
                <circle cx="75" cy="55" r="1.5" fill="#00ffcc" opacity="0.9" />
                
                {/* Wing tip nodes */}
                <circle cx="10" cy="25" r="1" fill="#00bfff" opacity="0.8" />
                <circle cx="90" cy="25" r="1" fill="#00bfff" opacity="0.8" />
                <circle cx="15" cy="70" r="1" fill="#00ffcc" opacity="0.8" />
                <circle cx="85" cy="70" r="1" fill="#00ffcc" opacity="0.8" />
              </svg>
            </div>
            <span className="hidden font-bold text-xl sm:inline-block text-white">
              Flutterbye
            </span>
          </Link>
        </div>

        {/* Primary Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-2">
          {primaryNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                size="sm"
                className={`flex items-center gap-2 h-10 px-4 relative group ${
                  isActive(item.href) 
                    ? "modern-gradient text-white shadow-lg" 
                    : "text-text-secondary hover:text-text-primary hover:bg-muted/50 transition-all duration-200"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black/90 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {item.description}
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </nav>



        {/* Trust Indicator */}
        <div className="hidden xl:flex ml-4 items-center gap-3">
          <div className="trust-indicator">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            Testnet
          </div>
        </div>
        
        {/* Right Side Actions */}
        <div className="ml-auto flex items-center space-x-3">
          <WalletConnect />
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 premium-card border-l">
            <Link href="/" className="flex items-center space-x-3 mb-8">
              <div className="w-9 h-9 modern-gradient rounded-xl flex items-center justify-center">
                <span className="text-sm font-bold text-white">F</span>
              </div>
              <span className="font-bold text-xl text-white">
                Flutterbye
              </span>
            </Link>
            <nav className="flex flex-col space-y-2">
              {primaryNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start h-12 ${
                      isActive(item.href) 
                        ? "modern-gradient text-white" 
                        : "text-text-secondary hover:text-text-primary hover:bg-muted"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs opacity-70">{item.description}</span>
                    </div>
                  </Button>
                </Link>
              ))}
              

            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
    
    {/* Mobile Bottom Navigation */}
    <MobileNavigation />
  </>
  );
}