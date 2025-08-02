import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, Star, Clock, DollarSign, Filter } from "lucide-react";

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

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || message.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="buy">Buy Messages</TabsTrigger>
            <TabsTrigger value="sell">Sell Messages</TabsTrigger>
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