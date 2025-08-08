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
  Wallet,
  Target,
  Wrench
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
    },
    {
      id: "marketing",
      title: "Marketing and Social Media",
      description: "Social media management, campaign analytics, and viral growth tools",
      icon: Target,
      route: "/admin/marketing",
      color: "electric-blue",
      features: [
        "Campaign Management",
        "Social Media Analytics",
        "Viral Growth Tracking",
        "Engagement Metrics"
      ]
    },
    {
      id: "system",
      title: "System Tools",
      description: "System monitoring, maintenance tools, and technical administration",
      icon: Wrench,
      route: "/admin/system",
      color: "electric-green",
      features: [
        "System Monitoring",
        "Database Management",
        "Log Analysis",
        "Maintenance Tools"
      ]
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Circuit Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 border border-electric-blue/30 rounded-lg animate-pulse-slow" />
          <div className="absolute top-40 right-32 w-32 h-32 border border-electric-green/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-32 left-1/3 w-48 h-48 border border-electric-blue/20 rounded-lg rotate-45 animate-spin-slow" />
          <div className="absolute top-1/2 right-20 w-40 h-40 border border-electric-green/25 rounded-full animate-pulse-slow" />
          <div className="absolute bottom-20 right-1/3 w-28 h-28 border border-electric-blue/25 rounded-lg rotate-12 animate-pulse-slow" />
        </div>
        
        {/* Animated Electrical Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent animate-pulse" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-green/50 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-electric-blue/30 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-electric-green/30 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Background Glow Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-electric-blue/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-electric-green/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-electric-blue/15 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2.5s' }}></div>
          <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-electric-green/15 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-electric-blue/30 backdrop-blur-sm bg-slate-950/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-electric-blue/20 rounded-full border-2 border-electric-blue/50 relative">
              <div className="absolute inset-0 bg-electric-blue/10 rounded-full animate-ping" />
              <Shield className="w-8 h-8 text-electric-blue relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
                Global Admin Dashboard
              </h1>
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
            <Card className="relative bg-slate-800/40 backdrop-blur-sm border-2 border-electric-blue/30 shadow-2xl overflow-hidden">
              {/* Animated Card Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-electric-green/10 to-electric-blue/20 opacity-50 animate-pulse" />
              <div className="absolute inset-[2px] bg-slate-800/90 rounded-lg" />
              
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent mb-2">
                      Welcome to Admin Control Center
                    </h2>
                    <p className="text-text-secondary">
                      Manage all aspects of the Flutterbye platform from this central dashboard
                    </p>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-electric-blue/20 rounded-lg border border-electric-blue/50 relative">
                    <div className="absolute inset-0 bg-electric-blue/10 rounded-lg animate-ping" />
                    <Zap className="w-5 h-5 text-electric-blue relative z-10" />
                    <span className="text-sm text-electric-blue font-medium relative z-10">System Online</span>
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
                <Card key={card.id} className={`relative bg-slate-800/40 backdrop-blur-sm border-2 ${borderColor} shadow-2xl overflow-hidden hover:border-opacity-70 transition-all duration-500 group`}>
                  {/* Animated Card Border */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color === "electric-blue" ? "from-electric-blue/20 via-electric-green/10 to-electric-blue/20" : "from-electric-green/20 via-electric-blue/10 to-electric-green/20"} opacity-50 animate-pulse`} />
                  <div className="absolute inset-[2px] bg-slate-800/90 rounded-lg" />
                  
                  <CardHeader className="relative pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-${card.color}/20 rounded-xl flex items-center justify-center border-2 border-${card.color}/50 relative group-hover:scale-110 transition-transform duration-300`}>
                        <div className={`absolute inset-0 bg-${card.color}/10 rounded-xl animate-ping`} />
                        <IconComponent className={`w-6 h-6 ${iconColor} relative z-10`} />
                      </div>
                      <div>
                        <CardTitle className={`bg-gradient-to-r ${card.color === "electric-blue" ? "from-electric-blue to-blue-400" : "from-electric-green to-green-400"} bg-clip-text text-transparent text-lg font-bold`}>
                          {card.title}
                        </CardTitle>
                        <p className="text-text-secondary text-sm mt-1">{card.description}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative space-y-4">
                    {/* Features List */}
                    <div className="space-y-2">
                      {card.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${card.color === "electric-blue" ? "from-electric-blue to-blue-400" : "from-electric-green to-green-400"} animate-pulse`}></div>
                          <span className="text-sm text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => setLocation(card.route)}
                      className={`w-full ${buttonGradient} hover:opacity-90 transition-all duration-300 border-2 ${card.color === "electric-blue" ? "border-electric-blue/50 hover:border-electric-blue/70" : "border-electric-green/50 hover:border-electric-green/70"} relative overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
            <Card className="relative bg-slate-800/40 backdrop-blur-sm border-2 border-electric-blue/30 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/15 to-transparent opacity-50" />
              <div className="absolute inset-[2px] bg-slate-800/90 rounded-lg" />
              <CardContent className="relative p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-electric-blue/20 rounded-lg border border-electric-blue/50 relative">
                    <div className="absolute inset-0 bg-electric-blue/10 rounded-lg animate-ping" />
                    <Users className="w-8 h-8 text-electric-blue relative z-10" />
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">Platform Users</p>
                    <p className="text-2xl font-bold text-white">2,847</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-slate-800/40 backdrop-blur-sm border-2 border-electric-green/30 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-electric-green/15 to-transparent opacity-50" />
              <div className="absolute inset-[2px] bg-slate-800/90 rounded-lg" />
              <CardContent className="relative p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-electric-green/20 rounded-lg border border-electric-green/50 relative">
                    <div className="absolute inset-0 bg-electric-green/10 rounded-lg animate-ping" />
                    <BarChart3 className="w-8 h-8 text-electric-green relative z-10" />
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-white">$47.2K</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-slate-800/40 backdrop-blur-sm border-2 border-orange-400/30 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/15 to-transparent opacity-50" />
              <div className="absolute inset-[2px] bg-slate-800/90 rounded-lg" />
              <CardContent className="relative p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-400/20 rounded-lg border border-orange-400/50 relative">
                    <div className="absolute inset-0 bg-orange-400/10 rounded-lg animate-ping" />
                    <Shield className="w-8 h-8 text-orange-400 relative z-10" />
                  </div>
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