/**
 * Government & Law Enforcement Sales Dashboard
 * Enterprise sales package for $100K+ monthly contracts
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  ShieldCheck, 
  Building, 
  FileText, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Globe, 
  Lock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Monitor,
  Target
} from 'lucide-react';

interface SalesAnalytics {
  totalProposals: number;
  activeDeals: number;
  averageContractValue: number;
  totalPipelineValue: number;
  winRate: number;
  averageSalesCycle: number;
  governmentSegment: {
    federal: { agencies: number; totalValue: number; averageContract: number };
    state: { agencies: number; totalValue: number; averageContract: number };
    local: { agencies: number; totalValue: number; averageContract: number };
    international: { agencies: number; totalValue: number; averageContract: number };
  };
  complianceStatus: Record<string, string>;
  recentWins: Array<{ agency: string; value: number; date: string }>;
}

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  certificationLevel: string;
  industryStandards: string[];
  auditFrequency: string;
}

interface GovernmentDemo {
  id: string;
  title: string;
  description: string;
  targetAgency: string;
  useCases: string[];
  estimatedContractValue: string;
}

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  results: string[];
  timeframe: string;
  agencies: string[];
}

export function GovernmentSalesDashboard() {
  const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics | null>(null);
  const [complianceFrameworks, setComplianceFrameworks] = useState<ComplianceFramework[]>([]);
  const [governmentDemos, setGovernmentDemos] = useState<GovernmentDemo[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const { toast } = useToast();

  // Form states
  const [newProposal, setNewProposal] = useState({
    agencyName: '',
    requirements: ''
  });
  const [newDemo, setNewDemo] = useState({
    agencyType: '',
    requirements: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [analyticsRes, frameworksRes, demosRes, studiesRes] = await Promise.all([
        apiRequest('GET', '/api/government/sales-analytics'),
        apiRequest('GET', '/api/government/compliance-frameworks'),
        apiRequest('GET', '/api/government/government-demos'),
        apiRequest('GET', '/api/government/case-studies')
      ]);

      const analytics = await analyticsRes.json();
      const frameworks = await frameworksRes.json();
      const demos = await demosRes.json();
      const studies = await studiesRes.json();

      setSalesAnalytics(analytics.analytics);
      setComplianceFrameworks(frameworks.frameworks || []);
      setGovernmentDemos(demos.demos || []);
      setCaseStudies(studies.caseStudies || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load government sales dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateProposal = async () => {
    try {
      if (!newProposal.agencyName) {
        toast({
          title: 'Error',
          description: 'Agency name is required',
          variant: 'destructive'
        });
        return;
      }

      const requirements = newProposal.requirements.split('\n').filter(req => req.trim());
      const response = await apiRequest('POST', '/api/government/generate-proposal', {
        agencyName: newProposal.agencyName,
        requirements
      });

      toast({
        title: 'Success',
        description: `Enterprise proposal generated for ${newProposal.agencyName}`,
      });

      setNewProposal({ agencyName: '', requirements: '' });
      loadDashboardData();
    } catch (error) {
      console.error('Error generating proposal:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate proposal',
        variant: 'destructive'
      });
    }
  };

  const createDemo = async () => {
    try {
      if (!newDemo.agencyType) {
        toast({
          title: 'Error',
          description: 'Agency type is required',
          variant: 'destructive'
        });
        return;
      }

      const requirements = newDemo.requirements.split('\n').filter(req => req.trim());
      const response = await apiRequest('POST', '/api/government/create-demo', {
        agencyType: newDemo.agencyType,
        requirements
      });

      toast({
        title: 'Success',
        description: `Government demo created for ${newDemo.agencyType}`,
      });

      setNewDemo({ agencyType: '', requirements: '' });
      loadDashboardData();
    } catch (error) {
      console.error('Error creating demo:', error);
      toast({
        title: 'Error',
        description: 'Failed to create demo',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Government & Law Enforcement Sales</h1>
          <p className="text-gray-400 mt-2">Enterprise sales package for $100K+ monthly contracts</p>
        </div>
        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
          <ShieldCheck className="w-4 h-4 mr-1" />
          FedRAMP Ready
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6 bg-slate-700/50 border border-red-500/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="law-enforcement">Law Enforcement</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="demos">Demos</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {salesAnalytics && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Total Pipeline</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      ${(salesAnalytics.totalPipelineValue / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-xs text-gray-400">
                      {salesAnalytics.activeDeals} active deals
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Avg Contract Value</CardTitle>
                    <Target className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      ${(salesAnalytics.averageContractValue / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-xs text-gray-400">
                      Annual recurring revenue
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Win Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{salesAnalytics.winRate}%</div>
                    <p className="text-xs text-gray-400">
                      {salesAnalytics.averageSalesCycle} day avg cycle
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Total Agencies</CardTitle>
                    <Building className="h-4 w-4 text-orange-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {Object.values(salesAnalytics.governmentSegment).reduce((sum, segment) => sum + segment.agencies, 0)}
                    </div>
                    <p className="text-xs text-gray-400">
                      Across all segments
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Government Segments */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Government Market Segments</CardTitle>
                  <CardDescription>Revenue breakdown by government sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(salesAnalytics.governmentSegment).map(([segment, data]) => (
                      <div key={segment} className="border border-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-white capitalize mb-2">{segment}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Agencies:</span>
                            <span className="text-white">{data.agencies}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Value:</span>
                            <span className="text-white">${(data.totalValue / 1000000).toFixed(1)}M</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Avg Contract:</span>
                            <span className="text-white">${(data.averageContract / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Wins */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Contract Wins</CardTitle>
                  <CardDescription>Latest successful government contracts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {salesAnalytics.recentWins.map((win, index) => (
                      <div key={index} className="flex items-center justify-between border border-gray-700 rounded-lg p-3">
                        <div>
                          <h4 className="font-semibold text-white">{win.agency}</h4>
                          <p className="text-gray-400 text-sm">{new Date(win.date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          ${(win.value / 1000000).toFixed(1)}M
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Status */}
          {salesAnalytics && (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Current Compliance Status</CardTitle>
                <CardDescription>Active certifications and compliance frameworks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(salesAnalytics.complianceStatus).map(([framework, status]) => (
                    <div key={framework} className="flex items-center space-x-2">
                      {status === 'Certified' || status === 'Compliant' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      )}
                      <div>
                        <p className="text-white font-medium">{framework.toUpperCase()}</p>
                        <p className="text-gray-400 text-sm">{status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compliance Frameworks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceFrameworks.map((framework) => (
              <Card key={framework.id} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{framework.name}</CardTitle>
                  <CardDescription>{framework.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-400">Certification Level</Label>
                      <Badge variant="secondary" className="ml-2">
                        {framework.certificationLevel}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-gray-400">Industry Standards</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {framework.industryStandards.map((standard, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {standard}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Key Requirements</Label>
                      <ul className="mt-1 space-y-1">
                        {framework.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demos" className="space-y-6">
          {/* Create New Demo */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Create Government Demo</CardTitle>
              <CardDescription>Generate custom demo environment for government agencies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agencyType" className="text-gray-400">Agency Type</Label>
                  <Input
                    id="agencyType"
                    value={newDemo.agencyType}
                    onChange={(e) => setNewDemo({ ...newDemo, agencyType: e.target.value })}
                    placeholder="e.g., Treasury, FBI, IRS"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="requirements" className="text-gray-400">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={newDemo.requirements}
                    onChange={(e) => setNewDemo({ ...newDemo, requirements: e.target.value })}
                    placeholder="Enter requirements (one per line)"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <Button onClick={createDemo} className="w-full">
                <Monitor className="w-4 h-4 mr-2" />
                Create Demo Environment
              </Button>
            </CardContent>
          </Card>

          {/* Available Demos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {governmentDemos.map((demo) => (
              <Card key={demo.id} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{demo.title}</CardTitle>
                  <CardDescription>{demo.targetAgency}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm">{demo.description}</p>
                    <div>
                      <Label className="text-gray-400">Use Cases</Label>
                      <ul className="mt-1 space-y-1">
                        {demo.useCases.slice(0, 3).map((useCase, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center">
                            <Eye className="w-3 h-3 text-blue-400 mr-2 flex-shrink-0" />
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        {demo.estimatedContractValue}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Monitor className="w-4 h-4 mr-2" />
                        Launch Demo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="case-studies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((study) => (
              <Card key={study.id} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{study.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {study.category.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary">{study.timeframe}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm">{study.description}</p>
                    <div>
                      <Label className="text-gray-400">Key Results</Label>
                      <ul className="mt-1 space-y-1">
                        {study.results.slice(0, 3).map((result, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label className="text-gray-400">Participating Agencies</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {study.agencies.map((agency, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {agency}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      View Full Case Study
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-6">
          {/* Generate New Proposal */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Generate Enterprise Proposal</CardTitle>
              <CardDescription>Create custom proposal for government agencies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agencyName" className="text-gray-400">Agency Name</Label>
                  <Input
                    id="agencyName"
                    value={newProposal.agencyName}
                    onChange={(e) => setNewProposal({ ...newProposal, agencyName: e.target.value })}
                    placeholder="e.g., Department of Treasury"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="proposalRequirements" className="text-gray-400">Requirements</Label>
                  <Textarea
                    id="proposalRequirements"
                    value={newProposal.requirements}
                    onChange={(e) => setNewProposal({ ...newProposal, requirements: e.target.value })}
                    placeholder="Enter requirements (one per line)"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <Button onClick={generateProposal} className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Generate Enterprise Proposal
              </Button>
            </CardContent>
          </Card>

          {/* Proposal Templates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Federal Template</CardTitle>
                <CardDescription>For federal government agencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contract Value:</span>
                    <span className="text-white">$2M-$10M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">3-5 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Compliance:</span>
                    <span className="text-white">FedRAMP High</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">State & Local Template</CardTitle>
                <CardDescription>For state and local governments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contract Value:</span>
                    <span className="text-white">$500K-$2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">2-3 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Compliance:</span>
                    <span className="text-white">SOC 2 Type II</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">International Template</CardTitle>
                <CardDescription>For international agencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contract Value:</span>
                    <span className="text-white">$1M-$5M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">3-4 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Compliance:</span>
                    <span className="text-white">GDPR + Local</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {salesAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Market Opportunity</CardTitle>
                  <CardDescription>Total addressable market analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">$12.5B</div>
                      <p className="text-gray-400">Total Market Size</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Federal:</span>
                        <span className="text-white">$8.7B</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">State & Local:</span>
                        <span className="text-white">$2.8B</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">International:</span>
                        <span className="text-white">$1.0B</span>
                      </div>
                    </div>
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        23.5% projected annual growth in government blockchain intelligence spending
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Sales Performance</CardTitle>
                  <CardDescription>Current sales metrics and KPIs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{salesAnalytics.winRate}%</div>
                      <p className="text-gray-400">Win Rate</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Deal Size:</span>
                        <span className="text-white">${(salesAnalytics.averageContractValue / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sales Cycle:</span>
                        <span className="text-white">{salesAnalytics.averageSalesCycle} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Deals:</span>
                        <span className="text-white">{salesAnalytics.activeDeals}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Forecast</CardTitle>
                  <CardDescription>12-month revenue projection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">$24.8M</div>
                      <p className="text-gray-400">Projected ARR</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Q1 Target:</span>
                        <span className="text-white">$4.2M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Q2 Target:</span>
                        <span className="text-white">$5.8M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Growth Rate:</span>
                        <span className="text-white">+34%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Law Enforcement Tools Tab */}
        <TabsContent value="law-enforcement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-700/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-red-400" />
                  OFAC Compliance Scanner
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time screening against OFAC sanctions lists
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-5 w-5 text-red-400" />
                    <span className="text-white font-semibold">Treasury Sanctions Screening</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">
                    Automated screening with 98% confidence rate
                  </p>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Target className="h-4 w-4 mr-2" />
                    Run OFAC Scan
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 p-3 rounded text-center">
                    <div className="text-red-400 text-sm">High Risk Wallets</div>
                    <div className="text-white text-xl font-bold">2,847</div>
                  </div>
                  <div className="bg-slate-800/30 p-3 rounded text-center">
                    <div className="text-red-400 text-sm">OFAC Matches</div>
                    <div className="text-white text-xl font-bold">143</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  AML Investigation Suite
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Advanced anti-money laundering detection and reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="h-5 w-5 text-red-400" />
                    <span className="text-white font-semibold">Suspicious Activity Detection</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">
                    Machine learning-powered AML analysis with SAR generation
                  </p>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Start Investigation
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 p-3 rounded text-center">
                    <div className="text-red-400 text-sm">Investigations</div>
                    <div className="text-white text-xl font-bold">1,247</div>
                  </div>
                  <div className="bg-slate-800/30 p-3 rounded text-center">
                    <div className="text-red-400 text-sm">SARs Generated</div>
                    <div className="text-white text-xl font-bold">89</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Law Enforcement Packages */}
          <Card className="bg-slate-700/50 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building className="h-5 w-5 text-red-400" />
                Enterprise Law Enforcement Packages
              </CardTitle>
              <CardDescription className="text-slate-400">
                Specialized packages for government agencies and law enforcement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { package: 'Law Enforcement Basic', agencies: '15 Agencies', price: '$200K/year' },
                  { package: 'Federal Investigation Suite', agencies: '8 Federal Agencies', price: '$500K/year' },
                  { package: 'International Compliance', agencies: '6 International Agencies', price: '$300K/year' },
                  { package: 'Enterprise Government', agencies: 'Unlimited Access', price: '$1M+/year' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{item.package}</div>
                      <div className="text-red-400 text-sm">{item.agencies}</div>
                    </div>
                    <Badge className="bg-red-600/20 text-red-300 border-red-500/20">
                      {item.price}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}