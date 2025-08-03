import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Flame, 
  Search, 
  Filter,
  Play,
  Image as ImageIcon,
  Mic,
  TrendingUp,
  Star,
  Volume2,
  Eye,
  Zap,
  Crown,
  Gem
} from "lucide-react";
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

interface NFTAnalytics {
  ownedNFTs: number;
  totalValue: number;
  burnableValue: number;
  collections: number;
  recentActivity: Array<{
    type: 'created' | 'bought' | 'sold' | 'burned';
    nftId: string;
    collectionName: string;
    value: number;
    currency: string;
    timestamp: string;
  }>;
}

export default function NFTMarketplace() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedNFT, setSelectedNFT] = useState<NFTListing | null>(null);
  const [showBurnDialog, setShowBurnDialog] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);

  // Fetch marketplace listings
  const { data: marketplaceData, isLoading: isLoadingListings } = useQuery({
    queryKey: ['/api/marketplace/nfts'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch user NFT analytics
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['/api/nft-analytics', 'demo-user'],
    refetchInterval: 60000 // Refresh every minute
  });

  // Buy NFT mutation
  const buyNFTMutation = useMutation({
    mutationFn: async (nftId: string) => {
      return await apiRequest(`/api/marketplace/buy/${nftId}`, {
        method: 'POST',
        body: JSON.stringify({ buyerId: 'demo-buyer' })
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Purchase Successful! 🎉",
        description: data.message,
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/nfts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/nft-analytics'] });
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
      return await apiRequest(`/api/marketplace/burn/${nftId}`, {
        method: 'POST',
        body: JSON.stringify({ burnerId: 'demo-burner' })
      });
    },
    onSuccess: (data) => {
      toast({
        title: "NFT Burned Successfully! 🔥",
        description: data.message,
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/nfts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/nft-analytics'] });
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

  const listings = marketplaceData?.nfts || [];
  const analytics = analyticsData as NFTAnalytics | undefined;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            FlutterArt NFT Marketplace
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Trade revolutionary multimedia NFTs with burn-to-redeem value mechanics and permanent scarcity creation
          </p>
        </div>

        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Portfolio Analytics
            </TabsTrigger>
            <TabsTrigger value="activity" className="hidden lg:flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Recent Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            {/* Search and Filters */}
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
                        className="pl-10 bg-slate-800 border-slate-600"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-48 bg-slate-800 border-slate-600">
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
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40 bg-slate-800 border-slate-600">
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                        <SelectItem value="rarity">Rarity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NFT Listings Grid */}
            {isLoadingListings ? (
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((nft: NFTListing) => (
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

                        <Separator className="bg-slate-700" />

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

            {!isLoadingListings && listings.length === 0 && (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No NFTs Available</h3>
                  <p className="text-slate-400">
                    No NFTs match your current filters. Try adjusting your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {isLoadingAnalytics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="bg-slate-900/50 border-slate-700 animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-8 bg-slate-800 rounded mb-2"></div>
                      <div className="h-6 bg-slate-800 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : analytics ? (
              <>
                {/* Portfolio Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-300 text-sm font-medium">Owned NFTs</p>
                          <p className="text-2xl font-bold text-white">{analytics.ownedNFTs}</p>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-full">
                          <ImageIcon className="w-6 h-6 text-blue-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-300 text-sm font-medium">Total Value</p>
                          <p className="text-2xl font-bold text-white">{analytics.totalValue} SOL</p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-full">
                          <TrendingUp className="w-6 h-6 text-green-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-700/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-300 text-sm font-medium">Burnable Value</p>
                          <p className="text-2xl font-bold text-white">{analytics.burnableValue} SOL</p>
                        </div>
                        <div className="p-3 bg-orange-500/20 rounded-full">
                          <Flame className="w-6 h-6 text-orange-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-300 text-sm font-medium">Collections</p>
                          <p className="text-2xl font-bold text-white">{analytics.collections}</p>
                        </div>
                        <div className="p-3 bg-purple-500/20 rounded-full">
                          <Gem className="w-6 h-6 text-purple-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {analytics.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              activity.type === 'created' ? 'bg-blue-500/20' :
                              activity.type === 'bought' ? 'bg-green-500/20' :
                              activity.type === 'sold' ? 'bg-yellow-500/20' :
                              'bg-red-500/20'
                            }`}>
                              {activity.type === 'created' && <Zap className="w-4 h-4 text-blue-400" />}
                              {activity.type === 'bought' && <ShoppingCart className="w-4 h-4 text-green-400" />}
                              {activity.type === 'sold' && <TrendingUp className="w-4 h-4 text-yellow-400" />}
                              {activity.type === 'burned' && <Flame className="w-4 h-4 text-red-400" />}
                            </div>
                            <div>
                              <p className="text-white font-medium capitalize">
                                {activity.type} {activity.collectionName}
                              </p>
                              <p className="text-slate-400 text-sm">
                                {new Date(activity.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">
                              {activity.value} {activity.currency}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Analytics Data</h3>
                  <p className="text-slate-400">
                    Start collecting NFTs to see your portfolio analytics.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Market Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-400">Real-time market activity will be displayed here.</p>
              </CardContent>
            </Card>
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