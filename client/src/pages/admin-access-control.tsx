import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Shield, 
  Plus, 
  Trash2, 
  Key, 
  Globe, 
  Lock, 
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowLeft 
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AdminWallet {
  address: string;
  addedAt: string;
  lastAccess?: string;
  addedBy?: string;
}

interface SiteAccess {
  isEnabled: boolean;
  message?: string;
  updatedAt?: string;
}

export default function AdminAccessControl() {
  const [newAdminWallet, setNewAdminWallet] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [siteAccessMessage, setSiteAccessMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin authentication
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin-authenticated');
    if (!adminAuth) {
      window.location.href = '/admin-gateway';
      return;
    }
  }, []);

  // Fetch admin wallets
  const { data: adminWallets = [], isLoading: walletsLoading } = useQuery({
    queryKey: ["/api/admin/wallets"],
  });

  // Fetch site access status
  const { data: siteAccess, isLoading: accessLoading } = useQuery({
    queryKey: ["/api/admin/site-access"],
  });

  // Fetch admin activity logs
  const { data: activityLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["/api/admin/activity-logs"],
  });

  // Add admin wallet mutation
  const addAdminWallet = useMutation({
    mutationFn: async (walletAddress: string) => {
      const response = await apiRequest("POST", "/api/admin/add-wallet", {
        walletAddress
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/wallets"] });
      setNewAdminWallet("");
      toast({
        title: "Admin Wallet Added",
        description: "New admin wallet has been successfully added.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Wallet",
        description: error.message || "Could not add admin wallet.",
        variant: "destructive",
      });
    },
  });

  // Remove admin wallet mutation
  const removeAdminWallet = useMutation({
    mutationFn: async (walletAddress: string) => {
      const response = await apiRequest("DELETE", `/api/admin/remove-wallet/${encodeURIComponent(walletAddress)}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/wallets"] });
      toast({
        title: "Admin Wallet Removed",
        description: "Admin wallet has been successfully removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Remove Wallet",
        description: error.message || "Could not remove admin wallet.",
        variant: "destructive",
      });
    },
  });

  // Update admin password mutation
  const updatePassword = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("POST", "/api/admin/update-password", {
        password
      });
      return response.json();
    },
    onSuccess: () => {
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password Updated",
        description: "Admin password has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Password",
        description: error.message || "Could not update admin password.",
        variant: "destructive",
      });
    },
  });

  // Toggle site access mutation
  const toggleSiteAccess = useMutation({
    mutationFn: async ({ enabled, message }: { enabled: boolean; message?: string }) => {
      const response = await apiRequest("POST", "/api/admin/site-access", {
        enabled,
        message
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-access"] });
      toast({
        title: "Site Access Updated",
        description: "Site access settings have been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Site Access",
        description: error.message || "Could not update site access.",
        variant: "destructive",
      });
    },
  });

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminWallet.trim()) return;
    
    // Basic Solana address validation
    if (newAdminWallet.length < 32 || newAdminWallet.length > 44) {
      toast({
        title: "Invalid Wallet Address",
        description: "Please enter a valid Solana wallet address.",
        variant: "destructive",
      });
      return;
    }
    
    addAdminWallet.mutate(newAdminWallet.trim());
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    updatePassword.mutate(newPassword);
  };

  const handleToggleSiteAccess = () => {
    const isCurrentlyEnabled = siteAccess?.isEnabled !== false;
    toggleSiteAccess.mutate({
      enabled: !isCurrentlyEnabled,
      message: siteAccessMessage || undefined
    });
  };

  useEffect(() => {
    if (siteAccess?.message) {
      setSiteAccessMessage(siteAccess.message);
    }
  }, [siteAccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin-gateway">
            <Button variant="outline" className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              ← Admin Home
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Access Control</h1>
          <p className="text-slate-300">Manage admin access and site controls</p>
        </div>

        <Tabs defaultValue="admin-wallets" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="admin-wallets" className="data-[state=active]:bg-blue-600">
              <Shield className="w-4 h-4 mr-2" />
              Admin Wallets
            </TabsTrigger>
            <TabsTrigger value="site-access" className="data-[state=active]:bg-blue-600">
              <Globe className="w-4 h-4 mr-2" />
              Site Access
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
              <Key className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600">
              <Activity className="w-4 h-4 mr-2" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          {/* Admin Wallets Tab */}
          <TabsContent value="admin-wallets">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Admin Wallet */}
              <Card className="bg-slate-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Admin Wallet
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Register a new wallet for admin access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddWallet} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white">Wallet Address</label>
                      <Input
                        value={newAdminWallet}
                        onChange={(e) => setNewAdminWallet(e.target.value)}
                        placeholder="Enter Solana wallet address"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={addAdminWallet.isPending}
                    >
                      {addAdminWallet.isPending ? "Adding..." : "Add Admin Wallet"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Current Admin Wallets */}
              <Card className="bg-slate-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Current Admin Wallets
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Manage existing admin wallet access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {walletsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto" />
                    </div>
                  ) : adminWallets.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">No admin wallets registered</p>
                  ) : (
                    <div className="space-y-3">
                      {adminWallets.map((wallet: AdminWallet, index: number) => (
                        <div key={wallet.address} className="flex items-center justify-between p-3 bg-slate-700/50 rounded border border-slate-600">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-mono text-sm truncate">
                              {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                            </p>
                            <p className="text-xs text-slate-400">
                              Added: {new Date(wallet.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeAdminWallet.mutate(wallet.address)}
                            disabled={removeAdminWallet.isPending}
                            className="ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Site Access Tab */}
          <TabsContent value="site-access">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Site Access Control
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Control public access to the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded border border-slate-600">
                  <div>
                    <h3 className="text-white font-medium">Site Status</h3>
                    <p className="text-sm text-slate-400">
                      {siteAccess?.isEnabled !== false ? "Site is publicly accessible" : "Site access is restricted"}
                    </p>
                  </div>
                  <Badge variant={siteAccess?.isEnabled !== false ? "default" : "destructive"}>
                    {siteAccess?.isEnabled !== false ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Online
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Restricted
                      </>
                    )}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white">Restriction Message</label>
                    <Input
                      value={siteAccessMessage}
                      onChange={(e) => setSiteAccessMessage(e.target.value)}
                      placeholder="Message to display when site is restricted"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      This message will be shown to users when site access is restricted
                    </p>
                  </div>

                  <Button
                    onClick={handleToggleSiteAccess}
                    disabled={toggleSiteAccess.isPending}
                    variant={siteAccess?.isEnabled !== false ? "destructive" : "default"}
                    className="w-full"
                  >
                    {toggleSiteAccess.isPending
                      ? "Updating..."
                      : siteAccess?.isEnabled !== false
                      ? "Restrict Site Access"
                      : "Enable Site Access"
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Manage admin password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white">New Admin Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white">Confirm Password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      Changing the admin password will not affect registered admin wallets. 
                      They will continue to have direct access.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={updatePassword.isPending || !newPassword || newPassword !== confirmPassword}
                  >
                    {updatePassword.isPending ? "Updating..." : "Update Admin Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="activity">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Admin Activity Logs
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Recent admin access and activity history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto" />
                  </div>
                ) : activityLogs.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No activity logs available</p>
                ) : (
                  <div className="space-y-3">
                    {activityLogs.map((log: any, index: number) => (
                      <div key={index} className="p-3 bg-slate-700/50 rounded border border-slate-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">{log.action}</p>
                            <p className="text-xs text-slate-400">
                              {log.walletAddress && `${log.walletAddress.slice(0, 8)}...${log.walletAddress.slice(-8)}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}