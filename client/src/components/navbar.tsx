import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/wallet-connect";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Menu, Home, Coins, Trophy, Users, MessageSquare, Settings, Sparkles, Zap, Heart, Building2, MapPin, Activity, Gift, Award, Star, Ticket, HelpCircle, LayoutDashboard, Brain, CreditCard, Stars, DollarSign, Code2, Rocket, ArrowRightLeft, Target, Shield, Palette, Waves, Send } from "lucide-react";

import { useFeatureToggles } from "@/hooks/useFeatureToggles";
import { MobileNavigation } from "@/components/mobile-navigation";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeProductTab, setActiveProductTab] = useState("flutterbye");
  const { isFeatureEnabled, isLoading: featuresLoading } = useFeatureToggles();

  // Primary navigation - core platform sections focused on launch products
  const allNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Portfolio & activity", featureId: "dashboard", priority: true },
    { href: "/create", label: "Create", icon: Coins, description: "Message tokens & campaigns", featureId: "mint", priority: true, 
      subItems: [
        { href: "/create", label: "Basic Messages", description: "27-character message tokens" },
        { href: "/mint/greeting", label: "Greeting Cards", description: "Personal greeting messages" },
        { href: "/enterprise-campaigns", label: "Marketing Campaigns", description: "Enterprise targeting campaigns" },
        { href: "/campaign-builder", label: "Campaign Builder", description: "Advanced campaign creation" }
      ]
    },
    { href: "/flutterai", label: "FlutterAI", icon: Brain, description: "Wallet intelligence & targeting", special: true, featureId: "flutterai", priority: true },
    { href: "/redeem", label: "Redeem", icon: Gift, description: "Discover & redeem message tokens", featureId: "marketplace", priority: true },
    { href: "/intelligence", label: "AI Hub", icon: Brain, description: "AI intelligence and analytics", featureId: "intelligence" },
    { href: "/admin-gateway", label: "Admin", icon: Settings, description: "Platform management", featureId: "admin_panel" },
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
        if (["home", "mint", "marketplace", "flutterai", "flutter_wave", "flutter_art", "chat", "dashboard"].includes(item.featureId)) {
          return true;
        }
        // If no featureId is specified, show the item by default
        if (!item.featureId) return true;
        // Otherwise, check if the feature is enabled
        return isFeatureEnabled(item.featureId);
      });

  // Secondary navigation - business and enterprise features
  const secondaryNavItems = [
    { href: "/info", label: "Info", icon: HelpCircle, description: "Platform information & help",
      subItems: [
        { href: "/info", label: "Platform Info", description: "About Flutterbye platform" },
        { href: "/explore", label: "Explore", description: "Discover trending content" }
      ]
    },
  ];

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

        {/* Product Development Tabs - Always Visible */}
        <div className="flex items-center justify-center flex-1 max-w-2xl mx-auto">
          <div className="flex items-center bg-slate-900/80 rounded-lg p-1 border border-electric-blue/30 backdrop-blur-sm">
            <Button
              onClick={() => setActiveProductTab("flutterbye")}
              size="sm"
              variant={activeProductTab === "flutterbye" ? "default" : "ghost"}
              className={`mr-1 ${
                activeProductTab === "flutterbye" 
                  ? "bg-electric-blue text-white shadow-lg" 
                  : "text-slate-300 hover:text-white hover:bg-electric-blue/20"
              }`}
            >
              <Send className="h-4 w-4 mr-1" />
              Flutterbye
            </Button>
            
            <Button
              onClick={() => setActiveProductTab("flutterart")}
              size="sm"
              variant={activeProductTab === "flutterart" ? "default" : "ghost"}
              className={`mr-1 ${
                activeProductTab === "flutterart" 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" 
                  : "text-slate-300 hover:text-white hover:bg-purple-500/20"
              }`}
            >
              <Palette className="h-4 w-4 mr-1" />
              FlutterArt
            </Button>
            
            <Button
              onClick={() => setActiveProductTab("flutterwave")}
              size="sm"
              variant={activeProductTab === "flutterwave" ? "default" : "ghost"}
              className={`${
                activeProductTab === "flutterwave" 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg" 
                  : "text-slate-300 hover:text-white hover:bg-cyan-500/20"
              }`}
            >
              <Waves className="h-4 w-4 mr-1" />
              FlutterWave
            </Button>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="hidden lg:flex items-center space-x-2 ml-4">
            {activeProductTab === "flutterbye" && (
              <>
                <Link href="/create">
                  <Button size="sm" variant="outline" className="border-electric-blue/50 hover:bg-electric-blue/20 text-xs">
                    <Coins className="h-3 w-3 mr-1" />
                    Create
                  </Button>
                </Link>
                <Link href="/enterprise-campaigns">
                  <Button size="sm" variant="outline" className="border-electric-blue/50 hover:bg-electric-blue/20 text-xs">
                    <Target className="h-3 w-3 mr-1" />
                    Campaign
                  </Button>
                </Link>
              </>
            )}
            
            {activeProductTab === "flutterart" && (
              <>
                <Link href="/flutter-art">
                  <Button size="sm" variant="outline" className="border-purple-500/50 hover:bg-purple-500/20 text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    Create
                  </Button>
                </Link>
                <Link href="/mint/multimedia">
                  <Button size="sm" variant="outline" className="border-purple-500/50 hover:bg-purple-500/20 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Gen
                  </Button>
                </Link>
              </>
            )}
            
            {activeProductTab === "flutterwave" && (
              <>
                <Link href="/flutter-wave">
                  <Button size="sm" variant="outline" className="border-cyan-500/50 hover:bg-cyan-500/20 text-xs">
                    <Waves className="h-3 w-3 mr-1" />
                    SMS
                  </Button>
                </Link>
                <Link href="/sms-integration">
                  <Button size="sm" variant="outline" className="border-cyan-500/50 hover:bg-cyan-500/20 text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Setup
                  </Button>
                </Link>
              </>
            )}
          </div>
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

        {/* Secondary Navigation - Core Features */}
        <nav className="hidden md:flex items-center ml-4 space-x-1 border-l border-border/30 pl-4">
          {secondaryNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                size="sm"
                className={`flex items-center gap-2 h-9 px-3 relative group ${
                  isActive(item.href) 
                    ? "bg-electric-blue text-white shadow-lg" 
                    : "text-text-secondary hover:text-text-primary hover:bg-muted/50 transition-all duration-200"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">{item.label}</span>
                
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
              {/* Product Creation Section */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-400 mb-3 px-2">Product Creation</h3>
                
                {/* Flutterbye Section */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-electric-blue mb-2 px-2 flex items-center">
                    <Send className="h-3 w-3 mr-1" />
                    Flutterbye - Message Tokens
                  </div>
                  <div className="space-y-1">
                    <Link href="/create">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-text-secondary hover:text-text-primary hover:bg-electric-blue/20"
                        onClick={() => setIsOpen(false)}
                      >
                        <Coins className="h-4 w-4 mr-3" />
                        Create Message Token
                      </Button>
                    </Link>
                    <Link href="/enterprise-campaigns">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-text-secondary hover:text-text-primary hover:bg-electric-blue/20"
                        onClick={() => setIsOpen(false)}
                      >
                        <Target className="h-4 w-4 mr-3" />
                        Marketing Campaign
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* FlutterArt Section */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-purple-400 mb-2 px-2 flex items-center">
                    <Palette className="h-3 w-3 mr-1" />
                    FlutterArt - Digital Art
                  </div>
                  <div className="space-y-1">
                    <Link href="/flutter-art">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-text-secondary hover:text-text-primary hover:bg-purple-500/20"
                        onClick={() => setIsOpen(false)}
                      >
                        <Palette className="h-4 w-4 mr-3" />
                        Create Digital Art
                      </Button>
                    </Link>
                    <Link href="/mint/multimedia">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-text-secondary hover:text-text-primary hover:bg-purple-500/20"
                        onClick={() => setIsOpen(false)}
                      >
                        <Sparkles className="h-4 w-4 mr-3" />
                        AI Art Generator
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* FlutterWave Section */}
                <div className="mb-4">
                  <div className="text-xs font-medium text-cyan-400 mb-2 px-2 flex items-center">
                    <Waves className="h-3 w-3 mr-1" />
                    FlutterWave - SMS Integration
                  </div>
                  <div className="space-y-1">
                    <Link href="/flutter-wave">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-text-secondary hover:text-text-primary hover:bg-cyan-500/20"
                        onClick={() => setIsOpen(false)}
                      >
                        <Waves className="h-4 w-4 mr-3" />
                        Send SMS Token
                      </Button>
                    </Link>
                    <Link href="/sms-integration">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-text-secondary hover:text-text-primary hover:bg-cyan-500/20"
                        onClick={() => setIsOpen(false)}
                      >
                        <MessageSquare className="h-4 w-4 mr-3" />
                        SMS Integration
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border/30 my-3" />
              
              {/* Standard Navigation */}
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
              
              {/* Divider */}
              <div className="border-t border-border/30 my-2" />
              
              {/* Secondary Navigation in Mobile */}
              {secondaryNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start h-12 ${
                      isActive(item.href) 
                        ? "bg-electric-blue text-white" 
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