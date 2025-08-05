import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { DatePicker } from "@/components/ui/calendar";
import { 
  Filter, 
  Search, 
  Save, 
  Clock, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Users, 
  Hash,
  Zap,
  Star,
  X,
  Plus,
  Download,
  Share,
  BarChart3,
  Target,
  Layers
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface FilterCriteria {
  id: string;
  category: 'wallet' | 'transaction' | 'token' | 'defi' | 'nft';
  type: 'range' | 'select' | 'multiselect' | 'boolean' | 'date' | 'text';
  name: string;
  description: string;
  icon: any;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
  value?: any;
}

interface SavedFilter {
  id: string;
  name: string;
  description: string;
  criteria: FilterCriteria[];
  createdAt: Date;
  usageCount: number;
  isPublic: boolean;
}

const FILTER_CRITERIA: FilterCriteria[] = [
  // Wallet Filters
  {
    id: 'wallet_balance',
    category: 'wallet',
    type: 'range',
    name: 'Wallet Balance',
    description: 'Filter by wallet balance range',
    icon: DollarSign,
    min: 0,
    max: 10000000,
    unit: 'SOL'
  },
  {
    id: 'wallet_age',
    category: 'wallet',
    type: 'range',
    name: 'Wallet Age',
    description: 'Filter by wallet creation date',
    icon: Clock,
    min: 1,
    max: 365,
    unit: 'days'
  },
  {
    id: 'wallet_activity',
    category: 'wallet',
    type: 'select',
    name: 'Activity Level',
    description: 'Filter by wallet activity level',
    icon: Activity,
    options: ['Very High', 'High', 'Medium', 'Low', 'Inactive']
  },
  {
    id: 'wallet_type',
    category: 'wallet',
    type: 'multiselect',
    name: 'Wallet Type',
    description: 'Filter by wallet behavior type',
    icon: Users,
    options: ['Individual', 'Institution', 'Exchange', 'DeFi Protocol', 'Bot', 'Whale']
  },

  // Transaction Filters
  {
    id: 'tx_value',
    category: 'transaction',
    type: 'range',
    name: 'Transaction Value',
    description: 'Filter by transaction amount',
    icon: DollarSign,
    min: 0,
    max: 1000000,
    unit: 'SOL'
  },
  {
    id: 'tx_type',
    category: 'transaction',
    type: 'multiselect',
    name: 'Transaction Type',
    description: 'Filter by transaction category',
    icon: Hash,
    options: ['Transfer', 'DeFi Swap', 'NFT Trade', 'Staking', 'Lending', 'Bridge']
  },
  {
    id: 'tx_time',
    category: 'transaction',
    type: 'date',
    name: 'Time Range',
    description: 'Filter by transaction date range',
    icon: Clock
  },
  {
    id: 'tx_gas',
    category: 'transaction',
    type: 'range',
    name: 'Gas Usage',
    description: 'Filter by gas consumption',
    icon: Zap,
    min: 0,
    max: 1000000,
    unit: 'lamports'
  },

  // Token Filters
  {
    id: 'token_supply',
    category: 'token',
    type: 'range',
    name: 'Total Supply',
    description: 'Filter by token supply',
    icon: Hash,
    min: 1000,
    max: 1000000000,
    unit: 'tokens'
  },
  {
    id: 'token_holders',
    category: 'token',
    type: 'range',
    name: 'Holder Count',
    description: 'Filter by number of holders',
    icon: Users,
    min: 1,
    max: 100000,
    unit: 'holders'
  },
  {
    id: 'token_liquidity',
    category: 'token',
    type: 'range',
    name: 'Liquidity',
    description: 'Filter by token liquidity',
    icon: TrendingUp,
    min: 1000,
    max: 10000000,
    unit: 'SOL'
  },

  // DeFi Filters
  {
    id: 'defi_protocol',
    category: 'defi',
    type: 'multiselect',
    name: 'Protocol',
    description: 'Filter by DeFi protocol',
    icon: Layers,
    options: ['Raydium', 'Orca', 'Saber', 'Serum', 'Jupiter', 'Marinade', 'Solend']
  },
  {
    id: 'defi_tvl',
    category: 'defi',
    type: 'range',
    name: 'TVL Range',
    description: 'Filter by Total Value Locked',
    icon: DollarSign,
    min: 1000,
    max: 100000000,
    unit: 'SOL'
  },
  {
    id: 'defi_apy',
    category: 'defi',
    type: 'range',
    name: 'APY Range',
    description: 'Filter by Annual Percentage Yield',
    icon: TrendingUp,
    min: 0,
    max: 1000,
    unit: '%'
  },

  // NFT Filters
  {
    id: 'nft_floor',
    category: 'nft',
    type: 'range',
    name: 'Floor Price',
    description: 'Filter by NFT floor price',
    icon: Star,
    min: 0.1,
    max: 1000,
    unit: 'SOL'
  },
  {
    id: 'nft_volume',
    category: 'nft',
    type: 'range',
    name: '24h Volume',
    description: 'Filter by daily trading volume',
    icon: BarChart3,
    min: 10,
    max: 100000,
    unit: 'SOL'
  }
];

export function AdvancedFilteringSystem() {
  const [activeFilters, setActiveFilters] = useState<FilterCriteria[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [filterName, setFilterName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load saved filters
  const { data: filtersData } = useQuery({
    queryKey: ['saved-filters'],
    queryFn: async () => {
      const response = await fetch('/api/filters/saved');
      if (!response.ok) throw new Error('Failed to load filters');
      return response.json();
    }
  });

  useEffect(() => {
    if (filtersData?.filters) {
      setSavedFilters(filtersData.filters);
    }
  }, [filtersData]);

  const addFilter = (criteria: FilterCriteria) => {
    if (!activeFilters.find(f => f.id === criteria.id)) {
      setActiveFilters([...activeFilters, { ...criteria, value: getDefaultValue(criteria) }]);
    }
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter(f => f.id !== filterId));
  };

  const updateFilterValue = (filterId: string, value: any) => {
    setActiveFilters(activeFilters.map(f => 
      f.id === filterId ? { ...f, value } : f
    ));
  };

  const getDefaultValue = (criteria: FilterCriteria) => {
    switch (criteria.type) {
      case 'range':
        return [criteria.min || 0, criteria.max || 100];
      case 'select':
        return criteria.options?.[0] || '';
      case 'multiselect':
        return [];
      case 'boolean':
        return false;
      case 'text':
        return '';
      case 'date':
        return { from: new Date(), to: new Date() };
      default:
        return null;
    }
  };

  const renderFilterInput = (filter: FilterCriteria) => {
    const IconComponent = filter.icon;

    switch (filter.type) {
      case 'range':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {filter.value?.[0] || filter.min} - {filter.value?.[1] || filter.max} {filter.unit}
              </span>
            </div>
            <Slider
              value={filter.value || [filter.min || 0, filter.max || 100]}
              onValueChange={(value) => updateFilterValue(filter.id, value)}
              min={filter.min}
              max={filter.max}
              step={filter.max && filter.max > 1000 ? 1000 : 1}
              className="w-full"
            />
          </div>
        );

      case 'select':
        return (
          <Select
            value={filter.value || ''}
            onValueChange={(value) => updateFilterValue(filter.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${filter.name}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filter.id}-${option}`}
                  checked={filter.value?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const currentValue = filter.value || [];
                    if (checked) {
                      updateFilterValue(filter.id, [...currentValue, option]);
                    } else {
                      updateFilterValue(filter.id, currentValue.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${filter.id}-${option}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <Input
            value={filter.value || ''}
            onChange={(e) => updateFilterValue(filter.id, e.target.value)}
            placeholder={`Enter ${filter.name.toLowerCase()}`}
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={filter.id}
              checked={filter.value || false}
              onCheckedChange={(checked) => updateFilterValue(filter.id, checked)}
            />
            <Label htmlFor={filter.id} className="text-sm">
              Enable {filter.name}
            </Label>
          </div>
        );

      default:
        return <div>Unsupported filter type</div>;
    }
  };

  const saveCurrentFilter = async () => {
    if (!filterName.trim() || activeFilters.length === 0) return;

    const newFilter: SavedFilter = {
      id: `filter_${Date.now()}`,
      name: filterName,
      description: `Custom filter with ${activeFilters.length} criteria`,
      criteria: activeFilters,
      createdAt: new Date(),
      usageCount: 0,
      isPublic: false
    };

    setSavedFilters([...savedFilters, newFilter]);
    setFilterName("");
    
    // TODO: Save to backend
    console.log('Saved filter:', newFilter);
  };

  const loadSavedFilter = (savedFilter: SavedFilter) => {
    setActiveFilters(savedFilter.criteria);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  const exportFilters = () => {
    const filterData = {
      activeFilters,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(filterData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flutterbye-filters-${Date.now()}.json`;
    link.click();
  };

  const filteredCriteria = FILTER_CRITERIA.filter(criteria => {
    const matchesSearch = criteria.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         criteria.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || criteria.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Advanced Filtering System
              </CardTitle>
              <CardDescription>
                Create complex filters to find exactly what you're looking for
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportFilters}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filter Selection Panel */}
        <Card className="lg:col-span-1 bg-background/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Available Filters</CardTitle>
            <div className="space-y-3">
              <Input
                placeholder="Search filters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8"
              />
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="transaction">Transaction</SelectItem>
                  <SelectItem value="token">Token</SelectItem>
                  <SelectItem value="defi">DeFi</SelectItem>
                  <SelectItem value="nft">NFT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-2">
            {filteredCriteria.map((criteria) => {
              const IconComponent = criteria.icon;
              const isActive = activeFilters.some(f => f.id === criteria.id);
              
              return (
                <div
                  key={criteria.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                    isActive ? 'border-primary/50 bg-primary/10' : 'border-border/30 hover:bg-muted/50'
                  }`}
                  onClick={() => isActive ? removeFilter(criteria.id) : addFilter(criteria)}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{criteria.name}</p>
                      <p className="text-xs text-muted-foreground">{criteria.description}</p>
                    </div>
                    {isActive ? (
                      <X className="h-4 w-4 text-primary" />
                    ) : (
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Active Filters Panel */}
        <Card className="lg:col-span-2 bg-background/50 border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                Active Filters
                <Badge variant="secondary">{activeFilters.length}</Badge>
              </CardTitle>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  disabled={activeFilters.length === 0}
                >
                  Clear All
                </Button>
                <Button
                  size="sm"
                  disabled={activeFilters.length === 0}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {activeFilters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No filters active</p>
                <p className="text-sm">Add filters from the left panel to start filtering</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeFilters.map((filter) => {
                  const IconComponent = filter.icon;
                  
                  return (
                    <Card key={filter.id} className="bg-background/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4 text-primary" />
                            <span className="font-medium">{filter.name}</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {filter.category}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFilter(filter.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {renderFilterInput(filter)}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Filter Section */}
      {activeFilters.length > 0 && (
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Save className="h-5 w-5 text-green-400" />
              <Input
                placeholder="Enter filter name to save..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={saveCurrentFilter}
                disabled={!filterName.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                Save Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <Card className="bg-background/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Saved Filters
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedFilters.map((savedFilter) => (
                <Card key={savedFilter.id} className="bg-background/30 cursor-pointer hover:bg-background/50 transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{savedFilter.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {savedFilter.criteria.length} filters
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {savedFilter.description}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadSavedFilter(savedFilter)}
                      className="w-full h-7 text-xs"
                    >
                      Load Filter
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}