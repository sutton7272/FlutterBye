import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Palette, 
  Sparkles, 
  Image, 
  Brush, 
  Camera,
  Zap,
  Crown,
  Star,
  Heart,
  TrendingUp,
  Plus,
  Coins,
  Calendar,
  QrCode,
  Download,
  Flame,
  Users,
  Eye,
  Gift,
  Mic,
  Upload,
  Wand2,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface MessageNFTCollection {
  id: string;
  message: string;
  image?: string;
  imageFile?: string;
  voiceFile?: string;
  creator: string;
  totalSupply: number;
  currentSupply: number;
  burnedSupply: number;
  valuePerNFT: number;
  currency: 'SOL' | 'USDC' | 'FLBY';
  burnToRedeem: boolean;
  qrCode: string;
  qrCodeData: string;
  collectionName: string;
  description: string;
  attributes: Record<string, string | number>;
  createdAt: string;
  updatedAt: string;
}

export default function FlutterArt() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [style, setStyle] = useState("digital");
  const [quality, setQuality] = useState([80]);
  const [creativity, setCreativity] = useState([70]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // API integration for AI art generation
    console.log("Generating art:", { prompt, negativePrompt, style, quality: quality[0], creativity: creativity[0] });
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const artStyles = [
    { value: "digital", label: "Digital Art", popular: true },
    { value: "oil_painting", label: "Oil Painting", popular: false },
    { value: "watercolor", label: "Watercolor", popular: true },
    { value: "sketch", label: "Pencil Sketch", popular: false },
    { value: "abstract", label: "Abstract", popular: true },
    { value: "photorealistic", label: "Photorealistic", popular: false },
    { value: "anime", label: "Anime Style", popular: true },
    { value: "cyberpunk", label: "Cyberpunk", popular: true },
    { value: "fantasy", label: "Fantasy Art", popular: false },
    { value: "minimalist", label: "Minimalist", popular: false }
  ];

  const featuredArtworks = [
    {
      id: 1,
      title: "Cosmic Butterfly Dreams",
      artist: "ArtistDAO",
      price: "2.5 SOL",
      likes: 124,
      views: 1847,
      rarity: "Rare",
      category: "Digital"
    },
    {
      id: 2,
      title: "Neon Genesis Protocol",
      artist: "CryptoCreator",
      price: "1.8 SOL",
      likes: 89,
      views: 1203,
      rarity: "Common",
      category: "Cyberpunk"
    },
    {
      id: 3,
      title: "Ethereal Landscapes",
      artist: "PixelMaster",
      price: "3.2 SOL",
      likes: 203,
      views: 2591,
      rarity: "Epic",
      category: "Fantasy"
    },
    {
      id: 4,
      title: "Abstract Emotions",
      artist: "DigitalDreamer",
      price: "1.2 SOL",
      likes: 156,
      views: 1674,
      rarity: "Uncommon",
      category: "Abstract"
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gradient">FlutterArt Studio</h1>
          <p className="text-xl text-muted-foreground mb-8">
            AI-powered NFT creation and decentralized art marketplace
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="outline" className="px-4 py-2">
              <Wand2 className="w-4 h-4 mr-2" />
              AI Generation
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Image className="w-4 h-4 mr-2" />
              NFT Marketplace
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Instant Minting
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Coins className="w-4 h-4 mr-2" />
              Royalty System
            </Badge>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="electric-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-electric-blue">12,847</div>
              <div className="text-sm text-muted-foreground">Artworks Created</div>
            </CardContent>
          </Card>
          <Card className="electric-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-electric-green">892.5 SOL</div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </CardContent>
          </Card>
          <Card className="electric-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-electric-purple">3,421</div>
              <div className="text-sm text-muted-foreground">Active Artists</div>
            </CardContent>
          </Card>
          <Card className="electric-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-electric-blue">15,692</div>
              <div className="text-sm text-muted-foreground">Collectors</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Enhanced Art Generation */}
          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                AI Art Generator
              </CardTitle>
              <CardDescription>
                Create unique NFTs with advanced AI-powered art generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="prompt">Art Description</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your artwork in detail..."
                  className="electric-border min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="negative">Negative Prompt (Optional)</Label>
                <Input
                  id="negative"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="What to avoid in the artwork..."
                  className="electric-border"
                />
              </div>

              <div>
                <Label htmlFor="style">Art Style</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {artStyles.map((styleOption) => (
                    <Button
                      key={styleOption.value}
                      variant={style === styleOption.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStyle(styleOption.value)}
                      className="justify-start"
                    >
                      {styleOption.label}
                      {styleOption.popular && <Star className="w-3 h-3 ml-1" />}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Quality: {quality[0]}%</Label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={quality[0]}
                  onChange={(e) => setQuality([Number(e.target.value)])}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Label>Creativity: {creativity[0]}%</Label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={creativity[0]}
                  onChange={(e) => setCreativity([Number(e.target.value)])}
                  className="w-full mt-2"
                />
              </div>

              <Button 
                onClick={handleGenerate}
                className="w-full electric-glow"
                disabled={!prompt || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Art...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate NFT Art
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Preview Canvas */}
          <Card className="electric-border">
            <CardHeader>
              <CardTitle>Art Preview</CardTitle>
              <CardDescription>Your generated artwork will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <Sparkles className="w-6 h-6 absolute top-5 left-1/2 transform -translate-x-1/2 text-electric-blue" />
                    </div>
                    <p className="text-muted-foreground">Creating your masterpiece...</p>
                    <div className="text-sm text-electric-blue mt-2">AI Processing: {Math.floor(Math.random() * 100)}%</div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Image className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg">Your AI-generated art will appear here</p>
                    <p className="text-sm mt-2">High-resolution NFT ready for minting</p>
                  </div>
                )}
              </div>
              
              {!isGenerating && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Mint NFT
                  </Button>
                  <Button variant="outline" size="sm">
                    <Brush className="w-4 h-4 mr-2" />
                    Variations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Featured Artworks Marketplace */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Artworks</h2>
            <Link href="/nft-marketplace">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtworks.map((artwork) => (
              <Card key={artwork.id} className="electric-border hover-lift overflow-hidden group">
                <div className="aspect-square bg-gradient-to-br from-electric-blue/20 to-electric-green/20 relative">
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-16 h-16 text-muted-foreground group-hover:scale-110 transition-transform" />
                  </div>
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {artwork.rarity}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {artwork.artist}</p>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{artwork.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      {artwork.views}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-bold">{artwork.price}</Badge>
                    <div className="flex items-center gap-1 text-sm text-red-400">
                      <Heart className="w-4 h-4" />
                      {artwork.likes}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Art Categories and Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="electric-border hover-lift">
            <CardHeader>
              <Brush className="w-8 h-8 text-electric-blue mb-2" />
              <CardTitle>Custom Commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Commission personalized artworks from top FlutterArt creators
              </p>
              <Button variant="outline" className="w-full">
                Commission Art
              </Button>
            </CardContent>
          </Card>

          <Card className="electric-border hover-lift">
            <CardHeader>
              <Crown className="w-8 h-8 text-electric-green mb-2" />
              <CardTitle>Limited Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Exclusive limited edition NFT collections with special utilities
              </p>
              <Link href="/limited-edition">
                <Button variant="outline" className="w-full">
                  Explore Collections
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="electric-border hover-lift">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-electric-purple mb-2" />
              <CardTitle>Artist Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track performance, earnings, and collector engagement
              </p>
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="electric-border">
          <CardHeader>
            <CardTitle>FlutterArt Studio Features</CardTitle>
            <CardDescription>
              Complete NFT art creation and marketplace ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Wand2 className="w-6 h-6" />
                <span>AI Generation</span>
                <span className="text-xs text-muted-foreground">Create with AI</span>
              </Button>
              
              <Link href="/nft-marketplace">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Image className="w-6 h-6" />
                  <span>Marketplace</span>
                  <span className="text-xs text-muted-foreground">Buy & Sell NFTs</span>
                </Button>
              </Link>
              
              <Link href="/message-nft-creator">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Sparkles className="w-6 h-6" />
                  <span>Message NFTs</span>
                  <span className="text-xs text-muted-foreground">Art + Messages</span>
                </Button>
              </Link>
              
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Artist Hub</span>
                <span className="text-xs text-muted-foreground">Creator Tools</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
    burnToRedeem: true,
    imageFile: "",
    voiceFile: "",
    customAttributes: {} as Record<string, string | number>
  });

  // AI and QR Code state
  const [aiPrompt, setAiPrompt] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [generatedQrCode, setGeneratedQrCode] = useState("");
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);

  // Fetch existing collections
  const { data: collections = [], isLoading: collectionsLoading } = useQuery<MessageNFTCollection[]>({
    queryKey: ['/api/message-nfts/collections'],
    retry: false,
  });

  // Create NFT collection mutation
  const createCollectionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/message-nfts/create", {
        ...data,
        creator: "demo-creator", // This would come from wallet connection
      });
    },
    onSuccess: () => {
      toast({
        title: "NFT Collection Created!",
        description: "Your Message NFT collection has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/message-nfts/collections'] });
      // Reset form
      setFormData({
        message: "",
        collectionName: "",
        description: "",
        totalSupply: 1,
        valuePerNFT: 0,
        currency: "SOL",
        burnToRedeem: true,
        imageFile: "",
        voiceFile: "",
        customAttributes: {}
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create NFT collection",
        variant: "destructive",
      });
    },
  });

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'voice') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'image') {
        setFormData(prev => ({ ...prev, imageFile: result }));
      } else {
        setFormData(prev => ({ ...prev, voiceFile: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // AI Art Generation
  const generateAIArt = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for AI art generation",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingArt(true);
    try {
      const response = await apiRequest("POST", "/api/ai/generate-image", {
        prompt: aiPrompt,
        style: "nft_art",
        dimensions: "1024x1024"
      });
      
      const result = await response.json();
      if (result.imageUrl) {
        // Convert image URL to base64 for storage
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/png');
          setFormData(prev => ({ ...prev, imageFile: base64 }));
        };
        img.src = result.imageUrl;
        
        toast({
          title: "AI Art Generated!",
          description: "Your custom NFT artwork has been created",
        });
      }
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate AI artwork",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingArt(false);
    }
  };

  // QR Code Generation
  const generateQRCode = async () => {
    if (!qrUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL for QR code generation",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/qr/generate", {
        data: qrUrl,
        size: 256,
        errorCorrectionLevel: 'M'
      });
      
      const result = await response.json();
      if (result.qrCode) {
        setGeneratedQrCode(result.qrCode);
        toast({
          title: "QR Code Generated!",
          description: "Your QR code is ready for download",
        });
      }
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  // Download QR Code
  const downloadQRCode = () => {
    if (!generatedQrCode) return;
    
    const link = document.createElement('a');
    link.href = generatedQrCode;
    link.download = `qr-code-${Date.now()}.png`;
    link.click();
  };

  const creationOptions = [
    {
      id: "basic-nft",
      title: "Basic Message NFT",
      description: "Simple NFT with message and value",
      icon: Gift,
      color: "electric-green",
      features: ["Custom message", "Attach SOL/USDC value", "QR code claiming"],
      recommended: true
    },
    {
      id: "multimedia-nft",
      title: "Multimedia NFT",
      description: "NFT with image, voice, and message",
      icon: Camera,
      color: "purple",
      features: ["Custom artwork", "Voice messages", "Rich metadata"],
      recommended: true
    },
    {
      id: "limited-edition",
      title: "Limited Edition Set",
      description: "Numbered collection with scarcity",
      icon: Crown,
      color: "electric-blue",
      features: ["Limited supply", "Numbered series", "Collectible rarity"],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Palette className="h-12 w-12 text-electric-blue animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-electric-blue via-purple-400 to-electric-green bg-clip-text text-transparent">
              FlutterArt
            </h1>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold">
              NFT STUDIO
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create unique Message NFTs with attached value, custom artwork, and voice messages - the NFT equivalent of 27-character message tokens
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="outline" className="text-electric-blue border-electric-blue">
              Custom Artwork
            </Badge>
            <Badge variant="outline" className="text-electric-green border-electric-green">
              Voice Messages
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              Burn-to-Redeem
            </Badge>
          </div>
        </div>

        {/* Main Interface */}
        <Card className="max-w-6xl mx-auto electric-frame">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Brush className="h-6 w-6 text-electric-blue" />
              Message NFT Creation Studio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create NFT
                </TabsTrigger>
                <TabsTrigger value="collections" className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  My Collections
                </TabsTrigger>
                <TabsTrigger value="qr-generator" className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Generator
                </TabsTrigger>
                <TabsTrigger value="marketplace" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Marketplace
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Create NFT Tab */}
              <TabsContent value="create" className="mt-6">
                <div className="space-y-6">
                  {/* Creation Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {creationOptions.map((option) => (
                      <Card 
                        key={option.id} 
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          createMode === option.id.replace('-nft', '') ? 'ring-2 ring-electric-blue' : ''
                        }`}
                        onClick={() => setCreateMode(option.id.replace('-nft', ''))}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <option.icon className={`h-8 w-8 text-${option.color} mt-1`} />
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{option.title}</h3>
                              <p className="text-xs text-muted-foreground mb-2">{option.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {option.features.map((feature, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                              {option.recommended && (
                                <Badge variant="outline" className="text-electric-green border-electric-green text-xs mt-2">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Creation Form */}
                  <Card className="electric-frame">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-electric-blue" />
                        Create Your Message NFT
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                              placeholder="Enter your message (similar to 27-character tokens, but no limit for NFTs)"
                              className="min-h-[100px]"
                            />
                          </div>

                          <div>
                            <Label htmlFor="collectionName">Collection Name</Label>
                            <Input
                              id="collectionName"
                              value={formData.collectionName}
                              onChange={(e) => setFormData(prev => ({ ...prev, collectionName: e.target.value }))}
                              placeholder="e.g., Holiday Greetings NFT"
                            />
                          </div>

                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Describe your NFT collection..."
                            />
                          </div>

                          {(createMode === 'multimedia' || createMode === 'limited-edition') && (
                            <div className="space-y-4">
                              <Label>Custom Artwork</Label>
                              
                              {/* AI Art Generation */}
                              <Card className="bg-gradient-to-r from-electric-blue/10 to-purple-500/10 border-electric-blue/30">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-electric-blue" />
                                    AI Art Generator
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <Textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="Describe the artwork you want to create (e.g., 'a futuristic butterfly with electric blue wings and cosmic background')"
                                    className="min-h-[80px]"
                                  />
                                  <Button 
                                    onClick={generateAIArt}
                                    disabled={isGeneratingArt || !aiPrompt.trim()}
                                    className="w-full bg-gradient-to-r from-electric-blue to-purple-500"
                                  >
                                    {isGeneratingArt ? (
                                      <>
                                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                                        Generating AI Art...
                                      </>
                                    ) : (
                                      <>
                                        <Wand2 className="h-4 w-4 mr-2" />
                                        Generate AI Artwork
                                      </>
                                    )}
                                  </Button>
                                </CardContent>
                              </Card>

                              {/* Manual Upload */}
                              <div className="text-center text-sm text-muted-foreground">or</div>
                              
                              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                                <input
                                  id="imageUpload"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, 'image')}
                                  className="hidden"
                                />
                                <label htmlFor="imageUpload" className="cursor-pointer">
                                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">
                                    Click to upload your own artwork
                                  </p>
                                </label>
                                {formData.imageFile && (
                                  <div className="mt-2">
                                    <Badge variant="outline" className="text-green-600">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Artwork ready
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {createMode === 'multimedia' && (
                            <div>
                              <Label htmlFor="voiceUpload">Voice Message</Label>
                              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                                <input
                                  id="voiceUpload"
                                  type="file"
                                  accept="audio/*"
                                  onChange={(e) => handleFileUpload(e, 'voice')}
                                  className="hidden"
                                />
                                <label htmlFor="voiceUpload" className="cursor-pointer">
                                  <Mic className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">
                                    Click to upload voice message
                                  </p>
                                </label>
                                {formData.voiceFile && (
                                  <div className="mt-2">
                                    <Badge variant="outline" className="text-green-600">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Voice uploaded
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="totalSupply">Edition Size</Label>
                              <Input
                                id="totalSupply"
                                type="number"
                                min="1"
                                max="10000"
                                value={formData.totalSupply}
                                onChange={(e) => setFormData(prev => ({ ...prev, totalSupply: parseInt(e.target.value) || 1 }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="valuePerNFT">Value per NFT</Label>
                              <Input
                                id="valuePerNFT"
                                type="number"
                                min="0"
                                step="0.001"
                                value={formData.valuePerNFT}
                                onChange={(e) => setFormData(prev => ({ ...prev, valuePerNFT: parseFloat(e.target.value) || 0 }))}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Select 
                              value={formData.currency} 
                              onValueChange={(value: "SOL" | "USDC" | "FLBY") => 
                                setFormData(prev => ({ ...prev, currency: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SOL">SOL</SelectItem>
                                <SelectItem value="USDC">USDC</SelectItem>
                                <SelectItem value="FLBY">FLBY</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="burnToRedeem">Enable Burn-to-Redeem</Label>
                            <Switch
                              id="burnToRedeem"
                              checked={formData.burnToRedeem}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, burnToRedeem: checked }))}
                            />
                          </div>

                          {/* Preview Section */}
                          <Card className="bg-muted/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">NFT Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Gift className="h-4 w-4 text-electric-blue" />
                                <span className="font-medium">Message:</span>
                                <span className="text-muted-foreground truncate">
                                  {formData.message || "Enter message..."}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Coins className="h-4 w-4 text-electric-green" />
                                <span className="font-medium">Value:</span>
                                <span className="text-muted-foreground">
                                  {formData.valuePerNFT} {formData.currency}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Crown className="h-4 w-4 text-purple-400" />
                                <span className="font-medium">Edition:</span>
                                <span className="text-muted-foreground">
                                  {formData.totalSupply} NFTs
                                </span>
                              </div>
                              {formData.burnToRedeem && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Flame className="h-4 w-4 text-orange-400" />
                                  <span className="font-medium">Burn-to-Redeem:</span>
                                  <span className="text-green-600">Enabled</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          <Button 
                            onClick={() => createCollectionMutation.mutate(formData)}
                            disabled={!formData.message || !formData.collectionName || createCollectionMutation.isPending}
                            className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80"
                          >
                            {createCollectionMutation.isPending ? (
                              "Creating NFT Collection..."
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Create NFT Collection
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* QR Code Generator Tab */}
              <TabsContent value="qr-generator" className="mt-6">
                <Card className="max-w-2xl mx-auto electric-frame">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-electric-blue" />
                      QR Code Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="qrUrl">Website URL</Label>
                        <Input
                          id="qrUrl"
                          value={qrUrl}
                          onChange={(e) => setQrUrl(e.target.value)}
                          placeholder="https://example.com"
                          type="url"
                        />
                      </div>
                      
                      <Button 
                        onClick={generateQRCode}
                        disabled={!qrUrl.trim()}
                        className="w-full bg-gradient-to-r from-electric-blue to-electric-green"
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Generate QR Code
                      </Button>
                    </div>

                    {generatedQrCode && (
                      <Card className="bg-muted/50">
                        <CardContent className="p-6 text-center space-y-4">
                          <div className="flex justify-center">
                            <img 
                              src={generatedQrCode} 
                              alt="Generated QR Code" 
                              className="border rounded-lg shadow-lg"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">QR Code for: {qrUrl}</p>
                            <Button 
                              onClick={downloadQRCode}
                              variant="outline"
                              className="w-full"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download QR Code
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="text-center">
                      <h3 className="font-semibold mb-2">QR Code Uses:</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div>• Website links</div>
                        <div>• NFT collections</div>
                        <div>• Social media</div>
                        <div>• Contact info</div>
                        <div>• Event tickets</div>
                        <div>• Marketing campaigns</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Collections Tab */}
              <TabsContent value="collections" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your NFT Collections</h3>
                    <Badge variant="outline">
                      {collections.length} Collections
                    </Badge>
                  </div>
                  
                  {collectionsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-4">
                            <div className="h-4 bg-muted rounded mb-2"></div>
                            <div className="h-3 bg-muted rounded mb-1"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : collections.length === 0 ? (
                    <Card className="p-8 text-center">
                      <div className="space-y-4">
                        <Crown className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold">No Collections Yet</h3>
                          <p className="text-muted-foreground">Create your first Message NFT collection to get started</p>
                        </div>
                        <Button 
                          onClick={() => setActiveTab("create")}
                          className="bg-gradient-to-r from-electric-blue to-electric-green"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Collection
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {collections.map((collection: MessageNFTCollection) => (
                        <Card key={collection.id} className="hover:shadow-lg transition-shadow electric-frame">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <h4 className="font-semibold truncate">{collection.collectionName}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {collection.currentSupply}/{collection.totalSupply}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {collection.message}
                              </p>
                              
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{collection.valuePerNFT} {collection.currency}</span>
                                <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <QrCode className="h-3 w-3 mr-1" />
                                  QR Code
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Marketplace Tab */}
              <TabsContent value="marketplace" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-electric-green" />
                      NFT Marketplace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground">
                        The NFT marketplace will allow trading and discovering Message NFTs
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-purple-400" />
                      Collection Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Crown className="h-8 w-8 text-electric-blue mx-auto mb-2" />
                          <div className="text-2xl font-bold">{collections.length}</div>
                          <div className="text-sm text-muted-foreground">Collections</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Gift className="h-8 w-8 text-electric-green mx-auto mb-2" />
                          <div className="text-2xl font-bold">
                            {collections.reduce((sum, c) => sum + c.totalSupply, 0)}
                          </div>
                          <div className="text-sm text-muted-foreground">Total NFTs</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold">
                            {collections.reduce((sum, c) => sum + c.currentSupply, 0)}
                          </div>
                          <div className="text-sm text-muted-foreground">Claimed</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold">
                            {collections.reduce((sum, c) => sum + c.burnedSupply, 0)}
                          </div>
                          <div className="text-sm text-muted-foreground">Burned</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        Detailed analytics and performance metrics coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}