import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building,
  Palette,
  Shield,
  Key,
  Users,
  Settings,
  Globe,
  Lock,
  BarChart3,
  Zap,
  CheckCircle,
  AlertTriangle,
  Copy,
  Download
} from "lucide-react";

export default function EnterpriseDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [whiteLabelConfig, setWhiteLabelConfig] = useState({
    clientId: '',
    brandName: '',
    logoUrl: '',
    primaryColor: '#7c3aed',
    secondaryColor: '#06b6d4',
    customDomain: '',
    features: []
  });

  const [permissionConfig, setPermissionConfig] = useState({
    clientId: '',
    userId: '',
    role: 'analyst',
    customPermissions: {},
    dataAccessLimits: {}
  });

  const [complianceConfig, setComplianceConfig] = useState({
    clientId: '',
    requirements: []
  });

  const [apiConfig, setApiConfig] = useState({
    clientId: '',
    tierLimits: {
      requestsPerMinute: 1000,
      requestsPerMonth: 100000,
      walletsPerAnalysis: 10000
    }
  });

  // White-label solution creation
  const createWhiteLabelMutation = useMutation({
    mutationFn: async (config: any) => {
      return await apiRequest('POST', '/api/flutterai/enterprise/white-label/create', config);
    },
    onSuccess: (data) => {
      toast({
        title: "White-label Solution Created",
        description: `Successfully created white-label solution for ${whiteLabelConfig.brandName}`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterai/enterprise'] });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create white-label solution",
        variant: "destructive",
      });
    },
  });

  // Enterprise permissions management
  const managePermissionsMutation = useMutation({
    mutationFn: async (config: any) => {
      return await apiRequest('POST', '/api/flutterai/enterprise/permissions/manage', config);
    },
    onSuccess: (data) => {
      toast({
        title: "Permissions Updated",
        description: "Enterprise permissions configured successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Permission Update Failed",
        description: error.message || "Failed to update permissions",
        variant: "destructive",
      });
    },
  });

  // Compliance framework setup
  const setupComplianceMutation = useMutation({
    mutationFn: async (config: any) => {
      return await apiRequest('POST', '/api/flutterai/enterprise/compliance/setup', config);
    },
    onSuccess: (data) => {
      toast({
        title: "Compliance Framework Setup",
        description: "Compliance framework configured successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to setup compliance framework",
        variant: "destructive",
      });
    },
  });

  // API management setup
  const setupAPIMutation = useMutation({
    mutationFn: async (config: any) => {
      return await apiRequest('POST', '/api/flutterai/enterprise/api-management/setup', config);
    },
    onSuccess: (data) => {
      toast({
        title: "API Management Setup",
        description: "API management configured successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to setup API management",
        variant: "destructive",
      });
    },
  });

  const handleCreateWhiteLabel = () => {
    if (!whiteLabelConfig.clientId || !whiteLabelConfig.brandName) {
      toast({
        title: "Missing Information",
        description: "Please provide client ID and brand name",
        variant: "destructive",
      });
      return;
    }
    createWhiteLabelMutation.mutate(whiteLabelConfig);
  };

  const handleManagePermissions = () => {
    if (!permissionConfig.clientId || !permissionConfig.userId) {
      toast({
        title: "Missing Information",
        description: "Please provide client ID and user ID",
        variant: "destructive",
      });
      return;
    }
    managePermissionsMutation.mutate(permissionConfig);
  };

  const handleSetupCompliance = () => {
    if (!complianceConfig.clientId || complianceConfig.requirements.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide client ID and compliance requirements",
        variant: "destructive",
      });
      return;
    }
    setupComplianceMutation.mutate(complianceConfig);
  };

  const handleSetupAPI = () => {
    if (!apiConfig.clientId) {
      toast({
        title: "Missing Information",
        description: "Please provide client ID",
        variant: "destructive",
      });
      return;
    }
    setupAPIMutation.mutate(apiConfig);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Information copied successfully",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Enterprise Dashboard</h2>
          <p className="text-slate-400">Manage enterprise features, white-label solutions, and client configurations</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/20">
          <Building className="h-4 w-4 mr-2" />
          Enterprise Mode
        </Badge>
      </div>

      {/* Enterprise Features Tabs */}
      <Tabs defaultValue="white-label" className="space-y-6">
        <TabsList className="grid grid-cols-5 bg-slate-700/50 border border-purple-500/20">
          <TabsTrigger value="white-label" className="data-[state=active]:bg-purple-500/20">
            <Palette className="h-4 w-4 mr-2" />
            White-label
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-purple-500/20">
            <Users className="h-4 w-4 mr-2" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-purple-500/20">
            <Shield className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-purple-500/20">
            <Key className="h-4 w-4 mr-2" />
            API Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* White-label Solution Tab */}
        <TabsContent value="white-label" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-400" />
                White-label Solution Configuration
              </CardTitle>
              <CardDescription className="text-slate-400">
                Create custom-branded FlutterAI solutions for enterprise clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientId" className="text-white">Client ID</Label>
                    <Input
                      id="clientId"
                      value={whiteLabelConfig.clientId}
                      onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, clientId: e.target.value})}
                      placeholder="enterprise-client-001"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="brandName" className="text-white">Brand Name</Label>
                    <Input
                      id="brandName"
                      value={whiteLabelConfig.brandName}
                      onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, brandName: e.target.value})}
                      placeholder="Acme Intelligence Platform"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="logoUrl" className="text-white">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={whiteLabelConfig.logoUrl}
                      onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, logoUrl: e.target.value})}
                      placeholder="https://example.com/logo.png"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customDomain" className="text-white">Custom Domain (Optional)</Label>
                    <Input
                      id="customDomain"
                      value={whiteLabelConfig.customDomain}
                      onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, customDomain: e.target.value})}
                      placeholder="intelligence.acme.com"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primaryColor" className="text-white">Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={whiteLabelConfig.primaryColor}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, primaryColor: e.target.value})}
                        className="w-16 h-10 bg-slate-600 border-slate-500"
                      />
                      <Input
                        value={whiteLabelConfig.primaryColor}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, primaryColor: e.target.value})}
                        className="bg-slate-600 border-slate-500 text-white"
                        placeholder="#7c3aed"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryColor" className="text-white">Secondary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={whiteLabelConfig.secondaryColor}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, secondaryColor: e.target.value})}
                        className="w-16 h-10 bg-slate-600 border-slate-500"
                      />
                      <Input
                        value={whiteLabelConfig.secondaryColor}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, secondaryColor: e.target.value})}
                        className="bg-slate-600 border-slate-500 text-white"
                        placeholder="#06b6d4"
                      />
                    </div>
                  </div>
                  
                  {/* Color Preview */}
                  <div className="p-4 rounded-lg border border-slate-500" 
                       style={{ 
                         background: `linear-gradient(135deg, ${whiteLabelConfig.primaryColor}, ${whiteLabelConfig.secondaryColor})` 
                       }}>
                    <div className="text-white font-medium">{whiteLabelConfig.brandName || 'Brand Preview'}</div>
                    <div className="text-white/80 text-sm">Intelligence Platform</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleCreateWhiteLabel}
                  disabled={createWhiteLabelMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {createWhiteLabelMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Create White-label Solution
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-slate-500 text-slate-300 hover:bg-slate-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Management Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Enterprise Permissions Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure role-based access control and data access limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="permClientId" className="text-white">Client ID</Label>
                    <Input
                      id="permClientId"
                      value={permissionConfig.clientId}
                      onChange={(e) => setPermissionConfig({...permissionConfig, clientId: e.target.value})}
                      placeholder="enterprise-client-001"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="userId" className="text-white">User ID</Label>
                    <Input
                      id="userId"
                      value={permissionConfig.userId}
                      onChange={(e) => setPermissionConfig({...permissionConfig, userId: e.target.value})}
                      placeholder="user@enterprise.com"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role" className="text-white">Role</Label>
                    <Select 
                      value={permissionConfig.role}
                      onValueChange={(value) => setPermissionConfig({...permissionConfig, role: value})}
                    >
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-600 border-slate-500">
                        <SelectItem value="admin">Admin - Full access</SelectItem>
                        <SelectItem value="analyst">Analyst - Analysis & Reports</SelectItem>
                        <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                        <SelectItem value="api_user">API User - API access only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-white font-medium mb-3">Permission Settings</div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Wallet Analysis</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Group Analysis</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Export Data</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Manage Users</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">API Access</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Real-time Data</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleManagePermissions}
                disabled={managePermissionsMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {managePermissionsMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Update Permissions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Framework Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                Compliance Framework Setup
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure compliance requirements for enterprise clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="complianceClientId" className="text-white">Client ID</Label>
                    <Input
                      id="complianceClientId"
                      value={complianceConfig.clientId}
                      onChange={(e) => setComplianceConfig({...complianceConfig, clientId: e.target.value})}
                      placeholder="enterprise-client-001"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div className="text-white font-medium mb-3">Compliance Requirements</div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">GDPR</div>
                        <div className="text-xs text-slate-400">EU General Data Protection Regulation</div>
                      </div>
                      <Switch 
                        onCheckedChange={(checked) => {
                          const reqs = complianceConfig.requirements;
                          if (checked) {
                            setComplianceConfig({...complianceConfig, requirements: [...reqs, 'gdpr']});
                          } else {
                            setComplianceConfig({...complianceConfig, requirements: reqs.filter(r => r !== 'gdpr')});
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">SOC 2</div>
                        <div className="text-xs text-slate-400">Service Organization Control 2</div>
                      </div>
                      <Switch 
                        onCheckedChange={(checked) => {
                          const reqs = complianceConfig.requirements;
                          if (checked) {
                            setComplianceConfig({...complianceConfig, requirements: [...reqs, 'soc2']});
                          } else {
                            setComplianceConfig({...complianceConfig, requirements: reqs.filter(r => r !== 'soc2')});
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">CCPA</div>
                        <div className="text-xs text-slate-400">California Consumer Privacy Act</div>
                      </div>
                      <Switch 
                        onCheckedChange={(checked) => {
                          const reqs = complianceConfig.requirements;
                          if (checked) {
                            setComplianceConfig({...complianceConfig, requirements: [...reqs, 'ccpa']});
                          } else {
                            setComplianceConfig({...complianceConfig, requirements: reqs.filter(r => r !== 'ccpa')});
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">AML</div>
                        <div className="text-xs text-slate-400">Anti-Money Laundering</div>
                      </div>
                      <Switch 
                        onCheckedChange={(checked) => {
                          const reqs = complianceConfig.requirements;
                          if (checked) {
                            setComplianceConfig({...complianceConfig, requirements: [...reqs, 'aml']});
                          } else {
                            setComplianceConfig({...complianceConfig, requirements: reqs.filter(r => r !== 'aml')});
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-white font-medium mb-3">Audit Settings</div>
                  
                  <div className="p-4 bg-slate-600/30 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Real-time Monitoring</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Audit Trail</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Data Encryption</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Incident Response</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white">Log Retention (Days)</Label>
                    <Input
                      type="number"
                      defaultValue="2555"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSetupCompliance}
                disabled={setupComplianceMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {setupComplianceMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Setup Compliance Framework
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Management Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-yellow-400" />
                Enterprise API Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure API access, rate limits, and usage monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiClientId" className="text-white">Client ID</Label>
                    <Input
                      id="apiClientId"
                      value={apiConfig.clientId}
                      onChange={(e) => setApiConfig({...apiConfig, clientId: e.target.value})}
                      placeholder="enterprise-client-001"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Rate Limits</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-slate-300">Requests per Minute</Label>
                        <Input
                          type="number"
                          value={apiConfig.tierLimits.requestsPerMinute}
                          onChange={(e) => setApiConfig({
                            ...apiConfig, 
                            tierLimits: {...apiConfig.tierLimits, requestsPerMinute: parseInt(e.target.value)}
                          })}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-slate-300">Monthly Quota</Label>
                        <Input
                          type="number"
                          value={apiConfig.tierLimits.requestsPerMonth}
                          onChange={(e) => setApiConfig({
                            ...apiConfig, 
                            tierLimits: {...apiConfig.tierLimits, requestsPerMonth: parseInt(e.target.value)}
                          })}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-slate-300">Wallets per Analysis</Label>
                        <Input
                          type="number"
                          value={apiConfig.tierLimits.walletsPerAnalysis}
                          onChange={(e) => setApiConfig({
                            ...apiConfig, 
                            tierLimits: {...apiConfig.tierLimits, walletsPerAnalysis: parseInt(e.target.value)}
                          })}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-white font-medium mb-3">API Key Preview</div>
                  
                  <div className="p-4 bg-slate-600/30 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Primary Key</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard('flai_ent_abc123xyz789...')}
                        className="text-purple-300 hover:bg-purple-500/10"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="font-mono text-xs text-slate-400 bg-slate-700/50 p-2 rounded break-all">
                      flai_ent_abc123xyz789...
                    </div>
                  </div>
                  
                  <div className="text-white font-medium mb-3">Available Endpoints</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className="bg-green-500/20 text-green-300">GET</Badge>
                      <span className="text-slate-300">/api/enterprise/wallet-analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className="bg-blue-500/20 text-blue-300">POST</Badge>
                      <span className="text-slate-300">/api/enterprise/group-analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className="bg-purple-500/20 text-purple-300">GET</Badge>
                      <span className="text-slate-300">/api/enterprise/real-time-intelligence</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className="bg-yellow-500/20 text-yellow-300">POST</Badge>
                      <span className="text-slate-300">/api/enterprise/custom-reports</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSetupAPI}
                disabled={setupAPIMutation.isPending}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {setupAPIMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Setup API Management
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enterprise Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Enterprise Analytics Overview
              </CardTitle>
              <CardDescription className="text-slate-400">
                Monitor enterprise client usage, performance, and business metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300">15</div>
                  <div className="text-sm text-slate-400">Active Enterprise Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-300">98.7%</div>
                  <div className="text-sm text-slate-400">System Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-300">1.2M</div>
                  <div className="text-sm text-slate-400">API Calls This Month</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-slate-600/30 rounded-lg">
                <div className="text-white font-medium mb-3">Recent Enterprise Activity</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-slate-300">White-label solution deployed for Acme Corp</span>
                    </div>
                    <span className="text-xs text-slate-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-slate-300">API rate limit reached for TechStart Inc</span>
                    </div>
                    <span className="text-xs text-slate-400">5 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-slate-300">Compliance audit completed for BigBank Ltd</span>
                    </div>
                    <span className="text-xs text-slate-400">1 day ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}