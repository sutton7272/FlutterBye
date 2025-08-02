import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Settings, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Brain,
  Lightbulb,
  Zap,
  Eye,
  Bell,
  Palette,
  Grid,
  List,
  BarChart3
} from "lucide-react";

interface UserPreferences {
  theme: string;
  defaultCurrency: string;
  notifications: {
    [key: string]: boolean;
    email: boolean;
    push: boolean;
    transactionUpdates: boolean;
    marketingUpdates: boolean;
    communityUpdates: boolean;
  };
  dashboard: {
    layout: string;
    widgets: string[];
    chartType: string;
  };
  trading: {
    defaultQuantity: number;
    riskLevel: string;
    autoRebalance: boolean;
  };
  privacy: {
    showPortfolio: boolean;
    shareActivity: boolean;
    allowAnalytics: boolean;
  };
}

interface PersonalizationProfile {
  userId: string;
  preferences: UserPreferences;
  behavior: {
    totalSessions: number;
    preferredFeatures: string[];
    tradingPattern: string;
    engagementLevel: string;
    userSegment: string;
  };
  recommendations: string[];
  insights: string[];
  riskScore: number;
}

export function PersonalizedDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();

  // Fetch user personalization profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/personalization/profile"],
    retry: false,
  });

  // Update preferences mutation
  const updatePreferences = useMutation({
    mutationFn: async (preferences: Partial<UserPreferences>) => {
      return apiRequest("/api/personalization/preferences", "PUT", preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personalization/profile"] });
    },
  });

  // Track behavior mutation
  const trackBehavior = useMutation({
    mutationFn: async (action: string) => {
      return apiRequest("/api/personalization/track", "POST", { action });
    },
  });

  const handlePreferenceChange = (key: string, value: any) => {
    if (!profile) return;
    
    const newPreferences = { ...profile.preferences };
    const keys = key.split('.');
    let current = newPreferences;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    updatePreferences.mutate(newPreferences);
  };

  const handleActionClick = (action: string) => {
    trackBehavior.mutate(action);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold mb-2">Personalization Not Available</h3>
            <p className="text-slate-400">Unable to load your personalization profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-electric-blue" />
            Personalized Experience
          </h1>
          <p className="text-slate-400 mt-2">
            Your dashboard, tailored to your preferences and behavior
          </p>
        </div>
        <Badge variant="outline" className="bg-electric-blue/10 text-electric-blue border-electric-blue/30">
          {profile.behavior.userSegment} User
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: "overview", label: "Overview", icon: Eye },
          { id: "preferences", label: "Preferences", icon: Settings },
          { id: "insights", label: "Insights", icon: Brain },
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 ${
              activeTab === tab.id 
                ? 'bg-electric-blue text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glassmorphism">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Sessions</p>
                    <p className="text-2xl font-bold">{profile.behavior.totalSessions}</p>
                  </div>
                  <User className="w-8 h-8 text-electric-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Engagement</p>
                    <p className="text-2xl font-bold capitalize">{profile.behavior.engagementLevel}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Risk Score</p>
                    <p className="text-2xl font-bold">{(profile.riskScore * 100).toFixed(0)}%</p>
                  </div>
                  <Target className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Trading Style</p>
                    <p className="text-2xl font-bold capitalize">{profile.behavior.tradingPattern}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                    <Zap className="w-5 h-5 text-electric-blue mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
                {profile.recommendations.length === 0 && (
                  <p className="text-slate-400 text-center py-4">
                    No recommendations available yet. Use the platform more to get personalized suggestions!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { action: "mint", label: "Quick Mint", icon: "🎯" },
                  { action: "trade", label: "Trade Tokens", icon: "📈" },
                  { action: "stake", label: "Stake FLBY", icon: "💎" },
                  { action: "portfolio", label: "View Portfolio", icon: "📊" },
                ].map(item => (
                  <Button
                    key={item.action}
                    variant="outline"
                    className="h-16 flex-col gap-2"
                    onClick={() => handleActionClick(item.action)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          {/* Theme Preferences */}
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <Select
                  value={profile.preferences.theme}
                  onValueChange={(value) => handlePreferenceChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electric">Electric Blue</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                    <SelectItem value="neon">Neon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Dashboard Layout</label>
                <Select
                  value={profile.preferences.dashboard.layout}
                  onValueChange={(value) => handlePreferenceChange('dashboard.layout', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid View</SelectItem>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="cards">Card View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Trading Preferences */}
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Trading Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Currency</label>
                <Select
                  value={profile.preferences.defaultCurrency}
                  onValueChange={(value) => handlePreferenceChange('defaultCurrency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOL">SOL</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="FLBY">FLBY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Level</label>
                <Select
                  value={profile.preferences.trading.riskLevel}
                  onValueChange={(value) => handlePreferenceChange('trading.riskLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications' },
                { key: 'push', label: 'Push Notifications' },
                { key: 'transactionUpdates', label: 'Transaction Updates' },
                { key: 'marketingUpdates', label: 'Marketing Updates' },
                { key: 'communityUpdates', label: 'Community Updates' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <label className="text-sm font-medium">{item.label}</label>
                  <Switch
                    checked={profile.preferences.notifications[item.key]}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange(`notifications.${item.key}`, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Personal Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.insights.map((insight, index) => (
                  <div key={index} className="p-4 bg-slate-800/30 rounded-lg border-l-4 border-electric-blue">
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
                {profile.insights.length === 0 && (
                  <p className="text-slate-400 text-center py-8">
                    Continue using the platform to unlock personalized insights about your trading patterns and behavior.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Preferred Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.behavior.preferredFeatures.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="bg-electric-blue/20 text-electric-blue">
                    {feature.replace('_', ' ').toUpperCase()}
                  </Badge>
                ))}
                {profile.behavior.preferredFeatures.length === 0 && (
                  <p className="text-slate-400 text-sm">
                    Your preferred features will appear here as you use the platform more.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}