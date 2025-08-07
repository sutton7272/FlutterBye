import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Eye, Heart, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  author: string;
  featured: boolean;
  viewCount: number;
  likeCount: number;
}

export function BlogShowcase() {
  console.log('BlogShowcase: Component initialized');
  
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  // Always render something visible first to confirm component is being called
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="electric-border bg-gray-900 rounded-xl p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
            🚀 Latest AI Marketing Insights
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Revolutionary AI-powered blog content powered by Flutterbye Intelligence
          </p>
          
          {/* Simple featured blog post display */}
          <div className="bg-gradient-to-r from-blue-900/40 to-green-900/40 rounded-xl p-8 border border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              The Future of Crypto Marketing: AI-Powered Precision Targeting
            </h3>
            <p className="text-gray-300 mb-6">
              Discover how Flutterbye is revolutionizing crypto marketing with AI-powered wallet analysis, 
              precision targeting, and value-attached messaging that transforms how businesses communicate 
              with crypto holders.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-6">
              <span>🤖 AI Generated</span>
              <span>📖 8 min read</span>
              <span>🏷️ Crypto Marketing</span>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 px-8 py-3 rounded-lg font-bold transition-all duration-300">
              Read Full Article →
            </button>
          </div>
          
          {/* Coming soon section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h4 className="text-lg font-bold text-blue-400 mb-2">AI Content Creation</h4>
              <p className="text-gray-400 text-sm">Automated blog generation using GPT-4o</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h4 className="text-lg font-bold text-green-400 mb-2">SEO Optimization</h4>
              <p className="text-gray-400 text-sm">Advanced keyword targeting and meta descriptions</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h4 className="text-lg font-bold text-purple-400 mb-2">Multi-Platform Distribution</h4>
              <p className="text-gray-400 text-sm">Automated posting to Twitter, LinkedIn, Instagram</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show error state for debugging
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="electric-border bg-gray-900 rounded-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
              Latest Insights
            </h2>
            <p className="text-red-400">
              Error loading blog posts: {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="electric-border bg-gray-900 rounded-xl p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-6 space-y-4">
                  <div className="h-6 bg-blue-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const posts: BlogPost[] = (blogData as any)?.posts || [];
  const featuredPost = posts.find((p: BlogPost) => p.featured) || posts[0];
  const recentPosts = posts.filter((p: BlogPost) => !p.featured).slice(0, 4);

  // If no posts, show a simple message instead of empty space
  if (posts.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="electric-border bg-gray-900 rounded-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
              Latest Insights
            </h2>
            <p className="text-gray-300">
              AI-powered blog posts coming soon...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="electric-border bg-gray-900 rounded-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="electric-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Latest Insights
            </h2>
            <div className="electric-pulse w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-gray-300 text-lg">
            Stay ahead with cutting-edge crypto marketing intelligence
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Card 
            className="mb-8 bg-gradient-to-br from-blue-950 to-green-950 border-2 border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 overflow-hidden"
            onMouseEnter={() => setHoveredPost(featuredPost.id)}
            onMouseLeave={() => setHoveredPost(null)}
          >
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                      Featured
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{featuredPost.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{featuredPost.likeCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>12 comments</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 transition-all duration-300"
                      onClick={() => {
                        window.open(`/blog/${featuredPost.id}`, '_blank');
                      }}
                    >
                      Read Full Article
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Visual indicator */}
                <div className="lg:w-32 flex lg:flex-col justify-center items-center">
                  <div className={`electric-border w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                    hoveredPost === featuredPost.id ? 'scale-110 bg-gradient-to-br from-blue-600 to-green-600' : 'bg-gray-800'
                  }`}>
                    <div className="electric-pulse w-8 h-8 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Posts Grid */}
        {recentPosts.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              Recent Articles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentPosts.map((post: BlogPost) => (
                <Card 
                  key={post.id}
                  className="bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.viewCount}</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-full mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-600/10"
                      asChild
                    >
                      <Link href={`/blog/${post.id}`}>
                        Read More
                        <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className="text-center mt-8 pt-8 border-t border-gray-700">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 transition-all duration-300"
            asChild
          >
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}