import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { Download, TrendingUp, Users, Coins, DollarSign, Activity } from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/admin/analytics'],
  });

  const { data: metrics } = useQuery({
    queryKey: ['/api/admin/metrics'],
  });

  const { data: smsAnalytics } = useQuery({
    queryKey: ['/api/admin/sms-analytics'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const overviewStats = [
    {
      title: "Total Users",
      value: analytics?.totalUsers || 0,
      icon: Users,
      change: "+12%",
      color: "text-blue-400"
    },
    {
      title: "Tokens Created",
      value: analytics?.totalTokens || 0,
      icon: Coins,
      change: "+8%",
      color: "text-green-400"
    },
    {
      title: "Total Value Locked",
      value: `${analytics?.totalValueLocked || 0} SOL`,
      icon: DollarSign,
      change: "+15%",
      color: "text-yellow-400"
    },
    {
      title: "Active Sessions",
      value: metrics?.requestsLastHour || 0,
      icon: Activity,
      change: "+3%",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Real-time insights into Flutterbye platform performance
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {overviewStats.map((stat, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Health */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">System Health</CardTitle>
            <CardDescription>Real-time performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-white">{metrics?.averageResponseTime || 0}ms</span>
                </div>
                <Progress 
                  value={Math.max(0, 100 - (metrics?.averageResponseTime || 0) / 20)} 
                  className="bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Error Rate</span>
                  <span className="text-white">{metrics?.errorRate || 0}%</span>
                </div>
                <Progress 
                  value={100 - (metrics?.errorRate || 0)} 
                  className="bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-white">99.9%</span>
                </div>
                <Progress value={99.9} className="bg-gray-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="tokens" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="tokens" className="data-[state=active]:bg-purple-600">
              Token Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              User Behavior
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-purple-600">
              Revenue Metrics
            </TabsTrigger>
            <TabsTrigger value="sms" className="data-[state=active]:bg-purple-600">
              SMS Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Token Creation Trends */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Token Creation Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics?.tokenCreationTrends || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="tokens" 
                        stroke="#8B5CF6" 
                        fill="url(#colorTokens)" 
                      />
                      <defs>
                        <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Token Value Distribution */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Token Value Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics?.valueDistribution || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(analytics?.valueDistribution || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Popular Token Messages */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Popular Token Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(analytics?.popularMessages || []).map((message: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-purple-400 border-purple-400">
                          #{index + 1}
                        </Badge>
                        <span className="text-white">{message.text}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {message.count} tokens
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SMS Emotion Breakdown */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Emotion Distribution</CardTitle>
                  <CardDescription>SMS-to-token emotion analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={smsAnalytics?.emotionBreakdown ? Object.entries(smsAnalytics.emotionBreakdown).map(([emotion, count]) => ({ emotion, count })) : []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="emotion" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="#06B6D4" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* SMS Features Usage */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">SMS Features</CardTitle>
                  <CardDescription>Advanced SMS token features usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Time-Locked Tokens</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white">{smsAnalytics?.timeLockUsage || 0}</span>
                      <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                        {smsAnalytics?.totalSMSTokens ? Math.round((smsAnalytics.timeLockUsage / smsAnalytics.totalSMSTokens) * 100) : 0}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Burn-to-Read Tokens</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white">{smsAnalytics?.burnToReadUsage || 0}</span>
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        {smsAnalytics?.totalSMSTokens ? Math.round((smsAnalytics.burnToReadUsage / smsAnalytics.totalSMSTokens) * 100) : 0}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total SMS Tokens</span>
                    <span className="text-white font-semibold">{smsAnalytics?.totalSMSTokens || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average Value</span>
                    <span className="text-white font-semibold">
                      {smsAnalytics?.averageValue ? smsAnalytics.averageValue.toFixed(4) : '0.0000'} SOL
                    </span>
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