import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Brain, 
  Lightbulb, 
  Settings, 
  User,
  TrendingUp,
  ArrowRight,
  Sparkles
} from "lucide-react";

export function PersonalizationWidget() {
  const queryClient = useQueryClient();

  // Fetch user recommendations
  const { data: recommendationsData } = useQuery({
    queryKey: ["/api/personalization/recommendations"],
    retry: false,
  });

  // Fetch quick profile info
  const { data: profile } = useQuery({
    queryKey: ["/api/personalization/profile"],
    retry: false,
  });

  // Track behavior for interactions
  const trackBehavior = useMutation({
    mutationFn: async (action: string) => {
      return apiRequest("/api/personalization/track", "POST", { action });
    },
  });

  const handleActionClick = (action: string) => {
    trackBehavior.mutate(action);
  };

  const recommendations = recommendationsData?.recommendations || [];

  return (
    <Card className="glassmorphism border-electric-blue/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-electric-blue" />
          Smart Insights
        </CardTitle>
        {profile && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            <span className="text-slate-400">
              {profile.behavior?.userSegment?.replace('_', ' ').toUpperCase()} User
            </span>
            <Badge variant="outline" className="text-xs">
              {profile.behavior?.engagementLevel}
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Recommendations Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            Recommendations
          </h4>
          
          {recommendations.length > 0 ? (
            <div className="space-y-2">
              {recommendations.slice(0, 2).map((rec: string, index: number) => (
                <div 
                  key={index} 
                  className="text-xs text-slate-300 p-2 bg-slate-800/30 rounded border-l-2 border-electric-blue/50"
                >
                  {rec}
                </div>
              ))}
              
              {recommendations.length > 2 && (
                <div className="text-xs text-slate-400 text-center py-1">
                  +{recommendations.length - 2} more insights
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400 p-2 bg-slate-800/20 rounded">
              Use the platform more to get personalized recommendations!
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {profile && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/30 p-2 rounded">
              <div className="text-slate-400">Sessions</div>
              <div className="font-bold">{profile.behavior?.totalSessions || 0}</div>
            </div>
            <div className="bg-slate-800/30 p-2 rounded">
              <div className="text-slate-400">Pattern</div>
              <div className="font-bold capitalize">{profile.behavior?.tradingPattern || 'N/A'}</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-green-400" />
            Quick Actions
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8"
              onClick={() => handleActionClick('quick_mint')}
            >
              Quick Mint
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8"
              onClick={() => handleActionClick('view_portfolio')}
            >
              Portfolio
            </Button>
          </div>
        </div>

        {/* Settings Link */}
        <div className="pt-2 border-t border-slate-700/50">
          <Link href="/personalization">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs justify-between hover:bg-electric-blue/10"
              onClick={() => handleActionClick('open_personalization')}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Personalization Settings
              </span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}