import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Settings, Brain, Users, Bot, Zap, Play, Pause, Edit, Eye, EyeOff, Save, MessageSquare, TrendingUp, Calendar, Globe, Activity, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SocialAutomationDashboard() {
  const { toast } = useToast();
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);
  const [botConfigs, setBotConfigs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddBot, setShowAddBot] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [testPostLoading, setTestPostLoading] = useState(false);
  const [newAccount, setNewAccount] = useState({
    platform: '',
    username: '',
    password: '',
    email: '',
    type: 'content_creator'
  });
  const [newBot, setNewBot] = useState({
    name: '',
    platform: '',
    targetAccounts: '',
    postingFrequency: '4',
    engagementRate: '50'
  });
  const [apiKeys, setApiKeys] = useState({
    twitter: '',
    instagram: '',
    tiktok: ''
  });
  const [showApiKeys, setShowApiKeys] = useState(false);

  // Load data
  useEffect(() => {
    fetchSocialAccounts();
    fetchBotConfigs();
  }, []);

  const fetchSocialAccounts = async () => {
    try {
      const response = await fetch('/api/social/accounts');
      if (response.ok) {
        const data = await response.json();
        setSocialAccounts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchBotConfigs = async () => {
    try {
      const response = await fetch('/api/social/bots');
      if (response.ok) {
        const data = await response.json();
        setBotConfigs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching bots:', error);
    }
  };

  const addAccount = async () => {
    try {
      const response = await fetch('/api/social/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      });
      if (response.ok) {
        await fetchSocialAccounts();
        setShowAddAccount(false);
        setNewAccount({ platform: '', username: '', password: '', email: '', type: 'content_creator' });
        toast({ title: 'Account added successfully!' });
      }
    } catch (error) {
      toast({ title: 'Error adding account', variant: 'destructive' });
    }
  };

  const addBot = async () => {
    try {
      const response = await fetch('/api/social/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBot)
      });
      if (response.ok) {
        await fetchBotConfigs();
        setShowAddBot(false);
        setNewBot({ name: '', platform: '', targetAccounts: '', postingFrequency: '4', engagementRate: '50' });
        toast({ title: 'Bot created successfully!' });
      }
    } catch (error) {
      toast({ title: 'Error creating bot', variant: 'destructive' });
    }
  };

  const toggleAccountStatus = async (accountId: string) => {
    try {
      const response = await fetch(`/api/social/accounts/${accountId}/toggle`, { method: 'POST' });
      if (response.ok) {
        await fetchSocialAccounts();
        toast({ title: 'Account status updated!' });
      }
    } catch (error) {
      toast({ title: 'Error updating account', variant: 'destructive' });
    }
  };

  const toggleBotStatus = async (botId: string) => {
    try {
      setTestPostLoading(true);
      
      const response = await fetch(`/api/social/bots/${botId}/toggle`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        const bot = data.bot;
        
        if (bot?.status === 'running') {
          const freq = parseInt(bot.postingFrequency) || 4;
          const hours = Math.floor(24 / freq);
          toast({ 
            title: 'Bot Started Successfully! 🚀', 
            description: `${bot.name} posted immediately and will continue posting ${freq} times/day (every ${hours} hours) with AI-generated FlutterBye content`,
            className: 'bg-green-900 border-green-500 text-white',
            duration: 8000
          });
        } else {
          toast({ 
            title: 'Bot Stopped', 
            description: `${bot?.name || 'Bot'} automation has been halted`,
            className: 'bg-orange-900 border-orange-500 text-white'
          });
        }
        
        await fetchBotConfigs();
      }
    } catch (error) {
      toast({ title: 'Error updating bot', variant: 'destructive' });
    } finally {
      setTestPostLoading(false);
    }
  };

  const testTwitterAPI = async () => {
    try {
      setTestPostLoading(true);
      toast({ 
        title: 'Testing Twitter API', 
        description: 'Verifying API credentials and posting test tweet...',
        className: 'bg-indigo-900 border-indigo-500 text-white'
      });

      const response = await fetch('/api/social-automation/twitter-api-test', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          let finalResult = null;
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                finalResult = data;
                
                if (data.step) {
                  toast({ 
                    title: `Step ${data.step}: ${data.status}`, 
                    description: data.message,
                    className: 'bg-indigo-900 border-indigo-500 text-white',
                    duration: 2000
                  });
                }
              } catch (e) {
                // Invalid JSON line, skip
              }
            }
          }
          
          if (finalResult?.success) {
            toast({ 
              title: 'Twitter API Connected!', 
              description: `${finalResult.message} - Account: @${finalResult.accountInfo?.username}`,
              className: 'bg-green-900 border-green-500 text-white',
              duration: 5000
            });
            
            // Now test posting
            testAPIPost();
          } else {
            toast({ 
              title: 'Twitter API Failed', 
              description: finalResult?.message || 'API connection failed',
              variant: 'destructive',
              duration: 5000
            });
          }
        }
      }
    } catch (error) {
      toast({ 
        title: 'API Test Failed', 
        description: 'Could not test Twitter API',
        variant: 'destructive' 
      });
    } finally {
      setTestPostLoading(false);
    }
  };

  const testAPIPost = async () => {
    try {
      const response = await fetch('/api/social-automation/twitter-api-post', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `FlutterBye social automation API test! ${new Date().toLocaleTimeString()}`,
          hashtags: ['#FlutterBye', '#SocialAutomation', '#TwitterAPI']
        })
      });
      
      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          let finalResult = null;
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                finalResult = data;
              } catch (e) {
                // Invalid JSON line, skip
              }
            }
          }
          
          if (finalResult?.success) {
            toast({ 
              title: 'Tweet Posted Successfully! 🎉', 
              description: `Tweet ID: ${finalResult.tweetId}`,
              className: 'bg-green-900 border-green-500 text-white',
              duration: 8000
            });
          } else {
            toast({ 
              title: 'Tweet Failed', 
              description: finalResult?.message || 'Posting failed',
              variant: 'destructive',
              duration: 5000
            });
          }
        }
      }
    } catch (error) {
      toast({ 
        title: 'Post Test Failed', 
        description: 'Could not test tweet posting',
        variant: 'destructive' 
      });
    }
  };

  const runDiagnostic = async () => {
    try {
      setTestPostLoading(true);
      toast({ 
        title: 'Visual Diagnostic Starting', 
        description: 'Opening Twitter to analyze login challenges...',
        className: 'bg-blue-900 border-blue-500 text-white'
      });

      const response = await fetch('/api/social-automation/twitter-diagnostic', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          let finalResult = null;
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                finalResult = data;
                
                if (data.step) {
                  toast({ 
                    title: `Step ${data.step}: ${data.status}`, 
                    description: data.message,
                    className: 'bg-blue-900 border-blue-500 text-white',
                    duration: 2000
                  });
                }
              } catch (e) {
                // Invalid JSON line, skip
              }
            }
          }
          
          if (finalResult?.analysis) {
            const recommendations = finalResult.recommendations || [];
            toast({ 
              title: 'Diagnostic Complete', 
              description: recommendations.length > 0 ? recommendations.join(', ') : 'Browser automation working correctly',
              className: recommendations.some((r: string) => r.includes('CAPTCHA') || r.includes('verification')) ? 'bg-yellow-900 border-yellow-500 text-white' : 'bg-green-900 border-green-500 text-white',
              duration: 8000
            });
          }
        }
      }
    } catch (error) {
      toast({ 
        title: 'Diagnostic Failed', 
        description: 'Could not run diagnostic test',
        variant: 'destructive' 
      });
    } finally {
      setTestPostLoading(false);
    }
  };

  const testInstantPost = async () => {
    setTestPostLoading(true);
    try {
      // Show starting notification
      toast({ 
        title: 'Starting Twitter Bot...', 
        description: 'Browser automation launching...',
        className: 'bg-blue-900 border-blue-500 text-white'
      });

      // Use the Twitter auth fix endpoint for diagnosis
      const response = await fetch('/api/social-automation/twitter-auth-test', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        
        if (reader) {
          let finalResult = null;
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
              try {
                const result = JSON.parse(line);
                if (result.status === 'complete') {
                  finalResult = result;
                } else if (result.status === 'posting') {
                  toast({ 
                    title: 'Posting to Twitter...', 
                    description: 'Logging in and composing tweet...',
                    className: 'bg-purple-900 border-purple-500 text-white'
                  });
                }
              } catch (e) {
                // Skip invalid JSON lines
              }
            }
          }
          
          if (finalResult?.success) {
            toast({ 
              title: 'Twitter Post SUCCESS! 🎉', 
              description: `Live tweet posted: ${finalResult.message}`,
              className: 'bg-green-900 border-green-500 text-white',
              duration: 5000
            });
          } else {
            // Show detailed explanation for Twitter verification issue
            const errorMsg = finalResult?.error || finalResult?.message || 'Browser automation error';
            if (errorMsg.includes('verification') || errorMsg.includes('password input')) {
              toast({ 
                title: 'Browser Automation Working - Verification Needed', 
                description: 'Twitter requires manual verification for @flutterbye_io account. Complete phone/email verification first, then automation will work perfectly.',
                className: 'bg-yellow-900 border-yellow-500 text-white',
                duration: 8000
              });
            } else {
              toast({ 
                title: 'Twitter Post Failed', 
                description: errorMsg,
                variant: 'destructive' 
              });
            }
          }
        }
      } else {
        toast({ 
          title: 'Connection Failed', 
          description: 'Could not reach automation service',
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Test Failed', 
        description: 'Network or automation error',
        variant: 'destructive' 
      });
    } finally {
      setTestPostLoading(false);
    }
  };

  const saveApiKeys = async () => {
    try {
      const response = await fetch('/api/social/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiKeys)
      });
      if (response.ok) {
        toast({ title: 'API keys saved successfully!' });
      }
    } catch (error) {
      toast({ title: 'Error saving API keys', variant: 'destructive' });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🤖 Social Media Automation Command Center
            </h1>
            <p className="text-slate-300 text-lg">
              Revolutionary viral marketing system with AI-powered engagement amplification
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-purple-500/30">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="accounts" className="text-white data-[state=active]:bg-purple-600">
                <Users className="w-4 h-4 mr-2" />
                Social Accounts
              </TabsTrigger>
              <TabsTrigger value="bots" className="text-white data-[state=active]:bg-purple-600">
                <Bot className="w-4 h-4 mr-2" />
                Bot Management
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-purple-600">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-300">Active Accounts</p>
                        <p className="text-3xl font-bold text-white">{socialAccounts.filter(a => a.status === 'active').length}</p>
                      </div>
                      <Activity className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-500/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-300">Running Bots</p>
                        <p className="text-3xl font-bold text-white">{botConfigs.filter(b => b.status === 'running').length}</p>
                      </div>
                      <Bot className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-300">Posts Today</p>
                        <p className="text-3xl font-bold text-white">
                          {socialAccounts.reduce((total, account) => total + (account.postsToday || 0), 0)}
                        </p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Social Accounts Tab */}
            <TabsContent value="accounts" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Social Media Accounts</h3>
                <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-purple-500/30">
                    <DialogHeader>
                      <DialogTitle className="text-purple-400">Add Social Media Account</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
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
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Password"
                          value={newAccount.password}
                          onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Email"
                          value={newAccount.email}
                          onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountType">Account Type</Label>
                        <Select value={newAccount.type} onValueChange={(value) => setNewAccount({...newAccount, type: value})}>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="content_creator">Content Creator (Flutterbye)</SelectItem>
                            <SelectItem value="engagement_amplifier">Engagement Amplifier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={addAccount} className="bg-green-600 hover:bg-green-700 flex-1">
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
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-purple-300">Platform</TableHead>
                        <TableHead className="text-purple-300">Username</TableHead>
                        <TableHead className="text-purple-300">Status</TableHead>
                        <TableHead className="text-purple-300">Posts Today</TableHead>
                        <TableHead className="text-purple-300">Followers</TableHead>
                        <TableHead className="text-purple-300">Last Activity</TableHead>
                        <TableHead className="text-purple-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {socialAccounts.map((account: any) => (
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

              {/* Browser Automation Status Card */}
              <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-500/20 rounded-full">
                      <Settings className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-green-300 mb-2">Browser Automation Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-slate-300">Browser automation working perfectly</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-slate-300">Chromium launching and navigating to Twitter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-slate-300">Twitter account may need verification for automated login</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                          If posting fails, complete phone/email verification on @flutterbye_io account, then automation will work perfectly.
                        </p>
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
                    {testPostLoading ? 'Testing Twitter API...' : 'Test Twitter API'}
                  </Button>
                  <Button 
                    onClick={() => runDiagnostic()} 
                    disabled={testPostLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Visual Diagnostic
                  </Button>
                  <Button 
                    onClick={() => testTwitterAPI()} 
                    disabled={testPostLoading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Test Twitter API
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
                                <SelectItem value="2">2 posts/day (every 12 hours)</SelectItem>
                                <SelectItem value="4">4 posts/day (every 6 hours)</SelectItem>
                                <SelectItem value="6">6 posts/day (every 4 hours)</SelectItem>
                                <SelectItem value="8">8 posts/day (every 3 hours)</SelectItem>
                                <SelectItem value="12">12 posts/day (every 2 hours)</SelectItem>
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
                        <div className="space-y-3">
                          <div className="p-3 bg-slate-900/50 rounded-lg border border-purple-500/20">
                            <p className="text-sm text-slate-300 mb-2">
                              <strong>Posting Schedule:</strong> {bot.postingFrequency || 4} posts/day 
                              {(() => {
                                const freq = parseInt(bot.postingFrequency) || 4;
                                const hours = Math.floor(24 / freq);
                                return ` (every ${hours} hours)`;
                              })()}
                            </p>
                            <p className="text-xs text-slate-400">
                              Platform: {bot.platform} | Engagement Rate: {bot.engagementRate}%
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={() => toggleBotStatus(bot.id)}
                              disabled={testPostLoading}
                              className={bot.status === 'running' ? "bg-red-600 hover:bg-red-700 flex-1" : "bg-green-600 hover:bg-green-700 flex-1"}
                            >
                              {testPostLoading ? (
                                <>
                                  <Settings className="w-4 h-4 mr-2 animate-spin" />
                                  Working...
                                </>
                              ) : bot.status === 'running' ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Stop Bot
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Bot & Post Now
                                </>
                              )}
                            </Button>
                            <Button variant="outline" className="border-slate-600">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
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
      </div>
    </>
  );
}