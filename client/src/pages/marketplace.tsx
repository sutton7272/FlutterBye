import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import TokenCard from "@/components/token-card";
import { Search, Filter, ShoppingCart, Flame, Image as ImageIcon, Volume2, Star, Crown, Gem, Zap, Eye, TrendingUp, Brain, Sparkles, BarChart3, Users, Timer, Heart, Award, Rocket, Lightning, Globe, ChevronRight, Play, Pause, RotateCcw } from "lucide-react";
import { type Token } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface NFTListing {
  id: string;
  collectionId: string;
  tokenNumber: number;
  message: string;
  imageFile?: string;
  voiceFile?: string;
  owner: string;
  price: number;
  currency: string;
  burnToRedeem: boolean;
  originalValue: number;
  collectionName: string;
  listedAt: string;
  rarity?: string;
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [selectedNFT, setSelectedNFT] = useState<NFTListing | null>(null);
  const [showBurnDialog, setShowBurnDialog] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showNFTPreview, setShowNFTPreview] = useState(false);
  const [selectedTab, setSelectedTab] = useState("marketplace");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<NFTListing[]>([]);
  const { toast } = useToast();

  // Fetch FLBY tokens
  const { data: tokens = [], isLoading: isLoadingTokens } = useQuery<Token[]>({
    queryKey: ["/api/tokens", { search: searchQuery }],
    enabled: true,
  });

  // Fetch NFT listings
  const { data: nftData, isLoading: isLoadingNFTs } = useQuery({
    queryKey: ['/api/marketplace/nfts'],
    refetchInterval: 30000
  });

  // Buy NFT mutation
  const buyNFTMutation = useMutation({
    mutationFn: async (nftId: string) => {
      const response = await apiRequest(`/api/marketplace/buy/${nftId}`, {
        method: 'POST',
        body: JSON.stringify({ buyerId: 'demo-buyer' })
      });
      return response;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Purchase Successful!",
        description: data?.message || "NFT purchased successfully",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/nfts'] });
      setShowBuyDialog(false);
      setSelectedNFT(null);
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to buy NFT",
        variant: "destructive",
      });
    }
  });

  // Burn NFT mutation
  const burnNFTMutation = useMutation({
    mutationFn: async (nftId: string) => {
      const response = await apiRequest(`/api/marketplace/burn/${nftId}`, {
        method: 'POST',
        body: JSON.stringify({ burnerId: 'demo-burner' })
      });
      return response;
    },
    onSuccess: (data: any) => {
      toast({
        title: "NFT Burned Successfully!",
        description: data?.message || "NFT burned and value redeemed",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/nfts'] });
      setShowBurnDialog(false);
      setSelectedNFT(null);
    },
    onError: (error) => {
      toast({
        title: "Burn Failed",
        description: error instanceof Error ? error.message : "Failed to burn NFT",
        variant: "destructive",
      });
    }
  });

  const handleBuyToken = (token: Token) => {
    toast({
      title: "Purchase Initiated",
      description: `Purchasing ${token.message} token for ${token.valuePerToken} SOL`,
    });
  };

  const filteredTokens = tokens.filter((token) => {
    if (searchQuery && !token.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (priceFilter !== "all") {
      const price = parseFloat(token.valuePerToken || "0");
      switch (priceFilter) {
        case "free": return price === 0;
        case "low": return price > 0 && price <= 0.1;
        case "medium": return price > 0.1 && price <= 1;
        case "high": return price > 1;
        default: return true;
      }
    }
    
    return true;
  });

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'uncommon': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const getRarityIcon = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return <Crown className="w-4 h-4" />;
      case 'epic': return <Gem className="w-4 h-4" />;
      case 'rare': return <Star className="w-4 h-4" />;
      case 'uncommon': return <Zap className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  // Advanced filtering logic
  const filteredNFTs = useMemo(() => {
    let filtered = nftData?.listings || [];
    
    if (searchQuery) {
      filtered = filtered.filter((nft: NFTListing) => 
        nft.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.collectionName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter((nft: NFTListing) => nft.rarity === categoryFilter);
    }
    
    filtered = filtered.filter((nft: NFTListing) => 
      nft.price >= priceRange[0] && nft.price <= priceRange[1]
    );
    
    // Advanced sorting
    switch (sortBy) {
      case "trending":
        filtered.sort((a: NFTListing, b: NFTListing) => (b.price * 100) - (a.price * 100));
        break;
      case "price_low":
        filtered.sort((a: NFTListing, b: NFTListing) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a: NFTListing, b: NFTListing) => b.price - a.price);
        break;
      case "rarity":
        const rarityOrder = { legendary: 4, epic: 3, rare: 2, uncommon: 1, common: 0 };
        filtered.sort((a: NFTListing, b: NFTListing) => 
          (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - 
          (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0)
        );
        break;
    }
    
    return filtered;
  }, [nftData, searchQuery, categoryFilter, priceRange, sortBy]);

  return (
    <div className="min-h-screen text-white pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Revolutionary Header with Live Stats */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-gradient relative">
            <Sparkles className="inline-block w-8 h-8 text-primary mr-3" />
            QUANTUM MARKETPLACE
            <Lightning className="inline-block w-8 h-8 text-secondary ml-3" />
          </h1>
          <p className="text-xl text-gray-300 mb-6">Revolutionary AI-powered trading platform with burn-to-redeem mechanics</p>
          
          {/* Live Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="glassmorphism electric-frame">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">$127.4K</div>
                <div className="text-sm text-gray-400">24h Volume</div>
              </CardContent>
            </Card>
            <Card className="glassmorphism electric-frame">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary">1,247</div>
                <div className="text-sm text-gray-400">Active Traders</div>
              </CardContent>
            </Card>
            <Card className="glassmorphism electric-frame">
              <CardContent className="p-4 text-center">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">89</div>
                <div className="text-sm text-gray-400">NFTs Burned</div>
              </CardContent>
            </Card>
            <Card className="glassmorphism electric-frame">
              <CardContent className="p-4 text-center">
                <Globe className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyan-400">+347%</div>
                <div className="text-sm text-gray-400">Growth Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Advanced Navigation Tabs */}
        <Tabs defaultValue="marketplace" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8 glassmorphism electric-frame">
            <TabsTrigger value="marketplace" className="flex items-center gap-2 data-[state=active]:bg-primary/20 text-white">
              <ShoppingCart className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2 data-[state=active]:bg-secondary/20 text-white">
              <TrendingUp className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="ai-picks" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 text-white">
              <Brain className="w-4 h-4" />
              AI Picks
            </TabsTrigger>
            <TabsTrigger value="auctions" className="flex items-center gap-2 data-[state=active]:bg-orange-500/20 text-white">
              <Timer className="w-4 h-4" />
              Live Auctions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            {/* Advanced Search and Filters */}
            <Card className="glassmorphism electric-frame">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by message, collection, or creator..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 glassmorphism border-primary/30 text-white"
                      />
                    </div>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full lg:w-48 glassmorphism border-primary/30 text-white">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trending">🔥 Trending</SelectItem>
                        <SelectItem value="price_low">💰 Price: Low to High</SelectItem>
                        <SelectItem value="price_high">💎 Price: High to Low</SelectItem>
                        <SelectItem value="rarity">⭐ Rarity</SelectItem>
                        <SelectItem value="newest">🆕 Newest</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full lg:w-48 glassmorphism border-primary/30 text-white">
                        <SelectValue placeholder="Rarity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Rarities</SelectItem>
                        <SelectItem value="legendary">👑 Legendary</SelectItem>
                        <SelectItem value="epic">💜 Epic</SelectItem>
                        <SelectItem value="rare">💙 Rare</SelectItem>
                        <SelectItem value="uncommon">💚 Uncommon</SelectItem>
                        <SelectItem value="common">⚪ Common</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className="glassmorphism border-primary/30 text-white"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </div>

                  {showAdvancedFilters && (
                    <div className="space-y-4 p-4 glassmorphism rounded-lg border border-primary/20">
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">
                          Price Range: {priceRange[0]} - {priceRange[1]} SOL
                        </label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={100}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button size="sm" variant="outline" className="glassmorphism">
                          <ImageIcon className="w-3 h-3 mr-1" />
                          Has Image
                        </Button>
                        <Button size="sm" variant="outline" className="glassmorphism">
                          <Volume2 className="w-3 h-3 mr-1" />
                          Has Voice
                        </Button>
                        <Button size="sm" variant="outline" className="glassmorphism">
                          <Flame className="w-3 h-3 mr-1" />
                          Burn to Redeem
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Revolutionary NFT Grid with AI-Enhanced Preview */}
            {isLoadingNFTs ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="glassmorphism electric-frame animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-48 bg-primary/10 rounded-lg mb-4"></div>
                      <div className="h-4 bg-primary/10 rounded mb-2"></div>
                      <div className="h-3 bg-primary/10 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNFTs.length === 0 ? (
              <Card className="glassmorphism electric-frame">
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold mb-2 text-white">No NFTs Found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your filters or search criteria</p>
                  <Button 
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("all");
                      setPriceRange([0, 100]);
                    }}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNFTs.map((nft: NFTListing) => (
                  <Card 
                    key={nft.id} 
                    className="glassmorphism electric-frame hover:scale-105 transition-all duration-300 cursor-pointer circuit-glow"
                    onClick={() => {
                      setSelectedNFT(nft);
                      setShowNFTPreview(true);
                    }}
                  >
                    <CardContent className="p-4">
                      {/* NFT Preview Image/Content */}
                      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 overflow-hidden group">
                        {nft.imageFile ? (
                          <img 
                            src={nft.imageFile} 
                            alt={nft.message}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center p-4">
                              <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                              <p className="text-sm text-white font-medium line-clamp-3">{nft.message}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Rarity Badge */}
                        <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white`}>
                          {getRarityIcon(nft.rarity)}
                          <span className="ml-1 capitalize">{nft.rarity}</span>
                        </Badge>

                        {/* Media Indicators */}
                        <div className="absolute top-2 left-2 flex gap-1">
                          {nft.imageFile && (
                            <Badge variant="secondary" className="bg-blue-500/80">
                              <ImageIcon className="w-3 h-3" />
                            </Badge>
                          )}
                          {nft.voiceFile && (
                            <Badge variant="secondary" className="bg-green-500/80">
                              <Volume2 className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>

                        {/* Burn to Redeem Indicator */}
                        {nft.burnToRedeem && (
                          <div className="absolute bottom-2 left-2">
                            <Badge className="bg-orange-500/90 text-white">
                              <Flame className="w-3 h-3 mr-1" />
                              Burn to Redeem
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* NFT Details */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-bold text-white text-lg line-clamp-1">{nft.collectionName}</h3>
                          <p className="text-sm text-gray-400">#{nft.tokenNumber}</p>
                        </div>

                        <p className="text-sm text-gray-300 line-clamp-2">{nft.message}</p>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-400">Price</p>
                            <p className="font-bold text-primary text-lg">{nft.price} SOL</p>
                          </div>
                          {nft.burnToRedeem && (
                            <div className="text-right">
                              <p className="text-xs text-gray-400">Redeem Value</p>
                              <p className="font-bold text-secondary text-sm">{nft.originalValue} SOL</p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                          <Button 
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedNFT(nft);
                              setShowBuyDialog(true);
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy
                          </Button>
                          {nft.burnToRedeem && (
                            <Button 
                              variant="outline"
                              className="flex-1 border-orange-500 text-orange-400 hover:bg-orange-500/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNFT(nft);
                                setShowBurnDialog(true);
                              }}
                            >
                              <Flame className="w-4 h-4 mr-2" />
                              Burn
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* AI-Powered Trending Tab */}
          <TabsContent value="trending" className="space-y-6">
            <Card className="glassmorphism electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Market Trends & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">🔥 Hot Collections</h4>
                    {[
                      { name: "Emotional Butterflies", volume: "24.5 SOL", change: "+127%" },
                      { name: "Voice Chronicles", volume: "18.2 SOL", change: "+89%" },
                      { name: "Digital Dreams", volume: "15.7 SOL", change: "+67%" }
                    ].map((collection, i) => (
                      <div key={i} className="flex items-center justify-between p-3 glassmorphism rounded-lg">
                        <div>
                          <p className="font-medium text-white">{collection.name}</p>
                          <p className="text-sm text-gray-400">{collection.volume}</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">
                          {collection.change}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">💎 Top Rarities</h4>
                    {[
                      { rarity: "Legendary", count: 12, avgPrice: "45.8 SOL" },
                      { rarity: "Epic", count: 67, avgPrice: "12.3 SOL" },
                      { rarity: "Rare", count: 234, avgPrice: "3.7 SOL" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 glassmorphism rounded-lg">
                        <div className="flex items-center gap-2">
                          {getRarityIcon(item.rarity.toLowerCase())}
                          <span className="font-medium text-white">{item.rarity}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">{item.count} items</p>
                          <p className="font-medium text-primary">{item.avgPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">⚡ Burn Statistics</h4>
                    <div className="p-4 glassmorphism rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-400 mb-2">89</div>
                        <p className="text-sm text-gray-400">NFTs Burned Today</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Total Value Redeemed</span>
                          <span className="text-sm font-medium text-white">347.2 SOL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Avg Burn Value</span>
                          <span className="text-sm font-medium text-white">3.9 SOL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="ai-picks" className="space-y-6">
            <Card className="glassmorphism electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI-Powered Recommendations
                </CardTitle>
                <p className="text-gray-400">Personalized picks based on your trading behavior and market analysis</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-primary" />
                      High Growth Potential
                    </h4>
                    {[
                      { name: "Quantum Messages #127", prediction: "+245% in 7d", confidence: 87 },
                      { name: "Voice Emotion #089", prediction: "+189% in 7d", confidence: 72 },
                      { name: "Digital Butterfly #456", prediction: "+167% in 7d", confidence: 68 }
                    ].map((pick, i) => (
                      <div key={i} className="p-4 glassmorphism rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{pick.name}</span>
                          <Badge className="bg-green-500/20 text-green-400">
                            {pick.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{pick.prediction}</p>
                        <Progress value={pick.confidence} className="mt-2" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-400" />
                      Perfect for You
                    </h4>
                    {[
                      { name: "Emotional Spectrum #234", match: "98%", reason: "Similar to your recent purchases" },
                      { name: "Voice Memory #567", match: "94%", reason: "Matches your collection style" },
                      { name: "Butterfly Effect #890", match: "91%", reason: "Trending in your network" }
                    ].map((match, i) => (
                      <div key={i} className="p-4 glassmorphism rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{match.name}</span>
                          <Badge className="bg-pink-500/20 text-pink-400">
                            {match.match} match
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{match.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Auctions Tab */}
          <TabsContent value="auctions" className="space-y-6">
            <Card className="glassmorphism electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Timer className="w-5 h-5 text-orange-400" />
                  Live Auctions
                </CardTitle>
                <p className="text-gray-400">Exclusive time-limited NFT auctions with real-time bidding</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { 
                      name: "Legendary Butterfly #001", 
                      currentBid: "127.5 SOL", 
                      timeLeft: "2h 34m", 
                      bidders: 23,
                      image: "/api/placeholder/300/200"
                    },
                    { 
                      name: "Epic Voice Memory #042", 
                      currentBid: "89.2 SOL", 
                      timeLeft: "5h 12m", 
                      bidders: 18,
                      image: "/api/placeholder/300/200"
                    },
                    { 
                      name: "Rare Emotion #177", 
                      currentBid: "34.7 SOL", 
                      timeLeft: "12h 45m", 
                      bidders: 11,
                      image: "/api/placeholder/300/200"
                    }
                  ].map((auction, i) => (
                    <Card key={i} className="glassmorphism electric-frame">
                      <CardContent className="p-4">
                        <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="font-bold text-white mb-2">{auction.name}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Current Bid</span>
                            <span className="font-bold text-primary">{auction.currentBid}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Time Left</span>
                            <span className="font-medium text-orange-400">{auction.timeLeft}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Bidders</span>
                            <span className="text-sm text-white">{auction.bidders}</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
                          <Timer className="w-4 h-4 mr-2" />
                          Place Bid
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* NFT Preview Dialog */}
        <Dialog open={showNFTPreview} onOpenChange={setShowNFTPreview}>
          <DialogContent className="max-w-4xl glassmorphism electric-frame border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                {selectedNFT?.collectionName} #{selectedNFT?.tokenNumber}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  {selectedNFT?.imageFile ? (
                    <img 
                      src={selectedNFT.imageFile} 
                      alt={selectedNFT.message}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                      <p className="text-white font-medium">{selectedNFT?.message}</p>
                    </div>
                  )}
                </div>
                {selectedNFT?.voiceFile && (
                  <div className="flex items-center gap-2 p-3 glassmorphism rounded-lg">
                    <Volume2 className="w-5 h-5 text-green-400" />
                    <span className="text-white">Voice Recording Available</span>
                    <Button size="sm" variant="outline" className="ml-auto">
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{selectedNFT?.message}</h3>
                  <p className="text-gray-400">Owner: {selectedNFT?.owner}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <p className="text-2xl font-bold text-primary">{selectedNFT?.price} SOL</p>
                  </div>
                  {selectedNFT?.burnToRedeem && (
                    <div>
                      <p className="text-sm text-gray-400">Burn Value</p>
                      <p className="text-xl font-bold text-orange-400">{selectedNFT?.originalValue} SOL</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setShowNFTPreview(false);
                      setShowBuyDialog(true);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                  {selectedNFT?.burnToRedeem && (
                    <Button 
                      variant="outline"
                      className="flex-1 border-orange-500 text-orange-400 hover:bg-orange-500/10"
                      onClick={() => {
                        setShowNFTPreview(false);
                        setShowBurnDialog(true);
                      }}
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      Burn for Value
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Buy NFT Dialog */}
        <AlertDialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
          <AlertDialogContent className="glassmorphism electric-frame border-primary/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Purchase NFT #{selectedNFT?.tokenNumber}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Are you sure you want to buy this NFT for {selectedNFT?.price} {selectedNFT?.currency}?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="glassmorphism border-gray-600 text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => selectedNFT && buyNFTMutation.mutate(selectedNFT.id)}
                disabled={buyNFTMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {buyNFTMutation.isPending ? "Processing..." : "Buy NFT"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Burn NFT Dialog */}
        <AlertDialog open={showBurnDialog} onOpenChange={setShowBurnDialog}>
          <AlertDialogContent className="glassmorphism electric-frame border-orange-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Burn NFT #{selectedNFT?.tokenNumber}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                <div className="space-y-2">
                  <p>
                    Burning this NFT will permanently destroy it and redeem {selectedNFT?.originalValue} {selectedNFT?.currency}.
                  </p>
                  <p className="text-orange-400 font-semibold">
                    This action is irreversible and creates permanent scarcity!
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="glassmorphism border-gray-600 text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => selectedNFT && burnNFTMutation.mutate(selectedNFT.id)}
                disabled={burnNFTMutation.isPending}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {burnNFTMutation.isPending ? "Burning..." : "Burn NFT"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}