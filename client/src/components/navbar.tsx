import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/wallet-connect";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Coins, Trophy, Users, MessageSquare, Settings, Sparkles, Zap, Heart, Building2, MapPin, Activity, Gift, Award, Star, Ticket, HelpCircle, LayoutDashboard, Brain, CreditCard } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Simplified navigation - Primary items only
  const primaryNavItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/mint", label: "Mint", icon: Coins },
    { href: "/payments", label: "Payments", icon: CreditCard, featured: true },
    { href: "/ai-payments", label: "AI Credits", icon: Brain, special: true },
    { href: "/redeem", label: "Dashboard", icon: LayoutDashboard },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/sms-nexus", label: "FlutterWave", icon: Zap, special: true },
    { href: "/message-nfts", label: "FlutterArt", icon: Sparkles, featured: true },
    { href: "/marketplace", label: "Marketplace", icon: Users },
    { href: "/ai-overview", label: "AI Hub", icon: Brain, featured: true },
    { href: "/greeting-cards", label: "Cards", icon: Heart },
    { href: "/enterprise", label: "Marketing", icon: Building2 },
    { href: "/info", label: "Info", icon: HelpCircle },
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
                    : item.special
                    ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-200 border border-purple-500/30 hover:from-purple-600/30 hover:to-blue-600/30 hover:text-white transition-all duration-300"
                    : item.featured
                    ? "bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-200 border border-yellow-500/30 hover:from-yellow-600/30 hover:to-orange-600/30 hover:text-white transition-all duration-300"
                    : "text-text-secondary hover:text-text-primary hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.special && <span className="text-xs bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-bold">NEW</span>}
                {item.featured && <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-bold">💎</span>}
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
                        : "text-text-secondary hover:text-text-primary hover:bg-muted"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              
              {/* All features now consolidated into main pages */}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}