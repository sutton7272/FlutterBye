import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Gem, 
  TrendingUp, 
  Flame, 
  ShoppingCart, 
  Image as ImageIcon,
  ArrowRight,
  Star,
  Crown,
  Zap,
  Eye
} from "lucide-react";

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

export function NFTPortfolioQuickView() {
  const [userId] = useState('demo-user'); // TODO: Get from auth context

  // Fetch user NFT analytics
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/nft-analytics', userId],
    refetchInterval: 60000 // Refresh every minute
  });

  const analyticsData = analytics as NFTAnalytics | undefined;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created': return <Zap className="w-4 h-4 text-blue-400" />;
      case 'bought': return <ShoppingCart className="w-4 h-4 text-green-400" />;
      case 'sold': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'burned': return <Flame className="w-4 h-4 text-red-400" />;
      default: return <Eye className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'created': return 'bg-blue-500/20';
      case 'bought': return 'bg-green-500/20';
      case 'sold': return 'bg-yellow-500/20';
      case 'burned': return 'bg-red-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <Card className="premium-card electric-frame">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Gem className="w-6 h-6 text-purple-400" />
            FlutterArt Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20 bg-slate-700" />
                <Skeleton className="h-8 w-16 bg-slate-600" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 bg-slate-700" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Card className="premium-card electric-frame">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Gem className="w-6 h-6 text-purple-400" />
            FlutterArt Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No NFTs Yet</h3>
          <p className="text-slate-400 mb-6">
            Create your first FlutterArt NFT to start building your collection
          </p>
          <Link href="/message-nfts">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Gem className="w-4 h-4 mr-2" />
              Create FlutterArt NFT
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card electric-frame">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
          <Gem className="w-6 h-6 text-purple-400" />
          FlutterArt Portfolio
        </CardTitle>
        <Link href="/nft-marketplace">
          <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
            View Marketplace
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Owned NFTs */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-lg p-4 border border-blue-700/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-300 text-sm font-medium">Owned NFTs</p>
              <ImageIcon className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analyticsData.ownedNFTs}</p>
          </div>

          {/* Total Value */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-lg p-4 border border-green-700/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-300 text-sm font-medium">Portfolio Value</p>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analyticsData.totalValue} SOL</p>
          </div>

          {/* Burnable Value */}
          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 rounded-lg p-4 border border-orange-700/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-300 text-sm font-medium">Burnable Value</p>
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analyticsData.burnableValue} SOL</p>
          </div>

          {/* Collections */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-lg p-4 border border-purple-700/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-300 text-sm font-medium">Collections</p>
              <Crown className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analyticsData.collections}</p>
          </div>
        </div>

        {/* Recent Activity */}
        {analyticsData.recentActivity && analyticsData.recentActivity.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <Link href="/nft-marketplace?tab=activity">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {analyticsData.recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getActivityBg(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize text-sm">
                        {activity.type} {activity.collectionName}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm">
                      {activity.value} {activity.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link href="/message-nfts" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Gem className="w-4 h-4 mr-2" />
              Create FlutterArt NFT
            </Button>
          </Link>
          <Link href="/nft-marketplace" className="flex-1">
            <Button variant="outline" className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/10">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}