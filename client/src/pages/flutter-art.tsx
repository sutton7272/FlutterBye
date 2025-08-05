import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingUp
} from "lucide-react";
import Navbar from "@/components/navbar";

export default function FlutterArt() {
  const [activeTab, setActiveTab] = useState("gallery");

  const artCategories = [
    {
      icon: Palette,
      title: "AI-Generated Art",
      description: "Create stunning visuals with advanced AI algorithms",
      color: "text-purple-400",
      count: "2.5K+ pieces"
    },
    {
      icon: Camera,
      title: "Photography NFTs",
      description: "Transform your photos into valuable digital assets",
      color: "text-blue-400",
      count: "1.8K+ photos"
    },
    {
      icon: Brush,
      title: "Digital Paintings",
      description: "Hand-crafted digital masterpieces by artists",
      color: "text-green-400",
      count: "3.2K+ paintings"
    },
    {
      icon: Sparkles,
      title: "Animated Art",
      description: "Dynamic and interactive animated creations",
      color: "text-orange-400",
      count: "950+ animations"
    },
    {
      icon: Crown,
      title: "Limited Collections",
      description: "Exclusive limited edition art collections",
      color: "text-yellow-400",
      count: "125+ collections"
    },
    {
      icon: Zap,
      title: "Interactive Art",
      description: "Responsive art that changes with user interaction",
      color: "text-red-400",
      count: "420+ pieces"
    }
  ];

  const featuredArt = [
    {
      title: "Quantum Butterfly Dreams",
      artist: "AI_Artist_001",
      price: "2.5 SOL",
      likes: 234,
      trending: true
    },
    {
      title: "Electric Emotions",
      artist: "DigitalVision",
      price: "1.8 SOL",
      likes: 187,
      trending: false
    },
    {
      title: "Cyber Garden",
      artist: "TechArt_Pro",
      price: "3.2 SOL",
      likes: 312,
      trending: true
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Palette className="h-12 w-12 text-electric-blue animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-electric-blue via-purple to-electric-green bg-clip-text text-transparent">
              FlutterArt
            </h1>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold">
              NFT GALLERY
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The premier destination for digital art NFTs on Solana - Create, collect, and trade 
            unique digital masterpieces with blockchain-verified authenticity
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {artCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow electric-frame group cursor-pointer">
              <CardContent className="p-6 text-center">
                <category.icon className={`h-12 w-12 ${category.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground mb-2">{category.description}</p>
                <Badge variant="secondary" className="text-xs">{category.count}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Interface */}
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Image className="h-6 w-6 text-electric-blue" />
              FlutterArt Studio & Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="gallery" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Brush className="h-4 w-4" />
                  Create
                </TabsTrigger>
                <TabsTrigger value="collections" className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Collections
                </TabsTrigger>
                <TabsTrigger value="marketplace" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Marketplace
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  My Art
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gallery" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Featured Artworks</h3>
                    <Button variant="outline">View All</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredArt.map((art, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mb-4 flex items-center justify-center">
                            <Image className="h-16 w-16 text-muted-foreground" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{art.title}</h4>
                              {art.trending && <Badge className="bg-electric-green text-black">Trending</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">by {art.artist}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-electric-blue">{art.price}</span>
                              <div className="flex items-center gap-1 text-red-400">
                                <Heart className="h-4 w-4" />
                                <span className="text-sm">{art.likes}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="create" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brush className="h-5 w-5 text-purple-400" />
                      Create Your Digital Masterpiece
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="text-center p-6 cursor-pointer hover:shadow-lg transition-shadow">
                        <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">AI Art Generator</h3>
                        <p className="text-muted-foreground mb-4">Create stunning art using advanced AI algorithms</p>
                        <Button className="bg-purple-500 hover:bg-purple-600">Generate AI Art</Button>
                      </Card>
                      <Card className="text-center p-6 cursor-pointer hover:shadow-lg transition-shadow">
                        <Camera className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Upload Artwork</h3>
                        <p className="text-muted-foreground mb-4">Upload your own digital creations as NFTs</p>
                        <Button className="bg-blue-500 hover:bg-blue-600">Upload Art</Button>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="collections" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-400" />
                      Limited Edition Collections
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Exclusive Art Collections</h3>
                      <p className="text-muted-foreground mb-6">
                        Discover rare and limited edition art collections from renowned digital artists
                      </p>
                      <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                        Explore Collections
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="marketplace" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                      Art Marketplace
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <TrendingUp className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Buy & Sell Digital Art</h3>
                      <p className="text-muted-foreground mb-6">
                        Trade digital art NFTs with other collectors and artists
                      </p>
                      <Button className="bg-green-400 hover:bg-green-500 text-black">
                        Browse Marketplace
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-orange-400" />
                      My Art Portfolio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <Star className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Your Digital Art Collection</h3>
                      <p className="text-muted-foreground mb-6">
                        Manage your created and collected digital artworks
                      </p>
                      <Button className="bg-orange-400 hover:bg-orange-500 text-black">
                        View Portfolio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-electric-blue">8.6K+</div>
              <div className="text-sm text-muted-foreground">Total Artworks</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-electric-green">2.1K+</div>
              <div className="text-sm text-muted-foreground">Active Artists</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple">125</div>
              <div className="text-sm text-muted-foreground">Collections</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-400">4.8K+</div>
              <div className="text-sm text-muted-foreground">Collectors</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}