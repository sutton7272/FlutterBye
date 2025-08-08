import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Wallet, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Activity,
  Lock,
  Eye,
  Plus,
  RefreshCw,
  Download
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CustodialWallet {
  id: string;
  currency: string;
  walletAddress: string;
  balance: string;
  reservedBalance: string;
  status: string;
  isHotWallet: boolean;
  lastHealthCheck: string;
  createdAt: string;
}

interface WalletTransaction {
  id: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  transactionHash: string | null;
  fromAddress: string | null;
  toAddress: string | null;
  createdAt: string;
  processedAt: string | null;
}

interface SecurityLog {
  id: string;
  userId: string | null;
  eventType: string;
  severity: string;
  ipAddress: string | null;
  location: string | null;
  details: any;
  actionTaken: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

interface WalletStatistics {
  totalWallets: number;
  totalBalance: { [currency: string]: number };
  activeTransactions: number;
  suspiciousActivities: number;
  complianceAlerts: number;
}

/**
 * Secure Custodial Wallet Management Dashboard
 * Production-ready admin interface for managing custodial wallet infrastructure
 */
export function CustodialWalletManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedCurrency, setSelectedCurrency] = useState<string>("SOL");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [securityFilter, setSecurityFilter] = useState<string>("all");

  // Fetch custodial wallets
  const { data: walletsData, isLoading: walletsLoading } = useQuery({
    queryKey: ["/api/admin/custodial-wallet/wallets"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch wallet statistics
  const { data: statisticsData, isLoading: statisticsLoading } = useQuery({
    queryKey: ["/api/admin/custodial-wallet/statistics"],
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch security logs
  const { data: securityLogsData, isLoading: securityLoading } = useQuery({
    queryKey: ["/api/admin/custodial-wallet/security-logs", securityFilter],
    refetchInterval: 15000, // Refresh every 15 seconds for security
  });

  // Fetch wallet health
  const { data: healthData, isLoading: healthLoading } = useQuery({
    queryKey: ["/api/custodial-wallet/health"],
    refetchInterval: 60000, // Refresh every minute
  });

  // Create wallet mutation
  const createWalletMutation = useMutation({
    mutationFn: async (data: { currency: string; isHotWallet: boolean }) =>
      apiRequest("POST", "/api/admin/custodial-wallet/create", data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Custodial wallet created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/custodial-wallet/wallets"] });
      setIsCreateDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create custodial wallet",
        variant: "destructive",
      });
    },
  });

  const wallets: CustodialWallet[] = walletsData?.wallets || [];
  const statistics: WalletStatistics = statisticsData?.statistics || {
    totalWallets: 0,
    totalBalance: { SOL: 0, USDC: 0, FLBY: 0 },
    activeTransactions: 0,
    suspiciousActivities: 0,
    complianceAlerts: 0
  };
  const securityLogs: SecurityLog[] = securityLogsData?.logs || [];
  const healthChecks = healthData?.wallets || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    return `${num.toFixed(4)} ${currency}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Secure Custodial Wallet Management</h2>
          <p className="text-gray-400">Production-ready wallet infrastructure for user value attachment</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-electric-blue hover:bg-electric-blue/80">
              <Plus className="w-4 h-4 mr-2" />
              Create Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-dark-navy/90 backdrop-blur-sm border-electric-blue/30 shadow-xl">
            <DialogHeader className="bg-dark-navy/60 -mx-6 -mt-6 px-6 pt-6 pb-4 rounded-t-lg border-b border-electric-blue/20">
              <DialogTitle className="text-white">Create New Custodial Wallet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-gray-200 font-medium">Currency</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="bg-dark-navy/60 border-electric-blue/30 text-white backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-navy/90 border-electric-blue/30">
                    <SelectItem value="SOL">SOL</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="FLBY">FLBY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => createWalletMutation.mutate({ 
                    currency: selectedCurrency, 
                    isHotWallet: true 
                  })}
                  disabled={createWalletMutation.isPending}
                  className="bg-electric-blue hover:bg-electric-blue/80"
                >
                  {createWalletMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Wallet"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-dark-navy/80 backdrop-blur-sm border-electric-blue/30 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Wallet className="w-4 h-4 mr-2 text-electric-blue" />
              Total Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statistics.totalWallets}</div>
          </CardContent>
        </Card>

        <Card className="bg-dark-navy/80 backdrop-blur-sm border-electric-blue/30 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-electric-green" />
              SOL Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {statistics.totalBalance.SOL?.toFixed(4) || '0.0000'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-navy/80 backdrop-blur-sm border-electric-blue/30 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-electric-blue" />
              Active Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statistics.activeTransactions}</div>
          </CardContent>
        </Card>

        <Card className="bg-dark-navy/80 backdrop-blur-sm border-electric-blue/30 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{statistics.suspiciousActivities}</div>
          </CardContent>
        </Card>

        <Card className="bg-dark-navy/80 backdrop-blur-sm border-electric-blue/30 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-red-400" />
              Compliance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{statistics.complianceAlerts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="wallets" className="space-y-4">
        <TabsList className="bg-dark-navy/30 border border-electric-blue/20">
          <TabsTrigger value="wallets" className="data-[state=active]:bg-electric-blue">
            Wallets
          </TabsTrigger>
          <TabsTrigger value="health" className="data-[state=active]:bg-electric-blue">
            Health Monitor
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-electric-blue">
            Security Logs
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-electric-blue">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Wallets Tab */}
        <TabsContent value="wallets" className="space-y-4">
          <Card className="bg-dark-navy/80 backdrop-blur-sm border-electric-blue/30 shadow-lg">
            <CardHeader className="bg-dark-navy/50 rounded-t-lg">
              <CardTitle className="text-white flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-electric-blue" />
                Custodial Wallets
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage secure custodial wallets for user value attachment system
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-dark-navy/60">
              {walletsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-electric-blue" />
                </div>
              ) : (
                <div className="space-y-4">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="bg-dark-navy/70 border border-electric-blue/20 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(wallet.status)}>
                            {wallet.status}
                          </Badge>
                          <span className="text-lg font-semibold text-white">
                            {wallet.currency}
                          </span>
                          <Badge variant={wallet.isHotWallet ? "default" : "secondary"}>
                            {wallet.isHotWallet ? "Hot" : "Cold"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400">
                          Created {new Date(wallet.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <Label className="text-xs text-gray-400">Wallet Address</Label>
                          <div className="text-sm font-mono text-white truncate">
                            {wallet.walletAddress}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400">Available Balance</Label>
                          <div className="text-sm font-semibold text-green-400">
                            {formatCurrency(wallet.balance, wallet.currency)}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400">Reserved Balance</Label>
                          <div className="text-sm font-semibold text-yellow-400">
                            {formatCurrency(wallet.reservedBalance, wallet.currency)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Last health check: {new Date(wallet.lastHealthCheck).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  
                  {wallets.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No custodial wallets found. Create one to get started.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Monitor Tab */}
        <TabsContent value="health" className="space-y-4">
          <Card className="bg-dark-navy/50 border-electric-blue/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Wallet Health Monitor
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time health monitoring and diagnostics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {healthLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-electric-blue" />
                </div>
              ) : (
                <div className="space-y-4">
                  {healthData?.overallHealth ? (
                    <Alert className="border-green-500/20 bg-green-500/10">
                      <CheckCircle className="w-4 h-4" />
                      <AlertDescription className="text-green-400">
                        All custodial wallets are healthy and operational
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="border-red-500/20 bg-red-500/10">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-red-400">
                        Some wallets require attention
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {healthChecks.map((check: any) => (
                    <div key={check.walletId} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {check.isHealthy ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="font-semibold text-white">
                            {check.currency} Wallet
                          </span>
                        </div>
                        <Badge className={getStatusColor(check.status)}>
                          {check.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-300 mb-2">
                        Current Balance: {formatCurrency(check.currentBalance, check.currency)}
                      </div>
                      
                      {check.issues.length > 0 && (
                        <div className="space-y-1">
                          <Label className="text-xs text-red-400">Issues:</Label>
                          {check.issues.map((issue: string, index: number) => (
                            <div key={index} className="text-xs text-red-300">
                              • {issue}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 mt-2">
                        Last checked: {new Date(check.lastHealthCheck).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Logs Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card className="bg-dark-navy/50 border-electric-blue/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Security Monitoring
              </CardTitle>
              <CardDescription className="text-gray-400 flex items-center justify-between">
                <span>Real-time security events and compliance monitoring</span>
                <Select value={securityFilter} onValueChange={setSecurityFilter}>
                  <SelectTrigger className="w-32 bg-dark-navy/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-navy border-gray-600">
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {securityLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-electric-blue" />
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {securityLogs.map((log) => (
                      <div key={log.id} className="border border-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getSeverityColor(log.severity)}>
                              {log.severity.toUpperCase()}
                            </Badge>
                            <span className="text-sm font-medium text-white">
                              {log.eventType.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-300 mb-2">
                          User ID: {log.userId || 'N/A'}
                        </div>
                        
                        {log.ipAddress && (
                          <div className="text-xs text-gray-400 mb-1">
                            IP: {log.ipAddress} {log.location && `| ${log.location}`}
                          </div>
                        )}
                        
                        {log.details && (
                          <div className="text-xs text-gray-500 bg-gray-800/50 p-2 rounded mt-2">
                            {JSON.stringify(log.details, null, 2)}
                          </div>
                        )}
                        
                        {log.actionTaken && (
                          <div className="text-xs text-green-400 mt-1">
                            Action: {log.actionTaken}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {securityLogs.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        No security events found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-dark-navy/50 border-electric-blue/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Revenue Analytics
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Transaction fees and revenue tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">$0.00</div>
                    <div className="text-sm text-gray-400">Total Revenue (24h)</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">0</div>
                      <div className="text-xs text-gray-400">Deposits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">0</div>
                      <div className="text-xs text-gray-400">Redemptions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">0</div>
                      <div className="text-xs text-gray-400">Value Attachments</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-navy/50 border-electric-blue/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Engagement
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Active users and usage patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-electric-blue">0</div>
                    <div className="text-sm text-gray-400">Active Users (24h)</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">0</div>
                      <div className="text-xs text-gray-400">New Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">0</div>
                      <div className="text-xs text-gray-400">Returning Users</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}