import { useState, useEffect } from "react";
import { Calendar, Clock, Send, Plus, Trash2, Edit3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScheduledPost {
  id: string;
  content: string;
  hashtags: string[];
  scheduledTime: string;
  status: 'pending' | 'posted' | 'failed';
}

interface ContentTemplate {
  text: string;
  hashtags: string[];
}

interface CategoryTemplates {
  category: string;
  templates: ContentTemplate[];
}

export default function SocialContentScheduler() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [contentTemplates, setContentTemplates] = useState<CategoryTemplates[]>([]);
  const [newPost, setNewPost] = useState({ content: '', hashtags: '', scheduledTime: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load scheduled posts and templates
  useEffect(() => {
    fetchScheduledPosts();
    fetchContentTemplates();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      const response = await fetch('/api/social-automation/scheduled-posts');
      if (response.ok) {
        const data = await response.json();
        setScheduledPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch scheduled posts:', error);
    }
  };

  const fetchContentTemplates = async () => {
    try {
      const response = await fetch('/api/social-automation/content-templates');
      if (response.ok) {
        const data = await response.json();
        setContentTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch content templates:', error);
    }
  };

  const schedulePost = async () => {
    if (!newPost.content || !newPost.scheduledTime) {
      toast({ title: 'Missing Information', description: 'Please provide content and scheduled time', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const hashtags = newPost.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await fetch('/api/social-automation/schedule-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPost.content,
          hashtags,
          scheduledTime: newPost.scheduledTime
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({ 
          title: 'Post Scheduled Successfully!', 
          description: `Post ID: ${data.postId}`,
          className: 'bg-green-900 border-green-500 text-white'
        });
        setNewPost({ content: '', hashtags: '', scheduledTime: '' });
        fetchScheduledPosts();
      } else {
        const error = await response.json();
        toast({ title: 'Scheduling Failed', description: error.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to schedule post', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const cancelPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/social-automation/scheduled-posts/${postId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({ 
          title: 'Post Cancelled', 
          description: 'Scheduled post has been cancelled',
          className: 'bg-yellow-900 border-yellow-500 text-white'
        });
        fetchScheduledPosts();
      } else {
        const error = await response.json();
        toast({ title: 'Cancellation Failed', description: error.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to cancel post', variant: 'destructive' });
    }
  };

  const useTemplate = (template: ContentTemplate) => {
    setNewPost({
      content: template.text,
      hashtags: template.hashtags.join(', '),
      scheduledTime: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'posted': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get current date/time for min attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      {/* Electric Border Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 border-2 border-electric-blue/30 animate-pulse" />
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-electric-green/20 animate-pulse" style={{animationDelay: '0.5s'}} />
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent mb-4">
              FlutterBye Social Content Scheduler
            </h1>
            <p className="text-gray-300 text-lg">
              Automate your @flutterbye_io content strategy with intelligent scheduling
            </p>
          </div>

          <Tabs defaultValue="schedule" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-electric-blue/20">
              <TabsTrigger value="schedule" className="data-[state=active]:bg-electric-blue/20 data-[state=active]:text-electric-blue">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Post
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="data-[state=active]:bg-electric-blue/20 data-[state=active]:text-electric-blue">
                <Calendar className="w-4 h-4 mr-2" />
                Scheduled Posts ({scheduledPosts.filter(p => p.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-electric-blue/20 data-[state=active]:text-electric-blue">
                <Edit3 className="w-4 h-4 mr-2" />
                Content Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-6">
              <Card className="bg-slate-800/50 border-electric-blue/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-electric-blue flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Schedule New Post
                  </CardTitle>
                  <CardDescription>
                    Create and schedule content for your @flutterbye_io Twitter account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content
                    </label>
                    <Textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      placeholder="What's happening at FlutterBye?"
                      className="bg-slate-700/50 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                      maxLength={280}
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      {newPost.content.length}/280 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hashtags (comma-separated)
                    </label>
                    <Input
                      value={newPost.hashtags}
                      onChange={(e) => setNewPost({...newPost, hashtags: e.target.value})}
                      placeholder="#FlutterBye, #Web3, #Communication"
                      className="bg-slate-700/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Scheduled Time
                    </label>
                    <Input
                      type="datetime-local"
                      value={newPost.scheduledTime}
                      onChange={(e) => setNewPost({...newPost, scheduledTime: e.target.value})}
                      min={getCurrentDateTime()}
                      className="bg-slate-700/50 border-gray-600 text-white"
                    />
                  </div>

                  <Button
                    onClick={schedulePost}
                    disabled={loading || !newPost.content || !newPost.scheduledTime}
                    className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Post
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-electric-blue">Scheduled Posts</h3>
                <Button
                  onClick={fetchScheduledPosts}
                  variant="outline"
                  size="sm"
                  className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {scheduledPosts.length === 0 ? (
                <Card className="bg-slate-800/50 border-electric-blue/20 backdrop-blur-sm">
                  <CardContent className="py-8 text-center">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-400">No scheduled posts yet</p>
                    <p className="text-sm text-gray-500">Schedule your first post to see it here</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {scheduledPosts.map((post) => (
                    <Card key={post.id} className="bg-slate-800/50 border-electric-blue/20 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge className={`${getStatusColor(post.status)} text-white capitalize`}>
                            {post.status}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDateTime(post.scheduledTime)}
                          </div>
                        </div>
                        
                        <p className="text-white mb-2">{post.content}</p>
                        
                        {post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.hashtags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="bg-slate-700 text-gray-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {post.status === 'pending' && (
                          <Button
                            onClick={() => cancelPost(post.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <h3 className="text-xl font-semibold text-electric-blue">Content Templates</h3>
              
              {contentTemplates.map((category) => (
                <Card key={category.category} className="bg-slate-800/50 border-electric-blue/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-electric-green">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.templates.map((template, index) => (
                      <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-gray-600">
                        <p className="text-white mb-2">{template.text}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {template.hashtags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="bg-slate-600 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          onClick={() => useTemplate(template)}
                          variant="outline"
                          size="sm"
                          className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}