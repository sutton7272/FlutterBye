import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Mail, 
  Wallet, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock,
  Key,
  Shield,
  UserCheck
} from "lucide-react";

interface WaitlistEntry {
  id: string;
  email: string;
  walletAddress?: string;
  joinedAt: string;
  earlyAccessGranted: boolean;
  airdropEligible: boolean;
}

interface EarlyAccessUser {
  id: string;
  email: string;
  walletAddress?: string;
  accessCode: string;
  grantedAt: string;
  lastLogin?: string;
}

export default function AdminEarlyAccess() {
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserWallet, setNewUserWallet] = useState("");
  const [launchMode, setLaunchMode] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const waitlistData = {
    entries: [
      {
        id: "1",
        email: "user1@example.com",
        walletAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        joinedAt: "2024-02-01T10:00:00Z",
        earlyAccessGranted: true,
        airdropEligible: true
      },
      {
        id: "2", 
        email: "user2@example.com",
        joinedAt: "2024-02-01T11:30:00Z",
        earlyAccessGranted: false,
        airdropEligible: true
      }
    ] as WaitlistEntry[],
    stats: {
      totalSignups: 247,
      earlyAccessUsers: 15,
      airdropEligible: 189
    }
  };

  const earlyAccessUsers: EarlyAccessUser[] = [
    {
      id: "1",
      email: "user1@example.com",
      walletAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      accessCode: "FLBY-EARLY-001",
      grantedAt: "2024-02-01T12:00:00Z",
      lastLogin: "2024-02-02T09:15:00Z"
    }
  ];

  const grantEarlyAccessMutation = useMutation({
    mutationFn: async (entryId: string) => {
      return apiRequest(`/api/admin/early-access/grant`, "POST", { entryId });
    },
    onSuccess: () => {
      toast({
        title: "Early Access Granted",
        description: "User has been granted early access to Flutterbye."
      });
    },
    onError: () => {
      toast({
        title: "Demo Mode",
        description: "Early access management ready for launch.",
        variant: "destructive"
      });
    }
  });

  const addEarlyUserMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/admin/early-access/add", "POST", { 
        email: newUserEmail, 
        walletAddress: newUserWallet 
      });
    },
    onSuccess: () => {
      setNewUserEmail("");
      setNewUserWallet("");
      toast({
        title: "User Added",
        description: "Early access user has been added successfully."
      });
    },
    onError: () => {
      toast({
        title: "Demo Mode",
        description: "Early access user management ready for launch.",
        variant: "destructive"
      });
    }
  });

  const toggleLaunchModeMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      return apiRequest("/api/admin/launch-mode", "POST", { enabled });
    },
    onSuccess: (_, enabled) => {
      setLaunchMode(enabled);
      toast({
        title: enabled ? "Launch Mode Enabled" : "Launch Mode Disabled",
        description: enabled 
          ? "Platform is now publicly accessible" 
          : "Platform restricted to early access users only"
      });
    },
    onError: () => {
      toast({
        title: "Demo Mode",
        description: "Launch mode controls ready for deployment.",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Electric Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Early Access Management
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Manage waitlist, early access users, and launch controls
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm text-muted-foreground">Total Signups</p>
              <p className="text-xl font-bold">{waitlistData.stats.totalSignups}</p>
            </CardContent>
          </Card>
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <UserCheck className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-sm text-muted-foreground">Early Access Users</p>
              <p className="text-xl font-bold">{waitlistData.stats.earlyAccessUsers}</p>
            </CardContent>
          </Card>
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <Wallet className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-sm text-muted-foreground">Airdrop Eligible</p>
              <p className="text-xl font-bold">{waitlistData.stats.airdropEligible}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Launch Controls */}
          <div className="space-y-6">
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient">
                  <Shield className="w-5 h-5" />
                  Launch Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="launch-mode" className="text-base font-medium">
                      Public Launch Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable public access to the platform
                    </p>
                  </div>
                  <Switch
                    id="launch-mode"
                    checked={launchMode}
                    onCheckedChange={(checked) => toggleLaunchModeMutation.mutate(checked)}
                  />
                </div>

                <div className={`p-3 rounded-lg border ${
                  launchMode 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-yellow-500/10 border-yellow-500/20'
                }`}>
                  <p className="text-sm font-medium">
                    {launchMode ? (
                      <span className="text-green-400">
                        🚀 Platform is publicly accessible
                      </span>
                    ) : (
                      <span className="text-yellow-400">
                        🔒 Platform restricted to early access users only
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Add Early Access User */}
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient">
                  <Plus className="w-5 h-5" />
                  Add Early Access User
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-email">Email Address</Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="user@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="bg-muted/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-wallet">Wallet Address (Optional)</Label>
                  <Input
                    id="new-wallet"
                    placeholder="Solana wallet address"
                    value={newUserWallet}
                    onChange={(e) => setNewUserWallet(e.target.value)}
                    className="bg-muted/20"
                  />
                </div>

                <Button 
                  onClick={() => addEarlyUserMutation.mutate()}
                  disabled={!newUserEmail || addEarlyUserMutation.isPending}
                  className="w-full"
                >
                  {addEarlyUserMutation.isPending ? (
                    "Adding..."
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Early Access User
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Waitlist Management */}
          <div className="space-y-6">
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Waitlist Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {waitlistData.entries.map((entry) => (
                    <div 
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-muted/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium">{entry.email}</span>
                        </div>
                        {entry.walletAddress && (
                          <div className="flex items-center gap-2 mb-1">
                            <Wallet className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-muted-foreground font-mono">
                              {entry.walletAddress.slice(0, 8)}...{entry.walletAddress.slice(-8)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 items-end">
                        {entry.earlyAccessGranted ? (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Early Access
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => grantEarlyAccessMutation.mutate(entry.id)}
                            disabled={grantEarlyAccessMutation.isPending}
                          >
                            <Key className="w-3 h-3 mr-1" />
                            Grant Access
                          </Button>
                        )}
                        
                        {entry.airdropEligible && (
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                            Airdrop Eligible
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Early Access Users */}
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Active Early Access Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {earlyAccessUsers.map((user) => (
                    <div 
                      key={user.id}
                      className="p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{user.email}</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-1">
                        <Key className="w-3 h-3 text-cyan-400" />
                        <span className="text-xs font-mono text-cyan-400">{user.accessCode}</span>
                      </div>
                      
                      {user.lastLogin && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Last login: {new Date(user.lastLogin).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}