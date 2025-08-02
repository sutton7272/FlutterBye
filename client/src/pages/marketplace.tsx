import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, Star, Clock, DollarSign, Filter, Share2, Crown, Users, Award, Heart, MessageCircle, Copy, ExternalLink, Verified, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  value: number;
  currency: string;
  creator: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  views: number;
  likes: number;
  timeLeft: string;
  category: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Happy Birthday! 🎉",
    value: 0.5,
    currency: "SOL",
    creator: "CelebUser123",
    rarity: 'legendary',
    views: 15420,
    likes: 892,
    timeLeft: "2h 15m",
    category: "Greeting"
  },
  {
    id: "2", 
    content: "Thank you for everything ❤️",
    value: 25,
    currency: "FLBY",
    creator: "GratefulSender",
    rarity: 'epic',
    views: 8930,
    likes: 456,
    timeLeft: "5h 30m",
    category: "Appreciation"
  },
  {
    id: "3",
    content: "Good luck on your exam! 📚",
    value: 0.1,
    currency: "SOL",
    creator: "StudyBuddy",
    rarity: 'rare',
    views: 3210,
    likes: 189,
    timeLeft: "1d 2h",
    category: "Support"
  }
];

const rarityColors = {
  common: "bg-gray-500",
  rare: "bg-blue-500", 
  epic: "bg-purple-500",
  legendary: "bg-yellow-500"
};

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [customMessage, setCustomMessage] = useState("");
  const { toast } = useToast();

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || message.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (platform: string) => {
    const message = customMessage || "Check out this amazing tokenized message on Flutterbye!";
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.origin)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(message)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(message)}`,
      discord: `Share in Discord: ${message}`
    };

    if (platform === 'discord') {
      navigator.clipboard.writeText(`Share in Discord: ${message}`);
      toast({
        title: "Copied to Clipboard!",
        description: "Discord share link copied. Paste it in your Discord server!",
      });
    } else if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
      toast({
        title: "Sharing to " + platform.charAt(0).toUpperCase() + platform.slice(1),
        description: "You'll earn FLBY rewards for viral shares!",
      });
    }
  };

  // Mock celebrity data
  const mockCelebrities = [
    {
      id: "1",
      name: "Alex Rodriguez",
      username: "alexcrypto",
      avatar: "🌟",
      verified: true,
      followers: 2500000,
      category: "Crypto Influencer",
      bio: "Blockchain educator & DeFi expert",
      recentMessage: "GM Web3 builders! 🚀",
      messagePrice: 0.5
    },
    {
      id: "2",
      name: "Sarah Chen",
      username: "sarahnft",
      avatar: "🎨",
      verified: true,
      followers: 890000,
      category: "NFT Artist",
      bio: "Digital artist creating the future",
      recentMessage: "New drop coming soon! ✨",
      messagePrice: 0.3
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Message Marketplace
          </h1>
          <p className="text-gray-300">Buy, sell, and trade tokenized messages. Discover rare and valuable communications.</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages or creators..."
              className="pl-10 bg-gray-800/50 border-gray-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="greeting">Greeting</option>
            <option value="appreciation">Appreciation</option>
            <option value="support">Support</option>
            <option value="celebration">Celebration</option>
          </select>

          <select 
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="trending">Trending</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="rarity">Rarity</option>
            <option value="time-left">Time Left</option>
          </select>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Volume</p>
                  <p className="text-2xl font-bold text-electric-blue">1,247 SOL</p>
                </div>
                <TrendingUp className="h-8 w-8 text-electric-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Listings</p>
                  <p className="text-2xl font-bold text-electric-green">892</p>
                </div>
                <DollarSign className="h-8 w-8 text-electric-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg. Price</p>
                  <p className="text-2xl font-bold text-yellow-400">0.3 SOL</p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Sales</p>
                  <p className="text-2xl font-bold text-purple-400">156</p>
                </div>
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marketplace Tabs */}
        <Tabs defaultValue="buy" className="mb-8">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
            <TabsTrigger value="buy">Buy Messages</TabsTrigger>
            <TabsTrigger value="sell">Sell Messages</TabsTrigger>
            <TabsTrigger value="viral-sharing" className="text-electric-blue">
              <Share2 className="h-4 w-4 mr-1" />
              Viral Sharing
            </TabsTrigger>
            <TabsTrigger value="celebrities" className="text-electric-green">
              <Crown className="h-4 w-4 mr-1" />
              Celebrities
            </TabsTrigger>
            <TabsTrigger value="my-collection">My Collection</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-6">
            {/* Message Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMessages.map((message) => (
                <Card key={message.id} className="bg-gray-800/50 border-gray-700 hover:border-electric-blue/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={`${rarityColors[message.rarity]} text-white`}>
                        {message.rarity.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        {message.timeLeft}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-2">{message.content}</p>
                      <p className="text-sm text-gray-400">by @{message.creator}</p>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{message.views.toLocaleString()} views</span>
                      <span className="text-gray-400">{message.likes} likes</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-electric-blue">
                          {message.value} {message.currency}
                        </p>
                        <p className="text-sm text-gray-400">Current Price</p>
                      </div>
                      <Button className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90">
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-electric-blue">List Your Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">Select a message from your collection to list on the marketplace:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-700/50 border-gray-600 p-4">
                    <p className="font-semibold mb-2">"Good morning sunshine! ☀️"</p>
                    <p className="text-sm text-gray-400 mb-3">Created 2 days ago</p>
                    <Button className="w-full bg-electric-blue hover:bg-electric-blue/80">
                      List for Sale
                    </Button>
                  </Card>
                  <Card className="bg-gray-700/50 border-gray-600 p-4">
                    <p className="font-semibold mb-2">"Congratulations! 🎊"</p>
                    <p className="text-sm text-gray-400 mb-3">Created 1 week ago</p>
                    <Button className="w-full bg-electric-blue hover:bg-electric-blue/80">
                      List for Sale
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="viral-sharing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Share New Message */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-electric-blue flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Share & Earn FLBY
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Create Viral Message</label>
                    <Input
                      placeholder="Write your viral message here..."
                      className="bg-gray-700/50 border-gray-600 text-white"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-400 mt-1">{customMessage.length}/100 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Share to Platforms</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={() => handleShare('twitter')} className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Twitter/X
                      </Button>
                      <Button onClick={() => handleShare('discord')} className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        Discord
                      </Button>
                      <Button onClick={() => handleShare('telegram')} className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Telegram
                      </Button>
                      <Button onClick={() => handleShare('reddit')} className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Reddit
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-electric-blue/20 to-electric-green/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-electric-blue">Viral Rewards</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• 1 FLBY per 100 views from your shares</li>
                      <li>• 5 FLBY per 100 likes/reactions</li>
                      <li>• 10 FLBY per 100 comments/replies</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Viral Leaderboard */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-electric-green flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trending Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-yellow-500 text-black">#1 Trending</Badge>
                      <span className="text-sm text-gray-400">2h ago</span>
                    </div>
                    <p className="font-semibold mb-1">Just minted my first FLBY message! 🚀</p>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Share2 className="h-4 w-4 text-blue-400" />
                          1,240
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-400" />
                          3,890
                        </span>
                      </div>
                      <span className="text-electric-green font-semibold">+45.5 FLBY</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="celebrities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockCelebrities.map((celebrity) => (
                <Card key={celebrity.id} className="bg-gray-800/50 border-gray-700 hover:border-electric-blue/50 transition-colors">
                  <CardHeader className="pb-3">
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
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <Badge className="bg-purple-600 text-white">
                      {celebrity.category}
                    </Badge>
                    
                    <p className="text-sm text-gray-300">{celebrity.bio}</p>
                    
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-400">Followers</p>
                        <p className="font-semibold">{(celebrity.followers / 1000000).toFixed(1)}M</p>
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
                      <Button className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90">
                        <Gift className="h-4 w-4 mr-2" />
                        Request Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 border-purple-700">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Join as Celebrity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Are you an influencer? Apply to join our celebrity program!</p>
                <Button className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-collection" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-electric-blue mb-2">12</div>
                  <p className="text-gray-400">Messages Owned</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-electric-green mb-2">2.4 SOL</div>
                  <p className="text-gray-400">Total Value</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">3</div>
                  <p className="text-gray-400">Rare Messages</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}