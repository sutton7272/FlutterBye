import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Verified, Crown, Trophy, Users, TrendingUp, MessageSquare, Gift } from "lucide-react";

interface Celebrity {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  tier: 'platinum' | 'gold' | 'silver';
  followers: number;
  messagesCreated: number;
  totalValue: number;
  category: string;
  bio: string;
  recentMessage: string;
  messagePrice: number;
}

const mockCelebrities: Celebrity[] = [
  {
    id: "1",
    name: "Alex Rodriguez",
    username: "alexcrypto",
    avatar: "🌟",
    verified: true,
    tier: 'platinum',
    followers: 2500000,
    messagesCreated: 147,
    totalValue: 1250.5,
    category: "Crypto Influencer",
    bio: "Blockchain educator & DeFi expert. Helping millions understand Web3.",
    recentMessage: "GM Web3 builders! 🚀",
    messagePrice: 0.5
  },
  {
    id: "2",
    name: "Sarah Chen",
    username: "sarahnft",
    avatar: "🎨",
    verified: true,
    tier: 'gold',
    followers: 890000,
    messagesCreated: 89,
    totalValue: 678.2,
    category: "NFT Artist",
    bio: "Digital artist creating the future of collectible art.",
    recentMessage: "New drop coming soon! ✨",
    messagePrice: 0.3
  },
  {
    id: "3",
    name: "Marcus Johnson",
    username: "marcusdefi",
    avatar: "💎",
    verified: true,
    tier: 'silver',
    followers: 345000,
    messagesCreated: 56,
    totalValue: 234.8,
    category: "DeFi Analyst",
    bio: "Yield farming strategies & protocol analysis.",
    recentMessage: "Alpha leak in DMs 👀",
    messagePrice: 0.2
  }
];

const tierColors = {
  platinum: "from-purple-400 to-pink-400",
  gold: "from-yellow-400 to-orange-400", 
  silver: "from-gray-300 to-gray-500"
};

const tierIcons = {
  platinum: Crown,
  gold: Trophy,
  silver: Star
};

export default function CelebrityHub() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCelebrities = mockCelebrities.filter(celebrity => {
    const matchesSearch = celebrity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         celebrity.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || celebrity.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const requestMessage = (celebrity: Celebrity) => {
    console.log(`Requesting message from ${celebrity.name}`);
    // This would open a message request modal in production
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Celebrity Hub
          </h1>
          <p className="text-gray-300">Connect with verified celebrities and influencers. Get exclusive tokenized messages.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Verified Celebrities</p>
                  <p className="text-2xl font-bold text-electric-blue">247</p>
                </div>
                <Verified className="h-8 w-8 text-electric-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Followers</p>
                  <p className="text-2xl font-bold text-electric-green">47.2M</p>
                </div>
                <Users className="h-8 w-8 text-electric-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Messages Created</p>
                  <p className="text-2xl font-bold text-yellow-400">8,921</p>
                </div>
                <MessageSquare className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold text-purple-400">2,847 SOL</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Input
            placeholder="Search celebrities..."
            className="flex-1 min-w-64 bg-gray-800/50 border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="crypto">Crypto Influencers</option>
            <option value="nft">NFT Artists</option>
            <option value="defi">DeFi Experts</option>
            <option value="gaming">Gaming</option>
            <option value="music">Musicians</option>
          </select>
        </div>

        <Tabs defaultValue="featured" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="premium">Premium Tier</TabsTrigger>
            <TabsTrigger value="applications">Apply to Join</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="space-y-6">
            {/* Celebrity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCelebrities.map((celebrity) => {
                const TierIcon = tierIcons[celebrity.tier];
                return (
                  <Card key={celebrity.id} className="bg-gray-800/50 border-gray-700 hover:border-electric-blue/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{celebrity.avatar}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{celebrity.name}</h3>
                              {celebrity.verified && (
                                <Verified className="h-4 w-4 text-blue-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-400">@{celebrity.username}</p>
                          </div>
                        </div>
                        <div className={`p-2 rounded-full bg-gradient-to-r ${tierColors[celebrity.tier]}`}>
                          <TierIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <Badge className="bg-purple-600 text-white">
                        {celebrity.category}
                      </Badge>
                      
                      <p className="text-sm text-gray-300">{celebrity.bio}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Followers</p>
                          <p className="font-semibold">{(celebrity.followers / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Messages</p>
                          <p className="font-semibold">{celebrity.messagesCreated}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Recent Message:</p>
                        <p className="font-medium text-electric-blue">{celebrity.recentMessage}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-electric-green">
                            {celebrity.messagePrice} SOL
                          </p>
                          <p className="text-sm text-gray-400">Per Message</p>
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
                          onClick={() => requestMessage(celebrity)}
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Request Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-electric-blue">Trending This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Most active celebrities based on message volume and engagement:</p>
                <div className="space-y-4">
                  {filteredCelebrities.slice(0, 3).map((celebrity, index) => (
                    <div key={celebrity.id} className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-yellow-500 text-black">#{index + 1}</Badge>
                        <div className="text-2xl">{celebrity.avatar}</div>
                        <div>
                          <p className="font-semibold">{celebrity.name}</p>
                          <p className="text-sm text-gray-400">{celebrity.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-electric-green">+{Math.floor(Math.random() * 50 + 10)}%</p>
                        <p className="text-sm text-gray-400">Activity</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="premium" className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 border-purple-700">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Premium Celebrity Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6">Exclusive access to top-tier celebrities with premium messaging features:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                    <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-2">Platinum Access</h4>
                    <p className="text-sm text-gray-300">Direct access to A-list celebrities</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                    <Gift className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-2">Exclusive Messages</h4>
                    <p className="text-sm text-gray-300">Special messages only for premium users</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                    <Star className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-2">Early Access</h4>
                    <p className="text-sm text-gray-300">First access to new celebrity joins</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90">
                  Upgrade to Premium - 100 FLBY/month
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-electric-green">Join as a Celebrity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300">Are you an influencer, content creator, or public figure? Apply to join our celebrity program!</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-electric-blue">Requirements:</h4>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li>• 10K+ followers on major platforms</li>
                      <li>• Verified social media accounts</li>
                      <li>• Active engagement with community</li>
                      <li>• Alignment with Web3 values</li>
                      <li>• Professional content quality</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-electric-green">Benefits:</h4>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li>• Earn from every message created</li>
                      <li>• Verified celebrity badge</li>
                      <li>• Premium profile features</li>
                      <li>• Marketing support</li>
                      <li>• Direct fan engagement</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Input placeholder="Full Name" className="bg-gray-700/50 border-gray-600 text-white" />
                  <Input placeholder="Social Media Handle" className="bg-gray-700/50 border-gray-600 text-white" />
                  <Input placeholder="Follower Count" className="bg-gray-700/50 border-gray-600 text-white" />
                  <textarea 
                    placeholder="Tell us about yourself and why you'd be a great addition..."
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white resize-none"
                    rows={4}
                  />
                </div>
                
                <Button className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90">
                  Submit Application
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}