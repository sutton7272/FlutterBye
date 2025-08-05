import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Eye,
  Search,
  Zap,
  Target,
  Shield,
  Globe,
  Activity,
  Star,
  Sparkles,
  MessageSquare
} from "lucide-react";
import FlutterAIDashboard from "./flutterai-dashboard";
import EnterpriseDashboard from "./enterprise-dashboard";

export default function Intelligence() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const intelligenceMetrics = [
    {
      label: "AI Analysis Score",
      value: "94/100",
      description: "Platform intelligence rating",
      icon: Brain,
      color: "electric-blue"
    },
    {
      label: "Predictive Accuracy",
      value: "87.3%",
      description: "Viral prediction success rate",
      icon: Target,
      color: "electric-green"
    },
    {
      label: "Market Insights",
      value: "1,247",
      description: "Real-time data points",
      icon: BarChart3,
      color: "purple"
    },
    {
      label: "User Intelligence",
      value: "15.8K",
      description: "Analyzed wallet profiles",
      icon: Users,
      color: "orange"
    }
  ];

  const aiCapabilities = [
    {
      title: "Wallet Intelligence",
      description: "Deep behavioral analysis and scoring",
      icon: Shield,
      features: ["Behavioral patterns", "Risk assessment", "Wealth indicators", "Activity analysis"],
      status: "active"
    },
    {
      title: "Viral Prediction",
      description: "AI-powered content virality forecasting",
      icon: Zap,
      features: ["Content analysis", "Trend prediction", "Engagement scoring", "Optimization tips"],
      status: "active"
    },
    {
      title: "Market Intelligence",
      description: "Real-time market analysis and insights",
      icon: TrendingUp,
      features: ["Price prediction", "Volume analysis", "Sentiment tracking", "Risk metrics"],
      status: "active"
    },
    {
      title: "Enterprise Analytics",
      description: "Advanced business intelligence tools",
      icon: Globe,
      features: ["Customer insights", "Revenue optimization", "Compliance monitoring", "Performance tracking"],
      status: "enterprise"
    }
  ];

  const quickInsights = [
    {
      title: "Market Sentiment",
      value: "Bullish",
      change: "+12%",
      positive: true
    },
    {
      title: "Top Performing Category",
      value: "Emotional Tokens",
      change: "47% growth",
      positive: true
    },
    {
      title: "Risk Level",
      value: "Low",
      change: "Stable",
      positive: true
    },
    {
      title: "Opportunity Score",
      value: "High",
      change: "3 new trends",
      positive: true
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-electric-blue bg-clip-text text-transparent">
            AI Intelligence Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced blockchain intelligence powered by cutting-edge AI and machine learning
          </p>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <Sparkles className="mr-1 h-3 w-3" />
            Powered by GPT-4o
          </Badge>
        </div>

        {/* Intelligence Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {intelligenceMetrics.map((metric, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`h-8 w-8 text-${metric.color} group-hover:scale-110 transition-transform`} />
                  <Badge variant="outline" className="text-xs">LIVE</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm font-medium">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Interface */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ask AI anything about wallets, markets, or trends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Brain className="mr-2 h-4 w-4" />
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickInsights.map((insight, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{insight.title}</p>
                  <p className="text-xl font-bold">{insight.value}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={insight.positive ? "default" : "destructive"} className="text-xs">
                      {insight.change}
                    </Badge>
                    <Activity className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Intelligence Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flutterai">FlutterAI</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            <TabsTrigger value="capabilities">AI Capabilities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* AI Capabilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiCapabilities.map((capability, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple/10 group-hover:bg-purple/20 transition-colors">
                          <capability.icon className="h-6 w-6 text-purple" />
                        </div>
                        <div>
                          <CardTitle className="group-hover:text-electric-blue transition-colors">
                            {capability.title}
                          </CardTitle>
                          <CardDescription>{capability.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={capability.status === "enterprise" ? "secondary" : "default"}>
                        {capability.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {capability.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <div className="w-1 h-1 bg-electric-blue rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Live AI Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-electric-blue" />
                  AI Assistant
                </CardTitle>
                <CardDescription>
                  Chat with ARIA, your intelligent blockchain assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">ARIA</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Hello! I'm your AI assistant. I can help you analyze wallets, predict market trends, 
                          and provide intelligent insights about the blockchain ecosystem. What would you like to explore?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Ask ARIA anything..." className="flex-1" />
                    <Button>
                      <Brain className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flutterai" className="space-y-6">
            <FlutterAIDashboard />
          </TabsContent>

          <TabsContent value="enterprise" className="space-y-6">
            <EnterpriseDashboard />
          </TabsContent>

          <TabsContent value="capabilities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    AI Model Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Prediction Accuracy</span>
                      <span className="font-medium">94.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Response Time</span>
                      <span className="font-medium">0.2s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Coverage</span>
                      <span className="font-medium">15.8K wallets</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Model Version</span>
                      <span className="font-medium">GPT-4o Enhanced</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-electric-green" />
                    Security & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Encryption</span>
                      <Badge className="bg-electric-green/20 text-electric-green">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">GDPR Compliance</span>
                      <Badge className="bg-electric-green/20 text-electric-green">Compliant</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">SOC2 Certified</span>
                      <Badge className="bg-electric-green/20 text-electric-green">Verified</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Audit Trail</span>
                      <Badge className="bg-electric-green/20 text-electric-green">Complete</Badge>
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