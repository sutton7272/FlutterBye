import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Globe, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  DollarSign,
  Search,
  FileText,
  Eye,
  BarChart3,
  Lock,
  Zap
} from "lucide-react";

export default function EnterpriseDashboard() {
  const [searchAddress, setSearchAddress] = useState("");
  const [selectedChain, setSelectedChain] = useState("ethereum");

  // Enterprise dashboard metrics
  const { data: dashboardMetrics } = useQuery({
    queryKey: ["/api/enterprise/dashboard-metrics"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Supported chains
  const { data: supportedChains } = useQuery({
    queryKey: ["/api/enterprise/cross-chain/supported-chains"]
  });

  const handleUniversalAnalysis = async () => {
    if (!searchAddress) return;
    
    // This would trigger cross-chain analysis
    console.log(`Analyzing ${searchAddress} on ${selectedChain}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Enterprise Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              FlutterAI Enterprise Intelligence
            </h1>
            <p className="text-blue-200 text-lg">
              Cross-Chain Intelligence • Compliance Automation • Government Solutions
            </p>
          </div>
          <div className="text-right">
            <div className="text-green-400 text-2xl font-bold">$275K</div>
            <div className="text-blue-200">Avg Contract Value</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-900/50 border-blue-400/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Cross-Chain Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {dashboardMetrics?.metrics?.crossChainIntelligence?.toLocaleString() || "487,293"}
            </div>
            <div className="text-blue-200 text-sm">Wallets Analyzed</div>
          </CardContent>
        </Card>

        <Card className="bg-green-900/50 border-green-400/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              Compliance Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {dashboardMetrics?.metrics?.complianceChecks?.toLocaleString() || "89,247"}
            </div>
            <div className="text-green-200 text-sm">This Month</div>
          </CardContent>
        </Card>

        <Card className="bg-red-900/50 border-red-400/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              High Risk Identified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">
              {dashboardMetrics?.metrics?.highRiskIdentified?.toLocaleString() || "3,842"}
            </div>
            <div className="text-red-200 text-sm">Requiring Action</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-900/50 border-yellow-400/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-yellow-400" />
              Active Investigations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {dashboardMetrics?.metrics?.activeInvestigations || "23"}
            </div>
            <div className="text-yellow-200 text-sm">Law Enforcement</div>
          </CardContent>
        </Card>
      </div>

      {/* Universal Wallet Analysis */}
      <Card className="mb-8 bg-slate-800/50 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-400" />
            Universal Cross-Chain Wallet Intelligence
          </CardTitle>
          <CardDescription className="text-slate-300">
            Analyze wallets across all supported blockchain networks with enterprise-grade intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Enter wallet address (any supported chain)"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1 bg-slate-700 border-slate-600 text-white"
            />
            <select 
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            >
              <option value="ethereum">Ethereum</option>
              <option value="bitcoin">Bitcoin</option>
              <option value="solana">Solana</option>
              <option value="polygon">Polygon</option>
              <option value="bsc">BSC</option>
            </select>
            <Button 
              onClick={handleUniversalAnalysis}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Analyze
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {supportedChains?.supportedChains?.map((chain: string) => (
              <Badge 
                key={chain} 
                variant="outline" 
                className="border-blue-400/50 text-blue-300 justify-center py-2"
              >
                {chain.toUpperCase()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="intelligence" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="intelligence" className="data-[state=active]:bg-blue-600">
            Intelligence
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-green-600">
            Compliance
          </TabsTrigger>
          <TabsTrigger value="investigations" className="data-[state=active]:bg-yellow-600">
            Investigations
          </TabsTrigger>
          <TabsTrigger value="enterprise" className="data-[state=active]:bg-purple-600">
            Enterprise
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Cross-Chain Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white">Supported Blockchain Networks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Ethereum", capabilities: ["DeFi", "NFTs", "Staking"], status: "Active" },
                    { name: "Bitcoin", capabilities: ["UTXO Analysis"], status: "Active" },
                    { name: "Solana", capabilities: ["DeFi", "NFTs", "SPL Tokens"], status: "Active" },
                    { name: "Polygon", capabilities: ["L2 Scaling", "DeFi"], status: "Beta" },
                    { name: "BSC", capabilities: ["DeFi", "Yield Farming"], status: "Beta" }
                  ].map((chain) => (
                    <div key={chain.name} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{chain.name}</div>
                        <div className="text-slate-400 text-sm">
                          {chain.capabilities.join(", ")}
                        </div>
                      </div>
                      <Badge variant={chain.status === "Active" ? "default" : "secondary"}>
                        {chain.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white">Real-Time Intelligence Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { 
                      type: "High Value Transfer", 
                      details: "$5.2M to high-risk jurisdiction", 
                      severity: "critical",
                      time: "2 min ago"
                    },
                    { 
                      type: "Sanctions Match", 
                      details: "Address on OFAC list detected", 
                      severity: "critical",
                      time: "15 min ago"
                    },
                    { 
                      type: "Pattern Detection", 
                      details: "Money laundering scheme identified", 
                      severity: "high",
                      time: "32 min ago"
                    },
                    { 
                      type: "Cross-Chain Movement", 
                      details: "Large funds moved via bridge", 
                      severity: "medium",
                      time: "1 hour ago"
                    }
                  ].map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{alert.type}</div>
                        <div className="text-slate-400 text-sm">{alert.details}</div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            alert.severity === "critical" ? "destructive" :
                            alert.severity === "high" ? "default" : "secondary"
                          }
                        >
                          {alert.severity}
                        </Badge>
                        <div className="text-slate-400 text-xs mt-1">{alert.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  OFAC Screening
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">99.97%</div>
                  <div className="text-slate-300 mb-4">Clean Rate</div>
                  <Progress value={99.97} className="mb-4" />
                  <div className="text-sm text-slate-400">
                    47 sanctioned addresses blocked this month
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  AML Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Low Risk</span>
                    <span className="text-green-400">78,423</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Medium Risk</span>
                    <span className="text-yellow-400">8,947</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">High Risk</span>
                    <span className="text-red-400">1,877</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Critical</span>
                    <span className="text-red-500">247</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-400" />
                  GDPR Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                  <div className="text-slate-300 mb-4">Compliant</div>
                  <div className="text-sm text-slate-400 space-y-1">
                    <div>✓ Data Processing Records</div>
                    <div>✓ User Consent Tracking</div>
                    <div>✓ Data Retention Policies</div>
                    <div>✓ Portability Procedures</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Investigations Tab */}
        <TabsContent value="investigations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white">Active Investigation Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: "INV_001", title: "Operation Digital Trace", type: "Money Laundering", priority: "Critical", value: "$2.5M" },
                    { id: "INV_002", title: "Ransomware Network", type: "Cybercrime", priority: "High", value: "$890K" },
                    { id: "INV_003", title: "Sanctions Evasion", type: "Regulatory", priority: "High", value: "$1.2M" },
                    { id: "INV_004", title: "Drug Trafficking Ring", type: "Criminal", priority: "Medium", value: "$450K" }
                  ].map((case_) => (
                    <div key={case_.id} className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white font-medium">{case_.title}</div>
                          <div className="text-slate-400 text-sm">{case_.id} • {case_.type}</div>
                        </div>
                        <Badge 
                          variant={
                            case_.priority === "Critical" ? "destructive" :
                            case_.priority === "High" ? "default" : "secondary"
                          }
                        >
                          {case_.priority}
                        </Badge>
                      </div>
                      <div className="text-green-400 font-bold">{case_.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white">Illicit Pattern Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { pattern: "Money Laundering Layering", detected: 15, risk: 85 },
                    { pattern: "Ransomware Payments", detected: 8, risk: 95 },
                    { pattern: "Sanctions Evasion", detected: 3, risk: 90 },
                    { pattern: "Drug Trafficking", detected: 12, risk: 80 },
                    { pattern: "Terrorism Financing", detected: 1, risk: 100 }
                  ].map((pattern) => (
                    <div key={pattern.pattern} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white text-sm">{pattern.pattern}</span>
                        <span className="text-slate-400 text-sm">{pattern.detected} detected</span>
                      </div>
                      <Progress value={pattern.risk} className="h-2" />
                      <div className="text-xs text-slate-400">Risk Weight: {pattern.risk}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Enterprise Tab */}
        <TabsContent value="enterprise" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Enterprise Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">47</div>
                  <div className="text-slate-300 mb-2">Active Clients</div>
                  <div className="text-sm text-green-400">+8 this quarter</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Revenue Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">$12.9M</div>
                  <div className="text-slate-300 mb-2">Annual ARR</div>
                  <div className="text-sm text-green-400">+35% YoY</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Client Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
                  <div className="text-slate-300 mb-2">Satisfaction Rate</div>
                  <div className="text-sm text-purple-400">Industry Leading</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-400" />
                Enterprise Intelligence Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Zap className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Advanced Analytics Dashboard
                </h3>
                <p className="text-slate-400 mb-6">
                  Coming soon: Real-time analytics, predictive intelligence, and custom reporting
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                  Request Early Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}