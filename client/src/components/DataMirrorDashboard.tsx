import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  Database, 
  HardDrive, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  FileCheck,
  Settings,
  Trash2,
  RotateCcw,
  Activity
} from "lucide-react";

interface MirrorManifest {
  mirrorId: string;
  timestamp: string;
  sourceData: string;
  mirrorLocation: string;
  fileSize: number;
  checksum: string;
  verified: boolean;
  lastSync: string;
  syncStatus: 'active' | 'pending' | 'failed' | 'synced';
}

interface MirrorHealthReport {
  totalMirrors: number;
  activeMirrors: number;
  failedMirrors: number;
  lastSyncTime: string;
  storageUsed: number;
  integrityScore: number;
  syncLatency: number;
  recommendations: string[];
}

interface SyncResult {
  syncedCount: number;
  failedCount: number;
  errors: string[];
}

export function DataMirrorDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMirrorId, setSelectedMirrorId] = useState("");

  // Fetch mirror list
  const { data: mirrorsData, isLoading: mirrorsLoading } = useQuery<{success: boolean; data: MirrorManifest[]}>({
    queryKey: ["/api/data/mirror/list"],
  });

  // Fetch mirror health
  const { data: healthData } = useQuery<{success: boolean; data: MirrorHealthReport}>({
    queryKey: ["/api/data/mirror/health"],
  });

  // Create mirror mutation
  const createMirrorMutation = useMutation({
    mutationFn: async (dataTypes: string[]) => {
      const response = await fetch('/api/data/mirror/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ dataTypes })
      });
      if (!response.ok) throw new Error('Mirror creation failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Mirror Created Successfully!",
        description: `Mirror ID: ${data.data.mirrorId}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/data/mirror/list"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data/mirror/health"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Mirror Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Sync mirrors mutation
  const syncMirrorsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/data/mirror/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Mirror sync failed');
      return response.json();
    },
    onSuccess: (data) => {
      const result = data.data as SyncResult;
      toast({
        title: "Mirror Sync Completed!",
        description: `${result.syncedCount} synced, ${result.failedCount} failed`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/data/mirror/list"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data/mirror/health"] });
    }
  });

  // Restore mirror mutation
  const restoreMirrorMutation = useMutation({
    mutationFn: async (mirrorId: string) => {
      const response = await fetch('/api/data/mirror/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ mirrorId })
      });
      if (!response.ok) throw new Error('Mirror restore failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Restore Completed!",
        description: `Restored ${data.data.recordsRestored} records`,
      });
    }
  });

  // Setup mirroring mutation
  const setupMirroringMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/data/mirror/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Mirror setup failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Automated Mirroring Configured!",
        description: "Real-time data mirroring is now active",
      });
    }
  });

  // Delete mirror mutation
  const deleteMirrorMutation = useMutation({
    mutationFn: async (mirrorId: string) => {
      const response = await fetch(`/api/data/mirror/${mirrorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Mirror deletion failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mirror Deleted",
        description: "Mirror removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/data/mirror/list"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data/mirror/health"] });
    }
  });

  const handleCreateMirror = () => {
    createMirrorMutation.mutate(['all']);
  };

  const handleSyncMirrors = () => {
    syncMirrorsMutation.mutate();
  };

  const handleRestoreMirror = () => {
    if (selectedMirrorId) {
      restoreMirrorMutation.mutate(selectedMirrorId);
    }
  };

  const handleSetupMirroring = () => {
    setupMirroringMutation.mutate();
  };

  const handleDeleteMirror = (mirrorId: string) => {
    if (confirm(`Are you sure you want to delete mirror ${mirrorId}?`)) {
      deleteMirrorMutation.mutate(mirrorId);
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSyncStatusText = (status: string) => {
    switch (status) {
      case 'synced': return 'Synced';
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Copy className="h-8 w-8 text-blue-600" />
            Data Mirror Dashboard
          </h2>
          <p className="text-gray-600">
            Real-time data mirroring and backup management
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateMirror}
            disabled={createMirrorMutation.isPending}
            variant="outline"
          >
            <Copy className="h-4 w-4 mr-2" />
            {createMirrorMutation.isPending ? "Creating..." : "Create Mirror"}
          </Button>
          
          <Button 
            onClick={handleSyncMirrors}
            disabled={syncMirrorsMutation.isPending}
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {syncMirrorsMutation.isPending ? "Syncing..." : "Sync All"}
          </Button>
          
          <Button 
            onClick={handleSetupMirroring}
            disabled={setupMirroringMutation.isPending}
          >
            <Settings className="h-4 w-4 mr-2" />
            {setupMirroringMutation.isPending ? "Setting up..." : "Setup Auto-Mirror"}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {healthData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mirrors</CardTitle>
              <Copy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.data.totalMirrors}</div>
              <p className="text-xs text-muted-foreground">
                Across multiple locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mirror Integrity</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {healthData.data.integrityScore.toFixed(1)}%
              </div>
              <Progress value={healthData.data.integrityScore} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Mirrors</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {healthData.data.activeMirrors}
              </div>
              <p className="text-xs text-muted-foreground">
                of {healthData.data.totalMirrors} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(healthData.data.storageUsed / 1024 / 1024).toFixed(1)} MB
              </div>
              <p className="text-xs text-muted-foreground">
                Mirror storage
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="mirrors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mirrors">Mirrors</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="mirrors" className="space-y-4">
          {mirrorsData?.data && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Data Mirrors ({mirrorsData.data.length})</h3>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/data/mirror/list"] })}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="grid gap-4">
                {mirrorsData.data.map((mirror) => (
                  <Card key={mirror.mirrorId}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{mirror.mirrorId}</CardTitle>
                          <CardDescription>
                            Created: {new Date(mirror.timestamp).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`${getSyncStatusColor(mirror.syncStatus)} text-white`}
                          >
                            {getSyncStatusText(mirror.syncStatus)}
                          </Badge>
                          {mirror.verified ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Size:</span>
                          <p>{(mirror.fileSize / 1024).toFixed(1)} KB</p>
                        </div>
                        <div>
                          <span className="font-medium">Last Sync:</span>
                          <p>{new Date(mirror.lastSync).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>
                          <p className="truncate" title={mirror.mirrorLocation}>
                            {mirror.mirrorLocation.split('/').pop()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Checksum:</span>
                          <p className="truncate" title={mirror.checksum}>
                            {mirror.checksum.substring(0, 12)}...
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => {
                            setSelectedMirrorId(mirror.mirrorId);
                            handleRestoreMirror();
                          }}
                          disabled={restoreMirrorMutation.isPending || !mirror.verified}
                          variant="outline"
                          size="sm"
                        >
                          <Database className="h-4 w-4 mr-2" />
                          Restore
                        </Button>
                        
                        <Button
                          onClick={() => handleDeleteMirror(mirror.mirrorId)}
                          disabled={deleteMirrorMutation.isPending}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {mirrorsData.data.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Copy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Data Mirrors</h3>
                    <p className="text-gray-600 mb-4">Create your first data mirror to start protecting your data</p>
                    <Button onClick={handleCreateMirror} disabled={createMirrorMutation.isPending}>
                      <Copy className="h-4 w-4 mr-2" />
                      Create First Mirror
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          {healthData?.data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Mirror Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Active</span>
                        <span className="font-medium text-green-600">{healthData.data.activeMirrors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Failed</span>
                        <span className="font-medium text-red-600">{healthData.data.failedMirrors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total</span>
                        <span className="font-medium">{healthData.data.totalMirrors}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Sync Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Last Sync</span>
                        <span className="font-medium">
                          {new Date(healthData.data.lastSyncTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Latency</span>
                        <span className="font-medium">{healthData.data.syncLatency.toFixed(1)}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Integrity</span>
                        <span className="font-medium text-green-600">{healthData.data.integrityScore.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Storage Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {(healthData.data.storageUsed / 1024 / 1024).toFixed(1)} MB
                    </div>
                    <p className="text-sm text-gray-600">
                      Total mirror storage used
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Health Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {healthData.data.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="h-5 w-5" />
                  Create Mirror
                </CardTitle>
                <CardDescription>
                  Create a new mirror copy of your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => createMirrorMutation.mutate(['intelligence'])}
                      disabled={createMirrorMutation.isPending}
                      variant="outline"
                      size="sm"
                    >
                      Intelligence Only
                    </Button>
                    <Button 
                      onClick={() => createMirrorMutation.mutate(['users'])}
                      disabled={createMirrorMutation.isPending}
                      variant="outline"
                      size="sm"
                    >
                      Users Only
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleCreateMirror}
                    disabled={createMirrorMutation.isPending}
                    className="w-full"
                  >
                    {createMirrorMutation.isPending ? "Creating Complete Mirror..." : "Create Complete Mirror"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Mirror Synchronization
                </CardTitle>
                <CardDescription>
                  Sync all mirrors with latest data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Synchronize all existing mirrors to ensure they have the latest data and verify their integrity.
                  </div>
                  
                  <Button 
                    onClick={handleSyncMirrors}
                    disabled={syncMirrorsMutation.isPending}
                    className="w-full"
                  >
                    {syncMirrorsMutation.isPending ? "Synchronizing..." : "Sync All Mirrors"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Automated Mirroring
              </CardTitle>
              <CardDescription>
                Configure automatic mirror creation and synchronization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Frequency:</span>
                    <p>Daily automatic mirrors</p>
                  </div>
                  <div>
                    <span className="font-medium">Locations:</span>
                    <p>3 mirror locations</p>
                  </div>
                  <div>
                    <span className="font-medium">Retention:</span>
                    <p>30 days</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSetupMirroring}
                  disabled={setupMirroringMutation.isPending}
                  className="w-full"
                >
                  {setupMirroringMutation.isPending ? "Configuring..." : "Setup Automated Mirroring"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}