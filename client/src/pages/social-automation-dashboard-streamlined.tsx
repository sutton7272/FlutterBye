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
import { Bot, Settings, Play, Pause, Plus, Trash2, Activity, TestTube } from 'lucide-react';

export default function SocialAutomationDashboard() {
  const { toast } = useToast();
  const [botConfigs, setBotConfigs] = useState<any[]>([]);
  const [showAddBot, setShowAddBot] = useState(false);
  const [testPostLoading, setTestPostLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    twitter_api_key: '',
    twitter_api_secret: '',
    twitter_access_token: '',
    twitter_access_token_secret: ''
  });
  
  const [newBot, setNewBot] = useState({
    name: '',
    platform: 'Twitter',
    postingFrequency: '8',
    status: 'inactive',
    contentType: 'FlutterBye Updates',
    targetAudience: 'Crypto enthusiasts'
  });

  useEffect(() => {
    fetchBots();
    fetchApiKeys();
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

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/social/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    }
  };

  const createBot = async () => {
    try {
      const response = await fetch('/api/social/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBot)
      });
      
      if (response.ok) {
        const data = await response.json();
        setBotConfigs(prev => [...prev, data]);
        setNewBot({
          name: '',
          platform: 'Twitter',
          postingFrequency: '8',
          status: 'inactive',
          contentType: 'FlutterBye Updates',
          targetAudience: 'Crypto enthusiasts'
        });
        setShowAddBot(false);
        toast({ 
          title: 'Bot Created Successfully!',
          description: `${data.name} is ready for activation`,
          className: 'bg-green-900 border-green-500 text-white'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to create bot', 
        variant: 'destructive' 
      });
    }
  };

  const toggleBot = async (botId: string) => {
    try {
      const response = await fetch(`/api/social/bots/${botId}/toggle`, {
        method: 'POST'
      });
      
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
        } else if (bot?.status === 'inactive') {
          toast({ 
            title: 'Bot Stopped', 
            description: `${bot.name} has been deactivated`,
            className: 'bg-yellow-900 border-yellow-500 text-white' 
          });
        }
        
        fetchBots();
      }
    } catch (error) {
      toast({ 
        title: 'Bot toggle failed', 
        variant: 'destructive' 
      });
    }
  };

  const deleteBot = async (botId: string) => {
    try {
      const response = await fetch(`/api/social/bots/${botId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setBotConfigs(prev => prev.filter(bot => bot.id !== botId));
        toast({ 
          title: 'Bot deleted successfully' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to delete bot', 
        variant: 'destructive' 
      });
    }
  };

  const testTweet = async () => {
    setTestPostLoading(true);
    try {
      const response = await fetch('/api/social/test-tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: '🚀 Testing FlutterBye social automation system! AI-powered engagement for the future of Web3 communication. #FlutterBye #SocialAutomation' 
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast({ 
          title: '✅ Tweet Posted Successfully!', 
          description: `Tweet ID: ${result.tweetId}`,
          className: 'bg-green-900 border-green-500 text-white',
          duration: 6000
        });
      } else {
        toast({ 
          title: 'Tweet Failed', 
          description: result.message || 'Unknown error',
          variant: 'destructive',
          duration: 5000
        });
      }
    } catch (error) {
      toast({ 
        title: 'Test Failed', 
        description: 'Could not test tweet posting',
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

        <Tabs defaultValue="bots" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-purple-500/30">
            <TabsTrigger value="bots" className="text-white data-[state=active]:bg-purple-600">
              <Bot className="w-4 h-4 mr-2" />
              Bot Management & Control
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-purple-600">
              <Settings className="w-4 h-4 mr-2" />
              Twitter API Testing
            </TabsTrigger>
          </TabsList>

          {/* Bot Management Tab */}
          <TabsContent value="bots" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Engagement Bots</h3>
              <Dialog open={showAddBot} onOpenChange={setShowAddBot}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Engagement Bot
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-purple-400">Create New Engagement Bot</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="botName">Bot Name</Label>
                      <Input
                        id="botName"
                        placeholder="e.g., Flutterbye Growth Bot"
                        value={newBot.name}
                        onChange={(e) => setNewBot({...newBot, name: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postingFrequency">Posting Frequency</Label>
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
                      <Label htmlFor="contentType">Content Focus</Label>
                      <Select value={newBot.contentType} onValueChange={(value) => setNewBot({...newBot, contentType: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FlutterBye Updates">FlutterBye Platform Updates</SelectItem>
                          <SelectItem value="Crypto News">Crypto & Web3 News</SelectItem>
                          <SelectItem value="Engagement">Community Engagement</SelectItem>
                          <SelectItem value="Educational">Educational Content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={createBot} className="flex-1 bg-purple-600 hover:bg-purple-700">
                        Create Bot
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddBot(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {botConfigs.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Bots Created Yet</h3>
                    <p className="text-slate-400">Create your first engagement bot to start automated posting</p>
                  </CardContent>
                </Card>
              ) : (
                botConfigs.map((bot) => (
                  <Card key={bot.id} className="bg-slate-800/50 border-purple-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-semibold text-white">{bot.name}</h4>
                            <Badge variant={bot.status === 'running' ? 'default' : 'secondary'} 
                                   className={bot.status === 'running' ? 'bg-green-600' : 'bg-slate-600'}>
                              {bot.status === 'running' ? (
                                <><Activity className="w-3 h-3 mr-1" />Running</>
                              ) : (
                                'Inactive'
                              )}
                            </Badge>
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
                                Platform: {bot.platform} | Content: {bot.contentType}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-6">
                          <Button
                            onClick={() => toggleBot(bot.id)}
                            className={bot.status === 'running' ? 
                              'bg-red-600 hover:bg-red-700' : 
                              'bg-green-600 hover:bg-green-700'
                            }
                          >
                            {bot.status === 'running' ? (
                              <><Pause className="w-4 h-4 mr-2" />Stop Bot</>
                            ) : (
                              <><Play className="w-4 h-4 mr-2" />Start Bot & Post Now</>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => deleteBot(bot.id)}
                            className="border-red-500 text-red-400 hover:bg-red-950"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* API Testing Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Twitter API Configuration & Testing</h3>
            
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Test Twitter Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Test your Twitter API connection with a live post to verify everything is working correctly.
                </p>
                <Button 
                  onClick={testTweet}
                  disabled={testPostLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {testPostLoading ? 'Posting...' : 'Test Tweet Now'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">API Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="api_key">API Key</Label>
                    <Input
                      id="api_key"
                      type="password"
                      value={apiKeys.twitter_api_key}
                      onChange={(e) => setApiKeys({...apiKeys, twitter_api_key: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Your Twitter API Key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="api_secret">API Secret</Label>
                    <Input
                      id="api_secret"
                      type="password"
                      value={apiKeys.twitter_api_secret}
                      onChange={(e) => setApiKeys({...apiKeys, twitter_api_secret: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Your Twitter API Secret"
                    />
                  </div>
                  <div>
                    <Label htmlFor="access_token">Access Token</Label>
                    <Input
                      id="access_token"
                      type="password"
                      value={apiKeys.twitter_access_token}
                      onChange={(e) => setApiKeys({...apiKeys, twitter_access_token: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Your Access Token"
                    />
                  </div>
                  <div>
                    <Label htmlFor="access_token_secret">Access Token Secret</Label>
                    <Input
                      id="access_token_secret"
                      type="password"
                      value={apiKeys.twitter_access_token_secret}
                      onChange={(e) => setApiKeys({...apiKeys, twitter_access_token_secret: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Your Access Token Secret"
                    />
                  </div>
                </div>
                <Button onClick={saveApiKeys} className="bg-purple-600 hover:bg-purple-700">
                  Save API Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}