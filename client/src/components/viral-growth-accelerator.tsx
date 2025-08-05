import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Rocket, 
  Zap, 
  Share2, 
  Heart, 
  MessageSquare, 
  Eye,
  Target,
  Flame,
  ArrowUp,
  Users,
  Crown,
  Trophy
} from "lucide-react";

interface ViralToken {
  id: string;
  name: string;
  symbol: string;
  message: string;
  creator: string;
  viralScore: number;
  engagementRate: number;
  momentum: number;
  views: number;
  shares: number;
  interactions: number;
  growth24h: number;
  category: 'exploding' | 'trending' | 'rising' | 'stable';
  tags: string[];
}

interface ViralMetrics {
  totalViralTokens: number;
  averageViralScore: number;
  topPerformer: string;
  growthRate: number;
}

export function ViralGrowthAccelerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch viral tokens with real-time updates
  const { data: viralTokens, isLoading } = useQuery<ViralToken[]>({
    queryKey: ['/api/viral/tokens', selectedCategory],
    refetchInterval: 10000, // Update every 10 seconds for real-time feel
  });

  // Fetch viral metrics
  const { data: viralMetrics } = useQuery<ViralMetrics>({
    queryKey: ['/api/viral/metrics'],
    refetchInterval: 30000,
  });

  // Viral interaction tracking
  const interactMutation = useMutation({
    mutationFn: async ({ tokenId, action }: { tokenId: string; action: string }) => {
      return await apiRequest('POST', '/api/viral/interact', { tokenId, action });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/viral/tokens'] });
      queryClient.invalidateQueries({ queryKey: ['/api/viral/metrics'] });
    },
  });

  const handleInteraction = (tokenId: string, action: string) => {
    interactMutation.mutate({ tokenId, action });
    
    // Immediate feedback
    toast({
      title: "Interaction Recorded",
      description: `Your ${action} helps boost viral momentum!`,
      duration: 2000,
    });
  };

  const getViralCategoryColor = (category: string) => {
    switch (category) {
      case 'exploding': return 'from-red-500 to-orange-500';
      case 'trending': return 'from-yellow-500 to-orange-500';
      case 'rising': return 'from-blue-500 to-purple-500';
      case 'stable': return 'from-green-500 to-blue-500';
      default: return 'from-gray-500 to-gray-400';
    }
  };

  const getViralCategoryIcon = (category: string) => {
    switch (category) {
      case 'exploding': return <Flame className="h-4 w-4" />;
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      case 'rising': return <ArrowUp className="h-4 w-4" />;
      case 'stable': return <Target className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="glassmorphism electric-frame mobile-optimized">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-electric-blue/20 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-electric-blue/10 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Viral Metrics Dashboard */}
      {viralMetrics && (
        <Card className="glassmorphism electric-frame mobile-optimized">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-electric-blue">
              <Rocket className="h-5 w-5" />
              Viral Growth Center
            </CardTitle>
            <CardDescription>
              Real-time viral token discovery and engagement acceleration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-electric-blue/10 rounded-lg">
                <div className="text-2xl font-bold text-electric-blue">
                  {viralMetrics.totalViralTokens}
                </div>
                <div className="text-sm text-text-secondary">Viral Tokens</div>
              </div>
              <div className="text-center p-4 bg-electric-green/10 rounded-lg">
                <div className="text-2xl font-bold text-electric-green">
                  {viralMetrics.averageViralScore.toFixed(1)}
                </div>
                <div className="text-sm text-text-secondary">Avg Score</div>
              </div>
              <div className="text-center p-4 bg-warning-orange/10 rounded-lg">
                <div className="text-2xl font-bold text-warning-orange">
                  +{viralMetrics.growthRate}%
                </div>
                <div className="text-sm text-text-secondary">Growth Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                <div className="text-lg font-bold text-purple-400 truncate">
                  <Crown className="h-4 w-4 inline mr-1" />
                  {viralMetrics.topPerformer}
                </div>
                <div className="text-sm text-text-secondary">Top Performer</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <Card className="glassmorphism electric-frame mobile-optimized">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'exploding', 'trending', 'rising', 'stable'].map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={`touch-friendly ${
                  selectedCategory === category 
                    ? 'electric-gradient text-white' 
                    : 'border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10'
                }`}
              >
                {getViralCategoryIcon(category)}
                <span className="ml-1 capitalize">{category}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Viral Tokens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {viralTokens?.map((token) => (
          <Card key={token.id} className="glassmorphism electric-frame mobile-optimized group hover:scale-105 transition-transform">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`bg-gradient-to-r ${getViralCategoryColor(token.category)} text-white`}
                  >
                    {getViralCategoryIcon(token.category)}
                    <span className="ml-1 capitalize">{token.category}</span>
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-electric-blue">
                    {token.viralScore}
                  </div>
                  <div className="text-xs text-text-secondary">Viral Score</div>
                </div>
              </div>
              <CardTitle className="text-white text-lg">{token.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {token.message}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Viral Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-sm font-semibold text-electric-blue">
                    {token.views.toLocaleString()}
                  </div>
                  <div className="text-xs text-text-secondary flex items-center justify-center gap-1">
                    <Eye className="h-3 w-3" />
                    Views
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-electric-green">
                    {token.shares}
                  </div>
                  <div className="text-xs text-text-secondary flex items-center justify-center gap-1">
                    <Share2 className="h-3 w-3" />
                    Shares
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-warning-orange">
                    {token.interactions}
                  </div>
                  <div className="text-xs text-text-secondary flex items-center justify-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Interactions
                  </div>
                </div>
              </div>

              {/* Momentum Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Momentum</span>
                  <span className="text-electric-blue font-semibold">
                    {token.momentum}%
                  </span>
                </div>
                <Progress 
                  value={token.momentum} 
                  className="h-2"
                />
              </div>

              {/* Growth Indicator */}
              {token.growth24h > 0 && (
                <div className="flex items-center gap-2 text-electric-green text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+{token.growth24h}% in 24h</span>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInteraction(token.id, 'like')}
                  className="touch-friendly border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInteraction(token.id, 'share')}
                  className="touch-friendly border-electric-green/30 text-electric-green hover:bg-electric-green/10"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInteraction(token.id, 'boost')}
                  className="touch-friendly border-warning-orange/30 text-warning-orange hover:bg-warning-orange/10"
                >
                  <Rocket className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Viral Token CTA */}
      <Card className="glassmorphism electric-frame mobile-optimized">
        <CardContent className="p-6 text-center">
          <Trophy className="h-12 w-12 text-electric-blue mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Ready to Go Viral?
          </h3>
          <p className="text-text-secondary mb-4">
            Create your own viral token and join the trending revolution
          </p>
          <Button 
            size="lg" 
            className="electric-gradient touch-friendly"
          >
            <Rocket className="h-5 w-5 mr-2" />
            Create Viral Token
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}