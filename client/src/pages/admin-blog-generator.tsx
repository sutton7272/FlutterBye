import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Copy, Share2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaDescription: string;
  tags: string[];
  keywords: string[];
  readTime: string;
}

export default function AdminBlogGenerator() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generatedPost, setGeneratedPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const generateBlogMutation = useMutation({
    mutationFn: async (data: { topic: string; targetKeywords: string[] }) => {
      return await apiRequest("POST", "/api/marketing/bot/generate-blog-post", data);
    },
    onSuccess: (data) => {
      setGeneratedPost(data);
      toast({
        title: "Blog Post Generated!",
        description: "Your SEO-optimized blog post is ready for review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your blog post.",
        variant: "destructive",
      });
      return;
    }

    const targetKeywords = keywords.split(",").map(k => k.trim()).filter(Boolean);
    generateBlogMutation.mutate({ topic, targetKeywords });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="electric-border bg-gray-900 rounded-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                AI Blog Post Generator
              </h1>
              <Sparkles className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-gray-300">
              Generate SEO-optimized blog posts for Flutterbye marketing
            </p>
          </div>

          {/* Generation Form */}
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Blog Post Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="topic" className="text-white">Topic</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter blog post topic (e.g., Future of Crypto Marketing)"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="keywords" className="text-white">Target Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Flutterbye, crypto marketing, blockchain, AI targeting"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={generateBlogMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500"
              >
                {generateBlogMutation.isPending ? (
                  <>
                    <Sparkles className="mr-2 w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-4 h-4" />
                    Generate Blog Post
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Post Preview */}
          {generatedPost && (
            <div className="space-y-6">
              {/* Post Metadata */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Blog Post Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300 text-sm">Title</Label>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{generatedPost.title}</h3>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => copyToClipboard(generatedPost.title)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">URL Slug</Label>
                    <p className="text-blue-400 font-mono">/blog/{generatedPost.slug}</p>
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">Excerpt</Label>
                    <p className="text-gray-300">{generatedPost.excerpt}</p>
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">Meta Description</Label>
                    <p className="text-gray-400 text-sm">{generatedPost.metaDescription}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{generatedPost.readTime}</span>
                    </div>
                    <div className="flex gap-2">
                      {generatedPost.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Full Content */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Full Content</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => copyToClipboard(generatedPost.content)}
                      >
                        <Copy className="mr-1 w-4 h-4" />
                        Copy
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const shareData = {
                            title: generatedPost.title,
                            text: generatedPost.excerpt,
                            url: window.location.origin + '/blog/' + generatedPost.slug,
                          };
                          navigator.share(shareData);
                        }}
                      >
                        <Share2 className="mr-1 w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 p-6 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                      {generatedPost.content}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Information */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">SEO Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 text-sm">Keywords</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {generatedPost.keywords.map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Content Stats</Label>
                      <div className="text-sm text-gray-400 mt-1">
                        <p>Word count: {generatedPost.content.split(' ').length}</p>
                        <p>Character count: {generatedPost.content.length}</p>
                        <p>Reading time: {generatedPost.readTime}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}