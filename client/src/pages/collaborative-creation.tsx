import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Users, Zap, Clock, Eye, Share2, TrendingUp } from 'lucide-react';

interface CollaborativeSession {
  sessionId: string;
  tokenData: {
    symbol: string;
    message: string;
    description?: string;
    value?: number;
  };
  collaborators: Array<{
    userId: string;
    walletAddress: string;
    joinedAt: string;
    isActive: boolean;
  }>;
  lockedFields: Record<string, string>;
  changeHistory: Array<{
    userId: string;
    field: string;
    oldValue: string;
    newValue: string;
    timestamp: string;
  }>;
  viralScore: number;
  viralPrediction: {
    potentialReach: number;
    viralProbability: number;
    predictedEngagement: number;
  };
}

export default function CollaborativeCreation() {
  const [sessionId, setSessionId] = useState<string>('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [tokenData, setTokenData] = useState({
    symbol: '',
    message: '',
    description: '',
    value: 0
  });
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  // Fetch collaborative metrics
  const { data: metrics } = useQuery({
    queryKey: ['/api/collaborative/metrics'],
    refetchInterval: 5000
  });

  // Fetch current session data
  const { data: sessionData, refetch: refetchSession } = useQuery<CollaborativeSession>({
    queryKey: ['/api/collaborative/session', sessionId],
    enabled: !!sessionId,
    refetchInterval: 2000
  });

  // Create new collaborative session
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/collaborative/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initialTokenData: tokenData
        })
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      setSessionId(data.sessionId || 'demo-session-' + Date.now());
      setIsCreatingSession(false);
      queryClient.invalidateQueries({ queryKey: ['/api/collaborative/metrics'] });
    }
  });

  // Join existing session
  const joinSessionMutation = useMutation({
    mutationFn: async (sessionToJoin: string) => {
      const response = await fetch(`/api/collaborative/join-session/${sessionToJoin}`, {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/collaborative/session', sessionId] });
    }
  });

  // Update token data
  const updateTokenMutation = useMutation({
    mutationFn: async (updates: Partial<typeof tokenData>) => {
      // Track viral interactions
      await fetch('/api/viral/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: sessionId,
          userId: 'current-user',
          interactionType: 'edit'
        })
      });

      const response = await fetch(`/api/collaborative/update-token/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return response.json();
    },
    onSuccess: () => {
      refetchSession();
    }
  });

  // WebSocket connection for real-time collaboration
  useEffect(() => {
    if (sessionId) {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('Connected to collaborative WebSocket');
        socket.send(JSON.stringify({
          type: 'join_session',
          sessionId: sessionId
        }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'user_joined':
            setConnectedUsers(prev => [...prev, data.userId]);
            break;
          case 'user_left':
            setConnectedUsers(prev => prev.filter(id => id !== data.userId));
            break;
          case 'token_updated':
            setTokenData(data.tokenData);
            refetchSession();
            break;
          case 'field_locked':
          case 'field_unlocked':
            refetchSession();
            break;
        }
      };

      socket.onclose = () => {
        console.log('Disconnected from collaborative WebSocket');
      };

      setWs(socket);

      return () => {
        socket.close();
      };
    }
  }, [sessionId, refetchSession]);

  const handleCreateSession = () => {
    setIsCreatingSession(true);
    createSessionMutation.mutate();
  };

  const handleJoinSession = () => {
    if (sessionId) {
      joinSessionMutation.mutate(sessionId);
    }
  };

  const handleTokenUpdate = (field: string, value: string | number) => {
    const updates = { [field]: value };
    setTokenData(prev => ({ ...prev, ...updates }));
    updateTokenMutation.mutate(updates);
  };

  const isFieldLocked = (field: string) => {
    return sessionData?.lockedFields[field] && sessionData?.lockedFields[field] !== 'current-user';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Real-Time Collaborative Token Creation
          </h1>
          <p className="text-blue-200">
            Create tokens together with live collaboration and viral acceleration
          </p>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-300">Active Sessions</p>
                  <p className="text-2xl font-bold text-white">{(metrics as any)?.activeSessions || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-slate-300">Active Collaborators</p>
                  <p className="text-2xl font-bold text-white">{(metrics as any)?.activeCollaborators || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm text-slate-300">Changes Made</p>
                  <p className="text-2xl font-bold text-white">{(metrics as any)?.totalChangesMade || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Create New Session */}
          <Card className="bg-slate-800/50 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-400" />
                Create New Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Token Symbol</label>
                <Input
                  value={tokenData.symbol}
                  onChange={(e) => setTokenData(prev => ({ ...prev, symbol: e.target.value }))}
                  placeholder="FLBY-MSG-001"
                  className="bg-slate-700 border-slate-600 text-white"
                  maxLength={27}
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Message</label>
                <Textarea
                  value={tokenData.message}
                  onChange={(e) => setTokenData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Your collaborative message..."
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Initial Value (SOL)</label>
                <Input
                  type="number"
                  value={tokenData.value}
                  onChange={(e) => setTokenData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.001"
                  className="bg-slate-700 border-slate-600 text-white"
                  step="0.001"
                  min="0"
                />
              </div>
              <Button 
                onClick={handleCreateSession}
                disabled={isCreatingSession || !tokenData.symbol || !tokenData.message}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isCreatingSession ? 'Creating...' : 'Create Collaborative Session'}
              </Button>
            </CardContent>
          </Card>

          {/* Join Existing Session */}
          <Card className="bg-slate-800/50 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                Join Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Session ID</label>
                <Input
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter session ID..."
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button 
                onClick={handleJoinSession}
                disabled={!sessionId}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Join Session
              </Button>
              
              {sessionData && (
                <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Session: {sessionId}</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Users className="h-4 w-4" />
                    {sessionData.collaborators.length} collaborators
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Collaborative Editor */}
        {sessionData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Token Editor */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-purple-400" />
                    Collaborative Token Editor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Token Symbol</label>
                    <Input
                      value={sessionData.tokenData.symbol}
                      onChange={(e) => handleTokenUpdate('symbol', e.target.value)}
                      disabled={!!isFieldLocked('symbol')}
                      className={`bg-slate-700 border-slate-600 text-white ${
                        isFieldLocked('symbol') ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      maxLength={27}
                    />
                    {isFieldLocked('symbol') && (
                      <p className="text-xs text-orange-400 mt-1">
                        Locked by {sessionData.lockedFields.symbol}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Message</label>
                    <Textarea
                      value={sessionData.tokenData.message}
                      onChange={(e) => handleTokenUpdate('message', e.target.value)}
                      disabled={!!isFieldLocked('message')}
                      className={`bg-slate-700 border-slate-600 text-white ${
                        isFieldLocked('message') ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      rows={4}
                    />
                    {isFieldLocked('message') && (
                      <p className="text-xs text-orange-400 mt-1">
                        Locked by {sessionData.lockedFields.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Value (SOL)</label>
                    <Input
                      type="number"
                      value={sessionData.tokenData.value || 0}
                      onChange={(e) => handleTokenUpdate('value', parseFloat(e.target.value) || 0)}
                      disabled={!!isFieldLocked('value')}
                      className={`bg-slate-700 border-slate-600 text-white ${
                        isFieldLocked('value') ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      step="0.001"
                      min="0"
                    />
                  </div>

                  {/* Viral Score Display */}
                  <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">Viral Potential</h4>
                      <Badge variant="outline" className="border-purple-400 text-purple-400">
                        Score: {sessionData.viralScore}/100
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Potential Reach</p>
                        <p className="text-white font-medium">
                          {sessionData.viralPrediction.potentialReach.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Viral Probability</p>
                        <p className="text-white font-medium">
                          {(sessionData.viralPrediction.viralProbability * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Predicted Engagement</p>
                        <p className="text-white font-medium">
                          {sessionData.viralPrediction.predictedEngagement.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collaborators & Activity */}
            <div className="space-y-6">
              
              {/* Active Collaborators */}
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-400" />
                    Active Collaborators ({sessionData.collaborators.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {sessionData.collaborators.map((collaborator, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded bg-slate-700/30">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-green-600">
                              {collaborator.walletAddress.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">
                              {collaborator.walletAddress.slice(0, 8)}...
                            </p>
                            <p className="text-xs text-slate-400">
                              {collaborator.isActive ? 'Active' : 'Away'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Change History */}
              <Card className="bg-slate-800/50 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-400" />
                    Recent Changes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-40">
                    <div className="space-y-2">
                      {sessionData.changeHistory.slice(-10).reverse().map((change, index) => (
                        <div key={index} className="p-2 rounded bg-slate-700/30 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-orange-400 font-medium">{change.field}</span>
                            <span className="text-slate-400">
                              {new Date(change.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-slate-300">
                            {change.userId.slice(0, 8)}... changed from "{change.oldValue}" to "{change.newValue}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}