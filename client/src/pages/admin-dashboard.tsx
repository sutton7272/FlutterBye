import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Settings, 
  Users, 
  BarChart3, 
  Zap, 
  Shield,
  LogOut,
  Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ADMIN_WALLETS_KEY = "flutter_admin_wallets";

// Mock wallet for admin authentication - replace with real wallet integration
const MOCK_WALLET = "4xY2D8F3nQ9sM1pR6tZ5bV7wX0aH8cJ2kL4mN7oP9qS3uT";
const mockWalletConnected = true; // Simulated wallet connection

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    if (mockWalletConnected && MOCK_WALLET) {
      // Remove wallet from authenticated list
      const authenticatedWallets = JSON.parse(localStorage.getItem(ADMIN_WALLETS_KEY) || "[]");
      const updatedWallets = authenticatedWallets.filter((addr: string) => addr !== MOCK_WALLET);
      localStorage.setItem(ADMIN_WALLETS_KEY, JSON.stringify(updatedWallets));
    }
    
    // Clear session access
    sessionStorage.removeItem("admin_gateway_access");
    
    toast({
      title: "Logged Out",
      description: "Admin session ended",
    });
    
    setLocation("/admin");
  };

  const adminCards = [
    {
      id: "flutterai",
      title: "FlutterAI Intelligence",
      description: "AI-powered wallet analytics, scoring, and marketing intelligence platform",
      icon: Brain,
      route: "/admin/flutterai",
      color: "electric-blue",
      features: [
        "Wallet Intelligence Gathering",
        "AI Behavioral Analysis", 
        "Marketing Segmentation",
        "Predictive Analytics"
      ]
    },
    {
      id: "unified",
      title: "Unified Admin Dashboard", 
      description: "Complete platform administration, analytics, and system management",
      icon: Settings,
      route: "/admin/unified",
      color: "electric-green",
      features: [
        "User Management",
        "Revenue Analytics",
        "Performance Monitoring",
        "Security Controls"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-electric-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-electric-green/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 modern-gradient rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Global Admin Dashboard</h1>
              <p className="text-text-secondary">Flutterbye Administration Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Wallet Status */}
            {mockWalletConnected && (
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <Wallet className="w-4 h-4 text-electric-blue" />
                <span className="text-sm text-white font-mono">
                  {MOCK_WALLET.slice(0, 4)}...{MOCK_WALLET.slice(-4)}
                </span>
                <Badge variant="outline" className="border-electric-green/50 text-electric-green">
                  Persistent
                </Badge>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-500/50 text-red-400 hover:bg-red-950/50 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <Card className="glassmorphism border-electric-blue/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Welcome to Admin Control Center
                    </h2>
                    <p className="text-text-secondary">
                      Manage all aspects of the Flutterbye platform from this central dashboard
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-electric-blue" />
                    <span className="text-sm text-electric-blue font-medium">System Online</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {adminCards.map((card) => {
              const IconComponent = card.icon;
              const borderColor = card.color === "electric-blue" ? "border-electric-blue/30" : "border-electric-green/30";
              const iconColor = card.color === "electric-blue" ? "text-electric-blue" : "text-electric-green";
              const buttonGradient = card.color === "electric-blue" ? "bg-gradient-to-r from-electric-blue to-blue-500" : "bg-gradient-to-r from-electric-green to-green-500";
              
              return (
                <Card key={card.id} className={`glassmorphism ${borderColor} hover:border-opacity-50 transition-all duration-300 group`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${buttonGradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{card.title}</CardTitle>
                        <p className="text-text-secondary text-sm mt-1">{card.description}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Features List */}
                    <div className="space-y-2">
                      {card.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${card.color === "electric-blue" ? "from-electric-blue to-blue-400" : "from-electric-green to-green-400"}`}></div>
                          <span className="text-sm text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => setLocation(card.route)}
                      className={`w-full ${buttonGradient} hover:opacity-90 transition-opacity duration-300`}
                    >
                      Access {card.title}
                      <IconComponent className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glassmorphism border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-electric-blue" />
                  <div>
                    <p className="text-text-secondary text-sm">Platform Users</p>
                    <p className="text-2xl font-bold text-white">2,847</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-electric-green" />
                  <div>
                    <p className="text-text-secondary text-sm">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-white">$47.2K</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-orange-400" />
                  <div>
                    <p className="text-text-secondary text-sm">Security Status</p>
                    <p className="text-2xl font-bold text-white">Secure</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}