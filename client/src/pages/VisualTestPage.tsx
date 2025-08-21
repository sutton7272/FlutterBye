import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { CheckCircle, AlertCircle, Image, Zap, Target } from 'lucide-react';

interface VisualTestResult {
  success: boolean;
  message: string;
  testResults: {
    contentGeneration: {
      hasImage: boolean;
      imageUrl: string;
      imageSource: string;
      imageDescription: string;
      contentLength: number;
      hashtagCount: number;
    };
    imageSelection: {
      hasImage: boolean;
      imageUrl: string;
      source: string;
      description: string;
    };
  };
}

export default function VisualTestPage() {
  const [testResult, setTestResult] = useState<VisualTestResult | null>(null);

  const testMutation = useMutation({
    mutationFn: async (): Promise<VisualTestResult> => {
      return await apiRequest('/api/test-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
    },
    onSuccess: (data: VisualTestResult) => {
      setTestResult(data);
    },
    onError: (error) => {
      console.error('Visual test failed:', error);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Image className="h-10 w-10 text-electric-blue" />
            Enhanced Visual Attachment System
          </h1>
          <p className="text-xl text-slate-300">
            Test the mandatory visual attachment system for all generated content
          </p>
        </div>

        {/* Test Control */}
        <Card className="bg-slate-800/50 border-electric-blue/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-electric-blue" />
              Visual System Test
            </CardTitle>
            <CardDescription className="text-slate-300">
              Run comprehensive tests to verify mandatory visual attachment functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => testMutation.mutate()}
              disabled={testMutation.isPending}
              className="w-full bg-electric-blue hover:bg-electric-blue/80 text-white"
              data-testid="button-run-visual-test"
            >
              {testMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Testing Visual System...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Run Visual Attachment Test
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResult && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card className="bg-slate-800/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={testResult.success ? "default" : "destructive"}>
                    {testResult.success ? "PASSED" : "FAILED"}
                  </Badge>
                  <span className="text-white">{testResult.message}</span>
                </div>
              </CardContent>
            </Card>

            {/* Content Generation Test */}
            <Card className="bg-slate-800/50 border-electric-blue/20">
              <CardHeader>
                <CardTitle className="text-white">Content Generation with Mandatory Visual</CardTitle>
                <CardDescription className="text-slate-300">
                  Verifies that all generated content includes visual attachments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {testResult.testResults.contentGeneration.hasImage ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-white font-medium">Visual Attached</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Content Length: {testResult.testResults.contentGeneration.contentLength} characters
                    </p>
                    <p className="text-sm text-slate-300">
                      Hashtags: {testResult.testResults.contentGeneration.hashtagCount} generated
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-300">
                      <strong>Image Source:</strong> {testResult.testResults.contentGeneration.imageSource}
                    </p>
                    <p className="text-sm text-slate-300">
                      <strong>Description:</strong> {testResult.testResults.contentGeneration.imageDescription}
                    </p>
                    {testResult.testResults.contentGeneration.imageUrl && (
                      <img 
                        src={testResult.testResults.contentGeneration.imageUrl} 
                        alt="Generated content visual"
                        className="w-16 h-16 object-cover rounded border border-electric-blue/30"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Selection Test */}
            <Card className="bg-slate-800/50 border-electric-blue/20">
              <CardHeader>
                <CardTitle className="text-white">Optimal Image Selection</CardTitle>
                <CardDescription className="text-slate-300">
                  Tests the image selection algorithm for content optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {testResult.testResults.imageSelection.hasImage ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-white font-medium">Image Selected</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      <strong>Source:</strong> {testResult.testResults.imageSelection.source}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-300">
                      <strong>Description:</strong> {testResult.testResults.imageSelection.description}
                    </p>
                    {testResult.testResults.imageSelection.imageUrl && (
                      <img 
                        src={testResult.testResults.imageSelection.imageUrl} 
                        alt="Selected optimal image"
                        className="w-16 h-16 object-cover rounded border border-electric-blue/30"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status Summary */}
            <Card className="bg-green-900/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Enhanced Visual System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-900/30 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Mandatory Visuals</p>
                    <p className="text-sm text-green-300">100% Coverage</p>
                  </div>
                  <div className="text-center p-4 bg-blue-900/30 rounded-lg">
                    <Image className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Image Selection</p>
                    <p className="text-sm text-blue-300">Optimized</p>
                  </div>
                  <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                    <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-medium">AI Integration</p>
                    <p className="text-sm text-purple-300">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {testMutation.isError && (
          <Card className="bg-red-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Test Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-300">
                Unable to complete visual attachment system test. Please check the API connection.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}