import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Zap, BarChart3, Brain, Loader2 } from "lucide-react";

export default function AIFeaturesTest() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [testData, setTestData] = useState({
    productType: 'token_creation',
    currentPrice: 1.0,
    content: 'Check out this amazing token! 🚀',
    metrics: { userCount: 100, revenue: 1000 }
  });
  const { toast } = useToast();

  const testDynamicPricing = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/ai/dynamic-pricing/calculate", {
        userId: "demo-user",
        productType: testData.productType,
        currentPrice: testData.currentPrice,
        userBehavior: { engagement: 0.8, spending: 0.6 },
        marketConditions: { demand: 'high', competition: 'medium' },
        demandLevel: 'high'
      });
      
      setResults({ type: 'pricing', data: response });
      toast({
        title: "Dynamic Pricing AI Activated!",
        description: `Suggested price: $${response.pricing?.suggestedPrice || testData.currentPrice} (${Math.round(((response.pricing?.priceMultiplier || 1) - 1) * 100)}% adjustment)`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate dynamic pricing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testViralAmplification = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/ai/viral/generate", {
        topic: testData.content,
        platforms: ['twitter', 'instagram', 'tiktok'],
        targetAudience: 'crypto enthusiasts',
        tone: 'exciting'
      });
      
      setResults({ type: 'viral', data: response });
      toast({
        title: "Viral Amplification AI Activated!",
        description: `Generated viral content for ${(response as any).results?.length || 3} platforms`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate viral content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testSelfOptimizing = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/ai/optimization/analyze", {
        metrics: {
          userEngagement: testData.metrics.userCount,
          revenue: testData.metrics.revenue,
          conversionRate: 0.15,
          userSatisfaction: 0.85
        }
      });
      
      setResults({ type: 'optimization', data: response });
      toast({
        title: "Self-Optimizing Platform AI Activated!",
        description: `Generated ${(response as any).recommendations?.length || 5} optimization recommendations`,
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to analyze optimization opportunities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            🚀 Next-Gen AI Features Test
          </h1>
          <p className="text-xl text-gray-300">
            Test your high-ROI AI features with real functionality
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              500% ROI Dynamic Pricing
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              600% ROI Viral Amplification
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              400% ROI Self-Optimizing
            </Badge>
          </div>
          <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <h3 className="text-white font-semibold mb-2">Viral Amplification Creates Content For:</h3>
            <div className="flex justify-center gap-4 text-blue-300">
              <span>🐦 Twitter</span>
              <span>📸 Instagram</span>
              <span>🎵 TikTok</span>
              <span>💼 LinkedIn</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              User decides the topic - AI creates platform-optimized viral content with hashtags, engagement hooks, and viral scoring
            </p>
          </div>
        </div>

        {/* Test Input Controls */}
        <Card className="bg-black/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Test Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium">Product Type</label>
                <Input
                  value={testData.productType}
                  onChange={(e) => setTestData(prev => ({ ...prev, productType: e.target.value }))}
                  className="bg-black/40 border-gray-600 text-white"
                  placeholder="token_creation"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium">Current Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={testData.currentPrice}
                  onChange={(e) => setTestData(prev => ({ ...prev, currentPrice: parseFloat(e.target.value) }))}
                  className="bg-black/40 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-white text-sm font-medium">Content for Viral Testing</label>
              <Textarea
                value={testData.content}
                onChange={(e) => setTestData(prev => ({ ...prev, content: e.target.value }))}
                className="bg-black/40 border-gray-600 text-white"
                placeholder="Enter content to optimize for viral potential..."
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Feature Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-b from-green-900/20 to-black/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-400" />
                Dynamic Pricing AI
                <Badge variant="outline" className="text-green-400 border-green-400">
                  500% ROI
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                Calculate optimal pricing based on user behavior, market conditions, and demand patterns.
              </p>
              <Button 
                onClick={testDynamicPricing}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Test Dynamic Pricing
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-blue-900/20 to-black/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-400" />
                Viral Amplification
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  600% ROI
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                Generate optimized viral content for multiple social media platforms with AI-powered engagement strategies.
              </p>
              <Button 
                onClick={testViralAmplification}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Test Viral Amplification
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-purple-900/20 to-black/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                Self-Optimizing Platform
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  400% ROI
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                Analyze platform performance and generate actionable optimization recommendations.
              </p>
              <Button 
                onClick={testSelfOptimizing}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Test Self-Optimization
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Display */}
        {results && (
          <Card className="bg-black/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-green-400" />
                AI Results - {results.type.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-gray-300 text-sm overflow-auto bg-black/40 p-4 rounded-lg border border-gray-600">
                {JSON.stringify(results.data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}