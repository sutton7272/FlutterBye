import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { QrCode, Sparkles, Trophy, Clock, Users, Zap, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
// import { WalletConnect } from "@/components/wallet-connect";

interface MessageNFTCollection {
  id: string;
  message: string;
  image?: string;
  creator: string;
  totalSupply: number;
  currentSupply: number;
  valuePerNFT: number;
  currency: string;
  qrCode: string;
  collectionName: string;
  description: string;
  attributes: Record<string, string | number>;
  createdAt: string;
}

interface ClaimPageData {
  collection: MessageNFTCollection;
  availableNFTs: number[];
  claimedNFTs: number[];
  claimUrl: string;
}

export default function NFTClaim() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [claimerAddress, setClaimerAddress] = useState("");
  const [selectedTokenNumber, setSelectedTokenNumber] = useState<number | null>(null);
  const [claimedNFT, setClaimedNFT] = useState<any>(null);

  // Extract collection ID from URL path like /claim/:collectionId or /claim/:collectionId/:tokenNumber
  const pathParts = location.split('/');
  const collectionId = pathParts[2];
  const tokenNumberFromUrl = pathParts[3] ? parseInt(pathParts[3]) : null;

  useEffect(() => {
    if (tokenNumberFromUrl) {
      setSelectedTokenNumber(tokenNumberFromUrl);
    }
  }, [tokenNumberFromUrl]);

  const { data: claimData, isLoading, error } = useQuery<ClaimPageData>({
    queryKey: ["/api/message-nfts/collection", collectionId],
    enabled: !!collectionId,
    refetchInterval: 5000 // Refresh every 5 seconds to show real-time availability
  });

  const claimMutation = useMutation({
    mutationFn: async ({ collectionId, claimerAddress, tokenNumber }: {
      collectionId: string;
      claimerAddress: string;
      tokenNumber?: number;
    }) => {
      return await apiRequest("/api/message-nfts/claim", "POST", {
        collectionId,
        claimerAddress,
        tokenNumber
      });
    },
    onSuccess: (result: any) => {
      setClaimedNFT(result.nft);
      toast({
        title: "NFT Claimed Successfully!",
        description: `You now own Message NFT #${result.nft.tokenNumber}`,
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim Message NFT",
        variant: "destructive"
      });
    }
  });

  const handleClaim = () => {
    if (!claimerAddress.trim()) {
      toast({
        title: "Wallet Address Required",
        description: "Please enter your wallet address to claim the NFT",
        variant: "destructive"
      });
      return;
    }

    if (!collectionId) {
      toast({
        title: "Invalid Collection",
        description: "Collection ID not found in URL",
        variant: "destructive"
      });
      return;
    }

    claimMutation.mutate({
      collectionId,
      claimerAddress,
      tokenNumber: selectedTokenNumber || undefined
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/80 border-blue-500/30">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Loading Collection...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !claimData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/80 border-red-500/30">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Collection Not Found</h2>
            <p className="text-slate-300">The Message NFT collection you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const collection = claimData.collection;
  const availableCount = claimData.availableNFTs.length;
  const claimedCount = claimData.claimedNFTs.length;

  if (claimedNFT) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-green-900/50 to-blue-900/50 border-green-500/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">
                  Congratulations! 🎉
                </CardTitle>
                <CardDescription className="text-green-200 text-lg">
                  You successfully claimed Message NFT #{claimedNFT.tokenNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* NFT Details */}
                <div className="p-6 bg-slate-800/60 rounded-lg">
                  <h3 className="text-white font-bold text-lg mb-2">{collection.collectionName}</h3>
                  <p className="text-slate-300 mb-4">{collection.message}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">#{claimedNFT.tokenNumber}</p>
                      <p className="text-slate-400 text-sm">Token Number</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">{claimedNFT.valueAttached} {claimedNFT.currency}</p>
                      <p className="text-slate-400 text-sm">Value Attached</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary">Edition {claimedNFT.tokenNumber} of {collection.totalSupply}</Badge>
                    <Badge variant="secondary">Owner: {claimedNFT.owner.slice(0, 8)}...</Badge>
                    <Badge variant="secondary">Value: {claimedNFT.valueAttached} {claimedNFT.currency}</Badge>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="text-center space-y-4">
                  <p className="text-slate-300">
                    Your Message NFT has been recorded on the blockchain and is now part of your digital collection.
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={() => window.location.href = '/message-nfts'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create More NFTs
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/portfolio'}
                      className="border-green-500/50 text-green-300 hover:bg-green-500/20"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      View Portfolio
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <QrCode className="h-8 w-8 text-blue-400" />
              Claim Message NFT
              <Sparkles className="h-8 w-8 text-green-400" />
            </h1>
            <p className="text-slate-300 text-lg">
              Claim your limited edition Message NFT from this exclusive collection
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Collection Info */}
            <Card className="bg-slate-800/80 border-blue-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Collection Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Collection Image/QR */}
                <div className="text-center">
                  <div className="inline-block p-4 bg-white rounded-lg mb-4">
                    <img 
                      src={collection.qrCode} 
                      alt="Collection QR Code"
                      className="w-32 h-32 mx-auto"
                    />
                  </div>
                  {collection.image && (
                    <img 
                      src={collection.image} 
                      alt="Collection Image"
                      className="w-full max-w-xs mx-auto rounded-lg mb-4"
                    />
                  )}
                </div>

                {/* Collection Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-2">{collection.collectionName}</h3>
                    <p className="text-slate-300">{collection.description}</p>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Message Content:</h4>
                    <p className="text-slate-200 italic">"{collection.message}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">{availableCount}</p>
                      <p className="text-slate-400 text-sm">Available</p>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-red-400">{claimedCount}</p>
                      <p className="text-slate-400 text-sm">Claimed</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Total Supply: {collection.totalSupply}</Badge>
                    <Badge variant="secondary">Value: {collection.valuePerNFT} {collection.currency}</Badge>
                    <Badge variant="secondary">Creator: {collection.creator}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Claim Interface */}
            <Card className="bg-slate-800/80 border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-400" />
                  Claim Your NFT
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {availableCount > 0 
                    ? `${availableCount} NFTs still available to claim`
                    : "All NFTs have been claimed"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {availableCount > 0 ? (
                  <>
                    {/* Available NFTs */}
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Available Token Numbers:</h4>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                        {claimData.availableNFTs.slice(0, 20).map((tokenNumber) => (
                          <Button
                            key={tokenNumber}
                            variant={selectedTokenNumber === tokenNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTokenNumber(tokenNumber)}
                            className={`w-12 h-12 ${
                              selectedTokenNumber === tokenNumber
                                ? "bg-green-600 text-white"
                                : "border-slate-600 text-slate-300 hover:border-green-500"
                            }`}
                          >
                            #{tokenNumber}
                          </Button>
                        ))}
                        {claimData.availableNFTs.length > 20 && (
                          <div className="flex items-center text-slate-400 text-sm">
                            +{claimData.availableNFTs.length - 20} more...
                          </div>
                        )}
                      </div>
                      {!selectedTokenNumber && (
                        <p className="text-slate-400 text-sm">
                          Select a token number above, or leave unselected to claim the lowest available number
                        </p>
                      )}
                    </div>

                    <Separator className="bg-slate-600" />

                    {/* Wallet Address Input */}
                    <div className="space-y-3">
                      <label className="text-white font-medium">Your Wallet Address:</label>
                      <Input
                        placeholder="Enter your Solana wallet address..."
                        value={claimerAddress}
                        onChange={(e) => setClaimerAddress(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <p className="text-slate-400 text-sm text-center">
                        Enter your Solana wallet address above to claim your Message NFT
                      </p>
                    </div>

                    {/* Claim Summary */}
                    {claimerAddress && (
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Claim Summary:</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-slate-300">
                            Token: #{selectedTokenNumber || "Next Available"}
                          </p>
                          <p className="text-slate-300">
                            Value: {collection.valuePerNFT} {collection.currency}
                          </p>
                          <p className="text-slate-300">
                            Claimer: {claimerAddress.slice(0, 8)}...{claimerAddress.slice(-6)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Claim Button */}
                    <Button 
                      onClick={handleClaim}
                      disabled={!claimerAddress || claimMutation.isPending}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3"
                    >
                      {claimMutation.isPending ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Claiming NFT...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Claim Message NFT
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Collection Sold Out</h3>
                    <p className="text-slate-300 mb-4">
                      All {collection.totalSupply} NFTs from this collection have been claimed.
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/message-nfts'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Your Own Collection
                    </Button>
                  </div>
                )}

                {/* Quick Actions */}
                <Separator className="bg-slate-600" />
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/message-nfts'}
                    className="flex-1 border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Browse Collections
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`https://explorer.solana.com/address/${collection.creator}`, '_blank')}
                    className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Creator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}