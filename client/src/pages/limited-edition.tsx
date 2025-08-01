import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Plus, Coins, Clock, Users, Trophy } from "lucide-react";

interface LimitedEditionSet {
  id: string;
  name: string;
  description: string;
  baseMessage: string;
  totalEditions: number;
  mintedEditions: number;
  pricePerEdition: string;
  imageUrl?: string;
  category: string;
  editionPrefix: string;
  rarityTier: string;
  saleStartsAt?: string;
  saleEndsAt?: string;
  maxPurchasePerWallet: number;
  isActive: boolean;
  createdAt: string;
}

interface Token {
  id: string;
  message: string;
  editionNumber: number;
  mintAddress: string;
  createdAt: string;
}

export default function LimitedEdition() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState<LimitedEditionSet | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch limited edition sets
  const { data: limitedSets = [], isLoading } = useQuery({
    queryKey: ['/api/limited-edition-sets'],
  });

  // Create new limited edition set
  const createSetMutation = useMutation({
    mutationFn: async (setData: any) => {
      return apiRequest('/api/limited-edition-sets', {
        method: 'POST',
        body: JSON.stringify(setData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/limited-edition-sets'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Limited Edition Set Created",
        description: "Your limited edition set has been created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create limited edition set",
        variant: "destructive",
      });
    },
  });

  // Mint a limited edition token
  const mintTokenMutation = useMutation({
    mutationFn: async ({ setId, walletAddress }: { setId: string; walletAddress: string }) => {
      return apiRequest(`/api/limited-edition-sets/${setId}/mint`, {
        method: 'POST',
        body: JSON.stringify({ walletAddress }),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/limited-edition-sets'] });
      toast({
        title: "Limited Edition Minted!",
        description: `Successfully minted edition #${data.editionNumber}. ${data.remainingEditions} editions remaining.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint limited edition",
        variant: "destructive",
      });
    },
  });

  const handleCreateSet = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const setData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      baseMessage: formData.get('baseMessage') as string,
      totalEditions: parseInt(formData.get('totalEditions') as string),
      pricePerEdition: formData.get('pricePerEdition') as string,
      category: formData.get('category') as string,
      rarityTier: formData.get('rarityTier') as string,
      editionPrefix: formData.get('editionPrefix') as string || '#',
      maxPurchasePerWallet: parseInt(formData.get('maxPurchasePerWallet') as string) || 1,
      creatorId: 'mock-user-id', // This would come from auth
    };

    createSetMutation.mutate(setData);
  };

  const handleMintToken = (setId: string) => {
    // In a real app, this would come from wallet connection
    const mockWallet = '4xY2D8F3nQ9sM1pR6tZ5bV7wX0aH8cJ2kL4mN7oP9qS3uT';
    mintTokenMutation.mutate({ setId, walletAddress: mockWallet });
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500',
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-500';
  };

  const getProgressPercentage = (minted: number, total: number) => {
    return (minted / total) * 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Limited Edition Sets
            </h1>
            <p className="text-gray-400">Create exclusive token collections with predetermined quantities</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Limited Set
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Limited Edition Set</DialogTitle>
                <DialogDescription>
                  Set up a new limited edition token collection with predetermined quantity.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateSet} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Collection Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Epic Flutterbye Collection"
                      className="bg-gray-800 border-gray-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalEditions">Total Editions</Label>
                    <Input
                      id="totalEditions"
                      name="totalEditions"
                      type="number"
                      min="1"
                      max="10000"
                      placeholder="100"
                      className="bg-gray-800 border-gray-600"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="A special collection of limited edition tokens..."
                    className="bg-gray-800 border-gray-600"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseMessage">Base Message</Label>
                    <Input
                      id="baseMessage"
                      name="baseMessage"
                      placeholder="Epic Butterfly"
                      maxLength={20}
                      className="bg-gray-800 border-gray-600"
                      required
                    />
                    <p className="text-xs text-gray-500">Max 20 chars (leaves room for edition #)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editionPrefix">Edition Prefix</Label>
                    <Input
                      id="editionPrefix"
                      name="editionPrefix"
                      placeholder="#"
                      maxLength={3}
                      className="bg-gray-800 border-gray-600"
                      defaultValue="#"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerEdition">Price Per Edition (SOL)</Label>
                    <Input
                      id="pricePerEdition"
                      name="pricePerEdition"
                      placeholder="0.1"
                      step="0.001"
                      className="bg-gray-800 border-gray-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rarityTier">Rarity Tier</Label>
                    <Select name="rarityTier" defaultValue="rare">
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="common">Common</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="epic">Epic</SelectItem>
                        <SelectItem value="legendary">Legendary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPurchasePerWallet">Max Per Wallet</Label>
                    <Input
                      id="maxPurchasePerWallet"
                      name="maxPurchasePerWallet"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="1"
                      className="bg-gray-800 border-gray-600"
                      defaultValue="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue="limited">
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="limited">Limited Edition</SelectItem>
                      <SelectItem value="special">Special Event</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                      <SelectItem value="commemorative">Commemorative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createSetMutation.isPending}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {createSetMutation.isPending ? 'Creating...' : 'Create Set'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Limited Edition Sets Grid */}
        {limitedSets.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700 text-center py-16">
            <CardContent>
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2 text-white">No Limited Edition Sets Yet</h3>
              <p className="text-gray-400 mb-6">Create your first limited edition token collection to get started.</p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Set
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {limitedSets.map((set: LimitedEditionSet) => (
              <Card key={set.id} className="bg-gray-900 border-gray-700 hover:border-purple-500 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-white flex items-center gap-2">
                        {set.name}
                        <Badge className={`${getRarityColor(set.rarityTier)} text-white text-xs`}>
                          {set.rarityTier}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {set.description}
                      </CardDescription>
                    </div>
                    <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Minted Progress</span>
                      <span className="text-white">{set.mintedEditions}/{set.totalEditions}</span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(set.mintedEditions, set.totalEditions)} 
                      className="h-2"
                    />
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Coins className="w-4 h-4" />
                      {set.pricePerEdition} SOL
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      Max {set.maxPurchasePerWallet}/wallet
                    </div>
                  </div>

                  {/* Base Message Preview */}
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Example Token Name:</p>
                    <p className="text-white font-mono">
                      {set.baseMessage} {set.editionPrefix}{set.mintedEditions + 1}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleMintToken(set.id)}
                      disabled={set.mintedEditions >= set.totalEditions || mintTokenMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {set.mintedEditions >= set.totalEditions ? 'Sold Out' : mintTokenMutation.isPending ? 'Minting...' : 'Mint Edition'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}