import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Users, 
  Rocket, 
  Target, 
  BarChart3, 
  Activity, 
  Zap, 
  ArrowLeft,
  Globe,
  Share2,
  Heart,
  Star,
  MessageCircle,
  RefreshCw,
  Eye,
  ThumbsUp
} from "lucide-react";

export default function AdminGrowth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin authentication
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin-authenticated');
    if (!adminAuth) {
      window.location.href = '/admin-gateway';
      return;
    }
  }, []);

  // Growth Analytics Data
  const { data: growthMetrics } = useQuery({
    queryKey: ["/api/growth/metrics"],
    refetchInterval: 10000
  });

  // Viral Analytics Data
  const { data: viralData } = useQuery({
    queryKey: ["/api/viral/admin-analytics"],
    refetchInterval: 10000
  });

  // User Engagement Data
  const { data: engagement } = useQuery({
    queryKey: ["/api/growth/engagement"]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/admin-gateway">
            <Button variant="outline" className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              ← Admin Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-green-600 rounded-xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Growth Acceleration Hub
            </h1>
          </div>
          <p className="text-green-200 text-lg max-w-3xl mx-auto">
            Viral growth tracking, user acquisition analytics, and engagement optimization
          </p>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                New Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {growthMetrics?.newUsers || 1247}
              </div>
              <div className="text-green-200 text-sm">This week</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span className="text-xs text-green-400">+23%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {growthMetrics?.activeUsers || 8934}
              </div>
              <div className="text-blue-200 text-sm">Daily active</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-blue-400">+15%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Rocket className="h-5 w-5 text-purple-400" />
                Viral Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {viralData?.viralTokens || 0}
              </div>
              <div className="text-purple-200 text-sm">Going viral</div>
              <div className="flex items-center gap-1 mt-2">
                <Zap className="h-3 w-3 text-purple-400" />
                <span className="text-xs text-purple-400">Hot</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-400" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                {growthMetrics?.conversionRate || 12.3}%
              </div>
              <div className="text-yellow-200 text-sm">User to creator</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-yellow-400" />
                <span className="text-xs text-yellow-400">+5%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Growth Tabs */}
        <Tabs defaultValue="viral" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="viral" className="data-[state=active]:bg-green-600">
              <Rocket className="h-4 w-4 mr-2" />
              Viral Growth
            </TabsTrigger>
            <TabsTrigger value="engagement" className="data-[state=active]:bg-blue-600">
              <Heart className="h-4 w-4 mr-2" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="acquisition" className="data-[state=active]:bg-purple-600">
              <Users className="h-4 w-4 mr-2" />
              User Acquisition
            </TabsTrigger>
            <TabsTrigger value="retention" className="data-[state=active]:bg-orange-600">
              <Target className="h-4 w-4 mr-2" />
              Retention
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-pink-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Viral Growth Tab */}
          <TabsContent value="viral">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-green-400" />
                    Viral Token Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Active Viral Tokens</span>
                      <Badge variant="default" className="bg-green-600">
                        {viralData?.viralTokens || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Growth Rate</span>
                      <span className="text-green-400 font-bold">
                        {viralData?.growthRate || 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Viral Score</span>
                      <div className="flex items-center gap-2">
                        <Progress value={viralData?.viralScore || 0} className="w-20" />
                        <span className="text-white text-sm">{viralData?.viralScore || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Share2 className="h-6 w-6 text-blue-400" />
                    Social Sharing Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Total Shares</span>
                      <span className="text-blue-400 font-bold">
                        {viralData?.totalShares?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Share Rate</span>
                      <span className="text-blue-400 font-bold">
                        {viralData?.shareRate || 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Viral Coefficient</span>
                      <span className="text-blue-400 font-bold">
                        {viralData?.viralCoefficient || 0}x
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="h-6 w-6 text-blue-400" />
                  User Engagement Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center">
                      <Eye className="h-8 w-8 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {engagement?.views?.toLocaleString() || "12,453"}
                    </div>
                    <div className="text-sm text-slate-400">Total Views</div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center">
                      <ThumbsUp className="h-8 w-8 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {engagement?.likes?.toLocaleString() || "3,892"}
                    </div>
                    <div className="text-sm text-slate-400">Total Likes</div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {engagement?.comments?.toLocaleString() || "1,567"}
                    </div>
                    <div className="text-sm text-slate-400">Comments</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Acquisition Tab */}
          <TabsContent value="acquisition">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-6 w-6 text-purple-400" />
                  User Acquisition Channels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Acquisition Analytics</h3>
                  <p className="text-slate-400">Track user acquisition across channels</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retention Tab */}
          <TabsContent value="retention">
            <Card className="bg-slate-800/50 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-400" />
                  User Retention Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Retention Metrics</h3>
                  <p className="text-slate-400">Monitor user retention and churn</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="bg-slate-800/50 border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-pink-400" />
                  Advanced Growth Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-pink-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Growth Analytics</h3>
                  <p className="text-slate-400">Deep dive into growth patterns</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}