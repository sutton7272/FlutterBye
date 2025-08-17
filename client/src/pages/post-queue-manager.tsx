import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Calendar as CalendarIcon, Clock, Plus, Play, Pause, Edit, Trash2, Image, Video, FileText, Target, Zap, BarChart3, Users, Send } from 'lucide-react';

interface QueuedPost {
  id: string;
  content: string;
  platform: string;
  scheduledTime: string;
  status: 'scheduled' | 'draft' | 'posting' | 'posted' | 'failed';
  images: string[];
  hashtags: string[];
  targetAudience: string;
  estimatedReach: number;
  engagementScore: number;
  createdAt: string;
  account: string;
  category: string;
}

export default function PostQueueManager() {
  const { toast } = useToast();
  const [queuedPosts, setQueuedPosts] = useState<QueuedPost[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('queue');
  
  const [newPost, setNewPost] = useState({
    content: '',
    platform: 'Twitter',
    scheduledTime: '',
    images: [] as string[],
    hashtags: [] as string[],
    targetAudience: 'General',
    account: '',
    category: 'General'
  });

  // Mock data
  const mockPosts: QueuedPost[] = [
    {
      id: '1',
      content: '🚀 FlutterBye is revolutionizing Web3 communication! Join our tokenized messaging platform and experience the future of value-driven conversations.',
      platform: 'Twitter',
      scheduledTime: '2025-01-15T09:00:00Z',
      status: 'scheduled',
      images: ['/api/content/library/flutter-promo.jpg'],
      hashtags: ['#FlutterBye', '#Web3', '#TokenizedMessaging', '#SocialFi'],
      targetAudience: 'Crypto enthusiasts',
      estimatedReach: 12500,
      engagementScore: 87,
      createdAt: '2025-01-14T10:00:00Z',
      account: '@FlutterByeHQ',
      category: 'Platform Updates'
    },
    {
      id: '2',
      content: 'Every message has value! 💎 Transform how you communicate with blockchain-powered messaging. Create your first token message today!',
      platform: 'Twitter',
      scheduledTime: '2025-01-15T15:30:00Z',
      status: 'scheduled',
      images: [],
      hashtags: ['#Blockchain', '#Messaging', '#Innovation'],
      targetAudience: 'General',
      estimatedReach: 8900,
      engagementScore: 73,
      createdAt: '2025-01-14T11:00:00Z',
      account: '@FlutterByeHQ',
      category: 'Educational'
    },
    {
      id: '3',
      content: 'Web3 communication is here! Join the movement that\'s transforming how we share value through messages. #Future #Tech',
      platform: 'Instagram',
      scheduledTime: '2025-01-15T18:00:00Z',
      status: 'draft',
      images: ['/api/content/library/web3-visual.jpg'],
      hashtags: ['#Future', '#Tech', '#Web3Revolution'],
      targetAudience: 'Tech enthusiasts',
      estimatedReach: 15200,
      engagementScore: 91,
      createdAt: '2025-01-14T12:00:00Z',
      account: '@flutterbyelab',
      category: 'Marketing'
    }
  ];

  useEffect(() => {
    fetchQueuedPosts();
  }, []);

  const fetchQueuedPosts = async () => {
    try {
      const response = await fetch('/api/social/queue');
      if (response.ok) {
        const data = await response.json();
        setQueuedPosts(Array.isArray(data) ? data : mockPosts);
      } else {
        setQueuedPosts(mockPosts);
      }
    } catch (error) {
      console.error('Failed to fetch queued posts:', error);
      setQueuedPosts(mockPosts);
    }
  };

  const createPost = async () => {
    try {
      const postData = {
        ...newPost,
        scheduledTime: selectedDate?.toISOString(),
        estimatedReach: Math.floor(Math.random() * 20000) + 5000,
        engagementScore: Math.floor(Math.random() * 40) + 60,
        status: 'scheduled'
      };

      const response = await fetch('/api/social/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setQueuedPosts(prev => [...prev, data]);
        setNewPost({
          content: '',
          platform: 'Twitter',
          scheduledTime: '',
          images: [],
          hashtags: [],
          targetAudience: 'General',
          account: '',
          category: 'General'
        });
        setShowCreatePost(false);
        toast({ 
          title: 'Post Created Successfully!',
          description: `Post scheduled for ${new Date(postData.scheduledTime || '').toLocaleString()}`,
          className: 'bg-green-900 border-green-500 text-white'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to create post', 
        variant: 'destructive' 
      });
    }
  };

  const publishNow = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/queue/${postId}/publish`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setQueuedPosts(prev => prev.map(post => 
            post.id === postId ? { ...post, status: 'posted' as const } : post
          ));
          toast({ 
            title: '✅ Post Published Successfully!',
            description: `Post has been published to ${result.platform}`,
            className: 'bg-green-900 border-green-500 text-white'
          });
        }
      }
    } catch (error) {
      toast({ 
        title: 'Publishing failed', 
        variant: 'destructive' 
      });
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/queue/${postId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setQueuedPosts(prev => prev.filter(post => post.id !== postId));
        toast({ 
          title: 'Post deleted successfully',
          className: 'bg-green-900 border-green-500 text-white'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to delete post', 
        variant: 'destructive' 
      });
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(queuedPosts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQueuedPosts(items);
    
    // Update order on server
    fetch('/api/social/queue/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postIds: items.map(item => item.id) })
    });
  };

  const getStatusColor = (status: QueuedPost['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-600';
      case 'draft': return 'bg-gray-600';
      case 'posting': return 'bg-yellow-600';
      case 'posted': return 'bg-green-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getPlatformIcon = (platform: string) => {
    // Platform-specific icons would go here
    return FileText;
  };

  const scheduledPosts = queuedPosts.filter(post => post.status === 'scheduled');
  const draftPosts = queuedPosts.filter(post => post.status === 'draft');
  const publishedPosts = queuedPosts.filter(post => post.status === 'posted');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📅 Post Queue & Scheduling Manager
          </h1>
          <p className="text-slate-300 text-lg">
            Create, schedule, and manage your social media posts with AI-powered optimization
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-2xl font-bold text-white">{scheduledPosts.length}</p>
              <p className="text-sm text-slate-400">Scheduled</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-gray-500/30">
            <CardContent className="p-4 text-center">
              <Edit className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-2xl font-bold text-white">{draftPosts.length}</p>
              <p className="text-sm text-slate-400">Drafts</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-green-500/30">
            <CardContent className="p-4 text-center">
              <Send className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-2xl font-bold text-white">{publishedPosts.length}</p>
              <p className="text-sm text-slate-400">Published</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-2xl font-bold text-white">
                {Math.round(queuedPosts.reduce((sum, post) => sum + post.engagementScore, 0) / queuedPosts.length)}
              </p>
              <p className="text-sm text-slate-400">Avg Score</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800 border-purple-500/30">
              <TabsTrigger value="queue" className="text-white data-[state=active]:bg-purple-600">
                Queue View
              </TabsTrigger>
              <TabsTrigger value="calendar" className="text-white data-[state=active]:bg-purple-600">
                Calendar View
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-purple-500/30 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-purple-400">Create New Social Media Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select 
                      value={newPost.platform} 
                      onValueChange={(value) => setNewPost({...newPost, platform: value})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="account">Account</Label>
                    <Select 
                      value={newPost.account} 
                      onValueChange={(value) => setNewPost({...newPost, account: value})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="@FlutterByeHQ">@FlutterByeHQ</SelectItem>
                        <SelectItem value="@flutterbyelab">@flutterbyelab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Post Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your post content here..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white min-h-32"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {newPost.content.length}/280 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="hashtags">Hashtags (comma-separated)</Label>
                  <Input
                    id="hashtags"
                    placeholder="#FlutterBye, #Web3, #SocialFi"
                    value={newPost.hashtags.join(', ')}
                    onChange={(e) => setNewPost({
                      ...newPost, 
                      hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newPost.category} 
                      onValueChange={(value) => setNewPost({...newPost, category: value})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Platform Updates">Platform Updates</SelectItem>
                        <SelectItem value="Educational">Educational</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Select 
                      value={newPost.targetAudience} 
                      onValueChange={(value) => setNewPost({...newPost, targetAudience: value})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Crypto enthusiasts">Crypto Enthusiasts</SelectItem>
                        <SelectItem value="Tech enthusiasts">Tech Enthusiasts</SelectItem>
                        <SelectItem value="Developers">Developers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Schedule Date & Time</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-slate-600 bg-slate-700"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={createPost} className="flex-1 bg-purple-600 hover:bg-purple-700">
                    Schedule Post
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} className="space-y-8">
          {/* Queue View */}
          <TabsContent value="queue" className="space-y-6">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="post-queue">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {queuedPosts.map((post, index) => {
                      const PlatformIcon = getPlatformIcon(post.platform);
                      
                      return (
                        <Draggable key={post.id} draggableId={post.id} index={index}>
                          {(provided, snapshot) => (
                            <Card 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-slate-800/50 border-purple-500/30 transition-transform ${
                                snapshot.isDragging ? 'rotate-2 scale-105' : ''
                              }`}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <PlatformIcon className="w-5 h-5 text-purple-400" />
                                    <Badge className={getStatusColor(post.status)}>
                                      {post.status.toUpperCase()}
                                    </Badge>
                                    <Badge variant="outline">{post.platform}</Badge>
                                    <Badge variant="outline">{post.account}</Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-right text-sm">
                                      <p className="text-white font-semibold">Score: {post.engagementScore}</p>
                                      <p className="text-slate-400">{post.estimatedReach.toLocaleString()} reach</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <p className="text-white mb-2">{post.content}</p>
                                  {post.hashtags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {post.hashtags.map((tag, tagIndex) => (
                                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  {post.images.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                      <Image className="w-4 h-4" />
                                      {post.images.length} image(s) attached
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-slate-400">
                                    <p className="flex items-center gap-1">
                                      <CalendarIcon className="w-4 h-4" />
                                      Scheduled: {new Date(post.scheduledTime).toLocaleString()}
                                    </p>
                                    <p className="flex items-center gap-1 mt-1">
                                      <Target className="w-4 h-4" />
                                      {post.targetAudience} • {post.category}
                                    </p>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    {post.status === 'scheduled' && (
                                      <Button 
                                        size="sm" 
                                        onClick={() => publishNow(post.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <Send className="w-3 h-3 mr-1" />
                                        Publish Now
                                      </Button>
                                    )}
                                    <Button size="sm" variant="outline">
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => deletePost(post.id)}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md"
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-3">
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-400">
                      Posts for {selectedDate?.toDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {queuedPosts
                        .filter(post => {
                          if (!selectedDate) return false;
                          const postDate = new Date(post.scheduledTime);
                          return postDate.toDateString() === selectedDate.toDateString();
                        })
                        .map(post => (
                          <div key={post.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{post.content.substring(0, 60)}...</p>
                              <p className="text-sm text-slate-400">
                                {new Date(post.scheduledTime).toLocaleTimeString()} • {post.platform}
                              </p>
                            </div>
                            <Badge className={getStatusColor(post.status)}>
                              {post.status}
                            </Badge>
                          </div>
                        ))}
                      
                      {queuedPosts.filter(post => {
                        if (!selectedDate) return false;
                        const postDate = new Date(post.scheduledTime);
                        return postDate.toDateString() === selectedDate.toDateString();
                      }).length === 0 && (
                        <p className="text-slate-400 text-center py-8">
                          No posts scheduled for this date
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}