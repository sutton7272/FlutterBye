// Cost-Effective AI Panel - User Interface for AI Features
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Heart, 
  Hash, 
  Tag, 
  TrendingUp, 
  MessageSquare, 
  Star, 
  Type, 
  BarChart3,
  FileText,
  Zap,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';

interface AIResult {
  [key: string]: any;
}

export default function CostEffectiveAIPanel() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<AIResult>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [usageStats, setUsageStats] = useState<any>(null);
  const { toast } = useToast();

  const callAIFeature = async (endpoint: string, data: any, featureName: string) => {
    setLoading(featureName);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('AI request failed');
      
      const result = await response.json();
      setResults(prev => ({ ...prev, [featureName]: result }));
      
      toast({
        title: "AI Analysis Complete",
        description: `${featureName} analysis finished successfully`,
      });
    } catch (error) {
      toast({
        title: "AI Error",
        description: `Failed to process ${featureName}`,
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const loadUsageStats = async () => {
    try {
      const response = await fetch('/api/ai/usage-stats');
      if (response.ok) {
        const stats = await response.json();
        setUsageStats(stats.stats);
      }
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  };

  const runBulkAnalysis = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to analyze",
        variant: "destructive"
      });
      return;
    }

    setLoading('bulk');
    try {
      const response = await fetch('/api/ai/bulk-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ text: inputText }],
          operations: ['emotion', 'sentiment', 'hashtags', 'categorize', 'quality']
        })
      });
      
      if (!response.ok) throw new Error('Bulk analysis failed');
      
      const result = await response.json();
      if (result.results[0]) {
        setResults(result.results[0].results);
      }
      
      toast({
        title: "Bulk Analysis Complete",
        description: "All AI features processed successfully",
      });
    } catch (error) {
      toast({
        title: "Bulk Analysis Failed",
        description: "Failed to process bulk analysis",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-black via-gray-900 to-green-900 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="h-10 w-10 text-green-400" />
          <h1 className="text-4xl font-bold text-white">Cost-Effective AI Features</h1>
          <DollarSign className="h-10 w-10 text-yellow-400" />
        </div>
        <p className="text-gray-300">Maximum value AI tools with intelligent cost optimization</p>
      </div>

      {/* Usage Statistics */}
      {usageStats && (
        <Card className="bg-black/40 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Cost Optimization Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{usageStats.cacheHitRate.toFixed(1)}%</div>
                <p className="text-sm text-gray-400">Cache Hit Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{usageStats.totalRequests}</div>
                <p className="text-sm text-gray-400">Total Requests</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">${usageStats.estimatedSavings.toFixed(2)}</div>
                <p className="text-sm text-gray-400">Estimated Savings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Section */}
      <Card className="bg-black/40 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Text Input for AI Analysis</CardTitle>
          <CardDescription className="text-gray-400">
            Enter text, message, or content for AI processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your text here for AI analysis..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[100px] bg-gray-800 border-gray-600 text-white"
          />
          <div className="flex space-x-4">
            <Button 
              onClick={runBulkAnalysis}
              disabled={loading === 'bulk' || !inputText.trim()}
              className="bg-green-600 hover:bg-green-700 flex-1"
            >
              {loading === 'bulk' ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run All AI Features
                </>
              )}
            </Button>
            <Button 
              onClick={loadUsageStats}
              variant="outline"
              className="border-gray-600"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Load Stats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Features Tabs */}
      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="grid grid-cols-3 bg-black/40">
          <TabsTrigger value="individual" className="data-[state=active]:bg-green-600">Individual Features</TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-blue-600">Results</TabsTrigger>
          <TabsTrigger value="tools" className="data-[state=active]:bg-purple-600">Advanced Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          {/* Individual AI Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Emotion Detection */}
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-pink-400 flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Emotion Detection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => callAIFeature('/api/ai/detect-emotion', { text: inputText }, 'emotion')}
                  disabled={loading === 'emotion' || !inputText.trim()}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  {loading === 'emotion' ? 'Analyzing...' : 'Detect Emotion'}
                </Button>
              </CardContent>
            </Card>

            {/* Sentiment Analysis */}
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Sentiment Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => callAIFeature('/api/ai/analyze-sentiment', { text: inputText }, 'sentiment')}
                  disabled={loading === 'sentiment' || !inputText.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading === 'sentiment' ? 'Analyzing...' : 'Analyze Sentiment'}
                </Button>
              </CardContent>
            </Card>

            {/* Hashtag Generation */}
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center space-x-2">
                  <Hash className="h-5 w-5" />
                  <span>Hashtag Generator</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => callAIFeature('/api/ai/generate-hashtags', { content: inputText }, 'hashtags')}
                  disabled={loading === 'hashtags' || !inputText.trim()}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {loading === 'hashtags' ? 'Generating...' : 'Generate Hashtags'}
                </Button>
              </CardContent>
            </Card>

            {/* Content Categorization */}
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Categorization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => callAIFeature('/api/ai/categorize-content', { content: inputText }, 'categorize')}
                  disabled={loading === 'categorize' || !inputText.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading === 'categorize' ? 'Categorizing...' : 'Categorize Content'}
                </Button>
              </CardContent>
            </Card>

            {/* Quality Scoring */}
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Quality Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => callAIFeature('/api/ai/score-content', { content: inputText }, 'quality')}
                  disabled={loading === 'quality' || !inputText.trim()}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  {loading === 'quality' ? 'Scoring...' : 'Score Quality'}
                </Button>
              </CardContent>
            </Card>

            {/* Reply Suggestions */}
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Reply Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => callAIFeature('/api/ai/suggest-replies', { message: inputText }, 'replies')}
                  disabled={loading === 'replies' || !inputText.trim()}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading === 'replies' ? 'Generating...' : 'Suggest Replies'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {/* Results Display */}
          {Object.keys(results).length === 0 ? (
            <Card className="bg-black/40 border-gray-600">
              <CardContent className="py-12 text-center">
                <Brain className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No results yet. Run some AI analysis to see results here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {Object.entries(results).map(([feature, result]) => (
                <Card key={feature} className="bg-black/40 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white capitalize">{feature} Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm text-gray-300 bg-gray-800 p-4 rounded overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          {/* Advanced Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Token Name Generator */}
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center space-x-2">
                  <Type className="h-5 w-5" />
                  <span>Token Name Generator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Describe your token concept..."
                  className="bg-gray-800 border-gray-600"
                />
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Generate Token Name
                </Button>
              </CardContent>
            </Card>

            {/* Content Summarizer */}
            <Card className="bg-black/40 border-gray-600">
              <CardHeader>
                <CardTitle className="text-indigo-400 flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Content Summarizer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => callAIFeature('/api/ai/summarize-content', { content: inputText }, 'summary')}
                  disabled={loading === 'summary' || !inputText.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading === 'summary' ? 'Summarizing...' : 'Summarize Content'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Cost Optimization Features */}
          <Card className="bg-black/40 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Cost Optimization Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Intelligent caching for repeated queries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Minimal token usage optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Batch processing for efficiency</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Cost-effective model selection</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}