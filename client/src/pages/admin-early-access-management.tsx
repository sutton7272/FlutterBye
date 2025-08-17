import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Key, 
  Mail, 
  Plus, 
  Trash2, 
  Users, 
  Shield, 
  Eye,
  UserCheck,
  Clock,
  Settings
} from "lucide-react";

interface AccessCode {
  code: string;
  isActive: boolean;
  maxUses: number;
  currentUses: number;
  expiresAt?: string;
  createdBy?: string;
  createdAt: string;
}

interface ApprovedEmail {
  email: string;
  isActive: boolean;
  notes?: string;
  addedBy?: string;
  addedAt: string;
}

interface EarlyAccessStats {
  totalAccessCodes: number;
  totalApprovedEmails: number;
  activeSessions: number;
  accessCodes: string[];
  approvedEmails: string[];
}

export default function AdminEarlyAccessManagement() {
  const [newAccessCode, setNewAccessCode] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailNotes, setEmailNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch early access status
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/early-access/status'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Add access code mutation
  const addCodeMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/admin/early-access/add-code", { 
        code: newAccessCode.toUpperCase() 
      });
      return result.json();
    },
    onSuccess: (data: any) => {
      if (data.success) {
        toast({
          title: "Access Code Added",
          description: `Code ${newAccessCode.toUpperCase()} added successfully`
        });
        setNewAccessCode("");
        queryClient.invalidateQueries({ queryKey: ['/api/admin/early-access/status'] });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add access code",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add access code",
        variant: "destructive"
      });
    }
  });

  // Add approved email mutation
  const addEmailMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/admin/early-access/add-email", { 
        email: newEmail.toLowerCase(),
        notes: emailNotes
      });
      return result.json();
    },
    onSuccess: (data: any) => {
      if (data.success) {
        toast({
          title: "Email Approved",
          description: `${newEmail.toLowerCase()} added to approved list`
        });
        setNewEmail("");
        setEmailNotes("");
        queryClient.invalidateQueries({ queryKey: ['/api/admin/early-access/status'] });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add email",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add email",
        variant: "destructive"
      });
    }
  });

  // Remove access code mutation
  const removeCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const result = await apiRequest("DELETE", `/api/admin/early-access/remove-code/${code}`);
      return result.json();
    },
    onSuccess: (data: any, code: string) => {
      if (data.success) {
        toast({
          title: "Access Code Removed",
          description: `Code ${code} removed successfully`
        });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/early-access/status'] });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove access code",
        variant: "destructive"
      });
    }
  });

  // Remove approved email mutation
  const removeEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const result = await apiRequest("DELETE", `/api/admin/early-access/remove-email/${email}`);
      return result.json();
    },
    onSuccess: (data: any, email: string) => {
      if (data.success) {
        toast({
          title: "Email Removed",
          description: `${email} removed from approved list`
        });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/early-access/status'] });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove email",
        variant: "destructive"
      });
    }
  });

  const generateRandomCode = () => {
    const prefix = "FLBY-EARLY-2025-";
    const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    setNewAccessCode(prefix + suffix);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-electric-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-electric-blue">Loading early access management...</p>
        </div>
      </div>
    );
  }

  const statsData: EarlyAccessStats = stats?.stats || {
    totalAccessCodes: 0,
    totalApprovedEmails: 0,
    activeSessions: 0,
    accessCodes: [],
    approvedEmails: []
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-electric-blue/30 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-electric-blue" />
            <h1 className="text-4xl font-bold text-gradient">Early Access Management</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Manage access codes and approved emails for the FlutterBye early access gateway
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="electric-frame bg-gradient-to-br from-blue-900/20 to-blue-700/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Key className="w-8 h-8 text-electric-blue" />
                <div>
                  <p className="text-sm text-gray-400">Access Codes</p>
                  <p className="text-2xl font-bold text-electric-blue">{statsData.totalAccessCodes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="electric-frame bg-gradient-to-br from-green-900/20 to-green-700/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-electric-green" />
                <div>
                  <p className="text-sm text-gray-400">Approved Emails</p>
                  <p className="text-2xl font-bold text-electric-green">{statsData.totalApprovedEmails}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="electric-frame bg-gradient-to-br from-purple-900/20 to-purple-700/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Active Sessions</p>
                  <p className="text-2xl font-bold text-purple-400">{statsData.activeSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="electric-frame bg-gradient-to-br from-yellow-900/20 to-yellow-700/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Gateway Status</p>
                  <p className="text-lg font-bold text-yellow-400">ACTIVE</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="codes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 electric-frame">
            <TabsTrigger value="codes" className="data-[state=active]:bg-electric-blue data-[state=active]:text-black">
              <Key className="w-4 h-4 mr-2" />
              Access Codes
            </TabsTrigger>
            <TabsTrigger value="emails" className="data-[state=active]:bg-electric-green data-[state=active]:text-black">
              <Mail className="w-4 h-4 mr-2" />
              Approved Emails
            </TabsTrigger>
          </TabsList>

          {/* Access Codes Tab */}
          <TabsContent value="codes" className="space-y-6">
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-electric-blue" />
                  Add New Access Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="new-code">Access Code</Label>
                    <Input
                      id="new-code"
                      placeholder="FLBY-EARLY-2025-XXX"
                      value={newAccessCode}
                      onChange={(e) => setNewAccessCode(e.target.value.toUpperCase())}
                      className="bg-gray-800 border-electric-blue/30"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button 
                      onClick={generateRandomCode}
                      variant="outline"
                      className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue hover:text-black"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                    <Button 
                      onClick={() => addCodeMutation.mutate()}
                      disabled={!newAccessCode.trim() || addCodeMutation.isPending}
                      className="bg-electric-blue text-black hover:bg-electric-blue/80"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-electric-blue" />
                  Active Access Codes ({statsData.accessCodes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsData.accessCodes.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No access codes configured</p>
                ) : (
                  <div className="grid gap-3">
                    {statsData.accessCodes.map((code, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg electric-frame">
                        <div className="flex items-center gap-3">
                          <Key className="w-4 h-4 text-electric-blue" />
                          <span className="font-mono text-electric-blue">{code}</span>
                          <Badge variant="secondary" className="bg-green-900/50 text-green-400">Active</Badge>
                        </div>
                        <Button
                          onClick={() => removeCodeMutation.mutate(code)}
                          disabled={removeCodeMutation.isPending}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Emails Tab */}
          <TabsContent value="emails" className="space-y-6">
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-electric-green" />
                  Add Approved Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-email">Email Address</Label>
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="user@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value.toLowerCase())}
                      className="bg-gray-800 border-electric-blue/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-notes">Notes (Optional)</Label>
                    <Input
                      id="email-notes"
                      placeholder="VIP user, beta tester, etc."
                      value={emailNotes}
                      onChange={(e) => setEmailNotes(e.target.value)}
                      className="bg-gray-800 border-electric-blue/30"
                    />
                  </div>
                  <Button 
                    onClick={() => addEmailMutation.mutate()}
                    disabled={!newEmail.trim() || addEmailMutation.isPending}
                    className="bg-electric-green text-black hover:bg-electric-green/80"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Approve Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-electric-green" />
                  Approved Emails ({statsData.approvedEmails.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsData.approvedEmails.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No emails approved</p>
                ) : (
                  <div className="grid gap-3">
                    {statsData.approvedEmails.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg electric-frame">
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-4 h-4 text-electric-green" />
                          <span className="text-electric-green">{email}</span>
                          <Badge variant="secondary" className="bg-green-900/50 text-green-400">Approved</Badge>
                        </div>
                        <Button
                          onClick={() => removeEmailMutation.mutate(email)}
                          disabled={removeEmailMutation.isPending}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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