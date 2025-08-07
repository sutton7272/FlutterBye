import { useState, useEffect } from "react";
import { useWallet } from "@/lib/wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, Key, Users, Settings, BarChart3, Brain, Target, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function AdminGateway() {
  const { publicKey, connected } = useWallet();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingWallet, setIsCheckingWallet] = useState(true);
  const { toast } = useToast();

  // Check for valid admin session token
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin-authenticated');
    if (adminAuth && adminAuth !== 'true' && adminAuth.startsWith('admin-')) {
      setIsAuthenticated(true);
    }
    setIsCheckingWallet(false);
  }, []);

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/admin/authenticate", {
        password,
        walletAddress: publicKey || null // Send null if no wallet connected
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin-authenticated', data.sessionToken);
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin portal.",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: data.error || "Invalid password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletAuth = async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/check-wallet", {
        walletAddress: publicKey
      });
      
      const data = await response.json();
      
      if (data.success && data.isAdmin) {
        // For wallet authentication, create a session token
        const walletResponse = await apiRequest("POST", "/api/admin/authenticate", {
          password: "admin123", // Use default password for wallet-based auth
          walletAddress: publicKey
        });
        const walletData = await walletResponse.json();
        
        if (walletData.success) {
          setIsAuthenticated(true);
          sessionStorage.setItem('admin-authenticated', walletData.sessionToken);
          toast({
            title: "Wallet Recognized",
            description: "Admin access granted through wallet authentication.",
          });
        }
      } else {
        toast({
          title: "Wallet Not Recognized",
          description: "This wallet is not registered as an admin wallet. Please use password authentication.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Wallet Authentication Error",
        description: "Failed to check wallet. Please try password authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingWallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-blue-500/20">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <CardTitle className="text-white">Admin Access</CardTitle>
            <CardDescription className="text-slate-300">
              Access the admin portal using wallet connection or password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wallet Connection Option */}
            {connected && publicKey && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Wallet Authentication</span>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-300 mb-2">Connected Wallet:</p>
                  <p className="text-xs font-mono text-blue-400 break-all">{publicKey}</p>
                </div>
                <Button 
                  onClick={handleWalletAuth}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Checking..." : "Authenticate with Wallet"}
                </Button>
              </div>
            )}
            
            {/* Divider */}
            {connected && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-2 text-slate-400">Or</span>
                </div>
              </div>
            )}

            {/* Password Authentication Option */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Password Authentication</span>
              </div>
              <form onSubmit={handlePasswordAuth} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Admin Password</label>
                  <Input
                    type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  {connected && publicKey 
                    ? "Your wallet will be registered for future admin access"
                    : "Access admin portal without wallet connection required"
                  }
                </AlertDescription>
              </Alert>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Access Admin Portal"}
              </Button>
            </form>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Portal - Main navigation hub
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-300">Central hub for all administrative functions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {/* Unified Admin Dashboard */}
          <Link href="/admin/dashboard">
            <Card className="bg-slate-800/50 border-blue-500/20 hover:border-blue-400/40 transition-all cursor-pointer group">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
                <CardTitle className="text-white">Unified Dashboard</CardTitle>
                <CardDescription className="text-slate-300">
                  Comprehensive platform analytics and management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Revenue & Performance Analytics</li>
                  <li>• User Management & Insights</li>
                  <li>• System Monitoring</li>
                  <li>• Security & Compliance</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* FlutterAI Backend Dashboard */}
          <Link href="/flutterai-dashboard">
            <Card className="bg-slate-800/50 border-green-500/20 hover:border-green-400/40 transition-all cursor-pointer group">
              <CardHeader>
                <Brain className="w-8 h-8 text-green-400 group-hover:text-green-300" />
                <CardTitle className="text-white">FlutterAI Backend</CardTitle>
                <CardDescription className="text-slate-300">
                  AI intelligence and campaign management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Wallet Intelligence Processing</li>
                  <li>• Campaign Analytics</li>
                  <li>• AI Model Management</li>
                  <li>• Queue & Performance</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Access Control */}
          <Link href="/admin/access-control">
            <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-400/40 transition-all cursor-pointer group">
              <CardHeader>
                <Users className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                <CardTitle className="text-white">Access Control</CardTitle>
                <CardDescription className="text-slate-300">
                  Manage admin access and site controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Admin Wallet Management</li>
                  <li>• Site Access Controls</li>
                  <li>• Security Settings</li>
                  <li>• Activity Logs</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Marketing & Growth Hub */}
          <Link href="/admin-marketing-growth">
            <Card className="bg-slate-800/50 border-pink-500/20 hover:border-pink-400/40 transition-all cursor-pointer group">
              <CardHeader>
                <Target className="w-8 h-8 text-pink-400 group-hover:text-pink-300" />
                <CardTitle className="text-white">Marketing & Growth</CardTitle>
                <CardDescription className="text-slate-300">
                  AI-powered marketing campaigns and growth analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• AI Marketing Bot</li>
                  <li>• Viral Analytics & Growth</li>
                  <li>• Campaign Management</li>
                  <li>• Pricing Optimization</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* System Settings */}
          <Link href="/admin/features">
            <Card className="bg-slate-800/50 border-orange-500/20 hover:border-orange-400/40 transition-all cursor-pointer group">
              <CardHeader>
                <Settings className="w-8 h-8 text-orange-400 group-hover:text-orange-300" />
                <CardTitle className="text-white">System Settings</CardTitle>
                <CardDescription className="text-slate-300">
                  Platform configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Feature Toggles</li>
                  <li>• Environment Settings</li>
                  <li>• API Configuration</li>
                  <li>• Default Values</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Multi-Chain Intelligence - FORCED VISIBLE VERSION */}
          <div className="col-span-full">
            <Link href="/admin">
              <Card className="bg-red-500/20 border-red-500 hover:border-red-400 transition-all cursor-pointer group">
                <CardHeader>
                  <Globe className="w-8 h-8 text-red-400 group-hover:text-red-300" />
                  <CardTitle className="text-white text-2xl">🚨 MULTI-CHAIN INTELLIGENCE 🚨</CardTitle>
                  <CardDescription className="text-red-300">
                    Revolutionary blockchain intelligence across 7 networks - TESTING VISIBILITY
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-red-200 space-y-1">
                    <li>• 7 Blockchain Networks</li>
                    <li>• Real-time Market Data</li>
                    <li>• Enterprise Intelligence</li>
                    <li>• Cross-Chain Analytics</li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Authenticated as: {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
          </p>
        </div>
      </div>
    </div>
  );
}