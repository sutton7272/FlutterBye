import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  Home, 
  BarChart3, 
  Coins, 
  Bot, 
  Settings, 
  Info, 
  Wallet,
  Zap,
  ArrowRight
} from "lucide-react";

export function DevNetNavigation() {
  const [, setLocation] = useLocation();

  const pages = [
    { path: "/home", label: "Home", icon: Home, description: "Main dashboard" },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3, description: "Analytics & stats" },
    { path: "/create", label: "Create Token", icon: Coins, description: "Mint new tokens" },
    { path: "/mint", label: "Mint", icon: Zap, description: "Token minting" },
    { path: "/portfolio", label: "Portfolio", icon: Wallet, description: "Your wallet" },
    { path: "/info", label: "Info", icon: Info, description: "Platform info" },
    { path: "/admin", label: "Admin", icon: Settings, description: "Admin panel" },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto electric-border">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-cyan-400">
          🌟 DevNet Navigation - FlutterBye Platform 🌟
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Choose a page to explore the platform features
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Button
              key={page.path}
              onClick={() => setLocation(page.path)}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 electric-border hover:bg-cyan-500/10 transition-all duration-200"
            >
              <page.icon className="h-6 w-6 text-cyan-400" />
              <div className="text-center">
                <div className="font-semibold">{page.label}</div>
                <div className="text-xs text-muted-foreground">{page.description}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center space-x-2 text-green-400">
            <Bot className="h-5 w-5" />
            <span className="font-semibold">DevNet Status: Online</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            All features are available for testing on Solana DevNet
          </p>
        </div>
      </CardContent>
    </Card>
  );
}