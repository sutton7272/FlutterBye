import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/wallet-connect";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Coins, Trophy, Users, MessageSquare, Settings, Sparkles, Zap, Heart, Building2, MapPin, Activity, Gift, Award, Star, Ticket, HelpCircle, LayoutDashboard, Share2, Crown, TrendingUp } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Streamlined navigation - all viral features consolidated into existing pages
  const primaryNavItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/mint", label: "Mint", icon: Coins },
    { href: "/marketplace", label: "Marketplace", icon: TrendingUp, isViral: true },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/greeting-cards", label: "Cards", icon: Heart },
    { href: "/enterprise", label: "Marketing", icon: Building2, isViral: true },
    { href: "/redeem", label: "Dashboard", icon: LayoutDashboard },
  ];

  // No secondary navigation - everything consolidated into main pages

  const isActive = (href: string) => location === href;

  return (
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
        <nav className="hidden md:flex items-center space-x-1">
          {primaryNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                size="sm"
                className={`flex items-center gap-2 h-9 px-4 ${
                  isActive(item.href) 
                    ? "modern-gradient text-white shadow-lg" 
                    : item.isViral
                    ? "text-electric-blue hover:text-electric-green hover:bg-electric-blue/10 border border-electric-blue/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.isViral && (
                  <div className="w-2 h-2 bg-electric-green rounded-full animate-pulse" />
                )}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Trust Indicator */}
        <div className="hidden lg:flex ml-4">
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
            <nav className="flex flex-col space-y-1">
              {/* Primary Items */}
              {primaryNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start h-11 ${
                      isActive(item.href) 
                        ? "modern-gradient text-white" 
                        : item.isViral
                        ? "text-electric-blue hover:text-electric-green hover:bg-electric-blue/10 border border-electric-blue/20"
                        : "text-text-secondary hover:text-text-primary hover:bg-muted"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                    {item.isViral && (
                      <div className="w-2 h-2 bg-electric-green rounded-full animate-pulse ml-auto" />
                    )}
                  </Button>
                </Link>
              ))}
              
              {/* Viral Features Info */}
              <div className="pt-4 pb-2">
                <div className="bg-gradient-to-r from-electric-blue/20 to-electric-green/20 p-3 rounded-lg mx-3">
                  <p className="text-xs font-semibold text-electric-blue uppercase tracking-wider mb-1">
                    🚀 Viral Features
                  </p>
                  <p className="text-xs text-gray-300">
                    Find viral sharing in Marketplace • Enterprise Quick Setup in Marketing
                  </p>
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}