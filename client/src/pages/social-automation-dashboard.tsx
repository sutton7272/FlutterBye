import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import { 
  Radio, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  Trash2,
  Eye,
  EyeOff,
  Activity,
  Users,
  TrendingUp,
  BarChart3,
  Brain,
  Clock,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  X
} from "lucide-react";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  status: 'active' | 'inactive' | 'error';
  lastActivity: string;
  postsToday: number;
  followers: number;
}

interface BotConfig {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  postsToday: number;
  engagements: number;
  uptime: string;
  lastActivity: string;
}

export default function SocialAutomationDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddBot, setShowAddBot] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [testPostLoading, setTestPostLoading] = useState(false);

  // Form states
  const [newAccount, setNewAccount] = useState({
    platform: '',
    username: '',
    password: '',
    email: '',
    phone: ''
  });

  const [newBot, setNewBot] = useState({
    name: '',
    platform: '',
    targetAccounts: '',
    postingFrequency: '4',
    engagementRate: '75'
  });

  const [apiKeys, setApiKeys] = useState({
    twitter: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    openai: ''
  });

  // Fetch social accounts from API with type safety
  const { data: socialAccountsData = [], isLoading: accountsLoading, error: accountsError } = useQuery({
    queryKey: ['/api/social-automation/accounts'],
    refetchInterval: 10000, // Refresh every 10 seconds
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch bot configurations from API with type safety  
  const { data: botConfigsData = [], isLoading: botsLoading, error: botsError } = useQuery({
    queryKey: ['/api/social-automation/bots'],
    refetchInterval: 5000, // Refresh every 5 seconds
    retry: 3,
    retryDelay: 1000,
  });

  // Safely cast data with fallbacks
  const socialAccounts: SocialAccount[] = Array.isArray(socialAccountsData) ? socialAccountsData : [];
  const botConfigs: BotConfig[] = Array.isArray(botConfigsData) ? botConfigsData : [];

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['/api/social-automation/stats'],
    refetchInterval: 10000,
  });

  // Fetch API keys status
  const { data: apiKeyStatus } = useQuery({
    queryKey: ['/api/social-automation/api-keys/status'],
    refetchInterval: 30000,
  });

  const testInstantPost = async () => {
    setTestPostLoading(true);
    try {
      const response = await apiRequest('/api/social-automation/test-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `🚀 Test post from Flutterbye at ${new Date().toLocaleTimeString()}! Social automation is working perfectly! #Flutterbye #Web3 #SocialAutomation`,
          platform: 'all'
        }),
      });

      if (response.success) {
        toast({
          title: "Test Post Successful!",
          description: `Posted to ${response.posted || 'available platforms'}. Check your social media accounts.`,
        });
        // Refresh accounts to show updated activity
        queryClient.invalidateQueries({ queryKey: ['/api/social-automation/accounts'] });
        queryClient.invalidateQueries({ queryKey: ['/api/social-automation/stats'] });
      } else {
        throw new Error(response.error || 'Failed to post');
      }
    } catch (error) {
      console.error('Test post error:', error);
      toast({
        title: "Test Post Failed",
        description: error.message || 'Unable to create test post. Check your account credentials.',
        variant: "destructive",
      });
    } finally {
      setTestPostLoading(false);
    }
  };

  const addSocialAccount = async () => {
    if (!newAccount.platform || !newAccount.username || !newAccount.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Adding social account:', { platform: newAccount.platform, username: newAccount.username });
      
      const response = await apiRequest("POST", "/api/social-automation/accounts", {
        platform: newAccount.platform,
        username: newAccount.username,
        password: newAccount.password,
        email: newAccount.email || '',
        phone: newAccount.phone || ''
      });

      console.log('Add account response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Add account result:', result);

      if (result.success) {
        // Refresh accounts from server
        await queryClient.invalidateQueries({ queryKey: ['/api/social-automation/accounts'] });
        setNewAccount({ platform: '', username: '', password: '', email: '', phone: '' });
        setShowAddAccount(false);
        
        toast({
          title: "Account Added Successfully",
          description: `${newAccount.platform} account @${newAccount.username} has been added`,
        });
      } else {
        toast({
          title: "Failed to Add Account",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding account:', error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect to server",
        variant: "destructive"
      });
    }
  };

  const addBot = async () => {
    if (!newBot.name || !newBot.platform) {
      toast({
        title: "Missing Information",
        description: "Please provide bot name and platform",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/social-automation/bots", newBot);
      const result = await response.json();

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['/api/social-automation/bots'] });
        setNewBot({ name: '', platform: '', targetAccounts: '', postingFrequency: '4', engagementRate: '75' });
        setShowAddBot(false);
        
        toast({
          title: "Bot Created",
          description: `${newBot.name} has been created successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create bot",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create bot",
        variant: "destructive"
      });
    }
  };

  const toggleBotStatus = async (botId: string) => {
    const bot = botConfigs.find((b: any) => b.id === botId);
    if (!bot) return;

    const newStatus = bot.status === 'running' ? 'stopped' : 'running';
    
    try {
      const response = await apiRequest("PATCH", `/api/social-automation/bots/${botId}/status`, { status: newStatus });
      const result = await response.json();

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['/api/social-automation/bots'] });
        toast({
          title: "Bot Status Updated",
          description: result.message || `Bot ${newStatus === 'running' ? 'started' : 'stopped'} successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update bot status",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bot status",
        variant: "destructive"
      });
    }
  };

  const toggleAccountStatus = async (accountId: string) => {
    const account = socialAccounts.find((acc: any) => acc.id === accountId);
    if (!account) return;

    const newStatus = account.status === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await apiRequest("PATCH", `/api/social-automation/accounts/${accountId}/status`, { status: newStatus });
      const result = await response.json();

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['/api/social-automation/accounts'] });
        toast({
          title: "Account Status Updated",
          description: `Account ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
        });
      } else {
        toast({
          title: "Error", 
          description: result.error || "Failed to update account status",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account status", 
        variant: "destructive"
      });
    }
  };

  const saveApiKeys = async () => {
    try {
      const response = await apiRequest("POST", "/api/social-automation/api-keys", apiKeys);
      const result = await response.json();

      if (result.success) {
        toast({
          title: "API Keys Saved",
          description: "All API keys have been saved securely",
        });
        setShowApiKeys(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save API keys",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API keys",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-full border-2 border-purple-500/50 relative">
              <div className="absolute inset-0 bg-purple-500/10 rounded-full animate-ping" />
              <Radio className="w-8 h-8 text-purple-400 relative z-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Social Automation Management
              </h1>
              <p className="text-slate-300">Complete AI-powered social media bot control center</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-sm text-slate-400">Active Bots</p>
                    <p className="text-2xl font-bold text-white">{botConfigs?.filter((b: any) => b.status === 'running')?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-sm text-slate-400">Connected Accounts</p>
                    <p className="text-2xl font-bold text-white">{socialAccounts?.filter((a: any) => a.status === 'active')?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-sm text-slate-400">Posts Today</p>
                    <p className="text-2xl font-bold text-white">{botConfigs?.reduce((sum: any, bot: any) => sum + (bot.postsToday || 0), 0) || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-sm text-slate-400">Total Engagements</p>
                    <p className="text-2xl font-bold text-white">{botConfigs?.reduce((sum: any, bot: any) => sum + (bot.engagements || 0), 0) || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">Social Accounts</TabsTrigger>
            <TabsTrigger value="bots">Bot Management</TabsTrigger>
            <TabsTrigger value="settings">Settings & API Keys</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Bots */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    Active Bot Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.isArray(botConfigs) && botConfigs.slice(0, 3).map((bot: any) => (
                      <div key={bot.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <p className="font-medium text-white">{bot.name}</p>
                          <p className="text-sm text-slate-400">Uptime: {bot.uptime}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                            {bot.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleBotStatus(bot.id)}
                            className="border-purple-500/50"
                          >
                            {bot.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Post published</p>
                        <p className="text-sm text-slate-400">@flutterbye_main • 2 mins ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Engagement boost activated</p>
                        <p className="text-sm text-slate-400">Viral Amplifier Bot • 5 mins ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Content optimized</p>
                        <p className="text-sm text-slate-400">AI Optimization • 8 mins ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Social Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Social Account Management</h3>
              <p className="text-slate-300">Manage your response accounts and engagement amplification network</p>
            </div>

            {/* Account Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Response Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">Accounts used for automated responses, comments, and engagement</p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setShowAddAccount(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Response Account
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Engagement Targets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">Accounts to monitor and engage with for amplification</p>
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setShowAddAccount(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Target Account
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center">
              <h4 className="text-xl font-bold text-white">All Connected Accounts</h4>
              <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-purple-400">Add New Social Media Account</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="platform">Platform</Label>
                        <Select value={newAccount.platform} onValueChange={(value) => setNewAccount({...newAccount, platform: value})}>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Twitter">Twitter</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="TikTok">TikTok</SelectItem>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          placeholder="@username"
                          value={newAccount.username}
                          onChange={(e) => setNewAccount({...newAccount, username: e.target.value})}
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Account password"
                        value={newAccount.password}
                        onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email (optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="account@email.com"
                          value={newAccount.email}
                          onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input
                          id="phone"
                          placeholder="+1234567890"
                          value={newAccount.phone}
                          onChange={(e) => setNewAccount({...newAccount, phone: e.target.value})}
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={addSocialAccount} className="bg-purple-600 hover:bg-purple-700 flex-1">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Account
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddAccount(false)} className="border-slate-600">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead>Platform</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Posts Today</TableHead>
                      <TableHead>Followers</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(socialAccounts) && socialAccounts.map((account: any) => (
                      <TableRow key={account.id} className="border-slate-700">
                        <TableCell className="font-medium">{account.platform}</TableCell>
                        <TableCell>{account.username}</TableCell>
                        <TableCell>
                          <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{account.postsToday || 0}</TableCell>
                        <TableCell>{account.followers?.toLocaleString() || 0}</TableCell>
                        <TableCell>{account.lastActivity || 'Never'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleAccountStatus(account.id)}
                              className="border-purple-500/50"
                            >
                              {account.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingAccount(account.id)}
                              className="border-slate-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bot Management Tab */}
          <TabsContent value="bots" className="space-y-6">
            {/* How-To Section */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-500/20 rounded-full">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">How to Add Response & Engagement Accounts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-300 mb-2"><strong>Step 1: Add Flutterbye Content Creator Account</strong></p>
                        <p className="text-sm text-slate-400">Go to "Social Accounts" tab → Add Flutterbye credentials → This account will post original content</p>
                      </div>
                      <div>
                        <p className="text-slate-300 mb-2"><strong>Step 2: Create Engagement Amplifier Bots</strong></p>
                        <p className="text-sm text-slate-400">Your other 4 accounts will automatically like, comment, and share Flutterbye's posts for viral growth</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Bot Configuration & Management</h3>
              <div className="flex gap-2">
                <Button 
                  onClick={testInstantPost} 
                  disabled={testPostLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {testPostLoading ? 'Posting...' : 'Test Instant Post'}
                </Button>
                <Dialog open={showAddBot} onOpenChange={setShowAddBot}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Engagement Bot
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-purple-400">Create Flutterbye Engagement Amplifier Bot</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="botName">Bot Name</Label>
                      <Input
                        id="botName"
                        placeholder="e.g., Flutterbye Amplifier Bot, Viral Growth Bot"
                        value={newBot.name}
                        onChange={(e) => setNewBot({...newBot, name: e.target.value})}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="botPlatform">Primary Platform</Label>
                      <Select value={newBot.platform} onValueChange={(value) => setNewBot({...newBot, platform: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Twitter">Twitter</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="TikTok">TikTok</SelectItem>
                          <SelectItem value="Multi-Platform">Multi-Platform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/20">
                      <Label htmlFor="targetAccounts" className="text-green-300 font-semibold">Target Flutterbye Accounts</Label>
                      <Input
                        id="targetAccounts"
                        placeholder="@flutterbye, @flutterbye_official (add your Flutterbye accounts here)"
                        value={newBot.targetAccounts}
                        onChange={(e) => setNewBot({...newBot, targetAccounts: e.target.value})}
                        className="bg-slate-700 border-slate-600 mt-2"
                      />
                      <p className="text-xs text-slate-400 mt-2">
                        🎯 <strong>Enter your Flutterbye account usernames:</strong><br/>
                        • Your engagement bots will automatically like Flutterbye's posts<br/>
                        • Bots will comment on Flutterbye's content for viral amplification<br/>
                        • Automatic sharing/retweeting of Flutterbye posts<br/>
                        • Creates artificial engagement for algorithmic boost
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postingFreq">Engagements per Day</Label>
                        <Select value={newBot.postingFrequency} onValueChange={(value) => setNewBot({...newBot, postingFrequency: value})}>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 engagements/day</SelectItem>
                            <SelectItem value="4">4 engagements/day</SelectItem>
                            <SelectItem value="8">8 engagements/day</SelectItem>
                            <SelectItem value="12">12 engagements/day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="engagementRate">Engagement Rate %</Label>
                        <Select value={newBot.engagementRate} onValueChange={(value) => setNewBot({...newBot, engagementRate: value})}>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25% - Conservative</SelectItem>
                            <SelectItem value="50">50% - Moderate</SelectItem>
                            <SelectItem value="75">75% - Aggressive</SelectItem>
                            <SelectItem value="90">90% - Maximum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={addBot} className="bg-purple-600 hover:bg-purple-700 flex-1">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Engagement Bot
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddBot(false)} className="border-slate-600">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.isArray(botConfigs) && botConfigs.map((bot: any) => (
                <Card key={bot.id} className="bg-slate-800/50 border-purple-500/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-purple-400">{bot.name}</CardTitle>
                        <p className="text-sm text-slate-400">ID: {bot.id}</p>
                      </div>
                      <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                        {bot.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Posts Today</p>
                          <p className="text-2xl font-bold text-white">{bot.postsToday || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Engagements</p>
                          <p className="text-2xl font-bold text-white">{bot.engagements || 0}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Uptime</p>
                          <p className="font-medium text-white">{bot.uptime || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Last Activity</p>
                          <p className="font-medium text-white">{bot.lastActivity || 'Never'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => toggleBotStatus(bot.id)}
                          className={bot.status === 'running' ? "bg-red-600 hover:bg-red-700 flex-1" : "bg-green-600 hover:bg-green-700 flex-1"}
                        >
                          {bot.status === 'running' ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Stop Bot
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start Bot
                            </>
                          )}
                        </Button>
                        <Button variant="outline" className="border-slate-600">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings & API Keys Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Settings & API Configuration</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Keys Management */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    API Keys Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(apiKeys).map(([platform, key]) => (
                    <div key={platform} className="space-y-2">
                      <Label htmlFor={platform} className="capitalize">{platform} API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          id={platform}
                          type={showApiKeys ? "text" : "password"}
                          placeholder={`Enter ${platform} API key`}
                          value={key}
                          onChange={(e) => setApiKeys({...apiKeys, [platform]: e.target.value})}
                          className="bg-slate-700 border-slate-600"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowApiKeys(!showApiKeys)}
                          className="border-slate-600"
                        >
                          {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button onClick={saveApiKeys} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save API Keys
                  </Button>
                </CardContent>
              </Card>

              {/* Global Settings */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Global Bot Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoStart">Auto-start bots on system startup</Label>
                    <Switch id="autoStart" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smartTiming">Use AI-powered smart timing</Label>
                    <Switch id="smartTiming" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="viralDetection">Enable viral content detection</Label>
                    <Switch id="viralDetection" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="safetyMode">Enable safety mode</Label>
                    <Switch id="safetyMode" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily posting limit per account</Label>
                    <Select defaultValue="20">
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 posts/day</SelectItem>
                        <SelectItem value="20">20 posts/day</SelectItem>
                        <SelectItem value="50">50 posts/day</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}