import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TokenCard from "@/components/token-card";
import { Search } from "lucide-react";
import { type Token } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const { toast } = useToast();

  const { data: tokens = [], isLoading } = useQuery<Token[]>({
    queryKey: ["/api/tokens", { search: searchQuery }],
    enabled: true,
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
      const price = parseFloat(token.valuePerToken);
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

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">FLBY-MSG Token Marketplace</h1>
          <p className="text-xl text-muted-foreground">Discover, trade, and collect unique message tokens</p>
        </div>
        
        {/* Search and Filters */}
        <Card className="electric-frame mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tokens by message or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pulse-border"
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Price: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Price: All</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="low">0-0.1 SOL</SelectItem>
                    <SelectItem value="medium">0.1-1 SOL</SelectItem>
                    <SelectItem value="high">1+ SOL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Token Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="glassmorphism animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTokens.length === 0 ? (
          <Card className="glassmorphism">
            <CardContent className="p-12 text-center">
              <h3 className="text-2xl font-semibold mb-4">No tokens found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || priceFilter !== "all" || categoryFilter !== "all" 
                  ? "Try adjusting your search criteria"
                  : "Be the first to mint a token!"
                }
              </p>
              <Button className="bg-gradient-to-r from-primary to-blue-500">
                Create Token
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTokens.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  onBuy={() => handleBuyToken(token)}
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" className="glassmorphism">
                Load More Tokens
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
