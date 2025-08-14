import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  BarChart3, 
  Users, 
  FileText, 
  Calendar, 
  Brain,
  Activity,
  TrendingUp,
  MessageSquare,
  Settings,
  Play,
  Pause,
  Plus,
  Eye,
  Target,
  Zap
} from 'lucide-react';

export default function ComprehensiveSocialDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [botConfigs, setBotConfigs] = useState<any[]>([]);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const response = await fetch('/api/social/bots');
      if (response.ok) {
        const data = await response.json();
        setBotConfigs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch bots:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Social Media Command Center
          </h1>
          <p className="text-xl text-slate-300">
            AI-powered social automation for maximum viral reach and engagement
          </p>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Queue
            </TabsTrigger>
            <TabsTrigger value="ai-optimization" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Center
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Active Bots</p>
                      <p className="text-3xl font-bold text-blue-400">
                        {botConfigs.filter(bot => bot.status === 'running').length}
                      </p>
                    </div>
                    <Bot className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Posts Today</p>
                      <p className="text-3xl font-bold text-green-400">42</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Engagement Rate</p>
                      <p className="text-3xl font-bold text-purple-400">8.7%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Viral Score</p>
                      <p className="text-3xl font-bold text-yellow-400">94</p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bot Status Overview */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Bot Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {botConfigs.length > 0 ? (
                    botConfigs.map((bot) => (
                      <div key={bot.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            bot.status === 'running' ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <div>
                            <p className="font-medium text-white">{bot.name}</p>
                            <p className="text-sm text-slate-400">{bot.platform} • {bot.postingFrequency} posts/day</p>
                          </div>
                        </div>
                        <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                          {bot.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                      <p>No bots configured yet</p>
                      <p className="text-sm">Create your first automation bot to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Dashboard */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">2.4M</div>
                    <div className="text-sm text-slate-400">Total Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">186K</div>
                    <div className="text-sm text-slate-400">Total Engagements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">12.3K</div>
                    <div className="text-sm text-slate-400">New Followers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Accounts */}
          <TabsContent value="accounts" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Engagement Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                  <p>Account management system</p>
                  <p className="text-sm">Manage your social media accounts for automation</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Library */}
          <TabsContent value="content" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Content Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                  <p>AI-powered content generation</p>
                  <p className="text-sm">Store and manage your content templates and assets</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Post Queue Manager */}
          <TabsContent value="queue" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Post Queue Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                  <p>Advanced scheduling system</p>
                  <p className="text-sm">Schedule and manage your social media posts</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Optimization Center */}
          <TabsContent value="ai-optimization" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Optimization Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                  <p>AI-powered viral optimization</p>
                  <p className="text-sm">Maximize engagement and follower growth with AI</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}