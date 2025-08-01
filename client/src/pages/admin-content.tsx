import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { 
  Edit3, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Type, 
  Layout, 
  Palette, 
  Eye,
  Download,
  Upload,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";

export default function AdminContentPage() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState("home");
  const [editingSection, setEditingSection] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch all content data
  const { data: contentSections = [] } = useQuery({
    queryKey: ["/api/admin/content/sections"],
  });

  const { data: textContent = [] } = useQuery({
    queryKey: ["/api/admin/content/text"],
  });

  const { data: imageAssets = [] } = useQuery({
    queryKey: ["/api/admin/content/images"],
  });

  const { data: themeSettings } = useQuery({
    queryKey: ["/api/admin/content/theme"],
  });

  const { data: layoutConfigs = [] } = useQuery({
    queryKey: ["/api/admin/content/layouts"],
  });

  // Mutations
  const updateContentSection = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/admin/content/sections/${data.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/sections"] });
      toast({ title: "Content updated successfully!" });
      setEditingSection(null);
    }
  });

  const updateTextContent = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/admin/content/text", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/text"] });
      toast({ title: "Text content updated!" });
    }
  });

  const updateTheme = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/admin/content/theme", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/theme"] });
      toast({ title: "Theme updated successfully!" });
    }
  });

  const exportContent = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/admin/content/export");
      return response.json();
    },
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flutterbye-content-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Content exported successfully!" });
    }
  });

  const pages = ["home", "mint", "portfolio", "marketplace", "about", "sms-integration"];

  const filteredSections = contentSections.filter((section: any) => section.page === selectedPage);
  const filteredTextContent = textContent.filter((text: any) => text.category === selectedPage);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Content Management System</h1>
          <p className="text-muted-foreground">Easily manage all frontend content, layouts, and styling</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
          <Button 
            variant="outline"
            onClick={() => exportContent.mutate()}
            disabled={exportContent.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Text Content
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
        </TabsList>

        {/* Page Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Page Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {pages.map((page) => (
                <Button
                  key={page}
                  variant={selectedPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPage(page)}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Content Sections - {selectedPage}</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredSections.map((section: any) => (
                <Card key={section.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{section.section}</Badge>
                      <h4 className="font-medium">{section.title || "Untitled Section"}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={section.isActive}
                        onCheckedChange={(checked) => 
                          updateContentSection.mutate({...section, isActive: checked})
                        }
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingSection(section)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {section.description && (
                    <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {section.buttonText && (
                      <div>
                        <span className="font-medium">Button:</span> {section.buttonText}
                      </div>
                    )}
                    {section.imageUrl && (
                      <div>
                        <span className="font-medium">Image:</span> 
                        <img src={section.imageUrl} alt="" className="w-12 h-12 object-cover rounded ml-2 inline-block" />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Text Content Tab */}
        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Text Content - {selectedPage}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredTextContent.map((text: any) => (
                <div key={text.key} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{text.key}</div>
                    <div className="text-muted-foreground text-xs">{text.description}</div>
                  </div>
                  <div className="flex-2">
                    <Textarea
                      value={text.value}
                      onChange={(e) => {
                        const updatedText = { ...text, value: e.target.value };
                        updateTextContent.mutate(updatedText);
                      }}
                      className="min-h-[60px]"
                    />
                  </div>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Image Assets</span>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {imageAssets.map((image: any) => (
                  <Card key={image.id} className="overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.altText || image.name}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-3">
                      <div className="font-medium text-sm">{image.name}</div>
                      <div className="text-muted-foreground text-xs">{image.category}</div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          Used {image.usageCount}x
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {themeSettings && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="color" 
                          value={themeSettings.primaryColor}
                          className="w-12 h-10"
                        />
                        <Input 
                          value={themeSettings.primaryColor}
                          placeholder="#8B5CF6"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="color" 
                          value={themeSettings.secondaryColor}
                          className="w-12 h-10"
                        />
                        <Input 
                          value={themeSettings.secondaryColor}
                          placeholder="#EC4899"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Font Family</Label>
                      <Select value={themeSettings.fontFamily}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Custom CSS</Label>
                      <Textarea
                        value={themeSettings.customCss || ""}
                        placeholder="Add custom CSS here..."
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
              <Separator />
              <Button 
                onClick={() => updateTheme.mutate(themeSettings)}
                disabled={updateTheme.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Theme Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Configuration - {selectedPage}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Layout configuration tools coming soon...</p>
                <p className="text-sm">Control grid layouts, spacing, and responsive behavior</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Section Dialog */}
      <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Content Section</DialogTitle>
          </DialogHeader>
          {editingSection && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input 
                    value={editingSection.title || ""} 
                    onChange={(e) => setEditingSection({...editingSection, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input 
                    value={editingSection.subtitle || ""} 
                    onChange={(e) => setEditingSection({...editingSection, subtitle: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={editingSection.description || ""} 
                  onChange={(e) => setEditingSection({...editingSection, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Button Text</Label>
                  <Input 
                    value={editingSection.buttonText || ""} 
                    onChange={(e) => setEditingSection({...editingSection, buttonText: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Button Link</Label>
                  <Input 
                    value={editingSection.buttonLink || ""} 
                    onChange={(e) => setEditingSection({...editingSection, buttonLink: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input 
                  value={editingSection.imageUrl || ""} 
                  onChange={(e) => setEditingSection({...editingSection, imageUrl: e.target.value})}
                />
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={editingSection.isActive}
                    onCheckedChange={(checked) => setEditingSection({...editingSection, isActive: checked})}
                  />
                  <Label>Active</Label>
                </div>
                <Button 
                  onClick={() => updateContentSection.mutate(editingSection)}
                  disabled={updateContentSection.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}