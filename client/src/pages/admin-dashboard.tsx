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
  Wrench,
  Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import cosmicBackgroundPath from "@assets/image_1754257352191.png";

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
      id: "analytics",
      title: "Analytics & Monitoring", 
      description: "Real-time platform analytics, performance metrics, and system monitoring",
      icon: BarChart3,
      route: "/monitoring-dashboard",
      color: "electric-green",
      features: [
        "Real-time Metrics",
        "Performance Analytics",
        "System Health Monitoring",
        "Usage Statistics"
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
      id: "flutterblog",
      title: "FlutterBlog Bot",
      description: "AI-powered SEO content creation system with automated blog generation",
      icon: Brain,
      route: "/admin/flutterblog-bot",
      color: "electric-blue",
      features: [
        "AI Content Generation",
        "SEO Optimization",
        "Automated Scheduling", 
        "Performance Analytics"
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
    },
    {
      id: "escrow",
      title: "Escrow Management",
      description: "Enterprise-grade smart contract escrow system for high-value transactions",
      icon: Shield,
      route: "/admin/escrow",
      color: "electric-blue",
      features: [
        "Multi-signature wallets",
        "Timeout protection",
        "Enterprise contracts ($200K-$2M)",
        "Compliance reporting"
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `url(${cosmicBackgroundPath})`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        
        {/* Cosmic Butterfly Animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Flying Butterflies */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${20 + (i * 8)}%`,
                animation: `butterfly-flight-${(i % 4) + 1} ${20 + (i * 3)}s infinite linear`,
                animationDelay: `${i * 2}s`
              }}
            >
              <div className="w-6 h-6 relative">
                {/* Butterfly Wings */}
                <div className="absolute inset-0">
                  <div 
                    className="absolute w-3 h-4 bg-gradient-to-br from-electric-blue/70 to-electric-green/70 rounded-full transform -rotate-12 animate-wing-flutter"
                    style={{ 
                      top: '0px', 
                      left: '0px',
                      animationDelay: `${i * 0.2}s`,
                      filter: 'drop-shadow(0 0 6px rgba(0, 212, 255, 0.6))'
                    }}
                  />
                  <div 
                    className="absolute w-3 h-4 bg-gradient-to-bl from-electric-green/70 to-electric-blue/70 rounded-full transform rotate-12 animate-wing-flutter" 
                    style={{ 
                      top: '0px', 
                      right: '0px',
                      animationDelay: `${i * 0.2 + 0.1}s`,
                      filter: 'drop-shadow(0 0 6px rgba(0, 255, 136, 0.6))'
                    }}
                  />
                  <div 
                    className="absolute w-2 h-3 bg-gradient-to-br from-electric-blue/60 to-electric-green/60 rounded-full transform -rotate-6 animate-wing-flutter" 
                    style={{ 
                      bottom: '2px', 
                      left: '2px',
                      animationDelay: `${i * 0.2}s`,
                      filter: 'drop-shadow(0 0 4px rgba(0, 212, 255, 0.4))'
                    }}
                  />
                  <div 
                    className="absolute w-2 h-3 bg-gradient-to-bl from-electric-green/60 to-electric-blue/60 rounded-full transform rotate-6 animate-wing-flutter" 
                    style={{ 
                      bottom: '2px', 
                      right: '2px',
                      animationDelay: `${i * 0.2 + 0.1}s`,
                      filter: 'drop-shadow(0 0 4px rgba(0, 255, 136, 0.4))'
                    }}
                  />
                  {/* Butterfly Body */}
                  <div 
                    className="absolute w-0.5 h-5 bg-gradient-to-b from-electric-blue to-electric-green rounded-full"
                    style={{ 
                      top: '0px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      filter: 'drop-shadow(0 0 3px rgba(136, 255, 136, 0.8))'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {/* Additional Electric Circuit Overlays for Admin Theme */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-64 h-64 border border-electric-blue/20 rounded-lg animate-pulse-slow" />
            <div className="absolute bottom-32 right-32 w-48 h-48 border border-electric-green/20 rounded-lg rotate-45 animate-pulse-slow" />
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
    </>
  );
}