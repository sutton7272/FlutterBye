import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Shield, Flag, Ban, TrendingUp, Users, Coins, Activity, AlertTriangle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface DashboardStats {
  totalTokens: number;
  totalValueEscrowed: string;
  totalRedemptions: number;
  activeUsers: number;
}

interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: Record<string, any>;
  createdAt: string;
}

interface Token {
  id: string;
  message: string;
  hasAttachedValue: boolean;
  attachedValue: string;
  currency: string;
  isBlocked: boolean;
  flaggedAt?: string;
  flaggedReason?: string;
  createdAt: string;
}

export default function AdminPage() {
  const [adminWallet, setAdminWallet] = useState<string>('');
  const [flagReason, setFlagReason] = useState<string>('');
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: adminLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['/api/admin/logs'],
  });

  const { data: tokensWithValue = [], isLoading: tokensLoading } = useQuery({
    queryKey: ['/api/tokens/with-value'],
  });

  const flagTokenMutation = useMutation({
    mutationFn: async ({ tokenId, reason }: { tokenId: string; reason: string }) => {
      return await apiRequest(`/api/admin/tokens/${tokenId}/flag`, 'POST', {
        reason,
        adminId: adminWallet
      });
    },
    onSuccess: () => {
      toast({
        title: "Token Flagged",
        description: "Token has been flagged for review.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/with-value'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/logs'] });
    },
  });

  const blockTokenMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      return await apiRequest(`/api/admin/tokens/${tokenId}/block`, 'POST', {
        adminId: adminWallet
      });
    },
    onSuccess: () => {
      toast({
        title: "Token Blocked",
        description: "Token has been blocked and is no longer accessible.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/with-value'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/logs'] });
    },
  });

  const connectAdminWallet = async () => {
    const mockAdmin = 'admin-' + Math.random().toString(36).substr(2, 9);
    setAdminWallet(mockAdmin);
    toast({
      title: "Admin Access Granted",
      description: "Successfully authenticated as administrator.",
    });
  };

  const handleFlagToken = () => {
    if (!selectedTokenId || !flagReason) {
      toast({
        title: "Missing Information",
        description: "Please select a token and provide a reason.",
        variant: "destructive",
      });
      return;
    }
    flagTokenMutation.mutate({ tokenId: selectedTokenId, reason: flagReason });
    setFlagReason('');
    setSelectedTokenId('');
  };

  const handleBlockToken = (tokenId: string) => {
    blockTokenMutation.mutate(tokenId);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'flag_token':
        return <Flag className="w-4 h-4 text-yellow-500" />;
      case 'block_token':
        return <Ban className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor platform activity and manage token moderation
          </p>
        </div>

        {/* Admin Authentication */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Admin Access
            </CardTitle>
            <CardDescription>
              Authenticate with admin wallet to access dashboard features
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!adminWallet ? (
              <Button onClick={connectAdminWallet} size="lg" className="w-full sm:w-auto">
                <Shield className="w-4 h-4 mr-2" />
                Connect Admin Wallet
              </Button>
            ) : (
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-sm">
                  Admin: {adminWallet}
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => setAdminWallet('')}
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {adminWallet && (
          <>
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold">
                        {statsLoading ? '...' : stats?.totalTokens?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Tokens</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold">
                        {statsLoading ? '...' : `${parseFloat(stats?.totalValueEscrowed || '0').toFixed(2)}`}
                      </div>
                      <div className="text-sm text-muted-foreground">SOL Escrowed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-2xl font-bold">
                        {statsLoading ? '...' : stats?.totalRedemptions?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-muted-foreground">Redemptions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="text-2xl font-bold">
                        {statsLoading ? '...' : stats?.activeUsers?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Tabs */}
            <Tabs defaultValue="moderation" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="moderation">Token Moderation</TabsTrigger>
                <TabsTrigger value="logs">Admin Logs</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="moderation" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Flag Token */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Flag className="w-5 h-5 mr-2" />
                        Flag Token
                      </CardTitle>
                      <CardDescription>
                        Flag tokens for inappropriate content or violations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Token ID</label>
                        <Input
                          value={selectedTokenId}
                          onChange={(e) => setSelectedTokenId(e.target.value)}
                          placeholder="Enter token ID"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Reason</label>
                        <Textarea
                          value={flagReason}
                          onChange={(e) => setFlagReason(e.target.value)}
                          placeholder="Describe the violation or issue"
                          rows={3}
                        />
                      </div>
                      <Button
                        onClick={handleFlagToken}
                        disabled={flagTokenMutation.isPending}
                        className="w-full"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        {flagTokenMutation.isPending ? 'Flagging...' : 'Flag Token'}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Tokens with Value */}
                  <Card>
                    <CardHeader>
                      <CardTitle>High-Value Tokens</CardTitle>
                      <CardDescription>
                        Monitor tokens with attached value for potential issues
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {tokensLoading ? (
                        <div className="text-center py-4">Loading tokens...</div>
                      ) : (tokensWithValue as Token[]).length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No tokens with value found
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {(tokensWithValue as Token[]).map((token: Token) => (
                            <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="font-mono text-sm">{token.message}</div>
                                <div className="text-xs text-green-600">
                                  {token.attachedValue} {token.currency}
                                </div>
                                {token.flaggedAt && (
                                  <div className="text-xs text-yellow-600 flex items-center mt-1">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Flagged: {token.flaggedReason}
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                {!token.isBlocked && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleBlockToken(token.id)}
                                    disabled={blockTokenMutation.isPending}
                                  >
                                    <Ban className="w-3 h-3" />
                                  </Button>
                                )}
                                {token.isBlocked && (
                                  <Badge variant="destructive">Blocked</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Activity Logs</CardTitle>
                    <CardDescription>
                      Track all administrative actions and moderation decisions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {logsLoading ? (
                      <div className="text-center py-8">Loading logs...</div>
                    ) : (adminLogs as AdminLog[]).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No admin logs found
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(adminLogs as AdminLog[]).map((log: AdminLog) => (
                          <div key={log.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            {getActionIcon(log.action)}
                            <div className="flex-1">
                              <div className="font-medium capitalize">
                                {log.action.replace('_', ' ')}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Target: {log.targetType} ({log.targetId})
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(log.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-sm">
                              <Badge variant="outline">
                                {log.adminId}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Analytics</CardTitle>
                    <CardDescription>
                      Monitor platform growth and user activity metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Analytics dashboard coming soon...
                      <br />
                      This will include charts for token creation trends, 
                      redemption patterns, and user growth metrics.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}