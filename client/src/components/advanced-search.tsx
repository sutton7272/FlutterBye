import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { 
  Search, 
  Filter, 
  Clock, 
  TrendingUp, 
  Wallet,
  Brain,
  Zap,
  Star,
  Target
} from "lucide-react";

interface SearchResult {
  id: string;
  type: 'token' | 'wallet' | 'transaction' | 'nft';
  title: string;
  description: string;
  value?: string;
  timestamp?: string;
  score?: number;
  tags?: string[];
}

export function AdvancedSearch() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const { useDebounce } = usePerformanceOptimization();

  // Debounced search function
  const debouncedSearch = useDebounce((searchQuery: string) => {
    if (searchQuery.length > 2) {
      performSearch(searchQuery);
    } else {
      setResults([]);
    }
  }, 300);

  // Search API call
  const { data: searchData, isLoading } = useQuery({
    queryKey: ['/api/search', query, activeFilter],
    enabled: query.length > 2,
    staleTime: 30000, // Cache for 30 seconds
  });

  const performSearch = async (searchQuery: string) => {
    // Simulate AI-powered search results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'token',
        title: `FLBY Token - ${searchQuery}`,
        description: 'Revolutionary blockchain messaging token with AI capabilities',
        value: '150.5 SOL',
        score: 95,
        tags: ['blockchain', 'messaging', 'AI'],
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        type: 'wallet',
        title: `Wallet Analysis - ${searchQuery}`,
        description: 'High-value wallet with diverse DeFi positions',
        value: '2,450.3 SOL',
        score: 88,
        tags: ['defi', 'trading', 'high-value'],
        timestamp: '5 minutes ago'
      },
      {
        id: '3',
        type: 'nft',
        title: `NFT Collection - ${searchQuery}`,
        description: 'Trending NFT collection with strong community',
        value: '45.2 SOL',
        score: 76,
        tags: ['nft', 'art', 'trending'],
        timestamp: '1 hour ago'
      }
    ];

    // Filter by type if not 'all'
    const filtered = activeFilter === 'all' 
      ? mockResults 
      : mockResults.filter(result => result.type === activeFilter);

    setResults(filtered);
  };

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'token': return <Zap className="h-4 w-4" />;
      case 'wallet': return <Wallet className="h-4 w-4" />;
      case 'nft': return <Star className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'token': return 'bg-electric-blue';
      case 'wallet': return 'bg-electric-green';
      case 'nft': return 'bg-purple';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="circuit-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-electric-blue" />
            AI-Powered Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens, wallets, NFTs, transactions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 h-12 text-lg"
            />
            {isLoading && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin w-4 h-4 border-2 border-electric-blue border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="token">Tokens</TabsTrigger>
              <TabsTrigger value="wallet">Wallets</TabsTrigger>
              <TabsTrigger value="nft">NFTs</TabsTrigger>
              <TabsTrigger value="transaction">Transactions</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-electric-green" />
            Search Results ({results.length})
          </h3>
          
          {results.map((result) => (
            <Card key={result.id} className="hover:shadow-lg transition-shadow cursor-pointer circuit-glow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full ${getTypeColor(result.type)} flex items-center justify-center`}>
                      {getTypeIcon(result.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{result.title}</h4>
                        {result.score && (
                          <Badge variant="secondary" className="text-xs">
                            {result.score}% match
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {result.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {result.timestamp && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {result.timestamp}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {result.value && (
                    <div className="text-right">
                      <div className="font-semibold text-electric-green">{result.value}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        High Value
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {query.length > 2 && results.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}