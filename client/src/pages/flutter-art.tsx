import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { WalletConnect } from "@/components/wallet-connect";
import { useWallet } from "@/hooks/useWallet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Upload,
  Coins,
  Gift,
  Copy,
  ExternalLink,
  Eye,
  Download,
  Share,
  Trash2,
  Edit,
  Plus,
  Wallet,
  DollarSign
} from "lucide-react";


export default function FlutterArt() {
  const [activeTab, setActiveTab] = useState("create");
  const [nftTitle, setNftTitle] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftValue, setNftValue] = useState("");
  const [nftImage, setNftImage] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { wallet, isConnected } = useWallet();
  const queryClient = useQueryClient();

  // Fetch user's NFT collections
  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ["/api/flutter-art/collections"],
    enabled: isConnected,
  });

  // Fetch marketplace NFTs
  const { data: marketplaceNfts, isLoading: marketplaceLoading } = useQuery({
    queryKey: ["/api/flutter-art/marketplace"],
  });

  // Fetch user's NFTs
  const { data: userNfts, isLoading: userNftsLoading } = useQuery({
    queryKey: ["/api/flutter-art/my-nfts"],
    enabled: isConnected,
  });

  // Create NFT mutation
  const createNftMutation = useMutation({
    mutationFn: async (nftData: any) => {
      const formData = new FormData();
      formData.append("title", nftData.title);
      formData.append("description", nftData.description);
      formData.append("value", nftData.value);
      formData.append("collection", nftData.collection);
      if (nftData.imageFile) {
        formData.append("image", nftData.imageFile);
      }
      
      return apiRequest("POST", "/api/flutter-art/create", formData);
    },
    onSuccess: () => {
      toast({
        title: "NFT Created Successfully!",
        description: "Your FlutterArt NFT has been minted on Solana blockchain",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/flutter-art/my-nfts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/flutter-art/marketplace"] });
      // Reset form
      setNftTitle("");
      setNftDescription("");
      setNftValue("");
      setNftImage("");
      setImageFile(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create NFT",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setNftImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle NFT creation
  const handleCreateNft = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create NFTs",
        variant: "destructive",
      });
      return;
    }

    if (!nftTitle || !nftDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and description",
        variant: "destructive",
      });
      return;
    }

    createNftMutation.mutate({
      title: nftTitle,
      description: nftDescription,
      value: nftValue || "0",
      collection: selectedCollection,
      imageFile: imageFile,
    });
  };

  const nftCategories = [
    {
      icon: Palette,
      title: "AI-Generated Art",
      description: "Create stunning visuals with AI",
      color: "text-purple-400",
      count: userNfts?.filter((n: any) => n.category === 'ai-art')?.length || 0
    },
    {
      icon: Camera,
      title: "Photography NFTs",
      description: "Transform photos into NFTs",
      color: "text-blue-400",
      count: userNfts?.filter((n: any) => n.category === 'photography')?.length || 0
    },
    {
      icon: Brush,
      title: "Digital Art",
      description: "Hand-crafted digital masterpieces",
      color: "text-green-400",
      count: userNfts?.filter((n: any) => n.category === 'digital-art')?.length || 0
    },
    {
      icon: Sparkles,
      title: "Message NFTs",
      description: "27-character visual messages",
      color: "text-orange-400",
      count: userNfts?.filter((n: any) => n.category === 'message')?.length || 0
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-12 w-12 text-electric-blue animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-electric-blue via-purple to-electric-green bg-clip-text text-transparent">
              FlutterArt
            </h1>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold">
              NFT STUDIO
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create, mint, and trade unique NFT artworks on Solana blockchain - The visual equivalent 
            of FlutterbyeMSG tokens with embedded value and artistic expression
          </p>
        </div>

        {/* Wallet Connection */}
        {!isConnected && (
          <div className="max-w-md mx-auto">
            <Card className="electric-frame">
              <CardContent className="p-6 text-center">
                <Wallet className="h-12 w-12 text-electric-blue mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your wallet to create and manage NFTs
                </p>
                <WalletConnect />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Category Stats */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {nftCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow electric-frame group cursor-pointer">
                <CardContent className="p-4 text-center">
                  <category.icon className={`h-8 w-8 ${category.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-sm font-semibold mb-1">{category.title}</h3>
                  <div className="text-2xl font-bold text-electric-blue">{category.count}</div>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main Interface */}
        {isConnected && (
          <Card className="max-w-6xl mx-auto electric-frame">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-electric-blue" />
                FlutterArt NFT Studio
                <Badge className="bg-electric-blue text-white">Connected</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="create" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create NFT
                  </TabsTrigger>
                  <TabsTrigger value="my-nfts" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    My NFTs
                  </TabsTrigger>
                  <TabsTrigger value="marketplace" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Marketplace
                  </TabsTrigger>
                  <TabsTrigger value="collections" className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Collections
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>

              <TabsContent value="create" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* NFT Creation Form */}
                  <Card className="electric-frame">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-electric-blue" />
                        Create NFT Artwork
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Image Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="nft-image">Artwork Image</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-electric-blue/50 transition-colors cursor-pointer"
                             onClick={() => document.getElementById('image-upload')?.click()}>
                          {nftImage ? (
                            <div className="space-y-2">
                              <img src={nftImage} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                              <p className="text-sm text-muted-foreground">Click to change image</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload artwork image
                              </p>
                            </div>
                          )}
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>

                      {/* NFT Details */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nft-title">NFT Title</Label>
                          <Input
                            id="nft-title"
                            placeholder="Enter your NFT title"
                            value={nftTitle}
                            onChange={(e) => setNftTitle(e.target.value)}
                            maxLength={50}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {nftTitle.length}/50 characters
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="nft-description">Description</Label>
                          <Textarea
                            id="nft-description"
                            placeholder="Describe your NFT artwork..."
                            value={nftDescription}
                            onChange={(e) => setNftDescription(e.target.value)}
                            maxLength={500}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {nftDescription.length}/500 characters
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="nft-value">Value (SOL) - Optional</Label>
                          <Input
                            id="nft-value"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={nftValue}
                            onChange={(e) => setNftValue(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Attach SOL value to your NFT (redeemable by holder)
                          </p>
                        </div>
                      </div>

                      {/* Create Button */}
                      <Button 
                        onClick={handleCreateNft}
                        disabled={createNftMutation.isPending}
                        className="w-full bg-gradient-to-r from-electric-blue to-purple hover:from-electric-blue/80 hover:to-purple/80"
                      >
                        {createNftMutation.isPending ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Minting NFT...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Mint FlutterArt NFT
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Creation Options */}
                  <div className="space-y-6">
                    <Card className="electric-frame">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brush className="h-5 w-5 text-purple-400" />
                          Creation Tools
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button className="w-full justify-start" variant="outline">
                          <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                          AI Art Generator
                          <Badge className="ml-auto">Coming Soon</Badge>
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Camera className="h-4 w-4 mr-2 text-blue-400" />
                          Photo to NFT
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Heart className="h-4 w-4 mr-2 text-red-400" />
                          Message NFT
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="electric-frame">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-electric-green" />
                          NFT Economics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Creation Fee:</span>
                          <span className="text-electric-blue">0.01 SOL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform Fee:</span>
                          <span className="text-electric-blue">2.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Royalty (Optional):</span>
                          <span className="text-electric-blue">0-10%</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Your NFT Value:</span>
                            <span className="text-electric-green">
                              {nftValue ? `${nftValue} SOL` : "No value"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="my-nfts" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">My NFT Collection</h3>
                    <Badge variant="secondary">
                      {userNfts?.length || 0} NFTs
                    </Badge>
                  </div>
                  
                  {userNftsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-muted rounded"></div>
                              <div className="h-3 bg-muted rounded w-2/3"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : userNfts?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {userNfts.map((nft: any, index: number) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow electric-frame group">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gradient-to-br from-electric-blue/20 to-purple/20 rounded-lg mb-4 overflow-hidden">
                              {nft.image ? (
                                <img src={nft.image} alt={nft.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image className="h-16 w-16 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold truncate">{nft.title}</h4>
                                {nft.hasValue && <Badge className="bg-electric-green text-black">Value</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{nft.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-electric-blue">
                                  {nft.value ? `${nft.value} SOL` : 'No value'}
                                </span>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Share className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="text-center p-12">
                      <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No NFTs Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Create your first FlutterArt NFT to get started
                      </p>
                      <Button onClick={() => setActiveTab("create")} className="bg-electric-blue hover:bg-electric-blue/80">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First NFT
                      </Button>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="marketplace" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">NFT Marketplace</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Filter</Button>
                      <Button variant="outline" size="sm">Sort</Button>
                    </div>
                  </div>
                  
                  {marketplaceLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-3">
                            <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                            <div className="space-y-2">
                              <div className="h-3 bg-muted rounded"></div>
                              <div className="h-2 bg-muted rounded w-2/3"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : marketplaceNfts?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {marketplaceNfts.map((nft: any, index: number) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow electric-frame group cursor-pointer">
                          <CardContent className="p-3">
                            <div className="aspect-square bg-gradient-to-br from-electric-blue/20 to-purple/20 rounded-lg mb-3 overflow-hidden">
                              {nft.image ? (
                                <img src={nft.image} alt={nft.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-medium text-sm truncate">{nft.title}</h4>
                              <p className="text-xs text-muted-foreground truncate">by {nft.creator}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-electric-blue">
                                  {nft.price} SOL
                                </span>
                                <div className="flex items-center gap-1 text-red-400">
                                  <Heart className="h-3 w-3" />
                                  <span className="text-xs">{nft.likes || 0}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="text-center p-12">
                      <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Marketplace Coming Soon</h3>
                      <p className="text-muted-foreground mb-6">
                        Buy, sell, and trade FlutterArt NFTs with other collectors
                      </p>
                      <Button disabled className="bg-electric-green hover:bg-electric-green/80 text-black">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Browse Marketplace
                      </Button>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="collections" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">NFT Collections</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Collection
                    </Button>
                  </div>
                  
                  <Card className="text-center p-12">
                    <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Limited Edition Collections</h3>
                    <p className="text-muted-foreground mb-6">
                      Group your NFTs into exclusive collections with shared themes
                    </p>
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                      <Crown className="h-4 w-4 mr-2" />
                      Create First Collection
                    </Button>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">NFT Analytics</h3>
                    <Badge variant="secondary">Last 30 days</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="electric-frame">
                      <CardContent className="p-4 text-center">
                        <Sparkles className="h-8 w-8 text-electric-blue mx-auto mb-2" />
                        <div className="text-2xl font-bold">{userNfts?.length || 0}</div>
                        <div className="text-sm text-muted-foreground">Total NFTs Created</div>
                      </CardContent>
                    </Card>
                    <Card className="electric-frame">
                      <CardContent className="p-4 text-center">
                        <DollarSign className="h-8 w-8 text-electric-green mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          {userNfts?.reduce((sum: number, nft: any) => sum + (parseFloat(nft.value) || 0), 0).toFixed(2)} SOL
                        </div>
                        <div className="text-sm text-muted-foreground">Total Value Created</div>
                      </CardContent>
                    </Card>
                    <Card className="electric-frame">
                      <CardContent className="p-4 text-center">
                        <Eye className="h-8 w-8 text-purple mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          {userNfts?.reduce((sum: number, nft: any) => sum + (nft.views || 0), 0) || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Views</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="electric-frame">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-electric-green" />
                        Performance Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-8">
                        <TrendingUp className="h-12 w-12 text-electric-green mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                        <p className="text-muted-foreground mb-4">
                          Track your NFT performance, views, and engagement metrics
                        </p>
                        <Badge variant="secondary">Coming Soon</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        )}

      </div>
    </div>
  );
}