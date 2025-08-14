import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Play, Settings, Users, Lock, Bot, Zap, Clock, Image, UserPlus, Heart } from "lucide-react";

interface SocialCredentials {
  platform: string;
  username: string;
  password: string;
  email?: string;
}

interface EngagementCredentials extends SocialCredentials {
  role: 'poster' | 'engager';
  engagementStyle: 'supportive' | 'curious' | 'technical' | 'casual';
  delay?: number;
}

export default function SocialPasswordAutomation() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [credentials, setCredentials] = useState<Record<string, SocialCredentials>>({});
  const [engagerAccounts, setEngagerAccounts] = useState<EngagementCredentials[]>([]);
  const [selectedContentType, setSelectedContentType] = useState("features");
  const [previewContent, setPreviewContent] = useState<any>(null);

  // Preview content mutation
  const previewMutation = useMutation({
    mutationFn: async (contentType: string) => {
      return await apiRequest({
        url: '/api/social/preview-content',
        method: 'POST',
        data: { contentType }
      });
    },
    onSuccess: (data) => {
      setPreviewContent(data.content);
      toast({
        title: "Content Generated!",
        description: "Preview your post content and screenshot below.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Preview Failed",
        description: error.message || "Failed to generate content preview",
        variant: "destructive",
      });
    },
  });

  // Single platform posting
  const postSingleMutation = useMutation({
    mutationFn: async (params: any) => {
      return await apiRequest({
        url: '/api/social/post-with-password',
        method: 'POST',
        data: params
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Post Successful!",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Post Failed",
        description: error.message || "Failed to post to social media",
        variant: "destructive",
      });
    },
  });

  // Multi-platform posting
  const postMultiMutation = useMutation({
    mutationFn: async (params: any) => {
      return await apiRequest({
        url: '/api/social/post-multi-password',
        method: 'POST',
        data: params
      });
    },
    onSuccess: (data) => {
      const successCount = data.results.filter((r: any) => r.success).length;
      const totalCount = data.results.length;
      
      toast({
        title: "Multi-Platform Post Complete!",
        description: `Posted to ${successCount}/${totalCount} platforms successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Multi-Platform Post Failed",
        description: error.message || "Failed to post to multiple platforms",
        variant: "destructive",
      });
    },
  });

  // Post with engagement automation
  const postWithEngagementMutation = useMutation({
    mutationFn: async (params: any) => {
      return await apiRequest({
        url: '/api/social/post-with-engagement',
        method: 'POST',
        data: params
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Post with Engagement Complete!",
        description: `Posted and ${data.engagementResults.length} accounts engaged automatically`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Engagement Automation Failed",
        description: error.message || "Failed to post with engagement",
        variant: "destructive",
      });
    },
  });

  // Full engagement cycle
  const fullCycleMutation = useMutation({
    mutationFn: async (params: any) => {
      return await apiRequest({
        url: '/api/social/full-engagement-cycle',
        method: 'POST',
        data: params
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Full Engagement Cycle Complete!",
        description: data.summary,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Full Cycle Failed",
        description: error.message || "Failed to complete engagement cycle",
        variant: "destructive",
      });
    },
  });

  // Schedule automation
  const scheduleMutation = useMutation({
    mutationFn: async (params: any) => {
      return await apiRequest({
        url: '/api/social/schedule-password',
        method: 'POST',
        data: params
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Automation Scheduled!",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scheduling Failed",
        description: error.message || "Failed to schedule automation",
        variant: "destructive",
      });
    },
  });

  const updateCredentials = (platform: string, field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        platform,
        [field]: value
      }
    }));
  };

  const togglePasswordVisibility = (platform: string) => {
    setShowPassword(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const platforms = [
    { id: 'twitter', name: 'Twitter', color: 'bg-blue-500', needsEmail: false },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600', needsEmail: true },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-700', needsEmail: true },
  ];

  const contentTypes = [
    { value: 'features', label: 'Platform Features', description: 'Highlight Flutterbye capabilities' },
    { value: 'stats', label: 'Platform Stats', description: 'Show growth and metrics' },
    { value: 'tutorial', label: 'Tutorial/Guide', description: 'Educational content' },
    { value: 'token-creation', label: 'Token Creation', description: 'Focus on token minting' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="h-8 w-8 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Password-Based Social Automation
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Automate social media posting using your login credentials. No API keys required - just username and password.
          </p>
        </div>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="setup">Setup Accounts</TabsTrigger>
            <TabsTrigger value="engagement">Multi-Account</TabsTrigger>
            <TabsTrigger value="preview">Content Preview</TabsTrigger>
            <TabsTrigger value="post">Post Now</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Social Media Credentials
                </CardTitle>
                <CardDescription>
                  Enter your social media login credentials for automated posting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {platforms.map((platform) => (
                  <Card key={platform.id} className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                      <h3 className="text-lg font-semibold">{platform.name}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`${platform.id}-username`}>
                          {platform.needsEmail ? 'Email/Username' : 'Username'}
                        </Label>
                        <Input
                          id={`${platform.id}-username`}
                          placeholder={platform.needsEmail ? 'your.email@example.com' : '@yourusername'}
                          value={credentials[platform.id]?.username || ''}
                          onChange={(e) => updateCredentials(platform.id, 'username', e.target.value)}
                        />
                      </div>
                      
                      <div className="relative">
                        <Label htmlFor={`${platform.id}-password`}>Password</Label>
                        <div className="relative">
                          <Input
                            id={`${platform.id}-password`}
                            type={showPassword[platform.id] ? 'text' : 'password'}
                            placeholder="Your password"
                            value={credentials[platform.id]?.password || ''}
                            onChange={(e) => updateCredentials(platform.id, 'password', e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => togglePasswordVisibility(platform.id)}
                          >
                            {showPassword[platform.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {credentials[platform.id]?.username && credentials[platform.id]?.password && (
                      <Badge variant="default" className="mt-2">
                        Credentials Set ✓
                      </Badge>
                    )}
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Multi-Account Engagement Setup
                </CardTitle>
                <CardDescription>
                  Add your private/secondary accounts to automatically like, comment, and amplify your main posts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-medium text-blue-300 mb-2">How Multi-Account Engagement Works:</h4>
                  <ul className="text-sm text-blue-200 space-y-1">
                    <li>• Your main account posts the content</li>
                    <li>• Your other accounts wait 2-7 minutes, then automatically:</li>
                    <li className="ml-4">- Like the post</li>
                    <li className="ml-4">- Retweet/share the post</li>
                    <li className="ml-4">- Add supportive comments</li>
                    <li>• After 20-30 minutes, your main account responds to any user replies</li>
                    <li>• Creates authentic-looking engagement and social proof</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg">Your Engagement Accounts</Label>
                    <Button 
                      onClick={() => {
                        setEngagerAccounts([...engagerAccounts, {
                          platform: 'twitter',
                          username: '',
                          password: '',
                          role: 'engager',
                          engagementStyle: 'supportive',
                          delay: Math.random() * 3 + 2 // 2-5 minutes
                        }]);
                      }}
                      size="sm"
                      data-testid="button-add-engager"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Account
                    </Button>
                  </div>

                  {engagerAccounts.map((account, index) => (
                    <Card key={index} className="p-4 mb-4 bg-slate-800/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label>Username/Handle</Label>
                          <Input
                            placeholder="@your_private_account"
                            value={account.username}
                            onChange={(e) => {
                              const updated = [...engagerAccounts];
                              updated[index].username = e.target.value;
                              setEngagerAccounts(updated);
                            }}
                          />
                        </div>
                        
                        <div className="relative">
                          <Label>Password</Label>
                          <div className="relative">
                            <Input
                              type={showPassword[`engager-${index}`] ? 'text' : 'password'}
                              placeholder="Password"
                              value={account.password}
                              onChange={(e) => {
                                const updated = [...engagerAccounts];
                                updated[index].password = e.target.value;
                                setEngagerAccounts(updated);
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(prev => ({
                                ...prev,
                                [`engager-${index}`]: !prev[`engager-${index}`]
                              }))}
                            >
                              {showPassword[`engager-${index}`] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label>Engagement Style</Label>
                          <Select 
                            value={account.engagementStyle} 
                            onValueChange={(value) => {
                              const updated = [...engagerAccounts];
                              updated[index].engagementStyle = value as any;
                              setEngagerAccounts(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="supportive">Supportive (enthusiastic)</SelectItem>
                              <SelectItem value="curious">Curious (asks questions)</SelectItem>
                              <SelectItem value="technical">Technical (blockchain focus)</SelectItem>
                              <SelectItem value="casual">Casual (friendly user)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setEngagerAccounts(accounts => accounts.filter((_, i) => i !== index));
                            }}
                            data-testid={`button-remove-engager-${index}`}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>

                      {account.username && account.password && (
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="default">
                            Account Ready ✓
                          </Badge>
                          <Badge variant="outline">
                            {account.engagementStyle} style
                          </Badge>
                          <Badge variant="outline">
                            {account.delay?.toFixed(1)}min delay
                          </Badge>
                        </div>
                      )}
                    </Card>
                  ))}

                  {engagerAccounts.length === 0 && (
                    <div className="text-center p-8 text-slate-400">
                      <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Add your secondary accounts to boost engagement automatically</p>
                      <p className="text-sm mt-2">Perfect for private Twitter accounts, old accounts, etc.</p>
                    </div>
                  )}
                </div>

                {engagerAccounts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => {
                        const mainAccount = Object.values(credentials)[0];
                        if (!mainAccount?.username || !mainAccount?.password) {
                          toast({
                            title: "Main Account Required",
                            description: "Set up your main posting account first in Setup tab",
                            variant: "destructive"
                          });
                          return;
                        }

                        const validEngagers = engagerAccounts.filter(acc => acc.username && acc.password);
                        
                        postWithEngagementMutation.mutate({
                          posterCredentials: { ...mainAccount, role: 'poster', engagementStyle: 'professional' },
                          engagerCredentials: validEngagers,
                          contentType: selectedContentType
                        });
                      }}
                      disabled={postWithEngagementMutation.isPending}
                      className="w-full"
                      data-testid="button-post-with-engagement"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      {postWithEngagementMutation.isPending ? "Posting..." : "Post + Auto-Engage"}
                    </Button>

                    <Button
                      onClick={() => {
                        const mainAccount = Object.values(credentials)[0];
                        if (!mainAccount?.username || !mainAccount?.password) {
                          toast({
                            title: "Main Account Required",
                            description: "Set up your main posting account first",
                            variant: "destructive"
                          });
                          return;
                        }

                        const validEngagers = engagerAccounts.filter(acc => acc.username && acc.password);
                        
                        fullCycleMutation.mutate({
                          posterCredentials: { ...mainAccount, role: 'poster', engagementStyle: 'professional' },
                          engagerCredentials: validEngagers,
                          contentType: selectedContentType
                        });
                      }}
                      disabled={fullCycleMutation.isPending}
                      className="w-full"
                      variant="outline"
                      data-testid="button-full-cycle"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      {fullCycleMutation.isPending ? "Running..." : "Full Auto Cycle"}
                    </Button>
                  </div>
                )}

                <div className="text-xs text-slate-400 bg-slate-800/30 p-3 rounded">
                  <strong>Full Auto Cycle:</strong> Posts → Engagers like/comment → Waits 20-30min → Responds to user replies
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Content Preview
                </CardTitle>
                <CardDescription>
                  Generate and preview your social media content with screenshots
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Content Type</Label>
                  <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => previewMutation.mutate(selectedContentType)}
                  disabled={previewMutation.isPending}
                  className="w-full"
                  data-testid="button-preview-content"
                >
                  {previewMutation.isPending ? "Generating..." : "Generate Content Preview"}
                </Button>

                {previewContent && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Generated Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Post Content</Label>
                        <Textarea
                          value={previewContent.text}
                          readOnly
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Hashtags</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {previewContent.hashtags?.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>

                      {previewContent.imagePath && (
                        <div>
                          <Label>Screenshot</Label>
                          <p className="text-sm text-slate-400 mt-1">
                            Screenshot captured: {previewContent.imagePath}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="post" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Single Platform Post
                  </CardTitle>
                  <CardDescription>
                    Post to one platform at a time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platforms.map((platform) => {
                    const hasCredentials = credentials[platform.id]?.username && credentials[platform.id]?.password;
                    return (
                      <Button
                        key={platform.id}
                        onClick={() => postSingleMutation.mutate({
                          platform: platform.id,
                          credentials: credentials[platform.id],
                          contentType: selectedContentType
                        })}
                        disabled={!hasCredentials || postSingleMutation.isPending}
                        className="w-full"
                        variant={hasCredentials ? "default" : "secondary"}
                        data-testid={`button-post-${platform.id}`}
                      >
                        {postSingleMutation.isPending ? "Posting..." : `Post to ${platform.name}`}
                        {!hasCredentials && " (Setup Required)"}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Multi-Platform Post
                  </CardTitle>
                  <CardDescription>
                    Post to all configured platforms at once
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => {
                      const validCredentials = Object.fromEntries(
                        Object.entries(credentials).filter(([_, creds]) => 
                          creds.username && creds.password
                        )
                      );
                      
                      postMultiMutation.mutate({
                        platforms: validCredentials,
                        contentType: selectedContentType
                      });
                    }}
                    disabled={Object.keys(credentials).length === 0 || postMultiMutation.isPending}
                    className="w-full"
                    data-testid="button-post-multi"
                  >
                    {postMultiMutation.isPending ? "Posting to All..." : "Post to All Platforms"}
                  </Button>
                  <p className="text-sm text-slate-400 mt-2">
                    Will post to {Object.values(credentials).filter(c => c?.username && c?.password).length} configured platforms
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Schedule Automated Posts
                </CardTitle>
                <CardDescription>
                  Set up recurring posts every few hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => {
                      const validCredentials = Object.fromEntries(
                        Object.entries(credentials).filter(([_, creds]) => 
                          creds.username && creds.password
                        )
                      );
                      
                      scheduleMutation.mutate({
                        platforms: validCredentials,
                        contentType: selectedContentType,
                        intervalHours: 2
                      });
                    }}
                    disabled={scheduleMutation.isPending}
                    data-testid="button-schedule-2h"
                  >
                    Every 2 Hours
                  </Button>
                  <Button
                    onClick={() => {
                      const validCredentials = Object.fromEntries(
                        Object.entries(credentials).filter(([_, creds]) => 
                          creds.username && creds.password
                        )
                      );
                      
                      scheduleMutation.mutate({
                        platforms: validCredentials,
                        contentType: selectedContentType,
                        intervalHours: 4
                      });
                    }}
                    disabled={scheduleMutation.isPending}
                    data-testid="button-schedule-4h"
                  >
                    Every 4 Hours
                  </Button>
                  <Button
                    onClick={() => {
                      const validCredentials = Object.fromEntries(
                        Object.entries(credentials).filter(([_, creds]) => 
                          creds.username && creds.password
                        )
                      );
                      
                      scheduleMutation.mutate({
                        platforms: validCredentials,
                        contentType: selectedContentType,
                        intervalHours: 8
                      });
                    }}
                    disabled={scheduleMutation.isPending}
                    data-testid="button-schedule-8h"
                  >
                    Every 8 Hours
                  </Button>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">How It Works:</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Bot opens a browser window and logs into each platform</li>
                    <li>• Generates fresh AI content and captures new screenshots</li>
                    <li>• Posts automatically with your credentials</li>
                    <li>• Runs in the background at your chosen interval</li>
                    <li>• Browser windows are visible for transparency and debugging</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}