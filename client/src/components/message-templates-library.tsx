import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Copy, 
  Edit, 
  Trash2, 
  Plus, 
  Star, 
  TrendingUp, 
  Search,
  Filter,
  MessageSquare,
  Sparkles,
  Smile,
  ThumbsUp,
  Gift,
  Award,
  Zap,
  Target
} from "lucide-react";

interface MessageTemplate {
  id: string;
  title: string;
  message: string;
  emotion: string;
  category: string;
  viralScore: number;
  usageCount: number;
  rating: number;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

export function MessageTemplatesLibrary() {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEmotion, setSelectedEmotion] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    message: "",
    emotion: "love",
    category: "personal",
    tags: "",
    isPublic: false
  });
  const { toast } = useToast();

  // Mock template data
  const mockTemplates: MessageTemplate[] = [
    {
      id: "1",
      title: "Heartfelt Gratitude",
      message: "Thank you for always believing in me! You mean the world to me 💕",
      emotion: "gratitude",
      category: "personal",
      viralScore: 94.2,
      usageCount: 1847,
      rating: 4.9,
      tags: ["thank you", "appreciation", "love"],
      isPublic: true,
      createdBy: "FlutterWave Team",
      createdAt: "2025-08-01"
    },
    {
      id: "2",
      title: "Celebration Wishes",
      message: "Congratulations on your amazing achievement! So proud of you! 🎉",
      emotion: "celebration",
      category: "milestones",
      viralScore: 91.8,
      usageCount: 1234,
      rating: 4.8,
      tags: ["congratulations", "achievement", "celebration"],
      isPublic: true,
      createdBy: "FlutterWave Team",
      createdAt: "2025-08-01"
    },
    {
      id: "3",
      title: "Daily Motivation",
      message: "You've got this! Today is your day to shine ✨💪",
      emotion: "motivation",
      category: "encouragement",
      viralScore: 89.5,
      usageCount: 987,
      rating: 4.7,
      tags: ["motivation", "encouragement", "daily"],
      isPublic: true,
      createdBy: "FlutterWave Team",
      createdAt: "2025-08-01"
    },
    {
      id: "4",
      title: "Support & Comfort",
      message: "Sending you strength and positive energy. You're not alone 🫂💙",
      emotion: "support",
      category: "comfort",
      viralScore: 87.3,
      usageCount: 756,
      rating: 4.8,
      tags: ["support", "comfort", "strength"],
      isPublic: true,
      createdBy: "FlutterWave Team",
      createdAt: "2025-08-01"
    },
    {
      id: "5",
      title: "Birthday Love",
      message: "Happy Birthday! May your special day be filled with joy and love 🎂🎈",
      emotion: "celebration",
      category: "birthday",
      viralScore: 92.1,
      usageCount: 2103,
      rating: 4.9,
      tags: ["birthday", "celebration", "special day"],
      isPublic: true,
      createdBy: "FlutterWave Team",
      createdAt: "2025-08-01"
    },
    {
      id: "6",
      title: "Love Declaration",
      message: "I love you more than words can express. You complete me ❤️",
      emotion: "love",
      category: "romantic",
      viralScore: 95.7,
      usageCount: 3456,
      rating: 5.0,
      tags: ["love", "romantic", "declaration"],
      isPublic: true,
      createdBy: "FlutterWave Team",
      createdAt: "2025-08-01"
    }
  ];

  const categories = [
    { value: "all", label: "All Categories", icon: MessageSquare },
    { value: "personal", label: "Personal", icon: Heart },
    { value: "business", label: "Business", icon: Target },
    { value: "milestones", label: "Milestones", icon: Award },
    { value: "romantic", label: "Romantic", icon: Heart },
    { value: "birthday", label: "Birthday", icon: Gift },
    { value: "encouragement", label: "Encouragement", icon: ThumbsUp },
    { value: "comfort", label: "Comfort & Support", icon: Heart },
    { value: "celebration", label: "Celebration", icon: Sparkles }
  ];

  const emotions = [
    { value: "all", label: "All Emotions", emoji: "🌈" },
    { value: "love", label: "Love", emoji: "💕" },
    { value: "joy", label: "Joy", emoji: "😊" },
    { value: "gratitude", label: "Gratitude", emoji: "🙏" },
    { value: "support", label: "Support", emoji: "💪" },
    { value: "motivation", label: "Motivation", emoji: "🔥" },
    { value: "celebration", label: "Celebration", emoji: "🎉" },
    { value: "comfort", label: "Comfort", emoji: "🫂" }
  ];

  // Filter templates based on search and selections
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesEmotion = selectedEmotion === "all" || template.emotion === selectedEmotion;
    
    return matchesSearch && matchesCategory && matchesEmotion;
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      const response = await fetch("/api/sms/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...templateData,
          tags: templateData.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
        }),
      });
      if (!response.ok) throw new Error("Failed to create template");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Template Created!", description: "Your message template has been saved successfully." });
      setIsCreating(false);
      setNewTemplate({
        title: "",
        message: "",
        emotion: "love",
        category: "personal",
        tags: "",
        isPublic: false
      });
    }
  });

  // Copy template to clipboard
  const copyTemplate = (template: MessageTemplate) => {
    navigator.clipboard.writeText(template.message);
    toast({ 
      title: "Copied to Clipboard!", 
      description: `"${template.title}" template copied successfully.` 
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Message Templates Library</h2>
          <p className="text-gray-400">Discover and create emotional message templates with proven viral potential</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Browse Templates
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            My Favorites
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Create Template Modal */}
          {isCreating && (
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-purple-400" />
                  Create New Message Template
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Design a reusable emotional message template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Template Title</Label>
                      <Input
                        value={newTemplate.title}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Heartfelt Thank You"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white">Message</Label>
                      <Textarea
                        value={newTemplate.message}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Your emotional message template..."
                        className="bg-white/10 border-white/20 text-white h-24"
                        maxLength={160}
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {newTemplate.message.length}/160 characters
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Emotion Type</Label>
                      <Select value={newTemplate.emotion} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, emotion: value }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {emotions.filter(e => e.value !== "all").map(emotion => (
                            <SelectItem key={emotion.value} value={emotion.value}>
                              {emotion.emoji} {emotion.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Category</Label>
                      <Select value={newTemplate.category} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(c => c.value !== "all").map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Tags (comma-separated)</Label>
                      <Input
                        value={newTemplate.tags}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="love, thank you, appreciation"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Button
                    onClick={() => createTemplateMutation.mutate(newTemplate)}
                    disabled={!newTemplate.title || !newTemplate.message || createTemplateMutation.isPending}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {createTemplateMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Template
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filters */}
          <Card className="bg-black/40 backdrop-blur-sm border-gray-500/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search templates by title, message, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {emotions.map(emotion => (
                        <SelectItem key={emotion.value} value={emotion.value}>
                          {emotion.emoji} {emotion.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-black/40 backdrop-blur-sm border-gray-500/30 hover:border-purple-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{template.title}</CardTitle>
                    <Badge className={
                      template.emotion === 'love' ? 'bg-pink-600/20 text-pink-200' :
                      template.emotion === 'joy' ? 'bg-yellow-600/20 text-yellow-200' :
                      template.emotion === 'gratitude' ? 'bg-green-600/20 text-green-200' :
                      template.emotion === 'support' ? 'bg-blue-600/20 text-blue-200' :
                      template.emotion === 'motivation' ? 'bg-red-600/20 text-red-200' :
                      'bg-purple-600/20 text-purple-200'
                    }>
                      {template.emotion}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(template.rating)}
                    </div>
                    <span className="text-sm text-gray-400">
                      ({template.usageCount.toLocaleString()} uses)
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white text-sm line-clamp-3">
                    {template.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">
                        {template.viralScore.toFixed(1)}% viral
                      </span>
                    </div>
                    <Badge variant="outline" className="border-gray-500 text-gray-300">
                      {template.category}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} className="bg-gray-600/20 text-gray-300 text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge className="bg-gray-600/20 text-gray-300 text-xs">
                        +{template.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => copyTemplate(template)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card className="bg-black/40 backdrop-blur-sm border-gray-500/30">
              <CardContent className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Templates Found</h3>
                <p className="text-gray-400">Try adjusting your search or filters to find more templates</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-sm border-yellow-500/30">
            <CardContent className="text-center py-12">
              <Star className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Your Favorite Templates</h3>
              <p className="text-gray-400">Templates you've starred will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30">
            <CardContent className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Trending Templates</h3>
              <p className="text-gray-400">Most popular templates this week will be shown here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}