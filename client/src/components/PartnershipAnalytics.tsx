import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Eye, BarChart3 } from "lucide-react";

interface Partnership {
  id: string;
  name: string;
  partnershipType: string;
  clickCount: number;
  lastClickedAt: string;
}

interface PartnershipAnalytics {
  totalClicks: number;
  activePartnerships: number;
  totalPartnerships: number;
}

export function PartnershipAnalytics() {
  const { data: partnershipsData, isLoading } = useQuery({
    queryKey: ["/api/partnerships"],
    refetchInterval: 10000, // Refresh every 10 seconds for real-time data
  });

  if (isLoading) {
    return (
      <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const partnerships = partnershipsData?.partnerships || [];
  const analytics = partnershipsData?.analytics || { totalClicks: 0, activePartnerships: 0, totalPartnerships: 0 };
  
  // Sort partnerships by click count for leaderboard
  const sortedPartnerships = [...partnerships].sort((a, b) => b.clickCount - a.clickCount);
  const topPartner = sortedPartnerships[0];
  const maxClicks = topPartner?.clickCount || 1;

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-electric-blue/20 rounded-lg">
                <Eye className="w-5 h-5 text-electric-blue" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Clicks</p>
                <p className="text-2xl font-bold text-white">{analytics.totalClicks.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-electric-green/20 rounded-lg">
                <Users className="w-5 h-5 text-electric-green" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active Partners</p>
                <p className="text-2xl font-bold text-white">{analytics.activePartnerships}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Avg Clicks/Partner</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.activePartnerships > 0 ? Math.round(analytics.totalClicks / analytics.activePartnerships).toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partnership Leaderboard */}
      <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-5 h-5 text-electric-blue" />
            Partnership Performance Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedPartnerships.map((partnership, index) => {
            const percentage = (partnership.clickCount / maxClicks) * 100;
            const lastClickDate = new Date(partnership.lastClickedAt).toLocaleDateString();
            
            return (
              <div key={partnership.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-sm font-bold text-white">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white">{partnership.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            partnership.partnershipType === 'strategic' ? 'border-purple-500 text-purple-300' :
                            partnership.partnershipType === 'technology' ? 'border-blue-500 text-blue-300' :
                            partnership.partnershipType === 'marketing' ? 'border-green-500 text-green-300' :
                            'border-orange-500 text-orange-300'
                          }`}
                        >
                          {partnership.partnershipType}
                        </Badge>
                        <span className="text-xs text-slate-500">Last: {lastClickDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-electric-green">{partnership.clickCount.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">clicks</p>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2 bg-slate-700"
                  style={{
                    '--progress-background': partnership.partnershipType === 'strategic' ? 'rgb(147 51 234)' :
                                          partnership.partnershipType === 'technology' ? 'rgb(59 130 246)' :
                                          partnership.partnershipType === 'marketing' ? 'rgb(34 197 94)' :
                                          'rgb(249 115 22)'
                  } as React.CSSProperties}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Real-time Status */}
      <div className="text-center">
        <Badge variant="outline" className="border-electric-blue/50 text-electric-blue bg-electric-blue/10">
          <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse mr-2"></div>
          Live Analytics • Updates every 10 seconds
        </Badge>
      </div>
    </div>
  );
}