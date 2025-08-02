import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Vote, 
  Users, 
  TrendingUp, 
  Clock, 
  Shield, 
  Target,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus
} from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: 'platform' | 'tokenomics' | 'features' | 'partnerships' | 'governance';
  status: 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  endDate: string;
  createdBy: string;
  votingPower: number;
  hasVoted: boolean;
  userVote?: 'for' | 'against';
}

interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  totalVoters: number;
  userVotingPower: number;
  participationRate: number;
}

export default function FlbyGovernance() {
  const [newProposalTitle, setNewProposalTitle] = useState("");
  const [newProposalDescription, setNewProposalDescription] = useState("");
  const [newProposalCategory, setNewProposalCategory] = useState("platform");
  const { toast } = useToast();

  // Mock data for governance (will be real API calls post-launch)
  const mockProposals: Proposal[] = [
    {
      id: "prop-001",
      title: "Reduce Platform Fees by 20%",
      description: "Proposal to reduce minting and transaction fees by 20% to increase platform adoption and user engagement.",
      category: "tokenomics",
      status: "active",
      votesFor: 75420,
      votesAgainst: 12380,
      totalVotes: 87800,
      quorum: 100000,
      endDate: "2024-02-15",
      createdBy: "Community",
      votingPower: 0,
      hasVoted: false
    },
    {
      id: "prop-002", 
      title: "Implement Cross-Chain Bridge",
      description: "Add support for Ethereum and Polygon bridges to enable cross-chain FLBY token transfers and expand the platform reach.",
      category: "features",
      status: "active",
      votesFor: 120500,
      votesAgainst: 45200,
      totalVotes: 165700,
      quorum: 100000,
      endDate: "2024-02-20",
      createdBy: "Core Team",
      votingPower: 0,
      hasVoted: false
    },
    {
      id: "prop-003",
      title: "Partnership with Major DEX",
      description: "Establish strategic partnership with Jupiter Exchange for enhanced liquidity and trading features.",
      category: "partnerships",
      status: "passed",
      votesFor: 245600,
      votesAgainst: 34500,
      totalVotes: 280100,
      quorum: 100000,
      endDate: "2024-01-30",
      createdBy: "Governance Council",
      votingPower: 0,
      hasVoted: true,
      userVote: "for"
    }
  ];

  const mockStats: GovernanceStats = {
    totalProposals: 15,
    activeProposals: 3,
    totalVoters: 8420,
    userVotingPower: 0,
    participationRate: 67.8
  };

  const voteMutation = useMutation({
    mutationFn: async (data: { proposalId: string; vote: 'for' | 'against' }) => {
      return apiRequest(`/api/flby/governance/vote`, {
        method: "POST",
        body: data
      });
    },
    onSuccess: () => {
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Feature Coming Soon",
        description: "FLBY governance will be available after token launch in Q2 2024.",
        variant: "destructive"
      });
    }
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; category: string }) => {
      return apiRequest(`/api/flby/governance/proposals`, {
        method: "POST",
        body: data
      });
    },
    onSuccess: () => {
      toast({
        title: "Proposal Created",
        description: "Your proposal has been submitted for community review!"
      });
      setNewProposalTitle("");
      setNewProposalDescription("");
      setNewProposalCategory("platform");
    },
    onError: () => {
      toast({
        title: "Feature Coming Soon",
        description: "Proposal creation will be available after token launch.",
        variant: "destructive"
      });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'executed':
        return <Target className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'platform':
        return 'bg-blue-500/20 text-blue-400';
      case 'tokenomics':
        return 'bg-green-500/20 text-green-400';
      case 'features':
        return 'bg-purple-500/20 text-purple-400';
      case 'partnerships':
        return 'bg-orange-500/20 text-orange-400';
      case 'governance':
        return 'bg-pink-500/20 text-pink-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Electric Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              FLBY Governance
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Shape the future of Flutterbye through decentralized governance. Vote on proposals and create change.
          </p>
          <Badge variant="secondary" className="mt-4 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            Coming Soon - Q2 2024
          </Badge>
        </div>

        {/* Governance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm text-muted-foreground">Total Proposals</p>
              <p className="text-xl font-bold">{mockStats.totalProposals}</p>
            </CardContent>
          </Card>
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-orange-400" />
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-xl font-bold">{mockStats.activeProposals}</p>
            </CardContent>
          </Card>
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-sm text-muted-foreground">Total Voters</p>
              <p className="text-xl font-bold">{mockStats.totalVoters.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <Vote className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-sm text-muted-foreground">My Voting Power</p>
              <p className="text-xl font-bold">{mockStats.userVotingPower.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="electric-frame">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <p className="text-sm text-muted-foreground">Participation</p>
              <p className="text-xl font-bold">{mockStats.participationRate}%</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="proposals" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="proposals">Active Proposals</TabsTrigger>
            <TabsTrigger value="create">Create Proposal</TabsTrigger>
            <TabsTrigger value="history">Voting History</TabsTrigger>
          </TabsList>

          {/* Active Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <div className="space-y-6">
              {mockProposals.map((proposal) => (
                <Card key={proposal.id} className="electric-frame">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(proposal.status)}
                          <h3 className="text-lg font-semibold text-gradient">{proposal.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(proposal.category)}>
                            {proposal.category.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {proposal.status.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            by {proposal.createdBy}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="w-3 h-3" />
                          Ends {proposal.endDate}
                        </div>
                        <div>Quorum: {((proposal.totalVotes / proposal.quorum) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{proposal.description}</p>
                    
                    {/* Voting Progress */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Support: {((proposal.votesFor / proposal.totalVotes) * 100).toFixed(1)}%</span>
                        <span>{proposal.totalVotes.toLocaleString()} total votes</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-green-400">For: {proposal.votesFor.toLocaleString()}</span>
                          <span className="text-red-400">Against: {proposal.votesAgainst.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(proposal.votesFor / proposal.totalVotes) * 100} 
                          className="h-2"
                        />
                      </div>
                      <Progress 
                        value={(proposal.totalVotes / proposal.quorum) * 100} 
                        className="h-1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Quorum progress: {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()}
                      </p>
                    </div>

                    {/* Voting Buttons */}
                    {proposal.status === 'active' && (
                      <div className="flex gap-4 pt-4">
                        {!proposal.hasVoted ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-green-500/50 text-green-400 hover:bg-green-500/10"
                              onClick={() => voteMutation.mutate({ proposalId: proposal.id, vote: 'for' })}
                              disabled={voteMutation.isPending}
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              Vote For
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                              onClick={() => voteMutation.mutate({ proposalId: proposal.id, vote: 'against' })}
                              disabled={voteMutation.isPending}
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              Vote Against
                            </Button>
                          </>
                        ) : (
                          <Badge variant="secondary" className="px-4 py-2">
                            You voted: {proposal.userVote?.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create Proposal Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Create New Proposal</CardTitle>
                <p className="text-muted-foreground">
                  Submit a proposal for the community to vote on. Requires minimum staking power to create.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Proposal Title</Label>
                    <Input
                      value={newProposalTitle}
                      onChange={(e) => setNewProposalTitle(e.target.value)}
                      placeholder="Enter a clear, descriptive title"
                      className="pulse-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                      value={newProposalCategory}
                      onChange={(e) => setNewProposalCategory(e.target.value)}
                      className="w-full p-2 rounded-md bg-background border border-input pulse-border"
                    >
                      <option value="platform">Platform Improvements</option>
                      <option value="tokenomics">Tokenomics Changes</option>
                      <option value="features">New Features</option>
                      <option value="partnerships">Partnerships</option>
                      <option value="governance">Governance Updates</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newProposalDescription}
                      onChange={(e) => setNewProposalDescription(e.target.value)}
                      placeholder="Provide a detailed description of your proposal, including rationale and expected impact..."
                      rows={6}
                      className="pulse-border"
                    />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                    Proposal Requirements
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Minimum 10,000 FLBY staked to create proposals</li>
                    <li>• Proposals must be relevant to platform governance</li>
                    <li>• Community review period of 48 hours before voting begins</li>
                    <li>• Voting period lasts 7 days from activation</li>
                  </ul>
                </div>

                <Button
                  onClick={() => {
                    if (newProposalTitle && newProposalDescription) {
                      createProposalMutation.mutate({
                        title: newProposalTitle,
                        description: newProposalDescription,
                        category: newProposalCategory
                      });
                    }
                  }}
                  disabled={!newProposalTitle || !newProposalDescription || createProposalMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {createProposalMutation.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Creating Proposal...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Proposal
                    </>
                  )}
                </Button>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    <strong>Coming Soon:</strong> Governance features will be available after FLBY token launch in Q2 2024.
                    Stake FLBY tokens to gain voting power and proposal creation rights!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voting History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="electric-frame">
              <CardHeader>
                <CardTitle className="text-gradient">Your Voting History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Vote className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Voting History</h3>
                  <p className="text-muted-foreground mb-4">
                    Start participating in governance by voting on active proposals!
                  </p>
                  <Badge variant="secondary">
                    Available after FLBY token launch
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}