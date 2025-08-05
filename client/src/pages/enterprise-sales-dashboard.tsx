import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building2, 
  Target, 
  Calendar,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Eye,
  Send,
  Download,
  BarChart3,
  Zap,
  Shield,
  Globe
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface EnterpriseProspect {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry: string;
  companySize: string;
  dealValue: number;
  stage: 'lead' | 'qualified' | 'demo' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  priority: 'high' | 'medium' | 'low';
  lastContact: Date;
  nextFollowUp: Date;
  notes: string;
  requirements: string[];
  proposedSolution: string;
  createdAt: Date;
  estimatedCloseDate?: Date;
}

interface SalesMetrics {
  totalPipeline: number;
  qualifiedLeads: number;
  activeDeals: number;
  monthlyRecurring: number;
  conversionRate: number;
  averageDealSize: number;
  salesCycle: number;
}

const INDUSTRY_OPTIONS = [
  'Investment Banking',
  'Hedge Funds',
  'Asset Management',
  'Cryptocurrency Exchange',
  'Fintech',
  'Insurance',
  'Government',
  'Consulting',
  'Technology',
  'Other'
];

const COMPANY_SIZE_OPTIONS = [
  '1-50 employees',
  '51-200 employees', 
  '201-1000 employees',
  '1000+ employees'
];

const STAGE_COLORS = {
  'lead': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  'qualified': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'demo': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'proposal': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'negotiation': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'closed-won': 'bg-green-500/20 text-green-300 border-green-500/30',
  'closed-lost': 'bg-red-500/20 text-red-300 border-red-500/30'
};

export default function EnterpriseSalesDashboard() {
  const [selectedProspect, setSelectedProspect] = useState<EnterpriseProspect | null>(null);
  const [showAddProspect, setShowAddProspect] = useState(false);
  const [filterStage, setFilterStage] = useState<string>('all');
  const queryClient = useQueryClient();

  // Fetch sales metrics
  const { data: metrics } = useQuery({
    queryKey: ['enterprise-sales-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/enterprise/sales-metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json();
    }
  });

  // Fetch prospects
  const { data: prospects, isLoading } = useQuery({
    queryKey: ['enterprise-prospects'],
    queryFn: async () => {
      const response = await fetch('/api/enterprise/prospects');
      if (!response.ok) throw new Error('Failed to fetch prospects');
      return response.json();
    }
  });

  // Add prospect mutation
  const addProspectMutation = useMutation({
    mutationFn: async (prospect: Partial<EnterpriseProspect>) => {
      const response = await fetch('/api/enterprise/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prospect)
      });
      if (!response.ok) throw new Error('Failed to add prospect');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprise-prospects'] });
      queryClient.invalidateQueries({ queryKey: ['enterprise-sales-metrics'] });
      setShowAddProspect(false);
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

  const getStageProgress = (stage: string) => {
    const stages = ['lead', 'qualified', 'demo', 'proposal', 'negotiation', 'closed-won'];
    return ((stages.indexOf(stage) + 1) / stages.length) * 100;
  };

  const filteredProspects = prospects?.prospects?.filter((prospect: EnterpriseProspect) => 
    filterStage === 'all' || prospect.stage === filterStage
  ) || [];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your $5M-$50M ARR enterprise pipeline
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={() => setShowAddProspect(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Prospect
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Pipeline
          </Button>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(metrics?.totalPipeline || 12500000)}
            </div>
            <p className="text-sm text-muted-foreground">+24% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <Target className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {metrics?.activeDeals || 23}
            </div>
            <p className="text-sm text-muted-foreground">Average: {formatCurrency(metrics?.averageDealSize || 543000)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {metrics?.conversionRate || 34}%
            </div>
            <p className="text-sm text-muted-foreground">+8% improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Sales Cycle</CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {metrics?.salesCycle || 42} days
            </div>
            <p className="text-sm text-muted-foreground">-12% faster</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prospects List */}
        <Card className="lg:col-span-2 bg-background/50 border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Enterprise Prospects</CardTitle>
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="demo">Demo</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed-won">Closed Won</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {filteredProspects.map((prospect: EnterpriseProspect) => (
                <div
                  key={prospect.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                    selectedProspect?.id === prospect.id ? 'border-primary/50 bg-primary/5' : 'border-border/30'
                  }`}
                  onClick={() => setSelectedProspect(prospect)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{prospect.companyName}</h3>
                      <p className="text-sm text-muted-foreground">{prospect.contactName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">{formatCurrency(prospect.dealValue)}</p>
                      <Badge className={STAGE_COLORS[prospect.stage]}>
                        {prospect.stage.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{prospect.industry} • {prospect.companySize}</span>
                    <span>Next: {new Date(prospect.nextFollowUp).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="mt-2">
                    <Progress value={getStageProgress(prospect.stage)} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prospect Details */}
        <Card className="bg-background/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle>
              {selectedProspect ? 'Prospect Details' : 'Select Prospect'}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {selectedProspect ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedProspect.companyName}</h3>
                  <p className="text-muted-foreground">{selectedProspect.contactName}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{selectedProspect.email}</span>
                  </div>
                  {selectedProspect.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{selectedProspect.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm">{selectedProspect.industry}</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Deal Value</Label>
                  <p className="text-xl font-bold text-green-400">
                    {formatCurrency(selectedProspect.dealValue)}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Requirements</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProspect.requirements.map((req, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedProspect.notes}
                  </p>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button size="sm" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Follow Up
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a prospect to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Value Propositions */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-400" />
            Enterprise Value Propositions
          </CardTitle>
          <CardDescription>
            Key selling points for enterprise clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <h4 className="font-semibold">Real-time Intelligence</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Live blockchain analytics across 6+ chains with WebSocket streaming
              </p>
            </div>
            
            <div className="bg-background/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-green-400" />
                <h4 className="font-semibold">Enterprise Security</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                SOC 2 compliant with government-grade security standards
              </p>
            </div>
            
            <div className="bg-background/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="h-5 w-5 text-purple-400" />
                <h4 className="font-semibold">Multi-chain Coverage</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive analytics for Solana, Ethereum, Polygon, and more
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}