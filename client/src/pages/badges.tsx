import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Award, Share2, Download, Coins } from "lucide-react";
import BadgeDesigner from "@/components/badge-designer";
import { useToast } from "@/hooks/use-toast";

interface UserBadge {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
  pattern: string;
  isNFT: boolean;
  mintAddress?: string;
  shareableUrl?: string;
  createdAt: string;
}

export default function BadgesPage() {
  const [activeTab, setActiveTab] = useState("collection");
  const { toast } = useToast();

  const { data: userBadges = [], isLoading } = useQuery<UserBadge[]>({
    queryKey: ['/api/badges/custom'],
    enabled: activeTab === "collection"
  });

  const handleDownloadBadge = (badge: UserBadge) => {
    // Create a canvas to render the badge
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    // Draw badge (simplified version)
    ctx.fillStyle = badge.backgroundColor;
    ctx.beginPath();
    ctx.arc(150, 150, 140, 0, 2 * Math.PI);
    ctx.fill();

    // Border
    ctx.strokeStyle = badge.borderColor;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(150, 150, 140, 0, 2 * Math.PI);
    ctx.stroke();

    // Text
    ctx.fillStyle = badge.textColor;
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(badge.name, 150, 200);

    // Download
    const link = document.createElement('a');
    link.download = `${badge.name.replace(/\s+/g, '_')}_badge.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShareBadge = async (badge: UserBadge) => {
    if (badge.shareableUrl) {
      try {
        await navigator.clipboard.writeText(badge.shareableUrl);
        toast({
          title: "Copied!",
          description: "Badge share URL copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy URL to clipboard.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-4">
            Badge Studio
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create, customize, and mint your own NFT badges. Express your unique identity with personalized designs.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="collection" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              My Collection
            </TabsTrigger>
            <TabsTrigger value="designer" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collection" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4" />
                      <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2 mx-auto mb-4" />
                      <div className="flex gap-2 justify-center">
                        <div className="h-8 bg-muted rounded w-16" />
                        <div className="h-8 bg-muted rounded w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userBadges.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No badges yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first custom badge to get started!
                  </p>
                  <Button onClick={() => setActiveTab("designer")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Badge
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBadges.map((badge: UserBadge) => (
                  <Card key={badge.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Badge Preview */}
                      <div className="relative mb-4">
                        <div 
                          className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl font-bold"
                          style={{
                            backgroundColor: badge.backgroundColor,
                            color: badge.textColor,
                            border: `4px solid ${badge.borderColor}`
                          }}
                        >
                          {badge.icon === 'star' && '★'}
                          {badge.icon === 'heart' && '♥'}
                          {badge.icon === 'award' && '🏆'}
                          {badge.icon === 'crown' && '♔'}
                          {badge.icon === 'diamond' && '♦'}
                          {badge.icon === 'zap' && '⚡'}
                          {badge.icon === 'flame' && '🔥'}
                          {badge.icon === 'shield' && '🛡'}
                          {badge.icon === 'coins' && '🏅'}
                        </div>
                        
                        {badge.isNFT && (
                          <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                            NFT
                          </Badge>
                        )}
                      </div>

                      {/* Badge Info */}
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {badge.description}
                        </p>
                        {badge.mintAddress && (
                          <p className="text-xs text-muted-foreground mt-2 font-mono">
                            {badge.mintAddress.slice(0, 8)}...{badge.mintAddress.slice(-8)}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadBadge(badge)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        {badge.shareableUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShareBadge(badge)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {!badge.isNFT && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Mint as NFT logic would go here
                              toast({
                                title: "Coming Soon",
                                description: "NFT minting will be available soon!",
                              });
                            }}
                          >
                            <Coins className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="designer">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Create Your Custom Badge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BadgeDesigner />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}