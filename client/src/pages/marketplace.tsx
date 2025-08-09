import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import TokenCard from "@/components/token-card";
import { Search, Filter, ShoppingCart, Flame, Image as ImageIcon, Volume2, Star, Crown, Gem, Zap, Eye } from "lucide-react";
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
  const [selectedNFT, setSelectedNFT] = useState<NFTListing | null>(null);
  const [showBurnDialog, setShowBurnDialog] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const { toast } = useToast();

  // Fetch FLBY tokens
  const { data: tokens = [], isLoading: isLoadingTokens } = useQuery<Token[]>({
    queryKey: ["/api/tokens", searchQuery],
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
    // TODO: Implement actual token purchase logic
  };

  const filteredTokens = tokens.filter((token) => {
    if (searchQuery && !token.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (priceFilter !== "all") {
      const price = parseFloat(token.valuePerToken || "0");
      switch (priceFilter) {
        case "free":
          if (price !== 0) return false;
          break;
        case "low":
          if (price === 0 || price > 0.1) return false;
          break;
        case "medium":
          if (price <= 0.1 || price > 1) return false;
          break;
        case "high":
          if (price <= 1) return false;
          break;
      }
    }
    
    return true;
  });

  const nftListings = nftData?.nfts || [];

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

  return (
    <div className="min-h-screen text-white pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">
            🚀 UNIFIED MARKETPLACE
          </h1>
          <p className="text-xl text-gray-300">Trade FLBY tokens and revolutionary FlutterArt NFTs with burn-to-redeem mechanics</p>
        </div>
        
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 glassmorphism electric-frame">
            <TabsTrigger value="tokens" className="flex items-center gap-2 data-[state=active]:bg-primary/20 text-white">
              <Zap className="w-4 h-4" />
              FLBY Tokens
            </TabsTrigger>
            <TabsTrigger value="nfts" className="flex items-center gap-2 data-[state=active]:bg-secondary/20 text-white">
              <Gem className="w-4 h-4" />
              FlutterArt NFTs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-8">
            {/* Search and Filters for Tokens */}
            <Card className="glassmorphism electric-frame">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search tokens by message or creator..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glassmorphism border-primary/30 text-white"
                    />
                  </div>
                  
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="w-full md:w-48 glassmorphism border-primary/30 text-white">
                      <SelectValue placeholder="Filter by price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free (0 SOL)</SelectItem>
                      <SelectItem value="low">Low (0-0.1 SOL)</SelectItem>
                      <SelectItem value="medium">Medium (0.1-1 SOL)</SelectItem>
                      <SelectItem value="high">High (1+ SOL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Token Grid */}
            {isLoadingTokens ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-slate-900/50 border-slate-700 animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-slate-800 rounded mb-4"></div>
                      <div className="h-4 bg-slate-800 rounded mb-2"></div>
                      <div className="h-4 bg-slate-800 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTokens.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2 text-white">No tokens found</h3>
                  <p className="text-slate-400 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button onClick={() => {
                    setSearchQuery("");
                    setPriceFilter("all");
                  }} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTokens.map((token) => (
                  <TokenCard 
                    key={token.id} 
                    token={token} 
                    onBuy={() => handleBuyToken(token)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nfts" className="space-y-8">
            {/* Search and Filters for NFTs */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search NFTs by message, collection, or rarity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All NFTs</SelectItem>
                        <SelectItem value="voice">Has Voice</SelectItem>
                        <SelectItem value="image">Has Image</SelectItem> 
                        <SelectItem value="burnable">Burn-to-Redeem</SelectItem>
                        <SelectItem value="legendary">Legendary</SelectItem>
                        <SelectItem value="epic">Epic</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NFT Grid */}
            {isLoadingNFTs ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="bg-slate-900/50 border-slate-700 animate-pulse">
                    <CardContent className="p-6">
                      <div className="aspect-square bg-slate-800 rounded-lg mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-800 rounded"></div>
                        <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : nftListings.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Gem className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No NFTs Available</h3>
                  <p className="text-slate-400">
                    No FlutterArt NFTs are currently listed for sale.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {nftListings.map((nft: NFTListing) => (
                  <Card key={nft.id} className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
                    <CardContent className="p-6">
                      {/* NFT Image/Preview */}
                      <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                        {nft.imageFile ? (
                          <img 
                            src={nft.imageFile} 
                            alt={`NFT #${nft.tokenNumber}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-6xl opacity-20">
                            🦋
                          </div>
                        )}
                        
                        {/* Rarity Badge */}
                        {nft.rarity && (
                          <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white border-0`}>
                            <span className="flex items-center gap-1">
                              {getRarityIcon(nft.rarity)}
                              {nft.rarity}
                            </span>
                          </Badge>
                        )}

                        {/* Media Icons */}
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          {nft.imageFile && (
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              <ImageIcon className="w-3 h-3" />
                            </Badge>
                          )}
                          {nft.voiceFile && (
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                              <Volume2 className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* NFT Details */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-white text-sm mb-1">
                            {nft.collectionName} #{nft.tokenNumber}
                          </h3>
                          <p className="text-slate-400 text-xs line-clamp-2">
                            {nft.message}
                          </p>
                        </div>

                        {/* Price and Actions */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-xs text-slate-400">Price</p>
                              <p className="font-bold text-lg text-white">
                                {nft.price} {nft.currency}
                              </p>
                            </div>
                            {nft.burnToRedeem && (
                              <div className="text-right">
                                <p className="text-xs text-slate-400">Burnable Value</p>
                                <p className="font-semibold text-sm text-orange-400">
                                  {nft.originalValue} {nft.currency}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              onClick={() => {
                                setSelectedNFT(nft);
                                setShowBuyDialog(true);
                              }}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              size="sm"
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Buy
                            </Button>
                            {nft.burnToRedeem && (
                              <Button 
                                onClick={() => {
                                  setSelectedNFT(nft);
                                  setShowBurnDialog(true);
                                }}
                                variant="outline"
                                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                                size="sm"
                              >
                                <Flame className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Buy NFT Dialog */}
        <AlertDialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
          <AlertDialogContent className="bg-slate-900 border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Purchase NFT #{selectedNFT?.tokenNumber}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-300">
                Are you sure you want to buy this NFT for {selectedNFT?.price} {selectedNFT?.currency}?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-700 text-white border-slate-600">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => selectedNFT && buyNFTMutation.mutate(selectedNFT.id)}
                disabled={buyNFTMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {buyNFTMutation.isPending ? "Processing..." : "Buy NFT"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Burn NFT Dialog */}
        <AlertDialog open={showBurnDialog} onOpenChange={setShowBurnDialog}>
          <AlertDialogContent className="bg-slate-900 border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Burn NFT #{selectedNFT?.tokenNumber}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-300">
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
              <AlertDialogCancel className="bg-slate-700 text-white border-slate-600">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => selectedNFT && burnNFTMutation.mutate(selectedNFT.id)}
                disabled={burnNFTMutation.isPending}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {burnNFTMutation.isPending ? "Burning..." : "Burn & Redeem"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}