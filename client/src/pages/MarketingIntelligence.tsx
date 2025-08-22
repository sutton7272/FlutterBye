import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  BarChart3, 
  TrendingUp, 
  Search, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  Target,
  DollarSign,
  Eye,
  MousePointer,
  Brain,
  Globe,
  Gauge
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function MarketingIntelligence() {
  const [activeTab, setActiveTab] = useState("overview");
  const [siteUrl, setSiteUrl] = useState("https://flutterbye.com");
  const [copilotQuery, setCopilotQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch growth health score
  const { data: healthScore, isLoading: healthLoading } = useQuery({
    queryKey: ['/api/seo-marketing/health-score', siteUrl.replace('https://', '').replace('http://', '')],
    enabled: !!siteUrl,
  });

  // Fetch SEO opportunities
  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['/api/seo-marketing/opportunities/seo', { 
      siteUrl, 
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    }],
    enabled: !!siteUrl,
  });

  // Fetch campaign analytics
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['/api/seo-marketing/campaigns/analytics', {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    }],
  });

  // Site audit mutation
  const auditMutation = useMutation({
    mutationFn: (pageUrl: string) => apiRequest(`/api/seo-marketing/audit/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageUrl })
    }),
    onSuccess: () => {
      toast({ title: "Site Audit Complete", description: "Page analysis completed successfully" });
    },
    onError: () => {
      toast({ title: "Audit Failed", description: "Failed to audit page", variant: "destructive" });
    },
  });

  // Content brief generation mutation
  const briefMutation = useMutation({
    mutationFn: ({ pageUrl, targetQuery }: { pageUrl: string; targetQuery: string }) => 
      apiRequest(`/api/seo-marketing/content/brief`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageUrl, targetQuery })
      }),
    onSuccess: () => {
      toast({ title: "Content Brief Generated", description: "AI-powered brief created successfully" });
    },
    onError: () => {
      toast({ title: "Brief Generation Failed", description: "Failed to generate content brief", variant: "destructive" });
    },
  });

  // Copilot query mutation
  const copilotMutation = useMutation({
    mutationFn: (question: string) => 
      apiRequest(`/api/seo-marketing/copilot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      }),
    onSuccess: () => {
      setCopilotQuery("");
    },
    onError: () => {
      toast({ title: "Query Failed", description: "Failed to process insights query", variant: "destructive" });
    },
  });

  const handleAuditSite = (pageUrl: string) => {
    auditMutation.mutate(pageUrl);
  };

  const handleGenerateBrief = (pageUrl: string, targetQuery: string) => {
    briefMutation.mutate({ pageUrl, targetQuery });
  };

  const handleCopilotQuery = () => {
    if (!copilotQuery.trim()) return;
    copilotMutation.mutate(copilotQuery);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-blue-400" />
            Marketing Intelligence Hub
          </h1>
          <p className="text-blue-200 text-lg">
            AI-Powered SEO, Campaign Analytics & Growth Optimization
          </p>
        </div>

        {/* Site URL Input */}
        <Card className="mb-6 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Target Website
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="siteUrl" className="text-slate-300">Website URL</Label>
                <Input
                  id="siteUrl"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://your-website.com"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => queryClient.invalidateQueries()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Analyze
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 bg-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-blue-600">
              SEO Opportunities
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-blue-600">
              Campaign Analytics
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-blue-600">
              Site Audit
            </TabsTrigger>
            <TabsTrigger value="copilot" className="data-[state=active]:bg-blue-600">
              AI Copilot
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Health Score Card */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    Growth Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {healthLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getHealthGradeColor(healthScore?.data?.grade || 'D')}`}>
                        {healthScore?.data?.overallScore || 0}
                      </div>
                      <Badge variant="secondary" className={getHealthGradeColor(healthScore?.data?.grade || 'D')}>
                        Grade {healthScore?.data?.grade || 'D'}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Opportunities Count */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    SEO Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {opportunitiesLoading ? (
                    <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {opportunities?.data?.totalCount || 0}
                      </div>
                      <div className="text-sm text-slate-400">
                        {opportunities?.data?.highPriority || 0} high priority
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Campaign Performance */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Blended ROAS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {campaignsLoading ? (
                    <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {campaigns?.data?.summary?.blendedROAS || 0}x
                      </div>
                      <div className="text-sm text-slate-400">
                        ${campaigns?.data?.summary?.totalSpend || 0} spend
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Total Conversions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Total Conversions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {campaignsLoading ? (
                    <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {campaigns?.data?.summary?.totalConversions || 0}
                      </div>
                      <div className="text-sm text-slate-400">
                        ${campaigns?.data?.summary?.blendedCAC || 0} avg CAC
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Health Metrics Detail */}
            {healthScore?.data && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gauge className="w-5 h-5" />
                    Detailed Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <Label className="text-slate-300">SEO Health</Label>
                      <Progress value={healthScore.data.metrics.seoHealth} className="mt-2" />
                      <div className="text-sm text-slate-400 mt-1">{healthScore.data.metrics.seoHealth}%</div>
                    </div>
                    <div>
                      <Label className="text-slate-300">Performance</Label>
                      <Progress value={healthScore.data.metrics.performanceHealth} className="mt-2" />
                      <div className="text-sm text-slate-400 mt-1">{healthScore.data.metrics.performanceHealth}%</div>
                    </div>
                    <div>
                      <Label className="text-slate-300">Content Quality</Label>
                      <Progress value={healthScore.data.metrics.contentHealth} className="mt-2" />
                      <div className="text-sm text-slate-400 mt-1">{healthScore.data.metrics.contentHealth}%</div>
                    </div>
                    <div>
                      <Label className="text-slate-300">Campaign Efficiency</Label>
                      <Progress value={healthScore.data.metrics.campaignHealth} className="mt-2" />
                      <div className="text-sm text-slate-400 mt-1">{healthScore.data.metrics.campaignHealth}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SEO Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  High-Impact SEO Opportunities
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Pages ranking 5-15 with high impressions and low CTR
                </CardDescription>
              </CardHeader>
              <CardContent>
                {opportunitiesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">Analyzing opportunities...</p>
                  </div>
                ) : opportunities?.data?.opportunities?.length > 0 ? (
                  <div className="space-y-4">
                    {opportunities.data.opportunities.slice(0, 10).map((opp: any) => (
                      <div key={opp.id} className="border border-slate-600 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${getPriorityColor(opp.priority)} text-white`}>
                                {opp.priority} priority
                              </Badge>
                              <span className="text-sm text-slate-400">Position #{opp.currentPosition}</span>
                            </div>
                            <h3 className="text-white font-medium mb-1 truncate">{opp.query}</h3>
                            <p className="text-slate-400 text-sm truncate">{opp.pageUrl}</p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-white font-medium flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {opp.impressions.toLocaleString()}
                            </div>
                            <div className="text-slate-400 text-sm flex items-center gap-1">
                              <MousePointer className="w-3 h-3" />
                              {(opp.ctr * 100).toFixed(1)}% CTR
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleGenerateBrief(opp.pageUrl, opp.query)}
                            disabled={briefMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Zap className="w-4 h-4 mr-1" />
                            Generate Brief
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAuditSite(opp.pageUrl)}
                            disabled={auditMutation.isPending}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Search className="w-4 h-4 mr-1" />
                            Audit Page
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No SEO opportunities found</p>
                    <p className="text-slate-500 text-sm">Connect Google Search Console to analyze opportunities</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaign Analytics Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Campaign Performance & Budget Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {campaignsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">Analyzing campaigns...</p>
                  </div>
                ) : campaigns?.data?.insights?.length > 0 ? (
                  <div className="space-y-4">
                    {campaigns.data.insights.map((campaign: any) => (
                      <div key={campaign.campaignId} className="border border-slate-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-white font-medium">{campaign.name}</h3>
                            <p className="text-slate-400 text-sm">{campaign.platform}</p>
                          </div>
                          <Badge 
                            className={
                              campaign.recommendation === 'increase' ? 'bg-green-600' :
                              campaign.recommendation === 'decrease' ? 'bg-red-600' :
                              campaign.recommendation === 'pause' ? 'bg-gray-600' :
                              'bg-yellow-600'
                            }
                          >
                            {campaign.recommendation}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <div className="text-sm text-slate-400">Spend</div>
                            <div className="text-white font-medium">${campaign.spend.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-400">Conversions</div>
                            <div className="text-white font-medium">{campaign.conversions}</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-400">ROAS</div>
                            <div className="text-white font-medium">{campaign.roas.toFixed(2)}x</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-400">CAC</div>
                            <div className="text-white font-medium">${campaign.cac.toFixed(0)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          {campaign.suggestedBudgetChange !== 0 && (
                            <span className={`flex items-center gap-1 ${
                              campaign.suggestedBudgetChange > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {campaign.suggestedBudgetChange > 0 ? '+' : ''}{campaign.suggestedBudgetChange}% budget
                            </span>
                          )}
                          <span className="text-slate-400">• {campaign.reasoning}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No campaign data available</p>
                    <p className="text-slate-500 text-sm">Connect ad platforms to analyze performance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Audit Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Technical SEO & Performance Audit
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Core Web Vitals, structured data, and E-E-A-T analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder="https://page-to-audit.com"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button 
                      onClick={() => handleAuditSite(siteUrl)}
                      disabled={auditMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {auditMutation.isPending ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      ) : (
                        <Search className="w-4 h-4 mr-2" />
                      )}
                      Run Audit
                    </Button>
                  </div>
                  
                  {auditMutation.data && (
                    <div className="mt-6 space-y-6">
                      {/* Core Web Vitals */}
                      <div className="border border-slate-600 rounded-lg p-4">
                        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                          <Gauge className="w-4 h-4" />
                          Core Web Vitals
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                              {(auditMutation.data.data.coreWebVitals.lcp / 1000).toFixed(1)}s
                            </div>
                            <div className="text-sm text-slate-400">LCP</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                              {auditMutation.data.data.coreWebVitals.cls.toFixed(3)}
                            </div>
                            <div className="text-sm text-slate-400">CLS</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                              {auditMutation.data.data.coreWebVitals.inp.toFixed(0)}ms
                            </div>
                            <div className="text-sm text-slate-400">INP</div>
                          </div>
                        </div>
                      </div>

                      {/* Fix-It Items */}
                      <div className="border border-slate-600 rounded-lg p-4">
                        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Fix-It Recommendations
                        </h3>
                        <div className="space-y-3">
                          {auditMutation.data.data.fixItItems.map((item: any, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <Badge className={`${getPriorityColor(item.priority)} text-white mt-1`}>
                                {item.priority}
                              </Badge>
                              <div className="flex-1">
                                <div className="text-white font-medium">{item.description}</div>
                                <div className="text-slate-400 text-sm">{item.implementation}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Copilot Tab */}
          <TabsContent value="copilot" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Marketing Insights Copilot
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Ask natural language questions about your marketing data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Textarea
                      placeholder="Which pages lost traffic after AI summaries appeared? What campaigns have the highest ROAS? How can I improve my Core Web Vitals?"
                      value={copilotQuery}
                      onChange={(e) => setCopilotQuery(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white resize-none"
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={handleCopilotQuery}
                    disabled={copilotMutation.isPending || !copilotQuery.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {copilotMutation.isPending ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    ) : (
                      <Brain className="w-4 h-4 mr-2" />
                    )}
                    Ask Copilot
                  </Button>
                  
                  {copilotMutation.data && (
                    <div className="mt-6 border border-slate-600 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">Copilot Response</span>
                      </div>
                      <div className="text-slate-300 whitespace-pre-wrap">
                        {copilotMutation.data.data.answer}
                      </div>
                      <div className="text-xs text-slate-500 mt-3">
                        Asked: {copilotMutation.data.data.question}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}