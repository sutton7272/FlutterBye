import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Settings, Twitter, Instagram, Linkedin, Facebook, TestTube, CheckCircle, XCircle, AlertCircle, Eye, EyeOff, Trash2 } from 'lucide-react';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  displayName: string;
  isConnected: boolean;
  lastSync: string;
  followers: number;
  following: number;
  posts: number;
  apiCredentials: {
    [key: string]: string;
  };
}

export default function EngagementAccounts() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [testingAccount, setTestingAccount] = useState<string | null>(null);
  const [showCredentials, setShowCredentials] = useState<{[key: string]: boolean}>({});
  
  const [newAccount, setNewAccount] = useState({
    platform: 'Twitter',
    username: '',
    displayName: '',
    credentials: {} as {[key: string]: string}
  });

  const platformConfigs = {
    Twitter: {
      icon: Twitter,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20 border-blue-500/30',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password' },
        { key: 'api_secret', label: 'API Secret', type: 'password' },
        { key: 'access_token', label: 'Access Token', type: 'password' },
        { key: 'access_token_secret', label: 'Access Token Secret', type: 'password' },
        { key: 'bearer_token', label: 'Bearer Token (Optional)', type: 'password' }
      ]
    },
    Instagram: {
      icon: Instagram,
      color: 'text-pink-400',
      bgColor: 'bg-pink-900/20 border-pink-500/30',
      fields: [
        { key: 'access_token', label: 'Access Token', type: 'password' },
        { key: 'app_id', label: 'App ID', type: 'text' },
        { key: 'app_secret', label: 'App Secret', type: 'password' }
      ]
    },
    LinkedIn: {
      icon: Linkedin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-900/20 border-blue-500/30',
      fields: [
        { key: 'client_id', label: 'Client ID', type: 'text' },
        { key: 'client_secret', label: 'Client Secret', type: 'password' },
        { key: 'access_token', label: 'Access Token', type: 'password' }
      ]
    },
    Facebook: {
      icon: Facebook,
      color: 'text-blue-500',
      bgColor: 'bg-blue-900/20 border-blue-500/30',
      fields: [
        { key: 'page_access_token', label: 'Page Access Token', type: 'password' },
        { key: 'page_id', label: 'Page ID', type: 'text' },
        { key: 'app_secret', label: 'App Secret', type: 'password' }
      ]
    }
  };

  // Mock data
  const mockAccounts: SocialAccount[] = [
    {
      id: '1',
      platform: 'Twitter',
      username: '@FlutterByeHQ',
      displayName: 'FlutterBye Official',
      isConnected: true,
      lastSync: '2025-01-14T12:00:00Z',
      followers: 15420,
      following: 892,
      posts: 1247,
      apiCredentials: {
        api_key: 'sk-*********************',
        api_secret: 'sk-*********************',
        access_token: 'sk-*********************',
        access_token_secret: 'sk-*********************'
      }
    }
  ];

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/social-automation/engagement-accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || mockAccounts);
      } else {
        setAccounts(mockAccounts);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setAccounts(mockAccounts);
    }
  };

  const addAccount = async () => {
    // Validate required fields
    if (!newAccount.username || !newAccount.displayName || !newAccount.platform) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate required API credentials for the platform
    const config = platformConfigs[newAccount.platform as keyof typeof platformConfigs];
    const requiredFields = config.fields.filter(field => !field.label.includes('Optional'));
    const missingFields = requiredFields.filter(field => !newAccount.credentials[field.key]?.trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing API Credentials",
        description: `Please provide: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    try {
      const accountData = {
        ...newAccount,
        apiCredentials: newAccount.credentials,
        id: Date.now().toString(),
        isConnected: false,
        lastSync: new Date().toISOString(),
        followers: 0,
        following: 0,
        posts: 0
      };

      const response = await fetch('/api/social-automation/engagement-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccounts(prev => [...prev, data.account || accountData]);
        setNewAccount({
          platform: 'Twitter',
          username: '',
          displayName: '',
          credentials: {}
        });
        setShowAddAccount(false);
        toast({ 
          title: 'Account Added Successfully!',
          description: `${accountData.displayName} has been added with individual API keys`,
          className: 'bg-green-900 border-green-500 text-white'
        });
      } else {
        throw new Error('Failed to add account');
      }
    } catch (error) {
      toast({ 
        title: 'Failed to add account', 
        description: 'Please check your API credentials and try again',
        variant: 'destructive' 
      });
    }
  };

  const testConnection = async (accountId: string) => {
    setTestingAccount(accountId);
    try {
      const response = await fetch(`/api/social-automation/engagement-accounts/${accountId}/test`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast({ 
          title: '✅ Connection Test Successful!',
          description: result.message || 'Account is properly connected',
          className: 'bg-green-900 border-green-500 text-white'
        });
        
        // Update account status
        setAccounts(prev => prev.map(acc => 
          acc.id === accountId ? { ...acc, isConnected: true, lastSync: new Date().toISOString() } : acc
        ));
      } else {
        toast({ 
          title: 'Connection Test Failed',
          description: result.message || 'Unable to connect to account',
          variant: 'destructive'
        });
        
        setAccounts(prev => prev.map(acc => 
          acc.id === accountId ? { ...acc, isConnected: false } : acc
        ));
      }
    } catch (error) {
      toast({ 
        title: 'Test Failed', 
        description: 'Could not test account connection',
        variant: 'destructive' 
      });
    } finally {
      setTestingAccount(null);
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/social-automation/engagement-accounts/${accountId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setAccounts(prev => prev.filter(acc => acc.id !== accountId));
        toast({ 
          title: 'Account removed successfully',
          className: 'bg-green-900 border-green-500 text-white'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to remove account', 
        variant: 'destructive' 
      });
    }
  };

  const toggleCredentialVisibility = (accountId: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const getCurrentPlatformConfig = () => {
    return platformConfigs[newAccount.platform as keyof typeof platformConfigs];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔗 Social Media Account Management
          </h1>
          <p className="text-slate-300 text-lg">
            Connect and manage your social media accounts for automated posting and analytics
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-white">Connected Accounts</h3>
          <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Social Account
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-purple-500/30 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-purple-400">Connect New Social Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select 
                    value={newAccount.platform} 
                    onValueChange={(value) => {
                      setNewAccount({...newAccount, platform: value, credentials: {}});
                    }}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Twitter">
                        <div className="flex items-center gap-2">
                          <Twitter className="w-4 h-4" />
                          Twitter
                        </div>
                      </SelectItem>
                      <SelectItem value="Instagram">
                        <div className="flex items-center gap-2">
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </div>
                      </SelectItem>
                      <SelectItem value="LinkedIn">
                        <div className="flex items-center gap-2">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </div>
                      </SelectItem>
                      <SelectItem value="Facebook">
                        <div className="flex items-center gap-2">
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="@yourusername"
                      value={newAccount.username}
                      onChange={(e) => setNewAccount({...newAccount, username: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      placeholder="Your Account Name"
                      value={newAccount.displayName}
                      onChange={(e) => setNewAccount({...newAccount, displayName: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">API Credentials</h4>
                  {getCurrentPlatformConfig()?.fields.map((field) => (
                    <div key={field.key}>
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Input
                        id={field.key}
                        type={field.type}
                        placeholder={field.label}
                        value={newAccount.credentials[field.key] || ''}
                        onChange={(e) => setNewAccount({
                          ...newAccount, 
                          credentials: {...newAccount.credentials, [field.key]: e.target.value}
                        })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={addAccount} className="flex-1 bg-purple-600 hover:bg-purple-700">
                    Connect Account
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddAccount(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {accounts.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold text-white mb-2">No Accounts Connected</h3>
                <p className="text-slate-400">Connect your social media accounts to start automated posting</p>
              </CardContent>
            </Card>
          ) : (
            accounts.map((account) => {
              const PlatformIcon = platformConfigs[account.platform as keyof typeof platformConfigs]?.icon || Settings;
              const platformConfig = platformConfigs[account.platform as keyof typeof platformConfigs];
              
              return (
                <Card key={account.id} className={`bg-slate-800/50 ${platformConfig?.bgColor || 'border-slate-700'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-slate-700/50`}>
                          <PlatformIcon className={`w-6 h-6 ${platformConfig?.color || 'text-slate-400'}`} />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white">{account.displayName}</h4>
                          <p className="text-slate-400">{account.username} • {account.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={account.isConnected ? 'default' : 'secondary'} 
                          className={account.isConnected ? 'bg-green-600' : 'bg-red-600'}
                        >
                          {account.isConnected ? (
                            <><CheckCircle className="w-3 h-3 mr-1" />Connected</>
                          ) : (
                            <><XCircle className="w-3 h-3 mr-1" />Disconnected</>
                          )}
                        </Badge>
                      </div>
                    </div>

                    {/* Account Stats */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{account.followers.toLocaleString()}</p>
                        <p className="text-sm text-slate-400">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{account.following.toLocaleString()}</p>
                        <p className="text-sm text-slate-400">Following</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{account.posts.toLocaleString()}</p>
                        <p className="text-sm text-slate-400">Posts</p>
                      </div>
                    </div>

                    {/* API Credentials */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <h5 className="font-semibold text-white">API Credentials</h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCredentialVisibility(account.id)}
                        >
                          {showCredentials[account.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {showCredentials[account.id] ? (
                        <div className="space-y-2 bg-slate-900/50 p-4 rounded-lg">
                          {Object.entries(account.apiCredentials).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-sm text-slate-300 capitalize">{key.replace('_', ' ')}:</span>
                              <code className="text-xs text-purple-400 bg-slate-700 px-2 py-1 rounded">
                                {value}
                              </code>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 bg-slate-900/50 p-4 rounded-lg">
                          API credentials are securely stored and hidden. Click the eye icon to view.
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => testConnection(account.id)}
                        disabled={testingAccount === account.id}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <TestTube className="w-4 h-4 mr-2" />
                        {testingAccount === account.id ? 'Testing...' : 'Test Connection'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => deleteAccount(account.id)}
                        className="border-red-500 text-red-400 hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>

                    {/* Last Sync */}
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-xs text-slate-500">
                        Last synchronized: {new Date(account.lastSync).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}