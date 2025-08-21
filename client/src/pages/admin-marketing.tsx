import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Wallet, 
  Users, 
  Calendar, 
  Download, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Copy,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface WaitlistEntry {
  id: string;
  entryId: string;
  email: string;
  walletAddress?: string;
  joinedAt: string;
  createdAt: string;
  status: string;
  source: string;
  benefits: string[];
}

interface WaitlistSummary {
  totalEmails: number;
  withWallets: number;
  withoutWallets: number;
  lastEntry: string | null;
  byStatus: {
    active: number;
    contacted: number;
    converted: number;
  };
  bySource: {
    website: number;
    referral: number;
    social: number;
  };
}

export default function AdminMarketing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const { data: waitlistData, isLoading, error } = useQuery({
    queryKey: ["/api/admin/waitlist-entries"],
    retry: 1,
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/waitlist-entries"] });
    },
    onSuccess: () => {
      toast({
        title: "Data Refreshed",
        description: "Waitlist data has been updated",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ entryId, status }: { entryId: string; status: string }) => {
      const response = await fetch(`/api/admin/waitlist-entries/${entryId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/waitlist-entries"] });
      toast({
        title: "Status Updated",
        description: "Entry status has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update entry status",
        variant: "destructive",
      });
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/waitlist-entries/export");
      if (!response.ok) throw new Error("Export failed");
      return await response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vip-waitlist-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Export Complete",
        description: "Waitlist data has been exported successfully",
      });
    },
    onError: () => {
      toast({
        title: "Export Failed",
        description: "Failed to export waitlist data",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading waitlist data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Data</CardTitle>
            <CardDescription>Failed to load waitlist entries</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refreshMutation.mutate()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const entries: WaitlistEntry[] = (waitlistData as any)?.entries || [];
  const summary: WaitlistSummary = (waitlistData as any)?.summary || {
    totalEmails: 0,
    withWallets: 0,
    withoutWallets: 0,
    lastEntry: null,
    byStatus: { active: 0, contacted: 0, converted: 0 },
    bySource: { website: 0, referral: 0, social: 0 }
  };

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = 
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.walletAddress && entry.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    const matchesSource = sourceFilter === "all" || entry.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      contacted: "bg-blue-100 text-blue-800 border-blue-200",
      converted: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getSourceBadge = (source: string) => {
    const variants = {
      website: "bg-blue-100 text-blue-800 border-blue-200",
      referral: "bg-orange-100 text-orange-800 border-orange-200",
      social: "bg-pink-100 text-pink-800 border-pink-200",
    };
    return variants[source as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient">VIP Waitlist Marketing Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage and analyze your VIP waitlist entries with persistent database storage
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            variant="outline"
            data-testid="button-refresh"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", refreshMutation.isPending && "animate-spin")} />
            Refresh
          </Button>
          <Button
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            data-testid="button-export"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="electric-frame">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-electric-blue" />
              <div>
                <p className="text-2xl font-bold text-gradient" data-testid="text-total-entries">{summary.totalEmails}</p>
                <p className="text-xs text-muted-foreground">VIP members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="electric-frame">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">With Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wallet className="w-8 h-8 text-electric-green" />
              <div>
                <p className="text-2xl font-bold text-gradient" data-testid="text-with-wallets">{summary.withWallets}</p>
                <p className="text-xs text-muted-foreground">Ready for airdrops</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="electric-frame">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-gradient" data-testid="text-conversion-rate">
                  {summary.totalEmails > 0 ? Math.round((summary.byStatus.converted / summary.totalEmails) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">To full access</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="electric-frame">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latest Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-sm font-bold text-gradient" data-testid="text-latest-entry">
                  {summary.lastEntry ? format(new Date(summary.lastEntry), "MMM dd") : "None"}
                </p>
                <p className="text-xs text-muted-foreground">Most recent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="electric-frame">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search email or wallet address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                data-testid="select-status"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Source</label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                data-testid="select-source"
              >
                <option value="all">All Sources</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social">Social</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries Table */}
      <Card className="electric-frame">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            VIP Waitlist Entries ({filteredEntries.length})
          </CardTitle>
          <CardDescription>
            All entries are stored persistently in the database and will be available in production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Email</th>
                  <th className="text-left p-2 font-medium">Wallet Address</th>
                  <th className="text-left p-2 font-medium">Status</th>
                  <th className="text-left p-2 font-medium">Source</th>
                  <th className="text-left p-2 font-medium">Joined</th>
                  <th className="text-left p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium" data-testid={`text-email-${entry.id}`}>{entry.email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(entry.email, "Email")}
                          data-testid={`button-copy-email-${entry.id}`}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-2">
                      {entry.walletAddress ? (
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-sm" data-testid={`text-wallet-${entry.id}`}>
                            {entry.walletAddress.slice(0, 8)}...{entry.walletAddress.slice(-4)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(entry.walletAddress!, "Wallet address")}
                            data-testid={`button-copy-wallet-${entry.id}`}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No wallet</span>
                      )}
                    </td>
                    <td className="p-2">
                      <Badge 
                        className={getStatusBadge(entry.status)}
                        data-testid={`badge-status-${entry.id}`}
                      >
                        {entry.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge 
                        className={getSourceBadge(entry.source)}
                        data-testid={`badge-source-${entry.id}`}
                      >
                        {entry.source}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm" data-testid={`text-date-${entry.id}`}>
                          {format(new Date(entry.createdAt), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        {entry.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({ entryId: entry.entryId, status: "contacted" })}
                            disabled={updateStatusMutation.isPending}
                            data-testid={`button-contact-${entry.id}`}
                          >
                            Mark Contacted
                          </Button>
                        )}
                        {entry.status === "contacted" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({ entryId: entry.entryId, status: "converted" })}
                            disabled={updateStatusMutation.isPending}
                            data-testid={`button-convert-${entry.id}`}
                          >
                            Mark Converted
                          </Button>
                        )}
                        {entry.status === "converted" && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Converted
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No waitlist entries found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="electric-frame">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${summary.totalEmails > 0 ? (summary.byStatus.active / summary.totalEmails) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium" data-testid="text-status-active">{summary.byStatus.active}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Contacted</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${summary.totalEmails > 0 ? (summary.byStatus.contacted / summary.totalEmails) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium" data-testid="text-status-contacted">{summary.byStatus.contacted}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Converted</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${summary.totalEmails > 0 ? (summary.byStatus.converted / summary.totalEmails) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium" data-testid="text-status-converted">{summary.byStatus.converted}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="electric-frame">
          <CardHeader>
            <CardTitle>Source Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Website</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${summary.totalEmails > 0 ? (summary.bySource.website / summary.totalEmails) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium" data-testid="text-source-website">{summary.bySource.website}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Referral</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${summary.totalEmails > 0 ? (summary.bySource.referral / summary.totalEmails) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium" data-testid="text-source-referral">{summary.bySource.referral}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Social</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-pink-500 rounded-full"
                      style={{ width: `${summary.totalEmails > 0 ? (summary.bySource.social / summary.totalEmails) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium" data-testid="text-source-social">{summary.bySource.social}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}