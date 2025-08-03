import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Zap, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AISEOOptimizer() {
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const optimizeSEO = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content to optimize",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/content/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          purpose: purpose || 'SEO optimization'
        })
      });

      if (!response.ok) {
        throw new Error('SEO optimization failed');
      }

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "SEO Optimization Complete!",
        description: `Generated optimized content with ${data.seoScore}/100 SEO score`,
      });
    } catch (error) {
      console.error('SEO optimization error:', error);
      toast({
        title: "SEO Optimization Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <Search className="w-5 h-5" />
            AI SEO Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Content to Optimize
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content for SEO optimization..."
              className="bg-black/30 border-purple-500/30 text-white"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Keywords (comma-separated)
            </label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="blockchain, messaging, AI, communication"
              className="bg-black/30 border-purple-500/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Purpose
            </label>
            <Input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Landing page, blog post, product description..."
              className="bg-black/30 border-purple-500/30 text-white"
            />
          </div>

          <Button 
            onClick={optimizeSEO}
            disabled={loading || !content.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Optimizing SEO...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Optimize for SEO
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-300">
              <TrendingUp className="w-5 h-5" />
              SEO Optimization Results
              <Badge variant="secondary" className="bg-green-600 text-white">
                Score: {result.seoScore}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                Optimized Content
              </label>
              <div className="bg-black/30 border border-green-500/30 rounded-md p-3 text-white">
                {result.optimizedContent}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                Meta Description
              </label>
              <div className="bg-black/30 border border-green-500/30 rounded-md p-3 text-white text-sm">
                {result.metaDescription}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                SEO Title
              </label>
              <div className="bg-black/30 border border-green-500/30 rounded-md p-3 text-white font-medium">
                {result.title}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                Keywords
              </label>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-green-500/50 text-green-300">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                AI Improvements
              </label>
              <div className="space-y-2">
                {result.improvements.map((improvement: string, index: number) => (
                  <div key={index} className="bg-black/30 border border-green-500/30 rounded-md p-2 text-white text-sm">
                    • {improvement}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}