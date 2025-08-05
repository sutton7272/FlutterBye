import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Brain, 
  Wallet, 
  Hash, 
  Activity, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SearchResult {
  id: string;
  type: 'wallet' | 'token' | 'transaction' | 'trend';
  title: string;
  subtitle: string;
  value?: string;
  confidence: number;
  icon: any;
  data: any;
}

interface NaturalLanguageSearchProps {
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
}

export function NaturalLanguageSearch({ 
  placeholder = "Ask me anything... (e.g., 'Show wallets with over $1M in DeFi trades')",
  onResultSelect,
  className = ""
}: NaturalLanguageSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Sample suggestions for demonstration
  const sampleSuggestions = [
    "Show me wallets that traded over $1M in the last week",
    "Find tokens created in the last 24 hours",
    "Wallets with high DeFi activity",
    "Top performing tokens by volume",
    "Suspicious transaction patterns",
    "Whales holding more than 1000 SOL",
    "New token launches with high liquidity",
    "Active trading pairs on Solana",
    "Wallets connected to NFT marketplaces",
    "Tokens with social media buzz"
  ];

  useEffect(() => {
    // Show suggestions when query is focused but empty
    if (query.length === 0) {
      setSuggestions(sampleSuggestions.slice(0, 3));
    } else if (query.length > 2) {
      // Filter suggestions based on query
      const filtered = sampleSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Simulate AI-powered natural language processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock results based on query analysis
      const results = generateSearchResults(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const generateSearchResults = (searchQuery: string): SearchResult[] => {
    const query_lower = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Wallet queries
    if (query_lower.includes('wallet') || query_lower.includes('address')) {
      results.push({
        id: 'wallet-1',
        type: 'wallet',
        title: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        subtitle: 'High-activity DeFi wallet with $2.3M total volume',
        value: '$2.3M',
        confidence: 95,
        icon: Wallet,
        data: { volume: 2300000, transactions: 1247, defi_protocols: 8 }
      });
    }

    // Token queries
    if (query_lower.includes('token') || query_lower.includes('created')) {
      results.push({
        id: 'token-1',
        type: 'token',
        title: 'FlutterToken (FLTR)',
        subtitle: 'New token created 2 hours ago with 150 SOL liquidity',
        value: '150 SOL',
        confidence: 88,
        icon: Hash,
        data: { created: '2 hours ago', liquidity: 150, holders: 45 }
      });
    }

    // Volume/Trading queries
    if (query_lower.includes('$1m') || query_lower.includes('million') || query_lower.includes('volume')) {
      results.push({
        id: 'whale-1',
        type: 'wallet',
        title: 'Whale Wallet Detection',
        subtitle: '12 wallets found with >$1M trading volume',
        value: '12 matches',
        confidence: 92,
        icon: TrendingUp,
        data: { count: 12, totalVolume: 18700000, avgVolume: 1558333 }
      });
    }

    // DeFi queries
    if (query_lower.includes('defi') || query_lower.includes('liquidity')) {
      results.push({
        id: 'defi-1',
        type: 'trend',
        title: 'DeFi Activity Surge',
        subtitle: 'Detected 340% increase in DeFi interactions',
        value: '+340%',
        confidence: 89,
        icon: Activity,
        data: { protocols: ['Raydium', 'Orca', 'Saber'], growth: 3.4 }
      });
    }

    // Time-based queries
    if (query_lower.includes('24 hours') || query_lower.includes('last week')) {
      results.push({
        id: 'recent-1',
        type: 'transaction',
        title: 'Recent High-Value Transactions',
        subtitle: '847 transactions over $10K in the last 24 hours',
        value: '847 txns',
        confidence: 96,
        icon: Clock,
        data: { count: 847, timeframe: '24h', minValue: 10000 }
      });
    }

    // If no specific matches, provide general insights
    if (results.length === 0) {
      results.push({
        id: 'general-1',
        type: 'trend',
        title: 'Market Intelligence',
        subtitle: 'AI-powered analysis of current blockchain trends',
        value: 'Live data',
        confidence: 85,
        icon: Brain,
        data: { insights: ['Volume up 23%', 'New tokens: 45', 'Active wallets: 12.3K'] }
      });
    }

    return results.slice(0, 6); // Limit results
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'wallet': return Wallet;
      case 'token': return Hash;
      case 'transaction': return Activity;
      case 'trend': return TrendingUp;
      default: return Search;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (confidence >= 80) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (confidence >= 70) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performSearch(query)}
            placeholder={placeholder}
            className="pl-12 pr-24 h-14 text-base bg-background/50 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/50 transition-all duration-200"
          />
          <Button
            onClick={() => performSearch(query)}
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 bg-primary hover:bg-primary/90"
          >
            {isSearching ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Search
              </div>
            )}
          </Button>
        </div>

        {/* AI Enhancement Badge */}
        <div className="absolute -top-2 left-4">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 text-xs px-2 py-1">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && searchResults.length === 0 && (
        <Card className="mt-4 bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Try these queries
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs h-8 bg-muted/50 hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all duration-200"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Analysis Results
            </h3>
            <Badge variant="secondary" className="text-xs">
              {searchResults.length} insights found
            </Badge>
          </div>

          <div className="grid gap-4">
            {searchResults.map((result, index) => {
              const IconComponent = result.icon;
              return (
                <Card
                  key={result.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-200 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/30"
                  onClick={() => onResultSelect?.(result)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium text-foreground truncate">
                              {result.title}
                            </h4>
                            <Badge className={`text-xs px-2 py-0.5 ${getConfidenceColor(result.confidence)}`}>
                              {result.confidence}% match
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {result.subtitle}
                          </p>
                          
                          {result.value && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                {result.value}
                              </Badge>
                              <span className="text-xs text-muted-foreground capitalize">
                                {result.type}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isSearching && query && searchResults.length === 0 && query.length > 2 && (
        <Card className="mt-6 bg-background/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Learning from your query...</h3>
            <p className="text-muted-foreground mb-4">
              Our AI is processing your request. Try being more specific or use one of the suggested queries above.
            </p>
            <Button
              variant="outline"
              onClick={() => setQuery("")}
              className="mt-2"
            >
              Clear and try again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}