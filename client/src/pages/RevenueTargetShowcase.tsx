import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Building, 
  Users, 
  Globe,
  Calendar,
  Award,
  Briefcase,
  BarChart3,
  Zap,
  Crown
} from "lucide-react";
import Navbar from "@/components/navbar";

export default function RevenueTargetShowcase() {
  const revenueStreams = [
    {
      title: "Enterprise Client Management",
      description: "High-value enterprise contracts and partnerships",
      value: "$50K - $500K",
      period: "Annual",
      icon: Building,
      color: "electric-blue",
      growth: "+340%"
    },
    {
      title: "FlutterAI Intelligence Platform",
      description: "AI-powered analytics and insights subscription",
      value: "$5K - $50K",
      period: "Monthly",
      icon: Brain,
      color: "electric-green",
      growth: "+285%"
    },
    {
      title: "Partnership Revenue",
      description: "Strategic partnerships and collaboration fees",
      value: "$10K - $100K",
      period: "Per Deal",
      icon: Users,
      color: "purple-400",
      growth: "+195%"
    },
    {
      title: "API Monetization",
      description: "Developer access and enterprise API usage",
      value: "$1K - $25K",
      period: "Monthly",
      icon: Zap,
      color: "orange-400",
      growth: "+425%"
    }
  ];

  const milestones = [
    { target: "$1M ARR", timeline: "Q2 2025", status: "achieved", percentage: 100 },
    { target: "$10M ARR", timeline: "Q4 2025", status: "in-progress", percentage: 65 },
    { target: "$50M ARR", timeline: "Q2 2026", status: "projected", percentage: 35 },
    { target: "$200M ARR", timeline: "Q4 2026", status: "target", percentage: 15 }
  ];

  const enterpriseMetrics = [
    { label: "Active Enterprise Clients", value: "47", icon: Building },
    { label: "Average Contract Value", value: "$185K", icon: DollarSign },
    { label: "Client Retention Rate", value: "94%", icon: Award },
    { label: "Revenue Growth Rate", value: "+340%", icon: TrendingUp }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-electric-green/20 rounded-lg border border-electric-green/50 relative">
                <div className="absolute inset-0 bg-electric-green/10 rounded-lg animate-ping"></div>
                <Target className="w-8 h-8 text-electric-green relative z-10" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent">
                $200M ARR Target
              </h1>
            </div>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Strategic revenue growth trajectory powered by enterprise partnerships and AI intelligence platform
            </p>
            <Badge variant="outline" className="mt-4 border-electric-green/50 text-electric-green">
              Revenue Analytics - View Only
            </Badge>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {enterpriseMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <Card key={index} className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 text-center">
                  <CardContent className="p-4">
                    <IconComponent className="w-6 h-6 text-electric-green mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <div className="text-sm text-slate-400">{metric.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Revenue Milestones */}
          <Card className="mb-8 bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-green">
                <TrendingUp className="w-5 h-5" />
                Revenue Growth Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones.map((milestone, index) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case "achieved": return "text-electric-green";
                      case "in-progress": return "text-electric-blue";
                      case "projected": return "text-orange-400";
                      case "target": return "text-purple-400";
                      default: return "text-slate-400";
                    }
                  };
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Crown className={`w-5 h-5 ${getStatusColor(milestone.status)}`} />
                          <span className="text-white font-semibold">{milestone.target}</span>
                          <Badge variant="outline" className={`border-${milestone.status === 'achieved' ? 'electric-green' : milestone.status === 'in-progress' ? 'electric-blue' : 'slate-500'}/50 ${getStatusColor(milestone.status)}`}>
                            {milestone.timeline}
                          </Badge>
                        </div>
                        <span className={`${getStatusColor(milestone.status)} font-medium`}>
                          {milestone.percentage}%
                        </span>
                      </div>
                      <Progress 
                        value={milestone.percentage} 
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Streams */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {revenueStreams.map((stream, index) => {
              const IconComponent = stream.icon;
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
              const colors = getColorStyles(stream.color);
              
              return (
                <Card key={index} className={`bg-slate-800/60 backdrop-blur-sm border-2 ${colors.border} shadow-xl`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${stream.color}/20 rounded-lg border border-${stream.color}/50`}>
                          <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{stream.title}</CardTitle>
                          <p className="text-slate-400 text-sm mt-1">{stream.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${colors.badge} font-medium`}>
                        {stream.growth}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-white">{stream.value}</div>
                        <div className="text-sm text-slate-400">{stream.period}</div>
                      </div>
                      <TrendingUp className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Strategy Overview */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-electric-blue">
                  <Briefcase className="w-5 h-5" />
                  Growth Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Enterprise Focus</h3>
                  <p className="text-slate-300 text-sm">Target high-value enterprise clients with comprehensive AI intelligence solutions and long-term partnerships.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Platform Expansion</h3>
                  <p className="text-slate-300 text-sm">Scale FlutterAI intelligence capabilities across multiple industries and use cases.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Strategic Partnerships</h3>
                  <p className="text-slate-300 text-sm">Develop revenue-sharing partnerships with major blockchain and enterprise platforms.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-electric-green">
                  <BarChart3 className="w-5 h-5" />
                  Market Opportunity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Web3 Intelligence Market</h3>
                  <p className="text-slate-300 text-sm">$50B+ addressable market for blockchain analytics and enterprise AI solutions.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Enterprise AI Adoption</h3>
                  <p className="text-slate-300 text-sm">95% of Fortune 500 companies planning AI integration in next 24 months.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Competitive Advantage</h3>
                  <p className="text-slate-300 text-sm">First-mover advantage in Web3 marketing intelligence and tokenized communication.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Access Notice */}
          <div className="text-center">
            <Card className="bg-electric-green/10 border-electric-green/30 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <Target className="w-8 h-8 text-electric-green mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-electric-green mb-2">
                  Revenue Analytics Dashboard
                </h3>
                <p className="text-slate-300 text-sm">
                  This showcase demonstrates FlutterBye's revenue growth strategy and target metrics. Detailed financial analytics are available to enterprise stakeholders and investors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

// Import Brain icon
import { Brain } from "lucide-react";