import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/wallet-connect";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Coins, Trophy, Users, MessageSquare, Settings, Sparkles, Zap, Heart, Building2, MapPin, Gift, Award, Star, Ticket, HelpCircle, LayoutDashboard, Brain, CreditCard, Stars, DollarSign, Code2, Rocket, Target, Shield } from "lucide-react";

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
            <div className="w-9 h-9 modern-gradient rounded-xl flex items-center justify-center">
              <span className="text-sm font-bold text-white">F</span>
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
                    : item.special
                    ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-200 border border-purple-500/30 hover:from-purple-600/30 hover:to-blue-600/30 hover:text-white transition-all duration-300"
                    : "text-text-secondary hover:text-text-primary hover:bg-muted/50 transition-all duration-200"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
                {item.special && <span className="text-xs bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-bold">AI</span>}
                
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