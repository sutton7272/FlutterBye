import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, TrendingUp, Clock, Star, Target } from 'lucide-react';

interface SearchFilters {
  query: string;
  sortBy: 'relevance' | 'date' | 'value' | 'popularity';
  tokenType: 'all' | 'standard' | 'limitedEdition' | 'sms' | 'ai';
  priceRange: [number, number];
  dateRange: string;
  emotion?: string;
  hasValue: boolean;
  isTimeLocked: boolean;
}

export default function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'relevance',
    tokenType: 'all',
    priceRange: [0, 10],
    dateRange: 'all',
    hasValue: false,
    isTimeLocked: false
  });

  const [searchTriggered, setSearchTriggered] = useState(false);

  // Search results query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/search/tokens', filters],
    enabled: searchTriggered && (filters.query.length > 0 || Object.values(filters).some(v => v !== '' && v !== 'all' && v !== false)),
  });

  // Popular searches query
  const { data: popularSearches } = useQuery({
    queryKey: ['/api/search/popular'],
  });

  // Trending tokens query
  const { data: trendingTokens } = useQuery({
    queryKey: ['/api/search/trending'],
  });

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (searchTriggered) {
      setSearchTriggered(true); // Re-trigger search
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      sortBy: 'relevance',
      tokenType: 'all',
      priceRange: [0, 10],
      dateRange: 'all',
      hasValue: false,
      isTimeLocked: false
    });
    setSearchTriggered(false);
  };

  const getSortIcon = (sortType: string) => {
    switch (sortType) {
      case 'date': return <Clock className="w-4 h-4" />;
      case 'value': return <TrendingUp className="w-4 h-4" />;
      case 'popularity': return <Star className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Advanced Token Search
          </h1>
          <p className="text-gray-400 text-lg">
            Discover and explore tokenized messages with powerful search and filtering
          </p>
        </div>

        {/* Search Interface */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search Tokens</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Search Bar */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search token messages, creators, emotions..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-purple-600 hover:bg-purple-700 px-8"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sort By */}
              <div className="space-y-2">
                <Label className="text-gray-400">Sort By</Label>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="relevance">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Relevance</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="date">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Latest</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="value">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Highest Value</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="popularity">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Most Popular</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Token Type */}
              <div className="space-y-2">
                <Label className="text-gray-400">Token Type</Label>
                <Select 
                  value={filters.tokenType} 
                  onValueChange={(value) => handleFilterChange('tokenType', value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="limitedEdition">Limited Edition</SelectItem>
                    <SelectItem value="sms">SMS Created</SelectItem>
                    <SelectItem value="ai">AI Enhanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label className="text-gray-400">Date Range</Label>
                <Select 
                  value={filters.dateRange} 
                  onValueChange={(value) => handleFilterChange('dateRange', value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-gray-400">
                  Value Range: {filters.priceRange[0]} - {filters.priceRange[1]} SOL
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  max={10}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant={filters.hasValue ? "default" : "outline"}
                onClick={() => handleFilterChange('hasValue', !filters.hasValue)}
                className="text-sm"
              >
                Has Value
              </Button>
              <Button
                variant={filters.isTimeLocked ? "default" : "outline"}
                onClick={() => handleFilterChange('isTimeLocked', !filters.isTimeLocked)}
                className="text-sm"
              >
                Time Locked
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-sm border-gray-600 text-gray-400"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results and Discovery */}
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="results" className="data-[state=active]:bg-purple-600">
              Search Results
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-purple-600">
              Trending
            </TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-purple-600">
              Popular Searches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-gray-900 border-gray-800 animate-pulse">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchResults?.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">
                    Found {searchResults.length} results
                  </p>
                  <div className="flex items-center space-x-2">
                    {getSortIcon(filters.sortBy)}
                    <span className="text-sm text-gray-400 capitalize">
                      Sorted by {filters.sortBy}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((token: any) => (
                    <Card key={token.id} className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-colors cursor-pointer">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-white truncate">
                              "{token.message}"
                            </h3>
                            {token.isLimitedEdition && (
                              <Badge className="bg-yellow-600 text-yellow-100">
                                Limited
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Value:</span>
                              <span className="text-cyan-400 font-semibold">
                                {token.valuePerToken || 0} SOL
                              </span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Supply:</span>
                              <span className="text-white">
                                {token.totalSupply.toLocaleString()}
                              </span>
                            </div>
                            
                            {token.emotionType && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Emotion:</span>
                                <Badge variant="outline" className="text-purple-400 border-purple-400">
                                  {token.emotionType}
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {token.smsOrigin && (
                              <Badge variant="outline" className="text-blue-400 border-blue-400">
                                SMS
                              </Badge>
                            )}
                            {token.isTimeLocked && (
                              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                Time Locked
                              </Badge>
                            )}
                            {token.isBurnToRead && (
                              <Badge variant="outline" className="text-red-400 border-red-400">
                                Burn to Read
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : searchTriggered ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Start Searching</h3>
                  <p className="text-gray-400">
                    Enter search terms or apply filters to discover amazing tokenized messages.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Trending Tokens</span>
                </CardTitle>
                <CardDescription>Most popular tokens in the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Sample trending token #{i + 1}</h4>
                          <p className="text-sm text-gray-400">Popular in the community</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-400 font-semibold">{(Math.random() * 5).toFixed(2)} SOL</p>
                        <p className="text-green-400 text-sm">+{Math.floor(Math.random() * 50)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Popular Search Terms</CardTitle>
                <CardDescription>What other users are searching for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {['love', 'crypto', 'moon', 'diamond hands', 'gm', 'wagmi', 'hodl', 'degen', 'alpha', 'bullish'].map((term, i) => (
                    <Button
                      key={term}
                      variant="outline"
                      onClick={() => handleFilterChange('query', term)}
                      className="border-gray-600 text-gray-300 hover:bg-purple-600/20 hover:border-purple-400"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}