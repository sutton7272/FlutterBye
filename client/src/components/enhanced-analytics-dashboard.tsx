import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Heart, 
  Smartphone, 
  Globe, 
  Zap,
  Users,
  DollarSign,
  Eye,
  MessageSquare,
  Target,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalCampaigns: number;
    totalMessages: number;
    totalRecipients: number;
    averageViralScore: number;
    totalRevenue: number;
    deliveryRate: number;
    engagementRate: number;
    conversionRate: number;
  };
  emotionBreakdown: Array<{
    emotion: string;
    count: number;
    avgViralScore: number;
    revenue: number;
    color: string;
  }>;
  timeSeriesData: Array<{
    date: string;
    messages: number;
    revenue: number;
    engagement: number;
  }>;
  topPerformingMessages: Array<{
    id: string;
    message: string;
    emotion: string;
    viralScore: number;
    reach: number;
    revenue: number;
  }>;
  geographicData: Array<{
    region: string;
    messages: number;
    engagement: number;
  }>;
}

export function EnhancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("messages");

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics/sms-dashboard", timeRange],
    refetchInterval: 60000
  });

  // Mock data for demonstration
  const mockAnalytics: AnalyticsData = {
    overview: {
      totalCampaigns: 24,
      totalMessages: 1847,
      totalRecipients: 892,
      averageViralScore: 73.2,
      totalRevenue: 487.50,
      deliveryRate: 98.7,
      engagementRate: 67.4,
      conversionRate: 23.8
    },
    emotionBreakdown: [
      { emotion: "Love", count: 523, avgViralScore: 82.1, revenue: 156.90, color: "text-pink-400" },
      { emotion: "Joy", count: 412, avgViralScore: 78.5, revenue: 123.60, color: "text-yellow-400" },
      { emotion: "Gratitude", count: 298, avgViralScore: 71.2, revenue: 89.40, color: "text-green-400" },
      { emotion: "Support", count: 267, avgViralScore: 69.8, revenue: 80.10, color: "text-blue-400" },
      { emotion: "Motivation", count: 201, avgViralScore: 75.3, revenue: 60.30, color: "text-red-400" },
      { emotion: "Celebration", count: 146, avgViralScore: 79.7, revenue: 43.80, color: "text-purple-400" }
    ],
    timeSeriesData: [
      { date: "2025-08-02", messages: 142, revenue: 42.60, engagement: 68.5 },
      { date: "2025-08-03", messages: 189, revenue: 56.70, engagement: 71.2 },
      { date: "2025-08-04", messages: 156, revenue: 46.80, engagement: 65.8 },
      { date: "2025-08-05", messages: 234, revenue: 70.20, engagement: 74.1 },
      { date: "2025-08-06", messages: 298, revenue: 89.40, engagement: 78.9 },
      { date: "2025-08-07", messages: 267, revenue: 80.10, engagement: 72.3 },
      { date: "2025-08-08", messages: 201, revenue: 60.30, engagement: 69.7 }
    ],
    topPerformingMessages: [
      { 
        id: "1", 
        message: "Thank you for always believing in me! You mean everything 💕", 
        emotion: "Love", 
        viralScore: 94.2, 
        reach: 15670, 
        revenue: 23.40 
      },
      { 
        id: "2", 
        message: "Congratulations on your amazing achievement! So proud! 🎉", 
        emotion: "Celebration", 
        viralScore: 91.8, 
        reach: 12340, 
        revenue: 18.50 
      },
      { 
        id: "3", 
        message: "Sending you strength and positive energy today 💪✨", 
        emotion: "Support", 
        viralScore: 89.5, 
        reach: 10890, 
        revenue: 16.30 
      }
    ],
    geographicData: [
      { region: "North America", messages: 687, engagement: 72.1 },
      { region: "Europe", messages: 453, engagement: 68.9 },
      { region: "Asia Pacific", messages: 392, engagement: 75.3 },
      { region: "Latin America", messages: 198, engagement: 71.7 },
      { region: "Africa", messages: 117, engagement: 69.2 }
    ]
  };

  const currentData = analytics || mockAnalytics;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const timeRangeOptions = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
    { value: "1y", label: "Last Year" }
  ];

  const getChangeIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 0) return { icon: ArrowUp, color: "text-green-400", value: `+${change.toFixed(1)}%` };
    if (change < 0) return { icon: ArrowDown, color: "text-red-400", value: `${change.toFixed(1)}%` };
    return { icon: Minus, color: "text-gray-400", value: "0%" };
  };

  // This function is available but not used in the current implementation
  // It's kept for future use when implementing change indicators
  console.log("getChangeIndicator available:", getChangeIndicator);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Enhanced Analytics Dashboard</h2>
          <p className="text-gray-400">Track performance and insights across your SMS campaigns</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Campaigns</p>
                <p className="text-3xl font-bold text-white">{currentData.overview.totalCampaigns}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-xs text-green-400">+12.5%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Messages Sent</p>
                <p className="text-3xl font-bold text-white">{currentData.overview.totalMessages.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-xs text-green-400">+23.8%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(currentData.overview.totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-xs text-green-400">+34.2%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Viral Score</p>
                <p className="text-3xl font-bold text-white">{formatPercentage(currentData.overview.averageViralScore)}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-xs text-green-400">+5.7%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/40 backdrop-blur-sm border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-white text-lg">Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-white font-bold">{formatPercentage(currentData.overview.deliveryRate)}</span>
              </div>
              <Progress value={currentData.overview.deliveryRate} className="h-3" />
              <div className="text-xs text-gray-400">
                {Math.round((currentData.overview.deliveryRate / 100) * currentData.overview.totalMessages)} messages delivered
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-white text-lg">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Interaction Rate</span>
                <span className="text-white font-bold">{formatPercentage(currentData.overview.engagementRate)}</span>
              </div>
              <Progress value={currentData.overview.engagementRate} className="h-3" />
              <div className="text-xs text-gray-400">
                {Math.round((currentData.overview.engagementRate / 100) * currentData.overview.totalRecipients)} users engaged
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-white text-lg">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Token Creation</span>
                <span className="text-white font-bold">{formatPercentage(currentData.overview.conversionRate)}</span>
              </div>
              <Progress value={currentData.overview.conversionRate} className="h-3" />
              <div className="text-xs text-gray-400">
                {Math.round((currentData.overview.conversionRate / 100) * currentData.overview.totalMessages)} tokens created
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="emotions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emotions">Emotion Breakdown</TabsTrigger>
          <TabsTrigger value="performance">Top Performers</TabsTrigger>
          <TabsTrigger value="geography">Geographic Data</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="emotions" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-sm border-gray-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-400" />
                Emotion Performance Analysis
              </CardTitle>
              <CardDescription className="text-gray-300">
                See how different emotions perform in your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentData.emotionBreakdown.map((emotion, index) => (
                  <div key={emotion.emotion} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${emotion.color}`}>{emotion.emotion}</span>
                        <Badge className="bg-white/10 text-white">
                          {emotion.count} messages
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{formatPercentage(emotion.avgViralScore)}</div>
                        <div className="text-xs text-gray-400">{formatCurrency(emotion.revenue)}</div>
                      </div>
                    </div>
                    <Progress value={emotion.avgViralScore} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-sm border-gray-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Top Performing Messages
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your highest viral scoring messages and their impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentData.topPerformingMessages.map((message, index) => (
                  <div key={message.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <Badge className="bg-purple-600/20 text-purple-200">
                          {message.emotion}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{formatPercentage(message.viralScore)}</div>
                        <div className="text-xs text-gray-400">Viral Score</div>
                      </div>
                    </div>
                    
                    <p className="text-white mb-3 line-clamp-2">{message.message}</p>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-gray-400">Reach: </span>
                          <span className="text-white font-semibold">{message.reach.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Revenue: </span>
                          <span className="text-green-400 font-semibold">{formatCurrency(message.revenue)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-sm border-gray-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-400" />
                Geographic Performance
              </CardTitle>
              <CardDescription className="text-gray-300">
                Regional breakdown of your SMS campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentData.geographicData.map((region) => (
                  <div key={region.region} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">{region.region}</span>
                      <div className="text-right">
                        <div className="text-white">{region.messages} messages</div>
                        <div className="text-sm text-gray-400">{formatPercentage(region.engagement)} engagement</div>
                      </div>
                    </div>
                    <Progress value={region.engagement} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-sm border-gray-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-400" />
                Performance Trends
              </CardTitle>
              <CardDescription className="text-gray-300">
                Track your campaign performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Advanced Charts Coming Soon</h3>
                <p className="text-gray-400">Interactive trend charts and deeper analytics will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}