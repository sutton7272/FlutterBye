import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Brain, 
  Target, 
  DollarSign, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
// import { apiRequest } from "@/lib/queryClient";

interface FeatureRecommendation {
  featureName: string;
  featureCategory: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  confidence: number;
  reasoning: string;
  expectedImpact: {
    userEngagement: number;
    revenue: number;
    retention: number;
  };
  requirements: string[];
  risks: string[];
  timeline: string;
  costImpact: number;
}

interface AnalysisResult {
  summary: string;
  currentStage: 'mvp' | 'growth' | 'scale' | 'mature';
  readinessScore: number;
  recommendations: FeatureRecommendation[];
  keyInsights: string[];
  nextMilestones: Array<{
    metric: string;
    currentValue: number;
    targetValue: number;
    timeframe: string;
  }>;
}

export default function FeatureReleaseAnalyzer() {
  const { toast } = useToast();
  const [selectedRecommendation, setSelectedRecommendation] = useState<FeatureRecommendation | null>(null);

  // Fetch analysis data
  const { data: analysis, isLoading, refetch } = useQuery<AnalysisResult>({
    queryKey: ['/api/feature-analysis'],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Note: metrics data available via analysis endpoint

  // Apply feature recommendation
  const applyRecommendationMutation = useMutation({
    mutationFn: async (featureName: string) => {
      const response = await fetch('/api/feature-toggle/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: featureName }),
      });
      if (!response.ok) throw new Error('Failed to enable feature');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Feature Enabled",
        description: "The recommended feature has been successfully enabled.",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to enable the feature. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'mvp': return 'text-blue-600';
      case 'growth': return 'text-green-600';
      case 'scale': return 'text-purple-600';
      case 'mature': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactIcon = (value: number) => {
    if (value > 10) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (value > 0) return <ArrowUp className="w-4 h-4 text-yellow-500" />;
    if (value < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing site activity and generating recommendations...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Unable to load feature analysis. Please check your configuration and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Feature Release Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Data-driven recommendations for strategic feature releases
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Stage</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStageColor(analysis.currentStage)}`}>
              {analysis.currentStage.toUpperCase()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analysis.readinessScore}%
            </div>
            <Progress value={analysis.readinessScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Features Ready</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analysis.recommendations.filter(r => r.priority === 'immediate' || r.priority === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">High priority features</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${analysis.recommendations.reduce((sum, r) => sum + r.costImpact, 0)}/mo
            </div>
            <p className="text-xs text-muted-foreground">If all enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis */}
      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="summary">Analysis Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Feature Release Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered analysis of which features to enable based on your current metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedRecommendation(rec)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg">{rec.featureName}</h4>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline">{rec.confidence}% confidence</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {rec.reasoning}
                        </p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          applyRecommendationMutation.mutate(rec.featureName);
                        }}
                        disabled={applyRecommendationMutation.isPending}
                        className="ml-4"
                      >
                        Enable Feature
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Engagement: +{rec.expectedImpact.userEngagement}%</span>
                        {getImpactIcon(rec.expectedImpact.userEngagement)}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Revenue: +{rec.expectedImpact.revenue}%</span>
                        {getImpactIcon(rec.expectedImpact.revenue)}
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Retention: +{rec.expectedImpact.retention}%</span>
                        {getImpactIcon(rec.expectedImpact.retention)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Timeline: {rec.timeline}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Cost Impact: +${rec.costImpact}/month
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Key Insights
              </CardTitle>
              <CardDescription>
                Important patterns identified from your site activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.keyInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Next Milestones
              </CardTitle>
              <CardDescription>
                Key metrics to achieve before enabling more features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.nextMilestones.map((milestone, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{milestone.metric}</h4>
                      <Badge variant="outline">{milestone.timeframe}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current: {milestone.currentValue.toLocaleString()}</span>
                        <span>Target: {milestone.targetValue.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(milestone.currentValue / milestone.targetValue) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {analysis.summary}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feature Detail Modal */}
      {selectedRecommendation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {selectedRecommendation.featureName}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedRecommendation(null)}
                >
                  ×
                </Button>
              </CardTitle>
              <CardDescription>
                Detailed analysis and implementation plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {selectedRecommendation.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Risks</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                  {selectedRecommendation.risks.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => {
                    applyRecommendationMutation.mutate(selectedRecommendation.featureName);
                    setSelectedRecommendation(null);
                  }}
                  disabled={applyRecommendationMutation.isPending}
                  className="w-full"
                >
                  Enable {selectedRecommendation.featureName}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}