import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  Coins,
  Zap,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Award,
  Lightbulb,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface JourneyDashboard {
  userReward: {
    totalPoints: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
    totalSmsMessages: number;
    totalTokensMinted: number;
    totalValueAttached: string;
  };
  preferences: {
    dashboardLayout: string;
    notificationSettings: {
      milestones: boolean;
      insights: boolean;
      challenges: boolean;
      badges: boolean;
    };
    favoriteCategories: string[];
    privacyLevel: string;
  };
  achievedMilestones: Array<{
    milestone: {
      id: string;
      name: string;
      description: string;
      category: string;
      pointsReward: number;
      iconUrl?: string;
    };
    achievedAt: string;
  }>;
  nextMilestones: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    pointsReward: number;
    isEligible: boolean;
    progress: number;
  }>;
  recentInsights: Array<{
    id: string;
    insightType: string;
    title: string;
    description: string;
    data: any;
    isRead: boolean;
    createdAt: string;
  }>;
  journeyStats: {
    completionPercentage: number;
    totalMilestones: number;
    achievedMilestones: number;
    daysActive: number;
    favoriteCategory: string;
    nextLevelProgress: number;
  };
  milestonesByCategory: {
    onboarding: any[];
    engagement: any[];
    mastery: any[];
    social: any[];
    value: any[];
  };
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'onboarding': return <Star className="h-4 w-4" />;
    case 'engagement': return <MessageSquare className="h-4 w-4" />;
    case 'mastery': return <Trophy className="h-4 w-4" />;
    case 'social': return <Users className="h-4 w-4" />;
    case 'value': return <DollarSign className="h-4 w-4" />;
    default: return <Target className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'onboarding': return 'from-blue-500 to-cyan-600';
    case 'engagement': return 'from-green-500 to-emerald-600';
    case 'mastery': return 'from-purple-500 to-indigo-600';
    case 'social': return 'from-pink-500 to-rose-600';
    case 'value': return 'from-yellow-500 to-orange-600';
    default: return 'from-gray-500 to-slate-600';
  }
};

const formatCategory = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export default function JourneyPage() {
  const userId = "user-1"; // This would come from auth context

  const { data: dashboard, isLoading } = useQuery<JourneyDashboard>({
    queryKey: ['/api/journey/dashboard', userId],
  });

  const markInsightReadMutation = useMutation({
    mutationFn: async ({ insightId }: { insightId: string }) => {
      return apiRequest(`/api/journey/insights/${insightId}/read`, 'PATCH', { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journey/dashboard', userId] });
    }
  });

  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/journey/insights/${userId}/generate`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journey/dashboard', userId] });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Journey Not Found</h3>
            <p className="text-muted-foreground">Your blockchain journey data is not available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { userReward, achievedMilestones, nextMilestones, recentInsights, journeyStats, milestonesByCategory } = dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Your Blockchain Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your progress through the world of tokenized messaging and blockchain communication
          </p>
        </div>

        {/* Journey Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Journey Progress</p>
                  <p className="text-3xl font-bold">{journeyStats.completionPercentage}%</p>
                  <p className="text-purple-100 text-xs mt-1">
                    {journeyStats.achievedMilestones} of {journeyStats.totalMilestones} milestones
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Current Level</p>
                  <p className="text-3xl font-bold">{userReward.currentLevel}</p>
                  <div className="mt-2">
                    <Progress 
                      value={journeyStats.nextLevelProgress} 
                      className="h-1.5 bg-green-400/30"
                    />
                    <p className="text-green-100 text-xs mt-1">
                      {Math.round(journeyStats.nextLevelProgress)}% to next level
                    </p>
                  </div>
                </div>
                <Zap className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Days Active</p>
                  <p className="text-3xl font-bold">{journeyStats.daysActive}</p>
                  <p className="text-blue-100 text-xs mt-1">
                    Current streak: {userReward.currentStreak} days
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-pink-500 to-rose-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">Total Points</p>
                  <p className="text-3xl font-bold">{userReward.totalPoints.toLocaleString()}</p>
                  <p className="text-pink-100 text-xs mt-1">
                    Favorite: {formatCategory(journeyStats.favoriteCategory)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="milestones" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="milestones" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Next Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Next Milestones
                  </CardTitle>
                  <CardDescription>
                    Your upcoming achievements and progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {nextMilestones.map((milestone) => (
                        <div key={milestone.id} className="p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full bg-gradient-to-r ${getCategoryColor(milestone.category)}`}>
                                {getCategoryIcon(milestone.category)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm">{milestone.name}</h4>
                                <p className="text-xs text-muted-foreground">{milestone.description}</p>
                              </div>
                            </div>
                            <Badge variant={milestone.isEligible ? "default" : "secondary"} className="text-xs">
                              {milestone.isEligible ? "Ready!" : `${Math.round(milestone.progress)}%`}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <Progress value={milestone.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{formatCategory(milestone.category)}</span>
                              <span>+{milestone.pointsReward} points</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {nextMilestones.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Trophy className="h-12 w-12 mx-auto mb-4" />
                          <p>All milestones completed! 🎉</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Recent Achievements
                  </CardTitle>
                  <CardDescription>
                    Your latest milestone completions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {achievedMilestones.map((achievement) => (
                        <div key={achievement.milestone.id} className="p-4 rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-full bg-gradient-to-r ${getCategoryColor(achievement.milestone.category)}`}>
                              {getCategoryIcon(achievement.milestone.category)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm flex items-center gap-2">
                                {achievement.milestone.name}
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </h4>
                              <p className="text-xs text-muted-foreground">{achievement.milestone.description}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{formatCategory(achievement.milestone.category)}</span>
                            <div className="flex items-center gap-2">
                              <span>+{achievement.milestone.pointsReward} points</span>
                              <span>•</span>
                              <span>{new Date(achievement.achievedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {achievedMilestones.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Target className="h-12 w-12 mx-auto mb-4" />
                          <p>Complete your first milestone to see achievements here!</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Personalized Insights</h3>
                <p className="text-muted-foreground">AI-powered analysis of your blockchain journey</p>
              </div>
              <Button 
                onClick={() => generateInsightsMutation.mutate()}
                disabled={generateInsightsMutation.isPending}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {generateInsightsMutation.isPending ? "Generating..." : "Generate Insights"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentInsights.map((insight) => (
                <Card key={insight.id} className={insight.isRead ? "opacity-60" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                          <Lightbulb className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{insight.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {insight.insightType.replace('_', ' ')} • {new Date(insight.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markInsightReadMutation.mutate({ insightId: insight.id })}
                        disabled={insight.isRead}
                      >
                        {insight.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    {insight.data && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          {Object.entries(insight.data).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                              <span className="ml-1">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {recentInsights.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="p-12 text-center">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Insights Yet</h3>
                    <p className="text-muted-foreground mb-4">Generate your first personalized insights to see your journey analysis here.</p>
                    <Button 
                      onClick={() => generateInsightsMutation.mutate()}
                      disabled={generateInsightsMutation.isPending}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Generate First Insights
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(milestonesByCategory).map(([category, milestones]) => (
                <Card key={category} className="overflow-hidden">
                  <CardHeader className={`bg-gradient-to-r ${getCategoryColor(category)} text-white`}>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getCategoryIcon(category)}
                      {formatCategory(category)}
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      {milestones.filter(m => m.isAchieved).length} of {milestones.length} completed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {milestones.map((milestone) => (
                          <div 
                            key={milestone.id} 
                            className={`p-3 rounded-lg border ${milestone.isAchieved 
                              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                              : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                  {milestone.name}
                                  {milestone.isAchieved && <CheckCircle className="h-4 w-4 text-green-600" />}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                              <span>+{milestone.pointsReward} points</span>
                              {milestone.isAchieved && <Badge variant="secondary" className="text-xs">Completed</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Journey Preferences</CardTitle>
                <CardDescription>Customize your blockchain journey experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4" />
                  <p>Journey settings will be available in future updates!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}