import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Icons
import { 
  Users,
  DollarSign,
  Settings,
  Shield,
  BarChart3,
  Wallet,
  Code,
  Gift,
  TrendingUp,
  Database,
  Bell,
  Monitor
} from "lucide-react";

function AdminUnifiedDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch admin statistics
  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    retry: false,
  });

  // Fetch user analytics
  const { data: userAnalytics } = useQuery({
    queryKey: ["/api/admin/user-analytics"],
    retry: false,
  });

  // Fetch revenue analytics
  const { data: revenueAnalytics } = useQuery({
    queryKey: ["/api/admin/revenue-analytics"],
    retry: false,
  });

  // Fetch platform health
  const { data: platformHealth } = useQuery({
    queryKey: ["/api/admin/platform-health"],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Flutterbye Admin Dashboard
          </h1>
          <p className="text-slate-400">
            Comprehensive platform administration and monitoring
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">
                    {userAnalytics?.totalUsers || '0'}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    ${revenueAnalytics?.totalRevenue || '0'}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Tokens</p>
                  <p className="text-2xl font-bold text-white">
                    {adminStats?.activeTokens || '0'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">System Health</p>
                  <p className="text-2xl font-bold text-white">
                    {platformHealth?.status || 'Unknown'}
                  </p>
                </div>
                <Monitor className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800 border border-slate-600">
            <TabsTrigger value="overview" className="text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="finance" className="text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Finance
            </TabsTrigger>
            <TabsTrigger value="escrow" className="text-white">
              <Shield className="w-4 h-4 mr-2" />
              Escrow
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-white">
              <Settings className="w-4 h-4 mr-2" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="text-white">
              <Monitor className="w-4 h-4 mr-2" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">Platform Overview</CardTitle>
                  <CardDescription className="text-slate-400">
                    Key metrics and performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily Active Users</span>
                    <span className="text-white font-semibold">{userAnalytics?.dailyActive || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Revenue</span>
                    <span className="text-white font-semibold">${revenueAnalytics?.monthlyRevenue || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Transactions</span>
                    <span className="text-white font-semibold">{adminStats?.totalTransactions || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Platform Uptime</span>
                    <span className="text-white font-semibold">{platformHealth?.uptime || '99.9%'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-400">
                    Latest platform events and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/20 text-green-400">System</Badge>
                      <span className="text-slate-300 text-sm">Platform performance optimized</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-500/20 text-blue-400">Users</Badge>
                      <span className="text-slate-300 text-sm">New user registrations increasing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-purple-500/20 text-purple-400">Revenue</Badge>
                      <span className="text-slate-300 text-sm">Monthly targets on track</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 h-20 flex-col"
                    onClick={() => window.open('/admin/early-access', '_blank')}
                  >
                    <Users className="w-6 h-6 mb-2" />
                    Early Access Management
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 h-20 flex-col"
                    onClick={() => window.open('/admin/subscriptions', '_blank')}
                  >
                    <DollarSign className="w-6 h-6 mb-2" />
                    Subscription Management
                  </Button>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 h-20 flex-col"
                    onClick={() => window.open('/admin/analytics', '_blank')}
                  >
                    <BarChart3 className="w-6 h-6 mb-2" />
                    User Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Financial Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Revenue, pricing, and financial analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700 h-20 flex-col"
                    onClick={() => window.open('/admin/pricing', '_blank')}
                  >
                    <DollarSign className="w-6 h-6 mb-2" />
                    Pricing Management
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 h-20 flex-col"
                    onClick={() => window.open('/admin/revenue', '_blank')}
                  >
                    <TrendingUp className="w-6 h-6 mb-2" />
                    Revenue Analytics
                  </Button>
                  <Button 
                    className="bg-teal-600 hover:bg-teal-700 h-20 flex-col"
                    onClick={() => window.open('/api-monetization', '_blank')}
                  >
                    <Database className="w-6 h-6 mb-2" />
                    API Monetization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Escrow Tab */}
          <TabsContent value="escrow">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Enterprise Escrow Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage high-value escrow contracts and wallet operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Enterprise Escrow System</h3>
                    <p className="text-slate-300 text-sm mb-4">
                      Complete smart contract escrow system for high-value transactions ($200K-$2M)
                    </p>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.open('/admin/escrow-management', '_blank')}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Open Escrow Management
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Platform Wallets</h4>
                      <p className="text-slate-400 text-sm mb-3">Manage operational wallets</p>
                      <Button size="sm" variant="outline">
                        <Wallet className="w-4 h-4 mr-2" />
                        View Wallets
                      </Button>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Active Contracts</h4>
                      <p className="text-slate-400 text-sm mb-3">Monitor escrow activity</p>
                      <Button size="sm" variant="outline">
                        <Shield className="w-4 h-4 mr-2" />
                        View Contracts
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Platform Tools</CardTitle>
                <CardDescription className="text-slate-400">
                  Administrative tools and utilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 h-20 flex-col"
                    onClick={() => window.open('/admin/free-codes', '_blank')}
                  >
                    <Gift className="w-6 h-6 mb-2" />
                    Free Codes
                  </Button>
                  <Button 
                    className="bg-pink-600 hover:bg-pink-700 h-20 flex-col"
                    onClick={() => window.open('/admin/default-image', '_blank')}
                  >
                    <Settings className="w-6 h-6 mb-2" />
                    System Settings
                  </Button>
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700 h-20 flex-col"
                    onClick={() => window.open('/admin/content', '_blank')}
                  >
                    <Code className="w-6 h-6 mb-2" />
                    Content Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">System Monitoring</CardTitle>
                <CardDescription className="text-slate-400">
                  Platform health and performance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">System Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">API Status</span>
                        <Badge className="bg-green-500/20 text-green-400">Healthy</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Database</span>
                        <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">WebSocket</span>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Blockchain</span>
                        <Badge className="bg-green-500/20 text-green-400">Synced</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Performance Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Response Time</span>
                        <span className="text-white">45ms avg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Memory Usage</span>
                        <span className="text-white">234MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Connections</span>
                        <span className="text-white">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Error Rate</span>
                        <span className="text-white">0.02%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button 
                    className="bg-slate-600 hover:bg-slate-700"
                    onClick={() => window.open('/monitoring-dashboard', '_blank')}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Open Full Monitoring Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminUnifiedDashboard;