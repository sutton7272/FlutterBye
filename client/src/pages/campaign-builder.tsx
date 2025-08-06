import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, 
  Target, 
  MessageSquare, 
  DollarSign, 
  BarChart3, 
  Users, 
  Zap,
  Gift,
  Building2,
  Coins
} from "lucide-react";

export default function CampaignBuilder() {
  const [message, setMessage] = useState("");
  const [value, setValue] = useState("0.01");
  const [targetCriteria, setTargetCriteria] = useState({
    minBalance: [1000],
    tokenHoldings: "",
    activityLevel: "medium",
    walletAge: "any"
  });

  const characterCount = message.length;
  const isValidLength = characterCount <= 27;

  const campaignTypes = [
    {
      id: "greeting",
      title: "Digital Greeting Cards",
      description: "Personal messages with redeemable value",
      icon: Gift,
      color: "electric-green",
      useCase: "retail"
    },
    {
      id: "marketing",
      title: "Targeted Marketing",
      description: "Precision crypto marketing campaigns",
      icon: Target,
      color: "purple",
      useCase: "enterprise"
    },
    {
      id: "community",
      title: "Community Rewards",
      description: "Reward loyal community members",
      icon: Users,
      color: "electric-blue",
      useCase: "community"
    }
  ];

  const targetingExamples = [
    { 
      criteria: "USDC holders with $1000+ balance",
      message: "Try our 5% yield pool!",
      audience: "~15,000 wallets"
    },
    {
      criteria: "SOL stakers, active last 30 days", 
      message: "New validator rewards!",
      audience: "~8,500 wallets"
    },
    {
      criteria: "NFT collectors, trending PFPs",
      message: "Exclusive drop preview",
      audience: "~3,200 wallets"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Campaign Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create targeted 27-character message campaigns using FlutterAI wallet intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Campaign Setup */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Campaign Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-electric-blue" />
                  Campaign Type
                </CardTitle>
                <CardDescription>
                  Choose your campaign objective
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {campaignTypes.map((type) => (
                    <Card key={type.id} className="cursor-pointer hover:shadow-lg transition-all duration-300 group">
                      <CardContent className="p-4 text-center">
                        <div className={`p-3 rounded-lg bg-${type.color}/10 group-hover:bg-${type.color}/20 transition-colors mx-auto w-fit mb-3`}>
                          <type.icon className={`h-6 w-6 text-${type.color}`} />
                        </div>
                        <h3 className="font-semibold mb-1">{type.title}</h3>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {type.useCase}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-electric-blue" />
                  27-Character Message
                </CardTitle>
                <CardDescription>
                  Craft your message (max 27 characters)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message">Message</Label>
                    <Badge 
                      variant={isValidLength ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {characterCount}/27
                    </Badge>
                  </div>
                  <Textarea
                    id="message"
                    placeholder="Enter your 27-character message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`resize-none ${!isValidLength ? 'border-red-500' : ''}`}
                    maxLength={27}
                  />
                  {message && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                      <p className="font-mono text-electric-blue">"{message}"</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">SOL Value</Label>
                    <Input
                      id="value"
                      placeholder="0.01"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="sol">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sol">SOL</SelectItem>
                        <SelectItem value="usdc">USDC</SelectItem>
                        <SelectItem value="flby">FLBY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FlutterAI Targeting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  FlutterAI Targeting
                </CardTitle>
                <CardDescription>
                  Target specific crypto wallet segments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="criteria" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="criteria">Criteria</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="criteria" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Minimum Balance (USDC)</Label>
                        <div className="px-3 py-2">
                          <Slider
                            value={targetCriteria.minBalance}
                            onValueChange={(value) => setTargetCriteria({...targetCriteria, minBalance: value})}
                            max={100000}
                            min={100}
                            step={500}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>$100</span>
                            <span>${targetCriteria.minBalance[0]}</span>
                            <span>$100K+</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Token Holdings</Label>
                        <Input
                          placeholder="e.g., SOL, USDC, specific NFT collections"
                          value={targetCriteria.tokenHoldings}
                          onChange={(e) => setTargetCriteria({...targetCriteria, tokenHoldings: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Activity Level</Label>
                          <Select 
                            value={targetCriteria.activityLevel}
                            onValueChange={(value) => setTargetCriteria({...targetCriteria, activityLevel: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High (daily)</SelectItem>
                              <SelectItem value="medium">Medium (weekly)</SelectItem>
                              <SelectItem value="low">Low (monthly)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Wallet Age</Label>
                          <Select 
                            value={targetCriteria.walletAge}
                            onValueChange={(value) => setTargetCriteria({...targetCriteria, walletAge: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any age</SelectItem>
                              <SelectItem value="new">New (&lt; 3 months)</SelectItem>
                              <SelectItem value="established">Established (&gt; 1 year)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="examples" className="space-y-4">
                    {targetingExamples.map((example, index) => (
                      <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{example.criteria}</h4>
                            <Badge variant="outline">{example.audience}</Badge>
                          </div>
                          <p className="text-xs font-mono text-electric-blue">"{example.message}"</p>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    <div className="text-center p-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="font-semibold mb-2">Enterprise Features</h3>
                      <p className="text-sm mb-4">Advanced targeting, batch processing, and analytics</p>
                      <Button variant="outline">Upgrade to Enterprise</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Preview & Launch */}
          <div className="space-y-6">
            
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-electric-blue" />
                  Campaign Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Message Token</p>
                  <p className="font-mono text-electric-blue font-bold">
                    {message || "Enter your message..."}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Value: {value || "0"} SOL
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Reach:</span>
                    <span className="font-semibold">~5,200 wallets</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Campaign Cost:</span>
                    <span className="font-semibold">{(parseFloat(value || "0") * 5200 + 0.1).toFixed(2)} SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expected Redemption:</span>
                    <span className="font-semibold text-electric-green">~15-25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Launch Campaign */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-electric-green" />
                  Launch Campaign
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!isValidLength || !message}
                >
                  Launch Campaign
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Powered by</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      FlutterAI
                    </Badge>
                    <span className="text-xs">+</span>
                    <Badge variant="outline" className="text-electric-blue border-electric-blue">
                      Solana
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Platform Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Wallets:</span>
                    <span className="font-semibold">250K+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Messages Created:</span>
                    <span className="font-semibold">1.2M+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Value:</span>
                    <span className="font-semibold">15,000 SOL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}