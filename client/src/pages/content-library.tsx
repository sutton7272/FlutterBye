import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image, FileText, Video, Music, Folder, Search, Tag, Trash2, Eye, Edit, Copy, Sparkles, RefreshCw } from 'lucide-react';

interface ContentItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'text' | 'audio' | 'template';
  url?: string;
  content?: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  fileSize?: number;
  usage: number;
  aiGenerated: boolean;
}

export default function ContentLibrary() {
  const { toast } = useToast();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [generating, setGenerating] = useState(false);
  
  const [uploadData, setUploadData] = useState({
    name: '',
    category: 'General',
    tags: '',
    type: 'image' as ContentItem['type']
  });

  const categories = ['General', 'Brand Assets', 'Product Images', 'Marketing', 'Educational', 'Community', 'Templates'];
  
  // Mock content items
  const mockContent: ContentItem[] = [
    {
      id: '1',
      name: 'FlutterBye Logo Primary',
      type: 'image',
      url: '/public-objects/brand/flutter-logo-primary.png',
      tags: ['logo', 'brand', 'primary'],
      category: 'Brand Assets',
      createdAt: '2025-01-14T10:00:00Z',
      updatedAt: '2025-01-14T10:00:00Z',
      fileSize: 125000,
      usage: 45,
      aiGenerated: false
    },
    {
      id: '2',
      name: 'Token Creation Guide',
      type: 'text',
      content: 'Step-by-step guide to creating your first FlutterBye token. Perfect for educational content and tutorials.',
      tags: ['guide', 'tutorial', 'tokens'],
      category: 'Educational',
      createdAt: '2025-01-14T11:00:00Z',
      updatedAt: '2025-01-14T11:00:00Z',
      usage: 23,
      aiGenerated: true
    },
    {
      id: '3',
      name: 'Web3 Communication Template',
      type: 'template',
      content: '🚀 Discover the future of communication with FlutterBye! [CUSTOM_MESSAGE] Join the revolution at [LINK] #FlutterBye #Web3',
      tags: ['template', 'web3', 'communication'],
      category: 'Templates',
      createdAt: '2025-01-14T12:00:00Z',
      updatedAt: '2025-01-14T12:00:00Z',
      usage: 67,
      aiGenerated: true
    }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/library');
      if (response.ok) {
        const data = await response.json();
        setContentItems(Array.isArray(data) ? data : mockContent);
      } else {
        setContentItems(mockContent);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
      setContentItems(mockContent);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Get upload URL from backend
      const uploadResponse = await fetch('/api/objects/upload', {
        method: 'POST'
      });
      const { uploadURL } = await uploadResponse.json();

      // Upload file to object storage
      const formData = new FormData();
      formData.append('file', file);
      
      const fileUploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file
      });

      if (fileUploadResponse.ok) {
        // Save content metadata
        const contentData = {
          ...uploadData,
          name: uploadData.name || file.name,
          type: getFileType(file.type),
          url: uploadURL.split('?')[0], // Remove query parameters
          tags: uploadData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          fileSize: file.size,
          usage: 0,
          aiGenerated: false
        };

        const saveResponse = await fetch('/api/content/library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contentData)
        });

        if (saveResponse.ok) {
          const newContent = await saveResponse.json();
          setContentItems(prev => [...prev, newContent]);
          toast({
            title: 'Content Uploaded Successfully!',
            description: `${contentData.name} has been added to your library`,
            className: 'bg-green-900 border-green-500 text-white'
          });
          setShowUpload(false);
          setUploadData({ name: '', category: 'General', tags: '', type: 'image' });
        }
      }
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Could not upload content to library',
        variant: 'destructive'
      });
    }
  };

  const getFileType = (mimeType: string): ContentItem['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'text';
  };

  const generateAIContent = async (type: string) => {
    setGenerating(true);
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, platform: 'general' })
      });

      if (response.ok) {
        const generated = await response.json();
        const newContent: ContentItem = {
          id: Date.now().toString(),
          name: `AI Generated ${type}`,
          type: type === 'post_template' ? 'template' : 'text',
          content: generated.content,
          tags: generated.hashtags || ['ai-generated'],
          category: 'AI Generated',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usage: 0,
          aiGenerated: true
        };

        setContentItems(prev => [...prev, newContent]);
        toast({
          title: 'AI Content Generated!',
          description: `New ${type} content has been created`,
          className: 'bg-green-900 border-green-500 text-white'
        });
      }
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Could not generate AI content',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const deleteContent = async (contentId: string) => {
    try {
      const response = await fetch(`/api/content/library/${contentId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setContentItems(prev => prev.filter(item => item.id !== contentId));
        toast({
          title: 'Content deleted successfully',
          className: 'bg-green-900 border-green-500 text-white'
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to delete content',
        variant: 'destructive'
      });
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied to clipboard',
      className: 'bg-green-900 border-green-500 text-white'
    });
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'template': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📁 Content Library & Asset Management
          </h1>
          <p className="text-slate-300 text-lg">
            Store, organize, and manage content for AI-powered social media generation
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search content and tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border-purple-500/30 text-white pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-slate-800 border-purple-500/30 text-white w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="bg-slate-800 border-purple-500/30 text-white w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Content
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-purple-500/30">
              <DialogHeader>
                <DialogTitle className="text-purple-400">Upload New Content</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contentName">Content Name</Label>
                  <Input
                    id="contentName"
                    placeholder="Enter content name"
                    value={uploadData.name}
                    onChange={(e) => setUploadData({...uploadData, name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={uploadData.category} 
                    onValueChange={(value) => setUploadData({...uploadData, category: value})}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="brand, logo, primary, web3"
                    value={uploadData.tags}
                    onChange={(e) => setUploadData({...uploadData, tags: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*,video/*,audio/*,.txt,.md"
                    onChange={handleFileUpload}
                    className="bg-slate-700 border-slate-600 text-white file:bg-purple-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded"
                  />
                </div>

                <Button variant="outline" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="library" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-purple-500/30">
            <TabsTrigger value="library" className="text-white data-[state=active]:bg-purple-600">
              <Folder className="w-4 h-4 mr-2" />
              Content Library
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-white data-[state=active]:bg-purple-600">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="ai-generator" className="text-white data-[state=active]:bg-purple-600">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generator
            </TabsTrigger>
          </TabsList>

          {/* Content Library Tab */}
          <TabsContent value="library" className="space-y-6">
            {filteredContent.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Folder className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Content Found</h3>
                  <p className="text-slate-400">Upload content or adjust your search filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item) => {
                  const TypeIcon = getTypeIcon(item.type);
                  
                  return (
                    <Card key={item.id} className="bg-slate-800/50 border-purple-500/30 group hover:border-purple-400 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-5 h-5 text-purple-400" />
                            <h4 className="font-semibold text-white truncate">{item.name}</h4>
                          </div>
                          {item.aiGenerated && (
                            <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>

                        {/* Preview */}
                        {item.type === 'image' && item.url && (
                          <div className="mb-3 rounded-lg overflow-hidden bg-slate-700/50">
                            <img 
                              src={item.url} 
                              alt={item.name}
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        )}
                        
                        {(item.type === 'text' || item.type === 'template') && item.content && (
                          <div className="mb-3 p-3 bg-slate-700/50 rounded-lg">
                            <p className="text-sm text-slate-300 line-clamp-3">
                              {item.content}
                            </p>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-purple-500/30">
                              <Tag className="w-2 h-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-purple-500/30">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="text-xs text-slate-500 mb-3">
                          <p>{item.category} • Used {item.usage} times</p>
                          {item.fileSize && (
                            <p>{(item.fileSize / 1024).toFixed(1)} KB</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(item.url || item.content || '')}>
                            <Copy className="w-3 h-3" />
                          </Button>
                          {item.url && (
                            <Button size="sm" variant="outline" onClick={() => window.open(item.url, '_blank')}>
                              <Eye className="w-3 h-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => deleteContent(item.id)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid gap-4">
              {filteredContent.filter(item => item.type === 'template').map((template) => (
                <Card key={template.id} className="bg-slate-800/50 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">{template.name}</h4>
                      <div className="flex gap-2">
                        <Badge className="bg-purple-600">Template</Badge>
                        <Badge variant="outline">Used {template.usage} times</Badge>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg mb-4">
                      <p className="text-slate-300">{template.content}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button onClick={() => copyToClipboard(template.content || '')}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Generator Tab */}
          <TabsContent value="ai-generator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white mb-2">Platform Update</h3>
                  <p className="text-slate-400 text-sm mb-4">Generate content about FlutterBye updates and features</p>
                  <Button 
                    onClick={() => generateAIContent('platform_update')} 
                    disabled={generating}
                    className="w-full"
                  >
                    {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Generate
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white mb-2">Educational Content</h3>
                  <p className="text-slate-400 text-sm mb-4">Create tutorials and guides for Web3 communication</p>
                  <Button 
                    onClick={() => generateAIContent('educational')} 
                    disabled={generating}
                    className="w-full"
                  >
                    {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Generate
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-lg font-semibold text-white mb-2">Post Template</h3>
                  <p className="text-slate-400 text-sm mb-4">Generate reusable post templates with placeholders</p>
                  <Button 
                    onClick={() => generateAIContent('post_template')} 
                    disabled={generating}
                    className="w-full"
                  >
                    {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Generate
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}