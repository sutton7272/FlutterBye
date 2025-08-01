import { Link, useLocation } from "wouter";
import ButterflyLogo from "./butterfly-logo";
import WalletConnect from "./wallet-connect";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/mint", label: "Mint" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/portfolio", label: "Portfolio" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glassmorphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <a className="flex items-center space-x-3">
              <ButterflyLogo size="md" animate />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                FLUTTERBYE
              </span>
            </a>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`transition-colors ${
                  location === item.href 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
