import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, Clock, Eye, Filter, Globe } from 'lucide-react';

interface Token {
  id: string;
  message: string;
  symbol: string;
  mintAddress: string;
  hasAttachedValue: boolean;
  attachedValue: string;
  currency: string;
  escrowStatus: string;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalTokens: number;
  totalValueEscrowed: string;
  totalRedemptions: number;
  activeUsers: number;
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [valueFilter, setValueFilter] = useState('all');

  const { data: publicTokens = [], isLoading: tokensLoading } = useQuery({
    queryKey: ['/api/tokens/public'],
  });

  const { data: tokensWithValue = [], isLoading: valueTokensLoading } = useQuery({
    queryKey: ['/api/tokens/with-value'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const filteredPublicTokens = (publicTokens as Token[]).filter((token: Token) => {
    const searchMatch = token.message.toLowerCase().includes(searchQuery.toLowerCase());
    const valueMatch = valueFilter === 'all' || 
      (valueFilter === 'with-value' && token.hasAttachedValue) ||
      (valueFilter === 'no-value' && !token.hasAttachedValue);
    return searchMatch && valueMatch;
  });

  const filteredValueTokens = (tokensWithValue as Token[]).filter((token: Token) => 
    token.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (token: Token) => {
    if (token.hasAttachedValue) {
      switch (token.escrowStatus) {
        case 'escrowed':
          return <Badge variant="default">💰 {token.attachedValue} {token.currency}</Badge>;
        case 'redeemed':
          return <Badge variant="outline">✅ Redeemed</Badge>;
        default:
          return <Badge variant="secondary">💎 Value Attached</Badge>;
      }
    }
    return <Badge variant="outline">💬 Message Only</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-background min-h-screen pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gradient">
            Explore FLBY-MSG Tokens
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover public tokens and their messages from the community
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="electric-frame">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : stats?.totalTokens?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Tokens</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="electric-frame">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : `${parseFloat(stats?.totalValueEscrowed || '0').toFixed(2)}`}
                  </div>
                  <div className="text-sm text-muted-foreground">SOL Escrowed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="electric-frame">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : stats?.totalRedemptions?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Redemptions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="electric-frame">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : stats?.activeUsers?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 electric-frame">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-gradient">
              <Search className="w-4 h-4 mr-2" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pulse-border"
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={valueFilter}
                  onChange={(e) => setValueFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Tokens</option>
                  <option value="with-value">With Value</option>
                  <option value="no-value">Message Only</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Exploration Tabs */}
        <Tabs defaultValue="public" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="public">Public Wall</TabsTrigger>
            <TabsTrigger value="valued">High Value</TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Public Token Wall</CardTitle>
                <CardDescription>
                  Messages shared publicly by the Flutterbye community
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tokensLoading ? (
                  <div className="text-center py-8">Loading public tokens...</div>
                ) : filteredPublicTokens.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No tokens match your search' : 'No public tokens found'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPublicTokens.map((token: Token) => (
                      <Card key={token.id} className="border hover:border-purple-300 transition-colors cursor-pointer group">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-mono group-hover:text-purple-600 transition-colors">
                              {token.message}
                            </CardTitle>
                          </div>
                          {token.imageUrl && (
                            <img 
                              src={token.imageUrl} 
                              alt="Token"
                              className="w-full h-32 rounded-lg object-cover"
                            />
                          )}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {getStatusBadge(token)}
                            <div className="text-xs text-muted-foreground">
                              Created {new Date(token.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="valued" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>High Value Tokens</CardTitle>
                <CardDescription>
                  Tokens with attached SOL or USDC value, sorted by value
                </CardDescription>
              </CardHeader>
              <CardContent>
                {valueTokensLoading ? (
                  <div className="text-center py-8">Loading valued tokens...</div>
                ) : filteredValueTokens.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No valued tokens match your search' : 'No tokens with value found'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredValueTokens
                      .sort((a: Token, b: Token) => parseFloat(b.attachedValue) - parseFloat(a.attachedValue))
                      .map((token: Token) => (
                        <Card key={token.id} className="border hover:border-green-300 transition-colors cursor-pointer group">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-mono group-hover:text-green-600 transition-colors">
                              {token.message}
                            </CardTitle>
                            {token.imageUrl && (
                              <img 
                                src={token.imageUrl} 
                                alt="Token"
                                className="w-full h-24 rounded-lg object-cover"
                              />
                            )}
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2 text-center">
                              <div className="text-lg font-bold text-green-600">
                                {token.attachedValue} {token.currency}
                              </div>
                              <Badge variant={token.escrowStatus === 'escrowed' ? 'default' : 'outline'}>
                                {token.escrowStatus === 'escrowed' ? 'Available' : 'Redeemed'}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {new Date(token.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}