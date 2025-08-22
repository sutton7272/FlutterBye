import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Wallet, 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp,
  Shield,
  Globe,
  MessageSquare,
  Eye,
  Zap,
  Search,
  Database,
  Activity,
  Award,
  Clock
} from "lucide-react";
import Navbar from "@/components/navbar";

export default function FlutterAIShowcase() {
  const intelligenceFeatures = [
    {
      icon: Wallet,
      title: "Wallet Intelligence Analysis",
      description: "Comprehensive blockchain wallet behavior and pattern analysis",
      features: ["Transaction History Analysis", "Behavioral Pattern Recognition", "Risk Assessment Scoring", "Wealth Indicator Tracking"],
      color: "electric-blue",
      accuracy: "98.7%"
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics Engine",
      description: "AI-powered market predictions and trend forecasting",
      features: ["Market Trend Prediction", "User Behavior Forecasting", "Revenue Optimization", "Campaign Performance Prediction"],
      color: "electric-green",
      accuracy: "94.2%"
    },
    {
      icon: Users,
      title: "Social Intelligence Network",
      description: "Advanced social media monitoring and sentiment analysis",
      features: ["Real-time Sentiment Tracking", "Influencer Identification", "Viral Content Prediction", "Community Health Scoring"],
      color: "purple-400",
      accuracy: "96.5%"
    },
    {
      icon: Target,
      title: "Campaign Intelligence Platform",
      description: "AI-driven marketing campaign optimization and insights",
      features: ["Audience Segmentation", "Content Optimization", "Budget Allocation", "ROI Maximization"],
      color: "orange-400",
      accuracy: "97.3%"
    }
  ];

  const analyticsMetrics = [
    { label: "Wallets Analyzed", value: "2.8M+", icon: Wallet },
    { label: "AI Predictions Daily", value: "150K+", icon: Brain },
    { label: "Data Points Processed", value: "50B+", icon: Database },
    { label: "Intelligence Accuracy", value: "97.2%", icon: Award }
  ];

  const enterpriseCapabilities = [
    {
      title: "Enterprise Wallet Management",
      description: "Bank-level multi-signature escrow system for high-value contracts",
      features: ["Multi-sig Security", "Compliance Reporting", "Automated Escrow", "Real-time Monitoring"],
      value: "$200K - $2M",
      clients: "47+ Enterprise Clients"
    },
    {
      title: "Partnership Intelligence Platform",
      description: "Real-time partnership analytics and performance tracking",
      features: ["Click Analytics", "Performance Metrics", "ROI Tracking", "Automated Reporting"],
      value: "Real-time Analytics",
      clients: "Active Partnership Network"
    },
    {
      title: "AI Campaign Intelligence",
      description: "Advanced marketing intelligence with performance prediction",
      features: ["Campaign Optimization", "Audience Analysis", "Budget Recommendations", "Trend Prediction"],
      value: "340% Growth Rate",
      clients: "Enterprise Marketing Teams"
    }
  ];

  const technicalStack = [
    {
      category: "AI & Machine Learning",
      technologies: ["OpenAI GPT-4o", "Custom Neural Networks", "Real-time Processing", "Behavioral Analysis"],
      icon: Brain,
      color: "electric-blue"
    },
    {
      category: "Blockchain Intelligence",
      technologies: ["Multi-chain Analytics", "Transaction Analysis", "Wallet Profiling", "DeFi Tracking"],
      icon: Shield,
      color: "electric-green"
    },
    {
      category: "Data Infrastructure",
      technologies: ["PostgreSQL", "Real-time ETL", "Cloud Computing", "API Management"],
      icon: Database,
      color: "purple-400"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/50 relative">
                <div className="absolute inset-0 bg-purple-500/10 rounded-lg animate-ping"></div>
                <Brain className="w-8 h-8 text-purple-400 relative z-10" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-electric-blue bg-clip-text text-transparent">
                FlutterAI Intelligence
              </h1>
            </div>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Revolutionary AI-powered blockchain intelligence platform providing comprehensive analytics, predictions, and insights for Web3 ecosystem
            </p>
            <Badge variant="outline" className="mt-4 border-purple-400/50 text-purple-400">
              Intelligence Platform - Demonstration
            </Badge>
          </div>

          {/* Analytics Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {analyticsMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <Card key={index} className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 text-center">
                  <CardContent className="p-4">
                    <IconComponent className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <div className="text-sm text-slate-400">{metric.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Intelligence Features */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {intelligenceFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              const getColorStyles = (color: string) => {
                switch (color) {
                  case "electric-blue":
                    return {
                      border: "border-electric-blue/30",
                      icon: "text-electric-blue",
                      badge: "border-electric-blue/50 text-electric-blue"
                    };
                  case "electric-green":
                    return {
                      border: "border-electric-green/30",
                      icon: "text-electric-green",
                      badge: "border-electric-green/50 text-electric-green"
                    };
                  case "purple-400":
                    return {
                      border: "border-purple-400/30",
                      icon: "text-purple-400",
                      badge: "border-purple-400/50 text-purple-400"
                    };
                  case "orange-400":
                    return {
                      border: "border-orange-400/30",
                      icon: "text-orange-400",
                      badge: "border-orange-400/50 text-orange-400"
                    };
                  default:
                    return {
                      border: "border-electric-blue/30",
                      icon: "text-electric-blue",
                      badge: "border-electric-blue/50 text-electric-blue"
                    };
                }
              };
              const colors = getColorStyles(feature.color);
              
              return (
                <Card key={index} className={`bg-slate-800/60 backdrop-blur-sm border-2 ${colors.border} shadow-xl`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${feature.color}/20 rounded-lg border border-${feature.color}/50`}>
                          <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                          <p className="text-slate-400 text-sm mt-1">{feature.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={colors.badge}>
                        {feature.accuracy}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {feature.features.map((item, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-${feature.color} opacity-70`}></div>
                          <span className="text-sm text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Enterprise Capabilities */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <Activity className="w-5 h-5" />
                Enterprise Intelligence Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-6">
                {enterpriseCapabilities.map((capability, index) => (
                  <div key={index} className="space-y-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">{capability.title}</h3>
                      <p className="text-slate-400 text-sm mb-3">{capability.description}</p>
                      <div className="space-y-2">
                        {capability.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-electric-blue opacity-70" />
                            <span className="text-xs text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-700/50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Value Range</span>
                        <span className="text-sm text-electric-green font-medium">{capability.value}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-slate-400">Status</span>
                        <span className="text-sm text-electric-blue font-medium">{capability.clients}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Infrastructure */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {technicalStack.map((stack, index) => {
              const IconComponent = stack.icon;
              const getColorStyles = (color: string) => {
                switch (color) {
                  case "electric-blue":
                    return {
                      border: "border-electric-blue/30",
                      icon: "text-electric-blue"
                    };
                  case "electric-green":
                    return {
                      border: "border-electric-green/30",
                      icon: "text-electric-green"
                    };
                  case "purple-400":
                    return {
                      border: "border-purple-400/30",
                      icon: "text-purple-400"
                    };
                  default:
                    return {
                      border: "border-electric-blue/30",
                      icon: "text-electric-blue"
                    };
                }
              };
              const colors = getColorStyles(stack.color);
              
              return (
                <Card key={index} className={`bg-slate-800/60 backdrop-blur-sm border-2 ${colors.border}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${stack.color}/20 rounded-lg border border-${stack.color}/50`}>
                        <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <CardTitle className="text-white text-lg">{stack.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stack.technologies.map((tech, tIndex) => (
                        <div key={tIndex} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-${stack.color} opacity-70`}></div>
                          <span className="text-sm text-slate-300">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Access Notice */}
          <div className="text-center">
            <Card className="bg-purple-500/10 border-purple-400/30 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-purple-400 mb-2">
                  FlutterAI Intelligence Platform
                </h3>
                <p className="text-slate-300 text-sm">
                  This showcase demonstrates FlutterBye's advanced AI intelligence capabilities. Full access to analytics, predictions, and enterprise features is available to authorized users and enterprise clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}