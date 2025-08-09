import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import {
  Activity,
  Zap,
  AlertTriangle,
  TrendingUp,
  Wifi,
  WifiOff,
  Bell,
  Target,
  BarChart3,
  Users,
  DollarSign,
  Shield,
  ArrowUp,
  ArrowDown,
  Pause,
  Play,
  Settings
} from "lucide-react";

interface RealTimeEvent {
  eventId: string;
  walletAddress: string;
  eventType: 'transaction' | 'score_change' | 'risk_update' | 'new_analysis' | 'anomaly_detected';
  timestamp: Date;
  data: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: {
    source: string;
    confidence: number;
    impact: string;
  };
}

interface StreamingAnalytics {
  walletAddress: string;
  realTimeScore: number;
  scoreChanges: Array<{
    timestamp: Date;
    oldScore: number;
    newScore: number;
    reason: string;
  }>;
  liveActivity: {
    transactionCount: number;
    volumeChange: number;
    behaviorShift: string;
    riskIndicators: string[];
  };
  predictions: {
    scoreDirection: 'increasing' | 'decreasing' | 'stable';
    confidenceLevel: number;
    nextUpdateETA: Date;
  };
}

interface AnomalyAlert {
  anomalyId: string;
  walletAddress: string;
  anomalyType: 'unusual_volume' | 'behavior_change' | 'risk_spike' | 'pattern_deviation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  confidence: number;
  suggestedActions: string[];
}

export default function RealTimeIntelligenceDashboard() {
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [streamingData, setStreamingData] = useState<StreamingAnalytics[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [alertSettings, setAlertSettings] = useState({
    scoreThreshold: 100,
    riskLevelChange: true,
    volumeThreshold: 10000,
    behaviorAnomalies: true,
    marketCorrelations: true
  });

  // WebSocket connection
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    connectWebSocket();
    return () => {
      isMountedRef.current = false;
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/intelligence`;
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        if (!isMountedRef.current) {
          wsRef.current?.close();
          return;
        }
        setIsConnected(true);
        setIsStreaming(true);
        toast({
          title: "Real-time Intelligence Connected",
          description: "Now streaming live wallet intelligence data",
          variant: "default",
        });
      };
      
      wsRef.current.onmessage = (event) => {
        if (!isMountedRef.current) return;
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      wsRef.current.onclose = (event) => {
        if (!isMountedRef.current) return;
        setIsConnected(false);
        setIsStreaming(false);
        
        // Only reconnect if not intentionally closed and component is still mounted
        if (event.code !== 1000 && isMountedRef.current) {
          setTimeout(() => {
            if (isMountedRef.current) {
              connectWebSocket();
            }
          }, 5000); // Reconnect after 5 seconds
        }
      };
      
      wsRef.current.onerror = (error) => {
        if (!isMountedRef.current) return;
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setIsStreaming(false);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'real_time_event':
        setEvents(prev => [message.event, ...prev.slice(0, 99)]); // Keep last 100 events
        
        // Add anomalies if present
        if (message.anomalies && message.anomalies.length > 0) {
          setAnomalies(prev => [...message.anomalies, ...prev.slice(0, 49)]);
        }
        break;
        
      case 'streaming_analytics':
        setStreamingData(prev => {
          const updated = prev.filter(s => s.walletAddress !== message.data.walletAddress);
          return [message.data, ...updated.slice(0, 9)]; // Keep last 10 wallets
        });
        break;
        
      case 'alert':
        toast({
          title: `Alert: ${message.data.name}`,
          description: message.data.event.metadata.impact,
          variant: message.data.event.severity === 'critical' ? "destructive" : "default",
        });
        break;
        
      case 'initial_state':
        console.log('Connected to real-time intelligence:', message.data);
        break;
    }
  };

  // Configure alerts mutation
  const configureAlertsMutation = useMutation({
    mutationFn: async (config: any) => {
      return await apiRequest('POST', '/api/flutterai/enterprise/real-time/configure-alerts', config);
    },
    onSuccess: () => {
      toast({
        title: "Alerts Configured",
        description: "Real-time alert settings updated successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to configure alerts",
        variant: "destructive",
      });
    },
  });

  const subscribeToWallet = (walletAddress: string) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe_wallet',
        walletAddress
      }));
      
      toast({
        title: "Wallet Subscribed",
        description: `Now monitoring ${walletAddress}`,
        variant: "default",
      });
    }
  };

  const toggleStreaming = () => {
    if (isStreaming) {
      if (wsRef.current) {
        wsRef.current.close();
      }
      setIsStreaming(false);
    } else {
      connectWebSocket();
    }
  };

  const handleConfigureAlerts = () => {
    const alertConfig = {
      clientId: 'enterprise-client-001', // This would come from context
      userId: 'admin-user',
      alerts: [{
        alertId: 'alert-001',
        name: 'Real-time Intelligence Alerts',
        conditions: alertSettings,
        channels: ['websocket', 'email'],
        frequency: 'immediate',
        isActive: true
      }]
    };
    
    configureAlertsMutation.mutate(alertConfig);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/20';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20';
      default: return 'bg-green-500/20 text-green-300 border-green-500/20';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'transaction': return <DollarSign className="h-4 w-4" />;
      case 'score_change': return <TrendingUp className="h-4 w-4" />;
      case 'risk_update': return <Shield className="h-4 w-4" />;
      case 'new_analysis': return <BarChart3 className="h-4 w-4" />;
      case 'anomaly_detected': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Real-time Intelligence Engine</h2>
          <p className="text-slate-400">Live blockchain intelligence with continuous monitoring and alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <span className="text-sm text-slate-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleStreaming}
            className={`border-purple-500/20 ${
              isStreaming 
                ? 'text-red-300 hover:bg-red-500/10' 
                : 'text-green-300 hover:bg-green-500/10'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Stream
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Stream
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Real-time Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-700/50 border-purple-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Live Events</p>
                <p className="text-2xl font-bold text-white">{events.length}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/50 border-orange-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Anomalies</p>
                <p className="text-2xl font-bold text-white">{anomalies.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/50 border-blue-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Monitored Wallets</p>
                <p className="text-2xl font-bold text-white">{streamingData.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/50 border-green-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">System Status</p>
                <p className="text-lg font-bold text-green-300">
                  {isConnected ? 'Operational' : 'Disconnected'}
                </p>
              </div>
              <Zap className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid grid-cols-4 bg-slate-700/50 border border-purple-500/20">
          <TabsTrigger value="events" className="data-[state=active]:bg-purple-500/20">
            <Activity className="h-4 w-4 mr-2" />
            Live Events
          </TabsTrigger>
          <TabsTrigger value="streaming" className="data-[state=active]:bg-purple-500/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Streaming Analytics
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="data-[state=active]:bg-purple-500/20">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Anomaly Detection
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-purple-500/20">
            <Bell className="h-4 w-4 mr-2" />
            Alert Configuration
          </TabsTrigger>
        </TabsList>

        {/* Live Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card className="bg-slate-700/50 border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                Real-time Event Stream
              </CardTitle>
              <CardDescription className="text-slate-400">
                Live blockchain intelligence events as they happen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    {isConnected ? 'Waiting for events...' : 'Connect to see live events'}
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.eventId} className="flex items-center gap-4 p-3 bg-slate-600/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getEventTypeIcon(event.eventType)}
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-white capitalize">
                          {event.eventType.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-slate-300">
                          Wallet: {event.walletAddress.slice(0, 8)}...{event.walletAddress.slice(-6)}
                        </div>
                        <div className="text-xs text-slate-400">
                          {event.metadata.impact}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-slate-400">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-purple-300">
                          {Math.round(event.metadata.confidence * 100)}% confidence
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Streaming Analytics Tab */}
        <TabsContent value="streaming" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <Input
              placeholder="Enter wallet address to monitor"
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="bg-slate-600 border-slate-500 text-white flex-1"
            />
            <Button 
              onClick={() => subscribeToWallet(selectedWallet)}
              disabled={!selectedWallet || !isConnected}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              Monitor Wallet
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {streamingData.map((analytics) => (
              <Card key={analytics.walletAddress} className="bg-slate-700/50 border-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-white text-sm">
                    {analytics.walletAddress.slice(0, 8)}...{analytics.walletAddress.slice(-6)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-300">
                        {analytics.realTimeScore}
                      </div>
                      <div className="text-xs text-slate-400">Current Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium text-white flex items-center justify-center gap-1">
                        {analytics.predictions.scoreDirection === 'increasing' ? (
                          <ArrowUp className="h-4 w-4 text-green-400" />
                        ) : analytics.predictions.scoreDirection === 'decreasing' ? (
                          <ArrowDown className="h-4 w-4 text-red-400" />
                        ) : (
                          <div className="w-4 h-1 bg-yellow-400 rounded" />
                        )}
                        <span className="capitalize">{analytics.predictions.scoreDirection}</span>
                      </div>
                      <div className="text-xs text-slate-400">Trend</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Transactions (24h)</span>
                      <span className="text-white">{analytics.liveActivity.transactionCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Volume Change</span>
                      <span className="text-white">{analytics.liveActivity.volumeChange.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Behavior</span>
                      <span className="text-white capitalize">{analytics.liveActivity.behaviorShift}</span>
                    </div>
                  </div>
                  
                  {analytics.liveActivity.riskIndicators.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-400 mb-2">Risk Indicators</div>
                      <div className="space-y-1">
                        {analytics.liveActivity.riskIndicators.map((risk, index) => (
                          <Badge key={index} className="bg-red-500/20 text-red-300 text-xs">
                            {risk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Anomaly Detection Tab */}
        <TabsContent value="anomalies" className="space-y-6">
          <Card className="bg-slate-700/50 border-orange-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
                Anomaly Detection & Alerts
              </CardTitle>
              <CardDescription className="text-slate-400">
                AI-powered detection of unusual wallet behavior and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    No anomalies detected
                  </div>
                ) : (
                  anomalies.map((anomaly) => (
                    <div key={anomaly.anomalyId} className="p-4 bg-slate-600/30 rounded-lg border border-orange-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity}
                          </Badge>
                          <span className="font-medium text-white capitalize">
                            {anomaly.anomalyType.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">
                          {new Date(anomaly.detectedAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-slate-300 mb-1">
                          Wallet: {anomaly.walletAddress.slice(0, 8)}...{anomaly.walletAddress.slice(-6)}
                        </div>
                        <div className="text-sm text-slate-400">{anomaly.description}</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-purple-300">
                          {Math.round(anomaly.confidence * 100)}% confidence
                        </div>
                        {anomaly.suggestedActions.length > 0 && (
                          <div className="text-xs text-slate-400">
                            Actions: {anomaly.suggestedActions.slice(0, 2).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Configuration Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-slate-700/50 border-blue-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-400" />
                Real-time Alert Configuration
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure when and how you receive real-time intelligence alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Score Change Threshold</Label>
                    <Input
                      type="number"
                      value={alertSettings.scoreThreshold}
                      onChange={(e) => setAlertSettings({
                        ...alertSettings,
                        scoreThreshold: parseInt(e.target.value)
                      })}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Volume Change Threshold ($)</Label>
                    <Input
                      type="number"
                      value={alertSettings.volumeThreshold}
                      onChange={(e) => setAlertSettings({
                        ...alertSettings,
                        volumeThreshold: parseInt(e.target.value)
                      })}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-white font-medium mb-3">Alert Triggers</div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Risk Level Changes</span>
                      <Switch 
                        checked={alertSettings.riskLevelChange}
                        onCheckedChange={(checked) => setAlertSettings({
                          ...alertSettings,
                          riskLevelChange: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Behavior Anomalies</span>
                      <Switch 
                        checked={alertSettings.behaviorAnomalies}
                        onCheckedChange={(checked) => setAlertSettings({
                          ...alertSettings,
                          behaviorAnomalies: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Market Correlations</span>
                      <Switch 
                        checked={alertSettings.marketCorrelations}
                        onCheckedChange={(checked) => setAlertSettings({
                          ...alertSettings,
                          marketCorrelations: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleConfigureAlerts}
                disabled={configureAlertsMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {configureAlertsMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Configuring...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Alerts
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}