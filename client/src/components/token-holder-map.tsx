import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MapPin, Users, Wallet, TrendingUp, Filter, Zap, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TokenHolderLocation {
  id: string;
  address: string;
  balance: number;
  percentage: number;
  country: string;
  city: string;
  lat: number;
  lng: number;
  region: string;
  holderType: 'whale' | 'dolphin' | 'fish' | 'shrimp';
  joinDate: string;
  lastActivity: string;
}

interface MapFilters {
  minBalance: number;
  maxBalance: number;
  countries: string[];
  holderTypes: string[];
  showClusters: boolean;
  timeRange: string;
}

export default function TokenHolderMap() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [holders, setHolders] = useState<TokenHolderLocation[]>([]);
  const [selectedHolder, setSelectedHolder] = useState<TokenHolderLocation | null>(null);
  const [filters, setFilters] = useState<MapFilters>({
    minBalance: 0,
    maxBalance: 100000000,
    countries: [],
    holderTypes: [],
    showClusters: true,
    timeRange: 'all'
  });
  const [mapView, setMapView] = useState<'global' | 'regional' | 'country'>('global');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock world map visualization data
  const mockMapData = useMemo(() => {
    const countries = [
      { name: 'United States', code: 'US', lat: 39.8283, lng: -98.5795, holders: [] as TokenHolderLocation[] },
      { name: 'United Kingdom', code: 'GB', lat: 55.3781, lng: -3.4360, holders: [] as TokenHolderLocation[] },
      { name: 'Germany', code: 'DE', lat: 51.1657, lng: 10.4515, holders: [] as TokenHolderLocation[] },
      { name: 'Japan', code: 'JP', lat: 36.2048, lng: 138.2529, holders: [] as TokenHolderLocation[] },
      { name: 'Singapore', code: 'SG', lat: 1.3521, lng: 103.8198, holders: [] as TokenHolderLocation[] },
      { name: 'Canada', code: 'CA', lat: 56.1304, lng: -106.3468, holders: [] as TokenHolderLocation[] },
      { name: 'Australia', code: 'AU', lat: -25.2744, lng: 133.7751, holders: [] as TokenHolderLocation[] },
      { name: 'Switzerland', code: 'CH', lat: 46.8182, lng: 8.2275, holders: [] as TokenHolderLocation[] },
      { name: 'Netherlands', code: 'NL', lat: 52.1326, lng: 5.2913, holders: [] as TokenHolderLocation[] },
      { name: 'South Korea', code: 'KR', lat: 35.9078, lng: 127.7669, holders: [] as TokenHolderLocation[] }
    ];

    return countries.map(country => ({
      ...country,
      holderCount: Math.floor(Math.random() * 500) + 50,
      totalValue: Math.floor(Math.random() * 10000000) + 1000000,
      averageBalance: Math.floor(Math.random() * 50000) + 10000
    }));
  }, []);

  const loadTokenHolders = useMutation({
    mutationFn: async (token: string) => {
      const response = await apiRequest("POST", "/api/tokens/analyze-holders-map", { token, limit: 1000 });
      const data = response.json ? await response.json() : response;
      return Array.isArray(data) ? data : [];
    },
    onSuccess: (data: TokenHolderLocation[]) => {
      setHolders(data);
      toast({
        title: "Map Data Loaded",
        description: `Visualizing ${data.length} token holders globally`,
      });
    },
    onError: () => {
      // Generate mock data for visualization
      generateMockHolders();
    }
  });

  const generateMockHolders = () => {
    const cities = [
      { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060, region: 'North America' },
      { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, region: 'Europe' },
      { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, region: 'Asia' },
      { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, region: 'Asia' },
      { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, region: 'Oceania' },
      { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, region: 'Europe' },
      { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, region: 'North America' },
      { name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417, region: 'Europe' },
      { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, region: 'Europe' },
      { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, region: 'Asia' }
    ];

    const mockHolders: TokenHolderLocation[] = Array.from({ length: 250 }, (_, i) => {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const balance = Math.floor(Math.random() * 10000000) + 1000;
      
      let holderType: 'whale' | 'dolphin' | 'fish' | 'shrimp';
      if (balance > 5000000) holderType = 'whale';
      else if (balance > 1000000) holderType = 'dolphin';
      else if (balance > 100000) holderType = 'fish';
      else holderType = 'shrimp';

      return {
        id: `holder_${i}`,
        address: `${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 7)}`,
        balance,
        percentage: (balance / 50000000) * 100,
        country: city.country,
        city: city.name,
        lat: city.lat + (Math.random() - 0.5) * 0.1,
        lng: city.lng + (Math.random() - 0.5) * 0.1,
        region: city.region,
        holderType,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    });

    setHolders(mockHolders);
    toast({
      title: "Demo Data Loaded",
      description: `Visualizing ${mockHolders.length} token holders globally`,
    });
  };

  const filteredHolders = useMemo(() => {
    return holders.filter(holder => {
      if (holder.balance < filters.minBalance || holder.balance > filters.maxBalance) return false;
      if (filters.countries.length > 0 && !filters.countries.includes(holder.country)) return false;
      if (filters.holderTypes.length > 0 && !filters.holderTypes.includes(holder.holderType)) return false;
      return true;
    });
  }, [holders, filters]);

  const countryStats = useMemo(() => {
    const stats = new Map<string, { count: number; totalValue: number; averageBalance: number }>();
    
    filteredHolders.forEach(holder => {
      const existing = stats.get(holder.country) || { count: 0, totalValue: 0, averageBalance: 0 };
      existing.count += 1;
      existing.totalValue += holder.balance;
      existing.averageBalance = existing.totalValue / existing.count;
      stats.set(holder.country, existing);
    });

    return Array.from(stats.entries()).map(([country, data]) => ({
      country,
      ...data
    })).sort((a, b) => b.totalValue - a.totalValue);
  }, [filteredHolders]);

  const handleAnalyzeToken = () => {
    if (!tokenAddress.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter a token address to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    loadTokenHolders.mutate(tokenAddress);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const getHolderTypeColor = (type: string) => {
    switch (type) {
      case 'whale': return 'bg-purple-500';
      case 'dolphin': return 'bg-blue-500';
      case 'fish': return 'bg-green-500';
      case 'shrimp': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getHolderTypeSize = (type: string) => {
    switch (type) {
      case 'whale': return 'w-6 h-6';
      case 'dolphin': return 'w-5 h-5';
      case 'fish': return 'w-4 h-4';
      case 'shrimp': return 'w-3 h-3';
      default: return 'w-3 h-3';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
          <Globe className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gradient">Token Holder Map</h2>
          <p className="text-muted-foreground">Interactive global visualization of token distribution</p>
        </div>
      </div>

      {/* Token Input */}
      <Card className="electric-frame">
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="token">Token Address or Symbol</Label>
              <Input
                id="token"
                placeholder="Enter token address (e.g., EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>
            <Button 
              onClick={handleAnalyzeToken}
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Analyze Map
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {holders.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Map Visualization */}
          <Card className="lg:col-span-2 electric-frame">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Global Distribution
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={mapView === 'global' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMapView('global')}
                  >
                    Global
                  </Button>
                  <Button
                    variant={mapView === 'regional' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMapView('regional')}
                  >
                    Regional
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mock World Map Visualization */}
              <div className="relative bg-slate-900/50 rounded-lg p-6 h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
                
                {/* World Map Grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                    {Array.from({ length: 96 }).map((_, i) => (
                      <div key={i} className="border border-slate-700/30" />
                    ))}
                  </div>
                </div>

                {/* Holder Distribution Points */}
                <div className="relative h-full">
                  {filteredHolders.slice(0, 50).map((holder, index) => (
                    <div
                      key={holder.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full ${getHolderTypeColor(holder.holderType)} ${getHolderTypeSize(holder.holderType)} cursor-pointer hover:scale-150 transition-all duration-200 animate-pulse`}
                      style={{
                        left: `${((holder.lng + 180) / 360) * 100}%`,
                        top: `${((90 - holder.lat) / 180) * 100}%`,
                        animationDelay: `${index * 50}ms`
                      }}
                      onClick={() => setSelectedHolder(holder)}
                      title={`${holder.city}, ${holder.country} - ${holder.balance.toLocaleString()} tokens`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-black/80 rounded-lg p-3 space-y-2">
                  <div className="text-xs font-semibold text-white">Holder Types</div>
                  {['whale', 'dolphin', 'fish', 'shrimp'].map(type => (
                    <div key={type} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getHolderTypeColor(type)}`} />
                      <span className="text-xs text-gray-300 capitalize">{type}</span>
                    </div>
                  ))}
                </div>

                {/* Stats Overlay */}
                <div className="absolute top-4 right-4 bg-black/80 rounded-lg p-3">
                  <div className="text-sm font-semibold text-white mb-2">Live Stats</div>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div className="flex justify-between gap-4">
                      <span>Total Holders:</span>
                      <span className="text-cyan-400">{filteredHolders.length.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Countries:</span>
                      <span className="text-blue-400">{countryStats.length}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Total Value:</span>
                      <span className="text-green-400">${(filteredHolders.reduce((sum, h) => sum + h.balance, 0) / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters & Analytics */}
          <div className="space-y-6">
            
            {/* Filters */}
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-cyan-400" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Balance Range */}
                <div className="space-y-2">
                  <Label>Balance Range</Label>
                  <Slider
                    value={[filters.minBalance]}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, minBalance: value[0] }))}
                    max={10000000}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{filters.minBalance.toLocaleString()}</span>
                    <span>10M+</span>
                  </div>
                </div>

                {/* Holder Types */}
                <div className="space-y-2">
                  <Label>Holder Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['whale', 'dolphin', 'fish', 'shrimp'].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Switch
                          checked={filters.holderTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            setFilters(prev => ({
                              ...prev,
                              holderTypes: checked 
                                ? [...prev.holderTypes, type]
                                : prev.holderTypes.filter(t => t !== type)
                            }));
                          }}
                        />
                        <label className="text-sm capitalize">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Show Clusters */}
                <div className="flex items-center justify-between">
                  <Label>Show Clusters</Label>
                  <Switch
                    checked={filters.showClusters}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showClusters: checked }))}
                  />
                </div>

                {/* Time Range */}
                <div className="space-y-2">
                  <Label>Time Range</Label>
                  <Select value={filters.timeRange} onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="1y">Last Year</SelectItem>
                      <SelectItem value="6m">Last 6 Months</SelectItem>
                      <SelectItem value="3m">Last 3 Months</SelectItem>
                      <SelectItem value="1m">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Top Countries */}
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Top Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {countryStats.slice(0, 8).map((stat, index) => (
                    <div key={stat.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{stat.country}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-cyan-400">{stat.count}</div>
                        <div className="text-xs text-gray-400">${(stat.totalValue / 1000000).toFixed(1)}M</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Holder Info */}
            {selectedHolder && (
              <Card className="electric-frame">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-cyan-400" />
                    Holder Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400">Address</div>
                    <div className="text-sm font-mono">{selectedHolder.address}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Location</div>
                    <div className="text-sm">{selectedHolder.city}, {selectedHolder.country}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Balance</div>
                    <div className="text-sm font-semibold text-green-400">{selectedHolder.balance.toLocaleString()} tokens</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Holder Type</div>
                    <Badge className={`${getHolderTypeColor(selectedHolder.holderType)} text-white capitalize`}>
                      {selectedHolder.holderType}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Last Activity</div>
                    <div className="text-sm">{new Date(selectedHolder.lastActivity).toLocaleDateString()}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}