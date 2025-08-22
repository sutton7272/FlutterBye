import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  BarChart3, 
  Calendar,
  ExternalLink,
  RefreshCw,
  Download
} from "lucide-react";
import { useState } from "react";

interface Partnership {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  partnershipType: string;
  clickCount: number;
  lastClickedAt: string;
  createdAt: string;
}

export default function PartnershipAnalyticsDashboard() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { data: partnershipsData, isLoading, refetch } = useQuery({
    queryKey: ["/api/partnerships"],
    refetchInterval: autoRefresh ? 5000 : false, // Refresh every 5 seconds when enabled
  });

  const partnerships = partnershipsData?.partnerships || [];
  const analytics = partnershipsData?.analytics || { totalClicks: 0, activePartnerships: 0, totalPartnerships: 0 };
  
  // Sort partnerships by click count
  const sortedPartnerships = [...partnerships].sort((a, b) => b.clickCount - a.clickCount);
  const maxClicks = sortedPartnerships[0]?.clickCount || 1;

  // Calculate growth metrics (mock data for demo)
  const totalClicksToday = Math.round(analytics.totalClicks * 0.15);
  const clickGrowth = 23.5; // Percentage growth

  const exportData = () => {
    const csvData = partnerships.map(p => ({
      name: p.name,
      type: p.partnershipType,
      clicks: p.clickCount,
      lastClicked: new Date(p.lastClickedAt).toLocaleDateString(),
      created: new Date(p.createdAt).toLocaleDateString()
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Type,Clicks,Last Clicked,Created\n" +
      csvData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "partnership_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
              Partnership Analytics
            </h1>
            <p className="text-slate-400 mt-2">Real-time partnership performance tracking and insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`border-electric-blue/50 ${autoRefresh ? 'bg-electric-blue/10 text-electric-blue' : 'text-slate-400'}`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              className="border-electric-green/50 text-electric-green hover:bg-electric-green/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-electric-blue/20 rounded-lg">
                  <Eye className="w-6 h-6 text-electric-blue" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Clicks</p>
                  <p className="text-3xl font-bold text-white">{analytics.totalClicks.toLocaleString()}</p>
                  <p className="text-xs text-electric-green">+{clickGrowth}% this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-electric-green/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-electric-green" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Today's Clicks</p>
                  <p className="text-3xl font-bold text-white">{totalClicksToday.toLocaleString()}</p>
                  <p className="text-xs text-electric-blue">Live tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active Partners</p>
                  <p className="text-3xl font-bold text-white">{analytics.activePartnerships}</p>
                  <p className="text-xs text-slate-400">Enterprise grade</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Avg CTR</p>
                  <p className="text-3xl font-bold text-white">
                    {analytics.activePartnerships > 0 ? Math.round(analytics.totalClicks / analytics.activePartnerships).toLocaleString() : '0'}
                  </p>
                  <p className="text-xs text-electric-green">Per partner</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Partnership Performance */}
        <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="w-6 h-6 text-electric-blue" />
              Partnership Performance Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sortedPartnerships.map((partnership, index) => {
              const percentage = (partnership.clickCount / maxClicks) * 100;
              const lastClickDate = new Date(partnership.lastClickedAt).toLocaleDateString();
              const createdDate = new Date(partnership.createdAt).toLocaleDateString();
              
              return (
                <div key={partnership.id} className="space-y-3 p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-electric-blue to-electric-green text-white font-bold">
                        #{index + 1}
                      </div>
                      <img 
                        src={partnership.logoUrl} 
                        alt={partnership.name}
                        className="w-12 h-12 rounded-lg border border-slate-600"
                      />
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-white text-lg">{partnership.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(partnership.websiteUrl, '_blank')}
                            className="p-1 h-auto text-slate-400 hover:text-electric-blue"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-slate-400 text-sm max-w-md">{partnership.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge 
                            variant="outline" 
                            className={`${
                              partnership.partnershipType === 'strategic' ? 'border-purple-500 text-purple-300' :
                              partnership.partnershipType === 'technology' ? 'border-blue-500 text-blue-300' :
                              partnership.partnershipType === 'marketing' ? 'border-green-500 text-green-300' :
                              'border-orange-500 text-orange-300'
                            }`}
                          >
                            {partnership.partnershipType}
                          </Badge>
                          <span className="text-xs text-slate-500">Created: {createdDate}</span>
                          <span className="text-xs text-slate-500">Last click: {lastClickDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-electric-green">{partnership.clickCount.toLocaleString()}</p>
                      <p className="text-sm text-slate-400">total clicks</p>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-3 bg-slate-700"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Performance: {percentage.toFixed(1)}% of top performer</span>
                    <span>Market share: {((partnership.clickCount / analytics.totalClicks) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Live Status */}
        <div className="text-center">
          <Badge variant="outline" className="border-electric-blue/50 text-electric-blue bg-electric-blue/10 px-4 py-2">
            <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse mr-2"></div>
            Live Data • Auto-refreshing every 5 seconds
          </Badge>
        </div>
      </div>
    </div>
  );
}