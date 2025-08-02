import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RedemptionCode, InsertRedemptionCodeForm } from "@shared/schema";
import { Ticket, Copy, Trash2, Plus, Settings, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function AdminFreeCodes() {
  const { toast } = useToast();
  const [newCode, setNewCode] = useState("");  
  const [maxUses, setMaxUses] = useState("1");
  const [expiryDays, setExpiryDays] = useState("30");
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch all redemption codes
  const { data: codes, isLoading } = useQuery<RedemptionCode[]>({
    queryKey: ["/api/admin/redemption-codes"],
  });

  // Create new redemption code
  const createCodeMutation = useMutation({
    mutationFn: async (data: InsertRedemptionCodeForm) => {
      return await apiRequest("/api/admin/redemption-codes", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/redemption-codes"] });
      setNewCode("");
      setMaxUses("1");
      setExpiryDays("30");
      toast({
        title: "Code Created",
        description: "Redemption code has been created successfully",
      });
    },
  });

  // Toggle code status
  const toggleCodeMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await apiRequest(`/api/admin/redemption-codes/${id}/toggle`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/redemption-codes"] });
      toast({
        title: "Code Updated",
        description: "Code status has been updated",
      });
    },
  });

  // Delete code
  const deleteCodeMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/redemption-codes/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/redemption-codes"] });
      toast({
        title: "Code Deleted",
        description: "Redemption code has been deleted",
      });
    },
  });

  const generateRandomCode = () => {
    setIsGenerating(true);
    const prefix = "FLBY-FREE";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const generatedCode = `${prefix}-${timestamp}-${random}`;
    setNewCode(generatedCode);
    setTimeout(() => setIsGenerating(false), 500);
  };

  const handleCreateCode = () => {
    if (!newCode.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter a redemption code",
        variant: "destructive",
      });
      return;
    }

    const expiryDate = expiryDays === "0" ? null : new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000);

    createCodeMutation.mutate({
      code: newCode.toUpperCase(),
      maxUses: parseInt(maxUses),
      currentUses: 0,
      isActive: true,
      createdBy: "admin-user-1", // Mock admin ID
      expiresAt: expiryDate,
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  const getStatusBadge = (code: RedemptionCode) => {
    const isExpired = code.expiresAt && new Date(code.expiresAt) < new Date();
    const isExhausted = code.currentUses >= code.maxUses;
    
    if (!code.isActive) return <Badge variant="secondary">Inactive</Badge>;
    if (isExpired) return <Badge variant="destructive">Expired</Badge>;
    if (isExhausted) return <Badge variant="outline">Exhausted</Badge>;
    return <Badge variant="default" className="bg-green-600">Active</Badge>;
  };

  const getUsageText = (code: RedemptionCode) => {
    if (code.maxUses === -1) return `${code.currentUses} uses (unlimited)`;
    return `${code.currentUses}/${code.maxUses} uses`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Free Message Codes</h1>
          <p className="text-muted-foreground">Generate and manage redemption codes for free Flutterbye messages</p>
        </div>
      </div>

      {/* Create New Code */}
      <Card className="premium-card electric-frame">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-500" />
            Generate New Code
          </CardTitle>
          <CardDescription>
            Create redemption codes that users can enter to mint free Flutterbye messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Redemption Code</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="FLBY-FREE-2024-001"
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateRandomCode}
                  disabled={isGenerating}
                >
                  {isGenerating ? <LoadingSpinner size="sm" /> : <Settings className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUses">Max Uses</Label>
              <Select value={maxUses} onValueChange={setMaxUses}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 use</SelectItem>
                  <SelectItem value="5">5 uses</SelectItem>
                  <SelectItem value="10">10 uses</SelectItem>
                  <SelectItem value="25">25 uses</SelectItem>
                  <SelectItem value="50">50 uses</SelectItem>
                  <SelectItem value="100">100 uses</SelectItem>
                  <SelectItem value="-1">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry</Label>
              <Select value={expiryDays} onValueChange={setExpiryDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="30">1 month</SelectItem>
                  <SelectItem value="90">3 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="0">Never expires</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleCreateCode}
                disabled={createCodeMutation.isPending}
                className="w-full"
              >
                {createCodeMutation.isPending ? <LoadingSpinner size="sm" /> : "Create Code"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Codes */}
      <Card className="premium-card electric-frame">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-blue-500" />
            Active Codes ({codes?.length || 0})
          </CardTitle>
          <CardDescription>
            Manage existing redemption codes and monitor usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {codes && codes.length > 0 ? (
            <div className="space-y-3">
              {codes.map((code) => (
                <div
                  key={code.id}
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <code className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {code.code}
                      </code>
                      {getStatusBadge(code)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{getUsageText(code)}</span>
                      {code.expiresAt && (
                        <span>Expires: {new Date(code.expiresAt).toLocaleDateString()}</span>
                      )}
                      <span>Created: {new Date(code.createdAt!).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(code.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Switch
                      checked={code.isActive}
                      onCheckedChange={(checked) =>
                        toggleCodeMutation.mutate({ id: code.id, isActive: checked })
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCodeMutation.mutate(code.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Ticket className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No redemption codes created yet</p>
              <p className="text-sm">Create your first code above to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}