import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bot, Calendar, Clock, FileText, Globe, BarChart3, Settings, Zap, Target, Sparkles, TrendingUp, Users, Brain } from "lucide-react";

export default function FlutterBlogBot() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Blog generation form state
  const [blogForm, setBlogForm] = useState({
    topic: "",
    tone: "professional",
    targetAudience: "general",
    contentType: "blog",
    keywords: "",
    wordCount: 1000,
    includeFlutterByeIntegration: true
  });

  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    frequency: "weekly",
    isActive: true,
    autoPublish: false,
    requiresApproval: true,
    defaultTone: "professional",
    defaultTargetAudience: "general",
    defaultContentType: "blog",
    keywordFocus: "",
    includeFlutterByeIntegration: true
  });

  // Generate blog content mutation
  const generateBlogMutation = useMutation({
    mutationFn: async (formData: typeof blogForm) => {
      const keywordsArray = formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : [];
      return await apiRequest("POST", "/api/blog/generate", {
        topic: formData.topic,
        tone: formData.tone,
        targetAudience: formData.targetAudience,
        contentType: formData.contentType,
        keywords: keywordsArray,
        wordCount: formData.wordCount,
        includeFlutterByeIntegration: formData.includeFlutterByeIntegration
      });
    },
    onSuccess: () => {
      toast({
        title: "Blog Generated Successfully",
        description: "Your blog post has been created and saved as a draft.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate blog content",
        variant: "destructive",
      });
    },
  });

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: async (formData: typeof scheduleForm) => {
      const keywordsArray = formData.keywordFocus ? formData.keywordFocus.split(',').map(k => k.trim()) : [];
      return await apiRequest("POST", "/api/blog/schedules", {
        name: formData.name,
        frequency: formData.frequency,
        isActive: formData.isActive,
        autoPublish: formData.autoPublish,
        requiresApproval: formData.requiresApproval,
        defaultTone: formData.defaultTone,
        defaultTargetAudience: formData.defaultTargetAudience,
        defaultContentType: formData.defaultContentType,
        keywordFocus: keywordsArray,
        includeFlutterByeIntegration: formData.includeFlutterByeIntegration
      });
    },
    onSuccess: () => {
      toast({
        title: "Schedule Created",
        description: "Automated blog generation schedule has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/schedules"] });
      // Reset form
      setScheduleForm({
        name: "",
        frequency: "weekly",
        isActive: true,
        autoPublish: false,
        requiresApproval: true,
        defaultTone: "professional",
        defaultTargetAudience: "general",
        defaultContentType: "blog",
        keywordFocus: "",
        includeFlutterByeIntegration: true
      });
    },
    onError: (error: any) => {
      toast({
        title: "Schedule Creation Failed",
        description: error.message || "Failed to create schedule",
        variant: "destructive",
      });
    },
  });

  // Fetch blog posts
  const { data: blogPosts = [] } = useQuery({
    queryKey: ["/api/blog/posts"],
    retry: false
  }) as { data: any[] };

  // Fetch schedules
  const { data: schedules = [] } = useQuery({
    queryKey: ["/api/blog/schedules"],
    retry: false
  }) as { data: any[] };

  // Fetch analytics
  const { data: analytics = {} } = useQuery({
    queryKey: ["/api/blog/analytics"],
    retry: false
  }) as { data: any };

  const handleGenerateBlog = () => {
    if (!blogForm.topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your blog post",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    generateBlogMutation.mutate(blogForm);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const handleCreateSchedule = () => {
    if (!scheduleForm.name) {
      toast({
        title: "Schedule Name Required",
        description: "Please enter a name for your schedule",
        variant: "destructive",
      });
      return;
    }
    createScheduleMutation.mutate(scheduleForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      {/* Cosmic Butterfly Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent"></div>
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="butterfly-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <g opacity="0.1">
                <path d="M100 50c-20 0-30 15-30 25s10 25 30 25 30-15 30-25-10-25-30-25z" fill="url(#cosmic-gradient)" />
                <path d="M100 150c-20 0-30-15-30-25s10-25 30-25 30 15 30 25-10 25-30 25z" fill="url(#cosmic-gradient)" />
              </g>
            </pattern>
            <linearGradient id="cosmic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#butterfly-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Bot className="h-12 w-12 text-blue-400 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              FlutterBlog Bot
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            AI-Powered SEO Content Creation System - Maximum OpenAI Integration for Automated Blog Generation
          </p>
          
          {/* Real-time Stats */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{blogPosts.length || 0}</div>
              <div className="text-sm text-slate-400">Blog Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{schedules.length || 0}</div>
              <div className="text-sm text-slate-400">Active Schedules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{analytics?.totalViews || 0}</div>
              <div className="text-sm text-slate-400">Total Views</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Brain className="h-5 w-5" />
                  AI Blog Generation
                </CardTitle>
                <CardDescription>
                  Generate high-quality, SEO-optimized blog content with maximum AI integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Blog Topic</Label>
                    <Input
                      id="topic"
                      placeholder="Enter your blog topic..."
                      value={blogForm.topic}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, topic: e.target.value }))}
                      className="bg-slate-900/50 border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Target Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="keyword1, keyword2, keyword3..."
                      value={blogForm.keywords}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, keywords: e.target.value }))}
                      className="bg-slate-900/50 border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Content Tone</Label>
                    <Select value={blogForm.tone} onValueChange={(value) => setBlogForm(prev => ({ ...prev, tone: value }))}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select value={blogForm.targetAudience} onValueChange={(value) => setBlogForm(prev => ({ ...prev, targetAudience: value }))}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginners">Beginners</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="experts">Experts</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contentType">Content Type</Label>
                    <Select value={blogForm.contentType} onValueChange={(value) => setBlogForm(prev => ({ ...prev, contentType: value }))}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="analysis">Analysis</SelectItem>
                        <SelectItem value="opinion">Opinion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wordCount">Word Count</Label>
                    <Input
                      id="wordCount"
                      type="number"
                      placeholder="1000"
                      value={blogForm.wordCount}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, wordCount: parseInt(e.target.value) || 1000 }))}
                      className="bg-slate-900/50 border-slate-600"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="flutterbye-integration"
                    checked={blogForm.includeFlutterByeIntegration}
                    onCheckedChange={(checked) => setBlogForm(prev => ({ ...prev, includeFlutterByeIntegration: checked }))}
                  />
                  <Label htmlFor="flutterbye-integration" className="text-sm">
                    Include FlutterBye Platform Integration
                  </Label>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Generating AI content...</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                )}

                <Button 
                  onClick={handleGenerateBlog} 
                  disabled={generateBlogMutation.isPending || isGenerating}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {generateBlogMutation.isPending || isGenerating ? (
                    <>
                      <Bot className="mr-2 h-4 w-4 animate-spin" />
                      Generating AI Content...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Blog Post
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Calendar className="h-5 w-5" />
                    Create Schedule
                  </CardTitle>
                  <CardDescription>
                    Set up automated blog generation schedules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduleName">Schedule Name</Label>
                    <Input
                      id="scheduleName"
                      placeholder="Weekly Blockchain Updates"
                      value={scheduleForm.name}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-slate-900/50 border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={scheduleForm.frequency} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywordFocus">Keyword Focus</Label>
                    <Input
                      id="keywordFocus"
                      placeholder="blockchain, crypto, DeFi..."
                      value={scheduleForm.keywordFocus}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, keywordFocus: e.target.value }))}
                      className="bg-slate-900/50 border-slate-600"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-publish"
                        checked={scheduleForm.autoPublish}
                        onCheckedChange={(checked) => setScheduleForm(prev => ({ ...prev, autoPublish: checked }))}
                      />
                      <Label htmlFor="auto-publish" className="text-sm">Auto-publish generated posts</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="requires-approval"
                        checked={scheduleForm.requiresApproval}
                        onCheckedChange={(checked) => setScheduleForm(prev => ({ ...prev, requiresApproval: checked }))}
                      />
                      <Label htmlFor="requires-approval" className="text-sm">Require manual approval</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="schedule-active"
                        checked={scheduleForm.isActive}
                        onCheckedChange={(checked) => setScheduleForm(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="schedule-active" className="text-sm">Schedule active</Label>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateSchedule} 
                    disabled={createScheduleMutation.isPending}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {createScheduleMutation.isPending ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Creating Schedule...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Create Schedule
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Clock className="h-5 w-5" />
                    Active Schedules
                  </CardTitle>
                  <CardDescription>
                    Manage your automated content schedules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schedules.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No schedules created yet</p>
                        <p className="text-sm">Create your first automated schedule</p>
                      </div>
                    ) : (
                      schedules.map((schedule: any) => (
                        <div key={schedule.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-slate-200">{schedule.name}</h4>
                              <p className="text-sm text-slate-400">
                                {schedule.frequency} • {schedule.postsGenerated || 0} posts generated
                              </p>
                            </div>
                            <Badge 
                              variant={schedule.isActive ? "default" : "secondary"}
                              className={schedule.isActive ? "bg-green-500/20 text-green-400" : ""}
                            >
                              {schedule.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-400">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{blogPosts.length || 0}</div>
                  <p className="text-sm text-slate-400">Blog posts generated</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-400">Published</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{blogPosts.filter((post: any) => post.status === 'published').length || 0}</div>
                  <p className="text-sm text-slate-400">Live blog posts</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-400">AI Generated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{blogPosts.filter((post: any) => post.generatedByAI).length || 0}</div>
                  <p className="text-sm text-slate-400">AI-powered content</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <TrendingUp className="h-5 w-5" />
                  Recent Blog Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blogPosts.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No blog posts yet</p>
                      <p className="text-sm">Generate your first AI-powered blog post</p>
                    </div>
                  ) : (
                    blogPosts.slice(0, 5).map((post: any) => (
                      <div key={post.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-200">{post.title}</h4>
                            <p className="text-sm text-slate-400 line-clamp-1">{post.excerpt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {post.generatedByAI && (
                              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                                <Bot className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                            <Badge 
                              variant={post.status === 'published' ? "default" : "secondary"}
                              className={post.status === 'published' ? "bg-green-500/20 text-green-400" : ""}
                            >
                              {post.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Settings className="h-5 w-5" />
                  FlutterBlog Bot Settings
                </CardTitle>
                <CardDescription>
                  Configure AI content generation and automation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12 text-slate-400">
                  <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Settings Coming Soon</h3>
                  <p>Advanced configuration options will be available in the next update</p>
                  <div className="mt-4 text-sm text-slate-500">
                    Features in development:
                    <ul className="mt-2 space-y-1">
                      <li>• Custom AI model selection</li>
                      <li>• Content template management</li>
                      <li>• SEO optimization settings</li>
                      <li>• Publishing automation rules</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}