import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  ImageIcon, 
  Upload, 
  Save, 
  RotateCcw, 
  Eye, 
  Settings,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string;
  dataType: string;
  isEditable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DefaultImageResponse {
  success: boolean;
  defaultImage: string;
}

export default function AdminDefaultImage() {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current default token image
  const { data: defaultImageData, isLoading: imageLoading } = useQuery<DefaultImageResponse>({
    queryKey: ["/api/default-token-image"],
  });

  // Fetch system settings
  const { data: settingsData, isLoading: settingsLoading } = useQuery<{success: boolean, settings: SystemSetting[]}>({
    queryKey: ["/api/admin/system-settings"],
  });

  // Update default image mutation
  const updateImageMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      const response = await fetch("/api/admin/default-token-image", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update image");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Default token image updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/default-token-image"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/system-settings"] });
      setNewImageUrl("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update default token image",
        variant: "destructive",
      });
    },
  });

  // Reset to original butterfly logo
  const resetToOriginal = () => {
    const originalImage = "/assets/image_1754114527645.png";
    updateImageMutation.mutate(originalImage);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }
    updateImageMutation.mutate(newImageUrl.trim());
  };

  const currentImage = defaultImageData?.defaultImage || "";
  const defaultSetting = settingsData?.settings?.find(s => s.key === "default_token_image");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <Settings className="h-8 w-8 text-cyan-400" />
            Default Token Image Management
          </h1>
          <p className="text-slate-300">
            Configure the default image used for all tokens without custom uploads
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Settings */}
          <Card className="bg-slate-800/50 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-cyan-400" />
                Current Default Image
              </CardTitle>
              <CardDescription className="text-slate-400">
                Currently active default token image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {imageLoading ? (
                <div className="flex items-center justify-center h-32 bg-slate-700/50 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              ) : currentImage ? (
                <div className="space-y-3">
                  <div className="relative group">
                    <img
                      src={currentImage}
                      alt="Current default token image"
                      className="w-full h-32 object-cover rounded-lg border border-slate-600"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/api/placeholder/150/150";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPreviewOpen(true)}
                        className="text-white border-white/30 hover:bg-white/10"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                        Active
                      </Badge>
                      <Badge variant="secondary" className="text-slate-300">
                        {currentImage.includes('image_1754114527645') ? 'Butterfly Logo' : 'Custom Image'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 break-all">
                      {currentImage}
                    </p>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No default image configured
                  </AlertDescription>
                </Alert>
              )}

              {/* System Setting Details */}
              {defaultSetting && (
                <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <h4 className="text-sm font-medium text-white mb-2">System Setting Details</h4>
                  <div className="space-y-1 text-xs text-slate-400">
                    <div><span className="text-slate-300">ID:</span> {defaultSetting.id}</div>
                    <div><span className="text-slate-300">Category:</span> {defaultSetting.category}</div>
                    <div><span className="text-slate-300">Type:</span> {defaultSetting.dataType}</div>
                    <div><span className="text-slate-300">Updated:</span> {new Date(defaultSetting.updatedAt).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Update Form */}
          <Card className="bg-slate-800/50 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-400" />
                Update Default Image
              </CardTitle>
              <CardDescription className="text-slate-400">
                Change the default image for all new tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-white">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/image.png or /assets/image.png"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    disabled={updateImageMutation.isPending}
                  />
                </div>

                {/* Preview new image */}
                {newImageUrl && (
                  <div className="space-y-2">
                    <Label className="text-white">Preview</Label>
                    <img
                      src={newImageUrl}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded border border-slate-600"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/api/placeholder/100/100";
                      }}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={updateImageMutation.isPending || !newImageUrl.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {updateImageMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Image
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetToOriginal}
                    disabled={updateImageMutation.isPending}
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Original
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Usage Information */}
        <Card className="bg-slate-800/50 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-400" />
              Usage Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-white mb-2">How it works</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Default image applies to all tokens without custom uploads</li>
                  <li>• Changes take effect immediately for new tokens</li>
                  <li>• Existing tokens keep their current images</li>
                  <li>• Supports both external URLs and local asset paths</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Supported formats</h4>
                <ul className="space-y-1 text-sm">
                  <li>• HTTPS URLs: https://example.com/image.png</li>
                  <li>• Asset paths: /assets/image.png</li>
                  <li>• File types: PNG, JPG, JPEG, GIF, SVG</li>
                  <li>• Recommended size: 400x400px or larger</li>
                </ul>
              </div>
            </div>

            <Separator className="bg-slate-600" />

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-slate-300">
                The original Flutterbye butterfly logo is available at: /assets/image_1754114527645.png
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Image Preview Modal */}
        {isPreviewOpen && currentImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="p-4 border-b border-slate-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Default Token Image Preview</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPreviewOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <img
                  src={currentImage}
                  alt="Default token image preview"
                  className="w-full h-auto rounded border border-slate-600"
                />
                <p className="mt-2 text-sm text-slate-400 break-all">
                  {currentImage}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}