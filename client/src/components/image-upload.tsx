import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  onImageRemove: () => void;
  selectedImage?: string;
  disabled?: boolean;
}

export default function ImageUpload({ 
  onImageSelect, 
  onImageRemove, 
  selectedImage, 
  disabled = false 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, GIF, WebP)",
        variant: "destructive",
      });
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image must be smaller than 5MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsProcessing(true);
    
    try {
      // Resize image if needed
      const resizedImage = await resizeImage(file, 400, 400);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/...;base64, prefix
        onImageSelect(base64Data);
        setIsProcessing(false);
        
        toast({
          title: "Image uploaded",
          description: "Token image has been set successfully",
        });
      };
      reader.readAsDataURL(resizedImage);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Upload failed",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and resize
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png', 0.9);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!disabled && !isProcessing) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Token Image (Optional)</Label>
        <Badge variant="secondary" className="text-xs">
          +0.005 SOL fee
        </Badge>
      </div>
      
      {selectedImage ? (
        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="relative">
              <img 
                src={`data:image/png;base64,${selectedImage}`}
                alt="Token preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Click the X to remove or upload a new image
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-8 text-center">
            {isProcessing ? (
              <div className="space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Processing image...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Upload token image</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Drag & drop or click to select
                  </p>
                  <Button type="button" variant="outline" size="sm" disabled={disabled}>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF, WebP • Max 5MB • Recommended: 400x400px
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}