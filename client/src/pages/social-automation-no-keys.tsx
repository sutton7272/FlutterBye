import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Download, Copy, ExternalLink, Zap, FileText, Share2, Settings, Image, Bot, Sparkles } from "lucide-react";

export default function SocialAutomationNoKeys() {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState("twitter");
  const [selectedContentType, setSelectedContentType] = useState("feature-highlight");
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  // Get existing generated content
  const { data: existingContent, refetch: refetchContent } = useQuery({
    queryKey: ['/api/social/generated-content'],
  });

  // Generate single content piece
  const generateContentMutation = useMutation({
    mutationFn: async (params: any) => {
      return await apiRequest({
        url: '/api/social/generate-content',
        method: 'POST',
        data: params
      });
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      toast({
        title: "Content Generated!",
        description: "Your social media content has been created and saved to files.",
      });
      refetchContent();
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
    },
  });

  // Generate social media kit
  const generateKitMutation = useMutation({
    mutationFn: async (theme: string) => {
      return await apiRequest({
        url: '/api/social/generate-kit',
        method: 'POST',
        data: { theme }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Social Media Kit Generated!",
        description: "Content created for all platforms and saved to files.",
      });
      refetchContent();
    },
    onError: (error: any) => {
      toast({
        title: "Kit Generation Failed",
        description: error.message || "Failed to generate social media kit",
        variant: "destructive",
      });
    },
  });

  // Generate CSV for scheduling
  const generateCsvMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest({
        url: '/api/social/generate-csv',
        method: 'POST'
      });
    },
    onSuccess: (data) => {
      toast({
        title: "CSV Generated!",
        description: "Scheduling file created for third-party tools.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "CSV Generation Failed",
        description: error.message || "Failed to generate CSV",
        variant: "destructive",
      });
    },
  });

  // Generate webhook content
  const generateWebhookMutation = useMutation({
    mutationFn: async (contentType: string) => {
      return await apiRequest({
        url: '/api/social/generate-webhook',
        method: 'POST',
        data: { contentType }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Webhook Content Generated!",
        description: "Ready for Zapier or Make.com automation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Webhook Generation Failed",
        description: error.message || "Failed to generate webhook content",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Content copied successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Flutterbye Social Content Generator
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Generate engaging social media content without API keys. Create posts, screenshots, and complete social media kits for manual posting.
          </p>
        </div>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generate">Generate Content</TabsTrigger>
            <TabsTrigger value="kit">Social Kit</TabsTrigger>
            <TabsTrigger value="export">Export Tools</TabsTrigger>
            <TabsTrigger value="library">Content Library</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Single Post
                </CardTitle>
                <CardDescription>
                  Create content for a specific platform with AI-generated text and screenshots
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Platform</label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Content Type</label>
                    <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feature-highlight">Feature Highlight</SelectItem>
                        <SelectItem value="platform-stats">Platform Stats</SelectItem>
                        <SelectItem value="user-success">User Success Story</SelectItem>
                        <SelectItem value="tutorial">Tutorial/Guide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={() => generateContentMutation.mutate({
                    platform: selectedPlatform,
                    contentType: selectedContentType,
                    includeScreenshot: true
                  })}
                  disabled={generateContentMutation.isPending}
                  className="w-full"
                  data-testid="button-generate-content"
                >
                  {generateContentMutation.isPending ? "Generating..." : "Generate Content"}
                </Button>

                {generatedContent && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Generated Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Content</label>
                        <Textarea
                          value={generatedContent.content}
                          readOnly
                          className="mt-1"
                          rows={4}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(generatedContent.content)}
                          className="mt-2"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Content
                        </Button>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Hashtags</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {generatedContent.hashtags?.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(generatedContent.hashtags?.join(' ') || '')}
                          className="mt-2"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Hashtags
                        </Button>
                      </div>

                      {generatedContent.mediaPath && (
                        <div>
                          <label className="text-sm font-medium">Screenshot</label>
                          <p className="text-sm text-slate-400 mt-1">
                            Screenshot saved to: {generatedContent.mediaPath}
                          </p>
                        </div>
                      )}

                      <div className="bg-slate-800 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Manual Posting Instructions:</h4>
                        <div className="text-sm text-slate-300 space-y-1">
                          {selectedPlatform === 'twitter' && (
                            <>
                              <p>1. Go to twitter.com</p>
                              <p>2. Click "What's happening?"</p>
                              <p>3. Paste content and hashtags</p>
                              <p>4. Upload screenshot if available</p>
                              <p>5. Click Tweet</p>
                            </>
                          )}
                          {selectedPlatform === 'linkedin' && (
                            <>
                              <p>1. Go to linkedin.com</p>
                              <p>2. Click "Start a post"</p>
                              <p>3. Paste content</p>
                              <p>4. Add hashtags at the end</p>
                              <p>5. Upload screenshot if available</p>
                              <p>6. Click Post</p>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Generate Social Media Kit
                </CardTitle>
                <CardDescription>
                  Create content for all platforms at once with a unified theme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => generateKitMutation.mutate('platform-features')}
                    disabled={generateKitMutation.isPending}
                    data-testid="button-generate-features-kit"
                  >
                    Platform Features Kit
                  </Button>
                  <Button
                    onClick={() => generateKitMutation.mutate('user-success-stories')}
                    disabled={generateKitMutation.isPending}
                    data-testid="button-generate-success-kit"
                  >
                    Success Stories Kit
                  </Button>
                  <Button
                    onClick={() => generateKitMutation.mutate('ai-innovation')}
                    disabled={generateKitMutation.isPending}
                    data-testid="button-generate-ai-kit"
                  >
                    AI Innovation Kit
                  </Button>
                  <Button
                    onClick={() => generateKitMutation.mutate('blockchain-benefits')}
                    disabled={generateKitMutation.isPending}
                    data-testid="button-generate-blockchain-kit"
                  >
                    Blockchain Benefits Kit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    CSV Export
                  </CardTitle>
                  <CardDescription>
                    Export content for scheduling tools like Buffer, Hootsuite, or Sprout Social
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => generateCsvMutation.mutate()}
                    disabled={generateCsvMutation.isPending}
                    className="w-full"
                    data-testid="button-generate-csv"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Scheduling CSV
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Webhook Automation
                  </CardTitle>
                  <CardDescription>
                    Generate webhook payloads for Zapier or Make.com automation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => generateWebhookMutation.mutate('feature-highlight')}
                    disabled={generateWebhookMutation.isPending}
                    className="w-full"
                    data-testid="button-generate-webhook"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Generate Webhook Content
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Library</CardTitle>
                <CardDescription>
                  View and manage all your generated social media content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingContent?.content?.length > 0 ? (
                    existingContent.content.map((item: any, index: number) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge>{item.platform}</Badge>
                            <p className="text-sm text-slate-400 mt-1">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(item.content)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm mb-2">{item.content.substring(0, 100)}...</p>
                        <div className="flex flex-wrap gap-1">
                          {item.hashtags?.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Image className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                      <p className="text-slate-400">No content generated yet</p>
                      <p className="text-sm text-slate-500">Generate your first social media content to see it here</p>
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