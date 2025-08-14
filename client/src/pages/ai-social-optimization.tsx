import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Brain, Clock, TrendingUp, MessageCircle, Calendar, Sparkles, Target, BarChart3 } from 'lucide-react';

interface TimingInsights {
  optimalTimes: Array<{
    platform: string;
    dayOfWeek: string;
    hour: number;
    timezone: string;
    engagement_score: number;
  }>;
  frequency: {
    daily_posts: number;
    weekly_posts: number;
    optimal_gap_hours: number;
  };
  audience_analysis: {
    peak_activity_windows: string[];
    demographic_insights: string[];
    content_preferences: string[];
  };
}

interface ContentOptimization {
  improved_text: string;
  engagement_score: number;
  viral_potential: number;
  suggested_improvements: string[];
  emotional_hooks: string[];
  call_to_action: string;
}

interface ResponseOptimization {
  response_variants: Array<{
    text: string;
    style: string;
    engagement_potential: number;
  }>;
  timing_strategy: {
    immediate_response: boolean;
    optimal_delay_minutes: number;
    follow_up_schedule: string[];
  };
}

export default function AISocialOptimization() {
  const { toast } = useToast();
  
  // State for different AI features
  const [timingAnalysis, setTimingAnalysis] = useState<TimingInsights | null>(null);
  const [contentOptimization, setContentOptimization] = useState<ContentOptimization | null>(null);
  const [responseOptimization, setResponseOptimization] = useState<ResponseOptimization | null>(null);
  const [postingSchedule, setPostingSchedule] = useState<any[]>([]);
  
  const [loading, setLoading] = useState({
    timing: false,
    content: false,
    response: false,
    schedule: false
  });

  // Form states
  const [timingForm, setTimingForm] = useState({
    platform: 'twitter',
    timezone: 'UTC',
    contentType: 'general'
  });

  const [contentForm, setContentForm] = useState({
    content: '',
    platform: 'twitter',
    goals: ['engagement', 'viral_potential']
  });

  const [responseForm, setResponseForm] = useState({
    originalPost: '',
    userComment: '',
    responseStyle: 'helpful'
  });

  const [scheduleForm, setScheduleForm] = useState({
    platform: 'twitter',
    contentTypes: ['general'],
    weeklyGoal: 5
  });

  // Analyze optimal posting times
  const analyzeTimings = async () => {
    setLoading({ ...loading, timing: true });
    try {
      const response = await apiRequest('/api/social/ai/analyze-timing', {
        method: 'POST',
        body: JSON.stringify(timingForm)
      });

      setTimingAnalysis(response.insights);
      toast({
        title: "Timing Analysis Complete",
        description: `AI analyzed optimal posting times for ${timingForm.platform}`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze timings",
        variant: "destructive"
      });
    } finally {
      setLoading({ ...loading, timing: false });
    }
  };

  // Optimize content
  const optimizeContent = async () => {
    if (!contentForm.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to optimize",
        variant: "destructive"
      });
      return;
    }

    setLoading({ ...loading, content: true });
    try {
      const response = await apiRequest('/api/social/ai/optimize-content', {
        method: 'POST',
        body: JSON.stringify(contentForm)
      });

      setContentOptimization(response.optimization);
      toast({
        title: "Content Optimized",
        description: `Content optimized with ${response.optimization.engagement_score}% engagement score`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to optimize content",
        variant: "destructive"
      });
    } finally {
      setLoading({ ...loading, content: false });
    }
  };

  // Optimize responses
  const optimizeResponses = async () => {
    if (!responseForm.originalPost.trim() || !responseForm.userComment.trim()) {
      toast({
        title: "Both Fields Required",
        description: "Please enter both original post and user comment",
        variant: "destructive"
      });
      return;
    }

    setLoading({ ...loading, response: true });
    try {
      const response = await apiRequest('/api/social/ai/optimize-responses', {
        method: 'POST',
        body: JSON.stringify(responseForm)
      });

      setResponseOptimization(response.responseOptimization);
      toast({
        title: "Responses Generated",
        description: `Generated ${response.responseOptimization.response_variants.length} optimized response variants`,
      });
    } catch (error) {
      toast({
        title: "Response Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate responses",
        variant: "destructive"
      });
    } finally {
      setLoading({ ...loading, response: false });
    }
  };

  // Generate posting schedule
  const generateSchedule = async () => {
    setLoading({ ...loading, schedule: true });
    try {
      const response = await apiRequest('/api/social/ai/generate-schedule', {
        method: 'POST',
        body: JSON.stringify(scheduleForm)
      });

      setPostingSchedule(response.schedule);
      toast({
        title: "Schedule Generated",
        description: `Generated AI-optimized posting schedule for ${scheduleForm.platform}`,
      });
    } catch (error) {
      toast({
        title: "Schedule Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate schedule",
        variant: "destructive"
      });
    } finally {
      setLoading({ ...loading, schedule: false });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          AI Social Media Optimization
        </h1>
        <p className="text-muted-foreground text-lg">
          Leverage AI to maximize your social media impact with optimal timing, content optimization, and smart engagement
        </p>
      </div>

      <Tabs defaultValue="timing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timing" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Timing Analysis
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Content Optimization
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Smart Responses
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            AI Schedule
          </TabsTrigger>
        </TabsList>

        {/* Timing Analysis Tab */}
        <TabsContent value="timing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Posting Time Analysis
              </CardTitle>
              <CardDescription>
                Discover the optimal times to post for maximum engagement based on AI analysis of platform algorithms and audience behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={timingForm.platform} onValueChange={(value) => setTimingForm({...timingForm, platform: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    value={timingForm.timezone}
                    onChange={(e) => setTimingForm({...timingForm, timezone: e.target.value})}
                    placeholder="UTC"
                  />
                </div>
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={timingForm.contentType} onValueChange={(value) => setTimingForm({...timingForm, contentType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="features">Features</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={analyzeTimings} disabled={loading.timing} className="w-full">
                {loading.timing ? 'Analyzing...' : 'Analyze Optimal Times'}
              </Button>

              {timingAnalysis && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold">AI Analysis Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Optimal Posting Times</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {timingAnalysis.optimalTimes.map((time, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <span>{time.dayOfWeek} at {time.hour}:00</span>
                            <Badge variant="outline">{time.engagement_score}% engagement</Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Posting Frequency</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Daily Posts:</span>
                          <span className="font-semibold">{timingAnalysis.frequency.daily_posts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weekly Posts:</span>
                          <span className="font-semibold">{timingAnalysis.frequency.weekly_posts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Optimal Gap:</span>
                          <span className="font-semibold">{timingAnalysis.frequency.optimal_gap_hours}h</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Audience Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Peak Activity Windows:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {timingAnalysis.audience_analysis.peak_activity_windows.map((window, idx) => (
                              <Badge key={idx} variant="secondary">{window}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Content Preferences:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {timingAnalysis.audience_analysis.content_preferences.map((pref, idx) => (
                              <Badge key={idx} variant="outline">{pref}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Optimization Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                AI Content Optimization
              </CardTitle>
              <CardDescription>
                Transform your posts into viral-worthy content with AI-powered optimization for maximum engagement and reach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Original Content</Label>
                <Textarea
                  value={contentForm.content}
                  onChange={(e) => setContentForm({...contentForm, content: e.target.value})}
                  placeholder="Enter your post content to optimize..."
                  className="min-h-24"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={contentForm.platform} onValueChange={(value) => setContentForm({...contentForm, platform: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Optimization Goals</Label>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">Engagement</Badge>
                    <Badge variant="secondary">Viral Potential</Badge>
                  </div>
                </div>
              </div>
              
              <Button onClick={optimizeContent} disabled={loading.content} className="w-full">
                {loading.content ? 'Optimizing...' : 'Optimize Content with AI'}
              </Button>

              {contentOptimization && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold">Optimized Content</h3>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">AI-Optimized Text:</Label>
                          <div className="mt-2 p-3 bg-muted rounded-lg">
                            {contentOptimization.improved_text}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {contentOptimization.engagement_score}%
                            </div>
                            <div className="text-sm text-green-600">Engagement Score</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {contentOptimization.viral_potential}%
                            </div>
                            <div className="text-sm text-blue-600">Viral Potential</div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Suggested Improvements:</Label>
                          <ul className="mt-2 space-y-1">
                            {contentOptimization.suggested_improvements.map((improvement, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Emotional Hooks:</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {contentOptimization.emotional_hooks.map((hook, idx) => (
                              <Badge key={idx} variant="outline">{hook}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Call to Action:</Label>
                          <div className="mt-1 p-2 bg-yellow-50 rounded border border-yellow-200">
                            {contentOptimization.call_to_action}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Responses Tab */}
        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                AI Response Optimization
              </CardTitle>
              <CardDescription>
                Generate optimized response variants for user engagement with strategic timing recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="originalPost">Original Post</Label>
                <Textarea
                  value={responseForm.originalPost}
                  onChange={(e) => setResponseForm({...responseForm, originalPost: e.target.value})}
                  placeholder="Enter your original post content..."
                  className="min-h-20"
                />
              </div>
              
              <div>
                <Label htmlFor="userComment">User Comment</Label>
                <Textarea
                  value={responseForm.userComment}
                  onChange={(e) => setResponseForm({...responseForm, userComment: e.target.value})}
                  placeholder="Enter the user's comment to respond to..."
                  className="min-h-20"
                />
              </div>
              
              <div>
                <Label htmlFor="responseStyle">Response Style</Label>
                <Select value={responseForm.responseStyle} onValueChange={(value) => setResponseForm({...responseForm, responseStyle: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helpful">Helpful & Educational</SelectItem>
                    <SelectItem value="friendly">Friendly & Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={optimizeResponses} disabled={loading.response} className="w-full">
                {loading.response ? 'Generating...' : 'Generate AI-Optimized Responses'}
              </Button>

              {responseOptimization && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold">Response Variants</h3>
                  
                  <div className="space-y-3">
                    {responseOptimization.response_variants.map((variant, idx) => (
                      <Card key={idx}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline">{variant.style}</Badge>
                            <Badge>{variant.engagement_potential}% potential</Badge>
                          </div>
                          <p className="text-sm">{variant.text}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Timing Strategy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Immediate Response:</span>
                          <Badge variant={responseOptimization.timing_strategy.immediate_response ? "default" : "secondary"}>
                            {responseOptimization.timing_strategy.immediate_response ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Optimal Delay:</span>
                          <span className="font-semibold">{responseOptimization.timing_strategy.optimal_delay_minutes} minutes</span>
                        </div>
                        {responseOptimization.timing_strategy.follow_up_schedule.length > 0 && (
                          <div>
                            <span className="font-medium">Follow-up Schedule:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {responseOptimization.timing_strategy.follow_up_schedule.map((schedule, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{schedule}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                AI Posting Schedule Generator
              </CardTitle>
              <CardDescription>
                Generate an AI-optimized weekly posting schedule based on platform algorithms and audience behavior patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={scheduleForm.platform} onValueChange={(value) => setScheduleForm({...scheduleForm, platform: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weeklyGoal">Weekly Posts</Label>
                  <Input
                    type="number"
                    value={scheduleForm.weeklyGoal}
                    onChange={(e) => setScheduleForm({...scheduleForm, weeklyGoal: parseInt(e.target.value) || 5})}
                    min="1"
                    max="21"
                  />
                </div>
                <div>
                  <Label>Content Types</Label>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">Features</Badge>
                    <Badge variant="secondary" className="text-xs">Tutorials</Badge>
                    <Badge variant="secondary" className="text-xs">Updates</Badge>
                  </div>
                </div>
              </div>
              
              <Button onClick={generateSchedule} disabled={loading.schedule} className="w-full">
                {loading.schedule ? 'Generating...' : 'Generate AI-Optimized Schedule'}
              </Button>

              {postingSchedule.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold">AI-Generated Posting Schedule</h3>
                  
                  <div className="space-y-2">
                    {postingSchedule.map((post, idx) => (
                      <Card key={idx}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{post.day} at {post.time}</div>
                              <div className="text-sm text-muted-foreground">{post.contentType}</div>
                            </div>
                            <Badge variant="outline" className="text-xs">{post.rationale}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Export to Calendar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Save as Template
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}