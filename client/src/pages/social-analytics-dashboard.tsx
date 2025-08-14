import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Heart, MessageCircle, Repeat2, Eye, Users, Calendar, Clock, Target, Zap, Activity } from 'lucide-react';

interface PostMetrics {
  id: string;
  content: string;
  platform: string;
  timestamp: string;
  likes: number;
  comments: number;
  retweets: number;
  impressions: number;
  engagementRate: number;
  reach: number;
  clicks: number;
  hashtags: string[];
}

export default function SocialAnalyticsDashboard() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostMetrics[]>([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockPosts: PostMetrics[] = [
    {
      id: '1',
      content: '🚀 FlutterBye is revolutionizing Web3 communication! Join our tokenized messaging platform #FlutterBye #Web3',
      platform: 'Twitter',
      timestamp: '2025-01-14T10:00:00Z',
      likes: 245,
      comments: 32,
      retweets: 89,
      impressions: 15420,
      engagementRate: 2.38,
      reach: 12340,
      clicks: 156,
      hashtags: ['#FlutterBye', '#Web3', '#TokenizedMessaging']
    },
    {
      id: '2',
      content: 'Every message has value! Experience blockchain-powered communication ⚡ #SocialFi #Blockchain',
      platform: 'Twitter',
      timestamp: '2025-01-14T14:30:00Z',
      likes: 189,
      comments: 24,
      retweets: 67,
      impressions: 11230,
      engagementRate: 2.49,
      reach: 9870,
      clicks: 134,
      hashtags: ['#SocialFi', '#Blockchain', '#Innovation']
    },
    {
      id: '3',
      content: 'Web3 communication is here! Transform how you share value through messages 💎 #Future #Tech',
      platform: 'Twitter',
      timestamp: '2025-01-14T18:15:00Z',
      likes: 312,
      comments: 45,
      retweets: 124,
      impressions: 18950,
      engagementRate: 2.54,
      reach: 16780,
      clicks: 234,
      hashtags: ['#Future', '#Tech', '#Web3Revolution']
    }
  ];

  const engagementByHour = [
    { hour: '6AM', engagement: 1.8 },
    { hour: '9AM', engagement: 2.4 },
    { hour: '12PM', engagement: 3.1 },
    { hour: '3PM', engagement: 2.8 },
    { hour: '6PM', engagement: 3.5 },
    { hour: '9PM', engagement: 2.9 },
    { hour: '12AM', engagement: 1.5 }
  ];

  const contentTypePerformance = [
    { type: 'Platform Updates', posts: 45, avgEngagement: 2.8, color: '#8b5cf6' },
    { type: 'Educational', posts: 32, avgEngagement: 3.2, color: '#06b6d4' },
    { type: 'Community', posts: 28, avgEngagement: 2.4, color: '#10b981' },
    { type: 'News & Trends', posts: 21, avgEngagement: 2.1, color: '#f59e0b' }
  ];

  const topHashtags = [
    { tag: '#FlutterBye', uses: 145, performance: 94 },
    { tag: '#Web3', uses: 132, performance: 87 },
    { tag: '#TokenizedMessaging', uses: 89, performance: 91 },
    { tag: '#SocialFi', uses: 76, performance: 83 },
    { tag: '#Blockchain', uses: 64, performance: 79 }
  ];

  useEffect(() => {
    // Simulate loading and set mock data
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateTotalMetrics = () => {
    return posts.reduce((totals, post) => ({
      likes: totals.likes + post.likes,
      comments: totals.comments + post.comments,
      retweets: totals.retweets + post.retweets,
      impressions: totals.impressions + post.impressions,
      reach: totals.reach + post.reach,
      clicks: totals.clicks + post.clicks
    }), { likes: 0, comments: 0, retweets: 0, impressions: 0, reach: 0, clicks: 0 });
  };

  const getAverageEngagement = () => {
    if (posts.length === 0) return 0;
    return posts.reduce((sum, post) => sum + post.engagementRate, 0) / posts.length;
  };

  const totals = calculateTotalMetrics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 Social Media Analytics Dashboard
          </h1>
          <p className="text-slate-300 text-lg">
            Track performance, optimize content, and maximize engagement across all platforms
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="bg-slate-800 border-purple-500/30 text-white w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="bg-slate-800 border-purple-500/30 text-white w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Impressions</p>
                  <p className="text-2xl font-bold text-white">{totals.impressions.toLocaleString()}</p>
                  <p className="text-xs text-green-400">↗ +12.5% from last period</p>
                </div>
                <Eye className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg Engagement Rate</p>
                  <p className="text-2xl font-bold text-white">{getAverageEngagement().toFixed(2)}%</p>
                  <p className="text-xs text-green-400">↗ +0.3% from last period</p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Reach</p>
                  <p className="text-2xl font-bold text-white">{totals.reach.toLocaleString()}</p>
                  <p className="text-xs text-green-400">↗ +8.7% from last period</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Clicks</p>
                  <p className="text-2xl font-bold text-white">{totals.clicks.toLocaleString()}</p>
                  <p className="text-xs text-green-400">↗ +15.2% from last period</p>
                </div>
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-purple-500/30">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="posts" className="text-white data-[state=active]:bg-purple-600">
              Post Performance
            </TabsTrigger>
            <TabsTrigger value="timing" className="text-white data-[state=active]:bg-purple-600">
              Optimal Timing
            </TabsTrigger>
            <TabsTrigger value="content" className="text-white data-[state=active]:bg-purple-600">
              Content Analysis
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">Engagement by Content Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={contentTypePerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="type" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Bar dataKey="avgEngagement" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">Top Performing Hashtags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topHashtags.map((hashtag, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-purple-400 border-purple-500">
                          {hashtag.tag}
                        </Badge>
                        <span className="text-sm text-slate-300">{hashtag.uses} uses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${hashtag.performance}%` }}
                          />
                        </div>
                        <span className="text-sm text-white w-8">{hashtag.performance}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Post Performance Tab */}
          <TabsContent value="posts" className="space-y-6">
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="bg-slate-800/50 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-white mb-2">{post.content}</p>
                        <div className="flex gap-2 mb-2">
                          {post.hashtags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-slate-400">
                          {new Date(post.timestamp).toLocaleString()} • {post.platform}
                        </p>
                      </div>
                      <Badge 
                        className={`ml-4 ${post.engagementRate > 2.5 ? 'bg-green-600' : post.engagementRate > 2.0 ? 'bg-yellow-600' : 'bg-red-600'}`}
                      >
                        {post.engagementRate.toFixed(2)}% Engagement
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-white">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-white">{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Repeat2 className="w-4 h-4 text-green-400" />
                        <span className="text-white">{post.retweets}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-purple-400" />
                        <span className="text-white">{post.impressions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="text-white">{post.reach.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">{post.clicks}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                        <span className="text-white">{post.engagementRate.toFixed(2)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Optimal Timing Tab */}
          <TabsContent value="timing" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Engagement by Hour of Day</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={engagementByHour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="hour" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white mb-1">Best Time to Post</h3>
                  <p className="text-2xl font-bold text-green-400">6:00 PM</p>
                  <p className="text-sm text-slate-300">Highest engagement rate: 3.5%</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white mb-1">Best Day to Post</h3>
                  <p className="text-2xl font-bold text-blue-400">Wednesday</p>
                  <p className="text-sm text-slate-300">Average engagement: 2.8%</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white mb-1">Optimal Frequency</h3>
                  <p className="text-2xl font-bold text-purple-400">6 posts/day</p>
                  <p className="text-sm text-slate-300">Maximum reach without fatigue</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Analysis Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">Content Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={contentTypePerformance}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="posts"
                        label={({ type, value }) => `${type}: ${value}`}
                      >
                        {contentTypePerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">✓ High Performing Content</h4>
                    <p className="text-sm text-slate-300">
                      Educational posts get 33% higher engagement. Consider increasing educational content frequency.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">📊 Timing Optimization</h4>
                    <p className="text-sm text-slate-300">
                      Post between 6-9 PM for maximum engagement. Avoid posting during 12-3 AM.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">🏷️ Hashtag Strategy</h4>
                    <p className="text-sm text-slate-300">
                      #FlutterBye and #TokenizedMessaging show highest performance. Use 3-5 hashtags per post.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <h4 className="font-semibold text-yellow-400 mb-2">🎯 Audience Insights</h4>
                    <p className="text-sm text-slate-300">
                      Your audience is most active on weekday evenings. Tech and innovation content performs best.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}