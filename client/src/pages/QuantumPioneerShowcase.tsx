import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Eye, 
  Shield,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Target,
  Clock,
  Award
} from "lucide-react";
import Navbar from "@/components/navbar";

export default function QuantumPioneerShowcase() {
  const capabilities = [
    {
      icon: Brain,
      title: "Advanced AI Content Generation",
      description: "Multi-modal content creation using cutting-edge AI models",
      features: ["GPT-4o Integration", "Image Analysis", "Voice Processing", "Real-time Generation"],
      color: "electric-blue",
      status: "Active"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics Engine",
      description: "Market forecasting and trend prediction algorithms",
      features: ["Trend Forecasting", "Market Analysis", "User Behavior Prediction", "Risk Assessment"],
      color: "electric-green",
      status: "Active"
    },
    {
      icon: Sparkles,
      title: "Quantum-Inspired Algorithms",
      description: "Advanced pattern recognition and optimization",
      features: ["Pattern Recognition", "Optimization Engine", "Complex Data Processing", "Behavioral Analysis"],
      color: "purple-400",
      status: "Beta"
    },
    {
      icon: Eye,
      title: "Real-time Sentiment Analysis",
      description: "Live social media and platform sentiment tracking",
      features: ["Social Monitoring", "Sentiment Scoring", "Trend Detection", "Alert System"],
      color: "orange-400",
      status: "Active"
    }
  ];

  const metrics = [
    { label: "AI Models Deployed", value: "12+", icon: Brain },
    { label: "Daily Predictions", value: "50K+", icon: Target },
    { label: "Processing Speed", value: "<100ms", icon: Clock },
    { label: "Accuracy Rate", value: "98.7%", icon: Award }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-electric-blue/20 rounded-lg border border-electric-blue/50 relative">
                <div className="absolute inset-0 bg-electric-blue/10 rounded-lg animate-ping"></div>
                <Sparkles className="w-8 h-8 text-electric-blue relative z-10" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
                Quantum Pioneer Platform
              </h1>
            </div>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Advanced AI capabilities powering the next generation of Web3 intelligence and automation
            </p>
            <Badge variant="outline" className="mt-4 border-electric-blue/50 text-electric-blue">
              Technology Showcase - View Only
            </Badge>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <Card key={index} className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 text-center">
                  <CardContent className="p-4">
                    <IconComponent className="w-6 h-6 text-electric-blue mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <div className="text-sm text-slate-400">{metric.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Capabilities Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {capabilities.map((capability, index) => {
              const IconComponent = capability.icon;
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
              const colors = getColorStyles(capability.color);
              
              return (
                <Card key={index} className={`bg-slate-800/60 backdrop-blur-sm border-2 ${colors.border} shadow-xl`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${capability.color}/20 rounded-lg border border-${capability.color}/50`}>
                          <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{capability.title}</CardTitle>
                          <p className="text-slate-400 text-sm mt-1">{capability.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={colors.badge}>
                        {capability.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {capability.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-${capability.color} opacity-70`}></div>
                          <span className="text-sm text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Technology Stack */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-green">
                <Zap className="w-5 h-5" />
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-electric-blue" />
                    AI & Machine Learning
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• OpenAI GPT-4o Integration</li>
                    <li>• Custom Neural Networks</li>
                    <li>• Real-time Processing</li>
                    <li>• Quantum-Inspired Algorithms</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-electric-green" />
                    Analytics & Intelligence
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Predictive Analytics Engine</li>
                    <li>• Behavioral Pattern Recognition</li>
                    <li>• Market Sentiment Analysis</li>
                    <li>• Real-time Data Processing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    Security & Infrastructure
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Enterprise-grade Security</li>
                    <li>• Blockchain Integration</li>
                    <li>• Scalable Architecture</li>
                    <li>• 99.9% Uptime SLA</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Future Roadmap */}
          <Card className="bg-slate-800/60 backdrop-blur-sm border-electric-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <Lightbulb className="w-5 h-5" />
                Innovation Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-3">Next Quarter</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Enhanced Multi-modal AI Capabilities</li>
                    <li>• Real-time Cross-chain Analytics</li>
                    <li>• Advanced Sentiment Intelligence</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3">Long-term Vision</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Quantum Computing Integration</li>
                    <li>• AGI-powered Platform Intelligence</li>
                    <li>• Universal Web3 Protocol</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Notice */}
          <div className="mt-8 text-center">
            <Card className="bg-electric-blue/10 border-electric-blue/30 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <MessageSquare className="w-8 h-8 text-electric-blue mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-electric-blue mb-2">
                  Advanced Capabilities Showcase
                </h3>
                <p className="text-slate-300 text-sm">
                  This is a demonstration of FlutterBye's advanced AI capabilities. Full access to these features is available to enterprise clients and authorized users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}