import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import TokenHolderAnalysis from "@/components/token-holder-analysis";
import { 
  Building2, 
  Target, 
  BarChart3, 
  Users, 
  TrendingUp,
  Zap,
  Globe,
  DollarSign,
  Clock,
  Shield,
  Award,
  Rocket,
  Database,
  Eye,
  PieChart,
  Activity
} from "lucide-react";

interface CampaignTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  suggestedBudget: string;
  targetAudience: string;
  expectedReach: string;
  icon: React.ComponentType;
}

const campaignTemplates: CampaignTemplate[] = [
  {
    id: "product-launch",
    name: "Product Launch",
    category: "marketing",
    description: "Announce new products with tokenized rewards for early adopters",
    suggestedBudget: "5-50 SOL",
    targetAudience: "Existing customers + influencers",
    expectedReach: "10K-100K users",
    icon: Rocket
  },
  {
    id: "loyalty-rewards",
    name: "Loyalty Program",
    category: "retention",
    description: "Reward loyal customers with valuable token distributions",
    suggestedBudget: "2-25 SOL",
    targetAudience: "High-value customers",
    expectedReach: "1K-50K users",
    icon: Award
  },
  {
    id: "brand-awareness",
    name: "Brand Awareness",
    category: "acquisition",
    description: "Increase brand visibility through viral token mechanics",
    suggestedBudget: "10-100 SOL",
    targetAudience: "Target demographics",
    expectedReach: "50K-500K users",
    icon: Globe
  },
  {
    id: "user-acquisition",
    name: "User Acquisition",
    category: "growth",
    description: "Attract new users with valuable token incentives",
    suggestedBudget: "5-75 SOL",
    targetAudience: "Competitor token holders",
    expectedReach: "25K-250K users",
    icon: Users
  },
  {
    id: "community-building",
    name: "Community Building",
    category: "engagement",
    description: "Build engaged communities through token-gated experiences",
    suggestedBudget: "3-30 SOL",
    targetAudience: "Community members",
    expectedReach: "5K-100K users",
    icon: Building2
  }
];

export default function EnterpriseCampaigns() {
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [campaignMessage, setCampaignMessage] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [valuePerToken, setValuePerToken] = useState("");
  const [targetingMethod, setTargetingMethod] = useState("demographics");
  const [demographicFilters, setDemographicFilters] = useState({
    ageRange: "",
    location: "",
    interests: ""
  });
  const [advancedFeatures, setAdvancedFeatures] = useState({
    viralMechanics: false,
    socialProof: false,
    gamification: false,
    analytics: true,
    retargeting: false
  });
  const { toast } = useToast();

  const createCampaign = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/enterprise/campaigns", data);
    },
    onSuccess: () => {
      toast({
        title: "Campaign Created!",
        description: "Your enterprise marketing campaign has been launched successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Campaign Failed",
        description: "Could not create campaign. Please check your inputs and try again.",
        variant: "destructive",
      });
    },
  });

  const { data: marketingInsights } = useQuery({
    queryKey: ["/api/enterprise/marketing-insights"],
    queryFn: async () => {
      return apiRequest("GET", "/api/enterprise/marketing-insights");
    }
  });

  const handleCreateCampaign = () => {
    if (!campaignName || !campaignMessage || !totalBudget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required campaign details.",
        variant: "destructive",
      });
      return;
    }

    createCampaign.mutate({
      name: campaignName,
      message: campaignMessage.substring(0, 27),
      templateId: selectedTemplate?.id,
      totalBudget: parseFloat(totalBudget),
      valuePerToken: parseFloat(valuePerToken || "0.01"),
      targetingMethod,
      demographicFilters,
      advancedFeatures,
      expectedMetrics: {
        reach: selectedTemplate?.expectedReach,
        engagement: "5-15%",
        conversion: "2-8%"
      }
    });
  };

  const estimatedReach = Math.floor(parseFloat(totalBudget || "0") / parseFloat(valuePerToken || "0.01"));
  const remainingChars = 27 - campaignMessage.length;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Enterprise Marketing Campaigns</h1>
          <p className="text-xl text-muted-foreground">Launch powerful blockchain-based marketing campaigns with data-driven insights</p>
        </div>

        <Tabs defaultValue="create" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Campaign</TabsTrigger>
            <TabsTrigger value="insights">Marketing Insights</TabsTrigger>
            <TabsTrigger value="analytics">Data Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Campaign Templates */}
              <Card className="electric-frame lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-gradient">Campaign Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {campaignTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedTemplate?.id === template.id 
                          ? "ring-2 ring-primary bg-primary/5" 
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <template.icon className="w-6 h-6 text-primary mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{template.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge variant="outline" className="text-xs">{template.suggestedBudget}</Badge>
                              <Badge variant="outline" className="text-xs">{template.expectedReach}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Campaign Details */}
              <Card className="electric-frame lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-gradient">Campaign Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Campaign Name</Label>
                      <Input
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Q1 Product Launch Campaign"
                        className="pulse-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Budget (SOL)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(e.target.value)}
                        placeholder="10.0"
                        className="pulse-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Campaign Message</Label>
                    <Textarea
                      value={campaignMessage}
                      onChange={(e) => setCampaignMessage(e.target.value)}
                      placeholder="🚀 NEW PRODUCT LAUNCH! 🎉"
                      maxLength={27}
                      className="resize-none pulse-border"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Optimized for blockchain storage</span>
                      <Badge variant={remainingChars < 0 ? "destructive" : "secondary"}>
                        {remainingChars}/27
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Value Per Token (SOL)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        min="0.001"
                        value={valuePerToken}
                        onChange={(e) => setValuePerToken(e.target.value)}
                        placeholder="0.01"
                        className="pulse-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Reach</Label>
                      <div className="flex items-center space-x-2 h-10 px-3 py-2 bg-muted rounded-md">
                        <Users className="w-4 h-4" />
                        <span>{estimatedReach.toLocaleString()} users</span>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Features */}
                  <div className="space-y-4">
                    <Label>Advanced Campaign Features</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(advancedFeatures).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                          <Label className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => 
                              setAdvancedFeatures(prev => ({ ...prev, [key]: checked }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Targeting Options */}
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Audience Targeting</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={targetingMethod} onValueChange={setTargetingMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="demographics">Demographics</TabsTrigger>
                    <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                    <TabsTrigger value="token-holders">Token Holders</TabsTrigger>
                  </TabsList>

                  <TabsContent value="demographics" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Age Range</Label>
                        <Select onValueChange={(value) => setDemographicFilters(prev => ({ ...prev, ageRange: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select age range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="18-25">18-25</SelectItem>
                            <SelectItem value="26-35">26-35</SelectItem>
                            <SelectItem value="36-45">36-45</SelectItem>
                            <SelectItem value="46-55">46-55</SelectItem>
                            <SelectItem value="55+">55+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="e.g., United States, Europe"
                          onChange={(e) => setDemographicFilters(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Interests</Label>
                        <Input
                          placeholder="e.g., DeFi, Gaming, NFTs"
                          onChange={(e) => setDemographicFilters(prev => ({ ...prev, interests: e.target.value }))}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="behavioral" className="mt-6">
                    <div className="text-center py-8">
                      <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Behavioral Targeting</h3>
                      <p className="text-muted-foreground">Target users based on their on-chain activity, transaction patterns, and engagement history.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="token-holders" className="mt-6">
                    <TokenHolderAnalysis 
                      onHoldersSelected={(holders) => {
                        toast({
                          title: "Targeting Updated",
                          description: `Campaign will target ${holders.length} token holders`,
                        });
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={handleCreateCampaign}
                disabled={!campaignName || !campaignMessage || !totalBudget || createCampaign.isPending}
                size="lg"
                className="px-8"
              >
                {createCampaign.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Launching Campaign...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch Campaign
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold">2.4M+</h3>
                  <p className="text-sm text-muted-foreground">Total Addressable Users</p>
                </CardContent>
              </Card>
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold">12.5%</h3>
                  <p className="text-sm text-muted-foreground">Average Engagement Rate</p>
                </CardContent>
              </Card>
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold">$0.08</h3>
                  <p className="text-sm text-muted-foreground">Cost Per Engagement</p>
                </CardContent>
              </Card>
              <Card className="electric-frame">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold">8.2%</h3>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                </CardContent>
              </Card>
            </div>

            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Market Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Top Performing Industries</h4>
                    <div className="space-y-2">
                      {["DeFi Protocols", "Gaming & NFTs", "Social Media", "E-commerce", "Fintech"].map((industry, i) => (
                        <div key={industry} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                          <span>{industry}</span>
                          <Badge variant="secondary">{(15 - i * 2)}% CTR</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Optimal Campaign Timing</h4>
                    <div className="space-y-2">
                      {["Tuesday 2-4 PM EST", "Wednesday 10-12 PM EST", "Saturday 6-8 PM EST", "Sunday 1-3 PM EST"].map((time, i) => (
                        <div key={time} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                          <span>{time}</span>
                          <Badge variant="secondary">{(95 - i * 5)}% reach</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="electric-frame">
                <CardHeader>
                  <CardTitle className="text-gradient">User Behavior Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Average tokens per user</span>
                      <Badge variant="secondary">3.7</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Retention rate (30 days)</span>
                      <Badge variant="secondary">68%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Average session duration</span>
                      <Badge variant="secondary">8.5 min</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Cross-platform usage</span>
                      <Badge variant="secondary">45%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="electric-frame">
                <CardHeader>
                  <CardTitle className="text-gradient">Demographic Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Age Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">18-25</span>
                          <span className="text-sm">28%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">26-35</span>
                          <span className="text-sm">35%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">36-45</span>
                          <span className="text-sm">22%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">46+</span>
                          <span className="text-sm">15%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Geographic Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">North America</span>
                          <span className="text-sm">42%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Europe</span>
                          <span className="text-sm">31%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Asia</span>
                          <span className="text-sm">19%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Other</span>
                          <span className="text-sm">8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}