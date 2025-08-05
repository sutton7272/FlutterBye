import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Wallet, 
  MessageSquare, 
  BarChart3, 
  Zap,
  Star,
  AlertTriangle,
  DollarSign,
  Network
} from "lucide-react";

interface AddressIntelligence {
  address: string;
  activityScore: number;
  engagementScore: number;
  riskAssessment: 'low' | 'medium' | 'high';
  valueTier: 'bronze' | 'silver' | 'gold' | 'diamond';
  customerSegment: string;
  viralPotential: number;
  predictedValue: number;
  lastSeen: string;
}

interface IntelligenceReport {
  summary: {
    totalAddresses: number;
    averageEngagement: number;
    tierDistribution: Record<string, number>;
    riskDistribution: Record<string, number>;
  };
  topPerformers: AddressIntelligence[];
  marketingOpportunities: string[];
  revenueProjections: Record<string, number>;
}

export function FlutterAIIntelligenceDashboard() {
  const { toast } = useToast();
  const [addressInput, setAddressInput] = useState("");
  const [campaignAddresses, setCampaignAddresses] = useState("");
  const [campaignType, setCampaignType] = useState("promotion");

  // Fetch intelligence report
  const { data: report, isLoading: reportLoading } = useQuery<{success: boolean; data: IntelligenceReport}>({
    queryKey: ["/api/ai/intelligence/report"],
  });

  // Fetch top addresses
  const { data: topAddresses } = useQuery<{success: boolean; data: AddressIntelligence[]}>({
    queryKey: ["/api/ai/addresses/top/20"],
  });

  // Single address lookup
  const addressLookupMutation = useMutation({
    mutationFn: async (address: string) => {
      const response = await fetch(`/api/ai/address/${address}/intelligence`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Address not found');
      return response.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Address Lookup Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Campaign optimization
  const campaignOptimizationMutation = useMutation({
    mutationFn: async ({ addresses, type }: { addresses: string[], type: string }) => {
      const response = await fetch('/api/ai/campaign/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          targetAddresses: addresses,
          campaignType: type
        })
      });
      if (!response.ok) throw new Error('Campaign optimization failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Campaign Optimized!",
        description: `Generated personalized messages for ${data.data.optimizedMessages.length} addresses`,
      });
    }
  });

  const handleAddressLookup = () => {
    if (addressInput.trim()) {
      addressLookupMutation.mutate(addressInput.trim());
    }
  };

  const handleCampaignOptimization = () => {
    const addresses = campaignAddresses
      .split('\n')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0);
    
    if (addresses.length > 0) {
      campaignOptimizationMutation.mutate({ addresses, type: campaignType });
    }
  };

  const getTierColor = (tier: string) => {
    const colors = {
      diamond: "bg-purple-100 text-purple-800 border-purple-200",
      gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
      silver: "bg-gray-100 text-gray-800 border-gray-200",
      bronze: "bg-orange-100 text-orange-800 border-orange-200"
    };
    return colors[tier as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    };
    return colors[risk as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (reportLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-pulse mx-auto mb-2 text-blue-600" />
          <p>Loading FlutterAI Intelligence...</p>
        </div>
      </div>
    );
  }

  const reportData = report?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            FlutterAI Intelligence Dashboard
          </h2>
          <p className="text-gray-600">
            Universal address intelligence from Flutterbye communications
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Address Collection Active
        </Badge>
      </div>

      {/* Key Metrics */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Addresses</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.summary.totalAddresses}</div>
              <p className="text-xs text-muted-foreground">
                Collected from all Flutterbye messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(reportData.summary.averageEngagement)}%</div>
              <p className="text-xs text-muted-foreground">
                Communication response rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Value Addresses</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(reportData.summary.tierDistribution.gold || 0) + (reportData.summary.tierDistribution.diamond || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Gold & Diamond tier addresses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.round(Object.values(reportData.revenueProjections).reduce((a, b) => a + b, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Monthly projected revenue
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lookup">Address Lookup</TabsTrigger>
          <TabsTrigger value="campaign">Campaign Optimizer</TabsTrigger>
          <TabsTrigger value="performers">Top Performers</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {reportData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Value Tier Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(reportData.summary.tierDistribution).map(([tier, count]) => (
                        <div key={tier} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={getTierColor(tier)}>
                                {tier.charAt(0).toUpperCase() + tier.slice(1)}
                              </Badge>
                              <span className="text-sm">{count} addresses</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {Math.round((count / reportData.summary.totalAddresses) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={(count / reportData.summary.totalAddresses) * 100} 
                            className="h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(reportData.summary.riskDistribution).map(([risk, count]) => (
                        <div key={risk} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={getRiskColor(risk)}>
                                {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
                              </Badge>
                              <span className="text-sm">{count} addresses</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {Math.round((count / reportData.summary.totalAddresses) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={(count / reportData.summary.totalAddresses) * 100} 
                            className="h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Marketing Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.marketingOpportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="lookup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Address Intelligence</CardTitle>
              <CardDescription>
                Look up detailed intelligence for any wallet address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter wallet address (e.g., 0x1234...)"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddressLookup}
                  disabled={addressLookupMutation.isPending}
                >
                  {addressLookupMutation.isPending ? "Looking up..." : "Lookup"}
                </Button>
              </div>

              {addressLookupMutation.data && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Address Intelligence</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Activity Score:</strong> {addressLookupMutation.data.data.activityScore}/100
                    </div>
                    <div>
                      <strong>Engagement Score:</strong> {addressLookupMutation.data.data.engagementScore}/100
                    </div>
                    <div>
                      <strong>Value Tier:</strong> 
                      <Badge className={`ml-2 ${getTierColor(addressLookupMutation.data.data.valueTier)}`}>
                        {addressLookupMutation.data.data.valueTier}
                      </Badge>
                    </div>
                    <div>
                      <strong>Risk Level:</strong>
                      <Badge className={`ml-2 ${getRiskColor(addressLookupMutation.data.data.riskAssessment)}`}>
                        {addressLookupMutation.data.data.riskAssessment}
                      </Badge>
                    </div>
                    <div>
                      <strong>Viral Potential:</strong> {addressLookupMutation.data.data.viralPotential}/100
                    </div>
                    <div>
                      <strong>Customer Segment:</strong> {addressLookupMutation.data.data.customerSegment}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI-Powered Campaign Optimization
              </CardTitle>
              <CardDescription>
                Optimize Flutterbye campaigns using address intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Target Addresses (one per line)</label>
                  <Textarea
                    placeholder="0x1234...&#10;0x5678...&#10;0x9abc..."
                    value={campaignAddresses}
                    onChange={(e) => setCampaignAddresses(e.target.value)}
                    rows={6}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Campaign Type</label>
                  <select 
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="promotion">Promotion</option>
                    <option value="welcome">Welcome</option>
                    <option value="retention">Retention</option>
                    <option value="premium">Premium Offer</option>
                  </select>
                </div>

                <Button 
                  onClick={handleCampaignOptimization}
                  disabled={campaignOptimizationMutation.isPending}
                  className="w-full"
                >
                  {campaignOptimizationMutation.isPending ? "Optimizing..." : "Optimize Campaign"}
                </Button>

                {campaignOptimizationMutation.data && (
                  <div className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium mb-2">Campaign Optimization Results</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Total Reach:</strong> {campaignOptimizationMutation.data.data.campaignInsights.totalReach}</p>
                      <p><strong>Expected Response:</strong> {campaignOptimizationMutation.data.data.campaignInsights.expectedResponse}%</p>
                      <p><strong>High Value Targets:</strong> {campaignOptimizationMutation.data.data.campaignInsights.highValueTargets}</p>
                      <p><strong>Risk Addresses:</strong> {campaignOptimizationMutation.data.data.campaignInsights.riskAddresses}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Performing Addresses
              </CardTitle>
              <CardDescription>
                Highest value addresses by combined intelligence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topAddresses?.data && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Address</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Viral Potential</TableHead>
                        <TableHead>Risk</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topAddresses.data.slice(0, 10).map((addr) => (
                        <TableRow key={addr.address}>
                          <TableCell className="font-mono text-xs">
                            {addr.address.slice(0, 8)}...{addr.address.slice(-6)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getTierColor(addr.valueTier)}>
                              {addr.valueTier}
                            </Badge>
                          </TableCell>
                          <TableCell>{addr.activityScore}/100</TableCell>
                          <TableCell>{addr.engagementScore}/100</TableCell>
                          <TableCell>{addr.viralPotential}/100</TableCell>
                          <TableCell>
                            <Badge className={getRiskColor(addr.riskAssessment)}>
                              {addr.riskAssessment}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {reportData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Revenue Projections (Data-as-a-Service)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(reportData.revenueProjections).map(([service, revenue]) => (
                    <div key={service} className="p-4 border rounded-lg">
                      <h4 className="font-medium capitalize mb-1">
                        {service.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className="text-2xl font-bold text-green-600">
                        ${revenue.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">Monthly potential</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}