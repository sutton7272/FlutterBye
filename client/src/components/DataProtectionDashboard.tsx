import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Database, 
  HardDrive, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  DollarSign,
  Clock,
  FileCheck,
  Settings,
  CloudDownload
} from "lucide-react";

interface CapacityAnalysis {
  currentUsage: {
    addressIntelligence: number;
    userActivities: number;
    communicationLogs: number;
    marketingCampaigns: number;
    total: number;
  };
  projectedGrowth: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  capacityRecommendations: string[];
  scalingStrategy: string;
}

interface DataHealthReport {
  totalRecords: number;
  dataIntegrity: number;
  storageUsed: number;
  storageCapacity: number;
  lastBackup: string;
  criticalIssues: string[];
  recommendations: string[];
  costProjection: number;
}



interface ProtectionAudit {
  complianceScore: number;
  securityScore: number;
  issues: string[];
  recommendations: string[];
}

export function DataProtectionDashboard() {
  const { toast } = useToast();
  const [selectedBackupId, setSelectedBackupId] = useState("");

  // Fetch capacity analysis
  const { data: capacityData } = useQuery<{success: boolean; data: CapacityAnalysis}>({
    queryKey: ["/api/data/capacity/analysis"],
  });

  // Fetch health report
  const { data: healthData } = useQuery<{success: boolean; data: DataHealthReport}>({
    queryKey: ["/api/data/health/report"],
  });

  // Fetch protection audit
  const { data: auditData } = useQuery<{success: boolean; data: ProtectionAudit}>({
    queryKey: ["/api/data/protection/audit"],
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async (dataTypes: string[]) => {
      const response = await fetch('/api/data/backup/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ dataTypes })
      });
      if (!response.ok) throw new Error('Backup creation failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Backup Created Successfully!",
        description: `Backup ID: ${data.data.backupId}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Backup Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Restore backup mutation
  const restoreBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      const response = await fetch('/api/data/backup/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ backupId })
      });
      if (!response.ok) throw new Error('Backup restore failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Restore Completed!",
        description: `Restored ${data.data.recordsRestored} records`,
      });
    }
  });

  // Setup protection mutation
  const setupProtectionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/data/protection/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Protection setup failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Automated Protection Configured!",
        description: "Daily backups and monitoring are now active",
      });
    }
  });

  const handleCreateBackup = () => {
    createBackupMutation.mutate(['all']);
  };

  const handleRestoreBackup = () => {
    if (selectedBackupId) {
      restoreBackupMutation.mutate(selectedBackupId);
    }
  };

  const handleSetupProtection = () => {
    setupProtectionMutation.mutate();
  };

  const getHealthColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 85) return "text-yellow-600";
    return "text-red-600";
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Data Protection Dashboard
          </h2>
          <p className="text-gray-600">
            Storage capacity, backup management, and data security
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateBackup}
            disabled={createBackupMutation.isPending}
            variant="outline"
          >
            <Save className="h-4 w-4 mr-2" />
            {createBackupMutation.isPending ? "Creating..." : "Create Backup"}
          </Button>
          
          <Button 
            onClick={handleSetupProtection}
            disabled={setupProtectionMutation.isPending}
          >
            <Settings className="h-4 w-4 mr-2" />
            {setupProtectionMutation.isPending ? "Setting up..." : "Setup Protection"}
          </Button>
        </div>
      </div>

      {/* Critical Issues Alert */}
      {healthData?.data?.criticalIssues && healthData.data.criticalIssues.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Data Protection Issues</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1">
              {healthData.data.criticalIssues.map((issue, index) => (
                <li key={index}>• {issue}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Integrity</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(healthData?.data?.dataIntegrity || 0)}`}>
              {healthData?.data?.dataIntegrity?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Data quality and consistency
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
              {healthData?.data?.storageUsed || 0} MB
            </div>
            <div className="mt-2">
              <Progress 
                value={((healthData?.data?.storageUsed || 0) / (healthData?.data?.storageCapacity || 1000)) * 100}
                className="h-2"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {healthData?.data?.storageCapacity || 1000} MB capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthData?.data?.totalRecords?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all intelligence tables
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${healthData?.data?.costProjection?.toFixed(2) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Projected storage costs
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="capacity" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="capacity" className="space-y-4">
          {capacityData?.data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5" />
                      Current Storage Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(capacityData.data.currentUsage).map(([type, size]) => (
                        type !== 'total' && (
                          <div key={type} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm capitalize">
                                {type.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-sm font-medium">{size.toFixed(2)} MB</span>
                            </div>
                            <Progress 
                              value={(size / capacityData.data.currentUsage.total) * 100} 
                              className="h-2" 
                            />
                          </div>
                        )
                      ))}
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between font-medium">
                          <span>Total Usage</span>
                          <span>{capacityData.data.currentUsage.total.toFixed(2)} MB</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Growth Projections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Daily Growth</span>
                        <span className="font-medium">{capacityData.data.projectedGrowth.daily.toFixed(2)} MB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Monthly Growth</span>
                        <span className="font-medium">{capacityData.data.projectedGrowth.monthly.toFixed(2)} MB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Yearly Growth</span>
                        <span className="font-medium text-lg">{(capacityData.data.projectedGrowth.yearly / 1000).toFixed(2)} GB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Scaling Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Recommended Strategy</h4>
                      <p className="text-sm text-blue-700 mt-1">{capacityData.data.scalingStrategy}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Capacity Recommendations</h4>
                      <ul className="space-y-1">
                        {capacityData.data.capacityRecommendations.map((rec, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Create New Backup
                </CardTitle>
                <CardDescription>
                  Create a full backup of all address intelligence data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => createBackupMutation.mutate(['addresses'])}
                      disabled={createBackupMutation.isPending}
                      variant="outline"
                      size="sm"
                    >
                      Address Data Only
                    </Button>
                    <Button 
                      onClick={() => createBackupMutation.mutate(['activities'])}
                      disabled={createBackupMutation.isPending}
                      variant="outline"
                      size="sm"
                    >
                      Activities Only
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleCreateBackup}
                    disabled={createBackupMutation.isPending}
                    className="w-full"
                  >
                    {createBackupMutation.isPending ? "Creating Full Backup..." : "Create Full Backup"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudDownload className="h-5 w-5" />
                  Restore from Backup
                </CardTitle>
                <CardDescription>
                  Restore data from a previous backup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter backup ID..."
                    value={selectedBackupId}
                    onChange={(e) => setSelectedBackupId(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  
                  <Button 
                    onClick={handleRestoreBackup}
                    disabled={!selectedBackupId || restoreBackupMutation.isPending}
                    className="w-full"
                    variant="outline"
                  >
                    {restoreBackupMutation.isPending ? "Restoring..." : "Restore Backup"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {healthData?.data && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Backup Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Backup</span>
                    <span className="font-medium">
                      {new Date(healthData.data.lastBackup).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Frequency</span>
                    <Badge variant="outline">Daily</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Retention Period</span>
                    <span className="font-medium">90 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          {healthData?.data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Data Integrity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${getHealthColor(healthData.data.dataIntegrity)}`}>
                      {healthData.data.dataIntegrity.toFixed(1)}%
                    </div>
                    <Progress 
                      value={healthData.data.dataIntegrity} 
                      className="mt-2"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Storage Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {Math.round((healthData.data.storageUsed / healthData.data.storageCapacity) * 100)}%
                    </div>
                    <Progress 
                      value={(healthData.data.storageUsed / healthData.data.storageCapacity) * 100}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Used</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">98.2%</div>
                    <Progress value={98.2} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">Operational</p>
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

        <TabsContent value="security" className="space-y-4">
          {auditData?.data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Compliance Score</span>
                          <span className={`font-bold ${getHealthColor(auditData.data.complianceScore)}`}>
                            {auditData.data.complianceScore}%
                          </span>
                        </div>
                        <Progress value={auditData.data.complianceScore} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Security Score</span>
                          <span className={`font-bold ${getHealthColor(auditData.data.securityScore)}`}>
                            {auditData.data.securityScore}%
                          </span>
                        </div>
                        <Progress value={auditData.data.securityScore} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Protection Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Encryption</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Automated Backups</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Geographic Backup</span>
                        <Badge variant="outline">Recommended</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Access Controls</span>
                        <Badge variant="default">Configured</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {auditData.data.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-600">
                      <AlertTriangle className="h-5 w-5" />
                      Security Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {auditData.data.issues.map((issue, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Security Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {auditData.data.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}