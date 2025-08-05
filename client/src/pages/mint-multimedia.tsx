import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, FileImage, Upload, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import ImageUpload from "@/components/image-upload";

export default function MintMultimedia() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [value, setValue] = useState("");
  const [imageData, setImageData] = useState("");

  const createTokenMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/tokens", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Multimedia token created successfully",
      });
      // Reset form
      setMessage("");
      setMintAmount("");
      setValue("");
      setImageData("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create token",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !mintAmount || !value) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createTokenMutation.mutate({
      message: message.trim(),
      initialSupply: parseInt(mintAmount),
      value: parseFloat(value),
      tokenType: "multimedia",
      imageData: imageData || undefined
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Image className="h-10 w-10 text-orange-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Create Multimedia Token
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rich media experiences with images, videos, and interactive content
          </p>
        </div>

        {/* Media Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <FileImage className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold">Images & GIFs</h3>
              <p className="text-sm text-muted-foreground">Upload visual content</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Video className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <h3 className="font-semibold">Video Content</h3>
              <p className="text-sm text-muted-foreground">Rich video experiences</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Palette className="h-8 w-8 text-purple mx-auto mb-2" />
              <h3 className="font-semibold">Interactive Media</h3>
              <p className="text-sm text-muted-foreground">Engaging multimedia</p>
            </CardContent>
          </Card>
        </div>

        {/* Creation Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-orange-400" />
              Multimedia Token Details
            </CardTitle>
            <CardDescription>
              Create a token with rich media content and interactive elements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Media Upload Section */}
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5 text-orange-400" />
                    Media Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload 
                    onImageSelect={(base64Data: string) => {
                      setImageData(base64Data);
                      toast({
                        title: "Media Uploaded",
                        description: "Media content attached successfully",
                      });
                    }}
                    onImageRemove={() => {
                      setImageData("");
                    }}
                    selectedImage={imageData}
                  />
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="message">Token Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message (this will accompany your media content)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mintAmount">Token Quantity *</Label>
                  <Input
                    id="mintAmount"
                    type="number"
                    placeholder="1000"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Token Value (SOL) *</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.001"
                    placeholder="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    min="0"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-orange-400 hover:bg-orange-400/80 text-white"
                disabled={createTokenMutation.isPending}
              >
                {createTokenMutation.isPending ? "Creating Multimedia Token..." : "Create Multimedia Token"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}