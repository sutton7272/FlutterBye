/**
 * FlutterAI Group Wallet Analysis Dashboard
 * 
 * Advanced interface for analyzing groups of wallets collectively
 * to identify patterns, trends, and insights for marketing and risk assessment
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Users, TrendingUp, Target, BarChart3, Brain, Zap, Filter, Play, Eye, Download, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GroupAnalysisFilter {
  riskLevels?: string[];
  marketingSegments?: string[];
  sourcePlatforms?: string[];
  scoringRanges?: {
    socialCreditScore?: { min?: number; max?: number };
    tradingBehaviorScore?: { min?: number; max?: number };
    portfolioQualityScore?: { min?: number; max?: number };
    activityScore?: { min?: number; max?: number };
  };
  dateRanges?: {
    createdAfter?: Date;
    createdBefore?: Date;
    lastAnalyzedAfter?: Date;
  };
  portfolioSizes?: string[];
  tradingFrequencies?: string[];
  customTags?: string[];
}

interface GroupAnalysisResult {
  id: string;
  analysisName: string;
  walletCount: number;
  filterCriteria: GroupAnalysisFilter;
  insights: {
    demographics: any;
    behavioral: any;
    strategic: any;
    comparative: any;
  };
  aiAnalysis: {
    summary: string;
    keyFindings: string[];
    actionableInsights: string[];
    riskAssessment: string;
    marketingStrategy: string;
  };
  confidence: number;
  generatedAt: Date;
  requestedBy: string;
}

export default function FlutterAIGroupAnalysis() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentTab, setCurrentTab] = useState('builder');
  const [analysisName, setAnalysisName] = useState('');
  const [currentFilter, setCurrentFilter] = useState<GroupAnalysisFilter>({});
  const [previewData, setPreviewData] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<GroupAnalysisResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<GroupAnalysisResult | null>(null);

  // Load filter templates
  const { data: templates } = useQuery({
    queryKey: ['/api/flutterai/group-analysis/templates'],
    retry: false
  });

  // Preview mutation
  const previewMutation = useMutation({
    mutationFn: async (filter: GroupAnalysisFilter) => {
      const response = await apiRequest('POST', '/api/flutterai/group-analysis/preview', { filter });
      return response;
    },
    onSuccess: (data) => {
      setPreviewData(data.preview);
      toast({
        title: "Preview Generated",
        description: `Found ${data.preview.walletCount} wallets matching criteria`,
      });
    },
    onError: (error) => {
      toast({
        title: "Preview Error",
        description: error.message || "Failed to generate preview",
        variant: "destructive",
      });
    }
  });

  // Analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async ({ filter, name }: { filter: GroupAnalysisFilter, name: string }) => {
      const response = await apiRequest('POST', '/api/flutterai/group-analysis/create', {
        filter,
        analysisName: name,
        requestedBy: 'admin'
      });
      return response;
    },
    onSuccess: (data) => {
      setAnalysisResults(prev => [data.analysis, ...prev]);
      setSelectedResult(data.analysis);
      setCurrentTab('results');
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${data.analysis.walletCount} wallets`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Error",
        description: error.message || "Failed to run analysis",
        variant: "destructive",
      });
    }
  });

  // Quick template mutation
  const quickTemplateMutation = useMutation({
    mutationFn: async ({ templateName, name }: { templateName: string, name: string }) => {
      const response = await apiRequest('POST', `/api/flutterai/group-analysis/quick/${templateName}`, {
        analysisName: name,
        requestedBy: 'admin'
      });
      return response;
    },
    onSuccess: (data) => {
      setAnalysisResults(prev => [data.analysis, ...prev]);
      setSelectedResult(data.analysis);
      setCurrentTab('results');
      toast({
        title: "Quick Analysis Complete",
        description: `Analyzed ${data.analysis.walletCount} wallets using ${data.template} template`,
      });
    },
    onError: (error) => {
      toast({
        title: "Quick Analysis Error",
        description: error.message || "Failed to run quick analysis",
        variant: "destructive",
      });
    }
  });

  const handleFilterChange = (key: string, value: any) => {
    setCurrentFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleScoreRangeChange = (scoreType: string, rangeType: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    setCurrentFilter(prev => ({
      ...prev,
      scoringRanges: {
        ...prev.scoringRanges,
        [scoreType]: {
          ...prev.scoringRanges?.[scoreType],
          [rangeType]: numValue
        }
      }
    }));
  };

  const handleArrayFilterChange = (key: string, value: string, checked: boolean) => {
    setCurrentFilter(prev => {
      const currentArray = prev[key] || [];
      if (checked) {
        return {
          ...prev,
          [key]: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [key]: currentArray.filter(item => item !== value)
        };
      }
    });
  };

  const runPreview = () => {
    if (Object.keys(currentFilter).length === 0) {
      toast({
        title: "No Filter Criteria",
        description: "Please add at least one filter criteria",
        variant: "destructive",
      });
      return;
    }
    previewMutation.mutate(currentFilter);
  };

  const runAnalysis = () => {
    if (!analysisName.trim()) {
      toast({
        title: "Analysis Name Required",
        description: "Please enter a name for this analysis",
        variant: "destructive",
      });
      return;
    }
    
    if (Object.keys(currentFilter).length === 0) {
      toast({
        title: "No Filter Criteria",
        description: "Please add at least one filter criteria",
        variant: "destructive",
      });
      return;
    }

    analysisMutation.mutate({ filter: currentFilter, name: analysisName });
  };

  const runQuickTemplate = (templateName: string) => {
    const name = `${templateName} Analysis - ${new Date().toLocaleDateString()}`;
    quickTemplateMutation.mutate({ templateName: templateName.toLowerCase().replace(/\s+/g, '_'), name });
  };

  const clearFilters = () => {
    setCurrentFilter({});
    setPreviewData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                FlutterAI Group Analysis
              </h1>
              <p className="text-slate-400">Analyze groups of wallets collectively for strategic insights</p>
            </div>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-blue-500/20">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Templates
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Custom Builder
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Quick Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Zap className="h-5 w-5" />
                  Quick Analysis Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates?.templates?.map((template: any) => (
                    <Card key={template.name} className="bg-slate-700/50 border-slate-600 hover:border-blue-500/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                        <p className="text-slate-400 text-sm mb-4">{template.description}</p>
                        <Button 
                          onClick={() => runQuickTemplate(template.name)}
                          disabled={quickTemplateMutation.isPending}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          size="sm"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Run Analysis
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Analysis Name */}
                <Card className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Analysis Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="analysisName" className="text-white">Analysis Name</Label>
                      <Input
                        id="analysisName"
                        value={analysisName}
                        onChange={(e) => setAnalysisName(e.target.value)}
                        placeholder="Enter analysis name..."
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Level Filters */}
                <Card className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Risk Level Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['low', 'moderate', 'high', 'critical'].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={`risk-${level}`}
                            checked={currentFilter.riskLevels?.includes(level) || false}
                            onCheckedChange={(checked) => handleArrayFilterChange('riskLevels', level, checked)}
                          />
                          <Label htmlFor={`risk-${level}`} className="text-white capitalize">{level}</Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio Size Filters */}
                <Card className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Portfolio Size Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['whale', 'large', 'medium', 'small'].map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={`portfolio-${size}`}
                            checked={currentFilter.portfolioSizes?.includes(size) || false}
                            onCheckedChange={(checked) => handleArrayFilterChange('portfolioSizes', size, checked)}
                          />
                          <Label htmlFor={`portfolio-${size}`} className="text-white capitalize">{size}</Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Source Platform Filters */}
                <Card className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Source Platform Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['FlutterBye', 'PerpeTrader', 'Universal API'].map((platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox
                            id={`platform-${platform}`}
                            checked={currentFilter.sourcePlatforms?.includes(platform) || false}
                            onCheckedChange={(checked) => handleArrayFilterChange('sourcePlatforms', platform, checked)}
                          />
                          <Label htmlFor={`platform-${platform}`} className="text-white">{platform}</Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Score Range Filters */}
                <Card className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Score Range Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { key: 'socialCreditScore', label: 'Social Credit Score' },
                      { key: 'tradingBehaviorScore', label: 'Trading Behavior Score' },
                      { key: 'portfolioQualityScore', label: 'Portfolio Quality Score' },
                      { key: 'activityScore', label: 'Activity Score' }
                    ].map((scoreType) => (
                      <div key={scoreType.key} className="space-y-2">
                        <Label className="text-white">{scoreType.label}</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-slate-400 text-sm">Min</Label>
                            <Input
                              type="number"
                              min="0"
                              max="1000"
                              placeholder="Min score"
                              value={currentFilter.scoringRanges?.[scoreType.key]?.min || ''}
                              onChange={(e) => handleScoreRangeChange(scoreType.key, 'min', e.target.value)}
                              className="bg-slate-700/50 border-slate-600 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-400 text-sm">Max</Label>
                            <Input
                              type="number"
                              min="0"
                              max="1000"
                              placeholder="Max score"
                              value={currentFilter.scoringRanges?.[scoreType.key]?.max || ''}
                              onChange={(e) => handleScoreRangeChange(scoreType.key, 'max', e.target.value)}
                              className="bg-slate-700/50 border-slate-600 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Actions Sidebar */}
              <div className="space-y-4">
                <Card className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={runPreview}
                      disabled={previewMutation.isPending}
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    
                    <Button 
                      onClick={runAnalysis}
                      disabled={analysisMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Run Analysis
                    </Button>
                    
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Filters */}
                {Object.keys(currentFilter).length > 0 && (
                  <Card className="bg-slate-800/50 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-blue-400">Active Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(currentFilter).map(([key, value]) => {
                          if (Array.isArray(value) && value.length > 0) {
                            return value.map(item => (
                              <Badge key={`${key}-${item}`} variant="secondary" className="bg-blue-600/20 text-blue-300">
                                {key}: {item}
                              </Badge>
                            ));
                          } else if (typeof value === 'object' && value !== null) {
                            return Object.entries(value).map(([subKey, subValue]) => {
                              if (typeof subValue === 'object' && subValue !== null) {
                                return Object.entries(subValue).map(([rangeKey, rangeValue]) => (
                                  rangeValue ? (
                                    <Badge key={`${key}-${subKey}-${rangeKey}`} variant="secondary" className="bg-green-600/20 text-green-300">
                                      {subKey} {rangeKey}: {rangeValue}
                                    </Badge>
                                  ) : null
                                ));
                              }
                              return null;
                            });
                          }
                          return null;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            {previewData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Preview Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{previewData.walletCount}</div>
                        <div className="text-slate-400">Total Wallets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{previewData.stats.averageScores.socialCreditScore}</div>
                        <div className="text-slate-400">Avg Credit Score</div>
                      </div>
                    </div>
                    
                    <Separator className="bg-slate-600" />
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Risk Distribution</h4>
                      <div className="space-y-1">
                        {Object.entries(previewData.stats.riskDistribution).map(([risk, count]) => (
                          <div key={risk} className="flex justify-between text-sm">
                            <span className="text-slate-400 capitalize">{risk}</span>
                            <span className="text-white">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Sample Wallets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {previewData.sampleWallets.map((wallet: any, index: number) => (
                        <div key={index} className="bg-slate-700/50 p-3 rounded-lg">
                          <div className="font-mono text-sm text-blue-300">{wallet.walletAddress}</div>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="bg-red-600/20 text-red-300">{wallet.riskLevel}</Badge>
                            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">{wallet.marketingSegment}</Badge>
                            <Badge variant="secondary" className="bg-cyan-600/20 text-cyan-300">{wallet.sourcePlatform}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-blue-500/20">
                <CardContent className="text-center py-12">
                  <Eye className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Preview Available</h3>
                  <p className="text-slate-400 mb-4">Configure filters in the Custom Builder and click Preview to see a sample of matching wallets.</p>
                  <Button onClick={() => setCurrentTab('builder')} className="bg-blue-600 hover:bg-blue-700">
                    Go to Builder
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {selectedResult ? (
              <div className="space-y-6">
                {/* Analysis Header */}
                <Card className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-blue-400">{selectedResult.analysisName}</CardTitle>
                        <p className="text-slate-400 mt-1">
                          {selectedResult.walletCount} wallets analyzed on {new Date(selectedResult.generatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600/20 text-green-300">
                          {Math.round(selectedResult.confidence * 100)}% Confidence
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* AI Analysis Summary */}
                <Card className="bg-slate-800/50 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-400">
                      <Brain className="h-5 w-5" />
                      AI Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-600/10 p-4 rounded-lg border border-blue-500/20">
                      <p className="text-white">{selectedResult.aiAnalysis.summary}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Key Findings</h4>
                        <ul className="space-y-1">
                          {selectedResult.aiAnalysis.keyFindings.map((finding, index) => (
                            <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Actionable Insights</h4>
                        <ul className="space-y-1">
                          {selectedResult.aiAnalysis.actionableInsights.map((insight, index) => (
                            <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-600/10 p-4 rounded-lg border border-red-500/20">
                        <h4 className="font-semibold text-red-300 mb-2">Risk Assessment</h4>
                        <p className="text-slate-300 text-sm">{selectedResult.aiAnalysis.riskAssessment}</p>
                      </div>
                      
                      <div className="bg-green-600/10 p-4 rounded-lg border border-green-500/20">
                        <h4 className="font-semibold text-green-300 mb-2">Marketing Strategy</h4>
                        <p className="text-slate-300 text-sm">{selectedResult.aiAnalysis.marketingStrategy}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Demographics */}
                  <Card className="bg-slate-800/50 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-blue-400">Demographics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Average Scores</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(selectedResult.insights.demographics.averageScores).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-slate-400">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                              <span className="text-white">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Risk Profile</h4>
                        <Badge className="bg-orange-600/20 text-orange-300">
                          {selectedResult.insights.demographics.riskProfile.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strategic Recommendations */}
                  <Card className="bg-slate-800/50 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-blue-400">Strategic Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Marketing Recommendations</h4>
                        <ul className="space-y-1">
                          {selectedResult.insights.strategic.marketingRecommendations.map((rec, index) => (
                            <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Opportunities</h4>
                        <ul className="space-y-1">
                          {selectedResult.insights.strategic.opportunities.map((opp, index) => (
                            <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-blue-500/20">
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Analysis Results</h3>
                  <p className="text-slate-400 mb-4">Run an analysis to see detailed insights and AI-powered recommendations.</p>
                  <Button onClick={() => setCurrentTab('templates')} className="bg-blue-600 hover:bg-blue-700">
                    Start Analysis
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}