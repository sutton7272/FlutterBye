import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/wallet-connect";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Coins, Trophy, Users, MessageSquare, Settings, Sparkles } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/mint", label: "Mint", icon: Coins },
    { href: "/limited-edition", label: "Limited Edition", icon: Sparkles },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/rewards", label: "Rewards", icon: Trophy },
    { href: "/journey", label: "Journey", icon: Users },
    { href: "/sms", label: "SMS", icon: MessageSquare },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="border-b border-blue-500/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-electric-green rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-background">F</span>
            </div>
            <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
              Flutterbye
            </span>
          </Link>
          <nav className="flex items-center space-x-2 text-sm font-medium">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 cyber-glow ${
                    isActive(item.href) 
                      ? "bg-gradient-to-r from-blue-600 to-green-600 text-background hover:from-blue-500 hover:to-green-500" 
                      : "hover:bg-blue-600/10 hover:text-blue-400"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="ml-auto flex items-center space-x-2">
          <WalletConnect />
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 glassmorphism">
            <Link href="/" className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-electric-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-background">F</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
                Flutterbye
              </span>
            </Link>
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 cyber-glow ${
                      isActive(item.href) 
                        ? "bg-gradient-to-r from-blue-600 to-green-600 text-background" 
                        : "hover:bg-blue-600/10 hover:text-blue-400"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}