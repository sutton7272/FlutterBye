import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  MessageSquare, 
  Bot, 
  Settings, 
  Users, 
  Activity, 
  Brain, 
  Zap, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Clock,
  Globe,
  Sparkles,
  Target,
  Heart,
  Star,
  TrendingUp,
  Pause,
  Play,
  RefreshCw,
  Database,
  Download,
  Upload,
  Trash2
} from "lucide-react";

interface FlutterinaStats {
  totalConversations: number;
  activeUsers: number;
  totalTokensUsed: number;
  averageResponseTime: number;
  userSatisfactionRating: number;
  personalityLearningEvents: number;
  recommendationClicks: number;
  dailyActiveUsers: number;
  tokensPerUser: number;
  emergencyStops: number;
}

interface FlutterinaSettings {
  enabled: boolean;
  maxTokensPerUser: number;
  maxTokensGlobal: number;
  responseTimeout: number;
  personalityLearningEnabled: boolean;
  recommendationsEnabled: boolean;
  emergencyStopEnabled: boolean;
  allowedPages: string[];
  restrictedFeatures: string[];
}

export function FlutterinaAdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch Flutterina statistics
  const { data: stats, isLoading: statsLoading } = useQuery<FlutterinaStats>({
    queryKey: ['/api/flutterina/admin/stats'],
    retry: false
  });

  // Fetch Flutterina settings
  const { data: settings, isLoading: settingsLoading } = useQuery<FlutterinaSettings>({
    queryKey: ['/api/flutterina/admin/settings'],
    retry: false
  });

  // Fetch user conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery<any[]>({
    queryKey: ['/api/flutterina/admin/conversations'],
    retry: false
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<FlutterinaSettings>) => {
      return await apiRequest('PUT', '/api/flutterina/admin/settings', newSettings);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Flutterina configuration has been updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterina/admin/settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterina/admin/stats'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  // Emergency stop mutation
  const emergencyStopMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/flutterina/admin/emergency-stop');
    },
    onSuccess: () => {
      toast({
        title: "Emergency Stop Activated",
        description: "Flutterina has been temporarily disabled for all users",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterina/admin/settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterina/admin/stats'] });
    },
  });

  // Reset usage mutation
  const resetUsageMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/flutterina/admin/reset-usage');
    },
    onSuccess: () => {
      toast({
        title: "Usage Reset",
        description: "All user token usage has been reset to zero",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/flutterina/admin/stats'] });
    },
  });

  const handleSettingChange = (key: keyof FlutterinaSettings, value: any) => {
    updateSettingsMutation.mutate({ [key]: value });
  };

  if (statsLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-pink-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-pink-600 rounded-xl">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Flutterina AI Management
          </h2>
        </div>
        <p className="text-pink-200 text-lg max-w-3xl mx-auto">
          Manage the revolutionary floating AI chatbox system with advanced personalization and intelligent product recommendations.
        </p>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-pink-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-200">Active Users</CardTitle>
              <Users className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeUsers || 0}</div>
              <div className="text-xs text-pink-300">Daily active users: {stats.dailyActiveUsers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-pink-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-200">Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalConversations || 0}</div>
              <div className="text-xs text-pink-300">Total interactions</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-pink-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-200">Token Usage</CardTitle>
              <Zap className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{(stats.totalTokensUsed || 0).toLocaleString()}</div>
              <div className="text-xs text-pink-300">Avg per user: {stats.tokensPerUser || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-pink-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-200">Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.userSatisfactionRating || 0}/5</div>
              <div className="text-xs text-pink-300">User rating</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-pink-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="emergency" className="data-[state=active]:bg-red-600">
            <Shield className="h-4 w-4 mr-2" />
            Emergency Controls
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Performance Metrics */}
            <Card className="bg-slate-800/50 border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-pink-400" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-pink-200">Response Time</span>
                        <Badge className="bg-green-600">{stats.averageResponseTime || 0}ms</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-pink-200">Learning Events</span>
                        <Badge className="bg-blue-600">{stats.personalityLearningEvents || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-pink-200">Recommendation Clicks</span>
                        <Badge className="bg-purple-600">{stats.recommendationClicks || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-pink-200">Emergency Stops</span>
                        <Badge className="bg-red-600">{stats.emergencyStops || 0}</Badge>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-slate-800/50 border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-pink-200">Flutterina Enabled</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${settings.enabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className={`text-sm ${settings.enabled ? 'text-green-400' : 'text-red-400'}`}>
                          {settings.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-pink-200">Personality Learning</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${settings.personalityLearningEnabled ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className={`text-sm ${settings.personalityLearningEnabled ? 'text-blue-400' : 'text-gray-400'}`}>
                          {settings.personalityLearningEnabled ? 'Learning' : 'Static'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-pink-200">Recommendations</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${settings.recommendationsEnabled ? 'bg-purple-500 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className={`text-sm ${settings.recommendationsEnabled ? 'text-purple-400' : 'text-gray-400'}`}>
                          {settings.recommendationsEnabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-pink-200">Emergency Protection</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${settings.emergencyStopEnabled ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className={`text-sm ${settings.emergencyStopEnabled ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {settings.emergencyStopEnabled ? 'Armed' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Usage Limits Management */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  Usage Limits Management
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Control AI token consumption and prevent cost overruns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enabled" className="text-purple-200">Enable Flutterina System</Label>
                      <Switch
                        id="enabled"
                        checked={settings.enabled}
                        onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
                      />
                    </div>
                    
                    <Alert className="bg-blue-900/20 border-blue-500/30">
                      <DollarSign className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-blue-200">
                        Current usage: {stats?.totalTokensUsed || 0} tokens today
                        <br />
                        Estimated cost: ${((stats?.totalTokensUsed || 0) * 0.00003).toFixed(2)}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxTokensPerUser" className="text-purple-200 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Daily Token Limit Per User
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="maxTokensPerUser"
                          type="number"
                          min="100"
                          max="50000"
                          step="100"
                          value={settings.maxTokensPerUser}
                          onChange={(e) => handleSettingChange('maxTokensPerUser', parseInt(e.target.value))}
                          className="bg-slate-700 border-purple-500/30 text-white"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSettingChange('maxTokensPerUser', 5000)}
                          className="whitespace-nowrap border-purple-500/30 text-purple-300"
                        >
                          Set to 5K
                        </Button>
                      </div>
                      <div className="text-xs text-purple-300">
                        Recommended: 5,000-10,000 for regular users, 20,000+ for enterprise
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxTokensGlobal" className="text-purple-200 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Daily Global Token Limit
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="maxTokensGlobal"
                          type="number"
                          min="1000"
                          max="1000000"
                          step="1000"
                          value={settings.maxTokensGlobal}
                          onChange={(e) => handleSettingChange('maxTokensGlobal', parseInt(e.target.value))}
                          className="bg-slate-700 border-purple-500/30 text-white"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSettingChange('maxTokensGlobal', 100000)}
                          className="whitespace-nowrap border-purple-500/30 text-purple-300"
                        >
                          Set to 100K
                        </Button>
                      </div>
                      <div className="text-xs text-purple-300">
                        Safety limit to prevent excessive costs. Current usage: {((stats?.totalTokensUsed || 0) / (settings.maxTokensGlobal || 1) * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="responseTimeout" className="text-purple-200 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Response Timeout (seconds)
                      </Label>
                      <Select 
                        value={settings.responseTimeout?.toString()} 
                        onValueChange={(value) => handleSettingChange('responseTimeout', parseInt(value))}
                      >
                        <SelectTrigger className="bg-slate-700 border-purple-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 seconds (Fast)</SelectItem>
                          <SelectItem value="30">30 seconds (Standard)</SelectItem>
                          <SelectItem value="60">60 seconds (Extended)</SelectItem>
                          <SelectItem value="120">120 seconds (Maximum)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-purple-500/20">
                      <div className="text-sm font-medium text-purple-200 mb-3">Quick Actions</div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleSettingChange('maxTokensPerUser', 1000);
                            handleSettingChange('maxTokensGlobal', 10000);
                          }}
                          className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-600/20"
                        >
                          Conservative
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleSettingChange('maxTokensPerUser', 10000);
                            handleSettingChange('maxTokensGlobal', 100000);
                          }}
                          className="border-green-500/30 text-green-300 hover:bg-green-600/20"
                        >
                          Standard
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleSettingChange('maxTokensPerUser', 25000);
                            handleSettingChange('maxTokensGlobal', 500000);
                          }}
                          className="border-blue-500/30 text-blue-300 hover:bg-blue-600/20"
                        >
                          Enterprise
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetUsageMutation.mutate()}
                          disabled={resetUsageMutation.isPending}
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
                        >
                          {resetUsageMutation.isPending ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            'Reset Usage'
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Real-Time Usage Monitor */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Real-Time Usage Monitor
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Live tracking of token consumption and cost estimates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings && stats && (
                  <>
                    {/* Current Usage Progress Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-purple-200">Per-User Limit Progress</span>
                          <Badge variant="secondary" className="bg-purple-600">
                            {stats.tokensPerUser} / {settings.maxTokensPerUser}
                          </Badge>
                        </div>
                        <Progress 
                          value={(stats.tokensPerUser / settings.maxTokensPerUser) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-purple-300 mt-1">
                          Average usage per active user
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-purple-200">Global Daily Limit</span>
                          <Badge variant={stats.totalTokensUsed > settings.maxTokensGlobal * 0.8 ? "destructive" : "secondary"} className="bg-blue-600">
                            {stats.totalTokensUsed} / {settings.maxTokensGlobal}
                          </Badge>
                        </div>
                        <Progress 
                          value={(stats.totalTokensUsed / settings.maxTokensGlobal) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-purple-300 mt-1">
                          {((stats.totalTokensUsed / settings.maxTokensGlobal) * 100).toFixed(1)}% of daily global limit used
                        </div>
                      </div>
                    </div>

                    {/* Cost Analysis */}
                    <div className="bg-slate-700/50 p-4 rounded-lg border border-purple-500/20">
                      <div className="text-sm font-medium text-purple-200 mb-3">Cost Analysis</div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-purple-300">Today's Cost</div>
                          <div className="text-white font-bold">
                            ${((stats.totalTokensUsed || 0) * 0.00003).toFixed(3)}
                          </div>
                        </div>
                        <div>
                          <div className="text-purple-300">Monthly Est.</div>
                          <div className="text-white font-bold">
                            ${(((stats.totalTokensUsed || 0) * 0.00003) * 30).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-purple-300">Active Users</div>
                          <div className="text-white font-bold">{stats.activeUsers}</div>
                        </div>
                        <div>
                          <div className="text-purple-300">Avg/User</div>
                          <div className="text-white font-bold">
                            ${stats.activeUsers > 0 ? (((stats.totalTokensUsed || 0) * 0.00003) / stats.activeUsers).toFixed(4) : '0.0000'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Usage Warnings */}
                    {stats.totalTokensUsed > settings.maxTokensGlobal * 0.8 && (
                      <Alert className="bg-yellow-900/20 border-yellow-500/30">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <AlertDescription className="text-yellow-200">
                          Warning: Daily token usage is above 80% of global limit
                        </AlertDescription>
                      </Alert>
                    )}

                    {stats.totalTokensUsed > settings.maxTokensGlobal * 0.95 && (
                      <Alert className="bg-red-900/20 border-red-500/30">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-200">
                          Critical: Daily token usage is above 95% of global limit
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* AI Features Controls */}
                    <div className="pt-4 border-t border-purple-500/20">
                      <div className="text-sm font-medium text-purple-200 mb-3">AI Features</div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="personalityLearning" className="text-purple-200 text-sm">Personality Learning</Label>
                          <Switch
                            id="personalityLearning"
                            checked={settings.personalityLearningEnabled}
                            onCheckedChange={(checked) => handleSettingChange('personalityLearningEnabled', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="recommendations" className="text-purple-200 text-sm">Product Recommendations</Label>
                          <Switch
                            id="recommendations"
                            checked={settings.recommendationsEnabled}
                            onCheckedChange={(checked) => handleSettingChange('recommendationsEnabled', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emergencyStop" className="text-purple-200 text-sm">Emergency Protection</Label>
                          <Switch
                            id="emergencyStop"
                            checked={settings.emergencyStopEnabled}
                            onCheckedChange={(checked) => handleSettingChange('emergencyStopEnabled', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Active User Sessions
              </CardTitle>
              <CardDescription className="text-blue-200">
                Monitor user interactions and conversation history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conversationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
                </div>
              ) : conversations && conversations.length > 0 ? (
                <div className="space-y-4">
                  {conversations.slice(0, 10).map((conversation: any, index: number) => (
                    <div key={index} className="bg-slate-700/50 p-4 rounded-lg border border-blue-500/20">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-white font-medium">
                            {conversation.walletAddress?.slice(0, 8)}...{conversation.walletAddress?.slice(-4)}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-blue-600 text-xs">
                          {conversation.messageCount} messages
                        </Badge>
                      </div>
                      <div className="text-sm text-blue-200">
                        Last active: {new Date(conversation.lastActivity).toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-200 mt-1">
                        Tokens used: {conversation.tokensUsed || 0}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-blue-300">
                  No active conversations found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Controls Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <Alert className="bg-red-900/20 border-red-500/30">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              Emergency controls should only be used in critical situations. These actions affect all users immediately.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Emergency Actions */}
            <Card className="bg-slate-800/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-400" />
                  Emergency Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => emergencyStopMutation.mutate()}
                  disabled={emergencyStopMutation.isPending}
                  variant="destructive"
                  className="w-full"
                >
                  {emergencyStopMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Pause className="h-4 w-4 mr-2" />
                  )}
                  Emergency Stop All AI
                </Button>
                
                <Button
                  onClick={() => resetUsageMutation.mutate()}
                  disabled={resetUsageMutation.isPending}
                  variant="outline"
                  className="w-full border-orange-500 text-orange-300 hover:bg-orange-600"
                >
                  {resetUsageMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Reset All Usage Limits
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-slate-800/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-400" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-red-200">Emergency Stops Today</span>
                      <Badge className="bg-red-600">{stats.emergencyStops || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-200">System Load</span>
                      <Badge className="bg-yellow-600">Normal</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-200">Token Usage</span>
                      <Badge className="bg-blue-600">
                        {Math.round(((stats.totalTokensUsed || 0) / (settings?.maxTokensGlobal || 100000)) * 100)}%
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}