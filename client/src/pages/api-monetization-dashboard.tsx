import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Code2, 
  DollarSign, 
  Activity, 
  Users, 
  Key, 
  Zap,
  BarChart3,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Globe,
  Database,
  Cpu,
  Network
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface APIEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  category: 'intelligence' | 'analytics' | 'trading' | 'compliance' | 'premium';
  pricing: {
    tier: 'free' | 'basic' | 'pro' | 'enterprise';
    pricePerRequest: number;
    monthlyLimit: number;
    overageRate: number;
  };
  isActive: boolean;
  requiresAuth: boolean;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  usage: {
    requests24h: number;
    requests30d: number;
    revenue30d: number;
  };
}

interface APIClient {
  id: string;
  name: string;
  email: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  apiKey: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed: Date;
  usage: {
    requests24h: number;
    requests30d: number;
    spend30d: number;
  };
  limits: {
    requestsPerDay: number;
    requestsPerMonth: number;
  };
}

interface APIMetrics {
  totalRevenue: number;
  totalRequests: number;
  activeClients: number;
  avgRevenuePerClient: number;
  topEndpoints: Array<{
    endpoint: string;
    requests: number;
    revenue: number;
  }>;
  revenueByTier: {
    free: number;
    basic: number;
    pro: number;
    enterprise: number;
  };
}

const API_CATEGORIES = [
  {
    id: 'intelligence',
    name: 'Blockchain Intelligence',
    description: 'Real-time wallet analysis and risk scoring',
    icon: Database,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'analytics',
    name: 'Cross-chain Analytics',
    description: 'Multi-chain transaction and DeFi analytics',
    icon: BarChart3,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'trading',
    name: 'Trading Intelligence',
    description: 'Market signals and arbitrage opportunities',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'compliance',
    name: 'Compliance & Risk',
    description: 'KYC, AML, and sanctions screening',
    icon: Shield,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'premium',
    name: 'Premium Features',
    description: 'Advanced AI and predictive analytics',
    icon: Zap,
    color: 'from-indigo-500 to-purple-500'
  }
];

const PRICING_TIERS = [
  {
    id: 'free',
    name: 'Free',
    color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    limits: '1,000 requests/month'
  },
  {
    id: 'basic',
    name: 'Basic',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    limits: '50,000 requests/month'
  },
  {
    id: 'pro',
    name: 'Pro',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    limits: '500,000 requests/month'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    color: 'bg-green-500/20 text-green-300 border-green-500/30',
    limits: 'Unlimited requests'
  }
];

export default function APIMonetizationDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('intelligence');
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  // Fetch API metrics
  const { data: metrics } = useQuery({
    queryKey: ['api-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/monetization/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json();
    }
  });

  // Fetch API endpoints
  const { data: endpoints } = useQuery({
    queryKey: ['api-endpoints'],
    queryFn: async () => {
      const response = await fetch('/api/monetization/endpoints');
      if (!response.ok) throw new Error('Failed to fetch endpoints');
      return response.json();
    }
  });

  // Fetch API clients
  const { data: clients } = useQuery({
    queryKey: ['api-clients'],
    queryFn: async () => {
      const response = await fetch('/api/monetization/clients');
      if (!response.ok) throw new Error('Failed to fetch clients');
      return response.json();
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleApiKeyVisibility = (clientId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  const filteredEndpoints = endpoints?.endpoints?.filter((endpoint: APIEndpoint) => 
    endpoint.category === selectedCategory
  ) || [];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Monetization Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your $10K-$100K monthly API revenue streams
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add API Key
          </Button>
          <Button variant="outline">
            <Code2 className="h-4 w-4 mr-2" />
            Documentation
          </Button>
        </div>
      </div>

      {/* API Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(metrics?.totalRevenue || 47500)}
            </div>
            <p className="text-sm text-muted-foreground">+32% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">API Requests</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {formatNumber(metrics?.totalRequests || 2340000)}
            </div>
            <p className="text-sm text-muted-foreground">30-day total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {metrics?.activeClients || 127}
            </div>
            <p className="text-sm text-muted-foreground">Avg: {formatCurrency(metrics?.avgRevenuePerClient || 374)}/mo</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              99.7%
            </div>
            <p className="text-sm text-muted-foreground">99.9% uptime SLA</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        {/* API Endpoints */}
        <TabsContent value="endpoints" className="space-y-6">
          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {API_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-20 flex items-center justify-center mb-3`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Endpoints Table */}
          <Card className="bg-background/50 border-border/50">
            <CardHeader>
              <CardTitle>
                {API_CATEGORIES.find(c => c.id === selectedCategory)?.name} Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredEndpoints.map((endpoint: APIEndpoint) => (
                  <div
                    key={endpoint.id}
                    className="p-4 rounded-lg border border-border/30 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                          <Badge className={PRICING_TIERS.find(t => t.id === endpoint.pricing.tier)?.color}>
                            {endpoint.pricing.tier}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold">{endpoint.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {endpoint.description}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price/Request:</span>
                            <p className="font-medium">${endpoint.pricing.pricePerRequest}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">24h Requests:</span>
                            <p className="font-medium">{formatNumber(endpoint.usage.requests24h)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">30d Revenue:</span>
                            <p className="font-medium text-green-400">
                              {formatCurrency(endpoint.usage.revenue30d)}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rate Limit:</span>
                            <p className="font-medium">{endpoint.rateLimit.requestsPerMinute}/min</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={endpoint.isActive}
                          onCheckedChange={() => {
                            // Toggle endpoint status
                          }}
                        />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Clients */}
        <TabsContent value="clients" className="space-y-6">
          <Card className="bg-background/50 border-border/50">
            <CardHeader>
              <CardTitle>API Clients</CardTitle>
              <CardDescription>
                Manage API keys and client access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients?.clients?.map((client: APIClient) => (
                  <div
                    key={client.id}
                    className="p-4 rounded-lg border border-border/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{client.name}</h3>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                      <Badge className={PRICING_TIERS.find(t => t.id === client.tier)?.color}>
                        {client.tier}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <Label className="text-xs">API Key</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                          {showApiKey[client.id] 
                            ? client.apiKey 
                            : `${client.apiKey.substring(0, 8)}...${client.apiKey.substring(client.apiKey.length - 4)}`
                          }
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleApiKeyVisibility(client.id)}
                        >
                          {showApiKey[client.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(client.apiKey)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">24h Requests:</span>
                        <p className="font-medium">{formatNumber(client.usage.requests24h)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">30d Spend:</span>
                        <p className="font-medium text-green-400">
                          {formatCurrency(client.usage.spend30d)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Daily Limit:</span>
                        <p className="font-medium">{formatNumber(client.limits.requestsPerDay)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Used:</span>
                        <p className="font-medium">{new Date(client.lastUsed).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Revenue by Tier */}
          <Card className="bg-background/50 border-border/50">
            <CardHeader>
              <CardTitle>Revenue by Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics?.revenueByTier || {}).map(([tier, revenue]) => {
                  const tierInfo = PRICING_TIERS.find(t => t.id === tier);
                  const percentage = ((revenue as number) / (metrics?.totalRevenue || 1)) * 100;
                  
                  return (
                    <div key={tier} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={tierInfo?.color}>
                            {tierInfo?.name}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {tierInfo?.limits}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">
                            {formatCurrency(revenue as number)}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Endpoints */}
          <Card className="bg-background/50 border-border/50">
            <CardHeader>
              <CardTitle>Top Revenue Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics?.topEndpoints?.map((endpoint: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <code className="text-sm">{endpoint.endpoint}</code>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(endpoint.requests)} requests
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">
                        {formatCurrency(endpoint.revenue)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{index + 1} revenue
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing */}
        <TabsContent value="pricing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_TIERS.map((tier) => (
              <Card key={tier.id} className="bg-background/50 border-border/50">
                <CardHeader>
                  <Badge className={tier.color}>
                    {tier.name}
                  </Badge>
                  <CardTitle className="text-xl">
                    {tier.id === 'free' ? 'Free' : 
                     tier.id === 'basic' ? '$99/mo' :
                     tier.id === 'pro' ? '$499/mo' : 'Custom'}
                  </CardTitle>
                  <CardDescription>{tier.limits}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Rate Limit:</span>
                      <span>
                        {tier.id === 'free' ? '10/min' :
                         tier.id === 'basic' ? '100/min' :
                         tier.id === 'pro' ? '1000/min' : 'Unlimited'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support:</span>
                      <span>
                        {tier.id === 'free' ? 'Community' :
                         tier.id === 'basic' ? 'Email' :
                         tier.id === 'pro' ? '24/7 Chat' : 'Dedicated'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>SLA:</span>
                      <span>
                        {tier.id === 'free' ? 'None' :
                         tier.id === 'basic' ? '99%' :
                         tier.id === 'pro' ? '99.9%' : '99.99%'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}